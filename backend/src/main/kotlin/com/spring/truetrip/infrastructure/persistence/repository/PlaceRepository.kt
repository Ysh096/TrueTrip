package com.spring.truetrip.infrastructure.persistence.repository

import com.spring.truetrip.infrastructure.persistence.entity.PlaceJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface PlaceRepository : JpaRepository<PlaceJpaEntity, Long> {
    fun findByNameContainingIgnoreCase(name: String): List<PlaceJpaEntity>
}
