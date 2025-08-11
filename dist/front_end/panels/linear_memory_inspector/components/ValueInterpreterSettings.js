// Copyright (c) 2020 The Chromium Authors. All rights reserved.
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
var _ValueInterpreterSettings_instances, _ValueInterpreterSettings_shadow, _ValueInterpreterSettings_valueTypes, _ValueInterpreterSettings_render, _ValueInterpreterSettings_plotTypeSelections, _ValueInterpreterSettings_onTypeToggle;
import '../../../ui/legacy/legacy.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import { valueTypeToLocalizedString } from './ValueInterpreterDisplayUtils.js';
import valueInterpreterSettingsStyles from './valueInterpreterSettings.css.js';
const { render, html } = Lit;
const UIStrings = {
    /**
     *@description Name of a group of selectable value types that do not fall under integer and floating point value types, e.g. Pointer32. The group appears name appears under the Value Interpreter Settings.
     */
    otherGroup: 'Other',
};
const str_ = i18n.i18n.registerUIStrings('panels/linear_memory_inspector/components/ValueInterpreterSettings.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
var ValueTypeGroup;
(function (ValueTypeGroup) {
    ValueTypeGroup["INTEGER"] = "Integer";
    ValueTypeGroup["FLOAT"] = "Floating point";
    ValueTypeGroup["OTHER"] = "Other";
})(ValueTypeGroup || (ValueTypeGroup = {}));
const GROUP_TO_TYPES = new Map([
    ["Integer" /* ValueTypeGroup.INTEGER */, ["Integer 8-bit" /* ValueType.INT8 */, "Integer 16-bit" /* ValueType.INT16 */, "Integer 32-bit" /* ValueType.INT32 */, "Integer 64-bit" /* ValueType.INT64 */]],
    ["Floating point" /* ValueTypeGroup.FLOAT */, ["Float 32-bit" /* ValueType.FLOAT32 */, "Float 64-bit" /* ValueType.FLOAT64 */]],
    ["Other" /* ValueTypeGroup.OTHER */, ["Pointer 32-bit" /* ValueType.POINTER32 */, "Pointer 64-bit" /* ValueType.POINTER64 */]],
]);
function valueTypeGroupToLocalizedString(group) {
    if (group === "Other" /* ValueTypeGroup.OTHER */) {
        return i18nString(UIStrings.otherGroup);
    }
    // The remaining group type names should not be localized.
    return group;
}
export class TypeToggleEvent extends Event {
    constructor(type, checked) {
        super(TypeToggleEvent.eventName);
        this.data = { type, checked };
    }
}
TypeToggleEvent.eventName = 'typetoggle';
export class ValueInterpreterSettings extends HTMLElement {
    constructor() {
        super(...arguments);
        _ValueInterpreterSettings_instances.add(this);
        _ValueInterpreterSettings_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ValueInterpreterSettings_valueTypes.set(this, new Set());
    }
    set data(data) {
        __classPrivateFieldSet(this, _ValueInterpreterSettings_valueTypes, data.valueTypes, "f");
        __classPrivateFieldGet(this, _ValueInterpreterSettings_instances, "m", _ValueInterpreterSettings_render).call(this);
    }
}
_ValueInterpreterSettings_shadow = new WeakMap(), _ValueInterpreterSettings_valueTypes = new WeakMap(), _ValueInterpreterSettings_instances = new WeakSet(), _ValueInterpreterSettings_render = function _ValueInterpreterSettings_render() {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${valueInterpreterSettingsStyles}</style>
      <div class="settings" jslog=${VisualLogging.pane('settings')}>
       ${[...GROUP_TO_TYPES.keys()].map(group => {
        return html `
          <div class="value-types-selection">
            <span class="group">${valueTypeGroupToLocalizedString(group)}</span>
            ${__classPrivateFieldGet(this, _ValueInterpreterSettings_instances, "m", _ValueInterpreterSettings_plotTypeSelections).call(this, group)}
          </div>
        `;
    })}
      </div>
      `, __classPrivateFieldGet(this, _ValueInterpreterSettings_shadow, "f"), { host: this });
}, _ValueInterpreterSettings_plotTypeSelections = function _ValueInterpreterSettings_plotTypeSelections(group) {
    const types = GROUP_TO_TYPES.get(group);
    if (!types) {
        throw new Error(`Unknown group ${group}`);
    }
    return html `
      ${types.map(type => {
        return html `
            <devtools-checkbox
              title=${valueTypeToLocalizedString(type)}
              ?checked=${__classPrivateFieldGet(this, _ValueInterpreterSettings_valueTypes, "f").has(type)}
              @change=${(e) => __classPrivateFieldGet(this, _ValueInterpreterSettings_instances, "m", _ValueInterpreterSettings_onTypeToggle).call(this, type, e)} jslog=${VisualLogging.toggle().track({ change: true }).context(Platform.StringUtilities.toKebabCase(type))}
              >${valueTypeToLocalizedString(type)}</devtools-checkbox>
     `;
    })}`;
}, _ValueInterpreterSettings_onTypeToggle = function _ValueInterpreterSettings_onTypeToggle(type, event) {
    const checkbox = event.target;
    this.dispatchEvent(new TypeToggleEvent(type, checkbox.checked));
};
customElements.define('devtools-linear-memory-inspector-interpreter-settings', ValueInterpreterSettings);
//# sourceMappingURL=ValueInterpreterSettings.js.map