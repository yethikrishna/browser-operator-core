// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _ExpandableList_instances, _ExpandableList_shadow, _ExpandableList_expanded, _ExpandableList_rows, _ExpandableList_title, _ExpandableList_onArrowClick, _ExpandableList_render;
import * as Lit from '../../lit/lit.js';
import * as VisualLogging from '../../visual_logging/visual_logging.js';
import expandableListStyles from './expandableList.css.js';
const { html, Directives: { ifDefined } } = Lit;
export class ExpandableList extends HTMLElement {
    constructor() {
        super(...arguments);
        _ExpandableList_instances.add(this);
        _ExpandableList_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ExpandableList_expanded.set(this, false);
        _ExpandableList_rows.set(this, []);
        _ExpandableList_title.set(this, void 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _ExpandableList_rows, data.rows, "f");
        __classPrivateFieldSet(this, _ExpandableList_title, data.title, "f");
        __classPrivateFieldGet(this, _ExpandableList_instances, "m", _ExpandableList_render).call(this);
    }
}
_ExpandableList_shadow = new WeakMap(), _ExpandableList_expanded = new WeakMap(), _ExpandableList_rows = new WeakMap(), _ExpandableList_title = new WeakMap(), _ExpandableList_instances = new WeakSet(), _ExpandableList_onArrowClick = function _ExpandableList_onArrowClick() {
    __classPrivateFieldSet(this, _ExpandableList_expanded, !__classPrivateFieldGet(this, _ExpandableList_expanded, "f"), "f");
    __classPrivateFieldGet(this, _ExpandableList_instances, "m", _ExpandableList_render).call(this);
}, _ExpandableList_render = function _ExpandableList_render() {
    if (__classPrivateFieldGet(this, _ExpandableList_rows, "f").length < 1) {
        return;
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    Lit.render(html `
      <style>${expandableListStyles}</style>
      <div class="expandable-list-container">
        <div>
          ${__classPrivateFieldGet(this, _ExpandableList_rows, "f").length > 1 ?
        html `
              <button title='${ifDefined(__classPrivateFieldGet(this, _ExpandableList_title, "f"))}' aria-label='${ifDefined(__classPrivateFieldGet(this, _ExpandableList_title, "f"))}' aria-expanded=${__classPrivateFieldGet(this, _ExpandableList_expanded, "f") ? 'true' : 'false'} @click=${() => __classPrivateFieldGet(this, _ExpandableList_instances, "m", _ExpandableList_onArrowClick).call(this)} class="arrow-icon-button">
                <span class="arrow-icon ${__classPrivateFieldGet(this, _ExpandableList_expanded, "f") ? 'expanded' : ''}"
                jslog=${VisualLogging.expand().track({ click: true })}></span>
              </button>
            `
        : Lit.nothing}
        </div>
        <div class="expandable-list-items">
          ${__classPrivateFieldGet(this, _ExpandableList_rows, "f").filter((_, index) => (__classPrivateFieldGet(this, _ExpandableList_expanded, "f") || index === 0)).map(row => html `
            ${row}
          `)}
        </div>
      </div>
    `, __classPrivateFieldGet(this, _ExpandableList_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-expandable-list', ExpandableList);
//# sourceMappingURL=ExpandableList.js.map