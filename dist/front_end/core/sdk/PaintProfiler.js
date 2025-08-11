/*
 * Copyright (C) 2013 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
var _PaintProfilerSnapshot_paintProfilerModel, _PaintProfilerSnapshot_id, _PaintProfilerSnapshot_refCount;
import { SDKModel } from './SDKModel.js';
export class PaintProfilerModel extends SDKModel {
    constructor(target) {
        super(target);
        this.layerTreeAgent = target.layerTreeAgent();
    }
    async loadSnapshotFromFragments(tiles) {
        const { snapshotId } = await this.layerTreeAgent.invoke_loadSnapshot({ tiles });
        return snapshotId ? new PaintProfilerSnapshot(this, snapshotId) : null;
    }
    loadSnapshot(encodedPicture) {
        const fragment = { x: 0, y: 0, picture: encodedPicture };
        return this.loadSnapshotFromFragments([fragment]);
    }
    async makeSnapshot(layerId) {
        const { snapshotId } = await this.layerTreeAgent.invoke_makeSnapshot({ layerId });
        return snapshotId ? new PaintProfilerSnapshot(this, snapshotId) : null;
    }
}
export class PaintProfilerSnapshot {
    constructor(paintProfilerModel, snapshotId) {
        _PaintProfilerSnapshot_paintProfilerModel.set(this, void 0);
        _PaintProfilerSnapshot_id.set(this, void 0);
        _PaintProfilerSnapshot_refCount.set(this, void 0);
        __classPrivateFieldSet(this, _PaintProfilerSnapshot_paintProfilerModel, paintProfilerModel, "f");
        __classPrivateFieldSet(this, _PaintProfilerSnapshot_id, snapshotId, "f");
        __classPrivateFieldSet(this, _PaintProfilerSnapshot_refCount, 1, "f");
    }
    release() {
        var _a;
        console.assert(__classPrivateFieldGet(this, _PaintProfilerSnapshot_refCount, "f") > 0, 'release is already called on the object');
        if (!__classPrivateFieldSet(this, _PaintProfilerSnapshot_refCount, (_a = __classPrivateFieldGet(this, _PaintProfilerSnapshot_refCount, "f"), --_a), "f")) {
            void __classPrivateFieldGet(this, _PaintProfilerSnapshot_paintProfilerModel, "f").layerTreeAgent.invoke_releaseSnapshot({ snapshotId: __classPrivateFieldGet(this, _PaintProfilerSnapshot_id, "f") });
        }
    }
    addReference() {
        var _a;
        __classPrivateFieldSet(this, _PaintProfilerSnapshot_refCount, (_a = __classPrivateFieldGet(this, _PaintProfilerSnapshot_refCount, "f"), ++_a), "f");
        console.assert(__classPrivateFieldGet(this, _PaintProfilerSnapshot_refCount, "f") > 0, 'Referencing a dead object');
    }
    async replay(scale, fromStep, toStep) {
        const response = await __classPrivateFieldGet(this, _PaintProfilerSnapshot_paintProfilerModel, "f").layerTreeAgent.invoke_replaySnapshot({ snapshotId: __classPrivateFieldGet(this, _PaintProfilerSnapshot_id, "f"), fromStep, toStep, scale: scale || 1.0 });
        return response.dataURL;
    }
    async profile(clipRect) {
        const response = await __classPrivateFieldGet(this, _PaintProfilerSnapshot_paintProfilerModel, "f").layerTreeAgent.invoke_profileSnapshot({ snapshotId: __classPrivateFieldGet(this, _PaintProfilerSnapshot_id, "f"), minRepeatCount: 5, minDuration: 1, clipRect: clipRect || undefined });
        return response.timings;
    }
    async commandLog() {
        const response = await __classPrivateFieldGet(this, _PaintProfilerSnapshot_paintProfilerModel, "f").layerTreeAgent.invoke_snapshotCommandLog({ snapshotId: __classPrivateFieldGet(this, _PaintProfilerSnapshot_id, "f") });
        return response.commandLog ? response.commandLog.map((entry, index) => new PaintProfilerLogItem(entry, index)) :
            null;
    }
}
_PaintProfilerSnapshot_paintProfilerModel = new WeakMap(), _PaintProfilerSnapshot_id = new WeakMap(), _PaintProfilerSnapshot_refCount = new WeakMap();
export class PaintProfilerLogItem {
    constructor(rawEntry, commandIndex) {
        this.method = rawEntry.method;
        this.params = rawEntry.params;
        this.commandIndex = commandIndex;
    }
}
SDKModel.register(PaintProfilerModel, { capabilities: 2 /* Capability.DOM */, autostart: false });
//# sourceMappingURL=PaintProfiler.js.map