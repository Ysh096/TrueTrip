package com.spring.truetrip.domain.model

import java.time.LocalDate

data class Trip(
    val id: Long? = null,
    val title: String,
    val startDate: LocalDate?,
    val endDate: LocalDate?,
    val user: User? = null
)
