// Copyright 2019 The Chromium Authors. All rights reserved.
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
var _CSSOverviewProcessingView_onCancel, _CSSOverviewProcessingView_view;
import * as i18n from '../../core/i18n/i18n.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as UI from '../../ui/legacy/legacy.js';
import { html, render } from '../../ui/lit/lit.js';
import cssOverviewProcessingViewStyles from './cssOverviewProcessingView.css.js';
const UIStrings = {
    /**
     *@description Text to cancel something
     */
    cancel: 'Cancel',
};
const str_ = i18n.i18n.registerUIStrings('panels/css_overview/CSSOverviewProcessingView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export const DEFAULT_VIEW = (input, _output, target) => {
    // clang-format off
    render(html `
    <style>${cssOverviewProcessingViewStyles}</style>
    <div style="overflow:auto">
      <div class="vbox overview-processing-view">
        <h1>Processing page</h1>
        <div>
          <devtools-button
              @click=${input.onCancel}
              .jslogContext=${'css-overview.cancel-processing'}
              .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}>${i18nString(UIStrings.cancel)}</devtools-button>
        </div>
      </div>
    </div>`, target, { host: input });
    // clang-format on
};
export class CSSOverviewProcessingView extends UI.Widget.Widget {
    constructor(element, view = DEFAULT_VIEW) {
        super(false, false, element);
        _CSSOverviewProcessingView_onCancel.set(this, () => { });
        _CSSOverviewProcessingView_view.set(this, void 0);
        __classPrivateFieldSet(this, _CSSOverviewProcessingView_view, view, "f");
        this.requestUpdate();
    }
    set onCancel(onCancel) {
        __classPrivateFieldSet(this, _CSSOverviewProcessingView_onCancel, onCancel, "f");
        this.requestUpdate();
    }
    performUpdate() {
        __classPrivateFieldGet(this, _CSSOverviewProcessingView_view, "f").call(this, { onCancel: __classPrivateFieldGet(this, _CSSOverviewProcessingView_onCancel, "f") }, {}, this.element);
    }
}
_CSSOverviewProcessingView_onCancel = new WeakMap(), _CSSOverviewProcessingView_view = new WeakMap();
//# sourceMappingURL=CSSOverviewProcessingView.js.map