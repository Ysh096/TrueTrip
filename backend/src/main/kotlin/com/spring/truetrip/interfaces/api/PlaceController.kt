package com.spring.truetrip.interfaces.api

import com.spring.truetrip.application.service.PlaceService
import com.spring.truetrip.domain.model.Place
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/places")
class PlaceController(
    private val placeService: PlaceService
) {
    @GetMapping
    fun getAllPlaces(): List<Place> {
        return placeService.getAllPlaces()
    }

    @GetMapping("/search")
    fun searchPlaces(@RequestParam name: String): List<Place> {
        return placeService.searchPlaces(name)
    }

    @GetMapping("/{id}")
    fun getPlaceById(@PathVariable id: Long): Place? {
        return placeService.getPlaceById(id)
    }
}
