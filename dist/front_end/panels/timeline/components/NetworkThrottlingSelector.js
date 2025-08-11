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
var _NetworkThrottlingSelector_instances, _NetworkThrottlingSelector_shadow, _NetworkThrottlingSelector_customNetworkConditionsSetting, _NetworkThrottlingSelector_groups, _NetworkThrottlingSelector_currentConditions, _NetworkThrottlingSelector_recommendedConditions, _NetworkThrottlingSelector_resetPresets, _NetworkThrottlingSelector_onConditionsChanged, _NetworkThrottlingSelector_onMenuItemSelected, _NetworkThrottlingSelector_onSettingChanged, _NetworkThrottlingSelector_getConditionsTitle, _NetworkThrottlingSelector_onAddClick, _NetworkThrottlingSelector_keyForNetworkConditions, _NetworkThrottlingSelector_render;
import '../../../ui/components/icon_button/icon_button.js';
import '../../../ui/components/menus/menus.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as MobileThrottling from '../../mobile_throttling/mobile_throttling.js';
import networkThrottlingSelectorStyles from './networkThrottlingSelector.css.js';
const { html, nothing } = Lit;
const UIStrings = {
    /**
     * @description Text label for a selection box showing which network throttling option is applied.
     * @example {No throttling} PH1
     */
    network: 'Network: {PH1}',
    /**
     * @description Text label for a selection box showing which network throttling option is applied.
     * @example {No throttling} PH1
     */
    networkThrottling: 'Network throttling: {PH1}',
    /**
     * @description Text label for a selection box showing that a specific option is recommended for network throttling.
     * @example {Fast 4G} PH1
     */
    recommendedThrottling: '{PH1} – recommended',
    /**
     * @description Text for why user should change a throttling setting.
     */
    recommendedThrottlingReason: 'Consider changing setting to simulate real user environments',
    /**
     * @description Text label for a menu group that disables network throttling.
     */
    disabled: 'Disabled',
    /**
     * @description Text label for a menu group that contains default presets for network throttling.
     */
    presets: 'Presets',
    /**
     * @description Text label for a menu group that contains custom presets for network throttling.
     */
    custom: 'Custom',
    /**
     * @description Text label for a menu option to add a new custom throttling preset.
     */
    add: 'Add…',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/NetworkThrottlingSelector.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class NetworkThrottlingSelector extends HTMLElement {
    constructor() {
        super();
        _NetworkThrottlingSelector_instances.add(this);
        _NetworkThrottlingSelector_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _NetworkThrottlingSelector_customNetworkConditionsSetting.set(this, void 0);
        _NetworkThrottlingSelector_groups.set(this, []);
        _NetworkThrottlingSelector_currentConditions.set(this, void 0);
        _NetworkThrottlingSelector_recommendedConditions.set(this, null);
        _NetworkThrottlingSelector_render.set(this, () => {
            const selectionTitle = __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_getConditionsTitle).call(this, __classPrivateFieldGet(this, _NetworkThrottlingSelector_currentConditions, "f"));
            const selectedConditionsKey = __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_keyForNetworkConditions).call(this, __classPrivateFieldGet(this, _NetworkThrottlingSelector_currentConditions, "f"));
            let recommendedInfoEl;
            if (__classPrivateFieldGet(this, _NetworkThrottlingSelector_recommendedConditions, "f") && __classPrivateFieldGet(this, _NetworkThrottlingSelector_currentConditions, "f") === SDK.NetworkManager.NoThrottlingConditions) {
                recommendedInfoEl = html `<devtools-icon
        title=${i18nString(UIStrings.recommendedThrottlingReason)}
        name=info></devtools-icon>`;
            }
            // clang-format off
            /* eslint-disable rulesdir/no-deprecated-component-usages */
            const output = html `
      <style>${networkThrottlingSelectorStyles}</style>
      <devtools-select-menu
        @selectmenuselected=${__classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_onMenuItemSelected)}
        .showDivider=${true}
        .showArrow=${true}
        .sideButton=${false}
        .showSelectedItem=${true}
        .jslogContext=${'network-conditions'}
        .buttonTitle=${i18nString(UIStrings.network, { PH1: selectionTitle })}
        .title=${i18nString(UIStrings.networkThrottling, { PH1: selectionTitle })}
      >
        ${__classPrivateFieldGet(this, _NetworkThrottlingSelector_groups, "f").map(group => {
                return html `
            <devtools-menu-group .name=${group.name} .title=${group.name}>
              ${group.items.map(conditions => {
                    let title = __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_getConditionsTitle).call(this, conditions);
                    if (conditions === __classPrivateFieldGet(this, _NetworkThrottlingSelector_recommendedConditions, "f")) {
                        title = i18nString(UIStrings.recommendedThrottling, { PH1: title });
                    }
                    const key = __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_keyForNetworkConditions).call(this, conditions);
                    const jslogContext = group.jslogContext || Platform.StringUtilities.toKebabCase(conditions.i18nTitleKey || title);
                    return html `
                  <devtools-menu-item
                    .value=${key}
                    .selected=${selectedConditionsKey === key}
                    .title=${title}
                    jslog=${VisualLogging.item(jslogContext).track({ click: true })}
                  >
                    ${title}
                  </devtools-menu-item>
                `;
                })}
              ${group.showCustomAddOption ? html `
                <devtools-menu-item
                  .value=${1 /* This won't be displayed unless it has some value. */}
                  .title=${i18nString(UIStrings.add)}
                  jslog=${VisualLogging.action('add').track({ click: true })}
                  @click=${__classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_onAddClick)}
                >
                  ${i18nString(UIStrings.add)}
                </devtools-menu-item>
              ` : nothing}
            </devtools-menu-group>
          `;
            })}
      </devtools-select-menu>
      ${recommendedInfoEl}
    `;
            /* eslint-enable rulesdir/no-deprecated-component-usages */
            // clang-format on
            Lit.render(output, __classPrivateFieldGet(this, _NetworkThrottlingSelector_shadow, "f"), { host: this });
        });
        __classPrivateFieldSet(this, _NetworkThrottlingSelector_customNetworkConditionsSetting, Common.Settings.Settings.instance().moduleSetting('custom-network-conditions'), "f");
        __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_resetPresets).call(this);
        __classPrivateFieldSet(this, _NetworkThrottlingSelector_currentConditions, SDK.NetworkManager.MultitargetNetworkManager.instance().networkConditions(), "f");
        __classPrivateFieldGet(this, _NetworkThrottlingSelector_render, "f").call(this);
    }
    set recommendedConditions(recommendedConditions) {
        __classPrivateFieldSet(this, _NetworkThrottlingSelector_recommendedConditions, recommendedConditions, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _NetworkThrottlingSelector_render, "f"));
    }
    connectedCallback() {
        SDK.NetworkManager.MultitargetNetworkManager.instance().addEventListener("ConditionsChanged" /* SDK.NetworkManager.MultitargetNetworkManager.Events.CONDITIONS_CHANGED */, __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_onConditionsChanged), this);
        // Also call onConditionsChanged immediately to make sure we get the
        // latest snapshot. Otherwise if another panel updated this value and this
        // component wasn't in the DOM, this component will not update itself
        // when it is put into the page
        __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_onConditionsChanged).call(this);
        __classPrivateFieldGet(this, _NetworkThrottlingSelector_customNetworkConditionsSetting, "f").addChangeListener(__classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_onSettingChanged), this);
    }
    disconnectedCallback() {
        SDK.NetworkManager.MultitargetNetworkManager.instance().removeEventListener("ConditionsChanged" /* SDK.NetworkManager.MultitargetNetworkManager.Events.CONDITIONS_CHANGED */, __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_onConditionsChanged), this);
        __classPrivateFieldGet(this, _NetworkThrottlingSelector_customNetworkConditionsSetting, "f").removeChangeListener(__classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_onSettingChanged), this);
    }
}
_NetworkThrottlingSelector_shadow = new WeakMap(), _NetworkThrottlingSelector_customNetworkConditionsSetting = new WeakMap(), _NetworkThrottlingSelector_groups = new WeakMap(), _NetworkThrottlingSelector_currentConditions = new WeakMap(), _NetworkThrottlingSelector_recommendedConditions = new WeakMap(), _NetworkThrottlingSelector_render = new WeakMap(), _NetworkThrottlingSelector_instances = new WeakSet(), _NetworkThrottlingSelector_resetPresets = function _NetworkThrottlingSelector_resetPresets() {
    __classPrivateFieldSet(this, _NetworkThrottlingSelector_groups, [
        {
            name: i18nString(UIStrings.disabled),
            items: [
                SDK.NetworkManager.NoThrottlingConditions,
            ],
        },
        {
            name: i18nString(UIStrings.presets),
            items: MobileThrottling.ThrottlingPresets.ThrottlingPresets.networkPresets,
        },
        {
            name: i18nString(UIStrings.custom),
            items: __classPrivateFieldGet(this, _NetworkThrottlingSelector_customNetworkConditionsSetting, "f").get(),
            showCustomAddOption: true,
            jslogContext: 'custom-network-throttling-item',
        },
    ], "f");
}, _NetworkThrottlingSelector_onConditionsChanged = function _NetworkThrottlingSelector_onConditionsChanged() {
    __classPrivateFieldSet(this, _NetworkThrottlingSelector_currentConditions, SDK.NetworkManager.MultitargetNetworkManager.instance().networkConditions(), "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _NetworkThrottlingSelector_render, "f"));
}, _NetworkThrottlingSelector_onMenuItemSelected = function _NetworkThrottlingSelector_onMenuItemSelected(event) {
    const newConditions = __classPrivateFieldGet(this, _NetworkThrottlingSelector_groups, "f").flatMap(g => g.items).find(item => {
        const keyForItem = __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_keyForNetworkConditions).call(this, item);
        return keyForItem === event.itemValue;
    });
    if (newConditions) {
        SDK.NetworkManager.MultitargetNetworkManager.instance().setNetworkConditions(newConditions);
    }
}, _NetworkThrottlingSelector_onSettingChanged = function _NetworkThrottlingSelector_onSettingChanged() {
    __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_resetPresets).call(this);
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _NetworkThrottlingSelector_render, "f"));
}, _NetworkThrottlingSelector_getConditionsTitle = function _NetworkThrottlingSelector_getConditionsTitle(conditions) {
    return conditions.title instanceof Function ? conditions.title() : conditions.title;
}, _NetworkThrottlingSelector_onAddClick = function _NetworkThrottlingSelector_onAddClick() {
    void Common.Revealer.reveal(__classPrivateFieldGet(this, _NetworkThrottlingSelector_customNetworkConditionsSetting, "f"));
}, _NetworkThrottlingSelector_keyForNetworkConditions = function _NetworkThrottlingSelector_keyForNetworkConditions(conditions) {
    return conditions.i18nTitleKey || __classPrivateFieldGet(this, _NetworkThrottlingSelector_instances, "m", _NetworkThrottlingSelector_getConditionsTitle).call(this, conditions);
};
customElements.define('devtools-network-throttling-selector', NetworkThrottlingSelector);
//# sourceMappingURL=NetworkThrottlingSelector.js.map