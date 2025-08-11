// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _SharedStorageEventsView_instances, _SharedStorageEventsView_sharedStorageEventGrid, _SharedStorageEventsView_events, _SharedStorageEventsView_noDisplayView, _SharedStorageEventsView_defaultId, _SharedStorageEventsView_getMainFrameResourceTreeModel, _SharedStorageEventsView_getMainFrame, _SharedStorageEventsView_onFocus;
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as ApplicationComponents from './components/components.js';
import sharedStorageEventsViewStyles from './sharedStorageEventsView.css.js';
const UIStrings = {
    /**
     *@description Placeholder text if no shared storage event has been selected.
     * Shared storage allows to store and access data that can be shared across different sites.
     * A shared storage event is for example an access from a site to that storage.
     */
    noEventSelected: 'No shared storage event selected',
    /**
     *@description Placeholder text instructing the user how to display shared
     * storage event details.
     * Shared storage allows to store and access data that can be shared across different sites.
     * A shared storage event is for example an access from a site to that storage.
     */
    clickToDisplayBody: 'Click on any shared storage event to display the event parameters',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/SharedStorageEventsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
function eventEquals(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
export class SharedStorageEventsView extends UI.SplitWidget.SplitWidget {
    constructor() {
        super(/* isVertical */ false, /* secondIsSidebar: */ true);
        _SharedStorageEventsView_instances.add(this);
        _SharedStorageEventsView_sharedStorageEventGrid.set(this, new ApplicationComponents.SharedStorageAccessGrid.SharedStorageAccessGrid());
        _SharedStorageEventsView_events.set(this, []);
        _SharedStorageEventsView_noDisplayView.set(this, void 0);
        _SharedStorageEventsView_defaultId.set(this, '');
        this.element.setAttribute('jslog', `${VisualLogging.pane('shared-storage-events')}`);
        const topPanel = new UI.Widget.VBox();
        __classPrivateFieldSet(this, _SharedStorageEventsView_noDisplayView, new UI.EmptyWidget.EmptyWidget(i18nString(UIStrings.noEventSelected), i18nString(UIStrings.clickToDisplayBody)), "f");
        topPanel.setMinimumSize(0, 80);
        this.setMainWidget(topPanel);
        __classPrivateFieldGet(this, _SharedStorageEventsView_noDisplayView, "f").setMinimumSize(0, 40);
        this.setSidebarWidget(__classPrivateFieldGet(this, _SharedStorageEventsView_noDisplayView, "f"));
        this.hideSidebar();
        topPanel.contentElement.appendChild(__classPrivateFieldGet(this, _SharedStorageEventsView_sharedStorageEventGrid, "f"));
        __classPrivateFieldGet(this, _SharedStorageEventsView_sharedStorageEventGrid, "f").addEventListener('select', __classPrivateFieldGet(this, _SharedStorageEventsView_instances, "m", _SharedStorageEventsView_onFocus).bind(this));
        __classPrivateFieldGet(this, _SharedStorageEventsView_sharedStorageEventGrid, "f").setAttribute('jslog', `${VisualLogging.section('events-table')}`);
        __classPrivateFieldGet(this, _SharedStorageEventsView_instances, "m", _SharedStorageEventsView_getMainFrameResourceTreeModel).call(this)?.addEventListener(SDK.ResourceTreeModel.Events.PrimaryPageChanged, this.clearEvents, this);
    }
    get id() {
        return __classPrivateFieldGet(this, _SharedStorageEventsView_instances, "m", _SharedStorageEventsView_getMainFrame).call(this)?.id || __classPrivateFieldGet(this, _SharedStorageEventsView_defaultId, "f");
    }
    wasShown() {
        super.wasShown();
        const sidebar = this.sidebarWidget();
        if (sidebar) {
            sidebar.registerRequiredCSS(sharedStorageEventsViewStyles);
        }
    }
    addEvent(event) {
        // Only add event if main frame id matches.
        if (event.mainFrameId !== this.id) {
            return;
        }
        // Only add if not already present.
        if (__classPrivateFieldGet(this, _SharedStorageEventsView_events, "f").some(t => eventEquals(t, event))) {
            return;
        }
        if (this.showMode() !== "Both" /* UI.SplitWidget.ShowMode.BOTH */) {
            this.showBoth();
        }
        __classPrivateFieldGet(this, _SharedStorageEventsView_events, "f").push(event);
        __classPrivateFieldGet(this, _SharedStorageEventsView_sharedStorageEventGrid, "f").data = __classPrivateFieldGet(this, _SharedStorageEventsView_events, "f");
    }
    clearEvents() {
        __classPrivateFieldSet(this, _SharedStorageEventsView_events, [], "f");
        __classPrivateFieldGet(this, _SharedStorageEventsView_sharedStorageEventGrid, "f").data = __classPrivateFieldGet(this, _SharedStorageEventsView_events, "f");
        this.setSidebarWidget(__classPrivateFieldGet(this, _SharedStorageEventsView_noDisplayView, "f"));
        this.hideSidebar();
    }
    setDefaultIdForTesting(id) {
        __classPrivateFieldSet(this, _SharedStorageEventsView_defaultId, id, "f");
    }
    getEventsForTesting() {
        return __classPrivateFieldGet(this, _SharedStorageEventsView_events, "f");
    }
    getSharedStorageAccessGridForTesting() {
        return __classPrivateFieldGet(this, _SharedStorageEventsView_sharedStorageEventGrid, "f");
    }
}
_SharedStorageEventsView_sharedStorageEventGrid = new WeakMap(), _SharedStorageEventsView_events = new WeakMap(), _SharedStorageEventsView_noDisplayView = new WeakMap(), _SharedStorageEventsView_defaultId = new WeakMap(), _SharedStorageEventsView_instances = new WeakSet(), _SharedStorageEventsView_getMainFrameResourceTreeModel = function _SharedStorageEventsView_getMainFrameResourceTreeModel() {
    const primaryPageTarget = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    return primaryPageTarget?.model(SDK.ResourceTreeModel.ResourceTreeModel) || null;
}, _SharedStorageEventsView_getMainFrame = function _SharedStorageEventsView_getMainFrame() {
    return __classPrivateFieldGet(this, _SharedStorageEventsView_instances, "m", _SharedStorageEventsView_getMainFrameResourceTreeModel).call(this)?.mainFrame || null;
}, _SharedStorageEventsView_onFocus = async function _SharedStorageEventsView_onFocus(event) {
    const focusedEvent = event;
    const datastore = focusedEvent.detail;
    if (!datastore) {
        return;
    }
    const jsonView = SourceFrame.JSONView.JSONView.createViewSync(datastore);
    jsonView.setMinimumSize(0, 40);
    this.setSidebarWidget(jsonView);
};
//# sourceMappingURL=SharedStorageEventsView.js.map