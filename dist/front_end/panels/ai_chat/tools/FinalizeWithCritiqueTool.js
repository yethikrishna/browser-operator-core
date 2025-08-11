// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { AgentService } from '../core/AgentService.js';
import { ChatMessageEntity } from '../ui/ChatView.js';
import { createLogger } from '../core/Logger.js';
const logger = createLogger('FinalizeWithCritiqueTool');
import { CritiqueTool } from './CritiqueTool.js';
/**
 * Helper function to find the last message of a specific entity type
 */
function findLastMessage(messages, entityType) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        logger.warn('findLastMessage: Empty or invalid messages array');
        return undefined;
    }
    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message && message.entity === entityType) {
            return message;
        }
    }
    logger.warn(`findLastMessage: No message found with entity type ${entityType}`);
    return undefined;
}
/**
 * Tool that finalizes an answer after evaluating it with the critique agent
 */
export class FinalizeWithCritiqueTool {
    constructor() {
        this.name = 'finalize_with_critique';
        this.description = 'Submit a final answer that will be evaluated against requirements before acceptance. ' +
            'If the answer does not meet requirements, feedback will be provided for improvement.';
        this.schema = {
            type: 'object',
            properties: {
                answer: {
                    type: 'string',
                    description: 'The proposed final answer to the user\'s question'
                }
            },
            required: ['answer']
        };
    }
    /**
     * Execute the finalize with critique tool
     */
    async execute(args) {
        logger.info('Executing with answer:', args.answer.substring(0, 100) + '...');
        try {
            // Get the current state from AgentService
            const agentService = AgentService.getInstance();
            const state = agentService.getState();
            const apiKey = agentService.getApiKey();
            if (!state?.messages || state.messages.length === 0) {
                throw new Error('Invalid state or empty message history');
            }
            if (!apiKey) {
                // If no API key, just accept the answer without critique
                logger.info('No API key available, skipping critique');
                const result = {
                    success: true,
                    accepted: true,
                    satisfiesCriteria: true,
                    answer: args.answer
                };
                logger.info('Returning result:', JSON.stringify(result));
                return result;
            }
            // Find the last user message
            const userMessage = findLastMessage(state.messages, ChatMessageEntity.USER);
            if (!userMessage?.text) {
                throw new Error('Could not find user message to critique against');
            }
            // Create and execute critique agent
            const critiqueTool = new CritiqueTool();
            const critiqueResult = await critiqueTool.execute({
                userInput: userMessage.text,
                finalResponse: args.answer,
                reasoning: 'Validating if the response meets all user requirements'
            });
            logger.info('Critique result:', critiqueResult);
            if (!critiqueResult.success) {
                const result = {
                    success: false,
                    accepted: false,
                    satisfiesCriteria: false,
                    error: critiqueResult.error || 'Critique evaluation failed'
                };
                logger.info('Returning error result:', JSON.stringify(result));
                // Do not populate resultData on error
                return result;
            }
            if (critiqueResult.satisfiesCriteria) {
                // Answer meets criteria, accept it
                const result = {
                    success: true,
                    accepted: true,
                    satisfiesCriteria: true,
                    answer: args.answer
                };
                logger.info('Accepted! Returning result:', JSON.stringify(result));
                // Populate resultData on success/acceptance
                return { ...result, resultData: { accepted: true, answer: args.answer } };
            }
            // Answer does not meet criteria, provide feedback
            const result = {
                success: true,
                accepted: false,
                satisfiesCriteria: false,
                feedback: critiqueResult.feedback || 'Your answer does not fully address the user\'s requirements. Please revise.'
            };
            logger.info('Rejected! Returning result with feedback:', JSON.stringify(result));
            // Populate resultData on success/rejection
            return { ...result, resultData: { accepted: false, feedback: result.feedback } };
        }
        catch (error) {
            logger.error('[FinalizeWithCritiqueTool] Error:', error);
            const result = {
                success: false,
                accepted: false,
                satisfiesCriteria: false,
                error: `Error during finalization: ${error.message || String(error)}`
            };
            logger.info('Returning error result:', JSON.stringify(result));
            // Do not populate resultData on error
            return result;
        }
    }
}
//# sourceMappingURL=FinalizeWithCritiqueTool.js.map