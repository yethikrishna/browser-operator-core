// Copyright 2019 The Chromium Authors. All rights reserved.
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
var _SDKModel_targetInternal;
import * as Common from '../common/common.js';
const registeredModels = new Map();
// TODO(crbug.com/1228674) Remove defaults for generic type parameters once
//                         all event emitters and sinks have been migrated.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SDKModel extends Common.ObjectWrapper.ObjectWrapper {
    constructor(target) {
        super();
        _SDKModel_targetInternal.set(this, void 0);
        __classPrivateFieldSet(this, _SDKModel_targetInternal, target, "f");
    }
    target() {
        return __classPrivateFieldGet(this, _SDKModel_targetInternal, "f");
    }
    /**
     * Override this method to perform tasks that are required to suspend the
     * model and that still need other models in an unsuspended state.
     */
    async preSuspendModel(_reason) {
    }
    async suspendModel(_reason) {
    }
    async resumeModel() {
    }
    /**
     * Override this method to perform tasks that are required to after resuming
     * the model and that require all models already in an unsuspended state.
     */
    async postResumeModel() {
    }
    dispose() {
    }
    static register(modelClass, registrationInfo) {
        if (registrationInfo.early && !registrationInfo.autostart) {
            throw new Error(`Error registering model ${modelClass.name}: early models must be autostarted.`);
        }
        registeredModels.set(modelClass, registrationInfo);
    }
    static get registeredModels() {
        return registeredModels;
    }
}
_SDKModel_targetInternal = new WeakMap();
//# sourceMappingURL=SDKModel.js.map