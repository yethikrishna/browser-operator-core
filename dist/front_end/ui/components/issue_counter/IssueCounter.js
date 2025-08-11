// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _IssueCounter_instances, _IssueCounter_shadow, _IssueCounter_clickHandler, _IssueCounter_tooltipCallback, _IssueCounter_leadingText, _IssueCounter_throttler, _IssueCounter_counts, _IssueCounter_displayMode, _IssueCounter_issuesManager, _IssueCounter_accessibleName, _IssueCounter_throttlerTimeout, _IssueCounter_compact, _IssueCounter_render;
import '../icon_button/icon_button.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as IssuesManager from '../../../models/issues_manager/issues_manager.js';
import { html, render } from '../../lit/lit.js';
import issueCounterStyles from './issueCounter.css.js';
const UIStrings = {
    /**
     *@description Label for link to Issues tab, specifying how many issues there are.
     */
    pageErrors: '{issueCount, plural, =1 {# page error} other {# page errors}}',
    /**
     *@description Label for link to Issues tab, specifying how many issues there are.
     */
    breakingChanges: '{issueCount, plural, =1 {# breaking change} other {# breaking changes}}',
    /**
     *@description Label for link to Issues tab, specifying how many issues there are.
     */
    possibleImprovements: '{issueCount, plural, =1 {# possible improvement} other {# possible improvements}}',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/issue_counter/IssueCounter.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export function getIssueKindIconData(issueKind) {
    switch (issueKind) {
        case "PageError" /* IssuesManager.Issue.IssueKind.PAGE_ERROR */:
            return { iconName: 'issue-cross-filled', color: 'var(--icon-error)', width: '20px', height: '20px' };
        case "BreakingChange" /* IssuesManager.Issue.IssueKind.BREAKING_CHANGE */:
            return { iconName: 'issue-exclamation-filled', color: 'var(--icon-warning)', width: '20px', height: '20px' };
        case "Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */:
            return { iconName: 'issue-text-filled', color: 'var(--icon-info)', width: '20px', height: '20px' };
    }
}
function toIconGroup({ iconName, color, width, height }, sizeOverride) {
    if (sizeOverride) {
        return { iconName, iconColor: color, iconWidth: sizeOverride, iconHeight: sizeOverride };
    }
    return { iconName, iconColor: color, iconWidth: width, iconHeight: height };
}
export var DisplayMode;
(function (DisplayMode) {
    DisplayMode["OMIT_EMPTY"] = "OmitEmpty";
    DisplayMode["SHOW_ALWAYS"] = "ShowAlways";
    DisplayMode["ONLY_MOST_IMPORTANT"] = "OnlyMostImportant";
})(DisplayMode || (DisplayMode = {}));
// Lazily instantiate the formatter as the constructor takes 50ms+
// TODO: move me and others like me to i18n module
const listFormatter = (function defineFormatter() {
    let intlListFormat;
    return {
        format(...args) {
            if (!intlListFormat) {
                const opts = { type: 'unit', style: 'short' };
                intlListFormat = new Intl.ListFormat(i18n.DevToolsLocale.DevToolsLocale.instance().locale, opts);
            }
            return intlListFormat.format(...args);
        },
    };
})();
export function getIssueCountsEnumeration(issuesManager, omitEmpty = true) {
    const counts = [
        issuesManager.numberOfIssues("PageError" /* IssuesManager.Issue.IssueKind.PAGE_ERROR */),
        issuesManager.numberOfIssues("BreakingChange" /* IssuesManager.Issue.IssueKind.BREAKING_CHANGE */),
        issuesManager.numberOfIssues("Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */),
    ];
    const phrases = [
        i18nString(UIStrings.pageErrors, { issueCount: counts[0] }),
        i18nString(UIStrings.breakingChanges, { issueCount: counts[1] }),
        i18nString(UIStrings.possibleImprovements, { issueCount: counts[2] }),
    ];
    return listFormatter.format(phrases.filter((_, i) => omitEmpty ? counts[i] > 0 : true));
}
export class IssueCounter extends HTMLElement {
    constructor() {
        super(...arguments);
        _IssueCounter_instances.add(this);
        _IssueCounter_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _IssueCounter_clickHandler.set(this, undefined);
        _IssueCounter_tooltipCallback.set(this, undefined);
        _IssueCounter_leadingText.set(this, '');
        _IssueCounter_throttler.set(this, void 0);
        _IssueCounter_counts.set(this, [0, 0, 0]);
        _IssueCounter_displayMode.set(this, "OmitEmpty" /* DisplayMode.OMIT_EMPTY */);
        _IssueCounter_issuesManager.set(this, undefined);
        _IssueCounter_accessibleName.set(this, undefined);
        _IssueCounter_throttlerTimeout.set(this, void 0);
        _IssueCounter_compact.set(this, false);
    }
    scheduleUpdate() {
        if (__classPrivateFieldGet(this, _IssueCounter_throttler, "f")) {
            void __classPrivateFieldGet(this, _IssueCounter_throttler, "f").schedule(async () => __classPrivateFieldGet(this, _IssueCounter_instances, "m", _IssueCounter_render).call(this));
        }
        else {
            __classPrivateFieldGet(this, _IssueCounter_instances, "m", _IssueCounter_render).call(this);
        }
    }
    set data(data) {
        __classPrivateFieldSet(this, _IssueCounter_clickHandler, data.clickHandler, "f");
        __classPrivateFieldSet(this, _IssueCounter_leadingText, data.leadingText ?? '', "f");
        __classPrivateFieldSet(this, _IssueCounter_tooltipCallback, data.tooltipCallback, "f");
        __classPrivateFieldSet(this, _IssueCounter_displayMode, data.displayMode ?? "OmitEmpty" /* DisplayMode.OMIT_EMPTY */, "f");
        __classPrivateFieldSet(this, _IssueCounter_accessibleName, data.accessibleName, "f");
        __classPrivateFieldSet(this, _IssueCounter_throttlerTimeout, data.throttlerTimeout, "f");
        __classPrivateFieldSet(this, _IssueCounter_compact, Boolean(data.compact), "f");
        if (__classPrivateFieldGet(this, _IssueCounter_issuesManager, "f") !== data.issuesManager) {
            __classPrivateFieldGet(this, _IssueCounter_issuesManager, "f")?.removeEventListener("IssuesCountUpdated" /* IssuesManager.IssuesManager.Events.ISSUES_COUNT_UPDATED */, this.scheduleUpdate, this);
            __classPrivateFieldSet(this, _IssueCounter_issuesManager, data.issuesManager, "f");
            __classPrivateFieldGet(this, _IssueCounter_issuesManager, "f").addEventListener("IssuesCountUpdated" /* IssuesManager.IssuesManager.Events.ISSUES_COUNT_UPDATED */, this.scheduleUpdate, this);
        }
        if (data.throttlerTimeout !== 0) {
            __classPrivateFieldSet(this, _IssueCounter_throttler, new Common.Throttler.Throttler(data.throttlerTimeout ?? 100), "f");
        }
        else {
            __classPrivateFieldSet(this, _IssueCounter_throttler, undefined, "f");
        }
        this.scheduleUpdate();
    }
    get data() {
        return {
            clickHandler: __classPrivateFieldGet(this, _IssueCounter_clickHandler, "f"),
            leadingText: __classPrivateFieldGet(this, _IssueCounter_leadingText, "f"),
            tooltipCallback: __classPrivateFieldGet(this, _IssueCounter_tooltipCallback, "f"),
            displayMode: __classPrivateFieldGet(this, _IssueCounter_displayMode, "f"),
            accessibleName: __classPrivateFieldGet(this, _IssueCounter_accessibleName, "f"),
            throttlerTimeout: __classPrivateFieldGet(this, _IssueCounter_throttlerTimeout, "f"),
            compact: __classPrivateFieldGet(this, _IssueCounter_compact, "f"),
            issuesManager: __classPrivateFieldGet(this, _IssueCounter_issuesManager, "f"),
        };
    }
}
_IssueCounter_shadow = new WeakMap(), _IssueCounter_clickHandler = new WeakMap(), _IssueCounter_tooltipCallback = new WeakMap(), _IssueCounter_leadingText = new WeakMap(), _IssueCounter_throttler = new WeakMap(), _IssueCounter_counts = new WeakMap(), _IssueCounter_displayMode = new WeakMap(), _IssueCounter_issuesManager = new WeakMap(), _IssueCounter_accessibleName = new WeakMap(), _IssueCounter_throttlerTimeout = new WeakMap(), _IssueCounter_compact = new WeakMap(), _IssueCounter_instances = new WeakSet(), _IssueCounter_render = function _IssueCounter_render() {
    if (!__classPrivateFieldGet(this, _IssueCounter_issuesManager, "f")) {
        return;
    }
    __classPrivateFieldSet(this, _IssueCounter_counts, [
        __classPrivateFieldGet(this, _IssueCounter_issuesManager, "f").numberOfIssues("PageError" /* IssuesManager.Issue.IssueKind.PAGE_ERROR */),
        __classPrivateFieldGet(this, _IssueCounter_issuesManager, "f").numberOfIssues("BreakingChange" /* IssuesManager.Issue.IssueKind.BREAKING_CHANGE */),
        __classPrivateFieldGet(this, _IssueCounter_issuesManager, "f").numberOfIssues("Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */),
    ], "f");
    const importance = [
        "PageError" /* IssuesManager.Issue.IssueKind.PAGE_ERROR */,
        "BreakingChange" /* IssuesManager.Issue.IssueKind.BREAKING_CHANGE */,
        "Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */,
    ];
    const mostImportant = importance[__classPrivateFieldGet(this, _IssueCounter_counts, "f").findIndex(x => x > 0) ?? 2];
    const countToString = (kind, count) => {
        switch (__classPrivateFieldGet(this, _IssueCounter_displayMode, "f")) {
            case "OmitEmpty" /* DisplayMode.OMIT_EMPTY */:
                return count > 0 ? `${count}` : undefined;
            case "ShowAlways" /* DisplayMode.SHOW_ALWAYS */:
                return `${count}`;
            case "OnlyMostImportant" /* DisplayMode.ONLY_MOST_IMPORTANT */:
                return kind === mostImportant ? `${count}` : undefined;
        }
    };
    const iconSize = '2ex';
    const data = {
        groups: [
            {
                ...toIconGroup(getIssueKindIconData("PageError" /* IssuesManager.Issue.IssueKind.PAGE_ERROR */), iconSize),
                text: countToString("PageError" /* IssuesManager.Issue.IssueKind.PAGE_ERROR */, __classPrivateFieldGet(this, _IssueCounter_counts, "f")[0]),
            },
            {
                ...toIconGroup(getIssueKindIconData("BreakingChange" /* IssuesManager.Issue.IssueKind.BREAKING_CHANGE */), iconSize),
                text: countToString("BreakingChange" /* IssuesManager.Issue.IssueKind.BREAKING_CHANGE */, __classPrivateFieldGet(this, _IssueCounter_counts, "f")[1]),
            },
            {
                ...toIconGroup(getIssueKindIconData("Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */), iconSize),
                text: countToString("Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */, __classPrivateFieldGet(this, _IssueCounter_counts, "f")[2]),
            },
        ],
        clickHandler: __classPrivateFieldGet(this, _IssueCounter_clickHandler, "f"),
        leadingText: __classPrivateFieldGet(this, _IssueCounter_leadingText, "f"),
        accessibleName: __classPrivateFieldGet(this, _IssueCounter_accessibleName, "f"),
        compact: __classPrivateFieldGet(this, _IssueCounter_compact, "f"),
    };
    render(html `
        <style>${issueCounterStyles}</style>
        <icon-button .data=${data} .accessibleName=${__classPrivateFieldGet(this, _IssueCounter_accessibleName, "f")}></icon-button>
        `, __classPrivateFieldGet(this, _IssueCounter_shadow, "f"), { host: this });
    __classPrivateFieldGet(this, _IssueCounter_tooltipCallback, "f")?.call(this);
};
customElements.define('devtools-issue-counter', IssueCounter);
//# sourceMappingURL=IssueCounter.js.map