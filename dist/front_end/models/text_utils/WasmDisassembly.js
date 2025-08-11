// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _WasmDisassembly_offsets, _WasmDisassembly_functionBodyOffsets, _WasmDisassembly_cachedText;
import * as Platform from '../../core/platform/platform.js';
import { ContentData } from './ContentData.js';
/**
 * Metadata to map between bytecode #offsets and line numbers in the
 * disassembly for WebAssembly modules.
 */
export class WasmDisassembly extends ContentData {
    constructor(lines, offsets, functionBodyOffsets) {
        super('', /* isBase64 */ false, 'text/x-wast', 'utf-8');
        _WasmDisassembly_offsets.set(this, void 0);
        _WasmDisassembly_functionBodyOffsets.set(this, void 0);
        // Wasm can be potentially very large, so we calculate `text' lazily.
        _WasmDisassembly_cachedText.set(this, void 0);
        if (lines.length !== offsets.length) {
            throw new Error('Lines and offsets don\'t match');
        }
        this.lines = lines;
        __classPrivateFieldSet(this, _WasmDisassembly_offsets, offsets, "f");
        __classPrivateFieldSet(this, _WasmDisassembly_functionBodyOffsets, functionBodyOffsets, "f");
    }
    get text() {
        if (typeof __classPrivateFieldGet(this, _WasmDisassembly_cachedText, "f") === 'undefined') {
            __classPrivateFieldSet(this, _WasmDisassembly_cachedText, this.lines.join('\n'), "f");
        }
        return __classPrivateFieldGet(this, _WasmDisassembly_cachedText, "f");
    }
    get isEmpty() {
        // Don't trigger unnecessary concatenating. Only check whether we have no lines, or a single empty line.
        return this.lines.length === 0 || (this.lines.length === 1 && this.lines[0].length === 0);
    }
    get lineNumbers() {
        return __classPrivateFieldGet(this, _WasmDisassembly_offsets, "f").length;
    }
    bytecodeOffsetToLineNumber(bytecodeOffset) {
        return Platform.ArrayUtilities.upperBound(__classPrivateFieldGet(this, _WasmDisassembly_offsets, "f"), bytecodeOffset, Platform.ArrayUtilities.DEFAULT_COMPARATOR) -
            1;
    }
    lineNumberToBytecodeOffset(lineNumber) {
        return __classPrivateFieldGet(this, _WasmDisassembly_offsets, "f")[lineNumber];
    }
    /**
     * returns an iterable enumerating all the non-breakable line numbers in the disassembly
     */
    *nonBreakableLineNumbers() {
        let lineNumber = 0;
        let functionIndex = 0;
        while (lineNumber < this.lineNumbers) {
            if (functionIndex < __classPrivateFieldGet(this, _WasmDisassembly_functionBodyOffsets, "f").length) {
                const offset = this.lineNumberToBytecodeOffset(lineNumber);
                if (offset >= __classPrivateFieldGet(this, _WasmDisassembly_functionBodyOffsets, "f")[functionIndex].start) {
                    lineNumber = this.bytecodeOffsetToLineNumber(__classPrivateFieldGet(this, _WasmDisassembly_functionBodyOffsets, "f")[functionIndex++].end) + 1;
                    continue;
                }
            }
            yield lineNumber++;
        }
    }
    /**
     * @deprecated Used during migration from `DeferredContent` to `ContentData`.
     */
    asDeferedContent() {
        return { content: '', isEncoded: false, wasmDisassemblyInfo: this };
    }
}
_WasmDisassembly_offsets = new WeakMap(), _WasmDisassembly_functionBodyOffsets = new WeakMap(), _WasmDisassembly_cachedText = new WeakMap();
//# sourceMappingURL=WasmDisassembly.js.map