package com.spring.truetrip.infrastructure.persistence.entity

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "trips")
class TripJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var title: String = "",

    @Column(name = "start_date")
    var startDate: LocalDate? = null,

    @Column(name = "end_date")
    var endDate: LocalDate? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    var user: UserJpaEntity? = null
)
