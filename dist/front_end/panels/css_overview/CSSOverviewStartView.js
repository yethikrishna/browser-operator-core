// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _CSSOverviewStartView_view;
import '../../ui/components/panel_feedback/panel_feedback.js';
import '../../ui/components/panel_introduction_steps/panel_introduction_steps.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as UI from '../../ui/legacy/legacy.js';
import { html, render } from '../../ui/lit/lit.js';
import cssOverviewStartViewStyles from './cssOverviewStartView.css.js';
const UIStrings = {
    /**
     *@description Label for the capture button in the CSS overview panel
     */
    captureOverview: 'Capture overview',
    /**
     *@description Header for the summary of CSS overview
     */
    identifyCSSImprovements: 'Identify potential CSS improvements',
    /**
     *@description First point of the summarized features of CSS overview
     */
    capturePageCSSOverview: 'Capture an overview of your page’s CSS',
    /**
     *@description Second point of the summarized features of CSS overview
     */
    identifyCSSImprovementsWithExampleIssues: 'Identify potential CSS improvements (e.g. low contrast issues, unused declarations, color or font mismatches)',
    /**
     *@description Third point of the summarized features of CSS overview
     */
    locateAffectedElements: 'Locate the affected elements in the Elements panel',
    /**
     *@description Title of the link to the quick start video and documentation to CSS overview panel
     */
    quickStartWithCSSOverview: 'Quick start: get started with the new CSS overview panel',
};
const str_ = i18n.i18n.registerUIStrings('panels/css_overview/CSSOverviewStartView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const FEEDBACK_LINK = 'https://g.co/devtools/css-overview-feedback';
const DOC_LINK = 'https://developer.chrome.com/docs/devtools/css-overview';
const DEFAULT_VIEW = (input, output, target) => {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
    <style>${cssOverviewStartViewStyles}</style>
    <div class="css-overview-start-view">
      <devtools-panel-introduction-steps>
        <span slot="title">${i18nString(UIStrings.identifyCSSImprovements)}</span>
        <span slot="step-1">${i18nString(UIStrings.capturePageCSSOverview)}</span>
        <span slot="step-2">${i18nString(UIStrings.identifyCSSImprovementsWithExampleIssues)}</span>
        <span slot="step-3">${i18nString(UIStrings.locateAffectedElements)}</span>
      </devtools-panel-introduction-steps>
      <div class="start-capture-wrapper">
        <devtools-button
          class="start-capture"
          autofocus
          .variant=${"primary" /* Buttons.Button.Variant.PRIMARY */}
          .jslogContext=${'css-overview.capture-overview'}
          @click=${input.onStartCapture}>
          ${i18nString(UIStrings.captureOverview)}
        </devtools-button>
      </div>
      <devtools-panel-feedback .data=${{
        feedbackUrl: FEEDBACK_LINK,
        quickStartUrl: DOC_LINK,
        quickStartLinkText: i18nString(UIStrings.quickStartWithCSSOverview),
    }}>
      </devtools-panel-feedback>
      <devtools-feedback-button .data=${{
        feedbackUrl: FEEDBACK_LINK,
    }}>
      </devtools-feedback-button>
    </div>`, target, { host: input });
    // clang-format on
};
export class CSSOverviewStartView extends UI.Widget.Widget {
    constructor(element, view = DEFAULT_VIEW) {
        super(true, true, element);
        _CSSOverviewStartView_view.set(this, void 0);
        this.onStartCapture = () => { };
        __classPrivateFieldSet(this, _CSSOverviewStartView_view, view, "f");
        this.performUpdate();
    }
    performUpdate() {
        __classPrivateFieldGet(this, _CSSOverviewStartView_view, "f").call(this, { onStartCapture: this.onStartCapture }, {}, this.contentElement);
    }
}
_CSSOverviewStartView_view = new WeakMap();
//# sourceMappingURL=CSSOverviewStartView.js.map