// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _SourceFrameIssuesManager_instances, _SourceFrameIssuesManager_sourceFrameMessageManager, _SourceFrameIssuesManager_onIssueAdded, _SourceFrameIssuesManager_addIssue, _SourceFrameIssuesManager_onFullUpdateRequired, _SourceFrameIssuesManager_isTrustedTypeIssue, _SourceFrameIssuesManager_isPropertyRuleIssue, _SourceFrameIssuesManager_isLateImportIssue, _SourceFrameIssuesManager_resetMessages, _IssueMessage_kind;
import * as Common from '../../core/common/common.js';
import * as Bindings from '../../models/bindings/bindings.js';
import * as Workspace from '../../models/workspace/workspace.js';
import { ContentSecurityPolicyIssue, trustedTypesPolicyViolationCode, trustedTypesSinkViolationCode, } from './ContentSecurityPolicyIssue.js';
import { toZeroBasedLocation } from './Issue.js';
import { getIssueTitleFromMarkdownDescription } from './MarkdownIssueDescription.js';
import { PropertyRuleIssue } from './PropertyRuleIssue.js';
import { lateImportStylesheetLoadingCode } from './StylesheetLoadingIssue.js';
export class SourceFrameIssuesManager {
    constructor(issuesManager) {
        _SourceFrameIssuesManager_instances.add(this);
        this.issuesManager = issuesManager;
        _SourceFrameIssuesManager_sourceFrameMessageManager.set(this, new Bindings.PresentationConsoleMessageHelper.PresentationSourceFrameMessageManager());
        this.issuesManager.addEventListener("IssueAdded" /* Events.ISSUE_ADDED */, __classPrivateFieldGet(this, _SourceFrameIssuesManager_instances, "m", _SourceFrameIssuesManager_onIssueAdded), this);
        this.issuesManager.addEventListener("FullUpdateRequired" /* Events.FULL_UPDATE_REQUIRED */, __classPrivateFieldGet(this, _SourceFrameIssuesManager_instances, "m", _SourceFrameIssuesManager_onFullUpdateRequired), this);
    }
}
_SourceFrameIssuesManager_sourceFrameMessageManager = new WeakMap(), _SourceFrameIssuesManager_instances = new WeakSet(), _SourceFrameIssuesManager_onIssueAdded = function _SourceFrameIssuesManager_onIssueAdded(event) {
    const { issue } = event.data;
    void __classPrivateFieldGet(this, _SourceFrameIssuesManager_instances, "m", _SourceFrameIssuesManager_addIssue).call(this, issue);
}, _SourceFrameIssuesManager_addIssue = async function _SourceFrameIssuesManager_addIssue(issue) {
    if (!__classPrivateFieldGet(this, _SourceFrameIssuesManager_instances, "m", _SourceFrameIssuesManager_isTrustedTypeIssue).call(this, issue) && !__classPrivateFieldGet(this, _SourceFrameIssuesManager_instances, "m", _SourceFrameIssuesManager_isLateImportIssue).call(this, issue) && !__classPrivateFieldGet(this, _SourceFrameIssuesManager_instances, "m", _SourceFrameIssuesManager_isPropertyRuleIssue).call(this, issue)) {
        return;
    }
    const issuesModel = issue.model();
    if (!issuesModel) {
        return;
    }
    const srcLocation = toZeroBasedLocation(issue.details().sourceCodeLocation);
    const description = issue.getDescription();
    if (!description || !srcLocation) {
        return;
    }
    const messageText = await getIssueTitleFromMarkdownDescription(description);
    if (!messageText) {
        return;
    }
    const clickHandler = () => {
        void Common.Revealer.reveal(issue);
    };
    __classPrivateFieldGet(this, _SourceFrameIssuesManager_sourceFrameMessageManager, "f").addMessage(new IssueMessage(messageText, issue.getKind(), clickHandler), {
        line: srcLocation.lineNumber,
        column: srcLocation.columnNumber ?? -1,
        url: srcLocation.url,
        scriptId: srcLocation.scriptId,
    }, issuesModel.target());
}, _SourceFrameIssuesManager_onFullUpdateRequired = function _SourceFrameIssuesManager_onFullUpdateRequired() {
    __classPrivateFieldGet(this, _SourceFrameIssuesManager_instances, "m", _SourceFrameIssuesManager_resetMessages).call(this);
    const issues = this.issuesManager.issues();
    for (const issue of issues) {
        void __classPrivateFieldGet(this, _SourceFrameIssuesManager_instances, "m", _SourceFrameIssuesManager_addIssue).call(this, issue);
    }
}, _SourceFrameIssuesManager_isTrustedTypeIssue = function _SourceFrameIssuesManager_isTrustedTypeIssue(issue) {
    return issue instanceof ContentSecurityPolicyIssue && issue.code() === trustedTypesSinkViolationCode ||
        issue.code() === trustedTypesPolicyViolationCode;
}, _SourceFrameIssuesManager_isPropertyRuleIssue = function _SourceFrameIssuesManager_isPropertyRuleIssue(issue) {
    return issue instanceof PropertyRuleIssue;
}, _SourceFrameIssuesManager_isLateImportIssue = function _SourceFrameIssuesManager_isLateImportIssue(issue) {
    return issue.code() === lateImportStylesheetLoadingCode;
}, _SourceFrameIssuesManager_resetMessages = function _SourceFrameIssuesManager_resetMessages() {
    __classPrivateFieldGet(this, _SourceFrameIssuesManager_sourceFrameMessageManager, "f").clear();
};
export class IssueMessage extends Workspace.UISourceCode.Message {
    constructor(title, kind, clickHandler) {
        super("Issue" /* Workspace.UISourceCode.Message.Level.ISSUE */, title, clickHandler);
        _IssueMessage_kind.set(this, void 0);
        __classPrivateFieldSet(this, _IssueMessage_kind, kind, "f");
    }
    getIssueKind() {
        return __classPrivateFieldGet(this, _IssueMessage_kind, "f");
    }
}
_IssueMessage_kind = new WeakMap();
//# sourceMappingURL=SourceFrameIssuesManager.js.map