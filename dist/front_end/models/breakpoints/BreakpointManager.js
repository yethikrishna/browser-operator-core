/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
var _BreakpointManager_instances, _BreakpointManager_workspace, _BreakpointManager_breakpointsForHomeUISourceCode, _BreakpointManager_breakpointsForUISourceCode, _BreakpointManager_breakpointByStorageId, _BreakpointManager_updateBindingsCallbacks, _BreakpointManager_setInitialBreakpoints, _BreakpointManager_updateBindings, _BreakpointManager_restoreBreakpointsForUrl, _BreakpointManager_hasBreakpointsForUrl, _BreakpointManager_getAllBreakpointsForUISourceCode, _Breakpoint_instances, _Breakpoint_uiLocations, _Breakpoint_storageState, _Breakpoint_origin, _Breakpoint_lastResolvedState, _Breakpoint_modelBreakpoints, _Breakpoint_setLastResolvedStateFromStorage, _Breakpoint_removeDebuggerModelListeners, _Breakpoint_onDebuggerEnabled, _Breakpoint_onDebuggerDisabled, _Breakpoint_onScriptWasEdited, _Breakpoint_updateModels, _Breakpoint_updateModel, _ModelBreakpoint_instances, _ModelBreakpoint_debuggerModel, _ModelBreakpoint_breakpoint, _ModelBreakpoint_debuggerWorkspaceBinding, _ModelBreakpoint_liveLocations, _ModelBreakpoint_uiLocations, _ModelBreakpoint_updateMutex, _ModelBreakpoint_cancelCallback, _ModelBreakpoint_currentState, _ModelBreakpoint_breakpointIds, _ModelBreakpoint_resolvedScriptIds, _ModelBreakpoint_updateInDebugger, _ModelBreakpoint_setBreakpointOnBackend, _Storage_muted;
import * as Common from '../../core/common/common.js';
import { assertNotNullOrUndefined } from '../../core/platform/platform.js';
import * as Root from '../../core/root/root.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Bindings from '../bindings/bindings.js';
import * as Formatter from '../formatter/formatter.js';
import * as SourceMapScopes from '../source_map_scopes/source_map_scopes.js';
import * as Workspace from '../workspace/workspace.js';
let breakpointManagerInstance;
const INITIAL_RESTORE_BREAKPOINT_COUNT = 100;
export class BreakpointManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor(targetManager, workspace, debuggerWorkspaceBinding, restoreInitialBreakpointCount) {
        super();
        _BreakpointManager_instances.add(this);
        this.storage = new Storage();
        _BreakpointManager_workspace.set(this, void 0);
        // For each source code, we remember the list or breakpoints that refer to that UI source code as
        // their home UI source code. This is necessary to correctly remove the UI source code from
        // breakpoints upon receiving the UISourceCodeRemoved event.
        _BreakpointManager_breakpointsForHomeUISourceCode.set(this, new Map());
        // Mapping of UI source codes to all the current breakpoint UI locations. For bound breakpoints,
        // this is all the locations where the breakpoints was bound. For the unbound breakpoints,
        // this is the default locations in the home UI source codes.
        _BreakpointManager_breakpointsForUISourceCode.set(this, new Map());
        _BreakpointManager_breakpointByStorageId.set(this, new Map());
        _BreakpointManager_updateBindingsCallbacks.set(this, []);
        __classPrivateFieldSet(this, _BreakpointManager_workspace, workspace, "f");
        this.targetManager = targetManager;
        this.debuggerWorkspaceBinding = debuggerWorkspaceBinding;
        this.storage.mute();
        __classPrivateFieldGet(this, _BreakpointManager_instances, "m", _BreakpointManager_setInitialBreakpoints).call(this, restoreInitialBreakpointCount ?? INITIAL_RESTORE_BREAKPOINT_COUNT);
        this.storage.unmute();
        __classPrivateFieldGet(this, _BreakpointManager_workspace, "f").addEventListener(Workspace.Workspace.Events.UISourceCodeAdded, this.uiSourceCodeAdded, this);
        __classPrivateFieldGet(this, _BreakpointManager_workspace, "f").addEventListener(Workspace.Workspace.Events.UISourceCodeRemoved, this.uiSourceCodeRemoved, this);
        __classPrivateFieldGet(this, _BreakpointManager_workspace, "f").addEventListener(Workspace.Workspace.Events.ProjectRemoved, this.projectRemoved, this);
        this.targetManager.observeModels(SDK.DebuggerModel.DebuggerModel, this);
    }
    static instance(opts = { forceNew: null, targetManager: null, workspace: null, debuggerWorkspaceBinding: null }) {
        const { forceNew, targetManager, workspace, debuggerWorkspaceBinding, restoreInitialBreakpointCount } = opts;
        if (!breakpointManagerInstance || forceNew) {
            if (!targetManager || !workspace || !debuggerWorkspaceBinding) {
                throw new Error(`Unable to create settings: targetManager, workspace, and debuggerWorkspaceBinding must be provided: ${new Error().stack}`);
            }
            breakpointManagerInstance =
                new BreakpointManager(targetManager, workspace, debuggerWorkspaceBinding, restoreInitialBreakpointCount);
        }
        return breakpointManagerInstance;
    }
    modelAdded(debuggerModel) {
        if (Root.Runtime.experiments.isEnabled("instrumentation-breakpoints" /* Root.Runtime.ExperimentName.INSTRUMENTATION_BREAKPOINTS */)) {
            debuggerModel.setSynchronizeBreakpointsCallback(this.restoreBreakpointsForScript.bind(this));
        }
    }
    modelRemoved(debuggerModel) {
        debuggerModel.setSynchronizeBreakpointsCallback(null);
    }
    addUpdateBindingsCallback(callback) {
        __classPrivateFieldGet(this, _BreakpointManager_updateBindingsCallbacks, "f").push(callback);
    }
    async copyBreakpoints(fromSourceCode, toSourceCode) {
        const toSourceCodeIsRemoved = toSourceCode.project().uiSourceCodeForURL(toSourceCode.url()) !== toSourceCode ||
            __classPrivateFieldGet(this, _BreakpointManager_workspace, "f").project(toSourceCode.project().id()) !== toSourceCode.project();
        const breakpointItems = this.storage.breakpointItems(fromSourceCode.url(), fromSourceCode.contentType().name());
        for (const item of breakpointItems) {
            if (toSourceCodeIsRemoved) {
                // If the target source code has been detached from the workspace, then no breakpoint should refer
                // to that source code. Let us only update the storage, so that the breakpoints appear once
                // the user binds the file system again.
                this.storage.updateBreakpoint({ ...item, url: toSourceCode.url(), resourceTypeName: toSourceCode.contentType().name() });
            }
            else {
                await this.setBreakpoint(toSourceCode, item.lineNumber, item.columnNumber, item.condition, item.enabled, item.isLogpoint, "RESTORED" /* BreakpointOrigin.OTHER */);
            }
        }
    }
    // This method explicitly awaits the source map (if necessary) and the uiSourceCodes
    // required to set all breakpoints that are related to this script.
    async restoreBreakpointsForScript(script) {
        if (!Root.Runtime.experiments.isEnabled("instrumentation-breakpoints" /* Root.Runtime.ExperimentName.INSTRUMENTATION_BREAKPOINTS */)) {
            return;
        }
        if (!script.sourceURL) {
            return;
        }
        const uiSourceCode = await this.getUISourceCodeWithUpdatedBreakpointInfo(script);
        if (__classPrivateFieldGet(this, _BreakpointManager_instances, "m", _BreakpointManager_hasBreakpointsForUrl).call(this, script.sourceURL)) {
            await __classPrivateFieldGet(this, _BreakpointManager_instances, "m", _BreakpointManager_restoreBreakpointsForUrl).call(this, uiSourceCode);
        }
        const debuggerModel = script.debuggerModel;
        // Handle source maps and the original sources.
        const sourceMap = await debuggerModel.sourceMapManager().sourceMapForClientPromise(script);
        if (sourceMap) {
            for (const sourceURL of sourceMap.sourceURLs()) {
                if (__classPrivateFieldGet(this, _BreakpointManager_instances, "m", _BreakpointManager_hasBreakpointsForUrl).call(this, sourceURL)) {
                    const uiSourceCode = await this.debuggerWorkspaceBinding.uiSourceCodeForSourceMapSourceURLPromise(debuggerModel, sourceURL, script.isContentScript());
                    await __classPrivateFieldGet(this, _BreakpointManager_instances, "m", _BreakpointManager_restoreBreakpointsForUrl).call(this, uiSourceCode);
                }
            }
        }
        // Handle language plugins
        const { pluginManager } = this.debuggerWorkspaceBinding;
        const sourceUrls = await pluginManager.getSourcesForScript(script);
        if (Array.isArray(sourceUrls)) {
            for (const sourceURL of sourceUrls) {
                if (__classPrivateFieldGet(this, _BreakpointManager_instances, "m", _BreakpointManager_hasBreakpointsForUrl).call(this, sourceURL)) {
                    const uiSourceCode = await this.debuggerWorkspaceBinding.uiSourceCodeForDebuggerLanguagePluginSourceURLPromise(debuggerModel, sourceURL);
                    assertNotNullOrUndefined(uiSourceCode);
                    await __classPrivateFieldGet(this, _BreakpointManager_instances, "m", _BreakpointManager_restoreBreakpointsForUrl).call(this, uiSourceCode);
                }
            }
        }
    }
    async getUISourceCodeWithUpdatedBreakpointInfo(script) {
        const uiSourceCode = this.debuggerWorkspaceBinding.uiSourceCodeForScript(script);
        assertNotNullOrUndefined(uiSourceCode);
        await __classPrivateFieldGet(this, _BreakpointManager_instances, "m", _BreakpointManager_updateBindings).call(this, uiSourceCode);
        return uiSourceCode;
    }
    static getScriptForInlineUiSourceCode(uiSourceCode) {
        const script = Bindings.DefaultScriptMapping.DefaultScriptMapping.scriptForUISourceCode(uiSourceCode);
        if (script && script.isInlineScript() && !script.hasSourceURL) {
            return script;
        }
        return null;
    }
    // For inline scripts, this function translates the line-column coordinates into the coordinates
    // of the embedding document. For other scripts, it just returns unchanged line-column.
    static breakpointLocationFromUiLocation(uiLocation) {
        const uiSourceCode = uiLocation.uiSourceCode;
        const script = BreakpointManager.getScriptForInlineUiSourceCode(uiSourceCode);
        const { lineNumber, columnNumber } = script ? script.relativeLocationToRawLocation(uiLocation) : uiLocation;
        return { lineNumber, columnNumber };
    }
    // For inline scripts, this function translates the line-column coordinates of the embedding
    // document into the coordinates of the script. Other UI source code coordinated are not
    // affected.
    static uiLocationFromBreakpointLocation(uiSourceCode, lineNumber, columnNumber) {
        const script = BreakpointManager.getScriptForInlineUiSourceCode(uiSourceCode);
        if (script) {
            ({ lineNumber, columnNumber } = script.rawLocationToRelativeLocation({ lineNumber, columnNumber }));
        }
        return uiSourceCode.uiLocation(lineNumber, columnNumber);
    }
    // Returns true for if the given (raw) position is within the script or if the script
    // is null. This is used to filter breakpoints if a script is known.
    static isValidPositionInScript(lineNumber, columnNumber, script) {
        if (!script) {
            return true;
        }
        if (lineNumber < script.lineOffset || lineNumber > script.endLine) {
            return false;
        }
        if (lineNumber === script.lineOffset && columnNumber && columnNumber < script.columnOffset) {
            return false;
        }
        if (lineNumber === script.endLine && (!columnNumber || columnNumber >= script.endColumn)) {
            return false;
        }
        return true;
    }
    restoreBreakpoints(uiSourceCode) {
        const script = BreakpointManager.getScriptForInlineUiSourceCode(uiSourceCode);
        const url = script?.sourceURL ?? uiSourceCode.url();
        if (!url) {
            return;
        }
        const contentType = uiSourceCode.contentType();
        this.storage.mute();
        const breakpoints = this.storage.breakpointItems(url, contentType.name());
        for (const breakpoint of breakpoints) {
            const { lineNumber, columnNumber } = breakpoint;
            if (!BreakpointManager.isValidPositionInScript(lineNumber, columnNumber, script)) {
                continue;
            }
            this.innerSetBreakpoint(uiSourceCode, lineNumber, columnNumber, breakpoint.condition, breakpoint.enabled, breakpoint.isLogpoint, "RESTORED" /* BreakpointOrigin.OTHER */);
        }
        this.storage.unmute();
    }
    uiSourceCodeAdded(event) {
        const uiSourceCode = event.data;
        this.restoreBreakpoints(uiSourceCode);
    }
    uiSourceCodeRemoved(event) {
        const uiSourceCode = event.data;
        this.removeUISourceCode(uiSourceCode);
    }
    projectRemoved(event) {
        const project = event.data;
        for (const uiSourceCode of project.uiSourceCodes()) {
            this.removeUISourceCode(uiSourceCode);
        }
    }
    removeUISourceCode(uiSourceCode) {
        const breakpoints = __classPrivateFieldGet(this, _BreakpointManager_instances, "m", _BreakpointManager_getAllBreakpointsForUISourceCode).call(this, uiSourceCode);
        breakpoints.forEach(bp => bp.removeUISourceCode(uiSourceCode));
    }
    async setBreakpoint(uiSourceCode, lineNumber, columnNumber, condition, enabled, isLogpoint, origin) {
        // As part of de-duplication, we always only show one uiSourceCode, but we may
        // have several uiSourceCodes that correspond to the same
        // file (but are attached to different targets), so set a breakpoint on all of them.
        const compatibleUiSourceCodes = __classPrivateFieldGet(this, _BreakpointManager_workspace, "f").findCompatibleUISourceCodes(uiSourceCode);
        let primaryBreakpoint;
        for (const compatibleUiSourceCode of compatibleUiSourceCodes) {
            const uiLocation = new Workspace.UISourceCode.UILocation(compatibleUiSourceCode, lineNumber, columnNumber);
            const normalizedLocation = await this.debuggerWorkspaceBinding.normalizeUILocation(uiLocation);
            const breakpointLocation = BreakpointManager.breakpointLocationFromUiLocation(normalizedLocation);
            const breakpoint = this.innerSetBreakpoint(normalizedLocation.uiSourceCode, breakpointLocation.lineNumber, breakpointLocation.columnNumber, condition, enabled, isLogpoint, origin);
            if (uiSourceCode === compatibleUiSourceCode) {
                if (normalizedLocation.id() !== uiLocation.id()) {
                    // Only call this on the uiSourceCode that was initially selected for breakpoint setting.
                    void Common.Revealer.reveal(normalizedLocation);
                }
                primaryBreakpoint = breakpoint;
            }
        }
        console.assert(primaryBreakpoint !== undefined, 'The passed uiSourceCode is expected to be a valid uiSourceCode');
        return primaryBreakpoint;
    }
    innerSetBreakpoint(uiSourceCode, lineNumber, columnNumber, condition, enabled, isLogpoint, origin) {
        const url = BreakpointManager.getScriptForInlineUiSourceCode(uiSourceCode)?.sourceURL ?? uiSourceCode.url();
        const resourceTypeName = uiSourceCode.contentType().name();
        const storageState = { url, resourceTypeName, lineNumber, columnNumber, condition, enabled, isLogpoint };
        const storageId = Storage.computeId(storageState);
        let breakpoint = __classPrivateFieldGet(this, _BreakpointManager_breakpointByStorageId, "f").get(storageId);
        if (breakpoint) {
            breakpoint.updateState(storageState);
            breakpoint.addUISourceCode(uiSourceCode);
            void breakpoint.updateBreakpoint();
            return breakpoint;
        }
        breakpoint = new Breakpoint(this, uiSourceCode, storageState, origin);
        __classPrivateFieldGet(this, _BreakpointManager_breakpointByStorageId, "f").set(storageId, breakpoint);
        return breakpoint;
    }
    findBreakpoint(uiLocation) {
        const breakpoints = __classPrivateFieldGet(this, _BreakpointManager_breakpointsForUISourceCode, "f").get(uiLocation.uiSourceCode);
        return breakpoints ? (breakpoints.get(uiLocation.id())) || null : null;
    }
    addHomeUISourceCode(uiSourceCode, breakpoint) {
        let breakpoints = __classPrivateFieldGet(this, _BreakpointManager_breakpointsForHomeUISourceCode, "f").get(uiSourceCode);
        if (!breakpoints) {
            breakpoints = new Set();
            __classPrivateFieldGet(this, _BreakpointManager_breakpointsForHomeUISourceCode, "f").set(uiSourceCode, breakpoints);
        }
        breakpoints.add(breakpoint);
    }
    removeHomeUISourceCode(uiSourceCode, breakpoint) {
        const breakpoints = __classPrivateFieldGet(this, _BreakpointManager_breakpointsForHomeUISourceCode, "f").get(uiSourceCode);
        if (!breakpoints) {
            return;
        }
        breakpoints.delete(breakpoint);
        if (breakpoints.size === 0) {
            __classPrivateFieldGet(this, _BreakpointManager_breakpointsForHomeUISourceCode, "f").delete(uiSourceCode);
        }
    }
    async possibleBreakpoints(uiSourceCode, textRange) {
        const rawLocationRanges = await this.debuggerWorkspaceBinding.uiLocationRangeToRawLocationRanges(uiSourceCode, textRange);
        const breakLocationLists = await Promise.all(rawLocationRanges.map(({ start, end }) => start.debuggerModel.getPossibleBreakpoints(start, end, /* restrictToFunction */ false)));
        const breakLocations = breakLocationLists.flat();
        const uiLocations = new Map();
        await Promise.all(breakLocations.map(async (breakLocation) => {
            const uiLocation = await this.debuggerWorkspaceBinding.rawLocationToUILocation(breakLocation);
            if (uiLocation === null) {
                return;
            }
            // The "canonical" UI locations don't need to be in our `uiSourceCode`.
            if (uiLocation.uiSourceCode !== uiSourceCode) {
                return;
            }
            // Since we ask for all overlapping ranges above, we might also get breakable locations
            // outside of the `textRange`.
            if (!textRange.containsLocation(uiLocation.lineNumber, uiLocation.columnNumber ?? 0)) {
                return;
            }
            uiLocations.set(uiLocation.id(), uiLocation);
        }));
        return [...uiLocations.values()];
    }
    breakpointLocationsForUISourceCode(uiSourceCode) {
        const breakpoints = __classPrivateFieldGet(this, _BreakpointManager_breakpointsForUISourceCode, "f").get(uiSourceCode);
        return breakpoints ? Array.from(breakpoints.values()) : [];
    }
    allBreakpointLocations() {
        const result = [];
        for (const breakpoints of __classPrivateFieldGet(this, _BreakpointManager_breakpointsForUISourceCode, "f").values()) {
            result.push(...breakpoints.values());
        }
        return result;
    }
    removeBreakpoint(breakpoint, removeFromStorage) {
        const storageId = breakpoint.breakpointStorageId();
        if (removeFromStorage) {
            this.storage.removeBreakpoint(storageId);
        }
        __classPrivateFieldGet(this, _BreakpointManager_breakpointByStorageId, "f").delete(storageId);
    }
    uiLocationAdded(breakpoint, uiLocation) {
        let breakpoints = __classPrivateFieldGet(this, _BreakpointManager_breakpointsForUISourceCode, "f").get(uiLocation.uiSourceCode);
        if (!breakpoints) {
            breakpoints = new Map();
            __classPrivateFieldGet(this, _BreakpointManager_breakpointsForUISourceCode, "f").set(uiLocation.uiSourceCode, breakpoints);
        }
        const breakpointLocation = new BreakpointLocation(breakpoint, uiLocation);
        breakpoints.set(uiLocation.id(), breakpointLocation);
        this.dispatchEventToListeners(Events.BreakpointAdded, breakpointLocation);
    }
    uiLocationRemoved(uiLocation) {
        const breakpoints = __classPrivateFieldGet(this, _BreakpointManager_breakpointsForUISourceCode, "f").get(uiLocation.uiSourceCode);
        if (!breakpoints) {
            return;
        }
        const breakpointLocation = breakpoints.get(uiLocation.id()) || null;
        if (!breakpointLocation) {
            return;
        }
        breakpoints.delete(uiLocation.id());
        if (breakpoints.size === 0) {
            __classPrivateFieldGet(this, _BreakpointManager_breakpointsForUISourceCode, "f").delete(uiLocation.uiSourceCode);
        }
        this.dispatchEventToListeners(Events.BreakpointRemoved, breakpointLocation);
    }
    supportsConditionalBreakpoints(uiSourceCode) {
        return this.debuggerWorkspaceBinding.supportsConditionalBreakpoints(uiSourceCode);
    }
}
_BreakpointManager_workspace = new WeakMap(), _BreakpointManager_breakpointsForHomeUISourceCode = new WeakMap(), _BreakpointManager_breakpointsForUISourceCode = new WeakMap(), _BreakpointManager_breakpointByStorageId = new WeakMap(), _BreakpointManager_updateBindingsCallbacks = new WeakMap(), _BreakpointManager_instances = new WeakSet(), _BreakpointManager_setInitialBreakpoints = function _BreakpointManager_setInitialBreakpoints(restoreInitialBreakpointCount) {
    let breakpointsToSkip = this.storage.breakpoints.size - restoreInitialBreakpointCount;
    for (const storageState of this.storage.breakpoints.values()) {
        if (breakpointsToSkip > 0) {
            breakpointsToSkip--;
            continue;
        }
        const storageId = Storage.computeId(storageState);
        const breakpoint = new Breakpoint(this, null, storageState, "RESTORED" /* BreakpointOrigin.OTHER */);
        __classPrivateFieldGet(this, _BreakpointManager_breakpointByStorageId, "f").set(storageId, breakpoint);
    }
}, _BreakpointManager_updateBindings = async function _BreakpointManager_updateBindings(uiSourceCode) {
    if (__classPrivateFieldGet(this, _BreakpointManager_updateBindingsCallbacks, "f").length > 0) {
        // It's possible to set breakpoints on files on the file system, and to have them
        // hit whenever we navigate to a page that serves that file.
        // To make sure that we have all breakpoint information moved from the file system
        // to the served file, we need to update the bindings and await it. This will
        // move the breakpoints from the FileSystem UISourceCode to the Network UiSourceCode.
        const promises = [];
        for (const callback of __classPrivateFieldGet(this, _BreakpointManager_updateBindingsCallbacks, "f")) {
            promises.push(callback(uiSourceCode));
        }
        await Promise.all(promises);
    }
}, _BreakpointManager_restoreBreakpointsForUrl = async function _BreakpointManager_restoreBreakpointsForUrl(uiSourceCode) {
    this.restoreBreakpoints(uiSourceCode);
    const breakpoints = __classPrivateFieldGet(this, _BreakpointManager_breakpointByStorageId, "f").values();
    const affectedBreakpoints = Array.from(breakpoints).filter(x => x.uiSourceCodes.has(uiSourceCode));
    // Make sure to properly await their updates
    await Promise.all(affectedBreakpoints.map(bp => bp.updateBreakpoint()));
}, _BreakpointManager_hasBreakpointsForUrl = function _BreakpointManager_hasBreakpointsForUrl(url) {
    // We intentionally don't specify a resource type here, but just check
    // generally whether there's any breakpoint matching the given `url`.
    const breakpointItems = this.storage.breakpointItems(url);
    return breakpointItems.length > 0;
}, _BreakpointManager_getAllBreakpointsForUISourceCode = function _BreakpointManager_getAllBreakpointsForUISourceCode(uiSourceCode) {
    const uiBreakpoints = this.breakpointLocationsForUISourceCode(uiSourceCode).map(b => b.breakpoint);
    return uiBreakpoints.concat(Array.from(__classPrivateFieldGet(this, _BreakpointManager_breakpointsForHomeUISourceCode, "f").get(uiSourceCode) ?? []));
};
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["BreakpointAdded"] = "breakpoint-added";
    Events["BreakpointRemoved"] = "breakpoint-removed";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
export var DebuggerUpdateResult;
(function (DebuggerUpdateResult) {
    DebuggerUpdateResult["OK"] = "OK";
    DebuggerUpdateResult["ERROR_BREAKPOINT_CLASH"] = "ERROR_BREAKPOINT_CLASH";
    DebuggerUpdateResult["ERROR_BACKEND"] = "ERROR_BACKEND";
    // PENDING implies that the current update requires another re-run.
    DebuggerUpdateResult["PENDING"] = "PENDING";
})(DebuggerUpdateResult || (DebuggerUpdateResult = {}));
var ResolveLocationResult;
(function (ResolveLocationResult) {
    ResolveLocationResult["OK"] = "OK";
    ResolveLocationResult["ERROR"] = "ERROR";
})(ResolveLocationResult || (ResolveLocationResult = {}));
export class Breakpoint {
    constructor(breakpointManager, primaryUISourceCode, storageState, origin) {
        _Breakpoint_instances.add(this);
        /** Bound locations */
        _Breakpoint_uiLocations.set(this, new Set());
        /** All known UISourceCodes with this url. This also includes UISourceCodes for the inline scripts embedded in a resource with this URL. */
        this.uiSourceCodes = new Set();
        _Breakpoint_storageState.set(this, void 0);
        _Breakpoint_origin.set(this, void 0);
        this.isRemoved = false;
        /**
         * Fallback positions in case a target doesn't have a script where this breakpoint would fit.
         * The `ModelBreakpoint` sends this optimistically to a target in case a matching script is
         * loaded later.
         *
         * Since every `ModelBreakpoint` can read/write this variable, it's slightly arbitrary. In
         * general `lastResolvedState` contains the state of the last `ModelBreakpoint` that attempted
         * to update the breakpoint(s) in the backend.
         *
         * The state gets populated from the storage if/when we set all breakpoints eagerly
         * on debugger startup so that the backend sets the breakpoints as soon as possible
         * (crbug.com/1442232, under a flag).
         */
        _Breakpoint_lastResolvedState.set(this, null);
        _Breakpoint_modelBreakpoints.set(this, new Map());
        this.breakpointManager = breakpointManager;
        __classPrivateFieldSet(this, _Breakpoint_origin, origin, "f");
        this.updateState(storageState);
        if (primaryUISourceCode) {
            // User is setting the breakpoint in an existing source.
            console.assert(primaryUISourceCode.contentType().name() === storageState.resourceTypeName);
            this.addUISourceCode(primaryUISourceCode);
        }
        else {
            // We are setting the breakpoint from storage.
            __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_setLastResolvedStateFromStorage).call(this, storageState);
        }
        this.breakpointManager.targetManager.observeModels(SDK.DebuggerModel.DebuggerModel, this);
    }
    getLastResolvedState() {
        return __classPrivateFieldGet(this, _Breakpoint_lastResolvedState, "f");
    }
    updateLastResolvedState(locations) {
        __classPrivateFieldSet(this, _Breakpoint_lastResolvedState, locations, "f");
        let locationsOrUndefined = undefined;
        if (locations) {
            locationsOrUndefined = locations.map(p => ({ url: p.url, lineNumber: p.lineNumber, columnNumber: p.columnNumber, condition: p.condition }));
        }
        if (resolvedStateEqual(__classPrivateFieldGet(this, _Breakpoint_storageState, "f").resolvedState, locationsOrUndefined)) {
            return;
        }
        __classPrivateFieldSet(this, _Breakpoint_storageState, { ...__classPrivateFieldGet(this, _Breakpoint_storageState, "f"), resolvedState: locationsOrUndefined }, "f");
        this.breakpointManager.storage.updateBreakpoint(__classPrivateFieldGet(this, _Breakpoint_storageState, "f"));
    }
    get origin() {
        return __classPrivateFieldGet(this, _Breakpoint_origin, "f");
    }
    async refreshInDebugger() {
        if (!this.isRemoved) {
            const modelBreakpoints = Array.from(__classPrivateFieldGet(this, _Breakpoint_modelBreakpoints, "f").values());
            await Promise.all(modelBreakpoints.map(async (modelBreakpoint) => {
                await modelBreakpoint.resetBreakpoint();
                return await __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_updateModel).call(this, modelBreakpoint);
            }));
        }
    }
    modelAdded(debuggerModel) {
        const debuggerWorkspaceBinding = this.breakpointManager.debuggerWorkspaceBinding;
        const modelBreakpoint = new ModelBreakpoint(debuggerModel, this, debuggerWorkspaceBinding);
        __classPrivateFieldGet(this, _Breakpoint_modelBreakpoints, "f").set(debuggerModel, modelBreakpoint);
        void __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_updateModel).call(this, modelBreakpoint);
        debuggerModel.addEventListener(SDK.DebuggerModel.Events.DebuggerWasEnabled, __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_onDebuggerEnabled), this);
        debuggerModel.addEventListener(SDK.DebuggerModel.Events.DebuggerWasDisabled, __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_onDebuggerDisabled), this);
        debuggerModel.addEventListener(SDK.DebuggerModel.Events.ScriptSourceWasEdited, __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_onScriptWasEdited), this);
    }
    modelRemoved(debuggerModel) {
        const modelBreakpoint = __classPrivateFieldGet(this, _Breakpoint_modelBreakpoints, "f").get(debuggerModel);
        modelBreakpoint?.cleanUpAfterDebuggerIsGone();
        __classPrivateFieldGet(this, _Breakpoint_modelBreakpoints, "f").delete(debuggerModel);
        __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_removeDebuggerModelListeners).call(this, debuggerModel);
    }
    modelBreakpoint(debuggerModel) {
        return __classPrivateFieldGet(this, _Breakpoint_modelBreakpoints, "f").get(debuggerModel);
    }
    addUISourceCode(uiSourceCode) {
        if (!this.uiSourceCodes.has(uiSourceCode)) {
            this.uiSourceCodes.add(uiSourceCode);
            this.breakpointManager.addHomeUISourceCode(uiSourceCode, this);
            if (!this.bound()) {
                this.breakpointManager.uiLocationAdded(this, this.defaultUILocation(uiSourceCode));
            }
        }
    }
    clearUISourceCodes() {
        if (!this.bound()) {
            this.removeAllUnboundLocations();
        }
        for (const uiSourceCode of this.uiSourceCodes) {
            this.removeUISourceCode(uiSourceCode);
        }
    }
    removeUISourceCode(uiSourceCode) {
        if (this.uiSourceCodes.has(uiSourceCode)) {
            this.uiSourceCodes.delete(uiSourceCode);
            this.breakpointManager.removeHomeUISourceCode(uiSourceCode, this);
            if (!this.bound()) {
                this.breakpointManager.uiLocationRemoved(this.defaultUILocation(uiSourceCode));
            }
        }
        // Do we need to do this? Not sure if bound locations will leak...
        if (this.bound()) {
            for (const uiLocation of __classPrivateFieldGet(this, _Breakpoint_uiLocations, "f")) {
                if (uiLocation.uiSourceCode === uiSourceCode) {
                    __classPrivateFieldGet(this, _Breakpoint_uiLocations, "f").delete(uiLocation);
                    this.breakpointManager.uiLocationRemoved(uiLocation);
                }
            }
            if (!this.bound() && !this.isRemoved) {
                // Switch to unbound locations
                this.addAllUnboundLocations();
            }
        }
    }
    url() {
        return __classPrivateFieldGet(this, _Breakpoint_storageState, "f").url;
    }
    lineNumber() {
        return __classPrivateFieldGet(this, _Breakpoint_storageState, "f").lineNumber;
    }
    columnNumber() {
        return __classPrivateFieldGet(this, _Breakpoint_storageState, "f").columnNumber;
    }
    uiLocationAdded(uiLocation) {
        if (this.isRemoved) {
            return;
        }
        if (!this.bound()) {
            // This is our first bound location; remove all unbound locations
            this.removeAllUnboundLocations();
        }
        __classPrivateFieldGet(this, _Breakpoint_uiLocations, "f").add(uiLocation);
        this.breakpointManager.uiLocationAdded(this, uiLocation);
    }
    uiLocationRemoved(uiLocation) {
        if (__classPrivateFieldGet(this, _Breakpoint_uiLocations, "f").has(uiLocation)) {
            __classPrivateFieldGet(this, _Breakpoint_uiLocations, "f").delete(uiLocation);
            this.breakpointManager.uiLocationRemoved(uiLocation);
            if (!this.bound() && !this.isRemoved) {
                this.addAllUnboundLocations();
            }
        }
    }
    enabled() {
        return __classPrivateFieldGet(this, _Breakpoint_storageState, "f").enabled;
    }
    bound() {
        return __classPrivateFieldGet(this, _Breakpoint_uiLocations, "f").size !== 0;
    }
    setEnabled(enabled) {
        this.updateState({ ...__classPrivateFieldGet(this, _Breakpoint_storageState, "f"), enabled });
    }
    /**
     * The breakpoint condition as entered by the user.
     */
    condition() {
        return __classPrivateFieldGet(this, _Breakpoint_storageState, "f").condition;
    }
    backendCondition(location) {
        const condition = this.condition();
        if (condition === '') {
            return '';
        }
        const addSourceUrl = (condition) => {
            let sourceUrl = SDK.DebuggerModel.COND_BREAKPOINT_SOURCE_URL;
            if (this.isLogpoint()) {
                condition = `${LOGPOINT_PREFIX}${condition}${LOGPOINT_SUFFIX}`;
                sourceUrl = SDK.DebuggerModel.LOGPOINT_SOURCE_URL;
            }
            return `${condition}\n\n//# sourceURL=${sourceUrl}`;
        };
        if (location) {
            return SourceMapScopes.NamesResolver.allVariablesAtPosition(location)
                .then(nameMap => Formatter.FormatterWorkerPool.formatterWorkerPool().javaScriptSubstitute(condition, nameMap))
                .catch(() => condition)
                .then(subsitutedCondition => addSourceUrl(subsitutedCondition), () => addSourceUrl(condition));
        }
        return addSourceUrl(condition);
    }
    setCondition(condition, isLogpoint) {
        this.updateState({ ...__classPrivateFieldGet(this, _Breakpoint_storageState, "f"), condition, isLogpoint });
    }
    isLogpoint() {
        return __classPrivateFieldGet(this, _Breakpoint_storageState, "f").isLogpoint;
    }
    get storageState() {
        return __classPrivateFieldGet(this, _Breakpoint_storageState, "f");
    }
    updateState(newState) {
        // Only 'enabled', 'condition' and 'isLogpoint' can change (except during initialization).
        if (__classPrivateFieldGet(this, _Breakpoint_storageState, "f") &&
            (__classPrivateFieldGet(this, _Breakpoint_storageState, "f").url !== newState.url || __classPrivateFieldGet(this, _Breakpoint_storageState, "f").lineNumber !== newState.lineNumber ||
                __classPrivateFieldGet(this, _Breakpoint_storageState, "f").columnNumber !== newState.columnNumber)) {
            throw new Error('Invalid breakpoint state update');
        }
        if (__classPrivateFieldGet(this, _Breakpoint_storageState, "f")?.enabled === newState.enabled && __classPrivateFieldGet(this, _Breakpoint_storageState, "f")?.condition === newState.condition &&
            __classPrivateFieldGet(this, _Breakpoint_storageState, "f")?.isLogpoint === newState.isLogpoint) {
            return;
        }
        __classPrivateFieldSet(this, _Breakpoint_storageState, newState, "f");
        this.breakpointManager.storage.updateBreakpoint(__classPrivateFieldGet(this, _Breakpoint_storageState, "f"));
        void this.updateBreakpoint();
    }
    async updateBreakpoint() {
        if (!this.bound()) {
            this.removeAllUnboundLocations();
            if (!this.isRemoved) {
                this.addAllUnboundLocations();
            }
        }
        return await __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_updateModels).call(this);
    }
    async remove(keepInStorage) {
        if (this.getIsRemoved()) {
            return;
        }
        this.isRemoved = true;
        const removeFromStorage = !keepInStorage;
        for (const debuggerModel of __classPrivateFieldGet(this, _Breakpoint_modelBreakpoints, "f").keys()) {
            __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_removeDebuggerModelListeners).call(this, debuggerModel);
        }
        await __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_updateModels).call(this);
        this.breakpointManager.removeBreakpoint(this, removeFromStorage);
        this.breakpointManager.targetManager.unobserveModels(SDK.DebuggerModel.DebuggerModel, this);
        this.clearUISourceCodes();
    }
    breakpointStorageId() {
        return Storage.computeId(__classPrivateFieldGet(this, _Breakpoint_storageState, "f"));
    }
    defaultUILocation(uiSourceCode) {
        return BreakpointManager.uiLocationFromBreakpointLocation(uiSourceCode, __classPrivateFieldGet(this, _Breakpoint_storageState, "f").lineNumber, __classPrivateFieldGet(this, _Breakpoint_storageState, "f").columnNumber);
    }
    removeAllUnboundLocations() {
        for (const uiSourceCode of this.uiSourceCodes) {
            this.breakpointManager.uiLocationRemoved(this.defaultUILocation(uiSourceCode));
        }
    }
    addAllUnboundLocations() {
        for (const uiSourceCode of this.uiSourceCodes) {
            this.breakpointManager.uiLocationAdded(this, this.defaultUILocation(uiSourceCode));
        }
    }
    getUiSourceCodes() {
        return this.uiSourceCodes;
    }
    getIsRemoved() {
        return this.isRemoved;
    }
}
_Breakpoint_uiLocations = new WeakMap(), _Breakpoint_storageState = new WeakMap(), _Breakpoint_origin = new WeakMap(), _Breakpoint_lastResolvedState = new WeakMap(), _Breakpoint_modelBreakpoints = new WeakMap(), _Breakpoint_instances = new WeakSet(), _Breakpoint_setLastResolvedStateFromStorage = function _Breakpoint_setLastResolvedStateFromStorage(storageState) {
    if (storageState.resolvedState) {
        __classPrivateFieldSet(this, _Breakpoint_lastResolvedState, storageState.resolvedState.map(s => ({ ...s, scriptHash: '' })), "f");
    }
    else if (storageState.resourceTypeName === Common.ResourceType.resourceTypes.Script.name()) {
        // If we are setting the breakpoint from storage (i.e., primaryUISourceCode is null),
        // and the location is not source mapped, then set the last known state to
        // the state from storage so that the breakpoints are pre-set into the backend eagerly.
        __classPrivateFieldSet(this, _Breakpoint_lastResolvedState, [{
                url: storageState.url,
                lineNumber: storageState.lineNumber,
                columnNumber: storageState.columnNumber,
                scriptHash: '',
                condition: this.backendCondition(),
            }], "f");
    }
}, _Breakpoint_removeDebuggerModelListeners = function _Breakpoint_removeDebuggerModelListeners(debuggerModel) {
    debuggerModel.removeEventListener(SDK.DebuggerModel.Events.DebuggerWasEnabled, __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_onDebuggerEnabled), this);
    debuggerModel.removeEventListener(SDK.DebuggerModel.Events.DebuggerWasDisabled, __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_onDebuggerDisabled), this);
    debuggerModel.removeEventListener(SDK.DebuggerModel.Events.ScriptSourceWasEdited, __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_onScriptWasEdited), this);
}, _Breakpoint_onDebuggerEnabled = function _Breakpoint_onDebuggerEnabled(event) {
    const debuggerModel = event.data;
    const model = __classPrivateFieldGet(this, _Breakpoint_modelBreakpoints, "f").get(debuggerModel);
    if (model) {
        void __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_updateModel).call(this, model);
    }
}, _Breakpoint_onDebuggerDisabled = function _Breakpoint_onDebuggerDisabled(event) {
    const debuggerModel = event.data;
    const model = __classPrivateFieldGet(this, _Breakpoint_modelBreakpoints, "f").get(debuggerModel);
    model?.cleanUpAfterDebuggerIsGone();
}, _Breakpoint_onScriptWasEdited = async function _Breakpoint_onScriptWasEdited(event) {
    const { source: debuggerModel, data: { script, status } } = event;
    if (status !== "Ok" /* Protocol.Debugger.SetScriptSourceResponseStatus.Ok */) {
        return;
    }
    // V8 throws away breakpoints on all functions in a live edited script. Here we attempt to re-set them again at the
    // same position. This is because we don't know what was edited and how the breakpoint should move, e.g. if the file
    // was originally changed on the filesystem (via workspace).
    // If the live edit originated in DevTools (in CodeMirror), then the `DebuggerPlugin` will remove the breakpoint
    // wholesale and re-apply based on the diff.
    console.assert(debuggerModel instanceof SDK.DebuggerModel.DebuggerModel);
    const model = __classPrivateFieldGet(this, _Breakpoint_modelBreakpoints, "f").get(debuggerModel);
    if (model?.wasSetIn(script.scriptId)) {
        await model.resetBreakpoint();
        void __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_updateModel).call(this, model);
    }
}, _Breakpoint_updateModels = async function _Breakpoint_updateModels() {
    await Promise.all(Array.from(__classPrivateFieldGet(this, _Breakpoint_modelBreakpoints, "f").values()).map(model => __classPrivateFieldGet(this, _Breakpoint_instances, "m", _Breakpoint_updateModel).call(this, model)));
}, _Breakpoint_updateModel = async function _Breakpoint_updateModel(model) {
    const result = await model.scheduleUpdateInDebugger();
    if (result === "ERROR_BACKEND" /* DebuggerUpdateResult.ERROR_BACKEND */) {
        await this.remove(true /* keepInStorage */);
    }
    else if (result === "ERROR_BREAKPOINT_CLASH" /* DebuggerUpdateResult.ERROR_BREAKPOINT_CLASH */) {
        await this.remove(false /* keepInStorage */);
    }
};
/**
 * Represents a single `Breakpoint` for a specific target.
 *
 * The `BreakpointManager` unconditionally creates a `ModelBreakpoint` instance
 * for each target since any target could load a matching script after the fact.
 *
 * Each `ModelBreakpoint` can represent multiple actual breakpoints in V8. E.g.
 * inlining in WASM or multiple bundles containing the same utility function.
 *
 * This means each `Modelbreakpoint` represents 0 to n actual breakpoints in
 * for it's specific target.
 */
export class ModelBreakpoint {
    constructor(debuggerModel, breakpoint, debuggerWorkspaceBinding) {
        _ModelBreakpoint_instances.add(this);
        _ModelBreakpoint_debuggerModel.set(this, void 0);
        _ModelBreakpoint_breakpoint.set(this, void 0);
        _ModelBreakpoint_debuggerWorkspaceBinding.set(this, void 0);
        _ModelBreakpoint_liveLocations.set(this, new Bindings.LiveLocation.LiveLocationPool());
        _ModelBreakpoint_uiLocations.set(this, new Map());
        _ModelBreakpoint_updateMutex.set(this, new Common.Mutex.Mutex());
        _ModelBreakpoint_cancelCallback.set(this, false);
        _ModelBreakpoint_currentState.set(this, null);
        _ModelBreakpoint_breakpointIds.set(this, []);
        /**
         * We track all the script IDs this ModelBreakpoint was actually set in. This allows us
         * to properly reset this ModelBreakpoint after a script was live edited.
         */
        _ModelBreakpoint_resolvedScriptIds.set(this, new Set());
        __classPrivateFieldSet(this, _ModelBreakpoint_debuggerModel, debuggerModel, "f");
        __classPrivateFieldSet(this, _ModelBreakpoint_breakpoint, breakpoint, "f");
        __classPrivateFieldSet(this, _ModelBreakpoint_debuggerWorkspaceBinding, debuggerWorkspaceBinding, "f");
    }
    get currentState() {
        return __classPrivateFieldGet(this, _ModelBreakpoint_currentState, "f");
    }
    resetLocations() {
        for (const uiLocation of __classPrivateFieldGet(this, _ModelBreakpoint_uiLocations, "f").values()) {
            __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").uiLocationRemoved(uiLocation);
        }
        __classPrivateFieldGet(this, _ModelBreakpoint_uiLocations, "f").clear();
        __classPrivateFieldGet(this, _ModelBreakpoint_liveLocations, "f").disposeAll();
        __classPrivateFieldGet(this, _ModelBreakpoint_resolvedScriptIds, "f").clear();
    }
    async scheduleUpdateInDebugger() {
        if (!__classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").debuggerEnabled()) {
            return "OK" /* DebuggerUpdateResult.OK */;
        }
        const release = await __classPrivateFieldGet(this, _ModelBreakpoint_updateMutex, "f").acquire();
        let result = "PENDING" /* DebuggerUpdateResult.PENDING */;
        while (result === "PENDING" /* DebuggerUpdateResult.PENDING */) {
            result = await __classPrivateFieldGet(this, _ModelBreakpoint_instances, "m", _ModelBreakpoint_updateInDebugger).call(this);
            // TODO(crbug.com/1229541): This is a mirror to the quickfix
            // in #updateInDebugger. If the model didn't enable yet, instead of
            // spamming the "setBreakpoint" call to the backend, we'll wait for
            // it to finish enabling.
            if (__classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").debuggerEnabled() && !__classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").isReadyToPause()) {
                await __classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").once(SDK.DebuggerModel.Events.DebuggerIsReadyToPause);
                if (!__classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").debuggerEnabled()) {
                    // If the model failed to enable, we won't try to set the breakpoint.
                    result = "OK" /* DebuggerUpdateResult.OK */;
                    break;
                }
            }
        }
        release();
        return result;
    }
    scriptDiverged() {
        for (const uiSourceCode of __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").getUiSourceCodes()) {
            const scriptFile = __classPrivateFieldGet(this, _ModelBreakpoint_debuggerWorkspaceBinding, "f").scriptFile(uiSourceCode, __classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f"));
            if (scriptFile?.hasDivergedFromVM()) {
                return true;
            }
        }
        return false;
    }
    async resetBreakpoint() {
        if (!__classPrivateFieldGet(this, _ModelBreakpoint_breakpointIds, "f").length) {
            return;
        }
        this.resetLocations();
        await Promise.all(__classPrivateFieldGet(this, _ModelBreakpoint_breakpointIds, "f").map(id => __classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").removeBreakpoint(id)));
        this.didRemoveFromDebugger();
        __classPrivateFieldSet(this, _ModelBreakpoint_currentState, null, "f");
    }
    didRemoveFromDebugger() {
        if (__classPrivateFieldGet(this, _ModelBreakpoint_cancelCallback, "f")) {
            __classPrivateFieldSet(this, _ModelBreakpoint_cancelCallback, false, "f");
            return;
        }
        this.resetLocations();
        __classPrivateFieldGet(this, _ModelBreakpoint_breakpointIds, "f").forEach(breakpointId => __classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").removeBreakpointListener(breakpointId, this.breakpointResolved, this));
        __classPrivateFieldSet(this, _ModelBreakpoint_breakpointIds, [], "f");
    }
    async breakpointResolved({ data: location }) {
        const result = await this.addResolvedLocation(location);
        if (result === "ERROR" /* ResolveLocationResult.ERROR */) {
            await __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").remove(false /* keepInStorage */);
        }
    }
    async locationUpdated(liveLocation) {
        const oldUILocation = __classPrivateFieldGet(this, _ModelBreakpoint_uiLocations, "f").get(liveLocation);
        const uiLocation = await liveLocation.uiLocation();
        if (oldUILocation) {
            __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").uiLocationRemoved(oldUILocation);
        }
        if (uiLocation) {
            __classPrivateFieldGet(this, _ModelBreakpoint_uiLocations, "f").set(liveLocation, uiLocation);
            __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").uiLocationAdded(uiLocation);
        }
        else {
            __classPrivateFieldGet(this, _ModelBreakpoint_uiLocations, "f").delete(liveLocation);
        }
    }
    async addResolvedLocation(location) {
        __classPrivateFieldGet(this, _ModelBreakpoint_resolvedScriptIds, "f").add(location.scriptId);
        const uiLocation = await __classPrivateFieldGet(this, _ModelBreakpoint_debuggerWorkspaceBinding, "f").rawLocationToUILocation(location);
        if (!uiLocation) {
            return "OK" /* ResolveLocationResult.OK */;
        }
        const breakpointLocation = __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").breakpointManager.findBreakpoint(uiLocation);
        if (breakpointLocation && breakpointLocation.breakpoint !== __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f")) {
            // location clash
            return "ERROR" /* ResolveLocationResult.ERROR */;
        }
        await __classPrivateFieldGet(this, _ModelBreakpoint_debuggerWorkspaceBinding, "f").createLiveLocation(location, this.locationUpdated.bind(this), __classPrivateFieldGet(this, _ModelBreakpoint_liveLocations, "f"));
        return "OK" /* ResolveLocationResult.OK */;
    }
    cleanUpAfterDebuggerIsGone() {
        __classPrivateFieldSet(this, _ModelBreakpoint_cancelCallback, true, "f");
        this.resetLocations();
        __classPrivateFieldSet(this, _ModelBreakpoint_currentState, null, "f");
        if (__classPrivateFieldGet(this, _ModelBreakpoint_breakpointIds, "f").length) {
            this.didRemoveFromDebugger();
        }
    }
    /** @returns true, iff this `ModelBreakpoint` was set (at some point) in `scriptId` */
    wasSetIn(scriptId) {
        return __classPrivateFieldGet(this, _ModelBreakpoint_resolvedScriptIds, "f").has(scriptId);
    }
}
_ModelBreakpoint_debuggerModel = new WeakMap(), _ModelBreakpoint_breakpoint = new WeakMap(), _ModelBreakpoint_debuggerWorkspaceBinding = new WeakMap(), _ModelBreakpoint_liveLocations = new WeakMap(), _ModelBreakpoint_uiLocations = new WeakMap(), _ModelBreakpoint_updateMutex = new WeakMap(), _ModelBreakpoint_cancelCallback = new WeakMap(), _ModelBreakpoint_currentState = new WeakMap(), _ModelBreakpoint_breakpointIds = new WeakMap(), _ModelBreakpoint_resolvedScriptIds = new WeakMap(), _ModelBreakpoint_instances = new WeakSet(), _ModelBreakpoint_updateInDebugger = async function _ModelBreakpoint_updateInDebugger() {
    if (__classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").target().isDisposed()) {
        this.cleanUpAfterDebuggerIsGone();
        return "OK" /* DebuggerUpdateResult.OK */;
    }
    const lineNumber = __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").lineNumber();
    const columnNumber = __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").columnNumber();
    const condition = __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").backendCondition();
    // Calculate the new state.
    let newState = null;
    if (!__classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").getIsRemoved() && __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").enabled() && !this.scriptDiverged()) {
        let debuggerLocations = [];
        for (const uiSourceCode of __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").getUiSourceCodes()) {
            const { lineNumber: uiLineNumber, columnNumber: uiColumnNumber } = BreakpointManager.uiLocationFromBreakpointLocation(uiSourceCode, lineNumber, columnNumber);
            const locations = await Bindings.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().uiLocationToRawLocations(uiSourceCode, uiLineNumber, uiColumnNumber);
            debuggerLocations = locations.filter(location => location.debuggerModel === __classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f"));
            if (debuggerLocations.length) {
                break;
            }
        }
        if (debuggerLocations.length && debuggerLocations.every(loc => loc.script())) {
            const positions = await Promise.all(debuggerLocations.map(async (loc) => {
                const script = loc.script();
                const condition = await __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").backendCondition(loc);
                return {
                    url: script.sourceURL,
                    scriptHash: script.hash,
                    lineNumber: loc.lineNumber,
                    columnNumber: loc.columnNumber,
                    condition,
                };
            }));
            newState = positions.slice(0); // Create a copy
        }
        else if (!Root.Runtime.experiments.isEnabled("instrumentation-breakpoints" /* Root.Runtime.ExperimentName.INSTRUMENTATION_BREAKPOINTS */)) {
            // Use this fallback if we do not have instrumentation breakpoints enabled yet. This currently makes
            // sure that v8 knows about the breakpoint and is able to restore it whenever the script is parsed.
            const lastResolvedState = __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").getLastResolvedState();
            if (lastResolvedState) {
                // Re-use position information from fallback but use up-to-date condition.
                newState = lastResolvedState.map(position => ({ ...position, condition }));
            }
            else {
                // TODO(bmeurer): This fallback doesn't make a whole lot of sense, we should
                // at least signal a warning to the developer that this #breakpoint wasn't
                // really resolved.
                const position = {
                    url: __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").url(),
                    scriptHash: '',
                    lineNumber,
                    columnNumber,
                    condition,
                };
                newState = [position];
            }
        }
    }
    const hasBackendState = __classPrivateFieldGet(this, _ModelBreakpoint_breakpointIds, "f").length;
    // Case 1: Back-end has some breakpoints and the new state is a proper subset
    // of the back-end state (in particular the new state contains at least a single
    // position, meaning we're not removing the breakpoint completely).
    if (hasBackendState && Breakpoint.State.subset(newState, __classPrivateFieldGet(this, _ModelBreakpoint_currentState, "f"))) {
        return "OK" /* DebuggerUpdateResult.OK */;
    }
    __classPrivateFieldGet(this, _ModelBreakpoint_breakpoint, "f").updateLastResolvedState(newState);
    // Case 2: State has changed, and the back-end has outdated information on old
    // breakpoints.
    if (hasBackendState) {
        // Reset the current state.
        await this.resetBreakpoint();
        // Schedule another run of updates, to finally update to the new state.
        return "PENDING" /* DebuggerUpdateResult.PENDING */;
    }
    // Case 3: State is null (no breakpoints to set), and back-end is up to date
    // (no info on breakpoints).
    if (!newState) {
        return "OK" /* DebuggerUpdateResult.OK */;
    }
    // Case 4: State is not null, so we have breakpoints to set and the back-end
    // has no information on breakpoints yet. Set the breakpoints.
    const { breakpointIds, locations, serverError } = await __classPrivateFieldGet(this, _ModelBreakpoint_instances, "m", _ModelBreakpoint_setBreakpointOnBackend).call(this, newState);
    const maybeRescheduleUpdate = serverError && __classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").debuggerEnabled() && !__classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").isReadyToPause();
    if (!breakpointIds.length && maybeRescheduleUpdate) {
        // TODO(crbug.com/1229541): This is a quickfix to prevent #breakpoints from
        // disappearing if the Debugger is actually not enabled
        // yet. This quickfix should be removed as soon as we have a solution
        // to correctly synchronize the front-end with the inspector back-end.
        return "PENDING" /* DebuggerUpdateResult.PENDING */;
    }
    __classPrivateFieldSet(this, _ModelBreakpoint_currentState, newState, "f");
    if (__classPrivateFieldGet(this, _ModelBreakpoint_cancelCallback, "f")) {
        __classPrivateFieldSet(this, _ModelBreakpoint_cancelCallback, false, "f");
        return "OK" /* DebuggerUpdateResult.OK */;
    }
    // Something went wrong: we expect to have a non-null state, but have not received any
    // breakpointIds from the back-end.
    if (!breakpointIds.length) {
        return "ERROR_BACKEND" /* DebuggerUpdateResult.ERROR_BACKEND */;
    }
    __classPrivateFieldSet(this, _ModelBreakpoint_breakpointIds, breakpointIds, "f");
    __classPrivateFieldGet(this, _ModelBreakpoint_breakpointIds, "f").forEach(breakpointId => __classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").addBreakpointListener(breakpointId, this.breakpointResolved, this));
    const resolvedResults = await Promise.all(locations.map(location => this.addResolvedLocation(location)));
    // Breakpoint clash: the resolved location resolves to a different breakpoint, report an error.
    if (resolvedResults.includes("ERROR" /* ResolveLocationResult.ERROR */)) {
        return "ERROR_BREAKPOINT_CLASH" /* DebuggerUpdateResult.ERROR_BREAKPOINT_CLASH */;
    }
    return "OK" /* DebuggerUpdateResult.OK */;
}, _ModelBreakpoint_setBreakpointOnBackend = async function _ModelBreakpoint_setBreakpointOnBackend(positions) {
    const results = await Promise.all(positions.map(pos => {
        if (pos.url) {
            return __classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").setBreakpointByURL(pos.url, pos.lineNumber, pos.columnNumber, pos.condition);
        }
        return __classPrivateFieldGet(this, _ModelBreakpoint_debuggerModel, "f").setBreakpointInAnonymousScript(pos.scriptHash, pos.lineNumber, pos.columnNumber, pos.condition);
    }));
    const breakpointIds = [];
    let locations = [];
    let serverError = false;
    for (const result of results) {
        if (result.breakpointId) {
            breakpointIds.push(result.breakpointId);
            locations = locations.concat(result.locations);
        }
        else {
            serverError = true;
        }
    }
    return { breakpointIds, locations, serverError };
};
export var BreakpointOrigin;
(function (BreakpointOrigin) {
    BreakpointOrigin["USER_ACTION"] = "USER_ACTION";
    BreakpointOrigin["OTHER"] = "RESTORED";
})(BreakpointOrigin || (BreakpointOrigin = {}));
(function (Breakpoint) {
    let State;
    (function (State) {
        function subset(stateA, stateB) {
            if (stateA === stateB) {
                return true;
            }
            if (!stateA || !stateB) {
                return false;
            }
            if (stateA.length === 0) {
                return false;
            }
            for (const positionA of stateA) {
                if (stateB.find(positionB => positionA.url === positionB.url && positionA.scriptHash === positionB.scriptHash &&
                    positionA.lineNumber === positionB.lineNumber &&
                    positionA.columnNumber === positionB.columnNumber &&
                    positionA.condition === positionB.condition) === undefined) {
                    return false;
                }
            }
            return true;
        }
        State.subset = subset;
    })(State = Breakpoint.State || (Breakpoint.State = {}));
})(Breakpoint || (Breakpoint = {}));
class Storage {
    constructor() {
        _Storage_muted.set(this, void 0);
        this.setting = Common.Settings.Settings.instance().createLocalSetting('breakpoints', []);
        this.breakpoints = new Map();
        __classPrivateFieldSet(this, _Storage_muted, false, "f");
        for (const breakpoint of this.setting.get()) {
            this.breakpoints.set(Storage.computeId(breakpoint), breakpoint);
        }
    }
    mute() {
        __classPrivateFieldSet(this, _Storage_muted, true, "f");
    }
    unmute() {
        __classPrivateFieldSet(this, _Storage_muted, false, "f");
    }
    breakpointItems(url, resourceTypeName) {
        const breakpoints = [];
        for (const breakpoint of this.breakpoints.values()) {
            if (breakpoint.url !== url) {
                continue;
            }
            if (breakpoint.resourceTypeName !== resourceTypeName && resourceTypeName !== undefined) {
                continue;
            }
            breakpoints.push(breakpoint);
        }
        return breakpoints;
    }
    updateBreakpoint(storageState) {
        if (__classPrivateFieldGet(this, _Storage_muted, "f")) {
            return;
        }
        const storageId = Storage.computeId(storageState);
        if (!storageId) {
            return;
        }
        // Delete the breakpoint and re-insert it so that it is moved to the last position in the iteration order.
        this.breakpoints.delete(storageId);
        this.breakpoints.set(storageId, storageState);
        this.save();
    }
    removeBreakpoint(storageId) {
        if (__classPrivateFieldGet(this, _Storage_muted, "f")) {
            return;
        }
        this.breakpoints.delete(storageId);
        this.save();
    }
    save() {
        this.setting.set(Array.from(this.breakpoints.values()));
    }
    static computeId({ url, resourceTypeName, lineNumber, columnNumber }) {
        if (!url) {
            return '';
        }
        let id = `${url}:${resourceTypeName}:${lineNumber}`;
        if (columnNumber !== undefined) {
            id += `:${columnNumber}`;
        }
        return id;
    }
}
_Storage_muted = new WeakMap();
function resolvedStateEqual(lhs, rhs) {
    if (lhs === rhs) {
        return true;
    }
    if (!lhs || !rhs || lhs.length !== rhs.length) {
        return false;
    }
    for (let i = 0; i < lhs.length; i++) {
        const lhsLoc = lhs[i];
        const rhsLoc = rhs[i];
        if (lhsLoc.url !== rhsLoc.url || lhsLoc.lineNumber !== rhsLoc.lineNumber ||
            lhsLoc.columnNumber !== rhsLoc.columnNumber || lhsLoc.condition !== rhsLoc.condition) {
            return false;
        }
    }
    return true;
}
export const EMPTY_BREAKPOINT_CONDITION = '';
export const NEVER_PAUSE_HERE_CONDITION = 'false';
export class BreakpointLocation {
    constructor(breakpoint, uiLocation) {
        this.breakpoint = breakpoint;
        this.uiLocation = uiLocation;
    }
}
const LOGPOINT_PREFIX = '/** DEVTOOLS_LOGPOINT */ console.log(';
const LOGPOINT_SUFFIX = ')';
//# sourceMappingURL=BreakpointManager.js.map