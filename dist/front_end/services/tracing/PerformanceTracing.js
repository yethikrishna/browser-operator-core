// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _PerformanceTracing_traceEvents, _PerformanceTracing_tracingManager, _PerformanceTracing_delegate;
import { TracingManager } from './TracingManager.js';
export class PerformanceTracing {
    constructor(target, delegate) {
        _PerformanceTracing_traceEvents.set(this, []);
        _PerformanceTracing_tracingManager.set(this, null);
        _PerformanceTracing_delegate.set(this, void 0);
        __classPrivateFieldSet(this, _PerformanceTracing_tracingManager, target.model(TracingManager), "f");
        __classPrivateFieldSet(this, _PerformanceTracing_delegate, delegate, "f");
    }
    async start() {
        __classPrivateFieldGet(this, _PerformanceTracing_traceEvents, "f").length = 0;
        if (!__classPrivateFieldGet(this, _PerformanceTracing_tracingManager, "f")) {
            throw new Error('No tracing manager');
        }
        // This panel may be opened with trace data recorded in other tools.
        // Keep in sync with the categories arrays in:
        // https://source.chromium.org/chromium/chromium/src/+/main:third_party/devtools-frontend/src/front_end/panels/timeline/TimelineController.ts
        // https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/gather/gatherers/trace.js
        const categories = [
            '-*',
            'blink.console',
            'blink.user_timing',
            'devtools.timeline',
            'disabled-by-default-devtools.screenshot',
            'disabled-by-default-devtools.timeline',
            'disabled-by-default-devtools.timeline.invalidationTracking',
            'disabled-by-default-devtools.timeline.frame',
            'disabled-by-default-devtools.timeline.stack',
            'disabled-by-default-v8.cpu_profiler',
            'disabled-by-default-v8.cpu_profiler.hires',
            'latencyInfo',
            'loading',
            'disabled-by-default-lighthouse',
            'v8.execute',
            'v8',
        ].join(',');
        const started = await __classPrivateFieldGet(this, _PerformanceTracing_tracingManager, "f").start(this, categories);
        if (!started) {
            throw new Error('Unable to start tracing.');
        }
    }
    async stop() {
        return __classPrivateFieldGet(this, _PerformanceTracing_tracingManager, "f")?.stop();
    }
    // Start of implementation of SDK.TracingManager.TracingManagerClient
    traceEventsCollected(events) {
        __classPrivateFieldGet(this, _PerformanceTracing_traceEvents, "f").push(...events);
    }
    tracingBufferUsage(usage) {
        __classPrivateFieldGet(this, _PerformanceTracing_delegate, "f").tracingBufferUsage(usage);
    }
    eventsRetrievalProgress(progress) {
        __classPrivateFieldGet(this, _PerformanceTracing_delegate, "f").eventsRetrievalProgress(progress);
    }
    tracingComplete() {
        __classPrivateFieldGet(this, _PerformanceTracing_delegate, "f").tracingComplete(__classPrivateFieldGet(this, _PerformanceTracing_traceEvents, "f"));
    }
}
_PerformanceTracing_traceEvents = new WeakMap(), _PerformanceTracing_tracingManager = new WeakMap(), _PerformanceTracing_delegate = new WeakMap();
// Used by an implementation of Common.Revealer to transfer data from the recorder to the performance panel.
export class RawTraceEvents {
    constructor(events) {
        this.events = events;
    }
    getEvents() {
        return this.events;
    }
}
//# sourceMappingURL=PerformanceTracing.js.map