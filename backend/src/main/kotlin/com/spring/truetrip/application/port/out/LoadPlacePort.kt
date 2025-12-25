package com.spring.truetrip.application.port.out

import com.spring.truetrip.domain.model.Place

interface LoadPlacePort {
    fun loadAllPlaces(): List<Place>
    fun searchPlaces(name: String): List<Place>
    fun loadPlaceById(id: Long): Place?
}
