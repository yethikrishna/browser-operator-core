// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ResolverBase_unresolvedIds;
/**
 * A class that facilitates resolving a id to an object of type T. If the id does not yet resolve, a promise
 * is created that gets resolved once `onResolve` is called with the corresponding id.
 *
 * This class enables clients to control the duration of the wait and the lifetime of the associated
 * promises by using the `clear` method on this class.
 */
export class ResolverBase {
    constructor() {
        _ResolverBase_unresolvedIds.set(this, new Map());
    }
    /**
     * Returns a promise that resolves once the `id` can be resolved to an object.
     */
    async waitFor(id) {
        const obj = this.getForId(id);
        if (!obj) {
            return await this.getOrCreatePromise(id);
        }
        return obj;
    }
    /**
     * Resolve the `id`. Returns the object immediately if it can be resolved,
     * and otherwise waits for the object to appear and calls `callback` once
     * it is resolved.
     */
    tryGet(id, callback) {
        const obj = this.getForId(id);
        if (!obj) {
            const swallowTheError = () => { };
            void this.getOrCreatePromise(id).catch(swallowTheError).then(obj => {
                if (obj) {
                    callback(obj);
                }
            });
            return null;
        }
        return obj;
    }
    /**
     * Aborts all waiting and rejects all unresolved promises.
     */
    clear() {
        this.stopListening();
        for (const [id, { reject }] of __classPrivateFieldGet(this, _ResolverBase_unresolvedIds, "f").entries()) {
            reject(new Error(`Object with ${id} never resolved.`));
        }
        __classPrivateFieldGet(this, _ResolverBase_unresolvedIds, "f").clear();
    }
    getOrCreatePromise(id) {
        const promiseInfo = __classPrivateFieldGet(this, _ResolverBase_unresolvedIds, "f").get(id);
        if (promiseInfo) {
            return promiseInfo.promise;
        }
        const { resolve, reject, promise } = Promise.withResolvers();
        __classPrivateFieldGet(this, _ResolverBase_unresolvedIds, "f").set(id, { promise, resolve, reject });
        this.startListening();
        return promise;
    }
    onResolve(id, t) {
        const promiseInfo = __classPrivateFieldGet(this, _ResolverBase_unresolvedIds, "f").get(id);
        __classPrivateFieldGet(this, _ResolverBase_unresolvedIds, "f").delete(id);
        if (__classPrivateFieldGet(this, _ResolverBase_unresolvedIds, "f").size === 0) {
            this.stopListening();
        }
        promiseInfo?.resolve(t);
    }
}
_ResolverBase_unresolvedIds = new WeakMap();
//# sourceMappingURL=ResolverBase.js.map