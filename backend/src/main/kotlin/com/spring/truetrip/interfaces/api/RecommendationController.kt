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
        if (request.destination.isBlank()) return ApiResponse.error("목적지를 입력해주세요.")
        if (request.themes.isEmpty()) return ApiResponse.error("최소 하나 이상의 테마를 선택해주세요.")

        val domainRecommendations = recommendationService.getRecommendations(request)
        
        // Map Domain Model to Response DTO
        val responseDtos = domainRecommendations.map { 
            RecommendationResponse(
                name = it.name,
                description = it.description,
                reason = it.reason,
                namuWikiUrl = it.namuWikiUrl,
                latitude = it.latitude,
                longitude = it.longitude,
                category = it.category,
                imageUrl = it.imageUrl
            )
        }
        
        return ApiResponse.success(responseDtos)
    }

    @PostMapping("/plan")
    fun planItinerary(@RequestBody request: ItineraryRequest): ApiResponse<ItineraryPlanResponse> {
        if (request.destination.isBlank()) return ApiResponse.error("목적지를 입력해주세요.")
        if (request.selectedPlaces.isEmpty()) return ApiResponse.error("일정에 포함할 장소를 최소 하나 이상 선택해주세요.")

        val plan = recommendationService.planItinerary(request)
        return ApiResponse.success(plan)
    }
}
