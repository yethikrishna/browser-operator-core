// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _HeapProfilerModel_enabled, _HeapProfilerModel_heapProfilerAgent, _HeapProfilerModel_runtimeModelInternal, _HeapProfilerModel_samplingProfilerDepth, _HeapProfilerDispatcher_heapProfilerModel;
import { RuntimeModel } from './RuntimeModel.js';
import { SDKModel } from './SDKModel.js';
export class HeapProfilerModel extends SDKModel {
    constructor(target) {
        super(target);
        _HeapProfilerModel_enabled.set(this, void 0);
        _HeapProfilerModel_heapProfilerAgent.set(this, void 0);
        _HeapProfilerModel_runtimeModelInternal.set(this, void 0);
        _HeapProfilerModel_samplingProfilerDepth.set(this, void 0);
        target.registerHeapProfilerDispatcher(new HeapProfilerDispatcher(this));
        __classPrivateFieldSet(this, _HeapProfilerModel_enabled, false, "f");
        __classPrivateFieldSet(this, _HeapProfilerModel_heapProfilerAgent, target.heapProfilerAgent(), "f");
        __classPrivateFieldSet(this, _HeapProfilerModel_runtimeModelInternal, target.model(RuntimeModel), "f");
        __classPrivateFieldSet(this, _HeapProfilerModel_samplingProfilerDepth, 0, "f");
    }
    debuggerModel() {
        return __classPrivateFieldGet(this, _HeapProfilerModel_runtimeModelInternal, "f").debuggerModel();
    }
    runtimeModel() {
        return __classPrivateFieldGet(this, _HeapProfilerModel_runtimeModelInternal, "f");
    }
    async enable() {
        if (__classPrivateFieldGet(this, _HeapProfilerModel_enabled, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _HeapProfilerModel_enabled, true, "f");
        await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_enable();
    }
    async startSampling(samplingRateInBytes) {
        var _a, _b;
        if (__classPrivateFieldSet(this, _HeapProfilerModel_samplingProfilerDepth, (_b = __classPrivateFieldGet(this, _HeapProfilerModel_samplingProfilerDepth, "f"), _a = _b++, _b), "f"), _a) {
            return false;
        }
        const defaultSamplingIntervalInBytes = 16384;
        const response = await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_startSampling({ samplingInterval: samplingRateInBytes || defaultSamplingIntervalInBytes });
        return Boolean(response.getError());
    }
    async stopSampling() {
        var _a;
        if (!__classPrivateFieldGet(this, _HeapProfilerModel_samplingProfilerDepth, "f")) {
            throw new Error('Sampling profiler is not running.');
        }
        if (__classPrivateFieldSet(this, _HeapProfilerModel_samplingProfilerDepth, (_a = __classPrivateFieldGet(this, _HeapProfilerModel_samplingProfilerDepth, "f"), --_a), "f")) {
            return await this.getSamplingProfile();
        }
        const response = await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_stopSampling();
        if (response.getError()) {
            return null;
        }
        return response.profile;
    }
    async getSamplingProfile() {
        const response = await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_getSamplingProfile();
        if (response.getError()) {
            return null;
        }
        return response.profile;
    }
    async collectGarbage() {
        const response = await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_collectGarbage();
        return Boolean(response.getError());
    }
    async snapshotObjectIdForObjectId(objectId) {
        const response = await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_getHeapObjectId({ objectId });
        if (response.getError()) {
            return null;
        }
        return response.heapSnapshotObjectId;
    }
    async objectForSnapshotObjectId(snapshotObjectId, objectGroupName) {
        const result = await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_getObjectByHeapObjectId({ objectId: snapshotObjectId, objectGroup: objectGroupName });
        if (result.getError()) {
            return null;
        }
        return __classPrivateFieldGet(this, _HeapProfilerModel_runtimeModelInternal, "f").createRemoteObject(result.result);
    }
    async addInspectedHeapObject(snapshotObjectId) {
        const response = await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_addInspectedHeapObject({ heapObjectId: snapshotObjectId });
        return Boolean(response.getError());
    }
    async takeHeapSnapshot(heapSnapshotOptions) {
        await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_takeHeapSnapshot(heapSnapshotOptions);
    }
    async startTrackingHeapObjects(recordAllocationStacks) {
        const response = await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_startTrackingHeapObjects({ trackAllocations: recordAllocationStacks });
        return Boolean(response.getError());
    }
    async stopTrackingHeapObjects(reportProgress) {
        const response = await __classPrivateFieldGet(this, _HeapProfilerModel_heapProfilerAgent, "f").invoke_stopTrackingHeapObjects({ reportProgress });
        return Boolean(response.getError());
    }
    heapStatsUpdate(samples) {
        this.dispatchEventToListeners("HeapStatsUpdate" /* Events.HEAP_STATS_UPDATED */, samples);
    }
    lastSeenObjectId(lastSeenObjectId, timestamp) {
        this.dispatchEventToListeners("LastSeenObjectId" /* Events.LAST_SEEN_OBJECT_ID */, { lastSeenObjectId, timestamp });
    }
    addHeapSnapshotChunk(chunk) {
        this.dispatchEventToListeners("AddHeapSnapshotChunk" /* Events.ADD_HEAP_SNAPSHOT_CHUNK */, chunk);
    }
    reportHeapSnapshotProgress(done, total, finished) {
        this.dispatchEventToListeners("ReportHeapSnapshotProgress" /* Events.REPORT_HEAP_SNAPSHOT_PROGRESS */, { done, total, finished });
    }
    resetProfiles() {
        this.dispatchEventToListeners("ResetProfiles" /* Events.RESET_PROFILES */, this);
    }
}
_HeapProfilerModel_enabled = new WeakMap(), _HeapProfilerModel_heapProfilerAgent = new WeakMap(), _HeapProfilerModel_runtimeModelInternal = new WeakMap(), _HeapProfilerModel_samplingProfilerDepth = new WeakMap();
export var Events;
(function (Events) {
    Events["HEAP_STATS_UPDATED"] = "HeapStatsUpdate";
    Events["LAST_SEEN_OBJECT_ID"] = "LastSeenObjectId";
    Events["ADD_HEAP_SNAPSHOT_CHUNK"] = "AddHeapSnapshotChunk";
    Events["REPORT_HEAP_SNAPSHOT_PROGRESS"] = "ReportHeapSnapshotProgress";
    Events["RESET_PROFILES"] = "ResetProfiles";
})(Events || (Events = {}));
class HeapProfilerDispatcher {
    constructor(model) {
        _HeapProfilerDispatcher_heapProfilerModel.set(this, void 0);
        __classPrivateFieldSet(this, _HeapProfilerDispatcher_heapProfilerModel, model, "f");
    }
    heapStatsUpdate({ statsUpdate }) {
        __classPrivateFieldGet(this, _HeapProfilerDispatcher_heapProfilerModel, "f").heapStatsUpdate(statsUpdate);
    }
    lastSeenObjectId({ lastSeenObjectId, timestamp }) {
        __classPrivateFieldGet(this, _HeapProfilerDispatcher_heapProfilerModel, "f").lastSeenObjectId(lastSeenObjectId, timestamp);
    }
    addHeapSnapshotChunk({ chunk }) {
        __classPrivateFieldGet(this, _HeapProfilerDispatcher_heapProfilerModel, "f").addHeapSnapshotChunk(chunk);
    }
    reportHeapSnapshotProgress({ done, total, finished }) {
        __classPrivateFieldGet(this, _HeapProfilerDispatcher_heapProfilerModel, "f").reportHeapSnapshotProgress(done, total, finished);
    }
    resetProfiles() {
        __classPrivateFieldGet(this, _HeapProfilerDispatcher_heapProfilerModel, "f").resetProfiles();
    }
}
_HeapProfilerDispatcher_heapProfilerModel = new WeakMap();
SDKModel.register(HeapProfilerModel, { capabilities: 4 /* Capability.JS */, autostart: false });
//# sourceMappingURL=HeapProfilerModel.js.map