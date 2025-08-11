// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _IgnoreListSetting_instances, _IgnoreListSetting_shadow, _IgnoreListSetting_ignoreListEnabled, _IgnoreListSetting_regexPatterns, _IgnoreListSetting_newRegexCheckbox, _IgnoreListSetting_newRegexInput, _IgnoreListSetting_editingRegexSetting, _IgnoreListSetting_scheduleRender, _IgnoreListSetting_getSkipStackFramesPatternSetting, _IgnoreListSetting_startEditing, _IgnoreListSetting_finishEditing, _IgnoreListSetting_resetInput, _IgnoreListSetting_addNewRegexToIgnoreList, _IgnoreListSetting_handleKeyDown, _IgnoreListSetting_getExistingRegexes, _IgnoreListSetting_handleInputChange, _IgnoreListSetting_initAddNewItem, _IgnoreListSetting_renderNewRegexRow, _IgnoreListSetting_onExistingRegexEnableToggle, _IgnoreListSetting_removeRegexByIndex, _IgnoreListSetting_renderItem, _IgnoreListSetting_render;
import '../../../ui/components/menus/menus.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Bindings from '../../../models/bindings/bindings.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as Dialogs from '../../../ui/components/dialogs/dialogs.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import ignoreListSettingStyles from './ignoreListSetting.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Text title for the button to open the ignore list setting.
     */
    showIgnoreListSettingDialog: 'Show ignore list setting dialog',
    /**
     * @description Text title for ignore list setting.
     */
    ignoreList: 'Ignore list',
    /**
     * @description Text description for ignore list setting.
     */
    ignoreListDescription: 'Add regular expression rules to remove matching scripts from the flame chart.',
    /**
     *@description Pattern title in Framework Ignore List Settings Tab of the Settings
     *@example {ad.*?} regex
     */
    ignoreScriptsWhoseNamesMatchS: 'Ignore scripts whose names match \'\'{regex}\'\'',
    /**
     *@description Label for the button to remove an regex
     *@example {ad.*?} regex
     */
    removeRegex: 'Remove the regex: \'\'{regex}\'\'',
    /**
     *@description Aria accessible name in Ignore List Settings Dialog in Performance panel. It labels the input
     * field used to add new or edit existing regular expressions that match file names to ignore in the debugger.
     */
    addNewRegex: 'Add a regular expression rule for the script\'s URL',
    /**
     * @description Aria accessible name in Ignore List Settings Dialog in Performance panel. It labels the checkbox of
     * the input field used to enable the new regular expressions that match file names to ignore in the debugger.
     */
    ignoreScriptsWhoseNamesMatchNewRegex: 'Ignore scripts whose names match the new regex',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/IgnoreListSetting.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class IgnoreListSetting extends HTMLElement {
    constructor() {
        super();
        _IgnoreListSetting_instances.add(this);
        _IgnoreListSetting_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _IgnoreListSetting_ignoreListEnabled.set(this, Common.Settings.Settings.instance().moduleSetting('enable-ignore-listing'));
        _IgnoreListSetting_regexPatterns.set(this, __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_getSkipStackFramesPatternSetting).call(this).getAsArray());
        _IgnoreListSetting_newRegexCheckbox.set(this, UI.UIUtils.CheckboxLabel.create(
        /* title*/ undefined, /* checked*/ false, /* subtitle*/ undefined, 
        /* jslogContext*/ 'timeline.ignore-list-new-regex.checkbox'));
        _IgnoreListSetting_newRegexInput.set(this, UI.UIUtils.createInput(
        /* className*/ 'new-regex-text-input', /* type*/ 'text', /* jslogContext*/ 'timeline.ignore-list-new-regex.text'));
        _IgnoreListSetting_editingRegexSetting.set(this, null);
        __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_initAddNewItem).call(this);
        Common.Settings.Settings.instance()
            .moduleSetting('skip-stack-frames-pattern')
            .addChangeListener(__classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_scheduleRender).bind(this));
        Common.Settings.Settings.instance()
            .moduleSetting('enable-ignore-listing')
            .addChangeListener(__classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_scheduleRender).bind(this));
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_scheduleRender).call(this);
        // Prevent the event making its way to the TimelinePanel element which will
        // cause the "Load Profile" context menu to appear.
        this.addEventListener('contextmenu', e => {
            e.stopPropagation();
        });
    }
}
_IgnoreListSetting_shadow = new WeakMap(), _IgnoreListSetting_ignoreListEnabled = new WeakMap(), _IgnoreListSetting_regexPatterns = new WeakMap(), _IgnoreListSetting_newRegexCheckbox = new WeakMap(), _IgnoreListSetting_newRegexInput = new WeakMap(), _IgnoreListSetting_editingRegexSetting = new WeakMap(), _IgnoreListSetting_instances = new WeakSet(), _IgnoreListSetting_scheduleRender = function _IgnoreListSetting_scheduleRender() {
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_render));
}, _IgnoreListSetting_getSkipStackFramesPatternSetting = function _IgnoreListSetting_getSkipStackFramesPatternSetting() {
    return Common.Settings.Settings.instance().moduleSetting('skip-stack-frames-pattern');
}, _IgnoreListSetting_startEditing = function _IgnoreListSetting_startEditing() {
    // Do not need to trim here because this is a temporary one, we will trim the input when finish editing,
    __classPrivateFieldSet(this, _IgnoreListSetting_editingRegexSetting, { pattern: __classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f").value, disabled: false, disabledForUrl: undefined }, "f");
    // We need to push the temp regex here to update the flame chart.
    // We are using the "skip-stack-frames-pattern" setting to determine which is rendered on flame chart. And the push
    // here will update the setting's value.
    __classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f").push(__classPrivateFieldGet(this, _IgnoreListSetting_editingRegexSetting, "f"));
}, _IgnoreListSetting_finishEditing = function _IgnoreListSetting_finishEditing() {
    if (!__classPrivateFieldGet(this, _IgnoreListSetting_editingRegexSetting, "f")) {
        return;
    }
    const lastRegex = __classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f").pop();
    // Add a sanity check to make sure the last one is the editing one.
    // In case the check fails, add back the last element.
    if (lastRegex && lastRegex !== __classPrivateFieldGet(this, _IgnoreListSetting_editingRegexSetting, "f")) {
        console.warn('The last regex is not the editing one.');
        __classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f").push(lastRegex);
    }
    __classPrivateFieldSet(this, _IgnoreListSetting_editingRegexSetting, null, "f");
    __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_getSkipStackFramesPatternSetting).call(this).setAsArray(__classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f"));
}, _IgnoreListSetting_resetInput = function _IgnoreListSetting_resetInput() {
    __classPrivateFieldGet(this, _IgnoreListSetting_newRegexCheckbox, "f").checked = false;
    __classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f").value = '';
}, _IgnoreListSetting_addNewRegexToIgnoreList = function _IgnoreListSetting_addNewRegexToIgnoreList() {
    const newRegex = __classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f").value.trim();
    __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_finishEditing).call(this);
    if (!regexInputIsValid(newRegex)) {
        // It the new regex is invalid, let's skip it.
        return;
    }
    Bindings.IgnoreListManager.IgnoreListManager.instance().addRegexToIgnoreList(newRegex);
    __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_resetInput).call(this);
}, _IgnoreListSetting_handleKeyDown = function _IgnoreListSetting_handleKeyDown(event) {
    // When user press the 'Enter', the current regex will be added and user can keep adding more regexes.
    if (event.key === Platform.KeyboardUtilities.ENTER_KEY) {
        __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_addNewRegexToIgnoreList).call(this);
        __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_startEditing).call(this);
        return;
    }
    // When user press the 'Escape', it means cancel the editing, so the current regex won't be added and the input will
    // lose focus.
    if (event.key === Platform.KeyboardUtilities.ESCAPE_KEY) {
        // Escape key will close the dialog, and toggle the `Console` drawer. So we need to ignore other listeners.
        event.stopImmediatePropagation();
        __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_finishEditing).call(this);
        __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_resetInput).call(this);
        __classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f").blur();
    }
}, _IgnoreListSetting_getExistingRegexes = function _IgnoreListSetting_getExistingRegexes() {
    if (__classPrivateFieldGet(this, _IgnoreListSetting_editingRegexSetting, "f")) {
        const lastRegex = __classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f")[__classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f").length - 1];
        // Add a sanity check to make sure the last one is the editing one.
        if (lastRegex && lastRegex === __classPrivateFieldGet(this, _IgnoreListSetting_editingRegexSetting, "f")) {
            // We don't want to modify the array itself, so just return a shadow copy of it.
            return __classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f").slice(0, -1);
        }
    }
    return __classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f");
}, _IgnoreListSetting_handleInputChange = function _IgnoreListSetting_handleInputChange() {
    const newRegex = __classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f").value.trim();
    if (__classPrivateFieldGet(this, _IgnoreListSetting_editingRegexSetting, "f") && regexInputIsValid(newRegex)) {
        __classPrivateFieldGet(this, _IgnoreListSetting_editingRegexSetting, "f").pattern = newRegex;
        __classPrivateFieldGet(this, _IgnoreListSetting_editingRegexSetting, "f").disabled = !Boolean(newRegex);
        __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_getSkipStackFramesPatternSetting).call(this).setAsArray(__classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f"));
    }
}, _IgnoreListSetting_initAddNewItem = function _IgnoreListSetting_initAddNewItem() {
    __classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f").placeholder = '/framework\\.js$';
    const checkboxHelpText = i18nString(UIStrings.ignoreScriptsWhoseNamesMatchNewRegex);
    const inputHelpText = i18nString(UIStrings.addNewRegex);
    UI.Tooltip.Tooltip.install(__classPrivateFieldGet(this, _IgnoreListSetting_newRegexCheckbox, "f"), checkboxHelpText);
    UI.Tooltip.Tooltip.install(__classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f"), inputHelpText);
    __classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f").addEventListener('blur', __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_addNewRegexToIgnoreList).bind(this), false);
    __classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f").addEventListener('keydown', __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_handleKeyDown).bind(this), false);
    __classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f").addEventListener('input', __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_handleInputChange).bind(this), false);
    __classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f").addEventListener('focus', __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_startEditing).bind(this), false);
}, _IgnoreListSetting_renderNewRegexRow = function _IgnoreListSetting_renderNewRegexRow() {
    // clang-format off
    return html `
      <div class='new-regex-row'>${__classPrivateFieldGet(this, _IgnoreListSetting_newRegexCheckbox, "f")}${__classPrivateFieldGet(this, _IgnoreListSetting_newRegexInput, "f")}</div>
    `;
    // clang-format on
}, _IgnoreListSetting_onExistingRegexEnableToggle = function _IgnoreListSetting_onExistingRegexEnableToggle(regex, checkbox) {
    regex.disabled = !checkbox.checked;
    // Technically we don't need to call the set function, because the regex is a reference, so it changed the setting
    // value directly.
    // But we need to call the set function to trigger the setting change event. which is needed by view update of flame
    // chart.
    __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_getSkipStackFramesPatternSetting).call(this).setAsArray(__classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f"));
    // There is no need to update this component, since the only UI change is this checkbox, which is already done by
    // the user.
}, _IgnoreListSetting_removeRegexByIndex = function _IgnoreListSetting_removeRegexByIndex(index) {
    __classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f").splice(index, 1);
    // Call the set function to trigger the setting change event. we listen to this event and will update this component
    // and the flame chart.
    __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_getSkipStackFramesPatternSetting).call(this).setAsArray(__classPrivateFieldGet(this, _IgnoreListSetting_regexPatterns, "f"));
}, _IgnoreListSetting_renderItem = function _IgnoreListSetting_renderItem(regex, index) {
    const checkboxWithLabel = UI.UIUtils.CheckboxLabel.createWithStringLiteral(regex.pattern, !regex.disabled, /* jslogContext*/ 'timeline.ignore-list-pattern');
    const helpText = i18nString(UIStrings.ignoreScriptsWhoseNamesMatchS, { regex: regex.pattern });
    UI.Tooltip.Tooltip.install(checkboxWithLabel, helpText);
    checkboxWithLabel.ariaLabel = helpText;
    checkboxWithLabel.addEventListener('change', __classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_onExistingRegexEnableToggle).bind(this, regex, checkboxWithLabel), false);
    // clang-format off
    return html `
      <div class='regex-row'>
        ${checkboxWithLabel}
        <devtools-button
            @click=${__classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_removeRegexByIndex).bind(this, index)}
            .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        iconName: 'bin',
        title: i18nString(UIStrings.removeRegex, { regex: regex.pattern }),
        jslogContext: 'timeline.ignore-list-pattern.remove',
    }}></devtools-button>
      </div>
    `;
    // clang-format on
}, _IgnoreListSetting_render = function _IgnoreListSetting_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('Ignore List setting dialog render was not scheduled');
    }
    // clang-format off
    const output = html `
      <style>${ignoreListSettingStyles}</style>
      <devtools-button-dialog .data=${{
        openOnRender: false,
        jslogContext: 'timeline.ignore-list',
        variant: "toolbar" /* Buttons.Button.Variant.TOOLBAR */,
        iconName: 'compress',
        disabled: !__classPrivateFieldGet(this, _IgnoreListSetting_ignoreListEnabled, "f").get(),
        iconTitle: i18nString(UIStrings.showIgnoreListSettingDialog),
        horizontalAlignment: "auto" /* Dialogs.Dialog.DialogHorizontalAlignment.AUTO */,
        closeButton: true,
        dialogTitle: i18nString(UIStrings.ignoreList),
    }}>
        <div class='ignore-list-setting-content'>
          <div class='ignore-list-setting-description'>${i18nString(UIStrings.ignoreListDescription)}</div>
          ${__classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_getExistingRegexes).call(this).map(__classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_renderItem).bind(this))}
          ${__classPrivateFieldGet(this, _IgnoreListSetting_instances, "m", _IgnoreListSetting_renderNewRegexRow).call(this)}
        </div>
      </devtools-button-dialog>
    `;
    // clang-format on
    Lit.render(output, __classPrivateFieldGet(this, _IgnoreListSetting_shadow, "f"), { host: this });
};
customElements.define('devtools-perf-ignore-list-setting', IgnoreListSetting);
/**
 * Returns if a new regex string is valid to be added to the ignore list.
 * Note that things like duplicates are handled by the IgnoreList for us.
 *
 * @param inputValue the text input from the user we need to validate.
 */
export function regexInputIsValid(inputValue) {
    const pattern = inputValue.trim();
    if (!pattern.length) {
        return false;
    }
    let regex;
    try {
        regex = new RegExp(pattern);
    }
    catch {
    }
    return Boolean(regex);
}
//# sourceMappingURL=IgnoreListSetting.js.map