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
var _Throttler_instances, _Throttler_timeout, _Throttler_isRunningProcess, _Throttler_asSoonAsPossible, _Throttler_process, _Throttler_lastCompleteTime, _Throttler_scheduler, _Throttler_processTimeout, _Throttler_processCompleted, _Throttler_onTimeout, _Throttler_schedule, _Throttler_getTime;
export class Throttler {
    constructor(timeout) {
        _Throttler_instances.add(this);
        _Throttler_timeout.set(this, void 0);
        _Throttler_isRunningProcess.set(this, void 0);
        _Throttler_asSoonAsPossible.set(this, void 0);
        _Throttler_process.set(this, void 0);
        _Throttler_lastCompleteTime.set(this, void 0);
        _Throttler_scheduler.set(this, Promise.withResolvers());
        _Throttler_processTimeout.set(this, void 0);
        __classPrivateFieldSet(this, _Throttler_timeout, timeout, "f");
        __classPrivateFieldSet(this, _Throttler_isRunningProcess, false, "f");
        __classPrivateFieldSet(this, _Throttler_asSoonAsPossible, false, "f");
        __classPrivateFieldSet(this, _Throttler_process, null, "f");
        __classPrivateFieldSet(this, _Throttler_lastCompleteTime, 0, "f");
    }
    get process() {
        return __classPrivateFieldGet(this, _Throttler_process, "f");
    }
    get processCompleted() {
        return __classPrivateFieldGet(this, _Throttler_process, "f") ? __classPrivateFieldGet(this, _Throttler_scheduler, "f").promise : null;
    }
    async schedule(process, scheduling = "Default" /* Scheduling.DEFAULT */) {
        // Deliberately skip previous #process.
        __classPrivateFieldSet(this, _Throttler_process, process, "f");
        // Run the first scheduled task instantly.
        const hasScheduledTasks = Boolean(__classPrivateFieldGet(this, _Throttler_processTimeout, "f")) || __classPrivateFieldGet(this, _Throttler_isRunningProcess, "f");
        const okToFire = __classPrivateFieldGet(this, _Throttler_instances, "m", _Throttler_getTime).call(this) - __classPrivateFieldGet(this, _Throttler_lastCompleteTime, "f") > __classPrivateFieldGet(this, _Throttler_timeout, "f");
        const asSoonAsPossible = scheduling === "AsSoonAsPossible" /* Scheduling.AS_SOON_AS_POSSIBLE */ ||
            (scheduling === "Default" /* Scheduling.DEFAULT */ && !hasScheduledTasks && okToFire);
        const forceTimerUpdate = asSoonAsPossible && !__classPrivateFieldGet(this, _Throttler_asSoonAsPossible, "f");
        __classPrivateFieldSet(this, _Throttler_asSoonAsPossible, __classPrivateFieldGet(this, _Throttler_asSoonAsPossible, "f") || asSoonAsPossible, "f");
        __classPrivateFieldGet(this, _Throttler_instances, "m", _Throttler_schedule).call(this, forceTimerUpdate);
        await __classPrivateFieldGet(this, _Throttler_scheduler, "f").promise;
    }
}
_Throttler_timeout = new WeakMap(), _Throttler_isRunningProcess = new WeakMap(), _Throttler_asSoonAsPossible = new WeakMap(), _Throttler_process = new WeakMap(), _Throttler_lastCompleteTime = new WeakMap(), _Throttler_scheduler = new WeakMap(), _Throttler_processTimeout = new WeakMap(), _Throttler_instances = new WeakSet(), _Throttler_processCompleted = function _Throttler_processCompleted() {
    __classPrivateFieldSet(this, _Throttler_lastCompleteTime, __classPrivateFieldGet(this, _Throttler_instances, "m", _Throttler_getTime).call(this), "f");
    __classPrivateFieldSet(this, _Throttler_isRunningProcess, false, "f");
    if (__classPrivateFieldGet(this, _Throttler_process, "f")) {
        __classPrivateFieldGet(this, _Throttler_instances, "m", _Throttler_schedule).call(this, false);
    }
}, _Throttler_onTimeout = function _Throttler_onTimeout() {
    __classPrivateFieldSet(this, _Throttler_processTimeout, undefined, "f");
    __classPrivateFieldSet(this, _Throttler_asSoonAsPossible, false, "f");
    __classPrivateFieldSet(this, _Throttler_isRunningProcess, true, "f");
    void Promise.resolve()
        .then(__classPrivateFieldGet(this, _Throttler_process, "f"))
        .catch(console.error.bind(console))
        .then(__classPrivateFieldGet(this, _Throttler_instances, "m", _Throttler_processCompleted).bind(this))
        .then(__classPrivateFieldGet(this, _Throttler_scheduler, "f").resolve);
    __classPrivateFieldSet(this, _Throttler_scheduler, Promise.withResolvers(), "f");
    __classPrivateFieldSet(this, _Throttler_process, null, "f");
}, _Throttler_schedule = function _Throttler_schedule(forceTimerUpdate) {
    if (__classPrivateFieldGet(this, _Throttler_isRunningProcess, "f")) {
        return;
    }
    if (__classPrivateFieldGet(this, _Throttler_processTimeout, "f") && !forceTimerUpdate) {
        return;
    }
    clearTimeout(__classPrivateFieldGet(this, _Throttler_processTimeout, "f"));
    const timeout = __classPrivateFieldGet(this, _Throttler_asSoonAsPossible, "f") ? 0 : __classPrivateFieldGet(this, _Throttler_timeout, "f");
    __classPrivateFieldSet(this, _Throttler_processTimeout, window.setTimeout(__classPrivateFieldGet(this, _Throttler_instances, "m", _Throttler_onTimeout).bind(this), timeout), "f");
}, _Throttler_getTime = function _Throttler_getTime() {
    return window.performance.now();
};
export var Scheduling;
(function (Scheduling) {
    // If the throttler has run another task recently (i.e. time since the last run is less then the
    // throttling delay), schedule the task to be run after the throttling delay. Otherwise scheule
    // the task after the next tick.
    Scheduling["DEFAULT"] = "Default";
    // Schedule the task to run at the next tick, even if the throttler has run another task recently.
    Scheduling["AS_SOON_AS_POSSIBLE"] = "AsSoonAsPossible";
    // Schedule the task to run after the throttling delay, even if the throttler has not run any
    // task recently.
    Scheduling["DELAYED"] = "Delayed";
})(Scheduling || (Scheduling = {}));
//# sourceMappingURL=Throttler.js.map