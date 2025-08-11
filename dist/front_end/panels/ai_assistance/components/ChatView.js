// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _ChatView_instances, _ChatView_shadow, _ChatView_markdownRenderer, _ChatView_scrollTop, _ChatView_props, _ChatView_messagesContainerElement, _ChatView_mainElementRef, _ChatView_messagesContainerResizeObserver, _ChatView_popoverHelper, _ChatView_pinScrollToBottom, _ChatView_isProgrammaticScroll, _ChatView_handleChatUiRef, _ChatView_handleMessagesContainerResize, _ChatView_setMainElementScrollTop, _ChatView_setInputText, _ChatView_handleMessageContainerRef, _ChatView_handleScroll, _ChatView_handleSubmit, _ChatView_handleTextAreaKeyDown, _ChatView_handleCancel, _ChatView_handleImageUpload, _ChatView_handleSuggestionClick, _ChatView_render;
import '../../../ui/components/spinners/spinners.js';
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Root from '../../../core/root/root.js';
import * as AiAssistanceModel from '../../../models/ai_assistance/ai_assistance.js';
import * as Marked from '../../../third_party/marked/marked.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import { PatchWidget } from '../PatchWidget.js';
import chatViewStyles from './chatView.css.js';
import { MarkdownRendererWithCodeBlock } from './MarkdownRendererWithCodeBlock.js';
import { UserActionRow } from './UserActionRow.js';
const { html, Directives: { ifDefined, ref } } = Lit;
const UIStrings = {
    /**
     * @description The error message when the user is not logged in into Chrome.
     */
    notLoggedIn: 'This feature is only available when you are signed into Chrome with your Google account',
    /**
     * @description Message shown when the user is offline.
     */
    offline: 'Check your internet connection and try again',
    /**
     * @description Text for a link to Chrome DevTools Settings.
     */
    settingsLink: 'AI assistance in Settings',
    /**
     *@description Text for asking the user to turn the AI assistance feature in settings first before they are able to use it.
     *@example {AI assistance in Settings} PH1
     */
    turnOnForStyles: 'Turn on {PH1} to get help with understanding CSS styles',
    /**
     *@description Text for asking the user to turn the AI assistance feature in settings first before they are able to use it.
     *@example {AI assistance in Settings} PH1
     */
    turnOnForStylesAndRequests: 'Turn on {PH1} to get help with styles and network requests',
    /**
     *@description Text for asking the user to turn the AI assistance feature in settings first before they are able to use it.
     *@example {AI assistance in Settings} PH1
     */
    turnOnForStylesRequestsAndFiles: 'Turn on {PH1} to get help with styles, network requests, and files',
    /**
     *@description Text for asking the user to turn the AI assistance feature in settings first before they are able to use it.
     *@example {AI assistance in Settings} PH1
     */
    turnOnForStylesRequestsPerformanceAndFiles: 'Turn on {PH1} to get help with styles, network requests, performance, and files',
    /**
     *@description The footer disclaimer that links to more information about the AI feature.
     */
    learnAbout: 'Learn about AI in DevTools',
    /**
     *@description Text informing the user that AI assistance is not available in Incognito mode or Guest mode.
     */
    notAvailableInIncognitoMode: 'AI assistance is not available in Incognito mode or Guest mode',
    /**
     *@description Label added to the text input to describe the context for screen readers. Not shown visibly on screen.
     */
    inputTextAriaDescription: 'You can also use one of the suggested prompts above to start your conversation',
    /**
     *@description Label added to the button that reveals the selected context item in DevTools
     */
    revealContextDescription: 'Reveal the selected context item in DevTools',
};
/*
* Strings that don't need to be translated at this time.
*/
const UIStringsNotTranslate = {
    /**
     *@description Title for the send icon button.
     */
    sendButtonTitle: 'Send',
    /**
     *@description Title for the start new chat
     */
    startNewChat: 'Start new chat',
    /**
     *@description Title for the cancel icon button.
     */
    cancelButtonTitle: 'Cancel',
    /**
     *@description Label for the "select an element" button.
     */
    selectAnElement: 'Select an element',
    /**
     *@description Label for the "select an element" button.
     */
    noElementSelected: 'No element selected',
    /**
     *@description Text for the empty state of the AI assistance panel.
     */
    emptyStateText: 'How can I help you?',
    /**
     * @description The error message when the request to the LLM failed for some reason.
     */
    systemError: 'Something unforeseen happened and I can no longer continue. Try your request again and see if that resolves the issue. If this keeps happening, update Chrome to the latest version.',
    /**
     * @description The error message when the LLM gets stuck in a loop (max steps reached).
     */
    maxStepsError: 'Seems like I am stuck with the investigation. It would be better if you start over.',
    /**
     *@description Displayed when the user stop the response
     */
    stoppedResponse: 'You stopped this response',
    /**
     * @description Prompt for user to confirm code execution that may affect the page.
     */
    sideEffectConfirmationDescription: 'This code may modify page content. Continue?',
    /**
     * @description Button text that confirm code execution that may affect the page.
     */
    positiveSideEffectConfirmation: 'Continue',
    /**
     * @description Button text that cancels code execution that may affect the page.
     */
    negativeSideEffectConfirmation: 'Cancel',
    /**
     *@description The generic name of the AI agent (do not translate)
     */
    ai: 'AI',
    /**
     *@description The fallback text when we can't find the user full name
     */
    you: 'You',
    /**
     *@description The fallback text when a step has no title yet
     */
    investigating: 'Investigating',
    /**
     *@description Prefix to the title of each thinking step of a user action is required to continue
     */
    paused: 'Paused',
    /**
     *@description Heading text for the code block that shows the executed code.
     */
    codeExecuted: 'Code executed',
    /**
     *@description Heading text for the code block that shows the code to be executed after side effect confirmation.
     */
    codeToExecute: 'Code to execute',
    /**
     *@description Heading text for the code block that shows the returned data.
     */
    dataReturned: 'Data returned',
    /**
     *@description Aria label for the check mark icon to be read by screen reader
     */
    completed: 'Completed',
    /**
     *@description Aria label for the cancel icon to be read by screen reader
     */
    canceled: 'Canceled',
    /**
     *@description Text displayed when the chat input is disabled due to reading past conversation.
     */
    pastConversation: 'You\'re viewing a past conversation.',
    /**
     *@description Title for the take screenshot button.
     */
    takeScreenshotButtonTitle: 'Take screenshot',
    /**
     *@description Title for the remove image input button.
     */
    removeImageInputButtonTitle: 'Remove image input',
    /**
     *@description Alt text for the image input (displayed in the chat messages) that has been sent to the model.
     */
    imageInputSentToTheModel: 'Image input sent to the model',
    /**
     *@description Alt text for the account avatar.
     */
    accountAvatar: 'Account avatar',
    /**
     *@description Title for the x-link which wraps the image input rendered in chat messages.
     */
    openImageInNewTab: 'Open image in a new tab',
    /**
     *@description Alt text for image when it is not available.
     */
    imageUnavailable: 'Image unavailable',
    /**
     *@description Title for the add image button.
     */
    addImageButtonTitle: 'Add image',
    /**
     *@description Disclaimer text right after the chat input.
     */
    inputDisclaimerForEmptyState: 'This is an experimental AI feature and won\'t always get it right.',
};
const str_ = i18n.i18n.registerUIStrings('panels/ai_assistance/components/ChatView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const lockedString = i18n.i18n.lockedString;
const SCROLL_ROUNDING_OFFSET = 1;
const TOOLTIP_POPOVER_OFFSET = 4;
const RELEVANT_DATA_LINK_ID = 'relevant-data-link';
export var ChatMessageEntity;
(function (ChatMessageEntity) {
    ChatMessageEntity["MODEL"] = "model";
    ChatMessageEntity["USER"] = "user";
})(ChatMessageEntity || (ChatMessageEntity = {}));
export var State;
(function (State) {
    State["CONSENT_VIEW"] = "consent-view";
    State["CHAT_VIEW"] = "chat-view";
    State["EXPLORE_VIEW"] = "explore-view";
})(State || (State = {}));
export class ChatView extends HTMLElement {
    constructor(props) {
        super();
        _ChatView_instances.add(this);
        _ChatView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ChatView_markdownRenderer.set(this, new MarkdownRendererWithCodeBlock());
        _ChatView_scrollTop.set(this, void 0);
        _ChatView_props.set(this, void 0);
        _ChatView_messagesContainerElement.set(this, void 0);
        _ChatView_mainElementRef.set(this, Lit.Directives.createRef());
        _ChatView_messagesContainerResizeObserver.set(this, new ResizeObserver(() => __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleMessagesContainerResize).call(this)));
        _ChatView_popoverHelper.set(this, null);
        /**
         * Indicates whether the chat scroll position should be pinned to the bottom.
         *
         * This is true when:
         *   - The scroll is at the very bottom, allowing new messages to push the scroll down automatically.
         *   - The panel is initially rendered and the user hasn't scrolled yet.
         *
         * It is set to false when the user scrolls up to view previous messages.
         */
        _ChatView_pinScrollToBottom.set(this, true);
        /**
         * Indicates whether the scroll event originated from code
         * or a user action. When set to `true`, `handleScroll` will ignore the event,
         * allowing it to only handle user-driven scrolls and correctly decide
         * whether to pin the content to the bottom.
         */
        _ChatView_isProgrammaticScroll.set(this, false);
        _ChatView_handleScroll.set(this, (ev) => {
            if (!ev.target || !(ev.target instanceof HTMLElement)) {
                return;
            }
            // Do not handle scroll events caused by programmatically
            // updating the scroll position. We want to know whether user
            // did scroll the container from the user interface.
            if (__classPrivateFieldGet(this, _ChatView_isProgrammaticScroll, "f")) {
                __classPrivateFieldSet(this, _ChatView_isProgrammaticScroll, false, "f");
                return;
            }
            __classPrivateFieldSet(this, _ChatView_scrollTop, ev.target.scrollTop, "f");
            __classPrivateFieldSet(this, _ChatView_pinScrollToBottom, ev.target.scrollTop + ev.target.clientHeight + SCROLL_ROUNDING_OFFSET > ev.target.scrollHeight, "f");
        });
        _ChatView_handleSubmit.set(this, (ev) => {
            ev.preventDefault();
            if (__classPrivateFieldGet(this, _ChatView_props, "f").imageInput?.isLoading) {
                return;
            }
            const textArea = __classPrivateFieldGet(this, _ChatView_shadow, "f").querySelector('.chat-input');
            if (!textArea?.value) {
                return;
            }
            const imageInput = !__classPrivateFieldGet(this, _ChatView_props, "f").imageInput?.isLoading && __classPrivateFieldGet(this, _ChatView_props, "f").imageInput?.data ?
                { inlineData: { data: __classPrivateFieldGet(this, _ChatView_props, "f").imageInput.data, mimeType: __classPrivateFieldGet(this, _ChatView_props, "f").imageInput.mimeType } } :
                undefined;
            void __classPrivateFieldGet(this, _ChatView_props, "f").onTextSubmit(textArea.value, imageInput, __classPrivateFieldGet(this, _ChatView_props, "f").imageInput?.inputType);
            textArea.value = '';
        });
        _ChatView_handleTextAreaKeyDown.set(this, (ev) => {
            if (!ev.target || !(ev.target instanceof HTMLTextAreaElement)) {
                return;
            }
            // Go to a new line only when Shift + Enter is pressed.
            if (ev.key === 'Enter' && !ev.shiftKey) {
                ev.preventDefault();
                if (!ev.target?.value || __classPrivateFieldGet(this, _ChatView_props, "f").imageInput?.isLoading) {
                    return;
                }
                const imageInput = !__classPrivateFieldGet(this, _ChatView_props, "f").imageInput?.isLoading && __classPrivateFieldGet(this, _ChatView_props, "f").imageInput?.data ?
                    { inlineData: { data: __classPrivateFieldGet(this, _ChatView_props, "f").imageInput.data, mimeType: __classPrivateFieldGet(this, _ChatView_props, "f").imageInput.mimeType } } :
                    undefined;
                void __classPrivateFieldGet(this, _ChatView_props, "f").onTextSubmit(ev.target.value, imageInput, __classPrivateFieldGet(this, _ChatView_props, "f").imageInput?.inputType);
                ev.target.value = '';
            }
        });
        _ChatView_handleCancel.set(this, (ev) => {
            ev.preventDefault();
            if (!__classPrivateFieldGet(this, _ChatView_props, "f").isLoading) {
                return;
            }
            __classPrivateFieldGet(this, _ChatView_props, "f").onCancelClick();
        });
        _ChatView_handleImageUpload.set(this, (ev) => {
            ev.stopPropagation();
            if (__classPrivateFieldGet(this, _ChatView_props, "f").onLoadImage) {
                const fileSelector = UI.UIUtils.createFileSelectorElement(__classPrivateFieldGet(this, _ChatView_props, "f").onLoadImage.bind(this), '.jpeg,.jpg,.png');
                fileSelector.click();
            }
        });
        _ChatView_handleSuggestionClick.set(this, (suggestion) => {
            __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_setInputText).call(this, suggestion);
            this.focusTextInput();
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.AiAssistanceDynamicSuggestionClicked);
        });
        __classPrivateFieldSet(this, _ChatView_props, props, "f");
    }
    set props(props) {
        __classPrivateFieldSet(this, _ChatView_markdownRenderer, new MarkdownRendererWithCodeBlock(), "f");
        __classPrivateFieldSet(this, _ChatView_props, props, "f");
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_render).call(this);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_render).call(this);
        if (__classPrivateFieldGet(this, _ChatView_messagesContainerElement, "f")) {
            __classPrivateFieldGet(this, _ChatView_messagesContainerResizeObserver, "f").observe(__classPrivateFieldGet(this, _ChatView_messagesContainerElement, "f"));
        }
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _ChatView_messagesContainerResizeObserver, "f").disconnect();
    }
    clearTextInput() {
        const textArea = __classPrivateFieldGet(this, _ChatView_shadow, "f").querySelector('.chat-input');
        if (!textArea) {
            return;
        }
        textArea.value = '';
    }
    focusTextInput() {
        const textArea = __classPrivateFieldGet(this, _ChatView_shadow, "f").querySelector('.chat-input');
        if (!textArea) {
            return;
        }
        textArea.focus();
    }
    restoreScrollPosition() {
        if (__classPrivateFieldGet(this, _ChatView_scrollTop, "f") === undefined) {
            return;
        }
        if (!__classPrivateFieldGet(this, _ChatView_mainElementRef, "f")?.value) {
            return;
        }
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_setMainElementScrollTop).call(this, __classPrivateFieldGet(this, _ChatView_scrollTop, "f"));
    }
    scrollToBottom() {
        if (!__classPrivateFieldGet(this, _ChatView_mainElementRef, "f")?.value) {
            return;
        }
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_setMainElementScrollTop).call(this, __classPrivateFieldGet(this, _ChatView_mainElementRef, "f").value.scrollHeight);
    }
}
_ChatView_shadow = new WeakMap(), _ChatView_markdownRenderer = new WeakMap(), _ChatView_scrollTop = new WeakMap(), _ChatView_props = new WeakMap(), _ChatView_messagesContainerElement = new WeakMap(), _ChatView_mainElementRef = new WeakMap(), _ChatView_messagesContainerResizeObserver = new WeakMap(), _ChatView_popoverHelper = new WeakMap(), _ChatView_pinScrollToBottom = new WeakMap(), _ChatView_isProgrammaticScroll = new WeakMap(), _ChatView_handleScroll = new WeakMap(), _ChatView_handleSubmit = new WeakMap(), _ChatView_handleTextAreaKeyDown = new WeakMap(), _ChatView_handleCancel = new WeakMap(), _ChatView_handleImageUpload = new WeakMap(), _ChatView_handleSuggestionClick = new WeakMap(), _ChatView_instances = new WeakSet(), _ChatView_handleChatUiRef = function _ChatView_handleChatUiRef(el) {
    if (!el || __classPrivateFieldGet(this, _ChatView_popoverHelper, "f")) {
        return;
    }
    // TODO: Update here when b/409965560 is fixed.
    __classPrivateFieldSet(this, _ChatView_popoverHelper, new UI.PopoverHelper.PopoverHelper(el, event => {
        const popoverShownNode = event.target instanceof HTMLElement && event.target.id === RELEVANT_DATA_LINK_ID ? event.target : null;
        if (!popoverShownNode) {
            return null;
        }
        // We move the glass pane to be a bit lower so
        // that it does not disappear when moving the cursor
        // over to link.
        const nodeBox = popoverShownNode.boxInWindow();
        nodeBox.y = nodeBox.y + TOOLTIP_POPOVER_OFFSET;
        return {
            box: nodeBox,
            show: async (popover) => {
                // clang-format off
                Lit.render(html `
            <style>
              .info-tooltip-container {
                max-width: var(--sys-size-28);
                padding: var(--sys-size-4) var(--sys-size-5);

                .tooltip-link {
                  display: block;
                  margin-top: var(--sys-size-4);
                  color: var(--sys-color-primary);
                  padding-left: 0;
                }
              }
            </style>
            <div class="info-tooltip-container">
              ${__classPrivateFieldGet(this, _ChatView_props, "f").disclaimerText}
              <button
                class="link tooltip-link"
                role="link"
                jslog=${VisualLogging.link('open-ai-settings').track({
                    click: true,
                })}
                @click=${() => {
                    void UI.ViewManager.ViewManager.instance().showView('chrome-ai');
                }}
              >${i18nString(UIStrings.learnAbout)}</button>
            </div>`, popover.contentElement, { host: this });
                // clang-format on
                return true;
            },
        };
    }), "f");
    __classPrivateFieldGet(this, _ChatView_popoverHelper, "f").setTimeout(0);
}, _ChatView_handleMessagesContainerResize = function _ChatView_handleMessagesContainerResize() {
    if (!__classPrivateFieldGet(this, _ChatView_pinScrollToBottom, "f")) {
        return;
    }
    if (!__classPrivateFieldGet(this, _ChatView_mainElementRef, "f")?.value) {
        return;
    }
    if (__classPrivateFieldGet(this, _ChatView_pinScrollToBottom, "f")) {
        __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_setMainElementScrollTop).call(this, __classPrivateFieldGet(this, _ChatView_mainElementRef, "f").value.scrollHeight);
    }
}, _ChatView_setMainElementScrollTop = function _ChatView_setMainElementScrollTop(scrollTop) {
    if (!__classPrivateFieldGet(this, _ChatView_mainElementRef, "f")?.value) {
        return;
    }
    __classPrivateFieldSet(this, _ChatView_scrollTop, scrollTop, "f");
    __classPrivateFieldSet(this, _ChatView_isProgrammaticScroll, true, "f");
    __classPrivateFieldGet(this, _ChatView_mainElementRef, "f").value.scrollTop = scrollTop;
}, _ChatView_setInputText = function _ChatView_setInputText(text) {
    const textArea = __classPrivateFieldGet(this, _ChatView_shadow, "f").querySelector('.chat-input');
    if (!textArea) {
        return;
    }
    textArea.value = text;
    __classPrivateFieldGet(this, _ChatView_props, "f").onTextInputChange(text);
}, _ChatView_handleMessageContainerRef = function _ChatView_handleMessageContainerRef(el) {
    __classPrivateFieldSet(this, _ChatView_messagesContainerElement, el, "f");
    if (el) {
        __classPrivateFieldGet(this, _ChatView_messagesContainerResizeObserver, "f").observe(el);
    }
    else {
        __classPrivateFieldSet(this, _ChatView_pinScrollToBottom, true, "f");
        __classPrivateFieldGet(this, _ChatView_messagesContainerResizeObserver, "f").disconnect();
    }
}, _ChatView_render = function _ChatView_render() {
    const renderFooter = () => {
        const classes = Lit.Directives.classMap({
            'chat-view-footer': true,
            'has-conversation': !!__classPrivateFieldGet(this, _ChatView_props, "f").conversationType,
            'is-read-only': __classPrivateFieldGet(this, _ChatView_props, "f").isReadOnly,
        });
        // clang-format off
        const footerContents = __classPrivateFieldGet(this, _ChatView_props, "f").conversationType
            ? renderRelevantDataDisclaimer({
                isLoading: __classPrivateFieldGet(this, _ChatView_props, "f").isLoading,
                blockedByCrossOrigin: __classPrivateFieldGet(this, _ChatView_props, "f").blockedByCrossOrigin,
            })
            : html `<p>
            ${lockedString(UIStringsNotTranslate.inputDisclaimerForEmptyState)}
            <button
              class="link"
              role="link"
              jslog=${VisualLogging.link('open-ai-settings').track({
                click: true,
            })}
              @click=${() => {
                void UI.ViewManager.ViewManager.instance().showView('chrome-ai');
            }}
            >${i18nString(UIStrings.learnAbout)}</button>
          </p>`;
        return html `
        <footer class=${classes} jslog=${VisualLogging.section('footer')}>
          ${footerContents}
        </footer>
      `;
    };
    // clang-format off
    Lit.render(html `
      <style>${chatViewStyles}</style>
      <div class="chat-ui" ${Lit.Directives.ref(__classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleChatUiRef))}>
        <main @scroll=${__classPrivateFieldGet(this, _ChatView_handleScroll, "f")} ${ref(__classPrivateFieldGet(this, _ChatView_mainElementRef, "f"))}>
          ${renderMainContents({
        state: __classPrivateFieldGet(this, _ChatView_props, "f").state,
        aidaAvailability: __classPrivateFieldGet(this, _ChatView_props, "f").aidaAvailability,
        messages: __classPrivateFieldGet(this, _ChatView_props, "f").messages,
        isLoading: __classPrivateFieldGet(this, _ChatView_props, "f").isLoading,
        isReadOnly: __classPrivateFieldGet(this, _ChatView_props, "f").isReadOnly,
        canShowFeedbackForm: __classPrivateFieldGet(this, _ChatView_props, "f").canShowFeedbackForm,
        isTextInputDisabled: __classPrivateFieldGet(this, _ChatView_props, "f").isTextInputDisabled,
        suggestions: __classPrivateFieldGet(this, _ChatView_props, "f").emptyStateSuggestions,
        userInfo: __classPrivateFieldGet(this, _ChatView_props, "f").userInfo,
        markdownRenderer: __classPrivateFieldGet(this, _ChatView_markdownRenderer, "f"),
        conversationType: __classPrivateFieldGet(this, _ChatView_props, "f").conversationType,
        changeSummary: __classPrivateFieldGet(this, _ChatView_props, "f").changeSummary,
        changeManager: __classPrivateFieldGet(this, _ChatView_props, "f").changeManager,
        onSuggestionClick: __classPrivateFieldGet(this, _ChatView_handleSuggestionClick, "f"),
        onFeedbackSubmit: __classPrivateFieldGet(this, _ChatView_props, "f").onFeedbackSubmit,
        onMessageContainerRef: __classPrivateFieldGet(this, _ChatView_instances, "m", _ChatView_handleMessageContainerRef),
    })}
          ${__classPrivateFieldGet(this, _ChatView_props, "f").isReadOnly
        ? renderReadOnlySection({
            conversationType: __classPrivateFieldGet(this, _ChatView_props, "f").conversationType,
            onNewConversation: __classPrivateFieldGet(this, _ChatView_props, "f").onNewConversation,
        })
        : renderChatInput({
            isLoading: __classPrivateFieldGet(this, _ChatView_props, "f").isLoading,
            blockedByCrossOrigin: __classPrivateFieldGet(this, _ChatView_props, "f").blockedByCrossOrigin,
            isTextInputDisabled: __classPrivateFieldGet(this, _ChatView_props, "f").isTextInputDisabled,
            inputPlaceholder: __classPrivateFieldGet(this, _ChatView_props, "f").inputPlaceholder,
            state: __classPrivateFieldGet(this, _ChatView_props, "f").state,
            selectedContext: __classPrivateFieldGet(this, _ChatView_props, "f").selectedContext,
            inspectElementToggled: __classPrivateFieldGet(this, _ChatView_props, "f").inspectElementToggled,
            multimodalInputEnabled: __classPrivateFieldGet(this, _ChatView_props, "f").multimodalInputEnabled,
            conversationType: __classPrivateFieldGet(this, _ChatView_props, "f").conversationType,
            imageInput: __classPrivateFieldGet(this, _ChatView_props, "f").imageInput,
            isTextInputEmpty: __classPrivateFieldGet(this, _ChatView_props, "f").isTextInputEmpty,
            aidaAvailability: __classPrivateFieldGet(this, _ChatView_props, "f").aidaAvailability,
            uploadImageInputEnabled: __classPrivateFieldGet(this, _ChatView_props, "f").uploadImageInputEnabled,
            onContextClick: __classPrivateFieldGet(this, _ChatView_props, "f").onContextClick,
            onInspectElementClick: __classPrivateFieldGet(this, _ChatView_props, "f").onInspectElementClick,
            onSubmit: __classPrivateFieldGet(this, _ChatView_handleSubmit, "f"),
            onTextAreaKeyDown: __classPrivateFieldGet(this, _ChatView_handleTextAreaKeyDown, "f"),
            onCancel: __classPrivateFieldGet(this, _ChatView_handleCancel, "f"),
            onNewConversation: __classPrivateFieldGet(this, _ChatView_props, "f").onNewConversation,
            onTakeScreenshot: __classPrivateFieldGet(this, _ChatView_props, "f").onTakeScreenshot,
            onRemoveImageInput: __classPrivateFieldGet(this, _ChatView_props, "f").onRemoveImageInput,
            onTextInputChange: __classPrivateFieldGet(this, _ChatView_props, "f").onTextInputChange,
            onImageUpload: __classPrivateFieldGet(this, _ChatView_handleImageUpload, "f"),
        })}
        </main>
       ${renderFooter()}
      </div>
    `, __classPrivateFieldGet(this, _ChatView_shadow, "f"), { host: this });
    // clang-format on
};
function renderTextAsMarkdown(text, markdownRenderer, { animate, ref: refFn } = {}) {
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
    // clang-format off
    return html `<devtools-markdown-view
    .data=${{ tokens, renderer: markdownRenderer, animationEnabled: animate }}
    ${refFn ? ref(refFn) : Lit.nothing}>
  </devtools-markdown-view>`;
    // clang-format on
}
function renderTitle(step) {
    const paused = step.sideEffect ? html `<span class="paused">${lockedString(UIStringsNotTranslate.paused)}: </span>` : Lit.nothing;
    const actionTitle = step.title ?? `${lockedString(UIStringsNotTranslate.investigating)}…`;
    return html `<span class="title">${paused}${actionTitle}</span>`;
}
function renderStepCode(step) {
    if (!step.code && !step.output) {
        return Lit.nothing;
    }
    // If there is no "output" yet, it means we didn't execute the code yet (e.g. maybe it is still waiting for confirmation from the user)
    // thus we show "Code to execute" text rather than "Code executed" text on the heading of the code block.
    const codeHeadingText = (step.output && !step.canceled) ? lockedString(UIStringsNotTranslate.codeExecuted) :
        lockedString(UIStringsNotTranslate.codeToExecute);
    // If there is output, we don't show notice on this code block and instead show
    // it in the data returned code block.
    // clang-format off
    const code = step.code ? html `<div class="action-result">
      <devtools-code-block
        .code=${step.code.trim()}
        .codeLang=${'js'}
        .displayNotice=${!Boolean(step.output)}
        .header=${codeHeadingText}
        .showCopyButton=${true}
      ></devtools-code-block>
  </div>` :
        Lit.nothing;
    const output = step.output ? html `<div class="js-code-output">
    <devtools-code-block
      .code=${step.output}
      .codeLang=${'js'}
      .displayNotice=${true}
      .header=${lockedString(UIStringsNotTranslate.dataReturned)}
      .showCopyButton=${false}
    ></devtools-code-block>
  </div>` :
        Lit.nothing;
    return html `<div class="step-code">${code}${output}</div>`;
    // clang-format on
}
function renderStepDetails({ step, markdownRenderer, isLast, }) {
    const sideEffects = isLast && step.sideEffect ? renderSideEffectConfirmationUi(step) : Lit.nothing;
    const thought = step.thought ? html `<p>${renderTextAsMarkdown(step.thought, markdownRenderer)}</p>` : Lit.nothing;
    // clang-format off
    const contextDetails = step.contextDetails ?
        html `${Lit.Directives.repeat(step.contextDetails, contextDetail => {
            return html `<div class="context-details">
      <devtools-code-block
        .code=${contextDetail.text}
        .codeLang=${contextDetail.codeLang || ''}
        .displayNotice=${false}
        .header=${contextDetail.title}
        .showCopyButton=${true}
      ></devtools-code-block>
    </div>`;
        })}` : Lit.nothing;
    return html `<div class="step-details">
    ${thought}
    ${renderStepCode(step)}
    ${sideEffects}
    ${contextDetails}
  </div>`;
    // clang-format on
}
function renderStepBadge({ step, isLoading, isLast }) {
    if (isLoading && isLast && !step.sideEffect) {
        return html `<devtools-spinner></devtools-spinner>`;
    }
    let iconName = 'checkmark';
    let ariaLabel = lockedString(UIStringsNotTranslate.completed);
    let role = 'button';
    if (isLast && step.sideEffect) {
        role = undefined;
        ariaLabel = undefined;
        iconName = 'pause-circle';
    }
    else if (step.canceled) {
        ariaLabel = lockedString(UIStringsNotTranslate.canceled);
        iconName = 'cross';
    }
    return html `<devtools-icon
      class="indicator"
      role=${ifDefined(role)}
      aria-label=${ifDefined(ariaLabel)}
      .name=${iconName}
    ></devtools-icon>`;
}
function renderStep({ step, isLoading, markdownRenderer, isLast }) {
    const stepClasses = Lit.Directives.classMap({
        step: true,
        empty: !step.thought && !step.code && !step.contextDetails,
        paused: Boolean(step.sideEffect),
        canceled: Boolean(step.canceled),
    });
    // clang-format off
    return html `
    <details class=${stepClasses}
      jslog=${VisualLogging.section('step')}
      .open=${Boolean(step.sideEffect)}>
      <summary>
        <div class="summary">
          ${renderStepBadge({ step, isLoading, isLast })}
          ${renderTitle(step)}
          <devtools-icon
            class="arrow"
            .name=${'chevron-down'}
          ></devtools-icon>
        </div>
      </summary>
      ${renderStepDetails({ step, markdownRenderer, isLast })}
    </details>`;
    // clang-format on
}
function renderSideEffectConfirmationUi(step) {
    if (!step.sideEffect) {
        return Lit.nothing;
    }
    // clang-format off
    return html `<div
    class="side-effect-confirmation"
    jslog=${VisualLogging.section('side-effect-confirmation')}
  >
    <p>${lockedString(UIStringsNotTranslate.sideEffectConfirmationDescription)}</p>
    <div class="side-effect-buttons-container">
      <devtools-button
        .data=${{
        variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
        jslogContext: 'decline-execute-code',
    }}
        @click=${() => step.sideEffect?.onAnswer(false)}
      >${lockedString(UIStringsNotTranslate.negativeSideEffectConfirmation)}</devtools-button>
      <devtools-button
        .data=${{
        variant: "primary" /* Buttons.Button.Variant.PRIMARY */,
        jslogContext: 'accept-execute-code',
        iconName: 'play',
    }}
        @click=${() => step.sideEffect?.onAnswer(true)}
      >${lockedString(UIStringsNotTranslate.positiveSideEffectConfirmation)}</devtools-button>
    </div>
  </div>`;
    // clang-format on
}
function renderError(message) {
    if (message.error) {
        let errorMessage;
        switch (message.error) {
            case "unknown" /* AiAssistanceModel.ErrorType.UNKNOWN */:
            case "block" /* AiAssistanceModel.ErrorType.BLOCK */:
                errorMessage = UIStringsNotTranslate.systemError;
                break;
            case "max-steps" /* AiAssistanceModel.ErrorType.MAX_STEPS */:
                errorMessage = UIStringsNotTranslate.maxStepsError;
                break;
            case "abort" /* AiAssistanceModel.ErrorType.ABORT */:
                return html `<p class="aborted" jslog=${VisualLogging.section('aborted')}>${lockedString(UIStringsNotTranslate.stoppedResponse)}</p>`;
        }
        return html `<p class="error" jslog=${VisualLogging.section('error')}>${lockedString(errorMessage)}</p>`;
    }
    return Lit.nothing;
}
function renderChatMessage({ message, isLoading, isReadOnly, canShowFeedbackForm, isLast, userInfo, markdownRenderer, onSuggestionClick, onFeedbackSubmit, }) {
    if (message.entity === "user" /* ChatMessageEntity.USER */) {
        const name = userInfo.accountFullName || lockedString(UIStringsNotTranslate.you);
        const image = userInfo.accountImage ?
            html `<img src="data:image/png;base64, ${userInfo.accountImage}" alt=${UIStringsNotTranslate.accountAvatar} />` :
            html `<devtools-icon
          .name=${'profile'}
        ></devtools-icon>`;
        const imageInput = message.imageInput && 'inlineData' in message.imageInput ?
            renderImageChatMessage(message.imageInput.inlineData) :
            Lit.nothing;
        // clang-format off
        return html `<section
      class="chat-message query"
      jslog=${VisualLogging.section('question')}
    >
      <div class="message-info">
        ${image}
        <div class="message-name">
          <h2>${name}</h2>
        </div>
      </div>
      ${imageInput}
      <div class="message-content">${renderTextAsMarkdown(message.text, markdownRenderer)}</div>
    </section>`;
        // clang-format on
    }
    // clang-format off
    return html `
    <section
      class="chat-message answer"
      jslog=${VisualLogging.section('answer')}
    >
      <div class="message-info">
        <devtools-icon name="smart-assistant"></devtools-icon>
        <div class="message-name">
          <h2>${lockedString(UIStringsNotTranslate.ai)}</h2>
        </div>
      </div>
      ${Lit.Directives.repeat(message.steps, (_, index) => index, step => {
        return renderStep({
            step,
            isLoading,
            markdownRenderer,
            isLast: [...message.steps.values()].at(-1) === step && isLast,
        });
    })}
      ${message.answer
        ? html `<p>${renderTextAsMarkdown(message.answer, markdownRenderer, { animate: !isReadOnly && isLoading && isLast })}</p>`
        : Lit.nothing}
      ${renderError(message)}
      ${isLast && isLoading
        ? Lit.nothing
        : html `<devtools-widget class="actions" .widgetConfig=${UI.Widget.widgetConfig(UserActionRow, {
            showRateButtons: message.rpcId !== undefined,
            onFeedbackSubmit: (rating, feedback) => {
                if (!message.rpcId) {
                    return;
                }
                onFeedbackSubmit(message.rpcId, rating, feedback);
            },
            suggestions: (isLast && !isReadOnly) ? message.suggestions : undefined,
            onSuggestionClick,
            canShowFeedbackForm,
        })}></devtools-widget>`}
    </section>
  `;
    // clang-format on
}
function renderImageChatMessage(inlineData) {
    if (inlineData.data === AiAssistanceModel.NOT_FOUND_IMAGE_DATA) {
        // clang-format off
        return html `<div class="unavailable-image" title=${UIStringsNotTranslate.imageUnavailable}>
      <devtools-icon name='file-image'></devtools-icon>
    </div>`;
        // clang-format on
    }
    const imageUrl = `data:${inlineData.mimeType};base64,${inlineData.data}`;
    // clang-format off
    return html `<x-link
      class="image-link" title=${UIStringsNotTranslate.openImageInNewTab}
      href=${imageUrl}
    >
      <img src=${imageUrl} alt=${UIStringsNotTranslate.imageInputSentToTheModel} />
    </x-link>`;
    // clang-format on
}
function renderSelection({ selectedContext, inspectElementToggled, conversationType, isTextInputDisabled, onContextClick, onInspectElementClick, }) {
    if (!conversationType) {
        return Lit.nothing;
    }
    // TODO: currently the picker behavior is SDKNode specific.
    const hasPickerBehavior = conversationType === "freestyler" /* AiAssistanceModel.ConversationType.STYLING */;
    const resourceClass = Lit.Directives.classMap({
        'not-selected': !selectedContext,
        'resource-link': true,
        'has-picker-behavior': hasPickerBehavior,
        disabled: isTextInputDisabled,
    });
    if (!selectedContext && !hasPickerBehavior) {
        return Lit.nothing;
    }
    const handleKeyDown = (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
            void onContextClick();
        }
    };
    // clang-format off
    return html `<div class="select-element">
    ${hasPickerBehavior ? html `
        <devtools-button
          .data=${{
        variant: "icon_toggle" /* Buttons.Button.Variant.ICON_TOGGLE */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        iconName: 'select-element',
        toggledIconName: 'select-element',
        toggleType: "primary-toggle" /* Buttons.Button.ToggleType.PRIMARY */,
        toggled: inspectElementToggled,
        title: lockedString(UIStringsNotTranslate.selectAnElement),
        jslogContext: 'select-element',
        disabled: isTextInputDisabled,
    }}
          @click=${onInspectElementClick}
        ></devtools-button>
      ` : Lit.nothing}
    <div
      role=button
      class=${resourceClass}
      tabindex=${(hasPickerBehavior || isTextInputDisabled) ? '-1' : '0'}
      @click=${onContextClick}
      @keydown=${handleKeyDown}
      aria-description=${i18nString(UIStrings.revealContextDescription)}
    >
      ${selectedContext?.getIcon() ? html `${selectedContext?.getIcon()}` : Lit.nothing}
      <span class="title">${selectedContext?.getTitle({ disabled: isTextInputDisabled }) ?? lockedString(UIStringsNotTranslate.noElementSelected)}</span>
    </div>
  </div>`;
    // clang-format on
}
function renderMessages({ messages, isLoading, isReadOnly, canShowFeedbackForm, userInfo, markdownRenderer, changeSummary, changeManager, onSuggestionClick, onFeedbackSubmit, onMessageContainerRef, }) {
    function renderPatchWidget() {
        if (isLoading) {
            return Lit.nothing;
        }
        // clang-format off
        return html `<devtools-widget
      .widgetConfig=${UI.Widget.widgetConfig(PatchWidget, {
            changeSummary: changeSummary ?? '',
            changeManager,
        })}
    ></devtools-widget>`;
        // clang-format on
    }
    // clang-format off
    return html `
    <div class="messages-container" ${ref(onMessageContainerRef)}>
      ${messages.map((message, _, array) => renderChatMessage({
        message,
        isLoading,
        isReadOnly,
        canShowFeedbackForm,
        isLast: array.at(-1) === message,
        userInfo,
        markdownRenderer,
        onSuggestionClick,
        onFeedbackSubmit,
    }))}
      ${renderPatchWidget()}
    </div>
  `;
    // clang-format on
}
function renderEmptyState({ isTextInputDisabled, suggestions, onSuggestionClick }) {
    // clang-format off
    return html `<div class="empty-state-container">
    <div class="header">
      <div class="icon">
        <devtools-icon
          name="smart-assistant"
        ></devtools-icon>
      </div>
      <h1>${lockedString(UIStringsNotTranslate.emptyStateText)}</h1>
    </div>
    <div class="empty-state-content">
      ${suggestions.map(({ title, jslogContext }) => {
        return html `<devtools-button
          class="suggestion"
          @click=${() => onSuggestionClick(title)}
          .data=${{
            variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
            size: "REGULAR" /* Buttons.Button.Size.REGULAR */,
            title,
            jslogContext: jslogContext ?? 'suggestion',
            disabled: isTextInputDisabled,
        }}
        >${title}</devtools-button>`;
    })}
    </div>
  </div>`;
    // clang-format on
}
function renderReadOnlySection({ onNewConversation, conversationType }) {
    if (!conversationType) {
        return Lit.nothing;
    }
    // clang-format off
    return html `<div
    class="chat-readonly-container"
    jslog=${VisualLogging.section('read-only')}
  >
    <span>${lockedString(UIStringsNotTranslate.pastConversation)}</span>
    <devtools-button
      aria-label=${lockedString(UIStringsNotTranslate.startNewChat)}
      class="chat-inline-button"
      @click=${onNewConversation}
      .data=${{
        variant: "text" /* Buttons.Button.Variant.TEXT */,
        title: lockedString(UIStringsNotTranslate.startNewChat),
        jslogContext: 'start-new-chat',
    }}
    >${lockedString(UIStringsNotTranslate.startNewChat)}</devtools-button>
  </div>`;
    // clang-format on
}
function renderChatInputButtons({ isLoading, blockedByCrossOrigin, isTextInputDisabled, isTextInputEmpty, imageInput, onCancel, onNewConversation }) {
    if (isLoading) {
        // clang-format off
        return html `<devtools-button
      class="chat-input-button"
      aria-label=${lockedString(UIStringsNotTranslate.cancelButtonTitle)}
      @click=${onCancel}
      .data=${{
            variant: "icon" /* Buttons.Button.Variant.ICON */,
            size: "REGULAR" /* Buttons.Button.Size.REGULAR */,
            iconName: 'record-stop',
            title: lockedString(UIStringsNotTranslate.cancelButtonTitle),
            jslogContext: 'stop',
        }}
    ></devtools-button>`;
        // clang-format on
    }
    if (blockedByCrossOrigin) {
        // clang-format off
        return html `
      <devtools-button
        class="start-new-chat-button"
        aria-label=${lockedString(UIStringsNotTranslate.startNewChat)}
        @click=${onNewConversation}
        .data=${{
            variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
            size: "SMALL" /* Buttons.Button.Size.SMALL */,
            title: lockedString(UIStringsNotTranslate.startNewChat),
            jslogContext: 'start-new-chat',
        }}
      >${lockedString(UIStringsNotTranslate.startNewChat)}</devtools-button>
    `;
        // clang-format on
    }
    // clang-format off
    return html `<devtools-button
    class="chat-input-button"
    aria-label=${lockedString(UIStringsNotTranslate.sendButtonTitle)}
    .data=${{
        type: 'submit',
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "REGULAR" /* Buttons.Button.Size.REGULAR */,
        disabled: isTextInputDisabled || isTextInputEmpty || imageInput?.isLoading,
        iconName: 'send',
        title: lockedString(UIStringsNotTranslate.sendButtonTitle),
        jslogContext: 'send',
    }}
  ></devtools-button>`;
}
function renderMultimodalInputButtons({ multimodalInputEnabled, blockedByCrossOrigin, isTextInputDisabled, imageInput, uploadImageInputEnabled, onTakeScreenshot, onImageUpload, }) {
    if (!multimodalInputEnabled || blockedByCrossOrigin) {
        return Lit.nothing;
    }
    // clang-format off
    const addImageButton = uploadImageInputEnabled ? html `<devtools-button
    class="chat-input-button"
    aria-label=${lockedString(UIStringsNotTranslate.addImageButtonTitle)}
    @click=${onImageUpload}
    .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "REGULAR" /* Buttons.Button.Size.REGULAR */,
        disabled: isTextInputDisabled || imageInput?.isLoading,
        iconName: 'add-photo',
        title: lockedString(UIStringsNotTranslate.addImageButtonTitle),
        jslogContext: 'upload-image',
    }}
  ></devtools-button>` : Lit.nothing;
    return html `${addImageButton}<devtools-button
    class="chat-input-button"
    aria-label=${lockedString(UIStringsNotTranslate.takeScreenshotButtonTitle)}
    @click=${onTakeScreenshot}
    .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "REGULAR" /* Buttons.Button.Size.REGULAR */,
        disabled: isTextInputDisabled || imageInput?.isLoading,
        iconName: 'photo-camera',
        title: lockedString(UIStringsNotTranslate.takeScreenshotButtonTitle),
        jslogContext: 'take-screenshot',
    }}
  ></devtools-button>`;
    // clang-format on
}
function renderImageInput({ multimodalInputEnabled, imageInput, isTextInputDisabled, onRemoveImageInput, }) {
    if (!multimodalInputEnabled || !imageInput || isTextInputDisabled) {
        return Lit.nothing;
    }
    // clang-format off
    const crossButton = html `<devtools-button
      aria-label=${lockedString(UIStringsNotTranslate.removeImageInputButtonTitle)}
      @click=${onRemoveImageInput}
      .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "MICRO" /* Buttons.Button.Size.MICRO */,
        iconName: 'cross',
        title: lockedString(UIStringsNotTranslate.removeImageInputButtonTitle),
    }}
    ></devtools-button>`;
    // clang-format on
    if (imageInput.isLoading) {
        // clang-format off
        return html `<div class="image-input-container">
        ${crossButton}
        <div class="loading">
          <devtools-spinner></devtools-spinner>
        </div>
      </div>`;
        // clang-format on
    }
    // clang-format off
    return html `
    <div class="image-input-container">
      ${crossButton}
      <img src="data:${imageInput.mimeType};base64, ${imageInput.data}" alt="Image input" />
    </div>`;
    // clang-format on
}
function renderRelevantDataDisclaimer({ isLoading, blockedByCrossOrigin }) {
    const classes = Lit.Directives.classMap({ 'chat-input-disclaimer': true, 'hide-divider': !isLoading && blockedByCrossOrigin });
    // clang-format off
    return html `
    <p class=${classes}>
      <button
        class="link"
        role="link"
        id=${RELEVANT_DATA_LINK_ID}
        jslog=${VisualLogging.link('open-ai-settings').track({
        click: true,
    })}
        @click=${() => {
        void UI.ViewManager.ViewManager.instance().showView('chrome-ai');
    }}
      >${lockedString('Relevant data')}</button>&nbsp;${lockedString('is sent to Google')}
    </p>
  `;
    // clang-format on
}
function renderChatInput({ isLoading, blockedByCrossOrigin, isTextInputDisabled, inputPlaceholder, state, selectedContext, inspectElementToggled, multimodalInputEnabled, conversationType, imageInput, isTextInputEmpty, uploadImageInputEnabled, aidaAvailability, onContextClick, onInspectElementClick, onSubmit, onTextAreaKeyDown, onCancel, onNewConversation, onTakeScreenshot, onRemoveImageInput, onTextInputChange, onImageUpload, }) {
    if (!conversationType) {
        return Lit.nothing;
    }
    const shouldShowMultiLine = state !== "consent-view" /* State.CONSENT_VIEW */ &&
        aidaAvailability === "available" /* Host.AidaClient.AidaAccessPreconditions.AVAILABLE */ && selectedContext;
    const chatInputContainerCls = Lit.Directives.classMap({
        'chat-input-container': true,
        'single-line-layout': !shouldShowMultiLine,
        disabled: isTextInputDisabled,
    });
    // clang-format off
    return html `
  <form class="input-form" @submit=${onSubmit}>
    <div class=${chatInputContainerCls}>
      ${renderImageInput({ multimodalInputEnabled, imageInput, isTextInputDisabled, onRemoveImageInput })}
      <textarea class="chat-input"
        .disabled=${isTextInputDisabled}
        wrap="hard"
        maxlength="10000"
        @keydown=${onTextAreaKeyDown}
        @input=${(event) => onTextInputChange(event.target.value)}
        placeholder=${inputPlaceholder}
        jslog=${VisualLogging.textField('query').track({ keydown: 'Enter' })}
        aria-description=${i18nString(UIStrings.inputTextAriaDescription)}
      ></textarea>
      <div class="chat-input-actions">
        <div class="chat-input-actions-left">
          ${shouldShowMultiLine ? renderSelection({
        selectedContext,
        inspectElementToggled,
        conversationType,
        isTextInputDisabled,
        onContextClick,
        onInspectElementClick,
    }) : Lit.nothing}
        </div>
        <div class="chat-input-actions-right">
          <div class="chat-input-disclaimer-container">
            ${renderRelevantDataDisclaimer({ isLoading, blockedByCrossOrigin })}
          </div>
          ${renderMultimodalInputButtons({
        multimodalInputEnabled, blockedByCrossOrigin, isTextInputDisabled, imageInput, uploadImageInputEnabled, onTakeScreenshot, onImageUpload
    })}
          ${renderChatInputButtons({
        isLoading, blockedByCrossOrigin, isTextInputDisabled, isTextInputEmpty, imageInput, onCancel, onNewConversation
    })}
        </div>
      </div>
    </div>
  </form>`;
    // clang-format on
}
function renderAidaUnavailableContents(aidaAvailability) {
    switch (aidaAvailability) {
        case "no-account-email" /* Host.AidaClient.AidaAccessPreconditions.NO_ACCOUNT_EMAIL */:
        case "sync-is-paused" /* Host.AidaClient.AidaAccessPreconditions.SYNC_IS_PAUSED */: {
            return html `${i18nString(UIStrings.notLoggedIn)}`;
        }
        case "no-internet" /* Host.AidaClient.AidaAccessPreconditions.NO_INTERNET */: {
            return html `${i18nString(UIStrings.offline)}`;
        }
    }
}
function renderConsentViewContents() {
    const settingsLink = document.createElement('button');
    settingsLink.textContent = i18nString(UIStrings.settingsLink);
    settingsLink.classList.add('link');
    UI.ARIAUtils.markAsLink(settingsLink);
    settingsLink.addEventListener('click', () => {
        void UI.ViewManager.ViewManager.instance().showView('chrome-ai');
    });
    settingsLink.setAttribute('jslog', `${VisualLogging.action('open-ai-settings').track({ click: true })}`);
    let consentViewContents;
    // TODO(ergunsh): Should this `view` access `hostConfig` at all?
    const config = Root.Runtime.hostConfig;
    if (config.isOffTheRecord) {
        return html `${i18nString(UIStrings.notAvailableInIncognitoMode)}`;
    }
    if (config.devToolsAiAssistancePerformanceAgent?.enabled) {
        consentViewContents = i18n.i18n.getFormatLocalizedString(str_, UIStrings.turnOnForStylesRequestsPerformanceAndFiles, { PH1: settingsLink });
    }
    else if (config.devToolsAiAssistanceFileAgent?.enabled) {
        consentViewContents =
            i18n.i18n.getFormatLocalizedString(str_, UIStrings.turnOnForStylesRequestsAndFiles, { PH1: settingsLink });
    }
    else if (config.devToolsAiAssistanceNetworkAgent?.enabled) {
        consentViewContents =
            i18n.i18n.getFormatLocalizedString(str_, UIStrings.turnOnForStylesAndRequests, { PH1: settingsLink });
    }
    else {
        consentViewContents = i18n.i18n.getFormatLocalizedString(str_, UIStrings.turnOnForStyles, { PH1: settingsLink });
    }
    return html `${consentViewContents}`;
}
function renderDisabledState(contents) {
    // clang-format off
    return html `
    <div class="empty-state-container">
      <div class="disabled-view">
        <div class="disabled-view-icon-container">
          <devtools-icon
            .name=${'smart-assistant'}
          ></devtools-icon>
        </div>
        <div>
          ${contents}
        </div>
      </div>
    </div>
  `;
    // clang-format on
}
function renderMainContents({ state, aidaAvailability, messages, isLoading, isReadOnly, canShowFeedbackForm, isTextInputDisabled, suggestions, userInfo, markdownRenderer, conversationType, changeSummary, changeManager, onSuggestionClick, onFeedbackSubmit, onMessageContainerRef, }) {
    if (state === "consent-view" /* State.CONSENT_VIEW */) {
        return renderDisabledState(renderConsentViewContents());
    }
    if (aidaAvailability !== "available" /* Host.AidaClient.AidaAccessPreconditions.AVAILABLE */) {
        return renderDisabledState(renderAidaUnavailableContents(aidaAvailability));
    }
    if (!conversationType) {
        return Lit.nothing;
    }
    if (messages.length > 0) {
        return renderMessages({
            messages,
            isLoading,
            isReadOnly,
            canShowFeedbackForm,
            userInfo,
            markdownRenderer,
            changeSummary,
            changeManager,
            onSuggestionClick,
            onFeedbackSubmit,
            onMessageContainerRef,
        });
    }
    return renderEmptyState({ isTextInputDisabled, suggestions, onSuggestionClick });
}
customElements.define('devtools-ai-chat-view', ChatView);
//# sourceMappingURL=ChatView.js.map