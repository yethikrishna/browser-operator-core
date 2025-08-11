/*
 * Copyright (C) 2012 Google Inc. All rights reserved.
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
var _ChunkedFileReader_file, _ChunkedFileReader_fileSizeInternal, _ChunkedFileReader_loadedSizeInternal, _ChunkedFileReader_streamReader, _ChunkedFileReader_chunkSize, _ChunkedFileReader_chunkTransferredCallback, _ChunkedFileReader_decoder, _ChunkedFileReader_isCanceled, _ChunkedFileReader_errorInternal, _ChunkedFileReader_transferFinished, _ChunkedFileReader_output, _ChunkedFileReader_reader, _FileOutputStream_writeCallbacks, _FileOutputStream_fileName, _FileOutputStream_closed;
import * as Common from '../../core/common/common.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
export class ChunkedFileReader {
    constructor(file, chunkSize, chunkTransferredCallback) {
        _ChunkedFileReader_file.set(this, void 0);
        _ChunkedFileReader_fileSizeInternal.set(this, void 0);
        _ChunkedFileReader_loadedSizeInternal.set(this, void 0);
        _ChunkedFileReader_streamReader.set(this, void 0);
        _ChunkedFileReader_chunkSize.set(this, void 0);
        _ChunkedFileReader_chunkTransferredCallback.set(this, void 0);
        _ChunkedFileReader_decoder.set(this, void 0);
        _ChunkedFileReader_isCanceled.set(this, void 0);
        _ChunkedFileReader_errorInternal.set(this, void 0);
        _ChunkedFileReader_transferFinished.set(this, void 0);
        _ChunkedFileReader_output.set(this, void 0);
        _ChunkedFileReader_reader.set(this, void 0);
        __classPrivateFieldSet(this, _ChunkedFileReader_file, file, "f");
        __classPrivateFieldSet(this, _ChunkedFileReader_fileSizeInternal, file.size, "f");
        __classPrivateFieldSet(this, _ChunkedFileReader_loadedSizeInternal, 0, "f");
        __classPrivateFieldSet(this, _ChunkedFileReader_chunkSize, (chunkSize) ? chunkSize : Number.MAX_VALUE, "f");
        __classPrivateFieldSet(this, _ChunkedFileReader_chunkTransferredCallback, chunkTransferredCallback, "f");
        __classPrivateFieldSet(this, _ChunkedFileReader_decoder, new TextDecoder(), "f");
        __classPrivateFieldSet(this, _ChunkedFileReader_isCanceled, false, "f");
        __classPrivateFieldSet(this, _ChunkedFileReader_errorInternal, null, "f");
        __classPrivateFieldSet(this, _ChunkedFileReader_streamReader, null, "f");
    }
    async read(output) {
        if (__classPrivateFieldGet(this, _ChunkedFileReader_chunkTransferredCallback, "f")) {
            __classPrivateFieldGet(this, _ChunkedFileReader_chunkTransferredCallback, "f").call(this, this);
        }
        if (__classPrivateFieldGet(this, _ChunkedFileReader_file, "f")?.type.endsWith('gzip')) {
            const fileStream = __classPrivateFieldGet(this, _ChunkedFileReader_file, "f").stream();
            const stream = Common.Gzip.decompressStream(fileStream);
            __classPrivateFieldSet(this, _ChunkedFileReader_streamReader, stream.getReader(), "f");
        }
        else {
            __classPrivateFieldSet(this, _ChunkedFileReader_reader, new FileReader(), "f");
            __classPrivateFieldGet(this, _ChunkedFileReader_reader, "f").onload = this.onChunkLoaded.bind(this);
            __classPrivateFieldGet(this, _ChunkedFileReader_reader, "f").onerror = this.onError.bind(this);
        }
        __classPrivateFieldSet(this, _ChunkedFileReader_output, output, "f");
        void this.loadChunk();
        return await new Promise(resolve => {
            __classPrivateFieldSet(this, _ChunkedFileReader_transferFinished, resolve, "f");
        });
    }
    cancel() {
        __classPrivateFieldSet(this, _ChunkedFileReader_isCanceled, true, "f");
    }
    loadedSize() {
        return __classPrivateFieldGet(this, _ChunkedFileReader_loadedSizeInternal, "f");
    }
    fileSize() {
        return __classPrivateFieldGet(this, _ChunkedFileReader_fileSizeInternal, "f");
    }
    fileName() {
        if (!__classPrivateFieldGet(this, _ChunkedFileReader_file, "f")) {
            return '';
        }
        return __classPrivateFieldGet(this, _ChunkedFileReader_file, "f").name;
    }
    error() {
        return __classPrivateFieldGet(this, _ChunkedFileReader_errorInternal, "f");
    }
    onChunkLoaded(event) {
        if (__classPrivateFieldGet(this, _ChunkedFileReader_isCanceled, "f")) {
            return;
        }
        const eventTarget = event.target;
        if (eventTarget.readyState !== FileReader.DONE) {
            return;
        }
        if (!__classPrivateFieldGet(this, _ChunkedFileReader_reader, "f")) {
            return;
        }
        const buffer = __classPrivateFieldGet(this, _ChunkedFileReader_reader, "f").result;
        __classPrivateFieldSet(this, _ChunkedFileReader_loadedSizeInternal, __classPrivateFieldGet(this, _ChunkedFileReader_loadedSizeInternal, "f") + buffer.byteLength, "f");
        const endOfFile = __classPrivateFieldGet(this, _ChunkedFileReader_loadedSizeInternal, "f") === __classPrivateFieldGet(this, _ChunkedFileReader_fileSizeInternal, "f");
        void this.decodeChunkBuffer(buffer, endOfFile);
    }
    async decodeChunkBuffer(buffer, endOfFile) {
        if (!__classPrivateFieldGet(this, _ChunkedFileReader_output, "f")) {
            return;
        }
        const decodedString = __classPrivateFieldGet(this, _ChunkedFileReader_decoder, "f").decode(buffer, { stream: !endOfFile });
        await __classPrivateFieldGet(this, _ChunkedFileReader_output, "f").write(decodedString, endOfFile);
        if (__classPrivateFieldGet(this, _ChunkedFileReader_isCanceled, "f")) {
            return;
        }
        if (__classPrivateFieldGet(this, _ChunkedFileReader_chunkTransferredCallback, "f")) {
            __classPrivateFieldGet(this, _ChunkedFileReader_chunkTransferredCallback, "f").call(this, this);
        }
        if (endOfFile) {
            void this.finishRead();
            return;
        }
        void this.loadChunk();
    }
    async finishRead() {
        if (!__classPrivateFieldGet(this, _ChunkedFileReader_output, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _ChunkedFileReader_file, null, "f");
        __classPrivateFieldSet(this, _ChunkedFileReader_reader, null, "f");
        await __classPrivateFieldGet(this, _ChunkedFileReader_output, "f").close();
        __classPrivateFieldGet(this, _ChunkedFileReader_transferFinished, "f").call(this, !__classPrivateFieldGet(this, _ChunkedFileReader_errorInternal, "f"));
    }
    async loadChunk() {
        if (!__classPrivateFieldGet(this, _ChunkedFileReader_output, "f") || !__classPrivateFieldGet(this, _ChunkedFileReader_file, "f")) {
            return;
        }
        if (__classPrivateFieldGet(this, _ChunkedFileReader_streamReader, "f")) {
            const { value, done } = await __classPrivateFieldGet(this, _ChunkedFileReader_streamReader, "f").read();
            if (done || !value) {
                // Write empty string to inform of file end
                await __classPrivateFieldGet(this, _ChunkedFileReader_output, "f").write('', true);
                return await this.finishRead();
            }
            void this.decodeChunkBuffer(value.buffer, false);
        }
        if (__classPrivateFieldGet(this, _ChunkedFileReader_reader, "f")) {
            const chunkStart = __classPrivateFieldGet(this, _ChunkedFileReader_loadedSizeInternal, "f");
            const chunkEnd = Math.min(__classPrivateFieldGet(this, _ChunkedFileReader_fileSizeInternal, "f"), chunkStart + __classPrivateFieldGet(this, _ChunkedFileReader_chunkSize, "f"));
            const nextPart = __classPrivateFieldGet(this, _ChunkedFileReader_file, "f").slice(chunkStart, chunkEnd);
            __classPrivateFieldGet(this, _ChunkedFileReader_reader, "f").readAsArrayBuffer(nextPart);
        }
    }
    onError(event) {
        const eventTarget = event.target;
        __classPrivateFieldSet(this, _ChunkedFileReader_errorInternal, eventTarget.error, "f");
        __classPrivateFieldGet(this, _ChunkedFileReader_transferFinished, "f").call(this, false);
    }
}
_ChunkedFileReader_file = new WeakMap(), _ChunkedFileReader_fileSizeInternal = new WeakMap(), _ChunkedFileReader_loadedSizeInternal = new WeakMap(), _ChunkedFileReader_streamReader = new WeakMap(), _ChunkedFileReader_chunkSize = new WeakMap(), _ChunkedFileReader_chunkTransferredCallback = new WeakMap(), _ChunkedFileReader_decoder = new WeakMap(), _ChunkedFileReader_isCanceled = new WeakMap(), _ChunkedFileReader_errorInternal = new WeakMap(), _ChunkedFileReader_transferFinished = new WeakMap(), _ChunkedFileReader_output = new WeakMap(), _ChunkedFileReader_reader = new WeakMap();
export class FileOutputStream {
    constructor() {
        _FileOutputStream_writeCallbacks.set(this, void 0);
        _FileOutputStream_fileName.set(this, void 0);
        _FileOutputStream_closed.set(this, void 0);
        __classPrivateFieldSet(this, _FileOutputStream_writeCallbacks, [], "f");
    }
    async open(fileName) {
        __classPrivateFieldSet(this, _FileOutputStream_closed, false, "f");
        __classPrivateFieldSet(this, _FileOutputStream_writeCallbacks, [], "f");
        __classPrivateFieldSet(this, _FileOutputStream_fileName, fileName, "f");
        const saveResponse = await Workspace.FileManager.FileManager.instance().save(__classPrivateFieldGet(this, _FileOutputStream_fileName, "f"), TextUtils.ContentData.EMPTY_TEXT_CONTENT_DATA, /* forceSaveAs=*/ true);
        if (saveResponse) {
            Workspace.FileManager.FileManager.instance().addEventListener("AppendedToURL" /* Workspace.FileManager.Events.APPENDED_TO_URL */, this.onAppendDone, this);
        }
        return Boolean(saveResponse);
    }
    write(data) {
        return new Promise(resolve => {
            __classPrivateFieldGet(this, _FileOutputStream_writeCallbacks, "f").push(resolve);
            Workspace.FileManager.FileManager.instance().append(__classPrivateFieldGet(this, _FileOutputStream_fileName, "f"), data);
        });
    }
    async close() {
        __classPrivateFieldSet(this, _FileOutputStream_closed, true, "f");
        if (__classPrivateFieldGet(this, _FileOutputStream_writeCallbacks, "f").length) {
            return;
        }
        Workspace.FileManager.FileManager.instance().removeEventListener("AppendedToURL" /* Workspace.FileManager.Events.APPENDED_TO_URL */, this.onAppendDone, this);
        Workspace.FileManager.FileManager.instance().close(__classPrivateFieldGet(this, _FileOutputStream_fileName, "f"));
    }
    onAppendDone(event) {
        if (event.data !== __classPrivateFieldGet(this, _FileOutputStream_fileName, "f")) {
            return;
        }
        const writeCallback = __classPrivateFieldGet(this, _FileOutputStream_writeCallbacks, "f").shift();
        if (writeCallback) {
            writeCallback();
        }
        if (__classPrivateFieldGet(this, _FileOutputStream_writeCallbacks, "f").length) {
            return;
        }
        if (!__classPrivateFieldGet(this, _FileOutputStream_closed, "f")) {
            return;
        }
        Workspace.FileManager.FileManager.instance().removeEventListener("AppendedToURL" /* Workspace.FileManager.Events.APPENDED_TO_URL */, this.onAppendDone, this);
        Workspace.FileManager.FileManager.instance().close(__classPrivateFieldGet(this, _FileOutputStream_fileName, "f"));
    }
}
_FileOutputStream_writeCallbacks = new WeakMap(), _FileOutputStream_fileName = new WeakMap(), _FileOutputStream_closed = new WeakMap();
//# sourceMappingURL=FileUtils.js.map