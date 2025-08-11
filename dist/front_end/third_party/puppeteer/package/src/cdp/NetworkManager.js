/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
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
var _NetworkManager_instances, _NetworkManager_frameManager, _NetworkManager_networkEventManager, _NetworkManager_extraHTTPHeaders, _NetworkManager_credentials, _NetworkManager_attemptedAuthentications, _NetworkManager_userRequestInterceptionEnabled, _NetworkManager_protocolRequestInterceptionEnabled, _NetworkManager_userCacheDisabled, _NetworkManager_emulatedNetworkConditions, _NetworkManager_userAgent, _NetworkManager_userAgentMetadata, _NetworkManager_handlers, _NetworkManager_clients, _NetworkManager_networkEnabled, _NetworkManager_canIgnoreError, _NetworkManager_removeClient, _NetworkManager_applyExtraHTTPHeaders, _NetworkManager_applyToAllClients, _NetworkManager_applyNetworkConditions, _NetworkManager_applyUserAgent, _NetworkManager_applyProtocolRequestInterception, _NetworkManager_applyProtocolCacheDisabled, _NetworkManager_onRequestWillBeSent, _NetworkManager_onAuthRequired, _NetworkManager_onRequestPaused, _NetworkManager_patchRequestEventHeaders, _NetworkManager_onRequestWithoutNetworkInstrumentation, _NetworkManager_onRequest, _NetworkManager_onRequestServedFromCache, _NetworkManager_handleRequestRedirect, _NetworkManager_emitResponseEvent, _NetworkManager_onResponseReceived, _NetworkManager_onResponseReceivedExtraInfo, _NetworkManager_forgetRequest, _NetworkManager_onLoadingFinished, _NetworkManager_emitLoadingFinished, _NetworkManager_onLoadingFailed, _NetworkManager_emitLoadingFailed, _NetworkManager_adoptCdpSessionIfNeeded;
import { CDPSessionEvent } from '../api/CDPSession.js';
import { EventEmitter } from '../common/EventEmitter.js';
import { NetworkManagerEvent, } from '../common/NetworkManagerEvents.js';
import { debugError, isString } from '../common/util.js';
import { assert } from '../util/assert.js';
import { DisposableStack } from '../util/disposable.js';
import { isErrorLike } from '../util/ErrorLike.js';
import { isTargetClosedError } from './Connection.js';
import { CdpHTTPRequest } from './HTTPRequest.js';
import { CdpHTTPResponse } from './HTTPResponse.js';
import { NetworkEventManager, } from './NetworkEventManager.js';
/**
 * @internal
 */
export class NetworkManager extends EventEmitter {
    constructor(frameManager, networkEnabled) {
        super();
        _NetworkManager_instances.add(this);
        _NetworkManager_frameManager.set(this, void 0);
        _NetworkManager_networkEventManager.set(this, new NetworkEventManager());
        _NetworkManager_extraHTTPHeaders.set(this, void 0);
        _NetworkManager_credentials.set(this, null);
        _NetworkManager_attemptedAuthentications.set(this, new Set());
        _NetworkManager_userRequestInterceptionEnabled.set(this, false);
        _NetworkManager_protocolRequestInterceptionEnabled.set(this, false);
        _NetworkManager_userCacheDisabled.set(this, void 0);
        _NetworkManager_emulatedNetworkConditions.set(this, void 0);
        _NetworkManager_userAgent.set(this, void 0);
        _NetworkManager_userAgentMetadata.set(this, void 0);
        _NetworkManager_handlers.set(this, [
            ['Fetch.requestPaused', __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onRequestPaused)],
            ['Fetch.authRequired', __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onAuthRequired)],
            ['Network.requestWillBeSent', __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onRequestWillBeSent)],
            ['Network.requestServedFromCache', __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onRequestServedFromCache)],
            ['Network.responseReceived', __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onResponseReceived)],
            ['Network.loadingFinished', __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onLoadingFinished)],
            ['Network.loadingFailed', __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onLoadingFailed)],
            ['Network.responseReceivedExtraInfo', __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onResponseReceivedExtraInfo)],
            [CDPSessionEvent.Disconnected, __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_removeClient)],
        ]);
        _NetworkManager_clients.set(this, new Map());
        _NetworkManager_networkEnabled.set(this, true);
        __classPrivateFieldSet(this, _NetworkManager_frameManager, frameManager, "f");
        __classPrivateFieldSet(this, _NetworkManager_networkEnabled, networkEnabled ?? true, "f");
    }
    async addClient(client) {
        if (!__classPrivateFieldGet(this, _NetworkManager_networkEnabled, "f") || __classPrivateFieldGet(this, _NetworkManager_clients, "f").has(client)) {
            return;
        }
        const subscriptions = new DisposableStack();
        __classPrivateFieldGet(this, _NetworkManager_clients, "f").set(client, subscriptions);
        const clientEmitter = subscriptions.use(new EventEmitter(client));
        for (const [event, handler] of __classPrivateFieldGet(this, _NetworkManager_handlers, "f")) {
            clientEmitter.on(event, (arg) => {
                return handler.bind(this)(client, arg);
            });
        }
        try {
            await Promise.all([
                client.send('Network.enable'),
                __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyExtraHTTPHeaders).call(this, client),
                __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyNetworkConditions).call(this, client),
                __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyProtocolCacheDisabled).call(this, client),
                __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyProtocolRequestInterception).call(this, client),
                __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyUserAgent).call(this, client),
            ]);
        }
        catch (error) {
            if (__classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_canIgnoreError).call(this, error)) {
                return;
            }
            throw error;
        }
    }
    async authenticate(credentials) {
        __classPrivateFieldSet(this, _NetworkManager_credentials, credentials, "f");
        const enabled = __classPrivateFieldGet(this, _NetworkManager_userRequestInterceptionEnabled, "f") || !!__classPrivateFieldGet(this, _NetworkManager_credentials, "f");
        if (enabled === __classPrivateFieldGet(this, _NetworkManager_protocolRequestInterceptionEnabled, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _NetworkManager_protocolRequestInterceptionEnabled, enabled, "f");
        await __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyToAllClients).call(this, __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyProtocolRequestInterception).bind(this));
    }
    async setExtraHTTPHeaders(headers) {
        const extraHTTPHeaders = {};
        for (const [key, value] of Object.entries(headers)) {
            assert(isString(value), `Expected value of header "${key}" to be String, but "${typeof value}" is found.`);
            extraHTTPHeaders[key.toLowerCase()] = value;
        }
        __classPrivateFieldSet(this, _NetworkManager_extraHTTPHeaders, extraHTTPHeaders, "f");
        await __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyToAllClients).call(this, __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyExtraHTTPHeaders).bind(this));
    }
    extraHTTPHeaders() {
        return Object.assign({}, __classPrivateFieldGet(this, _NetworkManager_extraHTTPHeaders, "f"));
    }
    inFlightRequestsCount() {
        return __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").inFlightRequestsCount();
    }
    async setOfflineMode(value) {
        if (!__classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f")) {
            __classPrivateFieldSet(this, _NetworkManager_emulatedNetworkConditions, {
                offline: false,
                upload: -1,
                download: -1,
                latency: 0,
            }, "f");
        }
        __classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f").offline = value;
        await __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyToAllClients).call(this, __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyNetworkConditions).bind(this));
    }
    async emulateNetworkConditions(networkConditions) {
        if (!__classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f")) {
            __classPrivateFieldSet(this, _NetworkManager_emulatedNetworkConditions, {
                offline: false,
                upload: -1,
                download: -1,
                latency: 0,
            }, "f");
        }
        __classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f").upload = networkConditions
            ? networkConditions.upload
            : -1;
        __classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f").download = networkConditions
            ? networkConditions.download
            : -1;
        __classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f").latency = networkConditions
            ? networkConditions.latency
            : 0;
        await __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyToAllClients).call(this, __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyNetworkConditions).bind(this));
    }
    async setUserAgent(userAgent, userAgentMetadata) {
        __classPrivateFieldSet(this, _NetworkManager_userAgent, userAgent, "f");
        __classPrivateFieldSet(this, _NetworkManager_userAgentMetadata, userAgentMetadata, "f");
        await __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyToAllClients).call(this, __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyUserAgent).bind(this));
    }
    async setCacheEnabled(enabled) {
        __classPrivateFieldSet(this, _NetworkManager_userCacheDisabled, !enabled, "f");
        await __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyToAllClients).call(this, __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyProtocolCacheDisabled).bind(this));
    }
    async setRequestInterception(value) {
        __classPrivateFieldSet(this, _NetworkManager_userRequestInterceptionEnabled, value, "f");
        const enabled = __classPrivateFieldGet(this, _NetworkManager_userRequestInterceptionEnabled, "f") || !!__classPrivateFieldGet(this, _NetworkManager_credentials, "f");
        if (enabled === __classPrivateFieldGet(this, _NetworkManager_protocolRequestInterceptionEnabled, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _NetworkManager_protocolRequestInterceptionEnabled, enabled, "f");
        await __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyToAllClients).call(this, __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyProtocolRequestInterception).bind(this));
    }
}
_NetworkManager_frameManager = new WeakMap(), _NetworkManager_networkEventManager = new WeakMap(), _NetworkManager_extraHTTPHeaders = new WeakMap(), _NetworkManager_credentials = new WeakMap(), _NetworkManager_attemptedAuthentications = new WeakMap(), _NetworkManager_userRequestInterceptionEnabled = new WeakMap(), _NetworkManager_protocolRequestInterceptionEnabled = new WeakMap(), _NetworkManager_userCacheDisabled = new WeakMap(), _NetworkManager_emulatedNetworkConditions = new WeakMap(), _NetworkManager_userAgent = new WeakMap(), _NetworkManager_userAgentMetadata = new WeakMap(), _NetworkManager_handlers = new WeakMap(), _NetworkManager_clients = new WeakMap(), _NetworkManager_networkEnabled = new WeakMap(), _NetworkManager_instances = new WeakSet(), _NetworkManager_canIgnoreError = function _NetworkManager_canIgnoreError(error) {
    return (isErrorLike(error) &&
        (isTargetClosedError(error) || error.message.includes('Not supported')));
}, _NetworkManager_removeClient = async function _NetworkManager_removeClient(client) {
    __classPrivateFieldGet(this, _NetworkManager_clients, "f").get(client)?.dispose();
    __classPrivateFieldGet(this, _NetworkManager_clients, "f").delete(client);
}, _NetworkManager_applyExtraHTTPHeaders = async function _NetworkManager_applyExtraHTTPHeaders(client) {
    if (__classPrivateFieldGet(this, _NetworkManager_extraHTTPHeaders, "f") === undefined) {
        return;
    }
    try {
        await client.send('Network.setExtraHTTPHeaders', {
            headers: __classPrivateFieldGet(this, _NetworkManager_extraHTTPHeaders, "f"),
        });
    }
    catch (error) {
        if (__classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_canIgnoreError).call(this, error)) {
            return;
        }
        throw error;
    }
}, _NetworkManager_applyToAllClients = async function _NetworkManager_applyToAllClients(fn) {
    await Promise.all(Array.from(__classPrivateFieldGet(this, _NetworkManager_clients, "f").keys()).map(client => {
        return fn(client);
    }));
}, _NetworkManager_applyNetworkConditions = async function _NetworkManager_applyNetworkConditions(client) {
    if (__classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f") === undefined) {
        return;
    }
    try {
        await client.send('Network.emulateNetworkConditions', {
            offline: __classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f").offline,
            latency: __classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f").latency,
            uploadThroughput: __classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f").upload,
            downloadThroughput: __classPrivateFieldGet(this, _NetworkManager_emulatedNetworkConditions, "f").download,
        });
    }
    catch (error) {
        if (__classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_canIgnoreError).call(this, error)) {
            return;
        }
        throw error;
    }
}, _NetworkManager_applyUserAgent = async function _NetworkManager_applyUserAgent(client) {
    if (__classPrivateFieldGet(this, _NetworkManager_userAgent, "f") === undefined) {
        return;
    }
    try {
        await client.send('Network.setUserAgentOverride', {
            userAgent: __classPrivateFieldGet(this, _NetworkManager_userAgent, "f"),
            userAgentMetadata: __classPrivateFieldGet(this, _NetworkManager_userAgentMetadata, "f"),
        });
    }
    catch (error) {
        if (__classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_canIgnoreError).call(this, error)) {
            return;
        }
        throw error;
    }
}, _NetworkManager_applyProtocolRequestInterception = async function _NetworkManager_applyProtocolRequestInterception(client) {
    if (__classPrivateFieldGet(this, _NetworkManager_userCacheDisabled, "f") === undefined) {
        __classPrivateFieldSet(this, _NetworkManager_userCacheDisabled, false, "f");
    }
    try {
        if (__classPrivateFieldGet(this, _NetworkManager_protocolRequestInterceptionEnabled, "f")) {
            await Promise.all([
                __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyProtocolCacheDisabled).call(this, client),
                client.send('Fetch.enable', {
                    handleAuthRequests: true,
                    patterns: [{ urlPattern: '*' }],
                }),
            ]);
        }
        else {
            await Promise.all([
                __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_applyProtocolCacheDisabled).call(this, client),
                client.send('Fetch.disable'),
            ]);
        }
    }
    catch (error) {
        if (__classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_canIgnoreError).call(this, error)) {
            return;
        }
        throw error;
    }
}, _NetworkManager_applyProtocolCacheDisabled = async function _NetworkManager_applyProtocolCacheDisabled(client) {
    if (__classPrivateFieldGet(this, _NetworkManager_userCacheDisabled, "f") === undefined) {
        return;
    }
    try {
        await client.send('Network.setCacheDisabled', {
            cacheDisabled: __classPrivateFieldGet(this, _NetworkManager_userCacheDisabled, "f"),
        });
    }
    catch (error) {
        if (__classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_canIgnoreError).call(this, error)) {
            return;
        }
        throw error;
    }
}, _NetworkManager_onRequestWillBeSent = function _NetworkManager_onRequestWillBeSent(client, event) {
    // Request interception doesn't happen for data URLs with Network Service.
    if (__classPrivateFieldGet(this, _NetworkManager_userRequestInterceptionEnabled, "f") &&
        !event.request.url.startsWith('data:')) {
        const { requestId: networkRequestId } = event;
        __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").storeRequestWillBeSent(networkRequestId, event);
        /**
         * CDP may have sent a Fetch.requestPaused event already. Check for it.
         */
        const requestPausedEvent = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getRequestPaused(networkRequestId);
        if (requestPausedEvent) {
            const { requestId: fetchRequestId } = requestPausedEvent;
            __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_patchRequestEventHeaders).call(this, event, requestPausedEvent);
            __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, client, event, fetchRequestId);
            __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").forgetRequestPaused(networkRequestId);
        }
        return;
    }
    __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, client, event, undefined);
}, _NetworkManager_onAuthRequired = function _NetworkManager_onAuthRequired(client, event) {
    let response = 'Default';
    if (__classPrivateFieldGet(this, _NetworkManager_attemptedAuthentications, "f").has(event.requestId)) {
        response = 'CancelAuth';
    }
    else if (__classPrivateFieldGet(this, _NetworkManager_credentials, "f")) {
        response = 'ProvideCredentials';
        __classPrivateFieldGet(this, _NetworkManager_attemptedAuthentications, "f").add(event.requestId);
    }
    const { username, password } = __classPrivateFieldGet(this, _NetworkManager_credentials, "f") || {
        username: undefined,
        password: undefined,
    };
    client
        .send('Fetch.continueWithAuth', {
        requestId: event.requestId,
        authChallengeResponse: { response, username, password },
    })
        .catch(debugError);
}, _NetworkManager_onRequestPaused = function _NetworkManager_onRequestPaused(client, event) {
    if (!__classPrivateFieldGet(this, _NetworkManager_userRequestInterceptionEnabled, "f") &&
        __classPrivateFieldGet(this, _NetworkManager_protocolRequestInterceptionEnabled, "f")) {
        client
            .send('Fetch.continueRequest', {
            requestId: event.requestId,
        })
            .catch(debugError);
    }
    const { networkId: networkRequestId, requestId: fetchRequestId } = event;
    if (!networkRequestId) {
        __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onRequestWithoutNetworkInstrumentation).call(this, client, event);
        return;
    }
    const requestWillBeSentEvent = (() => {
        const requestWillBeSentEvent = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getRequestWillBeSent(networkRequestId);
        // redirect requests have the same `requestId`,
        if (requestWillBeSentEvent &&
            (requestWillBeSentEvent.request.url !== event.request.url ||
                requestWillBeSentEvent.request.method !== event.request.method)) {
            __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").forgetRequestWillBeSent(networkRequestId);
            return;
        }
        return requestWillBeSentEvent;
    })();
    if (requestWillBeSentEvent) {
        __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_patchRequestEventHeaders).call(this, requestWillBeSentEvent, event);
        __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, client, requestWillBeSentEvent, fetchRequestId);
    }
    else {
        __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").storeRequestPaused(networkRequestId, event);
    }
}, _NetworkManager_patchRequestEventHeaders = function _NetworkManager_patchRequestEventHeaders(requestWillBeSentEvent, requestPausedEvent) {
    requestWillBeSentEvent.request.headers = {
        ...requestWillBeSentEvent.request.headers,
        // includes extra headers, like: Accept, Origin
        ...requestPausedEvent.request.headers,
    };
}, _NetworkManager_onRequestWithoutNetworkInstrumentation = function _NetworkManager_onRequestWithoutNetworkInstrumentation(client, event) {
    // If an event has no networkId it should not have any network events. We
    // still want to dispatch it for the interception by the user.
    const frame = event.frameId
        ? __classPrivateFieldGet(this, _NetworkManager_frameManager, "f").frame(event.frameId)
        : null;
    const request = new CdpHTTPRequest(client, frame, event.requestId, __classPrivateFieldGet(this, _NetworkManager_userRequestInterceptionEnabled, "f"), event, []);
    this.emit(NetworkManagerEvent.Request, request);
    void request.finalizeInterceptions();
}, _NetworkManager_onRequest = function _NetworkManager_onRequest(client, event, fetchRequestId, fromMemoryCache = false) {
    let redirectChain = [];
    if (event.redirectResponse) {
        // We want to emit a response and requestfinished for the
        // redirectResponse, but we can't do so unless we have a
        // responseExtraInfo ready to pair it up with. If we don't have any
        // responseExtraInfos saved in our queue, they we have to wait until
        // the next one to emit response and requestfinished, *and* we should
        // also wait to emit this Request too because it should come after the
        // response/requestfinished.
        let redirectResponseExtraInfo = null;
        if (event.redirectHasExtraInfo) {
            redirectResponseExtraInfo = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f")
                .responseExtraInfo(event.requestId)
                .shift();
            if (!redirectResponseExtraInfo) {
                __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").queueRedirectInfo(event.requestId, {
                    event,
                    fetchRequestId,
                });
                return;
            }
        }
        const request = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
        // If we connect late to the target, we could have missed the
        // requestWillBeSent event.
        if (request) {
            __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_handleRequestRedirect).call(this, client, request, event.redirectResponse, redirectResponseExtraInfo);
            redirectChain = request._redirectChain;
        }
    }
    const frame = event.frameId
        ? __classPrivateFieldGet(this, _NetworkManager_frameManager, "f").frame(event.frameId)
        : null;
    const request = new CdpHTTPRequest(client, frame, fetchRequestId, __classPrivateFieldGet(this, _NetworkManager_userRequestInterceptionEnabled, "f"), event, redirectChain);
    request._fromMemoryCache = fromMemoryCache;
    __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").storeRequest(event.requestId, request);
    this.emit(NetworkManagerEvent.Request, request);
    void request.finalizeInterceptions();
}, _NetworkManager_onRequestServedFromCache = function _NetworkManager_onRequestServedFromCache(client, event) {
    const requestWillBeSentEvent = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getRequestWillBeSent(event.requestId);
    let request = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    // Requests served from memory cannot be intercepted.
    if (request) {
        request._fromMemoryCache = true;
    }
    // If request ended up being served from cache, we need to convert
    // requestWillBeSentEvent to a HTTP request.
    if (!request && requestWillBeSentEvent) {
        __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, client, requestWillBeSentEvent, undefined, true);
        request = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    }
    if (!request) {
        debugError(new Error(`Request ${event.requestId} was served from cache but we could not find the corresponding request object`));
        return;
    }
    this.emit(NetworkManagerEvent.RequestServedFromCache, request);
}, _NetworkManager_handleRequestRedirect = function _NetworkManager_handleRequestRedirect(_client, request, responsePayload, extraInfo) {
    const response = new CdpHTTPResponse(request, responsePayload, extraInfo);
    request._response = response;
    request._redirectChain.push(request);
    response._resolveBody(new Error('Response body is unavailable for redirect responses'));
    __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_forgetRequest).call(this, request, false);
    this.emit(NetworkManagerEvent.Response, response);
    this.emit(NetworkManagerEvent.RequestFinished, request);
}, _NetworkManager_emitResponseEvent = function _NetworkManager_emitResponseEvent(_client, responseReceived, extraInfo) {
    const request = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getRequest(responseReceived.requestId);
    // FileUpload sends a response without a matching request.
    if (!request) {
        return;
    }
    const extraInfos = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").responseExtraInfo(responseReceived.requestId);
    if (extraInfos.length) {
        debugError(new Error('Unexpected extraInfo events for request ' +
            responseReceived.requestId));
    }
    // Chromium sends wrong extraInfo events for responses served from cache.
    // See https://github.com/puppeteer/puppeteer/issues/9965 and
    // https://crbug.com/1340398.
    if (responseReceived.response.fromDiskCache) {
        extraInfo = null;
    }
    const response = new CdpHTTPResponse(request, responseReceived.response, extraInfo);
    request._response = response;
    this.emit(NetworkManagerEvent.Response, response);
}, _NetworkManager_onResponseReceived = function _NetworkManager_onResponseReceived(client, event) {
    const request = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    let extraInfo = null;
    if (request && !request._fromMemoryCache && event.hasExtraInfo) {
        extraInfo = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f")
            .responseExtraInfo(event.requestId)
            .shift();
        if (!extraInfo) {
            // Wait until we get the corresponding ExtraInfo event.
            __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").queueEventGroup(event.requestId, {
                responseReceivedEvent: event,
            });
            return;
        }
    }
    __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_emitResponseEvent).call(this, client, event, extraInfo);
}, _NetworkManager_onResponseReceivedExtraInfo = function _NetworkManager_onResponseReceivedExtraInfo(client, event) {
    // We may have skipped a redirect response/request pair due to waiting for
    // this ExtraInfo event. If so, continue that work now that we have the
    // request.
    const redirectInfo = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").takeQueuedRedirectInfo(event.requestId);
    if (redirectInfo) {
        __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").responseExtraInfo(event.requestId).push(event);
        __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, client, redirectInfo.event, redirectInfo.fetchRequestId);
        return;
    }
    // We may have skipped response and loading events because we didn't have
    // this ExtraInfo event yet. If so, emit those events now.
    const queuedEvents = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getQueuedEventGroup(event.requestId);
    if (queuedEvents) {
        __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").forgetQueuedEventGroup(event.requestId);
        __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_emitResponseEvent).call(this, client, queuedEvents.responseReceivedEvent, event);
        if (queuedEvents.loadingFinishedEvent) {
            __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFinished).call(this, client, queuedEvents.loadingFinishedEvent);
        }
        if (queuedEvents.loadingFailedEvent) {
            __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFailed).call(this, client, queuedEvents.loadingFailedEvent);
        }
        return;
    }
    // Wait until we get another event that can use this ExtraInfo event.
    __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").responseExtraInfo(event.requestId).push(event);
}, _NetworkManager_forgetRequest = function _NetworkManager_forgetRequest(request, events) {
    const requestId = request.id;
    const interceptionId = request._interceptionId;
    __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").forgetRequest(requestId);
    if (interceptionId !== undefined) {
        __classPrivateFieldGet(this, _NetworkManager_attemptedAuthentications, "f").delete(interceptionId);
    }
    if (events) {
        __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").forget(requestId);
    }
}, _NetworkManager_onLoadingFinished = function _NetworkManager_onLoadingFinished(client, event) {
    // If the response event for this request is still waiting on a
    // corresponding ExtraInfo event, then wait to emit this event too.
    const queuedEvents = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getQueuedEventGroup(event.requestId);
    if (queuedEvents) {
        queuedEvents.loadingFinishedEvent = event;
    }
    else {
        __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFinished).call(this, client, event);
    }
}, _NetworkManager_emitLoadingFinished = function _NetworkManager_emitLoadingFinished(client, event) {
    const request = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    // For certain requestIds we never receive requestWillBeSent event.
    // @see https://crbug.com/750469
    if (!request) {
        return;
    }
    __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_adoptCdpSessionIfNeeded).call(this, client, request);
    // Under certain conditions we never get the Network.responseReceived
    // event from protocol. @see https://crbug.com/883475
    if (request.response()) {
        request.response()?._resolveBody();
    }
    __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_forgetRequest).call(this, request, true);
    this.emit(NetworkManagerEvent.RequestFinished, request);
}, _NetworkManager_onLoadingFailed = function _NetworkManager_onLoadingFailed(client, event) {
    // If the response event for this request is still waiting on a
    // corresponding ExtraInfo event, then wait to emit this event too.
    const queuedEvents = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getQueuedEventGroup(event.requestId);
    if (queuedEvents) {
        queuedEvents.loadingFailedEvent = event;
    }
    else {
        __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFailed).call(this, client, event);
    }
}, _NetworkManager_emitLoadingFailed = function _NetworkManager_emitLoadingFailed(client, event) {
    const request = __classPrivateFieldGet(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    // For certain requestIds we never receive requestWillBeSent event.
    // @see https://crbug.com/750469
    if (!request) {
        return;
    }
    __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_adoptCdpSessionIfNeeded).call(this, client, request);
    request._failureText = event.errorText;
    const response = request.response();
    if (response) {
        response._resolveBody();
    }
    __classPrivateFieldGet(this, _NetworkManager_instances, "m", _NetworkManager_forgetRequest).call(this, request, true);
    this.emit(NetworkManagerEvent.RequestFailed, request);
}, _NetworkManager_adoptCdpSessionIfNeeded = function _NetworkManager_adoptCdpSessionIfNeeded(client, request) {
    // Document requests for OOPIFs start in the parent frame but are
    // adopted by their child frame, meaning their loadingFinished and
    // loadingFailed events are fired on the child session. In this case
    // we reassign the request CDPSession to ensure all subsequent
    // actions use the correct session (e.g. retrieving response body in
    // HTTPResponse). The same applies to main worker script requests.
    if (client !== request.client) {
        request.client = client;
    }
};
//# sourceMappingURL=NetworkManager.js.map