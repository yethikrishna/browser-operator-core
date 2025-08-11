// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TimelineSelectorStatsView_instances, _TimelineSelectorStatsView_selectorLocations, _TimelineSelectorStatsView_parsedTrace, _TimelineSelectorStatsView_lastStatsSourceEventOrEvents, _TimelineSelectorStatsView_view, _TimelineSelectorStatsView_timings, _TimelineSelectorStatsView_onContextMenu;
import '../../ui/components/linkifier/linkifier.js';
import '../../ui/legacy/components/data_grid/data_grid.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Trace from '../../models/trace/trace.js';
import * as CopyToClipboard from '../../ui/components/copy_to_clipboard/copy_to_clipboard.js';
import * as UI from '../../ui/legacy/legacy.js';
import { html, render } from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import timelineSelectorStatsViewStyles from './timelineSelectorStatsView.css.js';
import * as Utils from './utils/utils.js';
const UIStrings = {
    /**
     *@description Label for selector stats data table
     */
    selectorStats: 'Selector stats',
    /**
     *@description Column name and time unit for elapsed time spent computing a style rule
     */
    elapsed: 'Elapsed (ms)',
    /**
     *@description Tooltip description 'Elapsed (ms)'
     */
    elapsedExplanation: 'Elapsed time spent computing a style rule in micro seconds',
    /**
     *@description Column name and percentage of slow mach non-matches computing a style rule
     */
    slowPathNonMatches: '% of slow-path non-matches',
    /**
     *@description Tooltip description '% of slow-path non-matches'
     */
    slowPathNonMatchesExplanation: 'The percentage of non-matching nodes (Match Attempts - Match Count) that couldn\'t be quickly ruled out by the bloom filter due to high selector complexity. Lower is better.',
    /**
     *@description Column name for count of elements that the engine attempted to match against a style rule
     */
    matchAttempts: 'Match attempts',
    /**
     *@description Tooltip description 'Match attempts'
     */
    matchAttemptsExplanation: 'Count of elements that the engine attempted to match against a style rule',
    /**
     *@description Column name for count of elements that matched a style rule
     */
    matchCount: 'Match count',
    /**
     *@description Tooltip description 'Match count'
     */
    matchCountExplanation: 'Count of elements that matched a style rule',
    /**
     *@description Column name for a style rule's CSS selector text
     */
    selector: 'Selector',
    /**
     *@description Tooltip description 'Selector'
     */
    selectorExplanation: 'CSS selector text of a style rule',
    /**
     *@description Column name for a style rule's CSS selector text
     */
    styleSheetId: 'Style Sheet',
    /**
     *@description Tooltip description 'Style Sheet'
     */
    styleSheetIdExplanation: 'Links to the selector rule defintion in the style sheets. Note that a selector rule could be defined in multiple places in a style sheet or defined in multiple style sheets. Selector rules from browser user-agent style sheet or dynamic style sheets don\'t have a link.',
    /**
     *@description A context menu item in data grids to copy entire table to clipboard
     */
    copyTable: 'Copy table',
    /**
     *@description A cell value displayed in table when no source file can be traced via css style
     */
    unableToLink: 'Unable to link',
    /**
     *@description Tooltip for the cell that no source file can be traced via style sheet id
     *@example {style-sheet-4} PH1
     */
    unableToLinkViaStyleSheetId: 'Unable to link via {PH1}',
    /**
     *@description Text for announcing that the entire table was copied to clipboard
     */
    tableCopiedToClipboard: 'Table copied to clipboard',
    /**
     *@description Text shown as the "Selectelector" cell value for one row of the Selector Stats table, however this particular row is the totals. While normally the Selector cell is values like "div.container", the parenthesis can denote this description is not an actual selector, but a general row description.
     */
    totalForAllSelectors: '(Totals for all selectors)',
    /**
     *@description Text for showing the location of a selector in the style sheet
     *@example {256} PH1
     *@example {14} PH2
     */
    lineNumber: 'Line {PH1}:{PH2}',
    /**
     *@description Count of invalidation for a specific selector. Note that a node can be invalidated multiple times.
     */
    invalidationCount: 'Invalidation count',
    /**
     *@description Tooltip description 'Invalidation count'
     */
    invalidationCountExplanation: 'Aggregated count of invalidations on nodes and subsequently had style recalculated, all of which are matched by this selector. Note that a node can be invalidated multiple times.',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/TimelineSelectorStatsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const SelectorTimingsKey = Trace.Types.Events.SelectorTimingsKey;
export class TimelineSelectorStatsView extends UI.Widget.VBox {
    constructor(parsedTrace, view = (input, _, target) => {
        render(html `
      <devtools-data-grid striped name=${i18nString(UIStrings.selectorStats)}
          @contextmenu=${input.onContextMenu.bind(input)}>
        <table>
          <tr>
            <th id=${SelectorTimingsKey.Elapsed} weight="1" sortable hideable align="right">
              <span title=${i18nString(UIStrings.elapsedExplanation)}>
              ${i18nString(UIStrings.elapsed)}</span>
            </th>
            <th id=${SelectorTimingsKey.InvalidationCount} weight="1.5" sortable hideable>
              <span title=${i18nString(UIStrings.invalidationCountExplanation)}>${i18nString(UIStrings.invalidationCount)}</span>
            </th>
            <th id=${SelectorTimingsKey.MatchAttempts} weight="1" sortable hideable align="right">
              <span title=${i18nString(UIStrings.matchAttemptsExplanation)}>
              ${i18nString(UIStrings.matchAttempts)}</span>
            </th>
            <th id=${SelectorTimingsKey.MatchCount} weight="1" sortable hideable align="right">
              <span title=${i18nString(UIStrings.matchCountExplanation)}>
              ${i18nString(UIStrings.matchCount)}</span>
            </th>
            <th id=${SelectorTimingsKey.RejectPercentage} weight="1" sortable hideable align="right">
              <span title=${i18nString(UIStrings.slowPathNonMatchesExplanation)}>${i18nString(UIStrings.slowPathNonMatches)}</span>
            </th>
            <th id=${SelectorTimingsKey.Selector} weight="3" sortable hideable>
              <span title=${i18nString(UIStrings.selectorExplanation)}>
              ${i18nString(UIStrings.selector)}</span>
            </th>
            <th id=${SelectorTimingsKey.StyleSheetId} weight="1.5" sortable hideable>
              <span title=${i18nString(UIStrings.styleSheetIdExplanation)}>
              ${i18nString(UIStrings.styleSheetId)}</span>
            </th>
          </tr>
          ${input.timings.map(timing => {
            const nonMatches = timing[SelectorTimingsKey.MatchAttempts] - timing[SelectorTimingsKey.MatchCount];
            const slowPathNonMatches = (nonMatches ? 1.0 - timing[SelectorTimingsKey.FastRejectCount] / nonMatches : 0) * 100;
            const styleSheetId = timing[SelectorTimingsKey.StyleSheetId];
            const locations = timing.locations;
            const locationMessage = locations ? null :
                locations === null ? '' :
                    i18nString(UIStrings.unableToLinkViaStyleSheetId, { PH1: styleSheetId });
            return html `<tr>
            <td data-value=${timing[SelectorTimingsKey.Elapsed]}>
              ${(timing[SelectorTimingsKey.Elapsed] / 1000.0).toFixed(3)}
            </td>
            <td title=${timing[SelectorTimingsKey.InvalidationCount]}>
              ${timing[SelectorTimingsKey.InvalidationCount]}
            </td>
            <td>${timing[SelectorTimingsKey.MatchAttempts]}</td>
            <td>${timing[SelectorTimingsKey.MatchCount]}</td>
            <td data-value=${slowPathNonMatches}>
              ${slowPathNonMatches.toFixed(1)}
            </td>
            <td title=${timing[SelectorTimingsKey.Selector]}>
             ${timing[SelectorTimingsKey.Selector]}
            </td>
            <td data-value=${styleSheetId}>${locations ? html `${locations.map((location, itemIndex) => html `
                <devtools-linkifier .data=${location}></devtools-linkifier
                >${itemIndex !== locations.length - 1 ? ',' : ''}`)}` :
                locationMessage}
            </td>
          </tr>`;
        })}
        </table>
      </devtools-data-grid>`, target, { host: this });
    }) {
        super();
        _TimelineSelectorStatsView_instances.add(this);
        _TimelineSelectorStatsView_selectorLocations.set(this, void 0);
        _TimelineSelectorStatsView_parsedTrace.set(this, null);
        /**
         * We store the last event (or array of events) that we renderered. We do
         * this because as the user zooms around the panel this view is updated,
         * however if the set of events that are populating the view is the same as it
         * was the last time, we can bail without doing any re-rendering work.
         * If the user views a single event, this will be set to that single event, but if they are viewing a range of events, this will be set to an array.
         * If it's null, that means we have not rendered yet.
         */
        _TimelineSelectorStatsView_lastStatsSourceEventOrEvents.set(this, null);
        _TimelineSelectorStatsView_view.set(this, void 0);
        _TimelineSelectorStatsView_timings.set(this, []);
        this.registerRequiredCSS(timelineSelectorStatsViewStyles);
        __classPrivateFieldSet(this, _TimelineSelectorStatsView_view, view, "f");
        this.element.setAttribute('jslog', `${VisualLogging.pane('selector-stats').track({ resize: true })}`);
        __classPrivateFieldSet(this, _TimelineSelectorStatsView_selectorLocations, new Map(), "f");
        __classPrivateFieldSet(this, _TimelineSelectorStatsView_parsedTrace, parsedTrace, "f");
        this.performUpdate();
    }
    performUpdate() {
        const viewInput = {
            timings: __classPrivateFieldGet(this, _TimelineSelectorStatsView_timings, "f"),
            onContextMenu: (event) => {
                __classPrivateFieldGet(this, _TimelineSelectorStatsView_instances, "m", _TimelineSelectorStatsView_onContextMenu).call(this, event);
            },
        };
        const viewOutput = {};
        __classPrivateFieldGet(this, _TimelineSelectorStatsView_view, "f").call(this, viewInput, viewOutput, this.contentElement);
    }
    getDescendentNodeCount(node) {
        if (!node) {
            return 0;
        }
        // number of descendent nodes, including self
        let numberOfDescendentNode = 1;
        const childNodes = node.children();
        if (childNodes) {
            for (const childNode of childNodes) {
                numberOfDescendentNode += this.getDescendentNodeCount(childNode);
            }
        }
        return numberOfDescendentNode;
    }
    async updateInvalidationCount(events) {
        if (!__classPrivateFieldGet(this, _TimelineSelectorStatsView_parsedTrace, "f")) {
            return;
        }
        const invalidatedNodes = __classPrivateFieldGet(this, _TimelineSelectorStatsView_parsedTrace, "f").SelectorStats.invalidatedNodeList;
        const invalidatedNodeMap = new Map();
        const frameIdBackendNodeIdsMap = new Map();
        for (const { frame, backendNodeId } of invalidatedNodes) {
            if (!frameIdBackendNodeIdsMap.has(frame)) {
                frameIdBackendNodeIdsMap.set(frame, new Set());
            }
            frameIdBackendNodeIdsMap.get(frame)?.add(backendNodeId);
        }
        const invalidatedNodeIdMap = new Map();
        for (const [frameId, backendNodeIds] of frameIdBackendNodeIdsMap) {
            const backendNodeIdMap = await Utils.EntryNodes.domNodesForBackendIds(frameId, backendNodeIds);
            invalidatedNodeIdMap.set(frameId, backendNodeIdMap);
        }
        for (const invalidatedNode of invalidatedNodes) {
            const invalidatedNodeDomNode = invalidatedNodeIdMap.get(invalidatedNode.frame)?.get(invalidatedNode.backendNodeId) ?? null;
            // aggregate invalidated nodes per (Selector + Recalc timestamp + Frame)
            for (const selector of invalidatedNode.selectorList) {
                const key = [
                    selector.selector, selector.styleSheetId, invalidatedNode.frame, invalidatedNode.lastUpdateLayoutTreeEventTs
                ].join('-');
                if (invalidatedNodeMap.has(key)) {
                    const nodes = invalidatedNodeMap.get(key);
                    nodes?.nodeList.push(invalidatedNodeDomNode);
                }
                else {
                    invalidatedNodeMap.set(key, { subtree: invalidatedNode.subtree, nodeList: [invalidatedNodeDomNode] });
                }
            }
        }
        for (const event of events) {
            const selectorStats = event ? __classPrivateFieldGet(this, _TimelineSelectorStatsView_parsedTrace, "f").SelectorStats.dataForUpdateLayoutEvent.get(event) : undefined;
            if (!selectorStats) {
                continue;
            }
            const frameId = event.args.beginData?.frame;
            for (const timing of selectorStats.timings) {
                timing.invalidation_count = 0;
                const key = [timing.selector, timing.style_sheet_id, frameId, event.ts].join('-');
                const nodes = invalidatedNodeMap.get(key);
                if (nodes === undefined) {
                    continue;
                }
                for (const node of nodes.nodeList) {
                    if (nodes.subtree) {
                        // TODO: this count is live and might have changed since the trace event.
                        timing.invalidation_count += this.getDescendentNodeCount(node);
                    }
                    else {
                        timing.invalidation_count += 1;
                    }
                }
            }
        }
    }
    async aggregateEvents(events) {
        if (!__classPrivateFieldGet(this, _TimelineSelectorStatsView_parsedTrace, "f")) {
            return;
        }
        const timings = [];
        const selectorMap = new Map();
        const sums = {
            [SelectorTimingsKey.Elapsed]: 0,
            [SelectorTimingsKey.MatchAttempts]: 0,
            [SelectorTimingsKey.MatchCount]: 0,
            [SelectorTimingsKey.FastRejectCount]: 0,
            [SelectorTimingsKey.InvalidationCount]: 0,
        };
        // Now we want to check if the set of events we have been given matches the
        // set of events we last rendered. We can't just compare the arrays because
        // they will be different events, so instead for each event in the new
        // array we see if it has a match in the old set of events at the same
        // index.
        if (Array.isArray(__classPrivateFieldGet(this, _TimelineSelectorStatsView_lastStatsSourceEventOrEvents, "f"))) {
            if (__classPrivateFieldGet(this, _TimelineSelectorStatsView_lastStatsSourceEventOrEvents, "f").length === events.length && events.every((event, index) => {
                // This is true due to the isArray check, but without this cast TS
                // would want us to repeat the isArray() check inside this callback,
                // but we want to avoid that extra work.
                const previousEvents = __classPrivateFieldGet(this, _TimelineSelectorStatsView_lastStatsSourceEventOrEvents, "f");
                return event === previousEvents[index];
            })) {
                return;
            }
        }
        __classPrivateFieldSet(this, _TimelineSelectorStatsView_lastStatsSourceEventOrEvents, events, "f");
        await this.updateInvalidationCount(events);
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const selectorStats = event ? __classPrivateFieldGet(this, _TimelineSelectorStatsView_parsedTrace, "f").SelectorStats.dataForUpdateLayoutEvent.get(event) : undefined;
            if (!selectorStats) {
                continue;
            }
            const data = selectorStats.timings;
            for (const timing of data) {
                const key = timing[SelectorTimingsKey.Selector] + '_' + timing[SelectorTimingsKey.StyleSheetId];
                const findTiming = selectorMap.get(key);
                if (findTiming !== undefined) {
                    findTiming[SelectorTimingsKey.Elapsed] += timing[SelectorTimingsKey.Elapsed];
                    findTiming[SelectorTimingsKey.FastRejectCount] += timing[SelectorTimingsKey.FastRejectCount];
                    findTiming[SelectorTimingsKey.MatchAttempts] += timing[SelectorTimingsKey.MatchAttempts];
                    findTiming[SelectorTimingsKey.MatchCount] += timing[SelectorTimingsKey.MatchCount];
                    findTiming[SelectorTimingsKey.InvalidationCount] += timing[SelectorTimingsKey.InvalidationCount];
                }
                else {
                    selectorMap.set(key, structuredClone(timing));
                }
                // Keep track of the total times for a sum row.
                sums[SelectorTimingsKey.Elapsed] += timing[SelectorTimingsKey.Elapsed];
                sums[SelectorTimingsKey.MatchAttempts] += timing[SelectorTimingsKey.MatchAttempts];
                sums[SelectorTimingsKey.MatchCount] += timing[SelectorTimingsKey.MatchCount];
                sums[SelectorTimingsKey.FastRejectCount] += timing[SelectorTimingsKey.FastRejectCount];
                sums[SelectorTimingsKey.InvalidationCount] += timing[SelectorTimingsKey.InvalidationCount];
            }
        }
        if (selectorMap.size > 0) {
            selectorMap.forEach(timing => {
                timings.push(timing);
            });
            selectorMap.clear();
        }
        else {
            __classPrivateFieldSet(this, _TimelineSelectorStatsView_timings, [], "f");
            return;
        }
        // Add the sum row.
        timings.unshift({
            [SelectorTimingsKey.Elapsed]: sums[SelectorTimingsKey.Elapsed],
            [SelectorTimingsKey.FastRejectCount]: sums[SelectorTimingsKey.FastRejectCount],
            [SelectorTimingsKey.MatchAttempts]: sums[SelectorTimingsKey.MatchAttempts],
            [SelectorTimingsKey.MatchCount]: sums[SelectorTimingsKey.MatchCount],
            [SelectorTimingsKey.Selector]: i18nString(UIStrings.totalForAllSelectors),
            [SelectorTimingsKey.StyleSheetId]: 'n/a',
            [SelectorTimingsKey.InvalidationCount]: sums[SelectorTimingsKey.InvalidationCount],
        });
        __classPrivateFieldSet(this, _TimelineSelectorStatsView_timings, await this.processSelectorTimings(timings), "f");
    }
    setAggregatedEvents(events) {
        if (!__classPrivateFieldGet(this, _TimelineSelectorStatsView_parsedTrace, "f")) {
            return;
        }
        void this.aggregateEvents(events).then(() => {
            this.requestUpdate();
        });
    }
    async processSelectorTimings(timings) {
        async function toSourceFileLocation(cssModel, styleSheetId, selectorText, selectorLocations) {
            if (!cssModel) {
                return undefined;
            }
            const styleSheetHeader = cssModel.styleSheetHeaderForId(styleSheetId);
            if (!styleSheetHeader || !styleSheetHeader.resourceURL()) {
                return undefined;
            }
            // get the locations from cache if available
            const key = JSON.stringify({ selectorText, styleSheetId });
            let ranges = selectorLocations.get(key);
            if (!ranges) {
                const result = await cssModel.agent.invoke_getLocationForSelector({ styleSheetId, selectorText });
                if (result.getError() || !result.ranges) {
                    return undefined;
                }
                ranges = result.ranges;
                selectorLocations.set(key, ranges);
            }
            const linkData = ranges.map(range => {
                return {
                    url: styleSheetHeader.resourceURL(),
                    lineNumber: range.startLine,
                    columnNumber: range.startColumn,
                    linkText: i18nString(UIStrings.lineNumber, { PH1: range.startLine + 1, PH2: range.startColumn + 1 }),
                    title: `${styleSheetHeader.id} line ${range.startLine + 1}:${range.startColumn + 1}`,
                };
            });
            return linkData;
        }
        const target = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
        const cssModel = target?.model(SDK.CSSModel.CSSModel);
        if (!cssModel) {
            return [];
        }
        return await Promise.all(timings.sort((a, b) => b[SelectorTimingsKey.Elapsed] - a[SelectorTimingsKey.Elapsed]).map(async (x) => {
            const styleSheetId = x[SelectorTimingsKey.StyleSheetId];
            const selectorText = x[SelectorTimingsKey.Selector].trim();
            const locations = styleSheetId === 'n/a' ?
                null :
                await toSourceFileLocation(cssModel, styleSheetId, selectorText, __classPrivateFieldGet(this, _TimelineSelectorStatsView_selectorLocations, "f"));
            return { ...x, locations };
        }));
    }
}
_TimelineSelectorStatsView_selectorLocations = new WeakMap(), _TimelineSelectorStatsView_parsedTrace = new WeakMap(), _TimelineSelectorStatsView_lastStatsSourceEventOrEvents = new WeakMap(), _TimelineSelectorStatsView_view = new WeakMap(), _TimelineSelectorStatsView_timings = new WeakMap(), _TimelineSelectorStatsView_instances = new WeakSet(), _TimelineSelectorStatsView_onContextMenu = function _TimelineSelectorStatsView_onContextMenu(e) {
    const { menu } = e.detail;
    menu.defaultSection().appendItem(i18nString(UIStrings.copyTable), () => {
        const tableData = [];
        const columnName = [
            i18nString(UIStrings.elapsed), i18nString(UIStrings.matchAttempts), i18nString(UIStrings.matchCount),
            i18nString(UIStrings.slowPathNonMatches), i18nString(UIStrings.selector), i18nString(UIStrings.styleSheetId)
        ];
        tableData.push(columnName.join('\t'));
        for (const timing of __classPrivateFieldGet(this, _TimelineSelectorStatsView_timings, "f")) {
            const nonMatches = timing[SelectorTimingsKey.MatchAttempts] - timing[SelectorTimingsKey.MatchCount];
            const slowPathNonMatches = (nonMatches ? 1.0 - timing[SelectorTimingsKey.FastRejectCount] / nonMatches : 0) * 100;
            const styleSheetId = timing[SelectorTimingsKey.StyleSheetId];
            let linkData = '';
            const target = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
            const cssModel = target?.model(SDK.CSSModel.CSSModel);
            if (cssModel) {
                const styleSheetHeader = cssModel.styleSheetHeaderForId(styleSheetId);
                if (styleSheetHeader) {
                    linkData = styleSheetHeader.resourceURL().toString();
                }
            }
            if (!linkData) {
                linkData = i18nString(UIStrings.unableToLink);
            }
            tableData.push([
                timing[SelectorTimingsKey.Elapsed] / 1000.0,
                timing[SelectorTimingsKey.MatchAttempts],
                timing[SelectorTimingsKey.MatchCount],
                slowPathNonMatches,
                timing[SelectorTimingsKey.Selector],
                linkData,
            ].join('\t'));
        }
        const data = tableData.join('\n');
        CopyToClipboard.copyTextToClipboard(data, i18nString(UIStrings.tableCopiedToClipboard));
    });
};
//# sourceMappingURL=TimelineSelectorStatsView.js.map