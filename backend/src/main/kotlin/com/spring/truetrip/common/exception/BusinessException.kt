package com.spring.truetrip.common.exception

sealed class BusinessException(
    override val message: String,
    val code: String = "BUSINESS_ERROR"
) : RuntimeException(message)

class ExternalApiExceededException(message: String) : BusinessException(message, "API_LIMIT_EXCEEDED")
class InvalidRequestException(message: String) : BusinessException(message, "INVALID_REQUEST")
class ResourceNotFoundException(message: String) : BusinessException(message, "RESOURCE_NOT_FOUND")
