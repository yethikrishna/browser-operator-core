// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _LinearMemoryInspectorView_instances, _LinearMemoryInspectorView_memory, _LinearMemoryInspectorView_address, _LinearMemoryInspectorView_inspector, _LinearMemoryInspectorView_memoryRequested, _StreamingContentHexView_instances, _StreamingContentHexView_streamingContentData, _StreamingContentHexView_updateMemoryFromContentData;
import * as TextUtils from '../../../../models/text_utils/text_utils.js';
import * as LinearMemoryInspectorComponents from '../../../../panels/linear_memory_inspector/components/components.js';
import * as UI from '../../legacy.js';
const MEMORY_TRANSFER_MIN_CHUNK_SIZE = 1000;
/**
 * This is a slightly reduced version of `panels/LinearMemoryInspectorPane.LinearMemoryInspectorView.
 *
 * It's not hooked up to the LinearMemoryInspectorController and it operates on a fixed memory array thats
 * known upfront.
 */
class LinearMemoryInspectorView extends UI.Widget.VBox {
    constructor() {
        super(false);
        _LinearMemoryInspectorView_instances.add(this);
        _LinearMemoryInspectorView_memory.set(this, new Uint8Array([0]));
        _LinearMemoryInspectorView_address.set(this, 0);
        _LinearMemoryInspectorView_inspector.set(this, new LinearMemoryInspectorComponents.LinearMemoryInspector.LinearMemoryInspector());
        __classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f").addEventListener(LinearMemoryInspectorComponents.LinearMemoryInspector.MemoryRequestEvent.eventName, __classPrivateFieldGet(this, _LinearMemoryInspectorView_instances, "m", _LinearMemoryInspectorView_memoryRequested).bind(this));
        __classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f").addEventListener(LinearMemoryInspectorComponents.LinearMemoryInspector.AddressChangedEvent.eventName, event => {
            __classPrivateFieldSet(this, _LinearMemoryInspectorView_address, event.data, "f");
        });
        this.contentElement.appendChild(__classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f"));
    }
    wasShown() {
        this.refreshData();
    }
    setMemory(memory) {
        __classPrivateFieldSet(this, _LinearMemoryInspectorView_memory, memory, "f");
        this.refreshData();
    }
    refreshData() {
        // TODO(szuend): The following lines are copied from `LinearMemoryInspectorController`. We can't reuse them
        // as depending on a module in `panels/` from a component is a layering violation.
        // Provide a chunk of memory that covers the address to show and some before and after
        // as 1. the address shown is not necessarily at the beginning of a page and
        // 2. to allow for fewer memory requests.
        const memoryChunkStart = Math.max(0, __classPrivateFieldGet(this, _LinearMemoryInspectorView_address, "f") - MEMORY_TRANSFER_MIN_CHUNK_SIZE / 2);
        const memoryChunkEnd = memoryChunkStart + MEMORY_TRANSFER_MIN_CHUNK_SIZE;
        const memory = __classPrivateFieldGet(this, _LinearMemoryInspectorView_memory, "f").slice(memoryChunkStart, memoryChunkEnd);
        __classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f").data = {
            memory,
            address: __classPrivateFieldGet(this, _LinearMemoryInspectorView_address, "f"),
            memoryOffset: memoryChunkStart,
            outerMemoryLength: __classPrivateFieldGet(this, _LinearMemoryInspectorView_memory, "f").length,
            hideValueInspector: true,
        };
    }
}
_LinearMemoryInspectorView_memory = new WeakMap(), _LinearMemoryInspectorView_address = new WeakMap(), _LinearMemoryInspectorView_inspector = new WeakMap(), _LinearMemoryInspectorView_instances = new WeakSet(), _LinearMemoryInspectorView_memoryRequested = function _LinearMemoryInspectorView_memoryRequested(event) {
    // TODO(szuend): The following lines are copied from `LinearMemoryInspectorController`. We can't reuse them
    // as depending on a module in `panels/` from a component is a layering violation.
    const { start, end, address } = event.data;
    if (address < start || address >= end) {
        throw new Error('Requested address is out of bounds.');
    }
    // Check that the requested start is within bounds.
    // If the requested end is larger than the actual
    // memory, it will be automatically capped when
    // requesting the range.
    if (start < 0 || start > end || start >= __classPrivateFieldGet(this, _LinearMemoryInspectorView_memory, "f").length) {
        throw new Error('Requested range is out of bounds.');
    }
    const chunkEnd = Math.max(end, start + MEMORY_TRANSFER_MIN_CHUNK_SIZE);
    const memory = __classPrivateFieldGet(this, _LinearMemoryInspectorView_memory, "f").slice(start, chunkEnd);
    __classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f").data = {
        memory,
        address,
        memoryOffset: start,
        outerMemoryLength: __classPrivateFieldGet(this, _LinearMemoryInspectorView_memory, "f").length,
        hideValueInspector: true,
    };
};
/**
 * Adapter for the linear memory inspector that can show a {@link StreamingContentData}.
 */
export class StreamingContentHexView extends LinearMemoryInspectorView {
    constructor(streamingContentData) {
        super();
        _StreamingContentHexView_instances.add(this);
        _StreamingContentHexView_streamingContentData.set(this, void 0);
        __classPrivateFieldSet(this, _StreamingContentHexView_streamingContentData, streamingContentData, "f");
    }
    wasShown() {
        __classPrivateFieldGet(this, _StreamingContentHexView_instances, "m", _StreamingContentHexView_updateMemoryFromContentData).call(this);
        __classPrivateFieldGet(this, _StreamingContentHexView_streamingContentData, "f").addEventListener("ChunkAdded" /* TextUtils.StreamingContentData.Events.CHUNK_ADDED */, __classPrivateFieldGet(this, _StreamingContentHexView_instances, "m", _StreamingContentHexView_updateMemoryFromContentData), this);
        // No need to call super.wasShown() as we call super.refreshData() ourselves.
    }
    willHide() {
        super.willHide();
        __classPrivateFieldGet(this, _StreamingContentHexView_streamingContentData, "f").removeEventListener("ChunkAdded" /* TextUtils.StreamingContentData.Events.CHUNK_ADDED */, __classPrivateFieldGet(this, _StreamingContentHexView_instances, "m", _StreamingContentHexView_updateMemoryFromContentData), this);
    }
}
_StreamingContentHexView_streamingContentData = new WeakMap(), _StreamingContentHexView_instances = new WeakSet(), _StreamingContentHexView_updateMemoryFromContentData = function _StreamingContentHexView_updateMemoryFromContentData() {
    const binaryString = window.atob(__classPrivateFieldGet(this, _StreamingContentHexView_streamingContentData, "f").content().base64);
    const memory = Uint8Array.from(binaryString, m => m.codePointAt(0));
    this.setMemory(memory);
};
//# sourceMappingURL=StreamingContentHexView.js.map