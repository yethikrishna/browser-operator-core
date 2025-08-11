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
var _InvisibleEventsFilter_invisibleTypes, _ExclusiveNameFilter_excludeNames;
import * as Types from '../types/types.js';
export class TraceFilter {
}
export class VisibleEventsFilter extends TraceFilter {
    constructor(visibleTypes) {
        super();
        this.visibleTypes = new Set(visibleTypes);
    }
    accept(event) {
        if (Types.Extensions.isSyntheticExtensionEntry(event)) {
            return true;
        }
        return this.visibleTypes.has(VisibleEventsFilter.eventType(event));
    }
    static eventType(event) {
        // Any blink.console category events are treated as ConsoleTime events
        if (event.cat.includes('blink.console')) {
            return "ConsoleTime" /* Types.Events.Name.CONSOLE_TIME */;
        }
        // Any blink.user_timing egory events are treated as UserTiming events
        if (event.cat.includes('blink.user_timing')) {
            return "UserTiming" /* Types.Events.Name.USER_TIMING */;
        }
        return event.name;
    }
}
export class InvisibleEventsFilter extends TraceFilter {
    constructor(invisibleTypes) {
        super();
        _InvisibleEventsFilter_invisibleTypes.set(this, void 0);
        __classPrivateFieldSet(this, _InvisibleEventsFilter_invisibleTypes, new Set(invisibleTypes), "f");
    }
    accept(event) {
        return !__classPrivateFieldGet(this, _InvisibleEventsFilter_invisibleTypes, "f").has(VisibleEventsFilter.eventType(event));
    }
}
_InvisibleEventsFilter_invisibleTypes = new WeakMap();
export class ExclusiveNameFilter extends TraceFilter {
    constructor(excludeNames) {
        super();
        _ExclusiveNameFilter_excludeNames.set(this, void 0);
        __classPrivateFieldSet(this, _ExclusiveNameFilter_excludeNames, new Set(excludeNames), "f");
    }
    accept(event) {
        return !__classPrivateFieldGet(this, _ExclusiveNameFilter_excludeNames, "f").has(event.name);
    }
}
_ExclusiveNameFilter_excludeNames = new WeakMap();
//# sourceMappingURL=TraceFilter.js.map