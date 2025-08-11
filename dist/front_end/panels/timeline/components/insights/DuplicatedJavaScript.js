// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _DuplicatedJavaScript_instances, _DuplicatedJavaScript_treemapData, _DuplicatedJavaScript_shouldShowTreemap, _DuplicatedJavaScript_openTreemap;
import './Table.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Trace from '../../../../models/trace/trace.js';
import * as Buttons from '../../../../ui/components/buttons/buttons.js';
import * as Lit from '../../../../ui/lit/lit.js';
import * as VisualLogging from '../../../../ui/visual_logging/visual_logging.js';
import * as Utils from '../../utils/utils.js';
import { BaseInsightComponent } from './BaseInsightComponent.js';
import { scriptRef } from './ScriptRef.js';
const { UIStrings, i18nString } = Trace.Insights.Models.DuplicatedJavaScript;
const { html } = Lit;
export class DuplicatedJavaScript extends BaseInsightComponent {
    constructor() {
        super(...arguments);
        _DuplicatedJavaScript_instances.add(this);
        this.internalName = 'duplicated-javascript';
        _DuplicatedJavaScript_treemapData.set(this, null);
    }
    getEstimatedSavingsTime() {
        return this.model?.metricSavings?.FCP ?? null;
    }
    renderContent() {
        if (!this.model) {
            return Lit.nothing;
        }
        const rows = [...this.model.duplicationGroupedByNodeModules.entries()].slice(0, 10).map(([source, data]) => {
            const scriptToOverlay = new Map();
            for (const { script } of data.duplicates) {
                scriptToOverlay.set(script, {
                    type: 'ENTRY_OUTLINE',
                    entry: script.request,
                    outlineReason: 'ERROR',
                });
            }
            return {
                values: [source, i18n.ByteUtilities.bytesToString(data.estimatedDuplicateBytes)],
                overlays: [...scriptToOverlay.values()],
                subRows: data.duplicates.map(({ script, attributedSize }, index) => {
                    let overlays;
                    const overlay = scriptToOverlay.get(script);
                    if (overlay) {
                        overlays = [overlay];
                    }
                    return {
                        values: [
                            scriptRef(script),
                            index === 0 ? '--' : i18n.ByteUtilities.bytesToString(attributedSize),
                        ],
                        overlays,
                    };
                })
            };
        });
        let treemapButton;
        if (__classPrivateFieldGet(this, _DuplicatedJavaScript_instances, "m", _DuplicatedJavaScript_shouldShowTreemap).call(this)) {
            treemapButton = html `<devtools-button
        .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}
        jslog=${VisualLogging.action(`timeline.treemap.${this.internalName}-insight`).track({
                click: true
            })}
        @click=${__classPrivateFieldGet(this, _DuplicatedJavaScript_instances, "m", _DuplicatedJavaScript_openTreemap)}
      >View Treemap</devtools-button>`;
        }
        // clang-format off
        return html `
      ${treemapButton}
      <div class="insight-section">
        <devtools-performance-table
          .data=${{
            insight: this,
            headers: [i18nString(UIStrings.columnSource), i18nString(UIStrings.columnDuplicatedBytes)],
            rows,
        }}>
        </devtools-performance-table>
      </div>
    `;
        // clang-format on
    }
}
_DuplicatedJavaScript_treemapData = new WeakMap(), _DuplicatedJavaScript_instances = new WeakSet(), _DuplicatedJavaScript_shouldShowTreemap = function _DuplicatedJavaScript_shouldShowTreemap() {
    if (!this.model) {
        return false;
    }
    return this.model.scripts.some(script => !!script.url);
}, _DuplicatedJavaScript_openTreemap = function _DuplicatedJavaScript_openTreemap() {
    if (!this.model) {
        return;
    }
    if (!__classPrivateFieldGet(this, _DuplicatedJavaScript_treemapData, "f")) {
        __classPrivateFieldSet(this, _DuplicatedJavaScript_treemapData, Utils.Treemap.createTreemapData({ scripts: this.model.scripts }, this.model.duplication), "f");
    }
    const windowNameSuffix = this.insightSetKey ?? 'devtools';
    Utils.Treemap.openTreemap(__classPrivateFieldGet(this, _DuplicatedJavaScript_treemapData, "f"), this.model.mainDocumentUrl, windowNameSuffix);
};
DuplicatedJavaScript.litTagName = Lit.StaticHtml.literal `devtools-performance-duplicated-javascript`;
customElements.define('devtools-performance-duplicated-javascript', DuplicatedJavaScript);
//# sourceMappingURL=DuplicatedJavaScript.js.map