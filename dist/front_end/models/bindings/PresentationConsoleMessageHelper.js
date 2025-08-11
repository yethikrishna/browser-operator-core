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
var _PresentationSourceFrameMessageManager_targetToMessageHelperMap, _PresentationConsoleMessageManager_sourceFrameMessageManager, _PresentationSourceFrameMessageHelper_instances, _PresentationSourceFrameMessageHelper_debuggerModel, _PresentationSourceFrameMessageHelper_cssModel, _PresentationSourceFrameMessageHelper_presentationMessages, _PresentationSourceFrameMessageHelper_locationPool, _PresentationSourceFrameMessageHelper_uiLocation, _PresentationSourceFrameMessageHelper_cssLocation, _PresentationSourceFrameMessageHelper_rawLocation, _PresentationSourceFrameMessageHelper_parsedScriptSource, _PresentationSourceFrameMessageHelper_uiSourceCodeAdded, _PresentationSourceFrameMessageHelper_styleSheetAdded, _PresentationSourceFrameMessageHelper_debuggerReset, _FrozenLiveLocation_uiLocation, _PresentationSourceFrameMessage_instances, _PresentationSourceFrameMessage_uiSourceCode, _PresentationSourceFrameMessage_liveLocation, _PresentationSourceFrameMessage_locationPool, _PresentationSourceFrameMessage_message, _PresentationSourceFrameMessage_updateLocation;
import * as SDK from '../../core/sdk/sdk.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
import { CSSWorkspaceBinding } from './CSSWorkspaceBinding.js';
import { DebuggerWorkspaceBinding } from './DebuggerWorkspaceBinding.js';
import { LiveLocationPool, LiveLocationWithPool } from './LiveLocation.js';
export class PresentationSourceFrameMessageManager {
    constructor() {
        _PresentationSourceFrameMessageManager_targetToMessageHelperMap.set(this, new WeakMap());
        SDK.TargetManager.TargetManager.instance().observeModels(SDK.DebuggerModel.DebuggerModel, this);
        SDK.TargetManager.TargetManager.instance().observeModels(SDK.CSSModel.CSSModel, this);
    }
    modelAdded(model) {
        const target = model.target();
        const helper = __classPrivateFieldGet(this, _PresentationSourceFrameMessageManager_targetToMessageHelperMap, "f").get(target) ?? new PresentationSourceFrameMessageHelper();
        if (model instanceof SDK.DebuggerModel.DebuggerModel) {
            helper.setDebuggerModel(model);
        }
        else {
            helper.setCSSModel(model);
        }
        __classPrivateFieldGet(this, _PresentationSourceFrameMessageManager_targetToMessageHelperMap, "f").set(target, helper);
    }
    modelRemoved(model) {
        const target = model.target();
        const helper = __classPrivateFieldGet(this, _PresentationSourceFrameMessageManager_targetToMessageHelperMap, "f").get(target);
        helper?.clear();
    }
    addMessage(message, source, target) {
        const helper = __classPrivateFieldGet(this, _PresentationSourceFrameMessageManager_targetToMessageHelperMap, "f").get(target);
        void helper?.addMessage(message, source);
    }
    clear() {
        for (const target of SDK.TargetManager.TargetManager.instance().targets()) {
            const helper = __classPrivateFieldGet(this, _PresentationSourceFrameMessageManager_targetToMessageHelperMap, "f").get(target);
            helper?.clear();
        }
    }
}
_PresentationSourceFrameMessageManager_targetToMessageHelperMap = new WeakMap();
export class PresentationConsoleMessageManager {
    constructor() {
        _PresentationConsoleMessageManager_sourceFrameMessageManager.set(this, new PresentationSourceFrameMessageManager());
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.ConsoleModel.ConsoleModel, SDK.ConsoleModel.Events.MessageAdded, event => this.consoleMessageAdded(event.data));
        SDK.ConsoleModel.ConsoleModel.allMessagesUnordered().forEach(this.consoleMessageAdded, this);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.ConsoleModel.ConsoleModel, SDK.ConsoleModel.Events.ConsoleCleared, () => __classPrivateFieldGet(this, _PresentationConsoleMessageManager_sourceFrameMessageManager, "f").clear());
    }
    consoleMessageAdded(consoleMessage) {
        const runtimeModel = consoleMessage.runtimeModel();
        if (!consoleMessage.isErrorOrWarning() || !consoleMessage.runtimeModel() ||
            consoleMessage.source === "violation" /* Protocol.Log.LogEntrySource.Violation */ || !runtimeModel) {
            return;
        }
        const level = consoleMessage.level === "error" /* Protocol.Log.LogEntryLevel.Error */ ?
            "Error" /* Workspace.UISourceCode.Message.Level.ERROR */ :
            "Warning" /* Workspace.UISourceCode.Message.Level.WARNING */;
        __classPrivateFieldGet(this, _PresentationConsoleMessageManager_sourceFrameMessageManager, "f").addMessage(new Workspace.UISourceCode.Message(level, consoleMessage.messageText), consoleMessage, runtimeModel.target());
    }
}
_PresentationConsoleMessageManager_sourceFrameMessageManager = new WeakMap();
export class PresentationSourceFrameMessageHelper {
    constructor() {
        _PresentationSourceFrameMessageHelper_instances.add(this);
        _PresentationSourceFrameMessageHelper_debuggerModel.set(this, void 0);
        _PresentationSourceFrameMessageHelper_cssModel.set(this, void 0);
        _PresentationSourceFrameMessageHelper_presentationMessages.set(this, new Map());
        _PresentationSourceFrameMessageHelper_locationPool.set(this, void 0);
        __classPrivateFieldSet(this, _PresentationSourceFrameMessageHelper_locationPool, new LiveLocationPool(), "f");
        Workspace.Workspace.WorkspaceImpl.instance().addEventListener(Workspace.Workspace.Events.UISourceCodeAdded, __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_instances, "m", _PresentationSourceFrameMessageHelper_uiSourceCodeAdded).bind(this));
    }
    setDebuggerModel(debuggerModel) {
        if (__classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_debuggerModel, "f")) {
            throw new Error('Cannot set DebuggerModel twice');
        }
        __classPrivateFieldSet(this, _PresentationSourceFrameMessageHelper_debuggerModel, debuggerModel, "f");
        // TODO(dgozman): queueMicrotask because we race with DebuggerWorkspaceBinding on ParsedScriptSource event delivery.
        debuggerModel.addEventListener(SDK.DebuggerModel.Events.ParsedScriptSource, event => {
            queueMicrotask(() => {
                __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_instances, "m", _PresentationSourceFrameMessageHelper_parsedScriptSource).call(this, event);
            });
        });
        debuggerModel.addEventListener(SDK.DebuggerModel.Events.GlobalObjectCleared, __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_instances, "m", _PresentationSourceFrameMessageHelper_debuggerReset), this);
    }
    setCSSModel(cssModel) {
        if (__classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_cssModel, "f")) {
            throw new Error('Cannot set CSSModel twice');
        }
        __classPrivateFieldSet(this, _PresentationSourceFrameMessageHelper_cssModel, cssModel, "f");
        cssModel.addEventListener(SDK.CSSModel.Events.StyleSheetAdded, event => queueMicrotask(() => __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_instances, "m", _PresentationSourceFrameMessageHelper_styleSheetAdded).call(this, event)));
    }
    async addMessage(message, source) {
        const presentation = new PresentationSourceFrameMessage(message, __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_locationPool, "f"));
        const location = __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_instances, "m", _PresentationSourceFrameMessageHelper_rawLocation).call(this, source) ?? __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_instances, "m", _PresentationSourceFrameMessageHelper_cssLocation).call(this, source) ?? __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_instances, "m", _PresentationSourceFrameMessageHelper_uiLocation).call(this, source);
        if (location) {
            await presentation.updateLocationSource(location);
        }
        if (source.url) {
            let messages = __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_presentationMessages, "f").get(source.url);
            if (!messages) {
                messages = [];
                __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_presentationMessages, "f").set(source.url, messages);
            }
            messages.push({ source, presentation });
        }
    }
    parsedScriptSourceForTest() {
    }
    uiSourceCodeAddedForTest() {
    }
    styleSheetAddedForTest() {
    }
    clear() {
        __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_instances, "m", _PresentationSourceFrameMessageHelper_debuggerReset).call(this);
    }
}
_PresentationSourceFrameMessageHelper_debuggerModel = new WeakMap(), _PresentationSourceFrameMessageHelper_cssModel = new WeakMap(), _PresentationSourceFrameMessageHelper_presentationMessages = new WeakMap(), _PresentationSourceFrameMessageHelper_locationPool = new WeakMap(), _PresentationSourceFrameMessageHelper_instances = new WeakSet(), _PresentationSourceFrameMessageHelper_uiLocation = function _PresentationSourceFrameMessageHelper_uiLocation(source) {
    if (!source.url) {
        return null;
    }
    const uiSourceCode = Workspace.Workspace.WorkspaceImpl.instance().uiSourceCodeForURL(source.url);
    if (!uiSourceCode) {
        return null;
    }
    return new Workspace.UISourceCode.UILocation(uiSourceCode, source.line, source.column);
}, _PresentationSourceFrameMessageHelper_cssLocation = function _PresentationSourceFrameMessageHelper_cssLocation(source) {
    if (!__classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_cssModel, "f") || !source.url) {
        return null;
    }
    const locations = __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_cssModel, "f").createRawLocationsByURL(source.url, source.line, source.column);
    return locations[0] ?? null;
}, _PresentationSourceFrameMessageHelper_rawLocation = function _PresentationSourceFrameMessageHelper_rawLocation(source) {
    if (!__classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_debuggerModel, "f")) {
        return null;
    }
    if (source.scriptId) {
        return __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_debuggerModel, "f").createRawLocationByScriptId(source.scriptId, source.line, source.column);
    }
    const callFrame = source.stackTrace?.callFrames ? source.stackTrace.callFrames[0] : null;
    if (callFrame) {
        return __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_debuggerModel, "f").createRawLocationByScriptId(callFrame.scriptId, callFrame.lineNumber, callFrame.columnNumber);
    }
    if (source.url) {
        return __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_debuggerModel, "f").createRawLocationByURL(source.url, source.line, source.column);
    }
    return null;
}, _PresentationSourceFrameMessageHelper_parsedScriptSource = function _PresentationSourceFrameMessageHelper_parsedScriptSource(event) {
    const script = event.data;
    const messages = __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_presentationMessages, "f").get(script.sourceURL);
    const promises = [];
    for (const { presentation, source } of messages ?? []) {
        const rawLocation = __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_instances, "m", _PresentationSourceFrameMessageHelper_rawLocation).call(this, source);
        if (rawLocation && script.scriptId === rawLocation.scriptId) {
            promises.push(presentation.updateLocationSource(rawLocation));
        }
    }
    void Promise.all(promises).then(this.parsedScriptSourceForTest.bind(this));
}, _PresentationSourceFrameMessageHelper_uiSourceCodeAdded = function _PresentationSourceFrameMessageHelper_uiSourceCodeAdded(event) {
    const uiSourceCode = event.data;
    const messages = __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_presentationMessages, "f").get(uiSourceCode.url());
    const promises = [];
    for (const { presentation, source } of messages ?? []) {
        promises.push(presentation.updateLocationSource(new Workspace.UISourceCode.UILocation(uiSourceCode, source.line, source.column)));
    }
    void Promise.all(promises).then(this.uiSourceCodeAddedForTest.bind(this));
}, _PresentationSourceFrameMessageHelper_styleSheetAdded = function _PresentationSourceFrameMessageHelper_styleSheetAdded(event) {
    const header = event.data;
    const messages = __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_presentationMessages, "f").get(header.sourceURL);
    const promises = [];
    for (const { source, presentation } of messages ?? []) {
        if (header.containsLocation(source.line, source.column)) {
            promises.push(presentation.updateLocationSource(new SDK.CSSModel.CSSLocation(header, source.line, source.column)));
        }
    }
    void Promise.all(promises).then(this.styleSheetAddedForTest.bind(this));
}, _PresentationSourceFrameMessageHelper_debuggerReset = function _PresentationSourceFrameMessageHelper_debuggerReset() {
    const presentations = Array.from(__classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_presentationMessages, "f").values()).flat();
    for (const { presentation } of presentations) {
        presentation.dispose();
    }
    __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_presentationMessages, "f").clear();
    __classPrivateFieldGet(this, _PresentationSourceFrameMessageHelper_locationPool, "f").disposeAll();
};
class FrozenLiveLocation extends LiveLocationWithPool {
    constructor(uiLocation, updateDelegate, locationPool) {
        super(updateDelegate, locationPool);
        _FrozenLiveLocation_uiLocation.set(this, void 0);
        __classPrivateFieldSet(this, _FrozenLiveLocation_uiLocation, uiLocation, "f");
    }
    async isIgnoreListed() {
        return false;
    }
    async uiLocation() {
        return __classPrivateFieldGet(this, _FrozenLiveLocation_uiLocation, "f");
    }
}
_FrozenLiveLocation_uiLocation = new WeakMap();
export class PresentationSourceFrameMessage {
    constructor(message, locationPool) {
        _PresentationSourceFrameMessage_instances.add(this);
        _PresentationSourceFrameMessage_uiSourceCode.set(this, void 0);
        _PresentationSourceFrameMessage_liveLocation.set(this, void 0);
        _PresentationSourceFrameMessage_locationPool.set(this, void 0);
        _PresentationSourceFrameMessage_message.set(this, void 0);
        __classPrivateFieldSet(this, _PresentationSourceFrameMessage_message, message, "f");
        __classPrivateFieldSet(this, _PresentationSourceFrameMessage_locationPool, locationPool, "f");
    }
    async updateLocationSource(source) {
        if (source instanceof SDK.DebuggerModel.Location) {
            await DebuggerWorkspaceBinding.instance().createLiveLocation(source, __classPrivateFieldGet(this, _PresentationSourceFrameMessage_instances, "m", _PresentationSourceFrameMessage_updateLocation).bind(this), __classPrivateFieldGet(this, _PresentationSourceFrameMessage_locationPool, "f"));
        }
        else if (source instanceof SDK.CSSModel.CSSLocation) {
            await CSSWorkspaceBinding.instance().createLiveLocation(source, __classPrivateFieldGet(this, _PresentationSourceFrameMessage_instances, "m", _PresentationSourceFrameMessage_updateLocation).bind(this), __classPrivateFieldGet(this, _PresentationSourceFrameMessage_locationPool, "f"));
        }
        else if (source instanceof Workspace.UISourceCode.UILocation) {
            if (!__classPrivateFieldGet(this, _PresentationSourceFrameMessage_liveLocation, "f")) { // Don't "downgrade" the location if a debugger or css mapping was already successful
                __classPrivateFieldSet(this, _PresentationSourceFrameMessage_liveLocation, new FrozenLiveLocation(source, __classPrivateFieldGet(this, _PresentationSourceFrameMessage_instances, "m", _PresentationSourceFrameMessage_updateLocation).bind(this), __classPrivateFieldGet(this, _PresentationSourceFrameMessage_locationPool, "f")), "f");
                await __classPrivateFieldGet(this, _PresentationSourceFrameMessage_liveLocation, "f").update();
            }
        }
    }
    dispose() {
        __classPrivateFieldGet(this, _PresentationSourceFrameMessage_uiSourceCode, "f")?.removeMessage(__classPrivateFieldGet(this, _PresentationSourceFrameMessage_message, "f"));
        __classPrivateFieldGet(this, _PresentationSourceFrameMessage_liveLocation, "f")?.dispose();
    }
}
_PresentationSourceFrameMessage_uiSourceCode = new WeakMap(), _PresentationSourceFrameMessage_liveLocation = new WeakMap(), _PresentationSourceFrameMessage_locationPool = new WeakMap(), _PresentationSourceFrameMessage_message = new WeakMap(), _PresentationSourceFrameMessage_instances = new WeakSet(), _PresentationSourceFrameMessage_updateLocation = async function _PresentationSourceFrameMessage_updateLocation(liveLocation) {
    if (__classPrivateFieldGet(this, _PresentationSourceFrameMessage_uiSourceCode, "f")) {
        __classPrivateFieldGet(this, _PresentationSourceFrameMessage_uiSourceCode, "f").removeMessage(__classPrivateFieldGet(this, _PresentationSourceFrameMessage_message, "f"));
    }
    if (liveLocation !== __classPrivateFieldGet(this, _PresentationSourceFrameMessage_liveLocation, "f")) {
        __classPrivateFieldGet(this, _PresentationSourceFrameMessage_uiSourceCode, "f")?.removeMessage(__classPrivateFieldGet(this, _PresentationSourceFrameMessage_message, "f"));
        __classPrivateFieldGet(this, _PresentationSourceFrameMessage_liveLocation, "f")?.dispose();
        __classPrivateFieldSet(this, _PresentationSourceFrameMessage_liveLocation, liveLocation, "f");
    }
    const uiLocation = await liveLocation.uiLocation();
    if (!uiLocation) {
        return;
    }
    __classPrivateFieldGet(this, _PresentationSourceFrameMessage_message, "f").range =
        TextUtils.TextRange.TextRange.createFromLocation(uiLocation.lineNumber, uiLocation.columnNumber || 0);
    __classPrivateFieldSet(this, _PresentationSourceFrameMessage_uiSourceCode, uiLocation.uiSourceCode, "f");
    __classPrivateFieldGet(this, _PresentationSourceFrameMessage_uiSourceCode, "f").addMessage(__classPrivateFieldGet(this, _PresentationSourceFrameMessage_message, "f"));
};
//# sourceMappingURL=PresentationConsoleMessageHelper.js.map