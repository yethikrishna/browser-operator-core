// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _AutofillManager_instances, _AutofillManager_autoOpenViewSetting, _AutofillManager_address, _AutofillManager_filledFields, _AutofillManager_matches, _AutofillManager_autofillModel, _AutofillManager_addressFormFilled, _AutofillManager_processAddressFormFilledData;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
let autofillManagerInstance;
export class AutofillManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _AutofillManager_instances.add(this);
        _AutofillManager_autoOpenViewSetting.set(this, void 0);
        _AutofillManager_address.set(this, '');
        _AutofillManager_filledFields.set(this, []);
        _AutofillManager_matches.set(this, []);
        _AutofillManager_autofillModel.set(this, null);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.AutofillModel.AutofillModel, "AddressFormFilled" /* SDK.AutofillModel.Events.ADDRESS_FORM_FILLED */, __classPrivateFieldGet(this, _AutofillManager_instances, "m", _AutofillManager_addressFormFilled), this, { scoped: true });
        __classPrivateFieldSet(this, _AutofillManager_autoOpenViewSetting, Common.Settings.Settings.instance().createSetting('auto-open-autofill-view-on-event', true), "f");
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!autofillManagerInstance || forceNew) {
            autofillManagerInstance = new AutofillManager();
        }
        return autofillManagerInstance;
    }
    onShowAutofillTestAddressesSettingsChanged() {
        for (const autofillModel of SDK.TargetManager.TargetManager.instance().models(SDK.AutofillModel.AutofillModel)) {
            autofillModel.setTestAddresses();
        }
    }
    getLastFilledAddressForm() {
        if (!__classPrivateFieldGet(this, _AutofillManager_address, "f") || !__classPrivateFieldGet(this, _AutofillManager_autofillModel, "f")) {
            return null;
        }
        return {
            address: __classPrivateFieldGet(this, _AutofillManager_address, "f"),
            filledFields: __classPrivateFieldGet(this, _AutofillManager_filledFields, "f"),
            matches: __classPrivateFieldGet(this, _AutofillManager_matches, "f"),
            autofillModel: __classPrivateFieldGet(this, _AutofillManager_autofillModel, "f"),
        };
    }
}
_AutofillManager_autoOpenViewSetting = new WeakMap(), _AutofillManager_address = new WeakMap(), _AutofillManager_filledFields = new WeakMap(), _AutofillManager_matches = new WeakMap(), _AutofillManager_autofillModel = new WeakMap(), _AutofillManager_instances = new WeakSet(), _AutofillManager_addressFormFilled = async function _AutofillManager_addressFormFilled({ data }) {
    if (__classPrivateFieldGet(this, _AutofillManager_autoOpenViewSetting, "f").get()) {
        await UI.ViewManager.ViewManager.instance().showView('autofill-view');
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.AutofillReceivedAndTabAutoOpened);
    }
    else {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.AutofillReceived);
    }
    __classPrivateFieldSet(this, _AutofillManager_autofillModel, data.autofillModel, "f");
    __classPrivateFieldGet(this, _AutofillManager_instances, "m", _AutofillManager_processAddressFormFilledData).call(this, data.event);
    if (__classPrivateFieldGet(this, _AutofillManager_address, "f")) {
        this.dispatchEventToListeners("AddressFormFilled" /* Events.ADDRESS_FORM_FILLED */, {
            address: __classPrivateFieldGet(this, _AutofillManager_address, "f"),
            filledFields: __classPrivateFieldGet(this, _AutofillManager_filledFields, "f"),
            matches: __classPrivateFieldGet(this, _AutofillManager_matches, "f"),
            autofillModel: __classPrivateFieldGet(this, _AutofillManager_autofillModel, "f"),
        });
    }
}, _AutofillManager_processAddressFormFilledData = function _AutofillManager_processAddressFormFilledData({ addressUi, filledFields }) {
    // Transform addressUi into a single (multi-line) string.
    const concatAddressFields = (addressFields) => addressFields.fields.filter(field => field.value.length).map(field => field.value).join(' ');
    __classPrivateFieldSet(this, _AutofillManager_address, addressUi.addressFields.map(addressFields => concatAddressFields(addressFields))
        .filter(str => str.length)
        .join('\n'), "f");
    __classPrivateFieldSet(this, _AutofillManager_filledFields, filledFields, "f");
    __classPrivateFieldSet(this, _AutofillManager_matches, [], "f");
    // Populate a list of matches by searching in the address string for
    // occurences of filled field values.
    for (let i = 0; i < __classPrivateFieldGet(this, _AutofillManager_filledFields, "f").length; i++) {
        if (__classPrivateFieldGet(this, _AutofillManager_filledFields, "f")[i].value === '') {
            continue;
        }
        // 1) Replace multiple whitespaces with a single space.
        // 2) Escape special characters.
        // 3) For ',' or '.' before whitespace, insert the '?' quantifier.
        const needle = Platform.StringUtilities.escapeForRegExp(__classPrivateFieldGet(this, _AutofillManager_filledFields, "f")[i].value.replaceAll(/\s/g, ' '))
            .replaceAll(/([.,]+)\s/g, '$1? ');
        const matches = __classPrivateFieldGet(this, _AutofillManager_address, "f").replaceAll(/\s/g, ' ').matchAll(new RegExp(needle, 'g'));
        for (const match of matches) {
            if (typeof match.index !== 'undefined') {
                __classPrivateFieldGet(this, _AutofillManager_matches, "f").push({ startIndex: match.index, endIndex: match.index + match[0].length, filledFieldIndex: i });
            }
        }
    }
};
export var Events;
(function (Events) {
    Events["ADDRESS_FORM_FILLED"] = "AddressFormFilled";
})(Events || (Events = {}));
//# sourceMappingURL=AutofillManager.js.map