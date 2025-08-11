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
/**
 * @license
 * Copyright 2017 Google Inc.
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
import { Frame, FrameEvent, throwIfDetached } from '../api/Frame.js';
import { UnsupportedOperation } from '../common/Errors.js';
import { debugError } from '../common/util.js';
import { Deferred } from '../util/Deferred.js';
import { disposeSymbol } from '../util/disposable.js';
import { isErrorLike } from '../util/ErrorLike.js';
import { Accessibility } from './Accessibility.js';
import { FrameManagerEvent } from './FrameManagerEvents.js';
import { IsolatedWorld } from './IsolatedWorld.js';
import { MAIN_WORLD, PUPPETEER_WORLD } from './IsolatedWorlds.js';
import { LifecycleWatcher, } from './LifecycleWatcher.js';
import { CDP_BINDING_PREFIX } from './utils.js';
/**
 * @internal
 */
let CdpFrame = (() => {
    var _CdpFrame_instances, _a, _CdpFrame_url, _CdpFrame_detached, _CdpFrame_client, _CdpFrame_onMainWorldConsoleApiCalled, _CdpFrame_onMainWorldBindingCalled, _CdpFrame_deviceRequestPromptManager;
    let _classSuper = Frame;
    let _instanceExtraInitializers = [];
    let _goto_decorators;
    let _waitForNavigation_decorators;
    let _setContent_decorators;
    let _addPreloadScript_decorators;
    let _addExposedFunctionBinding_decorators;
    let _removeExposedFunctionBinding_decorators;
    let _waitForDevicePrompt_decorators;
    return _a = class CdpFrame extends _classSuper {
            constructor(frameManager, frameId, parentFrameId, client) {
                super();
                _CdpFrame_instances.add(this);
                _CdpFrame_url.set(this, (__runInitializers(this, _instanceExtraInitializers), ''));
                _CdpFrame_detached.set(this, false);
                _CdpFrame_client.set(this, void 0);
                this._loaderId = '';
                this._lifecycleEvents = new Set();
                this._frameManager = frameManager;
                __classPrivateFieldSet(this, _CdpFrame_url, '', "f");
                this._id = frameId;
                this._parentId = parentFrameId;
                __classPrivateFieldSet(this, _CdpFrame_detached, false, "f");
                __classPrivateFieldSet(this, _CdpFrame_client, client, "f");
                this._loaderId = '';
                this.worlds = {
                    [MAIN_WORLD]: new IsolatedWorld(this, this._frameManager.timeoutSettings),
                    [PUPPETEER_WORLD]: new IsolatedWorld(this, this._frameManager.timeoutSettings),
                };
                this.accessibility = new Accessibility(this.worlds[MAIN_WORLD], frameId);
                this.on(FrameEvent.FrameSwappedByActivation, () => {
                    // Emulate loading process for swapped frames.
                    this._onLoadingStarted();
                    this._onLoadingStopped();
                });
                this.worlds[MAIN_WORLD].emitter.on('consoleapicalled', __classPrivateFieldGet(this, _CdpFrame_instances, "m", _CdpFrame_onMainWorldConsoleApiCalled).bind(this));
                this.worlds[MAIN_WORLD].emitter.on('bindingcalled', __classPrivateFieldGet(this, _CdpFrame_instances, "m", _CdpFrame_onMainWorldBindingCalled).bind(this));
            }
            /**
             * This is used internally in DevTools.
             *
             * @internal
             */
            _client() {
                return __classPrivateFieldGet(this, _CdpFrame_client, "f");
            }
            /**
             * Updates the frame ID with the new ID. This happens when the main frame is
             * replaced by a different frame.
             */
            updateId(id) {
                this._id = id;
            }
            updateClient(client) {
                __classPrivateFieldSet(this, _CdpFrame_client, client, "f");
            }
            page() {
                return this._frameManager.page();
            }
            async goto(url, options = {}) {
                const { referer = this._frameManager.networkManager.extraHTTPHeaders()['referer'], referrerPolicy = this._frameManager.networkManager.extraHTTPHeaders()['referer-policy'], waitUntil = ['load'], timeout = this._frameManager.timeoutSettings.navigationTimeout(), } = options;
                let ensureNewDocumentNavigation = false;
                const watcher = new LifecycleWatcher(this._frameManager.networkManager, this, waitUntil, timeout);
                let error = await Deferred.race([
                    navigate(__classPrivateFieldGet(this, _CdpFrame_client, "f"), url, referer, referrerPolicy ? referrerPolicyToProtocol(referrerPolicy) : undefined, this._id),
                    watcher.terminationPromise(),
                ]);
                if (!error) {
                    error = await Deferred.race([
                        watcher.terminationPromise(),
                        ensureNewDocumentNavigation
                            ? watcher.newDocumentNavigationPromise()
                            : watcher.sameDocumentNavigationPromise(),
                    ]);
                }
                try {
                    if (error) {
                        throw error;
                    }
                    return await watcher.navigationResponse();
                }
                finally {
                    watcher.dispose();
                }
                async function navigate(client, url, referrer, referrerPolicy, frameId) {
                    try {
                        const response = await client.send('Page.navigate', {
                            url,
                            referrer,
                            frameId,
                            referrerPolicy,
                        });
                        ensureNewDocumentNavigation = !!response.loaderId;
                        if (response.errorText === 'net::ERR_HTTP_RESPONSE_CODE_FAILURE') {
                            return null;
                        }
                        return response.errorText
                            ? new Error(`${response.errorText} at ${url}`)
                            : null;
                    }
                    catch (error) {
                        if (isErrorLike(error)) {
                            return error;
                        }
                        throw error;
                    }
                }
            }
            async waitForNavigation(options = {}) {
                const { waitUntil = ['load'], timeout = this._frameManager.timeoutSettings.navigationTimeout(), signal, } = options;
                const watcher = new LifecycleWatcher(this._frameManager.networkManager, this, waitUntil, timeout, signal);
                const error = await Deferred.race([
                    watcher.terminationPromise(),
                    ...(options.ignoreSameDocumentNavigation
                        ? []
                        : [watcher.sameDocumentNavigationPromise()]),
                    watcher.newDocumentNavigationPromise(),
                ]);
                try {
                    if (error) {
                        throw error;
                    }
                    const result = await Deferred.race([watcher.terminationPromise(), watcher.navigationResponse()]);
                    if (result instanceof Error) {
                        throw error;
                    }
                    return result || null;
                }
                finally {
                    watcher.dispose();
                }
            }
            get client() {
                return __classPrivateFieldGet(this, _CdpFrame_client, "f");
            }
            mainRealm() {
                return this.worlds[MAIN_WORLD];
            }
            isolatedRealm() {
                return this.worlds[PUPPETEER_WORLD];
            }
            async setContent(html, options = {}) {
                const { waitUntil = ['load'], timeout = this._frameManager.timeoutSettings.navigationTimeout(), } = options;
                // We rely upon the fact that document.open() will reset frame lifecycle with "init"
                // lifecycle event. @see https://crrev.com/608658
                await this.setFrameContent(html);
                const watcher = new LifecycleWatcher(this._frameManager.networkManager, this, waitUntil, timeout);
                const error = await Deferred.race([
                    watcher.terminationPromise(),
                    watcher.lifecyclePromise(),
                ]);
                watcher.dispose();
                if (error) {
                    throw error;
                }
            }
            url() {
                return __classPrivateFieldGet(this, _CdpFrame_url, "f");
            }
            parentFrame() {
                return this._frameManager._frameTree.parentFrame(this._id) || null;
            }
            childFrames() {
                return this._frameManager._frameTree.childFrames(this._id);
            }
            async addPreloadScript(preloadScript) {
                const parentFrame = this.parentFrame();
                if (parentFrame && __classPrivateFieldGet(this, _CdpFrame_client, "f") === parentFrame.client) {
                    return;
                }
                if (preloadScript.getIdForFrame(this)) {
                    return;
                }
                const { identifier } = await __classPrivateFieldGet(this, _CdpFrame_client, "f").send('Page.addScriptToEvaluateOnNewDocument', {
                    source: preloadScript.source,
                });
                preloadScript.setIdForFrame(this, identifier);
            }
            async addExposedFunctionBinding(binding) {
                // If a frame has not started loading, it might never start. Rely on
                // addScriptToEvaluateOnNewDocument in that case.
                if (this !== this._frameManager.mainFrame() && !this._hasStartedLoading) {
                    return;
                }
                await Promise.all([
                    __classPrivateFieldGet(this, _CdpFrame_client, "f").send('Runtime.addBinding', {
                        name: CDP_BINDING_PREFIX + binding.name,
                    }),
                    this.evaluate(binding.initSource).catch(debugError),
                ]);
            }
            async removeExposedFunctionBinding(binding) {
                // If a frame has not started loading, it might never start. Rely on
                // addScriptToEvaluateOnNewDocument in that case.
                if (this !== this._frameManager.mainFrame() && !this._hasStartedLoading) {
                    return;
                }
                await Promise.all([
                    __classPrivateFieldGet(this, _CdpFrame_client, "f").send('Runtime.removeBinding', {
                        name: CDP_BINDING_PREFIX + binding.name,
                    }),
                    this.evaluate(name => {
                        // Removes the dangling Puppeteer binding wrapper.
                        // @ts-expect-error: In a different context.
                        globalThis[name] = undefined;
                    }, binding.name).catch(debugError),
                ]);
            }
            async waitForDevicePrompt(options = {}) {
                return await __classPrivateFieldGet(this, _CdpFrame_instances, "m", _CdpFrame_deviceRequestPromptManager).call(this).waitForDevicePrompt(options);
            }
            _navigated(framePayload) {
                this._name = framePayload.name;
                __classPrivateFieldSet(this, _CdpFrame_url, `${framePayload.url}${framePayload.urlFragment || ''}`, "f");
            }
            _navigatedWithinDocument(url) {
                __classPrivateFieldSet(this, _CdpFrame_url, url, "f");
            }
            _onLifecycleEvent(loaderId, name) {
                if (name === 'init') {
                    this._loaderId = loaderId;
                    this._lifecycleEvents.clear();
                }
                this._lifecycleEvents.add(name);
            }
            _onLoadingStopped() {
                this._lifecycleEvents.add('DOMContentLoaded');
                this._lifecycleEvents.add('load');
            }
            _onLoadingStarted() {
                this._hasStartedLoading = true;
            }
            get detached() {
                return __classPrivateFieldGet(this, _CdpFrame_detached, "f");
            }
            [(_CdpFrame_url = new WeakMap(), _CdpFrame_detached = new WeakMap(), _CdpFrame_client = new WeakMap(), _CdpFrame_instances = new WeakSet(), _CdpFrame_onMainWorldConsoleApiCalled = function _CdpFrame_onMainWorldConsoleApiCalled(event) {
                this._frameManager.emit(FrameManagerEvent.ConsoleApiCalled, [
                    this.worlds[MAIN_WORLD],
                    event,
                ]);
            }, _CdpFrame_onMainWorldBindingCalled = function _CdpFrame_onMainWorldBindingCalled(event) {
                this._frameManager.emit(FrameManagerEvent.BindingCalled, [
                    this.worlds[MAIN_WORLD],
                    event,
                ]);
            }, _CdpFrame_deviceRequestPromptManager = function _CdpFrame_deviceRequestPromptManager() {
                return this._frameManager._deviceRequestPromptManager(__classPrivateFieldGet(this, _CdpFrame_client, "f"));
            }, _goto_decorators = [throwIfDetached], _waitForNavigation_decorators = [throwIfDetached], _setContent_decorators = [throwIfDetached], _addPreloadScript_decorators = [throwIfDetached], _addExposedFunctionBinding_decorators = [throwIfDetached], _removeExposedFunctionBinding_decorators = [throwIfDetached], _waitForDevicePrompt_decorators = [throwIfDetached], disposeSymbol)]() {
                if (__classPrivateFieldGet(this, _CdpFrame_detached, "f")) {
                    return;
                }
                __classPrivateFieldSet(this, _CdpFrame_detached, true, "f");
                this.worlds[MAIN_WORLD][disposeSymbol]();
                this.worlds[PUPPETEER_WORLD][disposeSymbol]();
            }
            exposeFunction() {
                throw new UnsupportedOperation();
            }
            async frameElement() {
                const parent = this.parentFrame();
                if (!parent) {
                    return null;
                }
                const { backendNodeId } = await parent.client.send('DOM.getFrameOwner', {
                    frameId: this._id,
                });
                return (await parent
                    .mainRealm()
                    .adoptBackendNode(backendNodeId));
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(_a, null, _goto_decorators, { kind: "method", name: "goto", static: false, private: false, access: { has: obj => "goto" in obj, get: obj => obj.goto }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _waitForNavigation_decorators, { kind: "method", name: "waitForNavigation", static: false, private: false, access: { has: obj => "waitForNavigation" in obj, get: obj => obj.waitForNavigation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setContent_decorators, { kind: "method", name: "setContent", static: false, private: false, access: { has: obj => "setContent" in obj, get: obj => obj.setContent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addPreloadScript_decorators, { kind: "method", name: "addPreloadScript", static: false, private: false, access: { has: obj => "addPreloadScript" in obj, get: obj => obj.addPreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addExposedFunctionBinding_decorators, { kind: "method", name: "addExposedFunctionBinding", static: false, private: false, access: { has: obj => "addExposedFunctionBinding" in obj, get: obj => obj.addExposedFunctionBinding }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _removeExposedFunctionBinding_decorators, { kind: "method", name: "removeExposedFunctionBinding", static: false, private: false, access: { has: obj => "removeExposedFunctionBinding" in obj, get: obj => obj.removeExposedFunctionBinding }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _waitForDevicePrompt_decorators, { kind: "method", name: "waitForDevicePrompt", static: false, private: false, access: { has: obj => "waitForDevicePrompt" in obj, get: obj => obj.waitForDevicePrompt }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata)
                Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { CdpFrame };
/**
 * @internal
 */
export function referrerPolicyToProtocol(referrerPolicy) {
    // See
    // https://chromedevtools.github.io/devtools-protocol/tot/Page/#type-ReferrerPolicy
    // We need to conver from Web-facing phase to CDP's camelCase.
    return referrerPolicy.replaceAll(/-./g, match => {
        return match[1].toUpperCase();
    });
}
//# sourceMappingURL=Frame.js.map
//# sourceMappingURL=Frame.js.map