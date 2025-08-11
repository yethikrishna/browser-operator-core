// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _AffectedRequestsView_instances, _AffectedRequestsView_appendAffectedRequests, _AffectedMixedContentView_instances, _AffectedMixedContentView_appendAffectedMixedContentDetails, _IssueView_instances, _IssueView_issue, _IssueView_description, _IssueView_affectedResourceViews, _IssueView_aggregatedIssuesCount, _IssueView_issueKindIcon, _IssueView_hasBeenExpandedBefore, _IssueView_throttle, _IssueView_needsUpdateOnExpand, _IssueView_hiddenIssuesMenu, _IssueView_contentCreated, _IssueView_updateAffectedResourcesPositionAndSize, _IssueView_appendHeader, _IssueView_updateFromIssue, _IssueView_createAffectedResources, _IssueView_createBody, _IssueView_createReadMoreLinks, _IssueView_doUpdate;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as IssuesManager from '../../models/issues_manager/issues_manager.js';
import * as NetworkForward from '../../panels/network/forward/forward.js';
import * as Adorners from '../../ui/components/adorners/adorners.js';
import * as IconButton from '../../ui/components/icon_button/icon_button.js';
import * as IssueCounter from '../../ui/components/issue_counter/issue_counter.js';
import * as MarkdownView from '../../ui/components/markdown_view/markdown_view.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { AffectedBlockedByResponseView } from './AffectedBlockedByResponseView.js';
import { AffectedCookiesView, AffectedRawCookieLinesView } from './AffectedCookiesView.js';
import { AffectedDescendantsWithinSelectElementView } from './AffectedDescendantsWithinSelectElementView.js';
import { AffectedDirectivesView } from './AffectedDirectivesView.js';
import { AffectedDocumentsInQuirksModeView } from './AffectedDocumentsInQuirksModeView.js';
import { AffectedElementsView } from './AffectedElementsView.js';
import { AffectedElementsWithLowContrastView } from './AffectedElementsWithLowContrastView.js';
import { AffectedHeavyAdView } from './AffectedHeavyAdView.js';
import { AffectedMetadataAllowedSitesView } from './AffectedMetadataAllowedSitesView.js';
import { AffectedPartitioningBlobURLView } from './AffectedPartitioningBlobURLView.js';
import { AffectedResourcesView, extractShortPath } from './AffectedResourcesView.js';
import { AffectedSharedArrayBufferIssueDetailsView } from './AffectedSharedArrayBufferIssueDetailsView.js';
import { AffectedSourcesView } from './AffectedSourcesView.js';
import { AffectedTrackingSitesView } from './AffectedTrackingSitesView.js';
import { AttributionReportingIssueDetailsView } from './AttributionReportingIssueDetailsView.js';
import * as Components from './components/components.js';
import { CorsIssueDetailsView } from './CorsIssueDetailsView.js';
import { GenericIssueDetailsView } from './GenericIssueDetailsView.js';
const UIStrings = {
    /**
     *@description Noun, singular. Label for a column or field containing the name of an entity.
     */
    name: 'Name',
    /**
     *@description The kind of resolution for a mixed content issue
     */
    blocked: 'blocked',
    /**
     *@description Label for a type of issue that can appear in the Issues view. Noun for singular or plural number of network requests.
     */
    nRequests: '{n, plural, =1 {# request} other {# requests}}',
    /**
     *@description Label for singular or plural number of affected resources in issue view
     */
    nResources: '{n, plural, =1 {# resource} other {# resources}}',
    /**
     *@description Label for mixed content issue's restriction status
     */
    restrictionStatus: 'Restriction Status',
    /**
     * @description When there is a Heavy Ad, the browser can choose to deal with it in different ways.
     * This string indicates that the ad was only warned, and not removed.
     */
    warned: 'Warned',
    /**
     *@description Header for the section listing affected resources
     */
    affectedResources: 'Affected Resources',
    /**
     *@description Title for a link to further information in issue view
     *@example {SameSite Cookies Explained} PH1
     */
    learnMoreS: 'Learn more: {PH1}',
    /**
     *@description The kind of resolution for a mixed content issue
     */
    automaticallyUpgraded: 'automatically upgraded',
    /**
     *@description Menu entry for hiding a particular issue, in the Hide Issues context menu.
     */
    hideIssuesLikeThis: 'Hide issues like this',
    /**
     *@description Menu entry for unhiding a particular issue, in the Hide Issues context menu.
     */
    unhideIssuesLikeThis: 'Unhide issues like this',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/IssueView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
class AffectedRequestsView extends AffectedResourcesView {
    constructor() {
        super(...arguments);
        _AffectedRequestsView_instances.add(this);
    }
    getResourceNameWithCount(count) {
        return i18nString(UIStrings.nRequests, { n: count });
    }
    update() {
        this.clear();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const unused of this.issue.getBlockedByResponseDetails()) {
            // If the issue has blockedByResponseDetails, the corresponding AffectedBlockedByResponseView
            // will take care of displaying the request.
            this.updateAffectedResourceCount(0);
            return;
        }
        if (this.issue.getCategory() === "MixedContent" /* IssuesManager.Issue.IssueCategory.MIXED_CONTENT */) {
            // The AffectedMixedContentView takes care of displaying the resources.
            this.updateAffectedResourceCount(0);
            return;
        }
        __classPrivateFieldGet(this, _AffectedRequestsView_instances, "m", _AffectedRequestsView_appendAffectedRequests).call(this, this.issue.requests());
    }
}
_AffectedRequestsView_instances = new WeakSet(), _AffectedRequestsView_appendAffectedRequests = function _AffectedRequestsView_appendAffectedRequests(affectedRequests) {
    let count = 0;
    for (const affectedRequest of affectedRequests) {
        const element = document.createElement('tr');
        element.classList.add('affected-resource-request');
        const category = this.issue.getCategory();
        const tab = issueTypeToNetworkHeaderMap.get(category) || "headers-component" /* NetworkForward.UIRequestLocation.UIRequestTabs.HEADERS_COMPONENT */;
        element.appendChild(this.createRequestCell(affectedRequest, {
            networkTab: tab,
            additionalOnClickAction() {
                Host.userMetrics.issuesPanelResourceOpened(category, "Request" /* AffectedItem.REQUEST */);
            },
        }));
        this.affectedResources.appendChild(element);
        count++;
    }
    this.updateAffectedResourceCount(count);
};
const issueTypeToNetworkHeaderMap = new Map([
    [
        "Cookie" /* IssuesManager.Issue.IssueCategory.COOKIE */,
        "cookies" /* NetworkForward.UIRequestLocation.UIRequestTabs.COOKIES */,
    ],
    [
        "CrossOriginEmbedderPolicy" /* IssuesManager.Issue.IssueCategory.CROSS_ORIGIN_EMBEDDER_POLICY */,
        "headers-component" /* NetworkForward.UIRequestLocation.UIRequestTabs.HEADERS_COMPONENT */,
    ],
    [
        "MixedContent" /* IssuesManager.Issue.IssueCategory.MIXED_CONTENT */,
        "headers-component" /* NetworkForward.UIRequestLocation.UIRequestTabs.HEADERS_COMPONENT */,
    ],
]);
class AffectedMixedContentView extends AffectedResourcesView {
    constructor() {
        super(...arguments);
        _AffectedMixedContentView_instances.add(this);
    }
    getResourceNameWithCount(count) {
        return i18nString(UIStrings.nResources, { n: count });
    }
    appendAffectedMixedContent(mixedContent) {
        const element = document.createElement('tr');
        element.classList.add('affected-resource-mixed-content');
        if (mixedContent.request) {
            const networkTab = issueTypeToNetworkHeaderMap.get(this.issue.getCategory()) ||
                "headers-component" /* NetworkForward.UIRequestLocation.UIRequestTabs.HEADERS_COMPONENT */;
            element.appendChild(this.createRequestCell(mixedContent.request, {
                networkTab,
                additionalOnClickAction() {
                    Host.userMetrics.issuesPanelResourceOpened("MixedContent" /* IssuesManager.Issue.IssueCategory.MIXED_CONTENT */, "Request" /* AffectedItem.REQUEST */);
                },
            }));
        }
        else {
            const filename = extractShortPath(mixedContent.insecureURL);
            const cell = this.appendIssueDetailCell(element, filename, 'affected-resource-mixed-content-info');
            cell.title = mixedContent.insecureURL;
        }
        this.appendIssueDetailCell(element, AffectedMixedContentView.translateStatus(mixedContent.resolutionStatus), 'affected-resource-mixed-content-info');
        this.affectedResources.appendChild(element);
    }
    static translateStatus(resolutionStatus) {
        switch (resolutionStatus) {
            case "MixedContentBlocked" /* Protocol.Audits.MixedContentResolutionStatus.MixedContentBlocked */:
                return i18nString(UIStrings.blocked);
            case "MixedContentAutomaticallyUpgraded" /* Protocol.Audits.MixedContentResolutionStatus.MixedContentAutomaticallyUpgraded */:
                return i18nString(UIStrings.automaticallyUpgraded);
            case "MixedContentWarning" /* Protocol.Audits.MixedContentResolutionStatus.MixedContentWarning */:
                return i18nString(UIStrings.warned);
        }
    }
    update() {
        this.clear();
        __classPrivateFieldGet(this, _AffectedMixedContentView_instances, "m", _AffectedMixedContentView_appendAffectedMixedContentDetails).call(this, this.issue.getMixedContentIssues());
    }
}
_AffectedMixedContentView_instances = new WeakSet(), _AffectedMixedContentView_appendAffectedMixedContentDetails = function _AffectedMixedContentView_appendAffectedMixedContentDetails(mixedContentIssues) {
    const header = document.createElement('tr');
    this.appendColumnTitle(header, i18nString(UIStrings.name));
    this.appendColumnTitle(header, i18nString(UIStrings.restrictionStatus));
    this.affectedResources.appendChild(header);
    let count = 0;
    for (const issue of mixedContentIssues) {
        const details = issue.getDetails();
        this.appendAffectedMixedContent(details);
        count++;
    }
    this.updateAffectedResourceCount(count);
};
export class IssueView extends UI.TreeOutline.TreeElement {
    constructor(issue, description) {
        super();
        _IssueView_instances.add(this);
        _IssueView_issue.set(this, void 0);
        _IssueView_description.set(this, void 0);
        _IssueView_affectedResourceViews.set(this, void 0);
        _IssueView_aggregatedIssuesCount.set(this, void 0);
        _IssueView_issueKindIcon.set(this, null);
        _IssueView_hasBeenExpandedBefore.set(this, void 0);
        _IssueView_throttle.set(this, void 0);
        _IssueView_needsUpdateOnExpand.set(this, true);
        _IssueView_hiddenIssuesMenu.set(this, void 0);
        _IssueView_contentCreated.set(this, false);
        __classPrivateFieldSet(this, _IssueView_issue, issue, "f");
        __classPrivateFieldSet(this, _IssueView_description, description, "f");
        __classPrivateFieldSet(this, _IssueView_throttle, new Common.Throttler.Throttler(250), "f");
        this.toggleOnClick = true;
        this.listItemElement.classList.add('issue');
        this.childrenListElement.classList.add('issue-body');
        this.childrenListElement.classList.add(IssueView.getBodyCSSClass(__classPrivateFieldGet(this, _IssueView_issue, "f").getKind()));
        this.affectedResources = __classPrivateFieldGet(this, _IssueView_instances, "m", _IssueView_createAffectedResources).call(this);
        __classPrivateFieldSet(this, _IssueView_affectedResourceViews, [
            new AffectedCookiesView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'affected-cookies'),
            new AffectedElementsView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'affected-elements'),
            new AffectedRequestsView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'affected-requests'),
            new AffectedMixedContentView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'mixed-content-details'),
            new AffectedSourcesView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'affected-sources'),
            new AffectedHeavyAdView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'heavy-ad-details'),
            new AffectedDirectivesView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'directives-details'),
            new AffectedBlockedByResponseView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'blocked-by-response-details'),
            new AffectedSharedArrayBufferIssueDetailsView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'sab-details'),
            new AffectedElementsWithLowContrastView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'low-contrast-details'),
            new CorsIssueDetailsView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'cors-details'),
            new GenericIssueDetailsView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'generic-details'),
            new AffectedDocumentsInQuirksModeView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'affected-documents'),
            new AttributionReportingIssueDetailsView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'attribution-reporting-details'),
            new AffectedRawCookieLinesView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'affected-raw-cookies'),
            new AffectedTrackingSitesView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'tracking-sites-details'),
            new AffectedMetadataAllowedSitesView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'metadata-allowed-sites-details'),
            new AffectedDescendantsWithinSelectElementView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'disallowed-select-descendants-details'),
            new AffectedPartitioningBlobURLView(this, __classPrivateFieldGet(this, _IssueView_issue, "f"), 'partitioning-blob-url-details'),
        ], "f");
        __classPrivateFieldSet(this, _IssueView_hiddenIssuesMenu, new Components.HideIssuesMenu.HideIssuesMenu(), "f");
        __classPrivateFieldSet(this, _IssueView_aggregatedIssuesCount, null, "f");
        __classPrivateFieldSet(this, _IssueView_hasBeenExpandedBefore, false, "f");
    }
    /**
     * Sets the issue to take the resources from. Assumes that the description
     * this IssueView was initialized with fits the new issue as well, i.e.
     * title and issue description will not be updated.
     */
    setIssue(issue) {
        if (__classPrivateFieldGet(this, _IssueView_issue, "f") !== issue) {
            __classPrivateFieldSet(this, _IssueView_needsUpdateOnExpand, true, "f");
        }
        __classPrivateFieldSet(this, _IssueView_issue, issue, "f");
        __classPrivateFieldGet(this, _IssueView_affectedResourceViews, "f").forEach(view => view.setIssue(issue));
    }
    static getBodyCSSClass(issueKind) {
        switch (issueKind) {
            case "BreakingChange" /* IssuesManager.Issue.IssueKind.BREAKING_CHANGE */:
                return 'issue-kind-breaking-change';
            case "PageError" /* IssuesManager.Issue.IssueKind.PAGE_ERROR */:
                return 'issue-kind-page-error';
            case "Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */:
                return 'issue-kind-improvement';
        }
    }
    getIssueTitle() {
        return __classPrivateFieldGet(this, _IssueView_description, "f").title;
    }
    onattach() {
        if (!__classPrivateFieldGet(this, _IssueView_contentCreated, "f")) {
            this.createContent();
            return;
        }
        this.update();
    }
    createContent() {
        __classPrivateFieldGet(this, _IssueView_instances, "m", _IssueView_appendHeader).call(this);
        __classPrivateFieldGet(this, _IssueView_instances, "m", _IssueView_createBody).call(this);
        this.appendChild(this.affectedResources);
        const visibleAffectedResource = [];
        for (const view of __classPrivateFieldGet(this, _IssueView_affectedResourceViews, "f")) {
            this.appendAffectedResource(view);
            view.update();
            if (!view.isEmpty()) {
                visibleAffectedResource.push(view);
            }
        }
        __classPrivateFieldGet(this, _IssueView_instances, "m", _IssueView_updateAffectedResourcesPositionAndSize).call(this, visibleAffectedResource);
        __classPrivateFieldGet(this, _IssueView_instances, "m", _IssueView_createReadMoreLinks).call(this);
        this.updateAffectedResourceVisibility();
        __classPrivateFieldSet(this, _IssueView_contentCreated, true, "f");
    }
    appendAffectedResource(resource) {
        this.affectedResources.appendChild(resource);
    }
    onexpand() {
        const category = __classPrivateFieldGet(this, _IssueView_issue, "f").getCategory();
        // Handle sub type for cookie issues.
        if (category === "Cookie" /* IssuesManager.Issue.IssueCategory.COOKIE */) {
            const cookieIssueSubCategory = IssuesManager.CookieIssue.CookieIssue.getSubCategory(__classPrivateFieldGet(this, _IssueView_issue, "f").code());
            Host.userMetrics.issuesPanelIssueExpanded(cookieIssueSubCategory);
        }
        else {
            Host.userMetrics.issuesPanelIssueExpanded(category);
        }
        if (__classPrivateFieldGet(this, _IssueView_needsUpdateOnExpand, "f")) {
            __classPrivateFieldGet(this, _IssueView_instances, "m", _IssueView_doUpdate).call(this);
        }
        if (!__classPrivateFieldGet(this, _IssueView_hasBeenExpandedBefore, "f")) {
            __classPrivateFieldSet(this, _IssueView_hasBeenExpandedBefore, true, "f");
            for (const view of __classPrivateFieldGet(this, _IssueView_affectedResourceViews, "f")) {
                view.expandIfOneResource();
            }
        }
    }
    updateAffectedResourceVisibility() {
        const noResources = __classPrivateFieldGet(this, _IssueView_affectedResourceViews, "f").every(view => view.isEmpty());
        this.affectedResources.hidden = noResources;
    }
    update() {
        void __classPrivateFieldGet(this, _IssueView_throttle, "f").schedule(async () => __classPrivateFieldGet(this, _IssueView_instances, "m", _IssueView_doUpdate).call(this));
    }
    clear() {
        __classPrivateFieldGet(this, _IssueView_affectedResourceViews, "f").forEach(view => view.clear());
    }
    getIssueKind() {
        return __classPrivateFieldGet(this, _IssueView_issue, "f").getKind();
    }
    isForHiddenIssue() {
        return __classPrivateFieldGet(this, _IssueView_issue, "f").isHidden();
    }
    toggle(expand) {
        if (expand || (expand === undefined && !this.expanded)) {
            this.expand();
        }
        else {
            this.collapse();
        }
    }
}
_IssueView_issue = new WeakMap(), _IssueView_description = new WeakMap(), _IssueView_affectedResourceViews = new WeakMap(), _IssueView_aggregatedIssuesCount = new WeakMap(), _IssueView_issueKindIcon = new WeakMap(), _IssueView_hasBeenExpandedBefore = new WeakMap(), _IssueView_throttle = new WeakMap(), _IssueView_needsUpdateOnExpand = new WeakMap(), _IssueView_hiddenIssuesMenu = new WeakMap(), _IssueView_contentCreated = new WeakMap(), _IssueView_instances = new WeakSet(), _IssueView_updateAffectedResourcesPositionAndSize = function _IssueView_updateAffectedResourcesPositionAndSize(visibleAffectedResource) {
    for (let i = 0; i < visibleAffectedResource.length; i++) {
        const element = visibleAffectedResource[i].listItemElement;
        UI.ARIAUtils.setPositionInSet(element, i + 1);
        UI.ARIAUtils.setSetSize(element, visibleAffectedResource.length);
    }
}, _IssueView_appendHeader = function _IssueView_appendHeader() {
    const header = document.createElement('div');
    header.classList.add('header');
    __classPrivateFieldSet(this, _IssueView_issueKindIcon, new IconButton.Icon.Icon(), "f");
    __classPrivateFieldGet(this, _IssueView_issueKindIcon, "f").classList.add('leading-issue-icon');
    __classPrivateFieldSet(this, _IssueView_aggregatedIssuesCount, document.createElement('span'), "f");
    const countAdorner = new Adorners.Adorner.Adorner();
    countAdorner.data = {
        name: 'countWrapper',
        content: __classPrivateFieldGet(this, _IssueView_aggregatedIssuesCount, "f"),
    };
    countAdorner.classList.add('aggregated-issues-count');
    header.appendChild(__classPrivateFieldGet(this, _IssueView_issueKindIcon, "f"));
    header.appendChild(countAdorner);
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = __classPrivateFieldGet(this, _IssueView_description, "f").title;
    header.appendChild(title);
    if (__classPrivateFieldGet(this, _IssueView_hiddenIssuesMenu, "f")) {
        header.appendChild(__classPrivateFieldGet(this, _IssueView_hiddenIssuesMenu, "f"));
    }
    __classPrivateFieldGet(this, _IssueView_instances, "m", _IssueView_updateFromIssue).call(this);
    this.listItemElement.appendChild(header);
}, _IssueView_updateFromIssue = function _IssueView_updateFromIssue() {
    if (__classPrivateFieldGet(this, _IssueView_issueKindIcon, "f")) {
        const kind = __classPrivateFieldGet(this, _IssueView_issue, "f").getKind();
        __classPrivateFieldGet(this, _IssueView_issueKindIcon, "f").data = IssueCounter.IssueCounter.getIssueKindIconData(kind);
        __classPrivateFieldGet(this, _IssueView_issueKindIcon, "f").title = IssuesManager.Issue.getIssueKindDescription(kind);
    }
    if (__classPrivateFieldGet(this, _IssueView_aggregatedIssuesCount, "f")) {
        __classPrivateFieldGet(this, _IssueView_aggregatedIssuesCount, "f").textContent = `${__classPrivateFieldGet(this, _IssueView_issue, "f").getAggregatedIssuesCount()}`;
    }
    this.listItemElement.classList.toggle('hidden-issue', __classPrivateFieldGet(this, _IssueView_issue, "f").isHidden());
    if (__classPrivateFieldGet(this, _IssueView_hiddenIssuesMenu, "f")) {
        const data = {
            menuItemLabel: __classPrivateFieldGet(this, _IssueView_issue, "f").isHidden() ? i18nString(UIStrings.unhideIssuesLikeThis) :
                i18nString(UIStrings.hideIssuesLikeThis),
            menuItemAction: () => {
                const setting = IssuesManager.IssuesManager.getHideIssueByCodeSetting();
                const values = setting.get();
                values[__classPrivateFieldGet(this, _IssueView_issue, "f").code()] = __classPrivateFieldGet(this, _IssueView_issue, "f").isHidden() ? "Unhidden" /* IssuesManager.IssuesManager.IssueStatus.UNHIDDEN */ :
                    "Hidden" /* IssuesManager.IssuesManager.IssueStatus.HIDDEN */;
                setting.set(values);
            },
        };
        __classPrivateFieldGet(this, _IssueView_hiddenIssuesMenu, "f").data = data;
    }
}, _IssueView_createAffectedResources = function _IssueView_createAffectedResources() {
    const wrapper = new UI.TreeOutline.TreeElement();
    wrapper.setCollapsible(false);
    wrapper.setExpandable(true);
    wrapper.expand();
    wrapper.selectable = false;
    wrapper.listItemElement.classList.add('affected-resources-label');
    wrapper.listItemElement.textContent = i18nString(UIStrings.affectedResources);
    wrapper.childrenListElement.classList.add('affected-resources');
    UI.ARIAUtils.setPositionInSet(wrapper.listItemElement, 2);
    UI.ARIAUtils.setSetSize(wrapper.listItemElement, __classPrivateFieldGet(this, _IssueView_description, "f").links.length === 0 ? 2 : 3);
    return wrapper;
}, _IssueView_createBody = function _IssueView_createBody() {
    const messageElement = new UI.TreeOutline.TreeElement();
    messageElement.setCollapsible(false);
    messageElement.selectable = false;
    const markdownComponent = new MarkdownView.MarkdownView.MarkdownView();
    markdownComponent.data = { tokens: __classPrivateFieldGet(this, _IssueView_description, "f").markdown };
    messageElement.listItemElement.appendChild(markdownComponent);
    UI.ARIAUtils.setPositionInSet(messageElement.listItemElement, 1);
    UI.ARIAUtils.setSetSize(messageElement.listItemElement, __classPrivateFieldGet(this, _IssueView_description, "f").links.length === 0 ? 2 : 3);
    this.appendChild(messageElement);
}, _IssueView_createReadMoreLinks = function _IssueView_createReadMoreLinks() {
    if (__classPrivateFieldGet(this, _IssueView_description, "f").links.length === 0) {
        return;
    }
    const linkWrapper = new UI.TreeOutline.TreeElement();
    linkWrapper.setCollapsible(false);
    linkWrapper.listItemElement.classList.add('link-wrapper');
    UI.ARIAUtils.setPositionInSet(linkWrapper.listItemElement, 3);
    UI.ARIAUtils.setSetSize(linkWrapper.listItemElement, 3);
    const linkList = linkWrapper.listItemElement.createChild('ul', 'link-list');
    for (const description of __classPrivateFieldGet(this, _IssueView_description, "f").links) {
        const link = UI.Fragment.html `<x-link class="link devtools-link" tabindex="0" href=${description.link}>${i18nString(UIStrings.learnMoreS, { PH1: description.linkTitle })}</x-link>`;
        link.setAttribute('jslog', `${VisualLogging.link('learn-more').track({ click: true })}`);
        const linkListItem = linkList.createChild('li');
        linkListItem.appendChild(link);
    }
    this.appendChild(linkWrapper);
}, _IssueView_doUpdate = function _IssueView_doUpdate() {
    if (this.expanded) {
        __classPrivateFieldGet(this, _IssueView_affectedResourceViews, "f").forEach(view => view.update());
        this.updateAffectedResourceVisibility();
    }
    __classPrivateFieldSet(this, _IssueView_needsUpdateOnExpand, !this.expanded, "f");
    __classPrivateFieldGet(this, _IssueView_instances, "m", _IssueView_updateFromIssue).call(this);
};
//# sourceMappingURL=IssueView.js.map