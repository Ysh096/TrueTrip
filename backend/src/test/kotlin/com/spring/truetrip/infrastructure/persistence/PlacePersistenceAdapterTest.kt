package com.spring.truetrip.infrastructure.persistence

import com.spring.truetrip.domain.model.Place
import com.spring.truetrip.infrastructure.persistence.entity.PlaceJpaEntity
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class PlacePersistenceAdapterTest {

    @Test
    fun `엔티티에서 도메인 모델로 정확히 변환되어야 한다`() {
        // Given
        val entity = PlaceJpaEntity(
            id = 1L,
            name = "Test Place",
            latitude = 37.0,
            longitude = 127.0,
            description = "Desc",
            namuWikiUrl = "Wiki",
            category = "SPOT",
            imageUrl = "image.jpg"
        )

        // When
        val domain = entity.toDomain()

        // Then
        assertEquals(entity.id, domain.id)
        assertEquals(entity.name, domain.name)
        assertEquals(entity.category, domain.category)
        assertEquals(entity.imageUrl, domain.imageUrl)
    }

    @Test
    fun `도메인 모델에서 엔티티로 정확히 변환되어야 한다`() {
        // Given
        val domain = Place(
            id = 1L,
            name = "Test Place",
            latitude = 37.0,
            longitude = 127.0,
            description = "Desc",
            namuWikiUrl = "Wiki",
            category = "ACCOMMODATION",
            imageUrl = "image.jpg"
        )

        // When
        val entity = PlaceJpaEntity.fromDomain(domain)

        // Then
        assertEquals(domain.id, entity.id)
        assertEquals(domain.name, entity.name)
        assertEquals(domain.category, entity.category)
        assertEquals(domain.imageUrl, entity.imageUrl)
    }
}
