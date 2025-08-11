// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { LLMProviderRegistry } from './LLMProviderRegistry.js';
import { OpenAIProvider } from './OpenAIProvider.js';
import { LiteLLMProvider } from './LiteLLMProvider.js';
import { GroqProvider } from './GroqProvider.js';
import { OpenRouterProvider } from './OpenRouterProvider.js';
import { LLMResponseParser } from './LLMResponseParser.js';
import { createLogger } from '../core/Logger.js';
const logger = createLogger('LLMClient');
/**
 * Main LLM client coordinator that provides a unified interface for agents
 * Replaces UnifiedLLMClient with cleaner architecture
 */
export class LLMClient {
    constructor() {
        this.initialized = false;
    }
    /**
     * Get the singleton instance
     */
    static getInstance() {
        if (!LLMClient.instance) {
            LLMClient.instance = new LLMClient();
        }
        return LLMClient.instance;
    }
    /**
     * Initialize the LLM client with provider configurations
     */
    async initialize(config) {
        logger.info('Initializing LLM client with providers:', config.providers.map(p => p.provider));
        // Clear existing providers
        LLMProviderRegistry.clear();
        // Register providers based on configuration
        for (const providerConfig of config.providers) {
            try {
                let providerInstance;
                switch (providerConfig.provider) {
                    case 'openai':
                        providerInstance = new OpenAIProvider(providerConfig.apiKey);
                        break;
                    case 'litellm':
                        providerInstance = new LiteLLMProvider(providerConfig.apiKey, providerConfig.providerURL);
                        break;
                    case 'groq':
                        providerInstance = new GroqProvider(providerConfig.apiKey);
                        break;
                    case 'openrouter':
                        providerInstance = new OpenRouterProvider(providerConfig.apiKey);
                        break;
                    default:
                        logger.warn(`Unknown provider type: ${providerConfig.provider}`);
                        continue;
                }
                LLMProviderRegistry.registerProvider(providerConfig.provider, providerInstance);
                logger.info(`Registered ${providerConfig.provider} provider`);
            }
            catch (error) {
                logger.error(`Failed to initialize ${providerConfig.provider} provider:`, error);
            }
        }
        this.initialized = true;
        logger.info('LLM client initialization complete');
    }
    /**
     * Check if the client is initialized
     */
    ensureInitialized() {
        if (!this.initialized) {
            throw new Error('LLMClient must be initialized before use. Call initialize() first.');
        }
    }
    /**
     * Main method for LLM calls with request object
     */
    async call(request) {
        this.ensureInitialized();
        const provider = LLMProviderRegistry.getProvider(request.provider);
        if (!provider) {
            throw new Error(`Provider ${request.provider} not available. Available providers: ${LLMProviderRegistry.getRegisteredProviders().join(', ')}`);
        }
        logger.debug(`Using ${request.provider} provider for model ${request.model}`);
        // Build messages array with required system prompt
        let messages = [...request.messages];
        // Add system prompt - always required
        const hasSystemMessage = messages.some(msg => msg.role === 'system');
        if (!hasSystemMessage) {
            messages.unshift({
                role: 'system',
                content: request.systemPrompt
            });
        }
        // Build options
        const options = {};
        if (request.temperature !== undefined) {
            options.temperature = request.temperature;
        }
        if (request.tools) {
            options.tools = request.tools;
        }
        if (request.retryConfig) {
            options.retryConfig = request.retryConfig;
        }
        return provider.callWithMessages(request.model, messages, options);
    }
    /**
     * Parse response into standardized action structure
     */
    parseResponse(response) {
        return LLMResponseParser.parseResponse(response);
    }
    /**
     * Get all available models from all providers
     */
    async getAvailableModels() {
        this.ensureInitialized();
        return LLMProviderRegistry.getAllModels();
    }
    /**
     * Get models for a specific provider
     */
    async getModelsByProvider(provider) {
        this.ensureInitialized();
        return LLMProviderRegistry.getModelsByProvider(provider);
    }
    /**
     * Test connection to a specific model
     */
    async testConnection(provider, modelId) {
        this.ensureInitialized();
        const providerInstance = LLMProviderRegistry.getProvider(provider);
        if (!providerInstance) {
            return {
                success: false,
                message: `Provider ${provider} not available`
            };
        }
        if (providerInstance.testConnection) {
            return providerInstance.testConnection(modelId);
        }
        // Fallback test: simple call
        try {
            const response = await this.call({
                provider,
                model: modelId,
                messages: [{ role: 'user', content: 'Please respond with "OK" to test the connection.' }],
                systemPrompt: 'You are a helpful assistant for testing purposes.',
                temperature: 0.1
            });
            return {
                success: true,
                message: `Connected successfully. Response: ${response.text || 'No text response'}`
            };
        }
        catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
    /**
     * Refresh models for a specific provider or all providers
     */
    async refreshProviderModels(provider) {
        this.ensureInitialized();
        if (provider) {
            const providerInstance = LLMProviderRegistry.getProvider(provider);
            if (providerInstance) {
                try {
                    await providerInstance.getModels();
                    logger.info(`Refreshed models for ${provider} provider`);
                }
                catch (error) {
                    logger.error(`Failed to refresh models for ${provider}:`, error);
                }
            }
        }
        else {
            // Refresh all providers
            const providers = LLMProviderRegistry.getRegisteredProviders();
            for (const providerType of providers) {
                await this.refreshProviderModels(providerType);
            }
        }
    }
    /**
     * Register a custom model with the LiteLLM provider
     */
    registerCustomModel(modelId, name) {
        const modelInfo = {
            id: modelId,
            name: name || modelId,
            provider: 'litellm',
            capabilities: {
                functionCalling: true,
                reasoning: false,
                vision: false,
                structured: true
            }
        };
        // Save to localStorage for LiteLLM provider to pick up
        try {
            const existingModels = JSON.parse(localStorage.getItem('ai_chat_custom_models') || '[]');
            const updatedModels = [...existingModels, modelInfo];
            localStorage.setItem('ai_chat_custom_models', JSON.stringify(updatedModels));
            logger.info(`Registered custom model: ${modelId}`);
        }
        catch (error) {
            logger.error('Failed to save custom model to localStorage:', error);
        }
        return modelInfo;
    }
    /**
     * Get registry statistics
     */
    getStats() {
        const registryStats = LLMProviderRegistry.getStats();
        return {
            initialized: this.initialized,
            ...registryStats
        };
    }
    /**
     * Static method to fetch models from LiteLLM endpoint (for UI use without initialization)
     */
    static async fetchLiteLLMModels(apiKey, baseUrl) {
        const provider = new LiteLLMProvider(apiKey, baseUrl);
        const models = await provider.fetchModels();
        return models;
    }
    /**
     * Static method to test LiteLLM connection (for UI use without initialization)
     */
    static async testLiteLLMConnection(apiKey, modelName, baseUrl) {
        const provider = new LiteLLMProvider(apiKey, baseUrl);
        return provider.testConnection(modelName);
    }
    /**
     * Static method to fetch models from Groq API (for UI use without initialization)
     */
    static async fetchGroqModels(apiKey) {
        const provider = new GroqProvider(apiKey);
        const models = await provider.fetchModels();
        return models;
    }
    /**
     * Static method to test Groq connection (for UI use without initialization)
     */
    static async testGroqConnection(apiKey, modelName) {
        const provider = new GroqProvider(apiKey);
        return provider.testConnection(modelName);
    }
    /**
     * Static method to fetch models from OpenRouter API (for UI use without initialization)
     */
    static async fetchOpenRouterModels(apiKey) {
        const provider = new OpenRouterProvider(apiKey);
        const models = await provider.fetchModels();
        return models;
    }
    /**
     * Static method to test OpenRouter connection (for UI use without initialization)
     */
    static async testOpenRouterConnection(apiKey, modelName) {
        const provider = new OpenRouterProvider(apiKey);
        return provider.testConnection(modelName);
    }
    /**
     * Static method to validate credentials for a specific provider
     */
    static validateProviderCredentials(providerType) {
        try {
            // Create temporary provider instance for validation (no API key needed for validation)
            let provider;
            switch (providerType) {
                case 'openai':
                    provider = new OpenAIProvider('');
                    break;
                case 'litellm':
                    provider = new LiteLLMProvider('', '');
                    break;
                case 'groq':
                    provider = new GroqProvider('');
                    break;
                case 'openrouter':
                    provider = new OpenRouterProvider('');
                    break;
                default:
                    return {
                        isValid: false,
                        message: `Unknown provider type: ${providerType}`,
                        missingItems: ['Valid provider selection']
                    };
            }
            return provider.validateCredentials();
        }
        catch (error) {
            return {
                isValid: false,
                message: `Failed to validate ${providerType} credentials: ${error instanceof Error ? error.message : String(error)}`,
                missingItems: ['Provider configuration']
            };
        }
    }
}
LLMClient.instance = null;
//# sourceMappingURL=LLMClient.js.map