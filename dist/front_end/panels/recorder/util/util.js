// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _a, _InjectedScript_injectedScript;
import * as SharedObject from './SharedObject.js';
// Setting this to `true` enables extra logging for the injected scripts.
const isDebugBuild = false;
const DEVTOOLS_RECORDER_WORLD_NAME = 'devtools_recorder';
class InjectedScript {
    static async get() {
        if (!__classPrivateFieldGet(this, _a, "f", _InjectedScript_injectedScript)) {
            __classPrivateFieldSet(this, _a, (await fetch(new URL('../injected/injected.generated.js', import.meta.url)))
                .text(), "f", _InjectedScript_injectedScript);
        }
        return await __classPrivateFieldGet(this, _a, "f", _InjectedScript_injectedScript);
    }
}
_a = InjectedScript;
_InjectedScript_injectedScript = { value: void 0 };
export { DEVTOOLS_RECORDER_WORLD_NAME, InjectedScript, isDebugBuild, SharedObject };
//# sourceMappingURL=util.js.map