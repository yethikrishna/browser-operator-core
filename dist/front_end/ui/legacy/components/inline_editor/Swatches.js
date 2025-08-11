// Copyright (c) 2015 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _CSSShadowSwatch_icon, _CSSShadowSwatch_model;
import '../../../components/icon_button/icon_button.js';
import { html, render } from '../../../lit/lit.js';
import cssShadowSwatchStyles from './cssShadowSwatch.css.js';
export class CSSShadowSwatch extends HTMLElement {
    constructor(model) {
        super();
        _CSSShadowSwatch_icon.set(this, void 0);
        _CSSShadowSwatch_model.set(this, void 0);
        __classPrivateFieldSet(this, _CSSShadowSwatch_model, model, "f");
        // clang-format off
        render(html `
        <style>${cssShadowSwatchStyles}</style>
        <devtools-icon tabindex=-1 name="shadow" class="shadow-swatch-icon"></devtools-icon>`, this, { host: this });
        // clang-format on
        __classPrivateFieldSet(this, _CSSShadowSwatch_icon, this.querySelector('devtools-icon'), "f");
    }
    model() {
        return __classPrivateFieldGet(this, _CSSShadowSwatch_model, "f");
    }
    iconElement() {
        return __classPrivateFieldGet(this, _CSSShadowSwatch_icon, "f");
    }
}
_CSSShadowSwatch_icon = new WeakMap(), _CSSShadowSwatch_model = new WeakMap();
customElements.define('css-shadow-swatch', CSSShadowSwatch);
//# sourceMappingURL=Swatches.js.map