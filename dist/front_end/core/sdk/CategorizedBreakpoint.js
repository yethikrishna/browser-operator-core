// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _CategorizedBreakpoint_category;
export var Category;
(function (Category) {
    Category["ANIMATION"] = "animation";
    Category["AUCTION_WORKLET"] = "auction-worklet";
    Category["CANVAS"] = "canvas";
    Category["CLIPBOARD"] = "clipboard";
    Category["CONTROL"] = "control";
    Category["DEVICE"] = "device";
    Category["DOM_MUTATION"] = "dom-mutation";
    Category["DRAG_DROP"] = "drag-drop";
    Category["GEOLOCATION"] = "geolocation";
    Category["KEYBOARD"] = "keyboard";
    Category["LOAD"] = "load";
    Category["MEDIA"] = "media";
    Category["MOUSE"] = "mouse";
    Category["NOTIFICATION"] = "notification";
    Category["PARSE"] = "parse";
    Category["PICTURE_IN_PICTURE"] = "picture-in-picture";
    Category["POINTER"] = "pointer";
    Category["SCRIPT"] = "script";
    Category["SHARED_STORAGE_WORKLET"] = "shared-storage-worklet";
    Category["TIMER"] = "timer";
    Category["TOUCH"] = "touch";
    Category["TRUSTED_TYPE_VIOLATION"] = "trusted-type-violation";
    Category["WEB_AUDIO"] = "web-audio";
    Category["WINDOW"] = "window";
    Category["WORKER"] = "worker";
    Category["XHR"] = "xhr";
})(Category || (Category = {}));
export class CategorizedBreakpoint {
    constructor(category, name) {
        _CategorizedBreakpoint_category.set(this, void 0);
        __classPrivateFieldSet(this, _CategorizedBreakpoint_category, category, "f");
        this.name = name;
        this.enabledInternal = false;
    }
    category() {
        return __classPrivateFieldGet(this, _CategorizedBreakpoint_category, "f");
    }
    enabled() {
        return this.enabledInternal;
    }
    setEnabled(enabled) {
        this.enabledInternal = enabled;
    }
}
_CategorizedBreakpoint_category = new WeakMap();
//# sourceMappingURL=CategorizedBreakpoint.js.map