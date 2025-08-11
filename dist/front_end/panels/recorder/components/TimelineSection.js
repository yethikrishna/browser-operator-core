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
var _TimelineSection_instances, _TimelineSection_isEndOfGroup, _TimelineSection_isStartOfGroup, _TimelineSection_isFirstSection, _TimelineSection_isLastSection, _TimelineSection_isSelected, _TimelineSection_shadowRoot, _TimelineSection_render;
import * as Lit from '../../../ui/lit/lit.js';
import timelineSectionStyles from './timelineSection.css.js';
const { html } = Lit;
export class TimelineSection extends HTMLElement {
    constructor() {
        super(...arguments);
        _TimelineSection_instances.add(this);
        _TimelineSection_isEndOfGroup.set(this, false);
        _TimelineSection_isStartOfGroup.set(this, false);
        _TimelineSection_isFirstSection.set(this, false);
        _TimelineSection_isLastSection.set(this, false);
        _TimelineSection_isSelected.set(this, false);
        _TimelineSection_shadowRoot.set(this, this.attachShadow({ mode: 'open' }));
    }
    set data(data) {
        __classPrivateFieldSet(this, _TimelineSection_isFirstSection, data.isFirstSection, "f");
        __classPrivateFieldSet(this, _TimelineSection_isLastSection, data.isLastSection, "f");
        __classPrivateFieldSet(this, _TimelineSection_isEndOfGroup, data.isEndOfGroup, "f");
        __classPrivateFieldSet(this, _TimelineSection_isStartOfGroup, data.isStartOfGroup, "f");
        __classPrivateFieldSet(this, _TimelineSection_isSelected, data.isSelected, "f");
        __classPrivateFieldGet(this, _TimelineSection_instances, "m", _TimelineSection_render).call(this);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _TimelineSection_instances, "m", _TimelineSection_render).call(this);
    }
}
_TimelineSection_isEndOfGroup = new WeakMap(), _TimelineSection_isStartOfGroup = new WeakMap(), _TimelineSection_isFirstSection = new WeakMap(), _TimelineSection_isLastSection = new WeakMap(), _TimelineSection_isSelected = new WeakMap(), _TimelineSection_shadowRoot = new WeakMap(), _TimelineSection_instances = new WeakSet(), _TimelineSection_render = function _TimelineSection_render() {
    const classes = {
        'timeline-section': true,
        'is-end-of-group': __classPrivateFieldGet(this, _TimelineSection_isEndOfGroup, "f"),
        'is-start-of-group': __classPrivateFieldGet(this, _TimelineSection_isStartOfGroup, "f"),
        'is-first-section': __classPrivateFieldGet(this, _TimelineSection_isFirstSection, "f"),
        'is-last-section': __classPrivateFieldGet(this, _TimelineSection_isLastSection, "f"),
        'is-selected': __classPrivateFieldGet(this, _TimelineSection_isSelected, "f"),
    };
    // clang-format off
    Lit.render(html `
      <style>${timelineSectionStyles}</style>
      <div class=${Lit.Directives.classMap(classes)}>
        <div class="icon"><slot name="icon"></slot></div>
        <svg width="24" height="100%" class="bar">
          <rect class="line" x="7" y="0" width="2" height="100%" />
        </svg>
        <slot></slot>
      </div>
    `, __classPrivateFieldGet(this, _TimelineSection_shadowRoot, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-timeline-section', TimelineSection);
//# sourceMappingURL=TimelineSection.js.map