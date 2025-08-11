// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { NavigateURLTool } from '../../tools/Tools.js';
import { createLogger } from '../../core/Logger.js';
import { SanitizationUtils } from '../utils/SanitizationUtils.js';
import { ErrorHandlingUtils } from '../utils/ErrorHandlingUtils.js';
import { createTracingProvider } from '../../tracing/TracingConfig.js';
const logger = createLogger('GenericToolEvaluator');
/**
 * Generic evaluator that can test any tool without needing specific adapters
 */
export class GenericToolEvaluator {
    constructor(config, hooks) {
        this.config = config;
        this.navigateTool = new NavigateURLTool();
        this.hooks = hooks;
        this.tracingProvider = createTracingProvider();
    }
    /**
     * Run a test case for any tool
     */
    async runTest(testCase, tool, tracingContext) {
        const startTime = Date.now();
        // Use withErrorHandling wrapper for better error management
        return await ErrorHandlingUtils.withErrorHandling(async () => {
            logger.info(`Starting test: ${testCase.name}`);
            logger.info(`Tool: ${testCase.tool}, URL: ${testCase.url}`);
            // 1. Navigate to the URL if provided
            if (testCase.url) {
                // Call beforeNavigation hook
                if (this.hooks?.beforeNavigation) {
                    logger.info('Calling beforeNavigation hook');
                    await this.hooks.beforeNavigation(testCase);
                }
                // Create navigation span
                const navSpanId = `nav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const navStartTime = new Date();
                if (tracingContext) {
                    try {
                        await this.tracingProvider.createObservation({
                            id: navSpanId,
                            name: 'Navigation',
                            type: 'span',
                            startTime: navStartTime,
                            input: { url: testCase.url },
                            metadata: {
                                phase: 'navigation',
                                url: testCase.url,
                                testId: testCase.id || testCase.name
                            }
                        }, tracingContext.traceId);
                    }
                    catch (error) {
                        logger.warn('Failed to create navigation span:', error);
                    }
                }
                const navResult = await this.navigateTool.execute({ url: testCase.url, reasoning: `Navigate to ${testCase.url} for test case ${testCase.name}` });
                // Update navigation span
                if (tracingContext) {
                    try {
                        await this.tracingProvider.updateObservation(navSpanId, {
                            endTime: new Date(),
                            output: navResult,
                            error: (navResult && typeof navResult === 'object' && 'error' in navResult) ? String(navResult.error) : undefined
                        });
                    }
                    catch (error) {
                        logger.warn('Failed to update navigation span:', error);
                    }
                }
                if ('error' in navResult) {
                    throw new Error(`Navigation failed: ${navResult.error}`);
                }
                // Wait for page to stabilize
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            // Call beforeToolExecution hook (after navigation, before tool execution)
            if (this.hooks?.beforeToolExecution) {
                logger.info('Calling beforeToolExecution hook');
                await this.hooks.beforeToolExecution(testCase, tool);
            }
            // 2. Execute the tool with the input - wrapped with error handling
            const toolSpanId = `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const toolStartTime = new Date();
            if (tracingContext) {
                try {
                    await this.tracingProvider.createObservation({
                        id: toolSpanId,
                        name: `Tool Execution: ${testCase.tool}`,
                        type: 'span',
                        startTime: toolStartTime,
                        input: testCase.input,
                        metadata: {
                            phase: 'tool-execution',
                            tool: testCase.tool,
                            testId: testCase.id || testCase.name
                        }
                    }, tracingContext.traceId);
                }
                catch (error) {
                    logger.warn('Failed to create tool execution span:', error);
                }
            }
            const toolResult = await ErrorHandlingUtils.withErrorHandling(async () => {
                return await tool.execute(testCase.input);
            }, (error) => ({ error: ErrorHandlingUtils.formatUserFriendlyError(error, 'Tool execution failed') }), logger, `GenericToolEvaluator.toolExecution:${testCase.tool}`);
            // Update tool execution span
            if (tracingContext) {
                try {
                    await this.tracingProvider.updateObservation(toolSpanId, {
                        endTime: new Date(),
                        output: toolResult,
                        error: (toolResult && typeof toolResult === 'object' && 'error' in toolResult) ? String(toolResult.error) : undefined
                    });
                }
                catch (error) {
                    logger.warn('Failed to update tool execution span:', error);
                }
            }
            // Call afterToolExecution hook
            if (this.hooks?.afterToolExecution) {
                logger.info('Calling afterToolExecution hook');
                await this.hooks.afterToolExecution(testCase, tool, toolResult);
            }
            // 3. Extract success/failure and error from tool result
            const success = this.isSuccessfulResult(toolResult);
            const error = this.extractError(toolResult);
            const result = {
                testId: testCase.id,
                status: success ? 'passed' : 'failed',
                output: toolResult, // Use raw tool result directly
                error: error ? ErrorHandlingUtils.formatUserFriendlyError(error, undefined) : undefined,
                duration: Date.now() - startTime,
                timestamp: Date.now(),
                validation: {
                    passed: success,
                    summary: success
                        ? `Successfully executed ${testCase.tool}`
                        : `${testCase.tool} execution failed: ${error}`,
                },
                // Store full tool response for debugging and display
                rawResponse: toolResult,
            };
            // Call beforeEvaluation hook
            if (this.hooks?.beforeEvaluation) {
                logger.info('Calling beforeEvaluation hook');
                await this.hooks.beforeEvaluation(testCase, result);
            }
            return result;
        }, (error) => ErrorHandlingUtils.createTestExecutionError(error, testCase.id, startTime), logger, 'GenericToolEvaluator.runTest');
    }
    /**
     * Run multiple tests sequentially
     */
    async runBatch(testCases, toolInstances) {
        const results = [];
        for (const testCase of testCases) {
            logger.info(`Running test ${results.length + 1}/${testCases.length}`);
            const tool = toolInstances.get(testCase.tool);
            if (!tool) {
                throw new Error(`Tool instance not provided for: ${testCase.tool}`);
            }
            const result = await this.runTestWithRetries(testCase, tool);
            results.push(result);
            // Small delay between tests to avoid overwhelming the system
            if (results.length < testCases.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        return results;
    }
    /**
     * Run a test with retry logic
     */
    async runTestWithRetries(testCase, tool, tracingContext) {
        const maxRetries = testCase.metadata?.retries || this.config.retries || 1;
        let lastResult = null;
        let lastError = null;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            if (attempt > 0) {
                logger.info(`Retry ${attempt}/${maxRetries} for ${testCase.id}`);
                await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
            }
            lastResult = await this.runTest(testCase, tool, tracingContext);
            // Only retry on errors, not on test failures
            if (lastResult.status !== 'error') {
                lastResult.retryCount = attempt;
                return lastResult;
            }
            // Check if the error is retryable
            lastError = lastResult.error || lastResult.rawResponse;
            if (!ErrorHandlingUtils.isRetryableError(lastError)) {
                logger.info(`Error is not retryable, stopping retries for ${testCase.id}`);
                lastResult.retryCount = attempt;
                return lastResult;
            }
        }
        // Return the last error result
        if (!lastResult) {
            const errorResult = ErrorHandlingUtils.createTestExecutionError('No test execution attempted', testCase.id, Date.now());
            errorResult.retryCount = maxRetries;
            return errorResult;
        }
        lastResult.retryCount = maxRetries;
        return lastResult;
    }
    /**
     * Determine if a tool result indicates success
     */
    isSuccessfulResult(result) {
        // Null/undefined is failure
        if (result === null || result === undefined) {
            return false;
        }
        // Check for explicit success/failure indicators
        if (typeof result === 'object') {
            if ('success' in result)
                return Boolean(result.success);
            if ('error' in result)
                return !result.error;
            if ('failed' in result)
                return !result.failed;
        }
        // Anything else (non-null string, number, object with content) is success
        return true;
    }
    /**
     * Extract error message from any tool result
     */
    extractError(result) {
        if (typeof result === 'object' && result !== null) {
            if ('error' in result && result.error) {
                return String(result.error);
            }
            if ('message' in result && result.message) {
                return String(result.message);
            }
            if ('reason' in result && result.reason) {
                return String(result.reason);
            }
        }
        return undefined;
    }
    /**
     * Sanitize output for snapshot comparison (static method for reusability)
     * @deprecated Use SanitizationUtils.sanitizeOutput() instead
     */
    static sanitizeOutput(output) {
        return SanitizationUtils.sanitizeOutput(output);
    }
}
//# sourceMappingURL=GenericToolEvaluator.js.map