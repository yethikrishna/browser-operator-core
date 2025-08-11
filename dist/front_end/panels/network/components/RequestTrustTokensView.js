// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _RequestTrustTokensView_instances, _RequestTrustTokensView_shadow, _RequestTrustTokensView_request, _RequestTrustTokensView_renderParameterSection, _RequestTrustTokensView_renderRefreshPolicy, _RequestTrustTokensView_renderIssuers, _RequestTrustTokensView_renderIssuerAndTopLevelOriginFromResult, _RequestTrustTokensView_renderResultSection, _RequestTrustTokensView_renderIssuedTokenCount;
import '../../../ui/components/report_view/report_view.js';
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as LegacyWrapper from '../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import requestTrustTokensViewStyles from './RequestTrustTokensView.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description Section heading in the Trust Token tab
     */
    parameters: 'Parameters',
    /**
     *@description Text that refers to some types
     */
    type: 'Type',
    /**
     *@description Label for a Trust Token parameter
     */
    refreshPolicy: 'Refresh policy',
    /**
     *@description Label for a list if origins in the Trust Token tab
     */
    issuers: 'Issuers',
    /**
     *@description Label for a report field in the Network panel
     */
    topLevelOrigin: 'Top level origin',
    /**
     *@description Text for the issuer of an item
     */
    issuer: 'Issuer',
    /**
     *@description Heading of a report section in the Network panel
     */
    result: 'Result',
    /**
     *@description Text for the status of something
     */
    status: 'Status',
    /**
     *@description Label for a field in the Network panel
     */
    numberOfIssuedTokens: 'Number of issued tokens',
    /**
     * @description Text for the success status in the Network panel. Refers to the outcome of a network
     * request which will either be 'Success' or 'Failure'.
     */
    success: 'Success',
    /**
     *@description Text in the network panel for an error status
     */
    failure: 'Failure',
    /**
     *@description Detailed text for a success status in the Network panel
     */
    theOperationsResultWasServedFrom: 'The operations result was served from cache.',
    /**
     *@description Detailed text for a success status in the Network panel
     */
    theOperationWasFulfilledLocally: 'The operation was fulfilled locally, no request was sent.',
    /**
     *@description Text for an error status in the Network panel
     */
    theKeysForThisPSTIssuerAreUnavailable: 'The keys for this PST issuer are unavailable. The issuer may need to be registered via the Chrome registration process.',
    /**
     *@description Text for an error status in the Network panel
     */
    aClientprovidedArgumentWas: 'A client-provided argument was malformed or otherwise invalid.',
    /**
     *@description Text for an error status in the Network panel
     */
    eitherNoInputsForThisOperation: 'Either no inputs for this operation are available or the output exceeds the operations quota.',
    /**
     *@description Text for an error status in the Network panel
     */
    theServersResponseWasMalformedOr: 'The servers response was malformed or otherwise invalid.',
    /**
     *@description Text for an error status in the Network panel
     */
    theOperationFailedForAnUnknown: 'The operation failed for an unknown reason.',
    /**
     *@description Text for an error status in the Network panel
     */
    perSiteLimit: 'Per-site issuer limit reached.',
};
const str_ = i18n.i18n.registerUIStrings('panels/network/components/RequestTrustTokensView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class RequestTrustTokensView extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor(request) {
        super();
        _RequestTrustTokensView_instances.add(this);
        _RequestTrustTokensView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _RequestTrustTokensView_request.set(this, void 0);
        __classPrivateFieldSet(this, _RequestTrustTokensView_request, request, "f");
    }
    wasShown() {
        __classPrivateFieldGet(this, _RequestTrustTokensView_request, "f").addEventListener(SDK.NetworkRequest.Events.TRUST_TOKEN_RESULT_ADDED, this.render, this);
        void this.render();
    }
    willHide() {
        __classPrivateFieldGet(this, _RequestTrustTokensView_request, "f").removeEventListener(SDK.NetworkRequest.Events.TRUST_TOKEN_RESULT_ADDED, this.render, this);
    }
    async render() {
        if (!__classPrivateFieldGet(this, _RequestTrustTokensView_request, "f")) {
            throw new Error('Trying to render a Trust Token report without providing data');
        }
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        Lit.render(html `
      <style>${requestTrustTokensViewStyles}</style>
      <devtools-report>
        ${__classPrivateFieldGet(this, _RequestTrustTokensView_instances, "m", _RequestTrustTokensView_renderParameterSection).call(this)}
        ${__classPrivateFieldGet(this, _RequestTrustTokensView_instances, "m", _RequestTrustTokensView_renderResultSection).call(this)}
      </devtools-report>
    `, __classPrivateFieldGet(this, _RequestTrustTokensView_shadow, "f"), { host: this });
        // clang-format on
    }
}
_RequestTrustTokensView_shadow = new WeakMap(), _RequestTrustTokensView_request = new WeakMap(), _RequestTrustTokensView_instances = new WeakSet(), _RequestTrustTokensView_renderParameterSection = function _RequestTrustTokensView_renderParameterSection() {
    const trustTokenParams = __classPrivateFieldGet(this, _RequestTrustTokensView_request, "f").trustTokenParams();
    if (!trustTokenParams) {
        return Lit.nothing;
    }
    return html `
      <devtools-report-section-header jslog=${VisualLogging.pane('trust-tokens').track({
        resize: true,
    })}>${i18nString(UIStrings.parameters)}</devtools-report-section-header>
      ${renderRowWithCodeValue(i18nString(UIStrings.type), trustTokenParams.operation.toString())}
      ${__classPrivateFieldGet(this, _RequestTrustTokensView_instances, "m", _RequestTrustTokensView_renderRefreshPolicy).call(this, trustTokenParams)}
      ${__classPrivateFieldGet(this, _RequestTrustTokensView_instances, "m", _RequestTrustTokensView_renderIssuers).call(this, trustTokenParams)}
      ${__classPrivateFieldGet(this, _RequestTrustTokensView_instances, "m", _RequestTrustTokensView_renderIssuerAndTopLevelOriginFromResult).call(this)}
      <devtools-report-divider></devtools-report-divider>
    `;
}, _RequestTrustTokensView_renderRefreshPolicy = function _RequestTrustTokensView_renderRefreshPolicy(params) {
    if (params.operation !== "Redemption" /* Protocol.Network.TrustTokenOperationType.Redemption */) {
        return Lit.nothing;
    }
    return renderRowWithCodeValue(i18nString(UIStrings.refreshPolicy), params.refreshPolicy.toString());
}, _RequestTrustTokensView_renderIssuers = function _RequestTrustTokensView_renderIssuers(params) {
    if (!params.issuers || params.issuers.length === 0) {
        return Lit.nothing;
    }
    return html `
      <devtools-report-key>${i18nString(UIStrings.issuers)}</devtools-report-key>
      <devtools-report-value>
        <ul class="issuers-list">
          ${params.issuers.map(issuer => html `<li>${issuer}</li>`)}
        </ul>
      </devtools-report-value>
    `;
}, _RequestTrustTokensView_renderIssuerAndTopLevelOriginFromResult = function _RequestTrustTokensView_renderIssuerAndTopLevelOriginFromResult() {
    const trustTokenResult = __classPrivateFieldGet(this, _RequestTrustTokensView_request, "f").trustTokenOperationDoneEvent();
    if (!trustTokenResult) {
        return Lit.nothing;
    }
    return html `
      ${renderSimpleRowIfValuePresent(i18nString(UIStrings.topLevelOrigin), trustTokenResult.topLevelOrigin)}
      ${renderSimpleRowIfValuePresent(i18nString(UIStrings.issuer), trustTokenResult.issuerOrigin)}`;
}, _RequestTrustTokensView_renderResultSection = function _RequestTrustTokensView_renderResultSection() {
    const trustTokenResult = __classPrivateFieldGet(this, _RequestTrustTokensView_request, "f").trustTokenOperationDoneEvent();
    if (!trustTokenResult) {
        return Lit.nothing;
    }
    return html `
      <devtools-report-section-header>${i18nString(UIStrings.result)}</devtools-report-section-header>
      <devtools-report-key>${i18nString(UIStrings.status)}</devtools-report-key>
      <devtools-report-value>
        <span>
          <devtools-icon class="status-icon"
            .data=${getIconForStatusCode(trustTokenResult.status)}>
          </devtools-icon>
          <strong>${getSimplifiedStatusTextForStatusCode(trustTokenResult.status)}</strong>
          ${getDetailedTextForStatusCode(trustTokenResult.status)}
        </span>
      </devtools-report-value>
      ${__classPrivateFieldGet(this, _RequestTrustTokensView_instances, "m", _RequestTrustTokensView_renderIssuedTokenCount).call(this, trustTokenResult)}
      <devtools-report-divider></devtools-report-divider>
      `;
}, _RequestTrustTokensView_renderIssuedTokenCount = function _RequestTrustTokensView_renderIssuedTokenCount(result) {
    if (result.type !== "Issuance" /* Protocol.Network.TrustTokenOperationType.Issuance */) {
        return Lit.nothing;
    }
    return renderSimpleRowIfValuePresent(i18nString(UIStrings.numberOfIssuedTokens), result.issuedTokenCount);
};
const SUCCESS_ICON_DATA = {
    color: 'var(--icon-checkmark-green)',
    iconName: 'check-circle',
    width: '16px',
    height: '16px',
};
const FAILURE_ICON_DATA = {
    color: 'var(--icon-error)',
    iconName: 'cross-circle-filled',
    width: '16px',
    height: '16px',
};
export function statusConsideredSuccess(status) {
    return status === "Ok" /* Protocol.Network.TrustTokenOperationDoneEventStatus.Ok */ ||
        status === "AlreadyExists" /* Protocol.Network.TrustTokenOperationDoneEventStatus.AlreadyExists */ ||
        status === "FulfilledLocally" /* Protocol.Network.TrustTokenOperationDoneEventStatus.FulfilledLocally */;
}
function getIconForStatusCode(status) {
    return statusConsideredSuccess(status) ? SUCCESS_ICON_DATA : FAILURE_ICON_DATA;
}
function getSimplifiedStatusTextForStatusCode(status) {
    return statusConsideredSuccess(status) ? i18nString(UIStrings.success) : i18nString(UIStrings.failure);
}
function getDetailedTextForStatusCode(status) {
    switch (status) {
        case "Ok" /* Protocol.Network.TrustTokenOperationDoneEventStatus.Ok */:
            return null;
        case "AlreadyExists" /* Protocol.Network.TrustTokenOperationDoneEventStatus.AlreadyExists */:
            return i18nString(UIStrings.theOperationsResultWasServedFrom);
        case "FulfilledLocally" /* Protocol.Network.TrustTokenOperationDoneEventStatus.FulfilledLocally */:
            return i18nString(UIStrings.theOperationWasFulfilledLocally);
        case "InvalidArgument" /* Protocol.Network.TrustTokenOperationDoneEventStatus.InvalidArgument */:
            return i18nString(UIStrings.aClientprovidedArgumentWas);
        case "ResourceExhausted" /* Protocol.Network.TrustTokenOperationDoneEventStatus.ResourceExhausted */:
            return i18nString(UIStrings.eitherNoInputsForThisOperation);
        case "BadResponse" /* Protocol.Network.TrustTokenOperationDoneEventStatus.BadResponse */:
            return i18nString(UIStrings.theServersResponseWasMalformedOr);
        case "MissingIssuerKeys" /* Protocol.Network.TrustTokenOperationDoneEventStatus.MissingIssuerKeys */:
            return i18nString(UIStrings.theKeysForThisPSTIssuerAreUnavailable);
        case "FailedPrecondition" /* Protocol.Network.TrustTokenOperationDoneEventStatus.FailedPrecondition */:
        case "ResourceLimited" /* Protocol.Network.TrustTokenOperationDoneEventStatus.ResourceLimited */:
        case "InternalError" /* Protocol.Network.TrustTokenOperationDoneEventStatus.InternalError */:
        case "Unauthorized" /* Protocol.Network.TrustTokenOperationDoneEventStatus.Unauthorized */:
        case "UnknownError" /* Protocol.Network.TrustTokenOperationDoneEventStatus.UnknownError */:
            return i18nString(UIStrings.theOperationFailedForAnUnknown);
        case "SiteIssuerLimit" /* Protocol.Network.TrustTokenOperationDoneEventStatus.SiteIssuerLimit */:
            return i18nString(UIStrings.perSiteLimit);
    }
}
function renderSimpleRowIfValuePresent(key, value) {
    if (value === undefined) {
        return Lit.nothing;
    }
    return html `
    <devtools-report-key>${key}</devtools-report-key>
    <devtools-report-value>${value}</devtools-report-value>
  `;
}
function renderRowWithCodeValue(key, value) {
    return html `
    <devtools-report-key>${key}</devtools-report-key>
    <devtools-report-value class="code">${value}</devtools-report-value>
  `;
}
customElements.define('devtools-trust-token-report', RequestTrustTokensView);
//# sourceMappingURL=RequestTrustTokensView.js.map