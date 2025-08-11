// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { createLogger } from '../core/Logger.js';
const logger = createLogger('LLMProviderRegistry');
/**
 * Registry for managing LLM providers with distributed model ownership
 */
export class LLMProviderRegistry {
    /**
     * Register a provider instance
     */
    static registerProvider(providerType, providerInstance) {
        logger.info(`Registering provider: ${providerType}`);
        this.providers.set(providerType, providerInstance);
    }
    /**
     * Get a provider by type
     */
    static getProvider(providerType) {
        return this.providers.get(providerType);
    }
    /**
     * Check if a provider is registered
     */
    static hasProvider(providerType) {
        return this.providers.has(providerType);
    }
    /**
     * Get all models from all registered providers
     */
    static async getAllModels() {
        const allModels = [];
        for (const [providerType, provider] of this.providers.entries()) {
            try {
                const providerModels = await provider.getModels();
                allModels.push(...providerModels);
                logger.debug(`Got ${providerModels.length} models from ${providerType}`);
            }
            catch (error) {
                logger.warn(`Failed to get models from ${providerType}:`, error);
            }
        }
        logger.info(`Total models available: ${allModels.length}`);
        return allModels;
    }
    /**
     * Get models for a specific provider
     */
    static async getModelsByProvider(providerType) {
        const provider = this.getProvider(providerType);
        if (!provider) {
            logger.warn(`Provider ${providerType} not registered`);
            return [];
        }
        try {
            const models = await provider.getModels();
            logger.debug(`Got ${models.length} models from ${providerType}`);
            return models;
        }
        catch (error) {
            logger.error(`Failed to get models from ${providerType}:`, error);
            return [];
        }
    }
    /**
     * Get all registered provider types
     */
    static getRegisteredProviders() {
        return Array.from(this.providers.keys());
    }
    /**
     * Clear all registrations (useful for testing)
     */
    static clear() {
        this.providers.clear();
        logger.info('LLM Provider Registry cleared');
    }
    /**
     * Get registry statistics
     */
    static getStats() {
        return {
            providersCount: this.providers.size,
            providers: Array.from(this.providers.keys()),
        };
    }
}
LLMProviderRegistry.providers = new Map();
//# sourceMappingURL=LLMProviderRegistry.js.map