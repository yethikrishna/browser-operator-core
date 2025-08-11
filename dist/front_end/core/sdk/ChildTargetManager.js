// Copyright 2018 The Chromium Authors. All rights reserved.
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
var _ChildTargetManager_targetManager, _ChildTargetManager_parentTarget, _ChildTargetManager_targetAgent, _ChildTargetManager_targetInfosInternal, _ChildTargetManager_childTargetsBySessionId, _ChildTargetManager_childTargetsById, _ChildTargetManager_parallelConnections, _ChildTargetManager_parentTargetId;
import * as i18n from '../../core/i18n/i18n.js';
import * as Common from '../common/common.js';
import * as Host from '../host/host.js';
import { ParallelConnection } from './Connections.js';
import { ResourceTreeModel } from './ResourceTreeModel.js';
import { SDKModel } from './SDKModel.js';
import { Type } from './Target.js';
import { TargetManager } from './TargetManager.js';
const UIStrings = {
    /**
     * @description Text that refers to the main target. The main target is the primary webpage that
     * DevTools is connected to. This text is used in various places in the UI as a label/name to inform
     * the user which target/webpage they are currently connected to, as DevTools may connect to multiple
     * targets at the same time in some scenarios.
     */
    main: 'Main',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/ChildTargetManager.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ChildTargetManager extends SDKModel {
    constructor(parentTarget) {
        super(parentTarget);
        _ChildTargetManager_targetManager.set(this, void 0);
        _ChildTargetManager_parentTarget.set(this, void 0);
        _ChildTargetManager_targetAgent.set(this, void 0);
        _ChildTargetManager_targetInfosInternal.set(this, new Map());
        _ChildTargetManager_childTargetsBySessionId.set(this, new Map());
        _ChildTargetManager_childTargetsById.set(this, new Map());
        _ChildTargetManager_parallelConnections.set(this, new Map());
        _ChildTargetManager_parentTargetId.set(this, null);
        __classPrivateFieldSet(this, _ChildTargetManager_targetManager, parentTarget.targetManager(), "f");
        __classPrivateFieldSet(this, _ChildTargetManager_parentTarget, parentTarget, "f");
        __classPrivateFieldSet(this, _ChildTargetManager_targetAgent, parentTarget.targetAgent(), "f");
        parentTarget.registerTargetDispatcher(this);
        const browserTarget = __classPrivateFieldGet(this, _ChildTargetManager_targetManager, "f").browserTarget();
        if (browserTarget) {
            if (browserTarget !== parentTarget) {
                void browserTarget.targetAgent().invoke_autoAttachRelated({ targetId: parentTarget.id(), waitForDebuggerOnStart: true });
            }
        }
        else if (parentTarget.type() === Type.NODE) {
            void __classPrivateFieldGet(this, _ChildTargetManager_targetAgent, "f").invoke_setAutoAttach({ autoAttach: true, waitForDebuggerOnStart: true, flatten: false });
        }
        else {
            void __classPrivateFieldGet(this, _ChildTargetManager_targetAgent, "f").invoke_setAutoAttach({ autoAttach: true, waitForDebuggerOnStart: true, flatten: true });
        }
        if (parentTarget.parentTarget()?.type() !== Type.FRAME && !Host.InspectorFrontendHost.isUnderTest()) {
            void __classPrivateFieldGet(this, _ChildTargetManager_targetAgent, "f").invoke_setDiscoverTargets({ discover: true });
            void __classPrivateFieldGet(this, _ChildTargetManager_targetAgent, "f").invoke_setRemoteLocations({ locations: [{ host: 'localhost', port: 9229 }] });
        }
    }
    static install(attachCallback) {
        ChildTargetManager.attachCallback = attachCallback;
        SDKModel.register(ChildTargetManager, { capabilities: 32 /* Capability.TARGET */, autostart: true });
    }
    childTargets() {
        return Array.from(__classPrivateFieldGet(this, _ChildTargetManager_childTargetsBySessionId, "f").values());
    }
    async suspendModel() {
        await __classPrivateFieldGet(this, _ChildTargetManager_targetAgent, "f").invoke_setAutoAttach({ autoAttach: true, waitForDebuggerOnStart: false, flatten: true });
    }
    async resumeModel() {
        await __classPrivateFieldGet(this, _ChildTargetManager_targetAgent, "f").invoke_setAutoAttach({ autoAttach: true, waitForDebuggerOnStart: true, flatten: true });
    }
    dispose() {
        for (const sessionId of __classPrivateFieldGet(this, _ChildTargetManager_childTargetsBySessionId, "f").keys()) {
            this.detachedFromTarget({ sessionId, targetId: undefined });
        }
    }
    targetCreated({ targetInfo }) {
        __classPrivateFieldGet(this, _ChildTargetManager_targetInfosInternal, "f").set(targetInfo.targetId, targetInfo);
        this.fireAvailableTargetsChanged();
        this.dispatchEventToListeners("TargetCreated" /* Events.TARGET_CREATED */, targetInfo);
    }
    targetInfoChanged({ targetInfo }) {
        __classPrivateFieldGet(this, _ChildTargetManager_targetInfosInternal, "f").set(targetInfo.targetId, targetInfo);
        const target = __classPrivateFieldGet(this, _ChildTargetManager_childTargetsById, "f").get(targetInfo.targetId);
        if (target) {
            void target.setHasCrashed(false);
            if (target.targetInfo()?.subtype === 'prerender' && !targetInfo.subtype) {
                const resourceTreeModel = target.model(ResourceTreeModel);
                target.updateTargetInfo(targetInfo);
                if (resourceTreeModel?.mainFrame) {
                    resourceTreeModel.primaryPageChanged(resourceTreeModel.mainFrame, "Activation" /* PrimaryPageChangeType.ACTIVATION */);
                }
                target.setName(i18nString(UIStrings.main));
            }
            else {
                target.updateTargetInfo(targetInfo);
            }
        }
        this.fireAvailableTargetsChanged();
        this.dispatchEventToListeners("TargetInfoChanged" /* Events.TARGET_INFO_CHANGED */, targetInfo);
    }
    targetDestroyed({ targetId }) {
        __classPrivateFieldGet(this, _ChildTargetManager_targetInfosInternal, "f").delete(targetId);
        this.fireAvailableTargetsChanged();
        this.dispatchEventToListeners("TargetDestroyed" /* Events.TARGET_DESTROYED */, targetId);
    }
    targetCrashed({ targetId }) {
        const target = __classPrivateFieldGet(this, _ChildTargetManager_childTargetsById, "f").get(targetId);
        if (target) {
            target.setHasCrashed(true);
        }
    }
    fireAvailableTargetsChanged() {
        TargetManager.instance().dispatchEventToListeners("AvailableTargetsChanged" /* TargetManagerEvents.AVAILABLE_TARGETS_CHANGED */, [...__classPrivateFieldGet(this, _ChildTargetManager_targetInfosInternal, "f").values()]);
    }
    async getParentTargetId() {
        if (!__classPrivateFieldGet(this, _ChildTargetManager_parentTargetId, "f")) {
            __classPrivateFieldSet(this, _ChildTargetManager_parentTargetId, (await __classPrivateFieldGet(this, _ChildTargetManager_parentTarget, "f").targetAgent().invoke_getTargetInfo({})).targetInfo.targetId, "f");
        }
        return __classPrivateFieldGet(this, _ChildTargetManager_parentTargetId, "f");
    }
    async getTargetInfo() {
        return (await __classPrivateFieldGet(this, _ChildTargetManager_parentTarget, "f").targetAgent().invoke_getTargetInfo({})).targetInfo;
    }
    async attachedToTarget({ sessionId, targetInfo, waitingForDebugger }) {
        if (__classPrivateFieldGet(this, _ChildTargetManager_parentTargetId, "f") === targetInfo.targetId) {
            return;
        }
        let type = Type.BROWSER;
        let targetName = '';
        if (targetInfo.type === 'worker' && targetInfo.title && targetInfo.title !== targetInfo.url) {
            targetName = targetInfo.title;
        }
        else if (!['page', 'iframe', 'webview'].includes(targetInfo.type)) {
            const KNOWN_FRAME_PATTERNS = [
                '^chrome://print/$',
                '^chrome://file-manager/',
                '^chrome://feedback/',
                '^chrome://.*\\.top-chrome/$',
                '^chrome://view-cert/$',
                '^devtools://',
            ];
            if (KNOWN_FRAME_PATTERNS.some(p => targetInfo.url.match(p))) {
                type = Type.FRAME;
            }
            else {
                const parsedURL = Common.ParsedURL.ParsedURL.fromString(targetInfo.url);
                targetName =
                    parsedURL ? parsedURL.lastPathComponentWithFragment() : '#' + (++ChildTargetManager.lastAnonymousTargetId);
            }
        }
        if (targetInfo.type === 'iframe' || targetInfo.type === 'webview') {
            type = Type.FRAME;
        }
        else if (targetInfo.type === 'background_page' || targetInfo.type === 'app' || targetInfo.type === 'popup_page') {
            type = Type.FRAME;
        }
        else if (targetInfo.type === 'page') {
            type = Type.FRAME;
        }
        else if (targetInfo.type === 'worker') {
            type = Type.Worker;
        }
        else if (targetInfo.type === 'worklet') {
            type = Type.WORKLET;
        }
        else if (targetInfo.type === 'shared_worker') {
            type = Type.SHARED_WORKER;
        }
        else if (targetInfo.type === 'shared_storage_worklet') {
            type = Type.SHARED_STORAGE_WORKLET;
        }
        else if (targetInfo.type === 'service_worker') {
            type = Type.ServiceWorker;
        }
        else if (targetInfo.type === 'auction_worklet') {
            type = Type.AUCTION_WORKLET;
        }
        else if (targetInfo.type === 'node_worker') {
            type = Type.NODE_WORKER;
        }
        const target = __classPrivateFieldGet(this, _ChildTargetManager_targetManager, "f").createTarget(targetInfo.targetId, targetName, type, __classPrivateFieldGet(this, _ChildTargetManager_parentTarget, "f"), sessionId, undefined, undefined, targetInfo);
        __classPrivateFieldGet(this, _ChildTargetManager_childTargetsBySessionId, "f").set(sessionId, target);
        __classPrivateFieldGet(this, _ChildTargetManager_childTargetsById, "f").set(target.id(), target);
        if (ChildTargetManager.attachCallback) {
            await ChildTargetManager.attachCallback({ target, waitingForDebugger });
        }
        // [crbug/1423096] Invoking this on a worker session that is not waiting for the debugger can force the worker
        // to resume even if there is another session waiting for the debugger.
        if (waitingForDebugger) {
            void target.runtimeAgent().invoke_runIfWaitingForDebugger();
        }
    }
    detachedFromTarget({ sessionId }) {
        if (__classPrivateFieldGet(this, _ChildTargetManager_parallelConnections, "f").has(sessionId)) {
            __classPrivateFieldGet(this, _ChildTargetManager_parallelConnections, "f").delete(sessionId);
        }
        else {
            const target = __classPrivateFieldGet(this, _ChildTargetManager_childTargetsBySessionId, "f").get(sessionId);
            if (target) {
                target.dispose('target terminated');
                __classPrivateFieldGet(this, _ChildTargetManager_childTargetsBySessionId, "f").delete(sessionId);
                __classPrivateFieldGet(this, _ChildTargetManager_childTargetsById, "f").delete(target.id());
            }
        }
    }
    receivedMessageFromTarget({}) {
        // We use flatten protocol.
    }
    async createParallelConnection(onMessage) {
        // The main Target id is actually just `main`, instead of the real targetId.
        // Get the real id (requires an async operation) so that it can be used synchronously later.
        const targetId = await this.getParentTargetId();
        const { connection, sessionId } = await this.createParallelConnectionAndSessionForTarget(__classPrivateFieldGet(this, _ChildTargetManager_parentTarget, "f"), targetId);
        connection.setOnMessage(onMessage);
        __classPrivateFieldGet(this, _ChildTargetManager_parallelConnections, "f").set(sessionId, connection);
        return { connection, sessionId };
    }
    async createParallelConnectionAndSessionForTarget(target, targetId) {
        const targetAgent = target.targetAgent();
        const targetRouter = target.router();
        const sessionId = (await targetAgent.invoke_attachToTarget({ targetId, flatten: true })).sessionId;
        const connection = new ParallelConnection(targetRouter.connection(), sessionId);
        targetRouter.registerSession(target, sessionId, connection);
        connection.setOnDisconnect(() => {
            targetRouter.unregisterSession(sessionId);
            void targetAgent.invoke_detachFromTarget({ sessionId });
        });
        return { connection, sessionId };
    }
    targetInfos() {
        return Array.from(__classPrivateFieldGet(this, _ChildTargetManager_targetInfosInternal, "f").values());
    }
}
_ChildTargetManager_targetManager = new WeakMap(), _ChildTargetManager_parentTarget = new WeakMap(), _ChildTargetManager_targetAgent = new WeakMap(), _ChildTargetManager_targetInfosInternal = new WeakMap(), _ChildTargetManager_childTargetsBySessionId = new WeakMap(), _ChildTargetManager_childTargetsById = new WeakMap(), _ChildTargetManager_parallelConnections = new WeakMap(), _ChildTargetManager_parentTargetId = new WeakMap();
ChildTargetManager.lastAnonymousTargetId = 0;
export var Events;
(function (Events) {
    Events["TARGET_CREATED"] = "TargetCreated";
    Events["TARGET_DESTROYED"] = "TargetDestroyed";
    Events["TARGET_INFO_CHANGED"] = "TargetInfoChanged";
})(Events || (Events = {}));
//# sourceMappingURL=ChildTargetManager.js.map