package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.TripPort
import com.spring.truetrip.domain.model.Trip
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class TripService(
    private val tripPort: TripPort
) {
    fun getAllTrips(): List<Trip> {
        return tripPort.findAll()
    }

    fun getTripById(id: Long): Trip? {
        return tripPort.findById(id)
    }

    @Transactional
    fun createTrip(trip: Trip): Trip {
        return tripPort.save(trip)
    }
}
