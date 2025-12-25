package com.spring.truetrip.domain.model

import java.time.LocalDateTime

data class Itinerary(
    val id: Long? = null,
    val tripId: Long,
    val place: Place,
    val sequence: Int,
    val visitTime: LocalDateTime? = null
)
