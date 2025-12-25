package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.LoadPhotoPort
import com.spring.truetrip.application.port.out.RecommendationPort
import com.spring.truetrip.domain.model.Recommendation
import com.spring.truetrip.dto.RecommendationRequest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.mockito.Mockito.mock
import java.time.LocalDate
import java.util.concurrent.Executor

class RecommendationServiceTest {

    @Test
    fun `추천 결과 조회 시 사진 보강 서비스가 정상 작동해야 한다`() {
        val recommendationPort: RecommendationPort = mock(RecommendationPort::class.java)
        val loadPhotoPort: LoadPhotoPort = mock(LoadPhotoPort::class.java)
        val syncExecutor = Executor { it.run() }
        val photoEnrichmentService = PhotoEnrichmentService(loadPhotoPort, syncExecutor)
        val recommendationService = RecommendationService(recommendationPort, photoEnrichmentService)

        val request = RecommendationRequest("Paris", LocalDate.now(), LocalDate.now(), "20대", listOf("힐링"), 1)
        val base = listOf(Recommendation("Eiffel", "Desc", "Reason"))
        
        `when`(recommendationPort.generateRecommendations(request)).thenReturn(base)
        // No matchers, just exact values or null
        `when`(loadPhotoPort.getPhotoUrl("Eiffel", "Paris")).thenReturn("http://photo.com")

        val result = recommendationService.getRecommendations(request)

        assertEquals("http://photo.com", result[0].imageUrl)
    }
}
