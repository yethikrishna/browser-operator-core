// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { createLogger } from './Logger.js';
import { ChatMessageEntity } from '../ui/ChatView.js';
const logger = createLogger('AgentErrorHandler');
/**
 * Centralized utility for handling agent-level errors across the agent framework
 */
export class AgentErrorHandler {
    /**
     * Handle unknown tool requests gracefully
     */
    static handleUnknownTool(toolName, toolCallId, config) {
        const { agentName, availableTools = [], continueOnError } = config;
        logger.warn(`${agentName} requested unknown tool: ${toolName}`);
        if (!continueOnError) {
            return {
                shouldContinue: false,
                errorMessage: undefined,
                sessionMessage: undefined
            };
        }
        // Create helpful error message for the conversation
        const availableToolsList = availableTools.length > 0
            ? `Available tools: ${availableTools.join(', ')}`
            : 'No tools are currently available';
        const errorMessage = {
            entity: ChatMessageEntity.TOOL_RESULT,
            toolName,
            resultText: `Error: Tool "${toolName}" is not available. ${availableToolsList}`,
            isError: true,
            toolCallId,
            error: `Unknown tool: ${toolName}`
        };
        // Create session message for tracking
        const sessionMessage = {
            type: 'tool_result',
            content: {
                type: 'tool_result',
                toolCallId,
                toolName,
                success: false,
                result: null,
                error: `Unknown tool: ${toolName}`
            }
        };
        logger.info(`${agentName} Added unknown tool error to conversation, will continue execution`);
        return {
            shouldContinue: true,
            errorMessage,
            sessionMessage
        };
    }
    /**
     * Handle LLM response parsing errors gracefully
     */
    static handleParsingError(error, config) {
        const { agentName, continueOnError } = config;
        logger.warn(`${agentName} LLM response parsing error: ${error}`);
        if (!continueOnError) {
            return {
                shouldContinue: false,
                errorMessage: undefined,
                sessionMessage: undefined
            };
        }
        // Create user message explaining the error for the next LLM call
        const errorMessage = {
            entity: ChatMessageEntity.USER,
            text: `Your previous response could not be parsed: ${error}. Please provide a valid response by either calling one of the available tools or providing a final answer.`,
        };
        // Create session message for tracking
        const sessionMessage = {
            type: 'reasoning',
            content: {
                type: 'reasoning',
                text: `LLM response parsing failed: ${error}. Requesting retry.`
            }
        };
        logger.info(`${agentName} Added parsing error feedback to conversation, will retry`);
        return {
            shouldContinue: true,
            errorMessage,
            sessionMessage
        };
    }
    /**
     * Handle general LLM execution errors
     */
    static handleExecutionError(error, config) {
        const { agentName, continueOnError } = config;
        logger.error(`${agentName} execution error: ${error}`);
        if (!continueOnError) {
            return {
                shouldContinue: false,
                errorMessage: undefined,
                sessionMessage: undefined
            };
        }
        // Create system error message
        const errorMessage = {
            entity: ChatMessageEntity.TOOL_RESULT,
            toolName: 'system_error',
            resultText: `System error: ${error}. Please try a different approach.`,
            isError: true,
            error: error,
        };
        // Create session message for tracking
        const sessionMessage = {
            type: 'tool_result',
            content: {
                type: 'tool_result',
                toolCallId: crypto.randomUUID(),
                toolName: 'system_error',
                success: false,
                result: null,
                error: error
            }
        };
        logger.info(`${agentName} Added execution error to conversation, will continue`);
        return {
            shouldContinue: true,
            errorMessage,
            sessionMessage
        };
    }
    /**
     * Add a session message helper
     */
    static addSessionMessage(session, message) {
        if (!session) {
            return;
        }
        const fullMessage = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            ...message
        };
        session.messages.push(fullMessage);
    }
    /**
     * Execute an LLM operation with retry logic and error handling
     * This provides a clean interface for retrying LLM calls with parsing
     */
    static async executeWithRetry(operation, isValidResult, config) {
        const maxRetries = config.maxRetries ?? 5;
        const baseDelayMs = config.baseDelayMs ?? 1000;
        const maxDelayMs = config.maxDelayMs ?? 5000;
        const backoffMultiplier = config.backoffMultiplier ?? 2;
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await operation();
                // Check if the result is valid (e.g., parsed successfully)
                if (isValidResult(result)) {
                    return {
                        success: true,
                        result,
                        attemptsMade: attempt
                    };
                }
                else {
                    // Invalid result (e.g., parsing error)
                    lastError = 'Invalid result from operation';
                    logger.warn(`${config.agentName} Invalid result (attempt ${attempt}/${maxRetries})`);
                }
            }
            catch (error) {
                lastError = error instanceof Error ? error.message : String(error);
                logger.warn(`${config.agentName} Operation error (attempt ${attempt}/${maxRetries}):`, lastError);
            }
            // If not the last attempt, wait before retrying
            if (attempt < maxRetries) {
                const delay = Math.min(baseDelayMs * Math.pow(backoffMultiplier, attempt - 1), maxDelayMs);
                logger.info(`${config.agentName} Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        // All retries exhausted
        return {
            success: false,
            error: lastError || 'Unknown error',
            attemptsMade: maxRetries
        };
    }
    /**
     * Create a comprehensive error handler that combines multiple error types
     */
    static createErrorHandler(config) {
        return {
            handleUnknownTool: (toolName, toolCallId) => AgentErrorHandler.handleUnknownTool(toolName, toolCallId, config),
            handleParsingError: (error) => AgentErrorHandler.handleParsingError(error, config),
            handleExecutionError: (error) => AgentErrorHandler.handleExecutionError(error, config),
            addSessionMessage: (message) => AgentErrorHandler.addSessionMessage(config.session || null, message),
            executeWithRetry: (operation, isValidResult, retryConfig) => AgentErrorHandler.executeWithRetry(operation, isValidResult, { ...config, ...retryConfig })
        };
    }
}
//# sourceMappingURL=AgentErrorHandler.js.map