package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.LoadPlacePort
import com.spring.truetrip.domain.model.Place
import org.springframework.stereotype.Service

@Service
class PlaceService(
    private val loadPlacePort: LoadPlacePort
) {
    fun getAllPlaces(): List<Place> {
        return loadPlacePort.loadAllPlaces()
    }

    fun searchPlaces(name: String): List<Place> {
        return loadPlacePort.searchPlaces(name)
    }

    fun getPlaceById(id: Long): Place? {
        return loadPlacePort.loadPlaceById(id)
    }
}
