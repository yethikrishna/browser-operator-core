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
var _CSSFormatter_instances, _CSSFormatter_builder, _CSSFormatter_toOffset, _CSSFormatter_fromOffset, _CSSFormatter_lineEndings, _CSSFormatter_lastLine, _CSSFormatter_state, _CSSFormatter_tokenCallback;
import * as Platform from '../../core/platform/platform.js';
import { createTokenizer } from './FormatterWorker.js';
const cssTrimEnd = (tokenValue) => {
    // https://drafts.csswg.org/css-syntax/#whitespace
    const re = /(?:\r?\n|[\t\f\r ])+$/g;
    return tokenValue.replace(re, '');
};
export class CSSFormatter {
    constructor(builder) {
        _CSSFormatter_instances.add(this);
        _CSSFormatter_builder.set(this, void 0);
        _CSSFormatter_toOffset.set(this, void 0);
        _CSSFormatter_fromOffset.set(this, void 0);
        _CSSFormatter_lineEndings.set(this, void 0);
        _CSSFormatter_lastLine.set(this, void 0);
        _CSSFormatter_state.set(this, void 0);
        __classPrivateFieldSet(this, _CSSFormatter_builder, builder, "f");
        __classPrivateFieldSet(this, _CSSFormatter_lastLine, -1, "f");
        __classPrivateFieldSet(this, _CSSFormatter_state, {
            eatWhitespace: undefined,
            seenProperty: undefined,
            inPropertyValue: undefined,
            afterClosingBrace: undefined,
        }, "f");
    }
    format(text, lineEndings, fromOffset, toOffset) {
        __classPrivateFieldSet(this, _CSSFormatter_lineEndings, lineEndings, "f");
        __classPrivateFieldSet(this, _CSSFormatter_fromOffset, fromOffset, "f");
        __classPrivateFieldSet(this, _CSSFormatter_toOffset, toOffset, "f");
        __classPrivateFieldSet(this, _CSSFormatter_state, {
            eatWhitespace: undefined,
            seenProperty: undefined,
            inPropertyValue: undefined,
            afterClosingBrace: undefined,
        }, "f");
        __classPrivateFieldSet(this, _CSSFormatter_lastLine, -1, "f");
        const tokenize = createTokenizer('text/css');
        const oldEnforce = __classPrivateFieldGet(this, _CSSFormatter_builder, "f").setEnforceSpaceBetweenWords(false);
        tokenize(text.substring(__classPrivateFieldGet(this, _CSSFormatter_fromOffset, "f"), __classPrivateFieldGet(this, _CSSFormatter_toOffset, "f")), __classPrivateFieldGet(this, _CSSFormatter_instances, "m", _CSSFormatter_tokenCallback).bind(this));
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").setEnforceSpaceBetweenWords(oldEnforce);
    }
}
_CSSFormatter_builder = new WeakMap(), _CSSFormatter_toOffset = new WeakMap(), _CSSFormatter_fromOffset = new WeakMap(), _CSSFormatter_lineEndings = new WeakMap(), _CSSFormatter_lastLine = new WeakMap(), _CSSFormatter_state = new WeakMap(), _CSSFormatter_instances = new WeakSet(), _CSSFormatter_tokenCallback = function _CSSFormatter_tokenCallback(token, type, startPosition) {
    startPosition += __classPrivateFieldGet(this, _CSSFormatter_fromOffset, "f");
    const startLine = Platform.ArrayUtilities.lowerBound(__classPrivateFieldGet(this, _CSSFormatter_lineEndings, "f"), startPosition, Platform.ArrayUtilities.DEFAULT_COMPARATOR);
    if (startLine !== __classPrivateFieldGet(this, _CSSFormatter_lastLine, "f")) {
        __classPrivateFieldGet(this, _CSSFormatter_state, "f").eatWhitespace = true;
    }
    if (type && (/^property/.test(type) || /^variable-2/.test(type)) && !__classPrivateFieldGet(this, _CSSFormatter_state, "f").inPropertyValue) {
        __classPrivateFieldGet(this, _CSSFormatter_state, "f").seenProperty = true;
    }
    __classPrivateFieldSet(this, _CSSFormatter_lastLine, startLine, "f");
    // https://drafts.csswg.org/css-syntax/#whitespace
    const isWhitespace = /^(?:\r?\n|[\t\f\r ])+$/.test(token);
    if (isWhitespace) {
        if (!__classPrivateFieldGet(this, _CSSFormatter_state, "f").eatWhitespace) {
            __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addSoftSpace();
        }
        return;
    }
    __classPrivateFieldGet(this, _CSSFormatter_state, "f").eatWhitespace = false;
    if (token === '\n') {
        return;
    }
    if (token !== '}') {
        if (__classPrivateFieldGet(this, _CSSFormatter_state, "f").afterClosingBrace) {
            __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addNewLine(true);
        }
        __classPrivateFieldGet(this, _CSSFormatter_state, "f").afterClosingBrace = false;
    }
    if (token === '}') {
        if (__classPrivateFieldGet(this, _CSSFormatter_state, "f").inPropertyValue) {
            __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addNewLine();
        }
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").decreaseNestingLevel();
        __classPrivateFieldGet(this, _CSSFormatter_state, "f").afterClosingBrace = true;
        __classPrivateFieldGet(this, _CSSFormatter_state, "f").inPropertyValue = false;
    }
    else if (token === ':' && !__classPrivateFieldGet(this, _CSSFormatter_state, "f").inPropertyValue && __classPrivateFieldGet(this, _CSSFormatter_state, "f").seenProperty) {
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addToken(token, startPosition);
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addSoftSpace();
        __classPrivateFieldGet(this, _CSSFormatter_state, "f").eatWhitespace = true;
        __classPrivateFieldGet(this, _CSSFormatter_state, "f").inPropertyValue = true;
        __classPrivateFieldGet(this, _CSSFormatter_state, "f").seenProperty = false;
        return;
    }
    else if (token === '{') {
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addSoftSpace();
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addToken(token, startPosition);
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addNewLine();
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").increaseNestingLevel();
        return;
    }
    __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addToken(cssTrimEnd(token), startPosition);
    if (type === 'comment' && !__classPrivateFieldGet(this, _CSSFormatter_state, "f").inPropertyValue && !__classPrivateFieldGet(this, _CSSFormatter_state, "f").seenProperty) {
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addNewLine();
    }
    if (token === ';' && __classPrivateFieldGet(this, _CSSFormatter_state, "f").inPropertyValue) {
        __classPrivateFieldGet(this, _CSSFormatter_state, "f").inPropertyValue = false;
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addNewLine();
    }
    else if (token === '}') {
        __classPrivateFieldGet(this, _CSSFormatter_builder, "f").addNewLine();
    }
};
//# sourceMappingURL=CSSFormatter.js.map