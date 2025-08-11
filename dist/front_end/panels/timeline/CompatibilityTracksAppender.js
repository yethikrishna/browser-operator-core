// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _CompatibilityTracksAppender_instances, _CompatibilityTracksAppender_trackForLevel, _CompatibilityTracksAppender_trackForGroup, _CompatibilityTracksAppender_eventsForTrack, _CompatibilityTracksAppender_trackEventsForTreeview, _CompatibilityTracksAppender_flameChartData, _CompatibilityTracksAppender_parsedTrace, _CompatibilityTracksAppender_entryData, _CompatibilityTracksAppender_colorGenerator, _CompatibilityTracksAppender_allTrackAppenders, _CompatibilityTracksAppender_visibleTrackNames, _CompatibilityTracksAppender_legacyEntryTypeByLevel, _CompatibilityTracksAppender_timingsTrackAppender, _CompatibilityTracksAppender_animationsTrackAppender, _CompatibilityTracksAppender_interactionsTrackAppender, _CompatibilityTracksAppender_gpuTrackAppender, _CompatibilityTracksAppender_layoutShiftsTrackAppender, _CompatibilityTracksAppender_threadAppenders, _CompatibilityTracksAppender_entityMapper, _CompatibilityTracksAppender_addExtensionAppenders, _CompatibilityTracksAppender_addThreadAppenders;
import * as Common from '../../core/common/common.js';
import * as Platform from '../../core/platform/platform.js';
import * as Root from '../../core/root/root.js';
import * as Trace from '../../models/trace/trace.js';
import * as ThemeSupport from '../../ui/legacy/theme_support/theme_support.js';
import { AnimationsTrackAppender } from './AnimationsTrackAppender.js';
import { getDurationString, getEventLevel } from './AppenderUtils.js';
import * as TimelineComponents from './components/components.js';
import { ExtensionTrackAppender } from './ExtensionTrackAppender.js';
import { GPUTrackAppender } from './GPUTrackAppender.js';
import { InteractionsTrackAppender } from './InteractionsTrackAppender.js';
import { LayoutShiftsTrackAppender } from './LayoutShiftsTrackAppender.js';
import { ThreadAppender } from './ThreadAppender.js';
import { InstantEventVisibleDurationMs, } from './TimelineFlameChartDataProvider.js';
import { TimelinePanel } from './TimelinePanel.js';
import { TimingsTrackAppender } from './TimingsTrackAppender.js';
import * as TimelineUtils from './utils/utils.js';
let showPostMessageEvents;
function isShowPostMessageEventsEnabled() {
    // Everytime the experiment is toggled devtools is reloaded so the
    // cache is updated automatically.
    if (showPostMessageEvents === undefined) {
        showPostMessageEvents =
            Root.Runtime.experiments.isEnabled("timeline-show-postmessage-events" /* Root.Runtime.ExperimentName.TIMELINE_SHOW_POST_MESSAGE_EVENTS */);
    }
    return showPostMessageEvents;
}
export function entryIsVisibleInTimeline(entry, parsedTrace) {
    if (parsedTrace?.Meta.traceIsGeneric) {
        return true;
    }
    if (Trace.Types.Events.isUpdateCounters(entry)) {
        // These events are not "visible" on the timeline because they are instant events with 0 duration.
        // However, the Memory view (CountersGraph in the codebase) relies on
        // finding the UpdateCounters events within the user's active trace
        // selection in order to show the memory usage for the selected time
        // period.
        // Therefore we mark them as visible so they are appended onto the Thread
        // track, and hence accessible by the CountersGraph view.
        return true;
    }
    if (isShowPostMessageEventsEnabled()) {
        if (Trace.Types.Events.isSchedulePostMessage(entry) || Trace.Types.Events.isHandlePostMessage(entry)) {
            return true;
        }
    }
    if (Trace.Types.Extensions.isSyntheticExtensionEntry(entry)) {
        return true;
    }
    // Default styles are globally defined for each event name. Some
    // events are hidden by default.
    const eventStyle = TimelineUtils.EntryStyles.getEventStyle(entry.name);
    const eventIsTiming = Trace.Types.Events.isConsoleTime(entry) || Trace.Types.Events.isPerformanceMeasure(entry) ||
        Trace.Types.Events.isPerformanceMark(entry) || Trace.Types.Events.isConsoleTimeStamp(entry);
    return (eventStyle && !eventStyle.hidden) || eventIsTiming;
}
export const TrackNames = [
    'Animations',
    'Timings',
    'Interactions',
    'GPU',
    'LayoutShifts',
    'Thread',
    'Thread_AuctionWorklet',
    'Extension',
    'ServerTimings',
];
/**
 * Used as the context when a track (aka group) is selected and we log
 * something to the VE Logging framework.
 * This enum broadly corresponds with the list of TrackNames, but can be more
 * specific in some situations such as when we want to identify the thread type
 * rather than log "thread" - it is useful to know if the thread is the main
 * thread or not.
 * VE context needs to be kebab-case, and not contain any PII, which is why we
 * log this set list rather than full track names, which in the case of threads
 * can contain URLswhich we do not want to log.
 */
export var VisualLoggingTrackName;
(function (VisualLoggingTrackName) {
    VisualLoggingTrackName["ANIMATIONS"] = "animations";
    VisualLoggingTrackName["TIMINGS"] = "timings";
    VisualLoggingTrackName["INTERACTIONS"] = "interactions";
    VisualLoggingTrackName["GPU"] = "gpu";
    VisualLoggingTrackName["LAYOUT_SHIFTS"] = "layout-shifts";
    VisualLoggingTrackName["SERVER_TIMINGS"] = "server.timings";
    VisualLoggingTrackName["THREAD_CPU_PROFILE"] = "thread.cpu-profile";
    VisualLoggingTrackName["THREAD_MAIN"] = "thread.main";
    VisualLoggingTrackName["THREAD_FRAME"] = "thread.frame";
    VisualLoggingTrackName["THREAD_WORKER"] = "thread.worker";
    VisualLoggingTrackName["THREAD_AUCTION_WORKLET"] = "thread.auction-worklet";
    VisualLoggingTrackName["THREAD_RASTERIZER"] = "thread.rasterizer";
    VisualLoggingTrackName["THREAD_POOL"] = "thread.pool";
    VisualLoggingTrackName["THREAD_OTHER"] = "thread.other";
    VisualLoggingTrackName["EXTENSION"] = "extension";
    VisualLoggingTrackName["ANGULAR_TRACK"] = "angular-track";
    VisualLoggingTrackName["NETWORK"] = "network";
})(VisualLoggingTrackName || (VisualLoggingTrackName = {}));
export class CompatibilityTracksAppender {
    /**
     * @param flameChartData the data used by the flame chart renderer on
     * which the track data will be appended.
     * @param parsedTrace the trace parsing engines output.
     * @param entryData the array containing all event to be rendered in
     * the flamechart.
     * @param legacyEntryTypeByLevel an array containing the type of
     * each entry in the entryData array. Indexed by the position the
     * corresponding entry occupies in the entryData array. This reference
     * is needed only for compatibility with the legacy flamechart
     * architecture and should be removed once all tracks use the new
     * system.
     * @param entityMapper 3P entity data for the trace.
     */
    constructor(flameChartData, parsedTrace, entryData, legacyEntryTypeByLevel, entityMapper) {
        _CompatibilityTracksAppender_instances.add(this);
        _CompatibilityTracksAppender_trackForLevel.set(this, new Map());
        _CompatibilityTracksAppender_trackForGroup.set(this, new Map());
        _CompatibilityTracksAppender_eventsForTrack.set(this, new Map());
        _CompatibilityTracksAppender_trackEventsForTreeview.set(this, new Map());
        _CompatibilityTracksAppender_flameChartData.set(this, void 0);
        _CompatibilityTracksAppender_parsedTrace.set(this, void 0);
        _CompatibilityTracksAppender_entryData.set(this, void 0);
        _CompatibilityTracksAppender_colorGenerator.set(this, void 0);
        _CompatibilityTracksAppender_allTrackAppenders.set(this, []);
        _CompatibilityTracksAppender_visibleTrackNames.set(this, new Set([...TrackNames]));
        _CompatibilityTracksAppender_legacyEntryTypeByLevel.set(this, void 0);
        _CompatibilityTracksAppender_timingsTrackAppender.set(this, void 0);
        _CompatibilityTracksAppender_animationsTrackAppender.set(this, void 0);
        _CompatibilityTracksAppender_interactionsTrackAppender.set(this, void 0);
        _CompatibilityTracksAppender_gpuTrackAppender.set(this, void 0);
        _CompatibilityTracksAppender_layoutShiftsTrackAppender.set(this, void 0);
        _CompatibilityTracksAppender_threadAppenders.set(this, []);
        _CompatibilityTracksAppender_entityMapper.set(this, void 0);
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_flameChartData, flameChartData, "f");
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_parsedTrace, parsedTrace, "f");
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_entityMapper, entityMapper, "f");
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_entryData, entryData, "f");
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_colorGenerator, new Common.Color.Generator(
        /* hueSpace= */ { min: 30, max: 55, count: undefined }, 
        /* satSpace= */ { min: 70, max: 100, count: 6 }, 
        /* lightnessSpace= */ 50, 
        /* alphaSpace= */ 0.7), "f");
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_legacyEntryTypeByLevel, legacyEntryTypeByLevel, "f");
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_timingsTrackAppender, new TimingsTrackAppender(this, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f"), __classPrivateFieldGet(this, _CompatibilityTracksAppender_colorGenerator, "f")), "f");
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_allTrackAppenders, "f").push(__classPrivateFieldGet(this, _CompatibilityTracksAppender_timingsTrackAppender, "f"));
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_interactionsTrackAppender, new InteractionsTrackAppender(this, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f"), __classPrivateFieldGet(this, _CompatibilityTracksAppender_colorGenerator, "f")), "f");
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_allTrackAppenders, "f").push(__classPrivateFieldGet(this, _CompatibilityTracksAppender_interactionsTrackAppender, "f"));
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_animationsTrackAppender, new AnimationsTrackAppender(this, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f")), "f");
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_allTrackAppenders, "f").push(__classPrivateFieldGet(this, _CompatibilityTracksAppender_animationsTrackAppender, "f"));
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_gpuTrackAppender, new GPUTrackAppender(this, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f")), "f");
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_allTrackAppenders, "f").push(__classPrivateFieldGet(this, _CompatibilityTracksAppender_gpuTrackAppender, "f"));
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_layoutShiftsTrackAppender, new LayoutShiftsTrackAppender(this, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f")), "f");
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_allTrackAppenders, "f").push(__classPrivateFieldGet(this, _CompatibilityTracksAppender_layoutShiftsTrackAppender, "f"));
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_instances, "m", _CompatibilityTracksAppender_addThreadAppenders).call(this);
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_instances, "m", _CompatibilityTracksAppender_addExtensionAppenders).call(this);
        this.onThemeChange = this.onThemeChange.bind(this);
        ThemeSupport.ThemeSupport.instance().addEventListener(ThemeSupport.ThemeChangeEvent.eventName, this.onThemeChange);
    }
    reset() {
        ThemeSupport.ThemeSupport.instance().removeEventListener(ThemeSupport.ThemeChangeEvent.eventName, this.onThemeChange);
    }
    setFlameChartDataAndEntryData(flameChartData, entryData, legacyEntryTypeByLevel) {
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForGroup, "f").clear();
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_flameChartData, flameChartData, "f");
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_entryData, entryData, "f");
        __classPrivateFieldSet(this, _CompatibilityTracksAppender_legacyEntryTypeByLevel, legacyEntryTypeByLevel, "f");
    }
    getFlameChartTimelineData() {
        return __classPrivateFieldGet(this, _CompatibilityTracksAppender_flameChartData, "f");
    }
    onThemeChange() {
        for (const group of __classPrivateFieldGet(this, _CompatibilityTracksAppender_flameChartData, "f").groups) {
            // We only need to update the color here, because FlameChart will call `scheduleUpdate()` when theme is changed.
            group.style.color = ThemeSupport.ThemeSupport.instance().getComputedValue('--sys-color-on-surface');
            group.style.backgroundColor =
                ThemeSupport.ThemeSupport.instance().getComputedValue('--sys-color-cdt-base-container');
        }
    }
    timingsTrackAppender() {
        return __classPrivateFieldGet(this, _CompatibilityTracksAppender_timingsTrackAppender, "f");
    }
    animationsTrackAppender() {
        return __classPrivateFieldGet(this, _CompatibilityTracksAppender_animationsTrackAppender, "f");
    }
    interactionsTrackAppender() {
        return __classPrivateFieldGet(this, _CompatibilityTracksAppender_interactionsTrackAppender, "f");
    }
    gpuTrackAppender() {
        return __classPrivateFieldGet(this, _CompatibilityTracksAppender_gpuTrackAppender, "f");
    }
    layoutShiftsTrackAppender() {
        return __classPrivateFieldGet(this, _CompatibilityTracksAppender_layoutShiftsTrackAppender, "f");
    }
    threadAppenders() {
        return __classPrivateFieldGet(this, _CompatibilityTracksAppender_threadAppenders, "f");
    }
    eventsInTrack(trackAppender) {
        const cachedData = __classPrivateFieldGet(this, _CompatibilityTracksAppender_eventsForTrack, "f").get(trackAppender);
        if (cachedData) {
            return cachedData;
        }
        // Calculate the levels occupied by a track.
        let trackStartLevel = null;
        let trackEndLevel = null;
        for (const [level, track] of __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForLevel, "f")) {
            if (track !== trackAppender) {
                continue;
            }
            if (trackStartLevel === null) {
                trackStartLevel = level;
            }
            trackEndLevel = level;
        }
        if (trackStartLevel === null || trackEndLevel === null) {
            throw new Error(`Could not find events for track: ${trackAppender}`);
        }
        const entryLevels = __classPrivateFieldGet(this, _CompatibilityTracksAppender_flameChartData, "f").entryLevels;
        const events = [];
        for (let i = 0; i < entryLevels.length; i++) {
            if (trackStartLevel <= entryLevels[i] && entryLevels[i] <= trackEndLevel) {
                events.push(__classPrivateFieldGet(this, _CompatibilityTracksAppender_entryData, "f")[i]);
            }
        }
        events.sort((a, b) => a.ts - b.ts); // TODO(paulirish): Remove as I'm 90% it's already sorted.
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_eventsForTrack, "f").set(trackAppender, events);
        return events;
    }
    /**
     * Gets the events to be shown in the tree views of the details pane
     * (Bottom-up, Call tree, etc.). These are the events from the track
     * that can be arranged in a tree shape.
     */
    eventsForTreeView(trackAppender) {
        const cachedData = __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackEventsForTreeview, "f").get(trackAppender);
        if (cachedData) {
            return cachedData;
        }
        let trackEvents = this.eventsInTrack(trackAppender);
        if (!Trace.Helpers.TreeHelpers.canBuildTreesFromEvents(trackEvents)) {
            // Some tracks can include both async and sync events. When this
            // happens, we use all events for the tree views if a trees can be
            // built from both sync and async events. If this is not possible,
            // async events are filtered out and only sync events are used
            // (it's assumed a tree can always be built using a tracks sync
            // events).
            trackEvents = trackEvents.filter(e => !Trace.Types.Events.isPhaseAsync(e.ph));
        }
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackEventsForTreeview, "f").set(trackAppender, trackEvents);
        return trackEvents;
    }
    /**
     * Caches the track appender that owns a flame chart group. FlameChart
     * groups are created for each track in the timeline. When an user
     * selects a track in the UI, the track's group is passed to the model
     * layer to inform about the selection.
     */
    registerTrackForGroup(group, appender) {
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_flameChartData, "f").groups.push(group);
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForGroup, "f").set(group, appender);
    }
    /**
     * Returns number of tracks of given type already appended.
     * Used to name the "Raster Thread 6" tracks, etc
     */
    getCurrentTrackCountForThreadType(threadType) {
        return __classPrivateFieldGet(this, _CompatibilityTracksAppender_threadAppenders, "f").filter(appender => appender.threadType === threadType && appender.headerAppended())
            .length;
    }
    /**
     * Looks up a FlameChart group for a given appender.
     */
    groupForAppender(targetAppender) {
        let foundGroup = null;
        for (const [group, appender] of __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForGroup, "f")) {
            if (appender === targetAppender) {
                foundGroup = group;
                break;
            }
        }
        return foundGroup;
    }
    /**
     * Given a FlameChart group, gets the events to be shown in the tree
     * views if that group was registered by the appender system.
     */
    groupEventsForTreeView(group) {
        const track = __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForGroup, "f").get(group);
        if (!track) {
            return null;
        }
        return this.eventsForTreeView(track);
    }
    groupForLevel(level) {
        const appenderForLevel = __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForLevel, "f").get(level);
        if (!appenderForLevel) {
            return null;
        }
        return this.groupForAppender(appenderForLevel);
    }
    /**
     * Adds an event to the flame chart data at a defined level.
     * @param event the event to be appended,
     * @param level the level to append the event,
     * @param appender the track which the event belongs to.
     * @returns the index of the event in all events to be rendered in the flamechart.
     */
    appendEventAtLevel(event, level, appender) {
        // TODO(crbug.com/1442454) Figure out how to avoid the circular calls.
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForLevel, "f").set(level, appender);
        const index = __classPrivateFieldGet(this, _CompatibilityTracksAppender_entryData, "f").length;
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_entryData, "f").push(event);
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_legacyEntryTypeByLevel, "f")[level] = "TrackAppender" /* EntryType.TRACK_APPENDER */;
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_flameChartData, "f").entryLevels[index] = level;
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_flameChartData, "f").entryStartTimes[index] = Trace.Helpers.Timing.microToMilli(event.ts);
        const dur = event.dur || Trace.Helpers.Timing.milliToMicro(InstantEventVisibleDurationMs);
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_flameChartData, "f").entryTotalTimes[index] = Trace.Helpers.Timing.microToMilli(dur);
        return index;
    }
    /**
     * Adds into the flame chart data a list of trace events.
     * @param events the trace events that will be appended to the flame chart.
     * The events should be taken straight from the trace handlers. The handlers
     * should sort the events by start time, and the parent event is before the
     * child.
     * @param trackStartLevel the flame chart level from which the events will
     * be appended.
     * @param appender the track that the trace events belong to.
     * @param eventAppendedCallback an optional function called after the
     * event has been added to the timeline data. This allows the caller
     * to know f.e. the position of the event in the entry data. Use this
     * hook to customize the data after it has been appended, f.e. to add
     * decorations to a set of the entries.
     * @returns the next level after the last occupied by the appended these
     * trace events (the first available level to append next track).
     */
    appendEventsAtLevel(events, trackStartLevel, appender, eventAppendedCallback) {
        const lastTimestampByLevel = [];
        for (let i = 0; i < events.length; ++i) {
            const event = events[i];
            if (!entryIsVisibleInTimeline(event, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f"))) {
                continue;
            }
            const level = getEventLevel(event, lastTimestampByLevel);
            const index = this.appendEventAtLevel(event, trackStartLevel + level, appender);
            eventAppendedCallback?.(event, index);
        }
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_legacyEntryTypeByLevel, "f").length = trackStartLevel + lastTimestampByLevel.length;
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_legacyEntryTypeByLevel, "f").fill("TrackAppender" /* EntryType.TRACK_APPENDER */, trackStartLevel);
        return trackStartLevel + lastTimestampByLevel.length;
    }
    /**
     * Gets the all track appenders that have been set to be visible.
     */
    allVisibleTrackAppenders() {
        return __classPrivateFieldGet(this, _CompatibilityTracksAppender_allTrackAppenders, "f").filter(track => __classPrivateFieldGet(this, _CompatibilityTracksAppender_visibleTrackNames, "f").has(track.appenderName));
    }
    allThreadAppendersByProcess() {
        const appenders = this.allVisibleTrackAppenders();
        const result = new Map();
        for (const appender of appenders) {
            if (!(appender instanceof ThreadAppender)) {
                continue;
            }
            const existing = result.get(appender.processId()) ?? [];
            existing.push(appender);
            result.set(appender.processId(), existing);
        }
        return result;
    }
    getDrawOverride(event, level) {
        const track = __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForLevel, "f").get(level);
        if (!track) {
            throw new Error('Track not found for level');
        }
        return track.getDrawOverride?.(event);
    }
    /**
     * Returns the color an event is shown with in the timeline.
     */
    colorForEvent(event, level) {
        const track = __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForLevel, "f").get(level);
        if (!track) {
            throw new Error('Track not found for level');
        }
        return track.colorForEvent(event);
    }
    /**
     * Returns the title an event is shown with in the timeline.
     */
    titleForEvent(event, level) {
        const track = __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForLevel, "f").get(level);
        if (!track) {
            throw new Error('Track not found for level');
        }
        // Historically all tracks would have a titleForEvent() method. However a
        // lot of these were duplicated so we worked on removing them in favour of
        // the EntryName.nameForEntry method called below (see crbug.com/365047728).
        // However, sometimes an appender needs to customise the titles slightly;
        // for example the LayoutShiftsTrackAppender does not show any titles as we
        // use diamonds to represent layout shifts.
        // So whilst we expect most appenders to not define this method, we do
        // allow appenders to override it.
        if (track.titleForEvent) {
            return track.titleForEvent(event);
        }
        return TimelineUtils.EntryName.nameForEntry(event, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f"));
    }
    /**
     * Returns the info shown when an event in the timeline is hovered.
     */
    popoverInfo(event, level) {
        const track = __classPrivateFieldGet(this, _CompatibilityTracksAppender_trackForLevel, "f").get(level);
        if (!track) {
            throw new Error('Track not found for level');
        }
        // Defaults here, though tracks may chose to redefine title/formattedTime
        const info = {
            title: this.titleForEvent(event, level),
            formattedTime: getDurationString(event.dur),
            warningElements: TimelineComponents.DetailsView.buildWarningElementsForEvent(event, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f")),
            additionalElements: [],
            url: null,
        };
        // If the track defines its own popoverInfo(), it'll update values within
        if (track.setPopoverInfo) {
            track.setPopoverInfo(event, info);
        }
        // If there's a url associated, add into additionalElements
        const url = URL.parse(info.url ?? TimelineUtils.SourceMapsResolver.SourceMapsResolver.resolvedURLForEntry(__classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f"), event) ??
            '');
        if (url) {
            const MAX_PATH_LENGTH = 45;
            const path = Platform.StringUtilities.trimMiddle(url.href.replace(url.origin, ''), MAX_PATH_LENGTH);
            const urlElems = document.createElement('div');
            urlElems.createChild('span', 'popoverinfo-url-path').textContent = path;
            const entity = __classPrivateFieldGet(this, _CompatibilityTracksAppender_entityMapper, "f") ? __classPrivateFieldGet(this, _CompatibilityTracksAppender_entityMapper, "f").entityForEvent(event) : null;
            // Include entity with origin if it's non made-up entity, otherwise there'd be
            // repetition with the origin.
            const originWithEntity = TimelineUtils.Helpers.formatOriginWithEntity(url, entity);
            urlElems.createChild('span', 'popoverinfo-url-origin').textContent = `(${originWithEntity})`;
            info.additionalElements.push(urlElems);
        }
        return info;
    }
}
_CompatibilityTracksAppender_trackForLevel = new WeakMap(), _CompatibilityTracksAppender_trackForGroup = new WeakMap(), _CompatibilityTracksAppender_eventsForTrack = new WeakMap(), _CompatibilityTracksAppender_trackEventsForTreeview = new WeakMap(), _CompatibilityTracksAppender_flameChartData = new WeakMap(), _CompatibilityTracksAppender_parsedTrace = new WeakMap(), _CompatibilityTracksAppender_entryData = new WeakMap(), _CompatibilityTracksAppender_colorGenerator = new WeakMap(), _CompatibilityTracksAppender_allTrackAppenders = new WeakMap(), _CompatibilityTracksAppender_visibleTrackNames = new WeakMap(), _CompatibilityTracksAppender_legacyEntryTypeByLevel = new WeakMap(), _CompatibilityTracksAppender_timingsTrackAppender = new WeakMap(), _CompatibilityTracksAppender_animationsTrackAppender = new WeakMap(), _CompatibilityTracksAppender_interactionsTrackAppender = new WeakMap(), _CompatibilityTracksAppender_gpuTrackAppender = new WeakMap(), _CompatibilityTracksAppender_layoutShiftsTrackAppender = new WeakMap(), _CompatibilityTracksAppender_threadAppenders = new WeakMap(), _CompatibilityTracksAppender_entityMapper = new WeakMap(), _CompatibilityTracksAppender_instances = new WeakSet(), _CompatibilityTracksAppender_addExtensionAppenders = function _CompatibilityTracksAppender_addExtensionAppenders() {
    if (!TimelinePanel.extensionDataVisibilitySetting().get()) {
        return;
    }
    const tracks = __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f").ExtensionTraceData.extensionTrackData;
    for (const trackData of tracks) {
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_allTrackAppenders, "f").push(new ExtensionTrackAppender(this, trackData));
    }
}, _CompatibilityTracksAppender_addThreadAppenders = function _CompatibilityTracksAppender_addThreadAppenders() {
    const threadTrackOrder = (appender) => {
        switch (appender.threadType) {
            case "MAIN_THREAD" /* Trace.Handlers.Threads.ThreadType.MAIN_THREAD */: {
                if (appender.isOnMainFrame) {
                    // Ensure `about:blank` or `chrome://new-tab-page` are deprioritized, as they're likely not the profiling targets
                    const url = appender.getUrl();
                    if (url.startsWith('about:') || url.startsWith('chrome:')) {
                        return 2;
                    }
                    return 0;
                }
                return 1;
            }
            case "WORKER" /* Trace.Handlers.Threads.ThreadType.WORKER */:
                return 3;
            case "AUCTION_WORKLET" /* Trace.Handlers.Threads.ThreadType.AUCTION_WORKLET */:
                return 3;
            case "RASTERIZER" /* Trace.Handlers.Threads.ThreadType.RASTERIZER */:
                return 4;
            case "THREAD_POOL" /* Trace.Handlers.Threads.ThreadType.THREAD_POOL */:
                return 5;
            case "OTHER" /* Trace.Handlers.Threads.ThreadType.OTHER */:
                return 7;
            default:
                return 8;
        }
    };
    const threads = Trace.Handlers.Threads.threadsInTrace(__classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f"));
    const showAllEvents = Root.Runtime.experiments.isEnabled('timeline-show-all-events');
    for (const { pid, tid, name, type, entries, tree } of threads) {
        if (__classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f").Meta.traceIsGeneric) {
            // If the trace is generic, we just push all of the threads with no effort to differentiate them, hence
            // overriding the thread type to be OTHER for all threads.
            __classPrivateFieldGet(this, _CompatibilityTracksAppender_threadAppenders, "f").push(new ThreadAppender(this, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f"), pid, tid, name, "OTHER" /* Trace.Handlers.Threads.ThreadType.OTHER */, entries, tree));
            continue;
        }
        // These threads have no useful information. Omit them
        if ((name === 'Chrome_ChildIOThread' || name === 'Compositor' || name === 'GpuMemoryThread') && !showAllEvents) {
            continue;
        }
        const matchingWorklet = __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f").AuctionWorklets.worklets.get(pid);
        if (matchingWorklet) {
            // Each AuctionWorklet has two key threads:
            // 1. the Utility Thread
            // 2. the V8 Helper Thread - either a bidder or seller. see buildNameForAuctionWorklet()
            // There are other threads in a worklet process, but we don't render them.
            const tids = [matchingWorklet.args.data.utilityThread.tid, matchingWorklet.args.data.v8HelperThread.tid];
            if (tids.includes(tid)) {
                __classPrivateFieldGet(this, _CompatibilityTracksAppender_threadAppenders, "f").push(new ThreadAppender(this, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f"), pid, tid, '', "AUCTION_WORKLET" /* Trace.Handlers.Threads.ThreadType.AUCTION_WORKLET */, entries, tree));
            }
            continue;
        }
        // The Common case… Add the main thread, or iframe, or thread pool, etc.
        __classPrivateFieldGet(this, _CompatibilityTracksAppender_threadAppenders, "f").push(new ThreadAppender(this, __classPrivateFieldGet(this, _CompatibilityTracksAppender_parsedTrace, "f"), pid, tid, name, type, entries, tree));
    }
    // Sort first by track order, then break ties by placing busier tracks first.
    __classPrivateFieldGet(this, _CompatibilityTracksAppender_threadAppenders, "f").sort((a, b) => (threadTrackOrder(a) - threadTrackOrder(b)) || (b.getEntries().length - a.getEntries().length));
    __classPrivateFieldGet(this, _CompatibilityTracksAppender_allTrackAppenders, "f").push(...__classPrivateFieldGet(this, _CompatibilityTracksAppender_threadAppenders, "f"));
};
//# sourceMappingURL=CompatibilityTracksAppender.js.map