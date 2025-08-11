// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _FederatedAuthRequestIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
import { resolveLazyDescription, } from './MarkdownIssueDescription.js';
const UIStrings = {
    /**
     *@description Title for Client Hint specification url link
     */
    fedCm: 'Federated Credential Management API',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/FederatedAuthRequestIssue.ts', UIStrings);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
export class FederatedAuthRequestIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        super({
            code: "FederatedAuthRequestIssue" /* Protocol.Audits.InspectorIssueCode.FederatedAuthRequestIssue */,
            umaCode: [
                "FederatedAuthRequestIssue" /* Protocol.Audits.InspectorIssueCode.FederatedAuthRequestIssue */,
                issueDetails.federatedAuthRequestIssueReason,
            ].join('::'),
        }, issuesModel);
        _FederatedAuthRequestIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _FederatedAuthRequestIssue_issueDetails, issueDetails, "f");
    }
    getCategory() {
        return "Other" /* IssueCategory.OTHER */;
    }
    details() {
        return __classPrivateFieldGet(this, _FederatedAuthRequestIssue_issueDetails, "f");
    }
    getDescription() {
        const description = issueDescriptions.get(__classPrivateFieldGet(this, _FederatedAuthRequestIssue_issueDetails, "f").federatedAuthRequestIssueReason);
        if (!description) {
            return null;
        }
        return resolveLazyDescription(description);
    }
    primaryKey() {
        return JSON.stringify(__classPrivateFieldGet(this, _FederatedAuthRequestIssue_issueDetails, "f"));
    }
    getKind() {
        return "PageError" /* IssueKind.PAGE_ERROR */;
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const details = inspectorIssue.details.federatedAuthRequestIssueDetails;
        if (!details) {
            console.warn('Federated auth request issue without details received.');
            return [];
        }
        return [new FederatedAuthRequestIssue(details, issuesModel)];
    }
}
_FederatedAuthRequestIssue_issueDetails = new WeakMap();
const issueDescriptions = new Map([
    [
        "TooManyRequests" /* Protocol.Audits.FederatedAuthRequestIssueReason.TooManyRequests */,
        {
            file: 'federatedAuthRequestTooManyRequests.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "ConfigHttpNotFound" /* Protocol.Audits.FederatedAuthRequestIssueReason.ConfigHttpNotFound */,
        {
            file: 'federatedAuthRequestManifestHttpNotFound.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "ConfigNoResponse" /* Protocol.Audits.FederatedAuthRequestIssueReason.ConfigNoResponse */,
        {
            file: 'federatedAuthRequestManifestNoResponse.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "ConfigInvalidResponse" /* Protocol.Audits.FederatedAuthRequestIssueReason.ConfigInvalidResponse */,
        {
            file: 'federatedAuthRequestManifestInvalidResponse.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "ClientMetadataHttpNotFound" /* Protocol.Audits.FederatedAuthRequestIssueReason.ClientMetadataHttpNotFound */,
        {
            file: 'federatedAuthRequestClientMetadataHttpNotFound.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "ClientMetadataNoResponse" /* Protocol.Audits.FederatedAuthRequestIssueReason.ClientMetadataNoResponse */,
        {
            file: 'federatedAuthRequestClientMetadataNoResponse.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "ClientMetadataInvalidResponse" /* Protocol.Audits.FederatedAuthRequestIssueReason.ClientMetadataInvalidResponse */,
        {
            file: 'federatedAuthRequestClientMetadataInvalidResponse.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "ErrorFetchingSignin" /* Protocol.Audits.FederatedAuthRequestIssueReason.ErrorFetchingSignin */,
        {
            file: 'federatedAuthRequestErrorFetchingSignin.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "InvalidSigninResponse" /* Protocol.Audits.FederatedAuthRequestIssueReason.InvalidSigninResponse */,
        {
            file: 'federatedAuthRequestInvalidSigninResponse.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "AccountsHttpNotFound" /* Protocol.Audits.FederatedAuthRequestIssueReason.AccountsHttpNotFound */,
        {
            file: 'federatedAuthRequestAccountsHttpNotFound.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "AccountsNoResponse" /* Protocol.Audits.FederatedAuthRequestIssueReason.AccountsNoResponse */,
        {
            file: 'federatedAuthRequestAccountsNoResponse.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "AccountsInvalidResponse" /* Protocol.Audits.FederatedAuthRequestIssueReason.AccountsInvalidResponse */,
        {
            file: 'federatedAuthRequestAccountsInvalidResponse.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "IdTokenHttpNotFound" /* Protocol.Audits.FederatedAuthRequestIssueReason.IdTokenHttpNotFound */,
        {
            file: 'federatedAuthRequestIdTokenHttpNotFound.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "IdTokenNoResponse" /* Protocol.Audits.FederatedAuthRequestIssueReason.IdTokenNoResponse */,
        {
            file: 'federatedAuthRequestIdTokenNoResponse.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "IdTokenInvalidResponse" /* Protocol.Audits.FederatedAuthRequestIssueReason.IdTokenInvalidResponse */,
        {
            file: 'federatedAuthRequestIdTokenInvalidResponse.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "IdTokenInvalidRequest" /* Protocol.Audits.FederatedAuthRequestIssueReason.IdTokenInvalidRequest */,
        {
            file: 'federatedAuthRequestIdTokenInvalidRequest.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "ErrorIdToken" /* Protocol.Audits.FederatedAuthRequestIssueReason.ErrorIdToken */,
        {
            file: 'federatedAuthRequestErrorIdToken.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
    [
        "Canceled" /* Protocol.Audits.FederatedAuthRequestIssueReason.Canceled */,
        {
            file: 'federatedAuthRequestCanceled.md',
            links: [{
                    link: 'https://fedidcg.github.io/FedCM/',
                    linkTitle: i18nLazyString(UIStrings.fedCm),
                }],
        },
    ],
]);
//# sourceMappingURL=FederatedAuthRequestIssue.js.map