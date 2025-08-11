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
var _ExecutionContext_instances, _ExecutionContext_client, _ExecutionContext_world, _ExecutionContext_id, _ExecutionContext_name, _ExecutionContext_disposables, _ExecutionContext_bindings, _ExecutionContext_mutex, _ExecutionContext_addBinding, _ExecutionContext_onBindingCalled, _ExecutionContext_onConsoleAPI, _ExecutionContext_bindingsInstalled, _ExecutionContext_puppeteerUtil, _ExecutionContext_addBindingWithoutThrowing, _ExecutionContext_evaluate;
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
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
import { CDPSessionEvent } from '../api/CDPSession.js';
import { EventEmitter } from '../common/EventEmitter.js';
import { LazyArg } from '../common/LazyArg.js';
import { scriptInjector } from '../common/ScriptInjector.js';
import { PuppeteerURL, SOURCE_URL_REGEX, debugError, getSourcePuppeteerURLIfAvailable, getSourceUrlComment, isString, } from '../common/util.js';
import { AsyncIterableUtil } from '../util/AsyncIterableUtil.js';
import { DisposableStack, disposeSymbol } from '../util/disposable.js';
import { stringifyFunction } from '../util/Function.js';
import { Mutex } from '../util/Mutex.js';
import { ARIAQueryHandler } from './AriaQueryHandler.js';
import { Binding } from './Binding.js';
import { CdpElementHandle } from './ElementHandle.js';
import { CdpJSHandle } from './JSHandle.js';
import { addPageBinding, CDP_BINDING_PREFIX, createEvaluationError, valueFromRemoteObject, } from './utils.js';
const ariaQuerySelectorBinding = new Binding('__ariaQuerySelector', ARIAQueryHandler.queryOne, '');
const ariaQuerySelectorAllBinding = new Binding('__ariaQuerySelectorAll', (async (element, selector) => {
    const results = ARIAQueryHandler.queryAll(element, selector);
    return await element.realm.evaluateHandle((...elements) => {
        return elements;
    }, ...(await AsyncIterableUtil.collect(results)));
}), '');
/**
 * @internal
 */
export class ExecutionContext extends EventEmitter {
    constructor(client, contextPayload, world) {
        super();
        _ExecutionContext_instances.add(this);
        _ExecutionContext_client.set(this, void 0);
        _ExecutionContext_world.set(this, void 0);
        _ExecutionContext_id.set(this, void 0);
        _ExecutionContext_name.set(this, void 0);
        _ExecutionContext_disposables.set(this, new DisposableStack());
        // Contains mapping from functions that should be bound to Puppeteer functions.
        _ExecutionContext_bindings.set(this, new Map());
        // If multiple waitFor are set up asynchronously, we need to wait for the
        // first one to set up the binding in the page before running the others.
        _ExecutionContext_mutex.set(this, new Mutex());
        _ExecutionContext_bindingsInstalled.set(this, false);
        _ExecutionContext_puppeteerUtil.set(this, void 0);
        __classPrivateFieldSet(this, _ExecutionContext_client, client, "f");
        __classPrivateFieldSet(this, _ExecutionContext_world, world, "f");
        __classPrivateFieldSet(this, _ExecutionContext_id, contextPayload.id, "f");
        if (contextPayload.name) {
            __classPrivateFieldSet(this, _ExecutionContext_name, contextPayload.name, "f");
        }
        const clientEmitter = __classPrivateFieldGet(this, _ExecutionContext_disposables, "f").use(new EventEmitter(__classPrivateFieldGet(this, _ExecutionContext_client, "f")));
        clientEmitter.on('Runtime.bindingCalled', __classPrivateFieldGet(this, _ExecutionContext_instances, "m", _ExecutionContext_onBindingCalled).bind(this));
        clientEmitter.on('Runtime.executionContextDestroyed', async (event) => {
            if (event.executionContextId === __classPrivateFieldGet(this, _ExecutionContext_id, "f")) {
                this[disposeSymbol]();
            }
        });
        clientEmitter.on('Runtime.executionContextsCleared', async () => {
            this[disposeSymbol]();
        });
        clientEmitter.on('Runtime.consoleAPICalled', __classPrivateFieldGet(this, _ExecutionContext_instances, "m", _ExecutionContext_onConsoleAPI).bind(this));
        clientEmitter.on(CDPSessionEvent.Disconnected, () => {
            this[disposeSymbol]();
        });
    }
    get id() {
        return __classPrivateFieldGet(this, _ExecutionContext_id, "f");
    }
    get puppeteerUtil() {
        let promise = Promise.resolve();
        if (!__classPrivateFieldGet(this, _ExecutionContext_bindingsInstalled, "f")) {
            promise = Promise.all([
                __classPrivateFieldGet(this, _ExecutionContext_instances, "m", _ExecutionContext_addBindingWithoutThrowing).call(this, ariaQuerySelectorBinding),
                __classPrivateFieldGet(this, _ExecutionContext_instances, "m", _ExecutionContext_addBindingWithoutThrowing).call(this, ariaQuerySelectorAllBinding),
            ]);
            __classPrivateFieldSet(this, _ExecutionContext_bindingsInstalled, true, "f");
        }
        scriptInjector.inject(script => {
            if (__classPrivateFieldGet(this, _ExecutionContext_puppeteerUtil, "f")) {
                void __classPrivateFieldGet(this, _ExecutionContext_puppeteerUtil, "f").then(handle => {
                    void handle.dispose();
                });
            }
            __classPrivateFieldSet(this, _ExecutionContext_puppeteerUtil, promise.then(() => {
                return this.evaluateHandle(script);
            }), "f");
        }, !__classPrivateFieldGet(this, _ExecutionContext_puppeteerUtil, "f"));
        return __classPrivateFieldGet(this, _ExecutionContext_puppeteerUtil, "f");
    }
    /**
     * Evaluates the given function.
     *
     * @example
     *
     * ```ts
     * const executionContext = await page.mainFrame().executionContext();
     * const result = await executionContext.evaluate(() => Promise.resolve(8 * 7))* ;
     * console.log(result); // prints "56"
     * ```
     *
     * @example
     * A string can also be passed in instead of a function:
     *
     * ```ts
     * console.log(await executionContext.evaluate('1 + 2')); // prints "3"
     * ```
     *
     * @example
     * Handles can also be passed as `args`. They resolve to their referenced object:
     *
     * ```ts
     * const oneHandle = await executionContext.evaluateHandle(() => 1);
     * const twoHandle = await executionContext.evaluateHandle(() => 2);
     * const result = await executionContext.evaluate(
     *   (a, b) => a + b,
     *   oneHandle,
     *   twoHandle,
     * );
     * await oneHandle.dispose();
     * await twoHandle.dispose();
     * console.log(result); // prints '3'.
     * ```
     *
     * @param pageFunction - The function to evaluate.
     * @param args - Additional arguments to pass into the function.
     * @returns The result of evaluating the function. If the result is an object,
     * a vanilla object containing the serializable properties of the result is
     * returned.
     */
    async evaluate(pageFunction, ...args) {
        return await __classPrivateFieldGet(this, _ExecutionContext_instances, "m", _ExecutionContext_evaluate).call(this, true, pageFunction, ...args);
    }
    /**
     * Evaluates the given function.
     *
     * Unlike {@link ExecutionContext.evaluate | evaluate}, this method returns a
     * handle to the result of the function.
     *
     * This method may be better suited if the object cannot be serialized (e.g.
     * `Map`) and requires further manipulation.
     *
     * @example
     *
     * ```ts
     * const context = await page.mainFrame().executionContext();
     * const handle: JSHandle<typeof globalThis> = await context.evaluateHandle(
     *   () => Promise.resolve(self),
     * );
     * ```
     *
     * @example
     * A string can also be passed in instead of a function.
     *
     * ```ts
     * const handle: JSHandle<number> = await context.evaluateHandle('1 + 2');
     * ```
     *
     * @example
     * Handles can also be passed as `args`. They resolve to their referenced object:
     *
     * ```ts
     * const bodyHandle: ElementHandle<HTMLBodyElement> =
     *   await context.evaluateHandle(() => {
     *     return document.body;
     *   });
     * const stringHandle: JSHandle<string> = await context.evaluateHandle(
     *   body => body.innerHTML,
     *   body,
     * );
     * console.log(await stringHandle.jsonValue()); // prints body's innerHTML
     * // Always dispose your garbage! :)
     * await bodyHandle.dispose();
     * await stringHandle.dispose();
     * ```
     *
     * @param pageFunction - The function to evaluate.
     * @param args - Additional arguments to pass into the function.
     * @returns A {@link JSHandle | handle} to the result of evaluating the
     * function. If the result is a `Node`, then this will return an
     * {@link ElementHandle | element handle}.
     */
    async evaluateHandle(pageFunction, ...args) {
        return await __classPrivateFieldGet(this, _ExecutionContext_instances, "m", _ExecutionContext_evaluate).call(this, false, pageFunction, ...args);
    }
    [(_ExecutionContext_client = new WeakMap(), _ExecutionContext_world = new WeakMap(), _ExecutionContext_id = new WeakMap(), _ExecutionContext_name = new WeakMap(), _ExecutionContext_disposables = new WeakMap(), _ExecutionContext_bindings = new WeakMap(), _ExecutionContext_mutex = new WeakMap(), _ExecutionContext_bindingsInstalled = new WeakMap(), _ExecutionContext_puppeteerUtil = new WeakMap(), _ExecutionContext_instances = new WeakSet(), _ExecutionContext_addBinding = async function _ExecutionContext_addBinding(binding) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            if (__classPrivateFieldGet(this, _ExecutionContext_bindings, "f").has(binding.name)) {
                return;
            }
            const _ = __addDisposableResource(env_1, await __classPrivateFieldGet(this, _ExecutionContext_mutex, "f").acquire(), false);
            try {
                await __classPrivateFieldGet(this, _ExecutionContext_client, "f").send('Runtime.addBinding', __classPrivateFieldGet(this, _ExecutionContext_name, "f")
                    ? {
                        name: CDP_BINDING_PREFIX + binding.name,
                        executionContextName: __classPrivateFieldGet(this, _ExecutionContext_name, "f"),
                    }
                    : {
                        name: CDP_BINDING_PREFIX + binding.name,
                        executionContextId: __classPrivateFieldGet(this, _ExecutionContext_id, "f"),
                    });
                await this.evaluate(addPageBinding, 'internal', binding.name, CDP_BINDING_PREFIX);
                __classPrivateFieldGet(this, _ExecutionContext_bindings, "f").set(binding.name, binding);
            }
            catch (error) {
                // We could have tried to evaluate in a context which was already
                // destroyed. This happens, for example, if the page is navigated while
                // we are trying to add the binding
                if (error instanceof Error) {
                    // Destroyed context.
                    if (error.message.includes('Execution context was destroyed')) {
                        return;
                    }
                    // Missing context.
                    if (error.message.includes('Cannot find context with specified id')) {
                        return;
                    }
                }
                debugError(error);
            }
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }, _ExecutionContext_onBindingCalled = async function _ExecutionContext_onBindingCalled(event) {
        if (event.executionContextId !== __classPrivateFieldGet(this, _ExecutionContext_id, "f")) {
            return;
        }
        let payload;
        try {
            payload = JSON.parse(event.payload);
        }
        catch {
            // The binding was either called by something in the page or it was
            // called before our wrapper was initialized.
            return;
        }
        const { type, name, seq, args, isTrivial } = payload;
        if (type !== 'internal') {
            this.emit('bindingcalled', event);
            return;
        }
        if (!__classPrivateFieldGet(this, _ExecutionContext_bindings, "f").has(name)) {
            this.emit('bindingcalled', event);
            return;
        }
        try {
            const binding = __classPrivateFieldGet(this, _ExecutionContext_bindings, "f").get(name);
            await binding?.run(this, seq, args, isTrivial);
        }
        catch (err) {
            debugError(err);
        }
    }, _ExecutionContext_onConsoleAPI = function _ExecutionContext_onConsoleAPI(event) {
        if (event.executionContextId !== __classPrivateFieldGet(this, _ExecutionContext_id, "f")) {
            return;
        }
        this.emit('consoleapicalled', event);
    }, _ExecutionContext_addBindingWithoutThrowing = async function _ExecutionContext_addBindingWithoutThrowing(binding) {
        try {
            await __classPrivateFieldGet(this, _ExecutionContext_instances, "m", _ExecutionContext_addBinding).call(this, binding);
        }
        catch (err) {
            // If the binding cannot be added, the context is broken. We cannot
            // recover so we ignore the error.
            debugError(err);
        }
    }, _ExecutionContext_evaluate = async function _ExecutionContext_evaluate(returnByValue, pageFunction, ...args) {
        const sourceUrlComment = getSourceUrlComment(getSourcePuppeteerURLIfAvailable(pageFunction)?.toString() ??
            PuppeteerURL.INTERNAL_URL);
        if (isString(pageFunction)) {
            const contextId = __classPrivateFieldGet(this, _ExecutionContext_id, "f");
            const expression = pageFunction;
            const expressionWithSourceUrl = SOURCE_URL_REGEX.test(expression)
                ? expression
                : `${expression}\n${sourceUrlComment}\n`;
            const { exceptionDetails, result: remoteObject } = await __classPrivateFieldGet(this, _ExecutionContext_client, "f")
                .send('Runtime.evaluate', {
                expression: expressionWithSourceUrl,
                contextId,
                returnByValue,
                awaitPromise: true,
                userGesture: true,
            })
                .catch(rewriteError);
            if (exceptionDetails) {
                throw createEvaluationError(exceptionDetails);
            }
            if (returnByValue) {
                return valueFromRemoteObject(remoteObject);
            }
            return __classPrivateFieldGet(this, _ExecutionContext_world, "f").createCdpHandle(remoteObject);
        }
        const functionDeclaration = stringifyFunction(pageFunction);
        const functionDeclarationWithSourceUrl = SOURCE_URL_REGEX.test(functionDeclaration)
            ? functionDeclaration
            : `${functionDeclaration}\n${sourceUrlComment}\n`;
        let callFunctionOnPromise;
        try {
            callFunctionOnPromise = __classPrivateFieldGet(this, _ExecutionContext_client, "f").send('Runtime.callFunctionOn', {
                functionDeclaration: functionDeclarationWithSourceUrl,
                executionContextId: __classPrivateFieldGet(this, _ExecutionContext_id, "f"),
                // LazyArgs are used only internally and should not affect the order
                // evaluate calls for the public APIs.
                arguments: args.some(arg => {
                    return arg instanceof LazyArg;
                })
                    ? await Promise.all(args.map(arg => {
                        return convertArgumentAsync(this, arg);
                    }))
                    : args.map(arg => {
                        return convertArgument(this, arg);
                    }),
                returnByValue,
                awaitPromise: true,
                userGesture: true,
            });
        }
        catch (error) {
            if (error instanceof TypeError &&
                error.message.startsWith('Converting circular structure to JSON')) {
                error.message += ' Recursive objects are not allowed.';
            }
            throw error;
        }
        const { exceptionDetails, result: remoteObject } = await callFunctionOnPromise.catch(rewriteError);
        if (exceptionDetails) {
            throw createEvaluationError(exceptionDetails);
        }
        if (returnByValue) {
            return valueFromRemoteObject(remoteObject);
        }
        return __classPrivateFieldGet(this, _ExecutionContext_world, "f").createCdpHandle(remoteObject);
        async function convertArgumentAsync(context, arg) {
            if (arg instanceof LazyArg) {
                arg = await arg.get(context);
            }
            return convertArgument(context, arg);
        }
        function convertArgument(context, arg) {
            if (typeof arg === 'bigint') {
                return { unserializableValue: `${arg.toString()}n` };
            }
            if (Object.is(arg, -0)) {
                return { unserializableValue: '-0' };
            }
            if (Object.is(arg, Infinity)) {
                return { unserializableValue: 'Infinity' };
            }
            if (Object.is(arg, -Infinity)) {
                return { unserializableValue: '-Infinity' };
            }
            if (Object.is(arg, NaN)) {
                return { unserializableValue: 'NaN' };
            }
            const objectHandle = arg && (arg instanceof CdpJSHandle || arg instanceof CdpElementHandle)
                ? arg
                : null;
            if (objectHandle) {
                if (objectHandle.realm !== __classPrivateFieldGet(context, _ExecutionContext_world, "f")) {
                    throw new Error('JSHandles can be evaluated only in the context they were created!');
                }
                if (objectHandle.disposed) {
                    throw new Error('JSHandle is disposed!');
                }
                if (objectHandle.remoteObject().unserializableValue) {
                    return {
                        unserializableValue: objectHandle.remoteObject().unserializableValue,
                    };
                }
                if (!objectHandle.remoteObject().objectId) {
                    return { value: objectHandle.remoteObject().value };
                }
                return { objectId: objectHandle.remoteObject().objectId };
            }
            return { value: arg };
        }
    }, disposeSymbol)]() {
        __classPrivateFieldGet(this, _ExecutionContext_disposables, "f").dispose();
        this.emit('disposed', undefined);
    }
}
const rewriteError = (error) => {
    if (error.message.includes('Object reference chain is too long')) {
        return { result: { type: 'undefined' } };
    }
    if (error.message.includes("Object couldn't be returned by value")) {
        return { result: { type: 'undefined' } };
    }
    if (error.message.endsWith('Cannot find context with specified id') ||
        error.message.endsWith('Inspected target navigated or closed')) {
        throw new Error('Execution context was destroyed, most likely because of a navigation.');
    }
    throw error;
};
//# sourceMappingURL=ExecutionContext.js.map
//# sourceMappingURL=ExecutionContext.js.map