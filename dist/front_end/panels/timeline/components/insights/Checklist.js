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
var _Checklist_instances, _Checklist_shadow, _Checklist_checklist, _Checklist_getIcon, _Checklist_render;
/**
 * @fileoverview A list of pass/fail conditions for an insight.
 */
import '../../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as ComponentHelpers from '../../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../../ui/lit/lit.js';
import checklistStyles from './checklist.css.js';
const UIStrings = {
    /**
     *@description Text for a screen-reader label to tell the user that the icon represents a successful insight check
     *@example {Server response time} PH1
     */
    successAriaLabel: 'Insight check passed: {PH1}',
    /**
     *@description Text for a screen-reader label to tell the user that the icon represents an unsuccessful insight check
     *@example {Server response time} PH1
     */
    failedAriaLabel: 'Insight check failed: {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/insights/Checklist.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { html } = Lit;
export class Checklist extends HTMLElement {
    constructor() {
        super(...arguments);
        _Checklist_instances.add(this);
        _Checklist_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _Checklist_checklist.set(this, void 0);
    }
    set checklist(checklist) {
        __classPrivateFieldSet(this, _Checklist_checklist, checklist, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Checklist_instances, "m", _Checklist_render));
    }
    connectedCallback() {
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Checklist_instances, "m", _Checklist_render));
    }
}
_Checklist_shadow = new WeakMap(), _Checklist_checklist = new WeakMap(), _Checklist_instances = new WeakSet(), _Checklist_getIcon = function _Checklist_getIcon(check) {
    const icon = check.value ? 'check-circle' : 'clear';
    const ariaLabel = check.value ? i18nString(UIStrings.successAriaLabel, { PH1: check.label }) :
        i18nString(UIStrings.failedAriaLabel, { PH1: check.label });
    return html `
        <devtools-icon
          aria-label=${ariaLabel}
          name=${icon}
          class=${check.value ? 'check-passed' : 'check-failed'}
        ></devtools-icon>
      `;
}, _Checklist_render = async function _Checklist_render() {
    if (!__classPrivateFieldGet(this, _Checklist_checklist, "f")) {
        return;
    }
    Lit.render(html `
          <style>${checklistStyles}</style>
          <ul>
            ${Object.values(__classPrivateFieldGet(this, _Checklist_checklist, "f")).map(check => html `<li>
                ${__classPrivateFieldGet(this, _Checklist_instances, "m", _Checklist_getIcon).call(this, check)}
                <span data-checklist-label>${check.label}</span>
            </li>`)}
          </ul>`, __classPrivateFieldGet(this, _Checklist_shadow, "f"), { host: this });
};
customElements.define('devtools-performance-checklist', Checklist);
//# sourceMappingURL=Checklist.js.map