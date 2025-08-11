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
var _ContentSecurityPolicyIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
import { resolveLazyDescription, } from './MarkdownIssueDescription.js';
const UIStrings = {
    /**
     *@description Title for CSP url link
     */
    contentSecurityPolicySource: 'Content Security Policy - Source Allowlists',
    /**
     *@description Title for CSP inline issue link
     */
    contentSecurityPolicyInlineCode: 'Content Security Policy - Inline Code',
    /**
     *@description Title for the CSP eval link
     */
    contentSecurityPolicyEval: 'Content Security Policy - Eval',
    /**
     *@description Title for Trusted Types policy violation issue link. https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
     */
    trustedTypesFixViolations: 'Trusted Types - Fix violations',
    /**
     *@description Title for Trusted Types policy violation issue link. https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
     */
    trustedTypesPolicyViolation: 'Trusted Types - Policy violation',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/ContentSecurityPolicyIssue.ts', UIStrings);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
export class ContentSecurityPolicyIssue extends Issue {
    constructor(issueDetails, issuesModel, issueId) {
        const issueCode = [
            "ContentSecurityPolicyIssue" /* Protocol.Audits.InspectorIssueCode.ContentSecurityPolicyIssue */,
            issueDetails.contentSecurityPolicyViolationType,
        ].join('::');
        super(issueCode, issuesModel, issueId);
        _ContentSecurityPolicyIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _ContentSecurityPolicyIssue_issueDetails, issueDetails, "f");
    }
    getCategory() {
        return "ContentSecurityPolicy" /* IssueCategory.CONTENT_SECURITY_POLICY */;
    }
    primaryKey() {
        return JSON.stringify(__classPrivateFieldGet(this, _ContentSecurityPolicyIssue_issueDetails, "f"), [
            'blockedURL',
            'contentSecurityPolicyViolationType',
            'violatedDirective',
            'isReportOnly',
            'sourceCodeLocation',
            'url',
            'lineNumber',
            'columnNumber',
            'violatingNodeId',
        ]);
    }
    getDescription() {
        const description = issueDescriptions.get(__classPrivateFieldGet(this, _ContentSecurityPolicyIssue_issueDetails, "f").contentSecurityPolicyViolationType);
        if (!description) {
            return null;
        }
        return resolveLazyDescription(description);
    }
    details() {
        return __classPrivateFieldGet(this, _ContentSecurityPolicyIssue_issueDetails, "f");
    }
    getKind() {
        if (__classPrivateFieldGet(this, _ContentSecurityPolicyIssue_issueDetails, "f").isReportOnly) {
            return "Improvement" /* IssueKind.IMPROVEMENT */;
        }
        return "PageError" /* IssueKind.PAGE_ERROR */;
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const cspDetails = inspectorIssue.details.contentSecurityPolicyIssueDetails;
        if (!cspDetails) {
            console.warn('Content security policy issue without details received.');
            return [];
        }
        return [new ContentSecurityPolicyIssue(cspDetails, issuesModel, inspectorIssue.issueId)];
    }
}
_ContentSecurityPolicyIssue_issueDetails = new WeakMap();
const cspURLViolation = {
    file: 'cspURLViolation.md',
    links: [{
            link: 'https://developers.google.com/web/fundamentals/security/csp#source_allowlists',
            linkTitle: i18nLazyString(UIStrings.contentSecurityPolicySource),
        }],
};
const cspInlineViolation = {
    file: 'cspInlineViolation.md',
    links: [{
            link: 'https://developers.google.com/web/fundamentals/security/csp#inline_code_is_considered_harmful',
            linkTitle: i18nLazyString(UIStrings.contentSecurityPolicyInlineCode),
        }],
};
const cspEvalViolation = {
    file: 'cspEvalViolation.md',
    links: [{
            link: 'https://developers.google.com/web/fundamentals/security/csp#eval_too',
            linkTitle: i18nLazyString(UIStrings.contentSecurityPolicyEval),
        }],
};
const cspTrustedTypesSinkViolation = {
    file: 'cspTrustedTypesSinkViolation.md',
    links: [{
            link: 'https://web.dev/trusted-types/#fix-the-violations',
            linkTitle: i18nLazyString(UIStrings.trustedTypesFixViolations),
        }],
};
const cspTrustedTypesPolicyViolation = {
    file: 'cspTrustedTypesPolicyViolation.md',
    links: [{ link: 'https://web.dev/trusted-types/', linkTitle: i18nLazyString(UIStrings.trustedTypesPolicyViolation) }],
};
export const urlViolationCode = [
    "ContentSecurityPolicyIssue" /* Protocol.Audits.InspectorIssueCode.ContentSecurityPolicyIssue */,
    "kURLViolation" /* Protocol.Audits.ContentSecurityPolicyViolationType.KURLViolation */,
].join('::');
export const inlineViolationCode = [
    "ContentSecurityPolicyIssue" /* Protocol.Audits.InspectorIssueCode.ContentSecurityPolicyIssue */,
    "kInlineViolation" /* Protocol.Audits.ContentSecurityPolicyViolationType.KInlineViolation */,
].join('::');
export const evalViolationCode = [
    "ContentSecurityPolicyIssue" /* Protocol.Audits.InspectorIssueCode.ContentSecurityPolicyIssue */,
    "kEvalViolation" /* Protocol.Audits.ContentSecurityPolicyViolationType.KEvalViolation */,
].join('::');
export const trustedTypesSinkViolationCode = [
    "ContentSecurityPolicyIssue" /* Protocol.Audits.InspectorIssueCode.ContentSecurityPolicyIssue */,
    "kTrustedTypesSinkViolation" /* Protocol.Audits.ContentSecurityPolicyViolationType.KTrustedTypesSinkViolation */,
].join('::');
export const trustedTypesPolicyViolationCode = [
    "ContentSecurityPolicyIssue" /* Protocol.Audits.InspectorIssueCode.ContentSecurityPolicyIssue */,
    "kTrustedTypesPolicyViolation" /* Protocol.Audits.ContentSecurityPolicyViolationType.KTrustedTypesPolicyViolation */,
].join('::');
const issueDescriptions = new Map([
    ["kURLViolation" /* Protocol.Audits.ContentSecurityPolicyViolationType.KURLViolation */, cspURLViolation],
    ["kInlineViolation" /* Protocol.Audits.ContentSecurityPolicyViolationType.KInlineViolation */, cspInlineViolation],
    ["kEvalViolation" /* Protocol.Audits.ContentSecurityPolicyViolationType.KEvalViolation */, cspEvalViolation],
    ["kTrustedTypesSinkViolation" /* Protocol.Audits.ContentSecurityPolicyViolationType.KTrustedTypesSinkViolation */, cspTrustedTypesSinkViolation],
    ["kTrustedTypesPolicyViolation" /* Protocol.Audits.ContentSecurityPolicyViolationType.KTrustedTypesPolicyViolation */, cspTrustedTypesPolicyViolation],
]);
//# sourceMappingURL=ContentSecurityPolicyIssue.js.map