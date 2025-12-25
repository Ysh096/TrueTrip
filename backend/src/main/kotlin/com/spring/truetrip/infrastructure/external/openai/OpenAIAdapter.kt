package com.spring.truetrip.infrastructure.external.openai

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.spring.truetrip.application.port.out.RecommendationPort
import com.spring.truetrip.domain.model.Recommendation
import com.spring.truetrip.dto.*
import com.spring.truetrip.infrastructure.external.google.GoogleMapsAdapter
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.http.client.JdkClientHttpRequestFactory
import org.springframework.retry.annotation.Backoff
import org.springframework.retry.annotation.Retryable
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import java.net.http.HttpClient
import java.nio.charset.StandardCharsets
import java.time.Duration

@Component
class OpenAIAdapter(
    @Value("\${openai.api-key}") private val apiKey: String,
    private val googleMapsAdapter: GoogleMapsAdapter
) : RecommendationPort {
    private val logger = LoggerFactory.getLogger(OpenAIAdapter::class.java)
    private val objectMapper = ObjectMapper()
        .registerKotlinModule()
        .registerModule(JavaTimeModule())
    
    private val requestFactory = JdkClientHttpRequestFactory(
        HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build()
    ).apply {
        setReadTimeout(Duration.ofSeconds(60))
    }

    private val restClient = RestClient.builder()
        .requestFactory(requestFactory)
        .baseUrl("https://api.openai.com/v1")
        .defaultHeader("Authorization", "Bearer $apiKey")
        .defaultHeader("Content-Type", "application/json")
        .build()

    @Retryable(
        value = [Exception::class],
        maxAttempts = 3,
        backoff = Backoff(delay = 2000, multiplier = 2.0)
    )
    override fun generateRecommendations(request: RecommendationRequest): List<Recommendation> {
        val prompt = """
            You are a meticulous travel data researcher for 'TrueTrip AI'.
            User Request:
            - Destination: ${request.destination}
            - Travel Method: ${request.travelMethod}
            - Interests: ${request.themes.joinToString(", ")}

            Task: Quickly recommend 10 travel items.
            CRITICAL: ALL fields including 'name', 'displayName', 'description', and 'reason' MUST be in Korean (한국어).
            Even if the destination is Japan or any other country, provide the names in Korean.
            
            Rules:
            1. **Name**: Place name in Korean (E.g. "오도리 공원").
            2. **Display Name**: Place name in Korean, optionally with local name (E.g. "오도리 공원 (大通公園)").
            3. **Category**: "SPOT" or "ACCOMMODATION".
            4. **Images**: Set "imageUrl" to NULL if no high-confidence URL is found.
            
            Response Format (Strict JSON):
            [
              {
                "name": "...", "displayName": "...", "description": "...", "reason": "...", 
                "category": "...", "latitude": 0.0, "longitude": 0.0, "isFamous": false
              }
            ]
        """.trimIndent()

        val requestBody = mapOf(
            "model" to "gpt-5-mini",
            "instructions" to "You are a helpful travel assistant. You MUST output all content, including place names, strictly in Korean (한국어).",
            "input" to prompt,
            "reasoning" to mapOf("effort" to "low"),
            "max_output_tokens" to 16000
        )

        return try {
            val response = restClient.post()
                .uri("/responses")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map::class.java)

            val jsonString = extractJsonFromResponse(response)

            if (jsonString != null) {
                val parsed = objectMapper.readValue(jsonString, object : TypeReference<List<RecommendationJson>>() {})
                parsed.map { it.toDomain() }
            } else {
                logger.error("Failed to parse OpenAI response: $response")
                emptyList()
            }
        } catch (e: Exception) {
            logger.error("Error during OpenAI recommendation: ${e.message}")
            throw e
        }
    }

    @Retryable(
        value = [Exception::class],
        maxAttempts = 3,
        backoff = Backoff(delay = 2000, multiplier = 2.0)
    )
    override fun generateItinerary(request: ItineraryRequest): ItineraryPlanResponse {
        val prompt = """
            You are an expert travel planner named 'TrueTrip AI'.
            Destination: ${request.destination}
            Period: ${request.startDate} to ${request.endDate}
            Selected Places: ${request.selectedPlaces.joinToString(", ")}

            Task: Create a detailed daily itinerary.
            Constraints: 2-3 activities per day, geographic clustering, ZERO duplicates.
            Language: All activities and descriptions MUST be in Korean.
            CRITICAL: Each place MUST include 'latitude' and 'longitude'.

            Response Format (Strict JSON):
            {
              "days": [
                {
                  "day": 1, "date": "YYYY-MM-DD",
                  "places": [
                    { 
                      "name": "...", 
                      "displayName": "...", 
                      "timeSlot": "...", 
                      "activity": "...", 
                      "category": "...",
                      "latitude": 0.0,
                      "longitude": 0.0
                    }
                  ]
                }
              ]
            }
        """.trimIndent()

        val requestBody = mapOf(
            "model" to "gpt-5-mini",
            "instructions" to "You are a travel assistant. Output raw JSON only. ALL names, activities, and descriptions MUST be in Korean (한국어).",
            "input" to prompt,
            "reasoning" to mapOf("effort" to "low"),
            "max_output_tokens" to 16000
        )

        return try {
            val response = restClient.post()
                .uri("/responses")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map::class.java)

            val jsonString = extractJsonFromResponse(response)
            if (jsonString != null) {
                objectMapper.readValue(jsonString, ItineraryPlanResponse::class.java)
            } else {
                logger.error("Failed to parse OpenAI itinerary response: $response")
                ItineraryPlanResponse(emptyList())
            }
        } catch (e: Exception) {
            logger.error("Error during OpenAI itinerary generation: ${e.message}")
            throw e
        }
    }

    private fun extractJsonFromResponse(response: Map<*, *>?): String? {
        return (response?.get("output") as? List<*>)
            ?.filterIsInstance<Map<String, Any>>()
            ?.find { it["type"] == "message" }
            ?.let { it["content"] as? List<*> }
            ?.filterIsInstance<Map<String, Any>>()
            ?.find { it["type"] == "output_text" }
            ?.let { it["text"] as? String }
            ?.let { cleanJson(it) }
    }

    private fun cleanJson(raw: String): String {
        val trimmed = raw.trim()
        if (trimmed.isEmpty()) return ""
        return trimmed
            .removePrefix("```json")
            .removePrefix("```")
            .removeSuffix("```")
            .trim()
    }

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    private data class RecommendationJson(
        val name: String,
        val displayName: String? = null,
        val description: String,
        val reason: String,
        val category: String? = "SPOT",
        val imageUrl: String? = null,
        val isFamous: Boolean,
        val wikiKeyword: String? = null,
        val latitude: Double? = null,
        val longitude: Double? = null
    ) {
        fun toDomain(): Recommendation {
            val wikiUrl = if (isFamous && wikiKeyword != null) {
                "https://namu.wiki/Go?q=${java.net.URLEncoder.encode(wikiKeyword, StandardCharsets.UTF_8.name())}"
            } else null

            return Recommendation(
                name = name,
                description = description,
                reason = reason,
                namuWikiUrl = wikiUrl,
                latitude = latitude,
                longitude = longitude,
                category = category ?: "SPOT",
                imageUrl = imageUrl,
                displayName = displayName ?: name
            )
        }
    }
}
