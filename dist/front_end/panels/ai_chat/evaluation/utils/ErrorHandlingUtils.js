// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Utility class for standardized error handling across the evaluation framework
 */
export class ErrorHandlingUtils {
    /**
     * Create a standardized LLM evaluation error response
     */
    static createLLMEvaluationError(error, context) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            passed: false,
            score: 0,
            issues: [`Evaluation failed: ${errorMessage}`],
            explanation: 'Failed to evaluate output due to internal error',
            confidence: 0
        };
    }
    /**
     * Create a standardized test execution error response
     */
    static createTestExecutionError(error, testId, startTime) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            testId,
            status: 'error',
            error: errorMessage,
            duration: Date.now() - startTime,
            timestamp: Date.now(),
        };
    }
    /**
     * Wrap async operations with standardized error handling
     */
    static async withErrorHandling(operation, errorBuilder, logger, context) {
        try {
            return await operation();
        }
        catch (error) {
            logger.error(`[${context}] Operation failed:`, error instanceof Error ? error.message : String(error));
            return errorBuilder(error);
        }
    }
    /**
     * Format error for user display (removes stack traces, technical details)
     */
    static formatUserFriendlyError(error, context) {
        // Extract error message inline
        let message;
        if (error instanceof Error) {
            message = error.message;
        }
        else if (typeof error === 'string') {
            message = error;
        }
        else if (error && typeof error === 'object') {
            const errorObj = error;
            if (errorObj.message && typeof errorObj.message === 'string') {
                message = errorObj.message;
            }
            else if (errorObj.error && typeof errorObj.error === 'string') {
                message = errorObj.error;
            }
            else {
                message = String(error);
            }
        }
        else {
            message = String(error);
        }
        // Clean up technical jargon for user-facing errors
        const cleanMessage = message
            .replace(/TypeError: /g, '')
            .replace(/ReferenceError: /g, '')
            .replace(/at Object\.\w+/g, '')
            .replace(/\s+at\s+.*/g, '') // Remove stack trace info
            .trim();
        if (context) {
            return `${context}: ${cleanMessage}`;
        }
        return cleanMessage;
    }
    /**
     * Check if error is retryable based on error type
     */
    static isRetryableError(error) {
        // Extract error message inline
        let message;
        if (error instanceof Error) {
            message = error.message;
        }
        else if (typeof error === 'string') {
            message = error;
        }
        else if (error && typeof error === 'object') {
            const errorObj = error;
            if (errorObj.message && typeof errorObj.message === 'string') {
                message = errorObj.message;
            }
            else if (errorObj.error && typeof errorObj.error === 'string') {
                message = errorObj.error;
            }
            else {
                message = String(error);
            }
        }
        else {
            message = String(error);
        }
        const lowerMessage = message.toLowerCase();
        // Network and temporary failures are usually retryable
        if (lowerMessage.includes('timeout') ||
            lowerMessage.includes('network') ||
            lowerMessage.includes('connection') ||
            lowerMessage.includes('rate limit') ||
            lowerMessage.includes('service unavailable') ||
            lowerMessage.includes('502') ||
            lowerMessage.includes('503') ||
            lowerMessage.includes('504')) {
            return true;
        }
        // Authentication and validation errors are not retryable
        if (lowerMessage.includes('unauthorized') ||
            lowerMessage.includes('forbidden') ||
            lowerMessage.includes('invalid') ||
            lowerMessage.includes('malformed') ||
            lowerMessage.includes('parse error')) {
            return false;
        }
        return false;
    }
}
//# sourceMappingURL=ErrorHandlingUtils.js.map