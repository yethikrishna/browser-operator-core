// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PanelIntroductionSteps_instances, _PanelIntroductionSteps_shadow, _PanelIntroductionSteps_render;
import * as ComponentHelpers from '../../components/helpers/helpers.js';
import { html, render } from '../../lit/lit.js';
import panelIntroductionStepsStyles from './panelIntroductionSteps.css.js';
export class PanelIntroductionSteps extends HTMLElement {
    constructor() {
        super(...arguments);
        _PanelIntroductionSteps_instances.add(this);
        _PanelIntroductionSteps_shadow.set(this, this.attachShadow({ mode: 'open' }));
    }
    connectedCallback() {
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _PanelIntroductionSteps_instances, "m", _PanelIntroductionSteps_render));
    }
}
_PanelIntroductionSteps_shadow = new WeakMap(), _PanelIntroductionSteps_instances = new WeakSet(), _PanelIntroductionSteps_render = function _PanelIntroductionSteps_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('FeedbackButton render was not scheduled');
    }
    // clang-format off
    render(html `
      <style>${panelIntroductionStepsStyles}</style>
      <h1><slot name="title">slot: title</slot></h1>

      <ol class="intro-steps">
        <li><slot name="step-1">slot: step-1</slot></li>
        <li><slot name="step-2">slot: step-2</slot></li>
        <li><slot name="step-3">slot: step-3</slot></li>
      </ol>
    `, __classPrivateFieldGet(this, _PanelIntroductionSteps_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-panel-introduction-steps', PanelIntroductionSteps);
//# sourceMappingURL=PanelIntroductionSteps.js.map