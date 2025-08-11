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
var _Realm_reason, _WindowRealm_instances, _WindowRealm_workers, _WindowRealm_initialize, _DedicatedWorkerRealm_instances, _a, _DedicatedWorkerRealm_workers, _DedicatedWorkerRealm_initialize, _SharedWorkerRealm_instances, _SharedWorkerRealm_workers, _SharedWorkerRealm_initialize;
import { EventEmitter } from '../../common/EventEmitter.js';
import { inertIfDisposed, throwIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
/**
 * @internal
 */
export class Realm extends EventEmitter {
    constructor(id, origin) {
        super();
        _Realm_reason.set(this, void 0);
        this.disposables = new DisposableStack();
        this.id = id;
        this.origin = origin;
    }
    get disposed() {
        return __classPrivateFieldGet(this, _Realm_reason, "f") !== undefined;
    }
    get target() {
        return { realm: this.id };
    }
    dispose(reason) {
        __classPrivateFieldSet(this, _Realm_reason, reason, "f");
        this[disposeSymbol]();
    }
    async disown(handles) {
        await this.session.send('script.disown', {
            target: this.target,
            handles,
        });
    }
    async callFunction(functionDeclaration, awaitPromise, options = {}) {
        const { result } = await this.session.send('script.callFunction', {
            functionDeclaration,
            awaitPromise,
            target: this.target,
            ...options,
        });
        return result;
    }
    async evaluate(expression, awaitPromise, options = {}) {
        const { result } = await this.session.send('script.evaluate', {
            expression,
            awaitPromise,
            target: this.target,
            ...options,
        });
        return result;
    }
    async resolveExecutionContextId() {
        if (!this.executionContextId) {
            const { result } = await this.session.connection.send('goog:cdp.resolveRealm', { realm: this.id });
            this.executionContextId = result.executionContextId;
        }
        return this.executionContextId;
    }
    [(_Realm_reason = new WeakMap(), disposeSymbol)]() {
        __classPrivateFieldSet(this, _Realm_reason, __classPrivateFieldGet(this, _Realm_reason, "f") ?? 'Realm already destroyed, probably because all associated browsing contexts closed.', "f");
        this.emit('destroyed', { reason: __classPrivateFieldGet(this, _Realm_reason, "f") });
        this.disposables.dispose();
        super[disposeSymbol]();
    }
}
(() => {
    __decorate([
        inertIfDisposed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], Realm.prototype, "dispose", null);
    __decorate([
        throwIfDisposed(realm => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(realm, _Realm_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], Realm.prototype, "disown", null);
    __decorate([
        throwIfDisposed(realm => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(realm, _Realm_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Boolean, Object]),
        __metadata("design:returntype", Promise)
    ], Realm.prototype, "callFunction", null);
    __decorate([
        throwIfDisposed(realm => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(realm, _Realm_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Boolean, Object]),
        __metadata("design:returntype", Promise)
    ], Realm.prototype, "evaluate", null);
    __decorate([
        throwIfDisposed(realm => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(realm, _Realm_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Realm.prototype, "resolveExecutionContextId", null);
})();
/**
 * @internal
 */
export class WindowRealm extends Realm {
    static from(context, sandbox) {
        const realm = new WindowRealm(context, sandbox);
        __classPrivateFieldGet(realm, _WindowRealm_instances, "m", _WindowRealm_initialize).call(realm);
        return realm;
    }
    constructor(context, sandbox) {
        super('', '');
        _WindowRealm_instances.add(this);
        _WindowRealm_workers.set(this, new Map());
        this.browsingContext = context;
        this.sandbox = sandbox;
    }
    get session() {
        return this.browsingContext.userContext.browser.session;
    }
    get target() {
        return { context: this.browsingContext.id, sandbox: this.sandbox };
    }
}
_WindowRealm_workers = new WeakMap(), _WindowRealm_instances = new WeakSet(), _WindowRealm_initialize = function _WindowRealm_initialize() {
    const browsingContextEmitter = this.disposables.use(new EventEmitter(this.browsingContext));
    browsingContextEmitter.on('closed', ({ reason }) => {
        this.dispose(reason);
    });
    const sessionEmitter = this.disposables.use(new EventEmitter(this.session));
    sessionEmitter.on('script.realmCreated', info => {
        if (info.type !== 'window' ||
            info.context !== this.browsingContext.id ||
            info.sandbox !== this.sandbox) {
            return;
        }
        this.id = info.realm;
        this.origin = info.origin;
        this.executionContextId = undefined;
        this.emit('updated', this);
    });
    sessionEmitter.on('script.realmCreated', info => {
        if (info.type !== 'dedicated-worker') {
            return;
        }
        if (!info.owners.includes(this.id)) {
            return;
        }
        const realm = DedicatedWorkerRealm.from(this, info.realm, info.origin);
        __classPrivateFieldGet(this, _WindowRealm_workers, "f").set(realm.id, realm);
        const realmEmitter = this.disposables.use(new EventEmitter(realm));
        realmEmitter.once('destroyed', () => {
            realmEmitter.removeAllListeners();
            __classPrivateFieldGet(this, _WindowRealm_workers, "f").delete(realm.id);
        });
        this.emit('worker', realm);
    });
};
/**
 * @internal
 */
export class DedicatedWorkerRealm extends Realm {
    static from(owner, id, origin) {
        const realm = new _a(owner, id, origin);
        __classPrivateFieldGet(realm, _DedicatedWorkerRealm_instances, "m", _DedicatedWorkerRealm_initialize).call(realm);
        return realm;
    }
    constructor(owner, id, origin) {
        super(id, origin);
        _DedicatedWorkerRealm_instances.add(this);
        _DedicatedWorkerRealm_workers.set(this, new Map());
        this.owners = new Set([owner]);
    }
    get session() {
        // SAFETY: At least one owner will exist.
        return this.owners.values().next().value.session;
    }
}
_a = DedicatedWorkerRealm, _DedicatedWorkerRealm_workers = new WeakMap(), _DedicatedWorkerRealm_instances = new WeakSet(), _DedicatedWorkerRealm_initialize = function _DedicatedWorkerRealm_initialize() {
    const sessionEmitter = this.disposables.use(new EventEmitter(this.session));
    sessionEmitter.on('script.realmDestroyed', info => {
        if (info.realm !== this.id) {
            return;
        }
        this.dispose('Realm already destroyed.');
    });
    sessionEmitter.on('script.realmCreated', info => {
        if (info.type !== 'dedicated-worker') {
            return;
        }
        if (!info.owners.includes(this.id)) {
            return;
        }
        const realm = _a.from(this, info.realm, info.origin);
        __classPrivateFieldGet(this, _DedicatedWorkerRealm_workers, "f").set(realm.id, realm);
        const realmEmitter = this.disposables.use(new EventEmitter(realm));
        realmEmitter.once('destroyed', () => {
            __classPrivateFieldGet(this, _DedicatedWorkerRealm_workers, "f").delete(realm.id);
        });
        this.emit('worker', realm);
    });
};
/**
 * @internal
 */
export class SharedWorkerRealm extends Realm {
    static from(browser, id, origin) {
        const realm = new SharedWorkerRealm(browser, id, origin);
        __classPrivateFieldGet(realm, _SharedWorkerRealm_instances, "m", _SharedWorkerRealm_initialize).call(realm);
        return realm;
    }
    constructor(browser, id, origin) {
        super(id, origin);
        _SharedWorkerRealm_instances.add(this);
        _SharedWorkerRealm_workers.set(this, new Map());
        this.browser = browser;
    }
    get session() {
        return this.browser.session;
    }
}
_SharedWorkerRealm_workers = new WeakMap(), _SharedWorkerRealm_instances = new WeakSet(), _SharedWorkerRealm_initialize = function _SharedWorkerRealm_initialize() {
    const sessionEmitter = this.disposables.use(new EventEmitter(this.session));
    sessionEmitter.on('script.realmDestroyed', info => {
        if (info.realm !== this.id) {
            return;
        }
        this.dispose('Realm already destroyed.');
    });
    sessionEmitter.on('script.realmCreated', info => {
        if (info.type !== 'dedicated-worker') {
            return;
        }
        if (!info.owners.includes(this.id)) {
            return;
        }
        const realm = DedicatedWorkerRealm.from(this, info.realm, info.origin);
        __classPrivateFieldGet(this, _SharedWorkerRealm_workers, "f").set(realm.id, realm);
        const realmEmitter = this.disposables.use(new EventEmitter(realm));
        realmEmitter.once('destroyed', () => {
            __classPrivateFieldGet(this, _SharedWorkerRealm_workers, "f").delete(realm.id);
        });
        this.emit('worker', realm);
    });
};
//# sourceMappingURL=Realm.js.map