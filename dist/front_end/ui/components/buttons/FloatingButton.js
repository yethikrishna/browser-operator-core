var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FloatingButton_instances, _FloatingButton_shadow, _FloatingButton_render, _FloatingButton_updateJslog;
// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
import '../icon_button/icon_button.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Lit from '../../lit/lit.js';
import floatingButtonStyles from './floatingButton.css.js';
const { html } = Lit;
/**
 * A simple floating button component, primarily used to display the 'Ask AI!'
 * teaser when hovering over specific UI elements.
 *
 * Usage is simple:
 *
 * ```js
 * // Instantiate programmatically via the `create()` helper:
 * const button = Buttons.FloatingButton.create('smart-assistant', 'Ask AI!');
 *
 * // Use within a template:
 * html`
 * <devtools-floating-button icon-name="smart-assistant"
 *                           title="Ask AI!">
 * </devtools-floating-button>
 * `;
 * ```
 *
 * @attr icon-name - The basename of the icon file (not including the `.svg`
 *                   suffix).
 * @attr jslogcontext - The context for the `jslog` attribute. A `jslog`
 *                      attribute is generated automatically with the
 *                      provided context.
 * @prop {String} iconName - The `"icon-name"` attribute is reflected as a property.
 * @prop {String} jslogContext - The `"jslogcontext"` attribute is reflected as a property.
 */
export class FloatingButton extends HTMLElement {
    constructor() {
        super();
        _FloatingButton_instances.add(this);
        _FloatingButton_shadow.set(this, this.attachShadow({ mode: 'open' }));
        this.role = 'presentation';
        __classPrivateFieldGet(this, _FloatingButton_instances, "m", _FloatingButton_render).call(this);
    }
    /**
     * Yields the value of the `"icon-name"` attribute of this `FloatingButton`
     * (`null` in case there's no `"icon-name"` on this element).
     */
    get iconName() {
        return this.getAttribute('icon-name');
    }
    /**
     * Changes the value of the `"icon-name"` attribute of this `FloatingButton`.
     * If you pass `null`, the `"icon-name"` attribute will be removed from this
     * element.
     *
     * @param the new icon name or `null` to unset.
     */
    set iconName(iconName) {
        if (iconName === null) {
            this.removeAttribute('icon-name');
        }
        else {
            this.setAttribute('icon-name', iconName);
        }
    }
    get jslogContext() {
        return this.getAttribute('jslogcontext');
    }
    set jslogContext(jslogContext) {
        if (jslogContext === null) {
            this.removeAttribute('jslogcontext');
        }
        else {
            this.setAttribute('jslogcontext', jslogContext);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (name === 'icon-name') {
            __classPrivateFieldGet(this, _FloatingButton_instances, "m", _FloatingButton_render).call(this);
        }
        if (name === 'jslogcontext') {
            __classPrivateFieldGet(this, _FloatingButton_instances, "m", _FloatingButton_updateJslog).call(this);
        }
    }
}
_FloatingButton_shadow = new WeakMap(), _FloatingButton_instances = new WeakSet(), _FloatingButton_render = function _FloatingButton_render() {
    // clang-format off
    Lit.render(html `
        <style>${floatingButtonStyles}</style>
        <button><devtools-icon .name=${this.iconName}></devtools-icon></button>`, __classPrivateFieldGet(this, _FloatingButton_shadow, "f"), { host: this });
    // clang-format on
}, _FloatingButton_updateJslog = function _FloatingButton_updateJslog() {
    if (this.jslogContext) {
        this.setAttribute('jslog', `${VisualLogging.action().track({ click: true }).context(this.jslogContext)}`);
    }
    else {
        this.removeAttribute('jslog');
    }
};
FloatingButton.observedAttributes = ['icon-name', 'jslogcontext'];
/**
 * Helper function to programmatically create a `FloatingButton` instance with a
 * given `iconName` and `title`.
 *
 * @param iconName the name of the icon to use
 * @param title the tooltip for the `FloatingButton`
 * @param jslogContext the context string for the `jslog` attribute
 * @returns the newly created `FloatingButton` instance.
 */
export const create = (iconName, title, jslogContext) => {
    const floatingButton = new FloatingButton();
    floatingButton.iconName = iconName;
    floatingButton.title = title;
    if (jslogContext) {
        floatingButton.jslogContext = jslogContext;
    }
    return floatingButton;
};
customElements.define('devtools-floating-button', FloatingButton);
//# sourceMappingURL=FloatingButton.js.map