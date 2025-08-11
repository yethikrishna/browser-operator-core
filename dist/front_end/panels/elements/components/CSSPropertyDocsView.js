// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _CSSPropertyDocsView_instances, _CSSPropertyDocsView_shadow, _CSSPropertyDocsView_cssProperty, _CSSPropertyDocsView_dontShowChanged, _CSSPropertyDocsView_render;
import '../../../ui/legacy/legacy.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import { html, nothing, render } from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import CSSPropertyDocsViewStyles from './cssPropertyDocsView.css.js';
const UIStrings = {
    /**
     *@description Text for button that redirects to CSS property documentation.
     */
    learnMore: 'Learn more',
    /**
     *@description Text for a checkbox to turn off the CSS property documentation.
     */
    dontShow: 'Don\'t show',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/components/CSSPropertyDocsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class CSSPropertyDocsView extends HTMLElement {
    constructor(cssProperty) {
        super();
        _CSSPropertyDocsView_instances.add(this);
        _CSSPropertyDocsView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _CSSPropertyDocsView_cssProperty.set(this, void 0);
        __classPrivateFieldSet(this, _CSSPropertyDocsView_cssProperty, cssProperty, "f");
        __classPrivateFieldGet(this, _CSSPropertyDocsView_instances, "m", _CSSPropertyDocsView_render).call(this);
    }
}
_CSSPropertyDocsView_shadow = new WeakMap(), _CSSPropertyDocsView_cssProperty = new WeakMap(), _CSSPropertyDocsView_instances = new WeakSet(), _CSSPropertyDocsView_dontShowChanged = function _CSSPropertyDocsView_dontShowChanged(e) {
    const showDocumentation = !e.target.checked;
    Common.Settings.Settings.instance()
        .moduleSetting('show-css-property-documentation-on-hover')
        .set(showDocumentation);
}, _CSSPropertyDocsView_render = function _CSSPropertyDocsView_render() {
    const description = __classPrivateFieldGet(this, _CSSPropertyDocsView_cssProperty, "f").description;
    const link = __classPrivateFieldGet(this, _CSSPropertyDocsView_cssProperty, "f").references?.[0].url;
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${CSSPropertyDocsViewStyles}</style>
      <div class="docs-popup-wrapper">
        ${description ? html `
          <div id="description">
            ${description}
          </div>
        ` : nothing}
        ${link ? html `
          <div class="docs-popup-section footer">
            <x-link
              id="learn-more"
              href=${link}
              class="clickable underlined unbreakable-text"
            >
              ${i18nString(UIStrings.learnMore)}
            </x-link>
            <devtools-checkbox
              @change=${__classPrivateFieldGet(this, _CSSPropertyDocsView_instances, "m", _CSSPropertyDocsView_dontShowChanged)}
              jslog=${VisualLogging.toggle('css-property-doc').track({ change: true })}>
              ${i18nString(UIStrings.dontShow)}
            </devtools-checkbox>
          </div>
        ` : nothing}
      </div>
    `, __classPrivateFieldGet(this, _CSSPropertyDocsView_shadow, "f"), {
        host: this,
    });
    // clang-format on
};
customElements.define('devtools-css-property-docs-view', CSSPropertyDocsView);
//# sourceMappingURL=CSSPropertyDocsView.js.map