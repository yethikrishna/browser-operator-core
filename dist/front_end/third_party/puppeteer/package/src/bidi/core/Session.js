/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var _Session_instances, _Session_reason, _Session_disposables, _Session_info, _Session_initialize, _Session_connection_accessor_storage;
var _a;
import { EventEmitter } from '../../common/EventEmitter.js';
import { bubble, inertIfDisposed, throwIfDisposed, } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
import { Browser } from './Browser.js';
/**
 * @internal
 */
export class Session extends EventEmitter {
    static async from(connection, capabilities) {
        const { result } = await connection.send('session.new', {
            capabilities,
        });
        const session = new Session(connection, result);
        await __classPrivateFieldGet(session, _Session_instances, "m", _Session_initialize).call(session);
        return session;
    }
    get connection() { return __classPrivateFieldGet(this, _Session_connection_accessor_storage, "f"); }
    set connection(value) { __classPrivateFieldSet(this, _Session_connection_accessor_storage, value, "f"); }
    constructor(connection, info) {
        super();
        _Session_instances.add(this);
        _Session_reason.set(this, void 0);
        _Session_disposables.set(this, new DisposableStack());
        _Session_info.set(this, void 0);
        _Session_connection_accessor_storage.set(this, void 0);
        __classPrivateFieldSet(this, _Session_info, info, "f");
        this.connection = connection;
    }
    get capabilities() {
        return __classPrivateFieldGet(this, _Session_info, "f").capabilities;
    }
    get disposed() {
        return this.ended;
    }
    get ended() {
        return __classPrivateFieldGet(this, _Session_reason, "f") !== undefined;
    }
    get id() {
        return __classPrivateFieldGet(this, _Session_info, "f").sessionId;
    }
    dispose(reason) {
        __classPrivateFieldSet(this, _Session_reason, reason, "f");
        this[disposeSymbol]();
    }
    /**
     * Currently, there is a 1:1 relationship between the session and the
     * session. In the future, we might support multiple sessions and in that
     * case we always needs to make sure that the session for the right session
     * object is used, so we implement this method here, although it's not defined
     * in the spec.
     */
    async send(method, params) {
        return await this.connection.send(method, params);
    }
    async subscribe(events, contexts) {
        await this.send('session.subscribe', {
            events,
            contexts,
        });
    }
    async addIntercepts(events, contexts) {
        await this.send('session.subscribe', {
            events,
            contexts,
        });
    }
    async end() {
        try {
            await this.send('session.end', {});
        }
        finally {
            this.dispose(`Session already ended.`);
        }
    }
    [(_Session_reason = new WeakMap(), _Session_disposables = new WeakMap(), _Session_info = new WeakMap(), _Session_instances = new WeakSet(), _Session_connection_accessor_storage = new WeakMap(), _Session_initialize = async function _Session_initialize() {
        // SAFETY: We use `any` to allow assignment of the readonly property.
        this.browser = await Browser.from(this);
        const browserEmitter = __classPrivateFieldGet(this, _Session_disposables, "f").use(this.browser);
        browserEmitter.once('closed', ({ reason }) => {
            this.dispose(reason);
        });
        // TODO: Currently, some implementations do not emit navigationStarted event
        // for fragment navigations (as per spec) and some do. This could emits a
        // synthetic navigationStarted to work around this inconsistency.
        const seen = new WeakSet();
        this.on('browsingContext.fragmentNavigated', info => {
            if (seen.has(info)) {
                return;
            }
            seen.add(info);
            this.emit('browsingContext.navigationStarted', info);
            this.emit('browsingContext.fragmentNavigated', info);
        });
    }, disposeSymbol)]() {
        __classPrivateFieldSet(this, _Session_reason, __classPrivateFieldGet(this, _Session_reason, "f") ?? 'Session already destroyed, probably because the connection broke.', "f");
        this.emit('ended', { reason: __classPrivateFieldGet(this, _Session_reason, "f") });
        __classPrivateFieldGet(this, _Session_disposables, "f").dispose();
        super[disposeSymbol]();
    }
}
(() => {
    __decorate([
        bubble(),
        __metadata("design:type", Object)
    ], Session.prototype, "connection", null);
    __decorate([
        inertIfDisposed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], Session.prototype, "dispose", null);
    __decorate([
        throwIfDisposed(session => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(session, _Session_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_a = typeof T !== "undefined" && T) === "function" ? _a : Object, Object]),
        __metadata("design:returntype", Promise)
    ], Session.prototype, "send", null);
    __decorate([
        throwIfDisposed(session => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(session, _Session_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Array]),
        __metadata("design:returntype", Promise)
    ], Session.prototype, "subscribe", null);
    __decorate([
        throwIfDisposed(session => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(session, _Session_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Array]),
        __metadata("design:returntype", Promise)
    ], Session.prototype, "addIntercepts", null);
    __decorate([
        throwIfDisposed(session => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(session, _Session_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Session.prototype, "end", null);
})();
//# sourceMappingURL=Session.js.map