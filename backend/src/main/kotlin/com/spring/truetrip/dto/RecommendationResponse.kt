package com.spring.truetrip.dto

data class RecommendationResponse(
    val name: String,
    val description: String,
    val reason: String,
    val namuWikiUrl: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val category: String = "SPOT",
    val imageUrl: String? = null,
    val displayName: String? = null
)
