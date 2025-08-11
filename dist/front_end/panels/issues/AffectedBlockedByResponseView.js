// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AffectedBlockedByResponseView_instances, _AffectedBlockedByResponseView_appendDetails, _AffectedBlockedByResponseView_appendDetail;
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as IssuesManager from '../../models/issues_manager/issues_manager.js';
import { AffectedResourcesView } from './AffectedResourcesView.js';
const UIStrings = {
    /**
     *@description Noun for singular or plural network requests. Label for the affected resources section in the issue view.
     */
    nRequests: '{n, plural, =1 {# request} other {# requests}}',
    /**
     *@description Noun for a singular network request. Label for a column in the affected resources table in the issue view.
     */
    requestC: 'Request',
    /**
     *@description Noun for a singular parent frame. Label for a column in the affected resources table in the issue view.
     */
    parentFrame: 'Parent Frame',
    /**
     *@description Noun for a singular resource that was blocked (an example for a blocked resource would be a frame). Label for a column in the affected resources table in the issue view.
     */
    blockedResource: 'Blocked Resource',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/AffectedBlockedByResponseView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AffectedBlockedByResponseView extends AffectedResourcesView {
    constructor() {
        super(...arguments);
        _AffectedBlockedByResponseView_instances.add(this);
    }
    getResourceNameWithCount(count) {
        return i18nString(UIStrings.nRequests, { n: count });
    }
    update() {
        this.clear();
        __classPrivateFieldGet(this, _AffectedBlockedByResponseView_instances, "m", _AffectedBlockedByResponseView_appendDetails).call(this, this.issue.getBlockedByResponseDetails());
    }
}
_AffectedBlockedByResponseView_instances = new WeakSet(), _AffectedBlockedByResponseView_appendDetails = function _AffectedBlockedByResponseView_appendDetails(details) {
    const header = document.createElement('tr');
    this.appendColumnTitle(header, i18nString(UIStrings.requestC));
    this.appendColumnTitle(header, i18nString(UIStrings.parentFrame));
    this.appendColumnTitle(header, i18nString(UIStrings.blockedResource));
    this.affectedResources.appendChild(header);
    let count = 0;
    for (const detail of details) {
        __classPrivateFieldGet(this, _AffectedBlockedByResponseView_instances, "m", _AffectedBlockedByResponseView_appendDetail).call(this, detail);
        count++;
    }
    this.updateAffectedResourceCount(count);
}, _AffectedBlockedByResponseView_appendDetail = function _AffectedBlockedByResponseView_appendDetail(details) {
    const element = document.createElement('tr');
    element.classList.add('affected-resource-row');
    const requestCell = this.createRequestCell(details.request, {
        additionalOnClickAction() {
            Host.userMetrics.issuesPanelResourceOpened("CrossOriginEmbedderPolicy" /* IssuesManager.Issue.IssueCategory.CROSS_ORIGIN_EMBEDDER_POLICY */, "Request" /* AffectedItem.REQUEST */);
        },
    });
    element.appendChild(requestCell);
    if (details.parentFrame) {
        const frameUrl = this.createFrameCell(details.parentFrame.frameId, this.issue.getCategory());
        element.appendChild(frameUrl);
    }
    else {
        element.appendChild(document.createElement('td'));
    }
    if (details.blockedFrame) {
        const frameUrl = this.createFrameCell(details.blockedFrame.frameId, this.issue.getCategory());
        element.appendChild(frameUrl);
    }
    else {
        element.appendChild(document.createElement('td'));
    }
    this.affectedResources.appendChild(element);
};
//# sourceMappingURL=AffectedBlockedByResponseView.js.map