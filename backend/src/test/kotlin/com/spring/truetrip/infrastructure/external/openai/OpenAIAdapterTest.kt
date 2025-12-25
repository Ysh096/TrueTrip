package com.spring.truetrip.infrastructure.external.openai

import com.spring.truetrip.infrastructure.external.google.GoogleMapsAdapter
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import java.lang.reflect.Method

class OpenAIAdapterTest {

    private val googleMapsAdapter = mock(GoogleMapsAdapter::class.java)
    private val adapter = OpenAIAdapter("fake-key", googleMapsAdapter)

    @Test
    fun `마크다운이 포함된 OpenAI 응답을 깨끗하게 파싱해야 한다`() {
        // Given
        val rawJson = "  ```json\n[{\"name\": \"Test\"}]\n```  "
        
        // Use reflection to access private cleanJson
        val method: Method = OpenAIAdapter::class.java.getDeclaredMethod("cleanJson", String::class.java)
        method.isAccessible = true
        
        // When
        val result = method.invoke(adapter, rawJson) as String

        // Then
        assertEquals("[{\"name\": \"Test\"}]", result)
    }

    @Test
    fun `중첩된 응답 구조에서 JSON 텍스트를 정확히 추출해야 한다`() {
        // Given
        val response = mapOf(
            "output" to listOf(
                mapOf(
                    "type" to "message",
                    "content" to listOf(
                        mapOf(
                            "type" to "output_text",
                            "text" to "{\"key\": \"value\"}"
                        )
                    )
                )
            )
        )

        val method: Method = OpenAIAdapter::class.java.getDeclaredMethod("extractJsonFromResponse", Map::class.java)
        method.isAccessible = true

        // When
        val result = method.invoke(adapter, response) as String?

        // Then
        assertEquals("{\"key\": \"value\"}", result)
    }
}
