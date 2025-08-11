// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AffectedSharedArrayBufferIssueDetailsView_instances, _AffectedSharedArrayBufferIssueDetailsView_appendStatus, _AffectedSharedArrayBufferIssueDetailsView_appendType, _AffectedSharedArrayBufferIssueDetailsView_appendDetails, _AffectedSharedArrayBufferIssueDetailsView_appendDetail;
import * as i18n from '../../core/i18n/i18n.js';
import * as IssuesManager from '../../models/issues_manager/issues_manager.js';
import { AffectedResourcesView } from './AffectedResourcesView.js';
const UIStrings = {
    /**
     *@description Label for number of affected resources indication in issue view
     */
    nViolations: '{n, plural, =1 {# violation} other {# violations}}',
    /**
     *@description Value for the status column in SharedArrayBuffer issues
     */
    warning: 'warning',
    /**
     *@description The kind of resolution for a mixed content issue
     */
    blocked: 'blocked',
    /**
     *@description Value for the 'Trigger' column in the SAB affected resources list
     */
    instantiation: 'Instantiation',
    /**
     *@description Tooltip for the 'Trigger' column in the SAB affected resources list
     */
    aSharedarraybufferWas: 'A `SharedArrayBuffer` was instantiated in a context that is not cross-origin isolated',
    /**
     *@description Value for the 'Trigger' column in the SAB affected resources list
     */
    transfer: 'Transfer',
    /**
     *@description Tooltip for the 'Trigger' column in the SAB affected resources list
     */
    sharedarraybufferWasTransferedTo: '`SharedArrayBuffer` was transfered to a context that is not cross-origin isolated',
    /**
     *@description Header for the source location column
     */
    sourceLocation: 'Source Location',
    /**
     *@description Title for the 'Trigger' column in the SAB affected resources list
     */
    trigger: 'Trigger',
    /**
     *@description Title for the status column in the SAB affected resources list
     */
    status: 'Status',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/AffectedSharedArrayBufferIssueDetailsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AffectedSharedArrayBufferIssueDetailsView extends AffectedResourcesView {
    constructor() {
        super(...arguments);
        _AffectedSharedArrayBufferIssueDetailsView_instances.add(this);
    }
    getResourceNameWithCount(count) {
        return i18nString(UIStrings.nViolations, { n: count });
    }
    update() {
        this.clear();
        __classPrivateFieldGet(this, _AffectedSharedArrayBufferIssueDetailsView_instances, "m", _AffectedSharedArrayBufferIssueDetailsView_appendDetails).call(this, this.issue.getSharedArrayBufferIssues());
    }
}
_AffectedSharedArrayBufferIssueDetailsView_instances = new WeakSet(), _AffectedSharedArrayBufferIssueDetailsView_appendStatus = function _AffectedSharedArrayBufferIssueDetailsView_appendStatus(element, isWarning) {
    const status = document.createElement('td');
    if (isWarning) {
        status.classList.add('affected-resource-report-only-status');
        status.textContent = i18nString(UIStrings.warning);
    }
    else {
        status.classList.add('affected-resource-blocked-status');
        status.textContent = i18nString(UIStrings.blocked);
    }
    element.appendChild(status);
}, _AffectedSharedArrayBufferIssueDetailsView_appendType = function _AffectedSharedArrayBufferIssueDetailsView_appendType(element, type) {
    const status = document.createElement('td');
    switch (type) {
        case "CreationIssue" /* Protocol.Audits.SharedArrayBufferIssueType.CreationIssue */:
            status.textContent = i18nString(UIStrings.instantiation);
            status.title = i18nString(UIStrings.aSharedarraybufferWas);
            break;
        case "TransferIssue" /* Protocol.Audits.SharedArrayBufferIssueType.TransferIssue */:
            status.textContent = i18nString(UIStrings.transfer);
            status.title = i18nString(UIStrings.sharedarraybufferWasTransferedTo);
            break;
    }
    element.appendChild(status);
}, _AffectedSharedArrayBufferIssueDetailsView_appendDetails = function _AffectedSharedArrayBufferIssueDetailsView_appendDetails(sabIssues) {
    const header = document.createElement('tr');
    this.appendColumnTitle(header, i18nString(UIStrings.sourceLocation));
    this.appendColumnTitle(header, i18nString(UIStrings.trigger));
    this.appendColumnTitle(header, i18nString(UIStrings.status));
    this.affectedResources.appendChild(header);
    let count = 0;
    for (const sabIssue of sabIssues) {
        count++;
        __classPrivateFieldGet(this, _AffectedSharedArrayBufferIssueDetailsView_instances, "m", _AffectedSharedArrayBufferIssueDetailsView_appendDetail).call(this, sabIssue);
    }
    this.updateAffectedResourceCount(count);
}, _AffectedSharedArrayBufferIssueDetailsView_appendDetail = function _AffectedSharedArrayBufferIssueDetailsView_appendDetail(sabIssue) {
    const element = document.createElement('tr');
    element.classList.add('affected-resource-directive');
    const sabIssueDetails = sabIssue.details();
    const location = IssuesManager.Issue.toZeroBasedLocation(sabIssueDetails.sourceCodeLocation);
    this.appendSourceLocation(element, location, sabIssue.model()?.getTargetIfNotDisposed());
    __classPrivateFieldGet(this, _AffectedSharedArrayBufferIssueDetailsView_instances, "m", _AffectedSharedArrayBufferIssueDetailsView_appendType).call(this, element, sabIssueDetails.type);
    __classPrivateFieldGet(this, _AffectedSharedArrayBufferIssueDetailsView_instances, "m", _AffectedSharedArrayBufferIssueDetailsView_appendStatus).call(this, element, sabIssueDetails.isWarning);
    this.affectedResources.appendChild(element);
};
//# sourceMappingURL=AffectedSharedArrayBufferIssueDetailsView.js.map