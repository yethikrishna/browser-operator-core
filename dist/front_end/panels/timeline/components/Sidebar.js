// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _SidebarWidget_instances, _SidebarWidget_tabbedPane, _SidebarWidget_insightsView, _SidebarWidget_annotationsView, _SidebarWidget_insightToRestoreOnOpen, _SidebarWidget_updateAnnotationsCountBadge, _InsightsView_component, _AnnotationsView_component;
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as UI from '../../../ui/legacy/legacy.js';
import { InsightActivated, InsightDeactivated } from './insights/SidebarInsight.js';
import { SidebarAnnotationsTab } from './SidebarAnnotationsTab.js';
import { SidebarInsightsTab } from './SidebarInsightsTab.js';
export class RemoveAnnotation extends Event {
    constructor(removedAnnotation) {
        super(RemoveAnnotation.eventName, { bubbles: true, composed: true });
        this.removedAnnotation = removedAnnotation;
    }
}
RemoveAnnotation.eventName = 'removeannotation';
export class RevealAnnotation extends Event {
    constructor(annotation) {
        super(RevealAnnotation.eventName, { bubbles: true, composed: true });
        this.annotation = annotation;
    }
}
RevealAnnotation.eventName = 'revealannotation';
export var SidebarTabs;
(function (SidebarTabs) {
    SidebarTabs["INSIGHTS"] = "insights";
    SidebarTabs["ANNOTATIONS"] = "annotations";
})(SidebarTabs || (SidebarTabs = {}));
export const DEFAULT_SIDEBAR_TAB = "insights" /* SidebarTabs.INSIGHTS */;
export const DEFAULT_SIDEBAR_WIDTH_PX = 240;
const MIN_SIDEBAR_WIDTH_PX = 170;
export class SidebarWidget extends UI.Widget.VBox {
    constructor() {
        super();
        _SidebarWidget_instances.add(this);
        _SidebarWidget_tabbedPane.set(this, new UI.TabbedPane.TabbedPane());
        _SidebarWidget_insightsView.set(this, new InsightsView());
        _SidebarWidget_annotationsView.set(this, new AnnotationsView());
        /**
         * If the user has an Insight open and then they collapse the sidebar, we
         * deactivate that Insight to avoid it showing overlays etc - as the user has
         * hidden the Sidebar & Insight from view. But we store it because when the
         * user pops the sidebar open, we want to re-activate it.
         */
        _SidebarWidget_insightToRestoreOnOpen.set(this, null);
        this.setMinimumSize(MIN_SIDEBAR_WIDTH_PX, 0);
        __classPrivateFieldGet(this, _SidebarWidget_tabbedPane, "f").appendTab("insights" /* SidebarTabs.INSIGHTS */, 'Insights', __classPrivateFieldGet(this, _SidebarWidget_insightsView, "f"), undefined, undefined, false, false, 0, 'timeline.insights-tab');
        __classPrivateFieldGet(this, _SidebarWidget_tabbedPane, "f").appendTab("annotations" /* SidebarTabs.ANNOTATIONS */, 'Annotations', __classPrivateFieldGet(this, _SidebarWidget_annotationsView, "f"), undefined, undefined, false, false, 1, 'timeline.annotations-tab');
        // Default the selected tab to Insights. In wasShown() we will change this
        // if this is a trace that has no insights.
        __classPrivateFieldGet(this, _SidebarWidget_tabbedPane, "f").selectTab("insights" /* SidebarTabs.INSIGHTS */);
    }
    wasShown() {
        __classPrivateFieldGet(this, _SidebarWidget_tabbedPane, "f").show(this.element);
        __classPrivateFieldGet(this, _SidebarWidget_instances, "m", _SidebarWidget_updateAnnotationsCountBadge).call(this);
        if (__classPrivateFieldGet(this, _SidebarWidget_insightToRestoreOnOpen, "f")) {
            this.element.dispatchEvent(new InsightActivated(__classPrivateFieldGet(this, _SidebarWidget_insightToRestoreOnOpen, "f").model, __classPrivateFieldGet(this, _SidebarWidget_insightToRestoreOnOpen, "f").insightSetKey));
            __classPrivateFieldSet(this, _SidebarWidget_insightToRestoreOnOpen, null, "f");
        }
        // Swap to the Annotations tab if:
        // 1. Insights is currently selected.
        // 2. The Insights tab is disabled (which means we have no insights for this trace)
        if (__classPrivateFieldGet(this, _SidebarWidget_tabbedPane, "f").selectedTabId === "insights" /* SidebarTabs.INSIGHTS */ &&
            __classPrivateFieldGet(this, _SidebarWidget_tabbedPane, "f").tabIsDisabled("insights" /* SidebarTabs.INSIGHTS */)) {
            __classPrivateFieldGet(this, _SidebarWidget_tabbedPane, "f").selectTab("annotations" /* SidebarTabs.ANNOTATIONS */);
        }
    }
    willHide() {
        const currentlyActiveInsight = __classPrivateFieldGet(this, _SidebarWidget_insightsView, "f").getActiveInsight();
        __classPrivateFieldSet(this, _SidebarWidget_insightToRestoreOnOpen, currentlyActiveInsight, "f");
        if (currentlyActiveInsight) {
            this.element.dispatchEvent(new InsightDeactivated());
        }
    }
    setAnnotations(updatedAnnotations, annotationEntryToColorMap) {
        __classPrivateFieldGet(this, _SidebarWidget_annotationsView, "f").setAnnotations(updatedAnnotations, annotationEntryToColorMap);
        __classPrivateFieldGet(this, _SidebarWidget_instances, "m", _SidebarWidget_updateAnnotationsCountBadge).call(this);
    }
    setParsedTrace(parsedTrace, metadata) {
        __classPrivateFieldGet(this, _SidebarWidget_insightsView, "f").setParsedTrace(parsedTrace, metadata);
    }
    setInsights(insights) {
        __classPrivateFieldGet(this, _SidebarWidget_insightsView, "f").setInsights(insights);
        __classPrivateFieldGet(this, _SidebarWidget_tabbedPane, "f").setTabEnabled("insights" /* SidebarTabs.INSIGHTS */, insights !== null && insights.size > 0);
    }
    setActiveInsight(activeInsight, opts) {
        __classPrivateFieldGet(this, _SidebarWidget_insightsView, "f").setActiveInsight(activeInsight, opts);
        if (activeInsight) {
            __classPrivateFieldGet(this, _SidebarWidget_tabbedPane, "f").selectTab("insights" /* SidebarTabs.INSIGHTS */);
        }
    }
}
_SidebarWidget_tabbedPane = new WeakMap(), _SidebarWidget_insightsView = new WeakMap(), _SidebarWidget_annotationsView = new WeakMap(), _SidebarWidget_insightToRestoreOnOpen = new WeakMap(), _SidebarWidget_instances = new WeakSet(), _SidebarWidget_updateAnnotationsCountBadge = function _SidebarWidget_updateAnnotationsCountBadge() {
    const annotations = __classPrivateFieldGet(this, _SidebarWidget_annotationsView, "f").deduplicatedAnnotations();
    __classPrivateFieldGet(this, _SidebarWidget_tabbedPane, "f").setBadge('annotations', annotations.length > 0 ? annotations.length.toString() : null);
};
class InsightsView extends UI.Widget.VBox {
    constructor() {
        super();
        _InsightsView_component.set(this, new SidebarInsightsTab());
        this.element.classList.add('sidebar-insights');
        this.element.appendChild(__classPrivateFieldGet(this, _InsightsView_component, "f"));
    }
    setParsedTrace(parsedTrace, metadata) {
        __classPrivateFieldGet(this, _InsightsView_component, "f").parsedTrace = parsedTrace;
        __classPrivateFieldGet(this, _InsightsView_component, "f").traceMetadata = metadata;
    }
    setInsights(data) {
        __classPrivateFieldGet(this, _InsightsView_component, "f").insights = data;
    }
    getActiveInsight() {
        return __classPrivateFieldGet(this, _InsightsView_component, "f").activeInsight;
    }
    setActiveInsight(active, opts) {
        __classPrivateFieldGet(this, _InsightsView_component, "f").activeInsight = active;
        if (opts.highlight && active) {
            // Wait for the rendering of the component to be done, otherwise we
            // might highlight the wrong insight. The UI needs to be fully
            // re-rendered before we can highlight the newly-expanded insight.
            void RenderCoordinator.done().then(() => {
                __classPrivateFieldGet(this, _InsightsView_component, "f").highlightActiveInsight();
            });
        }
    }
}
_InsightsView_component = new WeakMap();
class AnnotationsView extends UI.Widget.VBox {
    constructor() {
        super();
        _AnnotationsView_component.set(this, new SidebarAnnotationsTab());
        this.element.classList.add('sidebar-annotations');
        __classPrivateFieldGet(this, _AnnotationsView_component, "f").show(this.element);
    }
    setAnnotations(annotations, annotationEntryToColorMap) {
        __classPrivateFieldGet(this, _AnnotationsView_component, "f").setData({ annotations, annotationEntryToColorMap });
    }
    /**
     * The component "de-duplicates" annotations to ensure implementation details
     * about how we create pending annotations don't leak into the UI. We expose
     * these here because we use this count to show the number of annotations in
     * the small adorner in the sidebar tab.
     */
    deduplicatedAnnotations() {
        return __classPrivateFieldGet(this, _AnnotationsView_component, "f").deduplicatedAnnotations();
    }
}
_AnnotationsView_component = new WeakMap();
//# sourceMappingURL=Sidebar.js.map