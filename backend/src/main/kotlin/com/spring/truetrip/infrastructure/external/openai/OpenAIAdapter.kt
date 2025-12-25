package com.spring.truetrip.infrastructure.external.openai

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.spring.truetrip.application.port.out.RecommendationPort
import com.spring.truetrip.domain.model.Recommendation
import com.spring.truetrip.dto.RecommendationRequest
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
            For each place, provide a name, a short description (1 sentence), and a reason why it fits their interest.
            IMPORTANT: Provide the response in the language and cultural context of the locale '${request.userLocale}'.
            
            Response Format (Strict JSON):
            [
              {
                "name": "Place Name",
                "description": "Short description...",
                "reason": "Why it fits..."
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
                // Internal DTO for parsing
                data class OpenAIRecommendationResponse(
                    val name: String, 
                    val description: String, 
                    val reason: String
                )
                
                val parsed = objectMapper.readValue(jsonString, object : TypeReference<List<OpenAIRecommendationResponse>>() {})
                
                // Map to Domain Model
                parsed.map { Recommendation(it.name, it.description, it.reason) }
            } else {
                logger.warn("OpenAI returned null content")
                emptyList()
            }
        } catch (e: Exception) {
            logger.error("Failed to fetch or parse recommendations", e)
            emptyList()
        }
    }
}
