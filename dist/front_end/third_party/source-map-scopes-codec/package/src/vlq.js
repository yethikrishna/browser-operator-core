// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _TokenIterator_string, _TokenIterator_position;
/**
 * @fileoverview
 *
 * VLQ implementation taken mostly verbatim from Chrome DevTools itself.
 */
const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const BASE64_CODES = new Uint8Array(123);
for (let index = 0; index < BASE64_CHARS.length; ++index) {
    BASE64_CODES[BASE64_CHARS.charCodeAt(index)] = index;
}
const VLQ_BASE_SHIFT = 5;
const VLQ_BASE_MASK = (1 << 5) - 1;
const VLQ_CONTINUATION_MASK = 1 << 5;
export function encodeSigned(n) {
    // Set the sign bit as the least significant bit.
    n = n >= 0 ? 2 * n : 1 - 2 * n;
    return encodeUnsigned(n);
}
export function encodeUnsigned(n) {
    // Encode into a base64 run.
    let result = "";
    while (true) {
        // Extract the lowest 5 bits and remove them from the number.
        const digit = n & 0x1f;
        n >>>= 5;
        // Is there anything more left to encode?
        if (n === 0) {
            // We are done encoding, finish the run.
            result += BASE64_CHARS[digit];
            break;
        }
        else {
            // There is still more encode, so add the digit and the continuation bit.
            result += BASE64_CHARS[0x20 + digit];
        }
    }
    return result;
}
export class TokenIterator {
    constructor(string) {
        _TokenIterator_string.set(this, void 0);
        _TokenIterator_position.set(this, void 0);
        __classPrivateFieldSet(this, _TokenIterator_string, string, "f");
        __classPrivateFieldSet(this, _TokenIterator_position, 0, "f");
    }
    nextChar() {
        var _a, _b;
        return __classPrivateFieldGet(this, _TokenIterator_string, "f").charAt((__classPrivateFieldSet(this, _TokenIterator_position, (_b = __classPrivateFieldGet(this, _TokenIterator_position, "f"), _a = _b++, _b), "f"), _a));
    }
    /** Returns the unicode value of the next character and advances the iterator  */
    nextCharCode() {
        var _a, _b;
        return __classPrivateFieldGet(this, _TokenIterator_string, "f").charCodeAt((__classPrivateFieldSet(this, _TokenIterator_position, (_b = __classPrivateFieldGet(this, _TokenIterator_position, "f"), _a = _b++, _b), "f"), _a));
    }
    peek() {
        return __classPrivateFieldGet(this, _TokenIterator_string, "f").charAt(__classPrivateFieldGet(this, _TokenIterator_position, "f"));
    }
    hasNext() {
        return __classPrivateFieldGet(this, _TokenIterator_position, "f") < __classPrivateFieldGet(this, _TokenIterator_string, "f").length;
    }
    nextSignedVLQ() {
        let result = this.nextUnsignedVLQ();
        // Fix the sign.
        const negative = result & 1;
        result >>>= 1;
        return negative ? -result : result;
    }
    nextUnsignedVLQ() {
        let result = 0;
        let shift = 0;
        let digit = 0;
        do {
            const charCode = this.nextCharCode();
            digit = BASE64_CODES[charCode];
            result += (digit & VLQ_BASE_MASK) << shift;
            shift += VLQ_BASE_SHIFT;
        } while (digit & VLQ_CONTINUATION_MASK);
        return result;
    }
    currentChar() {
        return __classPrivateFieldGet(this, _TokenIterator_string, "f").charAt(__classPrivateFieldGet(this, _TokenIterator_position, "f") - 1);
    }
}
_TokenIterator_string = new WeakMap(), _TokenIterator_position = new WeakMap();
//# sourceMappingURL=vlq.js.map