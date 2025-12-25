package com.spring.truetrip.infrastructure.persistence

import com.spring.truetrip.application.port.out.TripPort
import com.spring.truetrip.domain.model.Trip
import com.spring.truetrip.infrastructure.persistence.entity.TripJpaEntity
import com.spring.truetrip.infrastructure.persistence.repository.TripRepository
import org.springframework.stereotype.Component

@Component
class TripPersistenceAdapter(
    private val tripRepository: TripRepository
) : TripPort {
    override fun save(trip: Trip): Trip {
        val entity = TripJpaEntity(
            id = trip.id,
            title = trip.title,
            startDate = trip.startDate,
            endDate = trip.endDate,
            // User mapping omitted for simplicity now, can be added later
        )
        return tripRepository.save(entity).let { 
            Trip(it.id, it.title, it.startDate, it.endDate)
        }
    }

    override fun findById(id: Long): Trip? {
        return tripRepository.findById(id).map { 
            Trip(it.id, it.title, it.startDate, it.endDate)
        }.orElse(null)
    }

    override fun findAll(): List<Trip> {
        return tripRepository.findAll().map { 
            Trip(it.id, it.title, it.startDate, it.endDate)
        }
    }
}
