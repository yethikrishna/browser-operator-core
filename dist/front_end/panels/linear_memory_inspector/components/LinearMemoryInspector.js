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
var _AddressHistoryEntry_address, _AddressHistoryEntry_callback, _LinearMemoryInspector_instances, _LinearMemoryInspector_shadow, _LinearMemoryInspector_history, _LinearMemoryInspector_memory, _LinearMemoryInspector_memoryOffset, _LinearMemoryInspector_outerMemoryLength, _LinearMemoryInspector_address, _LinearMemoryInspector_highlightInfo, _LinearMemoryInspector_currentNavigatorMode, _LinearMemoryInspector_currentNavigatorAddressLine, _LinearMemoryInspector_numBytesPerPage, _LinearMemoryInspector_valueTypeModes, _LinearMemoryInspector_valueTypes, _LinearMemoryInspector_endianness, _LinearMemoryInspector_hideValueInspector, _LinearMemoryInspector_render, _LinearMemoryInspector_onJumpToAddress, _LinearMemoryInspector_onRefreshRequest, _LinearMemoryInspector_onByteSelected, _LinearMemoryInspector_createSettings, _LinearMemoryInspector_onEndiannessChanged, _LinearMemoryInspector_isValidAddress, _LinearMemoryInspector_onAddressChange, _LinearMemoryInspector_onValueTypeToggled, _LinearMemoryInspector_onValueTypeModeChanged, _LinearMemoryInspector_navigateHistory, _LinearMemoryInspector_navigatePage, _LinearMemoryInspector_jumpToAddress, _LinearMemoryInspector_getPageRangeForAddress, _LinearMemoryInspector_resize, _LinearMemoryInspector_update, _LinearMemoryInspector_setAddress, _LinearMemoryInspector_getSmallestEnclosingMemoryHighlight;
import './LinearMemoryValueInterpreter.js';
import './LinearMemoryHighlightChipList.js';
import './LinearMemoryViewer.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import { html, nothing, render } from '../../../ui/lit/lit.js';
import linearMemoryInspectorStyles from './linearMemoryInspector.css.js';
import { formatAddress, parseAddress } from './LinearMemoryInspectorUtils.js';
import { getDefaultValueTypeMapping, VALUE_INTEPRETER_MAX_NUM_BYTES, } from './ValueInterpreterDisplayUtils.js';
const UIStrings = {
    /**
     *@description Tooltip text that appears when hovering over an invalid address in the address line in the Linear memory inspector
     *@example {0x00000000} PH1
     *@example {0x00400000} PH2
     */
    addressHasToBeANumberBetweenSAnd: 'Address has to be a number between {PH1} and {PH2}',
};
const str_ = i18n.i18n.registerUIStrings('panels/linear_memory_inspector/components/LinearMemoryInspector.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class MemoryRequestEvent extends Event {
    constructor(start, end, address) {
        super(MemoryRequestEvent.eventName);
        this.data = { start, end, address };
    }
}
MemoryRequestEvent.eventName = 'memoryrequest';
export class AddressChangedEvent extends Event {
    constructor(address) {
        super(AddressChangedEvent.eventName);
        this.data = address;
    }
}
AddressChangedEvent.eventName = 'addresschanged';
export class SettingsChangedEvent extends Event {
    constructor(settings) {
        super(SettingsChangedEvent.eventName);
        this.data = settings;
    }
}
SettingsChangedEvent.eventName = 'settingschanged';
class AddressHistoryEntry {
    constructor(address, callback) {
        _AddressHistoryEntry_address.set(this, 0);
        _AddressHistoryEntry_callback.set(this, void 0);
        if (address < 0) {
            throw new Error('Address should be a greater or equal to zero');
        }
        __classPrivateFieldSet(this, _AddressHistoryEntry_address, address, "f");
        __classPrivateFieldSet(this, _AddressHistoryEntry_callback, callback, "f");
    }
    valid() {
        return true;
    }
    reveal() {
        __classPrivateFieldGet(this, _AddressHistoryEntry_callback, "f").call(this, __classPrivateFieldGet(this, _AddressHistoryEntry_address, "f"));
    }
}
_AddressHistoryEntry_address = new WeakMap(), _AddressHistoryEntry_callback = new WeakMap();
export class LinearMemoryInspector extends HTMLElement {
    constructor() {
        super(...arguments);
        _LinearMemoryInspector_instances.add(this);
        _LinearMemoryInspector_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _LinearMemoryInspector_history.set(this, new Common.SimpleHistoryManager.SimpleHistoryManager(10));
        _LinearMemoryInspector_memory.set(this, new Uint8Array());
        _LinearMemoryInspector_memoryOffset.set(this, 0);
        _LinearMemoryInspector_outerMemoryLength.set(this, 0);
        _LinearMemoryInspector_address.set(this, -1);
        _LinearMemoryInspector_highlightInfo.set(this, void 0);
        _LinearMemoryInspector_currentNavigatorMode.set(this, "Submitted" /* Mode.SUBMITTED */);
        _LinearMemoryInspector_currentNavigatorAddressLine.set(this, `${__classPrivateFieldGet(this, _LinearMemoryInspector_address, "f")}`);
        _LinearMemoryInspector_numBytesPerPage.set(this, 4);
        _LinearMemoryInspector_valueTypeModes.set(this, getDefaultValueTypeMapping());
        _LinearMemoryInspector_valueTypes.set(this, new Set(__classPrivateFieldGet(this, _LinearMemoryInspector_valueTypeModes, "f").keys()));
        _LinearMemoryInspector_endianness.set(this, "Little Endian" /* Endianness.LITTLE */);
        _LinearMemoryInspector_hideValueInspector.set(this, false);
    }
    set data(data) {
        if (data.address < data.memoryOffset || data.address > data.memoryOffset + data.memory.length || data.address < 0) {
            throw new Error('Address is out of bounds.');
        }
        if (data.memoryOffset < 0) {
            throw new Error('Memory offset has to be greater or equal to zero.');
        }
        if (data.highlightInfo) {
            if (data.highlightInfo.size < 0) {
                throw new Error('Object size has to be greater than or equal to zero');
            }
            if (data.highlightInfo.startAddress < 0 || data.highlightInfo.startAddress >= data.outerMemoryLength) {
                throw new Error('Object start address is out of bounds.');
            }
        }
        __classPrivateFieldSet(this, _LinearMemoryInspector_memory, data.memory, "f");
        __classPrivateFieldSet(this, _LinearMemoryInspector_memoryOffset, data.memoryOffset, "f");
        __classPrivateFieldSet(this, _LinearMemoryInspector_outerMemoryLength, data.outerMemoryLength, "f");
        __classPrivateFieldSet(this, _LinearMemoryInspector_valueTypeModes, data.valueTypeModes || __classPrivateFieldGet(this, _LinearMemoryInspector_valueTypeModes, "f"), "f");
        __classPrivateFieldSet(this, _LinearMemoryInspector_valueTypes, data.valueTypes || __classPrivateFieldGet(this, _LinearMemoryInspector_valueTypes, "f"), "f");
        __classPrivateFieldSet(this, _LinearMemoryInspector_endianness, data.endianness || __classPrivateFieldGet(this, _LinearMemoryInspector_endianness, "f"), "f");
        __classPrivateFieldSet(this, _LinearMemoryInspector_highlightInfo, data.highlightInfo, "f");
        __classPrivateFieldSet(this, _LinearMemoryInspector_hideValueInspector, data.hideValueInspector ?? __classPrivateFieldGet(this, _LinearMemoryInspector_hideValueInspector, "f"), "f");
        __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_setAddress).call(this, data.address);
        __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_render).call(this);
    }
}
_LinearMemoryInspector_shadow = new WeakMap(), _LinearMemoryInspector_history = new WeakMap(), _LinearMemoryInspector_memory = new WeakMap(), _LinearMemoryInspector_memoryOffset = new WeakMap(), _LinearMemoryInspector_outerMemoryLength = new WeakMap(), _LinearMemoryInspector_address = new WeakMap(), _LinearMemoryInspector_highlightInfo = new WeakMap(), _LinearMemoryInspector_currentNavigatorMode = new WeakMap(), _LinearMemoryInspector_currentNavigatorAddressLine = new WeakMap(), _LinearMemoryInspector_numBytesPerPage = new WeakMap(), _LinearMemoryInspector_valueTypeModes = new WeakMap(), _LinearMemoryInspector_valueTypes = new WeakMap(), _LinearMemoryInspector_endianness = new WeakMap(), _LinearMemoryInspector_hideValueInspector = new WeakMap(), _LinearMemoryInspector_instances = new WeakSet(), _LinearMemoryInspector_render = function _LinearMemoryInspector_render() {
    const { start, end } = __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_getPageRangeForAddress).call(this, __classPrivateFieldGet(this, _LinearMemoryInspector_address, "f"), __classPrivateFieldGet(this, _LinearMemoryInspector_numBytesPerPage, "f"));
    const navigatorAddressToShow = __classPrivateFieldGet(this, _LinearMemoryInspector_currentNavigatorMode, "f") === "Submitted" /* Mode.SUBMITTED */ ? formatAddress(__classPrivateFieldGet(this, _LinearMemoryInspector_address, "f")) :
        __classPrivateFieldGet(this, _LinearMemoryInspector_currentNavigatorAddressLine, "f");
    const navigatorAddressIsValid = __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_isValidAddress).call(this, navigatorAddressToShow);
    const invalidAddressMsg = i18nString(UIStrings.addressHasToBeANumberBetweenSAnd, { PH1: formatAddress(0), PH2: formatAddress(__classPrivateFieldGet(this, _LinearMemoryInspector_outerMemoryLength, "f")) });
    const errorMsg = navigatorAddressIsValid ? undefined : invalidAddressMsg;
    const canGoBackInHistory = __classPrivateFieldGet(this, _LinearMemoryInspector_history, "f").canRollback();
    const canGoForwardInHistory = __classPrivateFieldGet(this, _LinearMemoryInspector_history, "f").canRollover();
    const highlightedMemoryAreas = __classPrivateFieldGet(this, _LinearMemoryInspector_highlightInfo, "f") ? [__classPrivateFieldGet(this, _LinearMemoryInspector_highlightInfo, "f")] : [];
    const focusedMemoryHighlight = __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_getSmallestEnclosingMemoryHighlight).call(this, highlightedMemoryAreas, __classPrivateFieldGet(this, _LinearMemoryInspector_address, "f"));
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${linearMemoryInspectorStyles}</style>
      <div class="view">
        <devtools-linear-memory-inspector-navigator
          .data=${{ address: navigatorAddressToShow, valid: navigatorAddressIsValid, mode: __classPrivateFieldGet(this, _LinearMemoryInspector_currentNavigatorMode, "f"), error: errorMsg, canGoBackInHistory, canGoForwardInHistory }}
          @refreshrequested=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_onRefreshRequest)}
          @addressinputchanged=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_onAddressChange)}
          @pagenavigation=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_navigatePage)}
          @historynavigation=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_navigateHistory)}></devtools-linear-memory-inspector-navigator>
          <devtools-linear-memory-highlight-chip-list
          .data=${{ highlightInfos: highlightedMemoryAreas, focusedMemoryHighlight }}
          @jumptohighlightedmemory=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_onJumpToAddress)}>
          </devtools-linear-memory-highlight-chip-list>
        <devtools-linear-memory-inspector-viewer
          .data=${{
        memory: __classPrivateFieldGet(this, _LinearMemoryInspector_memory, "f").slice(start - __classPrivateFieldGet(this, _LinearMemoryInspector_memoryOffset, "f"), end - __classPrivateFieldGet(this, _LinearMemoryInspector_memoryOffset, "f")),
        address: __classPrivateFieldGet(this, _LinearMemoryInspector_address, "f"), memoryOffset: start,
        focus: __classPrivateFieldGet(this, _LinearMemoryInspector_currentNavigatorMode, "f") === "Submitted" /* Mode.SUBMITTED */,
        highlightInfo: __classPrivateFieldGet(this, _LinearMemoryInspector_highlightInfo, "f"),
        focusedMemoryHighlight
    }}
          @byteselected=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_onByteSelected)}
          @resize=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_resize)}>
        </devtools-linear-memory-inspector-viewer>
      </div>
      ${__classPrivateFieldGet(this, _LinearMemoryInspector_hideValueInspector, "f") ? nothing : html `
      <div class="value-interpreter">
        <devtools-linear-memory-inspector-interpreter
          .data=${{
        value: __classPrivateFieldGet(this, _LinearMemoryInspector_memory, "f").slice(__classPrivateFieldGet(this, _LinearMemoryInspector_address, "f") - __classPrivateFieldGet(this, _LinearMemoryInspector_memoryOffset, "f"), __classPrivateFieldGet(this, _LinearMemoryInspector_address, "f") + VALUE_INTEPRETER_MAX_NUM_BYTES).buffer,
        valueTypes: __classPrivateFieldGet(this, _LinearMemoryInspector_valueTypes, "f"),
        valueTypeModes: __classPrivateFieldGet(this, _LinearMemoryInspector_valueTypeModes, "f"),
        endianness: __classPrivateFieldGet(this, _LinearMemoryInspector_endianness, "f"),
        memoryLength: __classPrivateFieldGet(this, _LinearMemoryInspector_outerMemoryLength, "f")
    }}
          @valuetypetoggled=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_onValueTypeToggled)}
          @valuetypemodechanged=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_onValueTypeModeChanged)}
          @endiannesschanged=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_onEndiannessChanged)}
          @jumptopointeraddress=${__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_onJumpToAddress)}
          >
        </devtools-linear-memory-inspector-interpreter/>
      </div>`}
      `, __classPrivateFieldGet(this, _LinearMemoryInspector_shadow, "f"), {
        host: this,
    });
    // clang-format on
}, _LinearMemoryInspector_onJumpToAddress = function _LinearMemoryInspector_onJumpToAddress(e) {
    // Stop event from bubbling up, since no element further up needs the event.
    e.stopPropagation();
    __classPrivateFieldSet(this, _LinearMemoryInspector_currentNavigatorMode, "Submitted" /* Mode.SUBMITTED */, "f");
    const addressInRange = Math.max(0, Math.min(e.data, __classPrivateFieldGet(this, _LinearMemoryInspector_outerMemoryLength, "f") - 1));
    __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_jumpToAddress).call(this, addressInRange);
}, _LinearMemoryInspector_onRefreshRequest = function _LinearMemoryInspector_onRefreshRequest() {
    const { start, end } = __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_getPageRangeForAddress).call(this, __classPrivateFieldGet(this, _LinearMemoryInspector_address, "f"), __classPrivateFieldGet(this, _LinearMemoryInspector_numBytesPerPage, "f"));
    this.dispatchEvent(new MemoryRequestEvent(start, end, __classPrivateFieldGet(this, _LinearMemoryInspector_address, "f")));
}, _LinearMemoryInspector_onByteSelected = function _LinearMemoryInspector_onByteSelected(e) {
    __classPrivateFieldSet(this, _LinearMemoryInspector_currentNavigatorMode, "Submitted" /* Mode.SUBMITTED */, "f");
    const addressInRange = Math.max(0, Math.min(e.data, __classPrivateFieldGet(this, _LinearMemoryInspector_outerMemoryLength, "f") - 1));
    __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_jumpToAddress).call(this, addressInRange);
}, _LinearMemoryInspector_createSettings = function _LinearMemoryInspector_createSettings() {
    return { valueTypes: __classPrivateFieldGet(this, _LinearMemoryInspector_valueTypes, "f"), modes: __classPrivateFieldGet(this, _LinearMemoryInspector_valueTypeModes, "f"), endianness: __classPrivateFieldGet(this, _LinearMemoryInspector_endianness, "f") };
}, _LinearMemoryInspector_onEndiannessChanged = function _LinearMemoryInspector_onEndiannessChanged(e) {
    __classPrivateFieldSet(this, _LinearMemoryInspector_endianness, e.data, "f");
    this.dispatchEvent(new SettingsChangedEvent(__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_createSettings).call(this)));
    __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_render).call(this);
}, _LinearMemoryInspector_isValidAddress = function _LinearMemoryInspector_isValidAddress(address) {
    const newAddress = parseAddress(address);
    return newAddress !== undefined && newAddress >= 0 && newAddress < __classPrivateFieldGet(this, _LinearMemoryInspector_outerMemoryLength, "f");
}, _LinearMemoryInspector_onAddressChange = function _LinearMemoryInspector_onAddressChange(e) {
    const { address, mode } = e.data;
    const isValid = __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_isValidAddress).call(this, address);
    const newAddress = parseAddress(address);
    __classPrivateFieldSet(this, _LinearMemoryInspector_currentNavigatorAddressLine, address, "f");
    if (newAddress !== undefined && isValid) {
        __classPrivateFieldSet(this, _LinearMemoryInspector_currentNavigatorMode, mode, "f");
        __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_jumpToAddress).call(this, newAddress);
        return;
    }
    if (mode === "Submitted" /* Mode.SUBMITTED */ && !isValid) {
        __classPrivateFieldSet(this, _LinearMemoryInspector_currentNavigatorMode, "InvalidSubmit" /* Mode.INVALID_SUBMIT */, "f");
    }
    else {
        __classPrivateFieldSet(this, _LinearMemoryInspector_currentNavigatorMode, "Edit" /* Mode.EDIT */, "f");
    }
    __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_render).call(this);
}, _LinearMemoryInspector_onValueTypeToggled = function _LinearMemoryInspector_onValueTypeToggled(e) {
    const { type, checked } = e.data;
    if (checked) {
        __classPrivateFieldGet(this, _LinearMemoryInspector_valueTypes, "f").add(type);
    }
    else {
        __classPrivateFieldGet(this, _LinearMemoryInspector_valueTypes, "f").delete(type);
    }
    this.dispatchEvent(new SettingsChangedEvent(__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_createSettings).call(this)));
    __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_render).call(this);
}, _LinearMemoryInspector_onValueTypeModeChanged = function _LinearMemoryInspector_onValueTypeModeChanged(e) {
    e.stopImmediatePropagation();
    const { type, mode } = e.data;
    __classPrivateFieldGet(this, _LinearMemoryInspector_valueTypeModes, "f").set(type, mode);
    this.dispatchEvent(new SettingsChangedEvent(__classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_createSettings).call(this)));
    __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_render).call(this);
}, _LinearMemoryInspector_navigateHistory = function _LinearMemoryInspector_navigateHistory(e) {
    return e.data === "Forward" /* Navigation.FORWARD */ ? __classPrivateFieldGet(this, _LinearMemoryInspector_history, "f").rollover() : __classPrivateFieldGet(this, _LinearMemoryInspector_history, "f").rollback();
}, _LinearMemoryInspector_navigatePage = function _LinearMemoryInspector_navigatePage(e) {
    const newAddress = e.data === "Forward" /* Navigation.FORWARD */ ? __classPrivateFieldGet(this, _LinearMemoryInspector_address, "f") + __classPrivateFieldGet(this, _LinearMemoryInspector_numBytesPerPage, "f") : __classPrivateFieldGet(this, _LinearMemoryInspector_address, "f") - __classPrivateFieldGet(this, _LinearMemoryInspector_numBytesPerPage, "f");
    const addressInRange = Math.max(0, Math.min(newAddress, __classPrivateFieldGet(this, _LinearMemoryInspector_outerMemoryLength, "f") - 1));
    __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_jumpToAddress).call(this, addressInRange);
}, _LinearMemoryInspector_jumpToAddress = function _LinearMemoryInspector_jumpToAddress(address) {
    if (address < 0 || address >= __classPrivateFieldGet(this, _LinearMemoryInspector_outerMemoryLength, "f")) {
        console.warn(`Specified address is out of bounds: ${address}`);
        return;
    }
    __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_setAddress).call(this, address);
    __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_update).call(this);
}, _LinearMemoryInspector_getPageRangeForAddress = function _LinearMemoryInspector_getPageRangeForAddress(address, numBytesPerPage) {
    const pageNumber = Math.floor(address / numBytesPerPage);
    const pageStartAddress = pageNumber * numBytesPerPage;
    const pageEndAddress = Math.min(pageStartAddress + numBytesPerPage, __classPrivateFieldGet(this, _LinearMemoryInspector_outerMemoryLength, "f"));
    return { start: pageStartAddress, end: pageEndAddress };
}, _LinearMemoryInspector_resize = function _LinearMemoryInspector_resize(event) {
    __classPrivateFieldSet(this, _LinearMemoryInspector_numBytesPerPage, event.data, "f");
    __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_update).call(this);
}, _LinearMemoryInspector_update = function _LinearMemoryInspector_update() {
    const { start, end } = __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_getPageRangeForAddress).call(this, __classPrivateFieldGet(this, _LinearMemoryInspector_address, "f"), __classPrivateFieldGet(this, _LinearMemoryInspector_numBytesPerPage, "f"));
    if (start < __classPrivateFieldGet(this, _LinearMemoryInspector_memoryOffset, "f") || end > __classPrivateFieldGet(this, _LinearMemoryInspector_memoryOffset, "f") + __classPrivateFieldGet(this, _LinearMemoryInspector_memory, "f").length) {
        this.dispatchEvent(new MemoryRequestEvent(start, end, __classPrivateFieldGet(this, _LinearMemoryInspector_address, "f")));
    }
    else {
        __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_render).call(this);
    }
}, _LinearMemoryInspector_setAddress = function _LinearMemoryInspector_setAddress(address) {
    // If we are already showing the address that is requested, no need to act upon it.
    if (__classPrivateFieldGet(this, _LinearMemoryInspector_address, "f") === address) {
        return;
    }
    const historyEntry = new AddressHistoryEntry(address, () => __classPrivateFieldGet(this, _LinearMemoryInspector_instances, "m", _LinearMemoryInspector_jumpToAddress).call(this, address));
    __classPrivateFieldGet(this, _LinearMemoryInspector_history, "f").push(historyEntry);
    __classPrivateFieldSet(this, _LinearMemoryInspector_address, address, "f");
    this.dispatchEvent(new AddressChangedEvent(__classPrivateFieldGet(this, _LinearMemoryInspector_address, "f")));
}, _LinearMemoryInspector_getSmallestEnclosingMemoryHighlight = function _LinearMemoryInspector_getSmallestEnclosingMemoryHighlight(highlightedMemoryAreas, address) {
    let smallestEnclosingHighlight;
    for (const highlightedMemory of highlightedMemoryAreas) {
        if (highlightedMemory.startAddress <= address &&
            address < highlightedMemory.startAddress + highlightedMemory.size) {
            if (!smallestEnclosingHighlight) {
                smallestEnclosingHighlight = highlightedMemory;
            }
            else if (highlightedMemory.size < smallestEnclosingHighlight.size) {
                smallestEnclosingHighlight = highlightedMemory;
            }
        }
    }
    return smallestEnclosingHighlight;
};
customElements.define('devtools-linear-memory-inspector-inspector', LinearMemoryInspector);
//# sourceMappingURL=LinearMemoryInspector.js.map