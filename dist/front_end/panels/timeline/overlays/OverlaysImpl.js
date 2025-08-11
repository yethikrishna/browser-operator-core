// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _Overlays_instances, _Overlays_overlaysToElements, _Overlays_singletonOverlays, _Overlays_lastMouseOffsetX, _Overlays_lastMouseOffsetY, _Overlays_entriesLinkInProgress, _Overlays_dimensions, _Overlays_charts, _Overlays_overlaysContainer, _Overlays_annotationsHiddenSetting, _Overlays_queries, _Overlays_updateMouseCoordinatesProgressEntriesLink, _Overlays_positionOverlappingTimeRangeLabels, _Overlays_positionOverlay, _Overlays_positionTimingOverlay, _Overlays_positionTimespanBreakdownOverlay, _Overlays_positionEntriesLinkOverlay, _Overlays_yCoordinateForNotVisibleEntry, _Overlays_positionTimeRangeOverlay, _Overlays_positionEntryLabelOverlay, _Overlays_positionCandyStripedTimeRange, _Overlays_positionEntryBorderOutlineType, _Overlays_calculateFromAndToForEntriesLink, _Overlays_createElementForNewOverlay, _Overlays_clickEvent, _Overlays_createOverlayPopover, _Overlays_mouseMoveOverlay, _Overlays_mouseOutOverlay, _Overlays_createTimingsMarkerElement, _Overlays_updateOverlayBeforePositioning, _Overlays_updateOverlayAfterPositioning, _Overlays_entryIsHorizontallyVisibleOnChart, _Overlays_entryIsInCollapsedTrack, _Overlays_entryIsVerticallyVisibleOnChart, _Overlays_xPixelForMicroSeconds, _Overlays_setOverlayElementVisibility;
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Trace from '../../../models/trace/trace.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Utils from '../utils/utils.js';
import * as Components from './components/components.js';
const UIStrings = {
    /**
     * @description Text for showing that a metric was observed in the local environment.
     * @example {LCP} PH1
     */
    fieldMetricMarkerLocal: '{PH1} - Local',
    /**
     * @description Text for showing that a metric was observed in the field, from real use data (CrUX). Also denotes if from URL or Origin dataset.
     * @example {LCP} PH1
     * @example {URL} PH2
     */
    fieldMetricMarkerField: '{PH1} - Field ({PH2})',
    /**
     * @description Label for an option that selects the page's specific URL as opposed to it's entire origin/domain.
     */
    urlOption: 'URL',
    /**
     * @description Label for an option that selects the page's entire origin/domain as opposed to it's specific URL.
     */
    originOption: 'Origin',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/overlays/OverlaysImpl.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
/**
 * Below the network track there is a resize bar the user can click and drag.
 */
const NETWORK_RESIZE_ELEM_HEIGHT_PX = 8;
/**
 * Given a list of overlays, this method will calculate the smallest possible
 * trace window that will contain all of the overlays.
 * `overlays` is expected to be non-empty, and this will return `null` if it is empty.
 */
export function traceWindowContainingOverlays(overlays) {
    const windows = overlays.map(Trace.Helpers.Timing.traceWindowFromOverlay).filter(b => !!b);
    return Trace.Helpers.Timing.combineTraceWindowsMicro(windows);
}
/**
 * Get a list of entries for a given overlay.
 */
export function entriesForOverlay(overlay) {
    const entries = [];
    switch (overlay.type) {
        case 'ENTRY_SELECTED': {
            entries.push(overlay.entry);
            break;
        }
        case 'ENTRY_OUTLINE': {
            entries.push(overlay.entry);
            break;
        }
        case 'TIME_RANGE': {
            // Time ranges are not associated with entries.
            break;
        }
        case 'ENTRY_LABEL': {
            entries.push(overlay.entry);
            break;
        }
        case 'ENTRIES_LINK': {
            entries.push(overlay.entryFrom);
            if (overlay.entryTo) {
                entries.push(overlay.entryTo);
            }
            break;
        }
        case 'TIMESPAN_BREAKDOWN': {
            if (overlay.entry) {
                entries.push(overlay.entry);
            }
            break;
        }
        case 'TIMESTAMP_MARKER': {
            // This overlay type isn't associated to any entry, so just break here.
            break;
        }
        case 'CANDY_STRIPED_TIME_RANGE': {
            entries.push(overlay.entry);
            break;
        }
        case 'TIMINGS_MARKER': {
            entries.push(...overlay.entries);
            break;
        }
        default:
            Platform.assertNever(overlay, `Unknown overlay type ${JSON.stringify(overlay)}`);
    }
    return entries;
}
export function chartForEntry(entry) {
    if (Trace.Types.Events.isNetworkTrackEntry(entry)) {
        return 'network';
    }
    return 'main';
}
export function overlayIsSingleton(overlay) {
    return overlayTypeIsSingleton(overlay.type);
}
export function overlayTypeIsSingleton(type) {
    return type === 'TIMESTAMP_MARKER' || type === 'ENTRY_SELECTED';
}
export class AnnotationOverlayActionEvent extends Event {
    constructor(overlay, action) {
        super(AnnotationOverlayActionEvent.eventName);
        this.overlay = overlay;
        this.action = action;
    }
}
AnnotationOverlayActionEvent.eventName = 'annotationoverlayactionsevent';
export class ConsentDialogVisibilityChange extends Event {
    constructor(isVisible) {
        super(ConsentDialogVisibilityChange.eventName, { bubbles: true, composed: true });
        this.isVisible = isVisible;
    }
}
ConsentDialogVisibilityChange.eventName = 'consentdialogvisibilitychange';
export class TimeRangeMouseOverEvent extends Event {
    constructor(overlay) {
        super(TimeRangeMouseOverEvent.eventName, { bubbles: true });
        this.overlay = overlay;
    }
}
TimeRangeMouseOverEvent.eventName = 'timerangemouseoverevent';
export class TimeRangeMouseOutEvent extends Event {
    constructor() {
        super(TimeRangeMouseOutEvent.eventName, { bubbles: true });
    }
}
TimeRangeMouseOutEvent.eventName = 'timerangemouseoutevent';
export class EntryLabelMouseClick extends Event {
    constructor(overlay) {
        super(EntryLabelMouseClick.eventName, { composed: true, bubbles: true });
        this.overlay = overlay;
    }
}
EntryLabelMouseClick.eventName = 'entrylabelmouseclick';
export class EventReferenceClick extends Event {
    constructor(event) {
        super(EventReferenceClick.eventName, { bubbles: true, composed: true });
        this.event = event;
    }
}
EventReferenceClick.eventName = 'eventreferenceclick';
/**
 * This class manages all the overlays that get drawn onto the performance
 * timeline. Overlays are DOM and are drawn above the network and main flame
 * chart.
 *
 * For more documentation, see `timeline/README.md` which has a section on overlays.
 */
export class Overlays extends EventTarget {
    constructor(init) {
        super();
        _Overlays_instances.add(this);
        /**
         * The list of active overlays. Overlays can't be marked as visible or
         * hidden; every overlay in this list is rendered.
         * We track each overlay against the HTML Element we have rendered. This is
         * because on first render of a new overlay, we create it, but then on
         * subsequent renders we do not destroy and recreate it, instead we update it
         * based on the new position of the timeline.
         */
        _Overlays_overlaysToElements.set(this, new Map());
        _Overlays_singletonOverlays.set(this, new Map());
        // When the Entries Link Annotation is created, the arrow needs to follow the mouse.
        // Update the mouse coordinates while it is being created.
        _Overlays_lastMouseOffsetX.set(this, null);
        _Overlays_lastMouseOffsetY.set(this, null);
        // `entriesLinkInProgress` is the entries link Overlay that has not yet been fully created
        // and only has the entry that the link starts from set.
        // We save it as a separate variable because when the second entry of the link is not chosen yet,
        // the arrow follows the mouse. To achieve that, update the coordinates of `entriesLinkInProgress`
        // on mousemove. There can only be one link in the process on being created so the mousemove
        // only needs to update `entriesLinkInProgress` link overlay.
        _Overlays_entriesLinkInProgress.set(this, void 0);
        _Overlays_dimensions.set(this, {
            trace: {
                visibleWindow: null,
            },
            charts: {
                main: null,
                network: null,
            },
        });
        /**
         * To calculate the Y pixel value for an event we need access to the chart
         * and data provider in order to find out what level the event is on, and from
         * there calculate the pixel value for that level.
         */
        _Overlays_charts.set(this, void 0);
        /**
         * The Overlays class will take each overlay, generate its HTML, and add it
         * to the container. This container is provided for us when the class is
         * created so we can manage its contents as overlays come and go.
         */
        _Overlays_overlaysContainer.set(this, void 0);
        // Setting that specified if the annotations overlays need to be visible.
        // It is switched on/off from the annotations tab in the sidebar.
        _Overlays_annotationsHiddenSetting.set(this, void 0);
        /**
         * The OverlaysManager sometimes needs to find out if an entry is visible or
         * not, and if not, why not - for example, if the user has collapsed its
         * parent. We define these query functions that must be supplied in order to
         * answer these questions.
         */
        _Overlays_queries.set(this, void 0);
        __classPrivateFieldSet(this, _Overlays_overlaysContainer, init.container, "f");
        __classPrivateFieldSet(this, _Overlays_charts, init.charts, "f");
        __classPrivateFieldSet(this, _Overlays_queries, init.entryQueries, "f");
        __classPrivateFieldSet(this, _Overlays_entriesLinkInProgress, null, "f");
        __classPrivateFieldSet(this, _Overlays_annotationsHiddenSetting, Common.Settings.Settings.instance().moduleSetting('annotations-hidden'), "f");
        __classPrivateFieldGet(this, _Overlays_annotationsHiddenSetting, "f").addChangeListener(this.update.bind(this));
        // HTMLElements of both Flamecharts. They are used to get the mouse position over the Flamecharts.
        init.flameChartsContainers.main.addEventListener('mousemove', event => __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_updateMouseCoordinatesProgressEntriesLink).bind(this)(event, 'main'));
        init.flameChartsContainers.network.addEventListener('mousemove', event => __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_updateMouseCoordinatesProgressEntriesLink).bind(this)(event, 'network'));
    }
    // Toggle display of the whole OverlaysContainer.
    // This function is used to hide all overlays when the Flamechart is in the 'reorder tracks' state.
    // If the tracks are being reordered, they are collapsed and we do not want to display
    // anything except the tracks reordering interface.
    //
    // Do not change individual overlays visibility with 'setOverlayElementVisibility' since we do not
    // want to overwrite the overlays visibility state that was set before entering the reordering state.
    toggleAllOverlaysDisplayed(allOverlaysDisplayed) {
        __classPrivateFieldGet(this, _Overlays_overlaysContainer, "f").style.display = allOverlaysDisplayed ? 'block' : 'none';
    }
    /**
     * Add a new overlay to the view.
     */
    add(newOverlay) {
        if (__classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").has(newOverlay)) {
            return newOverlay;
        }
        /**
         * If the overlay type is a singleton, and we already have one, we update
         * the existing one, rather than create a new one. This ensures you can only
         * ever have one instance of the overlay type.
         */
        if (overlayIsSingleton(newOverlay)) {
            const existing = __classPrivateFieldGet(this, _Overlays_singletonOverlays, "f").get(newOverlay.type);
            if (existing) {
                this.updateExisting(existing, newOverlay);
                return existing; // The is a safe cast, thanks to `type` above.
            }
            __classPrivateFieldGet(this, _Overlays_singletonOverlays, "f").set(newOverlay.type, newOverlay);
        }
        // By setting the value to null, we ensure that on the next render that the
        // overlay will have a new HTML element created for it.
        __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").set(newOverlay, null);
        return newOverlay;
    }
    /**
     * Update an existing overlay without destroying and recreating its
     * associated DOM.
     *
     * This is useful if you need to rapidly update an overlay's data - e.g.
     * dragging to create time ranges - without the thrashing of destroying the
     * old overlay and re-creating the new one.
     */
    updateExisting(existingOverlay, newData) {
        if (!__classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").has(existingOverlay)) {
            console.error('Trying to update an overlay that does not exist.');
            return;
        }
        for (const [key, value] of Object.entries(newData)) {
            // newData is of type Partial<T>, so each key must exist in T, but
            // Object.entries doesn't carry that information.
            const k = key;
            existingOverlay[k] = value;
        }
    }
    enterLabelEditMode(overlay) {
        // Entry edit state can be triggered from outside the label component by clicking on the
        // Entry that already has a label. Instead of creating a new label, set the existing entry
        // label into an editable state.
        const element = __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").get(overlay);
        const component = element?.querySelector('devtools-entry-label-overlay');
        if (component) {
            component.setLabelEditabilityAndRemoveEmptyLabel(true);
        }
    }
    bringLabelForward(overlay) {
        // Before bringing the element forward, remove the 'bring-forward' class from all the other elements
        for (const element of __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").values()) {
            element?.classList.remove('bring-forward');
        }
        const element = __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").get(overlay);
        element?.classList.add('bring-forward');
    }
    /**
     * @returns the list of overlays associated with a given entry.
     */
    overlaysForEntry(entry) {
        const matches = [];
        for (const [overlay] of __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f")) {
            if ('entry' in overlay && overlay.entry === entry) {
                matches.push(overlay);
            }
        }
        return matches;
    }
    /**
     * Used for debugging and testing. Do not mutate the element directly using
     * this method.
     */
    elementForOverlay(overlay) {
        return __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").get(overlay) ?? null;
    }
    /**
     * Removes any active overlays that match the provided type.
     * @returns the number of overlays that were removed.
     */
    removeOverlaysOfType(type) {
        if (overlayTypeIsSingleton(type)) {
            const singleton = __classPrivateFieldGet(this, _Overlays_singletonOverlays, "f").get(type);
            if (singleton) {
                this.remove(singleton);
                return 1;
            }
            return 0;
        }
        const overlaysToRemove = Array.from(__classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").keys()).filter(overlay => {
            return overlay.type === type;
        });
        for (const overlay of overlaysToRemove) {
            this.remove(overlay);
        }
        return overlaysToRemove.length;
    }
    /**
     * @returns all overlays that match the provided type.
     */
    overlaysOfType(type) {
        if (overlayTypeIsSingleton(type)) {
            const singleton = __classPrivateFieldGet(this, _Overlays_singletonOverlays, "f").get(type);
            if (singleton) {
                return [singleton];
            }
            return [];
        }
        const matches = [];
        function overlayIsOfType(overlay) {
            return overlay.type === type;
        }
        for (const [overlay] of __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f")) {
            if (overlayIsOfType(overlay)) {
                matches.push(overlay);
            }
        }
        return matches;
    }
    /**
     * @returns all overlays.
     */
    allOverlays() {
        return [...__classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").keys()];
    }
    /**
     * Removes the provided overlay from the list of overlays and destroys any
     * DOM associated with it.
     */
    remove(overlay) {
        const htmlElement = __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").get(overlay);
        if (htmlElement && __classPrivateFieldGet(this, _Overlays_overlaysContainer, "f")) {
            __classPrivateFieldGet(this, _Overlays_overlaysContainer, "f").removeChild(htmlElement);
        }
        __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").delete(overlay);
        if (overlayIsSingleton(overlay)) {
            __classPrivateFieldGet(this, _Overlays_singletonOverlays, "f").delete(overlay.type);
        }
    }
    /**
     * Update the dimensions of a chart.
     * IMPORTANT: this does not trigger a re-draw. You must call the render() method manually.
     */
    updateChartDimensions(chart, dimensions) {
        __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts[chart] = dimensions;
    }
    /**
     * Update the visible window of the UI.
     * IMPORTANT: this does not trigger a re-draw. You must call the render() method manually.
     */
    updateVisibleWindow(visibleWindow) {
        __classPrivateFieldGet(this, _Overlays_dimensions, "f").trace.visibleWindow = visibleWindow;
    }
    /**
     * Clears all overlays and all data. Call this when the trace is changing
     * (e.g. the user has imported/recorded a new trace) and we need to start from
     * scratch and remove all overlays relating to the previous trace.
     */
    reset() {
        if (__classPrivateFieldGet(this, _Overlays_overlaysContainer, "f")) {
            __classPrivateFieldGet(this, _Overlays_overlaysContainer, "f").innerHTML = '';
        }
        __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").clear();
        // Clear out dimensions from the old Flame Charts.
        __classPrivateFieldGet(this, _Overlays_dimensions, "f").trace.visibleWindow = null;
        __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.main = null;
        __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network = null;
    }
    /**
     * Updates the Overlays UI: new overlays will be rendered onto the view, and
     * existing overlays will have their positions changed to ensure they are
     * rendered in the right place.
     */
    async update() {
        const timeRangeOverlays = [];
        const timingsMarkerOverlays = [];
        for (const [overlay, existingElement] of __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f")) {
            const element = existingElement || __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_createElementForNewOverlay).call(this, overlay);
            if (!existingElement) {
                // This is a new overlay, so we have to store the element and add it to the DOM.
                __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").set(overlay, element);
                __classPrivateFieldGet(this, _Overlays_overlaysContainer, "f").appendChild(element);
            }
            // A chance to update the overlay before we re-position it. If an
            // overlay's data changed, this is where we can pass that data into the
            // overlay's component so it has the latest data.
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_updateOverlayBeforePositioning).call(this, overlay, element);
            // Now we position the overlay on the timeline.
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionOverlay).call(this, overlay, element);
            // And now we give every overlay a chance to react to its new position,
            // if it needs to
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_updateOverlayAfterPositioning).call(this, overlay, element);
            if (overlay.type === 'TIME_RANGE') {
                timeRangeOverlays.push(overlay);
            }
            if (overlay.type === 'TIMINGS_MARKER') {
                timingsMarkerOverlays.push(overlay);
            }
        }
        if (timeRangeOverlays.length > 1) { // If there are 0 or 1 overlays, they can't overlap
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionOverlappingTimeRangeLabels).call(this, timeRangeOverlays);
        }
    }
    /**
     * @returns true if the entry is visible on chart, which means that both
     * horizontally and vertically it is at least partially in view.
     */
    entryIsVisibleOnChart(entry) {
        const verticallyVisible = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_entryIsVerticallyVisibleOnChart).call(this, entry);
        const horiziontallyVisible = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_entryIsHorizontallyVisibleOnChart).call(this, entry);
        return verticallyVisible && horiziontallyVisible;
    }
    /**
     * Calculate the X pixel position for an event start on the timeline.
     * @param chartName - the chart that the event is on. It is expected that both
     * charts have the same width so this doesn't make a difference - but it might
     * in the future if the UI changes, hence asking for it.
     *
     * @param event - the trace event you want to get the pixel position of
     */
    xPixelForEventStartOnChart(event) {
        const chartName = chartForEntry(event);
        const { startTime } = timingsForOverlayEntry(event);
        return __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, chartName, startTime);
    }
    /**
     * Calculate the X pixel position for an event end on the timeline.
     * @param chartName - the chart that the event is on. It is expected that both
     * charts have the same width so this doesn't make a difference - but it might
     * in the future if the UI changes, hence asking for it.
     *
     * @param event - the trace event you want to get the pixel position of
     */
    xPixelForEventEndOnChart(event) {
        const chartName = chartForEntry(event);
        const { endTime } = timingsForOverlayEntry(event);
        return __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, chartName, endTime);
    }
    /**
     * Calculate the Y pixel position for the event on the timeline relative to
     * the entire window.
     * This means if the event is in the main flame chart and below the network,
     * we add the height of the network chart to the Y value to position it
     * correctly.
     * This can return null if any data was missing, or if the event is not
     * visible (if the level it's on is hidden because the track is collapsed,
     * for example)
     */
    yPixelForEventOnChart(event) {
        const chartName = chartForEntry(event);
        const chart = chartName === 'main' ? __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart : __classPrivateFieldGet(this, _Overlays_charts, "f").networkChart;
        const provider = chartName === 'main' ? __classPrivateFieldGet(this, _Overlays_charts, "f").mainProvider : __classPrivateFieldGet(this, _Overlays_charts, "f").networkProvider;
        const indexForEntry = provider.indexForEvent?.(event);
        if (typeof indexForEntry !== 'number') {
            return null;
        }
        const timelineData = provider.timelineData();
        if (timelineData === null) {
            return null;
        }
        const level = timelineData.entryLevels.at(indexForEntry);
        if (typeof level === 'undefined') {
            return null;
        }
        if (!chart.levelIsVisible(level)) {
            return null;
        }
        const pixelOffsetForLevel = chart.levelToOffset(level);
        // Now we have the offset for the level, we need to adjust it by the user's scroll offset.
        let pixelAdjustedForScroll = pixelOffsetForLevel - (__classPrivateFieldGet(this, _Overlays_dimensions, "f").charts[chartName]?.scrollOffsetPixels ?? 0);
        // Now if the event is in the main chart, we need to pad its Y position
        // down by the height of the network chart + the network resize element.
        if (chartName === 'main') {
            pixelAdjustedForScroll += this.networkChartOffsetHeight();
        }
        return pixelAdjustedForScroll;
    }
    /**
     * Calculate the height of the event on the timeline.
     */
    pixelHeightForEventOnChart(event) {
        const chartName = chartForEntry(event);
        const chart = chartName === 'main' ? __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart : __classPrivateFieldGet(this, _Overlays_charts, "f").networkChart;
        const provider = chartName === 'main' ? __classPrivateFieldGet(this, _Overlays_charts, "f").mainProvider : __classPrivateFieldGet(this, _Overlays_charts, "f").networkProvider;
        const indexForEntry = provider.indexForEvent?.(event);
        if (typeof indexForEntry !== 'number') {
            return null;
        }
        const timelineData = provider.timelineData();
        if (timelineData === null) {
            return null;
        }
        const level = timelineData.entryLevels.at(indexForEntry);
        if (typeof level === 'undefined') {
            return null;
        }
        return chart.levelHeight(level);
    }
    /**
     * Calculate the height of the network chart. If the network chart has
     * height, we also allow for the size of the resize handle shown between the
     * two charts.
     *
     * Note that it is possible for the chart to have 0 height if the user is
     * looking at a trace with no network requests.
     */
    networkChartOffsetHeight() {
        if (__classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network === null) {
            return 0;
        }
        if (__classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network.heightPixels === 0) {
            return 0;
        }
        // At this point we know the network track exists and has height. But we
        // need to check if it is collapsed, because if it is collapsed there is no
        // resizer shown.
        if (__classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network.allGroupsCollapsed) {
            return __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network.heightPixels;
        }
        return __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network.heightPixels + NETWORK_RESIZE_ELEM_HEIGHT_PX;
    }
}
_Overlays_overlaysToElements = new WeakMap(), _Overlays_singletonOverlays = new WeakMap(), _Overlays_lastMouseOffsetX = new WeakMap(), _Overlays_lastMouseOffsetY = new WeakMap(), _Overlays_entriesLinkInProgress = new WeakMap(), _Overlays_dimensions = new WeakMap(), _Overlays_charts = new WeakMap(), _Overlays_overlaysContainer = new WeakMap(), _Overlays_annotationsHiddenSetting = new WeakMap(), _Overlays_queries = new WeakMap(), _Overlays_instances = new WeakSet(), _Overlays_updateMouseCoordinatesProgressEntriesLink = function _Overlays_updateMouseCoordinatesProgressEntriesLink(event, chart) {
    if (__classPrivateFieldGet(this, _Overlays_entriesLinkInProgress, "f")?.state !== "pending_to_event" /* Trace.Types.File.EntriesLinkState.PENDING_TO_EVENT */) {
        return;
    }
    const mouseEvent = event;
    __classPrivateFieldSet(this, _Overlays_lastMouseOffsetX, mouseEvent.offsetX, "f");
    __classPrivateFieldSet(this, _Overlays_lastMouseOffsetY, mouseEvent.offsetY, "f");
    // The Overlays layer coordinates cover both Network and Main Charts, while the mousemove
    // coordinates are received from the charts individually and start from 0 for each chart.
    //
    // To make it work on the overlays, we need to know which chart the entry belongs to and,
    // if it is on the main chart, add the height of the Network chart to get correct Entry
    // coordinates on the Overlays layer.
    const networkHeight = __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network?.heightPixels ?? 0;
    const linkInProgressElement = __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").get(__classPrivateFieldGet(this, _Overlays_entriesLinkInProgress, "f"));
    if (linkInProgressElement) {
        const component = linkInProgressElement.querySelector('devtools-entries-link-overlay');
        const yCoordinate = mouseEvent.offsetY + ((chart === 'main') ? networkHeight : 0);
        component.toEntryCoordinateAndDimensions = { x: mouseEvent.offsetX, y: yCoordinate };
    }
}, _Overlays_positionOverlappingTimeRangeLabels = function _Overlays_positionOverlappingTimeRangeLabels(overlays) {
    const overlaysSorted = overlays.toSorted((o1, o2) => {
        return o1.bounds.min - o2.bounds.min;
    });
    // Track the overlays which overlap other overlays.
    // This isn't bi-directional: if we find that O2 overlaps O1, we will
    // store O1 => [O2]. We will not then also store O2 => [O1], because we
    // only need to deal with the overlap once.
    const overlapsByOverlay = new Map();
    for (let i = 0; i < overlaysSorted.length; i++) {
        const current = overlaysSorted[i];
        const overlaps = [];
        // Walk through subsequent overlays and find stop when you find the next one that does not overlap.
        for (let j = i + 1; j < overlaysSorted.length; j++) {
            const next = overlaysSorted[j];
            const currentAndNextOverlap = Trace.Helpers.Timing.boundsIncludeTimeRange({
                bounds: current.bounds,
                timeRange: next.bounds,
            });
            if (currentAndNextOverlap) {
                overlaps.push(next);
            }
            else {
                // Overlays are sorted by time, if this one does not overlap, the next one will not, so we can break.
                break;
            }
        }
        overlapsByOverlay.set(current, overlaps);
    }
    for (const [firstOverlay, overlappingOverlays] of overlapsByOverlay) {
        const element = __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").get(firstOverlay);
        if (!element) {
            continue;
        }
        // If the first overlay is adjusted, we can start back from 0 again
        // rather than continually increment up.
        let firstIndexForOverlapClass = 1;
        if (element.getAttribute('class')?.includes('overlap-')) {
            firstIndexForOverlapClass = 0;
        }
        overlappingOverlays.forEach(overlay => {
            const element = __classPrivateFieldGet(this, _Overlays_overlaysToElements, "f").get(overlay);
            element?.classList.add(`overlap-${firstIndexForOverlapClass++}`);
        });
    }
}, _Overlays_positionOverlay = function _Overlays_positionOverlay(overlay, element) {
    const annotationsAreHidden = __classPrivateFieldGet(this, _Overlays_annotationsHiddenSetting, "f").get();
    switch (overlay.type) {
        case 'ENTRY_SELECTED': {
            const isVisible = this.entryIsVisibleOnChart(overlay.entry);
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, isVisible);
            if (isVisible) {
                __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionEntryBorderOutlineType).call(this, overlay.entry, element);
            }
            break;
        }
        case 'ENTRY_OUTLINE': {
            if (this.entryIsVisibleOnChart(overlay.entry)) {
                __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, true);
                __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionEntryBorderOutlineType).call(this, overlay.entry, element);
            }
            else {
                __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, false);
            }
            break;
        }
        case 'TIME_RANGE': {
            // The time range annotation can also be used to measure a selection in the timeline and is not saved if no label is added.
            // Therefore, we only care about the annotation hidden setting if the time range has a label.
            if (overlay.label.length) {
                __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, !annotationsAreHidden);
            }
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionTimeRangeOverlay).call(this, overlay, element);
            break;
        }
        case 'ENTRY_LABEL': {
            const entryVisible = this.entryIsVisibleOnChart(overlay.entry);
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, entryVisible && !annotationsAreHidden);
            if (entryVisible) {
                const entryLabelVisibleHeight = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionEntryLabelOverlay).call(this, overlay, element);
                const component = element.querySelector('devtools-entry-label-overlay');
                if (component && entryLabelVisibleHeight) {
                    component.entryLabelVisibleHeight = entryLabelVisibleHeight;
                }
            }
            break;
        }
        case 'ENTRIES_LINK': {
            // The exact entries that are linked to could be collapsed in a flame
            // chart, so we figure out the best visible entry pairs to draw
            // between.
            const entriesToConnect = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_calculateFromAndToForEntriesLink).call(this, overlay);
            const isVisible = entriesToConnect !== null && !annotationsAreHidden;
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, isVisible);
            if (isVisible) {
                __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionEntriesLinkOverlay).call(this, overlay, element, entriesToConnect);
            }
            break;
        }
        case 'TIMESPAN_BREAKDOWN': {
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionTimespanBreakdownOverlay).call(this, overlay, element);
            // TODO: Have the timespan squeeze instead.
            if (overlay.entry) {
                const { visibleWindow } = __classPrivateFieldGet(this, _Overlays_dimensions, "f").trace;
                const isVisible = Boolean(visibleWindow && __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_entryIsVerticallyVisibleOnChart).call(this, overlay.entry) &&
                    Trace.Helpers.Timing.boundsIncludeTimeRange({
                        bounds: visibleWindow,
                        timeRange: overlay.sections[0].bounds,
                    }));
                __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, isVisible);
            }
            break;
        }
        case 'TIMESTAMP_MARKER': {
            const { visibleWindow } = __classPrivateFieldGet(this, _Overlays_dimensions, "f").trace;
            // Only update the position if the timestamp of this marker is within
            // the visible bounds.
            const isVisible = Boolean(visibleWindow && Trace.Helpers.Timing.timestampIsInBounds(visibleWindow, overlay.timestamp));
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, isVisible);
            if (isVisible) {
                __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionTimingOverlay).call(this, overlay, element);
            }
            break;
        }
        case 'CANDY_STRIPED_TIME_RANGE': {
            const { visibleWindow } = __classPrivateFieldGet(this, _Overlays_dimensions, "f").trace;
            // If the bounds of this overlay are not within the visible bounds, we
            // can skip updating its position and just hide it.
            const isVisible = Boolean(visibleWindow && __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_entryIsVerticallyVisibleOnChart).call(this, overlay.entry) &&
                Trace.Helpers.Timing.boundsIncludeTimeRange({
                    bounds: visibleWindow,
                    timeRange: overlay.bounds,
                }));
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, isVisible);
            if (isVisible) {
                __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionCandyStripedTimeRange).call(this, overlay, element);
            }
            break;
        }
        case 'TIMINGS_MARKER': {
            const { visibleWindow } = __classPrivateFieldGet(this, _Overlays_dimensions, "f").trace;
            // All the entries have the same ts, so can use the first.
            const isVisible = Boolean(visibleWindow && __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_entryIsHorizontallyVisibleOnChart).call(this, overlay.entries[0]));
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, isVisible);
            if (isVisible) {
                __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionTimingOverlay).call(this, overlay, element);
            }
            break;
        }
        default: {
            Platform.TypeScriptUtilities.assertNever(overlay, `Unknown overlay: ${JSON.stringify(overlay)}`);
        }
    }
}, _Overlays_positionTimingOverlay = function _Overlays_positionTimingOverlay(overlay, element) {
    let left;
    switch (overlay.type) {
        case 'TIMINGS_MARKER': {
            // All the entries have the same ts, so can use the first.
            const timings = Trace.Helpers.Timing.eventTimingsMicroSeconds(overlay.entries[0]);
            left = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, 'main', timings.startTime);
            break;
        }
        case 'TIMESTAMP_MARKER': {
            // Because we are adjusting the x position, we can use either chart here.
            left = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, 'main', overlay.timestamp);
            break;
        }
    }
    element.style.left = `${left}px`;
}, _Overlays_positionTimespanBreakdownOverlay = function _Overlays_positionTimespanBreakdownOverlay(overlay, element) {
    if (overlay.sections.length === 0) {
        return;
    }
    const component = element.querySelector('devtools-timespan-breakdown-overlay');
    const elementSections = component?.renderedSections() ?? [];
    // Handle horizontal positioning.
    const leftEdgePixel = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, 'main', overlay.sections[0].bounds.min);
    const rightEdgePixel = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, 'main', overlay.sections[overlay.sections.length - 1].bounds.max);
    if (leftEdgePixel === null || rightEdgePixel === null) {
        return;
    }
    const rangeWidth = rightEdgePixel - leftEdgePixel;
    element.style.left = `${leftEdgePixel}px`;
    element.style.width = `${rangeWidth}px`;
    if (elementSections.length === 0) {
        return;
    }
    let count = 0;
    for (const section of overlay.sections) {
        const leftPixel = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, 'main', section.bounds.min);
        const rightPixel = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, 'main', section.bounds.max);
        if (leftPixel === null || rightPixel === null) {
            return;
        }
        const rangeWidth = rightPixel - leftPixel;
        const sectionElement = elementSections[count];
        sectionElement.style.left = `${leftPixel}px`;
        sectionElement.style.width = `${rangeWidth}px`;
        count++;
    }
    // Handle vertical positioning based on the entry's vertical position.
    if (overlay.entry && (overlay.renderLocation === 'BELOW_EVENT' || overlay.renderLocation === 'ABOVE_EVENT')) {
        // Max height for the overlay box when attached to an entry.
        const MAX_BOX_HEIGHT = 50;
        element.style.maxHeight = `${MAX_BOX_HEIGHT}px`;
        const y = this.yPixelForEventOnChart(overlay.entry);
        if (y === null) {
            return;
        }
        const eventHeight = this.pixelHeightForEventOnChart(overlay.entry);
        if (eventHeight === null) {
            return;
        }
        if (overlay.renderLocation === 'BELOW_EVENT') {
            const top = y + eventHeight;
            element.style.top = `${top}px`;
        }
        else {
            // Some padding so the box hovers just on top.
            const PADDING = 7;
            // Where the timespan breakdown should sit. Slightly on top of the entry.
            const bottom = y - PADDING;
            // Available space between the bottom of the overlay and top of the chart.
            const minSpace = Math.max(bottom, 0);
            // Constrain height to available space.
            const height = Math.min(MAX_BOX_HEIGHT, minSpace);
            const top = bottom - height;
            element.style.top = `${top}px`;
        }
    }
}, _Overlays_positionEntriesLinkOverlay = function _Overlays_positionEntriesLinkOverlay(overlay, element, entriesToConnect) {
    const component = element.querySelector('devtools-entries-link-overlay');
    if (component) {
        const fromEntryInCollapsedTrack = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_entryIsInCollapsedTrack).call(this, entriesToConnect.entryFrom);
        const toEntryInCollapsedTrack = entriesToConnect.entryTo && __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_entryIsInCollapsedTrack).call(this, entriesToConnect.entryTo);
        const bothEntriesInCollapsedTrack = Boolean(fromEntryInCollapsedTrack && toEntryInCollapsedTrack);
        // If both entries are in collapsed tracks, we hide the overlay completely.
        if (bothEntriesInCollapsedTrack) {
            __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_setOverlayElementVisibility).call(this, element, false);
            return;
        }
        // If either entry (but not both) is in a track that the user has collapsed, we do not
        // show the connection at all, but we still show the borders around
        // the entry. So in this case we mark the overlay as visible, but
        // tell it to not draw the arrow.
        const hideArrow = Boolean(fromEntryInCollapsedTrack || toEntryInCollapsedTrack);
        component.hideArrow = hideArrow;
        const { entryFrom, entryTo, entryFromIsSource, entryToIsSource } = entriesToConnect;
        const entryFromWrapper = component.entryFromWrapper();
        // Should not happen, the 'from' wrapper should always exist. Something went wrong, return in this case.
        if (!entryFromWrapper) {
            return;
        }
        const entryFromVisibility = this.entryIsVisibleOnChart(entryFrom) && !fromEntryInCollapsedTrack;
        const entryToVisibility = entryTo ? this.entryIsVisibleOnChart(entryTo) && !toEntryInCollapsedTrack : false;
        // If the entry is not currently visible, draw the arrow to the edge of the screen towards the entry on the Y-axis.
        let fromEntryX = 0;
        let fromEntryY = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_yCoordinateForNotVisibleEntry).call(this, entryFrom);
        // If the entry is visible, draw the arrow to the entry.
        if (entryFromVisibility) {
            const fromEntryParams = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionEntryBorderOutlineType).call(this, entriesToConnect.entryFrom, entryFromWrapper);
            if (fromEntryParams) {
                const fromEntryHeight = fromEntryParams?.entryHeight;
                const fromEntryWidth = fromEntryParams?.entryWidth;
                const fromCutOffHeight = fromEntryParams?.cutOffHeight;
                fromEntryX = fromEntryParams?.x;
                fromEntryY = fromEntryParams?.y;
                component.fromEntryCoordinateAndDimensions =
                    { x: fromEntryX, y: fromEntryY, length: fromEntryWidth, height: fromEntryHeight - fromCutOffHeight };
            }
            else {
                // Something went if the entry is visible and we cannot get its' parameters.
                return;
            }
        }
        // If `fromEntry` is not visible and the link creation is not started yet, meaning that
        // only the button to create the link is displayed, delete the whole overlay.
        if (!entryFromVisibility && overlay.state === "creation_not_started" /* Trace.Types.File.EntriesLinkState.CREATION_NOT_STARTED */) {
            this.dispatchEvent(new AnnotationOverlayActionEvent(overlay, 'Remove'));
        }
        // If entryTo exists, pass the coordinates and dimensions of the entry that the arrow snaps to.
        // If it does not, the event tracking mouse coordinates updates 'to coordinates' so the arrow follows the mouse instead.
        const entryToWrapper = component.entryToWrapper();
        if (entryTo && entryToWrapper) {
            let toEntryX = this.xPixelForEventStartOnChart(entryTo) ?? 0;
            // If the 'to' entry is visible, set the entry Y as an arrow coordinate to point to. If not, get the canvas edge coordate to point the arrow to.
            let toEntryY = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_yCoordinateForNotVisibleEntry).call(this, entryTo);
            const toEntryParams = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionEntryBorderOutlineType).call(this, entryTo, entryToWrapper);
            if (toEntryParams) {
                const toEntryHeight = toEntryParams?.entryHeight;
                const toEntryWidth = toEntryParams?.entryWidth;
                const toCutOffHeight = toEntryParams?.cutOffHeight;
                toEntryX = toEntryParams?.x;
                toEntryY = toEntryParams?.y;
                component.toEntryCoordinateAndDimensions = {
                    x: toEntryX,
                    y: toEntryY,
                    length: toEntryWidth,
                    height: toEntryHeight - toCutOffHeight,
                };
            }
            else {
                // if the entry exists and we cannot get its' parameters, it is probably loaded and is off screen.
                // In this case, assign the coordinates so we can draw the arrow in the right direction.
                component.toEntryCoordinateAndDimensions = {
                    x: toEntryX,
                    y: toEntryY,
                };
                return;
            }
        }
        else {
            // If the 'to' entry does not exist, the link is being created.
            // The second coordinate for in progress link gets updated on mousemove
            __classPrivateFieldSet(this, _Overlays_entriesLinkInProgress, overlay, "f");
        }
        component.fromEntryIsSource = entryFromIsSource;
        component.toEntryIsSource = entryToIsSource;
        component.entriesVisibility = {
            fromEntryVisibility: entryFromVisibility,
            toEntryVisibility: entryToVisibility,
        };
    }
}, _Overlays_yCoordinateForNotVisibleEntry = function _Overlays_yCoordinateForNotVisibleEntry(entry) {
    const chartName = chartForEntry(entry);
    const y = this.yPixelForEventOnChart(entry);
    if (y === null) {
        return 0;
    }
    if (chartName === 'main') {
        if (!__classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.main?.heightPixels) {
            // Shouldn't happen, but if the main chart has no height, nothing on it is visible.
            return 0;
        }
        const yWithoutNetwork = y - this.networkChartOffsetHeight();
        // Check if the y position is less than 0. If it, the entry is off the top of the track canvas.
        // In that case, return the height of network track, which is also the top of main track.
        if (yWithoutNetwork < 0) {
            return this.networkChartOffsetHeight();
        }
    }
    if (chartName === 'network') {
        if (!__classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network) {
            return 0;
        }
        // The event is off the bottom of the network chart. In this case return the bottom of the network chart.
        if (y > __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network.heightPixels) {
            return __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network.heightPixels;
        }
    }
    // In other cases, return the y of the entry
    return y;
}, _Overlays_positionTimeRangeOverlay = function _Overlays_positionTimeRangeOverlay(overlay, element) {
    // Time ranges span both charts, it doesn't matter which one we pass here.
    // It's used to get the width of the container, and both charts have the
    // same width.
    const leftEdgePixel = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, 'main', overlay.bounds.min);
    const rightEdgePixel = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, 'main', overlay.bounds.max);
    if (leftEdgePixel === null || rightEdgePixel === null) {
        return;
    }
    const rangeWidth = rightEdgePixel - leftEdgePixel;
    element.style.left = `${leftEdgePixel}px`;
    element.style.width = `${rangeWidth}px`;
}, _Overlays_positionEntryLabelOverlay = function _Overlays_positionEntryLabelOverlay(overlay, element) {
    // Because the entry outline is a common Overlay pattern, get the wrapper of the entry
    // that comes with the Trace.Types.Overlays.EntryLabel Overlay and pass it into the `positionEntryBorderOutlineType`
    // to draw and position it. The other parts of Trace.Types.Overlays.EntryLabel are drawn by the `EntryLabelOverlay` class.
    const component = element.querySelector('devtools-entry-label-overlay');
    if (!component) {
        return null;
    }
    const entryWrapper = component.entryHighlightWrapper();
    const inputField = component.shadowRoot?.querySelector('.input-field');
    if (!entryWrapper) {
        return null;
    }
    const { entryHeight, entryWidth, cutOffHeight = 0, x, y } = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_positionEntryBorderOutlineType).call(this, overlay.entry, entryWrapper) || {};
    if (!entryHeight || !entryWidth || x === null || !y) {
        return null;
    }
    // Use the actual inputfield height to position the overlay, with a default value in case the element has not yet been rendered.
    const inputFieldHeight = inputField?.offsetHeight ?? 25;
    // Position the start of label overlay at the start of the entry + length of connector + length of the label element
    element.style.top =
        `${y - Components.EntryLabelOverlay.EntryLabelOverlay.LABEL_CONNECTOR_HEIGHT - inputFieldHeight}px`;
    element.style.left = `${x}px`;
    element.style.width = `${entryWidth}px`;
    return entryHeight - cutOffHeight;
}, _Overlays_positionCandyStripedTimeRange = function _Overlays_positionCandyStripedTimeRange(overlay, element) {
    const chartName = chartForEntry(overlay.entry);
    const startX = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, chartName, overlay.bounds.min);
    const endX = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, chartName, overlay.bounds.max);
    if (startX === null || endX === null) {
        return;
    }
    const widthPixels = endX - startX;
    // The entry selected overlay is always at least 2px wide.
    const finalWidth = Math.max(2, widthPixels);
    element.style.width = `${finalWidth}px`;
    element.style.left = `${startX}px`;
    let y = this.yPixelForEventOnChart(overlay.entry);
    if (y === null) {
        return;
    }
    const totalHeight = this.pixelHeightForEventOnChart(overlay.entry) ?? 0;
    // We might modify the height we use when drawing the overlay, hence copying the totalHeight.
    let height = totalHeight;
    if (height === null) {
        return;
    }
    // If the event is on the main chart, we need to adjust its selected border
    // if the event is cut off the top of the screen, because we need to ensure
    // that it does not overlap the resize element. Unfortunately we cannot
    // z-index our way out of this, so instead we calculate if the event is cut
    // off, and if it is, we draw the partial selected outline and do not draw
    // the top border, making it appear like it is going behind the resizer.
    // We don't need to worry about it going off the bottom, because in that
    // case we don't draw the overlay anyway.
    if (chartName === 'main') {
        const chartTopPadding = this.networkChartOffsetHeight();
        // We now calculate the available height: if the entry is cut off we don't
        // show the border for the part that is cut off.
        const cutOffTop = y < chartTopPadding;
        height = cutOffTop ? Math.abs(y + height - chartTopPadding) : height;
        element.classList.toggle('cut-off-top', cutOffTop);
        if (cutOffTop) {
            // Adjust the y position: we need to move it down from the top Y
            // position to the Y position of the first visible pixel. The
            // adjustment is totalHeight - height because if the totalHeight is 17,
            // and the visibleHeight is 5, we need to draw the overay at 17-5=12px
            // vertically from the top of the event.
            y = y + totalHeight - height;
        }
    }
    else {
        // If the event is on the network chart, we use the same logic as above
        // for the main chart, but to check if the event is cut off the bottom of
        // the network track and only part of the overlay is visible.
        // We don't need to worry about the event going off the top of the panel
        // as we can show the full overlay and it gets cut off by the minimap UI.
        const networkHeight = __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network?.heightPixels ?? 0;
        const lastVisibleY = y + totalHeight;
        const cutOffBottom = lastVisibleY > networkHeight;
        const cutOffTop = y > networkHeight;
        element.classList.toggle('cut-off-top', cutOffTop);
        element.classList.toggle('cut-off-bottom', cutOffBottom);
        if (cutOffBottom) {
            // Adjust the height of the overlay to be the amount of visible pixels.
            height = networkHeight - y;
        }
    }
    element.style.height = `${height}px`;
    element.style.top = `${y}px`;
}, _Overlays_positionEntryBorderOutlineType = function _Overlays_positionEntryBorderOutlineType(entry, element) {
    const chartName = chartForEntry(entry);
    let x = this.xPixelForEventStartOnChart(entry);
    let y = this.yPixelForEventOnChart(entry);
    const chartWidth = (chartName === 'main') ? __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.main?.widthPixels :
        __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network?.widthPixels;
    if (x === null || y === null || !chartWidth) {
        return null;
    }
    const { endTime } = timingsForOverlayEntry(entry);
    const endX = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_xPixelForMicroSeconds).call(this, chartName, endTime);
    if (endX === null) {
        return null;
    }
    const totalHeight = this.pixelHeightForEventOnChart(entry) ?? 0;
    // We might modify the height we use when drawing the overlay, hence copying the totalHeight.
    let height = totalHeight;
    if (height === null) {
        return null;
    }
    // The width of the overlay is by default the width of the entry. However
    // we modify that for instant events like LCP markers, and also ensure a
    // minimum width.
    let widthPixels = endX - x;
    const provider = chartName === 'main' ? __classPrivateFieldGet(this, _Overlays_charts, "f").mainProvider : __classPrivateFieldGet(this, _Overlays_charts, "f").networkProvider;
    const chart = chartName === 'main' ? __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart : __classPrivateFieldGet(this, _Overlays_charts, "f").networkChart;
    const index = provider.indexForEvent?.(entry);
    const customPos = chart.getCustomDrawnPositionForEntryIndex(index ?? -1);
    if (customPos) {
        // Some events like markers and layout shifts define their exact coordinates explicitly.
        // If this is one of those events we should change the overlay coordinates to match.
        x = customPos.x;
        widthPixels = customPos.width;
    }
    // Calculate the visible overlay width by subtracting the entry width that is outside of the flamechart width
    const cutOffRight = (x + widthPixels > chartWidth) ? (x + widthPixels) - chartWidth : null;
    const cutOffLeft = (x < 0) ? Math.abs(x) : null;
    element.classList.toggle('cut-off-right', cutOffRight !== null);
    if (cutOffRight) {
        widthPixels = widthPixels - cutOffRight;
    }
    if (cutOffLeft) {
        // If the entry is cut off from the left, move its beginning to the left most part of the flamechart
        x = 0;
        widthPixels = widthPixels - cutOffLeft;
    }
    // The entry selected overlay is always at least 2px wide.
    const finalWidth = Math.max(2, widthPixels);
    element.style.width = `${finalWidth}px`;
    // If the event is on the main chart, we need to adjust its selected border
    // if the event is cut off the top of the screen, because we need to ensure
    // that it does not overlap the resize element. Unfortunately we cannot
    // z-index our way out of this, so instead we calculate if the event is cut
    // off, and if it is, we draw the partial selected outline and do not draw
    // the top border, making it appear like it is going behind the resizer.
    // We don't need to worry about it going off the bottom, because in that
    // case we don't draw the overlay anyway.
    if (chartName === 'main') {
        const chartTopPadding = this.networkChartOffsetHeight();
        // We now calculate the available height: if the entry is cut off we don't
        // show the border for the part that is cut off.
        const cutOffTop = y < chartTopPadding;
        height = cutOffTop ? Math.abs(y + height - chartTopPadding) : height;
        element.classList.toggle('cut-off-top', cutOffTop);
        if (cutOffTop) {
            // Adjust the y position: we need to move it down from the top Y
            // position to the Y position of the first visible pixel. The
            // adjustment is totalHeight - height because if the totalHeight is 17,
            // and the visibleHeight is 5, we need to draw the overay at 17-5=12px
            // vertically from the top of the event.
            y = y + totalHeight - height;
        }
    }
    else {
        // If the event is on the network chart, we use the same logic as above
        // for the main chart, but to check if the event is cut off the bottom of
        // the network track and only part of the overlay is visible.
        // We don't need to worry about the even going off the top of the panel
        // as we can show the full overlay and it gets cut off by the minimap UI.
        const networkHeight = __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network?.heightPixels ?? 0;
        const lastVisibleY = y + totalHeight;
        const cutOffBottom = lastVisibleY > networkHeight;
        element.classList.toggle('cut-off-bottom', cutOffBottom);
        if (cutOffBottom) {
            // Adjust the height of the overlay to be the amount of visible pixels.
            height = networkHeight - y;
        }
    }
    element.style.height = `${height}px`;
    element.style.top = `${y}px`;
    element.style.left = `${x}px`;
    return { entryHeight: totalHeight, entryWidth: finalWidth, cutOffHeight: totalHeight - height, x, y };
}, _Overlays_calculateFromAndToForEntriesLink = function _Overlays_calculateFromAndToForEntriesLink(overlay) {
    if (!overlay.entryTo) {
        // This case is where the user has clicked on the first entry and needs
        // to pick a second. In this case they can only pick from visible
        // entries, so we don't need to do any checks and can just return.
        return {
            entryFrom: overlay.entryFrom,
            entryTo: overlay.entryTo,
            entryFromIsSource: true,
            entryToIsSource: true,
        };
    }
    let entryFrom = overlay.entryFrom;
    let entryTo = overlay.entryTo ?? null;
    if (__classPrivateFieldGet(this, _Overlays_queries, "f").isEntryCollapsedByUser(overlay.entryFrom)) {
        entryFrom = __classPrivateFieldGet(this, _Overlays_queries, "f").firstVisibleParentForEntry(overlay.entryFrom);
    }
    if (overlay.entryTo && __classPrivateFieldGet(this, _Overlays_queries, "f").isEntryCollapsedByUser(overlay.entryTo)) {
        entryTo = __classPrivateFieldGet(this, _Overlays_queries, "f").firstVisibleParentForEntry(overlay.entryTo);
    }
    if (entryFrom === null || entryTo === null) {
        // We cannot draw this overlay; so return null;
        // The only valid case of entryTo being null/undefined has been dealt
        // with already at the start of this function.
        return null;
    }
    return {
        entryFrom,
        entryFromIsSource: entryFrom === overlay.entryFrom,
        entryTo,
        entryToIsSource: entryTo === overlay.entryTo,
    };
}, _Overlays_createElementForNewOverlay = function _Overlays_createElementForNewOverlay(overlay) {
    const overlayElement = document.createElement('div');
    overlayElement.classList.add('overlay-item', `overlay-type-${overlay.type}`);
    const jslogContext = jsLogContext(overlay);
    if (jslogContext) {
        overlayElement.setAttribute('jslog', `${VisualLogging.item(jslogContext)}`);
    }
    switch (overlay.type) {
        case 'ENTRY_LABEL': {
            const shouldDrawLabelBelowEntry = Trace.Types.Events.isLegacyTimelineFrame(overlay.entry);
            const component = new Components.EntryLabelOverlay.EntryLabelOverlay(overlay.label, shouldDrawLabelBelowEntry);
            // Generate the AI Call Tree for the AI Auto-Annotation feature.
            const parsedTrace = __classPrivateFieldGet(this, _Overlays_queries, "f").parsedTrace();
            const callTree = parsedTrace ? Utils.AICallTree.AICallTree.fromEvent(overlay.entry, parsedTrace) : null;
            component.callTree = callTree;
            component.addEventListener(Components.EntryLabelOverlay.LabelAnnotationsConsentDialogVisibilityChange.eventName, e => {
                const event = e;
                this.dispatchEvent(new ConsentDialogVisibilityChange(event.isVisible));
            });
            component.addEventListener(Components.EntryLabelOverlay.EntryLabelRemoveEvent.eventName, () => {
                this.dispatchEvent(new AnnotationOverlayActionEvent(overlay, 'Remove'));
            });
            component.addEventListener(Components.EntryLabelOverlay.EntryLabelChangeEvent.eventName, event => {
                const newLabel = event.newLabel;
                overlay.label = newLabel;
                this.dispatchEvent(new AnnotationOverlayActionEvent(overlay, 'Update'));
            });
            overlayElement.appendChild(component);
            overlayElement.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                this.dispatchEvent(new EntryLabelMouseClick(overlay));
            });
            return overlayElement;
        }
        case 'ENTRIES_LINK': {
            const entries = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_calculateFromAndToForEntriesLink).call(this, overlay);
            if (entries === null) {
                // For some reason, we don't have two entries we can draw between
                // (can happen if the user has collapsed an icicle in the flame
                // chart, or a track), so just draw an empty div.
                return overlayElement;
            }
            const entryEndX = this.xPixelForEventEndOnChart(entries.entryFrom) ?? 0;
            const entryStartX = this.xPixelForEventEndOnChart(entries.entryFrom) ?? 0;
            const entryStartY = (this.yPixelForEventOnChart(entries.entryFrom) ?? 0);
            const entryWidth = entryEndX - entryStartX;
            const entryHeight = this.pixelHeightForEventOnChart(entries.entryFrom) ?? 0;
            const component = new Components.EntriesLinkOverlay.EntriesLinkOverlay({ x: entryEndX, y: entryStartY, width: entryWidth, height: entryHeight }, overlay.state);
            component.addEventListener(Components.EntriesLinkOverlay.EntryLinkStartCreating.eventName, () => {
                overlay.state = "pending_to_event" /* Trace.Types.File.EntriesLinkState.PENDING_TO_EVENT */;
                this.dispatchEvent(new AnnotationOverlayActionEvent(overlay, 'Update'));
            });
            overlayElement.appendChild(component);
            return overlayElement;
        }
        case 'ENTRY_OUTLINE': {
            overlayElement.classList.add(`outline-reason-${overlay.outlineReason}`);
            return overlayElement;
        }
        case 'TIME_RANGE': {
            const component = new Components.TimeRangeOverlay.TimeRangeOverlay(overlay.label);
            component.duration = overlay.showDuration ? overlay.bounds.range : null;
            component.canvasRect = __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart.canvasBoundingClientRect();
            component.addEventListener(Components.TimeRangeOverlay.TimeRangeLabelChangeEvent.eventName, event => {
                const newLabel = event.newLabel;
                overlay.label = newLabel;
                this.dispatchEvent(new AnnotationOverlayActionEvent(overlay, 'Update'));
            });
            component.addEventListener(Components.TimeRangeOverlay.TimeRangeRemoveEvent.eventName, () => {
                this.dispatchEvent(new AnnotationOverlayActionEvent(overlay, 'Remove'));
            });
            component.addEventListener('mouseover', () => {
                this.dispatchEvent(new TimeRangeMouseOverEvent(overlay));
            });
            component.addEventListener('mouseout', () => {
                this.dispatchEvent(new TimeRangeMouseOutEvent());
            });
            overlayElement.appendChild(component);
            return overlayElement;
        }
        case 'TIMESPAN_BREAKDOWN': {
            const component = new Components.TimespanBreakdownOverlay.TimespanBreakdownOverlay();
            component.sections = overlay.sections;
            component.canvasRect = __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart.canvasBoundingClientRect();
            component.isBelowEntry = overlay.renderLocation === 'BELOW_EVENT';
            overlayElement.appendChild(component);
            return overlayElement;
        }
        case 'TIMINGS_MARKER': {
            const { color } = Utils.EntryStyles.markerDetailsForEvent(overlay.entries[0]);
            const markersComponent = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_createTimingsMarkerElement).call(this, overlay);
            overlayElement.appendChild(markersComponent);
            overlayElement.style.backgroundColor = color;
            return overlayElement;
        }
        default: {
            return overlayElement;
        }
    }
}, _Overlays_clickEvent = function _Overlays_clickEvent(event) {
    this.dispatchEvent(new EventReferenceClick(event));
}, _Overlays_createOverlayPopover = function _Overlays_createOverlayPopover(adjustedTimestamp, name, fieldResult) {
    const popoverElement = document.createElement('div');
    const popoverContents = popoverElement.createChild('div', 'overlay-popover');
    popoverContents.createChild('span', 'overlay-popover-time').textContent =
        i18n.TimeUtilities.formatMicroSecondsTime(adjustedTimestamp);
    popoverContents.createChild('span', 'overlay-popover-title').textContent =
        fieldResult ? i18nString(UIStrings.fieldMetricMarkerLocal, { PH1: name }) : name;
    // If there's field data, make another row.
    if (fieldResult) {
        const popoverContents = popoverElement.createChild('div', 'overlay-popover');
        popoverContents.createChild('span', 'overlay-popover-time').textContent =
            i18n.TimeUtilities.formatMicroSecondsTime(fieldResult.value);
        let scope = fieldResult.pageScope;
        if (fieldResult.pageScope === 'url') {
            scope = i18nString(UIStrings.urlOption);
        }
        else if (fieldResult.pageScope === 'origin') {
            scope = i18nString(UIStrings.originOption);
        }
        popoverContents.createChild('span', 'overlay-popover-title').textContent =
            i18nString(UIStrings.fieldMetricMarkerField, {
                PH1: name,
                PH2: scope,
            });
    }
    return popoverElement;
}, _Overlays_mouseMoveOverlay = function _Overlays_mouseMoveOverlay(e, event, name, overlay, markers, marker) {
    const fieldResult = overlay.entryToFieldResult.get(event);
    const popoverElement = __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_createOverlayPopover).call(this, overlay.adjustedTimestamp, name, fieldResult);
    __classPrivateFieldSet(this, _Overlays_lastMouseOffsetX, e.offsetX + (markers.offsetLeft || 0) + (marker.offsetLeft || 0), "f");
    __classPrivateFieldSet(this, _Overlays_lastMouseOffsetY, e.offsetY + markers.offsetTop || 0, "f");
    __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart.updateMouseOffset(__classPrivateFieldGet(this, _Overlays_lastMouseOffsetX, "f"), __classPrivateFieldGet(this, _Overlays_lastMouseOffsetY, "f"));
    __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart.updatePopoverContents(popoverElement);
}, _Overlays_mouseOutOverlay = function _Overlays_mouseOutOverlay() {
    __classPrivateFieldSet(this, _Overlays_lastMouseOffsetX, -1, "f");
    __classPrivateFieldSet(this, _Overlays_lastMouseOffsetY, -1, "f");
    __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart.updateMouseOffset(__classPrivateFieldGet(this, _Overlays_lastMouseOffsetX, "f"), __classPrivateFieldGet(this, _Overlays_lastMouseOffsetY, "f"));
    __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart.hideHighlight();
}, _Overlays_createTimingsMarkerElement = function _Overlays_createTimingsMarkerElement(overlay) {
    const markers = document.createElement('div');
    markers.classList.add('markers');
    for (const entry of overlay.entries) {
        const { color, title } = Utils.EntryStyles.markerDetailsForEvent(entry);
        const marker = document.createElement('div');
        marker.classList.add('marker-title');
        marker.textContent = title;
        marker.style.backgroundColor = color;
        markers.appendChild(marker);
        marker.addEventListener('click', () => __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_clickEvent).call(this, entry));
        // Popover.
        marker.addEventListener('mousemove', e => __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_mouseMoveOverlay).call(this, e, entry, title, overlay, markers, marker));
        marker.addEventListener('mouseout', () => __classPrivateFieldGet(this, _Overlays_instances, "m", _Overlays_mouseOutOverlay).call(this));
    }
    return markers;
}, _Overlays_updateOverlayBeforePositioning = function _Overlays_updateOverlayBeforePositioning(overlay, element) {
    switch (overlay.type) {
        case 'ENTRY_SELECTED':
            break;
        case 'TIME_RANGE': {
            const component = element.querySelector('devtools-time-range-overlay');
            if (component) {
                component.duration = overlay.showDuration ? overlay.bounds.range : null;
                component.canvasRect = __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart.canvasBoundingClientRect();
            }
            break;
        }
        case 'ENTRY_LABEL':
        case 'ENTRY_OUTLINE':
        case 'ENTRIES_LINK': {
            const component = element.querySelector('devtools-entries-link-overlay');
            if (component) {
                component.canvasRect = __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart.canvasBoundingClientRect();
            }
            break;
        }
        case 'TIMESPAN_BREAKDOWN': {
            const component = element.querySelector('devtools-timespan-breakdown-overlay');
            if (component) {
                component.sections = overlay.sections;
                component.canvasRect = __classPrivateFieldGet(this, _Overlays_charts, "f").mainChart.canvasBoundingClientRect();
            }
            break;
        }
        case 'TIMESTAMP_MARKER':
            break;
        case 'CANDY_STRIPED_TIME_RANGE':
            break;
        case 'TIMINGS_MARKER':
            break;
        default:
            Platform.TypeScriptUtilities.assertNever(overlay, `Unexpected overlay ${overlay}`);
    }
}, _Overlays_updateOverlayAfterPositioning = function _Overlays_updateOverlayAfterPositioning(overlay, element) {
    switch (overlay.type) {
        case 'ENTRY_SELECTED':
            break;
        case 'TIME_RANGE': {
            const component = element.querySelector('devtools-time-range-overlay');
            component?.updateLabelPositioning();
            break;
        }
        case 'ENTRY_LABEL':
            break;
        case 'ENTRY_OUTLINE':
            break;
        case 'ENTRIES_LINK':
            break;
        case 'TIMESPAN_BREAKDOWN': {
            const component = element.querySelector('devtools-timespan-breakdown-overlay');
            component?.checkSectionLabelPositioning();
            break;
        }
        case 'TIMESTAMP_MARKER':
            break;
        case 'CANDY_STRIPED_TIME_RANGE':
            break;
        case 'TIMINGS_MARKER':
            break;
        default:
            Platform.TypeScriptUtilities.assertNever(overlay, `Unexpected overlay ${overlay}`);
    }
}, _Overlays_entryIsHorizontallyVisibleOnChart = function _Overlays_entryIsHorizontallyVisibleOnChart(entry) {
    if (__classPrivateFieldGet(this, _Overlays_dimensions, "f").trace.visibleWindow === null) {
        return false;
    }
    const { startTime, endTime } = timingsForOverlayEntry(entry);
    const entryTimeRange = Trace.Helpers.Timing.traceWindowFromMicroSeconds(startTime, endTime);
    return Trace.Helpers.Timing.boundsIncludeTimeRange({
        bounds: __classPrivateFieldGet(this, _Overlays_dimensions, "f").trace.visibleWindow,
        timeRange: entryTimeRange,
    });
}, _Overlays_entryIsInCollapsedTrack = function _Overlays_entryIsInCollapsedTrack(entry) {
    const chartName = chartForEntry(entry);
    const provider = chartName === 'main' ? __classPrivateFieldGet(this, _Overlays_charts, "f").mainProvider : __classPrivateFieldGet(this, _Overlays_charts, "f").networkProvider;
    const entryIndex = provider.indexForEvent?.(entry) ?? null;
    if (entryIndex === null) {
        return false;
    }
    const group = provider.groupForEvent?.(entryIndex) ?? null;
    if (!group) {
        return false;
    }
    return Boolean(group.expanded) === false;
}, _Overlays_entryIsVerticallyVisibleOnChart = function _Overlays_entryIsVerticallyVisibleOnChart(entry) {
    const chartName = chartForEntry(entry);
    const y = this.yPixelForEventOnChart(entry);
    if (y === null) {
        return false;
    }
    const eventHeight = this.pixelHeightForEventOnChart(entry);
    if (!eventHeight) {
        return false;
    }
    if (chartName === 'main') {
        if (!__classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.main?.heightPixels) {
            // Shouldn't happen, but if the main chart has no height, nothing on it is visible.
            return false;
        }
        // The yPixelForEventOnChart method returns the y pixel including an adjustment for the network track.
        // To see if an entry on the main flame chart is visible, we can check
        // its y value without the network track adjustment. If it is < 0, then
        // it's off the top of the screen.
        //
        const yWithoutNetwork = y - this.networkChartOffsetHeight();
        // Check if the y position + the height is less than 0. We add height so
        // that we correctly consider an event only partially scrolled off to be
        // visible.
        if (yWithoutNetwork + eventHeight < 0) {
            return false;
        }
        if (yWithoutNetwork > __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.main.heightPixels) {
            // The event is off the bottom of the screen.
            return false;
        }
    }
    if (chartName === 'network') {
        if (!__classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network) {
            // The network chart can be hidden if there are no requests in the trace.
            return false;
        }
        if (y <= -14) {
            // Weird value, but the network chart has the header row with
            // timestamps on it: events stay visible behind those timestamps, so we
            // want any overlays to treat themselves as visible too.
            return false;
        }
        if (y > __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts.network.heightPixels) {
            // The event is off the bottom of the network chart.
            return false;
        }
    }
    // If we got here, none of the conditions to mark an event as invisible got
    // triggered, so the event must be visible.
    return true;
}, _Overlays_xPixelForMicroSeconds = function _Overlays_xPixelForMicroSeconds(chart, timestamp) {
    if (__classPrivateFieldGet(this, _Overlays_dimensions, "f").trace.visibleWindow === null) {
        console.error('Cannot calculate xPixel without visible trace window.');
        return null;
    }
    const canvasWidthPixels = __classPrivateFieldGet(this, _Overlays_dimensions, "f").charts[chart]?.widthPixels ?? null;
    if (canvasWidthPixels === null) {
        console.error(`Cannot calculate xPixel without ${chart} dimensions.`);
        return null;
    }
    const timeFromLeft = timestamp - __classPrivateFieldGet(this, _Overlays_dimensions, "f").trace.visibleWindow.min;
    const totalTimeSpan = __classPrivateFieldGet(this, _Overlays_dimensions, "f").trace.visibleWindow.range;
    return Math.floor(timeFromLeft / totalTimeSpan * canvasWidthPixels);
}, _Overlays_setOverlayElementVisibility = function _Overlays_setOverlayElementVisibility(element, isVisible) {
    element.style.display = isVisible ? 'block' : 'none';
};
/**
 * Because entries can be a TimelineFrame, which is not a trace event, this
 * helper exists to return a consistent set of timings regardless of the type
 * of entry.
 */
export function timingsForOverlayEntry(entry) {
    if (Trace.Types.Events.isLegacyTimelineFrame(entry)) {
        return {
            startTime: entry.startTime,
            endTime: entry.endTime,
            duration: entry.duration,
        };
    }
    return Trace.Helpers.Timing.eventTimingsMicroSeconds(entry);
}
/**
 * Defines if the overlay container `div` should have a jslog context attached.
 * Note that despite some of the overlays being used currently exclusively
 * for annotations, we log here with `overlays` to be generic as overlays can
 * be used for insights, annotations or in the future, who knows...
 */
export function jsLogContext(overlay) {
    switch (overlay.type) {
        case 'ENTRY_SELECTED': {
            // No jslog for this; it would be very noisy and not very useful.
            return null;
        }
        case 'ENTRY_OUTLINE': {
            return `timeline.overlays.entry-outline-${Platform.StringUtilities.toKebabCase(overlay.outlineReason)}`;
        }
        case 'ENTRY_LABEL': {
            return 'timeline.overlays.entry-label';
        }
        case 'ENTRIES_LINK': {
            // do not log impressions for incomplete entry links
            if (overlay.state !== "connected" /* Trace.Types.File.EntriesLinkState.CONNECTED */) {
                return null;
            }
            return 'timeline.overlays.entries-link';
        }
        case 'TIME_RANGE': {
            return 'timeline.overlays.time-range';
        }
        case 'TIMESPAN_BREAKDOWN': {
            return 'timeline.overlays.timespan-breakdown';
        }
        case 'TIMESTAMP_MARKER': {
            return 'timeline.overlays.cursor-timestamp-marker';
        }
        case 'CANDY_STRIPED_TIME_RANGE': {
            return 'timeline.overlays.candy-striped-time-range';
        }
        case 'TIMINGS_MARKER': {
            return 'timeline.overlays.timings-marker';
        }
        default:
            Platform.assertNever(overlay, 'Unknown overlay type');
    }
}
//# sourceMappingURL=OverlaysImpl.js.map