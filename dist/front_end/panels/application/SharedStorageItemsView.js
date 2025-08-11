// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _SharedStorageItemsView_instances, _SharedStorageItemsView_sharedStorage, _SharedStorageItemsView_sharedStorageChanged, _SharedStorageItemsView_showSharedStorageItems;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as ApplicationComponents from './components/components.js';
import { KeyValueStorageItemsView } from './KeyValueStorageItemsView.js';
const UIStrings = {
    /**
     *@description Text in SharedStorage Items View of the Application panel
     */
    sharedStorage: 'Shared storage',
    /**
     *@description Text for announcing that the "Shared Storage Items" table was cleared, that is, all
     * entries were deleted.
     */
    sharedStorageItemsCleared: 'Shared Storage items cleared',
    /**
     *@description Text for announcing that the filtered "Shared Storage Items" table was cleared, that is,
     * all filtered entries were deleted.
     */
    sharedStorageFilteredItemsCleared: 'Shared Storage filtered items cleared',
    /**
     *@description Text for announcing a Shared Storage key/value item has been deleted
     */
    sharedStorageItemDeleted: 'The storage item was deleted.',
    /**
     *@description Text for announcing a Shared Storage key/value item has been edited
     */
    sharedStorageItemEdited: 'The storage item was edited.',
    /**
     *@description Text for announcing a Shared Storage key/value item edit request has been canceled
     */
    sharedStorageItemEditCanceled: 'The storage item edit was canceled.',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/SharedStorageItemsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var SharedStorageItemsDispatcher;
(function (SharedStorageItemsDispatcher) {
    let Events;
    (function (Events) {
        Events["FILTERED_ITEMS_CLEARED"] = "FilteredItemsCleared";
        Events["ITEM_DELETED"] = "ItemDeleted";
        Events["ITEM_EDITED"] = "ItemEdited";
        Events["ITEMS_CLEARED"] = "ItemsCleared";
        Events["ITEMS_REFRESHED"] = "ItemsRefreshed";
    })(Events = SharedStorageItemsDispatcher.Events || (SharedStorageItemsDispatcher.Events = {}));
})(SharedStorageItemsDispatcher || (SharedStorageItemsDispatcher = {}));
export class SharedStorageItemsView extends KeyValueStorageItemsView {
    constructor(sharedStorage, view) {
        super(i18nString(UIStrings.sharedStorage), 'shared-storage-items-view', /* editable=*/ true, view, new ApplicationComponents.SharedStorageMetadataView.SharedStorageMetadataView(sharedStorage, sharedStorage.securityOrigin));
        _SharedStorageItemsView_instances.add(this);
        _SharedStorageItemsView_sharedStorage.set(this, void 0);
        __classPrivateFieldSet(this, _SharedStorageItemsView_sharedStorage, sharedStorage, "f");
        this.performUpdate();
        __classPrivateFieldGet(this, _SharedStorageItemsView_sharedStorage, "f").addEventListener("SharedStorageChanged" /* SharedStorageForOrigin.Events.SHARED_STORAGE_CHANGED */, __classPrivateFieldGet(this, _SharedStorageItemsView_instances, "m", _SharedStorageItemsView_sharedStorageChanged), this);
        this.sharedStorageItemsDispatcher =
            new Common.ObjectWrapper.ObjectWrapper();
    }
    // Use `createView()` instead of the constructor to create a view, so that entries can be awaited asynchronously.
    static async createView(sharedStorage, viewFunction) {
        const view = new SharedStorageItemsView(sharedStorage, viewFunction);
        await view.updateEntriesOnly();
        return view;
    }
    async updateEntriesOnly() {
        const entries = await __classPrivateFieldGet(this, _SharedStorageItemsView_sharedStorage, "f").getEntries();
        if (entries) {
            __classPrivateFieldGet(this, _SharedStorageItemsView_instances, "m", _SharedStorageItemsView_showSharedStorageItems).call(this, entries);
        }
    }
    async refreshItems() {
        await this.metadataView?.render();
        await this.updateEntriesOnly();
        this.sharedStorageItemsDispatcher.dispatchEventToListeners("ItemsRefreshed" /* SharedStorageItemsDispatcher.Events.ITEMS_REFRESHED */);
    }
    async deleteAllItems() {
        if (!this.toolbar?.hasFilter()) {
            await __classPrivateFieldGet(this, _SharedStorageItemsView_sharedStorage, "f").clear();
            await this.refreshItems();
            this.sharedStorageItemsDispatcher.dispatchEventToListeners("ItemsCleared" /* SharedStorageItemsDispatcher.Events.ITEMS_CLEARED */);
            UI.ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.sharedStorageItemsCleared));
            return;
        }
        await Promise.all(this.keys().map(key => __classPrivateFieldGet(this, _SharedStorageItemsView_sharedStorage, "f").deleteEntry(key)));
        await this.refreshItems();
        this.sharedStorageItemsDispatcher.dispatchEventToListeners("FilteredItemsCleared" /* SharedStorageItemsDispatcher.Events.FILTERED_ITEMS_CLEARED */);
        UI.ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.sharedStorageFilteredItemsCleared));
    }
    isEditAllowed(columnIdentifier, _oldText, newText) {
        if (columnIdentifier === 'key' && newText === '') {
            // The Shared Storage backend does not currently allow '' as a key, so we only set a new entry with a new key if its new key is nonempty.
            void this.refreshItems().then(() => {
                UI.ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.sharedStorageItemEditCanceled));
            });
            return false;
        }
        return true;
    }
    async setItem(key, value) {
        await __classPrivateFieldGet(this, _SharedStorageItemsView_sharedStorage, "f").setEntry(key, value, false);
        await this.refreshItems();
        this.sharedStorageItemsDispatcher.dispatchEventToListeners("ItemEdited" /* SharedStorageItemsDispatcher.Events.ITEM_EDITED */);
        UI.ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.sharedStorageItemEdited));
    }
    async removeItem(key) {
        await __classPrivateFieldGet(this, _SharedStorageItemsView_sharedStorage, "f").deleteEntry(key);
        await this.refreshItems();
        this.sharedStorageItemsDispatcher.dispatchEventToListeners("ItemDeleted" /* SharedStorageItemsDispatcher.Events.ITEM_DELETED */, { key });
        UI.ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.sharedStorageItemDeleted));
    }
    async createPreview(key, value) {
        const wrappedEntry = key && { key, value: value || '' };
        return SourceFrame.JSONView.JSONView.createViewSync(wrappedEntry);
    }
}
_SharedStorageItemsView_sharedStorage = new WeakMap(), _SharedStorageItemsView_instances = new WeakSet(), _SharedStorageItemsView_sharedStorageChanged = async function _SharedStorageItemsView_sharedStorageChanged() {
    await this.refreshItems();
}, _SharedStorageItemsView_showSharedStorageItems = function _SharedStorageItemsView_showSharedStorageItems(items) {
    if (this.toolbar) {
        const filteredList = items.filter(item => this.toolbar?.filterRegex?.test(`${item.key} ${item.value}`) ?? true);
        this.showItems(filteredList);
    }
};
//# sourceMappingURL=SharedStorageItemsView.js.map