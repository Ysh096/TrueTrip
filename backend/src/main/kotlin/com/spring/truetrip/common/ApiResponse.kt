package com.spring.truetrip.common

data class ApiResponse<T>(
    val status: String,
    val message: String?,
    val data: T?
) {
    companion object {
        fun <T> success(data: T): ApiResponse<T> {
            return ApiResponse("success", null, data)
        }

        fun <T> error(message: String): ApiResponse<T> {
            return ApiResponse("error", message, null)
        }
    }
}
