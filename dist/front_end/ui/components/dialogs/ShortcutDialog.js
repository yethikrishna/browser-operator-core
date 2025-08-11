var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ShortcutDialog_instances, _ShortcutDialog_shadow, _ShortcutDialog_shortcuts, _ShortcutDialog_openOnRender, _ShortcutDialog_customTitle, _ShortcutDialog_prependedElement, _ShortcutDialog_renderRow, _ShortcutDialog_render;
// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './ButtonDialog.js';
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
import * as i18n from '../../../core/i18n/i18n.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import { html, nothing, render } from '../../../ui/lit/lit.js';
import shortcutDialogStyles from './shortcutDialog.css.js';
const UIStrings = {
    /**
     * @description Title of question mark button for the shortcuts dialog.
     */
    showShortcutTitle: 'Show shortcuts',
    /**
     * @description Title of the keyboard shortcuts help menu.
     */
    dialogTitle: 'Keyboard shortcuts',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/dialogs/ShortcutDialog.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ShortcutDialog extends HTMLElement {
    constructor() {
        super(...arguments);
        _ShortcutDialog_instances.add(this);
        _ShortcutDialog_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ShortcutDialog_shortcuts.set(this, []);
        _ShortcutDialog_openOnRender.set(this, false);
        _ShortcutDialog_customTitle.set(this, void 0);
        _ShortcutDialog_prependedElement.set(this, null);
    }
    get data() {
        return {
            shortcuts: __classPrivateFieldGet(this, _ShortcutDialog_shortcuts, "f"),
            open: __classPrivateFieldGet(this, _ShortcutDialog_openOnRender, "f"),
            customTitle: __classPrivateFieldGet(this, _ShortcutDialog_customTitle, "f"),
        };
    }
    set data(data) {
        __classPrivateFieldSet(this, _ShortcutDialog_shortcuts, data.shortcuts, "f");
        if (data.open) {
            __classPrivateFieldSet(this, _ShortcutDialog_openOnRender, data.open, "f");
        }
        if (data.customTitle) {
            __classPrivateFieldSet(this, _ShortcutDialog_customTitle, data.customTitle, "f");
        }
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ShortcutDialog_instances, "m", _ShortcutDialog_render));
    }
    prependElement(element) {
        __classPrivateFieldSet(this, _ShortcutDialog_prependedElement, element, "f");
    }
}
_ShortcutDialog_shadow = new WeakMap(), _ShortcutDialog_shortcuts = new WeakMap(), _ShortcutDialog_openOnRender = new WeakMap(), _ShortcutDialog_customTitle = new WeakMap(), _ShortcutDialog_prependedElement = new WeakMap(), _ShortcutDialog_instances = new WeakSet(), _ShortcutDialog_renderRow = function _ShortcutDialog_renderRow(row) {
    if (!Array.isArray(row)) {
        // If it's not an array it's a footnote, which is the easier case, so
        // render that and return.
        return html `<span class="footnote">${row.footnote}</span>`;
    }
    return html `${row.map(part => {
        if ('key' in part) {
            return html `<span class="keybinds-key">${part.key}</span>`;
        }
        return html `<span class="keybinds-join-text">${part.joinText}</span>`;
    })}
    `;
}, _ShortcutDialog_render = function _ShortcutDialog_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('Shortcut dialog render was not scheduled');
    }
    // clang-format off
    render(html `
      <style>${shortcutDialogStyles}</style>
      <devtools-button-dialog .data=${{
        openOnRender: __classPrivateFieldGet(this, _ShortcutDialog_openOnRender, "f"),
        closeButton: true,
        dialogTitle: __classPrivateFieldGet(this, _ShortcutDialog_customTitle, "f") ?? i18nString(UIStrings.dialogTitle),
        variant: "toolbar" /* Buttons.Button.Variant.TOOLBAR */,
        iconName: 'help',
        iconTitle: i18nString(UIStrings.showShortcutTitle),
    }}>
        <ul class="keybinds-list">
          ${(__classPrivateFieldGet(this, _ShortcutDialog_prependedElement, "f")) ? html `${__classPrivateFieldGet(this, _ShortcutDialog_prependedElement, "f")}` : nothing}
          ${__classPrivateFieldGet(this, _ShortcutDialog_shortcuts, "f").map(shortcut => html `
              <li class="keybinds-list-item">
                <div class="keybinds-list-title">${shortcut.title}</div>
                <div class="shortcuts-for-actions">
                  ${shortcut.rows.map(row => {
        return html `<div class="row-container">${__classPrivateFieldGet(this, _ShortcutDialog_instances, "m", _ShortcutDialog_renderRow).call(this, row)}</div>
                  `;
    })}
                </div>
              </li>`)}
        </ul>
      </devtools-button-dialog>
      `, __classPrivateFieldGet(this, _ShortcutDialog_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-shortcut-dialog', ShortcutDialog);
//# sourceMappingURL=ShortcutDialog.js.map