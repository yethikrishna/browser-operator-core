// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _PreloadingMismatchedHeadersGrid_instances, _PreloadingMismatchedHeadersGrid_shadow, _PreloadingMismatchedHeadersGrid_data, _PreloadingMismatchedHeadersGrid_render;
import '../../../../ui/legacy/components/data_grid/data_grid.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as LegacyWrapper from '../../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as Lit from '../../../../ui/lit/lit.js';
import preloadingGridStyles from './preloadingGrid.css.js';
const UIStrings = {
    /**
     *@description The name of the HTTP request header.
     */
    headerName: 'Header name',
    /**
     *@description The value of the HTTP request header in initial navigation.
     */
    initialNavigationValue: 'Value in initial navigation',
    /**
     *@description The value of the HTTP request header in activation navigation.
     */
    activationNavigationValue: 'Value in activation navigation',
    /**
     *@description The string to indicate the value of the header is missing.
     */
    missing: '(missing)',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/preloading/components/PreloadingMismatchedHeadersGrid.ts', UIStrings);
export const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { render, html } = Lit;
export class PreloadingMismatchedHeadersGrid extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super(...arguments);
        _PreloadingMismatchedHeadersGrid_instances.add(this);
        _PreloadingMismatchedHeadersGrid_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _PreloadingMismatchedHeadersGrid_data.set(this, null);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _PreloadingMismatchedHeadersGrid_instances, "m", _PreloadingMismatchedHeadersGrid_render).call(this);
    }
    set data(data) {
        if (data.mismatchedHeaders === null) {
            return;
        }
        __classPrivateFieldSet(this, _PreloadingMismatchedHeadersGrid_data, data, "f");
        __classPrivateFieldGet(this, _PreloadingMismatchedHeadersGrid_instances, "m", _PreloadingMismatchedHeadersGrid_render).call(this);
    }
}
_PreloadingMismatchedHeadersGrid_shadow = new WeakMap(), _PreloadingMismatchedHeadersGrid_data = new WeakMap(), _PreloadingMismatchedHeadersGrid_instances = new WeakSet(), _PreloadingMismatchedHeadersGrid_render = function _PreloadingMismatchedHeadersGrid_render() {
    if (!__classPrivateFieldGet(this, _PreloadingMismatchedHeadersGrid_data, "f")?.mismatchedHeaders) {
        return;
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
        <style>${preloadingGridStyles}</style>
        <div class="preloading-container">
          <devtools-data-grid striped inline>
            <table>
              <tr>
                <th id="header-name" weight="30" sortable>
                  ${i18nString(UIStrings.headerName)}
                </th>
                <th id="initial-value" weight="30" sortable>
                  ${i18nString(UIStrings.initialNavigationValue)}
                </th>
                <th id="activation-value" weight="30" sortable>
                  ${i18nString(UIStrings.activationNavigationValue)}
                </th>
              </tr>
              ${__classPrivateFieldGet(this, _PreloadingMismatchedHeadersGrid_data, "f").mismatchedHeaders.map(mismatchedHeaders => html `
                <tr>
                  <td>${mismatchedHeaders.headerName}</td>
                  <td>${mismatchedHeaders.initialValue ?? i18nString(UIStrings.missing)}</td>
                  <td>${mismatchedHeaders.activationValue ?? i18nString(UIStrings.missing)}</td>
                </tr>
              `)}
            </table>
          </devtools-data-grid>
        </div>
      `, __classPrivateFieldGet(this, _PreloadingMismatchedHeadersGrid_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-resources-preloading-mismatched-headers-grid', PreloadingMismatchedHeadersGrid);
//# sourceMappingURL=PreloadingMismatchedHeadersGrid.js.map