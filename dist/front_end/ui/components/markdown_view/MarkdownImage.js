// Copyright (c) 2020 The Chromium Authors. All rights reserved.
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
var _MarkdownImage_instances, _MarkdownImage_shadow, _MarkdownImage_imageData, _MarkdownImage_imageTitle, _MarkdownImage_getIconComponent, _MarkdownImage_getImageComponent, _MarkdownImage_render;
import '../../components/icon_button/icon_button.js';
import * as Lit from '../../lit/lit.js';
import markdownImageStyles from './markdownImage.css.js';
import { getMarkdownImage } from './MarkdownImagesMap.js';
const { html, Directives: { ifDefined } } = Lit;
/**
 * Component to render images from parsed markdown.
 * Parsed images from markdown are not directly rendered, instead they have to be added to the MarkdownImagesMap.ts.
 * This makes sure that all icons/images are accounted for in markdown.
 */
export class MarkdownImage extends HTMLElement {
    constructor() {
        super(...arguments);
        _MarkdownImage_instances.add(this);
        _MarkdownImage_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _MarkdownImage_imageData.set(this, void 0);
        _MarkdownImage_imageTitle.set(this, void 0);
    }
    set data(data) {
        const { key, title } = data;
        const markdownImage = getMarkdownImage(key);
        __classPrivateFieldSet(this, _MarkdownImage_imageData, markdownImage, "f");
        __classPrivateFieldSet(this, _MarkdownImage_imageTitle, title, "f");
        __classPrivateFieldGet(this, _MarkdownImage_instances, "m", _MarkdownImage_render).call(this);
    }
}
_MarkdownImage_shadow = new WeakMap(), _MarkdownImage_imageData = new WeakMap(), _MarkdownImage_imageTitle = new WeakMap(), _MarkdownImage_instances = new WeakSet(), _MarkdownImage_getIconComponent = function _MarkdownImage_getIconComponent() {
    if (!__classPrivateFieldGet(this, _MarkdownImage_imageData, "f")) {
        return html ``;
    }
    const { src, color, width = '100%', height = '100%' } = __classPrivateFieldGet(this, _MarkdownImage_imageData, "f");
    return html `
      <devtools-icon .data=${{ iconPath: src, color, width, height }}></devtools-icon>
    `;
}, _MarkdownImage_getImageComponent = function _MarkdownImage_getImageComponent() {
    if (!__classPrivateFieldGet(this, _MarkdownImage_imageData, "f")) {
        return html ``;
    }
    const { src, width = '100%', height = '100%' } = __classPrivateFieldGet(this, _MarkdownImage_imageData, "f");
    return html `
      <img class="markdown-image" src=${src} alt=${ifDefined(__classPrivateFieldGet(this, _MarkdownImage_imageTitle, "f"))} width=${width} height=${height} />
    `;
}, _MarkdownImage_render = function _MarkdownImage_render() {
    if (!__classPrivateFieldGet(this, _MarkdownImage_imageData, "f")) {
        return;
    }
    const { isIcon } = __classPrivateFieldGet(this, _MarkdownImage_imageData, "f");
    const imageComponent = isIcon ? __classPrivateFieldGet(this, _MarkdownImage_instances, "m", _MarkdownImage_getIconComponent).call(this) : __classPrivateFieldGet(this, _MarkdownImage_instances, "m", _MarkdownImage_getImageComponent).call(this);
    Lit.render(html `
      <style>${markdownImageStyles}</style>
      ${imageComponent}
    `, __classPrivateFieldGet(this, _MarkdownImage_shadow, "f"), { host: this });
};
customElements.define('devtools-markdown-image', MarkdownImage);
//# sourceMappingURL=MarkdownImage.js.map