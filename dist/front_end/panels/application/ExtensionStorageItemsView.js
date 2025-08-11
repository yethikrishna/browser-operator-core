// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _ExtensionStorageItemsView_instances, _ExtensionStorageItemsView_extensionStorage, _ExtensionStorageItemsView_isEditable_get, _ExtensionStorageItemsView_extensionStorageItemsCleared, _ExtensionStorageItemsView_refreshItems;
/*
 * Copyright (C) 2008 Nokia Inc.  All rights reserved.
 * Copyright (C) 2013 Samsung Electronics. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as JSON5 from '../../third_party/json5/json5.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { KeyValueStorageItemsView } from './KeyValueStorageItemsView.js';
const UIStrings = {
    /**
     *@description Name for the "Extension Storage Items" table that shows the content of the extension Storage.
     */
    extensionStorageItems: 'Extension Storage Items',
    /**
     *@description Text for announcing that the "Extension Storage Items" table was cleared, that is, all
     * entries were deleted.
     */
    extensionStorageItemsCleared: 'Extension Storage Items cleared',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/ExtensionStorageItemsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var ExtensionStorageItemsDispatcher;
(function (ExtensionStorageItemsDispatcher) {
    let Events;
    (function (Events) {
        Events["ITEM_EDITED"] = "ItemEdited";
        Events["ITEMS_REFRESHED"] = "ItemsRefreshed";
    })(Events = ExtensionStorageItemsDispatcher.Events || (ExtensionStorageItemsDispatcher.Events = {}));
})(ExtensionStorageItemsDispatcher || (ExtensionStorageItemsDispatcher = {}));
export class ExtensionStorageItemsView extends KeyValueStorageItemsView {
    constructor(extensionStorage, view) {
        super(i18nString(UIStrings.extensionStorageItems), 'extension-storage', true, view);
        _ExtensionStorageItemsView_instances.add(this);
        _ExtensionStorageItemsView_extensionStorage.set(this, void 0);
        this.element.setAttribute('jslog', `${VisualLogging.pane().context('extension-storage-data')}`);
        this.element.classList.add('storage-view', 'table');
        this.extensionStorageItemsDispatcher =
            new Common.ObjectWrapper.ObjectWrapper();
        this.setStorage(extensionStorage);
    }
    /**
     * When parsing a value provided by the user, attempt to treat it as JSON,
     * falling back to a string otherwise.
     */
    parseValue(input) {
        try {
            return JSON5.parse(input);
        }
        catch {
            return input;
        }
    }
    removeItem(key) {
        void __classPrivateFieldGet(this, _ExtensionStorageItemsView_extensionStorage, "f").removeItem(key).then(() => {
            this.refreshItems();
        });
    }
    setItem(key, value) {
        void __classPrivateFieldGet(this, _ExtensionStorageItemsView_extensionStorage, "f").setItem(key, this.parseValue(value)).then(() => {
            this.refreshItems();
            this.extensionStorageItemsDispatcher.dispatchEventToListeners("ItemEdited" /* ExtensionStorageItemsDispatcher.Events.ITEM_EDITED */);
        });
    }
    createPreview(key, value) {
        const url = 'extension-storage://' + __classPrivateFieldGet(this, _ExtensionStorageItemsView_extensionStorage, "f").extensionId + '/' + __classPrivateFieldGet(this, _ExtensionStorageItemsView_extensionStorage, "f").storageArea +
            '/preview/' + key;
        const provider = TextUtils.StaticContentProvider.StaticContentProvider.fromString(url, Common.ResourceType.resourceTypes.XHR, value);
        return SourceFrame.PreviewFactory.PreviewFactory.createPreview(provider, 'text/plain');
    }
    setStorage(extensionStorage) {
        __classPrivateFieldSet(this, _ExtensionStorageItemsView_extensionStorage, extensionStorage, "f");
        this.editable = __classPrivateFieldGet(this, _ExtensionStorageItemsView_instances, "a", _ExtensionStorageItemsView_isEditable_get);
        this.refreshItems();
    }
    deleteSelectedItem() {
        if (!__classPrivateFieldGet(this, _ExtensionStorageItemsView_instances, "a", _ExtensionStorageItemsView_isEditable_get)) {
            return;
        }
        this.deleteSelectedItem();
    }
    refreshItems() {
        void __classPrivateFieldGet(this, _ExtensionStorageItemsView_instances, "m", _ExtensionStorageItemsView_refreshItems).call(this);
    }
    deleteAllItems() {
        if (!__classPrivateFieldGet(this, _ExtensionStorageItemsView_instances, "a", _ExtensionStorageItemsView_isEditable_get)) {
            return;
        }
        __classPrivateFieldGet(this, _ExtensionStorageItemsView_extensionStorage, "f").clear().then(() => {
            __classPrivateFieldGet(this, _ExtensionStorageItemsView_instances, "m", _ExtensionStorageItemsView_extensionStorageItemsCleared).call(this);
        }, () => {
            throw new Error('Unable to clear storage.');
        });
    }
}
_ExtensionStorageItemsView_extensionStorage = new WeakMap(), _ExtensionStorageItemsView_instances = new WeakSet(), _ExtensionStorageItemsView_isEditable_get = function _ExtensionStorageItemsView_isEditable_get() {
    // The managed storage area is always read only, since it exposes values
    // set by enterprise policy.
    return __classPrivateFieldGet(this, _ExtensionStorageItemsView_extensionStorage, "f").storageArea !== "managed" /* Protocol.Extensions.StorageArea.Managed */;
}, _ExtensionStorageItemsView_extensionStorageItemsCleared = function _ExtensionStorageItemsView_extensionStorageItemsCleared() {
    if (!this.isShowing()) {
        return;
    }
    this.itemsCleared();
    UI.ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.extensionStorageItemsCleared));
}, _ExtensionStorageItemsView_refreshItems = async function _ExtensionStorageItemsView_refreshItems() {
    const items = await __classPrivateFieldGet(this, _ExtensionStorageItemsView_extensionStorage, "f").getItems();
    if (!items || !this.toolbar) {
        return;
    }
    const filteredItems = Object.entries(items)
        .map(([key, value]) => ({ key, value: typeof value === 'string' ? value : JSON.stringify(value) }))
        .filter(item => this.toolbar?.filterRegex?.test(`${item.key} ${item.value}`) ?? true);
    this.showItems(filteredItems);
    this.extensionStorageItemsDispatcher.dispatchEventToListeners("ItemsRefreshed" /* ExtensionStorageItemsDispatcher.Events.ITEMS_REFRESHED */);
};
//# sourceMappingURL=ExtensionStorageItemsView.js.map