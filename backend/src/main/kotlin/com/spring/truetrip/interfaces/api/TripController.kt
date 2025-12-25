package com.spring.truetrip.interfaces.api

import com.spring.truetrip.application.service.TripService
import com.spring.truetrip.domain.model.Trip
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/trips")
class TripController(
    private val tripService: TripService
) {
    @GetMapping
    fun getAllTrips(): List<Trip> {
        return tripService.getAllTrips()
    }

    @GetMapping("/{id}")
    fun getTripById(@PathVariable id: Long): Trip? {
        return tripService.getTripById(id)
    }
}
