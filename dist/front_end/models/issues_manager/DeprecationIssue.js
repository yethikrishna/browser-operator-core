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
var _DeprecationIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import * as Deprecation from '../../generated/Deprecation.js';
import { Issue } from './Issue.js';
import { resolveLazyDescription } from './MarkdownIssueDescription.js';
const UIStrings = {
    /**
     * @description This links to the chrome feature status page when one exists.
     */
    feature: 'Check the feature status page for more details.',
    /**
     * @description This links to the chromium dash schedule when a milestone is set.
     * @example {100} milestone
     */
    milestone: 'This change will go into effect with milestone {milestone}.',
    /**
     * @description Title of issue raised when a deprecated feature is used
     */
    title: 'Deprecated feature used',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/DeprecationIssue.ts', UIStrings);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
// eslint-disable-next-line rulesdir/l10n-filename-matches
const strDeprecation = i18n.i18n.registerUIStrings('generated/Deprecation.ts', Deprecation.UIStrings);
const i18nLazyDeprecationString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, strDeprecation);
export class DeprecationIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        const issueCode = [
            "DeprecationIssue" /* Protocol.Audits.InspectorIssueCode.DeprecationIssue */,
            issueDetails.type,
        ].join('::');
        super({ code: issueCode, umaCode: 'DeprecationIssue' }, issuesModel);
        _DeprecationIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _DeprecationIssue_issueDetails, issueDetails, "f");
    }
    getCategory() {
        return "Other" /* IssueCategory.OTHER */;
    }
    details() {
        return __classPrivateFieldGet(this, _DeprecationIssue_issueDetails, "f");
    }
    getDescription() {
        let messageFunction = () => '';
        const maybeEnglishMessage = Deprecation.UIStrings[__classPrivateFieldGet(this, _DeprecationIssue_issueDetails, "f").type];
        if (maybeEnglishMessage) {
            messageFunction = i18nLazyDeprecationString(maybeEnglishMessage);
        }
        const links = [];
        const deprecationMeta = Deprecation.DEPRECATIONS_METADATA[__classPrivateFieldGet(this, _DeprecationIssue_issueDetails, "f").type];
        const feature = deprecationMeta?.chromeStatusFeature ?? 0;
        if (feature !== 0) {
            links.push({
                link: `https://chromestatus.com/feature/${feature}`,
                linkTitle: i18nLazyString(UIStrings.feature),
            });
        }
        const milestone = deprecationMeta?.milestone ?? 0;
        if (milestone !== 0) {
            links.push({
                link: 'https://chromiumdash.appspot.com/schedule',
                linkTitle: i18nLazyString(UIStrings.milestone, { milestone }),
            });
        }
        return resolveLazyDescription({
            file: 'deprecation.md',
            substitutions: new Map([
                ['PLACEHOLDER_title', i18nLazyString(UIStrings.title)],
                ['PLACEHOLDER_message', messageFunction],
            ]),
            links,
        });
    }
    sources() {
        if (__classPrivateFieldGet(this, _DeprecationIssue_issueDetails, "f").sourceCodeLocation) {
            return [__classPrivateFieldGet(this, _DeprecationIssue_issueDetails, "f").sourceCodeLocation];
        }
        return [];
    }
    primaryKey() {
        return JSON.stringify(__classPrivateFieldGet(this, _DeprecationIssue_issueDetails, "f"));
    }
    getKind() {
        return "BreakingChange" /* IssueKind.BREAKING_CHANGE */;
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const details = inspectorIssue.details.deprecationIssueDetails;
        if (!details) {
            console.warn('Deprecation issue without details received.');
            return [];
        }
        return [new DeprecationIssue(details, issuesModel)];
    }
}
_DeprecationIssue_issueDetails = new WeakMap();
//# sourceMappingURL=DeprecationIssue.js.map