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
var _NodeChildTargetManager_instances, _NodeChildTargetManager_targetManager, _NodeChildTargetManager_parentTarget, _NodeChildTargetManager_targetAgent, _NodeChildTargetManager_childTargets, _NodeChildTargetManager_childConnections, _NodeChildTargetManager_devicesDiscoveryConfigChanged, _NodeConnection_targetAgent, _NodeConnection_sessionId, _NodeConnection_onDisconnect;
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Components from '../../ui/legacy/components/utils/utils.js';
const UIStrings = {
    /**
     *@description Text that refers to the main target
     */
    main: 'Main',
    /**
     *@description Text in Node Main of the Sources panel when debugging a Node.js app
     *@example {example.com} PH1
     */
    nodejsS: 'Node.js: {PH1}',
    /**
     *@description Text in DevTools window title when debugging a Node.js app
     *@example {example.com} PH1
     */
    NodejsTitleS: 'DevTools - Node.js: {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('entrypoints/node_app/NodeMain.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
let nodeMainImplInstance;
export class NodeMainImpl {
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!nodeMainImplInstance || forceNew) {
            nodeMainImplInstance = new NodeMainImpl();
        }
        return nodeMainImplInstance;
    }
    async run() {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.ConnectToNodeJSFromFrontend);
        void SDK.Connections.initMainConnection(async () => {
            const target = SDK.TargetManager.TargetManager.instance().createTarget(
            // TODO: Use SDK.Target.Type.NODE rather thatn BROWSER once DevTools is loaded appropriately in that case.
            'main', i18nString(UIStrings.main), SDK.Target.Type.BROWSER, null);
            target.setInspectedURL('Node.js');
        }, Components.TargetDetachedDialog.TargetDetachedDialog.connectionLost);
    }
}
export class NodeChildTargetManager extends SDK.SDKModel.SDKModel {
    constructor(parentTarget) {
        super(parentTarget);
        _NodeChildTargetManager_instances.add(this);
        _NodeChildTargetManager_targetManager.set(this, void 0);
        _NodeChildTargetManager_parentTarget.set(this, void 0);
        _NodeChildTargetManager_targetAgent.set(this, void 0);
        _NodeChildTargetManager_childTargets.set(this, new Map());
        _NodeChildTargetManager_childConnections.set(this, new Map());
        __classPrivateFieldSet(this, _NodeChildTargetManager_targetManager, parentTarget.targetManager(), "f");
        __classPrivateFieldSet(this, _NodeChildTargetManager_parentTarget, parentTarget, "f");
        __classPrivateFieldSet(this, _NodeChildTargetManager_targetAgent, parentTarget.targetAgent(), "f");
        parentTarget.registerTargetDispatcher(this);
        void __classPrivateFieldGet(this, _NodeChildTargetManager_targetAgent, "f").invoke_setDiscoverTargets({ discover: true });
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.events.addEventListener(Host.InspectorFrontendHostAPI.Events.DevicesDiscoveryConfigChanged, __classPrivateFieldGet(this, _NodeChildTargetManager_instances, "m", _NodeChildTargetManager_devicesDiscoveryConfigChanged), this);
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.setDevicesUpdatesEnabled(false);
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.setDevicesUpdatesEnabled(true);
    }
    dispose() {
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.events.removeEventListener(Host.InspectorFrontendHostAPI.Events.DevicesDiscoveryConfigChanged, __classPrivateFieldGet(this, _NodeChildTargetManager_instances, "m", _NodeChildTargetManager_devicesDiscoveryConfigChanged), this);
        for (const sessionId of __classPrivateFieldGet(this, _NodeChildTargetManager_childTargets, "f").keys()) {
            this.detachedFromTarget({ sessionId });
        }
    }
    targetCreated({ targetInfo }) {
        if (targetInfo.type === 'node' && !targetInfo.attached) {
            void __classPrivateFieldGet(this, _NodeChildTargetManager_targetAgent, "f").invoke_attachToTarget({ targetId: targetInfo.targetId, flatten: false });
        }
        else if (targetInfo.type === 'node_worker') {
            void __classPrivateFieldGet(this, _NodeChildTargetManager_targetAgent, "f").invoke_setAutoAttach({ autoAttach: true, waitForDebuggerOnStart: false });
        }
    }
    targetInfoChanged(_event) {
    }
    targetDestroyed(_event) {
    }
    attachedToTarget({ sessionId, targetInfo }) {
        let target;
        if (targetInfo.type === 'node_worker') {
            target = __classPrivateFieldGet(this, _NodeChildTargetManager_targetManager, "f").createTarget(targetInfo.targetId, targetInfo.title, SDK.Target.Type.NODE_WORKER, __classPrivateFieldGet(this, _NodeChildTargetManager_parentTarget, "f"), sessionId, true, undefined, targetInfo);
        }
        else {
            const name = i18nString(UIStrings.nodejsS, { PH1: targetInfo.url });
            document.title = i18nString(UIStrings.NodejsTitleS, { PH1: targetInfo.url });
            const connection = new NodeConnection(__classPrivateFieldGet(this, _NodeChildTargetManager_targetAgent, "f"), sessionId);
            __classPrivateFieldGet(this, _NodeChildTargetManager_childConnections, "f").set(sessionId, connection);
            target = __classPrivateFieldGet(this, _NodeChildTargetManager_targetManager, "f").createTarget(targetInfo.targetId, name, SDK.Target.Type.NODE, __classPrivateFieldGet(this, _NodeChildTargetManager_parentTarget, "f"), undefined, undefined, connection);
        }
        __classPrivateFieldGet(this, _NodeChildTargetManager_childTargets, "f").set(sessionId, target);
        void target.runtimeAgent().invoke_runIfWaitingForDebugger();
    }
    detachedFromTarget({ sessionId }) {
        const childTarget = __classPrivateFieldGet(this, _NodeChildTargetManager_childTargets, "f").get(sessionId);
        if (childTarget) {
            childTarget.dispose('target terminated');
        }
        __classPrivateFieldGet(this, _NodeChildTargetManager_childTargets, "f").delete(sessionId);
        __classPrivateFieldGet(this, _NodeChildTargetManager_childConnections, "f").delete(sessionId);
    }
    receivedMessageFromTarget({ sessionId, message }) {
        const connection = __classPrivateFieldGet(this, _NodeChildTargetManager_childConnections, "f").get(sessionId);
        const onMessage = connection ? connection.onMessage : null;
        if (onMessage) {
            onMessage.call(null, message);
        }
    }
    targetCrashed(_event) {
    }
}
_NodeChildTargetManager_targetManager = new WeakMap(), _NodeChildTargetManager_parentTarget = new WeakMap(), _NodeChildTargetManager_targetAgent = new WeakMap(), _NodeChildTargetManager_childTargets = new WeakMap(), _NodeChildTargetManager_childConnections = new WeakMap(), _NodeChildTargetManager_instances = new WeakSet(), _NodeChildTargetManager_devicesDiscoveryConfigChanged = function _NodeChildTargetManager_devicesDiscoveryConfigChanged({ data: config }) {
    const locations = [];
    for (const address of config.networkDiscoveryConfig) {
        const parts = address.split(':');
        const port = parseInt(parts[1], 10);
        if (parts[0] && port) {
            locations.push({ host: parts[0], port });
        }
    }
    void __classPrivateFieldGet(this, _NodeChildTargetManager_targetAgent, "f").invoke_setRemoteLocations({ locations });
};
export class NodeConnection {
    constructor(targetAgent, sessionId) {
        _NodeConnection_targetAgent.set(this, void 0);
        _NodeConnection_sessionId.set(this, void 0);
        _NodeConnection_onDisconnect.set(this, void 0);
        __classPrivateFieldSet(this, _NodeConnection_targetAgent, targetAgent, "f");
        __classPrivateFieldSet(this, _NodeConnection_sessionId, sessionId, "f");
        this.onMessage = null;
        __classPrivateFieldSet(this, _NodeConnection_onDisconnect, null, "f");
    }
    setOnMessage(onMessage) {
        this.onMessage = onMessage;
    }
    setOnDisconnect(onDisconnect) {
        __classPrivateFieldSet(this, _NodeConnection_onDisconnect, onDisconnect, "f");
    }
    sendRawMessage(message) {
        void __classPrivateFieldGet(this, _NodeConnection_targetAgent, "f").invoke_sendMessageToTarget({ message, sessionId: __classPrivateFieldGet(this, _NodeConnection_sessionId, "f") });
    }
    async disconnect() {
        if (__classPrivateFieldGet(this, _NodeConnection_onDisconnect, "f")) {
            __classPrivateFieldGet(this, _NodeConnection_onDisconnect, "f").call(null, 'force disconnect');
        }
        __classPrivateFieldSet(this, _NodeConnection_onDisconnect, null, "f");
        this.onMessage = null;
        await __classPrivateFieldGet(this, _NodeConnection_targetAgent, "f").invoke_detachFromTarget({ sessionId: __classPrivateFieldGet(this, _NodeConnection_sessionId, "f") });
    }
}
_NodeConnection_targetAgent = new WeakMap(), _NodeConnection_sessionId = new WeakMap(), _NodeConnection_onDisconnect = new WeakMap();
SDK.SDKModel.SDKModel.register(NodeChildTargetManager, { capabilities: 32 /* SDK.Target.Capability.TARGET */, autostart: true });
//# sourceMappingURL=NodeMain.js.map