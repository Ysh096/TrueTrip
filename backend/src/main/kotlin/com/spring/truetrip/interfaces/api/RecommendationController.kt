package com.spring.truetrip.interfaces.api

import com.spring.truetrip.application.service.RecommendationService
import com.spring.truetrip.common.ApiResponse
import com.spring.truetrip.dto.RecommendationRequest
import com.spring.truetrip.dto.RecommendationResponse
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/recommendations")
class RecommendationController(
    private val recommendationService: RecommendationService
) {
    @PostMapping
    fun getRecommendations(@RequestBody request: RecommendationRequest): ApiResponse<List<RecommendationResponse>> {
        val domainRecommendations = recommendationService.getRecommendations(request)
        
        // Map Domain Model to Response DTO
        val responseDtos = domainRecommendations.map { 
            RecommendationResponse(
                name = it.name,
                description = it.description,
                reason = it.reason
            )
        }
        
        return ApiResponse.success(responseDtos)
    }
}
