// Copyright (c) 2021 The Chromium Authors. All rights reserved.
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
var _CSSQuery_instances, _CSSQuery_shadow, _CSSQuery_queryPrefix, _CSSQuery_queryName, _CSSQuery_queryText, _CSSQuery_onQueryTextClick, _CSSQuery_jslogContext, _CSSQuery_render;
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import cssQueryStyles from './cssQuery.css.js';
const { render, html } = Lit;
export class CSSQuery extends HTMLElement {
    constructor() {
        super(...arguments);
        _CSSQuery_instances.add(this);
        _CSSQuery_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _CSSQuery_queryPrefix.set(this, '');
        _CSSQuery_queryName.set(this, void 0);
        _CSSQuery_queryText.set(this, '');
        _CSSQuery_onQueryTextClick.set(this, void 0);
        _CSSQuery_jslogContext.set(this, void 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _CSSQuery_queryPrefix, data.queryPrefix, "f");
        __classPrivateFieldSet(this, _CSSQuery_queryName, data.queryName, "f");
        __classPrivateFieldSet(this, _CSSQuery_queryText, data.queryText, "f");
        __classPrivateFieldSet(this, _CSSQuery_onQueryTextClick, data.onQueryTextClick, "f");
        __classPrivateFieldSet(this, _CSSQuery_jslogContext, data.jslogContext, "f");
        __classPrivateFieldGet(this, _CSSQuery_instances, "m", _CSSQuery_render).call(this);
    }
}
_CSSQuery_shadow = new WeakMap(), _CSSQuery_queryPrefix = new WeakMap(), _CSSQuery_queryName = new WeakMap(), _CSSQuery_queryText = new WeakMap(), _CSSQuery_onQueryTextClick = new WeakMap(), _CSSQuery_jslogContext = new WeakMap(), _CSSQuery_instances = new WeakSet(), _CSSQuery_render = function _CSSQuery_render() {
    const queryClasses = Lit.Directives.classMap({
        query: true,
        editable: Boolean(__classPrivateFieldGet(this, _CSSQuery_onQueryTextClick, "f")),
    });
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    const queryText = html `
      <span class="query-text" @click=${__classPrivateFieldGet(this, _CSSQuery_onQueryTextClick, "f")}>${__classPrivateFieldGet(this, _CSSQuery_queryText, "f")}</span>
    `;
    render(html `
        <style>${cssQueryStyles}</style>
        <style>${UI.inspectorCommonStyles}</style>
        <div class=${queryClasses} jslog=${VisualLogging.cssRuleHeader(__classPrivateFieldGet(this, _CSSQuery_jslogContext, "f")).track({ click: true, change: true })}>
          <slot name="indent"></slot>
          ${__classPrivateFieldGet(this, _CSSQuery_queryPrefix, "f") ? html `<span>${__classPrivateFieldGet(this, _CSSQuery_queryPrefix, "f") + ' '}</span>` : Lit.nothing}
          ${__classPrivateFieldGet(this, _CSSQuery_queryName, "f") ? html `<span>${__classPrivateFieldGet(this, _CSSQuery_queryName, "f") + ' '}</span>` : Lit.nothing}
          ${queryText} {
        </div>`, __classPrivateFieldGet(this, _CSSQuery_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-css-query', CSSQuery);
//# sourceMappingURL=CSSQuery.js.map