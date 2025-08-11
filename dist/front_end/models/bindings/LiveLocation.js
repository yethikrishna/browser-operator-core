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
var _LiveLocationWithPool_updateDelegate, _LiveLocationWithPool_locationPool, _LiveLocationWithPool_updatePromise, _LiveLocationPool_locations;
export class LiveLocationWithPool {
    constructor(updateDelegate, locationPool) {
        _LiveLocationWithPool_updateDelegate.set(this, void 0);
        _LiveLocationWithPool_locationPool.set(this, void 0);
        _LiveLocationWithPool_updatePromise.set(this, void 0);
        __classPrivateFieldSet(this, _LiveLocationWithPool_updateDelegate, updateDelegate, "f");
        __classPrivateFieldSet(this, _LiveLocationWithPool_locationPool, locationPool, "f");
        __classPrivateFieldGet(this, _LiveLocationWithPool_locationPool, "f").add(this);
        __classPrivateFieldSet(this, _LiveLocationWithPool_updatePromise, null, "f");
    }
    async update() {
        if (!__classPrivateFieldGet(this, _LiveLocationWithPool_updateDelegate, "f")) {
            return;
        }
        // The following is a basic scheduling algorithm, guaranteeing that
        // {#updateDelegate} is always run atomically. That is, we always
        // wait for an update to finish before we trigger the next run.
        if (__classPrivateFieldGet(this, _LiveLocationWithPool_updatePromise, "f")) {
            await __classPrivateFieldGet(this, _LiveLocationWithPool_updatePromise, "f").then(() => this.update());
        }
        else {
            __classPrivateFieldSet(this, _LiveLocationWithPool_updatePromise, __classPrivateFieldGet(this, _LiveLocationWithPool_updateDelegate, "f").call(this, this), "f");
            await __classPrivateFieldGet(this, _LiveLocationWithPool_updatePromise, "f");
            __classPrivateFieldSet(this, _LiveLocationWithPool_updatePromise, null, "f");
        }
    }
    async uiLocation() {
        throw new Error('Not implemented');
    }
    dispose() {
        __classPrivateFieldGet(this, _LiveLocationWithPool_locationPool, "f").delete(this);
        __classPrivateFieldSet(this, _LiveLocationWithPool_updateDelegate, null, "f");
    }
    isDisposed() {
        return !__classPrivateFieldGet(this, _LiveLocationWithPool_locationPool, "f").has(this);
    }
    async isIgnoreListed() {
        throw new Error('Not implemented');
    }
}
_LiveLocationWithPool_updateDelegate = new WeakMap(), _LiveLocationWithPool_locationPool = new WeakMap(), _LiveLocationWithPool_updatePromise = new WeakMap();
export class LiveLocationPool {
    constructor() {
        _LiveLocationPool_locations.set(this, void 0);
        __classPrivateFieldSet(this, _LiveLocationPool_locations, new Set(), "f");
    }
    add(location) {
        __classPrivateFieldGet(this, _LiveLocationPool_locations, "f").add(location);
    }
    delete(location) {
        __classPrivateFieldGet(this, _LiveLocationPool_locations, "f").delete(location);
    }
    has(location) {
        return __classPrivateFieldGet(this, _LiveLocationPool_locations, "f").has(location);
    }
    disposeAll() {
        for (const location of __classPrivateFieldGet(this, _LiveLocationPool_locations, "f")) {
            location.dispose();
        }
    }
}
_LiveLocationPool_locations = new WeakMap();
//# sourceMappingURL=LiveLocation.js.map