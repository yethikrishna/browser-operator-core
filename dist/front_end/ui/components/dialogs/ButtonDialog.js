// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _ButtonDialog_instances, _ButtonDialog_shadow, _ButtonDialog_dialog, _ButtonDialog_showButton, _ButtonDialog_data, _ButtonDialog_showDialog, _ButtonDialog_closeDialog, _ButtonDialog_render;
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import { html, render } from '../../../ui/lit/lit.js';
import buttonDialogStyles from './buttonDialog.css.js';
export class ButtonDialog extends HTMLElement {
    constructor() {
        super(...arguments);
        _ButtonDialog_instances.add(this);
        _ButtonDialog_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ButtonDialog_dialog.set(this, null);
        _ButtonDialog_showButton.set(this, null);
        _ButtonDialog_data.set(this, null);
    }
    set data(data) {
        __classPrivateFieldSet(this, _ButtonDialog_data, data, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ButtonDialog_instances, "m", _ButtonDialog_render));
    }
}
_ButtonDialog_shadow = new WeakMap(), _ButtonDialog_dialog = new WeakMap(), _ButtonDialog_showButton = new WeakMap(), _ButtonDialog_data = new WeakMap(), _ButtonDialog_instances = new WeakSet(), _ButtonDialog_showDialog = function _ButtonDialog_showDialog() {
    if (!__classPrivateFieldGet(this, _ButtonDialog_dialog, "f")) {
        throw new Error('Dialog not found');
    }
    void __classPrivateFieldGet(this, _ButtonDialog_dialog, "f").setDialogVisible(true);
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ButtonDialog_instances, "m", _ButtonDialog_render));
}, _ButtonDialog_closeDialog = function _ButtonDialog_closeDialog(evt) {
    if (!__classPrivateFieldGet(this, _ButtonDialog_dialog, "f")) {
        throw new Error('Dialog not found');
    }
    void __classPrivateFieldGet(this, _ButtonDialog_dialog, "f").setDialogVisible(false);
    if (evt) {
        evt.stopImmediatePropagation();
    }
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ButtonDialog_instances, "m", _ButtonDialog_render));
}, _ButtonDialog_render = function _ButtonDialog_render() {
    if (!__classPrivateFieldGet(this, _ButtonDialog_data, "f")) {
        throw new Error('ButtonDialog.data is not set');
    }
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('Button dialog render was not scheduled');
    }
    // clang-format off
    render(html `
      <style>${buttonDialogStyles}</style>
      <devtools-button
        @click=${__classPrivateFieldGet(this, _ButtonDialog_instances, "m", _ButtonDialog_showDialog)}
        on-render=${ComponentHelpers.Directives.nodeRenderedCallback(node => {
        __classPrivateFieldSet(this, _ButtonDialog_showButton, node, "f");
    })}
        .data=${{
        variant: __classPrivateFieldGet(this, _ButtonDialog_data, "f").variant,
        iconName: __classPrivateFieldGet(this, _ButtonDialog_data, "f").iconName,
        disabled: __classPrivateFieldGet(this, _ButtonDialog_data, "f").disabled,
        title: __classPrivateFieldGet(this, _ButtonDialog_data, "f").iconTitle,
        jslogContext: __classPrivateFieldGet(this, _ButtonDialog_data, "f").jslogContext,
    }}
      ></devtools-button>
      <devtools-dialog
        @clickoutsidedialog=${__classPrivateFieldGet(this, _ButtonDialog_instances, "m", _ButtonDialog_closeDialog)}
        .origin=${() => {
        if (!__classPrivateFieldGet(this, _ButtonDialog_showButton, "f")) {
            throw new Error('Button not found');
        }
        return __classPrivateFieldGet(this, _ButtonDialog_showButton, "f");
    }}
        .position=${__classPrivateFieldGet(this, _ButtonDialog_data, "f").position ?? "bottom" /* DialogVerticalPosition.BOTTOM */}
        .horizontalAlignment=${__classPrivateFieldGet(this, _ButtonDialog_data, "f").horizontalAlignment ?? "right" /* DialogHorizontalAlignment.RIGHT */}
        .closeOnESC=${__classPrivateFieldGet(this, _ButtonDialog_data, "f").closeOnESC ?? false}
        .closeOnScroll=${__classPrivateFieldGet(this, _ButtonDialog_data, "f").closeOnScroll ?? false}
        .closeButton=${__classPrivateFieldGet(this, _ButtonDialog_data, "f").closeButton ?? false}
        .dialogTitle=${__classPrivateFieldGet(this, _ButtonDialog_data, "f").dialogTitle}
        .jslogContext=${__classPrivateFieldGet(this, _ButtonDialog_data, "f").jslogContext ?? ''}
        on-render=${ComponentHelpers.Directives.nodeRenderedCallback(node => {
        __classPrivateFieldSet(this, _ButtonDialog_dialog, node, "f");
    })}
      >
        <slot></slot>
      </devtools-dialog>
      `, __classPrivateFieldGet(this, _ButtonDialog_shadow, "f"), { host: this });
    // clang-format on
    if (__classPrivateFieldGet(this, _ButtonDialog_data, "f").openOnRender) {
        __classPrivateFieldGet(this, _ButtonDialog_instances, "m", _ButtonDialog_showDialog).call(this);
        __classPrivateFieldGet(this, _ButtonDialog_data, "f").openOnRender = false;
    }
};
customElements.define('devtools-button-dialog', ButtonDialog);
//# sourceMappingURL=ButtonDialog.js.map