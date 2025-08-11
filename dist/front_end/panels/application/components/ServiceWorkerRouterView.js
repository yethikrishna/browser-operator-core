// Copyright (c) 2023 The Chromium Authors. All rights reserved.
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
var _ServiceWorkerRouterView_instances, _ServiceWorkerRouterView_shadow, _ServiceWorkerRouterView_rules, _ServiceWorkerRouterView_render, _ServiceWorkerRouterView_renderRouterRule;
import * as LegacyWrapper from '../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as Lit from '../../../ui/lit/lit.js';
import serviceWorkerRouterViewStyles from './serviceWorkerRouterView.css.js';
const { html, render } = Lit;
export class ServiceWorkerRouterView extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super(...arguments);
        _ServiceWorkerRouterView_instances.add(this);
        _ServiceWorkerRouterView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ServiceWorkerRouterView_rules.set(this, []);
    }
    update(rules) {
        __classPrivateFieldSet(this, _ServiceWorkerRouterView_rules, rules, "f");
        if (__classPrivateFieldGet(this, _ServiceWorkerRouterView_rules, "f").length > 0) {
            __classPrivateFieldGet(this, _ServiceWorkerRouterView_instances, "m", _ServiceWorkerRouterView_render).call(this);
        }
    }
}
_ServiceWorkerRouterView_shadow = new WeakMap(), _ServiceWorkerRouterView_rules = new WeakMap(), _ServiceWorkerRouterView_instances = new WeakSet(), _ServiceWorkerRouterView_render = function _ServiceWorkerRouterView_render() {
    // clang-format off
    render(html `
      <style>${serviceWorkerRouterViewStyles}</style>
      <ul class="router-rules">
        ${__classPrivateFieldGet(this, _ServiceWorkerRouterView_rules, "f").map(__classPrivateFieldGet(this, _ServiceWorkerRouterView_instances, "m", _ServiceWorkerRouterView_renderRouterRule))}
      </ul>
    `, __classPrivateFieldGet(this, _ServiceWorkerRouterView_shadow, "f"), { host: this });
    // clang-format on
}, _ServiceWorkerRouterView_renderRouterRule = function _ServiceWorkerRouterView_renderRouterRule(rule) {
    return html `
      <li class="router-rule">
        <div class="rule-id">Rule ${rule.id}</div>
        <ul class="item">
          <li class="condition">
            <div class="rule-type">Condition</div>
            <div class="rule-value">${rule.condition}</div>
          </li>
          <li class="source">
            <div class="rule-type">Source</div>
            <div class="rule-value">${rule.source}</div>
          </li>
        </ul>
      </li>
    `;
};
customElements.define('devtools-service-worker-router-view', ServiceWorkerRouterView);
//# sourceMappingURL=ServiceWorkerRouterView.js.map