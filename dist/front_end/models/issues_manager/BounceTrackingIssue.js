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
var _BounceTrackingIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
const UIStrings = {
    /**
     *@description Title for Bounce Tracking Mitigation explainer url link.
     */
    bounceTrackingMitigations: 'Bounce tracking mitigations',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/BounceTrackingIssue.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class BounceTrackingIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        super("BounceTrackingIssue" /* Protocol.Audits.InspectorIssueCode.BounceTrackingIssue */, issuesModel);
        _BounceTrackingIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _BounceTrackingIssue_issueDetails, issueDetails, "f");
    }
    getCategory() {
        return "Other" /* IssueCategory.OTHER */;
    }
    getDescription() {
        return {
            file: 'bounceTrackingMitigations.md',
            links: [
                {
                    link: 'https://privacycg.github.io/nav-tracking-mitigations/#bounce-tracking-mitigations',
                    linkTitle: i18nString(UIStrings.bounceTrackingMitigations),
                },
            ],
        };
    }
    details() {
        return __classPrivateFieldGet(this, _BounceTrackingIssue_issueDetails, "f");
    }
    getKind() {
        return "BreakingChange" /* IssueKind.BREAKING_CHANGE */;
    }
    primaryKey() {
        return JSON.stringify(__classPrivateFieldGet(this, _BounceTrackingIssue_issueDetails, "f"));
    }
    trackingSites() {
        if (__classPrivateFieldGet(this, _BounceTrackingIssue_issueDetails, "f").trackingSites) {
            return __classPrivateFieldGet(this, _BounceTrackingIssue_issueDetails, "f").trackingSites;
        }
        return [];
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const details = inspectorIssue.details.bounceTrackingIssueDetails;
        if (!details) {
            console.warn('Bounce tracking issue without details received.');
            return [];
        }
        return [new BounceTrackingIssue(details, issuesModel)];
    }
}
_BounceTrackingIssue_issueDetails = new WeakMap();
//# sourceMappingURL=BounceTrackingIssue.js.map