/*
 * Copyright (C) 2014 Google Inc. All rights reserved.
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
var _WorkerWrapper_workerPromise, _WorkerWrapper_disposed;
export class WorkerWrapper {
    constructor(workerLocation) {
        _WorkerWrapper_workerPromise.set(this, void 0);
        _WorkerWrapper_disposed.set(this, void 0);
        __classPrivateFieldSet(this, _WorkerWrapper_workerPromise, new Promise(fulfill => {
            const worker = new Worker(workerLocation, { type: 'module' });
            worker.onmessage = (event) => {
                console.assert(event.data === 'workerReady');
                worker.onmessage = null;
                fulfill(worker);
            };
        }), "f");
    }
    static fromURL(url) {
        return new WorkerWrapper(url);
    }
    postMessage(message, transfer) {
        void __classPrivateFieldGet(this, _WorkerWrapper_workerPromise, "f").then(worker => {
            if (!__classPrivateFieldGet(this, _WorkerWrapper_disposed, "f")) {
                worker.postMessage(message, transfer ?? []);
            }
        });
    }
    dispose() {
        __classPrivateFieldSet(this, _WorkerWrapper_disposed, true, "f");
        void __classPrivateFieldGet(this, _WorkerWrapper_workerPromise, "f").then(worker => worker.terminate());
    }
    terminate() {
        this.dispose();
    }
    set onmessage(listener) {
        void __classPrivateFieldGet(this, _WorkerWrapper_workerPromise, "f").then(worker => {
            worker.onmessage = listener;
        });
    }
    set onerror(listener) {
        void __classPrivateFieldGet(this, _WorkerWrapper_workerPromise, "f").then(worker => {
            worker.onerror = listener;
        });
    }
}
_WorkerWrapper_workerPromise = new WeakMap(), _WorkerWrapper_disposed = new WeakMap();
//# sourceMappingURL=Worker.js.map