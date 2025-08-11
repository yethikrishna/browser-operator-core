// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _Table_instances, _Table_shadow, _Table_insight, _Table_state, _Table_headers, _Table_rows, _Table_flattenedRows, _Table_rowToParentRow, _Table_interactive, _Table_currentHoverIndex, _Table_onHoverRow, _Table_onClickRow, _Table_onMouseLeave, _Table_onSelectedRowChanged, _Table_render;
import * as i18n from '../../../../core/i18n/i18n.js';
import * as ComponentHelpers from '../../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../../ui/lit/lit.js';
import { EventReferenceClick } from './EventRef.js';
import tableStyles from './table.css.js';
const UIStrings = {
    /**
     * @description Table row value representing the remaining items not shown in the table due to size constraints. This row will always represent at least 2 items.
     * @example {5} PH1
     */
    others: '{PH1} others',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/insights/Table.ts', UIStrings);
export const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { html } = Lit;
export function renderOthersLabel(numOthers) {
    return i18nString(UIStrings.others, { PH1: numOthers });
}
/**
 * Maps `arr` to a list of `TableDataRow`s  using `aggregator.mapToRow`, but limits the number of `TableDataRow`s to `limit`.
 * If the length of `arr` is larger than `limit`, any excess rows will be aggregated into the final `TableDataRow` using `aggregator.createAggregatedTableRow`.
 *
 * Useful for creating a "N others" row in a data table.
 *
 * Example: `arr` is a list of 15 items & `limit` is 10. The first 9 items in `arr` would be mapped to `TableDataRow`s using `aggregator.mapToRow` and
 * the 10th `TableDataRow` would be created by using `aggregator.createAggregatedTableRow` on the 6 items that were not sent through `aggregator.mapToRow`.
 */
export function createLimitedRows(arr, aggregator, limit = 10) {
    if (arr.length === 0 || limit === 0) {
        return [];
    }
    const aggregateStartIndex = limit - 1;
    const items = arr.slice(0, aggregateStartIndex).map(aggregator.mapToRow.bind(aggregator));
    if (arr.length > limit) {
        items.push(aggregator.createAggregatedTableRow(arr.slice(aggregateStartIndex)));
    }
    else if (arr.length === limit) {
        items.push(aggregator.mapToRow(arr[aggregateStartIndex]));
    }
    return items;
}
export class Table extends HTMLElement {
    constructor() {
        super(...arguments);
        _Table_instances.add(this);
        _Table_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _Table_insight.set(this, void 0);
        _Table_state.set(this, void 0);
        _Table_headers.set(this, void 0);
        /** The rows as given as by the user, which may include recursive rows via subRows. */
        _Table_rows.set(this, void 0);
        /** All rows/subRows, in the order that they appear visually. This is the result of traversing `#rows` and any subRows found. */
        _Table_flattenedRows.set(this, void 0);
        _Table_rowToParentRow.set(this, new Map());
        _Table_interactive.set(this, false);
        _Table_currentHoverIndex.set(this, null);
    }
    set data(data) {
        __classPrivateFieldSet(this, _Table_insight, data.insight, "f");
        __classPrivateFieldSet(this, _Table_state, data.insight.sharedTableState, "f");
        __classPrivateFieldSet(this, _Table_headers, data.headers, "f");
        __classPrivateFieldSet(this, _Table_rows, data.rows, "f");
        // If this table isn't interactive, don't attach mouse listeners or use CSS :hover.
        __classPrivateFieldSet(this, _Table_interactive, __classPrivateFieldGet(this, _Table_rows, "f").some(row => row.overlays || row.subRows?.length), "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Table_instances, "m", _Table_render));
    }
    connectedCallback() {
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Table_instances, "m", _Table_render));
    }
}
_Table_shadow = new WeakMap(), _Table_insight = new WeakMap(), _Table_state = new WeakMap(), _Table_headers = new WeakMap(), _Table_rows = new WeakMap(), _Table_flattenedRows = new WeakMap(), _Table_rowToParentRow = new WeakMap(), _Table_interactive = new WeakMap(), _Table_currentHoverIndex = new WeakMap(), _Table_instances = new WeakSet(), _Table_onHoverRow = function _Table_onHoverRow(e) {
    if (!__classPrivateFieldGet(this, _Table_flattenedRows, "f")) {
        return;
    }
    if (!(e.target instanceof HTMLElement)) {
        return;
    }
    const rowEl = e.target.closest('tr');
    if (!rowEl?.parentElement) {
        return;
    }
    const rowEls = [...rowEl.parentElement.children];
    const index = rowEl.sectionRowIndex;
    if (index === __classPrivateFieldGet(this, _Table_currentHoverIndex, "f")) {
        return;
    }
    for (const el of rowEl.parentElement.querySelectorAll('.hover')) {
        el.classList.remove('hover');
    }
    // Add 'hover' class to all parent rows.
    let row = __classPrivateFieldGet(this, _Table_rowToParentRow, "f").get(__classPrivateFieldGet(this, _Table_flattenedRows, "f")[index]);
    while (row) {
        const index = __classPrivateFieldGet(this, _Table_flattenedRows, "f").indexOf(row);
        const rowEl = rowEls[index];
        rowEl.classList.add('hover');
        row = __classPrivateFieldGet(this, _Table_rowToParentRow, "f").get(row);
    }
    __classPrivateFieldSet(this, _Table_currentHoverIndex, index, "f");
    // Temporarily selects the row, but only if there is not already a sticky selection.
    __classPrivateFieldGet(this, _Table_instances, "m", _Table_onSelectedRowChanged).call(this, rowEl, index, { isHover: true });
}, _Table_onClickRow = function _Table_onClickRow(e) {
    if (!(e.target instanceof HTMLElement)) {
        return;
    }
    const rowEl = e.target.closest('tr');
    if (!rowEl?.parentElement) {
        return;
    }
    const index = [...rowEl.parentElement.children].indexOf(rowEl);
    if (index === -1) {
        return;
    }
    // If the desired overlays consist of just a single ENTRY_OUTLINE, then
    // it is more intuitive to just select the target event.
    const overlays = __classPrivateFieldGet(this, _Table_flattenedRows, "f")?.[index]?.overlays;
    if (overlays?.length === 1 && overlays[0].type === 'ENTRY_OUTLINE') {
        this.dispatchEvent(new EventReferenceClick(overlays[0].entry));
        return;
    }
    // Select the row and make it sticky.
    __classPrivateFieldGet(this, _Table_instances, "m", _Table_onSelectedRowChanged).call(this, rowEl, index, { sticky: true });
}, _Table_onMouseLeave = function _Table_onMouseLeave() {
    for (const el of this.shadowRoot?.querySelectorAll('.hover') ?? []) {
        el.classList.remove('hover');
    }
    __classPrivateFieldSet(this, _Table_currentHoverIndex, null, "f");
    // Unselect the row, unless it's sticky.
    __classPrivateFieldGet(this, _Table_instances, "m", _Table_onSelectedRowChanged).call(this, null, null);
}, _Table_onSelectedRowChanged = function _Table_onSelectedRowChanged(rowEl, rowIndex, opts = {}) {
    if (!__classPrivateFieldGet(this, _Table_flattenedRows, "f") || !__classPrivateFieldGet(this, _Table_state, "f") || !__classPrivateFieldGet(this, _Table_insight, "f")) {
        return;
    }
    if (__classPrivateFieldGet(this, _Table_state, "f").selectionIsSticky && !opts.sticky) {
        return;
    }
    // Unselect a sticky-selection when clicking it for a second time.
    if (__classPrivateFieldGet(this, _Table_state, "f").selectionIsSticky && rowEl === __classPrivateFieldGet(this, _Table_state, "f").selectedRowEl) {
        rowEl = null;
        opts.sticky = false;
    }
    if (rowEl && rowIndex !== null) {
        const overlays = __classPrivateFieldGet(this, _Table_flattenedRows, "f")[rowIndex].overlays;
        if (overlays) {
            __classPrivateFieldGet(this, _Table_insight, "f").toggleTemporaryOverlays(overlays, { updateTraceWindow: !opts.isHover });
        }
    }
    else {
        __classPrivateFieldGet(this, _Table_insight, "f").toggleTemporaryOverlays(null, { updateTraceWindow: false });
    }
    __classPrivateFieldGet(this, _Table_state, "f").selectedRowEl?.classList.remove('selected');
    rowEl?.classList.add('selected');
    __classPrivateFieldGet(this, _Table_state, "f").selectedRowEl = rowEl;
    __classPrivateFieldGet(this, _Table_state, "f").selectionIsSticky = opts.sticky ?? false;
}, _Table_render = async function _Table_render() {
    if (!__classPrivateFieldGet(this, _Table_headers, "f") || !__classPrivateFieldGet(this, _Table_rows, "f")) {
        return;
    }
    const rowToParentRow = __classPrivateFieldGet(this, _Table_rowToParentRow, "f");
    rowToParentRow.clear();
    const numColumns = __classPrivateFieldGet(this, _Table_headers, "f").length;
    const flattenedRows = [];
    const rowEls = [];
    function traverse(parent, row, depth = 0) {
        if (parent) {
            rowToParentRow.set(row, parent);
        }
        const thStyles = Lit.Directives.styleMap({
            paddingLeft: `calc(${depth} * var(--sys-size-5))`,
            backgroundImage: `repeating-linear-gradient(
              to right,
              var(--sys-color-tonal-outline) 0 var(--sys-size-1),
              transparent var(--sys-size-1) var(--sys-size-5)
            )`,
            backgroundPosition: '0 0',
            backgroundRepeat: 'no-repeat',
            backgroundSize: `calc(${depth} * var(--sys-size-5))`,
        });
        const trStyles = Lit.Directives.styleMap({
            color: depth ? 'var(--sys-color-on-surface-subtle)' : '',
        });
        const columnEls = row.values.map((value, i) => i === 0 ? html `<th
                scope="row"
                colspan=${i === row.values.length - 1 ? numColumns - i : 1}
                style=${thStyles}>${value}
              </th>` :
            html `<td>${value}</td>`);
        rowEls.push(html `<tr style=${trStyles}>${columnEls}</tr>`);
        flattenedRows.push(row);
        for (const subRow of row.subRows ?? []) {
            traverse(row, subRow, depth + 1);
        }
    }
    for (const row of __classPrivateFieldGet(this, _Table_rows, "f")) {
        traverse(null, row);
    }
    __classPrivateFieldSet(this, _Table_flattenedRows, flattenedRows, "f");
    Lit.render(html `<style>${tableStyles}</style>
      <table
          class=${Lit.Directives.classMap({
        interactive: __classPrivateFieldGet(this, _Table_interactive, "f"),
    })}
          @mouseleave=${__classPrivateFieldGet(this, _Table_interactive, "f") ? __classPrivateFieldGet(this, _Table_instances, "m", _Table_onMouseLeave) : null}>
        <thead>
          <tr>
          ${__classPrivateFieldGet(this, _Table_headers, "f").map(h => html `<th scope="col">${h}</th>`)}
          </tr>
        </thead>
        <tbody
          @mouseover=${__classPrivateFieldGet(this, _Table_interactive, "f") ? __classPrivateFieldGet(this, _Table_instances, "m", _Table_onHoverRow) : null}
          @click=${__classPrivateFieldGet(this, _Table_interactive, "f") ? __classPrivateFieldGet(this, _Table_instances, "m", _Table_onClickRow) : null}
        >${rowEls}</tbody>
      </table>`, __classPrivateFieldGet(this, _Table_shadow, "f"), { host: this });
};
customElements.define('devtools-performance-table', Table);
//# sourceMappingURL=Table.js.map