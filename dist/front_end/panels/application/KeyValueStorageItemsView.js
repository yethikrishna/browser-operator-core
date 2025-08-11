// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _KeyValueStorageItemsView_instances, _KeyValueStorageItemsView_preview, _KeyValueStorageItemsView_previewValue, _KeyValueStorageItemsView_items, _KeyValueStorageItemsView_selectedKey, _KeyValueStorageItemsView_view, _KeyValueStorageItemsView_isSortOrderAscending, _KeyValueStorageItemsView_editable, _KeyValueStorageItemsView_toolbar, _KeyValueStorageItemsView_createCallback, _KeyValueStorageItemsView_editingCallback, _KeyValueStorageItemsView_removeDupes, _KeyValueStorageItemsView_deleteCallback, _KeyValueStorageItemsView_previewEntry;
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
/* eslint no-return-assign: "off" */
import * as i18n from '../../core/i18n/i18n.js';
import * as UI from '../../ui/legacy/legacy.js';
import { Directives as LitDirectives, html, nothing, render } from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as ApplicationComponents from './components/components.js';
import { StorageItemsToolbar } from './StorageItemsToolbar.js';
const { ARIAUtils } = UI;
const { EmptyWidget } = UI.EmptyWidget;
const { VBox, widgetConfig } = UI.Widget;
const { Size } = UI.Geometry;
const { repeat } = LitDirectives;
const UIStrings = {
    /**
     *@description Text that shows in the Applicaiton Panel if no value is selected for preview
     */
    noPreviewSelected: 'No value selected',
    /**
     *@description Preview text when viewing storage in Application panel
     */
    selectAValueToPreview: 'Select a value to preview',
    /**
     *@description Text for announcing number of entries after filtering
     *@example {5} PH1
     */
    numberEntries: 'Number of entries shown in table: {PH1}',
    /**
     *@description Text in DOMStorage Items View of the Application panel
     */
    key: 'Key',
    /**
     *@description Text for the value of something
     */
    value: 'Value',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/KeyValueStorageItemsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const MAX_VALUE_LENGTH = 4096;
/**
 * A helper typically used in the Application panel. Renders a split view
 * between a DataGrid displaying key-value pairs and a preview Widget.
 */
export class KeyValueStorageItemsView extends UI.Widget.VBox {
    constructor(title, id, editable, view, metadataView) {
        metadataView ?? (metadataView = new ApplicationComponents.StorageMetadataView.StorageMetadataView());
        if (!view) {
            view = (input, output, target) => {
                // clang-format off
                render(html `
            <devtools-widget
              .widgetConfig=${widgetConfig(StorageItemsToolbar, { metadataView })}
              class=flex-none
              ${UI.Widget.widgetRef(StorageItemsToolbar, view => { output.toolbar = view; })}
            ></devtools-widget>
            <devtools-split-view sidebar-position="second" name="${id}-split-view-state">
               <devtools-widget
                  slot="main"
                  .widgetConfig=${widgetConfig(VBox, { minimumSize: new Size(0, 50) })}>
                <devtools-data-grid
                  .name=${`${id}-datagrid-with-preview`}
                  striped
                  style="flex: auto"
                  @select=${input.onSelect}
                  @sort=${input.onSort}
                  @refresh=${input.onReferesh}
                  @create=${input.onCreate}
                  @edit=${input.onEdit}
                  @delete=${input.onDelete}
                >
                  <table>
                    <tr>
                      <th id="key" sortable ?editable=${input.editable}>
                        ${i18nString(UIStrings.key)}
                      </th>
                      <th id="value" ?editable=${input.editable}>
                        ${i18nString(UIStrings.value)}
                      </th>
                    </tr>
                    ${repeat(input.items, item => item.key, item => html `
                      <tr data-key=${item.key} data-value=${item.value}
                          selected=${(input.selectedKey === item.key) || nothing}>
                        <td>${item.key}</td>
                        <td>${item.value.substr(0, MAX_VALUE_LENGTH)}</td>
                      </tr>`)}
                      <tr placeholder></tr>
                  </table>
                </devtools-data-grid>
              </devtools-widget>
              <devtools-widget
                  slot="sidebar"
                  .widgetConfig=${widgetConfig(VBox, { minimumSize: new Size(0, 50) })}
                  jslog=${VisualLogging.pane('preview').track({ resize: true })}>
               ${input.preview?.element}
              </devtools-widget>
            </devtools-split-view>`, 
                // clang-format on
                target, { host: input });
            };
        }
        super(false);
        _KeyValueStorageItemsView_instances.add(this);
        _KeyValueStorageItemsView_preview.set(this, void 0);
        _KeyValueStorageItemsView_previewValue.set(this, void 0);
        _KeyValueStorageItemsView_items.set(this, []);
        _KeyValueStorageItemsView_selectedKey.set(this, null);
        _KeyValueStorageItemsView_view.set(this, void 0);
        _KeyValueStorageItemsView_isSortOrderAscending.set(this, true);
        _KeyValueStorageItemsView_editable.set(this, void 0);
        _KeyValueStorageItemsView_toolbar.set(this, void 0);
        this.metadataView = metadataView;
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_editable, editable, "f");
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_view, view, "f");
        this.performUpdate();
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_preview, new EmptyWidget(i18nString(UIStrings.noPreviewSelected), i18nString(UIStrings.selectAValueToPreview)), "f");
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_previewValue, null, "f");
        this.showPreview(null, null);
    }
    wasShown() {
        this.refreshItems();
    }
    performUpdate() {
        const that = this;
        const viewOutput = {
            set toolbar(toolbar) {
                __classPrivateFieldGet(that, _KeyValueStorageItemsView_toolbar, "f")?.removeEventListener("DeleteSelected" /* StorageItemsToolbar.Events.DELETE_SELECTED */, that.deleteSelectedItem, that);
                __classPrivateFieldGet(that, _KeyValueStorageItemsView_toolbar, "f")?.removeEventListener("DeleteAll" /* StorageItemsToolbar.Events.DELETE_ALL */, that.deleteAllItems, that);
                __classPrivateFieldGet(that, _KeyValueStorageItemsView_toolbar, "f")?.removeEventListener("Refresh" /* StorageItemsToolbar.Events.REFRESH */, that.refreshItems, that);
                __classPrivateFieldSet(that, _KeyValueStorageItemsView_toolbar, toolbar, "f");
                __classPrivateFieldGet(that, _KeyValueStorageItemsView_toolbar, "f").addEventListener("DeleteSelected" /* StorageItemsToolbar.Events.DELETE_SELECTED */, that.deleteSelectedItem, that);
                __classPrivateFieldGet(that, _KeyValueStorageItemsView_toolbar, "f").addEventListener("DeleteAll" /* StorageItemsToolbar.Events.DELETE_ALL */, that.deleteAllItems, that);
                __classPrivateFieldGet(that, _KeyValueStorageItemsView_toolbar, "f").addEventListener("Refresh" /* StorageItemsToolbar.Events.REFRESH */, that.refreshItems, that);
            }
        };
        const viewInput = {
            items: __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f"),
            selectedKey: __classPrivateFieldGet(this, _KeyValueStorageItemsView_selectedKey, "f"),
            editable: __classPrivateFieldGet(this, _KeyValueStorageItemsView_editable, "f"),
            preview: __classPrivateFieldGet(this, _KeyValueStorageItemsView_preview, "f"),
            onSelect: (event) => {
                __classPrivateFieldGet(this, _KeyValueStorageItemsView_toolbar, "f")?.setCanDeleteSelected(Boolean(event.detail));
                if (!event.detail) {
                    void __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_previewEntry).call(this, null);
                }
                else {
                    void __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_previewEntry).call(this, { key: event.detail.dataset.key || '', value: event.detail.dataset.value || '' });
                }
            },
            onSort: (event) => {
                __classPrivateFieldSet(this, _KeyValueStorageItemsView_isSortOrderAscending, event.detail.ascending, "f");
            },
            onCreate: (event) => {
                __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_createCallback).call(this, event.detail.key, event.detail.value || '');
            },
            onEdit: (event) => {
                __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_editingCallback).call(this, event.detail.node, event.detail.columnId, event.detail.valueBeforeEditing, event.detail.newText);
            },
            onDelete: (event) => {
                __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_deleteCallback).call(this, event.detail.dataset.key || '');
            },
            onReferesh: () => {
                this.refreshItems();
            },
        };
        __classPrivateFieldGet(this, _KeyValueStorageItemsView_view, "f").call(this, viewInput, viewOutput, this.contentElement);
    }
    get toolbar() {
        return __classPrivateFieldGet(this, _KeyValueStorageItemsView_toolbar, "f");
    }
    refreshItems() {
    }
    deleteAllItems() {
    }
    itemsCleared() {
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_items, [], "f");
        this.performUpdate();
        __classPrivateFieldGet(this, _KeyValueStorageItemsView_toolbar, "f")?.setCanDeleteSelected(false);
    }
    itemRemoved(key) {
        const index = __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").findIndex(item => item.key === key);
        if (index === -1) {
            return;
        }
        __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").splice(index, 1);
        this.performUpdate();
        __classPrivateFieldGet(this, _KeyValueStorageItemsView_toolbar, "f")?.setCanDeleteSelected(__classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").length > 1);
    }
    itemAdded(key, value) {
        if (__classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").some(item => item.key === key)) {
            return;
        }
        __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").push({ key, value });
        this.performUpdate();
    }
    itemUpdated(key, value) {
        const item = __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").find(item => item.key === key);
        if (!item) {
            return;
        }
        if (item.value === value) {
            return;
        }
        item.value = value;
        this.performUpdate();
        if (__classPrivateFieldGet(this, _KeyValueStorageItemsView_selectedKey, "f") !== key) {
            return;
        }
        if (__classPrivateFieldGet(this, _KeyValueStorageItemsView_previewValue, "f") !== value) {
            void __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_previewEntry).call(this, { key, value });
        }
        __classPrivateFieldGet(this, _KeyValueStorageItemsView_toolbar, "f")?.setCanDeleteSelected(true);
    }
    showItems(items) {
        const sortDirection = __classPrivateFieldGet(this, _KeyValueStorageItemsView_isSortOrderAscending, "f") ? 1 : -1;
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_items, [...items].sort((item1, item2) => sortDirection * (item1.key > item2.key ? 1 : -1)), "f");
        const selectedItem = __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").find(item => item.key === __classPrivateFieldGet(this, _KeyValueStorageItemsView_selectedKey, "f"));
        if (!selectedItem) {
            __classPrivateFieldSet(this, _KeyValueStorageItemsView_selectedKey, null, "f");
        }
        else {
            void __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_previewEntry).call(this, selectedItem);
        }
        this.performUpdate();
        __classPrivateFieldGet(this, _KeyValueStorageItemsView_toolbar, "f")?.setCanDeleteSelected(Boolean(__classPrivateFieldGet(this, _KeyValueStorageItemsView_selectedKey, "f")));
        ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.numberEntries, { PH1: __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").length }));
    }
    deleteSelectedItem() {
        if (!__classPrivateFieldGet(this, _KeyValueStorageItemsView_selectedKey, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_deleteCallback).call(this, __classPrivateFieldGet(this, _KeyValueStorageItemsView_selectedKey, "f"));
    }
    isEditAllowed(_columnIdentifier, _oldText, _newText) {
        return true;
    }
    showPreview(preview, value) {
        if (__classPrivateFieldGet(this, _KeyValueStorageItemsView_preview, "f") && __classPrivateFieldGet(this, _KeyValueStorageItemsView_previewValue, "f") === value) {
            return;
        }
        if (__classPrivateFieldGet(this, _KeyValueStorageItemsView_preview, "f")) {
            __classPrivateFieldGet(this, _KeyValueStorageItemsView_preview, "f").detach();
        }
        if (!preview) {
            preview = new EmptyWidget(i18nString(UIStrings.noPreviewSelected), i18nString(UIStrings.selectAValueToPreview));
        }
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_previewValue, value, "f");
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_preview, preview, "f");
        this.performUpdate();
    }
    set editable(editable) {
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_editable, editable, "f");
        this.performUpdate();
    }
    keys() {
        return __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").map(item => item.key);
    }
}
_KeyValueStorageItemsView_preview = new WeakMap(), _KeyValueStorageItemsView_previewValue = new WeakMap(), _KeyValueStorageItemsView_items = new WeakMap(), _KeyValueStorageItemsView_selectedKey = new WeakMap(), _KeyValueStorageItemsView_view = new WeakMap(), _KeyValueStorageItemsView_isSortOrderAscending = new WeakMap(), _KeyValueStorageItemsView_editable = new WeakMap(), _KeyValueStorageItemsView_toolbar = new WeakMap(), _KeyValueStorageItemsView_instances = new WeakSet(), _KeyValueStorageItemsView_createCallback = function _KeyValueStorageItemsView_createCallback(key, value) {
    this.setItem(key, value);
    __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_removeDupes).call(this, key, value);
    void __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_previewEntry).call(this, { key, value });
}, _KeyValueStorageItemsView_editingCallback = function _KeyValueStorageItemsView_editingCallback(editingNode, columnIdentifier, oldText, newText) {
    if (!this.isEditAllowed(columnIdentifier, oldText, newText)) {
        return;
    }
    if (columnIdentifier === 'key') {
        if (typeof oldText === 'string') {
            this.removeItem(oldText);
        }
        this.setItem(newText, editingNode.dataset.value || '');
        __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_removeDupes).call(this, newText, editingNode.dataset.value || '');
        editingNode.dataset.key = newText;
        void __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_previewEntry).call(this, { key: newText, value: editingNode.dataset.value || '' });
    }
    else {
        this.setItem(editingNode.dataset.key || '', newText);
        void __classPrivateFieldGet(this, _KeyValueStorageItemsView_instances, "m", _KeyValueStorageItemsView_previewEntry).call(this, { key: editingNode.dataset.key || '', value: newText });
    }
}, _KeyValueStorageItemsView_removeDupes = function _KeyValueStorageItemsView_removeDupes(key, value) {
    for (let i = __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").length - 1; i >= 0; --i) {
        const child = __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f")[i];
        if ((child.key === key) && (value !== child.value)) {
            __classPrivateFieldGet(this, _KeyValueStorageItemsView_items, "f").splice(i, 1);
        }
    }
}, _KeyValueStorageItemsView_deleteCallback = function _KeyValueStorageItemsView_deleteCallback(key) {
    this.removeItem(key);
}, _KeyValueStorageItemsView_previewEntry = async function _KeyValueStorageItemsView_previewEntry(entry) {
    if (entry?.value) {
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_selectedKey, entry.key, "f");
        const preview = await this.createPreview(entry.key, entry.value);
        // Selection could've changed while the preview was loaded
        if (__classPrivateFieldGet(this, _KeyValueStorageItemsView_selectedKey, "f") === entry.key) {
            this.showPreview(preview, entry.value);
        }
    }
    else {
        __classPrivateFieldSet(this, _KeyValueStorageItemsView_selectedKey, null, "f");
        this.showPreview(null, null);
    }
};
//# sourceMappingURL=KeyValueStorageItemsView.js.map