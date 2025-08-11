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
var _SharedStorageListTreeElement_expandedSetting;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as IconButton from '../../ui/components/icon_button/icon_button.js';
import { ApplicationPanelTreeElement } from './ApplicationPanelTreeElement.js';
import { SharedStorageEventsView } from './SharedStorageEventsView.js';
const UIStrings = {
    /**
     *@description Text in SharedStorage Category View of the Application panel
     */
    sharedStorage: 'Shared storage',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/SharedStorageListTreeElement.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class SharedStorageListTreeElement extends ApplicationPanelTreeElement {
    constructor(resourcesPanel, expandedSettingsDefault = false) {
        super(resourcesPanel, i18nString(UIStrings.sharedStorage), false, 'shared-storage');
        _SharedStorageListTreeElement_expandedSetting.set(this, void 0);
        __classPrivateFieldSet(this, _SharedStorageListTreeElement_expandedSetting, Common.Settings.Settings.instance().createSetting('resources-shared-storage-expanded', expandedSettingsDefault), "f");
        const sharedStorageIcon = IconButton.Icon.create('database');
        this.setLeadingIcons([sharedStorageIcon]);
        this.view = new SharedStorageEventsView();
    }
    get itemURL() {
        return 'shared-storage://';
    }
    onselect(selectedByUser) {
        super.onselect(selectedByUser);
        this.resourcesPanel.showView(this.view);
        return false;
    }
    onattach() {
        super.onattach();
        if (__classPrivateFieldGet(this, _SharedStorageListTreeElement_expandedSetting, "f").get()) {
            this.expand();
        }
    }
    onexpand() {
        __classPrivateFieldGet(this, _SharedStorageListTreeElement_expandedSetting, "f").set(true);
    }
    oncollapse() {
        __classPrivateFieldGet(this, _SharedStorageListTreeElement_expandedSetting, "f").set(false);
    }
    addEvent(event) {
        this.view.addEvent(event);
    }
}
_SharedStorageListTreeElement_expandedSetting = new WeakMap();
//# sourceMappingURL=SharedStorageListTreeElement.js.map