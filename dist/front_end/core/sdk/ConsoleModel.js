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
var _ConsoleModel_messagesInternal, _ConsoleModel_messagesByTimestamp, _ConsoleModel_messageByExceptionId, _ConsoleModel_warningsInternal, _ConsoleModel_errorsInternal, _ConsoleModel_violationsInternal, _ConsoleModel_pageLoadSequenceNumber, _ConsoleModel_targetListeners, _a, _ConsoleMessage_runtimeModelInternal, _ConsoleMessage_executionContextId, _ConsoleMessage_originatingConsoleMessage, _ConsoleMessage_pageLoadSequenceNumber, _ConsoleMessage_exceptionId, _ConsoleMessage_affectedResources, _ConsoleMessage_originatingBreakpointType, _ConsoleMessage_stackFrameWithBreakpoint;
import * as Common from '../common/common.js';
import * as Host from '../host/host.js';
import * as i18n from '../i18n/i18n.js';
import * as Platform from '../platform/platform.js';
import { FrontendMessageType } from './ConsoleModelTypes.js';
import { CPUProfilerModel } from './CPUProfilerModel.js';
import { COND_BREAKPOINT_SOURCE_URL, Events as DebuggerModelEvents, LOGPOINT_SOURCE_URL, } from './DebuggerModel.js';
import { LogModel } from './LogModel.js';
import { RemoteObject } from './RemoteObject.js';
import { Events as ResourceTreeModelEvents, ResourceTreeModel, } from './ResourceTreeModel.js';
import { Events as RuntimeModelEvents, RuntimeModel, } from './RuntimeModel.js';
import { SDKModel } from './SDKModel.js';
import { Type } from './Target.js';
import { TargetManager } from './TargetManager.js';
export { FrontendMessageType } from './ConsoleModelTypes.js';
const UIStrings = {
    /**
     *@description Text shown when the main frame (page) of the website was navigated to a different URL.
     *@example {https://example.com} PH1
     */
    navigatedToS: 'Navigated to {PH1}',
    /**
     *@description Text shown when the main frame (page) of the website was navigated to a different URL
     * and the page was restored from back/forward cache (https://web.dev/bfcache/).
     *@example {https://example.com} PH1
     */
    bfcacheNavigation: 'Navigation to {PH1} was restored from back/forward cache (see https://web.dev/bfcache/)',
    /**
     *@description Text shown in the console when a performance profile (with the given name) was started.
     *@example {title} PH1
     */
    profileSStarted: 'Profile \'\'{PH1}\'\' started.',
    /**
     *@description Text shown in the console when a performance profile (with the given name) was stopped.
     *@example {name} PH1
     */
    profileSFinished: 'Profile \'\'{PH1}\'\' finished.',
    /**
     *@description Error message shown in the console after the user tries to save a JavaScript value to a temporary variable.
     */
    failedToSaveToTempVariable: 'Failed to save to temp variable.',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/ConsoleModel.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ConsoleModel extends SDKModel {
    constructor(target) {
        super(target);
        _ConsoleModel_messagesInternal.set(this, []);
        _ConsoleModel_messagesByTimestamp.set(this, new Platform.MapUtilities.Multimap());
        _ConsoleModel_messageByExceptionId.set(this, new Map());
        _ConsoleModel_warningsInternal.set(this, 0);
        _ConsoleModel_errorsInternal.set(this, 0);
        _ConsoleModel_violationsInternal.set(this, 0);
        _ConsoleModel_pageLoadSequenceNumber.set(this, 0);
        _ConsoleModel_targetListeners.set(this, new WeakMap());
        const resourceTreeModel = target.model(ResourceTreeModel);
        if (!resourceTreeModel || resourceTreeModel.cachedResourcesLoaded()) {
            this.initTarget(target);
            return;
        }
        const eventListener = resourceTreeModel.addEventListener(ResourceTreeModelEvents.CachedResourcesLoaded, () => {
            Common.EventTarget.removeEventListeners([eventListener]);
            this.initTarget(target);
        });
    }
    initTarget(target) {
        const eventListeners = [];
        const cpuProfilerModel = target.model(CPUProfilerModel);
        if (cpuProfilerModel) {
            eventListeners.push(cpuProfilerModel.addEventListener("ConsoleProfileStarted" /* CPUProfilerModelEvents.CONSOLE_PROFILE_STARTED */, this.consoleProfileStarted.bind(this, cpuProfilerModel)));
            eventListeners.push(cpuProfilerModel.addEventListener("ConsoleProfileFinished" /* CPUProfilerModelEvents.CONSOLE_PROFILE_FINISHED */, this.consoleProfileFinished.bind(this, cpuProfilerModel)));
        }
        const resourceTreeModel = target.model(ResourceTreeModel);
        if (resourceTreeModel && target.parentTarget()?.type() !== Type.FRAME) {
            eventListeners.push(resourceTreeModel.addEventListener(ResourceTreeModelEvents.PrimaryPageChanged, this.primaryPageChanged, this));
        }
        const runtimeModel = target.model(RuntimeModel);
        if (runtimeModel) {
            eventListeners.push(runtimeModel.addEventListener(RuntimeModelEvents.ExceptionThrown, this.exceptionThrown.bind(this, runtimeModel)));
            eventListeners.push(runtimeModel.addEventListener(RuntimeModelEvents.ExceptionRevoked, this.exceptionRevoked.bind(this, runtimeModel)));
            eventListeners.push(runtimeModel.addEventListener(RuntimeModelEvents.ConsoleAPICalled, this.consoleAPICalled.bind(this, runtimeModel)));
            if (target.parentTarget()?.type() !== Type.FRAME) {
                eventListeners.push(runtimeModel.debuggerModel().addEventListener(DebuggerModelEvents.GlobalObjectCleared, this.clearIfNecessary, this));
            }
            eventListeners.push(runtimeModel.addEventListener(RuntimeModelEvents.QueryObjectRequested, this.queryObjectRequested.bind(this, runtimeModel)));
        }
        __classPrivateFieldGet(this, _ConsoleModel_targetListeners, "f").set(target, eventListeners);
    }
    targetRemoved(target) {
        const runtimeModel = target.model(RuntimeModel);
        if (runtimeModel) {
            __classPrivateFieldGet(this, _ConsoleModel_messageByExceptionId, "f").delete(runtimeModel);
        }
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _ConsoleModel_targetListeners, "f").get(target) || []);
    }
    async evaluateCommandInConsole(executionContext, originatingMessage, expression, useCommandLineAPI) {
        const result = await executionContext.evaluate({
            expression,
            objectGroup: 'console',
            includeCommandLineAPI: useCommandLineAPI,
            silent: false,
            returnByValue: false,
            generatePreview: true,
            replMode: true,
            allowUnsafeEvalBlockedByCSP: false,
        }, Common.Settings.Settings.instance().moduleSetting('console-user-activation-eval').get(), 
        /* awaitPromise */ false);
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.ConsoleEvaluated);
        if ('error' in result) {
            return;
        }
        await Common.Console.Console.instance().showPromise();
        this.dispatchEventToListeners(Events.CommandEvaluated, { result: result.object, commandMessage: originatingMessage, exceptionDetails: result.exceptionDetails });
    }
    addCommandMessage(executionContext, text) {
        const commandMessage = new ConsoleMessage(executionContext.runtimeModel, "javascript" /* Protocol.Log.LogEntrySource.Javascript */, null, text, { type: FrontendMessageType.Command });
        commandMessage.setExecutionContextId(executionContext.id);
        this.addMessage(commandMessage);
        return commandMessage;
    }
    addMessage(msg) {
        msg.setPageLoadSequenceNumber(__classPrivateFieldGet(this, _ConsoleModel_pageLoadSequenceNumber, "f"));
        if (msg.source === Common.Console.FrontendMessageSource.ConsoleAPI &&
            msg.type === "clear" /* Protocol.Runtime.ConsoleAPICalledEventType.Clear */) {
            this.clearIfNecessary();
        }
        __classPrivateFieldGet(this, _ConsoleModel_messagesInternal, "f").push(msg);
        __classPrivateFieldGet(this, _ConsoleModel_messagesByTimestamp, "f").set(msg.timestamp, msg);
        const runtimeModel = msg.runtimeModel();
        const exceptionId = msg.getExceptionId();
        if (exceptionId && runtimeModel) {
            let modelMap = __classPrivateFieldGet(this, _ConsoleModel_messageByExceptionId, "f").get(runtimeModel);
            if (!modelMap) {
                modelMap = new Map();
                __classPrivateFieldGet(this, _ConsoleModel_messageByExceptionId, "f").set(runtimeModel, modelMap);
            }
            modelMap.set(exceptionId, msg);
        }
        this.incrementErrorWarningCount(msg);
        this.dispatchEventToListeners(Events.MessageAdded, msg);
    }
    exceptionThrown(runtimeModel, event) {
        const exceptionWithTimestamp = event.data;
        const affectedResources = extractExceptionMetaData(exceptionWithTimestamp.details.exceptionMetaData);
        const consoleMessage = ConsoleMessage.fromException(runtimeModel, exceptionWithTimestamp.details, undefined, exceptionWithTimestamp.timestamp, undefined, affectedResources);
        consoleMessage.setExceptionId(exceptionWithTimestamp.details.exceptionId);
        this.addMessage(consoleMessage);
    }
    exceptionRevoked(runtimeModel, event) {
        var _b;
        const exceptionId = event.data;
        const modelMap = __classPrivateFieldGet(this, _ConsoleModel_messageByExceptionId, "f").get(runtimeModel);
        const exceptionMessage = modelMap ? modelMap.get(exceptionId) : null;
        if (!exceptionMessage) {
            return;
        }
        __classPrivateFieldSet(this, _ConsoleModel_errorsInternal, (_b = __classPrivateFieldGet(this, _ConsoleModel_errorsInternal, "f"), _b--, _b), "f");
        exceptionMessage.level = "verbose" /* Protocol.Log.LogEntryLevel.Verbose */;
        this.dispatchEventToListeners(Events.MessageUpdated, exceptionMessage);
    }
    consoleAPICalled(runtimeModel, event) {
        const call = event.data;
        let level = "info" /* Protocol.Log.LogEntryLevel.Info */;
        if (call.type === "debug" /* Protocol.Runtime.ConsoleAPICalledEventType.Debug */) {
            level = "verbose" /* Protocol.Log.LogEntryLevel.Verbose */;
        }
        else if (call.type === "error" /* Protocol.Runtime.ConsoleAPICalledEventType.Error */ ||
            call.type === "assert" /* Protocol.Runtime.ConsoleAPICalledEventType.Assert */) {
            level = "error" /* Protocol.Log.LogEntryLevel.Error */;
        }
        else if (call.type === "warning" /* Protocol.Runtime.ConsoleAPICalledEventType.Warning */) {
            level = "warning" /* Protocol.Log.LogEntryLevel.Warning */;
        }
        else if (call.type === "info" /* Protocol.Runtime.ConsoleAPICalledEventType.Info */ ||
            call.type === "log" /* Protocol.Runtime.ConsoleAPICalledEventType.Log */) {
            level = "info" /* Protocol.Log.LogEntryLevel.Info */;
        }
        let message = '';
        if (call.args.length && call.args[0].unserializableValue) {
            message = call.args[0].unserializableValue;
        }
        else if (call.args.length &&
            ((typeof call.args[0].value !== 'object' && typeof call.args[0].value !== 'undefined') ||
                call.args[0].value === null)) {
            message = String(call.args[0].value);
        }
        else if (call.args.length && call.args[0].description) {
            message = call.args[0].description;
        }
        const callFrame = call.stackTrace?.callFrames.length ? call.stackTrace.callFrames[0] : null;
        const details = {
            type: call.type,
            url: callFrame?.url,
            line: callFrame?.lineNumber,
            column: callFrame?.columnNumber,
            parameters: call.args,
            stackTrace: call.stackTrace,
            timestamp: call.timestamp,
            executionContextId: call.executionContextId,
            context: call.context,
        };
        const consoleMessage = new ConsoleMessage(runtimeModel, Common.Console.FrontendMessageSource.ConsoleAPI, level, (message), details);
        for (const msg of __classPrivateFieldGet(this, _ConsoleModel_messagesByTimestamp, "f").get(consoleMessage.timestamp).values()) {
            if (consoleMessage.isEqual(msg)) {
                return;
            }
        }
        this.addMessage(consoleMessage);
    }
    queryObjectRequested(runtimeModel, event) {
        const { objects, executionContextId } = event.data;
        const details = {
            type: FrontendMessageType.QueryObjectResult,
            parameters: [objects],
            executionContextId,
        };
        const consoleMessage = new ConsoleMessage(runtimeModel, Common.Console.FrontendMessageSource.ConsoleAPI, "info" /* Protocol.Log.LogEntryLevel.Info */, '', details);
        this.addMessage(consoleMessage);
    }
    clearIfNecessary() {
        var _b;
        if (!Common.Settings.Settings.instance().moduleSetting('preserve-console-log').get()) {
            this.clear();
        }
        __classPrivateFieldSet(this, _ConsoleModel_pageLoadSequenceNumber, (_b = __classPrivateFieldGet(this, _ConsoleModel_pageLoadSequenceNumber, "f"), ++_b), "f");
    }
    primaryPageChanged(event) {
        if (Common.Settings.Settings.instance().moduleSetting('preserve-console-log').get()) {
            const { frame } = event.data;
            if (frame.backForwardCacheDetails.restoredFromCache) {
                Common.Console.Console.instance().log(i18nString(UIStrings.bfcacheNavigation, { PH1: frame.url }));
            }
            else {
                Common.Console.Console.instance().log(i18nString(UIStrings.navigatedToS, { PH1: frame.url }));
            }
        }
    }
    consoleProfileStarted(cpuProfilerModel, event) {
        const { data } = event;
        this.addConsoleProfileMessage(cpuProfilerModel, "profile" /* Protocol.Runtime.ConsoleAPICalledEventType.Profile */, data.scriptLocation, i18nString(UIStrings.profileSStarted, { PH1: data.title }));
    }
    consoleProfileFinished(cpuProfilerModel, event) {
        const { data } = event;
        this.addConsoleProfileMessage(cpuProfilerModel, "profileEnd" /* Protocol.Runtime.ConsoleAPICalledEventType.ProfileEnd */, data.scriptLocation, i18nString(UIStrings.profileSFinished, { PH1: data.title }));
    }
    addConsoleProfileMessage(cpuProfilerModel, type, scriptLocation, messageText) {
        const script = scriptLocation.script();
        const callFrames = [{
                functionName: '',
                scriptId: scriptLocation.scriptId,
                url: script ? script.contentURL() : '',
                lineNumber: scriptLocation.lineNumber,
                columnNumber: scriptLocation.columnNumber || 0,
            }];
        this.addMessage(new ConsoleMessage(cpuProfilerModel.runtimeModel(), Common.Console.FrontendMessageSource.ConsoleAPI, "info" /* Protocol.Log.LogEntryLevel.Info */, messageText, { type, stackTrace: { callFrames } }));
    }
    incrementErrorWarningCount(msg) {
        var _b, _c, _d;
        if (msg.source === "violation" /* Protocol.Log.LogEntrySource.Violation */) {
            __classPrivateFieldSet(this, _ConsoleModel_violationsInternal, (_b = __classPrivateFieldGet(this, _ConsoleModel_violationsInternal, "f"), _b++, _b), "f");
            return;
        }
        switch (msg.level) {
            case "warning" /* Protocol.Log.LogEntryLevel.Warning */:
                __classPrivateFieldSet(this, _ConsoleModel_warningsInternal, (_c = __classPrivateFieldGet(this, _ConsoleModel_warningsInternal, "f"), _c++, _c), "f");
                break;
            case "error" /* Protocol.Log.LogEntryLevel.Error */:
                __classPrivateFieldSet(this, _ConsoleModel_errorsInternal, (_d = __classPrivateFieldGet(this, _ConsoleModel_errorsInternal, "f"), _d++, _d), "f");
                break;
        }
    }
    messages() {
        return __classPrivateFieldGet(this, _ConsoleModel_messagesInternal, "f");
    }
    // messages[] are not ordered by timestamp.
    static allMessagesUnordered() {
        const messages = [];
        for (const target of TargetManager.instance().targets()) {
            const targetMessages = target.model(ConsoleModel)?.messages() || [];
            messages.push(...targetMessages);
        }
        return messages;
    }
    static requestClearMessages() {
        for (const logModel of TargetManager.instance().models(LogModel)) {
            logModel.requestClear();
        }
        for (const runtimeModel of TargetManager.instance().models(RuntimeModel)) {
            runtimeModel.discardConsoleEntries();
            // Runtime.discardConsoleEntries implies Runtime.releaseObjectGroup('console').
            runtimeModel.releaseObjectGroup('live-expression');
        }
        for (const target of TargetManager.instance().targets()) {
            target.model(ConsoleModel)?.clear();
        }
    }
    clear() {
        __classPrivateFieldSet(this, _ConsoleModel_messagesInternal, [], "f");
        __classPrivateFieldGet(this, _ConsoleModel_messagesByTimestamp, "f").clear();
        __classPrivateFieldGet(this, _ConsoleModel_messageByExceptionId, "f").clear();
        __classPrivateFieldSet(this, _ConsoleModel_errorsInternal, 0, "f");
        __classPrivateFieldSet(this, _ConsoleModel_warningsInternal, 0, "f");
        __classPrivateFieldSet(this, _ConsoleModel_violationsInternal, 0, "f");
        this.dispatchEventToListeners(Events.ConsoleCleared);
    }
    errors() {
        return __classPrivateFieldGet(this, _ConsoleModel_errorsInternal, "f");
    }
    static allErrors() {
        let errors = 0;
        for (const target of TargetManager.instance().targets()) {
            errors += target.model(ConsoleModel)?.errors() || 0;
        }
        return errors;
    }
    warnings() {
        return __classPrivateFieldGet(this, _ConsoleModel_warningsInternal, "f");
    }
    static allWarnings() {
        let warnings = 0;
        for (const target of TargetManager.instance().targets()) {
            warnings += target.model(ConsoleModel)?.warnings() || 0;
        }
        return warnings;
    }
    violations() {
        return __classPrivateFieldGet(this, _ConsoleModel_violationsInternal, "f");
    }
    async saveToTempVariable(currentExecutionContext, remoteObject) {
        if (!remoteObject || !currentExecutionContext) {
            failedToSave(null);
            return;
        }
        const executionContext = (currentExecutionContext);
        const result = await executionContext.globalObject(/* objectGroup */ '', /* generatePreview */ false);
        if ('error' in result || Boolean(result.exceptionDetails) || !result.object) {
            failedToSave('object' in result && result.object || null);
            return;
        }
        const globalObject = result.object;
        const callFunctionResult = await globalObject.callFunction(saveVariable, [RemoteObject.toCallArgument(remoteObject)]);
        globalObject.release();
        if (callFunctionResult.wasThrown || !callFunctionResult.object || callFunctionResult.object.type !== 'string') {
            failedToSave(callFunctionResult.object || null);
        }
        else {
            const text = callFunctionResult.object.value;
            const message = this.addCommandMessage(executionContext, text);
            void this.evaluateCommandInConsole(executionContext, message, text, /* useCommandLineAPI */ false);
        }
        if (callFunctionResult.object) {
            callFunctionResult.object.release();
        }
        function saveVariable(value) {
            const prefix = 'temp';
            let index = 1;
            while ((prefix + index) in this) {
                ++index;
            }
            const name = prefix + index;
            // @ts-expect-error Assignment to global object
            this[name] = value;
            return name;
        }
        function failedToSave(result) {
            let message = i18nString(UIStrings.failedToSaveToTempVariable);
            if (result) {
                message = message + ' ' + result.description;
            }
            Common.Console.Console.instance().error(message);
        }
    }
}
_ConsoleModel_messagesInternal = new WeakMap(), _ConsoleModel_messagesByTimestamp = new WeakMap(), _ConsoleModel_messageByExceptionId = new WeakMap(), _ConsoleModel_warningsInternal = new WeakMap(), _ConsoleModel_errorsInternal = new WeakMap(), _ConsoleModel_violationsInternal = new WeakMap(), _ConsoleModel_pageLoadSequenceNumber = new WeakMap(), _ConsoleModel_targetListeners = new WeakMap();
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["ConsoleCleared"] = "ConsoleCleared";
    Events["MessageAdded"] = "MessageAdded";
    Events["MessageUpdated"] = "MessageUpdated";
    Events["CommandEvaluated"] = "CommandEvaluated";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
function extractExceptionMetaData(metaData) {
    if (!metaData) {
        return undefined;
    }
    return { requestId: metaData.requestId || undefined, issueId: metaData.issueId || undefined };
}
function areAffectedResourcesEquivalent(a, b) {
    // Not considering issueId, as that would prevent de-duplication of console #messages.
    return a?.requestId === b?.requestId;
}
function areStackTracesEquivalent(stackTrace1, stackTrace2) {
    if (!stackTrace1 !== !stackTrace2) {
        return false;
    }
    if (!stackTrace1 || !stackTrace2) {
        return true;
    }
    const callFrames1 = stackTrace1.callFrames;
    const callFrames2 = stackTrace2.callFrames;
    if (callFrames1.length !== callFrames2.length) {
        return false;
    }
    for (let i = 0, n = callFrames1.length; i < n; ++i) {
        if (callFrames1[i].scriptId !== callFrames2[i].scriptId ||
            callFrames1[i].functionName !== callFrames2[i].functionName ||
            callFrames1[i].lineNumber !== callFrames2[i].lineNumber ||
            callFrames1[i].columnNumber !== callFrames2[i].columnNumber) {
            return false;
        }
    }
    return areStackTracesEquivalent(stackTrace1.parent, stackTrace2.parent);
}
export class ConsoleMessage {
    constructor(runtimeModel, source, level, messageText, details) {
        _ConsoleMessage_runtimeModelInternal.set(this, void 0);
        _ConsoleMessage_executionContextId.set(this, void 0);
        _ConsoleMessage_originatingConsoleMessage.set(this, null);
        _ConsoleMessage_pageLoadSequenceNumber.set(this, undefined);
        _ConsoleMessage_exceptionId.set(this, undefined);
        _ConsoleMessage_affectedResources.set(this, void 0);
        this.isCookieReportIssue = false;
        /**
         * The parent frame of the `console.log` call of logpoints or conditional breakpoints
         * if they called `console.*` explicitly. The parent frame is where V8 paused
         * and consequently where the logpoint is set.
         *
         * Is `null` for page console.logs, commands, command results, etc.
         */
        this.stackFrameWithBreakpoint = null;
        _ConsoleMessage_originatingBreakpointType.set(this, null);
        __classPrivateFieldSet(this, _ConsoleMessage_runtimeModelInternal, runtimeModel, "f");
        this.source = source;
        this.level = (level);
        this.messageText = messageText;
        this.type = details?.type || "log" /* Protocol.Runtime.ConsoleAPICalledEventType.Log */;
        this.url = details?.url;
        this.line = details?.line || 0;
        this.column = details?.column || 0;
        this.parameters = details?.parameters;
        this.stackTrace = details?.stackTrace;
        this.timestamp = details?.timestamp || Date.now();
        __classPrivateFieldSet(this, _ConsoleMessage_executionContextId, details?.executionContextId || 0, "f");
        this.scriptId = details?.scriptId;
        this.workerId = details?.workerId;
        __classPrivateFieldSet(this, _ConsoleMessage_affectedResources, details?.affectedResources, "f");
        this.category = details?.category;
        this.isCookieReportIssue = Boolean(details?.isCookieReportIssue);
        if (!__classPrivateFieldGet(this, _ConsoleMessage_executionContextId, "f") && __classPrivateFieldGet(this, _ConsoleMessage_runtimeModelInternal, "f")) {
            if (this.scriptId) {
                __classPrivateFieldSet(this, _ConsoleMessage_executionContextId, __classPrivateFieldGet(this, _ConsoleMessage_runtimeModelInternal, "f").executionContextIdForScriptId(this.scriptId), "f");
            }
            else if (this.stackTrace) {
                __classPrivateFieldSet(this, _ConsoleMessage_executionContextId, __classPrivateFieldGet(this, _ConsoleMessage_runtimeModelInternal, "f").executionContextForStackTrace(this.stackTrace), "f");
            }
        }
        if (details?.context) {
            const match = details?.context.match(/[^#]*/);
            this.context = match?.[0];
        }
        if (this.stackTrace) {
            const { callFrame, type } = __classPrivateFieldGet(_a, _a, "m", _ConsoleMessage_stackFrameWithBreakpoint).call(_a, this.stackTrace);
            this.stackFrameWithBreakpoint = callFrame;
            __classPrivateFieldSet(this, _ConsoleMessage_originatingBreakpointType, type, "f");
        }
    }
    getAffectedResources() {
        return __classPrivateFieldGet(this, _ConsoleMessage_affectedResources, "f");
    }
    setPageLoadSequenceNumber(pageLoadSequenceNumber) {
        __classPrivateFieldSet(this, _ConsoleMessage_pageLoadSequenceNumber, pageLoadSequenceNumber, "f");
    }
    static fromException(runtimeModel, exceptionDetails, messageType, timestamp, forceUrl, affectedResources) {
        const details = {
            type: messageType,
            url: forceUrl || exceptionDetails.url,
            line: exceptionDetails.lineNumber,
            column: exceptionDetails.columnNumber,
            parameters: exceptionDetails.exception ?
                [RemoteObject.fromLocalObject(exceptionDetails.text), exceptionDetails.exception] :
                undefined,
            stackTrace: exceptionDetails.stackTrace,
            timestamp,
            executionContextId: exceptionDetails.executionContextId,
            scriptId: exceptionDetails.scriptId,
            affectedResources,
        };
        return new _a(runtimeModel, "javascript" /* Protocol.Log.LogEntrySource.Javascript */, "error" /* Protocol.Log.LogEntryLevel.Error */, RuntimeModel.simpleTextFromException(exceptionDetails), details);
    }
    runtimeModel() {
        return __classPrivateFieldGet(this, _ConsoleMessage_runtimeModelInternal, "f");
    }
    target() {
        return __classPrivateFieldGet(this, _ConsoleMessage_runtimeModelInternal, "f") ? __classPrivateFieldGet(this, _ConsoleMessage_runtimeModelInternal, "f").target() : null;
    }
    setOriginatingMessage(originatingMessage) {
        __classPrivateFieldSet(this, _ConsoleMessage_originatingConsoleMessage, originatingMessage, "f");
        __classPrivateFieldSet(this, _ConsoleMessage_executionContextId, __classPrivateFieldGet(originatingMessage, _ConsoleMessage_executionContextId, "f"), "f");
    }
    originatingMessage() {
        return __classPrivateFieldGet(this, _ConsoleMessage_originatingConsoleMessage, "f");
    }
    setExecutionContextId(executionContextId) {
        __classPrivateFieldSet(this, _ConsoleMessage_executionContextId, executionContextId, "f");
    }
    getExecutionContextId() {
        return __classPrivateFieldGet(this, _ConsoleMessage_executionContextId, "f");
    }
    getExceptionId() {
        return __classPrivateFieldGet(this, _ConsoleMessage_exceptionId, "f");
    }
    setExceptionId(exceptionId) {
        __classPrivateFieldSet(this, _ConsoleMessage_exceptionId, exceptionId, "f");
    }
    isGroupMessage() {
        return this.type === "startGroup" /* Protocol.Runtime.ConsoleAPICalledEventType.StartGroup */ ||
            this.type === "startGroupCollapsed" /* Protocol.Runtime.ConsoleAPICalledEventType.StartGroupCollapsed */ ||
            this.type === "endGroup" /* Protocol.Runtime.ConsoleAPICalledEventType.EndGroup */;
    }
    isGroupStartMessage() {
        return this.type === "startGroup" /* Protocol.Runtime.ConsoleAPICalledEventType.StartGroup */ ||
            this.type === "startGroupCollapsed" /* Protocol.Runtime.ConsoleAPICalledEventType.StartGroupCollapsed */;
    }
    isErrorOrWarning() {
        return (this.level === "warning" /* Protocol.Log.LogEntryLevel.Warning */ || this.level === "error" /* Protocol.Log.LogEntryLevel.Error */);
    }
    isGroupable() {
        const isUngroupableError = this.level === "error" /* Protocol.Log.LogEntryLevel.Error */ &&
            (this.source === "javascript" /* Protocol.Log.LogEntrySource.Javascript */ || this.source === "network" /* Protocol.Log.LogEntrySource.Network */);
        return (this.source !== Common.Console.FrontendMessageSource.ConsoleAPI && this.type !== FrontendMessageType.Command &&
            this.type !== FrontendMessageType.Result && this.type !== FrontendMessageType.System && !isUngroupableError);
    }
    groupCategoryKey() {
        return [this.source, this.level, this.type, __classPrivateFieldGet(this, _ConsoleMessage_pageLoadSequenceNumber, "f")].join(':');
    }
    isEqual(msg) {
        if (!msg) {
            return false;
        }
        if (this.parameters) {
            if (!msg.parameters || this.parameters.length !== msg.parameters.length) {
                return false;
            }
            for (let i = 0; i < msg.parameters.length; ++i) {
                const msgParam = msg.parameters[i];
                const param = this.parameters[i];
                if (typeof msgParam === 'string' || typeof param === 'string') {
                    // TODO(chromium:1136435): Remove this case.
                    return false;
                }
                if (msgParam.type === 'object' && msgParam.subtype !== 'error') {
                    if (!msgParam.objectId || msgParam.objectId !== param.objectId || msg.timestamp !== this.timestamp) {
                        return false;
                    }
                }
                if (param.type !== msgParam.type || param.value !== msgParam.value ||
                    param.description !== msgParam.description) {
                    return false;
                }
            }
        }
        return (this.runtimeModel() === msg.runtimeModel()) && (this.source === msg.source) && (this.type === msg.type) &&
            (this.level === msg.level) && (this.line === msg.line) && (this.url === msg.url) &&
            (this.scriptId === msg.scriptId) && (this.messageText === msg.messageText) &&
            (__classPrivateFieldGet(this, _ConsoleMessage_executionContextId, "f") === __classPrivateFieldGet(msg, _ConsoleMessage_executionContextId, "f")) &&
            areAffectedResourcesEquivalent(__classPrivateFieldGet(this, _ConsoleMessage_affectedResources, "f"), __classPrivateFieldGet(msg, _ConsoleMessage_affectedResources, "f")) &&
            areStackTracesEquivalent(this.stackTrace, msg.stackTrace);
    }
    get originatesFromLogpoint() {
        return __classPrivateFieldGet(this, _ConsoleMessage_originatingBreakpointType, "f") === "LOGPOINT" /* BreakpointType.LOGPOINT */;
    }
    /** @returns true, iff this was a console.* call in a conditional breakpoint */
    get originatesFromConditionalBreakpoint() {
        return __classPrivateFieldGet(this, _ConsoleMessage_originatingBreakpointType, "f") === "CONDITIONAL_BREAKPOINT" /* BreakpointType.CONDITIONAL_BREAKPOINT */;
    }
}
_a = ConsoleMessage, _ConsoleMessage_runtimeModelInternal = new WeakMap(), _ConsoleMessage_executionContextId = new WeakMap(), _ConsoleMessage_originatingConsoleMessage = new WeakMap(), _ConsoleMessage_pageLoadSequenceNumber = new WeakMap(), _ConsoleMessage_exceptionId = new WeakMap(), _ConsoleMessage_affectedResources = new WeakMap(), _ConsoleMessage_originatingBreakpointType = new WeakMap(), _ConsoleMessage_stackFrameWithBreakpoint = function _ConsoleMessage_stackFrameWithBreakpoint({ callFrames }) {
    // Note that breakpoint condition code could in theory call into user JS and back into
    // "condition-defined" functions. This means that the top-most
    // stack frame is not necessarily the `console.log` call, but there could be other things
    // on top. We want the LAST marker frame in the stack.
    // We search FROM THE TOP for the last marked stack frame and
    // return it's parent (successor).
    const markerSourceUrls = [COND_BREAKPOINT_SOURCE_URL, LOGPOINT_SOURCE_URL];
    const lastBreakpointFrameIndex = callFrames.findLastIndex(({ url }) => markerSourceUrls.includes(url));
    if (lastBreakpointFrameIndex === -1 || lastBreakpointFrameIndex === callFrames.length - 1) {
        // We either didn't find any breakpoint or we didn't capture enough stack
        // frames and the breakpoint condition is the bottom-most frame.
        return { callFrame: null, type: null };
    }
    const type = callFrames[lastBreakpointFrameIndex].url === LOGPOINT_SOURCE_URL ?
        "LOGPOINT" /* BreakpointType.LOGPOINT */ :
        "CONDITIONAL_BREAKPOINT" /* BreakpointType.CONDITIONAL_BREAKPOINT */;
    return { callFrame: callFrames[lastBreakpointFrameIndex + 1], type };
};
SDKModel.register(ConsoleModel, { capabilities: 4 /* Capability.JS */, autostart: true });
export const MessageSourceDisplayName = new Map(([
    ["xml" /* Protocol.Log.LogEntrySource.XML */, 'xml'],
    ["javascript" /* Protocol.Log.LogEntrySource.Javascript */, 'javascript'],
    ["network" /* Protocol.Log.LogEntrySource.Network */, 'network'],
    [Common.Console.FrontendMessageSource.ConsoleAPI, 'console-api'],
    ["storage" /* Protocol.Log.LogEntrySource.Storage */, 'storage'],
    ["appcache" /* Protocol.Log.LogEntrySource.Appcache */, 'appcache'],
    ["rendering" /* Protocol.Log.LogEntrySource.Rendering */, 'rendering'],
    [Common.Console.FrontendMessageSource.CSS, 'css'],
    ["security" /* Protocol.Log.LogEntrySource.Security */, 'security'],
    ["deprecation" /* Protocol.Log.LogEntrySource.Deprecation */, 'deprecation'],
    ["worker" /* Protocol.Log.LogEntrySource.Worker */, 'worker'],
    ["violation" /* Protocol.Log.LogEntrySource.Violation */, 'violation'],
    ["intervention" /* Protocol.Log.LogEntrySource.Intervention */, 'intervention'],
    ["recommendation" /* Protocol.Log.LogEntrySource.Recommendation */, 'recommendation'],
    ["other" /* Protocol.Log.LogEntrySource.Other */, 'other'],
    [Common.Console.FrontendMessageSource.ISSUE_PANEL, 'issue-panel'],
]));
//# sourceMappingURL=ConsoleModel.js.map