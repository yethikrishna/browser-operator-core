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
var _AffectedDescendantsWithinSelectElementView_instances, _AffectedDescendantsWithinSelectElementView_runningUpdatePromise, _AffectedDescendantsWithinSelectElementView_doUpdate, _AffectedDescendantsWithinSelectElementView_appendDisallowedSelectDescendant, _AffectedDescendantsWithinSelectElementView_appendDisallowedSelectDescendants;
import * as i18n from '../../core/i18n/i18n.js';
import { AffectedElementsView } from './AffectedElementsView.js';
const UIStrings = {
    /**
     *@description Noun for singular or plural number of affected descendant nodes indication in issue view.
     */
    nDescendants: '{n, plural, =1 { descendant} other { descendants}}',
    /**
     *@description Label for the disallowed node link in the issue view.
     */
    disallowedNode: 'Disallowed descendant',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/AffectedDescendantsWithinSelectElementView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AffectedDescendantsWithinSelectElementView extends AffectedElementsView {
    constructor() {
        super(...arguments);
        _AffectedDescendantsWithinSelectElementView_instances.add(this);
        _AffectedDescendantsWithinSelectElementView_runningUpdatePromise.set(this, Promise.resolve());
    }
    update() {
        // Ensure that doUpdate is invoked atomically by serializing the update calls
        // because it's not re-entrace safe.
        __classPrivateFieldSet(this, _AffectedDescendantsWithinSelectElementView_runningUpdatePromise, __classPrivateFieldGet(this, _AffectedDescendantsWithinSelectElementView_runningUpdatePromise, "f").then(__classPrivateFieldGet(this, _AffectedDescendantsWithinSelectElementView_instances, "m", _AffectedDescendantsWithinSelectElementView_doUpdate).bind(this)), "f");
    }
    getResourceName(count) {
        return i18nString(UIStrings.nDescendants, { n: count });
    }
}
_AffectedDescendantsWithinSelectElementView_runningUpdatePromise = new WeakMap(), _AffectedDescendantsWithinSelectElementView_instances = new WeakSet(), _AffectedDescendantsWithinSelectElementView_doUpdate = async function _AffectedDescendantsWithinSelectElementView_doUpdate() {
    this.clear();
    await __classPrivateFieldGet(this, _AffectedDescendantsWithinSelectElementView_instances, "m", _AffectedDescendantsWithinSelectElementView_appendDisallowedSelectDescendants).call(this, this.issue.getElementAccessibilityIssues());
}, _AffectedDescendantsWithinSelectElementView_appendDisallowedSelectDescendant = async function _AffectedDescendantsWithinSelectElementView_appendDisallowedSelectDescendant(issue) {
    const row = document.createElement('tr');
    row.classList.add('affected-resource-select-element-descendant');
    const details = issue.details();
    const target = issue.model()?.target() || null;
    row.appendChild(await this.createElementCell({ nodeName: i18nString(UIStrings.disallowedNode), backendNodeId: details.nodeId, target }, issue.getCategory()));
    this.affectedResources.appendChild(row);
}, _AffectedDescendantsWithinSelectElementView_appendDisallowedSelectDescendants = async function _AffectedDescendantsWithinSelectElementView_appendDisallowedSelectDescendants(issues) {
    let count = 0;
    for (const issue of issues) {
        count++;
        await __classPrivateFieldGet(this, _AffectedDescendantsWithinSelectElementView_instances, "m", _AffectedDescendantsWithinSelectElementView_appendDisallowedSelectDescendant).call(this, issue);
    }
    this.updateAffectedResourceCount(count);
};
//# sourceMappingURL=AffectedDescendantsWithinSelectElementView.js.map