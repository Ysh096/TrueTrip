package com.spring.truetrip.interfaces.api

import com.spring.truetrip.application.service.PlaceService
import com.spring.truetrip.common.ApiResponse
import com.spring.truetrip.domain.model.Place
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/places")
class PlaceController(
    private val placeService: PlaceService
) {
    @GetMapping
    fun getAllPlaces(): ApiResponse<List<Place>> {
        return ApiResponse.success(placeService.getAllPlaces())
    }

    @GetMapping("/search")
    fun searchPlaces(@RequestParam name: String): ApiResponse<List<Place>> {
        return ApiResponse.success(placeService.searchPlaces(name))
    }

    @GetMapping("/{id}")
    fun getPlaceById(@PathVariable id: Long): ApiResponse<Place?> {
        return ApiResponse.success(placeService.getPlaceById(id))
    }
}
