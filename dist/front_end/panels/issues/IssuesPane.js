// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _IssueCategoryView_instances, _IssueCategoryView_category, _IssueCategoryView_appendHeader, _IssuesPane_instances, _IssuesPane_categoryViews, _IssuesPane_issueViews, _IssuesPane_kindViews, _IssuesPane_showThirdPartyCheckbox, _IssuesPane_issuesTree, _IssuesPane_hiddenIssuesRow, _IssuesPane_noIssuesMessageDiv, _IssuesPane_issuesManager, _IssuesPane_aggregator, _IssuesPane_issueViewUpdatePromise, _IssuesPane_createToolbars, _IssuesPane_issueUpdated, _IssuesPane_scheduleIssueViewUpdate, _IssuesPane_updateIssueView, _IssuesPane_updateItemPositionAndSize, _IssuesPane_getIssueViewParent, _IssuesPane_clearViews, _IssuesPane_onFullUpdate, _IssuesPane_fullUpdate, _IssuesPane_updateIssueKindViewsCount, _IssuesPane_updateCounts, _IssuesPane_showIssuesTreeOrNoIssuesDetectedMessage;
import '../../ui/legacy/legacy.js';
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as IssuesManager from '../../models/issues_manager/issues_manager.js';
import * as IssueCounter from '../../ui/components/issue_counter/issue_counter.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { HiddenIssuesRow } from './HiddenIssuesRow.js';
import { IssueAggregator, } from './IssueAggregator.js';
import { getGroupIssuesByKindSetting, IssueKindView, issueKindViewSortPriority } from './IssueKindView.js';
import issuesPaneStyles from './issuesPane.css.js';
import issuesTreeStyles from './issuesTree.css.js';
import { IssueView } from './IssueView.js';
const UIStrings = {
    /**
     * @description Category title for a group of cross origin embedder policy (COEP) issues
     */
    crossOriginEmbedderPolicy: 'Cross Origin Embedder Policy',
    /**
     * @description Category title for a group of mixed content issues
     */
    mixedContent: 'Mixed Content',
    /**
     * @description Category title for a group of SameSite cookie issues
     */
    samesiteCookie: 'SameSite Cookie',
    /**
     * @description Category title for a group of heavy ads issues
     */
    heavyAds: 'Heavy Ads',
    /**
     * @description Category title for a group of content security policy (CSP) issues
     */
    contentSecurityPolicy: 'Content Security Policy',
    /**
     * @description Text for other types of items
     */
    other: 'Other',
    /**
     * @description Category title for the different 'low text contrast' issues. Low text contrast refers
     *              to the difference between the color of a text and the background color where that text
     *              appears.
     */
    lowTextContrast: 'Low Text Contrast',
    /**
     * @description Category title for the different 'Cross-Origin Resource Sharing' (CORS) issues. CORS
     *              refers to one origin (e.g 'a.com') loading resources from another origin (e.g. 'b.com').
     */
    cors: 'Cross Origin Resource Sharing',
    /**
     * @description Title for a checkbox which toggles grouping by category in the issues tab
     */
    groupDisplayedIssuesUnder: 'Group displayed issues under associated categories',
    /**
     * @description Label for a checkbox which toggles grouping by category in the issues tab
     */
    groupByCategory: 'Group by category',
    /**
     * @description Title for a checkbox which toggles grouping by kind in the issues tab
     */
    groupDisplayedIssuesUnderKind: 'Group displayed issues as Page errors, Breaking changes and Improvements',
    /**
     * @description Label for a checkbox which toggles grouping by kind in the issues tab
     */
    groupByKind: 'Group by kind',
    /**
     * @description Title for a checkbox. Whether the issues tab should include third-party issues or not.
     */
    includeCookieIssuesCausedBy: 'Include cookie Issues caused by third-party sites',
    /**
     * @description Label for a checkbox. Whether the issues tab should include third-party issues or not.
     */
    includeThirdpartyCookieIssues: 'Include third-party cookie issues',
    /**
     * @description Label on the issues tab
     */
    onlyThirdpartyCookieIssues: 'Only third-party cookie issues detected',
    /**
     * @description Label in the issues panel
     */
    noIssues: 'No issues detected',
    /**
     * @description Text that explains the issues panel that is shown if no issues are shown.
     */
    issuesPanelDescription: 'On this page you can find warnings from the browser.',
    /**
     * @description Category title for the different 'Attribution Reporting API' issues. The
     * Attribution Reporting API is a newly proposed web API (see https://github.com/WICG/conversion-measurement-api).
     */
    attributionReporting: 'Attribution Reporting `API`',
    /**
     * @description Category title for the different 'Quirks Mode' issues. Quirks Mode refers
     *              to the legacy browser modes that displays web content according to outdated
     *              browser behaviors.
     */
    quirksMode: 'Quirks Mode',
    /**
     * @description Category title for the different 'Generic' issues.
     */
    generic: 'Generic',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/IssuesPane.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const ISSUES_PANEL_EXPLANATION_URL = 'https://developer.chrome.com/docs/devtools/issues';
class IssueCategoryView extends UI.TreeOutline.TreeElement {
    constructor(category) {
        super();
        _IssueCategoryView_instances.add(this);
        _IssueCategoryView_category.set(this, void 0);
        __classPrivateFieldSet(this, _IssueCategoryView_category, category, "f");
        this.toggleOnClick = true;
        this.listItemElement.classList.add('issue-category');
        this.childrenListElement.classList.add('issue-category-body');
    }
    getCategoryName() {
        switch (__classPrivateFieldGet(this, _IssueCategoryView_category, "f")) {
            case "CrossOriginEmbedderPolicy" /* IssuesManager.Issue.IssueCategory.CROSS_ORIGIN_EMBEDDER_POLICY */:
                return i18nString(UIStrings.crossOriginEmbedderPolicy);
            case "MixedContent" /* IssuesManager.Issue.IssueCategory.MIXED_CONTENT */:
                return i18nString(UIStrings.mixedContent);
            case "Cookie" /* IssuesManager.Issue.IssueCategory.COOKIE */:
                return i18nString(UIStrings.samesiteCookie);
            case "HeavyAd" /* IssuesManager.Issue.IssueCategory.HEAVY_AD */:
                return i18nString(UIStrings.heavyAds);
            case "ContentSecurityPolicy" /* IssuesManager.Issue.IssueCategory.CONTENT_SECURITY_POLICY */:
                return i18nString(UIStrings.contentSecurityPolicy);
            case "LowTextContrast" /* IssuesManager.Issue.IssueCategory.LOW_TEXT_CONTRAST */:
                return i18nString(UIStrings.lowTextContrast);
            case "Cors" /* IssuesManager.Issue.IssueCategory.CORS */:
                return i18nString(UIStrings.cors);
            case "AttributionReporting" /* IssuesManager.Issue.IssueCategory.ATTRIBUTION_REPORTING */:
                return i18nString(UIStrings.attributionReporting);
            case "QuirksMode" /* IssuesManager.Issue.IssueCategory.QUIRKS_MODE */:
                return i18nString(UIStrings.quirksMode);
            case "Generic" /* IssuesManager.Issue.IssueCategory.GENERIC */:
                return i18nString(UIStrings.generic);
            case "Other" /* IssuesManager.Issue.IssueCategory.OTHER */:
                return i18nString(UIStrings.other);
        }
    }
    onattach() {
        __classPrivateFieldGet(this, _IssueCategoryView_instances, "m", _IssueCategoryView_appendHeader).call(this);
    }
}
_IssueCategoryView_category = new WeakMap(), _IssueCategoryView_instances = new WeakSet(), _IssueCategoryView_appendHeader = function _IssueCategoryView_appendHeader() {
    const header = document.createElement('div');
    header.classList.add('header');
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = this.getCategoryName();
    header.appendChild(title);
    this.listItemElement.appendChild(header);
};
export function getGroupIssuesByCategorySetting() {
    return Common.Settings.Settings.instance().createSetting('group-issues-by-category', false);
}
export class IssuesPane extends UI.Widget.VBox {
    constructor() {
        super(true);
        _IssuesPane_instances.add(this);
        _IssuesPane_categoryViews.set(this, void 0);
        _IssuesPane_issueViews.set(this, void 0);
        _IssuesPane_kindViews.set(this, void 0);
        _IssuesPane_showThirdPartyCheckbox.set(this, void 0);
        _IssuesPane_issuesTree.set(this, void 0);
        _IssuesPane_hiddenIssuesRow.set(this, void 0);
        _IssuesPane_noIssuesMessageDiv.set(this, void 0);
        _IssuesPane_issuesManager.set(this, void 0);
        _IssuesPane_aggregator.set(this, void 0);
        _IssuesPane_issueViewUpdatePromise.set(this, Promise.resolve());
        this.registerRequiredCSS(issuesPaneStyles);
        this.element.setAttribute('jslog', `${VisualLogging.panel('issues')}`);
        this.contentElement.classList.add('issues-pane');
        __classPrivateFieldSet(this, _IssuesPane_categoryViews, new Map(), "f");
        __classPrivateFieldSet(this, _IssuesPane_kindViews, new Map(), "f");
        __classPrivateFieldSet(this, _IssuesPane_issueViews, new Map(), "f");
        __classPrivateFieldSet(this, _IssuesPane_showThirdPartyCheckbox, null, "f");
        __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_createToolbars).call(this);
        __classPrivateFieldSet(this, _IssuesPane_issuesTree, new UI.TreeOutline.TreeOutlineInShadow(), "f");
        __classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").setShowSelectionOnKeyboardFocus(true);
        __classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").contentElement.classList.add('issues');
        __classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").registerRequiredCSS(issuesTreeStyles);
        this.contentElement.appendChild(__classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").element);
        __classPrivateFieldSet(this, _IssuesPane_hiddenIssuesRow, new HiddenIssuesRow(), "f");
        __classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").appendChild(__classPrivateFieldGet(this, _IssuesPane_hiddenIssuesRow, "f"));
        __classPrivateFieldSet(this, _IssuesPane_noIssuesMessageDiv, new UI.EmptyWidget.EmptyWidget('', i18nString(UIStrings.issuesPanelDescription)), "f");
        __classPrivateFieldGet(this, _IssuesPane_noIssuesMessageDiv, "f").link = ISSUES_PANEL_EXPLANATION_URL;
        __classPrivateFieldGet(this, _IssuesPane_noIssuesMessageDiv, "f").show(this.contentElement);
        __classPrivateFieldSet(this, _IssuesPane_issuesManager, IssuesManager.IssuesManager.IssuesManager.instance(), "f");
        __classPrivateFieldSet(this, _IssuesPane_aggregator, new IssueAggregator(__classPrivateFieldGet(this, _IssuesPane_issuesManager, "f")), "f");
        __classPrivateFieldGet(this, _IssuesPane_aggregator, "f").addEventListener("AggregatedIssueUpdated" /* IssueAggregatorEvents.AGGREGATED_ISSUE_UPDATED */, __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_issueUpdated), this);
        __classPrivateFieldGet(this, _IssuesPane_aggregator, "f").addEventListener("FullUpdateRequired" /* IssueAggregatorEvents.FULL_UPDATE_REQUIRED */, __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_onFullUpdate), this);
        __classPrivateFieldGet(this, _IssuesPane_hiddenIssuesRow, "f").hidden = __classPrivateFieldGet(this, _IssuesPane_issuesManager, "f").numberOfHiddenIssues() === 0;
        __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_onFullUpdate).call(this);
        __classPrivateFieldGet(this, _IssuesPane_issuesManager, "f").addEventListener("IssuesCountUpdated" /* IssuesManager.IssuesManager.Events.ISSUES_COUNT_UPDATED */, __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_updateCounts), this);
    }
    elementsToRestoreScrollPositionsFor() {
        return [__classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").element];
    }
    appendIssueViewToParent(issueView, parent) {
        parent.appendChild(issueView, (a, b) => {
            if (a instanceof HiddenIssuesRow) {
                return 1;
            }
            if (b instanceof HiddenIssuesRow) {
                return -1;
            }
            if (a instanceof IssueView && b instanceof IssueView) {
                return a.getIssueTitle().localeCompare(b.getIssueTitle());
            }
            console.error('The issues tree should only contain IssueView objects as direct children');
            return 0;
        });
        if (parent instanceof UI.TreeOutline.TreeElement) {
            // This is an aggregated view, so we need to update the label for position and size of the treeItem.
            __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_updateItemPositionAndSize).call(this, parent);
        }
    }
    async reveal(issue) {
        await __classPrivateFieldGet(this, _IssuesPane_issueViewUpdatePromise, "f");
        const key = __classPrivateFieldGet(this, _IssuesPane_aggregator, "f").keyForIssue(issue);
        const issueView = __classPrivateFieldGet(this, _IssuesPane_issueViews, "f").get(key);
        if (issueView) {
            if (issueView.isForHiddenIssue()) {
                __classPrivateFieldGet(this, _IssuesPane_hiddenIssuesRow, "f").expand();
                __classPrivateFieldGet(this, _IssuesPane_hiddenIssuesRow, "f").reveal();
            }
            if (getGroupIssuesByKindSetting().get() && !issueView.isForHiddenIssue()) {
                const kindView = __classPrivateFieldGet(this, _IssuesPane_kindViews, "f").get(issueView.getIssueKind());
                kindView?.expand();
                kindView?.reveal();
            }
            issueView.expand();
            issueView.reveal();
            issueView.select(false, true);
        }
    }
}
_IssuesPane_categoryViews = new WeakMap(), _IssuesPane_issueViews = new WeakMap(), _IssuesPane_kindViews = new WeakMap(), _IssuesPane_showThirdPartyCheckbox = new WeakMap(), _IssuesPane_issuesTree = new WeakMap(), _IssuesPane_hiddenIssuesRow = new WeakMap(), _IssuesPane_noIssuesMessageDiv = new WeakMap(), _IssuesPane_issuesManager = new WeakMap(), _IssuesPane_aggregator = new WeakMap(), _IssuesPane_issueViewUpdatePromise = new WeakMap(), _IssuesPane_instances = new WeakSet(), _IssuesPane_createToolbars = function _IssuesPane_createToolbars() {
    const toolbarContainer = this.contentElement.createChild('div', 'issues-toolbar-container');
    toolbarContainer.setAttribute('jslog', `${VisualLogging.toolbar()}`);
    toolbarContainer.role = 'toolbar';
    const leftToolbar = toolbarContainer.createChild('devtools-toolbar', 'issues-toolbar-left');
    leftToolbar.role = 'presentation';
    const rightToolbar = toolbarContainer.createChild('devtools-toolbar', 'issues-toolbar-right');
    rightToolbar.role = 'presentation';
    const groupByCategorySetting = getGroupIssuesByCategorySetting();
    const groupByCategoryCheckbox = new UI.Toolbar.ToolbarSettingCheckbox(groupByCategorySetting, i18nString(UIStrings.groupDisplayedIssuesUnder), i18nString(UIStrings.groupByCategory));
    // Hide the option to toggle category grouping for now.
    groupByCategoryCheckbox.setVisible(false);
    rightToolbar.appendToolbarItem(groupByCategoryCheckbox);
    groupByCategorySetting.addChangeListener(() => {
        __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_fullUpdate).call(this, true);
    });
    const groupByKindSetting = getGroupIssuesByKindSetting();
    const groupByKindSettingCheckbox = new UI.Toolbar.ToolbarSettingCheckbox(groupByKindSetting, i18nString(UIStrings.groupDisplayedIssuesUnderKind), i18nString(UIStrings.groupByKind));
    rightToolbar.appendToolbarItem(groupByKindSettingCheckbox);
    groupByKindSetting.addChangeListener(() => {
        __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_fullUpdate).call(this, true);
    });
    groupByKindSettingCheckbox.setVisible(true);
    const thirdPartySetting = IssuesManager.Issue.getShowThirdPartyIssuesSetting();
    __classPrivateFieldSet(this, _IssuesPane_showThirdPartyCheckbox, new UI.Toolbar.ToolbarSettingCheckbox(thirdPartySetting, i18nString(UIStrings.includeCookieIssuesCausedBy), i18nString(UIStrings.includeThirdpartyCookieIssues)), "f");
    rightToolbar.appendToolbarItem(__classPrivateFieldGet(this, _IssuesPane_showThirdPartyCheckbox, "f"));
    this.setDefaultFocusedElement(__classPrivateFieldGet(this, _IssuesPane_showThirdPartyCheckbox, "f").element);
    rightToolbar.appendSeparator();
    const issueCounter = new IssueCounter.IssueCounter.IssueCounter();
    issueCounter.data = {
        clickHandler: () => {
            this.focus();
        },
        tooltipCallback: () => {
            const issueEnumeration = IssueCounter.IssueCounter.getIssueCountsEnumeration(IssuesManager.IssuesManager.IssuesManager.instance(), false);
            issueCounter.title = issueEnumeration;
        },
        displayMode: "ShowAlways" /* IssueCounter.IssueCounter.DisplayMode.SHOW_ALWAYS */,
        issuesManager: IssuesManager.IssuesManager.IssuesManager.instance(),
    };
    issueCounter.id = 'console-issues-counter';
    issueCounter.setAttribute('jslog', `${VisualLogging.counter('issues')}`);
    const issuesToolbarItem = new UI.Toolbar.ToolbarItem(issueCounter);
    rightToolbar.appendToolbarItem(issuesToolbarItem);
    return { toolbarContainer };
}, _IssuesPane_issueUpdated = function _IssuesPane_issueUpdated(event) {
    __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_scheduleIssueViewUpdate).call(this, event.data);
}, _IssuesPane_scheduleIssueViewUpdate = function _IssuesPane_scheduleIssueViewUpdate(issue) {
    __classPrivateFieldSet(this, _IssuesPane_issueViewUpdatePromise, __classPrivateFieldGet(this, _IssuesPane_issueViewUpdatePromise, "f").then(() => __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_updateIssueView).call(this, issue)), "f");
}, _IssuesPane_updateIssueView = 
/** Don't call directly. Use `scheduleIssueViewUpdate` instead. */
async function _IssuesPane_updateIssueView(issue) {
    let issueView = __classPrivateFieldGet(this, _IssuesPane_issueViews, "f").get(issue.aggregationKey());
    if (!issueView) {
        const description = issue.getDescription();
        if (!description) {
            console.warn('Could not find description for issue code:', issue.code());
            return;
        }
        const markdownDescription = await IssuesManager.MarkdownIssueDescription.createIssueDescriptionFromMarkdown(description);
        issueView = new IssueView(issue, markdownDescription);
        __classPrivateFieldGet(this, _IssuesPane_issueViews, "f").set(issue.aggregationKey(), issueView);
        const parent = __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_getIssueViewParent).call(this, issue);
        this.appendIssueViewToParent(issueView, parent);
    }
    else {
        issueView.setIssue(issue);
        const newParent = __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_getIssueViewParent).call(this, issue);
        if (issueView.parent !== newParent &&
            !(newParent instanceof UI.TreeOutline.TreeOutline && issueView.parent === newParent.rootElement())) {
            issueView.parent?.removeChild(issueView);
            this.appendIssueViewToParent(issueView, newParent);
        }
    }
    issueView.update();
    __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_updateCounts).call(this);
}, _IssuesPane_updateItemPositionAndSize = function _IssuesPane_updateItemPositionAndSize(parent) {
    const childNodes = parent.childrenListNode.children;
    let treeItemCount = 0;
    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        if (node.classList.contains('issue')) {
            UI.ARIAUtils.setPositionInSet(node, ++treeItemCount);
            UI.ARIAUtils.setSetSize(node, childNodes.length / 2); // Each issue has 2 nodes (issue + description).
        }
    }
}, _IssuesPane_getIssueViewParent = function _IssuesPane_getIssueViewParent(issue) {
    if (issue.isHidden()) {
        return __classPrivateFieldGet(this, _IssuesPane_hiddenIssuesRow, "f");
    }
    if (getGroupIssuesByKindSetting().get()) {
        const kind = issue.getKind();
        const view = __classPrivateFieldGet(this, _IssuesPane_kindViews, "f").get(kind);
        if (view) {
            return view;
        }
        const newView = new IssueKindView(kind);
        __classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").appendChild(newView, (a, b) => {
            if (a instanceof IssueKindView && b instanceof IssueKindView) {
                return issueKindViewSortPriority(a, b);
            }
            return 0;
        });
        __classPrivateFieldGet(this, _IssuesPane_kindViews, "f").set(kind, newView);
        return newView;
    }
    if (getGroupIssuesByCategorySetting().get()) {
        const category = issue.getCategory();
        const view = __classPrivateFieldGet(this, _IssuesPane_categoryViews, "f").get(category);
        if (view) {
            return view;
        }
        const newView = new IssueCategoryView(category);
        __classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").appendChild(newView, (a, b) => {
            if (a instanceof IssueCategoryView && b instanceof IssueCategoryView) {
                return a.getCategoryName().localeCompare(b.getCategoryName());
            }
            return 0;
        });
        __classPrivateFieldGet(this, _IssuesPane_categoryViews, "f").set(category, newView);
        return newView;
    }
    return __classPrivateFieldGet(this, _IssuesPane_issuesTree, "f");
}, _IssuesPane_clearViews = function _IssuesPane_clearViews(views, preservedSet) {
    for (const [key, view] of Array.from(views.entries())) {
        if (preservedSet?.has(key)) {
            continue;
        }
        view.parent && view.parent.removeChild(view);
        views.delete(key);
    }
}, _IssuesPane_onFullUpdate = function _IssuesPane_onFullUpdate() {
    __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_fullUpdate).call(this, false);
}, _IssuesPane_fullUpdate = function _IssuesPane_fullUpdate(force) {
    __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_clearViews).call(this, __classPrivateFieldGet(this, _IssuesPane_categoryViews, "f"), force ? undefined : __classPrivateFieldGet(this, _IssuesPane_aggregator, "f").aggregatedIssueCategories());
    __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_clearViews).call(this, __classPrivateFieldGet(this, _IssuesPane_kindViews, "f"), force ? undefined : __classPrivateFieldGet(this, _IssuesPane_aggregator, "f").aggregatedIssueKinds());
    __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_clearViews).call(this, __classPrivateFieldGet(this, _IssuesPane_issueViews, "f"), force ? undefined : __classPrivateFieldGet(this, _IssuesPane_aggregator, "f").aggregatedIssueCodes());
    if (__classPrivateFieldGet(this, _IssuesPane_aggregator, "f")) {
        for (const issue of __classPrivateFieldGet(this, _IssuesPane_aggregator, "f").aggregatedIssues()) {
            __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_scheduleIssueViewUpdate).call(this, issue);
        }
    }
    __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_updateCounts).call(this);
}, _IssuesPane_updateIssueKindViewsCount = function _IssuesPane_updateIssueKindViewsCount() {
    for (const view of __classPrivateFieldGet(this, _IssuesPane_kindViews, "f").values()) {
        const count = __classPrivateFieldGet(this, _IssuesPane_issuesManager, "f").numberOfIssues(view.getKind());
        view.update(count);
    }
}, _IssuesPane_updateCounts = function _IssuesPane_updateCounts() {
    __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_showIssuesTreeOrNoIssuesDetectedMessage).call(this, __classPrivateFieldGet(this, _IssuesPane_issuesManager, "f").numberOfIssues(), __classPrivateFieldGet(this, _IssuesPane_issuesManager, "f").numberOfHiddenIssues());
    if (getGroupIssuesByKindSetting().get()) {
        __classPrivateFieldGet(this, _IssuesPane_instances, "m", _IssuesPane_updateIssueKindViewsCount).call(this);
    }
}, _IssuesPane_showIssuesTreeOrNoIssuesDetectedMessage = function _IssuesPane_showIssuesTreeOrNoIssuesDetectedMessage(issuesCount, hiddenIssueCount) {
    if (issuesCount > 0 || hiddenIssueCount > 0) {
        __classPrivateFieldGet(this, _IssuesPane_hiddenIssuesRow, "f").hidden = hiddenIssueCount === 0;
        __classPrivateFieldGet(this, _IssuesPane_hiddenIssuesRow, "f").update(hiddenIssueCount);
        __classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").element.hidden = false;
        __classPrivateFieldGet(this, _IssuesPane_noIssuesMessageDiv, "f").hideWidget();
        const firstChild = __classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").firstChild();
        if (firstChild) {
            firstChild.select(/* omitFocus= */ true);
            this.setDefaultFocusedElement(firstChild.listItemElement);
        }
    }
    else {
        __classPrivateFieldGet(this, _IssuesPane_issuesTree, "f").element.hidden = true;
        if (__classPrivateFieldGet(this, _IssuesPane_showThirdPartyCheckbox, "f")) {
            this.setDefaultFocusedElement(__classPrivateFieldGet(this, _IssuesPane_showThirdPartyCheckbox, "f").element);
        }
        // We alreay know that issesCount is zero here.
        const hasOnlyThirdPartyIssues = __classPrivateFieldGet(this, _IssuesPane_issuesManager, "f").numberOfAllStoredIssues() - __classPrivateFieldGet(this, _IssuesPane_issuesManager, "f").numberOfThirdPartyCookiePhaseoutIssues() >
            0;
        __classPrivateFieldGet(this, _IssuesPane_noIssuesMessageDiv, "f").header =
            hasOnlyThirdPartyIssues ? i18nString(UIStrings.onlyThirdpartyCookieIssues) : i18nString(UIStrings.noIssues);
        __classPrivateFieldGet(this, _IssuesPane_noIssuesMessageDiv, "f").showWidget();
    }
};
//# sourceMappingURL=IssuesPane.js.map