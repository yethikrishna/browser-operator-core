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
var _PreviewToggle_instances, _PreviewToggle_shadow, _PreviewToggle_name, _PreviewToggle_helperText, _PreviewToggle_feedbackURL, _PreviewToggle_learnMoreURL, _PreviewToggle_experiment, _PreviewToggle_onChangeCallback, _PreviewToggle_render, _PreviewToggle_checkboxChanged;
import '../../../ui/legacy/legacy.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Root from '../../../core/root/root.js';
import { html, nothing, render } from '../../../ui/lit/lit.js';
import previewToggleStyles from './previewToggle.css.js';
const UIStrings = {
    /**
     *@description Link text the user can click to provide feedback to the team.
     */
    previewTextFeedbackLink: 'Send us your feedback.',
    /**
     *@description Link text the user can click to provide feedback to the team.
     */
    shortFeedbackLink: 'Send feedback',
    /**
     *@description Link text the user can click to see documentation.
     */
    learnMoreLink: 'Learn More',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/panel_feedback/PreviewToggle.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class PreviewToggle extends HTMLElement {
    constructor() {
        super(...arguments);
        _PreviewToggle_instances.add(this);
        _PreviewToggle_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _PreviewToggle_name.set(this, '');
        _PreviewToggle_helperText.set(this, null);
        _PreviewToggle_feedbackURL.set(this, null);
        _PreviewToggle_learnMoreURL.set(this, void 0);
        _PreviewToggle_experiment.set(this, '');
        _PreviewToggle_onChangeCallback.set(this, void 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _PreviewToggle_name, data.name, "f");
        __classPrivateFieldSet(this, _PreviewToggle_helperText, data.helperText, "f");
        __classPrivateFieldSet(this, _PreviewToggle_feedbackURL, data.feedbackURL, "f");
        __classPrivateFieldSet(this, _PreviewToggle_learnMoreURL, data.learnMoreURL, "f");
        __classPrivateFieldSet(this, _PreviewToggle_experiment, data.experiment, "f");
        __classPrivateFieldSet(this, _PreviewToggle_onChangeCallback, data.onChangeCallback, "f");
        __classPrivateFieldGet(this, _PreviewToggle_instances, "m", _PreviewToggle_render).call(this);
    }
}
_PreviewToggle_shadow = new WeakMap(), _PreviewToggle_name = new WeakMap(), _PreviewToggle_helperText = new WeakMap(), _PreviewToggle_feedbackURL = new WeakMap(), _PreviewToggle_learnMoreURL = new WeakMap(), _PreviewToggle_experiment = new WeakMap(), _PreviewToggle_onChangeCallback = new WeakMap(), _PreviewToggle_instances = new WeakSet(), _PreviewToggle_render = function _PreviewToggle_render() {
    const checked = Root.Runtime.experiments.isEnabled(__classPrivateFieldGet(this, _PreviewToggle_experiment, "f"));
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${previewToggleStyles}</style>
      <div class="container">
          <devtools-checkbox
            ?checked=${checked}
            @change=${__classPrivateFieldGet(this, _PreviewToggle_instances, "m", _PreviewToggle_checkboxChanged)}
            aria-label=${__classPrivateFieldGet(this, _PreviewToggle_name, "f")} />
            <devtools-icon .data=${{
        iconName: 'experiment',
        width: '16px',
        height: '16px',
        color: 'var(--icon-default)',
    }}>
          </devtools-icon>${__classPrivateFieldGet(this, _PreviewToggle_name, "f")}
          </devtools-checkbox>
        <div class="spacer"></div>
        ${__classPrivateFieldGet(this, _PreviewToggle_feedbackURL, "f") && !__classPrivateFieldGet(this, _PreviewToggle_helperText, "f")
        ? html `<div class="feedback"><x-link class="x-link" href=${__classPrivateFieldGet(this, _PreviewToggle_feedbackURL, "f")}>${i18nString(UIStrings.shortFeedbackLink)}</x-link></div>`
        : nothing}
        ${__classPrivateFieldGet(this, _PreviewToggle_learnMoreURL, "f")
        ? html `<div class="learn-more"><x-link class="x-link" href=${__classPrivateFieldGet(this, _PreviewToggle_learnMoreURL, "f")}>${i18nString(UIStrings.learnMoreLink)}</x-link></div>`
        : nothing}
        <div class="helper">
          ${__classPrivateFieldGet(this, _PreviewToggle_helperText, "f") && __classPrivateFieldGet(this, _PreviewToggle_feedbackURL, "f")
        ? html `<p>${__classPrivateFieldGet(this, _PreviewToggle_helperText, "f")} <x-link class="x-link" href=${__classPrivateFieldGet(this, _PreviewToggle_feedbackURL, "f")}>${i18nString(UIStrings.previewTextFeedbackLink)}</x-link></p>`
        : nothing}
        </div>
      </div>`, __classPrivateFieldGet(this, _PreviewToggle_shadow, "f"), {
        host: this,
    });
    // clang-format on
}, _PreviewToggle_checkboxChanged = function _PreviewToggle_checkboxChanged(event) {
    const checked = event.target.checked;
    Root.Runtime.experiments.setEnabled(__classPrivateFieldGet(this, _PreviewToggle_experiment, "f"), checked);
    __classPrivateFieldGet(this, _PreviewToggle_onChangeCallback, "f")?.call(this, checked);
};
customElements.define('devtools-preview-toggle', PreviewToggle);
//# sourceMappingURL=PreviewToggle.js.map