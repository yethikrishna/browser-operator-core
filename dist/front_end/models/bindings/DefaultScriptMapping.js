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
var _DefaultScriptMapping_debuggerWorkspaceBinding, _DefaultScriptMapping_project, _DefaultScriptMapping_eventListeners, _DefaultScriptMapping_uiSourceCodeToScript, _DefaultScriptMapping_scriptToUISourceCode;
import * as Common from '../../core/common/common.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Workspace from '../workspace/workspace.js';
import { ContentProviderBasedProject } from './ContentProviderBasedProject.js';
export class DefaultScriptMapping {
    constructor(debuggerModel, workspace, debuggerWorkspaceBinding) {
        _DefaultScriptMapping_debuggerWorkspaceBinding.set(this, void 0);
        _DefaultScriptMapping_project.set(this, void 0);
        _DefaultScriptMapping_eventListeners.set(this, void 0);
        _DefaultScriptMapping_uiSourceCodeToScript.set(this, void 0);
        _DefaultScriptMapping_scriptToUISourceCode.set(this, void 0);
        defaultScriptMappings.add(this);
        __classPrivateFieldSet(this, _DefaultScriptMapping_debuggerWorkspaceBinding, debuggerWorkspaceBinding, "f");
        __classPrivateFieldSet(this, _DefaultScriptMapping_project, new ContentProviderBasedProject(workspace, 'debugger:' + debuggerModel.target().id(), Workspace.Workspace.projectTypes.Debugger, '', true /* isServiceProject */), "f");
        __classPrivateFieldSet(this, _DefaultScriptMapping_eventListeners, [
            debuggerModel.addEventListener(SDK.DebuggerModel.Events.GlobalObjectCleared, this.globalObjectCleared, this),
            debuggerModel.addEventListener(SDK.DebuggerModel.Events.ParsedScriptSource, this.parsedScriptSource, this),
            debuggerModel.addEventListener(SDK.DebuggerModel.Events.DiscardedAnonymousScriptSource, this.discardedScriptSource, this),
        ], "f");
        __classPrivateFieldSet(this, _DefaultScriptMapping_uiSourceCodeToScript, new Map(), "f");
        __classPrivateFieldSet(this, _DefaultScriptMapping_scriptToUISourceCode, new Map(), "f");
    }
    static createV8ScriptURL(script) {
        const name = Common.ParsedURL.ParsedURL.extractName(script.sourceURL);
        const url = 'debugger:///VM' + script.scriptId + (name ? ' ' + name : '');
        return url;
    }
    static scriptForUISourceCode(uiSourceCode) {
        for (const defaultScriptMapping of defaultScriptMappings) {
            const script = __classPrivateFieldGet(defaultScriptMapping, _DefaultScriptMapping_uiSourceCodeToScript, "f").get(uiSourceCode);
            if (script !== undefined) {
                return script;
            }
        }
        return null;
    }
    uiSourceCodeForScript(script) {
        return __classPrivateFieldGet(this, _DefaultScriptMapping_scriptToUISourceCode, "f").get(script) ?? null;
    }
    rawLocationToUILocation(rawLocation) {
        const script = rawLocation.script();
        if (!script) {
            return null;
        }
        const uiSourceCode = __classPrivateFieldGet(this, _DefaultScriptMapping_scriptToUISourceCode, "f").get(script);
        if (!uiSourceCode) {
            return null;
        }
        const { lineNumber, columnNumber } = script.rawLocationToRelativeLocation(rawLocation);
        return uiSourceCode.uiLocation(lineNumber, columnNumber);
    }
    uiLocationToRawLocations(uiSourceCode, lineNumber, columnNumber) {
        const script = __classPrivateFieldGet(this, _DefaultScriptMapping_uiSourceCodeToScript, "f").get(uiSourceCode);
        if (!script) {
            return [];
        }
        ({ lineNumber, columnNumber } = script.relativeLocationToRawLocation({ lineNumber, columnNumber }));
        return [script.debuggerModel.createRawLocation(script, lineNumber, columnNumber ?? 0)];
    }
    uiLocationRangeToRawLocationRanges(uiSourceCode, { startLine, startColumn, endLine, endColumn }) {
        const script = __classPrivateFieldGet(this, _DefaultScriptMapping_uiSourceCodeToScript, "f").get(uiSourceCode);
        if (!script) {
            return [];
        }
        ({ lineNumber: startLine, columnNumber: startColumn } =
            script.relativeLocationToRawLocation({ lineNumber: startLine, columnNumber: startColumn }));
        ({ lineNumber: endLine, columnNumber: endColumn } =
            script.relativeLocationToRawLocation({ lineNumber: endLine, columnNumber: endColumn }));
        const start = script.debuggerModel.createRawLocation(script, startLine, startColumn);
        const end = script.debuggerModel.createRawLocation(script, endLine, endColumn);
        return [{ start, end }];
    }
    parsedScriptSource(event) {
        const script = event.data;
        const url = DefaultScriptMapping.createV8ScriptURL(script);
        const uiSourceCode = __classPrivateFieldGet(this, _DefaultScriptMapping_project, "f").createUISourceCode(url, Common.ResourceType.resourceTypes.Script);
        if (script.isBreakpointCondition) {
            uiSourceCode.markAsUnconditionallyIgnoreListed();
        }
        __classPrivateFieldGet(this, _DefaultScriptMapping_uiSourceCodeToScript, "f").set(uiSourceCode, script);
        __classPrivateFieldGet(this, _DefaultScriptMapping_scriptToUISourceCode, "f").set(script, uiSourceCode);
        __classPrivateFieldGet(this, _DefaultScriptMapping_project, "f").addUISourceCodeWithProvider(uiSourceCode, script, null, 'text/javascript');
        void __classPrivateFieldGet(this, _DefaultScriptMapping_debuggerWorkspaceBinding, "f").updateLocations(script);
    }
    discardedScriptSource(event) {
        const script = event.data;
        const uiSourceCode = __classPrivateFieldGet(this, _DefaultScriptMapping_scriptToUISourceCode, "f").get(script);
        if (uiSourceCode === undefined) {
            return;
        }
        __classPrivateFieldGet(this, _DefaultScriptMapping_scriptToUISourceCode, "f").delete(script);
        __classPrivateFieldGet(this, _DefaultScriptMapping_uiSourceCodeToScript, "f").delete(uiSourceCode);
        __classPrivateFieldGet(this, _DefaultScriptMapping_project, "f").removeUISourceCode(uiSourceCode.url());
    }
    globalObjectCleared() {
        __classPrivateFieldGet(this, _DefaultScriptMapping_scriptToUISourceCode, "f").clear();
        __classPrivateFieldGet(this, _DefaultScriptMapping_uiSourceCodeToScript, "f").clear();
        __classPrivateFieldGet(this, _DefaultScriptMapping_project, "f").reset();
    }
    dispose() {
        defaultScriptMappings.delete(this);
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _DefaultScriptMapping_eventListeners, "f"));
        this.globalObjectCleared();
        __classPrivateFieldGet(this, _DefaultScriptMapping_project, "f").dispose();
    }
}
_DefaultScriptMapping_debuggerWorkspaceBinding = new WeakMap(), _DefaultScriptMapping_project = new WeakMap(), _DefaultScriptMapping_eventListeners = new WeakMap(), _DefaultScriptMapping_uiSourceCodeToScript = new WeakMap(), _DefaultScriptMapping_scriptToUISourceCode = new WeakMap();
// TODO(bmeurer): Remove the static methods from DefaultScriptMapping
// and get rid of this global table.
const defaultScriptMappings = new Set();
//# sourceMappingURL=DefaultScriptMapping.js.map