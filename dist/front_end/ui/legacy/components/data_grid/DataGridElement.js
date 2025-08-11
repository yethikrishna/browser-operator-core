// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _DataGridElement_instances, _DataGridElement_dataGrid, _DataGridElement_mutationObserver, _DataGridElement_resizeObserver, _DataGridElement_shadowRoot, _DataGridElement_columns, _DataGridElement_hideableColumns, _DataGridElement_hiddenColumns, _DataGridElement_usedCreationNode, _DataGridElement_updateColumns, _DataGridElement_needUpdateColumns, _DataGridElement_getDataRows, _DataGridElement_findNextExistingNode, _DataGridElement_addNodes, _DataGridElement_removeNodes, _DataGridElement_updateNode, _DataGridElement_updateCreationNode, _DataGridElement_onChange, _DataGridElement_editCallback, _DataGridElement_deleteCallback, _DataGridElement_refreshCallback, _DataGridElementNode_instances, _a, _DataGridElementNode_elementToNode, _DataGridElementNode_configElement, _DataGridElementNode_dataGridElement, _DataGridElementNode_addedClasses, _DataGridElementNode_updateData, _DataGridElementNode_onRowMouseEvent;
import * as UI from '../../../../ui/legacy/legacy.js';
import dataGridStyles from './dataGrid.css.js';
import { SortableDataGrid, SortableDataGridNode } from './SortableDataGrid.js';
const DUMMY_COLUMN_ID = 'dummy'; // SortableDataGrid.create requires at least one column.
/**
 * A data grid (table) element that can be used as progressive enhancement over a <table> element.
 *
 * It can be used as
 * ```
 * <devtools-data-grid striped name=${'Display Name'}>
 *   <table>
 *     <tr>
 *       <th id="column-1">Column 1</th>
 *       <th id="column-2">Column 2</th>
 *     </tr>
 *     <tr>
 *       <td>Value 1</td>
 *       <td>Value 2</td>
 *     </tr>
 *   </table>
 * </devtools-data-grid>
 * ```
 * where a row with <th> configures the columns and rows with <td> provide the data.
 *
 * Under the hood it uses SortableDataGrid, which extends ViewportDataGrid so only
 * visible rows are layed out and sorting is provided out of the box.
 *
 * @attr striped
 * @attr displayName
 * @prop filters
 */
class DataGridElement extends HTMLElement {
    constructor() {
        super();
        _DataGridElement_instances.add(this);
        _DataGridElement_dataGrid.set(this, SortableDataGrid.create([DUMMY_COLUMN_ID], [], ''));
        _DataGridElement_mutationObserver.set(this, new MutationObserver(__classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_onChange).bind(this)));
        _DataGridElement_resizeObserver.set(this, new ResizeObserver(() => {
            if (!this.inline) {
                __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").onResize();
            }
        }));
        _DataGridElement_shadowRoot.set(this, void 0);
        _DataGridElement_columns.set(this, []);
        _DataGridElement_hideableColumns.set(this, new Set());
        _DataGridElement_hiddenColumns.set(this, new Set());
        _DataGridElement_usedCreationNode.set(this, null);
        // TODO(dsv): Move this to the data_grid.css once all the data grid usage is migrated to this web component.
        this.style.display = 'flex';
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").element.style.flex = 'auto';
        __classPrivateFieldSet(this, _DataGridElement_shadowRoot, UI.UIUtils.createShadowRootWithCoreStyles(this, { delegatesFocus: true, cssFile: dataGridStyles }), "f");
        __classPrivateFieldGet(this, _DataGridElement_shadowRoot, "f").appendChild(__classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").element);
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").addEventListener("SelectedNode" /* DataGridEvents.SELECTED_NODE */, e => this.dispatchEvent(new CustomEvent('select', { detail: e.data.configElement })));
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").addEventListener("DeselectedNode" /* DataGridEvents.DESELECTED_NODE */, () => this.dispatchEvent(new CustomEvent('select', { detail: null })));
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").addEventListener("SortingChanged" /* DataGridEvents.SORTING_CHANGED */, () => this.dispatchEvent(new CustomEvent('sort', {
            detail: { columnId: __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").sortColumnId(), ascending: __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").isSortOrderAscending() }
        })));
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").setRowContextMenuCallback((menu, node) => {
            this.dispatchEvent(new CustomEvent('contextmenu', { detail: { menu, element: node.configElement } }));
        });
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").setHeaderContextMenuCallback(menu => {
            for (const column of __classPrivateFieldGet(this, _DataGridElement_columns, "f")) {
                if (__classPrivateFieldGet(this, _DataGridElement_hideableColumns, "f").has(column.id)) {
                    menu.defaultSection().appendCheckboxItem(__classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").columns[column.id].title, () => {
                        if (__classPrivateFieldGet(this, _DataGridElement_hiddenColumns, "f").has(column.id)) {
                            __classPrivateFieldGet(this, _DataGridElement_hiddenColumns, "f").delete(column.id);
                        }
                        else {
                            __classPrivateFieldGet(this, _DataGridElement_hiddenColumns, "f").add(column.id);
                        }
                        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").setColumnsVisibility(new Set(__classPrivateFieldGet(this, _DataGridElement_columns, "f").map(({ id }) => id).filter(column => !__classPrivateFieldGet(this, _DataGridElement_hiddenColumns, "f").has(column))));
                    }, { checked: !__classPrivateFieldGet(this, _DataGridElement_hiddenColumns, "f").has(column.id) });
                }
            }
        });
        __classPrivateFieldGet(this, _DataGridElement_mutationObserver, "f").observe(this, { childList: true, attributes: true, subtree: true, characterData: true });
        __classPrivateFieldGet(this, _DataGridElement_resizeObserver, "f").observe(this);
        __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_updateColumns).call(this);
        __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_addNodes).call(this, this.querySelectorAll('tr'));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        switch (name) {
            case 'striped':
                __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").setStriped(newValue !== 'true');
                break;
            case 'name':
                __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").displayName = newValue ?? '';
                break;
            case 'inline':
                __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").renderInline();
                break;
        }
    }
    set striped(striped) {
        this.toggleAttribute('striped', striped);
    }
    get striped() {
        return hasBooleanAttribute(this, 'striped');
    }
    set inline(striped) {
        this.toggleAttribute('inline', striped);
    }
    get inline() {
        return hasBooleanAttribute(this, 'inline');
    }
    set displayName(displayName) {
        this.setAttribute('name', displayName);
    }
    get displayName() {
        return this.getAttribute('name');
    }
    set filters(filters) {
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").setFilters(filters);
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").element.setAttribute('aria-rowcount', String(__classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").getNumberOfRows()));
    }
    get columns() {
        return __classPrivateFieldGet(this, _DataGridElement_columns, "f");
    }
    addEventListener(...args) {
        super.addEventListener(...args);
        if (args[0] === 'refresh') {
            __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").refreshCallback = __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_refreshCallback).bind(this);
        }
    }
}
_DataGridElement_dataGrid = new WeakMap(), _DataGridElement_mutationObserver = new WeakMap(), _DataGridElement_resizeObserver = new WeakMap(), _DataGridElement_shadowRoot = new WeakMap(), _DataGridElement_columns = new WeakMap(), _DataGridElement_hideableColumns = new WeakMap(), _DataGridElement_hiddenColumns = new WeakMap(), _DataGridElement_usedCreationNode = new WeakMap(), _DataGridElement_instances = new WeakSet(), _DataGridElement_updateColumns = function _DataGridElement_updateColumns() {
    for (const column of Object.keys(__classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").columns)) {
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").removeColumn(column);
    }
    __classPrivateFieldGet(this, _DataGridElement_hideableColumns, "f").clear();
    __classPrivateFieldSet(this, _DataGridElement_columns, [], "f");
    let hasEditableColumn = false;
    for (const column of this.querySelectorAll('th[id]') || []) {
        const id = column.id;
        let title = column.textContent?.trim() || '';
        const titleDOMFragment = column.firstElementChild ? document.createDocumentFragment() : undefined;
        if (titleDOMFragment) {
            title = '';
            for (const child of column.children) {
                titleDOMFragment.appendChild(child.cloneNode(true));
                title += child.shadowRoot ? child.shadowRoot.textContent : child.textContent;
            }
        }
        const sortable = hasBooleanAttribute(column, 'sortable');
        const width = column.getAttribute('width') ?? undefined;
        const fixedWidth = column.hasAttribute('fixed');
        let align = column.getAttribute('align') ?? undefined;
        if (align !== "center" /* Align.CENTER */ && align !== "right" /* Align.RIGHT */) {
            align = undefined;
        }
        const dataType = column.getAttribute('type') === 'boolean' ? "Boolean" /* DataType.BOOLEAN */ : "String" /* DataType.STRING */;
        const weight = parseFloat(column.getAttribute('weight') || '') ?? undefined;
        const editable = column.hasAttribute('editable');
        if (editable) {
            hasEditableColumn = true;
        }
        const columnDescriptor = {
            id,
            title: title,
            titleDOMFragment,
            sortable,
            fixedWidth,
            width,
            align,
            weight,
            editable,
            dataType,
        };
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").addColumn(columnDescriptor);
        __classPrivateFieldGet(this, _DataGridElement_columns, "f").push(columnDescriptor);
        if (hasBooleanAttribute(column, 'hideable')) {
            __classPrivateFieldGet(this, _DataGridElement_hideableColumns, "f").add(id);
        }
    }
    const visibleColumns = new Set(__classPrivateFieldGet(this, _DataGridElement_columns, "f").map(({ id }) => id).filter(id => !__classPrivateFieldGet(this, _DataGridElement_hiddenColumns, "f").has(id)));
    if (visibleColumns.size) {
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").setColumnsVisibility(visibleColumns);
    }
    __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").setEditCallback(hasEditableColumn ? __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_editCallback).bind(this) : undefined, INTERNAL_TOKEN);
    __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").deleteCallback = hasEditableColumn ? __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_deleteCallback).bind(this) : undefined;
}, _DataGridElement_needUpdateColumns = function _DataGridElement_needUpdateColumns(mutationList) {
    for (const mutation of mutationList) {
        for (const element of [...mutation.removedNodes, ...mutation.addedNodes]) {
            if (!(element instanceof HTMLElement)) {
                continue;
            }
            if (element.nodeName === 'TH' || element.querySelector('th')) {
                return true;
            }
        }
        if (mutation.target instanceof HTMLElement && mutation.target.closest('th')) {
            return true;
        }
    }
    return false;
}, _DataGridElement_getDataRows = function _DataGridElement_getDataRows(nodes) {
    return [...nodes]
        .flatMap(node => {
        if (node instanceof HTMLTableRowElement) {
            return [node];
        }
        if (node instanceof HTMLElement) {
            return [...node.querySelectorAll('tr')];
        }
        return [];
    })
        .filter(node => node.querySelector('td') && !hasBooleanAttribute(node, 'placeholder'));
}, _DataGridElement_findNextExistingNode = function _DataGridElement_findNextExistingNode(element) {
    for (let e = element.nextElementSibling; e; e = e.nextElementSibling) {
        const nextNode = DataGridElementNode.get(e);
        if (nextNode) {
            return nextNode;
        }
    }
    return null;
}, _DataGridElement_addNodes = function _DataGridElement_addNodes(nodes) {
    for (const element of __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_getDataRows).call(this, nodes)) {
        const parentNode = __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").rootNode(); // TODO(dsv): support nested nodes
        const nextNode = __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_findNextExistingNode).call(this, element);
        const index = nextNode ? parentNode.children.indexOf(nextNode) : parentNode.children.length;
        const node = new DataGridElementNode(element, this);
        parentNode.insertChild(node, index);
        if (hasBooleanAttribute(element, 'selected')) {
            node.select();
        }
        if (hasBooleanAttribute(element, 'dirty')) {
            node.setDirty(true);
        }
        if (hasBooleanAttribute(element, 'inactive')) {
            node.setInactive(true);
        }
        if (hasBooleanAttribute(element, 'highlighted')) {
            node.setHighlighted(true);
        }
    }
}, _DataGridElement_removeNodes = function _DataGridElement_removeNodes(nodes) {
    for (const element of __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_getDataRows).call(this, nodes)) {
        const node = DataGridElementNode.get(element);
        if (node) {
            node.remove();
        }
    }
}, _DataGridElement_updateNode = function _DataGridElement_updateNode(node, attributeName) {
    while (node?.parentNode && !(node instanceof HTMLElement)) {
        node = node.parentNode;
    }
    const dataRow = node instanceof HTMLElement ? node.closest('tr') : null;
    const dataGridNode = dataRow ? DataGridElementNode.get(dataRow) : null;
    if (dataGridNode && dataRow) {
        if (attributeName === 'selected') {
            if (hasBooleanAttribute(dataRow, 'selected')) {
                dataGridNode.select();
            }
            else {
                dataGridNode.deselect();
            }
        }
        else if (attributeName === 'dirty') {
            dataGridNode.setDirty(hasBooleanAttribute(dataRow, 'dirty'));
        }
        else if (attributeName === 'inactive') {
            dataGridNode.setInactive(hasBooleanAttribute(dataRow, 'inactive'));
        }
        else if (attributeName === 'highlighted') {
            dataGridNode.setHighlighted(hasBooleanAttribute(dataRow, 'highlighted'));
        }
        else {
            dataGridNode.refresh();
        }
    }
}, _DataGridElement_updateCreationNode = function _DataGridElement_updateCreationNode() {
    if (__classPrivateFieldGet(this, _DataGridElement_usedCreationNode, "f")) {
        DataGridElementNode.remove(__classPrivateFieldGet(this, _DataGridElement_usedCreationNode, "f"));
        __classPrivateFieldSet(this, _DataGridElement_usedCreationNode, null, "f");
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").creationNode = undefined;
    }
    const placeholder = this.querySelector('tr[placeholder]');
    if (!placeholder) {
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").creationNode?.remove();
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").creationNode = undefined;
    }
    else if (!DataGridElementNode.get(placeholder)) {
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").creationNode?.remove();
        const node = new DataGridElementNode(placeholder, this);
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").creationNode = node;
        __classPrivateFieldGet(this, _DataGridElement_dataGrid, "f").rootNode().appendChild(node);
    }
}, _DataGridElement_onChange = function _DataGridElement_onChange(mutationList) {
    if (__classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_needUpdateColumns).call(this, mutationList)) {
        __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_updateColumns).call(this);
    }
    __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_updateCreationNode).call(this);
    for (const mutation of mutationList) {
        __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_removeNodes).call(this, mutation.removedNodes);
        __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_addNodes).call(this, mutation.addedNodes);
        __classPrivateFieldGet(this, _DataGridElement_instances, "m", _DataGridElement_updateNode).call(this, mutation.target, mutation.attributeName);
    }
}, _DataGridElement_editCallback = function _DataGridElement_editCallback(node, columnId, valueBeforeEditing, newText, moveDirection) {
    if (node.isCreationNode) {
        __classPrivateFieldSet(this, _DataGridElement_usedCreationNode, node, "f");
        let hasNextEditableColumn = false;
        if (moveDirection) {
            const index = __classPrivateFieldGet(this, _DataGridElement_columns, "f").findIndex(({ id }) => id === columnId);
            const nextColumns = moveDirection === 'forward' ? __classPrivateFieldGet(this, _DataGridElement_columns, "f").slice(index + 1) : __classPrivateFieldGet(this, _DataGridElement_columns, "f").slice(0, index);
            hasNextEditableColumn = nextColumns.some(({ editable }) => editable);
        }
        if (!hasNextEditableColumn) {
            node.deselect();
        }
        return;
    }
    this.dispatchEvent(new CustomEvent('edit', { detail: { node: node.configElement, columnId, valueBeforeEditing, newText } }));
}, _DataGridElement_deleteCallback = function _DataGridElement_deleteCallback(node) {
    this.dispatchEvent(new CustomEvent('delete', { detail: node.configElement }));
}, _DataGridElement_refreshCallback = function _DataGridElement_refreshCallback() {
    this.dispatchEvent(new CustomEvent('refresh'));
};
DataGridElement.observedAttributes = ['striped', 'name', 'inline'];
class DataGridElementNode extends SortableDataGridNode {
    constructor(configElement, dataGridElement) {
        super();
        _DataGridElementNode_instances.add(this);
        _DataGridElementNode_configElement.set(this, void 0);
        _DataGridElementNode_dataGridElement.set(this, void 0);
        _DataGridElementNode_addedClasses.set(this, new Set());
        __classPrivateFieldSet(this, _DataGridElementNode_configElement, configElement, "f");
        __classPrivateFieldGet(_a, _a, "f", _DataGridElementNode_elementToNode).set(configElement, this);
        __classPrivateFieldSet(this, _DataGridElementNode_dataGridElement, dataGridElement, "f");
        __classPrivateFieldGet(this, _DataGridElementNode_instances, "m", _DataGridElementNode_updateData).call(this);
        this.isCreationNode = hasBooleanAttribute(__classPrivateFieldGet(this, _DataGridElementNode_configElement, "f"), 'placeholder');
    }
    static get(configElement) {
        return configElement && __classPrivateFieldGet(_a, _a, "f", _DataGridElementNode_elementToNode).get(configElement);
    }
    get configElement() {
        return __classPrivateFieldGet(this, _DataGridElementNode_configElement, "f");
    }
    createElement() {
        const element = super.createElement();
        element.addEventListener('click', __classPrivateFieldGet(this, _DataGridElementNode_instances, "m", _DataGridElementNode_onRowMouseEvent).bind(this));
        element.addEventListener('mouseenter', __classPrivateFieldGet(this, _DataGridElementNode_instances, "m", _DataGridElementNode_onRowMouseEvent).bind(this));
        element.addEventListener('mouseleave', __classPrivateFieldGet(this, _DataGridElementNode_instances, "m", _DataGridElementNode_onRowMouseEvent).bind(this));
        if (__classPrivateFieldGet(this, _DataGridElementNode_configElement, "f").hasAttribute('style')) {
            element.setAttribute('style', __classPrivateFieldGet(this, _DataGridElementNode_configElement, "f").getAttribute('style') || '');
        }
        for (const classToAdd of __classPrivateFieldGet(this, _DataGridElementNode_configElement, "f").classList) {
            element.classList.add(classToAdd);
        }
        return element;
    }
    refresh() {
        __classPrivateFieldGet(this, _DataGridElementNode_instances, "m", _DataGridElementNode_updateData).call(this);
        super.refresh();
        const existingElement = this.existingElement();
        if (!existingElement) {
            return;
        }
        if (__classPrivateFieldGet(this, _DataGridElementNode_configElement, "f").hasAttribute('style')) {
            existingElement.setAttribute('style', __classPrivateFieldGet(this, _DataGridElementNode_configElement, "f").getAttribute('style') || '');
        }
        for (const addedClass of __classPrivateFieldGet(this, _DataGridElementNode_addedClasses, "f")) {
            existingElement.classList.remove(addedClass);
        }
        for (const classToAdd of __classPrivateFieldGet(this, _DataGridElementNode_configElement, "f").classList) {
            existingElement.classList.add(classToAdd);
        }
    }
    createCells(element) {
        const configCells = [...__classPrivateFieldGet(this, _DataGridElementNode_configElement, "f").querySelectorAll('td')];
        const hasCollspan = configCells.some(cell => cell.hasAttribute('colspan'));
        if (!hasCollspan) {
            super.createCells(element);
        }
        else {
            for (const cell of configCells) {
                element.appendChild(cell.cloneNode(true));
            }
        }
    }
    createCell(columnId) {
        const index = __classPrivateFieldGet(this, _DataGridElementNode_dataGridElement, "f").columns.findIndex(({ id }) => id === columnId);
        if (__classPrivateFieldGet(this, _DataGridElementNode_dataGridElement, "f").columns[index].dataType === "Boolean" /* DataType.BOOLEAN */) {
            return super.createCell(columnId);
        }
        const cell = this.createTD(columnId);
        cell.setAttribute('part', `${columnId}-column`);
        if (this.isCreationNode) {
            return cell;
        }
        const configCell = __classPrivateFieldGet(this, _DataGridElementNode_configElement, "f").querySelectorAll('td')[index];
        if (!configCell) {
            throw new Error(`Column ${columnId} not found in the data grid`);
        }
        for (const child of configCell.childNodes) {
            cell.appendChild(child.cloneNode(true));
        }
        for (const cssClass of configCell.classList) {
            cell.classList.add(cssClass);
        }
        cell.title = configCell.title;
        if (configCell.hasAttribute('aria-label')) {
            this.setCellAccessibleName(configCell.getAttribute('aria-label') || '', cell, columnId);
        }
        const style = configCell.getAttribute('style');
        if (style !== null) {
            cell.setAttribute('style', style);
        }
        return cell;
    }
    static remove(node) {
        __classPrivateFieldGet(_a, _a, "f", _DataGridElementNode_elementToNode).delete(__classPrivateFieldGet(node, _DataGridElementNode_configElement, "f"));
        node.remove();
    }
    deselect() {
        super.deselect();
        if (this.isCreationNode) {
            __classPrivateFieldGet(this, _DataGridElementNode_dataGridElement, "f").dispatchEvent(new CustomEvent('create', { detail: this.data }));
        }
    }
}
_a = DataGridElementNode, _DataGridElementNode_configElement = new WeakMap(), _DataGridElementNode_dataGridElement = new WeakMap(), _DataGridElementNode_addedClasses = new WeakMap(), _DataGridElementNode_instances = new WeakSet(), _DataGridElementNode_updateData = function _DataGridElementNode_updateData() {
    const cells = __classPrivateFieldGet(this, _DataGridElementNode_configElement, "f").querySelectorAll('td');
    for (let i = 0; i < cells.length; ++i) {
        const cell = cells[i];
        const column = __classPrivateFieldGet(this, _DataGridElementNode_dataGridElement, "f").columns[i];
        if (column.dataType === "Boolean" /* DataType.BOOLEAN */) {
            this.data[column.id] = hasBooleanAttribute(cell, 'data-value');
        }
        else {
            this.data[column.id] = cell.dataset.value ?? cell.textContent ?? '';
        }
    }
}, _DataGridElementNode_onRowMouseEvent = function _DataGridElementNode_onRowMouseEvent(event) {
    let currentElement = event.target;
    const childIndexesOnPathToRoot = [];
    while (currentElement?.parentElement && currentElement !== event.currentTarget) {
        childIndexesOnPathToRoot.push([...currentElement.parentElement.children].indexOf(currentElement));
        currentElement = currentElement.parentElement;
    }
    if (!currentElement) {
        throw new Error('Cell click event target not found in the data grid');
    }
    let targetInConfigRow = __classPrivateFieldGet(this, _DataGridElementNode_configElement, "f");
    for (const index of childIndexesOnPathToRoot.reverse()) {
        targetInConfigRow = targetInConfigRow.children[index];
    }
    if (targetInConfigRow instanceof HTMLElement) {
        targetInConfigRow?.dispatchEvent(new MouseEvent(event.type, { bubbles: true, composed: true }));
    }
};
_DataGridElementNode_elementToNode = { value: new WeakMap() };
customElements.define('devtools-data-grid', DataGridElement);
function hasBooleanAttribute(element, name) {
    return element.hasAttribute(name) && element.getAttribute(name) !== 'false';
}
const INTERNAL_TOKEN = {
    token: 'DataGridInternalToken'
};
//# sourceMappingURL=DataGridElement.js.map