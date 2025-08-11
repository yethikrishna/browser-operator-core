// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AffectedSourcesView_instances, _AffectedSourcesView_appendAffectedSources, _AffectedSourcesView_appendAffectedSource;
import * as i18n from '../../core/i18n/i18n.js';
import * as Components from '../../ui/legacy/components/utils/utils.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { AffectedResourcesView } from './AffectedResourcesView.js';
const UIStrings = {
    /**
     *@description Singular or Plural label for number of affected sources (consisting of (source) file name + line number) in issue view
     */
    nSources: '{n, plural, =1 {# source} other {# sources}}',
};
const str_ = i18n.i18n.registerUIStrings('panels/issues/AffectedSourcesView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AffectedSourcesView extends AffectedResourcesView {
    constructor() {
        super(...arguments);
        _AffectedSourcesView_instances.add(this);
    }
    getResourceNameWithCount(count) {
        return i18nString(UIStrings.nSources, { n: count });
    }
    update() {
        this.clear();
        __classPrivateFieldGet(this, _AffectedSourcesView_instances, "m", _AffectedSourcesView_appendAffectedSources).call(this, this.issue.sources());
    }
}
_AffectedSourcesView_instances = new WeakSet(), _AffectedSourcesView_appendAffectedSources = function _AffectedSourcesView_appendAffectedSources(affectedSources) {
    let count = 0;
    for (const source of affectedSources) {
        __classPrivateFieldGet(this, _AffectedSourcesView_instances, "m", _AffectedSourcesView_appendAffectedSource).call(this, source);
        count++;
    }
    this.updateAffectedResourceCount(count);
}, _AffectedSourcesView_appendAffectedSource = function _AffectedSourcesView_appendAffectedSource({ url, lineNumber, columnNumber }) {
    const cellElement = document.createElement('td');
    // TODO(chromium:1072331): Check feasibility of plumping through scriptId for `linkifyScriptLocation`
    //                         to support source maps and formatted scripts.
    const linkifierURLOptions = { columnNumber, lineNumber, tabStop: true, showColumnNumber: false, inlineFrameIndex: 0 };
    // An element created with linkifyURL can subscribe to the events
    // 'click' neither 'keydown' if that key is the 'Enter' key.
    // Also, this element has a context menu, so we should be able to
    // track when the user use the context menu too.
    // TODO(crbug.com/1108503): Add some mechanism to be able to add telemetry to this element.
    const anchorElement = Components.Linkifier.Linkifier.linkifyURL(url, linkifierURLOptions);
    anchorElement.setAttribute('jslog', `${VisualLogging.link('source-location').track({ click: true })}`);
    cellElement.appendChild(anchorElement);
    const rowElement = document.createElement('tr');
    rowElement.classList.add('affected-resource-source');
    rowElement.appendChild(cellElement);
    this.affectedResources.appendChild(rowElement);
};
//# sourceMappingURL=AffectedSourcesView.js.map