"use strict";
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
var _CallbackRegistry_callbacks, _CallbackRegistry_idGenerator, _Callback_id, _Callback_error, _Callback_deferred, _Callback_timer, _Callback_label;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Callback = exports.CallbackRegistry = void 0;
const Deferred_js_1 = require("../util/Deferred.js");
const ErrorLike_js_1 = require("../util/ErrorLike.js");
const incremental_id_generator_js_1 = require("../util/incremental-id-generator.js");
const Errors_js_1 = require("./Errors.js");
const util_js_1 = require("./util.js");
const idGenerator = (0, incremental_id_generator_js_1.createIncrementalIdGenerator)();
/**
 * Manages callbacks and their IDs for the protocol request/response communication.
 *
 * @internal
 */
class CallbackRegistry {
    constructor() {
        _CallbackRegistry_callbacks.set(this, new Map());
        _CallbackRegistry_idGenerator.set(this, idGenerator);
    }
    create(label, timeout, request) {
        const callback = new Callback(__classPrivateFieldGet(this, _CallbackRegistry_idGenerator, "f").call(this), label, timeout);
        __classPrivateFieldGet(this, _CallbackRegistry_callbacks, "f").set(callback.id, callback);
        try {
            request(callback.id);
        }
        catch (error) {
            // We still throw sync errors synchronously and clean up the scheduled
            // callback.
            callback.promise.catch(util_js_1.debugError).finally(() => {
                __classPrivateFieldGet(this, _CallbackRegistry_callbacks, "f").delete(callback.id);
            });
            callback.reject(error);
            throw error;
        }
        // Must only have sync code up until here.
        return callback.promise.finally(() => {
            __classPrivateFieldGet(this, _CallbackRegistry_callbacks, "f").delete(callback.id);
        });
    }
    reject(id, message, originalMessage) {
        const callback = __classPrivateFieldGet(this, _CallbackRegistry_callbacks, "f").get(id);
        if (!callback) {
            return;
        }
        this._reject(callback, message, originalMessage);
    }
    rejectRaw(id, error) {
        const callback = __classPrivateFieldGet(this, _CallbackRegistry_callbacks, "f").get(id);
        if (!callback) {
            return;
        }
        callback.reject(error);
    }
    _reject(callback, errorMessage, originalMessage) {
        let error;
        let message;
        if (errorMessage instanceof Errors_js_1.ProtocolError) {
            error = errorMessage;
            error.cause = callback.error;
            message = errorMessage.message;
        }
        else {
            error = callback.error;
            message = errorMessage;
        }
        callback.reject((0, ErrorLike_js_1.rewriteError)(error, `Protocol error (${callback.label}): ${message}`, originalMessage));
    }
    resolve(id, value) {
        const callback = __classPrivateFieldGet(this, _CallbackRegistry_callbacks, "f").get(id);
        if (!callback) {
            return;
        }
        callback.resolve(value);
    }
    clear() {
        for (const callback of __classPrivateFieldGet(this, _CallbackRegistry_callbacks, "f").values()) {
            // TODO: probably we can accept error messages as params.
            this._reject(callback, new Errors_js_1.TargetCloseError('Target closed'));
        }
        __classPrivateFieldGet(this, _CallbackRegistry_callbacks, "f").clear();
    }
    /**
     * @internal
     */
    getPendingProtocolErrors() {
        const result = [];
        for (const callback of __classPrivateFieldGet(this, _CallbackRegistry_callbacks, "f").values()) {
            result.push(new Error(`${callback.label} timed out. Trace: ${callback.error.stack}`));
        }
        return result;
    }
}
_CallbackRegistry_callbacks = new WeakMap(), _CallbackRegistry_idGenerator = new WeakMap();
exports.CallbackRegistry = CallbackRegistry;
/**
 * @internal
 */
class Callback {
    constructor(id, label, timeout) {
        _Callback_id.set(this, void 0);
        _Callback_error.set(this, new Errors_js_1.ProtocolError());
        _Callback_deferred.set(this, Deferred_js_1.Deferred.create());
        _Callback_timer.set(this, void 0);
        _Callback_label.set(this, void 0);
        __classPrivateFieldSet(this, _Callback_id, id, "f");
        __classPrivateFieldSet(this, _Callback_label, label, "f");
        if (timeout) {
            __classPrivateFieldSet(this, _Callback_timer, setTimeout(() => {
                __classPrivateFieldGet(this, _Callback_deferred, "f").reject((0, ErrorLike_js_1.rewriteError)(__classPrivateFieldGet(this, _Callback_error, "f"), `${label} timed out. Increase the 'protocolTimeout' setting in launch/connect calls for a higher timeout if needed.`));
            }, timeout), "f");
        }
    }
    resolve(value) {
        clearTimeout(__classPrivateFieldGet(this, _Callback_timer, "f"));
        __classPrivateFieldGet(this, _Callback_deferred, "f").resolve(value);
    }
    reject(error) {
        clearTimeout(__classPrivateFieldGet(this, _Callback_timer, "f"));
        __classPrivateFieldGet(this, _Callback_deferred, "f").reject(error);
    }
    get id() {
        return __classPrivateFieldGet(this, _Callback_id, "f");
    }
    get promise() {
        return __classPrivateFieldGet(this, _Callback_deferred, "f").valueOrThrow();
    }
    get error() {
        return __classPrivateFieldGet(this, _Callback_error, "f");
    }
    get label() {
        return __classPrivateFieldGet(this, _Callback_label, "f");
    }
}
_Callback_id = new WeakMap(), _Callback_error = new WeakMap(), _Callback_deferred = new WeakMap(), _Callback_timer = new WeakMap(), _Callback_label = new WeakMap();
exports.Callback = Callback;
//# sourceMappingURL=CallbackRegistry.js.map