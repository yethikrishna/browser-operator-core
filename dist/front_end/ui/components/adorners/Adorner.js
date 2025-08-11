// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _Adorner_instances, _Adorner_shadow, _Adorner_isToggle, _Adorner_ariaLabelDefault, _Adorner_ariaLabelActive, _Adorner_content, _Adorner_jslogContext, _Adorner_render;
import { html, render } from '../../../ui/lit/lit.js';
import * as VisualElements from '../../visual_logging/visual_logging.js';
import adornerStyles from './adorner.css.js';
export class Adorner extends HTMLElement {
    constructor() {
        super(...arguments);
        _Adorner_instances.add(this);
        this.name = '';
        _Adorner_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _Adorner_isToggle.set(this, false);
        _Adorner_ariaLabelDefault.set(this, void 0);
        _Adorner_ariaLabelActive.set(this, void 0);
        _Adorner_content.set(this, void 0);
        _Adorner_jslogContext.set(this, void 0);
    }
    set data(data) {
        this.name = data.name;
        __classPrivateFieldSet(this, _Adorner_jslogContext, data.jslogContext, "f");
        if (data.content) {
            __classPrivateFieldGet(this, _Adorner_content, "f")?.remove();
            this.append(data.content);
            __classPrivateFieldSet(this, _Adorner_content, data.content, "f");
        }
        __classPrivateFieldGet(this, _Adorner_instances, "m", _Adorner_render).call(this);
    }
    cloneNode(deep) {
        const node = super.cloneNode(deep);
        node.data = { name: this.name, content: __classPrivateFieldGet(this, _Adorner_content, "f"), jslogContext: __classPrivateFieldGet(this, _Adorner_jslogContext, "f") };
        return node;
    }
    connectedCallback() {
        if (!this.getAttribute('aria-label')) {
            this.setAttribute('aria-label', this.name);
        }
        if (__classPrivateFieldGet(this, _Adorner_jslogContext, "f") && !this.getAttribute('jslog')) {
            this.setAttribute('jslog', `${VisualElements.adorner(__classPrivateFieldGet(this, _Adorner_jslogContext, "f"))}`);
        }
    }
    isActive() {
        return this.getAttribute('aria-pressed') === 'true';
    }
    /**
     * Toggle the active state of the adorner. Optionally pass `true` to force-set
     * an active state; pass `false` to force-set an inactive state.
     */
    toggle(forceActiveState) {
        if (!__classPrivateFieldGet(this, _Adorner_isToggle, "f")) {
            return;
        }
        const shouldBecomeActive = forceActiveState === undefined ? !this.isActive() : forceActiveState;
        this.setAttribute('aria-pressed', Boolean(shouldBecomeActive).toString());
        this.setAttribute('aria-label', (shouldBecomeActive ? __classPrivateFieldGet(this, _Adorner_ariaLabelActive, "f") : __classPrivateFieldGet(this, _Adorner_ariaLabelDefault, "f")) || this.name);
    }
    show() {
        this.classList.remove('hidden');
    }
    hide() {
        this.classList.add('hidden');
    }
    /**
     * Make adorner interactive by responding to click events with the provided action
     * and simulating ARIA-capable toggle button behavior.
     */
    addInteraction(action, options) {
        const { isToggle = false, shouldPropagateOnKeydown = false, ariaLabelDefault, ariaLabelActive } = options;
        __classPrivateFieldSet(this, _Adorner_isToggle, isToggle, "f");
        __classPrivateFieldSet(this, _Adorner_ariaLabelDefault, ariaLabelDefault, "f");
        __classPrivateFieldSet(this, _Adorner_ariaLabelActive, ariaLabelActive, "f");
        this.setAttribute('aria-label', ariaLabelDefault);
        if (__classPrivateFieldGet(this, _Adorner_jslogContext, "f")) {
            this.setAttribute('jslog', `${VisualElements.adorner(__classPrivateFieldGet(this, _Adorner_jslogContext, "f")).track({ click: true })}`);
        }
        if (isToggle) {
            this.addEventListener('click', () => {
                this.toggle();
            });
            this.toggle(false /* initialize inactive state */);
        }
        this.addEventListener('click', action);
        // Simulate an ARIA-capable toggle button
        this.classList.add('clickable');
        this.setAttribute('role', 'button');
        this.tabIndex = 0;
        this.addEventListener('keydown', event => {
            if (event.code === 'Enter' || event.code === 'Space') {
                this.click();
                if (!shouldPropagateOnKeydown) {
                    event.stopPropagation();
                }
            }
        });
    }
}
_Adorner_shadow = new WeakMap(), _Adorner_isToggle = new WeakMap(), _Adorner_ariaLabelDefault = new WeakMap(), _Adorner_ariaLabelActive = new WeakMap(), _Adorner_content = new WeakMap(), _Adorner_jslogContext = new WeakMap(), _Adorner_instances = new WeakSet(), _Adorner_render = function _Adorner_render() {
    render(html `<style>${adornerStyles}</style><slot></slot>`, __classPrivateFieldGet(this, _Adorner_shadow, "f"), { host: this });
};
customElements.define('devtools-adorner', Adorner);
//# sourceMappingURL=Adorner.js.map