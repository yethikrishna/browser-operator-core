// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LegacyJavaScript_instances, _LegacyJavaScript_revealLocation;
import './Table.js';
import * as Common from '../../../../core/common/common.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as SDK from '../../../../core/sdk/sdk.js';
import * as Bindings from '../../../../models/bindings/bindings.js';
import * as Trace from '../../../../models/trace/trace.js';
import * as Lit from '../../../../ui/lit/lit.js';
import { BaseInsightComponent } from './BaseInsightComponent.js';
import { scriptRef } from './ScriptRef.js';
const { UIStrings, i18nString } = Trace.Insights.Models.LegacyJavaScript;
const { html } = Lit;
export class LegacyJavaScript extends BaseInsightComponent {
    constructor() {
        super(...arguments);
        _LegacyJavaScript_instances.add(this);
        this.internalName = 'legacy-javascript';
    }
    getEstimatedSavingsTime() {
        return this.model?.metricSavings?.FCP ?? null;
    }
    renderContent() {
        if (!this.model) {
            return Lit.nothing;
        }
        const rows = [...this.model.legacyJavaScriptResults.entries()].slice(0, 10).map(([script, result]) => {
            const overlays = [];
            if (script.request) {
                overlays.push({
                    type: 'ENTRY_OUTLINE',
                    entry: script.request,
                    outlineReason: 'ERROR',
                });
            }
            return {
                values: [scriptRef(script), i18n.ByteUtilities.bytesToString(result.estimatedByteSavings)],
                overlays,
                subRows: result.matches.map(match => {
                    return {
                        values: [html `<span @click=${() => __classPrivateFieldGet(this, _LegacyJavaScript_instances, "m", _LegacyJavaScript_revealLocation).call(this, script, match)} title=${`${script.url}:${match.line}:${match.column}`}>${match.name}</span>`],
                    };
                })
            };
        });
        // clang-format off
        return html `
      <div class="insight-section">
        <devtools-performance-table
          .data=${{
            insight: this,
            headers: [i18nString(UIStrings.columnScript), i18nString(UIStrings.columnWastedBytes)],
            rows,
        }}>
        </devtools-performance-table>
      </div>
    `;
        // clang-format on
    }
}
_LegacyJavaScript_instances = new WeakSet(), _LegacyJavaScript_revealLocation = async function _LegacyJavaScript_revealLocation(script, match) {
    const target = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    if (!target) {
        return;
    }
    const debuggerModel = target.model(SDK.DebuggerModel.DebuggerModel);
    if (!debuggerModel) {
        return;
    }
    const location = new SDK.DebuggerModel.Location(debuggerModel, script.scriptId, match.line, match.column);
    if (!location) {
        return;
    }
    const uiLocation = await Bindings.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().rawLocationToUILocation(location);
    await Common.Revealer.reveal(uiLocation);
};
LegacyJavaScript.litTagName = Lit.StaticHtml.literal `devtools-performance-legacy-javascript`;
customElements.define('devtools-performance-legacy-javascript', LegacyJavaScript);
//# sourceMappingURL=LegacyJavaScript.js.map