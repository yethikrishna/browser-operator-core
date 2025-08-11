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
var _CSSFontFace_fontFamily, _CSSFontFace_fontVariationAxes, _CSSFontFace_fontVariationAxesByTag, _CSSFontFace_src, _CSSFontFace_fontDisplay;
export class CSSFontFace {
    constructor(payload) {
        _CSSFontFace_fontFamily.set(this, void 0);
        _CSSFontFace_fontVariationAxes.set(this, void 0);
        _CSSFontFace_fontVariationAxesByTag.set(this, new Map());
        _CSSFontFace_src.set(this, void 0);
        _CSSFontFace_fontDisplay.set(this, void 0);
        __classPrivateFieldSet(this, _CSSFontFace_fontFamily, payload.fontFamily, "f");
        __classPrivateFieldSet(this, _CSSFontFace_fontVariationAxes, payload.fontVariationAxes || [], "f");
        __classPrivateFieldSet(this, _CSSFontFace_src, payload.src, "f");
        __classPrivateFieldSet(this, _CSSFontFace_fontDisplay, payload.fontDisplay, "f");
        for (const axis of __classPrivateFieldGet(this, _CSSFontFace_fontVariationAxes, "f")) {
            __classPrivateFieldGet(this, _CSSFontFace_fontVariationAxesByTag, "f").set(axis.tag, axis);
        }
    }
    getFontFamily() {
        return __classPrivateFieldGet(this, _CSSFontFace_fontFamily, "f");
    }
    getSrc() {
        return __classPrivateFieldGet(this, _CSSFontFace_src, "f");
    }
    getFontDisplay() {
        return __classPrivateFieldGet(this, _CSSFontFace_fontDisplay, "f");
    }
    getVariationAxisByTag(tag) {
        return __classPrivateFieldGet(this, _CSSFontFace_fontVariationAxesByTag, "f").get(tag);
    }
}
_CSSFontFace_fontFamily = new WeakMap(), _CSSFontFace_fontVariationAxes = new WeakMap(), _CSSFontFace_fontVariationAxesByTag = new WeakMap(), _CSSFontFace_src = new WeakMap(), _CSSFontFace_fontDisplay = new WeakMap();
//# sourceMappingURL=CSSFontFace.js.map