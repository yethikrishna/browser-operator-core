// Copyright 2017 The Chromium Authors. All rights reserved.
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
var _IsLong_minimumRecordDurationMilli;
import * as Trace from '../../models/trace/trace.js';
import { TimelineUIUtils } from './TimelineUIUtils.js';
export class IsLong extends Trace.Extras.TraceFilter.TraceFilter {
    constructor() {
        super(...arguments);
        _IsLong_minimumRecordDurationMilli.set(this, Trace.Types.Timing.Milli(0));
    }
    setMinimumRecordDuration(value) {
        __classPrivateFieldSet(this, _IsLong_minimumRecordDurationMilli, value, "f");
    }
    accept(event) {
        const { duration } = Trace.Helpers.Timing.eventTimingsMilliSeconds(event);
        return duration >= __classPrivateFieldGet(this, _IsLong_minimumRecordDurationMilli, "f");
    }
}
_IsLong_minimumRecordDurationMilli = new WeakMap();
export class Category extends Trace.Extras.TraceFilter.TraceFilter {
    accept(event) {
        return !TimelineUIUtils.eventStyle(event).category.hidden;
    }
}
export class TimelineRegExp extends Trace.Extras.TraceFilter.TraceFilter {
    constructor(regExp) {
        super();
        this.setRegExp(regExp || null);
    }
    setRegExp(regExp) {
        this.regExpInternal = regExp;
    }
    regExp() {
        return this.regExpInternal;
    }
    accept(event, parsedTrace) {
        return !this.regExpInternal || TimelineUIUtils.testContentMatching(event, this.regExpInternal, parsedTrace);
    }
}
//# sourceMappingURL=TimelineFilters.js.map