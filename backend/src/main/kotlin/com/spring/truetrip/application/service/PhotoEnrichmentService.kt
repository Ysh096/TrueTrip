package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.LoadPhotoPort
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import java.util.concurrent.CompletableFuture
import java.util.concurrent.Executor

@Service
class PhotoEnrichmentService(
    private val loadPhotoPort: LoadPhotoPort,
    @Qualifier("apiExecutor") private val executor: Executor
) {
    private val logger = LoggerFactory.getLogger(PhotoEnrichmentService::class.java)

    fun <T> enrichPhotos(
        items: List<T>,
        nameExtractor: (T) -> String,
        photoSetter: (T, String?) -> T,
        locationContext: String? = null
    ): List<T> {
        val futures = items.map { item ->
            CompletableFuture.supplyAsync({
                try {
                    val name = nameExtractor(item)
                    val photoUrl = loadPhotoPort.getPhotoUrl(name, locationContext)
                    photoSetter(item, photoUrl)
                } catch (e: Exception) {
                    logger.error("Failed to enrich photo for an item, skipping. Error: ${e.message}")
                    item 
                }
            }, executor)
        }
        
        return futures.map { 
            try {
                it.join() 
            } catch (e: Exception) {
                logger.error("Future join failed during photo enrichment: ${e.message}")
                null 
            }
        }.filterNotNull()
    }

    fun <T> enrichLocations(
        items: List<T>,
        nameExtractor: (T) -> String,
        locationSetter: (T, Double, Double) -> T,
        locationContext: String? = null
    ): List<T> {
        val futures = items.map { item ->
            CompletableFuture.supplyAsync({
                try {
                    val name = nameExtractor(item)
                    val location = loadPhotoPort.getLocation(name, locationContext)
                    if (location != null) {
                        locationSetter(item, location.first, location.second)
                    } else {
                        item
                    }
                } catch (e: Exception) {
                    logger.error("Failed to enrich location for an item: ${e.message}")
                    item
                }
            }, executor)
        }
        
        return futures.map { 
            try {
                it.join() 
            } catch (e: Exception) {
                logger.error("Future join failed during location enrichment: ${e.message}")
                null 
            }
        }.filterNotNull()
    }
}