package com.spring.truetrip.infrastructure.persistence

import com.spring.truetrip.application.port.out.LoadPlacePort
import com.spring.truetrip.domain.model.Place
import com.spring.truetrip.infrastructure.persistence.repository.PlaceRepository
import org.springframework.stereotype.Component

@Component
class PlacePersistenceAdapter(
    private val placeRepository: PlaceRepository
) : LoadPlacePort {
    override fun loadAllPlaces(): List<Place> {
        return placeRepository.findAll().map { it.toDomain() }
    }

    override fun searchPlaces(name: String): List<Place> {
        return placeRepository.findByNameContainingIgnoreCase(name).map { it.toDomain() }
    }

    override fun loadPlaceById(id: Long): Place? {
        return placeRepository.findById(id).orElse(null)?.toDomain()
    }
}
