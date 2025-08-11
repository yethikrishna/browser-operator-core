// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _InteractionBreakdown_instances, _InteractionBreakdown_shadow, _InteractionBreakdown_entry, _InteractionBreakdown_render;
import * as i18n from '../../../core/i18n/i18n.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../ui/lit/lit.js';
import interactionBreakdownStyles from './interactionBreakdown.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description Text shown next to the interaction event's input delay time in the detail view.
     */
    inputDelay: 'Input delay',
    /**
     *@description Text shown next to the interaction event's thread processing duration in the detail view.
     */
    processingDuration: 'Processing duration',
    /**
     *@description Text shown next to the interaction event's presentation delay time in the detail view.
     */
    presentationDelay: 'Presentation delay',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/InteractionBreakdown.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class InteractionBreakdown extends HTMLElement {
    constructor() {
        super(...arguments);
        _InteractionBreakdown_instances.add(this);
        _InteractionBreakdown_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _InteractionBreakdown_entry.set(this, null);
    }
    set entry(entry) {
        if (entry === __classPrivateFieldGet(this, _InteractionBreakdown_entry, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _InteractionBreakdown_entry, entry, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _InteractionBreakdown_instances, "m", _InteractionBreakdown_render));
    }
}
_InteractionBreakdown_shadow = new WeakMap(), _InteractionBreakdown_entry = new WeakMap(), _InteractionBreakdown_instances = new WeakSet(), _InteractionBreakdown_render = function _InteractionBreakdown_render() {
    if (!__classPrivateFieldGet(this, _InteractionBreakdown_entry, "f")) {
        return;
    }
    const inputDelay = i18n.TimeUtilities.formatMicroSecondsAsMillisFixed(__classPrivateFieldGet(this, _InteractionBreakdown_entry, "f").inputDelay);
    const mainThreadTime = i18n.TimeUtilities.formatMicroSecondsAsMillisFixed(__classPrivateFieldGet(this, _InteractionBreakdown_entry, "f").mainThreadHandling);
    const presentationDelay = i18n.TimeUtilities.formatMicroSecondsAsMillisFixed(__classPrivateFieldGet(this, _InteractionBreakdown_entry, "f").presentationDelay);
    Lit.render(html `<style>${interactionBreakdownStyles}</style>
             <ul class="breakdown">
                     <li data-entry="input-delay">${i18nString(UIStrings.inputDelay)}<span class="value">${inputDelay}</span></li>
                     <li data-entry="processing-duration">${i18nString(UIStrings.processingDuration)}<span class="value">${mainThreadTime}</span></li>
                     <li data-entry="presentation-delay">${i18nString(UIStrings.presentationDelay)}<span class="value">${presentationDelay}</span></li>
                   </ul>
                   `, __classPrivateFieldGet(this, _InteractionBreakdown_shadow, "f"), { host: this });
};
customElements.define('devtools-interaction-breakdown', InteractionBreakdown);
//# sourceMappingURL=InteractionBreakdown.js.map