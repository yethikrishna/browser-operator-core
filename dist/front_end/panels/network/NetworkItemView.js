/*
 * Copyright (C) 2010 Google Inc. All rights reserved.
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
var _NetworkItemView_request, _NetworkItemView_resourceViewTabSetting, _NetworkItemView_headersViewComponent, _NetworkItemView_payloadView, _NetworkItemView_responseView, _NetworkItemView_cookiesView, _NetworkItemView_initialTab, _NetworkItemView_firstTab;
/* eslint-disable rulesdir/no-imperative-dom-api */
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as NetworkForward from '../../panels/network/forward/forward.js';
import * as IconButton from '../../ui/components/icon_button/icon_button.js';
import * as LegacyWrapper from '../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as NetworkComponents from './components/components.js';
import { EventSourceMessagesView } from './EventSourceMessagesView.js';
import { RequestCookiesView } from './RequestCookiesView.js';
import { RequestInitiatorView } from './RequestInitiatorView.js';
import { RequestPayloadView } from './RequestPayloadView.js';
import { RequestPreviewView } from './RequestPreviewView.js';
import { RequestResponseView } from './RequestResponseView.js';
import { RequestTimingView } from './RequestTimingView.js';
import { ResourceDirectSocketChunkView } from './ResourceDirectSocketChunkView.js';
import { ResourceWebSocketFrameView } from './ResourceWebSocketFrameView.js';
const UIStrings = {
    /**
     *@description Text for network request headers
     */
    headers: 'Headers',
    /**
     *@description Text for network connection info. In case the request is not made over http.
     */
    connectionInfo: 'Connection Info',
    /**
     *@description Text in Network Item View of the Network panel
     */
    payload: 'Payload',
    /**
     *@description Text in Network Item View of the Network panel
     */
    messages: 'Messages',
    /**
     *@description Text in Network Item View of the Network panel
     */
    websocketMessages: 'WebSocket messages',
    /**
     *@description Text in Network Item View of the Network panel
     */
    directsocketMessages: 'DirectSocket messages',
    /**
     *@description Text in Network Item View of the Network panel
     */
    eventstream: 'EventStream',
    /**
     *@description Text for previewing items
     */
    preview: 'Preview',
    /**
     *@description Text in Network Item View of the Network panel
     */
    responsePreview: 'Response preview',
    /**
     *@description Icon title in Network Item View of the Network panel
     */
    signedexchangeError: 'SignedExchange error',
    /**
     *@description Title of a tab in the Network panel. A Network response refers to the act of acknowledging a
    network request. Should not be confused with answer.
     */
    response: 'Response',
    /**
     *@description Text in Network Item View of the Network panel
     */
    rawResponseData: 'Raw response data',
    /**
     *@description Text for the initiator of something
     */
    initiator: 'Initiator',
    /**
     * @description Tooltip for initiator view in Network panel. An initiator is a piece of code/entity
     * in the code that initiated/started the network request, i.e. caused the network request. The 'call
     * stack' is the location in the code where the initiation happened.
     */
    requestInitiatorCallStack: 'Request initiator call stack',
    /**
     *@description Title of a tab in Network Item View of the Network panel.
     *The tab displays the duration breakdown of a network request.
     */
    timing: 'Timing',
    /**
     *@description Text in Network Item View of the Network panel
     */
    requestAndResponseTimeline: 'Request and response timeline',
    /**
     *@description Tooltip to explain the warning icon of the Cookies panel
     */
    thirdPartyPhaseout: 'Cookies blocked due to third-party cookie phaseout.',
    /**
     *@description Label of a tab in the network panel. Previously known as 'Trust Tokens'.
     */
    trustTokens: 'Private state tokens',
    /**
     *@description Title of the Private State Token tab in the Network panel. Previously known as 'Trust Token tab'.
     */
    trustTokenOperationDetails: 'Private State Token operation details',
    /**
     *@description Text for web cookies
     */
    cookies: 'Cookies',
    /**
     *@description Text in Network Item View of the Network panel
     */
    requestAndResponseCookies: 'Request and response cookies',
    /**
     *@description Tooltip text explaining that DevTools has overridden the response's headers
     */
    containsOverriddenHeaders: 'This response contains headers which are overridden by DevTools',
    /**
     *@description Tooltip text explaining that DevTools has overridden the response
     */
    responseIsOverridden: 'This response is overridden by DevTools',
};
const str_ = i18n.i18n.registerUIStrings('panels/network/NetworkItemView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const requestToResponseView = new WeakMap();
const requestToPreviewView = new WeakMap();
export class NetworkItemView extends UI.TabbedPane.TabbedPane {
    constructor(request, calculator, initialTab) {
        super();
        _NetworkItemView_request.set(this, void 0);
        _NetworkItemView_resourceViewTabSetting.set(this, void 0);
        _NetworkItemView_headersViewComponent.set(this, void 0);
        _NetworkItemView_payloadView.set(this, null);
        _NetworkItemView_responseView.set(this, void 0);
        _NetworkItemView_cookiesView.set(this, null);
        _NetworkItemView_initialTab.set(this, void 0);
        _NetworkItemView_firstTab.set(this, void 0);
        __classPrivateFieldSet(this, _NetworkItemView_request, request, "f");
        this.element.classList.add('network-item-view');
        this.headerElement().setAttribute('jslog', `${VisualLogging.toolbar('request-details').track({
            keydown: 'ArrowUp|ArrowLeft|ArrowDown|ArrowRight|Enter|Space',
        })}`);
        if (request.resourceType() === Common.ResourceType.resourceTypes.DirectSocket) {
            __classPrivateFieldSet(this, _NetworkItemView_firstTab, "direct-socket-connection" /* NetworkForward.UIRequestLocation.UIRequestTabs.DIRECT_SOCKET_CONNECTION */, "f");
            this.appendTab("direct-socket-connection" /* NetworkForward.UIRequestLocation.UIRequestTabs.DIRECT_SOCKET_CONNECTION */, i18nString(UIStrings.connectionInfo), new NetworkComponents.DirectSocketConnectionView.DirectSocketConnectionView(request), i18nString(UIStrings.headers));
        }
        else {
            __classPrivateFieldSet(this, _NetworkItemView_firstTab, "headers-component" /* NetworkForward.UIRequestLocation.UIRequestTabs.HEADERS_COMPONENT */, "f");
            __classPrivateFieldSet(this, _NetworkItemView_headersViewComponent, new NetworkComponents.RequestHeadersView.RequestHeadersView(request), "f");
            this.appendTab("headers-component" /* NetworkForward.UIRequestLocation.UIRequestTabs.HEADERS_COMPONENT */, i18nString(UIStrings.headers), LegacyWrapper.LegacyWrapper.legacyWrapper(UI.Widget.VBox, __classPrivateFieldGet(this, _NetworkItemView_headersViewComponent, "f")), i18nString(UIStrings.headers));
        }
        __classPrivateFieldSet(this, _NetworkItemView_resourceViewTabSetting, Common.Settings.Settings.instance().createSetting('resource-view-tab', __classPrivateFieldGet(this, _NetworkItemView_firstTab, "f")), "f");
        if (__classPrivateFieldGet(this, _NetworkItemView_request, "f").hasOverriddenHeaders()) {
            const statusDot = document.createElement('div');
            statusDot.className = 'status-dot';
            statusDot.title = i18nString(UIStrings.containsOverriddenHeaders);
            this.setSuffixElement("headers-component" /* NetworkForward.UIRequestLocation.UIRequestTabs.HEADERS_COMPONENT */, statusDot);
        }
        void this.maybeAppendPayloadPanel();
        this.addEventListener(UI.TabbedPane.Events.TabSelected, this.tabSelected, this);
        if (request.resourceType() === Common.ResourceType.resourceTypes.WebSocket) {
            const frameView = new ResourceWebSocketFrameView(request);
            this.appendTab("web-socket-frames" /* NetworkForward.UIRequestLocation.UIRequestTabs.WS_FRAMES */, i18nString(UIStrings.messages), frameView, i18nString(UIStrings.websocketMessages));
        }
        else if (request.resourceType() === Common.ResourceType.resourceTypes.DirectSocket) {
            this.appendTab("direct-socket-chunks" /* NetworkForward.UIRequestLocation.UIRequestTabs.DIRECT_SOCKET_CHUNKS */, i18nString(UIStrings.messages), new ResourceDirectSocketChunkView(request), i18nString(UIStrings.directsocketMessages));
        }
        else if (request.mimeType === "text/event-stream" /* Platform.MimeType.MimeType.EVENTSTREAM */) {
            this.appendTab("eventSource" /* NetworkForward.UIRequestLocation.UIRequestTabs.EVENT_SOURCE */, i18nString(UIStrings.eventstream), new EventSourceMessagesView(request));
            __classPrivateFieldSet(this, _NetworkItemView_responseView, requestToResponseView.get(request) ?? new RequestResponseView(request), "f");
            requestToResponseView.set(request, __classPrivateFieldGet(this, _NetworkItemView_responseView, "f"));
            this.appendTab("response" /* NetworkForward.UIRequestLocation.UIRequestTabs.RESPONSE */, i18nString(UIStrings.response), __classPrivateFieldGet(this, _NetworkItemView_responseView, "f"), i18nString(UIStrings.rawResponseData));
        }
        else {
            __classPrivateFieldSet(this, _NetworkItemView_responseView, requestToResponseView.get(request) ?? new RequestResponseView(request), "f");
            requestToResponseView.set(request, __classPrivateFieldGet(this, _NetworkItemView_responseView, "f"));
            const previewView = requestToPreviewView.get(request) ?? new RequestPreviewView(request);
            requestToPreviewView.set(request, previewView);
            this.appendTab("preview" /* NetworkForward.UIRequestLocation.UIRequestTabs.PREVIEW */, i18nString(UIStrings.preview), previewView, i18nString(UIStrings.responsePreview));
            const signedExchangeInfo = request.signedExchangeInfo();
            if (signedExchangeInfo?.errors?.length) {
                const icon = new IconButton.Icon.Icon();
                icon.data = { iconName: 'cross-circle-filled', color: 'var(--icon-error)', width: '14px', height: '14px' };
                UI.Tooltip.Tooltip.install(icon, i18nString(UIStrings.signedexchangeError));
                this.setTabIcon("preview" /* NetworkForward.UIRequestLocation.UIRequestTabs.PREVIEW */, icon);
            }
            this.appendTab("response" /* NetworkForward.UIRequestLocation.UIRequestTabs.RESPONSE */, i18nString(UIStrings.response), __classPrivateFieldGet(this, _NetworkItemView_responseView, "f"), i18nString(UIStrings.rawResponseData));
            if (__classPrivateFieldGet(this, _NetworkItemView_request, "f").hasOverriddenContent) {
                const statusDot = document.createElement('div');
                statusDot.className = 'status-dot';
                statusDot.title = i18nString(UIStrings.responseIsOverridden);
                this.setSuffixElement("response" /* NetworkForward.UIRequestLocation.UIRequestTabs.RESPONSE */, statusDot);
            }
        }
        this.appendTab("initiator" /* NetworkForward.UIRequestLocation.UIRequestTabs.INITIATOR */, i18nString(UIStrings.initiator), new RequestInitiatorView(request), i18nString(UIStrings.requestInitiatorCallStack));
        this.appendTab("timing" /* NetworkForward.UIRequestLocation.UIRequestTabs.TIMING */, i18nString(UIStrings.timing), new RequestTimingView(request, calculator), i18nString(UIStrings.requestAndResponseTimeline));
        if (request.trustTokenParams()) {
            this.appendTab("trust-tokens" /* NetworkForward.UIRequestLocation.UIRequestTabs.TRUST_TOKENS */, i18nString(UIStrings.trustTokens), LegacyWrapper.LegacyWrapper.legacyWrapper(UI.Widget.VBox, new NetworkComponents.RequestTrustTokensView.RequestTrustTokensView(request)), i18nString(UIStrings.trustTokenOperationDetails));
        }
        __classPrivateFieldSet(this, _NetworkItemView_initialTab, initialTab || __classPrivateFieldGet(this, _NetworkItemView_resourceViewTabSetting, "f").get(), "f");
        // Selecting tabs should not be handled by the super class.
        this.setAutoSelectFirstItemOnShow(false);
    }
    wasShown() {
        super.wasShown();
        __classPrivateFieldGet(this, _NetworkItemView_request, "f").addEventListener(SDK.NetworkRequest.Events.REQUEST_HEADERS_CHANGED, this.requestHeadersChanged, this);
        __classPrivateFieldGet(this, _NetworkItemView_request, "f").addEventListener(SDK.NetworkRequest.Events.RESPONSE_HEADERS_CHANGED, this.maybeAppendCookiesPanel, this);
        __classPrivateFieldGet(this, _NetworkItemView_request, "f").addEventListener(SDK.NetworkRequest.Events.TRUST_TOKEN_RESULT_ADDED, this.maybeShowErrorIconInTrustTokenTabHeader, this);
        this.maybeAppendCookiesPanel();
        this.maybeShowErrorIconInTrustTokenTabHeader();
        // Only select the initial tab the first time the view is shown after construction.
        // When the view is re-shown (without re-constructing) users or revealers might have changed
        // the selected tab in the mean time. Show the previously selected tab in that
        // case instead, by simply doing nohting.
        if (__classPrivateFieldGet(this, _NetworkItemView_initialTab, "f")) {
            this.selectTabInternal(__classPrivateFieldGet(this, _NetworkItemView_initialTab, "f"));
            __classPrivateFieldSet(this, _NetworkItemView_initialTab, undefined, "f");
        }
    }
    willHide() {
        __classPrivateFieldGet(this, _NetworkItemView_request, "f").removeEventListener(SDK.NetworkRequest.Events.REQUEST_HEADERS_CHANGED, this.requestHeadersChanged, this);
        __classPrivateFieldGet(this, _NetworkItemView_request, "f").removeEventListener(SDK.NetworkRequest.Events.RESPONSE_HEADERS_CHANGED, this.maybeAppendCookiesPanel, this);
        __classPrivateFieldGet(this, _NetworkItemView_request, "f").removeEventListener(SDK.NetworkRequest.Events.TRUST_TOKEN_RESULT_ADDED, this.maybeShowErrorIconInTrustTokenTabHeader, this);
    }
    async requestHeadersChanged() {
        this.maybeAppendCookiesPanel();
        void this.maybeAppendPayloadPanel();
    }
    maybeAppendCookiesPanel() {
        const cookiesPresent = __classPrivateFieldGet(this, _NetworkItemView_request, "f").hasRequestCookies() || __classPrivateFieldGet(this, _NetworkItemView_request, "f").responseCookies.length > 0;
        console.assert(cookiesPresent || !__classPrivateFieldGet(this, _NetworkItemView_cookiesView, "f"), 'Cookies were introduced in headers and then removed!');
        if (cookiesPresent && !__classPrivateFieldGet(this, _NetworkItemView_cookiesView, "f")) {
            __classPrivateFieldSet(this, _NetworkItemView_cookiesView, new RequestCookiesView(__classPrivateFieldGet(this, _NetworkItemView_request, "f")), "f");
            this.appendTab("cookies" /* NetworkForward.UIRequestLocation.UIRequestTabs.COOKIES */, i18nString(UIStrings.cookies), __classPrivateFieldGet(this, _NetworkItemView_cookiesView, "f"), i18nString(UIStrings.requestAndResponseCookies));
        }
        if (__classPrivateFieldGet(this, _NetworkItemView_request, "f").hasThirdPartyCookiePhaseoutIssue()) {
            const icon = new IconButton.Icon.Icon();
            icon.data = { iconName: 'warning-filled', color: 'var(--icon-warning)', width: '14px', height: '14px' };
            icon.title = i18nString(UIStrings.thirdPartyPhaseout);
            this.setTrailingTabIcon("cookies" /* NetworkForward.UIRequestLocation.UIRequestTabs.COOKIES */, icon);
        }
    }
    async maybeAppendPayloadPanel() {
        if (this.hasTab('payload')) {
            return;
        }
        if (__classPrivateFieldGet(this, _NetworkItemView_request, "f").queryParameters || await __classPrivateFieldGet(this, _NetworkItemView_request, "f").requestFormData()) {
            __classPrivateFieldSet(this, _NetworkItemView_payloadView, new RequestPayloadView(__classPrivateFieldGet(this, _NetworkItemView_request, "f")), "f");
            this.appendTab("payload" /* NetworkForward.UIRequestLocation.UIRequestTabs.PAYLOAD */, i18nString(UIStrings.payload), __classPrivateFieldGet(this, _NetworkItemView_payloadView, "f"), i18nString(UIStrings.payload), /* userGesture=*/ void 0, 
            /* isCloseable=*/ void 0, /* isPreviewFeature=*/ void 0, /* index=*/ 1);
        }
    }
    maybeShowErrorIconInTrustTokenTabHeader() {
        const trustTokenResult = __classPrivateFieldGet(this, _NetworkItemView_request, "f").trustTokenOperationDoneEvent();
        if (trustTokenResult &&
            !NetworkComponents.RequestTrustTokensView.statusConsideredSuccess(trustTokenResult.status)) {
            const icon = new IconButton.Icon.Icon();
            icon.data = { iconName: 'cross-circle-filled', color: 'var(--icon-error)', width: '14px', height: '14px' };
            this.setTabIcon("trust-tokens" /* NetworkForward.UIRequestLocation.UIRequestTabs.TRUST_TOKENS */, icon);
        }
    }
    selectTabInternal(tabId) {
        if (!this.selectTab(tabId)) {
            // maybeAppendPayloadPanel might cause payload tab to appear asynchronously, so
            // it makes sense to retry on the next tick
            window.setTimeout(() => {
                if (!this.selectTab(tabId)) {
                    this.selectTab(__classPrivateFieldGet(this, _NetworkItemView_firstTab, "f"));
                }
            }, 0);
        }
    }
    tabSelected(event) {
        if (!event.data.isUserGesture) {
            return;
        }
        __classPrivateFieldGet(this, _NetworkItemView_resourceViewTabSetting, "f").set(event.data.tabId);
    }
    request() {
        return __classPrivateFieldGet(this, _NetworkItemView_request, "f");
    }
    async revealResponseBody(position) {
        this.selectTabInternal("response" /* NetworkForward.UIRequestLocation.UIRequestTabs.RESPONSE */);
        await __classPrivateFieldGet(this, _NetworkItemView_responseView, "f")?.revealPosition(position);
    }
    revealHeader(section, header) {
        this.selectTabInternal("headers-component" /* NetworkForward.UIRequestLocation.UIRequestTabs.HEADERS_COMPONENT */);
        __classPrivateFieldGet(this, _NetworkItemView_headersViewComponent, "f")?.revealHeader(section, header);
    }
    getHeadersViewComponent() {
        return __classPrivateFieldGet(this, _NetworkItemView_headersViewComponent, "f");
    }
}
_NetworkItemView_request = new WeakMap(), _NetworkItemView_resourceViewTabSetting = new WeakMap(), _NetworkItemView_headersViewComponent = new WeakMap(), _NetworkItemView_payloadView = new WeakMap(), _NetworkItemView_responseView = new WeakMap(), _NetworkItemView_cookiesView = new WeakMap(), _NetworkItemView_initialTab = new WeakMap(), _NetworkItemView_firstTab = new WeakMap();
//# sourceMappingURL=NetworkItemView.js.map