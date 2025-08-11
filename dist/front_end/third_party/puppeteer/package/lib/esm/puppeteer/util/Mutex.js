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
var _Mutex_locked, _Mutex_acquirers, _Guard_mutex, _Guard_onRelease;
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { Deferred } from './Deferred.js';
import { disposeSymbol } from './disposable.js';
/**
 * @internal
 */
export class Mutex {
    constructor() {
        _Mutex_locked.set(this, false);
        _Mutex_acquirers.set(this, []);
    }
    // This is FIFO.
    async acquire(onRelease) {
        if (!__classPrivateFieldGet(this, _Mutex_locked, "f")) {
            __classPrivateFieldSet(this, _Mutex_locked, true, "f");
            return new Mutex.Guard(this);
        }
        const deferred = Deferred.create();
        __classPrivateFieldGet(this, _Mutex_acquirers, "f").push(deferred.resolve.bind(deferred));
        await deferred.valueOrThrow();
        return new Mutex.Guard(this, onRelease);
    }
    release() {
        const resolve = __classPrivateFieldGet(this, _Mutex_acquirers, "f").shift();
        if (!resolve) {
            __classPrivateFieldSet(this, _Mutex_locked, false, "f");
            return;
        }
        resolve();
    }
}
_Mutex_locked = new WeakMap(), _Mutex_acquirers = new WeakMap();
Mutex.Guard = class Guard {
    constructor(mutex, onRelease) {
        _Guard_mutex.set(this, void 0);
        _Guard_onRelease.set(this, void 0);
        __classPrivateFieldSet(this, _Guard_mutex, mutex, "f");
        __classPrivateFieldSet(this, _Guard_onRelease, onRelease, "f");
    }
    [(_Guard_mutex = new WeakMap(), _Guard_onRelease = new WeakMap(), disposeSymbol)]() {
        __classPrivateFieldGet(this, _Guard_onRelease, "f")?.call(this);
        return __classPrivateFieldGet(this, _Guard_mutex, "f").release();
    }
};
//# sourceMappingURL=Mutex.js.map
//# sourceMappingURL=Mutex.js.map