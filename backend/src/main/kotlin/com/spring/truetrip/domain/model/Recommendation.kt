package com.spring.truetrip.domain.model

data class Recommendation(
    val name: String,
    val description: String,
    val reason: String,
    val namuWikiUrl: String? = null
)
