package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.RecommendationPort
import com.spring.truetrip.domain.model.Recommendation
import com.spring.truetrip.dto.RecommendationRequest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.mockito.Mockito.mock

class RecommendationServiceTest {

    private val recommendationPort: RecommendationPort = mock(RecommendationPort::class.java)
    private val recommendationService = RecommendationService(recommendationPort)

    @Test
    fun `should return recommendations from port`() {
        // Given
        val request = RecommendationRequest(
            destination = "Paris",
            startDate = java.time.LocalDate.parse("2025-01-01"),
            endDate = java.time.LocalDate.parse("2025-01-05"),
            ageGroup = "20대",
            themes = listOf("역사"),
            groupSize = 2,
            userLocale = "ko-KR"
        )
        val expected = listOf(
            Recommendation("Eiffel Tower", "Iconic tower", "Classic must-see")
        )
        `when`(recommendationPort.generateRecommendations(request)).thenReturn(expected)

        // When
        val result = recommendationService.getRecommendations(request)

        // Then
        assertEquals(1, result.size)
        assertEquals("Eiffel Tower", result[0].name)
    }
}
