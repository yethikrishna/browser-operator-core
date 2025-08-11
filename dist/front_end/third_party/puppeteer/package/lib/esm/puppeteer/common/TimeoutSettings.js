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
var _TimeoutSettings_defaultTimeout, _TimeoutSettings_defaultNavigationTimeout;
/**
 * @license
 * Copyright 2019 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
const DEFAULT_TIMEOUT = 30000;
/**
 * @internal
 */
export class TimeoutSettings {
    constructor() {
        _TimeoutSettings_defaultTimeout.set(this, void 0);
        _TimeoutSettings_defaultNavigationTimeout.set(this, void 0);
        __classPrivateFieldSet(this, _TimeoutSettings_defaultTimeout, null, "f");
        __classPrivateFieldSet(this, _TimeoutSettings_defaultNavigationTimeout, null, "f");
    }
    setDefaultTimeout(timeout) {
        __classPrivateFieldSet(this, _TimeoutSettings_defaultTimeout, timeout, "f");
    }
    setDefaultNavigationTimeout(timeout) {
        __classPrivateFieldSet(this, _TimeoutSettings_defaultNavigationTimeout, timeout, "f");
    }
    navigationTimeout() {
        if (__classPrivateFieldGet(this, _TimeoutSettings_defaultNavigationTimeout, "f") !== null) {
            return __classPrivateFieldGet(this, _TimeoutSettings_defaultNavigationTimeout, "f");
        }
        if (__classPrivateFieldGet(this, _TimeoutSettings_defaultTimeout, "f") !== null) {
            return __classPrivateFieldGet(this, _TimeoutSettings_defaultTimeout, "f");
        }
        return DEFAULT_TIMEOUT;
    }
    timeout() {
        if (__classPrivateFieldGet(this, _TimeoutSettings_defaultTimeout, "f") !== null) {
            return __classPrivateFieldGet(this, _TimeoutSettings_defaultTimeout, "f");
        }
        return DEFAULT_TIMEOUT;
    }
}
_TimeoutSettings_defaultTimeout = new WeakMap(), _TimeoutSettings_defaultNavigationTimeout = new WeakMap();
//# sourceMappingURL=TimeoutSettings.js.map
//# sourceMappingURL=TimeoutSettings.js.map