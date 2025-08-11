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
var _Linkifier_instances, _Linkifier_shadow, _Linkifier_url, _Linkifier_lineNumber, _Linkifier_columnNumber, _Linkifier_linkText, _Linkifier_title, _Linkifier_onLinkActivation, _Linkifier_render;
import * as Platform from '../../../core/platform/platform.js';
import * as Lit from '../../lit/lit.js';
import * as RenderCoordinator from '../render_coordinator/render_coordinator.js';
import linkifierImplStyles from './linkifierImpl.css.js';
import * as LinkifierUtils from './LinkifierUtils.js';
const { html } = Lit;
export class LinkifierClick extends Event {
    constructor(data) {
        super(LinkifierClick.eventName, {
            bubbles: true,
            composed: true,
        });
        this.data = data;
        this.data = data;
    }
}
LinkifierClick.eventName = 'linkifieractivated';
export class Linkifier extends HTMLElement {
    constructor() {
        super(...arguments);
        _Linkifier_instances.add(this);
        _Linkifier_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _Linkifier_url.set(this, Platform.DevToolsPath.EmptyUrlString);
        _Linkifier_lineNumber.set(this, void 0);
        _Linkifier_columnNumber.set(this, void 0);
        _Linkifier_linkText.set(this, void 0);
        _Linkifier_title.set(this, void 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _Linkifier_url, data.url, "f");
        __classPrivateFieldSet(this, _Linkifier_lineNumber, data.lineNumber, "f");
        __classPrivateFieldSet(this, _Linkifier_columnNumber, data.columnNumber, "f");
        __classPrivateFieldSet(this, _Linkifier_linkText, data.linkText, "f");
        __classPrivateFieldSet(this, _Linkifier_title, data.title, "f");
        if (!__classPrivateFieldGet(this, _Linkifier_url, "f")) {
            throw new Error('Cannot construct a Linkifier without providing a valid string URL.');
        }
        void __classPrivateFieldGet(this, _Linkifier_instances, "m", _Linkifier_render).call(this);
    }
    cloneNode(deep) {
        const node = super.cloneNode(deep);
        node.data = {
            url: __classPrivateFieldGet(this, _Linkifier_url, "f"),
            lineNumber: __classPrivateFieldGet(this, _Linkifier_lineNumber, "f"),
            columnNumber: __classPrivateFieldGet(this, _Linkifier_columnNumber, "f"),
            linkText: __classPrivateFieldGet(this, _Linkifier_linkText, "f"),
            title: __classPrivateFieldGet(this, _Linkifier_title, "f")
        };
        return node;
    }
}
_Linkifier_shadow = new WeakMap(), _Linkifier_url = new WeakMap(), _Linkifier_lineNumber = new WeakMap(), _Linkifier_columnNumber = new WeakMap(), _Linkifier_linkText = new WeakMap(), _Linkifier_title = new WeakMap(), _Linkifier_instances = new WeakSet(), _Linkifier_onLinkActivation = function _Linkifier_onLinkActivation(event) {
    event.preventDefault();
    const linkifierClickEvent = new LinkifierClick({
        url: __classPrivateFieldGet(this, _Linkifier_url, "f"),
        lineNumber: __classPrivateFieldGet(this, _Linkifier_lineNumber, "f"),
        columnNumber: __classPrivateFieldGet(this, _Linkifier_columnNumber, "f"),
    });
    this.dispatchEvent(linkifierClickEvent);
}, _Linkifier_render = async function _Linkifier_render() {
    const linkText = __classPrivateFieldGet(this, _Linkifier_linkText, "f") ?? LinkifierUtils.linkText(__classPrivateFieldGet(this, _Linkifier_url, "f"), __classPrivateFieldGet(this, _Linkifier_lineNumber, "f"));
    // Disabled until https://crbug.com/1079231 is fixed.
    await RenderCoordinator.write(() => {
        // clang-format off
        // eslint-disable-next-line rulesdir/no-a-tags-in-lit
        Lit.render(html `
        <style>${linkifierImplStyles}</style>
        <a class="link" href=${__classPrivateFieldGet(this, _Linkifier_url, "f")} @click=${__classPrivateFieldGet(this, _Linkifier_instances, "m", _Linkifier_onLinkActivation)} title=${Lit.Directives.ifDefined(__classPrivateFieldGet(this, _Linkifier_title, "f"))}>
          <slot>${linkText}</slot>
        </a>`, __classPrivateFieldGet(this, _Linkifier_shadow, "f"), { host: this });
        // clang-format on
    });
};
customElements.define('devtools-linkifier', Linkifier);
//# sourceMappingURL=LinkifierImpl.js.map