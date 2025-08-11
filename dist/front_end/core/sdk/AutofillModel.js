// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _AutofillModel_enabled, _AutofillModel_showTestAddressesInAutofillMenu;
import * as Common from '../../core/common/common.js';
import * as Host from '../host/host.js';
import { SDKModel } from './SDKModel.js';
export class AutofillModel extends SDKModel {
    constructor(target) {
        super(target);
        _AutofillModel_enabled.set(this, void 0);
        _AutofillModel_showTestAddressesInAutofillMenu.set(this, void 0);
        this.agent = target.autofillAgent();
        __classPrivateFieldSet(this, _AutofillModel_showTestAddressesInAutofillMenu, Common.Settings.Settings.instance().createSetting('show-test-addresses-in-autofill-menu-on-event', false), "f");
        target.registerAutofillDispatcher(this);
        this.enable();
    }
    setTestAddresses() {
        void this.agent.invoke_setAddresses({
            addresses: __classPrivateFieldGet(this, _AutofillModel_showTestAddressesInAutofillMenu, "f").get() ?
                [
                    {
                        fields: [
                            { name: 'ADDRESS_HOME_COUNTRY', value: 'US' },
                            { name: 'NAME_FULL', value: 'Jon Stewart Doe' },
                            { name: 'NAME_FIRST', value: 'Jon' },
                            { name: 'NAME_MIDDLE', value: 'Stewart' },
                            { name: 'NAME_LAST', value: 'Doe' },
                            { name: 'COMPANY_NAME', value: 'Fake Company' },
                            { name: 'ADDRESS_HOME_LINE1', value: '1600 Fake Street' },
                            { name: 'ADDRESS_HOME_LINE2', value: 'Apartment 1' },
                            { name: 'ADDRESS_HOME_ZIP', value: '94043' },
                            { name: 'ADDRESS_HOME_CITY', value: 'Mountain View' },
                            { name: 'ADDRESS_HOME_STATE', value: 'CA' },
                            { name: 'EMAIL_ADDRESS', value: 'test@example.us' },
                            { name: 'PHONE_HOME_WHOLE_NUMBER', value: '+16019521325' },
                        ],
                    },
                    {
                        fields: [
                            { name: 'ADDRESS_HOME_COUNTRY', value: 'BR' },
                            { name: 'NAME_FULL', value: 'João Souza Silva' },
                            { name: 'NAME_FIRST', value: 'João' },
                            { name: 'NAME_LAST', value: 'Souza Silva' },
                            { name: 'NAME_LAST_FIRST', value: 'Souza' },
                            { name: 'NAME_LAST_SECOND', value: 'Silva' },
                            { name: 'COMPANY_NAME', value: 'Empresa Falsa' },
                            { name: 'ADDRESS_HOME_STREET_ADDRESS', value: 'Rua Inexistente, 2000\nAndar 2, Apartamento 1' },
                            { name: 'ADDRESS_HOME_STREET_LOCATION', value: 'Rua Inexistente, 2000' },
                            { name: 'ADDRESS_HOME_STREET_NAME', value: 'Rua Inexistente' },
                            { name: 'ADDRESS_HOME_HOUSE_NUMBER', value: '2000' },
                            { name: 'ADDRESS_HOME_SUBPREMISE', value: 'Andar 2, Apartamento 1' },
                            { name: 'ADDRESS_HOME_APT_NUM', value: '1' },
                            { name: 'ADDRESS_HOME_FLOOR', value: '2' },
                            { name: 'ADDRESS_HOME_APT', value: 'Apartamento 1' },
                            { name: 'ADDRESS_HOME_APT_TYPE', value: 'Apartamento' },
                            { name: 'ADDRESS_HOME_APT_NUM', value: '1' },
                            { name: 'ADDRESS_HOME_DEPENDENT_LOCALITY', value: 'Santa Efigênia' },
                            { name: 'ADDRESS_HOME_LANDMARK', value: 'Próximo à estação Santa Efigênia' },
                            { name: 'ADDRESS_HOME_OVERFLOW', value: 'Andar 2, Apartamento 1' },
                            { name: 'ADDRESS_HOME_ZIP', value: '30260-080' },
                            { name: 'ADDRESS_HOME_CITY', value: 'Belo Horizonte' },
                            { name: 'ADDRESS_HOME_STATE', value: 'MG' },
                            { name: 'EMAIL_ADDRESS', value: 'teste@exemplo.us' },
                            { name: 'PHONE_HOME_WHOLE_NUMBER', value: '+553121286800' },
                        ],
                    },
                    {
                        fields: [
                            { name: 'ADDRESS_HOME_COUNTRY', value: 'MX' },
                            { name: 'NAME_FULL', value: 'Juan Francisco García Flores' },
                            { name: 'NAME_FIRST', value: 'Juan Francisco' },
                            { name: 'NAME_LAST', value: 'García Flores' },
                            { name: 'NAME_LAST_FIRST', value: 'García' },
                            { name: 'NAME_LAST_SECOND', value: 'Flores' },
                            { name: 'COMPANY_NAME', value: 'Empresa Falsa' },
                            {
                                name: 'ADDRESS_HOME_STREET_ADDRESS',
                                value: 'C. Falsa 445\nPiso 2, Apartamento 1\nEntre calle Volcán y calle Montes Blancos, cerca de la estación de metro',
                            },
                            { name: 'ADDRESS_HOME_STREET_LOCATION', value: 'C. Falsa 445' },
                            { name: 'ADDRESS_HOME_STREET_NAME', value: 'C. Falsa' },
                            { name: 'ADDRESS_HOME_HOUSE_NUMBER', value: '445' },
                            { name: 'ADDRESS_HOME_SUBPREMISE', value: 'Piso 2, Apartamento 1' },
                            { name: 'ADDRESS_HOME_FLOOR', value: '2' },
                            { name: 'ADDRESS_HOME_APT', value: 'Apartamento 1' },
                            { name: 'ADDRESS_HOME_APT_TYPE', value: 'Apartamento' },
                            { name: 'ADDRESS_HOME_APT_NUM', value: '1' },
                            { name: 'ADDRESS_HOME_DEPENDENT_LOCALITY', value: 'Lomas de Chapultepec' },
                            {
                                name: 'ADDRESS_HOME_OVERFLOW',
                                value: 'Entre calle Volcán y calle Montes Celestes, cerca de la estación de metro',
                            },
                            {
                                name: 'ADDRESS_HOME_BETWEEN_STREETS_OR_LANDMARK',
                                value: 'Entre calle Volcán y calle Montes Blancos, cerca de la estación de metro',
                            },
                            { name: 'ADDRESS_HOME_LANDMARK', value: 'Cerca de la estación de metro' },
                            { name: 'ADDRESS_HOME_BETWEEN_STREETS', value: 'Entre calle Volcán y calle Montes Blancos' },
                            { name: 'ADDRESS_HOME_BETWEEN_STREETS_1', value: 'calle Volcán' },
                            { name: 'ADDRESS_HOME_BETWEEN_STREETS_2', value: 'calle Montes Blancos' },
                            { name: 'ADDRESS_HOME_ADMIN_LEVEL2', value: 'Miguel Hidalgo' },
                            { name: 'ADDRESS_HOME_ZIP', value: '11001' },
                            { name: 'ADDRESS_HOME_CITY', value: 'Ciudad de México' },
                            { name: 'ADDRESS_HOME_STATE', value: 'Distrito Federal' },
                            { name: 'EMAIL_ADDRESS', value: 'ejemplo@ejemplo.mx' },
                            { name: 'PHONE_HOME_WHOLE_NUMBER', value: '+525553428400' },
                        ],
                    },
                    {
                        fields: [
                            { name: 'ADDRESS_HOME_COUNTRY', value: 'DE' },
                            { name: 'NAME_FULL', value: 'Gottfried Wilhelm Leibniz' },
                            { name: 'NAME_FIRST', value: 'Gottfried' },
                            { name: 'NAME_MIDDLE', value: 'Wilhelm' },
                            { name: 'NAME_LAST', value: 'Leibniz' },
                            { name: 'COMPANY_NAME', value: 'Erfundenes Unternehmen' },
                            { name: 'ADDRESS_HOME_LINE1', value: 'Erfundene Straße 33' },
                            { name: 'ADDRESS_HOME_LINE2', value: 'Wohnung 1' },
                            { name: 'ADDRESS_HOME_ZIP', value: '80732' },
                            { name: 'ADDRESS_HOME_CITY', value: 'München' },
                            { name: 'EMAIL_ADDRESS', value: 'test@beispiel.de' },
                            { name: 'PHONE_HOME_WHOLE_NUMBER', value: '+4930303986300' },
                        ],
                    },
                ] :
                [],
        });
    }
    enable() {
        if (__classPrivateFieldGet(this, _AutofillModel_enabled, "f") || Host.InspectorFrontendHost.isUnderTest()) {
            return;
        }
        void this.agent.invoke_enable();
        this.setTestAddresses();
        __classPrivateFieldSet(this, _AutofillModel_enabled, true, "f");
    }
    disable() {
        if (!__classPrivateFieldGet(this, _AutofillModel_enabled, "f") || Host.InspectorFrontendHost.isUnderTest()) {
            return;
        }
        __classPrivateFieldSet(this, _AutofillModel_enabled, false, "f");
        void this.agent.invoke_disable();
    }
    addressFormFilled(addressFormFilledEvent) {
        this.dispatchEventToListeners("AddressFormFilled" /* Events.ADDRESS_FORM_FILLED */, { autofillModel: this, event: addressFormFilledEvent });
    }
}
_AutofillModel_enabled = new WeakMap(), _AutofillModel_showTestAddressesInAutofillMenu = new WeakMap();
SDKModel.register(AutofillModel, { capabilities: 2 /* Capability.DOM */, autostart: true });
export var Events;
(function (Events) {
    Events["ADDRESS_FORM_FILLED"] = "AddressFormFilled";
})(Events || (Events = {}));
//# sourceMappingURL=AutofillModel.js.map