// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _TimelineFlameChartNetworkDataProvider_instances, _TimelineFlameChartNetworkDataProvider_minimumBoundary, _TimelineFlameChartNetworkDataProvider_timeSpan, _TimelineFlameChartNetworkDataProvider_events, _TimelineFlameChartNetworkDataProvider_maxLevel, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, _TimelineFlameChartNetworkDataProvider_lastSelection, _TimelineFlameChartNetworkDataProvider_parsedTrace, _TimelineFlameChartNetworkDataProvider_eventIndexByEvent, _TimelineFlameChartNetworkDataProvider_lastInitiatorEntry, _TimelineFlameChartNetworkDataProvider_lastInitiatorsData, _TimelineFlameChartNetworkDataProvider_entityMapper, _TimelineFlameChartNetworkDataProvider_persistedGroupConfigSetting, _TimelineFlameChartNetworkDataProvider_decorateNetworkRequest, _TimelineFlameChartNetworkDataProvider_decorateSyntheticWebSocketConnection, _TimelineFlameChartNetworkDataProvider_setTimingBoundsData, _TimelineFlameChartNetworkDataProvider_updateTimelineData;
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Trace from '../../models/trace/trace.js';
import * as PerfUI from '../../ui/legacy/components/perf_ui/perf_ui.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as ThemeSupport from '../../ui/legacy/theme_support/theme_support.js';
import * as TimelineComponents from './components/components.js';
import { initiatorsDataToDrawForNetwork } from './Initiators.js';
import { NetworkTrackAppender } from './NetworkTrackAppender.js';
import timelineFlamechartPopoverStyles from './timelineFlamechartPopover.css.js';
import { FlameChartStyle, Selection } from './TimelineFlameChartView.js';
import { selectionFromEvent, selectionIsRange, selectionsEqual, } from './TimelineSelection.js';
import { buildPersistedConfig, keyForTraceConfig } from './TrackConfiguration.js';
import * as TimelineUtils from './utils/utils.js';
export class TimelineFlameChartNetworkDataProvider {
    constructor() {
        _TimelineFlameChartNetworkDataProvider_instances.add(this);
        _TimelineFlameChartNetworkDataProvider_minimumBoundary.set(this, 0);
        _TimelineFlameChartNetworkDataProvider_timeSpan.set(this, 0);
        _TimelineFlameChartNetworkDataProvider_events.set(this, []);
        _TimelineFlameChartNetworkDataProvider_maxLevel.set(this, 0);
        _TimelineFlameChartNetworkDataProvider_networkTrackAppender.set(this, null);
        _TimelineFlameChartNetworkDataProvider_timelineDataInternal.set(this, null);
        _TimelineFlameChartNetworkDataProvider_lastSelection.set(this, null);
        _TimelineFlameChartNetworkDataProvider_parsedTrace.set(this, null);
        _TimelineFlameChartNetworkDataProvider_eventIndexByEvent.set(this, new Map());
        // -1 means no entry is selected.
        _TimelineFlameChartNetworkDataProvider_lastInitiatorEntry.set(this, -1);
        _TimelineFlameChartNetworkDataProvider_lastInitiatorsData.set(this, []);
        _TimelineFlameChartNetworkDataProvider_entityMapper.set(this, null);
        _TimelineFlameChartNetworkDataProvider_persistedGroupConfigSetting.set(this, null);
        this.reset();
    }
    // Reset all data other than the UI elements.
    // This should be called when
    // - initialized the data provider
    // - a new trace file is coming (when `setModel()` is called)
    // etc.
    reset() {
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_maxLevel, 0, "f");
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_minimumBoundary, 0, "f");
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_timeSpan, 0, "f");
        __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_eventIndexByEvent, "f").clear();
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_events, [], "f");
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, null, "f");
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, null, "f");
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, null, "f");
    }
    setModel(parsedTrace, entityMapper) {
        this.reset();
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, parsedTrace, "f");
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_entityMapper, entityMapper, "f");
        this.setEvents(__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f"));
        __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_instances, "m", _TimelineFlameChartNetworkDataProvider_setTimingBoundsData).call(this, __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f"));
    }
    setEvents(parsedTrace) {
        if (parsedTrace.NetworkRequests.webSocket) {
            parsedTrace.NetworkRequests.webSocket.forEach(webSocketData => {
                if (webSocketData.syntheticConnection) {
                    __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f").push(webSocketData.syntheticConnection);
                }
                __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f").push(...webSocketData.events);
            });
        }
        if (parsedTrace.NetworkRequests.byTime) {
            __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f").push(...parsedTrace.NetworkRequests.byTime);
        }
    }
    isEmpty() {
        this.timelineData();
        return !__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f").length;
    }
    maxStackDepth() {
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_maxLevel, "f");
    }
    hasTrackConfigurationMode() {
        return false;
    }
    timelineData() {
        if (__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f") && __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f").entryLevels.length !== 0) {
            // The flame chart data is built already, so return the cached data.
            return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f");
        }
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, PerfUI.FlameChart.FlameChartTimelineData.createEmpty(), "f");
        if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f")) {
            return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f");
        }
        if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f").length) {
            this.setEvents(__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f"));
        }
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, new NetworkTrackAppender(__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f"), __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f")), "f");
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_maxLevel, __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f").appendTrackAtLevel(0), "f");
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f");
    }
    minimumBoundary() {
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_minimumBoundary, "f");
    }
    totalTime() {
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timeSpan, "f");
    }
    setWindowTimes(startTime, endTime) {
        __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_instances, "m", _TimelineFlameChartNetworkDataProvider_updateTimelineData).call(this, startTime, endTime);
    }
    createSelection(index) {
        if (index === -1) {
            return null;
        }
        const event = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f")[index];
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_lastSelection, new Selection(selectionFromEvent(event), index), "f");
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_lastSelection, "f").timelineSelection;
    }
    customizedContextMenu(event, eventIndex, _groupIndex) {
        const networkRequest = this.eventByIndex(eventIndex);
        if (!networkRequest || !Trace.Types.Events.isSyntheticNetworkRequest(networkRequest)) {
            return;
        }
        const timelineNetworkRequest = SDK.TraceObject.RevealableNetworkRequest.create(networkRequest);
        const contextMenu = new UI.ContextMenu.ContextMenu(event);
        contextMenu.appendApplicableItems(timelineNetworkRequest);
        return contextMenu;
    }
    indexForEvent(event) {
        if (!Trace.Types.Events.isNetworkTrackEntry(event)) {
            return null;
        }
        const fromCache = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_eventIndexByEvent, "f").get(event);
        // Cached value might be null, which is OK.
        if (fromCache !== undefined) {
            return fromCache;
        }
        const index = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f").indexOf(event);
        const result = index > -1 ? index : null;
        __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_eventIndexByEvent, "f").set(event, result);
        return result;
    }
    eventByIndex(entryIndex) {
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f").at(entryIndex) ?? null;
    }
    entryIndexForSelection(selection) {
        if (!selection || selectionIsRange(selection)) {
            return -1;
        }
        if (__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_lastSelection, "f") && selectionsEqual(__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_lastSelection, "f").timelineSelection, selection)) {
            return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_lastSelection, "f").entryIndex;
        }
        if (!Trace.Types.Events.isNetworkTrackEntry(selection.event)) {
            return -1;
        }
        const index = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f").indexOf(selection.event);
        if (index !== -1) {
            __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_lastSelection, new Selection(selectionFromEvent(selection.event), index), "f");
        }
        return index;
    }
    groupForEvent(_entryIndex) {
        // Because the network track only contains one group, we don't actually
        // need to do any lookups here.
        const group = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f")?.group() ?? null;
        return group;
    }
    entryColor(index) {
        if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f")) {
            throw new Error('networkTrackAppender should not be empty');
        }
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f").colorForEvent(__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f")[index]);
    }
    textColor(_index) {
        return FlameChartStyle.textColor;
    }
    entryTitle(index) {
        const event = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f")[index];
        return TimelineUtils.EntryName.nameForEntry(event);
    }
    entryFont(_index) {
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f")?.font() || null;
    }
    /**
     * Returns the pixels needed to decorate the event.
     * The pixels compare to the start of the earliest event of the request.
     *
     * Request.beginTime(), which is used in FlameChart to calculate the unclippedBarX
     * v
     *    |----------------[ (URL text)    waiting time   |   request  ]--------|
     *    ^start           ^sendStart                     ^headersEnd  ^Finish  ^end
     * @param request
     * @param unclippedBarX The start pixel of the request. It is calculated with request.beginTime() in FlameChart.
     * @param timeToPixelRatio
     * @returns the pixels to draw waiting time and left and right whiskers and url text
     */
    getDecorationPixels(event, unclippedBarX, timeToPixelRatio) {
        const beginTime = Trace.Helpers.Timing.microToMilli(event.ts);
        const timeToPixel = (time) => unclippedBarX + (time - beginTime) * timeToPixelRatio;
        const startTime = Trace.Helpers.Timing.microToMilli(event.ts);
        const endTime = Trace.Helpers.Timing.microToMilli((event.ts + event.dur));
        const sendStartTime = Trace.Helpers.Timing.microToMilli(event.args.data.syntheticData.sendStartTime);
        const headersEndTime = Trace.Helpers.Timing.microToMilli(event.args.data.syntheticData.downloadStart);
        const sendStart = Math.max(timeToPixel(sendStartTime), unclippedBarX);
        const headersEnd = Math.max(timeToPixel(headersEndTime), sendStart);
        const finish = Math.max(timeToPixel(Trace.Helpers.Timing.microToMilli(event.args.data.syntheticData.finishTime)), headersEnd);
        const start = timeToPixel(startTime);
        const end = Math.max(timeToPixel(endTime), finish);
        return { sendStart, headersEnd, finish, start, end };
    }
    /**
     * Decorates the entry depends on the type of the event:
     * @param index
     * @param context
     * @param barX The x pixel of the visible part request
     * @param barY The y pixel of the visible part request
     * @param barWidth The width of the visible part request
     * @param barHeight The height of the visible part request
     * @param unclippedBarX The start pixel of the request compare to the visible area. It is calculated with request.beginTime() in FlameChart.
     * @param timeToPixelRatio
     * @returns if the entry needs to be decorate, which is alway true if the request has "timing" field
     */
    decorateEntry(index, context, _text, barX, barY, barWidth, barHeight, unclippedBarX, timeToPixelRatio) {
        const event = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f")[index];
        if (Trace.Types.Events.isSyntheticWebSocketConnection(event)) {
            return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_instances, "m", _TimelineFlameChartNetworkDataProvider_decorateSyntheticWebSocketConnection).call(this, index, context, barY, barHeight, unclippedBarX, timeToPixelRatio);
        }
        if (!Trace.Types.Events.isSyntheticNetworkRequest(event)) {
            return false;
        }
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_instances, "m", _TimelineFlameChartNetworkDataProvider_decorateNetworkRequest).call(this, index, context, _text, barX, barY, barWidth, barHeight, unclippedBarX, timeToPixelRatio);
    }
    forceDecoration(_index) {
        return true;
    }
    /**
     *In the FlameChart.ts, when filtering through the events for a level, it starts
     * from the last event of that level and stops when it hit an event that has start
     * time greater than the filtering window.
     * For example, in this websocket level we have A(socket event), B, C, D. If C
     * event has start time greater than the window, the rest of the events (A and B)
     * wont be drawn. So if this level is the force Drawable level, we wont stop at
     * event C and will include the socket event A.
     * */
    forceDrawableLevel(levelIndex) {
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f")?.webSocketIdToLevel.has(levelIndex) || false;
    }
    preparePopoverElement(index) {
        const event = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f")[index];
        if (Trace.Types.Events.isSyntheticNetworkRequest(event)) {
            const element = document.createElement('div');
            const root = UI.UIUtils.createShadowRootWithCoreStyles(element, { cssFile: timelineFlamechartPopoverStyles });
            const contents = root.createChild('div', 'timeline-flamechart-popover');
            const infoElement = new TimelineComponents.NetworkRequestTooltip.NetworkRequestTooltip();
            infoElement.data = { networkRequest: event, entityMapper: __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_entityMapper, "f") };
            contents.appendChild(infoElement);
            return element;
        }
        return null;
    }
    /**
     * Note that although we use the same mechanism to track configuration
     * changes in the Network part of the timeline, we only really use it to track
     * the expanded state because the user cannot re-order or hide/show tracks in
     * here.
     */
    handleTrackConfigurationChange(groups, indexesInVisualOrder) {
        if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_persistedGroupConfigSetting, "f")) {
            return;
        }
        if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f")) {
            return;
        }
        const persistedDataForTrace = buildPersistedConfig(groups, indexesInVisualOrder);
        const traceKey = keyForTraceConfig(__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f"));
        const setting = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_persistedGroupConfigSetting, "f").get();
        setting[traceKey] = persistedDataForTrace;
        __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_persistedGroupConfigSetting, "f").set(setting);
    }
    setPersistedGroupConfigSetting(setting) {
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_persistedGroupConfigSetting, setting, "f");
    }
    preferredHeight() {
        if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f") || __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_maxLevel, "f") === 0) {
            return 0;
        }
        const group = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f").group();
        if (!group) {
            return 0;
        }
        // Bump up to 7 because the tooltip is around 7 rows' height.
        return group.style.height * (this.isExpanded() ? Platform.NumberUtilities.clamp(__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_maxLevel, "f") + 1, 7, 8.5) : 1);
    }
    isExpanded() {
        return Boolean(__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f")?.group()?.expanded);
    }
    formatValue(value, precision) {
        return i18n.TimeUtilities.preciseMillisToString(value, precision);
    }
    canJumpToEntry(_entryIndex) {
        return false;
    }
    /**
     * searches entries within the specified time and returns a list of entry
     * indexes
     */
    search(visibleWindow, filter) {
        const results = [];
        for (let i = 0; i < __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f").length; i++) {
            const entry = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f").at(i);
            if (!entry) {
                continue;
            }
            if (!Trace.Helpers.Timing.eventIsInBounds(entry, visibleWindow)) {
                continue;
            }
            if (!filter || filter.accept(entry, __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f") ?? undefined)) {
                const startTimeMilli = Trace.Helpers.Timing.microToMilli(entry.ts);
                results.push({ startTimeMilli, index: i, provider: 'network' });
            }
        }
        return results;
    }
    /**
     * Returns a map of navigations that happened in the main frame, ignoring any
     * that happened in other frames.
     * The map's key is the frame ID.
     **/
    mainFrameNavigationStartEvents() {
        if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f")) {
            return [];
        }
        return __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f").Meta.mainFrameNavigations;
    }
    buildFlowForInitiator(entryIndex) {
        if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f")) {
            return false;
        }
        if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f")) {
            return false;
        }
        if (entryIndex > -1 && __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_lastInitiatorEntry, "f") === entryIndex) {
            if (__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_lastInitiatorsData, "f")) {
                __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f").initiatorsData = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_lastInitiatorsData, "f");
            }
            return true;
        }
        if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f")) {
            return false;
        }
        // Remove all previously assigned decorations indicating that the flow event entries are hidden
        const previousInitiatorsDataLength = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f").initiatorsData.length;
        // |entryIndex| equals -1 means there is no entry selected, just clear the
        // initiator cache if there is any previous arrow and return true to
        // re-render.
        if (entryIndex === -1) {
            __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_lastInitiatorEntry, entryIndex, "f");
            if (previousInitiatorsDataLength === 0) {
                // This means there is no arrow before, so we don't need to re-render.
                return false;
            }
            // Reset to clear any previous arrows from the last event.
            __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f").emptyInitiators();
            return true;
        }
        const event = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f")[entryIndex];
        // Reset to clear any previous arrows from the last event.
        __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f").emptyInitiators();
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_lastInitiatorEntry, entryIndex, "f");
        const initiatorsData = initiatorsDataToDrawForNetwork(__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_parsedTrace, "f"), event);
        // This means there is no change for arrows.
        if (previousInitiatorsDataLength === 0 && initiatorsData.length === 0) {
            return false;
        }
        for (const initiatorData of initiatorsData) {
            const eventIndex = this.indexForEvent(initiatorData.event);
            const initiatorIndex = this.indexForEvent(initiatorData.initiator);
            if (eventIndex === null || initiatorIndex === null) {
                continue;
            }
            __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f").initiatorsData.push({
                initiatorIndex,
                eventIndex,
            });
        }
        __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_lastInitiatorsData, __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f").initiatorsData, "f");
        return true;
    }
}
_TimelineFlameChartNetworkDataProvider_minimumBoundary = new WeakMap(), _TimelineFlameChartNetworkDataProvider_timeSpan = new WeakMap(), _TimelineFlameChartNetworkDataProvider_events = new WeakMap(), _TimelineFlameChartNetworkDataProvider_maxLevel = new WeakMap(), _TimelineFlameChartNetworkDataProvider_networkTrackAppender = new WeakMap(), _TimelineFlameChartNetworkDataProvider_timelineDataInternal = new WeakMap(), _TimelineFlameChartNetworkDataProvider_lastSelection = new WeakMap(), _TimelineFlameChartNetworkDataProvider_parsedTrace = new WeakMap(), _TimelineFlameChartNetworkDataProvider_eventIndexByEvent = new WeakMap(), _TimelineFlameChartNetworkDataProvider_lastInitiatorEntry = new WeakMap(), _TimelineFlameChartNetworkDataProvider_lastInitiatorsData = new WeakMap(), _TimelineFlameChartNetworkDataProvider_entityMapper = new WeakMap(), _TimelineFlameChartNetworkDataProvider_persistedGroupConfigSetting = new WeakMap(), _TimelineFlameChartNetworkDataProvider_instances = new WeakSet(), _TimelineFlameChartNetworkDataProvider_decorateNetworkRequest = function _TimelineFlameChartNetworkDataProvider_decorateNetworkRequest(index, context, _text, barX, barY, barWidth, barHeight, unclippedBarX, timeToPixelRatio) {
    const event = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f")[index];
    if (!Trace.Types.Events.isSyntheticNetworkRequest(event)) {
        return false;
    }
    const { sendStart, headersEnd, finish, start, end } = this.getDecorationPixels(event, unclippedBarX, timeToPixelRatio);
    // Draw waiting time.
    context.fillStyle = 'hsla(0, 100%, 100%, 0.8)';
    context.fillRect(sendStart + 0.5, barY + 0.5, headersEnd - sendStart - 0.5, barHeight - 2);
    // Clear portions of initial rect to prepare for the ticks.
    context.fillStyle = ThemeSupport.ThemeSupport.instance().getComputedValue('--sys-color-cdt-base-container');
    context.fillRect(barX, barY - 0.5, sendStart - barX, barHeight);
    context.fillRect(finish, barY - 0.5, barX + barWidth - finish, barHeight);
    // Draws left and right whiskers
    function drawTick(begin, end, y) {
        const /** @const */ tickHeightPx = 6;
        context.moveTo(begin, y - tickHeightPx / 2);
        context.lineTo(begin, y + tickHeightPx / 2);
        context.moveTo(begin, y);
        context.lineTo(end, y);
    }
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = '#ccc';
    const lineY = Math.floor(barY + barHeight / 2) + 0.5;
    const leftTick = start + 0.5;
    const rightTick = end - 0.5;
    drawTick(leftTick, sendStart, lineY);
    drawTick(rightTick, finish, lineY);
    context.stroke();
    // Draw request URL as text
    const textStart = Math.max(sendStart, 0);
    const textWidth = finish - textStart;
    const /** @const */ minTextWidthPx = 20;
    if (textWidth >= minTextWidthPx) {
        let title = this.entryTitle(index) || '';
        if (event.args.data.fromServiceWorker) {
            title = '⚙ ' + title;
        }
        if (title) {
            const /** @const */ textPadding = 4;
            const /** @const */ textBaseline = 5;
            const textBaseHeight = barHeight - textBaseline;
            const trimmedText = UI.UIUtils.trimTextEnd(context, title, textWidth - 2 * textPadding);
            context.fillStyle = '#333';
            context.fillText(trimmedText, textStart + textPadding, barY + textBaseHeight);
        }
    }
    return true;
}, _TimelineFlameChartNetworkDataProvider_decorateSyntheticWebSocketConnection = function _TimelineFlameChartNetworkDataProvider_decorateSyntheticWebSocketConnection(index, context, barY, barHeight, unclippedBarX, timeToPixelRatio) {
    context.save();
    const event = __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f")[index];
    const beginTime = Trace.Helpers.Timing.microToMilli(event.ts);
    const timeToPixel = (time) => Math.floor(unclippedBarX + (time - beginTime) * timeToPixelRatio);
    const endTime = Trace.Helpers.Timing.microToMilli((event.ts + event.dur));
    const start = timeToPixel(beginTime) + 0.5;
    const end = timeToPixel(endTime) - 0.5;
    context.strokeStyle = ThemeSupport.ThemeSupport.instance().getComputedValue('--app-color-rendering');
    const lineY = Math.floor(barY + barHeight / 2) + 0.5;
    context.setLineDash([3, 2]);
    context.moveTo(start, lineY - 1);
    context.lineTo(end, lineY - 1);
    context.moveTo(start, lineY + 1);
    context.lineTo(end, lineY + 1);
    context.stroke();
    context.restore();
    return true;
}, _TimelineFlameChartNetworkDataProvider_setTimingBoundsData = function _TimelineFlameChartNetworkDataProvider_setTimingBoundsData(newParsedTrace) {
    const { traceBounds } = newParsedTrace.Meta;
    const minTime = Trace.Helpers.Timing.microToMilli(traceBounds.min);
    const maxTime = Trace.Helpers.Timing.microToMilli(traceBounds.max);
    __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_minimumBoundary, minTime, "f");
    __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_timeSpan, minTime === maxTime ? 1000 : maxTime - __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_minimumBoundary, "f"), "f");
}, _TimelineFlameChartNetworkDataProvider_updateTimelineData = function _TimelineFlameChartNetworkDataProvider_updateTimelineData(startTime, endTime) {
    if (!__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f") || !__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f")) {
        return;
    }
    __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_maxLevel, __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_networkTrackAppender, "f").relayoutEntriesWithinBounds(__classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_events, "f"), startTime, endTime), "f");
    // TODO(crbug.com/1459225): Remove this recreating code.
    // Force to create a new PerfUI.FlameChart.FlameChartTimelineData instance
    // to force the flamechart to re-render. This also causes crbug.com/1459225.
    __classPrivateFieldSet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, PerfUI.FlameChart.FlameChartTimelineData.create({
        entryLevels: __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f")?.entryLevels,
        entryTotalTimes: __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f")?.entryTotalTimes,
        entryStartTimes: __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f")?.entryStartTimes,
        groups: __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f")?.groups,
        initiatorsData: __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f").initiatorsData,
        entryDecorations: __classPrivateFieldGet(this, _TimelineFlameChartNetworkDataProvider_timelineDataInternal, "f").entryDecorations,
    }), "f");
};
//# sourceMappingURL=TimelineFlameChartNetworkDataProvider.js.map