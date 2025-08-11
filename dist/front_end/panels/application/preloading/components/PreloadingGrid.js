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
var _PreloadingGrid_instances, _PreloadingGrid_shadow, _PreloadingGrid_data, _PreloadingGrid_render, _PreloadingGrid_onPreloadingGridCellFocused, _PreloadingGrid_urlShort;
import '../../../../ui/legacy/components/data_grid/data_grid.js';
import '../../../../ui/components/icon_button/icon_button.js';
import * as Common from '../../../../core/common/common.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as SDK from '../../../../core/sdk/sdk.js';
import * as LegacyWrapper from '../../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as Lit from '../../../../ui/lit/lit.js';
import preloadingGridStyles from './preloadingGrid.css.js';
import { capitalizedAction, composedStatus, ruleSetTagOrLocationShort } from './PreloadingString.js';
const { PreloadingStatus } = SDK.PreloadingModel;
const UIStrings = {
    /**
     *@description Column header: Action of preloading (prefetch/prerender)
     */
    action: 'Action',
    /**
     *@description Column header: A rule set of preloading
     */
    ruleSet: 'Rule set',
    /**
     *@description Column header: Status of preloading attempt
     */
    status: 'Status',
    /**
     *@description Status: Prerender failed, but prefetch is available
     */
    prefetchFallbackReady: 'Prefetch fallback ready',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/preloading/components/PreloadingGrid.ts', UIStrings);
export const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { render, html, Directives: { styleMap } } = Lit;
// Grid component to show prerendering attempts.
export class PreloadingGrid extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super(...arguments);
        _PreloadingGrid_instances.add(this);
        _PreloadingGrid_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _PreloadingGrid_data.set(this, null);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _PreloadingGrid_instances, "m", _PreloadingGrid_render).call(this);
    }
    update(data) {
        __classPrivateFieldSet(this, _PreloadingGrid_data, data, "f");
        __classPrivateFieldGet(this, _PreloadingGrid_instances, "m", _PreloadingGrid_render).call(this);
    }
}
_PreloadingGrid_shadow = new WeakMap(), _PreloadingGrid_data = new WeakMap(), _PreloadingGrid_instances = new WeakSet(), _PreloadingGrid_render = function _PreloadingGrid_render() {
    if (!__classPrivateFieldGet(this, _PreloadingGrid_data, "f")) {
        return;
    }
    const { rows, pageURL } = __classPrivateFieldGet(this, _PreloadingGrid_data, "f");
    const securityOrigin = pageURL === '' ? null : (new Common.ParsedURL.ParsedURL(pageURL)).securityOrigin();
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${preloadingGridStyles}</style>
      <div class="preloading-container">
        <devtools-data-grid striped @select=${__classPrivateFieldGet(this, _PreloadingGrid_instances, "m", _PreloadingGrid_onPreloadingGridCellFocused)}>
          <table>
            <tr>
              <th id="url" weight="40" sortable>${i18n.i18n.lockedString('URL')}</th>
              <th id="action" weight="15" sortable>${i18nString(UIStrings.action)}</th>
              <th id="rule-set" weight="20" sortable>${i18nString(UIStrings.ruleSet)}</th>
              <th id="status" weight="40" sortable>${i18nString(UIStrings.status)}</th>
            </tr>
            ${rows.map(row => {
        const attempt = row.pipeline.getOriginallyTriggered();
        const prefetchStatus = row.pipeline.getPrefetch()?.status;
        const prerenderStatus = row.pipeline.getPrerender()?.status;
        const hasWarning = (prerenderStatus === "Failure" /* PreloadingStatus.FAILURE */ &&
            (prefetchStatus === "Ready" /* PreloadingStatus.READY */ || prefetchStatus === "Success" /* PreloadingStatus.SUCCESS */));
        const hasError = row.pipeline.getOriginallyTriggered().status === "Failure" /* PreloadingStatus.FAILURE */;
        return html `<tr data-id=${row.id}>
                <td title=${attempt.key.url}>${__classPrivateFieldGet(this, _PreloadingGrid_instances, "m", _PreloadingGrid_urlShort).call(this, row, securityOrigin)}</td>
                <td>${capitalizedAction(attempt.action)}</td>
                <td>${row.ruleSets.length === 0 ? '' : ruleSetTagOrLocationShort(row.ruleSets[0], pageURL)}</td>
                <td>
                  <div style=${styleMap({ color: hasWarning ? 'var(--sys-color-orange-bright)'
                : hasError ? 'var(--sys-color-error)'
                    : 'var(--sys-color-on-surface)' })}>
                    ${(hasError || hasWarning) ? html `
                      <devtools-icon
                        name=${hasWarning ? 'warning-filled' : 'cross-circle-filled'}
                        style=${styleMap({
            width: '16px',
            height: '16px',
            color: hasWarning ? 'var(--sys-color-warning)' : 'var(--sys-color-error)',
            'vertical-align': 'sub',
        })}
                      ></devtools-icon>` : ''}
                    ${hasWarning ? i18nString(UIStrings.prefetchFallbackReady) : composedStatus(attempt)}
                  </div>
                </td>
              </tr>`;
    })}
          </table>
        </devtools-data-grid>
      </div>
    `, __classPrivateFieldGet(this, _PreloadingGrid_shadow, "f"), { host: this });
    // clang-format on
}, _PreloadingGrid_onPreloadingGridCellFocused = function _PreloadingGrid_onPreloadingGridCellFocused(event) {
    this.dispatchEvent(new CustomEvent('select', { detail: event.detail.dataset.id }));
}, _PreloadingGrid_urlShort = function _PreloadingGrid_urlShort(row, securityOrigin) {
    const url = row.pipeline.getOriginallyTriggered().key.url;
    return securityOrigin && url.startsWith(securityOrigin) ? url.slice(securityOrigin.length) : url;
};
customElements.define('devtools-resources-preloading-grid', PreloadingGrid);
//# sourceMappingURL=PreloadingGrid.js.map