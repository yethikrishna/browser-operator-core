/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
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
var _HeapSnapshotWorkerDispatcher_objects, _HeapSnapshotWorkerDispatcher_postMessage;
import * as HeapSnapshotModel from '../../models/heap_snapshot_model/heap_snapshot_model.js';
// We mirror what heap_snapshot_worker.ts does, but we can't use it here as we'd have a
// cyclic GN dependency otherwise.
import * as AllocationProfile from './AllocationProfile.js';
import * as HeapSnapshot from './HeapSnapshot.js';
import * as HeapSnapshotLoader from './HeapSnapshotLoader.js';
export class HeapSnapshotWorkerDispatcher {
    constructor(postMessage) {
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _HeapSnapshotWorkerDispatcher_objects.set(this, void 0);
        _HeapSnapshotWorkerDispatcher_postMessage.set(this, void 0);
        __classPrivateFieldSet(this, _HeapSnapshotWorkerDispatcher_objects, [], "f");
        __classPrivateFieldSet(this, _HeapSnapshotWorkerDispatcher_postMessage, postMessage, "f");
    }
    sendEvent(name, data) {
        __classPrivateFieldGet(this, _HeapSnapshotWorkerDispatcher_postMessage, "f").call(this, { eventName: name, data });
    }
    async dispatchMessage({ data, ports }) {
        const response = { callId: data.callId, result: null, error: undefined, errorCallStack: undefined, errorMethodName: undefined };
        try {
            switch (data.disposition) {
                case 'createLoader':
                    __classPrivateFieldGet(this, _HeapSnapshotWorkerDispatcher_objects, "f")[data.objectId] = new HeapSnapshotLoader.HeapSnapshotLoader(this);
                    break;
                case 'dispose': {
                    delete __classPrivateFieldGet(this, _HeapSnapshotWorkerDispatcher_objects, "f")[data.objectId];
                    break;
                }
                case 'getter': {
                    const object = __classPrivateFieldGet(this, _HeapSnapshotWorkerDispatcher_objects, "f")[data.objectId];
                    const result = object[data.methodName];
                    response.result = result;
                    break;
                }
                case 'factory': {
                    const object = __classPrivateFieldGet(this, _HeapSnapshotWorkerDispatcher_objects, "f")[data.objectId];
                    const args = data.methodArguments.slice();
                    args.push(...ports);
                    const result = await object[data.methodName].apply(object, args);
                    if (result) {
                        __classPrivateFieldGet(this, _HeapSnapshotWorkerDispatcher_objects, "f")[data.newObjectId] = result;
                    }
                    response.result = Boolean(result);
                    break;
                }
                case 'method': {
                    const object = __classPrivateFieldGet(this, _HeapSnapshotWorkerDispatcher_objects, "f")[data.objectId];
                    response.result = object[data.methodName].apply(object, data.methodArguments);
                    break;
                }
                case 'evaluateForTest': {
                    try {
                        // Make 'HeapSnapshotWorker' and 'HeapSnapshotModel' available to web tests. 'eval' can't use 'import'.
                        // @ts-expect-error
                        globalThis.HeapSnapshotWorker = {
                            AllocationProfile,
                            HeapSnapshot,
                            HeapSnapshotLoader,
                        };
                        // @ts-expect-error
                        globalThis.HeapSnapshotModel = HeapSnapshotModel;
                        response.result = await self.eval(data.source);
                    }
                    catch (error) {
                        response.result = error.toString();
                    }
                    break;
                }
                case 'setupForSecondaryInit': {
                    __classPrivateFieldGet(this, _HeapSnapshotWorkerDispatcher_objects, "f")[data.objectId] = new HeapSnapshot.SecondaryInitManager(ports[0]);
                }
            }
        }
        catch (error) {
            response.error = error.toString();
            response.errorCallStack = error.stack;
            if (data.methodName) {
                response.errorMethodName = data.methodName;
            }
        }
        __classPrivateFieldGet(this, _HeapSnapshotWorkerDispatcher_postMessage, "f").call(this, response);
    }
}
_HeapSnapshotWorkerDispatcher_objects = new WeakMap(), _HeapSnapshotWorkerDispatcher_postMessage = new WeakMap();
//# sourceMappingURL=HeapSnapshotWorkerDispatcher.js.map