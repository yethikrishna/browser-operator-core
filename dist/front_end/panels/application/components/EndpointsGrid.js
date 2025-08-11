// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _EndpointsGrid_instances, _EndpointsGrid_shadow, _EndpointsGrid_endpoints, _EndpointsGrid_render;
import '../../../ui/legacy/components/data_grid/data_grid.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import reportingApiGridStyles from './reportingApiGrid.css.js';
const UIStrings = {
    /**
     *@description Placeholder text when there are no Reporting API endpoints.
     *(https://developers.google.com/web/updates/2018/09/reportingapi#tldr)
     */
    noEndpointsToDisplay: 'No endpoints to display',
    /**
     *@description Placeholder text when there are no Reporting API endpoints.
     *(https://developers.google.com/web/updates/2018/09/reportingapi#tldr)
     */
    endpointsDescription: 'Here you will find the list of endpoints that receive the reports'
};
const str_ = i18n.i18n.registerUIStrings('panels/application/components/EndpointsGrid.ts', UIStrings);
export const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { render, html } = Lit;
export class EndpointsGrid extends HTMLElement {
    constructor() {
        super(...arguments);
        _EndpointsGrid_instances.add(this);
        _EndpointsGrid_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _EndpointsGrid_endpoints.set(this, new Map());
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _EndpointsGrid_instances, "m", _EndpointsGrid_render).call(this);
    }
    set data(data) {
        __classPrivateFieldSet(this, _EndpointsGrid_endpoints, data.endpoints, "f");
        __classPrivateFieldGet(this, _EndpointsGrid_instances, "m", _EndpointsGrid_render).call(this);
    }
}
_EndpointsGrid_shadow = new WeakMap(), _EndpointsGrid_endpoints = new WeakMap(), _EndpointsGrid_instances = new WeakSet(), _EndpointsGrid_render = function _EndpointsGrid_render() {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${reportingApiGridStyles}</style>
      <style>${UI.inspectorCommonStyles}</style>
      <div class="reporting-container" jslog=${VisualLogging.section('endpoints')}>
        <div class="reporting-header">${i18n.i18n.lockedString('Endpoints')}</div>
        ${__classPrivateFieldGet(this, _EndpointsGrid_endpoints, "f").size > 0 ? html `
          <devtools-data-grid striped>
           <table>
            <tr>
              <th id="origin" weight="30">${i18n.i18n.lockedString('Origin')}</th>
              <th id="name" weight="20">${i18n.i18n.lockedString('Name')}</th>
              <th id="url" weight="30">${i18n.i18n.lockedString('URL')}</th>
            </tr>
            ${Array.from(__classPrivateFieldGet(this, _EndpointsGrid_endpoints, "f")).map(([origin, endpointArray]) => endpointArray.map(endpoint => html `<tr>
                  <td>${origin}</td>
                  <td>${endpoint.groupName}</td>
                  <td>${endpoint.url}</td>
                </tr>`))
        .flat()}
            </table>
          </devtools-data-grid>
        ` : html `
          <div class="empty-state">
            <span class="empty-state-header">${i18nString(UIStrings.noEndpointsToDisplay)}</span>
            <span class="empty-state-description">${i18nString(UIStrings.endpointsDescription)}</span>
          </div>
        `}
      </div>
    `, __classPrivateFieldGet(this, _EndpointsGrid_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-resources-endpoints-grid', EndpointsGrid);
//# sourceMappingURL=EndpointsGrid.js.map