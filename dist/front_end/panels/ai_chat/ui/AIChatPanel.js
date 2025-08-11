// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AIChatPanel_instances, _a, _AIChatPanel_messages, _AIChatPanel_chatView, _AIChatPanel_toolbarContainer, _AIChatPanel_chatViewContainer, _AIChatPanel_isTextInputEmpty, _AIChatPanel_agentService, _AIChatPanel_isProcessing, _AIChatPanel_imageInput, _AIChatPanel_selectedAgentType, _AIChatPanel_selectedModel, _AIChatPanel_miniModel, _AIChatPanel_nanoModel, _AIChatPanel_canSendMessages, _AIChatPanel_settingsButton, _AIChatPanel_liteLLMApiKey, _AIChatPanel_liteLLMEndpoint, _AIChatPanel_apiKey, _AIChatPanel_setupUI, _AIChatPanel_setupInitialState, _AIChatPanel_setupModelOptions, _AIChatPanel_loadModelSelections, _AIChatPanel_validateAndFixModelSelections, _AIChatPanel_setupOAuthEventListeners, _AIChatPanel_fetchLiteLLMModelsOnLoad, _AIChatPanel_refreshLiteLLMModels, _AIChatPanel_fetchLiteLLMModels, _AIChatPanel_updateModelOptions, _AIChatPanel_refreshGroqModels, _AIChatPanel_fetchGroqModels, _AIChatPanel_getModelStatus, _AIChatPanel_initializeEvaluationService, _AIChatPanel_initializeAgentService, _AIChatPanel_setCanSendMessagesState, _AIChatPanel_hasAnyProviderCredentials, _AIChatPanel_checkCredentials, _AIChatPanel_updateChatViewInputState, _AIChatPanel_getInputPlaceholderText, _AIChatPanel_handleOAuthLogin, _AIChatPanel_handleManualSetupRequest, _AIChatPanel_updateSettingsButtonHighlight, _AIChatPanel_handleMessagesChanged, _AIChatPanel_updateProcessingState, _AIChatPanel_handleModelChanged, _AIChatPanel_addUserMessage, _AIChatPanel_addCredentialErrorMessage, _AIChatPanel_setProcessingState, _AIChatPanel_handleSendMessageError, _AIChatPanel_updateToolbar, _AIChatPanel_updateChatViewState, _AIChatPanel_handlePromptSelected, _AIChatPanel_onNewChatClick, _AIChatPanel_onHistoryClick, _AIChatPanel_onDeleteClick, _AIChatPanel_onHelpClick, _AIChatPanel_onSettingsClick, _AIChatPanel_onEvaluationTestClick, _AIChatPanel_onBookmarkClick, _AIChatPanel_applyFullWidthSnackbarStyles, _AIChatPanel_ensureGlobalSnackbarStyles, _AIChatPanel_getCurrentPageTitle, _AIChatPanel_handleSettingsChanged, _AIChatPanel_updateModelSelections;
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import { AgentService, Events as AgentEvents } from '../core/AgentService.js';
import { LLMClient } from '../LLM/LLMClient.js';
import { LLMProviderRegistry } from '../LLM/LLMProviderRegistry.js';
import { OpenAIProvider } from '../LLM/OpenAIProvider.js';
import { LiteLLMProvider } from '../LLM/LiteLLMProvider.js';
import { GroqProvider } from '../LLM/GroqProvider.js';
import { OpenRouterProvider } from '../LLM/OpenRouterProvider.js';
import { createLogger } from '../core/Logger.js';
import { isEvaluationEnabled, connectToEvaluationService } from '../common/EvaluationConfig.js';
const logger = createLogger('AIChatPanel');
/**
 * Storage monitoring utility for debugging credential issues
 */
class StorageMonitor {
    constructor() {
        this.originalSetItem = localStorage.setItem.bind(localStorage);
        this.originalRemoveItem = localStorage.removeItem.bind(localStorage);
        this.setupStorageMonitoring();
    }
    static getInstance() {
        if (!StorageMonitor.instance) {
            StorageMonitor.instance = new StorageMonitor();
        }
        return StorageMonitor.instance;
    }
    setupStorageMonitoring() {
        // Monitor setItem operations
        localStorage.setItem = (key, value) => {
            if (key.includes('openrouter') || key.includes('ai_chat')) {
                logger.debug(`=== LOCALSTORAGE SET ===`);
                logger.debug(`Key: ${key}`);
                logger.debug(`Value exists: ${!!value}`);
                logger.debug(`Value length: ${value?.length || 0}`);
                logger.debug(`Value preview: ${value?.substring(0, 50) + (value?.length > 50 ? '...' : '') || 'null'}`);
                logger.debug(`Timestamp: ${new Date().toISOString()}`);
            }
            return this.originalSetItem(key, value);
        };
        // Monitor removeItem operations
        localStorage.removeItem = (key) => {
            if (key.includes('openrouter') || key.includes('ai_chat')) {
                logger.debug(`=== LOCALSTORAGE REMOVE ===`);
                logger.debug(`Key: ${key}`);
                logger.debug(`Timestamp: ${new Date().toISOString()}`);
            }
            return this.originalRemoveItem(key);
        };
    }
    restore() {
        localStorage.setItem = this.originalSetItem;
        localStorage.removeItem = this.originalRemoveItem;
    }
}
StorageMonitor.instance = null;
import chatViewStyles from './chatView.css.js';
import { ChatMessageEntity, ChatView, State as ChatViewState, } from './ChatView.js';
import { HelpDialog } from './HelpDialog.js';
import { SettingsDialog, isVectorDBEnabled } from './SettingsDialog.js';
import { EvaluationDialog } from './EvaluationDialog.js';
import * as Snackbars from '../../../ui/components/snackbars/snackbars.js';
const { html } = Lit;
// Add model options constant - these are the default OpenAI models
const DEFAULT_OPENAI_MODELS = [
    { value: 'o4-mini-2025-04-16', label: 'O4 Mini', type: 'openai' },
    { value: 'o3-mini-2025-01-31', label: 'O3 Mini', type: 'openai' },
    { value: 'gpt-5-2025-08-07', label: 'GPT-5', type: 'openai' },
    { value: 'gpt-5-mini-2025-08-07', label: 'GPT-5 Mini', type: 'openai' },
    { value: 'gpt-5-nano-2025-08-07', label: 'GPT-5 Nano', type: 'openai' },
    { value: 'gpt-4.1-2025-04-14', label: 'GPT-4.1', type: 'openai' },
    { value: 'gpt-4.1-mini-2025-04-14', label: 'GPT-4.1 Mini', type: 'openai' },
    { value: 'gpt-4.1-nano-2025-04-14', label: 'GPT-4.1 Nano', type: 'openai' },
];
// Default model selections for each provider
export const DEFAULT_PROVIDER_MODELS = {
    openai: {
        main: 'gpt-4.1-2025-04-14',
        mini: 'gpt-4.1-mini-2025-04-14',
        nano: 'gpt-4.1-nano-2025-04-14'
    },
    litellm: {
        main: '', // Will use first available model
        mini: '',
        nano: ''
    },
    groq: {
        main: 'meta-llama/llama-4-scout-17b-16e-instruct',
        mini: 'qwen/qwen3-32b',
        nano: 'llama-3.1-8b-instant'
    },
    openrouter: {
        main: 'anthropic/claude-sonnet-4',
        mini: 'google/gemini-2.5-flash',
        nano: 'google/gemini-2.5-flash-lite-preview-06-17'
    }
};
// This will hold the current active model options
let MODEL_OPTIONS = [...DEFAULT_OPENAI_MODELS];
// Model selector localStorage keys
const MODEL_SELECTION_KEY = 'ai_chat_model_selection';
const MINI_MODEL_STORAGE_KEY = 'ai_chat_mini_model';
const NANO_MODEL_STORAGE_KEY = 'ai_chat_nano_model';
// Provider selection key
const PROVIDER_SELECTION_KEY = 'ai_chat_provider';
// LiteLLM configuration keys
const LITELLM_ENDPOINT_KEY = 'ai_chat_litellm_endpoint';
const LITELLM_API_KEY_STORAGE_KEY = 'ai_chat_litellm_api_key';
const UIStrings = {
    /**
     *@description Text for the AI welcome message
     */
    welcomeMessage: 'Hello! I\'m your AI assistant. How can I help you today?',
    /**
     *@description AI chat UI text creating a new chat.
     */
    newChat: 'New chat',
    /**
     *@description AI chat UI tooltip text for the help button.
     */
    help: 'Help',
    /**
     *@description AI chat UI tooltip text for the settings button (gear icon).
     */
    settings: 'Settings',
    /**
     *@description Announcement text for screen readers when a new chat is created.
     */
    newChatCreated: 'New chat created',
    /**
     *@description Announcement text for screen readers when the chat is deleted.
     */
    chatDeleted: 'Chat deleted',
    /**
     *@description AI chat UI text creating selecting a history entry.
     */
    history: 'History',
    /**
     *@description AI chat UI text deleting the current chat session from local history.
     */
    deleteChat: 'Delete local chat',
    /**
     * @description Default text shown in the chat input
     */
    inputPlaceholder: 'Ask a question...',
    /**
     * @description Placeholder when OpenAI API key is missing
     */
    missingOpenAIKey: 'Please add your OpenAI API key in Settings',
    /**
     * @description Placeholder when LiteLLM endpoint is missing
     */
    missingLiteLLMEndpoint: 'Please configure LiteLLM endpoint in Settings',
    /**
     * @description Generic placeholder when provider credentials are missing
     */
    missingProviderCredentials: 'Provider credentials required. Please configure in Settings',
    /**
     * @description Run evaluation tests
     */
    runEvaluationTests: 'Run Evaluation Tests',
    /**
     * @description Bookmark current page
     */
    bookmarkPage: 'Bookmark Page',
};
const str_ = i18n.i18n.registerUIStrings('panels/ai_chat/ui/AIChatPanel.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
function toolbarView(input) {
    // clang-format off
    return html `
    <div class="toolbar-container" role="toolbar" .jslogContext=${VisualLogging.toolbar()} style="display: flex; justify-content: space-between; width: 100%; padding: 0 4px; box-sizing: border-box; margin: 0 0 10px 0;">
      <devtools-toolbar class="ai-chat-left-toolbar" role="presentation">
      <devtools-button
          title=${i18nString(UIStrings.history)}
          aria-label=${i18nString(UIStrings.history)}
          .iconName=${'history'}
          .jslogContext=${'ai-chat.history'}
          .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
          @click=${input.onHistoryClick}></devtools-button>
          <div class="toolbar-divider"></div>
        ${!input.isCenteredView ? html `
        <devtools-button
          title=${i18nString(UIStrings.newChat)}
          aria-label=${i18nString(UIStrings.newChat)}
          .iconName=${'plus'}
          .jslogContext=${'ai-chat.new-chat'}
          .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
          @click=${input.onNewChatClick}></devtools-button>
        ` : Lit.nothing}
      </devtools-toolbar>
      
      <devtools-toolbar class="ai-chat-right-toolbar" role="presentation">
        <div class="toolbar-divider"></div>
        ${input.isDeleteHistoryButtonVisible
        ? html `<devtools-button
              title=${i18nString(UIStrings.deleteChat)}
              aria-label=${i18nString(UIStrings.deleteChat)}
              .iconName=${'bin'}
              .jslogContext=${'ai-chat.delete'}
              .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
              @click=${input.onDeleteClick}></devtools-button>`
        : Lit.nothing}
        <devtools-button
          title=${i18nString(UIStrings.runEvaluationTests)}
          aria-label=${i18nString(UIStrings.runEvaluationTests)}
          .iconName=${'experiment'}
          .jslogContext=${'ai-chat.evaluation-tests'}
          .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
          @click=${input.onEvaluationTestClick}></devtools-button>
        ${input.isVectorDBEnabled
        ? html `<devtools-button
              title=${i18nString(UIStrings.bookmarkPage)}
              aria-label=${i18nString(UIStrings.bookmarkPage)}
              .iconName=${'download'}
              .jslogContext=${'ai-chat.bookmark-page'}
              .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
              @click=${input.onBookmarkClick}></devtools-button>`
        : Lit.nothing}
        <devtools-button
          title=${i18nString(UIStrings.settings)}
          aria-label=${i18nString(UIStrings.settings)}
          .iconName=${'gear'}
          .jslogContext=${'ai-chat.settings'}
          .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
          @click=${input.onSettingsClick}></devtools-button>
        <devtools-button
          title=${i18nString(UIStrings.help)}
          aria-label=${i18nString(UIStrings.help)}
          .iconName=${'help'}
          .jslogContext=${'ai-chat.help'}
          .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
          @click=${input.onHelpClick}></devtools-button>
        <devtools-button
            title="Close Chat Window"
            aria-label="Close Chat Window"
            .iconName=${'cross'}
            .jslogContext=${'ai-chat.close-devtools'}
            .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
            @click=${() => Host.InspectorFrontendHost.InspectorFrontendHostInstance.closeWindow()}></devtools-button>
      </devtools-toolbar>
    </div>
  `;
    // clang-format on
}
let aiChatPanelInstance = null;
// For testing purposes - allows resetting the singleton instance
export function resetAIChatPanelInstanceForTesting() {
    aiChatPanelInstance = null;
}
export class AIChatPanel extends UI.Panel.Panel {
    static instance() {
        if (!aiChatPanelInstance) {
            aiChatPanelInstance = new _a();
        }
        return aiChatPanelInstance;
    }
    static getMiniModel() {
        const instance = _a.instance();
        // Validate the model selection before returning
        __classPrivateFieldGet(instance, _AIChatPanel_instances, "m", _AIChatPanel_validateAndFixModelSelections).call(instance);
        return __classPrivateFieldGet(instance, _AIChatPanel_miniModel, "f") || __classPrivateFieldGet(instance, _AIChatPanel_selectedModel, "f");
    }
    static getNanoModel() {
        const instance = _a.instance();
        // Validate the model selection before returning
        __classPrivateFieldGet(instance, _AIChatPanel_instances, "m", _AIChatPanel_validateAndFixModelSelections).call(instance);
        return __classPrivateFieldGet(instance, _AIChatPanel_nanoModel, "f") || __classPrivateFieldGet(instance, _AIChatPanel_miniModel, "f") || __classPrivateFieldGet(instance, _AIChatPanel_selectedModel, "f");
    }
    static getNanoModelWithProvider() {
        const modelName = _a.getNanoModel();
        const provider = _a.getProviderForModel(modelName);
        return {
            model: modelName,
            provider: provider
        };
    }
    static getMiniModelWithProvider() {
        const modelName = _a.getMiniModel();
        const provider = _a.getProviderForModel(modelName);
        return {
            model: modelName,
            provider: provider
        };
    }
    static getProviderForModel(modelName) {
        // Get model options lookup
        const allModelOptions = _a.getModelOptions();
        const modelOption = allModelOptions.find(option => option.value === modelName);
        const originalProvider = modelOption?.type || 'openai';
        // Check if the model's original provider is available in the registry
        if (LLMProviderRegistry.hasProvider(originalProvider)) {
            return originalProvider;
        }
        // If the original provider isn't available, fall back to the currently selected provider
        const currentProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
        logger.debug(`Provider ${originalProvider} not available for model ${modelName}, falling back to current provider: ${currentProvider}`);
        return currentProvider;
    }
    /**
     * Gets the currently selected provider from localStorage
     * @returns The currently selected provider
     */
    static getCurrentProvider() {
        return (localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai');
    }
    /**
     * Checks if a model supports vision/multimodal capabilities
     * @param modelName The model name to check
     * @returns True if the model supports vision, false otherwise
     */
    static async isVisionCapable(modelName) {
        logger.debug(`[Vision Check] Checking vision capability for model: ${modelName}`);
        // First, try to get the provider for this model and use its vision detection API
        try {
            const provider = _a.getProviderForModel(modelName);
            logger.debug(`[Vision Check] Model ${modelName} uses provider: ${provider}`);
            if (provider === 'openrouter') {
                // Use OpenRouter's API-based vision detection
                const { LLMProviderRegistry } = await import('../LLM/LLMProviderRegistry.js');
                const providerInstance = LLMProviderRegistry.getProvider('openrouter');
                if (providerInstance && typeof providerInstance.supportsVision === 'function') {
                    const isVision = await providerInstance.supportsVision(modelName);
                    logger.info(`[Vision Check] OpenRouter API result for ${modelName}: ${isVision}`);
                    return isVision;
                }
            }
            // For other providers, try the registry approach
            const llmClient = LLMClient.getInstance();
            const allModels = await llmClient.getAvailableModels();
            logger.debug(`[Vision Check] Got ${allModels.length} models from registry`);
            const modelInfo = allModels.find(model => model.id === modelName);
            if (modelInfo && modelInfo.capabilities) {
                const isVision = modelInfo.capabilities.vision;
                logger.info(`[Vision Check] Model ${modelName} vision capability from registry: ${isVision}`);
                return isVision;
            }
        }
        catch (error) {
            logger.warn(`[Vision Check] Provider-specific vision check failed for ${modelName}:`, error);
        }
        // Fallback: Check if model name contains known vision model patterns
        const modelNameWithoutPrefix = modelName.toLowerCase().replace(/^[^/]+\//, '');
        logger.debug(`[Vision Check] Falling back to pattern matching - Original: ${modelName}, Without prefix: ${modelNameWithoutPrefix}`);
        const visionModelPatterns = [
            'gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-4-vision',
            'claude-3', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus', 'claude-3.5-sonnet', 'claude-4',
            'gemini', 'gemini-pro', 'gemini-2.5', 'gemini-pro-vision',
            'llava', 'vision', 'multimodal'
        ];
        const matchedPattern = visionModelPatterns.find(pattern => modelNameWithoutPrefix.includes(pattern.toLowerCase()) ||
            modelName.toLowerCase().includes(pattern.toLowerCase()));
        const isVisionFromPattern = !!matchedPattern;
        logger.info(`[Vision Check] Pattern matching result for ${modelName}: ${isVisionFromPattern}${matchedPattern ? ` (matched: ${matchedPattern})` : ''}`);
        return isVisionFromPattern;
    }
    /**
     * Gets all model options or filters by provider
     * @param provider Optional provider to filter by
     * @returns Array of model options
     */
    static getModelOptions(provider) {
        // Try to get from all_model_options first (comprehensive list)
        const allModelOptionsStr = localStorage.getItem('ai_chat_all_model_options');
        if (allModelOptionsStr) {
            try {
                const allModelOptions = JSON.parse(allModelOptionsStr);
                // If provider is specified, filter by it
                return provider ? allModelOptions.filter((opt) => opt.type === provider) : allModelOptions;
            }
            catch (error) {
                console.warn('Failed to parse ai_chat_all_model_options from localStorage, removing corrupted data:', error);
                localStorage.removeItem('ai_chat_all_model_options');
            }
        }
        // Fallback to legacy model_options if all_model_options doesn't exist
        const modelOptionsStr = localStorage.getItem('ai_chat_model_options');
        if (modelOptionsStr) {
            try {
                const modelOptions = JSON.parse(modelOptionsStr);
                // If we got legacy options, migrate them to all_model_options for future use
                localStorage.setItem('ai_chat_all_model_options', modelOptionsStr);
                // Apply provider filter if needed
                return provider ? modelOptions.filter((opt) => opt.type === provider) : modelOptions;
            }
            catch (error) {
                console.warn('Failed to parse ai_chat_model_options from localStorage, removing corrupted data:', error);
                localStorage.removeItem('ai_chat_model_options');
            }
        }
        // If nothing is found, return default OpenAI models
        return provider === 'litellm' ? [] : DEFAULT_OPENAI_MODELS;
    }
    /**
     * Updates model options with new provider models
     * @param providerModels Models fetched from any provider (LiteLLM, Groq, etc.)
     * @param hadWildcard Whether LiteLLM returned a wildcard model
     * @returns Updated model options
     */
    static updateModelOptions(providerModels = [], hadWildcard = false) {
        // Get the selected provider (for context, but we store all models regardless)
        const selectedProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
        // Get existing models from localStorage
        let existingAllModels = [];
        try {
            existingAllModels = JSON.parse(localStorage.getItem('ai_chat_all_model_options') || '[]');
        }
        catch (error) {
            console.warn('Failed to parse ai_chat_all_model_options from localStorage, using empty array:', error);
            localStorage.removeItem('ai_chat_all_model_options');
        }
        // Get existing custom models (if any) - these are for LiteLLM only
        let savedCustomModels = [];
        try {
            savedCustomModels = JSON.parse(localStorage.getItem('ai_chat_custom_models') || '[]');
        }
        catch (error) {
            console.warn('Failed to parse ai_chat_custom_models from localStorage, using empty array:', error);
            localStorage.removeItem('ai_chat_custom_models');
        }
        const customModels = savedCustomModels.map((model) => ({
            value: model,
            label: `LiteLLM: ${model}`,
            type: 'litellm'
        }));
        // Separate existing models by provider type
        const existingOpenAIModels = existingAllModels.filter((m) => m.type === 'openai');
        const existingLiteLLMModels = existingAllModels.filter((m) => m.type === 'litellm');
        const existingGroqModels = existingAllModels.filter((m) => m.type === 'groq');
        const existingOpenRouterModels = existingAllModels.filter((m) => m.type === 'openrouter');
        // Update models based on what type of models we're adding
        // Always use DEFAULT_OPENAI_MODELS for OpenAI to ensure we have the latest hardcoded list
        let updatedOpenAIModels = DEFAULT_OPENAI_MODELS;
        let updatedLiteLLMModels = existingLiteLLMModels;
        let updatedGroqModels = existingGroqModels;
        let updatedOpenRouterModels = existingOpenRouterModels;
        // Replace models for the provider type we're updating
        if (providerModels.length > 0) {
            const firstModelType = providerModels[0].type;
            if (firstModelType === 'litellm') {
                updatedLiteLLMModels = [...customModels, ...providerModels];
            }
            else if (firstModelType === 'groq') {
                updatedGroqModels = providerModels;
            }
            else if (firstModelType === 'openrouter') {
                updatedOpenRouterModels = providerModels;
            }
            else if (firstModelType === 'openai') {
                updatedOpenAIModels = providerModels;
            }
        }
        // Create the comprehensive model list with all models from all providers
        const allModels = [
            ...updatedOpenAIModels,
            ...updatedLiteLLMModels,
            ...updatedGroqModels,
            ...updatedOpenRouterModels
        ];
        // Save the comprehensive list to localStorage
        localStorage.setItem('ai_chat_all_model_options', JSON.stringify(allModels));
        // For backwards compatibility, also update the MODEL_OPTIONS variable
        // based on the currently selected provider
        if (selectedProvider === 'openai') {
            MODEL_OPTIONS = updatedOpenAIModels;
        }
        else if (selectedProvider === 'groq') {
            MODEL_OPTIONS = updatedGroqModels;
            // Add placeholder if no Groq models available
            if (MODEL_OPTIONS.length === 0) {
                MODEL_OPTIONS.push({
                    value: '_placeholder_no_models',
                    label: 'Groq: Please configure API key in settings',
                    type: 'groq'
                });
            }
        }
        else if (selectedProvider === 'openrouter') {
            MODEL_OPTIONS = updatedOpenRouterModels;
            // Add placeholder if no OpenRouter models available
            if (MODEL_OPTIONS.length === 0) {
                MODEL_OPTIONS.push({
                    value: '_placeholder_no_models',
                    label: 'OpenRouter: Please configure API key in settings',
                    type: 'openrouter'
                });
            }
        }
        else {
            // For LiteLLM provider, include custom models and fetched models
            MODEL_OPTIONS = updatedLiteLLMModels;
            // Add placeholder if needed for LiteLLM when we have no models
            if (hadWildcard && MODEL_OPTIONS.length === 0) {
                MODEL_OPTIONS.push({
                    value: '_placeholder_add_custom',
                    label: 'LiteLLM: Please add custom models in settings',
                    type: 'litellm'
                });
            }
        }
        // Save MODEL_OPTIONS to localStorage for backwards compatibility
        localStorage.setItem('ai_chat_model_options', JSON.stringify(MODEL_OPTIONS));
        logger.info('Updated model options:', {
            provider: selectedProvider,
            openaiModels: updatedOpenAIModels.length,
            litellmModels: updatedLiteLLMModels.length,
            groqModels: updatedGroqModels.length,
            openrouterModels: updatedOpenRouterModels.length,
            totalModelOptions: MODEL_OPTIONS.length,
            allModelsLength: allModels.length
        });
        return allModels;
    }
    /**
     * Adds a custom model to the options
     * @param modelName Name of the model to add
     * @param modelType Type of the model ('openai' or 'litellm')
     * @returns Updated model options
     */
    static addCustomModelOption(modelName, modelType = 'litellm') {
        // Get existing custom models
        const savedCustomModels = JSON.parse(localStorage.getItem('ai_chat_custom_models') || '[]');
        // Check if the model already exists
        if (savedCustomModels.includes(modelName)) {
            logger.info(`Custom model ${modelName} already exists, not adding again`);
            return _a.getModelOptions();
        }
        // Add the new model to custom models
        savedCustomModels.push(modelName);
        localStorage.setItem('ai_chat_custom_models', JSON.stringify(savedCustomModels));
        // Create the model option object
        const newOption = {
            value: modelName,
            label: modelType === 'litellm' ? `LiteLLM: ${modelName}` :
                modelType === 'groq' ? `Groq: ${modelName}` :
                    modelType === 'openrouter' ? `OpenRouter: ${modelName}` :
                        `OpenAI: ${modelName}`,
            type: modelType
        };
        // Get all existing model options
        const allModelOptions = _a.getModelOptions();
        // Add the new option
        const updatedOptions = [...allModelOptions, newOption];
        localStorage.setItem('ai_chat_all_model_options', JSON.stringify(updatedOptions));
        // Update MODEL_OPTIONS for backwards compatibility if provider matches
        const currentProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
        if ((currentProvider === 'openai' && modelType === 'openai') ||
            (currentProvider === 'litellm' && modelType === 'litellm') ||
            (currentProvider === 'groq' && modelType === 'groq')) {
            MODEL_OPTIONS = [...MODEL_OPTIONS, newOption];
            localStorage.setItem('ai_chat_model_options', JSON.stringify(MODEL_OPTIONS));
        }
        return updatedOptions;
    }
    /**
     * Clears cached model data to force refresh from defaults
     */
    static clearModelCache() {
        localStorage.removeItem('ai_chat_all_model_options');
        localStorage.removeItem('ai_chat_model_options');
        logger.info('Cleared model cache - will use DEFAULT_OPENAI_MODELS on next refresh');
    }
    /**
     * Removes a custom model from the options
     * @param modelName Name of the model to remove
     * @returns Updated model options
     */
    static removeCustomModelOption(modelName) {
        // Get existing custom models
        const savedCustomModels = JSON.parse(localStorage.getItem('ai_chat_custom_models') || '[]');
        // Check if the model exists
        if (!savedCustomModels.includes(modelName)) {
            logger.info(`Custom model ${modelName} not found, nothing to remove`);
            return _a.getModelOptions();
        }
        // Remove the model from custom models
        const updatedCustomModels = savedCustomModels.filter((model) => model !== modelName);
        localStorage.setItem('ai_chat_custom_models', JSON.stringify(updatedCustomModels));
        // Get all existing model options and remove the specified one
        const allModelOptions = _a.getModelOptions();
        const updatedOptions = allModelOptions.filter(option => option.value !== modelName);
        localStorage.setItem('ai_chat_all_model_options', JSON.stringify(updatedOptions));
        // Update MODEL_OPTIONS for backwards compatibility
        MODEL_OPTIONS = MODEL_OPTIONS.filter(option => option.value !== modelName);
        localStorage.setItem('ai_chat_model_options', JSON.stringify(MODEL_OPTIONS));
        return updatedOptions;
    }
    constructor() {
        super(_a.panelName);
        _AIChatPanel_instances.add(this);
        // TODO: Move messages to a separate state object
        _AIChatPanel_messages.set(this, []);
        _AIChatPanel_chatView.set(this, void 0); // Using the definite assignment assertion
        _AIChatPanel_toolbarContainer.set(this, void 0);
        _AIChatPanel_chatViewContainer.set(this, void 0);
        _AIChatPanel_isTextInputEmpty.set(this, true);
        _AIChatPanel_agentService.set(this, AgentService.getInstance());
        _AIChatPanel_isProcessing.set(this, false);
        _AIChatPanel_imageInput.set(this, void 0);
        _AIChatPanel_selectedAgentType.set(this, null);
        _AIChatPanel_selectedModel.set(this, MODEL_OPTIONS.length > 0 ? MODEL_OPTIONS[0].value : ''); // Default to first model if available
        _AIChatPanel_miniModel.set(this, ''); // Mini model selection
        _AIChatPanel_nanoModel.set(this, ''); // Nano model selection
        _AIChatPanel_canSendMessages.set(this, false); // Add flag to track if we can send messages (has required credentials)
        _AIChatPanel_settingsButton.set(this, null); // Reference to the settings button
        _AIChatPanel_liteLLMApiKey.set(this, null); // LiteLLM API key
        _AIChatPanel_liteLLMEndpoint.set(this, null); // LiteLLM endpoint
        _AIChatPanel_apiKey.set(this, null); // Regular API key
        // Initialize storage monitoring for debugging
        StorageMonitor.getInstance();
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setupUI).call(this);
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setupInitialState).call(this);
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setupOAuthEventListeners).call(this);
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_initializeAgentService).call(this);
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_initializeEvaluationService).call(this);
        this.performUpdate();
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_fetchLiteLLMModelsOnLoad).call(this);
    }
    /**
     * Public wrapper for testing the model validation logic
     * @internal This method is for testing purposes only
     */
    validateAndFixModelSelectionsForTesting() {
        return __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_validateAndFixModelSelections).call(this);
    }
    getSelectedModel() {
        return __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f");
    }
    /**
     * Public method to refresh credential validation and agent service
     * Can be called from settings dialog or other components
     */
    refreshCredentials() {
        logger.info('=== MANUAL CREDENTIAL REFRESH REQUESTED ===');
        logger.info('Timestamp:', new Date().toISOString());
        logger.info('Current OpenRouter storage state:');
        const apiKey = localStorage.getItem('ai_chat_openrouter_api_key');
        const authMethod = localStorage.getItem('openrouter_auth_method');
        logger.info('- API key exists:', !!apiKey);
        logger.info('- API key length:', apiKey?.length || 0);
        logger.info('- Auth method:', authMethod);
        logger.info('Calling #initializeAgentService()...');
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_initializeAgentService).call(this);
    }
    /**
     * Public method to send a message (passed to ChatView)
     */
    async sendMessage(text, imageInput) {
        if (!text.trim() || __classPrivateFieldGet(this, _AIChatPanel_isProcessing, "f")) {
            return;
        }
        // If we can't send messages due to missing credentials, add error message and return
        if (!__classPrivateFieldGet(this, _AIChatPanel_canSendMessages, "f")) {
            __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_addUserMessage).call(this, text, imageInput);
            __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_addCredentialErrorMessage).call(this);
            return;
        }
        // Validate and fix model selections before proceeding
        const modelsValid = __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_validateAndFixModelSelections).call(this);
        // If validation fixed models, update the UI to reflect changes
        if (!modelsValid) {
            logger.info('Model selections were fixed, updating UI...');
            this.performUpdate();
        }
        // Validate that the selected model's provider is registered
        const modelProvider = _a.getProviderForModel(__classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"));
        // Check if the provider is registered in the LLM registry
        if (!LLMProviderRegistry.hasProvider(modelProvider)) {
            logger.warn(`Provider ${modelProvider} not registered for model ${__classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f")}, re-initializing...`);
            // Re-initialize the agent service to ensure provider is registered
            __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_initializeAgentService).call(this);
            // Check again after initialization
            if (!LLMProviderRegistry.hasProvider(modelProvider)) {
                __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_addUserMessage).call(this, text, imageInput);
                const errorMessage = {
                    entity: ChatMessageEntity.MODEL,
                    action: 'final',
                    error: `The ${modelProvider} provider is not properly initialized. Please check your API key and settings.`,
                    isFinalAnswer: true,
                };
                __classPrivateFieldGet(this, _AIChatPanel_messages, "f").push(errorMessage);
                this.performUpdate();
                __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setProcessingState).call(this, false);
                return;
            }
        }
        // Final validation: check if model exists in provider's available models
        const availableModels = _a.getModelOptions(modelProvider);
        const modelExists = availableModels.some(model => model.value === __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"));
        if (!modelExists) {
            logger.error(`Selected model ${__classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f")} not found in ${modelProvider} provider's model list`);
            __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_addUserMessage).call(this, text, imageInput);
            const errorMessage = {
                entity: ChatMessageEntity.MODEL,
                action: 'final',
                error: `The model "${__classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f")}" is not available in the ${modelProvider} provider. Please fetch the latest models in Settings or select a different model.`,
                isFinalAnswer: true,
            };
            __classPrivateFieldGet(this, _AIChatPanel_messages, "f").push(errorMessage);
            this.performUpdate();
            __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setProcessingState).call(this, false);
            return;
        }
        // Set processing state
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setProcessingState).call(this, true);
        try {
            // Pass the selected agent type to the agent service
            await __classPrivateFieldGet(this, _AIChatPanel_agentService, "f").sendMessage(text, imageInput, __classPrivateFieldGet(this, _AIChatPanel_selectedAgentType, "f"));
            // MESSAGES_CHANGED event from the agent service will update with AI response
        }
        catch (error) {
            __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_handleSendMessageError).call(this, error);
        }
    }
    wasShown() {
        this.performUpdate();
        __classPrivateFieldGet(this, _AIChatPanel_chatView, "f")?.focus();
    }
    /**
     * Cleanup when panel is hidden
     */
    willHide() {
        // Explicitly remove any event listeners to prevent memory leaks
        __classPrivateFieldGet(this, _AIChatPanel_agentService, "f").removeEventListener(AgentEvents.MESSAGES_CHANGED, __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_handleMessagesChanged).bind(this));
    }
    /**
     * Updates the UI components with the current state
     */
    performUpdate() {
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateToolbar).call(this);
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateSettingsButtonHighlight).call(this);
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateChatViewState).call(this);
    }
    /**
     * Sets up the panel as a root panel
     */
    markAsRoot() {
        super.markAsRoot();
        // Ensure the content element has appropriate accessibility attributes
        if (this.contentElement) {
            this.contentElement.setAttribute('aria-label', 'AI Chat Panel');
            this.contentElement.setAttribute('role', 'region');
        }
    }
}
_a = AIChatPanel, _AIChatPanel_messages = new WeakMap(), _AIChatPanel_chatView = new WeakMap(), _AIChatPanel_toolbarContainer = new WeakMap(), _AIChatPanel_chatViewContainer = new WeakMap(), _AIChatPanel_isTextInputEmpty = new WeakMap(), _AIChatPanel_agentService = new WeakMap(), _AIChatPanel_isProcessing = new WeakMap(), _AIChatPanel_imageInput = new WeakMap(), _AIChatPanel_selectedAgentType = new WeakMap(), _AIChatPanel_selectedModel = new WeakMap(), _AIChatPanel_miniModel = new WeakMap(), _AIChatPanel_nanoModel = new WeakMap(), _AIChatPanel_canSendMessages = new WeakMap(), _AIChatPanel_settingsButton = new WeakMap(), _AIChatPanel_liteLLMApiKey = new WeakMap(), _AIChatPanel_liteLLMEndpoint = new WeakMap(), _AIChatPanel_apiKey = new WeakMap(), _AIChatPanel_instances = new WeakSet(), _AIChatPanel_setupUI = function _AIChatPanel_setupUI() {
    // Register CSS styles
    this.registerRequiredCSS(chatViewStyles);
    // Set flex layout for the content element to ensure it takes full height
    this.contentElement.style.display = 'flex';
    this.contentElement.style.flexDirection = 'column';
    this.contentElement.style.height = '100%';
    // Create container for the toolbar
    __classPrivateFieldSet(this, _AIChatPanel_toolbarContainer, document.createElement('div'), "f");
    this.contentElement.appendChild(__classPrivateFieldGet(this, _AIChatPanel_toolbarContainer, "f"));
    // Create container for the chat view
    __classPrivateFieldSet(this, _AIChatPanel_chatViewContainer, document.createElement('div'), "f");
    __classPrivateFieldGet(this, _AIChatPanel_chatViewContainer, "f").style.flex = '1';
    __classPrivateFieldGet(this, _AIChatPanel_chatViewContainer, "f").style.overflow = 'hidden';
    this.contentElement.appendChild(__classPrivateFieldGet(this, _AIChatPanel_chatViewContainer, "f"));
    // Create ChatView and append it to its container
    __classPrivateFieldSet(this, _AIChatPanel_chatView, new ChatView(), "f");
    __classPrivateFieldGet(this, _AIChatPanel_chatView, "f").style.flexGrow = '1';
    __classPrivateFieldGet(this, _AIChatPanel_chatView, "f").style.overflow = 'auto';
    __classPrivateFieldGet(this, _AIChatPanel_chatViewContainer, "f").appendChild(__classPrivateFieldGet(this, _AIChatPanel_chatView, "f"));
    // Add event listener for manual setup requests from ChatView
    __classPrivateFieldGet(this, _AIChatPanel_chatView, "f").addEventListener('manual-setup-requested', __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_handleManualSetupRequest).bind(this));
}, _AIChatPanel_setupInitialState = function _AIChatPanel_setupInitialState() {
    // Load API keys and configurations from localStorage first
    __classPrivateFieldSet(this, _AIChatPanel_apiKey, localStorage.getItem('ai_chat_api_key'), "f");
    __classPrivateFieldSet(this, _AIChatPanel_liteLLMApiKey, localStorage.getItem(LITELLM_API_KEY_STORAGE_KEY), "f");
    __classPrivateFieldSet(this, _AIChatPanel_liteLLMEndpoint, localStorage.getItem(LITELLM_ENDPOINT_KEY), "f");
    // Load agent type if previously set
    const savedAgentType = localStorage.getItem('ai_chat_agent_type');
    if (savedAgentType) {
        __classPrivateFieldSet(this, _AIChatPanel_selectedAgentType, savedAgentType, "f");
    }
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setupModelOptions).call(this);
    // Only add welcome message if credentials are available (no OAuth login needed)
    if (__classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_hasAnyProviderCredentials).call(this)) {
        __classPrivateFieldGet(this, _AIChatPanel_messages, "f").push({
            entity: ChatMessageEntity.MODEL,
            action: 'final',
            answer: i18nString(UIStrings.welcomeMessage),
            isFinalAnswer: true,
        });
    }
}, _AIChatPanel_setupModelOptions = function _AIChatPanel_setupModelOptions() {
    // Get the selected provider
    const selectedProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    // Initialize MODEL_OPTIONS based on the selected provider
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateModelOptions).call(this, [], false);
    // Load custom models
    const savedCustomModels = JSON.parse(localStorage.getItem('ai_chat_custom_models') || '[]');
    // If we have custom models and using LiteLLM, add them
    if (savedCustomModels.length > 0 && selectedProvider === 'litellm') {
        // Add custom models to MODEL_OPTIONS
        const customOptions = savedCustomModels.map((model) => ({
            value: model,
            label: `LiteLLM: ${model}`,
            type: 'litellm'
        }));
        MODEL_OPTIONS = [...MODEL_OPTIONS, ...customOptions];
        // Save MODEL_OPTIONS to localStorage
        localStorage.setItem('ai_chat_model_options', JSON.stringify(MODEL_OPTIONS));
    }
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_loadModelSelections).call(this);
    // Validate models after loading
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_validateAndFixModelSelections).call(this);
}, _AIChatPanel_loadModelSelections = function _AIChatPanel_loadModelSelections() {
    // Get the current provider
    const currentProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    const providerDefaults = DEFAULT_PROVIDER_MODELS[currentProvider] || DEFAULT_PROVIDER_MODELS.openai;
    // Load the selected model
    const storedModel = localStorage.getItem(MODEL_SELECTION_KEY);
    if (MODEL_OPTIONS.length === 0) {
        logger.warn('No model options available when loading model selections');
        return;
    }
    if (storedModel && MODEL_OPTIONS.some(option => option.value === storedModel)) {
        __classPrivateFieldSet(this, _AIChatPanel_selectedModel, storedModel, "f");
    }
    else if (MODEL_OPTIONS.length > 0) {
        // Check if provider default main model is available
        if (providerDefaults.main && MODEL_OPTIONS.some(option => option.value === providerDefaults.main)) {
            __classPrivateFieldSet(this, _AIChatPanel_selectedModel, providerDefaults.main, "f");
        }
        else {
            // Otherwise, use the first available model
            __classPrivateFieldSet(this, _AIChatPanel_selectedModel, MODEL_OPTIONS[0].value, "f");
        }
        localStorage.setItem(MODEL_SELECTION_KEY, __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"));
    }
    // Load mini model - check that it belongs to current provider
    const storedMiniModel = localStorage.getItem(MINI_MODEL_STORAGE_KEY);
    const storedMiniModelOption = storedMiniModel ? MODEL_OPTIONS.find(option => option.value === storedMiniModel) : null;
    if (storedMiniModelOption && storedMiniModelOption.type === currentProvider && storedMiniModel) {
        __classPrivateFieldSet(this, _AIChatPanel_miniModel, storedMiniModel, "f");
    }
    else if (providerDefaults.mini && MODEL_OPTIONS.some(option => option.value === providerDefaults.mini)) {
        // Use provider default mini model if available
        __classPrivateFieldSet(this, _AIChatPanel_miniModel, providerDefaults.mini, "f");
        localStorage.setItem(MINI_MODEL_STORAGE_KEY, __classPrivateFieldGet(this, _AIChatPanel_miniModel, "f"));
    }
    else {
        __classPrivateFieldSet(this, _AIChatPanel_miniModel, '', "f");
        localStorage.removeItem(MINI_MODEL_STORAGE_KEY);
    }
    // Load nano model - check that it belongs to current provider
    const storedNanoModel = localStorage.getItem(NANO_MODEL_STORAGE_KEY);
    const storedNanoModelOption = storedNanoModel ? MODEL_OPTIONS.find(option => option.value === storedNanoModel) : null;
    if (storedNanoModelOption && storedNanoModelOption.type === currentProvider && storedNanoModel) {
        __classPrivateFieldSet(this, _AIChatPanel_nanoModel, storedNanoModel, "f");
    }
    else if (providerDefaults.nano && MODEL_OPTIONS.some(option => option.value === providerDefaults.nano)) {
        // Use provider default nano model if available
        __classPrivateFieldSet(this, _AIChatPanel_nanoModel, providerDefaults.nano, "f");
        localStorage.setItem(NANO_MODEL_STORAGE_KEY, __classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f"));
    }
    else {
        __classPrivateFieldSet(this, _AIChatPanel_nanoModel, '', "f");
        localStorage.removeItem(NANO_MODEL_STORAGE_KEY);
    }
    logger.info('Loaded model selections:', {
        provider: currentProvider,
        selectedModel: __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"),
        miniModel: __classPrivateFieldGet(this, _AIChatPanel_miniModel, "f"),
        nanoModel: __classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f")
    });
}, _AIChatPanel_validateAndFixModelSelections = function _AIChatPanel_validateAndFixModelSelections() {
    logger.info('=== VALIDATING MODEL SELECTIONS ===');
    const currentProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    const providerDefaults = DEFAULT_PROVIDER_MODELS[currentProvider] || DEFAULT_PROVIDER_MODELS.openai;
    const availableModels = _a.getModelOptions(currentProvider);
    let allValid = true;
    // Log current state
    logger.info('Current state:', {
        provider: currentProvider,
        selectedModel: __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"),
        miniModel: __classPrivateFieldGet(this, _AIChatPanel_miniModel, "f"),
        nanoModel: __classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f"),
        availableModelsCount: availableModels.length
    });
    // If no models available for provider, we have a problem
    if (availableModels.length === 0) {
        logger.error(`No models available for provider ${currentProvider}`);
        return false;
    }
    // Validate main model
    const mainModelValid = availableModels.some(m => m.value === __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"));
    if (!mainModelValid) {
        logger.warn(`Main model ${__classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f")} not valid for ${currentProvider}, resetting...`);
        allValid = false;
        // Try provider default first
        if (providerDefaults.main && availableModels.some(m => m.value === providerDefaults.main)) {
            __classPrivateFieldSet(this, _AIChatPanel_selectedModel, providerDefaults.main, "f");
            logger.info(`Reset main model to provider default: ${providerDefaults.main}`);
        }
        else {
            // Fall back to first available model
            __classPrivateFieldSet(this, _AIChatPanel_selectedModel, availableModels[0].value, "f");
            logger.info(`Reset main model to first available: ${__classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f")}`);
        }
        localStorage.setItem(MODEL_SELECTION_KEY, __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"));
    }
    // Validate mini model
    if (__classPrivateFieldGet(this, _AIChatPanel_miniModel, "f")) {
        const miniModelValid = availableModels.some(m => m.value === __classPrivateFieldGet(this, _AIChatPanel_miniModel, "f"));
        if (!miniModelValid) {
            logger.warn(`Mini model ${__classPrivateFieldGet(this, _AIChatPanel_miniModel, "f")} not valid for ${currentProvider}, resetting...`);
            allValid = false;
            // Try provider default first
            if (providerDefaults.mini && availableModels.some(m => m.value === providerDefaults.mini)) {
                __classPrivateFieldSet(this, _AIChatPanel_miniModel, providerDefaults.mini, "f");
                logger.info(`Reset mini model to provider default: ${providerDefaults.mini}`);
                localStorage.setItem(MINI_MODEL_STORAGE_KEY, __classPrivateFieldGet(this, _AIChatPanel_miniModel, "f"));
            }
            else {
                // Clear mini model to fall back to main model
                __classPrivateFieldSet(this, _AIChatPanel_miniModel, '', "f");
                logger.info('Cleared mini model to fall back to main model');
                localStorage.removeItem(MINI_MODEL_STORAGE_KEY);
            }
        }
    }
    // Validate nano model
    if (__classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f")) {
        const nanoModelValid = availableModels.some(m => m.value === __classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f"));
        if (!nanoModelValid) {
            logger.warn(`Nano model ${__classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f")} not valid for ${currentProvider}, resetting...`);
            allValid = false;
            // Try provider default first
            if (providerDefaults.nano && availableModels.some(m => m.value === providerDefaults.nano)) {
                __classPrivateFieldSet(this, _AIChatPanel_nanoModel, providerDefaults.nano, "f");
                logger.info(`Reset nano model to provider default: ${providerDefaults.nano}`);
                localStorage.setItem(NANO_MODEL_STORAGE_KEY, __classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f"));
            }
            else {
                // Clear nano model to fall back to mini/main model
                __classPrivateFieldSet(this, _AIChatPanel_nanoModel, '', "f");
                logger.info('Cleared nano model to fall back to mini/main model');
                localStorage.removeItem(NANO_MODEL_STORAGE_KEY);
            }
        }
    }
    // Log final state
    logger.info('Validation complete:', {
        allValid,
        finalSelectedModel: __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"),
        finalMiniModel: __classPrivateFieldGet(this, _AIChatPanel_miniModel, "f"),
        finalNanoModel: __classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f")
    });
    return allValid;
}, _AIChatPanel_setupOAuthEventListeners = function _AIChatPanel_setupOAuthEventListeners() {
    // Listen for OAuth success events
    window.addEventListener('openrouter-oauth-success', () => {
        logger.info('=== OAUTH SUCCESS EVENT RECEIVED IN AICHATPANEL ===');
        logger.info('Timestamp:', new Date().toISOString());
        logger.info('Current localStorage state for OpenRouter:');
        const apiKey = localStorage.getItem('ai_chat_openrouter_api_key');
        const authMethod = localStorage.getItem('openrouter_auth_method');
        logger.info('- API key exists:', !!apiKey);
        logger.info('- API key length:', apiKey?.length || 0);
        logger.info('- Auth method:', authMethod);
        logger.info('Re-initializing agent service after OAuth success...');
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_initializeAgentService).call(this);
    });
    // Listen for OAuth logout events  
    window.addEventListener('openrouter-oauth-logout', () => {
        logger.info('=== OAUTH LOGOUT EVENT RECEIVED IN AICHATPANEL ===');
        logger.info('Re-initializing agent service after OAuth logout...');
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_initializeAgentService).call(this);
    });
    // Listen for localStorage changes (covers manual API key changes too)
    window.addEventListener('storage', (event) => {
        if (event.key === 'ai_chat_openrouter_api_key' ||
            event.key === 'openrouter_auth_method') {
            logger.info('=== STORAGE CHANGE EVENT FOR OPENROUTER ===');
            logger.info('Changed key:', event.key);
            logger.info('Old value exists:', !!event.oldValue);
            logger.info('New value exists:', !!event.newValue);
            logger.info('New value length:', event.newValue?.length || 0);
            logger.info('Re-initializing agent service after storage change...');
            __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_initializeAgentService).call(this);
        }
    });
}, _AIChatPanel_fetchLiteLLMModelsOnLoad = 
/**
 * Fetches LiteLLM models on initial load if needed
 */
async function _AIChatPanel_fetchLiteLLMModelsOnLoad() {
    const selectedProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    // Only fetch LiteLLM models if we're using LiteLLM provider
    if (selectedProvider === 'litellm') {
        await __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_refreshLiteLLMModels).call(this);
    }
    else {
        // Just update model options with empty LiteLLM models
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateModelOptions).call(this, [], false);
    }
}, _AIChatPanel_refreshLiteLLMModels = 
/**
 * Refreshes the list of LiteLLM models from the configured endpoint
 */
async function _AIChatPanel_refreshLiteLLMModels() {
    const liteLLMApiKey = localStorage.getItem(LITELLM_API_KEY_STORAGE_KEY);
    const endpoint = localStorage.getItem(LITELLM_ENDPOINT_KEY);
    if (!endpoint) {
        logger.info('No LiteLLM endpoint configured, skipping refresh');
        // Update with empty LiteLLM models but keep any custom models
        _a.updateModelOptions([], false);
        this.performUpdate();
        return;
    }
    try {
        const { models: litellmModels, hadWildcard } = await __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_fetchLiteLLMModels).call(this, liteLLMApiKey, endpoint);
        // Use the static method
        _a.updateModelOptions(litellmModels, hadWildcard);
        this.performUpdate();
    }
    catch (error) {
        logger.error('Failed to refresh LiteLLM models:', error);
        // Clear LiteLLM models on error
        _a.updateModelOptions([], false);
        this.performUpdate();
    }
}, _AIChatPanel_fetchLiteLLMModels = 
/**
 * Fetches LiteLLM models from the specified endpoint
 * @param apiKey API key to use for the request (optional)
 * @param endpoint The LiteLLM endpoint URL
 * @returns Object containing models and wildcard flag
 */
async function _AIChatPanel_fetchLiteLLMModels(apiKey, endpoint) {
    try {
        // Only attempt to fetch if an endpoint is provided
        if (!endpoint) {
            logger.info('No LiteLLM endpoint provided, skipping model fetch');
            return { models: [], hadWildcard: false };
        }
        // Always fetch fresh models from LiteLLM
        const models = await LLMClient.fetchLiteLLMModels(apiKey, endpoint);
        // Check if wildcard model exists
        const hadWildcard = models.some(model => model.id === '*');
        // Filter out the wildcard "*" model as it's not a real model
        const filteredModels = models.filter(model => model.id !== '*');
        // Transform the models to the format we need
        const litellmModels = filteredModels.map(model => ({
            value: model.id, // Store actual model name
            label: `LiteLLM: ${model.id}`,
            type: 'litellm'
        }));
        logger.info(`Fetched ${litellmModels.length} LiteLLM models, hadWildcard: ${hadWildcard}`);
        return { models: litellmModels, hadWildcard };
    }
    catch (error) {
        logger.error('Failed to fetch LiteLLM models:', error);
        // Return empty array on error - no default models
        return { models: [], hadWildcard: false };
    }
}, _AIChatPanel_updateModelOptions = function _AIChatPanel_updateModelOptions(litellmModels, hadWildcard = false) {
    // Call the static method
    _a.updateModelOptions(litellmModels, hadWildcard);
}, _AIChatPanel_refreshGroqModels = 
/**
 * Refreshes Groq models from the API
 */
async function _AIChatPanel_refreshGroqModels() {
    try {
        const groqApiKey = localStorage.getItem('ai_chat_groq_api_key');
        if (!groqApiKey) {
            logger.info('No Groq API key configured, skipping model refresh');
            return;
        }
        const { models: groqModels } = await __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_fetchGroqModels).call(this, groqApiKey);
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateModelOptions).call(this, groqModels, false);
        // Update MODEL_OPTIONS to reflect the fetched models
        this.performUpdate();
    }
    catch (error) {
        logger.error('Failed to refresh Groq models:', error);
        // Clear Groq models on error
        _a.updateModelOptions([], false);
        this.performUpdate();
    }
}, _AIChatPanel_fetchGroqModels = 
/**
 * Fetches Groq models from the API
 * @param apiKey API key to use for the request
 * @returns Object containing models
 */
async function _AIChatPanel_fetchGroqModels(apiKey) {
    try {
        // Fetch models from Groq
        const models = await LLMClient.fetchGroqModels(apiKey);
        // Transform the models to the format we need
        const groqModels = models.map(model => ({
            value: model.id,
            label: `Groq: ${model.id}`,
            type: 'groq'
        }));
        logger.info(`Fetched ${groqModels.length} Groq models`);
        return { models: groqModels };
    }
    catch (error) {
        logger.error('Failed to fetch Groq models:', error);
        // Return empty array on error
        return { models: [] };
    }
}, _AIChatPanel_getModelStatus = function _AIChatPanel_getModelStatus(modelValue) {
    if (!modelValue) {
        logger.warn('getModelStatus called with empty model value');
        return {
            isLiteLLM: false,
            isPlaceholder: false
        };
    }
    const modelOption = MODEL_OPTIONS.find(opt => opt.value === modelValue);
    if (!modelOption) {
        logger.warn(`Model ${modelValue} not found in MODEL_OPTIONS`);
    }
    return {
        isLiteLLM: Boolean(modelOption?.type === 'litellm'),
        isPlaceholder: Boolean(modelOption?.value === '_placeholder_add_custom' ||
            modelOption?.value === '_placeholder_no_models'),
    };
}, _AIChatPanel_initializeEvaluationService = 
/**
 * Initialize the evaluation service if enabled
 */
async function _AIChatPanel_initializeEvaluationService() {
    if (isEvaluationEnabled()) {
        try {
            await connectToEvaluationService();
            logger.info('Auto-connected to evaluation service on panel initialization');
        }
        catch (error) {
            logger.error('Failed to auto-connect to evaluation service:', error);
            // Don't throw - evaluation connection failure shouldn't break the panel
        }
    }
}, _AIChatPanel_initializeAgentService = function _AIChatPanel_initializeAgentService() {
    logger.info("=== INITIALIZING AGENT SERVICE ===");
    logger.info('Timestamp:', new Date().toISOString());
    // Get the selected provider and check model status
    const selectedProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    logger.info('Selected provider:', selectedProvider);
    logger.info('Selected model:', __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"));
    const { isPlaceholder } = __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_getModelStatus).call(this, __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"));
    logger.info('Model is placeholder:', isPlaceholder);
    // Don't initialize if the selected model is a placeholder
    if (isPlaceholder) {
        logger.warn('❌ Model is placeholder, cannot initialize agent service');
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setCanSendMessagesState).call(this, false, "Selected model is a placeholder");
        return;
    }
    // Check credentials based on provider
    logger.info('=== CHECKING CREDENTIALS ===');
    const { canProceed, apiKey } = __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_checkCredentials).call(this, selectedProvider);
    logger.info('Credential check result:');
    logger.info('- Can proceed:', canProceed);
    logger.info('- API key exists:', !!apiKey);
    logger.info('- API key length:', apiKey?.length || 0);
    // Update state if we can't proceed
    if (!canProceed) {
        logger.error('❌ Cannot proceed - missing required credentials');
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setCanSendMessagesState).call(this, false, "Missing required credentials");
        return;
    }
    logger.info('✅ Credentials valid, proceeding with agent service initialization');
    // Remove any existing listeners to prevent duplicates
    __classPrivateFieldGet(this, _AIChatPanel_agentService, "f").removeEventListener(AgentEvents.MESSAGES_CHANGED, __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_handleMessagesChanged).bind(this));
    // Register for messages changed events
    __classPrivateFieldGet(this, _AIChatPanel_agentService, "f").addEventListener(AgentEvents.MESSAGES_CHANGED, __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_handleMessagesChanged).bind(this));
    // Initialize the agent service
    logger.info('Calling agentService.initialize()...');
    __classPrivateFieldGet(this, _AIChatPanel_agentService, "f").initialize(apiKey, __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"))
        .then(() => {
        logger.info('✅ Agent service initialized successfully');
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setCanSendMessagesState).call(this, true, "Agent service initialized successfully");
    })
        .catch(error => {
        logger.error('❌ Failed to initialize AgentService:', error);
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setCanSendMessagesState).call(this, false, `Failed to initialize agent service: ${error instanceof Error ? error.message : String(error)}`);
    });
}, _AIChatPanel_setCanSendMessagesState = function _AIChatPanel_setCanSendMessagesState(canSend, reason) {
    logger.info(`=== SETTING CAN SEND MESSAGES STATE ===`);
    logger.info(`Previous state: ${__classPrivateFieldGet(this, _AIChatPanel_canSendMessages, "f")}`);
    logger.info(`New state: ${canSend}`);
    logger.info(`Reason: ${reason}`);
    logger.info('Timestamp:', new Date().toISOString());
    __classPrivateFieldSet(this, _AIChatPanel_canSendMessages, canSend, "f");
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateChatViewInputState).call(this);
    this.performUpdate();
    logger.info(`✅ State updated - canSendMessages is now: ${__classPrivateFieldGet(this, _AIChatPanel_canSendMessages, "f")}`);
}, _AIChatPanel_hasAnyProviderCredentials = function _AIChatPanel_hasAnyProviderCredentials() {
    logger.info('=== CHECKING ALL PROVIDER CREDENTIALS ===');
    const selectedProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    logger.info('Currently selected provider:', selectedProvider);
    // Check all providers except LiteLLM (unless LiteLLM is selected)
    const providers = ['openai', 'groq', 'openrouter'];
    // Only include LiteLLM if it's the selected provider
    if (selectedProvider === 'litellm') {
        providers.push('litellm');
    }
    logger.info('Providers to check:', providers);
    for (const provider of providers) {
        logger.info(`Checking provider: ${provider}`);
        const validation = LLMClient.validateProviderCredentials(provider);
        logger.info(`Provider ${provider} validation result:`, validation);
        if (validation.isValid) {
            logger.info(`✅ Found valid credentials for provider: ${provider}`);
            return true;
        }
    }
    logger.info('❌ No valid credentials found for any provider');
    return false;
}, _AIChatPanel_checkCredentials = function _AIChatPanel_checkCredentials(provider) {
    logger.info('=== CHECKING CREDENTIALS FOR PROVIDER ===');
    logger.info('Provider:', provider);
    logger.info('Timestamp:', new Date().toISOString());
    // Use provider-specific validation
    logger.info('Calling LLMClient.validateProviderCredentials()...');
    const validation = LLMClient.validateProviderCredentials(provider);
    logger.info('Validation result:');
    logger.info('- Is valid:', validation.isValid);
    logger.info('- Message:', validation.message);
    logger.info('- Missing items:', validation.missingItems);
    let apiKey = null;
    if (validation.isValid) {
        logger.info('Validation passed, retrieving API key...');
        // Get the API key from the provider-specific storage
        try {
            // Create a temporary provider instance to get storage keys
            let tempProvider;
            switch (provider) {
                case 'openai':
                    tempProvider = new OpenAIProvider('');
                    break;
                case 'litellm':
                    tempProvider = new LiteLLMProvider('', '');
                    break;
                case 'groq':
                    tempProvider = new GroqProvider('');
                    break;
                case 'openrouter':
                    tempProvider = new OpenRouterProvider('');
                    break;
                default:
                    logger.warn(`Unknown provider: ${provider}`);
                    return { canProceed: false, apiKey: null };
            }
            const storageKeys = tempProvider.getCredentialStorageKeys();
            logger.info('Storage keys for provider:');
            logger.info('- API key storage key:', storageKeys.apiKey);
            apiKey = localStorage.getItem(storageKeys.apiKey || '') || null;
            logger.info('Retrieved API key:');
            logger.info('- Exists:', !!apiKey);
            logger.info('- Length:', apiKey?.length || 0);
            logger.info('- Prefix:', apiKey?.substring(0, 8) + '...' || 'none');
        }
        catch (error) {
            logger.error(`❌ Failed to get API key for ${provider}:`, error);
            return { canProceed: false, apiKey: null };
        }
    }
    else {
        logger.warn('❌ Validation failed for provider:', provider);
    }
    const result = { canProceed: validation.isValid, apiKey };
    logger.info('=== CREDENTIAL CHECK COMPLETE ===');
    logger.info('Final result:', result);
    return result;
}, _AIChatPanel_updateChatViewInputState = function _AIChatPanel_updateChatViewInputState() {
    if (!__classPrivateFieldGet(this, _AIChatPanel_chatView, "f")) {
        return;
    }
    // Update ChatView data with current input state
    __classPrivateFieldGet(this, _AIChatPanel_chatView, "f").data = {
        ...__classPrivateFieldGet(this, _AIChatPanel_chatView, "f").data,
        isInputDisabled: false, // Keep the input field enabled for better UX
        inputPlaceholder: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_getInputPlaceholderText).call(this)
    };
}, _AIChatPanel_getInputPlaceholderText = function _AIChatPanel_getInputPlaceholderText() {
    const selectedProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    if (__classPrivateFieldGet(this, _AIChatPanel_canSendMessages, "f")) {
        return i18nString(UIStrings.inputPlaceholder);
    }
    else if (selectedProvider === 'litellm') {
        return i18nString(UIStrings.missingLiteLLMEndpoint);
    }
    else {
        return i18nString(UIStrings.missingProviderCredentials);
    }
}, _AIChatPanel_handleOAuthLogin = function _AIChatPanel_handleOAuthLogin() {
    logger.info('OAuth login requested from ChatView');
    // Import OpenRouterOAuth dynamically if needed and start the OAuth flow
    import('../auth/OpenRouterOAuth.js').then(module => {
        const OpenRouterOAuth = module.OpenRouterOAuth;
        OpenRouterOAuth.startAuthFlow().catch(error => {
            logger.error('OAuth flow failed:', error);
            // Could show user notification here
        });
    }).catch(error => {
        logger.error('Failed to import OpenRouterOAuth:', error);
    });
}, _AIChatPanel_handleManualSetupRequest = function _AIChatPanel_handleManualSetupRequest() {
    logger.info('Manual setup requested from ChatView');
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_onSettingsClick).call(this);
}, _AIChatPanel_updateSettingsButtonHighlight = function _AIChatPanel_updateSettingsButtonHighlight() {
    if (!__classPrivateFieldGet(this, _AIChatPanel_canSendMessages, "f") && !__classPrivateFieldGet(this, _AIChatPanel_settingsButton, "f")) {
        // Try to find the settings button after rendering
        __classPrivateFieldSet(this, _AIChatPanel_settingsButton, __classPrivateFieldGet(this, _AIChatPanel_toolbarContainer, "f").querySelector('.ai-chat-right-toolbar devtools-button[title="Settings"]'), "f");
        // Add pulsating animation to draw attention to settings
        if (__classPrivateFieldGet(this, _AIChatPanel_settingsButton, "f")) {
            // Add CSS animation to make it glow/pulse
            __classPrivateFieldGet(this, _AIChatPanel_settingsButton, "f").classList.add('settings-highlight');
            // Add the style to the document head if it doesn't exist yet
            const styleId = 'settings-highlight-style';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
            .settings-highlight {
              animation: pulse 2s infinite;
              position: relative;
            }
            
            @keyframes pulse {
              0% {
                box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0.7);
              }
              70% {
                box-shadow: 0 0 0 6px rgba(var(--color-primary-rgb), 0);
              }
              100% {
                box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0);
              }
            }
          `;
                document.head.appendChild(style);
            }
        }
    }
    else if (__classPrivateFieldGet(this, _AIChatPanel_canSendMessages, "f") && __classPrivateFieldGet(this, _AIChatPanel_settingsButton, "f")) {
        // Remove the highlight if we now have an API key
        __classPrivateFieldGet(this, _AIChatPanel_settingsButton, "f").classList.remove('settings-highlight');
        __classPrivateFieldSet(this, _AIChatPanel_settingsButton, null, "f");
    }
}, _AIChatPanel_handleMessagesChanged = function _AIChatPanel_handleMessagesChanged(event) {
    const messages = event.data;
    __classPrivateFieldSet(this, _AIChatPanel_messages, [...messages], "f");
    // Check if we should exit processing state
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateProcessingState).call(this, messages);
    this.performUpdate();
}, _AIChatPanel_updateProcessingState = function _AIChatPanel_updateProcessingState(messages) {
    // Only set isProcessing to false if the last message is a final answer from the model
    const lastMessage = messages[messages.length - 1];
    if (lastMessage &&
        lastMessage.entity === ChatMessageEntity.MODEL &&
        lastMessage.action === 'final' &&
        lastMessage.isFinalAnswer) {
        __classPrivateFieldSet(this, _AIChatPanel_isProcessing, false, "f");
    }
}, _AIChatPanel_handleModelChanged = 
/**
 * Handles model change from UI and reinitializes the agent service
 * @param model The newly selected model
 */
async function _AIChatPanel_handleModelChanged(model) {
    // Update local state and save to localStorage
    __classPrivateFieldSet(this, _AIChatPanel_selectedModel, model, "f");
    localStorage.setItem(MODEL_SELECTION_KEY, model);
    // Refresh available models list when using LiteLLM
    const selectedProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    if (selectedProvider === 'litellm') {
        await __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_refreshLiteLLMModels).call(this);
    }
    // Reinitialize the agent service with the new model
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_initializeAgentService).call(this);
}, _AIChatPanel_addUserMessage = function _AIChatPanel_addUserMessage(text, imageInput) {
    __classPrivateFieldGet(this, _AIChatPanel_messages, "f").push({
        entity: ChatMessageEntity.USER,
        text,
        imageInput,
    });
    this.performUpdate();
}, _AIChatPanel_addCredentialErrorMessage = function _AIChatPanel_addCredentialErrorMessage() {
    const selectedProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    // Generate provider name safely, with fallback
    const providerName = selectedProvider ?
        selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1) :
        'Provider';
    // Generic error message that works for any provider
    let errorText = `${providerName} credentials are missing or invalid. Please configure them in Settings.`;
    // Special case for LiteLLM which needs endpoint configuration
    if (selectedProvider === 'litellm') {
        errorText = 'LiteLLM endpoint is not configured. Please add endpoint in Settings.';
    }
    const errorMessage = {
        entity: ChatMessageEntity.MODEL,
        action: 'final',
        error: errorText,
        isFinalAnswer: true,
    };
    __classPrivateFieldGet(this, _AIChatPanel_messages, "f").push(errorMessage);
    this.performUpdate();
}, _AIChatPanel_setProcessingState = function _AIChatPanel_setProcessingState(isProcessing) {
    __classPrivateFieldSet(this, _AIChatPanel_isProcessing, isProcessing, "f");
    __classPrivateFieldSet(this, _AIChatPanel_isTextInputEmpty, isProcessing ? true : __classPrivateFieldGet(this, _AIChatPanel_isTextInputEmpty, "f"), "f");
    __classPrivateFieldSet(this, _AIChatPanel_imageInput, isProcessing ? undefined : __classPrivateFieldGet(this, _AIChatPanel_imageInput, "f"), "f");
    this.performUpdate();
}, _AIChatPanel_handleSendMessageError = function _AIChatPanel_handleSendMessageError(error) {
    logger.error('Failed to send message:', error);
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_setProcessingState).call(this, false);
    const errorMessage = {
        entity: ChatMessageEntity.MODEL,
        action: 'final',
        error: error instanceof Error ? error.message : String(error),
        isFinalAnswer: true,
    };
    __classPrivateFieldGet(this, _AIChatPanel_messages, "f").push(errorMessage);
    this.performUpdate();
}, _AIChatPanel_updateToolbar = function _AIChatPanel_updateToolbar() {
    const isCenteredView = __classPrivateFieldGet(this, _AIChatPanel_chatView, "f")?.isCenteredView ?? false;
    Lit.render(toolbarView({
        onNewChatClick: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_onNewChatClick).bind(this),
        onHistoryClick: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_onHistoryClick).bind(this),
        onDeleteClick: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_onDeleteClick).bind(this),
        onHelpClick: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_onHelpClick).bind(this),
        onSettingsClick: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_onSettingsClick).bind(this),
        onEvaluationTestClick: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_onEvaluationTestClick).bind(this),
        onBookmarkClick: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_onBookmarkClick).bind(this),
        isDeleteHistoryButtonVisible: __classPrivateFieldGet(this, _AIChatPanel_messages, "f").length > 1,
        isCenteredView,
        isVectorDBEnabled: isVectorDBEnabled(),
    }), __classPrivateFieldGet(this, _AIChatPanel_toolbarContainer, "f"), { host: this });
}, _AIChatPanel_updateChatViewState = function _AIChatPanel_updateChatViewState() {
    if (!__classPrivateFieldGet(this, _AIChatPanel_chatView, "f")) {
        return;
    }
    try {
        __classPrivateFieldGet(this, _AIChatPanel_chatView, "f").data = {
            onPromptSelected: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_handlePromptSelected).bind(this),
            messages: __classPrivateFieldGet(this, _AIChatPanel_messages, "f"),
            onSendMessage: this.sendMessage.bind(this),
            state: __classPrivateFieldGet(this, _AIChatPanel_isProcessing, "f") ? ChatViewState.LOADING : ChatViewState.IDLE,
            isTextInputEmpty: __classPrivateFieldGet(this, _AIChatPanel_isTextInputEmpty, "f"),
            imageInput: __classPrivateFieldGet(this, _AIChatPanel_imageInput, "f"),
            modelOptions: MODEL_OPTIONS,
            selectedModel: __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"),
            onModelChanged: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_handleModelChanged).bind(this),
            onModelSelectorFocus: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_refreshLiteLLMModels).bind(this),
            selectedAgentType: __classPrivateFieldGet(this, _AIChatPanel_selectedAgentType, "f"),
            isModelSelectorDisabled: __classPrivateFieldGet(this, _AIChatPanel_isProcessing, "f"),
            isInputDisabled: false,
            inputPlaceholder: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_getInputPlaceholderText).call(this),
            // Add OAuth login state
            showOAuthLogin: (() => {
                const hasCredentials = __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_hasAnyProviderCredentials).call(this);
                const showOAuth = !hasCredentials;
                logger.info('=== OAUTH LOGIN UI DECISION ===');
                logger.info('hasAnyProviderCredentials:', hasCredentials);
                logger.info('showOAuthLogin will be set to:', showOAuth);
                return showOAuth;
            })(),
            onOAuthLogin: __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_handleOAuthLogin).bind(this),
        };
    }
    catch (error) {
        logger.error('Error updating ChatView state:', error);
    }
}, _AIChatPanel_handlePromptSelected = function _AIChatPanel_handlePromptSelected(promptType) {
    logger.info('Prompt selected in AIChatPanel:', promptType);
    __classPrivateFieldSet(this, _AIChatPanel_selectedAgentType, promptType, "f");
    // Save selection for future sessions
    if (promptType) {
        localStorage.setItem('ai_chat_agent_type', promptType);
    }
    else {
        localStorage.removeItem('ai_chat_agent_type');
    }
}, _AIChatPanel_onNewChatClick = function _AIChatPanel_onNewChatClick() {
    __classPrivateFieldGet(this, _AIChatPanel_agentService, "f").clearConversation();
    __classPrivateFieldSet(this, _AIChatPanel_messages, __classPrivateFieldGet(this, _AIChatPanel_agentService, "f").getMessages(), "f");
    __classPrivateFieldSet(this, _AIChatPanel_isProcessing, false, "f");
    __classPrivateFieldSet(this, _AIChatPanel_selectedAgentType, null, "f"); // Reset selected agent type
    this.performUpdate();
    UI.ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.newChatCreated));
}, _AIChatPanel_onHistoryClick = function _AIChatPanel_onHistoryClick(_event) {
    // Not yet implemented
    logger.info('History feature not yet implemented');
}, _AIChatPanel_onDeleteClick = function _AIChatPanel_onDeleteClick() {
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_onNewChatClick).call(this);
    UI.ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.chatDeleted));
}, _AIChatPanel_onHelpClick = function _AIChatPanel_onHelpClick() {
    HelpDialog.show();
}, _AIChatPanel_onSettingsClick = function _AIChatPanel_onSettingsClick() {
    SettingsDialog.show(__classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"), __classPrivateFieldGet(this, _AIChatPanel_miniModel, "f"), __classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f"), async () => {
        await __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_handleSettingsChanged).call(this);
    }, __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_fetchLiteLLMModels).bind(this), _a.updateModelOptions, _a.getModelOptions, _a.addCustomModelOption, _a.removeCustomModelOption);
}, _AIChatPanel_onEvaluationTestClick = function _AIChatPanel_onEvaluationTestClick() {
    EvaluationDialog.show();
}, _AIChatPanel_onBookmarkClick = 
/**
 * Handles the bookmark button click event and bookmarks the current page
 */
async function _AIChatPanel_onBookmarkClick() {
    // Show immediate "working" notification that doesn't auto-dismiss
    const workingSnackbar = Snackbars.Snackbar.Snackbar.show({
        message: 'Bookmarking page...',
        closable: true, // Make it closable to prevent auto-dismiss
    });
    workingSnackbar.classList.add('bookmark-notification');
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_applyFullWidthSnackbarStyles).call(this, workingSnackbar);
    try {
        // Import the BookmarkStoreTool dynamically
        const { BookmarkStoreTool } = await import('../tools/BookmarkStoreTool.js');
        const bookmarkTool = new BookmarkStoreTool();
        // Get current page title for better user feedback
        const currentPageTitle = await __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_getCurrentPageTitle).call(this);
        // Execute the bookmark tool
        const result = await bookmarkTool.execute({
            reasoning: 'User clicked bookmark button to save current page',
            includeFullContent: true
        });
        // Close the working notification properly by clicking the close button
        const closeButton = workingSnackbar.shadowRoot?.querySelector('.dismiss');
        if (closeButton) {
            closeButton.click();
        }
        if (result.success) {
            // Show success snackbar with shorter duration
            const successMessage = result.message || `Successfully bookmarked "${result.title || currentPageTitle}"`;
            const snackbar = Snackbars.Snackbar.Snackbar.show({
                message: successMessage,
                closable: false,
            });
            snackbar.dismissTimeout = 3000; // 3 seconds instead of default 5
            snackbar.classList.add('bookmark-notification'); // Add custom CSS class
            __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_applyFullWidthSnackbarStyles).call(this, snackbar); // Apply full-width styles
            logger.info('Page bookmarked successfully', { url: result.url, title: result.title });
        }
        else {
            // Show error snackbar
            const errorSnackbar = Snackbars.Snackbar.Snackbar.show({
                message: `Failed to bookmark page: ${result.error}`,
                closable: true,
            });
            errorSnackbar.classList.add('bookmark-notification'); // Add custom CSS class
            __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_applyFullWidthSnackbarStyles).call(this, errorSnackbar); // Apply full-width styles
            logger.error('Failed to bookmark page', { error: result.error });
        }
    }
    catch (error) {
        // Close the working notification properly by clicking the close button
        const closeButton = workingSnackbar.shadowRoot?.querySelector('.dismiss');
        if (closeButton) {
            closeButton.click();
        }
        logger.error('Error in bookmark click handler', { error: error.message });
        // Show error snackbar
        const errorSnackbar = Snackbars.Snackbar.Snackbar.show({
            message: `Error bookmarking page: ${error.message}`,
            closable: true,
        });
        errorSnackbar.classList.add('bookmark-notification'); // Add custom CSS class
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_applyFullWidthSnackbarStyles).call(this, errorSnackbar); // Apply full-width styles
    }
}, _AIChatPanel_applyFullWidthSnackbarStyles = function _AIChatPanel_applyFullWidthSnackbarStyles(snackbar) {
    // Ensure the slideInFromTop animation is available globally
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_ensureGlobalSnackbarStyles).call(this);
    // Position below toolbar
    const toolbarOffset = 25; // Reduced height
    // Apply inline styles with !important to force override
    snackbar.style.setProperty('position', 'fixed', 'important');
    snackbar.style.setProperty('top', `${toolbarOffset}px`, 'important');
    snackbar.style.setProperty('left', '0', 'important');
    snackbar.style.setProperty('right', '0', 'important');
    snackbar.style.setProperty('bottom', 'unset', 'important');
    snackbar.style.setProperty('width', '100vw', 'important');
    snackbar.style.setProperty('max-width', 'none', 'important');
    snackbar.style.setProperty('margin', '0', 'important');
    snackbar.style.setProperty('z-index', '10000', 'important');
    // Apply styles to the container inside the snackbar
    setTimeout(() => {
        const container = snackbar.shadowRoot?.querySelector('.container');
        if (container) {
            container.style.width = '100%';
            container.style.maxWidth = '100%';
            container.style.borderRadius = '0';
            container.style.borderBottom = '1px solid var(--sys-color-divider)';
            container.style.animation = 'slideInFromTop 200ms cubic-bezier(0, 0, 0.3, 1)';
        }
    }, 0);
}, _AIChatPanel_ensureGlobalSnackbarStyles = function _AIChatPanel_ensureGlobalSnackbarStyles() {
    const styleId = 'bookmark-snackbar-styles';
    if (document.getElementById(styleId)) {
        return; // Already added
    }
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes slideInFromTop {
        from {
          transform: translateY(-100%);
          opacity: 0%;
        }
        to {
          transform: translateY(0);
          opacity: 100%;
        }
      }
    `;
    document.head.appendChild(style);
}, _AIChatPanel_getCurrentPageTitle = 
/**
 * Get current page title for user feedback
 */
async function _AIChatPanel_getCurrentPageTitle() {
    try {
        const target = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
        if (!target)
            return 'Current Page';
        const runtimeModel = target.model(SDK.RuntimeModel.RuntimeModel);
        if (!runtimeModel)
            return 'Current Page';
        const executionContext = runtimeModel.defaultExecutionContext();
        if (!executionContext)
            return 'Current Page';
        const result = await executionContext.evaluate({
            expression: 'document.title',
            objectGroup: 'temp',
            includeCommandLineAPI: false,
            silent: true,
            returnByValue: true,
            generatePreview: false
        }, 
        /* userGesture */ false, 
        /* awaitPromise */ false);
        if ('error' in result) {
            return 'Current Page';
        }
        if (result.object && result.object.value) {
            return result.object.value;
        }
    }
    catch (error) {
        logger.warn('Failed to get current page title', { error });
    }
    return 'Current Page';
}, _AIChatPanel_handleSettingsChanged = 
/**
 * Handles changes made in the settings dialog
 */
async function _AIChatPanel_handleSettingsChanged() {
    // Get the selected provider
    const prevProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    const newProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    logger.info(`Provider changing from ${prevProvider} to ${newProvider}`);
    // Load saved settings
    __classPrivateFieldSet(this, _AIChatPanel_apiKey, localStorage.getItem('ai_chat_api_key'), "f");
    __classPrivateFieldSet(this, _AIChatPanel_liteLLMApiKey, localStorage.getItem(LITELLM_API_KEY_STORAGE_KEY), "f");
    __classPrivateFieldSet(this, _AIChatPanel_liteLLMEndpoint, localStorage.getItem(LITELLM_ENDPOINT_KEY), "f");
    // Reset model options based on the new provider
    if (newProvider === 'litellm') {
        // First update model options with empty models
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateModelOptions).call(this, [], false);
        // Then refresh LiteLLM models
        await __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_refreshLiteLLMModels).call(this);
    }
    else if (newProvider === 'groq') {
        // For Groq, update model options and refresh models if API key exists
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateModelOptions).call(this, [], false);
        const groqApiKey = localStorage.getItem('ai_chat_groq_api_key');
        if (groqApiKey) {
            await __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_refreshGroqModels).call(this);
        }
    }
    else {
        // For OpenAI, just update model options with empty LiteLLM models
        __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateModelOptions).call(this, [], false);
    }
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateModelSelections).call(this);
    // Validate models after updating selections
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_validateAndFixModelSelections).call(this);
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_initializeAgentService).call(this);
    // Update toolbar to reflect vector DB enabled state
    __classPrivateFieldGet(this, _AIChatPanel_instances, "m", _AIChatPanel_updateToolbar).call(this);
}, _AIChatPanel_updateModelSelections = function _AIChatPanel_updateModelSelections() {
    // Get the current provider and its defaults
    const currentProvider = localStorage.getItem(PROVIDER_SELECTION_KEY) || 'openai';
    const providerDefaults = DEFAULT_PROVIDER_MODELS[currentProvider] || DEFAULT_PROVIDER_MODELS.openai;
    // Load saved mini/nano models if valid
    const storedMiniModel = localStorage.getItem(MINI_MODEL_STORAGE_KEY);
    const storedNanoModel = localStorage.getItem(NANO_MODEL_STORAGE_KEY);
    // Check if mini/nano models are still valid with the new MODEL_OPTIONS AND belong to current provider
    const storedMiniModelOption = storedMiniModel ? MODEL_OPTIONS.find(option => option.value === storedMiniModel) : null;
    if (storedMiniModelOption && storedMiniModelOption.type === currentProvider && storedMiniModel) {
        __classPrivateFieldSet(this, _AIChatPanel_miniModel, storedMiniModel, "f");
    }
    else if (providerDefaults.mini && MODEL_OPTIONS.some(option => option.value === providerDefaults.mini)) {
        // Use provider default mini model if available
        __classPrivateFieldSet(this, _AIChatPanel_miniModel, providerDefaults.mini, "f");
        localStorage.setItem(MINI_MODEL_STORAGE_KEY, __classPrivateFieldGet(this, _AIChatPanel_miniModel, "f"));
    }
    else {
        __classPrivateFieldSet(this, _AIChatPanel_miniModel, '', "f");
        localStorage.removeItem(MINI_MODEL_STORAGE_KEY);
    }
    const storedNanoModelOption = storedNanoModel ? MODEL_OPTIONS.find(option => option.value === storedNanoModel) : null;
    if (storedNanoModelOption && storedNanoModelOption.type === currentProvider && storedNanoModel) {
        __classPrivateFieldSet(this, _AIChatPanel_nanoModel, storedNanoModel, "f");
    }
    else if (providerDefaults.nano && MODEL_OPTIONS.some(option => option.value === providerDefaults.nano)) {
        // Use provider default nano model if available
        __classPrivateFieldSet(this, _AIChatPanel_nanoModel, providerDefaults.nano, "f");
        localStorage.setItem(NANO_MODEL_STORAGE_KEY, __classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f"));
    }
    else {
        __classPrivateFieldSet(this, _AIChatPanel_nanoModel, '', "f");
        localStorage.removeItem(NANO_MODEL_STORAGE_KEY);
    }
    // Check if the current selected model is valid for the new provider
    const selectedModelOption = MODEL_OPTIONS.find(opt => opt.value === __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"));
    if (!selectedModelOption || selectedModelOption.type !== currentProvider) {
        logger.info(`Selected model ${__classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f")} is not valid for provider ${currentProvider}`);
        // Try to use provider default main model first
        if (providerDefaults.main && MODEL_OPTIONS.some(option => option.value === providerDefaults.main)) {
            __classPrivateFieldSet(this, _AIChatPanel_selectedModel, providerDefaults.main, "f");
        }
        else if (MODEL_OPTIONS.length > 0) {
            // Otherwise, use the first available model
            __classPrivateFieldSet(this, _AIChatPanel_selectedModel, MODEL_OPTIONS[0].value, "f");
        }
        localStorage.setItem(MODEL_SELECTION_KEY, __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"));
    }
    // Log the updated selections
    logger.info('Updated model selections for provider change:', {
        provider: currentProvider,
        selectedModel: __classPrivateFieldGet(this, _AIChatPanel_selectedModel, "f"),
        miniModel: __classPrivateFieldGet(this, _AIChatPanel_miniModel, "f"),
        nanoModel: __classPrivateFieldGet(this, _AIChatPanel_nanoModel, "f")
    });
    // Trigger UI update to reflect the new model selections
    this.performUpdate();
};
AIChatPanel.panelName = 'ai-chat';
export class ActionDelegate {
    handleAction(_context, actionId) {
        switch (actionId) {
            case 'ai-chat.toggle':
                void UI.ViewManager.ViewManager.instance().showView('ai-chat');
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=AIChatPanel.js.map