// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _RuntimeModel_executionContextById, _RuntimeModel_executionContextComparatorInternal, _RuntimeDispatcher_runtimeModel, _ExecutionContext_labelInternal;
import * as Common from '../common/common.js';
import * as Host from '../host/host.js';
import { DebuggerModel } from './DebuggerModel.js';
import { HeapProfilerModel } from './HeapProfilerModel.js';
import { RemoteFunction, RemoteObject, RemoteObjectImpl, RemoteObjectProperty, ScopeRemoteObject, } from './RemoteObject.js';
import { SDKModel } from './SDKModel.js';
import { Type } from './Target.js';
export class RuntimeModel extends SDKModel {
    constructor(target) {
        super(target);
        _RuntimeModel_executionContextById.set(this, new Map());
        _RuntimeModel_executionContextComparatorInternal.set(this, ExecutionContext.comparator);
        this.agent = target.runtimeAgent();
        this.target().registerRuntimeDispatcher(new RuntimeDispatcher(this));
        void this.agent.invoke_enable();
        if (Common.Settings.Settings.instance().moduleSetting('custom-formatters').get()) {
            void this.agent.invoke_setCustomObjectFormatterEnabled({ enabled: true });
        }
        Common.Settings.Settings.instance()
            .moduleSetting('custom-formatters')
            .addChangeListener(this.customFormattersStateChanged.bind(this));
    }
    static isSideEffectFailure(response) {
        const exceptionDetails = 'exceptionDetails' in response && response.exceptionDetails;
        return Boolean(exceptionDetails &&
            exceptionDetails.exception?.description?.startsWith('EvalError: Possible side-effect in debug-evaluate'));
    }
    debuggerModel() {
        return this.target().model(DebuggerModel);
    }
    heapProfilerModel() {
        return this.target().model(HeapProfilerModel);
    }
    executionContexts() {
        return [...__classPrivateFieldGet(this, _RuntimeModel_executionContextById, "f").values()].sort(this.executionContextComparator());
    }
    setExecutionContextComparator(comparator) {
        __classPrivateFieldSet(this, _RuntimeModel_executionContextComparatorInternal, comparator, "f");
    }
    /** comparator
     */
    executionContextComparator() {
        return __classPrivateFieldGet(this, _RuntimeModel_executionContextComparatorInternal, "f");
    }
    defaultExecutionContext() {
        for (const context of this.executionContexts()) {
            if (context.isDefault) {
                return context;
            }
        }
        return null;
    }
    executionContext(id) {
        return __classPrivateFieldGet(this, _RuntimeModel_executionContextById, "f").get(id) || null;
    }
    executionContextCreated(context) {
        const data = context.auxData || { isDefault: true };
        const executionContext = new ExecutionContext(this, context.id, context.uniqueId, context.name, context.origin, data['isDefault'], data['frameId']);
        __classPrivateFieldGet(this, _RuntimeModel_executionContextById, "f").set(executionContext.id, executionContext);
        this.dispatchEventToListeners(Events.ExecutionContextCreated, executionContext);
    }
    executionContextDestroyed(executionContextId) {
        const executionContext = __classPrivateFieldGet(this, _RuntimeModel_executionContextById, "f").get(executionContextId);
        if (!executionContext) {
            return;
        }
        this.debuggerModel().executionContextDestroyed(executionContext);
        __classPrivateFieldGet(this, _RuntimeModel_executionContextById, "f").delete(executionContextId);
        this.dispatchEventToListeners(Events.ExecutionContextDestroyed, executionContext);
    }
    fireExecutionContextOrderChanged() {
        this.dispatchEventToListeners(Events.ExecutionContextOrderChanged, this);
    }
    executionContextsCleared() {
        this.debuggerModel().globalObjectCleared();
        const contexts = this.executionContexts();
        __classPrivateFieldGet(this, _RuntimeModel_executionContextById, "f").clear();
        for (let i = 0; i < contexts.length; ++i) {
            this.dispatchEventToListeners(Events.ExecutionContextDestroyed, contexts[i]);
        }
    }
    createRemoteObject(payload) {
        console.assert(typeof payload === 'object', 'Remote object payload should only be an object');
        return new RemoteObjectImpl(this, payload.objectId, payload.type, payload.subtype, payload.value, payload.unserializableValue, payload.description, payload.preview, payload.customPreview, payload.className);
    }
    createScopeRemoteObject(payload, scopeRef) {
        return new ScopeRemoteObject(this, payload.objectId, scopeRef, payload.type, payload.subtype, payload.value, payload.unserializableValue, payload.description, payload.preview);
    }
    createRemoteObjectFromPrimitiveValue(value) {
        const type = typeof value;
        let unserializableValue = undefined;
        const unserializableDescription = RemoteObject.unserializableDescription(value);
        if (unserializableDescription !== null) {
            unserializableValue = (unserializableDescription);
        }
        if (typeof unserializableValue !== 'undefined') {
            value = undefined;
        }
        return new RemoteObjectImpl(this, undefined, type, undefined, value, unserializableValue);
    }
    createRemotePropertyFromPrimitiveValue(name, value) {
        return new RemoteObjectProperty(name, this.createRemoteObjectFromPrimitiveValue(value));
    }
    discardConsoleEntries() {
        void this.agent.invoke_discardConsoleEntries();
    }
    releaseObjectGroup(objectGroup) {
        void this.agent.invoke_releaseObjectGroup({ objectGroup });
    }
    releaseEvaluationResult(result) {
        if ('object' in result && result.object) {
            result.object.release();
        }
        if ('exceptionDetails' in result && result.exceptionDetails?.exception) {
            const exception = result.exceptionDetails.exception;
            const exceptionObject = this.createRemoteObject({ type: exception.type, objectId: exception.objectId });
            exceptionObject.release();
        }
    }
    runIfWaitingForDebugger() {
        void this.agent.invoke_runIfWaitingForDebugger();
    }
    customFormattersStateChanged({ data: enabled }) {
        void this.agent.invoke_setCustomObjectFormatterEnabled({ enabled });
    }
    async compileScript(expression, sourceURL, persistScript, executionContextId) {
        const response = await this.agent.invoke_compileScript({
            expression,
            sourceURL,
            persistScript,
            executionContextId,
        });
        if (response.getError()) {
            console.error(response.getError());
            return null;
        }
        return { scriptId: response.scriptId, exceptionDetails: response.exceptionDetails };
    }
    async runScript(scriptId, executionContextId, objectGroup, silent, includeCommandLineAPI, returnByValue, generatePreview, awaitPromise) {
        const response = await this.agent.invoke_runScript({
            scriptId,
            executionContextId,
            objectGroup,
            silent,
            includeCommandLineAPI,
            returnByValue,
            generatePreview,
            awaitPromise,
        });
        const error = response.getError();
        if (error) {
            console.error(error);
            return { error };
        }
        return { object: this.createRemoteObject(response.result), exceptionDetails: response.exceptionDetails };
    }
    async queryObjects(prototype) {
        if (!prototype.objectId) {
            return { error: 'Prototype should be an Object.' };
        }
        const response = await this.agent.invoke_queryObjects({ prototypeObjectId: prototype.objectId, objectGroup: 'console' });
        const error = response.getError();
        if (error) {
            console.error(error);
            return { error };
        }
        return { objects: this.createRemoteObject(response.objects) };
    }
    async isolateId() {
        const response = await this.agent.invoke_getIsolateId();
        if (response.getError() || !response.id) {
            return this.target().id();
        }
        return response.id;
    }
    async heapUsage() {
        const result = await this.agent.invoke_getHeapUsage();
        return result.getError() ? null : result;
    }
    inspectRequested(payload, hints, executionContextId) {
        const object = this.createRemoteObject(payload);
        if (hints !== null && typeof hints === 'object') {
            if ('copyToClipboard' in hints && Boolean(hints.copyToClipboard)) {
                this.copyRequested(object);
                return;
            }
            if ('queryObjects' in hints && hints.queryObjects) {
                void this.queryObjectsRequested(object, executionContextId);
                return;
            }
        }
        if (object.isNode()) {
            void Common.Revealer.reveal(object).then(object.release.bind(object));
            return;
        }
        if (object.type === 'function') {
            void RemoteFunction.objectAsFunction(object).targetFunctionDetails().then(didGetDetails);
            return;
        }
        function didGetDetails(response) {
            object.release();
            if (!response?.location) {
                return;
            }
            void Common.Revealer.reveal(response.location);
        }
        object.release();
    }
    async addBinding(event) {
        return await this.agent.invoke_addBinding(event);
    }
    async removeBinding(request) {
        return await this.agent.invoke_removeBinding(request);
    }
    bindingCalled(event) {
        this.dispatchEventToListeners(Events.BindingCalled, event);
    }
    copyRequested(object) {
        if (!object.objectId) {
            Host.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(object.unserializableValue() || object.value);
            return;
        }
        const indent = Common.Settings.Settings.instance().moduleSetting('text-editor-indent').get();
        void object
            .callFunctionJSON(toStringForClipboard, [{
                value: {
                    subtype: object.subtype,
                    indent,
                },
            }])
            .then(Host.InspectorFrontendHost.InspectorFrontendHostInstance.copyText.bind(Host.InspectorFrontendHost.InspectorFrontendHostInstance));
        function toStringForClipboard(data) {
            const subtype = data.subtype;
            const indent = data.indent;
            if (subtype === 'node') {
                return this instanceof Element ? this.outerHTML : undefined;
            }
            if (subtype && typeof this === 'undefined') {
                return String(subtype);
            }
            try {
                return JSON.stringify(this, null, indent);
            }
            catch {
                return String(this);
            }
        }
    }
    async queryObjectsRequested(object, executionContextId) {
        const result = await this.queryObjects(object);
        object.release();
        if ('error' in result) {
            Common.Console.Console.instance().error(result.error);
            return;
        }
        this.dispatchEventToListeners(Events.QueryObjectRequested, { objects: result.objects, executionContextId });
    }
    static simpleTextFromException(exceptionDetails) {
        let text = exceptionDetails.text;
        if (exceptionDetails.exception?.description) {
            let description = exceptionDetails.exception.description;
            if (description.indexOf('\n') !== -1) {
                description = description.substring(0, description.indexOf('\n'));
            }
            text += ' ' + description;
        }
        return text;
    }
    exceptionThrown(timestamp, exceptionDetails) {
        const exceptionWithTimestamp = { timestamp, details: exceptionDetails };
        this.dispatchEventToListeners(Events.ExceptionThrown, exceptionWithTimestamp);
    }
    exceptionRevoked(exceptionId) {
        this.dispatchEventToListeners(Events.ExceptionRevoked, exceptionId);
    }
    consoleAPICalled(type, args, executionContextId, timestamp, stackTrace, context) {
        const consoleAPICall = {
            type,
            args,
            executionContextId,
            timestamp,
            stackTrace,
            context,
        };
        this.dispatchEventToListeners(Events.ConsoleAPICalled, consoleAPICall);
    }
    executionContextIdForScriptId(scriptId) {
        const script = this.debuggerModel().scriptForId(scriptId);
        return script ? script.executionContextId : 0;
    }
    executionContextForStackTrace(stackTrace) {
        let currentStackTrace = stackTrace;
        while (currentStackTrace && !currentStackTrace.callFrames.length) {
            currentStackTrace = currentStackTrace.parent || null;
        }
        if (!currentStackTrace?.callFrames.length) {
            return 0;
        }
        return this.executionContextIdForScriptId(currentStackTrace.callFrames[0].scriptId);
    }
    terminateExecution() {
        return this.agent.invoke_terminateExecution();
    }
    async getExceptionDetails(errorObjectId) {
        const response = await this.agent.invoke_getExceptionDetails({ errorObjectId });
        if (response.getError()) {
            // This CDP method errors if called with non-Error object ids. Swallow that.
            return undefined;
        }
        return response.exceptionDetails;
    }
}
_RuntimeModel_executionContextById = new WeakMap(), _RuntimeModel_executionContextComparatorInternal = new WeakMap();
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["BindingCalled"] = "BindingCalled";
    Events["ExecutionContextCreated"] = "ExecutionContextCreated";
    Events["ExecutionContextDestroyed"] = "ExecutionContextDestroyed";
    Events["ExecutionContextChanged"] = "ExecutionContextChanged";
    Events["ExecutionContextOrderChanged"] = "ExecutionContextOrderChanged";
    Events["ExceptionThrown"] = "ExceptionThrown";
    Events["ExceptionRevoked"] = "ExceptionRevoked";
    Events["ConsoleAPICalled"] = "ConsoleAPICalled";
    Events["QueryObjectRequested"] = "QueryObjectRequested";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
class RuntimeDispatcher {
    constructor(runtimeModel) {
        _RuntimeDispatcher_runtimeModel.set(this, void 0);
        __classPrivateFieldSet(this, _RuntimeDispatcher_runtimeModel, runtimeModel, "f");
    }
    executionContextCreated({ context }) {
        __classPrivateFieldGet(this, _RuntimeDispatcher_runtimeModel, "f").executionContextCreated(context);
    }
    executionContextDestroyed({ executionContextId }) {
        __classPrivateFieldGet(this, _RuntimeDispatcher_runtimeModel, "f").executionContextDestroyed(executionContextId);
    }
    executionContextsCleared() {
        __classPrivateFieldGet(this, _RuntimeDispatcher_runtimeModel, "f").executionContextsCleared();
    }
    exceptionThrown({ timestamp, exceptionDetails }) {
        __classPrivateFieldGet(this, _RuntimeDispatcher_runtimeModel, "f").exceptionThrown(timestamp, exceptionDetails);
    }
    exceptionRevoked({ exceptionId }) {
        __classPrivateFieldGet(this, _RuntimeDispatcher_runtimeModel, "f").exceptionRevoked(exceptionId);
    }
    consoleAPICalled({ type, args, executionContextId, timestamp, stackTrace, context }) {
        __classPrivateFieldGet(this, _RuntimeDispatcher_runtimeModel, "f").consoleAPICalled(type, args, executionContextId, timestamp, stackTrace, context);
    }
    inspectRequested({ object, hints, executionContextId }) {
        __classPrivateFieldGet(this, _RuntimeDispatcher_runtimeModel, "f").inspectRequested(object, hints, executionContextId);
    }
    bindingCalled(event) {
        __classPrivateFieldGet(this, _RuntimeDispatcher_runtimeModel, "f").bindingCalled(event);
    }
}
_RuntimeDispatcher_runtimeModel = new WeakMap();
export class ExecutionContext {
    constructor(runtimeModel, id, uniqueId, name, origin, isDefault, frameId) {
        _ExecutionContext_labelInternal.set(this, void 0);
        this.id = id;
        this.uniqueId = uniqueId;
        this.name = name;
        __classPrivateFieldSet(this, _ExecutionContext_labelInternal, null, "f");
        this.origin = origin;
        this.isDefault = isDefault;
        this.runtimeModel = runtimeModel;
        this.debuggerModel = runtimeModel.debuggerModel();
        this.frameId = frameId;
        this.setLabelInternal('');
    }
    target() {
        return this.runtimeModel.target();
    }
    static comparator(a, b) {
        function targetWeight(target) {
            if (target.parentTarget()?.type() !== Type.FRAME) {
                return 5;
            }
            if (target.type() === Type.FRAME) {
                return 4;
            }
            if (target.type() === Type.ServiceWorker) {
                return 3;
            }
            if (target.type() === Type.Worker || target.type() === Type.SHARED_WORKER) {
                return 2;
            }
            return 1;
        }
        function targetPath(target) {
            let currentTarget = target;
            const parents = [];
            while (currentTarget) {
                parents.push(currentTarget);
                currentTarget = currentTarget.parentTarget();
            }
            return parents.reverse();
        }
        const tagetsA = targetPath(a.target());
        const targetsB = targetPath(b.target());
        let targetA;
        let targetB;
        for (let i = 0;; i++) {
            if (!tagetsA[i] || !targetsB[i] || (tagetsA[i] !== targetsB[i])) {
                targetA = tagetsA[i];
                targetB = targetsB[i];
                break;
            }
        }
        if (!targetA && targetB) {
            return -1;
        }
        if (!targetB && targetA) {
            return 1;
        }
        if (targetA && targetB) {
            const weightDiff = targetWeight(targetA) - targetWeight(targetB);
            if (weightDiff) {
                return -weightDiff;
            }
            return targetA.id().localeCompare(targetB.id());
        }
        // Main world context should always go first.
        if (a.isDefault) {
            return -1;
        }
        if (b.isDefault) {
            return +1;
        }
        return a.name.localeCompare(b.name);
    }
    async evaluate(options, userGesture, awaitPromise) {
        // FIXME: It will be moved to separate ExecutionContext.
        if (this.debuggerModel.selectedCallFrame()) {
            return await this.debuggerModel.evaluateOnSelectedCallFrame(options);
        }
        return await this.evaluateGlobal(options, userGesture, awaitPromise);
    }
    globalObject(objectGroup, generatePreview) {
        const evaluationOptions = {
            expression: 'this',
            objectGroup,
            includeCommandLineAPI: false,
            silent: true,
            returnByValue: false,
            generatePreview,
        };
        return this.evaluateGlobal(evaluationOptions, false, false);
    }
    async callFunctionOn(options) {
        const response = await this.runtimeModel.agent.invoke_callFunctionOn({
            functionDeclaration: options.functionDeclaration,
            returnByValue: options.returnByValue,
            userGesture: options.userGesture,
            awaitPromise: options.awaitPromise,
            throwOnSideEffect: options.throwOnSideEffect,
            arguments: options.arguments,
            // Old back-ends don't know about uniqueContextId (and also don't generate
            // one), so fall back to contextId in that case (https://crbug.com/1192621).
            ...(this.uniqueId ? { uniqueContextId: this.uniqueId } : { contextId: this.id }),
        });
        const error = response.getError();
        if (error) {
            return { error };
        }
        return { object: this.runtimeModel.createRemoteObject(response.result), exceptionDetails: response.exceptionDetails };
    }
    async evaluateGlobal(options, userGesture, awaitPromise) {
        if (!options.expression) {
            // There is no expression, so the completion should happen against global properties.
            options.expression = 'this';
        }
        const response = await this.runtimeModel.agent.invoke_evaluate({
            expression: options.expression,
            objectGroup: options.objectGroup,
            includeCommandLineAPI: options.includeCommandLineAPI,
            silent: options.silent,
            returnByValue: options.returnByValue,
            generatePreview: options.generatePreview,
            userGesture,
            awaitPromise,
            throwOnSideEffect: options.throwOnSideEffect,
            timeout: options.timeout,
            disableBreaks: options.disableBreaks,
            replMode: options.replMode,
            allowUnsafeEvalBlockedByCSP: options.allowUnsafeEvalBlockedByCSP,
            // Old back-ends don't know about uniqueContextId (and also don't generate
            // one), so fall back to contextId in that case (https://crbug.com/1192621).
            ...(this.uniqueId ? { uniqueContextId: this.uniqueId } : { contextId: this.id }),
        });
        const error = response.getError();
        if (error) {
            console.error(error);
            return { error };
        }
        return { object: this.runtimeModel.createRemoteObject(response.result), exceptionDetails: response.exceptionDetails };
    }
    async globalLexicalScopeNames() {
        const response = await this.runtimeModel.agent.invoke_globalLexicalScopeNames({ executionContextId: this.id });
        return response.getError() ? [] : response.names;
    }
    label() {
        return __classPrivateFieldGet(this, _ExecutionContext_labelInternal, "f");
    }
    setLabel(label) {
        this.setLabelInternal(label);
        this.runtimeModel.dispatchEventToListeners(Events.ExecutionContextChanged, this);
    }
    setLabelInternal(label) {
        if (label) {
            __classPrivateFieldSet(this, _ExecutionContext_labelInternal, label, "f");
            return;
        }
        if (this.name) {
            __classPrivateFieldSet(this, _ExecutionContext_labelInternal, this.name, "f");
            return;
        }
        const parsedUrl = Common.ParsedURL.ParsedURL.fromString(this.origin);
        __classPrivateFieldSet(this, _ExecutionContext_labelInternal, parsedUrl ? parsedUrl.lastPathComponentWithFragment() : '', "f");
    }
}
_ExecutionContext_labelInternal = new WeakMap();
SDKModel.register(RuntimeModel, { capabilities: 4 /* Capability.JS */, autostart: true });
//# sourceMappingURL=RuntimeModel.js.map