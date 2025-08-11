/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
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
var _BidiDialog_prompt;
import { Dialog } from '../api/Dialog.js';
export class BidiDialog extends Dialog {
    static from(prompt) {
        return new BidiDialog(prompt);
    }
    constructor(prompt) {
        super(prompt.info.type, prompt.info.message, prompt.info.defaultValue);
        _BidiDialog_prompt.set(this, void 0);
        __classPrivateFieldSet(this, _BidiDialog_prompt, prompt, "f");
        this.handled = prompt.handled;
    }
    async handle(options) {
        await __classPrivateFieldGet(this, _BidiDialog_prompt, "f").handle({
            accept: options.accept,
            userText: options.text,
        });
    }
}
_BidiDialog_prompt = new WeakMap();
//# sourceMappingURL=Dialog.js.map