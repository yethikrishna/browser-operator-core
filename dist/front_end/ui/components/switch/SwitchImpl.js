// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _Switch_instances, _Switch_shadow, _Switch_checked, _Switch_disabled, _Switch_jslogContext, _Switch_handleChange, _Switch_render;
import { html, nothing, render } from '../../lit/lit.js';
import * as VisualLogging from '../../visual_logging/visual_logging.js';
import switchStyles from './switch.css.js';
export class SwitchChangeEvent extends Event {
    constructor(checked) {
        super(SwitchChangeEvent.eventName);
        this.checked = checked;
    }
}
SwitchChangeEvent.eventName = 'switchchange';
export class Switch extends HTMLElement {
    constructor() {
        super(...arguments);
        _Switch_instances.add(this);
        _Switch_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _Switch_checked.set(this, false);
        _Switch_disabled.set(this, false);
        _Switch_jslogContext.set(this, '');
        _Switch_handleChange.set(this, (ev) => {
            __classPrivateFieldSet(this, _Switch_checked, ev.target.checked, "f");
            this.dispatchEvent(new SwitchChangeEvent(__classPrivateFieldGet(this, _Switch_checked, "f")));
        });
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _Switch_instances, "m", _Switch_render).call(this);
    }
    set checked(isChecked) {
        __classPrivateFieldSet(this, _Switch_checked, isChecked, "f");
        __classPrivateFieldGet(this, _Switch_instances, "m", _Switch_render).call(this);
    }
    get checked() {
        return __classPrivateFieldGet(this, _Switch_checked, "f");
    }
    set disabled(isDisabled) {
        __classPrivateFieldSet(this, _Switch_disabled, isDisabled, "f");
        __classPrivateFieldGet(this, _Switch_instances, "m", _Switch_render).call(this);
    }
    get disabled() {
        return __classPrivateFieldGet(this, _Switch_disabled, "f");
    }
    get jslogContext() {
        return __classPrivateFieldGet(this, _Switch_jslogContext, "f");
    }
    set jslogContext(jslogContext) {
        __classPrivateFieldSet(this, _Switch_jslogContext, jslogContext, "f");
        __classPrivateFieldGet(this, _Switch_instances, "m", _Switch_render).call(this);
    }
}
_Switch_shadow = new WeakMap(), _Switch_checked = new WeakMap(), _Switch_disabled = new WeakMap(), _Switch_jslogContext = new WeakMap(), _Switch_handleChange = new WeakMap(), _Switch_instances = new WeakSet(), _Switch_render = function _Switch_render() {
    const jslog = __classPrivateFieldGet(this, _Switch_jslogContext, "f") && VisualLogging.toggle(__classPrivateFieldGet(this, _Switch_jslogContext, "f")).track({ change: true });
    /* eslint-disable rulesdir/inject-checkbox-styles */
    // clang-format off
    render(html `
    <style>${switchStyles}</style>
    <label role="button" jslog=${jslog || nothing}>
      <input type="checkbox"
        @change=${__classPrivateFieldGet(this, _Switch_handleChange, "f")}
        ?disabled=${__classPrivateFieldGet(this, _Switch_disabled, "f")}
        .checked=${__classPrivateFieldGet(this, _Switch_checked, "f")}
      >
      <span class="slider" @click=${(ev) => ev.stopPropagation()}></span>
    </label>
    `, __classPrivateFieldGet(this, _Switch_shadow, "f"), { host: this });
    // clang-format on
    /* eslint-enable rulesdir/inject-checkbox-styles */
};
customElements.define('devtools-switch', Switch);
//# sourceMappingURL=SwitchImpl.js.map