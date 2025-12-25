package com.spring.truetrip.interfaces.api

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class PingController {
    @GetMapping("/ping")
    fun ping(): Map<String, String> {
        return mapOf("message" to "Hello from TrueTrip Backend!")
    }
}
