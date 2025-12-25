package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.RecommendationPort
import com.spring.truetrip.domain.model.Recommendation
import com.spring.truetrip.dto.*
import org.springframework.stereotype.Service

@Service
class RecommendationService(
    private val recommendationPort: RecommendationPort
) {
    fun getRecommendations(request: RecommendationRequest): List<Recommendation> {
        return recommendationPort.generateRecommendations(request)
    }

    fun planItinerary(request: ItineraryRequest): ItineraryPlanResponse {
        return recommendationPort.generateItinerary(request)
    }
}
