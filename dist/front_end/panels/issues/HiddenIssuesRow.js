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
var _HiddenIssuesRow_instances, _HiddenIssuesRow_numHiddenAggregatedIssues, _HiddenIssuesRow_appendHeader;
import * as i18n from '../../core/i18n/i18n.js';
import * as IssuesManager from '../../models/issues_manager/issues_manager.js';
import * as Adorners from '../../ui/components/adorners/adorners.js';
import * as UI from '../../ui/legacy/legacy.js';
const UIStrings = {
    /**
     * @description Title for the hidden issues row
     */
    hiddenIssues: 'Hidden issues',
    /**
     * @description Label for the button to unhide all hidden issues
     */
    unhideAll: 'Unhide all',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/HiddenIssuesRow.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class HiddenIssuesRow extends UI.TreeOutline.TreeElement {
    constructor() {
        super(undefined, true);
        _HiddenIssuesRow_instances.add(this);
        _HiddenIssuesRow_numHiddenAggregatedIssues.set(this, void 0);
        __classPrivateFieldSet(this, _HiddenIssuesRow_numHiddenAggregatedIssues, document.createElement('span'), "f");
        this.toggleOnClick = true;
        this.listItemElement.classList.add('issue-category', 'hidden-issues');
        this.childrenListElement.classList.add('hidden-issues-body');
        __classPrivateFieldGet(this, _HiddenIssuesRow_instances, "m", _HiddenIssuesRow_appendHeader).call(this);
    }
    update(count) {
        __classPrivateFieldGet(this, _HiddenIssuesRow_numHiddenAggregatedIssues, "f").textContent = `${count}`;
    }
}
_HiddenIssuesRow_numHiddenAggregatedIssues = new WeakMap(), _HiddenIssuesRow_instances = new WeakSet(), _HiddenIssuesRow_appendHeader = function _HiddenIssuesRow_appendHeader() {
    const unhideAllIssuesBtn = UI.UIUtils.createTextButton(i18nString(UIStrings.unhideAll), () => IssuesManager.IssuesManager.IssuesManager.instance().unhideAllIssues(), { className: 'unhide-all-issues-button', jslogContext: 'issues.unhide-all-hiddes' });
    const countAdorner = new Adorners.Adorner.Adorner();
    countAdorner.data = {
        name: 'countWrapper',
        content: __classPrivateFieldGet(this, _HiddenIssuesRow_numHiddenAggregatedIssues, "f"),
    };
    countAdorner.classList.add('aggregated-issues-count');
    __classPrivateFieldGet(this, _HiddenIssuesRow_numHiddenAggregatedIssues, "f").textContent = '0';
    const header = document.createElement('div');
    const title = document.createElement('div');
    header.classList.add('header');
    title.classList.add('title');
    title.textContent = i18nString(UIStrings.hiddenIssues);
    header.appendChild(countAdorner);
    header.appendChild(title);
    header.appendChild(unhideAllIssuesBtn);
    this.listItemElement.appendChild(header);
};
//# sourceMappingURL=HiddenIssuesRow.js.map