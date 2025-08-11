// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _CSSHintDetailsView_instances, _CSSHintDetailsView_shadow, _CSSHintDetailsView_authoringHint, _CSSHintDetailsView_render;
import '../../../ui/legacy/legacy.js';
import * as i18n from '../../../core/i18n/i18n.js';
import { Directives, html, render } from '../../../ui/lit/lit.js';
import cssHintDetailsViewStyles from './cssHintDetailsView.css.js';
const UIStrings = {
    /**
     *@description Text for button that redirects to CSS property documentation.
     */
    learnMore: 'Learn More',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/components/CSSHintDetailsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class CSSHintDetailsView extends HTMLElement {
    constructor(authoringHint) {
        super();
        _CSSHintDetailsView_instances.add(this);
        _CSSHintDetailsView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _CSSHintDetailsView_authoringHint.set(this, void 0);
        __classPrivateFieldSet(this, _CSSHintDetailsView_authoringHint, authoringHint, "f");
        __classPrivateFieldGet(this, _CSSHintDetailsView_instances, "m", _CSSHintDetailsView_render).call(this);
    }
}
_CSSHintDetailsView_shadow = new WeakMap(), _CSSHintDetailsView_authoringHint = new WeakMap(), _CSSHintDetailsView_instances = new WeakSet(), _CSSHintDetailsView_render = function _CSSHintDetailsView_render() {
    const link = __classPrivateFieldGet(this, _CSSHintDetailsView_authoringHint, "f").getLearnMoreLink();
    // clang-format off
    render(html `
        <style>${cssHintDetailsViewStyles}</style>
        <div class="hint-popup-wrapper">
          <div class="hint-popup-reason">
            ${Directives.unsafeHTML(__classPrivateFieldGet(this, _CSSHintDetailsView_authoringHint, "f").getMessage())}
          </div>
          ${__classPrivateFieldGet(this, _CSSHintDetailsView_authoringHint, "f").getPossibleFixMessage() ? html `
              <div class="hint-popup-possible-fix">
                  ${Directives.unsafeHTML(__classPrivateFieldGet(this, _CSSHintDetailsView_authoringHint, "f").getPossibleFixMessage())}
              </div>
          ` : ''}
          ${link ? html `
                      <div class="footer">
                        <x-link id="learn-more" href=${link} class="clickable underlined unbreakable-text">
                            ${i18nString(UIStrings.learnMore)}
                        </x-link>
                      </div>
                  ` : ''}
        </div>
      `, __classPrivateFieldGet(this, _CSSHintDetailsView_shadow, "f"), {
        host: this,
    });
    // clang-format on
};
customElements.define('devtools-css-hint-details-view', CSSHintDetailsView);
//# sourceMappingURL=CSSHintDetailsView.js.map