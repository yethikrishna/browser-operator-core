// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AffectedElementsView_instances, _AffectedElementsView_appendAffectedElements, _AffectedElementsView_appendAffectedElement;
import * as i18n from '../../core/i18n/i18n.js';
import { AffectedResourcesView } from './AffectedResourcesView.js';
const UIStrings = {
    /**
     *@description Noun for singular or plural number of affected element resource indication in issue view.
     */
    nElements: '{n, plural, =1 {# element} other {# elements}}',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/AffectedElementsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AffectedElementsView extends AffectedResourcesView {
    constructor() {
        super(...arguments);
        _AffectedElementsView_instances.add(this);
    }
    getResourceNameWithCount(count) {
        return i18nString(UIStrings.nElements, { n: count });
    }
    update() {
        this.clear();
        void __classPrivateFieldGet(this, _AffectedElementsView_instances, "m", _AffectedElementsView_appendAffectedElements).call(this, this.issue.elements());
    }
}
_AffectedElementsView_instances = new WeakSet(), _AffectedElementsView_appendAffectedElements = async function _AffectedElementsView_appendAffectedElements(affectedElements) {
    let count = 0;
    for (const element of affectedElements) {
        await __classPrivateFieldGet(this, _AffectedElementsView_instances, "m", _AffectedElementsView_appendAffectedElement).call(this, element);
        count++;
    }
    this.updateAffectedResourceCount(count);
}, _AffectedElementsView_appendAffectedElement = async function _AffectedElementsView_appendAffectedElement(element) {
    const cellElement = await this.createElementCell(element, this.issue.getCategory());
    const rowElement = document.createElement('tr');
    rowElement.appendChild(cellElement);
    this.affectedResources.appendChild(rowElement);
};
//# sourceMappingURL=AffectedElementsView.js.map