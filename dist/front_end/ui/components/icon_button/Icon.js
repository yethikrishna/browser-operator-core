// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _Icon_shadowRoot, _Icon_icon;
import '../../../Images/Images.js';
import iconStyles from './icon.css.js';
/**
 * A simple icon component to display SVG icons from the `front_end/Images/src`
 * folder (via the `--image-file-<name>` CSS variables).
 *
 * Usage is simple:
 *
 * ```js
 * // Instantiate programmatically via the `create()` helper:
 * const icon = IconButton.Icon.create('bin');
 * const iconWithClassName = IconButton.Icon.create('bin', 'delete-icon');
 *
 * // Use within a template:
 * Lit.html`
 *   <devtools-icon name="bin">
 *   </devtools-icon>
 * `;
 * ```
 *
 * The color for the icon defaults to `var(--icon-default)`, while the dimensions
 * default to 20px times 20px. You can change both color and size via CSS:
 *
 * ```css
 * devtools-icon.my-icon {
 *   color: red;
 *   width: 14px;
 *   height: 14px;
 * }
 * ```
 *
 * For `'triangle-up'`, `'triangle-down'`, `'triangle-left'`, and `'triangle-right'`
 * the default dimensions are 14px times 14px, and the default `vertical-align` is
 * `baseline` (instead of `sub`).
 *
 * @attr name - The basename of the icon file (not including the `.svg` suffix). For
 *              backwards compatibility we also support a full URL here, but that
 *              should not be used in newly written code.
 * @prop {String} name - The `"name"` attribute is reflected as property.
 * @prop {IconData} data - Deprecated way to set dimensions, color and name at once.
 */
export class Icon extends HTMLElement {
    constructor() {
        super();
        _Icon_shadowRoot.set(this, void 0);
        _Icon_icon.set(this, void 0);
        this.role = 'presentation';
        const style = document.createElement('style');
        style.textContent = iconStyles;
        __classPrivateFieldSet(this, _Icon_icon, document.createElement('span'), "f");
        __classPrivateFieldSet(this, _Icon_shadowRoot, this.attachShadow({ mode: 'open' }), "f");
        __classPrivateFieldGet(this, _Icon_shadowRoot, "f").append(style, __classPrivateFieldGet(this, _Icon_icon, "f"));
    }
    /**
     * @deprecated use `name` and CSS instead.
     */
    get data() {
        return {
            color: this.style.color,
            width: this.style.width,
            height: this.style.height,
            iconName: this.name ?? '',
        };
    }
    /**
     * @deprecated use `name` and CSS instead.
     */
    set data(data) {
        const { color, width = '20px', height = '20px' } = data;
        this.style.color = color;
        this.style.width = width;
        this.style.height = height;
        if ('iconName' in data && data.iconName) {
            this.name = data.iconName;
        }
        else if ('iconPath' in data && data.iconPath) {
            this.name = data.iconPath;
        }
        else {
            throw new Error('Misconfigured `iconName` or `iconPath`.');
        }
    }
    /**
     * Yields the value of the `"name"` attribute of this `Icon` (`null` in case
     * there's no `"name"` on this element).
     */
    get name() {
        return this.getAttribute('name');
    }
    /**
     * Changes the value of the `"name"` attribute of this `Icon`. If you pass
     * `null` the `"name"` attribute will be removed from this element.
     *
     * @param name the new icon name or `null` to unset.
     */
    set name(name) {
        if (name === null) {
            this.removeAttribute('name');
        }
        else {
            this.setAttribute('name', name);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        switch (name) {
            case 'name': {
                if (newValue === null) {
                    __classPrivateFieldGet(this, _Icon_icon, "f").style.removeProperty('--icon-url');
                }
                else {
                    const url = URL.canParse(newValue) ? `url(${newValue})` : `var(--image-file-${newValue})`;
                    __classPrivateFieldGet(this, _Icon_icon, "f").style.setProperty('--icon-url', url);
                }
                break;
            }
        }
    }
}
_Icon_shadowRoot = new WeakMap(), _Icon_icon = new WeakMap();
Icon.observedAttributes = ['name'];
/**
 * Helper function to programmatically create an `Icon` isntance with a given
 * `name` and an optional CSS `className`.
 *
 * @param name the name of the icon to use.
 * @param className optional CSS class name(s) to put onto the element.
 * @return the newly created `Icon` instance.
 */
export const create = (name, className) => {
    const icon = new Icon();
    icon.name = name;
    if (className !== undefined) {
        icon.className = className;
    }
    return icon;
};
customElements.define('devtools-icon', Icon);
//# sourceMappingURL=Icon.js.map