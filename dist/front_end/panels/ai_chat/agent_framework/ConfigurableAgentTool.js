// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { AgentService } from '../core/AgentService.js';
import { AIChatPanel } from '../ui/AIChatPanel.js';
import { ChatMessageEntity } from '../ui/ChatView.js';
import { createLogger } from '../core/Logger.js';
import { getCurrentTracingContext } from '../tracing/TracingConfig.js';
const logger = createLogger('ConfigurableAgentTool');
import { AgentRunner } from './AgentRunner.js';
/**
 * Registry of tool factory functions
 */
export class ToolRegistry {
    /**
     * Register a tool factory and create/store an instance
     */
    static registerToolFactory(name, factory) {
        if (this.toolFactories.has(name)) {
            logger.warn(`Tool factory already registered for: ${name}. Overwriting.`);
        }
        if (this.registeredTools.has(name)) {
            logger.warn(`Tool instance already registered for: ${name}. Overwriting.`);
        }
        this.toolFactories.set(name, factory);
        // Create and store the instance immediately upon registration
        try {
            const instance = factory();
            this.registeredTools.set(name, instance);
            logger.info('Registered and instantiated tool: ${name}');
        }
        catch (error) {
            logger.error(`Failed to instantiate tool '${name}' during registration:`, error);
            // Remove the factory entry if instantiation fails
            this.toolFactories.delete(name);
        }
    }
    /**
     * Get a tool instance by name
     */
    static getToolInstance(name) {
        const factory = this.toolFactories.get(name);
        return factory ? factory() : null;
    }
    /**
     * Get a pre-registered tool instance by name
     */
    static getRegisteredTool(name) {
        const instance = this.registeredTools.get(name);
        if (!instance) {
            // Don't fallback, require pre-registration for handoffs
            // logger.warn(`No registered instance found for tool: ${name}.`);
            return null;
        }
        return instance;
    }
}
ToolRegistry.toolFactories = new Map();
ToolRegistry.registeredTools = new Map(); // Store instances
/**
 * An agent tool that can be configured via JSON
 */
export class ConfigurableAgentTool {
    constructor(config) {
        this.name = config.name;
        this.description = config.description;
        this.config = config;
        this.schema = config.schema;
        // Validate that required fields are present
        if (!config.systemPrompt) {
            throw new Error(`ConfigurableAgentTool: systemPrompt is required for ${config.name}`);
        }
        // Call custom init function directly if provided
        if (config.init) {
            config.init(this);
        }
    }
    /**
     * Get the tool instances for this agent
     */
    getToolInstances() {
        return this.config.tools
            .map(toolName => ToolRegistry.getToolInstance(toolName))
            .filter((tool) => tool !== null);
    }
    /**
     * Prepare initial messages for the agent
     */
    prepareInitialMessages(args) {
        // Use custom message preparation function directly if provided
        if (this.config.prepareMessages) {
            return this.config.prepareMessages(args, this.config);
        }
        // Default implementation
        return [{
                entity: ChatMessageEntity.USER,
                text: args.query,
            }];
    }
    /**
     * Create a success result
     */
    createSuccessResult(output, intermediateSteps, reason) {
        // Use custom success result creation function directly
        if (this.config.createSuccessResult) {
            return this.config.createSuccessResult(output, intermediateSteps, reason, this.config);
        }
        // Default implementation
        const result = {
            success: true,
            output,
            terminationReason: reason
        };
        // Only include steps if the flag is explicitly true
        if (this.config.includeIntermediateStepsOnReturn === true) {
            result.intermediateSteps = intermediateSteps;
        }
        return result;
    }
    /**
     * Create an error result
     */
    createErrorResult(error, intermediateSteps, reason) {
        // Use custom error result creation function directly
        if (this.config.createErrorResult) {
            return this.config.createErrorResult(error, intermediateSteps, reason, this.config);
        }
        // Default implementation
        const result = {
            success: false,
            error,
            terminationReason: reason
        };
        // Only include steps if the flag is explicitly true
        if (this.config.includeIntermediateStepsOnReturn === true) {
            result.intermediateSteps = intermediateSteps;
        }
        return result;
    }
    /**
     * Execute the agent
     */
    async execute(args) {
        logger.info(`Executing ${this.name} via AgentRunner with args:`, args);
        // Get current tracing context for debugging
        const tracingContext = getCurrentTracingContext();
        const agentService = AgentService.getInstance();
        const apiKey = agentService.getApiKey();
        if (!apiKey) {
            const errorResult = this.createErrorResult(`API key not configured for ${this.name}`, [], 'error');
            // Create minimal error session
            const errorSession = {
                agentName: this.name,
                agentQuery: args.query,
                agentReasoning: args.reasoning,
                sessionId: crypto.randomUUID(),
                status: 'error',
                startTime: new Date(),
                endTime: new Date(),
                messages: [],
                nestedSessions: [],
                tools: [],
                terminationReason: 'error'
            };
            return { ...errorResult, agentSession: errorSession };
        }
        // Initialize
        const maxIterations = this.config.maxIterations || 10;
        const modelName = typeof this.config.modelName === 'function'
            ? this.config.modelName()
            : (this.config.modelName || AIChatPanel.instance().getSelectedModel());
        const temperature = this.config.temperature ?? 0;
        const systemPrompt = this.config.systemPrompt;
        const tools = this.getToolInstances();
        // Prepare initial messages
        const internalMessages = this.prepareInitialMessages(args);
        // Prepare runner config and hooks
        const runnerConfig = {
            apiKey,
            modelName,
            systemPrompt,
            tools,
            maxIterations,
            temperature,
        };
        const runnerHooks = {
            prepareInitialMessages: undefined, // initial messages already prepared above
            createSuccessResult: this.config.createSuccessResult
                ? (out, steps, reason) => this.config.createSuccessResult(out, steps, reason, this.config)
                : (out, steps, reason) => this.createSuccessResult(out, steps, reason),
            createErrorResult: this.config.createErrorResult
                ? (err, steps, reason) => this.config.createErrorResult(err, steps, reason, this.config)
                : (err, steps, reason) => this.createErrorResult(err, steps, reason),
        };
        // Run the agent
        const result = await AgentRunner.run(internalMessages, args, runnerConfig, runnerHooks, this // Pass the current agent instance as executingAgent
        );
        // Return the direct result from the runner (including agentSession)
        return result;
    }
}
//# sourceMappingURL=ConfigurableAgentTool.js.map