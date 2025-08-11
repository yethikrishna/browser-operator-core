// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _ElementsPanelLink_instances, _ElementsPanelLink_shadow, _ElementsPanelLink_onElementRevealIconClick, _ElementsPanelLink_onElementRevealIconMouseEnter, _ElementsPanelLink_onElementRevealIconMouseLeave, _ElementsPanelLink_update, _ElementsPanelLink_render;
import { html, render } from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import elementsPanelLinkStyles from './elementsPanelLink.css.js';
export class ElementsPanelLink extends HTMLElement {
    constructor() {
        super(...arguments);
        _ElementsPanelLink_instances.add(this);
        _ElementsPanelLink_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ElementsPanelLink_onElementRevealIconClick.set(this, () => { });
        _ElementsPanelLink_onElementRevealIconMouseEnter.set(this, () => { });
        _ElementsPanelLink_onElementRevealIconMouseLeave.set(this, () => { });
    }
    set data(data) {
        __classPrivateFieldSet(this, _ElementsPanelLink_onElementRevealIconClick, data.onElementRevealIconClick, "f");
        __classPrivateFieldSet(this, _ElementsPanelLink_onElementRevealIconMouseEnter, data.onElementRevealIconMouseEnter, "f");
        __classPrivateFieldSet(this, _ElementsPanelLink_onElementRevealIconMouseLeave, data.onElementRevealIconMouseLeave, "f");
        __classPrivateFieldGet(this, _ElementsPanelLink_instances, "m", _ElementsPanelLink_update).call(this);
    }
}
_ElementsPanelLink_shadow = new WeakMap(), _ElementsPanelLink_onElementRevealIconClick = new WeakMap(), _ElementsPanelLink_onElementRevealIconMouseEnter = new WeakMap(), _ElementsPanelLink_onElementRevealIconMouseLeave = new WeakMap(), _ElementsPanelLink_instances = new WeakSet(), _ElementsPanelLink_update = function _ElementsPanelLink_update() {
    __classPrivateFieldGet(this, _ElementsPanelLink_instances, "m", _ElementsPanelLink_render).call(this);
}, _ElementsPanelLink_render = function _ElementsPanelLink_render() {
    // clang-format off
    render(html `
      <style>${elementsPanelLinkStyles}</style>
      <span
        class="element-reveal-icon"
        jslog=${VisualLogging.link('elements-panel').track({ click: true })}
        @click=${__classPrivateFieldGet(this, _ElementsPanelLink_onElementRevealIconClick, "f")}
        @mouseenter=${__classPrivateFieldGet(this, _ElementsPanelLink_onElementRevealIconMouseEnter, "f")}
        @mouseleave=${__classPrivateFieldGet(this, _ElementsPanelLink_onElementRevealIconMouseLeave, "f")}></span>
      `, __classPrivateFieldGet(this, _ElementsPanelLink_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-elements-panel-link', ElementsPanelLink);
//# sourceMappingURL=ElementsPanelLink.js.map