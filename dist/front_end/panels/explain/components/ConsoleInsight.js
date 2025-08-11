// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _ConsoleInsight_instances, _ConsoleInsight_shadow, _ConsoleInsight_promptBuilder, _ConsoleInsight_aidaClient, _ConsoleInsight_renderer, _ConsoleInsight_state, _ConsoleInsight_referenceDetailsRef, _ConsoleInsight_areReferenceDetailsOpen, _ConsoleInsight_selectedRating, _ConsoleInsight_consoleInsightsEnabledSetting, _ConsoleInsight_aidaAvailability, _ConsoleInsight_boundOnAidaAvailabilityChange, _ConsoleInsight_marked, _ConsoleInsight_citationClickHandler, _ConsoleInsight_getStateFromAidaAvailability, _ConsoleInsight_getConsoleInsightsEnabledSetting, _ConsoleInsight_getOnboardingCompletedSetting, _ConsoleInsight_onAidaAvailabilityChange, _ConsoleInsight_onConsoleInsightsSettingChanged, _ConsoleInsight_transitionTo, _ConsoleInsight_generateInsightIfNeeded, _ConsoleInsight_onClose, _ConsoleInsight_onRating, _ConsoleInsight_onReport, _ConsoleInsight_onSearch, _ConsoleInsight_onConsentReminderConfirmed, _ConsoleInsight_insertCitations, _ConsoleInsight_modifyTokensToHandleCitationsInCode, _ConsoleInsight_generateInsight, _ConsoleInsight_validateMarkdown, _ConsoleInsight_getInsight, _ConsoleInsight_onGoToSignIn, _ConsoleInsight_focusHeader, _ConsoleInsight_renderSearchButton, _ConsoleInsight_renderLearnMoreAboutInsights, _ConsoleInsight_maybeRenderSources, _ConsoleInsight_maybeRenderRelatedContent, _ConsoleInsight_isSearchRagResponse, _ConsoleInsight_onToggleReferenceDetails, _ConsoleInsight_renderMain, _ConsoleInsight_renderDisclaimer, _ConsoleInsight_renderFooter, _ConsoleInsight_getHeader, _ConsoleInsight_renderSpinner, _ConsoleInsight_renderHeader, _ConsoleInsight_render, _ConsoleInsightSourcesList_instances, _ConsoleInsightSourcesList_shadow, _ConsoleInsightSourcesList_sources, _ConsoleInsightSourcesList_isPageReloadRecommended, _ConsoleInsightSourcesList_render;
import '../../../ui/components/spinners/spinners.js';
import * as Common from '../../../core/common/common.js';
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Root from '../../../core/root/root.js';
import * as Marked from '../../../third_party/marked/marked.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as Input from '../../../ui/components/input/input.js';
import * as MarkdownView from '../../../ui/components/markdown_view/markdown_view.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import { SourceType } from '../PromptBuilder.js';
import styles from './consoleInsight.css.js';
import listStyles from './consoleInsightSourcesList.css.js';
// Note: privacy and legal notices are not localized so far.
const UIStrings = {
    /**
     * @description The title of the insight source "Console message".
     */
    consoleMessage: 'Console message',
    /**
     * @description The title of the insight source "Stacktrace".
     */
    stackTrace: 'Stacktrace',
    /**
     * @description The title of the insight source "Network request".
     */
    networkRequest: 'Network request',
    /**
     * @description The title of the insight source "Related code".
     */
    relatedCode: 'Related code',
    /**
     * @description The title that is shown while the insight is being generated.
     */
    generating: 'Generating explanation…',
    /**
     * @description The header that indicates that the content shown is a console
     * insight.
     */
    insight: 'Explanation',
    /**
     * @description The title of the a button that closes the insight pane.
     */
    closeInsight: 'Close explanation',
    /**
     * @description The title of the list of source data that was used to generate the insight.
     */
    inputData: 'Data used to understand this message',
    /**
     * @description The title of the button that allows submitting positive
     * feedback about the console insight.
     */
    goodResponse: 'Good response',
    /**
     * @description The title of the button that allows submitting negative
     * feedback about the console insight.
     */
    badResponse: 'Bad response',
    /**
     * @description The title of the button that opens a page to report a legal
     * issue with the console insight.
     */
    report: 'Report legal issue',
    /**
     * @description The text of the header inside the console insight pane when there was an error generating an insight.
     */
    error: 'DevTools has encountered an error',
    /**
     * @description The message shown when an error has been encountered.
     */
    errorBody: 'Something went wrong. Try again.',
    /**
     * @description Label for screen readers that is added to the end of the link
     * title to indicate that the link will be opened in a new tab.
     */
    opensInNewTab: '(opens in a new tab)',
    /**
     * @description The title of a link that allows the user to learn more about
     * the feature.
     */
    learnMore: 'Learn more',
    /**
     * @description The error message when the user is not logged in into Chrome.
     */
    notLoggedIn: 'This feature is only available when you sign into Chrome with your Google account.',
    /**
     * @description The title of a button which opens the Chrome SignIn page.
     */
    signIn: 'Sign in',
    /**
     * @description The header shown when the internet connection is not
     * available.
     */
    offlineHeader: 'DevTools can’t reach the internet',
    /**
     * @description Message shown when the user is offline.
     */
    offline: 'Check your internet connection and try again.',
    /**
     * @description The message shown if the user is not logged in.
     */
    signInToUse: 'Sign in to use this feature',
    /**
     * @description The title of the button that searches for the console
     * insight using a search engine instead of using console insights.
     */
    search: 'Use search instead',
    /**
     * @description Shown to the user when the network request data is not
     * available and a page reload might populate it.
     */
    reloadRecommendation: 'Reload the page to capture related network request data for this message in order to create a better insight.',
    /**
     * @description Shown to the user when they need to enable the console insights feature in settings in order to use it.
     * @example {Console insights in Settings} PH1
     */
    turnOnInSettings: 'Turn on {PH1} to receive AI assistance for understanding and addressing console warnings and errors.',
    /**
     * @description Text for a link to Chrome DevTools Settings.
     */
    settingsLink: '`Console insights` in Settings',
    /**
     * @description The title of the list of references/recitations that were used to generate the insight.
     */
    references: 'Sources and related content',
    /**
     * @description Sub-heading for a list of links to URLs which are related to the AI-generated response.
     */
    relatedContent: 'Related content',
    /**
     * @description Error message shown when the request to get an AI response times out.
     */
    timedOut: 'Generating a response took too long. Please try again.',
    /**
     *@description Text informing the user that AI assistance is not available in Incognito mode or Guest mode.
     */
    notAvailableInIncognitoMode: 'AI assistance is not available in Incognito mode or Guest mode',
};
const str_ = i18n.i18n.registerUIStrings('panels/explain/components/ConsoleInsight.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const i18nTemplate = Lit.i18nTemplate.bind(undefined, str_);
const { render, html, Directives } = Lit;
export class CloseEvent extends Event {
    constructor() {
        super(CloseEvent.eventName, { composed: true, bubbles: true });
    }
}
CloseEvent.eventName = 'close';
function localizeType(sourceType) {
    switch (sourceType) {
        case SourceType.MESSAGE:
            return i18nString(UIStrings.consoleMessage);
        case SourceType.STACKTRACE:
            return i18nString(UIStrings.stackTrace);
        case SourceType.NETWORK_REQUEST:
            return i18nString(UIStrings.networkRequest);
        case SourceType.RELATED_CODE:
            return i18nString(UIStrings.relatedCode);
    }
}
const TERMS_OF_SERVICE_URL = 'https://policies.google.com/terms';
const PRIVACY_POLICY_URL = 'https://policies.google.com/privacy';
const CODE_SNIPPET_WARNING_URL = 'https://support.google.com/legal/answer/13505487';
const LEARN_MORE_URL = 'https://goo.gle/devtools-console-messages-ai';
const REPORT_URL = 'https://support.google.com/legal/troubleshooter/1114905?hl=en#ts=1115658%2C13380504';
const SIGN_IN_URL = 'https://accounts.google.com';
var State;
(function (State) {
    State["INSIGHT"] = "insight";
    State["LOADING"] = "loading";
    State["ERROR"] = "error";
    State["SETTING_IS_NOT_TRUE"] = "setting-is-not-true";
    State["CONSENT_REMINDER"] = "consent-reminder";
    State["NOT_LOGGED_IN"] = "not-logged-in";
    State["SYNC_IS_PAUSED"] = "sync-is-paused";
    State["OFFLINE"] = "offline";
})(State || (State = {}));
const markedExtension = {
    name: 'citation',
    level: 'inline',
    start(src) {
        return src.match(/\[\^/)?.index;
    },
    tokenizer(src) {
        const match = src.match(/^\[\^(\d+)\]/);
        if (match) {
            return {
                type: 'citation',
                raw: match[0],
                linkText: Number(match[1]),
            };
        }
        return false;
    },
    renderer: () => '',
};
export class ConsoleInsight extends HTMLElement {
    static async create(promptBuilder, aidaClient) {
        const aidaAvailability = await Host.AidaClient.AidaClient.checkAccessPreconditions();
        return new ConsoleInsight(promptBuilder, aidaClient, aidaAvailability);
    }
    constructor(promptBuilder, aidaClient, aidaAvailability) {
        super();
        _ConsoleInsight_instances.add(this);
        _ConsoleInsight_shadow.set(this, this.attachShadow({ mode: 'open' }));
        this.disableAnimations = false;
        _ConsoleInsight_promptBuilder.set(this, void 0);
        _ConsoleInsight_aidaClient.set(this, void 0);
        _ConsoleInsight_renderer.set(this, void 0);
        // Main state.
        _ConsoleInsight_state.set(this, void 0);
        _ConsoleInsight_referenceDetailsRef.set(this, Lit.Directives.createRef());
        _ConsoleInsight_areReferenceDetailsOpen.set(this, false);
        // Rating sub-form state.
        _ConsoleInsight_selectedRating.set(this, void 0);
        _ConsoleInsight_consoleInsightsEnabledSetting.set(this, void 0);
        _ConsoleInsight_aidaAvailability.set(this, void 0);
        _ConsoleInsight_boundOnAidaAvailabilityChange.set(this, void 0);
        _ConsoleInsight_marked.set(this, void 0);
        __classPrivateFieldSet(this, _ConsoleInsight_promptBuilder, promptBuilder, "f");
        __classPrivateFieldSet(this, _ConsoleInsight_aidaClient, aidaClient, "f");
        __classPrivateFieldSet(this, _ConsoleInsight_aidaAvailability, aidaAvailability, "f");
        __classPrivateFieldSet(this, _ConsoleInsight_consoleInsightsEnabledSetting, __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_getConsoleInsightsEnabledSetting).call(this), "f");
        __classPrivateFieldSet(this, _ConsoleInsight_renderer, new MarkdownView.MarkdownView.MarkdownInsightRenderer(__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_citationClickHandler).bind(this)), "f");
        __classPrivateFieldSet(this, _ConsoleInsight_marked, new Marked.Marked.Marked({ extensions: [markedExtension] }), "f");
        __classPrivateFieldSet(this, _ConsoleInsight_state, __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_getStateFromAidaAvailability).call(this), "f");
        __classPrivateFieldSet(this, _ConsoleInsight_boundOnAidaAvailabilityChange, __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onAidaAvailabilityChange).bind(this), "f");
        __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_render).call(this);
        // Stop keyboard event propagation to avoid Console acting on the events
        // inside the insight component.
        this.addEventListener('keydown', e => {
            e.stopPropagation();
        });
        this.addEventListener('keyup', e => {
            e.stopPropagation();
        });
        this.addEventListener('keypress', e => {
            e.stopPropagation();
        });
        this.addEventListener('click', e => {
            e.stopPropagation();
        });
        this.focus();
    }
    connectedCallback() {
        this.classList.add('opening');
        __classPrivateFieldGet(this, _ConsoleInsight_consoleInsightsEnabledSetting, "f")?.addChangeListener(__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onConsoleInsightsSettingChanged), this);
        const blockedByAge = Root.Runtime.hostConfig.aidaAvailability?.blockedByAge === true;
        if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type === "loading" /* State.LOADING */ && __classPrivateFieldGet(this, _ConsoleInsight_consoleInsightsEnabledSetting, "f")?.getIfNotDisabled() === true &&
            !blockedByAge && __classPrivateFieldGet(this, _ConsoleInsight_state, "f").consentOnboardingCompleted) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.GeneratingInsightWithoutDisclaimer);
        }
        Host.AidaClient.HostConfigTracker.instance().addEventListener("aidaAvailabilityChanged" /* Host.AidaClient.Events.AIDA_AVAILABILITY_CHANGED */, __classPrivateFieldGet(this, _ConsoleInsight_boundOnAidaAvailabilityChange, "f"));
        // If AIDA availability has changed while the component was disconnected, we need to update.
        void __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onAidaAvailabilityChange).call(this);
        // The setting might have been turned on/off while the component was disconnected.
        // Update the state, unless the current state is already terminal (`INSIGHT` or `ERROR`).
        if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type !== "insight" /* State.INSIGHT */ && __classPrivateFieldGet(this, _ConsoleInsight_state, "f").type !== "error" /* State.ERROR */) {
            __classPrivateFieldSet(this, _ConsoleInsight_state, __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_getStateFromAidaAvailability).call(this), "f");
        }
        void __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_generateInsightIfNeeded).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _ConsoleInsight_consoleInsightsEnabledSetting, "f")?.removeChangeListener(__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onConsoleInsightsSettingChanged), this);
        Host.AidaClient.HostConfigTracker.instance().removeEventListener("aidaAvailabilityChanged" /* Host.AidaClient.Events.AIDA_AVAILABILITY_CHANGED */, __classPrivateFieldGet(this, _ConsoleInsight_boundOnAidaAvailabilityChange, "f"));
    }
}
_ConsoleInsight_shadow = new WeakMap(), _ConsoleInsight_promptBuilder = new WeakMap(), _ConsoleInsight_aidaClient = new WeakMap(), _ConsoleInsight_renderer = new WeakMap(), _ConsoleInsight_state = new WeakMap(), _ConsoleInsight_referenceDetailsRef = new WeakMap(), _ConsoleInsight_areReferenceDetailsOpen = new WeakMap(), _ConsoleInsight_selectedRating = new WeakMap(), _ConsoleInsight_consoleInsightsEnabledSetting = new WeakMap(), _ConsoleInsight_aidaAvailability = new WeakMap(), _ConsoleInsight_boundOnAidaAvailabilityChange = new WeakMap(), _ConsoleInsight_marked = new WeakMap(), _ConsoleInsight_instances = new WeakSet(), _ConsoleInsight_citationClickHandler = function _ConsoleInsight_citationClickHandler(index) {
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type !== "insight" /* State.INSIGHT */ || !__classPrivateFieldGet(this, _ConsoleInsight_referenceDetailsRef, "f").value) {
        return;
    }
    const areDetailsAlreadyExpanded = __classPrivateFieldGet(this, _ConsoleInsight_referenceDetailsRef, "f").value.open;
    __classPrivateFieldSet(this, _ConsoleInsight_areReferenceDetailsOpen, true, "f");
    __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_render).call(this);
    const highlightedElement = __classPrivateFieldGet(this, _ConsoleInsight_shadow, "f").querySelector(`.sources-list x-link[data-index="${index}"]`);
    if (highlightedElement) {
        UI.UIUtils.runCSSAnimationOnce(highlightedElement, 'highlighted');
        if (areDetailsAlreadyExpanded) {
            highlightedElement.scrollIntoView({ behavior: 'auto' });
            highlightedElement.focus();
        }
        else { // Wait for the details element to open before scrolling.
            __classPrivateFieldGet(this, _ConsoleInsight_referenceDetailsRef, "f").value.addEventListener('transitionend', () => {
                highlightedElement.scrollIntoView({ behavior: 'auto' });
                highlightedElement.focus();
            }, { once: true });
        }
    }
}, _ConsoleInsight_getStateFromAidaAvailability = function _ConsoleInsight_getStateFromAidaAvailability() {
    switch (__classPrivateFieldGet(this, _ConsoleInsight_aidaAvailability, "f")) {
        case "available" /* Host.AidaClient.AidaAccessPreconditions.AVAILABLE */: {
            // Allows skipping the consent reminder if the user enabled the feature via settings in the current session
            const skipReminder = Common.Settings.Settings.instance()
                .createSetting('console-insights-skip-reminder', false, "Session" /* Common.Settings.SettingStorageType.SESSION */)
                .get();
            return {
                type: "loading" /* State.LOADING */,
                consentOnboardingCompleted: __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_getOnboardingCompletedSetting).call(this).get() || skipReminder,
            };
        }
        case "no-account-email" /* Host.AidaClient.AidaAccessPreconditions.NO_ACCOUNT_EMAIL */:
            return {
                type: "not-logged-in" /* State.NOT_LOGGED_IN */,
            };
        case "sync-is-paused" /* Host.AidaClient.AidaAccessPreconditions.SYNC_IS_PAUSED */:
            return {
                type: "sync-is-paused" /* State.SYNC_IS_PAUSED */,
            };
        case "no-internet" /* Host.AidaClient.AidaAccessPreconditions.NO_INTERNET */:
            return {
                type: "offline" /* State.OFFLINE */,
            };
    }
}, _ConsoleInsight_getConsoleInsightsEnabledSetting = function _ConsoleInsight_getConsoleInsightsEnabledSetting() {
    try {
        return Common.Settings.moduleSetting('console-insights-enabled');
    }
    catch {
        return;
    }
}, _ConsoleInsight_getOnboardingCompletedSetting = function _ConsoleInsight_getOnboardingCompletedSetting() {
    return Common.Settings.Settings.instance().createLocalSetting('console-insights-onboarding-finished', false);
}, _ConsoleInsight_onAidaAvailabilityChange = async function _ConsoleInsight_onAidaAvailabilityChange() {
    const currentAidaAvailability = await Host.AidaClient.AidaClient.checkAccessPreconditions();
    if (currentAidaAvailability !== __classPrivateFieldGet(this, _ConsoleInsight_aidaAvailability, "f")) {
        __classPrivateFieldSet(this, _ConsoleInsight_aidaAvailability, currentAidaAvailability, "f");
        __classPrivateFieldSet(this, _ConsoleInsight_state, __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_getStateFromAidaAvailability).call(this), "f");
        void __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_generateInsightIfNeeded).call(this);
    }
}, _ConsoleInsight_onConsoleInsightsSettingChanged = function _ConsoleInsight_onConsoleInsightsSettingChanged() {
    if (__classPrivateFieldGet(this, _ConsoleInsight_consoleInsightsEnabledSetting, "f")?.getIfNotDisabled() === true) {
        __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_getOnboardingCompletedSetting).call(this).set(true);
    }
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type === "setting-is-not-true" /* State.SETTING_IS_NOT_TRUE */ &&
        __classPrivateFieldGet(this, _ConsoleInsight_consoleInsightsEnabledSetting, "f")?.getIfNotDisabled() === true) {
        __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_transitionTo).call(this, {
            type: "loading" /* State.LOADING */,
            consentOnboardingCompleted: true,
        });
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightsOptInTeaserConfirmedInSettings);
        void __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_generateInsightIfNeeded).call(this);
    }
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type === "consent-reminder" /* State.CONSENT_REMINDER */ &&
        __classPrivateFieldGet(this, _ConsoleInsight_consoleInsightsEnabledSetting, "f")?.getIfNotDisabled() === false) {
        __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_transitionTo).call(this, {
            type: "loading" /* State.LOADING */,
            consentOnboardingCompleted: false,
        });
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightsReminderTeaserAbortedInSettings);
        void __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_generateInsightIfNeeded).call(this);
    }
}, _ConsoleInsight_transitionTo = function _ConsoleInsight_transitionTo(newState) {
    const previousState = __classPrivateFieldGet(this, _ConsoleInsight_state, "f");
    __classPrivateFieldSet(this, _ConsoleInsight_state, newState, "f");
    __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_render).call(this);
    if (newState.type !== previousState.type) {
        __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_focusHeader).call(this);
    }
}, _ConsoleInsight_generateInsightIfNeeded = async function _ConsoleInsight_generateInsightIfNeeded() {
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type !== "loading" /* State.LOADING */) {
        return;
    }
    const blockedByAge = Root.Runtime.hostConfig.aidaAvailability?.blockedByAge === true;
    if (__classPrivateFieldGet(this, _ConsoleInsight_consoleInsightsEnabledSetting, "f")?.getIfNotDisabled() !== true || blockedByAge) {
        __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_transitionTo).call(this, {
            type: "setting-is-not-true" /* State.SETTING_IS_NOT_TRUE */,
        });
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightsOptInTeaserShown);
        return;
    }
    if (!__classPrivateFieldGet(this, _ConsoleInsight_state, "f").consentOnboardingCompleted) {
        const { sources, isPageReloadRecommended } = await __classPrivateFieldGet(this, _ConsoleInsight_promptBuilder, "f").buildPrompt();
        __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_transitionTo).call(this, {
            type: "consent-reminder" /* State.CONSENT_REMINDER */,
            sources,
            isPageReloadRecommended,
        });
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightsReminderTeaserShown);
        return;
    }
    await __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_generateInsight).call(this);
}, _ConsoleInsight_onClose = function _ConsoleInsight_onClose() {
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type === "consent-reminder" /* State.CONSENT_REMINDER */) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightsReminderTeaserCanceled);
    }
    this.shadowRoot?.addEventListener('animationend', () => {
        this.dispatchEvent(new CloseEvent());
    }, { once: true });
    this.classList.add('closing');
}, _ConsoleInsight_onRating = function _ConsoleInsight_onRating(event) {
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type !== "insight" /* State.INSIGHT */) {
        throw new Error('Unexpected state');
    }
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").metadata?.rpcGlobalId === undefined) {
        throw new Error('RPC Id not in metadata');
    }
    // If it was rated, do not record again.
    if (__classPrivateFieldGet(this, _ConsoleInsight_selectedRating, "f") !== undefined) {
        return;
    }
    __classPrivateFieldSet(this, _ConsoleInsight_selectedRating, event.target.dataset.rating === 'true', "f");
    __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_render).call(this);
    if (__classPrivateFieldGet(this, _ConsoleInsight_selectedRating, "f")) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightRatedPositive);
    }
    else {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightRatedNegative);
    }
    const disallowLogging = Root.Runtime.hostConfig.aidaAvailability?.disallowLogging ?? true;
    void __classPrivateFieldGet(this, _ConsoleInsight_aidaClient, "f").registerClientEvent({
        corresponding_aida_rpc_global_id: __classPrivateFieldGet(this, _ConsoleInsight_state, "f").metadata.rpcGlobalId,
        disable_user_content_logging: disallowLogging,
        do_conversation_client_event: {
            user_feedback: {
                sentiment: __classPrivateFieldGet(this, _ConsoleInsight_selectedRating, "f") ? "POSITIVE" /* Host.AidaClient.Rating.POSITIVE */ : "NEGATIVE" /* Host.AidaClient.Rating.NEGATIVE */,
            },
        },
    });
}, _ConsoleInsight_onReport = function _ConsoleInsight_onReport() {
    Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(REPORT_URL);
}, _ConsoleInsight_onSearch = function _ConsoleInsight_onSearch() {
    const query = __classPrivateFieldGet(this, _ConsoleInsight_promptBuilder, "f").getSearchQuery();
    Host.InspectorFrontendHost.InspectorFrontendHostInstance.openSearchResultsInNewTab(query);
}, _ConsoleInsight_onConsentReminderConfirmed = async function _ConsoleInsight_onConsentReminderConfirmed() {
    __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_getOnboardingCompletedSetting).call(this).set(true);
    __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_transitionTo).call(this, {
        type: "loading" /* State.LOADING */,
        consentOnboardingCompleted: true,
    });
    Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightsReminderTeaserConfirmed);
    await __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_generateInsight).call(this);
}, _ConsoleInsight_insertCitations = function _ConsoleInsight_insertCitations(explanation, metadata) {
    const directCitationUrls = [];
    if (!__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_isSearchRagResponse).call(this, metadata) || !metadata.attributionMetadata) {
        return { explanationWithCitations: explanation, directCitationUrls };
    }
    const { attributionMetadata } = metadata;
    const sortedCitations = attributionMetadata.citations
        .filter(citation => citation.sourceType === Host.AidaClient.CitationSourceType.WORLD_FACTS)
        .sort((a, b) => (b.endIndex || 0) - (a.endIndex || 0));
    let explanationWithCitations = explanation;
    for (const [index, citation] of sortedCitations.entries()) {
        // Matches optional punctuation mark followed by whitespace.
        // Ensures citation is placed at the end of a word.
        const myRegex = /[.,:;!?]*\s/g;
        myRegex.lastIndex = citation.endIndex || 0;
        const result = myRegex.exec(explanationWithCitations);
        if (result && citation.uri) {
            explanationWithCitations = explanationWithCitations.slice(0, result.index) +
                `[^${sortedCitations.length - index}]` + explanationWithCitations.slice(result.index);
            directCitationUrls.push(citation.uri);
        }
    }
    directCitationUrls.reverse();
    return { explanationWithCitations, directCitationUrls };
}, _ConsoleInsight_modifyTokensToHandleCitationsInCode = function _ConsoleInsight_modifyTokensToHandleCitationsInCode(tokens) {
    for (const token of tokens) {
        if (token.type === 'code') {
            // Find and remove '[^number]' from within code block
            const matches = token.text.match(/\[\^\d+\]/g);
            token.text = token.text.replace(/\[\^\d+\]/g, '');
            // And add as a citation for the whole code block
            if (matches?.length) {
                const citations = matches.map(match => {
                    const index = parseInt(match.slice(2, -1), 10);
                    return {
                        index,
                        clickHandler: __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_citationClickHandler).bind(this, index),
                    };
                });
                token.citations = citations;
            }
        }
    }
}, _ConsoleInsight_generateInsight = async function _ConsoleInsight_generateInsight() {
    try {
        for await (const { sources, isPageReloadRecommended, explanation, metadata, completed } of __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_getInsight).call(this)) {
            const { explanationWithCitations, directCitationUrls } = __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_insertCitations).call(this, explanation, metadata);
            const tokens = __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_validateMarkdown).call(this, explanationWithCitations);
            const valid = tokens !== false;
            if (valid) {
                __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_modifyTokensToHandleCitationsInCode).call(this, tokens);
            }
            __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_transitionTo).call(this, {
                type: "insight" /* State.INSIGHT */,
                tokens: valid ? tokens : [],
                validMarkdown: valid,
                explanation,
                sources,
                metadata,
                isPageReloadRecommended,
                completed,
                directCitationUrls,
            });
        }
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightGenerated);
    }
    catch (err) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightErrored);
        if (err.message === 'doAidaConversation timed out' && __classPrivateFieldGet(this, _ConsoleInsight_state, "f").type === "insight" /* State.INSIGHT */) {
            __classPrivateFieldGet(this, _ConsoleInsight_state, "f").timedOut = true;
            __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_transitionTo).call(this, { ...__classPrivateFieldGet(this, _ConsoleInsight_state, "f"), completed: true, timedOut: true });
        }
        else {
            __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_transitionTo).call(this, {
                type: "error" /* State.ERROR */,
                error: err.message,
            });
        }
    }
}, _ConsoleInsight_validateMarkdown = function _ConsoleInsight_validateMarkdown(text) {
    try {
        const tokens = __classPrivateFieldGet(this, _ConsoleInsight_marked, "f").lexer(text);
        for (const token of tokens) {
            __classPrivateFieldGet(this, _ConsoleInsight_renderer, "f").renderToken(token);
        }
        return tokens;
    }
    catch {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightErroredMarkdown);
        return false;
    }
}, _ConsoleInsight_getInsight = async function* _ConsoleInsight_getInsight() {
    const { prompt, sources, isPageReloadRecommended } = await __classPrivateFieldGet(this, _ConsoleInsight_promptBuilder, "f").buildPrompt();
    try {
        for await (const response of __classPrivateFieldGet(this, _ConsoleInsight_aidaClient, "f").doConversation(Host.AidaClient.AidaClient.buildConsoleInsightsRequest(prompt))) {
            yield { sources, isPageReloadRecommended, ...response };
        }
    }
    catch (err) {
        if (err.message === 'Server responded: permission denied') {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightErroredPermissionDenied);
        }
        else if (err.message.startsWith('Cannot send request:')) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightErroredCannotSend);
        }
        else if (err.message.startsWith('Request failed:')) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightErroredRequestFailed);
        }
        else if (err.message.startsWith('Cannot parse chunk:')) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightErroredCannotParseChunk);
        }
        else if (err.message === 'Unknown chunk result') {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightErroredUnknownChunk);
        }
        else if (err.message.startsWith('Server responded:')) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightErroredApi);
        }
        else {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightErroredOther);
        }
        throw err;
    }
}, _ConsoleInsight_onGoToSignIn = function _ConsoleInsight_onGoToSignIn() {
    Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(SIGN_IN_URL);
}, _ConsoleInsight_focusHeader = function _ConsoleInsight_focusHeader() {
    this.addEventListener('animationend', () => {
        __classPrivateFieldGet(this, _ConsoleInsight_shadow, "f").querySelector('header h2')?.focus();
    }, { once: true });
}, _ConsoleInsight_renderSearchButton = function _ConsoleInsight_renderSearchButton() {
    // clang-format off
    return html `<devtools-button
      @click=${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onSearch)}
      class="search-button"
      .data=${{
        variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
        jslogContext: 'search',
    }}
    >
      ${i18nString(UIStrings.search)}
    </devtools-button>`;
    // clang-format on
}, _ConsoleInsight_renderLearnMoreAboutInsights = function _ConsoleInsight_renderLearnMoreAboutInsights() {
    // clang-format off
    return html `<x-link href=${LEARN_MORE_URL} class="link" jslog=${VisualLogging.link('learn-more').track({ click: true })}>
      ${i18nString(UIStrings.learnMore)}
    </x-link>`;
    // clang-format on
}, _ConsoleInsight_maybeRenderSources = function _ConsoleInsight_maybeRenderSources() {
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type !== "insight" /* State.INSIGHT */ || !__classPrivateFieldGet(this, _ConsoleInsight_state, "f").directCitationUrls.length) {
        return Lit.nothing;
    }
    // clang-format off
    return html `
      <ol class="sources-list">
        ${__classPrivateFieldGet(this, _ConsoleInsight_state, "f").directCitationUrls.map((url, index) => html `
          <li>
            <x-link
              href=${url}
              class="link"
              data-index=${index + 1}
              jslog=${VisualLogging.link('references.console-insights').track({ click: true })}
            >
              ${url}
            </x-link>
          </li>
        `)}
      </ol>
    `;
    // clang-format on
}, _ConsoleInsight_maybeRenderRelatedContent = function _ConsoleInsight_maybeRenderRelatedContent() {
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type !== "insight" /* State.INSIGHT */ || !__classPrivateFieldGet(this, _ConsoleInsight_state, "f").metadata.factualityMetadata?.facts.length) {
        return Lit.nothing;
    }
    const directCitationUrls = __classPrivateFieldGet(this, _ConsoleInsight_state, "f").directCitationUrls;
    const relatedUrls = __classPrivateFieldGet(this, _ConsoleInsight_state, "f").metadata.factualityMetadata.facts
        .filter(fact => fact.sourceUri && !directCitationUrls.includes(fact.sourceUri))
        .map(fact => fact.sourceUri);
    const trainingDataUrls = __classPrivateFieldGet(this, _ConsoleInsight_state, "f").metadata.attributionMetadata?.citations
        .filter(citation => citation.sourceType === Host.AidaClient.CitationSourceType.TRAINING_DATA &&
        (citation.uri || citation.repository))
        .map(citation => citation.uri || `https://www.github.com/${citation.repository}`) ||
        [];
    const dedupedTrainingDataUrls = [...new Set(trainingDataUrls.filter(url => !relatedUrls.includes(url) && !directCitationUrls.includes(url)))];
    relatedUrls.push(...dedupedTrainingDataUrls);
    if (relatedUrls.length === 0) {
        return Lit.nothing;
    }
    // clang-format off
    return html `
      ${__classPrivateFieldGet(this, _ConsoleInsight_state, "f").directCitationUrls.length ? html `<h3>${i18nString(UIStrings.relatedContent)}</h3>` : Lit.nothing}
      <ul class="references-list">
        ${relatedUrls.map(relatedUrl => html `
          <li>
            <x-link
              href=${relatedUrl}
              class="link"
              jslog=${VisualLogging.link('references.console-insights').track({ click: true })}
            >
              ${relatedUrl}
            </x-link>
          </li>
        `)}
      </ul>
    `;
    // clang-format on
}, _ConsoleInsight_isSearchRagResponse = function _ConsoleInsight_isSearchRagResponse(metadata) {
    return Boolean(metadata.factualityMetadata?.facts.length);
}, _ConsoleInsight_onToggleReferenceDetails = function _ConsoleInsight_onToggleReferenceDetails() {
    if (__classPrivateFieldGet(this, _ConsoleInsight_referenceDetailsRef, "f").value) {
        __classPrivateFieldSet(this, _ConsoleInsight_areReferenceDetailsOpen, __classPrivateFieldGet(this, _ConsoleInsight_referenceDetailsRef, "f").value.open, "f");
    }
}, _ConsoleInsight_renderMain = function _ConsoleInsight_renderMain() {
    const jslog = `${VisualLogging.section(__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type).track({ resize: true })}`;
    const noLogging = Root.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue ===
        Root.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING;
    // clang-format off
    switch (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type) {
        case "loading" /* State.LOADING */:
            return html `<main jslog=${jslog}>
            <div role="presentation" aria-label="Loading" class="loader" style="clip-path: url('#clipPath');">
              <svg width="100%" height="64">
                <clipPath id="clipPath">
                  <rect x="0" y="0" width="100%" height="16" rx="8"></rect>
                  <rect x="0" y="24" width="100%" height="16" rx="8"></rect>
                  <rect x="0" y="48" width="100%" height="16" rx="8"></rect>
                </clipPath>
              </svg>
            </div>
          </main>`;
        case "insight" /* State.INSIGHT */:
            return html `
        <main jslog=${jslog}>
          ${__classPrivateFieldGet(this, _ConsoleInsight_state, "f").validMarkdown ? html `<devtools-markdown-view
              .data=${{ tokens: __classPrivateFieldGet(this, _ConsoleInsight_state, "f").tokens, renderer: __classPrivateFieldGet(this, _ConsoleInsight_renderer, "f"), animationEnabled: !this.disableAnimations }}>
            </devtools-markdown-view>` : __classPrivateFieldGet(this, _ConsoleInsight_state, "f").explanation}
          ${__classPrivateFieldGet(this, _ConsoleInsight_state, "f").timedOut ? html `<p class="error-message">${i18nString(UIStrings.timedOut)}</p>` : Lit.nothing}
          ${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_isSearchRagResponse).call(this, __classPrivateFieldGet(this, _ConsoleInsight_state, "f").metadata) ? html `
            <details class="references" ${Lit.Directives.ref(__classPrivateFieldGet(this, _ConsoleInsight_referenceDetailsRef, "f"))} @toggle=${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onToggleReferenceDetails)} jslog=${VisualLogging.expand('references').track({ click: true })}>
              <summary>${i18nString(UIStrings.references)}</summary>
              ${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_maybeRenderSources).call(this)}
              ${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_maybeRenderRelatedContent).call(this)}
            </details>
          ` : Lit.nothing}
          <details jslog=${VisualLogging.expand('sources').track({ click: true })}>
            <summary>${i18nString(UIStrings.inputData)}</summary>
            <devtools-console-insight-sources-list .sources=${__classPrivateFieldGet(this, _ConsoleInsight_state, "f").sources} .isPageReloadRecommended=${__classPrivateFieldGet(this, _ConsoleInsight_state, "f").isPageReloadRecommended}>
            </devtools-console-insight-sources-list>
          </details>
          <div class="buttons">
            ${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_renderSearchButton).call(this)}
          </div>
        </main>`;
        case "error" /* State.ERROR */:
            return html `
        <main jslog=${jslog}>
          <div class="error">${i18nString(UIStrings.errorBody)}</div>
        </main>`;
        case "consent-reminder" /* State.CONSENT_REMINDER */:
            return html `
          <main class="reminder-container" jslog=${jslog}>
            <h3>Things to consider</h3>
            <div class="reminder-items">
              <div>
                <devtools-icon .data=${{
                iconName: 'google',
                width: 'var(--sys-size-8)',
                height: 'var(--sys-size-8)',
            }}>
                </devtools-icon>
              </div>
              <div>The console message, associated stack trace, related source code, and the associated network headers are sent to Google to generate explanations. ${noLogging
                ? 'The content you submit and that is generated by this feature will not be used to improve Google’s AI models.'
                : 'This data may be seen by human reviewers to improve this feature. Avoid sharing sensitive or personal information.'}
              </div>
              <div>
                <devtools-icon .data=${{
                iconName: 'policy',
                width: 'var(--sys-size-8)',
                height: 'var(--sys-size-8)',
            }}>
                </devtools-icon>
              </div>
              <div>Use of this feature is subject to the <x-link
                  href=${TERMS_OF_SERVICE_URL}
                  class="link"
                  jslog=${VisualLogging.link('terms-of-service.console-insights').track({ click: true })}>
                Google Terms of Service
                </x-link> and <x-link
                  href=${PRIVACY_POLICY_URL}
                  class="link"
                  jslog=${VisualLogging.link('privacy-policy.console-insights').track({ click: true })}>
                Google Privacy Policy
                </x-link>
              </div>
              <div>
                <devtools-icon .data=${{
                iconName: 'warning',
                width: 'var(--sys-size-8)',
                height: 'var(--sys-size-8)',
            }}>
                </devtools-icon>
              </div>
              <div>
                <x-link
                  href=${CODE_SNIPPET_WARNING_URL}
                  class="link"
                  jslog=${VisualLogging.link('code-snippets-explainer.console-insights').track({ click: true })}
                >Use generated code snippets with caution</x-link>
              </div>
            </div>
          </main>
        `;
        case "setting-is-not-true" /* State.SETTING_IS_NOT_TRUE */: {
            const settingsLink = html `<button
            class="link" role="link"
            jslog=${VisualLogging.action('open-ai-settings').track({ click: true })}
            @click=${() => {
                Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightsOptInTeaserSettingsLinkClicked);
                void UI.ViewManager.ViewManager.instance().showView('chrome-ai');
            }}
          >${i18nString(UIStrings.settingsLink)}</button>`;
            return html `<main class="opt-in-teaser" jslog=${jslog}>
          <div class="badge">
            <devtools-icon .data=${{
                iconName: 'lightbulb-spark',
                width: 'var(--sys-size-8)',
                height: 'var(--sys-size-8)',
            }}>
            </devtools-icon>
          </div>
          <div>
            ${i18nTemplate(UIStrings.turnOnInSettings, { PH1: settingsLink })} ${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_renderLearnMoreAboutInsights).call(this)}
          </div>
        </main>`;
        }
        case "not-logged-in" /* State.NOT_LOGGED_IN */:
        case "sync-is-paused" /* State.SYNC_IS_PAUSED */:
            return html `
          <main jslog=${jslog}>
            <div class="error">${Root.Runtime.hostConfig.isOffTheRecord ? i18nString(UIStrings.notAvailableInIncognitoMode) : i18nString(UIStrings.notLoggedIn)}</div>
          </main>`;
        case "offline" /* State.OFFLINE */:
            return html `
          <main jslog=${jslog}>
            <div class="error">${i18nString(UIStrings.offline)}</div>
          </main>`;
    }
    // clang-format on
}, _ConsoleInsight_renderDisclaimer = function _ConsoleInsight_renderDisclaimer() {
    const noLogging = Root.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue ===
        Root.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING;
    // clang-format off
    return html `<span>
      AI tools may generate inaccurate info that doesn't represent Google's views. ${noLogging
        ? 'The content you submit and that is generated by this feature will not be used to improve Google’s AI models.'
        : 'Data sent to Google may be seen by human reviewers to improve this feature.'} <button class="link" role="link" @click=${() => UI.ViewManager.ViewManager.instance().showView('chrome-ai')}
                jslog=${VisualLogging.action('open-ai-settings').track({ click: true })}>
        Open settings
      </button> or <x-link href=${LEARN_MORE_URL}
          class="link" jslog=${VisualLogging.link('learn-more').track({ click: true })}>
        learn more
      </x-link>
    </span>`;
    // clang-format on
}, _ConsoleInsight_renderFooter = function _ConsoleInsight_renderFooter() {
    const disclaimer = __classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_renderDisclaimer).call(this);
    // clang-format off
    switch (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type) {
        case "loading" /* State.LOADING */:
        case "setting-is-not-true" /* State.SETTING_IS_NOT_TRUE */:
            return Lit.nothing;
        case "error" /* State.ERROR */:
        case "offline" /* State.OFFLINE */:
            return html `<footer jslog=${VisualLogging.section('footer')}>
          <div class="disclaimer">
            ${disclaimer}
          </div>
        </footer>`;
        case "not-logged-in" /* State.NOT_LOGGED_IN */:
        case "sync-is-paused" /* State.SYNC_IS_PAUSED */:
            if (Root.Runtime.hostConfig.isOffTheRecord) {
                return Lit.nothing;
            }
            return html `<footer jslog=${VisualLogging.section('footer')}>
        <div class="filler"></div>
        <div>
          <devtools-button
            @click=${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onGoToSignIn)}
            .data=${{
                variant: "primary" /* Buttons.Button.Variant.PRIMARY */,
                jslogContext: 'update-settings',
            }}
          >
            ${UIStrings.signIn}
          </devtools-button>
        </div>
      </footer>`;
        case "consent-reminder" /* State.CONSENT_REMINDER */:
            return html `<footer jslog=${VisualLogging.section('footer')}>
          <div class="filler"></div>
          <div class="buttons">
            <devtools-button
              @click=${() => {
                Host.userMetrics.actionTaken(Host.UserMetrics.Action.InsightsReminderTeaserSettingsLinkClicked);
                void UI.ViewManager.ViewManager.instance().showView('chrome-ai');
            }}
              .data=${{
                variant: "tonal" /* Buttons.Button.Variant.TONAL */,
                jslogContext: 'settings',
                title: 'Settings',
            }}
            >
              Settings
            </devtools-button>
            <devtools-button
              class='continue-button'
              @click=${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onConsentReminderConfirmed)}
              .data=${{
                variant: "primary" /* Buttons.Button.Variant.PRIMARY */,
                jslogContext: 'continue',
                title: 'continue',
            }}
              >
              Continue
            </devtools-button>
          </div>
        </footer>`;
        case "insight" /* State.INSIGHT */:
            return html `<footer jslog=${VisualLogging.section('footer')}>
        <div class="disclaimer">
          ${disclaimer}
        </div>
        <div class="filler"></div>
        <div class="rating">
          <devtools-button
            data-rating=${'true'}
            .data=${{
                variant: "icon_toggle" /* Buttons.Button.Variant.ICON_TOGGLE */,
                size: "SMALL" /* Buttons.Button.Size.SMALL */,
                iconName: 'thumb-up',
                toggledIconName: 'thumb-up',
                toggleOnClick: false,
                toggleType: "primary-toggle" /* Buttons.Button.ToggleType.PRIMARY */,
                disabled: __classPrivateFieldGet(this, _ConsoleInsight_selectedRating, "f") !== undefined,
                toggled: __classPrivateFieldGet(this, _ConsoleInsight_selectedRating, "f") === true,
                title: i18nString(UIStrings.goodResponse),
                jslogContext: 'thumbs-up',
            }}
            @click=${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onRating)}
          ></devtools-button>
          <devtools-button
            data-rating=${'false'}
            .data=${{
                variant: "icon_toggle" /* Buttons.Button.Variant.ICON_TOGGLE */,
                size: "SMALL" /* Buttons.Button.Size.SMALL */,
                iconName: 'thumb-down',
                toggledIconName: 'thumb-down',
                toggleOnClick: false,
                toggleType: "primary-toggle" /* Buttons.Button.ToggleType.PRIMARY */,
                disabled: __classPrivateFieldGet(this, _ConsoleInsight_selectedRating, "f") !== undefined,
                toggled: __classPrivateFieldGet(this, _ConsoleInsight_selectedRating, "f") === false,
                title: i18nString(UIStrings.badResponse),
                jslogContext: 'thumbs-down',
            }}
            @click=${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onRating)}
          ></devtools-button>
          <devtools-button
            .data=${{
                variant: "icon" /* Buttons.Button.Variant.ICON */,
                size: "SMALL" /* Buttons.Button.Size.SMALL */,
                iconName: 'report',
                title: i18nString(UIStrings.report),
                jslogContext: 'report',
            }}
            @click=${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onReport)}
          ></devtools-button>
        </div>

      </footer>`;
    }
    // clang-format on
}, _ConsoleInsight_getHeader = function _ConsoleInsight_getHeader() {
    switch (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type) {
        case "not-logged-in" /* State.NOT_LOGGED_IN */:
        case "sync-is-paused" /* State.SYNC_IS_PAUSED */:
            return i18nString(UIStrings.signInToUse);
        case "offline" /* State.OFFLINE */:
            return i18nString(UIStrings.offlineHeader);
        case "loading" /* State.LOADING */:
            return i18nString(UIStrings.generating);
        case "insight" /* State.INSIGHT */:
            return i18nString(UIStrings.insight);
        case "error" /* State.ERROR */:
            return i18nString(UIStrings.error);
        case "consent-reminder" /* State.CONSENT_REMINDER */:
            return 'Understand console messages with AI';
        case "setting-is-not-true" /* State.SETTING_IS_NOT_TRUE */:
            return ''; // not reached
    }
}, _ConsoleInsight_renderSpinner = function _ConsoleInsight_renderSpinner() {
    // clang-format off
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type === "insight" /* State.INSIGHT */ && !__classPrivateFieldGet(this, _ConsoleInsight_state, "f").completed) {
        return html `<devtools-spinner></devtools-spinner>`;
    }
    return Lit.nothing;
    // clang-format on
}, _ConsoleInsight_renderHeader = function _ConsoleInsight_renderHeader() {
    if (__classPrivateFieldGet(this, _ConsoleInsight_state, "f").type === "setting-is-not-true" /* State.SETTING_IS_NOT_TRUE */) {
        return Lit.nothing;
    }
    const hasIcon = __classPrivateFieldGet(this, _ConsoleInsight_state, "f").type === "consent-reminder" /* State.CONSENT_REMINDER */;
    // clang-format off
    return html `
      <header>
        ${hasIcon ? html `
          <div class="header-icon-container">
            <devtools-icon .data=${{
        iconName: 'lightbulb-spark',
        width: '18px',
        height: '18px',
    }}>
            </devtools-icon>
          </div>`
        : Lit.nothing}
        <div class="filler">
          <h2 tabindex="-1">
            ${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_getHeader).call(this)}
          </h2>
          ${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_renderSpinner).call(this)}
        </div>
        <div class="close-button">
          <devtools-button
            .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        iconName: 'cross',
        title: i18nString(UIStrings.closeInsight),
    }}
            jslog=${VisualLogging.close().track({ click: true })}
            @click=${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_onClose)}
          ></devtools-button>
        </div>
      </header>
    `;
    // clang-format on
}, _ConsoleInsight_render = function _ConsoleInsight_render() {
    // clang-format off
    render(html `
      <style>${styles}</style>
      <style>${Input.checkboxStyles}</style>
      <div class="wrapper" jslog=${VisualLogging.pane('console-insights').track({ resize: true })}>
        <div class="animation-wrapper">
          ${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_renderHeader).call(this)}
          ${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_renderMain).call(this)}
          ${__classPrivateFieldGet(this, _ConsoleInsight_instances, "m", _ConsoleInsight_renderFooter).call(this)}
        </div>
      </div>
    `, __classPrivateFieldGet(this, _ConsoleInsight_shadow, "f"), {
        host: this,
    });
    // clang-format on
    if (__classPrivateFieldGet(this, _ConsoleInsight_referenceDetailsRef, "f").value) {
        __classPrivateFieldGet(this, _ConsoleInsight_referenceDetailsRef, "f").value.open = __classPrivateFieldGet(this, _ConsoleInsight_areReferenceDetailsOpen, "f");
    }
};
class ConsoleInsightSourcesList extends HTMLElement {
    constructor() {
        super(...arguments);
        _ConsoleInsightSourcesList_instances.add(this);
        _ConsoleInsightSourcesList_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ConsoleInsightSourcesList_sources.set(this, []);
        _ConsoleInsightSourcesList_isPageReloadRecommended.set(this, false);
    }
    set sources(values) {
        __classPrivateFieldSet(this, _ConsoleInsightSourcesList_sources, values, "f");
        __classPrivateFieldGet(this, _ConsoleInsightSourcesList_instances, "m", _ConsoleInsightSourcesList_render).call(this);
    }
    set isPageReloadRecommended(isPageReloadRecommended) {
        __classPrivateFieldSet(this, _ConsoleInsightSourcesList_isPageReloadRecommended, isPageReloadRecommended, "f");
        __classPrivateFieldGet(this, _ConsoleInsightSourcesList_instances, "m", _ConsoleInsightSourcesList_render).call(this);
    }
}
_ConsoleInsightSourcesList_shadow = new WeakMap(), _ConsoleInsightSourcesList_sources = new WeakMap(), _ConsoleInsightSourcesList_isPageReloadRecommended = new WeakMap(), _ConsoleInsightSourcesList_instances = new WeakSet(), _ConsoleInsightSourcesList_render = function _ConsoleInsightSourcesList_render() {
    // clang-format off
    render(html `
      <style>${listStyles}</style>
      <style>${Input.checkboxStyles}</style>
      <ul>
        ${Directives.repeat(__classPrivateFieldGet(this, _ConsoleInsightSourcesList_sources, "f"), item => item.value, item => {
        return html `<li><x-link class="link" title="${localizeType(item.type)} ${i18nString(UIStrings.opensInNewTab)}" href="data:text/plain;charset=utf-8,${encodeURIComponent(item.value)}" jslog=${VisualLogging.link('source-' + item.type).track({ click: true })}>
            <devtools-icon name="open-externally"></devtools-icon>
            ${localizeType(item.type)}
          </x-link></li>`;
    })}
        ${__classPrivateFieldGet(this, _ConsoleInsightSourcesList_isPageReloadRecommended, "f") ? html `<li class="source-disclaimer">
          <devtools-icon name="warning"></devtools-icon>
          ${i18nString(UIStrings.reloadRecommendation)}</li>` : Lit.nothing}
      </ul>
    `, __classPrivateFieldGet(this, _ConsoleInsightSourcesList_shadow, "f"), {
        host: this,
    });
    // clang-format on
};
customElements.define('devtools-console-insight', ConsoleInsight);
customElements.define('devtools-console-insight-sources-list', ConsoleInsightSourcesList);
//# sourceMappingURL=ConsoleInsight.js.map