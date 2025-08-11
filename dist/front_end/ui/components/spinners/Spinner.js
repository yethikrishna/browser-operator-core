// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Spinner_shadow;
import { html, render } from '../../lit/lit.js';
import spinnerStyles from './spinner.css.js';
export class Spinner extends HTMLElement {
    constructor() {
        super(...arguments);
        _Spinner_shadow.set(this, this.attachShadow({ mode: 'open' }));
    }
    connectedCallback() {
        // The radius of the circles are set to 2.75rem as per implementation
        // of indeterminate progress indicator in
        // https://github.com/material-components/material-components-web/tree/master/packages/mdc-circular-progress.
        // Changing the value of the radius will cause errors in animation.
        // clang-format off
        render(html `
      <style>${spinnerStyles}</style>
      <div class="indeterminate-spinner">
        <div class="left-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50%" cy="50%" r="2.75rem"></circle></svg>
        </div>
        <div class="center-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50%" cy="50%" r="2.75rem"></circle></svg>
        </div>
        <div class="right-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50%" cy="50%" r="2.75rem"></circle></svg>
        </div>
      </div>
    `, __classPrivateFieldGet(this, _Spinner_shadow, "f"), { host: this });
        // clang-format on
    }
}
_Spinner_shadow = new WeakMap();
customElements.define('devtools-spinner', Spinner);
//# sourceMappingURL=Spinner.js.map