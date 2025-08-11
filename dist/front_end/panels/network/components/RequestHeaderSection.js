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
var _RequestHeaderSection_instances, _RequestHeaderSection_shadow, _RequestHeaderSection_request, _RequestHeaderSection_headers, _RequestHeaderSection_render, _RequestHeaderSection_maybeRenderProvisionalHeadersWarning;
import '../../../ui/legacy/legacy.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as NetworkForward from '../forward/forward.js';
import requestHeaderSectionStyles from './RequestHeaderSection.css.js';
const { render, html } = Lit;
const UIStrings = {
    /**
     *@description Text that is usually a hyperlink to more documentation
     */
    learnMore: 'Learn more',
    /**
     *@description Message to explain lack of raw headers for a particular network request
     */
    provisionalHeadersAreShownDisableCache: 'Provisional headers are shown. Disable cache to see full headers.',
    /**
     *@description Tooltip to explain lack of raw headers for a particular network request
     */
    onlyProvisionalHeadersAre: 'Only provisional headers are available because this request was not sent over the network and instead was served from a local cache, which doesn’t store the original request headers. Disable cache to see full request headers.',
    /**
     *@description Message to explain lack of raw headers for a particular network request
     */
    provisionalHeadersAreShown: 'Provisional headers are shown.',
};
const str_ = i18n.i18n.registerUIStrings('panels/network/components/RequestHeaderSection.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class RequestHeaderSection extends HTMLElement {
    constructor() {
        super(...arguments);
        _RequestHeaderSection_instances.add(this);
        _RequestHeaderSection_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _RequestHeaderSection_request.set(this, void 0);
        _RequestHeaderSection_headers.set(this, []);
    }
    set data(data) {
        __classPrivateFieldSet(this, _RequestHeaderSection_request, data.request, "f");
        __classPrivateFieldSet(this, _RequestHeaderSection_headers, __classPrivateFieldGet(this, _RequestHeaderSection_request, "f").requestHeaders().map(header => ({
            name: Platform.StringUtilities.toLowerCaseString(header.name),
            value: header.value,
            valueEditable: 2 /* EditingAllowedStatus.FORBIDDEN */,
        })), "f");
        __classPrivateFieldGet(this, _RequestHeaderSection_headers, "f").sort((a, b) => Platform.StringUtilities.compare(a.name, b.name));
        if (data.toReveal?.section === "Request" /* NetworkForward.UIRequestLocation.UIHeaderSection.REQUEST */) {
            __classPrivateFieldGet(this, _RequestHeaderSection_headers, "f").filter(header => header.name === data.toReveal?.header?.toLowerCase()).forEach(header => {
                header.highlight = true;
            });
        }
        __classPrivateFieldGet(this, _RequestHeaderSection_instances, "m", _RequestHeaderSection_render).call(this);
    }
}
_RequestHeaderSection_shadow = new WeakMap(), _RequestHeaderSection_request = new WeakMap(), _RequestHeaderSection_headers = new WeakMap(), _RequestHeaderSection_instances = new WeakSet(), _RequestHeaderSection_render = function _RequestHeaderSection_render() {
    if (!__classPrivateFieldGet(this, _RequestHeaderSection_request, "f")) {
        return;
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${requestHeaderSectionStyles}</style>
      ${__classPrivateFieldGet(this, _RequestHeaderSection_instances, "m", _RequestHeaderSection_maybeRenderProvisionalHeadersWarning).call(this)}
      ${__classPrivateFieldGet(this, _RequestHeaderSection_headers, "f").map(header => html `
        <devtools-header-section-row
          .data=${{ header }}
          jslog=${VisualLogging.item('request-header')}
        ></devtools-header-section-row>
      `)}
    `, __classPrivateFieldGet(this, _RequestHeaderSection_shadow, "f"), { host: this });
    // clang-format on
}, _RequestHeaderSection_maybeRenderProvisionalHeadersWarning = function _RequestHeaderSection_maybeRenderProvisionalHeadersWarning() {
    if (!__classPrivateFieldGet(this, _RequestHeaderSection_request, "f") || __classPrivateFieldGet(this, _RequestHeaderSection_request, "f").requestHeadersText() !== undefined) {
        return Lit.nothing;
    }
    let cautionText;
    let cautionTitle = '';
    if (__classPrivateFieldGet(this, _RequestHeaderSection_request, "f").cachedInMemory() || __classPrivateFieldGet(this, _RequestHeaderSection_request, "f").cached()) {
        cautionText = i18nString(UIStrings.provisionalHeadersAreShownDisableCache);
        cautionTitle = i18nString(UIStrings.onlyProvisionalHeadersAre);
    }
    else {
        cautionText = i18nString(UIStrings.provisionalHeadersAreShown);
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <div class="call-to-action">
        <div class="call-to-action-body">
          <div class="explanation" title=${cautionTitle}>
            <devtools-icon class="inline-icon" .data=${{
        iconName: 'warning-filled',
        color: 'var(--icon-warning)',
        width: '16px',
        height: '16px',
    }}>
            </devtools-icon>
            ${cautionText} <x-link href="https://developer.chrome.com/docs/devtools/network/reference/#provisional-headers" class="link">${i18nString(UIStrings.learnMore)}</x-link>
          </div>
        </div>
      </div>
    `;
    // clang-format on
};
customElements.define('devtools-request-header-section', RequestHeaderSection);
//# sourceMappingURL=RequestHeaderSection.js.map