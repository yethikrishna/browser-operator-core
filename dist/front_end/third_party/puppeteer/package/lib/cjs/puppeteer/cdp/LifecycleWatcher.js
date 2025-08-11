"use strict";
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
var _LifecycleWatcher_instances, _LifecycleWatcher_expectedLifecycle, _LifecycleWatcher_frame, _LifecycleWatcher_timeout, _LifecycleWatcher_navigationRequest, _LifecycleWatcher_subscriptions, _LifecycleWatcher_initialLoaderId, _LifecycleWatcher_terminationDeferred, _LifecycleWatcher_sameDocumentNavigationDeferred, _LifecycleWatcher_lifecycleDeferred, _LifecycleWatcher_newDocumentNavigationDeferred, _LifecycleWatcher_hasSameDocumentNavigation, _LifecycleWatcher_swapped, _LifecycleWatcher_navigationResponseReceived, _LifecycleWatcher_onRequest, _LifecycleWatcher_onRequestFailed, _LifecycleWatcher_onResponse, _LifecycleWatcher_onFrameDetached, _LifecycleWatcher_navigatedWithinDocument, _LifecycleWatcher_navigated, _LifecycleWatcher_frameSwapped, _LifecycleWatcher_checkLifecycleComplete;
/**
 * @license
 * Copyright 2019 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleWatcher = void 0;
const Frame_js_1 = require("../api/Frame.js");
const EventEmitter_js_1 = require("../common/EventEmitter.js");
const NetworkManagerEvents_js_1 = require("../common/NetworkManagerEvents.js");
const assert_js_1 = require("../util/assert.js");
const Deferred_js_1 = require("../util/Deferred.js");
const disposable_js_1 = require("../util/disposable.js");
const FrameManagerEvents_js_1 = require("./FrameManagerEvents.js");
const puppeteerToProtocolLifecycle = new Map([
    ['load', 'load'],
    ['domcontentloaded', 'DOMContentLoaded'],
    ['networkidle0', 'networkIdle'],
    ['networkidle2', 'networkAlmostIdle'],
]);
/**
 * @internal
 */
class LifecycleWatcher {
    constructor(networkManager, frame, waitUntil, timeout, signal) {
        _LifecycleWatcher_instances.add(this);
        _LifecycleWatcher_expectedLifecycle.set(this, void 0);
        _LifecycleWatcher_frame.set(this, void 0);
        _LifecycleWatcher_timeout.set(this, void 0);
        _LifecycleWatcher_navigationRequest.set(this, null);
        _LifecycleWatcher_subscriptions.set(this, new disposable_js_1.DisposableStack());
        _LifecycleWatcher_initialLoaderId.set(this, void 0);
        _LifecycleWatcher_terminationDeferred.set(this, void 0);
        _LifecycleWatcher_sameDocumentNavigationDeferred.set(this, Deferred_js_1.Deferred.create());
        _LifecycleWatcher_lifecycleDeferred.set(this, Deferred_js_1.Deferred.create());
        _LifecycleWatcher_newDocumentNavigationDeferred.set(this, Deferred_js_1.Deferred.create());
        _LifecycleWatcher_hasSameDocumentNavigation.set(this, void 0);
        _LifecycleWatcher_swapped.set(this, void 0);
        _LifecycleWatcher_navigationResponseReceived.set(this, void 0);
        if (Array.isArray(waitUntil)) {
            waitUntil = waitUntil.slice();
        }
        else if (typeof waitUntil === 'string') {
            waitUntil = [waitUntil];
        }
        __classPrivateFieldSet(this, _LifecycleWatcher_initialLoaderId, frame._loaderId, "f");
        __classPrivateFieldSet(this, _LifecycleWatcher_expectedLifecycle, waitUntil.map(value => {
            const protocolEvent = puppeteerToProtocolLifecycle.get(value);
            (0, assert_js_1.assert)(protocolEvent, 'Unknown value for options.waitUntil: ' + value);
            return protocolEvent;
        }), "f");
        signal?.addEventListener('abort', () => {
            __classPrivateFieldGet(this, _LifecycleWatcher_terminationDeferred, "f").reject(signal.reason);
        });
        __classPrivateFieldSet(this, _LifecycleWatcher_frame, frame, "f");
        __classPrivateFieldSet(this, _LifecycleWatcher_timeout, timeout, "f");
        const frameManagerEmitter = __classPrivateFieldGet(this, _LifecycleWatcher_subscriptions, "f").use(new EventEmitter_js_1.EventEmitter(frame._frameManager));
        frameManagerEmitter.on(FrameManagerEvents_js_1.FrameManagerEvent.LifecycleEvent, __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).bind(this));
        const frameEmitter = __classPrivateFieldGet(this, _LifecycleWatcher_subscriptions, "f").use(new EventEmitter_js_1.EventEmitter(frame));
        frameEmitter.on(Frame_js_1.FrameEvent.FrameNavigatedWithinDocument, __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_navigatedWithinDocument).bind(this));
        frameEmitter.on(Frame_js_1.FrameEvent.FrameNavigated, __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_navigated).bind(this));
        frameEmitter.on(Frame_js_1.FrameEvent.FrameSwapped, __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_frameSwapped).bind(this));
        frameEmitter.on(Frame_js_1.FrameEvent.FrameSwappedByActivation, __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_frameSwapped).bind(this));
        frameEmitter.on(Frame_js_1.FrameEvent.FrameDetached, __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onFrameDetached).bind(this));
        const networkManagerEmitter = __classPrivateFieldGet(this, _LifecycleWatcher_subscriptions, "f").use(new EventEmitter_js_1.EventEmitter(networkManager));
        networkManagerEmitter.on(NetworkManagerEvents_js_1.NetworkManagerEvent.Request, __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onRequest).bind(this));
        networkManagerEmitter.on(NetworkManagerEvents_js_1.NetworkManagerEvent.Response, __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onResponse).bind(this));
        networkManagerEmitter.on(NetworkManagerEvents_js_1.NetworkManagerEvent.RequestFailed, __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onRequestFailed).bind(this));
        __classPrivateFieldSet(this, _LifecycleWatcher_terminationDeferred, Deferred_js_1.Deferred.create({
            timeout: __classPrivateFieldGet(this, _LifecycleWatcher_timeout, "f"),
            message: `Navigation timeout of ${__classPrivateFieldGet(this, _LifecycleWatcher_timeout, "f")} ms exceeded`,
        }), "f");
        __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
    }
    async navigationResponse() {
        // Continue with a possibly null response.
        await __classPrivateFieldGet(this, _LifecycleWatcher_navigationResponseReceived, "f")?.valueOrThrow();
        return __classPrivateFieldGet(this, _LifecycleWatcher_navigationRequest, "f") ? __classPrivateFieldGet(this, _LifecycleWatcher_navigationRequest, "f").response() : null;
    }
    sameDocumentNavigationPromise() {
        return __classPrivateFieldGet(this, _LifecycleWatcher_sameDocumentNavigationDeferred, "f").valueOrThrow();
    }
    newDocumentNavigationPromise() {
        return __classPrivateFieldGet(this, _LifecycleWatcher_newDocumentNavigationDeferred, "f").valueOrThrow();
    }
    lifecyclePromise() {
        return __classPrivateFieldGet(this, _LifecycleWatcher_lifecycleDeferred, "f").valueOrThrow();
    }
    terminationPromise() {
        return __classPrivateFieldGet(this, _LifecycleWatcher_terminationDeferred, "f").valueOrThrow();
    }
    dispose() {
        __classPrivateFieldGet(this, _LifecycleWatcher_subscriptions, "f").dispose();
        __classPrivateFieldGet(this, _LifecycleWatcher_terminationDeferred, "f").resolve(new Error('LifecycleWatcher disposed'));
    }
}
_LifecycleWatcher_expectedLifecycle = new WeakMap(), _LifecycleWatcher_frame = new WeakMap(), _LifecycleWatcher_timeout = new WeakMap(), _LifecycleWatcher_navigationRequest = new WeakMap(), _LifecycleWatcher_subscriptions = new WeakMap(), _LifecycleWatcher_initialLoaderId = new WeakMap(), _LifecycleWatcher_terminationDeferred = new WeakMap(), _LifecycleWatcher_sameDocumentNavigationDeferred = new WeakMap(), _LifecycleWatcher_lifecycleDeferred = new WeakMap(), _LifecycleWatcher_newDocumentNavigationDeferred = new WeakMap(), _LifecycleWatcher_hasSameDocumentNavigation = new WeakMap(), _LifecycleWatcher_swapped = new WeakMap(), _LifecycleWatcher_navigationResponseReceived = new WeakMap(), _LifecycleWatcher_instances = new WeakSet(), _LifecycleWatcher_onRequest = function _LifecycleWatcher_onRequest(request) {
    if (request.frame() !== __classPrivateFieldGet(this, _LifecycleWatcher_frame, "f") || !request.isNavigationRequest()) {
        return;
    }
    __classPrivateFieldSet(this, _LifecycleWatcher_navigationRequest, request, "f");
    // Resolve previous navigation response in case there are multiple
    // navigation requests reported by the backend. This generally should not
    // happen by it looks like it's possible.
    __classPrivateFieldGet(this, _LifecycleWatcher_navigationResponseReceived, "f")?.resolve();
    __classPrivateFieldSet(this, _LifecycleWatcher_navigationResponseReceived, Deferred_js_1.Deferred.create(), "f");
    if (request.response() !== null) {
        __classPrivateFieldGet(this, _LifecycleWatcher_navigationResponseReceived, "f")?.resolve();
    }
}, _LifecycleWatcher_onRequestFailed = function _LifecycleWatcher_onRequestFailed(request) {
    if (__classPrivateFieldGet(this, _LifecycleWatcher_navigationRequest, "f")?.id !== request.id) {
        return;
    }
    __classPrivateFieldGet(this, _LifecycleWatcher_navigationResponseReceived, "f")?.resolve();
}, _LifecycleWatcher_onResponse = function _LifecycleWatcher_onResponse(response) {
    if (__classPrivateFieldGet(this, _LifecycleWatcher_navigationRequest, "f")?.id !== response.request().id) {
        return;
    }
    __classPrivateFieldGet(this, _LifecycleWatcher_navigationResponseReceived, "f")?.resolve();
}, _LifecycleWatcher_onFrameDetached = function _LifecycleWatcher_onFrameDetached(frame) {
    if (__classPrivateFieldGet(this, _LifecycleWatcher_frame, "f") === frame) {
        __classPrivateFieldGet(this, _LifecycleWatcher_terminationDeferred, "f").resolve(new Error('Navigating frame was detached'));
        return;
    }
    __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_navigatedWithinDocument = function _LifecycleWatcher_navigatedWithinDocument() {
    __classPrivateFieldSet(this, _LifecycleWatcher_hasSameDocumentNavigation, true, "f");
    __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_navigated = function _LifecycleWatcher_navigated(navigationType) {
    if (navigationType === 'BackForwardCacheRestore') {
        return __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_frameSwapped).call(this);
    }
    __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_frameSwapped = function _LifecycleWatcher_frameSwapped() {
    __classPrivateFieldSet(this, _LifecycleWatcher_swapped, true, "f");
    __classPrivateFieldGet(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_checkLifecycleComplete = function _LifecycleWatcher_checkLifecycleComplete() {
    // We expect navigation to commit.
    if (!checkLifecycle(__classPrivateFieldGet(this, _LifecycleWatcher_frame, "f"), __classPrivateFieldGet(this, _LifecycleWatcher_expectedLifecycle, "f"))) {
        return;
    }
    __classPrivateFieldGet(this, _LifecycleWatcher_lifecycleDeferred, "f").resolve();
    if (__classPrivateFieldGet(this, _LifecycleWatcher_hasSameDocumentNavigation, "f")) {
        __classPrivateFieldGet(this, _LifecycleWatcher_sameDocumentNavigationDeferred, "f").resolve(undefined);
    }
    if (__classPrivateFieldGet(this, _LifecycleWatcher_swapped, "f") || __classPrivateFieldGet(this, _LifecycleWatcher_frame, "f")._loaderId !== __classPrivateFieldGet(this, _LifecycleWatcher_initialLoaderId, "f")) {
        __classPrivateFieldGet(this, _LifecycleWatcher_newDocumentNavigationDeferred, "f").resolve(undefined);
    }
    function checkLifecycle(frame, expectedLifecycle) {
        for (const event of expectedLifecycle) {
            if (!frame._lifecycleEvents.has(event)) {
                return false;
            }
        }
        for (const child of frame.childFrames()) {
            if (child._hasStartedLoading &&
                !checkLifecycle(child, expectedLifecycle)) {
                return false;
            }
        }
        return true;
    }
};
exports.LifecycleWatcher = LifecycleWatcher;
//# sourceMappingURL=LifecycleWatcher.js.map