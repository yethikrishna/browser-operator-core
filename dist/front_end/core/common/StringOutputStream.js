// Copyright 2015 The Chromium Authors. All rights reserved.
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
var _StringOutputStream_dataInternal;
export class StringOutputStream {
    constructor() {
        _StringOutputStream_dataInternal.set(this, void 0);
        __classPrivateFieldSet(this, _StringOutputStream_dataInternal, '', "f");
    }
    async write(chunk) {
        __classPrivateFieldSet(this, _StringOutputStream_dataInternal, __classPrivateFieldGet(this, _StringOutputStream_dataInternal, "f") + chunk, "f");
    }
    async close() {
    }
    data() {
        return __classPrivateFieldGet(this, _StringOutputStream_dataInternal, "f");
    }
}
_StringOutputStream_dataInternal = new WeakMap();
//# sourceMappingURL=StringOutputStream.js.map