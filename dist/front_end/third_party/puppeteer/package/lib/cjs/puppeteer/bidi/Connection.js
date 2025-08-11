"use strict";
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
var _BidiConnection_url, _BidiConnection_transport, _BidiConnection_delay, _BidiConnection_timeout, _BidiConnection_closed, _BidiConnection_callbacks, _BidiConnection_emitters;
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidiConnection = void 0;
const CallbackRegistry_js_1 = require("../common/CallbackRegistry.js");
const Debug_js_1 = require("../common/Debug.js");
const EventEmitter_js_1 = require("../common/EventEmitter.js");
const util_js_1 = require("../common/util.js");
const assert_js_1 = require("../util/assert.js");
const CDPSession_js_1 = require("./CDPSession.js");
const debugProtocolSend = (0, Debug_js_1.debug)('puppeteer:webDriverBiDi:SEND ►');
const debugProtocolReceive = (0, Debug_js_1.debug)('puppeteer:webDriverBiDi:RECV ◀');
/**
 * @internal
 */
class BidiConnection extends EventEmitter_js_1.EventEmitter {
    constructor(url, transport, delay = 0, timeout) {
        super();
        _BidiConnection_url.set(this, void 0);
        _BidiConnection_transport.set(this, void 0);
        _BidiConnection_delay.set(this, void 0);
        _BidiConnection_timeout.set(this, 0);
        _BidiConnection_closed.set(this, false);
        _BidiConnection_callbacks.set(this, new CallbackRegistry_js_1.CallbackRegistry());
        _BidiConnection_emitters.set(this, []);
        __classPrivateFieldSet(this, _BidiConnection_url, url, "f");
        __classPrivateFieldSet(this, _BidiConnection_delay, delay, "f");
        __classPrivateFieldSet(this, _BidiConnection_timeout, timeout ?? 180000, "f");
        __classPrivateFieldSet(this, _BidiConnection_transport, transport, "f");
        __classPrivateFieldGet(this, _BidiConnection_transport, "f").onmessage = this.onMessage.bind(this);
        __classPrivateFieldGet(this, _BidiConnection_transport, "f").onclose = this.unbind.bind(this);
    }
    get closed() {
        return __classPrivateFieldGet(this, _BidiConnection_closed, "f");
    }
    get url() {
        return __classPrivateFieldGet(this, _BidiConnection_url, "f");
    }
    pipeTo(emitter) {
        __classPrivateFieldGet(this, _BidiConnection_emitters, "f").push(emitter);
    }
    emit(type, event) {
        for (const emitter of __classPrivateFieldGet(this, _BidiConnection_emitters, "f")) {
            emitter.emit(type, event);
        }
        return super.emit(type, event);
    }
    send(method, params, timeout) {
        (0, assert_js_1.assert)(!__classPrivateFieldGet(this, _BidiConnection_closed, "f"), 'Protocol error: Connection closed.');
        return __classPrivateFieldGet(this, _BidiConnection_callbacks, "f").create(method, timeout ?? __classPrivateFieldGet(this, _BidiConnection_timeout, "f"), id => {
            const stringifiedMessage = JSON.stringify({
                id,
                method,
                params,
            });
            debugProtocolSend(stringifiedMessage);
            __classPrivateFieldGet(this, _BidiConnection_transport, "f").send(stringifiedMessage);
        });
    }
    /**
     * @internal
     */
    async onMessage(message) {
        if (__classPrivateFieldGet(this, _BidiConnection_delay, "f")) {
            await new Promise(f => {
                return setTimeout(f, __classPrivateFieldGet(this, _BidiConnection_delay, "f"));
            });
        }
        debugProtocolReceive(message);
        const object = JSON.parse(message);
        if ('type' in object) {
            switch (object.type) {
                case 'success':
                    __classPrivateFieldGet(this, _BidiConnection_callbacks, "f").resolve(object.id, object);
                    return;
                case 'error':
                    if (object.id === null) {
                        break;
                    }
                    __classPrivateFieldGet(this, _BidiConnection_callbacks, "f").reject(object.id, createProtocolError(object), `${object.error}: ${object.message}`);
                    return;
                case 'event':
                    if (isCdpEvent(object)) {
                        CDPSession_js_1.BidiCdpSession.sessions
                            .get(object.params.session)
                            ?.emit(object.params.event, object.params.params);
                        return;
                    }
                    // SAFETY: We know the method and parameter still match here.
                    this.emit(object.method, object.params);
                    return;
            }
        }
        // Even if the response in not in BiDi protocol format but `id` is provided, reject
        // the callback. This can happen if the endpoint supports CDP instead of BiDi.
        if ('id' in object) {
            __classPrivateFieldGet(this, _BidiConnection_callbacks, "f").reject(object.id, `Protocol Error. Message is not in BiDi protocol format: '${message}'`, object.message);
        }
        (0, util_js_1.debugError)(object);
    }
    /**
     * Unbinds the connection, but keeps the transport open. Useful when the transport will
     * be reused by other connection e.g. with different protocol.
     * @internal
     */
    unbind() {
        if (__classPrivateFieldGet(this, _BidiConnection_closed, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _BidiConnection_closed, true, "f");
        // Both may still be invoked and produce errors
        __classPrivateFieldGet(this, _BidiConnection_transport, "f").onmessage = () => { };
        __classPrivateFieldGet(this, _BidiConnection_transport, "f").onclose = () => { };
        __classPrivateFieldGet(this, _BidiConnection_callbacks, "f").clear();
    }
    /**
     * Unbinds the connection and closes the transport.
     */
    dispose() {
        this.unbind();
        __classPrivateFieldGet(this, _BidiConnection_transport, "f").close();
    }
    getPendingProtocolErrors() {
        return __classPrivateFieldGet(this, _BidiConnection_callbacks, "f").getPendingProtocolErrors();
    }
}
_BidiConnection_url = new WeakMap(), _BidiConnection_transport = new WeakMap(), _BidiConnection_delay = new WeakMap(), _BidiConnection_timeout = new WeakMap(), _BidiConnection_closed = new WeakMap(), _BidiConnection_callbacks = new WeakMap(), _BidiConnection_emitters = new WeakMap();
exports.BidiConnection = BidiConnection;
/**
 * @internal
 */
function createProtocolError(object) {
    let message = `${object.error} ${object.message}`;
    if (object.stacktrace) {
        message += ` ${object.stacktrace}`;
    }
    return message;
}
function isCdpEvent(event) {
    return event.method.startsWith('goog:cdp.');
}
//# sourceMappingURL=Connection.js.map