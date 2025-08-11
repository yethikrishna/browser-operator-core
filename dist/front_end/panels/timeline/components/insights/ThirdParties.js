// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ThirdParties_mainThreadTimeAggregator, _ThirdParties_transferSizeAggregator;
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Trace from '../../../../models/trace/trace.js';
import * as Lit from '../../../../ui/lit/lit.js';
import { BaseInsightComponent } from './BaseInsightComponent.js';
import { createLimitedRows, renderOthersLabel } from './Table.js';
const { UIStrings, i18nString, createOverlaysForSummary } = Trace.Insights.Models.ThirdParties;
const { html } = Lit;
const MAX_TO_SHOW = 5;
export class ThirdParties extends BaseInsightComponent {
    constructor() {
        super(...arguments);
        this.internalName = 'third-parties';
        _ThirdParties_mainThreadTimeAggregator.set(this, {
            mapToRow: summary => ({
                values: [summary.entity.name, i18n.TimeUtilities.millisToString(summary.mainThreadTime)],
                overlays: createOverlaysForSummary(summary),
            }),
            createAggregatedTableRow: remaining => {
                const totalMainThreadTime = remaining.reduce((acc, summary) => acc + summary.mainThreadTime, 0);
                return {
                    values: [renderOthersLabel(remaining.length), i18n.TimeUtilities.millisToString(totalMainThreadTime)],
                    overlays: remaining.flatMap(summary => createOverlaysForSummary(summary) ?? []),
                };
            },
        });
        _ThirdParties_transferSizeAggregator.set(this, {
            mapToRow: summary => ({
                values: [summary.entity.name, i18n.ByteUtilities.formatBytesToKb(summary.transferSize)],
                overlays: createOverlaysForSummary(summary),
            }),
            createAggregatedTableRow: remaining => {
                const totalBytes = remaining.reduce((acc, summary) => acc + summary.transferSize, 0);
                return {
                    values: [renderOthersLabel(remaining.length), i18n.ByteUtilities.formatBytesToKb(totalBytes)],
                    overlays: remaining.flatMap(summary => createOverlaysForSummary(summary) ?? []),
                };
            },
        });
    }
    renderContent() {
        if (!this.model) {
            return Lit.nothing;
        }
        let result = this.model.entitySummaries ?? [];
        if (this.model.firstPartyEntity) {
            result = result.filter(s => s.entity !== this.model?.firstPartyEntity || null);
        }
        if (!result.length) {
            return html `<div class="insight-section">${i18nString(UIStrings.noThirdParties)}</div>`;
        }
        const topTransferSizeEntries = result.toSorted((a, b) => b.transferSize - a.transferSize);
        const topMainThreadTimeEntries = result.toSorted((a, b) => b.mainThreadTime - a.mainThreadTime);
        const sections = [];
        if (topTransferSizeEntries.length) {
            const rows = createLimitedRows(topTransferSizeEntries, __classPrivateFieldGet(this, _ThirdParties_transferSizeAggregator, "f"), MAX_TO_SHOW);
            // clang-format off
            sections.push(html `
        <div class="insight-section">
          <devtools-performance-table
            .data=${{
                insight: this,
                headers: [i18nString(UIStrings.columnThirdParty), i18nString(UIStrings.columnTransferSize)],
                rows,
            }}>
          </devtools-performance-table>
        </div>
      `);
            // clang-format on
        }
        if (topMainThreadTimeEntries.length) {
            const rows = createLimitedRows(topMainThreadTimeEntries, __classPrivateFieldGet(this, _ThirdParties_mainThreadTimeAggregator, "f"), MAX_TO_SHOW);
            // clang-format off
            sections.push(html `
        <div class="insight-section">
          <devtools-performance-table
            .data=${{
                insight: this,
                headers: [i18nString(UIStrings.columnThirdParty), i18nString(UIStrings.columnMainThreadTime)],
                rows,
            }}>
          </devtools-performance-table>
        </div>
      `);
            // clang-format on
        }
        return html `${sections}`;
    }
}
_ThirdParties_mainThreadTimeAggregator = new WeakMap(), _ThirdParties_transferSizeAggregator = new WeakMap();
ThirdParties.litTagName = Lit.StaticHtml.literal `devtools-performance-third-parties`;
customElements.define('devtools-performance-third-parties', ThirdParties);
//# sourceMappingURL=ThirdParties.js.map