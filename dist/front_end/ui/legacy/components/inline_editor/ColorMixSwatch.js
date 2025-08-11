// Copyright (c) 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _ColorMixSwatch_instances, _ColorMixSwatch_icon, _ColorMixSwatch_render;
import * as Common from '../../../../core/common/common.js';
import * as Platform from '../../../../core/platform/platform.js';
import * as Lit from '../../../lit/lit.js';
import * as VisualLogging from '../../../visual_logging/visual_logging.js';
import colorMixSwatchStyles from './colorMixSwatch.css.js';
const { html, render, Directives: { ref } } = Lit;
export class ColorMixChangedEvent extends Event {
    constructor(text) {
        super(ColorMixChangedEvent.eventName, {});
        this.data = { text };
    }
}
ColorMixChangedEvent.eventName = 'colormixchanged';
export class ColorMixSwatch extends HTMLElement {
    constructor() {
        super(...arguments);
        _ColorMixSwatch_instances.add(this);
        this.shadow = this.attachShadow({ mode: 'open' });
        this.colorMixText = ''; // color-mix(in srgb, hotpink, white)
        this.firstColorText = ''; // hotpink
        this.secondColorText = ''; // white
        _ColorMixSwatch_icon.set(this, null);
    }
    mixedColor() {
        const colorText = __classPrivateFieldGet(this, _ColorMixSwatch_icon, "f")?.computedStyleMap().get('color')?.toString() ?? null;
        return colorText ? Common.Color.parse(colorText) : null;
    }
    setFirstColor(text) {
        // We need to replace `colorMixText` because it is the CSS for the
        // the middle section where we actually show the mixed colors.
        // So, when a color changed, we need to update colorMixText to
        // reflect the new color (not the old one).
        if (this.firstColorText) {
            this.colorMixText = this.colorMixText.replace(this.firstColorText, text);
        }
        this.firstColorText = text;
        this.dispatchEvent(new ColorMixChangedEvent(this.colorMixText));
        __classPrivateFieldGet(this, _ColorMixSwatch_instances, "m", _ColorMixSwatch_render).call(this);
    }
    setSecondColor(text) {
        // We need to replace from the last to handle the same colors case
        // i.e. replacing the second color of `color-mix(in srgb, red 50%, red 10%)`
        // to `blue` should result in `color-mix(in srgb, red 50%, blue 10%)`.
        if (this.secondColorText) {
            this.colorMixText = Platform.StringUtilities.replaceLast(this.colorMixText, this.secondColorText, text);
        }
        this.secondColorText = text;
        this.dispatchEvent(new ColorMixChangedEvent(this.colorMixText));
        __classPrivateFieldGet(this, _ColorMixSwatch_instances, "m", _ColorMixSwatch_render).call(this);
    }
    setColorMixText(text) {
        this.colorMixText = text;
        this.dispatchEvent(new ColorMixChangedEvent(this.colorMixText));
        __classPrivateFieldGet(this, _ColorMixSwatch_instances, "m", _ColorMixSwatch_render).call(this);
    }
    getText() {
        return this.colorMixText;
    }
}
_ColorMixSwatch_icon = new WeakMap(), _ColorMixSwatch_instances = new WeakSet(), _ColorMixSwatch_render = function _ColorMixSwatch_render() {
    if (!this.colorMixText || !this.firstColorText || !this.secondColorText) {
        render(this.colorMixText, this.shadow, { host: this });
        return;
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    // Note that we use a <slot> with a default value here to display the color text. Consumers of this component are
    // free to append any content to replace what is being shown here.
    // Note also that whitespace between nodes is removed on purpose to avoid pushing these elements apart. Do not
    // re-format the HTML code.
    render(html `<style>${colorMixSwatchStyles}</style><div class="swatch-icon"
      ${ref(e => { __classPrivateFieldSet(this, _ColorMixSwatch_icon, e, "f"); })}
      jslog=${VisualLogging.cssColorMix()}
      style="--color: ${this.colorMixText}">
        <span class="swatch swatch-left" id="swatch-1" style="--color: ${this.firstColorText}"></span>
        <span class="swatch swatch-right" id="swatch-2" style="--color: ${this.secondColorText}"></span>
        <span class="swatch swatch-mix" id="mix-result" style="--color: ${this.colorMixText}"></span></div>`, this.shadow, { host: this });
    // clang-format on
};
customElements.define('devtools-color-mix-swatch', ColorMixSwatch);
//# sourceMappingURL=ColorMixSwatch.js.map