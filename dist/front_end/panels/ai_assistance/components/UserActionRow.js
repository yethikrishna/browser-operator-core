// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _UserActionRow_instances, _UserActionRow_suggestionsResizeObserver, _UserActionRow_suggestionsEvaluateLayoutThrottler, _UserActionRow_feedbackValue, _UserActionRow_currentRating, _UserActionRow_isShowingFeedbackForm, _UserActionRow_isSubmitButtonDisabled, _UserActionRow_view, _UserActionRow_viewOutput, _UserActionRow_handleInputChange, _UserActionRow_evaluateSuggestionsLayout, _UserActionRow_handleSuggestionsScrollOrResize, _UserActionRow_scrollSuggestionsScrollContainer, _UserActionRow_handleRateClick, _UserActionRow_handleClose, _UserActionRow_handleSubmit;
import * as Common from '../../../core/common/common.js';
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as Input from '../../../ui/components/input/input.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import userActionRowStyles from './userActionRow.css.js';
const { html, Directives: { ref } } = Lit;
/*
* Strings that don't need to be translated at this time.
*/
const UIStringsNotTranslate = {
    /**
     * @description The title of the button that allows submitting positive
     * feedback about the response for AI assistance.
     */
    thumbsUp: 'Good response',
    /**
     * @description The title of the button that allows submitting negative
     * feedback about the response for AI assistance.
     */
    thumbsDown: 'Bad response',
    /**
     * @description The placeholder text for the feedback input.
     */
    provideFeedbackPlaceholder: 'Provide additional feedback',
    /**
     * @description The disclaimer text that tells the user what will be shared
     * and what will be stored.
     */
    disclaimer: 'Submitted feedback will also include your conversation',
    /**
     * @description The button text for the action of submitting feedback.
     */
    submit: 'Submit',
    /**
     * @description The header of the feedback form asking.
     */
    whyThisRating: 'Why did you choose this rating? (optional)',
    /**
     * @description The button text for the action that hides the feedback form.
     */
    close: 'Close',
    /**
     * @description The title of the button that opens a page to report a legal
     * issue with the AI assistance message.
     */
    report: 'Report legal issue',
    /**
     * @description The title of the button for scrolling to see next suggestions
     */
    scrollToNext: 'Scroll to next suggestions',
    /**
     * @description The title of the button for scrolling to see previous suggestions
     */
    scrollToPrevious: 'Scroll to previous suggestions',
};
const lockedString = i18n.i18n.lockedString;
const REPORT_URL = 'https://support.google.com/legal/troubleshooter/1114905?hl=en#ts=1115658%2C13380504';
const SCROLL_ROUNDING_OFFSET = 1;
export const DEFAULT_VIEW = (input, output, target) => {
    // clang-format off
    Lit.render(html `
    <style>${Input.textInputStyles}</style>
    <style>${userActionRowStyles}</style>
    <div class="ai-assistance-feedback-row">
      <div class="rate-buttons">
        ${input.showRateButtons ? html `
          <devtools-button
            .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        iconName: 'thumb-up',
        toggledIconName: 'thumb-up-filled',
        toggled: input.currentRating === "POSITIVE" /* Host.AidaClient.Rating.POSITIVE */,
        toggleType: "primary-toggle" /* Buttons.Button.ToggleType.PRIMARY */,
        title: lockedString(UIStringsNotTranslate.thumbsUp),
        jslogContext: 'thumbs-up',
    }}
            @click=${() => input.onRatingClick("POSITIVE" /* Host.AidaClient.Rating.POSITIVE */)}
          ></devtools-button>
          <devtools-button
            .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        iconName: 'thumb-down',
        toggledIconName: 'thumb-down-filled',
        toggled: input.currentRating === "NEGATIVE" /* Host.AidaClient.Rating.NEGATIVE */,
        toggleType: "primary-toggle" /* Buttons.Button.ToggleType.PRIMARY */,
        title: lockedString(UIStringsNotTranslate.thumbsDown),
        jslogContext: 'thumbs-down',
    }}
            @click=${() => input.onRatingClick("NEGATIVE" /* Host.AidaClient.Rating.NEGATIVE */)}
          ></devtools-button>
          <div class="vertical-separator"></div>
        ` : Lit.nothing}
        <devtools-button
          .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        title: lockedString(UIStringsNotTranslate.report),
        iconName: 'report',
        jslogContext: 'report',
    }}
          @click=${input.onReportClick}
        ></devtools-button>
      </div>
      ${input.suggestions ? html `<div class="suggestions-container">
        <div class="scroll-button-container left hidden" ${ref(element => { output.suggestionsLeftScrollButtonContainer = element; })}>
          <devtools-button
            class='scroll-button'
            .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        iconName: 'chevron-left',
        title: lockedString(UIStringsNotTranslate.scrollToPrevious),
        jslogContext: 'chevron-left',
    }}
            @click=${() => input.scrollSuggestionsScrollContainer('left')}
          ></devtools-button>
        </div>
        <div class="suggestions-scroll-container" @scroll=${input.onSuggestionsScrollOrResize} ${ref(element => { output.suggestionsScrollContainer = element; })}>
          ${input.suggestions.map(suggestion => html `<devtools-button
            class='suggestion'
            .data=${{
        variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
        title: suggestion,
        jslogContext: 'suggestion',
    }}
            @click=${() => input.onSuggestionClick(suggestion)}
          >${suggestion}</devtools-button>`)}
        </div>
        <div class="scroll-button-container right hidden" ${ref(element => { output.suggestionsRightScrollButtonContainer = element; })}>
          <devtools-button
            class='scroll-button'
            .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        iconName: 'chevron-right',
        title: lockedString(UIStringsNotTranslate.scrollToNext),
        jslogContext: 'chevron-right',
    }}
            @click=${() => input.scrollSuggestionsScrollContainer('right')}
          ></devtools-button>
        </div>
      </div>` : Lit.nothing}
    </div>
    ${input.isShowingFeedbackForm ? html `
      <form class="feedback-form" @submit=${input.onSubmit}>
        <div class="feedback-header">
          <h4 class="feedback-title">${lockedString(UIStringsNotTranslate.whyThisRating)}</h4>
          <devtools-button
            aria-label=${lockedString(UIStringsNotTranslate.close)}
            @click=${input.onClose}
            .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        iconName: 'cross',
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        title: lockedString(UIStringsNotTranslate.close),
        jslogContext: 'close',
    }}
          ></devtools-button>
        </div>
        <input
          type="text"
          class="devtools-text-input feedback-input"
          @input=${(event) => input.onInputChange(event.target.value)}
          placeholder=${lockedString(UIStringsNotTranslate.provideFeedbackPlaceholder)}
          jslog=${VisualLogging.textField('feedback').track({ keydown: 'Enter' })}
        >
        <span class="feedback-disclaimer">${lockedString(UIStringsNotTranslate.disclaimer)}</span>
        <div>
          <devtools-button
          aria-label=${lockedString(UIStringsNotTranslate.submit)}
          .data=${{
        type: 'submit',
        disabled: input.isSubmitButtonDisabled,
        variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        title: lockedString(UIStringsNotTranslate.submit),
        jslogContext: 'send',
    }}
          >${lockedString(UIStringsNotTranslate.submit)}</devtools-button>
        </div>
      </div>
    </form>
    ` : Lit.nothing}
  `, target, { host: target });
    // clang-format on
};
/**
 * This presenter has too many responsibilities (rating buttons, feedback
 * form, suggestions).
 */
export class UserActionRow extends UI.Widget.Widget {
    constructor(element, view) {
        super(false, false, element);
        _UserActionRow_instances.add(this);
        this.showRateButtons = false;
        this.onFeedbackSubmit = () => { };
        this.onSuggestionClick = () => { };
        this.canShowFeedbackForm = false;
        _UserActionRow_suggestionsResizeObserver.set(this, new ResizeObserver(() => __classPrivateFieldGet(this, _UserActionRow_instances, "m", _UserActionRow_handleSuggestionsScrollOrResize).call(this)));
        _UserActionRow_suggestionsEvaluateLayoutThrottler.set(this, new Common.Throttler.Throttler(50));
        _UserActionRow_feedbackValue.set(this, '');
        _UserActionRow_currentRating.set(this, void 0);
        _UserActionRow_isShowingFeedbackForm.set(this, false);
        _UserActionRow_isSubmitButtonDisabled.set(this, true);
        _UserActionRow_view.set(this, void 0);
        _UserActionRow_viewOutput.set(this, {});
        _UserActionRow_evaluateSuggestionsLayout.set(this, () => {
            const suggestionsScrollContainer = __classPrivateFieldGet(this, _UserActionRow_viewOutput, "f").suggestionsScrollContainer;
            const leftScrollButtonContainer = __classPrivateFieldGet(this, _UserActionRow_viewOutput, "f").suggestionsLeftScrollButtonContainer;
            const rightScrollButtonContainer = __classPrivateFieldGet(this, _UserActionRow_viewOutput, "f").suggestionsRightScrollButtonContainer;
            if (!suggestionsScrollContainer || !leftScrollButtonContainer || !rightScrollButtonContainer) {
                return;
            }
            const shouldShowLeftButton = suggestionsScrollContainer.scrollLeft > SCROLL_ROUNDING_OFFSET;
            const shouldShowRightButton = suggestionsScrollContainer.scrollLeft +
                suggestionsScrollContainer.offsetWidth + SCROLL_ROUNDING_OFFSET <
                suggestionsScrollContainer.scrollWidth;
            leftScrollButtonContainer.classList.toggle('hidden', !shouldShowLeftButton);
            rightScrollButtonContainer.classList.toggle('hidden', !shouldShowRightButton);
        });
        __classPrivateFieldSet(this, _UserActionRow_view, view ?? DEFAULT_VIEW, "f");
    }
    wasShown() {
        super.wasShown();
        void this.performUpdate();
        __classPrivateFieldGet(this, _UserActionRow_evaluateSuggestionsLayout, "f").call(this);
        if (__classPrivateFieldGet(this, _UserActionRow_viewOutput, "f").suggestionsScrollContainer) {
            __classPrivateFieldGet(this, _UserActionRow_suggestionsResizeObserver, "f").observe(__classPrivateFieldGet(this, _UserActionRow_viewOutput, "f").suggestionsScrollContainer);
        }
    }
    performUpdate() {
        __classPrivateFieldGet(this, _UserActionRow_view, "f").call(this, {
            onSuggestionClick: this.onSuggestionClick,
            onRatingClick: __classPrivateFieldGet(this, _UserActionRow_instances, "m", _UserActionRow_handleRateClick).bind(this),
            onReportClick: () => UI.UIUtils.openInNewTab(REPORT_URL),
            scrollSuggestionsScrollContainer: __classPrivateFieldGet(this, _UserActionRow_instances, "m", _UserActionRow_scrollSuggestionsScrollContainer).bind(this),
            onSuggestionsScrollOrResize: __classPrivateFieldGet(this, _UserActionRow_instances, "m", _UserActionRow_handleSuggestionsScrollOrResize).bind(this),
            onSubmit: __classPrivateFieldGet(this, _UserActionRow_instances, "m", _UserActionRow_handleSubmit).bind(this),
            onClose: __classPrivateFieldGet(this, _UserActionRow_instances, "m", _UserActionRow_handleClose).bind(this),
            onInputChange: __classPrivateFieldGet(this, _UserActionRow_instances, "m", _UserActionRow_handleInputChange).bind(this),
            isSubmitButtonDisabled: __classPrivateFieldGet(this, _UserActionRow_isSubmitButtonDisabled, "f"),
            showRateButtons: this.showRateButtons,
            suggestions: this.suggestions,
            currentRating: __classPrivateFieldGet(this, _UserActionRow_currentRating, "f"),
            isShowingFeedbackForm: __classPrivateFieldGet(this, _UserActionRow_isShowingFeedbackForm, "f"),
        }, __classPrivateFieldGet(this, _UserActionRow_viewOutput, "f"), this.contentElement);
    }
    willHide() {
        __classPrivateFieldGet(this, _UserActionRow_suggestionsResizeObserver, "f").disconnect();
    }
}
_UserActionRow_suggestionsResizeObserver = new WeakMap(), _UserActionRow_suggestionsEvaluateLayoutThrottler = new WeakMap(), _UserActionRow_feedbackValue = new WeakMap(), _UserActionRow_currentRating = new WeakMap(), _UserActionRow_isShowingFeedbackForm = new WeakMap(), _UserActionRow_isSubmitButtonDisabled = new WeakMap(), _UserActionRow_view = new WeakMap(), _UserActionRow_viewOutput = new WeakMap(), _UserActionRow_evaluateSuggestionsLayout = new WeakMap(), _UserActionRow_instances = new WeakSet(), _UserActionRow_handleInputChange = function _UserActionRow_handleInputChange(value) {
    __classPrivateFieldSet(this, _UserActionRow_feedbackValue, value, "f");
    const disableSubmit = !value;
    if (disableSubmit !== __classPrivateFieldGet(this, _UserActionRow_isSubmitButtonDisabled, "f")) {
        __classPrivateFieldSet(this, _UserActionRow_isSubmitButtonDisabled, disableSubmit, "f");
        void this.performUpdate();
    }
}, _UserActionRow_handleSuggestionsScrollOrResize = function _UserActionRow_handleSuggestionsScrollOrResize() {
    void __classPrivateFieldGet(this, _UserActionRow_suggestionsEvaluateLayoutThrottler, "f").schedule(() => {
        __classPrivateFieldGet(this, _UserActionRow_evaluateSuggestionsLayout, "f").call(this);
        return Promise.resolve();
    });
}, _UserActionRow_scrollSuggestionsScrollContainer = function _UserActionRow_scrollSuggestionsScrollContainer(direction) {
    const suggestionsScrollContainer = __classPrivateFieldGet(this, _UserActionRow_viewOutput, "f").suggestionsScrollContainer;
    if (!suggestionsScrollContainer) {
        return;
    }
    suggestionsScrollContainer.scroll({
        top: 0,
        left: direction === 'left' ? suggestionsScrollContainer.scrollLeft - suggestionsScrollContainer.clientWidth :
            suggestionsScrollContainer.scrollLeft + suggestionsScrollContainer.clientWidth,
        behavior: 'smooth',
    });
}, _UserActionRow_handleRateClick = function _UserActionRow_handleRateClick(rating) {
    if (__classPrivateFieldGet(this, _UserActionRow_currentRating, "f") === rating) {
        __classPrivateFieldSet(this, _UserActionRow_currentRating, undefined, "f");
        __classPrivateFieldSet(this, _UserActionRow_isShowingFeedbackForm, false, "f");
        __classPrivateFieldSet(this, _UserActionRow_isSubmitButtonDisabled, true, "f");
        // This effectively reset the user rating
        this.onFeedbackSubmit("SENTIMENT_UNSPECIFIED" /* Host.AidaClient.Rating.SENTIMENT_UNSPECIFIED */);
        void this.performUpdate();
        return;
    }
    __classPrivateFieldSet(this, _UserActionRow_currentRating, rating, "f");
    __classPrivateFieldSet(this, _UserActionRow_isShowingFeedbackForm, this.canShowFeedbackForm, "f");
    this.onFeedbackSubmit(rating);
    void this.performUpdate();
}, _UserActionRow_handleClose = function _UserActionRow_handleClose() {
    __classPrivateFieldSet(this, _UserActionRow_isShowingFeedbackForm, false, "f");
    __classPrivateFieldSet(this, _UserActionRow_isSubmitButtonDisabled, true, "f");
    void this.performUpdate();
}, _UserActionRow_handleSubmit = function _UserActionRow_handleSubmit(ev) {
    ev.preventDefault();
    const input = __classPrivateFieldGet(this, _UserActionRow_feedbackValue, "f");
    if (!__classPrivateFieldGet(this, _UserActionRow_currentRating, "f") || !input) {
        return;
    }
    this.onFeedbackSubmit(__classPrivateFieldGet(this, _UserActionRow_currentRating, "f"), input);
    __classPrivateFieldSet(this, _UserActionRow_isShowingFeedbackForm, false, "f");
    __classPrivateFieldSet(this, _UserActionRow_isSubmitButtonDisabled, true, "f");
    void this.performUpdate();
};
//# sourceMappingURL=UserActionRow.js.map