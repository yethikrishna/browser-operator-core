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
var _PropertyRuleIssue_issueDetails, _PropertyRuleIssue_primaryKey;
import { Issue } from './Issue.js';
export class PropertyRuleIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        const code = JSON.stringify(issueDetails);
        super(code, issuesModel);
        _PropertyRuleIssue_issueDetails.set(this, void 0);
        _PropertyRuleIssue_primaryKey.set(this, void 0);
        __classPrivateFieldSet(this, _PropertyRuleIssue_primaryKey, code, "f");
        __classPrivateFieldSet(this, _PropertyRuleIssue_issueDetails, issueDetails, "f");
    }
    sources() {
        return [__classPrivateFieldGet(this, _PropertyRuleIssue_issueDetails, "f").sourceCodeLocation];
    }
    details() {
        return __classPrivateFieldGet(this, _PropertyRuleIssue_issueDetails, "f");
    }
    primaryKey() {
        return __classPrivateFieldGet(this, _PropertyRuleIssue_primaryKey, "f");
    }
    getPropertyName() {
        switch (__classPrivateFieldGet(this, _PropertyRuleIssue_issueDetails, "f").propertyRuleIssueReason) {
            case "InvalidInherits" /* Protocol.Audits.PropertyRuleIssueReason.InvalidInherits */:
                return 'inherits';
            case "InvalidInitialValue" /* Protocol.Audits.PropertyRuleIssueReason.InvalidInitialValue */:
                return 'initial-value';
            case "InvalidSyntax" /* Protocol.Audits.PropertyRuleIssueReason.InvalidSyntax */:
                return 'syntax';
        }
        return '';
    }
    getDescription() {
        if (__classPrivateFieldGet(this, _PropertyRuleIssue_issueDetails, "f").propertyRuleIssueReason === "InvalidName" /* Protocol.Audits.PropertyRuleIssueReason.InvalidName */) {
            return {
                file: 'propertyRuleInvalidNameIssue.md',
                links: [],
            };
        }
        const value = __classPrivateFieldGet(this, _PropertyRuleIssue_issueDetails, "f").propertyValue ? `: ${__classPrivateFieldGet(this, _PropertyRuleIssue_issueDetails, "f").propertyValue}` : '';
        const property = `${this.getPropertyName()}${value}`;
        return {
            file: 'propertyRuleIssue.md',
            substitutions: new Map([['PLACEHOLDER_property', property]]),
            links: [],
        };
    }
    getCategory() {
        return "Other" /* IssueCategory.OTHER */;
    }
    getKind() {
        return "PageError" /* IssueKind.PAGE_ERROR */;
    }
    static fromInspectorIssue(issueModel, inspectorIssue) {
        const propertyRuleIssueDetails = inspectorIssue.details.propertyRuleIssueDetails;
        if (!propertyRuleIssueDetails) {
            console.warn('Property rule issue without details received');
            return [];
        }
        return [new PropertyRuleIssue(propertyRuleIssueDetails, issueModel)];
    }
}
_PropertyRuleIssue_issueDetails = new WeakMap(), _PropertyRuleIssue_primaryKey = new WeakMap();
//# sourceMappingURL=PropertyRuleIssue.js.map