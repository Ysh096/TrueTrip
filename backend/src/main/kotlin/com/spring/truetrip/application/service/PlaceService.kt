package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.LoadPlacePort
import com.spring.truetrip.application.port.out.LoadPhotoPort
import com.spring.truetrip.domain.model.Place
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class PlaceService(
    private val loadPlacePort: LoadPlacePort,
    private val photoEnrichmentService: PhotoEnrichmentService
) {
    fun getAllPlaces(): List<Place> {
        val places = loadPlacePort.loadAllPlaces()
        return photoEnrichmentService.enrichPhotos(
            items = places,
            nameExtractor = { it.name },
            photoSetter = { place, url -> if (place.imageUrl == null) place.copy(imageUrl = url) else place }
        )
    }

    fun searchPlaces(name: String): List<Place> {
        val places = loadPlacePort.searchPlaces(name)
        return photoEnrichmentService.enrichPhotos(
            items = places,
            nameExtractor = { it.name },
            photoSetter = { place, url -> if (place.imageUrl == null) place.copy(imageUrl = url) else place }
        )
    }

    fun getPlaceById(id: Long): Place? {
        return loadPlacePort.loadPlaceById(id)?.let { place ->
            if (place.imageUrl == null) {
                // Singleton list for enrichment
                photoEnrichmentService.enrichPhotos(
                    items = listOf(place),
                    nameExtractor = { it.name },
                    photoSetter = { p, url -> p.copy(imageUrl = url) }
                ).firstOrNull()
            } else place
        }
    }
}