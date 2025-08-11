// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _CorsIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
const UIStrings = {
    /**
     *@description Label for the link for CORS Local Network Access issues
     */
    corsLocalNetworkAccess: 'Local Network Access',
    /**
     *@description Label for the link for CORS private network issues
     */
    corsPrivateNetworkAccess: 'Private Network Access',
    /**
     *@description Label for the link for CORS network issues
     */
    CORS: 'Cross-Origin Resource Sharing (`CORS`)',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/CorsIssue.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var IssueCode;
(function (IssueCode) {
    IssueCode["INSECURE_PRIVATE_NETWORK"] = "CorsIssue::InsecurePrivateNetwork";
    IssueCode["INVALID_HEADER_VALUES"] = "CorsIssue::InvalidHeaders";
    IssueCode["WILDCARD_ORIGN_NOT_ALLOWED"] = "CorsIssue::WildcardOriginWithCredentials";
    IssueCode["PREFLIGHT_RESPONSE_INVALID"] = "CorsIssue::PreflightResponseInvalid";
    IssueCode["ORIGIN_MISMATCH"] = "CorsIssue::OriginMismatch";
    IssueCode["ALLOW_CREDENTIALS_REQUIRED"] = "CorsIssue::AllowCredentialsRequired";
    IssueCode["METHOD_DISALLOWED_BY_PREFLIGHT_RESPONSE"] = "CorsIssue::MethodDisallowedByPreflightResponse";
    IssueCode["HEADER_DISALLOWED_BY_PREFLIGHT_RESPONSE"] = "CorsIssue::HeaderDisallowedByPreflightResponse";
    IssueCode["REDIRECT_CONTAINS_CREDENTIALS"] = "CorsIssue::RedirectContainsCredentials";
    IssueCode["DISALLOWED_BY_MODE"] = "CorsIssue::DisallowedByMode";
    IssueCode["CORS_DISABLED_SCHEME"] = "CorsIssue::CorsDisabledScheme";
    // TODO(https://crbug.com/1263483): Remove this once it's removed from CDP.
    IssueCode["PREFLIGHT_MISSING_ALLOW_EXTERNAL"] = "CorsIssue::PreflightMissingAllowExternal";
    // TODO(https://crbug.com/1263483): Remove this once it's removed from CDP.
    IssueCode["PREFLIGHT_INVALID_ALLOW_EXTERNAL"] = "CorsIssue::PreflightInvalidAllowExternal";
    IssueCode["NO_CORS_REDIRECT_MODE_NOT_FOLLOW"] = "CorsIssue::NoCorsRedirectModeNotFollow";
    IssueCode["INVALID_PRIVATE_NETWORK_ACCESS"] = "CorsIssue::InvalidPrivateNetworkAccess";
    IssueCode["UNEXPECTED_PRIVATE_NETWORK_ACCESS"] = "CorsIssue::UnexpectedPrivateNetworkAccess";
    IssueCode["PREFLIGHT_ALLOW_PRIVATE_NETWORK_ERROR"] = "CorsIssue::PreflightAllowPrivateNetworkError";
    IssueCode["PREFLIGHT_MISSING_PRIVATE_NETWORK_ACCESS_ID"] = "CorsIssue::PreflightMissingPrivateNetworkAccessId";
    IssueCode["PREFLIGHT_MISSING_PRIVATE_NETWORK_ACCESS_NAME"] = "CorsIssue::PreflightMissingPrivateNetworkAccessName";
    IssueCode["PRIVATE_NETWORK_ACCESS_PERMISSION_UNAVAILABLE"] = "CorsIssue::PrivateNetworkAccessPermissionUnavailable";
    IssueCode["PRIVATE_NETWORK_ACCESS_PERMISSION_DENIED"] = "CorsIssue::PrivateNetworkAccessPermissionDenied";
    IssueCode["LOCAL_NETWORK_ACCESS_PERMISSION_DENIED"] = "CorsIssue::LocalNetworkAccessPermissionDenied";
})(IssueCode || (IssueCode = {}));
function getIssueCode(details) {
    switch (details.corsErrorStatus.corsError) {
        case "InvalidAllowMethodsPreflightResponse" /* Protocol.Network.CorsError.InvalidAllowMethodsPreflightResponse */:
        case "InvalidAllowHeadersPreflightResponse" /* Protocol.Network.CorsError.InvalidAllowHeadersPreflightResponse */:
        case "PreflightMissingAllowOriginHeader" /* Protocol.Network.CorsError.PreflightMissingAllowOriginHeader */:
        case "PreflightMultipleAllowOriginValues" /* Protocol.Network.CorsError.PreflightMultipleAllowOriginValues */:
        case "PreflightInvalidAllowOriginValue" /* Protocol.Network.CorsError.PreflightInvalidAllowOriginValue */:
        case "MissingAllowOriginHeader" /* Protocol.Network.CorsError.MissingAllowOriginHeader */:
        case "MultipleAllowOriginValues" /* Protocol.Network.CorsError.MultipleAllowOriginValues */:
        case "InvalidAllowOriginValue" /* Protocol.Network.CorsError.InvalidAllowOriginValue */:
            return "CorsIssue::InvalidHeaders" /* IssueCode.INVALID_HEADER_VALUES */;
        case "PreflightWildcardOriginNotAllowed" /* Protocol.Network.CorsError.PreflightWildcardOriginNotAllowed */:
        case "WildcardOriginNotAllowed" /* Protocol.Network.CorsError.WildcardOriginNotAllowed */:
            return "CorsIssue::WildcardOriginWithCredentials" /* IssueCode.WILDCARD_ORIGN_NOT_ALLOWED */;
        case "PreflightInvalidStatus" /* Protocol.Network.CorsError.PreflightInvalidStatus */:
        case "PreflightDisallowedRedirect" /* Protocol.Network.CorsError.PreflightDisallowedRedirect */:
        case "InvalidResponse" /* Protocol.Network.CorsError.InvalidResponse */:
            return "CorsIssue::PreflightResponseInvalid" /* IssueCode.PREFLIGHT_RESPONSE_INVALID */;
        case "AllowOriginMismatch" /* Protocol.Network.CorsError.AllowOriginMismatch */:
        case "PreflightAllowOriginMismatch" /* Protocol.Network.CorsError.PreflightAllowOriginMismatch */:
            return "CorsIssue::OriginMismatch" /* IssueCode.ORIGIN_MISMATCH */;
        case "InvalidAllowCredentials" /* Protocol.Network.CorsError.InvalidAllowCredentials */:
        case "PreflightInvalidAllowCredentials" /* Protocol.Network.CorsError.PreflightInvalidAllowCredentials */:
            return "CorsIssue::AllowCredentialsRequired" /* IssueCode.ALLOW_CREDENTIALS_REQUIRED */;
        case "MethodDisallowedByPreflightResponse" /* Protocol.Network.CorsError.MethodDisallowedByPreflightResponse */:
            return "CorsIssue::MethodDisallowedByPreflightResponse" /* IssueCode.METHOD_DISALLOWED_BY_PREFLIGHT_RESPONSE */;
        case "HeaderDisallowedByPreflightResponse" /* Protocol.Network.CorsError.HeaderDisallowedByPreflightResponse */:
            return "CorsIssue::HeaderDisallowedByPreflightResponse" /* IssueCode.HEADER_DISALLOWED_BY_PREFLIGHT_RESPONSE */;
        case "RedirectContainsCredentials" /* Protocol.Network.CorsError.RedirectContainsCredentials */:
            return "CorsIssue::RedirectContainsCredentials" /* IssueCode.REDIRECT_CONTAINS_CREDENTIALS */;
        case "DisallowedByMode" /* Protocol.Network.CorsError.DisallowedByMode */:
            return "CorsIssue::DisallowedByMode" /* IssueCode.DISALLOWED_BY_MODE */;
        case "CorsDisabledScheme" /* Protocol.Network.CorsError.CorsDisabledScheme */:
            return "CorsIssue::CorsDisabledScheme" /* IssueCode.CORS_DISABLED_SCHEME */;
        case "PreflightMissingAllowExternal" /* Protocol.Network.CorsError.PreflightMissingAllowExternal */:
            return "CorsIssue::PreflightMissingAllowExternal" /* IssueCode.PREFLIGHT_MISSING_ALLOW_EXTERNAL */;
        case "PreflightInvalidAllowExternal" /* Protocol.Network.CorsError.PreflightInvalidAllowExternal */:
            return "CorsIssue::PreflightInvalidAllowExternal" /* IssueCode.PREFLIGHT_INVALID_ALLOW_EXTERNAL */;
        case "InsecurePrivateNetwork" /* Protocol.Network.CorsError.InsecurePrivateNetwork */:
            return "CorsIssue::InsecurePrivateNetwork" /* IssueCode.INSECURE_PRIVATE_NETWORK */;
        case "NoCorsRedirectModeNotFollow" /* Protocol.Network.CorsError.NoCorsRedirectModeNotFollow */:
            return "CorsIssue::NoCorsRedirectModeNotFollow" /* IssueCode.NO_CORS_REDIRECT_MODE_NOT_FOLLOW */;
        case "InvalidPrivateNetworkAccess" /* Protocol.Network.CorsError.InvalidPrivateNetworkAccess */:
            return "CorsIssue::InvalidPrivateNetworkAccess" /* IssueCode.INVALID_PRIVATE_NETWORK_ACCESS */;
        case "UnexpectedPrivateNetworkAccess" /* Protocol.Network.CorsError.UnexpectedPrivateNetworkAccess */:
            return "CorsIssue::UnexpectedPrivateNetworkAccess" /* IssueCode.UNEXPECTED_PRIVATE_NETWORK_ACCESS */;
        case "PreflightMissingAllowPrivateNetwork" /* Protocol.Network.CorsError.PreflightMissingAllowPrivateNetwork */:
        case "PreflightInvalidAllowPrivateNetwork" /* Protocol.Network.CorsError.PreflightInvalidAllowPrivateNetwork */:
            return "CorsIssue::PreflightAllowPrivateNetworkError" /* IssueCode.PREFLIGHT_ALLOW_PRIVATE_NETWORK_ERROR */;
        case "PreflightMissingPrivateNetworkAccessId" /* Protocol.Network.CorsError.PreflightMissingPrivateNetworkAccessId */:
            return "CorsIssue::PreflightMissingPrivateNetworkAccessId" /* IssueCode.PREFLIGHT_MISSING_PRIVATE_NETWORK_ACCESS_ID */;
        case "PreflightMissingPrivateNetworkAccessName" /* Protocol.Network.CorsError.PreflightMissingPrivateNetworkAccessName */:
            return "CorsIssue::PreflightMissingPrivateNetworkAccessName" /* IssueCode.PREFLIGHT_MISSING_PRIVATE_NETWORK_ACCESS_NAME */;
        case "PrivateNetworkAccessPermissionUnavailable" /* Protocol.Network.CorsError.PrivateNetworkAccessPermissionUnavailable */:
            return "CorsIssue::PrivateNetworkAccessPermissionUnavailable" /* IssueCode.PRIVATE_NETWORK_ACCESS_PERMISSION_UNAVAILABLE */;
        case "PrivateNetworkAccessPermissionDenied" /* Protocol.Network.CorsError.PrivateNetworkAccessPermissionDenied */:
            return "CorsIssue::PrivateNetworkAccessPermissionDenied" /* IssueCode.PRIVATE_NETWORK_ACCESS_PERMISSION_DENIED */;
        case "LocalNetworkAccessPermissionDenied" /* Protocol.Network.CorsError.LocalNetworkAccessPermissionDenied */:
            return "CorsIssue::LocalNetworkAccessPermissionDenied" /* IssueCode.LOCAL_NETWORK_ACCESS_PERMISSION_DENIED */;
    }
}
export class CorsIssue extends Issue {
    constructor(issueDetails, issuesModel, issueId) {
        super(getIssueCode(issueDetails), issuesModel, issueId);
        _CorsIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _CorsIssue_issueDetails, issueDetails, "f");
    }
    getCategory() {
        return "Cors" /* IssueCategory.CORS */;
    }
    details() {
        return __classPrivateFieldGet(this, _CorsIssue_issueDetails, "f");
    }
    getDescription() {
        switch (getIssueCode(__classPrivateFieldGet(this, _CorsIssue_issueDetails, "f"))) {
            case "CorsIssue::InsecurePrivateNetwork" /* IssueCode.INSECURE_PRIVATE_NETWORK */:
                return {
                    file: 'corsInsecurePrivateNetwork.md',
                    links: [{
                            link: 'https://developer.chrome.com/blog/private-network-access-update',
                            linkTitle: i18nString(UIStrings.corsPrivateNetworkAccess),
                        }],
                };
            case "CorsIssue::PreflightAllowPrivateNetworkError" /* IssueCode.PREFLIGHT_ALLOW_PRIVATE_NETWORK_ERROR */:
                return {
                    file: 'corsPreflightAllowPrivateNetworkError.md',
                    links: [{
                            link: 'https://developer.chrome.com/blog/private-network-access-update',
                            linkTitle: i18nString(UIStrings.corsPrivateNetworkAccess),
                        }],
                };
            case "CorsIssue::InvalidHeaders" /* IssueCode.INVALID_HEADER_VALUES */:
                return {
                    file: 'corsInvalidHeaderValues.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            case "CorsIssue::WildcardOriginWithCredentials" /* IssueCode.WILDCARD_ORIGN_NOT_ALLOWED */:
                return {
                    file: 'corsWildcardOriginNotAllowed.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            case "CorsIssue::PreflightResponseInvalid" /* IssueCode.PREFLIGHT_RESPONSE_INVALID */:
                return {
                    file: 'corsPreflightResponseInvalid.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            case "CorsIssue::OriginMismatch" /* IssueCode.ORIGIN_MISMATCH */:
                return {
                    file: 'corsOriginMismatch.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            case "CorsIssue::AllowCredentialsRequired" /* IssueCode.ALLOW_CREDENTIALS_REQUIRED */:
                return {
                    file: 'corsAllowCredentialsRequired.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            case "CorsIssue::MethodDisallowedByPreflightResponse" /* IssueCode.METHOD_DISALLOWED_BY_PREFLIGHT_RESPONSE */:
                return {
                    file: 'corsMethodDisallowedByPreflightResponse.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            case "CorsIssue::HeaderDisallowedByPreflightResponse" /* IssueCode.HEADER_DISALLOWED_BY_PREFLIGHT_RESPONSE */:
                return {
                    file: 'corsHeaderDisallowedByPreflightResponse.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            case "CorsIssue::RedirectContainsCredentials" /* IssueCode.REDIRECT_CONTAINS_CREDENTIALS */:
                return {
                    file: 'corsRedirectContainsCredentials.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            case "CorsIssue::DisallowedByMode" /* IssueCode.DISALLOWED_BY_MODE */:
                return {
                    file: 'corsDisallowedByMode.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            case "CorsIssue::CorsDisabledScheme" /* IssueCode.CORS_DISABLED_SCHEME */:
                return {
                    file: 'corsDisabledScheme.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            case "CorsIssue::NoCorsRedirectModeNotFollow" /* IssueCode.NO_CORS_REDIRECT_MODE_NOT_FOLLOW */:
                return {
                    file: 'corsNoCorsRedirectModeNotFollow.md',
                    links: [{
                            link: 'https://web.dev/cross-origin-resource-sharing',
                            linkTitle: i18nString(UIStrings.CORS),
                        }],
                };
            // TODO(1462857): Change the link after we have a blog post for PNA
            // permission prompt.
            case "CorsIssue::PreflightMissingPrivateNetworkAccessId" /* IssueCode.PREFLIGHT_MISSING_PRIVATE_NETWORK_ACCESS_ID */:
            case "CorsIssue::PreflightMissingPrivateNetworkAccessName" /* IssueCode.PREFLIGHT_MISSING_PRIVATE_NETWORK_ACCESS_NAME */:
                return {
                    file: 'corsPrivateNetworkPermissionDenied.md',
                    links: [{
                            link: 'https://developer.chrome.com/blog/private-network-access-update',
                            linkTitle: i18nString(UIStrings.corsPrivateNetworkAccess),
                        }],
                };
            case "CorsIssue::LocalNetworkAccessPermissionDenied" /* IssueCode.LOCAL_NETWORK_ACCESS_PERMISSION_DENIED */:
                return {
                    file: 'corsLocalNetworkAccessPermissionDenied.md',
                    links: [{
                            link: 'https://chromestatus.com/feature/5152728072060928',
                            linkTitle: i18nString(UIStrings.corsLocalNetworkAccess),
                        }],
                };
            case "CorsIssue::PreflightMissingAllowExternal" /* IssueCode.PREFLIGHT_MISSING_ALLOW_EXTERNAL */:
            case "CorsIssue::PreflightInvalidAllowExternal" /* IssueCode.PREFLIGHT_INVALID_ALLOW_EXTERNAL */:
            case "CorsIssue::InvalidPrivateNetworkAccess" /* IssueCode.INVALID_PRIVATE_NETWORK_ACCESS */:
            case "CorsIssue::UnexpectedPrivateNetworkAccess" /* IssueCode.UNEXPECTED_PRIVATE_NETWORK_ACCESS */:
            case "CorsIssue::PrivateNetworkAccessPermissionUnavailable" /* IssueCode.PRIVATE_NETWORK_ACCESS_PERMISSION_UNAVAILABLE */:
            case "CorsIssue::PrivateNetworkAccessPermissionDenied" /* IssueCode.PRIVATE_NETWORK_ACCESS_PERMISSION_DENIED */:
                return null;
        }
    }
    primaryKey() {
        return JSON.stringify(__classPrivateFieldGet(this, _CorsIssue_issueDetails, "f"));
    }
    getKind() {
        if (__classPrivateFieldGet(this, _CorsIssue_issueDetails, "f").isWarning &&
            (__classPrivateFieldGet(this, _CorsIssue_issueDetails, "f").corsErrorStatus.corsError === "InsecurePrivateNetwork" /* Protocol.Network.CorsError.InsecurePrivateNetwork */ ||
                __classPrivateFieldGet(this, _CorsIssue_issueDetails, "f").corsErrorStatus.corsError ===
                    "PreflightMissingAllowPrivateNetwork" /* Protocol.Network.CorsError.PreflightMissingAllowPrivateNetwork */ ||
                __classPrivateFieldGet(this, _CorsIssue_issueDetails, "f").corsErrorStatus.corsError ===
                    "PreflightInvalidAllowPrivateNetwork" /* Protocol.Network.CorsError.PreflightInvalidAllowPrivateNetwork */)) {
            return "BreakingChange" /* IssueKind.BREAKING_CHANGE */;
        }
        return "PageError" /* IssueKind.PAGE_ERROR */;
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const corsIssueDetails = inspectorIssue.details.corsIssueDetails;
        if (!corsIssueDetails) {
            console.warn('Cors issue without details received.');
            return [];
        }
        return [new CorsIssue(corsIssueDetails, issuesModel, inspectorIssue.issueId)];
    }
}
_CorsIssue_issueDetails = new WeakMap();
//# sourceMappingURL=CorsIssue.js.map