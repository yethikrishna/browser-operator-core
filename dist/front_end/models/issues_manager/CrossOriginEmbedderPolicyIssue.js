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
var _CrossOriginEmbedderPolicyIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
import { resolveLazyDescription, } from './MarkdownIssueDescription.js';
const UIStrings = {
    /**
     *@description Link text for a link to external documentation
     */
    coopAndCoep: 'COOP and COEP',
    /**
     *@description Title for an external link to more information in the issues view
     */
    samesiteAndSameorigin: 'Same-Site and Same-Origin',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/CrossOriginEmbedderPolicyIssue.ts', UIStrings);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
export function isCrossOriginEmbedderPolicyIssue(reason) {
    switch (reason) {
        case "CoepFrameResourceNeedsCoepHeader" /* Protocol.Audits.BlockedByResponseReason.CoepFrameResourceNeedsCoepHeader */:
            return true;
        case "CoopSandboxedIFrameCannotNavigateToCoopPage" /* Protocol.Audits.BlockedByResponseReason.CoopSandboxedIFrameCannotNavigateToCoopPage */:
            return true;
        case "CorpNotSameOrigin" /* Protocol.Audits.BlockedByResponseReason.CorpNotSameOrigin */:
            return true;
        case "CorpNotSameOriginAfterDefaultedToSameOriginByCoep" /* Protocol.Audits.BlockedByResponseReason.CorpNotSameOriginAfterDefaultedToSameOriginByCoep */:
            return true;
        case "CorpNotSameSite" /* Protocol.Audits.BlockedByResponseReason.CorpNotSameSite */:
            return true;
    }
    return false;
}
export class CrossOriginEmbedderPolicyIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        super(`CrossOriginEmbedderPolicyIssue::${issueDetails.reason}`, issuesModel);
        _CrossOriginEmbedderPolicyIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _CrossOriginEmbedderPolicyIssue_issueDetails, issueDetails, "f");
    }
    primaryKey() {
        return `${this.code()}-(${__classPrivateFieldGet(this, _CrossOriginEmbedderPolicyIssue_issueDetails, "f").request.requestId})`;
    }
    getBlockedByResponseDetails() {
        return [__classPrivateFieldGet(this, _CrossOriginEmbedderPolicyIssue_issueDetails, "f")];
    }
    requests() {
        return [__classPrivateFieldGet(this, _CrossOriginEmbedderPolicyIssue_issueDetails, "f").request];
    }
    getCategory() {
        return "CrossOriginEmbedderPolicy" /* IssueCategory.CROSS_ORIGIN_EMBEDDER_POLICY */;
    }
    getDescription() {
        const description = issueDescriptions.get(this.code());
        if (!description) {
            return null;
        }
        return resolveLazyDescription(description);
    }
    getKind() {
        return "PageError" /* IssueKind.PAGE_ERROR */;
    }
}
_CrossOriginEmbedderPolicyIssue_issueDetails = new WeakMap();
const issueDescriptions = new Map([
    [
        'CrossOriginEmbedderPolicyIssue::CorpNotSameOriginAfterDefaultedToSameOriginByCoep',
        {
            file: 'CoepCorpNotSameOriginAfterDefaultedToSameOriginByCoep.md',
            links: [
                { link: 'https://web.dev/coop-coep/', linkTitle: i18nLazyString(UIStrings.coopAndCoep) },
                { link: 'https://web.dev/same-site-same-origin/', linkTitle: i18nLazyString(UIStrings.samesiteAndSameorigin) },
            ],
        },
    ],
    [
        'CrossOriginEmbedderPolicyIssue::CoepFrameResourceNeedsCoepHeader',
        {
            file: 'CoepFrameResourceNeedsCoepHeader.md',
            links: [
                { link: 'https://web.dev/coop-coep/', linkTitle: i18nLazyString(UIStrings.coopAndCoep) },
            ],
        },
    ],
    [
        'CrossOriginEmbedderPolicyIssue::CoopSandboxedIframeCannotNavigateToCoopPage',
        {
            file: 'CoepCoopSandboxedIframeCannotNavigateToCoopPage.md',
            links: [
                { link: 'https://web.dev/coop-coep/', linkTitle: i18nLazyString(UIStrings.coopAndCoep) },
            ],
        },
    ],
    [
        'CrossOriginEmbedderPolicyIssue::CorpNotSameSite',
        {
            file: 'CoepCorpNotSameSite.md',
            links: [
                { link: 'https://web.dev/coop-coep/', linkTitle: i18nLazyString(UIStrings.coopAndCoep) },
                { link: 'https://web.dev/same-site-same-origin/', linkTitle: i18nLazyString(UIStrings.samesiteAndSameorigin) },
            ],
        },
    ],
    [
        'CrossOriginEmbedderPolicyIssue::CorpNotSameOrigin',
        {
            file: 'CoepCorpNotSameOrigin.md',
            links: [
                { link: 'https://web.dev/coop-coep/', linkTitle: i18nLazyString(UIStrings.coopAndCoep) },
                { link: 'https://web.dev/same-site-same-origin/', linkTitle: i18nLazyString(UIStrings.samesiteAndSameorigin) },
            ],
        },
    ],
]);
//# sourceMappingURL=CrossOriginEmbedderPolicyIssue.js.map