package com.spring.truetrip.dto

data class RecommendationResponse(
    val name: String,
    val description: String,
    val reason: String,
    val namuWikiUrl: String? = null
)
