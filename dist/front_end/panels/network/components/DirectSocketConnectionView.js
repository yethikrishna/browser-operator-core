// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _DirectSocketConnectionView_instances, _DirectSocketConnectionView_request, _DirectSocketConnectionView_view, _DirectSocketConnectionView_setIsOpen, _DirectSocketConnectionView_getCategorySetting;
import * as Common from '../../../core/common/common.js';
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import requestHeadersViewStyles from './RequestHeadersView.css.js';
const { render, html } = Lit;
const UIStrings = {
    /**
     *@description Section header for a list of the main aspects of a direct socket connection
     */
    general: 'General',
    /**
     *@description Section header for a list of the main aspects of a direct socket connection
     */
    options: 'Options',
    /**
     *@description Section header for a list of the main aspects of a direct socket connection
     */
    openInfo: 'Open Info',
    /**
     *@description Text in Connection info View of the Network panel
     */
    type: 'DirectSocket Type',
    /**
     *@description Text in Connection info View of the Network panel
     */
    errorMessage: 'Error message',
    /**
     *@description Text in Connection info View of the Network panel
     */
    status: 'Status',
    /**
     *@description Text in Connection info View of the Network panel
     */
    directSocketTypeTcp: 'TCP',
    /**
     *@description Text in Connection info View of the Network panel
     */
    directSocketTypeUdpConnected: 'UDP (connected)',
    /**
     *@description Text in Connection info View of the Network panel
     */
    directSocketTypeUdpBound: 'UDP (bound)',
    /**
     *@description Text in Connection info View of the Network panel
     */
    directSocketStatusOpening: 'Opening',
    /**
     *@description Text in Connection info View of the Network panel
     */
    directSocketStatusOpen: 'Open',
    /**
     *@description Text in Connection info View of the Network panel
     */
    directSocketStatusClosed: 'Closed',
    /**
     *@description Text in Connection info View of the Network panel
     */
    directSocketStatusAborted: 'Aborted',
};
const str_ = i18n.i18n.registerUIStrings('panels/network/components/DirectSocketConnectionView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
function getDirectSocketTypeString(type) {
    switch (type) {
        case SDK.NetworkRequest.DirectSocketType.TCP:
            return i18nString(UIStrings.directSocketTypeTcp);
        case SDK.NetworkRequest.DirectSocketType.UDP_BOUND:
            return i18nString(UIStrings.directSocketTypeUdpBound);
        case SDK.NetworkRequest.DirectSocketType.UDP_CONNECTED:
            return i18nString(UIStrings.directSocketTypeUdpConnected);
    }
}
function getDirectSocketStatusString(status) {
    switch (status) {
        case SDK.NetworkRequest.DirectSocketStatus.OPENING:
            return i18nString(UIStrings.directSocketStatusOpening);
        case SDK.NetworkRequest.DirectSocketStatus.OPEN:
            return i18nString(UIStrings.directSocketStatusOpen);
        case SDK.NetworkRequest.DirectSocketStatus.CLOSED:
            return i18nString(UIStrings.directSocketStatusClosed);
        case SDK.NetworkRequest.DirectSocketStatus.ABORTED:
            return i18nString(UIStrings.directSocketStatusAborted);
    }
}
export const CATEGORY_NAME_GENERAL = 'general';
export const CATEGORY_NAME_OPTIONS = 'options';
export const CATEGORY_NAME_OPEN_INFO = 'open-info';
export const DEFAULT_VIEW = (input, target) => {
    function isCategoryOpen(name) {
        return input.openCategories.includes(name);
    }
    function renderCategory(name, title, content) {
        // clang-format off
        return html `
        <details
          class="direct-socket-category"
          ?open=${isCategoryOpen(name)}
          @toggle=${(e) => input.onToggleCategory(e, name)}
          jslog=${VisualLogging.sectionHeader(name).track({ click: true })}
          aria-label=${title}
        >
          <summary
            class="header"
            @keydown=${(e) => input.onSummaryKeyDown(e, name)}
          >
            <div class="header-grid-container">
              <div>
                ${title}
              </div>
              <div class="hide-when-closed"></div>
            </div>
          </summary>
          ${content}
        </details>
      `;
        // clang-format on
    }
    function renderRow(name, value, classNames) {
        if (!value) {
            return Lit.nothing;
        }
        return html `
        <div class="row">
          <div class="header-name">${name}:</div>
          <div
            class="header-value ${classNames?.join(' ')}"
            @copy=${() => input.onCopyRow()}
          >${value}</div>
        </div>
      `;
    }
    const socketInfo = input.socketInfo;
    const generalContent = html `
      <div jslog=${VisualLogging.section(CATEGORY_NAME_GENERAL)}>
        ${renderRow(i18nString(UIStrings.type), getDirectSocketTypeString(socketInfo.type))}
        ${renderRow(i18nString(UIStrings.status), getDirectSocketStatusString(socketInfo.status))}
        ${renderRow(i18nString(UIStrings.errorMessage), socketInfo.errorMessage)}
      </div>`;
    const optionsContent = html `
      <div jslog=${VisualLogging.section(CATEGORY_NAME_OPTIONS)}>
        ${renderRow(i18n.i18n.lockedString('remoteAddress'), socketInfo.createOptions.remoteAddr)}
        ${renderRow(i18n.i18n.lockedString('remotePort'), socketInfo.createOptions.remotePort?.toString(10))}
        ${renderRow(i18n.i18n.lockedString('localAddress'), socketInfo.createOptions.localAddr)}
        ${renderRow(i18n.i18n.lockedString('localPort'), socketInfo.createOptions.localPort?.toString(10))}
        ${renderRow(i18n.i18n.lockedString('noDelay'), socketInfo.createOptions.noDelay?.toString())}
        ${renderRow(i18n.i18n.lockedString('keepAliveDelay'), socketInfo.createOptions.keepAliveDelay?.toString(10))}
        ${renderRow(i18n.i18n.lockedString('sendBufferSize'), socketInfo.createOptions.sendBufferSize?.toString(10))}
        ${renderRow(i18n.i18n.lockedString('receiveBufferSize'), socketInfo.createOptions.receiveBufferSize?.toString(10))}
        ${renderRow(i18n.i18n.lockedString('dnsQueryType'), socketInfo.createOptions.dnsQueryType)}
      </div>`;
    let openInfoContent = Lit.nothing;
    if (socketInfo.openInfo) {
        openInfoContent = html `
          <div jslog=${VisualLogging.section(CATEGORY_NAME_OPEN_INFO)}>
            ${renderRow(i18n.i18n.lockedString('remoteAddress'), socketInfo.openInfo.remoteAddr)}
            ${renderRow(i18n.i18n.lockedString('remotePort'), socketInfo.openInfo?.remotePort?.toString(10))}
            ${renderRow(i18n.i18n.lockedString('localAddress'), socketInfo.openInfo.localAddr)}
            ${renderRow(i18n.i18n.lockedString('localPort'), socketInfo.openInfo?.localPort?.toString(10))}
          </div>`;
    }
    // clang-format off
    render(html `
    <style>${UI.inspectorCommonStyles}</style>
    <style>${requestHeadersViewStyles}</style>
    ${renderCategory(CATEGORY_NAME_GENERAL, i18nString(UIStrings.general), generalContent)}
    ${renderCategory(CATEGORY_NAME_OPTIONS, i18nString(UIStrings.options), optionsContent)}
    ${socketInfo.openInfo ? renderCategory(CATEGORY_NAME_OPEN_INFO, i18nString(UIStrings.openInfo), openInfoContent) : Lit.nothing}
  `, target, { host: input });
    // clang-format on
};
export class DirectSocketConnectionView extends UI.Widget.Widget {
    constructor(request, view = DEFAULT_VIEW) {
        super(true);
        _DirectSocketConnectionView_instances.add(this);
        _DirectSocketConnectionView_request.set(this, void 0);
        _DirectSocketConnectionView_view.set(this, void 0);
        __classPrivateFieldSet(this, _DirectSocketConnectionView_request, request, "f");
        __classPrivateFieldSet(this, _DirectSocketConnectionView_view, view, "f");
        this.element.setAttribute('jslog', `${VisualLogging.pane('connection-info').track({ resize: true })}`);
        this.performUpdate();
    }
    wasShown() {
        super.wasShown();
        __classPrivateFieldGet(this, _DirectSocketConnectionView_request, "f").addEventListener(SDK.NetworkRequest.Events.TIMING_CHANGED, this.requestUpdate, this);
    }
    willHide() {
        super.willHide();
        __classPrivateFieldGet(this, _DirectSocketConnectionView_request, "f").removeEventListener(SDK.NetworkRequest.Events.TIMING_CHANGED, this.requestUpdate, this);
    }
    performUpdate() {
        if (!__classPrivateFieldGet(this, _DirectSocketConnectionView_request, "f") || !__classPrivateFieldGet(this, _DirectSocketConnectionView_request, "f").directSocketInfo) {
            return;
        }
        const openCategories = [CATEGORY_NAME_GENERAL, CATEGORY_NAME_OPTIONS, CATEGORY_NAME_OPEN_INFO].filter(value => {
            return __classPrivateFieldGet(this, _DirectSocketConnectionView_instances, "m", _DirectSocketConnectionView_getCategorySetting).call(this, value).get();
        }, this);
        const viewInput = {
            socketInfo: __classPrivateFieldGet(this, _DirectSocketConnectionView_request, "f").directSocketInfo,
            openCategories,
            onSummaryKeyDown: (event, categoryName) => {
                if (!event.target) {
                    return;
                }
                const summaryElement = event.target;
                const detailsElement = summaryElement.parentElement;
                if (!detailsElement) {
                    throw new Error('<details> element is not found for a <summary> element');
                }
                let shouldBeOpen;
                switch (event.key) {
                    case 'ArrowLeft':
                        shouldBeOpen = false;
                        break;
                    case 'ArrowRight':
                        shouldBeOpen = true;
                        break;
                    default:
                        return;
                }
                if (detailsElement.open !== shouldBeOpen) {
                    __classPrivateFieldGet(this, _DirectSocketConnectionView_instances, "m", _DirectSocketConnectionView_setIsOpen).call(this, categoryName, shouldBeOpen);
                }
            },
            onToggleCategory: (event, categoryName) => {
                const detailsElement = event.target;
                __classPrivateFieldGet(this, _DirectSocketConnectionView_instances, "m", _DirectSocketConnectionView_setIsOpen).call(this, categoryName, detailsElement.open);
            },
            onCopyRow: () => {
                Host.userMetrics.actionTaken(Host.UserMetrics.Action.NetworkPanelCopyValue);
            }
        };
        __classPrivateFieldGet(this, _DirectSocketConnectionView_view, "f").call(this, viewInput, this.contentElement);
    }
}
_DirectSocketConnectionView_request = new WeakMap(), _DirectSocketConnectionView_view = new WeakMap(), _DirectSocketConnectionView_instances = new WeakSet(), _DirectSocketConnectionView_setIsOpen = function _DirectSocketConnectionView_setIsOpen(categoryName, open) {
    const setting = __classPrivateFieldGet(this, _DirectSocketConnectionView_instances, "m", _DirectSocketConnectionView_getCategorySetting).call(this, categoryName);
    setting.set(open);
    this.requestUpdate();
}, _DirectSocketConnectionView_getCategorySetting = function _DirectSocketConnectionView_getCategorySetting(name) {
    return Common.Settings.Settings.instance().createSetting(`connection-info-${name}-category-expanded`, /* defaultValue= */ true);
};
//# sourceMappingURL=DirectSocketConnectionView.js.map