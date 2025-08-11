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
var _DisposableStack_disposed, _DisposableStack_stack, _a, _AsyncDisposableStack_disposed, _AsyncDisposableStack_stack, _b, _SuppressedError_error, _SuppressedError_suppressed;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Symbol.dispose ?? (Symbol.dispose = Symbol('dispose'));
Symbol.asyncDispose ?? (Symbol.asyncDispose = Symbol('asyncDispose'));
/**
 * @internal
 */
export const disposeSymbol = Symbol.dispose;
/**
 * @internal
 */
export const asyncDisposeSymbol = Symbol.asyncDispose;
/**
 * @internal
 */
export class DisposableStack {
    constructor() {
        _DisposableStack_disposed.set(this, false);
        _DisposableStack_stack.set(this, []);
        this[_a] = 'DisposableStack';
    }
    /**
     * Returns a value indicating whether the stack has been disposed.
     */
    get disposed() {
        return __classPrivateFieldGet(this, _DisposableStack_disposed, "f");
    }
    /**
     * Alias for `[Symbol.dispose]()`.
     */
    dispose() {
        this[disposeSymbol]();
    }
    /**
     * Adds a disposable resource to the top of stack, returning the resource.
     * Has no effect if provided `null` or `undefined`.
     *
     * @param value - A `Disposable` object, `null`, or `undefined`.
     * `null` and `undefined` will not be added, but will be returned.
     * @returns The provided `value`.
     */
    use(value) {
        if (value && typeof value[disposeSymbol] === 'function') {
            __classPrivateFieldGet(this, _DisposableStack_stack, "f").push(value);
        }
        return value;
    }
    /**
     * Adds a non-disposable resource and a disposal callback to the top of the stack.
     *
     * @param value - A resource to be disposed.
     * @param onDispose - A callback invoked to dispose the provided value.
     * Will be invoked with `value` as the first parameter.
     * @returns The provided `value`.
     */
    adopt(value, onDispose) {
        __classPrivateFieldGet(this, _DisposableStack_stack, "f").push({
            [disposeSymbol]() {
                onDispose(value);
            },
        });
        return value;
    }
    /**
     * Add a disposal callback to the top of the stack to be invoked when stack is disposed.
     * @param onDispose - A callback to invoke when this object is disposed.
     */
    defer(onDispose) {
        __classPrivateFieldGet(this, _DisposableStack_stack, "f").push({
            [disposeSymbol]() {
                onDispose();
            },
        });
    }
    /**
     * Move all resources out of this stack and into a new `DisposableStack`, and
     * marks this stack as disposed.
     * @returns The new `DisposableStack`.
     *
     * @example
     *
     * ```ts
     * class C {
     *   #res1: Disposable;
     *   #res2: Disposable;
     *   #disposables: DisposableStack;
     *   constructor() {
     *     // stack will be disposed when exiting constructor for any reason
     *     using stack = new DisposableStack();
     *
     *     // get first resource
     *     this.#res1 = stack.use(getResource1());
     *
     *     // get second resource. If this fails, both `stack` and `#res1` will be disposed.
     *     this.#res2 = stack.use(getResource2());
     *
     *     // all operations succeeded, move resources out of `stack` so that
     *     // they aren't disposed when constructor exits
     *     this.#disposables = stack.move();
     *   }
     *
     *   [disposeSymbol]() {
     *     this.#disposables.dispose();
     *   }
     * }
     * ```
     */
    move() {
        if (__classPrivateFieldGet(this, _DisposableStack_disposed, "f")) {
            throw new ReferenceError('A disposed stack can not use anything new');
        }
        const stack = new DisposableStack();
        __classPrivateFieldSet(stack, _DisposableStack_stack, __classPrivateFieldGet(this, _DisposableStack_stack, "f"), "f");
        __classPrivateFieldSet(this, _DisposableStack_stack, [], "f");
        __classPrivateFieldSet(this, _DisposableStack_disposed, true, "f");
        return stack;
    }
    /**
     * Disposes each resource in the stack in last-in-first-out (LIFO) manner.
     */
    [(_DisposableStack_disposed = new WeakMap(), _DisposableStack_stack = new WeakMap(), disposeSymbol)]() {
        if (__classPrivateFieldGet(this, _DisposableStack_disposed, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _DisposableStack_disposed, true, "f");
        const errors = [];
        for (const resource of __classPrivateFieldGet(this, _DisposableStack_stack, "f").reverse()) {
            try {
                resource[disposeSymbol]();
            }
            catch (e) {
                errors.push(e);
            }
        }
        if (errors.length === 1) {
            throw errors[0];
        }
        else if (errors.length > 1) {
            let suppressed = null;
            for (const error of errors.reverse()) {
                if (suppressed === null) {
                    suppressed = error;
                }
                else {
                    suppressed = new SuppressedError(error, suppressed);
                }
            }
            throw suppressed;
        }
    }
}
_a = Symbol.toStringTag;
/**
 * @internal
 */
export class AsyncDisposableStack {
    constructor() {
        _AsyncDisposableStack_disposed.set(this, false);
        _AsyncDisposableStack_stack.set(this, []);
        this[_b] = 'AsyncDisposableStack';
    }
    /**
     * Returns a value indicating whether the stack has been disposed.
     */
    get disposed() {
        return __classPrivateFieldGet(this, _AsyncDisposableStack_disposed, "f");
    }
    /**
     * Alias for `[Symbol.asyncDispose]()`.
     */
    async dispose() {
        await this[asyncDisposeSymbol]();
    }
    /**
     * Adds a AsyncDisposable resource to the top of stack, returning the resource.
     * Has no effect if provided `null` or `undefined`.
     *
     * @param value - A `AsyncDisposable` object, `null`, or `undefined`.
     * `null` and `undefined` will not be added, but will be returned.
     * @returns The provided `value`.
     */
    use(value) {
        if (value) {
            const asyncDispose = value[asyncDisposeSymbol];
            const dispose = value[disposeSymbol];
            if (typeof asyncDispose === 'function') {
                __classPrivateFieldGet(this, _AsyncDisposableStack_stack, "f").push(value);
            }
            else if (typeof dispose === 'function') {
                __classPrivateFieldGet(this, _AsyncDisposableStack_stack, "f").push({
                    [asyncDisposeSymbol]: async () => {
                        value[disposeSymbol]();
                    },
                });
            }
        }
        return value;
    }
    /**
     * Adds a non-disposable resource and a disposal callback to the top of the stack.
     *
     * @param value - A resource to be disposed.
     * @param onDispose - A callback invoked to dispose the provided value.
     * Will be invoked with `value` as the first parameter.
     * @returns The provided `value`.
     */
    adopt(value, onDispose) {
        __classPrivateFieldGet(this, _AsyncDisposableStack_stack, "f").push({
            [asyncDisposeSymbol]() {
                return onDispose(value);
            },
        });
        return value;
    }
    /**
     * Add a disposal callback to the top of the stack to be invoked when stack is disposed.
     * @param onDispose - A callback to invoke when this object is disposed.
     */
    defer(onDispose) {
        __classPrivateFieldGet(this, _AsyncDisposableStack_stack, "f").push({
            [asyncDisposeSymbol]() {
                return onDispose();
            },
        });
    }
    /**
     * Move all resources out of this stack and into a new `DisposableStack`, and
     * marks this stack as disposed.
     * @returns The new `AsyncDisposableStack`.
     *
     * @example
     *
     * ```ts
     * class C {
     *   #res1: Disposable;
     *   #res2: Disposable;
     *   #disposables: DisposableStack;
     *   constructor() {
     *     // stack will be disposed when exiting constructor for any reason
     *     using stack = new DisposableStack();
     *
     *     // get first resource
     *     this.#res1 = stack.use(getResource1());
     *
     *     // get second resource. If this fails, both `stack` and `#res1` will be disposed.
     *     this.#res2 = stack.use(getResource2());
     *
     *     // all operations succeeded, move resources out of `stack` so that
     *     // they aren't disposed when constructor exits
     *     this.#disposables = stack.move();
     *   }
     *
     *   [disposeSymbol]() {
     *     this.#disposables.dispose();
     *   }
     * }
     * ```
     */
    move() {
        if (__classPrivateFieldGet(this, _AsyncDisposableStack_disposed, "f")) {
            throw new ReferenceError('A disposed stack can not use anything new');
        }
        const stack = new AsyncDisposableStack();
        __classPrivateFieldSet(stack, _AsyncDisposableStack_stack, __classPrivateFieldGet(this, _AsyncDisposableStack_stack, "f"), "f");
        __classPrivateFieldSet(this, _AsyncDisposableStack_stack, [], "f");
        __classPrivateFieldSet(this, _AsyncDisposableStack_disposed, true, "f");
        return stack;
    }
    /**
     * Disposes each resource in the stack in last-in-first-out (LIFO) manner.
     */
    async [(_AsyncDisposableStack_disposed = new WeakMap(), _AsyncDisposableStack_stack = new WeakMap(), asyncDisposeSymbol)]() {
        if (__classPrivateFieldGet(this, _AsyncDisposableStack_disposed, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _AsyncDisposableStack_disposed, true, "f");
        const errors = [];
        for (const resource of __classPrivateFieldGet(this, _AsyncDisposableStack_stack, "f").reverse()) {
            try {
                await resource[asyncDisposeSymbol]();
            }
            catch (e) {
                errors.push(e);
            }
        }
        if (errors.length === 1) {
            throw errors[0];
        }
        else if (errors.length > 1) {
            let suppressed = null;
            for (const error of errors.reverse()) {
                if (suppressed === null) {
                    suppressed = error;
                }
                else {
                    suppressed = new SuppressedError(error, suppressed);
                }
            }
            throw suppressed;
        }
    }
}
_b = Symbol.toStringTag;
/**
 * @internal
 * Represents an error that occurs when multiple errors are thrown during
 * the disposal of resources. This class encapsulates the primary error and
 * any suppressed errors that occurred subsequently.
 */
export class SuppressedError extends Error {
    constructor(error, suppressed, message = 'An error was suppressed during disposal') {
        super(message);
        _SuppressedError_error.set(this, void 0);
        _SuppressedError_suppressed.set(this, void 0);
        this.name = 'SuppressedError';
        __classPrivateFieldSet(this, _SuppressedError_error, error, "f");
        __classPrivateFieldSet(this, _SuppressedError_suppressed, suppressed, "f");
    }
    /**
     * The primary error that occurred during disposal.
     */
    get error() {
        return __classPrivateFieldGet(this, _SuppressedError_error, "f");
    }
    /**
     * The suppressed error i.e. the error that was suppressed
     * because it occurred later in the flow after the original error.
     */
    get suppressed() {
        return __classPrivateFieldGet(this, _SuppressedError_suppressed, "f");
    }
}
_SuppressedError_error = new WeakMap(), _SuppressedError_suppressed = new WeakMap();
//# sourceMappingURL=disposable.js.map
//# sourceMappingURL=disposable.js.map