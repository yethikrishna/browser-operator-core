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
var _FieldSettingsDialog_instances, _FieldSettingsDialog_shadow, _FieldSettingsDialog_dialog, _FieldSettingsDialog_configSetting, _FieldSettingsDialog_urlOverride, _FieldSettingsDialog_urlOverrideEnabled, _FieldSettingsDialog_urlOverrideWarning, _FieldSettingsDialog_originMap, _FieldSettingsDialog_resetToSettingState, _FieldSettingsDialog_flushToSetting, _FieldSettingsDialog_onSettingsChanged, _FieldSettingsDialog_urlHasFieldData, _FieldSettingsDialog_submit, _FieldSettingsDialog_showDialog, _FieldSettingsDialog_closeDialog, _FieldSettingsDialog_renderOpenButton, _FieldSettingsDialog_renderEnableButton, _FieldSettingsDialog_renderDisableButton, _FieldSettingsDialog_onUrlOverrideChange, _FieldSettingsDialog_onUrlOverrideEnabledChange, _FieldSettingsDialog_getOrigin, _FieldSettingsDialog_renderOriginMapGrid, _FieldSettingsDialog_render;
import './OriginMap.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as CrUXManager from '../../../models/crux-manager/crux-manager.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as Dialogs from '../../../ui/components/dialogs/dialogs.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Input from '../../../ui/components/input/input.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import fieldSettingsDialogStyles from './fieldSettingsDialog.css.js';
const UIStrings = {
    /**
     * @description Text label for a button that opens a dialog to set up field metrics.
     */
    setUp: 'Set up',
    /**
     * @description Text label for a button that opens a dialog to configure field metrics.
     */
    configure: 'Configure',
    /**
     * @description Text label for a button that enables the collection of field metrics.
     */
    ok: 'Ok',
    /**
     * @description Text label for a button that opts out of the collection of field metrics.
     */
    optOut: 'Opt out',
    /**
     * @description Text label for a button that cancels the setup of field metrics collection.
     */
    cancel: 'Cancel',
    /**
     * @description Text label for a checkbox that controls if a manual URL override is enabled for field metrics.
     */
    onlyFetchFieldData: 'Always show field metrics for the below URL',
    /**
     * @description Text label for a text box that that contains the manual override URL for fetching field metrics.
     */
    url: 'URL',
    /**
     * @description Warning message explaining that the Chrome UX Report could not find enough real world speed data for the page. "Chrome UX Report" is a product name and should not be translated.
     */
    doesNotHaveSufficientData: 'The Chrome UX Report does not have sufficient real-world speed data for this page.',
    /**
     * @description Title for a dialog that contains information and settings related to fetching field metrics.
     */
    configureFieldData: 'Configure field metrics fetching',
    /**
     * @description Paragraph explaining where field metrics comes from and and how it can be used. PH1 will be a link with text "Chrome UX Report" that is untranslated because it is a product name.
     * @example {Chrome UX Report} PH1
     */
    fetchAggregated: 'Fetch aggregated field metrics from the {PH1} to help you contextualize local measurements with what real users experience on the site.',
    /**
     * @description Heading for a section that explains what user data needs to be collected to fetch field metrics.
     */
    privacyDisclosure: 'Privacy disclosure',
    /**
     * @description Paragraph explaining what data needs to be sent to Google to fetch field metrics, and when that data will be sent.
     */
    whenPerformanceIsShown: 'When DevTools is open, the URLs you visit will be sent to Google to query field metrics. These requests are not tied to your Google account.',
    /**
     * @description Header for a section containing advanced settings
     */
    advanced: 'Advanced',
    /**
     * @description Paragraph explaining that the user can associate a development origin with a production origin for the purposes of fetching real user data.
     */
    mapDevelopmentOrigins: 'Set a development origin to automatically get relevant field metrics for its production origin.',
    /**
     * @description Text label for a button that adds a new editable row to a data table
     */
    new: 'New',
    /**
     * @description Warning message explaining that an input origin is not a valid origin or URL.
     * @example {http//malformed.com} PH1
     */
    invalidOrigin: '"{PH1}" is not a valid origin or URL.',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/FieldSettingsDialog.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { html, nothing, Directives: { ifDefined } } = Lit;
export class ShowDialog extends Event {
    constructor() {
        super(ShowDialog.eventName);
    }
}
ShowDialog.eventName = 'showdialog';
export class FieldSettingsDialog extends HTMLElement {
    constructor() {
        super();
        _FieldSettingsDialog_instances.add(this);
        _FieldSettingsDialog_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _FieldSettingsDialog_dialog.set(this, void 0);
        _FieldSettingsDialog_configSetting.set(this, CrUXManager.CrUXManager.instance().getConfigSetting());
        _FieldSettingsDialog_urlOverride.set(this, '');
        _FieldSettingsDialog_urlOverrideEnabled.set(this, false);
        _FieldSettingsDialog_urlOverrideWarning.set(this, '');
        _FieldSettingsDialog_originMap.set(this, void 0);
        _FieldSettingsDialog_render.set(this, () => {
            const linkEl = UI.XLink.XLink.create('https://developer.chrome.com/docs/crux', i18n.i18n.lockedString('Chrome UX Report'));
            const descriptionEl = i18n.i18n.getFormatLocalizedString(str_, UIStrings.fetchAggregated, { PH1: linkEl });
            // clang-format off
            const output = html `
      <style>${fieldSettingsDialogStyles}</style>
      <style>${Input.textInputStyles}</style>
      <style>${Input.checkboxStyles}</style>
      <div class="open-button-section">${__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_renderOpenButton).call(this)}</div>
      <devtools-dialog
        @clickoutsidedialog=${__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_closeDialog)}
        .position=${"auto" /* Dialogs.Dialog.DialogVerticalPosition.AUTO */}
        .horizontalAlignment=${"center" /* Dialogs.Dialog.DialogHorizontalAlignment.CENTER */}
        .jslogContext=${'timeline.field-data.settings'}
        .expectedMutationsSelector=${'.timeline-settings-pane option'}
        .dialogTitle=${i18nString(UIStrings.configureFieldData)}
        on-render=${ComponentHelpers.Directives.nodeRenderedCallback(node => {
                __classPrivateFieldSet(this, _FieldSettingsDialog_dialog, node, "f");
            })}
      >
        <div class="content">
          <div>${descriptionEl}</div>
          <div class="privacy-disclosure">
            <h3 class="section-title">${i18nString(UIStrings.privacyDisclosure)}</h3>
            <div>${i18nString(UIStrings.whenPerformanceIsShown)}</div>
          </div>
          <details aria-label=${i18nString(UIStrings.advanced)}>
            <summary>${i18nString(UIStrings.advanced)}</summary>
            <div class="advanced-section-contents">
              ${__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_renderOriginMapGrid).call(this)}
              <hr class="divider">
              <label class="url-override">
                <input
                  type="checkbox"
                  .checked=${__classPrivateFieldGet(this, _FieldSettingsDialog_urlOverrideEnabled, "f")}
                  @change=${__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_onUrlOverrideEnabledChange)}
                  aria-label=${i18nString(UIStrings.onlyFetchFieldData)}
                  jslog=${VisualLogging.toggle().track({ click: true }).context('field-url-override-enabled')}
                />
                ${i18nString(UIStrings.onlyFetchFieldData)}
              </label>
              <input
                type="text"
                @keyup=${__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_onUrlOverrideChange)}
                @change=${__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_onUrlOverrideChange)}
                class="devtools-text-input"
                .disabled=${!__classPrivateFieldGet(this, _FieldSettingsDialog_urlOverrideEnabled, "f")}
                .value=${__classPrivateFieldGet(this, _FieldSettingsDialog_urlOverride, "f")}
                placeholder=${ifDefined(__classPrivateFieldGet(this, _FieldSettingsDialog_urlOverrideEnabled, "f") ? i18nString(UIStrings.url) : undefined)}
              />
              ${__classPrivateFieldGet(this, _FieldSettingsDialog_urlOverrideWarning, "f")
                ? html `<div class="warning" role="alert" aria-label=${__classPrivateFieldGet(this, _FieldSettingsDialog_urlOverrideWarning, "f")}>${__classPrivateFieldGet(this, _FieldSettingsDialog_urlOverrideWarning, "f")}</div>`
                : nothing}
            </div>
          </details>
          <div class="buttons-section">
            ${__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_renderDisableButton).call(this)}
            ${__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_renderEnableButton).call(this)}
          </div>
        </div>
      </devtools-dialog>
    `;
            // clang-format on
            Lit.render(output, __classPrivateFieldGet(this, _FieldSettingsDialog_shadow, "f"), { host: this });
        });
        const cruxManager = CrUXManager.CrUXManager.instance();
        __classPrivateFieldSet(this, _FieldSettingsDialog_configSetting, cruxManager.getConfigSetting(), "f");
        __classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_resetToSettingState).call(this);
        __classPrivateFieldGet(this, _FieldSettingsDialog_render, "f").call(this);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _FieldSettingsDialog_configSetting, "f").addChangeListener(__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_onSettingsChanged), this);
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _FieldSettingsDialog_render, "f"));
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _FieldSettingsDialog_configSetting, "f").removeChangeListener(__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_onSettingsChanged), this);
    }
}
_FieldSettingsDialog_shadow = new WeakMap(), _FieldSettingsDialog_dialog = new WeakMap(), _FieldSettingsDialog_configSetting = new WeakMap(), _FieldSettingsDialog_urlOverride = new WeakMap(), _FieldSettingsDialog_urlOverrideEnabled = new WeakMap(), _FieldSettingsDialog_urlOverrideWarning = new WeakMap(), _FieldSettingsDialog_originMap = new WeakMap(), _FieldSettingsDialog_render = new WeakMap(), _FieldSettingsDialog_instances = new WeakSet(), _FieldSettingsDialog_resetToSettingState = function _FieldSettingsDialog_resetToSettingState() {
    const configSetting = __classPrivateFieldGet(this, _FieldSettingsDialog_configSetting, "f").get();
    __classPrivateFieldSet(this, _FieldSettingsDialog_urlOverride, configSetting.override || '', "f");
    __classPrivateFieldSet(this, _FieldSettingsDialog_urlOverrideEnabled, configSetting.overrideEnabled || false, "f");
    __classPrivateFieldSet(this, _FieldSettingsDialog_urlOverrideWarning, '', "f");
}, _FieldSettingsDialog_flushToSetting = function _FieldSettingsDialog_flushToSetting(enabled) {
    const value = __classPrivateFieldGet(this, _FieldSettingsDialog_configSetting, "f").get();
    __classPrivateFieldGet(this, _FieldSettingsDialog_configSetting, "f").set({
        ...value,
        enabled,
        override: __classPrivateFieldGet(this, _FieldSettingsDialog_urlOverride, "f"),
        overrideEnabled: __classPrivateFieldGet(this, _FieldSettingsDialog_urlOverrideEnabled, "f"),
    });
}, _FieldSettingsDialog_onSettingsChanged = function _FieldSettingsDialog_onSettingsChanged() {
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _FieldSettingsDialog_render, "f"));
}, _FieldSettingsDialog_urlHasFieldData = async function _FieldSettingsDialog_urlHasFieldData(url) {
    const cruxManager = CrUXManager.CrUXManager.instance();
    const result = await cruxManager.getFieldDataForPage(url);
    return Object.entries(result).some(([key, value]) => {
        if (key === 'warnings') {
            return false;
        }
        return Boolean(value);
    });
}, _FieldSettingsDialog_submit = async function _FieldSettingsDialog_submit(enabled) {
    if (enabled && __classPrivateFieldGet(this, _FieldSettingsDialog_urlOverrideEnabled, "f")) {
        const origin = __classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_getOrigin).call(this, __classPrivateFieldGet(this, _FieldSettingsDialog_urlOverride, "f"));
        if (!origin) {
            __classPrivateFieldSet(this, _FieldSettingsDialog_urlOverrideWarning, i18nString(UIStrings.invalidOrigin, { PH1: __classPrivateFieldGet(this, _FieldSettingsDialog_urlOverride, "f") }), "f");
            void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _FieldSettingsDialog_render, "f"));
            return;
        }
        const hasFieldData = await __classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_urlHasFieldData).call(this, __classPrivateFieldGet(this, _FieldSettingsDialog_urlOverride, "f"));
        if (!hasFieldData) {
            __classPrivateFieldSet(this, _FieldSettingsDialog_urlOverrideWarning, i18nString(UIStrings.doesNotHaveSufficientData), "f");
            void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _FieldSettingsDialog_render, "f"));
            return;
        }
    }
    __classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_flushToSetting).call(this, enabled);
    __classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_closeDialog).call(this);
}, _FieldSettingsDialog_showDialog = function _FieldSettingsDialog_showDialog() {
    if (!__classPrivateFieldGet(this, _FieldSettingsDialog_dialog, "f")) {
        throw new Error('Dialog not found');
    }
    __classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_resetToSettingState).call(this);
    void __classPrivateFieldGet(this, _FieldSettingsDialog_dialog, "f").setDialogVisible(true);
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _FieldSettingsDialog_render, "f"));
    this.dispatchEvent(new ShowDialog());
}, _FieldSettingsDialog_closeDialog = function _FieldSettingsDialog_closeDialog(evt) {
    if (!__classPrivateFieldGet(this, _FieldSettingsDialog_dialog, "f")) {
        throw new Error('Dialog not found');
    }
    void __classPrivateFieldGet(this, _FieldSettingsDialog_dialog, "f").setDialogVisible(false);
    if (evt) {
        evt.stopImmediatePropagation();
    }
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _FieldSettingsDialog_render, "f"));
}, _FieldSettingsDialog_renderOpenButton = function _FieldSettingsDialog_renderOpenButton() {
    if (__classPrivateFieldGet(this, _FieldSettingsDialog_configSetting, "f").get().enabled) {
        // clang-format off
        return html `
        <devtools-button
          class="config-button"
          @click=${__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_showDialog)}
          .data=${{
            variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
            title: i18nString(UIStrings.configure),
        }}
        jslog=${VisualLogging.action('timeline.field-data.configure').track({ click: true })}
        >${i18nString(UIStrings.configure)}</devtools-button>
      `;
        // clang-format on
    }
    // clang-format off
    return html `
      <devtools-button
        class="setup-button"
        @click=${__classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_showDialog)}
        .data=${{
        variant: "primary" /* Buttons.Button.Variant.PRIMARY */,
        title: i18nString(UIStrings.setUp),
    }}
        jslog=${VisualLogging.action('timeline.field-data.setup').track({ click: true })}
        data-field-data-setup
      >${i18nString(UIStrings.setUp)}</devtools-button>
    `;
    // clang-format on
}, _FieldSettingsDialog_renderEnableButton = function _FieldSettingsDialog_renderEnableButton() {
    // clang-format off
    return html `
      <devtools-button
        @click=${() => {
        void __classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_submit).call(this, true);
    }}
        .data=${{
        variant: "primary" /* Buttons.Button.Variant.PRIMARY */,
        title: i18nString(UIStrings.ok),
    }}
        class="enable"
        jslog=${VisualLogging.action('timeline.field-data.enable').track({ click: true })}
        data-field-data-enable
      >${i18nString(UIStrings.ok)}</devtools-button>
    `;
    // clang-format on
}, _FieldSettingsDialog_renderDisableButton = function _FieldSettingsDialog_renderDisableButton() {
    const label = __classPrivateFieldGet(this, _FieldSettingsDialog_configSetting, "f").get().enabled ? i18nString(UIStrings.optOut) : i18nString(UIStrings.cancel);
    // clang-format off
    return html `
      <devtools-button
        @click=${() => {
        void __classPrivateFieldGet(this, _FieldSettingsDialog_instances, "m", _FieldSettingsDialog_submit).call(this, false);
    }}
        .data=${{
        variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
        title: label,
    }}
        jslog=${VisualLogging.action('timeline.field-data.disable').track({ click: true })}
        data-field-data-disable
      >${label}</devtools-button>
    `;
    // clang-format on
}, _FieldSettingsDialog_onUrlOverrideChange = function _FieldSettingsDialog_onUrlOverrideChange(event) {
    event.stopPropagation();
    const input = event.target;
    __classPrivateFieldSet(this, _FieldSettingsDialog_urlOverride, input.value, "f");
    __classPrivateFieldSet(this, _FieldSettingsDialog_urlOverrideWarning, '', "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _FieldSettingsDialog_render, "f"));
}, _FieldSettingsDialog_onUrlOverrideEnabledChange = function _FieldSettingsDialog_onUrlOverrideEnabledChange(event) {
    event.stopPropagation();
    const input = event.target;
    __classPrivateFieldSet(this, _FieldSettingsDialog_urlOverrideEnabled, input.checked, "f");
    __classPrivateFieldSet(this, _FieldSettingsDialog_urlOverrideWarning, '', "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _FieldSettingsDialog_render, "f"));
}, _FieldSettingsDialog_getOrigin = function _FieldSettingsDialog_getOrigin(url) {
    try {
        return new URL(url).origin;
    }
    catch {
        return null;
    }
}, _FieldSettingsDialog_renderOriginMapGrid = function _FieldSettingsDialog_renderOriginMapGrid() {
    // clang-format off
    return html `
      <div class="origin-mapping-description">${i18nString(UIStrings.mapDevelopmentOrigins)}</div>
      <devtools-origin-map
        on-render=${ComponentHelpers.Directives.nodeRenderedCallback(node => {
        __classPrivateFieldSet(this, _FieldSettingsDialog_originMap, node, "f");
    })}
      ></devtools-origin-map>
      <div class="origin-mapping-button-section">
        <devtools-button
          @click=${() => __classPrivateFieldGet(this, _FieldSettingsDialog_originMap, "f")?.startCreation()}
          .data=${{
        variant: "text" /* Buttons.Button.Variant.TEXT */,
        title: i18nString(UIStrings.new),
        iconName: 'plus',
    }}
          jslogContext=${'new-origin-mapping'}
        >${i18nString(UIStrings.new)}</devtools-button>
      </div>
    `;
    // clang-format on
};
customElements.define('devtools-field-settings-dialog', FieldSettingsDialog);
//# sourceMappingURL=FieldSettingsDialog.js.map