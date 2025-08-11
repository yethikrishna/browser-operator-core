// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _IssueResolver_instances, _IssueResolver_issuesListener, _IssueResolver_issuesManager, _IssueResolver_onIssueAdded;
import * as Common from '../../core/common/common.js';
import { IssuesManager } from './IssuesManager.js';
/**
 * A class that facilitates resolving an issueId to an issue. See `ResolverBase` for more info.
 */
export class IssueResolver extends Common.ResolverBase.ResolverBase {
    constructor(issuesManager = IssuesManager.instance()) {
        super();
        _IssueResolver_instances.add(this);
        _IssueResolver_issuesListener.set(this, null);
        _IssueResolver_issuesManager.set(this, void 0);
        __classPrivateFieldSet(this, _IssueResolver_issuesManager, issuesManager, "f");
    }
    getForId(id) {
        return __classPrivateFieldGet(this, _IssueResolver_issuesManager, "f").getIssueById(id) || null;
    }
    startListening() {
        if (__classPrivateFieldGet(this, _IssueResolver_issuesListener, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _IssueResolver_issuesListener, __classPrivateFieldGet(this, _IssueResolver_issuesManager, "f").addEventListener("IssueAdded" /* IssueManagerEvents.ISSUE_ADDED */, __classPrivateFieldGet(this, _IssueResolver_instances, "m", _IssueResolver_onIssueAdded), this), "f");
    }
    stopListening() {
        if (!__classPrivateFieldGet(this, _IssueResolver_issuesListener, "f")) {
            return;
        }
        Common.EventTarget.removeEventListeners([__classPrivateFieldGet(this, _IssueResolver_issuesListener, "f")]);
        __classPrivateFieldSet(this, _IssueResolver_issuesListener, null, "f");
    }
}
_IssueResolver_issuesListener = new WeakMap(), _IssueResolver_issuesManager = new WeakMap(), _IssueResolver_instances = new WeakSet(), _IssueResolver_onIssueAdded = function _IssueResolver_onIssueAdded(event) {
    const { issue } = event.data;
    const id = issue.getIssueId();
    if (id) {
        this.onResolve(id, issue);
    }
};
//# sourceMappingURL=IssueResolver.js.map