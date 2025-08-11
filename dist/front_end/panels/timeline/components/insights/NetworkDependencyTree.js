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
var _NetworkDependencyTree_instances, _NetworkDependencyTree_relatedRequests, _NetworkDependencyTree_countOfChains, _NetworkDependencyTree_createOverlayForChain, _NetworkDependencyTree_renderNetworkTreeRow, _NetworkDependencyTree_renderNetworkDependencyTree, _NetworkDependencyTree_renderNetworkTreeSection, _NetworkDependencyTree_renderTooManyPreconnectsWarning, _NetworkDependencyTree_renderPreconnectOriginsTable, _NetworkDependencyTree_renderEstSavingTable;
import './Table.js';
import './NodeLink.js';
import '../../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Trace from '../../../../models/trace/trace.js';
import * as Lit from '../../../../ui/lit/lit.js';
import { md } from '../../utils/Helpers.js';
import { BaseInsightComponent } from './BaseInsightComponent.js';
import { eventRef } from './EventRef.js';
import networkDependencyTreeInsightStyles from './networkDependencyTreeInsight.css.js';
import { renderOthersLabel } from './Table.js';
const { UIStrings, i18nString } = Trace.Insights.Models.NetworkDependencyTree;
const { html } = Lit;
export const MAX_CHAINS_TO_SHOW = 5;
export class NetworkDependencyTree extends BaseInsightComponent {
    constructor() {
        super(...arguments);
        _NetworkDependencyTree_instances.add(this);
        this.internalName = 'long-critical-network-tree';
        _NetworkDependencyTree_relatedRequests.set(this, null);
        _NetworkDependencyTree_countOfChains.set(this, 0);
    }
    mapNetworkDependencyToRow(node) {
        var _a, _b;
        // Check early if we've exceeded the maximum number of chains to show.
        // If so, and this is a leaf node, increment count and then skip rendering.
        // Otherwise, simply skip rendering.
        if (__classPrivateFieldGet(this, _NetworkDependencyTree_countOfChains, "f") >= MAX_CHAINS_TO_SHOW) {
            if (node.children.length === 0) {
                // This still counts the chain even if not rendered, so we can count how many chains are collapsed.
                __classPrivateFieldSet(this, _NetworkDependencyTree_countOfChains, (_a = __classPrivateFieldGet(this, _NetworkDependencyTree_countOfChains, "f"), _a++, _a), "f");
            }
            return null;
        }
        // If this is a leaf node and we haven't exceeded the max chains, increment the count.
        // This ensures we only count chains that will actually be rendered (or at least considered for rendering).
        if (node.children.length === 0) {
            __classPrivateFieldSet(this, _NetworkDependencyTree_countOfChains, (_b = __classPrivateFieldGet(this, _NetworkDependencyTree_countOfChains, "f"), _b++, _b), "f");
        }
        return {
            values: [__classPrivateFieldGet(this, _NetworkDependencyTree_instances, "m", _NetworkDependencyTree_renderNetworkTreeRow).call(this, node)],
            overlays: __classPrivateFieldGet(this, _NetworkDependencyTree_instances, "m", _NetworkDependencyTree_createOverlayForChain).call(this, node.relatedRequests),
            // Filter out the empty rows otherwise the `Table`component will render a super short row
            subRows: node.children.map(child => this.mapNetworkDependencyToRow(child)).filter(row => row !== null),
        };
    }
    renderContent() {
        return html `
      ${__classPrivateFieldGet(this, _NetworkDependencyTree_instances, "m", _NetworkDependencyTree_renderNetworkTreeSection).call(this)}
      ${__classPrivateFieldGet(this, _NetworkDependencyTree_instances, "m", _NetworkDependencyTree_renderPreconnectOriginsTable).call(this)}
      ${__classPrivateFieldGet(this, _NetworkDependencyTree_instances, "m", _NetworkDependencyTree_renderEstSavingTable).call(this)}
    `;
    }
}
_NetworkDependencyTree_relatedRequests = new WeakMap(), _NetworkDependencyTree_countOfChains = new WeakMap(), _NetworkDependencyTree_instances = new WeakSet(), _NetworkDependencyTree_createOverlayForChain = function _NetworkDependencyTree_createOverlayForChain(requests) {
    const overlays = [];
    requests.forEach(entry => overlays.push({
        type: 'ENTRY_OUTLINE',
        entry,
        outlineReason: 'ERROR',
    }));
    return overlays;
}, _NetworkDependencyTree_renderNetworkTreeRow = function _NetworkDependencyTree_renderNetworkTreeRow(node) {
    const requestStyles = Lit.Directives.styleMap({
        display: 'flex',
        '--override-timeline-link-text-color': node.isLongest ? 'var(--sys-color-error)' : '',
        color: node.isLongest ? 'var(--sys-color-error)' : '',
        backgroundColor: __classPrivateFieldGet(this, _NetworkDependencyTree_relatedRequests, "f")?.has(node.request) ? 'var(--sys-color-state-hover-on-subtle)' : '',
    });
    const urlStyles = Lit.Directives.styleMap({
        flex: 'auto',
    });
    // clang-format off
    return html `
      <div style=${requestStyles}>
        <span style=${urlStyles}>${eventRef(node.request)}</span>
        <span>
          ${i18n.TimeUtilities.formatMicroSecondsTime(Trace.Types.Timing.Micro(node.timeFromInitialRequest))}
        </span>
      </div>
    `;
    // clang-format on
}, _NetworkDependencyTree_renderNetworkDependencyTree = function _NetworkDependencyTree_renderNetworkDependencyTree(nodes) {
    if (nodes.length === 0) {
        return null;
    }
    const rows = [{
            // Add one empty row so the main document request can also has a left border
            values: [],
            // Filter out the empty rows otherwise the `Table` component will render a super short row
            subRows: nodes.map(node => this.mapNetworkDependencyToRow(node)).filter(row => row !== null),
        }];
    if (__classPrivateFieldGet(this, _NetworkDependencyTree_countOfChains, "f") > MAX_CHAINS_TO_SHOW) {
        rows.push({
            values: [renderOthersLabel(__classPrivateFieldGet(this, _NetworkDependencyTree_countOfChains, "f") - MAX_CHAINS_TO_SHOW)],
        });
    }
    // clang-format off
    return html `
      <devtools-performance-table
          .data=${{
        insight: this,
        headers: [i18nString(UIStrings.columnRequest), i18nString(UIStrings.columnTime)],
        rows,
    }}>
      </devtools-performance-table>
    `;
    // clang-format on
}, _NetworkDependencyTree_renderNetworkTreeSection = function _NetworkDependencyTree_renderNetworkTreeSection() {
    if (!this.model) {
        return Lit.nothing;
    }
    if (!this.model.rootNodes.length) {
        // clang-format off
        return html `
        <style>${networkDependencyTreeInsightStyles}</style>
        <div class="insight-section">${i18nString(UIStrings.noNetworkDependencyTree)}</div>
      `;
        // clang-format on
    }
    // clang-format off
    return html `
      <style>${networkDependencyTreeInsightStyles}</style>
      <div class="insight-section">
        <div class="max-time">
          ${i18nString(UIStrings.maxCriticalPathLatency)}
          <br>
          <span class='longest'> ${i18n.TimeUtilities.formatMicroSecondsTime((this.model.maxTime))}</span>
        </div>
      </div>
      <div class="insight-section">
        ${__classPrivateFieldGet(this, _NetworkDependencyTree_instances, "m", _NetworkDependencyTree_renderNetworkDependencyTree).call(this, this.model.rootNodes)}
      </div>
    `;
    // clang-format on
}, _NetworkDependencyTree_renderTooManyPreconnectsWarning = function _NetworkDependencyTree_renderTooManyPreconnectsWarning() {
    if (!this.model) {
        return Lit.nothing;
    }
    if (this.model.preconnectedOrigins.length <=
        Trace.Insights.Models.NetworkDependencyTree.TOO_MANY_PRECONNECTS_THRESHOLD) {
        return Lit.nothing;
    }
    const warningStyles = Lit.Directives.styleMap({
        backgroundColor: 'var(--sys-color-surface-yellow)',
        padding: ' var(--sys-size-5) var(--sys-size-8);',
        display: 'flex',
    });
    // clang-format off
    return html `
      <div style=${warningStyles}>
        ${md(i18nString(UIStrings.tooManyPreconnectLinksWarning))}
      </div>
    `;
    // clang-format on
}, _NetworkDependencyTree_renderPreconnectOriginsTable = function _NetworkDependencyTree_renderPreconnectOriginsTable() {
    if (!this.model) {
        return Lit.nothing;
    }
    const preconnectOriginsTableTitle = html `
      <style>${networkDependencyTreeInsightStyles}</style>
      <div class='section-title'>${i18nString(UIStrings.preconnectOriginsTableTitle)}</div>
      <div class="insight-description">${md(i18nString(UIStrings.preconnectOriginsTableDescription))}</div>
    `;
    if (!this.model.preconnectedOrigins.length) {
        // clang-format off
        return html `
        <div class="insight-section">
          ${preconnectOriginsTableTitle}
          ${i18nString(UIStrings.noPreconnectOrigins)}
        </div>
      `;
        // clang-format on
    }
    const rows = this.model.preconnectedOrigins.map(preconnectOrigin => {
        const subRows = [];
        if (preconnectOrigin.unused) {
            subRows.push({
                values: [md(i18nString(UIStrings.unusedWarning))],
            });
        }
        if (preconnectOrigin.crossorigin) {
            subRows.push({
                values: [md(i18nString(UIStrings.crossoriginWarning))],
            });
        }
        if (preconnectOrigin.source === 'ResponseHeader') {
            return {
                values: [preconnectOrigin.url, eventRef(preconnectOrigin.request, { text: preconnectOrigin.headerText })],
                subRows,
            };
        }
        // clang-format off
        const nodeEl = html `
        <devtools-performance-node-link
          .data=${{
            backendNodeId: preconnectOrigin.node_id,
            frame: preconnectOrigin.frame,
            fallbackHtmlSnippet: `<link rel="preconnect" href="${preconnectOrigin.url}">`,
        }}>
        </devtools-performance-node-link>`;
        // clang-format on
        return {
            values: [preconnectOrigin.url, nodeEl],
            subRows,
        };
    });
    // clang-format off
    return html `
      <div class="insight-section">
        ${preconnectOriginsTableTitle}
        ${__classPrivateFieldGet(this, _NetworkDependencyTree_instances, "m", _NetworkDependencyTree_renderTooManyPreconnectsWarning).call(this)}
        <devtools-performance-table
          .data=${{
        insight: this,
        headers: [i18nString(UIStrings.columnOrigin), i18nString(UIStrings.columnSource)],
        rows,
    }}>
        </devtools-performance-table>
      </div>
    `;
    // clang-format on
}, _NetworkDependencyTree_renderEstSavingTable = function _NetworkDependencyTree_renderEstSavingTable() {
    if (!this.model) {
        return Lit.nothing;
    }
    const estSavingTableTitle = html `
      <style>${networkDependencyTreeInsightStyles}</style>
      <div class='section-title'>${i18nString(UIStrings.estSavingTableTitle)}</div>
      <div class="insight-description">${md(i18nString(UIStrings.estSavingTableDescription))}</div>
    `;
    if (!this.model.preconnectCandidates.length) {
        // clang-format off
        return html `
        <div class="insight-section">
          ${estSavingTableTitle}
          ${i18nString(UIStrings.noPreconnectCandidates)}
        </div>
      `;
        // clang-format on
    }
    const rows = this.model.preconnectCandidates.map(candidate => ({
        values: [candidate.origin, i18n.TimeUtilities.millisToString(candidate.wastedMs)],
    }));
    // clang-format off
    return html `
      <div class="insight-section">
        ${estSavingTableTitle}
        <devtools-performance-table
          .data=${{
        insight: this,
        headers: [i18nString(UIStrings.columnOrigin), i18nString(UIStrings.columnWastedMs)],
        rows,
    }}>
        </devtools-performance-table>
      </div>
    `;
    // clang-format on
};
NetworkDependencyTree.litTagName = Lit.StaticHtml.literal `devtools-performance-long-critical-network-tree`;
customElements.define('devtools-performance-long-critical-network-tree', NetworkDependencyTree);
//# sourceMappingURL=NetworkDependencyTree.js.map