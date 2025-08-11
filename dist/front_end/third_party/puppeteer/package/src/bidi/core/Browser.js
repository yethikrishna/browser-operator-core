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
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
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
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
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
var _Browser_instances, _Browser_closed, _Browser_reason, _Browser_disposables, _Browser_userContexts, _Browser_sharedWorkers, _Browser_initialize, _Browser_syncUserContexts, _Browser_syncBrowsingContexts, _Browser_createUserContext;
import { EventEmitter } from '../../common/EventEmitter.js';
import { inertIfDisposed, throwIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
import { SharedWorkerRealm } from './Realm.js';
import { UserContext } from './UserContext.js';
/**
 * @internal
 */
export class Browser extends EventEmitter {
    static async from(session) {
        const browser = new Browser(session);
        await __classPrivateFieldGet(browser, _Browser_instances, "m", _Browser_initialize).call(browser);
        return browser;
    }
    constructor(session) {
        super();
        _Browser_instances.add(this);
        _Browser_closed.set(this, false);
        _Browser_reason.set(this, void 0);
        _Browser_disposables.set(this, new DisposableStack());
        _Browser_userContexts.set(this, new Map());
        _Browser_sharedWorkers.set(this, new Map());
        this.session = session;
    }
    get closed() {
        return __classPrivateFieldGet(this, _Browser_closed, "f");
    }
    get defaultUserContext() {
        // SAFETY: A UserContext is always created for the default context.
        return __classPrivateFieldGet(this, _Browser_userContexts, "f").get(UserContext.DEFAULT);
    }
    get disconnected() {
        return __classPrivateFieldGet(this, _Browser_reason, "f") !== undefined;
    }
    get disposed() {
        return this.disconnected;
    }
    get userContexts() {
        return __classPrivateFieldGet(this, _Browser_userContexts, "f").values();
    }
    dispose(reason, closed = false) {
        __classPrivateFieldSet(this, _Browser_closed, closed, "f");
        __classPrivateFieldSet(this, _Browser_reason, reason, "f");
        this[disposeSymbol]();
    }
    async close() {
        try {
            await this.session.send('browser.close', {});
        }
        finally {
            this.dispose('Browser already closed.', true);
        }
    }
    async addPreloadScript(functionDeclaration, options = {}) {
        const { result: { script }, } = await this.session.send('script.addPreloadScript', {
            functionDeclaration,
            ...options,
            contexts: options.contexts?.map(context => {
                return context.id;
            }),
        });
        return script;
    }
    async removeIntercept(intercept) {
        await this.session.send('network.removeIntercept', {
            intercept,
        });
    }
    async removePreloadScript(script) {
        await this.session.send('script.removePreloadScript', {
            script,
        });
    }
    async createUserContext(options) {
        const proxyConfig = options.proxyServer === undefined
            ? undefined
            : {
                proxyType: 'manual',
                httpProxy: options.proxyServer,
                sslProxy: options.proxyServer,
                noProxy: options.proxyBypassList,
            };
        const { result: { userContext: context }, } = await this.session.send('browser.createUserContext', {
            proxy: proxyConfig,
        });
        return __classPrivateFieldGet(this, _Browser_instances, "m", _Browser_createUserContext).call(this, context);
    }
    async installExtension(path) {
        const { result: { extension }, } = await this.session.send('webExtension.install', {
            extensionData: { type: 'path', path },
        });
        return extension;
    }
    async uninstallExtension(id) {
        await this.session.send('webExtension.uninstall', { extension: id });
    }
    [(_Browser_closed = new WeakMap(), _Browser_reason = new WeakMap(), _Browser_disposables = new WeakMap(), _Browser_userContexts = new WeakMap(), _Browser_sharedWorkers = new WeakMap(), _Browser_instances = new WeakSet(), _Browser_initialize = async function _Browser_initialize() {
        const sessionEmitter = __classPrivateFieldGet(this, _Browser_disposables, "f").use(new EventEmitter(this.session));
        sessionEmitter.once('ended', ({ reason }) => {
            this.dispose(reason);
        });
        sessionEmitter.on('script.realmCreated', info => {
            if (info.type !== 'shared-worker') {
                return;
            }
            __classPrivateFieldGet(this, _Browser_sharedWorkers, "f").set(info.realm, SharedWorkerRealm.from(this, info.realm, info.origin));
        });
        await __classPrivateFieldGet(this, _Browser_instances, "m", _Browser_syncUserContexts).call(this);
        await __classPrivateFieldGet(this, _Browser_instances, "m", _Browser_syncBrowsingContexts).call(this);
    }, _Browser_syncUserContexts = async function _Browser_syncUserContexts() {
        const { result: { userContexts }, } = await this.session.send('browser.getUserContexts', {});
        for (const context of userContexts) {
            __classPrivateFieldGet(this, _Browser_instances, "m", _Browser_createUserContext).call(this, context.userContext);
        }
    }, _Browser_syncBrowsingContexts = async function _Browser_syncBrowsingContexts() {
        // In case contexts are created or destroyed during `getTree`, we use this
        // set to detect them.
        const contextIds = new Set();
        let contexts;
        {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const sessionEmitter = __addDisposableResource(env_1, new EventEmitter(this.session), false);
                sessionEmitter.on('browsingContext.contextCreated', info => {
                    contextIds.add(info.context);
                });
                const { result } = await this.session.send('browsingContext.getTree', {});
                contexts = result.contexts;
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                __disposeResources(env_1);
            }
        }
        // Simulating events so contexts are created naturally.
        for (const info of contexts) {
            if (!contextIds.has(info.context)) {
                this.session.emit('browsingContext.contextCreated', info);
            }
            if (info.children) {
                contexts.push(...info.children);
            }
        }
    }, _Browser_createUserContext = function _Browser_createUserContext(id) {
        const userContext = UserContext.create(this, id);
        __classPrivateFieldGet(this, _Browser_userContexts, "f").set(userContext.id, userContext);
        const userContextEmitter = __classPrivateFieldGet(this, _Browser_disposables, "f").use(new EventEmitter(userContext));
        userContextEmitter.once('closed', () => {
            userContextEmitter.removeAllListeners();
            __classPrivateFieldGet(this, _Browser_userContexts, "f").delete(userContext.id);
        });
        return userContext;
    }, disposeSymbol)]() {
        __classPrivateFieldSet(this, _Browser_reason, __classPrivateFieldGet(this, _Browser_reason, "f") ?? 'Browser was disconnected, probably because the session ended.', "f");
        if (this.closed) {
            this.emit('closed', { reason: __classPrivateFieldGet(this, _Browser_reason, "f") });
        }
        this.emit('disconnected', { reason: __classPrivateFieldGet(this, _Browser_reason, "f") });
        __classPrivateFieldGet(this, _Browser_disposables, "f").dispose();
        super[disposeSymbol]();
    }
}
(() => {
    __decorate([
        inertIfDisposed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], Browser.prototype, "dispose", null);
    __decorate([
        throwIfDisposed(browser => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(browser, _Browser_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Browser.prototype, "close", null);
    __decorate([
        throwIfDisposed(browser => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(browser, _Browser_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], Browser.prototype, "addPreloadScript", null);
    __decorate([
        throwIfDisposed(browser => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(browser, _Browser_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], Browser.prototype, "removeIntercept", null);
    __decorate([
        throwIfDisposed(browser => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(browser, _Browser_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], Browser.prototype, "removePreloadScript", null);
    __decorate([
        throwIfDisposed(browser => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(browser, _Browser_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], Browser.prototype, "createUserContext", null);
    __decorate([
        throwIfDisposed(browser => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(browser, _Browser_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], Browser.prototype, "installExtension", null);
    __decorate([
        throwIfDisposed(browser => {
            // SAFETY: By definition of `disposed`, `#reason` is defined.
            return __classPrivateFieldGet(browser, _Browser_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], Browser.prototype, "uninstallExtension", null);
})();
//# sourceMappingURL=Browser.js.map