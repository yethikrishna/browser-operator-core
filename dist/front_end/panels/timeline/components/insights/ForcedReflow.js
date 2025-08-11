var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ForcedReflow_instances, _ForcedReflow_linkifyUrl;
// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './Table.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Platform from '../../../../core/platform/platform.js';
import * as Trace from '../../../../models/trace/trace.js';
import * as LegacyComponents from '../../../../ui/legacy/components/utils/utils.js';
import * as Lit from '../../../../ui/lit/lit.js';
import { BaseInsightComponent } from './BaseInsightComponent.js';
import { createLimitedRows, renderOthersLabel } from './Table.js';
const { UIStrings, i18nString, createOverlayForEvents } = Trace.Insights.Models.ForcedReflow;
const { html, nothing } = Lit;
export class ForcedReflow extends BaseInsightComponent {
    constructor() {
        super(...arguments);
        _ForcedReflow_instances.add(this);
        this.internalName = 'forced-reflow';
    }
    mapToRow(data) {
        return {
            values: [__classPrivateFieldGet(this, _ForcedReflow_instances, "m", _ForcedReflow_linkifyUrl).call(this, data.bottomUpData)],
            overlays: createOverlayForEvents(data.relatedEvents),
        };
    }
    createAggregatedTableRow(remaining) {
        return {
            values: [renderOthersLabel(remaining.length)],
            overlays: remaining.flatMap(r => createOverlayForEvents(r.relatedEvents)),
        };
    }
    renderContent() {
        if (!this.model) {
            return Lit.nothing;
        }
        const topLevelFunctionCallData = this.model.topLevelFunctionCallData;
        const bottomUpCallStackData = this.model.aggregatedBottomUpData;
        const time = (us) => i18n.TimeUtilities.millisToString(Platform.Timing.microSecondsToMilliSeconds(us));
        const rows = createLimitedRows(bottomUpCallStackData, this);
        // clang-format off
        return html `
      ${topLevelFunctionCallData ? html `
        <div class="insight-section">
          <devtools-performance-table
            .data=${{
            insight: this,
            headers: [i18nString(UIStrings.topTimeConsumingFunctionCall), i18nString(UIStrings.totalReflowTime)],
            rows: [{
                    values: [
                        __classPrivateFieldGet(this, _ForcedReflow_instances, "m", _ForcedReflow_linkifyUrl).call(this, topLevelFunctionCallData.topLevelFunctionCall),
                        time(Trace.Types.Timing.Micro(topLevelFunctionCallData.totalReflowTime)),
                    ],
                    overlays: createOverlayForEvents(topLevelFunctionCallData.topLevelFunctionCallEvents, 'INFO'),
                }],
        }}>
          </devtools-performance-table>
        </div>
      ` : nothing}
      <div class="insight-section">
        <devtools-performance-table
          .data=${{
            insight: this,
            headers: [i18nString(UIStrings.relatedStackTrace)],
            rows,
        }}>
        </devtools-performance-table>
      </div>`;
        // clang-format on
    }
}
_ForcedReflow_instances = new WeakSet(), _ForcedReflow_linkifyUrl = function _ForcedReflow_linkifyUrl(callFrame) {
    const style = 'display: flex; gap: 4px; padding: 4px 0; overflow: hidden; white-space: nowrap';
    if (!callFrame) {
        return html `<div style=${style}>${i18nString(UIStrings.unattributed)}</div>`;
    }
    const linkifier = new LegacyComponents.Linkifier.Linkifier();
    const location = linkifier.linkifyScriptLocation(null, callFrame.scriptId, callFrame.url, callFrame.lineNumber, {
        columnNumber: callFrame.columnNumber,
        showColumnNumber: true,
        inlineFrameIndex: 0,
        tabStop: true,
    });
    if (location instanceof HTMLElement) {
        location.style.maxWidth = 'max-content';
        location.style.overflow = 'hidden';
        location.style.textOverflow = 'ellipsis';
        location.style.whiteSpace = 'normal';
        location.style.verticalAlign = 'top';
        location.style.textAlign = 'left';
        location.style.flex = '1';
    }
    const functionName = callFrame.functionName || i18nString(UIStrings.anonymous);
    return html `<div style=${style}>${functionName}<span> @ </span> ${location}</div>`;
};
ForcedReflow.litTagName = Lit.StaticHtml.literal `devtools-performance-forced-reflow`;
customElements.define('devtools-performance-forced-reflow', ForcedReflow);
//# sourceMappingURL=ForcedReflow.js.map