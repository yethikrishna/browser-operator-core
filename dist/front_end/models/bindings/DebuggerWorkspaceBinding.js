// Copyright 2014 The Chromium Authors. All rights reserved.
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
var _DebuggerWorkspaceBinding_debuggerModelToData, _DebuggerWorkspaceBinding_liveLocationPromises, _ModelData_debuggerModel, _ModelData_debuggerWorkspaceBinding, _ModelData_defaultMapping, _ModelData_resourceMapping, _ModelData_resourceScriptMapping, _ModelData_locations, _Location_binding, _StackTraceTopFrameLocation_updateScheduled, _StackTraceTopFrameLocation_current, _StackTraceTopFrameLocation_locations;
import * as Common from '../../core/common/common.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Workspace from '../workspace/workspace.js';
import { CompilerScriptMapping } from './CompilerScriptMapping.js';
import { DebuggerLanguagePluginManager } from './DebuggerLanguagePlugins.js';
import { DefaultScriptMapping } from './DefaultScriptMapping.js';
import { IgnoreListManager } from './IgnoreListManager.js';
import { LiveLocationWithPool } from './LiveLocation.js';
import { NetworkProject } from './NetworkProject.js';
import { ResourceScriptMapping } from './ResourceScriptMapping.js';
let debuggerWorkspaceBindingInstance;
export class DebuggerWorkspaceBinding {
    constructor(resourceMapping, targetManager) {
        _DebuggerWorkspaceBinding_debuggerModelToData.set(this, void 0);
        _DebuggerWorkspaceBinding_liveLocationPromises.set(this, void 0);
        this.resourceMapping = resourceMapping;
        __classPrivateFieldSet(this, _DebuggerWorkspaceBinding_debuggerModelToData, new Map(), "f");
        targetManager.addModelListener(SDK.DebuggerModel.DebuggerModel, SDK.DebuggerModel.Events.GlobalObjectCleared, this.globalObjectCleared, this);
        targetManager.addModelListener(SDK.DebuggerModel.DebuggerModel, SDK.DebuggerModel.Events.DebuggerResumed, this.debuggerResumed, this);
        targetManager.observeModels(SDK.DebuggerModel.DebuggerModel, this);
        __classPrivateFieldSet(this, _DebuggerWorkspaceBinding_liveLocationPromises, new Set(), "f");
        this.pluginManager = new DebuggerLanguagePluginManager(targetManager, resourceMapping.workspace, this);
    }
    setFunctionRanges(uiSourceCode, ranges) {
        for (const modelData of __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").values()) {
            modelData.compilerMapping.setFunctionRanges(uiSourceCode, ranges);
        }
    }
    static instance(opts = { forceNew: null, resourceMapping: null, targetManager: null }) {
        const { forceNew, resourceMapping, targetManager } = opts;
        if (!debuggerWorkspaceBindingInstance || forceNew) {
            if (!resourceMapping || !targetManager) {
                throw new Error(`Unable to create DebuggerWorkspaceBinding: resourceMapping and targetManager must be provided: ${new Error().stack}`);
            }
            debuggerWorkspaceBindingInstance = new DebuggerWorkspaceBinding(resourceMapping, targetManager);
        }
        return debuggerWorkspaceBindingInstance;
    }
    static removeInstance() {
        debuggerWorkspaceBindingInstance = undefined;
    }
    async computeAutoStepRanges(mode, callFrame) {
        function contained(location, range) {
            const { start, end } = range;
            if (start.scriptId !== location.scriptId) {
                return false;
            }
            if (location.lineNumber < start.lineNumber || location.lineNumber > end.lineNumber) {
                return false;
            }
            if (location.lineNumber === start.lineNumber && location.columnNumber < start.columnNumber) {
                return false;
            }
            if (location.lineNumber === end.lineNumber && location.columnNumber >= end.columnNumber) {
                return false;
            }
            return true;
        }
        const rawLocation = callFrame.location();
        if (!rawLocation) {
            return [];
        }
        const pluginManager = this.pluginManager;
        let ranges = [];
        if (mode === "StepOut" /* SDK.DebuggerModel.StepMode.STEP_OUT */) {
            // Step out of inline function.
            return await pluginManager.getInlinedFunctionRanges(rawLocation);
        }
        const uiLocation = await pluginManager.rawLocationToUILocation(rawLocation);
        if (uiLocation) {
            ranges = await pluginManager.uiLocationToRawLocationRanges(uiLocation.uiSourceCode, uiLocation.lineNumber, uiLocation.columnNumber) ||
                [];
            // TODO(bmeurer): Remove the {rawLocation} from the {ranges}?
            ranges = ranges.filter(range => contained(rawLocation, range));
            if (mode === "StepOver" /* SDK.DebuggerModel.StepMode.STEP_OVER */) {
                // Step over an inlined function.
                ranges = ranges.concat(await pluginManager.getInlinedCalleesRanges(rawLocation));
            }
            return ranges;
        }
        const compilerMapping = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(rawLocation.debuggerModel)?.compilerMapping;
        if (!compilerMapping) {
            return [];
        }
        ranges = compilerMapping.getLocationRangesForSameSourceLocation(rawLocation);
        ranges = ranges.filter(range => contained(rawLocation, range));
        return ranges;
    }
    modelAdded(debuggerModel) {
        debuggerModel.setBeforePausedCallback(this.shouldPause.bind(this));
        __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").set(debuggerModel, new ModelData(debuggerModel, this));
        debuggerModel.setComputeAutoStepRangesCallback(this.computeAutoStepRanges.bind(this));
    }
    modelRemoved(debuggerModel) {
        debuggerModel.setComputeAutoStepRangesCallback(null);
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(debuggerModel);
        if (modelData) {
            modelData.dispose();
            __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").delete(debuggerModel);
        }
    }
    /**
     * The promise returned by this function is resolved once all *currently*
     * pending LiveLocations are processed.
     */
    async pendingLiveLocationChangesPromise() {
        await Promise.all(__classPrivateFieldGet(this, _DebuggerWorkspaceBinding_liveLocationPromises, "f"));
    }
    recordLiveLocationChange(promise) {
        void promise.then(() => {
            __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_liveLocationPromises, "f").delete(promise);
        });
        __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_liveLocationPromises, "f").add(promise);
    }
    async updateLocations(script) {
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(script.debuggerModel);
        if (modelData) {
            const updatePromise = modelData.updateLocations(script);
            this.recordLiveLocationChange(updatePromise);
            await updatePromise;
        }
    }
    async createLiveLocation(rawLocation, updateDelegate, locationPool) {
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(rawLocation.debuggerModel);
        if (!modelData) {
            return null;
        }
        const liveLocationPromise = modelData.createLiveLocation(rawLocation, updateDelegate, locationPool);
        this.recordLiveLocationChange(liveLocationPromise);
        return await liveLocationPromise;
    }
    async createStackTraceTopFrameLiveLocation(rawLocations, updateDelegate, locationPool) {
        console.assert(rawLocations.length > 0);
        const locationPromise = StackTraceTopFrameLocation.createStackTraceTopFrameLocation(rawLocations, this, updateDelegate, locationPool);
        this.recordLiveLocationChange(locationPromise);
        return await locationPromise;
    }
    async createCallFrameLiveLocation(location, updateDelegate, locationPool) {
        const script = location.script();
        if (!script) {
            return null;
        }
        const debuggerModel = location.debuggerModel;
        const liveLocationPromise = this.createLiveLocation(location, updateDelegate, locationPool);
        this.recordLiveLocationChange(liveLocationPromise);
        const liveLocation = await liveLocationPromise;
        if (!liveLocation) {
            return null;
        }
        this.registerCallFrameLiveLocation(debuggerModel, liveLocation);
        return liveLocation;
    }
    async rawLocationToUILocation(rawLocation) {
        const uiLocation = await this.pluginManager.rawLocationToUILocation(rawLocation);
        if (uiLocation) {
            return uiLocation;
        }
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(rawLocation.debuggerModel);
        return modelData ? modelData.rawLocationToUILocation(rawLocation) : null;
    }
    uiSourceCodeForSourceMapSourceURL(debuggerModel, url, isContentScript) {
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(debuggerModel);
        if (!modelData) {
            return null;
        }
        return modelData.compilerMapping.uiSourceCodeForURL(url, isContentScript);
    }
    async uiSourceCodeForSourceMapSourceURLPromise(debuggerModel, url, isContentScript) {
        const uiSourceCode = this.uiSourceCodeForSourceMapSourceURL(debuggerModel, url, isContentScript);
        return await (uiSourceCode || this.waitForUISourceCodeAdded(url, debuggerModel.target()));
    }
    async uiSourceCodeForDebuggerLanguagePluginSourceURLPromise(debuggerModel, url) {
        const uiSourceCode = this.pluginManager.uiSourceCodeForURL(debuggerModel, url);
        return await (uiSourceCode || this.waitForUISourceCodeAdded(url, debuggerModel.target()));
    }
    uiSourceCodeForScript(script) {
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(script.debuggerModel);
        if (!modelData) {
            return null;
        }
        return modelData.uiSourceCodeForScript(script);
    }
    waitForUISourceCodeAdded(url, target) {
        return new Promise(resolve => {
            const workspace = Workspace.Workspace.WorkspaceImpl.instance();
            const descriptor = workspace.addEventListener(Workspace.Workspace.Events.UISourceCodeAdded, event => {
                const uiSourceCode = event.data;
                if (uiSourceCode.url() === url && NetworkProject.targetForUISourceCode(uiSourceCode) === target) {
                    workspace.removeEventListener(Workspace.Workspace.Events.UISourceCodeAdded, descriptor.listener);
                    resolve(uiSourceCode);
                }
            });
        });
    }
    async uiLocationToRawLocations(uiSourceCode, lineNumber, columnNumber) {
        const locations = await this.pluginManager.uiLocationToRawLocations(uiSourceCode, lineNumber, columnNumber);
        if (locations) {
            return locations;
        }
        for (const modelData of __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").values()) {
            const locations = modelData.uiLocationToRawLocations(uiSourceCode, lineNumber, columnNumber);
            if (locations.length) {
                return locations;
            }
        }
        return [];
    }
    /**
     * Computes all the raw location ranges that intersect with the {@link textRange} in the given
     * {@link uiSourceCode}. The reverse mappings of the returned ranges must not be fully contained
     * with the {@link textRange} and it's the responsibility of the caller to appropriately filter or
     * clamp if desired.
     *
     * It's important to note that for a contiguous range in the {@link uiSourceCode} there can be a
     * variety of non-contiguous raw location ranges that intersect with the {@link textRange}. A
     * simple example is that of an HTML document with multiple inline `<script>`s in the same line,
     * so just asking for the raw locations in this single line will return a set of location ranges
     * in different scripts.
     *
     * This method returns an empty array if this {@link uiSourceCode} is not provided by any of the
     * mappings for this instance.
     *
     * @param uiSourceCode the {@link UISourceCode} to which the {@link textRange} belongs.
     * @param textRange the text range in terms of the UI.
     * @returns the list of raw location ranges that intersect with the text range or `[]` if
     *          the {@link uiSourceCode} does not belong to this instance.
     */
    async uiLocationRangeToRawLocationRanges(uiSourceCode, textRange) {
        const ranges = await this.pluginManager.uiLocationRangeToRawLocationRanges(uiSourceCode, textRange);
        if (ranges) {
            return ranges;
        }
        for (const modelData of __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").values()) {
            const ranges = modelData.uiLocationRangeToRawLocationRanges(uiSourceCode, textRange);
            if (ranges) {
                return ranges;
            }
        }
        return [];
    }
    async normalizeUILocation(uiLocation) {
        const rawLocations = await this.uiLocationToRawLocations(uiLocation.uiSourceCode, uiLocation.lineNumber, uiLocation.columnNumber);
        for (const location of rawLocations) {
            const uiLocationCandidate = await this.rawLocationToUILocation(location);
            if (uiLocationCandidate) {
                return uiLocationCandidate;
            }
        }
        return uiLocation;
    }
    /**
     * Computes the set of lines in the {@link uiSourceCode} that map to scripts by either looking at
     * the debug info (if any) or checking for inline scripts within documents. If this set cannot be
     * computed or all the lines in the {@link uiSourceCode} correspond to lines in a script, `null`
     * is returned here.
     *
     * @param uiSourceCode the source entity.
     * @returns a set of known mapped lines for {@link uiSourceCode} or `null` if it's impossible to
     *          determine the set or the {@link uiSourceCode} does not map to or include any scripts.
     */
    async getMappedLines(uiSourceCode) {
        for (const modelData of __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").values()) {
            const mappedLines = modelData.getMappedLines(uiSourceCode);
            if (mappedLines !== null) {
                return mappedLines;
            }
        }
        return await this.pluginManager.getMappedLines(uiSourceCode);
    }
    scriptFile(uiSourceCode, debuggerModel) {
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(debuggerModel);
        return modelData ? modelData.getResourceScriptMapping().scriptFile(uiSourceCode) : null;
    }
    scriptsForUISourceCode(uiSourceCode) {
        const scripts = new Set();
        this.pluginManager.scriptsForUISourceCode(uiSourceCode).forEach(script => scripts.add(script));
        for (const modelData of __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").values()) {
            const resourceScriptFile = modelData.getResourceScriptMapping().scriptFile(uiSourceCode);
            if (resourceScriptFile?.script) {
                scripts.add(resourceScriptFile.script);
            }
            modelData.compilerMapping.scriptsForUISourceCode(uiSourceCode).forEach(script => scripts.add(script));
        }
        return [...scripts];
    }
    supportsConditionalBreakpoints(uiSourceCode) {
        const scripts = this.pluginManager.scriptsForUISourceCode(uiSourceCode);
        return scripts.every(script => script.isJavaScript());
    }
    globalObjectCleared(event) {
        this.reset(event.data);
    }
    reset(debuggerModel) {
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(debuggerModel);
        if (!modelData) {
            return;
        }
        for (const location of modelData.callFrameLocations.values()) {
            this.removeLiveLocation(location);
        }
        modelData.callFrameLocations.clear();
    }
    resetForTest(target) {
        const debuggerModel = target.model(SDK.DebuggerModel.DebuggerModel);
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(debuggerModel);
        if (modelData) {
            modelData.getResourceScriptMapping().resetForTest();
        }
    }
    registerCallFrameLiveLocation(debuggerModel, location) {
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(debuggerModel);
        if (modelData) {
            const locations = modelData.callFrameLocations;
            locations.add(location);
        }
    }
    removeLiveLocation(location) {
        const modelData = __classPrivateFieldGet(this, _DebuggerWorkspaceBinding_debuggerModelToData, "f").get(location.rawLocation.debuggerModel);
        if (modelData) {
            modelData.disposeLocation(location);
        }
    }
    debuggerResumed(event) {
        this.reset(event.data);
    }
    async shouldPause(debuggerPausedDetails, autoSteppingContext) {
        // This function returns false if the debugger should continue stepping
        const { callFrames: [frame] } = debuggerPausedDetails;
        if (!frame) {
            return false;
        }
        const functionLocation = frame.functionLocation();
        if (!autoSteppingContext || debuggerPausedDetails.reason !== "step" /* Protocol.Debugger.PausedEventReason.Step */ ||
            !functionLocation || !frame.script.isWasm() || !Common.Settings.moduleSetting('wasm-auto-stepping').get() ||
            !this.pluginManager.hasPluginForScript(frame.script)) {
            return true;
        }
        const uiLocation = await this.pluginManager.rawLocationToUILocation(frame.location());
        if (uiLocation) {
            return true;
        }
        return autoSteppingContext.script() !== functionLocation.script() ||
            autoSteppingContext.columnNumber !== functionLocation.columnNumber ||
            autoSteppingContext.lineNumber !== functionLocation.lineNumber;
    }
}
_DebuggerWorkspaceBinding_debuggerModelToData = new WeakMap(), _DebuggerWorkspaceBinding_liveLocationPromises = new WeakMap();
class ModelData {
    constructor(debuggerModel, debuggerWorkspaceBinding) {
        _ModelData_debuggerModel.set(this, void 0);
        _ModelData_debuggerWorkspaceBinding.set(this, void 0);
        _ModelData_defaultMapping.set(this, void 0);
        _ModelData_resourceMapping.set(this, void 0);
        _ModelData_resourceScriptMapping.set(this, void 0);
        _ModelData_locations.set(this, void 0);
        __classPrivateFieldSet(this, _ModelData_debuggerModel, debuggerModel, "f");
        __classPrivateFieldSet(this, _ModelData_debuggerWorkspaceBinding, debuggerWorkspaceBinding, "f");
        this.callFrameLocations = new Set();
        const { workspace } = debuggerWorkspaceBinding.resourceMapping;
        __classPrivateFieldSet(this, _ModelData_defaultMapping, new DefaultScriptMapping(debuggerModel, workspace, debuggerWorkspaceBinding), "f");
        __classPrivateFieldSet(this, _ModelData_resourceMapping, debuggerWorkspaceBinding.resourceMapping, "f");
        __classPrivateFieldSet(this, _ModelData_resourceScriptMapping, new ResourceScriptMapping(debuggerModel, workspace, debuggerWorkspaceBinding), "f");
        this.compilerMapping = new CompilerScriptMapping(debuggerModel, workspace, debuggerWorkspaceBinding);
        __classPrivateFieldSet(this, _ModelData_locations, new Platform.MapUtilities.Multimap(), "f");
    }
    async createLiveLocation(rawLocation, updateDelegate, locationPool) {
        console.assert(rawLocation.scriptId !== '');
        const scriptId = rawLocation.scriptId;
        const location = new Location(scriptId, rawLocation, __classPrivateFieldGet(this, _ModelData_debuggerWorkspaceBinding, "f"), updateDelegate, locationPool);
        __classPrivateFieldGet(this, _ModelData_locations, "f").set(scriptId, location);
        await location.update();
        return location;
    }
    disposeLocation(location) {
        __classPrivateFieldGet(this, _ModelData_locations, "f").delete(location.scriptId, location);
    }
    async updateLocations(script) {
        const promises = [];
        for (const location of __classPrivateFieldGet(this, _ModelData_locations, "f").get(script.scriptId)) {
            promises.push(location.update());
        }
        await Promise.all(promises);
    }
    rawLocationToUILocation(rawLocation) {
        let uiLocation = this.compilerMapping.rawLocationToUILocation(rawLocation);
        uiLocation = uiLocation || __classPrivateFieldGet(this, _ModelData_resourceScriptMapping, "f").rawLocationToUILocation(rawLocation);
        uiLocation = uiLocation || __classPrivateFieldGet(this, _ModelData_resourceMapping, "f").jsLocationToUILocation(rawLocation);
        uiLocation = uiLocation || __classPrivateFieldGet(this, _ModelData_defaultMapping, "f").rawLocationToUILocation(rawLocation);
        return uiLocation;
    }
    uiSourceCodeForScript(script) {
        let uiSourceCode = null;
        uiSourceCode = uiSourceCode || __classPrivateFieldGet(this, _ModelData_resourceScriptMapping, "f").uiSourceCodeForScript(script);
        uiSourceCode = uiSourceCode || __classPrivateFieldGet(this, _ModelData_resourceMapping, "f").uiSourceCodeForScript(script);
        uiSourceCode = uiSourceCode || __classPrivateFieldGet(this, _ModelData_defaultMapping, "f").uiSourceCodeForScript(script);
        return uiSourceCode;
    }
    uiLocationToRawLocations(uiSourceCode, lineNumber, columnNumber = 0) {
        // TODO(crbug.com/1153123): Revisit the `#columnNumber = 0` and also preserve `undefined` for source maps?
        let locations = this.compilerMapping.uiLocationToRawLocations(uiSourceCode, lineNumber, columnNumber);
        locations = locations.length ?
            locations :
            __classPrivateFieldGet(this, _ModelData_resourceScriptMapping, "f").uiLocationToRawLocations(uiSourceCode, lineNumber, columnNumber);
        locations = locations.length ?
            locations :
            __classPrivateFieldGet(this, _ModelData_resourceMapping, "f").uiLocationToJSLocations(uiSourceCode, lineNumber, columnNumber);
        locations = locations.length ?
            locations :
            __classPrivateFieldGet(this, _ModelData_defaultMapping, "f").uiLocationToRawLocations(uiSourceCode, lineNumber, columnNumber);
        return locations;
    }
    uiLocationRangeToRawLocationRanges(uiSourceCode, textRange) {
        let ranges = this.compilerMapping.uiLocationRangeToRawLocationRanges(uiSourceCode, textRange);
        ranges ?? (ranges = __classPrivateFieldGet(this, _ModelData_resourceScriptMapping, "f").uiLocationRangeToRawLocationRanges(uiSourceCode, textRange));
        ranges ?? (ranges = __classPrivateFieldGet(this, _ModelData_resourceMapping, "f").uiLocationRangeToJSLocationRanges(uiSourceCode, textRange));
        ranges ?? (ranges = __classPrivateFieldGet(this, _ModelData_defaultMapping, "f").uiLocationRangeToRawLocationRanges(uiSourceCode, textRange));
        return ranges;
    }
    getMappedLines(uiSourceCode) {
        const mappedLines = this.compilerMapping.getMappedLines(uiSourceCode);
        // TODO(crbug.com/1411431): The scripts from the ResourceMapping appear over time,
        // and there's currently no way to inform the UI to update.
        // mappedLines = mappedLines ?? this.#resourceMapping.getMappedLines(uiSourceCode);
        return mappedLines;
    }
    dispose() {
        __classPrivateFieldGet(this, _ModelData_debuggerModel, "f").setBeforePausedCallback(null);
        this.compilerMapping.dispose();
        __classPrivateFieldGet(this, _ModelData_resourceScriptMapping, "f").dispose();
        __classPrivateFieldGet(this, _ModelData_defaultMapping, "f").dispose();
    }
    getResourceScriptMapping() {
        return __classPrivateFieldGet(this, _ModelData_resourceScriptMapping, "f");
    }
}
_ModelData_debuggerModel = new WeakMap(), _ModelData_debuggerWorkspaceBinding = new WeakMap(), _ModelData_defaultMapping = new WeakMap(), _ModelData_resourceMapping = new WeakMap(), _ModelData_resourceScriptMapping = new WeakMap(), _ModelData_locations = new WeakMap();
export class Location extends LiveLocationWithPool {
    constructor(scriptId, rawLocation, binding, updateDelegate, locationPool) {
        super(updateDelegate, locationPool);
        _Location_binding.set(this, void 0);
        this.scriptId = scriptId;
        this.rawLocation = rawLocation;
        __classPrivateFieldSet(this, _Location_binding, binding, "f");
    }
    async uiLocation() {
        const debuggerModelLocation = this.rawLocation;
        return await __classPrivateFieldGet(this, _Location_binding, "f").rawLocationToUILocation(debuggerModelLocation);
    }
    dispose() {
        super.dispose();
        __classPrivateFieldGet(this, _Location_binding, "f").removeLiveLocation(this);
    }
    async isIgnoreListed() {
        const uiLocation = await this.uiLocation();
        if (!uiLocation) {
            return false;
        }
        return IgnoreListManager.instance().isUserOrSourceMapIgnoreListedUISourceCode(uiLocation.uiSourceCode);
    }
}
_Location_binding = new WeakMap();
class StackTraceTopFrameLocation extends LiveLocationWithPool {
    constructor(updateDelegate, locationPool) {
        super(updateDelegate, locationPool);
        _StackTraceTopFrameLocation_updateScheduled.set(this, void 0);
        _StackTraceTopFrameLocation_current.set(this, void 0);
        _StackTraceTopFrameLocation_locations.set(this, void 0);
        __classPrivateFieldSet(this, _StackTraceTopFrameLocation_updateScheduled, true, "f");
        __classPrivateFieldSet(this, _StackTraceTopFrameLocation_current, null, "f");
        __classPrivateFieldSet(this, _StackTraceTopFrameLocation_locations, null, "f");
    }
    static async createStackTraceTopFrameLocation(rawLocations, binding, updateDelegate, locationPool) {
        const location = new StackTraceTopFrameLocation(updateDelegate, locationPool);
        const locationsPromises = rawLocations.map(rawLocation => binding.createLiveLocation(rawLocation, location.scheduleUpdate.bind(location), locationPool));
        __classPrivateFieldSet(location, _StackTraceTopFrameLocation_locations, ((await Promise.all(locationsPromises)).filter(l => !!l)), "f");
        await location.updateLocation();
        return location;
    }
    async uiLocation() {
        return __classPrivateFieldGet(this, _StackTraceTopFrameLocation_current, "f") ? await __classPrivateFieldGet(this, _StackTraceTopFrameLocation_current, "f").uiLocation() : null;
    }
    async isIgnoreListed() {
        return __classPrivateFieldGet(this, _StackTraceTopFrameLocation_current, "f") ? await __classPrivateFieldGet(this, _StackTraceTopFrameLocation_current, "f").isIgnoreListed() : false;
    }
    dispose() {
        super.dispose();
        if (__classPrivateFieldGet(this, _StackTraceTopFrameLocation_locations, "f")) {
            for (const location of __classPrivateFieldGet(this, _StackTraceTopFrameLocation_locations, "f")) {
                location.dispose();
            }
        }
        __classPrivateFieldSet(this, _StackTraceTopFrameLocation_locations, null, "f");
        __classPrivateFieldSet(this, _StackTraceTopFrameLocation_current, null, "f");
    }
    async scheduleUpdate() {
        if (__classPrivateFieldGet(this, _StackTraceTopFrameLocation_updateScheduled, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _StackTraceTopFrameLocation_updateScheduled, true, "f");
        queueMicrotask(() => {
            void this.updateLocation();
        });
    }
    async updateLocation() {
        __classPrivateFieldSet(this, _StackTraceTopFrameLocation_updateScheduled, false, "f");
        if (!__classPrivateFieldGet(this, _StackTraceTopFrameLocation_locations, "f") || __classPrivateFieldGet(this, _StackTraceTopFrameLocation_locations, "f").length === 0) {
            return;
        }
        __classPrivateFieldSet(this, _StackTraceTopFrameLocation_current, __classPrivateFieldGet(this, _StackTraceTopFrameLocation_locations, "f")[0], "f");
        for (const location of __classPrivateFieldGet(this, _StackTraceTopFrameLocation_locations, "f")) {
            if (!(await location.isIgnoreListed())) {
                __classPrivateFieldSet(this, _StackTraceTopFrameLocation_current, location, "f");
                break;
            }
        }
        void this.update();
    }
}
_StackTraceTopFrameLocation_updateScheduled = new WeakMap(), _StackTraceTopFrameLocation_current = new WeakMap(), _StackTraceTopFrameLocation_locations = new WeakMap();
//# sourceMappingURL=DebuggerWorkspaceBinding.js.map