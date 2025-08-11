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
var _HeavyAdIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
const UIStrings = {
    /**
     *@description Title for a learn more link in Heavy Ads issue description
     */
    handlingHeavyAdInterventions: 'Handling Heavy Ad Interventions',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/HeavyAdIssue.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class HeavyAdIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        const umaCode = ["HeavyAdIssue" /* Protocol.Audits.InspectorIssueCode.HeavyAdIssue */, issueDetails.reason].join('::');
        super({ code: "HeavyAdIssue" /* Protocol.Audits.InspectorIssueCode.HeavyAdIssue */, umaCode }, issuesModel);
        _HeavyAdIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _HeavyAdIssue_issueDetails, issueDetails, "f");
    }
    details() {
        return __classPrivateFieldGet(this, _HeavyAdIssue_issueDetails, "f");
    }
    primaryKey() {
        return `${"HeavyAdIssue" /* Protocol.Audits.InspectorIssueCode.HeavyAdIssue */}-${JSON.stringify(__classPrivateFieldGet(this, _HeavyAdIssue_issueDetails, "f"))}`;
    }
    getDescription() {
        return {
            file: 'heavyAd.md',
            links: [
                {
                    link: 'https://developers.google.com/web/updates/2020/05/heavy-ad-interventions',
                    linkTitle: i18nString(UIStrings.handlingHeavyAdInterventions),
                },
            ],
        };
    }
    getCategory() {
        return "HeavyAd" /* IssueCategory.HEAVY_AD */;
    }
    getKind() {
        switch (__classPrivateFieldGet(this, _HeavyAdIssue_issueDetails, "f").resolution) {
            case "HeavyAdBlocked" /* Protocol.Audits.HeavyAdResolutionStatus.HeavyAdBlocked */:
                return "PageError" /* IssueKind.PAGE_ERROR */;
            case "HeavyAdWarning" /* Protocol.Audits.HeavyAdResolutionStatus.HeavyAdWarning */:
                return "BreakingChange" /* IssueKind.BREAKING_CHANGE */;
        }
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const heavyAdIssueDetails = inspectorIssue.details.heavyAdIssueDetails;
        if (!heavyAdIssueDetails) {
            console.warn('Heavy Ad issue without details received.');
            return [];
        }
        return [new HeavyAdIssue(heavyAdIssueDetails, issuesModel)];
    }
}
_HeavyAdIssue_issueDetails = new WeakMap();
//# sourceMappingURL=HeavyAdIssue.js.map