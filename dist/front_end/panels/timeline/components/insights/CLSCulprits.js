// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CLSCulprits_instances, _CLSCulprits_clickEvent, _CLSCulprits_renderCulpritsSection;
import './NodeLink.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Trace from '../../../../models/trace/trace.js';
import * as Lit from '../../../../ui/lit/lit.js';
import { BaseInsightComponent } from './BaseInsightComponent.js';
import { EventReferenceClick } from './EventRef.js';
const { UIStrings, i18nString } = Trace.Insights.Models.CLSCulprits;
const { html } = Lit;
export class CLSCulprits extends BaseInsightComponent {
    constructor() {
        super(...arguments);
        _CLSCulprits_instances.add(this);
        this.internalName = 'cls-culprits';
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
        const timespanOverlaySection = overlays.find(overlay => overlay.type === 'TIMESPAN_BREAKDOWN')?.sections[0];
        if (timespanOverlaySection) {
            timespanOverlaySection.label = html `<div>${i18nString(UIStrings.worstLayoutShiftCluster)}</div>`;
        }
        return overlays;
    }
    renderContent() {
        if (!this.model || !this.bounds) {
            return Lit.nothing;
        }
        if (!this.model.clusters.length || !this.model.worstCluster) {
            return html `<div class="insight-section">${i18nString(UIStrings.noLayoutShifts)}</div>`;
        }
        const worstCluster = this.model.worstCluster;
        const culprits = this.model.topCulpritsByCluster.get(worstCluster) ?? [];
        const ts = Trace.Types.Timing.Micro(worstCluster.ts - this.bounds.min);
        const clusterTs = i18n.TimeUtilities.formatMicroSecondsTime(ts);
        // clang-format off
        return html `
      <div class="insight-section">
        <span class="worst-cluster">${i18nString(UIStrings.worstCluster)}: <button type="button" class="timeline-link" @click=${() => __classPrivateFieldGet(this, _CLSCulprits_instances, "m", _CLSCulprits_clickEvent).call(this, worstCluster)}>${i18nString(UIStrings.layoutShiftCluster, { PH1: clusterTs })}</button></span>
      </div>
      ${__classPrivateFieldGet(this, _CLSCulprits_instances, "m", _CLSCulprits_renderCulpritsSection).call(this, culprits)}
    `;
        // clang-format on
    }
}
_CLSCulprits_instances = new WeakSet(), _CLSCulprits_clickEvent = function _CLSCulprits_clickEvent(event) {
    this.dispatchEvent(new EventReferenceClick(event));
}, _CLSCulprits_renderCulpritsSection = function _CLSCulprits_renderCulpritsSection(culprits) {
    if (culprits.length === 0) {
        return html `<div class="insight-section">${i18nString(UIStrings.noCulprits)}</div>`;
    }
    // clang-format off
    return html `
      <div class="insight-section">
        <p class="list-title">${i18nString(UIStrings.topCulprits)}:</p>
        <ul class="worst-culprits">
          ${culprits.map(culprit => {
        if (culprit.type === 3 /* Trace.Insights.Models.CLSCulprits.LayoutShiftType.UNSIZED_IMAGE */) {
            return html `
                <li>
                  ${culprit.description}
                  <devtools-performance-node-link
                    .data=${{
                backendNodeId: culprit.backendNodeId,
                frame: culprit.frame,
                fallbackUrl: culprit.url,
            }}>
                  </devtools-performance-node-link>
                </li>`;
        }
        return html `<li>${culprit.description}</li>`;
    })}
        </ul>
      </div>`;
    // clang-format on
};
CLSCulprits.litTagName = Lit.StaticHtml.literal `devtools-performance-cls-culprits`;
customElements.define('devtools-performance-cls-culprits', CLSCulprits);
//# sourceMappingURL=CLSCulprits.js.map