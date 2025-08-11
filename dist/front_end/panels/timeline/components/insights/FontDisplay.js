// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FontDisplay_overlayForRequest;
import './Table.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Trace from '../../../../models/trace/trace.js';
import * as Lit from '../../../../ui/lit/lit.js';
import { BaseInsightComponent } from './BaseInsightComponent.js';
import { eventRef } from './EventRef.js';
import { createLimitedRows, renderOthersLabel } from './Table.js';
const { UIStrings, i18nString } = Trace.Insights.Models.FontDisplay;
const { html } = Lit;
export class FontDisplay extends BaseInsightComponent {
    constructor() {
        super(...arguments);
        this.internalName = 'font-display';
        _FontDisplay_overlayForRequest.set(this, new Map());
    }
    createOverlays() {
        __classPrivateFieldGet(this, _FontDisplay_overlayForRequest, "f").clear();
        if (!this.model) {
            return [];
        }
        const overlays = this.model.createOverlays?.();
        if (!overlays) {
            return [];
        }
        for (const overlay of overlays.filter(overlay => overlay.type === 'ENTRY_OUTLINE')) {
            __classPrivateFieldGet(this, _FontDisplay_overlayForRequest, "f").set(overlay.entry, overlay);
        }
        return overlays;
    }
    mapToRow(font) {
        const overlay = __classPrivateFieldGet(this, _FontDisplay_overlayForRequest, "f").get(font.request);
        return {
            values: [
                eventRef(font.request, { text: font.name }),
                i18n.TimeUtilities.millisToString(font.wastedTime),
            ],
            overlays: overlay ? [overlay] : [],
        };
    }
    createAggregatedTableRow(remaining) {
        return {
            values: [renderOthersLabel(remaining.length), ''],
            overlays: remaining.map(r => __classPrivateFieldGet(this, _FontDisplay_overlayForRequest, "f").get(r.request)).filter(o => !!o),
        };
    }
    getEstimatedSavingsTime() {
        return this.model?.metricSavings?.FCP ?? null;
    }
    renderContent() {
        if (!this.model) {
            return Lit.nothing;
        }
        const rows = createLimitedRows(this.model.fonts, this);
        // clang-format off
        return html `
      <div class="insight-section">
        ${html `<devtools-performance-table
          .data=${{
            insight: this,
            headers: [i18nString(UIStrings.fontColumn), i18nString(UIStrings.wastedTimeColumn)],
            rows,
        }}>
        </devtools-performance-table>`}
      </div>`;
        // clang-format on
    }
}
_FontDisplay_overlayForRequest = new WeakMap();
FontDisplay.litTagName = Lit.StaticHtml.literal `devtools-performance-font-display`;
customElements.define('devtools-performance-font-display', FontDisplay);
//# sourceMappingURL=FontDisplay.js.map