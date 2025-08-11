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
var _SidebarInsightsTab_instances, _SidebarInsightsTab_shadow, _SidebarInsightsTab_parsedTrace, _SidebarInsightsTab_traceMetadata, _SidebarInsightsTab_insights, _SidebarInsightsTab_activeInsight, _SidebarInsightsTab_selectedCategory, _SidebarInsightsTab_selectedInsightSetKey, _SidebarInsightsTab_insightSetToggled, _SidebarInsightsTab_insightSetHovered, _SidebarInsightsTab_insightSetUnhovered, _SidebarInsightsTab_onZoomClick, _SidebarInsightsTab_renderZoomButton, _SidebarInsightsTab_renderDropdownIcon, _SidebarInsightsTab_render;
import './SidebarSingleInsightSet.js';
import * as Trace from '../../../models/trace/trace.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as Utils from '../utils/utils.js';
import * as Insights from './insights/insights.js';
import sidebarInsightsTabStyles from './sidebarInsightsTab.css.js';
const { html } = Lit;
export class SidebarInsightsTab extends HTMLElement {
    constructor() {
        super(...arguments);
        _SidebarInsightsTab_instances.add(this);
        _SidebarInsightsTab_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _SidebarInsightsTab_parsedTrace.set(this, null);
        _SidebarInsightsTab_traceMetadata.set(this, null);
        _SidebarInsightsTab_insights.set(this, null);
        _SidebarInsightsTab_activeInsight.set(this, null);
        _SidebarInsightsTab_selectedCategory.set(this, Trace.Insights.Types.InsightCategory.ALL);
        /**
         * When a trace has sets of insights, we show an accordion with each
         * set within. A set can be specific to a single navigation, or include the
         * beginning of the trace up to the first navigation.
         * You can only have one of these open at any time, and we track it via this ID.
         */
        _SidebarInsightsTab_selectedInsightSetKey.set(this, null);
    }
    // TODO(paulirish): add back a disconnectedCallback() to avoid memory leaks that doesn't cause b/372943062
    set parsedTrace(data) {
        if (data === __classPrivateFieldGet(this, _SidebarInsightsTab_parsedTrace, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _SidebarInsightsTab_parsedTrace, data, "f");
        __classPrivateFieldSet(this, _SidebarInsightsTab_selectedInsightSetKey, null, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_render));
    }
    set traceMetadata(data) {
        if (data === __classPrivateFieldGet(this, _SidebarInsightsTab_traceMetadata, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _SidebarInsightsTab_traceMetadata, data, "f");
        __classPrivateFieldSet(this, _SidebarInsightsTab_selectedInsightSetKey, null, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_render));
    }
    set insights(data) {
        if (data === __classPrivateFieldGet(this, _SidebarInsightsTab_insights, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _SidebarInsightsTab_selectedInsightSetKey, null, "f");
        if (!data || !__classPrivateFieldGet(this, _SidebarInsightsTab_parsedTrace, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _SidebarInsightsTab_insights, new Map(data), "f");
        /** Select the first set. Filtering out trivial sets was done back in {@link Trace.Processor.#computeInsightsForInitialTracePeriod} */
        __classPrivateFieldSet(this, _SidebarInsightsTab_selectedInsightSetKey, [...__classPrivateFieldGet(this, _SidebarInsightsTab_insights, "f").keys()].at(0) ?? null, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_render));
    }
    get activeInsight() {
        return __classPrivateFieldGet(this, _SidebarInsightsTab_activeInsight, "f");
    }
    set activeInsight(active) {
        if (active === __classPrivateFieldGet(this, _SidebarInsightsTab_activeInsight, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _SidebarInsightsTab_activeInsight, active, "f");
        // Only update the insightSetKey if there is an active insight. Otherwise, closing an insight
        // would also collapse the insight set. Usually the proper insight set is already set because
        // the user has it open already in order for this setter to be called, but insights can also
        // be activated by clicking on a insight chip in the Summary panel, which may require opening
        // a different insight set.
        if (__classPrivateFieldGet(this, _SidebarInsightsTab_activeInsight, "f")) {
            __classPrivateFieldSet(this, _SidebarInsightsTab_selectedInsightSetKey, __classPrivateFieldGet(this, _SidebarInsightsTab_activeInsight, "f").insightSetKey, "f");
        }
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_render));
    }
    highlightActiveInsight() {
        if (!__classPrivateFieldGet(this, _SidebarInsightsTab_activeInsight, "f")) {
            return;
        }
        // Find the right set for this insight via the set key.
        const set = __classPrivateFieldGet(this, _SidebarInsightsTab_shadow, "f")?.querySelector(`devtools-performance-sidebar-single-navigation[data-insight-set-key="${__classPrivateFieldGet(this, _SidebarInsightsTab_activeInsight, "f").insightSetKey}"]`);
        if (!set) {
            return;
        }
        set.highlightActiveInsight();
    }
}
_SidebarInsightsTab_shadow = new WeakMap(), _SidebarInsightsTab_parsedTrace = new WeakMap(), _SidebarInsightsTab_traceMetadata = new WeakMap(), _SidebarInsightsTab_insights = new WeakMap(), _SidebarInsightsTab_activeInsight = new WeakMap(), _SidebarInsightsTab_selectedCategory = new WeakMap(), _SidebarInsightsTab_selectedInsightSetKey = new WeakMap(), _SidebarInsightsTab_instances = new WeakSet(), _SidebarInsightsTab_insightSetToggled = function _SidebarInsightsTab_insightSetToggled(id) {
    __classPrivateFieldSet(this, _SidebarInsightsTab_selectedInsightSetKey, __classPrivateFieldGet(this, _SidebarInsightsTab_selectedInsightSetKey, "f") === id ? null : id, "f");
    // Update the active insight set.
    if (__classPrivateFieldGet(this, _SidebarInsightsTab_selectedInsightSetKey, "f") !== __classPrivateFieldGet(this, _SidebarInsightsTab_activeInsight, "f")?.insightSetKey) {
        this.dispatchEvent(new Insights.SidebarInsight.InsightDeactivated());
    }
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_render));
}, _SidebarInsightsTab_insightSetHovered = function _SidebarInsightsTab_insightSetHovered(id) {
    const data = __classPrivateFieldGet(this, _SidebarInsightsTab_insights, "f")?.get(id);
    data && this.dispatchEvent(new Insights.SidebarInsight.InsightSetHovered(data.bounds));
}, _SidebarInsightsTab_insightSetUnhovered = function _SidebarInsightsTab_insightSetUnhovered() {
    this.dispatchEvent(new Insights.SidebarInsight.InsightSetHovered());
}, _SidebarInsightsTab_onZoomClick = function _SidebarInsightsTab_onZoomClick(event, id) {
    event.stopPropagation();
    const data = __classPrivateFieldGet(this, _SidebarInsightsTab_insights, "f")?.get(id);
    if (!data) {
        return;
    }
    this.dispatchEvent(new Insights.SidebarInsight.InsightSetZoom(data.bounds));
}, _SidebarInsightsTab_renderZoomButton = function _SidebarInsightsTab_renderZoomButton(insightSetToggled) {
    const classes = Lit.Directives.classMap({
        'zoom-icon': true,
        active: insightSetToggled,
    });
    // clang-format off
    return html `
    <div class=${classes}>
        <devtools-button .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        iconName: 'center-focus-weak',
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
    }}
      ></devtools-button></div>`;
    // clang-format on
}, _SidebarInsightsTab_renderDropdownIcon = function _SidebarInsightsTab_renderDropdownIcon(insightSetToggled) {
    const containerClasses = Lit.Directives.classMap({
        'dropdown-icon': true,
        active: insightSetToggled,
    });
    // clang-format off
    return html `
      <div class=${containerClasses}>
        <devtools-button .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        iconName: 'chevron-right',
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
    }}
      ></devtools-button></div>
    `;
    // clang-format on
}, _SidebarInsightsTab_render = function _SidebarInsightsTab_render() {
    if (!__classPrivateFieldGet(this, _SidebarInsightsTab_parsedTrace, "f") || !__classPrivateFieldGet(this, _SidebarInsightsTab_insights, "f")) {
        Lit.render(Lit.nothing, __classPrivateFieldGet(this, _SidebarInsightsTab_shadow, "f"), { host: this });
        return;
    }
    const hasMultipleInsightSets = __classPrivateFieldGet(this, _SidebarInsightsTab_insights, "f").size > 1;
    const labels = Utils.Helpers.createUrlLabels([...__classPrivateFieldGet(this, _SidebarInsightsTab_insights, "f").values()].map(({ url }) => url));
    const contents = 
    // clang-format off
    html `
      <style>${sidebarInsightsTabStyles}</style>
      <div class="insight-sets-wrapper">
        ${[...__classPrivateFieldGet(this, _SidebarInsightsTab_insights, "f").values()].map(({ id, url }, index) => {
        const data = {
            insights: __classPrivateFieldGet(this, _SidebarInsightsTab_insights, "f"),
            insightSetKey: id,
            activeCategory: __classPrivateFieldGet(this, _SidebarInsightsTab_selectedCategory, "f"),
            activeInsight: __classPrivateFieldGet(this, _SidebarInsightsTab_activeInsight, "f"),
            parsedTrace: __classPrivateFieldGet(this, _SidebarInsightsTab_parsedTrace, "f"),
            traceMetadata: __classPrivateFieldGet(this, _SidebarInsightsTab_traceMetadata, "f"),
        };
        const contents = html `
            <devtools-performance-sidebar-single-navigation
              data-insight-set-key=${id}
              .data=${data}>
            </devtools-performance-sidebar-single-navigation>
          `;
        if (hasMultipleInsightSets) {
            return html `<details
              ?open=${id === __classPrivateFieldGet(this, _SidebarInsightsTab_selectedInsightSetKey, "f")}
            >
              <summary
                @click=${() => __classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_insightSetToggled).call(this, id)}
                @mouseenter=${() => __classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_insightSetHovered).call(this, id)}
                @mouseleave=${() => __classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_insightSetUnhovered).call(this)}
                title=${url.href}>
                ${__classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_renderDropdownIcon).call(this, id === __classPrivateFieldGet(this, _SidebarInsightsTab_selectedInsightSetKey, "f"))}
                <span>${labels[index]}</span>
                <span class='zoom-button' @click=${(event) => __classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_onZoomClick).call(this, event, id)}>${__classPrivateFieldGet(this, _SidebarInsightsTab_instances, "m", _SidebarInsightsTab_renderZoomButton).call(this, id === __classPrivateFieldGet(this, _SidebarInsightsTab_selectedInsightSetKey, "f"))}</span>
              </summary>
              ${contents}
            </details>`;
        }
        return contents;
    })}
      </div>
    `;
    // clang-format on
    // Insight components contain state, so to prevent insights from previous trace loads breaking things we use the parsedTrace
    // as a render key.
    // Note: newer Lit has `keyed`, but we don't have that, so we do it manually. https://lit.dev/docs/templates/directives/#keyed
    const result = Lit.Directives.repeat([contents], () => __classPrivateFieldGet(this, _SidebarInsightsTab_parsedTrace, "f"), template => template);
    Lit.render(result, __classPrivateFieldGet(this, _SidebarInsightsTab_shadow, "f"), { host: this });
};
customElements.define('devtools-performance-sidebar-insights', SidebarInsightsTab);
//# sourceMappingURL=SidebarInsightsTab.js.map