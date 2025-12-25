package com.spring.truetrip

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.retry.annotation.EnableRetry

@SpringBootApplication
@EnableRetry
class TrueTripApplication

fun main(args: Array<String>) {
    runApplication<TrueTripApplication>(*args)
}
