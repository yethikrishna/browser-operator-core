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
var _MarkdownLink_instances, _MarkdownLink_shadow, _MarkdownLink_linkText, _MarkdownLink_linkUrl, _MarkdownLink_render;
import '../../legacy/legacy.js'; // Required for <x-link>.
import { html, render } from '../../lit/lit.js';
import * as VisualLogging from '../../visual_logging/visual_logging.js';
import markdownLinkStyles from './markdownLink.css.js';
import { getMarkdownLink } from './MarkdownLinksMap.js';
/**
 * Component to render link from parsed markdown.
 * Parsed links from markdown are not directly rendered, instead they have to be added to the <key, link> map in MarkdownLinksMap.ts.
 * This makes sure that all links are accounted for and no bad links are introduced to devtools via markdown.
 */
export class MarkdownLink extends HTMLElement {
    constructor() {
        super(...arguments);
        _MarkdownLink_instances.add(this);
        _MarkdownLink_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _MarkdownLink_linkText.set(this, '');
        _MarkdownLink_linkUrl.set(this, '');
    }
    set data(data) {
        const { key, title } = data;
        const markdownLink = getMarkdownLink(key);
        __classPrivateFieldSet(this, _MarkdownLink_linkText, title, "f");
        __classPrivateFieldSet(this, _MarkdownLink_linkUrl, markdownLink, "f");
        __classPrivateFieldGet(this, _MarkdownLink_instances, "m", _MarkdownLink_render).call(this);
    }
}
_MarkdownLink_shadow = new WeakMap(), _MarkdownLink_linkText = new WeakMap(), _MarkdownLink_linkUrl = new WeakMap(), _MarkdownLink_instances = new WeakSet(), _MarkdownLink_render = function _MarkdownLink_render() {
    // clang-format off
    const output = html `
      <style>${markdownLinkStyles}</style>
      <x-link class="devtools-link" href=${__classPrivateFieldGet(this, _MarkdownLink_linkUrl, "f")} jslog=${VisualLogging.link().track({ click: true })}
      >${__classPrivateFieldGet(this, _MarkdownLink_linkText, "f")}</x-link>`;
    render(output, __classPrivateFieldGet(this, _MarkdownLink_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-markdown-link', MarkdownLink);
//# sourceMappingURL=MarkdownLink.js.map