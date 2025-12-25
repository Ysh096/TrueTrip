package com.spring.truetrip.dto

import java.time.LocalDate

data class RecommendationRequest(
    val destination: String,
    val startDate: LocalDate?,
    val endDate: LocalDate?,
    val ageGroup: String,
    val themes: List<String>,
    val groupSize: Int,
    val userLocale: String = "ko-KR"
)
