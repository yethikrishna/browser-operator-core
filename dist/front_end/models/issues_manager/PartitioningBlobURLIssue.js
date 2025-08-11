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
var _PartitioningBlobURLIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
const UIStrings = {
    /**
     *@description Title for Partitioning BlobURL explainer url link.
     */
    partitioningBlobURL: 'Partitioning BlobURL',
    /**
     *@description Title for Chrome Status Entry url link.
     */
    chromeStatusEntry: 'Chrome Status Entry'
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/PartitioningBlobURLIssue.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class PartitioningBlobURLIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        super("PartitioningBlobURLIssue" /* Protocol.Audits.InspectorIssueCode.PartitioningBlobURLIssue */, issuesModel);
        _PartitioningBlobURLIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _PartitioningBlobURLIssue_issueDetails, issueDetails, "f");
    }
    getCategory() {
        return "Other" /* IssueCategory.OTHER */;
    }
    getDescription() {
        const fileName = __classPrivateFieldGet(this, _PartitioningBlobURLIssue_issueDetails, "f").partitioningBlobURLInfo ===
            "BlockedCrossPartitionFetching" /* Protocol.Audits.PartitioningBlobURLInfo.BlockedCrossPartitionFetching */ ?
            'fetchingPartitionedBlobURL.md' :
            'navigatingPartitionedBlobURL.md';
        return {
            file: fileName,
            links: [
                {
                    link: 'https://developers.google.com/privacy-sandbox/cookies/storage-partitioning',
                    linkTitle: i18nString(UIStrings.partitioningBlobURL),
                },
                {
                    link: 'https://chromestatus.com/feature/5130361898795008',
                    linkTitle: i18nString(UIStrings.chromeStatusEntry),
                },
            ],
        };
    }
    details() {
        return __classPrivateFieldGet(this, _PartitioningBlobURLIssue_issueDetails, "f");
    }
    getKind() {
        return "BreakingChange" /* IssueKind.BREAKING_CHANGE */;
    }
    primaryKey() {
        return JSON.stringify(__classPrivateFieldGet(this, _PartitioningBlobURLIssue_issueDetails, "f"));
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const details = inspectorIssue.details.partitioningBlobURLIssueDetails;
        if (!details) {
            console.warn('Partitioning BlobURL issue without details received.');
            return [];
        }
        return [new PartitioningBlobURLIssue(details, issuesModel)];
    }
}
_PartitioningBlobURLIssue_issueDetails = new WeakMap();
//# sourceMappingURL=PartitioningBlobURLIssue.js.map