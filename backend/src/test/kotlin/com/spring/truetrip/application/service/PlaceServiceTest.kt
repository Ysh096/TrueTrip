package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.LoadPhotoPort
import com.spring.truetrip.application.port.out.LoadPlacePort
import com.spring.truetrip.domain.model.Place
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.mockito.Mockito.mock
import java.util.concurrent.Executor

class PlaceServiceTest {

    @Test
    fun `모든 장소 조회 시 사진 보강 서비스가 정상 작동해야 한다`() {
        val loadPlacePort: LoadPlacePort = mock(LoadPlacePort::class.java)
        val loadPhotoPort: LoadPhotoPort = mock(LoadPhotoPort::class.java)
        val syncExecutor = Executor { it.run() }
        val photoEnrichmentService = PhotoEnrichmentService(loadPhotoPort, syncExecutor)
        val placeService = PlaceService(loadPlacePort, photoEnrichmentService)

        val places = listOf(Place(id = 1L, name = "Gyeongbok", latitude = 37.0, longitude = 127.0, description = "Palace", namuWikiUrl = null))
        
        `when`(loadPlacePort.loadAllPlaces()).thenReturn(places)
        // Exact value matching without matchers
        `when`(loadPhotoPort.getPhotoUrl("Gyeongbok", null)).thenReturn("http://photo.com")

        val result = placeService.getAllPlaces()

        assertEquals("http://photo.com", result[0].imageUrl)
    }
}
