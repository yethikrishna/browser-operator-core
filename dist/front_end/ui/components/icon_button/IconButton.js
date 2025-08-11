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
var _IconButton_instances, _IconButton_shadow, _IconButton_clickHandler, _IconButton_groups, _IconButton_compact, _IconButton_leadingText, _IconButton_trailingText, _IconButton_accessibleName, _IconButton_onClickHandler, _IconButton_render;
import './Icon.js';
import * as Lit from '../../lit/lit.js';
import iconButtonStyles from './iconButton.css.js';
const { html } = Lit;
export class IconButton extends HTMLElement {
    constructor() {
        super(...arguments);
        _IconButton_instances.add(this);
        _IconButton_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _IconButton_clickHandler.set(this, undefined);
        _IconButton_groups.set(this, []);
        _IconButton_compact.set(this, false);
        _IconButton_leadingText.set(this, '');
        _IconButton_trailingText.set(this, '');
        _IconButton_accessibleName.set(this, void 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _IconButton_groups, data.groups.map(group => ({ ...group })), "f"); // Ensure we make a deep copy.
        __classPrivateFieldSet(this, _IconButton_clickHandler, data.clickHandler, "f");
        __classPrivateFieldSet(this, _IconButton_trailingText, data.trailingText ?? '', "f");
        __classPrivateFieldSet(this, _IconButton_leadingText, data.leadingText ?? '', "f");
        __classPrivateFieldSet(this, _IconButton_accessibleName, data.accessibleName, "f");
        __classPrivateFieldSet(this, _IconButton_compact, Boolean(data.compact), "f");
        __classPrivateFieldGet(this, _IconButton_instances, "m", _IconButton_render).call(this);
    }
    get data() {
        return {
            groups: __classPrivateFieldGet(this, _IconButton_groups, "f").map(group => ({ ...group })), // Ensure we make a deep copy.
            accessibleName: __classPrivateFieldGet(this, _IconButton_accessibleName, "f"),
            clickHandler: __classPrivateFieldGet(this, _IconButton_clickHandler, "f"),
            leadingText: __classPrivateFieldGet(this, _IconButton_leadingText, "f"),
            trailingText: __classPrivateFieldGet(this, _IconButton_trailingText, "f"),
            compact: __classPrivateFieldGet(this, _IconButton_compact, "f"),
        };
    }
}
_IconButton_shadow = new WeakMap(), _IconButton_clickHandler = new WeakMap(), _IconButton_groups = new WeakMap(), _IconButton_compact = new WeakMap(), _IconButton_leadingText = new WeakMap(), _IconButton_trailingText = new WeakMap(), _IconButton_accessibleName = new WeakMap(), _IconButton_instances = new WeakSet(), _IconButton_onClickHandler = function _IconButton_onClickHandler(event) {
    if (__classPrivateFieldGet(this, _IconButton_clickHandler, "f")) {
        event.preventDefault();
        __classPrivateFieldGet(this, _IconButton_clickHandler, "f").call(this);
    }
}, _IconButton_render = function _IconButton_render() {
    const buttonClasses = Lit.Directives.classMap({
        'icon-button': true,
        'with-click-handler': Boolean(__classPrivateFieldGet(this, _IconButton_clickHandler, "f")),
        compact: __classPrivateFieldGet(this, _IconButton_compact, "f"),
    });
    const filteredGroups = __classPrivateFieldGet(this, _IconButton_groups, "f").filter(counter => counter.text !== undefined)
        .filter((_, index) => __classPrivateFieldGet(this, _IconButton_compact, "f") ? index === 0 : true);
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    Lit.render(html `
      <style>${iconButtonStyles}</style>
      <button class=${buttonClasses} @click=${__classPrivateFieldGet(this, _IconButton_instances, "m", _IconButton_onClickHandler)} aria-label=${Lit.Directives.ifDefined(__classPrivateFieldGet(this, _IconButton_accessibleName, "f"))}>
      ${(!__classPrivateFieldGet(this, _IconButton_compact, "f") && __classPrivateFieldGet(this, _IconButton_leadingText, "f")) ? html `<span class="icon-button-title">${__classPrivateFieldGet(this, _IconButton_leadingText, "f")}</span>` : Lit.nothing}
      ${filteredGroups.map(counter => html `
      <devtools-icon class="status-icon"
      .data=${{ iconName: counter.iconName, color: counter.iconColor, width: counter.iconWidth || '1.5ex', height: counter.iconHeight || '1.5ex' }}>
      </devtools-icon>
      ${__classPrivateFieldGet(this, _IconButton_compact, "f") ? html `<!-- Force line-height for this element --><span>&#8203;</span>` : Lit.nothing}
      <span class="icon-button-title">${counter.text}</span>`)}
      </button>
      ${(!__classPrivateFieldGet(this, _IconButton_compact, "f") && __classPrivateFieldGet(this, _IconButton_trailingText, "f")) ? html `<span class="icon-button-title">${__classPrivateFieldGet(this, _IconButton_trailingText, "f")}</span>` : Lit.nothing}
    `, __classPrivateFieldGet(this, _IconButton_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('icon-button', IconButton);
//# sourceMappingURL=IconButton.js.map