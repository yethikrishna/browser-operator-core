// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _ElementsTreeExpandButton_instances, _ElementsTreeExpandButton_shadow, _ElementsTreeExpandButton_clickHandler, _ElementsTreeExpandButton_update, _ElementsTreeExpandButton_render;
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import { html, render } from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import elementsTreeExpandButtonStyles from './elementsTreeExpandButton.css.js';
const UIStrings = {
    /**
     *@description Aria label for a button expanding collapsed subtree
     */
    expand: 'Expand',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/components/ElementsTreeExpandButton.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ElementsTreeExpandButton extends HTMLElement {
    constructor() {
        super(...arguments);
        _ElementsTreeExpandButton_instances.add(this);
        _ElementsTreeExpandButton_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ElementsTreeExpandButton_clickHandler.set(this, () => { });
    }
    set data(data) {
        __classPrivateFieldSet(this, _ElementsTreeExpandButton_clickHandler, data.clickHandler, "f");
        __classPrivateFieldGet(this, _ElementsTreeExpandButton_instances, "m", _ElementsTreeExpandButton_update).call(this);
    }
}
_ElementsTreeExpandButton_shadow = new WeakMap(), _ElementsTreeExpandButton_clickHandler = new WeakMap(), _ElementsTreeExpandButton_instances = new WeakSet(), _ElementsTreeExpandButton_update = function _ElementsTreeExpandButton_update() {
    __classPrivateFieldGet(this, _ElementsTreeExpandButton_instances, "m", _ElementsTreeExpandButton_render).call(this);
}, _ElementsTreeExpandButton_render = function _ElementsTreeExpandButton_render() {
    // clang-format off
    // This button's innerText will be tested by e2e test and blink layout tests.
    // It can't have any other characters like '\n' or space, otherwise it will break tests.
    render(html `
      <style>${elementsTreeExpandButtonStyles}</style>
      <button
        class="expand-button"
        tabindex="-1"
        aria-label=${i18nString(UIStrings.expand)}
        jslog=${VisualLogging.action('expand').track({ click: true })}
        @click=${__classPrivateFieldGet(this, _ElementsTreeExpandButton_clickHandler, "f")}><devtools-icon name="dots-horizontal"></devtools-icon></button>`, __classPrivateFieldGet(this, _ElementsTreeExpandButton_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-elements-tree-expand-button', ElementsTreeExpandButton);
//# sourceMappingURL=ElementsTreeExpandButton.js.map