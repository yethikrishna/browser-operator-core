// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _NetworkRequestDetails_instances, _NetworkRequestDetails_shadow, _NetworkRequestDetails_networkRequest, _NetworkRequestDetails_maybeTarget, _NetworkRequestDetails_requestPreviewElements, _NetworkRequestDetails_linkifier, _NetworkRequestDetails_parsedTrace, _NetworkRequestDetails_entityMapper, _NetworkRequestDetails_serverTimings, _NetworkRequestDetails_renderTitle, _NetworkRequestDetails_renderRow, _NetworkRequestDetails_renderServerTimings, _NetworkRequestDetails_renderURL, _NetworkRequestDetails_renderFromCache, _NetworkRequestDetails_renderThirdPartyEntity, _NetworkRequestDetails_renderEncodedDataLength, _NetworkRequestDetails_renderInitiatedBy, _NetworkRequestDetails_renderBlockingRow, _NetworkRequestDetails_renderPreviewElement, _NetworkRequestDetails_render;
import '../../../ui/components/request_link_icon/request_link_icon.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as Helpers from '../../../models/trace/helpers/helpers.js';
import * as Trace from '../../../models/trace/trace.js';
import * as LegacyComponents from '../../../ui/legacy/components/utils/utils.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import networkRequestDetailsStyles from './networkRequestDetails.css.js';
import networkRequestTooltipStyles from './networkRequestTooltip.css.js';
import { NetworkRequestTooltip } from './NetworkRequestTooltip.js';
import { colorForNetworkRequest } from './Utils.js';
const { html } = Lit;
const MAX_URL_LENGTH = 100;
const UIStrings = {
    /**
     *@description Text that refers to the network request method
     */
    requestMethod: 'Request method',
    /**
     *@description Text that refers to the network request protocol
     */
    protocol: 'Protocol',
    /**
     *@description Text to show the priority of an item
     */
    priority: 'Priority',
    /**
     *@description Text used when referring to the data sent in a network request that is encoded as a particular file format.
     */
    encodedData: 'Encoded data',
    /**
     *@description Text used to refer to the data sent in a network request that has been decoded.
     */
    decodedBody: 'Decoded body',
    /**
     *@description Text in Timeline indicating that input has happened recently
     */
    yes: 'Yes',
    /**
     *@description Text in Timeline indicating that input has not happened recently
     */
    no: 'No',
    /**
     *@description Text to indicate to the user they are viewing an event representing a network request.
     */
    networkRequest: 'Network request',
    /**
     *@description Text for the data source of a network request.
     */
    fromCache: 'From cache',
    /**
     *@description Text used to show the mime-type of the data transferred with a network request (e.g. "application/json").
     */
    mimeType: 'MIME type',
    /**
     *@description Text used to show the user that a request was served from the browser's in-memory cache.
     */
    FromMemoryCache: ' (from memory cache)',
    /**
     *@description Text used to show the user that a request was served from the browser's file cache.
     */
    FromCache: ' (from cache)',
    /**
     *@description Label for a network request indicating that it was a HTTP2 server push instead of a regular network request, in the Performance panel
     */
    FromPush: ' (from push)',
    /**
     *@description Text used to show a user that a request was served from an installed, active service worker.
     */
    FromServiceWorker: ' (from `service worker`)',
    /**
     *@description Text for the event initiated by another one
     */
    initiatedBy: 'Initiated by',
    /**
     *@description Text that refers to if the network request is blocking
     */
    blocking: 'Blocking',
    /**
     *@description Text that refers to if the network request is in-body parser render blocking
     */
    inBodyParserBlocking: 'In-body parser blocking',
    /**
     *@description Text that refers to if the network request is render blocking
     */
    renderBlocking: 'Render blocking',
    /**
     * @description Text to refer to a 3rd Party entity.
     */
    entity: '3rd party',
    /**
     * @description Label for a column containing the names of timings (performance metric) taken in the server side application.
     */
    serverTiming: 'Server timing',
    /**
     * @description Label for a column containing the values of timings (performance metric) taken in the server side application.
     */
    time: 'Time',
    /**
     * @description Label for a column containing the description of timings (performance metric) taken in the server side application.
     */
    description: 'Description',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/NetworkRequestDetails.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class NetworkRequestDetails extends HTMLElement {
    constructor(linkifier) {
        super();
        _NetworkRequestDetails_instances.add(this);
        _NetworkRequestDetails_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _NetworkRequestDetails_networkRequest.set(this, null);
        _NetworkRequestDetails_maybeTarget.set(this, null);
        _NetworkRequestDetails_requestPreviewElements.set(this, new WeakMap());
        _NetworkRequestDetails_linkifier.set(this, void 0);
        _NetworkRequestDetails_parsedTrace.set(this, null);
        _NetworkRequestDetails_entityMapper.set(this, null);
        _NetworkRequestDetails_serverTimings.set(this, null);
        __classPrivateFieldSet(this, _NetworkRequestDetails_linkifier, linkifier, "f");
    }
    async setData(parsedTrace, networkRequest, maybeTarget, entityMapper) {
        if (__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f") === networkRequest && parsedTrace === __classPrivateFieldGet(this, _NetworkRequestDetails_parsedTrace, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _NetworkRequestDetails_parsedTrace, parsedTrace, "f");
        __classPrivateFieldSet(this, _NetworkRequestDetails_networkRequest, networkRequest, "f");
        __classPrivateFieldSet(this, _NetworkRequestDetails_maybeTarget, maybeTarget, "f");
        __classPrivateFieldSet(this, _NetworkRequestDetails_entityMapper, entityMapper, "f");
        __classPrivateFieldSet(this, _NetworkRequestDetails_serverTimings, null, "f");
        for (const header of networkRequest.args.data.responseHeaders ?? []) {
            const headerName = header.name.toLocaleLowerCase();
            // Some popular hosting providers like vercel or render get rid of
            // Server-Timing headers added by users, so as a workaround we
            // also support server timing headers with the `-test` suffix
            // while this feature is experimental, to enable easier trials.
            if (headerName === 'server-timing' || headerName === 'server-timing-test') {
                header.name = 'server-timing';
                __classPrivateFieldSet(this, _NetworkRequestDetails_serverTimings, SDK.ServerTiming.ServerTiming.parseHeaders([header]), "f");
                break;
            }
        }
        await __classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_render).call(this);
    }
}
_NetworkRequestDetails_shadow = new WeakMap(), _NetworkRequestDetails_networkRequest = new WeakMap(), _NetworkRequestDetails_maybeTarget = new WeakMap(), _NetworkRequestDetails_requestPreviewElements = new WeakMap(), _NetworkRequestDetails_linkifier = new WeakMap(), _NetworkRequestDetails_parsedTrace = new WeakMap(), _NetworkRequestDetails_entityMapper = new WeakMap(), _NetworkRequestDetails_serverTimings = new WeakMap(), _NetworkRequestDetails_instances = new WeakSet(), _NetworkRequestDetails_renderTitle = function _NetworkRequestDetails_renderTitle() {
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f")) {
        return null;
    }
    const style = {
        backgroundColor: `${colorForNetworkRequest(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"))}`,
    };
    return html `
      <div class="network-request-details-title">
        <div style=${Lit.Directives.styleMap(style)}></div>
        ${i18nString(UIStrings.networkRequest)}
      </div>
    `;
}, _NetworkRequestDetails_renderRow = function _NetworkRequestDetails_renderRow(title, value) {
    if (!value) {
        return null;
    }
    // clang-format off
    return html `
      <div class="network-request-details-row">
        <div class="title">${title}</div>
        <div class="value">${value}</div>
      </div>`;
    // clang-format on
}, _NetworkRequestDetails_renderServerTimings = function _NetworkRequestDetails_renderServerTimings() {
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_serverTimings, "f")) {
        return Lit.nothing;
    }
    // clang-format off
    return html `
      <div class="column-divider"></div>
      <div class="network-request-details-col server-timings">
          <div class="server-timing-column-header">${i18nString(UIStrings.serverTiming)}</div>
          <div class="server-timing-column-header">${i18nString(UIStrings.description)}</div>
          <div class="server-timing-column-header">${i18nString(UIStrings.time)}</div>
        ${__classPrivateFieldGet(this, _NetworkRequestDetails_serverTimings, "f").map(timing => {
        const classes = timing.metric.startsWith('(c') ? 'synthetic value' : 'value';
        return html `
              <div class=${classes}>${timing.metric || '-'}</div>
              <div class=${classes}>${timing.description || '-'}</div>
              <div class=${classes}>${timing.value || '-'}</div>
          `;
    })}
      </div>`;
    // clang-format on
}, _NetworkRequestDetails_renderURL = function _NetworkRequestDetails_renderURL() {
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f")) {
        return null;
    }
    const options = {
        tabStop: true,
        showColumnNumber: false,
        inlineFrameIndex: 0,
        maxLength: MAX_URL_LENGTH,
    };
    const linkifiedURL = LegacyComponents.Linkifier.Linkifier.linkifyURL(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.url, options);
    // Potentially link to request within Network Panel
    const networkRequest = SDK.TraceObject.RevealableNetworkRequest.create(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"));
    if (networkRequest) {
        linkifiedURL.addEventListener('contextmenu', (event) => {
            if (!__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f")) {
                return;
            }
            const contextMenu = new UI.ContextMenu.ContextMenu(event);
            contextMenu.appendApplicableItems(networkRequest);
            void contextMenu.show();
        });
        // clang-format off
        const urlElement = html `
        ${linkifiedURL}
        <devtools-request-link-icon .data=${{ request: networkRequest.networkRequest }}>
        </devtools-request-link-icon>
      `;
        // clang-format on
        return html `<div class="network-request-details-item">${urlElement}</div>`;
    }
    return html `<div class="network-request-details-item">${linkifiedURL}</div>`;
}, _NetworkRequestDetails_renderFromCache = function _NetworkRequestDetails_renderFromCache() {
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f")) {
        return null;
    }
    const cached = __classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.syntheticData.isMemoryCached ||
        __classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.syntheticData.isDiskCached;
    return __classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderRow).call(this, i18nString(UIStrings.fromCache), cached ? i18nString(UIStrings.yes) : i18nString(UIStrings.no));
}, _NetworkRequestDetails_renderThirdPartyEntity = function _NetworkRequestDetails_renderThirdPartyEntity() {
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_entityMapper, "f") || !__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f")) {
        return null;
    }
    const entity = __classPrivateFieldGet(this, _NetworkRequestDetails_entityMapper, "f").entityForEvent(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"));
    if (!entity) {
        return null;
    }
    return __classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderRow).call(this, i18nString(UIStrings.entity), entity.name);
}, _NetworkRequestDetails_renderEncodedDataLength = function _NetworkRequestDetails_renderEncodedDataLength() {
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f")) {
        return null;
    }
    let lengthText = '';
    if (__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.syntheticData.isMemoryCached) {
        lengthText += i18nString(UIStrings.FromMemoryCache);
    }
    else if (__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.syntheticData.isDiskCached) {
        lengthText += i18nString(UIStrings.FromCache);
    }
    else if (__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.timing?.pushStart) {
        lengthText += i18nString(UIStrings.FromPush);
    }
    if (__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.fromServiceWorker) {
        lengthText += i18nString(UIStrings.FromServiceWorker);
    }
    if (__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.encodedDataLength || !lengthText) {
        lengthText = `${i18n.ByteUtilities.bytesToString(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.encodedDataLength)}${lengthText}`;
    }
    return __classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderRow).call(this, i18nString(UIStrings.encodedData), lengthText);
}, _NetworkRequestDetails_renderInitiatedBy = function _NetworkRequestDetails_renderInitiatedBy() {
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f")) {
        return null;
    }
    const hasStackTrace = Trace.Helpers.Trace.stackTraceInEvent(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f")) !== null;
    let link = null;
    const options = {
        tabStop: true,
        showColumnNumber: true,
        inlineFrameIndex: 0,
    };
    // If we have a stack trace, that is the most reliable way to get the initiator data and display a link to the source.
    if (hasStackTrace) {
        const topFrame = Trace.Helpers.Trace.getZeroIndexedStackTraceInEventPayload(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"))?.at(0) ?? null;
        if (topFrame) {
            link = __classPrivateFieldGet(this, _NetworkRequestDetails_linkifier, "f").maybeLinkifyConsoleCallFrame(__classPrivateFieldGet(this, _NetworkRequestDetails_maybeTarget, "f"), topFrame, options);
        }
    }
    // If we do not, we can see if the network handler found an initiator and try to link by URL
    const initiator = __classPrivateFieldGet(this, _NetworkRequestDetails_parsedTrace, "f")?.NetworkRequests.eventToInitiator.get(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"));
    if (initiator) {
        link = __classPrivateFieldGet(this, _NetworkRequestDetails_linkifier, "f").maybeLinkifyScriptLocation(__classPrivateFieldGet(this, _NetworkRequestDetails_maybeTarget, "f"), null, // this would be the scriptId, but we don't have one. The linkifier will fallback to using the URL.
        initiator.args.data.url, undefined, // line number
        options);
    }
    if (!link) {
        return null;
    }
    // clang-format off
    return html `
      <div class="network-request-details-item">
        <div class="title">${i18nString(UIStrings.initiatedBy)}</div>
        <div class="value focusable-outline">${link}</div>
      </div>`;
    // clang-format on
}, _NetworkRequestDetails_renderBlockingRow = function _NetworkRequestDetails_renderBlockingRow() {
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f") || !Helpers.Network.isSyntheticNetworkRequestEventRenderBlocking(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"))) {
        return null;
    }
    let renderBlockingText;
    switch (__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.renderBlocking) {
        case 'blocking':
            renderBlockingText = UIStrings.renderBlocking;
            break;
        case 'in_body_parser_blocking':
            renderBlockingText = UIStrings.inBodyParserBlocking;
            break;
        default:
            // Shouldn't fall to this block, if so, this network request is not render blocking, so return null.
            return null;
    }
    return __classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderRow).call(this, i18nString(UIStrings.blocking), renderBlockingText);
}, _NetworkRequestDetails_renderPreviewElement = async function _NetworkRequestDetails_renderPreviewElement() {
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f") || !__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.url || !__classPrivateFieldGet(this, _NetworkRequestDetails_maybeTarget, "f")) {
        return null;
    }
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_requestPreviewElements, "f").get(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"))) {
        const previewOpts = {
            imageAltText: LegacyComponents.ImagePreview.ImagePreview.defaultAltTextForImageURL(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.url),
            precomputedFeatures: undefined,
            align: "start" /* LegacyComponents.ImagePreview.Align.START */,
            hideFileData: true,
        };
        const previewElement = await LegacyComponents.ImagePreview.ImagePreview.build(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.url, false, previewOpts);
        previewElement && __classPrivateFieldGet(this, _NetworkRequestDetails_requestPreviewElements, "f").set(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"), previewElement);
    }
    const requestPreviewElement = __classPrivateFieldGet(this, _NetworkRequestDetails_requestPreviewElements, "f").get(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"));
    if (requestPreviewElement) {
        // clang-format off
        return html `
        <div class="network-request-details-col">${requestPreviewElement}</div>
        <div class="column-divider"></div>`;
        // clang-format on
    }
    return null;
}, _NetworkRequestDetails_render = async function _NetworkRequestDetails_render() {
    if (!__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f")) {
        return;
    }
    const networkData = __classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data;
    const redirectsHtml = NetworkRequestTooltip.renderRedirects(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"));
    // clang-format off
    const output = html `
      <style>${networkRequestDetailsStyles}</style>
      <style>${networkRequestTooltipStyles}</style>
      <div class="network-request-details-content">
        ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderTitle).call(this)}
        ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderURL).call(this)}
        <div class="network-request-details-cols">
          ${await __classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderPreviewElement).call(this)}
          <div class="network-request-details-col">
            ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderRow).call(this, i18nString(UIStrings.requestMethod), networkData.requestMethod)}
            ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderRow).call(this, i18nString(UIStrings.protocol), networkData.protocol)}
            ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderRow).call(this, i18nString(UIStrings.priority), NetworkRequestTooltip.renderPriorityValue(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f")))}
            ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderRow).call(this, i18nString(UIStrings.mimeType), networkData.mimeType)}
            ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderEncodedDataLength).call(this)}
            ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderRow).call(this, i18nString(UIStrings.decodedBody), i18n.ByteUtilities.bytesToString(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f").args.data.decodedBodyLength))}
            ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderBlockingRow).call(this)}
            ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderFromCache).call(this)}
            ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderThirdPartyEntity).call(this)}
          </div>
          <div class="column-divider"></div>
          <div class="network-request-details-col">
            <div class="timing-rows">
              ${NetworkRequestTooltip.renderTimings(__classPrivateFieldGet(this, _NetworkRequestDetails_networkRequest, "f"))}
            </div>
          </div>
          ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderServerTimings).call(this)}
          ${redirectsHtml ? html `
            <div class="column-divider"></div>
            <div class="network-request-details-col redirect-details">
              ${redirectsHtml}
            </div>
          ` : Lit.nothing}
        </div>
        ${__classPrivateFieldGet(this, _NetworkRequestDetails_instances, "m", _NetworkRequestDetails_renderInitiatedBy).call(this)}
      </div>
    `; // The last items are outside the 2 column layout because InitiatedBy can be very wide
    // clang-format on
    Lit.render(output, __classPrivateFieldGet(this, _NetworkRequestDetails_shadow, "f"), { host: this });
};
customElements.define('devtools-performance-network-request-details', NetworkRequestDetails);
//# sourceMappingURL=NetworkRequestDetails.js.map