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
var _SyncSection_instances, _SyncSection_shadow, _SyncSection_syncInfo, _SyncSection_syncSetting, _SyncSection_render;
import '../../../ui/components/chrome_link/chrome_link.js';
import '../../../ui/components/settings/settings.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../ui/lit/lit.js';
import syncSectionStyles from './syncSection.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Text shown to the user in the Settings UI. 'This setting' refers
     * to a checkbox that is disabled.
     */
    syncDisabled: 'To turn this setting on, you must enable Chrome sync.',
    /**
     * @description Text shown to the user in the Settings UI. 'This setting' refers
     * to a checkbox that is disabled.
     */
    preferencesSyncDisabled: 'To turn this setting on, you must first enable settings sync in Chrome.',
    /**
     * @description Label for a link that take the user to the "Sync" section of the
     * chrome settings. The link is shown in the DevTools Settings UI.
     */
    settings: 'Go to Settings',
    /**
     * @description Label for the account email address. Shown in the DevTools Settings UI in
     * front of the email address currently used for Chrome Sync.
     */
    signedIn: 'Signed into Chrome as:',
};
const str_ = i18n.i18n.registerUIStrings('panels/settings/components/SyncSection.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class SyncSection extends HTMLElement {
    constructor() {
        super(...arguments);
        _SyncSection_instances.add(this);
        _SyncSection_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _SyncSection_syncInfo.set(this, { isSyncActive: false });
        _SyncSection_syncSetting.set(this, void 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _SyncSection_syncInfo, data.syncInfo, "f");
        __classPrivateFieldSet(this, _SyncSection_syncSetting, data.syncSetting, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SyncSection_instances, "m", _SyncSection_render));
    }
}
_SyncSection_shadow = new WeakMap(), _SyncSection_syncInfo = new WeakMap(), _SyncSection_syncSetting = new WeakMap(), _SyncSection_instances = new WeakSet(), _SyncSection_render = function _SyncSection_render() {
    if (!__classPrivateFieldGet(this, _SyncSection_syncSetting, "f")) {
        throw new Error('SyncSection not properly initialized');
    }
    // TODO: this should not probably happen in render, instead, the setting
    // should be disabled.
    const checkboxDisabled = !__classPrivateFieldGet(this, _SyncSection_syncInfo, "f").isSyncActive || !__classPrivateFieldGet(this, _SyncSection_syncInfo, "f").arePreferencesSynced;
    __classPrivateFieldGet(this, _SyncSection_syncSetting, "f")?.setDisabled(checkboxDisabled);
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    Lit.render(html `
      <style>${syncSectionStyles}</style>
      <fieldset>
        ${renderAccountInfoOrWarning(__classPrivateFieldGet(this, _SyncSection_syncInfo, "f"))}
        <setting-checkbox .data=${{ setting: __classPrivateFieldGet(this, _SyncSection_syncSetting, "f") }}>
        </setting-checkbox>
      </fieldset>
    `, __classPrivateFieldGet(this, _SyncSection_shadow, "f"), { host: this });
    // clang-format on
};
/* x-link doesn't work with custom click/keydown handlers */
function renderAccountInfoOrWarning(syncInfo) {
    if (!syncInfo.isSyncActive) {
        const link = 'chrome://settings/syncSetup';
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
      <span class="warning">
        ${i18nString(UIStrings.syncDisabled)}
        <devtools-chrome-link .href=${link}>${i18nString(UIStrings.settings)}</devtools-chrome-link>
      </span>`;
        // clang-format on
    }
    if (!syncInfo.arePreferencesSynced) {
        const link = 'chrome://settings/syncSetup/advanced';
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
      <span class="warning">
        ${i18nString(UIStrings.preferencesSyncDisabled)}
        <devtools-chrome-link .href=${link}>${i18nString(UIStrings.settings)}</devtools-chrome-link>
      </span>`;
        // clang-format on
    }
    return html `
    <div class="account-info">
      <img src="data:image/png;base64, ${syncInfo.accountImage}" alt="Account avatar" />
      <div class="account-email">
        <span>${i18nString(UIStrings.signedIn)}</span>
        <span>${syncInfo.accountEmail}</span>
      </div>
    </div>`;
}
customElements.define('devtools-sync-section', SyncSection);
//# sourceMappingURL=SyncSection.js.map