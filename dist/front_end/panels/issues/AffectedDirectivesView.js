// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AffectedDirectivesView_instances, _AffectedDirectivesView_appendStatus, _AffectedDirectivesView_appendViolatedDirective, _AffectedDirectivesView_appendBlockedURL, _AffectedDirectivesView_appendBlockedElement, _AffectedDirectivesView_appendAffectedContentSecurityPolicyDetails, _AffectedDirectivesView_appendAffectedContentSecurityPolicyDetail;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as IssuesManager from '../../models/issues_manager/issues_manager.js';
import { AffectedResourcesView } from './AffectedResourcesView.js';
import * as IssuesComponents from './components/components.js';
const UIStrings = {
    /**
     *@description Singular or plural label for number of affected CSP (content security policy,
     * see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) directives in issue view.
     */
    nDirectives: '{n, plural, =1 {# directive} other {# directives}}',
    /**
     *@description Indicates that a CSP error should be treated as a warning
     */
    reportonly: 'report-only',
    /**
     *@description The kind of resolution for a mixed content issue
     */
    blocked: 'blocked',
    /**
     *@description Tooltip for button linking to the Elements panel
     */
    clickToRevealTheViolatingDomNode: 'Click to reveal the violating DOM node in the Elements panel',
    /**
     *@description Header for the section listing affected directives
     */
    directiveC: 'Directive',
    /**
     *@description Label for the column in the element list in the CSS overview report
     */
    element: 'Element',
    /**
     *@description Header for the source location column
     */
    sourceLocation: 'Source location',
    /**
     *@description Text for the status of something
     */
    status: 'Status',
    /**
     *@description Text that refers to the resources of the web page
     */
    resourceC: 'Resource',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/AffectedDirectivesView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AffectedDirectivesView extends AffectedResourcesView {
    constructor() {
        super(...arguments);
        _AffectedDirectivesView_instances.add(this);
    }
    getResourceNameWithCount(count) {
        return i18nString(UIStrings.nDirectives, { n: count });
    }
    update() {
        this.clear();
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendAffectedContentSecurityPolicyDetails).call(this, this.issue.getCspIssues());
    }
}
_AffectedDirectivesView_instances = new WeakSet(), _AffectedDirectivesView_appendStatus = function _AffectedDirectivesView_appendStatus(element, isReportOnly) {
    const status = document.createElement('td');
    if (isReportOnly) {
        status.classList.add('affected-resource-report-only-status');
        status.textContent = i18nString(UIStrings.reportonly);
    }
    else {
        status.classList.add('affected-resource-blocked-status');
        status.textContent = i18nString(UIStrings.blocked);
    }
    element.appendChild(status);
}, _AffectedDirectivesView_appendViolatedDirective = function _AffectedDirectivesView_appendViolatedDirective(element, directive) {
    const violatedDirective = document.createElement('td');
    violatedDirective.textContent = directive;
    element.appendChild(violatedDirective);
}, _AffectedDirectivesView_appendBlockedURL = function _AffectedDirectivesView_appendBlockedURL(element, url) {
    const info = document.createElement('td');
    info.classList.add('affected-resource-directive-info');
    info.textContent = url;
    element.appendChild(info);
}, _AffectedDirectivesView_appendBlockedElement = function _AffectedDirectivesView_appendBlockedElement(element, nodeId, model) {
    const elementsPanelLinkComponent = new IssuesComponents.ElementsPanelLink.ElementsPanelLink();
    if (nodeId) {
        const violatingNodeId = nodeId;
        elementsPanelLinkComponent.title = i18nString(UIStrings.clickToRevealTheViolatingDomNode);
        const onElementRevealIconClick = () => {
            const target = model.getTargetIfNotDisposed();
            if (target) {
                Host.userMetrics.issuesPanelResourceOpened(this.issue.getCategory(), "Element" /* AffectedItem.ELEMENT */);
                const deferredDOMNode = new SDK.DOMModel.DeferredDOMNode(target, violatingNodeId);
                void Common.Revealer.reveal(deferredDOMNode);
            }
        };
        const onElementRevealIconMouseEnter = () => {
            const target = model.getTargetIfNotDisposed();
            if (target) {
                const deferredDOMNode = new SDK.DOMModel.DeferredDOMNode(target, violatingNodeId);
                if (deferredDOMNode) {
                    deferredDOMNode.highlight();
                }
            }
        };
        const onElementRevealIconMouseLeave = () => {
            SDK.OverlayModel.OverlayModel.hideDOMNodeHighlight();
        };
        elementsPanelLinkComponent
            .data = { onElementRevealIconClick, onElementRevealIconMouseEnter, onElementRevealIconMouseLeave };
    }
    const violatingNode = document.createElement('td');
    violatingNode.classList.add('affected-resource-csp-info-node');
    violatingNode.appendChild(elementsPanelLinkComponent);
    element.appendChild(violatingNode);
}, _AffectedDirectivesView_appendAffectedContentSecurityPolicyDetails = function _AffectedDirectivesView_appendAffectedContentSecurityPolicyDetails(cspIssues) {
    const header = document.createElement('tr');
    if (this.issue.code() === IssuesManager.ContentSecurityPolicyIssue.inlineViolationCode) {
        this.appendColumnTitle(header, i18nString(UIStrings.directiveC));
        this.appendColumnTitle(header, i18nString(UIStrings.element));
        this.appendColumnTitle(header, i18nString(UIStrings.sourceLocation));
        this.appendColumnTitle(header, i18nString(UIStrings.status));
    }
    else if (this.issue.code() === IssuesManager.ContentSecurityPolicyIssue.urlViolationCode) {
        this.appendColumnTitle(header, i18nString(UIStrings.resourceC), 'affected-resource-directive-info-header');
        this.appendColumnTitle(header, i18nString(UIStrings.status));
        this.appendColumnTitle(header, i18nString(UIStrings.directiveC));
        this.appendColumnTitle(header, i18nString(UIStrings.sourceLocation));
    }
    else if (this.issue.code() === IssuesManager.ContentSecurityPolicyIssue.evalViolationCode) {
        this.appendColumnTitle(header, i18nString(UIStrings.sourceLocation));
        this.appendColumnTitle(header, i18nString(UIStrings.directiveC));
        this.appendColumnTitle(header, i18nString(UIStrings.status));
    }
    else if (this.issue.code() === IssuesManager.ContentSecurityPolicyIssue.trustedTypesSinkViolationCode) {
        this.appendColumnTitle(header, i18nString(UIStrings.sourceLocation));
        this.appendColumnTitle(header, i18nString(UIStrings.status));
    }
    else if (this.issue.code() === IssuesManager.ContentSecurityPolicyIssue.trustedTypesPolicyViolationCode) {
        this.appendColumnTitle(header, i18nString(UIStrings.sourceLocation));
        this.appendColumnTitle(header, i18nString(UIStrings.directiveC));
        this.appendColumnTitle(header, i18nString(UIStrings.status));
    }
    else {
        this.updateAffectedResourceCount(0);
        return;
    }
    this.affectedResources.appendChild(header);
    let count = 0;
    for (const cspIssue of cspIssues) {
        count++;
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendAffectedContentSecurityPolicyDetail).call(this, cspIssue);
    }
    this.updateAffectedResourceCount(count);
}, _AffectedDirectivesView_appendAffectedContentSecurityPolicyDetail = function _AffectedDirectivesView_appendAffectedContentSecurityPolicyDetail(cspIssue) {
    const element = document.createElement('tr');
    element.classList.add('affected-resource-directive');
    const cspIssueDetails = cspIssue.details();
    const location = IssuesManager.Issue.toZeroBasedLocation(cspIssueDetails.sourceCodeLocation);
    const model = cspIssue.model();
    const maybeTarget = cspIssue.model()?.getTargetIfNotDisposed();
    if (this.issue.code() === IssuesManager.ContentSecurityPolicyIssue.inlineViolationCode && model) {
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendViolatedDirective).call(this, element, cspIssueDetails.violatedDirective);
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendBlockedElement).call(this, element, cspIssueDetails.violatingNodeId, model);
        this.appendSourceLocation(element, location, maybeTarget);
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendStatus).call(this, element, cspIssueDetails.isReportOnly);
    }
    else if (this.issue.code() === IssuesManager.ContentSecurityPolicyIssue.urlViolationCode) {
        const url = cspIssueDetails.blockedURL ? cspIssueDetails.blockedURL :
            Platform.DevToolsPath.EmptyUrlString;
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendBlockedURL).call(this, element, url);
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendStatus).call(this, element, cspIssueDetails.isReportOnly);
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendViolatedDirective).call(this, element, cspIssueDetails.violatedDirective);
        this.appendSourceLocation(element, location, maybeTarget);
    }
    else if (this.issue.code() === IssuesManager.ContentSecurityPolicyIssue.evalViolationCode) {
        this.appendSourceLocation(element, location, maybeTarget);
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendViolatedDirective).call(this, element, cspIssueDetails.violatedDirective);
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendStatus).call(this, element, cspIssueDetails.isReportOnly);
    }
    else if (this.issue.code() === IssuesManager.ContentSecurityPolicyIssue.trustedTypesSinkViolationCode) {
        this.appendSourceLocation(element, location, maybeTarget);
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendStatus).call(this, element, cspIssueDetails.isReportOnly);
    }
    else if (this.issue.code() === IssuesManager.ContentSecurityPolicyIssue.trustedTypesPolicyViolationCode) {
        this.appendSourceLocation(element, location, maybeTarget);
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendViolatedDirective).call(this, element, cspIssueDetails.violatedDirective);
        __classPrivateFieldGet(this, _AffectedDirectivesView_instances, "m", _AffectedDirectivesView_appendStatus).call(this, element, cspIssueDetails.isReportOnly);
    }
    else {
        return;
    }
    this.affectedResources.appendChild(element);
};
//# sourceMappingURL=AffectedDirectivesView.js.map