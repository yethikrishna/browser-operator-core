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
var _TextCursor_lineEndings, _TextCursor_offset, _TextCursor_lineNumber, _TextCursor_columnNumber;
import * as Platform from '../../core/platform/platform.js';
export class TextCursor {
    constructor(lineEndings) {
        _TextCursor_lineEndings.set(this, void 0);
        _TextCursor_offset.set(this, 0);
        _TextCursor_lineNumber.set(this, 0);
        _TextCursor_columnNumber.set(this, 0);
        __classPrivateFieldSet(this, _TextCursor_lineEndings, lineEndings, "f");
    }
    advance(offset) {
        var _a;
        __classPrivateFieldSet(this, _TextCursor_offset, offset, "f");
        while (__classPrivateFieldGet(this, _TextCursor_lineNumber, "f") < __classPrivateFieldGet(this, _TextCursor_lineEndings, "f").length && __classPrivateFieldGet(this, _TextCursor_lineEndings, "f")[__classPrivateFieldGet(this, _TextCursor_lineNumber, "f")] < __classPrivateFieldGet(this, _TextCursor_offset, "f")) {
            __classPrivateFieldSet(this, _TextCursor_lineNumber, (_a = __classPrivateFieldGet(this, _TextCursor_lineNumber, "f"), ++_a), "f");
        }
        __classPrivateFieldSet(this, _TextCursor_columnNumber, __classPrivateFieldGet(this, _TextCursor_lineNumber, "f") ? __classPrivateFieldGet(this, _TextCursor_offset, "f") - __classPrivateFieldGet(this, _TextCursor_lineEndings, "f")[__classPrivateFieldGet(this, _TextCursor_lineNumber, "f") - 1] - 1 : __classPrivateFieldGet(this, _TextCursor_offset, "f"), "f");
    }
    offset() {
        return __classPrivateFieldGet(this, _TextCursor_offset, "f");
    }
    resetTo(offset) {
        __classPrivateFieldSet(this, _TextCursor_offset, offset, "f");
        __classPrivateFieldSet(this, _TextCursor_lineNumber, Platform.ArrayUtilities.lowerBound(__classPrivateFieldGet(this, _TextCursor_lineEndings, "f"), offset, Platform.ArrayUtilities.DEFAULT_COMPARATOR), "f");
        __classPrivateFieldSet(this, _TextCursor_columnNumber, __classPrivateFieldGet(this, _TextCursor_lineNumber, "f") ? __classPrivateFieldGet(this, _TextCursor_offset, "f") - __classPrivateFieldGet(this, _TextCursor_lineEndings, "f")[__classPrivateFieldGet(this, _TextCursor_lineNumber, "f") - 1] - 1 : __classPrivateFieldGet(this, _TextCursor_offset, "f"), "f");
    }
    lineNumber() {
        return __classPrivateFieldGet(this, _TextCursor_lineNumber, "f");
    }
    columnNumber() {
        return __classPrivateFieldGet(this, _TextCursor_columnNumber, "f");
    }
}
_TextCursor_lineEndings = new WeakMap(), _TextCursor_offset = new WeakMap(), _TextCursor_lineNumber = new WeakMap(), _TextCursor_columnNumber = new WeakMap();
//# sourceMappingURL=TextCursor.js.map