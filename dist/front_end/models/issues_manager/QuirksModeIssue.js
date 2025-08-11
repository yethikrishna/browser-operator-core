// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _QuirksModeIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
const UIStrings = {
    /**
     *@description Link title for the Quirks Mode issue in the Issues panel
     */
    documentCompatibilityMode: 'Document compatibility mode',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/QuirksModeIssue.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class QuirksModeIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        const mode = issueDetails.isLimitedQuirksMode ? 'LimitedQuirksMode' : 'QuirksMode';
        const umaCode = ["QuirksModeIssue" /* Protocol.Audits.InspectorIssueCode.QuirksModeIssue */, mode].join('::');
        super({ code: "QuirksModeIssue" /* Protocol.Audits.InspectorIssueCode.QuirksModeIssue */, umaCode }, issuesModel);
        _QuirksModeIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _QuirksModeIssue_issueDetails, issueDetails, "f");
    }
    primaryKey() {
        return `${this.code()}-(${__classPrivateFieldGet(this, _QuirksModeIssue_issueDetails, "f").documentNodeId})-(${__classPrivateFieldGet(this, _QuirksModeIssue_issueDetails, "f").url})`;
    }
    getCategory() {
        return "QuirksMode" /* IssueCategory.QUIRKS_MODE */;
    }
    details() {
        return __classPrivateFieldGet(this, _QuirksModeIssue_issueDetails, "f");
    }
    getDescription() {
        return {
            file: 'CompatibilityModeQuirks.md',
            links: [
                {
                    link: 'https://web.dev/doctype/',
                    linkTitle: i18nString(UIStrings.documentCompatibilityMode),
                },
            ],
        };
    }
    getKind() {
        return "Improvement" /* IssueKind.IMPROVEMENT */;
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const quirksModeIssueDetails = inspectorIssue.details.quirksModeIssueDetails;
        if (!quirksModeIssueDetails) {
            console.warn('Quirks Mode issue without details received.');
            return [];
        }
        return [new QuirksModeIssue(quirksModeIssueDetails, issuesModel)];
    }
}
_QuirksModeIssue_issueDetails = new WeakMap();
//# sourceMappingURL=QuirksModeIssue.js.map