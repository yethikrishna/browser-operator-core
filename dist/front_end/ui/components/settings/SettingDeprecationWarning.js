// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SettingDeprecationWarning_instances, _SettingDeprecationWarning_shadow, _SettingDeprecationWarning_render;
import '../icon_button/icon_button.js';
import * as Common from '../../../core/common/common.js';
import * as Lit from '../../lit/lit.js';
import settingDeprecationWarningStyles from './settingDeprecationWarning.css.js';
const { html } = Lit;
export class SettingDeprecationWarning extends HTMLElement {
    constructor() {
        super(...arguments);
        _SettingDeprecationWarning_instances.add(this);
        _SettingDeprecationWarning_shadow.set(this, this.attachShadow({ mode: 'open' }));
    }
    set data(data) {
        __classPrivateFieldGet(this, _SettingDeprecationWarning_instances, "m", _SettingDeprecationWarning_render).call(this, data);
    }
}
_SettingDeprecationWarning_shadow = new WeakMap(), _SettingDeprecationWarning_instances = new WeakSet(), _SettingDeprecationWarning_render = function _SettingDeprecationWarning_render({ disabled, warning, experiment }) {
    const iconData = { iconName: 'info', color: 'var(--icon-default)', width: '16px' };
    const classes = { clickable: false };
    let onclick;
    if (disabled && experiment) {
        classes.clickable = true;
        onclick = () => {
            void Common.Revealer.reveal(experiment);
        };
    }
    Lit.render(html `
        <style>${settingDeprecationWarningStyles}</style>
        <devtools-icon class=${Lit.Directives.classMap(classes)} .data=${iconData} title=${warning} @click=${onclick}></devtools-icon>`, __classPrivateFieldGet(this, _SettingDeprecationWarning_shadow, "f"), { host: this });
};
customElements.define('devtools-setting-deprecation-warning', SettingDeprecationWarning);
//# sourceMappingURL=SettingDeprecationWarning.js.map