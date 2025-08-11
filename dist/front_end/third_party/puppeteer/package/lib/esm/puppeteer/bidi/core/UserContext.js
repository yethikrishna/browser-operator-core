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
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function")
        throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn)
            context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
            context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done)
            throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0)
                continue;
            if (result === null || typeof result !== "object")
                throw new TypeError("Object expected");
            if (_ = accept(result.get))
                descriptor.get = _;
            if (_ = accept(result.set))
                descriptor.set = _;
            if (_ = accept(result.init))
                initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field")
                initializers.unshift(_);
            else
                descriptor[key] = _;
        }
    }
    if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { EventEmitter } from '../../common/EventEmitter.js';
import { assert } from '../../util/assert.js';
import { inertIfDisposed, throwIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
import { BrowsingContext } from './BrowsingContext.js';
/**
 * @internal
 */
let UserContext = (() => {
    var _UserContext_instances, _a, _UserContext_reason, _UserContext_browsingContexts, _UserContext_disposables, _UserContext_id, _UserContext_initialize, _UserContext_session_get;
    let _classSuper = EventEmitter;
    let _instanceExtraInitializers = [];
    let _dispose_decorators;
    let _createBrowsingContext_decorators;
    let _remove_decorators;
    let _getCookies_decorators;
    let _setCookie_decorators;
    let _setPermissions_decorators;
    return _a = class UserContext extends _classSuper {
            static create(browser, id) {
                const context = new _a(browser, id);
                __classPrivateFieldGet(context, _UserContext_instances, "m", _UserContext_initialize).call(context);
                return context;
            }
            constructor(browser, id) {
                super();
                _UserContext_instances.add(this);
                _UserContext_reason.set(this, __runInitializers(this, _instanceExtraInitializers));
                // Note these are only top-level contexts.
                _UserContext_browsingContexts.set(this, new Map());
                _UserContext_disposables.set(this, new DisposableStack());
                _UserContext_id.set(this, void 0);
                __classPrivateFieldSet(this, _UserContext_id, id, "f");
                this.browser = browser;
            }
            get browsingContexts() {
                return __classPrivateFieldGet(this, _UserContext_browsingContexts, "f").values();
            }
            get closed() {
                return __classPrivateFieldGet(this, _UserContext_reason, "f") !== undefined;
            }
            get disposed() {
                return this.closed;
            }
            get id() {
                return __classPrivateFieldGet(this, _UserContext_id, "f");
            }
            dispose(reason) {
                __classPrivateFieldSet(this, _UserContext_reason, reason, "f");
                this[disposeSymbol]();
            }
            async createBrowsingContext(type, options = {}) {
                const { result: { context: contextId }, } = await __classPrivateFieldGet(this, _UserContext_instances, "a", _UserContext_session_get).send('browsingContext.create', {
                    type,
                    ...options,
                    referenceContext: options.referenceContext?.id,
                    userContext: __classPrivateFieldGet(this, _UserContext_id, "f"),
                });
                const browsingContext = __classPrivateFieldGet(this, _UserContext_browsingContexts, "f").get(contextId);
                assert(browsingContext, 'The WebDriver BiDi implementation is failing to create a browsing context correctly.');
                // We use an array to avoid the promise from being awaited.
                return browsingContext;
            }
            async remove() {
                try {
                    await __classPrivateFieldGet(this, _UserContext_instances, "a", _UserContext_session_get).send('browser.removeUserContext', {
                        userContext: __classPrivateFieldGet(this, _UserContext_id, "f"),
                    });
                }
                finally {
                    this.dispose('User context already closed.');
                }
            }
            async getCookies(options = {}, sourceOrigin = undefined) {
                const { result: { cookies }, } = await __classPrivateFieldGet(this, _UserContext_instances, "a", _UserContext_session_get).send('storage.getCookies', {
                    ...options,
                    partition: {
                        type: 'storageKey',
                        userContext: __classPrivateFieldGet(this, _UserContext_id, "f"),
                        sourceOrigin,
                    },
                });
                return cookies;
            }
            async setCookie(cookie, sourceOrigin) {
                await __classPrivateFieldGet(this, _UserContext_instances, "a", _UserContext_session_get).send('storage.setCookie', {
                    cookie,
                    partition: {
                        type: 'storageKey',
                        sourceOrigin,
                        userContext: this.id,
                    },
                });
            }
            async setPermissions(origin, descriptor, state) {
                await __classPrivateFieldGet(this, _UserContext_instances, "a", _UserContext_session_get).send('permissions.setPermission', {
                    origin,
                    descriptor,
                    state,
                    userContext: __classPrivateFieldGet(this, _UserContext_id, "f"),
                });
            }
            [(_UserContext_reason = new WeakMap(), _UserContext_browsingContexts = new WeakMap(), _UserContext_disposables = new WeakMap(), _UserContext_id = new WeakMap(), _UserContext_instances = new WeakSet(), _UserContext_initialize = function _UserContext_initialize() {
                const browserEmitter = __classPrivateFieldGet(this, _UserContext_disposables, "f").use(new EventEmitter(this.browser));
                browserEmitter.once('closed', ({ reason }) => {
                    this.dispose(`User context was closed: ${reason}`);
                });
                browserEmitter.once('disconnected', ({ reason }) => {
                    this.dispose(`User context was closed: ${reason}`);
                });
                const sessionEmitter = __classPrivateFieldGet(this, _UserContext_disposables, "f").use(new EventEmitter(__classPrivateFieldGet(this, _UserContext_instances, "a", _UserContext_session_get)));
                sessionEmitter.on('browsingContext.contextCreated', info => {
                    if (info.parent) {
                        return;
                    }
                    if (info.userContext !== __classPrivateFieldGet(this, _UserContext_id, "f")) {
                        return;
                    }
                    const browsingContext = BrowsingContext.from(this, undefined, info.context, info.url, info.originalOpener);
                    __classPrivateFieldGet(this, _UserContext_browsingContexts, "f").set(browsingContext.id, browsingContext);
                    const browsingContextEmitter = __classPrivateFieldGet(this, _UserContext_disposables, "f").use(new EventEmitter(browsingContext));
                    browsingContextEmitter.on('closed', () => {
                        browsingContextEmitter.removeAllListeners();
                        __classPrivateFieldGet(this, _UserContext_browsingContexts, "f").delete(browsingContext.id);
                    });
                    this.emit('browsingcontext', { browsingContext });
                });
            }, _UserContext_session_get = function _UserContext_session_get() {
                return this.browser.session;
            }, _dispose_decorators = [inertIfDisposed], _createBrowsingContext_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _UserContext_reason, "f");
                })], _remove_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _UserContext_reason, "f");
                })], _getCookies_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _UserContext_reason, "f");
                })], _setCookie_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _UserContext_reason, "f");
                })], _setPermissions_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _UserContext_reason, "f");
                })], disposeSymbol)]() {
                __classPrivateFieldSet(this, _UserContext_reason, __classPrivateFieldGet(this, _UserContext_reason, "f") ?? 'User context already closed, probably because the browser disconnected/closed.', "f");
                this.emit('closed', { reason: __classPrivateFieldGet(this, _UserContext_reason, "f") });
                __classPrivateFieldGet(this, _UserContext_disposables, "f").dispose();
                super[disposeSymbol]();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(_a, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: obj => "dispose" in obj, get: obj => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createBrowsingContext_decorators, { kind: "method", name: "createBrowsingContext", static: false, private: false, access: { has: obj => "createBrowsingContext" in obj, get: obj => obj.createBrowsingContext }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getCookies_decorators, { kind: "method", name: "getCookies", static: false, private: false, access: { has: obj => "getCookies" in obj, get: obj => obj.getCookies }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setCookie_decorators, { kind: "method", name: "setCookie", static: false, private: false, access: { has: obj => "setCookie" in obj, get: obj => obj.setCookie }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setPermissions_decorators, { kind: "method", name: "setPermissions", static: false, private: false, access: { has: obj => "setPermissions" in obj, get: obj => obj.setPermissions }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata)
                Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.DEFAULT = 'default',
        _a;
})();
export { UserContext };
//# sourceMappingURL=UserContext.js.map
//# sourceMappingURL=UserContext.js.map