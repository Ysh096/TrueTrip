package com.spring.truetrip.application.service

import com.spring.truetrip.application.port.out.LoadPlacePort
import com.spring.truetrip.domain.model.Place
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.mockito.Mockito.mock

class PlaceServiceTest {

    private val loadPlacePort: LoadPlacePort = mock(LoadPlacePort::class.java)
    private val placeService = PlaceService(loadPlacePort)

    @Test
    fun `should return list of places`() {
        // Given
        val expectedPlaces = listOf(
            Place(1L, "Seoul", 37.5, 127.0, "Capital", "url"),
            Place(2L, "Busan", 35.1, 129.0, "Port", "url")
        )
        `when`(loadPlacePort.loadAllPlaces()).thenReturn(expectedPlaces)

        // When
        val result = placeService.getAllPlaces()

        // Then
        assertEquals(2, result.size)
        assertEquals("Seoul", result[0].name)
        assertEquals("Busan", result[1].name)
    }

    @Test
    fun `should search places by name`() {
        // Given
        val expectedPlaces = listOf(
            Place(1L, "Seoul Tower", 37.5, 127.0, "Tower", "url")
        )
        `when`(loadPlacePort.searchPlaces("Seoul")).thenReturn(expectedPlaces)

        // When
        val result = placeService.searchPlaces("Seoul")

        // Then
        assertEquals(1, result.size)
        assertEquals("Seoul Tower", result[0].name)
    }
}
