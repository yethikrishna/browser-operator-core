// Copyright 2017 The Chromium Authors. All rights reserved.
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
var _TimelineDetailsPane_instances, _TimelineDetailsPane_summaryContent, _TimelineDetailsPane_selectedEvents, _TimelineDetailsPane_parsedTrace, _TimelineDetailsPane_traceInsightsSets, _TimelineDetailsPane_eventToRelatedInsightsMap, _TimelineDetailsPane_filmStrip, _TimelineDetailsPane_networkRequestDetails, _TimelineDetailsPane_layoutShiftDetails, _TimelineDetailsPane_onTraceBoundsChangeBound, _TimelineDetailsPane_thirdPartyTree, _TimelineDetailsPane_entityMapper, _TimelineDetailsPane_onTraceBoundsChange, _TimelineDetailsPane_getFilmStripFrame, _TimelineDetailsPane_setSelectionForTimelineFrame, _TimelineDetailsPane_setSelectionForNetworkEvent, _TimelineDetailsPane_setSelectionForTraceEvent, _SummaryView_view;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Trace from '../../models/trace/trace.js';
import * as TraceBounds from '../../services/trace_bounds/trace_bounds.js';
import * as Components from '../../ui/legacy/components/utils/utils.js';
import * as UI from '../../ui/legacy/legacy.js';
import { html, nothing, render } from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as TimelineComponents from './components/components.js';
import { EventsTimelineTreeView } from './EventsTimelineTreeView.js';
import { Tracker } from './FreshRecording.js';
import { targetForEvent } from './TargetForEvent.js';
import { ThirdPartyTreeViewWidget } from './ThirdPartyTreeView.js';
import detailsViewStyles from './timelineDetailsView.css.js';
import { TimelineLayersView } from './TimelineLayersView.js';
import { TimelinePaintProfilerView } from './TimelinePaintProfilerView.js';
import { selectionFromRangeMilliSeconds, selectionIsEvent, selectionIsRange, } from './TimelineSelection.js';
import { TimelineSelectorStatsView } from './TimelineSelectorStatsView.js';
import { AggregatedTimelineTreeView, BottomUpTimelineTreeView, CallTreeTimelineTreeView, TimelineTreeView } from './TimelineTreeView.js';
import { TimelineUIUtils } from './TimelineUIUtils.js';
import { TracingFrameLayerTree } from './TracingLayerTree.js';
import * as Utils from './utils/utils.js';
const UIStrings = {
    /**
     *@description Text for the summary view
     */
    summary: 'Summary',
    /**
     *@description Text in Timeline Details View of the Performance panel
     */
    bottomup: 'Bottom-up',
    /**
     *@description Text in Timeline Details View of the Performance panel
     */
    callTree: 'Call tree',
    /**
     *@description Text in Timeline Details View of the Performance panel
     */
    eventLog: 'Event log',
    /**
     *@description Title of the paint profiler, old name of the performance pane
     */
    paintProfiler: 'Paint profiler',
    /**
     *@description Title of the Layers tool
     */
    layers: 'Layers',
    /**
     *@description Title of the selector stats tab
     */
    selectorStats: 'Selector stats',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/TimelineDetailsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class TimelineDetailsPane extends Common.ObjectWrapper.eventMixin(UI.Widget.VBox) {
    constructor(delegate) {
        super();
        _TimelineDetailsPane_instances.add(this);
        _TimelineDetailsPane_summaryContent.set(this, new SummaryView());
        _TimelineDetailsPane_selectedEvents.set(this, void 0);
        _TimelineDetailsPane_parsedTrace.set(this, null);
        _TimelineDetailsPane_traceInsightsSets.set(this, null);
        _TimelineDetailsPane_eventToRelatedInsightsMap.set(this, null);
        _TimelineDetailsPane_filmStrip.set(this, null);
        _TimelineDetailsPane_networkRequestDetails.set(this, void 0);
        _TimelineDetailsPane_layoutShiftDetails.set(this, void 0);
        _TimelineDetailsPane_onTraceBoundsChangeBound.set(this, __classPrivateFieldGet(this, _TimelineDetailsPane_instances, "m", _TimelineDetailsPane_onTraceBoundsChange).bind(this));
        _TimelineDetailsPane_thirdPartyTree.set(this, new ThirdPartyTreeViewWidget());
        _TimelineDetailsPane_entityMapper.set(this, null);
        this.registerRequiredCSS(detailsViewStyles);
        this.element.classList.add('timeline-details');
        this.detailsLinkifier = new Components.Linkifier.Linkifier();
        this.tabbedPane = new UI.TabbedPane.TabbedPane();
        this.tabbedPane.show(this.element);
        this.tabbedPane.headerElement().setAttribute('jslog', `${VisualLogging.toolbar('sidebar').track({ keydown: 'ArrowUp|ArrowLeft|ArrowDown|ArrowRight|Enter|Space' })}`);
        this.defaultDetailsWidget = new UI.Widget.VBox();
        this.defaultDetailsWidget.element.classList.add('timeline-details-view');
        this.defaultDetailsWidget.element.setAttribute('jslog', `${VisualLogging.pane('details').track({ resize: true })}`);
        __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").contentElement.classList.add('timeline-details-view-body');
        __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").show(this.defaultDetailsWidget.contentElement);
        this.appendTab(Tab.Details, i18nString(UIStrings.summary), this.defaultDetailsWidget);
        this.setPreferredTab(Tab.Details);
        this.rangeDetailViews = new Map();
        this.updateContentsScheduled = false;
        const bottomUpView = new BottomUpTimelineTreeView();
        this.appendTab(Tab.BottomUp, i18nString(UIStrings.bottomup), bottomUpView);
        this.rangeDetailViews.set(Tab.BottomUp, bottomUpView);
        const callTreeView = new CallTreeTimelineTreeView();
        this.appendTab(Tab.CallTree, i18nString(UIStrings.callTree), callTreeView);
        this.rangeDetailViews.set(Tab.CallTree, callTreeView);
        const eventsView = new EventsTimelineTreeView(delegate);
        this.appendTab(Tab.EventLog, i18nString(UIStrings.eventLog), eventsView);
        this.rangeDetailViews.set(Tab.EventLog, eventsView);
        // Listeners for hover dimming
        this.rangeDetailViews.values().forEach(view => {
            view.addEventListener("TreeRowHovered" /* TimelineTreeView.Events.TREE_ROW_HOVERED */, node => this.dispatchEventToListeners("TreeRowHovered" /* TimelineTreeView.Events.TREE_ROW_HOVERED */, node.data));
            view.addEventListener("TreeRowClicked" /* TimelineTreeView.Events.TREE_ROW_CLICKED */, node => {
                // Re-dispatch to reach the tree row dimmer.
                this.dispatchEventToListeners("TreeRowClicked" /* TimelineTreeView.Events.TREE_ROW_CLICKED */, node.data);
            });
            // If there's a heaviest stack sidebar view, also listen to hover within it.
            if (view instanceof AggregatedTimelineTreeView) {
                view.stackView.addEventListener("TreeRowHovered" /* TimelineStackView.Events.TREE_ROW_HOVERED */, node => this.dispatchEventToListeners("TreeRowHovered" /* TimelineTreeView.Events.TREE_ROW_HOVERED */, { node: node.data }));
            }
        });
        __classPrivateFieldGet(this, _TimelineDetailsPane_thirdPartyTree, "f").addEventListener("TreeRowHovered" /* TimelineTreeView.Events.TREE_ROW_HOVERED */, node => {
            // Re-dispatch through 3P event to get 3P dimmer.
            this.dispatchEventToListeners("TreeRowHovered" /* TimelineTreeView.Events.TREE_ROW_HOVERED */, { node: node.data.node, events: node.data.events ?? undefined });
        });
        __classPrivateFieldGet(this, _TimelineDetailsPane_thirdPartyTree, "f").addEventListener("BottomUpButtonClicked" /* TimelineTreeView.Events.BOTTOM_UP_BUTTON_CLICKED */, node => {
            this.selectTab(Tab.BottomUp, node.data, AggregatedTimelineTreeView.GroupBy.ThirdParties);
        });
        __classPrivateFieldGet(this, _TimelineDetailsPane_thirdPartyTree, "f").addEventListener("TreeRowClicked" /* TimelineTreeView.Events.TREE_ROW_CLICKED */, node => {
            // Re-dispatch through 3P event to get 3P dimmer.
            this.dispatchEventToListeners("TreeRowClicked" /* TimelineTreeView.Events.TREE_ROW_CLICKED */, { node: node.data.node, events: node.data.events ?? undefined });
        });
        __classPrivateFieldSet(this, _TimelineDetailsPane_networkRequestDetails, new TimelineComponents.NetworkRequestDetails.NetworkRequestDetails(this.detailsLinkifier), "f");
        __classPrivateFieldSet(this, _TimelineDetailsPane_layoutShiftDetails, new TimelineComponents.LayoutShiftDetails.LayoutShiftDetails(), "f");
        this.tabbedPane.addEventListener(UI.TabbedPane.Events.TabSelected, this.tabSelected, this);
        TraceBounds.TraceBounds.onChange(__classPrivateFieldGet(this, _TimelineDetailsPane_onTraceBoundsChangeBound, "f"));
        this.lazySelectorStatsView = null;
    }
    /**
     * This selects a given tabbedPane tab.
     * Additionally, if provided a node, we open that node and
     * if a groupBySetting is included, we groupBy.
     */
    selectTab(tabName, node, groupBySetting) {
        this.tabbedPane.selectTab(tabName, true, true);
        /**
         * For a11y, ensure that the header is focused.
         */
        this.tabbedPane.focusSelectedTabHeader();
        // We currently only support selecting Details and BottomUp via the 3P insight.
        switch (tabName) {
            case Tab.CallTree:
            case Tab.EventLog:
            case Tab.PaintProfiler:
            case Tab.LayerViewer:
            case Tab.SelectorStats: {
                break;
            }
            case Tab.Details: {
                this.updateContentsFromWindow();
                break;
            }
            case Tab.BottomUp: {
                if (!(this.tabbedPane.visibleView instanceof BottomUpTimelineTreeView)) {
                    return;
                }
                // Set grouping if necessary.
                const bottomUp = this.tabbedPane.visibleView;
                if (groupBySetting) {
                    bottomUp.setGroupBySetting(groupBySetting);
                    bottomUp.refreshTree();
                }
                if (!node) {
                    return;
                }
                // Look for the equivalent GroupNode in the bottomUp tree using the node's reference `event`.
                // Conceivably, we could match using the group ID instead.
                const treeNode = bottomUp.eventToTreeNode.get(node.event);
                if (!treeNode) {
                    return;
                }
                bottomUp.selectProfileNode(treeNode, true);
                // Reveal/expand the bottom up tree grid node.
                const gridNode = bottomUp.dataGridNodeForTreeNode(treeNode);
                if (gridNode) {
                    gridNode.expand();
                }
                break;
            }
            default: {
                Platform.assertNever(tabName, `Unknown Tab: ${tabName}. Add new case to switch.`);
            }
        }
    }
    selectorStatsView() {
        if (this.lazySelectorStatsView) {
            return this.lazySelectorStatsView;
        }
        this.lazySelectorStatsView = new TimelineSelectorStatsView(__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f"));
        return this.lazySelectorStatsView;
    }
    getDetailsContentElementForTest() {
        return __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").contentElement;
    }
    revealEventInTreeView(event) {
        if (this.tabbedPane.visibleView instanceof TimelineTreeView) {
            this.tabbedPane.visibleView.highlightEventInTree(event);
        }
    }
    async setModel(data) {
        if (__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f") !== data.parsedTrace) {
            // Clear the selector stats view, so the next time the user views it we
            // reconstruct it with the new trace data.
            this.lazySelectorStatsView = null;
            __classPrivateFieldSet(this, _TimelineDetailsPane_parsedTrace, data.parsedTrace, "f");
        }
        if (data.parsedTrace) {
            __classPrivateFieldSet(this, _TimelineDetailsPane_filmStrip, Trace.Extras.FilmStrip.fromParsedTrace(data.parsedTrace), "f");
            __classPrivateFieldSet(this, _TimelineDetailsPane_entityMapper, new Utils.EntityMapper.EntityMapper(data.parsedTrace), "f");
        }
        __classPrivateFieldSet(this, _TimelineDetailsPane_selectedEvents, data.selectedEvents, "f");
        __classPrivateFieldSet(this, _TimelineDetailsPane_traceInsightsSets, data.traceInsightsSets, "f");
        __classPrivateFieldSet(this, _TimelineDetailsPane_eventToRelatedInsightsMap, data.eventToRelatedInsightsMap, "f");
        __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").eventToRelatedInsightsMap = __classPrivateFieldGet(this, _TimelineDetailsPane_eventToRelatedInsightsMap, "f");
        this.tabbedPane.closeTabs([Tab.PaintProfiler, Tab.LayerViewer], false);
        for (const view of this.rangeDetailViews.values()) {
            view.setModelWithEvents(data.selectedEvents, data.parsedTrace, data.entityMapper);
        }
        // Set the 3p tree model.
        __classPrivateFieldGet(this, _TimelineDetailsPane_thirdPartyTree, "f").setModelWithEvents(data.selectedEvents, data.parsedTrace, data.entityMapper);
        __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").requestUpdate();
        this.lazyPaintProfilerView = null;
        this.lazyLayersView = null;
        await this.setSelection(null);
    }
    async setSummaryContent(node) {
        const allTabs = this.tabbedPane.otherTabs(Tab.Details);
        for (let i = 0; i < allTabs.length; ++i) {
            if (!this.rangeDetailViews.has(allTabs[i])) {
                this.tabbedPane.closeTab(allTabs[i]);
            }
        }
        __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").node = node;
        __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").requestUpdate();
        await __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").updateComplete;
    }
    updateContents() {
        const traceBoundsState = TraceBounds.TraceBounds.BoundsManager.instance().state();
        if (!traceBoundsState) {
            return;
        }
        const visibleWindow = traceBoundsState.milli.timelineTraceWindow;
        // Update the view that we currently have selected.
        const view = this.rangeDetailViews.get(this.tabbedPane.selectedTabId || '');
        if (view) {
            view.updateContents(this.selection || selectionFromRangeMilliSeconds(visibleWindow.min, visibleWindow.max));
        }
    }
    appendTab(id, tabTitle, view, isCloseable) {
        this.tabbedPane.appendTab(id, tabTitle, view, undefined, undefined, isCloseable);
        if (this.preferredTabId !== this.tabbedPane.selectedTabId) {
            this.tabbedPane.selectTab(id);
        }
    }
    headerElement() {
        return this.tabbedPane.headerElement();
    }
    setPreferredTab(tabId) {
        this.preferredTabId = tabId;
    }
    /**
     * This forces a recalculation and rerendering of the timings
     * breakdown of a track.
     * User actions like zooming or scrolling can trigger many updates in
     * short time windows, so we debounce the calls in those cases. Single
     * sporadic calls (like selecting a new track) don't need to be
     * debounced. The forceImmediateUpdate param configures the debouncing
     * behaviour.
     */
    scheduleUpdateContentsFromWindow(forceImmediateUpdate = false) {
        if (!__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f")) {
            void this.setSummaryContent(UI.Fragment.html `<div/>`);
            return;
        }
        if (forceImmediateUpdate) {
            this.updateContentsFromWindow();
            return;
        }
        // Debounce this update as it's not critical.
        if (!this.updateContentsScheduled) {
            this.updateContentsScheduled = true;
            setTimeout(() => {
                if (!this.updateContentsScheduled) {
                    return;
                }
                this.updateContentsScheduled = false;
                this.updateContentsFromWindow();
            }, 100);
        }
    }
    updateContentsFromWindow() {
        const traceBoundsState = TraceBounds.TraceBounds.BoundsManager.instance().state();
        if (!traceBoundsState) {
            return;
        }
        const visibleWindow = traceBoundsState.milli.timelineTraceWindow;
        this.updateSelectedRangeStats(visibleWindow.min, visibleWindow.max);
        this.updateContents();
    }
    async setSelection(selection) {
        if (!__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f")) {
            // You can't make a selection if we have no trace data.
            return;
        }
        this.detailsLinkifier.reset();
        this.selection = selection;
        if (!this.selection) {
            __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").selectedEvent = null;
            // Update instantly using forceImmediateUpdate, since we are only
            // making a single call and don't need to debounce.
            this.scheduleUpdateContentsFromWindow(/* forceImmediateUpdate */ true);
            return;
        }
        if (selectionIsEvent(selection)) {
            // Cancel any pending debounced range stats update
            this.updateContentsScheduled = false;
            if (Trace.Types.Events.isSyntheticNetworkRequest(selection.event)) {
                await __classPrivateFieldGet(this, _TimelineDetailsPane_instances, "m", _TimelineDetailsPane_setSelectionForNetworkEvent).call(this, selection.event);
            }
            else if (Trace.Types.Events.isLegacyTimelineFrame(selection.event)) {
                __classPrivateFieldGet(this, _TimelineDetailsPane_instances, "m", _TimelineDetailsPane_setSelectionForTimelineFrame).call(this, selection.event);
            }
            else {
                await __classPrivateFieldGet(this, _TimelineDetailsPane_instances, "m", _TimelineDetailsPane_setSelectionForTraceEvent).call(this, selection.event);
            }
        }
        else if (selectionIsRange(selection)) {
            const timings = Trace.Helpers.Timing.traceWindowMicroSecondsToMilliSeconds(selection.bounds);
            this.updateSelectedRangeStats(timings.min, timings.max);
        }
        this.updateContents();
    }
    tabSelected(event) {
        if (!event.data.isUserGesture) {
            return;
        }
        this.setPreferredTab(event.data.tabId);
        this.updateContents();
    }
    layersView() {
        if (this.lazyLayersView) {
            return this.lazyLayersView;
        }
        this.lazyLayersView = new TimelineLayersView(this.showSnapshotInPaintProfiler.bind(this));
        return this.lazyLayersView;
    }
    paintProfilerView() {
        if (this.lazyPaintProfilerView) {
            return this.lazyPaintProfilerView;
        }
        if (!__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f")) {
            return null;
        }
        this.lazyPaintProfilerView = new TimelinePaintProfilerView(__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f"));
        return this.lazyPaintProfilerView;
    }
    showSnapshotInPaintProfiler(snapshot) {
        const paintProfilerView = this.paintProfilerView();
        if (!paintProfilerView) {
            return;
        }
        paintProfilerView.setSnapshot(snapshot);
        if (!this.tabbedPane.hasTab(Tab.PaintProfiler)) {
            this.appendTab(Tab.PaintProfiler, i18nString(UIStrings.paintProfiler), paintProfilerView, true);
        }
        this.tabbedPane.selectTab(Tab.PaintProfiler, true);
    }
    showSelectorStatsForIndividualEvent(event) {
        this.showAggregatedSelectorStats([event]);
    }
    showAggregatedSelectorStats(events) {
        const selectorStatsView = this.selectorStatsView();
        selectorStatsView.setAggregatedEvents(events);
        if (!this.tabbedPane.hasTab(Tab.SelectorStats)) {
            this.appendTab(Tab.SelectorStats, i18nString(UIStrings.selectorStats), selectorStatsView);
        }
    }
    appendDetailsTabsForTraceEventAndShowDetails(event, content) {
        void this.setSummaryContent(content);
        if (Trace.Types.Events.isPaint(event) || Trace.Types.Events.isRasterTask(event)) {
            this.showEventInPaintProfiler(event);
        }
        if (Trace.Types.Events.isUpdateLayoutTree(event)) {
            this.showSelectorStatsForIndividualEvent(event);
        }
    }
    showEventInPaintProfiler(event) {
        const paintProfilerModel = SDK.TargetManager.TargetManager.instance().models(SDK.PaintProfiler.PaintProfilerModel)[0];
        if (!paintProfilerModel) {
            return;
        }
        const paintProfilerView = this.paintProfilerView();
        if (!paintProfilerView) {
            return;
        }
        const hasProfileData = paintProfilerView.setEvent(paintProfilerModel, event);
        if (!hasProfileData) {
            return;
        }
        if (this.tabbedPane.hasTab(Tab.PaintProfiler)) {
            return;
        }
        this.appendTab(Tab.PaintProfiler, i18nString(UIStrings.paintProfiler), paintProfilerView);
    }
    updateSelectedRangeStats(startTime, endTime) {
        if (!__classPrivateFieldGet(this, _TimelineDetailsPane_selectedEvents, "f") || !__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f") || !__classPrivateFieldGet(this, _TimelineDetailsPane_entityMapper, "f")) {
            return;
        }
        const minBoundsMilli = Trace.Helpers.Timing.traceWindowMilliSeconds(__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f").Meta.traceBounds).min;
        const aggregatedStats = TimelineUIUtils.statsForTimeRange(__classPrivateFieldGet(this, _TimelineDetailsPane_selectedEvents, "f"), startTime, endTime);
        const startOffset = startTime - minBoundsMilli;
        const endOffset = endTime - minBoundsMilli;
        const summaryDetailElem = TimelineUIUtils.generateSummaryDetails(aggregatedStats, startOffset, endOffset, __classPrivateFieldGet(this, _TimelineDetailsPane_selectedEvents, "f"), __classPrivateFieldGet(this, _TimelineDetailsPane_thirdPartyTree, "f"));
        // This is a bit of a hack as we are midway through migrating this to
        // the new UI Eng vision.
        // The 3P tree view will only bother to update its DOM if it has a
        // parentElement, so we trigger the rendering of the summary content
        // (so the 3P Tree View is attached to the DOM) and then we tell it to
        // update.
        // This will be fixed once we migrate this component fully to the new vision (b/407751379)
        void this.setSummaryContent(summaryDetailElem).then(() => {
            __classPrivateFieldGet(this, _TimelineDetailsPane_thirdPartyTree, "f").updateContents(this.selection || selectionFromRangeMilliSeconds(startTime, endTime));
        });
        // Find all recalculate style events data from range
        const isSelectorStatsEnabled = Common.Settings.Settings.instance().createSetting('timeline-capture-selector-stats', false).get();
        if (__classPrivateFieldGet(this, _TimelineDetailsPane_selectedEvents, "f") && isSelectorStatsEnabled) {
            const eventsInRange = Trace.Helpers.Trace.findUpdateLayoutTreeEvents(__classPrivateFieldGet(this, _TimelineDetailsPane_selectedEvents, "f"), Trace.Helpers.Timing.milliToMicro(startTime), Trace.Helpers.Timing.milliToMicro(endTime));
            if (eventsInRange.length > 0) {
                this.showAggregatedSelectorStats(eventsInRange);
            }
        }
    }
}
_TimelineDetailsPane_summaryContent = new WeakMap(), _TimelineDetailsPane_selectedEvents = new WeakMap(), _TimelineDetailsPane_parsedTrace = new WeakMap(), _TimelineDetailsPane_traceInsightsSets = new WeakMap(), _TimelineDetailsPane_eventToRelatedInsightsMap = new WeakMap(), _TimelineDetailsPane_filmStrip = new WeakMap(), _TimelineDetailsPane_networkRequestDetails = new WeakMap(), _TimelineDetailsPane_layoutShiftDetails = new WeakMap(), _TimelineDetailsPane_onTraceBoundsChangeBound = new WeakMap(), _TimelineDetailsPane_thirdPartyTree = new WeakMap(), _TimelineDetailsPane_entityMapper = new WeakMap(), _TimelineDetailsPane_instances = new WeakSet(), _TimelineDetailsPane_onTraceBoundsChange = async function _TimelineDetailsPane_onTraceBoundsChange(event) {
    if (event.updateType === 'MINIMAP_BOUNDS') {
        // If new minimap bounds are set, we might need to update the selected entry summary because
        // the links to other entries (ex. initiator) might be outside of the new breadcrumb.
        if (this.selection) {
            await this.setSelection(this.selection);
        }
    }
    if (event.updateType === 'RESET' || event.updateType === 'VISIBLE_WINDOW') {
        // If the update type was a changing of the minimap bounds, we do not
        // need to redraw.
        if (!this.selection) {
            this.scheduleUpdateContentsFromWindow();
        }
    }
}, _TimelineDetailsPane_getFilmStripFrame = function _TimelineDetailsPane_getFilmStripFrame(frame) {
    if (!__classPrivateFieldGet(this, _TimelineDetailsPane_filmStrip, "f")) {
        return null;
    }
    const screenshotTime = (frame.idle ? frame.startTime : frame.endTime);
    const filmStripFrame = Trace.Extras.FilmStrip.frameClosestToTimestamp(__classPrivateFieldGet(this, _TimelineDetailsPane_filmStrip, "f"), screenshotTime);
    if (!filmStripFrame) {
        return null;
    }
    const frameTimeMilliSeconds = Trace.Helpers.Timing.microToMilli(filmStripFrame.screenshotEvent.ts);
    const frameEndTimeMilliSeconds = Trace.Helpers.Timing.microToMilli(frame.endTime);
    return frameTimeMilliSeconds - frameEndTimeMilliSeconds < 10 ? filmStripFrame : null;
}, _TimelineDetailsPane_setSelectionForTimelineFrame = function _TimelineDetailsPane_setSelectionForTimelineFrame(frame) {
    const matchedFilmStripFrame = __classPrivateFieldGet(this, _TimelineDetailsPane_instances, "m", _TimelineDetailsPane_getFilmStripFrame).call(this, frame);
    void this.setSummaryContent(TimelineUIUtils.generateDetailsContentForFrame(frame, __classPrivateFieldGet(this, _TimelineDetailsPane_filmStrip, "f"), matchedFilmStripFrame));
    const target = SDK.TargetManager.TargetManager.instance().rootTarget();
    if (frame.layerTree && target) {
        const layerTreeForFrame = new TracingFrameLayerTree(target, frame.layerTree);
        const layersView = this.layersView();
        layersView.showLayerTree(layerTreeForFrame);
        if (!this.tabbedPane.hasTab(Tab.LayerViewer)) {
            this.appendTab(Tab.LayerViewer, i18nString(UIStrings.layers), layersView);
        }
    }
}, _TimelineDetailsPane_setSelectionForNetworkEvent = async function _TimelineDetailsPane_setSelectionForNetworkEvent(networkRequest) {
    if (!__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f")) {
        return;
    }
    const maybeTarget = targetForEvent(__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f"), networkRequest);
    await __classPrivateFieldGet(this, _TimelineDetailsPane_networkRequestDetails, "f").setData(__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f"), networkRequest, maybeTarget, __classPrivateFieldGet(this, _TimelineDetailsPane_entityMapper, "f"));
    __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").selectedEvent = networkRequest;
    __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").eventToRelatedInsightsMap = __classPrivateFieldGet(this, _TimelineDetailsPane_eventToRelatedInsightsMap, "f");
    await this.setSummaryContent(__classPrivateFieldGet(this, _TimelineDetailsPane_networkRequestDetails, "f"));
}, _TimelineDetailsPane_setSelectionForTraceEvent = async function _TimelineDetailsPane_setSelectionForTraceEvent(event) {
    if (!__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f")) {
        return;
    }
    __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").selectedEvent = event;
    __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").eventToRelatedInsightsMap = __classPrivateFieldGet(this, _TimelineDetailsPane_eventToRelatedInsightsMap, "f");
    __classPrivateFieldGet(this, _TimelineDetailsPane_summaryContent, "f").requestUpdate();
    // Special case: if the user selects a layout shift or a layout shift cluster,
    // render the new layout shift details component.
    if (Trace.Types.Events.isSyntheticLayoutShift(event) || Trace.Types.Events.isSyntheticLayoutShiftCluster(event)) {
        const isFreshRecording = Boolean(__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f") && Tracker.instance().recordingIsFresh(__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f")));
        __classPrivateFieldGet(this, _TimelineDetailsPane_layoutShiftDetails, "f").setData(event, __classPrivateFieldGet(this, _TimelineDetailsPane_traceInsightsSets, "f"), __classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f"), isFreshRecording);
        return await this.setSummaryContent(__classPrivateFieldGet(this, _TimelineDetailsPane_layoutShiftDetails, "f"));
    }
    // Otherwise, build the generic trace event details UI.
    const traceEventDetails = await TimelineUIUtils.buildTraceEventDetails(__classPrivateFieldGet(this, _TimelineDetailsPane_parsedTrace, "f"), event, this.detailsLinkifier, true, __classPrivateFieldGet(this, _TimelineDetailsPane_entityMapper, "f"));
    this.appendDetailsTabsForTraceEventAndShowDetails(event, traceEventDetails);
};
export var Tab;
(function (Tab) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Tab["Details"] = "details";
    Tab["EventLog"] = "event-log";
    Tab["CallTree"] = "call-tree";
    Tab["BottomUp"] = "bottom-up";
    Tab["PaintProfiler"] = "paint-profiler";
    Tab["LayerViewer"] = "layer-viewer";
    Tab["SelectorStats"] = "selector-stats";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Tab || (Tab = {}));
const SUMMARY_DEFAULT_VIEW = (input, _output, target) => {
    render(html `
        <style>${detailsViewStyles}</style>
        ${input.node ?? nothing}
        <devtools-widget .widgetConfig=${UI.Widget.widgetConfig(TimelineComponents.RelatedInsightChips.RelatedInsightChips, {
        activeEvent: input.selectedEvent,
        eventToInsightsMap: input.eventToRelatedInsightsMap,
    })}></devtools-widget>
      `, target, { host: input });
};
class SummaryView extends UI.Widget.VBox {
    constructor(element, view = SUMMARY_DEFAULT_VIEW) {
        super(false, false, element);
        _SummaryView_view.set(this, void 0);
        this.node = null;
        this.selectedEvent = null;
        this.eventToRelatedInsightsMap = null;
        __classPrivateFieldSet(this, _SummaryView_view, view, "f");
    }
    performUpdate() {
        __classPrivateFieldGet(this, _SummaryView_view, "f").call(this, {
            node: this.node,
            selectedEvent: this.selectedEvent,
            eventToRelatedInsightsMap: this.eventToRelatedInsightsMap,
        }, {}, this.contentElement);
    }
}
_SummaryView_view = new WeakMap();
//# sourceMappingURL=TimelineDetailsView.js.map