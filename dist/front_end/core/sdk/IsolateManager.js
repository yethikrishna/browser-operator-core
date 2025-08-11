// Copyright 2019 The Chromium Authors. All rights reserved.
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
var _IsolateManager_isolatesInternal, _IsolateManager_isolateIdByModel, _IsolateManager_observers, _IsolateManager_pollId, _Isolate_idInternal, _Isolate_usedHeapSizeInternal, _Isolate_memoryTrend, _MemoryTrend_maxCount, _MemoryTrend_base, _MemoryTrend_index, _MemoryTrend_x, _MemoryTrend_y, _MemoryTrend_sx, _MemoryTrend_sy, _MemoryTrend_sxx, _MemoryTrend_sxy;
import * as Common from '../common/common.js';
import { RuntimeModel } from './RuntimeModel.js';
import { TargetManager } from './TargetManager.js';
let isolateManagerInstance;
export class IsolateManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _IsolateManager_isolatesInternal.set(this, new Map());
        /**
         * Contains null while the isolateId is being retrieved.
         */
        _IsolateManager_isolateIdByModel.set(this, new Map());
        _IsolateManager_observers.set(this, new Set());
        _IsolateManager_pollId.set(this, 0);
        TargetManager.instance().observeModels(RuntimeModel, this);
    }
    static instance({ forceNew } = { forceNew: false }) {
        if (!isolateManagerInstance || forceNew) {
            isolateManagerInstance = new IsolateManager();
        }
        return isolateManagerInstance;
    }
    observeIsolates(observer) {
        if (__classPrivateFieldGet(this, _IsolateManager_observers, "f").has(observer)) {
            throw new Error('Observer can only be registered once');
        }
        if (!__classPrivateFieldGet(this, _IsolateManager_observers, "f").size) {
            void this.poll();
        }
        __classPrivateFieldGet(this, _IsolateManager_observers, "f").add(observer);
        for (const isolate of __classPrivateFieldGet(this, _IsolateManager_isolatesInternal, "f").values()) {
            observer.isolateAdded(isolate);
        }
    }
    modelAdded(model) {
        void this.modelAddedInternal(model);
    }
    async modelAddedInternal(model) {
        __classPrivateFieldGet(this, _IsolateManager_isolateIdByModel, "f").set(model, null);
        const isolateId = await model.isolateId();
        if (!__classPrivateFieldGet(this, _IsolateManager_isolateIdByModel, "f").has(model)) {
            // The model has been removed during await.
            return;
        }
        if (!isolateId) {
            __classPrivateFieldGet(this, _IsolateManager_isolateIdByModel, "f").delete(model);
            return;
        }
        __classPrivateFieldGet(this, _IsolateManager_isolateIdByModel, "f").set(model, isolateId);
        let isolate = __classPrivateFieldGet(this, _IsolateManager_isolatesInternal, "f").get(isolateId);
        if (!isolate) {
            isolate = new Isolate(isolateId);
            __classPrivateFieldGet(this, _IsolateManager_isolatesInternal, "f").set(isolateId, isolate);
        }
        isolate.modelsInternal.add(model);
        if (isolate.modelsInternal.size === 1) {
            for (const observer of __classPrivateFieldGet(this, _IsolateManager_observers, "f")) {
                observer.isolateAdded(isolate);
            }
        }
        else {
            for (const observer of __classPrivateFieldGet(this, _IsolateManager_observers, "f")) {
                observer.isolateChanged(isolate);
            }
        }
    }
    modelRemoved(model) {
        const isolateId = __classPrivateFieldGet(this, _IsolateManager_isolateIdByModel, "f").get(model);
        __classPrivateFieldGet(this, _IsolateManager_isolateIdByModel, "f").delete(model);
        if (!isolateId) {
            return;
        }
        const isolate = __classPrivateFieldGet(this, _IsolateManager_isolatesInternal, "f").get(isolateId);
        if (!isolate) {
            return;
        }
        isolate.modelsInternal.delete(model);
        if (isolate.modelsInternal.size) {
            for (const observer of __classPrivateFieldGet(this, _IsolateManager_observers, "f")) {
                observer.isolateChanged(isolate);
            }
            return;
        }
        for (const observer of __classPrivateFieldGet(this, _IsolateManager_observers, "f")) {
            observer.isolateRemoved(isolate);
        }
        __classPrivateFieldGet(this, _IsolateManager_isolatesInternal, "f").delete(isolateId);
    }
    isolateByModel(model) {
        return __classPrivateFieldGet(this, _IsolateManager_isolatesInternal, "f").get(__classPrivateFieldGet(this, _IsolateManager_isolateIdByModel, "f").get(model) || '') || null;
    }
    isolates() {
        return __classPrivateFieldGet(this, _IsolateManager_isolatesInternal, "f").values();
    }
    async poll() {
        const pollId = __classPrivateFieldGet(this, _IsolateManager_pollId, "f");
        while (pollId === __classPrivateFieldGet(this, _IsolateManager_pollId, "f")) {
            await Promise.all(Array.from(this.isolates(), isolate => isolate.update()));
            await new Promise(r => window.setTimeout(r, PollIntervalMs));
        }
    }
}
_IsolateManager_isolatesInternal = new WeakMap(), _IsolateManager_isolateIdByModel = new WeakMap(), _IsolateManager_observers = new WeakMap(), _IsolateManager_pollId = new WeakMap();
export var Events;
(function (Events) {
    Events["MEMORY_CHANGED"] = "MemoryChanged";
})(Events || (Events = {}));
export const MemoryTrendWindowMs = 120e3;
const PollIntervalMs = 2e3;
export class Isolate {
    constructor(id) {
        _Isolate_idInternal.set(this, void 0);
        _Isolate_usedHeapSizeInternal.set(this, void 0);
        _Isolate_memoryTrend.set(this, void 0);
        __classPrivateFieldSet(this, _Isolate_idInternal, id, "f");
        this.modelsInternal = new Set();
        __classPrivateFieldSet(this, _Isolate_usedHeapSizeInternal, 0, "f");
        const count = MemoryTrendWindowMs / PollIntervalMs;
        __classPrivateFieldSet(this, _Isolate_memoryTrend, new MemoryTrend(count), "f");
    }
    id() {
        return __classPrivateFieldGet(this, _Isolate_idInternal, "f");
    }
    models() {
        return this.modelsInternal;
    }
    runtimeModel() {
        return this.modelsInternal.values().next().value || null;
    }
    heapProfilerModel() {
        const runtimeModel = this.runtimeModel();
        return runtimeModel?.heapProfilerModel() ?? null;
    }
    async update() {
        const model = this.runtimeModel();
        const usage = model && await model.heapUsage();
        if (!usage) {
            return;
        }
        __classPrivateFieldSet(this, _Isolate_usedHeapSizeInternal, usage.usedSize + (usage.embedderHeapUsedSize ?? 0) + (usage.backingStorageSize ?? 0), "f");
        __classPrivateFieldGet(this, _Isolate_memoryTrend, "f").add(__classPrivateFieldGet(this, _Isolate_usedHeapSizeInternal, "f"));
        IsolateManager.instance().dispatchEventToListeners("MemoryChanged" /* Events.MEMORY_CHANGED */, this);
    }
    samplesCount() {
        return __classPrivateFieldGet(this, _Isolate_memoryTrend, "f").count();
    }
    usedHeapSize() {
        return __classPrivateFieldGet(this, _Isolate_usedHeapSizeInternal, "f");
    }
    /**
     * bytes per millisecond
     */
    usedHeapSizeGrowRate() {
        return __classPrivateFieldGet(this, _Isolate_memoryTrend, "f").fitSlope();
    }
}
_Isolate_idInternal = new WeakMap(), _Isolate_usedHeapSizeInternal = new WeakMap(), _Isolate_memoryTrend = new WeakMap();
export class MemoryTrend {
    constructor(maxCount) {
        _MemoryTrend_maxCount.set(this, void 0);
        _MemoryTrend_base.set(this, void 0);
        _MemoryTrend_index.set(this, void 0);
        _MemoryTrend_x.set(this, void 0);
        _MemoryTrend_y.set(this, void 0);
        _MemoryTrend_sx.set(this, void 0);
        _MemoryTrend_sy.set(this, void 0);
        _MemoryTrend_sxx.set(this, void 0);
        _MemoryTrend_sxy.set(this, void 0);
        __classPrivateFieldSet(this, _MemoryTrend_maxCount, maxCount | 0, "f");
        this.reset();
    }
    reset() {
        __classPrivateFieldSet(this, _MemoryTrend_base, Date.now(), "f");
        __classPrivateFieldSet(this, _MemoryTrend_index, 0, "f");
        __classPrivateFieldSet(this, _MemoryTrend_x, [], "f");
        __classPrivateFieldSet(this, _MemoryTrend_y, [], "f");
        __classPrivateFieldSet(this, _MemoryTrend_sx, 0, "f");
        __classPrivateFieldSet(this, _MemoryTrend_sy, 0, "f");
        __classPrivateFieldSet(this, _MemoryTrend_sxx, 0, "f");
        __classPrivateFieldSet(this, _MemoryTrend_sxy, 0, "f");
    }
    count() {
        return __classPrivateFieldGet(this, _MemoryTrend_x, "f").length;
    }
    add(heapSize, timestamp) {
        const x = typeof timestamp === 'number' ? timestamp : Date.now() - __classPrivateFieldGet(this, _MemoryTrend_base, "f");
        const y = heapSize;
        if (__classPrivateFieldGet(this, _MemoryTrend_x, "f").length === __classPrivateFieldGet(this, _MemoryTrend_maxCount, "f")) {
            // Turns into a cyclic buffer once it reaches the |#maxCount|.
            const x0 = __classPrivateFieldGet(this, _MemoryTrend_x, "f")[__classPrivateFieldGet(this, _MemoryTrend_index, "f")];
            const y0 = __classPrivateFieldGet(this, _MemoryTrend_y, "f")[__classPrivateFieldGet(this, _MemoryTrend_index, "f")];
            __classPrivateFieldSet(this, _MemoryTrend_sx, __classPrivateFieldGet(this, _MemoryTrend_sx, "f") - x0, "f");
            __classPrivateFieldSet(this, _MemoryTrend_sy, __classPrivateFieldGet(this, _MemoryTrend_sy, "f") - y0, "f");
            __classPrivateFieldSet(this, _MemoryTrend_sxx, __classPrivateFieldGet(this, _MemoryTrend_sxx, "f") - x0 * x0, "f");
            __classPrivateFieldSet(this, _MemoryTrend_sxy, __classPrivateFieldGet(this, _MemoryTrend_sxy, "f") - x0 * y0, "f");
        }
        __classPrivateFieldSet(this, _MemoryTrend_sx, __classPrivateFieldGet(this, _MemoryTrend_sx, "f") + x, "f");
        __classPrivateFieldSet(this, _MemoryTrend_sy, __classPrivateFieldGet(this, _MemoryTrend_sy, "f") + y, "f");
        __classPrivateFieldSet(this, _MemoryTrend_sxx, __classPrivateFieldGet(this, _MemoryTrend_sxx, "f") + x * x, "f");
        __classPrivateFieldSet(this, _MemoryTrend_sxy, __classPrivateFieldGet(this, _MemoryTrend_sxy, "f") + x * y, "f");
        __classPrivateFieldGet(this, _MemoryTrend_x, "f")[__classPrivateFieldGet(this, _MemoryTrend_index, "f")] = x;
        __classPrivateFieldGet(this, _MemoryTrend_y, "f")[__classPrivateFieldGet(this, _MemoryTrend_index, "f")] = y;
        __classPrivateFieldSet(this, _MemoryTrend_index, (__classPrivateFieldGet(this, _MemoryTrend_index, "f") + 1) % __classPrivateFieldGet(this, _MemoryTrend_maxCount, "f"), "f");
    }
    fitSlope() {
        // We use the linear regression model to find the slope.
        const n = this.count();
        return n < 2 ? 0 : (__classPrivateFieldGet(this, _MemoryTrend_sxy, "f") - __classPrivateFieldGet(this, _MemoryTrend_sx, "f") * __classPrivateFieldGet(this, _MemoryTrend_sy, "f") / n) / (__classPrivateFieldGet(this, _MemoryTrend_sxx, "f") - __classPrivateFieldGet(this, _MemoryTrend_sx, "f") * __classPrivateFieldGet(this, _MemoryTrend_sx, "f") / n);
    }
}
_MemoryTrend_maxCount = new WeakMap(), _MemoryTrend_base = new WeakMap(), _MemoryTrend_index = new WeakMap(), _MemoryTrend_x = new WeakMap(), _MemoryTrend_y = new WeakMap(), _MemoryTrend_sx = new WeakMap(), _MemoryTrend_sy = new WeakMap(), _MemoryTrend_sxx = new WeakMap(), _MemoryTrend_sxy = new WeakMap();
//# sourceMappingURL=IsolateManager.js.map