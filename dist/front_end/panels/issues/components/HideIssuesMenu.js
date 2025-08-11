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
var _HideIssuesMenu_instances, _HideIssuesMenu_shadow, _HideIssuesMenu_menuItemLabel, _HideIssuesMenu_menuItemAction, _HideIssuesMenu_render;
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as UI from '../../../ui/legacy/legacy.js';
import { html, render } from '../../../ui/lit/lit.js';
import hideIssuesMenuStyles from './hideIssuesMenu.css.js';
const UIStrings = {
    /**
     *@description Title for the tooltip of the (3 dots) Hide Issues menu icon.
     */
    tooltipTitle: 'Hide issues',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/components/HideIssuesMenu.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class HideIssuesMenu extends HTMLElement {
    constructor() {
        super(...arguments);
        _HideIssuesMenu_instances.add(this);
        _HideIssuesMenu_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _HideIssuesMenu_menuItemLabel.set(this, Common.UIString.LocalizedEmptyString);
        _HideIssuesMenu_menuItemAction.set(this, () => { });
    }
    set data(data) {
        __classPrivateFieldSet(this, _HideIssuesMenu_menuItemLabel, data.menuItemLabel, "f");
        __classPrivateFieldSet(this, _HideIssuesMenu_menuItemAction, data.menuItemAction, "f");
        __classPrivateFieldGet(this, _HideIssuesMenu_instances, "m", _HideIssuesMenu_render).call(this);
    }
    onMenuOpen(event) {
        event.stopPropagation();
        const buttonElement = __classPrivateFieldGet(this, _HideIssuesMenu_shadow, "f").querySelector('devtools-button');
        const contextMenu = new UI.ContextMenu.ContextMenu(event, {
            x: buttonElement?.getBoundingClientRect().left,
            y: buttonElement?.getBoundingClientRect().bottom,
        });
        contextMenu.headerSection().appendItem(__classPrivateFieldGet(this, _HideIssuesMenu_menuItemLabel, "f"), () => __classPrivateFieldGet(this, _HideIssuesMenu_menuItemAction, "f").call(this), { jslogContext: 'toggle-similar-issues' });
        void contextMenu.show();
    }
    onKeydown(event) {
        if (event.key === 'Enter' || event.key === 'Space') {
            // Make sure we don't propagate 'Enter' or 'Space' key events to parents,
            // so that these get turned into 'click' events properly.
            event.stopImmediatePropagation();
        }
    }
}
_HideIssuesMenu_shadow = new WeakMap(), _HideIssuesMenu_menuItemLabel = new WeakMap(), _HideIssuesMenu_menuItemAction = new WeakMap(), _HideIssuesMenu_instances = new WeakSet(), _HideIssuesMenu_render = function _HideIssuesMenu_render() {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
    <style>${hideIssuesMenuStyles}</style>
    <devtools-button
      .data=${{ variant: "icon" /* Buttons.Button.Variant.ICON */, iconName: 'dots-vertical', title: i18nString(UIStrings.tooltipTitle) }}
      .jslogContext=${'hide-issues'}
      class="hide-issues-menu-btn"
      @click=${this.onMenuOpen}
      @keydown=${this.onKeydown}></devtools-button>
    `, __classPrivateFieldGet(this, _HideIssuesMenu_shadow, "f"), { host: this });
};
customElements.define('devtools-hide-issues-menu', HideIssuesMenu);
//# sourceMappingURL=HideIssuesMenu.js.map