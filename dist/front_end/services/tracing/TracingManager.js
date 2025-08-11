// Copyright 2014 The Chromium Authors. All rights reserved.
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
var _TracingManager_tracingAgent, _TracingManager_activeClient, _TracingManager_eventsRetrieved, _TracingManager_finishing, _TracingDispatcher_tracingManager;
import * as SDK from '../../core/sdk/sdk.js';
export class TracingManager extends SDK.SDKModel.SDKModel {
    constructor(target) {
        super(target);
        _TracingManager_tracingAgent.set(this, void 0);
        _TracingManager_activeClient.set(this, void 0);
        _TracingManager_eventsRetrieved.set(this, void 0);
        _TracingManager_finishing.set(this, void 0);
        __classPrivateFieldSet(this, _TracingManager_tracingAgent, target.tracingAgent(), "f");
        target.registerTracingDispatcher(new TracingDispatcher(this));
        __classPrivateFieldSet(this, _TracingManager_activeClient, null, "f");
        __classPrivateFieldSet(this, _TracingManager_eventsRetrieved, 0, "f");
    }
    bufferUsage(usage, percentFull) {
        if (__classPrivateFieldGet(this, _TracingManager_activeClient, "f")) {
            __classPrivateFieldGet(this, _TracingManager_activeClient, "f").tracingBufferUsage(usage || percentFull || 0);
        }
    }
    eventsCollected(events) {
        if (!__classPrivateFieldGet(this, _TracingManager_activeClient, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _TracingManager_activeClient, "f").traceEventsCollected(events);
        __classPrivateFieldSet(this, _TracingManager_eventsRetrieved, __classPrivateFieldGet(this, _TracingManager_eventsRetrieved, "f") + events.length, "f");
        // CDP no longer provides an approximate_event_count AKA eventCount. It's always 0.
        // To give some idea of progress we'll compare to a large (900k event) trace.
        // And we'll clamp both sides so the user sees some progress, and never maxed at 99%
        const progress = Math.min((__classPrivateFieldGet(this, _TracingManager_eventsRetrieved, "f") / 900000) + 0.15, 0.90);
        __classPrivateFieldGet(this, _TracingManager_activeClient, "f").eventsRetrievalProgress(progress);
    }
    tracingComplete() {
        __classPrivateFieldSet(this, _TracingManager_eventsRetrieved, 0, "f");
        if (__classPrivateFieldGet(this, _TracingManager_activeClient, "f")) {
            __classPrivateFieldGet(this, _TracingManager_activeClient, "f").tracingComplete();
            __classPrivateFieldSet(this, _TracingManager_activeClient, null, "f");
        }
        __classPrivateFieldSet(this, _TracingManager_finishing, false, "f");
    }
    async reset() {
        // If we have an active client, we should try to stop
        // it before resetting it, else we will leave the
        // backend in a broken state where it thinks we are in
        // the middle of tracing, but we think we are not.
        // Then, any subsequent attempts to record will fail
        // because the backend will not let us start a second
        // tracing session.
        if (__classPrivateFieldGet(this, _TracingManager_activeClient, "f")) {
            await __classPrivateFieldGet(this, _TracingManager_tracingAgent, "f").invoke_end();
        }
        __classPrivateFieldSet(this, _TracingManager_eventsRetrieved, 0, "f");
        __classPrivateFieldSet(this, _TracingManager_activeClient, null, "f");
        __classPrivateFieldSet(this, _TracingManager_finishing, false, "f");
    }
    async start(client, categoryFilter) {
        if (__classPrivateFieldGet(this, _TracingManager_activeClient, "f")) {
            throw new Error('Tracing is already started');
        }
        const bufferUsageReportingIntervalMs = 500;
        __classPrivateFieldSet(this, _TracingManager_activeClient, client, "f");
        const args = {
            bufferUsageReportingInterval: bufferUsageReportingIntervalMs,
            transferMode: "ReportEvents" /* Protocol.Tracing.StartRequestTransferMode.ReportEvents */,
            traceConfig: {
                recordMode: "recordUntilFull" /* Protocol.Tracing.TraceConfigRecordMode.RecordUntilFull */,
                traceBufferSizeInKb: 1200 * 1000,
                includedCategories: categoryFilter.split(','),
            },
        };
        const response = await __classPrivateFieldGet(this, _TracingManager_tracingAgent, "f").invoke_start(args);
        if (response.getError()) {
            __classPrivateFieldSet(this, _TracingManager_activeClient, null, "f");
        }
        return response;
    }
    stop() {
        if (!__classPrivateFieldGet(this, _TracingManager_activeClient, "f")) {
            throw new Error('Tracing is not started');
        }
        if (__classPrivateFieldGet(this, _TracingManager_finishing, "f")) {
            throw new Error('Tracing is already being stopped');
        }
        __classPrivateFieldSet(this, _TracingManager_finishing, true, "f");
        void __classPrivateFieldGet(this, _TracingManager_tracingAgent, "f").invoke_end();
    }
}
_TracingManager_tracingAgent = new WeakMap(), _TracingManager_activeClient = new WeakMap(), _TracingManager_eventsRetrieved = new WeakMap(), _TracingManager_finishing = new WeakMap();
class TracingDispatcher {
    constructor(tracingManager) {
        _TracingDispatcher_tracingManager.set(this, void 0);
        __classPrivateFieldSet(this, _TracingDispatcher_tracingManager, tracingManager, "f");
    }
    // `eventCount` will always be 0 as perfetto no longer calculates `approximate_event_count`
    bufferUsage({ value, percentFull }) {
        __classPrivateFieldGet(this, _TracingDispatcher_tracingManager, "f").bufferUsage(value, percentFull);
    }
    dataCollected({ value }) {
        __classPrivateFieldGet(this, _TracingDispatcher_tracingManager, "f").eventsCollected(value);
    }
    tracingComplete() {
        __classPrivateFieldGet(this, _TracingDispatcher_tracingManager, "f").tracingComplete();
    }
}
_TracingDispatcher_tracingManager = new WeakMap();
SDK.SDKModel.SDKModel.register(TracingManager, { capabilities: 128 /* SDK.Target.Capability.TRACING */, autostart: false });
//# sourceMappingURL=TracingManager.js.map