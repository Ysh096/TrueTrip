package com.spring.truetrip.infrastructure.external.google

import com.spring.truetrip.application.port.out.LoadPhotoPort
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.cache.annotation.Cacheable
import org.springframework.retry.annotation.Backoff
import org.springframework.retry.annotation.Retryable
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.util.UriComponentsBuilder

@Component
class GoogleMapsAdapter(
    @Value("\${google.map-key}") private val googleMapsKey: String
) : LoadPhotoPort {
    private val logger = LoggerFactory.getLogger(GoogleMapsAdapter::class.java)
    private val googleClient = RestClient.builder()
        .baseUrl("https://maps.googleapis.com/maps/api/place")
        .build()

    @Cacheable(cacheNames = ["googlePhotos"], key = "#placeName + (#locationContext ?: '')", unless = "#result == null")
    @Retryable(
        value = [Exception::class],
        maxAttempts = 2,
        backoff = Backoff(delay = 1000)
    )
    override fun getPhotoUrl(placeName: String, locationContext: String?): String? {
        val searchQuery = if (locationContext != null) "$locationContext $placeName" else placeName
        
        return try {
            val searchUri = UriComponentsBuilder.fromPath("/textsearch/json")
                .queryParam("query", searchQuery)
                .queryParam("key", googleMapsKey)
                .queryParam("language", "ko")
                .build()
                .toUriString()

            val searchResponse = googleClient.get()
                .uri(searchUri)
                .retrieve()
                .body(Map::class.java)

            val results = searchResponse?.get("results") as? List<*>
            val firstResult = results?.filterIsInstance<Map<String, Any>>()?.firstOrNull()
            
            val photos = firstResult?.get("photos") as? List<*>
            val firstPhoto = photos?.filterIsInstance<Map<String, Any>>()?.firstOrNull()
            val photoReference = firstPhoto?.get("photo_reference") as? String

            if (photoReference != null) {
                UriComponentsBuilder.fromUriString("https://maps.googleapis.com/maps/api/place/photo")
                    .queryParam("maxwidth", 800)
                    .queryParam("photoreference", photoReference)
                    .queryParam("key", googleMapsKey)
                    .build()
                    .toUriString()
            } else {
                logger.info("No photo reference found for: $searchQuery")
                null
            }
        } catch (e: Exception) {
            logger.error("Google Places API error for photo $searchQuery: ${e.message}")
            null
        }
    }

    @Cacheable(cacheNames = ["googleLocations"], key = "#placeName + (#locationContext ?: '')", unless = "#result == null")
    @Retryable(
        value = [Exception::class],
        maxAttempts = 2,
        backoff = Backoff(delay = 1000)
    )
    override fun getLocation(placeName: String, locationContext: String?): Pair<Double, Double>? {
        val searchQuery = if (locationContext != null) "$locationContext $placeName" else placeName
        
        return try {
            val searchUri = UriComponentsBuilder.fromPath("/textsearch/json")
                .queryParam("query", searchQuery)
                .queryParam("key", googleMapsKey)
                .queryParam("language", "ko")
                .build()
                .toUriString()

            val searchResponse = googleClient.get()
                .uri(searchUri)
                .retrieve()
                .body(Map::class.java)

            val results = searchResponse?.get("results") as? List<*>
            val firstResult = results?.filterIsInstance<Map<String, Any>>()?.firstOrNull()
            
            val geometry = firstResult?.get("geometry") as? Map<*, *>
            val location = geometry?.get("location") as? Map<*, *>
            
            val lat = location?.get("lat") as? Double
            val lng = location?.get("lng") as? Double

            if (lat != null && lng != null) {
                Pair(lat, lng)
            } else {
                logger.info("No coordinates found for: $searchQuery")
                null
            }
        } catch (e: Exception) {
            logger.error("Google Places API error for location $searchQuery: ${e.message}")
            null
        }
    }
}