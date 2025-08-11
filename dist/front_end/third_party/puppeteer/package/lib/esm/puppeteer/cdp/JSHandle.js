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
var _CdpJSHandle_disposed, _CdpJSHandle_remoteObject, _CdpJSHandle_world;
/**
 * @license
 * Copyright 2019 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { JSHandle } from '../api/JSHandle.js';
import { debugError } from '../common/util.js';
import { valueFromRemoteObject } from './utils.js';
/**
 * @internal
 */
export class CdpJSHandle extends JSHandle {
    constructor(world, remoteObject) {
        super();
        _CdpJSHandle_disposed.set(this, false);
        _CdpJSHandle_remoteObject.set(this, void 0);
        _CdpJSHandle_world.set(this, void 0);
        __classPrivateFieldSet(this, _CdpJSHandle_world, world, "f");
        __classPrivateFieldSet(this, _CdpJSHandle_remoteObject, remoteObject, "f");
    }
    get disposed() {
        return __classPrivateFieldGet(this, _CdpJSHandle_disposed, "f");
    }
    get realm() {
        return __classPrivateFieldGet(this, _CdpJSHandle_world, "f");
    }
    get client() {
        return this.realm.environment.client;
    }
    async jsonValue() {
        if (!__classPrivateFieldGet(this, _CdpJSHandle_remoteObject, "f").objectId) {
            return valueFromRemoteObject(__classPrivateFieldGet(this, _CdpJSHandle_remoteObject, "f"));
        }
        const value = await this.evaluate(object => {
            return object;
        });
        if (value === undefined) {
            throw new Error('Could not serialize referenced object');
        }
        return value;
    }
    /**
     * Either `null` or the handle itself if the handle is an
     * instance of {@link ElementHandle}.
     */
    asElement() {
        return null;
    }
    async dispose() {
        if (__classPrivateFieldGet(this, _CdpJSHandle_disposed, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _CdpJSHandle_disposed, true, "f");
        await releaseObject(this.client, __classPrivateFieldGet(this, _CdpJSHandle_remoteObject, "f"));
    }
    toString() {
        if (!__classPrivateFieldGet(this, _CdpJSHandle_remoteObject, "f").objectId) {
            return 'JSHandle:' + valueFromRemoteObject(__classPrivateFieldGet(this, _CdpJSHandle_remoteObject, "f"));
        }
        const type = __classPrivateFieldGet(this, _CdpJSHandle_remoteObject, "f").subtype || __classPrivateFieldGet(this, _CdpJSHandle_remoteObject, "f").type;
        return 'JSHandle@' + type;
    }
    get id() {
        return __classPrivateFieldGet(this, _CdpJSHandle_remoteObject, "f").objectId;
    }
    remoteObject() {
        return __classPrivateFieldGet(this, _CdpJSHandle_remoteObject, "f");
    }
    async getProperties() {
        // We use Runtime.getProperties rather than iterative version for
        // improved performance as it allows getting everything at once.
        const response = await this.client.send('Runtime.getProperties', {
            objectId: __classPrivateFieldGet(this, _CdpJSHandle_remoteObject, "f").objectId,
            ownProperties: true,
        });
        const result = new Map();
        for (const property of response.result) {
            if (!property.enumerable || !property.value) {
                continue;
            }
            result.set(property.name, __classPrivateFieldGet(this, _CdpJSHandle_world, "f").createCdpHandle(property.value));
        }
        return result;
    }
}
_CdpJSHandle_disposed = new WeakMap(), _CdpJSHandle_remoteObject = new WeakMap(), _CdpJSHandle_world = new WeakMap();
/**
 * @internal
 */
export async function releaseObject(client, remoteObject) {
    if (!remoteObject.objectId) {
        return;
    }
    await client
        .send('Runtime.releaseObject', { objectId: remoteObject.objectId })
        .catch(error => {
        // Exceptions might happen in case of a page been navigated or closed.
        // Swallow these since they are harmless and we don't leak anything in this case.
        debugError(error);
    });
}
//# sourceMappingURL=JSHandle.js.map
//# sourceMappingURL=JSHandle.js.map