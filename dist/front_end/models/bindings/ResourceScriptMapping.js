/*
 * Copyright (C) 2012 Google Inc. All rights reserved.
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
var _ResourceScriptMapping_workspace, _ResourceScriptMapping_uiSourceCodeToScriptFile, _ResourceScriptMapping_projects, _ResourceScriptMapping_scriptToUISourceCode, _ResourceScriptMapping_eventListeners, _ResourceScriptFile_resourceScriptMapping, _ResourceScriptFile_scriptSource, _ResourceScriptFile_isDivergingFromVMInternal, _ResourceScriptFile_hasDivergedFromVMInternal, _ResourceScriptFile_isMergingToVMInternal, _ResourceScriptFile_updateMutex;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
import { ContentProviderBasedProject } from './ContentProviderBasedProject.js';
import { DebuggerWorkspaceBinding } from './DebuggerWorkspaceBinding.js';
import { NetworkProject } from './NetworkProject.js';
import { metadataForURL } from './ResourceUtils.js';
const UIStrings = {
    /**
     *@description Error text displayed in the console when editing a live script fails. LiveEdit is
     *the name of the feature for editing code that is already running.
     *@example {warning} PH1
     */
    liveEditFailed: '`LiveEdit` failed: {PH1}',
    /**
     *@description Error text displayed in the console when compiling a live-edited script fails. LiveEdit is
     *the name of the feature for editing code that is already running.
     *@example {connection lost} PH1
     */
    liveEditCompileFailed: '`LiveEdit` compile failed: {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('models/bindings/ResourceScriptMapping.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ResourceScriptMapping {
    constructor(debuggerModel, workspace, debuggerWorkspaceBinding) {
        _ResourceScriptMapping_workspace.set(this, void 0);
        _ResourceScriptMapping_uiSourceCodeToScriptFile.set(this, void 0);
        _ResourceScriptMapping_projects.set(this, void 0);
        _ResourceScriptMapping_scriptToUISourceCode.set(this, void 0);
        _ResourceScriptMapping_eventListeners.set(this, void 0);
        this.debuggerModel = debuggerModel;
        __classPrivateFieldSet(this, _ResourceScriptMapping_workspace, workspace, "f");
        this.debuggerWorkspaceBinding = debuggerWorkspaceBinding;
        __classPrivateFieldSet(this, _ResourceScriptMapping_uiSourceCodeToScriptFile, new Map(), "f");
        __classPrivateFieldSet(this, _ResourceScriptMapping_projects, new Map(), "f");
        __classPrivateFieldSet(this, _ResourceScriptMapping_scriptToUISourceCode, new Map(), "f");
        const runtimeModel = debuggerModel.runtimeModel();
        __classPrivateFieldSet(this, _ResourceScriptMapping_eventListeners, [
            this.debuggerModel.addEventListener(SDK.DebuggerModel.Events.ParsedScriptSource, event => this.addScript(event.data), this),
            this.debuggerModel.addEventListener(SDK.DebuggerModel.Events.GlobalObjectCleared, this.globalObjectCleared, this),
            runtimeModel.addEventListener(SDK.RuntimeModel.Events.ExecutionContextDestroyed, this.executionContextDestroyed, this),
            runtimeModel.target().targetManager().addEventListener("InspectedURLChanged" /* SDK.TargetManager.Events.INSPECTED_URL_CHANGED */, this.inspectedURLChanged, this),
        ], "f");
    }
    project(script) {
        const prefix = script.isContentScript() ? 'js:extensions:' : 'js::';
        const projectId = prefix + this.debuggerModel.target().id() + ':' + script.frameId;
        let project = __classPrivateFieldGet(this, _ResourceScriptMapping_projects, "f").get(projectId);
        if (!project) {
            const projectType = script.isContentScript() ? Workspace.Workspace.projectTypes.ContentScripts :
                Workspace.Workspace.projectTypes.Network;
            project = new ContentProviderBasedProject(__classPrivateFieldGet(this, _ResourceScriptMapping_workspace, "f"), projectId, projectType, '' /* displayName */, false /* isServiceProject */);
            NetworkProject.setTargetForProject(project, this.debuggerModel.target());
            __classPrivateFieldGet(this, _ResourceScriptMapping_projects, "f").set(projectId, project);
        }
        return project;
    }
    uiSourceCodeForScript(script) {
        return __classPrivateFieldGet(this, _ResourceScriptMapping_scriptToUISourceCode, "f").get(script) ?? null;
    }
    rawLocationToUILocation(rawLocation) {
        const script = rawLocation.script();
        if (!script) {
            return null;
        }
        const uiSourceCode = __classPrivateFieldGet(this, _ResourceScriptMapping_scriptToUISourceCode, "f").get(script);
        if (!uiSourceCode) {
            return null;
        }
        const scriptFile = __classPrivateFieldGet(this, _ResourceScriptMapping_uiSourceCodeToScriptFile, "f").get(uiSourceCode);
        if (!scriptFile) {
            return null;
        }
        if ((scriptFile.hasDivergedFromVM() && !scriptFile.isMergingToVM()) || scriptFile.isDivergingFromVM()) {
            return null;
        }
        if (scriptFile.script !== script) {
            return null;
        }
        const { lineNumber, columnNumber = 0 } = rawLocation;
        return uiSourceCode.uiLocation(lineNumber, columnNumber);
    }
    uiLocationToRawLocations(uiSourceCode, lineNumber, columnNumber) {
        const scriptFile = __classPrivateFieldGet(this, _ResourceScriptMapping_uiSourceCodeToScriptFile, "f").get(uiSourceCode);
        if (!scriptFile) {
            return [];
        }
        const { script } = scriptFile;
        if (!script) {
            return [];
        }
        return [this.debuggerModel.createRawLocation(script, lineNumber, columnNumber)];
    }
    uiLocationRangeToRawLocationRanges(uiSourceCode, { startLine, startColumn, endLine, endColumn }) {
        const scriptFile = __classPrivateFieldGet(this, _ResourceScriptMapping_uiSourceCodeToScriptFile, "f").get(uiSourceCode);
        if (!scriptFile) {
            return null;
        }
        const { script } = scriptFile;
        if (!script) {
            return null;
        }
        const start = this.debuggerModel.createRawLocation(script, startLine, startColumn);
        const end = this.debuggerModel.createRawLocation(script, endLine, endColumn);
        return [{ start, end }];
    }
    inspectedURLChanged(event) {
        for (let target = this.debuggerModel.target(); target !== event.data; target = target.parentTarget()) {
            if (target === null) {
                return;
            }
        }
        // Just remove and readd all scripts to ensure their URLs are reflected correctly.
        for (const script of Array.from(__classPrivateFieldGet(this, _ResourceScriptMapping_scriptToUISourceCode, "f").keys())) {
            this.removeScripts([script]);
            this.addScript(script);
        }
    }
    addScript(script) {
        // Ignore live edit scripts here.
        if (script.isLiveEdit() || script.isBreakpointCondition) {
            return;
        }
        let url = script.sourceURL;
        if (!url) {
            return;
        }
        if (script.hasSourceURL) {
            // Try to resolve `//# sourceURL=` annotations relative to
            // the base URL, according to the sourcemap specification.
            url = SDK.SourceMapManager.SourceMapManager.resolveRelativeSourceURL(script.debuggerModel.target(), url);
        }
        else {
            // Ignore inline <script>s without `//# sourceURL` annotation here.
            if (script.isInlineScript()) {
                return;
            }
            // Filter out embedder injected content scripts.
            if (script.isContentScript()) {
                const parsedURL = new Common.ParsedURL.ParsedURL(url);
                if (!parsedURL.isValid) {
                    return;
                }
            }
        }
        // Remove previous UISourceCode, if any
        const project = this.project(script);
        const oldUISourceCode = project.uiSourceCodeForURL(url);
        if (oldUISourceCode) {
            const oldScriptFile = __classPrivateFieldGet(this, _ResourceScriptMapping_uiSourceCodeToScriptFile, "f").get(oldUISourceCode);
            if (oldScriptFile?.script) {
                this.removeScripts([oldScriptFile.script]);
            }
        }
        // Create UISourceCode.
        const originalContentProvider = script.originalContentProvider();
        const uiSourceCode = project.createUISourceCode(url, originalContentProvider.contentType());
        NetworkProject.setInitialFrameAttribution(uiSourceCode, script.frameId);
        const metadata = metadataForURL(this.debuggerModel.target(), script.frameId, url);
        // Bind UISourceCode to scripts.
        const scriptFile = new ResourceScriptFile(this, uiSourceCode, script);
        __classPrivateFieldGet(this, _ResourceScriptMapping_uiSourceCodeToScriptFile, "f").set(uiSourceCode, scriptFile);
        __classPrivateFieldGet(this, _ResourceScriptMapping_scriptToUISourceCode, "f").set(script, uiSourceCode);
        const mimeType = script.isWasm() ? 'application/wasm' : 'text/javascript';
        project.addUISourceCodeWithProvider(uiSourceCode, originalContentProvider, metadata, mimeType);
        void this.debuggerWorkspaceBinding.updateLocations(script);
    }
    scriptFile(uiSourceCode) {
        return __classPrivateFieldGet(this, _ResourceScriptMapping_uiSourceCodeToScriptFile, "f").get(uiSourceCode) || null;
    }
    removeScripts(scripts) {
        const uiSourceCodesByProject = new Platform.MapUtilities.Multimap();
        for (const script of scripts) {
            const uiSourceCode = __classPrivateFieldGet(this, _ResourceScriptMapping_scriptToUISourceCode, "f").get(script);
            if (!uiSourceCode) {
                continue;
            }
            const scriptFile = __classPrivateFieldGet(this, _ResourceScriptMapping_uiSourceCodeToScriptFile, "f").get(uiSourceCode);
            if (scriptFile) {
                scriptFile.dispose();
            }
            __classPrivateFieldGet(this, _ResourceScriptMapping_uiSourceCodeToScriptFile, "f").delete(uiSourceCode);
            __classPrivateFieldGet(this, _ResourceScriptMapping_scriptToUISourceCode, "f").delete(script);
            uiSourceCodesByProject.set(uiSourceCode.project(), uiSourceCode);
            void this.debuggerWorkspaceBinding.updateLocations(script);
        }
        for (const project of uiSourceCodesByProject.keysArray()) {
            const uiSourceCodes = uiSourceCodesByProject.get(project);
            // Check if all the ui source codes in the project are in |uiSourceCodes|.
            let allInProjectRemoved = true;
            for (const projectSourceCode of project.uiSourceCodes()) {
                if (!uiSourceCodes.has(projectSourceCode)) {
                    allInProjectRemoved = false;
                    break;
                }
            }
            // Drop the whole project if no source codes are left in it.
            if (allInProjectRemoved) {
                __classPrivateFieldGet(this, _ResourceScriptMapping_projects, "f").delete(project.id());
                project.removeProject();
            }
            else {
                // Otherwise, announce the removal of each UI source code individually.
                uiSourceCodes.forEach(c => project.removeUISourceCode(c.url()));
            }
        }
    }
    executionContextDestroyed(event) {
        const executionContext = event.data;
        this.removeScripts(this.debuggerModel.scriptsForExecutionContext(executionContext));
    }
    globalObjectCleared() {
        const scripts = Array.from(__classPrivateFieldGet(this, _ResourceScriptMapping_scriptToUISourceCode, "f").keys());
        this.removeScripts(scripts);
    }
    resetForTest() {
        this.globalObjectCleared();
    }
    dispose() {
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _ResourceScriptMapping_eventListeners, "f"));
        this.globalObjectCleared();
    }
}
_ResourceScriptMapping_workspace = new WeakMap(), _ResourceScriptMapping_uiSourceCodeToScriptFile = new WeakMap(), _ResourceScriptMapping_projects = new WeakMap(), _ResourceScriptMapping_scriptToUISourceCode = new WeakMap(), _ResourceScriptMapping_eventListeners = new WeakMap();
export class ResourceScriptFile extends Common.ObjectWrapper.ObjectWrapper {
    constructor(resourceScriptMapping, uiSourceCode, script) {
        super();
        _ResourceScriptFile_resourceScriptMapping.set(this, void 0);
        _ResourceScriptFile_scriptSource.set(this, void 0);
        _ResourceScriptFile_isDivergingFromVMInternal.set(this, void 0);
        _ResourceScriptFile_hasDivergedFromVMInternal.set(this, void 0);
        _ResourceScriptFile_isMergingToVMInternal.set(this, void 0);
        _ResourceScriptFile_updateMutex.set(this, new Common.Mutex.Mutex());
        __classPrivateFieldSet(this, _ResourceScriptFile_resourceScriptMapping, resourceScriptMapping, "f");
        this.uiSourceCode = uiSourceCode;
        this.script = this.uiSourceCode.contentType().isScript() ? script : null;
        this.uiSourceCode.addEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged, this.workingCopyChanged, this);
        this.uiSourceCode.addEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, this.workingCopyCommitted, this);
    }
    isDiverged() {
        if (this.uiSourceCode.isDirty()) {
            return true;
        }
        if (!this.script) {
            return false;
        }
        if (typeof __classPrivateFieldGet(this, _ResourceScriptFile_scriptSource, "f") === 'undefined' || __classPrivateFieldGet(this, _ResourceScriptFile_scriptSource, "f") === null) {
            return false;
        }
        const workingCopy = this.uiSourceCode.workingCopy();
        if (!workingCopy) {
            return false;
        }
        // Match ignoring sourceURL.
        if (!workingCopy.startsWith(__classPrivateFieldGet(this, _ResourceScriptFile_scriptSource, "f").trimEnd())) {
            return true;
        }
        const suffix = this.uiSourceCode.workingCopy().substr(__classPrivateFieldGet(this, _ResourceScriptFile_scriptSource, "f").length);
        return Boolean(suffix.length) && !suffix.match(SDK.Script.sourceURLRegex);
    }
    workingCopyChanged() {
        void this.update();
    }
    workingCopyCommitted() {
        if (this.uiSourceCode.project().canSetFileContent()) {
            return;
        }
        if (!this.script) {
            return;
        }
        const source = this.uiSourceCode.workingCopy();
        void this.script.editSource(source).then(({ status, exceptionDetails }) => {
            void this.scriptSourceWasSet(source, status, exceptionDetails);
        });
    }
    async scriptSourceWasSet(source, status, exceptionDetails) {
        if (status === "Ok" /* Protocol.Debugger.SetScriptSourceResponseStatus.Ok */) {
            __classPrivateFieldSet(this, _ResourceScriptFile_scriptSource, source, "f");
        }
        await this.update();
        if (status === "Ok" /* Protocol.Debugger.SetScriptSourceResponseStatus.Ok */) {
            return;
        }
        if (!exceptionDetails) {
            // TODO(crbug.com/1334484): Instead of to the console, report these errors in an "info bar" at the bottom
            //                          of the text editor, similar to e.g. source mapping errors.
            Common.Console.Console.instance().addMessage(i18nString(UIStrings.liveEditFailed, { PH1: getErrorText(status) }), "warning" /* Common.Console.MessageLevel.WARNING */);
            return;
        }
        const messageText = i18nString(UIStrings.liveEditCompileFailed, { PH1: exceptionDetails.text });
        this.uiSourceCode.addLineMessage("Error" /* Workspace.UISourceCode.Message.Level.ERROR */, messageText, exceptionDetails.lineNumber, exceptionDetails.columnNumber);
        function getErrorText(status) {
            switch (status) {
                case "BlockedByActiveFunction" /* Protocol.Debugger.SetScriptSourceResponseStatus.BlockedByActiveFunction */:
                    return 'Functions that are on the stack (currently being executed) can not be edited';
                case "BlockedByActiveGenerator" /* Protocol.Debugger.SetScriptSourceResponseStatus.BlockedByActiveGenerator */:
                    return 'Async functions/generators that are active can not be edited';
                case "BlockedByTopLevelEsModuleChange" /* Protocol.Debugger.SetScriptSourceResponseStatus.BlockedByTopLevelEsModuleChange */:
                    return 'The top-level of ES modules can not be edited';
                case "CompileError" /* Protocol.Debugger.SetScriptSourceResponseStatus.CompileError */:
                case "Ok" /* Protocol.Debugger.SetScriptSourceResponseStatus.Ok */:
                    throw new Error('Compile errors and Ok status must not be reported on the console');
            }
        }
    }
    async update() {
        // Do not interleave "divergeFromVM" with "mergeToVM" calls.
        const release = await __classPrivateFieldGet(this, _ResourceScriptFile_updateMutex, "f").acquire();
        const diverged = this.isDiverged();
        if (diverged && !__classPrivateFieldGet(this, _ResourceScriptFile_hasDivergedFromVMInternal, "f")) {
            await this.divergeFromVM();
        }
        else if (!diverged && __classPrivateFieldGet(this, _ResourceScriptFile_hasDivergedFromVMInternal, "f")) {
            await this.mergeToVM();
        }
        release();
    }
    async divergeFromVM() {
        if (this.script) {
            __classPrivateFieldSet(this, _ResourceScriptFile_isDivergingFromVMInternal, true, "f");
            await __classPrivateFieldGet(this, _ResourceScriptFile_resourceScriptMapping, "f").debuggerWorkspaceBinding.updateLocations(this.script);
            __classPrivateFieldSet(this, _ResourceScriptFile_isDivergingFromVMInternal, undefined, "f");
            __classPrivateFieldSet(this, _ResourceScriptFile_hasDivergedFromVMInternal, true, "f");
            this.dispatchEventToListeners("DidDivergeFromVM" /* ResourceScriptFile.Events.DID_DIVERGE_FROM_VM */);
        }
    }
    async mergeToVM() {
        if (this.script) {
            __classPrivateFieldSet(this, _ResourceScriptFile_hasDivergedFromVMInternal, undefined, "f");
            __classPrivateFieldSet(this, _ResourceScriptFile_isMergingToVMInternal, true, "f");
            await __classPrivateFieldGet(this, _ResourceScriptFile_resourceScriptMapping, "f").debuggerWorkspaceBinding.updateLocations(this.script);
            __classPrivateFieldSet(this, _ResourceScriptFile_isMergingToVMInternal, undefined, "f");
            this.dispatchEventToListeners("DidMergeToVM" /* ResourceScriptFile.Events.DID_MERGE_TO_VM */);
        }
    }
    hasDivergedFromVM() {
        return Boolean(__classPrivateFieldGet(this, _ResourceScriptFile_hasDivergedFromVMInternal, "f"));
    }
    isDivergingFromVM() {
        return Boolean(__classPrivateFieldGet(this, _ResourceScriptFile_isDivergingFromVMInternal, "f"));
    }
    isMergingToVM() {
        return Boolean(__classPrivateFieldGet(this, _ResourceScriptFile_isMergingToVMInternal, "f"));
    }
    checkMapping() {
        if (!this.script || typeof __classPrivateFieldGet(this, _ResourceScriptFile_scriptSource, "f") !== 'undefined') {
            this.mappingCheckedForTest();
            return;
        }
        void this.script.requestContentData().then(content => {
            __classPrivateFieldSet(this, _ResourceScriptFile_scriptSource, TextUtils.ContentData.ContentData.textOr(content, null), "f");
            void this.update().then(() => this.mappingCheckedForTest());
        });
    }
    mappingCheckedForTest() {
    }
    dispose() {
        this.uiSourceCode.removeEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged, this.workingCopyChanged, this);
        this.uiSourceCode.removeEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, this.workingCopyCommitted, this);
    }
    addSourceMapURL(sourceMapURL) {
        if (!this.script) {
            return;
        }
        this.script.debuggerModel.setSourceMapURL(this.script, sourceMapURL);
    }
    addDebugInfoURL(debugInfoURL) {
        if (!this.script) {
            return;
        }
        const { pluginManager } = DebuggerWorkspaceBinding.instance();
        pluginManager.setDebugInfoURL(this.script, debugInfoURL);
    }
    hasSourceMapURL() {
        return Boolean(this.script?.sourceMapURL);
    }
    async missingSymbolFiles() {
        if (!this.script) {
            return null;
        }
        const { pluginManager } = __classPrivateFieldGet(this, _ResourceScriptFile_resourceScriptMapping, "f").debuggerWorkspaceBinding;
        const sources = await pluginManager.getSourcesForScript(this.script);
        return sources && 'missingSymbolFiles' in sources ? sources.missingSymbolFiles : null;
    }
}
_ResourceScriptFile_resourceScriptMapping = new WeakMap(), _ResourceScriptFile_scriptSource = new WeakMap(), _ResourceScriptFile_isDivergingFromVMInternal = new WeakMap(), _ResourceScriptFile_hasDivergedFromVMInternal = new WeakMap(), _ResourceScriptFile_isMergingToVMInternal = new WeakMap(), _ResourceScriptFile_updateMutex = new WeakMap();
(function (ResourceScriptFile) {
    let Events;
    (function (Events) {
        Events["DID_MERGE_TO_VM"] = "DidMergeToVM";
        Events["DID_DIVERGE_FROM_VM"] = "DidDivergeFromVM";
    })(Events = ResourceScriptFile.Events || (ResourceScriptFile.Events = {}));
})(ResourceScriptFile || (ResourceScriptFile = {}));
//# sourceMappingURL=ResourceScriptMapping.js.map