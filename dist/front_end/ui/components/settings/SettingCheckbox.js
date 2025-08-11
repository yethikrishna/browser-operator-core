// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _SettingCheckbox_instances, _SettingCheckbox_shadow, _SettingCheckbox_setting, _SettingCheckbox_changeListenerDescriptor, _SettingCheckbox_textOverride, _SettingCheckbox_render, _SettingCheckbox_checkboxChanged;
import './SettingDeprecationWarning.js';
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Lit from '../../lit/lit.js';
import * as VisualLogging from '../../visual_logging/visual_logging.js';
import * as Buttons from '../buttons/buttons.js';
import * as Input from '../input/input.js';
import settingCheckboxStyles from './settingCheckbox.css.js';
const { html, Directives: { ifDefined } } = Lit;
const UIStrings = {
    /**
     *@description Text that is usually a hyperlink to more documentation
     */
    learnMore: 'Learn more',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/settings/SettingCheckbox.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
/**
 * A simple checkbox that is backed by a boolean setting.
 */
export class SettingCheckbox extends HTMLElement {
    constructor() {
        super(...arguments);
        _SettingCheckbox_instances.add(this);
        _SettingCheckbox_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _SettingCheckbox_setting.set(this, void 0);
        _SettingCheckbox_changeListenerDescriptor.set(this, void 0);
        _SettingCheckbox_textOverride.set(this, void 0);
    }
    set data(data) {
        if (__classPrivateFieldGet(this, _SettingCheckbox_changeListenerDescriptor, "f") && __classPrivateFieldGet(this, _SettingCheckbox_setting, "f")) {
            __classPrivateFieldGet(this, _SettingCheckbox_setting, "f").removeChangeListener(__classPrivateFieldGet(this, _SettingCheckbox_changeListenerDescriptor, "f").listener);
        }
        __classPrivateFieldSet(this, _SettingCheckbox_setting, data.setting, "f");
        __classPrivateFieldSet(this, _SettingCheckbox_textOverride, data.textOverride, "f");
        __classPrivateFieldSet(this, _SettingCheckbox_changeListenerDescriptor, __classPrivateFieldGet(this, _SettingCheckbox_setting, "f").addChangeListener(() => {
            __classPrivateFieldGet(this, _SettingCheckbox_instances, "m", _SettingCheckbox_render).call(this);
        }), "f");
        __classPrivateFieldGet(this, _SettingCheckbox_instances, "m", _SettingCheckbox_render).call(this);
    }
    icon() {
        if (!__classPrivateFieldGet(this, _SettingCheckbox_setting, "f")) {
            return undefined;
        }
        if (__classPrivateFieldGet(this, _SettingCheckbox_setting, "f").deprecation) {
            return html `<devtools-setting-deprecation-warning .data=${__classPrivateFieldGet(this, _SettingCheckbox_setting, "f").deprecation}></devtools-setting-deprecation-warning>`;
        }
        const learnMore = __classPrivateFieldGet(this, _SettingCheckbox_setting, "f").learnMore();
        if (learnMore && learnMore.url) {
            const url = learnMore.url;
            const data = {
                iconName: 'help',
                variant: "icon" /* Buttons.Button.Variant.ICON */,
                size: "SMALL" /* Buttons.Button.Size.SMALL */,
                jslogContext: `${__classPrivateFieldGet(this, _SettingCheckbox_setting, "f").name}-documentation`,
                title: i18nString(UIStrings.learnMore),
            };
            const handleClick = (event) => {
                Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(url);
                event.consume();
            };
            return html `<devtools-button
                    class=learn-more
                    @click=${handleClick}
                    .data=${data}></devtools-button>`;
        }
        return undefined;
    }
}
_SettingCheckbox_shadow = new WeakMap(), _SettingCheckbox_setting = new WeakMap(), _SettingCheckbox_changeListenerDescriptor = new WeakMap(), _SettingCheckbox_textOverride = new WeakMap(), _SettingCheckbox_instances = new WeakSet(), _SettingCheckbox_render = function _SettingCheckbox_render() {
    if (!__classPrivateFieldGet(this, _SettingCheckbox_setting, "f")) {
        throw new Error('No "Setting" object provided for rendering');
    }
    const icon = this.icon();
    const title = `${__classPrivateFieldGet(this, _SettingCheckbox_setting, "f").learnMore() ? __classPrivateFieldGet(this, _SettingCheckbox_setting, "f").learnMore()?.tooltip() : ''}`;
    const disabledReasons = __classPrivateFieldGet(this, _SettingCheckbox_setting, "f").disabledReasons();
    const reason = disabledReasons.length ?
        html `
      <devtools-button class="disabled-reason" .iconName=${'info'} .variant=${"icon" /* Buttons.Button.Variant.ICON */} .size=${"SMALL" /* Buttons.Button.Size.SMALL */} title=${ifDefined(disabledReasons.join('\n'))} @click=${onclick}></devtools-button>
    ` :
        Lit.nothing;
    Lit.render(html `
      <style>${Input.checkboxStyles}</style>
      <style>${settingCheckboxStyles}</style>
      <p>
        <label title=${title}>
          <input
            type="checkbox"
            .checked=${disabledReasons.length ? false : __classPrivateFieldGet(this, _SettingCheckbox_setting, "f").get()}
            ?disabled=${__classPrivateFieldGet(this, _SettingCheckbox_setting, "f").disabled()}
            @change=${__classPrivateFieldGet(this, _SettingCheckbox_instances, "m", _SettingCheckbox_checkboxChanged)}
            jslog=${VisualLogging.toggle().track({ click: true }).context(__classPrivateFieldGet(this, _SettingCheckbox_setting, "f").name)}
            aria-label=${__classPrivateFieldGet(this, _SettingCheckbox_setting, "f").title()}
          />
          ${__classPrivateFieldGet(this, _SettingCheckbox_textOverride, "f") || __classPrivateFieldGet(this, _SettingCheckbox_setting, "f").title()}${reason}
        </label>
        ${icon}
      </p>`, __classPrivateFieldGet(this, _SettingCheckbox_shadow, "f"), { host: this });
}, _SettingCheckbox_checkboxChanged = function _SettingCheckbox_checkboxChanged(e) {
    __classPrivateFieldGet(this, _SettingCheckbox_setting, "f")?.set(e.target.checked);
    this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: false,
    }));
};
customElements.define('setting-checkbox', SettingCheckbox);
//# sourceMappingURL=SettingCheckbox.js.map