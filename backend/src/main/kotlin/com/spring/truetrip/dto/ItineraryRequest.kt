package com.spring.truetrip.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.time.LocalDate

data class ItineraryRequest(
    val destination: String,
    val startDate: LocalDate?,
    val endDate: LocalDate?,
    val selectedPlaces: List<String>,
    val userLocale: String = "ko-KR"
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class ItineraryPlanResponse(
    val days: List<DayPlan>
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class DayPlan(
    val day: Int,
    val date: String?,
    val places: List<ItineraryPlace>
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class ItineraryPlace(
    val name: String,
    val timeSlot: String,
    val activity: String,
    val category: String? = "SPOT",
    val latitude: Double? = null,
    val longitude: Double? = null,
    val imageUrl: String? = null,
    val displayName: String? = null
)
