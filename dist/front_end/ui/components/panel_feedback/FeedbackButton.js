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
var _FeedbackButton_instances, _FeedbackButton_shadow, _FeedbackButton_props, _FeedbackButton_onFeedbackClick, _FeedbackButton_render;
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as ComponentHelpers from '../../components/helpers/helpers.js';
import { html, render } from '../../lit/lit.js';
import * as Buttons from '../buttons/buttons.js';
const UIStrings = {
    /**
     * @description The title of the button that leads to the feedback form.
     */
    feedback: 'Feedback',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/panel_feedback/FeedbackButton.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class FeedbackButton extends HTMLElement {
    constructor() {
        super(...arguments);
        _FeedbackButton_instances.add(this);
        _FeedbackButton_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _FeedbackButton_props.set(this, {
            feedbackUrl: Platform.DevToolsPath.EmptyUrlString,
        });
    }
    set data(data) {
        __classPrivateFieldSet(this, _FeedbackButton_props, data, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _FeedbackButton_instances, "m", _FeedbackButton_render));
    }
}
_FeedbackButton_shadow = new WeakMap(), _FeedbackButton_props = new WeakMap(), _FeedbackButton_instances = new WeakSet(), _FeedbackButton_onFeedbackClick = function _FeedbackButton_onFeedbackClick() {
    Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(__classPrivateFieldGet(this, _FeedbackButton_props, "f").feedbackUrl);
}, _FeedbackButton_render = function _FeedbackButton_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('FeedbackButton render was not scheduled');
    }
    // clang-format off
    render(html `
      <devtools-button
          @click=${__classPrivateFieldGet(this, _FeedbackButton_instances, "m", _FeedbackButton_onFeedbackClick)}
          .iconName=${'review'}
          .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}
          .jslogContext=${'feedback'}
      >${i18nString(UIStrings.feedback)}</devtools-button>
      `, __classPrivateFieldGet(this, _FeedbackButton_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-feedback-button', FeedbackButton);
//# sourceMappingURL=FeedbackButton.js.map