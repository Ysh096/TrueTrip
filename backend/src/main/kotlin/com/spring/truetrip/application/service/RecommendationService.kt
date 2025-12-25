package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.RecommendationPort
import com.spring.truetrip.domain.model.Recommendation
import com.spring.truetrip.dto.RecommendationRequest
import org.springframework.stereotype.Service

@Service
class RecommendationService(
    private val recommendationPort: RecommendationPort
) {
    fun getRecommendations(request: RecommendationRequest): List<Recommendation> {
        // Here we could add domain logic (e.g., validation, filtering, caching)
        // For now, it simply orchestrates the call to the port.
        return recommendationPort.generateRecommendations(request)
    }
}
