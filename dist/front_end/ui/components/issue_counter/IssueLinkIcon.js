// Copyright (c) 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _IssueLinkIcon_instances, _IssueLinkIcon_shadow, _IssueLinkIcon_issue, _IssueLinkIcon_issueTitle, _IssueLinkIcon_issueId, _IssueLinkIcon_issueResolver, _IssueLinkIcon_additionalOnClickAction, _IssueLinkIcon_reveal, _IssueLinkIcon_fetchIssueData, _IssueLinkIcon_getTooltip, _IssueLinkIcon_getIconName, _IssueLinkIcon_render;
import '../../../ui/components/icon_button/icon_button.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as IssuesManager from '../../../models/issues_manager/issues_manager.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import { getIssueKindIconData } from './IssueCounter.js';
import IssueLinkIconStyles from './issueLinkIcon.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Title for a link to show an issue in the issues tab
     */
    clickToShowIssue: 'Click to show issue in the issues tab',
    /**
     * @description Title for a link to show an issue in the issues tab
     * @example {A title of an Issue} title
     */
    clickToShowIssueWithTitle: 'Click to open the issue tab and show issue: {title}',
    /**
     *@description Title for an link to show an issue that is unavailable because the issue couldn't be resolved
     */
    issueUnavailable: 'Issue unavailable at this time',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/issue_counter/IssueLinkIcon.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export const extractShortPath = (path) => {
    // 1st regex matches everything after last '/'
    // if path ends with '/', 2nd regex returns everything between the last two '/'
    return (/[^/]+$/.exec(path) || /[^/]+\/$/.exec(path) || [''])[0];
};
export class IssueLinkIcon extends HTMLElement {
    constructor() {
        super(...arguments);
        _IssueLinkIcon_instances.add(this);
        _IssueLinkIcon_shadow.set(this, this.attachShadow({ mode: 'open' }));
        // The value `null` indicates that the issue is not available,
        // `undefined` that it is still being resolved.
        _IssueLinkIcon_issue.set(this, void 0);
        _IssueLinkIcon_issueTitle.set(this, null);
        _IssueLinkIcon_issueId.set(this, void 0);
        _IssueLinkIcon_issueResolver.set(this, void 0);
        _IssueLinkIcon_additionalOnClickAction.set(this, void 0);
        _IssueLinkIcon_reveal.set(this, Common.Revealer.reveal);
    }
    set data(data) {
        __classPrivateFieldSet(this, _IssueLinkIcon_issue, data.issue, "f");
        __classPrivateFieldSet(this, _IssueLinkIcon_issueId, data.issueId, "f");
        __classPrivateFieldSet(this, _IssueLinkIcon_issueResolver, data.issueResolver, "f");
        if (!__classPrivateFieldGet(this, _IssueLinkIcon_issue, "f")) {
            if (!__classPrivateFieldGet(this, _IssueLinkIcon_issueId, "f")) {
                throw new Error('Either `issue` or `issueId` must be provided');
            }
            else if (!__classPrivateFieldGet(this, _IssueLinkIcon_issueResolver, "f")) {
                throw new Error('An `IssueResolver` must be provided if an `issueId` is provided.');
            }
        }
        __classPrivateFieldSet(this, _IssueLinkIcon_additionalOnClickAction, data.additionalOnClickAction, "f");
        if (data.revealOverride) {
            __classPrivateFieldSet(this, _IssueLinkIcon_reveal, data.revealOverride, "f");
        }
        void __classPrivateFieldGet(this, _IssueLinkIcon_instances, "m", _IssueLinkIcon_fetchIssueData).call(this);
        void __classPrivateFieldGet(this, _IssueLinkIcon_instances, "m", _IssueLinkIcon_render).call(this);
    }
    get data() {
        return {
            issue: __classPrivateFieldGet(this, _IssueLinkIcon_issue, "f"),
            issueId: __classPrivateFieldGet(this, _IssueLinkIcon_issueId, "f"),
            issueResolver: __classPrivateFieldGet(this, _IssueLinkIcon_issueResolver, "f"),
            additionalOnClickAction: __classPrivateFieldGet(this, _IssueLinkIcon_additionalOnClickAction, "f"),
            revealOverride: __classPrivateFieldGet(this, _IssueLinkIcon_reveal, "f") !== Common.Revealer.reveal ? __classPrivateFieldGet(this, _IssueLinkIcon_reveal, "f") : undefined,
        };
    }
    handleClick(event) {
        if (event.button !== 0) {
            return; // Only handle left-click for now.
        }
        if (__classPrivateFieldGet(this, _IssueLinkIcon_issue, "f")) {
            void __classPrivateFieldGet(this, _IssueLinkIcon_reveal, "f").call(this, __classPrivateFieldGet(this, _IssueLinkIcon_issue, "f"));
        }
        __classPrivateFieldGet(this, _IssueLinkIcon_additionalOnClickAction, "f")?.call(this);
        event.consume();
    }
}
_IssueLinkIcon_shadow = new WeakMap(), _IssueLinkIcon_issue = new WeakMap(), _IssueLinkIcon_issueTitle = new WeakMap(), _IssueLinkIcon_issueId = new WeakMap(), _IssueLinkIcon_issueResolver = new WeakMap(), _IssueLinkIcon_additionalOnClickAction = new WeakMap(), _IssueLinkIcon_reveal = new WeakMap(), _IssueLinkIcon_instances = new WeakSet(), _IssueLinkIcon_fetchIssueData = async function _IssueLinkIcon_fetchIssueData() {
    if (!__classPrivateFieldGet(this, _IssueLinkIcon_issue, "f") && __classPrivateFieldGet(this, _IssueLinkIcon_issueId, "f")) {
        try {
            __classPrivateFieldSet(this, _IssueLinkIcon_issue, await __classPrivateFieldGet(this, _IssueLinkIcon_issueResolver, "f")?.waitFor(__classPrivateFieldGet(this, _IssueLinkIcon_issueId, "f")), "f");
        }
        catch {
            __classPrivateFieldSet(this, _IssueLinkIcon_issue, null, "f");
        }
    }
    const description = __classPrivateFieldGet(this, _IssueLinkIcon_issue, "f")?.getDescription();
    if (description) {
        const title = await IssuesManager.MarkdownIssueDescription.getIssueTitleFromMarkdownDescription(description);
        if (title) {
            __classPrivateFieldSet(this, _IssueLinkIcon_issueTitle, title, "f");
        }
    }
    await __classPrivateFieldGet(this, _IssueLinkIcon_instances, "m", _IssueLinkIcon_render).call(this);
}, _IssueLinkIcon_getTooltip = function _IssueLinkIcon_getTooltip() {
    if (__classPrivateFieldGet(this, _IssueLinkIcon_issueTitle, "f")) {
        return i18nString(UIStrings.clickToShowIssueWithTitle, { title: __classPrivateFieldGet(this, _IssueLinkIcon_issueTitle, "f") });
    }
    if (__classPrivateFieldGet(this, _IssueLinkIcon_issue, "f")) {
        return i18nString(UIStrings.clickToShowIssue);
    }
    return i18nString(UIStrings.issueUnavailable);
}, _IssueLinkIcon_getIconName = function _IssueLinkIcon_getIconName() {
    if (!__classPrivateFieldGet(this, _IssueLinkIcon_issue, "f")) {
        return 'issue-questionmark-filled';
    }
    const { iconName } = getIssueKindIconData(__classPrivateFieldGet(this, _IssueLinkIcon_issue, "f").getKind());
    return iconName;
}, _IssueLinkIcon_render = function _IssueLinkIcon_render() {
    return RenderCoordinator.write(() => {
        // clang-format off
        Lit.render(html `
      <style>${IssueLinkIconStyles}</style>
      <button class=${Lit.Directives.classMap({ link: Boolean(__classPrivateFieldGet(this, _IssueLinkIcon_issue, "f")) })}
              title=${__classPrivateFieldGet(this, _IssueLinkIcon_instances, "m", _IssueLinkIcon_getTooltip).call(this)}
              jslog=${VisualLogging.link('issue').track({ click: true })}
              @click=${this.handleClick}>
        <devtools-icon name=${__classPrivateFieldGet(this, _IssueLinkIcon_instances, "m", _IssueLinkIcon_getIconName).call(this)}></devtools-icon>
      </button>`, __classPrivateFieldGet(this, _IssueLinkIcon_shadow, "f"), { host: this });
        // clang-format on
    });
};
customElements.define('devtools-issue-link-icon', IssueLinkIcon);
//# sourceMappingURL=IssueLinkIcon.js.map