// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EventsSerializer_instances, _EventsSerializer_modifiedProfileCallByKey, _EventsSerializer_getModifiedProfileCallByKeyValues;
import * as Trace from '../../models/trace/trace.js';
export class EventsSerializer {
    constructor() {
        _EventsSerializer_instances.add(this);
        _EventsSerializer_modifiedProfileCallByKey.set(this, new Map());
    }
    keyForEvent(event) {
        if (Trace.Types.Events.isProfileCall(event)) {
            return `${"p" /* Trace.Types.File.EventKeyType.PROFILE_CALL */}-${event.pid}-${event.tid}-${Trace.Types.Events.SampleIndex(event.sampleIndex)}-${event.nodeId}`;
        }
        if (Trace.Types.Events.isLegacyTimelineFrame(event)) {
            return `${"l" /* Trace.Types.File.EventKeyType.LEGACY_TIMELINE_FRAME */}-${event.index}`;
        }
        const rawEvents = Trace.Helpers.SyntheticEvents.SyntheticEventsManager.getActiveManager().getRawTraceEvents();
        const key = Trace.Types.Events.isSyntheticBased(event) ?
            `${"s" /* Trace.Types.File.EventKeyType.SYNTHETIC_EVENT */}-${rawEvents.indexOf(event.rawSourceEvent)}` :
            `${"r" /* Trace.Types.File.EventKeyType.RAW_EVENT */}-${rawEvents.indexOf(event)}`;
        if (key.length < 3) {
            return null;
        }
        return key;
    }
    eventForKey(key, parsedTrace) {
        const eventValues = Trace.Types.File.traceEventKeyToValues(key);
        if (EventsSerializer.isProfileCallKey(eventValues)) {
            return __classPrivateFieldGet(this, _EventsSerializer_instances, "m", _EventsSerializer_getModifiedProfileCallByKeyValues).call(this, eventValues, parsedTrace);
        }
        if (EventsSerializer.isLegacyTimelineFrameKey(eventValues)) {
            const event = parsedTrace.Frames.frames.at(eventValues.rawIndex);
            if (!event) {
                throw new Error(`Could not find frame with index ${eventValues.rawIndex}`);
            }
            return event;
        }
        if (EventsSerializer.isSyntheticEventKey(eventValues)) {
            const syntheticEvents = Trace.Helpers.SyntheticEvents.SyntheticEventsManager.getActiveManager().getSyntheticTraces();
            const syntheticEvent = syntheticEvents.at(eventValues.rawIndex);
            if (!syntheticEvent) {
                throw new Error(`Attempted to get a synthetic event from an unknown raw event index: ${eventValues.rawIndex}`);
            }
            return syntheticEvent;
        }
        if (EventsSerializer.isRawEventKey(eventValues)) {
            const rawEvents = Trace.Helpers.SyntheticEvents.SyntheticEventsManager.getActiveManager().getRawTraceEvents();
            return rawEvents[eventValues.rawIndex];
        }
        throw new Error(`Unknown trace event serializable key values: ${eventValues.join('-')}`);
    }
    static isProfileCallKey(key) {
        return key.type === "p" /* Trace.Types.File.EventKeyType.PROFILE_CALL */;
    }
    static isLegacyTimelineFrameKey(key) {
        return key.type === "l" /* Trace.Types.File.EventKeyType.LEGACY_TIMELINE_FRAME */;
    }
    static isRawEventKey(key) {
        return key.type === "r" /* Trace.Types.File.EventKeyType.RAW_EVENT */;
    }
    static isSyntheticEventKey(key) {
        return key.type === "s" /* Trace.Types.File.EventKeyType.SYNTHETIC_EVENT */;
    }
}
_EventsSerializer_modifiedProfileCallByKey = new WeakMap(), _EventsSerializer_instances = new WeakSet(), _EventsSerializer_getModifiedProfileCallByKeyValues = function _EventsSerializer_getModifiedProfileCallByKeyValues(key, parsedTrace) {
    const cacheResult = __classPrivateFieldGet(this, _EventsSerializer_modifiedProfileCallByKey, "f").get(key);
    if (cacheResult) {
        return cacheResult;
    }
    const profileCallsInThread = parsedTrace.Renderer.processes.get(key.processID)?.threads.get(key.threadID)?.profileCalls;
    if (!profileCallsInThread) {
        throw new Error(`Unknown profile call serializable key: ${(key)}`);
    }
    const match = profileCallsInThread?.find(e => {
        return e.sampleIndex === key.sampleIndex && e.nodeId === key.protocol;
    });
    if (!match) {
        throw new Error(`Unknown profile call serializable key: ${(JSON.stringify(key))}`);
    }
    // Cache to avoid looking up in subsequent calls.
    __classPrivateFieldGet(this, _EventsSerializer_modifiedProfileCallByKey, "f").set(key, match);
    return match;
};
//# sourceMappingURL=EventsSerializer.js.map