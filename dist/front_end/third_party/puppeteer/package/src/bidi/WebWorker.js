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
var _BidiWebWorker_frame, _BidiWebWorker_realm;
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { WebWorker } from '../api/WebWorker.js';
import { UnsupportedOperation } from '../common/Errors.js';
import { BidiWorkerRealm } from './Realm.js';
/**
 * @internal
 */
export class BidiWebWorker extends WebWorker {
    static from(frame, realm) {
        const worker = new BidiWebWorker(frame, realm);
        return worker;
    }
    constructor(frame, realm) {
        super(realm.origin);
        _BidiWebWorker_frame.set(this, void 0);
        _BidiWebWorker_realm.set(this, void 0);
        __classPrivateFieldSet(this, _BidiWebWorker_frame, frame, "f");
        __classPrivateFieldSet(this, _BidiWebWorker_realm, BidiWorkerRealm.from(realm, this), "f");
    }
    get frame() {
        return __classPrivateFieldGet(this, _BidiWebWorker_frame, "f");
    }
    mainRealm() {
        return __classPrivateFieldGet(this, _BidiWebWorker_realm, "f");
    }
    get client() {
        throw new UnsupportedOperation();
    }
}
_BidiWebWorker_frame = new WeakMap(), _BidiWebWorker_realm = new WeakMap();
//# sourceMappingURL=WebWorker.js.map