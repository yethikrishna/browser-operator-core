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
var _OverlayColorGenerator_colors, _OverlayColorGenerator_index;
import * as Common from '../common/common.js';
/**
 * Used to cycle through a list of predetermined #colors for the overlays.
 * This helps users differentiate between overlays when several are shown at the
 * same time.
 */
export class OverlayColorGenerator {
    constructor() {
        _OverlayColorGenerator_colors.set(this, void 0);
        _OverlayColorGenerator_index.set(this, void 0);
        const format = "rgba" /* Common.Color.Format.RGBA */;
        __classPrivateFieldSet(this, _OverlayColorGenerator_colors, [
            // F59794
            new Common.Color.Legacy([0.9607843137254902, 0.592156862745098, 0.5803921568627451, 1], format),
            // F0BF4C
            new Common.Color.Legacy([0.9411764705882353, 0.7490196078431373, 0.2980392156862745, 1], format),
            // D4ED31
            new Common.Color.Legacy([0.8313725490196079, 0.9294117647058824, 0.19215686274509805, 1], format),
            // 9EEB47
            new Common.Color.Legacy([0.6196078431372549, 0.9215686274509803, 0.2784313725490196, 1], format),
            // 5BD1D7
            new Common.Color.Legacy([0.3568627450980392, 0.8196078431372549, 0.8431372549019608, 1], format),
            // BCCEFB
            new Common.Color.Legacy([0.7372549019607844, 0.807843137254902, 0.984313725490196, 1], format),
            // C6BEEE
            new Common.Color.Legacy([0.7764705882352941, 0.7450980392156863, 0.9333333333333333, 1], format),
            // D094EA
            new Common.Color.Legacy([0.8156862745098039, 0.5803921568627451, 0.9176470588235294, 1], format),
            // EB94CF
            new Common.Color.Legacy([0.9215686274509803, 0.5803921568627451, 0.8117647058823529, 1], format),
        ], "f");
        __classPrivateFieldSet(this, _OverlayColorGenerator_index, 0, "f");
    }
    /**
     * Generate the next color in the spectrum
     */
    next() {
        var _a;
        const color = __classPrivateFieldGet(this, _OverlayColorGenerator_colors, "f")[__classPrivateFieldGet(this, _OverlayColorGenerator_index, "f")];
        __classPrivateFieldSet(this, _OverlayColorGenerator_index, (_a = __classPrivateFieldGet(this, _OverlayColorGenerator_index, "f"), _a++, _a), "f");
        if (__classPrivateFieldGet(this, _OverlayColorGenerator_index, "f") >= __classPrivateFieldGet(this, _OverlayColorGenerator_colors, "f").length) {
            __classPrivateFieldSet(this, _OverlayColorGenerator_index, 0, "f");
        }
        return color;
    }
}
_OverlayColorGenerator_colors = new WeakMap(), _OverlayColorGenerator_index = new WeakMap();
//# sourceMappingURL=OverlayColorGenerator.js.map