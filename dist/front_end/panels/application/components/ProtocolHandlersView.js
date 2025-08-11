// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _ProtocolHandlersView_instances, _ProtocolHandlersView_shadow, _ProtocolHandlersView_protocolHandlers, _ProtocolHandlersView_manifestLink, _ProtocolHandlersView_selectedProtocolState, _ProtocolHandlersView_queryInputState, _ProtocolHandlersView_update, _ProtocolHandlersView_renderStatusMessage, _ProtocolHandlersView_renderProtocolTest, _ProtocolHandlersView_handleProtocolSelect, _ProtocolHandlersView_handleQueryInputChange, _ProtocolHandlersView_handleTestProtocolClick, _ProtocolHandlersView_render;
import '../../../ui/components/icon_button/icon_button.js';
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as Input from '../../../ui/components/input/input.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import protocolHandlersViewStyles from './protocolHandlersView.css.js';
const { html } = Lit;
const PROTOCOL_DOCUMENT_URL = 'https://web.dev/url-protocol-handler/';
const UIStrings = {
    /**
     *@description Status message for when protocol handlers are detected in the manifest
     *@example {protocolhandler/manifest.json} PH1
     */
    protocolDetected: 'Found valid protocol handler registration in the {PH1}. With the app installed, test the registered protocols.',
    /**
     *@description Status message for when protocol handlers are not detected in the manifest
     *@example {protocolhandler/manifest.json} PH1
     */
    protocolNotDetected: 'Define protocol handlers in the {PH1} to register your app as a handler for custom protocols when your app is installed.',
    /**
     *@description Text wrapping a link pointing to more information on handling protocol handlers
     *@example {https://example.com/} PH1
     */
    needHelpReadOur: 'Need help? Read {PH1}.',
    /**
     *@description Link text for more information on URL protocol handler registrations for PWAs
     */
    protocolHandlerRegistrations: 'URL protocol handler registration for PWAs',
    /**
     *@description In text hyperlink to the PWA manifest
     */
    manifest: 'manifest',
    /**
     *@description Text for test protocol button
     */
    testProtocol: 'Test protocol',
    /**
     * @description Aria text for screen reader to announce they can select a protocol handler in the dropdown
     */
    dropdownLabel: 'Select protocol handler',
    /**
     * @description Aria text for screen reader to announce they can enter query parameters or endpoints into the textbox
     */
    textboxLabel: 'Query parameter or endpoint for protocol handler',
    /**
     * @description Placeholder for textbox input field, rest of the URL of protocol to test.
     */
    textboxPlaceholder: 'Enter URL',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/components/ProtocolHandlersView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ProtocolHandlersView extends HTMLElement {
    constructor() {
        super(...arguments);
        _ProtocolHandlersView_instances.add(this);
        _ProtocolHandlersView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ProtocolHandlersView_protocolHandlers.set(this, []);
        _ProtocolHandlersView_manifestLink.set(this, Platform.DevToolsPath.EmptyUrlString);
        _ProtocolHandlersView_selectedProtocolState.set(this, '');
        _ProtocolHandlersView_queryInputState.set(this, '');
        _ProtocolHandlersView_handleProtocolSelect.set(this, (evt) => {
            __classPrivateFieldSet(this, _ProtocolHandlersView_selectedProtocolState, evt.target.value, "f");
        });
        _ProtocolHandlersView_handleQueryInputChange.set(this, (evt) => {
            __classPrivateFieldSet(this, _ProtocolHandlersView_queryInputState, evt.target.value, "f");
            __classPrivateFieldGet(this, _ProtocolHandlersView_instances, "m", _ProtocolHandlersView_render).call(this);
        });
        _ProtocolHandlersView_handleTestProtocolClick.set(this, () => {
            const protocolURL = `${__classPrivateFieldGet(this, _ProtocolHandlersView_selectedProtocolState, "f")}://${__classPrivateFieldGet(this, _ProtocolHandlersView_queryInputState, "f")}`;
            Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(protocolURL);
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.CaptureTestProtocolClicked);
        });
    }
    set data(data) {
        const isNewManifest = __classPrivateFieldGet(this, _ProtocolHandlersView_manifestLink, "f") !== data.manifestLink;
        __classPrivateFieldSet(this, _ProtocolHandlersView_protocolHandlers, data.protocolHandlers, "f");
        __classPrivateFieldSet(this, _ProtocolHandlersView_manifestLink, data.manifestLink, "f");
        if (isNewManifest) {
            __classPrivateFieldGet(this, _ProtocolHandlersView_instances, "m", _ProtocolHandlersView_update).call(this);
        }
    }
}
_ProtocolHandlersView_shadow = new WeakMap(), _ProtocolHandlersView_protocolHandlers = new WeakMap(), _ProtocolHandlersView_manifestLink = new WeakMap(), _ProtocolHandlersView_selectedProtocolState = new WeakMap(), _ProtocolHandlersView_queryInputState = new WeakMap(), _ProtocolHandlersView_handleProtocolSelect = new WeakMap(), _ProtocolHandlersView_handleQueryInputChange = new WeakMap(), _ProtocolHandlersView_handleTestProtocolClick = new WeakMap(), _ProtocolHandlersView_instances = new WeakSet(), _ProtocolHandlersView_update = function _ProtocolHandlersView_update() {
    __classPrivateFieldSet(this, _ProtocolHandlersView_queryInputState, '', "f");
    __classPrivateFieldSet(this, _ProtocolHandlersView_selectedProtocolState, __classPrivateFieldGet(this, _ProtocolHandlersView_protocolHandlers, "f")[0]?.protocol ?? '', "f");
    __classPrivateFieldGet(this, _ProtocolHandlersView_instances, "m", _ProtocolHandlersView_render).call(this);
}, _ProtocolHandlersView_renderStatusMessage = function _ProtocolHandlersView_renderStatusMessage() {
    const manifestInTextLink = UI.XLink.XLink.create(__classPrivateFieldGet(this, _ProtocolHandlersView_manifestLink, "f"), i18nString(UIStrings.manifest), undefined, undefined, 'manifest');
    const statusString = __classPrivateFieldGet(this, _ProtocolHandlersView_protocolHandlers, "f").length > 0 ? UIStrings.protocolDetected : UIStrings.protocolNotDetected;
    // clang-format off
    return html `
    <div class="protocol-handlers-row status">
            <devtools-icon class="inline-icon"
                                                name=${__classPrivateFieldGet(this, _ProtocolHandlersView_protocolHandlers, "f").length > 0 ? 'check-circle' : 'info'}>
            </devtools-icon>
            ${i18n.i18n.getFormatLocalizedString(str_, statusString, {
        PH1: manifestInTextLink,
    })}
    </div>
    `;
    // clang-format on
}, _ProtocolHandlersView_renderProtocolTest = function _ProtocolHandlersView_renderProtocolTest() {
    if (__classPrivateFieldGet(this, _ProtocolHandlersView_protocolHandlers, "f").length === 0) {
        return Lit.nothing;
    }
    const protocolOptions = __classPrivateFieldGet(this, _ProtocolHandlersView_protocolHandlers, "f").filter(p => p.protocol)
        .map(p => html `<option value=${p.protocol} jslog=${VisualLogging.item(p.protocol).track({
        click: true,
    })}>${p.protocol}://</option>`);
    return html `
       <div class="protocol-handlers-row">
        <select class="protocol-select" @change=${__classPrivateFieldGet(this, _ProtocolHandlersView_handleProtocolSelect, "f")} aria-label=${i18nString(UIStrings.dropdownLabel)}>
           ${protocolOptions}
        </select>
        <input .value=${__classPrivateFieldGet(this, _ProtocolHandlersView_queryInputState, "f")} class="devtools-text-input" type="text" @change=${__classPrivateFieldGet(this, _ProtocolHandlersView_handleQueryInputChange, "f")} aria-label=${i18nString(UIStrings.textboxLabel)}
        placeholder=${i18nString(UIStrings.textboxPlaceholder)} />
        <devtools-button .variant=${"primary" /* Buttons.Button.Variant.PRIMARY */} @click=${__classPrivateFieldGet(this, _ProtocolHandlersView_handleTestProtocolClick, "f")}>
            ${i18nString(UIStrings.testProtocol)}
        </devtools-button>
        </div>
      `;
}, _ProtocolHandlersView_render = function _ProtocolHandlersView_render() {
    const protocolDocLink = UI.XLink.XLink.create(PROTOCOL_DOCUMENT_URL, i18nString(UIStrings.protocolHandlerRegistrations), undefined, undefined, 'learn-more');
    // inspectorCommonStyles is used for the <select> styling that is used for the dropdown
    // clang-format off
    Lit.render(html `
      <style>${protocolHandlersViewStyles}</style>
      <style>${UI.inspectorCommonStyles}</style>
      <style>${Input.textInputStyles}</style>
      ${__classPrivateFieldGet(this, _ProtocolHandlersView_instances, "m", _ProtocolHandlersView_renderStatusMessage).call(this)}
      <div class="protocol-handlers-row">
          ${i18n.i18n.getFormatLocalizedString(str_, UIStrings.needHelpReadOur, { PH1: protocolDocLink })}
      </div>
      ${__classPrivateFieldGet(this, _ProtocolHandlersView_instances, "m", _ProtocolHandlersView_renderProtocolTest).call(this)}
    `, __classPrivateFieldGet(this, _ProtocolHandlersView_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-protocol-handlers-view', ProtocolHandlersView);
//# sourceMappingURL=ProtocolHandlersView.js.map