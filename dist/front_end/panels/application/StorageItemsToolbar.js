// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _StorageItemsToolbar_metadataView, _StorageItemsToolbar_view, _StorageItemsToolbar_deleteAllButtonEnabled, _StorageItemsToolbar_deleteSelectedButtonDisabled, _StorageItemsToolbar_filterItemEnabled, _StorageItemsToolbar_deleteAllButtonIconName, _StorageItemsToolbar_deleteAllButtonTitle, _StorageItemsToolbar_mainToolbarItems;
import '../../ui/legacy/legacy.js';
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as ApplicationComponents from './components/components.js';
const UIStrings = {
    /**
     *@description Text to refresh the page
     */
    refresh: 'Refresh',
    /**
     *@description Text to clear everything
     */
    clearAll: 'Clear All',
    /**
     *@description Tooltip text that appears when hovering over the largeicon delete button in the Service Worker Cache Views of the Application panel
     */
    deleteSelected: 'Delete Selected',
    /**
     *@description Text that informs screen reader users that the storage table has been refreshed
     */
    refreshedStatus: 'Table refreshed',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/StorageItemsToolbar.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { html, render } = Lit;
export const DEFAULT_VIEW = (input, _output, target) => {
    render(
    // clang-format off
    html `
      <devtools-toolbar class="top-resources-toolbar"
                        jslog=${VisualLogging.toolbar()}>
        <devtools-button title=${i18nString(UIStrings.refresh)}
                         jslog=${VisualLogging.action('storage-items-view.refresh').track({
        click: true
    })}
                         @click=${input.onRefresh}
                         .iconName=${'refresh'}
                         .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}></devtools-button>
        <devtools-toolbar-input type="filter"
                                ?disabled=${!input.filterItemEnabled}
                                @change=${input.onFilterChanged}
                                style="flex-grow:0.4"></devtools-toolbar-input>
        ${new UI.Toolbar.ToolbarSeparator().element}
        <devtools-button title=${input.deleteAllButtonTitle}
                         @click=${input.onDeleteAll}
                         id=storage-items-delete-all
                         ?disabled=${!input.deleteAllButtonEnabled}
                         jslog=${VisualLogging.action('storage-items-view.clear-all').track({
        click: true
    })}
                         .iconName=${input.deleteAllButtonIconName}
                         .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}></devtools-button>
        <devtools-button title=${i18nString(UIStrings.deleteSelected)}
                         @click=${input.onDeleteSelected}
                         ?disabled=${!input.deleteSelectedButtonDisabled}
                         jslog=${VisualLogging.action('storage-items-view.delete-selected').track({
        click: true
    })}
                         .iconName=${'cross'}
                         .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}></devtools-button>
        ${input.mainToolbarItems.map(item => item.element)}
      </devtools-toolbar>
      ${input.metadataView}`, 
    // clang-format on
    target, { host: input });
};
export class StorageItemsToolbar extends Common.ObjectWrapper.eventMixin(UI.Widget.VBox) {
    constructor(element, view = DEFAULT_VIEW) {
        super(false, false, element);
        _StorageItemsToolbar_metadataView.set(this, void 0);
        _StorageItemsToolbar_view.set(this, void 0);
        _StorageItemsToolbar_deleteAllButtonEnabled.set(this, true);
        _StorageItemsToolbar_deleteSelectedButtonDisabled.set(this, true);
        _StorageItemsToolbar_filterItemEnabled.set(this, true);
        _StorageItemsToolbar_deleteAllButtonIconName.set(this, 'clear');
        _StorageItemsToolbar_deleteAllButtonTitle.set(this, i18nString(UIStrings.clearAll));
        _StorageItemsToolbar_mainToolbarItems.set(this, []);
        __classPrivateFieldSet(this, _StorageItemsToolbar_view, view, "f");
        this.filterRegex = null;
    }
    set metadataView(view) {
        __classPrivateFieldSet(this, _StorageItemsToolbar_metadataView, view, "f");
    }
    get metadataView() {
        if (!__classPrivateFieldGet(this, _StorageItemsToolbar_metadataView, "f")) {
            __classPrivateFieldSet(this, _StorageItemsToolbar_metadataView, new ApplicationComponents.StorageMetadataView.StorageMetadataView(), "f");
        }
        return __classPrivateFieldGet(this, _StorageItemsToolbar_metadataView, "f");
    }
    performUpdate() {
        const viewInput = {
            deleteAllButtonEnabled: __classPrivateFieldGet(this, _StorageItemsToolbar_deleteAllButtonEnabled, "f"),
            deleteSelectedButtonDisabled: __classPrivateFieldGet(this, _StorageItemsToolbar_deleteSelectedButtonDisabled, "f"),
            filterItemEnabled: __classPrivateFieldGet(this, _StorageItemsToolbar_filterItemEnabled, "f"),
            deleteAllButtonIconName: __classPrivateFieldGet(this, _StorageItemsToolbar_deleteAllButtonIconName, "f"),
            deleteAllButtonTitle: __classPrivateFieldGet(this, _StorageItemsToolbar_deleteAllButtonTitle, "f"),
            mainToolbarItems: __classPrivateFieldGet(this, _StorageItemsToolbar_mainToolbarItems, "f"),
            metadataView: this.metadataView,
            onFilterChanged: this.filterChanged.bind(this),
            onRefresh: () => {
                this.dispatchEventToListeners("Refresh" /* StorageItemsToolbar.Events.REFRESH */);
                UI.ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.refreshedStatus));
            },
            onDeleteAll: () => this.dispatchEventToListeners("DeleteAll" /* StorageItemsToolbar.Events.DELETE_ALL */),
            onDeleteSelected: () => this.dispatchEventToListeners("DeleteSelected" /* StorageItemsToolbar.Events.DELETE_SELECTED */),
        };
        __classPrivateFieldGet(this, _StorageItemsToolbar_view, "f").call(this, viewInput, {}, this.contentElement);
    }
    setDeleteAllTitle(title) {
        __classPrivateFieldSet(this, _StorageItemsToolbar_deleteAllButtonTitle, title, "f");
        this.requestUpdate();
    }
    setDeleteAllGlyph(glyph) {
        __classPrivateFieldSet(this, _StorageItemsToolbar_deleteAllButtonIconName, glyph, "f");
        this.requestUpdate();
    }
    appendToolbarItem(item) {
        __classPrivateFieldGet(this, _StorageItemsToolbar_mainToolbarItems, "f").push(item);
        this.requestUpdate();
    }
    setStorageKey(storageKey) {
        this.metadataView.setStorageKey(storageKey);
    }
    filterChanged({ detail: text }) {
        this.filterRegex = text ? new RegExp(Platform.StringUtilities.escapeForRegExp(text), 'i') : null;
        this.dispatchEventToListeners("Refresh" /* StorageItemsToolbar.Events.REFRESH */);
    }
    hasFilter() {
        return Boolean(this.filterRegex);
    }
    setCanDeleteAll(enabled) {
        __classPrivateFieldSet(this, _StorageItemsToolbar_deleteAllButtonEnabled, enabled, "f");
        this.requestUpdate();
    }
    setCanDeleteSelected(enabled) {
        __classPrivateFieldSet(this, _StorageItemsToolbar_deleteSelectedButtonDisabled, enabled, "f");
        this.requestUpdate();
    }
    setCanFilter(enabled) {
        __classPrivateFieldSet(this, _StorageItemsToolbar_filterItemEnabled, enabled, "f");
        this.requestUpdate();
    }
}
_StorageItemsToolbar_metadataView = new WeakMap(), _StorageItemsToolbar_view = new WeakMap(), _StorageItemsToolbar_deleteAllButtonEnabled = new WeakMap(), _StorageItemsToolbar_deleteSelectedButtonDisabled = new WeakMap(), _StorageItemsToolbar_filterItemEnabled = new WeakMap(), _StorageItemsToolbar_deleteAllButtonIconName = new WeakMap(), _StorageItemsToolbar_deleteAllButtonTitle = new WeakMap(), _StorageItemsToolbar_mainToolbarItems = new WeakMap();
(function (StorageItemsToolbar) {
    let Events;
    (function (Events) {
        Events["REFRESH"] = "Refresh";
        Events["FILTER_CHANGED"] = "FilterChanged";
        Events["DELETE_ALL"] = "DeleteAll";
        Events["DELETE_SELECTED"] = "DeleteSelected";
    })(Events = StorageItemsToolbar.Events || (StorageItemsToolbar.Events = {}));
})(StorageItemsToolbar || (StorageItemsToolbar = {}));
//# sourceMappingURL=StorageItemsToolbar.js.map