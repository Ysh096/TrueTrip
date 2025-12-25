package com.spring.truetrip.interfaces.api

import com.spring.truetrip.common.ApiResponse
import com.spring.truetrip.common.exception.BusinessException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(BusinessException::class)
    fun handleBusinessException(e: BusinessException): ApiResponse<Nothing?> {
        logger.warn("Business exception: ${e.message}")
        return ApiResponse.error(e.message)
    }

    @ExceptionHandler(Exception::class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    fun handleGeneralException(e: Exception): ApiResponse<Nothing?> {
        logger.error("Unexpected error occurred", e)
        return ApiResponse.error("서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    }
}
