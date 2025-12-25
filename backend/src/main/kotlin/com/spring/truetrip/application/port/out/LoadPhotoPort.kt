package com.spring.truetrip.application.port.out

interface LoadPhotoPort {
    fun getPhotoUrl(placeName: String, locationContext: String? = null): String?
    fun getLocation(placeName: String, locationContext: String? = null): Pair<Double, Double>?
}
