// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _SharedStorageAccessGrid_instances, _SharedStorageAccessGrid_shadow, _SharedStorageAccessGrid_datastores, _SharedStorageAccessGrid_render, _SharedStorageAccessGrid_renderGridOrNoDataMessage, _SharedStorageAccessGrid_onSelect;
import '../../../ui/legacy/components/data_grid/data_grid.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import sharedStorageAccessGridStyles from './sharedStorageAccessGrid.css.js';
const SHARED_STORAGE_EXPLANATION_URL = 'https://developers.google.com/privacy-sandbox/private-advertising/shared-storage';
const { render, html } = Lit;
const UIStrings = {
    /**
     *@description Text in Shared Storage Events View of the Application panel
     */
    sharedStorage: 'Shared storage',
    /**
     *@description Hover text for an info icon in the Shared Storage Events panel
     */
    allSharedStorageEvents: 'All shared storage events for this page.',
    /**
     *@description Text in Shared Storage Events View of the Application panel
     * Date and time of an Shared Storage event in a locale-
     * dependent format.
     */
    eventTime: 'Event Time',
    /**
     *@description Text in Shared Storage Events View of the Application panel
     * Scope of shared storage event such as 'window', 'sharedStorageWorklet',
     * 'protectedAudienceWorklet', or 'header'.
     */
    eventScope: 'Access Scope',
    /**
     *@description Text in Shared Storage Events View of the Application panel
     * Method of shared storage event such as 'addModule', 'run', 'set', 'delete',
     * or 'get'.
     */
    eventMethod: 'Access Method',
    /**
     *@description Text in Shared Storage Events View of the Application panel
     * Owner origin of the shared storage for this access event.
     */
    ownerOrigin: 'Owner Origin',
    /**
     *@description Text in Shared Storage Events View of the Application panel
     * Owner site of the shared storage for this access event.
     */
    ownerSite: 'Owner Site',
    /**
     *@description Text in Shared Storage Events View of the Application panel
     * Event parameters whose presence/absence depend on the access type.
     */
    eventParams: 'Optional Event Params',
    /**
     *@description Text shown when no shared storage event is shown.
     * Shared storage allows to store and access data that can be shared across different sites.
     * A shared storage event is for example an access from a site to that storage.
     */
    noEvents: 'No shared storage events detected',
    /**
     *@description Text shown when no shared storage event is shown. It explains the shared storage event page.
     * Shared storage allows to store and access data that can be shared across different sites.
     * A shared storage event is for example an access from a site to that storage.
     */
    sharedStorageDescription: 'On this page you can view, add, edit and delete shared storage key-value pairs and view shared storage events.',
    /**
     * @description Text used in a link to learn more about the topic.
     */
    learnMore: 'Learn more',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/components/SharedStorageAccessGrid.ts', UIStrings);
export const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class SharedStorageAccessGrid extends HTMLElement {
    constructor() {
        super(...arguments);
        _SharedStorageAccessGrid_instances.add(this);
        _SharedStorageAccessGrid_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _SharedStorageAccessGrid_datastores.set(this, []);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _SharedStorageAccessGrid_instances, "m", _SharedStorageAccessGrid_render).call(this);
    }
    // eslint-disable-next-line rulesdir/set-data-type-reference
    set data(data) {
        __classPrivateFieldSet(this, _SharedStorageAccessGrid_datastores, data.sort((a, b) => a.accessTime - b.accessTime), "f");
        __classPrivateFieldGet(this, _SharedStorageAccessGrid_instances, "m", _SharedStorageAccessGrid_render).call(this);
    }
}
_SharedStorageAccessGrid_shadow = new WeakMap(), _SharedStorageAccessGrid_datastores = new WeakMap(), _SharedStorageAccessGrid_instances = new WeakSet(), _SharedStorageAccessGrid_render = function _SharedStorageAccessGrid_render() {
    // clang-format off
    render(html `
      <style>${sharedStorageAccessGridStyles}</style>
      <style>${UI.inspectorCommonStyles}</style>
      ${__classPrivateFieldGet(this, _SharedStorageAccessGrid_instances, "m", _SharedStorageAccessGrid_renderGridOrNoDataMessage).call(this)}`, __classPrivateFieldGet(this, _SharedStorageAccessGrid_shadow, "f"), { host: this });
    // clang-format on
}, _SharedStorageAccessGrid_renderGridOrNoDataMessage = function _SharedStorageAccessGrid_renderGridOrNoDataMessage() {
    if (__classPrivateFieldGet(this, _SharedStorageAccessGrid_datastores, "f").length === 0) {
        return html `
        <div class="empty-state" jslog=${VisualLogging.section().context('empty-view')}>
          <div class="empty-state-header">${i18nString(UIStrings.noEvents)}</div>
          <div class="empty-state-description">
            <span>${i18nString(UIStrings.sharedStorageDescription)}</span>
            ${UI.XLink.XLink.create(SHARED_STORAGE_EXPLANATION_URL, i18nString(UIStrings.learnMore), 'x-link', undefined, 'learn-more')}
          </div>
        </div>
      `;
    }
    // clang-format off
    return html `
      <div>
        <span class="heading">${i18nString(UIStrings.sharedStorage)}</span>
        <devtools-icon class="info-icon"
                        title=${i18nString(UIStrings.allSharedStorageEvents)}
                        .data=${{ iconName: 'info', color: 'var(--icon-default)', width: '16px' }}>
        </devtools-icon>
        <devtools-data-grid striped inline @select=${__classPrivateFieldGet(this, _SharedStorageAccessGrid_instances, "m", _SharedStorageAccessGrid_onSelect)}>
          <table>
            <tr>
              <th id="event-time" weight="10" sortable>
                ${i18nString(UIStrings.eventTime)}
              </th>
              <th id="event-scope" weight="10" sortable>
                ${i18nString(UIStrings.eventScope)}
              </th>
              <th id="event-method" weight="10" sortable>
                ${i18nString(UIStrings.eventMethod)}
              </th>
              <th id="event-owner-origin" weight="10" sortable>
                ${i18nString(UIStrings.ownerOrigin)}
              </th>
              <th id="event-owner-site" weight="10" sortable>
                ${i18nString(UIStrings.ownerSite)}
              </th>
              <th id="event-params" weight="10" sortable>
                ${i18nString(UIStrings.eventParams)}
              </th>
            </tr>
            ${__classPrivateFieldGet(this, _SharedStorageAccessGrid_datastores, "f").map((event, index) => html `
              <tr data-index=${index}>
                <td data-value=${event.accessTime}>
                  ${new Date(1e3 * event.accessTime)
        .toLocaleString()}
                </td>
                <td>${event.scope}</td>
                <td>${event.method}</td>
                <td>${event.ownerOrigin}</td>
                <td>${event.ownerSite}</td>
                <td>${JSON.stringify(event.params)}</td>
              </tr>
            `)}
          </table>
        </devtools-data-grid>
      </div>
    `;
    // clang-format on
}, _SharedStorageAccessGrid_onSelect = function _SharedStorageAccessGrid_onSelect(event) {
    const index = parseInt(event.detail.dataset.index || '', 10);
    const datastore = isNaN(index) ? undefined : __classPrivateFieldGet(this, _SharedStorageAccessGrid_datastores, "f")[index];
    if (datastore) {
        this.dispatchEvent(new CustomEvent('select', { detail: datastore }));
    }
};
customElements.define('devtools-shared-storage-access-grid', SharedStorageAccessGrid);
//# sourceMappingURL=SharedStorageAccessGrid.js.map