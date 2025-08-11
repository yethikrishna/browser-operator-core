// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _PreloadingDisabledInfobar_instances, _PreloadingDisabledInfobar_shadow, _PreloadingDisabledInfobar_data, _PreloadingDisabledInfobar_render, _PreloadingDisabledInfobar_renderInternal, _PreloadingDisabledInfobar_dialogContents, _PreloadingDisabledInfobar_maybeKeyValue, _PreloadingDisabledInfobar_maybeDisalebByPreference, _PreloadingDisabledInfobar_maybeDisalebByDataSaver, _PreloadingDisabledInfobar_maybeDisalebByBatterySaver, _PreloadingDisabledInfobar_maybeDisalebByHoldbackPrefetchSpeculationRules, _PreloadingDisabledInfobar_maybeDisalebByHoldbackPrerenderSpeculationRules;
import '../../../../ui/components/report_view/report_view.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Buttons from '../../../../ui/components/buttons/buttons.js';
import * as ChromeLink from '../../../../ui/components/chrome_link/chrome_link.js';
import * as Dialogs from '../../../../ui/components/dialogs/dialogs.js';
import * as LegacyWrapper from '../../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as RenderCoordinator from '../../../../ui/components/render_coordinator/render_coordinator.js';
import * as UI from '../../../../ui/legacy/legacy.js';
import * as Lit from '../../../../ui/lit/lit.js';
import * as VisualLogging from '../../../../ui/visual_logging/visual_logging.js';
import preloadingDisabledInfobarStyles from './preloadingDisabledInfobar.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description Infobar text for disabled case
     */
    infobarPreloadingIsDisabled: 'Speculative loading is disabled',
    /**
     *@description Infobar text for force-enabled case
     */
    infobarPreloadingIsForceEnabled: 'Speculative loading is force-enabled',
    /**
     *@description Title for dialog
     */
    titleReasonsPreventingPreloading: 'Reasons preventing speculative loading',
    /**
     *@description Header in dialog
     */
    headerDisabledByPreference: 'User settings or extensions',
    /**
     *@description Description in dialog
     *@example {Preload pages settings (linked to chrome://settings/performance)} PH1
     *@example {Extensions settings (linked to chrome://extensions)} PH2
     */
    descriptionDisabledByPreference: 'Speculative loading is disabled because of user settings or an extension. Go to {PH1} to update your preference. Go to {PH2} to disable any extension that blocks speculative loading.',
    /**
     *@description Text of link
     */
    preloadingPagesSettings: 'Preload pages settings',
    /**
     *@description Text of link
     */
    extensionsSettings: 'Extensions settings',
    /**
     *@description Header in dialog
     */
    headerDisabledByDataSaver: 'Data Saver',
    /**
     *@description Description in dialog
     */
    descriptionDisabledByDataSaver: 'Speculative loading is disabled because of the operating system\'s Data Saver mode.',
    /**
     *@description Header in dialog
     */
    headerDisabledByBatterySaver: 'Battery Saver',
    /**
     *@description Description in dialog
     */
    descriptionDisabledByBatterySaver: 'Speculative loading is disabled because of the operating system\'s Battery Saver mode.',
    /**
     *@description Header in dialog
     */
    headerDisabledByHoldbackPrefetchSpeculationRules: 'Prefetch was disabled, but is force-enabled now',
    /**
     *@description Description in infobar
     */
    descriptionDisabledByHoldbackPrefetchSpeculationRules: 'Prefetch is forced-enabled because DevTools is open. When DevTools is closed, prefetch will be disabled because this browser session is part of a holdback group used for performance comparisons.',
    /**
     *@description Header in dialog
     */
    headerDisabledByHoldbackPrerenderSpeculationRules: 'Prerendering was disabled, but is force-enabled now',
    /**
     *@description Description in infobar
     */
    descriptionDisabledByHoldbackPrerenderSpeculationRules: 'Prerendering is forced-enabled because DevTools is open. When DevTools is closed, prerendering will be disabled because this browser session is part of a holdback group used for performance comparisons.',
    /**
     *@description Footer link for more details
     */
    footerLearnMore: 'Learn more',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/preloading/components/PreloadingDisabledInfobar.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class PreloadingDisabledInfobar extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super(...arguments);
        _PreloadingDisabledInfobar_instances.add(this);
        _PreloadingDisabledInfobar_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _PreloadingDisabledInfobar_data.set(this, {
            disabledByPreference: false,
            disabledByDataSaver: false,
            disabledByBatterySaver: false,
            disabledByHoldbackPrefetchSpeculationRules: false,
            disabledByHoldbackPrerenderSpeculationRules: false,
        });
    }
    connectedCallback() {
        void __classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_render).call(this);
    }
    set data(data) {
        __classPrivateFieldSet(this, _PreloadingDisabledInfobar_data, data, "f");
        void __classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_render).call(this);
    }
}
_PreloadingDisabledInfobar_shadow = new WeakMap(), _PreloadingDisabledInfobar_data = new WeakMap(), _PreloadingDisabledInfobar_instances = new WeakSet(), _PreloadingDisabledInfobar_render = async function _PreloadingDisabledInfobar_render() {
    await RenderCoordinator.write('PreloadingDisabledInfobar render', () => {
        Lit.render(__classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_renderInternal).call(this), __classPrivateFieldGet(this, _PreloadingDisabledInfobar_shadow, "f"), { host: this });
    });
}, _PreloadingDisabledInfobar_renderInternal = function _PreloadingDisabledInfobar_renderInternal() {
    const forceEnabled = __classPrivateFieldGet(this, _PreloadingDisabledInfobar_data, "f").disabledByHoldbackPrefetchSpeculationRules || __classPrivateFieldGet(this, _PreloadingDisabledInfobar_data, "f").disabledByHoldbackPrerenderSpeculationRules;
    const disabled = __classPrivateFieldGet(this, _PreloadingDisabledInfobar_data, "f").disabledByPreference || __classPrivateFieldGet(this, _PreloadingDisabledInfobar_data, "f").disabledByDataSaver || __classPrivateFieldGet(this, _PreloadingDisabledInfobar_data, "f").disabledByBatterySaver;
    let header;
    if (disabled) {
        header = i18nString(UIStrings.infobarPreloadingIsDisabled);
    }
    else if (forceEnabled) {
        header = i18nString(UIStrings.infobarPreloadingIsForceEnabled);
    }
    else {
        return Lit.nothing;
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <style>${preloadingDisabledInfobarStyles}</style>
      <div id='container'>
        <span id='header'>
          ${header}
        </span>

        <devtools-button-dialog
          .data=${{
        iconName: 'info',
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        closeButton: true,
        position: "auto" /* Dialogs.Dialog.DialogVerticalPosition.AUTO */,
        horizontalAlignment: "auto" /* Dialogs.Dialog.DialogHorizontalAlignment.AUTO */,
        closeOnESC: true,
        closeOnScroll: false,
        dialogTitle: i18nString(UIStrings.titleReasonsPreventingPreloading),
    }}
          jslog=${VisualLogging.dialog('preloading-disabled').track({ resize: true, keydown: 'Escape' })}
        >
          ${__classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_dialogContents).call(this)}
        </devtools-button-dialog>
      </div>
    `;
    // clang-format on
}, _PreloadingDisabledInfobar_dialogContents = function _PreloadingDisabledInfobar_dialogContents() {
    const LINK = 'https://developer.chrome.com/blog/prerender-pages/';
    const learnMoreLink = UI.XLink.XLink.create(LINK, i18nString(UIStrings.footerLearnMore), undefined, undefined, 'learn-more');
    const iconLink = UI.Fragment.html `
      <x-link class="icon-link devtools-link" tabindex="0" href="${LINK}"></x-link>
    `;
    return html `
      <div id='contents'>
        <devtools-report>
          ${__classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_maybeDisalebByPreference).call(this)}
          ${__classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_maybeDisalebByDataSaver).call(this)}
          ${__classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_maybeDisalebByBatterySaver).call(this)}
          ${__classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_maybeDisalebByHoldbackPrefetchSpeculationRules).call(this)}
          ${__classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_maybeDisalebByHoldbackPrerenderSpeculationRules).call(this)}
        </devtools-report>
        <div id='footer'>
          ${learnMoreLink}
          ${iconLink}
        </div>
      </div>
    `;
}, _PreloadingDisabledInfobar_maybeKeyValue = function _PreloadingDisabledInfobar_maybeKeyValue(shouldShow, header, description) {
    if (!shouldShow) {
        return Lit.nothing;
    }
    return html `
      <div class='key'>
        ${header}
      </div>
      <div class='value'>
        ${description}
      </div>
    `;
}, _PreloadingDisabledInfobar_maybeDisalebByPreference = function _PreloadingDisabledInfobar_maybeDisalebByPreference() {
    const preloadingSettingLink = new ChromeLink.ChromeLink.ChromeLink();
    preloadingSettingLink.href = 'chrome://settings/performance';
    preloadingSettingLink.textContent = i18nString(UIStrings.preloadingPagesSettings);
    const extensionsSettingLink = new ChromeLink.ChromeLink.ChromeLink();
    extensionsSettingLink.href = 'chrome://extensions';
    extensionsSettingLink.textContent = i18nString(UIStrings.extensionsSettings);
    const description = i18n.i18n.getFormatLocalizedString(str_, UIStrings.descriptionDisabledByPreference, { PH1: preloadingSettingLink, PH2: extensionsSettingLink });
    return __classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_maybeKeyValue).call(this, __classPrivateFieldGet(this, _PreloadingDisabledInfobar_data, "f").disabledByPreference, i18nString(UIStrings.headerDisabledByPreference), description);
}, _PreloadingDisabledInfobar_maybeDisalebByDataSaver = function _PreloadingDisabledInfobar_maybeDisalebByDataSaver() {
    return __classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_maybeKeyValue).call(this, __classPrivateFieldGet(this, _PreloadingDisabledInfobar_data, "f").disabledByDataSaver, i18nString(UIStrings.headerDisabledByDataSaver), i18nString(UIStrings.descriptionDisabledByDataSaver));
}, _PreloadingDisabledInfobar_maybeDisalebByBatterySaver = function _PreloadingDisabledInfobar_maybeDisalebByBatterySaver() {
    return __classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_maybeKeyValue).call(this, __classPrivateFieldGet(this, _PreloadingDisabledInfobar_data, "f").disabledByBatterySaver, i18nString(UIStrings.headerDisabledByBatterySaver), i18nString(UIStrings.descriptionDisabledByBatterySaver));
}, _PreloadingDisabledInfobar_maybeDisalebByHoldbackPrefetchSpeculationRules = function _PreloadingDisabledInfobar_maybeDisalebByHoldbackPrefetchSpeculationRules() {
    return __classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_maybeKeyValue).call(this, __classPrivateFieldGet(this, _PreloadingDisabledInfobar_data, "f").disabledByHoldbackPrefetchSpeculationRules, i18nString(UIStrings.headerDisabledByHoldbackPrefetchSpeculationRules), i18nString(UIStrings.descriptionDisabledByHoldbackPrefetchSpeculationRules));
}, _PreloadingDisabledInfobar_maybeDisalebByHoldbackPrerenderSpeculationRules = function _PreloadingDisabledInfobar_maybeDisalebByHoldbackPrerenderSpeculationRules() {
    return __classPrivateFieldGet(this, _PreloadingDisabledInfobar_instances, "m", _PreloadingDisabledInfobar_maybeKeyValue).call(this, __classPrivateFieldGet(this, _PreloadingDisabledInfobar_data, "f").disabledByHoldbackPrerenderSpeculationRules, i18nString(UIStrings.headerDisabledByHoldbackPrerenderSpeculationRules), i18nString(UIStrings.descriptionDisabledByHoldbackPrerenderSpeculationRules));
};
customElements.define('devtools-resources-preloading-disabled-infobar', PreloadingDisabledInfobar);
//# sourceMappingURL=PreloadingDisabledInfobar.js.map