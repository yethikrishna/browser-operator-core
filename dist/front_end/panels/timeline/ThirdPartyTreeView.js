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
var _ThirdPartyTreeViewWidget_instances, _ThirdPartyTreeViewWidget_getEventsForEventDispatch, _ThirdPartyTreeElement_treeView;
import * as i18n from '../../core/i18n/i18n.js';
import * as Trace from '../../models/trace/trace.js';
import * as DataGrid from '../../ui/legacy/components/data_grid/data_grid.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import thirdPartyTreeViewStyles from './thirdPartyTreeView.css.js';
import * as TimelineTreeView from './TimelineTreeView.js';
import * as Utils from './utils/utils.js';
const UIStrings = {
    /**
     *@description Unattributed text for an unattributed entity.
     */
    unattributed: '[unattributed]',
    /**
     *@description Title for the name of either 1st or 3rd Party entities.
     */
    firstOrThirdPartyName: '1st / 3rd party',
    /**
     *@description Title referencing transfer size.
     */
    transferSize: 'Transfer size',
    /**
     *@description Title referencing main thread time.
     */
    mainThreadTime: 'Main thread time',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/ThirdPartyTreeView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ThirdPartyTreeViewWidget extends TimelineTreeView.TimelineTreeView {
    constructor() {
        super();
        _ThirdPartyTreeViewWidget_instances.add(this);
        // By default the TimelineTreeView will auto-select the first row
        // when the grid is refreshed but for the ThirdParty view we only
        // want to do this when the user hovers.
        this.autoSelectFirstChildOnRefresh = false;
        this.element.setAttribute('jslog', `${VisualLogging.pane('third-party-tree').track({ hover: true })}`);
        this.init();
        this.dataGrid.markColumnAsSortedBy('self', DataGrid.DataGrid.Order.Descending);
        this.dataGrid.setResizeMethod("nearest" /* DataGrid.DataGrid.ResizeMethod.NEAREST */);
        /**
         * By default data grids always expand when arrowing.
         * For 3P table, we don't use this feature.
         */
        this.dataGrid.expandNodesWhenArrowing = false;
    }
    wasShown() {
        super.wasShown();
        this.registerRequiredCSS(thirdPartyTreeViewStyles);
    }
    setModelWithEvents(selectedEvents, parsedTrace, entityMappings) {
        super.setModelWithEvents(selectedEvents, parsedTrace, entityMappings);
        const hasEvents = Boolean(selectedEvents && selectedEvents.length > 0);
        this.element.classList.toggle('empty-table', !hasEvents);
    }
    buildTree() {
        const parsedTrace = this.parsedTrace();
        const entityMapper = this.entityMapper();
        if (!parsedTrace || !entityMapper) {
            return new Trace.Extras.TraceTree.BottomUpRootNode([], {
                textFilter: this.textFilter(),
                filters: this.filtersWithoutTextFilter(),
                startTime: this.startTime,
                endTime: this.endTime,
                eventGroupIdCallback: this.groupingFunction.bind(this),
            });
        }
        // const events = this.#thirdPartySummaries.entityByEvent.keys();
        const relatedEvents = this.selectedEvents().sort(Trace.Helpers.Trace.eventTimeComparator);
        // The filters for this view are slightly different; we want to use the set
        // of visible event types, but also include network events, which by
        // default are not in the set of visible entries (as they are not shown on
        // the main flame chart).
        const filter = new Trace.Extras.TraceFilter.VisibleEventsFilter(Utils.EntryStyles.visibleTypes().concat(["SyntheticNetworkRequest" /* Trace.Types.Events.Name.SYNTHETIC_NETWORK_REQUEST */]));
        const node = new Trace.Extras.TraceTree.BottomUpRootNode(relatedEvents, {
            textFilter: this.textFilter(),
            filters: [filter],
            startTime: this.startTime,
            endTime: this.endTime,
            eventGroupIdCallback: this.groupingFunction.bind(this),
            calculateTransferSize: true,
            // Ensure we group by 3P alongside eventID for correct 3P grouping.
            forceGroupIdCallback: true,
        });
        return node;
    }
    /**
     * Third party tree view doesn't require the select feature, as this expands the node.
     */
    selectProfileNode() {
        return;
    }
    groupingFunction(event) {
        const entity = this.entityMapper()?.entityForEvent(event);
        if (!entity) {
            return '';
        }
        return entity.name;
    }
    populateColumns(columns) {
        columns.push({
            id: 'site',
            title: i18nString(UIStrings.firstOrThirdPartyName),
            // It's important that this width is the `.widget.vbox.timeline-tree-view` max-width (550)
            // minus the two fixed sizes below. (550-100-105) == 345
            width: '345px',
            // And with this column not-fixed-width and resizingMethod NEAREST, the name-column will appropriately flex.
            sortable: true,
        }, {
            id: 'transfer-size',
            title: i18nString(UIStrings.transferSize),
            width: '100px', // Mostly so there's room for the header plus sorting triangle
            fixedWidth: true,
            sortable: true,
        }, {
            id: 'self',
            title: i18nString(UIStrings.mainThreadTime),
            width: '120px', // Mostly to fit large self-time/main thread time plus devtools-button
            fixedWidth: true,
            sortable: true,
        });
    }
    populateToolbar() {
        return;
    }
    compareTransferSize(a, b) {
        const nodeA = a;
        const nodeB = b;
        const transferA = nodeA.profileNode.transferSize ?? 0;
        const transferB = nodeB.profileNode.transferSize ?? 0;
        return transferA - transferB;
    }
    sortingChanged() {
        const columnId = this.dataGrid.sortColumnId();
        if (!columnId) {
            return;
        }
        let sortFunction;
        switch (columnId) {
            case 'transfer-size':
                sortFunction = this.compareTransferSize.bind(this);
                break;
            default:
                sortFunction = super.getSortingFunction(columnId);
                break;
        }
        if (sortFunction) {
            this.dataGrid.sortNodes(sortFunction, !this.dataGrid.isSortOrderAscending());
        }
    }
    onHover(node) {
        if (!node) {
            this.dispatchEventToListeners("TreeRowHovered" /* TimelineTreeView.TimelineTreeView.Events.TREE_ROW_HOVERED */, { node: null });
            return;
        }
        __classPrivateFieldGet(this, _ThirdPartyTreeViewWidget_instances, "m", _ThirdPartyTreeViewWidget_getEventsForEventDispatch).call(this, node);
        const events = __classPrivateFieldGet(this, _ThirdPartyTreeViewWidget_instances, "m", _ThirdPartyTreeViewWidget_getEventsForEventDispatch).call(this, node);
        this.dispatchEventToListeners("TreeRowHovered" /* TimelineTreeView.TimelineTreeView.Events.TREE_ROW_HOVERED */, { node, events: events && events.length > 0 ? events : undefined });
    }
    onClick(node) {
        if (!node) {
            this.dispatchEventToListeners("TreeRowClicked" /* TimelineTreeView.TimelineTreeView.Events.TREE_ROW_CLICKED */, { node: null });
            return;
        }
        const events = __classPrivateFieldGet(this, _ThirdPartyTreeViewWidget_instances, "m", _ThirdPartyTreeViewWidget_getEventsForEventDispatch).call(this, node);
        this.dispatchEventToListeners("TreeRowClicked" /* TimelineTreeView.TimelineTreeView.Events.TREE_ROW_CLICKED */, { node, events: events && events.length > 0 ? events : undefined });
    }
    displayInfoForGroupNode(node) {
        const color = 'gray';
        const unattributed = i18nString(UIStrings.unattributed);
        const id = typeof node.id === 'symbol' ? undefined : node.id;
        // This `undefined` is [unattributed]
        // TODO(paulirish,aixba): Improve attribution to reduce amount of items in [unattributed].
        const domainName = id ? this.entityMapper()?.entityForEvent(node.event)?.name || id : undefined;
        return { name: domainName || unattributed, color, icon: undefined };
    }
    nodeIsFirstParty(node) {
        const mapper = this.entityMapper();
        if (!mapper) {
            return false;
        }
        const firstParty = mapper.firstPartyEntity();
        return firstParty === mapper.entityForEvent(node.event);
    }
    nodeIsExtension(node) {
        const mapper = this.entityMapper();
        if (!mapper) {
            return false;
        }
        const entity = mapper.entityForEvent(node.event);
        return Boolean(entity) && entity?.category === 'Chrome Extension';
    }
}
_ThirdPartyTreeViewWidget_instances = new WeakSet(), _ThirdPartyTreeViewWidget_getEventsForEventDispatch = function _ThirdPartyTreeViewWidget_getEventsForEventDispatch(node) {
    const mapper = this.entityMapper();
    if (!mapper) {
        return null;
    }
    const entity = mapper.entityForEvent(node.event);
    return entity ? mapper.eventsForEntity(entity) ?? [] : [];
};
export class ThirdPartyTreeElement extends UI.Widget.WidgetElement {
    set treeView(treeView) {
        __classPrivateFieldSet(this, _ThirdPartyTreeElement_treeView, treeView, "f");
    }
    constructor() {
        super();
        _ThirdPartyTreeElement_treeView.set(this, void 0);
        this.style.display = 'contents';
    }
    createWidget() {
        const containerWidget = new UI.Widget.Widget(false, undefined, this);
        containerWidget.contentElement.style.display = 'contents';
        if (__classPrivateFieldGet(this, _ThirdPartyTreeElement_treeView, "f")) {
            __classPrivateFieldGet(this, _ThirdPartyTreeElement_treeView, "f").show(containerWidget.contentElement);
        }
        return containerWidget;
    }
}
_ThirdPartyTreeElement_treeView = new WeakMap();
customElements.define('devtools-performance-third-party-tree-view', ThirdPartyTreeElement);
//# sourceMappingURL=ThirdPartyTreeView.js.map