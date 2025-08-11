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
var _CPUThrottlingSelector_instances, _CPUThrottlingSelector_shadow, _CPUThrottlingSelector_currentOption, _CPUThrottlingSelector_recommendedOption, _CPUThrottlingSelector_groups, _CPUThrottlingSelector_calibratedThrottlingSetting, _CPUThrottlingSelector_onOptionChange, _CPUThrottlingSelector_onCalibratedSettingChanged, _CPUThrottlingSelector_onMenuItemSelected, _CPUThrottlingSelector_onCalibrateClick, _CPUThrottlingSelector_resetGroups, _CPUThrottlingSelector_render;
import '../../../ui/components/icon_button/icon_button.js';
import '../../../ui/components/menus/menus.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as MobileThrottling from '../../mobile_throttling/mobile_throttling.js';
import cpuThrottlingSelectorStyles from './cpuThrottlingSelector.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Text label for a selection box showing which CPU throttling option is applied.
     * @example {No throttling} PH1
     */
    cpu: 'CPU: {PH1}',
    /**
     * @description Text label for a selection box showing which CPU throttling option is applied.
     * @example {No throttling} PH1
     */
    cpuThrottling: 'CPU throttling: {PH1}',
    /**
     * @description Text label for a selection box showing that a specific option is recommended.
     * @example {4x slowdown} PH1
     */
    recommendedThrottling: '{PH1} – recommended',
    /**
     * @description Text for why user should change a throttling setting.
     */
    recommendedThrottlingReason: 'Consider changing setting to simulate real user environments',
    /**
     * @description Text to prompt the user to run the CPU calibration process.
     */
    calibrate: 'Calibrate…',
    /**
     * @description Text to prompt the user to re-run the CPU calibration process.
     */
    recalibrate: 'Recalibrate…',
    /**
     * @description Label shown above a list of CPU calibration preset options.
     */
    labelCalibratedPresets: 'Calibrated presets',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/CPUThrottlingSelector.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class CPUThrottlingSelector extends HTMLElement {
    constructor() {
        super();
        _CPUThrottlingSelector_instances.add(this);
        _CPUThrottlingSelector_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _CPUThrottlingSelector_currentOption.set(this, void 0);
        _CPUThrottlingSelector_recommendedOption.set(this, null);
        _CPUThrottlingSelector_groups.set(this, []);
        _CPUThrottlingSelector_calibratedThrottlingSetting.set(this, void 0);
        _CPUThrottlingSelector_render.set(this, () => {
            let recommendedInfoEl;
            if (__classPrivateFieldGet(this, _CPUThrottlingSelector_recommendedOption, "f") && __classPrivateFieldGet(this, _CPUThrottlingSelector_currentOption, "f") === SDK.CPUThrottlingManager.NoThrottlingOption) {
                recommendedInfoEl = html `<devtools-icon
        title=${i18nString(UIStrings.recommendedThrottlingReason)}
        name=info></devtools-icon>`;
            }
            const selectionTitle = __classPrivateFieldGet(this, _CPUThrottlingSelector_currentOption, "f").title();
            const setting = __classPrivateFieldGet(this, _CPUThrottlingSelector_calibratedThrottlingSetting, "f").get();
            const hasCalibratedOnce = setting.low || setting.mid;
            const calibrationLabel = hasCalibratedOnce ? i18nString(UIStrings.recalibrate) : i18nString(UIStrings.calibrate);
            // clang-format off
            /* eslint-disable rulesdir/no-deprecated-component-usages */
            const output = html `
      <style>${cpuThrottlingSelectorStyles}</style>
      <devtools-select-menu
            @selectmenuselected=${__classPrivateFieldGet(this, _CPUThrottlingSelector_instances, "m", _CPUThrottlingSelector_onMenuItemSelected)}
            .showDivider=${true}
            .showArrow=${true}
            .sideButton=${false}
            .showSelectedItem=${true}
            .jslogContext=${'cpu-throttling'}
            .buttonTitle=${i18nString(UIStrings.cpu, { PH1: selectionTitle })}
            .title=${i18nString(UIStrings.cpuThrottling, { PH1: selectionTitle })}
          >
          ${__classPrivateFieldGet(this, _CPUThrottlingSelector_groups, "f").map(group => {
                return html `
              <devtools-menu-group .name=${group.name} .title=${group.name}>
                ${group.items.map(option => {
                    const title = option === __classPrivateFieldGet(this, _CPUThrottlingSelector_recommendedOption, "f") ? i18nString(UIStrings.recommendedThrottling, { PH1: option.title() }) : option.title();
                    const rate = option.rate();
                    return html `
                    <devtools-menu-item
                      .value=${option.calibratedDeviceType ?? rate}
                      .selected=${__classPrivateFieldGet(this, _CPUThrottlingSelector_currentOption, "f") === option}
                      .disabled=${rate === 0}
                      .title=${title}
                      jslog=${VisualLogging.item(option.jslogContext).track({ click: true })}
                    >
                      ${title}
                    </devtools-menu-item>
                  `;
                })}
                ${group.name === 'Calibrated presets' ? html `<devtools-menu-item
                  .value=${-1 /* This won't be displayed unless it has some value. */}
                  .title=${calibrationLabel}
                  jslog=${VisualLogging.action('cpu-throttling-selector-calibrate').track({ click: true })}
                  @click=${__classPrivateFieldGet(this, _CPUThrottlingSelector_instances, "m", _CPUThrottlingSelector_onCalibrateClick)}
                >
                  ${calibrationLabel}
                </devtools-menu-item>` : Lit.nothing}
              </devtools-menu-group>`;
            })}
      </devtools-select-menu>
      ${recommendedInfoEl}
    `;
            /* eslint-enable rulesdir/no-deprecated-component-usages */
            // clang-format on
            Lit.render(output, __classPrivateFieldGet(this, _CPUThrottlingSelector_shadow, "f"), { host: this });
        });
        __classPrivateFieldSet(this, _CPUThrottlingSelector_currentOption, SDK.CPUThrottlingManager.CPUThrottlingManager.instance().cpuThrottlingOption(), "f");
        __classPrivateFieldSet(this, _CPUThrottlingSelector_calibratedThrottlingSetting, Common.Settings.Settings.instance().createSetting('calibrated-cpu-throttling', {}, "Global" /* Common.Settings.SettingStorageType.GLOBAL */), "f");
        __classPrivateFieldGet(this, _CPUThrottlingSelector_instances, "m", _CPUThrottlingSelector_resetGroups).call(this);
        __classPrivateFieldGet(this, _CPUThrottlingSelector_render, "f").call(this);
    }
    set recommendedOption(recommendedOption) {
        __classPrivateFieldSet(this, _CPUThrottlingSelector_recommendedOption, recommendedOption, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _CPUThrottlingSelector_render, "f"));
    }
    connectedCallback() {
        SDK.CPUThrottlingManager.CPUThrottlingManager.instance().addEventListener("RateChanged" /* SDK.CPUThrottlingManager.Events.RATE_CHANGED */, __classPrivateFieldGet(this, _CPUThrottlingSelector_instances, "m", _CPUThrottlingSelector_onOptionChange), this);
        __classPrivateFieldGet(this, _CPUThrottlingSelector_calibratedThrottlingSetting, "f").addChangeListener(__classPrivateFieldGet(this, _CPUThrottlingSelector_instances, "m", _CPUThrottlingSelector_onCalibratedSettingChanged), this);
        __classPrivateFieldGet(this, _CPUThrottlingSelector_instances, "m", _CPUThrottlingSelector_onOptionChange).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _CPUThrottlingSelector_calibratedThrottlingSetting, "f").removeChangeListener(__classPrivateFieldGet(this, _CPUThrottlingSelector_instances, "m", _CPUThrottlingSelector_onCalibratedSettingChanged), this);
        SDK.CPUThrottlingManager.CPUThrottlingManager.instance().removeEventListener("RateChanged" /* SDK.CPUThrottlingManager.Events.RATE_CHANGED */, __classPrivateFieldGet(this, _CPUThrottlingSelector_instances, "m", _CPUThrottlingSelector_onOptionChange), this);
    }
}
_CPUThrottlingSelector_shadow = new WeakMap(), _CPUThrottlingSelector_currentOption = new WeakMap(), _CPUThrottlingSelector_recommendedOption = new WeakMap(), _CPUThrottlingSelector_groups = new WeakMap(), _CPUThrottlingSelector_calibratedThrottlingSetting = new WeakMap(), _CPUThrottlingSelector_render = new WeakMap(), _CPUThrottlingSelector_instances = new WeakSet(), _CPUThrottlingSelector_onOptionChange = function _CPUThrottlingSelector_onOptionChange() {
    __classPrivateFieldSet(this, _CPUThrottlingSelector_currentOption, SDK.CPUThrottlingManager.CPUThrottlingManager.instance().cpuThrottlingOption(), "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _CPUThrottlingSelector_render, "f"));
}, _CPUThrottlingSelector_onCalibratedSettingChanged = function _CPUThrottlingSelector_onCalibratedSettingChanged() {
    __classPrivateFieldGet(this, _CPUThrottlingSelector_instances, "m", _CPUThrottlingSelector_resetGroups).call(this);
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _CPUThrottlingSelector_render, "f"));
}, _CPUThrottlingSelector_onMenuItemSelected = function _CPUThrottlingSelector_onMenuItemSelected(event) {
    let option;
    if (typeof event.itemValue === 'string') {
        if (event.itemValue === 'low-tier-mobile') {
            option = SDK.CPUThrottlingManager.CalibratedLowTierMobileThrottlingOption;
        }
        else if (event.itemValue === 'mid-tier-mobile') {
            option = SDK.CPUThrottlingManager.CalibratedMidTierMobileThrottlingOption;
        }
    }
    else {
        const rate = Number(event.itemValue);
        option = MobileThrottling.ThrottlingPresets.ThrottlingPresets.cpuThrottlingPresets.find(option => !option.calibratedDeviceType && option.rate() === rate);
    }
    if (option) {
        MobileThrottling.ThrottlingManager.throttlingManager().setCPUThrottlingOption(option);
    }
}, _CPUThrottlingSelector_onCalibrateClick = function _CPUThrottlingSelector_onCalibrateClick() {
    void Common.Revealer.reveal(__classPrivateFieldGet(this, _CPUThrottlingSelector_calibratedThrottlingSetting, "f"));
}, _CPUThrottlingSelector_resetGroups = function _CPUThrottlingSelector_resetGroups() {
    __classPrivateFieldSet(this, _CPUThrottlingSelector_groups, [
        {
            name: '',
            items: MobileThrottling.ThrottlingPresets.ThrottlingPresets.cpuThrottlingPresets.filter(option => !option.calibratedDeviceType),
        },
        {
            name: i18nString(UIStrings.labelCalibratedPresets),
            items: MobileThrottling.ThrottlingPresets.ThrottlingPresets.cpuThrottlingPresets.filter(option => option.calibratedDeviceType),
        },
    ], "f");
};
customElements.define('devtools-cpu-throttling-selector', CPUThrottlingSelector);
//# sourceMappingURL=CPUThrottlingSelector.js.map