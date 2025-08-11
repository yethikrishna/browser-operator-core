/**
 * @license
 * Copyright 2019 Google Inc.
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
var _IsolatedWorld_instances, _IsolatedWorld_context, _IsolatedWorld_emitter, _IsolatedWorld_frameOrWorker, _IsolatedWorld_onContextDisposed, _IsolatedWorld_onContextConsoleApiCalled, _IsolatedWorld_onContextBindingCalled, _IsolatedWorld_executionContext, _IsolatedWorld_waitForExecutionContext;
import { firstValueFrom, map, raceWith } from '../../third_party/rxjs/rxjs.js';
import { Realm } from '../api/Realm.js';
import { EventEmitter } from '../common/EventEmitter.js';
import { fromEmitterEvent, timeout, withSourcePuppeteerURLIfNone, } from '../common/util.js';
import { disposeSymbol } from '../util/disposable.js';
import { CdpElementHandle } from './ElementHandle.js';
import { CdpJSHandle } from './JSHandle.js';
/**
 * @internal
 */
export class IsolatedWorld extends Realm {
    constructor(frameOrWorker, timeoutSettings) {
        super(timeoutSettings);
        _IsolatedWorld_instances.add(this);
        _IsolatedWorld_context.set(this, void 0);
        _IsolatedWorld_emitter.set(this, new EventEmitter());
        _IsolatedWorld_frameOrWorker.set(this, void 0);
        __classPrivateFieldSet(this, _IsolatedWorld_frameOrWorker, frameOrWorker, "f");
    }
    get environment() {
        return __classPrivateFieldGet(this, _IsolatedWorld_frameOrWorker, "f");
    }
    get client() {
        return __classPrivateFieldGet(this, _IsolatedWorld_frameOrWorker, "f").client;
    }
    get emitter() {
        return __classPrivateFieldGet(this, _IsolatedWorld_emitter, "f");
    }
    setContext(context) {
        __classPrivateFieldGet(this, _IsolatedWorld_context, "f")?.[disposeSymbol]();
        context.once('disposed', __classPrivateFieldGet(this, _IsolatedWorld_instances, "m", _IsolatedWorld_onContextDisposed).bind(this));
        context.on('consoleapicalled', __classPrivateFieldGet(this, _IsolatedWorld_instances, "m", _IsolatedWorld_onContextConsoleApiCalled).bind(this));
        context.on('bindingcalled', __classPrivateFieldGet(this, _IsolatedWorld_instances, "m", _IsolatedWorld_onContextBindingCalled).bind(this));
        __classPrivateFieldSet(this, _IsolatedWorld_context, context, "f");
        __classPrivateFieldGet(this, _IsolatedWorld_emitter, "f").emit('context', context);
        void this.taskManager.rerunAll();
    }
    hasContext() {
        return !!__classPrivateFieldGet(this, _IsolatedWorld_context, "f");
    }
    get context() {
        return __classPrivateFieldGet(this, _IsolatedWorld_context, "f");
    }
    async evaluateHandle(pageFunction, ...args) {
        pageFunction = withSourcePuppeteerURLIfNone(this.evaluateHandle.name, pageFunction);
        // This code needs to schedule evaluateHandle call synchronously (at
        // least when the context is there) so we cannot unconditionally
        // await.
        let context = __classPrivateFieldGet(this, _IsolatedWorld_instances, "m", _IsolatedWorld_executionContext).call(this);
        if (!context) {
            context = await __classPrivateFieldGet(this, _IsolatedWorld_instances, "m", _IsolatedWorld_waitForExecutionContext).call(this);
        }
        return await context.evaluateHandle(pageFunction, ...args);
    }
    async evaluate(pageFunction, ...args) {
        pageFunction = withSourcePuppeteerURLIfNone(this.evaluate.name, pageFunction);
        // This code needs to schedule evaluate call synchronously (at
        // least when the context is there) so we cannot unconditionally
        // await.
        let context = __classPrivateFieldGet(this, _IsolatedWorld_instances, "m", _IsolatedWorld_executionContext).call(this);
        if (!context) {
            context = await __classPrivateFieldGet(this, _IsolatedWorld_instances, "m", _IsolatedWorld_waitForExecutionContext).call(this);
        }
        return await context.evaluate(pageFunction, ...args);
    }
    async adoptBackendNode(backendNodeId) {
        // This code needs to schedule resolveNode call synchronously (at
        // least when the context is there) so we cannot unconditionally
        // await.
        let context = __classPrivateFieldGet(this, _IsolatedWorld_instances, "m", _IsolatedWorld_executionContext).call(this);
        if (!context) {
            context = await __classPrivateFieldGet(this, _IsolatedWorld_instances, "m", _IsolatedWorld_waitForExecutionContext).call(this);
        }
        const { object } = await this.client.send('DOM.resolveNode', {
            backendNodeId: backendNodeId,
            executionContextId: context.id,
        });
        return this.createCdpHandle(object);
    }
    async adoptHandle(handle) {
        if (handle.realm === this) {
            // If the context has already adopted this handle, clone it so downstream
            // disposal doesn't become an issue.
            return (await handle.evaluateHandle(value => {
                return value;
            }));
        }
        const nodeInfo = await this.client.send('DOM.describeNode', {
            objectId: handle.id,
        });
        return (await this.adoptBackendNode(nodeInfo.node.backendNodeId));
    }
    async transferHandle(handle) {
        if (handle.realm === this) {
            return handle;
        }
        // Implies it's a primitive value, probably.
        if (handle.remoteObject().objectId === undefined) {
            return handle;
        }
        const info = await this.client.send('DOM.describeNode', {
            objectId: handle.remoteObject().objectId,
        });
        const newHandle = (await this.adoptBackendNode(info.node.backendNodeId));
        await handle.dispose();
        return newHandle;
    }
    /**
     * @internal
     */
    createCdpHandle(remoteObject) {
        if (remoteObject.subtype === 'node') {
            return new CdpElementHandle(this, remoteObject);
        }
        return new CdpJSHandle(this, remoteObject);
    }
    [(_IsolatedWorld_context = new WeakMap(), _IsolatedWorld_emitter = new WeakMap(), _IsolatedWorld_frameOrWorker = new WeakMap(), _IsolatedWorld_instances = new WeakSet(), _IsolatedWorld_onContextDisposed = function _IsolatedWorld_onContextDisposed() {
        __classPrivateFieldSet(this, _IsolatedWorld_context, undefined, "f");
        if ('clearDocumentHandle' in __classPrivateFieldGet(this, _IsolatedWorld_frameOrWorker, "f")) {
            __classPrivateFieldGet(this, _IsolatedWorld_frameOrWorker, "f").clearDocumentHandle();
        }
    }, _IsolatedWorld_onContextConsoleApiCalled = function _IsolatedWorld_onContextConsoleApiCalled(event) {
        __classPrivateFieldGet(this, _IsolatedWorld_emitter, "f").emit('consoleapicalled', event);
    }, _IsolatedWorld_onContextBindingCalled = function _IsolatedWorld_onContextBindingCalled(event) {
        __classPrivateFieldGet(this, _IsolatedWorld_emitter, "f").emit('bindingcalled', event);
    }, _IsolatedWorld_executionContext = function _IsolatedWorld_executionContext() {
        if (this.disposed) {
            throw new Error(`Execution context is not available in detached frame or worker "${this.environment.url()}" (are you trying to evaluate?)`);
        }
        return __classPrivateFieldGet(this, _IsolatedWorld_context, "f");
    }, _IsolatedWorld_waitForExecutionContext = 
    /**
     * Waits for the next context to be set on the isolated world.
     */
    async function _IsolatedWorld_waitForExecutionContext() {
        const error = new Error('Execution context was destroyed');
        const result = await firstValueFrom(fromEmitterEvent(__classPrivateFieldGet(this, _IsolatedWorld_emitter, "f"), 'context').pipe(raceWith(fromEmitterEvent(__classPrivateFieldGet(this, _IsolatedWorld_emitter, "f"), 'disposed').pipe(map(() => {
            // The message has to match the CDP message expected by the WaitTask class.
            throw error;
        })), timeout(this.timeoutSettings.timeout()))));
        return result;
    }, disposeSymbol)]() {
        __classPrivateFieldGet(this, _IsolatedWorld_context, "f")?.[disposeSymbol]();
        __classPrivateFieldGet(this, _IsolatedWorld_emitter, "f").emit('disposed', undefined);
        super[disposeSymbol]();
        __classPrivateFieldGet(this, _IsolatedWorld_emitter, "f").removeAllListeners();
    }
}
//# sourceMappingURL=IsolatedWorld.js.map