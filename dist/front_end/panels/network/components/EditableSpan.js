// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _EditableSpan_instances, _EditableSpan_shadow, _EditableSpan_value, _EditableSpan_onKeyDown, _EditableSpan_onInput, _EditableSpan_selectAllText, _EditableSpan_render;
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import { html, render } from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import editableSpanStyles from './EditableSpan.css.js';
export class EditableSpan extends HTMLElement {
    constructor() {
        super(...arguments);
        _EditableSpan_instances.add(this);
        _EditableSpan_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _EditableSpan_value.set(this, '');
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _EditableSpan_shadow, "f").addEventListener('focusin', __classPrivateFieldGet(this, _EditableSpan_instances, "m", _EditableSpan_selectAllText).bind(this));
        __classPrivateFieldGet(this, _EditableSpan_shadow, "f").addEventListener('keydown', __classPrivateFieldGet(this, _EditableSpan_instances, "m", _EditableSpan_onKeyDown).bind(this));
        __classPrivateFieldGet(this, _EditableSpan_shadow, "f").addEventListener('input', __classPrivateFieldGet(this, _EditableSpan_instances, "m", _EditableSpan_onInput).bind(this));
    }
    set data(data) {
        __classPrivateFieldSet(this, _EditableSpan_value, data.value, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _EditableSpan_instances, "m", _EditableSpan_render));
    }
    get value() {
        return __classPrivateFieldGet(this, _EditableSpan_shadow, "f").querySelector('span')?.innerText || '';
    }
    set value(value) {
        __classPrivateFieldSet(this, _EditableSpan_value, value, "f");
        const span = __classPrivateFieldGet(this, _EditableSpan_shadow, "f").querySelector('span');
        if (span) {
            span.innerText = value;
        }
    }
    focus() {
        requestAnimationFrame(() => {
            const span = __classPrivateFieldGet(this, _EditableSpan_shadow, "f").querySelector('.editable');
            span?.focus();
        });
    }
}
_EditableSpan_shadow = new WeakMap(), _EditableSpan_value = new WeakMap(), _EditableSpan_instances = new WeakSet(), _EditableSpan_onKeyDown = function _EditableSpan_onKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        event.target?.blur();
    }
}, _EditableSpan_onInput = function _EditableSpan_onInput(event) {
    __classPrivateFieldSet(this, _EditableSpan_value, event.target.innerText, "f");
}, _EditableSpan_selectAllText = function _EditableSpan_selectAllText(event) {
    const target = event.target;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection?.removeAllRanges();
    selection?.addRange(range);
}, _EditableSpan_render = function _EditableSpan_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('HeaderSectionRow render was not scheduled');
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${editableSpanStyles}</style>
      <span
        contenteditable="plaintext-only"
        class="editable"
        tabindex="0"
        .innerText=${__classPrivateFieldGet(this, _EditableSpan_value, "f")}
        jslog=${VisualLogging.value('header-editor').track({ change: true, keydown: 'Enter|Escape' })}
      </span>`, __classPrivateFieldGet(this, _EditableSpan_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-editable-span', EditableSpan);
//# sourceMappingURL=EditableSpan.js.map