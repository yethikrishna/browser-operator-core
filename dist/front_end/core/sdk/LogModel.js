// Copyright 2017 The Chromium Authors. All rights reserved.
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
var _LogModel_logAgent;
import * as Host from '../host/host.js';
import { SDKModel } from './SDKModel.js';
export class LogModel extends SDKModel {
    constructor(target) {
        super(target);
        _LogModel_logAgent.set(this, void 0);
        target.registerLogDispatcher(this);
        __classPrivateFieldSet(this, _LogModel_logAgent, target.logAgent(), "f");
        void __classPrivateFieldGet(this, _LogModel_logAgent, "f").invoke_enable();
        if (!Host.InspectorFrontendHost.isUnderTest()) {
            void __classPrivateFieldGet(this, _LogModel_logAgent, "f").invoke_startViolationsReport({
                config: [
                    { name: "longTask" /* Protocol.Log.ViolationSettingName.LongTask */, threshold: 200 },
                    { name: "longLayout" /* Protocol.Log.ViolationSettingName.LongLayout */, threshold: 30 },
                    { name: "blockedEvent" /* Protocol.Log.ViolationSettingName.BlockedEvent */, threshold: 100 },
                    { name: "blockedParser" /* Protocol.Log.ViolationSettingName.BlockedParser */, threshold: -1 },
                    { name: "handler" /* Protocol.Log.ViolationSettingName.Handler */, threshold: 150 },
                    { name: "recurringHandler" /* Protocol.Log.ViolationSettingName.RecurringHandler */, threshold: 50 },
                    { name: "discouragedAPIUse" /* Protocol.Log.ViolationSettingName.DiscouragedAPIUse */, threshold: -1 },
                ],
            });
        }
    }
    entryAdded({ entry }) {
        this.dispatchEventToListeners("EntryAdded" /* Events.ENTRY_ADDED */, { logModel: this, entry });
    }
    requestClear() {
        void __classPrivateFieldGet(this, _LogModel_logAgent, "f").invoke_clear();
    }
}
_LogModel_logAgent = new WeakMap();
export var Events;
(function (Events) {
    Events["ENTRY_ADDED"] = "EntryAdded";
})(Events || (Events = {}));
SDKModel.register(LogModel, { capabilities: 8 /* Capability.LOG */, autostart: true });
//# sourceMappingURL=LogModel.js.map