// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _NetworkRequestTooltip_instances, _a, _NetworkRequestTooltip_shadow, _NetworkRequestTooltip_data, _NetworkRequestTooltip_render;
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Trace from '../../../models/trace/trace.js';
import * as PerfUI from '../../../ui/legacy/components/perf_ui/perf_ui.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as TimelineUtils from '../utils/utils.js';
import networkRequestTooltipStyles from './networkRequestTooltip.css.js';
import { colorForNetworkRequest, networkResourceCategory } from './Utils.js';
const { html } = Lit;
const MAX_URL_LENGTH = 60;
const UIStrings = {
    /**
     *@description Text that refers to the priority of network request
     */
    priority: 'Priority',
    /**
     *@description Text for the duration of a network request
     */
    duration: 'Duration',
    /**
     *@description Text that refers to the queueing and connecting time of a network request
     */
    queuingAndConnecting: 'Queuing and connecting',
    /**
     *@description Text that refers to the request sent and waiting time of a network request
     */
    requestSentAndWaiting: 'Request sent and waiting',
    /**
     *@description Text that refers to the content downloading time of a network request
     */
    contentDownloading: 'Content downloading',
    /**
     *@description Text that refers to the waiting on main thread time of a network request
     */
    waitingOnMainThread: 'Waiting on main thread',
    /**
     *@description Text that refers to a network request is render blocking
     */
    renderBlocking: 'Render blocking',
    /**
     * @description Text to refer to the list of redirects.
     */
    redirects: 'Redirects',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/NetworkRequestTooltip.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class NetworkRequestTooltip extends HTMLElement {
    constructor() {
        super(...arguments);
        _NetworkRequestTooltip_instances.add(this);
        _NetworkRequestTooltip_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _NetworkRequestTooltip_data.set(this, { networkRequest: null, entityMapper: null });
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _NetworkRequestTooltip_instances, "m", _NetworkRequestTooltip_render).call(this);
    }
    set data(data) {
        if (__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").networkRequest === data.networkRequest) {
            return;
        }
        if (__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").entityMapper === data.entityMapper) {
            return;
        }
        __classPrivateFieldSet(this, _NetworkRequestTooltip_data, { networkRequest: data.networkRequest, entityMapper: data.entityMapper }, "f");
        __classPrivateFieldGet(this, _NetworkRequestTooltip_instances, "m", _NetworkRequestTooltip_render).call(this);
    }
    static renderPriorityValue(networkRequest) {
        if (networkRequest.args.data.priority === networkRequest.args.data.initialPriority) {
            return html `${PerfUI.NetworkPriorities.uiLabelForNetworkPriority(networkRequest.args.data.priority)}`;
        }
        return html `${PerfUI.NetworkPriorities.uiLabelForNetworkPriority(networkRequest.args.data.initialPriority)}
        <devtools-icon name=${'arrow-forward'} class="priority"></devtools-icon>
        ${PerfUI.NetworkPriorities.uiLabelForNetworkPriority(networkRequest.args.data.priority)}`;
    }
    static renderTimings(networkRequest) {
        const syntheticData = networkRequest.args.data.syntheticData;
        const queueing = (syntheticData.sendStartTime - networkRequest.ts);
        const requestPlusWaiting = (syntheticData.downloadStart - syntheticData.sendStartTime);
        const download = (syntheticData.finishTime - syntheticData.downloadStart);
        const waitingOnMainThread = (networkRequest.ts + networkRequest.dur - syntheticData.finishTime);
        const color = colorForNetworkRequest(networkRequest);
        const styleForWaiting = {
            backgroundColor: `color-mix(in srgb, ${color}, hsla(0, 100%, 100%, 0.8))`,
        };
        const styleForDownloading = {
            backgroundColor: color,
        };
        // The outside spans are transparent with a border on the outside edge.
        // The inside spans are 1px tall rectangles, vertically centered, with background color.
        //                   |
        //                   |----
        //   whisker-left->  |  ^ horizontal
        const leftWhisker = html `<span class="whisker-left"> <span class="horizontal"></span> </span>`;
        const rightWhisker = html `<span class="whisker-right"> <span class="horizontal"></span> </span>`;
        return html `
      <div class="timings-row timings-row--duration">
        <span class="indicator"></span>
        ${i18nString(UIStrings.duration)}
         <span class="time"> ${i18n.TimeUtilities.formatMicroSecondsTime(networkRequest.dur)} </span>
      </div>
      <div class="timings-row">
        ${leftWhisker}
        ${i18nString(UIStrings.queuingAndConnecting)}
        <span class="time"> ${i18n.TimeUtilities.formatMicroSecondsTime(queueing)} </span>
      </div>
      <div class="timings-row">
        <span class="indicator" style=${Lit.Directives.styleMap(styleForWaiting)}></span>
        ${i18nString(UIStrings.requestSentAndWaiting)}
        <span class="time"> ${i18n.TimeUtilities.formatMicroSecondsTime(requestPlusWaiting)} </span>
      </div>
      <div class="timings-row">
        <span class="indicator" style=${Lit.Directives.styleMap(styleForDownloading)}></span>
        ${i18nString(UIStrings.contentDownloading)}
        <span class="time"> ${i18n.TimeUtilities.formatMicroSecondsTime(download)} </span>
      </div>
      <div class="timings-row">
        ${rightWhisker}
        ${i18nString(UIStrings.waitingOnMainThread)}
        <span class="time"> ${i18n.TimeUtilities.formatMicroSecondsTime(waitingOnMainThread)} </span>
      </div>
    `;
    }
    static renderRedirects(networkRequest) {
        const redirectRows = [];
        if (networkRequest.args.data.redirects.length > 0) {
            redirectRows.push(html `
        <div class="redirects-row">
          ${i18nString(UIStrings.redirects)}
        </div>
      `);
            for (const redirect of networkRequest.args.data.redirects) {
                redirectRows.push(html `<div class="redirects-row"> ${redirect.url}</div>`);
            }
            return html `${redirectRows}`;
        }
        return null;
    }
}
_a = NetworkRequestTooltip, _NetworkRequestTooltip_shadow = new WeakMap(), _NetworkRequestTooltip_data = new WeakMap(), _NetworkRequestTooltip_instances = new WeakSet(), _NetworkRequestTooltip_render = function _NetworkRequestTooltip_render() {
    if (!__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").networkRequest) {
        return;
    }
    const chipStyle = {
        backgroundColor: `${colorForNetworkRequest(__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").networkRequest)}`,
    };
    const url = new URL(__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").networkRequest.args.data.url);
    const entity = (__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").entityMapper) ? __classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").entityMapper.entityForEvent(__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").networkRequest) : null;
    const originWithEntity = TimelineUtils.Helpers.formatOriginWithEntity(url, entity, true);
    const redirectsHtml = _a.renderRedirects(__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").networkRequest);
    // clang-format off
    const output = html `
      <style>${networkRequestTooltipStyles}</style>
      <div class="performance-card">
        <div class="url">${Platform.StringUtilities.trimMiddle(url.href.replace(url.origin, ''), MAX_URL_LENGTH)}</div>
        <div class="url url--host">${originWithEntity}</div>

        <div class="divider"></div>
        <div class="network-category">
          <span class="network-category-chip" style=${Lit.Directives.styleMap(chipStyle)}>
          </span>${networkResourceCategory(__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").networkRequest)}
        </div>
        <div class="priority-row">${i18nString(UIStrings.priority)}: ${_a.renderPriorityValue(__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").networkRequest)}</div>
        ${Trace.Helpers.Network.isSyntheticNetworkRequestEventRenderBlocking(__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").networkRequest) ?
        html `<div class="render-blocking"> ${i18nString(UIStrings.renderBlocking)} </div>` : Lit.nothing}
        <div class="divider"></div>

        ${_a.renderTimings(__classPrivateFieldGet(this, _NetworkRequestTooltip_data, "f").networkRequest)}

        ${redirectsHtml ? html `
          <div class="divider"></div>
          ${redirectsHtml}
        ` : Lit.nothing}
      </div>
    `;
    // clang-format on
    Lit.render(output, __classPrivateFieldGet(this, _NetworkRequestTooltip_shadow, "f"), { host: this });
};
customElements.define('devtools-performance-network-request-tooltip', NetworkRequestTooltip);
//# sourceMappingURL=NetworkRequestTooltip.js.map