// Copyright (c) 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _CategorySummary_instances, _CategorySummary_shadow, _CategorySummary_rangeStart, _CategorySummary_rangeEnd, _CategorySummary_total, _CategorySummary_categories, _CategorySummary_render;
import * as i18n from '../../../core/i18n/i18n.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import timelineSummaryStyles from './timelineSummary.css.js';
const { render, html } = Lit;
const UIStrings = {
    /**
     *@description Text for total
     */
    total: 'Total',
    /**
     *@description Range in Timeline Details View's Summary
     *@example {1ms} PH1
     *@example {10ms} PH2
     */
    rangeSS: 'Range:  {PH1} – {PH2}',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/TimelineSummary.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class CategorySummary extends HTMLElement {
    constructor() {
        super(...arguments);
        _CategorySummary_instances.add(this);
        _CategorySummary_shadow.set(this, UI.UIUtils.createShadowRootWithCoreStyles(this, { cssFile: timelineSummaryStyles, delegatesFocus: undefined }));
        _CategorySummary_rangeStart.set(this, 0);
        _CategorySummary_rangeEnd.set(this, 0);
        _CategorySummary_total.set(this, 0);
        _CategorySummary_categories.set(this, []);
    }
    set data(data) {
        __classPrivateFieldSet(this, _CategorySummary_total, data.total, "f");
        __classPrivateFieldSet(this, _CategorySummary_categories, data.categories, "f");
        __classPrivateFieldSet(this, _CategorySummary_rangeStart, data.rangeStart, "f");
        __classPrivateFieldSet(this, _CategorySummary_rangeEnd, data.rangeEnd, "f");
        __classPrivateFieldGet(this, _CategorySummary_instances, "m", _CategorySummary_render).call(this);
    }
}
_CategorySummary_shadow = new WeakMap(), _CategorySummary_rangeStart = new WeakMap(), _CategorySummary_rangeEnd = new WeakMap(), _CategorySummary_total = new WeakMap(), _CategorySummary_categories = new WeakMap(), _CategorySummary_instances = new WeakSet(), _CategorySummary_render = function _CategorySummary_render() {
    // clang-format off
    const output = html `
          <div class="timeline-summary">
              <div class="summary-range">${i18nString(UIStrings.rangeSS, { PH1: i18n.TimeUtilities.millisToString(__classPrivateFieldGet(this, _CategorySummary_rangeStart, "f")), PH2: i18n.TimeUtilities.millisToString(__classPrivateFieldGet(this, _CategorySummary_rangeEnd, "f")) })}</div>
              <div class="category-summary">
                  ${__classPrivateFieldGet(this, _CategorySummary_categories, "f").map(category => {
        return html `
                          <div class="category-row">
                          <div class="category-swatch" style="background-color: ${category.color};"></div>
                          <div class="category-name">${category.title}</div>
                          <div class="category-value">
                              ${i18n.TimeUtilities.preciseMillisToString(category.value)}
                              <div class="background-bar-container">
                                  <div class="background-bar" style='width: ${(category.value * 100 / __classPrivateFieldGet(this, _CategorySummary_total, "f")).toFixed(1)}%;'></div>
                              </div>
                          </div>
                          </div>`;
    })}
                  <div class="category-row">
                      <div class="category-swatch"></div>
                      <div class="category-name">${i18nString(UIStrings.total)}</div>
                      <div class="category-value">
                          ${i18n.TimeUtilities.preciseMillisToString(__classPrivateFieldGet(this, _CategorySummary_total, "f"))}
                          <div class="background-bar-container">
                              <div class="background-bar"></div>
                          </div>
                      </div>
                  </div>
                </div>
          </div>
          </div>

        </div>`;
    // clang-format on
    render(output, __classPrivateFieldGet(this, _CategorySummary_shadow, "f"), { host: this });
};
customElements.define('devtools-performance-timeline-summary', CategorySummary);
//# sourceMappingURL=TimelineSummary.js.map