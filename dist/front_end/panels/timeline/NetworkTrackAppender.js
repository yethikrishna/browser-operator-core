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
var _NetworkTrackAppender_instances, _NetworkTrackAppender_flameChartData, _NetworkTrackAppender_events, _NetworkTrackAppender_font, _NetworkTrackAppender_group, _NetworkTrackAppender_appendTrackHeaderAtLevel, _NetworkTrackAppender_appendEventsAtLevel, _NetworkTrackAppender_appendEventAtLevel;
// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../../core/i18n/i18n.js';
import * as Trace from '../../models/trace/trace.js';
import * as PerfUI from '../../ui/legacy/components/perf_ui/perf_ui.js';
import * as ThemeSupport from '../../ui/legacy/theme_support/theme_support.js';
import { addDecorationToEvent, buildGroupStyle, buildTrackHeader, getEventLevel, } from './AppenderUtils.js';
import * as Components from './components/components.js';
import { InstantEventVisibleDurationMs } from './TimelineFlameChartDataProvider.js';
const UIStrings = {
    /**
     *@description Text in Timeline Flame Chart Data Provider of the Performance panel
     */
    network: 'Network',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/NetworkTrackAppender.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class NetworkTrackAppender {
    constructor(flameChartData, events) {
        _NetworkTrackAppender_instances.add(this);
        this.appenderName = 'Network';
        _NetworkTrackAppender_flameChartData.set(this, void 0);
        this.webSocketIdToLevel = new Map();
        _NetworkTrackAppender_events.set(this, []);
        _NetworkTrackAppender_font.set(this, void 0);
        _NetworkTrackAppender_group.set(this, void 0);
        __classPrivateFieldSet(this, _NetworkTrackAppender_flameChartData, flameChartData, "f");
        __classPrivateFieldSet(this, _NetworkTrackAppender_events, events, "f");
        __classPrivateFieldSet(this, _NetworkTrackAppender_font, `${PerfUI.Font.DEFAULT_FONT_SIZE} ${PerfUI.Font.getFontFamilyForCanvas()}`, "f");
        ThemeSupport.ThemeSupport.instance().addEventListener(ThemeSupport.ThemeChangeEvent.eventName, () => {
            if (__classPrivateFieldGet(this, _NetworkTrackAppender_group, "f")) {
                // We only need to update the color here, because FlameChart will call `scheduleUpdate()` when theme is changed.
                __classPrivateFieldGet(this, _NetworkTrackAppender_group, "f").style.color = ThemeSupport.ThemeSupport.instance().getComputedValue('--sys-color-on-surface');
                __classPrivateFieldGet(this, _NetworkTrackAppender_group, "f").style.backgroundColor =
                    ThemeSupport.ThemeSupport.instance().getComputedValue('--sys-color-cdt-base-container');
            }
        });
    }
    group() {
        return __classPrivateFieldGet(this, _NetworkTrackAppender_group, "f");
    }
    font() {
        return __classPrivateFieldGet(this, _NetworkTrackAppender_font, "f");
    }
    /**
     * Appends into the flame chart data the data corresponding to the
     * Network track.
     * @param trackStartLevel the horizontal level of the flame chart events where
     * the track's events will start being appended.
     * @param expanded wether the track should be rendered expanded.
     * @returns the first available level to append more data after having
     * appended the track's events.
     */
    appendTrackAtLevel(trackStartLevel, expanded) {
        if (__classPrivateFieldGet(this, _NetworkTrackAppender_events, "f").length === 0) {
            return trackStartLevel;
        }
        __classPrivateFieldGet(this, _NetworkTrackAppender_instances, "m", _NetworkTrackAppender_appendTrackHeaderAtLevel).call(this, trackStartLevel, expanded);
        return __classPrivateFieldGet(this, _NetworkTrackAppender_instances, "m", _NetworkTrackAppender_appendEventsAtLevel).call(this, __classPrivateFieldGet(this, _NetworkTrackAppender_events, "f"), trackStartLevel);
    }
    /**
     * Update the flame chart data.
     * When users zoom in the flamechart, we only want to show them the network
     * requests between minTime and maxTime. This function will append those
     * invisible events to the last level, and hide them.
     * @returns the number of levels used by this track
     */
    relayoutEntriesWithinBounds(events, minTime, maxTime) {
        if (!__classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f") || events.length === 0) {
            return 0;
        }
        const lastTimestampByLevel = [];
        this.webSocketIdToLevel = new Map();
        let maxLevel = 0;
        for (let i = 0; i < events.length; ++i) {
            const event = events[i];
            const beginTime = Trace.Helpers.Timing.microToMilli(event.ts);
            const dur = event.dur ? Trace.Helpers.Timing.microToMilli(event.dur) : InstantEventVisibleDurationMs;
            const endTime = beginTime + dur;
            const isBetweenTimes = beginTime < maxTime && endTime > minTime;
            // Exclude events outside the the specified timebounds
            if (!isBetweenTimes) {
                __classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f").entryLevels[i] = -1;
                continue;
            }
            // Layout the entries by assigning levels.
            let level;
            if ('identifier' in event.args.data && Trace.Types.Events.isWebSocketEvent(event)) {
                level = this.getWebSocketLevel(event, lastTimestampByLevel);
            }
            else {
                level = getEventLevel(event, lastTimestampByLevel);
            }
            __classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f").entryLevels[i] = level;
            maxLevel = Math.max(maxLevel, lastTimestampByLevel.length, level);
        }
        for (let i = 0; i < events.length; ++i) {
            // -1 means this event is invisible.
            if (__classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f").entryLevels[i] === -1) {
                // The maxLevel is an invisible level.
                __classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f").entryLevels[i] = maxLevel;
            }
        }
        return maxLevel;
    }
    getWebSocketLevel(event, lastTimestampByLevel) {
        const webSocketIdentifier = event.args.data.identifier;
        let level;
        if (this.webSocketIdToLevel.has(webSocketIdentifier)) {
            // We're placing an instant event on top of its parent websocket
            level = this.webSocketIdToLevel.get(webSocketIdentifier) || 0;
        }
        else {
            // We're placing the parent websocket
            level = getEventLevel(event, lastTimestampByLevel);
            this.webSocketIdToLevel.set(webSocketIdentifier, level);
        }
        return level;
    }
    /*
      ------------------------------------------------------------------------------------
       The following methods  are invoked by the flame chart renderer to query features about
       events on rendering.
      ------------------------------------------------------------------------------------
    */
    /**
     * Gets the color an event added by this appender should be rendered with.
     */
    colorForEvent(event) {
        if (Trace.Types.Events.isSyntheticWebSocketConnection(event)) {
            // the synthetic WebSocket events are not selectable, so we don't need to set the color.
            return '';
        }
        if (Trace.Types.Events.isWebSocketTraceEvent(event)) {
            return Components.Utils.colorForNetworkCategory(Components.Utils.NetworkCategory.JS);
        }
        if (!Trace.Types.Events.isSyntheticNetworkRequest(event)) {
            throw new Error(`Unexpected Network Request: The event's type is '${event.name}'`);
        }
        return Components.Utils.colorForNetworkRequest(event);
    }
}
_NetworkTrackAppender_flameChartData = new WeakMap(), _NetworkTrackAppender_events = new WeakMap(), _NetworkTrackAppender_font = new WeakMap(), _NetworkTrackAppender_group = new WeakMap(), _NetworkTrackAppender_instances = new WeakSet(), _NetworkTrackAppender_appendTrackHeaderAtLevel = function _NetworkTrackAppender_appendTrackHeaderAtLevel(_currentLevel, expanded) {
    const style = buildGroupStyle({
        shareHeaderLine: false,
        useFirstLineForOverview: false,
        useDecoratorsForOverview: true,
    });
    __classPrivateFieldSet(this, _NetworkTrackAppender_group, buildTrackHeader("network" /* VisualLoggingTrackName.NETWORK */, 0, i18nString(UIStrings.network), style, /* selectable= */ true, expanded, 
    /* showStackContextMenu= */ false), "f");
    __classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f").groups.push(__classPrivateFieldGet(this, _NetworkTrackAppender_group, "f"));
}, _NetworkTrackAppender_appendEventsAtLevel = function _NetworkTrackAppender_appendEventsAtLevel(events, trackStartLevel) {
    // Appending everything to the same level isn't "correct", but relayoutEntriesWithinBounds() will handle that
    // before anything is rendered.
    for (let i = 0; i < events.length; ++i) {
        const event = events[i];
        __classPrivateFieldGet(this, _NetworkTrackAppender_instances, "m", _NetworkTrackAppender_appendEventAtLevel).call(this, event, trackStartLevel);
        // Decorate render blocking
        if (Trace.Types.Events.isSyntheticNetworkRequest(event) &&
            Trace.Helpers.Network.isSyntheticNetworkRequestEventRenderBlocking(event)) {
            addDecorationToEvent(__classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f"), i, {
                type: "WARNING_TRIANGLE" /* PerfUI.FlameChart.FlameChartDecorationType.WARNING_TRIANGLE */,
                customStartTime: event.args.data.syntheticData.sendStartTime,
                customEndTime: event.args.data.syntheticData.finishTime,
            });
        }
    }
    return this.relayoutEntriesWithinBounds(events, Trace.Types.Timing.Milli(-Infinity), Trace.Types.Timing.Milli(Infinity));
}, _NetworkTrackAppender_appendEventAtLevel = function _NetworkTrackAppender_appendEventAtLevel(event, level) {
    const index = __classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f").entryLevels.length;
    __classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f").entryLevels[index] = level;
    __classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f").entryStartTimes[index] = Trace.Helpers.Timing.microToMilli(event.ts);
    const dur = event.dur || Trace.Helpers.Timing.milliToMicro(InstantEventVisibleDurationMs);
    __classPrivateFieldGet(this, _NetworkTrackAppender_flameChartData, "f").entryTotalTimes[index] = Trace.Helpers.Timing.microToMilli(dur);
    return level;
};
//# sourceMappingURL=NetworkTrackAppender.js.map