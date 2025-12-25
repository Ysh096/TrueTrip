package com.spring.truetrip.domain.model

data class Recommendation(
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

fun Recommendation.withPhoto(url: String?): Recommendation = this.copy(imageUrl = url)
