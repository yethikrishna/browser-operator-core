/**
 * @license
 * Copyright 2017 Google Inc.
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
var _CdpFrame_instances, _CdpFrame_url, _CdpFrame_detached, _CdpFrame_client, _CdpFrame_onMainWorldConsoleApiCalled, _CdpFrame_onMainWorldBindingCalled, _CdpFrame_deviceRequestPromptManager;
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
export class CdpFrame extends Frame {
    constructor(frameManager, frameId, parentFrameId, client) {
        super();
        _CdpFrame_instances.add(this);
        _CdpFrame_url.set(this, '');
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
    }, disposeSymbol)]() {
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
}
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CdpFrame.prototype, "goto", null);
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CdpFrame.prototype, "waitForNavigation", null);
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CdpFrame.prototype, "setContent", null);
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], CdpFrame.prototype, "addPreloadScript", null);
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], CdpFrame.prototype, "addExposedFunctionBinding", null);
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], CdpFrame.prototype, "removeExposedFunctionBinding", null);
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CdpFrame.prototype, "waitForDevicePrompt", null);
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