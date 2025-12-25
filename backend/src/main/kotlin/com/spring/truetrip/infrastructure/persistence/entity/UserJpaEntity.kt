package com.spring.truetrip.infrastructure.persistence.entity

import jakarta.persistence.*

@Entity
@Table(name = "users")
class UserJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    var email: String = "",

    @Column(nullable = false)
    var name: String = ""
)
