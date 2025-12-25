package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.RecommendationPort
import com.spring.truetrip.domain.model.Recommendation
import com.spring.truetrip.domain.model.withPhoto
import com.spring.truetrip.dto.*
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service

@Service
class RecommendationService(
    private val recommendationPort: RecommendationPort,
    private val photoEnrichmentService: PhotoEnrichmentService
) {
    @Cacheable(cacheNames = ["recommendations"], key = "#request.destination + #request.themes.toString() + #request.travelMethod")
    fun getRecommendations(request: RecommendationRequest): List<Recommendation> {
        val baseRecommendations = recommendationPort.generateRecommendations(request)
        
        // 1. Enrich Locations (if missing or 0)
        val locationEnriched = photoEnrichmentService.enrichLocations(
            items = baseRecommendations,
            nameExtractor = { it.name },
            locationSetter = { item: Recommendation, lat: Double, lng: Double -> 
                if (item.latitude == null || item.latitude == 0.0) item.copy(latitude = lat, longitude = lng) else item 
            },
            locationContext = request.destination
        )

        // 2. Enrich Photos
        return photoEnrichmentService.enrichPhotos(
            items = locationEnriched,
            nameExtractor = { it.name },
            photoSetter = { item: Recommendation, url: String? -> if (item.imageUrl == null) item.withPhoto(url) else item },
            locationContext = request.destination
        )
    }

    @Cacheable(cacheNames = ["itineraries"], key = "#request.destination + (#request.startDate?.toString() ?: '') + (#request.endDate?.toString() ?: '') + #request.selectedPlaces.toString()")
    fun planItinerary(request: ItineraryRequest): ItineraryPlanResponse {
        val plan = recommendationPort.generateItinerary(request)
        
        val updatedDays = plan.days.map { day ->
            // 1. Enrich Locations (if missing or 0)
            val locationEnrichedPlaces = photoEnrichmentService.enrichLocations(
                items = day.places,
                nameExtractor = { it.name },
                locationSetter = { place: ItineraryPlace, lat: Double, lng: Double -> 
                    if (place.latitude == null || place.latitude == 0.0) place.copy(latitude = lat, longitude = lng) else place 
                },
                locationContext = request.destination
            )

            // 2. Enrich Photos
            val fullyEnrichedPlaces = photoEnrichmentService.enrichPhotos(
                items = locationEnrichedPlaces,
                nameExtractor = { it.name },
                photoSetter = { place: ItineraryPlace, url: String? -> if (place.imageUrl == null) place.copy(imageUrl = url) else place },
                locationContext = request.destination
            )
            day.copy(places = fullyEnrichedPlaces)
        }

        return plan.copy(days = updatedDays)
    }
}