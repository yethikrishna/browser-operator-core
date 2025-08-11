/*
 * Copyright (C) 2014 Google Inc. All rights reserved.
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
var _CPUProfilerModel_nextAnonymousConsoleProfileNumber, _CPUProfilerModel_anonymousConsoleProfileIdToTitle, _CPUProfilerModel_profilerAgent, _CPUProfilerModel_preciseCoverageDeltaUpdateCallback, _CPUProfilerModel_debuggerModelInternal;
import * as i18n from '../i18n/i18n.js';
import { DebuggerModel, Location } from './DebuggerModel.js';
import { SDKModel } from './SDKModel.js';
const UIStrings = {
    /**
     *@description Name of a profile. Placeholder is either a user-supplied name or a number automatically assigned to the profile.
     *@example {2} PH1
     */
    profileD: 'Profile {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/CPUProfilerModel.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class CPUProfilerModel extends SDKModel {
    constructor(target) {
        super(target);
        _CPUProfilerModel_nextAnonymousConsoleProfileNumber.set(this, void 0);
        _CPUProfilerModel_anonymousConsoleProfileIdToTitle.set(this, void 0);
        _CPUProfilerModel_profilerAgent.set(this, void 0);
        _CPUProfilerModel_preciseCoverageDeltaUpdateCallback.set(this, void 0);
        _CPUProfilerModel_debuggerModelInternal.set(this, void 0);
        this.registeredConsoleProfileMessages = [];
        __classPrivateFieldSet(this, _CPUProfilerModel_nextAnonymousConsoleProfileNumber, 1, "f");
        __classPrivateFieldSet(this, _CPUProfilerModel_anonymousConsoleProfileIdToTitle, new Map(), "f");
        __classPrivateFieldSet(this, _CPUProfilerModel_profilerAgent, target.profilerAgent(), "f");
        __classPrivateFieldSet(this, _CPUProfilerModel_preciseCoverageDeltaUpdateCallback, null, "f");
        target.registerProfilerDispatcher(this);
        void __classPrivateFieldGet(this, _CPUProfilerModel_profilerAgent, "f").invoke_enable();
        __classPrivateFieldSet(this, _CPUProfilerModel_debuggerModelInternal, target.model(DebuggerModel), "f");
    }
    runtimeModel() {
        return __classPrivateFieldGet(this, _CPUProfilerModel_debuggerModelInternal, "f").runtimeModel();
    }
    debuggerModel() {
        return __classPrivateFieldGet(this, _CPUProfilerModel_debuggerModelInternal, "f");
    }
    consoleProfileStarted({ id, location, title }) {
        var _a, _b;
        if (!title) {
            title = i18nString(UIStrings.profileD, { PH1: (__classPrivateFieldSet(this, _CPUProfilerModel_nextAnonymousConsoleProfileNumber, (_b = __classPrivateFieldGet(this, _CPUProfilerModel_nextAnonymousConsoleProfileNumber, "f"), _a = _b++, _b), "f"), _a) });
            __classPrivateFieldGet(this, _CPUProfilerModel_anonymousConsoleProfileIdToTitle, "f").set(id, title);
        }
        const eventData = this.createEventDataFrom(id, location, title);
        this.dispatchEventToListeners("ConsoleProfileStarted" /* Events.CONSOLE_PROFILE_STARTED */, eventData);
    }
    consoleProfileFinished({ id, location, profile, title }) {
        if (!title) {
            title = __classPrivateFieldGet(this, _CPUProfilerModel_anonymousConsoleProfileIdToTitle, "f").get(id);
            __classPrivateFieldGet(this, _CPUProfilerModel_anonymousConsoleProfileIdToTitle, "f").delete(id);
        }
        const eventData = {
            ...this.createEventDataFrom(id, location, title),
            cpuProfile: profile,
        };
        this.registeredConsoleProfileMessages.push(eventData);
        this.dispatchEventToListeners("ConsoleProfileFinished" /* Events.CONSOLE_PROFILE_FINISHED */, eventData);
    }
    createEventDataFrom(id, scriptLocation, title) {
        const debuggerLocation = Location.fromPayload(__classPrivateFieldGet(this, _CPUProfilerModel_debuggerModelInternal, "f"), scriptLocation);
        const globalId = this.target().id() + '.' + id;
        return {
            id: globalId,
            scriptLocation: debuggerLocation,
            title: title || '',
            cpuProfilerModel: this,
        };
    }
    startRecording() {
        const intervalUs = 100;
        void __classPrivateFieldGet(this, _CPUProfilerModel_profilerAgent, "f").invoke_setSamplingInterval({ interval: intervalUs });
        return __classPrivateFieldGet(this, _CPUProfilerModel_profilerAgent, "f").invoke_start();
    }
    stopRecording() {
        return __classPrivateFieldGet(this, _CPUProfilerModel_profilerAgent, "f").invoke_stop().then(response => response.profile || null);
    }
    startPreciseCoverage(jsCoveragePerBlock, preciseCoverageDeltaUpdateCallback) {
        const callCount = false;
        __classPrivateFieldSet(this, _CPUProfilerModel_preciseCoverageDeltaUpdateCallback, preciseCoverageDeltaUpdateCallback, "f");
        const allowUpdatesTriggeredByBackend = true;
        return __classPrivateFieldGet(this, _CPUProfilerModel_profilerAgent, "f").invoke_startPreciseCoverage({ callCount, detailed: jsCoveragePerBlock, allowTriggeredUpdates: allowUpdatesTriggeredByBackend });
    }
    async takePreciseCoverage() {
        const r = await __classPrivateFieldGet(this, _CPUProfilerModel_profilerAgent, "f").invoke_takePreciseCoverage();
        const timestamp = (r?.timestamp) || 0;
        const coverage = (r?.result) || [];
        return { timestamp, coverage };
    }
    stopPreciseCoverage() {
        __classPrivateFieldSet(this, _CPUProfilerModel_preciseCoverageDeltaUpdateCallback, null, "f");
        return __classPrivateFieldGet(this, _CPUProfilerModel_profilerAgent, "f").invoke_stopPreciseCoverage();
    }
    preciseCoverageDeltaUpdate({ timestamp, result }) {
        if (__classPrivateFieldGet(this, _CPUProfilerModel_preciseCoverageDeltaUpdateCallback, "f")) {
            void __classPrivateFieldGet(this, _CPUProfilerModel_preciseCoverageDeltaUpdateCallback, "f").call(this, timestamp, result);
        }
    }
}
_CPUProfilerModel_nextAnonymousConsoleProfileNumber = new WeakMap(), _CPUProfilerModel_anonymousConsoleProfileIdToTitle = new WeakMap(), _CPUProfilerModel_profilerAgent = new WeakMap(), _CPUProfilerModel_preciseCoverageDeltaUpdateCallback = new WeakMap(), _CPUProfilerModel_debuggerModelInternal = new WeakMap();
export var Events;
(function (Events) {
    Events["CONSOLE_PROFILE_STARTED"] = "ConsoleProfileStarted";
    Events["CONSOLE_PROFILE_FINISHED"] = "ConsoleProfileFinished";
})(Events || (Events = {}));
SDKModel.register(CPUProfilerModel, { capabilities: 4 /* Capability.JS */, autostart: true });
//# sourceMappingURL=CPUProfilerModel.js.map