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
var _DebuggerModel_instances, _DebuggerModel_sourceMapManagerInternal, _DebuggerModel_debuggerPausedDetailsInternal, _DebuggerModel_scriptsInternal, _DebuggerModel_scriptsBySourceURL, _DebuggerModel_discardableScripts, _DebuggerModel_selectedCallFrameInternal, _DebuggerModel_debuggerEnabledInternal, _DebuggerModel_debuggerId, _DebuggerModel_skipAllPausesTimeout, _DebuggerModel_beforePausedCallback, _DebuggerModel_computeAutoStepRangesCallback, _DebuggerModel_expandCallFramesCallback, _DebuggerModel_synchronizeBreakpointsCallback, _DebuggerModel_breakpointResolvedEventTarget, _DebuggerModel_autoSteppingContext, _DebuggerModel_isPausingInternal, _DebuggerModel_expandCallFrames, _DebuggerDispatcher_debuggerModel, _CallFrame_locationInternal, _CallFrame_scopeChainInternal, _CallFrame_localScopeInternal, _CallFrame_functionLocationInternal, _CallFrame_returnValueInternal, _Scope_callFrameInternal, _Scope_payload, _Scope_typeInternal, _Scope_nameInternal, _Scope_ordinal, _Scope_locationRange, _Scope_objectInternal;
import * as Common from '../common/common.js';
import * as Host from '../host/host.js';
import * as i18n from '../i18n/i18n.js';
import * as Platform from '../platform/platform.js';
import * as Root from '../root/root.js';
import { RemoteObjectProperty, ScopeRef } from './RemoteObject.js';
import { Events as ResourceTreeModelEvents, ResourceTreeModel } from './ResourceTreeModel.js';
import { RuntimeModel } from './RuntimeModel.js';
import { Script } from './Script.js';
import { SDKModel } from './SDKModel.js';
import { SourceMapManager } from './SourceMapManager.js';
import { Type } from './Target.js';
const UIStrings = {
    /**
     *@description Title of a section in the debugger showing local JavaScript variables.
     */
    local: 'Local',
    /**
     *@description Text that refers to closure as a programming term
     */
    closure: 'Closure',
    /**
     *@description Noun that represents a section or block of code in the Debugger Model. Shown in the Sources tab, while paused on a breakpoint.
     */
    block: 'Block',
    /**
     *@description Label for a group of JavaScript files
     */
    script: 'Script',
    /**
     *@description Title of a section in the debugger showing JavaScript variables from the a 'with'
     *block. Block here means section of code, 'with' refers to a JavaScript programming concept and
     *is a fixed term.
     */
    withBlock: '`With` block',
    /**
     *@description Title of a section in the debugger showing JavaScript variables from the a 'catch'
     *block. Block here means section of code, 'catch' refers to a JavaScript programming concept and
     *is a fixed term.
     */
    catchBlock: '`Catch` block',
    /**
     *@description Title of a section in the debugger showing JavaScript variables from the global scope.
     */
    global: 'Global',
    /**
     *@description Text for a JavaScript module, the programming concept
     */
    module: 'Module',
    /**
     *@description Text describing the expression scope in WebAssembly
     */
    expression: 'Expression',
    /**
     *@description Text in Scope Chain Sidebar Pane of the Sources panel
     */
    exception: 'Exception',
    /**
     *@description Text in Scope Chain Sidebar Pane of the Sources panel
     */
    returnValue: 'Return value',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/DebuggerModel.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export function sortAndMergeRanges(locationRanges) {
    function compare(p1, p2) {
        return (p1.lineNumber - p2.lineNumber) || (p1.columnNumber - p2.columnNumber);
    }
    function overlap(r1, r2) {
        if (r1.scriptId !== r2.scriptId) {
            return false;
        }
        const n = compare(r1.start, r2.start);
        if (n < 0) {
            return compare(r1.end, r2.start) >= 0;
        }
        if (n > 0) {
            return compare(r1.start, r2.end) <= 0;
        }
        return true;
    }
    if (locationRanges.length === 0) {
        return [];
    }
    locationRanges.sort((r1, r2) => {
        if (r1.scriptId < r2.scriptId) {
            return -1;
        }
        if (r1.scriptId > r2.scriptId) {
            return 1;
        }
        return compare(r1.start, r2.start) || compare(r1.end, r2.end);
    });
    let prev = locationRanges[0];
    const merged = [];
    for (let i = 1; i < locationRanges.length; ++i) {
        const curr = locationRanges[i];
        if (overlap(prev, curr)) {
            if (compare(prev.end, curr.end) <= 0) {
                prev = { ...prev, end: curr.end };
            }
        }
        else {
            merged.push(prev);
            prev = curr;
        }
    }
    merged.push(prev);
    return merged;
}
export var StepMode;
(function (StepMode) {
    StepMode["STEP_INTO"] = "StepInto";
    StepMode["STEP_OUT"] = "StepOut";
    StepMode["STEP_OVER"] = "StepOver";
})(StepMode || (StepMode = {}));
export const WASM_SYMBOLS_PRIORITY = [
    "ExternalDWARF" /* Protocol.Debugger.DebugSymbolsType.ExternalDWARF */,
    "EmbeddedDWARF" /* Protocol.Debugger.DebugSymbolsType.EmbeddedDWARF */,
    "SourceMap" /* Protocol.Debugger.DebugSymbolsType.SourceMap */,
];
export class DebuggerModel extends SDKModel {
    constructor(target) {
        super(target);
        _DebuggerModel_instances.add(this);
        _DebuggerModel_sourceMapManagerInternal.set(this, void 0);
        _DebuggerModel_debuggerPausedDetailsInternal.set(this, null);
        _DebuggerModel_scriptsInternal.set(this, new Map());
        _DebuggerModel_scriptsBySourceURL.set(this, new Map());
        _DebuggerModel_discardableScripts.set(this, []);
        this.continueToLocationCallback = null;
        _DebuggerModel_selectedCallFrameInternal.set(this, null);
        _DebuggerModel_debuggerEnabledInternal.set(this, false);
        _DebuggerModel_debuggerId.set(this, null);
        _DebuggerModel_skipAllPausesTimeout.set(this, 0);
        _DebuggerModel_beforePausedCallback.set(this, null);
        _DebuggerModel_computeAutoStepRangesCallback.set(this, null);
        _DebuggerModel_expandCallFramesCallback.set(this, null);
        this.evaluateOnCallFrameCallback = null;
        _DebuggerModel_synchronizeBreakpointsCallback.set(this, null);
        // We need to be able to register listeners for individual breakpoints. As such, we dispatch
        // on breakpoint ids, which are not statically known. The event #payload will always be a `Location`.
        _DebuggerModel_breakpointResolvedEventTarget.set(this, new Common.ObjectWrapper.ObjectWrapper());
        // When stepping over with autostepping enabled, the context denotes the function to which autostepping is restricted
        // to by way of its functionLocation (as per Debugger.CallFrame).
        _DebuggerModel_autoSteppingContext.set(this, null);
        _DebuggerModel_isPausingInternal.set(this, false);
        target.registerDebuggerDispatcher(new DebuggerDispatcher(this));
        this.agent = target.debuggerAgent();
        this.runtimeModelInternal = target.model(RuntimeModel);
        __classPrivateFieldSet(this, _DebuggerModel_sourceMapManagerInternal, new SourceMapManager(target), "f");
        Common.Settings.Settings.instance()
            .moduleSetting('pause-on-exception-enabled')
            .addChangeListener(this.pauseOnExceptionStateChanged, this);
        Common.Settings.Settings.instance()
            .moduleSetting('pause-on-caught-exception')
            .addChangeListener(this.pauseOnExceptionStateChanged, this);
        Common.Settings.Settings.instance()
            .moduleSetting('pause-on-uncaught-exception')
            .addChangeListener(this.pauseOnExceptionStateChanged, this);
        Common.Settings.Settings.instance()
            .moduleSetting('disable-async-stack-traces')
            .addChangeListener(this.asyncStackTracesStateChanged, this);
        Common.Settings.Settings.instance()
            .moduleSetting('breakpoints-active')
            .addChangeListener(this.breakpointsActiveChanged, this);
        if (!target.suspended()) {
            void this.enableDebugger();
        }
        __classPrivateFieldGet(this, _DebuggerModel_sourceMapManagerInternal, "f").setEnabled(Common.Settings.Settings.instance().moduleSetting('js-source-maps-enabled').get());
        Common.Settings.Settings.instance()
            .moduleSetting('js-source-maps-enabled')
            .addChangeListener(event => __classPrivateFieldGet(this, _DebuggerModel_sourceMapManagerInternal, "f").setEnabled(event.data));
        const resourceTreeModel = target.model(ResourceTreeModel);
        if (resourceTreeModel) {
            resourceTreeModel.addEventListener(ResourceTreeModelEvents.FrameNavigated, this.onFrameNavigated, this);
        }
    }
    static selectSymbolSource(debugSymbols) {
        if (!debugSymbols || debugSymbols.length === 0) {
            return null;
        }
        // Provides backwards compatibility to previous CDP version on Protocol.Debugger.DebugSymbols.
        // TODO(crbug.com/369515221): Remove extra code as soon as old v8 versions used in Node are no longer supported.
        if ('type' in debugSymbols) {
            if (debugSymbols.type === 'None') {
                return null;
            }
            return debugSymbols;
        }
        let debugSymbolsSource = null;
        const symbolTypes = new Map(debugSymbols.map(symbol => [symbol.type, symbol]));
        for (const symbol of WASM_SYMBOLS_PRIORITY) {
            if (symbolTypes.has(symbol)) {
                debugSymbolsSource = symbolTypes.get(symbol) || null;
                break;
            }
        }
        console.assert(debugSymbolsSource !== null, 'Unknown symbol types. Front-end and back-end should be kept in sync regarding Protocol.Debugger.DebugSymbolTypes');
        if (debugSymbolsSource && debugSymbols.length > 1) {
            Common.Console.Console.instance().warn(`Multiple debug symbols for script were found. Using ${debugSymbolsSource.type}`);
        }
        return debugSymbolsSource;
    }
    sourceMapManager() {
        return __classPrivateFieldGet(this, _DebuggerModel_sourceMapManagerInternal, "f");
    }
    runtimeModel() {
        return this.runtimeModelInternal;
    }
    debuggerEnabled() {
        return Boolean(__classPrivateFieldGet(this, _DebuggerModel_debuggerEnabledInternal, "f"));
    }
    debuggerId() {
        return __classPrivateFieldGet(this, _DebuggerModel_debuggerId, "f");
    }
    async enableDebugger() {
        if (__classPrivateFieldGet(this, _DebuggerModel_debuggerEnabledInternal, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _DebuggerModel_debuggerEnabledInternal, true, "f");
        // Set a limit for the total size of collected script sources retained by debugger.
        // 10MB for remote frontends, 100MB for others.
        const isRemoteFrontend = Root.Runtime.Runtime.queryParam('remoteFrontend') || Root.Runtime.Runtime.queryParam('ws');
        const maxScriptsCacheSize = isRemoteFrontend ? 10e6 : 100e6;
        const enablePromise = this.agent.invoke_enable({ maxScriptsCacheSize });
        let instrumentationPromise;
        if (Root.Runtime.experiments.isEnabled("instrumentation-breakpoints" /* Root.Runtime.ExperimentName.INSTRUMENTATION_BREAKPOINTS */)) {
            instrumentationPromise = this.agent.invoke_setInstrumentationBreakpoint({
                instrumentation: "beforeScriptExecution" /* Protocol.Debugger.SetInstrumentationBreakpointRequestInstrumentation.BeforeScriptExecution */,
            });
        }
        this.pauseOnExceptionStateChanged();
        void this.asyncStackTracesStateChanged();
        if (!Common.Settings.Settings.instance().moduleSetting('breakpoints-active').get()) {
            this.breakpointsActiveChanged();
        }
        this.dispatchEventToListeners(Events.DebuggerWasEnabled, this);
        const [enableResult] = await Promise.all([enablePromise, instrumentationPromise]);
        this.registerDebugger(enableResult);
    }
    async syncDebuggerId() {
        const isRemoteFrontend = Root.Runtime.Runtime.queryParam('remoteFrontend') || Root.Runtime.Runtime.queryParam('ws');
        const maxScriptsCacheSize = isRemoteFrontend ? 10e6 : 100e6;
        const enablePromise = this.agent.invoke_enable({ maxScriptsCacheSize });
        void enablePromise.then(this.registerDebugger.bind(this));
        return await enablePromise;
    }
    onFrameNavigated() {
        if (DebuggerModel.shouldResyncDebuggerId) {
            return;
        }
        DebuggerModel.shouldResyncDebuggerId = true;
    }
    registerDebugger(response) {
        if (response.getError()) {
            __classPrivateFieldSet(this, _DebuggerModel_debuggerEnabledInternal, false, "f");
            return;
        }
        const { debuggerId } = response;
        debuggerIdToModel.set(debuggerId, this);
        __classPrivateFieldSet(this, _DebuggerModel_debuggerId, debuggerId, "f");
        this.dispatchEventToListeners(Events.DebuggerIsReadyToPause, this);
    }
    isReadyToPause() {
        return Boolean(__classPrivateFieldGet(this, _DebuggerModel_debuggerId, "f"));
    }
    static async modelForDebuggerId(debuggerId) {
        if (DebuggerModel.shouldResyncDebuggerId) {
            await DebuggerModel.resyncDebuggerIdForModels();
            DebuggerModel.shouldResyncDebuggerId = false;
        }
        return debuggerIdToModel.get(debuggerId) || null;
    }
    static async resyncDebuggerIdForModels() {
        const dbgModels = debuggerIdToModel.values();
        for (const dbgModel of dbgModels) {
            if (dbgModel.debuggerEnabled()) {
                await dbgModel.syncDebuggerId();
            }
        }
    }
    async disableDebugger() {
        if (!__classPrivateFieldGet(this, _DebuggerModel_debuggerEnabledInternal, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _DebuggerModel_debuggerEnabledInternal, false, "f");
        await this.asyncStackTracesStateChanged();
        await this.agent.invoke_disable();
        __classPrivateFieldSet(this, _DebuggerModel_isPausingInternal, false, "f");
        this.globalObjectCleared();
        this.dispatchEventToListeners(Events.DebuggerWasDisabled, this);
        if (typeof __classPrivateFieldGet(this, _DebuggerModel_debuggerId, "f") === 'string') {
            debuggerIdToModel.delete(__classPrivateFieldGet(this, _DebuggerModel_debuggerId, "f"));
        }
        __classPrivateFieldSet(this, _DebuggerModel_debuggerId, null, "f");
    }
    skipAllPauses(skip) {
        if (__classPrivateFieldGet(this, _DebuggerModel_skipAllPausesTimeout, "f")) {
            clearTimeout(__classPrivateFieldGet(this, _DebuggerModel_skipAllPausesTimeout, "f"));
            __classPrivateFieldSet(this, _DebuggerModel_skipAllPausesTimeout, 0, "f");
        }
        void this.agent.invoke_setSkipAllPauses({ skip });
    }
    skipAllPausesUntilReloadOrTimeout(timeout) {
        if (__classPrivateFieldGet(this, _DebuggerModel_skipAllPausesTimeout, "f")) {
            clearTimeout(__classPrivateFieldGet(this, _DebuggerModel_skipAllPausesTimeout, "f"));
        }
        void this.agent.invoke_setSkipAllPauses({ skip: true });
        // If reload happens before the timeout, the flag will be already unset and the timeout callback won't change anything.
        __classPrivateFieldSet(this, _DebuggerModel_skipAllPausesTimeout, window.setTimeout(this.skipAllPauses.bind(this, false), timeout), "f");
    }
    pauseOnExceptionStateChanged() {
        const pauseOnCaughtEnabled = Common.Settings.Settings.instance().moduleSetting('pause-on-caught-exception').get();
        let state;
        const pauseOnUncaughtEnabled = Common.Settings.Settings.instance().moduleSetting('pause-on-uncaught-exception').get();
        if (pauseOnCaughtEnabled && pauseOnUncaughtEnabled) {
            state = "all" /* Protocol.Debugger.SetPauseOnExceptionsRequestState.All */;
        }
        else if (pauseOnCaughtEnabled) {
            state = "caught" /* Protocol.Debugger.SetPauseOnExceptionsRequestState.Caught */;
        }
        else if (pauseOnUncaughtEnabled) {
            state = "uncaught" /* Protocol.Debugger.SetPauseOnExceptionsRequestState.Uncaught */;
        }
        else {
            state = "none" /* Protocol.Debugger.SetPauseOnExceptionsRequestState.None */;
        }
        void this.agent.invoke_setPauseOnExceptions({ state });
    }
    asyncStackTracesStateChanged() {
        const maxAsyncStackChainDepth = 32;
        const enabled = !Common.Settings.Settings.instance().moduleSetting('disable-async-stack-traces').get() &&
            __classPrivateFieldGet(this, _DebuggerModel_debuggerEnabledInternal, "f");
        const maxDepth = enabled ? maxAsyncStackChainDepth : 0;
        return this.agent.invoke_setAsyncCallStackDepth({ maxDepth });
    }
    breakpointsActiveChanged() {
        void this.agent.invoke_setBreakpointsActive({ active: Common.Settings.Settings.instance().moduleSetting('breakpoints-active').get() });
    }
    setComputeAutoStepRangesCallback(callback) {
        __classPrivateFieldSet(this, _DebuggerModel_computeAutoStepRangesCallback, callback, "f");
    }
    async computeAutoStepSkipList(mode) {
        let ranges = [];
        if (__classPrivateFieldGet(this, _DebuggerModel_computeAutoStepRangesCallback, "f") && __classPrivateFieldGet(this, _DebuggerModel_debuggerPausedDetailsInternal, "f") &&
            __classPrivateFieldGet(this, _DebuggerModel_debuggerPausedDetailsInternal, "f").callFrames.length > 0) {
            const [callFrame] = __classPrivateFieldGet(this, _DebuggerModel_debuggerPausedDetailsInternal, "f").callFrames;
            ranges = await __classPrivateFieldGet(this, _DebuggerModel_computeAutoStepRangesCallback, "f").call(null, mode, callFrame);
        }
        const skipList = ranges.map(({ start, end }) => ({
            scriptId: start.scriptId,
            start: { lineNumber: start.lineNumber, columnNumber: start.columnNumber },
            end: { lineNumber: end.lineNumber, columnNumber: end.columnNumber },
        }));
        return sortAndMergeRanges(skipList);
    }
    async stepInto() {
        const skipList = await this.computeAutoStepSkipList("StepInto" /* StepMode.STEP_INTO */);
        void this.agent.invoke_stepInto({ breakOnAsyncCall: false, skipList });
    }
    async stepOver() {
        __classPrivateFieldSet(this, _DebuggerModel_autoSteppingContext, __classPrivateFieldGet(this, _DebuggerModel_debuggerPausedDetailsInternal, "f")?.callFrames[0]?.functionLocation() ?? null, "f");
        const skipList = await this.computeAutoStepSkipList("StepOver" /* StepMode.STEP_OVER */);
        void this.agent.invoke_stepOver({ skipList });
    }
    async stepOut() {
        const skipList = await this.computeAutoStepSkipList("StepOut" /* StepMode.STEP_OUT */);
        if (skipList.length !== 0) {
            void this.agent.invoke_stepOver({ skipList });
        }
        else {
            void this.agent.invoke_stepOut();
        }
    }
    scheduleStepIntoAsync() {
        void this.computeAutoStepSkipList("StepInto" /* StepMode.STEP_INTO */).then(skipList => {
            void this.agent.invoke_stepInto({ breakOnAsyncCall: true, skipList });
        });
    }
    resume() {
        void this.agent.invoke_resume({ terminateOnResume: false });
        __classPrivateFieldSet(this, _DebuggerModel_isPausingInternal, false, "f");
    }
    pause() {
        __classPrivateFieldSet(this, _DebuggerModel_isPausingInternal, true, "f");
        this.skipAllPauses(false);
        void this.agent.invoke_pause();
    }
    async setBreakpointByURL(url, lineNumber, columnNumber, condition) {
        // Convert file url to node-js path.
        let urlRegex;
        if (this.target().type() === Type.NODE && Common.ParsedURL.schemeIs(url, 'file:')) {
            const platformPath = Common.ParsedURL.ParsedURL.urlToRawPathString(url, Host.Platform.isWin());
            urlRegex =
                `${Platform.StringUtilities.escapeForRegExp(platformPath)}|${Platform.StringUtilities.escapeForRegExp(url)}`;
            if (Host.Platform.isWin() && platformPath.match(/^.:\\/)) {
                // Match upper or lower case drive letter
                urlRegex = `[${platformPath[0].toUpperCase()}${platformPath[0].toLowerCase()}]` + urlRegex.substr(1);
            }
        }
        // Adjust column if needed.
        let minColumnNumber = 0;
        const scripts = __classPrivateFieldGet(this, _DebuggerModel_scriptsBySourceURL, "f").get(url) || [];
        for (let i = 0, l = scripts.length; i < l; ++i) {
            const script = scripts[i];
            if (lineNumber === script.lineOffset) {
                minColumnNumber = minColumnNumber ? Math.min(minColumnNumber, script.columnOffset) : script.columnOffset;
            }
        }
        columnNumber = Math.max(columnNumber || 0, minColumnNumber);
        const response = await this.agent.invoke_setBreakpointByUrl({
            lineNumber,
            url: urlRegex ? undefined : url,
            urlRegex,
            columnNumber,
            condition,
        });
        if (response.getError()) {
            return { locations: [], breakpointId: null };
        }
        let locations = [];
        if (response.locations) {
            locations = response.locations.map(payload => Location.fromPayload(this, payload));
        }
        return { locations, breakpointId: response.breakpointId };
    }
    async setBreakpointInAnonymousScript(scriptHash, lineNumber, columnNumber, condition) {
        const response = await this.agent.invoke_setBreakpointByUrl({ lineNumber, scriptHash, columnNumber, condition });
        if (response.getError()) {
            return { locations: [], breakpointId: null };
        }
        let locations = [];
        if (response.locations) {
            locations = response.locations.map(payload => Location.fromPayload(this, payload));
        }
        return { locations, breakpointId: response.breakpointId };
    }
    async removeBreakpoint(breakpointId) {
        await this.agent.invoke_removeBreakpoint({ breakpointId });
    }
    async getPossibleBreakpoints(startLocation, endLocation, restrictToFunction) {
        const response = await this.agent.invoke_getPossibleBreakpoints({
            start: startLocation.payload(),
            end: endLocation ? endLocation.payload() : undefined,
            restrictToFunction,
        });
        if (response.getError() || !response.locations) {
            return [];
        }
        return response.locations.map(location => BreakLocation.fromPayload(this, location));
    }
    async fetchAsyncStackTrace(stackId) {
        const response = await this.agent.invoke_getStackTrace({ stackTraceId: stackId });
        return response.getError() ? null : response.stackTrace;
    }
    breakpointResolved(breakpointId, location) {
        __classPrivateFieldGet(this, _DebuggerModel_breakpointResolvedEventTarget, "f").dispatchEventToListeners(breakpointId, Location.fromPayload(this, location));
    }
    globalObjectCleared() {
        this.resetDebuggerPausedDetails();
        this.reset();
        // TODO(dgozman): move clients to ExecutionContextDestroyed/ScriptCollected events.
        this.dispatchEventToListeners(Events.GlobalObjectCleared, this);
    }
    reset() {
        for (const script of __classPrivateFieldGet(this, _DebuggerModel_scriptsInternal, "f").values()) {
            __classPrivateFieldGet(this, _DebuggerModel_sourceMapManagerInternal, "f").detachSourceMap(script);
        }
        __classPrivateFieldGet(this, _DebuggerModel_scriptsInternal, "f").clear();
        __classPrivateFieldGet(this, _DebuggerModel_scriptsBySourceURL, "f").clear();
        __classPrivateFieldSet(this, _DebuggerModel_discardableScripts, [], "f");
        __classPrivateFieldSet(this, _DebuggerModel_autoSteppingContext, null, "f");
    }
    scripts() {
        return Array.from(__classPrivateFieldGet(this, _DebuggerModel_scriptsInternal, "f").values());
    }
    scriptForId(scriptId) {
        return __classPrivateFieldGet(this, _DebuggerModel_scriptsInternal, "f").get(scriptId) || null;
    }
    /**
     * Returns all `Script` objects with the same provided `sourceURL`. The
     * resulting array is sorted by time with the newest `Script` in the front.
     */
    scriptsForSourceURL(sourceURL) {
        return __classPrivateFieldGet(this, _DebuggerModel_scriptsBySourceURL, "f").get(sourceURL) || [];
    }
    scriptsForExecutionContext(executionContext) {
        const result = [];
        for (const script of __classPrivateFieldGet(this, _DebuggerModel_scriptsInternal, "f").values()) {
            if (script.executionContextId === executionContext.id) {
                result.push(script);
            }
        }
        return result;
    }
    get callFrames() {
        return __classPrivateFieldGet(this, _DebuggerModel_debuggerPausedDetailsInternal, "f") ? __classPrivateFieldGet(this, _DebuggerModel_debuggerPausedDetailsInternal, "f").callFrames : null;
    }
    debuggerPausedDetails() {
        return __classPrivateFieldGet(this, _DebuggerModel_debuggerPausedDetailsInternal, "f");
    }
    async setDebuggerPausedDetails(debuggerPausedDetails) {
        __classPrivateFieldSet(this, _DebuggerModel_isPausingInternal, false, "f");
        __classPrivateFieldSet(this, _DebuggerModel_debuggerPausedDetailsInternal, debuggerPausedDetails, "f");
        if (__classPrivateFieldGet(this, _DebuggerModel_beforePausedCallback, "f")) {
            if (!await __classPrivateFieldGet(this, _DebuggerModel_beforePausedCallback, "f").call(null, debuggerPausedDetails, __classPrivateFieldGet(this, _DebuggerModel_autoSteppingContext, "f"))) {
                return false;
            }
        }
        // If we resolved a location in auto-stepping callback, reset the
        // auto-step-over context.
        __classPrivateFieldSet(this, _DebuggerModel_autoSteppingContext, null, "f");
        this.dispatchEventToListeners(Events.DebuggerPaused, this);
        this.setSelectedCallFrame(debuggerPausedDetails.callFrames[0]);
        return true;
    }
    resetDebuggerPausedDetails() {
        __classPrivateFieldSet(this, _DebuggerModel_isPausingInternal, false, "f");
        __classPrivateFieldSet(this, _DebuggerModel_debuggerPausedDetailsInternal, null, "f");
        this.setSelectedCallFrame(null);
    }
    setBeforePausedCallback(callback) {
        __classPrivateFieldSet(this, _DebuggerModel_beforePausedCallback, callback, "f");
    }
    setExpandCallFramesCallback(callback) {
        __classPrivateFieldSet(this, _DebuggerModel_expandCallFramesCallback, callback, "f");
    }
    setEvaluateOnCallFrameCallback(callback) {
        this.evaluateOnCallFrameCallback = callback;
    }
    setSynchronizeBreakpointsCallback(callback) {
        __classPrivateFieldSet(this, _DebuggerModel_synchronizeBreakpointsCallback, callback, "f");
    }
    async pausedScript(callFrames, reason, auxData, breakpointIds, asyncStackTrace, asyncStackTraceId) {
        if (reason === "instrumentation" /* Protocol.Debugger.PausedEventReason.Instrumentation */) {
            const script = this.scriptForId(auxData.scriptId);
            if (__classPrivateFieldGet(this, _DebuggerModel_synchronizeBreakpointsCallback, "f") && script) {
                await __classPrivateFieldGet(this, _DebuggerModel_synchronizeBreakpointsCallback, "f").call(this, script);
            }
            this.resume();
            return;
        }
        const pausedDetails = new DebuggerPausedDetails(this, callFrames, reason, auxData, breakpointIds, asyncStackTrace, asyncStackTraceId);
        await __classPrivateFieldGet(this, _DebuggerModel_instances, "m", _DebuggerModel_expandCallFrames).call(this, pausedDetails);
        if (this.continueToLocationCallback) {
            const callback = this.continueToLocationCallback;
            this.continueToLocationCallback = null;
            if (callback(pausedDetails)) {
                return;
            }
        }
        if (!await this.setDebuggerPausedDetails(pausedDetails)) {
            if (__classPrivateFieldGet(this, _DebuggerModel_autoSteppingContext, "f")) {
                void this.stepOver();
            }
            else {
                void this.stepInto();
            }
        }
        else {
            Common.EventTarget.fireEvent('DevTools.DebuggerPaused');
        }
    }
    resumedScript() {
        this.resetDebuggerPausedDetails();
        this.dispatchEventToListeners(Events.DebuggerResumed, this);
    }
    parsedScriptSource(scriptId, sourceURL, startLine, startColumn, endLine, endColumn, 
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executionContextId, hash, executionContextAuxData, isLiveEdit, sourceMapURL, hasSourceURLComment, hasSyntaxError, length, isModule, originStackTrace, codeOffset, scriptLanguage, debugSymbols, embedderName, buildId) {
        const knownScript = __classPrivateFieldGet(this, _DebuggerModel_scriptsInternal, "f").get(scriptId);
        if (knownScript) {
            return knownScript;
        }
        let isContentScript = false;
        if (executionContextAuxData && ('isDefault' in executionContextAuxData)) {
            isContentScript = !executionContextAuxData['isDefault'];
        }
        const selectedDebugSymbol = DebuggerModel.selectSymbolSource(debugSymbols);
        const script = new Script(this, scriptId, sourceURL, startLine, startColumn, endLine, endColumn, executionContextId, hash, isContentScript, isLiveEdit, sourceMapURL, hasSourceURLComment, length, isModule, originStackTrace, codeOffset, scriptLanguage, selectedDebugSymbol, embedderName, buildId);
        this.registerScript(script);
        this.dispatchEventToListeners(Events.ParsedScriptSource, script);
        if (script.sourceMapURL && !hasSyntaxError) {
            __classPrivateFieldGet(this, _DebuggerModel_sourceMapManagerInternal, "f").attachSourceMap(script, script.sourceURL, script.sourceMapURL);
        }
        const isDiscardable = hasSyntaxError && script.isAnonymousScript();
        if (isDiscardable) {
            __classPrivateFieldGet(this, _DebuggerModel_discardableScripts, "f").push(script);
            this.collectDiscardedScripts();
        }
        return script;
    }
    setSourceMapURL(script, newSourceMapURL) {
        // Detach any previous source map from the `script` first.
        __classPrivateFieldGet(this, _DebuggerModel_sourceMapManagerInternal, "f").detachSourceMap(script);
        script.sourceMapURL = newSourceMapURL;
        __classPrivateFieldGet(this, _DebuggerModel_sourceMapManagerInternal, "f").attachSourceMap(script, script.sourceURL, script.sourceMapURL);
    }
    async setDebugInfoURL(script, _externalURL) {
        if (__classPrivateFieldGet(this, _DebuggerModel_expandCallFramesCallback, "f") && __classPrivateFieldGet(this, _DebuggerModel_debuggerPausedDetailsInternal, "f")) {
            __classPrivateFieldGet(this, _DebuggerModel_debuggerPausedDetailsInternal, "f").callFrames =
                await __classPrivateFieldGet(this, _DebuggerModel_expandCallFramesCallback, "f").call(null, __classPrivateFieldGet(this, _DebuggerModel_debuggerPausedDetailsInternal, "f").callFrames);
        }
        this.dispatchEventToListeners(Events.DebugInfoAttached, script);
    }
    executionContextDestroyed(executionContext) {
        for (const script of __classPrivateFieldGet(this, _DebuggerModel_scriptsInternal, "f").values()) {
            if (script.executionContextId === executionContext.id) {
                __classPrivateFieldGet(this, _DebuggerModel_sourceMapManagerInternal, "f").detachSourceMap(script);
            }
        }
    }
    registerScript(script) {
        __classPrivateFieldGet(this, _DebuggerModel_scriptsInternal, "f").set(script.scriptId, script);
        if (script.isAnonymousScript()) {
            return;
        }
        let scripts = __classPrivateFieldGet(this, _DebuggerModel_scriptsBySourceURL, "f").get(script.sourceURL);
        if (!scripts) {
            scripts = [];
            __classPrivateFieldGet(this, _DebuggerModel_scriptsBySourceURL, "f").set(script.sourceURL, scripts);
        }
        // Newer scripts with the same URL should be preferred so we put them in
        // the front. Consuming code usually will iterate over the array and pick
        // the first script that works.
        scripts.unshift(script);
    }
    unregisterScript(script) {
        console.assert(script.isAnonymousScript());
        __classPrivateFieldGet(this, _DebuggerModel_scriptsInternal, "f").delete(script.scriptId);
    }
    collectDiscardedScripts() {
        if (__classPrivateFieldGet(this, _DebuggerModel_discardableScripts, "f").length < 1000) {
            return;
        }
        const scriptsToDiscard = __classPrivateFieldGet(this, _DebuggerModel_discardableScripts, "f").splice(0, 100);
        for (const script of scriptsToDiscard) {
            this.unregisterScript(script);
            this.dispatchEventToListeners(Events.DiscardedAnonymousScriptSource, script);
        }
    }
    createRawLocation(script, lineNumber, columnNumber, inlineFrameIndex) {
        return this.createRawLocationByScriptId(script.scriptId, lineNumber, columnNumber, inlineFrameIndex);
    }
    createRawLocationByURL(sourceURL, lineNumber, columnNumber, inlineFrameIndex) {
        for (const script of __classPrivateFieldGet(this, _DebuggerModel_scriptsBySourceURL, "f").get(sourceURL) || []) {
            if (script.lineOffset > lineNumber ||
                (script.lineOffset === lineNumber && columnNumber !== undefined && script.columnOffset > columnNumber)) {
                continue;
            }
            if (script.endLine < lineNumber ||
                (script.endLine === lineNumber && columnNumber !== undefined && script.endColumn <= columnNumber)) {
                continue;
            }
            return new Location(this, script.scriptId, lineNumber, columnNumber, inlineFrameIndex);
        }
        return null;
    }
    createRawLocationByScriptId(scriptId, lineNumber, columnNumber, inlineFrameIndex) {
        return new Location(this, scriptId, lineNumber, columnNumber, inlineFrameIndex);
    }
    createRawLocationsByStackTrace(stackTrace) {
        const rawLocations = [];
        for (let current = stackTrace; current; current = current.parent) {
            for (const { scriptId, lineNumber, columnNumber } of current.callFrames) {
                rawLocations.push(this.createRawLocationByScriptId(scriptId, lineNumber, columnNumber));
            }
        }
        return rawLocations;
    }
    isPaused() {
        return Boolean(this.debuggerPausedDetails());
    }
    isPausing() {
        return __classPrivateFieldGet(this, _DebuggerModel_isPausingInternal, "f");
    }
    setSelectedCallFrame(callFrame) {
        if (__classPrivateFieldGet(this, _DebuggerModel_selectedCallFrameInternal, "f") === callFrame) {
            return;
        }
        __classPrivateFieldSet(this, _DebuggerModel_selectedCallFrameInternal, callFrame, "f");
        this.dispatchEventToListeners(Events.CallFrameSelected, this);
    }
    selectedCallFrame() {
        return __classPrivateFieldGet(this, _DebuggerModel_selectedCallFrameInternal, "f");
    }
    async evaluateOnSelectedCallFrame(options) {
        const callFrame = this.selectedCallFrame();
        if (!callFrame) {
            throw new Error('No call frame selected');
        }
        return await callFrame.evaluate(options);
    }
    functionDetailsPromise(remoteObject) {
        return remoteObject.getAllProperties(false /* accessorPropertiesOnly */, false /* generatePreview */)
            .then(buildDetails.bind(this));
        function buildDetails(response) {
            if (!response) {
                return null;
            }
            let location = null;
            if (response.internalProperties) {
                for (const prop of response.internalProperties) {
                    if (prop.name === '[[FunctionLocation]]') {
                        location = prop.value;
                    }
                }
            }
            let functionName = null;
            if (response.properties) {
                for (const prop of response.properties) {
                    if (prop.name === 'name' && prop.value && prop.value.type === 'string') {
                        functionName = prop.value;
                    }
                }
            }
            let debuggerLocation = null;
            if (location) {
                debuggerLocation = this.createRawLocationByScriptId(location.value.scriptId, location.value.lineNumber, location.value.columnNumber);
            }
            return { location: debuggerLocation, functionName: functionName ? functionName.value : '' };
        }
    }
    async setVariableValue(scopeNumber, variableName, newValue, callFrameId) {
        const response = await this.agent.invoke_setVariableValue({ scopeNumber, variableName, newValue, callFrameId });
        const error = response.getError();
        return error;
    }
    addBreakpointListener(breakpointId, listener, thisObject) {
        __classPrivateFieldGet(this, _DebuggerModel_breakpointResolvedEventTarget, "f").addEventListener(breakpointId, listener, thisObject);
    }
    removeBreakpointListener(breakpointId, listener, thisObject) {
        __classPrivateFieldGet(this, _DebuggerModel_breakpointResolvedEventTarget, "f").removeEventListener(breakpointId, listener, thisObject);
    }
    async setBlackboxPatterns(patterns, skipAnonymous) {
        const response = await this.agent.invoke_setBlackboxPatterns({ patterns, skipAnonymous });
        const error = response.getError();
        return !error;
    }
    async setBlackboxExecutionContexts(uniqueIds) {
        const response = await this.agent.invoke_setBlackboxExecutionContexts({ uniqueIds });
        const error = response.getError();
        return !error;
    }
    dispose() {
        if (__classPrivateFieldGet(this, _DebuggerModel_debuggerId, "f")) {
            debuggerIdToModel.delete(__classPrivateFieldGet(this, _DebuggerModel_debuggerId, "f"));
        }
        Common.Settings.Settings.instance()
            .moduleSetting('pause-on-exception-enabled')
            .removeChangeListener(this.pauseOnExceptionStateChanged, this);
        Common.Settings.Settings.instance()
            .moduleSetting('pause-on-caught-exception')
            .removeChangeListener(this.pauseOnExceptionStateChanged, this);
        Common.Settings.Settings.instance()
            .moduleSetting('disable-async-stack-traces')
            .removeChangeListener(this.asyncStackTracesStateChanged, this);
    }
    async suspendModel() {
        await this.disableDebugger();
    }
    async resumeModel() {
        await this.enableDebugger();
    }
    getEvaluateOnCallFrameCallback() {
        return this.evaluateOnCallFrameCallback;
    }
}
_DebuggerModel_sourceMapManagerInternal = new WeakMap(), _DebuggerModel_debuggerPausedDetailsInternal = new WeakMap(), _DebuggerModel_scriptsInternal = new WeakMap(), _DebuggerModel_scriptsBySourceURL = new WeakMap(), _DebuggerModel_discardableScripts = new WeakMap(), _DebuggerModel_selectedCallFrameInternal = new WeakMap(), _DebuggerModel_debuggerEnabledInternal = new WeakMap(), _DebuggerModel_debuggerId = new WeakMap(), _DebuggerModel_skipAllPausesTimeout = new WeakMap(), _DebuggerModel_beforePausedCallback = new WeakMap(), _DebuggerModel_computeAutoStepRangesCallback = new WeakMap(), _DebuggerModel_expandCallFramesCallback = new WeakMap(), _DebuggerModel_synchronizeBreakpointsCallback = new WeakMap(), _DebuggerModel_breakpointResolvedEventTarget = new WeakMap(), _DebuggerModel_autoSteppingContext = new WeakMap(), _DebuggerModel_isPausingInternal = new WeakMap(), _DebuggerModel_instances = new WeakSet(), _DebuggerModel_expandCallFrames = 
/** Delegates to the DebuggerLanguagePlugin and potential attached source maps to expand inlined call frames */
async function _DebuggerModel_expandCallFrames(pausedDetails) {
    if (__classPrivateFieldGet(this, _DebuggerModel_expandCallFramesCallback, "f")) {
        pausedDetails.callFrames = await __classPrivateFieldGet(this, _DebuggerModel_expandCallFramesCallback, "f").call(null, pausedDetails.callFrames);
    }
    if (!Root.Runtime.experiments.isEnabled("use-source-map-scopes" /* Root.Runtime.ExperimentName.USE_SOURCE_MAP_SCOPES */)) {
        return;
    }
    // TODO(crbug.com/40277685): Support attaching/detaching source maps after pausing.
    // Expanding call frames via source maps here is only suitable for the experiment prototype because
    // we block until all relevant source maps are loaded.
    // We should change this so the "Debugger Plugin" and "Source Map" have a bottle neck where they expand
    // call frames and that bottleneck should support attaching/detaching source maps while paused.
    const finalFrames = [];
    for (const frame of pausedDetails.callFrames) {
        const sourceMap = await this.sourceMapManager().sourceMapForClientPromise(frame.script);
        if (sourceMap?.hasScopeInfo()) {
            finalFrames.push(...sourceMap.expandCallFrame(frame));
        }
        else {
            finalFrames.push(frame);
        }
    }
    pausedDetails.callFrames = finalFrames;
};
DebuggerModel.shouldResyncDebuggerId = false;
const debuggerIdToModel = new Map();
/**
 * Keep these in sync with WebCore::V8Debugger
 */
export var PauseOnExceptionsState;
(function (PauseOnExceptionsState) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    PauseOnExceptionsState["DontPauseOnExceptions"] = "none";
    PauseOnExceptionsState["PauseOnAllExceptions"] = "all";
    PauseOnExceptionsState["PauseOnCaughtExceptions"] = "caught";
    PauseOnExceptionsState["PauseOnUncaughtExceptions"] = "uncaught";
    /* eslint-enable @typescript-eslint/naming-convention */
})(PauseOnExceptionsState || (PauseOnExceptionsState = {}));
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["DebuggerWasEnabled"] = "DebuggerWasEnabled";
    Events["DebuggerWasDisabled"] = "DebuggerWasDisabled";
    Events["DebuggerPaused"] = "DebuggerPaused";
    Events["DebuggerResumed"] = "DebuggerResumed";
    Events["DebugInfoAttached"] = "DebugInfoAttached";
    Events["ParsedScriptSource"] = "ParsedScriptSource";
    Events["DiscardedAnonymousScriptSource"] = "DiscardedAnonymousScriptSource";
    Events["GlobalObjectCleared"] = "GlobalObjectCleared";
    Events["CallFrameSelected"] = "CallFrameSelected";
    Events["DebuggerIsReadyToPause"] = "DebuggerIsReadyToPause";
    Events["ScriptSourceWasEdited"] = "ScriptSourceWasEdited";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
class DebuggerDispatcher {
    constructor(debuggerModel) {
        _DebuggerDispatcher_debuggerModel.set(this, void 0);
        __classPrivateFieldSet(this, _DebuggerDispatcher_debuggerModel, debuggerModel, "f");
    }
    paused({ callFrames, reason, data, hitBreakpoints, asyncStackTrace, asyncStackTraceId }) {
        if (!__classPrivateFieldGet(this, _DebuggerDispatcher_debuggerModel, "f").debuggerEnabled()) {
            return;
        }
        void __classPrivateFieldGet(this, _DebuggerDispatcher_debuggerModel, "f").pausedScript(callFrames, reason, data, hitBreakpoints || [], asyncStackTrace, asyncStackTraceId);
    }
    resumed() {
        if (!__classPrivateFieldGet(this, _DebuggerDispatcher_debuggerModel, "f").debuggerEnabled()) {
            return;
        }
        __classPrivateFieldGet(this, _DebuggerDispatcher_debuggerModel, "f").resumedScript();
    }
    scriptParsed({ scriptId, url, startLine, startColumn, endLine, endColumn, executionContextId, hash, executionContextAuxData, isLiveEdit, sourceMapURL, hasSourceURL, length, isModule, stackTrace, codeOffset, scriptLanguage, debugSymbols, embedderName, buildId, }) {
        if (!__classPrivateFieldGet(this, _DebuggerDispatcher_debuggerModel, "f").debuggerEnabled()) {
            return;
        }
        __classPrivateFieldGet(this, _DebuggerDispatcher_debuggerModel, "f").parsedScriptSource(scriptId, url, startLine, startColumn, endLine, endColumn, executionContextId, hash, executionContextAuxData, Boolean(isLiveEdit), sourceMapURL, Boolean(hasSourceURL), false, length || 0, isModule || null, stackTrace || null, codeOffset || null, scriptLanguage || null, debugSymbols || null, embedderName || null, buildId || null);
    }
    scriptFailedToParse({ scriptId, url, startLine, startColumn, endLine, endColumn, executionContextId, hash, executionContextAuxData, sourceMapURL, hasSourceURL, length, isModule, stackTrace, codeOffset, scriptLanguage, embedderName, buildId, }) {
        if (!__classPrivateFieldGet(this, _DebuggerDispatcher_debuggerModel, "f").debuggerEnabled()) {
            return;
        }
        __classPrivateFieldGet(this, _DebuggerDispatcher_debuggerModel, "f").parsedScriptSource(scriptId, url, startLine, startColumn, endLine, endColumn, executionContextId, hash, executionContextAuxData, false, sourceMapURL, Boolean(hasSourceURL), true, length || 0, isModule || null, stackTrace || null, codeOffset || null, scriptLanguage || null, null, embedderName || null, buildId || null);
    }
    breakpointResolved({ breakpointId, location }) {
        if (!__classPrivateFieldGet(this, _DebuggerDispatcher_debuggerModel, "f").debuggerEnabled()) {
            return;
        }
        __classPrivateFieldGet(this, _DebuggerDispatcher_debuggerModel, "f").breakpointResolved(breakpointId, location);
    }
}
_DebuggerDispatcher_debuggerModel = new WeakMap();
export class Location {
    constructor(debuggerModel, scriptId, lineNumber, columnNumber, inlineFrameIndex) {
        this.debuggerModel = debuggerModel;
        this.scriptId = scriptId;
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber || 0;
        this.inlineFrameIndex = inlineFrameIndex || 0;
    }
    static fromPayload(debuggerModel, payload, inlineFrameIndex) {
        return new Location(debuggerModel, payload.scriptId, payload.lineNumber, payload.columnNumber, inlineFrameIndex);
    }
    payload() {
        return { scriptId: this.scriptId, lineNumber: this.lineNumber, columnNumber: this.columnNumber };
    }
    script() {
        return this.debuggerModel.scriptForId(this.scriptId);
    }
    continueToLocation(pausedCallback) {
        if (pausedCallback) {
            this.debuggerModel.continueToLocationCallback = this.paused.bind(this, pausedCallback);
        }
        void this.debuggerModel.agent.invoke_continueToLocation({
            location: this.payload(),
            targetCallFrames: "current" /* Protocol.Debugger.ContinueToLocationRequestTargetCallFrames.Current */,
        });
    }
    paused(pausedCallback, debuggerPausedDetails) {
        const location = debuggerPausedDetails.callFrames[0].location();
        if (location.scriptId === this.scriptId && location.lineNumber === this.lineNumber &&
            location.columnNumber === this.columnNumber) {
            pausedCallback();
            return true;
        }
        return false;
    }
    id() {
        return this.debuggerModel.target().id() + ':' + this.scriptId + ':' + this.lineNumber + ':' + this.columnNumber;
    }
}
export class BreakLocation extends Location {
    constructor(debuggerModel, scriptId, lineNumber, columnNumber, type) {
        super(debuggerModel, scriptId, lineNumber, columnNumber);
        if (type) {
            this.type = type;
        }
    }
    static fromPayload(debuggerModel, payload) {
        return new BreakLocation(debuggerModel, payload.scriptId, payload.lineNumber, payload.columnNumber, payload.type);
    }
}
export class CallFrame {
    constructor(debuggerModel, script, payload, inlineFrameIndex, functionName, exception = null) {
        _CallFrame_locationInternal.set(this, void 0);
        _CallFrame_scopeChainInternal.set(this, void 0);
        _CallFrame_localScopeInternal.set(this, void 0);
        _CallFrame_functionLocationInternal.set(this, void 0);
        _CallFrame_returnValueInternal.set(this, void 0);
        this.debuggerModel = debuggerModel;
        this.script = script;
        this.payload = payload;
        __classPrivateFieldSet(this, _CallFrame_locationInternal, Location.fromPayload(debuggerModel, payload.location, inlineFrameIndex), "f");
        __classPrivateFieldSet(this, _CallFrame_scopeChainInternal, [], "f");
        __classPrivateFieldSet(this, _CallFrame_localScopeInternal, null, "f");
        this.inlineFrameIndex = inlineFrameIndex || 0;
        this.functionName = functionName ?? payload.functionName;
        this.missingDebugInfoDetails = null;
        this.canBeRestarted = Boolean(payload.canBeRestarted);
        this.exception = exception;
        for (let i = 0; i < payload.scopeChain.length; ++i) {
            const scope = new Scope(this, i);
            __classPrivateFieldGet(this, _CallFrame_scopeChainInternal, "f").push(scope);
            if (scope.type() === "local" /* Protocol.Debugger.ScopeType.Local */) {
                __classPrivateFieldSet(this, _CallFrame_localScopeInternal, scope, "f");
            }
        }
        if (payload.functionLocation) {
            __classPrivateFieldSet(this, _CallFrame_functionLocationInternal, Location.fromPayload(debuggerModel, payload.functionLocation), "f");
        }
        __classPrivateFieldSet(this, _CallFrame_returnValueInternal, payload.returnValue ? this.debuggerModel.runtimeModel().createRemoteObject(payload.returnValue) : null, "f");
    }
    static fromPayloadArray(debuggerModel, callFrames, exception) {
        const result = [];
        for (let i = 0; i < callFrames.length; ++i) {
            const callFrame = callFrames[i];
            const script = debuggerModel.scriptForId(callFrame.location.scriptId);
            if (script) {
                const ex = i === 0 ? exception : null;
                result.push(new CallFrame(debuggerModel, script, callFrame, undefined, undefined, ex));
            }
        }
        return result;
    }
    createVirtualCallFrame(inlineFrameIndex, name) {
        return new CallFrame(this.debuggerModel, this.script, this.payload, inlineFrameIndex, name, this.exception);
    }
    get id() {
        return this.payload.callFrameId;
    }
    scopeChain() {
        return __classPrivateFieldGet(this, _CallFrame_scopeChainInternal, "f");
    }
    localScope() {
        return __classPrivateFieldGet(this, _CallFrame_localScopeInternal, "f");
    }
    thisObject() {
        return this.payload.this ? this.debuggerModel.runtimeModel().createRemoteObject(this.payload.this) : null;
    }
    returnValue() {
        return __classPrivateFieldGet(this, _CallFrame_returnValueInternal, "f");
    }
    async setReturnValue(expression) {
        if (!__classPrivateFieldGet(this, _CallFrame_returnValueInternal, "f")) {
            return null;
        }
        const evaluateResponse = await this.debuggerModel.agent.invoke_evaluateOnCallFrame({ callFrameId: this.id, expression, silent: true, objectGroup: 'backtrace' });
        if (evaluateResponse.getError() || evaluateResponse.exceptionDetails) {
            return null;
        }
        const response = await this.debuggerModel.agent.invoke_setReturnValue({ newValue: evaluateResponse.result });
        if (response.getError()) {
            return null;
        }
        __classPrivateFieldSet(this, _CallFrame_returnValueInternal, this.debuggerModel.runtimeModel().createRemoteObject(evaluateResponse.result), "f");
        return __classPrivateFieldGet(this, _CallFrame_returnValueInternal, "f");
    }
    location() {
        return __classPrivateFieldGet(this, _CallFrame_locationInternal, "f");
    }
    functionLocation() {
        return __classPrivateFieldGet(this, _CallFrame_functionLocationInternal, "f") || null;
    }
    async evaluate(options) {
        const debuggerModel = this.debuggerModel;
        const runtimeModel = debuggerModel.runtimeModel();
        const evaluateOnCallFrameCallback = debuggerModel.getEvaluateOnCallFrameCallback();
        if (evaluateOnCallFrameCallback) {
            const result = await evaluateOnCallFrameCallback(this, options);
            if (result) {
                return result;
            }
        }
        const response = await this.debuggerModel.agent.invoke_evaluateOnCallFrame({
            callFrameId: this.id,
            expression: options.expression,
            objectGroup: options.objectGroup,
            includeCommandLineAPI: options.includeCommandLineAPI,
            silent: options.silent,
            returnByValue: options.returnByValue,
            generatePreview: options.generatePreview,
            throwOnSideEffect: options.throwOnSideEffect,
            timeout: options.timeout,
        });
        const error = response.getError();
        if (error) {
            return { error };
        }
        return { object: runtimeModel.createRemoteObject(response.result), exceptionDetails: response.exceptionDetails };
    }
    async restart() {
        console.assert(this.canBeRestarted, 'This frame can not be restarted.');
        // Note that even if `canBeRestarted` is true, the restart frame call can still fail.
        // The user can evaluate arbitrary code between pausing and restarting the frame that
        // could mess with the call stack.
        await this.debuggerModel.agent.invoke_restartFrame({ callFrameId: this.id, mode: "StepInto" /* Protocol.Debugger.RestartFrameRequestMode.StepInto */ });
    }
    getPayload() {
        return this.payload;
    }
}
_CallFrame_locationInternal = new WeakMap(), _CallFrame_scopeChainInternal = new WeakMap(), _CallFrame_localScopeInternal = new WeakMap(), _CallFrame_functionLocationInternal = new WeakMap(), _CallFrame_returnValueInternal = new WeakMap();
export class Scope {
    constructor(callFrame, ordinal) {
        _Scope_callFrameInternal.set(this, void 0);
        _Scope_payload.set(this, void 0);
        _Scope_typeInternal.set(this, void 0);
        _Scope_nameInternal.set(this, void 0);
        _Scope_ordinal.set(this, void 0);
        _Scope_locationRange.set(this, void 0);
        _Scope_objectInternal.set(this, void 0);
        __classPrivateFieldSet(this, _Scope_callFrameInternal, callFrame, "f");
        __classPrivateFieldSet(this, _Scope_payload, callFrame.getPayload().scopeChain[ordinal], "f");
        __classPrivateFieldSet(this, _Scope_typeInternal, __classPrivateFieldGet(this, _Scope_payload, "f").type, "f");
        __classPrivateFieldSet(this, _Scope_nameInternal, __classPrivateFieldGet(this, _Scope_payload, "f").name, "f");
        __classPrivateFieldSet(this, _Scope_ordinal, ordinal, "f");
        __classPrivateFieldSet(this, _Scope_objectInternal, null, "f");
        const start = __classPrivateFieldGet(this, _Scope_payload, "f").startLocation ? Location.fromPayload(callFrame.debuggerModel, __classPrivateFieldGet(this, _Scope_payload, "f").startLocation) : null;
        const end = __classPrivateFieldGet(this, _Scope_payload, "f").endLocation ? Location.fromPayload(callFrame.debuggerModel, __classPrivateFieldGet(this, _Scope_payload, "f").endLocation) : null;
        if (start && end && start.scriptId === end.scriptId) {
            __classPrivateFieldSet(this, _Scope_locationRange, { start, end }, "f");
        }
        else {
            __classPrivateFieldSet(this, _Scope_locationRange, null, "f");
        }
    }
    callFrame() {
        return __classPrivateFieldGet(this, _Scope_callFrameInternal, "f");
    }
    type() {
        return __classPrivateFieldGet(this, _Scope_typeInternal, "f");
    }
    typeName() {
        switch (__classPrivateFieldGet(this, _Scope_typeInternal, "f")) {
            case "local" /* Protocol.Debugger.ScopeType.Local */:
                return i18nString(UIStrings.local);
            case "closure" /* Protocol.Debugger.ScopeType.Closure */:
                return i18nString(UIStrings.closure);
            case "catch" /* Protocol.Debugger.ScopeType.Catch */:
                return i18nString(UIStrings.catchBlock);
            case "eval" /* Protocol.Debugger.ScopeType.Eval */:
                return i18n.i18n.lockedString('Eval');
            case "block" /* Protocol.Debugger.ScopeType.Block */:
                return i18nString(UIStrings.block);
            case "script" /* Protocol.Debugger.ScopeType.Script */:
                return i18nString(UIStrings.script);
            case "with" /* Protocol.Debugger.ScopeType.With */:
                return i18nString(UIStrings.withBlock);
            case "global" /* Protocol.Debugger.ScopeType.Global */:
                return i18nString(UIStrings.global);
            case "module" /* Protocol.Debugger.ScopeType.Module */:
                return i18nString(UIStrings.module);
            case "wasm-expression-stack" /* Protocol.Debugger.ScopeType.WasmExpressionStack */:
                return i18nString(UIStrings.expression);
        }
        return '';
    }
    name() {
        return __classPrivateFieldGet(this, _Scope_nameInternal, "f");
    }
    range() {
        return __classPrivateFieldGet(this, _Scope_locationRange, "f");
    }
    object() {
        if (__classPrivateFieldGet(this, _Scope_objectInternal, "f")) {
            return __classPrivateFieldGet(this, _Scope_objectInternal, "f");
        }
        const runtimeModel = __classPrivateFieldGet(this, _Scope_callFrameInternal, "f").debuggerModel.runtimeModel();
        const declarativeScope = __classPrivateFieldGet(this, _Scope_typeInternal, "f") !== "with" /* Protocol.Debugger.ScopeType.With */ &&
            __classPrivateFieldGet(this, _Scope_typeInternal, "f") !== "global" /* Protocol.Debugger.ScopeType.Global */;
        if (declarativeScope) {
            __classPrivateFieldSet(this, _Scope_objectInternal, runtimeModel.createScopeRemoteObject(__classPrivateFieldGet(this, _Scope_payload, "f").object, new ScopeRef(__classPrivateFieldGet(this, _Scope_ordinal, "f"), __classPrivateFieldGet(this, _Scope_callFrameInternal, "f").id)), "f");
        }
        else {
            __classPrivateFieldSet(this, _Scope_objectInternal, runtimeModel.createRemoteObject(__classPrivateFieldGet(this, _Scope_payload, "f").object), "f");
        }
        return __classPrivateFieldGet(this, _Scope_objectInternal, "f");
    }
    description() {
        const declarativeScope = __classPrivateFieldGet(this, _Scope_typeInternal, "f") !== "with" /* Protocol.Debugger.ScopeType.With */ &&
            __classPrivateFieldGet(this, _Scope_typeInternal, "f") !== "global" /* Protocol.Debugger.ScopeType.Global */;
        return declarativeScope ? '' : (__classPrivateFieldGet(this, _Scope_payload, "f").object.description || '');
    }
    icon() {
        return undefined;
    }
    extraProperties() {
        if (__classPrivateFieldGet(this, _Scope_ordinal, "f") !== 0 || __classPrivateFieldGet(this, _Scope_typeInternal, "f") !== "local" /* Protocol.Debugger.ScopeType.Local */ ||
            __classPrivateFieldGet(this, _Scope_callFrameInternal, "f").script.isWasm()) {
            return [];
        }
        const extraProperties = [];
        const exception = __classPrivateFieldGet(this, _Scope_callFrameInternal, "f").exception;
        if (exception) {
            extraProperties.push(new RemoteObjectProperty(i18nString(UIStrings.exception), exception, undefined, undefined, undefined, undefined, undefined, 
            /* synthetic */ true));
        }
        const returnValue = __classPrivateFieldGet(this, _Scope_callFrameInternal, "f").returnValue();
        if (returnValue) {
            extraProperties.push(new RemoteObjectProperty(i18nString(UIStrings.returnValue), returnValue, undefined, undefined, undefined, undefined, undefined, 
            /* synthetic */ true, __classPrivateFieldGet(this, _Scope_callFrameInternal, "f").setReturnValue.bind(__classPrivateFieldGet(this, _Scope_callFrameInternal, "f"))));
        }
        return extraProperties;
    }
}
_Scope_callFrameInternal = new WeakMap(), _Scope_payload = new WeakMap(), _Scope_typeInternal = new WeakMap(), _Scope_nameInternal = new WeakMap(), _Scope_ordinal = new WeakMap(), _Scope_locationRange = new WeakMap(), _Scope_objectInternal = new WeakMap();
export class DebuggerPausedDetails {
    constructor(debuggerModel, callFrames, reason, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    auxData, breakpointIds, asyncStackTrace, asyncStackTraceId) {
        this.debuggerModel = debuggerModel;
        this.reason = reason;
        this.auxData = auxData;
        this.breakpointIds = breakpointIds;
        if (asyncStackTrace) {
            this.asyncStackTrace = this.cleanRedundantFrames(asyncStackTrace);
        }
        this.asyncStackTraceId = asyncStackTraceId;
        this.callFrames = CallFrame.fromPayloadArray(debuggerModel, callFrames, this.exception());
    }
    exception() {
        if (this.reason !== "exception" /* Protocol.Debugger.PausedEventReason.Exception */ &&
            this.reason !== "promiseRejection" /* Protocol.Debugger.PausedEventReason.PromiseRejection */) {
            return null;
        }
        return this.debuggerModel.runtimeModel().createRemoteObject(this.auxData);
    }
    cleanRedundantFrames(asyncStackTrace) {
        let stack = asyncStackTrace;
        let previous = null;
        while (stack) {
            if (previous && !stack.callFrames.length) {
                previous.parent = stack.parent;
            }
            else {
                previous = stack;
            }
            stack = stack.parent;
        }
        return asyncStackTrace;
    }
}
SDKModel.register(DebuggerModel, { capabilities: 4 /* Capability.JS */, autostart: true });
export var BreakpointType;
(function (BreakpointType) {
    BreakpointType["LOGPOINT"] = "LOGPOINT";
    BreakpointType["CONDITIONAL_BREAKPOINT"] = "CONDITIONAL_BREAKPOINT";
    BreakpointType["REGULAR_BREAKPOINT"] = "REGULAR_BREAKPOINT";
})(BreakpointType || (BreakpointType = {}));
export const LOGPOINT_SOURCE_URL = 'debugger://logpoint';
export const COND_BREAKPOINT_SOURCE_URL = 'debugger://breakpoint';
//# sourceMappingURL=DebuggerModel.js.map