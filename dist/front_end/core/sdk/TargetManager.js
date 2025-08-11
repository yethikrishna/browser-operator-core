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
var _TargetManager_targetsInternal, _TargetManager_observers, _TargetManager_modelListeners, _TargetManager_modelObservers, _TargetManager_scopedObservers, _TargetManager_isSuspended, _TargetManager_browserTargetInternal, _TargetManager_scopeTarget, _TargetManager_defaultScopeSet, _TargetManager_scopeChangeListeners;
import * as Common from '../common/common.js';
import * as Host from '../host/host.js';
import * as Platform from '../platform/platform.js';
import { assertNotNullOrUndefined } from '../platform/platform.js';
import * as Root from '../root/root.js';
import { SDKModel } from './SDKModel.js';
import { Target, Type as TargetType } from './Target.js';
let targetManagerInstance;
export class TargetManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _TargetManager_targetsInternal.set(this, void 0);
        _TargetManager_observers.set(this, void 0);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        _TargetManager_modelListeners.set(this, void 0);
        _TargetManager_modelObservers.set(this, void 0);
        _TargetManager_scopedObservers.set(this, void 0);
        /* eslint-enable @typescript-eslint/no-explicit-any */
        _TargetManager_isSuspended.set(this, void 0);
        _TargetManager_browserTargetInternal.set(this, void 0);
        _TargetManager_scopeTarget.set(this, void 0);
        _TargetManager_defaultScopeSet.set(this, void 0);
        _TargetManager_scopeChangeListeners.set(this, void 0);
        __classPrivateFieldSet(this, _TargetManager_targetsInternal, new Set(), "f");
        __classPrivateFieldSet(this, _TargetManager_observers, new Set(), "f");
        __classPrivateFieldSet(this, _TargetManager_modelListeners, new Platform.MapUtilities.Multimap(), "f");
        __classPrivateFieldSet(this, _TargetManager_modelObservers, new Platform.MapUtilities.Multimap(), "f");
        __classPrivateFieldSet(this, _TargetManager_isSuspended, false, "f");
        __classPrivateFieldSet(this, _TargetManager_browserTargetInternal, null, "f");
        __classPrivateFieldSet(this, _TargetManager_scopeTarget, null, "f");
        __classPrivateFieldSet(this, _TargetManager_scopedObservers, new WeakSet(), "f");
        __classPrivateFieldSet(this, _TargetManager_defaultScopeSet, false, "f");
        __classPrivateFieldSet(this, _TargetManager_scopeChangeListeners, new Set(), "f");
    }
    static instance({ forceNew } = { forceNew: false }) {
        if (!targetManagerInstance || forceNew) {
            targetManagerInstance = new TargetManager();
        }
        return targetManagerInstance;
    }
    static removeInstance() {
        targetManagerInstance = undefined;
    }
    onInspectedURLChange(target) {
        if (target !== __classPrivateFieldGet(this, _TargetManager_scopeTarget, "f")) {
            return;
        }
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.inspectedURLChanged(target.inspectedURL() || Platform.DevToolsPath.EmptyUrlString);
        this.dispatchEventToListeners("InspectedURLChanged" /* Events.INSPECTED_URL_CHANGED */, target);
    }
    onNameChange(target) {
        this.dispatchEventToListeners("NameChanged" /* Events.NAME_CHANGED */, target);
    }
    async suspendAllTargets(reason) {
        if (__classPrivateFieldGet(this, _TargetManager_isSuspended, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _TargetManager_isSuspended, true, "f");
        this.dispatchEventToListeners("SuspendStateChanged" /* Events.SUSPEND_STATE_CHANGED */);
        const suspendPromises = Array.from(__classPrivateFieldGet(this, _TargetManager_targetsInternal, "f").values(), target => target.suspend(reason));
        await Promise.all(suspendPromises);
    }
    async resumeAllTargets() {
        if (!__classPrivateFieldGet(this, _TargetManager_isSuspended, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _TargetManager_isSuspended, false, "f");
        this.dispatchEventToListeners("SuspendStateChanged" /* Events.SUSPEND_STATE_CHANGED */);
        const resumePromises = Array.from(__classPrivateFieldGet(this, _TargetManager_targetsInternal, "f").values(), target => target.resume());
        await Promise.all(resumePromises);
    }
    allTargetsSuspended() {
        return __classPrivateFieldGet(this, _TargetManager_isSuspended, "f");
    }
    models(modelClass, opts) {
        const result = [];
        for (const target of __classPrivateFieldGet(this, _TargetManager_targetsInternal, "f")) {
            if (opts?.scoped && !this.isInScope(target)) {
                continue;
            }
            const model = target.model(modelClass);
            if (!model) {
                continue;
            }
            result.push(model);
        }
        return result;
    }
    inspectedURL() {
        const mainTarget = this.primaryPageTarget();
        return mainTarget ? mainTarget.inspectedURL() : '';
    }
    observeModels(modelClass, observer, opts) {
        const models = this.models(modelClass, opts);
        __classPrivateFieldGet(this, _TargetManager_modelObservers, "f").set(modelClass, observer);
        if (opts?.scoped) {
            __classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").add(observer);
        }
        for (const model of models) {
            observer.modelAdded(model);
        }
    }
    unobserveModels(modelClass, observer) {
        __classPrivateFieldGet(this, _TargetManager_modelObservers, "f").delete(modelClass, observer);
        __classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").delete(observer);
    }
    modelAdded(modelClass, model, inScope) {
        for (const observer of __classPrivateFieldGet(this, _TargetManager_modelObservers, "f").get(modelClass).values()) {
            if (!__classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").has(observer) || inScope) {
                observer.modelAdded(model);
            }
        }
    }
    modelRemoved(modelClass, model, inScope) {
        for (const observer of __classPrivateFieldGet(this, _TargetManager_modelObservers, "f").get(modelClass).values()) {
            if (!__classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").has(observer) || inScope) {
                observer.modelRemoved(model);
            }
        }
    }
    addModelListener(modelClass, eventType, listener, thisObject, opts) {
        const wrappedListener = (event) => {
            if (!opts?.scoped || this.isInScope(event)) {
                listener.call(thisObject, event);
            }
        };
        for (const model of this.models(modelClass)) {
            model.addEventListener(eventType, wrappedListener);
        }
        __classPrivateFieldGet(this, _TargetManager_modelListeners, "f").set(eventType, { modelClass, thisObject, listener, wrappedListener });
    }
    removeModelListener(modelClass, eventType, listener, thisObject) {
        if (!__classPrivateFieldGet(this, _TargetManager_modelListeners, "f").has(eventType)) {
            return;
        }
        let wrappedListener = null;
        for (const info of __classPrivateFieldGet(this, _TargetManager_modelListeners, "f").get(eventType)) {
            if (info.modelClass === modelClass && info.listener === listener && info.thisObject === thisObject) {
                wrappedListener = info.wrappedListener;
                __classPrivateFieldGet(this, _TargetManager_modelListeners, "f").delete(eventType, info);
            }
        }
        if (wrappedListener) {
            for (const model of this.models(modelClass)) {
                model.removeEventListener(eventType, wrappedListener);
            }
        }
    }
    observeTargets(targetObserver, opts) {
        if (__classPrivateFieldGet(this, _TargetManager_observers, "f").has(targetObserver)) {
            throw new Error('Observer can only be registered once');
        }
        if (opts?.scoped) {
            __classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").add(targetObserver);
        }
        for (const target of __classPrivateFieldGet(this, _TargetManager_targetsInternal, "f")) {
            if (!opts?.scoped || this.isInScope(target)) {
                targetObserver.targetAdded(target);
            }
        }
        __classPrivateFieldGet(this, _TargetManager_observers, "f").add(targetObserver);
    }
    unobserveTargets(targetObserver) {
        __classPrivateFieldGet(this, _TargetManager_observers, "f").delete(targetObserver);
        __classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").delete(targetObserver);
    }
    createTarget(id, name, type, parentTarget, sessionId, waitForDebuggerInPage, connection, targetInfo) {
        const target = new Target(this, id, name, type, parentTarget, sessionId || '', __classPrivateFieldGet(this, _TargetManager_isSuspended, "f"), connection || null, targetInfo);
        if (waitForDebuggerInPage) {
            void target.pageAgent().invoke_waitForDebugger();
        }
        target.createModels(new Set(__classPrivateFieldGet(this, _TargetManager_modelObservers, "f").keysArray()));
        __classPrivateFieldGet(this, _TargetManager_targetsInternal, "f").add(target);
        const inScope = this.isInScope(target);
        // Iterate over a copy. #observers might be modified during iteration.
        for (const observer of [...__classPrivateFieldGet(this, _TargetManager_observers, "f")]) {
            if (!__classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").has(observer) || inScope) {
                observer.targetAdded(target);
            }
        }
        for (const [modelClass, model] of target.models().entries()) {
            this.modelAdded(modelClass, model, inScope);
        }
        for (const key of __classPrivateFieldGet(this, _TargetManager_modelListeners, "f").keysArray()) {
            for (const info of __classPrivateFieldGet(this, _TargetManager_modelListeners, "f").get(key)) {
                const model = target.model(info.modelClass);
                if (model) {
                    model.addEventListener(key, info.wrappedListener);
                }
            }
        }
        if ((target === target.outermostTarget() &&
            (target.type() !== TargetType.FRAME || target === this.primaryPageTarget())) &&
            !__classPrivateFieldGet(this, _TargetManager_defaultScopeSet, "f")) {
            this.setScopeTarget(target);
        }
        return target;
    }
    removeTarget(target) {
        if (!__classPrivateFieldGet(this, _TargetManager_targetsInternal, "f").has(target)) {
            return;
        }
        const inScope = this.isInScope(target);
        __classPrivateFieldGet(this, _TargetManager_targetsInternal, "f").delete(target);
        for (const modelClass of target.models().keys()) {
            const model = target.models().get(modelClass);
            assertNotNullOrUndefined(model);
            this.modelRemoved(modelClass, model, inScope);
        }
        // Iterate over a copy. #observers might be modified during iteration.
        for (const observer of [...__classPrivateFieldGet(this, _TargetManager_observers, "f")]) {
            if (!__classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").has(observer) || inScope) {
                observer.targetRemoved(target);
            }
        }
        for (const key of __classPrivateFieldGet(this, _TargetManager_modelListeners, "f").keysArray()) {
            for (const info of __classPrivateFieldGet(this, _TargetManager_modelListeners, "f").get(key)) {
                const model = target.model(info.modelClass);
                if (model) {
                    model.removeEventListener(key, info.wrappedListener);
                }
            }
        }
    }
    targets() {
        return [...__classPrivateFieldGet(this, _TargetManager_targetsInternal, "f")];
    }
    targetById(id) {
        // TODO(dgozman): add a map #id -> #target.
        return this.targets().find(target => target.id() === id) || null;
    }
    rootTarget() {
        if (__classPrivateFieldGet(this, _TargetManager_targetsInternal, "f").size === 0) {
            return null;
        }
        return __classPrivateFieldGet(this, _TargetManager_targetsInternal, "f").values().next().value ?? null;
    }
    primaryPageTarget() {
        let target = this.rootTarget();
        if (target?.type() === TargetType.TAB) {
            target =
                this.targets().find(t => t.parentTarget() === target && t.type() === TargetType.FRAME && !t.targetInfo()?.subtype?.length) ||
                    null;
        }
        return target;
    }
    browserTarget() {
        return __classPrivateFieldGet(this, _TargetManager_browserTargetInternal, "f");
    }
    async maybeAttachInitialTarget() {
        if (!Boolean(Root.Runtime.Runtime.queryParam('browserConnection'))) {
            return false;
        }
        if (!__classPrivateFieldGet(this, _TargetManager_browserTargetInternal, "f")) {
            __classPrivateFieldSet(this, _TargetManager_browserTargetInternal, new Target(this, /* #id*/ 'main', /* #name*/ 'browser', TargetType.BROWSER, /* #parentTarget*/ null, 
            /* #sessionId */ '', /* suspended*/ false, /* #connection*/ null, /* targetInfo*/ undefined), "f");
            __classPrivateFieldGet(this, _TargetManager_browserTargetInternal, "f").createModels(new Set(__classPrivateFieldGet(this, _TargetManager_modelObservers, "f").keysArray()));
        }
        const targetId = await Host.InspectorFrontendHost.InspectorFrontendHostInstance.initialTargetId();
        // Do not await for Target.autoAttachRelated to return, as it goes throguh the renderer and we don't want to block early
        // at front-end initialization if a renderer is stuck. The rest of #target discovery and auto-attach process should happen
        // asynchronously upon Target.attachedToTarget.
        void __classPrivateFieldGet(this, _TargetManager_browserTargetInternal, "f").targetAgent().invoke_autoAttachRelated({
            targetId,
            waitForDebuggerOnStart: true,
        });
        return true;
    }
    clearAllTargetsForTest() {
        __classPrivateFieldGet(this, _TargetManager_targetsInternal, "f").clear();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isInScope(arg) {
        if (!arg) {
            return false;
        }
        if (isSDKModelEvent(arg)) {
            arg = arg.source;
        }
        if (arg instanceof SDKModel) {
            arg = arg.target();
        }
        while (arg && arg !== __classPrivateFieldGet(this, _TargetManager_scopeTarget, "f")) {
            arg = arg.parentTarget();
        }
        return Boolean(arg) && arg === __classPrivateFieldGet(this, _TargetManager_scopeTarget, "f");
    }
    // Sets a root of a scope substree.
    // TargetManager API invoked with `scoped: true` will behave as if targets
    // outside of the scope subtree don't exist. Concretely this means that
    // target observers, model observers and model listeners won't be invoked for targets outside of the
    // scope tree. This method will invoke targetRemoved and modelRemoved for
    // objects in the previous scope, as if they disappear and then will invoke
    // targetAdded and modelAdded as if they just appeared.
    // Note that scopeTarget could be null, which will effectively prevent scoped
    // observes from getting any events.
    setScopeTarget(scopeTarget) {
        if (scopeTarget === __classPrivateFieldGet(this, _TargetManager_scopeTarget, "f")) {
            return;
        }
        for (const target of this.targets()) {
            if (!this.isInScope(target)) {
                continue;
            }
            for (const modelClass of __classPrivateFieldGet(this, _TargetManager_modelObservers, "f").keysArray()) {
                const model = target.models().get(modelClass);
                if (!model) {
                    continue;
                }
                for (const observer of [...__classPrivateFieldGet(this, _TargetManager_modelObservers, "f").get(modelClass)].filter(o => __classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").has(o))) {
                    observer.modelRemoved(model);
                }
            }
            // Iterate over a copy. #observers might be modified during iteration.
            for (const observer of [...__classPrivateFieldGet(this, _TargetManager_observers, "f")].filter(o => __classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").has(o))) {
                observer.targetRemoved(target);
            }
        }
        __classPrivateFieldSet(this, _TargetManager_scopeTarget, scopeTarget, "f");
        for (const target of this.targets()) {
            if (!this.isInScope(target)) {
                continue;
            }
            for (const observer of [...__classPrivateFieldGet(this, _TargetManager_observers, "f")].filter(o => __classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").has(o))) {
                observer.targetAdded(target);
            }
            for (const [modelClass, model] of target.models().entries()) {
                for (const observer of [...__classPrivateFieldGet(this, _TargetManager_modelObservers, "f").get(modelClass)].filter(o => __classPrivateFieldGet(this, _TargetManager_scopedObservers, "f").has(o))) {
                    observer.modelAdded(model);
                }
            }
        }
        for (const scopeChangeListener of __classPrivateFieldGet(this, _TargetManager_scopeChangeListeners, "f")) {
            scopeChangeListener();
        }
        if (scopeTarget && scopeTarget.inspectedURL()) {
            this.onInspectedURLChange(scopeTarget);
        }
    }
    addScopeChangeListener(listener) {
        __classPrivateFieldGet(this, _TargetManager_scopeChangeListeners, "f").add(listener);
    }
    scopeTarget() {
        return __classPrivateFieldGet(this, _TargetManager_scopeTarget, "f");
    }
}
_TargetManager_targetsInternal = new WeakMap(), _TargetManager_observers = new WeakMap(), _TargetManager_modelListeners = new WeakMap(), _TargetManager_modelObservers = new WeakMap(), _TargetManager_scopedObservers = new WeakMap(), _TargetManager_isSuspended = new WeakMap(), _TargetManager_browserTargetInternal = new WeakMap(), _TargetManager_scopeTarget = new WeakMap(), _TargetManager_defaultScopeSet = new WeakMap(), _TargetManager_scopeChangeListeners = new WeakMap();
export var Events;
(function (Events) {
    Events["AVAILABLE_TARGETS_CHANGED"] = "AvailableTargetsChanged";
    Events["INSPECTED_URL_CHANGED"] = "InspectedURLChanged";
    Events["NAME_CHANGED"] = "NameChanged";
    Events["SUSPEND_STATE_CHANGED"] = "SuspendStateChanged";
})(Events || (Events = {}));
export class Observer {
    targetAdded(_target) {
    }
    targetRemoved(_target) {
    }
}
export class SDKModelObserver {
    modelAdded(_model) {
    }
    modelRemoved(_model) {
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSDKModelEvent(arg) {
    return 'source' in arg && arg.source instanceof SDKModel;
}
//# sourceMappingURL=TargetManager.js.map