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
var _CdpDialog_client;
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { Dialog } from '../api/Dialog.js';
/**
 * @internal
 */
export class CdpDialog extends Dialog {
    constructor(client, type, message, defaultValue = '') {
        super(type, message, defaultValue);
        _CdpDialog_client.set(this, void 0);
        __classPrivateFieldSet(this, _CdpDialog_client, client, "f");
    }
    async handle(options) {
        await __classPrivateFieldGet(this, _CdpDialog_client, "f").send('Page.handleJavaScriptDialog', {
            accept: options.accept,
            promptText: options.text,
        });
    }
}
_CdpDialog_client = new WeakMap();
//# sourceMappingURL=Dialog.js.map
//# sourceMappingURL=Dialog.js.map