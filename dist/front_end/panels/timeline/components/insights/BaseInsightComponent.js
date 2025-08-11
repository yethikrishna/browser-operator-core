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
var _BaseInsightComponent_instances, _BaseInsightComponent_insightsAskAiEnabled, _BaseInsightComponent_selected, _BaseInsightComponent_model, _BaseInsightComponent_parsedTrace, _BaseInsightComponent_fieldMetrics, _BaseInsightComponent_initialOverlays, _BaseInsightComponent_dispatchInsightToggle, _BaseInsightComponent_renderHoverIcon, _BaseInsightComponent_handleHeaderKeyDown, _BaseInsightComponent_render, _BaseInsightComponent_getEstimatedSavingsTextParts, _BaseInsightComponent_getEstimatedSavingsAriaLabel, _BaseInsightComponent_getEstimatedSavingsString, _BaseInsightComponent_askAIButtonClick, _BaseInsightComponent_canShowAskAI, _BaseInsightComponent_renderInsightContent, _BaseInsightComponent_renderWithContent;
import '../../../../ui/components/markdown_view/markdown_view.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Root from '../../../../core/root/root.js';
import * as Buttons from '../../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../../ui/components/helpers/helpers.js';
import * as UI from '../../../../ui/legacy/legacy.js';
import * as Lit from '../../../../ui/lit/lit.js';
import * as VisualLogging from '../../../../ui/visual_logging/visual_logging.js';
import { md } from '../../utils/Helpers.js';
import * as Utils from '../../utils/utils.js';
import baseInsightComponentStyles from './baseInsightComponent.css.js';
import * as SidebarInsight from './SidebarInsight.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Text to tell the user the estimated time or size savings for this insight. "&" means "and" - space is limited to prefer abbreviated terms if possible. Text will still fit if not short, it just won't look very good, so using no abbreviations is fine if necessary.
     * @example {401 ms} PH1
     * @example {112 kB} PH1
     */
    estimatedSavings: 'Est savings: {PH1}',
    /**
     * @description Text to tell the user the estimated time and size savings for this insight. "&" means "and", "Est" means "Estimated" - space is limited to prefer abbreviated terms if possible. Text will still fit if not short, it just won't look very good, so using no abbreviations is fine if necessary.
     * @example {401 ms} PH1
     * @example {112 kB} PH2
     */
    estimatedSavingsTimingAndBytes: 'Est savings: {PH1} & {PH2}',
    /**
     * @description Text to tell the user the estimated time savings for this insight that is used for screen readers.
     * @example {401 ms} PH1
     * @example {112 kB} PH1
     */
    estimatedSavingsAriaTiming: 'Estimated savings for this insight: {PH1}',
    /**
     * @description Text to tell the user the estimated size savings for this insight that is used for screen readers. Value is in terms of "transfer size", aka encoded/compressed data length.
     * @example {401 ms} PH1
     * @example {112 kB} PH1
     */
    estimatedSavingsAriaBytes: 'Estimated savings for this insight: {PH1} transfer size',
    /**
     * @description Text to tell the user the estimated time and size savings for this insight that is used for screen readers.
     * @example {401 ms} PH1
     * @example {112 kB} PH2
     */
    estimatedSavingsTimingAndBytesAria: 'Estimated savings for this insight: {PH1} and {PH2} transfer size',
    /**
     * @description Used for screen-readers as a label on the button to expand an insight to view details
     * @example {LCP breakdown} PH1
     */
    viewDetails: 'View details for {PH1} insight.',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/insights/BaseInsightComponent.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class BaseInsightComponent extends HTMLElement {
    constructor() {
        super(...arguments);
        _BaseInsightComponent_instances.add(this);
        this.shadow = this.attachShadow({ mode: 'open' });
        // This flag tracks if the Insights AI feature is enabled within Chrome for
        // the active user.
        _BaseInsightComponent_insightsAskAiEnabled.set(this, false);
        _BaseInsightComponent_selected.set(this, false);
        _BaseInsightComponent_model.set(this, null);
        _BaseInsightComponent_parsedTrace.set(this, null);
        _BaseInsightComponent_fieldMetrics.set(this, null);
        this.data = {
            bounds: null,
            insightSetKey: null,
        };
        this.sharedTableState = {
            selectedRowEl: null,
            selectionIsSticky: false,
        };
        _BaseInsightComponent_initialOverlays.set(this, null);
    }
    get model() {
        return __classPrivateFieldGet(this, _BaseInsightComponent_model, "f");
    }
    scheduleRender() {
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_render));
    }
    // Insights that do support the AI feature can override this to return true.
    // The "Ask AI" button will only be shown for an Insight if this
    // is true and if the feature has been enabled by the user and they meet the
    // requirements to use AI.
    hasAskAiSupport() {
        return false;
    }
    connectedCallback() {
        this.setAttribute('jslog', `${VisualLogging.section(`timeline.insights.${this.internalName}`)}`);
        // Used for unit test purposes when querying the DOM.
        this.dataset.insightName = this.internalName;
        const { devToolsAiAssistancePerformanceAgent } = Root.Runtime.hostConfig;
        __classPrivateFieldSet(this, _BaseInsightComponent_insightsAskAiEnabled, Boolean(devToolsAiAssistancePerformanceAgent?.enabled && devToolsAiAssistancePerformanceAgent?.insightsEnabled), "f");
    }
    set selected(selected) {
        if (!__classPrivateFieldGet(this, _BaseInsightComponent_selected, "f") && selected) {
            const options = this.getOverlayOptionsForInitialOverlays();
            this.dispatchEvent(new SidebarInsight.InsightProvideOverlays(this.getInitialOverlays(), options));
        }
        __classPrivateFieldSet(this, _BaseInsightComponent_selected, selected, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_render));
    }
    get selected() {
        return __classPrivateFieldGet(this, _BaseInsightComponent_selected, "f");
    }
    set model(model) {
        __classPrivateFieldSet(this, _BaseInsightComponent_model, model, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_render));
    }
    set insightSetKey(insightSetKey) {
        this.data.insightSetKey = insightSetKey;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_render));
    }
    get bounds() {
        return this.data.bounds;
    }
    set bounds(bounds) {
        this.data.bounds = bounds;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_render));
    }
    set parsedTrace(parsedTrace) {
        __classPrivateFieldSet(this, _BaseInsightComponent_parsedTrace, parsedTrace, "f");
    }
    set fieldMetrics(fieldMetrics) {
        __classPrivateFieldSet(this, _BaseInsightComponent_fieldMetrics, fieldMetrics, "f");
    }
    get fieldMetrics() {
        return __classPrivateFieldGet(this, _BaseInsightComponent_fieldMetrics, "f");
    }
    getOverlayOptionsForInitialOverlays() {
        return { updateTraceWindow: true };
    }
    /**
     * Replaces the initial insight overlays with the ones provided.
     *
     * If `overlays` is null, reverts back to the initial overlays.
     *
     * This allows insights to provide an initial set of overlays,
     * and later temporarily replace all of those insights with a different set.
     * This enables the hover/click table interactions.
     */
    toggleTemporaryOverlays(overlays, options) {
        if (!__classPrivateFieldGet(this, _BaseInsightComponent_selected, "f")) {
            return;
        }
        if (!overlays) {
            this.dispatchEvent(new SidebarInsight.InsightProvideOverlays(this.getInitialOverlays(), this.getOverlayOptionsForInitialOverlays()));
            return;
        }
        this.dispatchEvent(new SidebarInsight.InsightProvideOverlays(overlays, options));
    }
    getInitialOverlays() {
        if (__classPrivateFieldGet(this, _BaseInsightComponent_initialOverlays, "f")) {
            return __classPrivateFieldGet(this, _BaseInsightComponent_initialOverlays, "f");
        }
        __classPrivateFieldSet(this, _BaseInsightComponent_initialOverlays, this.createOverlays(), "f");
        return __classPrivateFieldGet(this, _BaseInsightComponent_initialOverlays, "f");
    }
    createOverlays() {
        return this.model?.createOverlays?.() ?? [];
    }
    getEstimatedSavingsTime() {
        return null;
    }
    getEstimatedSavingsBytes() {
        return this.model?.wastedBytes ?? null;
    }
}
_BaseInsightComponent_insightsAskAiEnabled = new WeakMap(), _BaseInsightComponent_selected = new WeakMap(), _BaseInsightComponent_model = new WeakMap(), _BaseInsightComponent_parsedTrace = new WeakMap(), _BaseInsightComponent_fieldMetrics = new WeakMap(), _BaseInsightComponent_initialOverlays = new WeakMap(), _BaseInsightComponent_instances = new WeakSet(), _BaseInsightComponent_dispatchInsightToggle = function _BaseInsightComponent_dispatchInsightToggle() {
    if (__classPrivateFieldGet(this, _BaseInsightComponent_selected, "f")) {
        this.dispatchEvent(new SidebarInsight.InsightDeactivated());
        UI.Context.Context.instance().setFlavor(Utils.InsightAIContext.ActiveInsight, null);
        return;
    }
    if (!this.data.insightSetKey || !this.model) {
        // Shouldn't happen, but needed to satisfy TS.
        return;
    }
    this.sharedTableState.selectedRowEl?.classList.remove('selected');
    this.sharedTableState.selectedRowEl = null;
    this.sharedTableState.selectionIsSticky = false;
    this.dispatchEvent(new SidebarInsight.InsightActivated(this.model, this.data.insightSetKey));
}, _BaseInsightComponent_renderHoverIcon = function _BaseInsightComponent_renderHoverIcon(insightIsActive) {
    // clang-format off
    const containerClasses = Lit.Directives.classMap({
        'insight-hover-icon': true,
        active: insightIsActive,
    });
    return html `
      <div class=${containerClasses} inert>
        <devtools-button .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        iconName: 'chevron-down',
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
    }}
      ></devtools-button>
      </div>

    `;
    // clang-format on
}, _BaseInsightComponent_handleHeaderKeyDown = function _BaseInsightComponent_handleHeaderKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_dispatchInsightToggle).call(this);
    }
}, _BaseInsightComponent_render = function _BaseInsightComponent_render() {
    if (!this.model) {
        return;
    }
    __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_renderWithContent).call(this);
}, _BaseInsightComponent_getEstimatedSavingsTextParts = function _BaseInsightComponent_getEstimatedSavingsTextParts() {
    const savingsTime = this.getEstimatedSavingsTime();
    const savingsBytes = this.getEstimatedSavingsBytes();
    let timeString, bytesString;
    if (savingsTime) {
        timeString = i18n.TimeUtilities.millisToString(savingsTime);
    }
    if (savingsBytes) {
        bytesString = i18n.ByteUtilities.bytesToString(savingsBytes);
    }
    return {
        timeString,
        bytesString,
    };
}, _BaseInsightComponent_getEstimatedSavingsAriaLabel = function _BaseInsightComponent_getEstimatedSavingsAriaLabel() {
    const { bytesString, timeString } = __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_getEstimatedSavingsTextParts).call(this);
    if (timeString && bytesString) {
        return i18nString(UIStrings.estimatedSavingsTimingAndBytesAria, {
            PH1: timeString,
            PH2: bytesString,
        });
    }
    if (timeString) {
        return i18nString(UIStrings.estimatedSavingsAriaTiming, {
            PH1: timeString,
        });
    }
    if (bytesString) {
        return i18nString(UIStrings.estimatedSavingsAriaBytes, {
            PH1: bytesString,
        });
    }
    return null;
}, _BaseInsightComponent_getEstimatedSavingsString = function _BaseInsightComponent_getEstimatedSavingsString() {
    const { bytesString, timeString } = __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_getEstimatedSavingsTextParts).call(this);
    if (timeString && bytesString) {
        return i18nString(UIStrings.estimatedSavingsTimingAndBytes, {
            PH1: timeString,
            PH2: bytesString,
        });
    }
    if (timeString) {
        return i18nString(UIStrings.estimatedSavings, {
            PH1: timeString,
        });
    }
    if (bytesString) {
        return i18nString(UIStrings.estimatedSavings, {
            PH1: bytesString,
        });
    }
    return null;
}, _BaseInsightComponent_askAIButtonClick = function _BaseInsightComponent_askAIButtonClick() {
    if (!__classPrivateFieldGet(this, _BaseInsightComponent_model, "f") || !__classPrivateFieldGet(this, _BaseInsightComponent_parsedTrace, "f") || !this.data.bounds) {
        return;
    }
    // matches the one in ai_assistance-meta.ts
    const actionId = 'drjones.performance-insight-context';
    if (!UI.ActionRegistry.ActionRegistry.instance().hasAction(actionId)) {
        return;
    }
    const context = new Utils.InsightAIContext.ActiveInsight(__classPrivateFieldGet(this, _BaseInsightComponent_model, "f"), this.data.bounds, __classPrivateFieldGet(this, _BaseInsightComponent_parsedTrace, "f"));
    UI.Context.Context.instance().setFlavor(Utils.InsightAIContext.ActiveInsight, context);
    // Trigger the AI Assistance panel to open.
    const action = UI.ActionRegistry.ActionRegistry.instance().getAction(actionId);
    void action.execute();
}, _BaseInsightComponent_canShowAskAI = function _BaseInsightComponent_canShowAskAI() {
    const aiDisabledByEnterprisePolicy = Root.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue ===
        Root.Runtime.GenAiEnterprisePolicyValue.DISABLE;
    return !aiDisabledByEnterprisePolicy && __classPrivateFieldGet(this, _BaseInsightComponent_insightsAskAiEnabled, "f") && this.hasAskAiSupport();
}, _BaseInsightComponent_renderInsightContent = function _BaseInsightComponent_renderInsightContent(insightModel) {
    if (!__classPrivateFieldGet(this, _BaseInsightComponent_selected, "f")) {
        return Lit.nothing;
    }
    const ariaLabel = `Ask AI about ${insightModel.title} insight`;
    // Only render the insight body content if it is selected.
    // To avoid re-rendering triggered from elsewhere.
    const content = this.renderContent();
    // clang-format off
    return html `
      <div class="insight-body">
        <div class="insight-description">${md(insightModel.description)}</div>
        <div class="insight-content">${content}</div>
        ${__classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_canShowAskAI).call(this) ? html `
          <div class="ask-ai-btn-wrap">
            <devtools-button class="ask-ai"
              .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}
              .iconName=${'smart-assistant'}
              data-insights-ask-ai
              jslog=${VisualLogging.action(`timeline.insight-ask-ai.${this.internalName}`).track({ click: true })}
              @click=${__classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_askAIButtonClick)}
              aria-label=${ariaLabel}
            >Ask AI</devtools-button>
          </div>
        ` : Lit.nothing}
      </div>`;
    // clang-format on
}, _BaseInsightComponent_renderWithContent = function _BaseInsightComponent_renderWithContent() {
    if (!__classPrivateFieldGet(this, _BaseInsightComponent_model, "f")) {
        Lit.render(Lit.nothing, this.shadow, { host: this });
        return;
    }
    const containerClasses = Lit.Directives.classMap({
        insight: true,
        closed: !__classPrivateFieldGet(this, _BaseInsightComponent_selected, "f"),
    });
    const estimatedSavingsString = __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_getEstimatedSavingsString).call(this);
    const estimatedSavingsAriaLabel = __classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_getEstimatedSavingsAriaLabel).call(this);
    let ariaLabel = `${i18nString(UIStrings.viewDetails, { PH1: __classPrivateFieldGet(this, _BaseInsightComponent_model, "f").title })}`;
    if (estimatedSavingsAriaLabel) {
        // space prefix is deliberate to add a gap after the view details text
        ariaLabel += ` ${estimatedSavingsAriaLabel}`;
    }
    // clang-format off
    const output = html `
      <style>${baseInsightComponentStyles}</style>
      <div class=${containerClasses}>
        <header @click=${__classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_dispatchInsightToggle)}
          @keydown=${__classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_handleHeaderKeyDown)}
          jslog=${VisualLogging.action(`timeline.toggle-insight.${this.internalName}`).track({ click: true })}
          data-insight-header-title=${__classPrivateFieldGet(this, _BaseInsightComponent_model, "f")?.title}
          tabIndex="0"
          role="button"
          aria-expanded=${__classPrivateFieldGet(this, _BaseInsightComponent_selected, "f")}
          aria-label=${ariaLabel}
        >
          ${__classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_renderHoverIcon).call(this, __classPrivateFieldGet(this, _BaseInsightComponent_selected, "f"))}
          <h3 class="insight-title">${__classPrivateFieldGet(this, _BaseInsightComponent_model, "f")?.title}</h3>
          ${estimatedSavingsString ?
        html `
            <slot name="insight-savings" class="insight-savings">
              <span title=${estimatedSavingsAriaLabel ?? ''}>${estimatedSavingsString}</span>
            </slot>
          </div>`
        : Lit.nothing}
        </header>
        ${__classPrivateFieldGet(this, _BaseInsightComponent_instances, "m", _BaseInsightComponent_renderInsightContent).call(this, __classPrivateFieldGet(this, _BaseInsightComponent_model, "f"))}
      </div>
    `;
    // clang-format on
    Lit.render(output, this.shadow, { host: this });
    if (__classPrivateFieldGet(this, _BaseInsightComponent_selected, "f")) {
        requestAnimationFrame(() => requestAnimationFrame(() => this.scrollIntoViewIfNeeded()));
    }
};
// So we can use the TypeScript BaseInsight class without getting warnings
// about litTagName. Every child should overwrite this.
BaseInsightComponent.litTagName = Lit.StaticHtml.literal ``;
//# sourceMappingURL=BaseInsightComponent.js.map