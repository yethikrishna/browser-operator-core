// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _SourceMapsResolver_instances, _a, _SourceMapsResolver_parsedTrace, _SourceMapsResolver_entityMapper, _SourceMapsResolver_isResolving, _SourceMapsResolver_debuggerModelsToListen, _SourceMapsResolver_resolveMappingsForProfileNodes, _SourceMapsResolver_onAttachedSourceMap, _SourceMapsResolver_targetForThread, _SourceMapsResolver_updateExtensionNames;
import * as SDK from '../../../core/sdk/sdk.js';
import * as Bindings from '../../../models/bindings/bindings.js';
import * as SourceMapScopes from '../../../models/source_map_scopes/source_map_scopes.js';
import * as Trace from '../../../models/trace/trace.js';
import * as Workspace from '../../../models/workspace/workspace.js';
export class SourceMappingsUpdated extends Event {
    constructor() {
        super(SourceMappingsUpdated.eventName, { composed: true, bubbles: true });
    }
}
SourceMappingsUpdated.eventName = 'sourcemappingsupdated';
// The code location key is created as a concatenation of its fields.
export const resolvedCodeLocationDataNames = new Map();
export class SourceMapsResolver extends EventTarget {
    constructor(parsedTrace, entityMapper) {
        super();
        _SourceMapsResolver_instances.add(this);
        this.executionContextNamesByOrigin = new Map();
        _SourceMapsResolver_parsedTrace.set(this, void 0);
        _SourceMapsResolver_entityMapper.set(this, null);
        _SourceMapsResolver_isResolving.set(this, false);
        // We need to gather up a list of all the DebuggerModels that we should
        // listen to for source map attached events. For most pages this will be
        // the debugger model for the primary page target, but if a trace has
        // workers, we would also need to gather up the DebuggerModel instances for
        // those workers too.
        _SourceMapsResolver_debuggerModelsToListen.set(this, new Set());
        __classPrivateFieldSet(this, _SourceMapsResolver_parsedTrace, parsedTrace, "f");
        __classPrivateFieldSet(this, _SourceMapsResolver_entityMapper, entityMapper ?? null, "f");
    }
    static clearResolvedNodeNames() {
        resolvedCodeLocationDataNames.clear();
    }
    static keyForCodeLocation(callFrame) {
        return `${callFrame.url}$$$${callFrame.scriptId}$$$${callFrame.functionName}$$$${callFrame.lineNumber}$$$${callFrame.columnNumber}`;
    }
    /**
     * For trace events containing a call frame / source location
     * (f.e. a stack trace), attempts to obtain the resolved source
     * location based on the those that have been resolved so far from
     * listened source maps.
     *
     * Note that a single deployed URL can map to multiple authored URLs
     * (f.e. if an app is bundled). Thus, beyond a URL we can use code
     * location data like line and column numbers to obtain the specific
     * authored code according to the source mappings.
     *
     * TODO(andoli): This can return incorrect scripts if the target page has been reloaded since the trace.
     */
    static resolvedCodeLocationForCallFrame(callFrame) {
        const codeLocationKey = this.keyForCodeLocation(callFrame);
        return resolvedCodeLocationDataNames.get(codeLocationKey) ?? null;
    }
    static resolvedCodeLocationForEntry(entry) {
        let callFrame = null;
        if (Trace.Types.Events.isProfileCall(entry)) {
            callFrame = entry.callFrame;
        }
        else {
            const stackTrace = Trace.Helpers.Trace.getZeroIndexedStackTraceInEventPayload(entry);
            if (stackTrace === null || stackTrace.length < 1) {
                return null;
            }
            callFrame = stackTrace[0];
        }
        return _a.resolvedCodeLocationForCallFrame(callFrame);
    }
    static resolvedURLForEntry(parsedTrace, entry) {
        const resolvedCallFrameURL = _a.resolvedCodeLocationForEntry(entry)?.devtoolsLocation?.uiSourceCode.url();
        if (resolvedCallFrameURL) {
            return resolvedCallFrameURL;
        }
        // If no source mapping was found for an entry's URL, then default
        // to the URL value contained in the event itself, if any.
        const url = Trace.Handlers.Helpers.getNonResolvedURL(entry, parsedTrace);
        if (url) {
            return Workspace.Workspace.WorkspaceImpl.instance().uiSourceCodeForURL(url)?.url() ?? url;
        }
        return null;
    }
    static storeResolvedCodeDataForCallFrame(callFrame, resolvedCodeLocationData) {
        const keyForCallFrame = this.keyForCodeLocation(callFrame);
        resolvedCodeLocationDataNames.set(keyForCallFrame, resolvedCodeLocationData);
    }
    async install() {
        for (const threadToProfileMap of __classPrivateFieldGet(this, _SourceMapsResolver_parsedTrace, "f").Samples.profilesInProcess.values()) {
            for (const [tid, profile] of threadToProfileMap) {
                const nodes = profile.parsedProfile.nodes();
                if (!nodes || nodes.length === 0) {
                    continue;
                }
                const target = __classPrivateFieldGet(this, _SourceMapsResolver_instances, "m", _SourceMapsResolver_targetForThread).call(this, tid);
                const debuggerModel = target?.model(SDK.DebuggerModel.DebuggerModel);
                if (!debuggerModel) {
                    continue;
                }
                for (const node of nodes) {
                    const script = debuggerModel.scriptForId(String(node.callFrame.scriptId));
                    const shouldListenToSourceMap = !script || script.sourceMapURL;
                    if (!shouldListenToSourceMap) {
                        continue;
                    }
                    __classPrivateFieldGet(this, _SourceMapsResolver_debuggerModelsToListen, "f").add(debuggerModel);
                }
            }
        }
        for (const debuggerModel of __classPrivateFieldGet(this, _SourceMapsResolver_debuggerModelsToListen, "f")) {
            debuggerModel.sourceMapManager().addEventListener(SDK.SourceMapManager.Events.SourceMapAttached, __classPrivateFieldGet(this, _SourceMapsResolver_instances, "m", _SourceMapsResolver_onAttachedSourceMap), this);
        }
        __classPrivateFieldGet(this, _SourceMapsResolver_instances, "m", _SourceMapsResolver_updateExtensionNames).call(this);
        // Although we have added listeners for SourceMapAttached events, we also
        // immediately try to resolve function names. This ensures we use any
        // sourcemaps that were attached before we bound our event listener.
        await __classPrivateFieldGet(this, _SourceMapsResolver_instances, "m", _SourceMapsResolver_resolveMappingsForProfileNodes).call(this);
    }
    /**
     * Removes the event listeners and stops tracking newly added sourcemaps.
     * Should be called before destroying an instance of this class to avoid leaks
     * with listeners.
     */
    uninstall() {
        for (const debuggerModel of __classPrivateFieldGet(this, _SourceMapsResolver_debuggerModelsToListen, "f")) {
            debuggerModel.sourceMapManager().removeEventListener(SDK.SourceMapManager.Events.SourceMapAttached, __classPrivateFieldGet(this, _SourceMapsResolver_instances, "m", _SourceMapsResolver_onAttachedSourceMap), this);
        }
        __classPrivateFieldGet(this, _SourceMapsResolver_debuggerModelsToListen, "f").clear();
    }
}
_a = SourceMapsResolver, _SourceMapsResolver_parsedTrace = new WeakMap(), _SourceMapsResolver_entityMapper = new WeakMap(), _SourceMapsResolver_isResolving = new WeakMap(), _SourceMapsResolver_debuggerModelsToListen = new WeakMap(), _SourceMapsResolver_instances = new WeakSet(), _SourceMapsResolver_resolveMappingsForProfileNodes = async function _SourceMapsResolver_resolveMappingsForProfileNodes() {
    // Used to track if source mappings were updated when a source map
    // is attach. If not, we do not notify the flamechart that mappings
    // were updated, since that would trigger a rerender.
    let updatedMappings = false;
    for (const [, threadsInProcess] of __classPrivateFieldGet(this, _SourceMapsResolver_parsedTrace, "f").Samples.profilesInProcess) {
        for (const [tid, threadProfile] of threadsInProcess) {
            const nodes = threadProfile.parsedProfile.nodes() ?? [];
            const target = __classPrivateFieldGet(this, _SourceMapsResolver_instances, "m", _SourceMapsResolver_targetForThread).call(this, tid);
            if (!target) {
                continue;
            }
            for (const node of nodes) {
                const resolvedFunctionName = await SourceMapScopes.NamesResolver.resolveProfileFrameFunctionName(node.callFrame, target);
                updatedMappings || (updatedMappings = Boolean(resolvedFunctionName));
                node.setFunctionName(resolvedFunctionName);
                const debuggerModel = target.model(SDK.DebuggerModel.DebuggerModel);
                const script = debuggerModel?.scriptForId(node.scriptId) || null;
                const location = debuggerModel &&
                    new SDK.DebuggerModel.Location(debuggerModel, node.callFrame.scriptId, node.callFrame.lineNumber, node.callFrame.columnNumber);
                const uiLocation = location &&
                    await Bindings.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().rawLocationToUILocation(location);
                updatedMappings || (updatedMappings = Boolean(uiLocation));
                if (uiLocation?.uiSourceCode.url() && __classPrivateFieldGet(this, _SourceMapsResolver_entityMapper, "f")) {
                    // Update mappings for the related events of the entity.
                    __classPrivateFieldGet(this, _SourceMapsResolver_entityMapper, "f").updateSourceMapEntities(node.callFrame, uiLocation.uiSourceCode.url());
                }
                _a.storeResolvedCodeDataForCallFrame(node.callFrame, { name: resolvedFunctionName, devtoolsLocation: uiLocation, script });
            }
        }
    }
    if (!updatedMappings) {
        return;
    }
    this.dispatchEvent(new SourceMappingsUpdated());
}, _SourceMapsResolver_onAttachedSourceMap = function _SourceMapsResolver_onAttachedSourceMap() {
    // Exit if we are already resolving so that we batch requests; if pages
    // have a lot of sourcemaps we can get a lot of events at once.
    if (__classPrivateFieldGet(this, _SourceMapsResolver_isResolving, "f")) {
        return;
    }
    __classPrivateFieldSet(this, _SourceMapsResolver_isResolving, true, "f");
    // Resolving names triggers a repaint of the flame chart. Instead of attempting to resolve
    // names every time a source map is attached, wait for some time once the first source map is
    // attached. This way we allow for other source maps to be parsed before attempting a name
    // resolving using the available source maps. Otherwise the UI is blocked when the number
    // of source maps is particularly large.
    setTimeout(async () => {
        __classPrivateFieldSet(this, _SourceMapsResolver_isResolving, false, "f");
        await __classPrivateFieldGet(this, _SourceMapsResolver_instances, "m", _SourceMapsResolver_resolveMappingsForProfileNodes).call(this);
    }, 500);
}, _SourceMapsResolver_targetForThread = function _SourceMapsResolver_targetForThread(tid) {
    const maybeWorkerId = __classPrivateFieldGet(this, _SourceMapsResolver_parsedTrace, "f").Workers.workerIdByThread.get(tid);
    if (maybeWorkerId) {
        return SDK.TargetManager.TargetManager.instance().targetById(maybeWorkerId);
    }
    return SDK.TargetManager.TargetManager.instance().primaryPageTarget();
}, _SourceMapsResolver_updateExtensionNames = function _SourceMapsResolver_updateExtensionNames() {
    for (const runtimeModel of SDK.TargetManager.TargetManager.instance().models(SDK.RuntimeModel.RuntimeModel)) {
        for (const context of runtimeModel.executionContexts()) {
            this.executionContextNamesByOrigin.set(context.origin, context.name);
        }
    }
    __classPrivateFieldGet(this, _SourceMapsResolver_entityMapper, "f")?.updateExtensionEntitiesWithName(this.executionContextNamesByOrigin);
};
//# sourceMappingURL=SourceMapsResolver.js.map