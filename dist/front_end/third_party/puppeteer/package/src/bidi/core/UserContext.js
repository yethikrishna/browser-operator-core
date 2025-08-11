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
var _UserContext_instances, _UserContext_reason, _UserContext_browsingContexts, _UserContext_disposables, _UserContext_id, _UserContext_initialize, _UserContext_session_get;
import { EventEmitter } from '../../common/EventEmitter.js';
import { assert } from '../../util/assert.js';
import { inertIfDisposed, throwIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
import { BrowsingContext } from './BrowsingContext.js';
/**
 * @internal
 */
export class UserContext extends EventEmitter {
    static create(browser, id) {
        const context = new UserContext(browser, id);
        __classPrivateFieldGet(context, _UserContext_instances, "m", _UserContext_initialize).call(context);
        return context;
    }
    constructor(browser, id) {
        super();
        _UserContext_instances.add(this);
        _UserContext_reason.set(this, void 0);
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
    }, disposeSymbol)]() {
        __classPrivateFieldSet(this, _UserContext_reason, __classPrivateFieldGet(this, _UserContext_reason, "f") ?? 'User context already closed, probably because the browser disconnected/closed.', "f");
        this.emit('closed', { reason: __classPrivateFieldGet(this, _UserContext_reason, "f") });
        __classPrivateFieldGet(this, _UserContext_disposables, "f").dispose();
        super[disposeSymbol]();
    }
}
UserContext.DEFAULT = 'default';
(() => {
    __decorate([
        inertIfDisposed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], UserContext.prototype, "dispose", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _UserContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], UserContext.prototype, "createBrowsingContext", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _UserContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], UserContext.prototype, "remove", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _UserContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], UserContext.prototype, "getCookies", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _UserContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], UserContext.prototype, "setCookie", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _UserContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, String]),
        __metadata("design:returntype", Promise)
    ], UserContext.prototype, "setPermissions", null);
})();
//# sourceMappingURL=UserContext.js.map