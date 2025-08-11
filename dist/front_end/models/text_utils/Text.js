// Copyright 2016 The Chromium Authors. All rights reserved.
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
var _Text_value, _Text_lineEndings;
import * as Platform from '../../core/platform/platform.js';
import { TextCursor } from './TextCursor.js';
import { SourceRange, TextRange } from './TextRange.js';
export class Text {
    constructor(value) {
        _Text_value.set(this, void 0);
        _Text_lineEndings.set(this, void 0);
        __classPrivateFieldSet(this, _Text_value, value, "f");
    }
    lineEndings() {
        if (!__classPrivateFieldGet(this, _Text_lineEndings, "f")) {
            __classPrivateFieldSet(this, _Text_lineEndings, Platform.StringUtilities.findLineEndingIndexes(__classPrivateFieldGet(this, _Text_value, "f")), "f");
        }
        return __classPrivateFieldGet(this, _Text_lineEndings, "f");
    }
    value() {
        return __classPrivateFieldGet(this, _Text_value, "f");
    }
    lineCount() {
        const lineEndings = this.lineEndings();
        return lineEndings.length;
    }
    offsetFromPosition(lineNumber, columnNumber) {
        return (lineNumber ? this.lineEndings()[lineNumber - 1] + 1 : 0) + columnNumber;
    }
    positionFromOffset(offset) {
        const lineEndings = this.lineEndings();
        const lineNumber = Platform.ArrayUtilities.lowerBound(lineEndings, offset, Platform.ArrayUtilities.DEFAULT_COMPARATOR);
        return { lineNumber, columnNumber: offset - (lineNumber && (lineEndings[lineNumber - 1] + 1)) };
    }
    lineAt(lineNumber) {
        const lineEndings = this.lineEndings();
        const lineStart = lineNumber > 0 ? lineEndings[lineNumber - 1] + 1 : 0;
        const lineEnd = lineEndings[lineNumber];
        let lineContent = __classPrivateFieldGet(this, _Text_value, "f").substring(lineStart, lineEnd);
        if (lineContent.length > 0 && lineContent.charAt(lineContent.length - 1) === '\r') {
            lineContent = lineContent.substring(0, lineContent.length - 1);
        }
        return lineContent;
    }
    toSourceRange(range) {
        const start = this.offsetFromPosition(range.startLine, range.startColumn);
        const end = this.offsetFromPosition(range.endLine, range.endColumn);
        return new SourceRange(start, end - start);
    }
    toTextRange(sourceRange) {
        const cursor = new TextCursor(this.lineEndings());
        const result = TextRange.createFromLocation(0, 0);
        cursor.resetTo(sourceRange.offset);
        result.startLine = cursor.lineNumber();
        result.startColumn = cursor.columnNumber();
        cursor.advance(sourceRange.offset + sourceRange.length);
        result.endLine = cursor.lineNumber();
        result.endColumn = cursor.columnNumber();
        return result;
    }
    replaceRange(range, replacement) {
        const sourceRange = this.toSourceRange(range);
        return __classPrivateFieldGet(this, _Text_value, "f").substring(0, sourceRange.offset) + replacement +
            __classPrivateFieldGet(this, _Text_value, "f").substring(sourceRange.offset + sourceRange.length);
    }
    extract(range) {
        const sourceRange = this.toSourceRange(range);
        return __classPrivateFieldGet(this, _Text_value, "f").substr(sourceRange.offset, sourceRange.length);
    }
}
_Text_value = new WeakMap(), _Text_lineEndings = new WeakMap();
//# sourceMappingURL=Text.js.map