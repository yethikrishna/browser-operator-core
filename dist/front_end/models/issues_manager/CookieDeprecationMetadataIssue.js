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
var _CookieDeprecationMetadataIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
const UIStrings = {
    /**
     * @description Label for a link for third-party cookie Issues.
     */
    thirdPartyPhaseoutExplained: 'Changes to Chrome\'s treatment of third-party cookies',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/CookieDeprecationMetadataIssue.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
// TODO(b/305738703): Move this issue into a warning on CookieIssue.
export class CookieDeprecationMetadataIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        // Set a distinct code for ReadCookie and SetCookie issues, so they are grouped separately.
        const issueCode = "CookieDeprecationMetadataIssue" /* Protocol.Audits.InspectorIssueCode.CookieDeprecationMetadataIssue */ + '_' + issueDetails.operation;
        super(issueCode, issuesModel);
        _CookieDeprecationMetadataIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _CookieDeprecationMetadataIssue_issueDetails, issueDetails, "f");
    }
    getCategory() {
        return "Other" /* IssueCategory.OTHER */;
    }
    getDescription() {
        const fileName = __classPrivateFieldGet(this, _CookieDeprecationMetadataIssue_issueDetails, "f").operation === 'SetCookie' ? 'cookieWarnMetadataGrantSet.md' :
            'cookieWarnMetadataGrantRead.md';
        let optOutText = '';
        if (__classPrivateFieldGet(this, _CookieDeprecationMetadataIssue_issueDetails, "f").isOptOutTopLevel) {
            optOutText = '\n\n (Top level site opt-out: ' + __classPrivateFieldGet(this, _CookieDeprecationMetadataIssue_issueDetails, "f").optOutPercentage +
                '% - [learn more](gracePeriodStagedControlExplainer))';
        }
        return {
            file: fileName,
            substitutions: new Map([
                ['PLACEHOLDER_topleveloptout', optOutText],
            ]),
            links: [
                {
                    link: 'https://goo.gle/changes-to-chrome-browsing',
                    linkTitle: i18nString(UIStrings.thirdPartyPhaseoutExplained),
                },
            ],
        };
    }
    details() {
        return __classPrivateFieldGet(this, _CookieDeprecationMetadataIssue_issueDetails, "f");
    }
    getKind() {
        return "BreakingChange" /* IssueKind.BREAKING_CHANGE */;
    }
    primaryKey() {
        return JSON.stringify(__classPrivateFieldGet(this, _CookieDeprecationMetadataIssue_issueDetails, "f"));
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const details = inspectorIssue.details.cookieDeprecationMetadataIssueDetails;
        if (!details) {
            console.warn('Cookie deprecation metadata issue without details received.');
            return [];
        }
        return [new CookieDeprecationMetadataIssue(details, issuesModel)];
    }
}
_CookieDeprecationMetadataIssue_issueDetails = new WeakMap();
//# sourceMappingURL=CookieDeprecationMetadataIssue.js.map