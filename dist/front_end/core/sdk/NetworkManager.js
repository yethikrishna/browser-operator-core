// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _NetworkManager_networkAgent, _NetworkManager_bypassServiceWorkerSetting, _FetchDispatcher_fetchAgent, _FetchDispatcher_manager, _NetworkDispatcher_instances, _NetworkDispatcher_manager, _NetworkDispatcher_requestsById, _NetworkDispatcher_requestsByURL, _NetworkDispatcher_requestsByLoaderId, _NetworkDispatcher_requestIdToExtraInfoBuilder, _NetworkDispatcher_requestIdToTrustTokenEvent, _NetworkDispatcher_markAsIntercepted, _MultitargetNetworkManager_userAgentOverride, _MultitargetNetworkManager_userAgentMetadataOverride, _MultitargetNetworkManager_customAcceptedEncodings, _MultitargetNetworkManager_networkAgents, _MultitargetNetworkManager_fetchAgents, _MultitargetNetworkManager_networkConditions, _MultitargetNetworkManager_updatingInterceptionPatternsPromise, _MultitargetNetworkManager_blockingEnabledSetting, _MultitargetNetworkManager_blockedPatternsSetting, _MultitargetNetworkManager_effectiveBlockedURLs, _MultitargetNetworkManager_urlsForRequestInterceptor, _MultitargetNetworkManager_extraHeaders, _MultitargetNetworkManager_customUserAgent, _InterceptedRequest_fetchAgent, _InterceptedRequest_hasResponded, _ExtraInfoBuilder_requests, _ExtraInfoBuilder_responseExtraInfoFlag, _ExtraInfoBuilder_requestExtraInfos, _ExtraInfoBuilder_responseExtraInfos, _ExtraInfoBuilder_responseEarlyHintsHeaders, _ExtraInfoBuilder_finished, _ExtraInfoBuilder_webBundleInfo, _ExtraInfoBuilder_webBundleInnerRequestInfo;
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import * as Host from '../host/host.js';
import * as i18n from '../i18n/i18n.js';
import * as Platform from '../platform/platform.js';
import * as Root from '../root/root.js';
import { Cookie } from './Cookie.js';
import { DirectSocketChunkType, DirectSocketStatus, DirectSocketType, Events as NetworkRequestEvents, NetworkRequest } from './NetworkRequest.js';
import { SDKModel } from './SDKModel.js';
import { TargetManager } from './TargetManager.js';
const UIStrings = {
    /**
     *@description Explanation why no content is shown for WebSocket connection.
     */
    noContentForWebSocket: 'Content for WebSockets is currently not supported',
    /**
     *@description Explanation why no content is shown for redirect response.
     */
    noContentForRedirect: 'No content available because this request was redirected',
    /**
     *@description Explanation why no content is shown for preflight request.
     */
    noContentForPreflight: 'No content available for preflight request',
    /**
     *@description Text to indicate that network throttling is disabled
     */
    noThrottling: 'No throttling',
    /**
     *@description Text to indicate the network connectivity is offline
     */
    offline: 'Offline',
    /**
     *@description Text in Network Manager representing the "3G" throttling preset.
     */
    slowG: '3G', // Named `slowG` for legacy reasons and because this value
    // is serialized locally on the user's machine: if we
    // change it we break their stored throttling settings.
    // (See crrev.com/c/2947255)
    /**
     *@description Text in Network Manager representing the "Slow 4G" throttling preset
     */
    fastG: 'Slow 4G', // Named `fastG` for legacy reasons and because this value
    // is serialized locally on the user's machine: if we
    // change it we break their stored throttling settings.
    // (See crrev.com/c/2947255)
    /**
     *@description Text in Network Manager representing the "Fast 4G" throttling preset
     */
    fast4G: 'Fast 4G',
    /**
     *@description Text in Network Manager
     *@example {https://example.com} PH1
     */
    requestWasBlockedByDevtoolsS: 'Request was blocked by DevTools: "{PH1}"',
    /**
     *@description Message in Network Manager
     *@example {XHR} PH1
     *@example {GET} PH2
     *@example {https://example.com} PH3
     */
    sFailedLoadingSS: '{PH1} failed loading: {PH2} "{PH3}".',
    /**
     *@description Message in Network Manager
     *@example {XHR} PH1
     *@example {GET} PH2
     *@example {https://example.com} PH3
     */
    sFinishedLoadingSS: '{PH1} finished loading: {PH2} "{PH3}".',
    /**
     *@description One of direct socket connection statuses
     */
    directSocketStatusOpening: 'Opening',
    /**
     *@description One of direct socket connection statuses
     */
    directSocketStatusOpen: 'Open',
    /**
     *@description One of direct socket connection statuses
     */
    directSocketStatusClosed: 'Closed',
    /**
     *@description One of direct socket connection statuses
     */
    directSocketStatusAborted: 'Aborted',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/NetworkManager.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
const requestToManagerMap = new WeakMap();
const CONNECTION_TYPES = new Map([
    ['2g', "cellular2g" /* Protocol.Network.ConnectionType.Cellular2g */],
    ['3g', "cellular3g" /* Protocol.Network.ConnectionType.Cellular3g */],
    ['4g', "cellular4g" /* Protocol.Network.ConnectionType.Cellular4g */],
    ['bluetooth', "bluetooth" /* Protocol.Network.ConnectionType.Bluetooth */],
    ['wifi', "wifi" /* Protocol.Network.ConnectionType.Wifi */],
    ['wimax', "wimax" /* Protocol.Network.ConnectionType.Wimax */],
]);
/**
 * We store two settings to disk to persist network throttling.
 * 1. The custom conditions that the user has defined.
 * 2. The active `key` that applies the correct current preset.
 * The reason the setting creation functions are defined here is because they are referred
 * to in multiple places, and this ensures we don't have accidental typos which
 * mean extra settings get mistakenly created.
 */
export function customUserNetworkConditionsSetting() {
    return Common.Settings.Settings.instance().moduleSetting('custom-network-conditions');
}
export function activeNetworkThrottlingKeySetting() {
    return Common.Settings.Settings.instance().createSetting('active-network-condition-key', "NO_THROTTLING" /* PredefinedThrottlingConditionKey.NO_THROTTLING */);
}
export class NetworkManager extends SDKModel {
    constructor(target) {
        super(target);
        _NetworkManager_networkAgent.set(this, void 0);
        _NetworkManager_bypassServiceWorkerSetting.set(this, void 0);
        this.activeNetworkThrottlingKey = activeNetworkThrottlingKeySetting();
        this.dispatcher = new NetworkDispatcher(this);
        this.fetchDispatcher = new FetchDispatcher(target.fetchAgent(), this);
        __classPrivateFieldSet(this, _NetworkManager_networkAgent, target.networkAgent(), "f");
        target.registerNetworkDispatcher(this.dispatcher);
        target.registerFetchDispatcher(this.fetchDispatcher);
        if (Common.Settings.Settings.instance().moduleSetting('cache-disabled').get()) {
            void __classPrivateFieldGet(this, _NetworkManager_networkAgent, "f").invoke_setCacheDisabled({ cacheDisabled: true });
        }
        if (Root.Runtime.hostConfig.devToolsPrivacyUI?.enabled &&
            Root.Runtime.hostConfig.thirdPartyCookieControls?.managedBlockThirdPartyCookies !== true &&
            (Common.Settings.Settings.instance().createSetting('cookie-control-override-enabled', undefined).get() ||
                Common.Settings.Settings.instance().createSetting('grace-period-mitigation-disabled', undefined).get() ||
                Common.Settings.Settings.instance().createSetting('heuristic-mitigation-disabled', undefined).get())) {
            this.cookieControlFlagsSettingChanged();
        }
        void __classPrivateFieldGet(this, _NetworkManager_networkAgent, "f").invoke_enable({
            maxPostDataSize: MAX_EAGER_POST_REQUEST_BODY_LENGTH,
            reportDirectSocketTraffic: true,
        });
        void __classPrivateFieldGet(this, _NetworkManager_networkAgent, "f").invoke_setAttachDebugStack({ enabled: true });
        __classPrivateFieldSet(this, _NetworkManager_bypassServiceWorkerSetting, Common.Settings.Settings.instance().createSetting('bypass-service-worker', false), "f");
        if (__classPrivateFieldGet(this, _NetworkManager_bypassServiceWorkerSetting, "f").get()) {
            this.bypassServiceWorkerChanged();
        }
        __classPrivateFieldGet(this, _NetworkManager_bypassServiceWorkerSetting, "f").addChangeListener(this.bypassServiceWorkerChanged, this);
        Common.Settings.Settings.instance()
            .moduleSetting('cache-disabled')
            .addChangeListener(this.cacheDisabledSettingChanged, this);
        Common.Settings.Settings.instance()
            .createSetting('cookie-control-override-enabled', undefined)
            .addChangeListener(this.cookieControlFlagsSettingChanged, this);
        Common.Settings.Settings.instance()
            .createSetting('grace-period-mitigation-disabled', undefined)
            .addChangeListener(this.cookieControlFlagsSettingChanged, this);
        Common.Settings.Settings.instance()
            .createSetting('heuristic-mitigation-disabled', undefined)
            .addChangeListener(this.cookieControlFlagsSettingChanged, this);
    }
    static forRequest(request) {
        return requestToManagerMap.get(request) || null;
    }
    static canReplayRequest(request) {
        return Boolean(requestToManagerMap.get(request)) && Boolean(request.backendRequestId()) && !request.isRedirect() &&
            request.resourceType() === Common.ResourceType.resourceTypes.XHR;
    }
    static replayRequest(request) {
        const manager = requestToManagerMap.get(request);
        const requestId = request.backendRequestId();
        if (!manager || !requestId || request.isRedirect()) {
            return;
        }
        void __classPrivateFieldGet(manager, _NetworkManager_networkAgent, "f").invoke_replayXHR({ requestId });
    }
    static async searchInRequest(request, query, caseSensitive, isRegex) {
        const manager = NetworkManager.forRequest(request);
        const requestId = request.backendRequestId();
        if (!manager || !requestId || request.isRedirect()) {
            return [];
        }
        const response = await __classPrivateFieldGet(manager, _NetworkManager_networkAgent, "f").invoke_searchInResponseBody({ requestId, query, caseSensitive, isRegex });
        return TextUtils.TextUtils.performSearchInSearchMatches(response.result || [], query, caseSensitive, isRegex);
    }
    static async requestContentData(request) {
        if (request.resourceType() === Common.ResourceType.resourceTypes.WebSocket) {
            return { error: i18nString(UIStrings.noContentForWebSocket) };
        }
        if (!request.finished) {
            await request.once(NetworkRequestEvents.FINISHED_LOADING);
        }
        if (request.isRedirect()) {
            return { error: i18nString(UIStrings.noContentForRedirect) };
        }
        if (request.isPreflightRequest()) {
            return { error: i18nString(UIStrings.noContentForPreflight) };
        }
        const manager = NetworkManager.forRequest(request);
        if (!manager) {
            return { error: 'No network manager for request' };
        }
        const requestId = request.backendRequestId();
        if (!requestId) {
            return { error: 'No backend request id for request' };
        }
        const response = await __classPrivateFieldGet(manager, _NetworkManager_networkAgent, "f").invoke_getResponseBody({ requestId });
        const error = response.getError();
        if (error) {
            return { error };
        }
        return new TextUtils.ContentData.ContentData(response.body, response.base64Encoded, request.mimeType, request.charset() ?? undefined);
    }
    /**
     * Returns the already received bytes for an in-flight request. After calling this method
     * "dataReceived" events will contain additional data.
     */
    static async streamResponseBody(request) {
        if (request.finished) {
            return { error: 'Streaming the response body is only available for in-flight requests.' };
        }
        const manager = NetworkManager.forRequest(request);
        if (!manager) {
            return { error: 'No network manager for request' };
        }
        const requestId = request.backendRequestId();
        if (!requestId) {
            return { error: 'No backend request id for request' };
        }
        const response = await __classPrivateFieldGet(manager, _NetworkManager_networkAgent, "f").invoke_streamResourceContent({ requestId });
        const error = response.getError();
        if (error) {
            return { error };
        }
        // Wait for at least the `responseReceived event so we have accurate mimetype and charset.
        await request.waitForResponseReceived();
        return new TextUtils.ContentData.ContentData(response.bufferedData, /* isBase64=*/ true, request.mimeType, request.charset() ?? undefined);
    }
    static async requestPostData(request) {
        const manager = NetworkManager.forRequest(request);
        if (!manager) {
            console.error('No network manager for request');
            return null;
        }
        const requestId = request.backendRequestId();
        if (!requestId) {
            console.error('No backend request id for request');
            return null;
        }
        try {
            const { postData } = await __classPrivateFieldGet(manager, _NetworkManager_networkAgent, "f").invoke_getRequestPostData({ requestId });
            return postData;
        }
        catch (e) {
            return e.message;
        }
    }
    static connectionType(conditions) {
        if (!conditions.download && !conditions.upload) {
            return "none" /* Protocol.Network.ConnectionType.None */;
        }
        try {
            const title = typeof conditions.title === 'function' ? conditions.title().toLowerCase() : conditions.title.toLowerCase();
            for (const [name, protocolType] of CONNECTION_TYPES) {
                if (title.includes(name)) {
                    return protocolType;
                }
            }
        }
        catch {
            // If the i18nKey for this condition has changed, calling conditions.title() will break, so in that case we reset to NONE
            return "none" /* Protocol.Network.ConnectionType.None */;
        }
        return "other" /* Protocol.Network.ConnectionType.Other */;
    }
    static lowercaseHeaders(headers) {
        const newHeaders = {};
        for (const headerName in headers) {
            newHeaders[headerName.toLowerCase()] = headers[headerName];
        }
        return newHeaders;
    }
    requestForURL(url) {
        return this.dispatcher.requestForURL(url);
    }
    requestForId(id) {
        return this.dispatcher.requestForId(id);
    }
    requestForLoaderId(loaderId) {
        return this.dispatcher.requestForLoaderId(loaderId);
    }
    cacheDisabledSettingChanged({ data: enabled }) {
        void __classPrivateFieldGet(this, _NetworkManager_networkAgent, "f").invoke_setCacheDisabled({ cacheDisabled: enabled });
    }
    cookieControlFlagsSettingChanged() {
        const overridesEnabled = Boolean(Common.Settings.Settings.instance().createSetting('cookie-control-override-enabled', undefined).get());
        const gracePeriodEnabled = overridesEnabled ?
            Boolean(Common.Settings.Settings.instance().createSetting('grace-period-mitigation-disabled', undefined).get()) :
            false;
        const heuristicEnabled = overridesEnabled ?
            Boolean(Common.Settings.Settings.instance().createSetting('heuristic-mitigation-disabled', undefined).get()) :
            false;
        void __classPrivateFieldGet(this, _NetworkManager_networkAgent, "f").invoke_setCookieControls({
            enableThirdPartyCookieRestriction: overridesEnabled,
            disableThirdPartyCookieMetadata: gracePeriodEnabled,
            disableThirdPartyCookieHeuristics: heuristicEnabled,
        });
    }
    dispose() {
        Common.Settings.Settings.instance()
            .moduleSetting('cache-disabled')
            .removeChangeListener(this.cacheDisabledSettingChanged, this);
    }
    bypassServiceWorkerChanged() {
        void __classPrivateFieldGet(this, _NetworkManager_networkAgent, "f").invoke_setBypassServiceWorker({ bypass: __classPrivateFieldGet(this, _NetworkManager_bypassServiceWorkerSetting, "f").get() });
    }
    async getSecurityIsolationStatus(frameId) {
        const result = await __classPrivateFieldGet(this, _NetworkManager_networkAgent, "f").invoke_getSecurityIsolationStatus({ frameId: frameId ?? undefined });
        if (result.getError()) {
            return null;
        }
        return result.status;
    }
    async enableReportingApi(enable = true) {
        return await __classPrivateFieldGet(this, _NetworkManager_networkAgent, "f").invoke_enableReportingApi({ enable });
    }
    async loadNetworkResource(frameId, url, options) {
        const result = await __classPrivateFieldGet(this, _NetworkManager_networkAgent, "f").invoke_loadNetworkResource({ frameId: frameId ?? undefined, url, options });
        if (result.getError()) {
            throw new Error(result.getError());
        }
        return result.resource;
    }
    clearRequests() {
        this.dispatcher.clearRequests();
    }
}
_NetworkManager_networkAgent = new WeakMap(), _NetworkManager_bypassServiceWorkerSetting = new WeakMap();
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["RequestStarted"] = "RequestStarted";
    Events["RequestUpdated"] = "RequestUpdated";
    Events["RequestFinished"] = "RequestFinished";
    Events["RequestUpdateDropped"] = "RequestUpdateDropped";
    Events["ResponseReceived"] = "ResponseReceived";
    Events["MessageGenerated"] = "MessageGenerated";
    Events["RequestRedirected"] = "RequestRedirected";
    Events["LoadingFinished"] = "LoadingFinished";
    Events["ReportingApiReportAdded"] = "ReportingApiReportAdded";
    Events["ReportingApiReportUpdated"] = "ReportingApiReportUpdated";
    Events["ReportingApiEndpointsChangedForOrigin"] = "ReportingApiEndpointsChangedForOrigin";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
/**
 * Define some built-in DevTools throttling presets.
 * Note that for the download, upload and RTT values we multiply them by adjustment factors to make DevTools' emulation more accurate.
 * @see https://docs.google.com/document/d/10lfVdS1iDWCRKQXPfbxEn4Or99D64mvNlugP1AQuFlE/edit for historical context.
 * @see https://crbug.com/342406608#comment10 for context around the addition of 4G presets in June 2024.
 */
export const NoThrottlingConditions = {
    key: "NO_THROTTLING" /* PredefinedThrottlingConditionKey.NO_THROTTLING */,
    title: i18nLazyString(UIStrings.noThrottling),
    i18nTitleKey: UIStrings.noThrottling,
    download: -1,
    upload: -1,
    latency: 0,
};
export const OfflineConditions = {
    key: "OFFLINE" /* PredefinedThrottlingConditionKey.OFFLINE */,
    title: i18nLazyString(UIStrings.offline),
    i18nTitleKey: UIStrings.offline,
    download: 0,
    upload: 0,
    latency: 0,
};
const slow3GTargetLatency = 400;
export const Slow3GConditions = {
    key: "SPEED_3G" /* PredefinedThrottlingConditionKey.SPEED_3G */,
    title: i18nLazyString(UIStrings.slowG),
    i18nTitleKey: UIStrings.slowG,
    // ~500Kbps down
    download: 500 * 1000 / 8 * .8,
    // ~500Kbps up
    upload: 500 * 1000 / 8 * .8,
    // 400ms RTT
    latency: slow3GTargetLatency * 5,
    targetLatency: slow3GTargetLatency,
};
// Note for readers: this used to be called "Fast 3G" but it was renamed in May
// 2024 to align with LH (crbug.com/342406608).
const slow4GTargetLatency = 150;
export const Slow4GConditions = {
    key: "SPEED_SLOW_4G" /* PredefinedThrottlingConditionKey.SPEED_SLOW_4G */,
    title: i18nLazyString(UIStrings.fastG),
    i18nTitleKey: UIStrings.fastG,
    // ~1.6 Mbps down
    download: 1.6 * 1000 * 1000 / 8 * .9,
    // ~0.75 Mbps up
    upload: 750 * 1000 / 8 * .9,
    // 150ms RTT
    latency: slow4GTargetLatency * 3.75,
    targetLatency: slow4GTargetLatency,
};
const fast4GTargetLatency = 60;
export const Fast4GConditions = {
    key: "SPEED_FAST_4G" /* PredefinedThrottlingConditionKey.SPEED_FAST_4G */,
    title: i18nLazyString(UIStrings.fast4G),
    i18nTitleKey: UIStrings.fast4G,
    // 9 Mbps down
    download: 9 * 1000 * 1000 / 8 * .9,
    // 1.5 Mbps up
    upload: 1.5 * 1000 * 1000 / 8 * .9,
    // 60ms RTT
    latency: fast4GTargetLatency * 2.75,
    targetLatency: fast4GTargetLatency,
};
const MAX_EAGER_POST_REQUEST_BODY_LENGTH = 64 * 1024; // bytes
export class FetchDispatcher {
    constructor(agent, manager) {
        _FetchDispatcher_fetchAgent.set(this, void 0);
        _FetchDispatcher_manager.set(this, void 0);
        __classPrivateFieldSet(this, _FetchDispatcher_fetchAgent, agent, "f");
        __classPrivateFieldSet(this, _FetchDispatcher_manager, manager, "f");
    }
    requestPaused({ requestId, request, resourceType, responseStatusCode, responseHeaders, networkId }) {
        const networkRequest = networkId ? __classPrivateFieldGet(this, _FetchDispatcher_manager, "f").requestForId(networkId) : null;
        // If there was no 'Network.responseReceivedExtraInfo' event (e.g. for 'file:/' URLSs),
        // populate 'originalResponseHeaders' with the headers from the 'Fetch.requestPaused' event.
        if (networkRequest?.originalResponseHeaders.length === 0 && responseHeaders) {
            networkRequest.originalResponseHeaders = responseHeaders;
        }
        void MultitargetNetworkManager.instance().requestIntercepted(new InterceptedRequest(__classPrivateFieldGet(this, _FetchDispatcher_fetchAgent, "f"), request, resourceType, requestId, networkRequest, responseStatusCode, responseHeaders));
    }
    authRequired({}) {
    }
}
_FetchDispatcher_fetchAgent = new WeakMap(), _FetchDispatcher_manager = new WeakMap();
export class NetworkDispatcher {
    constructor(manager) {
        _NetworkDispatcher_instances.add(this);
        _NetworkDispatcher_manager.set(this, void 0);
        _NetworkDispatcher_requestsById.set(this, new Map());
        _NetworkDispatcher_requestsByURL.set(this, new Map());
        _NetworkDispatcher_requestsByLoaderId.set(this, new Map());
        _NetworkDispatcher_requestIdToExtraInfoBuilder.set(this, new Map());
        /**
         * In case of an early abort or a cache hit, the Trust Token done event is
         * reported before the request itself is created in `requestWillBeSent`.
         * This causes the event to be lost as no `NetworkRequest` instance has been
         * created yet.
         * This map caches the events temporarily and populates the NetworkRequest
         * once it is created in `requestWillBeSent`.
         */
        _NetworkDispatcher_requestIdToTrustTokenEvent.set(this, new Map());
        __classPrivateFieldSet(this, _NetworkDispatcher_manager, manager, "f");
        MultitargetNetworkManager.instance().addEventListener("RequestIntercepted" /* MultitargetNetworkManager.Events.REQUEST_INTERCEPTED */, __classPrivateFieldGet(this, _NetworkDispatcher_instances, "m", _NetworkDispatcher_markAsIntercepted).bind(this));
    }
    headersMapToHeadersArray(headersMap) {
        const result = [];
        for (const name in headersMap) {
            const values = headersMap[name].split('\n');
            for (let i = 0; i < values.length; ++i) {
                result.push({ name, value: values[i] });
            }
        }
        return result;
    }
    updateNetworkRequestWithRequest(networkRequest, request) {
        networkRequest.requestMethod = request.method;
        networkRequest.setRequestHeaders(this.headersMapToHeadersArray(request.headers));
        networkRequest.setRequestFormData(Boolean(request.hasPostData), request.postData || null);
        networkRequest.setInitialPriority(request.initialPriority);
        networkRequest.mixedContentType = request.mixedContentType || "none" /* Protocol.Security.MixedContentType.None */;
        networkRequest.setReferrerPolicy(request.referrerPolicy);
        networkRequest.setIsSameSite(request.isSameSite || false);
    }
    updateNetworkRequestWithResponse(networkRequest, response) {
        if (response.url && networkRequest.url() !== response.url) {
            networkRequest.setUrl(response.url);
        }
        networkRequest.mimeType = response.mimeType;
        networkRequest.setCharset(response.charset);
        if (!networkRequest.statusCode || networkRequest.wasIntercepted()) {
            networkRequest.statusCode = response.status;
        }
        if (!networkRequest.statusText || networkRequest.wasIntercepted()) {
            networkRequest.statusText = response.statusText;
        }
        if (!networkRequest.hasExtraResponseInfo() || networkRequest.wasIntercepted()) {
            networkRequest.responseHeaders = this.headersMapToHeadersArray(response.headers);
        }
        if (response.encodedDataLength >= 0) {
            networkRequest.setTransferSize(response.encodedDataLength);
        }
        if (response.requestHeaders && !networkRequest.hasExtraRequestInfo()) {
            // TODO(http://crbug.com/1004979): Stop using response.requestHeaders and
            //   response.requestHeadersText once shared workers
            //   emit Network.*ExtraInfo events for their network #requests.
            networkRequest.setRequestHeaders(this.headersMapToHeadersArray(response.requestHeaders));
            networkRequest.setRequestHeadersText(response.requestHeadersText || '');
        }
        networkRequest.connectionReused = response.connectionReused;
        networkRequest.connectionId = String(response.connectionId);
        if (response.remoteIPAddress) {
            networkRequest.setRemoteAddress(response.remoteIPAddress, response.remotePort || -1);
        }
        if (response.fromServiceWorker) {
            networkRequest.fetchedViaServiceWorker = true;
        }
        if (response.fromDiskCache) {
            networkRequest.setFromDiskCache();
        }
        if (response.fromPrefetchCache) {
            networkRequest.setFromPrefetchCache();
        }
        if (response.fromEarlyHints) {
            networkRequest.setFromEarlyHints();
        }
        if (response.cacheStorageCacheName) {
            networkRequest.setResponseCacheStorageCacheName(response.cacheStorageCacheName);
        }
        if (response.serviceWorkerRouterInfo) {
            networkRequest.serviceWorkerRouterInfo = response.serviceWorkerRouterInfo;
        }
        if (response.responseTime) {
            networkRequest.setResponseRetrievalTime(new Date(response.responseTime));
        }
        networkRequest.timing = response.timing;
        networkRequest.protocol = response.protocol || '';
        networkRequest.alternateProtocolUsage = response.alternateProtocolUsage;
        if (response.serviceWorkerResponseSource) {
            networkRequest.setServiceWorkerResponseSource(response.serviceWorkerResponseSource);
        }
        networkRequest.setSecurityState(response.securityState);
        if (response.securityDetails) {
            networkRequest.setSecurityDetails(response.securityDetails);
        }
        const newResourceType = Common.ResourceType.ResourceType.fromMimeTypeOverride(networkRequest.mimeType);
        if (newResourceType) {
            networkRequest.setResourceType(newResourceType);
        }
        if (networkRequest.responseReceivedPromiseResolve) {
            // Anyone interested in waiting for response headers being available?
            networkRequest.responseReceivedPromiseResolve();
        }
        else {
            // If not, make sure no one will wait on it in the future.
            networkRequest.responseReceivedPromise = Promise.resolve();
        }
    }
    requestForId(id) {
        return __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(id) || null;
    }
    requestForURL(url) {
        return __classPrivateFieldGet(this, _NetworkDispatcher_requestsByURL, "f").get(url) || null;
    }
    requestForLoaderId(loaderId) {
        return __classPrivateFieldGet(this, _NetworkDispatcher_requestsByLoaderId, "f").get(loaderId) || null;
    }
    resourceChangedPriority({ requestId, newPriority }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (networkRequest) {
            networkRequest.setPriority(newPriority);
        }
    }
    signedExchangeReceived({ requestId, info }) {
        // While loading a signed exchange, a signedExchangeReceived event is sent
        // between two requestWillBeSent events.
        // 1. The first requestWillBeSent is sent while starting the navigation (or
        //    prefetching).
        // 2. This signedExchangeReceived event is sent when the browser detects the
        //    signed exchange.
        // 3. The second requestWillBeSent is sent with the generated redirect
        //    response and a new redirected request which URL is the inner request
        //    URL of the signed exchange.
        let networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        // |requestId| is available only for navigation #requests. If the request was
        // sent from a renderer process for prefetching, it is not available. In the
        // case, need to fallback to look for the URL.
        // TODO(crbug/841076): Sends the request ID of prefetching to the browser
        // process and DevTools to find the matching request.
        if (!networkRequest) {
            networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsByURL, "f").get(info.outerResponse.url);
            if (!networkRequest) {
                return;
            }
            // Or clause is never hit, but is here because we can't use non-null assertions.
            const backendRequestId = networkRequest.backendRequestId() || requestId;
            requestId = backendRequestId;
        }
        networkRequest.setSignedExchangeInfo(info);
        networkRequest.setResourceType(Common.ResourceType.resourceTypes.SignedExchange);
        this.updateNetworkRequestWithResponse(networkRequest, info.outerResponse);
        this.updateNetworkRequest(networkRequest);
        this.getExtraInfoBuilder(requestId).addHasExtraInfo(info.hasExtraInfo);
        __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.ResponseReceived, { request: networkRequest, response: info.outerResponse });
    }
    requestWillBeSent({ requestId, loaderId, documentURL, request, timestamp, wallTime, initiator, redirectHasExtraInfo, redirectResponse, type, frameId, hasUserGesture, }) {
        let networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (networkRequest) {
            // FIXME: move this check to the backend.
            if (!redirectResponse) {
                return;
            }
            // If signedExchangeReceived event has already been sent for the request,
            // ignores the internally generated |redirectResponse|. The
            // |outerResponse| of SignedExchangeInfo was set to |networkRequest| in
            // signedExchangeReceived().
            if (!networkRequest.signedExchangeInfo()) {
                this.responseReceived({
                    requestId,
                    loaderId,
                    timestamp,
                    type: type || "Other" /* Protocol.Network.ResourceType.Other */,
                    response: redirectResponse,
                    hasExtraInfo: redirectHasExtraInfo,
                    frameId,
                });
            }
            networkRequest = this.appendRedirect(requestId, timestamp, request.url);
            __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.RequestRedirected, networkRequest);
        }
        else {
            networkRequest = NetworkRequest.create(requestId, request.url, documentURL, frameId ?? null, loaderId, initiator, hasUserGesture);
            requestToManagerMap.set(networkRequest, __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f"));
        }
        networkRequest.hasNetworkData = true;
        this.updateNetworkRequestWithRequest(networkRequest, request);
        networkRequest.setIssueTime(timestamp, wallTime);
        networkRequest.setResourceType(type ? Common.ResourceType.resourceTypes[type] : Common.ResourceType.resourceTypes.Other);
        if (request.trustTokenParams) {
            networkRequest.setTrustTokenParams(request.trustTokenParams);
        }
        const maybeTrustTokenEvent = __classPrivateFieldGet(this, _NetworkDispatcher_requestIdToTrustTokenEvent, "f").get(requestId);
        if (maybeTrustTokenEvent) {
            networkRequest.setTrustTokenOperationDoneEvent(maybeTrustTokenEvent);
            __classPrivateFieldGet(this, _NetworkDispatcher_requestIdToTrustTokenEvent, "f").delete(requestId);
        }
        this.getExtraInfoBuilder(requestId).addRequest(networkRequest);
        this.startNetworkRequest(networkRequest, request);
    }
    requestServedFromCache({ requestId }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!networkRequest) {
            return;
        }
        networkRequest.setFromMemoryCache();
    }
    responseReceived({ requestId, loaderId, timestamp, type, response, hasExtraInfo, frameId }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        const lowercaseHeaders = NetworkManager.lowercaseHeaders(response.headers);
        if (!networkRequest) {
            const lastModifiedHeader = lowercaseHeaders['last-modified'];
            // We missed the requestWillBeSent.
            const eventData = {
                url: response.url,
                frameId: frameId ?? null,
                loaderId,
                resourceType: type,
                mimeType: response.mimeType,
                lastModified: lastModifiedHeader ? new Date(lastModifiedHeader) : null,
            };
            __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.RequestUpdateDropped, eventData);
            return;
        }
        networkRequest.responseReceivedTime = timestamp;
        networkRequest.setResourceType(Common.ResourceType.resourceTypes[type]);
        this.updateNetworkRequestWithResponse(networkRequest, response);
        this.updateNetworkRequest(networkRequest);
        this.getExtraInfoBuilder(requestId).addHasExtraInfo(hasExtraInfo);
        __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.ResponseReceived, { request: networkRequest, response });
    }
    dataReceived(event) {
        let networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.requestId);
        if (!networkRequest) {
            networkRequest = this.maybeAdoptMainResourceRequest(event.requestId);
        }
        if (!networkRequest) {
            return;
        }
        networkRequest.addDataReceivedEvent(event);
        this.updateNetworkRequest(networkRequest);
    }
    loadingFinished({ requestId, timestamp: finishTime, encodedDataLength }) {
        let networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!networkRequest) {
            networkRequest = this.maybeAdoptMainResourceRequest(requestId);
        }
        if (!networkRequest) {
            return;
        }
        this.getExtraInfoBuilder(requestId).finished();
        this.finishNetworkRequest(networkRequest, finishTime, encodedDataLength);
        __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.LoadingFinished, networkRequest);
    }
    loadingFailed({ requestId, timestamp: time, type: resourceType, errorText: localizedDescription, canceled, blockedReason, corsErrorStatus, }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!networkRequest) {
            return;
        }
        networkRequest.failed = true;
        networkRequest.setResourceType(Common.ResourceType.resourceTypes[resourceType]);
        networkRequest.canceled = Boolean(canceled);
        if (blockedReason) {
            networkRequest.setBlockedReason(blockedReason);
            if (blockedReason === "inspector" /* Protocol.Network.BlockedReason.Inspector */) {
                const message = i18nString(UIStrings.requestWasBlockedByDevtoolsS, { PH1: networkRequest.url() });
                __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.MessageGenerated, { message, requestId, warning: true });
            }
        }
        if (corsErrorStatus) {
            networkRequest.setCorsErrorStatus(corsErrorStatus);
        }
        networkRequest.localizedFailDescription = localizedDescription;
        this.getExtraInfoBuilder(requestId).finished();
        this.finishNetworkRequest(networkRequest, time, -1);
    }
    webSocketCreated({ requestId, url: requestURL, initiator }) {
        const networkRequest = NetworkRequest.createForSocket(requestId, requestURL, initiator);
        requestToManagerMap.set(networkRequest, __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f"));
        networkRequest.setResourceType(Common.ResourceType.resourceTypes.WebSocket);
        this.startNetworkRequest(networkRequest, null);
    }
    webSocketWillSendHandshakeRequest({ requestId, timestamp: time, wallTime, request }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!networkRequest) {
            return;
        }
        networkRequest.requestMethod = 'GET';
        networkRequest.setRequestHeaders(this.headersMapToHeadersArray(request.headers));
        networkRequest.setIssueTime(time, wallTime);
        this.updateNetworkRequest(networkRequest);
    }
    webSocketHandshakeResponseReceived({ requestId, timestamp: time, response }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!networkRequest) {
            return;
        }
        networkRequest.statusCode = response.status;
        networkRequest.statusText = response.statusText;
        networkRequest.responseHeaders = this.headersMapToHeadersArray(response.headers);
        networkRequest.responseHeadersText = response.headersText || '';
        if (response.requestHeaders) {
            networkRequest.setRequestHeaders(this.headersMapToHeadersArray(response.requestHeaders));
        }
        if (response.requestHeadersText) {
            networkRequest.setRequestHeadersText(response.requestHeadersText);
        }
        networkRequest.responseReceivedTime = time;
        networkRequest.protocol = 'websocket';
        this.updateNetworkRequest(networkRequest);
    }
    webSocketFrameReceived({ requestId, timestamp: time, response }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!networkRequest) {
            return;
        }
        networkRequest.addProtocolFrame(response, time, false);
        networkRequest.responseReceivedTime = time;
        this.updateNetworkRequest(networkRequest);
    }
    webSocketFrameSent({ requestId, timestamp: time, response }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!networkRequest) {
            return;
        }
        networkRequest.addProtocolFrame(response, time, true);
        networkRequest.responseReceivedTime = time;
        this.updateNetworkRequest(networkRequest);
    }
    webSocketFrameError({ requestId, timestamp: time, errorMessage }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!networkRequest) {
            return;
        }
        networkRequest.addProtocolFrameError(errorMessage, time);
        networkRequest.responseReceivedTime = time;
        this.updateNetworkRequest(networkRequest);
    }
    webSocketClosed({ requestId, timestamp: time }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!networkRequest) {
            return;
        }
        this.finishNetworkRequest(networkRequest, time, -1);
    }
    eventSourceMessageReceived({ requestId, timestamp: time, eventName, eventId, data }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!networkRequest) {
            return;
        }
        networkRequest.addEventSourceMessage(time, eventName, eventId, data);
    }
    requestIntercepted({}) {
    }
    requestWillBeSentExtraInfo({ requestId, associatedCookies, headers, clientSecurityState, connectTiming, siteHasCookieInOtherPartition }) {
        const blockedRequestCookies = [];
        const includedRequestCookies = [];
        for (const { blockedReasons, exemptionReason, cookie } of associatedCookies) {
            if (blockedReasons.length === 0) {
                includedRequestCookies.push({ exemptionReason, cookie: Cookie.fromProtocolCookie(cookie) });
            }
            else {
                blockedRequestCookies.push({ blockedReasons, cookie: Cookie.fromProtocolCookie(cookie) });
            }
        }
        const extraRequestInfo = {
            blockedRequestCookies,
            includedRequestCookies,
            requestHeaders: this.headersMapToHeadersArray(headers),
            clientSecurityState,
            connectTiming,
            siteHasCookieInOtherPartition,
        };
        this.getExtraInfoBuilder(requestId).addRequestExtraInfo(extraRequestInfo);
    }
    responseReceivedEarlyHints({ requestId, headers, }) {
        this.getExtraInfoBuilder(requestId).setEarlyHintsHeaders(this.headersMapToHeadersArray(headers));
    }
    responseReceivedExtraInfo({ requestId, blockedCookies, headers, headersText, resourceIPAddressSpace, statusCode, cookiePartitionKey, cookiePartitionKeyOpaque, exemptedCookies, }) {
        const extraResponseInfo = {
            blockedResponseCookies: blockedCookies.map(blockedCookie => ({
                blockedReasons: blockedCookie.blockedReasons,
                cookieLine: blockedCookie.cookieLine,
                cookie: blockedCookie.cookie ? Cookie.fromProtocolCookie(blockedCookie.cookie) : null,
            })),
            responseHeaders: this.headersMapToHeadersArray(headers),
            responseHeadersText: headersText,
            resourceIPAddressSpace,
            statusCode,
            cookiePartitionKey,
            cookiePartitionKeyOpaque,
            exemptedResponseCookies: exemptedCookies?.map(exemptedCookie => ({
                cookie: Cookie.fromProtocolCookie(exemptedCookie.cookie),
                cookieLine: exemptedCookie.cookieLine,
                exemptionReason: exemptedCookie.exemptionReason,
            })),
        };
        this.getExtraInfoBuilder(requestId).addResponseExtraInfo(extraResponseInfo);
    }
    getExtraInfoBuilder(requestId) {
        let builder;
        if (!__classPrivateFieldGet(this, _NetworkDispatcher_requestIdToExtraInfoBuilder, "f").has(requestId)) {
            builder = new ExtraInfoBuilder();
            __classPrivateFieldGet(this, _NetworkDispatcher_requestIdToExtraInfoBuilder, "f").set(requestId, builder);
        }
        else {
            builder = __classPrivateFieldGet(this, _NetworkDispatcher_requestIdToExtraInfoBuilder, "f").get(requestId);
        }
        return builder;
    }
    appendRedirect(requestId, time, redirectURL) {
        const originalNetworkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(requestId);
        if (!originalNetworkRequest) {
            throw new Error(`Could not find original network request for ${requestId}`);
        }
        let redirectCount = 0;
        for (let redirect = originalNetworkRequest.redirectSource(); redirect; redirect = redirect.redirectSource()) {
            redirectCount++;
        }
        originalNetworkRequest.markAsRedirect(redirectCount);
        this.finishNetworkRequest(originalNetworkRequest, time, -1);
        const newNetworkRequest = NetworkRequest.create(requestId, redirectURL, originalNetworkRequest.documentURL, originalNetworkRequest.frameId, originalNetworkRequest.loaderId, originalNetworkRequest.initiator(), originalNetworkRequest.hasUserGesture() ?? undefined);
        requestToManagerMap.set(newNetworkRequest, __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f"));
        newNetworkRequest.setRedirectSource(originalNetworkRequest);
        originalNetworkRequest.setRedirectDestination(newNetworkRequest);
        return newNetworkRequest;
    }
    maybeAdoptMainResourceRequest(requestId) {
        const request = MultitargetNetworkManager.instance().inflightMainResourceRequests.get(requestId);
        if (!request) {
            return null;
        }
        const oldDispatcher = NetworkManager.forRequest(request).dispatcher;
        __classPrivateFieldGet(oldDispatcher, _NetworkDispatcher_requestsById, "f").delete(requestId);
        __classPrivateFieldGet(oldDispatcher, _NetworkDispatcher_requestsByURL, "f").delete(request.url());
        const loaderId = request.loaderId;
        if (loaderId) {
            __classPrivateFieldGet(oldDispatcher, _NetworkDispatcher_requestsByLoaderId, "f").delete(loaderId);
        }
        const builder = __classPrivateFieldGet(oldDispatcher, _NetworkDispatcher_requestIdToExtraInfoBuilder, "f").get(requestId);
        __classPrivateFieldGet(oldDispatcher, _NetworkDispatcher_requestIdToExtraInfoBuilder, "f").delete(requestId);
        __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").set(requestId, request);
        __classPrivateFieldGet(this, _NetworkDispatcher_requestsByURL, "f").set(request.url(), request);
        if (loaderId) {
            __classPrivateFieldGet(this, _NetworkDispatcher_requestsByLoaderId, "f").set(loaderId, request);
        }
        if (builder) {
            __classPrivateFieldGet(this, _NetworkDispatcher_requestIdToExtraInfoBuilder, "f").set(requestId, builder);
        }
        requestToManagerMap.set(request, __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f"));
        return request;
    }
    startNetworkRequest(networkRequest, originalRequest) {
        __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").set(networkRequest.requestId(), networkRequest);
        __classPrivateFieldGet(this, _NetworkDispatcher_requestsByURL, "f").set(networkRequest.url(), networkRequest);
        const loaderId = networkRequest.loaderId;
        if (loaderId) {
            __classPrivateFieldGet(this, _NetworkDispatcher_requestsByLoaderId, "f").set(loaderId, networkRequest);
        }
        // The following relies on the fact that loaderIds and requestIds
        // are globally unique and that the main request has them equal. If
        // loaderId is an empty string, it indicates a worker request. For the
        // request to fetch the main worker script, the request ID is the future
        // worker target ID and, therefore, it is unique.
        if (networkRequest.loaderId === networkRequest.requestId() || networkRequest.loaderId === '') {
            MultitargetNetworkManager.instance().inflightMainResourceRequests.set(networkRequest.requestId(), networkRequest);
        }
        __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.RequestStarted, { request: networkRequest, originalRequest });
    }
    updateNetworkRequest(networkRequest) {
        __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.RequestUpdated, networkRequest);
    }
    finishNetworkRequest(networkRequest, finishTime, encodedDataLength) {
        networkRequest.endTime = finishTime;
        networkRequest.finished = true;
        if (encodedDataLength >= 0) {
            const redirectSource = networkRequest.redirectSource();
            if (redirectSource?.signedExchangeInfo()) {
                networkRequest.setTransferSize(0);
                redirectSource.setTransferSize(encodedDataLength);
                this.updateNetworkRequest(redirectSource);
            }
            else {
                networkRequest.setTransferSize(encodedDataLength);
            }
        }
        __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.RequestFinished, networkRequest);
        MultitargetNetworkManager.instance().inflightMainResourceRequests.delete(networkRequest.requestId());
        if (Common.Settings.Settings.instance().moduleSetting('monitoring-xhr-enabled').get() &&
            networkRequest.resourceType().category() === Common.ResourceType.resourceCategories.XHR) {
            let message;
            const failedToLoad = networkRequest.failed || networkRequest.hasErrorStatusCode();
            if (failedToLoad) {
                message = i18nString(UIStrings.sFailedLoadingSS, { PH1: networkRequest.resourceType().title(), PH2: networkRequest.requestMethod, PH3: networkRequest.url() });
            }
            else {
                message = i18nString(UIStrings.sFinishedLoadingSS, { PH1: networkRequest.resourceType().title(), PH2: networkRequest.requestMethod, PH3: networkRequest.url() });
            }
            __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.MessageGenerated, { message, requestId: networkRequest.requestId(), warning: false });
        }
    }
    clearRequests() {
        for (const [requestId, request] of __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f")) {
            if (request.finished) {
                __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").delete(requestId);
            }
        }
        for (const [requestURL, request] of __classPrivateFieldGet(this, _NetworkDispatcher_requestsByURL, "f")) {
            if (request.finished) {
                __classPrivateFieldGet(this, _NetworkDispatcher_requestsByURL, "f").delete(requestURL);
            }
        }
        for (const [requestLoaderId, request] of __classPrivateFieldGet(this, _NetworkDispatcher_requestsByLoaderId, "f")) {
            if (request.finished) {
                __classPrivateFieldGet(this, _NetworkDispatcher_requestsByLoaderId, "f").delete(requestLoaderId);
            }
        }
        for (const [requestId, builder] of __classPrivateFieldGet(this, _NetworkDispatcher_requestIdToExtraInfoBuilder, "f")) {
            if (builder.isFinished()) {
                __classPrivateFieldGet(this, _NetworkDispatcher_requestIdToExtraInfoBuilder, "f").delete(requestId);
            }
        }
    }
    webTransportCreated({ transportId, url: requestURL, timestamp: time, initiator }) {
        const networkRequest = NetworkRequest.createForSocket(transportId, requestURL, initiator);
        networkRequest.hasNetworkData = true;
        requestToManagerMap.set(networkRequest, __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f"));
        networkRequest.setResourceType(Common.ResourceType.resourceTypes.WebTransport);
        networkRequest.setIssueTime(time, 0);
        // TODO(yoichio): Add appropreate events to address abort cases.
        this.startNetworkRequest(networkRequest, null);
    }
    webTransportConnectionEstablished({ transportId, timestamp: time }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(transportId);
        if (!networkRequest) {
            return;
        }
        // This dummy deltas are needed to show this request as being
        // downloaded(blue) given typical WebTransport is kept for a while.
        // TODO(yoichio): Add appropreate events to fix these dummy datas.
        // DNS lookup?
        networkRequest.responseReceivedTime = time;
        networkRequest.endTime = time + 0.001;
        this.updateNetworkRequest(networkRequest);
    }
    webTransportClosed({ transportId, timestamp: time }) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(transportId);
        if (!networkRequest) {
            return;
        }
        networkRequest.endTime = time;
        this.finishNetworkRequest(networkRequest, time, 0);
    }
    directTCPSocketCreated(event) {
        const requestURL = this.concatHostPort(event.remoteAddr, event.remotePort);
        const networkRequest = NetworkRequest.createForSocket(event.identifier, requestURL, event.initiator);
        networkRequest.hasNetworkData = true;
        networkRequest.setRemoteAddress(event.remoteAddr, event.remotePort);
        networkRequest.protocol = i18n.i18n.lockedString('tcp');
        networkRequest.statusText = i18nString(UIStrings.directSocketStatusOpening);
        networkRequest.directSocketInfo = {
            type: DirectSocketType.TCP,
            status: DirectSocketStatus.OPENING,
            createOptions: {
                remoteAddr: event.remoteAddr,
                remotePort: event.remotePort,
                noDelay: event.options.noDelay,
                keepAliveDelay: event.options.keepAliveDelay,
                sendBufferSize: event.options.sendBufferSize,
                receiveBufferSize: event.options.receiveBufferSize,
                dnsQueryType: event.options.dnsQueryType,
            }
        };
        networkRequest.setResourceType(Common.ResourceType.resourceTypes.DirectSocket);
        networkRequest.setIssueTime(event.timestamp, event.timestamp);
        requestToManagerMap.set(networkRequest, __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f"));
        this.startNetworkRequest(networkRequest, null);
    }
    directTCPSocketOpened(event) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.identifier);
        if (!networkRequest?.directSocketInfo) {
            return;
        }
        networkRequest.responseReceivedTime = event.timestamp;
        networkRequest.directSocketInfo.status = DirectSocketStatus.OPEN;
        networkRequest.statusText = i18nString(UIStrings.directSocketStatusOpen);
        networkRequest.directSocketInfo.openInfo = {
            remoteAddr: event.remoteAddr,
            remotePort: event.remotePort,
            localAddr: event.localAddr,
            localPort: event.localPort,
        };
        networkRequest.setRemoteAddress(event.remoteAddr, event.remotePort);
        const requestURL = this.concatHostPort(event.remoteAddr, event.remotePort);
        networkRequest.setUrl(requestURL);
        this.updateNetworkRequest(networkRequest);
    }
    directTCPSocketAborted(event) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.identifier);
        if (!networkRequest?.directSocketInfo) {
            return;
        }
        networkRequest.failed = true;
        networkRequest.directSocketInfo.status = DirectSocketStatus.ABORTED;
        networkRequest.statusText = i18nString(UIStrings.directSocketStatusAborted);
        networkRequest.directSocketInfo.errorMessage = event.errorMessage;
        this.finishNetworkRequest(networkRequest, event.timestamp, 0);
    }
    directTCPSocketClosed(event) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.identifier);
        if (!networkRequest?.directSocketInfo) {
            return;
        }
        networkRequest.statusText = i18nString(UIStrings.directSocketStatusClosed);
        networkRequest.directSocketInfo.status = DirectSocketStatus.CLOSED;
        this.finishNetworkRequest(networkRequest, event.timestamp, 0);
    }
    directTCPSocketChunkSent(event) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.identifier);
        if (!networkRequest) {
            return;
        }
        networkRequest.addDirectSocketChunk({
            data: event.data,
            type: DirectSocketChunkType.SEND,
            timestamp: event.timestamp,
        });
        networkRequest.responseReceivedTime = event.timestamp;
        this.updateNetworkRequest(networkRequest);
    }
    directTCPSocketChunkReceived(event) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.identifier);
        if (!networkRequest) {
            return;
        }
        networkRequest.addDirectSocketChunk({
            data: event.data,
            type: DirectSocketChunkType.RECEIVE,
            timestamp: event.timestamp,
        });
        networkRequest.responseReceivedTime = event.timestamp;
        this.updateNetworkRequest(networkRequest);
    }
    directUDPSocketCreated(event) {
        let requestURL = '';
        let type;
        if (event.options.remoteAddr && event.options.remotePort) {
            requestURL = this.concatHostPort(event.options.remoteAddr, event.options.remotePort);
            type = DirectSocketType.UDP_CONNECTED;
        }
        else if (event.options.localAddr) {
            requestURL = this.concatHostPort(event.options.localAddr, event.options.localPort);
            type = DirectSocketType.UDP_BOUND;
        }
        else {
            // Must be present in a valid command if remoteAddr
            // is not specified.
            return;
        }
        const networkRequest = NetworkRequest.createForSocket(event.identifier, requestURL, event.initiator);
        networkRequest.hasNetworkData = true;
        if (event.options.remoteAddr && event.options.remotePort) {
            networkRequest.setRemoteAddress(event.options.remoteAddr, event.options.remotePort);
        }
        networkRequest.protocol = i18n.i18n.lockedString('udp');
        networkRequest.statusText = i18nString(UIStrings.directSocketStatusOpening);
        networkRequest.directSocketInfo = {
            type,
            status: DirectSocketStatus.OPENING,
            createOptions: {
                remoteAddr: event.options.remoteAddr,
                remotePort: event.options.remotePort,
                localAddr: event.options.localAddr,
                localPort: event.options.localPort,
                sendBufferSize: event.options.sendBufferSize,
                receiveBufferSize: event.options.receiveBufferSize,
                dnsQueryType: event.options.dnsQueryType,
            }
        };
        networkRequest.setResourceType(Common.ResourceType.resourceTypes.DirectSocket);
        networkRequest.setIssueTime(event.timestamp, event.timestamp);
        requestToManagerMap.set(networkRequest, __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f"));
        this.startNetworkRequest(networkRequest, null);
    }
    directUDPSocketOpened(event) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.identifier);
        if (!networkRequest?.directSocketInfo) {
            return;
        }
        let requestURL;
        if (networkRequest.directSocketInfo.type === DirectSocketType.UDP_CONNECTED) {
            if (!event.remoteAddr || !event.remotePort) {
                // Connected socket must have remoteAdd and remotePort.
                return;
            }
            networkRequest.setRemoteAddress(event.remoteAddr, event.remotePort);
            requestURL = this.concatHostPort(event.remoteAddr, event.remotePort);
        }
        else {
            requestURL = this.concatHostPort(event.localAddr, event.localPort);
        }
        networkRequest.setUrl(requestURL);
        networkRequest.responseReceivedTime = event.timestamp;
        networkRequest.directSocketInfo.status = DirectSocketStatus.OPEN;
        networkRequest.statusText = i18nString(UIStrings.directSocketStatusOpen);
        networkRequest.directSocketInfo.openInfo = {
            remoteAddr: event.remoteAddr,
            remotePort: event.remotePort,
            localAddr: event.localAddr,
            localPort: event.localPort,
        };
        this.updateNetworkRequest(networkRequest);
    }
    directUDPSocketAborted(event) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.identifier);
        if (!networkRequest?.directSocketInfo) {
            return;
        }
        networkRequest.failed = true;
        networkRequest.directSocketInfo.status = DirectSocketStatus.ABORTED;
        networkRequest.statusText = i18nString(UIStrings.directSocketStatusAborted);
        networkRequest.directSocketInfo.errorMessage = event.errorMessage;
        this.finishNetworkRequest(networkRequest, event.timestamp, 0);
    }
    directUDPSocketClosed(event) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.identifier);
        if (!networkRequest?.directSocketInfo) {
            return;
        }
        networkRequest.statusText = i18nString(UIStrings.directSocketStatusClosed);
        networkRequest.directSocketInfo.status = DirectSocketStatus.CLOSED;
        this.finishNetworkRequest(networkRequest, event.timestamp, 0);
    }
    directUDPSocketChunkSent(event) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.identifier);
        if (!networkRequest) {
            return;
        }
        networkRequest.addDirectSocketChunk({
            data: event.message.data,
            type: DirectSocketChunkType.SEND,
            timestamp: event.timestamp,
            remoteAddress: event.message.remoteAddr,
            remotePort: event.message.remotePort
        });
        networkRequest.responseReceivedTime = event.timestamp;
        this.updateNetworkRequest(networkRequest);
    }
    directUDPSocketChunkReceived(event) {
        const networkRequest = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.identifier);
        if (!networkRequest) {
            return;
        }
        networkRequest.addDirectSocketChunk({
            data: event.message.data,
            type: DirectSocketChunkType.RECEIVE,
            timestamp: event.timestamp,
            remoteAddress: event.message.remoteAddr,
            remotePort: event.message.remotePort
        });
        networkRequest.responseReceivedTime = event.timestamp;
        this.updateNetworkRequest(networkRequest);
    }
    trustTokenOperationDone(event) {
        const request = __classPrivateFieldGet(this, _NetworkDispatcher_requestsById, "f").get(event.requestId);
        if (!request) {
            __classPrivateFieldGet(this, _NetworkDispatcher_requestIdToTrustTokenEvent, "f").set(event.requestId, event);
            return;
        }
        request.setTrustTokenOperationDoneEvent(event);
    }
    subresourceWebBundleMetadataReceived({ requestId, urls }) {
        const extraInfoBuilder = this.getExtraInfoBuilder(requestId);
        extraInfoBuilder.setWebBundleInfo({ resourceUrls: urls });
        const finalRequest = extraInfoBuilder.finalRequest();
        if (finalRequest) {
            this.updateNetworkRequest(finalRequest);
        }
    }
    subresourceWebBundleMetadataError({ requestId, errorMessage }) {
        const extraInfoBuilder = this.getExtraInfoBuilder(requestId);
        extraInfoBuilder.setWebBundleInfo({ errorMessage });
        const finalRequest = extraInfoBuilder.finalRequest();
        if (finalRequest) {
            this.updateNetworkRequest(finalRequest);
        }
    }
    subresourceWebBundleInnerResponseParsed({ innerRequestId, bundleRequestId }) {
        const extraInfoBuilder = this.getExtraInfoBuilder(innerRequestId);
        extraInfoBuilder.setWebBundleInnerRequestInfo({ bundleRequestId });
        const finalRequest = extraInfoBuilder.finalRequest();
        if (finalRequest) {
            this.updateNetworkRequest(finalRequest);
        }
    }
    subresourceWebBundleInnerResponseError({ innerRequestId, errorMessage }) {
        const extraInfoBuilder = this.getExtraInfoBuilder(innerRequestId);
        extraInfoBuilder.setWebBundleInnerRequestInfo({ errorMessage });
        const finalRequest = extraInfoBuilder.finalRequest();
        if (finalRequest) {
            this.updateNetworkRequest(finalRequest);
        }
    }
    reportingApiReportAdded(data) {
        __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.ReportingApiReportAdded, data.report);
    }
    reportingApiReportUpdated(data) {
        __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.ReportingApiReportUpdated, data.report);
    }
    reportingApiEndpointsChangedForOrigin(data) {
        __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f").dispatchEventToListeners(Events.ReportingApiEndpointsChangedForOrigin, data);
    }
    policyUpdated() {
    }
    /**
     * @deprecated
     * This method is only kept for usage in a web test.
     */
    createNetworkRequest(requestId, frameId, loaderId, url, documentURL, initiator) {
        const request = NetworkRequest.create(requestId, url, documentURL, frameId, loaderId, initiator);
        requestToManagerMap.set(request, __classPrivateFieldGet(this, _NetworkDispatcher_manager, "f"));
        return request;
    }
    concatHostPort(host, port) {
        if (!port || port === 0) {
            return host;
        }
        return `${host}:${port}`;
    }
}
_NetworkDispatcher_manager = new WeakMap(), _NetworkDispatcher_requestsById = new WeakMap(), _NetworkDispatcher_requestsByURL = new WeakMap(), _NetworkDispatcher_requestsByLoaderId = new WeakMap(), _NetworkDispatcher_requestIdToExtraInfoBuilder = new WeakMap(), _NetworkDispatcher_requestIdToTrustTokenEvent = new WeakMap(), _NetworkDispatcher_instances = new WeakSet(), _NetworkDispatcher_markAsIntercepted = function _NetworkDispatcher_markAsIntercepted(event) {
    const request = this.requestForId(event.data);
    if (request) {
        request.setWasIntercepted(true);
    }
};
let multiTargetNetworkManagerInstance;
export class MultitargetNetworkManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _MultitargetNetworkManager_userAgentOverride.set(this, '');
        _MultitargetNetworkManager_userAgentMetadataOverride.set(this, null);
        _MultitargetNetworkManager_customAcceptedEncodings.set(this, null);
        _MultitargetNetworkManager_networkAgents.set(this, new Set());
        _MultitargetNetworkManager_fetchAgents.set(this, new Set());
        this.inflightMainResourceRequests = new Map();
        _MultitargetNetworkManager_networkConditions.set(this, NoThrottlingConditions);
        _MultitargetNetworkManager_updatingInterceptionPatternsPromise.set(this, null);
        _MultitargetNetworkManager_blockingEnabledSetting.set(this, Common.Settings.Settings.instance().moduleSetting('request-blocking-enabled'));
        _MultitargetNetworkManager_blockedPatternsSetting.set(this, Common.Settings.Settings.instance().createSetting('network-blocked-patterns', []));
        _MultitargetNetworkManager_effectiveBlockedURLs.set(this, []);
        _MultitargetNetworkManager_urlsForRequestInterceptor.set(this, new Platform.MapUtilities.Multimap());
        _MultitargetNetworkManager_extraHeaders.set(this, void 0);
        _MultitargetNetworkManager_customUserAgent.set(this, void 0);
        // TODO(allada) Remove these and merge it with request interception.
        const blockedPatternChanged = () => {
            this.updateBlockedPatterns();
            this.dispatchEventToListeners("BlockedPatternsChanged" /* MultitargetNetworkManager.Events.BLOCKED_PATTERNS_CHANGED */);
        };
        __classPrivateFieldGet(this, _MultitargetNetworkManager_blockingEnabledSetting, "f").addChangeListener(blockedPatternChanged);
        __classPrivateFieldGet(this, _MultitargetNetworkManager_blockedPatternsSetting, "f").addChangeListener(blockedPatternChanged);
        this.updateBlockedPatterns();
        TargetManager.instance().observeModels(NetworkManager, this);
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!multiTargetNetworkManagerInstance || forceNew) {
            multiTargetNetworkManagerInstance = new MultitargetNetworkManager();
        }
        return multiTargetNetworkManagerInstance;
    }
    static dispose() {
        multiTargetNetworkManagerInstance = null;
    }
    static patchUserAgentWithChromeVersion(uaString) {
        // Patches Chrome/ChrOS version from user #agent ("1.2.3.4" when user #agent is: "Chrome/1.2.3.4").
        // Otherwise, ignore it. This assumes additional appVersions appear after the Chrome version.
        const chromeVersion = Root.Runtime.getChromeVersion();
        if (chromeVersion.length > 0) {
            // "1.2.3.4" becomes "1.0.100.0"
            const additionalAppVersion = chromeVersion.split('.', 1)[0] + '.0.100.0';
            return Platform.StringUtilities.sprintf(uaString, chromeVersion, additionalAppVersion);
        }
        return uaString;
    }
    static patchUserAgentMetadataWithChromeVersion(userAgentMetadata) {
        // Patches Chrome/ChrOS version from user #agent metadata ("1.2.3.4" when user #agent is: "Chrome/1.2.3.4").
        // Otherwise, ignore it. This assumes additional appVersions appear after the Chrome version.
        if (!userAgentMetadata.brands) {
            return;
        }
        const chromeVersion = Root.Runtime.getChromeVersion();
        if (chromeVersion.length === 0) {
            return;
        }
        const majorVersion = chromeVersion.split('.', 1)[0];
        for (const brand of userAgentMetadata.brands) {
            if (brand.version.includes('%s')) {
                brand.version = Platform.StringUtilities.sprintf(brand.version, majorVersion);
            }
        }
        if (userAgentMetadata.fullVersion) {
            if (userAgentMetadata.fullVersion.includes('%s')) {
                userAgentMetadata.fullVersion = Platform.StringUtilities.sprintf(userAgentMetadata.fullVersion, chromeVersion);
            }
        }
    }
    modelAdded(networkManager) {
        const networkAgent = networkManager.target().networkAgent();
        const fetchAgent = networkManager.target().fetchAgent();
        if (__classPrivateFieldGet(this, _MultitargetNetworkManager_extraHeaders, "f")) {
            void networkAgent.invoke_setExtraHTTPHeaders({ headers: __classPrivateFieldGet(this, _MultitargetNetworkManager_extraHeaders, "f") });
        }
        if (this.currentUserAgent()) {
            void networkAgent.invoke_setUserAgentOverride({ userAgent: this.currentUserAgent(), userAgentMetadata: __classPrivateFieldGet(this, _MultitargetNetworkManager_userAgentMetadataOverride, "f") || undefined });
        }
        if (__classPrivateFieldGet(this, _MultitargetNetworkManager_effectiveBlockedURLs, "f").length) {
            void networkAgent.invoke_setBlockedURLs({ urls: __classPrivateFieldGet(this, _MultitargetNetworkManager_effectiveBlockedURLs, "f") });
        }
        if (this.isIntercepting()) {
            void fetchAgent.invoke_enable({ patterns: __classPrivateFieldGet(this, _MultitargetNetworkManager_urlsForRequestInterceptor, "f").valuesArray() });
        }
        if (__classPrivateFieldGet(this, _MultitargetNetworkManager_customAcceptedEncodings, "f") === null) {
            void networkAgent.invoke_clearAcceptedEncodingsOverride();
        }
        else {
            void networkAgent.invoke_setAcceptedEncodings({ encodings: __classPrivateFieldGet(this, _MultitargetNetworkManager_customAcceptedEncodings, "f") });
        }
        __classPrivateFieldGet(this, _MultitargetNetworkManager_networkAgents, "f").add(networkAgent);
        __classPrivateFieldGet(this, _MultitargetNetworkManager_fetchAgents, "f").add(fetchAgent);
        if (this.isThrottling()) {
            this.updateNetworkConditions(networkAgent);
        }
    }
    modelRemoved(networkManager) {
        for (const entry of this.inflightMainResourceRequests) {
            const manager = NetworkManager.forRequest((entry[1]));
            if (manager !== networkManager) {
                continue;
            }
            this.inflightMainResourceRequests.delete((entry[0]));
        }
        __classPrivateFieldGet(this, _MultitargetNetworkManager_networkAgents, "f").delete(networkManager.target().networkAgent());
        __classPrivateFieldGet(this, _MultitargetNetworkManager_fetchAgents, "f").delete(networkManager.target().fetchAgent());
    }
    isThrottling() {
        return __classPrivateFieldGet(this, _MultitargetNetworkManager_networkConditions, "f").download >= 0 || __classPrivateFieldGet(this, _MultitargetNetworkManager_networkConditions, "f").upload >= 0 ||
            __classPrivateFieldGet(this, _MultitargetNetworkManager_networkConditions, "f").latency > 0;
    }
    isOffline() {
        return !__classPrivateFieldGet(this, _MultitargetNetworkManager_networkConditions, "f").download && !__classPrivateFieldGet(this, _MultitargetNetworkManager_networkConditions, "f").upload;
    }
    setNetworkConditions(conditions) {
        __classPrivateFieldSet(this, _MultitargetNetworkManager_networkConditions, conditions, "f");
        for (const agent of __classPrivateFieldGet(this, _MultitargetNetworkManager_networkAgents, "f")) {
            this.updateNetworkConditions(agent);
        }
        this.dispatchEventToListeners("ConditionsChanged" /* MultitargetNetworkManager.Events.CONDITIONS_CHANGED */);
    }
    networkConditions() {
        return __classPrivateFieldGet(this, _MultitargetNetworkManager_networkConditions, "f");
    }
    updateNetworkConditions(networkAgent) {
        const conditions = __classPrivateFieldGet(this, _MultitargetNetworkManager_networkConditions, "f");
        if (!this.isThrottling()) {
            void networkAgent.invoke_emulateNetworkConditions({
                offline: false,
                latency: 0,
                downloadThroughput: 0,
                uploadThroughput: 0,
            });
        }
        else {
            void networkAgent.invoke_emulateNetworkConditions({
                offline: this.isOffline(),
                latency: conditions.latency,
                downloadThroughput: conditions.download < 0 ? 0 : conditions.download,
                uploadThroughput: conditions.upload < 0 ? 0 : conditions.upload,
                packetLoss: (conditions.packetLoss ?? 0) < 0 ? 0 : conditions.packetLoss,
                packetQueueLength: conditions.packetQueueLength,
                packetReordering: conditions.packetReordering,
                connectionType: NetworkManager.connectionType(conditions),
            });
        }
    }
    setExtraHTTPHeaders(headers) {
        __classPrivateFieldSet(this, _MultitargetNetworkManager_extraHeaders, headers, "f");
        for (const agent of __classPrivateFieldGet(this, _MultitargetNetworkManager_networkAgents, "f")) {
            void agent.invoke_setExtraHTTPHeaders({ headers: __classPrivateFieldGet(this, _MultitargetNetworkManager_extraHeaders, "f") });
        }
    }
    currentUserAgent() {
        return __classPrivateFieldGet(this, _MultitargetNetworkManager_customUserAgent, "f") ? __classPrivateFieldGet(this, _MultitargetNetworkManager_customUserAgent, "f") : __classPrivateFieldGet(this, _MultitargetNetworkManager_userAgentOverride, "f");
    }
    updateUserAgentOverride() {
        const userAgent = this.currentUserAgent();
        for (const agent of __classPrivateFieldGet(this, _MultitargetNetworkManager_networkAgents, "f")) {
            void agent.invoke_setUserAgentOverride({ userAgent, userAgentMetadata: __classPrivateFieldGet(this, _MultitargetNetworkManager_userAgentMetadataOverride, "f") || undefined });
        }
    }
    setUserAgentOverride(userAgent, userAgentMetadataOverride) {
        const uaChanged = (__classPrivateFieldGet(this, _MultitargetNetworkManager_userAgentOverride, "f") !== userAgent);
        __classPrivateFieldSet(this, _MultitargetNetworkManager_userAgentOverride, userAgent, "f");
        if (!__classPrivateFieldGet(this, _MultitargetNetworkManager_customUserAgent, "f")) {
            __classPrivateFieldSet(this, _MultitargetNetworkManager_userAgentMetadataOverride, userAgentMetadataOverride, "f");
            this.updateUserAgentOverride();
        }
        else {
            __classPrivateFieldSet(this, _MultitargetNetworkManager_userAgentMetadataOverride, null, "f");
        }
        if (uaChanged) {
            this.dispatchEventToListeners("UserAgentChanged" /* MultitargetNetworkManager.Events.USER_AGENT_CHANGED */);
        }
    }
    setCustomUserAgentOverride(userAgent, userAgentMetadataOverride = null) {
        __classPrivateFieldSet(this, _MultitargetNetworkManager_customUserAgent, userAgent, "f");
        __classPrivateFieldSet(this, _MultitargetNetworkManager_userAgentMetadataOverride, userAgentMetadataOverride, "f");
        this.updateUserAgentOverride();
    }
    setCustomAcceptedEncodingsOverride(acceptedEncodings) {
        __classPrivateFieldSet(this, _MultitargetNetworkManager_customAcceptedEncodings, acceptedEncodings, "f");
        this.updateAcceptedEncodingsOverride();
        this.dispatchEventToListeners("AcceptedEncodingsChanged" /* MultitargetNetworkManager.Events.ACCEPTED_ENCODINGS_CHANGED */);
    }
    clearCustomAcceptedEncodingsOverride() {
        __classPrivateFieldSet(this, _MultitargetNetworkManager_customAcceptedEncodings, null, "f");
        this.updateAcceptedEncodingsOverride();
        this.dispatchEventToListeners("AcceptedEncodingsChanged" /* MultitargetNetworkManager.Events.ACCEPTED_ENCODINGS_CHANGED */);
    }
    isAcceptedEncodingOverrideSet() {
        return __classPrivateFieldGet(this, _MultitargetNetworkManager_customAcceptedEncodings, "f") !== null;
    }
    updateAcceptedEncodingsOverride() {
        const customAcceptedEncodings = __classPrivateFieldGet(this, _MultitargetNetworkManager_customAcceptedEncodings, "f");
        for (const agent of __classPrivateFieldGet(this, _MultitargetNetworkManager_networkAgents, "f")) {
            if (customAcceptedEncodings === null) {
                void agent.invoke_clearAcceptedEncodingsOverride();
            }
            else {
                void agent.invoke_setAcceptedEncodings({ encodings: customAcceptedEncodings });
            }
        }
    }
    // TODO(allada) Move all request blocking into interception and let view manage blocking.
    blockedPatterns() {
        return __classPrivateFieldGet(this, _MultitargetNetworkManager_blockedPatternsSetting, "f").get().slice();
    }
    blockingEnabled() {
        return __classPrivateFieldGet(this, _MultitargetNetworkManager_blockingEnabledSetting, "f").get();
    }
    isBlocking() {
        return Boolean(__classPrivateFieldGet(this, _MultitargetNetworkManager_effectiveBlockedURLs, "f").length);
    }
    setBlockedPatterns(patterns) {
        __classPrivateFieldGet(this, _MultitargetNetworkManager_blockedPatternsSetting, "f").set(patterns);
    }
    setBlockingEnabled(enabled) {
        if (__classPrivateFieldGet(this, _MultitargetNetworkManager_blockingEnabledSetting, "f").get() === enabled) {
            return;
        }
        __classPrivateFieldGet(this, _MultitargetNetworkManager_blockingEnabledSetting, "f").set(enabled);
    }
    updateBlockedPatterns() {
        const urls = [];
        if (__classPrivateFieldGet(this, _MultitargetNetworkManager_blockingEnabledSetting, "f").get()) {
            for (const pattern of __classPrivateFieldGet(this, _MultitargetNetworkManager_blockedPatternsSetting, "f").get()) {
                if (pattern.enabled) {
                    urls.push(pattern.url);
                }
            }
        }
        if (!urls.length && !__classPrivateFieldGet(this, _MultitargetNetworkManager_effectiveBlockedURLs, "f").length) {
            return;
        }
        __classPrivateFieldSet(this, _MultitargetNetworkManager_effectiveBlockedURLs, urls, "f");
        for (const agent of __classPrivateFieldGet(this, _MultitargetNetworkManager_networkAgents, "f")) {
            void agent.invoke_setBlockedURLs({ urls: __classPrivateFieldGet(this, _MultitargetNetworkManager_effectiveBlockedURLs, "f") });
        }
    }
    isIntercepting() {
        return Boolean(__classPrivateFieldGet(this, _MultitargetNetworkManager_urlsForRequestInterceptor, "f").size);
    }
    setInterceptionHandlerForPatterns(patterns, requestInterceptor) {
        // Note: requestInterceptors may receive interception #requests for patterns they did not subscribe to.
        __classPrivateFieldGet(this, _MultitargetNetworkManager_urlsForRequestInterceptor, "f").deleteAll(requestInterceptor);
        for (const newPattern of patterns) {
            __classPrivateFieldGet(this, _MultitargetNetworkManager_urlsForRequestInterceptor, "f").set(requestInterceptor, newPattern);
        }
        return this.updateInterceptionPatternsOnNextTick();
    }
    updateInterceptionPatternsOnNextTick() {
        // This is used so we can register and unregister patterns in loops without sending lots of protocol messages.
        if (!__classPrivateFieldGet(this, _MultitargetNetworkManager_updatingInterceptionPatternsPromise, "f")) {
            __classPrivateFieldSet(this, _MultitargetNetworkManager_updatingInterceptionPatternsPromise, Promise.resolve().then(this.updateInterceptionPatterns.bind(this)), "f");
        }
        return __classPrivateFieldGet(this, _MultitargetNetworkManager_updatingInterceptionPatternsPromise, "f");
    }
    async updateInterceptionPatterns() {
        if (!Common.Settings.Settings.instance().moduleSetting('cache-disabled').get()) {
            Common.Settings.Settings.instance().moduleSetting('cache-disabled').set(true);
        }
        __classPrivateFieldSet(this, _MultitargetNetworkManager_updatingInterceptionPatternsPromise, null, "f");
        const promises = [];
        for (const agent of __classPrivateFieldGet(this, _MultitargetNetworkManager_fetchAgents, "f")) {
            promises.push(agent.invoke_enable({ patterns: __classPrivateFieldGet(this, _MultitargetNetworkManager_urlsForRequestInterceptor, "f").valuesArray() }));
        }
        this.dispatchEventToListeners("InterceptorsChanged" /* MultitargetNetworkManager.Events.INTERCEPTORS_CHANGED */);
        await Promise.all(promises);
    }
    async requestIntercepted(interceptedRequest) {
        for (const requestInterceptor of __classPrivateFieldGet(this, _MultitargetNetworkManager_urlsForRequestInterceptor, "f").keysArray()) {
            await requestInterceptor(interceptedRequest);
            if (interceptedRequest.hasResponded() && interceptedRequest.networkRequest) {
                this.dispatchEventToListeners("RequestIntercepted" /* MultitargetNetworkManager.Events.REQUEST_INTERCEPTED */, interceptedRequest.networkRequest.requestId());
                return;
            }
        }
        if (!interceptedRequest.hasResponded()) {
            interceptedRequest.continueRequestWithoutChange();
        }
    }
    clearBrowserCache() {
        for (const agent of __classPrivateFieldGet(this, _MultitargetNetworkManager_networkAgents, "f")) {
            void agent.invoke_clearBrowserCache();
        }
    }
    clearBrowserCookies() {
        for (const agent of __classPrivateFieldGet(this, _MultitargetNetworkManager_networkAgents, "f")) {
            void agent.invoke_clearBrowserCookies();
        }
    }
    async getCertificate(origin) {
        const target = TargetManager.instance().primaryPageTarget();
        if (!target) {
            return [];
        }
        const certificate = await target.networkAgent().invoke_getCertificate({ origin });
        if (!certificate) {
            return [];
        }
        return certificate.tableNames;
    }
    async loadResource(url) {
        const headers = {};
        const currentUserAgent = this.currentUserAgent();
        if (currentUserAgent) {
            headers['User-Agent'] = currentUserAgent;
        }
        if (Common.Settings.Settings.instance().moduleSetting('cache-disabled').get()) {
            headers['Cache-Control'] = 'no-cache';
        }
        const allowRemoteFilePaths = Common.Settings.Settings.instance().moduleSetting('network.enable-remote-file-loading').get();
        return await new Promise(resolve => Host.ResourceLoader.load(url, headers, (success, _responseHeaders, content, errorDescription) => {
            resolve({ success, content, errorDescription });
        }, allowRemoteFilePaths));
    }
}
_MultitargetNetworkManager_userAgentOverride = new WeakMap(), _MultitargetNetworkManager_userAgentMetadataOverride = new WeakMap(), _MultitargetNetworkManager_customAcceptedEncodings = new WeakMap(), _MultitargetNetworkManager_networkAgents = new WeakMap(), _MultitargetNetworkManager_fetchAgents = new WeakMap(), _MultitargetNetworkManager_networkConditions = new WeakMap(), _MultitargetNetworkManager_updatingInterceptionPatternsPromise = new WeakMap(), _MultitargetNetworkManager_blockingEnabledSetting = new WeakMap(), _MultitargetNetworkManager_blockedPatternsSetting = new WeakMap(), _MultitargetNetworkManager_effectiveBlockedURLs = new WeakMap(), _MultitargetNetworkManager_urlsForRequestInterceptor = new WeakMap(), _MultitargetNetworkManager_extraHeaders = new WeakMap(), _MultitargetNetworkManager_customUserAgent = new WeakMap();
(function (MultitargetNetworkManager) {
    let Events;
    (function (Events) {
        Events["BLOCKED_PATTERNS_CHANGED"] = "BlockedPatternsChanged";
        Events["CONDITIONS_CHANGED"] = "ConditionsChanged";
        Events["USER_AGENT_CHANGED"] = "UserAgentChanged";
        Events["INTERCEPTORS_CHANGED"] = "InterceptorsChanged";
        Events["ACCEPTED_ENCODINGS_CHANGED"] = "AcceptedEncodingsChanged";
        Events["REQUEST_INTERCEPTED"] = "RequestIntercepted";
        Events["REQUEST_FULFILLED"] = "RequestFulfilled";
    })(Events = MultitargetNetworkManager.Events || (MultitargetNetworkManager.Events = {}));
})(MultitargetNetworkManager || (MultitargetNetworkManager = {}));
export class InterceptedRequest {
    constructor(fetchAgent, request, resourceType, requestId, networkRequest, responseStatusCode, responseHeaders) {
        _InterceptedRequest_fetchAgent.set(this, void 0);
        _InterceptedRequest_hasResponded.set(this, false);
        __classPrivateFieldSet(this, _InterceptedRequest_fetchAgent, fetchAgent, "f");
        this.request = request;
        this.resourceType = resourceType;
        this.responseStatusCode = responseStatusCode;
        this.responseHeaders = responseHeaders;
        this.requestId = requestId;
        this.networkRequest = networkRequest;
    }
    hasResponded() {
        return __classPrivateFieldGet(this, _InterceptedRequest_hasResponded, "f");
    }
    static mergeSetCookieHeaders(originalSetCookieHeaders, setCookieHeadersFromOverrides) {
        // Generates a map containing the `set-cookie` headers. Valid `set-cookie`
        // headers are stored by the cookie name. Malformed `set-cookie` headers are
        // stored by the whole header value. Duplicates are allowed.
        const generateHeaderMap = (headers) => {
            const result = new Map();
            for (const header of headers) {
                // The regex matches cookie headers of the form '<header-name>=<header-value>'.
                // <header-name> is a token as defined in https://www.rfc-editor.org/rfc/rfc9110.html#name-tokens.
                // The shape of <header-value> is not being validated at all here.
                const match = header.value.match(/^([a-zA-Z0-9!#$%&'*+.^_`|~-]+=)(.*)$/);
                if (match) {
                    if (result.has(match[1])) {
                        result.get(match[1])?.push(header.value);
                    }
                    else {
                        result.set(match[1], [header.value]);
                    }
                }
                else if (result.has(header.value)) {
                    result.get(header.value)?.push(header.value);
                }
                else {
                    result.set(header.value, [header.value]);
                }
            }
            return result;
        };
        const originalHeadersMap = generateHeaderMap(originalSetCookieHeaders);
        const overridesHeaderMap = generateHeaderMap(setCookieHeadersFromOverrides);
        // Iterate over original headers. If the same key is found among the
        // overrides, use those instead.
        const mergedHeaders = [];
        for (const [key, headerValues] of originalHeadersMap) {
            if (overridesHeaderMap.has(key)) {
                for (const headerValue of overridesHeaderMap.get(key) || []) {
                    mergedHeaders.push({ name: 'set-cookie', value: headerValue });
                }
            }
            else {
                for (const headerValue of headerValues) {
                    mergedHeaders.push({ name: 'set-cookie', value: headerValue });
                }
            }
        }
        // Finally add all overrides which have not been added yet.
        for (const [key, headerValues] of overridesHeaderMap) {
            if (originalHeadersMap.has(key)) {
                continue;
            }
            for (const headerValue of headerValues) {
                mergedHeaders.push({ name: 'set-cookie', value: headerValue });
            }
        }
        return mergedHeaders;
    }
    async continueRequestWithContent(contentBlob, encoded, responseHeaders, isBodyOverridden) {
        __classPrivateFieldSet(this, _InterceptedRequest_hasResponded, true, "f");
        const body = encoded ? await contentBlob.text() : await Common.Base64.encode(contentBlob).catch(err => {
            console.error(err);
            return '';
        });
        const responseCode = isBodyOverridden ? 200 : (this.responseStatusCode || 200);
        if (this.networkRequest) {
            const originalSetCookieHeaders = this.networkRequest?.originalResponseHeaders.filter(header => header.name === 'set-cookie') || [];
            const setCookieHeadersFromOverrides = responseHeaders.filter(header => header.name === 'set-cookie');
            this.networkRequest.setCookieHeaders =
                InterceptedRequest.mergeSetCookieHeaders(originalSetCookieHeaders, setCookieHeadersFromOverrides);
            this.networkRequest.hasOverriddenContent = isBodyOverridden;
        }
        void __classPrivateFieldGet(this, _InterceptedRequest_fetchAgent, "f").invoke_fulfillRequest({ requestId: this.requestId, responseCode, body, responseHeaders });
        MultitargetNetworkManager.instance().dispatchEventToListeners("RequestFulfilled" /* MultitargetNetworkManager.Events.REQUEST_FULFILLED */, this.request.url);
    }
    continueRequestWithoutChange() {
        console.assert(!__classPrivateFieldGet(this, _InterceptedRequest_hasResponded, "f"));
        __classPrivateFieldSet(this, _InterceptedRequest_hasResponded, true, "f");
        void __classPrivateFieldGet(this, _InterceptedRequest_fetchAgent, "f").invoke_continueRequest({ requestId: this.requestId });
    }
    async responseBody() {
        const response = await __classPrivateFieldGet(this, _InterceptedRequest_fetchAgent, "f").invoke_getResponseBody({ requestId: this.requestId });
        const error = response.getError();
        if (error) {
            return { error };
        }
        const { mimeType, charset } = this.getMimeTypeAndCharset();
        return new TextUtils.ContentData.ContentData(response.body, response.base64Encoded, mimeType ?? 'application/octet-stream', charset ?? undefined);
    }
    isRedirect() {
        return this.responseStatusCode !== undefined && this.responseStatusCode >= 300 && this.responseStatusCode < 400;
    }
    /**
     * Tries to determine the MIME type and charset for this intercepted request.
     * Looks at the intercepted response headers first (for Content-Type header), then
     * checks the `NetworkRequest` if we have one.
     */
    getMimeTypeAndCharset() {
        for (const header of this.responseHeaders ?? []) {
            if (header.name.toLowerCase() === 'content-type') {
                return Platform.MimeType.parseContentType(header.value);
            }
        }
        const mimeType = this.networkRequest?.mimeType ?? null;
        const charset = this.networkRequest?.charset() ?? null;
        return { mimeType, charset };
    }
}
_InterceptedRequest_fetchAgent = new WeakMap(), _InterceptedRequest_hasResponded = new WeakMap();
/**
 * Helper class to match #requests created from requestWillBeSent with
 * requestWillBeSentExtraInfo and responseReceivedExtraInfo when they have the
 * same requestId due to redirects.
 */
class ExtraInfoBuilder {
    constructor() {
        _ExtraInfoBuilder_requests.set(this, []);
        _ExtraInfoBuilder_responseExtraInfoFlag.set(this, []);
        _ExtraInfoBuilder_requestExtraInfos.set(this, []);
        _ExtraInfoBuilder_responseExtraInfos.set(this, []);
        _ExtraInfoBuilder_responseEarlyHintsHeaders.set(this, []);
        _ExtraInfoBuilder_finished.set(this, false);
        _ExtraInfoBuilder_webBundleInfo.set(this, null);
        _ExtraInfoBuilder_webBundleInnerRequestInfo.set(this, null);
    }
    addRequest(req) {
        __classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f").push(req);
        this.sync(__classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f").length - 1);
    }
    addHasExtraInfo(hasExtraInfo) {
        __classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfoFlag, "f").push(hasExtraInfo);
        // This comes in response, so it can't come before request or after next
        // request in the redirect chain.
        console.assert(__classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f").length === __classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfoFlag, "f").length, 'request/response count mismatch');
        if (!hasExtraInfo) {
            // We may potentially have gotten extra infos from the next redirect
            // request already. Account for that by inserting null for missing
            // extra infos at current position.
            __classPrivateFieldGet(this, _ExtraInfoBuilder_requestExtraInfos, "f").splice(__classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f").length - 1, 0, null);
            __classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfos, "f").splice(__classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f").length - 1, 0, null);
        }
        this.sync(__classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f").length - 1);
    }
    addRequestExtraInfo(info) {
        __classPrivateFieldGet(this, _ExtraInfoBuilder_requestExtraInfos, "f").push(info);
        this.sync(__classPrivateFieldGet(this, _ExtraInfoBuilder_requestExtraInfos, "f").length - 1);
    }
    addResponseExtraInfo(info) {
        __classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfos, "f").push(info);
        this.sync(__classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfos, "f").length - 1);
    }
    setEarlyHintsHeaders(earlyHintsHeaders) {
        __classPrivateFieldSet(this, _ExtraInfoBuilder_responseEarlyHintsHeaders, earlyHintsHeaders, "f");
        this.updateFinalRequest();
    }
    setWebBundleInfo(info) {
        __classPrivateFieldSet(this, _ExtraInfoBuilder_webBundleInfo, info, "f");
        this.updateFinalRequest();
    }
    setWebBundleInnerRequestInfo(info) {
        __classPrivateFieldSet(this, _ExtraInfoBuilder_webBundleInnerRequestInfo, info, "f");
        this.updateFinalRequest();
    }
    finished() {
        __classPrivateFieldSet(this, _ExtraInfoBuilder_finished, true, "f");
        // We may have missed responseReceived event in case of failure.
        // That said, the ExtraInfo events still may be here, so mark them
        // as present. Event if they are not, this is harmless.
        // TODO(caseq): consider if we need to report hasExtraInfo in the
        // loadingFailed event.
        if (__classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfoFlag, "f").length < __classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f").length) {
            __classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfoFlag, "f").push(true);
            this.sync(__classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfoFlag, "f").length - 1);
        }
        console.assert(__classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f").length === __classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfoFlag, "f").length, 'request/response count mismatch when request finished');
        this.updateFinalRequest();
    }
    isFinished() {
        return __classPrivateFieldGet(this, _ExtraInfoBuilder_finished, "f");
    }
    sync(index) {
        const req = __classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f")[index];
        if (!req) {
            return;
        }
        // No response yet, so we don't know if extra info would
        // be there, bail out for now.
        if (index >= __classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfoFlag, "f").length) {
            return;
        }
        if (!__classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfoFlag, "f")[index]) {
            return;
        }
        const requestExtraInfo = __classPrivateFieldGet(this, _ExtraInfoBuilder_requestExtraInfos, "f")[index];
        if (requestExtraInfo) {
            req.addExtraRequestInfo(requestExtraInfo);
            __classPrivateFieldGet(this, _ExtraInfoBuilder_requestExtraInfos, "f")[index] = null;
        }
        const responseExtraInfo = __classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfos, "f")[index];
        if (responseExtraInfo) {
            req.addExtraResponseInfo(responseExtraInfo);
            __classPrivateFieldGet(this, _ExtraInfoBuilder_responseExtraInfos, "f")[index] = null;
        }
    }
    finalRequest() {
        if (!__classPrivateFieldGet(this, _ExtraInfoBuilder_finished, "f")) {
            return null;
        }
        return __classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f")[__classPrivateFieldGet(this, _ExtraInfoBuilder_requests, "f").length - 1] || null;
    }
    updateFinalRequest() {
        if (!__classPrivateFieldGet(this, _ExtraInfoBuilder_finished, "f")) {
            return;
        }
        const finalRequest = this.finalRequest();
        finalRequest?.setWebBundleInfo(__classPrivateFieldGet(this, _ExtraInfoBuilder_webBundleInfo, "f"));
        finalRequest?.setWebBundleInnerRequestInfo(__classPrivateFieldGet(this, _ExtraInfoBuilder_webBundleInnerRequestInfo, "f"));
        finalRequest?.setEarlyHintsHeaders(__classPrivateFieldGet(this, _ExtraInfoBuilder_responseEarlyHintsHeaders, "f"));
    }
}
_ExtraInfoBuilder_requests = new WeakMap(), _ExtraInfoBuilder_responseExtraInfoFlag = new WeakMap(), _ExtraInfoBuilder_requestExtraInfos = new WeakMap(), _ExtraInfoBuilder_responseExtraInfos = new WeakMap(), _ExtraInfoBuilder_responseEarlyHintsHeaders = new WeakMap(), _ExtraInfoBuilder_finished = new WeakMap(), _ExtraInfoBuilder_webBundleInfo = new WeakMap(), _ExtraInfoBuilder_webBundleInnerRequestInfo = new WeakMap();
SDKModel.register(NetworkManager, { capabilities: 16 /* Capability.NETWORK */, autostart: true });
export function networkConditionsEqual(first, second) {
    // Caution: titles might be different function instances, which produce
    // the same value.
    // We prefer to use the i18nTitleKey to prevent against locale changes or
    // UIString changes that might change the value vs what the user has stored
    // locally.
    const firstTitle = first.i18nTitleKey || (typeof first.title === 'function' ? first.title() : first.title);
    const secondTitle = second.i18nTitleKey || (typeof second.title === 'function' ? second.title() : second.title);
    return second.download === first.download && second.upload === first.upload && second.latency === first.latency &&
        first.packetLoss === second.packetLoss && first.packetQueueLength === second.packetQueueLength &&
        first.packetReordering === second.packetReordering && secondTitle === firstTitle;
}
/**
 * IMPORTANT: this key is used as the value that is persisted so we remember
 * the user's throttling settings
 *
 * This means that it is very important that;
 * 1. Each Conditions that is defined must have a unique key.
 * 2. The keys & values DO NOT CHANGE for a particular condition, else we might break
 *    DevTools when restoring a user's persisted setting.
 *
 * If you do want to change them, you need to handle that in a migration, but
 * please talk to jacktfranklin@ first.
 */
export var PredefinedThrottlingConditionKey;
(function (PredefinedThrottlingConditionKey) {
    PredefinedThrottlingConditionKey["NO_THROTTLING"] = "NO_THROTTLING";
    PredefinedThrottlingConditionKey["OFFLINE"] = "OFFLINE";
    PredefinedThrottlingConditionKey["SPEED_3G"] = "SPEED_3G";
    PredefinedThrottlingConditionKey["SPEED_SLOW_4G"] = "SPEED_SLOW_4G";
    PredefinedThrottlingConditionKey["SPEED_FAST_4G"] = "SPEED_FAST_4G";
})(PredefinedThrottlingConditionKey || (PredefinedThrottlingConditionKey = {}));
export const THROTTLING_CONDITIONS_LOOKUP = new Map([
    ["NO_THROTTLING" /* PredefinedThrottlingConditionKey.NO_THROTTLING */, NoThrottlingConditions],
    ["OFFLINE" /* PredefinedThrottlingConditionKey.OFFLINE */, OfflineConditions],
    ["SPEED_3G" /* PredefinedThrottlingConditionKey.SPEED_3G */, Slow3GConditions],
    ["SPEED_SLOW_4G" /* PredefinedThrottlingConditionKey.SPEED_SLOW_4G */, Slow4GConditions],
    ["SPEED_FAST_4G" /* PredefinedThrottlingConditionKey.SPEED_FAST_4G */, Fast4GConditions]
]);
function keyIsPredefined(key) {
    return !key.startsWith('USER_CUSTOM_SETTING_');
}
export function keyIsCustomUser(key) {
    return key.startsWith('USER_CUSTOM_SETTING_');
}
export function getPredefinedCondition(key) {
    if (!keyIsPredefined(key)) {
        return null;
    }
    return THROTTLING_CONDITIONS_LOOKUP.get(key) ?? null;
}
//# sourceMappingURL=NetworkManager.js.map