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
var _BidiCdpSession_detached, _BidiCdpSession_connection, _BidiCdpSession_sessionId;
import { CDPSession } from '../api/CDPSession.js';
import { TargetCloseError, UnsupportedOperation } from '../common/Errors.js';
import { Deferred } from '../util/Deferred.js';
/**
 * @internal
 */
export class BidiCdpSession extends CDPSession {
    constructor(frame, sessionId) {
        super();
        _BidiCdpSession_detached.set(this, false);
        _BidiCdpSession_connection.set(this, void 0);
        _BidiCdpSession_sessionId.set(this, Deferred.create());
        /**
         * @internal
         */
        this.onClose = () => {
            BidiCdpSession.sessions.delete(this.id());
            __classPrivateFieldSet(this, _BidiCdpSession_detached, true, "f");
        };
        this.frame = frame;
        if (!this.frame.page().browser().cdpSupported) {
            return;
        }
        const connection = this.frame.page().browser().connection;
        __classPrivateFieldSet(this, _BidiCdpSession_connection, connection, "f");
        if (sessionId) {
            __classPrivateFieldGet(this, _BidiCdpSession_sessionId, "f").resolve(sessionId);
            BidiCdpSession.sessions.set(sessionId, this);
        }
        else {
            (async () => {
                try {
                    const { result } = await connection.send('goog:cdp.getSession', {
                        context: frame._id,
                    });
                    __classPrivateFieldGet(this, _BidiCdpSession_sessionId, "f").resolve(result.session);
                    BidiCdpSession.sessions.set(result.session, this);
                }
                catch (error) {
                    __classPrivateFieldGet(this, _BidiCdpSession_sessionId, "f").reject(error);
                }
            })();
        }
        // SAFETY: We never throw #sessionId.
        BidiCdpSession.sessions.set(__classPrivateFieldGet(this, _BidiCdpSession_sessionId, "f").value(), this);
    }
    connection() {
        return undefined;
    }
    get detached() {
        return __classPrivateFieldGet(this, _BidiCdpSession_detached, "f");
    }
    async send(method, params, options) {
        if (__classPrivateFieldGet(this, _BidiCdpSession_connection, "f") === undefined) {
            throw new UnsupportedOperation('CDP support is required for this feature. The current browser does not support CDP.');
        }
        if (__classPrivateFieldGet(this, _BidiCdpSession_detached, "f")) {
            throw new TargetCloseError(`Protocol error (${method}): Session closed. Most likely the page has been closed.`);
        }
        const session = await __classPrivateFieldGet(this, _BidiCdpSession_sessionId, "f").valueOrThrow();
        const { result } = await __classPrivateFieldGet(this, _BidiCdpSession_connection, "f").send('goog:cdp.sendCommand', {
            method: method,
            params: params,
            session,
        }, options?.timeout);
        return result.result;
    }
    async detach() {
        if (__classPrivateFieldGet(this, _BidiCdpSession_connection, "f") === undefined ||
            __classPrivateFieldGet(this, _BidiCdpSession_connection, "f").closed ||
            __classPrivateFieldGet(this, _BidiCdpSession_detached, "f")) {
            return;
        }
        try {
            await this.frame.client.send('Target.detachFromTarget', {
                sessionId: this.id(),
            });
        }
        finally {
            this.onClose();
        }
    }
    id() {
        const value = __classPrivateFieldGet(this, _BidiCdpSession_sessionId, "f").value();
        return typeof value === 'string' ? value : '';
    }
}
_BidiCdpSession_detached = new WeakMap(), _BidiCdpSession_connection = new WeakMap(), _BidiCdpSession_sessionId = new WeakMap();
BidiCdpSession.sessions = new Map();
//# sourceMappingURL=CDPSession.js.map