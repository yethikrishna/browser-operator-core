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
var _GenericIssue_issueDetails;
import * as i18n from '../../core/i18n/i18n.js';
import { Issue } from './Issue.js';
import { resolveLazyDescription, } from './MarkdownIssueDescription.js';
const UIStrings = {
    /**
     *@description title for autofill documentation page
     */
    howDoesAutofillWorkPageTitle: 'How does autofill work?',
    /**
     *@description title for label form elements usage example page
     */
    labelFormlementsPageTitle: 'The label elements',
    /**
     *@description title for input form elements usage example page
     */
    inputFormElementPageTitle: 'The form input element',
    /**
     *@description title for autocomplete attribute documentation page.
     */
    autocompleteAttributePageTitle: 'HTML attribute: autocomplete',
    /**
     * @description title for CORB explainer.
     */
    corbExplainerPageTitle: 'CORB explainer',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/GenericIssue.ts', UIStrings);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
export class GenericIssue extends Issue {
    constructor(issueDetails, issuesModel, issueId) {
        const issueCode = [
            "GenericIssue" /* Protocol.Audits.InspectorIssueCode.GenericIssue */,
            issueDetails.errorType,
        ].join('::');
        super(issueCode, issuesModel, issueId);
        _GenericIssue_issueDetails.set(this, void 0);
        __classPrivateFieldSet(this, _GenericIssue_issueDetails, issueDetails, "f");
    }
    requests() {
        if (__classPrivateFieldGet(this, _GenericIssue_issueDetails, "f").request) {
            return [__classPrivateFieldGet(this, _GenericIssue_issueDetails, "f").request];
        }
        return [];
    }
    getCategory() {
        return "Generic" /* IssueCategory.GENERIC */;
    }
    primaryKey() {
        const requestId = __classPrivateFieldGet(this, _GenericIssue_issueDetails, "f").request ? __classPrivateFieldGet(this, _GenericIssue_issueDetails, "f").request.requestId : 'no-request';
        return `${this.code()}-(${__classPrivateFieldGet(this, _GenericIssue_issueDetails, "f").frameId})-(${__classPrivateFieldGet(this, _GenericIssue_issueDetails, "f").violatingNodeId})-(${__classPrivateFieldGet(this, _GenericIssue_issueDetails, "f").violatingNodeAttribute})-(${requestId})`;
    }
    getDescription() {
        const description = issueDescriptions.get(__classPrivateFieldGet(this, _GenericIssue_issueDetails, "f").errorType);
        if (!description) {
            return null;
        }
        return resolveLazyDescription(description);
    }
    details() {
        return __classPrivateFieldGet(this, _GenericIssue_issueDetails, "f");
    }
    getKind() {
        return issueTypes.get(__classPrivateFieldGet(this, _GenericIssue_issueDetails, "f").errorType) || "Improvement" /* IssueKind.IMPROVEMENT */;
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const genericDetails = inspectorIssue.details.genericIssueDetails;
        if (!genericDetails) {
            console.warn('Generic issue without details received.');
            return [];
        }
        return [new GenericIssue(genericDetails, issuesModel, inspectorIssue.issueId)];
    }
}
_GenericIssue_issueDetails = new WeakMap();
export const genericFormLabelForNameError = {
    file: 'genericFormLabelForNameError.md',
    links: [{
            link: 'https://html.spec.whatwg.org/multipage/forms.html#attr-label-for',
            // Since the link points to a page with the same title, the 'HTML Standard'
            // string doesn't need to be translated.
            linkTitle: i18n.i18n.lockedLazyString('HTML Standard'),
        }],
};
export const genericFormInputWithNoLabelError = {
    file: 'genericFormInputWithNoLabelError.md',
    links: [],
};
export const genericFormAutocompleteAttributeEmptyError = {
    file: 'genericFormAutocompleteAttributeEmptyError.md',
    links: [],
};
export const genericFormDuplicateIdForInputError = {
    file: 'genericFormDuplicateIdForInputError.md',
    links: [{
            link: 'https://web.dev/learn/forms/autofill/#how-does-autofill-work',
            linkTitle: i18nLazyString(UIStrings.howDoesAutofillWorkPageTitle),
        }],
};
export const genericFormAriaLabelledByToNonExistingId = {
    file: 'genericFormAriaLabelledByToNonExistingId.md',
    links: [{
            link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label',
            linkTitle: i18nLazyString(UIStrings.labelFormlementsPageTitle),
        }],
};
export const genericFormEmptyIdAndNameAttributesForInputError = {
    file: 'genericFormEmptyIdAndNameAttributesForInputError.md',
    links: [{
            link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input',
            linkTitle: i18nLazyString(UIStrings.inputFormElementPageTitle),
        }],
};
export const genericFormInputAssignedAutocompleteValueToIdOrNameAttributeError = {
    file: 'genericFormInputAssignedAutocompleteValueToIdOrNameAttributeError.md',
    links: [{
            link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values',
            linkTitle: i18nLazyString(UIStrings.autocompleteAttributePageTitle),
        }],
};
export const genericFormInputHasWrongButWellIntendedAutocompleteValue = {
    file: 'genericFormInputHasWrongButWellIntendedAutocompleteValueError.md',
    links: [{
            link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values',
            linkTitle: i18nLazyString(UIStrings.autocompleteAttributePageTitle),
        }],
};
export const genericFormLabelForMatchesNonExistingIdError = {
    file: 'genericFormLabelForMatchesNonExistingIdError.md',
    links: [{
            link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label',
            linkTitle: i18nLazyString(UIStrings.labelFormlementsPageTitle),
        }],
};
export const genericFormLabelHasNeitherForNorNestedInput = {
    file: 'genericFormLabelHasNeitherForNorNestedInput.md',
    links: [{
            link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label',
            linkTitle: i18nLazyString(UIStrings.labelFormlementsPageTitle),
        }],
};
export const genericResponseWasBlockedbyORB = {
    file: 'genericResponseWasBlockedByORB.md',
    links: [{
            link: 'https://www.chromium.org/Home/chromium-security/corb-for-developers/',
            linkTitle: i18nLazyString(UIStrings.corbExplainerPageTitle),
        }],
};
const issueDescriptions = new Map([
    ["FormLabelForNameError" /* Protocol.Audits.GenericIssueErrorType.FormLabelForNameError */, genericFormLabelForNameError],
    ["FormInputWithNoLabelError" /* Protocol.Audits.GenericIssueErrorType.FormInputWithNoLabelError */, genericFormInputWithNoLabelError],
    [
        "FormAutocompleteAttributeEmptyError" /* Protocol.Audits.GenericIssueErrorType.FormAutocompleteAttributeEmptyError */,
        genericFormAutocompleteAttributeEmptyError,
    ],
    ["FormDuplicateIdForInputError" /* Protocol.Audits.GenericIssueErrorType.FormDuplicateIdForInputError */, genericFormDuplicateIdForInputError],
    ["FormAriaLabelledByToNonExistingId" /* Protocol.Audits.GenericIssueErrorType.FormAriaLabelledByToNonExistingId */, genericFormAriaLabelledByToNonExistingId],
    [
        "FormEmptyIdAndNameAttributesForInputError" /* Protocol.Audits.GenericIssueErrorType.FormEmptyIdAndNameAttributesForInputError */,
        genericFormEmptyIdAndNameAttributesForInputError,
    ],
    [
        "FormInputAssignedAutocompleteValueToIdOrNameAttributeError" /* Protocol.Audits.GenericIssueErrorType.FormInputAssignedAutocompleteValueToIdOrNameAttributeError */,
        genericFormInputAssignedAutocompleteValueToIdOrNameAttributeError,
    ],
    [
        "FormLabelForMatchesNonExistingIdError" /* Protocol.Audits.GenericIssueErrorType.FormLabelForMatchesNonExistingIdError */,
        genericFormLabelForMatchesNonExistingIdError,
    ],
    [
        "FormLabelHasNeitherForNorNestedInput" /* Protocol.Audits.GenericIssueErrorType.FormLabelHasNeitherForNorNestedInput */,
        genericFormLabelHasNeitherForNorNestedInput,
    ],
    [
        "FormInputHasWrongButWellIntendedAutocompleteValueError" /* Protocol.Audits.GenericIssueErrorType.FormInputHasWrongButWellIntendedAutocompleteValueError */,
        genericFormInputHasWrongButWellIntendedAutocompleteValue,
    ],
    [
        "ResponseWasBlockedByORB" /* Protocol.Audits.GenericIssueErrorType.ResponseWasBlockedByORB */,
        genericResponseWasBlockedbyORB,
    ],
]);
const issueTypes = new Map([
    ["FormLabelForNameError" /* Protocol.Audits.GenericIssueErrorType.FormLabelForNameError */, "PageError" /* IssueKind.PAGE_ERROR */],
    ["FormInputWithNoLabelError" /* Protocol.Audits.GenericIssueErrorType.FormInputWithNoLabelError */, "Improvement" /* IssueKind.IMPROVEMENT */],
    ["FormAutocompleteAttributeEmptyError" /* Protocol.Audits.GenericIssueErrorType.FormAutocompleteAttributeEmptyError */, "PageError" /* IssueKind.PAGE_ERROR */],
    ["FormDuplicateIdForInputError" /* Protocol.Audits.GenericIssueErrorType.FormDuplicateIdForInputError */, "PageError" /* IssueKind.PAGE_ERROR */],
    ["FormAriaLabelledByToNonExistingId" /* Protocol.Audits.GenericIssueErrorType.FormAriaLabelledByToNonExistingId */, "Improvement" /* IssueKind.IMPROVEMENT */],
    ["FormEmptyIdAndNameAttributesForInputError" /* Protocol.Audits.GenericIssueErrorType.FormEmptyIdAndNameAttributesForInputError */, "Improvement" /* IssueKind.IMPROVEMENT */],
    [
        "FormInputAssignedAutocompleteValueToIdOrNameAttributeError" /* Protocol.Audits.GenericIssueErrorType.FormInputAssignedAutocompleteValueToIdOrNameAttributeError */,
        "Improvement" /* IssueKind.IMPROVEMENT */,
    ],
    ["FormLabelForMatchesNonExistingIdError" /* Protocol.Audits.GenericIssueErrorType.FormLabelForMatchesNonExistingIdError */, "PageError" /* IssueKind.PAGE_ERROR */],
    ["FormLabelHasNeitherForNorNestedInput" /* Protocol.Audits.GenericIssueErrorType.FormLabelHasNeitherForNorNestedInput */, "Improvement" /* IssueKind.IMPROVEMENT */],
    ["FormInputHasWrongButWellIntendedAutocompleteValueError" /* Protocol.Audits.GenericIssueErrorType.FormInputHasWrongButWellIntendedAutocompleteValueError */, "Improvement" /* IssueKind.IMPROVEMENT */],
]);
//# sourceMappingURL=GenericIssue.js.map