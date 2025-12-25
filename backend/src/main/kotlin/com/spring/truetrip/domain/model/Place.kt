package com.spring.truetrip.domain.model

data class Place(
    val id: Long? = null,
    val name: String,
    val latitude: Double,
    val longitude: Double,
    val description: String?,
    val namuWikiUrl: String?
)
