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
import { inertIfDisposed, throwIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
import { Navigation } from './Navigation.js';
import { WindowRealm } from './Realm.js';
import { Request } from './Request.js';
import { UserPrompt } from './UserPrompt.js';
/**
 * @internal
 */
let BrowsingContext = (() => {
    var _BrowsingContext_instances, _b, _BrowsingContext_navigation, _BrowsingContext_reason, _BrowsingContext_url, _BrowsingContext_children, _BrowsingContext_disposables, _BrowsingContext_realms, _BrowsingContext_requests, _BrowsingContext_initialize, _BrowsingContext_session_get, _BrowsingContext_createWindowRealm;
    var _a;
    let _classSuper = EventEmitter;
    let _instanceExtraInitializers = [];
    let _dispose_decorators;
    let _activate_decorators;
    let _captureScreenshot_decorators;
    let _close_decorators;
    let _traverseHistory_decorators;
    let _navigate_decorators;
    let _reload_decorators;
    let _setCacheBehavior_decorators;
    let _print_decorators;
    let _handleUserPrompt_decorators;
    let _setViewport_decorators;
    let _performActions_decorators;
    let _releaseActions_decorators;
    let _createWindowRealm_decorators;
    let _addPreloadScript_decorators;
    let _addIntercept_decorators;
    let _removePreloadScript_decorators;
    let _setGeolocationOverride_decorators;
    let _getCookies_decorators;
    let _setCookie_decorators;
    let _setFiles_decorators;
    let _subscribe_decorators;
    let _addInterception_decorators;
    let _deleteCookie_decorators;
    let _locateNodes_decorators;
    return _b = class BrowsingContext extends _classSuper {
            static from(userContext, parent, id, url, originalOpener) {
                const browsingContext = new _b(userContext, parent, id, url, originalOpener);
                __classPrivateFieldGet(browsingContext, _BrowsingContext_instances, "m", _BrowsingContext_initialize).call(browsingContext);
                return browsingContext;
            }
            constructor(context, parent, id, url, originalOpener) {
                super();
                _BrowsingContext_instances.add(this);
                _BrowsingContext_navigation.set(this, __runInitializers(this, _instanceExtraInitializers));
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
                    const browsingContext = _b.from(this.userContext, this, info.context, info.url, info.originalOpener);
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
            }, _dispose_decorators = [inertIfDisposed], _activate_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _captureScreenshot_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _close_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _traverseHistory_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _navigate_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _reload_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _setCacheBehavior_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _print_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _handleUserPrompt_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _setViewport_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _performActions_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _releaseActions_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _createWindowRealm_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _addPreloadScript_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _addIntercept_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _removePreloadScript_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _setGeolocationOverride_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _getCookies_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _setCookie_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _setFiles_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _subscribe_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], _addInterception_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })], disposeSymbol)]() {
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
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _deleteCookie_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })];
            _locateNodes_decorators = [throwIfDisposed(context => {
                    // SAFETY: Disposal implies this exists.
                    return __classPrivateFieldGet(context, _BrowsingContext_reason, "f");
                })];
            __esDecorate(_b, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: obj => "dispose" in obj, get: obj => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _activate_decorators, { kind: "method", name: "activate", static: false, private: false, access: { has: obj => "activate" in obj, get: obj => obj.activate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _captureScreenshot_decorators, { kind: "method", name: "captureScreenshot", static: false, private: false, access: { has: obj => "captureScreenshot" in obj, get: obj => obj.captureScreenshot }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _close_decorators, { kind: "method", name: "close", static: false, private: false, access: { has: obj => "close" in obj, get: obj => obj.close }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _traverseHistory_decorators, { kind: "method", name: "traverseHistory", static: false, private: false, access: { has: obj => "traverseHistory" in obj, get: obj => obj.traverseHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _navigate_decorators, { kind: "method", name: "navigate", static: false, private: false, access: { has: obj => "navigate" in obj, get: obj => obj.navigate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _reload_decorators, { kind: "method", name: "reload", static: false, private: false, access: { has: obj => "reload" in obj, get: obj => obj.reload }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _setCacheBehavior_decorators, { kind: "method", name: "setCacheBehavior", static: false, private: false, access: { has: obj => "setCacheBehavior" in obj, get: obj => obj.setCacheBehavior }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _print_decorators, { kind: "method", name: "print", static: false, private: false, access: { has: obj => "print" in obj, get: obj => obj.print }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _handleUserPrompt_decorators, { kind: "method", name: "handleUserPrompt", static: false, private: false, access: { has: obj => "handleUserPrompt" in obj, get: obj => obj.handleUserPrompt }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _setViewport_decorators, { kind: "method", name: "setViewport", static: false, private: false, access: { has: obj => "setViewport" in obj, get: obj => obj.setViewport }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _performActions_decorators, { kind: "method", name: "performActions", static: false, private: false, access: { has: obj => "performActions" in obj, get: obj => obj.performActions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _releaseActions_decorators, { kind: "method", name: "releaseActions", static: false, private: false, access: { has: obj => "releaseActions" in obj, get: obj => obj.releaseActions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _createWindowRealm_decorators, { kind: "method", name: "createWindowRealm", static: false, private: false, access: { has: obj => "createWindowRealm" in obj, get: obj => obj.createWindowRealm }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _addPreloadScript_decorators, { kind: "method", name: "addPreloadScript", static: false, private: false, access: { has: obj => "addPreloadScript" in obj, get: obj => obj.addPreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _addIntercept_decorators, { kind: "method", name: "addIntercept", static: false, private: false, access: { has: obj => "addIntercept" in obj, get: obj => obj.addIntercept }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _removePreloadScript_decorators, { kind: "method", name: "removePreloadScript", static: false, private: false, access: { has: obj => "removePreloadScript" in obj, get: obj => obj.removePreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _setGeolocationOverride_decorators, { kind: "method", name: "setGeolocationOverride", static: false, private: false, access: { has: obj => "setGeolocationOverride" in obj, get: obj => obj.setGeolocationOverride }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _getCookies_decorators, { kind: "method", name: "getCookies", static: false, private: false, access: { has: obj => "getCookies" in obj, get: obj => obj.getCookies }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _setCookie_decorators, { kind: "method", name: "setCookie", static: false, private: false, access: { has: obj => "setCookie" in obj, get: obj => obj.setCookie }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _setFiles_decorators, { kind: "method", name: "setFiles", static: false, private: false, access: { has: obj => "setFiles" in obj, get: obj => obj.setFiles }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _subscribe_decorators, { kind: "method", name: "subscribe", static: false, private: false, access: { has: obj => "subscribe" in obj, get: obj => obj.subscribe }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _addInterception_decorators, { kind: "method", name: "addInterception", static: false, private: false, access: { has: obj => "addInterception" in obj, get: obj => obj.addInterception }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _deleteCookie_decorators, { kind: "method", name: "deleteCookie", static: false, private: false, access: { has: obj => "deleteCookie" in obj, get: obj => obj.deleteCookie }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_b, null, _locateNodes_decorators, { kind: "method", name: "locateNodes", static: false, private: false, access: { has: obj => "locateNodes" in obj, get: obj => obj.locateNodes }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata)
                Object.defineProperty(_b, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _b;
})();
export { BrowsingContext };
//# sourceMappingURL=BrowsingContext.js.map
//# sourceMappingURL=BrowsingContext.js.map