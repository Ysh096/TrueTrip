package com.spring.truetrip.infrastructure.persistence.entity

import com.spring.truetrip.domain.model.Place
import jakarta.persistence.*

@Entity
@Table(name = "places")
class PlaceJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var name: String = "",

    @Column(nullable = false)
    var latitude: Double = 0.0,

    @Column(nullable = false)
    var longitude: Double = 0.0,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @Column(name = "namu_wiki_url")
    var namuWikiUrl: String? = null,

    @Column(nullable = false)
    var category: String = "SPOT",

    @Column(name = "image_url", length = 1000)
    var imageUrl: String? = null
) {
    fun toDomain(): Place {
        return Place(
            id = this.id,
            name = this.name,
            latitude = this.latitude,
            longitude = this.longitude,
            description = this.description,
            namuWikiUrl = this.namuWikiUrl,
            category = this.category,
            imageUrl = this.imageUrl
        )
    }

    companion object {
        fun fromDomain(place: Place): PlaceJpaEntity {
            return PlaceJpaEntity(
                id = place.id,
                name = place.name,
                latitude = place.latitude,
                longitude = place.longitude,
                description = place.description,
                namuWikiUrl = place.namuWikiUrl,
                category = place.category,
                imageUrl = place.imageUrl
            )
        }
    }
}
