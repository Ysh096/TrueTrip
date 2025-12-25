package com.spring.truetrip.config

import com.github.benmanes.caffeine.cache.Caffeine
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.EnableCaching
import org.springframework.cache.caffeine.CaffeineCacheManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.concurrent.TimeUnit

@Configuration
@EnableCaching
class CacheConfig {

    @Bean
    fun cacheManager(): CacheManager {
        val cacheManager = CaffeineCacheManager("googlePhotos", "googleLocations", "recommendations", "itineraries")
        cacheManager.registerCustomCache("googlePhotos", Caffeine.newBuilder()
            .expireAfterWrite(45, TimeUnit.MINUTES)
            .maximumSize(500)
            .build())
            
        cacheManager.registerCustomCache("googleLocations", Caffeine.newBuilder()
            .expireAfterWrite(45, TimeUnit.MINUTES)
            .maximumSize(500)
            .build())
            
        cacheManager.registerCustomCache("recommendations", Caffeine.newBuilder()
            .expireAfterWrite(30, TimeUnit.MINUTES)
            .maximumSize(100)
            .build())
            
        cacheManager.registerCustomCache("itineraries", Caffeine.newBuilder()
            .expireAfterWrite(30, TimeUnit.MINUTES)
            .maximumSize(100)
            .build())
            
        return cacheManager
    }
}
