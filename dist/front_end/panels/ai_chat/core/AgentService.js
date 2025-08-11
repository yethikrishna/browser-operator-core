// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AgentService_instances, _AgentService_state, _AgentService_graph, _AgentService_apiKey, _AgentService_isInitialized, _AgentService_runningGraphStatePromise, _AgentService_tracingProvider, _AgentService_sessionId, _AgentService_initializeLLMClient, _AgentService_initializeTracing, _AgentService_getCurrentPageUrl, _AgentService_getCurrentPageTitle, _AgentService_doesCurrentConfigRequireApiKey;
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as UI from '../../../ui/legacy/legacy.js';
import { ChatMessageEntity } from '../ui/ChatView.js';
import { createAgentGraph } from './Graph.js';
import { createLogger } from './Logger.js';
import { createInitialState, createUserMessage } from './State.js';
import { LLMClient } from '../LLM/LLMClient.js';
import { createTracingProvider, getCurrentTracingContext } from '../tracing/TracingConfig.js';
const logger = createLogger('AgentService');
/**
 * Events dispatched by the agent service
 */
export var Events;
(function (Events) {
    Events["MESSAGES_CHANGED"] = "messages-changed";
})(Events || (Events = {}));
/**
 * Service for interacting with the orchestrator agent
 */
export class AgentService extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _AgentService_instances.add(this);
        _AgentService_state.set(this, createInitialState());
        _AgentService_graph.set(this, void 0);
        _AgentService_apiKey.set(this, null);
        _AgentService_isInitialized.set(this, false);
        _AgentService_runningGraphStatePromise.set(this, void 0);
        _AgentService_tracingProvider.set(this, void 0);
        _AgentService_sessionId.set(this, void 0);
        // Initialize tracing
        __classPrivateFieldSet(this, _AgentService_sessionId, this.generateSessionId(), "f");
        __classPrivateFieldGet(this, _AgentService_instances, "m", _AgentService_initializeTracing).call(this);
        // Initialize with a welcome message
        __classPrivateFieldSet(this, _AgentService_state, createInitialState(), "f");
        __classPrivateFieldGet(this, _AgentService_state, "f").messages.push({
            entity: ChatMessageEntity.MODEL,
            action: 'final',
            answer: i18nString(UIStrings.welcomeMessage),
            isFinalAnswer: true,
        });
    }
    /**
     * Gets the singleton instance of the agent service
     */
    static getInstance() {
        if (!AgentService.instance) {
            AgentService.instance = new AgentService();
        }
        return AgentService.instance;
    }
    /**
     * Gets the API key currently configured for the agent
     */
    getApiKey() {
        return __classPrivateFieldGet(this, _AgentService_apiKey, "f");
    }
    /**
     * Initializes the agent with the given API key
     */
    async initialize(apiKey, modelName) {
        try {
            __classPrivateFieldSet(this, _AgentService_apiKey, apiKey, "f");
            if (!modelName) {
                throw new Error('Model name is required for initialization');
            }
            // Initialize LLM client first
            await __classPrivateFieldGet(this, _AgentService_instances, "m", _AgentService_initializeLLMClient).call(this);
            // Check if the configuration requires an API key
            const requiresApiKey = __classPrivateFieldGet(this, _AgentService_instances, "m", _AgentService_doesCurrentConfigRequireApiKey).call(this);
            // If API key is required but not provided, throw error
            if (requiresApiKey && !apiKey) {
                const provider = localStorage.getItem('ai_chat_provider') || 'openai';
                let providerName = 'OpenAI';
                if (provider === 'litellm') {
                    providerName = 'LiteLLM';
                }
                else if (provider === 'groq') {
                    providerName = 'Groq';
                }
                else if (provider === 'openrouter') {
                    providerName = 'OpenRouter';
                }
                throw new Error(`${providerName} API key is required for this configuration`);
            }
            // Will throw error if OpenAI model is used without API key
            __classPrivateFieldSet(this, _AgentService_graph, createAgentGraph(apiKey, modelName), "f");
            __classPrivateFieldSet(this, _AgentService_isInitialized, true, "f");
        }
        catch (error) {
            logger.error('Failed to initialize agent:', error);
            // Pass through specific errors
            if (error instanceof Error &&
                (error.message.includes('API key is required') ||
                    error.message.includes('endpoint is required'))) {
                throw error;
            }
            throw new Error(i18nString(UIStrings.agentInitFailed));
        }
    }
    /**
     * Checks if the agent is initialized
     */
    isInitialized() {
        return __classPrivateFieldGet(this, _AgentService_isInitialized, "f");
    }
    /**
     * Gets the current state of the agent
     */
    getState() {
        return __classPrivateFieldGet(this, _AgentService_state, "f");
    }
    /**
     * Gets the messages from the agent
     */
    getMessages() {
        return __classPrivateFieldGet(this, _AgentService_state, "f").messages;
    }
    /**
     * Generate a unique session ID
     */
    generateSessionId() {
        return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }
    /**
     * Generate a unique trace ID
     */
    generateTraceId() {
        return `trace-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }
    /**
     * Refresh the tracing provider (called when configuration changes)
     */
    async refreshTracingProvider() {
        logger.info('Refreshing tracing provider due to configuration change');
        await __classPrivateFieldGet(this, _AgentService_instances, "m", _AgentService_initializeTracing).call(this);
    }
    /**
     * Sends a message to the AI agent
     */
    async sendMessage(text, imageInput, selectedAgentType) {
        // Check if the current configuration requires an API key
        const requiresApiKey = __classPrivateFieldGet(this, _AgentService_instances, "m", _AgentService_doesCurrentConfigRequireApiKey).call(this);
        if (requiresApiKey && !__classPrivateFieldGet(this, _AgentService_apiKey, "f")) {
            throw new Error('API key not set. Please set the API key in settings.');
        }
        if (!text.trim()) {
            throw new Error('Empty message. Please enter some text.');
        }
        // Create a user message
        const userMessage = createUserMessage(text, imageInput);
        // Add it to our message history
        __classPrivateFieldGet(this, _AgentService_state, "f").messages.push(userMessage);
        // Notify listeners of message update
        this.dispatchEventToListeners(Events.MESSAGES_CHANGED, [...__classPrivateFieldGet(this, _AgentService_state, "f").messages]);
        // Get the user's current context (URL and title)
        const currentPageUrl = await __classPrivateFieldGet(this, _AgentService_instances, "m", _AgentService_getCurrentPageUrl).call(this);
        const currentPageTitle = await __classPrivateFieldGet(this, _AgentService_instances, "m", _AgentService_getCurrentPageTitle).call(this);
        // Check if there's an existing tracing context (e.g., from evaluation)
        const existingContext = getCurrentTracingContext();
        let traceId;
        let parentObservationId;
        if (existingContext?.traceId) {
            // Use the existing trace from evaluation context
            traceId = existingContext.traceId;
            parentObservationId = existingContext.parentObservationId;
            logger.debug('Using existing trace context from evaluation', {
                traceId,
                sessionId: existingContext.sessionId,
                parentObservationId,
                tracingEnabled: __classPrivateFieldGet(this, _AgentService_tracingProvider, "f").isEnabled()
            });
        }
        else {
            // Create a new trace for this interaction
            traceId = this.generateTraceId();
            logger.debug('Creating new trace for user message', {
                traceId,
                sessionId: __classPrivateFieldGet(this, _AgentService_sessionId, "f"),
                tracingEnabled: __classPrivateFieldGet(this, _AgentService_tracingProvider, "f").isEnabled()
            });
            await __classPrivateFieldGet(this, _AgentService_tracingProvider, "f").createTrace(traceId, __classPrivateFieldGet(this, _AgentService_sessionId, "f"), 'User Message', { text, imageInput }, {
                selectedAgentType,
                currentPageUrl,
                currentPageTitle
            }, undefined, // userId
            [selectedAgentType || 'default'].filter(Boolean));
        }
        console.warn('Trace context for user message', {
            traceId,
            sessionId: existingContext?.sessionId || __classPrivateFieldGet(this, _AgentService_sessionId, "f"),
            selectedAgentType,
            currentPageUrl,
            currentPageTitle,
            messageCount: __classPrivateFieldGet(this, _AgentService_state, "f").messages.length,
            isExistingTrace: !!existingContext
        });
        // Create user input event
        await __classPrivateFieldGet(this, _AgentService_tracingProvider, "f").createObservation({
            id: `event-user-input-${Date.now()}`,
            name: 'User Input Received',
            type: 'event',
            startTime: new Date(),
            input: {
                text,
                hasImage: !!imageInput,
                messageLength: text.length,
                currentUrl: currentPageUrl
            },
            metadata: {
                selectedAgentType,
                currentPageUrl,
                currentPageTitle,
                messageCount: __classPrivateFieldGet(this, _AgentService_state, "f").messages.length,
                isEvaluationContext: !!existingContext
            },
            ...(parentObservationId && { parentObservationId })
        }, traceId);
        try {
            // Create initial state for this run
            const state = {
                messages: __classPrivateFieldGet(this, _AgentService_state, "f").messages,
                context: {
                    tracingContext: {
                        sessionId: existingContext?.sessionId || __classPrivateFieldGet(this, _AgentService_sessionId, "f"),
                        traceId,
                        parentObservationId: parentObservationId
                    }
                },
                selectedAgentType: selectedAgentType ?? null, // Set the agent type for this run
                currentPageUrl,
                currentPageTitle,
            };
            console.warn('Going to invoke graph', {
                traceId,
                sessionId: __classPrivateFieldGet(this, _AgentService_sessionId, "f"),
                currentPageUrl,
                currentPageTitle,
                messageCount: __classPrivateFieldGet(this, _AgentService_state, "f").messages.length
            });
            // Run the agent graph on the state
            console.warn('[AGENT SERVICE DEBUG] About to invoke graph with state:', {
                traceId,
                messagesCount: state.messages.length,
                hasTracingContext: !!state.context?.tracingContext
            });
            __classPrivateFieldSet(this, _AgentService_runningGraphStatePromise, __classPrivateFieldGet(this, _AgentService_graph, "f")?.invoke(state), "f");
            // Wait for the result
            if (!__classPrivateFieldGet(this, _AgentService_runningGraphStatePromise, "f")) {
                throw new Error('Agent graph not initialized. Please try again.');
            }
            // Iterate through the generator and update UI after each step
            for await (const currentState of __classPrivateFieldGet(this, _AgentService_runningGraphStatePromise, "f")) {
                // Update our messages with the messages from the current step
                __classPrivateFieldGet(this, _AgentService_state, "f").messages = currentState.messages;
                // Notify listeners of message update immediately
                this.dispatchEventToListeners(Events.MESSAGES_CHANGED, [...__classPrivateFieldGet(this, _AgentService_state, "f").messages]);
            }
            // Check if the last message is an error (it might have been added in the loop)
            const finalMessage = __classPrivateFieldGet(this, _AgentService_state, "f").messages[__classPrivateFieldGet(this, _AgentService_state, "f").messages.length - 1];
            if (!finalMessage) {
                throw new Error('No state returned from agent. Please try again.');
            }
            // Create success completion event
            await __classPrivateFieldGet(this, _AgentService_tracingProvider, "f").createObservation({
                id: `event-completion-${Date.now()}`,
                name: 'Agent Response Complete',
                type: 'event',
                startTime: new Date(),
                output: {
                    messageType: finalMessage.entity,
                    action: 'action' in finalMessage ? finalMessage.action : 'unknown',
                    isFinalAnswer: 'isFinalAnswer' in finalMessage ? finalMessage.isFinalAnswer : false
                },
                metadata: {
                    totalMessages: __classPrivateFieldGet(this, _AgentService_state, "f").messages.length,
                    responseType: 'success'
                }
            }, traceId);
            // Wait a moment for all async tracing operations to complete
            await new Promise(resolve => setTimeout(resolve, 100));
            // Only finalize trace if we created a new one (not using existing evaluation trace)
            if (!existingContext) {
                await __classPrivateFieldGet(this, _AgentService_tracingProvider, "f").finalizeTrace(traceId, finalMessage, { status: 'success' });
            }
            // Return the most recent message (could be final answer, tool call, or error)
            return finalMessage;
        }
        catch (error) {
            logger.error('Error running agent:', error);
            // Create an error message from the model
            const errorMessage = {
                entity: ChatMessageEntity.MODEL,
                action: 'final',
                answer: error instanceof Error ? error.message : String(error),
                isFinalAnswer: true,
                error: error instanceof Error ? error.message : String(error),
            };
            // Add it to our message history
            __classPrivateFieldGet(this, _AgentService_state, "f").messages.push(errorMessage);
            // Notify listeners of message update
            this.dispatchEventToListeners(Events.MESSAGES_CHANGED, [...__classPrivateFieldGet(this, _AgentService_state, "f").messages]);
            // Create error completion event
            await __classPrivateFieldGet(this, _AgentService_tracingProvider, "f").createObservation({
                id: `event-error-${Date.now()}`,
                name: 'Agent Error',
                type: 'event',
                startTime: new Date(),
                error: error instanceof Error ? error.message : String(error),
                metadata: {
                    totalMessages: __classPrivateFieldGet(this, _AgentService_state, "f").messages.length,
                    responseType: 'error'
                }
            }, traceId);
            // Only finalize trace if we created a new one (not using existing evaluation trace)
            if (!existingContext) {
                await __classPrivateFieldGet(this, _AgentService_tracingProvider, "f").finalizeTrace(traceId, errorMessage, { status: 'error', error: error instanceof Error ? error.message : String(error) });
            }
            return errorMessage;
        }
    }
    /**
     * Clears the conversation history
     */
    clearConversation() {
        // Create a fresh state
        __classPrivateFieldSet(this, _AgentService_state, createInitialState(), "f");
        // Add welcome message
        __classPrivateFieldGet(this, _AgentService_state, "f").messages.push({
            entity: ChatMessageEntity.MODEL,
            action: 'final',
            answer: i18nString(UIStrings.welcomeMessage),
            isFinalAnswer: true,
        });
        // Notify listeners that messages have changed
        this.dispatchEventToListeners(Events.MESSAGES_CHANGED, [...__classPrivateFieldGet(this, _AgentService_state, "f").messages]);
    }
    /**
     * Sets the API key for the agent and re-initializes the graph
     * @param apiKey The new API key
     */
    setApiKey(apiKey) {
        __classPrivateFieldSet(this, _AgentService_apiKey, apiKey, "f");
        __classPrivateFieldSet(this, _AgentService_isInitialized, false, "f"); // Force re-initialization on next message
    }
}
_AgentService_state = new WeakMap(), _AgentService_graph = new WeakMap(), _AgentService_apiKey = new WeakMap(), _AgentService_isInitialized = new WeakMap(), _AgentService_runningGraphStatePromise = new WeakMap(), _AgentService_tracingProvider = new WeakMap(), _AgentService_sessionId = new WeakMap(), _AgentService_instances = new WeakSet(), _AgentService_initializeLLMClient = 
/**
 * Initializes the LLM client with provider configurations
 */
async function _AgentService_initializeLLMClient() {
    const llm = LLMClient.getInstance();
    // Get configuration from localStorage
    const provider = localStorage.getItem('ai_chat_provider') || 'openai';
    const openaiKey = localStorage.getItem('ai_chat_api_key') || '';
    const litellmKey = localStorage.getItem('ai_chat_litellm_api_key') || '';
    const litellmEndpoint = localStorage.getItem('ai_chat_litellm_endpoint') || '';
    const groqKey = localStorage.getItem('ai_chat_groq_api_key') || '';
    const openrouterKey = localStorage.getItem('ai_chat_openrouter_api_key') || '';
    const providers = [];
    // Only add the selected provider
    if (provider === 'openai' && openaiKey) {
        providers.push({
            provider: 'openai',
            apiKey: openaiKey
        });
    }
    if (provider === 'litellm' && litellmEndpoint) {
        providers.push({
            provider: 'litellm',
            apiKey: litellmKey, // Can be empty for some LiteLLM endpoints
            providerURL: litellmEndpoint
        });
    }
    if (provider === 'groq' && groqKey) {
        providers.push({
            provider: 'groq',
            apiKey: groqKey
        });
    }
    if (provider === 'openrouter' && openrouterKey) {
        providers.push({
            provider: 'openrouter',
            apiKey: openrouterKey
        });
    }
    if (providers.length === 0) {
        let errorMessage = 'OpenAI API key is required for this configuration';
        if (provider === 'litellm') {
            errorMessage = 'LiteLLM endpoint is required for this configuration';
        }
        else if (provider === 'groq') {
            errorMessage = 'Groq API key is required for this configuration';
        }
        else if (provider === 'openrouter') {
            errorMessage = 'OpenRouter API key is required for this configuration';
        }
        throw new Error(errorMessage);
    }
    await llm.initialize({ providers });
    logger.info('LLM client initialized successfully', {
        selectedProvider: provider,
        providersRegistered: providers.map(p => p.provider),
        providersCount: providers.length
    });
}, _AgentService_initializeTracing = 
/**
 * Initialize or reinitialize the tracing provider
 */
async function _AgentService_initializeTracing() {
    __classPrivateFieldSet(this, _AgentService_tracingProvider, createTracingProvider(), "f");
    try {
        await __classPrivateFieldGet(this, _AgentService_tracingProvider, "f").initialize();
        await __classPrivateFieldGet(this, _AgentService_tracingProvider, "f").createSession(__classPrivateFieldGet(this, _AgentService_sessionId, "f"), {
            source: 'devtools-ai-chat',
            startTime: new Date().toISOString()
        });
        logger.info('Tracing initialized successfully');
    }
    catch (error) {
        logger.error('Failed to initialize tracing', error);
    }
}, _AgentService_getCurrentPageUrl = 
/**
 * Gets the current page URL from the target
 */
async function _AgentService_getCurrentPageUrl() {
    let pageUrl = '';
    const target = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    if (target) {
        try {
            const urlResult = await target.runtimeAgent().invoke_evaluate({
                expression: 'window.location.href',
                returnByValue: true
            });
            if (urlResult.result && !urlResult.exceptionDetails) {
                pageUrl = urlResult.result.value || '';
            }
        }
        catch (error) {
            logger.error('Error fetching page URL:', error);
        }
    }
    return pageUrl;
}, _AgentService_getCurrentPageTitle = 
/**
 * Gets the current page title from the target
 */
async function _AgentService_getCurrentPageTitle() {
    let pageTitle = '';
    const target = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    if (target) {
        try {
            const titleResult = await target.runtimeAgent().invoke_evaluate({
                expression: 'document.title',
                returnByValue: true
            });
            if (titleResult.result && !titleResult.exceptionDetails) {
                pageTitle = titleResult.result.value || '';
            }
        }
        catch (error) {
            logger.error('Error fetching page title:', error);
        }
    }
    return pageTitle;
}, _AgentService_doesCurrentConfigRequireApiKey = function _AgentService_doesCurrentConfigRequireApiKey() {
    try {
        // Check the selected provider
        const selectedProvider = localStorage.getItem('ai_chat_provider') || 'openai';
        // OpenAI provider always requires an API key
        if (selectedProvider === 'openai') {
            return true;
        }
        // Groq provider always requires an API key
        if (selectedProvider === 'groq') {
            return true;
        }
        // OpenRouter provider always requires an API key
        if (selectedProvider === 'openrouter') {
            return true;
        }
        // For LiteLLM, only require API key if no endpoint is configured
        if (selectedProvider === 'litellm') {
            const hasLiteLLMEndpoint = Boolean(localStorage.getItem('ai_chat_litellm_endpoint'));
            // If we have an endpoint, API key is optional
            return !hasLiteLLMEndpoint;
        }
        // Default to requiring API key for any unknown provider
        return true;
    }
    catch (error) {
        logger.error('Error checking if API key is required:', error);
        // Default to requiring API key in case of errors
        return true;
    }
};
// Define UI strings object to manage i18n strings
const UIStrings = {
    /**
     * @description Welcome message for empty conversation
     */
    welcomeMessage: 'Hello! I\'m your AI assistant. How can I help you today?',
    /**
     * @description Error message when the agent fails to initialize
     */
    agentInitFailed: 'Failed to initialize agent.',
};
const str_ = i18n.i18n.registerUIStrings('panels/ai_chat/core/AgentService.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
// Register as a module
Common.Revealer.registerRevealer({
    contextTypes() {
        return [AgentService];
    },
    async loadRevealer() {
        return {
            reveal: async (agentService) => {
                if (!(agentService instanceof AgentService)) {
                    return;
                }
                // Reveal the AI Chat panel
                await UI.ViewManager.ViewManager.instance().showView('ai-chat');
            }
        };
    }
});
//# sourceMappingURL=AgentService.js.map