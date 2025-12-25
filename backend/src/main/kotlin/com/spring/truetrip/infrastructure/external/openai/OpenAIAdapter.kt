package com.spring.truetrip.infrastructure.external.openai

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.spring.truetrip.application.port.out.RecommendationPort
import com.spring.truetrip.domain.model.Recommendation
import com.spring.truetrip.dto.*
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient

@Component
class OpenAIAdapter(
    @Value("\${openai.api-key}") private val apiKey: String
) : RecommendationPort {
    private val logger = LoggerFactory.getLogger(OpenAIAdapter::class.java)
    private val objectMapper = ObjectMapper()
        .registerKotlinModule()
        .registerModule(JavaTimeModule())
    
    private val restClient = RestClient.builder()
        .baseUrl("https://api.openai.com/v1")
        .defaultHeader("Authorization", "Bearer $apiKey")
        .defaultHeader("Content-Type", "application/json")
        .build()

    override fun generateRecommendations(request: RecommendationRequest): List<Recommendation> {
        val prompt = """
            You are an expert travel planner named 'TrueTrip AI'.
            
            User Request:
            - Destination: ${request.destination}
            - Duration: ${request.startDate} to ${request.endDate}
            - Group Size: ${request.groupSize}
            - Age Group: ${request.ageGroup}
            - Interests: ${request.themes.joinToString(", ")}

            Task:
            Recommend 5 specific travel spots in ${request.destination} that perfectly match the user's interests.
            For each place, provide a name, a short description (1 sentence), a reason why it fits their interest, and a NamuWiki URL for more information.
            IMPORTANT: Provide the response in the language and cultural context of the locale '${request.userLocale}'.
            
            Response Format (Strict JSON):
            [
              {
                "name": "Place Name",
                "description": "Short description...",
                "reason": "Why it fits...",
                "namuWikiUrl": "https://namu.wiki/w/..."
              },
              ...
            ]
            Do NOT include any markdown formatting (like ```json). Just return the raw JSON array.
        """.trimIndent()

        val requestBody = mapOf(
            "model" to "gpt-4o-mini",
            "messages" to listOf(
                mapOf("role" to "system", "content" to "You are a helpful travel assistant that outputs only JSON."),
                mapOf("role" to "user", "content" to prompt)
            ),
            "temperature" to 0.7
        )

        return try {
            val response = restClient.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map::class.java)

            @Suppress("UNCHECKED_CAST")
            val choices = response?.get("choices") as? List<Map<String, Any>>
            val content = choices?.firstOrNull()?.get("message") as? Map<String, String>
            val jsonString = content?.get("content")

            if (jsonString != null) {
                val parsed = objectMapper.readValue(jsonString, object : TypeReference<List<RecommendationJson>>() {})
                
                // Map to Domain Model
                parsed.map { Recommendation(it.name, it.description, it.reason, it.namuWikiUrl) }
            } else {
                logger.warn("OpenAI returned null content")
                emptyList()
            }
        } catch (e: Exception) {
            logger.error("Failed to fetch or parse recommendations", e)
            emptyList()
        }
    }

    override fun generateItinerary(request: ItineraryRequest): ItineraryPlanResponse {
        val prompt = """
            You are an expert travel planner named 'TrueTrip AI'.
            
            User Request:
            - Destination: ${request.destination}
            - Period: ${request.startDate} to ${request.endDate}
            - Selected Places: ${request.selectedPlaces.joinToString(", ")}

            Task:
            Create a detailed daily itinerary using the selected places.
            Constraints:
            1. Consider the efficiency of the travel route (minimize travel time between spots).
            2. Assume that the accommodation is located in a high-demand area or the city center of ${request.destination}.
            3. Group nearby places on the same day.
            4. Include 2-3 activities per day. If there are not enough selected places, you can suggest 1-2 additional relevant spots per day.
            5. Provide the response in the language and cultural context of the locale '${request.userLocale}'.

            Response Format (Strict JSON):
            {
              "days": [
                {
                  "day": 1,
                  "date": "YYYY-MM-DD",
                  "places": [
                    {
                      "name": "Place Name",
                      "timeSlot": "Morning/Afternoon/Evening",
                      "activity": "Activity description..."
                    }
                  ]
                }
              ]
            }
            Do NOT include any markdown formatting. Just return the raw JSON object.
        """.trimIndent()

        val requestBody = mapOf(
            "model" to "gpt-4o-mini",
            "messages" to listOf(
                mapOf("role" to "system", "content" to "You are a helpful travel assistant that outputs only JSON."),
                mapOf("role" to "user", "content" to prompt)
            ),
            "temperature" to 0.7
        )

        return try {
            val response = restClient.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map::class.java)

            @Suppress("UNCHECKED_CAST")
            val choices = response?.get("choices") as? List<Map<String, Any>>
            val content = choices?.firstOrNull()?.get("message") as? Map<String, String>
            val jsonString = content?.get("content")

            if (jsonString != null) {
                objectMapper.readValue(jsonString, ItineraryPlanResponse::class.java)
            } else {
                logger.warn("OpenAI returned null content for itinerary")
                ItineraryPlanResponse(emptyList())
            }
        } catch (e: Exception) {
            logger.error("Failed to fetch or parse itinerary", e)
            ItineraryPlanResponse(emptyList())
        }
    }

    private data class RecommendationJson(
        val name: String, 
        val description: String, 
        val reason: String,
        val namuWikiUrl: String? = null
    )
}