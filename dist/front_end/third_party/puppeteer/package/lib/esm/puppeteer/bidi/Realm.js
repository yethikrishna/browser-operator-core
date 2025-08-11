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
var _BidiRealm_instances, _BidiRealm_evaluate, _BidiFrameRealm_instances, _BidiFrameRealm_frame, _BidiFrameRealm_initialize, _BidiFrameRealm_bindingsInstalled, _BidiWorkerRealm_worker;
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function")
            throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose)
                throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose)
                throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async)
                inner = dispose;
        }
        if (typeof dispose !== "function")
            throw new TypeError("Object not disposable.");
        if (inner)
            dispose = function () { try {
                inner.call(this);
            }
            catch (e) {
                return Promise.reject(e);
            } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1)
                        return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async)
                            return s |= 2, Promise.resolve(result).then(next, function (e) { fail(e); return next(); });
                    }
                    else
                        s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1)
                return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError)
                throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
import { Realm } from '../api/Realm.js';
import { ARIAQueryHandler } from '../cdp/AriaQueryHandler.js';
import { LazyArg } from '../common/LazyArg.js';
import { scriptInjector } from '../common/ScriptInjector.js';
import { debugError, getSourcePuppeteerURLIfAvailable, getSourceUrlComment, isString, PuppeteerURL, SOURCE_URL_REGEX, } from '../common/util.js';
import { AsyncIterableUtil } from '../util/AsyncIterableUtil.js';
import { stringifyFunction } from '../util/Function.js';
import { BidiDeserializer } from './Deserializer.js';
import { BidiElementHandle } from './ElementHandle.js';
import { ExposableFunction } from './ExposedFunction.js';
import { BidiJSHandle } from './JSHandle.js';
import { BidiSerializer } from './Serializer.js';
import { createEvaluationError } from './util.js';
/**
 * @internal
 */
export class BidiRealm extends Realm {
    constructor(realm, timeoutSettings) {
        super(timeoutSettings);
        _BidiRealm_instances.add(this);
        this.realm = realm;
    }
    initialize() {
        this.realm.on('destroyed', ({ reason }) => {
            this.taskManager.terminateAll(new Error(reason));
            this.dispose();
        });
        this.realm.on('updated', () => {
            this.internalPuppeteerUtil = undefined;
            void this.taskManager.rerunAll();
        });
    }
    get puppeteerUtil() {
        const promise = Promise.resolve();
        scriptInjector.inject(script => {
            if (this.internalPuppeteerUtil) {
                void this.internalPuppeteerUtil.then(handle => {
                    void handle.dispose();
                });
            }
            this.internalPuppeteerUtil = promise.then(() => {
                return this.evaluateHandle(script);
            });
        }, !this.internalPuppeteerUtil);
        return this.internalPuppeteerUtil;
    }
    async evaluateHandle(pageFunction, ...args) {
        return await __classPrivateFieldGet(this, _BidiRealm_instances, "m", _BidiRealm_evaluate).call(this, false, pageFunction, ...args);
    }
    async evaluate(pageFunction, ...args) {
        return await __classPrivateFieldGet(this, _BidiRealm_instances, "m", _BidiRealm_evaluate).call(this, true, pageFunction, ...args);
    }
    createHandle(result) {
        if ((result.type === 'node' || result.type === 'window') &&
            this instanceof BidiFrameRealm) {
            return BidiElementHandle.from(result, this);
        }
        return BidiJSHandle.from(result, this);
    }
    async serializeAsync(arg) {
        if (arg instanceof LazyArg) {
            arg = await arg.get(this);
        }
        return this.serialize(arg);
    }
    serialize(arg) {
        if (arg instanceof BidiJSHandle || arg instanceof BidiElementHandle) {
            if (arg.realm !== this) {
                if (!(arg.realm instanceof BidiFrameRealm) ||
                    !(this instanceof BidiFrameRealm)) {
                    throw new Error("Trying to evaluate JSHandle from different global types. Usually this means you're using a handle from a worker in a page or vice versa.");
                }
                if (arg.realm.environment !== this.environment) {
                    throw new Error("Trying to evaluate JSHandle from different frames. Usually this means you're using a handle from a page on a different page.");
                }
            }
            if (arg.disposed) {
                throw new Error('JSHandle is disposed!');
            }
            return arg.remoteValue();
        }
        return BidiSerializer.serialize(arg);
    }
    async destroyHandles(handles) {
        if (this.disposed) {
            return;
        }
        const handleIds = handles
            .map(({ id }) => {
            return id;
        })
            .filter((id) => {
            return id !== undefined;
        });
        if (handleIds.length === 0) {
            return;
        }
        await this.realm.disown(handleIds).catch(error => {
            // Exceptions might happen in case of a page been navigated or closed.
            // Swallow these since they are harmless and we don't leak anything in this case.
            debugError(error);
        });
    }
    async adoptHandle(handle) {
        return (await this.evaluateHandle(node => {
            return node;
        }, handle));
    }
    async transferHandle(handle) {
        if (handle.realm === this) {
            return handle;
        }
        const transferredHandle = this.adoptHandle(handle);
        await handle.dispose();
        return await transferredHandle;
    }
}
_BidiRealm_instances = new WeakSet(), _BidiRealm_evaluate = async function _BidiRealm_evaluate(returnByValue, pageFunction, ...args) {
    const sourceUrlComment = getSourceUrlComment(getSourcePuppeteerURLIfAvailable(pageFunction)?.toString() ??
        PuppeteerURL.INTERNAL_URL);
    let responsePromise;
    const resultOwnership = returnByValue
        ? "none" /* Bidi.Script.ResultOwnership.None */
        : "root" /* Bidi.Script.ResultOwnership.Root */;
    const serializationOptions = returnByValue
        ? {}
        : {
            maxObjectDepth: 0,
            maxDomDepth: 0,
        };
    if (isString(pageFunction)) {
        const expression = SOURCE_URL_REGEX.test(pageFunction)
            ? pageFunction
            : `${pageFunction}\n${sourceUrlComment}\n`;
        responsePromise = this.realm.evaluate(expression, true, {
            resultOwnership,
            userActivation: true,
            serializationOptions,
        });
    }
    else {
        let functionDeclaration = stringifyFunction(pageFunction);
        functionDeclaration = SOURCE_URL_REGEX.test(functionDeclaration)
            ? functionDeclaration
            : `${functionDeclaration}\n${sourceUrlComment}\n`;
        responsePromise = this.realm.callFunction(functionDeclaration, 
        /* awaitPromise= */ true, {
            // LazyArgs are used only internally and should not affect the order
            // evaluate calls for the public APIs.
            arguments: args.some(arg => {
                return arg instanceof LazyArg;
            })
                ? await Promise.all(args.map(arg => {
                    return this.serializeAsync(arg);
                }))
                : args.map(arg => {
                    return this.serialize(arg);
                }),
            resultOwnership,
            userActivation: true,
            serializationOptions,
        });
    }
    const result = await responsePromise;
    if ('type' in result && result.type === 'exception') {
        throw createEvaluationError(result.exceptionDetails);
    }
    if (returnByValue) {
        return BidiDeserializer.deserialize(result.result);
    }
    return this.createHandle(result.result);
};
/**
 * @internal
 */
export class BidiFrameRealm extends BidiRealm {
    static from(realm, frame) {
        const frameRealm = new BidiFrameRealm(realm, frame);
        __classPrivateFieldGet(frameRealm, _BidiFrameRealm_instances, "m", _BidiFrameRealm_initialize).call(frameRealm);
        return frameRealm;
    }
    constructor(realm, frame) {
        super(realm, frame.timeoutSettings);
        _BidiFrameRealm_instances.add(this);
        _BidiFrameRealm_frame.set(this, void 0);
        _BidiFrameRealm_bindingsInstalled.set(this, false);
        __classPrivateFieldSet(this, _BidiFrameRealm_frame, frame, "f");
    }
    get puppeteerUtil() {
        let promise = Promise.resolve();
        if (!__classPrivateFieldGet(this, _BidiFrameRealm_bindingsInstalled, "f")) {
            promise = Promise.all([
                ExposableFunction.from(this.environment, '__ariaQuerySelector', ARIAQueryHandler.queryOne, !!this.sandbox),
                ExposableFunction.from(this.environment, '__ariaQuerySelectorAll', async (element, selector) => {
                    const results = ARIAQueryHandler.queryAll(element, selector);
                    return await element.realm.evaluateHandle((...elements) => {
                        return elements;
                    }, ...(await AsyncIterableUtil.collect(results)));
                }, !!this.sandbox),
            ]);
            __classPrivateFieldSet(this, _BidiFrameRealm_bindingsInstalled, true, "f");
        }
        return promise.then(() => {
            return super.puppeteerUtil;
        });
    }
    get sandbox() {
        return this.realm.sandbox;
    }
    get environment() {
        return __classPrivateFieldGet(this, _BidiFrameRealm_frame, "f");
    }
    async adoptBackendNode(backendNodeId) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const { object } = await __classPrivateFieldGet(this, _BidiFrameRealm_frame, "f").client.send('DOM.resolveNode', {
                backendNodeId,
                executionContextId: await this.realm.resolveExecutionContextId(),
            });
            const handle = __addDisposableResource(env_1, BidiElementHandle.from({
                handle: object.objectId,
                type: 'node',
            }, this), false);
            // We need the sharedId, so we perform the following to obtain it.
            return await handle.evaluateHandle(element => {
                return element;
            });
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
}
_BidiFrameRealm_frame = new WeakMap(), _BidiFrameRealm_bindingsInstalled = new WeakMap(), _BidiFrameRealm_instances = new WeakSet(), _BidiFrameRealm_initialize = function _BidiFrameRealm_initialize() {
    super.initialize();
    // This should run first.
    this.realm.on('updated', () => {
        this.environment.clearDocumentHandle();
        __classPrivateFieldSet(this, _BidiFrameRealm_bindingsInstalled, false, "f");
    });
};
/**
 * @internal
 */
export class BidiWorkerRealm extends BidiRealm {
    static from(realm, worker) {
        const workerRealm = new BidiWorkerRealm(realm, worker);
        workerRealm.initialize();
        return workerRealm;
    }
    constructor(realm, frame) {
        super(realm, frame.timeoutSettings);
        _BidiWorkerRealm_worker.set(this, void 0);
        __classPrivateFieldSet(this, _BidiWorkerRealm_worker, frame, "f");
    }
    get environment() {
        return __classPrivateFieldGet(this, _BidiWorkerRealm_worker, "f");
    }
    async adoptBackendNode() {
        throw new Error('Cannot adopt DOM nodes into a worker.');
    }
}
_BidiWorkerRealm_worker = new WeakMap();
//# sourceMappingURL=Realm.js.map
//# sourceMappingURL=Realm.js.map