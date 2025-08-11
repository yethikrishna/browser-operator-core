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
var _BrowsingContext_instances, _a, _BrowsingContext_navigation, _BrowsingContext_reason, _BrowsingContext_url, _BrowsingContext_children, _BrowsingContext_disposables, _BrowsingContext_realms, _BrowsingContext_requests, _BrowsingContext_initialize, _BrowsingContext_session_get, _BrowsingContext_createWindowRealm;
var _b;
import { EventEmitter } from '../../common/EventEmitter.js';
import { inertIfDisposed, throwIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
import { Navigation } from './Navigation.js';
import { WindowRealm } from './Realm.js';
import { Request } from './Request.js';
import { UserPrompt } from './UserPrompt.js';
/**
 * @internal
 */
export class BrowsingContext extends EventEmitter {
    static from(userContext, parent, id, url, originalOpener) {
        const browsingContext = new _a(userContext, parent, id, url, originalOpener);
        __classPrivateFieldGet(browsingContext, _BrowsingContext_instances, "m", _BrowsingContext_initialize).call(browsingContext);
        return browsingContext;
    }
    constructor(context, parent, id, url, originalOpener) {
        super();
        _BrowsingContext_instances.add(this);
        _BrowsingContext_navigation.set(this, void 0);
        _BrowsingContext_reason.set(this, void 0);
        _BrowsingContext_url.set(this, void 0);
        _BrowsingContext_children.set(this, new Map());
        _BrowsingContext_disposables.set(this, new DisposableStack());
        _BrowsingContext_realms.set(this, new Map());
        _BrowsingContext_requests.set(this, new Map());
        __classPrivateFieldSet(this, _BrowsingContext_url, url, "f");
        this.id = id;
        this.parent = parent;
        this.userContext = context;
        this.originalOpener = originalOpener;
        this.defaultRealm = __classPrivateFieldGet(this, _BrowsingContext_instances, "m", _BrowsingContext_createWindowRealm).call(this);
    }
    get children() {
        return __classPrivateFieldGet(this, _BrowsingContext_children, "f").values();
    }
    get closed() {
        return __classPrivateFieldGet(this, _BrowsingContext_reason, "f") !== undefined;
    }
    get disposed() {
        return this.closed;
    }
    get realms() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias -- Required
        const self = this;
        return (function* () {
            yield self.defaultRealm;
            yield* __classPrivateFieldGet(self, _BrowsingContext_realms, "f").values();
        })();
    }
    get top() {
        let context = this;
        for (let { parent } = context; parent; { parent } = context) {
            context = parent;
        }
        return context;
    }
    get url() {
        return __classPrivateFieldGet(this, _BrowsingContext_url, "f");
    }
    dispose(reason) {
        __classPrivateFieldSet(this, _BrowsingContext_reason, reason, "f");
        for (const context of __classPrivateFieldGet(this, _BrowsingContext_children, "f").values()) {
            context.dispose('Parent browsing context was disposed');
        }
        this[disposeSymbol]();
    }
    async activate() {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('browsingContext.activate', {
            context: this.id,
        });
    }
    async captureScreenshot(options = {}) {
        const { result: { data }, } = await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('browsingContext.captureScreenshot', {
            context: this.id,
            ...options,
        });
        return data;
    }
    async close(promptUnload) {
        await Promise.all([...__classPrivateFieldGet(this, _BrowsingContext_children, "f").values()].map(async (child) => {
            await child.close(promptUnload);
        }));
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('browsingContext.close', {
            context: this.id,
            promptUnload,
        });
    }
    async traverseHistory(delta) {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('browsingContext.traverseHistory', {
            context: this.id,
            delta,
        });
    }
    async navigate(url, wait) {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('browsingContext.navigate', {
            context: this.id,
            url,
            wait,
        });
    }
    async reload(options = {}) {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('browsingContext.reload', {
            context: this.id,
            ...options,
        });
    }
    async setCacheBehavior(cacheBehavior) {
        // @ts-expect-error not in BiDi types yet.
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('network.setCacheBehavior', {
            contexts: [this.id],
            cacheBehavior,
        });
    }
    async print(options = {}) {
        const { result: { data }, } = await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('browsingContext.print', {
            context: this.id,
            ...options,
        });
        return data;
    }
    async handleUserPrompt(options = {}) {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('browsingContext.handleUserPrompt', {
            context: this.id,
            ...options,
        });
    }
    async setViewport(options = {}) {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('browsingContext.setViewport', {
            context: this.id,
            ...options,
        });
    }
    async performActions(actions) {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('input.performActions', {
            context: this.id,
            actions,
        });
    }
    async releaseActions() {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('input.releaseActions', {
            context: this.id,
        });
    }
    createWindowRealm(sandbox) {
        return __classPrivateFieldGet(this, _BrowsingContext_instances, "m", _BrowsingContext_createWindowRealm).call(this, sandbox);
    }
    async addPreloadScript(functionDeclaration, options = {}) {
        return await this.userContext.browser.addPreloadScript(functionDeclaration, {
            ...options,
            contexts: [this],
        });
    }
    async addIntercept(options) {
        const { result: { intercept }, } = await this.userContext.browser.session.send('network.addIntercept', {
            ...options,
            contexts: [this.id],
        });
        return intercept;
    }
    async removePreloadScript(script) {
        await this.userContext.browser.removePreloadScript(script);
    }
    async setGeolocationOverride(options) {
        if (!('coordinates' in options)) {
            throw new Error('Missing coordinates');
        }
        await this.userContext.browser.session.send('emulation.setGeolocationOverride', {
            coordinates: options.coordinates,
            contexts: [this.id],
        });
    }
    async getCookies(options = {}) {
        const { result: { cookies }, } = await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('storage.getCookies', {
            ...options,
            partition: {
                type: 'context',
                context: this.id,
            },
        });
        return cookies;
    }
    async setCookie(cookie) {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('storage.setCookie', {
            cookie,
            partition: {
                type: 'context',
                context: this.id,
            },
        });
    }
    async setFiles(element, files) {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('input.setFiles', {
            context: this.id,
            element,
            files,
        });
    }
    async subscribe(events) {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).subscribe(events, [this.id]);
    }
    async addInterception(events) {
        await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).subscribe(events, [this.id]);
    }
    [(_BrowsingContext_navigation = new WeakMap(), _BrowsingContext_reason = new WeakMap(), _BrowsingContext_url = new WeakMap(), _BrowsingContext_children = new WeakMap(), _BrowsingContext_disposables = new WeakMap(), _BrowsingContext_realms = new WeakMap(), _BrowsingContext_requests = new WeakMap(), _BrowsingContext_instances = new WeakSet(), _BrowsingContext_initialize = function _BrowsingContext_initialize() {
        const userContextEmitter = __classPrivateFieldGet(this, _BrowsingContext_disposables, "f").use(new EventEmitter(this.userContext));
        userContextEmitter.once('closed', ({ reason }) => {
            this.dispose(`Browsing context already closed: ${reason}`);
        });
        const sessionEmitter = __classPrivateFieldGet(this, _BrowsingContext_disposables, "f").use(new EventEmitter(__classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get)));
        sessionEmitter.on('input.fileDialogOpened', info => {
            if (this.id !== info.context) {
                return;
            }
            this.emit('filedialogopened', info);
        });
        sessionEmitter.on('browsingContext.contextCreated', info => {
            if (info.parent !== this.id) {
                return;
            }
            const browsingContext = _a.from(this.userContext, this, info.context, info.url, info.originalOpener);
            __classPrivateFieldGet(this, _BrowsingContext_children, "f").set(info.context, browsingContext);
            const browsingContextEmitter = __classPrivateFieldGet(this, _BrowsingContext_disposables, "f").use(new EventEmitter(browsingContext));
            browsingContextEmitter.once('closed', () => {
                browsingContextEmitter.removeAllListeners();
                __classPrivateFieldGet(this, _BrowsingContext_children, "f").delete(browsingContext.id);
            });
            this.emit('browsingcontext', { browsingContext });
        });
        sessionEmitter.on('browsingContext.contextDestroyed', info => {
            if (info.context !== this.id) {
                return;
            }
            this.dispose('Browsing context already closed.');
        });
        sessionEmitter.on('browsingContext.historyUpdated', info => {
            if (info.context !== this.id) {
                return;
            }
            __classPrivateFieldSet(this, _BrowsingContext_url, info.url, "f");
            this.emit('historyUpdated', undefined);
        });
        sessionEmitter.on('browsingContext.domContentLoaded', info => {
            if (info.context !== this.id) {
                return;
            }
            __classPrivateFieldSet(this, _BrowsingContext_url, info.url, "f");
            this.emit('DOMContentLoaded', undefined);
        });
        sessionEmitter.on('browsingContext.load', info => {
            if (info.context !== this.id) {
                return;
            }
            __classPrivateFieldSet(this, _BrowsingContext_url, info.url, "f");
            this.emit('load', undefined);
        });
        sessionEmitter.on('browsingContext.navigationStarted', info => {
            if (info.context !== this.id) {
                return;
            }
            // Note: we should not update this.#url at this point since the context
            // has not finished navigating to the info.url yet.
            for (const [id, request] of __classPrivateFieldGet(this, _BrowsingContext_requests, "f")) {
                if (request.disposed) {
                    __classPrivateFieldGet(this, _BrowsingContext_requests, "f").delete(id);
                }
            }
            // If the navigation hasn't finished, then this is nested navigation. The
            // current navigation will handle this.
            if (__classPrivateFieldGet(this, _BrowsingContext_navigation, "f") !== undefined && !__classPrivateFieldGet(this, _BrowsingContext_navigation, "f").disposed) {
                return;
            }
            // Note the navigation ID is null for this event.
            __classPrivateFieldSet(this, _BrowsingContext_navigation, Navigation.from(this), "f");
            const navigationEmitter = __classPrivateFieldGet(this, _BrowsingContext_disposables, "f").use(new EventEmitter(__classPrivateFieldGet(this, _BrowsingContext_navigation, "f")));
            for (const eventName of ['fragment', 'failed', 'aborted']) {
                navigationEmitter.once(eventName, ({ url }) => {
                    navigationEmitter[disposeSymbol]();
                    __classPrivateFieldSet(this, _BrowsingContext_url, url, "f");
                });
            }
            this.emit('navigation', { navigation: __classPrivateFieldGet(this, _BrowsingContext_navigation, "f") });
        });
        sessionEmitter.on('network.beforeRequestSent', event => {
            if (event.context !== this.id) {
                return;
            }
            if (__classPrivateFieldGet(this, _BrowsingContext_requests, "f").has(event.request.request)) {
                // Means the request is a redirect. This is handled in Request.
                // Or an Auth event was issued
                return;
            }
            const request = Request.from(this, event);
            __classPrivateFieldGet(this, _BrowsingContext_requests, "f").set(request.id, request);
            this.emit('request', { request });
        });
        sessionEmitter.on('log.entryAdded', entry => {
            if (entry.source.context !== this.id) {
                return;
            }
            this.emit('log', { entry });
        });
        sessionEmitter.on('browsingContext.userPromptOpened', info => {
            if (info.context !== this.id) {
                return;
            }
            const userPrompt = UserPrompt.from(this, info);
            this.emit('userprompt', { userPrompt });
        });
    }, _BrowsingContext_session_get = function _BrowsingContext_session_get() {
        return this.userContext.browser.session;
    }, _BrowsingContext_createWindowRealm = function _BrowsingContext_createWindowRealm(sandbox) {
        const realm = WindowRealm.from(this, sandbox);
        realm.on('worker', realm => {
            this.emit('worker', { realm });
        });
        return realm;
    }, disposeSymbol)]() {
        __classPrivateFieldSet(this, _BrowsingContext_reason, __classPrivateFieldGet(this, _BrowsingContext_reason, "f") ?? 'Browsing context already closed, probably because the user context closed.', "f");
        this.emit('closed', { reason: __classPrivateFieldGet(this, _BrowsingContext_reason, "f") });
        __classPrivateFieldGet(this, _BrowsingContext_disposables, "f").dispose();
        super[disposeSymbol]();
    }
    async deleteCookie(...cookieFilters) {
        await Promise.all(cookieFilters.map(async (filter) => {
            await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('storage.deleteCookies', {
                filter: filter,
                partition: {
                    type: 'context',
                    context: this.id,
                },
            });
        }));
    }
    async locateNodes(locator, startNodes) {
        // TODO: add other locateNodes options if needed.
        const result = await __classPrivateFieldGet(this, _BrowsingContext_instances, "a", _BrowsingContext_session_get).send('browsingContext.locateNodes', {
            context: this.id,
            locator,
            startNodes: startNodes.length ? startNodes : undefined,
        });
        return result.result.nodes;
    }
}
_a = BrowsingContext;
(() => {
    __decorate([
        inertIfDisposed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], BrowsingContext.prototype, "dispose", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "activate", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "captureScreenshot", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Boolean]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "close", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "traverseHistory", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "navigate", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "reload", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "setCacheBehavior", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "print", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "handleUserPrompt", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "setViewport", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "performActions", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "releaseActions", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", WindowRealm)
    ], BrowsingContext.prototype, "createWindowRealm", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "addPreloadScript", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "addIntercept", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "removePreloadScript", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_b = typeof SetGeoLocationOverrideOptions !== "undefined" && SetGeoLocationOverrideOptions) === "function" ? _b : Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "setGeolocationOverride", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "getCookies", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "setCookie", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Array]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "setFiles", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "subscribe", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "addInterception", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "deleteCookie", null);
    __decorate([
        throwIfDisposed(context => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Array]),
        __metadata("design:returntype", Promise)
    ], BrowsingContext.prototype, "locateNodes", null);
})();
//# sourceMappingURL=BrowsingContext.js.map