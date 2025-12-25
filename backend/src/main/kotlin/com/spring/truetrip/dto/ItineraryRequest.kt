package com.spring.truetrip.dto

import java.time.LocalDate

data class ItineraryRequest(
    val destination: String,
    val startDate: LocalDate?,
    val endDate: LocalDate?,
    val selectedPlaces: List<String>,
    val userLocale: String = "ko-KR"
)

data class ItineraryPlanResponse(
    val days: List<DayPlan>
)

data class DayPlan(
    val day: Int,
    val date: String?,
    val places: List<ItineraryPlace>
)

data class ItineraryPlace(
    val name: String,
    val timeSlot: String,
    val activity: String
)
