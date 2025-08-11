// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _EntryLabelOverlay_instances, _a, _EntryLabelOverlay_shadow, _EntryLabelOverlay_isPendingRemoval, _EntryLabelOverlay_isLabelEditable, _EntryLabelOverlay_entryLabelVisibleHeight, _EntryLabelOverlay_labelPartsWrapper, _EntryLabelOverlay_entryHighlightWrapper, _EntryLabelOverlay_inputField, _EntryLabelOverlay_connectorLineContainer, _EntryLabelOverlay_label, _EntryLabelOverlay_shouldDrawBelowEntry, _EntryLabelOverlay_richTooltip, _EntryLabelOverlay_callTree, _EntryLabelOverlay_aiAnnotationsEnabledSetting, _EntryLabelOverlay_agent, _EntryLabelOverlay_inAIConsentDialogFlow, _EntryLabelOverlay_currAIButtonState, _EntryLabelOverlay_handleLabelInputKeyUp, _EntryLabelOverlay_handleLabelInputKeyDown, _EntryLabelOverlay_handleLabelInputPaste, _EntryLabelOverlay_drawConnector, _EntryLabelOverlay_drawLabel, _EntryLabelOverlay_focusInputBox, _EntryLabelOverlay_placeCursorAtInputEnd, _EntryLabelOverlay_handleAiButtonClick, _EntryLabelOverlay_showUserAiFirstRunDialog, _EntryLabelOverlay_setAIButtonRenderState, _EntryLabelOverlay_renderAITooltip, _EntryLabelOverlay_renderGeneratingLabelAiButton, _EntryLabelOverlay_renderAiButton, _EntryLabelOverlay_onTooltipLearnMoreClick, _EntryLabelOverlay_renderDisabledAiButton, _EntryLabelOverlay_handleFocusOutEvent, _EntryLabelOverlay_render;
import '../../../../ui/components/icon_button/icon_button.js';
import '../../../../ui/components/tooltips/tooltips.js';
import '../../../../ui/components/spinners/spinners.js';
import * as Common from '../../../../core/common/common.js';
import * as Host from '../../../../core/host/host.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Platform from '../../../../core/platform/platform.js';
import * as Root from '../../../../core/root/root.js';
import * as AiAssistanceModels from '../../../../models/ai_assistance/ai_assistance.js';
import * as Buttons from '../../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../../ui/components/helpers/helpers.js';
import * as UI from '../../../../ui/legacy/legacy.js';
import * as ThemeSupport from '../../../../ui/legacy/theme_support/theme_support.js';
import * as Lit from '../../../../ui/lit/lit.js';
import * as VisualLogging from '../../../../ui/visual_logging/visual_logging.js';
import * as PanelCommon from '../../../common/common.js';
import entryLabelOverlayStyles from './entryLabelOverlay.css.js';
const { html, Directives } = Lit;
const UIStrings = {
    /**
     * @description Accessible label used to explain to a user that they are viewing an entry label.
     */
    entryLabel: 'Entry label',
    /**
     *@description Accessible label used to prompt the user to input text into the field.
     */
    inputTextPrompt: 'Enter an annotation label',
    /**
     *@description Text displayed on a button that generates an AI label.
     */
    generateLabelButton: 'Generate label',
    /**
     *@description Label used for screenreaders on the FRE dialog
     */
    freDialog: 'Get AI-powered annotation suggestions dialog',
    /**
     *@description Screen-reader text for a tooltip link for navigating to "AI innovations" settings where the user can learn more about auto-annotations.
     */
    learnMoreAriaLabel: 'Learn more about auto annotations in settings',
    /**
     *@description Screen-reader text for a tooltip icon.
     */
    moreInfoAriaLabel: 'More information about this feature',
};
/*
* Strings that don't need to be translated at this time.
*/
const UIStringsNotTranslate = {
    /**
     *@description Tooltip link for the navigating to "AI innovations" page in settings.
     */
    learnMore: 'Learn more in settings',
    /**
     *@description Security disclaimer text displayed when the information icon on a button that generates an AI label is hovered.
     */
    generateLabelSecurityDisclaimer: 'The selected call stack is sent to Google. The content you submit and that is generated by this feature will be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.',
    /**
     *@description Enterprise users with logging off - Security disclaimer text displayed when the information icon on a button that generates an AI label is hovered.
     */
    generateLabelSecurityDisclaimerLogginOff: 'The selected call stack is sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.',
    /**
     *@description The `Generate AI label button` tooltip disclaimer for when the feature is not available and the reason can be checked in settings.
     */
    autoAnnotationNotAvailableDisclaimer: 'Auto annotations are not available.',
    /**
     *@description The `Generate AI label button` tooltip disclaimer for when the feature is not available because the user is offline.
     */
    autoAnnotationNotAvailableOfflineDisclaimer: 'Auto annotations are not available because you are offline.',
    /**
     *@description Header text for the AI-powered annotations suggestions disclaimer dialog.
     */
    freDisclaimerHeader: 'Get AI-powered annotation suggestions',
    /**
     *@description Text shown when the AI-powered annotation is being generated.
     */
    generatingLabel: 'Generating label',
    /**
     *@description Text shown when the generation of the AI-powered annotation failed.
     */
    generationFailed: 'Generation failed',
    /**
     *@description First disclaimer item text for the fre dialog - AI won't always get it right.
     */
    freDisclaimerAiWontAlwaysGetItRight: 'This feature uses AI and won’t always get it right',
    /**
     *@description Second disclaimer item text for the fre dialog - trace data is sent to Google.
     */
    freDisclaimerPrivacyDataSentToGoogle: 'Performance trace is sent to Google to generate annotation suggestions',
    /**
     *@description Third disclaimer item text part for the fre dialog part - you can control this setting from the settings panel (because 'settings panel' part of the string is a link, it is attached separately).
     */
    freDisclaimerControlSettingFrom: 'You can control this feature in the',
    /**
     *@description Third disclaimer item text part for the fre dialog part - settings panel text.
     */
    settingsPanel: 'settings panel',
    /**
     *@description Text for the 'learn more' button displayed in fre.
     */
    learnMoreButton: 'Learn more about auto annotations',
};
var AIButtonState;
(function (AIButtonState) {
    AIButtonState["ENABLED"] = "enabled";
    AIButtonState["DISABLED"] = "disabled";
    AIButtonState["HIDDEN"] = "hidden";
    AIButtonState["GENERATION_FAILED"] = "generation_failed";
    AIButtonState["GENERATING_LABEL"] = "generating_label";
})(AIButtonState || (AIButtonState = {}));
const str_ = i18n.i18n.registerUIStrings('panels/timeline/overlays/components/EntryLabelOverlay.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const lockedString = i18n.i18n.lockedString;
function isAiAssistanceServerSideLoggingEnabled() {
    return !Root.Runtime.hostConfig.aidaAvailability?.disallowLogging;
}
export class EntryLabelRemoveEvent extends Event {
    constructor() {
        super(EntryLabelRemoveEvent.eventName);
    }
}
EntryLabelRemoveEvent.eventName = 'entrylabelremoveevent';
export class EntryLabelChangeEvent extends Event {
    constructor(newLabel) {
        super(EntryLabelChangeEvent.eventName);
        this.newLabel = newLabel;
    }
}
EntryLabelChangeEvent.eventName = 'entrylabelchangeevent';
export class LabelAnnotationsConsentDialogVisibilityChange extends Event {
    constructor(isVisible) {
        super(LabelAnnotationsConsentDialogVisibilityChange.eventName, { bubbles: true, composed: true });
        this.isVisible = isVisible;
    }
}
LabelAnnotationsConsentDialogVisibilityChange.eventName = 'labelannotationsconsentdialogvisiblitychange';
export class EntryLabelOverlay extends HTMLElement {
    /**
     * The entry label overlay consists of 3 parts - the label part with the label string inside,
     * the line connecting the label to the entry, and a black box around an entry to highlight the entry with a label.
     * ________
     * |_label__|                <-- label part with the label string inside
     *     \
     *      \                   <-- line connecting the label to the entry with a circle at the end
     *       \
     * _______◯_________
     * |_____entry______|         <--- box around an entry
     *
     * `drawLabel` method below draws the first part.
     * `drawConnector` method below draws the second part - the connector line with a circle and the svg container for them.
     * `drawEntryHighlightWrapper` draws the third part.
     * We only rerender the first part if the label changes and the third part if the size of the entry changes.
     * The connector and circle shapes never change so we only draw the second part when the component is created.
     *
     * Otherwise, the entry label overlay object only gets repositioned.
     */
    constructor(label, shouldDrawBelowEntry = false) {
        super();
        _EntryLabelOverlay_instances.add(this);
        _EntryLabelOverlay_shadow.set(this, this.attachShadow({ mode: 'open' }));
        // Once a label is bound for deletion, we remove it from the DOM via events
        // that are dispatched. But in the meantime the blur event of the input box
        // can fire, and that triggers a second removal. So we set this flag after
        // the first removal to avoid a duplicate event firing which is a no-op but
        // causes errors when we try to delete an already deleted annotation.
        _EntryLabelOverlay_isPendingRemoval.set(this, false);
        // The label is set to editable when it is double clicked. If the user clicks away from the label box
        // element, the label is set to not editable until it double clicked.s
        _EntryLabelOverlay_isLabelEditable.set(this, true);
        _EntryLabelOverlay_entryLabelVisibleHeight.set(this, null);
        _EntryLabelOverlay_labelPartsWrapper.set(this, null);
        _EntryLabelOverlay_entryHighlightWrapper.set(this, null);
        _EntryLabelOverlay_inputField.set(this, null);
        _EntryLabelOverlay_connectorLineContainer.set(this, null);
        _EntryLabelOverlay_label.set(this, void 0);
        _EntryLabelOverlay_shouldDrawBelowEntry.set(this, void 0);
        _EntryLabelOverlay_richTooltip.set(this, Directives.createRef());
        /**
         * Required to generate a label with AI.
         */
        _EntryLabelOverlay_callTree.set(this, null);
        // Creates or gets the setting if it exists.
        _EntryLabelOverlay_aiAnnotationsEnabledSetting.set(this, Common.Settings.Settings.instance().createSetting('ai-annotations-enabled', false));
        _EntryLabelOverlay_agent.set(this, new AiAssistanceModels.PerformanceAnnotationsAgent({
            aidaClient: new Host.AidaClient.AidaClient(),
            serverSideLoggingEnabled: isAiAssistanceServerSideLoggingEnabled(),
        }));
        /**
         * We track this because when the user is in this flow we don't want the
         * empty annotation label to be removed on blur, as we take them to the flow &
         * want to keep the label there for when they come back from the flow having
         * consented, hopefully!
         */
        _EntryLabelOverlay_inAIConsentDialogFlow.set(this, false);
        _EntryLabelOverlay_currAIButtonState.set(this, "hidden" /* AIButtonState.HIDDEN */);
        __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_render).call(this);
        __classPrivateFieldSet(this, _EntryLabelOverlay_shouldDrawBelowEntry, shouldDrawBelowEntry, "f");
        __classPrivateFieldSet(this, _EntryLabelOverlay_labelPartsWrapper, __classPrivateFieldGet(this, _EntryLabelOverlay_shadow, "f").querySelector('.label-parts-wrapper'), "f");
        __classPrivateFieldSet(this, _EntryLabelOverlay_inputField, __classPrivateFieldGet(this, _EntryLabelOverlay_labelPartsWrapper, "f")?.querySelector('.input-field') ?? null, "f");
        __classPrivateFieldSet(this, _EntryLabelOverlay_connectorLineContainer, __classPrivateFieldGet(this, _EntryLabelOverlay_labelPartsWrapper, "f")?.querySelector('.connectorContainer') ?? null, "f");
        __classPrivateFieldSet(this, _EntryLabelOverlay_entryHighlightWrapper, __classPrivateFieldGet(this, _EntryLabelOverlay_labelPartsWrapper, "f")?.querySelector('.entry-highlight-wrapper') ?? null, "f");
        __classPrivateFieldSet(this, _EntryLabelOverlay_label, label, "f");
        __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_drawLabel).call(this, label);
        // If the label is not empty, it was loaded from the trace file.
        // In that case, do not auto-focus it as if the user were creating it for the first time
        if (label !== '') {
            this.setLabelEditabilityAndRemoveEmptyLabel(false);
        }
        const ariaLabel = label === '' ? i18nString(UIStrings.inputTextPrompt) : label;
        __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")?.setAttribute('aria-label', ariaLabel);
        __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_drawConnector).call(this);
    }
    /**
     * So we can provide a mocked agent in tests. Do not call this method outside of a test!
     */
    overrideAIAgentForTest(agent) {
        __classPrivateFieldSet(this, _EntryLabelOverlay_agent, agent, "f");
    }
    entryHighlightWrapper() {
        return __classPrivateFieldGet(this, _EntryLabelOverlay_entryHighlightWrapper, "f");
    }
    set entryLabelVisibleHeight(entryLabelVisibleHeight) {
        __classPrivateFieldSet(this, _EntryLabelOverlay_entryLabelVisibleHeight, entryLabelVisibleHeight, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_render));
        // If the label is editable, focus cursor on it.
        // This method needs to be called after rendering the wrapper because it is the last label overlay element to render.
        // By doing this, the cursor focuses when the label is created.
        if (__classPrivateFieldGet(this, _EntryLabelOverlay_isLabelEditable, "f")) {
            __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_focusInputBox).call(this);
        }
        // The label and connector can move depending on the height of the entry
        __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_drawLabel).call(this);
        __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_drawConnector).call(this);
    }
    setLabelEditabilityAndRemoveEmptyLabel(editable) {
        // We skip this if we have taken the user to the AI FRE flow, because we want the label still there when they come back.
        if (__classPrivateFieldGet(this, _EntryLabelOverlay_inAIConsentDialogFlow, "f") && editable === false) {
            return;
        }
        // Set an attribute on the host; this is used in the overlays CSS to bring
        // the focused, editable label to the top above any others.
        if (editable) {
            this.setAttribute('data-user-editing-label', 'true');
        }
        else {
            this.removeAttribute('data-user-editing-label');
        }
        __classPrivateFieldSet(this, _EntryLabelOverlay_isLabelEditable, editable, "f");
        __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_render).call(this);
        // If the label is editable, focus cursor on it & put the cursor at the end
        if (editable && __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")) {
            __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_placeCursorAtInputEnd).call(this);
            __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_focusInputBox).call(this);
        }
        // On MacOS when clearing the input box it is left with a new line, so we
        // trim the string to remove any accidental trailing whitespace.
        const newLabelText = __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")?.textContent?.trim() ?? '';
        // If the label is empty when it is being navigated away from, dispatch an event to remove this entry overlay
        if (!editable && newLabelText.length === 0 && !__classPrivateFieldGet(this, _EntryLabelOverlay_isPendingRemoval, "f")) {
            __classPrivateFieldSet(this, _EntryLabelOverlay_isPendingRemoval, true, "f");
            this.dispatchEvent(new EntryLabelRemoveEvent());
        }
    }
    set callTree(callTree) {
        __classPrivateFieldSet(this, _EntryLabelOverlay_callTree, callTree, "f");
        // If the entry has a calltree, we need to check if we need to show the 'generate label' button.
        __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_setAIButtonRenderState).call(this);
    }
}
_a = EntryLabelOverlay, _EntryLabelOverlay_shadow = new WeakMap(), _EntryLabelOverlay_isPendingRemoval = new WeakMap(), _EntryLabelOverlay_isLabelEditable = new WeakMap(), _EntryLabelOverlay_entryLabelVisibleHeight = new WeakMap(), _EntryLabelOverlay_labelPartsWrapper = new WeakMap(), _EntryLabelOverlay_entryHighlightWrapper = new WeakMap(), _EntryLabelOverlay_inputField = new WeakMap(), _EntryLabelOverlay_connectorLineContainer = new WeakMap(), _EntryLabelOverlay_label = new WeakMap(), _EntryLabelOverlay_shouldDrawBelowEntry = new WeakMap(), _EntryLabelOverlay_richTooltip = new WeakMap(), _EntryLabelOverlay_callTree = new WeakMap(), _EntryLabelOverlay_aiAnnotationsEnabledSetting = new WeakMap(), _EntryLabelOverlay_agent = new WeakMap(), _EntryLabelOverlay_inAIConsentDialogFlow = new WeakMap(), _EntryLabelOverlay_currAIButtonState = new WeakMap(), _EntryLabelOverlay_instances = new WeakSet(), _EntryLabelOverlay_handleLabelInputKeyUp = function _EntryLabelOverlay_handleLabelInputKeyUp() {
    // If the label changed on key up, dispatch label changed event.
    const labelBoxTextContent = __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")?.textContent?.trim() ?? '';
    if (labelBoxTextContent !== __classPrivateFieldGet(this, _EntryLabelOverlay_label, "f")) {
        __classPrivateFieldSet(this, _EntryLabelOverlay_label, labelBoxTextContent, "f");
        this.dispatchEvent(new EntryLabelChangeEvent(__classPrivateFieldGet(this, _EntryLabelOverlay_label, "f")));
        // Dispatch a fake change event; because we use contenteditable rather than an input, this event does not fire.
        // But we want to listen to the change event in the VE logs, so we dispatch it here.
        __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")?.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
    __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_setAIButtonRenderState).call(this);
    // Rerender the label component when the label text changes because we need to
    // make sure the 'auto annotation' button is only shown when the label is empty.
    __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_render).call(this);
    __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")?.setAttribute('aria-label', labelBoxTextContent);
}, _EntryLabelOverlay_handleLabelInputKeyDown = function _EntryLabelOverlay_handleLabelInputKeyDown(event) {
    if (!__classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")) {
        return false;
    }
    const allowedKeysAfterReachingLenLimit = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
    ];
    // We do not want to create multi-line labels.
    // Therefore, if the new key is `Enter` key, treat it
    // as the end of the label input and blur the input field.
    if ((event.key === Platform.KeyboardUtilities.ENTER_KEY || event.key === Platform.KeyboardUtilities.ESCAPE_KEY) &&
        __classPrivateFieldGet(this, _EntryLabelOverlay_isLabelEditable, "f")) {
        // Note that we do not stop the event propagating here; this is on
        // purpose because we need it to bubble up into TimelineFlameChartView's
        // handler. That updates the state and deals with the keydown.
        // In theory blur() should call the blur event listener, which in turn
        // calls the setLabelEditabilityAndRemoveEmptyLabel method. However, we
        // have seen this not work as part of the AI FRE flow where the privacy
        // consent dialog is shown, which takes focus away from the input and
        // causes the blur() to be a no-op. It's not entirely clear why this
        // happens as visually it renders as focused, but as a back-up we call
        // the setLabelEditabilityAndRemoveEmptyLabel method manually. It won't
        // do anything if the editable state matches what is passed in, so it's
        // safe to call this just in case the blur() didn't actually trigger.
        __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f").blur();
        this.setLabelEditabilityAndRemoveEmptyLabel(false);
        return false;
    }
    // If the max limit is not reached, return true
    if (__classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f").textContent !== null &&
        __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f").textContent.length <= _a.MAX_LABEL_LENGTH) {
        return true;
    }
    if (allowedKeysAfterReachingLenLimit.includes(event.key)) {
        return true;
    }
    if (event.key.length === 1 && event.ctrlKey /* Ctrl + A for selecting all */) {
        return true;
    }
    event.preventDefault();
    return false;
}, _EntryLabelOverlay_handleLabelInputPaste = function _EntryLabelOverlay_handleLabelInputPaste(event) {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData || !__classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")) {
        return;
    }
    // Remove newline characters to ensure single-line paste.
    const pastedText = clipboardData.getData('text').replace(/(\r\n|\n|\r)/gm, '');
    const newText = __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f").textContent + pastedText;
    const trimmedText = newText.slice(0, _a.MAX_LABEL_LENGTH + 1);
    __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f").textContent = trimmedText;
    __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_placeCursorAtInputEnd).call(this);
}, _EntryLabelOverlay_drawConnector = function _EntryLabelOverlay_drawConnector() {
    if (!__classPrivateFieldGet(this, _EntryLabelOverlay_connectorLineContainer, "f")) {
        console.error('`connectorLineContainer` element is missing.');
        return;
    }
    if (__classPrivateFieldGet(this, _EntryLabelOverlay_shouldDrawBelowEntry, "f") && __classPrivateFieldGet(this, _EntryLabelOverlay_entryLabelVisibleHeight, "f")) {
        const translation = __classPrivateFieldGet(this, _EntryLabelOverlay_entryLabelVisibleHeight, "f") + _a.LABEL_CONNECTOR_HEIGHT;
        __classPrivateFieldGet(this, _EntryLabelOverlay_connectorLineContainer, "f").style.transform = `translateY(${translation}px) rotate(180deg)`;
    }
    const connector = __classPrivateFieldGet(this, _EntryLabelOverlay_connectorLineContainer, "f").querySelector('line');
    const circle = __classPrivateFieldGet(this, _EntryLabelOverlay_connectorLineContainer, "f").querySelector('circle');
    if (!connector || !circle) {
        console.error('Some entry label elements are missing.');
        return;
    }
    // PART 2: draw the connector from label to the entry
    // Set the width of the canvas that draws the connector to be equal to the length of the shift multiplied by two.
    // That way, we can draw the connector from its corner to its middle. Since all elements are aligned in the middle, the connector
    // will end in the middle of the entry.
    __classPrivateFieldGet(this, _EntryLabelOverlay_connectorLineContainer, "f").setAttribute('width', (_a.LABEL_AND_CONNECTOR_SHIFT_LENGTH * 2).toString());
    __classPrivateFieldGet(this, _EntryLabelOverlay_connectorLineContainer, "f").setAttribute('height', _a.LABEL_CONNECTOR_HEIGHT.toString());
    // Start drawing the top right corner.
    connector.setAttribute('x1', '0');
    connector.setAttribute('y1', '0');
    // Finish drawing in middle of the connector container.
    connector.setAttribute('x2', _a.LABEL_AND_CONNECTOR_SHIFT_LENGTH.toString());
    connector.setAttribute('y2', _a.LABEL_CONNECTOR_HEIGHT.toString());
    const connectorColor = ThemeSupport.ThemeSupport.instance().getComputedValue('--color-text-primary');
    connector.setAttribute('stroke', connectorColor);
    connector.setAttribute('stroke-width', '2');
    // Draw the circle at the bottom of the connector
    circle.setAttribute('cx', _a.LABEL_AND_CONNECTOR_SHIFT_LENGTH.toString());
    // Add one to the offset of the circle which positions it perfectly centered on the border of the overlay.
    circle.setAttribute('cy', (_a.LABEL_CONNECTOR_HEIGHT + 1).toString());
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', connectorColor);
}, _EntryLabelOverlay_drawLabel = function _EntryLabelOverlay_drawLabel(initialLabel) {
    if (!__classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")) {
        console.error('`labelBox`element is missing.');
        return;
    }
    if (typeof initialLabel === 'string') {
        __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f").innerText = initialLabel;
    }
    let xTranslation = null;
    let yTranslation = null;
    // PART 1: draw the label box
    if (__classPrivateFieldGet(this, _EntryLabelOverlay_shouldDrawBelowEntry, "f")) {
        // Label is drawn below and slightly to the right.
        xTranslation = _a.LABEL_AND_CONNECTOR_SHIFT_LENGTH;
    }
    else {
        // If the label is drawn above, the connector goes up and to the left, so
        // we pull the label back slightly to align it nicely.
        xTranslation = _a.LABEL_AND_CONNECTOR_SHIFT_LENGTH * -1;
    }
    if (__classPrivateFieldGet(this, _EntryLabelOverlay_shouldDrawBelowEntry, "f") && __classPrivateFieldGet(this, _EntryLabelOverlay_entryLabelVisibleHeight, "f")) {
        // Move the label down from above the entry to below it. The label is positioned by default quite far above the entry, hence why we add:
        // 1. the height of the entry + of the label (inc its padding)
        // 2. the height of the connector (*2), so we have room to draw it
        const verticalTransform = __classPrivateFieldGet(this, _EntryLabelOverlay_entryLabelVisibleHeight, "f") + (_a.LABEL_CONNECTOR_HEIGHT * 2) +
            __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")?.offsetHeight;
        yTranslation = verticalTransform;
    }
    let transformString = '';
    if (xTranslation) {
        transformString += `translateX(${xTranslation}px) `;
    }
    if (yTranslation) {
        transformString += `translateY(${yTranslation}px)`;
    }
    if (transformString.length) {
        __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f").style.transform = transformString;
    }
}, _EntryLabelOverlay_focusInputBox = function _EntryLabelOverlay_focusInputBox() {
    if (!__classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")) {
        console.error('`labelBox` element is missing.');
        return;
    }
    __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f").focus();
}, _EntryLabelOverlay_placeCursorAtInputEnd = function _EntryLabelOverlay_placeCursorAtInputEnd() {
    if (!__classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")) {
        return;
    }
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(__classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f"));
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
}, _EntryLabelOverlay_handleAiButtonClick = 
// Generate the AI label suggestion if:
// 1. the user has already already seen the fre dialog and confirmed the feature usage
// or
// 2. turned on the `generate AI labels` setting through the AI settings panel
//
// Otherwise, show the fre dialog with a 'Got it' button that turns the setting on.
async function _EntryLabelOverlay_handleAiButtonClick() {
    if (__classPrivateFieldGet(this, _EntryLabelOverlay_aiAnnotationsEnabledSetting, "f").get()) {
        if (!__classPrivateFieldGet(this, _EntryLabelOverlay_callTree, "f") || !__classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")) {
            // Shouldn't happen as we only show the Generate UI when we have this, but this satisfies TS.
            return;
        }
        try {
            // Trigger a re-render to display the loading component in the place of the button when the label is being generated.
            __classPrivateFieldSet(this, _EntryLabelOverlay_currAIButtonState, "generating_label" /* AIButtonState.GENERATING_LABEL */, "f");
            UI.ARIAUtils.LiveAnnouncer.alert(UIStringsNotTranslate.generatingLabel);
            // Trigger a re-render to put focus back on the input box, otherwise
            // when the button changes to a loading spinner, it loses focus and the
            // editing state is reset because the component loses focus.
            __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_render).call(this);
            __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_focusInputBox).call(this);
            void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_render));
            __classPrivateFieldSet(this, _EntryLabelOverlay_label, await __classPrivateFieldGet(this, _EntryLabelOverlay_agent, "f").generateAIEntryLabel(__classPrivateFieldGet(this, _EntryLabelOverlay_callTree, "f")), "f");
            this.dispatchEvent(new EntryLabelChangeEvent(__classPrivateFieldGet(this, _EntryLabelOverlay_label, "f")));
            __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f").innerText = __classPrivateFieldGet(this, _EntryLabelOverlay_label, "f");
            __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_placeCursorAtInputEnd).call(this);
            // Reset the button state because we want to hide it if the label is not empty.
            __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_setAIButtonRenderState).call(this);
            // Trigger a re-render to hide the AI Button and display the generated label.
            __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_render).call(this);
        }
        catch {
            __classPrivateFieldSet(this, _EntryLabelOverlay_currAIButtonState, "generation_failed" /* AIButtonState.GENERATION_FAILED */, "f");
            void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_render));
        }
    }
    else {
        __classPrivateFieldSet(this, _EntryLabelOverlay_inAIConsentDialogFlow, true, "f");
        __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_render).call(this);
        const hasConsented = await __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_showUserAiFirstRunDialog).call(this);
        __classPrivateFieldSet(this, _EntryLabelOverlay_inAIConsentDialogFlow, false, "f");
        // This makes sure we put the user back in the editable state.
        this.setLabelEditabilityAndRemoveEmptyLabel(true);
        // If the user has consented, we now want to call this function again so
        // the label generation happens without them having to click the button
        // again.
        if (hasConsented) {
            await __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_handleAiButtonClick).call(this);
        }
    }
}, _EntryLabelOverlay_showUserAiFirstRunDialog = 
/**
 * @returns `true` if the user has now consented, and `false` otherwise.
 */
async function _EntryLabelOverlay_showUserAiFirstRunDialog() {
    this.dispatchEvent(new LabelAnnotationsConsentDialogVisibilityChange(true));
    const userConsented = await PanelCommon.FreDialog.show({
        ariaLabel: i18nString(UIStrings.freDialog),
        header: { iconName: 'pen-spark', text: lockedString(UIStringsNotTranslate.freDisclaimerHeader) },
        reminderItems: [
            {
                iconName: 'psychiatry',
                content: lockedString(UIStringsNotTranslate.freDisclaimerAiWontAlwaysGetItRight),
            },
            {
                iconName: 'google',
                content: lockedString(UIStringsNotTranslate.freDisclaimerPrivacyDataSentToGoogle),
            },
            {
                iconName: 'gear',
                // clang-format off
                content: html `
            ${lockedString(UIStringsNotTranslate.freDisclaimerControlSettingFrom)}
            <button
              @click=${() => {
                    void UI.ViewManager.ViewManager.instance().showView('chrome-ai');
                }}
              class="link"
              role="link"
              jslog=${VisualLogging.link('open-ai-settings').track({
                    click: true
                })}
              tabindex="0"
            >${lockedString(UIStringsNotTranslate.settingsPanel)}</button>`,
                // clang-format on
            },
        ],
        onLearnMoreClick: () => {
            UI.UIUtils.openInNewTab('https://developer.chrome.com/docs/devtools/performance/annotations#auto-annotations');
        },
        learnMoreButtonTitle: UIStringsNotTranslate.learnMoreButton,
    });
    this.dispatchEvent(new LabelAnnotationsConsentDialogVisibilityChange(false));
    if (userConsented) {
        __classPrivateFieldGet(this, _EntryLabelOverlay_aiAnnotationsEnabledSetting, "f").set(true);
    }
    return __classPrivateFieldGet(this, _EntryLabelOverlay_aiAnnotationsEnabledSetting, "f").get();
}, _EntryLabelOverlay_setAIButtonRenderState = function _EntryLabelOverlay_setAIButtonRenderState() {
    const hasAiExperiment = Boolean(Root.Runtime.hostConfig.devToolsAiGeneratedTimelineLabels?.enabled);
    const aiDisabledByEnterprisePolicy = Root.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue ===
        Root.Runtime.GenAiEnterprisePolicyValue.DISABLE;
    // If the call tree is not available, the entry is in a track other than the main track.
    // Therefore, hide the button because, at the moment, the label can only be generated for main tracks
    const dataToGenerateLabelAvailable = __classPrivateFieldGet(this, _EntryLabelOverlay_callTree, "f") !== null;
    /**
     * Right now if the user "retries" the AI label generation the result will
     * be almost identical because we don't change the input data or prompt. So
     * we only show the generate button if the label is empty.
     */
    const labelIsEmpty = __classPrivateFieldGet(this, _EntryLabelOverlay_label, "f")?.length <= 0;
    if (!hasAiExperiment || aiDisabledByEnterprisePolicy || !dataToGenerateLabelAvailable || !labelIsEmpty) {
        __classPrivateFieldSet(this, _EntryLabelOverlay_currAIButtonState, "hidden" /* AIButtonState.HIDDEN */, "f");
    }
    else {
        // To verify whether AI can be used, check if aida is available, the user is logged in, over 18, in a supported
        // location and offline.
        const aiAvailable = Root.Runtime.hostConfig.aidaAvailability?.enabled &&
            !Root.Runtime.hostConfig.aidaAvailability?.blockedByAge &&
            !Root.Runtime.hostConfig.aidaAvailability?.blockedByGeo && navigator.onLine;
        if (aiAvailable) {
            __classPrivateFieldSet(this, _EntryLabelOverlay_currAIButtonState, "enabled" /* AIButtonState.ENABLED */, "f");
        }
        else {
            // If AI features are not available, we show a disabled button.
            __classPrivateFieldSet(this, _EntryLabelOverlay_currAIButtonState, "disabled" /* AIButtonState.DISABLED */, "f");
        }
    }
}, _EntryLabelOverlay_renderAITooltip = function _EntryLabelOverlay_renderAITooltip(opts) {
    // clang-format off
    return html `<devtools-tooltip
    variant="rich"
    id="info-tooltip"
    ${Directives.ref(__classPrivateFieldGet(this, _EntryLabelOverlay_richTooltip, "f"))}>
      <div class="info-tooltip-container">
        ${opts.textContent} ${opts.includeSettingsButton ? html `
          <button
            class="link tooltip-link"
            role="link"
            jslog=${VisualLogging.link('open-ai-settings').track({
        click: true,
    })}
            @click=${__classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_onTooltipLearnMoreClick)}
            aria-label=${i18nString(UIStrings.learnMoreAriaLabel)}
          >${lockedString(UIStringsNotTranslate.learnMore)}</button>
        ` : Lit.nothing}
      </div>
    </devtools-tooltip>`;
    // clang-format on
}, _EntryLabelOverlay_renderGeneratingLabelAiButton = function _EntryLabelOverlay_renderGeneratingLabelAiButton() {
    // clang-format off
    return html `
      <span
        class="ai-label-loading">
        <devtools-spinner></devtools-spinner>
        <span class="generate-label-text">${lockedString(UIStringsNotTranslate.generatingLabel)}</span>
      </span>
    `;
    // clang-format on
}, _EntryLabelOverlay_renderAiButton = function _EntryLabelOverlay_renderAiButton() {
    const noLogging = Root.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue ===
        Root.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING;
    if (__classPrivateFieldGet(this, _EntryLabelOverlay_currAIButtonState, "f") === "generation_failed" /* AIButtonState.GENERATION_FAILED */) {
        // Only show the error message on the first component render render after the failure.
        // clang-format off
        return html `
        <span
          class="ai-label-error">
          <devtools-icon
            class="warning"
            .name=${'warning'}
            .data=${{
            iconName: 'warning', color: 'var(--ref-palette-error50)', width: '20px'
        }}>
          </devtools-icon>
          <span class="generate-label-text">${lockedString(UIStringsNotTranslate.generationFailed)}</span>
        </span>
      `;
        // clang-format on
    }
    // clang-format off
    return html `
      <!-- 'preventDefault' on the AI label button to prevent the label removal on blur  -->
      <span
        class="ai-label-button-wrapper only-pen-wrapper"
        @mousedown=${(e) => e.preventDefault()}>
        <button
          class="ai-label-button enabled"
          @click=${__classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_handleAiButtonClick)}>
          <devtools-icon
            class="pen-icon"
            .name=${'pen-spark'}
            .data=${{
        iconName: 'pen-spark', color: 'var(--color-primary)', width: '20px'
    }}>
          </devtools-icon>
          <span class="generate-label-text">${i18nString(UIStrings.generateLabelButton)}</span>
        </button>
        <devtools-button
          aria-details="info-tooltip"
          class="pen-icon"
          .title=${i18nString(UIStrings.moreInfoAriaLabel)}
          .iconName=${'info'}
          .variant=${"icon" /* Buttons.Button.Variant.ICON */}
          ></devtools-button>
        ${__classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_renderAITooltip).call(this, {
        textContent: noLogging ? lockedString(UIStringsNotTranslate.generateLabelSecurityDisclaimerLogginOff) : lockedString(UIStringsNotTranslate.generateLabelSecurityDisclaimer),
        includeSettingsButton: true,
    })}
      </span>
    `;
    // clang-format on
}, _EntryLabelOverlay_onTooltipLearnMoreClick = function _EntryLabelOverlay_onTooltipLearnMoreClick() {
    __classPrivateFieldGet(this, _EntryLabelOverlay_richTooltip, "f")?.value?.hidePopover();
    void UI.ViewManager.ViewManager.instance().showView('chrome-ai');
}, _EntryLabelOverlay_renderDisabledAiButton = function _EntryLabelOverlay_renderDisabledAiButton() {
    const noConnection = navigator.onLine === false;
    // clang-format off
    return html `
      <!-- 'preventDefault' on the AI label button to prevent the label removal on blur  -->
      <span
        class="ai-label-disabled-button-wrapper only-pen-wrapper"
        @mousedown=${(e) => e.preventDefault()}>
        <button
          class="ai-label-button disabled"
          ?disabled=${true}
          @click=${__classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_handleAiButtonClick)}>
          <devtools-icon
            aria-details="info-tooltip"
            class="pen-icon"
            .name=${'pen-spark'}
            .data=${{
        iconName: 'pen-spark', color: 'var(--sys-color-state-disabled)', width: '20px'
    }}>
          </devtools-icon>
        </button>
        ${__classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_renderAITooltip).call(this, {
        textContent: noConnection ? lockedString(UIStringsNotTranslate.autoAnnotationNotAvailableOfflineDisclaimer) : lockedString(UIStringsNotTranslate.autoAnnotationNotAvailableDisclaimer),
        includeSettingsButton: !noConnection,
    })}
      </span>
    `;
    // clang-format on
}, _EntryLabelOverlay_handleFocusOutEvent = function _EntryLabelOverlay_handleFocusOutEvent() {
    /**
     * Usually when the text box loses focus, we want to stop the edit mode and
     * just display the annotation. However, if the user tabs from the text box
     * to focus the GenerateAI button, we need to ensure that we do not exit
     * edit mode. The only reliable method is to listen to the focusout event
     * (which bubbles, unlike `blur`) on the parent.
     * This means we get any updates on the focus state of anything inside this component.
     * Once we get the event, we check to see if focus is still within this
     * component (which means either the input, or the button, or the disclaimer popup).
     * If it is, we do nothing, but if we have lost focus,  we can then exit editable mode.
     *
     * If you are thinking "why not `blur` on the span" it's because blur does
     * not propagate; the span itself never blurs, but the elements inside it
     * do as the span is not focusable.
     *
     * The reason we do it inside a rAF is because on the first run the values
     * for `this.hasFocus()` are not accurate. I'm not quite sure why, but by
     * letting the browser have a frame to update, it then accurately reports
     * the up to date values for `this.hasFocus()`
     */
    requestAnimationFrame(() => {
        if (!this.hasFocus()) {
            this.setLabelEditabilityAndRemoveEmptyLabel(false);
        }
    });
}, _EntryLabelOverlay_render = function _EntryLabelOverlay_render() {
    const inputFieldClasses = Lit.Directives.classMap({
        'input-field': true,
        // When the consent modal pops up, we want the input to look like it has focus so it visually doesn't change.
        // Once the consent flow is closed, we restore focus and maintain the appearance.
        'fake-focus-state': __classPrivateFieldGet(this, _EntryLabelOverlay_inAIConsentDialogFlow, "f"),
    });
    // clang-format off
    Lit.render(html `
        <style>${entryLabelOverlayStyles}</style>
        <span class="label-parts-wrapper" role="region" aria-label=${i18nString(UIStrings.entryLabel)}
          @focusout=${__classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_handleFocusOutEvent)}
        >
          <span
            class="label-button-input-wrapper">
            <span
              class=${inputFieldClasses}
              role="textbox"
              @focus=${() => {
        this.setLabelEditabilityAndRemoveEmptyLabel(true);
    }}
              @dblclick=${() => {
        this.setLabelEditabilityAndRemoveEmptyLabel(true);
    }}
              @keydown=${__classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_handleLabelInputKeyDown)}
              @paste=${__classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_handleLabelInputPaste)}
              @input=${__classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_handleLabelInputKeyUp)}
              contenteditable=${__classPrivateFieldGet(this, _EntryLabelOverlay_isLabelEditable, "f") ? 'plaintext-only' : false}
              jslog=${VisualLogging.textField('timeline.annotations.entry-label-input').track({ keydown: true, click: true, change: true })}
              tabindex="0"
            ></span>
            ${__classPrivateFieldGet(this, _EntryLabelOverlay_isLabelEditable, "f") && __classPrivateFieldGet(this, _EntryLabelOverlay_inputField, "f")?.innerText !== '' ? html `
              <button
                class="delete-button"
                @click=${() => this.dispatchEvent(new EntryLabelRemoveEvent())}
                jslog=${VisualLogging.action('timeline.annotations.delete-entry-label').track({ click: true })}>
              <devtools-icon
                .data=${{
        iconName: 'cross',
        color: 'var(--color-background)',
        width: '14px',
        height: '14px'
    }}
              ></devtools-icon>
              </button>
            ` : Lit.nothing}
            ${(() => {
        switch (__classPrivateFieldGet(this, _EntryLabelOverlay_currAIButtonState, "f")) {
            case "hidden" /* AIButtonState.HIDDEN */:
                return Lit.nothing;
            case "enabled" /* AIButtonState.ENABLED */:
                return __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_renderAiButton).call(this);
            case "generating_label" /* AIButtonState.GENERATING_LABEL */:
                return __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_renderGeneratingLabelAiButton).call(this);
            case "generation_failed" /* AIButtonState.GENERATION_FAILED */:
                return __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_renderAiButton).call(this);
            case "disabled" /* AIButtonState.DISABLED */:
                return __classPrivateFieldGet(this, _EntryLabelOverlay_instances, "m", _EntryLabelOverlay_renderDisabledAiButton).call(this);
        }
    })()}
          </span>
          <svg class="connectorContainer">
            <line/>
            <circle/>
          </svg>
          <div class="entry-highlight-wrapper"></div>
        </span>`, __classPrivateFieldGet(this, _EntryLabelOverlay_shadow, "f"), { host: this });
    // clang-format on
};
// The label is angled on the left from the centre of the entry it belongs to.
// `LABEL_AND_CONNECTOR_SHIFT_LENGTH` specifies how many pixels to the left it is shifted.
EntryLabelOverlay.LABEL_AND_CONNECTOR_SHIFT_LENGTH = 8;
// Length of the line that connects the label to the entry.
EntryLabelOverlay.LABEL_CONNECTOR_HEIGHT = 7;
// Set the max label length to avoid labels that could signicantly increase the file size.
EntryLabelOverlay.MAX_LABEL_LENGTH = 100;
customElements.define('devtools-entry-label-overlay', EntryLabelOverlay);
//# sourceMappingURL=EntryLabelOverlay.js.map