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
var _AffectedDocumentsInQuirksModeView_instances, _AffectedDocumentsInQuirksModeView_runningUpdatePromise, _AffectedDocumentsInQuirksModeView_doUpdate, _AffectedDocumentsInQuirksModeView_appendQuirksModeDocument, _AffectedDocumentsInQuirksModeView_appendQuirksModeDocuments;
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import { AffectedElementsView } from './AffectedElementsView.js';
const UIStrings = {
    /**
     *@description Noun for singular or plural number of affected document nodes indication in issue view.
     */
    nDocuments: '{n, plural, =1 { document} other { documents}}',
    /**
     *@description Column title for the Document in the DOM tree column in the quirks mode issue view
     */
    documentInTheDOMTree: 'Document in the DOM tree',
    /**
     *@description Column title for the url column in the quirks mode issue view
     */
    url: 'URL',
    /**
     *@description Column title for the Mode column in the quirks mode issue view
     */
    mode: 'Mode',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/AffectedDocumentsInQuirksModeView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AffectedDocumentsInQuirksModeView extends AffectedElementsView {
    constructor() {
        super(...arguments);
        _AffectedDocumentsInQuirksModeView_instances.add(this);
        _AffectedDocumentsInQuirksModeView_runningUpdatePromise.set(this, Promise.resolve());
    }
    update() {
        // Ensure that doUpdate is invoked atomically by serializing the update calls
        // because it's not re-entrace safe.
        __classPrivateFieldSet(this, _AffectedDocumentsInQuirksModeView_runningUpdatePromise, __classPrivateFieldGet(this, _AffectedDocumentsInQuirksModeView_runningUpdatePromise, "f").then(__classPrivateFieldGet(this, _AffectedDocumentsInQuirksModeView_instances, "m", _AffectedDocumentsInQuirksModeView_doUpdate).bind(this)), "f");
    }
    getResourceName(count) {
        return i18nString(UIStrings.nDocuments, { n: count });
    }
}
_AffectedDocumentsInQuirksModeView_runningUpdatePromise = new WeakMap(), _AffectedDocumentsInQuirksModeView_instances = new WeakSet(), _AffectedDocumentsInQuirksModeView_doUpdate = async function _AffectedDocumentsInQuirksModeView_doUpdate() {
    this.clear();
    await __classPrivateFieldGet(this, _AffectedDocumentsInQuirksModeView_instances, "m", _AffectedDocumentsInQuirksModeView_appendQuirksModeDocuments).call(this, this.issue.getQuirksModeIssues());
}, _AffectedDocumentsInQuirksModeView_appendQuirksModeDocument = async function _AffectedDocumentsInQuirksModeView_appendQuirksModeDocument(issue) {
    const row = document.createElement('tr');
    row.classList.add('affected-resource-quirks-mode');
    const details = issue.details();
    const target = SDK.FrameManager.FrameManager.instance().getFrame(details.frameId)?.resourceTreeModel().target() || null;
    row.appendChild(await this.createElementCell({ nodeName: 'document', backendNodeId: details.documentNodeId, target }, issue.getCategory()));
    this.appendIssueDetailCell(row, details.isLimitedQuirksMode ? 'Limited Quirks Mode' : 'Quirks Mode');
    this.appendIssueDetailCell(row, details.url);
    this.affectedResources.appendChild(row);
}, _AffectedDocumentsInQuirksModeView_appendQuirksModeDocuments = async function _AffectedDocumentsInQuirksModeView_appendQuirksModeDocuments(issues) {
    const header = document.createElement('tr');
    this.appendColumnTitle(header, i18nString(UIStrings.documentInTheDOMTree));
    this.appendColumnTitle(header, i18nString(UIStrings.mode));
    this.appendColumnTitle(header, i18nString(UIStrings.url));
    this.affectedResources.appendChild(header);
    let count = 0;
    for (const issue of issues) {
        count++;
        await __classPrivateFieldGet(this, _AffectedDocumentsInQuirksModeView_instances, "m", _AffectedDocumentsInQuirksModeView_appendQuirksModeDocument).call(this, issue);
    }
    this.updateAffectedResourceCount(count);
};
//# sourceMappingURL=AffectedDocumentsInQuirksModeView.js.map