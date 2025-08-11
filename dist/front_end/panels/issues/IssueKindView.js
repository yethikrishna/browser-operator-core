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
var _IssueKindView_instances, _IssueKindView_kind, _IssueKindView_issueCount, _IssueKindView_appendHeader;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as IssuesManager from '../../models/issues_manager/issues_manager.js';
import * as Adorners from '../../ui/components/adorners/adorners.js';
import * as IconButton from '../../ui/components/icon_button/icon_button.js';
import * as IssueCounter from '../../ui/components/issue_counter/issue_counter.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Components from './components/components.js';
const UIStrings = {
    /**
     * @description Menu entry for hiding all current Page Errors.
     */
    hideAllCurrentPageErrors: 'Hide all current Page Errors',
    /**
     * @description Menu entry for hiding all current Breaking Changes.
     */
    hideAllCurrentBreakingChanges: 'Hide all current Breaking Changes',
    /**
     * @description Menu entry for hiding all current Page Errors.
     */
    hideAllCurrentImprovements: 'Hide all current Improvements',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/IssueKindView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export function getGroupIssuesByKindSetting() {
    return Common.Settings.Settings.instance().createSetting('group-issues-by-kind', false);
}
export function issueKindViewSortPriority(a, b) {
    if (a.getKind() === b.getKind()) {
        return 0;
    }
    if (a.getKind() === "PageError" /* IssuesManager.Issue.IssueKind.PAGE_ERROR */) {
        return -1;
    }
    if (a.getKind() === "BreakingChange" /* IssuesManager.Issue.IssueKind.BREAKING_CHANGE */ &&
        b.getKind() === "Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */) {
        return -1;
    }
    return 1;
}
export function getClassNameFromKind(kind) {
    switch (kind) {
        case "BreakingChange" /* IssuesManager.Issue.IssueKind.BREAKING_CHANGE */:
            return 'breaking-changes';
        case "Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */:
            return 'improvements';
        case "PageError" /* IssuesManager.Issue.IssueKind.PAGE_ERROR */:
            return 'page-errors';
    }
}
export class IssueKindView extends UI.TreeOutline.TreeElement {
    constructor(kind) {
        super(undefined, true);
        _IssueKindView_instances.add(this);
        _IssueKindView_kind.set(this, void 0);
        _IssueKindView_issueCount.set(this, void 0);
        __classPrivateFieldSet(this, _IssueKindView_kind, kind, "f");
        __classPrivateFieldSet(this, _IssueKindView_issueCount, document.createElement('span'), "f");
        this.toggleOnClick = true;
        this.listItemElement.classList.add('issue-kind');
        this.listItemElement.classList.add(getClassNameFromKind(kind));
        this.childrenListElement.classList.add('issue-kind-body');
    }
    getKind() {
        return __classPrivateFieldGet(this, _IssueKindView_kind, "f");
    }
    getHideAllCurrentKindString() {
        switch (__classPrivateFieldGet(this, _IssueKindView_kind, "f")) {
            case "PageError" /* IssuesManager.Issue.IssueKind.PAGE_ERROR */:
                return i18nString(UIStrings.hideAllCurrentPageErrors);
            case "Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */:
                return i18nString(UIStrings.hideAllCurrentImprovements);
            case "BreakingChange" /* IssuesManager.Issue.IssueKind.BREAKING_CHANGE */:
                return i18nString(UIStrings.hideAllCurrentBreakingChanges);
        }
    }
    onattach() {
        __classPrivateFieldGet(this, _IssueKindView_instances, "m", _IssueKindView_appendHeader).call(this);
        this.expand();
    }
    update(count) {
        __classPrivateFieldGet(this, _IssueKindView_issueCount, "f").textContent = `${count}`;
    }
}
_IssueKindView_kind = new WeakMap(), _IssueKindView_issueCount = new WeakMap(), _IssueKindView_instances = new WeakSet(), _IssueKindView_appendHeader = function _IssueKindView_appendHeader() {
    const header = document.createElement('div');
    header.classList.add('header');
    const issueKindIcon = new IconButton.Icon.Icon();
    issueKindIcon.data = IssueCounter.IssueCounter.getIssueKindIconData(__classPrivateFieldGet(this, _IssueKindView_kind, "f"));
    issueKindIcon.classList.add('leading-issue-icon');
    const countAdorner = new Adorners.Adorner.Adorner();
    countAdorner.data = {
        name: 'countWrapper',
        content: __classPrivateFieldGet(this, _IssueKindView_issueCount, "f"),
    };
    countAdorner.classList.add('aggregated-issues-count');
    __classPrivateFieldGet(this, _IssueKindView_issueCount, "f").textContent = '0';
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = IssuesManager.Issue.getIssueKindName(__classPrivateFieldGet(this, _IssueKindView_kind, "f"));
    const hideAvailableIssuesBtn = new Components.HideIssuesMenu.HideIssuesMenu();
    hideAvailableIssuesBtn.classList.add('hide-available-issues');
    hideAvailableIssuesBtn.data = {
        menuItemLabel: this.getHideAllCurrentKindString(),
        menuItemAction: () => {
            const setting = IssuesManager.IssuesManager.getHideIssueByCodeSetting();
            const values = setting.get();
            for (const issue of IssuesManager.IssuesManager.IssuesManager.instance().issues()) {
                if (issue.getKind() === __classPrivateFieldGet(this, _IssueKindView_kind, "f")) {
                    values[issue.code()] = "Hidden" /* IssuesManager.IssuesManager.IssueStatus.HIDDEN */;
                }
            }
            setting.set(values);
        },
    };
    header.appendChild(issueKindIcon);
    header.appendChild(countAdorner);
    header.appendChild(title);
    header.appendChild(hideAvailableIssuesBtn);
    this.listItemElement.appendChild(header);
};
//# sourceMappingURL=IssueKindView.js.map