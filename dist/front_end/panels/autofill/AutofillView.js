// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _AutofillView_instances, _AutofillView_shadow, _AutofillView_autoOpenViewSetting, _AutofillView_showTestAddressesInAutofillMenuSetting, _AutofillView_address, _AutofillView_filledFields, _AutofillView_matches, _AutofillView_highlightedMatches, _AutofillView_onPrimaryPageChanged, _AutofillView_onAddressFormFilled, _AutofillView_render, _AutofillView_onAutoOpenCheckboxChanged, _AutofillView_onShowTestAddressesInAutofillMenuChanged, _AutofillView_renderAddress, _AutofillView_onSpanMouseEnter, _AutofillView_onSpanMouseLeave, _AutofillView_renderFilledFields, _AutofillView_onGridRowMouseEnter, _AutofillView_onGridRowMouseLeave;
import '../../ui/components/adorners/adorners.js';
import '../../ui/legacy/components/data_grid/data_grid.js';
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as AutofillManager from '../../models/autofill_manager/autofill_manager.js';
import * as ComponentHelpers from '../../ui/components/helpers/helpers.js';
import * as LegacyWrapper from '../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import autofillViewStyles from './autofillView.css.js';
const { html, render, Directives: { styleMap } } = Lit;
const { FillingStrategy } = Protocol.Autofill;
const UIStrings = {
    /**
     * @description Text shown when there is no data on autofill available.
     */
    noAutofill: 'No autofill detected',
    /**
     * @description Explanation for how to populate the autofill panel with data. Shown when there is
     * no data available.
     */
    toStartDebugging: 'To start debugging autofill, use Chrome\'s autofill menu to fill an address form.',
    /**
     * @description Column header for column containing form field values
     */
    value: 'Value',
    /**
     * @description Column header for column containing the predicted autofill categories
     */
    predictedAutofillValue: 'Predicted autofill value',
    /**
     * @description Column header for column containing the name/label/id of form fields
     */
    formField: 'Form field',
    /**
     * @description Tooltip for an adorner for form fields which have an autocomplete attribute
     * (http://go/mdn/HTML/Attributes/autocomplete)
     */
    autocompleteAttribute: 'Autocomplete attribute',
    /**
     * @description Abbreviation of 'attribute'. Text content of an adorner for form fields which
     * have an autocomplete attribute (http://go/mdn/HTML/Attributes/autocomplete)
     */
    attr: 'attr',
    /**
     * @description Tooltip for an adorner for form fields which don't have an autocomplete attribute
     * (http://go/mdn/HTML/Attributes/autocomplete) and for which Chrome used heuristics to deduce
     * the form field's autocomplete category.
     */
    inferredByHeuristics: 'Inferred by heuristics',
    /**
     * @description Abbreviation of 'heuristics'. Text content of an adorner for form fields which
     * don't have an autocomplete attribute (http://go/mdn/HTML/Attributes/autocomplete) and for
     * which Chrome used heuristics to deduce the form field's autocomplete category.
     */
    heur: 'heur',
    /**
     * @description Label for checkbox in the Autofill panel. If checked, this panel will open
     * automatically whenever a form is being autofilled.
     */
    autoShow: 'Automatically open this panel',
    /**
     * @description Label for checkbox in the Autofill panel. If checked, test addresses will be added to the Autofill popup.
     */
    showTestAddressesInAutofillMenu: 'Show test addresses in autofill menu',
    /**
     * @description Tooltip text for a checkbox label in the Autofill panel. If checked, this panel
     * will open automatically whenever a form is being autofilled.
     */
    autoShowTooltip: 'Open the autofill panel automatically when an autofill activity is detected.',
    /**
     * @description Aria text for the section of the autofill view containing a preview of the autofilled address.
     */
    addressPreview: 'Address preview',
    /**
     * @description Aria text for the section of the autofill view containing the info about the autofilled form fields.
     */
    formInspector: 'Form inspector',
    /**
     *@description Link text for a hyperlink to more documentation
     */
    learnMore: 'Learn more',
    /**
     *@description Link text for a hyperlink to webpage for leaving user feedback
     */
    sendFeedback: 'Send feedback',
};
const AUTOFILL_INFO_URL = 'https://goo.gle/devtools-autofill-panel';
const AUTOFILL_FEEDBACK_URL = 'https://crbug.com/329106326';
const str_ = i18n.i18n.registerUIStrings('panels/autofill/AutofillView.ts', UIStrings);
export const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AutofillView extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super();
        _AutofillView_instances.add(this);
        _AutofillView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _AutofillView_autoOpenViewSetting.set(this, void 0);
        _AutofillView_showTestAddressesInAutofillMenuSetting.set(this, void 0);
        _AutofillView_address.set(this, '');
        _AutofillView_filledFields.set(this, []);
        _AutofillView_matches.set(this, []);
        _AutofillView_highlightedMatches.set(this, []);
        __classPrivateFieldSet(this, _AutofillView_autoOpenViewSetting, Common.Settings.Settings.instance().createSetting('auto-open-autofill-view-on-event', true), "f");
        __classPrivateFieldSet(this, _AutofillView_showTestAddressesInAutofillMenuSetting, Common.Settings.Settings.instance().createSetting('show-test-addresses-in-autofill-menu-on-event', false), "f");
    }
    connectedCallback() {
        var _a, _b, _c;
        const autofillManager = AutofillManager.AutofillManager.AutofillManager.instance();
        const formFilledEvent = autofillManager.getLastFilledAddressForm();
        if (formFilledEvent) {
            (_a = this, _b = this, _c = this, {
                address: ({ set value(_d) { __classPrivateFieldSet(_a, _AutofillView_address, _d, "f"); } }).value,
                filledFields: ({ set value(_d) { __classPrivateFieldSet(_b, _AutofillView_filledFields, _d, "f"); } }).value,
                matches: ({ set value(_d) { __classPrivateFieldSet(_c, _AutofillView_matches, _d, "f"); } }).value,
            } = formFilledEvent);
        }
        autofillManager.addEventListener("AddressFormFilled" /* AutofillManager.AutofillManager.Events.ADDRESS_FORM_FILLED */, __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_onAddressFormFilled), this);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.ResourceTreeModel.ResourceTreeModel, SDK.ResourceTreeModel.Events.PrimaryPageChanged, __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_onPrimaryPageChanged), this);
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_render));
    }
}
_AutofillView_shadow = new WeakMap(), _AutofillView_autoOpenViewSetting = new WeakMap(), _AutofillView_showTestAddressesInAutofillMenuSetting = new WeakMap(), _AutofillView_address = new WeakMap(), _AutofillView_filledFields = new WeakMap(), _AutofillView_matches = new WeakMap(), _AutofillView_highlightedMatches = new WeakMap(), _AutofillView_instances = new WeakSet(), _AutofillView_onPrimaryPageChanged = function _AutofillView_onPrimaryPageChanged() {
    __classPrivateFieldSet(this, _AutofillView_address, '', "f");
    __classPrivateFieldSet(this, _AutofillView_filledFields, [], "f");
    __classPrivateFieldSet(this, _AutofillView_matches, [], "f");
    __classPrivateFieldSet(this, _AutofillView_highlightedMatches, [], "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_render));
}, _AutofillView_onAddressFormFilled = function _AutofillView_onAddressFormFilled({ data }) {
    var _a, _b, _c;
    (_a = this, _b = this, _c = this, {
        address: ({ set value(_d) { __classPrivateFieldSet(_a, _AutofillView_address, _d, "f"); } }).value,
        filledFields: ({ set value(_d) { __classPrivateFieldSet(_b, _AutofillView_filledFields, _d, "f"); } }).value,
        matches: ({ set value(_d) { __classPrivateFieldSet(_c, _AutofillView_matches, _d, "f"); } }).value,
    } = data);
    __classPrivateFieldSet(this, _AutofillView_highlightedMatches, [], "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_render));
}, _AutofillView_render = async function _AutofillView_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('AutofillView render was not scheduled');
    }
    if (!__classPrivateFieldGet(this, _AutofillView_address, "f") && !__classPrivateFieldGet(this, _AutofillView_filledFields, "f").length) {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        render(html `
        <style>${autofillViewStyles}</style>
        <style>${UI.inspectorCommonStyles}</style>
        <main>
          <div class="top-left-corner">
            <devtools-checkbox
                ?checked=${__classPrivateFieldGet(this, _AutofillView_showTestAddressesInAutofillMenuSetting, "f").get()}
                title=${i18nString(UIStrings.showTestAddressesInAutofillMenu)}
                @change=${__classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_onShowTestAddressesInAutofillMenuChanged).bind(this)}
                jslog=${VisualLogging.toggle(__classPrivateFieldGet(this, _AutofillView_showTestAddressesInAutofillMenuSetting, "f").name).track({ change: true })}>
              ${i18nString(UIStrings.showTestAddressesInAutofillMenu)}
            </devtools-checkbox>
            <devtools-checkbox
                title=${i18nString(UIStrings.autoShowTooltip)}
                ?checked=${__classPrivateFieldGet(this, _AutofillView_autoOpenViewSetting, "f").get()}
                @change=${__classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_onAutoOpenCheckboxChanged).bind(this)}
                jslog=${VisualLogging.toggle(__classPrivateFieldGet(this, _AutofillView_autoOpenViewSetting, "f").name).track({ change: true })}>
              ${i18nString(UIStrings.autoShow)}
            </devtools-checkbox>
            <x-link href=${AUTOFILL_FEEDBACK_URL} class="feedback link" jslog=${VisualLogging.link('feedback').track({ click: true })}>${i18nString(UIStrings.sendFeedback)}</x-link>
          </div>
          <div class="placeholder-container" jslog=${VisualLogging.pane('autofill-empty')}>
            <div class="empty-state">
              <span class="empty-state-header">${i18nString(UIStrings.noAutofill)}</span>
              <div class="empty-state-description">
                <span>${i18nString(UIStrings.toStartDebugging)}</span>
                <x-link href=${AUTOFILL_INFO_URL} class="link" jslog=${VisualLogging.link('learn-more').track({ click: true })}>${i18nString(UIStrings.learnMore)}</x-link>
              </div>
            </div>
          </div>
        </main>
      `, __classPrivateFieldGet(this, _AutofillView_shadow, "f"), { host: this });
        // clang-format on
        return;
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${autofillViewStyles}</style>
      <style>${UI.inspectorCommonStyles}</style>
      <main>
        <div class="content-container" jslog=${VisualLogging.pane('autofill')}>
          <div class="right-to-left" role="region" aria-label=${i18nString(UIStrings.addressPreview)}>
            <div class="header">
              <div class="label-container">
                <devtools-checkbox
                    title=${i18nString(UIStrings.showTestAddressesInAutofillMenu)}
                    ?checked=${__classPrivateFieldGet(this, _AutofillView_showTestAddressesInAutofillMenuSetting, "f").get()}
                    @change=${__classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_onShowTestAddressesInAutofillMenuChanged).bind(this)}
                    jslog=${VisualLogging.toggle(__classPrivateFieldGet(this, _AutofillView_showTestAddressesInAutofillMenuSetting, "f").name).track({ change: true })}
                  >${i18nString(UIStrings.showTestAddressesInAutofillMenu)}
                </devtools-checkbox>
              </div>
              <div class="label-container">
                <devtools-checkbox
                    title=${i18nString(UIStrings.autoShowTooltip)}
                    ?checked=${__classPrivateFieldGet(this, _AutofillView_autoOpenViewSetting, "f").get()}
                    @change=${__classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_onAutoOpenCheckboxChanged).bind(this)}
                    jslog=${VisualLogging.toggle(__classPrivateFieldGet(this, _AutofillView_autoOpenViewSetting, "f").name).track({ change: true })}
                  >${i18nString(UIStrings.autoShow)}
                </devtools-checkbox>
              </div>
              <x-link href=${AUTOFILL_FEEDBACK_URL} class="feedback link" jslog=${VisualLogging.link('feedback').track({ click: true })}>${i18nString(UIStrings.sendFeedback)}</x-link>
            </div>
            ${__classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_renderAddress).call(this)}
          </div>
          ${__classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_renderFilledFields).call(this)}
        </div>
      </main>
    `, __classPrivateFieldGet(this, _AutofillView_shadow, "f"), { host: this });
    // clang-format on
}, _AutofillView_onAutoOpenCheckboxChanged = function _AutofillView_onAutoOpenCheckboxChanged(e) {
    const { checked } = e.target;
    __classPrivateFieldGet(this, _AutofillView_autoOpenViewSetting, "f").set(checked);
}, _AutofillView_onShowTestAddressesInAutofillMenuChanged = function _AutofillView_onShowTestAddressesInAutofillMenuChanged(e) {
    const { checked } = e.target;
    __classPrivateFieldGet(this, _AutofillView_showTestAddressesInAutofillMenuSetting, "f").set(checked);
    AutofillManager.AutofillManager.AutofillManager.instance().onShowAutofillTestAddressesSettingsChanged();
}, _AutofillView_renderAddress = function _AutofillView_renderAddress() {
    if (!__classPrivateFieldGet(this, _AutofillView_address, "f")) {
        return Lit.nothing;
    }
    const createSpan = (startIndex, endIndex) => {
        const textContentLines = __classPrivateFieldGet(this, _AutofillView_address, "f").substring(startIndex, endIndex).split('\n');
        const templateLines = textContentLines.map((line, i) => i === textContentLines.length - 1 ? line : html `${line}<br>`);
        const hasMatches = __classPrivateFieldGet(this, _AutofillView_matches, "f").some(match => match.startIndex <= startIndex && match.endIndex > startIndex);
        if (!hasMatches) {
            return html `<span>${templateLines}</span>`;
        }
        const spanClasses = Lit.Directives.classMap({
            'matches-filled-field': hasMatches,
            highlighted: __classPrivateFieldGet(this, _AutofillView_highlightedMatches, "f").some(match => match.startIndex <= startIndex && match.endIndex > startIndex),
        });
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
        <span
          class=${spanClasses}
          @mouseenter=${() => __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_onSpanMouseEnter).call(this, startIndex)}
          @mouseleave=${__classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_onSpanMouseLeave)}
          jslog=${VisualLogging.item('matched-address-item').track({ hover: true })}
        >${templateLines}</span>`;
        // clang-format on
    };
    // Split the address string into multiple spans. Each span is connected to
    // 0 or more matches. This allows highlighting the corresponding grid rows
    // when hovering over a span. And vice versa finding the corresponding
    // spans to highlight when hovering over a grid line.
    const spans = [];
    const matchIndices = new Set([0, __classPrivateFieldGet(this, _AutofillView_address, "f").length]);
    for (const match of __classPrivateFieldGet(this, _AutofillView_matches, "f")) {
        matchIndices.add(match.startIndex);
        matchIndices.add(match.endIndex);
    }
    const sortedMatchIndices = Array.from(matchIndices).sort((a, b) => a - b);
    for (let i = 0; i < sortedMatchIndices.length - 1; i++) {
        spans.push(createSpan(sortedMatchIndices[i], sortedMatchIndices[i + 1]));
    }
    return html `
      <div class="address">
        ${spans}
      </div>
    `;
}, _AutofillView_onSpanMouseEnter = function _AutofillView_onSpanMouseEnter(startIndex) {
    __classPrivateFieldSet(this, _AutofillView_highlightedMatches, __classPrivateFieldGet(this, _AutofillView_matches, "f").filter(match => match.startIndex <= startIndex && match.endIndex > startIndex), "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_render));
}, _AutofillView_onSpanMouseLeave = function _AutofillView_onSpanMouseLeave() {
    __classPrivateFieldSet(this, _AutofillView_highlightedMatches, [], "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_render));
}, _AutofillView_renderFilledFields = function _AutofillView_renderFilledFields() {
    if (!__classPrivateFieldGet(this, _AutofillView_filledFields, "f").length) {
        return Lit.nothing;
    }
    const highlightedGridRows = new Set(__classPrivateFieldGet(this, _AutofillView_highlightedMatches, "f").map(match => match.filledFieldIndex));
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <div class="grid-wrapper" role="region" aria-label=${i18nString(UIStrings.formInspector)}>
        <devtools-data-grid
          striped
          class="filled-fields-grid"
        >
          <table>
            <tr>
              <th id="name" weight="50" sortable>${i18nString(UIStrings.formField)}</th>
              <th id="autofill-type" weight="50" sortable>${i18nString(UIStrings.predictedAutofillValue)}</th>
              <th id="value" weight="50" sortable>${i18nString(UIStrings.value)}</th>
            </tr>
            ${__classPrivateFieldGet(this, _AutofillView_filledFields, "f").map((field, index) => html `
                <tr style=${styleMap({
        'font-family': 'var(--monospace-font-family)',
        'font-size': 'var(--monospace-font-size)',
        'background-color': highlightedGridRows.has(index) ? 'var(--sys-color-state-hover-on-subtle)' : null,
    })}
                  @mouseenter=${() => __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_onGridRowMouseEnter).call(this, index)}
                  @mouseleave=${__classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_onGridRowMouseLeave).bind(this)}
                >
                  <td>${field.name || `#${field.id}`} (${field.htmlType})</td>
                  <td>
                      ${field.autofillType}
                      ${field.fillingStrategy === "autocompleteAttribute" /* FillingStrategy.AutocompleteAttribute */ ?
        html `<devtools-adorner title=${i18nString(UIStrings.autocompleteAttribute)} .data=${{ name: field.fillingStrategy }}>
                              <span>${i18nString(UIStrings.attr)}</span>
                            </devtools-adorner>` :
        field.fillingStrategy === "autofillInferred" /* FillingStrategy.AutofillInferred */ ?
            html `<devtools-adorner title=${i18nString(UIStrings.inferredByHeuristics)} .data=${{ name: field.fillingStrategy }}>
                              <span>${i18nString(UIStrings.heur)}</span>
                            </devtools-adorner>` :
            Lit.nothing}
                  </td>
                  <td>"${field.value}"</td>
                </tr>`)}
          </table>
        </devtools-data-grid>
      </div>
    `;
    // clang-format on
}, _AutofillView_onGridRowMouseEnter = function _AutofillView_onGridRowMouseEnter(rowIndex) {
    __classPrivateFieldSet(this, _AutofillView_highlightedMatches, __classPrivateFieldGet(this, _AutofillView_matches, "f").filter(match => match.filledFieldIndex === rowIndex), "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_render));
    const backendNodeId = __classPrivateFieldGet(this, _AutofillView_filledFields, "f")[rowIndex].fieldId;
    const target = SDK.FrameManager.FrameManager.instance()
        .getFrame(__classPrivateFieldGet(this, _AutofillView_filledFields, "f")[rowIndex].frameId)
        ?.resourceTreeModel()
        .target();
    if (target) {
        const deferredNode = new SDK.DOMModel.DeferredDOMNode(target, backendNodeId);
        const domModel = target.model(SDK.DOMModel.DOMModel);
        if (deferredNode && domModel) {
            domModel.overlayModel().highlightInOverlay({ deferredNode }, 'all');
        }
    }
}, _AutofillView_onGridRowMouseLeave = function _AutofillView_onGridRowMouseLeave() {
    __classPrivateFieldSet(this, _AutofillView_highlightedMatches, [], "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _AutofillView_instances, "m", _AutofillView_render));
    SDK.OverlayModel.OverlayModel.hideDOMNodeHighlight();
};
customElements.define('devtools-autofill-view', AutofillView);
//# sourceMappingURL=AutofillView.js.map