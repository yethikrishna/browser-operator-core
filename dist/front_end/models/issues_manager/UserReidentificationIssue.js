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
var _UserReidentificationIssue_issueDetails;
import { Issue } from './Issue.js';
import { resolveLazyDescription, } from './MarkdownIssueDescription.js';
export class UserReidentificationIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        super('UserReidentificationIssue', issuesModel);
        _UserReidentificationIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _UserReidentificationIssue_issueDetails, issueDetails, "f");
    }
    primaryKey() {
        const requestId = __classPrivateFieldGet(this, _UserReidentificationIssue_issueDetails, "f").request ? __classPrivateFieldGet(this, _UserReidentificationIssue_issueDetails, "f").request.requestId : 'no-request';
        return `${this.code()}-(${requestId})`;
    }
    requests() {
        return __classPrivateFieldGet(this, _UserReidentificationIssue_issueDetails, "f").request ? [__classPrivateFieldGet(this, _UserReidentificationIssue_issueDetails, "f").request] : [];
    }
    getCategory() {
        return "Other" /* IssueCategory.OTHER */;
    }
    getDescription() {
        const description = issueDescriptions.get(this.code());
        if (!description) {
            return null;
        }
        return resolveLazyDescription(description);
    }
    getKind() {
        return "Improvement" /* IssueKind.IMPROVEMENT */;
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const userReidentificationIssueDetails = inspectorIssue.details.userReidentificationIssueDetails;
        if (!userReidentificationIssueDetails) {
            console.warn('User Reidentification issue without details received.');
            return [];
        }
        return [new UserReidentificationIssue(userReidentificationIssueDetails, issuesModel)];
    }
}
_UserReidentificationIssue_issueDetails = new WeakMap();
// Add new issue types to this map (with a unique code per type).
const issueDescriptions = new Map([
    [
        'UserReidentificationIssue',
        {
            file: 'userReidentificationBlocked.md',
            // TODO(https://g-issues.chromium.org/issues/409596758): Add
            // internationalized learn more link text.
            links: [],
        },
    ],
]);
//# sourceMappingURL=UserReidentificationIssue.js.map