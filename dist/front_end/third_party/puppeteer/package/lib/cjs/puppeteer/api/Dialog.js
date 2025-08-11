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
var _Dialog_type, _Dialog_message, _Dialog_defaultValue;
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialog = void 0;
const assert_js_1 = require("../util/assert.js");
/**
 * Dialog instances are dispatched by the {@link Page} via the `dialog` event.
 *
 * @remarks
 *
 * @example
 *
 * ```ts
 * import puppeteer from 'puppeteer';
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   page.on('dialog', async dialog => {
 *     console.log(dialog.message());
 *     await dialog.dismiss();
 *     await browser.close();
 *   });
 *   page.evaluate(() => alert('1'));
 * })();
 * ```
 *
 * @public
 */
class Dialog {
    /**
     * @internal
     */
    constructor(type, message, defaultValue = '') {
        _Dialog_type.set(this, void 0);
        _Dialog_message.set(this, void 0);
        _Dialog_defaultValue.set(this, void 0);
        /**
         * @internal
         */
        this.handled = false;
        __classPrivateFieldSet(this, _Dialog_type, type, "f");
        __classPrivateFieldSet(this, _Dialog_message, message, "f");
        __classPrivateFieldSet(this, _Dialog_defaultValue, defaultValue, "f");
    }
    /**
     * The type of the dialog.
     */
    type() {
        return __classPrivateFieldGet(this, _Dialog_type, "f");
    }
    /**
     * The message displayed in the dialog.
     */
    message() {
        return __classPrivateFieldGet(this, _Dialog_message, "f");
    }
    /**
     * The default value of the prompt, or an empty string if the dialog
     * is not a `prompt`.
     */
    defaultValue() {
        return __classPrivateFieldGet(this, _Dialog_defaultValue, "f");
    }
    /**
     * A promise that resolves when the dialog has been accepted.
     *
     * @param promptText - optional text that will be entered in the dialog
     * prompt. Has no effect if the dialog's type is not `prompt`.
     *
     */
    async accept(promptText) {
        (0, assert_js_1.assert)(!this.handled, 'Cannot accept dialog which is already handled!');
        this.handled = true;
        await this.handle({
            accept: true,
            text: promptText,
        });
    }
    /**
     * A promise which will resolve once the dialog has been dismissed
     */
    async dismiss() {
        (0, assert_js_1.assert)(!this.handled, 'Cannot dismiss dialog which is already handled!');
        this.handled = true;
        await this.handle({
            accept: false,
        });
    }
}
_Dialog_type = new WeakMap(), _Dialog_message = new WeakMap(), _Dialog_defaultValue = new WeakMap();
exports.Dialog = Dialog;
//# sourceMappingURL=Dialog.js.map