// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _WebauthnPaneImpl_instances, _WebauthnPaneImpl_addAuthenticator, _WebauthnPaneImpl_activeAuthId, _WebauthnPaneImpl_editingAuthId, _WebauthnPaneImpl_hasBeenEnabled, _WebauthnPaneImpl_authenticators, _WebauthnPaneImpl_enabled, _WebauthnPaneImpl_availableAuthenticatorSetting, _WebauthnPaneImpl_model, _WebauthnPaneImpl_newAuthenticatorOptions, _WebauthnPaneImpl_hasInternalAuthenticator, _WebauthnPaneImpl_isEnabling, _WebauthnPaneImpl_view, _WebauthnPaneImpl_viewOutput, _WebauthnPaneImpl_loadInitialAuthenticators, _WebauthnPaneImpl_addCredential, _WebauthnPaneImpl_updateCredential, _WebauthnPaneImpl_deleteCredential, _WebauthnPaneImpl_setVirtualAuthEnvEnabled, _WebauthnPaneImpl_removeAuthenticatorSections, _WebauthnPaneImpl_handleCheckboxToggle, _WebauthnPaneImpl_updateNewAuthenticatorSectionOptions, _WebauthnPaneImpl_updateInternalTransportAvailability, _WebauthnPaneImpl_handleAddAuthenticatorButton, _WebauthnPaneImpl_exportCredential, _WebauthnPaneImpl_removeCredential, _WebauthnPaneImpl_handleEditNameButton, _WebauthnPaneImpl_handleSaveNameButton, _WebauthnPaneImpl_setActiveAuthenticator, _WebauthnPaneImpl_clearActiveAuthenticator;
import '../../ui/legacy/legacy.js';
import '../../ui/legacy/components/data_grid/data_grid.js';
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as Input from '../../ui/components/input/input.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import webauthnPaneStyles from './webauthnPane.css.js';
const { render, html, Directives: { ref, repeat, classMap } } = Lit;
const { widgetConfig } = UI.Widget;
const UIStrings = {
    /**
     *@description Label for button that allows user to download the private key related to a credential.
     */
    export: 'Export',
    /**
     *@description Label for an item to remove something
     */
    remove: 'Remove',
    /**
     *@description Label for empty credentials table.
     *@example {navigator.credentials.create()} PH1
     */
    noCredentialsTryCallingSFromYour: 'No credentials. Try calling {PH1} from your website.',
    /**
     *@description Label for checkbox to toggle the virtual authenticator environment allowing user to interact with software-based virtual authenticators.
     */
    enableVirtualAuthenticator: 'Enable virtual authenticator environment',
    /**
     *@description Label for ID field for credentials.
     */
    id: 'ID',
    /**
     *@description Label for field that describes whether a credential is a resident credential.
     */
    isResident: 'Is Resident',
    /**
     *@description Label for credential field that represents the Relying Party ID that the credential is scoped to.
     */
    rpId: 'RP ID',
    /**
     *@description Label for a column in a table. A field/unique ID that represents the user a credential is mapped to.
     */
    userHandle: 'User Handle',
    /**
     *@description Label for signature counter field for credentials which represents the number of successful assertions.
     * See https://w3c.github.io/webauthn/#signature-counter.
     */
    signCount: 'Signature Count',
    /**
     *@description Label for column with actions for credentials.
     */
    actions: 'Actions',
    /**
     *@description Title for the table that holds the credentials that a authenticator has registered.
     */
    credentials: 'Credentials',
    /**
     *@description Text that shows before the virtual environment is enabled.
     */
    noAuthenticator: 'No authenticator set up',
    /**
     *@description That that shows before virtual environment is enabled explaining the panel.
     */
    useWebauthnForPhishingresistant: 'Use WebAuthn for phishing-resistant authentication.',
    /**
     *@description Title for section of interface that allows user to add a new virtual authenticator.
     */
    newAuthenticator: 'New authenticator',
    /**
     *@description Text for security or network protocol
     */
    protocol: 'Protocol',
    /**
     *@description Label for input to select which transport option to use on virtual authenticators, e.g. USB or Bluetooth.
     */
    transport: 'Transport',
    /**
     *@description Label for checkbox that toggles resident key support on virtual authenticators.
     */
    supportsResidentKeys: 'Supports resident keys',
    /**
     *@description Label for checkbox that toggles large blob support on virtual authenticators. Large blobs are opaque data associated
     * with a WebAuthn credential that a website can store, like an SSH certificate or a symmetric encryption key.
     * See https://w3c.github.io/webauthn/#sctn-large-blob-extension
     */
    supportsLargeBlob: 'Supports large blob',
    /**
     *@description Text to add something
     */
    add: 'Add',
    /**
     *@description Label for radio button that toggles whether an authenticator is active.
     */
    active: 'Active',
    /**
     *@description Title for button that enables user to customize name of authenticator.
     */
    editName: 'Edit name',
    /**
     *@description Placeholder for the input box to customize name of authenticator.
     */
    enterNewName: 'Enter new name',
    /**
     *@description Title for button that enables user to save name of authenticator after editing it.
     */
    saveName: 'Save name',
    /**
     *@description Title for a user-added virtual authenticator which is uniquely identified with its AUTHENTICATORID.
     *@example {8c7873be-0b13-4996-a794-1521331bbd96} PH1
     */
    authenticatorS: 'Authenticator {PH1}',
    /**
     *@description Name for generated file which user can download. A private key is a secret code which enables encoding and decoding of a credential. .pem is the file extension.
     */
    privateKeypem: 'Private key.pem',
    /**
     *@description Label for field that holds an authenticator's universally unique identifier (UUID).
     */
    uuid: 'UUID',
    /**
     *@description Label for checkbox that toggles user verification support on virtual authenticators.
     */
    supportsUserVerification: 'Supports user verification',
    /**
     *@description Text in Timeline indicating that input has happened recently
     */
    yes: 'Yes',
    /**
     *@description Text in Timeline indicating that input has not happened recently
     */
    no: 'No',
    /**
     *@description Title of radio button that sets an authenticator as active.
     *@example {Authenticator ABCDEF} PH1
     */
    setSAsTheActiveAuthenticator: 'Set {PH1} as the active authenticator',
};
const str_ = i18n.i18n.registerUIStrings('panels/webauthn/WebauthnPane.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const i18nTemplate = Lit.i18nTemplate.bind(undefined, str_);
const WEB_AUTHN_EXPLANATION_URL = 'https://developer.chrome.com/docs/devtools/webauthn';
function renderCredentialsDataGrid(authenticatorId, credentials, onExport, onRemove) {
    // clang-format off
    return html `
    <devtools-data-grid name=${i18nString(UIStrings.credentials)} inline striped>
      <table>
        <thead>
          <tr>
            <th id="credentialId" weight="24" text-overflow="ellipsis">${i18nString(UIStrings.id)}</th>
            <th id="isResidentCredential" type="boolean" weight="10">${i18nString(UIStrings.isResident)}</th>
            <th id="rpId" weight="16.5">${i18nString(UIStrings.rpId)}</th>
            <th id="userHandle" weight="16.5">${i18nString(UIStrings.userHandle)}</th>
            <th id="signCount" weight="16.5">${i18nString(UIStrings.signCount)}</th>
            <th id="actions" weight="16.5">${i18nString(UIStrings.actions)}</th>
          </tr>
        </thead>
        <tbody>
        ${credentials.length ? repeat(credentials, c => c.credentialId, credential => html `
          <tr>
            <td>${credential.credentialId}</td>
            <td>${credential.isResidentCredential}</td>
            <td>${credential.rpId}</td>
            <td>${credential.userHandle}</td>
            <td>${credential.signCount}</td>
            <td>
              <devtools-button .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}
                  part="action-button"
                  @click=${() => onExport(credential)}
                  .jslogContext=${'webauthn.export-credential'}>
                ${i18nString(UIStrings.export)}
              </devtools-button>
              <devtools-button .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}
                  part="action-button"
                  @click=${() => onRemove(credential.credentialId)}
                  .jslogContext=${'webauthn.remove-credential'}>
                ${i18nString(UIStrings.remove)}
              </devtools-button>
            </td>
          </tr>`) : html `
          <tr>
            <td class="center" colspan=6>
              ${i18nTemplate(UIStrings.noCredentialsTryCallingSFromYour, { PH1: html `<span class="code">navigator.credentials.create()</span>` })}
            </td>
          </tr>`}
        </tbody>
      </table>
    </devtools-data-grid>`;
    // clang-format on
}
// We extrapolate this variable as otherwise git detects a private key, even though we
// perform string manipulation. If we extract the name, then the regex doesn't match
// and we can upload as expected.
const PRIVATE_NAME = 'PRIVATE';
const PRIVATE_KEY_HEADER = `-----BEGIN ${PRIVATE_NAME} KEY-----
`;
const PRIVATE_KEY_FOOTER = `-----END ${PRIVATE_NAME} KEY-----`;
const PROTOCOL_AUTHENTICATOR_VALUES = {
    Ctap2: "ctap2" /* Protocol.WebAuthn.AuthenticatorProtocol.Ctap2 */,
    U2f: "u2f" /* Protocol.WebAuthn.AuthenticatorProtocol.U2f */,
};
function renderToolbar(enabled, onToggle) {
    const enableCheckboxTitle = i18nString(UIStrings.enableVirtualAuthenticator);
    // clang-format off
    return html `
    <div class="webauthn-toolbar-container" jslog=${VisualLogging.toolbar()} role="toolbar">
      <devtools-toolbar class="webauthn-toolbar" role="presentation">
        <devtools-checkbox title=${enableCheckboxTitle}
            @click=${onToggle}
            .jslogContext=${'virtual-authenticators'}
            .checked=${enabled}>
          ${enableCheckboxTitle}
        </devtools-checkbox>
      </devtools-toolbar>
    </div>`;
    // clang-format on
}
function renderLearnMoreView() {
    // clang-format off
    return html `
    <devtools-widget class="learn-more" .widgetConfig=${widgetConfig(UI.EmptyWidget.EmptyWidget, {
        header: i18nString(UIStrings.noAuthenticator),
        text: i18nString(UIStrings.useWebauthnForPhishingresistant),
        link: WEB_AUTHN_EXPLANATION_URL
    })}>
    </devtools-widget>`;
    // clang-format on
}
function renderNewAuthenticatorSection(options, internalTransportAvailable, onUpdate, onAdd) {
    const isCtap2 = options.protocol === "ctap2" /* Protocol.WebAuthn.AuthenticatorProtocol.Ctap2 */;
    // clang-format off
    return html `
    <div class="new-authenticator-container">
      <label class="new-authenticator-title">
        ${i18nString(UIStrings.newAuthenticator)}
      </label>
      <div class="new-authenticator-form" jslog=${VisualLogging.section('new-authenticator')}>
        <div class="authenticator-option">
          <label class="authenticator-option-label" for="protocol">
            ${i18nString(UIStrings.protocol)}
          </label>
          <select id="protocol" jslog=${VisualLogging.dropDown('protocol').track({ change: true })}
              value=${options.protocol}
              @change=${(e) => onUpdate({ protocol: e.target.value })}>
            ${Object.values(PROTOCOL_AUTHENTICATOR_VALUES).sort().map(option => html `
              <option value=${option} jslog=${VisualLogging.item(option).track({ click: true })}>
                ${option}
              </option>`)}
          </select>
        </div>
        <div class="authenticator-option">
          <label for="transport" class="authenticator-option-label">
            ${i18nString(UIStrings.transport)}
          </label>
          <select id="transport"
              value=${options.transport}
              jslog=${VisualLogging.dropDown('transport').track({ change: true })}
              @change=${(e) => onUpdate({ transport: e.target.value })}>
            ${[
        "usb" /* Protocol.WebAuthn.AuthenticatorTransport.Usb */,
        "ble" /* Protocol.WebAuthn.AuthenticatorTransport.Ble */,
        "nfc" /* Protocol.WebAuthn.AuthenticatorTransport.Nfc */,
        ...(isCtap2 ? ["internal" /* Protocol.WebAuthn.AuthenticatorTransport.Internal */] : [])
    ].map(option => html `
                <option value=${option} jslog=${VisualLogging.item(option).track({ click: true })}
                        .selected=${options.transport === option}
                        .disabled=${!internalTransportAvailable
        && option === "internal" /* Protocol.WebAuthn.AuthenticatorTransport.Internal */}>
                  ${option}
                </option>`)}
          </select>
        </div>
        <div class="authenticator-option">
          <label for="resident-key" class="authenticator-option-label">
            ${i18nString(UIStrings.supportsResidentKeys)}
          </label>
          <input id="resident-key" class="authenticator-option-checkbox" type="checkbox"
              jslog=${VisualLogging.toggle('resident-key').track({ change: true })}
              @change=${(e) => onUpdate({ hasResidentKey: e.target.checked })}
              .checked=${Boolean(options.hasResidentKey && isCtap2)} .disabled=${!isCtap2}>
        </div>
        <div class="authenticator-option">
          <label for="user-verification" class="authenticator-option-label">
            ${i18nString(UIStrings.supportsUserVerification)}
          </label>
          <input id="user-verification" class="authenticator-option-checkbox" type="checkbox"
              jslog=${VisualLogging.toggle('user-verification').track({ change: true })}
              @change=${(e) => onUpdate({ hasUserVerification: e.target.checked })}
              .checked=${Boolean(options.hasUserVerification && isCtap2)}
              .disabled=${!isCtap2}>
        </div>
        <div class="authenticator-option">
          <label for="large-blob" class="authenticator-option-label">
            ${i18nString(UIStrings.supportsLargeBlob)}
          </label>
          <input id="large-blob" class="authenticator-option-checkbox" type="checkbox"
              jslog=${VisualLogging.toggle('large-blob').track({ change: true })}
              @change=${(e) => onUpdate({ hasLargeBlob: e.target.checked })}
              .checked=${Boolean(options.hasLargeBlob && isCtap2 && options.hasResidentKey)}
              .disabled=${!options.hasResidentKey || !isCtap2}>
        </div>
        <div class="authenticator-option">
          <div class="authenticator-option-label"></div>
          <devtools-button @click=${onAdd}
              id="add-authenticator"
              .jslogContext=${'webauthn.add-authenticator'}
              .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}>
            ${i18nString(UIStrings.add)}
          </devtools-button>
        </div>
      </div>
    </div>`;
}
function renderAuthenticatorSection(authenticatorId, authenticator, active, editing, onActivate, onEditName, onSaveName, onRemove, onExportCredential, onRemoveCredential, output) {
    function revealSection(section) {
        if (!section) {
            return;
        }
        const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
        const prefersReducedMotion = mediaQueryList.matches;
        section.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    // clang-format off
    return html `
    <div class="authenticator-section" data-authenticator-id=${authenticatorId}
         jslog=${VisualLogging.section('authenticator')}
          ${ref(e => { output.revealSection.set(authenticatorId, revealSection.bind(null, e)); })}>
      <div class="authenticator-section-header">
        <div class="authenticator-section-title" role="heading" aria-level="2">
          <devtools-toolbar class="edit-name-toolbar">
            <devtools-button title=${i18nString(UIStrings.editName)}
                class=${classMap({ hidden: editing })}
                @click=${onEditName}
                .iconName=${'edit'} .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
                .jslogContext=${'edit-name'}></devtools-button>
            <devtools-button title=${i18nString(UIStrings.saveName)}
                @click=${(e) => onSaveName((e.target.parentElement?.nextSibling).value)}
                .iconName=${'checkmark'} .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
                class=${classMap({ hidden: !editing })}
                .jslogContext=${'save-name'}></devtools-button>
          </devtools-toolbar>
          <input class="authenticator-name-field"
              placeholder=${i18nString(UIStrings.enterNewName)}
              jslog=${VisualLogging.textField('name').track({ keydown: 'Enter', change: true })}
              value=${i18nString(UIStrings.authenticatorS, { PH1: authenticator.name })} .disabled=${!editing}
              ${ref(e => { if (e instanceof HTMLInputElement && editing) {
        e.focus();
    } })}
              @focusout=${(e) => onSaveName(e.target.value)}
              @keydown=${(event) => {
        if (event.key === 'Enter') {
            onSaveName(event.target.value);
        }
    }}>
        </div>
        <div class="active-button-container">
          <label title=${i18nString(UIStrings.setSAsTheActiveAuthenticator, { PH1: authenticator.name })}>
            <input type="radio" .checked=${active} @change=${(e) => { if (e.target.checked) {
        onActivate();
    } }}
                  jslog=${VisualLogging.toggle('webauthn.active-authenticator').track({ change: true })}>
            ${i18nString(UIStrings.active)}
          </label>
        </div>
        <button class="text-button" @click=${onRemove}
            jslog=${VisualLogging.action('webauthn.remove-authenticator').track({ click: true })}>
          ${i18nString(UIStrings.remove)}
        </button>
      </div>
      ${renderAuthenticatorFields(authenticatorId, authenticator.options)}
      <div class="credentials-title">${i18nString(UIStrings.credentials)}</div>
      ${renderCredentialsDataGrid(authenticatorId, authenticator.credentials, onExportCredential, onRemoveCredential)}
      <div class="divider"></div>
    </div>`;
    // clang-format on
}
/**
 * Creates the fields describing the authenticator in the front end.
 */
function renderAuthenticatorFields(authenticatorId, options) {
    // clang-format off
    return html `
    <div class="authenticator-fields">
      <div class="authenticator-field">
        <label class="authenticator-option-label">${i18nString(UIStrings.uuid)}</label>
        <div class="authenticator-field-value">${authenticatorId}</div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">${i18nString(UIStrings.protocol)}</label>
        <div class="authenticator-field-value">${options.protocol}</div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">${i18nString(UIStrings.transport)}</label>
        <div class="authenticator-field-value">${options.transport}</div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${i18nString(UIStrings.supportsResidentKeys)}
        </label>
        <div class="authenticator-field-value">
          ${options.hasResidentKey ? i18nString(UIStrings.yes) : i18nString(UIStrings.no)}
        </div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${i18nString(UIStrings.supportsLargeBlob)}
        </label>
        <div class="authenticator-field-value">
          ${options.hasLargeBlob ? i18nString(UIStrings.yes) : i18nString(UIStrings.no)}
        </div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${i18nString(UIStrings.supportsUserVerification)}
        </label>
        <div class="authenticator-field-value">
          ${options.hasUserVerification ? i18nString(UIStrings.yes) : i18nString(UIStrings.no)}
        </div>
      </div>
    </div>`;
    // clang-format on
}
export const DEFAULT_VIEW = (input, output, target) => {
    // clang-format off
    render(html `
    <style>${Input.checkboxStyles}</style>
    <style>${webauthnPaneStyles}</style>
    <div class="webauthn-pane flex-auto ${classMap({ enabled: input.enabled })}">
      ${renderToolbar(input.enabled, input.onToggleEnabled)}
      <div class="authenticators-view">
         ${repeat([...input.authenticators.entries()], ([id]) => id, ([id, authenticator]) => renderAuthenticatorSection(id, authenticator, input.activeAuthenticatorId === id, input.editingAuthenticatorId === id, input.onActivateAuthenticator.bind(input, id), input.onEditName.bind(input, id), input.onSaveName.bind(input, id), input.onRemoveAuthenticator.bind(input, id), input.onExportCredential, input.onRemoveCredential.bind(input, id), output))}
      </div>
      ${renderLearnMoreView()}
      ${renderNewAuthenticatorSection(input.newAuthenticatorOptions, input.internalTransportAvailable, input.updateNewAuthenticatorOptions, input.addAuthenticator)}
    </div>`, target, { host: input });
    // clang-format on
};
export class WebauthnPaneImpl extends UI.Panel.Panel {
    constructor(view = DEFAULT_VIEW) {
        super('webauthn');
        _WebauthnPaneImpl_instances.add(this);
        _WebauthnPaneImpl_activeAuthId.set(this, null);
        _WebauthnPaneImpl_editingAuthId.set(this, null);
        _WebauthnPaneImpl_hasBeenEnabled.set(this, false);
        _WebauthnPaneImpl_authenticators.set(this, new Map());
        _WebauthnPaneImpl_enabled.set(this, false);
        _WebauthnPaneImpl_availableAuthenticatorSetting.set(this, void 0);
        _WebauthnPaneImpl_model.set(this, void 0);
        _WebauthnPaneImpl_newAuthenticatorOptions.set(this, {
            protocol: "ctap2" /* Protocol.WebAuthn.AuthenticatorProtocol.Ctap2 */,
            transport: "usb" /* Protocol.WebAuthn.AuthenticatorTransport.Usb */,
            hasResidentKey: false,
            hasUserVerification: false,
            hasLargeBlob: false,
            automaticPresenceSimulation: true,
            isUserVerified: true,
        });
        _WebauthnPaneImpl_hasInternalAuthenticator.set(this, false);
        _WebauthnPaneImpl_isEnabling.set(this, void 0);
        _WebauthnPaneImpl_view.set(this, void 0);
        _WebauthnPaneImpl_viewOutput.set(this, {
            revealSection: new Map(),
        });
        __classPrivateFieldSet(this, _WebauthnPaneImpl_view, view, "f");
        SDK.TargetManager.TargetManager.instance().observeModels(SDK.WebAuthnModel.WebAuthnModel, this, { scoped: true });
        __classPrivateFieldSet(this, _WebauthnPaneImpl_availableAuthenticatorSetting, Common.Settings.Settings.instance().createSetting('webauthn-authenticators', []), "f");
        __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_updateInternalTransportAvailability).call(this);
        this.performUpdate();
    }
    performUpdate() {
        const viewInput = {
            enabled: __classPrivateFieldGet(this, _WebauthnPaneImpl_enabled, "f"),
            onToggleEnabled: __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_handleCheckboxToggle).bind(this),
            authenticators: __classPrivateFieldGet(this, _WebauthnPaneImpl_authenticators, "f"),
            activeAuthenticatorId: __classPrivateFieldGet(this, _WebauthnPaneImpl_activeAuthId, "f"),
            editingAuthenticatorId: __classPrivateFieldGet(this, _WebauthnPaneImpl_editingAuthId, "f"),
            newAuthenticatorOptions: __classPrivateFieldGet(this, _WebauthnPaneImpl_newAuthenticatorOptions, "f"),
            internalTransportAvailable: !__classPrivateFieldGet(this, _WebauthnPaneImpl_hasInternalAuthenticator, "f"),
            updateNewAuthenticatorOptions: __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_updateNewAuthenticatorSectionOptions).bind(this),
            addAuthenticator: __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_handleAddAuthenticatorButton).bind(this),
            onActivateAuthenticator: __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_setActiveAuthenticator).bind(this),
            onEditName: __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_handleEditNameButton).bind(this),
            onSaveName: __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_handleSaveNameButton).bind(this),
            onRemoveAuthenticator: this.removeAuthenticator.bind(this),
            onExportCredential: __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_exportCredential).bind(this),
            onRemoveCredential: __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_removeCredential).bind(this),
        };
        __classPrivateFieldGet(this, _WebauthnPaneImpl_view, "f").call(this, viewInput, __classPrivateFieldGet(this, _WebauthnPaneImpl_viewOutput, "f"), this.contentElement);
    }
    modelAdded(model) {
        if (model.target() === model.target().outermostTarget()) {
            __classPrivateFieldSet(this, _WebauthnPaneImpl_model, model, "f");
        }
    }
    modelRemoved(model) {
        if (model.target() === model.target().outermostTarget()) {
            __classPrivateFieldSet(this, _WebauthnPaneImpl_model, undefined, "f");
        }
    }
    async ownerViewDisposed() {
        __classPrivateFieldSet(this, _WebauthnPaneImpl_enabled, false, "f");
        await __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_setVirtualAuthEnvEnabled).call(this, false);
    }
    /**
     * Removes both the authenticator and its respective UI element.
     */
    removeAuthenticator(authenticatorId) {
        __classPrivateFieldGet(this, _WebauthnPaneImpl_authenticators, "f").delete(authenticatorId);
        this.requestUpdate();
        if (__classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f")) {
            void __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f").removeAuthenticator(authenticatorId);
        }
        // Update available authenticator setting.
        const prevAvailableAuthenticators = __classPrivateFieldGet(this, _WebauthnPaneImpl_availableAuthenticatorSetting, "f").get();
        const newAvailableAuthenticators = prevAvailableAuthenticators.filter(a => a.authenticatorId !== authenticatorId);
        __classPrivateFieldGet(this, _WebauthnPaneImpl_availableAuthenticatorSetting, "f").set(newAvailableAuthenticators);
        if (__classPrivateFieldGet(this, _WebauthnPaneImpl_activeAuthId, "f") === authenticatorId) {
            const availableAuthenticatorIds = Array.from(__classPrivateFieldGet(this, _WebauthnPaneImpl_authenticators, "f").keys());
            if (availableAuthenticatorIds.length) {
                void __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_setActiveAuthenticator).call(this, availableAuthenticatorIds[0]);
            }
            else {
                __classPrivateFieldSet(this, _WebauthnPaneImpl_activeAuthId, null, "f");
            }
        }
        __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_updateInternalTransportAvailability).call(this);
    }
}
_WebauthnPaneImpl_activeAuthId = new WeakMap(), _WebauthnPaneImpl_editingAuthId = new WeakMap(), _WebauthnPaneImpl_hasBeenEnabled = new WeakMap(), _WebauthnPaneImpl_authenticators = new WeakMap(), _WebauthnPaneImpl_enabled = new WeakMap(), _WebauthnPaneImpl_availableAuthenticatorSetting = new WeakMap(), _WebauthnPaneImpl_model = new WeakMap(), _WebauthnPaneImpl_newAuthenticatorOptions = new WeakMap(), _WebauthnPaneImpl_hasInternalAuthenticator = new WeakMap(), _WebauthnPaneImpl_isEnabling = new WeakMap(), _WebauthnPaneImpl_view = new WeakMap(), _WebauthnPaneImpl_viewOutput = new WeakMap(), _WebauthnPaneImpl_instances = new WeakSet(), _WebauthnPaneImpl_addAuthenticator = async function _WebauthnPaneImpl_addAuthenticator(options) {
    if (!__classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f")) {
        throw new Error('WebAuthn model is not available.');
    }
    const authenticatorId = await __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f").addAuthenticator(options);
    const userFriendlyName = authenticatorId.slice(-5); // User friendly name defaults to last 5 chars of UUID.
    __classPrivateFieldGet(this, _WebauthnPaneImpl_authenticators, "f").set(authenticatorId, {
        name: userFriendlyName,
        options,
        credentials: [],
    });
    this.requestUpdate();
    __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f").addEventListener("CredentialAdded" /* SDK.WebAuthnModel.Events.CREDENTIAL_ADDED */, __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_addCredential).bind(this, authenticatorId));
    __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f").addEventListener("CredentialAsserted" /* SDK.WebAuthnModel.Events.CREDENTIAL_ASSERTED */, __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_updateCredential).bind(this, authenticatorId));
    __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f").addEventListener("CredentialUpdated" /* SDK.WebAuthnModel.Events.CREDENTIAL_UPDATED */, __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_updateCredential).bind(this, authenticatorId));
    __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f").addEventListener("CredentialDeleted" /* SDK.WebAuthnModel.Events.CREDENTIAL_DELETED */, __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_deleteCredential).bind(this, authenticatorId));
    return authenticatorId;
}, _WebauthnPaneImpl_loadInitialAuthenticators = async function _WebauthnPaneImpl_loadInitialAuthenticators() {
    let activeAuthenticatorId = null;
    const availableAuthenticators = __classPrivateFieldGet(this, _WebauthnPaneImpl_availableAuthenticatorSetting, "f").get();
    for (const options of availableAuthenticators) {
        if (!__classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f")) {
            continue;
        }
        const authenticatorId = await __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_addAuthenticator).call(this, options);
        // Update the authenticatorIds in the options.
        options.authenticatorId = authenticatorId;
        if (options.active) {
            activeAuthenticatorId = authenticatorId;
        }
    }
    // Update the settings to reflect the new authenticatorIds.
    __classPrivateFieldGet(this, _WebauthnPaneImpl_availableAuthenticatorSetting, "f").set(availableAuthenticators);
    if (activeAuthenticatorId) {
        void __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_setActiveAuthenticator).call(this, activeAuthenticatorId);
    }
}, _WebauthnPaneImpl_addCredential = function _WebauthnPaneImpl_addCredential(authenticatorId, { data: event, }) {
    const authenticator = __classPrivateFieldGet(this, _WebauthnPaneImpl_authenticators, "f").get(authenticatorId);
    if (!authenticator) {
        return;
    }
    authenticator.credentials.push(event.credential);
    this.requestUpdate();
}, _WebauthnPaneImpl_updateCredential = function _WebauthnPaneImpl_updateCredential(authenticatorId, { data: event, }) {
    const authenticator = __classPrivateFieldGet(this, _WebauthnPaneImpl_authenticators, "f").get(authenticatorId);
    if (!authenticator) {
        return;
    }
    const credential = authenticator.credentials.find(credential => credential.credentialId === event.credential.credentialId);
    if (!credential) {
        return;
    }
    Object.assign(credential, event.credential);
    this.requestUpdate();
}, _WebauthnPaneImpl_deleteCredential = function _WebauthnPaneImpl_deleteCredential(authenticatorId, { data: event, }) {
    const authenticator = __classPrivateFieldGet(this, _WebauthnPaneImpl_authenticators, "f").get(authenticatorId);
    if (!authenticator) {
        return;
    }
    const credentialIndex = authenticator.credentials.findIndex(credential => credential.credentialId === event.credentialId);
    if (credentialIndex < 0) {
        return;
    }
    authenticator.credentials.splice(credentialIndex, 1);
    this.requestUpdate();
}, _WebauthnPaneImpl_setVirtualAuthEnvEnabled = async function _WebauthnPaneImpl_setVirtualAuthEnvEnabled(enable) {
    await __classPrivateFieldGet(this, _WebauthnPaneImpl_isEnabling, "f");
    __classPrivateFieldSet(this, _WebauthnPaneImpl_isEnabling, new Promise(async (resolve) => {
        if (enable && !__classPrivateFieldGet(this, _WebauthnPaneImpl_hasBeenEnabled, "f")) {
            // Ensures metric is only tracked once per session.
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.VirtualAuthenticatorEnvironmentEnabled);
            __classPrivateFieldSet(this, _WebauthnPaneImpl_hasBeenEnabled, true, "f");
        }
        if (__classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f")) {
            await __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f").setVirtualAuthEnvEnabled(enable);
        }
        if (enable) {
            await __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_loadInitialAuthenticators).call(this);
        }
        else {
            __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_removeAuthenticatorSections).call(this);
        }
        __classPrivateFieldSet(this, _WebauthnPaneImpl_isEnabling, undefined, "f");
        __classPrivateFieldSet(this, _WebauthnPaneImpl_enabled, enable, "f");
        this.requestUpdate();
        resolve();
    }), "f");
}, _WebauthnPaneImpl_removeAuthenticatorSections = function _WebauthnPaneImpl_removeAuthenticatorSections() {
    __classPrivateFieldGet(this, _WebauthnPaneImpl_authenticators, "f").clear();
}, _WebauthnPaneImpl_handleCheckboxToggle = function _WebauthnPaneImpl_handleCheckboxToggle() {
    void __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_setVirtualAuthEnvEnabled).call(this, !__classPrivateFieldGet(this, _WebauthnPaneImpl_enabled, "f"));
}, _WebauthnPaneImpl_updateNewAuthenticatorSectionOptions = function _WebauthnPaneImpl_updateNewAuthenticatorSectionOptions(change) {
    Object.assign(__classPrivateFieldGet(this, _WebauthnPaneImpl_newAuthenticatorOptions, "f"), change);
    this.requestUpdate();
}, _WebauthnPaneImpl_updateInternalTransportAvailability = function _WebauthnPaneImpl_updateInternalTransportAvailability() {
    __classPrivateFieldSet(this, _WebauthnPaneImpl_hasInternalAuthenticator, Boolean(__classPrivateFieldGet(this, _WebauthnPaneImpl_availableAuthenticatorSetting, "f").get().find(authenticator => authenticator.transport === "internal" /* Protocol.WebAuthn.AuthenticatorTransport.Internal */)), "f");
    if (__classPrivateFieldGet(this, _WebauthnPaneImpl_hasInternalAuthenticator, "f") &&
        __classPrivateFieldGet(this, _WebauthnPaneImpl_newAuthenticatorOptions, "f").transport === "internal" /* Protocol.WebAuthn.AuthenticatorTransport.Internal */) {
        __classPrivateFieldGet(this, _WebauthnPaneImpl_newAuthenticatorOptions, "f").transport = "nfc" /* Protocol.WebAuthn.AuthenticatorTransport.Nfc */;
    }
    this.requestUpdate();
}, _WebauthnPaneImpl_handleAddAuthenticatorButton = async function _WebauthnPaneImpl_handleAddAuthenticatorButton() {
    const options = __classPrivateFieldGet(this, _WebauthnPaneImpl_newAuthenticatorOptions, "f");
    if (__classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f")) {
        const authenticatorId = await __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_addAuthenticator).call(this, options);
        __classPrivateFieldSet(this, _WebauthnPaneImpl_activeAuthId, authenticatorId, "f"); // Newly added authenticator is automatically set as active.
        const availableAuthenticators = __classPrivateFieldGet(this, _WebauthnPaneImpl_availableAuthenticatorSetting, "f").get();
        availableAuthenticators.push({ authenticatorId, active: true, ...options });
        __classPrivateFieldGet(this, _WebauthnPaneImpl_availableAuthenticatorSetting, "f").set(availableAuthenticators.map(a => ({ ...a, active: a.authenticatorId === authenticatorId })));
        __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_updateInternalTransportAvailability).call(this);
        await this.updateComplete;
        __classPrivateFieldGet(this, _WebauthnPaneImpl_viewOutput, "f").revealSection.get(authenticatorId)?.();
    }
}, _WebauthnPaneImpl_exportCredential = function _WebauthnPaneImpl_exportCredential(credential) {
    let pem = PRIVATE_KEY_HEADER;
    for (let i = 0; i < credential.privateKey.length; i += 64) {
        pem += credential.privateKey.substring(i, i + 64) + '\n';
    }
    pem += PRIVATE_KEY_FOOTER;
    /* eslint-disable-next-line rulesdir/no-imperative-dom-api */
    const link = document.createElement('a');
    link.download = i18nString(UIStrings.privateKeypem);
    link.href = 'data:application/x-pem-file,' + encodeURIComponent(pem);
    link.click();
}, _WebauthnPaneImpl_removeCredential = function _WebauthnPaneImpl_removeCredential(authenticatorId, credentialId) {
    const authenticator = __classPrivateFieldGet(this, _WebauthnPaneImpl_authenticators, "f").get(authenticatorId);
    if (!authenticator) {
        return;
    }
    const authenticatorIndex = authenticator.credentials.findIndex(credential => credential.credentialId === credentialId);
    if (authenticatorIndex < 0) {
        return;
    }
    authenticator.credentials.splice(authenticatorIndex, 1);
    this.requestUpdate();
    if (__classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f")) {
        void __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f").removeCredential(authenticatorId, credentialId);
    }
}, _WebauthnPaneImpl_handleEditNameButton = function _WebauthnPaneImpl_handleEditNameButton(authenticatorId) {
    __classPrivateFieldSet(this, _WebauthnPaneImpl_editingAuthId, authenticatorId, "f");
    this.requestUpdate();
}, _WebauthnPaneImpl_handleSaveNameButton = function _WebauthnPaneImpl_handleSaveNameButton(authenticatorId, name) {
    const authenticator = __classPrivateFieldGet(this, _WebauthnPaneImpl_authenticators, "f").get(authenticatorId);
    if (!authenticator) {
        return;
    }
    authenticator.name = name;
    __classPrivateFieldSet(this, _WebauthnPaneImpl_editingAuthId, null, "f");
    this.requestUpdate();
}, _WebauthnPaneImpl_setActiveAuthenticator = 
/**
 * Sets the given authenticator as active.
 * Note that a newly added authenticator will automatically be set as active.
 */
async function _WebauthnPaneImpl_setActiveAuthenticator(authenticatorId) {
    await __classPrivateFieldGet(this, _WebauthnPaneImpl_instances, "m", _WebauthnPaneImpl_clearActiveAuthenticator).call(this);
    if (__classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f")) {
        await __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f").setAutomaticPresenceSimulation(authenticatorId, true);
    }
    __classPrivateFieldSet(this, _WebauthnPaneImpl_activeAuthId, authenticatorId, "f");
    const prevAvailableAuthenticators = __classPrivateFieldGet(this, _WebauthnPaneImpl_availableAuthenticatorSetting, "f").get();
    const newAvailableAuthenticators = prevAvailableAuthenticators.map(a => ({ ...a, active: a.authenticatorId === authenticatorId }));
    __classPrivateFieldGet(this, _WebauthnPaneImpl_availableAuthenticatorSetting, "f").set(newAvailableAuthenticators);
    this.requestUpdate();
}, _WebauthnPaneImpl_clearActiveAuthenticator = async function _WebauthnPaneImpl_clearActiveAuthenticator() {
    if (__classPrivateFieldGet(this, _WebauthnPaneImpl_activeAuthId, "f") && __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f")) {
        await __classPrivateFieldGet(this, _WebauthnPaneImpl_model, "f").setAutomaticPresenceSimulation(__classPrivateFieldGet(this, _WebauthnPaneImpl_activeAuthId, "f"), false);
    }
    __classPrivateFieldSet(this, _WebauthnPaneImpl_activeAuthId, null, "f");
    this.requestUpdate();
};
//# sourceMappingURL=WebauthnPane.js.map