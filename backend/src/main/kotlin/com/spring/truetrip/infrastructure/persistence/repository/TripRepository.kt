package com.spring.truetrip.infrastructure.persistence.repository

import com.spring.truetrip.infrastructure.persistence.entity.TripJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface TripRepository : JpaRepository<TripJpaEntity, Long>
