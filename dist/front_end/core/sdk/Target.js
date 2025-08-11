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
var _Target_targetManagerInternal, _Target_nameInternal, _Target_inspectedURLInternal, _Target_inspectedURLName, _Target_capabilitiesMask, _Target_typeInternal, _Target_parentTargetInternal, _Target_idInternal, _Target_modelByConstructor, _Target_isSuspended, _Target_hasCrashed, _Target_targetInfoInternal, _Target_creatingModels;
import * as Common from '../common/common.js';
import * as Platform from '../platform/platform.js';
import * as ProtocolClient from '../protocol_client/protocol_client.js';
import { SDKModel } from './SDKModel.js';
export class Target extends ProtocolClient.InspectorBackend.TargetBase {
    constructor(targetManager, id, name, type, parentTarget, sessionId, suspended, connection, targetInfo) {
        const needsNodeJSPatching = type === Type.NODE;
        super(needsNodeJSPatching, parentTarget, sessionId, connection);
        _Target_targetManagerInternal.set(this, void 0);
        _Target_nameInternal.set(this, void 0);
        _Target_inspectedURLInternal.set(this, Platform.DevToolsPath.EmptyUrlString);
        _Target_inspectedURLName.set(this, '');
        _Target_capabilitiesMask.set(this, void 0);
        _Target_typeInternal.set(this, void 0);
        _Target_parentTargetInternal.set(this, void 0);
        _Target_idInternal.set(this, void 0);
        _Target_modelByConstructor.set(this, new Map());
        _Target_isSuspended.set(this, void 0);
        /**
         * Generally when a target crashes we don't need to know, with one exception.
         * If a target crashes during the recording of a performance trace, after the
         * trace when we try to resume() it, it will fail because it has crashed. This
         * causes the performance panel to freeze (see crbug.com/333989070). So we
         * mark the target as crashed so we can exit without trying to resume it. In
         * `ChildTargetManager` we will mark a target as "un-crashed" when we get the
         * `targetInfoChanged` event. This helps ensure we can deal with cases where
         * the page crashes, but a reload fixes it and the targets get restored (see
         * crbug.com/387258086).
         */
        _Target_hasCrashed.set(this, false);
        _Target_targetInfoInternal.set(this, void 0);
        _Target_creatingModels.set(this, void 0);
        __classPrivateFieldSet(this, _Target_targetManagerInternal, targetManager, "f");
        __classPrivateFieldSet(this, _Target_nameInternal, name, "f");
        __classPrivateFieldSet(this, _Target_capabilitiesMask, 0, "f");
        switch (type) {
            case Type.FRAME:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 1 /* Capability.BROWSER */ | 8192 /* Capability.STORAGE */ | 2 /* Capability.DOM */ | 4 /* Capability.JS */ |
                    8 /* Capability.LOG */ | 16 /* Capability.NETWORK */ | 32 /* Capability.TARGET */ | 128 /* Capability.TRACING */ | 256 /* Capability.EMULATION */ |
                    1024 /* Capability.INPUT */ | 2048 /* Capability.INSPECTOR */ | 32768 /* Capability.AUDITS */ | 65536 /* Capability.WEB_AUTHN */ | 131072 /* Capability.IO */ |
                    262144 /* Capability.MEDIA */ | 524288 /* Capability.EVENT_BREAKPOINTS */, "f");
                if (parentTarget?.type() !== Type.FRAME) {
                    // This matches backend exposing certain capabilities only for the main frame.
                    __classPrivateFieldSet(this, _Target_capabilitiesMask, __classPrivateFieldGet(this, _Target_capabilitiesMask, "f") | 4096 /* Capability.DEVICE_EMULATION */ | 64 /* Capability.SCREEN_CAPTURE */ | 512 /* Capability.SECURITY */ | 16384 /* Capability.SERVICE_WORKER */, "f");
                    if (Common.ParsedURL.schemeIs(targetInfo?.url, 'chrome-extension:')) {
                        __classPrivateFieldSet(this, _Target_capabilitiesMask, __classPrivateFieldGet(this, _Target_capabilitiesMask, "f") & ~512 /* Capability.SECURITY */, "f");
                    }
                    // TODO(dgozman): we report service workers for the whole frame tree on the main frame,
                    // while we should be able to only cover the subtree corresponding to the target.
                }
                break;
            case Type.ServiceWorker:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 4 /* Capability.JS */ | 8 /* Capability.LOG */ | 16 /* Capability.NETWORK */ | 32 /* Capability.TARGET */ |
                    2048 /* Capability.INSPECTOR */ | 131072 /* Capability.IO */ | 524288 /* Capability.EVENT_BREAKPOINTS */, "f");
                if (parentTarget?.type() !== Type.FRAME) {
                    __classPrivateFieldSet(this, _Target_capabilitiesMask, __classPrivateFieldGet(this, _Target_capabilitiesMask, "f") | 1 /* Capability.BROWSER */, "f");
                }
                break;
            case Type.SHARED_WORKER:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 4 /* Capability.JS */ | 8 /* Capability.LOG */ | 16 /* Capability.NETWORK */ | 32 /* Capability.TARGET */ |
                    131072 /* Capability.IO */ | 262144 /* Capability.MEDIA */ | 2048 /* Capability.INSPECTOR */ | 524288 /* Capability.EVENT_BREAKPOINTS */, "f");
                break;
            case Type.SHARED_STORAGE_WORKLET:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 4 /* Capability.JS */ | 8 /* Capability.LOG */ | 2048 /* Capability.INSPECTOR */ | 524288 /* Capability.EVENT_BREAKPOINTS */, "f");
                break;
            case Type.Worker:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 4 /* Capability.JS */ | 8 /* Capability.LOG */ | 16 /* Capability.NETWORK */ | 32 /* Capability.TARGET */ |
                    131072 /* Capability.IO */ | 262144 /* Capability.MEDIA */ | 256 /* Capability.EMULATION */ | 524288 /* Capability.EVENT_BREAKPOINTS */, "f");
                break;
            case Type.WORKLET:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 4 /* Capability.JS */ | 8 /* Capability.LOG */ | 524288 /* Capability.EVENT_BREAKPOINTS */ | 16 /* Capability.NETWORK */, "f");
                break;
            case Type.NODE:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 4 /* Capability.JS */ | 16 /* Capability.NETWORK */ | 32 /* Capability.TARGET */, "f");
                break;
            case Type.AUCTION_WORKLET:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 4 /* Capability.JS */ | 524288 /* Capability.EVENT_BREAKPOINTS */, "f");
                break;
            case Type.BROWSER:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 32 /* Capability.TARGET */ | 131072 /* Capability.IO */, "f");
                break;
            case Type.TAB:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 32 /* Capability.TARGET */ | 128 /* Capability.TRACING */, "f");
                break;
            case Type.NODE_WORKER:
                __classPrivateFieldSet(this, _Target_capabilitiesMask, 4 /* Capability.JS */ | 16 /* Capability.NETWORK */ | 32 /* Capability.TARGET */, "f");
        }
        __classPrivateFieldSet(this, _Target_typeInternal, type, "f");
        __classPrivateFieldSet(this, _Target_parentTargetInternal, parentTarget, "f");
        __classPrivateFieldSet(this, _Target_idInternal, id, "f");
        __classPrivateFieldSet(this, _Target_isSuspended, suspended, "f");
        __classPrivateFieldSet(this, _Target_targetInfoInternal, targetInfo, "f");
    }
    createModels(required) {
        __classPrivateFieldSet(this, _Target_creatingModels, true, "f");
        const registeredModels = Array.from(SDKModel.registeredModels.entries());
        // Create early models.
        for (const [modelClass, info] of registeredModels) {
            if (info.early) {
                this.model(modelClass);
            }
        }
        // Create autostart and required models.
        for (const [modelClass, info] of registeredModels) {
            if (info.autostart || required.has(modelClass)) {
                this.model(modelClass);
            }
        }
        __classPrivateFieldSet(this, _Target_creatingModels, false, "f");
    }
    id() {
        return __classPrivateFieldGet(this, _Target_idInternal, "f");
    }
    name() {
        return __classPrivateFieldGet(this, _Target_nameInternal, "f") || __classPrivateFieldGet(this, _Target_inspectedURLName, "f");
    }
    setName(name) {
        if (__classPrivateFieldGet(this, _Target_nameInternal, "f") === name) {
            return;
        }
        __classPrivateFieldSet(this, _Target_nameInternal, name, "f");
        __classPrivateFieldGet(this, _Target_targetManagerInternal, "f").onNameChange(this);
    }
    type() {
        return __classPrivateFieldGet(this, _Target_typeInternal, "f");
    }
    markAsNodeJSForTest() {
        super.markAsNodeJSForTest();
        __classPrivateFieldSet(this, _Target_typeInternal, Type.NODE, "f");
    }
    targetManager() {
        return __classPrivateFieldGet(this, _Target_targetManagerInternal, "f");
    }
    hasAllCapabilities(capabilitiesMask) {
        // TODO(dgozman): get rid of this method, once we never observe targets with
        // capability mask.
        return (__classPrivateFieldGet(this, _Target_capabilitiesMask, "f") & capabilitiesMask) === capabilitiesMask;
    }
    decorateLabel(label) {
        return (__classPrivateFieldGet(this, _Target_typeInternal, "f") === Type.Worker || __classPrivateFieldGet(this, _Target_typeInternal, "f") === Type.ServiceWorker) ? '\u2699 ' + label :
            label;
    }
    parentTarget() {
        return __classPrivateFieldGet(this, _Target_parentTargetInternal, "f");
    }
    outermostTarget() {
        let lastTarget = null;
        let currentTarget = this;
        do {
            if (currentTarget.type() !== Type.TAB && currentTarget.type() !== Type.BROWSER) {
                lastTarget = currentTarget;
            }
            currentTarget = currentTarget.parentTarget();
        } while (currentTarget);
        return lastTarget;
    }
    dispose(reason) {
        super.dispose(reason);
        __classPrivateFieldGet(this, _Target_targetManagerInternal, "f").removeTarget(this);
        for (const model of __classPrivateFieldGet(this, _Target_modelByConstructor, "f").values()) {
            model.dispose();
        }
    }
    model(modelClass) {
        if (!__classPrivateFieldGet(this, _Target_modelByConstructor, "f").get(modelClass)) {
            const info = SDKModel.registeredModels.get(modelClass);
            if (info === undefined) {
                throw new Error('Model class is not registered');
            }
            if ((__classPrivateFieldGet(this, _Target_capabilitiesMask, "f") & info.capabilities) === info.capabilities) {
                const model = new modelClass(this);
                __classPrivateFieldGet(this, _Target_modelByConstructor, "f").set(modelClass, model);
                if (!__classPrivateFieldGet(this, _Target_creatingModels, "f")) {
                    __classPrivateFieldGet(this, _Target_targetManagerInternal, "f").modelAdded(modelClass, model, __classPrivateFieldGet(this, _Target_targetManagerInternal, "f").isInScope(this));
                }
            }
        }
        return __classPrivateFieldGet(this, _Target_modelByConstructor, "f").get(modelClass) || null;
    }
    models() {
        return __classPrivateFieldGet(this, _Target_modelByConstructor, "f");
    }
    inspectedURL() {
        return __classPrivateFieldGet(this, _Target_inspectedURLInternal, "f");
    }
    setInspectedURL(inspectedURL) {
        __classPrivateFieldSet(this, _Target_inspectedURLInternal, inspectedURL, "f");
        const parsedURL = Common.ParsedURL.ParsedURL.fromString(inspectedURL);
        __classPrivateFieldSet(this, _Target_inspectedURLName, parsedURL ? parsedURL.lastPathComponentWithFragment() : '#' + __classPrivateFieldGet(this, _Target_idInternal, "f"), "f");
        __classPrivateFieldGet(this, _Target_targetManagerInternal, "f").onInspectedURLChange(this);
        if (!__classPrivateFieldGet(this, _Target_nameInternal, "f")) {
            __classPrivateFieldGet(this, _Target_targetManagerInternal, "f").onNameChange(this);
        }
    }
    hasCrashed() {
        return __classPrivateFieldGet(this, _Target_hasCrashed, "f");
    }
    setHasCrashed(isCrashed) {
        const wasCrashed = __classPrivateFieldGet(this, _Target_hasCrashed, "f");
        __classPrivateFieldSet(this, _Target_hasCrashed, isCrashed, "f");
        // If the target has now been restored, check to see if it needs resuming.
        // This ensures that if a target crashes whilst suspended, it is resumed
        // when it is recovered.
        // If the target is not suspended, resume() is a no-op, so it's safe to call.
        if (wasCrashed && !isCrashed) {
            void this.resume();
        }
    }
    async suspend(reason) {
        if (__classPrivateFieldGet(this, _Target_isSuspended, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _Target_isSuspended, true, "f");
        // If the target has crashed, we will not attempt to suspend all the
        // models, but we still mark it as suspended so we correctly track the
        // state.
        if (__classPrivateFieldGet(this, _Target_hasCrashed, "f")) {
            return;
        }
        await Promise.all(Array.from(this.models().values(), m => m.preSuspendModel(reason)));
        await Promise.all(Array.from(this.models().values(), m => m.suspendModel(reason)));
    }
    async resume() {
        if (!__classPrivateFieldGet(this, _Target_isSuspended, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _Target_isSuspended, false, "f");
        if (__classPrivateFieldGet(this, _Target_hasCrashed, "f")) {
            return;
        }
        await Promise.all(Array.from(this.models().values(), m => m.resumeModel()));
        await Promise.all(Array.from(this.models().values(), m => m.postResumeModel()));
    }
    suspended() {
        return __classPrivateFieldGet(this, _Target_isSuspended, "f");
    }
    updateTargetInfo(targetInfo) {
        __classPrivateFieldSet(this, _Target_targetInfoInternal, targetInfo, "f");
    }
    targetInfo() {
        return __classPrivateFieldGet(this, _Target_targetInfoInternal, "f");
    }
}
_Target_targetManagerInternal = new WeakMap(), _Target_nameInternal = new WeakMap(), _Target_inspectedURLInternal = new WeakMap(), _Target_inspectedURLName = new WeakMap(), _Target_capabilitiesMask = new WeakMap(), _Target_typeInternal = new WeakMap(), _Target_parentTargetInternal = new WeakMap(), _Target_idInternal = new WeakMap(), _Target_modelByConstructor = new WeakMap(), _Target_isSuspended = new WeakMap(), _Target_hasCrashed = new WeakMap(), _Target_targetInfoInternal = new WeakMap(), _Target_creatingModels = new WeakMap();
export var Type;
(function (Type) {
    Type["FRAME"] = "frame";
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Used by web_tests.
    Type["ServiceWorker"] = "service-worker";
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Used by web_tests.
    Type["Worker"] = "worker";
    Type["SHARED_WORKER"] = "shared-worker";
    Type["SHARED_STORAGE_WORKLET"] = "shared-storage-worklet";
    Type["NODE"] = "node";
    Type["BROWSER"] = "browser";
    Type["AUCTION_WORKLET"] = "auction-worklet";
    Type["WORKLET"] = "worklet";
    Type["TAB"] = "tab";
    Type["NODE_WORKER"] = "node-worker";
})(Type || (Type = {}));
export var Capability;
(function (Capability) {
    Capability[Capability["BROWSER"] = 1] = "BROWSER";
    Capability[Capability["DOM"] = 2] = "DOM";
    Capability[Capability["JS"] = 4] = "JS";
    Capability[Capability["LOG"] = 8] = "LOG";
    Capability[Capability["NETWORK"] = 16] = "NETWORK";
    Capability[Capability["TARGET"] = 32] = "TARGET";
    Capability[Capability["SCREEN_CAPTURE"] = 64] = "SCREEN_CAPTURE";
    Capability[Capability["TRACING"] = 128] = "TRACING";
    Capability[Capability["EMULATION"] = 256] = "EMULATION";
    Capability[Capability["SECURITY"] = 512] = "SECURITY";
    Capability[Capability["INPUT"] = 1024] = "INPUT";
    Capability[Capability["INSPECTOR"] = 2048] = "INSPECTOR";
    Capability[Capability["DEVICE_EMULATION"] = 4096] = "DEVICE_EMULATION";
    Capability[Capability["STORAGE"] = 8192] = "STORAGE";
    Capability[Capability["SERVICE_WORKER"] = 16384] = "SERVICE_WORKER";
    Capability[Capability["AUDITS"] = 32768] = "AUDITS";
    Capability[Capability["WEB_AUTHN"] = 65536] = "WEB_AUTHN";
    Capability[Capability["IO"] = 131072] = "IO";
    Capability[Capability["MEDIA"] = 262144] = "MEDIA";
    Capability[Capability["EVENT_BREAKPOINTS"] = 524288] = "EVENT_BREAKPOINTS";
    Capability[Capability["NONE"] = 0] = "NONE";
})(Capability || (Capability = {}));
//# sourceMappingURL=Target.js.map