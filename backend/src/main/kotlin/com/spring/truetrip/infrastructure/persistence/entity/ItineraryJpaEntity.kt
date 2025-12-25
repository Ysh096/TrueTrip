package com.spring.truetrip.infrastructure.persistence.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "itineraries")
class ItineraryJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    var trip: TripJpaEntity? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    var place: PlaceJpaEntity? = null,

    @Column(nullable = false)
    var sequence: Int = 0,

    @Column(name = "visit_time")
    var visitTime: LocalDateTime? = null
)
