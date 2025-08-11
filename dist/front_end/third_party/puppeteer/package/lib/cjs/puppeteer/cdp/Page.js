"use strict";
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
var _CdpPage_instances, _CdpPage_closed, _CdpPage_targetManager, _CdpPage_primaryTargetClient, _CdpPage_primaryTarget, _CdpPage_tabTargetClient, _CdpPage_tabTarget, _CdpPage_keyboard, _CdpPage_mouse, _CdpPage_touchscreen, _CdpPage_frameManager, _CdpPage_emulationManager, _CdpPage_tracing, _CdpPage_bindings, _CdpPage_exposedFunctions, _CdpPage_coverage, _CdpPage_viewport, _CdpPage_workers, _CdpPage_fileChooserDeferreds, _CdpPage_sessionCloseDeferred, _CdpPage_serviceWorkerBypassed, _CdpPage_userDragInterceptionEnabled, _CdpPage_attachExistingTargets, _CdpPage_onActivation, _CdpPage_onSecondaryTarget, _CdpPage_setupPrimaryTargetListeners, _CdpPage_onDetachedFromTarget, _CdpPage_onAttachedToTarget, _CdpPage_initialize, _CdpPage_onFileChooser, _CdpPage_onTargetCrashed, _CdpPage_onLogEntryAdded, _CdpPage_emitMetrics, _CdpPage_buildMetricsObject, _CdpPage_handleException, _CdpPage_onConsoleAPI, _CdpPage_onBindingCalled, _CdpPage_addConsoleMessage, _CdpPage_onDialog, _CdpPage_go;
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function")
            throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose)
                throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose)
                throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async)
                inner = dispose;
        }
        if (typeof dispose !== "function")
            throw new TypeError("Object not disposable.");
        if (inner)
            dispose = function () { try {
                inner.call(this);
            }
            catch (e) {
                return Promise.reject(e);
            } };
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
                    if (!r.async && s === 1)
                        return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async)
                            return s |= 2, Promise.resolve(result).then(next, function (e) { fail(e); return next(); });
                    }
                    else
                        s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1)
                return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError)
                throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdpPage = void 0;
exports.convertCookiesPartitionKeyFromPuppeteerToCdp = convertCookiesPartitionKeyFromPuppeteerToCdp;
const rxjs_js_1 = require("../../third_party/rxjs/rxjs.js");
const CDPSession_js_1 = require("../api/CDPSession.js");
const Page_js_1 = require("../api/Page.js");
const ConsoleMessage_js_1 = require("../common/ConsoleMessage.js");
const Errors_js_1 = require("../common/Errors.js");
const EventEmitter_js_1 = require("../common/EventEmitter.js");
const FileChooser_js_1 = require("../common/FileChooser.js");
const NetworkManagerEvents_js_1 = require("../common/NetworkManagerEvents.js");
const util_js_1 = require("../common/util.js");
const assert_js_1 = require("../util/assert.js");
const Deferred_js_1 = require("../util/Deferred.js");
const disposable_js_1 = require("../util/disposable.js");
const ErrorLike_js_1 = require("../util/ErrorLike.js");
const Binding_js_1 = require("./Binding.js");
const CdpSession_js_1 = require("./CdpSession.js");
const Connection_js_1 = require("./Connection.js");
const Coverage_js_1 = require("./Coverage.js");
const Dialog_js_1 = require("./Dialog.js");
const EmulationManager_js_1 = require("./EmulationManager.js");
const FrameManager_js_1 = require("./FrameManager.js");
const FrameManagerEvents_js_1 = require("./FrameManagerEvents.js");
const Input_js_1 = require("./Input.js");
const IsolatedWorlds_js_1 = require("./IsolatedWorlds.js");
const JSHandle_js_1 = require("./JSHandle.js");
const Tracing_js_1 = require("./Tracing.js");
const utils_js_1 = require("./utils.js");
const WebWorker_js_1 = require("./WebWorker.js");
function convertConsoleMessageLevel(method) {
    switch (method) {
        case 'warning':
            return 'warn';
        default:
            return method;
    }
}
/**
 * @internal
 */
class CdpPage extends Page_js_1.Page {
    static async _create(client, target, defaultViewport) {
        const page = new CdpPage(client, target);
        await __classPrivateFieldGet(page, _CdpPage_instances, "m", _CdpPage_initialize).call(page);
        if (defaultViewport) {
            try {
                await page.setViewport(defaultViewport);
            }
            catch (err) {
                if ((0, ErrorLike_js_1.isErrorLike)(err) && (0, Connection_js_1.isTargetClosedError)(err)) {
                    (0, util_js_1.debugError)(err);
                }
                else {
                    throw err;
                }
            }
        }
        return page;
    }
    constructor(client, target) {
        super();
        _CdpPage_instances.add(this);
        _CdpPage_closed.set(this, false);
        _CdpPage_targetManager.set(this, void 0);
        _CdpPage_primaryTargetClient.set(this, void 0);
        _CdpPage_primaryTarget.set(this, void 0);
        _CdpPage_tabTargetClient.set(this, void 0);
        _CdpPage_tabTarget.set(this, void 0);
        _CdpPage_keyboard.set(this, void 0);
        _CdpPage_mouse.set(this, void 0);
        _CdpPage_touchscreen.set(this, void 0);
        _CdpPage_frameManager.set(this, void 0);
        _CdpPage_emulationManager.set(this, void 0);
        _CdpPage_tracing.set(this, void 0);
        _CdpPage_bindings.set(this, new Map());
        _CdpPage_exposedFunctions.set(this, new Map());
        _CdpPage_coverage.set(this, void 0);
        _CdpPage_viewport.set(this, void 0);
        _CdpPage_workers.set(this, new Map());
        _CdpPage_fileChooserDeferreds.set(this, new Set());
        _CdpPage_sessionCloseDeferred.set(this, Deferred_js_1.Deferred.create());
        _CdpPage_serviceWorkerBypassed.set(this, false);
        _CdpPage_userDragInterceptionEnabled.set(this, false);
        _CdpPage_onDetachedFromTarget.set(this, (target) => {
            const sessionId = target._session()?.id();
            const worker = __classPrivateFieldGet(this, _CdpPage_workers, "f").get(sessionId);
            if (!worker) {
                return;
            }
            __classPrivateFieldGet(this, _CdpPage_workers, "f").delete(sessionId);
            this.emit("workerdestroyed" /* PageEvent.WorkerDestroyed */, worker);
        });
        _CdpPage_onAttachedToTarget.set(this, (session) => {
            (0, assert_js_1.assert)(session instanceof CdpSession_js_1.CdpCDPSession);
            __classPrivateFieldGet(this, _CdpPage_frameManager, "f").onAttachedToTarget(session.target());
            if (session.target()._getTargetInfo().type === 'worker') {
                const worker = new WebWorker_js_1.CdpWebWorker(session, session.target().url(), session.target()._targetId, session.target().type(), __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_addConsoleMessage).bind(this), __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_handleException).bind(this), __classPrivateFieldGet(this, _CdpPage_frameManager, "f").networkManager);
                __classPrivateFieldGet(this, _CdpPage_workers, "f").set(session.id(), worker);
                this.emit("workercreated" /* PageEvent.WorkerCreated */, worker);
            }
            session.on(CDPSession_js_1.CDPSessionEvent.Ready, __classPrivateFieldGet(this, _CdpPage_onAttachedToTarget, "f"));
        });
        __classPrivateFieldSet(this, _CdpPage_primaryTargetClient, client, "f");
        __classPrivateFieldSet(this, _CdpPage_tabTargetClient, client.parentSession(), "f");
        (0, assert_js_1.assert)(__classPrivateFieldGet(this, _CdpPage_tabTargetClient, "f"), 'Tab target session is not defined.');
        __classPrivateFieldSet(this, _CdpPage_tabTarget, __classPrivateFieldGet(this, _CdpPage_tabTargetClient, "f").target(), "f");
        (0, assert_js_1.assert)(__classPrivateFieldGet(this, _CdpPage_tabTarget, "f"), 'Tab target is not defined.');
        __classPrivateFieldSet(this, _CdpPage_primaryTarget, target, "f");
        __classPrivateFieldSet(this, _CdpPage_targetManager, target._targetManager(), "f");
        __classPrivateFieldSet(this, _CdpPage_keyboard, new Input_js_1.CdpKeyboard(client), "f");
        __classPrivateFieldSet(this, _CdpPage_mouse, new Input_js_1.CdpMouse(client, __classPrivateFieldGet(this, _CdpPage_keyboard, "f")), "f");
        __classPrivateFieldSet(this, _CdpPage_touchscreen, new Input_js_1.CdpTouchscreen(client, __classPrivateFieldGet(this, _CdpPage_keyboard, "f")), "f");
        __classPrivateFieldSet(this, _CdpPage_frameManager, new FrameManager_js_1.FrameManager(client, this, this._timeoutSettings), "f");
        __classPrivateFieldSet(this, _CdpPage_emulationManager, new EmulationManager_js_1.EmulationManager(client), "f");
        __classPrivateFieldSet(this, _CdpPage_tracing, new Tracing_js_1.Tracing(client), "f");
        __classPrivateFieldSet(this, _CdpPage_coverage, new Coverage_js_1.Coverage(client), "f");
        __classPrivateFieldSet(this, _CdpPage_viewport, null, "f");
        const frameManagerEmitter = new EventEmitter_js_1.EventEmitter(__classPrivateFieldGet(this, _CdpPage_frameManager, "f"));
        frameManagerEmitter.on(FrameManagerEvents_js_1.FrameManagerEvent.FrameAttached, frame => {
            this.emit("frameattached" /* PageEvent.FrameAttached */, frame);
        });
        frameManagerEmitter.on(FrameManagerEvents_js_1.FrameManagerEvent.FrameDetached, frame => {
            this.emit("framedetached" /* PageEvent.FrameDetached */, frame);
        });
        frameManagerEmitter.on(FrameManagerEvents_js_1.FrameManagerEvent.FrameNavigated, frame => {
            this.emit("framenavigated" /* PageEvent.FrameNavigated */, frame);
        });
        frameManagerEmitter.on(FrameManagerEvents_js_1.FrameManagerEvent.ConsoleApiCalled, ([world, event]) => {
            __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_onConsoleAPI).call(this, world, event);
        });
        frameManagerEmitter.on(FrameManagerEvents_js_1.FrameManagerEvent.BindingCalled, ([world, event]) => {
            void __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_onBindingCalled).call(this, world, event);
        });
        const networkManagerEmitter = new EventEmitter_js_1.EventEmitter(__classPrivateFieldGet(this, _CdpPage_frameManager, "f").networkManager);
        networkManagerEmitter.on(NetworkManagerEvents_js_1.NetworkManagerEvent.Request, request => {
            this.emit("request" /* PageEvent.Request */, request);
        });
        networkManagerEmitter.on(NetworkManagerEvents_js_1.NetworkManagerEvent.RequestServedFromCache, request => {
            this.emit("requestservedfromcache" /* PageEvent.RequestServedFromCache */, request);
        });
        networkManagerEmitter.on(NetworkManagerEvents_js_1.NetworkManagerEvent.Response, response => {
            this.emit("response" /* PageEvent.Response */, response);
        });
        networkManagerEmitter.on(NetworkManagerEvents_js_1.NetworkManagerEvent.RequestFailed, request => {
            this.emit("requestfailed" /* PageEvent.RequestFailed */, request);
        });
        networkManagerEmitter.on(NetworkManagerEvents_js_1.NetworkManagerEvent.RequestFinished, request => {
            this.emit("requestfinished" /* PageEvent.RequestFinished */, request);
        });
        __classPrivateFieldGet(this, _CdpPage_tabTargetClient, "f").on(CDPSession_js_1.CDPSessionEvent.Swapped, __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_onActivation).bind(this));
        __classPrivateFieldGet(this, _CdpPage_tabTargetClient, "f").on(CDPSession_js_1.CDPSessionEvent.Ready, __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_onSecondaryTarget).bind(this));
        __classPrivateFieldGet(this, _CdpPage_targetManager, "f").on("targetGone" /* TargetManagerEvent.TargetGone */, __classPrivateFieldGet(this, _CdpPage_onDetachedFromTarget, "f"));
        __classPrivateFieldGet(this, _CdpPage_tabTarget, "f")._isClosedDeferred
            .valueOrThrow()
            .then(() => {
            __classPrivateFieldGet(this, _CdpPage_targetManager, "f").off("targetGone" /* TargetManagerEvent.TargetGone */, __classPrivateFieldGet(this, _CdpPage_onDetachedFromTarget, "f"));
            this.emit("close" /* PageEvent.Close */, undefined);
            __classPrivateFieldSet(this, _CdpPage_closed, true, "f");
        })
            .catch(util_js_1.debugError);
        __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_setupPrimaryTargetListeners).call(this);
        __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_attachExistingTargets).call(this);
    }
    _client() {
        return __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f");
    }
    isServiceWorkerBypassed() {
        return __classPrivateFieldGet(this, _CdpPage_serviceWorkerBypassed, "f");
    }
    isDragInterceptionEnabled() {
        return __classPrivateFieldGet(this, _CdpPage_userDragInterceptionEnabled, "f");
    }
    isJavaScriptEnabled() {
        return __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").javascriptEnabled;
    }
    async waitForFileChooser(options = {}) {
        const needsEnable = __classPrivateFieldGet(this, _CdpPage_fileChooserDeferreds, "f").size === 0;
        const { timeout = this._timeoutSettings.timeout() } = options;
        const deferred = Deferred_js_1.Deferred.create({
            message: `Waiting for \`FileChooser\` failed: ${timeout}ms exceeded`,
            timeout,
        });
        if (options.signal) {
            options.signal.addEventListener('abort', () => {
                deferred.reject(options.signal?.reason);
            }, { once: true });
        }
        __classPrivateFieldGet(this, _CdpPage_fileChooserDeferreds, "f").add(deferred);
        let enablePromise;
        if (needsEnable) {
            enablePromise = __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Page.setInterceptFileChooserDialog', {
                enabled: true,
            });
        }
        try {
            const [result] = await Promise.all([
                deferred.valueOrThrow(),
                enablePromise,
            ]);
            return result;
        }
        catch (error) {
            __classPrivateFieldGet(this, _CdpPage_fileChooserDeferreds, "f").delete(deferred);
            throw error;
        }
    }
    async setGeolocation(options) {
        return await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").setGeolocation(options);
    }
    target() {
        return __classPrivateFieldGet(this, _CdpPage_primaryTarget, "f");
    }
    browser() {
        return __classPrivateFieldGet(this, _CdpPage_primaryTarget, "f").browser();
    }
    browserContext() {
        return __classPrivateFieldGet(this, _CdpPage_primaryTarget, "f").browserContext();
    }
    mainFrame() {
        return __classPrivateFieldGet(this, _CdpPage_frameManager, "f").mainFrame();
    }
    get keyboard() {
        return __classPrivateFieldGet(this, _CdpPage_keyboard, "f");
    }
    get touchscreen() {
        return __classPrivateFieldGet(this, _CdpPage_touchscreen, "f");
    }
    get coverage() {
        return __classPrivateFieldGet(this, _CdpPage_coverage, "f");
    }
    get tracing() {
        return __classPrivateFieldGet(this, _CdpPage_tracing, "f");
    }
    frames() {
        return __classPrivateFieldGet(this, _CdpPage_frameManager, "f").frames();
    }
    workers() {
        return Array.from(__classPrivateFieldGet(this, _CdpPage_workers, "f").values());
    }
    async setRequestInterception(value) {
        return await __classPrivateFieldGet(this, _CdpPage_frameManager, "f").networkManager.setRequestInterception(value);
    }
    async setBypassServiceWorker(bypass) {
        __classPrivateFieldSet(this, _CdpPage_serviceWorkerBypassed, bypass, "f");
        return await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Network.setBypassServiceWorker', { bypass });
    }
    async setDragInterception(enabled) {
        __classPrivateFieldSet(this, _CdpPage_userDragInterceptionEnabled, enabled, "f");
        return await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Input.setInterceptDrags', {
            enabled,
        });
    }
    async setOfflineMode(enabled) {
        return await __classPrivateFieldGet(this, _CdpPage_frameManager, "f").networkManager.setOfflineMode(enabled);
    }
    async emulateNetworkConditions(networkConditions) {
        return await __classPrivateFieldGet(this, _CdpPage_frameManager, "f").networkManager.emulateNetworkConditions(networkConditions);
    }
    setDefaultNavigationTimeout(timeout) {
        this._timeoutSettings.setDefaultNavigationTimeout(timeout);
    }
    setDefaultTimeout(timeout) {
        this._timeoutSettings.setDefaultTimeout(timeout);
    }
    getDefaultTimeout() {
        return this._timeoutSettings.timeout();
    }
    getDefaultNavigationTimeout() {
        return this._timeoutSettings.navigationTimeout();
    }
    async queryObjects(prototypeHandle) {
        (0, assert_js_1.assert)(!prototypeHandle.disposed, 'Prototype JSHandle is disposed!');
        (0, assert_js_1.assert)(prototypeHandle.id, 'Prototype JSHandle must not be referencing primitive value');
        const response = await this.mainFrame().client.send('Runtime.queryObjects', {
            prototypeObjectId: prototypeHandle.id,
        });
        return this.mainFrame()
            .mainRealm()
            .createCdpHandle(response.objects);
    }
    async cookies(...urls) {
        const originalCookies = (await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Network.getCookies', {
            urls: urls.length ? urls : [this.url()],
        })).cookies;
        const unsupportedCookieAttributes = ['sourcePort'];
        const filterUnsupportedAttributes = (cookie) => {
            for (const attr of unsupportedCookieAttributes) {
                delete cookie[attr];
            }
            return cookie;
        };
        return originalCookies.map(filterUnsupportedAttributes).map(cookie => {
            return {
                ...cookie,
                // TODO: a breaking change is needed in Puppeteer types to support other
                // partition keys.
                partitionKey: cookie.partitionKey
                    ? cookie.partitionKey.topLevelSite
                    : undefined,
            };
        });
    }
    async deleteCookie(...cookies) {
        const pageURL = this.url();
        for (const cookie of cookies) {
            const item = {
                ...cookie,
                partitionKey: convertCookiesPartitionKeyFromPuppeteerToCdp(cookie.partitionKey),
            };
            if (!cookie.url && pageURL.startsWith('http')) {
                item.url = pageURL;
            }
            await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Network.deleteCookies', item);
            if (pageURL.startsWith('http') && !item.partitionKey) {
                const url = new URL(pageURL);
                // Delete also cookies from the page's partition.
                await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Network.deleteCookies', {
                    ...item,
                    partitionKey: {
                        topLevelSite: url.origin.replace(`:${url.port}`, ''),
                        hasCrossSiteAncestor: false,
                    },
                });
            }
        }
    }
    async setCookie(...cookies) {
        const pageURL = this.url();
        const startsWithHTTP = pageURL.startsWith('http');
        const items = cookies.map(cookie => {
            const item = Object.assign({}, cookie);
            if (!item.url && startsWithHTTP) {
                item.url = pageURL;
            }
            (0, assert_js_1.assert)(item.url !== 'about:blank', `Blank page can not have cookie "${item.name}"`);
            (0, assert_js_1.assert)(!String.prototype.startsWith.call(item.url || '', 'data:'), `Data URL page can not have cookie "${item.name}"`);
            return item;
        });
        await this.deleteCookie(...items);
        if (items.length) {
            await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Network.setCookies', {
                cookies: items.map(cookieParam => {
                    return {
                        ...cookieParam,
                        partitionKey: convertCookiesPartitionKeyFromPuppeteerToCdp(cookieParam.partitionKey),
                    };
                }),
            });
        }
    }
    async exposeFunction(name, 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    pptrFunction) {
        if (__classPrivateFieldGet(this, _CdpPage_bindings, "f").has(name)) {
            throw new Error(`Failed to add page binding with name ${name}: window['${name}'] already exists!`);
        }
        const source = (0, utils_js_1.pageBindingInitString)('exposedFun', name);
        let binding;
        switch (typeof pptrFunction) {
            case 'function':
                binding = new Binding_js_1.Binding(name, pptrFunction, source);
                break;
            default:
                binding = new Binding_js_1.Binding(name, pptrFunction.default, source);
                break;
        }
        __classPrivateFieldGet(this, _CdpPage_bindings, "f").set(name, binding);
        const [{ identifier }] = await Promise.all([
            __classPrivateFieldGet(this, _CdpPage_frameManager, "f").evaluateOnNewDocument(source),
            __classPrivateFieldGet(this, _CdpPage_frameManager, "f").addExposedFunctionBinding(binding),
        ]);
        __classPrivateFieldGet(this, _CdpPage_exposedFunctions, "f").set(name, identifier);
    }
    async removeExposedFunction(name) {
        const exposedFunctionId = __classPrivateFieldGet(this, _CdpPage_exposedFunctions, "f").get(name);
        if (!exposedFunctionId) {
            throw new Error(`Function with name "${name}" does not exist`);
        }
        // #bindings must be updated together with #exposedFunctions.
        const binding = __classPrivateFieldGet(this, _CdpPage_bindings, "f").get(name);
        __classPrivateFieldGet(this, _CdpPage_exposedFunctions, "f").delete(name);
        __classPrivateFieldGet(this, _CdpPage_bindings, "f").delete(name);
        await Promise.all([
            __classPrivateFieldGet(this, _CdpPage_frameManager, "f").removeScriptToEvaluateOnNewDocument(exposedFunctionId),
            __classPrivateFieldGet(this, _CdpPage_frameManager, "f").removeExposedFunctionBinding(binding),
        ]);
    }
    async authenticate(credentials) {
        return await __classPrivateFieldGet(this, _CdpPage_frameManager, "f").networkManager.authenticate(credentials);
    }
    async setExtraHTTPHeaders(headers) {
        return await __classPrivateFieldGet(this, _CdpPage_frameManager, "f").networkManager.setExtraHTTPHeaders(headers);
    }
    async setUserAgent(userAgent, userAgentMetadata) {
        return await __classPrivateFieldGet(this, _CdpPage_frameManager, "f").networkManager.setUserAgent(userAgent, userAgentMetadata);
    }
    async metrics() {
        const response = await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Performance.getMetrics');
        return __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_buildMetricsObject).call(this, response.metrics);
    }
    async reload(options) {
        const [result] = await Promise.all([
            this.waitForNavigation({
                ...options,
                ignoreSameDocumentNavigation: true,
            }),
            __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Page.reload'),
        ]);
        return result;
    }
    async createCDPSession() {
        return await this.target().createCDPSession();
    }
    async goBack(options = {}) {
        return await __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_go).call(this, -1, options);
    }
    async goForward(options = {}) {
        return await __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_go).call(this, +1, options);
    }
    async bringToFront() {
        await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Page.bringToFront');
    }
    async setJavaScriptEnabled(enabled) {
        return await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").setJavaScriptEnabled(enabled);
    }
    async setBypassCSP(enabled) {
        await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Page.setBypassCSP', { enabled });
    }
    async emulateMediaType(type) {
        return await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").emulateMediaType(type);
    }
    async emulateCPUThrottling(factor) {
        return await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").emulateCPUThrottling(factor);
    }
    async emulateMediaFeatures(features) {
        return await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").emulateMediaFeatures(features);
    }
    async emulateTimezone(timezoneId) {
        return await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").emulateTimezone(timezoneId);
    }
    async emulateIdleState(overrides) {
        return await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").emulateIdleState(overrides);
    }
    async emulateVisionDeficiency(type) {
        return await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").emulateVisionDeficiency(type);
    }
    async setViewport(viewport) {
        const needsReload = await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").emulateViewport(viewport);
        __classPrivateFieldSet(this, _CdpPage_viewport, viewport, "f");
        if (needsReload) {
            await this.reload();
        }
    }
    viewport() {
        return __classPrivateFieldGet(this, _CdpPage_viewport, "f");
    }
    async evaluateOnNewDocument(pageFunction, ...args) {
        const source = (0, util_js_1.evaluationString)(pageFunction, ...args);
        return await __classPrivateFieldGet(this, _CdpPage_frameManager, "f").evaluateOnNewDocument(source);
    }
    async removeScriptToEvaluateOnNewDocument(identifier) {
        return await __classPrivateFieldGet(this, _CdpPage_frameManager, "f").removeScriptToEvaluateOnNewDocument(identifier);
    }
    async setCacheEnabled(enabled = true) {
        await __classPrivateFieldGet(this, _CdpPage_frameManager, "f").networkManager.setCacheEnabled(enabled);
    }
    async _screenshot(options) {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const { fromSurface, omitBackground, optimizeForSpeed, quality, clip: userClip, type, captureBeyondViewport, } = options;
            const stack = __addDisposableResource(env_2, new disposable_js_1.AsyncDisposableStack(), true);
            if (omitBackground && (type === 'png' || type === 'webp')) {
                await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").setTransparentBackgroundColor();
                stack.defer(async () => {
                    await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f")
                        .resetDefaultBackgroundColor()
                        .catch(util_js_1.debugError);
                });
            }
            let clip = userClip;
            if (clip && !captureBeyondViewport) {
                const viewport = await this.mainFrame()
                    .isolatedRealm()
                    .evaluate(() => {
                    const { height, pageLeft: x, pageTop: y, width, } = window.visualViewport;
                    return { x, y, height, width };
                });
                clip = getIntersectionRect(clip, viewport);
            }
            const { data } = await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Page.captureScreenshot', {
                format: type,
                optimizeForSpeed,
                fromSurface,
                ...(quality !== undefined ? { quality: Math.round(quality) } : {}),
                ...(clip ? { clip: { ...clip, scale: clip.scale ?? 1 } } : {}),
                captureBeyondViewport,
            });
            return data;
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            const result_1 = __disposeResources(env_2);
            if (result_1)
                await result_1;
        }
    }
    async createPDFStream(options = {}) {
        const { timeout: ms = this._timeoutSettings.timeout() } = options;
        const { landscape, displayHeaderFooter, headerTemplate, footerTemplate, printBackground, scale, width: paperWidth, height: paperHeight, margin, pageRanges, preferCSSPageSize, omitBackground, tagged: generateTaggedPDF, outline: generateDocumentOutline, waitForFonts, } = (0, util_js_1.parsePDFOptions)(options);
        if (omitBackground) {
            await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").setTransparentBackgroundColor();
        }
        if (waitForFonts) {
            await (0, rxjs_js_1.firstValueFrom)((0, rxjs_js_1.from)(this.mainFrame()
                .isolatedRealm()
                .evaluate(() => {
                return document.fonts.ready;
            })).pipe((0, rxjs_js_1.raceWith)((0, util_js_1.timeout)(ms))));
        }
        const printCommandPromise = __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Page.printToPDF', {
            transferMode: 'ReturnAsStream',
            landscape,
            displayHeaderFooter,
            headerTemplate,
            footerTemplate,
            printBackground,
            scale,
            paperWidth,
            paperHeight,
            marginTop: margin.top,
            marginBottom: margin.bottom,
            marginLeft: margin.left,
            marginRight: margin.right,
            pageRanges,
            preferCSSPageSize,
            generateTaggedPDF,
            generateDocumentOutline,
        });
        const result = await (0, rxjs_js_1.firstValueFrom)((0, rxjs_js_1.from)(printCommandPromise).pipe((0, rxjs_js_1.raceWith)((0, util_js_1.timeout)(ms))));
        if (omitBackground) {
            await __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").resetDefaultBackgroundColor();
        }
        (0, assert_js_1.assert)(result.stream, '`stream` is missing from `Page.printToPDF');
        return await (0, util_js_1.getReadableFromProtocolStream)(__classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f"), result.stream);
    }
    async pdf(options = {}) {
        const { path = undefined } = options;
        const readable = await this.createPDFStream(options);
        const typedArray = await (0, util_js_1.getReadableAsTypedArray)(readable, path);
        (0, assert_js_1.assert)(typedArray, 'Could not create typed array');
        return typedArray;
    }
    async close(options = { runBeforeUnload: undefined }) {
        const env_3 = { stack: [], error: void 0, hasError: false };
        try {
            const _guard = __addDisposableResource(env_3, await this.browserContext().waitForScreenshotOperations(), false);
            const connection = __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").connection();
            (0, assert_js_1.assert)(connection, 'Protocol error: Connection closed. Most likely the page has been closed.');
            const runBeforeUnload = !!options.runBeforeUnload;
            if (runBeforeUnload) {
                await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Page.close');
            }
            else {
                await connection.send('Target.closeTarget', {
                    targetId: __classPrivateFieldGet(this, _CdpPage_primaryTarget, "f")._targetId,
                });
                await __classPrivateFieldGet(this, _CdpPage_tabTarget, "f")._isClosedDeferred.valueOrThrow();
            }
        }
        catch (e_3) {
            env_3.error = e_3;
            env_3.hasError = true;
        }
        finally {
            __disposeResources(env_3);
        }
    }
    isClosed() {
        return __classPrivateFieldGet(this, _CdpPage_closed, "f");
    }
    get mouse() {
        return __classPrivateFieldGet(this, _CdpPage_mouse, "f");
    }
    /**
     * This method is typically coupled with an action that triggers a device
     * request from an api such as WebBluetooth.
     *
     * :::caution
     *
     * This must be called before the device request is made. It will not return a
     * currently active device prompt.
     *
     * :::
     *
     * @example
     *
     * ```ts
     * const [devicePrompt] = Promise.all([
     *   page.waitForDevicePrompt(),
     *   page.click('#connect-bluetooth'),
     * ]);
     * await devicePrompt.select(
     *   await devicePrompt.waitForDevice(({name}) => name.includes('My Device')),
     * );
     * ```
     */
    async waitForDevicePrompt(options = {}) {
        return await this.mainFrame().waitForDevicePrompt(options);
    }
}
_CdpPage_closed = new WeakMap(), _CdpPage_targetManager = new WeakMap(), _CdpPage_primaryTargetClient = new WeakMap(), _CdpPage_primaryTarget = new WeakMap(), _CdpPage_tabTargetClient = new WeakMap(), _CdpPage_tabTarget = new WeakMap(), _CdpPage_keyboard = new WeakMap(), _CdpPage_mouse = new WeakMap(), _CdpPage_touchscreen = new WeakMap(), _CdpPage_frameManager = new WeakMap(), _CdpPage_emulationManager = new WeakMap(), _CdpPage_tracing = new WeakMap(), _CdpPage_bindings = new WeakMap(), _CdpPage_exposedFunctions = new WeakMap(), _CdpPage_coverage = new WeakMap(), _CdpPage_viewport = new WeakMap(), _CdpPage_workers = new WeakMap(), _CdpPage_fileChooserDeferreds = new WeakMap(), _CdpPage_sessionCloseDeferred = new WeakMap(), _CdpPage_serviceWorkerBypassed = new WeakMap(), _CdpPage_userDragInterceptionEnabled = new WeakMap(), _CdpPage_onDetachedFromTarget = new WeakMap(), _CdpPage_onAttachedToTarget = new WeakMap(), _CdpPage_instances = new WeakSet(), _CdpPage_attachExistingTargets = function _CdpPage_attachExistingTargets() {
    const queue = [];
    for (const childTarget of __classPrivateFieldGet(this, _CdpPage_targetManager, "f").getChildTargets(__classPrivateFieldGet(this, _CdpPage_primaryTarget, "f"))) {
        queue.push(childTarget);
    }
    let idx = 0;
    while (idx < queue.length) {
        const next = queue[idx];
        idx++;
        const session = next._session();
        if (session) {
            __classPrivateFieldGet(this, _CdpPage_onAttachedToTarget, "f").call(this, session);
        }
        for (const childTarget of __classPrivateFieldGet(this, _CdpPage_targetManager, "f").getChildTargets(next)) {
            queue.push(childTarget);
        }
    }
}, _CdpPage_onActivation = async function _CdpPage_onActivation(newSession) {
    // TODO: Remove assert once we have separate Event type for CdpCDPSession.
    (0, assert_js_1.assert)(newSession instanceof CdpSession_js_1.CdpCDPSession, 'CDPSession is not instance of CdpCDPSession');
    __classPrivateFieldSet(this, _CdpPage_primaryTargetClient, newSession, "f");
    __classPrivateFieldSet(this, _CdpPage_primaryTarget, newSession.target(), "f");
    (0, assert_js_1.assert)(__classPrivateFieldGet(this, _CdpPage_primaryTarget, "f"), 'Missing target on swap');
    __classPrivateFieldGet(this, _CdpPage_keyboard, "f").updateClient(newSession);
    __classPrivateFieldGet(this, _CdpPage_mouse, "f").updateClient(newSession);
    __classPrivateFieldGet(this, _CdpPage_touchscreen, "f").updateClient(newSession);
    __classPrivateFieldGet(this, _CdpPage_emulationManager, "f").updateClient(newSession);
    __classPrivateFieldGet(this, _CdpPage_tracing, "f").updateClient(newSession);
    __classPrivateFieldGet(this, _CdpPage_coverage, "f").updateClient(newSession);
    await __classPrivateFieldGet(this, _CdpPage_frameManager, "f").swapFrameTree(newSession);
    __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_setupPrimaryTargetListeners).call(this);
}, _CdpPage_onSecondaryTarget = async function _CdpPage_onSecondaryTarget(session) {
    (0, assert_js_1.assert)(session instanceof CdpSession_js_1.CdpCDPSession);
    if (session.target()._subtype() !== 'prerender') {
        return;
    }
    __classPrivateFieldGet(this, _CdpPage_frameManager, "f").registerSpeculativeSession(session).catch(util_js_1.debugError);
    __classPrivateFieldGet(this, _CdpPage_emulationManager, "f")
        .registerSpeculativeSession(session)
        .catch(util_js_1.debugError);
}, _CdpPage_setupPrimaryTargetListeners = function _CdpPage_setupPrimaryTargetListeners() {
    const clientEmitter = new EventEmitter_js_1.EventEmitter(__classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f"));
    clientEmitter.on(CDPSession_js_1.CDPSessionEvent.Ready, __classPrivateFieldGet(this, _CdpPage_onAttachedToTarget, "f"));
    clientEmitter.on(CDPSession_js_1.CDPSessionEvent.Disconnected, () => {
        __classPrivateFieldGet(this, _CdpPage_sessionCloseDeferred, "f").reject(new Errors_js_1.TargetCloseError('Target closed'));
    });
    clientEmitter.on('Page.domContentEventFired', () => {
        this.emit("domcontentloaded" /* PageEvent.DOMContentLoaded */, undefined);
    });
    clientEmitter.on('Page.loadEventFired', () => {
        this.emit("load" /* PageEvent.Load */, undefined);
    });
    clientEmitter.on('Page.javascriptDialogOpening', __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_onDialog).bind(this));
    clientEmitter.on('Runtime.exceptionThrown', __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_handleException).bind(this));
    clientEmitter.on('Inspector.targetCrashed', __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_onTargetCrashed).bind(this));
    clientEmitter.on('Performance.metrics', __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_emitMetrics).bind(this));
    clientEmitter.on('Log.entryAdded', __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_onLogEntryAdded).bind(this));
    clientEmitter.on('Page.fileChooserOpened', __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_onFileChooser).bind(this));
}, _CdpPage_initialize = async function _CdpPage_initialize() {
    try {
        await Promise.all([
            __classPrivateFieldGet(this, _CdpPage_frameManager, "f").initialize(__classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f")),
            __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Performance.enable'),
            __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Log.enable'),
        ]);
    }
    catch (err) {
        if ((0, ErrorLike_js_1.isErrorLike)(err) && (0, Connection_js_1.isTargetClosedError)(err)) {
            (0, util_js_1.debugError)(err);
        }
        else {
            throw err;
        }
    }
}, _CdpPage_onFileChooser = async function _CdpPage_onFileChooser(event) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
        if (!__classPrivateFieldGet(this, _CdpPage_fileChooserDeferreds, "f").size) {
            return;
        }
        const frame = __classPrivateFieldGet(this, _CdpPage_frameManager, "f").frame(event.frameId);
        (0, assert_js_1.assert)(frame, 'This should never happen.');
        // This is guaranteed to be an HTMLInputElement handle by the event.
        const handle = __addDisposableResource(env_1, (await frame.worlds[IsolatedWorlds_js_1.MAIN_WORLD].adoptBackendNode(event.backendNodeId)), false);
        const fileChooser = new FileChooser_js_1.FileChooser(handle.move(), event.mode !== 'selectSingle');
        for (const promise of __classPrivateFieldGet(this, _CdpPage_fileChooserDeferreds, "f")) {
            promise.resolve(fileChooser);
        }
        __classPrivateFieldGet(this, _CdpPage_fileChooserDeferreds, "f").clear();
    }
    catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
    }
    finally {
        __disposeResources(env_1);
    }
}, _CdpPage_onTargetCrashed = function _CdpPage_onTargetCrashed() {
    this.emit("error" /* PageEvent.Error */, new Error('Page crashed!'));
}, _CdpPage_onLogEntryAdded = function _CdpPage_onLogEntryAdded(event) {
    const { level, text, args, source, url, lineNumber } = event.entry;
    if (args) {
        args.map(arg => {
            void (0, JSHandle_js_1.releaseObject)(__classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f"), arg);
        });
    }
    if (source !== 'worker') {
        this.emit("console" /* PageEvent.Console */, new ConsoleMessage_js_1.ConsoleMessage(convertConsoleMessageLevel(level), text, [], [{ url, lineNumber }]));
    }
}, _CdpPage_emitMetrics = function _CdpPage_emitMetrics(event) {
    this.emit("metrics" /* PageEvent.Metrics */, {
        title: event.title,
        metrics: __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_buildMetricsObject).call(this, event.metrics),
    });
}, _CdpPage_buildMetricsObject = function _CdpPage_buildMetricsObject(metrics) {
    const result = {};
    for (const metric of metrics || []) {
        if (supportedMetrics.has(metric.name)) {
            result[metric.name] = metric.value;
        }
    }
    return result;
}, _CdpPage_handleException = function _CdpPage_handleException(exception) {
    this.emit("pageerror" /* PageEvent.PageError */, (0, utils_js_1.createClientError)(exception.exceptionDetails));
}, _CdpPage_onConsoleAPI = function _CdpPage_onConsoleAPI(world, event) {
    const values = event.args.map(arg => {
        return world.createCdpHandle(arg);
    });
    __classPrivateFieldGet(this, _CdpPage_instances, "m", _CdpPage_addConsoleMessage).call(this, convertConsoleMessageLevel(event.type), values, event.stackTrace);
}, _CdpPage_onBindingCalled = async function _CdpPage_onBindingCalled(world, event) {
    let payload;
    try {
        payload = JSON.parse(event.payload);
    }
    catch {
        // The binding was either called by something in the page or it was
        // called before our wrapper was initialized.
        return;
    }
    const { type, name, seq, args, isTrivial } = payload;
    if (type !== 'exposedFun') {
        return;
    }
    const context = world.context;
    if (!context) {
        return;
    }
    const binding = __classPrivateFieldGet(this, _CdpPage_bindings, "f").get(name);
    await binding?.run(context, seq, args, isTrivial);
}, _CdpPage_addConsoleMessage = function _CdpPage_addConsoleMessage(eventType, args, stackTrace) {
    if (!this.listenerCount("console" /* PageEvent.Console */)) {
        args.forEach(arg => {
            return arg.dispose();
        });
        return;
    }
    const textTokens = [];
    // eslint-disable-next-line max-len -- The comment is long.
    // eslint-disable-next-line rulesdir/use-using -- These are not owned by this function.
    for (const arg of args) {
        const remoteObject = arg.remoteObject();
        if (remoteObject.objectId) {
            textTokens.push(arg.toString());
        }
        else {
            textTokens.push((0, utils_js_1.valueFromRemoteObject)(remoteObject));
        }
    }
    const stackTraceLocations = [];
    if (stackTrace) {
        for (const callFrame of stackTrace.callFrames) {
            stackTraceLocations.push({
                url: callFrame.url,
                lineNumber: callFrame.lineNumber,
                columnNumber: callFrame.columnNumber,
            });
        }
    }
    const message = new ConsoleMessage_js_1.ConsoleMessage(convertConsoleMessageLevel(eventType), textTokens.join(' '), args, stackTraceLocations);
    this.emit("console" /* PageEvent.Console */, message);
}, _CdpPage_onDialog = function _CdpPage_onDialog(event) {
    const type = (0, util_js_1.validateDialogType)(event.type);
    const dialog = new Dialog_js_1.CdpDialog(__classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f"), type, event.message, event.defaultPrompt);
    this.emit("dialog" /* PageEvent.Dialog */, dialog);
}, _CdpPage_go = async function _CdpPage_go(delta, options) {
    const history = await __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Page.getNavigationHistory');
    const entry = history.entries[history.currentIndex + delta];
    if (!entry) {
        return null;
    }
    const result = await Promise.all([
        this.waitForNavigation(options),
        __classPrivateFieldGet(this, _CdpPage_primaryTargetClient, "f").send('Page.navigateToHistoryEntry', {
            entryId: entry.id,
        }),
    ]);
    return result[0];
};
exports.CdpPage = CdpPage;
const supportedMetrics = new Set([
    'Timestamp',
    'Documents',
    'Frames',
    'JSEventListeners',
    'Nodes',
    'LayoutCount',
    'RecalcStyleCount',
    'LayoutDuration',
    'RecalcStyleDuration',
    'ScriptDuration',
    'TaskDuration',
    'JSHeapUsedSize',
    'JSHeapTotalSize',
]);
/** @see https://w3c.github.io/webdriver-bidi/#rectangle-intersection */
function getIntersectionRect(clip, viewport) {
    // Note these will already be normalized.
    const x = Math.max(clip.x, viewport.x);
    const y = Math.max(clip.y, viewport.y);
    return {
        x,
        y,
        width: Math.max(Math.min(clip.x + clip.width, viewport.x + viewport.width) - x, 0),
        height: Math.max(Math.min(clip.y + clip.height, viewport.y + viewport.height) - y, 0),
    };
}
function convertCookiesPartitionKeyFromPuppeteerToCdp(partitionKey) {
    if (partitionKey === undefined) {
        return undefined;
    }
    if (typeof partitionKey === 'string') {
        return {
            topLevelSite: partitionKey,
            hasCrossSiteAncestor: false,
        };
    }
    return {
        topLevelSite: partitionKey.sourceOrigin,
        hasCrossSiteAncestor: partitionKey.hasCrossSiteAncestor ?? false,
    };
}
//# sourceMappingURL=Page.js.map