// Copyright (c) 2020 The Chromium Authors. All rights reserved.
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
var _SurveyLink_instances, _SurveyLink_shadow, _SurveyLink_trigger, _SurveyLink_promptText, _SurveyLink_canShowSurvey, _SurveyLink_showSurvey, _SurveyLink_state, _SurveyLink_checkSurvey, _SurveyLink_sendSurvey, _SurveyLink_render;
import '../icon_button/icon_button.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import { html, render } from '../../lit/lit.js';
import surveyLinkStyles from './surveyLink.css.js';
const UIStrings = {
    /**
     *@description Text shown when the link to open a survey is clicked but the survey has not yet appeared
     */
    openingSurvey: 'Opening survey …',
    /**
     *@description Text displayed instead of the survey link after the survey link is clicked, if the survey was shown successfully
     */
    thankYouForYourFeedback: 'Thank you for your feedback',
    /**
     *@description Text displayed instead of the survey link after the survey link is clicked, if the survey was not shown successfully
     */
    anErrorOccurredWithTheSurvey: 'An error occurred with the survey',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/survey_link/SurveyLink.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
var State;
(function (State) {
    State["CHECKING"] = "Checking";
    State["SHOW_LINK"] = "ShowLink";
    State["SENDING"] = "Sending";
    State["SURVEY_SHOWN"] = "SurveyShown";
    State["FAILED"] = "Failed";
    State["DONT_SHOW_LINK"] = "DontShowLink";
})(State || (State = {}));
// A link to a survey. The link is rendered aysnchronously because we need to first check if
// canShowSurvey succeeds.
export class SurveyLink extends HTMLElement {
    constructor() {
        super(...arguments);
        _SurveyLink_instances.add(this);
        _SurveyLink_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _SurveyLink_trigger.set(this, '');
        _SurveyLink_promptText.set(this, Common.UIString.LocalizedEmptyString);
        _SurveyLink_canShowSurvey.set(this, () => { });
        _SurveyLink_showSurvey.set(this, () => { });
        _SurveyLink_state.set(this, "Checking" /* State.CHECKING */);
    }
    // Re-setting data will cause the state to go back to 'Checking' which hides the link.
    set data(data) {
        __classPrivateFieldSet(this, _SurveyLink_trigger, data.trigger, "f");
        __classPrivateFieldSet(this, _SurveyLink_promptText, data.promptText, "f");
        __classPrivateFieldSet(this, _SurveyLink_canShowSurvey, data.canShowSurvey, "f");
        __classPrivateFieldSet(this, _SurveyLink_showSurvey, data.showSurvey, "f");
        __classPrivateFieldGet(this, _SurveyLink_instances, "m", _SurveyLink_checkSurvey).call(this);
    }
}
_SurveyLink_shadow = new WeakMap(), _SurveyLink_trigger = new WeakMap(), _SurveyLink_promptText = new WeakMap(), _SurveyLink_canShowSurvey = new WeakMap(), _SurveyLink_showSurvey = new WeakMap(), _SurveyLink_state = new WeakMap(), _SurveyLink_instances = new WeakSet(), _SurveyLink_checkSurvey = function _SurveyLink_checkSurvey() {
    __classPrivateFieldSet(this, _SurveyLink_state, "Checking" /* State.CHECKING */, "f");
    __classPrivateFieldGet(this, _SurveyLink_canShowSurvey, "f").call(this, __classPrivateFieldGet(this, _SurveyLink_trigger, "f"), ({ canShowSurvey }) => {
        if (!canShowSurvey) {
            __classPrivateFieldSet(this, _SurveyLink_state, "DontShowLink" /* State.DONT_SHOW_LINK */, "f");
        }
        else {
            __classPrivateFieldSet(this, _SurveyLink_state, "ShowLink" /* State.SHOW_LINK */, "f");
        }
        __classPrivateFieldGet(this, _SurveyLink_instances, "m", _SurveyLink_render).call(this);
    });
}, _SurveyLink_sendSurvey = function _SurveyLink_sendSurvey() {
    __classPrivateFieldSet(this, _SurveyLink_state, "Sending" /* State.SENDING */, "f");
    __classPrivateFieldGet(this, _SurveyLink_instances, "m", _SurveyLink_render).call(this);
    __classPrivateFieldGet(this, _SurveyLink_showSurvey, "f").call(this, __classPrivateFieldGet(this, _SurveyLink_trigger, "f"), ({ surveyShown }) => {
        if (!surveyShown) {
            __classPrivateFieldSet(this, _SurveyLink_state, "Failed" /* State.FAILED */, "f");
        }
        else {
            __classPrivateFieldSet(this, _SurveyLink_state, "SurveyShown" /* State.SURVEY_SHOWN */, "f");
        }
        __classPrivateFieldGet(this, _SurveyLink_instances, "m", _SurveyLink_render).call(this);
    });
}, _SurveyLink_render = function _SurveyLink_render() {
    if (__classPrivateFieldGet(this, _SurveyLink_state, "f") === "Checking" /* State.CHECKING */ || __classPrivateFieldGet(this, _SurveyLink_state, "f") === "DontShowLink" /* State.DONT_SHOW_LINK */) {
        return;
    }
    let linkText = __classPrivateFieldGet(this, _SurveyLink_promptText, "f");
    if (__classPrivateFieldGet(this, _SurveyLink_state, "f") === "Sending" /* State.SENDING */) {
        linkText = i18nString(UIStrings.openingSurvey);
    }
    else if (__classPrivateFieldGet(this, _SurveyLink_state, "f") === "SurveyShown" /* State.SURVEY_SHOWN */) {
        linkText = i18nString(UIStrings.thankYouForYourFeedback);
    }
    else if (__classPrivateFieldGet(this, _SurveyLink_state, "f") === "Failed" /* State.FAILED */) {
        linkText = i18nString(UIStrings.anErrorOccurredWithTheSurvey);
    }
    let linkState = '';
    if (__classPrivateFieldGet(this, _SurveyLink_state, "f") === "Sending" /* State.SENDING */) {
        linkState = 'pending-link';
    }
    else if (__classPrivateFieldGet(this, _SurveyLink_state, "f") === "Failed" /* State.FAILED */ || __classPrivateFieldGet(this, _SurveyLink_state, "f") === "SurveyShown" /* State.SURVEY_SHOWN */) {
        linkState = 'disabled-link';
    }
    const ariaDisabled = __classPrivateFieldGet(this, _SurveyLink_state, "f") !== "ShowLink" /* State.SHOW_LINK */;
    // clang-format off
    const output = html `
      <style>${surveyLinkStyles}</style>
      <button
          class="link ${linkState}" tabindex=${ariaDisabled ? '-1' : '0'}
          .disabled=${ariaDisabled} aria-disabled=${ariaDisabled} @click=${__classPrivateFieldGet(this, _SurveyLink_instances, "m", _SurveyLink_sendSurvey)}>
        <devtools-icon class="link-icon" .data=${{
        iconName: 'review',
        color: 'var(--sys-color-primary)',
        width: 'var(--issue-link-icon-size, 16px)',
        height: 'var(--issue-link-icon-size, 16px)'
    }}>
        </devtools-icon>
        ${linkText}
      </button>`;
    // clang-format on
    render(output, __classPrivateFieldGet(this, _SurveyLink_shadow, "f"), { host: this });
};
customElements.define('devtools-survey-link', SurveyLink);
//# sourceMappingURL=SurveyLink.js.map