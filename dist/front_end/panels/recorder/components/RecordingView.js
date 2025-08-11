// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _RecordingView_instances, _RecordingView_recorderSettings, _RecordingView_builtInConverters, _RecordingView_isTitleInvalid, _RecordingView_selectedStep, _RecordingView_replaySettingsExpanded, _RecordingView_showCodeView, _RecordingView_code, _RecordingView_converterId, _RecordingView_sourceMap, _RecordingView_editorState, _RecordingView_onCopyBound, _RecordingView_view, _RecordingView_viewOutput, _RecordingView_getStepState, _RecordingView_getSectionState, _RecordingView_onStepHover, _RecordingView_onStepClick, _RecordingView_onWrapperClick, _RecordingView_onReplaySettingsKeydown, _RecordingView_onToggleReplaySettings, _RecordingView_onNetworkConditionsChange, _RecordingView_onTimeoutInput, _RecordingView_onTitleBlur, _RecordingView_onTitleInputKeyDown, _RecordingView_onEditTitleButtonClick, _RecordingView_onSelectMenuLabelClick, _RecordingView_copyCurrentSelection, _RecordingView_onCopyStepEvent, _RecordingView_onCopy, _RecordingView_handleMeasurePerformanceClickEvent, _RecordingView_convertToCode, _RecordingView_highlightCodeForStep, _RecordingView_onCodeFormatChange;
import '../../../ui/components/icon_button/icon_button.js';
import './ExtensionView.js';
import './ControlButton.js';
import './ReplaySection.js';
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as CodeMirror from '../../../third_party/codemirror.next/codemirror.next.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as CodeHighlighter from '../../../ui/components/code_highlighter/code_highlighter.js';
import * as Dialogs from '../../../ui/components/dialogs/dialogs.js';
import * as Input from '../../../ui/components/input/input.js';
import * as TextEditor from '../../../ui/components/text_editor/text_editor.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Models from '../models/models.js';
import recordingViewStyles from './recordingView.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Depicts that the recording was done on a mobile device (e.g., a smartphone or tablet).
     */
    mobile: 'Mobile',
    /**
     * @description Depicts that the recording was done on a desktop device (e.g., on a PC or laptop).
     */
    desktop: 'Desktop',
    /**
     * @description Network latency in milliseconds.
     * @example {10} value
     */
    latency: 'Latency: {value} ms',
    /**
     * @description Upload speed.
     * @example {42 kB} value
     */
    upload: 'Upload: {value}',
    /**
     * @description Download speed.
     * @example {8 kB} value
     */
    download: 'Download: {value}',
    /**
     * @description Title of the button to edit replay settings.
     */
    editReplaySettings: 'Edit replay settings',
    /**
     * @description Title of the section that contains replay settings.
     */
    replaySettings: 'Replay settings',
    /**
     * @description The string is shown when a default value is used for some replay settings.
     */
    default: 'Default',
    /**
     * @description The title of the section with environment settings.
     */
    environment: 'Environment',
    /**
     * @description The title of the screenshot image that is shown for every section in the recordign view.
     */
    screenshotForSection: 'Screenshot for this section',
    /**
     * @description The title of the button that edits the current recording's title.
     */
    editTitle: 'Edit title',
    /**
     * @description The error for when the title is missing.
     */
    requiredTitleError: 'Title is required',
    /**
     * @description The status text that is shown while the recording is ongoing.
     */
    recording: 'Recording…',
    /**
     * @description The title of the button to end the current recording.
     */
    endRecording: 'End recording',
    /**
     * @description The title of the button while the recording is being ended.
     */
    recordingIsBeingStopped: 'Stopping recording…',
    /**
     * @description The text that describes a timeout setting of {value} milliseconds.
     * @example {1000} value
     */
    timeout: 'Timeout: {value} ms',
    /**
     * @description The label for the input that allows entering network throttling configuration.
     */
    network: 'Network',
    /**
     * @description The label for the input that allows entering timeout (a number in ms) configuration.
     */
    timeoutLabel: 'Timeout',
    /**
     * @description The text in a tooltip for the timeout input that explains what timeout settings do.
     */
    timeoutExplanation: 'The timeout setting (in milliseconds) applies to every action when replaying the recording. For example, if a DOM element identified by a CSS selector does not appear on the page within the specified timeout, the replay fails with an error.',
    /**
     * @description The label for the button that cancels replaying.
     */
    cancelReplay: 'Cancel replay',
    /**
     * @description Button title that shows the code view when clicked.
     */
    showCode: 'Show code',
    /**
     * @description Button title that hides the code view when clicked.
     */
    hideCode: 'Hide code',
    /**
     * @description Button title that adds an assertion to the step editor.
     */
    addAssertion: 'Add assertion',
    /**
     * @description The title of the button that open current recording in Performance panel.
     */
    performancePanel: 'Performance panel',
};
const str_ = i18n.i18n.registerUIStrings('panels/recorder/components/RecordingView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var TargetPanel;
(function (TargetPanel) {
    TargetPanel["PERFORMANCE_PANEL"] = "timeline";
    TargetPanel["DEFAULT"] = "chrome-recorder";
})(TargetPanel || (TargetPanel = {}));
const networkConditionPresets = [
    SDK.NetworkManager.NoThrottlingConditions,
    SDK.NetworkManager.OfflineConditions,
    SDK.NetworkManager.Slow3GConditions,
    SDK.NetworkManager.Slow4GConditions,
    SDK.NetworkManager.Fast4GConditions,
];
function converterIdToFlowMetric(converterId) {
    switch (converterId) {
        case "puppeteer" /* Models.ConverterIds.ConverterIds.PUPPETEER */:
        case "puppeteer-firefox" /* Models.ConverterIds.ConverterIds.PUPPETEER_FIREFOX */:
            return 1 /* Host.UserMetrics.RecordingCopiedToClipboard.COPIED_RECORDING_WITH_PUPPETEER */;
        case "json" /* Models.ConverterIds.ConverterIds.JSON */:
            return 2 /* Host.UserMetrics.RecordingCopiedToClipboard.COPIED_RECORDING_WITH_JSON */;
        case "@puppeteer/replay" /* Models.ConverterIds.ConverterIds.REPLAY */:
            return 3 /* Host.UserMetrics.RecordingCopiedToClipboard.COPIED_RECORDING_WITH_REPLAY */;
        default:
            return 4 /* Host.UserMetrics.RecordingCopiedToClipboard.COPIED_RECORDING_WITH_EXTENSION */;
    }
}
function converterIdToStepMetric(converterId) {
    switch (converterId) {
        case "puppeteer" /* Models.ConverterIds.ConverterIds.PUPPETEER */:
        case "puppeteer-firefox" /* Models.ConverterIds.ConverterIds.PUPPETEER_FIREFOX */:
            return 5 /* Host.UserMetrics.RecordingCopiedToClipboard.COPIED_STEP_WITH_PUPPETEER */;
        case "json" /* Models.ConverterIds.ConverterIds.JSON */:
            return 6 /* Host.UserMetrics.RecordingCopiedToClipboard.COPIED_STEP_WITH_JSON */;
        case "@puppeteer/replay" /* Models.ConverterIds.ConverterIds.REPLAY */:
            return 7 /* Host.UserMetrics.RecordingCopiedToClipboard.COPIED_STEP_WITH_REPLAY */;
        default:
            return 8 /* Host.UserMetrics.RecordingCopiedToClipboard.COPIED_STEP_WITH_EXTENSION */;
    }
}
function renderSettings({ settings, replaySettingsExpanded, onSelectMenuLabelClick, onNetworkConditionsChange, onTimeoutInput, isRecording, replayState, onReplaySettingsKeydown, onToggleReplaySettings }) {
    if (!settings) {
        return html ``;
    }
    const environmentFragments = [];
    if (settings.viewportSettings) {
        // clang-format off
        environmentFragments.push(html `<div>${settings.viewportSettings.isMobile
            ? i18nString(UIStrings.mobile)
            : i18nString(UIStrings.desktop)}</div>`);
        environmentFragments.push(html `<div class="separator"></div>`);
        environmentFragments.push(html `<div>${settings.viewportSettings.width}×${settings.viewportSettings.height} px</div>`);
        // clang-format on
    }
    const replaySettingsFragments = [];
    if (!replaySettingsExpanded) {
        if (settings.networkConditionsSettings) {
            if (settings.networkConditionsSettings.title) {
                // clang-format off
                replaySettingsFragments.push(html `<div>${settings.networkConditionsSettings.title}</div>`);
                // clang-format on
            }
            else {
                // clang-format off
                replaySettingsFragments.push(html `<div>
          ${i18nString(UIStrings.download, {
                    value: i18n.ByteUtilities.bytesToString(settings.networkConditionsSettings.download),
                })},
          ${i18nString(UIStrings.upload, {
                    value: i18n.ByteUtilities.bytesToString(settings.networkConditionsSettings.upload),
                })},
          ${i18nString(UIStrings.latency, {
                    value: settings.networkConditionsSettings.latency,
                })}
        </div>`);
                // clang-format on
            }
        }
        else {
            // clang-format off
            replaySettingsFragments.push(html `<div>${SDK.NetworkManager.NoThrottlingConditions.title instanceof Function
                ? SDK.NetworkManager.NoThrottlingConditions.title()
                : SDK.NetworkManager.NoThrottlingConditions.title}</div>`);
            // clang-format on
        }
        // clang-format off
        replaySettingsFragments.push(html `<div class="separator"></div>`);
        replaySettingsFragments.push(html `<div>${i18nString(UIStrings.timeout, {
            value: settings.timeout || Models.RecordingPlayer.defaultTimeout,
        })}</div>`);
        // clang-format on
    }
    else {
        // clang-format off
        const selectedOption = settings.networkConditionsSettings?.i18nTitleKey ||
            SDK.NetworkManager.NoThrottlingConditions.i18nTitleKey;
        const selectedOptionTitle = networkConditionPresets.find(preset => preset.i18nTitleKey === selectedOption);
        let menuButtonTitle = '';
        if (selectedOptionTitle) {
            menuButtonTitle =
                selectedOptionTitle.title instanceof Function
                    ? selectedOptionTitle.title()
                    : selectedOptionTitle.title;
        }
        replaySettingsFragments.push(html `<div class="editable-setting">
      <label class="wrapping-label" @click=${onSelectMenuLabelClick}>
        ${i18nString(UIStrings.network)}
        <select
            title=${menuButtonTitle}
            jslog=${VisualLogging.dropDown('network-conditions').track({ change: true })}
            @change=${onNetworkConditionsChange}>
      ${networkConditionPresets.map(condition => html `
        <option jslog=${VisualLogging.item(Platform.StringUtilities.toKebabCase(condition.i18nTitleKey || ''))}
                value=${condition.i18nTitleKey || ''} ?selected=${selectedOption === condition.i18nTitleKey}>
                ${condition.title instanceof Function
            ? condition.title()
            : condition.title}
        </option>`)}
    </select>
      </label>
    </div>`);
        replaySettingsFragments.push(html `<div class="editable-setting">
      <label class="wrapping-label" title=${i18nString(UIStrings.timeoutExplanation)}>
        ${i18nString(UIStrings.timeoutLabel)}
        <input
          @input=${onTimeoutInput}
          required
          min=${Models.SchemaUtils.minTimeout}
          max=${Models.SchemaUtils.maxTimeout}
          value=${settings.timeout || Models.RecordingPlayer.defaultTimeout}
          jslog=${VisualLogging.textField('timeout').track({ change: true })}
          class="devtools-text-input"
          type="number">
      </label>
    </div>`);
        // clang-format on
    }
    const isEditable = !isRecording && !replayState.isPlaying;
    const replaySettingsButtonClassMap = {
        'settings-title': true,
        expanded: replaySettingsExpanded,
    };
    const replaySettingsClassMap = {
        expanded: replaySettingsExpanded,
        settings: true,
    };
    // clang-format off
    return html `
    <div class="settings-row">
      <div class="settings-container">
        <div
          class=${Lit.Directives.classMap(replaySettingsButtonClassMap)}
          @keydown=${isEditable && onReplaySettingsKeydown}
          @click=${isEditable && onToggleReplaySettings}
          tabindex="0"
          role="button"
          jslog=${VisualLogging.action('replay-settings').track({ click: true })}
          aria-label=${i18nString(UIStrings.editReplaySettings)}>
          <span>${i18nString(UIStrings.replaySettings)}</span>
          ${isEditable
        ? html `<devtools-icon
                  class="chevron"
                  name="triangle-down">
                </devtools-icon>`
        : ''}
        </div>
        <div class=${Lit.Directives.classMap(replaySettingsClassMap)}>
          ${replaySettingsFragments.length
        ? replaySettingsFragments
        : html `<div>${i18nString(UIStrings.default)}</div>`}
        </div>
      </div>
      <div class="settings-container">
        <div class="settings-title">${i18nString(UIStrings.environment)}</div>
        <div class="settings">
          ${environmentFragments.length
        ? environmentFragments
        : html `<div>${i18nString(UIStrings.default)}</div>`}
        </div>
      </div>
    </div>
  `;
    // clang-format on
}
function renderTimelineArea(input, output) {
    if (input.extensionDescriptor) {
        // clang-format off
        return html `
        <devtools-recorder-extension-view .descriptor=${input.extensionDescriptor}>
        </devtools-recorder-extension-view>
      `;
        // clang-format on
    }
    // clang-format off
    /* eslint-disable rulesdir/no-deprecated-component-usages */
    return html `
        <devtools-split-view
          direction="auto"
          sidebar-position="second"
          sidebar-initial-size="300"
          sidebar-visibility=${input.showCodeView ? '' : 'hidden'}
        >
          <div slot="main">
            ${renderSections(input)}
          </div>
          <div slot="sidebar" jslog=${VisualLogging.pane('source-code').track({ resize: true })}>
            ${input.showCodeView ? html `
            <div class="section-toolbar" jslog=${VisualLogging.toolbar()}>
              <devtools-select-menu
                @selectmenuselected=${input.onCodeFormatChange}
                .showDivider=${true}
                .showArrow=${true}
                .sideButton=${false}
                .showSelectedItem=${true}
                .position=${"bottom" /* Dialogs.Dialog.DialogVerticalPosition.BOTTOM */}
                .buttonTitle=${input.converterName || ''}
                .jslogContext=${'code-format'}
              >
                ${input.builtInConverters.map(converter => {
        return html `<devtools-menu-item
                    .value=${converter.getId()}
                    .selected=${input.converterId === converter.getId()}
                    jslog=${VisualLogging.action().track({ click: true }).context(`converter-${Platform.StringUtilities.toKebabCase(converter.getId())}`)}
                  >
                    ${converter.getFormatName()}
                  </devtools-menu-item>`;
    })}
                ${input.extensionConverters.map(converter => {
        return html `<devtools-menu-item
                    .value=${converter.getId()}
                    .selected=${input.converterId === converter.getId()}
                    jslog=${VisualLogging.action().track({ click: true }).context('converter-extension')}
                  >
                    ${converter.getFormatName()}
                  </devtools-menu-item>`;
    })}
              </devtools-select-menu>
              <devtools-button
                title=${Models.Tooltip.getTooltipForActions(i18nString(UIStrings.hideCode), "chrome-recorder.toggle-code-view" /* Actions.RecorderActions.TOGGLE_CODE_VIEW */)}
                .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        iconName: 'cross',
    }}
                @click=${input.showCodeToggle}
                jslog=${VisualLogging.close().track({ click: true })}
              ></devtools-button>
            </div>
            ${renderTextEditor(input, output)}`
        : Lit.nothing}
          </div>
        </devtools-split-view>
      `;
    /* eslint-enable rulesdir/no-deprecated-component-usages */
    // clang-format on
}
function renderTextEditor(input, output) {
    if (!input.editorState) {
        throw new Error('Unexpected: trying to render the text editor without editorState');
    }
    // clang-format off
    return html `
    <div class="text-editor" jslog=${VisualLogging.textField().track({ change: true })}>
      <devtools-text-editor .state=${input.editorState} ${Lit.Directives.ref((editor) => {
        if (!editor || !(editor instanceof TextEditor.TextEditor.TextEditor)) {
            return;
        }
        output.highlightLinesInEditor = (line, length, scroll = false) => {
            const cm = editor.editor;
            let selection = editor.createSelection({ lineNumber: line + length, columnNumber: 0 }, { lineNumber: line, columnNumber: 0 });
            const lastLine = editor.state.doc.lineAt(selection.main.anchor);
            selection = editor.createSelection({ lineNumber: line + length - 1, columnNumber: lastLine.length + 1 }, { lineNumber: line, columnNumber: 0 });
            cm.dispatch({
                selection,
                effects: scroll ?
                    [
                        CodeMirror.EditorView.scrollIntoView(selection.main, {
                            y: 'nearest',
                        }),
                    ] :
                    undefined,
            });
        };
    })}></devtools-text-editor>
    </div>
  `;
    // clang-format on
}
function renderScreenshot(section) {
    if (!section.screenshot) {
        return null;
    }
    // clang-format off
    return html `
      <img class="screenshot" src=${section.screenshot} alt=${i18nString(UIStrings.screenshotForSection)} />
    `;
    // clang-format on
}
function renderReplayOrAbortButton(input) {
    if (input.replayState.isPlaying) {
        return html `
        <devtools-button .jslogContext=${'abort-replay'} @click=${input.onAbortReplay} .iconName=${'pause'} .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}>
          ${i18nString(UIStrings.cancelReplay)}
        </devtools-button>`;
    }
    if (!input.recorderSettings) {
        return Lit.nothing;
    }
    // clang-format off
    return html `<devtools-replay-section
        .data=${{
        settings: input.recorderSettings,
        replayExtensions: input.replayExtensions,
    }}
        .disabled=${input.replayState.isPlaying}
        @startreplay=${input.onTogglePlaying}
        >
      </devtools-replay-section>`;
    // clang-format on
}
function renderSections(input) {
    // clang-format off
    return html `
      <div class="sections">
      ${!input.showCodeView
        ? html `<div class="section-toolbar">
        <devtools-button
          @click=${input.showCodeToggle}
          class="show-code"
          .data=${{
            variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
            title: Models.Tooltip.getTooltipForActions(i18nString(UIStrings.showCode), "chrome-recorder.toggle-code-view" /* Actions.RecorderActions.TOGGLE_CODE_VIEW */),
        }}
          jslog=${VisualLogging.toggleSubpane("chrome-recorder.toggle-code-view" /* Actions.RecorderActions.TOGGLE_CODE_VIEW */).track({ click: true })}
        >
          ${i18nString(UIStrings.showCode)}
        </devtools-button>
      </div>`
        : ''}
      ${input.sections.map((section, i) => html `
            <div class="section">
              <div class="screenshot-wrapper">
                ${renderScreenshot(section)}
              </div>
              <div class="content">
                <div class="steps">
                  <devtools-step-view
                    @click=${input.onStepClick}
                    @mouseover=${input.onStepHover}
                    .data=${{
        section,
        state: input.getSectionState(section),
        isStartOfGroup: true,
        isEndOfGroup: section.steps.length === 0,
        isFirstSection: i === 0,
        isLastSection: i === input.sections.length - 1 &&
            section.steps.length === 0,
        isSelected: input.selectedStep === (section.causingStep || null),
        sectionIndex: i,
        isRecording: input.isRecording,
        isPlaying: input.replayState.isPlaying,
        error: input.getSectionState(section) === "error" /* State.ERROR */
            ? input.currentError
            : undefined,
        hasBreakpoint: false,
        removable: input.recording.steps.length > 1 && section.causingStep,
    }}
                  >
                  </devtools-step-view>
                  ${section.steps.map(step => {
        const stepIndex = input.recording.steps.indexOf(step);
        return html `
                      <devtools-step-view
                      @click=${input.onStepClick}
                      @mouseover=${input.onStepHover}
                      @copystep=${input.onCopyStep}
                      .data=${{
            step,
            state: input.getStepState(step),
            error: input.currentStep === step ? input.currentError : undefined,
            isFirstSection: false,
            isLastSection: i === input.sections.length - 1 && input.recording.steps[input.recording.steps.length - 1] === step,
            isStartOfGroup: false,
            isEndOfGroup: section.steps[section.steps.length - 1] === step,
            stepIndex,
            hasBreakpoint: input.breakpointIndexes.has(stepIndex),
            sectionIndex: -1,
            isRecording: input.isRecording,
            isPlaying: input.replayState.isPlaying,
            removable: input.recording.steps.length > 1,
            builtInConverters: input.builtInConverters,
            extensionConverters: input.extensionConverters,
            isSelected: input.selectedStep === step,
            recorderSettings: input.recorderSettings,
        }}
                      jslog=${VisualLogging.section('step').track({ click: true })}
                      ></devtools-step-view>
                    `;
    })}
                  ${!input.recordingTogglingInProgress && input.isRecording && i === input.sections.length - 1 ? html `<devtools-button
                    class="step add-assertion-button"
                    .data=${{
        variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
        title: i18nString(UIStrings.addAssertion),
        jslogContext: 'add-assertion',
    }}
                    @click=${input.onAddAssertion}
                  >${i18nString(UIStrings.addAssertion)}</devtools-button>` : undefined}
                  ${input.isRecording && i === input.sections.length - 1
        ? html `<div class="step recording">${i18nString(UIStrings.recording)}</div>`
        : null}
                </div>
              </div>
            </div>
      `)}
      </div>
    `;
    // clang-format on
}
function renderHeader(input) {
    if (!input.recording) {
        return Lit.nothing;
    }
    const { title } = input.recording;
    const isTitleEditable = !input.replayState.isPlaying && !input.isRecording;
    // clang-format off
    return html `
    <div class="header">
      <div class="header-title-wrapper">
        <div class="header-title">
          <input @blur=${input.onTitleBlur}
                @keydown=${input.onTitleInputKeyDown}
                id="title-input"
                jslog=${VisualLogging.value('title').track({ change: true })}
                class=${Lit.Directives.classMap({
        'has-error': input.isTitleInvalid,
        disabled: !isTitleEditable,
    })}
                .value=${Lit.Directives.live(title)}
                .disabled=${!isTitleEditable}
                >
          <div class="title-button-bar">
            <devtools-button
              @click=${input.onEditTitleButtonClick}
              .data=${{
        disabled: !isTitleEditable,
        variant: "toolbar" /* Buttons.Button.Variant.TOOLBAR */,
        iconName: 'edit',
        title: i18nString(UIStrings.editTitle),
        jslogContext: 'edit-title',
    }}
            ></devtools-button>
          </div>
        </div>
        ${input.isTitleInvalid
        ? html `<div class="title-input-error-text">
          ${i18nString(UIStrings.requiredTitleError)}
        </div>`
        : Lit.nothing}
      </div>
      ${!input.isRecording && input.replayAllowed
        ? html `<div class="actions">
              <devtools-button
                @click=${input.onMeasurePerformanceClick}
                .data=${{
            disabled: input.replayState.isPlaying,
            variant: "outlined" /* Buttons.Button.Variant.OUTLINED */,
            iconName: 'performance',
            title: i18nString(UIStrings.performancePanel),
            jslogContext: 'measure-performance',
        }}
              >
                ${i18nString(UIStrings.performancePanel)}
              </devtools-button>
              <div class="separator"></div>
              ${renderReplayOrAbortButton(input)}
            </div>`
        : Lit.nothing}
    </div>`;
    // clang-format on
}
export const DEFAULT_VIEW = (input, output, target) => {
    const classNames = {
        wrapper: true,
        'is-recording': input.isRecording,
        'is-playing': input.replayState.isPlaying,
        'was-successful': input.lastReplayResult === "Success" /* Models.RecordingPlayer.ReplayResult.SUCCESS */,
        'was-failure': input.lastReplayResult === "Failure" /* Models.RecordingPlayer.ReplayResult.FAILURE */,
    };
    const footerButtonTitle = input.recordingTogglingInProgress ? i18nString(UIStrings.recordingIsBeingStopped) :
        i18nString(UIStrings.endRecording);
    // clang-format off
    Lit.render(html `
    <style>${UI.inspectorCommonStyles}</style>
    <style>${recordingViewStyles}</style>
    <style>${Input.textInputStyles}</style>
    <div @click=${input.onWrapperClick} class=${Lit.Directives.classMap(classNames)}>
      <div class="recording-view main">
        ${renderHeader(input)}
        ${input.extensionDescriptor
        ? html `
            <devtools-recorder-extension-view .descriptor=${input.extensionDescriptor}></devtools-recorder-extension-view>` : html `
          ${renderSettings(input)}
          ${renderTimelineArea(input, output)}
        `}
        ${input.isRecording ? html `<div class="footer">
          <div class="controls">
            <devtools-control-button
              jslog=${VisualLogging.toggle('toggle-recording').track({ click: true })}
              @click=${input.onRecordingFinished}
              .disabled=${input.recordingTogglingInProgress}
              .shape=${'square'}
              .label=${footerButtonTitle}
              title=${Models.Tooltip.getTooltipForActions(footerButtonTitle, "chrome-recorder.start-recording" /* Actions.RecorderActions.START_RECORDING */)}
            >
            </devtools-control-button>
          </div>
        </div>` : Lit.nothing}
      </div>
    </div>
  `, target, { host: input });
    // clang-format on
};
export class RecordingView extends UI.Widget.Widget {
    get recorderSettings() {
        return __classPrivateFieldGet(this, _RecordingView_recorderSettings, "f");
    }
    set recorderSettings(settings) {
        __classPrivateFieldSet(this, _RecordingView_recorderSettings, settings, "f");
        __classPrivateFieldSet(this, _RecordingView_converterId, this.recorderSettings?.preferredCopyFormat ?? __classPrivateFieldGet(this, _RecordingView_builtInConverters, "f")[0]?.getId(), "f");
        void __classPrivateFieldGet(this, _RecordingView_convertToCode, "f").call(this);
    }
    get builtInConverters() {
        return __classPrivateFieldGet(this, _RecordingView_builtInConverters, "f");
    }
    set builtInConverters(converters) {
        __classPrivateFieldSet(this, _RecordingView_builtInConverters, converters, "f");
        __classPrivateFieldSet(this, _RecordingView_converterId, this.recorderSettings?.preferredCopyFormat ?? __classPrivateFieldGet(this, _RecordingView_builtInConverters, "f")[0]?.getId(), "f");
        void __classPrivateFieldGet(this, _RecordingView_convertToCode, "f").call(this);
    }
    constructor(element, view) {
        super(true, false, element);
        _RecordingView_instances.add(this);
        this.replayState = { isPlaying: false, isPausedOnBreakpoint: false };
        this.isRecording = false;
        this.recordingTogglingInProgress = false;
        this.recording = {
            title: '',
            steps: [],
        };
        this.sections = [];
        this.replayAllowed = false;
        this.breakpointIndexes = new Set();
        this.extensionConverters = [];
        _RecordingView_recorderSettings.set(this, void 0);
        _RecordingView_builtInConverters.set(this, []);
        _RecordingView_isTitleInvalid.set(this, false);
        _RecordingView_selectedStep.set(this, void 0);
        _RecordingView_replaySettingsExpanded.set(this, false);
        _RecordingView_showCodeView.set(this, false);
        _RecordingView_code.set(this, '');
        _RecordingView_converterId.set(this, '');
        _RecordingView_sourceMap.set(this, void 0);
        _RecordingView_editorState.set(this, void 0);
        _RecordingView_onCopyBound.set(this, __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_onCopy).bind(this));
        _RecordingView_view.set(this, void 0);
        _RecordingView_viewOutput.set(this, {});
        _RecordingView_onStepHover.set(this, (event) => {
            const stepView = event.target;
            const step = stepView.step || stepView.section?.causingStep;
            if (!step || __classPrivateFieldGet(this, _RecordingView_selectedStep, "f")) {
                return;
            }
            __classPrivateFieldGet(this, _RecordingView_highlightCodeForStep, "f").call(this, step);
        });
        _RecordingView_onTitleBlur.set(this, (event) => {
            const target = event.target;
            const title = target.value.trim();
            if (!title) {
                __classPrivateFieldSet(this, _RecordingView_isTitleInvalid, true, "f");
                this.performUpdate();
                return;
            }
            this.titleChanged?.(title);
        });
        _RecordingView_onTitleInputKeyDown.set(this, (event) => {
            switch (event.code) {
                case 'Escape':
                case 'Enter':
                    event.target.blur();
                    event.stopPropagation();
                    break;
            }
        });
        _RecordingView_onEditTitleButtonClick.set(this, () => {
            const input = this.contentElement.querySelector('#title-input');
            if (!input) {
                throw new Error('Missing #title-input');
            }
            input.focus();
        });
        _RecordingView_onSelectMenuLabelClick.set(this, (event) => {
            const target = event.target;
            if (target.matches('.wrapping-label')) {
                target.querySelector('devtools-select-menu')?.click();
            }
        });
        this.showCodeToggle = () => {
            __classPrivateFieldSet(this, _RecordingView_showCodeView, !__classPrivateFieldGet(this, _RecordingView_showCodeView, "f"), "f");
            Host.userMetrics.recordingCodeToggled(__classPrivateFieldGet(this, _RecordingView_showCodeView, "f") ? 1 /* Host.UserMetrics.RecordingCodeToggled.CODE_SHOWN */ :
                2 /* Host.UserMetrics.RecordingCodeToggled.CODE_HIDDEN */);
            void __classPrivateFieldGet(this, _RecordingView_convertToCode, "f").call(this);
        };
        _RecordingView_convertToCode.set(this, async () => {
            if (!this.recording) {
                return;
            }
            const converter = [
                ...(this.builtInConverters || []),
                ...(this.extensionConverters || []),
            ].find(converter => converter.getId() === __classPrivateFieldGet(this, _RecordingView_converterId, "f")) ??
                this.builtInConverters[0];
            if (!converter) {
                return;
            }
            const [code, sourceMap] = await converter.stringify(this.recording);
            __classPrivateFieldSet(this, _RecordingView_code, code, "f");
            __classPrivateFieldSet(this, _RecordingView_sourceMap, sourceMap, "f");
            __classPrivateFieldGet(this, _RecordingView_sourceMap, "f")?.shift();
            const mediaType = converter.getMediaType();
            const languageSupport = mediaType ? await CodeHighlighter.CodeHighlighter.languageFromMIME(mediaType) : null;
            __classPrivateFieldSet(this, _RecordingView_editorState, CodeMirror.EditorState.create({
                doc: __classPrivateFieldGet(this, _RecordingView_code, "f"),
                extensions: [
                    TextEditor.Config.baseConfiguration(__classPrivateFieldGet(this, _RecordingView_code, "f")),
                    CodeMirror.EditorState.readOnly.of(true),
                    CodeMirror.EditorView.lineWrapping,
                    languageSupport ? languageSupport : [],
                ],
            }), "f");
            this.performUpdate();
            // Used by tests.
            this.contentElement.dispatchEvent(new Event('code-generated'));
        });
        _RecordingView_highlightCodeForStep.set(this, (step, scroll = false) => {
            if (!__classPrivateFieldGet(this, _RecordingView_sourceMap, "f")) {
                return;
            }
            const stepIndex = this.recording.steps.indexOf(step);
            if (stepIndex === -1) {
                return;
            }
            const line = __classPrivateFieldGet(this, _RecordingView_sourceMap, "f")[stepIndex * 2];
            const length = __classPrivateFieldGet(this, _RecordingView_sourceMap, "f")[stepIndex * 2 + 1];
            __classPrivateFieldGet(this, _RecordingView_viewOutput, "f").highlightLinesInEditor?.(line, length, scroll);
        });
        _RecordingView_onCodeFormatChange.set(this, (event) => {
            __classPrivateFieldSet(this, _RecordingView_converterId, event.itemValue, "f");
            if (this.recorderSettings) {
                this.recorderSettings.preferredCopyFormat = event.itemValue;
            }
            void __classPrivateFieldGet(this, _RecordingView_convertToCode, "f").call(this);
        });
        __classPrivateFieldSet(this, _RecordingView_view, view || DEFAULT_VIEW, "f");
    }
    performUpdate() {
        const converter = [
            ...(this.builtInConverters || []),
            ...(this.extensionConverters || []),
        ].find(converter => converter.getId() === __classPrivateFieldGet(this, _RecordingView_converterId, "f")) ??
            this.builtInConverters[0];
        __classPrivateFieldGet(this, _RecordingView_view, "f").call(this, {
            breakpointIndexes: this.breakpointIndexes,
            builtInConverters: this.builtInConverters,
            converterId: __classPrivateFieldGet(this, _RecordingView_converterId, "f"),
            converterName: converter?.getFormatName(),
            currentError: this.currentError ?? null,
            currentStep: this.currentStep ?? null,
            editorState: __classPrivateFieldGet(this, _RecordingView_editorState, "f") ?? null,
            extensionConverters: this.extensionConverters,
            extensionDescriptor: this.extensionDescriptor,
            isRecording: this.isRecording,
            isTitleInvalid: __classPrivateFieldGet(this, _RecordingView_isTitleInvalid, "f"),
            lastReplayResult: this.lastReplayResult ?? null,
            recorderSettings: __classPrivateFieldGet(this, _RecordingView_recorderSettings, "f") ?? null,
            recording: this.recording,
            recordingTogglingInProgress: this.recordingTogglingInProgress,
            replayAllowed: this.replayAllowed,
            replayExtensions: this.replayExtensions ?? [],
            replaySettingsExpanded: __classPrivateFieldGet(this, _RecordingView_replaySettingsExpanded, "f"),
            replayState: this.replayState,
            sections: this.sections,
            selectedStep: __classPrivateFieldGet(this, _RecordingView_selectedStep, "f") ?? null,
            settings: this.settings ?? null,
            showCodeView: __classPrivateFieldGet(this, _RecordingView_showCodeView, "f"),
            onAddAssertion: () => {
                this.addAssertion?.();
            },
            onRecordingFinished: () => {
                this.recordingFinished?.();
            },
            getSectionState: __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_getSectionState).bind(this),
            getStepState: __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_getStepState).bind(this),
            onAbortReplay: () => {
                this.abortReplay?.();
            },
            onMeasurePerformanceClick: __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_handleMeasurePerformanceClickEvent).bind(this),
            onTogglePlaying: (event) => {
                this.playRecording?.({
                    targetPanel: "chrome-recorder" /* TargetPanel.DEFAULT */,
                    speed: event.speed,
                    extension: event.extension,
                });
            },
            onCodeFormatChange: __classPrivateFieldGet(this, _RecordingView_onCodeFormatChange, "f").bind(this),
            onCopyStep: __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_onCopyStepEvent).bind(this),
            onEditTitleButtonClick: __classPrivateFieldGet(this, _RecordingView_onEditTitleButtonClick, "f").bind(this),
            onNetworkConditionsChange: __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_onNetworkConditionsChange).bind(this),
            onReplaySettingsKeydown: __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_onReplaySettingsKeydown).bind(this),
            onSelectMenuLabelClick: __classPrivateFieldGet(this, _RecordingView_onSelectMenuLabelClick, "f").bind(this),
            onStepClick: __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_onStepClick).bind(this),
            onStepHover: __classPrivateFieldGet(this, _RecordingView_onStepHover, "f").bind(this),
            onTimeoutInput: __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_onTimeoutInput).bind(this),
            onTitleBlur: __classPrivateFieldGet(this, _RecordingView_onTitleBlur, "f").bind(this),
            onTitleInputKeyDown: __classPrivateFieldGet(this, _RecordingView_onTitleInputKeyDown, "f").bind(this),
            onToggleReplaySettings: __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_onToggleReplaySettings).bind(this),
            onWrapperClick: __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_onWrapperClick).bind(this),
            showCodeToggle: this.showCodeToggle.bind(this),
        }, __classPrivateFieldGet(this, _RecordingView_viewOutput, "f"), this.contentElement);
    }
    wasShown() {
        super.wasShown();
        document.addEventListener('copy', __classPrivateFieldGet(this, _RecordingView_onCopyBound, "f"));
        this.performUpdate();
    }
    willHide() {
        super.willHide();
        document.removeEventListener('copy', __classPrivateFieldGet(this, _RecordingView_onCopyBound, "f"));
    }
    scrollToBottom() {
        const wrapper = this.contentElement?.querySelector('.sections');
        if (!wrapper) {
            return;
        }
        wrapper.scrollTop = wrapper.scrollHeight;
    }
}
_RecordingView_recorderSettings = new WeakMap(), _RecordingView_builtInConverters = new WeakMap(), _RecordingView_isTitleInvalid = new WeakMap(), _RecordingView_selectedStep = new WeakMap(), _RecordingView_replaySettingsExpanded = new WeakMap(), _RecordingView_showCodeView = new WeakMap(), _RecordingView_code = new WeakMap(), _RecordingView_converterId = new WeakMap(), _RecordingView_sourceMap = new WeakMap(), _RecordingView_editorState = new WeakMap(), _RecordingView_onCopyBound = new WeakMap(), _RecordingView_view = new WeakMap(), _RecordingView_viewOutput = new WeakMap(), _RecordingView_onStepHover = new WeakMap(), _RecordingView_onTitleBlur = new WeakMap(), _RecordingView_onTitleInputKeyDown = new WeakMap(), _RecordingView_onEditTitleButtonClick = new WeakMap(), _RecordingView_onSelectMenuLabelClick = new WeakMap(), _RecordingView_convertToCode = new WeakMap(), _RecordingView_highlightCodeForStep = new WeakMap(), _RecordingView_onCodeFormatChange = new WeakMap(), _RecordingView_instances = new WeakSet(), _RecordingView_getStepState = function _RecordingView_getStepState(step) {
    if (!this.currentStep) {
        return "default" /* State.DEFAULT */;
    }
    if (step === this.currentStep) {
        if (this.currentError) {
            return "error" /* State.ERROR */;
        }
        if (!this.replayState?.isPlaying) {
            return "success" /* State.SUCCESS */;
        }
        if (this.replayState?.isPausedOnBreakpoint) {
            return "stopped" /* State.STOPPED */;
        }
        return "current" /* State.CURRENT */;
    }
    const currentIndex = this.recording.steps.indexOf(this.currentStep);
    if (currentIndex === -1) {
        return "default" /* State.DEFAULT */;
    }
    const index = this.recording.steps.indexOf(step);
    return index < currentIndex ? "success" /* State.SUCCESS */ : "outstanding" /* State.OUTSTANDING */;
}, _RecordingView_getSectionState = function _RecordingView_getSectionState(section) {
    const currentStep = this.currentStep;
    if (!currentStep) {
        return "default" /* State.DEFAULT */;
    }
    const currentSection = this.sections.find(section => section.steps.includes(currentStep));
    if (!currentSection) {
        if (this.currentError) {
            return "error" /* State.ERROR */;
        }
    }
    if (section === currentSection) {
        return "success" /* State.SUCCESS */;
    }
    const index = this.sections.indexOf(currentSection);
    const ownIndex = this.sections.indexOf(section);
    return index >= ownIndex ? "success" /* State.SUCCESS */ : "outstanding" /* State.OUTSTANDING */;
}, _RecordingView_onStepClick = function _RecordingView_onStepClick(event) {
    event.stopPropagation();
    const stepView = event.target;
    const selectedStep = stepView.step || stepView.section?.causingStep || null;
    if (__classPrivateFieldGet(this, _RecordingView_selectedStep, "f") === selectedStep) {
        return;
    }
    __classPrivateFieldSet(this, _RecordingView_selectedStep, selectedStep, "f");
    this.performUpdate();
    if (selectedStep) {
        __classPrivateFieldGet(this, _RecordingView_highlightCodeForStep, "f").call(this, selectedStep, /* scroll=*/ true);
    }
}, _RecordingView_onWrapperClick = function _RecordingView_onWrapperClick() {
    if (__classPrivateFieldGet(this, _RecordingView_selectedStep, "f") === undefined) {
        return;
    }
    __classPrivateFieldSet(this, _RecordingView_selectedStep, undefined, "f");
    this.performUpdate();
}, _RecordingView_onReplaySettingsKeydown = function _RecordingView_onReplaySettingsKeydown(event) {
    if (event.key !== 'Enter') {
        return;
    }
    event.preventDefault();
    __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_onToggleReplaySettings).call(this, event);
}, _RecordingView_onToggleReplaySettings = function _RecordingView_onToggleReplaySettings(event) {
    event.stopPropagation();
    __classPrivateFieldSet(this, _RecordingView_replaySettingsExpanded, !__classPrivateFieldGet(this, _RecordingView_replaySettingsExpanded, "f"), "f");
    this.performUpdate();
}, _RecordingView_onNetworkConditionsChange = function _RecordingView_onNetworkConditionsChange(event) {
    const throttlingMenu = event.target;
    if (throttlingMenu instanceof HTMLSelectElement) {
        const preset = networkConditionPresets.find(preset => preset.i18nTitleKey === throttlingMenu.value);
        this.networkConditionsChanged?.(preset?.i18nTitleKey === SDK.NetworkManager.NoThrottlingConditions.i18nTitleKey ? undefined : preset);
    }
}, _RecordingView_onTimeoutInput = function _RecordingView_onTimeoutInput(event) {
    const target = event.target;
    if (!target.checkValidity()) {
        target.reportValidity();
        return;
    }
    this.timeoutChanged?.(Number(target.value));
}, _RecordingView_copyCurrentSelection = async function _RecordingView_copyCurrentSelection(step) {
    let converter = [
        ...this.builtInConverters,
        ...this.extensionConverters,
    ]
        .find(converter => converter.getId() === this.recorderSettings?.preferredCopyFormat);
    if (!converter) {
        converter = this.builtInConverters[0];
    }
    if (!converter) {
        throw new Error('No default converter found');
    }
    let text = '';
    if (step) {
        text = await converter.stringifyStep(step);
    }
    else if (this.recording) {
        [text] = await converter.stringify(this.recording);
    }
    Host.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(text);
    const metric = step ? converterIdToStepMetric(converter.getId()) : converterIdToFlowMetric(converter.getId());
    Host.userMetrics.recordingCopiedToClipboard(metric);
}, _RecordingView_onCopyStepEvent = function _RecordingView_onCopyStepEvent(event) {
    event.stopPropagation();
    void __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_copyCurrentSelection).call(this, event.step);
}, _RecordingView_onCopy = async function _RecordingView_onCopy(event) {
    if (event.target !== document.body) {
        return;
    }
    event.preventDefault();
    await __classPrivateFieldGet(this, _RecordingView_instances, "m", _RecordingView_copyCurrentSelection).call(this, __classPrivateFieldGet(this, _RecordingView_selectedStep, "f"));
    Host.userMetrics.keyboardShortcutFired("chrome-recorder.copy-recording-or-step" /* Actions.RecorderActions.COPY_RECORDING_OR_STEP */);
}, _RecordingView_handleMeasurePerformanceClickEvent = function _RecordingView_handleMeasurePerformanceClickEvent(event) {
    event.stopPropagation();
    this.playRecording?.({
        targetPanel: "timeline" /* TargetPanel.PERFORMANCE_PANEL */,
        speed: "normal" /* PlayRecordingSpeed.NORMAL */,
    });
};
//# sourceMappingURL=RecordingView.js.map