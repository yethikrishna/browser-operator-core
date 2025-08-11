/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
var _NetworkLog_requests, _NetworkLog_sentNetworkRequests, _NetworkLog_receivedNetworkResponses, _NetworkLog_requestsSet, _NetworkLog_requestsMap, _NetworkLog_pageLoadForManager, _NetworkLog_unresolvedPreflightRequests, _NetworkLog_modelListeners, _NetworkLog_initiatorData, _NetworkLog_isRecording;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
const UIStrings = {
    /**
     * @description When DevTools doesn't know the URL that initiated a network request, we
     * show this phrase instead. 'unknown' would also work in this context.
     */
    anonymous: '<anonymous>',
};
const str_ = i18n.i18n.registerUIStrings('models/logs/NetworkLog.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
let networkLogInstance;
export class NetworkLog extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _NetworkLog_requests.set(this, []);
        _NetworkLog_sentNetworkRequests.set(this, []);
        _NetworkLog_receivedNetworkResponses.set(this, []);
        _NetworkLog_requestsSet.set(this, new Set());
        _NetworkLog_requestsMap.set(this, new Map());
        _NetworkLog_pageLoadForManager.set(this, new Map());
        _NetworkLog_unresolvedPreflightRequests.set(this, new Map());
        _NetworkLog_modelListeners.set(this, new WeakMap());
        _NetworkLog_initiatorData.set(this, new WeakMap());
        _NetworkLog_isRecording.set(this, true);
        SDK.TargetManager.TargetManager.instance().observeModels(SDK.NetworkManager.NetworkManager, this);
        const recordLogSetting = Common.Settings.Settings.instance().moduleSetting('network-log.record-log');
        recordLogSetting.addChangeListener(() => {
            const preserveLogSetting = Common.Settings.Settings.instance().moduleSetting('network-log.preserve-log');
            if (!preserveLogSetting.get() && recordLogSetting.get()) {
                this.reset(true);
            }
            this.setIsRecording((recordLogSetting.get()));
        }, this);
    }
    static instance() {
        if (!networkLogInstance) {
            networkLogInstance = new NetworkLog();
        }
        return networkLogInstance;
    }
    static removeInstance() {
        networkLogInstance = undefined;
    }
    modelAdded(networkManager) {
        const eventListeners = [];
        eventListeners.push(networkManager.addEventListener(SDK.NetworkManager.Events.RequestStarted, this.onRequestStarted, this));
        eventListeners.push(networkManager.addEventListener(SDK.NetworkManager.Events.RequestUpdated, this.onRequestUpdated, this));
        eventListeners.push(networkManager.addEventListener(SDK.NetworkManager.Events.RequestRedirected, this.onRequestRedirect, this));
        eventListeners.push(networkManager.addEventListener(SDK.NetworkManager.Events.RequestFinished, this.onRequestUpdated, this));
        eventListeners.push(networkManager.addEventListener(SDK.NetworkManager.Events.MessageGenerated, this.networkMessageGenerated.bind(this, networkManager)));
        eventListeners.push(networkManager.addEventListener(SDK.NetworkManager.Events.ResponseReceived, this.onResponseReceived, this));
        const resourceTreeModel = networkManager.target().model(SDK.ResourceTreeModel.ResourceTreeModel);
        if (resourceTreeModel) {
            eventListeners.push(resourceTreeModel.addEventListener(SDK.ResourceTreeModel.Events.WillReloadPage, this.willReloadPage, this));
            eventListeners.push(resourceTreeModel.addEventListener(SDK.ResourceTreeModel.Events.PrimaryPageChanged, this.onPrimaryPageChanged, this));
            eventListeners.push(resourceTreeModel.addEventListener(SDK.ResourceTreeModel.Events.Load, this.onLoad, this));
            eventListeners.push(resourceTreeModel.addEventListener(SDK.ResourceTreeModel.Events.DOMContentLoaded, this.onDOMContentLoaded.bind(this, resourceTreeModel)));
        }
        __classPrivateFieldGet(this, _NetworkLog_modelListeners, "f").set(networkManager, eventListeners);
    }
    modelRemoved(networkManager) {
        this.removeNetworkManagerListeners(networkManager);
    }
    removeNetworkManagerListeners(networkManager) {
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _NetworkLog_modelListeners, "f").get(networkManager) || []);
    }
    setIsRecording(enabled) {
        if (__classPrivateFieldGet(this, _NetworkLog_isRecording, "f") === enabled) {
            return;
        }
        __classPrivateFieldSet(this, _NetworkLog_isRecording, enabled, "f");
        if (enabled) {
            SDK.TargetManager.TargetManager.instance().observeModels(SDK.NetworkManager.NetworkManager, this);
        }
        else {
            SDK.TargetManager.TargetManager.instance().unobserveModels(SDK.NetworkManager.NetworkManager, this);
            SDK.TargetManager.TargetManager.instance()
                .models(SDK.NetworkManager.NetworkManager)
                .forEach(this.removeNetworkManagerListeners.bind(this));
        }
    }
    requestForURL(url) {
        return __classPrivateFieldGet(this, _NetworkLog_requests, "f").find(request => request.url() === url) || null;
    }
    originalRequestForURL(url) {
        return __classPrivateFieldGet(this, _NetworkLog_sentNetworkRequests, "f").find(request => request.url === url) || null;
    }
    originalResponseForURL(url) {
        return __classPrivateFieldGet(this, _NetworkLog_receivedNetworkResponses, "f").find(response => response.url === url) || null;
    }
    requests() {
        return __classPrivateFieldGet(this, _NetworkLog_requests, "f");
    }
    requestByManagerAndId(networkManager, requestId) {
        // We iterate backwards because the last item will likely be the one needed for console network request lookups.
        for (let i = __classPrivateFieldGet(this, _NetworkLog_requests, "f").length - 1; i >= 0; i--) {
            const request = __classPrivateFieldGet(this, _NetworkLog_requests, "f")[i];
            if (requestId === request.requestId() &&
                networkManager === SDK.NetworkManager.NetworkManager.forRequest(request)) {
                return request;
            }
        }
        return null;
    }
    requestByManagerAndURL(networkManager, url) {
        for (const request of __classPrivateFieldGet(this, _NetworkLog_requests, "f")) {
            if (url === request.url() && networkManager === SDK.NetworkManager.NetworkManager.forRequest(request)) {
                return request;
            }
        }
        return null;
    }
    initializeInitiatorSymbolIfNeeded(request) {
        let initiatorInfo = __classPrivateFieldGet(this, _NetworkLog_initiatorData, "f").get(request);
        if (initiatorInfo) {
            return initiatorInfo;
        }
        initiatorInfo = {
            info: null,
            chain: null,
            request: undefined,
        };
        __classPrivateFieldGet(this, _NetworkLog_initiatorData, "f").set(request, initiatorInfo);
        return initiatorInfo;
    }
    static initiatorInfoForRequest(request, existingInitiatorData) {
        const initiatorInfo = existingInitiatorData || {
            info: null,
            chain: null,
            request: undefined,
        };
        let type = "other" /* SDK.NetworkRequest.InitiatorType.OTHER */;
        let url = Platform.DevToolsPath.EmptyUrlString;
        let lineNumber = undefined;
        let columnNumber = undefined;
        let scriptId = null;
        let initiatorStack = null;
        let initiatorRequest = null;
        const initiator = request.initiator();
        const redirectSource = request.redirectSource();
        if (redirectSource) {
            type = "redirect" /* SDK.NetworkRequest.InitiatorType.REDIRECT */;
            url = redirectSource.url();
        }
        else if (initiator) {
            if (initiator.type === "parser" /* Protocol.Network.InitiatorType.Parser */) {
                type = "parser" /* SDK.NetworkRequest.InitiatorType.PARSER */;
                url = initiator.url ? initiator.url : url;
                lineNumber = initiator.lineNumber;
                columnNumber = initiator.columnNumber;
            }
            else if (initiator.type === "script" /* Protocol.Network.InitiatorType.Script */) {
                for (let stack = initiator.stack; stack;) {
                    const topFrame = stack.callFrames.length ? stack.callFrames[0] : null;
                    if (!topFrame) {
                        stack = stack.parent;
                        continue;
                    }
                    type = "script" /* SDK.NetworkRequest.InitiatorType.SCRIPT */;
                    url = (topFrame.url || i18nString(UIStrings.anonymous));
                    lineNumber = topFrame.lineNumber;
                    columnNumber = topFrame.columnNumber;
                    scriptId = topFrame.scriptId;
                    break;
                }
                if (!initiator.stack && initiator.url) {
                    type = "script" /* SDK.NetworkRequest.InitiatorType.SCRIPT */;
                    url = initiator.url;
                    lineNumber = initiator.lineNumber;
                }
                if (initiator.stack?.callFrames?.length) {
                    initiatorStack = initiator.stack;
                }
            }
            else if (initiator.type === "preload" /* Protocol.Network.InitiatorType.Preload */) {
                type = "preload" /* SDK.NetworkRequest.InitiatorType.PRELOAD */;
            }
            else if (initiator.type === "preflight" /* Protocol.Network.InitiatorType.Preflight */) {
                type = "preflight" /* SDK.NetworkRequest.InitiatorType.PREFLIGHT */;
                initiatorRequest = request.preflightInitiatorRequest();
            }
            else if (initiator.type === "SignedExchange" /* Protocol.Network.InitiatorType.SignedExchange */) {
                type = "signedExchange" /* SDK.NetworkRequest.InitiatorType.SIGNED_EXCHANGE */;
                url = initiator.url || Platform.DevToolsPath.EmptyUrlString;
            }
        }
        initiatorInfo.info = { type, url, lineNumber, columnNumber, scriptId, stack: initiatorStack, initiatorRequest };
        return initiatorInfo.info;
    }
    initiatorInfoForRequest(request) {
        const initiatorInfo = this.initializeInitiatorSymbolIfNeeded(request);
        if (initiatorInfo.info) {
            return initiatorInfo.info;
        }
        return NetworkLog.initiatorInfoForRequest(request, initiatorInfo);
    }
    initiatorGraphForRequest(request) {
        const initiated = new Map();
        const networkManager = SDK.NetworkManager.NetworkManager.forRequest(request);
        for (const otherRequest of __classPrivateFieldGet(this, _NetworkLog_requests, "f")) {
            const otherRequestManager = SDK.NetworkManager.NetworkManager.forRequest(otherRequest);
            if (networkManager === otherRequestManager && this.initiatorChain(otherRequest).has(request)) {
                // save parent request of otherRequst in order to build the initiator chain table later
                const initiatorRequest = this.initiatorRequest(otherRequest);
                if (initiatorRequest) {
                    initiated.set(otherRequest, initiatorRequest);
                }
            }
        }
        return { initiators: this.initiatorChain(request), initiated };
    }
    initiatorChain(request) {
        const initiatorDataForRequest = this.initializeInitiatorSymbolIfNeeded(request);
        let initiatorChainCache = initiatorDataForRequest.chain;
        if (initiatorChainCache) {
            return initiatorChainCache;
        }
        initiatorChainCache = new Set();
        let checkRequest = request;
        while (checkRequest) {
            const initiatorData = this.initializeInitiatorSymbolIfNeeded(checkRequest);
            if (initiatorData.chain) {
                initiatorChainCache = initiatorChainCache.union(initiatorData.chain);
                break;
            }
            if (initiatorChainCache.has(checkRequest)) {
                break;
            }
            initiatorChainCache.add(checkRequest);
            checkRequest = this.initiatorRequest(checkRequest);
        }
        initiatorDataForRequest.chain = initiatorChainCache;
        return initiatorChainCache;
    }
    initiatorRequest(request) {
        const initiatorData = this.initializeInitiatorSymbolIfNeeded(request);
        if (initiatorData.request !== undefined) {
            return initiatorData.request;
        }
        const url = this.initiatorInfoForRequest(request).url;
        const networkManager = SDK.NetworkManager.NetworkManager.forRequest(request);
        initiatorData.request = networkManager ? this.requestByManagerAndURL(networkManager, url) : null;
        return initiatorData.request;
    }
    willReloadPage() {
        if (!Common.Settings.Settings.instance().moduleSetting('network-log.preserve-log').get()) {
            this.reset(true);
        }
    }
    onPrimaryPageChanged(event) {
        const mainFrame = event.data.frame;
        const manager = mainFrame.resourceTreeModel().target().model(SDK.NetworkManager.NetworkManager);
        if (!manager || mainFrame.resourceTreeModel().target().parentTarget()?.type() === SDK.Target.Type.FRAME) {
            return;
        }
        // If a page resulted in an error, the browser will navigate to an internal error page
        // hosted at 'chrome-error://...'. In this case, skip the frame navigated event to preserve
        // the network log.
        if (mainFrame.url !== mainFrame.unreachableUrl() && Common.ParsedURL.schemeIs(mainFrame.url, 'chrome-error:')) {
            return;
        }
        const preserveLog = Common.Settings.Settings.instance().moduleSetting('network-log.preserve-log').get();
        const oldRequests = __classPrivateFieldGet(this, _NetworkLog_requests, "f");
        const oldManagerRequests = __classPrivateFieldGet(this, _NetworkLog_requests, "f").filter(request => SDK.NetworkManager.NetworkManager.forRequest(request) === manager);
        const oldRequestsSet = __classPrivateFieldGet(this, _NetworkLog_requestsSet, "f");
        __classPrivateFieldSet(this, _NetworkLog_requests, [], "f");
        __classPrivateFieldSet(this, _NetworkLog_sentNetworkRequests, [], "f");
        __classPrivateFieldSet(this, _NetworkLog_receivedNetworkResponses, [], "f");
        __classPrivateFieldSet(this, _NetworkLog_requestsSet, new Set(), "f");
        __classPrivateFieldGet(this, _NetworkLog_requestsMap, "f").clear();
        __classPrivateFieldGet(this, _NetworkLog_unresolvedPreflightRequests, "f").clear();
        this.dispatchEventToListeners(Events.Reset, { clearIfPreserved: !preserveLog });
        // Preserve requests from the new session.
        let currentPageLoad = null;
        const requestsToAdd = [];
        for (const request of oldManagerRequests) {
            if (event.data.type !== "Activation" /* SDK.ResourceTreeModel.PrimaryPageChangeType.ACTIVATION */ &&
                request.loaderId !== mainFrame.loaderId) {
                continue;
            }
            if (!currentPageLoad) {
                currentPageLoad = new SDK.PageLoad.PageLoad(request);
                let redirectSource = request.redirectSource();
                while (redirectSource) {
                    requestsToAdd.push(redirectSource);
                    redirectSource = redirectSource.redirectSource();
                }
            }
            requestsToAdd.push(request);
        }
        // Preserve service worker requests from the new session.
        const serviceWorkerRequestsToAdd = [];
        for (const swRequest of oldRequests) {
            if (!swRequest.initiatedByServiceWorker()) {
                continue;
            }
            // If there is a matching request that came before this one, keep it.
            const keepRequest = requestsToAdd.some(request => request.url() === swRequest.url() && request.issueTime() <= swRequest.issueTime());
            if (keepRequest) {
                serviceWorkerRequestsToAdd.push(swRequest);
            }
        }
        requestsToAdd.push(...serviceWorkerRequestsToAdd);
        for (const request of requestsToAdd) {
            currentPageLoad?.bindRequest(request);
            oldRequestsSet.delete(request);
            this.addRequest(request);
        }
        if (preserveLog) {
            for (const request of oldRequestsSet) {
                this.addRequest(request, true);
                request.preserved = true;
            }
        }
        if (currentPageLoad) {
            __classPrivateFieldGet(this, _NetworkLog_pageLoadForManager, "f").set(manager, currentPageLoad);
        }
    }
    addRequest(request, preserveLog) {
        __classPrivateFieldGet(this, _NetworkLog_requests, "f").push(request);
        __classPrivateFieldGet(this, _NetworkLog_requestsSet, "f").add(request);
        const requestList = __classPrivateFieldGet(this, _NetworkLog_requestsMap, "f").get(request.requestId());
        if (!requestList) {
            __classPrivateFieldGet(this, _NetworkLog_requestsMap, "f").set(request.requestId(), [request]);
        }
        else {
            requestList.push(request);
        }
        this.tryResolvePreflightRequests(request);
        this.dispatchEventToListeners(Events.RequestAdded, { request, preserveLog });
    }
    removeRequest(request) {
        const index = __classPrivateFieldGet(this, _NetworkLog_requests, "f").indexOf(request);
        if (index > -1) {
            __classPrivateFieldGet(this, _NetworkLog_requests, "f").splice(index, 1);
        }
        __classPrivateFieldGet(this, _NetworkLog_requestsSet, "f").delete(request);
        __classPrivateFieldGet(this, _NetworkLog_requestsMap, "f").delete(request.requestId());
        this.dispatchEventToListeners(Events.RequestRemoved, { request });
    }
    tryResolvePreflightRequests(request) {
        if (request.isPreflightRequest()) {
            const initiator = request.initiator();
            if (initiator && initiator.requestId) {
                const [initiatorRequest] = this.requestsForId(initiator.requestId);
                if (initiatorRequest) {
                    request.setPreflightInitiatorRequest(initiatorRequest);
                    initiatorRequest.setPreflightRequest(request);
                }
                else {
                    __classPrivateFieldGet(this, _NetworkLog_unresolvedPreflightRequests, "f").set(initiator.requestId, request);
                }
            }
        }
        else {
            const preflightRequest = __classPrivateFieldGet(this, _NetworkLog_unresolvedPreflightRequests, "f").get(request.requestId());
            if (preflightRequest) {
                __classPrivateFieldGet(this, _NetworkLog_unresolvedPreflightRequests, "f").delete(request.requestId());
                request.setPreflightRequest(preflightRequest);
                preflightRequest.setPreflightInitiatorRequest(request);
                // Force recomputation of initiator info, if it already exists.
                const data = __classPrivateFieldGet(this, _NetworkLog_initiatorData, "f").get(preflightRequest);
                if (data) {
                    data.info = null;
                }
                this.dispatchEventToListeners(Events.RequestUpdated, { request: preflightRequest });
            }
        }
    }
    importRequests(requests) {
        this.reset(true);
        __classPrivateFieldSet(this, _NetworkLog_requests, [], "f");
        __classPrivateFieldSet(this, _NetworkLog_sentNetworkRequests, [], "f");
        __classPrivateFieldSet(this, _NetworkLog_receivedNetworkResponses, [], "f");
        __classPrivateFieldGet(this, _NetworkLog_requestsSet, "f").clear();
        __classPrivateFieldGet(this, _NetworkLog_requestsMap, "f").clear();
        __classPrivateFieldGet(this, _NetworkLog_unresolvedPreflightRequests, "f").clear();
        for (const request of requests) {
            this.addRequest(request);
        }
    }
    onRequestStarted(event) {
        const { request, originalRequest } = event.data;
        if (originalRequest) {
            __classPrivateFieldGet(this, _NetworkLog_sentNetworkRequests, "f").push(originalRequest);
        }
        __classPrivateFieldGet(this, _NetworkLog_requestsSet, "f").add(request);
        const manager = SDK.NetworkManager.NetworkManager.forRequest(request);
        const pageLoad = manager ? __classPrivateFieldGet(this, _NetworkLog_pageLoadForManager, "f").get(manager) : null;
        if (pageLoad) {
            pageLoad.bindRequest(request);
        }
        this.addRequest(request);
    }
    onResponseReceived(event) {
        const response = event.data.response;
        __classPrivateFieldGet(this, _NetworkLog_receivedNetworkResponses, "f").push(response);
    }
    onRequestUpdated(event) {
        const request = event.data;
        if (!__classPrivateFieldGet(this, _NetworkLog_requestsSet, "f").has(request)) {
            return;
        }
        // This is only triggered in an edge case in which Chrome reports 2 preflight requests. The
        // first preflight gets aborted and should not be shown in DevTools.
        // (see https://crbug.com/1290390 for details)
        if (request.isPreflightRequest() &&
            request.corsErrorStatus()?.corsError === "UnexpectedPrivateNetworkAccess" /* Protocol.Network.CorsError.UnexpectedPrivateNetworkAccess */) {
            this.removeRequest(request);
            return;
        }
        this.dispatchEventToListeners(Events.RequestUpdated, { request });
    }
    onRequestRedirect(event) {
        __classPrivateFieldGet(this, _NetworkLog_initiatorData, "f").delete(event.data);
    }
    onDOMContentLoaded(resourceTreeModel, event) {
        const networkManager = resourceTreeModel.target().model(SDK.NetworkManager.NetworkManager);
        const pageLoad = networkManager ? __classPrivateFieldGet(this, _NetworkLog_pageLoadForManager, "f").get(networkManager) : null;
        if (pageLoad) {
            pageLoad.contentLoadTime = event.data;
        }
    }
    onLoad(event) {
        const networkManager = event.data.resourceTreeModel.target().model(SDK.NetworkManager.NetworkManager);
        const pageLoad = networkManager ? __classPrivateFieldGet(this, _NetworkLog_pageLoadForManager, "f").get(networkManager) : null;
        if (pageLoad) {
            pageLoad.loadTime = event.data.loadTime;
        }
    }
    reset(clearIfPreserved) {
        __classPrivateFieldSet(this, _NetworkLog_requests, [], "f");
        __classPrivateFieldSet(this, _NetworkLog_sentNetworkRequests, [], "f");
        __classPrivateFieldSet(this, _NetworkLog_receivedNetworkResponses, [], "f");
        __classPrivateFieldGet(this, _NetworkLog_requestsSet, "f").clear();
        __classPrivateFieldGet(this, _NetworkLog_requestsMap, "f").clear();
        __classPrivateFieldGet(this, _NetworkLog_unresolvedPreflightRequests, "f").clear();
        const managers = new Set(SDK.TargetManager.TargetManager.instance().models(SDK.NetworkManager.NetworkManager));
        for (const manager of __classPrivateFieldGet(this, _NetworkLog_pageLoadForManager, "f").keys()) {
            if (!managers.has(manager)) {
                __classPrivateFieldGet(this, _NetworkLog_pageLoadForManager, "f").delete(manager);
            }
        }
        this.dispatchEventToListeners(Events.Reset, { clearIfPreserved });
    }
    networkMessageGenerated(networkManager, event) {
        const { message, warning, requestId } = event.data;
        const consoleMessage = new SDK.ConsoleModel.ConsoleMessage(networkManager.target().model(SDK.RuntimeModel.RuntimeModel), "network" /* Protocol.Log.LogEntrySource.Network */, warning ? "warning" /* Protocol.Log.LogEntryLevel.Warning */ : "info" /* Protocol.Log.LogEntryLevel.Info */, message);
        this.associateConsoleMessageWithRequest(consoleMessage, requestId);
        networkManager.target().model(SDK.ConsoleModel.ConsoleModel)?.addMessage(consoleMessage);
    }
    associateConsoleMessageWithRequest(consoleMessage, requestId) {
        const target = consoleMessage.target();
        const networkManager = target ? target.model(SDK.NetworkManager.NetworkManager) : null;
        if (!networkManager) {
            return;
        }
        const request = this.requestByManagerAndId(networkManager, requestId);
        if (!request) {
            return;
        }
        consoleMessageToRequest.set(consoleMessage, request);
        const initiator = request.initiator();
        if (initiator) {
            consoleMessage.stackTrace = initiator.stack || undefined;
            if (initiator.url) {
                consoleMessage.url = initiator.url;
                consoleMessage.line = initiator.lineNumber || 0;
            }
        }
    }
    static requestForConsoleMessage(consoleMessage) {
        return consoleMessageToRequest.get(consoleMessage) || null;
    }
    requestsForId(requestId) {
        return __classPrivateFieldGet(this, _NetworkLog_requestsMap, "f").get(requestId) || [];
    }
}
_NetworkLog_requests = new WeakMap(), _NetworkLog_sentNetworkRequests = new WeakMap(), _NetworkLog_receivedNetworkResponses = new WeakMap(), _NetworkLog_requestsSet = new WeakMap(), _NetworkLog_requestsMap = new WeakMap(), _NetworkLog_pageLoadForManager = new WeakMap(), _NetworkLog_unresolvedPreflightRequests = new WeakMap(), _NetworkLog_modelListeners = new WeakMap(), _NetworkLog_initiatorData = new WeakMap(), _NetworkLog_isRecording = new WeakMap();
const consoleMessageToRequest = new WeakMap();
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["Reset"] = "Reset";
    Events["RequestAdded"] = "RequestAdded";
    Events["RequestUpdated"] = "RequestUpdated";
    Events["RequestRemoved"] = "RequestRemoved";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
//# sourceMappingURL=NetworkLog.js.map