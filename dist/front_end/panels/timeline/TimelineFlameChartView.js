// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _TimelineFlameChartView_instances, _TimelineFlameChartView_onMainEntriesLinkAnnotationCreated, _TimelineFlameChartView_onNetworkEntriesLinkAnnotationCreated, _TimelineFlameChartView_boundRefreshAfterIgnoreList, _TimelineFlameChartView_selectedEvents, _TimelineFlameChartView_parsedTrace, _TimelineFlameChartView_traceMetadata, _TimelineFlameChartView_traceInsightSets, _TimelineFlameChartView_eventToRelatedInsightsMap, _TimelineFlameChartView_selectedGroupName, _TimelineFlameChartView_onTraceBoundsChangeBound, _TimelineFlameChartView_gameKeyMatches, _TimelineFlameChartView_gameTimeout, _TimelineFlameChartView_overlaysContainer, _TimelineFlameChartView_overlays, _TimelineFlameChartView_timeRangeSelectionAnnotation, _TimelineFlameChartView_linkSelectionAnnotation, _TimelineFlameChartView_currentInsightOverlays, _TimelineFlameChartView_activeInsight, _TimelineFlameChartView_markers, _TimelineFlameChartView_tooltipElement, _TimelineFlameChartView_loggableForGroupByLogContext, _TimelineFlameChartView_onMainEntryInvoked, _TimelineFlameChartView_onNetworkEntryInvoked, _TimelineFlameChartView_currentSelection, _TimelineFlameChartView_entityMapper, _TimelineFlameChartView_flameChartDimmers, _TimelineFlameChartView_searchDimmer, _TimelineFlameChartView_treeRowHoverDimmer, _TimelineFlameChartView_treeRowClickDimmer, _TimelineFlameChartView_activeInsightDimmer, _TimelineFlameChartView_thirdPartyCheckboxDimmer, _TimelineFlameChartView_checkReducedMotion, _TimelineFlameChartView_networkPersistedGroupConfigSetting, _TimelineFlameChartView_mainPersistedGroupConfigSetting, _TimelineFlameChartView_registerFlameChartDimmer, _TimelineFlameChartView_updateFlameChartDimmerWithEvents, _TimelineFlameChartView_updateFlameChartDimmerWithIndices, _TimelineFlameChartView_refreshDimming, _TimelineFlameChartView_dimInsightRelatedEvents, _TimelineFlameChartView_sortMarkersForPreferredVisualOrder, _TimelineFlameChartView_amendMarkerWithFieldData, _TimelineFlameChartView_expandEntryTrack, _TimelineFlameChartView_processFlameChartMouseMoveEvent, _TimelineFlameChartView_pointerDownHandler, _TimelineFlameChartView_clearLinkSelectionAnnotation, _TimelineFlameChartView_setLinkSelectionAnnotation, _TimelineFlameChartView_createNewTimeRangeFromKeyboard, _TimelineFlameChartView_handleTimeRangeKeyboardCreation, _TimelineFlameChartView_keydownHandler, _TimelineFlameChartView_onTraceBoundsChange, _TimelineFlameChartView_addPersistedConfigToSettings, _TimelineFlameChartView_getPersistedConfigForTrace, _TimelineFlameChartView_refreshAfterIgnoreList, _TimelineFlameChartView_updateDetailViews, _TimelineFlameChartView_updateFlameCharts, _TimelineFlameChartView_registerLoggableGroups, _TimelineFlameChartView_selectionIfTraceEvent, _TimelineFlameChartView_onEntryInvoked, _TimelineFlameChartView_updateSelectedEntryStatus, _TimelineFlameChartView_selectSearchResult, _TimelineFlameChartView_indexOfSearchResult;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Bindings from '../../models/bindings/bindings.js';
import * as CrUXManager from '../../models/crux-manager/crux-manager.js';
import * as Trace from '../../models/trace/trace.js';
import * as TraceBounds from '../../services/trace_bounds/trace_bounds.js';
import * as PerfUI from '../../ui/legacy/components/perf_ui/perf_ui.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { getAnnotationEntries, getAnnotationWindow } from './AnnotationHelpers.js';
import * as TimelineInsights from './components/insights/insights.js';
import { CountersGraph } from './CountersGraph.js';
import { SHOULD_SHOW_EASTER_EGG } from './EasterEgg.js';
import { ModificationsManager } from './ModificationsManager.js';
import * as OverlayComponents from './overlays/components/components.js';
import * as Overlays from './overlays/overlays.js';
import { targetForEvent } from './TargetForEvent.js';
import { TimelineDetailsPane } from './TimelineDetailsView.js';
import { TimelineRegExp } from './TimelineFilters.js';
import { TimelineFlameChartDataProvider, } from './TimelineFlameChartDataProvider.js';
import { TimelineFlameChartNetworkDataProvider } from './TimelineFlameChartNetworkDataProvider.js';
import timelineFlameChartViewStyles from './timelineFlameChartView.css.js';
import { rangeForSelection, selectionFromEvent, selectionFromRangeMilliSeconds, selectionIsEvent, selectionIsRange, selectionsEqual } from './TimelineSelection.js';
import { AggregatedTimelineTreeView } from './TimelineTreeView.js';
import { keyForTraceConfig } from './TrackConfiguration.js';
import * as Utils from './utils/utils.js';
const UIStrings = {
    /**
     *@description Text in Timeline Flame Chart View of the Performance panel
     *@example {Frame} PH1
     *@example {10ms} PH2
     */
    sAtS: '{PH1} at {PH2}',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/TimelineFlameChartView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
/**
 * This defines the order these markers will be rendered if they are at the
 * same timestamp. The smaller number will be shown first - e.g. so if NavigationStart, MarkFCP,
 * MarkLCPCandidate have the same timestamp, visually we
 * will render [Nav][FCP][DCL][LCP] everytime.
 */
export const SORT_ORDER_PAGE_LOAD_MARKERS = {
    ["navigationStart" /* Trace.Types.Events.Name.NAVIGATION_START */]: 0,
    ["MarkLoad" /* Trace.Types.Events.Name.MARK_LOAD */]: 1,
    ["firstContentfulPaint" /* Trace.Types.Events.Name.MARK_FCP */]: 2,
    ["MarkDOMContent" /* Trace.Types.Events.Name.MARK_DOM_CONTENT */]: 3,
    ["largestContentfulPaint::Candidate" /* Trace.Types.Events.Name.MARK_LCP_CANDIDATE */]: 4,
};
// Threshold to match up overlay markers that are off by a tiny amount so they aren't rendered
// on top of each other.
const TIMESTAMP_THRESHOLD_MS = Trace.Types.Timing.Micro(10);
export class TimelineFlameChartView extends Common.ObjectWrapper.eventMixin(UI.Widget.VBox) {
    constructor(delegate) {
        super();
        _TimelineFlameChartView_instances.add(this);
        /**
         * Tracks the indexes of matched entries when the user searches the panel.
         * Defaults to undefined which indicates the user has not searched.
         */
        this.searchResults = undefined;
        _TimelineFlameChartView_onMainEntriesLinkAnnotationCreated.set(this, void 0);
        _TimelineFlameChartView_onNetworkEntriesLinkAnnotationCreated.set(this, void 0);
        _TimelineFlameChartView_boundRefreshAfterIgnoreList.set(this, void 0);
        _TimelineFlameChartView_selectedEvents.set(this, void 0);
        _TimelineFlameChartView_parsedTrace.set(this, void 0);
        _TimelineFlameChartView_traceMetadata.set(this, void 0);
        _TimelineFlameChartView_traceInsightSets.set(this, null);
        _TimelineFlameChartView_eventToRelatedInsightsMap.set(this, null);
        _TimelineFlameChartView_selectedGroupName.set(this, null);
        _TimelineFlameChartView_onTraceBoundsChangeBound.set(this, __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_onTraceBoundsChange).bind(this));
        _TimelineFlameChartView_gameKeyMatches.set(this, 0);
        _TimelineFlameChartView_gameTimeout.set(this, setTimeout(() => ({}), 0));
        _TimelineFlameChartView_overlaysContainer.set(this, document.createElement('div'));
        _TimelineFlameChartView_overlays.set(this, void 0);
        // Tracks the in-progress time range annotation when the user alt/option clicks + drags, or when the user uses the keyboard
        _TimelineFlameChartView_timeRangeSelectionAnnotation.set(this, null);
        // Keep track of the link annotation that hasn't been fully selected yet.
        // We only store it here when only 'entryFrom' has been selected and
        // 'EntryTo' selection still needs to be updated.
        _TimelineFlameChartView_linkSelectionAnnotation.set(this, null);
        _TimelineFlameChartView_currentInsightOverlays.set(this, []);
        _TimelineFlameChartView_activeInsight.set(this, null);
        _TimelineFlameChartView_markers.set(this, []);
        _TimelineFlameChartView_tooltipElement.set(this, document.createElement('div'));
        // We use an symbol as the loggable for each group. This is because
        // groups can get re-built at times and we need a common reference to act as
        // the reference for each group that we log. By storing these symbols in
        // a map keyed off the context of the group, we ensure we persist the
        // loggable even if the group gets rebuilt at some point in time.
        _TimelineFlameChartView_loggableForGroupByLogContext.set(this, new Map());
        _TimelineFlameChartView_onMainEntryInvoked.set(this, void 0);
        _TimelineFlameChartView_onNetworkEntryInvoked.set(this, void 0);
        _TimelineFlameChartView_currentSelection.set(this, null);
        _TimelineFlameChartView_entityMapper.set(this, null);
        // Only one dimmer is used at a time. The first dimmer, as defined by the following
        // order, that is `active` within this array is used.
        _TimelineFlameChartView_flameChartDimmers.set(this, []);
        _TimelineFlameChartView_searchDimmer.set(this, __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_registerFlameChartDimmer).call(this, { inclusive: false, outline: true }));
        _TimelineFlameChartView_treeRowHoverDimmer.set(this, __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_registerFlameChartDimmer).call(this, { inclusive: false, outline: true }));
        _TimelineFlameChartView_treeRowClickDimmer.set(this, __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_registerFlameChartDimmer).call(this, { inclusive: false, outline: false }));
        _TimelineFlameChartView_activeInsightDimmer.set(this, __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_registerFlameChartDimmer).call(this, { inclusive: false, outline: true }));
        _TimelineFlameChartView_thirdPartyCheckboxDimmer.set(this, __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_registerFlameChartDimmer).call(this, { inclusive: true, outline: false }));
        /**
         * Determines if we respect the user's prefers-reduced-motion setting. We
         * absolutely should care about this; the only time we don't is in unit tests
         * when we need to force animations on and don't want the environment to
         * determine if they are on or not.
         * It is not expected that this flag is ever disabled in non-test environments.
         */
        _TimelineFlameChartView_checkReducedMotion.set(this, true);
        /**
         * Persist the visual configuration of the tracks/groups into memory.
         */
        _TimelineFlameChartView_networkPersistedGroupConfigSetting.set(this, void 0);
        _TimelineFlameChartView_mainPersistedGroupConfigSetting.set(this, void 0);
        this.registerRequiredCSS(timelineFlameChartViewStyles);
        this.element.classList.add('timeline-flamechart');
        this.delegate = delegate;
        this.eventListeners = [];
        __classPrivateFieldSet(this, _TimelineFlameChartView_parsedTrace, null, "f");
        __classPrivateFieldSet(this, _TimelineFlameChartView_traceMetadata, null, "f");
        const flameChartsContainer = new UI.Widget.VBox();
        flameChartsContainer.element.classList.add('flame-charts-container');
        // Create main and network flamecharts.
        this.networkSplitWidget = new UI.SplitWidget.SplitWidget(false, false, 'timeline-flamechart-main-view', 150);
        this.networkSplitWidget.show(flameChartsContainer.element);
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlaysContainer, "f").classList.add('timeline-overlays-container');
        flameChartsContainer.element.appendChild(__classPrivateFieldGet(this, _TimelineFlameChartView_overlaysContainer, "f"));
        __classPrivateFieldGet(this, _TimelineFlameChartView_tooltipElement, "f").classList.add('timeline-entry-tooltip-element');
        flameChartsContainer.element.appendChild(__classPrivateFieldGet(this, _TimelineFlameChartView_tooltipElement, "f"));
        // Ensure that the network panel & resizer appears above the main thread.
        this.networkSplitWidget.sidebarElement().style.zIndex = '120';
        __classPrivateFieldSet(this, _TimelineFlameChartView_mainPersistedGroupConfigSetting, Common.Settings.Settings.instance().createSetting('timeline-main-flame-group-config', {}), "f");
        __classPrivateFieldSet(this, _TimelineFlameChartView_networkPersistedGroupConfigSetting, Common.Settings.Settings.instance().createSetting('timeline-network-flame-group-config', {}), "f");
        this.mainDataProvider = new TimelineFlameChartDataProvider();
        this.mainDataProvider.setPersistedGroupConfigSetting(__classPrivateFieldGet(this, _TimelineFlameChartView_mainPersistedGroupConfigSetting, "f"));
        this.mainDataProvider.addEventListener("DataChanged" /* TimelineFlameChartDataProviderEvents.DATA_CHANGED */, () => this.mainFlameChart.scheduleUpdate());
        this.mainDataProvider.addEventListener("FlameChartItemHovered" /* TimelineFlameChartDataProviderEvents.FLAME_CHART_ITEM_HOVERED */, e => this.detailsView.revealEventInTreeView(e.data));
        this.mainFlameChart = new PerfUI.FlameChart.FlameChart(this.mainDataProvider, this, {
            // The TimelineOverlays are used for selected elements
            selectedElementOutline: false,
            tooltipElement: __classPrivateFieldGet(this, _TimelineFlameChartView_tooltipElement, "f"),
            useOverlaysForCursorRuler: true,
        });
        this.mainFlameChart.alwaysShowVerticalScroll();
        this.mainFlameChart.enableRuler(false);
        this.mainFlameChart.addEventListener("LatestDrawDimensions" /* PerfUI.FlameChart.Events.LATEST_DRAW_DIMENSIONS */, dimensions => {
            __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").updateChartDimensions('main', dimensions.data.chart);
            __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").updateVisibleWindow(dimensions.data.traceWindow);
            void __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").update();
        });
        this.networkDataProvider = new TimelineFlameChartNetworkDataProvider();
        this.networkDataProvider.setPersistedGroupConfigSetting(__classPrivateFieldGet(this, _TimelineFlameChartView_networkPersistedGroupConfigSetting, "f"));
        this.networkFlameChart = new PerfUI.FlameChart.FlameChart(this.networkDataProvider, this, {
            // The TimelineOverlays are used for selected elements
            selectedElementOutline: false,
            tooltipElement: __classPrivateFieldGet(this, _TimelineFlameChartView_tooltipElement, "f"),
            useOverlaysForCursorRuler: true,
        });
        this.networkFlameChart.alwaysShowVerticalScroll();
        this.networkFlameChart.addEventListener("LatestDrawDimensions" /* PerfUI.FlameChart.Events.LATEST_DRAW_DIMENSIONS */, dimensions => {
            __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").updateChartDimensions('network', dimensions.data.chart);
            __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").updateVisibleWindow(dimensions.data.traceWindow);
            void __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").update();
            // If the height of the network chart has changed, we need to tell the
            // main flame chart because its tooltips are positioned based in part on
            // the height of the network chart.
            this.mainFlameChart.setTooltipYPixelAdjustment(__classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").networkChartOffsetHeight());
        });
        this.mainFlameChart.addEventListener("MouseMove" /* PerfUI.FlameChart.Events.MOUSE_MOVE */, event => {
            void __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_processFlameChartMouseMoveEvent).call(this, event.data);
        });
        this.networkFlameChart.addEventListener("MouseMove" /* PerfUI.FlameChart.Events.MOUSE_MOVE */, event => {
            void __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_processFlameChartMouseMoveEvent).call(this, event.data);
        });
        __classPrivateFieldSet(this, _TimelineFlameChartView_overlays, new Overlays.Overlays.Overlays({
            container: __classPrivateFieldGet(this, _TimelineFlameChartView_overlaysContainer, "f"),
            flameChartsContainers: {
                main: this.mainFlameChart.element,
                network: this.networkFlameChart.element,
            },
            charts: {
                mainChart: this.mainFlameChart,
                mainProvider: this.mainDataProvider,
                networkChart: this.networkFlameChart,
                networkProvider: this.networkDataProvider,
            },
            entryQueries: {
                parsedTrace: () => {
                    return __classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f");
                },
                isEntryCollapsedByUser: (entry) => {
                    return ModificationsManager.activeManager()?.getEntriesFilter().entryIsInvisible(entry) ?? false;
                },
                firstVisibleParentForEntry(entry) {
                    return ModificationsManager.activeManager()?.getEntriesFilter().firstVisibleParentEntryForEntry(entry) ??
                        null;
                },
            },
        }), "f");
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").addEventListener(Overlays.Overlays.ConsentDialogVisibilityChange.eventName, e => {
            const event = e;
            if (event.isVisible) {
                // If the dialog is visible, we do not want anything in the performance
                // panel capturing tab focus.
                // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert
                this.element.setAttribute('inert', 'inert');
            }
            else {
                this.element.removeAttribute('inert');
            }
        });
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").addEventListener(Overlays.Overlays.EntryLabelMouseClick.eventName, event => {
            const { overlay } = event;
            this.dispatchEventToListeners("EntryLabelAnnotationClicked" /* Events.ENTRY_LABEL_ANNOTATION_CLICKED */, {
                entry: overlay.entry,
            });
        });
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").addEventListener(Overlays.Overlays.AnnotationOverlayActionEvent.eventName, event => {
            const { overlay, action } = event;
            if (action === 'Remove') {
                // If the overlay removed is the current time range, set it to null so that
                // we would create a new time range overlay and annotation on the next time range selection instead
                // of trying to update the current overlay that does not exist.
                if (ModificationsManager.activeManager()?.getAnnotationByOverlay(overlay) ===
                    __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f")) {
                    __classPrivateFieldSet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, null, "f");
                }
                ModificationsManager.activeManager()?.removeAnnotationOverlay(overlay);
            }
            else if (action === 'Update') {
                ModificationsManager.activeManager()?.updateAnnotationOverlay(overlay);
            }
        });
        this.element.addEventListener(OverlayComponents.EntriesLinkOverlay.EntryLinkStartCreating.eventName, () => {
            /**
             * When the user creates an entries link, they click on the arrow icon to
             * begin creating it. At this point the arrow icon gets deleted. This
             * causes the focus of the page by default to jump to the entire Timeline
             * Panel. This is a bit aggressive; and problematic as it means we cannot
             * use <ESC> to cancel the creation of the entry. So instead we focus the
             * TimelineFlameChartView instead. This means that the user's <ESC> gets
             * dealt with in its keydown.
             * If the user goes ahead and creates the entry, they will end up
             * focused on whichever target entry they pick, so this only matters for
             * the case where the user hits <ESC> to cancel.
             */
            this.focus();
        });
        this.element.setAttribute('jslog', `${VisualLogging.section('timeline.flame-chart-view')}`);
        this.networkPane = new UI.Widget.VBox();
        this.networkPane.setMinimumSize(23, 23);
        this.networkFlameChart.show(this.networkPane.element);
        this.splitResizer = this.networkPane.element.createChild('div', 'timeline-flamechart-resizer');
        this.networkSplitWidget.hideDefaultResizer(true);
        this.networkSplitWidget.installResizer(this.splitResizer);
        this.networkSplitWidget.setMainWidget(this.mainFlameChart);
        this.networkSplitWidget.setSidebarWidget(this.networkPane);
        // Create counters chart splitter.
        this.chartSplitWidget = new UI.SplitWidget.SplitWidget(false, true, 'timeline-counters-split-view-state');
        this.countersView = new CountersGraph(this.delegate);
        this.chartSplitWidget.setMainWidget(flameChartsContainer);
        this.chartSplitWidget.setSidebarWidget(this.countersView);
        this.chartSplitWidget.hideDefaultResizer();
        this.chartSplitWidget.installResizer(this.countersView.resizerElement());
        // Create top level properties splitter.
        this.detailsSplitWidget = new UI.SplitWidget.SplitWidget(false, true, 'timeline-panel-details-split-view-state');
        this.detailsSplitWidget.element.classList.add('timeline-details-split');
        this.detailsView = new TimelineDetailsPane(delegate);
        this.detailsSplitWidget.installResizer(this.detailsView.headerElement());
        this.detailsSplitWidget.setMainWidget(this.chartSplitWidget);
        this.detailsSplitWidget.setSidebarWidget(this.detailsView);
        this.detailsSplitWidget.show(this.element);
        // Event listeners for annotations.
        this.onMainAddEntryLabelAnnotation = this.onAddEntryLabelAnnotation.bind(this, this.mainDataProvider);
        this.onNetworkAddEntryLabelAnnotation = this.onAddEntryLabelAnnotation.bind(this, this.networkDataProvider);
        __classPrivateFieldSet(this, _TimelineFlameChartView_onMainEntriesLinkAnnotationCreated, event => this.onEntriesLinkAnnotationCreate(this.mainDataProvider, event.data.entryFromIndex), "f");
        __classPrivateFieldSet(this, _TimelineFlameChartView_onNetworkEntriesLinkAnnotationCreated, event => this.onEntriesLinkAnnotationCreate(this.networkDataProvider, event.data.entryFromIndex), "f");
        this.mainFlameChart.addEventListener("EntryLabelAnnotationAdded" /* PerfUI.FlameChart.Events.ENTRY_LABEL_ANNOTATION_ADDED */, this.onMainAddEntryLabelAnnotation, this);
        this.networkFlameChart.addEventListener("EntryLabelAnnotationAdded" /* PerfUI.FlameChart.Events.ENTRY_LABEL_ANNOTATION_ADDED */, this.onNetworkAddEntryLabelAnnotation, this);
        this.mainFlameChart.addEventListener("EntriesLinkAnnotationCreated" /* PerfUI.FlameChart.Events.ENTRIES_LINK_ANNOTATION_CREATED */, __classPrivateFieldGet(this, _TimelineFlameChartView_onMainEntriesLinkAnnotationCreated, "f"), this);
        this.networkFlameChart.addEventListener("EntriesLinkAnnotationCreated" /* PerfUI.FlameChart.Events.ENTRIES_LINK_ANNOTATION_CREATED */, __classPrivateFieldGet(this, _TimelineFlameChartView_onNetworkEntriesLinkAnnotationCreated, "f"), this);
        this.mainFlameChart.addEventListener("TracksReorderStateChange" /* PerfUI.FlameChart.Events.TRACKS_REORDER_STATE_CHANGED */, event => {
            __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").toggleAllOverlaysDisplayed(!event.data);
        });
        this.detailsView.addEventListener("TreeRowHovered" /* TimelineTreeView.Events.TREE_ROW_HOVERED */, e => {
            if (e.data.events) {
                __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithEvents).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_treeRowHoverDimmer, "f"), e.data.events);
                return;
            }
            const events = e?.data?.node?.events ?? null;
            __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithEvents).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_treeRowHoverDimmer, "f"), events);
        });
        this.detailsView.addEventListener("TreeRowClicked" /* TimelineTreeView.Events.TREE_ROW_CLICKED */, e => {
            if (e.data.events) {
                __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithEvents).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_treeRowClickDimmer, "f"), e.data.events);
                return;
            }
            const events = e?.data?.node?.events ?? null;
            __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithEvents).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_treeRowClickDimmer, "f"), events);
        });
        /**
         * NOTE: ENTRY_SELECTED, ENTRY_INVOKED and ENTRY_HOVERED are not always super obvious:
         * ENTRY_SELECTED: is KEYBOARD ONLY selection of events (e.g. navigating through the flamechart with your arrow keys)
         * ENTRY_HOVERED: is MOUSE ONLY when an event is hovered over with the mouse.
         * ENTRY_INVOKED: is when the user clicks on an event, or hits the "enter" key whilst an event is selected.
         */
        this.onMainEntrySelected = this.onEntrySelected.bind(this, this.mainDataProvider);
        this.onNetworkEntrySelected = this.onEntrySelected.bind(this, this.networkDataProvider);
        this.mainFlameChart.addEventListener("EntrySelected" /* PerfUI.FlameChart.Events.ENTRY_SELECTED */, this.onMainEntrySelected, this);
        this.networkFlameChart.addEventListener("EntrySelected" /* PerfUI.FlameChart.Events.ENTRY_SELECTED */, this.onNetworkEntrySelected, this);
        __classPrivateFieldSet(this, _TimelineFlameChartView_onMainEntryInvoked, __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_onEntryInvoked).bind(this, this.mainDataProvider), "f");
        __classPrivateFieldSet(this, _TimelineFlameChartView_onNetworkEntryInvoked, __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_onEntryInvoked).bind(this, this.networkDataProvider), "f");
        this.mainFlameChart.addEventListener("EntryInvoked" /* PerfUI.FlameChart.Events.ENTRY_INVOKED */, __classPrivateFieldGet(this, _TimelineFlameChartView_onMainEntryInvoked, "f"), this);
        this.networkFlameChart.addEventListener("EntryInvoked" /* PerfUI.FlameChart.Events.ENTRY_INVOKED */, __classPrivateFieldGet(this, _TimelineFlameChartView_onNetworkEntryInvoked, "f"), this);
        this.mainFlameChart.addEventListener("EntryHovered" /* PerfUI.FlameChart.Events.ENTRY_HOVERED */, event => {
            this.onEntryHovered(event);
            this.updateLinkSelectionAnnotationWithToEntry(this.mainDataProvider, event.data);
        }, this);
        this.networkFlameChart.addEventListener("EntryHovered" /* PerfUI.FlameChart.Events.ENTRY_HOVERED */, event => {
            this.updateLinkSelectionAnnotationWithToEntry(this.networkDataProvider, event.data);
        }, this);
        // This listener is used for timings marker, when they are clicked, open the details view for them. They are
        // rendered in the overlays system, not in flame chart (canvas), so need this extra handling.
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").addEventListener(Overlays.Overlays.EventReferenceClick.eventName, event => {
            const eventRef = event;
            const fromTraceEvent = selectionFromEvent(eventRef.event);
            this.openSelectionDetailsView(fromTraceEvent);
        });
        // This is for the detail view of layout shift.
        this.element.addEventListener(TimelineInsights.EventRef.EventReferenceClick.eventName, event => {
            this.setSelectionAndReveal(selectionFromEvent(event.event));
        });
        this.element.addEventListener('keydown', __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_keydownHandler).bind(this));
        this.element.addEventListener('pointerdown', __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_pointerDownHandler).bind(this));
        __classPrivateFieldSet(this, _TimelineFlameChartView_boundRefreshAfterIgnoreList, __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_refreshAfterIgnoreList).bind(this), "f");
        __classPrivateFieldSet(this, _TimelineFlameChartView_selectedEvents, null, "f");
        this.groupBySetting = Common.Settings.Settings.instance().createSetting('timeline-tree-group-by', AggregatedTimelineTreeView.GroupBy.None);
        this.groupBySetting.addChangeListener(this.refreshMainFlameChart, this);
        this.refreshMainFlameChart();
        TraceBounds.TraceBounds.onChange(__classPrivateFieldGet(this, _TimelineFlameChartView_onTraceBoundsChangeBound, "f"));
    }
    containingElement() {
        return this.element;
    }
    // Activates or disables dimming when setting is toggled.
    dimThirdPartiesIfRequired() {
        if (!__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f")) {
            return;
        }
        const dim = Common.Settings.Settings.instance().createSetting('timeline-dim-third-parties', false).get();
        const thirdPartyEvents = __classPrivateFieldGet(this, _TimelineFlameChartView_entityMapper, "f")?.thirdPartyEvents() ?? [];
        if (dim && thirdPartyEvents.length) {
            __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithEvents).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_thirdPartyCheckboxDimmer, "f"), thirdPartyEvents);
        }
        else {
            __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithEvents).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_thirdPartyCheckboxDimmer, "f"), null);
        }
    }
    setMarkers(parsedTrace) {
        if (!parsedTrace) {
            return;
        }
        // Clear out any markers.
        this.bulkRemoveOverlays(__classPrivateFieldGet(this, _TimelineFlameChartView_markers, "f"));
        const markerEvents = parsedTrace.PageLoadMetrics.allMarkerEvents;
        // Set markers for Navigations, LCP, FCP, DCL, L.
        const markers = markerEvents.filter(event => event.name === "navigationStart" /* Trace.Types.Events.Name.NAVIGATION_START */ ||
            event.name === "largestContentfulPaint::Candidate" /* Trace.Types.Events.Name.MARK_LCP_CANDIDATE */ ||
            event.name === "firstContentfulPaint" /* Trace.Types.Events.Name.MARK_FCP */ ||
            event.name === "MarkDOMContent" /* Trace.Types.Events.Name.MARK_DOM_CONTENT */ ||
            event.name === "MarkLoad" /* Trace.Types.Events.Name.MARK_LOAD */);
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_sortMarkersForPreferredVisualOrder).call(this, markers);
        const overlayByTs = new Map();
        markers.forEach(marker => {
            const adjustedTimestamp = Trace.Helpers.Timing.timeStampForEventAdjustedByClosestNavigation(marker, parsedTrace.Meta.traceBounds, parsedTrace.Meta.navigationsByNavigationId, parsedTrace.Meta.navigationsByFrameId);
            // If any of the markers overlap in timing, lets put them on the same marker.
            let matchingOverlay = false;
            for (const [ts, overlay] of overlayByTs.entries()) {
                if (Math.abs(marker.ts - ts) <= TIMESTAMP_THRESHOLD_MS) {
                    overlay.entries.push(marker);
                    matchingOverlay = true;
                    break;
                }
            }
            if (!matchingOverlay) {
                const overlay = {
                    type: 'TIMINGS_MARKER',
                    entries: [marker],
                    entryToFieldResult: new Map(),
                    adjustedTimestamp,
                };
                overlayByTs.set(marker.ts, overlay);
            }
        });
        const markerOverlays = [...overlayByTs.values()];
        __classPrivateFieldSet(this, _TimelineFlameChartView_markers, markerOverlays, "f");
        if (__classPrivateFieldGet(this, _TimelineFlameChartView_markers, "f").length === 0) {
            return;
        }
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_amendMarkerWithFieldData).call(this);
        this.bulkAddOverlays(__classPrivateFieldGet(this, _TimelineFlameChartView_markers, "f"));
    }
    setOverlays(overlays, options) {
        this.bulkRemoveOverlays(__classPrivateFieldGet(this, _TimelineFlameChartView_currentInsightOverlays, "f"));
        __classPrivateFieldSet(this, _TimelineFlameChartView_currentInsightOverlays, overlays, "f");
        if (__classPrivateFieldGet(this, _TimelineFlameChartView_currentInsightOverlays, "f").length === 0) {
            return;
        }
        const traceBounds = TraceBounds.TraceBounds.BoundsManager.instance().state()?.micro.entireTraceBounds;
        if (!traceBounds) {
            return;
        }
        this.bulkAddOverlays(__classPrivateFieldGet(this, _TimelineFlameChartView_currentInsightOverlays, "f"));
        const entries = [];
        for (const overlay of __classPrivateFieldGet(this, _TimelineFlameChartView_currentInsightOverlays, "f")) {
            entries.push(...Overlays.Overlays.entriesForOverlay(overlay));
        }
        // The insight's `relatedEvents` property likely already includes the events associated with
        // an overlay, but just in case not, include both arrays. Duplicates are fine.
        let relatedEventsList = __classPrivateFieldGet(this, _TimelineFlameChartView_activeInsight, "f")?.model.relatedEvents;
        if (!relatedEventsList) {
            relatedEventsList = [];
        }
        else if (relatedEventsList instanceof Map) {
            relatedEventsList = Array.from(relatedEventsList.keys());
        }
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_dimInsightRelatedEvents).call(this, [...entries, ...relatedEventsList]);
        if (options.updateTraceWindow) {
            // We should only expand the entry track when we are updating the trace window
            // (eg. when insight cards are initially opened).
            // Otherwise the track will open when not intending to.
            for (const entry of entries) {
                // Ensure that the track for the entries are open.
                __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_expandEntryTrack).call(this, entry);
            }
            const overlaysBounds = Overlays.Overlays.traceWindowContainingOverlays(__classPrivateFieldGet(this, _TimelineFlameChartView_currentInsightOverlays, "f"));
            if (overlaysBounds) {
                // Trace window covering all overlays expanded by 50% so that the overlays cover 2/3 (100/150) of the visible window. (Or use provided override)
                const percentage = options.updateTraceWindowPercentage ?? 50;
                const expandedBounds = Trace.Helpers.Timing.expandWindowByPercentOrToOneMillisecond(overlaysBounds, traceBounds, percentage);
                // Set the timeline visible window and ignore the minimap bounds. This
                // allows us to pick a visible window even if the overlays are outside of
                // the current breadcrumb. If this happens, the event listener for
                // BoundsManager changes in TimelineMiniMap will detect it and activate
                // the correct breadcrumb for us.
                TraceBounds.TraceBounds.BoundsManager.instance().setTimelineVisibleWindow(expandedBounds, { ignoreMiniMapBounds: true, shouldAnimate: true });
            }
        }
        // Reveal entry if we have one.
        if (entries.length !== 0) {
            const earliestEntry = entries.reduce((earliest, current) => (earliest.ts < current.ts ? earliest : current), entries[0]);
            this.revealEventVertically(earliestEntry);
        }
    }
    revealAnnotation(annotation) {
        const traceBounds = TraceBounds.TraceBounds.BoundsManager.instance().state()?.micro.entireTraceBounds;
        if (!traceBounds) {
            return;
        }
        const annotationWindow = getAnnotationWindow(annotation);
        if (!annotationWindow) {
            return;
        }
        const annotationEntries = getAnnotationEntries(annotation);
        for (const entry of annotationEntries) {
            __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_expandEntryTrack).call(this, entry);
        }
        const firstEntry = annotationEntries.at(0);
        if (firstEntry) {
            this.revealEventVertically(firstEntry);
        }
        // Trace window covering all overlays expanded by 100% so that the overlays cover 50% of the visible window.
        const expandedBounds = Trace.Helpers.Timing.expandWindowByPercentOrToOneMillisecond(annotationWindow, traceBounds, 100);
        TraceBounds.TraceBounds.BoundsManager.instance().setTimelineVisibleWindow(expandedBounds, { ignoreMiniMapBounds: true, shouldAnimate: true });
    }
    setActiveInsight(insight) {
        __classPrivateFieldSet(this, _TimelineFlameChartView_activeInsight, insight, "f");
        this.bulkRemoveOverlays(__classPrivateFieldGet(this, _TimelineFlameChartView_currentInsightOverlays, "f"));
        if (!__classPrivateFieldGet(this, _TimelineFlameChartView_activeInsight, "f")) {
            __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithEvents).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_activeInsightDimmer, "f"), null);
        }
    }
    addTimestampMarkerOverlay(timestamp) {
        // TIMESTAMP_MARKER is a singleton. If one already exists, it will
        // be updated instead of creating a new one.
        this.addOverlay({
            type: 'TIMESTAMP_MARKER',
            timestamp,
        });
    }
    async removeTimestampMarkerOverlay() {
        const removedCount = __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").removeOverlaysOfType('TIMESTAMP_MARKER');
        if (removedCount > 0) {
            // Don't trigger lots of updates on a mouse move if we didn't actually
            // remove any overlays.
            await __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").update();
        }
    }
    forceAnimationsForTest() {
        __classPrivateFieldSet(this, _TimelineFlameChartView_checkReducedMotion, false, "f");
    }
    runBrickBreakerGame() {
        if (!SHOULD_SHOW_EASTER_EGG) {
            return;
        }
        if ([...this.element.childNodes].find(child => child instanceof PerfUI.BrickBreaker.BrickBreaker)) {
            return;
        }
        this.brickGame = new PerfUI.BrickBreaker.BrickBreaker(this.mainFlameChart);
        this.brickGame.classList.add('brick-game');
        this.element.append(this.brickGame);
    }
    getLinkSelectionAnnotation() {
        return __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f");
    }
    getMainDataProvider() {
        return this.mainDataProvider;
    }
    getNetworkDataProvider() {
        return this.networkDataProvider;
    }
    refreshMainFlameChart() {
        this.mainFlameChart.update();
    }
    windowChanged(windowStartTime, windowEndTime, animate) {
        TraceBounds.TraceBounds.BoundsManager.instance().setTimelineVisibleWindow(Trace.Helpers.Timing.traceWindowFromMilliSeconds(Trace.Types.Timing.Milli(windowStartTime), Trace.Types.Timing.Milli(windowEndTime)), { shouldAnimate: animate });
    }
    /**
     * @param startTime - the start time of the selection in MilliSeconds
     * @param endTime - the end time of the selection in MilliSeconds
     * TODO(crbug.com/346312365): update the type definitions in ChartViewport.ts
     */
    updateRangeSelection(startTime, endTime) {
        this.delegate.select(selectionFromRangeMilliSeconds(Trace.Types.Timing.Milli(startTime), Trace.Types.Timing.Milli(endTime)));
        // We need to check if the user is updating the range because they are
        // creating a time range annotation.
        const bounds = Trace.Helpers.Timing.traceWindowFromMilliSeconds(Trace.Types.Timing.Milli(startTime), Trace.Types.Timing.Milli(endTime));
        // If the current time range annotation exists, the range selection
        // for it is in progress and we need to update its bounds.
        //
        // When the range selection is finished, the current range is set to null.
        // If the current selection is null, create a new time range annotations.
        if (__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f")) {
            __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds = bounds;
            ModificationsManager.activeManager()?.updateAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f"));
        }
        else {
            __classPrivateFieldSet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, {
                type: 'TIME_RANGE',
                label: '',
                bounds,
            }, "f");
            // Before creating a new range, make sure to delete the empty ranges.
            ModificationsManager.activeManager()?.deleteEmptyRangeAnnotations();
            ModificationsManager.activeManager()?.createAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f"));
        }
    }
    getMainFlameChart() {
        return this.mainFlameChart;
    }
    // This function is public for test purpose.
    getNetworkFlameChart() {
        return this.networkFlameChart;
    }
    updateSelectedGroup(flameChart, group) {
        if (flameChart !== this.mainFlameChart || __classPrivateFieldGet(this, _TimelineFlameChartView_selectedGroupName, "f") === group?.name) {
            return;
        }
        __classPrivateFieldSet(this, _TimelineFlameChartView_selectedGroupName, group?.name || null, "f");
        __classPrivateFieldSet(this, _TimelineFlameChartView_selectedEvents, group ? this.mainDataProvider.groupTreeEvents(group) : null, "f");
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateDetailViews).call(this);
    }
    setModel(newParsedTrace, traceMetadata) {
        if (newParsedTrace === __classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _TimelineFlameChartView_parsedTrace, newParsedTrace, "f");
        __classPrivateFieldSet(this, _TimelineFlameChartView_traceMetadata, traceMetadata, "f");
        if (traceMetadata?.visualTrackConfig) {
            __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_addPersistedConfigToSettings).call(this, newParsedTrace, traceMetadata.visualTrackConfig);
        }
        for (const dimmer of __classPrivateFieldGet(this, _TimelineFlameChartView_flameChartDimmers, "f")) {
            dimmer.active = false;
            dimmer.mainChartIndices = [];
            dimmer.networkChartIndices = [];
        }
        this.rebuildDataForTrace();
    }
    /**
     * Resets the state of the UI data and initializes it again with the
     * current parsed trace.
     */
    rebuildDataForTrace() {
        if (!__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _TimelineFlameChartView_selectedGroupName, null, "f");
        Common.EventTarget.removeEventListeners(this.eventListeners);
        __classPrivateFieldSet(this, _TimelineFlameChartView_selectedEvents, null, "f");
        __classPrivateFieldSet(this, _TimelineFlameChartView_entityMapper, new Utils.EntityMapper.EntityMapper(__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f")), "f");
        // order is important: |reset| needs to be called after the trace
        // model has been set in the data providers.
        this.mainDataProvider.setModel(__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f"), __classPrivateFieldGet(this, _TimelineFlameChartView_entityMapper, "f"));
        this.networkDataProvider.setModel(__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f"), __classPrivateFieldGet(this, _TimelineFlameChartView_entityMapper, "f"));
        this.reset();
        // The order here is quite subtle; but the reset() call above clears out
        // any state in the flame charts. We then need to provide it with any
        // persisted group settings here, before it recalculates the timeline data
        // and draws the UI.
        const mainChartConfig = __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_getPersistedConfigForTrace).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f"), __classPrivateFieldGet(this, _TimelineFlameChartView_mainPersistedGroupConfigSetting, "f"));
        if (mainChartConfig) {
            this.mainFlameChart.setPersistedConfig(mainChartConfig);
        }
        const networkChartConfig = __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_getPersistedConfigForTrace).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f"), __classPrivateFieldGet(this, _TimelineFlameChartView_networkPersistedGroupConfigSetting, "f"));
        if (networkChartConfig) {
            this.networkFlameChart.setPersistedConfig(networkChartConfig);
        }
        // setupWindowTimes() will trigger timelineData to be regenerated.
        this.setupWindowTimes();
        this.updateSearchResults(false, false);
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameCharts).call(this);
        this.resizeToPreferredHeights();
        this.setMarkers(__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f"));
        this.dimThirdPartiesIfRequired();
        ModificationsManager.activeManager()?.applyAnnotationsFromCache();
    }
    /**
     * Gets the persisted config (if the user has made any visual changes) in
     * order to save it to disk as part of the trace.
     */
    getPersistedConfigMetadata(trace) {
        const main = __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_getPersistedConfigForTrace).call(this, trace, __classPrivateFieldGet(this, _TimelineFlameChartView_mainPersistedGroupConfigSetting, "f"));
        const network = __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_getPersistedConfigForTrace).call(this, trace, __classPrivateFieldGet(this, _TimelineFlameChartView_networkPersistedGroupConfigSetting, "f"));
        return { main, network };
    }
    setInsights(insights, eventToRelatedInsightsMap) {
        if (__classPrivateFieldGet(this, _TimelineFlameChartView_traceInsightSets, "f") === insights) {
            return;
        }
        __classPrivateFieldSet(this, _TimelineFlameChartView_traceInsightSets, insights, "f");
        __classPrivateFieldSet(this, _TimelineFlameChartView_eventToRelatedInsightsMap, eventToRelatedInsightsMap, "f");
        // The DetailsView is provided with the InsightSets, so make sure we update it.
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateDetailViews).call(this);
    }
    reset() {
        if (this.networkDataProvider.isEmpty()) {
            this.mainFlameChart.enableRuler(true);
            this.networkSplitWidget.hideSidebar();
        }
        else {
            this.mainFlameChart.enableRuler(false);
            this.networkSplitWidget.showBoth();
            this.resizeToPreferredHeights();
        }
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").reset();
        this.mainFlameChart.reset();
        this.networkFlameChart.reset();
        this.updateSearchResults(false, false);
    }
    // TODO(paulirish): It's possible this is being called more than necessary. Attempt to clean up the lifecycle.
    setupWindowTimes() {
        const traceBoundsState = TraceBounds.TraceBounds.BoundsManager.instance().state();
        if (!traceBoundsState) {
            throw new Error('TimelineFlameChartView could not set the window bounds.');
        }
        const visibleWindow = traceBoundsState.milli.timelineTraceWindow;
        this.mainFlameChart.setWindowTimes(visibleWindow.min, visibleWindow.max);
        this.networkDataProvider.setWindowTimes(visibleWindow.min, visibleWindow.max);
        this.networkFlameChart.setWindowTimes(visibleWindow.min, visibleWindow.max);
    }
    // If an entry is hovered over and a creation of link annotation is in progress, update that annotation with a hovered entry.
    updateLinkSelectionAnnotationWithToEntry(dataProvider, entryIndex) {
        if (!__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f") ||
            __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").state === "creation_not_started" /* Trace.Types.File.EntriesLinkState.CREATION_NOT_STARTED */) {
            return;
        }
        const toSelectionObject = __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_selectionIfTraceEvent).call(this, entryIndex, dataProvider);
        if (toSelectionObject) {
            // Prevent the user from creating a link that connects an entry to itself.
            if (toSelectionObject === __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").entryFrom) {
                return;
            }
            // Prevent the user from creating a link that connects an entry it's already connected to.
            const linkBetweenEntriesExists = ModificationsManager.activeManager()?.linkAnnotationBetweenEntriesExists(__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").entryFrom, toSelectionObject);
            if (linkBetweenEntriesExists) {
                return;
            }
            __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").state = "connected" /* Trace.Types.File.EntriesLinkState.CONNECTED */;
            __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").entryTo = toSelectionObject;
        }
        else {
            __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").state = "pending_to_event" /* Trace.Types.File.EntriesLinkState.PENDING_TO_EVENT */;
            delete __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f")['entryTo'];
        }
        ModificationsManager.activeManager()?.updateAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f"));
    }
    onEntryHovered(commonEvent) {
        SDK.OverlayModel.OverlayModel.hideDOMNodeHighlight();
        const entryIndex = commonEvent.data;
        const event = this.mainDataProvider.eventByIndex(entryIndex);
        if (!event || !__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f")) {
            return;
        }
        if (Trace.Types.Events.isLegacyTimelineFrame(event)) {
            return;
        }
        const target = targetForEvent(__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f"), event);
        if (!target) {
            return;
        }
        const nodeIds = Utils.EntryNodes.nodeIdsForEvent(__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f"), event);
        for (const nodeId of nodeIds) {
            new SDK.DOMModel.DeferredDOMNode(target, nodeId).highlight();
        }
    }
    highlightEvent(event) {
        const entryIndex = event ? this.mainDataProvider.entryIndexForSelection(selectionFromEvent(event)) : -1;
        if (entryIndex >= 0) {
            this.mainFlameChart.highlightEntry(entryIndex);
        }
        else {
            this.mainFlameChart.hideHighlight();
        }
    }
    willHide() {
        __classPrivateFieldGet(this, _TimelineFlameChartView_networkPersistedGroupConfigSetting, "f").removeChangeListener(this.resizeToPreferredHeights, this);
        Bindings.IgnoreListManager.IgnoreListManager.instance().removeChangeListener(__classPrivateFieldGet(this, _TimelineFlameChartView_boundRefreshAfterIgnoreList, "f"));
    }
    wasShown() {
        super.wasShown();
        __classPrivateFieldGet(this, _TimelineFlameChartView_networkPersistedGroupConfigSetting, "f").addChangeListener(this.resizeToPreferredHeights, this);
        Bindings.IgnoreListManager.IgnoreListManager.instance().addChangeListener(__classPrivateFieldGet(this, _TimelineFlameChartView_boundRefreshAfterIgnoreList, "f"));
        if (this.needsResizeToPreferredHeights) {
            this.resizeToPreferredHeights();
        }
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameCharts).call(this);
    }
    updateCountersGraphToggle(showMemoryGraph) {
        if (showMemoryGraph) {
            this.chartSplitWidget.showBoth();
        }
        else {
            this.chartSplitWidget.hideSidebar();
        }
    }
    revealEvent(event) {
        const mainIndex = this.mainDataProvider.indexForEvent(event);
        const networkIndex = this.networkDataProvider.indexForEvent(event);
        if (mainIndex !== null) {
            this.mainFlameChart.revealEntry(mainIndex);
        }
        else if (networkIndex !== null) {
            this.networkFlameChart.revealEntry(networkIndex);
        }
    }
    // Given an event, it reveals its position vertically
    revealEventVertically(event) {
        const mainIndex = this.mainDataProvider.indexForEvent(event);
        const networkIndex = this.networkDataProvider.indexForEvent(event);
        if (mainIndex !== null) {
            this.mainFlameChart.revealEntryVertically(mainIndex);
        }
        else if (networkIndex !== null) {
            this.networkFlameChart.revealEntryVertically(networkIndex);
        }
    }
    setSelectionAndReveal(selection) {
        if (selection && __classPrivateFieldGet(this, _TimelineFlameChartView_currentSelection, "f") && selectionsEqual(selection, __classPrivateFieldGet(this, _TimelineFlameChartView_currentSelection, "f"))) {
            return;
        }
        __classPrivateFieldSet(this, _TimelineFlameChartView_currentSelection, selection, "f");
        // Clear any existing entry selection.
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").removeOverlaysOfType('ENTRY_SELECTED');
        // If:
        // 1. There is no selection, or the selection is not a range selection
        // AND 2. we have an active time range selection overlay
        // AND 3. The label of the selection is empty
        // then we need to remove it.
        if ((selection === null || !selectionIsRange(selection)) && __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f") &&
            !__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").label) {
            ModificationsManager.activeManager()?.removeAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f"));
            __classPrivateFieldSet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, null, "f");
        }
        // If we don't have a selection, update the tree view row click dimmer events to null.
        // This is a user disabling the persistent hovering from a row click, ensure the events are cleared.
        if ((selection === null)) {
            __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithEvents).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_treeRowClickDimmer, "f"), null);
        }
        // Check if this is an entry from main flame chart or network flame chart.
        // If so build the initiators and select the entry.
        // Otherwise clear the initiators and the selection.
        //   - This is done by the same functions, when the index is -1, it will clear everything.
        const mainIndex = this.mainDataProvider.entryIndexForSelection(selection);
        this.mainDataProvider.buildFlowForInitiator(mainIndex);
        this.mainFlameChart.setSelectedEntry(mainIndex);
        const networkIndex = this.networkDataProvider.entryIndexForSelection(selection);
        this.networkDataProvider.buildFlowForInitiator(networkIndex);
        this.networkFlameChart.setSelectedEntry(networkIndex);
        if (this.detailsView) {
            // TODO(crbug.com/1459265):  Change to await after migration work.
            void this.detailsView.setSelection(selection);
        }
        // Create the entry selected overlay if the selection represents a trace event
        if (selectionIsEvent(selection)) {
            this.addOverlay({
                type: 'ENTRY_SELECTED',
                entry: selection.event,
            });
        }
        if (__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f") &&
            __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").state === "creation_not_started" /* Trace.Types.File.EntriesLinkState.CREATION_NOT_STARTED */) {
            __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_clearLinkSelectionAnnotation).call(this, true);
        }
        // If the user has selected an event which the Performance AI Assistance
        // supports (currently, only main thread events), then set the context's
        // "flavor" to be the AI Call Tree of the active event.
        // This is listened to by the AI Assistance panel to update its state.
        // Note that we do not change the Context back to `null` if the user picks
        // an invalid event - we don't want to reset it back as it may be they are
        // clicking around in order to understand something.
        // We also do this in a rAF to not block the UI updating to show the selected event first.
        if (selectionIsEvent(selection) && __classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f")) {
            requestAnimationFrame(() => {
                if (!__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f")) {
                    return;
                }
                const aiCallTree = Utils.AICallTree.AICallTree.fromEvent(selection.event, __classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f"));
                if (aiCallTree) {
                    UI.Context.Context.instance().setFlavor(Utils.AICallTree.AICallTree, aiCallTree);
                }
            });
        }
    }
    // Only opens the details view of a selection. This is used for Timing Markers. Timing markers replace
    // their entry with a new UI. Becuase of that, thier entries can no longer be "selected" in the timings track,
    // so if clicked, we only open their details view.
    openSelectionDetailsView(selection) {
        if (this.detailsView) {
            void this.detailsView.setSelection(selection);
        }
    }
    /**
     * Used to create multiple overlays at once without triggering a redraw for each one.
     */
    bulkAddOverlays(overlays) {
        for (const overlay of overlays) {
            __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").add(overlay);
        }
        void __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").update();
    }
    addOverlay(newOverlay) {
        const overlay = __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").add(newOverlay);
        void __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").update();
        return overlay;
    }
    bulkRemoveOverlays(overlays) {
        if (!overlays.length) {
            return;
        }
        for (const overlay of overlays) {
            __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").remove(overlay);
        }
        void __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").update();
    }
    removeOverlay(removedOverlay) {
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").remove(removedOverlay);
        void __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").update();
    }
    updateExistingOverlay(existingOverlay, newData) {
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").updateExisting(existingOverlay, newData);
        void __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").update();
    }
    enterLabelEditMode(overlay) {
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").enterLabelEditMode(overlay);
    }
    bringLabelForward(overlay) {
        __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f").bringLabelForward(overlay);
    }
    onAddEntryLabelAnnotation(dataProvider, event) {
        const selection = dataProvider.createSelection(event.data.entryIndex);
        if (selectionIsEvent(selection)) {
            this.setSelectionAndReveal(selection);
            ModificationsManager.activeManager()?.createAnnotation({
                type: 'ENTRY_LABEL',
                entry: selection.event,
                label: '',
            });
            if (event.data.withLinkCreationButton) {
                this.onEntriesLinkAnnotationCreate(dataProvider, event.data.entryIndex, true);
            }
        }
    }
    onEntriesLinkAnnotationCreate(dataProvider, entryFromIndex, linkCreateButton) {
        const fromSelectionObject = (entryFromIndex) ? __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_selectionIfTraceEvent).call(this, entryFromIndex, dataProvider) : null;
        if (fromSelectionObject) {
            __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_setLinkSelectionAnnotation).call(this, {
                type: 'ENTRIES_LINK',
                entryFrom: fromSelectionObject,
                state: (linkCreateButton) ? "creation_not_started" /* Trace.Types.File.EntriesLinkState.CREATION_NOT_STARTED */ :
                    "pending_to_event" /* Trace.Types.File.EntriesLinkState.PENDING_TO_EVENT */,
            });
            if (__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f")) {
                ModificationsManager.activeManager()?.createAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f"));
            }
        }
    }
    /**
     * This is invoked when the user uses their KEYBOARD ONLY to navigate between
     * events.
     * It IS NOT called when the user uses the mouse. See `onEntryInvoked`.
     */
    onEntrySelected(dataProvider, event) {
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateSelectedEntryStatus).call(this, dataProvider, event);
        // Update any pending link selection to point the entryTo to what the user has selected.
        const entryIndex = event.data;
        const toSelectionObject = __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_selectionIfTraceEvent).call(this, entryIndex, dataProvider);
        if (toSelectionObject && toSelectionObject !== __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f")?.entryTo) {
            this.updateLinkSelectionAnnotationWithToEntry(dataProvider, entryIndex);
        }
    }
    handleToEntryOfLinkBetweenEntriesSelection(toIndex) {
        // If there is a link annotation in the process of being created when an empty
        // space in the Flamechart is clicked, delete the link being created.
        //
        // If an entry is clicked when a link between entries in created and the entry that an arrow
        // is pointing to is earlier than the one it starts from, switch 'to' and 'from' entries to
        // reverse the arrow.
        if (__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f") && toIndex === -1) {
            ModificationsManager.activeManager()?.removeAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f"));
        }
        else if (__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f") && __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f")?.entryTo &&
            (__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f")?.entryFrom.ts > __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f")?.entryTo.ts)) {
            const entryFrom = __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").entryFrom;
            const entryTo = __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").entryTo;
            __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").entryTo = entryFrom;
            __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").entryFrom = entryTo;
            ModificationsManager.activeManager()?.updateAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f"));
        }
        // Regardless of if the link in progress was deleted or the clicked entry is the final selection,
        // set the link selection in progress to null so a new one is created if the an event to create
        // of update the current link is dispatched.
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_clearLinkSelectionAnnotation).call(this, false);
    }
    resizeToPreferredHeights() {
        if (!this.isShowing()) {
            this.needsResizeToPreferredHeights = true;
            return;
        }
        this.needsResizeToPreferredHeights = false;
        this.networkPane.element.classList.toggle('timeline-network-resizer-disabled', !this.networkDataProvider.isExpanded());
        this.networkSplitWidget.setSidebarSize(this.networkDataProvider.preferredHeight() + this.splitResizer.clientHeight + PerfUI.FlameChart.RulerHeight +
            2);
    }
    setSearchableView(searchableView) {
        this.searchableView = searchableView;
    }
    // UI.SearchableView.Searchable implementation
    jumpToNextSearchResult() {
        if (!this.searchResults?.length) {
            return;
        }
        const index = typeof this.selectedSearchResult !== 'undefined' ? this.searchResults.indexOf(this.selectedSearchResult) : -1;
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_selectSearchResult).call(this, Platform.NumberUtilities.mod(index + 1, this.searchResults.length));
    }
    jumpToPreviousSearchResult() {
        if (!this.searchResults?.length) {
            return;
        }
        const index = typeof this.selectedSearchResult !== 'undefined' ? this.searchResults.indexOf(this.selectedSearchResult) : 0;
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_selectSearchResult).call(this, Platform.NumberUtilities.mod(index - 1, this.searchResults.length));
    }
    supportsCaseSensitiveSearch() {
        return true;
    }
    supportsRegexSearch() {
        return true;
    }
    updateSearchResults(shouldJump, jumpBackwards) {
        const traceBoundsState = TraceBounds.TraceBounds.BoundsManager.instance().state();
        if (!traceBoundsState) {
            return;
        }
        const oldSelectedSearchResult = this.selectedSearchResult;
        delete this.selectedSearchResult;
        this.searchResults = [];
        if (!this.searchRegex) {
            return;
        }
        const regExpFilter = new TimelineRegExp(this.searchRegex);
        const visibleWindow = traceBoundsState.micro.timelineTraceWindow;
        /**
         * Get the matches for the user's search result. We search both providers
         * but before storing the results we need to "tag" the results with the
         * provider they came from. We do this so that when the user highlights a
         * search result we know which flame chart to talk to to highlight it.
         */
        const mainMatches = this.mainDataProvider.search(visibleWindow, regExpFilter);
        const networkMatches = this.networkDataProvider.search(visibleWindow, regExpFilter);
        // Merge both result sets into one, sorted by start time. This means as the
        // user navigates back/forwards they will do so in time order and not do
        // all the main results before the network results, or some other
        // unexpected ordering.
        this.searchResults = mainMatches.concat(networkMatches).sort((m1, m2) => {
            return m1.startTimeMilli - m2.startTimeMilli;
        });
        this.searchableView.updateSearchMatchesCount(this.searchResults.length);
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithIndices).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_searchDimmer, "f"), mainMatches.map(m => m.index), networkMatches.map(m => m.index));
        if (!shouldJump || !this.searchResults.length) {
            return;
        }
        let selectedIndex = __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_indexOfSearchResult).call(this, oldSelectedSearchResult);
        if (selectedIndex === -1) {
            selectedIndex = jumpBackwards ? this.searchResults.length - 1 : 0;
        }
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_selectSearchResult).call(this, selectedIndex);
    }
    /**
     * Returns the indexes of the elements that matched the most recent
     * query. Elements are indexed by the data provider and correspond
     * to their position in the data provider entry data array.
     * Public only for tests.
     */
    getSearchResults() {
        return this.searchResults;
    }
    onSearchCanceled() {
        if (typeof this.selectedSearchResult !== 'undefined') {
            this.delegate.select(null);
        }
        delete this.searchResults;
        delete this.selectedSearchResult;
        delete this.searchRegex;
        this.mainFlameChart.showPopoverForSearchResult(null);
        this.networkFlameChart.showPopoverForSearchResult(null);
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithEvents).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_searchDimmer, "f"), null);
    }
    performSearch(searchConfig, shouldJump, jumpBackwards) {
        this.searchRegex = searchConfig.toSearchRegex().regex;
        this.updateSearchResults(shouldJump, jumpBackwards);
    }
    togglePopover({ event, show }) {
        const entryIndex = this.mainDataProvider.indexForEvent(event);
        if (show && entryIndex) {
            this.mainFlameChart.setSelectedEntry(entryIndex);
            this.mainFlameChart.showPopoverForSearchResult(entryIndex);
        }
        else {
            this.mainFlameChart.hideHighlight();
        }
    }
    overlays() {
        return __classPrivateFieldGet(this, _TimelineFlameChartView_overlays, "f");
    }
    selectDetailsViewTab(tabName, node) {
        this.detailsView.selectTab(tabName, node);
    }
}
_TimelineFlameChartView_onMainEntriesLinkAnnotationCreated = new WeakMap(), _TimelineFlameChartView_onNetworkEntriesLinkAnnotationCreated = new WeakMap(), _TimelineFlameChartView_boundRefreshAfterIgnoreList = new WeakMap(), _TimelineFlameChartView_selectedEvents = new WeakMap(), _TimelineFlameChartView_parsedTrace = new WeakMap(), _TimelineFlameChartView_traceMetadata = new WeakMap(), _TimelineFlameChartView_traceInsightSets = new WeakMap(), _TimelineFlameChartView_eventToRelatedInsightsMap = new WeakMap(), _TimelineFlameChartView_selectedGroupName = new WeakMap(), _TimelineFlameChartView_onTraceBoundsChangeBound = new WeakMap(), _TimelineFlameChartView_gameKeyMatches = new WeakMap(), _TimelineFlameChartView_gameTimeout = new WeakMap(), _TimelineFlameChartView_overlaysContainer = new WeakMap(), _TimelineFlameChartView_overlays = new WeakMap(), _TimelineFlameChartView_timeRangeSelectionAnnotation = new WeakMap(), _TimelineFlameChartView_linkSelectionAnnotation = new WeakMap(), _TimelineFlameChartView_currentInsightOverlays = new WeakMap(), _TimelineFlameChartView_activeInsight = new WeakMap(), _TimelineFlameChartView_markers = new WeakMap(), _TimelineFlameChartView_tooltipElement = new WeakMap(), _TimelineFlameChartView_loggableForGroupByLogContext = new WeakMap(), _TimelineFlameChartView_onMainEntryInvoked = new WeakMap(), _TimelineFlameChartView_onNetworkEntryInvoked = new WeakMap(), _TimelineFlameChartView_currentSelection = new WeakMap(), _TimelineFlameChartView_entityMapper = new WeakMap(), _TimelineFlameChartView_flameChartDimmers = new WeakMap(), _TimelineFlameChartView_searchDimmer = new WeakMap(), _TimelineFlameChartView_treeRowHoverDimmer = new WeakMap(), _TimelineFlameChartView_treeRowClickDimmer = new WeakMap(), _TimelineFlameChartView_activeInsightDimmer = new WeakMap(), _TimelineFlameChartView_thirdPartyCheckboxDimmer = new WeakMap(), _TimelineFlameChartView_checkReducedMotion = new WeakMap(), _TimelineFlameChartView_networkPersistedGroupConfigSetting = new WeakMap(), _TimelineFlameChartView_mainPersistedGroupConfigSetting = new WeakMap(), _TimelineFlameChartView_instances = new WeakSet(), _TimelineFlameChartView_registerFlameChartDimmer = function _TimelineFlameChartView_registerFlameChartDimmer(opts) {
    const dimmer = {
        active: false,
        mainChartIndices: [],
        networkChartIndices: [],
        inclusive: opts.inclusive,
        outline: opts.outline
    };
    __classPrivateFieldGet(this, _TimelineFlameChartView_flameChartDimmers, "f").push(dimmer);
    return dimmer;
}, _TimelineFlameChartView_updateFlameChartDimmerWithEvents = function _TimelineFlameChartView_updateFlameChartDimmerWithEvents(dimmer, events) {
    if (events) {
        dimmer.active = true;
        dimmer.mainChartIndices = events.map(event => this.mainDataProvider.indexForEvent(event) ?? -1);
        dimmer.networkChartIndices = events.map(event => this.networkDataProvider.indexForEvent(event) ?? -1);
    }
    else {
        dimmer.active = false;
        dimmer.mainChartIndices = [];
        dimmer.networkChartIndices = [];
    }
    __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_refreshDimming).call(this);
}, _TimelineFlameChartView_updateFlameChartDimmerWithIndices = function _TimelineFlameChartView_updateFlameChartDimmerWithIndices(dimmer, mainChartIndices, networkChartIndices) {
    dimmer.active = true;
    dimmer.mainChartIndices = mainChartIndices;
    dimmer.networkChartIndices = networkChartIndices;
    __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_refreshDimming).call(this);
}, _TimelineFlameChartView_refreshDimming = function _TimelineFlameChartView_refreshDimming() {
    const dimmer = __classPrivateFieldGet(this, _TimelineFlameChartView_flameChartDimmers, "f").find(dimmer => dimmer.active);
    // This checkbox should only be enabled if its dimmer is being used.
    this.delegate.set3PCheckboxDisabled(Boolean(dimmer && dimmer !== __classPrivateFieldGet(this, _TimelineFlameChartView_thirdPartyCheckboxDimmer, "f")));
    if (!dimmer) {
        this.mainFlameChart.disableDimming();
        this.networkFlameChart.disableDimming();
        return;
    }
    const mainOutline = typeof dimmer.outline === 'boolean' ? dimmer.outline : dimmer.outline.main;
    const networkOutline = typeof dimmer.outline === 'boolean' ? dimmer.outline : dimmer.outline.network;
    this.mainFlameChart.enableDimming(dimmer.mainChartIndices, dimmer.inclusive, mainOutline);
    this.networkFlameChart.enableDimming(dimmer.networkChartIndices, dimmer.inclusive, networkOutline);
}, _TimelineFlameChartView_dimInsightRelatedEvents = function _TimelineFlameChartView_dimInsightRelatedEvents(relatedEvents) {
    // Dim all events except those related to the active insight.
    const relatedMainIndices = relatedEvents.map(event => this.mainDataProvider.indexForEvent(event) ?? -1);
    const relatedNetworkIndices = relatedEvents.map(event => this.networkDataProvider.indexForEvent(event) ?? -1);
    // Only outline the events that are individually/specifically identified as being related. Don't outline
    // the events covered by range overlays.
    __classPrivateFieldGet(this, _TimelineFlameChartView_activeInsightDimmer, "f").outline = {
        main: [...relatedMainIndices],
        network: [...relatedNetworkIndices],
    };
    // Further, overlays defining a trace bounds do not dim an event that falls within those bounds.
    for (const overlay of __classPrivateFieldGet(this, _TimelineFlameChartView_currentInsightOverlays, "f")) {
        let bounds;
        if (overlay.type === 'TIMESPAN_BREAKDOWN') {
            const firstSection = overlay.sections.at(0);
            const lastSection = overlay.sections.at(-1);
            if (firstSection && lastSection) {
                bounds = Trace.Helpers.Timing.traceWindowFromMicroSeconds(firstSection.bounds.min, lastSection.bounds.max);
            }
        }
        else if (overlay.type === 'TIME_RANGE') {
            bounds = overlay.bounds;
        }
        if (!bounds) {
            continue;
        }
        let provider, relevantEvents;
        // Using a relevant event for the overlay, determine which provider this overlay is for.
        const overlayEvent = Overlays.Overlays.entriesForOverlay(overlay).at(0);
        if (overlayEvent) {
            if (this.mainDataProvider.indexForEvent(overlayEvent) !== null) {
                provider = this.mainDataProvider;
                relevantEvents = relatedMainIndices;
            }
            else if (this.networkDataProvider.indexForEvent(overlayEvent) !== null) {
                provider = this.networkDataProvider;
                relevantEvents = relatedNetworkIndices;
            }
        }
        else if (overlay.type === 'TIMESPAN_BREAKDOWN') {
            // For this overlay type, if there is no associated event it is rendered on mainFlameChart.
            provider = this.mainDataProvider;
            relevantEvents = relatedMainIndices;
        }
        if (!provider || !relevantEvents) {
            continue;
        }
        relevantEvents.push(...provider.search(bounds).map(r => r.index));
    }
    __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateFlameChartDimmerWithIndices).call(this, __classPrivateFieldGet(this, _TimelineFlameChartView_activeInsightDimmer, "f"), relatedMainIndices, relatedNetworkIndices);
}, _TimelineFlameChartView_sortMarkersForPreferredVisualOrder = function _TimelineFlameChartView_sortMarkersForPreferredVisualOrder(markers) {
    markers.sort((m1, m2) => {
        const m1Index = SORT_ORDER_PAGE_LOAD_MARKERS[m1.name] ?? Infinity;
        const m2Index = SORT_ORDER_PAGE_LOAD_MARKERS[m2.name] ?? Infinity;
        return m1Index - m2Index;
    });
}, _TimelineFlameChartView_amendMarkerWithFieldData = function _TimelineFlameChartView_amendMarkerWithFieldData() {
    if (!__classPrivateFieldGet(this, _TimelineFlameChartView_traceMetadata, "f")?.cruxFieldData || !__classPrivateFieldGet(this, _TimelineFlameChartView_traceInsightSets, "f")) {
        return;
    }
    const fieldMetricResultsByNavigationId = new Map();
    for (const [key, insightSet] of __classPrivateFieldGet(this, _TimelineFlameChartView_traceInsightSets, "f")) {
        if (insightSet.navigation) {
            fieldMetricResultsByNavigationId.set(key, Trace.Insights.Common.getFieldMetricsForInsightSet(insightSet, __classPrivateFieldGet(this, _TimelineFlameChartView_traceMetadata, "f"), CrUXManager.CrUXManager.instance().getSelectedScope()));
        }
    }
    for (const marker of __classPrivateFieldGet(this, _TimelineFlameChartView_markers, "f")) {
        for (const event of marker.entries) {
            const navigationId = event.args?.data?.navigationId;
            if (!navigationId) {
                continue;
            }
            const fieldMetricResults = fieldMetricResultsByNavigationId.get(navigationId);
            if (!fieldMetricResults) {
                continue;
            }
            let fieldMetricResult;
            if (event.name === "firstContentfulPaint" /* Trace.Types.Events.Name.MARK_FCP */) {
                fieldMetricResult = fieldMetricResults.fcp;
            }
            else if (event.name === "largestContentfulPaint::Candidate" /* Trace.Types.Events.Name.MARK_LCP_CANDIDATE */) {
                fieldMetricResult = fieldMetricResults.lcp;
            }
            if (!fieldMetricResult) {
                continue;
            }
            marker.entryToFieldResult.set(event, fieldMetricResult);
        }
    }
}, _TimelineFlameChartView_expandEntryTrack = function _TimelineFlameChartView_expandEntryTrack(entry) {
    const chartName = Overlays.Overlays.chartForEntry(entry);
    const provider = chartName === 'main' ? this.mainDataProvider : this.networkDataProvider;
    const entryChart = chartName === 'main' ? this.mainFlameChart : this.networkFlameChart;
    const entryIndex = provider.indexForEvent?.(entry) ?? null;
    if (entryIndex === null) {
        return;
    }
    const group = provider.groupForEvent?.(entryIndex) ?? null;
    if (!group) {
        return;
    }
    const groupIndex = provider.timelineData().groups.indexOf(group);
    if (!group.expanded && groupIndex > -1) {
        entryChart.toggleGroupExpand(groupIndex);
    }
}, _TimelineFlameChartView_processFlameChartMouseMoveEvent = async function _TimelineFlameChartView_processFlameChartMouseMoveEvent(data) {
    const { mouseEvent, timeInMicroSeconds } = data;
    // If the user is no longer holding shift, remove any existing marker.
    if (!mouseEvent.shiftKey) {
        await this.removeTimestampMarkerOverlay();
    }
    if (!mouseEvent.metaKey && mouseEvent.shiftKey) {
        this.addTimestampMarkerOverlay(timeInMicroSeconds);
    }
}, _TimelineFlameChartView_pointerDownHandler = function _TimelineFlameChartView_pointerDownHandler(event) {
    /**
     * If the user is in the middle of creating an entry link annotation and
     * right clicks, let's take that as a sign to exit and cancel.
     * (buttons === 2 indicates a right click)
     */
    if (event.buttons === 2 && __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f")) {
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_clearLinkSelectionAnnotation).call(this, true);
        event.stopPropagation();
    }
}, _TimelineFlameChartView_clearLinkSelectionAnnotation = function _TimelineFlameChartView_clearLinkSelectionAnnotation(deleteCurrentLink) {
    if (__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f") === null) {
        return;
    }
    // If the link in progress in cleared, make sure it's creation is complete. If not, delete it.
    if (deleteCurrentLink || __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").state !== "connected" /* Trace.Types.File.EntriesLinkState.CONNECTED */) {
        ModificationsManager.activeManager()?.removeAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f"));
    }
    this.mainFlameChart.setLinkSelectionAnnotationIsInProgress(false);
    this.networkFlameChart.setLinkSelectionAnnotationIsInProgress(false);
    __classPrivateFieldSet(this, _TimelineFlameChartView_linkSelectionAnnotation, null, "f");
}, _TimelineFlameChartView_setLinkSelectionAnnotation = function _TimelineFlameChartView_setLinkSelectionAnnotation(linkSelectionAnnotation) {
    this.mainFlameChart.setLinkSelectionAnnotationIsInProgress(true);
    this.networkFlameChart.setLinkSelectionAnnotationIsInProgress(true);
    __classPrivateFieldSet(this, _TimelineFlameChartView_linkSelectionAnnotation, linkSelectionAnnotation, "f");
}, _TimelineFlameChartView_createNewTimeRangeFromKeyboard = function _TimelineFlameChartView_createNewTimeRangeFromKeyboard(startTime, endTime) {
    if (__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f")) {
        return;
    }
    __classPrivateFieldSet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, {
        bounds: Trace.Helpers.Timing.traceWindowFromMicroSeconds(startTime, endTime),
        type: 'TIME_RANGE',
        label: '',
    }, "f");
    ModificationsManager.activeManager()?.createAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f"));
}, _TimelineFlameChartView_handleTimeRangeKeyboardCreation = function _TimelineFlameChartView_handleTimeRangeKeyboardCreation(event) {
    const visibleWindow = TraceBounds.TraceBounds.BoundsManager.instance().state()?.micro.timelineTraceWindow;
    if (!visibleWindow) {
        return false;
    }
    // The amount we increment the time range by when using the arrow keys is
    // 2% of the visible window.
    const timeRangeIncrementValue = visibleWindow.range * 0.02;
    switch (event.key) {
        // ArrowLeft + ArrowRight adjusts the right hand bound (the max) of the time range
        // alt/option + ArrowRight also starts a range if there isn't one already
        case 'ArrowRight': {
            if (!__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f")) {
                if (event.altKey) {
                    let startTime = visibleWindow.min;
                    // Prefer the start time of the selected event, if there is one.
                    if (__classPrivateFieldGet(this, _TimelineFlameChartView_currentSelection, "f")) {
                        startTime = rangeForSelection(__classPrivateFieldGet(this, _TimelineFlameChartView_currentSelection, "f")).min;
                    }
                    __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_createNewTimeRangeFromKeyboard).call(this, startTime, Trace.Types.Timing.Micro(startTime + timeRangeIncrementValue));
                    return true;
                }
                return false;
            }
            // Grow the RHS of the range, but limit it to the visible window.
            __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.max = Trace.Types.Timing.Micro(Math.min(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.max + timeRangeIncrementValue, visibleWindow.max));
            __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.range = Trace.Types.Timing.Micro(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.max - __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.min);
            ModificationsManager.activeManager()?.updateAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f"));
            return true;
        }
        case 'ArrowLeft': {
            if (!__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f")) {
                return false;
            }
            __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.max = Trace.Types.Timing.Micro(
            // Shrink the RHS of the range, but make sure it cannot go below the min value.
            Math.max(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.max - timeRangeIncrementValue, __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.min + 1));
            __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.range = Trace.Types.Timing.Micro(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.max - __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.min);
            ModificationsManager.activeManager()?.updateAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f"));
            return true;
        }
        // ArrowDown + ArrowUp adjusts the left hand bound (the min) of the time range
        case 'ArrowUp': {
            if (!__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f")) {
                return false;
            }
            __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.min = Trace.Types.Timing.Micro(
            // Increase the LHS of the range, but make sure it cannot go above the max value.
            Math.min(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.min + timeRangeIncrementValue, __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.max - 1));
            __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.range = Trace.Types.Timing.Micro(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.max - __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.min);
            ModificationsManager.activeManager()?.updateAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f"));
            return true;
        }
        case 'ArrowDown': {
            if (!__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f")) {
                return false;
            }
            __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.min = Trace.Types.Timing.Micro(
            // Decrease the LHS, but make sure it cannot go beyond the minimum visible window.
            Math.max(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.min - timeRangeIncrementValue, visibleWindow.min));
            __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.range = Trace.Types.Timing.Micro(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.max - __classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f").bounds.min);
            ModificationsManager.activeManager()?.updateAnnotation(__classPrivateFieldGet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, "f"));
            return true;
        }
        default: {
            // If we get any other key, we take that as a sign the user is done. Most likely the keys come from them typing into the label :)
            // If they do not type into the label, then the time range is not created.
            __classPrivateFieldSet(this, _TimelineFlameChartView_timeRangeSelectionAnnotation, null, "f");
            return false;
        }
    }
}, _TimelineFlameChartView_keydownHandler = function _TimelineFlameChartView_keydownHandler(event) {
    var _a;
    const keyCombo = 'fixme';
    // `CREATION_NOT_STARTED` is only true in the state when both empty label and button to create connection are
    // created at the same time. If any key is typed in that state, it means that the label is in focus and the key
    // is typed into the label. This tells us that the user chose to create the
    // label, not the connection. In that case, delete the connection.
    if (__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f") &&
        __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f").state === "creation_not_started" /* Trace.Types.File.EntriesLinkState.CREATION_NOT_STARTED */) {
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_clearLinkSelectionAnnotation).call(this, true);
        // We have dealt with the keypress as the user is typing into the label, so do not let it propogate up.
        // This also ensures that if the user uses "Escape" they don't toggle the DevTools drawer.
        event.stopPropagation();
    }
    /**
     * If the user is in the middle of creating an entry link and hits Esc,
     * cancel and clear out the pending annotation.
     */
    if (event.key === 'Escape' && __classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f")) {
        __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_clearLinkSelectionAnnotation).call(this, true);
        event.stopPropagation();
        event.preventDefault();
    }
    const eventHandledByKeyboardTimeRange = __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_handleTimeRangeKeyboardCreation).call(this, event);
    if (eventHandledByKeyboardTimeRange) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    if (event.key === keyCombo[__classPrivateFieldGet(this, _TimelineFlameChartView_gameKeyMatches, "f")]) {
        __classPrivateFieldSet(this, _TimelineFlameChartView_gameKeyMatches, (_a = __classPrivateFieldGet(this, _TimelineFlameChartView_gameKeyMatches, "f"), _a++, _a), "f");
        clearTimeout(__classPrivateFieldGet(this, _TimelineFlameChartView_gameTimeout, "f"));
        __classPrivateFieldSet(this, _TimelineFlameChartView_gameTimeout, setTimeout(() => {
            __classPrivateFieldSet(this, _TimelineFlameChartView_gameKeyMatches, 0, "f");
        }, 2000), "f");
    }
    else {
        __classPrivateFieldSet(this, _TimelineFlameChartView_gameKeyMatches, 0, "f");
        clearTimeout(__classPrivateFieldGet(this, _TimelineFlameChartView_gameTimeout, "f"));
    }
    if (__classPrivateFieldGet(this, _TimelineFlameChartView_gameKeyMatches, "f") !== keyCombo.length) {
        return;
    }
    this.runBrickBreakerGame();
}, _TimelineFlameChartView_onTraceBoundsChange = function _TimelineFlameChartView_onTraceBoundsChange(event) {
    if (event.updateType === 'MINIMAP_BOUNDS') {
        // If the update type was a changing of the minimap bounds, we do not
        // need to redraw the timeline.
        return;
    }
    const visibleWindow = event.state.milli.timelineTraceWindow;
    // If the user has set a preference for reduced motion, we disable any animations.
    const userHasReducedMotionSet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldAnimate = Boolean(event.options.shouldAnimate) && (__classPrivateFieldGet(this, _TimelineFlameChartView_checkReducedMotion, "f") ? !userHasReducedMotionSet : true);
    this.mainFlameChart.setWindowTimes(visibleWindow.min, visibleWindow.max, shouldAnimate);
    this.networkDataProvider.setWindowTimes(visibleWindow.min, visibleWindow.max);
    this.networkFlameChart.setWindowTimes(visibleWindow.min, visibleWindow.max, shouldAnimate);
    // Updating search results can be very expensive. Debounce to avoid over-calling it.
    const debouncedUpdate = Common.Debouncer.debounce(() => {
        this.updateSearchResults(false, false);
    }, 100);
    debouncedUpdate();
}, _TimelineFlameChartView_addPersistedConfigToSettings = function _TimelineFlameChartView_addPersistedConfigToSettings(trace, visualConfigForTrace) {
    const key = keyForTraceConfig(trace);
    if (visualConfigForTrace.main) {
        const mainSetting = __classPrivateFieldGet(this, _TimelineFlameChartView_mainPersistedGroupConfigSetting, "f").get();
        mainSetting[key] = mainSetting[key] ?? visualConfigForTrace.main;
        __classPrivateFieldGet(this, _TimelineFlameChartView_mainPersistedGroupConfigSetting, "f").set(mainSetting);
    }
    if (visualConfigForTrace.network) {
        const networkSetting = __classPrivateFieldGet(this, _TimelineFlameChartView_networkPersistedGroupConfigSetting, "f").get();
        networkSetting[key] = networkSetting[key] ?? visualConfigForTrace.network;
        __classPrivateFieldGet(this, _TimelineFlameChartView_networkPersistedGroupConfigSetting, "f").set(networkSetting);
    }
}, _TimelineFlameChartView_getPersistedConfigForTrace = function _TimelineFlameChartView_getPersistedConfigForTrace(trace, setting) {
    const value = setting.get();
    const key = trace.Meta.traceBounds.min;
    if (value[key]) {
        return value[key];
    }
    return null;
}, _TimelineFlameChartView_refreshAfterIgnoreList = function _TimelineFlameChartView_refreshAfterIgnoreList() {
    // The ignore list will only affect Thread tracks, which will only be in main flame chart.
    // So just force recalculate and redraw the main flame chart here.
    this.mainDataProvider.timelineData(true);
    this.mainFlameChart.scheduleUpdate();
}, _TimelineFlameChartView_updateDetailViews = function _TimelineFlameChartView_updateDetailViews() {
    this.countersView.setModel(__classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f"), __classPrivateFieldGet(this, _TimelineFlameChartView_selectedEvents, "f"));
    void this.detailsView.setModel({
        parsedTrace: __classPrivateFieldGet(this, _TimelineFlameChartView_parsedTrace, "f"),
        selectedEvents: __classPrivateFieldGet(this, _TimelineFlameChartView_selectedEvents, "f"),
        traceInsightsSets: __classPrivateFieldGet(this, _TimelineFlameChartView_traceInsightSets, "f"),
        eventToRelatedInsightsMap: __classPrivateFieldGet(this, _TimelineFlameChartView_eventToRelatedInsightsMap, "f"),
        entityMapper: __classPrivateFieldGet(this, _TimelineFlameChartView_entityMapper, "f"),
    });
}, _TimelineFlameChartView_updateFlameCharts = function _TimelineFlameChartView_updateFlameCharts() {
    this.mainFlameChart.scheduleUpdate();
    this.networkFlameChart.scheduleUpdate();
    __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_registerLoggableGroups).call(this);
}, _TimelineFlameChartView_registerLoggableGroups = function _TimelineFlameChartView_registerLoggableGroups() {
    const groups = [
        ...this.mainFlameChart.timelineData()?.groups ?? [],
        ...this.networkFlameChart.timelineData()?.groups ?? [],
    ];
    for (const group of groups) {
        if (!group.jslogContext) {
            continue;
        }
        const loggable = __classPrivateFieldGet(this, _TimelineFlameChartView_loggableForGroupByLogContext, "f").get(group.jslogContext) ?? Symbol(group.jslogContext);
        if (!__classPrivateFieldGet(this, _TimelineFlameChartView_loggableForGroupByLogContext, "f").has(group.jslogContext)) {
            // This is the first time this group has been created, so register its loggable.
            __classPrivateFieldGet(this, _TimelineFlameChartView_loggableForGroupByLogContext, "f").set(group.jslogContext, loggable);
            VisualLogging.registerLoggable(loggable, `${VisualLogging.section().context(`timeline.${group.jslogContext}`)}`, this.delegate.element, new DOMRect(0, 0, 200, 100));
        }
    }
}, _TimelineFlameChartView_selectionIfTraceEvent = function _TimelineFlameChartView_selectionIfTraceEvent(index, dataProvider) {
    const selection = dataProvider.createSelection(index);
    return selectionIsEvent(selection) ? selection.event : null;
}, _TimelineFlameChartView_onEntryInvoked = function _TimelineFlameChartView_onEntryInvoked(dataProvider, event) {
    __classPrivateFieldGet(this, _TimelineFlameChartView_instances, "m", _TimelineFlameChartView_updateSelectedEntryStatus).call(this, dataProvider, event);
    const entryIndex = event.data;
    // If we have a pending link connection, create it if we can now the final entry has been pressed.
    if (__classPrivateFieldGet(this, _TimelineFlameChartView_linkSelectionAnnotation, "f")) {
        this.handleToEntryOfLinkBetweenEntriesSelection(entryIndex);
    }
}, _TimelineFlameChartView_updateSelectedEntryStatus = function _TimelineFlameChartView_updateSelectedEntryStatus(dataProvider, event) {
    const data = dataProvider.timelineData();
    if (!data) {
        return;
    }
    const entryIndex = event.data;
    const entryLevel = data.entryLevels[entryIndex];
    // Find the group that contains this level and log a click for it.
    const group = groupForLevel(data.groups, entryLevel);
    if (group?.jslogContext) {
        const loggable = __classPrivateFieldGet(this, _TimelineFlameChartView_loggableForGroupByLogContext, "f").get(group.jslogContext) ?? null;
        if (loggable) {
            VisualLogging.logClick(loggable, new MouseEvent('click'));
        }
    }
    this.delegate.select(dataProvider.createSelection(entryIndex));
    // If the selected entry has a label, bring it forward.
    const traceEventForSelection = dataProvider.eventByIndex(entryIndex);
    if (traceEventForSelection) {
        ModificationsManager.activeManager()?.bringEntryLabelForwardIfExists(traceEventForSelection);
    }
}, _TimelineFlameChartView_selectSearchResult = function _TimelineFlameChartView_selectSearchResult(searchResultIndex) {
    this.searchableView.updateCurrentMatchIndex(searchResultIndex);
    const matchedResult = this.searchResults?.at(searchResultIndex) ?? null;
    if (!matchedResult) {
        return;
    }
    switch (matchedResult.provider) {
        case 'main': {
            this.delegate.select(this.mainDataProvider.createSelection(matchedResult.index));
            this.mainFlameChart.showPopoverForSearchResult(matchedResult.index);
            break;
        }
        case 'network': {
            this.delegate.select(this.networkDataProvider.createSelection(matchedResult.index));
            this.networkFlameChart.showPopoverForSearchResult(matchedResult.index);
            break;
        }
        case 'other':
            // TimelineFlameChartView only has main/network so we can ignore.
            break;
        default:
            Platform.assertNever(matchedResult.provider, `Unknown SearchResult[provider]: ${matchedResult.provider}`);
    }
    this.selectedSearchResult = matchedResult;
}, _TimelineFlameChartView_indexOfSearchResult = function _TimelineFlameChartView_indexOfSearchResult(target) {
    if (!target) {
        return -1;
    }
    return this.searchResults?.findIndex(result => {
        return result.provider === target.provider && result.index === target.index;
    }) ??
        -1;
};
export class Selection {
    constructor(selection, entryIndex) {
        this.timelineSelection = selection;
        this.entryIndex = entryIndex;
    }
}
export const FlameChartStyle = {
    textColor: '#333',
};
export class TimelineFlameChartMarker {
    constructor(startTime, startOffset, style) {
        this.startTimeInternal = startTime;
        this.startOffset = startOffset;
        this.style = style;
    }
    startTime() {
        return this.startTimeInternal;
    }
    color() {
        return this.style.color;
    }
    title() {
        if (this.style.lowPriority) {
            return null;
        }
        const startTime = i18n.TimeUtilities.millisToString(this.startOffset);
        return i18nString(UIStrings.sAtS, { PH1: this.style.title, PH2: startTime });
    }
    draw(context, x, _height, pixelsPerMillisecond) {
        const lowPriorityVisibilityThresholdInPixelsPerMs = 4;
        if (this.style.lowPriority && pixelsPerMillisecond < lowPriorityVisibilityThresholdInPixelsPerMs) {
            return;
        }
        if (!this.style.tall) {
            return;
        }
        context.save();
        context.strokeStyle = this.style.color;
        context.lineWidth = this.style.lineWidth;
        context.translate(this.style.lineWidth < 1 || (this.style.lineWidth & 1) ? 0.5 : 0, 0.5);
        context.beginPath();
        context.moveTo(x, 0);
        context.setLineDash(this.style.dashStyle);
        context.lineTo(x, context.canvas.height);
        context.stroke();
        context.restore();
    }
}
export var ColorBy;
(function (ColorBy) {
    ColorBy["URL"] = "URL";
})(ColorBy || (ColorBy = {}));
/**
 * Find the Group that contains the provided level, or `null` if no group is
 * found.
 */
export function groupForLevel(groups, level) {
    const groupForLevel = groups.find((group, groupIndex) => {
        const nextGroup = groups.at(groupIndex + 1);
        const groupEndLevel = nextGroup ? nextGroup.startLevel - 1 : Infinity;
        return group.startLevel <= level && groupEndLevel >= level;
    });
    return groupForLevel ?? null;
}
export var Events;
(function (Events) {
    Events["ENTRY_LABEL_ANNOTATION_CLICKED"] = "EntryLabelAnnotationClicked";
})(Events || (Events = {}));
//# sourceMappingURL=TimelineFlameChartView.js.map