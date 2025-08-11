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
var _MixedContentIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
const UIStrings = {
    /**
     *@description Label for the link for Mixed Content Issues
     */
    preventingMixedContent: 'Preventing mixed content',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/MixedContentIssue.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class MixedContentIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        super("MixedContentIssue" /* Protocol.Audits.InspectorIssueCode.MixedContentIssue */, issuesModel);
        _MixedContentIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _MixedContentIssue_issueDetails, issueDetails, "f");
    }
    requests() {
        if (__classPrivateFieldGet(this, _MixedContentIssue_issueDetails, "f").request) {
            return [__classPrivateFieldGet(this, _MixedContentIssue_issueDetails, "f").request];
        }
        return [];
    }
    getDetails() {
        return __classPrivateFieldGet(this, _MixedContentIssue_issueDetails, "f");
    }
    getCategory() {
        return "MixedContent" /* IssueCategory.MIXED_CONTENT */;
    }
    getDescription() {
        return {
            file: 'mixedContent.md',
            links: [{ link: 'https://web.dev/what-is-mixed-content/', linkTitle: i18nString(UIStrings.preventingMixedContent) }],
        };
    }
    primaryKey() {
        return JSON.stringify(__classPrivateFieldGet(this, _MixedContentIssue_issueDetails, "f"));
    }
    getKind() {
        switch (__classPrivateFieldGet(this, _MixedContentIssue_issueDetails, "f").resolutionStatus) {
            case "MixedContentAutomaticallyUpgraded" /* Protocol.Audits.MixedContentResolutionStatus.MixedContentAutomaticallyUpgraded */:
                return "Improvement" /* IssueKind.IMPROVEMENT */;
            case "MixedContentBlocked" /* Protocol.Audits.MixedContentResolutionStatus.MixedContentBlocked */:
                return "PageError" /* IssueKind.PAGE_ERROR */;
            case "MixedContentWarning" /* Protocol.Audits.MixedContentResolutionStatus.MixedContentWarning */:
                return "Improvement" /* IssueKind.IMPROVEMENT */;
        }
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const mixedContentDetails = inspectorIssue.details.mixedContentIssueDetails;
        if (!mixedContentDetails) {
            console.warn('Mixed content issue without details received.');
            return [];
        }
        return [new MixedContentIssue(mixedContentDetails, issuesModel)];
    }
}
_MixedContentIssue_issueDetails = new WeakMap();
//# sourceMappingURL=MixedContentIssue.js.map