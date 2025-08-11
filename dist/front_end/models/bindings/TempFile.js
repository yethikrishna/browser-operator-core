/*
 * Copyright (C) 2013 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
var _TempFile_lastBlob;
import * as Common from '../../core/common/common.js';
import { ChunkedFileReader } from './FileUtils.js';
export class TempFile {
    constructor() {
        _TempFile_lastBlob.set(this, void 0);
        __classPrivateFieldSet(this, _TempFile_lastBlob, null, "f");
    }
    write(pieces) {
        if (__classPrivateFieldGet(this, _TempFile_lastBlob, "f")) {
            pieces.unshift(__classPrivateFieldGet(this, _TempFile_lastBlob, "f"));
        }
        __classPrivateFieldSet(this, _TempFile_lastBlob, new Blob(pieces, { type: 'text/plain' }), "f");
    }
    read() {
        return this.readRange();
    }
    size() {
        return __classPrivateFieldGet(this, _TempFile_lastBlob, "f") ? __classPrivateFieldGet(this, _TempFile_lastBlob, "f").size : 0;
    }
    async readRange(startOffset, endOffset) {
        if (!__classPrivateFieldGet(this, _TempFile_lastBlob, "f")) {
            Common.Console.Console.instance().error('Attempt to read a temp file that was never written');
            return '';
        }
        const blob = typeof startOffset === 'number' || typeof endOffset === 'number' ?
            __classPrivateFieldGet(this, _TempFile_lastBlob, "f").slice(startOffset, endOffset) :
            __classPrivateFieldGet(this, _TempFile_lastBlob, "f");
        const reader = new FileReader();
        try {
            await new Promise((resolve, reject) => {
                reader.onloadend = resolve;
                reader.onerror = reject;
                reader.readAsText(blob);
            });
        }
        catch (error) {
            Common.Console.Console.instance().error('Failed to read from temp file: ' + error.message);
        }
        return reader.result;
    }
    async copyToOutputStream(outputStream, progress) {
        if (!__classPrivateFieldGet(this, _TempFile_lastBlob, "f")) {
            void outputStream.close();
            return null;
        }
        const reader = new ChunkedFileReader(__classPrivateFieldGet(this, _TempFile_lastBlob, "f"), 10 * 1000 * 1000, progress);
        return await reader.read(outputStream).then(success => success ? null : reader.error());
    }
    remove() {
        __classPrivateFieldSet(this, _TempFile_lastBlob, null, "f");
    }
}
_TempFile_lastBlob = new WeakMap();
//# sourceMappingURL=TempFile.js.map