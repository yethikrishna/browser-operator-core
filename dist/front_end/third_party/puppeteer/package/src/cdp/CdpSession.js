/**
 * @license
 * Copyright 2017 Google Inc.
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
var _CdpCDPSession_sessionId, _CdpCDPSession_targetType, _CdpCDPSession_callbacks, _CdpCDPSession_connection, _CdpCDPSession_parentSessionId, _CdpCDPSession_target, _CdpCDPSession_rawErrors, _CdpCDPSession_detached;
import { CDPSession, CDPSessionEvent, } from '../api/CDPSession.js';
import { CallbackRegistry } from '../common/CallbackRegistry.js';
import { TargetCloseError } from '../common/Errors.js';
import { assert } from '../util/assert.js';
import { createProtocolErrorMessage } from '../util/ErrorLike.js';
/**
 * @internal
 */
export class CdpCDPSession extends CDPSession {
    /**
     * @internal
     */
    constructor(connection, targetType, sessionId, parentSessionId, rawErrors) {
        super();
        _CdpCDPSession_sessionId.set(this, void 0);
        _CdpCDPSession_targetType.set(this, void 0);
        _CdpCDPSession_callbacks.set(this, new CallbackRegistry());
        _CdpCDPSession_connection.set(this, void 0);
        _CdpCDPSession_parentSessionId.set(this, void 0);
        _CdpCDPSession_target.set(this, void 0);
        _CdpCDPSession_rawErrors.set(this, false);
        _CdpCDPSession_detached.set(this, false);
        __classPrivateFieldSet(this, _CdpCDPSession_connection, connection, "f");
        __classPrivateFieldSet(this, _CdpCDPSession_targetType, targetType, "f");
        __classPrivateFieldSet(this, _CdpCDPSession_sessionId, sessionId, "f");
        __classPrivateFieldSet(this, _CdpCDPSession_parentSessionId, parentSessionId, "f");
        __classPrivateFieldSet(this, _CdpCDPSession_rawErrors, rawErrors, "f");
    }
    /**
     * Sets the {@link CdpTarget} associated with the session instance.
     *
     * @internal
     */
    setTarget(target) {
        __classPrivateFieldSet(this, _CdpCDPSession_target, target, "f");
    }
    /**
     * Gets the {@link CdpTarget} associated with the session instance.
     *
     * @internal
     */
    target() {
        assert(__classPrivateFieldGet(this, _CdpCDPSession_target, "f"), 'Target must exist');
        return __classPrivateFieldGet(this, _CdpCDPSession_target, "f");
    }
    connection() {
        return __classPrivateFieldGet(this, _CdpCDPSession_connection, "f");
    }
    get detached() {
        return __classPrivateFieldGet(this, _CdpCDPSession_connection, "f")._closed || __classPrivateFieldGet(this, _CdpCDPSession_detached, "f");
    }
    parentSession() {
        if (!__classPrivateFieldGet(this, _CdpCDPSession_parentSessionId, "f")) {
            // In some cases, e.g., DevTools pages there is no parent session. In this
            // case, we treat the current session as the parent session.
            return this;
        }
        const parent = __classPrivateFieldGet(this, _CdpCDPSession_connection, "f")?.session(__classPrivateFieldGet(this, _CdpCDPSession_parentSessionId, "f"));
        return parent ?? undefined;
    }
    send(method, params, options) {
        if (this.detached) {
            return Promise.reject(new TargetCloseError(`Protocol error (${method}): Session closed. Most likely the ${__classPrivateFieldGet(this, _CdpCDPSession_targetType, "f")} has been closed.`));
        }
        return __classPrivateFieldGet(this, _CdpCDPSession_connection, "f")._rawSend(__classPrivateFieldGet(this, _CdpCDPSession_callbacks, "f"), method, params, __classPrivateFieldGet(this, _CdpCDPSession_sessionId, "f"), options);
    }
    /**
     * @internal
     */
    onMessage(object) {
        if (object.id) {
            if (object.error) {
                if (__classPrivateFieldGet(this, _CdpCDPSession_rawErrors, "f")) {
                    __classPrivateFieldGet(this, _CdpCDPSession_callbacks, "f").rejectRaw(object.id, object.error);
                }
                else {
                    __classPrivateFieldGet(this, _CdpCDPSession_callbacks, "f").reject(object.id, createProtocolErrorMessage(object), object.error.message);
                }
            }
            else {
                __classPrivateFieldGet(this, _CdpCDPSession_callbacks, "f").resolve(object.id, object.result);
            }
        }
        else {
            assert(!object.id);
            this.emit(object.method, object.params);
        }
    }
    /**
     * Detaches the cdpSession from the target. Once detached, the cdpSession object
     * won't emit any events and can't be used to send messages.
     */
    async detach() {
        if (this.detached) {
            throw new Error(`Session already detached. Most likely the ${__classPrivateFieldGet(this, _CdpCDPSession_targetType, "f")} has been closed.`);
        }
        await __classPrivateFieldGet(this, _CdpCDPSession_connection, "f").send('Target.detachFromTarget', {
            sessionId: __classPrivateFieldGet(this, _CdpCDPSession_sessionId, "f"),
        });
        __classPrivateFieldSet(this, _CdpCDPSession_detached, true, "f");
    }
    /**
     * @internal
     */
    onClosed() {
        __classPrivateFieldGet(this, _CdpCDPSession_callbacks, "f").clear();
        __classPrivateFieldSet(this, _CdpCDPSession_detached, true, "f");
        this.emit(CDPSessionEvent.Disconnected, undefined);
    }
    /**
     * Returns the session's id.
     */
    id() {
        return __classPrivateFieldGet(this, _CdpCDPSession_sessionId, "f");
    }
    /**
     * @internal
     */
    getPendingProtocolErrors() {
        return __classPrivateFieldGet(this, _CdpCDPSession_callbacks, "f").getPendingProtocolErrors();
    }
}
_CdpCDPSession_sessionId = new WeakMap(), _CdpCDPSession_targetType = new WeakMap(), _CdpCDPSession_callbacks = new WeakMap(), _CdpCDPSession_connection = new WeakMap(), _CdpCDPSession_parentSessionId = new WeakMap(), _CdpCDPSession_target = new WeakMap(), _CdpCDPSession_rawErrors = new WeakMap(), _CdpCDPSession_detached = new WeakMap();
//# sourceMappingURL=CdpSession.js.map