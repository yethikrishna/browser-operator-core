// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _Mutex_instances, _Mutex_locked, _Mutex_acquirers, _Mutex_release;
/**
 * Use Mutex class to coordinate local concurrent operations.
 * Once `acquire` promise resolves, you hold the lock and must
 * call `release` function returned by `acquire` to release the
 * lock. Failing to `release` the lock may lead to deadlocks.
 */
export class Mutex {
    constructor() {
        _Mutex_instances.add(this);
        _Mutex_locked.set(this, false);
        _Mutex_acquirers.set(this, []);
    }
    // This is FIFO.
    acquire() {
        const state = { resolved: false };
        if (__classPrivateFieldGet(this, _Mutex_locked, "f")) {
            return new Promise(resolve => {
                __classPrivateFieldGet(this, _Mutex_acquirers, "f").push(() => resolve(__classPrivateFieldGet(this, _Mutex_instances, "m", _Mutex_release).bind(this, state)));
            });
        }
        __classPrivateFieldSet(this, _Mutex_locked, true, "f");
        return Promise.resolve(__classPrivateFieldGet(this, _Mutex_instances, "m", _Mutex_release).bind(this, state));
    }
    async run(action) {
        const release = await this.acquire();
        try {
            // Note we need to await here because we want the await to release AFTER
            // that await happens. Returning action() will trigger the release
            // immediately which is counter to what we want.
            const result = await action();
            return result;
        }
        finally {
            release();
        }
    }
}
_Mutex_locked = new WeakMap(), _Mutex_acquirers = new WeakMap(), _Mutex_instances = new WeakSet(), _Mutex_release = function _Mutex_release(state) {
    if (state.resolved) {
        throw new Error('Cannot release more than once.');
    }
    state.resolved = true;
    const resolve = __classPrivateFieldGet(this, _Mutex_acquirers, "f").shift();
    if (!resolve) {
        __classPrivateFieldSet(this, _Mutex_locked, false, "f");
        return;
    }
    resolve();
};
//# sourceMappingURL=Mutex.js.map