package com.spring.truetrip.infrastructure.persistence.repository

import com.spring.truetrip.infrastructure.persistence.entity.UserJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<UserJpaEntity, Long>
