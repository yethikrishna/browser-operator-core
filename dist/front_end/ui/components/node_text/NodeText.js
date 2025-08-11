// Copyright (c) 2020 The Chromium Authors. All rights reserved.
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
var _NodeText_instances, _NodeText_shadow, _NodeText_nodeTitle, _NodeText_nodeId, _NodeText_nodeClasses, _NodeText_render;
import * as Lit from '../../../ui/lit/lit.js';
import nodeTextStyles from './nodeText.css.js';
const { render, html } = Lit;
export class NodeText extends HTMLElement {
    constructor() {
        super(...arguments);
        _NodeText_instances.add(this);
        _NodeText_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _NodeText_nodeTitle.set(this, '');
        _NodeText_nodeId.set(this, '');
        _NodeText_nodeClasses.set(this, []);
    }
    set data(data) {
        __classPrivateFieldSet(this, _NodeText_nodeTitle, data.nodeTitle, "f");
        __classPrivateFieldSet(this, _NodeText_nodeId, data.nodeId, "f");
        __classPrivateFieldSet(this, _NodeText_nodeClasses, data.nodeClasses, "f");
        __classPrivateFieldGet(this, _NodeText_instances, "m", _NodeText_render).call(this);
    }
}
_NodeText_shadow = new WeakMap(), _NodeText_nodeTitle = new WeakMap(), _NodeText_nodeId = new WeakMap(), _NodeText_nodeClasses = new WeakMap(), _NodeText_instances = new WeakSet(), _NodeText_render = function _NodeText_render() {
    const hasId = Boolean(__classPrivateFieldGet(this, _NodeText_nodeId, "f"));
    const hasNodeClasses = Boolean(__classPrivateFieldGet(this, _NodeText_nodeClasses, "f") && __classPrivateFieldGet(this, _NodeText_nodeClasses, "f").length > 0);
    const parts = [
        html `<span class="node-label-name">${__classPrivateFieldGet(this, _NodeText_nodeTitle, "f")}</span>`,
    ];
    if (__classPrivateFieldGet(this, _NodeText_nodeId, "f")) {
        const classes = Lit.Directives.classMap({
            'node-label-id': true,
            'node-multiple-descriptors': hasNodeClasses,
        });
        parts.push(html `<span class=${classes}>#${CSS.escape(__classPrivateFieldGet(this, _NodeText_nodeId, "f"))}</span>`);
    }
    if (__classPrivateFieldGet(this, _NodeText_nodeClasses, "f") && __classPrivateFieldGet(this, _NodeText_nodeClasses, "f").length > 0) {
        const text = __classPrivateFieldGet(this, _NodeText_nodeClasses, "f").map(c => `.${CSS.escape(c)}`).join('');
        const classes = Lit.Directives.classMap({
            'node-label-class': true,
            'node-multiple-descriptors': hasId,
        });
        parts.push(html `<span class=${classes}>${text}</span>`);
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${nodeTextStyles}</style>
      ${parts}
    `, __classPrivateFieldGet(this, _NodeText_shadow, "f"), {
        host: this,
    });
    // clang-format on
};
customElements.define('devtools-node-text', NodeText);
//# sourceMappingURL=NodeText.js.map