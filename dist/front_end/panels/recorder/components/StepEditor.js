// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var _a, _EditorState_puppeteer, _RecorderSelectorPickerButton_picker, _RecorderSelectorPickerButton_handleClickEvent, _StepEditor_instances, _StepEditor_renderedAttributes, _StepEditor_commit, _StepEditor_handleSelectorPickedEvent, _StepEditor_handleAddOrRemoveClick, _StepEditor_handleKeyDownEvent, _StepEditor_handleInputBlur, _StepEditor_handleTypeInputBlur, _StepEditor_handleAddRowClickEvent, _StepEditor_renderInlineButton, _StepEditor_renderDeleteButton, _StepEditor_renderTypeRow, _StepEditor_renderRow, _StepEditor_renderFrameRow, _StepEditor_renderSelectorsRow, _StepEditor_renderAssertedEvents, _StepEditor_renderAttributesRow, _StepEditor_renderAddRowButtons, _StepEditor_ensureFocus;
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as SuggestionInput from '../../../ui/components/suggestion_input/suggestion_input.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Controllers from '../controllers/controllers.js';
import * as Models from '../models/models.js';
import * as Util from '../util/util.js';
import stepEditorStyles from './stepEditor.css.js';
import { ArrayAssignments, assert, deepFreeze, immutableDeepAssign, InsertAssignment, } from './util.js';
const { html, Decorators, Directives, LitElement } = Lit;
const { customElement, property, state } = Decorators;
const { live } = Directives;
const typeConverters = Object.freeze({
    string: (value) => value.trim(),
    number: (value) => {
        const number = parseFloat(value);
        if (Number.isNaN(number)) {
            return 0;
        }
        return number;
    },
    boolean: (value) => {
        if (value.toLowerCase() === 'true') {
            return true;
        }
        return false;
    },
});
const dataTypeByAttribute = Object.freeze({
    selectors: 'string',
    offsetX: 'number',
    offsetY: 'number',
    target: 'string',
    frame: 'number',
    assertedEvents: 'string',
    value: 'string',
    key: 'string',
    operator: 'string',
    count: 'number',
    expression: 'string',
    x: 'number',
    y: 'number',
    url: 'string',
    type: 'string',
    timeout: 'number',
    duration: 'number',
    button: 'string',
    deviceType: 'string',
    width: 'number',
    height: 'number',
    deviceScaleFactor: 'number',
    isMobile: 'boolean',
    hasTouch: 'boolean',
    isLandscape: 'boolean',
    download: 'number',
    upload: 'number',
    latency: 'number',
    name: 'string',
    parameters: 'string',
    visible: 'boolean',
    properties: 'string',
    attributes: 'string',
});
const defaultValuesByAttribute = deepFreeze({
    selectors: [['.cls']],
    offsetX: 1,
    offsetY: 1,
    target: 'main',
    frame: [0],
    assertedEvents: [
        { type: 'navigation', url: 'https://example.com', title: 'Title' },
    ],
    value: 'Value',
    key: 'Enter',
    operator: '>=',
    count: 1,
    expression: 'true',
    x: 0,
    y: 0,
    url: 'https://example.com',
    timeout: 5000,
    duration: 50,
    deviceType: 'mouse',
    button: 'primary',
    type: 'click',
    width: 800,
    height: 600,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: true,
    download: 1000,
    upload: 1000,
    latency: 25,
    name: 'customParam',
    parameters: '{}',
    properties: '{}',
    attributes: [{ name: 'attribute', value: 'value' }],
    visible: true,
});
const attributesByType = deepFreeze({
    [Models.Schema.StepType.Click]: {
        required: ['selectors', 'offsetX', 'offsetY'],
        optional: [
            'assertedEvents',
            'button',
            'deviceType',
            'duration',
            'frame',
            'target',
            'timeout',
        ],
    },
    [Models.Schema.StepType.DoubleClick]: {
        required: ['offsetX', 'offsetY', 'selectors'],
        optional: [
            'assertedEvents',
            'button',
            'deviceType',
            'frame',
            'target',
            'timeout',
        ],
    },
    [Models.Schema.StepType.Hover]: {
        required: ['selectors'],
        optional: ['assertedEvents', 'frame', 'target', 'timeout'],
    },
    [Models.Schema.StepType.Change]: {
        required: ['selectors', 'value'],
        optional: ['assertedEvents', 'frame', 'target', 'timeout'],
    },
    [Models.Schema.StepType.KeyDown]: {
        required: ['key'],
        optional: ['assertedEvents', 'target', 'timeout'],
    },
    [Models.Schema.StepType.KeyUp]: {
        required: ['key'],
        optional: ['assertedEvents', 'target', 'timeout'],
    },
    [Models.Schema.StepType.Scroll]: {
        required: [],
        optional: ['assertedEvents', 'frame', 'target', 'timeout', 'x', 'y'],
    },
    [Models.Schema.StepType.Close]: {
        required: [],
        optional: ['assertedEvents', 'target', 'timeout'],
    },
    [Models.Schema.StepType.Navigate]: {
        required: ['url'],
        optional: ['assertedEvents', 'target', 'timeout'],
    },
    [Models.Schema.StepType.WaitForElement]: {
        required: ['selectors'],
        optional: [
            'assertedEvents',
            'attributes',
            'count',
            'frame',
            'operator',
            'properties',
            'target',
            'timeout',
            'visible',
        ],
    },
    [Models.Schema.StepType.WaitForExpression]: {
        required: ['expression'],
        optional: ['assertedEvents', 'frame', 'target', 'timeout'],
    },
    [Models.Schema.StepType.CustomStep]: {
        required: ['name', 'parameters'],
        optional: ['assertedEvents', 'target', 'timeout'],
    },
    [Models.Schema.StepType.EmulateNetworkConditions]: {
        required: ['download', 'latency', 'upload'],
        optional: ['assertedEvents', 'target', 'timeout'],
    },
    [Models.Schema.StepType.SetViewport]: {
        required: [
            'deviceScaleFactor',
            'hasTouch',
            'height',
            'isLandscape',
            'isMobile',
            'width',
        ],
        optional: ['assertedEvents', 'target', 'timeout'],
    },
});
const UIStrings = {
    /**
     *@description The text that is disabled when the steps were not saved due to an error. The error message itself is always in English and not translated.
     *@example {Saving failed} error
     */
    notSaved: 'Not saved: {error}',
    /**
     *@description The button title that adds a new attribute to the form.
     *@example {timeout} attributeName
     */
    addAttribute: 'Add {attributeName}',
    /**
     *@description The title of a button that deletes an attribute from the form.
     */
    deleteRow: 'Delete row',
    /**
     *@description The title of a button that allows you to select an element on the page and update CSS/ARIA selectors.
     */
    selectorPicker: 'Select an element in the page to update selectors',
    /**
     *@description The title of a button that adds a new input field for the entry of the frame index. Frame index is the number of the frame within the page's frame tree.
     */
    addFrameIndex: 'Add frame index within the frame tree',
    /**
     *@description The title of a button that removes a frame index field from the form.
     */
    removeFrameIndex: 'Remove frame index',
    /**
     *@description The title of a button that adds a field to input a part of a selector in the editor form.
     */
    addSelectorPart: 'Add a selector part',
    /**
     *@description The title of a button that removes a field to input a part of a selector in the editor form.
     */
    removeSelectorPart: 'Remove a selector part',
    /**
     *@description The title of a button that adds a field to input a selector in the editor form.
     */
    addSelector: 'Add a selector',
    /**
     *@description The title of a button that removes a field to input a selector in the editor form.
     */
    removeSelector: 'Remove a selector',
    /**
     *@description The error message display when a user enters a type in the input not associates with any existing types.
     */
    unknownActionType: 'Unknown action type.',
};
const str_ = i18n.i18n.registerUIStrings('panels/recorder/components/StepEditor.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class StepEditedEvent extends Event {
    constructor(step) {
        super(StepEditedEvent.eventName, { bubbles: true, composed: true });
        this.data = step;
    }
}
StepEditedEvent.eventName = 'stepedited';
// Makes use of the fact that JSON values get their undefined values cleaned
// after stringification.
const cleanUndefineds = (value) => {
    return JSON.parse(JSON.stringify(value));
};
export class EditorState {
    static async default(type) {
        const state = { type };
        const attributes = attributesByType[state.type];
        let promise = Promise.resolve();
        for (const attribute of attributes.required) {
            promise = Promise.all([
                promise,
                (async () => Object.assign(state, {
                    [attribute]: await this.defaultByAttribute(state, attribute),
                }))(),
            ]);
        }
        await promise;
        return Object.freeze(state);
    }
    static async defaultByAttribute(_state, attribute) {
        return await __classPrivateFieldGet(this, _a, "f", _EditorState_puppeteer).run(puppeteer => {
            switch (attribute) {
                case 'assertedEvents': {
                    return immutableDeepAssign(defaultValuesByAttribute.assertedEvents, new ArrayAssignments({
                        0: {
                            url: puppeteer.page.url() || defaultValuesByAttribute.assertedEvents[0].url,
                        },
                    }));
                }
                case 'url': {
                    return puppeteer.page.url() || defaultValuesByAttribute.url;
                }
                case 'height': {
                    return (puppeteer.page.evaluate(() => visualViewport.height) ||
                        defaultValuesByAttribute.height);
                }
                case 'width': {
                    return (puppeteer.page.evaluate(() => visualViewport.width) ||
                        defaultValuesByAttribute.width);
                }
                default: {
                    return defaultValuesByAttribute[attribute];
                }
            }
        });
    }
    static fromStep(step) {
        const state = structuredClone(step);
        for (const key of ['parameters', 'properties']) {
            if (key in step && step[key] !== undefined) {
                // @ts-expect-error Potential infinite type instantiation.
                state[key] = JSON.stringify(step[key]);
            }
        }
        if ('attributes' in step && step.attributes) {
            state.attributes = [];
            for (const [name, value] of Object.entries(step.attributes)) {
                state.attributes.push({ name, value });
            }
        }
        if ('selectors' in step) {
            state.selectors = step.selectors.map(selector => {
                if (typeof selector === 'string') {
                    return [selector];
                }
                return [...selector];
            });
        }
        return deepFreeze(state);
    }
    static toStep(state) {
        const step = structuredClone(state);
        for (const key of ['parameters', 'properties']) {
            const value = state[key];
            if (value) {
                Object.assign(step, { [key]: JSON.parse(value) });
            }
        }
        if (state.attributes) {
            if (state.attributes.length !== 0) {
                const attributes = {};
                for (const { name, value } of state.attributes) {
                    Object.assign(attributes, { [name]: value });
                }
                Object.assign(step, { attributes });
            }
            else if ('attributes' in step) {
                delete step.attributes;
            }
        }
        if (state.selectors) {
            const selectors = state.selectors.filter(selector => selector.length > 0).map(selector => {
                if (selector.length === 1) {
                    return selector[0];
                }
                return [...selector];
            });
            if (selectors.length !== 0) {
                Object.assign(step, { selectors });
            }
            else if ('selectors' in step) {
                // @ts-expect-error We want to trigger an error in the parsing phase.
                delete step.selectors;
            }
        }
        if (state.frame && state.frame.length === 0 && 'frame' in step) {
            delete step.frame;
        }
        return cleanUndefineds(Models.SchemaUtils.parseStep(step));
    }
}
_a = EditorState;
_EditorState_puppeteer = { value: new Util.SharedObject.SharedObject(() => Models.RecordingPlayer.RecordingPlayer.connectPuppeteer(), ({ browser }) => Models.RecordingPlayer.RecordingPlayer.disconnectPuppeteer(browser)) };
/**
 * @fires RequestSelectorAttributeEvent#requestselectorattribute
 * @fires SelectorPickedEvent#selectorpicked
 */
let RecorderSelectorPickerButton = class RecorderSelectorPickerButton extends LitElement {
    constructor() {
        super();
        _RecorderSelectorPickerButton_picker.set(this, new Controllers.SelectorPicker.SelectorPicker(this));
        _RecorderSelectorPickerButton_handleClickEvent.set(this, (event) => {
            event.preventDefault();
            event.stopPropagation();
            void __classPrivateFieldGet(this, _RecorderSelectorPickerButton_picker, "f").toggle();
        });
        this.disabled = false;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        void __classPrivateFieldGet(this, _RecorderSelectorPickerButton_picker, "f").stop();
    }
    render() {
        if (this.disabled) {
            return;
        }
        // clang-format off
        return html `<style>${stepEditorStyles}</style><devtools-button
      @click=${__classPrivateFieldGet(this, _RecorderSelectorPickerButton_handleClickEvent, "f")}
      .title=${i18nString(UIStrings.selectorPicker)}
      class="selector-picker"
      .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
      .iconName=${'select-element'}
      .active=${__classPrivateFieldGet(this, _RecorderSelectorPickerButton_picker, "f").active}
      .variant=${"icon" /* Buttons.Button.Variant.ICON */}
      jslog=${VisualLogging.toggle('selector-picker').track({
            click: true,
        })}
    ></devtools-button>`;
        // clang-format on
    }
};
_RecorderSelectorPickerButton_picker = new WeakMap();
_RecorderSelectorPickerButton_handleClickEvent = new WeakMap();
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], RecorderSelectorPickerButton.prototype, "disabled", void 0);
RecorderSelectorPickerButton = __decorate([
    customElement('devtools-recorder-selector-picker-button'),
    __metadata("design:paramtypes", [])
], RecorderSelectorPickerButton);
/**
 * @fires RequestSelectorAttributeEvent#requestselectorattribute
 * @fires StepEditedEvent#stepedited
 */
let StepEditor = class StepEditor extends LitElement {
    constructor() {
        super();
        _StepEditor_instances.add(this);
        _StepEditor_renderedAttributes.set(this, new Set());
        _StepEditor_handleSelectorPickedEvent.set(this, (event) => {
            event.preventDefault();
            event.stopPropagation();
            __classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_commit).call(this, immutableDeepAssign(this.state, {
                target: event.data.target,
                frame: event.data.frame,
                selectors: event.data.selectors.map(selector => typeof selector === 'string' ? [selector] : selector),
                offsetX: event.data.offsetX,
                offsetY: event.data.offsetY,
            }));
        });
        _StepEditor_handleAddOrRemoveClick.set(this, (assignments, query, metric) => event => {
            event.preventDefault();
            event.stopPropagation();
            __classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_commit).call(this, immutableDeepAssign(this.state, assignments));
            __classPrivateFieldGet(this, _StepEditor_ensureFocus, "f").call(this, query);
            if (metric) {
                Host.userMetrics.recordingEdited(metric);
            }
        });
        _StepEditor_handleKeyDownEvent.set(this, (event) => {
            assert(event instanceof KeyboardEvent);
            if (event.target instanceof SuggestionInput.SuggestionInput.SuggestionInput && event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                const elements = this.renderRoot.querySelectorAll('devtools-suggestion-input');
                const element = [...elements].findIndex(value => value === event.target);
                if (element >= 0 && element + 1 < elements.length) {
                    elements[element + 1].focus();
                }
                else {
                    event.target.blur();
                }
            }
        });
        _StepEditor_handleInputBlur.set(this, (opts) => event => {
            assert(event.target instanceof SuggestionInput.SuggestionInput.SuggestionInput);
            if (event.target.disabled) {
                return;
            }
            const dataType = dataTypeByAttribute[opts.attribute];
            const value = typeConverters[dataType](event.target.value);
            const assignments = opts.from.bind(this)(value);
            if (!assignments) {
                return;
            }
            __classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_commit).call(this, immutableDeepAssign(this.state, assignments));
            if (opts.metric) {
                Host.userMetrics.recordingEdited(opts.metric);
            }
        });
        _StepEditor_handleTypeInputBlur.set(this, async (event) => {
            assert(event.target instanceof SuggestionInput.SuggestionInput.SuggestionInput);
            if (event.target.disabled) {
                return;
            }
            const value = event.target.value;
            if (value === this.state.type) {
                return;
            }
            if (!Object.values(Models.Schema.StepType).includes(value)) {
                this.error = i18nString(UIStrings.unknownActionType);
                return;
            }
            __classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_commit).call(this, await EditorState.default(value));
            Host.userMetrics.recordingEdited(9 /* Host.UserMetrics.RecordingEdited.TYPE_CHANGED */);
        });
        _StepEditor_handleAddRowClickEvent.set(this, async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const attribute = event.target.dataset.attribute;
            __classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_commit).call(this, immutableDeepAssign(this.state, {
                [attribute]: await EditorState.defaultByAttribute(this.state, attribute),
            }));
            __classPrivateFieldGet(this, _StepEditor_ensureFocus, "f").call(this, `[data-attribute=${attribute}].attribute devtools-suggestion-input`);
        });
        _StepEditor_ensureFocus.set(this, (query) => {
            void this.updateComplete.then(() => {
                const node = this.renderRoot.querySelector(query);
                node?.focus();
            });
        });
        this.state = { type: Models.Schema.StepType.WaitForElement };
        this.isTypeEditable = true;
        this.disabled = false;
    }
    createRenderRoot() {
        const root = super.createRenderRoot();
        root.addEventListener('keydown', __classPrivateFieldGet(this, _StepEditor_handleKeyDownEvent, "f"));
        return root;
    }
    set step(step) {
        this.state = deepFreeze(EditorState.fromStep(step));
        this.error = undefined;
    }
    render() {
        __classPrivateFieldSet(this, _StepEditor_renderedAttributes, new Set(), "f");
        // clang-format off
        const result = html `
      <style>${stepEditorStyles}</style>
      <div class="wrapper" jslog=${VisualLogging.tree('step-editor')} >
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderTypeRow).call(this, this.isTypeEditable)} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'target')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderFrameRow).call(this)} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderSelectorsRow).call(this)}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'deviceType')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'button')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'url')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'x')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'y')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'offsetX')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'offsetY')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'value')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'key')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'operator')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'count')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'expression')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'duration')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderAssertedEvents).call(this)}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'timeout')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'width')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'height')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'deviceScaleFactor')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'isMobile')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'hasTouch')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'isLandscape')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'download')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'upload')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'latency')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'name')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'parameters')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'visible')} ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderRow).call(this, 'properties')}
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderAttributesRow).call(this)}
        ${this.error
            ? html `
              <div class="error">
                ${i18nString(UIStrings.notSaved, {
                error: this.error,
            })}
              </div>
            `
            : undefined}
        ${!this.disabled
            ? html `<div
              class="row-buttons wrapped gap row regular-font no-margin"
            >
              ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderAddRowButtons).call(this)}
            </div>`
            : undefined}
      </div>
    `;
        // clang-format on
        for (const key of Object.keys(dataTypeByAttribute)) {
            if (!__classPrivateFieldGet(this, _StepEditor_renderedAttributes, "f").has(key)) {
                throw new Error(`The editable attribute ${key} does not have UI`);
            }
        }
        return result;
    }
};
_StepEditor_renderedAttributes = new WeakMap();
_StepEditor_handleSelectorPickedEvent = new WeakMap();
_StepEditor_handleAddOrRemoveClick = new WeakMap();
_StepEditor_handleKeyDownEvent = new WeakMap();
_StepEditor_handleInputBlur = new WeakMap();
_StepEditor_handleTypeInputBlur = new WeakMap();
_StepEditor_handleAddRowClickEvent = new WeakMap();
_StepEditor_ensureFocus = new WeakMap();
_StepEditor_instances = new WeakSet();
_StepEditor_commit = function _StepEditor_commit(updatedState) {
    try {
        this.dispatchEvent(new StepEditedEvent(EditorState.toStep(updatedState)));
        // Note we don't need to update this variable since it will come from up
        // the tree, but processing up the tree is asynchronous implying we cannot
        // reliably know when the state will come back down. Since we need to
        // focus the DOM elements that may be created as a result of this new
        // state, we set it here for waiting on the updateComplete promise later.
        this.state = updatedState;
    }
    catch (error) {
        this.error = error.message;
    }
};
_StepEditor_renderInlineButton = function _StepEditor_renderInlineButton(opts) {
    if (this.disabled) {
        return;
    }
    return html `
      <devtools-button
        title=${opts.title}
        .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
        .iconName=${opts.iconName}
        .variant=${"icon" /* Buttons.Button.Variant.ICON */}
        jslog=${VisualLogging.action(opts.class).track({
        click: true,
    })}
        class="inline-button ${opts.class}"
        @click=${opts.onClick}
      ></devtools-button>
    `;
};
_StepEditor_renderDeleteButton = function _StepEditor_renderDeleteButton(attribute) {
    if (this.disabled) {
        return;
    }
    const attributes = attributesByType[this.state.type];
    const optional = [...attributes.optional].includes(attribute);
    if (!optional || this.disabled) {
        return;
    }
    // clang-format off
    return html `<devtools-button
      .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
      .iconName=${'bin'}
      .variant=${"icon" /* Buttons.Button.Variant.ICON */}
      .title=${i18nString(UIStrings.deleteRow)}
      class="inline-button delete-row"
      data-attribute=${attribute}
      jslog=${VisualLogging.action('delete').track({ click: true })}
      @click=${(event) => {
        event.preventDefault();
        event.stopPropagation();
        __classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_commit).call(this, immutableDeepAssign(this.state, { [attribute]: undefined }));
    }}
    ></devtools-button>`;
    // clang-format on
};
_StepEditor_renderTypeRow = function _StepEditor_renderTypeRow(editable) {
    __classPrivateFieldGet(this, _StepEditor_renderedAttributes, "f").add('type');
    // clang-format off
    return html `<div class="row attribute" data-attribute="type" jslog=${VisualLogging.treeItem('type')}>
      <div>type<span class="separator">:</span></div>
      <devtools-suggestion-input
        .disabled=${!editable || this.disabled}
        .options=${Object.values(Models.Schema.StepType)}
        .placeholder=${defaultValuesByAttribute.type}
        .value=${live(this.state.type)}
        @blur=${__classPrivateFieldGet(this, _StepEditor_handleTypeInputBlur, "f")}
      ></devtools-suggestion-input>
    </div>`;
    // clang-format on
};
_StepEditor_renderRow = function _StepEditor_renderRow(attribute) {
    __classPrivateFieldGet(this, _StepEditor_renderedAttributes, "f").add(attribute);
    const attributeValue = this.state[attribute]?.toString();
    if (attributeValue === undefined) {
        return;
    }
    // clang-format off
    return html `<div class="row attribute" data-attribute=${attribute} jslog=${VisualLogging.treeItem(Platform.StringUtilities.toKebabCase(attribute))}>
      <div>${attribute}<span class="separator">:</span></div>
      <devtools-suggestion-input
        .disabled=${this.disabled}
        .placeholder=${defaultValuesByAttribute[attribute].toString()}
        .value=${live(attributeValue)}
        .mimeType=${(() => {
        switch (attribute) {
            case 'expression':
                return 'text/javascript';
            case 'properties':
                return 'application/json';
            default:
                return '';
        }
    })()}
        @blur=${__classPrivateFieldGet(this, _StepEditor_handleInputBlur, "f").call(this, {
        attribute,
        from(value) {
            if (this.state[attribute] === undefined) {
                return;
            }
            switch (attribute) {
                case 'properties':
                    Host.userMetrics.recordingAssertion(2 /* Host.UserMetrics.RecordingAssertion.PROPERTY_ASSERTION_EDITED */);
                    break;
            }
            return { [attribute]: value };
        },
        metric: 10 /* Host.UserMetrics.RecordingEdited.OTHER_EDITING */,
    })}
      ></devtools-suggestion-input>
      ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderDeleteButton).call(this, attribute)}
    </div>`;
    // clang-format on
};
_StepEditor_renderFrameRow = function _StepEditor_renderFrameRow() {
    __classPrivateFieldGet(this, _StepEditor_renderedAttributes, "f").add('frame');
    if (this.state.frame === undefined) {
        return;
    }
    // clang-format off
    return html `
      <div class="attribute" data-attribute="frame" jslog=${VisualLogging.treeItem('frame')}>
        <div class="row">
          <div>frame<span class="separator">:</span></div>
          ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderDeleteButton).call(this, 'frame')}
        </div>
        ${this.state.frame.map((frame, index, frames) => {
        return html `
            <div class="padded row">
              <devtools-suggestion-input
                .disabled=${this.disabled}
                .placeholder=${defaultValuesByAttribute.frame[0].toString()}
                .value=${live(frame.toString())}
                data-path=${`frame.${index}`}
                @blur=${__classPrivateFieldGet(this, _StepEditor_handleInputBlur, "f").call(this, {
            attribute: 'frame',
            from(value) {
                if (this.state.frame?.[index] === undefined) {
                    return;
                }
                return {
                    frame: new ArrayAssignments({ [index]: value }),
                };
            },
            metric: 10 /* Host.UserMetrics.RecordingEdited.OTHER_EDITING */,
        })}
              ></devtools-suggestion-input>
              ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderInlineButton).call(this, {
            class: 'add-frame',
            title: i18nString(UIStrings.addFrameIndex),
            iconName: 'plus',
            onClick: __classPrivateFieldGet(this, _StepEditor_handleAddOrRemoveClick, "f").call(this, {
                frame: new ArrayAssignments({
                    [index + 1]: new InsertAssignment(defaultValuesByAttribute.frame[0]),
                }),
            }, `devtools-suggestion-input[data-path="frame.${index + 1}"]`, 10 /* Host.UserMetrics.RecordingEdited.OTHER_EDITING */),
        })}
              ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderInlineButton).call(this, {
            class: 'remove-frame',
            title: i18nString(UIStrings.removeFrameIndex),
            iconName: 'minus',
            onClick: __classPrivateFieldGet(this, _StepEditor_handleAddOrRemoveClick, "f").call(this, {
                frame: new ArrayAssignments({ [index]: undefined }),
            }, `devtools-suggestion-input[data-path="frame.${Math.min(index, frames.length - 2)}"]`, 10 /* Host.UserMetrics.RecordingEdited.OTHER_EDITING */),
        })}
            </div>
          `;
    })}
      </div>
    `;
    // clang-format on
};
_StepEditor_renderSelectorsRow = function _StepEditor_renderSelectorsRow() {
    __classPrivateFieldGet(this, _StepEditor_renderedAttributes, "f").add('selectors');
    if (this.state.selectors === undefined) {
        return;
    }
    // clang-format off
    return html `<div class="attribute" data-attribute="selectors" jslog=${VisualLogging.treeItem('selectors')}>
      <div class="row">
        <div>selectors<span class="separator">:</span></div>
        <devtools-recorder-selector-picker-button
          @selectorpicked=${__classPrivateFieldGet(this, _StepEditor_handleSelectorPickedEvent, "f")}
          .disabled=${this.disabled}
        ></devtools-recorder-selector-picker-button>
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderDeleteButton).call(this, 'selectors')}
      </div>
      ${this.state.selectors.map((selector, index, selectors) => {
        return html `<div class="padded row" data-selector-path=${index}>
            <div>selector #${index + 1}<span class="separator">:</span></div>
            ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderInlineButton).call(this, {
            class: 'add-selector',
            title: i18nString(UIStrings.addSelector),
            iconName: 'plus',
            onClick: __classPrivateFieldGet(this, _StepEditor_handleAddOrRemoveClick, "f").call(this, {
                selectors: new ArrayAssignments({
                    [index + 1]: new InsertAssignment(structuredClone(defaultValuesByAttribute.selectors[0])),
                }),
            }, `devtools-suggestion-input[data-path="selectors.${index + 1}.0"]`, 4 /* Host.UserMetrics.RecordingEdited.SELECTOR_ADDED */),
        })}
            ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderInlineButton).call(this, {
            class: 'remove-selector',
            title: i18nString(UIStrings.removeSelector),
            iconName: 'minus',
            onClick: __classPrivateFieldGet(this, _StepEditor_handleAddOrRemoveClick, "f").call(this, { selectors: new ArrayAssignments({ [index]: undefined }) }, `devtools-suggestion-input[data-path="selectors.${Math.min(index, selectors.length - 2)}.0"]`, 5 /* Host.UserMetrics.RecordingEdited.SELECTOR_REMOVED */),
        })}
          </div>
          ${selector.map((part, partIndex, parts) => {
            return html `<div
              class="double padded row"
              data-selector-path="${index}.${partIndex}"
            >
              <devtools-suggestion-input
                .disabled=${this.disabled}
                .placeholder=${defaultValuesByAttribute.selectors[0][0]}
                .value=${live(part)}
                data-path=${`selectors.${index}.${partIndex}`}
                @blur=${__classPrivateFieldGet(this, _StepEditor_handleInputBlur, "f").call(this, {
                attribute: 'selectors',
                from(value) {
                    if (this.state.selectors?.[index]?.[partIndex] === undefined) {
                        return;
                    }
                    return {
                        selectors: new ArrayAssignments({
                            [index]: new ArrayAssignments({
                                [partIndex]: value,
                            }),
                        }),
                    };
                },
                metric: 7 /* Host.UserMetrics.RecordingEdited.SELECTOR_PART_EDITED */,
            })}
              ></devtools-suggestion-input>
              ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderInlineButton).call(this, {
                class: 'add-selector-part',
                title: i18nString(UIStrings.addSelectorPart),
                iconName: 'plus',
                onClick: __classPrivateFieldGet(this, _StepEditor_handleAddOrRemoveClick, "f").call(this, {
                    selectors: new ArrayAssignments({
                        [index]: new ArrayAssignments({
                            [partIndex + 1]: new InsertAssignment(defaultValuesByAttribute.selectors[0][0]),
                        }),
                    }),
                }, `devtools-suggestion-input[data-path="selectors.${index}.${partIndex + 1}"]`, 6 /* Host.UserMetrics.RecordingEdited.SELECTOR_PART_ADDED */),
            })}
              ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderInlineButton).call(this, {
                class: 'remove-selector-part',
                title: i18nString(UIStrings.removeSelectorPart),
                iconName: 'minus',
                onClick: __classPrivateFieldGet(this, _StepEditor_handleAddOrRemoveClick, "f").call(this, {
                    selectors: new ArrayAssignments({
                        [index]: new ArrayAssignments({
                            [partIndex]: undefined,
                        }),
                    }),
                }, `devtools-suggestion-input[data-path="selectors.${index}.${Math.min(partIndex, parts.length - 2)}"]`, 8 /* Host.UserMetrics.RecordingEdited.SELECTOR_PART_REMOVED */),
            })}
            </div>`;
        })}`;
    })}
    </div>`;
    // clang-format on
};
_StepEditor_renderAssertedEvents = function _StepEditor_renderAssertedEvents() {
    __classPrivateFieldGet(this, _StepEditor_renderedAttributes, "f").add('assertedEvents');
    if (this.state.assertedEvents === undefined) {
        return;
    }
    // clang-format off
    return html `<div class="attribute" data-attribute="assertedEvents" jslog=${VisualLogging.treeItem('asserted-events')}>
      <div class="row">
        <div>asserted events<span class="separator">:</span></div>
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderDeleteButton).call(this, 'assertedEvents')}
      </div>
      ${this.state.assertedEvents.map((event, index) => {
        return html ` <div class="padded row" jslog=${VisualLogging.treeItem('event-type')}>
            <div>type<span class="separator">:</span></div>
            <div>${event.type}</div>
          </div>
          <div class="padded row" jslog=${VisualLogging.treeItem('event-title')}>
            <div>title<span class="separator">:</span></div>
            <devtools-suggestion-input
              .disabled=${this.disabled}
              .placeholder=${defaultValuesByAttribute.assertedEvents[0].title}
              .value=${live(event.title ?? '')}
              @blur=${__classPrivateFieldGet(this, _StepEditor_handleInputBlur, "f").call(this, {
            attribute: 'assertedEvents',
            from(value) {
                if (this.state.assertedEvents?.[index]?.title === undefined) {
                    return;
                }
                return {
                    assertedEvents: new ArrayAssignments({
                        [index]: { title: value },
                    }),
                };
            },
            metric: 10 /* Host.UserMetrics.RecordingEdited.OTHER_EDITING */,
        })}
            ></devtools-suggestion-input>
          </div>
          <div class="padded row" jslog=${VisualLogging.treeItem('event-url')}>
            <div>url<span class="separator">:</span></div>
            <devtools-suggestion-input
              .disabled=${this.disabled}
              .placeholder=${defaultValuesByAttribute.assertedEvents[0].url}
              .value=${live(event.url ?? '')}
              @blur=${__classPrivateFieldGet(this, _StepEditor_handleInputBlur, "f").call(this, {
            attribute: 'url',
            from(value) {
                if (this.state.assertedEvents?.[index]?.url === undefined) {
                    return;
                }
                return {
                    assertedEvents: new ArrayAssignments({
                        [index]: { url: value },
                    }),
                };
            },
            metric: 10 /* Host.UserMetrics.RecordingEdited.OTHER_EDITING */,
        })}
            ></devtools-suggestion-input>
          </div>`;
    })}
    </div> `;
    // clang-format on
};
_StepEditor_renderAttributesRow = function _StepEditor_renderAttributesRow() {
    __classPrivateFieldGet(this, _StepEditor_renderedAttributes, "f").add('attributes');
    if (this.state.attributes === undefined) {
        return;
    }
    // clang-format off
    return html `<div class="attribute" data-attribute="attributes" jslog=${VisualLogging.treeItem('attributes')}>
      <div class="row">
        <div>attributes<span class="separator">:</span></div>
        ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderDeleteButton).call(this, 'attributes')}
      </div>
      ${this.state.attributes.map(({ name, value }, index, attributes) => {
        return html `<div class="padded row" jslog=${VisualLogging.treeItem('attribute')}>
          <devtools-suggestion-input
            .disabled=${this.disabled}
            .placeholder=${defaultValuesByAttribute.attributes[0].name}
            .value=${live(name)}
            data-path=${`attributes.${index}.name`}
            jslog=${VisualLogging.key().track({ change: true })}
            @blur=${__classPrivateFieldGet(this, _StepEditor_handleInputBlur, "f").call(this, {
            attribute: 'attributes',
            from(name) {
                if (this.state.attributes?.[index]?.name === undefined) {
                    return;
                }
                Host.userMetrics.recordingAssertion(3 /* Host.UserMetrics.RecordingAssertion.ATTRIBUTE_ASSERTION_EDITED */);
                return {
                    attributes: new ArrayAssignments({ [index]: { name } }),
                };
            },
            metric: 10 /* Host.UserMetrics.RecordingEdited.OTHER_EDITING */,
        })}
          ></devtools-suggestion-input>
          <span class="separator">:</span>
          <devtools-suggestion-input
            .disabled=${this.disabled}
            .placeholder=${defaultValuesByAttribute.attributes[0].value}
            .value=${live(value)}
            data-path=${`attributes.${index}.value`}
            @blur=${__classPrivateFieldGet(this, _StepEditor_handleInputBlur, "f").call(this, {
            attribute: 'attributes',
            from(value) {
                if (this.state.attributes?.[index]?.value === undefined) {
                    return;
                }
                Host.userMetrics.recordingAssertion(3 /* Host.UserMetrics.RecordingAssertion.ATTRIBUTE_ASSERTION_EDITED */);
                return {
                    attributes: new ArrayAssignments({ [index]: { value } }),
                };
            },
            metric: 10 /* Host.UserMetrics.RecordingEdited.OTHER_EDITING */,
        })}
          ></devtools-suggestion-input>
          ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderInlineButton).call(this, {
            class: 'add-attribute-assertion',
            title: i18nString(UIStrings.addSelectorPart),
            iconName: 'plus',
            onClick: __classPrivateFieldGet(this, _StepEditor_handleAddOrRemoveClick, "f").call(this, {
                attributes: new ArrayAssignments({
                    [index + 1]: new InsertAssignment((() => {
                        {
                            const names = new Set(attributes.map(({ name }) => name));
                            const defaultAttribute = defaultValuesByAttribute.attributes[0];
                            let name = defaultAttribute.name;
                            let i = 0;
                            while (names.has(name)) {
                                ++i;
                                name = `${defaultAttribute.name}-${i}`;
                            }
                            return { ...defaultAttribute, name };
                        }
                    })()),
                }),
            }, `devtools-suggestion-input[data-path="attributes.${index + 1}.name"]`, 10 /* Host.UserMetrics.RecordingEdited.OTHER_EDITING */),
        })}
          ${__classPrivateFieldGet(this, _StepEditor_instances, "m", _StepEditor_renderInlineButton).call(this, {
            class: 'remove-attribute-assertion',
            title: i18nString(UIStrings.removeSelectorPart),
            iconName: 'minus',
            onClick: __classPrivateFieldGet(this, _StepEditor_handleAddOrRemoveClick, "f").call(this, { attributes: new ArrayAssignments({ [index]: undefined }) }, `devtools-suggestion-input[data-path="attributes.${Math.min(index, attributes.length - 2)}.value"]`, 10 /* Host.UserMetrics.RecordingEdited.OTHER_EDITING */),
        })}
        </div>`;
    })}
    </div>`;
    // clang-format on
};
_StepEditor_renderAddRowButtons = function _StepEditor_renderAddRowButtons() {
    const attributes = attributesByType[this.state.type];
    return [...attributes.optional].filter(attr => this.state[attr] === undefined).map(attr => {
        // clang-format off
        return html `<devtools-button
          .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}
          class="add-row"
          data-attribute=${attr}
          jslog=${VisualLogging.action(`add-${Platform.StringUtilities.toKebabCase(attr)}`)}
          @click=${__classPrivateFieldGet(this, _StepEditor_handleAddRowClickEvent, "f")}
        >
          ${i18nString(UIStrings.addAttribute, {
            attributeName: attr,
        })}
        </devtools-button>`;
        // clang-format on
    });
};
__decorate([
    state(),
    __metadata("design:type", Object)
], StepEditor.prototype, "state", void 0);
__decorate([
    state(),
    __metadata("design:type", String)
], StepEditor.prototype, "error", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], StepEditor.prototype, "isTypeEditable", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], StepEditor.prototype, "disabled", void 0);
StepEditor = __decorate([
    customElement('devtools-recorder-step-editor'),
    __metadata("design:paramtypes", [])
], StepEditor);
export { StepEditor };
//# sourceMappingURL=StepEditor.js.map