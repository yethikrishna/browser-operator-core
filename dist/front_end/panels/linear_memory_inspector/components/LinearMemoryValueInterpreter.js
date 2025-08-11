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
var _LinearMemoryValueInterpreter_instances, _LinearMemoryValueInterpreter_shadow, _LinearMemoryValueInterpreter_endianness, _LinearMemoryValueInterpreter_buffer, _LinearMemoryValueInterpreter_valueTypes, _LinearMemoryValueInterpreter_valueTypeModeConfig, _LinearMemoryValueInterpreter_memoryLength, _LinearMemoryValueInterpreter_showSettings, _LinearMemoryValueInterpreter_render, _LinearMemoryValueInterpreter_onEndiannessChange, _LinearMemoryValueInterpreter_renderEndiannessSetting, _LinearMemoryValueInterpreter_onSettingsToggle, _LinearMemoryValueInterpreter_onTypeToggle;
import '../../../ui/components/icon_button/icon_button.js';
import './ValueInterpreterDisplay.js';
import './ValueInterpreterSettings.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import linearMemoryValueInterpreterStyles from './linearMemoryValueInterpreter.css.js';
const UIStrings = {
    /**
     *@description Tooltip text that appears when hovering over the gear button to open and close settings in the Linear memory inspector. These settings
     *             allow the user to change the value type to view, such as 32-bit Integer, or 32-bit Float.
     */
    toggleValueTypeSettings: 'Toggle value type settings',
    /**
     *@description Tooltip text that appears when hovering over the 'Little Endian' or 'Big Endian' setting in the Linear memory inspector.
     */
    changeEndianness: 'Change `Endianness`',
};
const str_ = i18n.i18n.registerUIStrings('panels/linear_memory_inspector/components/LinearMemoryValueInterpreter.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { render, html } = Lit;
export class EndiannessChangedEvent extends Event {
    constructor(endianness) {
        super(EndiannessChangedEvent.eventName);
        this.data = endianness;
    }
}
EndiannessChangedEvent.eventName = 'endiannesschanged';
export class ValueTypeToggledEvent extends Event {
    constructor(type, checked) {
        super(ValueTypeToggledEvent.eventName);
        this.data = { type, checked };
    }
}
ValueTypeToggledEvent.eventName = 'valuetypetoggled';
export class LinearMemoryValueInterpreter extends HTMLElement {
    constructor() {
        super(...arguments);
        _LinearMemoryValueInterpreter_instances.add(this);
        _LinearMemoryValueInterpreter_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _LinearMemoryValueInterpreter_endianness.set(this, "Little Endian" /* Endianness.LITTLE */);
        _LinearMemoryValueInterpreter_buffer.set(this, new ArrayBuffer(0));
        _LinearMemoryValueInterpreter_valueTypes.set(this, new Set());
        _LinearMemoryValueInterpreter_valueTypeModeConfig.set(this, new Map());
        _LinearMemoryValueInterpreter_memoryLength.set(this, 0);
        _LinearMemoryValueInterpreter_showSettings.set(this, false);
    }
    set data(data) {
        __classPrivateFieldSet(this, _LinearMemoryValueInterpreter_endianness, data.endianness, "f");
        __classPrivateFieldSet(this, _LinearMemoryValueInterpreter_buffer, data.value, "f");
        __classPrivateFieldSet(this, _LinearMemoryValueInterpreter_valueTypes, data.valueTypes, "f");
        __classPrivateFieldSet(this, _LinearMemoryValueInterpreter_valueTypeModeConfig, data.valueTypeModes || new Map(), "f");
        __classPrivateFieldSet(this, _LinearMemoryValueInterpreter_memoryLength, data.memoryLength, "f");
        __classPrivateFieldGet(this, _LinearMemoryValueInterpreter_instances, "m", _LinearMemoryValueInterpreter_render).call(this);
    }
}
_LinearMemoryValueInterpreter_shadow = new WeakMap(), _LinearMemoryValueInterpreter_endianness = new WeakMap(), _LinearMemoryValueInterpreter_buffer = new WeakMap(), _LinearMemoryValueInterpreter_valueTypes = new WeakMap(), _LinearMemoryValueInterpreter_valueTypeModeConfig = new WeakMap(), _LinearMemoryValueInterpreter_memoryLength = new WeakMap(), _LinearMemoryValueInterpreter_showSettings = new WeakMap(), _LinearMemoryValueInterpreter_instances = new WeakSet(), _LinearMemoryValueInterpreter_render = function _LinearMemoryValueInterpreter_render() {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${UI.inspectorCommonStyles}</style>
      <style>${linearMemoryValueInterpreterStyles}</style>
      <div class="value-interpreter">
        <div class="settings-toolbar">
          ${__classPrivateFieldGet(this, _LinearMemoryValueInterpreter_instances, "m", _LinearMemoryValueInterpreter_renderEndiannessSetting).call(this)}
          <devtools-button data-settings="true" class="toolbar-button ${__classPrivateFieldGet(this, _LinearMemoryValueInterpreter_showSettings, "f") ? '' : 'disabled'}"
              title=${i18nString(UIStrings.toggleValueTypeSettings)} @click=${__classPrivateFieldGet(this, _LinearMemoryValueInterpreter_instances, "m", _LinearMemoryValueInterpreter_onSettingsToggle)}
              jslog=${VisualLogging.toggleSubpane('linear-memory-inspector.toggle-value-settings').track({ click: true })}
              .iconName=${'gear'}
              .toggledIconName=${'gear-filled'}
              .toggleType=${"primary-toggle" /* Buttons.Button.ToggleType.PRIMARY */}
              .variant=${"icon_toggle" /* Buttons.Button.Variant.ICON_TOGGLE */}
          ></devtools-button>
        </div>
        <span class="divider"></span>
        <div>
          ${__classPrivateFieldGet(this, _LinearMemoryValueInterpreter_showSettings, "f") ?
        html `
              <devtools-linear-memory-inspector-interpreter-settings
                .data=${{ valueTypes: __classPrivateFieldGet(this, _LinearMemoryValueInterpreter_valueTypes, "f") }}
                @typetoggle=${__classPrivateFieldGet(this, _LinearMemoryValueInterpreter_instances, "m", _LinearMemoryValueInterpreter_onTypeToggle)}>
              </devtools-linear-memory-inspector-interpreter-settings>` :
        html `
              <devtools-linear-memory-inspector-interpreter-display
                .data=${{
            buffer: __classPrivateFieldGet(this, _LinearMemoryValueInterpreter_buffer, "f"),
            valueTypes: __classPrivateFieldGet(this, _LinearMemoryValueInterpreter_valueTypes, "f"),
            endianness: __classPrivateFieldGet(this, _LinearMemoryValueInterpreter_endianness, "f"),
            valueTypeModes: __classPrivateFieldGet(this, _LinearMemoryValueInterpreter_valueTypeModeConfig, "f"),
            memoryLength: __classPrivateFieldGet(this, _LinearMemoryValueInterpreter_memoryLength, "f"),
        }}>
              </devtools-linear-memory-inspector-interpreter-display>`}
        </div>
      </div>
    `, __classPrivateFieldGet(this, _LinearMemoryValueInterpreter_shadow, "f"), { host: this });
    // clang-format on
}, _LinearMemoryValueInterpreter_onEndiannessChange = function _LinearMemoryValueInterpreter_onEndiannessChange(event) {
    event.preventDefault();
    const select = event.target;
    const endianness = select.value;
    this.dispatchEvent(new EndiannessChangedEvent(endianness));
}, _LinearMemoryValueInterpreter_renderEndiannessSetting = function _LinearMemoryValueInterpreter_renderEndiannessSetting() {
    const onEnumSettingChange = __classPrivateFieldGet(this, _LinearMemoryValueInterpreter_instances, "m", _LinearMemoryValueInterpreter_onEndiannessChange).bind(this);
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
    <label data-endianness-setting="true" title=${i18nString(UIStrings.changeEndianness)}>
      <select
        jslog=${VisualLogging.dropDown('linear-memory-inspector.endianess').track({ change: true })}
        style="border: none;"
        data-endianness="true" @change=${onEnumSettingChange}>
        ${["Little Endian" /* Endianness.LITTLE */, "Big Endian" /* Endianness.BIG */].map(endianness => {
        return html `<option value=${endianness} .selected=${__classPrivateFieldGet(this, _LinearMemoryValueInterpreter_endianness, "f") === endianness}
            jslog=${VisualLogging.item(Platform.StringUtilities.toKebabCase(endianness)).track({ click: true })}>${i18n.i18n.lockedString(endianness)}</option>`;
    })}
      </select>
    </label>
    `;
    // clang-format on
}, _LinearMemoryValueInterpreter_onSettingsToggle = function _LinearMemoryValueInterpreter_onSettingsToggle() {
    __classPrivateFieldSet(this, _LinearMemoryValueInterpreter_showSettings, !__classPrivateFieldGet(this, _LinearMemoryValueInterpreter_showSettings, "f"), "f");
    __classPrivateFieldGet(this, _LinearMemoryValueInterpreter_instances, "m", _LinearMemoryValueInterpreter_render).call(this);
}, _LinearMemoryValueInterpreter_onTypeToggle = function _LinearMemoryValueInterpreter_onTypeToggle(e) {
    this.dispatchEvent(new ValueTypeToggledEvent(e.data.type, e.data.checked));
};
customElements.define('devtools-linear-memory-inspector-interpreter', LinearMemoryValueInterpreter);
//# sourceMappingURL=LinearMemoryValueInterpreter.js.map