// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _PanelFeedback_instances, _PanelFeedback_shadow, _PanelFeedback_props, _PanelFeedback_render;
import '../../legacy/legacy.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as ComponentHelpers from '../../components/helpers/helpers.js';
import { html, render } from '../../lit/lit.js';
import * as VisualLogging from '../../visual_logging/visual_logging.js';
import panelFeedbackStyles from './panelFeedback.css.js';
const UIStrings = {
    /**
     *@description Introduction sentence to convey the feature is being actively worked on and we are looking for feedback.
     */
    previewText: 'Our team is actively working on this feature and we would love to know what you think.',
    /**
     *@description Link text the user can click to provide feedback to the team.
     */
    previewTextFeedbackLink: 'Send us your feedback.',
    /**
     *@description Title of the UI section that shows the user that this feature is in preview. Used as the main heading. Not a verb.
     */
    previewFeature: 'Preview feature',
    /**
     *@description Title of the section to the quick start video and documentation on experimental panels.
     */
    videoAndDocumentation: 'Video and documentation',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/panel_feedback/PanelFeedback.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const previewFeatureUrl = new URL('../../../Images/experiment.svg', import.meta.url).toString();
const videoThumbnailUrl = new URL('../../../Images/preview_feature_video_thumbnail.svg', import.meta.url).toString();
export class PanelFeedback extends HTMLElement {
    constructor() {
        super(...arguments);
        _PanelFeedback_instances.add(this);
        _PanelFeedback_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _PanelFeedback_props.set(this, {
            feedbackUrl: Platform.DevToolsPath.EmptyUrlString,
            quickStartUrl: Platform.DevToolsPath.EmptyUrlString,
            quickStartLinkText: '',
        });
    }
    set data(data) {
        __classPrivateFieldSet(this, _PanelFeedback_props, data, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _PanelFeedback_instances, "m", _PanelFeedback_render));
    }
}
_PanelFeedback_shadow = new WeakMap(), _PanelFeedback_props = new WeakMap(), _PanelFeedback_instances = new WeakSet(), _PanelFeedback_render = function _PanelFeedback_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('PanelFeedback render was not scheduled');
    }
    // clang-format off
    render(html `
      <style>${panelFeedbackStyles}</style>
      <div class="preview">
        <h2 class="flex">
          <devtools-icon .data=${{
        iconPath: previewFeatureUrl,
        width: '20px',
        height: '20px',
        color: 'var(--icon-primary)',
    }}></devtools-icon> ${i18nString(UIStrings.previewFeature)}
        </h2>
        <p>${i18nString(UIStrings.previewText)} <x-link href=${__classPrivateFieldGet(this, _PanelFeedback_props, "f").feedbackUrl} jslog=${VisualLogging.link('feedback').track({ click: true })}>${i18nString(UIStrings.previewTextFeedbackLink)}</x-link></p>
        <div class="video">
          <div class="thumbnail">
            <img src=${videoThumbnailUrl} role="presentation" />
          </div>
          <div class="video-description">
            <h3>${i18nString(UIStrings.videoAndDocumentation)}</h3>
            <x-link class="quick-start-link" href=${__classPrivateFieldGet(this, _PanelFeedback_props, "f").quickStartUrl} jslog=${VisualLogging.link('css-overview.quick-start').track({ click: true })}>${__classPrivateFieldGet(this, _PanelFeedback_props, "f").quickStartLinkText}</x-link>
          </div>
        </div>
      </div>
      `, __classPrivateFieldGet(this, _PanelFeedback_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-panel-feedback', PanelFeedback);
//# sourceMappingURL=PanelFeedback.js.map