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
var _StepView_instances, _StepView_shadow, _StepView_observer, _StepView_viewInput, _StepView_view, _StepView_toggleShowDetails, _StepView_onToggleShowDetailsKeydown, _StepView_stepEdited, _StepView_handleStepAction, _StepView_onBreakpointClick, _StepView_getActions, _StepView_populateStepContextMenu, _StepView_render;
/* Some view input callbacks might be handled outside of Lit and we
   bind all of them upfront. We disable the lit_html_host_this since we
   do not define any host for Lit.render and the rule is not happy
   about it. */
import '../../../ui/components/icon_button/icon_button.js';
import './StepEditor.js';
import './TimelineSection.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Menus from '../../../ui/components/menus/menus.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Models from '../models/models.js';
import stepViewStyles from './stepView.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description Title for the step type that configures the viewport
     */
    setViewportClickTitle: 'Set viewport',
    /**
     *@description Title for the customStep step type
     */
    customStepTitle: 'Custom step',
    /**
     *@description Title for the click step type
     */
    clickStepTitle: 'Click',
    /**
     *@description Title for the double click step type
     */
    doubleClickStepTitle: 'Double click',
    /**
     *@description Title for the hover step type
     */
    hoverStepTitle: 'Hover',
    /**
     *@description Title for the emulateNetworkConditions step type
     */
    emulateNetworkConditionsStepTitle: 'Emulate network conditions',
    /**
     *@description Title for the change step type
     */
    changeStepTitle: 'Change',
    /**
     *@description Title for the close step type
     */
    closeStepTitle: 'Close',
    /**
     *@description Title for the scroll step type
     */
    scrollStepTitle: 'Scroll',
    /**
     *@description Title for the key up step type. `up` refers to the state of the keyboard key: it's released, i.e., up. It does not refer to the down arrow key specifically.
     */
    keyUpStepTitle: 'Key up',
    /**
     *@description Title for the navigate step type
     */
    navigateStepTitle: 'Navigate',
    /**
     *@description Title for the key down step type. `down` refers to the state of the keyboard key: it's pressed, i.e., down. It does not refer to the down arrow key specifically.
     */
    keyDownStepTitle: 'Key down',
    /**
     *@description Title for the waitForElement step type
     */
    waitForElementStepTitle: 'Wait for element',
    /**
     *@description Title for the waitForExpression step type
     */
    waitForExpressionStepTitle: 'Wait for expression',
    /**
     *@description Title for elements with role button
     */
    elementRoleButton: 'Button',
    /**
     *@description Title for elements with role input
     */
    elementRoleInput: 'Input',
    /**
     *@description Default title for elements without a specific role
     */
    elementRoleFallback: 'Element',
    /**
     *@description The title of the button in the step's context menu that adds a new step before the current one.
     */
    addStepBefore: 'Add step before',
    /**
     *@description The title of the button in the step's context menu that adds a new step after the current one.
     */
    addStepAfter: 'Add step after',
    /**
     *@description The title of the button in the step's context menu that removes the step.
     */
    removeStep: 'Remove step',
    /**
     *@description The title of the button that open the step's context menu.
     */
    openStepActions: 'Open step actions',
    /**
     *@description The title of the button in the step's context menu that adds a breakpoint.
     */
    addBreakpoint: 'Add breakpoint',
    /**
     *@description The title of the button in the step's context menu that removes a breakpoint.
     */
    removeBreakpoint: 'Remove breakpoint',
    /**
     * @description A menu item item in the context menu that expands another menu which list all
     * the formats the user can copy the recording as.
     */
    copyAs: 'Copy as',
    /**
     * @description The title of the menu group that holds actions on recording steps.
     */
    stepManagement: 'Manage steps',
    /**
     * @description The title of the menu group that holds actions related to breakpoints.
     */
    breakpoints: 'Breakpoints',
};
const str_ = i18n.i18n.registerUIStrings('panels/recorder/components/StepView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var State;
(function (State) {
    State["DEFAULT"] = "default";
    State["SUCCESS"] = "success";
    State["CURRENT"] = "current";
    State["OUTSTANDING"] = "outstanding";
    State["ERROR"] = "error";
    State["STOPPED"] = "stopped";
})(State || (State = {}));
export class CaptureSelectorsEvent extends Event {
    constructor(step) {
        super(CaptureSelectorsEvent.eventName, { bubbles: true, composed: true });
        this.data = step;
    }
}
CaptureSelectorsEvent.eventName = 'captureselectors';
export class StopSelectorsCaptureEvent extends Event {
    constructor() {
        super(StopSelectorsCaptureEvent.eventName, {
            bubbles: true,
            composed: true,
        });
    }
}
StopSelectorsCaptureEvent.eventName = 'stopselectorscapture';
export class CopyStepEvent extends Event {
    constructor(step) {
        super(CopyStepEvent.eventName, { bubbles: true, composed: true });
        this.step = step;
    }
}
CopyStepEvent.eventName = 'copystep';
export class StepChanged extends Event {
    constructor(currentStep, newStep) {
        super(StepChanged.eventName, { bubbles: true, composed: true });
        this.currentStep = currentStep;
        this.newStep = newStep;
    }
}
StepChanged.eventName = 'stepchanged';
export var AddStepPosition;
(function (AddStepPosition) {
    AddStepPosition["BEFORE"] = "before";
    AddStepPosition["AFTER"] = "after";
})(AddStepPosition || (AddStepPosition = {}));
export class AddStep extends Event {
    constructor(stepOrSection, position) {
        super(AddStep.eventName, { bubbles: true, composed: true });
        this.stepOrSection = stepOrSection;
        this.position = position;
    }
}
AddStep.eventName = 'addstep';
export class RemoveStep extends Event {
    constructor(step) {
        super(RemoveStep.eventName, { bubbles: true, composed: true });
        this.step = step;
    }
}
RemoveStep.eventName = 'removestep';
export class AddBreakpointEvent extends Event {
    constructor(index) {
        super(AddBreakpointEvent.eventName, { bubbles: true, composed: true });
        this.index = index;
    }
}
AddBreakpointEvent.eventName = 'addbreakpoint';
export class RemoveBreakpointEvent extends Event {
    constructor(index) {
        super(RemoveBreakpointEvent.eventName, { bubbles: true, composed: true });
        this.index = index;
    }
}
RemoveBreakpointEvent.eventName = 'removebreakpoint';
const COPY_ACTION_PREFIX = 'copy-step-as-';
function getStepTypeTitle(input) {
    if (input.section) {
        return input.section.title ? input.section.title : html `<span class="fallback">(No Title)</span>`;
    }
    if (!input.step) {
        throw new Error('Missing both step and section');
    }
    switch (input.step.type) {
        case Models.Schema.StepType.CustomStep:
            return i18nString(UIStrings.customStepTitle);
        case Models.Schema.StepType.SetViewport:
            return i18nString(UIStrings.setViewportClickTitle);
        case Models.Schema.StepType.Click:
            return i18nString(UIStrings.clickStepTitle);
        case Models.Schema.StepType.DoubleClick:
            return i18nString(UIStrings.doubleClickStepTitle);
        case Models.Schema.StepType.Hover:
            return i18nString(UIStrings.hoverStepTitle);
        case Models.Schema.StepType.EmulateNetworkConditions:
            return i18nString(UIStrings.emulateNetworkConditionsStepTitle);
        case Models.Schema.StepType.Change:
            return i18nString(UIStrings.changeStepTitle);
        case Models.Schema.StepType.Close:
            return i18nString(UIStrings.closeStepTitle);
        case Models.Schema.StepType.Scroll:
            return i18nString(UIStrings.scrollStepTitle);
        case Models.Schema.StepType.KeyUp:
            return i18nString(UIStrings.keyUpStepTitle);
        case Models.Schema.StepType.KeyDown:
            return i18nString(UIStrings.keyDownStepTitle);
        case Models.Schema.StepType.WaitForElement:
            return i18nString(UIStrings.waitForElementStepTitle);
        case Models.Schema.StepType.WaitForExpression:
            return i18nString(UIStrings.waitForExpressionStepTitle);
        case Models.Schema.StepType.Navigate:
            return i18nString(UIStrings.navigateStepTitle);
    }
}
function getElementRoleTitle(role) {
    switch (role) {
        case 'button':
            return i18nString(UIStrings.elementRoleButton);
        case 'input':
            return i18nString(UIStrings.elementRoleInput);
        default:
            return i18nString(UIStrings.elementRoleFallback);
    }
}
function getSelectorPreview(step) {
    if (!('selectors' in step)) {
        return '';
    }
    const ariaSelector = step.selectors.flat().find(selector => selector.startsWith('aria/'));
    if (!ariaSelector) {
        return '';
    }
    const m = ariaSelector.match(/^aria\/(.+?)(\[role="(.+)"\])?$/);
    if (!m) {
        return '';
    }
    return `${getElementRoleTitle(m[3])} "${m[1]}"`;
}
function getSectionPreview(section) {
    if (!section) {
        return '';
    }
    return section.url;
}
function renderStepActions(input) {
    // clang-format off
    return html `
    <devtools-menu-button
      class="step-actions"
      title=${i18nString(UIStrings.openStepActions)}
      aria-label=${i18nString(UIStrings.openStepActions)}
      .populateMenuCall=${input.populateStepContextMenu}
      @keydown=${(event) => {
        event.stopPropagation();
    }}
      jslog=${VisualLogging.dropDown('step-actions').track({ click: true })}
      .iconName=${'dots-vertical'}
      }
    ></devtools-menu-button>
  `;
    // clang-format on
}
function viewFunction(input, _output, target) {
    if (!input.step && !input.section) {
        return;
    }
    const stepClasses = {
        step: true,
        expanded: input.showDetails,
        'is-success': input.state === "success" /* State.SUCCESS */,
        'is-current': input.state === "current" /* State.CURRENT */,
        'is-outstanding': input.state === "outstanding" /* State.OUTSTANDING */,
        'is-error': input.state === "error" /* State.ERROR */,
        'is-stopped': input.state === "stopped" /* State.STOPPED */,
        'is-start-of-group': input.isStartOfGroup,
        'is-first-section': input.isFirstSection,
        'has-breakpoint': input.hasBreakpoint,
    };
    const isExpandable = Boolean(input.step);
    const mainTitle = getStepTypeTitle({
        step: input.step,
        section: input.section,
    });
    const subtitle = input.step ? getSelectorPreview(input.step) : getSectionPreview();
    // clang-format off
    Lit.render(html `
    <style>${stepViewStyles}</style>
    <devtools-timeline-section .data=${{
        isFirstSection: input.isFirstSection,
        isLastSection: input.isLastSection,
        isStartOfGroup: input.isStartOfGroup,
        isEndOfGroup: input.isEndOfGroup,
        isSelected: input.isSelected,
    }} @contextmenu=${(e) => {
        const menu = new UI.ContextMenu.ContextMenu(e);
        input.populateStepContextMenu(menu);
        void menu.show();
    }}
      data-step-index=${input.stepIndex} data-section-index=${input.sectionIndex} class=${Lit.Directives.classMap(stepClasses)}>
      <svg slot="icon" width="24" height="24" height="100%" class="icon">
        <circle class="circle-icon"/>
        <g class="error-icon">
          <path d="M1.5 1.5L6.5 6.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1.5 6.5L6.5 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <path @click=${input.onBreakpointClick} jslog=${VisualLogging.action('breakpoint').track({ click: true })} class="breakpoint-icon" d="M2.5 5.5H17.7098L21.4241 12L17.7098 18.5H2.5V5.5Z"/>
      </svg>
      <div class="summary">
        <div class="title-container ${isExpandable ? 'action' : ''}"
          @click=${isExpandable && input.toggleShowDetails}
          @keydown=${isExpandable && input.onToggleShowDetailsKeydown}
          tabindex="0"
          jslog=${VisualLogging.sectionHeader().track({ click: true })}
          aria-role=${isExpandable ? 'button' : ''}
          aria-label=${isExpandable ? 'Show details for step' : ''}
        >
          ${isExpandable
        ? html `<devtools-icon
                  class="chevron"
                  jslog=${VisualLogging.expand().track({ click: true })}
                  name="triangle-down">
                </devtools-icon>`
        : ''}
          <div class="title">
            <div class="main-title" title=${mainTitle}>${mainTitle}</div>
            <div class="subtitle" title=${subtitle}>${subtitle}</div>
          </div>
        </div>
        <div class="filler"></div>
        ${renderStepActions(input)}
      </div>
      <div class="details">
        ${input.step &&
        html `<devtools-recorder-step-editor
          class=${input.isSelected ? 'is-selected' : ''}
          .step=${input.step}
          .disabled=${input.isPlaying}
          @stepedited=${input.stepEdited}>
        </devtools-recorder-step-editor>`}
        ${input.section?.causingStep &&
        html `<devtools-recorder-step-editor
          .step=${input.section.causingStep}
          .isTypeEditable=${false}
          .disabled=${input.isPlaying}
          @stepedited=${input.stepEdited}>
        </devtools-recorder-step-editor>`}
      </div>
      ${input.error &&
        html `
        <div class="error" role="alert">
          ${input.error.message}
        </div>
      `}
    </devtools-timeline-section>
  `, target);
    // clang-format on
}
export class StepView extends HTMLElement {
    constructor(view) {
        super();
        _StepView_instances.add(this);
        _StepView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _StepView_observer.set(this, new IntersectionObserver(result => {
            __classPrivateFieldGet(this, _StepView_viewInput, "f").isVisible = result[0].isIntersecting;
        }));
        _StepView_viewInput.set(this, {
            state: "default" /* State.DEFAULT */,
            showDetails: false,
            isEndOfGroup: false,
            isStartOfGroup: false,
            stepIndex: 0,
            sectionIndex: 0,
            isFirstSection: false,
            isLastSection: false,
            isRecording: false,
            isPlaying: false,
            isVisible: false,
            hasBreakpoint: false,
            removable: true,
            builtInConverters: [],
            extensionConverters: [],
            isSelected: false,
            recorderSettings: undefined,
            actions: [],
            stepEdited: __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_stepEdited).bind(this),
            onBreakpointClick: __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_onBreakpointClick).bind(this),
            handleStepAction: __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_handleStepAction).bind(this),
            toggleShowDetails: __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_toggleShowDetails).bind(this),
            onToggleShowDetailsKeydown: __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_onToggleShowDetailsKeydown).bind(this),
            populateStepContextMenu: __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_populateStepContextMenu).bind(this),
        });
        _StepView_view.set(this, viewFunction);
        _StepView_getActions.set(this, () => {
            const actions = [];
            if (!__classPrivateFieldGet(this, _StepView_viewInput, "f").isPlaying) {
                if (__classPrivateFieldGet(this, _StepView_viewInput, "f").step) {
                    actions.push({
                        id: 'add-step-before',
                        label: i18nString(UIStrings.addStepBefore),
                        group: 'stepManagement',
                        groupTitle: i18nString(UIStrings.stepManagement),
                    });
                }
                actions.push({
                    id: 'add-step-after',
                    label: i18nString(UIStrings.addStepAfter),
                    group: 'stepManagement',
                    groupTitle: i18nString(UIStrings.stepManagement),
                });
                if (__classPrivateFieldGet(this, _StepView_viewInput, "f").removable) {
                    actions.push({
                        id: 'remove-step',
                        group: 'stepManagement',
                        groupTitle: i18nString(UIStrings.stepManagement),
                        label: i18nString(UIStrings.removeStep),
                    });
                }
            }
            if (__classPrivateFieldGet(this, _StepView_viewInput, "f").step && !__classPrivateFieldGet(this, _StepView_viewInput, "f").isRecording) {
                if (__classPrivateFieldGet(this, _StepView_viewInput, "f").hasBreakpoint) {
                    actions.push({
                        id: 'remove-breakpoint',
                        label: i18nString(UIStrings.removeBreakpoint),
                        group: 'breakPointManagement',
                        groupTitle: i18nString(UIStrings.breakpoints),
                    });
                }
                else {
                    actions.push({
                        id: 'add-breakpoint',
                        label: i18nString(UIStrings.addBreakpoint),
                        group: 'breakPointManagement',
                        groupTitle: i18nString(UIStrings.breakpoints),
                    });
                }
            }
            if (__classPrivateFieldGet(this, _StepView_viewInput, "f").step) {
                for (const converter of __classPrivateFieldGet(this, _StepView_viewInput, "f").builtInConverters || []) {
                    actions.push({
                        id: COPY_ACTION_PREFIX + Platform.StringUtilities.toKebabCase(converter.getId()),
                        label: converter.getFormatName(),
                        group: 'copy',
                        groupTitle: i18nString(UIStrings.copyAs),
                    });
                }
                for (const converter of __classPrivateFieldGet(this, _StepView_viewInput, "f").extensionConverters || []) {
                    actions.push({
                        id: COPY_ACTION_PREFIX + Platform.StringUtilities.toKebabCase(converter.getId()),
                        label: converter.getFormatName(),
                        group: 'copy',
                        groupTitle: i18nString(UIStrings.copyAs),
                        jslogContext: COPY_ACTION_PREFIX + 'extension',
                    });
                }
            }
            return actions;
        });
        if (view) {
            __classPrivateFieldSet(this, _StepView_view, view, "f");
        }
        this.setAttribute('jslog', `${VisualLogging.section('step-view')}`);
    }
    set data(data) {
        const prevState = __classPrivateFieldGet(this, _StepView_viewInput, "f").state;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").step = data.step;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").section = data.section;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").state = data.state;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").error = data.error;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").isEndOfGroup = data.isEndOfGroup;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").isStartOfGroup = data.isStartOfGroup;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").stepIndex = data.stepIndex;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").sectionIndex = data.sectionIndex;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").isFirstSection = data.isFirstSection;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").isLastSection = data.isLastSection;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").isRecording = data.isRecording;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").isPlaying = data.isPlaying;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").hasBreakpoint = data.hasBreakpoint;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").removable = data.removable;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").builtInConverters = data.builtInConverters;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").extensionConverters = data.extensionConverters;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").isSelected = data.isSelected;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").recorderSettings = data.recorderSettings;
        __classPrivateFieldGet(this, _StepView_viewInput, "f").actions = __classPrivateFieldGet(this, _StepView_getActions, "f").call(this);
        __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_render).call(this);
        if (__classPrivateFieldGet(this, _StepView_viewInput, "f").state !== prevState && __classPrivateFieldGet(this, _StepView_viewInput, "f").state === 'current' && !__classPrivateFieldGet(this, _StepView_viewInput, "f").isVisible) {
            this.scrollIntoView();
        }
    }
    get step() {
        return __classPrivateFieldGet(this, _StepView_viewInput, "f").step;
    }
    get section() {
        return __classPrivateFieldGet(this, _StepView_viewInput, "f").section;
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _StepView_observer, "f").observe(this);
        __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_render).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _StepView_observer, "f").unobserve(this);
    }
}
_StepView_shadow = new WeakMap(), _StepView_observer = new WeakMap(), _StepView_viewInput = new WeakMap(), _StepView_view = new WeakMap(), _StepView_getActions = new WeakMap(), _StepView_instances = new WeakSet(), _StepView_toggleShowDetails = function _StepView_toggleShowDetails() {
    __classPrivateFieldGet(this, _StepView_viewInput, "f").showDetails = !__classPrivateFieldGet(this, _StepView_viewInput, "f").showDetails;
    __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_render).call(this);
}, _StepView_onToggleShowDetailsKeydown = function _StepView_onToggleShowDetailsKeydown(event) {
    const keyboardEvent = event;
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
        __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_toggleShowDetails).call(this);
        event.stopPropagation();
        event.preventDefault();
    }
}, _StepView_stepEdited = function _StepView_stepEdited(event) {
    const step = __classPrivateFieldGet(this, _StepView_viewInput, "f").step || __classPrivateFieldGet(this, _StepView_viewInput, "f").section?.causingStep;
    if (!step) {
        throw new Error('Expected step.');
    }
    this.dispatchEvent(new StepChanged(step, event.data));
}, _StepView_handleStepAction = function _StepView_handleStepAction(event) {
    switch (event.itemValue) {
        case 'add-step-before': {
            const stepOrSection = __classPrivateFieldGet(this, _StepView_viewInput, "f").step || __classPrivateFieldGet(this, _StepView_viewInput, "f").section;
            if (!stepOrSection) {
                throw new Error('Expected step or section.');
            }
            this.dispatchEvent(new AddStep(stepOrSection, "before" /* AddStepPosition.BEFORE */));
            break;
        }
        case 'add-step-after': {
            const stepOrSection = __classPrivateFieldGet(this, _StepView_viewInput, "f").step || __classPrivateFieldGet(this, _StepView_viewInput, "f").section;
            if (!stepOrSection) {
                throw new Error('Expected step or section.');
            }
            this.dispatchEvent(new AddStep(stepOrSection, "after" /* AddStepPosition.AFTER */));
            break;
        }
        case 'remove-step': {
            const causingStep = __classPrivateFieldGet(this, _StepView_viewInput, "f").section?.causingStep;
            if (!__classPrivateFieldGet(this, _StepView_viewInput, "f").step && !causingStep) {
                throw new Error('Expected step.');
            }
            this.dispatchEvent(new RemoveStep(__classPrivateFieldGet(this, _StepView_viewInput, "f").step || causingStep));
            break;
        }
        case 'add-breakpoint': {
            if (!__classPrivateFieldGet(this, _StepView_viewInput, "f").step) {
                throw new Error('Expected step');
            }
            this.dispatchEvent(new AddBreakpointEvent(__classPrivateFieldGet(this, _StepView_viewInput, "f").stepIndex));
            break;
        }
        case 'remove-breakpoint': {
            if (!__classPrivateFieldGet(this, _StepView_viewInput, "f").step) {
                throw new Error('Expected step');
            }
            this.dispatchEvent(new RemoveBreakpointEvent(__classPrivateFieldGet(this, _StepView_viewInput, "f").stepIndex));
            break;
        }
        default: {
            const actionId = event.itemValue;
            if (!actionId.startsWith(COPY_ACTION_PREFIX)) {
                throw new Error('Unknown step action.');
            }
            const copyStep = __classPrivateFieldGet(this, _StepView_viewInput, "f").step || __classPrivateFieldGet(this, _StepView_viewInput, "f").section?.causingStep;
            if (!copyStep) {
                throw new Error('Step not found.');
            }
            const converterId = actionId.substring(COPY_ACTION_PREFIX.length);
            if (__classPrivateFieldGet(this, _StepView_viewInput, "f").recorderSettings) {
                __classPrivateFieldGet(this, _StepView_viewInput, "f").recorderSettings.preferredCopyFormat = converterId;
            }
            this.dispatchEvent(new CopyStepEvent(structuredClone(copyStep)));
        }
    }
}, _StepView_onBreakpointClick = function _StepView_onBreakpointClick() {
    if (__classPrivateFieldGet(this, _StepView_viewInput, "f").hasBreakpoint) {
        this.dispatchEvent(new RemoveBreakpointEvent(__classPrivateFieldGet(this, _StepView_viewInput, "f").stepIndex));
    }
    else {
        this.dispatchEvent(new AddBreakpointEvent(__classPrivateFieldGet(this, _StepView_viewInput, "f").stepIndex));
    }
    __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_render).call(this);
}, _StepView_populateStepContextMenu = function _StepView_populateStepContextMenu(contextMenu) {
    const actions = __classPrivateFieldGet(this, _StepView_getActions, "f").call(this);
    const copyActions = actions.filter(item => item.id.startsWith(COPY_ACTION_PREFIX));
    const otherActions = actions.filter(item => !item.id.startsWith(COPY_ACTION_PREFIX));
    for (const item of otherActions) {
        const section = contextMenu.section(item.group);
        section.appendItem(item.label, () => {
            __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_handleStepAction).call(this, new Menus.Menu.MenuItemSelectedEvent(item.id));
        }, { jslogContext: item.id });
    }
    const preferredCopyAction = copyActions.find(item => item.id === COPY_ACTION_PREFIX + __classPrivateFieldGet(this, _StepView_viewInput, "f").recorderSettings?.preferredCopyFormat);
    if (preferredCopyAction) {
        contextMenu.section('copy').appendItem(preferredCopyAction.label, () => {
            __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_handleStepAction).call(this, new Menus.Menu.MenuItemSelectedEvent(preferredCopyAction.id));
        }, { jslogContext: preferredCopyAction.id });
    }
    if (copyActions.length) {
        const copyAs = contextMenu.section('copy').appendSubMenuItem(i18nString(UIStrings.copyAs), false, 'copy');
        for (const item of copyActions) {
            if (item === preferredCopyAction) {
                continue;
            }
            copyAs.section(item.group).appendItem(item.label, () => {
                __classPrivateFieldGet(this, _StepView_instances, "m", _StepView_handleStepAction).call(this, new Menus.Menu.MenuItemSelectedEvent(item.id));
            }, { jslogContext: item.id });
        }
    }
}, _StepView_render = function _StepView_render() {
    const output = {};
    __classPrivateFieldGet(this, _StepView_view, "f").call(this, __classPrivateFieldGet(this, _StepView_viewInput, "f"), output, __classPrivateFieldGet(this, _StepView_shadow, "f"));
};
customElements.define('devtools-step-view', StepView);
//# sourceMappingURL=StepView.js.map