package com.spring.truetrip.infrastructure.persistence.repository

import com.spring.truetrip.infrastructure.persistence.entity.ItineraryJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface ItineraryRepository : JpaRepository<ItineraryJpaEntity, Long>

