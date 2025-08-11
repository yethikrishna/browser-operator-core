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
var _Connection_instances, _Connection_url, _Connection_transport, _Connection_delay, _Connection_timeout, _Connection_sessions, _Connection_closed, _Connection_manuallyAttached, _Connection_callbacks, _Connection_rawErrors, _Connection_onClose;
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { CDPSessionEvent, } from '../api/CDPSession.js';
import { CallbackRegistry } from '../common/CallbackRegistry.js';
import { debug } from '../common/Debug.js';
import { TargetCloseError } from '../common/Errors.js';
import { EventEmitter } from '../common/EventEmitter.js';
import { createProtocolErrorMessage } from '../util/ErrorLike.js';
import { CdpCDPSession } from './CdpSession.js';
const debugProtocolSend = debug('puppeteer:protocol:SEND ►');
const debugProtocolReceive = debug('puppeteer:protocol:RECV ◀');
/**
 * @public
 */
export class Connection extends EventEmitter {
    constructor(url, transport, delay = 0, timeout, rawErrors = false) {
        super();
        _Connection_instances.add(this);
        _Connection_url.set(this, void 0);
        _Connection_transport.set(this, void 0);
        _Connection_delay.set(this, void 0);
        _Connection_timeout.set(this, void 0);
        _Connection_sessions.set(this, new Map());
        _Connection_closed.set(this, false);
        _Connection_manuallyAttached.set(this, new Set());
        _Connection_callbacks.set(this, void 0);
        _Connection_rawErrors.set(this, false);
        __classPrivateFieldSet(this, _Connection_rawErrors, rawErrors, "f");
        __classPrivateFieldSet(this, _Connection_callbacks, new CallbackRegistry(), "f");
        __classPrivateFieldSet(this, _Connection_url, url, "f");
        __classPrivateFieldSet(this, _Connection_delay, delay, "f");
        __classPrivateFieldSet(this, _Connection_timeout, timeout ?? 180000, "f");
        __classPrivateFieldSet(this, _Connection_transport, transport, "f");
        __classPrivateFieldGet(this, _Connection_transport, "f").onmessage = this.onMessage.bind(this);
        __classPrivateFieldGet(this, _Connection_transport, "f").onclose = __classPrivateFieldGet(this, _Connection_instances, "m", _Connection_onClose).bind(this);
    }
    static fromSession(session) {
        return session.connection();
    }
    /**
     * @internal
     */
    get delay() {
        return __classPrivateFieldGet(this, _Connection_delay, "f");
    }
    get timeout() {
        return __classPrivateFieldGet(this, _Connection_timeout, "f");
    }
    /**
     * @internal
     */
    get _closed() {
        return __classPrivateFieldGet(this, _Connection_closed, "f");
    }
    /**
     * @internal
     */
    get _sessions() {
        return __classPrivateFieldGet(this, _Connection_sessions, "f");
    }
    /**
     * @internal
     */
    _session(sessionId) {
        return __classPrivateFieldGet(this, _Connection_sessions, "f").get(sessionId) || null;
    }
    /**
     * @param sessionId - The session id
     * @returns The current CDP session if it exists
     */
    session(sessionId) {
        return this._session(sessionId);
    }
    url() {
        return __classPrivateFieldGet(this, _Connection_url, "f");
    }
    send(method, params, options) {
        // There is only ever 1 param arg passed, but the Protocol defines it as an
        // array of 0 or 1 items See this comment:
        // https://github.com/ChromeDevTools/devtools-protocol/pull/113#issuecomment-412603285
        // which explains why the protocol defines the params this way for better
        // type-inference.
        // So now we check if there are any params or not and deal with them accordingly.
        return this._rawSend(__classPrivateFieldGet(this, _Connection_callbacks, "f"), method, params, undefined, options);
    }
    /**
     * @internal
     */
    _rawSend(callbacks, method, params, sessionId, options) {
        if (__classPrivateFieldGet(this, _Connection_closed, "f")) {
            return Promise.reject(new Error('Protocol error: Connection closed.'));
        }
        return callbacks.create(method, options?.timeout ?? __classPrivateFieldGet(this, _Connection_timeout, "f"), id => {
            const stringifiedMessage = JSON.stringify({
                method,
                params,
                id,
                sessionId,
            });
            debugProtocolSend(stringifiedMessage);
            __classPrivateFieldGet(this, _Connection_transport, "f").send(stringifiedMessage);
        });
    }
    /**
     * @internal
     */
    async closeBrowser() {
        await this.send('Browser.close');
    }
    /**
     * @internal
     */
    async onMessage(message) {
        if (__classPrivateFieldGet(this, _Connection_delay, "f")) {
            await new Promise(r => {
                return setTimeout(r, __classPrivateFieldGet(this, _Connection_delay, "f"));
            });
        }
        debugProtocolReceive(message);
        const object = JSON.parse(message);
        if (object.method === 'Target.attachedToTarget') {
            const sessionId = object.params.sessionId;
            const session = new CdpCDPSession(this, object.params.targetInfo.type, sessionId, object.sessionId, __classPrivateFieldGet(this, _Connection_rawErrors, "f"));
            __classPrivateFieldGet(this, _Connection_sessions, "f").set(sessionId, session);
            this.emit(CDPSessionEvent.SessionAttached, session);
            const parentSession = __classPrivateFieldGet(this, _Connection_sessions, "f").get(object.sessionId);
            if (parentSession) {
                parentSession.emit(CDPSessionEvent.SessionAttached, session);
            }
        }
        else if (object.method === 'Target.detachedFromTarget') {
            const session = __classPrivateFieldGet(this, _Connection_sessions, "f").get(object.params.sessionId);
            if (session) {
                session.onClosed();
                __classPrivateFieldGet(this, _Connection_sessions, "f").delete(object.params.sessionId);
                this.emit(CDPSessionEvent.SessionDetached, session);
                const parentSession = __classPrivateFieldGet(this, _Connection_sessions, "f").get(object.sessionId);
                if (parentSession) {
                    parentSession.emit(CDPSessionEvent.SessionDetached, session);
                }
            }
        }
        if (object.sessionId) {
            const session = __classPrivateFieldGet(this, _Connection_sessions, "f").get(object.sessionId);
            if (session) {
                session.onMessage(object);
            }
        }
        else if (object.id) {
            if (object.error) {
                if (__classPrivateFieldGet(this, _Connection_rawErrors, "f")) {
                    __classPrivateFieldGet(this, _Connection_callbacks, "f").rejectRaw(object.id, object.error);
                }
                else {
                    __classPrivateFieldGet(this, _Connection_callbacks, "f").reject(object.id, createProtocolErrorMessage(object), object.error.message);
                }
            }
            else {
                __classPrivateFieldGet(this, _Connection_callbacks, "f").resolve(object.id, object.result);
            }
        }
        else {
            this.emit(object.method, object.params);
        }
    }
    dispose() {
        __classPrivateFieldGet(this, _Connection_instances, "m", _Connection_onClose).call(this);
        __classPrivateFieldGet(this, _Connection_transport, "f").close();
    }
    /**
     * @internal
     */
    isAutoAttached(targetId) {
        return !__classPrivateFieldGet(this, _Connection_manuallyAttached, "f").has(targetId);
    }
    /**
     * @internal
     */
    async _createSession(targetInfo, isAutoAttachEmulated = true) {
        if (!isAutoAttachEmulated) {
            __classPrivateFieldGet(this, _Connection_manuallyAttached, "f").add(targetInfo.targetId);
        }
        const { sessionId } = await this.send('Target.attachToTarget', {
            targetId: targetInfo.targetId,
            flatten: true,
        });
        __classPrivateFieldGet(this, _Connection_manuallyAttached, "f").delete(targetInfo.targetId);
        const session = __classPrivateFieldGet(this, _Connection_sessions, "f").get(sessionId);
        if (!session) {
            throw new Error('CDPSession creation failed.');
        }
        return session;
    }
    /**
     * @param targetInfo - The target info
     * @returns The CDP session that is created
     */
    async createSession(targetInfo) {
        return await this._createSession(targetInfo, false);
    }
    /**
     * @internal
     */
    getPendingProtocolErrors() {
        const result = [];
        result.push(...__classPrivateFieldGet(this, _Connection_callbacks, "f").getPendingProtocolErrors());
        for (const session of __classPrivateFieldGet(this, _Connection_sessions, "f").values()) {
            result.push(...session.getPendingProtocolErrors());
        }
        return result;
    }
}
_Connection_url = new WeakMap(), _Connection_transport = new WeakMap(), _Connection_delay = new WeakMap(), _Connection_timeout = new WeakMap(), _Connection_sessions = new WeakMap(), _Connection_closed = new WeakMap(), _Connection_manuallyAttached = new WeakMap(), _Connection_callbacks = new WeakMap(), _Connection_rawErrors = new WeakMap(), _Connection_instances = new WeakSet(), _Connection_onClose = function _Connection_onClose() {
    if (__classPrivateFieldGet(this, _Connection_closed, "f")) {
        return;
    }
    __classPrivateFieldSet(this, _Connection_closed, true, "f");
    __classPrivateFieldGet(this, _Connection_transport, "f").onmessage = undefined;
    __classPrivateFieldGet(this, _Connection_transport, "f").onclose = undefined;
    __classPrivateFieldGet(this, _Connection_callbacks, "f").clear();
    for (const session of __classPrivateFieldGet(this, _Connection_sessions, "f").values()) {
        session.onClosed();
    }
    __classPrivateFieldGet(this, _Connection_sessions, "f").clear();
    this.emit(CDPSessionEvent.Disconnected, undefined);
};
/**
 * @internal
 */
export function isTargetClosedError(error) {
    return error instanceof TargetCloseError;
}
//# sourceMappingURL=Connection.js.map
//# sourceMappingURL=Connection.js.map