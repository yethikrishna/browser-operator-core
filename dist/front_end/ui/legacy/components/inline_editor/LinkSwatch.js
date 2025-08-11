// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _LinkSwatch_linkElement;
import * as Platform from '../../../../core/platform/platform.js';
import * as Buttons from '../../../components/buttons/buttons.js';
import * as Lit from '../../../lit/lit.js';
import * as VisualLogging from '../../../visual_logging/visual_logging.js';
import linkSwatchStyles from './linkSwatch.css.js';
const { render, html, nothing, Directives: { ref, ifDefined, classMap } } = Lit;
export class LinkSwatch extends HTMLElement {
    constructor() {
        super(...arguments);
        this.onLinkActivate = () => undefined;
        _LinkSwatch_linkElement.set(this, void 0);
    }
    connectedCallback() {
    }
    set data(data) {
        this.onLinkActivate = (linkText, event) => {
            if (event instanceof MouseEvent && event.button !== 0) {
                return;
            }
            if (event instanceof KeyboardEvent && event.key !== Platform.KeyboardUtilities.ENTER_KEY && event.key !== ' ') {
                return;
            }
            data.onLinkActivate(linkText);
            event.consume(true);
        };
        this.render(data);
    }
    get linkElement() {
        return __classPrivateFieldGet(this, _LinkSwatch_linkElement, "f");
    }
    render(data) {
        const { isDefined, text, jslogContext, tooltip } = data;
        const classes = classMap({
            'link-style': true,
            'text-button': true,
            'link-swatch-link': true,
            undefined: !isDefined,
        });
        // The linkText's space must be removed, otherwise it cannot be triggered when clicked.
        const onActivate = isDefined ? this.onLinkActivate.bind(this, text.trim()) : null;
        const title = tooltip && 'title' in tooltip && tooltip.title || undefined;
        const tooltipId = tooltip && 'tooltipId' in tooltip && tooltip.tooltipId || undefined;
        // clang-format off
        render(html `
        <style>${Buttons.textButtonStyles}</style>
        <style>${linkSwatchStyles}</style>
        <button .disabled=${!isDefined} class=${classes} type="button" title=${ifDefined(title)}
                aria-details=${ifDefined(tooltipId)} @click=${onActivate} @keydown=${onActivate}
                role="link"
                jslog=${jslogContext ? VisualLogging.link().track({ click: true }).context(jslogContext) : nothing}
                tabindex=${ifDefined(isDefined ? -1 : undefined)}
                ${ref(e => { __classPrivateFieldSet(this, _LinkSwatch_linkElement, e, "f"); })}>
           ${text}
        </button>`, this);
        // clang-format on
    }
}
_LinkSwatch_linkElement = new WeakMap();
customElements.define('devtools-link-swatch', LinkSwatch);
//# sourceMappingURL=LinkSwatch.js.map