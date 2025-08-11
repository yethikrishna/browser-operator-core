// Copyright 2014 The Chromium Authors. All rights reserved.
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
var _ExecutionContextSelector_instances, _ExecutionContextSelector_targetManager, _ExecutionContextSelector_context, _ExecutionContextSelector_lastSelectedContextId, _ExecutionContextSelector_ignoreContextChanged, _ExecutionContextSelector_executionContextChanged, _ExecutionContextSelector_contextPersistentId, _ExecutionContextSelector_targetChanged, _ExecutionContextSelector_shouldSwitchToContext, _ExecutionContextSelector_isDefaultContext, _ExecutionContextSelector_onExecutionContextCreated, _ExecutionContextSelector_onExecutionContextDestroyed, _ExecutionContextSelector_onExecutionContextOrderChanged, _ExecutionContextSelector_switchContextIfNecessary, _ExecutionContextSelector_currentExecutionContextGone;
import * as SDK from '../../core/sdk/sdk.js';
export class ExecutionContextSelector {
    constructor(targetManager, context) {
        _ExecutionContextSelector_instances.add(this);
        _ExecutionContextSelector_targetManager.set(this, void 0);
        _ExecutionContextSelector_context.set(this, void 0);
        _ExecutionContextSelector_lastSelectedContextId.set(this, void 0);
        _ExecutionContextSelector_ignoreContextChanged.set(this, void 0);
        context.addFlavorChangeListener(SDK.RuntimeModel.ExecutionContext, __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_executionContextChanged), this);
        context.addFlavorChangeListener(SDK.Target.Target, __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_targetChanged), this);
        targetManager.addModelListener(SDK.RuntimeModel.RuntimeModel, SDK.RuntimeModel.Events.ExecutionContextCreated, __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_onExecutionContextCreated), this);
        targetManager.addModelListener(SDK.RuntimeModel.RuntimeModel, SDK.RuntimeModel.Events.ExecutionContextDestroyed, __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_onExecutionContextDestroyed), this);
        targetManager.addModelListener(SDK.RuntimeModel.RuntimeModel, SDK.RuntimeModel.Events.ExecutionContextOrderChanged, __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_onExecutionContextOrderChanged), this);
        __classPrivateFieldSet(this, _ExecutionContextSelector_targetManager, targetManager, "f");
        __classPrivateFieldSet(this, _ExecutionContextSelector_context, context, "f");
        targetManager.observeModels(SDK.RuntimeModel.RuntimeModel, this);
    }
    modelAdded(runtimeModel) {
        // Defer selecting default target since we need all clients to get their
        // targetAdded notifications first.
        queueMicrotask(deferred.bind(this));
        function deferred() {
            // We always want the second context for the service worker targets.
            if (!__classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").flavor(SDK.Target.Target)) {
                __classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").setFlavor(SDK.Target.Target, runtimeModel.target());
            }
        }
    }
    modelRemoved(runtimeModel) {
        const currentExecutionContext = __classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").flavor(SDK.RuntimeModel.ExecutionContext);
        if (currentExecutionContext && currentExecutionContext.runtimeModel === runtimeModel) {
            __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_currentExecutionContextGone).call(this);
        }
        const models = __classPrivateFieldGet(this, _ExecutionContextSelector_targetManager, "f").models(SDK.RuntimeModel.RuntimeModel);
        if (__classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").flavor(SDK.Target.Target) === runtimeModel.target() && models.length) {
            __classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").setFlavor(SDK.Target.Target, models[0].target());
        }
    }
}
_ExecutionContextSelector_targetManager = new WeakMap(), _ExecutionContextSelector_context = new WeakMap(), _ExecutionContextSelector_lastSelectedContextId = new WeakMap(), _ExecutionContextSelector_ignoreContextChanged = new WeakMap(), _ExecutionContextSelector_instances = new WeakSet(), _ExecutionContextSelector_executionContextChanged = function _ExecutionContextSelector_executionContextChanged({ data: newContext, }) {
    if (newContext) {
        __classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").setFlavor(SDK.Target.Target, newContext.target());
        if (!__classPrivateFieldGet(this, _ExecutionContextSelector_ignoreContextChanged, "f")) {
            __classPrivateFieldSet(this, _ExecutionContextSelector_lastSelectedContextId, __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_contextPersistentId).call(this, newContext), "f");
        }
    }
}, _ExecutionContextSelector_contextPersistentId = function _ExecutionContextSelector_contextPersistentId(executionContext) {
    return executionContext.isDefault ? executionContext.target().name() + ':' + executionContext.frameId : '';
}, _ExecutionContextSelector_targetChanged = function _ExecutionContextSelector_targetChanged({ data: newTarget }) {
    const currentContext = __classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").flavor(SDK.RuntimeModel.ExecutionContext);
    if (!newTarget || (currentContext && currentContext.target() === newTarget)) {
        return;
    }
    const runtimeModel = newTarget.model(SDK.RuntimeModel.RuntimeModel);
    const executionContexts = runtimeModel ? runtimeModel.executionContexts() : [];
    if (!executionContexts.length) {
        return;
    }
    let newContext = null;
    for (let i = 0; i < executionContexts.length && !newContext; ++i) {
        if (__classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_shouldSwitchToContext).call(this, executionContexts[i])) {
            newContext = executionContexts[i];
        }
    }
    for (let i = 0; i < executionContexts.length && !newContext; ++i) {
        if (__classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_isDefaultContext).call(this, executionContexts[i])) {
            newContext = executionContexts[i];
        }
    }
    __classPrivateFieldSet(this, _ExecutionContextSelector_ignoreContextChanged, true, "f");
    __classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").setFlavor(SDK.RuntimeModel.ExecutionContext, newContext || executionContexts[0]);
    __classPrivateFieldSet(this, _ExecutionContextSelector_ignoreContextChanged, false, "f");
}, _ExecutionContextSelector_shouldSwitchToContext = function _ExecutionContextSelector_shouldSwitchToContext(executionContext) {
    if (executionContext.target().targetInfo()?.subtype) {
        return false;
    }
    if (__classPrivateFieldGet(this, _ExecutionContextSelector_lastSelectedContextId, "f") && __classPrivateFieldGet(this, _ExecutionContextSelector_lastSelectedContextId, "f") === __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_contextPersistentId).call(this, executionContext)) {
        return true;
    }
    return !__classPrivateFieldGet(this, _ExecutionContextSelector_lastSelectedContextId, "f") && __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_isDefaultContext).call(this, executionContext);
}, _ExecutionContextSelector_isDefaultContext = function _ExecutionContextSelector_isDefaultContext(executionContext) {
    if (!executionContext.isDefault || !executionContext.frameId) {
        return false;
    }
    if (executionContext.target().parentTarget()?.type() === SDK.Target.Type.FRAME) {
        return false;
    }
    const resourceTreeModel = executionContext.target().model(SDK.ResourceTreeModel.ResourceTreeModel);
    const frame = resourceTreeModel?.frameForId(executionContext.frameId);
    return Boolean(frame?.isOutermostFrame());
}, _ExecutionContextSelector_onExecutionContextCreated = function _ExecutionContextSelector_onExecutionContextCreated(event) {
    if (__classPrivateFieldGet(this, _ExecutionContextSelector_lastSelectedContextId, "f") === undefined) {
        // We switch to the first context created (if applicable) but ignore sub-sequent
        // worker context creations.
        __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_switchContextIfNecessary).call(this, event.data);
        return;
    }
    switch (event.data.target().type()) {
        case SDK.Target.Type.AUCTION_WORKLET:
        case SDK.Target.Type.SHARED_STORAGE_WORKLET:
        case SDK.Target.Type.SHARED_WORKER:
        case SDK.Target.Type.ServiceWorker:
        case SDK.Target.Type.WORKLET:
        case SDK.Target.Type.Worker:
            return;
        case SDK.Target.Type.BROWSER:
        case SDK.Target.Type.FRAME:
        case SDK.Target.Type.NODE:
        case SDK.Target.Type.TAB:
            __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_switchContextIfNecessary).call(this, event.data);
            break;
    }
}, _ExecutionContextSelector_onExecutionContextDestroyed = function _ExecutionContextSelector_onExecutionContextDestroyed(event) {
    const executionContext = event.data;
    if (__classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").flavor(SDK.RuntimeModel.ExecutionContext) === executionContext) {
        __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_currentExecutionContextGone).call(this);
    }
}, _ExecutionContextSelector_onExecutionContextOrderChanged = function _ExecutionContextSelector_onExecutionContextOrderChanged(event) {
    const runtimeModel = event.data;
    const executionContexts = runtimeModel.executionContexts();
    for (let i = 0; i < executionContexts.length; i++) {
        if (__classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_switchContextIfNecessary).call(this, executionContexts[i])) {
            break;
        }
    }
}, _ExecutionContextSelector_switchContextIfNecessary = function _ExecutionContextSelector_switchContextIfNecessary(executionContext) {
    if (!__classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").flavor(SDK.RuntimeModel.ExecutionContext) || __classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_shouldSwitchToContext).call(this, executionContext)) {
        __classPrivateFieldSet(this, _ExecutionContextSelector_ignoreContextChanged, true, "f");
        __classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").setFlavor(SDK.RuntimeModel.ExecutionContext, executionContext);
        __classPrivateFieldSet(this, _ExecutionContextSelector_ignoreContextChanged, false, "f");
        return true;
    }
    return false;
}, _ExecutionContextSelector_currentExecutionContextGone = function _ExecutionContextSelector_currentExecutionContextGone() {
    const runtimeModels = __classPrivateFieldGet(this, _ExecutionContextSelector_targetManager, "f").models(SDK.RuntimeModel.RuntimeModel);
    let newContext = null;
    for (let i = 0; i < runtimeModels.length && !newContext; ++i) {
        const executionContexts = runtimeModels[i].executionContexts();
        for (const executionContext of executionContexts) {
            if (__classPrivateFieldGet(this, _ExecutionContextSelector_instances, "m", _ExecutionContextSelector_isDefaultContext).call(this, executionContext)) {
                newContext = executionContext;
                break;
            }
        }
    }
    if (!newContext) {
        for (let i = 0; i < runtimeModels.length && !newContext; ++i) {
            const executionContexts = runtimeModels[i].executionContexts();
            if (executionContexts.length) {
                newContext = executionContexts[0];
                break;
            }
        }
    }
    __classPrivateFieldSet(this, _ExecutionContextSelector_ignoreContextChanged, true, "f");
    __classPrivateFieldGet(this, _ExecutionContextSelector_context, "f").setFlavor(SDK.RuntimeModel.ExecutionContext, newContext);
    __classPrivateFieldSet(this, _ExecutionContextSelector_ignoreContextChanged, false, "f");
};
//# sourceMappingURL=ExecutionContextSelector.js.map