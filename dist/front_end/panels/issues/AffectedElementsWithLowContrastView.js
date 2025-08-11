// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AffectedElementsWithLowContrastView_instances, _AffectedElementsWithLowContrastView_runningUpdatePromise, _AffectedElementsWithLowContrastView_doUpdate, _AffectedElementsWithLowContrastView_appendLowContrastElement, _AffectedElementsWithLowContrastView_appendLowContrastElements;
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import { AffectedElementsView } from './AffectedElementsView.js';
export class AffectedElementsWithLowContrastView extends AffectedElementsView {
    constructor() {
        super(...arguments);
        _AffectedElementsWithLowContrastView_instances.add(this);
        _AffectedElementsWithLowContrastView_runningUpdatePromise.set(this, Promise.resolve());
    }
    update() {
        // Ensure that doUpdate is invoked atomically by serializing the update calls
        // because it's not re-entrace safe.
        __classPrivateFieldSet(this, _AffectedElementsWithLowContrastView_runningUpdatePromise, __classPrivateFieldGet(this, _AffectedElementsWithLowContrastView_runningUpdatePromise, "f").then(__classPrivateFieldGet(this, _AffectedElementsWithLowContrastView_instances, "m", _AffectedElementsWithLowContrastView_doUpdate).bind(this)), "f");
    }
}
_AffectedElementsWithLowContrastView_runningUpdatePromise = new WeakMap(), _AffectedElementsWithLowContrastView_instances = new WeakSet(), _AffectedElementsWithLowContrastView_doUpdate = async function _AffectedElementsWithLowContrastView_doUpdate() {
    this.clear();
    await __classPrivateFieldGet(this, _AffectedElementsWithLowContrastView_instances, "m", _AffectedElementsWithLowContrastView_appendLowContrastElements).call(this, this.issue.getLowContrastIssues());
}, _AffectedElementsWithLowContrastView_appendLowContrastElement = async function _AffectedElementsWithLowContrastView_appendLowContrastElement(issue) {
    const row = document.createElement('tr');
    row.classList.add('affected-resource-low-contrast');
    const details = issue.details();
    const target = issue.model()?.target() || null;
    row.appendChild(await this.createElementCell({ nodeName: details.violatingNodeSelector, backendNodeId: details.violatingNodeId, target }, issue.getCategory()));
    this.appendIssueDetailCell(row, String(Platform.NumberUtilities.floor(details.contrastRatio, 2)));
    this.appendIssueDetailCell(row, String(details.thresholdAA));
    this.appendIssueDetailCell(row, String(details.thresholdAAA));
    this.appendIssueDetailCell(row, details.fontSize);
    this.appendIssueDetailCell(row, details.fontWeight);
    this.affectedResources.appendChild(row);
}, _AffectedElementsWithLowContrastView_appendLowContrastElements = async function _AffectedElementsWithLowContrastView_appendLowContrastElements(issues) {
    const header = document.createElement('tr');
    this.appendColumnTitle(header, i18nString(UIStrings.element));
    this.appendColumnTitle(header, i18nString(UIStrings.contrastRatio));
    this.appendColumnTitle(header, i18nString(UIStrings.minimumAA));
    this.appendColumnTitle(header, i18nString(UIStrings.minimumAAA));
    this.appendColumnTitle(header, i18nString(UIStrings.textSize));
    this.appendColumnTitle(header, i18nString(UIStrings.textWeight));
    this.affectedResources.appendChild(header);
    let count = 0;
    for (const lowContrastIssue of issues) {
        count++;
        await __classPrivateFieldGet(this, _AffectedElementsWithLowContrastView_instances, "m", _AffectedElementsWithLowContrastView_appendLowContrastElement).call(this, lowContrastIssue);
    }
    this.updateAffectedResourceCount(count);
};
const UIStrings = {
    /**
     *@description Column title for the element column in the low contrast issue view
     */
    element: 'Element',
    /**
     *@description Column title for the contrast ratio column in the low contrast issue view
     */
    contrastRatio: 'Contrast ratio',
    /**
     *@description Column title for the minimum AA contrast ratio column in the low contrast issue view
     */
    minimumAA: 'Minimum AA ratio',
    /**
     *@description Column title for the minimum AAA contrast ratio column in the low contrast issue view
     */
    minimumAAA: 'Minimum AAA ratio',
    /**
     *@description Column title for the text size column in the low contrast issue view
     */
    textSize: 'Text size',
    /**
     *@description Column title for the text weight column in the low contrast issue view
     */
    textWeight: 'Text weight',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/AffectedElementsWithLowContrastView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
//# sourceMappingURL=AffectedElementsWithLowContrastView.js.map