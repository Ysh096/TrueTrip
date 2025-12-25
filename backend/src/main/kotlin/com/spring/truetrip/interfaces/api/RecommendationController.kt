package com.spring.truetrip.interfaces.api

import com.spring.truetrip.application.service.RecommendationService
import com.spring.truetrip.common.ApiResponse
import com.spring.truetrip.dto.*
import org.springframework.web.bind.annotation.*

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
                reason = it.reason,
                namuWikiUrl = it.namuWikiUrl
            )
        }
        
        return ApiResponse.success(responseDtos)
    }

    @PostMapping("/plan")
    fun planItinerary(@RequestBody request: ItineraryRequest): ApiResponse<ItineraryPlanResponse> {
        val plan = recommendationService.planItinerary(request)
        return ApiResponse.success(plan)
    }
}
