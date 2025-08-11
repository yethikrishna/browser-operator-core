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
var _SharedDictionaryIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
import { resolveLazyDescription, } from './MarkdownIssueDescription.js';
const UIStrings = {
    /**
     *@description Title for Compression Dictionary Transport specification url link
     */
    compressionDictionaryTransport: 'Compression Dictionary Transport',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/SharedDictionaryIssue.ts', UIStrings);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
export var IssueCode;
(function (IssueCode) {
    IssueCode["USE_ERROR_CROSS_ORIGIN_NO_CORS_REQUEST"] = "SharedDictionaryIssue::UseErrorCrossOriginNoCorsRequest";
    IssueCode["USE_ERROR_DICTIONARY_LOAD_FAILURE"] = "SharedDictionaryIssue::UseErrorDictionaryLoadFailure";
    IssueCode["USE_ERROR_MATCHING_DICTIONARY_NOT_USED"] = "SharedDictionaryIssue::UseErrorMatchingDictionaryNotUsed";
    IssueCode["USE_ERROR_UNEXPECTED_CONTENT_DICTIONARY_HEADER"] = "SharedDictionaryIssue::UseErrorUnexpectedContentDictionaryHeader";
    IssueCode["WRITE_ERROR_CROSS_ORIGIN_NO_CORS_REQUEST"] = "SharedDictionaryIssue::WriteErrorCossOriginNoCorsRequest";
    IssueCode["WRITE_ERROR_DISALLOWED_BY_SETTINGS"] = "SharedDictionaryIssue::WriteErrorDisallowedBySettings";
    IssueCode["WRITE_ERROR_EXPIRED_RESPONSE"] = "SharedDictionaryIssue::WriteErrorExpiredResponse";
    IssueCode["WRITE_ERROR_FEATURE_DISABLED"] = "SharedDictionaryIssue::WriteErrorFeatureDisabled";
    IssueCode["WRITE_ERROR_INSUFFICIENT_RESOURCES"] = "SharedDictionaryIssue::WriteErrorInsufficientResources";
    IssueCode["WRITE_ERROR_INVALID_MATCH_FIELD"] = "SharedDictionaryIssue::WriteErrorInvalidMatchField";
    IssueCode["WRITE_ERROR_INVALID_STRUCTURED_HEADER"] = "SharedDictionaryIssue::WriteErrorInvalidStructuredHeader";
    IssueCode["WRITE_ERROR_NAVIGATION_REQUEST"] = "SharedDictionaryIssue::WriteErrorNavigationRequest";
    IssueCode["WRITE_ERROR_NO_MATCH_FIELD"] = "SharedDictionaryIssue::WriteErrorNoMatchField";
    IssueCode["WRITE_ERROR_NON_LIST_MATCH_DEST_FIELD"] = "SharedDictionaryIssue::WriteErrorNonListMatchDestField";
    IssueCode["WRITE_ERROR_NON_SECURE_CONTEXT"] = "SharedDictionaryIssue::WriteErrorNonSecureContext";
    IssueCode["WRITE_ERROR_NON_STRING_ID_FIELD"] = "SharedDictionaryIssue::WriteErrorNonStringIdField";
    IssueCode["WRITE_ERROR_NON_STRING_IN_MATCH_DEST_LIST"] = "SharedDictionaryIssue::WriteErrorNonStringInMatchDestList";
    IssueCode["WRITE_ERROR_NON_STRING_MATCH_FIELD"] = "SharedDictionaryIssue::WriteErrorNonStringMatchField";
    IssueCode["WRITE_ERROR_NON_TOKEN_TYPE_FIELD"] = "SharedDictionaryIssue::WriteErrorNonTokenTypeField";
    IssueCode["WRITE_ERROR_REQUEST_ABORTED"] = "SharedDictionaryIssue::WriteErrorRequestAborted";
    IssueCode["WRITE_ERROR_SHUTTING_DOWN"] = "SharedDictionaryIssue::WriteErrorShuttingDown";
    IssueCode["WRITE_ERROR_TOO_LONG_ID_FIELD"] = "SharedDictionaryIssue::WriteErrorTooLongIdField";
    IssueCode["WRITE_ERROR_UNSUPPORTED_TYPE"] = "SharedDictionaryIssue::WriteErrorUnsupportedType";
    IssueCode["UNKNOWN"] = "SharedDictionaryIssue::WriteErrorUnknown";
})(IssueCode || (IssueCode = {}));
function getIssueCode(details) {
    switch (details.sharedDictionaryError) {
        case "UseErrorCrossOriginNoCorsRequest" /* Protocol.Audits.SharedDictionaryError.UseErrorCrossOriginNoCorsRequest */:
            return "SharedDictionaryIssue::UseErrorCrossOriginNoCorsRequest" /* IssueCode.USE_ERROR_CROSS_ORIGIN_NO_CORS_REQUEST */;
        case "UseErrorDictionaryLoadFailure" /* Protocol.Audits.SharedDictionaryError.UseErrorDictionaryLoadFailure */:
            return "SharedDictionaryIssue::UseErrorDictionaryLoadFailure" /* IssueCode.USE_ERROR_DICTIONARY_LOAD_FAILURE */;
        case "UseErrorMatchingDictionaryNotUsed" /* Protocol.Audits.SharedDictionaryError.UseErrorMatchingDictionaryNotUsed */:
            return "SharedDictionaryIssue::UseErrorMatchingDictionaryNotUsed" /* IssueCode.USE_ERROR_MATCHING_DICTIONARY_NOT_USED */;
        case "UseErrorUnexpectedContentDictionaryHeader" /* Protocol.Audits.SharedDictionaryError.UseErrorUnexpectedContentDictionaryHeader */:
            return "SharedDictionaryIssue::UseErrorUnexpectedContentDictionaryHeader" /* IssueCode.USE_ERROR_UNEXPECTED_CONTENT_DICTIONARY_HEADER */;
        case "WriteErrorCossOriginNoCorsRequest" /* Protocol.Audits.SharedDictionaryError.WriteErrorCossOriginNoCorsRequest */:
            return "SharedDictionaryIssue::WriteErrorCossOriginNoCorsRequest" /* IssueCode.WRITE_ERROR_CROSS_ORIGIN_NO_CORS_REQUEST */;
        case "WriteErrorDisallowedBySettings" /* Protocol.Audits.SharedDictionaryError.WriteErrorDisallowedBySettings */:
            return "SharedDictionaryIssue::WriteErrorDisallowedBySettings" /* IssueCode.WRITE_ERROR_DISALLOWED_BY_SETTINGS */;
        case "WriteErrorExpiredResponse" /* Protocol.Audits.SharedDictionaryError.WriteErrorExpiredResponse */:
            return "SharedDictionaryIssue::WriteErrorExpiredResponse" /* IssueCode.WRITE_ERROR_EXPIRED_RESPONSE */;
        case "WriteErrorFeatureDisabled" /* Protocol.Audits.SharedDictionaryError.WriteErrorFeatureDisabled */:
            return "SharedDictionaryIssue::WriteErrorFeatureDisabled" /* IssueCode.WRITE_ERROR_FEATURE_DISABLED */;
        case "WriteErrorInsufficientResources" /* Protocol.Audits.SharedDictionaryError.WriteErrorInsufficientResources */:
            return "SharedDictionaryIssue::WriteErrorInsufficientResources" /* IssueCode.WRITE_ERROR_INSUFFICIENT_RESOURCES */;
        case "WriteErrorInvalidMatchField" /* Protocol.Audits.SharedDictionaryError.WriteErrorInvalidMatchField */:
            return "SharedDictionaryIssue::WriteErrorInvalidMatchField" /* IssueCode.WRITE_ERROR_INVALID_MATCH_FIELD */;
        case "WriteErrorInvalidStructuredHeader" /* Protocol.Audits.SharedDictionaryError.WriteErrorInvalidStructuredHeader */:
            return "SharedDictionaryIssue::WriteErrorInvalidStructuredHeader" /* IssueCode.WRITE_ERROR_INVALID_STRUCTURED_HEADER */;
        case "WriteErrorNavigationRequest" /* Protocol.Audits.SharedDictionaryError.WriteErrorNavigationRequest */:
            return "SharedDictionaryIssue::WriteErrorNavigationRequest" /* IssueCode.WRITE_ERROR_NAVIGATION_REQUEST */;
        case "WriteErrorNoMatchField" /* Protocol.Audits.SharedDictionaryError.WriteErrorNoMatchField */:
            return "SharedDictionaryIssue::WriteErrorNoMatchField" /* IssueCode.WRITE_ERROR_NO_MATCH_FIELD */;
        case "WriteErrorNonListMatchDestField" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonListMatchDestField */:
            return "SharedDictionaryIssue::WriteErrorNonListMatchDestField" /* IssueCode.WRITE_ERROR_NON_LIST_MATCH_DEST_FIELD */;
        case "WriteErrorNonSecureContext" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonSecureContext */:
            return "SharedDictionaryIssue::WriteErrorNonSecureContext" /* IssueCode.WRITE_ERROR_NON_SECURE_CONTEXT */;
        case "WriteErrorNonStringIdField" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonStringIdField */:
            return "SharedDictionaryIssue::WriteErrorNonStringIdField" /* IssueCode.WRITE_ERROR_NON_STRING_ID_FIELD */;
        case "WriteErrorNonStringInMatchDestList" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonStringInMatchDestList */:
            return "SharedDictionaryIssue::WriteErrorNonStringInMatchDestList" /* IssueCode.WRITE_ERROR_NON_STRING_IN_MATCH_DEST_LIST */;
        case "WriteErrorNonStringMatchField" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonStringMatchField */:
            return "SharedDictionaryIssue::WriteErrorNonStringMatchField" /* IssueCode.WRITE_ERROR_NON_STRING_MATCH_FIELD */;
        case "WriteErrorNonTokenTypeField" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonTokenTypeField */:
            return "SharedDictionaryIssue::WriteErrorNonTokenTypeField" /* IssueCode.WRITE_ERROR_NON_TOKEN_TYPE_FIELD */;
        case "WriteErrorRequestAborted" /* Protocol.Audits.SharedDictionaryError.WriteErrorRequestAborted */:
            return "SharedDictionaryIssue::WriteErrorRequestAborted" /* IssueCode.WRITE_ERROR_REQUEST_ABORTED */;
        case "WriteErrorShuttingDown" /* Protocol.Audits.SharedDictionaryError.WriteErrorShuttingDown */:
            return "SharedDictionaryIssue::WriteErrorShuttingDown" /* IssueCode.WRITE_ERROR_SHUTTING_DOWN */;
        case "WriteErrorTooLongIdField" /* Protocol.Audits.SharedDictionaryError.WriteErrorTooLongIdField */:
            return "SharedDictionaryIssue::WriteErrorTooLongIdField" /* IssueCode.WRITE_ERROR_TOO_LONG_ID_FIELD */;
        case "WriteErrorUnsupportedType" /* Protocol.Audits.SharedDictionaryError.WriteErrorUnsupportedType */:
            return "SharedDictionaryIssue::WriteErrorUnsupportedType" /* IssueCode.WRITE_ERROR_UNSUPPORTED_TYPE */;
        default:
            return "SharedDictionaryIssue::WriteErrorUnknown" /* IssueCode.UNKNOWN */;
    }
}
export class SharedDictionaryIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        super({
            code: getIssueCode(issueDetails),
            umaCode: [
                "SharedDictionaryIssue" /* Protocol.Audits.InspectorIssueCode.SharedDictionaryIssue */,
                issueDetails.sharedDictionaryError,
            ].join('::'),
        }, issuesModel);
        _SharedDictionaryIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _SharedDictionaryIssue_issueDetails, issueDetails, "f");
    }
    requests() {
        if (__classPrivateFieldGet(this, _SharedDictionaryIssue_issueDetails, "f").request) {
            return [__classPrivateFieldGet(this, _SharedDictionaryIssue_issueDetails, "f").request];
        }
        return [];
    }
    getCategory() {
        return "Other" /* IssueCategory.OTHER */;
    }
    details() {
        return __classPrivateFieldGet(this, _SharedDictionaryIssue_issueDetails, "f");
    }
    getDescription() {
        const description = issueDescriptions.get(__classPrivateFieldGet(this, _SharedDictionaryIssue_issueDetails, "f").sharedDictionaryError);
        if (!description) {
            return null;
        }
        return resolveLazyDescription(description);
    }
    primaryKey() {
        return JSON.stringify(__classPrivateFieldGet(this, _SharedDictionaryIssue_issueDetails, "f"));
    }
    getKind() {
        return "PageError" /* IssueKind.PAGE_ERROR */;
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const details = inspectorIssue.details.sharedDictionaryIssueDetails;
        if (!details) {
            console.warn('Shared Dictionary issue without details received.');
            return [];
        }
        return [new SharedDictionaryIssue(details, issuesModel)];
    }
}
_SharedDictionaryIssue_issueDetails = new WeakMap();
const specLinks = [{
        link: 'https://datatracker.ietf.org/doc/draft-ietf-httpbis-compression-dictionary/',
        linkTitle: i18nLazyString(UIStrings.compressionDictionaryTransport),
    }];
const issueDescriptions = new Map([
    [
        "UseErrorCrossOriginNoCorsRequest" /* Protocol.Audits.SharedDictionaryError.UseErrorCrossOriginNoCorsRequest */,
        {
            file: 'sharedDictionaryUseErrorCrossOriginNoCorsRequest.md',
            links: specLinks,
        },
    ],
    [
        "UseErrorDictionaryLoadFailure" /* Protocol.Audits.SharedDictionaryError.UseErrorDictionaryLoadFailure */,
        {
            file: 'sharedDictionaryUseErrorDictionaryLoadFailure.md',
            links: specLinks,
        },
    ],
    [
        "UseErrorMatchingDictionaryNotUsed" /* Protocol.Audits.SharedDictionaryError.UseErrorMatchingDictionaryNotUsed */,
        {
            file: 'sharedDictionaryUseErrorMatchingDictionaryNotUsed.md',
            links: specLinks,
        },
    ],
    [
        "UseErrorUnexpectedContentDictionaryHeader" /* Protocol.Audits.SharedDictionaryError.UseErrorUnexpectedContentDictionaryHeader */,
        {
            file: 'sharedDictionaryUseErrorUnexpectedContentDictionaryHeader.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorCossOriginNoCorsRequest" /* Protocol.Audits.SharedDictionaryError.WriteErrorCossOriginNoCorsRequest */,
        {
            file: 'sharedDictionaryWriteErrorCossOriginNoCorsRequest.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorDisallowedBySettings" /* Protocol.Audits.SharedDictionaryError.WriteErrorDisallowedBySettings */,
        {
            file: 'sharedDictionaryWriteErrorDisallowedBySettings.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorExpiredResponse" /* Protocol.Audits.SharedDictionaryError.WriteErrorExpiredResponse */,
        {
            file: 'sharedDictionaryWriteErrorExpiredResponse.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorFeatureDisabled" /* Protocol.Audits.SharedDictionaryError.WriteErrorFeatureDisabled */,
        {
            file: 'sharedDictionaryWriteErrorFeatureDisabled.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorInsufficientResources" /* Protocol.Audits.SharedDictionaryError.WriteErrorInsufficientResources */,
        {
            file: 'sharedDictionaryWriteErrorInsufficientResources.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorInvalidMatchField" /* Protocol.Audits.SharedDictionaryError.WriteErrorInvalidMatchField */,
        {
            file: 'sharedDictionaryWriteErrorInvalidMatchField.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorInvalidStructuredHeader" /* Protocol.Audits.SharedDictionaryError.WriteErrorInvalidStructuredHeader */,
        {
            file: 'sharedDictionaryWriteErrorInvalidStructuredHeader.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorNavigationRequest" /* Protocol.Audits.SharedDictionaryError.WriteErrorNavigationRequest */,
        {
            file: 'sharedDictionaryWriteErrorNavigationRequest.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorNoMatchField" /* Protocol.Audits.SharedDictionaryError.WriteErrorNoMatchField */,
        {
            file: 'sharedDictionaryWriteErrorNoMatchField.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorNonListMatchDestField" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonListMatchDestField */,
        {
            file: 'sharedDictionaryWriteErrorNonListMatchDestField.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorNonSecureContext" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonSecureContext */,
        {
            file: 'sharedDictionaryWriteErrorNonSecureContext.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorNonStringIdField" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonStringIdField */,
        {
            file: 'sharedDictionaryWriteErrorNonStringIdField.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorNonStringInMatchDestList" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonStringInMatchDestList */,
        {
            file: 'sharedDictionaryWriteErrorNonStringInMatchDestList.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorNonStringMatchField" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonStringMatchField */,
        {
            file: 'sharedDictionaryWriteErrorNonStringMatchField.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorNonTokenTypeField" /* Protocol.Audits.SharedDictionaryError.WriteErrorNonTokenTypeField */,
        {
            file: 'sharedDictionaryWriteErrorNonTokenTypeField.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorRequestAborted" /* Protocol.Audits.SharedDictionaryError.WriteErrorRequestAborted */,
        {
            file: 'sharedDictionaryWriteErrorRequestAborted.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorShuttingDown" /* Protocol.Audits.SharedDictionaryError.WriteErrorShuttingDown */,
        {
            file: 'sharedDictionaryWriteErrorShuttingDown.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorTooLongIdField" /* Protocol.Audits.SharedDictionaryError.WriteErrorTooLongIdField */,
        {
            file: 'sharedDictionaryWriteErrorTooLongIdField.md',
            links: specLinks,
        },
    ],
    [
        "WriteErrorUnsupportedType" /* Protocol.Audits.SharedDictionaryError.WriteErrorUnsupportedType */,
        {
            file: 'sharedDictionaryWriteErrorUnsupportedType.md',
            links: specLinks,
        },
    ],
]);
//# sourceMappingURL=SharedDictionaryIssue.js.map