// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { createLogger } from '../core/Logger.js';
import { NoOpTracingProvider } from './TracingProvider.js';
import { LangfuseProvider } from './LangfuseProvider.js';
const logger = createLogger('TracingConfig');
const contextLogger = createLogger('TracingContextManager');
/**
 * Global tracing configuration store that persists across navigations
 */
class TracingConfigStore {
    constructor() {
        this.config = { provider: 'disabled' };
        // Try to load from localStorage first (for backwards compatibility)
        this.loadFromLocalStorage();
    }
    static getInstance() {
        if (!TracingConfigStore.instance) {
            TracingConfigStore.instance = new TracingConfigStore();
        }
        return TracingConfigStore.instance;
    }
    loadFromLocalStorage() {
        try {
            const enabled = localStorage.getItem('ai_chat_langfuse_enabled') === 'true';
            if (enabled) {
                const endpoint = localStorage.getItem('ai_chat_langfuse_endpoint');
                const publicKey = localStorage.getItem('ai_chat_langfuse_public_key');
                const secretKey = localStorage.getItem('ai_chat_langfuse_secret_key');
                if (endpoint && publicKey && secretKey) {
                    this.config = {
                        provider: 'langfuse',
                        endpoint,
                        publicKey,
                        secretKey
                    };
                    logger.info('Loaded tracing config from localStorage');
                }
            }
        }
        catch (error) {
            logger.warn('Failed to load tracing config from localStorage:', error);
        }
    }
    getConfig() {
        return { ...this.config };
    }
    setConfig(newConfig) {
        this.config = { ...newConfig };
        logger.info('Tracing configuration updated', {
            provider: newConfig.provider,
            endpoint: newConfig.endpoint
        });
        // Also save to localStorage for persistence across DevTools sessions
        try {
            if (newConfig.provider === 'langfuse' && newConfig.endpoint && newConfig.publicKey && newConfig.secretKey) {
                localStorage.setItem('ai_chat_langfuse_enabled', 'true');
                localStorage.setItem('ai_chat_langfuse_endpoint', newConfig.endpoint);
                localStorage.setItem('ai_chat_langfuse_public_key', newConfig.publicKey);
                localStorage.setItem('ai_chat_langfuse_secret_key', newConfig.secretKey);
            }
            else {
                localStorage.setItem('ai_chat_langfuse_enabled', 'false');
            }
        }
        catch (error) {
            logger.warn('Failed to save tracing config to localStorage:', error);
        }
        // Refresh the AgentService tracing provider
        this.refreshAgentServiceTracing();
    }
    refreshAgentServiceTracing() {
        try {
            // Refresh the singleton TracingProvider
            refreshTracingProvider().catch((error) => {
                logger.error('Failed to refresh TracingProvider singleton:', error);
            });
            // Also refresh AgentService if available to maintain backward compatibility
            import('../core/AgentService.js').then(({ AgentService }) => {
                const agentService = AgentService.getInstance();
                if (agentService && typeof agentService.refreshTracingProvider === 'function') {
                    agentService.refreshTracingProvider().catch((error) => {
                        logger.error('Failed to refresh AgentService tracing provider:', error);
                    });
                }
            }).catch((error) => {
                logger.warn('Could not refresh AgentService tracing provider:', error);
            });
        }
        catch (error) {
            logger.warn('Failed to refresh tracing providers:', error);
        }
    }
    isEnabled() {
        return this.config.provider !== 'disabled' &&
            !!this.config.publicKey &&
            !!this.config.secretKey;
    }
}
/**
 * Get tracing configuration from the persistent store
 */
export function getTracingConfig() {
    return TracingConfigStore.getInstance().getConfig();
}
/**
 * Update tracing configuration
 */
export function setTracingConfig(config) {
    TracingConfigStore.getInstance().setConfig(config);
}
/**
 * Check if tracing is enabled
 */
export function isTracingEnabled() {
    return TracingConfigStore.getInstance().isEnabled();
}
/**
 * Singleton manager for TracingProvider instances
 */
class TracingProviderSingleton {
    static getInstance() {
        if (!TracingProviderSingleton.instance) {
            TracingProviderSingleton.instance = this.createProvider();
            logger.info('Created new TracingProvider singleton instance');
        }
        return TracingProviderSingleton.instance;
    }
    static async refresh() {
        logger.info('Refreshing TracingProvider singleton instance');
        // Cleanup old instance
        if (this.instance) {
            if (typeof this.instance.destroy === 'function') {
                this.instance.destroy();
                logger.debug('Destroyed previous TracingProvider instance');
            }
        }
        // Create new instance
        this.instance = this.createProvider();
        // Initialize if it has an initialize method
        if (typeof this.instance.initialize === 'function') {
            await this.instance.initialize();
            logger.debug('Initialized new TracingProvider instance');
        }
    }
    static createProvider() {
        const config = getTracingConfig();
        if (config.provider === 'disabled') {
            logger.info('Tracing is disabled - creating NoOpTracingProvider');
            return new NoOpTracingProvider();
        }
        if (config.provider === 'langfuse') {
            if (!config.publicKey || !config.secretKey) {
                logger.warn('Langfuse tracing enabled but missing credentials, falling back to no-op');
                return new NoOpTracingProvider();
            }
            logger.info('Creating LangfuseProvider singleton', {
                endpoint: config.endpoint,
                hasPublicKey: !!config.publicKey,
                hasSecretKey: !!config.secretKey
            });
            return new LangfuseProvider(config.endpoint, config.publicKey, config.secretKey, true);
        }
        // Default to no-op
        logger.warn('Unknown tracing provider, falling back to no-op', { provider: config.provider });
        return new NoOpTracingProvider();
    }
    static reset() {
        if (this.instance && typeof this.instance.destroy === 'function') {
            this.instance.destroy();
        }
        this.instance = null;
        logger.info('Reset TracingProvider singleton');
    }
}
TracingProviderSingleton.instance = null;
/**
 * Create a tracing provider based on current configuration (singleton)
 */
export function createTracingProvider() {
    return TracingProviderSingleton.getInstance();
}
/**
 * Refresh the singleton tracing provider (useful when configuration changes)
 */
export async function refreshTracingProvider() {
    await TracingProviderSingleton.refresh();
}
/**
 * Thread-local tracing context for passing context to nested tool executions
 */
class TracingContextManager {
    constructor() {
        this.currentContext = null;
    }
    static getInstance() {
        if (!TracingContextManager.instance) {
            TracingContextManager.instance = new TracingContextManager();
        }
        return TracingContextManager.instance;
    }
    setContext(context) {
        this.currentContext = context;
    }
    getContext() {
        return this.currentContext;
    }
    clearContext() {
        this.currentContext = null;
    }
    /**
     * Execute a function with a specific tracing context
     */
    async withContext(context, fn) {
        const previousContext = this.currentContext;
        contextLogger.info('Setting tracing context:', {
            hasContext: !!context,
            traceId: context?.traceId,
            previousContext: !!previousContext
        });
        console.log(`[HIERARCHICAL_TRACING] TracingContextManager: Setting tracing context:`, {
            hasContext: !!context,
            traceId: context?.traceId,
            currentAgentSpanId: context?.currentAgentSpanId,
            executionLevel: context?.executionLevel,
            agentName: context?.agentContext?.agentName,
            previousContext: !!previousContext
        });
        this.setContext(context);
        try {
            return await fn();
        }
        finally {
            this.setContext(previousContext);
            contextLogger.info('Restored previous tracing context:', { hasPrevious: !!previousContext });
            console.log(`[HIERARCHICAL_TRACING] TracingContextManager: Restored previous tracing context:`, {
                hasPrevious: !!previousContext,
                restoredExecutionLevel: previousContext?.executionLevel
            });
        }
    }
}
/**
 * Get the current tracing context
 */
export function getCurrentTracingContext() {
    return TracingContextManager.getInstance().getContext();
}
/**
 * Set the current tracing context
 */
export function setCurrentTracingContext(context) {
    TracingContextManager.getInstance().setContext(context);
}
/**
 * Execute a function with a specific tracing context
 */
export async function withTracingContext(context, fn) {
    return TracingContextManager.getInstance().withContext(context, fn);
}
/**
 * Helper function for easy configuration via console
 */
export function configureLangfuseTracing(endpoint, publicKey, secretKey) {
    setTracingConfig({
        provider: 'langfuse',
        endpoint,
        publicKey,
        secretKey
    });
    console.log('✅ Langfuse tracing configured successfully!');
    console.log('📊 Tracing will start with the next AI Chat interaction');
}
// Make functions available globally in development
if (typeof window !== 'undefined') {
    window.configureLangfuseTracing = configureLangfuseTracing;
    window.getTracingConfig = getTracingConfig;
    window.setTracingConfig = setTracingConfig;
    window.isTracingEnabled = isTracingEnabled;
    window.refreshTracingProvider = refreshTracingProvider;
    window.resetTracingProvider = () => {
        // Add a convenience function to reset the singleton
        TracingProviderSingleton.reset();
    };
}
//# sourceMappingURL=TracingConfig.js.map