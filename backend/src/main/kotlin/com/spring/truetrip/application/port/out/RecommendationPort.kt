package com.spring.truetrip.application.port.out

import com.spring.truetrip.domain.model.Recommendation
import com.spring.truetrip.dto.RecommendationRequest

interface RecommendationPort {
    fun generateRecommendations(request: RecommendationRequest): List<Recommendation>
}
