// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _SRIMessageSignatureIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
import { resolveLazyDescription, } from './MarkdownIssueDescription.js';
const UIStrings = {
    /**
     *@description Title for HTTP Message Signatures specification url
     */
    httpMessageSignatures: 'HTTP Message Signatures (RFC9421)',
    /**
     *@description Title for Signature-based Integrity specification url
     */
    signatureBasedIntegrity: 'Signature-based Integrity',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/SRIMessageSignatureIssue.ts', UIStrings);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
function generateGroupingIssueCode(details) {
    const issueCode = `${"SRIMessageSignatureIssue" /* Protocol.Audits.InspectorIssueCode.SRIMessageSignatureIssue */}::${details.error}`;
    if (details.error === "ValidationFailedSignatureMismatch" /* Protocol.Audits.SRIMessageSignatureError.ValidationFailedSignatureMismatch */) {
        // Signature mismatch errors should be grouped by "signature base".
        return issueCode + details.signatureBase;
    }
    if (details.error === "ValidationFailedIntegrityMismatch" /* Protocol.Audits.SRIMessageSignatureError.ValidationFailedIntegrityMismatch */) {
        // Integrity mismatch errors should be grouped by integrity assertion.
        return issueCode + details.integrityAssertions.join();
    }
    // Otherwise, simply group by issue type:
    return issueCode;
}
export class SRIMessageSignatureIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        super({
            code: generateGroupingIssueCode(issueDetails),
            umaCode: `${"SRIMessageSignatureIssue" /* Protocol.Audits.InspectorIssueCode.SRIMessageSignatureIssue */}::${issueDetails.error}`,
        }, issuesModel);
        _SRIMessageSignatureIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _SRIMessageSignatureIssue_issueDetails, issueDetails, "f");
    }
    details() {
        return __classPrivateFieldGet(this, _SRIMessageSignatureIssue_issueDetails, "f");
    }
    // Overriding `Issue<String>`:
    primaryKey() {
        return JSON.stringify(this.details());
    }
    getDescription() {
        const description = {
            file: `sri${this.details().error}.md`,
            links: [
                {
                    link: 'https://www.rfc-editor.org/rfc/rfc9421.html',
                    linkTitle: i18nLazyString(UIStrings.httpMessageSignatures),
                },
                {
                    link: 'https://wicg.github.io/signature-based-sri/',
                    linkTitle: i18nLazyString(UIStrings.signatureBasedIntegrity),
                }
            ],
            substitutions: new Map()
        };
        if (__classPrivateFieldGet(this, _SRIMessageSignatureIssue_issueDetails, "f").error === "ValidationFailedSignatureMismatch" /* Protocol.Audits.SRIMessageSignatureError.ValidationFailedSignatureMismatch */) {
            description.substitutions?.set('PLACEHOLDER_signatureBase', () => __classPrivateFieldGet(this, _SRIMessageSignatureIssue_issueDetails, "f").signatureBase);
        }
        if (__classPrivateFieldGet(this, _SRIMessageSignatureIssue_issueDetails, "f").error === "ValidationFailedIntegrityMismatch" /* Protocol.Audits.SRIMessageSignatureError.ValidationFailedIntegrityMismatch */) {
            description.substitutions?.set('PLACEHOLDER_integrityAssertions', () => {
                const prefix = '\n* ';
                return prefix + this.details().integrityAssertions.join(prefix);
            });
        }
        return resolveLazyDescription(description);
    }
    getCategory() {
        return "Other" /* IssueCategory.OTHER */;
    }
    getKind() {
        return "PageError" /* IssueKind.PAGE_ERROR */;
    }
    requests() {
        return this.details().request ? [this.details().request] : [];
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const details = inspectorIssue.details.sriMessageSignatureIssueDetails;
        if (!details) {
            console.warn('SRI Message Signature issue without details received.');
            return [];
        }
        return [new SRIMessageSignatureIssue(details, issuesModel)];
    }
}
_SRIMessageSignatureIssue_issueDetails = new WeakMap();
//# sourceMappingURL=SRIMessageSignatureIssue.js.map