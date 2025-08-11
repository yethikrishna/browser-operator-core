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
var _StylesheetLoadingIssue_issueDetails;
import { Issue } from './Issue.js';
export const lateImportStylesheetLoadingCode = [
    "StylesheetLoadingIssue" /* Protocol.Audits.InspectorIssueCode.StylesheetLoadingIssue */,
    "LateImportRule" /* Protocol.Audits.StyleSheetLoadingIssueReason.LateImportRule */,
].join('::');
export class StylesheetLoadingIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        const code = `${"StylesheetLoadingIssue" /* Protocol.Audits.InspectorIssueCode.StylesheetLoadingIssue */}::${issueDetails.styleSheetLoadingIssueReason}`;
        super(code, issuesModel);
        _StylesheetLoadingIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _StylesheetLoadingIssue_issueDetails, issueDetails, "f");
    }
    sources() {
        return [__classPrivateFieldGet(this, _StylesheetLoadingIssue_issueDetails, "f").sourceCodeLocation];
    }
    requests() {
        if (!__classPrivateFieldGet(this, _StylesheetLoadingIssue_issueDetails, "f").failedRequestInfo) {
            return [];
        }
        const { url, requestId } = __classPrivateFieldGet(this, _StylesheetLoadingIssue_issueDetails, "f").failedRequestInfo;
        if (!requestId) {
            return [];
        }
        return [{ url, requestId }];
    }
    details() {
        return __classPrivateFieldGet(this, _StylesheetLoadingIssue_issueDetails, "f");
    }
    primaryKey() {
        return JSON.stringify(__classPrivateFieldGet(this, _StylesheetLoadingIssue_issueDetails, "f"));
    }
    getDescription() {
        switch (__classPrivateFieldGet(this, _StylesheetLoadingIssue_issueDetails, "f").styleSheetLoadingIssueReason) {
            case "LateImportRule" /* Protocol.Audits.StyleSheetLoadingIssueReason.LateImportRule */:
                return {
                    file: 'stylesheetLateImport.md',
                    links: [],
                };
            case "RequestFailed" /* Protocol.Audits.StyleSheetLoadingIssueReason.RequestFailed */:
                return {
                    file: 'stylesheetRequestFailed.md',
                    links: [],
                };
        }
    }
    getCategory() {
        return "Other" /* IssueCategory.OTHER */;
    }
    getKind() {
        return "PageError" /* IssueKind.PAGE_ERROR */;
    }
    static fromInspectorIssue(issueModel, inspectorIssue) {
        const stylesheetLoadingDetails = inspectorIssue.details.stylesheetLoadingIssueDetails;
        if (!stylesheetLoadingDetails) {
            console.warn('Stylesheet loading issue without details received');
            return [];
        }
        return [new StylesheetLoadingIssue(stylesheetLoadingDetails, issueModel)];
    }
}
_StylesheetLoadingIssue_issueDetails = new WeakMap();
//# sourceMappingURL=StylesheetLoadingIssue.js.map