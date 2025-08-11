// Copyright (c) 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _RequestLinkIcon_instances, _RequestLinkIcon_shadow, _RequestLinkIcon_linkToPreflight, _RequestLinkIcon_request, _RequestLinkIcon_highlightHeader, _RequestLinkIcon_requestResolver, _RequestLinkIcon_displayURL, _RequestLinkIcon_urlToDisplay, _RequestLinkIcon_networkTab, _RequestLinkIcon_affectedRequest, _RequestLinkIcon_additionalOnClickAction, _RequestLinkIcon_reveal, _RequestLinkIcon_getTooltip, _RequestLinkIcon_getUrlForDisplaying, _RequestLinkIcon_maybeRenderURL, _RequestLinkIcon_render;
import '../../../ui/components/icon_button/icon_button.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as NetworkForward from '../../../panels/network/forward/forward.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import requestLinkIconStyles from './requestLinkIcon.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Title for a link to show a request in the network panel
     * @example {https://example.org/index.html} url
     */
    clickToShowRequestInTheNetwork: 'Click to open the network panel and show request for URL: {url}',
    /**
     * @description Title for an link to show a request that is unavailable because the request couldn't be resolved
     */
    requestUnavailableInTheNetwork: 'Request unavailable in the network panel, try reloading the inspected page',
    /**
     * @description Label for the shortened URL displayed in a link to show a request in the network panel
     */
    shortenedURL: 'Shortened URL',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/request_link_icon/RequestLinkIcon.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export const extractShortPath = (path) => {
    // 1st regex matches everything after last '/'
    // if path ends with '/', 2nd regex returns everything between the last two '/'
    return (/[^/]+$/.exec(path) || /[^/]+\/$/.exec(path) || [''])[0];
};
export class RequestLinkIcon extends HTMLElement {
    constructor() {
        super(...arguments);
        _RequestLinkIcon_instances.add(this);
        _RequestLinkIcon_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _RequestLinkIcon_linkToPreflight.set(this, void 0);
        // The value `null` indicates that the request is not available,
        // `undefined` that it is still being resolved.
        _RequestLinkIcon_request.set(this, void 0);
        _RequestLinkIcon_highlightHeader.set(this, void 0);
        _RequestLinkIcon_requestResolver.set(this, void 0);
        _RequestLinkIcon_displayURL.set(this, false);
        _RequestLinkIcon_urlToDisplay.set(this, void 0);
        _RequestLinkIcon_networkTab.set(this, void 0);
        _RequestLinkIcon_affectedRequest.set(this, void 0);
        _RequestLinkIcon_additionalOnClickAction.set(this, void 0);
        _RequestLinkIcon_reveal.set(this, Common.Revealer.reveal);
    }
    set data(data) {
        __classPrivateFieldSet(this, _RequestLinkIcon_linkToPreflight, data.linkToPreflight, "f");
        __classPrivateFieldSet(this, _RequestLinkIcon_request, data.request, "f");
        if (data.affectedRequest) {
            __classPrivateFieldSet(this, _RequestLinkIcon_affectedRequest, { ...data.affectedRequest }, "f");
        }
        __classPrivateFieldSet(this, _RequestLinkIcon_highlightHeader, data.highlightHeader, "f");
        __classPrivateFieldSet(this, _RequestLinkIcon_networkTab, data.networkTab, "f");
        __classPrivateFieldSet(this, _RequestLinkIcon_requestResolver, data.requestResolver, "f");
        __classPrivateFieldSet(this, _RequestLinkIcon_displayURL, data.displayURL ?? false, "f");
        __classPrivateFieldSet(this, _RequestLinkIcon_urlToDisplay, data.urlToDisplay, "f");
        __classPrivateFieldSet(this, _RequestLinkIcon_additionalOnClickAction, data.additionalOnClickAction, "f");
        if (data.revealOverride) {
            __classPrivateFieldSet(this, _RequestLinkIcon_reveal, data.revealOverride, "f");
        }
        if (!__classPrivateFieldGet(this, _RequestLinkIcon_request, "f") && typeof data.affectedRequest?.requestId !== 'undefined') {
            if (!__classPrivateFieldGet(this, _RequestLinkIcon_requestResolver, "f")) {
                throw new Error('A `RequestResolver` must be provided if an `affectedRequest` is provided.');
            }
            __classPrivateFieldGet(this, _RequestLinkIcon_requestResolver, "f").waitFor(data.affectedRequest.requestId)
                .then(request => {
                __classPrivateFieldSet(this, _RequestLinkIcon_request, request, "f");
                return __classPrivateFieldGet(this, _RequestLinkIcon_instances, "m", _RequestLinkIcon_render).call(this);
            })
                .catch(() => {
                __classPrivateFieldSet(this, _RequestLinkIcon_request, null, "f");
            });
        }
        void __classPrivateFieldGet(this, _RequestLinkIcon_instances, "m", _RequestLinkIcon_render).call(this);
    }
    get data() {
        return {
            linkToPreflight: __classPrivateFieldGet(this, _RequestLinkIcon_linkToPreflight, "f"),
            request: __classPrivateFieldGet(this, _RequestLinkIcon_request, "f"),
            affectedRequest: __classPrivateFieldGet(this, _RequestLinkIcon_affectedRequest, "f"),
            highlightHeader: __classPrivateFieldGet(this, _RequestLinkIcon_highlightHeader, "f"),
            networkTab: __classPrivateFieldGet(this, _RequestLinkIcon_networkTab, "f"),
            requestResolver: __classPrivateFieldGet(this, _RequestLinkIcon_requestResolver, "f"),
            displayURL: __classPrivateFieldGet(this, _RequestLinkIcon_displayURL, "f"),
            urlToDisplay: __classPrivateFieldGet(this, _RequestLinkIcon_urlToDisplay, "f"),
            additionalOnClickAction: __classPrivateFieldGet(this, _RequestLinkIcon_additionalOnClickAction, "f"),
            revealOverride: __classPrivateFieldGet(this, _RequestLinkIcon_reveal, "f") !== Common.Revealer.reveal ? __classPrivateFieldGet(this, _RequestLinkIcon_reveal, "f") : undefined,
        };
    }
    handleClick(event) {
        if (event.button !== 0) {
            return; // Only handle left-click for now.
        }
        const linkedRequest = __classPrivateFieldGet(this, _RequestLinkIcon_linkToPreflight, "f") ? __classPrivateFieldGet(this, _RequestLinkIcon_request, "f")?.preflightRequest() : __classPrivateFieldGet(this, _RequestLinkIcon_request, "f");
        if (!linkedRequest) {
            return;
        }
        if (__classPrivateFieldGet(this, _RequestLinkIcon_highlightHeader, "f")) {
            const requestLocation = NetworkForward.UIRequestLocation.UIRequestLocation.header(linkedRequest, __classPrivateFieldGet(this, _RequestLinkIcon_highlightHeader, "f").section, __classPrivateFieldGet(this, _RequestLinkIcon_highlightHeader, "f").name);
            void __classPrivateFieldGet(this, _RequestLinkIcon_reveal, "f").call(this, requestLocation);
        }
        else {
            const requestLocation = NetworkForward.UIRequestLocation.UIRequestLocation.tab(linkedRequest, __classPrivateFieldGet(this, _RequestLinkIcon_networkTab, "f") ?? "headers-component" /* NetworkForward.UIRequestLocation.UIRequestTabs.HEADERS_COMPONENT */);
            void __classPrivateFieldGet(this, _RequestLinkIcon_reveal, "f").call(this, requestLocation);
        }
        __classPrivateFieldGet(this, _RequestLinkIcon_additionalOnClickAction, "f")?.call(this);
        event.consume();
    }
}
_RequestLinkIcon_shadow = new WeakMap(), _RequestLinkIcon_linkToPreflight = new WeakMap(), _RequestLinkIcon_request = new WeakMap(), _RequestLinkIcon_highlightHeader = new WeakMap(), _RequestLinkIcon_requestResolver = new WeakMap(), _RequestLinkIcon_displayURL = new WeakMap(), _RequestLinkIcon_urlToDisplay = new WeakMap(), _RequestLinkIcon_networkTab = new WeakMap(), _RequestLinkIcon_affectedRequest = new WeakMap(), _RequestLinkIcon_additionalOnClickAction = new WeakMap(), _RequestLinkIcon_reveal = new WeakMap(), _RequestLinkIcon_instances = new WeakSet(), _RequestLinkIcon_getTooltip = function _RequestLinkIcon_getTooltip() {
    if (__classPrivateFieldGet(this, _RequestLinkIcon_request, "f")) {
        return i18nString(UIStrings.clickToShowRequestInTheNetwork, { url: __classPrivateFieldGet(this, _RequestLinkIcon_request, "f").url() });
    }
    return i18nString(UIStrings.requestUnavailableInTheNetwork);
}, _RequestLinkIcon_getUrlForDisplaying = function _RequestLinkIcon_getUrlForDisplaying() {
    if (!__classPrivateFieldGet(this, _RequestLinkIcon_displayURL, "f")) {
        return undefined;
    }
    if (__classPrivateFieldGet(this, _RequestLinkIcon_request, "f")) {
        return __classPrivateFieldGet(this, _RequestLinkIcon_request, "f").url();
    }
    return __classPrivateFieldGet(this, _RequestLinkIcon_affectedRequest, "f")?.url;
}, _RequestLinkIcon_maybeRenderURL = function _RequestLinkIcon_maybeRenderURL() {
    const url = __classPrivateFieldGet(this, _RequestLinkIcon_instances, "m", _RequestLinkIcon_getUrlForDisplaying).call(this);
    if (!url) {
        return Lit.nothing;
    }
    if (__classPrivateFieldGet(this, _RequestLinkIcon_urlToDisplay, "f")) {
        return html `<span title=${url}>${__classPrivateFieldGet(this, _RequestLinkIcon_urlToDisplay, "f")}</span>`;
    }
    const filename = extractShortPath(url);
    return html `<span aria-label=${i18nString(UIStrings.shortenedURL)} title=${url}>${filename}</span>`;
}, _RequestLinkIcon_render = async function _RequestLinkIcon_render() {
    return await RenderCoordinator.write(() => {
        // By default we render just the URL for the request link. If we also know
        // the concrete network request, or at least its request ID, we surround
        // the URL with a button, that opens the request in the Network panel.
        let template = __classPrivateFieldGet(this, _RequestLinkIcon_instances, "m", _RequestLinkIcon_maybeRenderURL).call(this);
        if (__classPrivateFieldGet(this, _RequestLinkIcon_request, "f") || __classPrivateFieldGet(this, _RequestLinkIcon_affectedRequest, "f")?.requestId !== undefined) {
            // clang-format off
            template = html `
          <button class=${Lit.Directives.classMap({ link: Boolean(__classPrivateFieldGet(this, _RequestLinkIcon_request, "f")) })}
                  title=${__classPrivateFieldGet(this, _RequestLinkIcon_instances, "m", _RequestLinkIcon_getTooltip).call(this)}
                  jslog=${VisualLogging.link('request').track({ click: true })}
                  @click=${this.handleClick}>
            <devtools-icon name="arrow-up-down-circle"></devtools-icon>
            ${template}
          </button>`;
            // clang-format on
        }
        Lit.render(html `<style>${requestLinkIconStyles}</style>${template}`, __classPrivateFieldGet(this, _RequestLinkIcon_shadow, "f"), { host: this });
    });
};
customElements.define('devtools-request-link-icon', RequestLinkIcon);
//# sourceMappingURL=RequestLinkIcon.js.map