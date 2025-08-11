// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var _ChatView_instances, _ChatView_shadow, _ChatView_boundRender, _ChatView_messages, _ChatView_state, _ChatView_agentViewMode, _ChatView_isTextInputEmpty, _ChatView_imageInput, _ChatView_onSendMessage, _ChatView_onImageInputClear, _ChatView_onPromptSelected, _ChatView_textInputElement, _ChatView_markdownRenderer, _ChatView_isFirstMessageView, _ChatView_selectedPromptType, _ChatView_handlePromptButtonClickBound, _ChatView_modelOptions, _ChatView_selectedModel, _ChatView_onModelChanged, _ChatView_onModelSelectorFocus, _ChatView_selectedAgentType, _ChatView_isModelSelectorDisabled, _ChatView_messagesContainerElement, _ChatView_messagesContainerResizeObserver, _ChatView_pinScrollToBottom, _ChatView_isInputDisabled, _ChatView_inputPlaceholder, _ChatView_showOAuthLogin, _ChatView_onOAuthLogin, _ChatView_aiAssistantStates, _ChatView_lastProcessedMessageKey, _ChatView_isModelDropdownOpen, _ChatView_modelSearchQuery, _ChatView_highlightedOptionIndex, _ChatView_dropdownPosition, _ChatView_versionInfo, _ChatView_isVersionBannerDismissed, _ChatView_isPartOfAgentSession, _ChatView_scrollToBottom, _ChatView_handleMessagesContainerResize, _ChatView_handleScroll, _ChatView_handleMessagesContainerRef, _ChatView_getMessageStateKey, _ChatView_getMessageAIAssistantState, _ChatView_setMessageAIAssistantState, _ChatView_isLastStructuredMessage, _ChatView_updatePromptButtonClickHandler, _ChatView_handlePromptEdit, _ChatView_showPromptEditDialog, _ChatView_handleSendMessage, _ChatView_handleKeyDown, _ChatView_handleTextInput, _ChatView_renderMessage, _ChatView_render, _ChatView_formatJsonWithSyntaxHighlighting, _ChatView_renderModelSelector, _ChatView_renderSimpleModelSelector, _ChatView_renderSearchableModelSelector, _ChatView_handleModelChange, _ChatView_handleModelSelectorFocus, _ChatView_handleOAuthLogin, _ChatView_handleOpenAISetup, _ChatView_handleManualSetup, _ChatView_getSelectedModelLabel, _ChatView_getFilteredModelOptions, _ChatView_toggleModelDropdown, _ChatView_calculateDropdownPosition, _ChatView_handleClickOutside, _ChatView_handleModelSearch, _ChatView_handleModelSearchKeydown, _ChatView_selectModel, _ChatView_copyToClipboard, _ChatView_checkForUpdates, _ChatView_dismissVersionBanner, _ChatView_renderVersionBanner, _ChatView_parseStructuredResponse, _ChatView_renderStructuredResponse, _ChatView_renderStructuredMessage, _ChatView_attemptAIAssistantOpen, _ChatView_openInAIAssistantViewer, _ChatView_toggleAgentView, _ChatView_toggleToolDetails, _ChatView_toggleToolResult, _ChatView_toggleAgentSessionDetails, _ChatView_renderTaskCompletion, _ChatView_renderAgentSessionTimeline, _ChatView_renderTimelineItem, _ChatView_generateTaskTitle, _ChatView_countTotalTools, _ChatView_renderSimplifiedContent, _ChatView_flattenToolCalls, _ChatView_renderSimpleToolItem, _ChatView_getToolIcon, _ChatView_formatValueForDisplay, _ChatView_getToolDescription, _ChatView_renderEnhancedContent, _ChatView_renderAgentSession, _ChatView_renderAgentHeader, _ChatView_getStatusText, _ChatView_getStatusDescription, _ChatView_renderReasoningBubble, _ChatView_renderHandoffIndicator, _ChatView_renderAgentMessage, _ChatView_renderToolCall, _ChatView_renderToolResult;
import * as Marked from '../../../third_party/marked/marked.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as MarkdownView from '../../../ui/components/markdown_view/markdown_view.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as BaseOrchestratorAgent from '../core/BaseOrchestratorAgent.js';
import { TIMING_CONSTANTS, CONTENT_THRESHOLDS, ERROR_MESSAGES, REGEX_PATTERNS } from '../core/Constants.js';
import { PromptEditDialog } from './PromptEditDialog.js';
import * as SDK from '../../../core/sdk/sdk.js';
import { createLogger } from '../core/Logger.js';
import { getAgentUIConfig } from '../agent_framework/AgentSessionTypes.js';
import { VersionChecker } from '../core/VersionChecker.js';
const logger = createLogger('ChatView');
import chatViewStyles from './chatView.css.js';
const { html, Decorators } = Lit;
const { customElement } = Decorators;
// A simplified version of the MarkdownRenderer with code block support
class MarkdownRenderer extends MarkdownView.MarkdownView.MarkdownInsightRenderer {
    templateForToken(token) {
        if (token.type === 'code') {
            const lines = (token.text).split('\n');
            if (lines[0]?.trim() === 'css') {
                token.lang = 'css';
                token.text = lines.slice(1).join('\n');
            }
        }
        return super.templateForToken(token);
    }
}
// Enhanced MarkdownRenderer for deep-research responses with table of contents
class DeepResearchMarkdownRenderer extends MarkdownView.MarkdownView.MarkdownInsightRenderer {
    constructor() {
        super(...arguments);
        this.tocItems = [];
    }
    templateForToken(token) {
        if (token.type === 'heading') {
            // Generate ID for heading
            const headingText = this.extractTextFromTokens((token.tokens || []));
            const id = this.generateHeadingId(headingText);
            // Add to TOC
            this.tocItems.push({
                level: token.depth,
                text: headingText,
                id: id
            });
            // Create heading with ID
            const headingTag = `h${token.depth}`;
            // Use renderToken to render the content
            const content = super.renderToken(token);
            return html `<div id="${id}" class="deep-research-heading-wrapper">${content}</div>`;
        }
        if (token.type === 'code') {
            const lines = (token.text).split('\n');
            if (lines[0]?.trim() === 'css') {
                token.lang = 'css';
                token.text = lines.slice(1).join('\n');
            }
        }
        return super.templateForToken(token);
    }
    extractTextFromTokens(tokens) {
        return tokens.map(token => {
            if (token.type === 'text') {
                return token.text;
            }
            return token.raw || '';
        }).join('');
    }
    generateHeadingId(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    }
    getTocItems() {
        return this.tocItems;
    }
    clearToc() {
        this.tocItems = [];
    }
}
// Function to render text as markdown
function renderMarkdown(text, markdownRenderer, onOpenTableInViewer) {
    let tokens = [];
    try {
        tokens = Marked.Marked.lexer(text);
        for (const token of tokens) {
            // Try to render all the tokens to make sure that
            // they all have a template defined for them. If there
            // isn't any template defined for a token, we'll fallback
            // to rendering the text as plain text instead of markdown.
            markdownRenderer.renderToken(token);
        }
    }
    catch {
        // The tokens were not parsed correctly or
        // one of the tokens are not supported, so we
        // continue to render this as text.
        return html `${text}`;
    }
    return html `<devtools-markdown-view
    .data=${{ tokens, renderer: markdownRenderer, onOpenTableInViewer }}>
  </devtools-markdown-view>`;
}
// Types for the ChatView component
// Define possible entities for chat messages
export var ChatMessageEntity;
(function (ChatMessageEntity) {
    ChatMessageEntity["USER"] = "user";
    ChatMessageEntity["MODEL"] = "model";
    ChatMessageEntity["TOOL_RESULT"] = "tool_result";
    ChatMessageEntity["AGENT_SESSION"] = "agent_session";
})(ChatMessageEntity || (ChatMessageEntity = {}));
// REMOVED Step interface entirely
export var State;
(function (State) {
    State["IDLE"] = "idle";
    State["LOADING"] = "loading";
    State["ERROR"] = "error";
})(State || (State = {}));
let ChatView = class ChatView extends HTMLElement {
    constructor() {
        super(...arguments);
        _ChatView_instances.add(this);
        _ChatView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ChatView_boundRender.set(this, __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_render).bind(this));
        _ChatView_messages.set(this, []);
        _ChatView_state.set(this, State.IDLE);
        _ChatView_agentViewMode.set(this, 'simplified');
        _ChatView_isTextInputEmpty.set(this, true);
        _ChatView_imageInput.set(this, void 0);
        _ChatView_onSendMessage.set(this, void 0);
        _ChatView_onImageInputClear.set(this, void 0);
        _ChatView_onPromptSelected.set(this, void 0);
        _ChatView_textInputElement.set(this, void 0);
        _ChatView_markdownRenderer.set(this, new MarkdownRenderer());
        _ChatView_isFirstMessageView.set(this, true); // Track if we're in the centered first-message view
        _ChatView_selectedPromptType.set(this, void 0); // Track the currently selected prompt type
        _ChatView_handlePromptButtonClickBound.set(this, () => { }); // Initialize with empty function, will be properly set in connectedCallback
        // Add model selection properties
        _ChatView_modelOptions.set(this, void 0);
        _ChatView_selectedModel.set(this, void 0);
        _ChatView_onModelChanged.set(this, void 0);
        _ChatView_onModelSelectorFocus.set(this, void 0);
        _ChatView_selectedAgentType.set(this, void 0);
        _ChatView_isModelSelectorDisabled.set(this, false);
        // Add scroll-related properties
        _ChatView_messagesContainerElement.set(this, void 0);
        _ChatView_messagesContainerResizeObserver.set(this, new ResizeObserver(() => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleMessagesContainerResize).call(this)));
        _ChatView_pinScrollToBottom.set(this, true);
        // Add properties for input disabled state and placeholder
        _ChatView_isInputDisabled.set(this, false);
        _ChatView_inputPlaceholder.set(this, '');
        // Add OAuth login properties
        _ChatView_showOAuthLogin.set(this, false);
        _ChatView_onOAuthLogin.set(this, void 0);
        // Add state tracking for AI Assistant operations
        _ChatView_aiAssistantStates.set(this, new Map());
        _ChatView_lastProcessedMessageKey.set(this, null);
        // Add model selector state for searchable dropdown
        _ChatView_isModelDropdownOpen.set(this, false);
        _ChatView_modelSearchQuery.set(this, '');
        _ChatView_highlightedOptionIndex.set(this, 0);
        _ChatView_dropdownPosition.set(this, 'below');
        // Add version info state
        _ChatView_versionInfo.set(this, null);
        _ChatView_isVersionBannerDismissed.set(this, false);
        // Add method to handle scroll events
        _ChatView_handleScroll.set(this, (event) => {
            if (!event.target || !(event.target instanceof HTMLElement)) {
                return;
            }
            const container = event.target;
            const SCROLL_ROUNDING_OFFSET = 1; // Add small offset to handle rounding errors
            // Consider "scrolled to bottom" if within 1px of the bottom
            __classPrivateFieldSet(this, _ChatView_pinScrollToBottom, container.scrollTop + container.clientHeight + SCROLL_ROUNDING_OFFSET >= container.scrollHeight, "f");
        });
        // Add method to handle message container reference
        _ChatView_handleMessagesContainerRef.set(this, (el) => {
            // Remove old observer if it exists
            if (__classPrivateFieldGet(this, _ChatView_messagesContainerElement, "f")) {
                __classPrivateFieldGet(this, _ChatView_messagesContainerResizeObserver, "f").unobserve(__classPrivateFieldGet(this, _ChatView_messagesContainerElement, "f"));
            }
            __classPrivateFieldSet(this, _ChatView_messagesContainerElement, el, "f");
            if (el) {
                __classPrivateFieldGet(this, _ChatView_messagesContainerResizeObserver, "f").observe(el);
                // Initially scroll to bottom when container is first created
                __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_scrollToBottom).call(this);
            }
            else {
                __classPrivateFieldSet(this, _ChatView_pinScrollToBottom, true, "f");
            }
        });
    }
    connectedCallback() {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(chatViewStyles);
        __classPrivateFieldGet(this, _ChatView_shadow, "f").adoptedStyleSheets = [sheet];
        // Initialize the prompt button click handler
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_updatePromptButtonClickHandler).call(this);
        // Observe the messages container for size changes if it exists
        if (__classPrivateFieldGet(this, _ChatView_messagesContainerElement, "f")) {
            __classPrivateFieldGet(this, _ChatView_messagesContainerResizeObserver, "f").observe(__classPrivateFieldGet(this, _ChatView_messagesContainerElement, "f"));
        }
        // Check for updates when component is connected
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_checkForUpdates).call(this);
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
    }
    disconnectedCallback() {
        // Cleanup resize observer
        __classPrivateFieldGet(this, _ChatView_messagesContainerResizeObserver, "f").disconnect();
        // Clear state maps to prevent memory leaks
        __classPrivateFieldGet(this, _ChatView_aiAssistantStates, "f").clear();
    }
    /**
     * Set the agent view mode for simplified/enhanced toggle
     */
    setAgentViewMode(mode) {
        __classPrivateFieldSet(this, _ChatView_agentViewMode, mode, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
        __classPrivateFieldSet(this, _ChatView_lastProcessedMessageKey, null, "f");
    }
    // Public getter to expose the centered view state
    get isCenteredView() {
        return __classPrivateFieldGet(this, _ChatView_isFirstMessageView, "f");
    }
    set data(data) {
        const previousMessageCount = __classPrivateFieldGet(this, _ChatView_messages, "f")?.length || 0;
        const willHaveMoreMessages = data.messages?.length > previousMessageCount;
        const wasInputDisabled = __classPrivateFieldGet(this, _ChatView_isInputDisabled, "f");
        // Handle AI Assistant state cleanup for last-message-only approach
        if (willHaveMoreMessages && __classPrivateFieldGet(this, _ChatView_messages, "f")) {
            // When new messages are added, reset states for previous final messages
            // so that only the last message can attempt to open AI Assistant
            const previousLastFinalIndex = __classPrivateFieldGet(this, _ChatView_messages, "f").findLastIndex(msg => msg.entity === ChatMessageEntity.MODEL &&
                msg.action === 'final');
            if (previousLastFinalIndex >= 0) {
                const previousLastMessage = __classPrivateFieldGet(this, _ChatView_messages, "f")[previousLastFinalIndex];
                if (previousLastMessage.answer) {
                    const structuredResponse = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_parseStructuredResponse).call(this, previousLastMessage.answer);
                    if (structuredResponse) {
                        const messageKey = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getMessageStateKey).call(this, structuredResponse);
                        const currentState = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getMessageAIAssistantState).call(this, messageKey);
                        // If the previous last message was pending, mark it as failed
                        // But keep 'opened' state to preserve successfully opened reports
                        if (currentState === 'pending') {
                            __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_setMessageAIAssistantState).call(this, messageKey, 'failed');
                        }
                        // If it was 'opened', keep it that way to show button only
                    }
                }
            }
        }
        __classPrivateFieldSet(this, _ChatView_messages, data.messages, "f");
        __classPrivateFieldSet(this, _ChatView_state, data.state, "f");
        __classPrivateFieldSet(this, _ChatView_isTextInputEmpty, data.isTextInputEmpty, "f");
        __classPrivateFieldSet(this, _ChatView_imageInput, data.imageInput, "f");
        __classPrivateFieldSet(this, _ChatView_onSendMessage, data.onSendMessage, "f");
        __classPrivateFieldSet(this, _ChatView_onImageInputClear, data.onImageInputClear, "f");
        __classPrivateFieldSet(this, _ChatView_onPromptSelected, data.onPromptSelected, "f");
        // Add model selection properties
        __classPrivateFieldSet(this, _ChatView_modelOptions, data.modelOptions, "f");
        __classPrivateFieldSet(this, _ChatView_selectedModel, data.selectedModel, "f");
        __classPrivateFieldSet(this, _ChatView_onModelChanged, data.onModelChanged, "f");
        __classPrivateFieldSet(this, _ChatView_onModelSelectorFocus, data.onModelSelectorFocus, "f");
        __classPrivateFieldSet(this, _ChatView_selectedAgentType, data.selectedAgentType, "f");
        __classPrivateFieldSet(this, _ChatView_isModelSelectorDisabled, data.isModelSelectorDisabled || false, "f");
        // Store input disabled state and placeholder
        __classPrivateFieldSet(this, _ChatView_isInputDisabled, data.isInputDisabled || false, "f");
        __classPrivateFieldSet(this, _ChatView_inputPlaceholder, data.inputPlaceholder || 'Ask AI Assistant...', "f");
        // Store OAuth login state
        __classPrivateFieldSet(this, _ChatView_showOAuthLogin, data.showOAuthLogin || false, "f");
        __classPrivateFieldSet(this, _ChatView_onOAuthLogin, data.onOAuthLogin, "f");
        // Log the input state changes
        if (wasInputDisabled !== __classPrivateFieldGet(this, _ChatView_isInputDisabled, "f")) {
            logger.info(`Input disabled state changed: ${wasInputDisabled} -> ${__classPrivateFieldGet(this, _ChatView_isInputDisabled, "f")}`);
            // If we have a text input element, update its disabled state directly
            if (__classPrivateFieldGet(this, _ChatView_textInputElement, "f")) {
                __classPrivateFieldGet(this, _ChatView_textInputElement, "f").disabled = __classPrivateFieldGet(this, _ChatView_isInputDisabled, "f");
                logger.info(`Directly updated textarea disabled state to: ${__classPrivateFieldGet(this, _ChatView_isInputDisabled, "f")}`);
            }
        }
        // Update the selectedPromptType from the passed selectedAgentType if it exists
        if (data.selectedAgentType !== undefined) {
            __classPrivateFieldSet(this, _ChatView_selectedPromptType, data.selectedAgentType, "f");
        }
        // Check if we should exit the first message view state
        // We're no longer in first message view if there are user messages
        const hasUserMessages = data.messages && Array.isArray(data.messages) ?
            data.messages.some(msg => msg && msg.entity === ChatMessageEntity.USER) : false;
        __classPrivateFieldSet(this, _ChatView_isFirstMessageView, !hasUserMessages, "f");
        // Update the prompt button handler with new props
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_updatePromptButtonClickHandler).call(this);
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
        // After rendering, scroll to bottom if we have new messages and auto-scroll is enabled
        if (__classPrivateFieldGet(this, _ChatView_pinScrollToBottom, "f") && willHaveMoreMessages) {
            // Give the DOM time to update before scrolling
            setTimeout(() => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_scrollToBottom).call(this), 0);
        }
    }
};
_ChatView_shadow = new WeakMap();
_ChatView_boundRender = new WeakMap();
_ChatView_messages = new WeakMap();
_ChatView_state = new WeakMap();
_ChatView_agentViewMode = new WeakMap();
_ChatView_isTextInputEmpty = new WeakMap();
_ChatView_imageInput = new WeakMap();
_ChatView_onSendMessage = new WeakMap();
_ChatView_onImageInputClear = new WeakMap();
_ChatView_onPromptSelected = new WeakMap();
_ChatView_textInputElement = new WeakMap();
_ChatView_markdownRenderer = new WeakMap();
_ChatView_isFirstMessageView = new WeakMap();
_ChatView_selectedPromptType = new WeakMap();
_ChatView_handlePromptButtonClickBound = new WeakMap();
_ChatView_modelOptions = new WeakMap();
_ChatView_selectedModel = new WeakMap();
_ChatView_onModelChanged = new WeakMap();
_ChatView_onModelSelectorFocus = new WeakMap();
_ChatView_selectedAgentType = new WeakMap();
_ChatView_isModelSelectorDisabled = new WeakMap();
_ChatView_messagesContainerElement = new WeakMap();
_ChatView_messagesContainerResizeObserver = new WeakMap();
_ChatView_pinScrollToBottom = new WeakMap();
_ChatView_isInputDisabled = new WeakMap();
_ChatView_inputPlaceholder = new WeakMap();
_ChatView_showOAuthLogin = new WeakMap();
_ChatView_onOAuthLogin = new WeakMap();
_ChatView_aiAssistantStates = new WeakMap();
_ChatView_lastProcessedMessageKey = new WeakMap();
_ChatView_isModelDropdownOpen = new WeakMap();
_ChatView_modelSearchQuery = new WeakMap();
_ChatView_highlightedOptionIndex = new WeakMap();
_ChatView_dropdownPosition = new WeakMap();
_ChatView_versionInfo = new WeakMap();
_ChatView_isVersionBannerDismissed = new WeakMap();
_ChatView_handleScroll = new WeakMap();
_ChatView_handleMessagesContainerRef = new WeakMap();
_ChatView_instances = new WeakSet();
_ChatView_isPartOfAgentSession = function _ChatView_isPartOfAgentSession(message) {
    // Check if there's an AgentSessionMessage in the current messages
    const hasAgentSession = __classPrivateFieldGet(this, _ChatView_messages, "f").some(msg => msg.entity === ChatMessageEntity.AGENT_SESSION);
    console.log('[DEBUG] hasAgentSession:', hasAgentSession);
    if (!hasAgentSession) {
        return false;
    }
    // For ModelChatMessage tool calls, check if they're from ConfigurableAgentTool
    if (message.entity === ChatMessageEntity.MODEL) {
        const modelMsg = message;
        if (modelMsg.action === 'tool' && modelMsg.toolName) {
            console.log('[DEBUG] Checking tool:', modelMsg.toolName, 'callId:', modelMsg.toolCallId);
            // Check if there's a corresponding tool result that's from ConfigurableAgentTool
            const toolResultIndex = __classPrivateFieldGet(this, _ChatView_messages, "f").findIndex((msg) => msg.entity === ChatMessageEntity.TOOL_RESULT &&
                msg.toolName === modelMsg.toolName &&
                msg.toolCallId === modelMsg.toolCallId);
            console.log('[DEBUG] Found tool result index:', toolResultIndex);
            if (toolResultIndex !== -1) {
                const toolResult = __classPrivateFieldGet(this, _ChatView_messages, "f")[toolResultIndex];
                console.log('[DEBUG] Tool result isFromConfigurableAgent:', toolResult.isFromConfigurableAgent);
                return toolResult.isFromConfigurableAgent === true;
            }
        }
    }
    return false;
};
_ChatView_scrollToBottom = function _ChatView_scrollToBottom() {
    if (!__classPrivateFieldGet(this, _ChatView_messagesContainerElement, "f")) {
        return;
    }
    __classPrivateFieldGet(this, _ChatView_messagesContainerElement, "f").scrollTop = __classPrivateFieldGet(this, _ChatView_messagesContainerElement, "f").scrollHeight;
};
_ChatView_handleMessagesContainerResize = function _ChatView_handleMessagesContainerResize() {
    if (!__classPrivateFieldGet(this, _ChatView_pinScrollToBottom, "f")) {
        return;
    }
    if (!__classPrivateFieldGet(this, _ChatView_messagesContainerElement, "f")) {
        return;
    }
    __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_scrollToBottom).call(this);
};
_ChatView_getMessageStateKey = function _ChatView_getMessageStateKey(structuredResponse) {
    // Create stable hash from content - Unicode safe
    const content = structuredResponse.reasoning + structuredResponse.markdownReport;
    // Unicode-safe hash function using TextEncoder
    const encoder = new TextEncoder();
    const bytes = encoder.encode(content);
    let hash = 0;
    for (let i = 0; i < bytes.length; i++) {
        hash = ((hash << 5) - hash) + bytes[i];
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to hex for consistent 8-character length
    const key = Math.abs(hash).toString(16).padStart(8, '0');
    return key;
};
_ChatView_getMessageAIAssistantState = function _ChatView_getMessageAIAssistantState(messageKey) {
    return __classPrivateFieldGet(this, _ChatView_aiAssistantStates, "f").get(messageKey) || 'not-attempted';
};
_ChatView_setMessageAIAssistantState = function _ChatView_setMessageAIAssistantState(messageKey, state) {
    __classPrivateFieldGet(this, _ChatView_aiAssistantStates, "f").set(messageKey, state);
};
_ChatView_isLastStructuredMessage = function _ChatView_isLastStructuredMessage(currentCombinedIndex) {
    // We need to work with the combined messages logic to properly identify the last structured message
    // The currentCombinedIndex is from the combined array, but we need to check against the original array
    // Recreate the combined messages logic to understand the mapping
    let combinedIndex = 0;
    let lastStructuredCombinedIndex = -1;
    for (let originalIndex = 0; originalIndex < __classPrivateFieldGet(this, _ChatView_messages, "f").length; originalIndex++) {
        const message = __classPrivateFieldGet(this, _ChatView_messages, "f")[originalIndex];
        // Keep User messages and Final Model answers
        if (message.entity === ChatMessageEntity.USER ||
            (message.entity === ChatMessageEntity.MODEL && message.action === 'final')) {
            // Check if this is a structured final answer
            if (message.entity === ChatMessageEntity.MODEL && message.action === 'final') {
                const structuredResponse = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_parseStructuredResponse).call(this, message.answer || '');
                if (structuredResponse) {
                    lastStructuredCombinedIndex = combinedIndex;
                }
            }
            combinedIndex++;
            continue;
        }
        // Handle Model Tool Call message
        if (message.entity === ChatMessageEntity.MODEL && message.action === 'tool') {
            const nextMessage = __classPrivateFieldGet(this, _ChatView_messages, "f")[originalIndex + 1];
            // Check if the next message is the corresponding result
            if (nextMessage && nextMessage.entity === ChatMessageEntity.TOOL_RESULT && nextMessage.toolName === message.toolName) {
                // Combined representation: tool call + result = 1 entry in combined array
                combinedIndex++;
            }
            else {
                // Tool call is still running (no result yet)
                combinedIndex++;
            }
            continue;
        }
        // Handle Tool Result message - skip if it was combined previously
        if (message.entity === ChatMessageEntity.TOOL_RESULT) {
            const prevMessage = __classPrivateFieldGet(this, _ChatView_messages, "f")[originalIndex - 1];
            // Check if the previous message was the corresponding model call
            if (!(prevMessage && prevMessage.entity === ChatMessageEntity.MODEL && prevMessage.action === 'tool' && prevMessage.toolName === message.toolName)) {
                // Orphaned tool result - add it directly
                combinedIndex++;
            }
            // Otherwise, it was handled by the MODEL case above, so we skip this result message
            continue;
        }
        // Fallback for any unexpected message types
        combinedIndex++;
    }
    return lastStructuredCombinedIndex === currentCombinedIndex;
};
_ChatView_updatePromptButtonClickHandler = function _ChatView_updatePromptButtonClickHandler() {
    __classPrivateFieldSet(this, _ChatView_handlePromptButtonClickBound, BaseOrchestratorAgent.createAgentTypeSelectionHandler(this, __classPrivateFieldGet(this, _ChatView_textInputElement, "f"), __classPrivateFieldGet(this, _ChatView_onPromptSelected, "f"), (type) => {
        __classPrivateFieldSet(this, _ChatView_selectedPromptType, type, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
    }, () => __classPrivateFieldGet(this, _ChatView_selectedPromptType, "f") || null, (agentType) => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handlePromptEdit).call(this, agentType)), "f");
};
_ChatView_handlePromptEdit = function _ChatView_handlePromptEdit(agentType) {
    logger.info('Opening prompt editor for agent type:', agentType);
    __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_showPromptEditDialog).call(this, agentType);
};
_ChatView_showPromptEditDialog = function _ChatView_showPromptEditDialog(agentType) {
    const agentConfig = BaseOrchestratorAgent.AGENT_CONFIGS[agentType];
    if (!agentConfig) {
        logger.error('Agent config not found for type:', agentType);
        return;
    }
    PromptEditDialog.show({
        agentType,
        agentLabel: agentConfig.label,
        currentPrompt: BaseOrchestratorAgent.getAgentPrompt(agentType),
        defaultPrompt: BaseOrchestratorAgent.getDefaultPrompt(agentType),
        hasCustomPrompt: BaseOrchestratorAgent.hasCustomPrompt(agentType),
        onSave: (prompt) => {
            try {
                BaseOrchestratorAgent.setCustomPrompt(agentType, prompt);
                // Force re-render to update UI
                void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
            }
            catch (error) {
                logger.error('Failed to save custom prompt:', error);
                // TODO: Show user notification
            }
        },
        onRestore: () => {
            try {
                BaseOrchestratorAgent.removeCustomPrompt(agentType);
                // Force re-render to update UI
                void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
            }
            catch (error) {
                logger.error('Failed to restore default prompt:', error);
                // TODO: Show user notification
            }
        },
        onError: (error) => {
            logger.error('Prompt edit error:', error);
            // TODO: Show user notification
        }
    });
};
_ChatView_handleSendMessage = function _ChatView_handleSendMessage() {
    // Check if textInputElement, onSendMessage callback, or input is disabled
    if (!__classPrivateFieldGet(this, _ChatView_textInputElement, "f") || !__classPrivateFieldGet(this, _ChatView_onSendMessage, "f") || __classPrivateFieldGet(this, _ChatView_isInputDisabled, "f")) {
        return;
    }
    const text = __classPrivateFieldGet(this, _ChatView_textInputElement, "f").value.trim();
    if (!text) {
        return;
    }
    // Exit the first message view mode when sending a message
    __classPrivateFieldSet(this, _ChatView_isFirstMessageView, false, "f");
    // Always scroll to bottom after sending message
    __classPrivateFieldSet(this, _ChatView_pinScrollToBottom, true, "f");
    __classPrivateFieldGet(this, _ChatView_onSendMessage, "f").call(this, text, __classPrivateFieldGet(this, _ChatView_imageInput, "f"));
    __classPrivateFieldGet(this, _ChatView_textInputElement, "f").value = '';
    __classPrivateFieldGet(this, _ChatView_textInputElement, "f").style.height = 'auto';
    __classPrivateFieldSet(this, _ChatView_isTextInputEmpty, true, "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
};
_ChatView_handleKeyDown = function _ChatView_handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleSendMessage).call(this);
    }
};
_ChatView_handleTextInput = function _ChatView_handleTextInput(event) {
    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset height to shrink if needed
    textarea.style.height = `${textarea.scrollHeight}px`;
    const newIsEmpty = textarea.value.trim().length === 0;
    // Only trigger re-render if empty state actually changed
    if (__classPrivateFieldGet(this, _ChatView_isTextInputEmpty, "f") !== newIsEmpty) {
        __classPrivateFieldSet(this, _ChatView_isTextInputEmpty, newIsEmpty, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
    }
    else {
        __classPrivateFieldSet(this, _ChatView_isTextInputEmpty, newIsEmpty, "f");
    }
};
_ChatView_renderMessage = function _ChatView_renderMessage(message, combinedIndex) {
    try {
        switch (message.entity) {
            case ChatMessageEntity.USER:
                // Render User Message
                return html `
            <div class="message user-message" >
              <div class="message-content">
                <div class="message-text">${renderMarkdown(message.text || '', __classPrivateFieldGet(this, _ChatView_markdownRenderer, "f"), __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_openInAIAssistantViewer).bind(this))}</div>
                ${message.error ? html `<div class="message-error">${message.error}</div>` : Lit.nothing}
              </div>
            </div>
          `;
            case ChatMessageEntity.AGENT_SESSION:
                // Render agent session using existing logic
                {
                    const agentSessionMessage = message;
                    console.log('[AGENT SESSION RENDER] Rendering AgentSessionMessage:', agentSessionMessage);
                    return __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderTaskCompletion).call(this, agentSessionMessage.agentSession);
                }
            case ChatMessageEntity.TOOL_RESULT:
                // Should only render if orphaned
                {
                    const toolResultMessage = message;
                    // If this is from a ConfigurableAgentTool, don't render individual cards
                    // Let the agent session UI handle it
                    if (toolResultMessage.isFromConfigurableAgent) {
                        console.log('[UI FILTER] Hiding ConfigurableAgentTool result:', toolResultMessage.toolName);
                        return html ``;
                    }
                    if (toolResultMessage.orphaned) {
                        return html `
                   <div class="message tool-result-message orphaned ${toolResultMessage.isError ? 'error' : ''}" >
                     <div class="message-content">
                       <div class="tool-status completed">
                           <div class="tool-name-display">
                             Orphaned Result from: ${toolResultMessage.toolName} ${toolResultMessage.isError ? '(Error)' : ''}
                           </div>
                           <pre class="tool-result-raw">${toolResultMessage.resultText}</pre>
                           ${toolResultMessage.error ? html `<div class="message-error">${toolResultMessage.error}</div>` : Lit.nothing}
                       </div>
                     </div>
                   </div>
                 `;
                    }
                    // If not orphaned, it should have been combined, so render nothing.
                    return html ``;
                }
            case ChatMessageEntity.MODEL:
                {
                    // Cast to the potentially combined type
                    const modelMessage = message;
                    // Hide tool calls that are part of agent sessions
                    if (modelMessage.action === 'tool') {
                        const isPartOfSession = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_isPartOfAgentSession).call(this, modelMessage);
                        console.log('[UI DEBUG] Tool call:', modelMessage.toolName, 'isPartOfAgentSession:', isPartOfSession);
                        if (isPartOfSession) {
                            console.log('[UI FILTER] Hiding ModelChatMessage tool call from agent session:', modelMessage.toolName);
                            return html ``;
                        }
                    }
                    // Check if it's a combined message (tool call + result) or just a running tool call / final answer
                    const isCombined = modelMessage.combined === true;
                    const isRunningTool = modelMessage.action === 'tool' && !isCombined;
                    const isFinal = modelMessage.action === 'final';
                    // --- Render Final Answer ---
                    if (isFinal) {
                        // Check if this is a structured response with REASONING and MARKDOWN_REPORT sections
                        const structuredResponse = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_parseStructuredResponse).call(this, modelMessage.answer || '');
                        if (structuredResponse) {
                            return __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderStructuredResponse).call(this, structuredResponse, combinedIndex);
                        }
                        else {
                            // Regular response - use the old logic
                            return html `
                  <div class="message model-message final">
                    <div class="message-content">
                      ${modelMessage.answer ?
                                html `
                          <div class="message-text">${renderMarkdown(modelMessage.answer, __classPrivateFieldGet(this, _ChatView_markdownRenderer, "f"), __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_openInAIAssistantViewer).bind(this))}</div>
                          ${Lit.nothing}
                        ` :
                                Lit.nothing}
                    ${modelMessage.reasoning?.length ? html `
                      <div class="reasoning-block">
                        <details class="reasoning-details">
                          <summary class="reasoning-summary">
                            <span class="reasoning-icon">💡</span>
                            <span>Model Reasoning</span>
                          </summary>
                          <div class="reasoning-content">
                            ${modelMessage.reasoning.map(item => html `
                              <div class="reasoning-item">${renderMarkdown(item, __classPrivateFieldGet(this, _ChatView_markdownRenderer, "f"), __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_openInAIAssistantViewer).bind(this))}</div>
                            `)}
                          </div>
                        </details>
                      </div>
                    ` : Lit.nothing}
                    ${modelMessage.error ? html `<div class="message-error">${modelMessage.error}</div>` : Lit.nothing}
                  </div>
                </div>
              `;
                        }
                    }
                    // --- Render Tool Call with Timeline Design ---
                    const toolReasoning = modelMessage.toolArgs?.reasoning;
                    const resultText = modelMessage.resultText; // Available if combined
                    const isResultError = modelMessage.isError ?? false; // Available if combined, default false
                    const toolArgs = modelMessage.toolArgs || {};
                    const filteredArgs = Object.fromEntries(Object.entries(toolArgs).filter(([key]) => key !== 'reasoning' && key !== 'query' && key !== 'url' && key !== 'objective'));
                    // Determine status
                    let status = 'running';
                    if (isCombined) {
                        status = isResultError ? 'error' : 'completed';
                    }
                    const toolName = modelMessage.toolName || 'unknown_tool';
                    const icon = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getToolIcon).call(this, toolName);
                    const descriptionData = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getToolDescription).call(this, toolName, toolArgs);
                    return html `
              <!-- Reasoning (if any) displayed above the timeline -->
              ${toolReasoning ? html `
                <div class="message-text reasoning-text" style="margin-bottom: 8px;">
                  ${renderMarkdown(toolReasoning, __classPrivateFieldGet(this, _ChatView_markdownRenderer, "f"), __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_openInAIAssistantViewer).bind(this))}
                </div>
              ` : Lit.nothing}

              <!-- Timeline Tool Execution -->
              <div class="agent-execution-timeline single-tool">
                <!-- Tool Header -->
                <div class="agent-header">
                  <div class="agent-marker"></div>
                  <div class="agent-title">${descriptionData.action}</div>
                  <div class="agent-divider"></div>
                    <button class="tool-toggle" @click=${(e) => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_toggleToolResult).call(this, e)}>
                      <span class="toggle-icon">▼</span>
                    </button>
                </div>
                
                <div class="timeline-items" style="display: none;">
                  <div class="timeline-item">
                    <div class="tool-line">
                      ${descriptionData.isMultiLine ? html `
                        <div class="tool-summary">
                          <span class="tool-description">
                            <span class="tool-description-indicator">└─</span>
                            <div>${descriptionData.content[0]?.value || 'multiple parameters'}</div>
                          </span>
                          <span class="tool-status-marker ${status}" title="${status === 'running' ? 'Running' : status === 'completed' ? 'Completed' : status === 'error' ? 'Error' : 'Unknown'}">●</span>
                        </div>
                      ` : html `
                        <span class="tool-description">
                          <span class="tool-description-indicator">└─</span>
                          <div>${descriptionData.content}</div>
                        </span>
                        <span class="tool-status-marker ${status}" title="${status === 'running' ? 'Running' : status === 'completed' ? 'Completed' : status === 'error' ? 'Error' : 'Unknown'}">●</span>
                      `}
                    </div>
                    
                    <!-- Result Block - Integrated within timeline item -->
                    ${isCombined && resultText ? html `
                      <div class="tool-result-integrated ${status}">
                        Response:
                        ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_formatJsonWithSyntaxHighlighting).call(this, resultText)}
                      </div>
                    ` : Lit.nothing}
                  </div>
                </div>
                
                <!-- Loading spinner for running tools -->
                ${status === 'running' ? html `
                  <div class="tool-loading">
                    <svg class="loading-spinner" width="16" height="16" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="30 12" stroke-linecap="round">
                        <animateTransform 
                          attributeName="transform" 
                          attributeType="XML" 
                          type="rotate" 
                          from="0 8 8" 
                          to="360 8 8" 
                          dur="1s" 
                          repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </div>
                ` : Lit.nothing}

                <!-- Error messages -->
                ${modelMessage.error ? html `<div class="message-error tool-error-message">Model Error: ${modelMessage.error}</div>` : Lit.nothing}
              </div>
            `;
                }
            default:
                // Should not happen, but render a fallback
                return html `<div class="message unknown">Unknown message type</div>`;
        }
    }
    catch (error) {
        logger.error('Error rendering message:', error);
        return html `
        <div class="message model-message error" >
          <div class="message-content">
            <div class="message-error">Failed to render message: ${error instanceof Error ? error.message : String(error)}</div>
          </div>
        </div>
      `;
    }
};
_ChatView_render = function _ChatView_render() {
    // clang-format off
    // Check if the last message is a MODEL message indicating a tool is running
    const lastMessage = __classPrivateFieldGet(this, _ChatView_messages, "f")[__classPrivateFieldGet(this, _ChatView_messages, "f").length - 1];
    const isModelRunningTool = lastMessage?.entity === ChatMessageEntity.MODEL && !lastMessage.isFinalAnswer && lastMessage.toolName;
    // All messages are rendered directly now, including AgentSessionMessage
    let messagesToRender = __classPrivateFieldGet(this, _ChatView_messages, "f");
    // Combine the tool calling and tool result messages into a single logical unit for rendering
    const combinedMessages = messagesToRender.reduce((acc, message, index, allMessages) => {
        // Keep User messages and Final Model answers
        if (message.entity === ChatMessageEntity.USER ||
            (message.entity === ChatMessageEntity.MODEL && message.action === 'final')) {
            acc.push(message);
            return acc;
        }
        // Handle Model Tool Call message
        if (message.entity === ChatMessageEntity.MODEL && message.action === 'tool') {
            const modelMessage = message;
            const nextMessage = allMessages[index + 1];
            // Check if the next message is the corresponding result
            if (nextMessage && nextMessage.entity === ChatMessageEntity.TOOL_RESULT && nextMessage.toolName === modelMessage.toolName) {
                // Create a combined representation: add result to model message
                // IMPORTANT: Create a new object, don't mutate the original state
                const combinedRepresentation = {
                    ...modelMessage, // Copy model call details
                    // Add result details directly to this combined object
                    resultText: nextMessage.resultText,
                    isError: nextMessage.isError,
                    resultError: nextMessage.error, // Keep original model error separate if needed
                    combined: true, // Add a flag to identify this combined message
                };
                acc.push(combinedRepresentation);
            }
            else {
                // Tool call is still running (no result yet) or result is missing
                // Add the model message as is (it will render the "running" state)
                acc.push(modelMessage);
            }
            return acc;
        }
        // Handle Tool Result message - skip if it was combined previously
        if (message.entity === ChatMessageEntity.TOOL_RESULT) {
            const prevMessage = allMessages[index - 1];
            // Check if the previous message was the corresponding model call
            if (!(prevMessage && prevMessage.entity === ChatMessageEntity.MODEL && prevMessage.action === 'tool' && prevMessage.toolName === message.toolName)) {
                // Orphaned tool result - add it directly
                logger.warn('Orphaned tool result found:', message);
                acc.push({ ...message, orphaned: true }); // Add marker for rendering
            }
            // Otherwise, it was handled by the MODEL case above, so we skip this result message
            return acc;
        }
        // Fallback for any unexpected message types (shouldn't happen)
        acc.push(message);
        return acc;
        // Define the type for the accumulator array more accurately
        // Allow ToolResultMessage to potentially have an 'orphaned' flag
    }, []);
    // General loading state (before any model response or after tool result)
    const showGeneralLoading = __classPrivateFieldGet(this, _ChatView_state, "f") === State.LOADING && !isModelRunningTool;
    // Find the last model message with an answer to use for the copy action
    let lastModelAnswer = null;
    // Loop backwards through messages to find the most recent model answer
    for (let i = __classPrivateFieldGet(this, _ChatView_messages, "f").length - 1; i >= 0; i--) {
        const msg = __classPrivateFieldGet(this, _ChatView_messages, "f")[i];
        if (msg.entity === ChatMessageEntity.MODEL) {
            const modelMsg = msg;
            if (modelMsg.action === 'final' && modelMsg.answer) {
                lastModelAnswer = modelMsg.answer;
                break;
            }
        }
    }
    // Determine whether to show actions row (not in first message view, not loading, has a model answer)
    const showActionsRow = !__classPrivateFieldGet(this, _ChatView_isFirstMessageView, "f") &&
        __classPrivateFieldGet(this, _ChatView_state, "f") !== State.LOADING &&
        lastModelAnswer !== null;
    // Determine which view to render based on the first message state
    if (__classPrivateFieldGet(this, _ChatView_isFirstMessageView, "f")) {
        // Render centered first message view
        const welcomeMessage = __classPrivateFieldGet(this, _ChatView_messages, "f").length > 0 ? __classPrivateFieldGet(this, _ChatView_messages, "f")[0] : null;
        Lit.render(html `
        <div class="chat-view-container centered-view">
          ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderVersionBanner).call(this)}
          <div class="centered-content">
            ${welcomeMessage ? __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderMessage).call(this, welcomeMessage, 0) : Lit.nothing}
            
            ${__classPrivateFieldGet(this, _ChatView_showOAuthLogin, "f") ? html `
              <!-- OAuth Login Section -->
              <div class="oauth-login-container">
                <div class="oauth-welcome">
                  <h2>Welcome to Browser Operator</h2>
                  <p>Get started by connecting an AI provider for access to multiple models</p>
                </div>
                
                <div class="oauth-login-section">
                  <div class="provider-options">
                    <button 
                      class="oauth-login-button openrouter" 
                      @click=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleOAuthLogin).bind(this)}
                      title="Sign in with OpenRouter OAuth"
                    >
                      <div class="oauth-button-content">
                        <svg class="oauth-icon" width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" aria-label="OpenRouter Logo">
                          <g clip-path="url(#clip0_205_3)">
                            <path d="M3 248.945C18 248.945 76 236 106 219C136 202 136 202 198 158C276.497 102.293 332 120.945 423 120.945" stroke-width="90"></path>
                            <path d="M511 121.5L357.25 210.268L357.25 32.7324L511 121.5Z"></path>
                            <path d="M0 249C15 249 73 261.945 103 278.945C133 295.945 133 295.945 195 339.945C273.497 395.652 329 377 420 377" stroke-width="90"></path>
                            <path d="M508 376.445L354.25 287.678L354.25 465.213L508 376.445Z"></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_205_3">
                              <rect width="512" height="512" fill="white"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                        <span>Connect via OpenRouter</span>
                      </div>
                    </button>
                    
                    <button 
                      class="oauth-login-button openai" 
                      @click=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleOpenAISetup).bind(this)}
                      title="Connect with OpenAI API key"
                    >
                      <div class="oauth-button-content">
                        <svg class="oauth-icon" width="28" height="28" viewBox="0 0 156 154" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M59.7325 56.1915V41.6219C59.7325 40.3948 60.1929 39.4741 61.266 38.8613L90.5592 21.9915C94.5469 19.6912 99.3013 18.6181 104.208 18.6181C122.612 18.6181 134.268 32.8813 134.268 48.0637C134.268 49.1369 134.268 50.364 134.114 51.5911L103.748 33.8005C101.908 32.7274 100.067 32.7274 98.2267 33.8005L59.7325 56.1915ZM128.133 112.937V78.1222C128.133 75.9745 127.212 74.441 125.372 73.3678L86.878 50.9768L99.4538 43.7682C100.527 43.1554 101.448 43.1554 102.521 43.7682L131.814 60.6381C140.25 65.5464 145.923 75.9745 145.923 86.0961C145.923 97.7512 139.023 108.487 128.133 112.935V112.937ZM50.6841 82.2638L38.1083 74.9028C37.0351 74.29 36.5748 73.3693 36.5748 72.1422V38.4025C36.5748 21.9929 49.1506 9.5696 66.1744 9.5696C72.6162 9.5696 78.5962 11.7174 83.6585 15.5511L53.4461 33.0352C51.6062 34.1084 50.6855 35.6419 50.6855 37.7897V82.2653L50.6841 82.2638ZM77.7533 97.9066L59.7325 87.785V66.3146L77.7533 56.193L95.7725 66.3146V87.785L77.7533 97.9066ZM89.3321 144.53C82.8903 144.53 76.9103 142.382 71.848 138.549L102.06 121.064C103.9 119.991 104.821 118.458 104.821 116.31V71.8343L117.551 79.1954C118.624 79.8082 119.084 80.7289 119.084 81.956V115.696C119.084 132.105 106.354 144.529 89.3321 144.529V144.53ZM52.9843 110.33L23.6911 93.4601C15.2554 88.5517 9.58181 78.1237 9.58181 68.0021C9.58181 56.193 16.6365 45.611 27.5248 41.163V76.1299C27.5248 78.2776 28.4455 79.8111 30.2854 80.8843L68.6271 103.121L56.0513 110.33C54.9781 110.943 54.0574 110.943 52.9843 110.33ZM51.2983 135.482C33.9681 135.482 21.2384 122.445 21.2384 106.342C21.2384 105.115 21.3923 103.888 21.5448 102.661L51.7572 120.145C53.5971 121.218 55.4385 121.218 57.2784 120.145L95.7725 97.9081V112.478C95.7725 113.705 95.3122 114.625 94.239 115.238L64.9458 132.108C60.9582 134.408 56.2037 135.482 51.2969 135.482H51.2983ZM89.3321 153.731C107.889 153.731 123.378 140.542 126.907 123.058C144.083 118.61 155.126 102.507 155.126 86.0976C155.126 75.3617 150.525 64.9336 142.243 57.4186C143.01 54.1977 143.471 50.9768 143.471 47.7573C143.471 25.8267 125.68 9.41567 105.129 9.41567C100.989 9.41567 97.0011 10.0285 93.0134 11.4095C86.1112 4.66126 76.6024 0.367188 66.1744 0.367188C47.6171 0.367188 32.1282 13.5558 28.5994 31.0399C11.4232 35.4879 0.380859 51.5911 0.380859 68.0006C0.380859 78.7365 4.98133 89.1645 13.2631 96.6795C12.4963 99.9004 12.036 103.121 12.036 106.341C12.036 128.271 29.8265 144.682 50.3777 144.682C54.5178 144.682 58.5055 144.07 62.4931 142.689C69.3938 149.437 78.9026 153.731 89.3321 153.731Z" fill="currentColor"></path>
                        </svg>
                        <span>Connect via OpenAI</span>
                      </div>
                    </button>
                  </div>
                  
                  <div class="oauth-alternative">
                    <p>Or <a href="#" @click=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleManualSetup).bind(this)} class="manual-setup-link">configure API keys manually</a></p>
                  </div>
                </div>
              </div>
            ` : html `
              <!-- Regular Input Section -->
              <div class="input-container centered" >
                ${__classPrivateFieldGet(this, _ChatView_imageInput, "f") ? html `
                  <div class="image-preview">
                    <img src=${__classPrivateFieldGet(this, _ChatView_imageInput, "f").url} alt="Image input" /> 
                    <button class="image-remove-button" @click=${() => __classPrivateFieldGet(this, _ChatView_onImageInputClear, "f") && __classPrivateFieldGet(this, _ChatView_onImageInputClear, "f").call(this)}> 
                      <span class="icon">×</span>
                    </button>
                  </div>
                ` : Lit.nothing}
                <div class="input-row">
                  <textarea
                    class="text-input"
                    placeholder=${__classPrivateFieldGet(this, _ChatView_inputPlaceholder, "f")}
                    rows="1"
                    @keydown=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleKeyDown).bind(this)}
                    @input=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleTextInput).bind(this)}
                    ?disabled=${__classPrivateFieldGet(this, _ChatView_isInputDisabled, "f")}
                    ${Lit.Directives.ref((el) => {
            __classPrivateFieldSet(this, _ChatView_textInputElement, el, "f");
        })}
                  ></textarea>
                </div>
                <!-- Prompt Buttons Row -->
                <div class="prompt-buttons-row">
                  ${BaseOrchestratorAgent.renderAgentTypeButtons(__classPrivateFieldGet(this, _ChatView_selectedPromptType, "f"), __classPrivateFieldGet(this, _ChatView_handlePromptButtonClickBound, "f"), true)}

                  <div class="actions-container">
                    ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderModelSelector).call(this)}
                    <button
                      class="send-button ${__classPrivateFieldGet(this, _ChatView_isTextInputEmpty, "f") || __classPrivateFieldGet(this, _ChatView_isInputDisabled, "f") ? 'disabled' : ''}"
                      ?disabled=${__classPrivateFieldGet(this, _ChatView_isTextInputEmpty, "f") || __classPrivateFieldGet(this, _ChatView_isInputDisabled, "f")}
                      @click=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleSendMessage).bind(this)}
                      title="Send message"
                      aria-label="Send message"
                    >
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        d="M29.4,15.1
                          l-8.9-3.5
                          l-3.5-8.9
                          C16.8,2.3,16.4,2,16,2
                          s-0.8,0.3-0.9,0.6
                          l-3.5,8.9
                          l-8.9,3.5
                          C2.3,15.2,2,15.6,2,16
                          s0.3,0.8,0.6,0.9
                          l8.9,3.5
                          l3.5,8.9
                          c0.2,0.4,0.5,0.6,0.9,0.6
                          s0.8-0.3,0.9-0.6
                          l3.5-8.9
                          l8.9-3.5
                          c0.4-0.2,0.6-0.5,0.6-0.9
                          S29.7,15.2,29.4,15.1
                        z" />
                    </svg>
                    </button>
                  </div>
                </div>
              </div>
            `}
          </div>
        </div>
      `, __classPrivateFieldGet(this, _ChatView_shadow, "f"), { host: this });
    }
    else {
        // Render normal expanded view for conversation
        Lit.render(html `
        <div class="chat-view-container expanded-view">
          ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderVersionBanner).call(this)}
          <div class="messages-container" 
            @scroll=${__classPrivateFieldGet(this, _ChatView_handleScroll, "f")} 
            ${Lit.Directives.ref(__classPrivateFieldGet(this, _ChatView_handleMessagesContainerRef, "f"))}>
            ${combinedMessages?.map((message, combinedIndex) => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderMessage).call(this, message, combinedIndex)) || Lit.nothing}

            ${showGeneralLoading ? html `
              <div class="message model-message loading" >
                <div class="message-content">
                  <div class="message-loading">
                    <svg class="loading-spinner" width="16" height="16" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="30 12" stroke-linecap="round">
                        <animateTransform 
                          attributeName="transform" 
                          attributeType="XML" 
                          type="rotate" 
                          from="0 8 8" 
                          to="360 8 8" 
                          dur="1s" 
                          repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </div>
                </div>
              </div>
            ` : Lit.nothing}
            
            <!-- Global actions row - only shown when chat is complete -->
            ${showActionsRow ? html `
              <div class="global-actions-container">
                <div class="message-actions-row">
                  <button class="message-action-button" @click=${() => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_copyToClipboard).call(this, lastModelAnswer || '')} title="Copy to clipboard">
                    <svg class="action-icon" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"></path>
                    </svg>
                    <span class="action-tooltip">Copy</span>
                  </button>
                  <button class="message-action-button thumbs-up" title="Helpful">
                    <svg class="action-icon" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" fill="currentColor"></path>
                    </svg>
                    <span class="action-tooltip">Helpful</span>
                  </button>
                  <button class="message-action-button thumbs-down" title="Not helpful">
                    <svg class="action-icon" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" fill="currentColor"></path>
                    </svg>
                    <span class="action-tooltip">Not helpful</span>
                  </button>
                  <button class="message-action-button retry" title="Regenerate response">
                    <svg class="action-icon" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"></path>
                    </svg>
                    <span class="action-tooltip">Retry</span>
                  </button>
                </div>
              </div>
            ` : Lit.nothing}
          </div>
          <div class="input-container" >
            ${__classPrivateFieldGet(this, _ChatView_imageInput, "f") ? html `
              <div class="image-preview">
                <img src=${__classPrivateFieldGet(this, _ChatView_imageInput, "f").url} alt="Image input" /> 
                <button class="image-remove-button" @click=${() => __classPrivateFieldGet(this, _ChatView_onImageInputClear, "f") && __classPrivateFieldGet(this, _ChatView_onImageInputClear, "f").call(this)}> 
                  <span class="icon">×</span>
                </button>
              </div>
            ` : Lit.nothing}
            <div class="input-row">
              <textarea
                class="text-input"
                placeholder=${__classPrivateFieldGet(this, _ChatView_inputPlaceholder, "f")}
                rows="1"
                @keydown=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleKeyDown).bind(this)}
                @input=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleTextInput).bind(this)}
                ?disabled=${__classPrivateFieldGet(this, _ChatView_isInputDisabled, "f")}
                ${Lit.Directives.ref((el) => {
            __classPrivateFieldSet(this, _ChatView_textInputElement, el, "f");
        })}
              ></textarea>
            </div>
              <!-- Prompt Buttons Row -->
              <div class="prompt-buttons-row">
                ${BaseOrchestratorAgent.renderAgentTypeButtons(__classPrivateFieldGet(this, _ChatView_selectedPromptType, "f"), __classPrivateFieldGet(this, _ChatView_handlePromptButtonClickBound, "f"))}
                <div class="actions-container">
                  ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderModelSelector).call(this)}
                  <button
                    class="send-button ${__classPrivateFieldGet(this, _ChatView_isTextInputEmpty, "f") || __classPrivateFieldGet(this, _ChatView_isInputDisabled, "f") ? 'disabled' : ''}"
                    ?disabled=${__classPrivateFieldGet(this, _ChatView_isTextInputEmpty, "f") || __classPrivateFieldGet(this, _ChatView_isInputDisabled, "f")}
                    @click=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleSendMessage).bind(this)}
                    title="Send message"
                    aria-label="Send message"
                  >
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill="none" 
                          stroke="currentColor" 
                          stroke-width="2" 
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          d="M29.4,15.1
                            l-8.9-3.5
                            l-3.5-8.9
                            C16.8,2.3,16.4,2,16,2
                            s-0.8,0.3-0.9,0.6
                            l-3.5,8.9
                            l-8.9,3.5
                            C2.3,15.2,2,15.6,2,16
                            s0.3,0.8,0.6,0.9
                            l8.9,3.5
                            l3.5,8.9
                            c0.2,0.4,0.5,0.6,0.9,0.6
                            s0.8-0.3,0.9-0.6
                            l3.5-8.9
                            l8.9-3.5
                            c0.4-0.2,0.6-0.5,0.6-0.9
                            S29.7,15.2,29.4,15.1
                          z" />
                      </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `, __classPrivateFieldGet(this, _ChatView_shadow, "f"), { host: this });
    }
    // clang-format on
};
_ChatView_formatJsonWithSyntaxHighlighting = function _ChatView_formatJsonWithSyntaxHighlighting(jsonString) {
    try {
        if (jsonString.trim().startsWith('{') || jsonString.trim().startsWith('[')) {
            // If it looks like JSON, parse and format it
            const parsed = JSON.parse(jsonString);
            if (parsed != null && parsed.error) {
                // If the parsed JSON has an error field, treat it as an error
                return html `
            <pre class="json-error">
              <span class="error-message">${parsed.error}</span>
            </pre>`;
            }
            // Use the YAML formatter for better readability
            const yamlFormatted = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_formatValueForDisplay).call(this, parsed);
            return html `
          <pre class="json-result">
            ${yamlFormatted}
          </pre>`;
        }
        // If not JSON or parsing fails, return as is
        return html `${jsonString}`;
    }
    catch (e) {
        // If JSON parsing fails, return original text
        return html `${jsonString}`;
    }
};
_ChatView_renderModelSelector = function _ChatView_renderModelSelector() {
    if (!__classPrivateFieldGet(this, _ChatView_modelOptions, "f") || !__classPrivateFieldGet(this, _ChatView_modelOptions, "f").length || !__classPrivateFieldGet(this, _ChatView_selectedModel, "f") || !__classPrivateFieldGet(this, _ChatView_onModelChanged, "f")) {
        return '';
    }
    // Check if we need searchable dropdown (20+ options)
    const needsSearch = __classPrivateFieldGet(this, _ChatView_modelOptions, "f").length > 20;
    if (needsSearch) {
        return __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderSearchableModelSelector).call(this);
    }
    else {
        return __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderSimpleModelSelector).call(this);
    }
};
_ChatView_renderSimpleModelSelector = function _ChatView_renderSimpleModelSelector() {
    return html `
      <div class="model-selector">
        <select 
          class="model-select"
          .value=${__classPrivateFieldGet(this, _ChatView_selectedModel, "f")}
          ?disabled=${__classPrivateFieldGet(this, _ChatView_isModelSelectorDisabled, "f")} 
          @change=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleModelChange).bind(this)}
          @focus=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleModelSelectorFocus).bind(this)}
        >
          ${__classPrivateFieldGet(this, _ChatView_modelOptions, "f")?.map(option => html `
            <option value=${option.value} ?selected=${option.value === __classPrivateFieldGet(this, _ChatView_selectedModel, "f")}>${option.label}</option>
          `)}
        </select>
      </div>
    `;
};
_ChatView_renderSearchableModelSelector = function _ChatView_renderSearchableModelSelector() {
    return html `
      <div class="model-selector searchable">
        <button 
          class="model-select-trigger"
          @click=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_toggleModelDropdown).bind(this)}
          ?disabled=${__classPrivateFieldGet(this, _ChatView_isModelSelectorDisabled, "f")}
        >
          <span class="selected-model">${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getSelectedModelLabel).call(this)}</span>
          <span class="dropdown-arrow">${__classPrivateFieldGet(this, _ChatView_isModelDropdownOpen, "f") ? '▲' : '▼'}</span>
        </button>
        
        ${__classPrivateFieldGet(this, _ChatView_isModelDropdownOpen, "f") ? html `
          <div class="model-dropdown ${__classPrivateFieldGet(this, _ChatView_dropdownPosition, "f")}" @click=${(e) => e.stopPropagation()}>
            <input 
              class="model-search"
              type="text"
              placeholder="Search models..."
              @input=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleModelSearch).bind(this)}
              @keydown=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleModelSearchKeydown).bind(this)}
              .value=${__classPrivateFieldGet(this, _ChatView_modelSearchQuery, "f")}
              ${Lit.Directives.ref((el) => {
        if (el)
            el.focus();
    })}
            />
            <div class="model-options">
              ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getFilteredModelOptions).call(this).map((option, index) => html `
                <div 
                  class="model-option ${option.value === __classPrivateFieldGet(this, _ChatView_selectedModel, "f") ? 'selected' : ''} ${index === __classPrivateFieldGet(this, _ChatView_highlightedOptionIndex, "f") ? 'highlighted' : ''}"
                  @click=${() => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_selectModel).call(this, option.value)}
                  @mouseenter=${() => __classPrivateFieldSet(this, _ChatView_highlightedOptionIndex, index, "f")}
                >
                  ${option.label}
                </div>
              `)}
              ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getFilteredModelOptions).call(this).length === 0 ? html `
                <div class="model-option no-results">No matching models found</div>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
};
_ChatView_handleModelChange = function _ChatView_handleModelChange(event) {
    if (__classPrivateFieldGet(this, _ChatView_isModelSelectorDisabled, "f")) {
        return;
    }
    const selectElement = event.target;
    const selectedValue = selectElement.value;
    if (__classPrivateFieldGet(this, _ChatView_onModelChanged, "f")) {
        __classPrivateFieldGet(this, _ChatView_onModelChanged, "f").call(this, selectedValue);
    }
};
_ChatView_handleModelSelectorFocus = function _ChatView_handleModelSelectorFocus() {
    if (__classPrivateFieldGet(this, _ChatView_onModelSelectorFocus, "f")) {
        __classPrivateFieldGet(this, _ChatView_onModelSelectorFocus, "f").call(this);
    }
};
_ChatView_handleOAuthLogin = function _ChatView_handleOAuthLogin() {
    if (__classPrivateFieldGet(this, _ChatView_onOAuthLogin, "f")) {
        __classPrivateFieldGet(this, _ChatView_onOAuthLogin, "f").call(this);
    }
};
_ChatView_handleOpenAISetup = function _ChatView_handleOpenAISetup(event) {
    event.preventDefault();
    // Set the provider to OpenAI in localStorage
    localStorage.setItem('ai_chat_provider', 'openai');
    // Navigate to OpenAI API keys page in current window
    window.location.href = 'https://platform.openai.com/settings/organization/api-keys';
    // Also dispatch an event to open settings dialog
    this.dispatchEvent(new CustomEvent('manual-setup-requested', {
        bubbles: true,
        detail: {
            action: 'open-settings',
            provider: 'openai'
        }
    }));
};
_ChatView_handleManualSetup = function _ChatView_handleManualSetup(event) {
    event.preventDefault();
    // This will trigger opening the settings dialog
    // We can dispatch a custom event that AIChatPanel can listen for
    this.dispatchEvent(new CustomEvent('manual-setup-requested', {
        bubbles: true,
        detail: { action: 'open-settings' }
    }));
};
_ChatView_getSelectedModelLabel = function _ChatView_getSelectedModelLabel() {
    const selectedOption = __classPrivateFieldGet(this, _ChatView_modelOptions, "f")?.find(option => option.value === __classPrivateFieldGet(this, _ChatView_selectedModel, "f"));
    return selectedOption?.label || __classPrivateFieldGet(this, _ChatView_selectedModel, "f") || 'Select Model';
};
_ChatView_getFilteredModelOptions = function _ChatView_getFilteredModelOptions() {
    if (!__classPrivateFieldGet(this, _ChatView_modelOptions, "f"))
        return [];
    if (!__classPrivateFieldGet(this, _ChatView_modelSearchQuery, "f"))
        return __classPrivateFieldGet(this, _ChatView_modelOptions, "f");
    const query = __classPrivateFieldGet(this, _ChatView_modelSearchQuery, "f").toLowerCase();
    return __classPrivateFieldGet(this, _ChatView_modelOptions, "f").filter(option => option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query));
};
_ChatView_toggleModelDropdown = function _ChatView_toggleModelDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    if (__classPrivateFieldGet(this, _ChatView_isModelSelectorDisabled, "f"))
        return;
    __classPrivateFieldSet(this, _ChatView_isModelDropdownOpen, !__classPrivateFieldGet(this, _ChatView_isModelDropdownOpen, "f"), "f");
    if (__classPrivateFieldGet(this, _ChatView_isModelDropdownOpen, "f")) {
        __classPrivateFieldSet(this, _ChatView_modelSearchQuery, '', "f");
        __classPrivateFieldSet(this, _ChatView_highlightedOptionIndex, 0, "f");
        // Calculate dropdown position
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_calculateDropdownPosition).call(this, event.currentTarget);
        // Add click outside handler with slight delay to avoid immediate trigger
        setTimeout(() => {
            document.addEventListener('click', __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleClickOutside).bind(this), { once: true });
        }, 100);
    }
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
};
_ChatView_calculateDropdownPosition = function _ChatView_calculateDropdownPosition(triggerElement) {
    const rect = triggerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 300; // Max height from CSS
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    // If not enough space below and more space above, show dropdown above
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        __classPrivateFieldSet(this, _ChatView_dropdownPosition, 'above', "f");
    }
    else {
        __classPrivateFieldSet(this, _ChatView_dropdownPosition, 'below', "f");
    }
};
_ChatView_handleClickOutside = function _ChatView_handleClickOutside(event) {
    const target = event.target;
    // Check if click is within the model selector or dropdown
    const modelSelector = target.closest('.model-selector.searchable');
    const modelDropdown = target.closest('.model-dropdown');
    if (!modelSelector && !modelDropdown) {
        __classPrivateFieldSet(this, _ChatView_isModelDropdownOpen, false, "f");
        __classPrivateFieldSet(this, _ChatView_dropdownPosition, 'below', "f"); // Reset position
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
    }
};
_ChatView_handleModelSearch = function _ChatView_handleModelSearch(event) {
    const input = event.target;
    __classPrivateFieldSet(this, _ChatView_modelSearchQuery, input.value, "f");
    __classPrivateFieldSet(this, _ChatView_highlightedOptionIndex, 0, "f"); // Reset highlight to first item
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
};
_ChatView_handleModelSearchKeydown = function _ChatView_handleModelSearchKeydown(event) {
    const filteredOptions = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getFilteredModelOptions).call(this);
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            __classPrivateFieldSet(this, _ChatView_highlightedOptionIndex, Math.min(__classPrivateFieldGet(this, _ChatView_highlightedOptionIndex, "f") + 1, filteredOptions.length - 1), "f");
            void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
            break;
        case 'ArrowUp':
            event.preventDefault();
            __classPrivateFieldSet(this, _ChatView_highlightedOptionIndex, Math.max(__classPrivateFieldGet(this, _ChatView_highlightedOptionIndex, "f") - 1, 0), "f");
            void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
            break;
        case 'Enter':
            event.preventDefault();
            if (filteredOptions[__classPrivateFieldGet(this, _ChatView_highlightedOptionIndex, "f")]) {
                __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_selectModel).call(this, filteredOptions[__classPrivateFieldGet(this, _ChatView_highlightedOptionIndex, "f")].value);
            }
            break;
        case 'Escape':
            event.preventDefault();
            __classPrivateFieldSet(this, _ChatView_isModelDropdownOpen, false, "f");
            __classPrivateFieldSet(this, _ChatView_dropdownPosition, 'below', "f"); // Reset position
            void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
            break;
    }
};
_ChatView_selectModel = function _ChatView_selectModel(modelValue) {
    if (__classPrivateFieldGet(this, _ChatView_onModelChanged, "f")) {
        __classPrivateFieldGet(this, _ChatView_onModelChanged, "f").call(this, modelValue);
    }
    __classPrivateFieldSet(this, _ChatView_isModelDropdownOpen, false, "f");
    __classPrivateFieldSet(this, _ChatView_modelSearchQuery, '', "f");
    __classPrivateFieldSet(this, _ChatView_dropdownPosition, 'below', "f"); // Reset position
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
};
_ChatView_copyToClipboard = function _ChatView_copyToClipboard(text) {
    // Copy to clipboard using the Clipboard API
    navigator.clipboard.writeText(text)
        .then(() => {
        // Show a brief visual feedback by temporarily changing the tooltip text
        const copyButtons = this.shadowRoot?.querySelectorAll('.message-action-button') || [];
        copyButtons.forEach(button => {
            const tooltip = button.querySelector('.action-tooltip');
            if (tooltip) {
                const originalText = tooltip.textContent;
                tooltip.textContent = 'Copied!';
                // Reset after short delay
                setTimeout(() => {
                    tooltip.textContent = originalText;
                }, TIMING_CONSTANTS.COPY_FEEDBACK_DURATION);
            }
        });
    })
        .catch(err => {
        logger.error('Failed to copy text: ', err);
    });
};
_ChatView_checkForUpdates = 
// Method to check for updates
async function _ChatView_checkForUpdates() {
    try {
        const versionChecker = VersionChecker.getInstance();
        // Version is now automatically loaded from Version.ts
        logger.info('Checking for updates...');
        // Check if we need to clear stale cache due to version change
        const cachedInfo = versionChecker.getCachedVersionInfo();
        if (cachedInfo && cachedInfo.currentVersion !== versionChecker.getCurrentVersion()) {
            logger.info('Clearing cache due to version change');
            versionChecker.clearCache();
        }
        const versionInfo = await versionChecker.checkForUpdates();
        logger.info('Version info received:', versionInfo);
        if (versionInfo) {
            logger.info('Update available?', versionInfo.isUpdateAvailable);
            logger.info('Is update dismissed?', versionChecker.isUpdateDismissed(versionInfo.latestVersion));
        }
        if (versionInfo && versionInfo.isUpdateAvailable && !versionChecker.isUpdateDismissed(versionInfo.latestVersion)) {
            logger.info('Showing version banner for version:', versionInfo.latestVersion);
            __classPrivateFieldSet(this, _ChatView_versionInfo, versionInfo, "f");
            __classPrivateFieldSet(this, _ChatView_isVersionBannerDismissed, false, "f");
            void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
        }
        else {
            logger.info('Not showing version banner');
        }
    }
    catch (error) {
        logger.error('Failed to check for updates:', error);
    }
};
_ChatView_dismissVersionBanner = function _ChatView_dismissVersionBanner() {
    __classPrivateFieldSet(this, _ChatView_isVersionBannerDismissed, true, "f");
    if (__classPrivateFieldGet(this, _ChatView_versionInfo, "f")) {
        VersionChecker.getInstance().dismissUpdate();
    }
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
};
_ChatView_renderVersionBanner = function _ChatView_renderVersionBanner() {
    logger.info('Rendering version banner:', {
        versionInfo: __classPrivateFieldGet(this, _ChatView_versionInfo, "f"),
        isUpdateAvailable: __classPrivateFieldGet(this, _ChatView_versionInfo, "f")?.isUpdateAvailable,
        isVersionBannerDismissed: __classPrivateFieldGet(this, _ChatView_isVersionBannerDismissed, "f"),
        messageCount: __classPrivateFieldGet(this, _ChatView_messages, "f").length
    });
    // Hide banner after first message or if dismissed
    if (!__classPrivateFieldGet(this, _ChatView_versionInfo, "f") || !__classPrivateFieldGet(this, _ChatView_versionInfo, "f").isUpdateAvailable ||
        __classPrivateFieldGet(this, _ChatView_isVersionBannerDismissed, "f") || __classPrivateFieldGet(this, _ChatView_messages, "f").length > 1) {
        logger.info('Not rendering version banner - conditions not met');
        return html ``;
    }
    logger.info('Rendering version banner for version:', __classPrivateFieldGet(this, _ChatView_versionInfo, "f").latestVersion);
    return html `
      <div class="version-banner">
        <div class="version-banner-content">
          <span class="version-banner-icon">🎉</span>
          <span class="version-banner-text">
            New version ${__classPrivateFieldGet(this, _ChatView_versionInfo, "f").latestVersion} is available!
          </span>
          <a 
            class="version-banner-link" 
            href="${__classPrivateFieldGet(this, _ChatView_versionInfo, "f").releaseUrl}" 
            target="_blank"
            rel="noopener noreferrer"
          >
            View Release
          </a>
        </div>
        <button 
          class="version-banner-dismiss" 
          @click=${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_dismissVersionBanner).bind(this)}
          title="Dismiss"
          aria-label="Dismiss update notification"
        >
          ✕
        </button>
      </div>
    `;
};
_ChatView_parseStructuredResponse = function _ChatView_parseStructuredResponse(text) {
    try {
        // Look for the XML format with <reasoning> and <markdown_report> tags
        const reasoningMatch = text.match(REGEX_PATTERNS.REASONING_TAG);
        const reportMatch = text.match(REGEX_PATTERNS.MARKDOWN_REPORT_TAG);
        if (reasoningMatch && reportMatch) {
            const reasoning = reasoningMatch[1].trim();
            const markdownReport = reportMatch[1].trim();
            // Validate extracted content
            if (reasoning && markdownReport && markdownReport.length >= CONTENT_THRESHOLDS.MARKDOWN_REPORT_MIN_LENGTH) {
                return { reasoning, markdownReport };
            }
        }
    }
    catch (error) {
        logger.error('Failed to parse structured response:', error);
    }
    return null;
};
_ChatView_renderStructuredResponse = function _ChatView_renderStructuredResponse(structuredResponse, combinedIndex) {
    logger.info('Starting renderStructuredResponse:', {
        combinedIndex,
        hasMessages: Boolean(__classPrivateFieldGet(this, _ChatView_messages, "f")),
        messagesLength: __classPrivateFieldGet(this, _ChatView_messages, "f")?.length,
        lastProcessedKey: __classPrivateFieldGet(this, _ChatView_lastProcessedMessageKey, "f"),
        reasoningPreview: structuredResponse.reasoning.slice(0, 50) + '...'
    });
    const messageKey = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getMessageStateKey).call(this, structuredResponse);
    const isLastMessage = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_isLastStructuredMessage).call(this, combinedIndex || 0);
    logger.info('Rendering structured response decision:', {
        messageKey,
        combinedIndex,
        isLastMessage,
        lastProcessedKey: __classPrivateFieldGet(this, _ChatView_lastProcessedMessageKey, "f"),
        shouldAutoProcess: isLastMessage && messageKey !== __classPrivateFieldGet(this, _ChatView_lastProcessedMessageKey, "f")
    });
    // Auto-process only last message
    if (isLastMessage && messageKey !== __classPrivateFieldGet(this, _ChatView_lastProcessedMessageKey, "f")) {
        const aiState = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getMessageAIAssistantState).call(this, messageKey);
        if (aiState === 'not-attempted') {
            // Set to pending immediately for loading state
            logger.info('Setting state to pending and starting AI Assistant for LAST message key:', messageKey);
            __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_setMessageAIAssistantState).call(this, messageKey, 'pending');
            __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_attemptAIAssistantOpen).call(this, structuredResponse.markdownReport, messageKey);
            __classPrivateFieldSet(this, _ChatView_lastProcessedMessageKey, messageKey, "f");
        }
    }
    const aiState = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getMessageAIAssistantState).call(this, messageKey);
    return __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderStructuredMessage).call(this, structuredResponse, messageKey, aiState, isLastMessage);
};
_ChatView_renderStructuredMessage = function _ChatView_renderStructuredMessage(structuredResponse, messageKey, aiState, isLastMessage) {
    logger.info('Rendering structured message:', { messageKey, aiState, isLastMessage });
    return html `
      <div class="message model-message final">
        <div class="message-content">
          <div class="message-text">${renderMarkdown(structuredResponse.reasoning, __classPrivateFieldGet(this, _ChatView_markdownRenderer, "f"), __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_openInAIAssistantViewer).bind(this))}</div>
          
          ${aiState === 'pending' ? html `
            <!-- Loading state: Use existing loading element -->
            <div class="message-loading">
              <svg class="loading-spinner" width="16" height="16" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="30 12" stroke-linecap="round">
                  <animateTransform 
                    attributeName="transform" 
                    attributeType="XML" 
                    type="rotate" 
                    from="0 8 8" 
                    to="360 8 8" 
                    dur="1s" 
                    repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          ` : aiState === 'opened' ? html `
            <!-- Success: just button -->
            <div class="deep-research-actions">
              <button 
                class="view-document-btn"
                @click=${() => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_openInAIAssistantViewer).call(this, structuredResponse.markdownReport)}
                title="Open full report in document viewer">
                📄 View Full Report
              </button>
            </div>
          ` : html `
            <!-- Failed or previous messages: inline + button -->
            <div class="inline-markdown-report">
              <div class="inline-report-header">
                <h3>Full Research Report</h3>
              </div>
              <div class="inline-report-content">
                ${renderMarkdown(structuredResponse.markdownReport, __classPrivateFieldGet(this, _ChatView_markdownRenderer, "f"), __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_openInAIAssistantViewer).bind(this))}
              </div>
            </div>
            <div class="deep-research-actions">
              <button 
                class="view-document-btn"
                @click=${() => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_openInAIAssistantViewer).call(this, structuredResponse.markdownReport)}
                title="Open full report in document viewer">
                📄 ${isLastMessage ? '' : 'View Full Report'}
              </button>
            </div>
          `}
        </div>
      </div>
    `;
};
_ChatView_attemptAIAssistantOpen = 
// Attempt to open AI Assistant for a specific message
async function _ChatView_attemptAIAssistantOpen(markdownContent, messageKey) {
    logger.info('ATTEMPTING AI ASSISTANT OPEN:', {
        messageKey,
        contentLength: markdownContent.length,
        contentPreview: markdownContent.slice(0, 200) + '...'
    });
    try {
        logger.info('Calling #openInAIAssistantViewer for key:', messageKey);
        await __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_openInAIAssistantViewer).call(this, markdownContent);
        logger.info('AI Assistant opened successfully, setting state to opened for key:', messageKey);
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_setMessageAIAssistantState).call(this, messageKey, 'opened');
    }
    catch (error) {
        logger.warn('AI Assistant navigation failed for key:', { messageKey, error });
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_setMessageAIAssistantState).call(this, messageKey, 'failed');
    }
    // Trigger single re-render after state change
    logger.info('Triggering re-render after AI Assistant state change for key:', messageKey);
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
};
_ChatView_openInAIAssistantViewer = 
// Method to open markdown content in AI Assistant viewer in the same tab
async function _ChatView_openInAIAssistantViewer(markdownContent) {
    // Get the primary page target to navigate the inspected page
    const target = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    if (!target) {
        throw new Error(ERROR_MESSAGES.NO_PRIMARY_TARGET);
    }
    // Get the ResourceTreeModel to navigate the page
    const resourceTreeModel = target.model(SDK.ResourceTreeModel.ResourceTreeModel);
    if (!resourceTreeModel) {
        throw new Error('No ResourceTreeModel found');
    }
    // Navigate to browser-operator://assistant
    const url = 'browser-operator://assistant';
    const navigationResult = await resourceTreeModel.navigate(url);
    if (navigationResult.errorText) {
        throw new Error(`Navigation failed: ${navigationResult.errorText}`);
    }
    // Wait for the page to load, then inject the markdown content
    // Use event-based detection or timeout as fallback
    const injectContent = async () => {
        const runtimeModel = target.model(SDK.RuntimeModel.RuntimeModel);
        if (!runtimeModel) {
            logger.error('No RuntimeModel found');
            throw new Error('No RuntimeModel found');
        }
        // Escape the markdown content for JavaScript injection
        const escapedContent = JSON.stringify(markdownContent);
        // JavaScript to inject - calls the global function we added to AI Assistant
        const injectionScript = `
          (function() {
            console.log('DevTools injecting markdown content...', 'Content length:', ${JSON.stringify(markdownContent.length)});
            console.log('Available global functions:', Object.keys(window).filter(k => k.includes('setDevTools') || k.includes('aiAssistant')));
            
            if (typeof window.setDevToolsMarkdown === 'function') {
              try {
                window.setDevToolsMarkdown(${escapedContent});
                console.log('Successfully called setDevToolsMarkdown function');
                return 'SUCCESS: Content injected via setDevToolsMarkdown function';
              } catch (error) {
                console.error('Error calling setDevToolsMarkdown:', error);
                return 'ERROR: Failed to call setDevToolsMarkdown: ' + error.message;
              }
            } else {
              console.warn('setDevToolsMarkdown function not found, using fallback methods');
              console.log('Available window properties:', Object.keys(window).filter(k => k.includes('DevTools') || k.includes('assistant') || k.includes('ai')));
              
              // Store in sessionStorage
              sessionStorage.setItem('devtools-markdown-content', ${escapedContent});
              console.log('Stored content in sessionStorage');
              
              // Try to trigger app reload
              if (window.aiAssistantApp && typeof window.aiAssistantApp.loadFromSessionStorage === 'function') {
                try {
                  window.aiAssistantApp.loadFromSessionStorage();
                  console.log('Successfully called aiAssistantApp.loadFromSessionStorage');
                  return 'SUCCESS: Content stored and app reloaded';
                } catch (error) {
                  console.error('Error calling loadFromSessionStorage:', error);
                  return 'ERROR: Content stored but failed to reload app: ' + error.message;
                }
              } else {
                console.log('aiAssistantApp not available or loadFromSessionStorage not a function');
                console.log('aiAssistantApp type:', typeof window.aiAssistantApp);
                if (window.aiAssistantApp) {
                  console.log('aiAssistantApp methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.aiAssistantApp)));
                }
                
                // Try to force a page reload as last resort
                try {
                  location.reload();
                  return 'SUCCESS: Content stored, forcing page reload';
                } catch (error) {
                  return 'SUCCESS: Content stored in sessionStorage, but manual refresh may be needed';
                }
              }
            }
          })();
        `;
        try {
            // Get the default execution context and evaluate the script
            const executionContext = runtimeModel.defaultExecutionContext();
            if (!executionContext) {
                logger.error('No execution context available');
                throw new Error('No execution context available');
            }
            const result = await executionContext.evaluate({
                expression: injectionScript,
                objectGroup: 'console',
                includeCommandLineAPI: false,
                silent: false,
                returnByValue: true,
                generatePreview: false
            }, false, false);
            if ('error' in result) {
                logger.error('Evaluation failed:', result.error);
                throw new Error(`Evaluation failed: ${result.error}`);
            }
            if (result.object.value) {
                logger.info('Content injection result:', result.object.value);
                // Check if injection was successful
                if (typeof result.object.value === 'string' && result.object.value.startsWith('ERROR:')) {
                    throw new Error(result.object.value);
                }
            }
            else if (result.exceptionDetails) {
                logger.error('Content injection failed:', result.exceptionDetails.text);
                throw new Error(`Content injection failed: ${result.exceptionDetails.text || 'Unknown error'}`);
            }
        }
        catch (error) {
            logger.error('Failed to inject content:', error);
            throw error; // Re-throw to propagate to caller
        }
    };
    // Try to detect when AI Assistant is ready
    let retries = 0;
    const maxRetries = TIMING_CONSTANTS.AI_ASSISTANT_MAX_RETRIES;
    // Return a promise that resolves/rejects based on injection success
    return new Promise((resolve, reject) => {
        const attemptInjection = () => {
            setTimeout(async () => {
                try {
                    const runtimeModel = target.model(SDK.RuntimeModel.RuntimeModel);
                    if (!runtimeModel) {
                        reject(new Error('No RuntimeModel found'));
                        return;
                    }
                    const executionContext = runtimeModel.defaultExecutionContext();
                    if (!executionContext) {
                        reject(new Error('No execution context available'));
                        return;
                    }
                    // Check if AI Assistant is ready
                    const checkResult = await executionContext.evaluate({
                        expression: 'typeof window.setDevToolsMarkdown === "function" || (window.aiAssistantApp && typeof window.aiAssistantApp.loadFromSessionStorage === "function")',
                        objectGroup: 'console',
                        includeCommandLineAPI: false,
                        silent: true,
                        returnByValue: true,
                        generatePreview: false
                    }, false, false);
                    if (!('error' in checkResult) && checkResult.object.value === true) {
                        // AI Assistant is ready
                        await injectContent();
                        resolve();
                    }
                    else if (retries < maxRetries) {
                        // Retry with exponential backoff
                        retries++;
                        attemptInjection();
                    }
                    else {
                        logger.error('AI Assistant did not load in time');
                        // Try to inject anyway as a last resort
                        try {
                            await injectContent();
                            resolve();
                        }
                        catch (error) {
                            reject(error);
                        }
                    }
                }
                catch (error) {
                    reject(error);
                }
            }, TIMING_CONSTANTS.AI_ASSISTANT_RETRY_DELAY * Math.pow(2, retries));
        };
        attemptInjection();
    });
};
_ChatView_toggleAgentView = function _ChatView_toggleAgentView() {
    __classPrivateFieldSet(this, _ChatView_agentViewMode, __classPrivateFieldGet(this, _ChatView_agentViewMode, "f") === 'simplified' ? 'enhanced' : 'simplified', "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f"));
};
_ChatView_toggleToolDetails = function _ChatView_toggleToolDetails(event) {
    const clickTarget = event.target;
    const button = clickTarget.closest('.tool-toggle');
    if (!button)
        return;
    const container = button.closest('.agent-execution-timeline');
    if (!container)
        return;
    const summary = container.querySelector('.tool-summary');
    const details = container.querySelector('.tool-details');
    const toggleIcon = button.querySelector('.toggle-icon');
    if (!details || !toggleIcon)
        return;
    if (details.style.display === 'none') {
        // Show details
        summary.style.display = 'none';
        details.style.display = 'flex';
        toggleIcon.textContent = '▲';
    }
    else {
        // Hide details
        summary.style.display = 'flex';
        details.style.display = 'none';
        toggleIcon.textContent = '▼';
    }
};
_ChatView_toggleToolResult = function _ChatView_toggleToolResult(event) {
    const clickTarget = event.target;
    const button = clickTarget.closest('.tool-toggle');
    if (!button)
        return;
    const container = button.closest('.agent-execution-timeline');
    if (!container)
        return;
    const result = container.querySelector('.timeline-items');
    const toggleIcon = button.querySelector('.toggle-icon');
    if (!result || !toggleIcon)
        return;
    if (result.style.display === 'none') {
        // Show result
        result.style.display = 'block';
        toggleIcon.textContent = '▲';
    }
    else {
        // Hide result
        result.style.display = 'none';
        toggleIcon.textContent = '▼';
    }
};
_ChatView_toggleAgentSessionDetails = function _ChatView_toggleAgentSessionDetails(event) {
    const clickTarget = event.target;
    const button = clickTarget.closest('.tool-toggle');
    if (!button)
        return;
    const container = button.closest('.agent-session-container');
    if (!container)
        return;
    const timelineItems = container.querySelector('.timeline-items');
    const nestedSessions = container.querySelector('.nested-sessions');
    const toggleIcon = button.querySelector('.toggle-icon');
    if (!toggleIcon)
        return;
    if (timelineItems.style.display === 'none') {
        // Show details
        timelineItems.style.display = 'block';
        if (nestedSessions) {
            nestedSessions.style.display = 'block';
        }
        toggleIcon.textContent = '▲';
    }
    else {
        // Hide details
        timelineItems.style.display = 'none';
        if (nestedSessions) {
            nestedSessions.style.display = 'none';
        }
        toggleIcon.textContent = '▼';
    }
};
_ChatView_renderTaskCompletion = function _ChatView_renderTaskCompletion(agentSession) {
    if (!agentSession) {
        return html ``;
    }
    return html `
      <div class="agent-execution-timeline">
        ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderAgentSessionTimeline).call(this, agentSession)}
      </div>
    `;
};
_ChatView_renderAgentSessionTimeline = function _ChatView_renderAgentSessionTimeline(session, depth = 0, visitedSessions = new Set()) {
    // Prevent infinite recursion with depth limit and visited tracking
    if (depth > 10 || visitedSessions.has(session.sessionId)) {
        return html `<div class="max-depth-reached">Maximum nesting depth reached</div>`;
    }
    visitedSessions.add(session.sessionId);
    const uiConfig = getAgentUIConfig(session.agentName, session.config);
    const toolMessages = session.messages.filter(msg => msg.type === 'tool_call');
    const toolResults = session.messages.filter(msg => msg.type === 'tool_result');
    return html `
      ${session.agentReasoning ? html `<div class="message">${session.agentReasoning}</div>` : ''}
      <div class="agent-session-container">
        <div class="agent-header">
          <div class="agent-marker"></div>
          <div class="agent-title">${uiConfig.displayName}</div>
          <div class="agent-divider"></div>
          <button class="tool-toggle" @click=${(e) => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_toggleAgentSessionDetails).call(this, e)}>
            <span class="toggle-icon">▼</span>
          </button>
        </div>

        <div class="timeline-items" style="display: none;">
          ${session.agentQuery ? html `
          <div class="timeline-item">
            <div class="tool-line">
              <div class="tool-description-multiline">
                <span class="tool-description-indicator">─</span>
                <span style="margin-left: 4px;">${session.agentQuery}</span>
              </div>
            </div>
          </div>
          ` : ''}
          ${toolMessages.map(toolMsg => {
        const toolContent = toolMsg.content;
        const toolResult = toolResults.find(result => {
            const resultContent = result.content;
            return resultContent.toolCallId === toolContent.toolCallId;
        });
        return __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderTimelineItem).call(this, toolMsg, toolResult);
    })}
        </div>
        
        <div class="nested-sessions" style="display: none;">
          ${session.nestedSessions.map(nested => html `
            <div class="handoff-indicator">
              <span class="handoff-arrow">↓</span>
              <span class="handoff-text">Handoff to ${getAgentUIConfig(nested.agentName, nested.config).displayName}</span>
            </div>
            ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderAgentSessionTimeline).call(this, nested, depth + 1, new Set(visitedSessions))}
          `)}
        </div>
      </div>
    `;
};
_ChatView_renderTimelineItem = function _ChatView_renderTimelineItem(toolMessage, toolResult) {
    const toolContent = toolMessage.content;
    const resultContent = toolResult?.content;
    const toolName = toolContent.toolName;
    const toolArgs = toolContent.toolArgs || {};
    // Determine status based on tool result
    let status = 'running';
    if (toolResult && resultContent) {
        status = resultContent.success ? 'completed' : 'error';
    }
    const icon = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getToolIcon).call(this, toolName);
    const toolNameDisplay = toolName.replace(/_/g, ' ');
    const descriptionData = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getToolDescription).call(this, toolName, toolArgs);
    const resultText = resultContent?.result ? JSON.stringify(resultContent.result, null, 2) : '';
    if (descriptionData.isMultiLine) {
        // Multi-line format - just the timeline item, no wrapper
        return html `
        <div class="timeline-item">
          <div class="tool-line">
            <div class="tool-description-multiline" style="display: block;">
              <span class="tool-description-indicator">─</span>
              <span style="margin-left: 4px;">${icon}  ${toolNameDisplay}:</span>
              ${descriptionData.content.map(arg => html `
                <div class="tool-arg">
                  <span class="tool-arg-key">${arg.key}:</span>
                  <span class="tool-arg-value">${arg.value}</span>
                </div>
              `)}
            </div>
            <span class="tool-status-marker ${status}" title="${status === 'running' ? 'Running' : status === 'completed' ? 'Completed' : status === 'error' ? 'Error' : 'Unknown'}">●</span>
          </div>
        </div>
      `;
    }
    else {
        // Single-line format
        return html `
        <div class="timeline-item">
          <div class="tool-line">
            <div class="tool-description-multiline">
              <span class="tool-description-indicator">─</span>
              <span style="margin-left: 4px;">${icon}  ${descriptionData.content}</span>
            </div>
            <span class="tool-status-marker ${status}" title="${status === 'running' ? 'Running' : status === 'completed' ? 'Completed' : status === 'error' ? 'Error' : 'Unknown'}">●</span>
          </div>
        </div>
      `;
    }
};
_ChatView_generateTaskTitle = function _ChatView_generateTaskTitle(agentSession) {
    if (!agentSession) {
        return 'AI Task Execution';
    }
    const totalTools = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_countTotalTools).call(this, agentSession);
    return `Completed task using ${totalTools} tools`;
};
_ChatView_countTotalTools = function _ChatView_countTotalTools(session) {
    const sessionTools = session.messages.filter(msg => msg.type === 'tool_call').length;
    const nestedTools = session.nestedSessions.reduce((total, nested) => {
        return total + __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_countTotalTools).call(this, nested);
    }, 0);
    return sessionTools + nestedTools;
};
_ChatView_renderSimplifiedContent = function _ChatView_renderSimplifiedContent(agentSession) {
    if (!agentSession) {
        return html ``;
    }
    const allToolCalls = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_flattenToolCalls).call(this, agentSession);
    return html `
      <div class="simplified-content">
        ${allToolCalls.map(tool => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderSimpleToolItem).call(this, tool))}
        <button class="show-more-button" @click=${() => { __classPrivateFieldSet(this, _ChatView_agentViewMode, 'enhanced', "f"); void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f")); }}>
          🔍 Show Agent Details
        </button>
      </div>
    `;
};
_ChatView_flattenToolCalls = function _ChatView_flattenToolCalls(session) {
    const sessionToolCalls = session.messages
        .filter(msg => msg.type === 'tool_call')
        .map(msg => ({
        toolName: msg.content.toolName,
        args: msg.content.toolArgs
    }));
    const nestedToolCalls = session.nestedSessions.flatMap(nested => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_flattenToolCalls).call(this, nested));
    return [...sessionToolCalls, ...nestedToolCalls];
};
_ChatView_renderSimpleToolItem = function _ChatView_renderSimpleToolItem(tool) {
    const icon = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getToolIcon).call(this, tool.toolName);
    const description = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getToolDescription).call(this, tool.toolName, tool.args);
    return html `
      <div class="tool-item">
        <div class="tool-icon">${icon}</div>
        <div class="tool-text">${description}</div>
      </div>
    `;
};
_ChatView_getToolIcon = function _ChatView_getToolIcon(toolName) {
    if (toolName.includes('search'))
        return '🔍';
    if (toolName.includes('browse') || toolName.includes('navigate'))
        return '🌐';
    if (toolName.includes('create') || toolName.includes('write'))
        return '📝';
    if (toolName.includes('extract') || toolName.includes('analyze'))
        return '🔬';
    if (toolName.includes('click') || toolName.includes('action'))
        return '👆';
    return '🔧';
};
_ChatView_formatValueForDisplay = function _ChatView_formatValueForDisplay(value, depth = 0) {
    // Prevent infinite recursion
    if (depth > 10) {
        return '[Max depth reached]';
    }
    if (value === null || value === undefined) {
        return String(value);
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }
    if (Array.isArray(value)) {
        if (value.length === 0)
            return '[]';
        if (value.length === 1)
            return __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_formatValueForDisplay).call(this, value[0], depth + 1);
        return value.map(item => `- ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_formatValueForDisplay).call(this, item, depth + 1)}`).join('\n');
    }
    if (typeof value === 'object') {
        // Handle circular references by using try-catch
        try {
            const entries = Object.entries(value);
            if (entries.length === 0)
                return '{}';
            if (entries.length === 1) {
                const [k, v] = entries[0];
                return `${k}: ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_formatValueForDisplay).call(this, v, depth + 1)}`;
            }
            return entries.map(([k, v]) => `${k}: ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_formatValueForDisplay).call(this, v, depth + 1)}`).join('\n');
        }
        catch (error) {
            return '[Circular reference detected]';
        }
    }
    return String(value);
};
_ChatView_getToolDescription = function _ChatView_getToolDescription(toolName, args) {
    const action = toolName.replace(/_/g, ' ').toLowerCase();
    // Filter out common metadata fields
    const filteredArgs = Object.fromEntries(Object.entries(args).filter(([key]) => key !== 'reasoning' && key !== 'toolCallId' && key !== 'timestamp'));
    const argKeys = Object.keys(filteredArgs);
    if (argKeys.length === 0) {
        return { isMultiLine: false, content: action, action };
    }
    if (argKeys.length === 1) {
        // Single argument - inline format
        const [key, value] = Object.entries(filteredArgs)[0];
        const formattedValue = __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_formatValueForDisplay).call(this, value);
        const needsNewline = formattedValue.length > 80;
        return { isMultiLine: false, content: `${action}:${needsNewline ? '\n' : ''}${formattedValue}`, action };
    }
    // Multiple arguments - return structured data for multi-line rendering
    // Sort to put 'query' first if it exists
    const sortedKeys = argKeys.sort((a, b) => {
        if (a === 'query')
            return -1;
        if (b === 'query')
            return 1;
        return 0;
    });
    const argsArray = sortedKeys.map(key => ({
        key,
        value: __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_formatValueForDisplay).call(this, filteredArgs[key])
    }));
    return { isMultiLine: true, content: argsArray, action };
};
_ChatView_renderEnhancedContent = function _ChatView_renderEnhancedContent(agentSession) {
    if (!agentSession) {
        return html ``;
    }
    return html `
      <div class="enhanced-content">
        ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderAgentSession).call(this, agentSession, 0)}
        <button class="show-less-button" @click=${() => { __classPrivateFieldSet(this, _ChatView_agentViewMode, 'simplified', "f"); void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChatView_boundRender, "f")); }}>
          ↑ Show Simplified View
        </button>
      </div>
    `;
};
_ChatView_renderAgentSession = function _ChatView_renderAgentSession(session, depth) {
    const uiConfig = getAgentUIConfig(session.agentName, session.config);
    return html `
      <div class="agent-session" style="margin-left: ${depth * 20}px">
        ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderAgentHeader).call(this, session, uiConfig)}
        <div class="agent-session-content">
          ${session.reasoning ? __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderReasoningBubble).call(this, session.reasoning) : Lit.nothing}
          <div class="tool-sequence">
            ${session.messages.map(msg => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderAgentMessage).call(this, msg))}
          </div>
          ${session.nestedSessions.map((nested, index) => html `
            ${index === 0 ? __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderHandoffIndicator).call(this, session.agentName, nested.agentName) : Lit.nothing}
            ${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderAgentSession).call(this, nested, depth + 1)}
          `)}
        </div>
      </div>
    `;
};
_ChatView_renderAgentHeader = function _ChatView_renderAgentHeader(session, uiConfig) {
    return html `
      <div class="agent-session-header" style="background: ${uiConfig.backgroundColor}; border-left: 4px solid ${uiConfig.color}">
        <div class="agent-avatar" style="background: ${uiConfig.backgroundColor}; color: ${uiConfig.color}">
          ${uiConfig.avatar}
        </div>
        <div class="agent-info">
          <div class="agent-name">${uiConfig.displayName}</div>
          <div class="agent-status">
            <span class="status-badge ${session.status}">${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getStatusText).call(this, session)}</span>
            <span>${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getStatusDescription).call(this, session)}</span>
          </div>
        </div>
      </div>
    `;
};
_ChatView_getStatusText = function _ChatView_getStatusText(session) {
    switch (session.status) {
        case 'completed': return 'Completed';
        case 'running': return 'Running';
        case 'error': return 'Error';
        default: return 'Unknown';
    }
};
_ChatView_getStatusDescription = function _ChatView_getStatusDescription(session) {
    const toolCount = session.messages.filter(msg => msg.type === 'tool_call').length;
    if (toolCount === 0) {
        return 'No tools executed';
    }
    return `Executed ${toolCount} tool${toolCount === 1 ? '' : 's'}`;
};
_ChatView_renderReasoningBubble = function _ChatView_renderReasoningBubble(reasoning) {
    return html `
      <div class="agent-reasoning">
        ${reasoning}
      </div>
    `;
};
_ChatView_renderHandoffIndicator = function _ChatView_renderHandoffIndicator(fromAgent, toAgent) {
    return html `
      <div class="handoff-indicator">
        <div class="handoff-line"></div>
        <div class="handoff-badge">→ Handoff to ${toAgent}</div>
      </div>
    `;
};
_ChatView_renderAgentMessage = function _ChatView_renderAgentMessage(message) {
    switch (message.type) {
        case 'reasoning':
            return html `<div class="reasoning-message">💭 ${message.content.text}</div>`;
        case 'tool_call':
            return __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderToolCall).call(this, message);
        case 'tool_result':
            return __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_renderToolResult).call(this, message);
        case 'handoff':
            return html ``; // Don't render handoff messages as they're handled by the handoff indicator
        case 'final_answer':
            return html `<div class="final-answer-message">🎯 ${message.content.answer}</div>`;
        default:
            return html ``;
    }
};
_ChatView_renderToolCall = function _ChatView_renderToolCall(message) {
    const content = message.content;
    return html `
      <div class="enterprise-tool success">
        <div class="tool-header">
          <div class="tool-name">${content.toolName}</div>
          <div class="tool-status status-success">✓ Success</div>
        </div>
        <div class="tool-description">${__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_getToolDescription).call(this, content.toolName, content.toolArgs)}</div>
        <div class="tool-details">${JSON.stringify(content.toolArgs, null, 2)}</div>
      </div>
    `;
};
_ChatView_renderToolResult = function _ChatView_renderToolResult(message) {
    const content = message.content;
    const statusClass = content.success ? 'success' : 'error';
    const statusIcon = content.success ? '✓' : '❌';
    return html `
      <div class="tool-result ${statusClass}">
        <div class="tool-result-header">
          ${statusIcon} ${content.toolName} result
        </div>
        ${content.result ? html `
          <div class="tool-result-content">
            ${typeof content.result === 'string' ? content.result : JSON.stringify(content.result, null, 2)}
          </div>
        ` : Lit.nothing}
        ${content.error ? html `<div class="error-text">${content.error}</div>` : Lit.nothing}
      </div>
    `;
};
ChatView.litTagName = Lit.StaticHtml.literal `devtools-chat-view`;
ChatView = __decorate([
    customElement('devtools-chat-view')
], ChatView);
export { ChatView };
//# sourceMappingURL=ChatView.js.map