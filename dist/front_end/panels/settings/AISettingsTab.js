// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _AISettingsTab_instances, _AISettingsTab_shadow, _AISettingsTab_consoleInsightsSetting, _AISettingsTab_aiAnnotationsSetting, _AISettingsTab_aiAssistanceSetting, _AISettingsTab_aidaAvailability, _AISettingsTab_boundOnAidaAvailabilityChange, _AISettingsTab_settingToParams, _AISettingsTab_initSettings, _AISettingsTab_onAidaAvailabilityChange, _AISettingsTab_getAiAssistanceSettingDescription, _AISettingsTab_getAiAssistanceSettingInfo, _AISettingsTab_expandSetting, _AISettingsTab_toggleSetting, _AISettingsTab_renderSharedDisclaimerItem, _AISettingsTab_renderSharedDisclaimer, _AISettingsTab_renderSettingItem, _AISettingsTab_renderSetting, _AISettingsTab_renderDisabledExplainer;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Root from '../../core/root/root.js';
import * as AiAssistanceModel from '../../models/ai_assistance/ai_assistance.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as Input from '../../ui/components/input/input.js';
import * as LegacyWrapper from '../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as Switch from '../../ui/components/switch/switch.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import aiSettingsTabStyles from './aiSettingsTab.css.js';
const { html, Directives: { ifDefined, classMap } } = Lit;
const UIStrings = {
    /**
     *@description Header text for for a list of things to consider in the context of generative AI features
     */
    boostYourProductivity: 'Boost your productivity with AI',
    /**
     *@description Text announcing a list of facts to consider (when using a GenAI feature)
     */
    thingsToConsider: 'Things to consider',
    /**
     *@description Text describing a fact to consider when using AI features
     */
    experimentalFeatures: 'These features use generative AI and may provide inaccurate or offensive information that doesn’t represent Google’s views',
    /**
     *@description Text describing a fact to consider when using AI features
     */
    sendsDataToGoogle: 'These features send relevant data to Google. Google collects this data and feedback to improve its products and services with the help of human reviewers. Avoid sharing sensitive or personal information.',
    /**
     *@description Text describing a fact to consider when using AI features
     */
    sendsDataToGoogleNoLogging: 'Your content will not be used by human reviewers to improve AI. Your organization may change these settings at any time.',
    /**
     *@description Text describing a fact to consider when using AI features
     */
    dataCollection: 'Depending on your region, Google may refrain from data collection',
    /**
     *@description Text describing a fact to consider when using AI features
     */
    dataCollectionNoLogging: 'Depending on your Google account management and/or region, Google may refrain from data collection',
    /**
     *@description Text describing the 'Console Insights' feature
     */
    helpUnderstandConsole: 'Helps you understand and fix console warnings and errors',
    /**
     *@description Text describing the 'Console Insights' feature
     */
    getAIAnnotationsSuggestions: 'Get AI suggestions for performance panel annotations',
    /**
     *@description Label for a button to expand an accordion
     */
    showMore: 'Show more',
    /**
     *@description Label for a button to collapse an accordion
     */
    showLess: 'Show less',
    /**
     *@description Header for a list of feature attributes. 'When (the feature is turned) on, you'll be able to …'
     */
    whenOn: 'When on',
    /**
     *@description Description of the console insights feature
     */
    explainConsole: 'Get explanations for console warnings and errors',
    /**
     *@description Description of the console insights feature ('these issues' refers to console warnings and errors)
     */
    receiveSuggestions: 'Receive suggestions and code samples to address these issues',
    /**
     *@description Explainer for which data is being sent by the console insights feature
     */
    consoleInsightsSendsData: 'The console message, associated stack trace, related source code, and the associated network headers are sent to Google to generate explanations. This data may be seen by human reviewers to improve this feature.',
    /**
     *@description Explainer for which data is being sent by the console insights feature
     */
    consoleInsightsSendsDataNoLogging: 'The console message, associated stack trace, related source code, and the associated network headers are sent to Google to generate explanations. This data will not be used to improve Google’s AI models.',
    /**
     *@description Reference to the terms of service and privacy notice
     *@example {Google Terms of Service} PH1
     *@example {Privacy Notice} PH2
     */
    termsOfServicePrivacyNotice: 'Use of these features is subject to the {PH1} and {PH2}',
    /**
     *@description Text describing the 'AI assistance' feature
     */
    helpUnderstandStyling: 'Get help with understanding CSS styles',
    /**
     *@description Text describing the 'AI assistance' feature
     */
    helpUnderstandStylingAndNetworkRequest: 'Get help with understanding CSS styles, and network requests',
    /**
     *@description Text describing the 'AI assistance' feature
     */
    helpUnderstandStylingNetworkAndFile: 'Get help with understanding CSS styles, network requests, and files',
    /**
     *@description Text describing the 'AI assistance' feature
     */
    helpUnderstandStylingNetworkPerformanceAndFile: 'Get help with understanding CSS styles, network requests, performance, and files',
    /**
     *@description Text which is a hyperlink to more documentation
     */
    learnMore: 'Learn more',
    /**
     *@description Description of the AI assistance feature
     */
    explainStyling: 'Understand CSS styles with AI-powered insights',
    /**
     *@description Description of the AI assistance feature
     */
    explainStylingAndNetworkRequest: 'Understand CSS styles, and network activity with AI-powered insights',
    /**
     *@description Description of the AI assistance feature
     */
    explainStylingNetworkAndFile: 'Understand CSS styles, network activity, and file origins with AI-powered insights',
    /**
     *@description Description of the AI assistance feature
     */
    explainStylingNetworkPerformanceAndFile: 'Understand CSS styles, network activity, performance bottlenecks, and file origins with AI-powered insights',
    /**
     *@description Description of the AI assistance feature
     */
    receiveStylingSuggestions: 'Improve your development workflow with contextual explanations and suggestions',
    /**
     *@description Explainer for which data is being sent by the AI assistance feature
     */
    freestylerSendsData: 'Any user query and data the inspected page can access via Web APIs, network requests, files, and performance traces are sent to Google to generate explanations. This data may be seen by human reviewers to improve this feature. Don’t use on pages with personal or sensitive information.',
    /**
     *@description Explainer for which data is being sent by the AI assistance feature
     */
    freestylerSendsDataNoLogging: 'Any user query and data the inspected page can access via Web APIs, network requests, files, and performance traces are sent to Google to generate explanations. This data will not be used to improve Google’s AI models.',
    /**
     *@description Explainer for which data is being sent by the AI generated annotations feature
     */
    generatedAiAnnotationsSendData: 'Your performance trace is sent to Google to generate an explanation. This data will be used to improve Google’s AI models.',
    /**
     *@description Explainer for which data is being sent by the AI assistance feature
     */
    generatedAiAnnotationsSendDataNoLogging: 'Your performance trace is sent to Google to generate an explanation. This data will not be used to improve Google’s AI models.',
    /**
     *@description Label for a link to the terms of service
     */
    termsOfService: 'Google Terms of Service',
    /**
     *@description Label for a link to the privacy notice
     */
    privacyNotice: 'Google Privacy Policy',
    /**
     *@description Label for a toggle to enable the Console Insights feature
     */
    enableConsoleInsights: 'Enable `Console insights`',
    /**
     *@description Label for a toggle to enable the AI assistance feature
     */
    enableAiAssistance: 'Enable AI assistance',
    /**
     *@description Label for a toggle to enable the AI assistance feature
     */
    enableAiSuggestedAnnotations: 'Enable AI suggestions for performance panel annotations',
};
const str_ = i18n.i18n.registerUIStrings('panels/settings/AISettingsTab.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AISettingsTab extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super();
        _AISettingsTab_instances.add(this);
        _AISettingsTab_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _AISettingsTab_consoleInsightsSetting.set(this, void 0);
        _AISettingsTab_aiAnnotationsSetting.set(this, void 0);
        _AISettingsTab_aiAssistanceSetting.set(this, void 0);
        _AISettingsTab_aidaAvailability.set(this, "no-account-email" /* Host.AidaClient.AidaAccessPreconditions.NO_ACCOUNT_EMAIL */);
        _AISettingsTab_boundOnAidaAvailabilityChange.set(this, void 0);
        // Setting to parameters needed to display it in the UI.
        // To display a a setting, it needs to be added to this map.
        _AISettingsTab_settingToParams.set(this, new Map());
        try {
            __classPrivateFieldSet(this, _AISettingsTab_consoleInsightsSetting, Common.Settings.Settings.instance().moduleSetting('console-insights-enabled'), "f");
        }
        catch {
            __classPrivateFieldSet(this, _AISettingsTab_consoleInsightsSetting, undefined, "f");
        }
        try {
            __classPrivateFieldSet(this, _AISettingsTab_aiAssistanceSetting, Common.Settings.Settings.instance().moduleSetting('ai-assistance-enabled'), "f");
        }
        catch {
            __classPrivateFieldSet(this, _AISettingsTab_aiAssistanceSetting, undefined, "f");
        }
        if (Root.Runtime.hostConfig.devToolsAiGeneratedTimelineLabels?.enabled) {
            // Get an existing setting or, if it does not exist, create a new one.
            __classPrivateFieldSet(this, _AISettingsTab_aiAnnotationsSetting, Common.Settings.Settings.instance().createSetting('ai-annotations-enabled', false), "f");
        }
        __classPrivateFieldSet(this, _AISettingsTab_boundOnAidaAvailabilityChange, __classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_onAidaAvailabilityChange).bind(this), "f");
        __classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_initSettings).call(this);
    }
    connectedCallback() {
        Host.AidaClient.HostConfigTracker.instance().addEventListener("aidaAvailabilityChanged" /* Host.AidaClient.Events.AIDA_AVAILABILITY_CHANGED */, __classPrivateFieldGet(this, _AISettingsTab_boundOnAidaAvailabilityChange, "f"));
        void __classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_onAidaAvailabilityChange).call(this);
    }
    disconnectedCallback() {
        Host.AidaClient.HostConfigTracker.instance().removeEventListener("aidaAvailabilityChanged" /* Host.AidaClient.Events.AIDA_AVAILABILITY_CHANGED */, __classPrivateFieldGet(this, _AISettingsTab_boundOnAidaAvailabilityChange, "f"));
    }
    async render() {
        const disabledReasons = AiAssistanceModel.getDisabledReasons(__classPrivateFieldGet(this, _AISettingsTab_aidaAvailability, "f"));
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        Lit.render(html `
      <style>${Input.checkboxStyles}</style>
      <style>${aiSettingsTabStyles}</style>
      <div class="settings-container-wrapper" jslog=${VisualLogging.pane('chrome-ai')}>
        ${__classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_renderSharedDisclaimer).call(this)}
        ${__classPrivateFieldGet(this, _AISettingsTab_settingToParams, "f").size > 0 ? html `
          ${disabledReasons.length ? __classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_renderDisabledExplainer).call(this, disabledReasons) : Lit.nothing}
          <div class="settings-container">
            ${__classPrivateFieldGet(this, _AISettingsTab_settingToParams, "f").keys().map(setting => __classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_renderSetting).call(this, setting))}
          </div>
        ` : Lit.nothing}
      </div>
    `, __classPrivateFieldGet(this, _AISettingsTab_shadow, "f"), { host: this });
        // clang-format on
    }
}
_AISettingsTab_shadow = new WeakMap(), _AISettingsTab_consoleInsightsSetting = new WeakMap(), _AISettingsTab_aiAnnotationsSetting = new WeakMap(), _AISettingsTab_aiAssistanceSetting = new WeakMap(), _AISettingsTab_aidaAvailability = new WeakMap(), _AISettingsTab_boundOnAidaAvailabilityChange = new WeakMap(), _AISettingsTab_settingToParams = new WeakMap(), _AISettingsTab_instances = new WeakSet(), _AISettingsTab_initSettings = function _AISettingsTab_initSettings() {
    const noLogging = Root.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue ===
        Root.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING;
    if (__classPrivateFieldGet(this, _AISettingsTab_consoleInsightsSetting, "f")) {
        const consoleInsightsData = {
            settingName: i18n.i18n.lockedString('Console Insights'),
            iconName: 'lightbulb-spark',
            settingDescription: i18nString(UIStrings.helpUnderstandConsole),
            enableSettingText: i18nString(UIStrings.enableConsoleInsights),
            settingItems: [
                { iconName: 'lightbulb', text: i18nString(UIStrings.explainConsole) },
                { iconName: 'code', text: i18nString(UIStrings.receiveSuggestions) }
            ],
            toConsiderSettingItems: [{
                    iconName: 'google',
                    text: noLogging ? i18nString(UIStrings.consoleInsightsSendsDataNoLogging) :
                        i18nString(UIStrings.consoleInsightsSendsData)
                }],
            learnMoreLink: { url: 'https://goo.gle/devtools-console-messages-ai', linkJSLogContext: 'learn-more.console-insights' },
            settingExpandState: {
                isSettingExpanded: false,
                expandSettingJSLogContext: 'console-insights.accordion',
            },
        };
        __classPrivateFieldGet(this, _AISettingsTab_settingToParams, "f").set(__classPrivateFieldGet(this, _AISettingsTab_consoleInsightsSetting, "f"), consoleInsightsData);
    }
    if (__classPrivateFieldGet(this, _AISettingsTab_aiAssistanceSetting, "f")) {
        const aiAssistanceData = {
            settingName: i18n.i18n.lockedString('AI assistance'),
            iconName: 'smart-assistant',
            settingDescription: __classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_getAiAssistanceSettingDescription).call(this),
            enableSettingText: i18nString(UIStrings.enableAiAssistance),
            settingItems: [
                { iconName: 'info', text: __classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_getAiAssistanceSettingInfo).call(this) },
                { iconName: 'pen-spark', text: i18nString(UIStrings.receiveStylingSuggestions) }
            ],
            toConsiderSettingItems: [{
                    iconName: 'google',
                    text: noLogging ? i18nString(UIStrings.freestylerSendsDataNoLogging) :
                        i18nString(UIStrings.freestylerSendsData)
                }],
            learnMoreLink: { url: 'https://goo.gle/devtools-ai-assistance', linkJSLogContext: 'learn-more.ai-assistance' },
            settingExpandState: {
                isSettingExpanded: false,
                expandSettingJSLogContext: 'freestyler.accordion',
            },
        };
        __classPrivateFieldGet(this, _AISettingsTab_settingToParams, "f").set(__classPrivateFieldGet(this, _AISettingsTab_aiAssistanceSetting, "f"), aiAssistanceData);
    }
    if (__classPrivateFieldGet(this, _AISettingsTab_aiAnnotationsSetting, "f")) {
        const aiAssistanceData = {
            settingName: i18n.i18n.lockedString('Auto annotations'),
            iconName: 'pen-spark',
            settingDescription: i18nString(UIStrings.getAIAnnotationsSuggestions),
            enableSettingText: i18nString(UIStrings.enableAiSuggestedAnnotations),
            settingItems: [
                { iconName: 'pen-spark', text: i18nString(UIStrings.getAIAnnotationsSuggestions) },
            ],
            toConsiderSettingItems: [{
                    iconName: 'google',
                    text: noLogging ? i18nString(UIStrings.generatedAiAnnotationsSendDataNoLogging) :
                        i18nString(UIStrings.generatedAiAnnotationsSendData)
                }],
            learnMoreLink: {
                url: 'https://developer.chrome.com/docs/devtools/performance/annotations#auto-annotations',
                linkJSLogContext: 'learn-more.auto-annotations'
            },
            settingExpandState: {
                isSettingExpanded: false,
                expandSettingJSLogContext: 'freestyler.accordion',
            },
        };
        __classPrivateFieldGet(this, _AISettingsTab_settingToParams, "f").set(__classPrivateFieldGet(this, _AISettingsTab_aiAnnotationsSetting, "f"), aiAssistanceData);
    }
}, _AISettingsTab_onAidaAvailabilityChange = async function _AISettingsTab_onAidaAvailabilityChange() {
    const currentAidaAvailability = await Host.AidaClient.AidaClient.checkAccessPreconditions();
    if (currentAidaAvailability !== __classPrivateFieldGet(this, _AISettingsTab_aidaAvailability, "f")) {
        __classPrivateFieldSet(this, _AISettingsTab_aidaAvailability, currentAidaAvailability, "f");
        void this.render();
    }
}, _AISettingsTab_getAiAssistanceSettingDescription = function _AISettingsTab_getAiAssistanceSettingDescription() {
    const { hostConfig } = Root.Runtime;
    if (hostConfig.devToolsAiAssistancePerformanceAgent?.enabled) {
        return i18nString(UIStrings.helpUnderstandStylingNetworkPerformanceAndFile);
    }
    if (hostConfig.devToolsAiAssistanceFileAgent?.enabled) {
        return i18nString(UIStrings.helpUnderstandStylingNetworkAndFile);
    }
    if (hostConfig.devToolsAiAssistanceNetworkAgent?.enabled) {
        return i18nString(UIStrings.helpUnderstandStylingAndNetworkRequest);
    }
    return i18nString(UIStrings.helpUnderstandStyling);
}, _AISettingsTab_getAiAssistanceSettingInfo = function _AISettingsTab_getAiAssistanceSettingInfo() {
    const { hostConfig } = Root.Runtime;
    if (hostConfig.devToolsAiAssistancePerformanceAgent?.enabled) {
        return i18nString(UIStrings.explainStylingNetworkPerformanceAndFile);
    }
    if (hostConfig.devToolsAiAssistanceFileAgent?.enabled) {
        return i18nString(UIStrings.explainStylingNetworkAndFile);
    }
    if (hostConfig.devToolsAiAssistanceNetworkAgent?.enabled) {
        return i18nString(UIStrings.explainStylingAndNetworkRequest);
    }
    return i18nString(UIStrings.explainStyling);
}, _AISettingsTab_expandSetting = function _AISettingsTab_expandSetting(setting) {
    const settingData = __classPrivateFieldGet(this, _AISettingsTab_settingToParams, "f").get(setting);
    if (!settingData) {
        return;
    }
    settingData.settingExpandState.isSettingExpanded = !settingData.settingExpandState.isSettingExpanded;
    void this.render();
}, _AISettingsTab_toggleSetting = function _AISettingsTab_toggleSetting(setting, ev) {
    // If the switch is being clicked, there is both a click- and a
    // change-event. Aborting on click avoids running this method twice.
    if (ev.target instanceof Switch.Switch.Switch && ev.type !== Switch.Switch.SwitchChangeEvent.eventName) {
        return;
    }
    const settingData = __classPrivateFieldGet(this, _AISettingsTab_settingToParams, "f").get(setting);
    if (!settingData) {
        return;
    }
    const oldSettingValue = setting.get();
    setting.set(!oldSettingValue);
    if (!oldSettingValue && !settingData.settingExpandState.isSettingExpanded) {
        settingData.settingExpandState.isSettingExpanded = true;
    }
    // Custom settings logic
    if (setting.name === 'console-insights-enabled') {
        if (oldSettingValue) {
            // If the user turns the feature off, we want them to go through the full onboarding flow should they later turn
            // the feature on again. We achieve this by resetting the onboardig setting.
            Common.Settings.Settings.instance()
                .createLocalSetting('console-insights-onboarding-finished', false)
                .set(false);
        }
        else {
            // Allows skipping the consent reminder if the user enabled the feature via settings in the current session
            Common.Settings.Settings.instance()
                .createSetting('console-insights-skip-reminder', true, "Session" /* Common.Settings.SettingStorageType.SESSION */)
                .set(true);
        }
    }
    else if (setting.name === 'ai-assistance-enabled' && !setting.get()) {
        // If the "AI Assistance" is toggled off, we remove all the history entries related to the feature.
        void AiAssistanceModel.AiHistoryStorage.instance().deleteAll();
    }
    void this.render();
}, _AISettingsTab_renderSharedDisclaimerItem = function _AISettingsTab_renderSharedDisclaimerItem(icon, text) {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <div>
        <devtools-icon .data=${{
        iconName: icon,
        color: 'var(--icon-default)',
        width: 'var(--sys-size-8)',
        height: 'var(--sys-size-8)',
    }}>
        </devtools-icon>
      </div>
      <div>${text}</div>
    `;
    // clang-format on
}, _AISettingsTab_renderSharedDisclaimer = function _AISettingsTab_renderSharedDisclaimer() {
    const tosLink = UI.XLink.XLink.create('https://policies.google.com/terms', i18nString(UIStrings.termsOfService), undefined, undefined, 'terms-of-service');
    const privacyNoticeLink = UI.XLink.XLink.create('https://policies.google.com/privacy', i18nString(UIStrings.privacyNotice), undefined, undefined, 'privacy-notice');
    const noLogging = Root.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue ===
        Root.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING;
    const bulletPoints = [
        { icon: 'psychiatry', text: i18nString(UIStrings.experimentalFeatures) },
        {
            icon: 'google',
            text: noLogging ? i18nString(UIStrings.sendsDataToGoogleNoLogging) : i18nString(UIStrings.sendsDataToGoogle),
        },
        {
            icon: 'corporate-fare',
            text: noLogging ? i18nString(UIStrings.dataCollectionNoLogging) : i18nString(UIStrings.dataCollection),
        },
        {
            icon: 'policy',
            text: html `${i18n.i18n.getFormatLocalizedString(str_, UIStrings.termsOfServicePrivacyNotice, {
                PH1: tosLink,
                PH2: privacyNoticeLink,
            })}`,
        },
    ];
    return html `
      <div class="shared-disclaimer">
        <h2>${i18nString(UIStrings.boostYourProductivity)}</h2>
        <h3 class="disclaimer-list-header">${i18nString(UIStrings.thingsToConsider)}</h3>
        <div class="disclaimer-list">
          ${bulletPoints.map(item => __classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_renderSharedDisclaimerItem).call(this, item.icon, item.text))}
        </div>
      </div>
    `;
}, _AISettingsTab_renderSettingItem = function _AISettingsTab_renderSettingItem(settingItem) {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <div>
        <devtools-icon .data=${{
        iconName: settingItem.iconName,
        width: 'var(--sys-size-9)',
        height: 'var(--sys-size-9)',
    }}>
        </devtools-icon>
      </div>
      <div class="padded">${settingItem.text}</div>
    `;
    // clang-format on
}, _AISettingsTab_renderSetting = function _AISettingsTab_renderSetting(setting) {
    const settingData = __classPrivateFieldGet(this, _AISettingsTab_settingToParams, "f").get(setting);
    if (!settingData) {
        return Lit.nothing;
    }
    const disabledReasons = AiAssistanceModel.getDisabledReasons(__classPrivateFieldGet(this, _AISettingsTab_aidaAvailability, "f"));
    const isDisabled = disabledReasons.length > 0;
    const disabledReasonsJoined = disabledReasons.join('\n') || undefined;
    const detailsClasses = {
        'whole-row': true,
        open: settingData.settingExpandState.isSettingExpanded,
    };
    const tabindex = settingData.settingExpandState.isSettingExpanded ? '0' : '-1';
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <div class="accordion-header" @click=${__classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_expandSetting).bind(this, setting)}>
        <div class="icon-container centered">
          <devtools-icon name=${settingData.iconName}></devtools-icon>
        </div>
        <div class="setting-card">
          <h2>${settingData.settingName}</h2>
          <div class="setting-description">${settingData.settingDescription}</div>
        </div>
        <div class="dropdown centered">
          <devtools-button
            .data=${{
        title: settingData.settingExpandState.isSettingExpanded ? i18nString(UIStrings.showLess) : i18nString(UIStrings.showMore),
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        iconName: settingData.settingExpandState.isSettingExpanded ? 'chevron-up' : 'chevron-down',
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        jslogContext: settingData.settingExpandState.expandSettingJSLogContext,
    }}
          ></devtools-button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="toggle-container centered"
        title=${ifDefined(disabledReasonsJoined)}
        @click=${__classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_toggleSetting).bind(this, setting)}
      >
        <devtools-switch
          .checked=${Boolean(setting.get()) && !isDisabled}
          .jslogContext=${setting.name || ''}
          .disabled=${isDisabled}
          @switchchange=${__classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_toggleSetting).bind(this, setting)}
          aria-label=${disabledReasonsJoined || settingData.enableSettingText}
        ></devtools-switch>
      </div>
      <div class=${classMap(detailsClasses)}>
        <div class="overflow-hidden">
          <div class="expansion-grid">
            <h3 class="expansion-grid-whole-row">${i18nString(UIStrings.whenOn)}</h3>
            ${settingData.settingItems.map(item => __classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_renderSettingItem).call(this, item))}
            <h3 class="expansion-grid-whole-row">${i18nString(UIStrings.thingsToConsider)}</h3>
            ${settingData.toConsiderSettingItems.map(item => __classPrivateFieldGet(this, _AISettingsTab_instances, "m", _AISettingsTab_renderSettingItem).call(this, item))}
            <div class="expansion-grid-whole-row">
              <x-link
                href=${settingData.learnMoreLink.url}
                class="link"
                tabindex=${tabindex}
                jslog=${VisualLogging.link(settingData.learnMoreLink.linkJSLogContext).track({
        click: true,
    })}
              >${i18nString(UIStrings.learnMore)}</x-link>
            </div>
          </div>
        </div>
      </div>
    `;
    // clang-format on
}, _AISettingsTab_renderDisabledExplainer = function _AISettingsTab_renderDisabledExplainer(disabledReasons) {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <div class="disabled-explainer">
        ${disabledReasons.map(reason => html `
          <div class="disabled-explainer-row">
            <devtools-icon .data=${{
        iconName: 'warning',
        color: 'var(--sys-color-orange)',
        width: 'var(--sys-size-8)',
        height: 'var(--sys-size-8)',
    }}>
            </devtools-icon>
            ${reason}
          </div>
        `)}
      </div>
    `;
    // clang-format on
};
customElements.define('devtools-settings-ai-settings-tab', AISettingsTab);
//# sourceMappingURL=AISettingsTab.js.map