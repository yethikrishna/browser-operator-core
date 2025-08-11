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
var _ValueInterpreterDisplay_instances, _ValueInterpreterDisplay_shadow, _ValueInterpreterDisplay_endianness, _ValueInterpreterDisplay_buffer, _ValueInterpreterDisplay_valueTypes, _ValueInterpreterDisplay_valueTypeModeConfig, _ValueInterpreterDisplay_memoryLength, _ValueInterpreterDisplay_render, _ValueInterpreterDisplay_showValue, _ValueInterpreterDisplay_renderPointerValue, _ValueInterpreterDisplay_onJumpToAddressClicked, _ValueInterpreterDisplay_renderNumberValues, _ValueInterpreterDisplay_renderSignedAndUnsigned, _ValueInterpreterDisplay_onValueTypeModeChange, _ValueInterpreterDisplay_parse;
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import valueInterpreterDisplayStyles from './valueInterpreterDisplay.css.js';
import { format, getDefaultValueTypeMapping, getPointerAddress, isNumber, isPointer, isValidMode, VALUE_TYPE_MODE_LIST, } from './ValueInterpreterDisplayUtils.js';
const UIStrings = {
    /**
     *@description Tooltip text that appears when hovering over an unsigned interpretation of the memory under the Value Interpreter
     */
    unsignedValue: '`Unsigned` value',
    /**
     *@description Tooltip text that appears when hovering over the element to change value type modes of under the Value Interpreter. Value type modes
     *             are different ways of viewing a certain value, e.g.: 10 (decimal) can be 0xa in hexadecimal mode, or 12 in octal mode.
     */
    changeValueTypeMode: 'Change mode',
    /**
     *@description Tooltip text that appears when hovering over a signed interpretation of the memory under the Value Interpreter
     */
    signedValue: '`Signed` value',
    /**
     *@description Tooltip text that appears when hovering over a 'jump-to-address' button that is next to a pointer (32-bit or 64-bit) under the Value Interpreter
     */
    jumpToPointer: 'Jump to address',
    /**
     *@description Tooltip text that appears when hovering over a 'jump-to-address' button that is next to a pointer (32-bit or 64-bit) with an invalid address under the Value Interpreter.
     */
    addressOutOfRange: 'Address out of memory range',
};
const str_ = i18n.i18n.registerUIStrings('panels/linear_memory_inspector/components/ValueInterpreterDisplay.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { render, html } = Lit;
const SORTED_VALUE_TYPES = Array.from(getDefaultValueTypeMapping().keys());
export class ValueTypeModeChangedEvent extends Event {
    constructor(type, mode) {
        super(ValueTypeModeChangedEvent.eventName, {
            composed: true,
        });
        this.data = { type, mode };
    }
}
ValueTypeModeChangedEvent.eventName = 'valuetypemodechanged';
export class JumpToPointerAddressEvent extends Event {
    constructor(address) {
        super(JumpToPointerAddressEvent.eventName, {
            composed: true,
        });
        this.data = address;
    }
}
JumpToPointerAddressEvent.eventName = 'jumptopointeraddress';
export class ValueInterpreterDisplay extends HTMLElement {
    constructor() {
        super(...arguments);
        _ValueInterpreterDisplay_instances.add(this);
        _ValueInterpreterDisplay_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ValueInterpreterDisplay_endianness.set(this, "Little Endian" /* Endianness.LITTLE */);
        _ValueInterpreterDisplay_buffer.set(this, new ArrayBuffer(0));
        _ValueInterpreterDisplay_valueTypes.set(this, new Set());
        _ValueInterpreterDisplay_valueTypeModeConfig.set(this, getDefaultValueTypeMapping());
        _ValueInterpreterDisplay_memoryLength.set(this, 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _ValueInterpreterDisplay_buffer, data.buffer, "f");
        __classPrivateFieldSet(this, _ValueInterpreterDisplay_endianness, data.endianness, "f");
        __classPrivateFieldSet(this, _ValueInterpreterDisplay_valueTypes, data.valueTypes, "f");
        __classPrivateFieldSet(this, _ValueInterpreterDisplay_memoryLength, data.memoryLength, "f");
        if (data.valueTypeModes) {
            data.valueTypeModes.forEach((mode, valueType) => {
                if (isValidMode(valueType, mode)) {
                    __classPrivateFieldGet(this, _ValueInterpreterDisplay_valueTypeModeConfig, "f").set(valueType, mode);
                }
            });
        }
        __classPrivateFieldGet(this, _ValueInterpreterDisplay_instances, "m", _ValueInterpreterDisplay_render).call(this);
    }
}
_ValueInterpreterDisplay_shadow = new WeakMap(), _ValueInterpreterDisplay_endianness = new WeakMap(), _ValueInterpreterDisplay_buffer = new WeakMap(), _ValueInterpreterDisplay_valueTypes = new WeakMap(), _ValueInterpreterDisplay_valueTypeModeConfig = new WeakMap(), _ValueInterpreterDisplay_memoryLength = new WeakMap(), _ValueInterpreterDisplay_instances = new WeakSet(), _ValueInterpreterDisplay_render = function _ValueInterpreterDisplay_render() {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${UI.inspectorCommonStyles}</style>
      <style>${valueInterpreterDisplayStyles}</style>
      <div class="value-types">
        ${SORTED_VALUE_TYPES.map(type => __classPrivateFieldGet(this, _ValueInterpreterDisplay_valueTypes, "f").has(type) ? __classPrivateFieldGet(this, _ValueInterpreterDisplay_instances, "m", _ValueInterpreterDisplay_showValue).call(this, type) : '')}
      </div>
    `, __classPrivateFieldGet(this, _ValueInterpreterDisplay_shadow, "f"), { host: this });
    // clang-format on
}, _ValueInterpreterDisplay_showValue = function _ValueInterpreterDisplay_showValue(type) {
    if (isNumber(type)) {
        return __classPrivateFieldGet(this, _ValueInterpreterDisplay_instances, "m", _ValueInterpreterDisplay_renderNumberValues).call(this, type);
    }
    if (isPointer(type)) {
        return __classPrivateFieldGet(this, _ValueInterpreterDisplay_instances, "m", _ValueInterpreterDisplay_renderPointerValue).call(this, type);
    }
    throw new Error(`No known way to format ${type}`);
}, _ValueInterpreterDisplay_renderPointerValue = function _ValueInterpreterDisplay_renderPointerValue(type) {
    const unsignedValue = __classPrivateFieldGet(this, _ValueInterpreterDisplay_instances, "m", _ValueInterpreterDisplay_parse).call(this, { type, signed: false });
    const address = getPointerAddress(type, __classPrivateFieldGet(this, _ValueInterpreterDisplay_buffer, "f"), __classPrivateFieldGet(this, _ValueInterpreterDisplay_endianness, "f"));
    const jumpDisabled = Number.isNaN(address) || BigInt(address) >= BigInt(__classPrivateFieldGet(this, _ValueInterpreterDisplay_memoryLength, "f"));
    const buttonTitle = jumpDisabled ? i18nString(UIStrings.addressOutOfRange) : i18nString(UIStrings.jumpToPointer);
    const iconColor = jumpDisabled ? 'var(--icon-default)' : 'var(--icon-link)';
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <span class="value-type-cell-no-mode value-type-cell selectable-text">${i18n.i18n.lockedString(type)}</span>
      <div class="value-type-cell">
        <div class="value-type-value-with-link" data-value="true">
        <span class="selectable-text">${unsignedValue}</span>
          ${html `
              <button class="jump-to-button" data-jump="true" title=${buttonTitle} ?disabled=${jumpDisabled}
                jslog=${VisualLogging.action('linear-memory-inspector.jump-to-address').track({ click: true })}
                @click=${__classPrivateFieldGet(this, _ValueInterpreterDisplay_instances, "m", _ValueInterpreterDisplay_onJumpToAddressClicked).bind(this, Number(address))}>
                <devtools-icon .data=${{ iconName: 'open-externally', color: iconColor, width: '16px' }}>
                </devtools-icon>
              </button>`}
        </div>
      </div>
    `;
    // clang-format on
}, _ValueInterpreterDisplay_onJumpToAddressClicked = function _ValueInterpreterDisplay_onJumpToAddressClicked(address) {
    this.dispatchEvent(new JumpToPointerAddressEvent(address));
}, _ValueInterpreterDisplay_renderNumberValues = function _ValueInterpreterDisplay_renderNumberValues(type) {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <span class="value-type-cell selectable-text">${i18n.i18n.lockedString(type)}</span>
      <div>
        <select title=${i18nString(UIStrings.changeValueTypeMode)}
          data-mode-settings="true"
          jslog=${VisualLogging.dropDown('linear-memory-inspector.value-type-mode').track({ change: true })}
          @change=${__classPrivateFieldGet(this, _ValueInterpreterDisplay_instances, "m", _ValueInterpreterDisplay_onValueTypeModeChange).bind(this, type)}>
            ${VALUE_TYPE_MODE_LIST.filter(x => isValidMode(type, x)).map(mode => {
        return html `
                <option value=${mode} .selected=${__classPrivateFieldGet(this, _ValueInterpreterDisplay_valueTypeModeConfig, "f").get(type) === mode}
                        jslog=${VisualLogging.item(mode).track({ click: true })}>${i18n.i18n.lockedString(mode)}
                </option>`;
    })}
        </select>
      </div>
      ${__classPrivateFieldGet(this, _ValueInterpreterDisplay_instances, "m", _ValueInterpreterDisplay_renderSignedAndUnsigned).call(this, type)}
    `;
    // clang-format on
}, _ValueInterpreterDisplay_renderSignedAndUnsigned = function _ValueInterpreterDisplay_renderSignedAndUnsigned(type) {
    const unsignedValue = __classPrivateFieldGet(this, _ValueInterpreterDisplay_instances, "m", _ValueInterpreterDisplay_parse).call(this, { type, signed: false });
    const signedValue = __classPrivateFieldGet(this, _ValueInterpreterDisplay_instances, "m", _ValueInterpreterDisplay_parse).call(this, { type, signed: true });
    const mode = __classPrivateFieldGet(this, _ValueInterpreterDisplay_valueTypeModeConfig, "f").get(type);
    const showSignedAndUnsigned = signedValue !== unsignedValue && mode !== "hex" /* ValueTypeMode.HEXADECIMAL */ && mode !== "oct" /* ValueTypeMode.OCTAL */;
    const unsignedRendered = html `<span class="value-type-cell selectable-text"  title=${i18nString(UIStrings.unsignedValue)} data-value="true">${unsignedValue}</span>`;
    if (!showSignedAndUnsigned) {
        return unsignedRendered;
    }
    // Some values are too long to show in one line, we're putting them into the next line.
    const showInMultipleLines = type === "Integer 32-bit" /* ValueType.INT32 */ || type === "Integer 64-bit" /* ValueType.INT64 */;
    const signedRendered = html `<span class="selectable-text" data-value="true" title=${i18nString(UIStrings.signedValue)}>${signedValue}</span>`;
    if (showInMultipleLines) {
        return html `
        <div class="value-type-cell">
          ${unsignedRendered}
          ${signedRendered}
        </div>
        `;
    }
    return html `
      <div class="value-type-cell" style="flex-direction: row;">
        ${unsignedRendered}
        <span class="signed-divider"></span>
        ${signedRendered}
      </div>
    `;
}, _ValueInterpreterDisplay_onValueTypeModeChange = function _ValueInterpreterDisplay_onValueTypeModeChange(type, event) {
    event.preventDefault();
    const select = event.target;
    const mode = select.value;
    this.dispatchEvent(new ValueTypeModeChangedEvent(type, mode));
}, _ValueInterpreterDisplay_parse = function _ValueInterpreterDisplay_parse(data) {
    const mode = __classPrivateFieldGet(this, _ValueInterpreterDisplay_valueTypeModeConfig, "f").get(data.type);
    return format({ buffer: __classPrivateFieldGet(this, _ValueInterpreterDisplay_buffer, "f"), type: data.type, endianness: __classPrivateFieldGet(this, _ValueInterpreterDisplay_endianness, "f"), signed: data.signed || false, mode });
};
customElements.define('devtools-linear-memory-inspector-interpreter-display', ValueInterpreterDisplay);
//# sourceMappingURL=ValueInterpreterDisplay.js.map