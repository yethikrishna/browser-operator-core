// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LCPDiscovery_instances, _LCPDiscovery_renderDiscoveryDelay;
import './Checklist.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Trace from '../../../../models/trace/trace.js';
import * as Lit from '../../../../ui/lit/lit.js';
import { BaseInsightComponent } from './BaseInsightComponent.js';
import { imageRef } from './EventRef.js';
const { UIStrings, i18nString, getImageData } = Trace.Insights.Models.LCPDiscovery;
const { html } = Lit;
// eslint-disable-next-line rulesdir/l10n-filename-matches
const str_ = i18n.i18n.registerUIStrings('models/trace/insights/LCPDiscovery.ts', UIStrings);
export class LCPDiscovery extends BaseInsightComponent {
    constructor() {
        super(...arguments);
        _LCPDiscovery_instances.add(this);
        this.internalName = 'lcp-discovery';
    }
    hasAskAiSupport() {
        return true;
    }
    createOverlays() {
        if (!this.model) {
            return [];
        }
        const overlays = this.model.createOverlays?.();
        if (!overlays) {
            return [];
        }
        const imageResults = getImageData(this.model);
        if (!imageResults || !imageResults.discoveryDelay) {
            return [];
        }
        const timespanOverlaySection = overlays.find(overlay => overlay.type === 'TIMESPAN_BREAKDOWN')?.sections[0];
        if (timespanOverlaySection) {
            timespanOverlaySection.label =
                html `<div class="discovery-delay"> ${__classPrivateFieldGet(this, _LCPDiscovery_instances, "m", _LCPDiscovery_renderDiscoveryDelay).call(this, imageResults.discoveryDelay)}</div>`;
        }
        return overlays;
    }
    getEstimatedSavingsTime() {
        if (!this.model) {
            return null;
        }
        return getImageData(this.model)?.estimatedSavings ?? null;
    }
    renderContent() {
        if (!this.model) {
            return Lit.nothing;
        }
        const imageData = getImageData(this.model);
        if (!imageData) {
            if (!this.model.lcpEvent) {
                return html `<div class="insight-section">${i18nString(UIStrings.noLcp)}</div>`;
            }
            return html `<div class="insight-section">${i18nString(UIStrings.noLcpResource)}</div>`;
        }
        let delayEl;
        if (imageData.discoveryDelay) {
            delayEl = html `<div>${__classPrivateFieldGet(this, _LCPDiscovery_instances, "m", _LCPDiscovery_renderDiscoveryDelay).call(this, imageData.discoveryDelay)}</div>`;
        }
        // clang-format off
        return html `
      <div class="insight-section">
        <devtools-performance-checklist class="insight-section" .checklist=${imageData.checklist}></devtools-performance-checklist>
        <div class="insight-section">${imageRef(imageData.request)}${delayEl}</div>
      </div>`;
        // clang-format on
    }
}
_LCPDiscovery_instances = new WeakSet(), _LCPDiscovery_renderDiscoveryDelay = function _LCPDiscovery_renderDiscoveryDelay(delay) {
    const timeWrapper = document.createElement('span');
    timeWrapper.classList.add('discovery-time-ms');
    timeWrapper.innerText = i18n.TimeUtilities.formatMicroSecondsAsMillisFixed(delay);
    return i18n.i18n.getFormatLocalizedString(str_, UIStrings.lcpLoadDelay, { PH1: timeWrapper });
};
LCPDiscovery.litTagName = Lit.StaticHtml.literal `devtools-performance-lcp-discovery`;
customElements.define('devtools-performance-lcp-discovery', LCPDiscovery);
//# sourceMappingURL=LCPDiscovery.js.map