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
var _TimelineOverviewCalculator_minimumBoundary, _TimelineOverviewCalculator_maximumBoundary, _TimelineOverviewCalculator_displayWidth;
// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Trace from '../../../../models/trace/trace.js';
export class TimelineOverviewCalculator {
    constructor() {
        _TimelineOverviewCalculator_minimumBoundary.set(this, Trace.Types.Timing.Milli(0));
        _TimelineOverviewCalculator_maximumBoundary.set(this, Trace.Types.Timing.Milli(100));
        _TimelineOverviewCalculator_displayWidth.set(this, 0);
    }
    /**
     * Given a timestamp, returns its x position in the minimap.
     *
     * @param time
     * @returns position in pixel
     */
    computePosition(time) {
        return (time - __classPrivateFieldGet(this, _TimelineOverviewCalculator_minimumBoundary, "f")) / this.boundarySpan() * __classPrivateFieldGet(this, _TimelineOverviewCalculator_displayWidth, "f");
    }
    positionToTime(position) {
        if (__classPrivateFieldGet(this, _TimelineOverviewCalculator_displayWidth, "f") === 0) {
            return Trace.Types.Timing.Milli(0);
        }
        return Trace.Types.Timing.Milli(position / __classPrivateFieldGet(this, _TimelineOverviewCalculator_displayWidth, "f") * this.boundarySpan() + __classPrivateFieldGet(this, _TimelineOverviewCalculator_minimumBoundary, "f"));
    }
    setBounds(minimumBoundary, maximumBoundary) {
        __classPrivateFieldSet(this, _TimelineOverviewCalculator_minimumBoundary, minimumBoundary, "f");
        __classPrivateFieldSet(this, _TimelineOverviewCalculator_maximumBoundary, maximumBoundary, "f");
    }
    setNavStartTimes(navStartTimes) {
        this.navStartTimes = navStartTimes;
    }
    setDisplayWidth(clientWidth) {
        __classPrivateFieldSet(this, _TimelineOverviewCalculator_displayWidth, clientWidth, "f");
    }
    reset() {
        this.setBounds(Trace.Types.Timing.Milli(0), Trace.Types.Timing.Milli(100));
    }
    formatValue(time, precision) {
        // If there are nav start times the value needs to be remapped.
        if (this.navStartTimes) {
            // Find the latest possible nav start time which is considered earlier
            // than the value passed through.
            for (let i = this.navStartTimes.length - 1; i >= 0; i--) {
                const startTimeMilliseconds = Trace.Helpers.Timing.microToMilli(this.navStartTimes[i].ts);
                if (time > startTimeMilliseconds) {
                    time = Trace.Types.Timing.Milli(time - (startTimeMilliseconds - this.zeroTime()));
                    break;
                }
            }
        }
        return i18n.TimeUtilities.preciseMillisToString(time - this.zeroTime(), precision);
    }
    maximumBoundary() {
        return __classPrivateFieldGet(this, _TimelineOverviewCalculator_maximumBoundary, "f");
    }
    minimumBoundary() {
        return __classPrivateFieldGet(this, _TimelineOverviewCalculator_minimumBoundary, "f");
    }
    zeroTime() {
        return __classPrivateFieldGet(this, _TimelineOverviewCalculator_minimumBoundary, "f");
    }
    /**
     * This function returns the time different between min time and max time of current minimap.
     *
     * @returns the time range in milliseconds
     */
    boundarySpan() {
        return Trace.Types.Timing.Milli(__classPrivateFieldGet(this, _TimelineOverviewCalculator_maximumBoundary, "f") - __classPrivateFieldGet(this, _TimelineOverviewCalculator_minimumBoundary, "f"));
    }
}
_TimelineOverviewCalculator_minimumBoundary = new WeakMap(), _TimelineOverviewCalculator_maximumBoundary = new WeakMap(), _TimelineOverviewCalculator_displayWidth = new WeakMap();
//# sourceMappingURL=TimelineOverviewCalculator.js.map