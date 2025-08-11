// Copyright 2019 The Chromium Authors. All rights reserved.
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
var _IssuesModel_disposed, _IssuesModel_enabled;
import { SDKModel } from './SDKModel.js';
/**
 * The `IssuesModel` is a thin dispatch that does not store issues, but only creates the representation
 * class (usually derived from `Issue`) and passes the instances on via a dispatched event.
 * We chose this approach here because the lifetime of the Model is tied to the target, but DevTools
 * wants to preserve issues for targets (e.g. iframes) that are already gone as well.
 */
export class IssuesModel extends SDKModel {
    constructor(target) {
        super(target);
        _IssuesModel_disposed.set(this, false);
        _IssuesModel_enabled.set(this, false);
        void this.ensureEnabled();
    }
    async ensureEnabled() {
        if (__classPrivateFieldGet(this, _IssuesModel_enabled, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _IssuesModel_enabled, true, "f");
        this.target().registerAuditsDispatcher(this);
        const auditsAgent = this.target().auditsAgent();
        await auditsAgent.invoke_enable();
    }
    issueAdded(issueAddedEvent) {
        this.dispatchEventToListeners("IssueAdded" /* Events.ISSUE_ADDED */, { issuesModel: this, inspectorIssue: issueAddedEvent.issue });
    }
    dispose() {
        super.dispose();
        __classPrivateFieldSet(this, _IssuesModel_disposed, true, "f");
    }
    getTargetIfNotDisposed() {
        if (!__classPrivateFieldGet(this, _IssuesModel_disposed, "f")) {
            return this.target();
        }
        return null;
    }
}
_IssuesModel_disposed = new WeakMap(), _IssuesModel_enabled = new WeakMap();
export var Events;
(function (Events) {
    Events["ISSUE_ADDED"] = "IssueAdded";
})(Events || (Events = {}));
SDKModel.register(IssuesModel, { capabilities: 32768 /* Capability.AUDITS */, autostart: true });
//# sourceMappingURL=IssuesModel.js.map