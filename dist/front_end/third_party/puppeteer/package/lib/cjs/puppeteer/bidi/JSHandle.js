"use strict";
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
var _BidiJSHandle_remoteValue, _BidiJSHandle_disposed;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidiJSHandle = void 0;
const JSHandle_js_1 = require("../api/JSHandle.js");
const Errors_js_1 = require("../common/Errors.js");
const Deserializer_js_1 = require("./Deserializer.js");
/**
 * @internal
 */
class BidiJSHandle extends JSHandle_js_1.JSHandle {
    static from(value, realm) {
        return new BidiJSHandle(value, realm);
    }
    constructor(value, realm) {
        super();
        _BidiJSHandle_remoteValue.set(this, void 0);
        _BidiJSHandle_disposed.set(this, false);
        __classPrivateFieldSet(this, _BidiJSHandle_remoteValue, value, "f");
        this.realm = realm;
    }
    get disposed() {
        return __classPrivateFieldGet(this, _BidiJSHandle_disposed, "f");
    }
    async jsonValue() {
        return await this.evaluate(value => {
            return value;
        });
    }
    asElement() {
        return null;
    }
    async dispose() {
        if (__classPrivateFieldGet(this, _BidiJSHandle_disposed, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _BidiJSHandle_disposed, true, "f");
        await this.realm.destroyHandles([this]);
    }
    get isPrimitiveValue() {
        switch (__classPrivateFieldGet(this, _BidiJSHandle_remoteValue, "f").type) {
            case 'string':
            case 'number':
            case 'bigint':
            case 'boolean':
            case 'undefined':
            case 'null':
                return true;
            default:
                return false;
        }
    }
    toString() {
        if (this.isPrimitiveValue) {
            return 'JSHandle:' + Deserializer_js_1.BidiDeserializer.deserialize(__classPrivateFieldGet(this, _BidiJSHandle_remoteValue, "f"));
        }
        return 'JSHandle@' + __classPrivateFieldGet(this, _BidiJSHandle_remoteValue, "f").type;
    }
    get id() {
        return 'handle' in __classPrivateFieldGet(this, _BidiJSHandle_remoteValue, "f") ? __classPrivateFieldGet(this, _BidiJSHandle_remoteValue, "f").handle : undefined;
    }
    remoteValue() {
        return __classPrivateFieldGet(this, _BidiJSHandle_remoteValue, "f");
    }
    remoteObject() {
        throw new Errors_js_1.UnsupportedOperation('Not available in WebDriver BiDi');
    }
}
_BidiJSHandle_remoteValue = new WeakMap(), _BidiJSHandle_disposed = new WeakMap();
exports.BidiJSHandle = BidiJSHandle;
//# sourceMappingURL=JSHandle.js.map