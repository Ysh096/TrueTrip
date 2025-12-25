package com.spring.truetrip.config

import com.spring.truetrip.infrastructure.persistence.entity.PlaceJpaEntity
import com.spring.truetrip.infrastructure.persistence.repository.PlaceRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class DataInitializer(
    private val placeRepository: PlaceRepository
) : CommandLineRunner {

    override fun run(vararg args: String) {
        if (placeRepository.count() == 0L) {
            val places = listOf(
                PlaceJpaEntity(
                    name = "경복궁",
                    latitude = 37.5796,
                    longitude = 126.9770,
                    description = "조선 왕조의 법궁으로, 한국의 대표적인 유적지입니다.",
                    namuWikiUrl = "https://namu.wiki/w/경복궁",
                    imageUrl = null
                ),
                PlaceJpaEntity(
                    name = "N서울타워",
                    latitude = 37.5512,
                    longitude = 126.9882,
                    description = "남산 정상에 위치한 서울의 랜드마크 타워입니다.",
                    namuWikiUrl = "https://namu.wiki/w/N서울타워",
                    imageUrl = null
                ),
                PlaceJpaEntity(
                    name = "북촌한옥마을",
                    latitude = 37.5829,
                    longitude = 126.9835,
                    description = "전통 한옥이 밀집되어 있는 서울의 유서 깊은 마을입니다.",
                    namuWikiUrl = "https://namu.wiki/w/북촌한옥마을",
                    imageUrl = null
                ),
                PlaceJpaEntity(
                    name = "명동",
                    latitude = 37.5599,
                    longitude = 126.9858,
                    description = "대한민국 최대의 쇼핑과 관광의 중심지입니다.",
                    namuWikiUrl = "https://namu.wiki/w/명동",
                    imageUrl = null
                ),
                PlaceJpaEntity(
                    name = "광장시장",
                    latitude = 37.5700,
                    longitude = 126.9990,
                    description = "맛있는 먹거리와 전통이 살아있는 서울의 대표적인 재래시장입니다.",
                    namuWikiUrl = "https://namu.wiki/w/광장시장",
                    imageUrl = null
                )
            )
            placeRepository.saveAll(places)
            println("✅ Sample places initialized.")
        }
    }
}
