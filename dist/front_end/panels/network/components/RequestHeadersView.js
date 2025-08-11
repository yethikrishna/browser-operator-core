// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _RequestHeadersView_instances, _RequestHeadersView_request, _RequestHeadersView_shadow, _RequestHeadersView_showResponseHeadersText, _RequestHeadersView_showRequestHeadersText, _RequestHeadersView_showResponseHeadersTextFull, _RequestHeadersView_showRequestHeadersTextFull, _RequestHeadersView_toReveal, _RequestHeadersView_workspace, _RequestHeadersView_resetAndRefreshHeadersView, _RequestHeadersView_refreshHeadersView, _RequestHeadersView_uiSourceCodeAddedOrRemoved, _RequestHeadersView_renderEarlyHintsHeaders, _RequestHeadersView_renderResponseHeaders, _RequestHeadersView_renderHeaderOverridesLink, _RequestHeadersView_getHeaderOverridesFileUrl, _RequestHeadersView_renderRequestHeaders, _RequestHeadersView_renderRawHeaders, _RequestHeadersView_renderGeneralSection, _RequestHeadersView_renderGeneralRow, _Category_instances, _Category_shadow, _Category_expandedSetting, _Category_title, _Category_headerCount, _Category_checked, _Category_additionalContent, _Category_forceOpen, _Category_loggingContext, _Category_onCheckboxToggle, _Category_render, _Category_onSummaryKeyDown, _Category_onToggle;
import './RequestHeaderSection.js';
import * as Common from '../../../core/common/common.js';
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as Persistence from '../../../models/persistence/persistence.js';
import * as Workspace from '../../../models/workspace/workspace.js';
import * as NetworkForward from '../../../panels/network/forward/forward.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Input from '../../../ui/components/input/input.js';
import * as LegacyWrapper from '../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Sources from '../../sources/sources.js';
import requestHeadersViewStyles from './RequestHeadersView.css.js';
import { RESPONSE_HEADER_SECTION_DATA_KEY, } from './ResponseHeaderSection.js';
const RAW_HEADER_CUTOFF = 3000;
const { render, html } = Lit;
const UIStrings = {
    /**
     *@description Text in Request Headers View of the Network panel
     */
    fromDiskCache: '(from disk cache)',
    /**
     *@description Text in Request Headers View of the Network panel
     */
    fromMemoryCache: '(from memory cache)',
    /**
     *@description Text in Request Headers View of the Network panel
     */
    fromEarlyHints: '(from early hints)',
    /**
     *@description Text in Request Headers View of the Network panel
     */
    fromPrefetchCache: '(from prefetch cache)',
    /**
     *@description Text in Request Headers View of the Network panel
     */
    fromServiceWorker: '(from `service worker`)',
    /**
     *@description Text in Request Headers View of the Network panel
     */
    fromSignedexchange: '(from signed-exchange)',
    /**
     *@description Text in Request Headers View of the Network panel
     */
    fromWebBundle: '(from Web Bundle)',
    /**
     *@description Section header for a list of the main aspects of a http request
     */
    general: 'General',
    /**
     *@description Label for a checkbox to switch between raw and parsed headers
     */
    raw: 'Raw',
    /**
     *@description Text in Request Headers View of the Network panel
     */
    referrerPolicy: 'Referrer Policy',
    /**
     *@description Text in Network Log View Columns of the Network panel
     */
    remoteAddress: 'Remote Address',
    /**
     *@description Text in Request Headers View of the Network panel
     */
    requestHeaders: 'Request Headers',
    /**
     *@description The HTTP method of a request
     */
    requestMethod: 'Request Method',
    /**
     *@description The URL of a request
     */
    requestUrl: 'Request URL',
    /**
     *@description A context menu item in the Network Log View Columns of the Network panel
     */
    responseHeaders: 'Response Headers',
    /**
     *@description A context menu item in the Network Log View Columns of the Network panel
     */
    earlyHintsHeaders: 'Early Hints Headers',
    /**
     *@description Title text for a link to the Sources panel to the file containing the header override definitions
     */
    revealHeaderOverrides: 'Reveal header override definitions',
    /**
     *@description Text to show more content
     */
    showMore: 'Show more',
    /**
     *@description HTTP response code
     */
    statusCode: 'Status Code',
};
const str_ = i18n.i18n.registerUIStrings('panels/network/components/RequestHeadersView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class RequestHeadersView extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor(request) {
        super();
        _RequestHeadersView_instances.add(this);
        _RequestHeadersView_request.set(this, void 0);
        _RequestHeadersView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _RequestHeadersView_showResponseHeadersText.set(this, false);
        _RequestHeadersView_showRequestHeadersText.set(this, false);
        _RequestHeadersView_showResponseHeadersTextFull.set(this, false);
        _RequestHeadersView_showRequestHeadersTextFull.set(this, false);
        _RequestHeadersView_toReveal.set(this, undefined);
        _RequestHeadersView_workspace.set(this, Workspace.Workspace.WorkspaceImpl.instance());
        __classPrivateFieldSet(this, _RequestHeadersView_request, request, "f");
        this.setAttribute('jslog', `${VisualLogging.pane('headers').track({ resize: true })}`);
    }
    wasShown() {
        __classPrivateFieldGet(this, _RequestHeadersView_request, "f").addEventListener(SDK.NetworkRequest.Events.REMOTE_ADDRESS_CHANGED, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_refreshHeadersView), this);
        __classPrivateFieldGet(this, _RequestHeadersView_request, "f").addEventListener(SDK.NetworkRequest.Events.FINISHED_LOADING, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_refreshHeadersView), this);
        __classPrivateFieldGet(this, _RequestHeadersView_request, "f").addEventListener(SDK.NetworkRequest.Events.REQUEST_HEADERS_CHANGED, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_refreshHeadersView), this);
        __classPrivateFieldGet(this, _RequestHeadersView_request, "f").addEventListener(SDK.NetworkRequest.Events.RESPONSE_HEADERS_CHANGED, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_resetAndRefreshHeadersView), this);
        __classPrivateFieldSet(this, _RequestHeadersView_toReveal, undefined, "f");
        __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_refreshHeadersView).call(this);
    }
    willHide() {
        __classPrivateFieldGet(this, _RequestHeadersView_request, "f").removeEventListener(SDK.NetworkRequest.Events.REMOTE_ADDRESS_CHANGED, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_refreshHeadersView), this);
        __classPrivateFieldGet(this, _RequestHeadersView_request, "f").removeEventListener(SDK.NetworkRequest.Events.FINISHED_LOADING, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_refreshHeadersView), this);
        __classPrivateFieldGet(this, _RequestHeadersView_request, "f").removeEventListener(SDK.NetworkRequest.Events.REQUEST_HEADERS_CHANGED, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_refreshHeadersView), this);
        __classPrivateFieldGet(this, _RequestHeadersView_request, "f").removeEventListener(SDK.NetworkRequest.Events.RESPONSE_HEADERS_CHANGED, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_resetAndRefreshHeadersView), this);
    }
    revealHeader(section, header) {
        __classPrivateFieldSet(this, _RequestHeadersView_toReveal, { section, header }, "f");
        void this.render();
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _RequestHeadersView_workspace, "f").addEventListener(Workspace.Workspace.Events.UISourceCodeAdded, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_uiSourceCodeAddedOrRemoved), this);
        __classPrivateFieldGet(this, _RequestHeadersView_workspace, "f").addEventListener(Workspace.Workspace.Events.UISourceCodeRemoved, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_uiSourceCodeAddedOrRemoved), this);
        Common.Settings.Settings.instance()
            .moduleSetting('persistence-network-overrides-enabled')
            .addChangeListener(this.render, this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _RequestHeadersView_workspace, "f").removeEventListener(Workspace.Workspace.Events.UISourceCodeAdded, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_uiSourceCodeAddedOrRemoved), this);
        __classPrivateFieldGet(this, _RequestHeadersView_workspace, "f").removeEventListener(Workspace.Workspace.Events.UISourceCodeRemoved, __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_uiSourceCodeAddedOrRemoved), this);
        Common.Settings.Settings.instance()
            .moduleSetting('persistence-network-overrides-enabled')
            .removeChangeListener(this.render, this);
    }
    async render() {
        if (!__classPrivateFieldGet(this, _RequestHeadersView_request, "f")) {
            return;
        }
        return await RenderCoordinator.write(() => {
            // Disabled until https://crbug.com/1079231 is fixed.
            // clang-format off
            render(html `
        <style>${requestHeadersViewStyles}</style>
        ${__classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderGeneralSection).call(this)}
        ${__classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderEarlyHintsHeaders).call(this)}
        ${__classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderResponseHeaders).call(this)}
        ${__classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderRequestHeaders).call(this)}
      `, __classPrivateFieldGet(this, _RequestHeadersView_shadow, "f"), { host: this });
            // clang-format on
        });
    }
}
_RequestHeadersView_request = new WeakMap(), _RequestHeadersView_shadow = new WeakMap(), _RequestHeadersView_showResponseHeadersText = new WeakMap(), _RequestHeadersView_showRequestHeadersText = new WeakMap(), _RequestHeadersView_showResponseHeadersTextFull = new WeakMap(), _RequestHeadersView_showRequestHeadersTextFull = new WeakMap(), _RequestHeadersView_toReveal = new WeakMap(), _RequestHeadersView_workspace = new WeakMap(), _RequestHeadersView_instances = new WeakSet(), _RequestHeadersView_resetAndRefreshHeadersView = function _RequestHeadersView_resetAndRefreshHeadersView() {
    __classPrivateFieldGet(this, _RequestHeadersView_request, "f").deleteAssociatedData(RESPONSE_HEADER_SECTION_DATA_KEY);
    void this.render();
}, _RequestHeadersView_refreshHeadersView = function _RequestHeadersView_refreshHeadersView() {
    void this.render();
}, _RequestHeadersView_uiSourceCodeAddedOrRemoved = function _RequestHeadersView_uiSourceCodeAddedOrRemoved(event) {
    if (__classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_getHeaderOverridesFileUrl).call(this) === event.data.url()) {
        void this.render();
    }
}, _RequestHeadersView_renderEarlyHintsHeaders = function _RequestHeadersView_renderEarlyHintsHeaders() {
    if (!__classPrivateFieldGet(this, _RequestHeadersView_request, "f") || !__classPrivateFieldGet(this, _RequestHeadersView_request, "f").earlyHintsHeaders || __classPrivateFieldGet(this, _RequestHeadersView_request, "f").earlyHintsHeaders.length === 0) {
        return Lit.nothing;
    }
    const toggleShowRaw = () => {
        __classPrivateFieldSet(this, _RequestHeadersView_showResponseHeadersText, !__classPrivateFieldGet(this, _RequestHeadersView_showResponseHeadersText, "f"), "f");
        void this.render();
    };
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-request-headers-category
        @togglerawevent=${toggleShowRaw}
        .data=${{
        name: 'early-hints-headers',
        title: i18nString(UIStrings.earlyHintsHeaders),
        headerCount: __classPrivateFieldGet(this, _RequestHeadersView_request, "f").earlyHintsHeaders.length,
        checked: undefined,
        additionalContent: undefined,
        forceOpen: __classPrivateFieldGet(this, _RequestHeadersView_toReveal, "f")?.section === "EarlyHints" /* NetworkForward.UIRequestLocation.UIHeaderSection.EARLY_HINTS */,
        loggingContext: 'early-hints-headers',
    }}
        aria-label=${i18nString(UIStrings.earlyHintsHeaders)}
      >
        ${__classPrivateFieldGet(this, _RequestHeadersView_showResponseHeadersText, "f") ?
        __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderRawHeaders).call(this, __classPrivateFieldGet(this, _RequestHeadersView_request, "f").responseHeadersText, true) : html `
          <devtools-early-hints-header-section .data=${{
        request: __classPrivateFieldGet(this, _RequestHeadersView_request, "f"),
        toReveal: __classPrivateFieldGet(this, _RequestHeadersView_toReveal, "f"),
    }}></devtools-early-hints-header-section>
        `}
      </devtools-request-headers-category>
    `;
    // clang-format on
}, _RequestHeadersView_renderResponseHeaders = function _RequestHeadersView_renderResponseHeaders() {
    if (!__classPrivateFieldGet(this, _RequestHeadersView_request, "f")) {
        return Lit.nothing;
    }
    const toggleShowRaw = () => {
        __classPrivateFieldSet(this, _RequestHeadersView_showResponseHeadersText, !__classPrivateFieldGet(this, _RequestHeadersView_showResponseHeadersText, "f"), "f");
        void this.render();
    };
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-request-headers-category
        @togglerawevent=${toggleShowRaw}
        .data=${{
        name: 'response-headers',
        title: i18nString(UIStrings.responseHeaders),
        headerCount: __classPrivateFieldGet(this, _RequestHeadersView_request, "f").sortedResponseHeaders.length,
        checked: __classPrivateFieldGet(this, _RequestHeadersView_request, "f").responseHeadersText ? __classPrivateFieldGet(this, _RequestHeadersView_showResponseHeadersText, "f") : undefined,
        additionalContent: __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderHeaderOverridesLink).call(this),
        forceOpen: __classPrivateFieldGet(this, _RequestHeadersView_toReveal, "f")?.section === "Response" /* NetworkForward.UIRequestLocation.UIHeaderSection.RESPONSE */,
        loggingContext: 'response-headers',
    }}
        aria-label=${i18nString(UIStrings.responseHeaders)}
      >
        ${__classPrivateFieldGet(this, _RequestHeadersView_showResponseHeadersText, "f") ?
        __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderRawHeaders).call(this, __classPrivateFieldGet(this, _RequestHeadersView_request, "f").responseHeadersText, true) : html `
          <devtools-response-header-section .data=${{
        request: __classPrivateFieldGet(this, _RequestHeadersView_request, "f"),
        toReveal: __classPrivateFieldGet(this, _RequestHeadersView_toReveal, "f"),
    }} jslog=${VisualLogging.section('response-headers')}></devtools-response-header-section>
        `}
      </devtools-request-headers-category>
    `;
    // clang-format on
}, _RequestHeadersView_renderHeaderOverridesLink = function _RequestHeadersView_renderHeaderOverridesLink() {
    if (!__classPrivateFieldGet(this, _RequestHeadersView_workspace, "f").uiSourceCodeForURL(__classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_getHeaderOverridesFileUrl).call(this))) {
        return Lit.nothing;
    }
    const overridesSetting = Common.Settings.Settings.instance().moduleSetting('persistence-network-overrides-enabled');
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    const fileIcon = html `
      <devtools-icon class=${overridesSetting.get() ? 'inline-icon dot purple' : 'inline-icon'} .data=${{
        iconName: 'document',
        width: '16px',
        height: '16px',
    }}>
      </devtools-icon>`;
    // clang-format on
    const revealHeadersFile = (event) => {
        event.preventDefault();
        const uiSourceCode = __classPrivateFieldGet(this, _RequestHeadersView_workspace, "f").uiSourceCodeForURL(__classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_getHeaderOverridesFileUrl).call(this));
        if (uiSourceCode) {
            Sources.SourcesPanel.SourcesPanel.instance().showUISourceCode(uiSourceCode);
            void Sources.SourcesPanel.SourcesPanel.instance().revealInNavigator(uiSourceCode);
        }
    };
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <x-link
          href="https://goo.gle/devtools-override"
          class="link devtools-link"
          jslog=${VisualLogging.link('devtools-override').track({ click: true })}
      >
        <devtools-icon class="inline-icon" .data=${{
        iconName: 'help',
        width: '16px',
        height: '16px',
    }}>
        </devtools-icon>
      </x-link>
      <x-link
          @click=${revealHeadersFile}
          class="link devtools-link"
          title=${UIStrings.revealHeaderOverrides}
          jslog=${VisualLogging.link('reveal-header-overrides').track({ click: true })}
      >
        ${fileIcon}${Persistence.NetworkPersistenceManager.HEADERS_FILENAME}
      </x-link>
    `;
    // clang-format on
}, _RequestHeadersView_getHeaderOverridesFileUrl = function _RequestHeadersView_getHeaderOverridesFileUrl() {
    if (!__classPrivateFieldGet(this, _RequestHeadersView_request, "f")) {
        return Platform.DevToolsPath.EmptyUrlString;
    }
    const fileUrl = Persistence.NetworkPersistenceManager.NetworkPersistenceManager.instance().fileUrlFromNetworkUrl(__classPrivateFieldGet(this, _RequestHeadersView_request, "f").url(), /* ignoreInactive */ true);
    return fileUrl.substring(0, fileUrl.lastIndexOf('/')) + '/' +
        Persistence.NetworkPersistenceManager.HEADERS_FILENAME;
}, _RequestHeadersView_renderRequestHeaders = function _RequestHeadersView_renderRequestHeaders() {
    if (!__classPrivateFieldGet(this, _RequestHeadersView_request, "f")) {
        return Lit.nothing;
    }
    const requestHeadersText = __classPrivateFieldGet(this, _RequestHeadersView_request, "f").requestHeadersText();
    const toggleShowRaw = () => {
        __classPrivateFieldSet(this, _RequestHeadersView_showRequestHeadersText, !__classPrivateFieldGet(this, _RequestHeadersView_showRequestHeadersText, "f"), "f");
        void this.render();
    };
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-request-headers-category
        @togglerawevent=${toggleShowRaw}
        .data=${{
        name: 'request-headers',
        title: i18nString(UIStrings.requestHeaders),
        headerCount: __classPrivateFieldGet(this, _RequestHeadersView_request, "f").requestHeaders().length,
        checked: requestHeadersText ? __classPrivateFieldGet(this, _RequestHeadersView_showRequestHeadersText, "f") : undefined,
        forceOpen: __classPrivateFieldGet(this, _RequestHeadersView_toReveal, "f")?.section === "Request" /* NetworkForward.UIRequestLocation.UIHeaderSection.REQUEST */,
        loggingContext: 'request-headers',
    }}
        aria-label=${i18nString(UIStrings.requestHeaders)}
      >
        ${(__classPrivateFieldGet(this, _RequestHeadersView_showRequestHeadersText, "f") && requestHeadersText) ?
        __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderRawHeaders).call(this, requestHeadersText, false) : html `
          <devtools-request-header-section .data=${{
        request: __classPrivateFieldGet(this, _RequestHeadersView_request, "f"),
        toReveal: __classPrivateFieldGet(this, _RequestHeadersView_toReveal, "f"),
    }} jslog=${VisualLogging.section('request-headers')}></devtools-request-header-section>
        `}
      </devtools-request-headers-category>
    `;
    // clang-format on
}, _RequestHeadersView_renderRawHeaders = function _RequestHeadersView_renderRawHeaders(rawHeadersText, forResponseHeaders) {
    const trimmed = rawHeadersText.trim();
    const showFull = forResponseHeaders ? __classPrivateFieldGet(this, _RequestHeadersView_showResponseHeadersTextFull, "f") : __classPrivateFieldGet(this, _RequestHeadersView_showRequestHeadersTextFull, "f");
    const isShortened = !showFull && trimmed.length > RAW_HEADER_CUTOFF;
    const showMore = () => {
        if (forResponseHeaders) {
            __classPrivateFieldSet(this, _RequestHeadersView_showResponseHeadersTextFull, true, "f");
        }
        else {
            __classPrivateFieldSet(this, _RequestHeadersView_showRequestHeadersTextFull, true, "f");
        }
        void this.render();
    };
    const onContextMenuOpen = (event) => {
        const showFull = forResponseHeaders ? __classPrivateFieldGet(this, _RequestHeadersView_showResponseHeadersTextFull, "f") : __classPrivateFieldGet(this, _RequestHeadersView_showRequestHeadersTextFull, "f");
        if (!showFull) {
            const contextMenu = new UI.ContextMenu.ContextMenu(event);
            const section = contextMenu.newSection();
            section.appendItem(i18nString(UIStrings.showMore), showMore, { jslogContext: 'show-more' });
            void contextMenu.show();
        }
    };
    const addContextMenuListener = (el) => {
        if (isShortened) {
            el.addEventListener('contextmenu', onContextMenuOpen);
        }
    };
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <div class="row raw-headers-row" on-render=${ComponentHelpers.Directives.nodeRenderedCallback(addContextMenuListener)}>
        <div class="raw-headers">${isShortened ? trimmed.substring(0, RAW_HEADER_CUTOFF) : trimmed}</div>
        ${isShortened ? html `
          <devtools-button
            .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
            .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}
            @click=${showMore}
            jslog=${VisualLogging.action('raw-headers-show-more').track({ click: true })}
          >${i18nString(UIStrings.showMore)}</devtools-button>
        ` : Lit.nothing}
      </div>
    `;
    // clang-format on
}, _RequestHeadersView_renderGeneralSection = function _RequestHeadersView_renderGeneralSection() {
    if (!__classPrivateFieldGet(this, _RequestHeadersView_request, "f")) {
        return Lit.nothing;
    }
    const statusClasses = ['status'];
    if (__classPrivateFieldGet(this, _RequestHeadersView_request, "f").statusCode < 300 || __classPrivateFieldGet(this, _RequestHeadersView_request, "f").statusCode === 304) {
        statusClasses.push('green-circle');
    }
    else if (__classPrivateFieldGet(this, _RequestHeadersView_request, "f").statusCode < 400) {
        statusClasses.push('yellow-circle');
    }
    else {
        statusClasses.push('red-circle');
    }
    let comment = '';
    if (__classPrivateFieldGet(this, _RequestHeadersView_request, "f").cachedInMemory()) {
        comment = i18nString(UIStrings.fromMemoryCache);
    }
    else if (__classPrivateFieldGet(this, _RequestHeadersView_request, "f").fromEarlyHints()) {
        comment = i18nString(UIStrings.fromEarlyHints);
    }
    else if (__classPrivateFieldGet(this, _RequestHeadersView_request, "f").fetchedViaServiceWorker) {
        comment = i18nString(UIStrings.fromServiceWorker);
    }
    else if (__classPrivateFieldGet(this, _RequestHeadersView_request, "f").redirectSourceSignedExchangeInfoHasNoErrors()) {
        comment = i18nString(UIStrings.fromSignedexchange);
    }
    else if (__classPrivateFieldGet(this, _RequestHeadersView_request, "f").webBundleInnerRequestInfo()) {
        comment = i18nString(UIStrings.fromWebBundle);
    }
    else if (__classPrivateFieldGet(this, _RequestHeadersView_request, "f").fromPrefetchCache()) {
        comment = i18nString(UIStrings.fromPrefetchCache);
    }
    else if (__classPrivateFieldGet(this, _RequestHeadersView_request, "f").cached()) {
        comment = i18nString(UIStrings.fromDiskCache);
    }
    if (comment) {
        statusClasses.push('status-with-comment');
    }
    const statusText = [__classPrivateFieldGet(this, _RequestHeadersView_request, "f").statusCode, __classPrivateFieldGet(this, _RequestHeadersView_request, "f").getInferredStatusText(), comment].join(' ');
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-request-headers-category
        .data=${{
        name: 'general',
        title: i18nString(UIStrings.general),
        forceOpen: __classPrivateFieldGet(this, _RequestHeadersView_toReveal, "f")?.section === "General" /* NetworkForward.UIRequestLocation.UIHeaderSection.GENERAL */,
        loggingContext: 'general',
    }}
        aria-label=${i18nString(UIStrings.general)}
      >
      <div jslog=${VisualLogging.section('general')}>
        ${__classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderGeneralRow).call(this, i18nString(UIStrings.requestUrl), __classPrivateFieldGet(this, _RequestHeadersView_request, "f").url())}
        ${__classPrivateFieldGet(this, _RequestHeadersView_request, "f").statusCode ? __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderGeneralRow).call(this, i18nString(UIStrings.requestMethod), __classPrivateFieldGet(this, _RequestHeadersView_request, "f").requestMethod) : Lit.nothing}
        ${__classPrivateFieldGet(this, _RequestHeadersView_request, "f").statusCode ? __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderGeneralRow).call(this, i18nString(UIStrings.statusCode), statusText, statusClasses) : Lit.nothing}
        ${__classPrivateFieldGet(this, _RequestHeadersView_request, "f").remoteAddress() ? __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderGeneralRow).call(this, i18nString(UIStrings.remoteAddress), __classPrivateFieldGet(this, _RequestHeadersView_request, "f").remoteAddress()) : Lit.nothing}
        ${__classPrivateFieldGet(this, _RequestHeadersView_request, "f").referrerPolicy() ? __classPrivateFieldGet(this, _RequestHeadersView_instances, "m", _RequestHeadersView_renderGeneralRow).call(this, i18nString(UIStrings.referrerPolicy), String(__classPrivateFieldGet(this, _RequestHeadersView_request, "f").referrerPolicy())) : Lit.nothing}
      </div>
      </devtools-request-headers-category>
    `;
    // clang-format on
}, _RequestHeadersView_renderGeneralRow = function _RequestHeadersView_renderGeneralRow(name, value, classNames) {
    const isHighlighted = __classPrivateFieldGet(this, _RequestHeadersView_toReveal, "f")?.section === "General" /* NetworkForward.UIRequestLocation.UIHeaderSection.GENERAL */ &&
        name.toLowerCase() === __classPrivateFieldGet(this, _RequestHeadersView_toReveal, "f")?.header?.toLowerCase();
    return html `
      <div class="row ${isHighlighted ? 'header-highlight' : ''}">
        <div class="header-name">${name}</div>
        <div
          class="header-value ${classNames?.join(' ')}"
          @copy=${() => Host.userMetrics.actionTaken(Host.UserMetrics.Action.NetworkPanelCopyValue)}
        >${value}</div>
      </div>
    `;
};
export class ToggleRawHeadersEvent extends Event {
    constructor() {
        super(ToggleRawHeadersEvent.eventName, {});
    }
}
ToggleRawHeadersEvent.eventName = 'togglerawevent';
export class Category extends HTMLElement {
    constructor() {
        super(...arguments);
        _Category_instances.add(this);
        _Category_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _Category_expandedSetting.set(this, void 0);
        _Category_title.set(this, Common.UIString.LocalizedEmptyString);
        _Category_headerCount.set(this, undefined);
        _Category_checked.set(this, undefined);
        _Category_additionalContent.set(this, undefined);
        _Category_forceOpen.set(this, undefined);
        _Category_loggingContext.set(this, '');
    }
    set data(data) {
        __classPrivateFieldSet(this, _Category_title, data.title, "f");
        __classPrivateFieldSet(this, _Category_expandedSetting, Common.Settings.Settings.instance().createSetting('request-info-' + data.name + '-category-expanded', true), "f");
        __classPrivateFieldSet(this, _Category_headerCount, data.headerCount, "f");
        __classPrivateFieldSet(this, _Category_checked, data.checked, "f");
        __classPrivateFieldSet(this, _Category_additionalContent, data.additionalContent, "f");
        __classPrivateFieldSet(this, _Category_forceOpen, data.forceOpen, "f");
        __classPrivateFieldSet(this, _Category_loggingContext, data.loggingContext, "f");
        __classPrivateFieldGet(this, _Category_instances, "m", _Category_render).call(this);
    }
}
_Category_shadow = new WeakMap(), _Category_expandedSetting = new WeakMap(), _Category_title = new WeakMap(), _Category_headerCount = new WeakMap(), _Category_checked = new WeakMap(), _Category_additionalContent = new WeakMap(), _Category_forceOpen = new WeakMap(), _Category_loggingContext = new WeakMap(), _Category_instances = new WeakSet(), _Category_onCheckboxToggle = function _Category_onCheckboxToggle() {
    this.dispatchEvent(new ToggleRawHeadersEvent());
}, _Category_render = function _Category_render() {
    const isOpen = (__classPrivateFieldGet(this, _Category_expandedSetting, "f") ? __classPrivateFieldGet(this, _Category_expandedSetting, "f").get() : true) || __classPrivateFieldGet(this, _Category_forceOpen, "f");
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${requestHeadersViewStyles}</style>
      <style>${Input.checkboxStyles}</style>
      <details ?open=${isOpen} @toggle=${__classPrivateFieldGet(this, _Category_instances, "m", _Category_onToggle)}>
        <summary
          class="header"
          @keydown=${__classPrivateFieldGet(this, _Category_instances, "m", _Category_onSummaryKeyDown)}
          jslog=${VisualLogging.sectionHeader().track({ click: true }).context(__classPrivateFieldGet(this, _Category_loggingContext, "f"))}
        >
          <div class="header-grid-container">
            <div>
              ${__classPrivateFieldGet(this, _Category_title, "f")}${__classPrivateFieldGet(this, _Category_headerCount, "f") !== undefined ?
        html `<span class="header-count"> (${__classPrivateFieldGet(this, _Category_headerCount, "f")})</span>` :
        Lit.nothing}
            </div>
            <div class="hide-when-closed">
              ${__classPrivateFieldGet(this, _Category_checked, "f") !== undefined ? html `
                <devtools-checkbox .checked=${__classPrivateFieldGet(this, _Category_checked, "f")} @change=${__classPrivateFieldGet(this, _Category_instances, "m", _Category_onCheckboxToggle)}
                         jslog=${VisualLogging.toggle('raw-headers').track({ change: true })}>
                  ${i18nString(UIStrings.raw)}
              </devtools-checkbox>` : Lit.nothing}
            </div>
            <div class="hide-when-closed">${__classPrivateFieldGet(this, _Category_additionalContent, "f")}</div>
          </div>
        </summary>
        <slot></slot>
      </details>
    `, __classPrivateFieldGet(this, _Category_shadow, "f"), { host: this });
    // clang-format on
}, _Category_onSummaryKeyDown = function _Category_onSummaryKeyDown(event) {
    if (!event.target) {
        return;
    }
    const summaryElement = event.target;
    const detailsElement = summaryElement.parentElement;
    if (!detailsElement) {
        throw new Error('<details> element is not found for a <summary> element');
    }
    switch (event.key) {
        case 'ArrowLeft':
            detailsElement.open = false;
            break;
        case 'ArrowRight':
            detailsElement.open = true;
            break;
    }
}, _Category_onToggle = function _Category_onToggle(event) {
    __classPrivateFieldGet(this, _Category_expandedSetting, "f")?.set(event.target.open);
};
customElements.define('devtools-request-headers', RequestHeadersView);
customElements.define('devtools-request-headers-category', Category);
//# sourceMappingURL=RequestHeadersView.js.map