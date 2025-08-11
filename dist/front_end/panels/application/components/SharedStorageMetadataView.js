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
var _SharedStorageMetadataView_instances, _SharedStorageMetadataView_sharedStorageMetadataGetter, _SharedStorageMetadataView_creationTime, _SharedStorageMetadataView_length, _SharedStorageMetadataView_bytesUsed, _SharedStorageMetadataView_remainingBudget, _SharedStorageMetadataView_resetBudget, _SharedStorageMetadataView_renderDateForCreationTime, _SharedStorageMetadataView_renderResetBudgetButton;
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as Lit from '../../../ui/lit/lit.js';
import sharedStorageMetadataViewStyles from './sharedStorageMetadataView.css.js';
import { StorageMetadataView } from './StorageMetadataView.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description Text in SharedStorage Metadata View of the Application panel
     */
    sharedStorage: 'Shared storage',
    /**
     *@description The time when the origin most recently created its shared storage database
     */
    creation: 'Creation Time',
    /**
     *@description The placeholder text if there is no creation time because the origin is not yet using shared storage.
     */
    notYetCreated: 'Not yet created',
    /**
     *@description The number of entries currently in the origin's database
     */
    numEntries: 'Number of Entries',
    /**
     *@description The number of bits remaining in the origin's shared storage privacy budget
     */
    entropyBudget: 'Entropy Budget for Fenced Frames',
    /**
     *@description Hover text for `entropyBudget` giving a more detailed explanation
     */
    budgetExplanation: 'Remaining data leakage allowed within a 24-hour period for this origin in bits of entropy',
    /**
     *@description Label for a button which when clicked causes the budget to be reset to the max.
     */
    resetBudget: 'Reset Budget',
    /**
     *@description The number of bytes used by entries currently in the origin's database
     */
    numBytesUsed: 'Number of Bytes Used',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/components/SharedStorageMetadataView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class SharedStorageMetadataView extends StorageMetadataView {
    constructor(sharedStorageMetadataGetter, owner) {
        super();
        _SharedStorageMetadataView_instances.add(this);
        _SharedStorageMetadataView_sharedStorageMetadataGetter.set(this, void 0);
        _SharedStorageMetadataView_creationTime.set(this, null);
        _SharedStorageMetadataView_length.set(this, 0);
        _SharedStorageMetadataView_bytesUsed.set(this, 0);
        _SharedStorageMetadataView_remainingBudget.set(this, 0);
        __classPrivateFieldSet(this, _SharedStorageMetadataView_sharedStorageMetadataGetter, sharedStorageMetadataGetter, "f");
        this.classList.add('overflow-auto');
        this.setStorageKey(owner);
    }
    getTitle() {
        return i18nString(UIStrings.sharedStorage);
    }
    async renderReportContent() {
        const metadata = await __classPrivateFieldGet(this, _SharedStorageMetadataView_sharedStorageMetadataGetter, "f").getMetadata();
        __classPrivateFieldSet(this, _SharedStorageMetadataView_creationTime, metadata?.creationTime ?? null, "f");
        __classPrivateFieldSet(this, _SharedStorageMetadataView_length, metadata?.length ?? 0, "f");
        __classPrivateFieldSet(this, _SharedStorageMetadataView_bytesUsed, metadata?.bytesUsed ?? 0, "f");
        __classPrivateFieldSet(this, _SharedStorageMetadataView_remainingBudget, metadata?.remainingBudget ?? 0, "f");
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
      <style>${sharedStorageMetadataViewStyles}</style>
      ${await super.renderReportContent()}
      ${this.key(i18nString(UIStrings.creation))}
      ${this.value(__classPrivateFieldGet(this, _SharedStorageMetadataView_instances, "m", _SharedStorageMetadataView_renderDateForCreationTime).call(this))}
      ${this.key(i18nString(UIStrings.numEntries))}
      ${this.value(String(__classPrivateFieldGet(this, _SharedStorageMetadataView_length, "f")))}
      ${this.key(i18nString(UIStrings.numBytesUsed))}
      ${this.value(String(__classPrivateFieldGet(this, _SharedStorageMetadataView_bytesUsed, "f")))}
      ${this.key(html `<span class="entropy-budget">${i18nString(UIStrings.entropyBudget)}<devtools-icon name="info" title=${i18nString(UIStrings.budgetExplanation)}></devtools-icon></span>`)}
      ${this.value(html `<span class="entropy-budget">${__classPrivateFieldGet(this, _SharedStorageMetadataView_remainingBudget, "f")}${__classPrivateFieldGet(this, _SharedStorageMetadataView_instances, "m", _SharedStorageMetadataView_renderResetBudgetButton).call(this)}</span>`)}`;
        // clang-format on
    }
}
_SharedStorageMetadataView_sharedStorageMetadataGetter = new WeakMap(), _SharedStorageMetadataView_creationTime = new WeakMap(), _SharedStorageMetadataView_length = new WeakMap(), _SharedStorageMetadataView_bytesUsed = new WeakMap(), _SharedStorageMetadataView_remainingBudget = new WeakMap(), _SharedStorageMetadataView_instances = new WeakSet(), _SharedStorageMetadataView_resetBudget = async function _SharedStorageMetadataView_resetBudget() {
    await __classPrivateFieldGet(this, _SharedStorageMetadataView_sharedStorageMetadataGetter, "f").resetBudget();
    await this.render();
}, _SharedStorageMetadataView_renderDateForCreationTime = function _SharedStorageMetadataView_renderDateForCreationTime() {
    if (!__classPrivateFieldGet(this, _SharedStorageMetadataView_creationTime, "f")) {
        return html `${i18nString(UIStrings.notYetCreated)}`;
    }
    const date = new Date(1e3 * (__classPrivateFieldGet(this, _SharedStorageMetadataView_creationTime, "f")));
    return html `${date.toLocaleString()}`;
}, _SharedStorageMetadataView_renderResetBudgetButton = function _SharedStorageMetadataView_renderResetBudgetButton() {
    // clang-format off
    return html `
      <devtools-button .iconName=${'undo'}
                       .jslogContext=${'reset-entropy-budget'}
                       .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
                       .title=${i18nString(UIStrings.resetBudget)}
                       .variant=${"icon" /* Buttons.Button.Variant.ICON */}
                       @click=${__classPrivateFieldGet(this, _SharedStorageMetadataView_instances, "m", _SharedStorageMetadataView_resetBudget).bind(this)}></devtools-button>
    `;
    // clang-format on
};
customElements.define('devtools-shared-storage-metadata-view', SharedStorageMetadataView);
//# sourceMappingURL=SharedStorageMetadataView.js.map