package com.spring.truetrip.application.port.out

import com.spring.truetrip.domain.model.Trip

interface TripPort {
    fun save(trip: Trip): Trip
    fun findById(id: Long): Trip?
    fun findAll(): List<Trip>
}
