// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Card_instances, _Card_shadow, _Card_render;
import { html, nothing, render } from '../../lit/lit.js';
import cardStyles from './card.css.js';
/**
 * A simple card component to display a Material card with a heading and content.
 *
 * Usage is simple:
 *
 * ```
 * // Instantiate programmatically:
 * const card = document.createElement('devtools-card');
 * card.heading = 'My awesome card';
 * card.append(content1, content2);
 *
 * // Use within a template:
 * html`
 *   <devtools-card heading="My awesome card">
 *     <div>content1</div>
 *     <div>content2</div>
 *   </devtools-card>
 * `;
 * ```
 *
 * The heading can be further customized with a prefix and a suffix if needed.
 * These are arbitrary children that can be slotted into the `"heading-prefix"`
 * and `"heading-suffix"` slots if required. Example:
 *
 * ```
 * html`
 *   <devtools-card heading="Rich heading">
 *     <devtools-icon name="folder" slot="heading-prefix"></devtools-icon>
 *     <devtools-button slot="heading-suffix">Remove</devtools-button>
 *   </devtools-card>
 * `;
 * ```
 *
 * @attr heading - The heading text.
 * @prop {String} heading - The `"heading"` attribute is reflect as property.
 */
export class Card extends HTMLElement {
    constructor() {
        super();
        _Card_instances.add(this);
        _Card_shadow.set(this, this.attachShadow({ mode: 'open' }));
        __classPrivateFieldGet(this, _Card_instances, "m", _Card_render).call(this);
    }
    /**
     * Yields the value of the `"heading"` attribute of this `Card`.
     *
     * @returns the value of the `"heading"` attribute or `null` if the attribute
     *          is absent.
     */
    get heading() {
        return this.getAttribute('heading');
    }
    /**
     * Changes the value of the `"heading"` attribute of this `Card`. If you pass
     * `null`, the `"heading"` attribute will be removed from this element.
     *
     * @param heading the new heading of `null` to unset.
     */
    set heading(heading) {
        if (heading) {
            this.setAttribute('heading', heading);
        }
        else {
            this.removeAttribute('heading');
        }
    }
    attributeChangedCallback(_name, oldValue, newValue) {
        if (oldValue !== newValue) {
            __classPrivateFieldGet(this, _Card_instances, "m", _Card_render).call(this);
        }
    }
}
_Card_shadow = new WeakMap(), _Card_instances = new WeakSet(), _Card_render = function _Card_render() {
    render(html `
        <style>${cardStyles}</style>
        <div id="card">
          <div id="heading">
            <slot name="heading-prefix"></slot>
            <div role="heading" aria-level="2">${this.heading ?? nothing}</div>
            <slot name="heading-suffix"></slot>
          </div>
          <slot id="content"></slot>
        </div>`, __classPrivateFieldGet(this, _Card_shadow, "f"), { host: this });
};
Card.observedAttributes = ['heading'];
customElements.define('devtools-card', Card);
//# sourceMappingURL=Card.js.map