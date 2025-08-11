// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _SyntheticEventsManager_instances, _SyntheticEventsManager_syntheticTraces, _SyntheticEventsManager_rawTraceEvents, _SyntheticEventsManager_registerSyntheticEvent;
let activeManager = null;
export class SyntheticEventsManager {
    static activate(manager) {
        activeManager = manager;
    }
    static createAndActivate(rawEvents) {
        const manager = new SyntheticEventsManager(rawEvents);
        SyntheticEventsManager.activate(manager);
        return manager;
    }
    static getActiveManager() {
        if (!activeManager) {
            throw new Error('Attempted to get a SyntheticEventsManager without initializing');
        }
        return activeManager;
    }
    static reset() {
        activeManager = null;
    }
    static registerSyntheticEvent(syntheticEvent) {
        var _a;
        try {
            return __classPrivateFieldGet((_a = SyntheticEventsManager.getActiveManager()), _SyntheticEventsManager_instances, "m", _SyntheticEventsManager_registerSyntheticEvent).call(_a, syntheticEvent);
        }
        catch {
            // If no active manager has been initialized, we assume the trace engine is
            // not running as part of the Performance panel. In this case we don't
            // register synthetic events because we don't need to support timeline
            // modifications serialization.
            return syntheticEvent;
        }
    }
    constructor(rawEvents) {
        _SyntheticEventsManager_instances.add(this);
        /**
         * All synthetic entries created in a trace from a corresponding trace events.
         * (ProfileCalls are excluded because they are not based on a real trace event)
         */
        _SyntheticEventsManager_syntheticTraces.set(this, []);
        /**
         * All raw entries from a trace.
         */
        _SyntheticEventsManager_rawTraceEvents.set(this, []);
        __classPrivateFieldSet(this, _SyntheticEventsManager_rawTraceEvents, rawEvents, "f");
    }
    syntheticEventForRawEventIndex(rawEventIndex) {
        const syntheticEvent = __classPrivateFieldGet(this, _SyntheticEventsManager_syntheticTraces, "f").at(rawEventIndex);
        if (!syntheticEvent) {
            throw new Error(`Attempted to get a synthetic event from an unknown raw event index: ${rawEventIndex}`);
        }
        return syntheticEvent;
    }
    getSyntheticTraces() {
        return __classPrivateFieldGet(this, _SyntheticEventsManager_syntheticTraces, "f");
    }
    getRawTraceEvents() {
        return __classPrivateFieldGet(this, _SyntheticEventsManager_rawTraceEvents, "f");
    }
}
_SyntheticEventsManager_syntheticTraces = new WeakMap(), _SyntheticEventsManager_rawTraceEvents = new WeakMap(), _SyntheticEventsManager_instances = new WeakSet(), _SyntheticEventsManager_registerSyntheticEvent = function _SyntheticEventsManager_registerSyntheticEvent(syntheticEvent) {
    const rawIndex = __classPrivateFieldGet(this, _SyntheticEventsManager_rawTraceEvents, "f").indexOf(syntheticEvent.rawSourceEvent);
    if (rawIndex < 0) {
        throw new Error('Attempted to register a synthetic event paired to an unknown raw event.');
    }
    const eventAsSynthetic = syntheticEvent;
    __classPrivateFieldGet(this, _SyntheticEventsManager_syntheticTraces, "f")[rawIndex] = eventAsSynthetic;
    return eventAsSynthetic;
};
//# sourceMappingURL=SyntheticEvents.js.map