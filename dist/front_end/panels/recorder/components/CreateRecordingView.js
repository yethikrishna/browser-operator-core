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
var _CreateRecordingView_instances, _CreateRecordingView_shadow, _CreateRecordingView_defaultRecordingName, _CreateRecordingView_error, _CreateRecordingView_recorderSettings, _CreateRecordingView_onKeyDown, _CreateRecordingView_dispatchRecordingCancelled, _CreateRecordingView_onInputFocus, _CreateRecordingView_render;
import '../../../ui/legacy/legacy.js';
import '../../../ui/components/icon_button/icon_button.js';
import './ControlButton.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as Input from '../../../ui/components/input/input.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Models from '../models/models.js';
import createRecordingViewStyles from './createRecordingView.css.js';
const { html, Directives: { ifDefined } } = Lit;
const UIStrings = {
    /**
     * @description The label for the input where the user enters a name for the new recording.
     */
    recordingName: 'Recording name',
    /**
     * @description The button that start the recording with selected options.
     */
    startRecording: 'Start recording',
    /**
     * @description The title of the page that contains the form for creating a new recording.
     */
    createRecording: 'Create a new recording',
    /**
     * @description The error message that is shown if the user tries to create a recording without a name.
     */
    recordingNameIsRequired: 'Recording name is required',
    /**
     * @description The label for the input where the user enters an attribute to be used for selector generation.
     */
    selectorAttribute: 'Selector attribute',
    /**
     * @description The title for the close button where the user cancels a recording and returns back to previous view.
     */
    cancelRecording: 'Cancel recording',
    /**
     * @description Label indicating a CSS (Cascading Style Sheets) selector type
     * (https://developer.mozilla.org/en-US/docs/Web/CSS). The label is used on a
     * checkbox which users can tick if they are interesting in recording CSS
     * selectors.
     */
    selectorTypeCSS: 'CSS',
    /**
     * @description Label indicating a piercing CSS (Cascading Style Sheets)
     * selector type
     * (https://pptr.dev/guides/query-selectors#pierce-selectors-pierce). These
     * type of selectors behave like CSS selectors, but can pierce through
     * ShadowDOM. The label is used on a checkbox which users can tick if they are
     * interesting in recording CSS selectors.
     */
    selectorTypePierce: 'Pierce',
    /**
     * @description Label indicating a ARIA (Accessible Rich Internet
     * Applications) selector type
     * (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA). The
     * label is used on a checkbox which users can tick if they are interesting in
     * recording ARIA selectors.
     */
    selectorTypeARIA: 'ARIA',
    /**
     * @description Label indicating a text selector type. The label is used on a
     * checkbox which users can tick if they are interesting in recording text
     * selectors.
     */
    selectorTypeText: 'Text',
    /**
     * @description Label indicating a XPath (XML Path Language) selector type
     * (https://en.wikipedia.org/wiki/XPath). The label is used on a checkbox
     * which users can tick if they are interesting in recording text selectors.
     */
    selectorTypeXPath: 'XPath',
    /**
     * @description The label for the input that allows specifying selector types
     * that should be used during the recordering.
     */
    selectorTypes: 'Selector types to record',
    /**
     * @description The error message that shows up if the user turns off
     * necessary selectors.
     */
    includeNecessarySelectors: 'You must choose CSS, Pierce, or XPath as one of your options. Only these selectors are guaranteed to be recorded since ARIA and text selectors may not be unique.',
    /**
     * @description Title of a link to the developer documentation.
     */
    learnMore: 'Learn more',
};
const str_ = i18n.i18n.registerUIStrings('panels/recorder/components/CreateRecordingView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class RecordingStartedEvent extends Event {
    constructor(name, selectorTypesToRecord, selectorAttribute) {
        super(RecordingStartedEvent.eventName, {});
        this.name = name;
        this.selectorAttribute = selectorAttribute || undefined;
        this.selectorTypesToRecord = selectorTypesToRecord;
    }
}
RecordingStartedEvent.eventName = 'recordingstarted';
export class RecordingCancelledEvent extends Event {
    constructor() {
        super(RecordingCancelledEvent.eventName);
    }
}
RecordingCancelledEvent.eventName = 'recordingcancelled';
export class CreateRecordingView extends HTMLElement {
    constructor() {
        super();
        _CreateRecordingView_instances.add(this);
        _CreateRecordingView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _CreateRecordingView_defaultRecordingName.set(this, '');
        _CreateRecordingView_error.set(this, void 0);
        _CreateRecordingView_recorderSettings.set(this, void 0);
        _CreateRecordingView_onInputFocus.set(this, () => {
            __classPrivateFieldGet(this, _CreateRecordingView_shadow, "f").querySelector('#user-flow-name')?.select();
        });
        this.setAttribute('jslog', `${VisualLogging.section('create-recording-view')}`);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _CreateRecordingView_instances, "m", _CreateRecordingView_render).call(this);
        __classPrivateFieldGet(this, _CreateRecordingView_shadow, "f").querySelector('input')?.focus();
    }
    set data(data) {
        __classPrivateFieldSet(this, _CreateRecordingView_recorderSettings, data.recorderSettings, "f");
        __classPrivateFieldSet(this, _CreateRecordingView_defaultRecordingName, __classPrivateFieldGet(this, _CreateRecordingView_recorderSettings, "f").defaultTitle, "f");
    }
    startRecording() {
        const nameInput = __classPrivateFieldGet(this, _CreateRecordingView_shadow, "f").querySelector('#user-flow-name');
        if (!nameInput) {
            throw new Error('input#user-flow-name not found');
        }
        if (!__classPrivateFieldGet(this, _CreateRecordingView_recorderSettings, "f")) {
            throw new Error('settings not set');
        }
        if (!nameInput.value.trim()) {
            __classPrivateFieldSet(this, _CreateRecordingView_error, new Error(i18nString(UIStrings.recordingNameIsRequired)), "f");
            __classPrivateFieldGet(this, _CreateRecordingView_instances, "m", _CreateRecordingView_render).call(this);
            return;
        }
        const selectorTypeElements = __classPrivateFieldGet(this, _CreateRecordingView_shadow, "f").querySelectorAll('.selector-type input[type=checkbox]');
        const selectorTypesToRecord = [];
        for (const selectorType of selectorTypeElements) {
            const checkbox = selectorType;
            const checkboxValue = checkbox.value;
            if (checkbox.checked) {
                selectorTypesToRecord.push(checkboxValue);
            }
        }
        if (!selectorTypesToRecord.includes(Models.Schema.SelectorType.CSS) &&
            !selectorTypesToRecord.includes(Models.Schema.SelectorType.XPath) &&
            !selectorTypesToRecord.includes(Models.Schema.SelectorType.Pierce)) {
            __classPrivateFieldSet(this, _CreateRecordingView_error, new Error(i18nString(UIStrings.includeNecessarySelectors)), "f");
            __classPrivateFieldGet(this, _CreateRecordingView_instances, "m", _CreateRecordingView_render).call(this);
            return;
        }
        for (const selectorType of Object.values(Models.Schema.SelectorType)) {
            __classPrivateFieldGet(this, _CreateRecordingView_recorderSettings, "f").setSelectorByType(selectorType, selectorTypesToRecord.includes(selectorType));
        }
        const selectorAttributeEl = __classPrivateFieldGet(this, _CreateRecordingView_shadow, "f").querySelector('#selector-attribute');
        const selectorAttribute = selectorAttributeEl.value.trim();
        __classPrivateFieldGet(this, _CreateRecordingView_recorderSettings, "f").selectorAttribute = selectorAttribute;
        this.dispatchEvent(new RecordingStartedEvent(nameInput.value.trim(), selectorTypesToRecord, selectorAttribute));
    }
}
_CreateRecordingView_shadow = new WeakMap(), _CreateRecordingView_defaultRecordingName = new WeakMap(), _CreateRecordingView_error = new WeakMap(), _CreateRecordingView_recorderSettings = new WeakMap(), _CreateRecordingView_onInputFocus = new WeakMap(), _CreateRecordingView_instances = new WeakSet(), _CreateRecordingView_onKeyDown = function _CreateRecordingView_onKeyDown(event) {
    if (__classPrivateFieldGet(this, _CreateRecordingView_error, "f")) {
        __classPrivateFieldSet(this, _CreateRecordingView_error, undefined, "f");
        __classPrivateFieldGet(this, _CreateRecordingView_instances, "m", _CreateRecordingView_render).call(this);
    }
    const keyboardEvent = event;
    if (keyboardEvent.key === 'Enter') {
        this.startRecording();
        event.stopPropagation();
        event.preventDefault();
    }
}, _CreateRecordingView_dispatchRecordingCancelled = function _CreateRecordingView_dispatchRecordingCancelled() {
    this.dispatchEvent(new RecordingCancelledEvent());
}, _CreateRecordingView_render = function _CreateRecordingView_render() {
    const selectorTypeToLabel = new Map([
        [Models.Schema.SelectorType.ARIA, i18nString(UIStrings.selectorTypeARIA)],
        [Models.Schema.SelectorType.CSS, i18nString(UIStrings.selectorTypeCSS)],
        [Models.Schema.SelectorType.Text, i18nString(UIStrings.selectorTypeText)],
        [
            Models.Schema.SelectorType.XPath,
            i18nString(UIStrings.selectorTypeXPath),
        ],
        [
            Models.Schema.SelectorType.Pierce,
            i18nString(UIStrings.selectorTypePierce),
        ],
    ]);
    // clang-format off
    Lit.render(html `
        <style>${createRecordingViewStyles}</style>
        <style>${Input.textInputStyles}</style>
        <style>${Input.checkboxStyles}</style>
        <div class="wrapper">
          <div class="header-wrapper">
            <h1>${i18nString(UIStrings.createRecording)}</h1>
            <devtools-button
              title=${i18nString(UIStrings.cancelRecording)}
              jslog=${VisualLogging.close().track({ click: true })}
              .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        iconName: 'cross',
    }}
              @click=${__classPrivateFieldGet(this, _CreateRecordingView_instances, "m", _CreateRecordingView_dispatchRecordingCancelled)}
            ></devtools-button>
          </div>
          <label class="row-label" for="user-flow-name">${i18nString(UIStrings.recordingName)}</label>
          <input
            value=${__classPrivateFieldGet(this, _CreateRecordingView_defaultRecordingName, "f")}
            @focus=${__classPrivateFieldGet(this, _CreateRecordingView_onInputFocus, "f")}
            @keydown=${__classPrivateFieldGet(this, _CreateRecordingView_instances, "m", _CreateRecordingView_onKeyDown)}
            jslog=${VisualLogging.textField('user-flow-name').track({ change: true })}
            class="devtools-text-input"
            id="user-flow-name"
          />
          <label class="row-label" for="selector-attribute">
            <span>${i18nString(UIStrings.selectorAttribute)}</span>
            <x-link
              class="link" href="https://g.co/devtools/recorder#selector"
              title=${i18nString(UIStrings.learnMore)}
              jslog=${VisualLogging.link('recorder-selector-help').track({ click: true })}>
              <devtools-icon name="help">
              </devtools-icon>
            </x-link>
          </label>
          <input
            value=${ifDefined(__classPrivateFieldGet(this, _CreateRecordingView_recorderSettings, "f")?.selectorAttribute)}
            placeholder="data-testid"
            @keydown=${__classPrivateFieldGet(this, _CreateRecordingView_instances, "m", _CreateRecordingView_onKeyDown)}
            jslog=${VisualLogging.textField('selector-attribute').track({ change: true })}
            class="devtools-text-input"
            id="selector-attribute"
          />
          <label class="row-label">
            <span>${i18nString(UIStrings.selectorTypes)}</span>
            <x-link
              class="link" href="https://g.co/devtools/recorder#selector"
              title=${i18nString(UIStrings.learnMore)}
              jslog=${VisualLogging.link('recorder-selector-help').track({ click: true })}>
              <devtools-icon name="help">
              </devtools-icon>
            </x-link>
          </label>
          <div class="checkbox-container">
            ${Object.values(Models.Schema.SelectorType).map(selectorType => {
        const checked = __classPrivateFieldGet(this, _CreateRecordingView_recorderSettings, "f")?.getSelectorByType(selectorType);
        return html `
                  <label class="checkbox-label selector-type">
                    <input
                      @keydown=${__classPrivateFieldGet(this, _CreateRecordingView_instances, "m", _CreateRecordingView_onKeyDown)}
                      .value=${selectorType}
                      jslog=${VisualLogging.toggle().track({ click: true }).context(`selector-${selectorType}`)}
                      ?checked=${checked}
                      type="checkbox"
                    />
                    ${selectorTypeToLabel.get(selectorType) || selectorType}
                  </label>
                `;
    })}
          </div>

          ${__classPrivateFieldGet(this, _CreateRecordingView_error, "f") &&
        html `
          <div class="error" role="alert">
            ${__classPrivateFieldGet(this, _CreateRecordingView_error, "f").message}
          </div>
        `}
        </div>
        <div class="footer">
          <div class="controls">
            <devtools-control-button
              @click=${this.startRecording}
              .label=${i18nString(UIStrings.startRecording)}
              .shape=${'circle'}
              jslog=${VisualLogging.action("chrome-recorder.start-recording" /* Actions.RecorderActions.START_RECORDING */).track({ click: true })}
              title=${Models.Tooltip.getTooltipForActions(i18nString(UIStrings.startRecording), "chrome-recorder.start-recording" /* Actions.RecorderActions.START_RECORDING */)}
            ></devtools-control-button>
          </div>
        </div>
      `, __classPrivateFieldGet(this, _CreateRecordingView_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-create-recording-view', CreateRecordingView);
//# sourceMappingURL=CreateRecordingView.js.map