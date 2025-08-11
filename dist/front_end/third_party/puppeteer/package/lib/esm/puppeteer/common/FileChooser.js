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
var _FileChooser_element, _FileChooser_multiple, _FileChooser_handled;
/**
 * @license
 * Copyright 2020 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { assert } from '../util/assert.js';
/**
 * File choosers let you react to the page requesting for a file.
 *
 * @remarks
 * `FileChooser` instances are returned via the {@link Page.waitForFileChooser} method.
 *
 * In browsers, only one file chooser can be opened at a time.
 * All file choosers must be accepted or canceled. Not doing so will prevent
 * subsequent file choosers from appearing.
 *
 * @example
 *
 * ```ts
 * const [fileChooser] = await Promise.all([
 *   page.waitForFileChooser(),
 *   page.click('#upload-file-button'), // some button that triggers file selection
 * ]);
 * await fileChooser.accept(['/tmp/myfile.pdf']);
 * ```
 *
 * @public
 */
export class FileChooser {
    /**
     * @internal
     */
    constructor(element, multiple) {
        _FileChooser_element.set(this, void 0);
        _FileChooser_multiple.set(this, void 0);
        _FileChooser_handled.set(this, false);
        __classPrivateFieldSet(this, _FileChooser_element, element, "f");
        __classPrivateFieldSet(this, _FileChooser_multiple, multiple, "f");
    }
    /**
     * Whether file chooser allow for
     * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-multiple | multiple}
     * file selection.
     */
    isMultiple() {
        return __classPrivateFieldGet(this, _FileChooser_multiple, "f");
    }
    /**
     * Accept the file chooser request with the given file paths.
     *
     * @remarks This will not validate whether the file paths exists. Also, if a
     * path is relative, then it is resolved against the
     * {@link https://nodejs.org/api/process.html#process_process_cwd | current working directory}.
     * For locals script connecting to remote chrome environments, paths must be
     * absolute.
     */
    async accept(paths) {
        assert(!__classPrivateFieldGet(this, _FileChooser_handled, "f"), 'Cannot accept FileChooser which is already handled!');
        __classPrivateFieldSet(this, _FileChooser_handled, true, "f");
        await __classPrivateFieldGet(this, _FileChooser_element, "f").uploadFile(...paths);
    }
    /**
     * Closes the file chooser without selecting any files.
     */
    async cancel() {
        assert(!__classPrivateFieldGet(this, _FileChooser_handled, "f"), 'Cannot cancel FileChooser which is already handled!');
        __classPrivateFieldSet(this, _FileChooser_handled, true, "f");
        // XXX: These events should converted to trusted events. Perhaps do this
        // in `DOM.setFileInputFiles`?
        await __classPrivateFieldGet(this, _FileChooser_element, "f").evaluate(element => {
            element.dispatchEvent(new Event('cancel', { bubbles: true }));
        });
    }
}
_FileChooser_element = new WeakMap(), _FileChooser_multiple = new WeakMap(), _FileChooser_handled = new WeakMap();
//# sourceMappingURL=FileChooser.js.map
//# sourceMappingURL=FileChooser.js.map