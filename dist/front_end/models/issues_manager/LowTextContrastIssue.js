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
var _LowTextContrastIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
const UIStrings = {
    /**
     *@description Link title for the Low Text Contrast issue in the Issues panel
     */
    colorAndContrastAccessibility: 'Color and contrast accessibility',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/LowTextContrastIssue.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class LowTextContrastIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        super('LowTextContrastIssue', issuesModel);
        _LowTextContrastIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _LowTextContrastIssue_issueDetails, issueDetails, "f");
    }
    primaryKey() {
        // We intend to keep only one issue per element so other issues for the element will be discarded even
        // if the issue content is slightly different.
        return `${this.code()}-(${__classPrivateFieldGet(this, _LowTextContrastIssue_issueDetails, "f").violatingNodeId})`;
    }
    getCategory() {
        return "LowTextContrast" /* IssueCategory.LOW_TEXT_CONTRAST */;
    }
    details() {
        return __classPrivateFieldGet(this, _LowTextContrastIssue_issueDetails, "f");
    }
    getDescription() {
        return {
            file: 'LowTextContrast.md',
            links: [
                {
                    link: 'https://web.dev/color-and-contrast-accessibility/',
                    linkTitle: i18nString(UIStrings.colorAndContrastAccessibility),
                },
            ],
        };
    }
    getKind() {
        return "Improvement" /* IssueKind.IMPROVEMENT */;
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const lowTextContrastIssueDetails = inspectorIssue.details.lowTextContrastIssueDetails;
        if (!lowTextContrastIssueDetails) {
            console.warn('LowTextContrast issue without details received.');
            return [];
        }
        return [new LowTextContrastIssue(lowTextContrastIssueDetails, issuesModel)];
    }
}
_LowTextContrastIssue_issueDetails = new WeakMap();
//# sourceMappingURL=LowTextContrastIssue.js.map