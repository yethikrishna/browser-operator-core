/**
 * @license
 * Copyright 2022 Google Inc.
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
var _BidiPage_instances, _BidiPage_browserContext, _BidiPage_frame, _BidiPage_viewport, _BidiPage_workers, _BidiPage_cdpEmulationManager, _BidiPage_emulatedNetworkConditions, _BidiPage_fileChooserDeferreds, _BidiPage_initialize, _BidiPage_userAgentInterception, _BidiPage_userAgentPreloadScript, _BidiPage_userInterception, _BidiPage_extraHeadersInterception, _BidiPage_authInterception, _BidiPage_toggleInterception, _BidiPage_applyNetworkConditions, _BidiPage_go, _BidiPage_trustedEmitter_accessor_storage;
import { firstValueFrom, from, raceWith } from '../../third_party/rxjs/rxjs.js';
import { Page, } from '../api/Page.js';
import { Coverage } from '../cdp/Coverage.js';
import { EmulationManager } from '../cdp/EmulationManager.js';
import { Tracing } from '../cdp/Tracing.js';
import { UnsupportedOperation } from '../common/Errors.js';
import { EventEmitter } from '../common/EventEmitter.js';
import { FileChooser } from '../common/FileChooser.js';
import { evaluationString, isString, parsePDFOptions, timeout, } from '../common/util.js';
import { assert } from '../util/assert.js';
import { bubble } from '../util/decorators.js';
import { Deferred } from '../util/Deferred.js';
import { stringToTypedArray } from '../util/encoding.js';
import { isErrorLike } from '../util/ErrorLike.js';
import { BidiElementHandle } from './ElementHandle.js';
import { BidiFrame } from './Frame.js';
import { BidiKeyboard, BidiMouse, BidiTouchscreen } from './Input.js';
import { rewriteNavigationError } from './util.js';
/**
 * Implements Page using WebDriver BiDi.
 *
 * @internal
 */
export class BidiPage extends Page {
    static from(browserContext, browsingContext) {
        const page = new BidiPage(browserContext, browsingContext);
        __classPrivateFieldGet(page, _BidiPage_instances, "m", _BidiPage_initialize).call(page);
        return page;
    }
    get trustedEmitter() { return __classPrivateFieldGet(this, _BidiPage_trustedEmitter_accessor_storage, "f"); }
    set trustedEmitter(value) { __classPrivateFieldSet(this, _BidiPage_trustedEmitter_accessor_storage, value, "f"); }
    _client() {
        return __classPrivateFieldGet(this, _BidiPage_frame, "f").client;
    }
    constructor(browserContext, browsingContext) {
        super();
        _BidiPage_instances.add(this);
        _BidiPage_trustedEmitter_accessor_storage.set(this, new EventEmitter());
        _BidiPage_browserContext.set(this, void 0);
        _BidiPage_frame.set(this, void 0);
        _BidiPage_viewport.set(this, null);
        _BidiPage_workers.set(this, new Set());
        _BidiPage_cdpEmulationManager.set(this, void 0);
        _BidiPage_emulatedNetworkConditions.set(this, void 0);
        _BidiPage_fileChooserDeferreds.set(this, new Set());
        /**
         * @internal
         */
        this._userAgentHeaders = {};
        _BidiPage_userAgentInterception.set(this, void 0);
        _BidiPage_userAgentPreloadScript.set(this, void 0);
        _BidiPage_userInterception.set(this, void 0);
        /**
         * @internal
         */
        this._extraHTTPHeaders = {};
        _BidiPage_extraHeadersInterception.set(this, void 0);
        /**
         * @internal
         */
        this._credentials = null;
        _BidiPage_authInterception.set(this, void 0);
        __classPrivateFieldSet(this, _BidiPage_browserContext, browserContext, "f");
        __classPrivateFieldSet(this, _BidiPage_frame, BidiFrame.from(this, browsingContext), "f");
        __classPrivateFieldSet(this, _BidiPage_cdpEmulationManager, new EmulationManager(__classPrivateFieldGet(this, _BidiPage_frame, "f").client), "f");
        this.tracing = new Tracing(__classPrivateFieldGet(this, _BidiPage_frame, "f").client);
        this.coverage = new Coverage(__classPrivateFieldGet(this, _BidiPage_frame, "f").client);
        this.keyboard = new BidiKeyboard(this);
        this.mouse = new BidiMouse(this);
        this.touchscreen = new BidiTouchscreen(this);
    }
    async setUserAgent(userAgent, userAgentMetadata) {
        if (!__classPrivateFieldGet(this, _BidiPage_browserContext, "f").browser().cdpSupported && userAgentMetadata) {
            throw new UnsupportedOperation('Current Browser does not support `userAgentMetadata`');
        }
        else if (__classPrivateFieldGet(this, _BidiPage_browserContext, "f").browser().cdpSupported &&
            userAgentMetadata) {
            return await this._client().send('Network.setUserAgentOverride', {
                userAgent: userAgent,
                userAgentMetadata: userAgentMetadata,
            });
        }
        const enable = userAgent !== '';
        userAgent = userAgent ?? (await __classPrivateFieldGet(this, _BidiPage_browserContext, "f").browser().userAgent());
        this._userAgentHeaders = enable
            ? {
                'User-Agent': userAgent,
            }
            : {};
        __classPrivateFieldSet(this, _BidiPage_userAgentInterception, await __classPrivateFieldGet(this, _BidiPage_instances, "m", _BidiPage_toggleInterception).call(this, ["beforeRequestSent" /* Bidi.Network.InterceptPhase.BeforeRequestSent */], __classPrivateFieldGet(this, _BidiPage_userAgentInterception, "f"), enable), "f");
        const changeUserAgent = (userAgent) => {
            Object.defineProperty(navigator, 'userAgent', {
                value: userAgent,
                configurable: true,
            });
        };
        const frames = [__classPrivateFieldGet(this, _BidiPage_frame, "f")];
        for (const frame of frames) {
            frames.push(...frame.childFrames());
        }
        if (__classPrivateFieldGet(this, _BidiPage_userAgentPreloadScript, "f")) {
            await this.removeScriptToEvaluateOnNewDocument(__classPrivateFieldGet(this, _BidiPage_userAgentPreloadScript, "f"));
        }
        const [evaluateToken] = await Promise.all([
            enable
                ? this.evaluateOnNewDocument(changeUserAgent, userAgent)
                : undefined,
            // When we disable the UserAgent we want to
            // evaluate the original value in all Browsing Contexts
            ...frames.map(frame => {
                return frame.evaluate(changeUserAgent, userAgent);
            }),
        ]);
        __classPrivateFieldSet(this, _BidiPage_userAgentPreloadScript, evaluateToken?.identifier, "f");
    }
    async setBypassCSP(enabled) {
        // TODO: handle CDP-specific cases such as mprach.
        await this._client().send('Page.setBypassCSP', { enabled });
    }
    async queryObjects(prototypeHandle) {
        assert(!prototypeHandle.disposed, 'Prototype JSHandle is disposed!');
        assert(prototypeHandle.id, 'Prototype JSHandle must not be referencing primitive value');
        const response = await __classPrivateFieldGet(this, _BidiPage_frame, "f").client.send('Runtime.queryObjects', {
            prototypeObjectId: prototypeHandle.id,
        });
        return __classPrivateFieldGet(this, _BidiPage_frame, "f").mainRealm().createHandle({
            type: 'array',
            handle: response.objects.objectId,
        });
    }
    browser() {
        return this.browserContext().browser();
    }
    browserContext() {
        return __classPrivateFieldGet(this, _BidiPage_browserContext, "f");
    }
    mainFrame() {
        return __classPrivateFieldGet(this, _BidiPage_frame, "f");
    }
    async focusedFrame() {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const handle = __addDisposableResource(env_1, (await this.mainFrame()
                .isolatedRealm()
                .evaluateHandle(() => {
                let win = window;
                while (win.document.activeElement instanceof win.HTMLIFrameElement ||
                    win.document.activeElement instanceof win.HTMLFrameElement) {
                    if (win.document.activeElement.contentWindow === null) {
                        break;
                    }
                    win = win.document.activeElement.contentWindow;
                }
                return win;
            })), false);
            const value = handle.remoteValue();
            assert(value.type === 'window');
            const frame = this.frames().find(frame => {
                return frame._id === value.value.context;
            });
            assert(frame);
            return frame;
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    frames() {
        const frames = [__classPrivateFieldGet(this, _BidiPage_frame, "f")];
        for (const frame of frames) {
            frames.push(...frame.childFrames());
        }
        return frames;
    }
    isClosed() {
        return __classPrivateFieldGet(this, _BidiPage_frame, "f").detached;
    }
    async close(options) {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const _guard = __addDisposableResource(env_2, await __classPrivateFieldGet(this, _BidiPage_browserContext, "f").waitForScreenshotOperations(), false);
            try {
                await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.close(options?.runBeforeUnload);
            }
            catch {
                return;
            }
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            __disposeResources(env_2);
        }
    }
    async reload(options = {}) {
        const [response] = await Promise.all([
            __classPrivateFieldGet(this, _BidiPage_frame, "f").waitForNavigation(options),
            __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.reload(),
        ]).catch(rewriteNavigationError(this.url(), options.timeout ?? this._timeoutSettings.navigationTimeout()));
        return response;
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
    isJavaScriptEnabled() {
        return __classPrivateFieldGet(this, _BidiPage_cdpEmulationManager, "f").javascriptEnabled;
    }
    async setGeolocation(options) {
        const { longitude, latitude, accuracy = 0 } = options;
        if (longitude < -180 || longitude > 180) {
            throw new Error(`Invalid longitude "${longitude}": precondition -180 <= LONGITUDE <= 180 failed.`);
        }
        if (latitude < -90 || latitude > 90) {
            throw new Error(`Invalid latitude "${latitude}": precondition -90 <= LATITUDE <= 90 failed.`);
        }
        if (accuracy < 0) {
            throw new Error(`Invalid accuracy "${accuracy}": precondition 0 <= ACCURACY failed.`);
        }
        return await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.setGeolocationOverride({
            coordinates: {
                latitude: options.latitude,
                longitude: options.longitude,
                accuracy: options.accuracy,
            },
        });
    }
    async setJavaScriptEnabled(enabled) {
        return await __classPrivateFieldGet(this, _BidiPage_cdpEmulationManager, "f").setJavaScriptEnabled(enabled);
    }
    async emulateMediaType(type) {
        return await __classPrivateFieldGet(this, _BidiPage_cdpEmulationManager, "f").emulateMediaType(type);
    }
    async emulateCPUThrottling(factor) {
        return await __classPrivateFieldGet(this, _BidiPage_cdpEmulationManager, "f").emulateCPUThrottling(factor);
    }
    async emulateMediaFeatures(features) {
        return await __classPrivateFieldGet(this, _BidiPage_cdpEmulationManager, "f").emulateMediaFeatures(features);
    }
    async emulateTimezone(timezoneId) {
        return await __classPrivateFieldGet(this, _BidiPage_cdpEmulationManager, "f").emulateTimezone(timezoneId);
    }
    async emulateIdleState(overrides) {
        return await __classPrivateFieldGet(this, _BidiPage_cdpEmulationManager, "f").emulateIdleState(overrides);
    }
    async emulateVisionDeficiency(type) {
        return await __classPrivateFieldGet(this, _BidiPage_cdpEmulationManager, "f").emulateVisionDeficiency(type);
    }
    async setViewport(viewport) {
        if (!this.browser().cdpSupported) {
            await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.setViewport({
                viewport: viewport?.width && viewport?.height
                    ? {
                        width: viewport.width,
                        height: viewport.height,
                    }
                    : null,
                devicePixelRatio: viewport?.deviceScaleFactor
                    ? viewport.deviceScaleFactor
                    : null,
            });
            __classPrivateFieldSet(this, _BidiPage_viewport, viewport, "f");
            return;
        }
        const needsReload = await __classPrivateFieldGet(this, _BidiPage_cdpEmulationManager, "f").emulateViewport(viewport);
        __classPrivateFieldSet(this, _BidiPage_viewport, viewport, "f");
        if (needsReload) {
            await this.reload();
        }
    }
    viewport() {
        return __classPrivateFieldGet(this, _BidiPage_viewport, "f");
    }
    async pdf(options = {}) {
        const { timeout: ms = this._timeoutSettings.timeout(), path = undefined } = options;
        const { printBackground: background, margin, landscape, width, height, pageRanges: ranges, scale, preferCSSPageSize, } = parsePDFOptions(options, 'cm');
        const pageRanges = ranges ? ranges.split(', ') : [];
        await firstValueFrom(from(this.mainFrame()
            .isolatedRealm()
            .evaluate(() => {
            return document.fonts.ready;
        })).pipe(raceWith(timeout(ms))));
        const data = await firstValueFrom(from(__classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.print({
            background,
            margin,
            orientation: landscape ? 'landscape' : 'portrait',
            page: {
                width,
                height,
            },
            pageRanges,
            scale,
            shrinkToFit: !preferCSSPageSize,
        })).pipe(raceWith(timeout(ms))));
        const typedArray = stringToTypedArray(data, true);
        await this._maybeWriteTypedArrayToFile(path, typedArray);
        return typedArray;
    }
    async createPDFStream(options) {
        const typedArray = await this.pdf(options);
        return new ReadableStream({
            start(controller) {
                controller.enqueue(typedArray);
                controller.close();
            },
        });
    }
    async _screenshot(options) {
        const { clip, type, captureBeyondViewport, quality } = options;
        if (options.omitBackground !== undefined && options.omitBackground) {
            throw new UnsupportedOperation(`BiDi does not support 'omitBackground'.`);
        }
        if (options.optimizeForSpeed !== undefined && options.optimizeForSpeed) {
            throw new UnsupportedOperation(`BiDi does not support 'optimizeForSpeed'.`);
        }
        if (options.fromSurface !== undefined && !options.fromSurface) {
            throw new UnsupportedOperation(`BiDi does not support 'fromSurface'.`);
        }
        if (clip !== undefined && clip.scale !== undefined && clip.scale !== 1) {
            throw new UnsupportedOperation(`BiDi does not support 'scale' in 'clip'.`);
        }
        let box;
        if (clip) {
            if (captureBeyondViewport) {
                box = clip;
            }
            else {
                // The clip is always with respect to the document coordinates, so we
                // need to convert this to viewport coordinates when we aren't capturing
                // beyond the viewport.
                const [pageLeft, pageTop] = await this.evaluate(() => {
                    if (!window.visualViewport) {
                        throw new Error('window.visualViewport is not supported.');
                    }
                    return [
                        window.visualViewport.pageLeft,
                        window.visualViewport.pageTop,
                    ];
                });
                box = {
                    ...clip,
                    x: clip.x - pageLeft,
                    y: clip.y - pageTop,
                };
            }
        }
        const data = await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.captureScreenshot({
            origin: captureBeyondViewport ? 'document' : 'viewport',
            format: {
                type: `image/${type}`,
                ...(quality !== undefined ? { quality: quality / 100 } : {}),
            },
            ...(box ? { clip: { type: 'box', ...box } } : {}),
        });
        return data;
    }
    async createCDPSession() {
        return await __classPrivateFieldGet(this, _BidiPage_frame, "f").createCDPSession();
    }
    async bringToFront() {
        await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.activate();
    }
    async evaluateOnNewDocument(pageFunction, ...args) {
        const expression = evaluationExpression(pageFunction, ...args);
        const script = await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.addPreloadScript(expression);
        return { identifier: script };
    }
    async removeScriptToEvaluateOnNewDocument(id) {
        await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.removePreloadScript(id);
    }
    async exposeFunction(name, pptrFunction) {
        return await this.mainFrame().exposeFunction(name, 'default' in pptrFunction ? pptrFunction.default : pptrFunction);
    }
    isDragInterceptionEnabled() {
        return false;
    }
    async setCacheEnabled(enabled) {
        if (!__classPrivateFieldGet(this, _BidiPage_browserContext, "f").browser().cdpSupported) {
            await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.setCacheBehavior(enabled ? 'default' : 'bypass');
            return;
        }
        // TODO: handle CDP-specific cases such as mprach.
        await this._client().send('Network.setCacheDisabled', {
            cacheDisabled: !enabled,
        });
    }
    async cookies(...urls) {
        const normalizedUrls = (urls.length ? urls : [this.url()]).map(url => {
            return new URL(url);
        });
        const cookies = await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.getCookies();
        return cookies
            .map(cookie => {
            return bidiToPuppeteerCookie(cookie);
        })
            .filter(cookie => {
            return normalizedUrls.some(url => {
                return testUrlMatchCookie(cookie, url);
            });
        });
    }
    isServiceWorkerBypassed() {
        throw new UnsupportedOperation();
    }
    target() {
        throw new UnsupportedOperation();
    }
    async waitForFileChooser(options = {}) {
        const { timeout = this._timeoutSettings.timeout() } = options;
        const deferred = Deferred.create({
            message: `Waiting for \`FileChooser\` failed: ${timeout}ms exceeded`,
            timeout,
        });
        __classPrivateFieldGet(this, _BidiPage_fileChooserDeferreds, "f").add(deferred);
        if (options.signal) {
            options.signal.addEventListener('abort', () => {
                deferred.reject(options.signal?.reason);
            }, { once: true });
        }
        __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.once('filedialogopened', info => {
            if (!info.element) {
                return;
            }
            const chooser = new FileChooser(BidiElementHandle.from({
                sharedId: info.element.sharedId,
                handle: info.element.handle,
                type: 'node',
            }, __classPrivateFieldGet(this, _BidiPage_frame, "f").mainRealm()), info.multiple);
            for (const deferred of __classPrivateFieldGet(this, _BidiPage_fileChooserDeferreds, "f")) {
                deferred.resolve(chooser);
                __classPrivateFieldGet(this, _BidiPage_fileChooserDeferreds, "f").delete(deferred);
            }
        });
        try {
            return await deferred.valueOrThrow();
        }
        catch (error) {
            __classPrivateFieldGet(this, _BidiPage_fileChooserDeferreds, "f").delete(deferred);
            throw error;
        }
    }
    workers() {
        return [...__classPrivateFieldGet(this, _BidiPage_workers, "f")];
    }
    async setRequestInterception(enable) {
        __classPrivateFieldSet(this, _BidiPage_userInterception, await __classPrivateFieldGet(this, _BidiPage_instances, "m", _BidiPage_toggleInterception).call(this, ["beforeRequestSent" /* Bidi.Network.InterceptPhase.BeforeRequestSent */], __classPrivateFieldGet(this, _BidiPage_userInterception, "f"), enable), "f");
    }
    async setExtraHTTPHeaders(headers) {
        const extraHTTPHeaders = {};
        for (const [key, value] of Object.entries(headers)) {
            assert(isString(value), `Expected value of header "${key}" to be String, but "${typeof value}" is found.`);
            extraHTTPHeaders[key.toLowerCase()] = value;
        }
        this._extraHTTPHeaders = extraHTTPHeaders;
        __classPrivateFieldSet(this, _BidiPage_extraHeadersInterception, await __classPrivateFieldGet(this, _BidiPage_instances, "m", _BidiPage_toggleInterception).call(this, ["beforeRequestSent" /* Bidi.Network.InterceptPhase.BeforeRequestSent */], __classPrivateFieldGet(this, _BidiPage_extraHeadersInterception, "f"), Boolean(Object.keys(this._extraHTTPHeaders).length)), "f");
    }
    async authenticate(credentials) {
        __classPrivateFieldSet(this, _BidiPage_authInterception, await __classPrivateFieldGet(this, _BidiPage_instances, "m", _BidiPage_toggleInterception).call(this, ["authRequired" /* Bidi.Network.InterceptPhase.AuthRequired */], __classPrivateFieldGet(this, _BidiPage_authInterception, "f"), Boolean(credentials)), "f");
        this._credentials = credentials;
    }
    setDragInterception() {
        throw new UnsupportedOperation();
    }
    setBypassServiceWorker() {
        throw new UnsupportedOperation();
    }
    async setOfflineMode(enabled) {
        if (!__classPrivateFieldGet(this, _BidiPage_browserContext, "f").browser().cdpSupported) {
            throw new UnsupportedOperation();
        }
        if (!__classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f")) {
            __classPrivateFieldSet(this, _BidiPage_emulatedNetworkConditions, {
                offline: false,
                upload: -1,
                download: -1,
                latency: 0,
            }, "f");
        }
        __classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f").offline = enabled;
        return await __classPrivateFieldGet(this, _BidiPage_instances, "m", _BidiPage_applyNetworkConditions).call(this);
    }
    async emulateNetworkConditions(networkConditions) {
        if (!__classPrivateFieldGet(this, _BidiPage_browserContext, "f").browser().cdpSupported) {
            throw new UnsupportedOperation();
        }
        if (!__classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f")) {
            __classPrivateFieldSet(this, _BidiPage_emulatedNetworkConditions, {
                offline: false,
                upload: -1,
                download: -1,
                latency: 0,
            }, "f");
        }
        __classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f").upload = networkConditions
            ? networkConditions.upload
            : -1;
        __classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f").download = networkConditions
            ? networkConditions.download
            : -1;
        __classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f").latency = networkConditions
            ? networkConditions.latency
            : 0;
        return await __classPrivateFieldGet(this, _BidiPage_instances, "m", _BidiPage_applyNetworkConditions).call(this);
    }
    async setCookie(...cookies) {
        const pageURL = this.url();
        const pageUrlStartsWithHTTP = pageURL.startsWith('http');
        for (const cookie of cookies) {
            let cookieUrl = cookie.url || '';
            if (!cookieUrl && pageUrlStartsWithHTTP) {
                cookieUrl = pageURL;
            }
            assert(cookieUrl !== 'about:blank', `Blank page can not have cookie "${cookie.name}"`);
            assert(!String.prototype.startsWith.call(cookieUrl || '', 'data:'), `Data URL page can not have cookie "${cookie.name}"`);
            // TODO: Support Chrome cookie partition keys
            assert(cookie.partitionKey === undefined ||
                typeof cookie.partitionKey === 'string', 'BiDi only allows domain partition keys');
            const normalizedUrl = URL.canParse(cookieUrl)
                ? new URL(cookieUrl)
                : undefined;
            const domain = cookie.domain ?? normalizedUrl?.hostname;
            assert(domain !== undefined, `At least one of the url and domain needs to be specified`);
            const bidiCookie = {
                domain: domain,
                name: cookie.name,
                value: {
                    type: 'string',
                    value: cookie.value,
                },
                ...(cookie.path !== undefined ? { path: cookie.path } : {}),
                ...(cookie.httpOnly !== undefined ? { httpOnly: cookie.httpOnly } : {}),
                ...(cookie.secure !== undefined ? { secure: cookie.secure } : {}),
                ...(cookie.sameSite !== undefined
                    ? { sameSite: convertCookiesSameSiteCdpToBiDi(cookie.sameSite) }
                    : {}),
                ...{ expiry: convertCookiesExpiryCdpToBiDi(cookie.expires) },
                // Chrome-specific properties.
                ...cdpSpecificCookiePropertiesFromPuppeteerToBidi(cookie, 'sameParty', 'sourceScheme', 'priority', 'url'),
            };
            if (cookie.partitionKey !== undefined) {
                await this.browserContext().userContext.setCookie(bidiCookie, cookie.partitionKey);
            }
            else {
                await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.setCookie(bidiCookie);
            }
        }
    }
    async deleteCookie(...cookies) {
        await Promise.all(cookies.map(async (deleteCookieRequest) => {
            const cookieUrl = deleteCookieRequest.url ?? this.url();
            const normalizedUrl = URL.canParse(cookieUrl)
                ? new URL(cookieUrl)
                : undefined;
            const domain = deleteCookieRequest.domain ?? normalizedUrl?.hostname;
            assert(domain !== undefined, `At least one of the url and domain needs to be specified`);
            const filter = {
                domain: domain,
                name: deleteCookieRequest.name,
                ...(deleteCookieRequest.path !== undefined
                    ? { path: deleteCookieRequest.path }
                    : {}),
            };
            await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.deleteCookie(filter);
        }));
    }
    async removeExposedFunction(name) {
        await __classPrivateFieldGet(this, _BidiPage_frame, "f").removeExposedFunction(name);
    }
    metrics() {
        throw new UnsupportedOperation();
    }
    async goBack(options = {}) {
        return await __classPrivateFieldGet(this, _BidiPage_instances, "m", _BidiPage_go).call(this, -1, options);
    }
    async goForward(options = {}) {
        return await __classPrivateFieldGet(this, _BidiPage_instances, "m", _BidiPage_go).call(this, 1, options);
    }
    waitForDevicePrompt() {
        throw new UnsupportedOperation();
    }
}
_BidiPage_browserContext = new WeakMap(), _BidiPage_frame = new WeakMap(), _BidiPage_viewport = new WeakMap(), _BidiPage_workers = new WeakMap(), _BidiPage_cdpEmulationManager = new WeakMap(), _BidiPage_emulatedNetworkConditions = new WeakMap(), _BidiPage_fileChooserDeferreds = new WeakMap(), _BidiPage_userAgentInterception = new WeakMap(), _BidiPage_userAgentPreloadScript = new WeakMap(), _BidiPage_userInterception = new WeakMap(), _BidiPage_extraHeadersInterception = new WeakMap(), _BidiPage_authInterception = new WeakMap(), _BidiPage_instances = new WeakSet(), _BidiPage_trustedEmitter_accessor_storage = new WeakMap(), _BidiPage_initialize = function _BidiPage_initialize() {
    __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.on('closed', () => {
        this.trustedEmitter.emit("close" /* PageEvent.Close */, undefined);
        this.trustedEmitter.removeAllListeners();
    });
    this.trustedEmitter.on("workercreated" /* PageEvent.WorkerCreated */, worker => {
        __classPrivateFieldGet(this, _BidiPage_workers, "f").add(worker);
    });
    this.trustedEmitter.on("workerdestroyed" /* PageEvent.WorkerDestroyed */, worker => {
        __classPrivateFieldGet(this, _BidiPage_workers, "f").delete(worker);
    });
}, _BidiPage_toggleInterception = async function _BidiPage_toggleInterception(phases, interception, expected) {
    if (expected && !interception) {
        return await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.addIntercept({
            phases,
        });
    }
    else if (!expected && interception) {
        await __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.userContext.browser.removeIntercept(interception);
        return;
    }
    return interception;
}, _BidiPage_applyNetworkConditions = async function _BidiPage_applyNetworkConditions() {
    if (!__classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f")) {
        return;
    }
    await this._client().send('Network.emulateNetworkConditions', {
        offline: __classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f").offline,
        latency: __classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f").latency,
        uploadThroughput: __classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f").upload,
        downloadThroughput: __classPrivateFieldGet(this, _BidiPage_emulatedNetworkConditions, "f").download,
    });
}, _BidiPage_go = async function _BidiPage_go(delta, options) {
    const controller = new AbortController();
    try {
        const [response] = await Promise.all([
            this.waitForNavigation({
                ...options,
                signal: controller.signal,
            }),
            __classPrivateFieldGet(this, _BidiPage_frame, "f").browsingContext.traverseHistory(delta),
        ]);
        return response;
    }
    catch (error) {
        controller.abort();
        if (isErrorLike(error)) {
            if (error.message.includes('no such history entry')) {
                return null;
            }
        }
        throw error;
    }
};
__decorate([
    bubble(),
    __metadata("design:type", Object)
], BidiPage.prototype, "trustedEmitter", null);
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function evaluationExpression(fun, ...args) {
    return `() => {${evaluationString(fun, ...args)}}`;
}
/**
 * Check domains match.
 */
function testUrlMatchCookieHostname(cookie, normalizedUrl) {
    const cookieDomain = cookie.domain.toLowerCase();
    const urlHostname = normalizedUrl.hostname.toLowerCase();
    if (cookieDomain === urlHostname) {
        return true;
    }
    // TODO: does not consider additional restrictions w.r.t to IP
    // addresses which is fine as it is for representation and does not
    // mean that cookies actually apply that way in the browser.
    // https://datatracker.ietf.org/doc/html/rfc6265#section-5.1.3
    return cookieDomain.startsWith('.') && urlHostname.endsWith(cookieDomain);
}
/**
 * Check paths match.
 * Spec: https://datatracker.ietf.org/doc/html/rfc6265#section-5.1.4
 */
function testUrlMatchCookiePath(cookie, normalizedUrl) {
    const uriPath = normalizedUrl.pathname;
    const cookiePath = cookie.path;
    if (uriPath === cookiePath) {
        // The cookie-path and the request-path are identical.
        return true;
    }
    if (uriPath.startsWith(cookiePath)) {
        // The cookie-path is a prefix of the request-path.
        if (cookiePath.endsWith('/')) {
            // The last character of the cookie-path is %x2F ("/").
            return true;
        }
        if (uriPath[cookiePath.length] === '/') {
            // The first character of the request-path that is not included in the cookie-path
            // is a %x2F ("/") character.
            return true;
        }
    }
    return false;
}
/**
 * Checks the cookie matches the URL according to the spec:
 */
function testUrlMatchCookie(cookie, url) {
    const normalizedUrl = new URL(url);
    assert(cookie !== undefined);
    if (!testUrlMatchCookieHostname(cookie, normalizedUrl)) {
        return false;
    }
    return testUrlMatchCookiePath(cookie, normalizedUrl);
}
export function bidiToPuppeteerCookie(bidiCookie, returnCompositePartitionKey = false) {
    const partitionKey = bidiCookie[CDP_SPECIFIC_PREFIX + 'partitionKey'];
    function getParitionKey() {
        if (typeof partitionKey === 'string') {
            return { partitionKey };
        }
        if (typeof partitionKey === 'object' && partitionKey !== null) {
            if (returnCompositePartitionKey) {
                return {
                    partitionKey: {
                        sourceOrigin: partitionKey.topLevelSite,
                        hasCrossSiteAncestor: partitionKey.hasCrossSiteAncestor ?? false,
                    },
                };
            }
            return {
                // TODO: a breaking change in Puppeteer is required to change
                // partitionKey type and report the composite partition key.
                partitionKey: partitionKey.topLevelSite,
            };
        }
        return {};
    }
    return {
        name: bidiCookie.name,
        // Presents binary value as base64 string.
        value: bidiCookie.value.value,
        domain: bidiCookie.domain,
        path: bidiCookie.path,
        size: bidiCookie.size,
        httpOnly: bidiCookie.httpOnly,
        secure: bidiCookie.secure,
        sameSite: convertCookiesSameSiteBiDiToCdp(bidiCookie.sameSite),
        expires: bidiCookie.expiry ?? -1,
        session: bidiCookie.expiry === undefined || bidiCookie.expiry <= 0,
        // Extending with CDP-specific properties with `goog:` prefix.
        ...cdpSpecificCookiePropertiesFromBidiToPuppeteer(bidiCookie, 'sameParty', 'sourceScheme', 'partitionKeyOpaque', 'priority'),
        ...getParitionKey(),
    };
}
const CDP_SPECIFIC_PREFIX = 'goog:';
/**
 * Gets CDP-specific properties from the BiDi cookie and returns them as a new object.
 */
function cdpSpecificCookiePropertiesFromBidiToPuppeteer(bidiCookie, ...propertyNames) {
    const result = {};
    for (const property of propertyNames) {
        if (bidiCookie[CDP_SPECIFIC_PREFIX + property] !== undefined) {
            result[property] = bidiCookie[CDP_SPECIFIC_PREFIX + property];
        }
    }
    return result;
}
/**
 * Gets CDP-specific properties from the cookie, adds CDP-specific prefixes and returns
 * them as a new object which can be used in BiDi.
 */
export function cdpSpecificCookiePropertiesFromPuppeteerToBidi(cookieParam, ...propertyNames) {
    const result = {};
    for (const property of propertyNames) {
        if (cookieParam[property] !== undefined) {
            result[CDP_SPECIFIC_PREFIX + property] = cookieParam[property];
        }
    }
    return result;
}
function convertCookiesSameSiteBiDiToCdp(sameSite) {
    return sameSite === 'strict' ? 'Strict' : sameSite === 'lax' ? 'Lax' : 'None';
}
export function convertCookiesSameSiteCdpToBiDi(sameSite) {
    return sameSite === 'Strict'
        ? "strict" /* Bidi.Network.SameSite.Strict */
        : sameSite === 'Lax'
            ? "lax" /* Bidi.Network.SameSite.Lax */
            : "none" /* Bidi.Network.SameSite.None */;
}
export function convertCookiesExpiryCdpToBiDi(expiry) {
    return [undefined, -1].includes(expiry) ? undefined : expiry;
}
export function convertCookiesPartitionKeyFromPuppeteerToBiDi(partitionKey) {
    if (partitionKey === undefined || typeof partitionKey === 'string') {
        return partitionKey;
    }
    if (partitionKey.hasCrossSiteAncestor) {
        throw new UnsupportedOperation('WebDriver BiDi does not support `hasCrossSiteAncestor` yet.');
    }
    return partitionKey.sourceOrigin;
}
//# sourceMappingURL=Page.js.map