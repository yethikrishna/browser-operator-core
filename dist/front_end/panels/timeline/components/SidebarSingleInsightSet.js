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
var _SidebarSingleInsightSet_instances, _a, _SidebarSingleInsightSet_shadow, _SidebarSingleInsightSet_activeInsightElement, _SidebarSingleInsightSet_data, _SidebarSingleInsightSet_dismissedFieldMismatchNotice, _SidebarSingleInsightSet_activeHighlightTimeout, _SidebarSingleInsightSet_metricIsVisible, _SidebarSingleInsightSet_onClickMetric, _SidebarSingleInsightSet_renderMetricValue, _SidebarSingleInsightSet_getLocalMetrics, _SidebarSingleInsightSet_getFieldMetrics, _SidebarSingleInsightSet_isFieldWorseThanLocal, _SidebarSingleInsightSet_dismissFieldMismatchNotice, _SidebarSingleInsightSet_renderMetrics, _SidebarSingleInsightSet_renderInsights, _SidebarSingleInsightSet_render;
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Root from '../../../core/root/root.js';
import * as CrUXManager from '../../../models/crux-manager/crux-manager.js';
import * as Trace from '../../../models/trace/trace.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import { md } from '../utils/Helpers.js';
import { shouldRenderForCategory } from './insights/Helpers.js';
import * as Insights from './insights/insights.js';
import sidebarSingleInsightSetStyles from './sidebarSingleInsightSet.css.js';
import { determineCompareRating, NumberWithUnit } from './Utils.js';
const { html } = Lit.StaticHtml;
const UIStrings = {
    /**
     *@description title used for a metric value to tell the user about its score classification
     *@example {INP} PH1
     *@example {1.2s} PH2
     *@example {poor} PH3
     */
    metricScore: '{PH1}: {PH2} {PH3} score',
    /**
     *@description title used for a metric value to tell the user that the data is unavailable
     *@example {INP} PH1
     */
    metricScoreUnavailable: '{PH1}: unavailable',
    /**
     * @description Summary text for an expandable dropdown that contains all insights in a passing state.
     * @example {4} PH1
     */
    passedInsights: 'Passed insights ({PH1})',
    /**
     * @description Label denoting that metrics were observed in the field, from real use data (CrUX). Also denotes if from URL or Origin dataset.
     * @example {URL} PH1
     */
    fieldScoreLabel: 'Field ({PH1})',
    /**
     * @description Label for an option that selects the page's specific URL as opposed to it's entire origin/domain.
     */
    urlOption: 'URL',
    /**
     * @description Label for an option that selects the page's entire origin/domain as opposed to it's specific URL.
     */
    originOption: 'Origin',
    /**
     * @description Title for button that closes a warning popup.
     */
    dismissTitle: 'Dismiss',
    /**
     * @description Title shown in a warning dialog when field metrics (collected from real users) is worse than the locally observed metrics.
     */
    fieldMismatchTitle: 'Field & local metrics mismatch',
    /**
     * @description Text shown in a warning dialog when field metrics (collected from real users) is worse than the locally observed metrics.
     * Asks user to use features such as throttling and device emulation.
     */
    fieldMismatchNotice: 'There are many reasons why local and field metrics [may not match](https://web.dev/articles/lab-and-field-data-differences). ' +
        'Adjust [throttling settings and device emulation](https://developer.chrome.com/docs/devtools/device-mode) to analyze traces more similar to the average user\'s environment.',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/SidebarSingleInsightSet.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
/**
 * These are WIP Insights that are only shown if the user has turned on the
 * "enable experimental performance insights" experiment. This is used to enable
 * us to ship incrementally without turning insights on by default for all
 * users. */
const EXPERIMENTAL_INSIGHTS = new Set([]);
/**
 * Every insight (INCLUDING experimental ones).
 *
 * Order does not matter (but keep alphabetized).
 */
const INSIGHT_NAME_TO_COMPONENT = {
    Cache: Insights.Cache.Cache,
    CLSCulprits: Insights.CLSCulprits.CLSCulprits,
    DocumentLatency: Insights.DocumentLatency.DocumentLatency,
    DOMSize: Insights.DOMSize.DOMSize,
    DuplicatedJavaScript: Insights.DuplicatedJavaScript.DuplicatedJavaScript,
    FontDisplay: Insights.FontDisplay.FontDisplay,
    ForcedReflow: Insights.ForcedReflow.ForcedReflow,
    ImageDelivery: Insights.ImageDelivery.ImageDelivery,
    INPBreakdown: Insights.INPBreakdown.INPBreakdown,
    LCPDiscovery: Insights.LCPDiscovery.LCPDiscovery,
    LCPBreakdown: Insights.LCPBreakdown.LCPBreakdown,
    LegacyJavaScript: Insights.LegacyJavaScript.LegacyJavaScript,
    ModernHTTP: Insights.ModernHTTP.ModernHTTP,
    NetworkDependencyTree: Insights.NetworkDependencyTree.NetworkDependencyTree,
    RenderBlocking: Insights.RenderBlocking.RenderBlocking,
    SlowCSSSelector: Insights.SlowCSSSelector.SlowCSSSelector,
    ThirdParties: Insights.ThirdParties.ThirdParties,
    Viewport: Insights.Viewport.Viewport,
};
export class SidebarSingleInsightSet extends HTMLElement {
    constructor() {
        super(...arguments);
        _SidebarSingleInsightSet_instances.add(this);
        _SidebarSingleInsightSet_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _SidebarSingleInsightSet_activeInsightElement.set(this, null);
        _SidebarSingleInsightSet_data.set(this, {
            insights: null,
            insightSetKey: null,
            activeCategory: Trace.Insights.Types.InsightCategory.ALL,
            activeInsight: null,
            parsedTrace: null,
            traceMetadata: null,
        });
        _SidebarSingleInsightSet_dismissedFieldMismatchNotice.set(this, false);
        _SidebarSingleInsightSet_activeHighlightTimeout.set(this, -1);
    }
    set data(data) {
        __classPrivateFieldSet(this, _SidebarSingleInsightSet_data, data, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_render));
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_render).call(this);
    }
    disconnectedCallback() {
        window.clearTimeout(__classPrivateFieldGet(this, _SidebarSingleInsightSet_activeHighlightTimeout, "f"));
    }
    highlightActiveInsight() {
        if (!__classPrivateFieldGet(this, _SidebarSingleInsightSet_activeInsightElement, "f")) {
            return;
        }
        // First clear any existing highlight that is going on.
        __classPrivateFieldGet(this, _SidebarSingleInsightSet_activeInsightElement, "f").removeAttribute('highlight-insight');
        window.clearTimeout(__classPrivateFieldGet(this, _SidebarSingleInsightSet_activeHighlightTimeout, "f"));
        requestAnimationFrame(() => {
            __classPrivateFieldGet(this, _SidebarSingleInsightSet_activeInsightElement, "f")?.setAttribute('highlight-insight', 'true');
            __classPrivateFieldSet(this, _SidebarSingleInsightSet_activeHighlightTimeout, window.setTimeout(() => {
                __classPrivateFieldGet(this, _SidebarSingleInsightSet_activeInsightElement, "f")?.removeAttribute('highlight-insight');
            }, 2000), "f");
        });
    }
    static categorizeInsights(insightSets, insightSetKey, activeCategory) {
        const includeExperimental = Root.Runtime.experiments.isEnabled("timeline-experimental-insights" /* Root.Runtime.ExperimentName.TIMELINE_EXPERIMENTAL_INSIGHTS */);
        const insightSet = insightSets?.get(insightSetKey);
        if (!insightSet) {
            return { shownInsights: [], passedInsights: [] };
        }
        const shownInsights = [];
        const passedInsights = [];
        for (const [name, model] of Object.entries(insightSet.model)) {
            const componentClass = INSIGHT_NAME_TO_COMPONENT[name];
            if (!componentClass) {
                continue;
            }
            if (!includeExperimental && EXPERIMENTAL_INSIGHTS.has(name)) {
                continue;
            }
            if (!model || !shouldRenderForCategory({ activeCategory, insightCategory: model.category })) {
                continue;
            }
            if (model instanceof Error) {
                continue;
            }
            if (model.state === 'pass') {
                passedInsights.push({ componentClass, model });
            }
            else {
                shownInsights.push({ componentClass, model });
            }
        }
        return { shownInsights, passedInsights };
    }
}
_a = SidebarSingleInsightSet, _SidebarSingleInsightSet_shadow = new WeakMap(), _SidebarSingleInsightSet_activeInsightElement = new WeakMap(), _SidebarSingleInsightSet_data = new WeakMap(), _SidebarSingleInsightSet_dismissedFieldMismatchNotice = new WeakMap(), _SidebarSingleInsightSet_activeHighlightTimeout = new WeakMap(), _SidebarSingleInsightSet_instances = new WeakSet(), _SidebarSingleInsightSet_metricIsVisible = function _SidebarSingleInsightSet_metricIsVisible(label) {
    if (__classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").activeCategory === Trace.Insights.Types.InsightCategory.ALL) {
        return true;
    }
    return label === __classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").activeCategory;
}, _SidebarSingleInsightSet_onClickMetric = function _SidebarSingleInsightSet_onClickMetric(traceEvent) {
    this.dispatchEvent(new Insights.EventRef.EventReferenceClick(traceEvent));
}, _SidebarSingleInsightSet_renderMetricValue = function _SidebarSingleInsightSet_renderMetricValue(metric, value, relevantEvent) {
    let valueText;
    let valueDisplay;
    let classification;
    if (value === null) {
        valueText = valueDisplay = '-';
        classification = "unclassified" /* Trace.Handlers.ModelHandlers.PageLoadMetrics.ScoreClassification.UNCLASSIFIED */;
    }
    else if (metric === 'LCP') {
        const micros = value;
        const { text, element } = NumberWithUnit.formatMicroSecondsAsSeconds(micros);
        valueText = text;
        valueDisplay = element;
        classification =
            Trace.Handlers.ModelHandlers.PageLoadMetrics.scoreClassificationForLargestContentfulPaint(micros);
    }
    else if (metric === 'CLS') {
        valueText = valueDisplay = value ? value.toFixed(2) : '0';
        classification = Trace.Handlers.ModelHandlers.LayoutShifts.scoreClassificationForLayoutShift(value);
    }
    else if (metric === 'INP') {
        const micros = value;
        const { text, element } = NumberWithUnit.formatMicroSecondsAsMillisFixed(micros);
        valueText = text;
        valueDisplay = element;
        classification =
            Trace.Handlers.ModelHandlers.UserInteractions.scoreClassificationForInteractionToNextPaint(micros);
    }
    else {
        Platform.TypeScriptUtilities.assertNever(metric, `Unexpected metric ${metric}`);
    }
    // NOTE: it is deliberate to use the same value for the title and
    // aria-label; the aria-label is used to give more context to
    // screen-readers, and the title is to aid users who may not know what
    // the red/orange/green classification is, or those who are unable to
    // easily distinguish the visual colour differences.
    // clang-format off
    const title = value !== null ?
        i18nString(UIStrings.metricScore, { PH1: metric, PH2: valueText, PH3: classification }) :
        i18nString(UIStrings.metricScoreUnavailable, { PH1: metric });
    return __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_metricIsVisible).call(this, metric) ? html `
      <button class="metric"
        @click=${relevantEvent ? __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_onClickMetric).bind(this, relevantEvent) : null}
        title=${title}
        aria-label=${title}
      >
        <div class="metric-value metric-value-${classification}">${valueDisplay}</div>
      </button>
    ` : Lit.nothing;
    // clang-format on
}, _SidebarSingleInsightSet_getLocalMetrics = function _SidebarSingleInsightSet_getLocalMetrics(insightSetKey) {
    const lcp = Trace.Insights.Common.getLCP(__classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").insights, insightSetKey);
    const cls = Trace.Insights.Common.getCLS(__classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").insights, insightSetKey);
    const inp = Trace.Insights.Common.getINP(__classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").insights, insightSetKey);
    return { lcp, cls, inp };
}, _SidebarSingleInsightSet_getFieldMetrics = function _SidebarSingleInsightSet_getFieldMetrics(insightSetKey) {
    const insightSet = __classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").insights?.get(insightSetKey);
    if (!insightSet) {
        return null;
    }
    const fieldMetricsResults = Trace.Insights.Common.getFieldMetricsForInsightSet(insightSet, __classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").traceMetadata, CrUXManager.CrUXManager.instance().getSelectedScope());
    if (!fieldMetricsResults) {
        return null;
    }
    return fieldMetricsResults;
}, _SidebarSingleInsightSet_isFieldWorseThanLocal = function _SidebarSingleInsightSet_isFieldWorseThanLocal(local, field) {
    if (local.lcp !== undefined && field.lcp !== undefined) {
        if (determineCompareRating('LCP', local.lcp, field.lcp) === 'better') {
            return true;
        }
    }
    if (local.inp !== undefined && field.inp !== undefined) {
        if (determineCompareRating('LCP', local.inp, field.inp) === 'better') {
            return true;
        }
    }
    return false;
}, _SidebarSingleInsightSet_dismissFieldMismatchNotice = function _SidebarSingleInsightSet_dismissFieldMismatchNotice() {
    __classPrivateFieldSet(this, _SidebarSingleInsightSet_dismissedFieldMismatchNotice, true, "f");
    __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_render).call(this);
}, _SidebarSingleInsightSet_renderMetrics = function _SidebarSingleInsightSet_renderMetrics(insightSetKey) {
    const local = __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_getLocalMetrics).call(this, insightSetKey);
    const field = __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_getFieldMetrics).call(this, insightSetKey);
    const lcpEl = __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_renderMetricValue).call(this, 'LCP', local.lcp?.value ?? null, local.lcp?.event ?? null);
    const inpEl = __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_renderMetricValue).call(this, 'INP', local.inp?.value ?? null, local.inp?.event ?? null);
    const clsEl = __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_renderMetricValue).call(this, 'CLS', local.cls.value ?? null, local.cls?.worstClusterEvent ?? null);
    const localMetricsTemplateResult = html `
      <div class="metrics-row">
        <span>${lcpEl}</span>
        <span>${inpEl}</span>
        <span>${clsEl}</span>
        <span class="row-label">Local</span>
      </div>
      <span class="row-border"></span>
    `;
    let fieldMetricsTemplateResult;
    if (field) {
        const { lcp, inp, cls } = field;
        const lcpEl = __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_renderMetricValue).call(this, 'LCP', lcp?.value ?? null, null);
        const inpEl = __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_renderMetricValue).call(this, 'INP', inp?.value ?? null, null);
        const clsEl = __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_renderMetricValue).call(this, 'CLS', cls?.value ?? null, null);
        let scope = i18nString(UIStrings.originOption);
        if (lcp?.pageScope === 'url' || inp?.pageScope === 'url') {
            scope = i18nString(UIStrings.urlOption);
        }
        // clang-format off
        fieldMetricsTemplateResult = html `
        <div class="metrics-row">
          <span>${lcpEl}</span>
          <span>${inpEl}</span>
          <span>${clsEl}</span>
          <span class="row-label">${i18nString(UIStrings.fieldScoreLabel, { PH1: scope })}</span>
        </div>
        <span class="row-border"></span>
      `;
        // clang-format on
    }
    const localValues = {
        lcp: local.lcp?.value !== undefined ? Trace.Helpers.Timing.microToMilli(local.lcp.value) : undefined,
        inp: local.inp?.value !== undefined ? Trace.Helpers.Timing.microToMilli(local.inp.value) : undefined,
    };
    const fieldValues = field && {
        lcp: field.lcp?.value !== undefined ? Trace.Helpers.Timing.microToMilli(field.lcp.value) : undefined,
        inp: field.inp?.value !== undefined ? Trace.Helpers.Timing.microToMilli(field.inp.value) : undefined,
    };
    let fieldIsDifferentEl;
    if (!__classPrivateFieldGet(this, _SidebarSingleInsightSet_dismissedFieldMismatchNotice, "f") && fieldValues && __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_isFieldWorseThanLocal).call(this, localValues, fieldValues)) {
        // clang-format off
        fieldIsDifferentEl = html `
        <div class="field-mismatch-notice" jslog=${VisualLogging.section('timeline.insights.field-mismatch')}>
          <h3>${i18nString(UIStrings.fieldMismatchTitle)}</h3>
          <devtools-button
            title=${i18nString(UIStrings.dismissTitle)}
            .iconName=${'cross'}
            .variant=${"icon" /* Buttons.Button.Variant.ICON */}
            .jslogContext=${'timeline.insights.dismiss-field-mismatch'}
            @click=${__classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_dismissFieldMismatchNotice)}
          ></devtools-button>
          <div class="field-mismatch-notice__body">${md(i18nString(UIStrings.fieldMismatchNotice))}</div>
        </div>
      `;
        // clang-format on
    }
    const classes = { metrics: true, 'metrics--field': Boolean(fieldMetricsTemplateResult) };
    const metricsTableEl = html `<div class=${Lit.Directives.classMap(classes)}>
      <div class="metrics-row">
        <span class="metric-label">LCP</span>
        <span class="metric-label">INP</span>
        <span class="metric-label">CLS</span>
        <span class="row-label"></span>
      </div>
      ${localMetricsTemplateResult}
      ${fieldMetricsTemplateResult}
    </div>`;
    return html `
      ${metricsTableEl}
      ${fieldIsDifferentEl}
    `;
}, _SidebarSingleInsightSet_renderInsights = function _SidebarSingleInsightSet_renderInsights(insightSets, insightSetKey) {
    const insightSet = insightSets?.get(insightSetKey);
    if (!insightSet) {
        return Lit.nothing;
    }
    const fieldMetrics = __classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_getFieldMetrics).call(this, insightSetKey);
    const { shownInsights: shownInsightsData, passedInsights: passedInsightsData } = _a.categorizeInsights(insightSets, insightSetKey, __classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").activeCategory);
    const renderInsightComponent = (insightData) => {
        const { componentClass, model } = insightData;
        // clang-format off
        return html `<div>
        <${componentClass.litTagName}
          .selected=${__classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").activeInsight?.model === model}
          ${Lit.Directives.ref(elem => {
            if (__classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").activeInsight?.model === model && elem) {
                __classPrivateFieldSet(this, _SidebarSingleInsightSet_activeInsightElement, elem, "f");
            }
        })}
          .model=${model}
          .bounds=${insightSet.bounds}
          .insightSetKey=${insightSetKey}
          .parsedTrace=${__classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f").parsedTrace}
          .fieldMetrics=${fieldMetrics}>
        </${componentClass.litTagName}>
      </div>`;
        // clang-format on
    };
    const shownInsights = shownInsightsData.map(renderInsightComponent);
    const passedInsights = passedInsightsData.map(renderInsightComponent);
    // clang-format off
    return html `
      ${shownInsights}
      ${passedInsights.length ? html `
        <details class="passed-insights-section">
          <summary>${i18nString(UIStrings.passedInsights, {
        PH1: passedInsights.length,
    })}</summary>
          ${passedInsights}
        </details>
      ` : Lit.nothing}
    `;
    // clang-format on
}, _SidebarSingleInsightSet_render = function _SidebarSingleInsightSet_render() {
    const { insights, insightSetKey, } = __classPrivateFieldGet(this, _SidebarSingleInsightSet_data, "f");
    if (!insights || !insightSetKey) {
        Lit.render(html ``, __classPrivateFieldGet(this, _SidebarSingleInsightSet_shadow, "f"), { host: this });
        return;
    }
    // clang-format off
    Lit.render(html `
      <style>${sidebarSingleInsightSetStyles}</style>
      <div class="navigation">
        ${__classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_renderMetrics).call(this, insightSetKey)}
        ${__classPrivateFieldGet(this, _SidebarSingleInsightSet_instances, "m", _SidebarSingleInsightSet_renderInsights).call(this, insights, insightSetKey)}
        </div>
      `, __classPrivateFieldGet(this, _SidebarSingleInsightSet_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-performance-sidebar-single-navigation', SidebarSingleInsightSet);
//# sourceMappingURL=SidebarSingleInsightSet.js.map