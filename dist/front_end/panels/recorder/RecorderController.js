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
var _RecorderController_instances, _RecorderController_storage, _RecorderController_screenshotStorage, _RecorderController_replayAllowed, _RecorderController_replayState, _RecorderController_fileSelector, _RecorderController_exportMenuButton, _RecorderController_stepBreakpointIndexes, _RecorderController_builtInConverters, _RecorderController_recorderSettings, _RecorderController_shortcutHelper, _RecorderController_disableRecorderImportWarningSetting, _RecorderController_selfXssWarningDisabledSetting, _RecorderController_recordingView, _RecorderController_updateExtensions, _RecorderController_clearError, _RecorderController_importFile, _RecorderController_setCurrentRecording, _RecorderController_setCurrentPage, _RecorderController_buildSettings, _RecorderController_getMainTarget, _RecorderController_getSectionFromStep, _RecorderController_updateScreenshotsForSections, _RecorderController_onAbortReplay, _RecorderController_onPlayViaExtension, _RecorderController_onPlayRecording, _RecorderController_disableDeviceModeIfEnabled, _RecorderController_setTouchEmulationAllowed, _RecorderController_onSetRecording, _RecorderController_handleRecordingChanged, _RecorderController_handleStepAdded, _RecorderController_handleRecordingTitleChanged, _RecorderController_handleStepRemoved, _RecorderController_onNetworkConditionsChanged, _RecorderController_onTimeoutChanged, _RecorderController_onDeleteRecording, _RecorderController_onCreateNewRecording, _RecorderController_onRecordingStarted, _RecorderController_onRecordingFinished, _RecorderController_onRecordingCancelled, _RecorderController_onRecordingSelected, _RecorderController_onExportOptionSelected, _RecorderController_exportContent, _RecorderController_handleAddAssertionEvent, _RecorderController_acknowledgeImportNotice, _RecorderController_onImportRecording, _RecorderController_onPlayRecordingByName, _RecorderController_onAddBreakpoint, _RecorderController_onRemoveBreakpoint, _RecorderController_onExtensionViewClosed, _RecorderController_getShortcutsInfo, _RecorderController_renderCurrentPage, _RecorderController_renderAllRecordingsPage, _RecorderController_renderStartPage, _RecorderController_renderRecordingPage, _RecorderController_renderCreateRecordingPage, _RecorderController_getExportMenuButton, _RecorderController_onExportRecording, _RecorderController_onExportMenuClosed;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as Root from '../../core/root/root.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Bindings from '../../models/bindings/bindings.js';
import * as PublicExtensions from '../../models/extensions/extensions.js';
import * as PanelCommon from '../../panels/common/common.js';
import * as Emulation from '../../panels/emulation/emulation.js';
import * as Tracing from '../../services/tracing/tracing.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../ui/components/helpers/helpers.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as Components from './components/components.js';
import * as Converters from './converters/converters.js';
import * as Extensions from './extensions/extensions.js';
import * as Models from './models/models.js';
import recorderControllerStyles from './recorderController.css.js';
import * as Events from './RecorderEvents.js';
// TODO(crbug.com/391381439): Fully migrate off of Constructable Stylesheets.
const { html, Decorators, LitElement } = Lit;
const { customElement, state } = Decorators;
const UIStrings = {
    /**
     * @description The title of the button that leads to a page for creating a new recording.
     */
    createRecording: 'Create recording',
    /**
     * @description The title of the button that allows importing a recording.
     */
    importRecording: 'Import recording',
    /**
     * @description The title of the button that deletes the recording
     */
    deleteRecording: 'Delete recording',
    /**
     * @description The title of the select if user has no saved recordings
     */
    noRecordings: 'No recordings',
    /**
     * @description The title of the select option for one or more recording
     * number followed by this text - `1 recording(s)` or `4 recording(s)`
     */
    numberOfRecordings: 'recording(s)',
    /**
     * @description The title of the button that continues the replay
     */
    continueReplay: 'Continue',
    /**
     * @description The title of the button that executes only one step in the replay
     */
    stepOverReplay: 'Execute one step',
    /**
     * @description The title of the button that opens a menu with various options of exporting a recording to file.
     */
    exportRecording: 'Export recording',
    /**
     * @description The title of shortcut for starting and stopping recording.
     */
    startStopRecording: 'Start/Stop recording',
    /**
     * @description The title of shortcut for replaying recording.
     */
    replayRecording: 'Replay recording',
    /**
     * @description The title of shortcut for copying a recording or selected step.
     */
    copyShortcut: 'Copy recording or selected step',
    /**
     * @description The title of shortcut for toggling code view.
     */
    toggleCode: 'Toggle code view',
    /**
     * @description The title of the menu group in the export menu of the Recorder
     * panel that is followed by the list of built-in export formats.
     */
    export: 'Export',
    /**
     * @description The title of the menu group in the export menu of the Recorder
     * panel that is followed by the list of export formats available via browser
     * extensions.
     */
    exportViaExtensions: 'Export via extensions',
    /**
     * @description The title of the menu option that leads to a page that lists
     * all browsers extensions available for Recorder.
     */
    getExtensions: 'Get extensions…',
    /**
     * @description The button label that leads to the feedback form for Recorder.
     */
    sendFeedback: 'Send feedback',
    /**
     * @description The header of the start page in the Recorder panel.
     */
    header: 'Nothing recorded yet',
    /**
     * @description Text to explain the usage of the recorder panel.
     */
    recordingDescription: 'Use recordings to create automated end-to-end tests or performance traces.',
    /**
     * @description Link text to forward to a documentation page on the recorder.
     */
    learnMore: 'Learn more',
    /**
     *@description Headline of warning shown to users when users import a recording into DevTools Recorder.
     */
    doYouTrustThisCode: 'Do you trust this recording?',
    /**
     *@description Warning shown to users when imports code into DevTools Recorder.
     *@example {allow importing} PH1
     */
    doNotImport: 'Don\'t import recordings you do not understand or have not reviewed yourself into DevTools. This could allow attackers to steal your identity or take control of your computer. Please type \'\'{PH1}\'\' below to allow importing.',
    /**
     *@description Text a user needs to type in order to confirm that they
     *are aware of the danger of import code into the DevTools Recorder.
     */
    allowImporting: 'allow importing',
    /**
     *@description Input box placeholder which instructs the user to type 'allow importing' into the input box.
     *@example {allow importing} PH1
     */
    typeAllowImporting: 'Type \'\'{PH1}\'\'',
};
const str_ = i18n.i18n.registerUIStrings('panels/recorder/RecorderController.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const GET_EXTENSIONS_MENU_ITEM = 'get-extensions-link';
const GET_EXTENSIONS_URL = 'https://goo.gle/recorder-extension-list';
const RECORDER_EXPLANATION_URL = 'https://developer.chrome.com/docs/devtools/recorder';
const FEEDBACK_URL = 'https://goo.gle/recorder-feedback';
export var Pages;
(function (Pages) {
    Pages["START_PAGE"] = "StartPage";
    Pages["ALL_RECORDINGS_PAGE"] = "AllRecordingsPage";
    Pages["CREATE_RECORDING_PAGE"] = "CreateRecordingPage";
    Pages["RECORDING_PAGE"] = "RecordingPage";
})(Pages || (Pages = {}));
const CONVERTER_ID_TO_METRIC = {
    ["json" /* Models.ConverterIds.ConverterIds.JSON */]: 2 /* Host.UserMetrics.RecordingExported.TO_JSON */,
    ["@puppeteer/replay" /* Models.ConverterIds.ConverterIds.REPLAY */]: 3 /* Host.UserMetrics.RecordingExported.TO_PUPPETEER_REPLAY */,
    ["puppeteer" /* Models.ConverterIds.ConverterIds.PUPPETEER */]: 1 /* Host.UserMetrics.RecordingExported.TO_PUPPETEER */,
    ["puppeteer-firefox" /* Models.ConverterIds.ConverterIds.PUPPETEER_FIREFOX */]: 1 /* Host.UserMetrics.RecordingExported.TO_PUPPETEER */,
    ["lighthouse" /* Models.ConverterIds.ConverterIds.LIGHTHOUSE */]: 5 /* Host.UserMetrics.RecordingExported.TO_LIGHTHOUSE */,
};
let RecorderController = class RecorderController extends LitElement {
    constructor() {
        super();
        _RecorderController_instances.add(this);
        _RecorderController_storage.set(this, Models.RecordingStorage.RecordingStorage.instance());
        _RecorderController_screenshotStorage.set(this, Models.ScreenshotStorage.ScreenshotStorage.instance());
        // TODO: we keep the functionality to allow/disallow replay but right now it's not used.
        // It can be used to decide if we allow replay on a certain target for example.
        _RecorderController_replayAllowed.set(this, true);
        _RecorderController_replayState.set(this, { isPlaying: false, isPausedOnBreakpoint: false });
        _RecorderController_fileSelector.set(this, void 0);
        _RecorderController_exportMenuButton.set(this, void 0);
        _RecorderController_stepBreakpointIndexes.set(this, new Set());
        _RecorderController_builtInConverters.set(this, void 0);
        _RecorderController_recorderSettings.set(this, new Models.RecorderSettings.RecorderSettings());
        _RecorderController_shortcutHelper.set(this, new Models.RecorderShortcutHelper.RecorderShortcutHelper());
        _RecorderController_disableRecorderImportWarningSetting.set(this, Common.Settings.Settings.instance().createSetting('disable-recorder-import-warning', false, "Synced" /* Common.Settings.SettingStorageType.SYNCED */));
        _RecorderController_selfXssWarningDisabledSetting.set(this, Common.Settings.Settings.instance().createSetting('disable-self-xss-warning', false, "Synced" /* Common.Settings.SettingStorageType.SYNCED */));
        _RecorderController_recordingView.set(this, void 0);
        _RecorderController_onAddBreakpoint.set(this, (event) => {
            __classPrivateFieldSet(this, _RecorderController_stepBreakpointIndexes, structuredClone(__classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f")), "f");
            __classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f").add(event.index);
            this.recordingPlayer?.updateBreakpointIndexes(__classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f"));
            this.requestUpdate();
        });
        _RecorderController_onRemoveBreakpoint.set(this, (event) => {
            __classPrivateFieldSet(this, _RecorderController_stepBreakpointIndexes, structuredClone(__classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f")), "f");
            __classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f").delete(event.index);
            this.recordingPlayer?.updateBreakpointIndexes(__classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f"));
            this.requestUpdate();
        });
        _RecorderController_getExportMenuButton.set(this, () => {
            if (!__classPrivateFieldGet(this, _RecorderController_exportMenuButton, "f")) {
                throw new Error('#exportMenuButton not found');
            }
            return __classPrivateFieldGet(this, _RecorderController_exportMenuButton, "f");
        });
        this.isRecording = false;
        this.isToggling = false;
        this.exportMenuExpanded = false;
        this.currentPage = "StartPage" /* Pages.START_PAGE */;
        if (__classPrivateFieldGet(this, _RecorderController_storage, "f").getRecordings().length) {
            __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, "AllRecordingsPage" /* Pages.ALL_RECORDINGS_PAGE */);
        }
        const textEditorIndent = Common.Settings.Settings.instance().moduleSetting('text-editor-indent').get();
        __classPrivateFieldSet(this, _RecorderController_builtInConverters, Object.freeze([
            new Converters.JSONConverter.JSONConverter(textEditorIndent),
            new Converters.PuppeteerReplayConverter.PuppeteerReplayConverter(textEditorIndent),
            new Converters.PuppeteerConverter.PuppeteerConverter(textEditorIndent),
            new Converters.PuppeteerFirefoxConverter.PuppeteerFirefoxConverter(textEditorIndent),
            new Converters.LighthouseConverter.LighthouseConverter(textEditorIndent),
        ]), "f");
        const extensionManager = Extensions.ExtensionManager.ExtensionManager.instance();
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_updateExtensions).call(this, extensionManager.extensions());
        extensionManager.addEventListener("extensionsUpdated" /* Extensions.ExtensionManager.Events.EXTENSIONS_UPDATED */, event => {
            __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_updateExtensions).call(this, event.data);
        });
        // used in e2e tests only.
        this.addEventListener('setrecording', (event) => __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onSetRecording).call(this, event));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.currentRecordingSession) {
            void this.currentRecordingSession.stop();
        }
    }
    setIsRecordingStateForTesting(isRecording) {
        this.isRecording = isRecording;
    }
    setRecordingStateForTesting(state) {
        __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying = state.isPlaying;
        __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPausedOnBreakpoint = state.isPausedOnBreakpoint;
    }
    setCurrentPageForTesting(page) {
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, page);
    }
    getCurrentPageForTesting() {
        return this.currentPage;
    }
    getCurrentRecordingForTesting() {
        return this.currentRecording;
    }
    getStepBreakpointIndexesForTesting() {
        return [...__classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f").values()];
    }
    setCurrentRecordingForTesting(recording) {
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, recording);
    }
    getSectionsForTesting() {
        return this.sections;
    }
    // Used by e2e tests to inspect the current recording.
    getUserFlow() {
        return this.currentRecording?.flow;
    }
    handleActions(actionId) {
        if (!this.isActionPossible(actionId)) {
            return;
        }
        switch (actionId) {
            case "chrome-recorder.create-recording" /* Actions.RecorderActions.CREATE_RECORDING */:
                __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onCreateNewRecording).call(this);
                return;
            case "chrome-recorder.start-recording" /* Actions.RecorderActions.START_RECORDING */:
                if (this.currentPage !== "CreateRecordingPage" /* Pages.CREATE_RECORDING_PAGE */ && !this.isRecording) {
                    __classPrivateFieldGet(this, _RecorderController_shortcutHelper, "f").handleShortcut(__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onRecordingStarted).bind(this, new Components.CreateRecordingView.RecordingStartedEvent(__classPrivateFieldGet(this, _RecorderController_recorderSettings, "f").defaultTitle, __classPrivateFieldGet(this, _RecorderController_recorderSettings, "f").defaultSelectors, __classPrivateFieldGet(this, _RecorderController_recorderSettings, "f").selectorAttribute)));
                }
                else if (this.currentPage === "CreateRecordingPage" /* Pages.CREATE_RECORDING_PAGE */) {
                    const view = this.renderRoot.querySelector('devtools-create-recording-view');
                    if (view) {
                        __classPrivateFieldGet(this, _RecorderController_shortcutHelper, "f").handleShortcut(view.startRecording.bind(view));
                    }
                }
                else if (this.isRecording) {
                    void __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onRecordingFinished).call(this);
                }
                return;
            case "chrome-recorder.replay-recording" /* Actions.RecorderActions.REPLAY_RECORDING */:
                void __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onPlayRecording).call(this, { targetPanel: "chrome-recorder" /* Components.RecordingView.TargetPanel.DEFAULT */, speed: __classPrivateFieldGet(this, _RecorderController_recorderSettings, "f").speed });
                return;
            case "chrome-recorder.toggle-code-view" /* Actions.RecorderActions.TOGGLE_CODE_VIEW */: {
                __classPrivateFieldGet(this, _RecorderController_recordingView, "f")?.showCodeToggle();
                return;
            }
        }
    }
    isActionPossible(actionId) {
        switch (actionId) {
            case "chrome-recorder.create-recording" /* Actions.RecorderActions.CREATE_RECORDING */:
                return !this.isRecording && !__classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying;
            case "chrome-recorder.start-recording" /* Actions.RecorderActions.START_RECORDING */:
                return !__classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying;
            case "chrome-recorder.replay-recording" /* Actions.RecorderActions.REPLAY_RECORDING */:
                return (this.currentPage === "RecordingPage" /* Pages.RECORDING_PAGE */ && !__classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying);
            case "chrome-recorder.toggle-code-view" /* Actions.RecorderActions.TOGGLE_CODE_VIEW */:
                return this.currentPage === "RecordingPage" /* Pages.RECORDING_PAGE */;
            case "chrome-recorder.copy-recording-or-step" /* Actions.RecorderActions.COPY_RECORDING_OR_STEP */:
                // This action is handled in the RecordingView
                // It relies on browser `copy` event.
                return false;
        }
    }
    render() {
        const recordings = __classPrivateFieldGet(this, _RecorderController_storage, "f").getRecordings();
        const selectValue = this.currentRecording ? this.currentRecording.storageName : this.currentPage;
        // clang-format off
        const values = [
            recordings.length === 0
                ? {
                    value: "StartPage" /* Pages.START_PAGE */,
                    name: i18nString(UIStrings.noRecordings),
                    selected: selectValue === "StartPage" /* Pages.START_PAGE */,
                }
                : {
                    value: "AllRecordingsPage" /* Pages.ALL_RECORDINGS_PAGE */,
                    name: `${recordings.length} ${i18nString(UIStrings.numberOfRecordings)}`,
                    selected: selectValue === "AllRecordingsPage" /* Pages.ALL_RECORDINGS_PAGE */,
                },
            ...recordings.map(recording => ({
                value: recording.storageName,
                name: recording.flow.title,
                selected: selectValue === recording.storageName,
            })),
        ];
        return html `
        <style>${UI.inspectorCommonStyles}</style>
        <style>${recorderControllerStyles}</style>
        <div class="wrapper">
          <div class="header" jslog=${VisualLogging.toolbar()}>
            <devtools-button
              @click=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onCreateNewRecording)}
              .data=${{
            variant: "toolbar" /* Buttons.Button.Variant.TOOLBAR */,
            iconName: 'plus',
            disabled: __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying ||
                this.isRecording ||
                this.isToggling,
            title: Models.Tooltip.getTooltipForActions(i18nString(UIStrings.createRecording), "chrome-recorder.create-recording" /* Actions.RecorderActions.CREATE_RECORDING */),
            jslogContext: "chrome-recorder.create-recording" /* Actions.RecorderActions.CREATE_RECORDING */,
        }}
            ></devtools-button>
            <div class="separator"></div>
            <select
              .disabled=${recordings.length === 0 ||
            __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying ||
            this.isRecording ||
            this.isToggling}
              @click=${(e) => e.stopPropagation()}
              @change=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onRecordingSelected)}
              jslog=${VisualLogging.dropDown('recordings').track({ change: true })}
            >
              ${Lit.Directives.repeat(values, item => item.value, item => {
            return html `<option .selected=${item.selected} value=${item.value}>${item.name}</option>`;
        })}
            </select>
            <div class="separator"></div>
            <devtools-button
              @click=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onImportRecording)}
              .data=${{
            variant: "toolbar" /* Buttons.Button.Variant.TOOLBAR */,
            iconName: 'import',
            title: i18nString(UIStrings.importRecording),
            jslogContext: 'import-recording',
        }}
            ></devtools-button>
            <devtools-button
              id='origin'
              @click=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onExportRecording)}
              on-render=${ComponentHelpers.Directives.nodeRenderedCallback(node => {
            __classPrivateFieldSet(this, _RecorderController_exportMenuButton, node, "f");
        })}
              .data=${{
            variant: "toolbar" /* Buttons.Button.Variant.TOOLBAR */,
            iconName: 'download',
            title: i18nString(UIStrings.exportRecording),
            disabled: !this.currentRecording,
        }}
              jslog=${VisualLogging.dropDown('export-recording').track({ click: true })}
            ></devtools-button>
            <devtools-menu
              @menucloserequest=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onExportMenuClosed)}
              @menuitemselected=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onExportOptionSelected)}
              .origin=${__classPrivateFieldGet(this, _RecorderController_getExportMenuButton, "f")}
              .showDivider=${false}
              .showSelectedItem=${false}
              .open=${this.exportMenuExpanded}
            >
              <devtools-menu-group .name=${i18nString(UIStrings.export)}>
                ${Lit.Directives.repeat(__classPrivateFieldGet(this, _RecorderController_builtInConverters, "f"), converter => {
            return html `
                    <devtools-menu-item
                      .value=${converter.getId()}
                      jslog=${VisualLogging.item(`converter-${Platform.StringUtilities.toKebabCase(converter.getId())}`).track({ click: true })}>
                      ${converter.getFormatName()}
                    </devtools-menu-item>
                  `;
        })}
              </devtools-menu-group>
              <devtools-menu-group .name=${i18nString(UIStrings.exportViaExtensions)}>
                ${Lit.Directives.repeat(this.extensionConverters, converter => {
            return html `
                    <devtools-menu-item
                     .value=${converter.getId()}
                      jslog=${VisualLogging.item('converter-extension').track({ click: true })}>
                    ${converter.getFormatName()}
                    </devtools-menu-item>
                  `;
        })}
                <devtools-menu-item .value=${GET_EXTENSIONS_MENU_ITEM}>
                  ${i18nString(UIStrings.getExtensions)}
                </devtools-menu-item>
              </devtools-menu-group>
            </devtools-menu>
            <devtools-button
              @click=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onDeleteRecording)}
              .data=${{
            variant: "toolbar" /* Buttons.Button.Variant.TOOLBAR */,
            iconName: 'bin',
            disabled: !this.currentRecording ||
                __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying ||
                this.isRecording ||
                this.isToggling,
            title: i18nString(UIStrings.deleteRecording),
            jslogContext: 'delete-recording',
        }}
            ></devtools-button>
            <div class="separator"></div>
            <devtools-button
              @click=${() => this.recordingPlayer?.continue()}
              .data=${{
            variant: "primary_toolbar" /* Buttons.Button.Variant.PRIMARY_TOOLBAR */,
            iconName: 'resume',
            disabled: !this.recordingPlayer ||
                !__classPrivateFieldGet(this, _RecorderController_replayState, "f").isPausedOnBreakpoint,
            title: i18nString(UIStrings.continueReplay),
            jslogContext: 'continue-replay',
        }}
            ></devtools-button>
            <devtools-button
              @click=${() => this.recordingPlayer?.stepOver()}
              .data=${{
            variant: "toolbar" /* Buttons.Button.Variant.TOOLBAR */,
            iconName: 'step-over',
            disabled: !this.recordingPlayer ||
                !__classPrivateFieldGet(this, _RecorderController_replayState, "f").isPausedOnBreakpoint,
            title: i18nString(UIStrings.stepOverReplay),
            jslogContext: 'step-over',
        }}
            ></devtools-button>
            <div class="feedback">
              <x-link class="x-link" title=${i18nString(UIStrings.sendFeedback)} href=${FEEDBACK_URL} jslog=${VisualLogging.link('feedback').track({ click: true })}>${i18nString(UIStrings.sendFeedback)}</x-link>
            </div>
            <div class="separator"></div>
            <devtools-shortcut-dialog
              .data=${{
            shortcuts: __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_getShortcutsInfo).call(this),
        }} jslog=${VisualLogging.action('show-shortcuts').track({ click: true })}
            ></devtools-shortcut-dialog>
          </div>
          ${this.importError
            ? html `<div class='error'>Import error: ${this.importError.message}</div>`
            : ''}
          ${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_renderCurrentPage).call(this)}
        </div>
      `;
        // clang-format on
    }
};
_RecorderController_storage = new WeakMap();
_RecorderController_screenshotStorage = new WeakMap();
_RecorderController_replayAllowed = new WeakMap();
_RecorderController_replayState = new WeakMap();
_RecorderController_fileSelector = new WeakMap();
_RecorderController_exportMenuButton = new WeakMap();
_RecorderController_stepBreakpointIndexes = new WeakMap();
_RecorderController_builtInConverters = new WeakMap();
_RecorderController_recorderSettings = new WeakMap();
_RecorderController_shortcutHelper = new WeakMap();
_RecorderController_disableRecorderImportWarningSetting = new WeakMap();
_RecorderController_selfXssWarningDisabledSetting = new WeakMap();
_RecorderController_recordingView = new WeakMap();
_RecorderController_onAddBreakpoint = new WeakMap();
_RecorderController_onRemoveBreakpoint = new WeakMap();
_RecorderController_getExportMenuButton = new WeakMap();
_RecorderController_instances = new WeakSet();
_RecorderController_updateExtensions = function _RecorderController_updateExtensions(extensions) {
    this.extensionConverters =
        extensions.filter(extension => extension.getCapabilities().includes('export')).map((extension, idx) => {
            return new Converters.ExtensionConverter.ExtensionConverter(idx, extension);
        });
    this.replayExtensions = extensions.filter(extension => extension.getCapabilities().includes('replay'));
};
_RecorderController_clearError = function _RecorderController_clearError() {
    this.importError = undefined;
};
_RecorderController_importFile = async function _RecorderController_importFile(file) {
    const outputStream = new Common.StringOutputStream.StringOutputStream();
    const reader = new Bindings.FileUtils.ChunkedFileReader(file, 
    /* chunkSize */ 10000000);
    const success = await reader.read(outputStream);
    if (!success) {
        throw reader.error() ?? new Error('Unknown');
    }
    let flow;
    try {
        flow = Models.SchemaUtils.parse(JSON.parse(outputStream.data()));
    }
    catch (error) {
        this.importError = error;
        return;
    }
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").saveRecording(flow));
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, "RecordingPage" /* Pages.RECORDING_PAGE */);
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_clearError).call(this);
};
_RecorderController_setCurrentRecording = function _RecorderController_setCurrentRecording(recording, opts = {}) {
    const { keepBreakpoints = false, updateSession = false } = opts;
    this.recordingPlayer?.abort();
    this.currentStep = undefined;
    this.recordingError = undefined;
    this.lastReplayResult = undefined;
    this.recordingPlayer = undefined;
    __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying = false;
    __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPausedOnBreakpoint = false;
    __classPrivateFieldSet(this, _RecorderController_stepBreakpointIndexes, keepBreakpoints ? __classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f") : new Set(), "f");
    if (recording) {
        this.currentRecording = recording;
        this.sections = Models.Section.buildSections(recording.flow.steps);
        this.settings = __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_buildSettings).call(this, recording.flow);
        if (updateSession && this.currentRecordingSession) {
            this.currentRecordingSession.overwriteUserFlow(recording.flow);
        }
    }
    else {
        this.currentRecording = undefined;
        this.sections = undefined;
        this.settings = undefined;
    }
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_updateScreenshotsForSections).call(this);
};
_RecorderController_setCurrentPage = function _RecorderController_setCurrentPage(page) {
    if (page === this.currentPage) {
        return;
    }
    this.previousPage = this.currentPage;
    this.currentPage = page;
};
_RecorderController_buildSettings = function _RecorderController_buildSettings(flow) {
    const steps = flow.steps;
    const navigateStepIdx = steps.findIndex(step => step.type === 'navigate');
    const settings = { timeout: flow.timeout };
    for (let i = navigateStepIdx - 1; i >= 0; i--) {
        const step = steps[i];
        if (!settings.viewportSettings && step.type === 'setViewport') {
            settings.viewportSettings = step;
        }
        if (!settings.networkConditionsSettings && step.type === 'emulateNetworkConditions') {
            settings.networkConditionsSettings = { ...step };
            for (const preset of [SDK.NetworkManager.OfflineConditions, SDK.NetworkManager.Slow3GConditions,
                SDK.NetworkManager.Slow4GConditions, SDK.NetworkManager.Fast4GConditions]) {
                // Using i18nTitleKey as a title here because we only want to compare the parameters of the network conditions.
                if (SDK.NetworkManager.networkConditionsEqual({ ...preset, title: preset.i18nTitleKey || '' }, 
                // The key below is not used, but we need it to satisfy TS.
                {
                    ...step,
                    title: preset.i18nTitleKey || '',
                    key: `step_${i}_recorder_key`
                })) {
                    settings.networkConditionsSettings.title = preset.title instanceof Function ? preset.title() : preset.title;
                    settings.networkConditionsSettings.i18nTitleKey = preset.i18nTitleKey;
                }
            }
        }
    }
    return settings;
};
_RecorderController_getMainTarget = function _RecorderController_getMainTarget() {
    const target = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    if (!target) {
        throw new Error('Missing main page target');
    }
    return target;
};
_RecorderController_getSectionFromStep = function _RecorderController_getSectionFromStep(step) {
    if (!this.sections) {
        return null;
    }
    for (const section of this.sections) {
        if (section.steps.indexOf(step) !== -1) {
            return section;
        }
    }
    return null;
};
_RecorderController_updateScreenshotsForSections = function _RecorderController_updateScreenshotsForSections() {
    if (!this.sections || !this.currentRecording) {
        return;
    }
    const storageName = this.currentRecording.storageName;
    for (let i = 0; i < this.sections.length; i++) {
        const screenshot = __classPrivateFieldGet(this, _RecorderController_screenshotStorage, "f").getScreenshotForSection(storageName, i);
        this.sections[i].screenshot = screenshot || undefined;
    }
    this.requestUpdate();
};
_RecorderController_onAbortReplay = function _RecorderController_onAbortReplay() {
    this.recordingPlayer?.abort();
};
_RecorderController_onPlayViaExtension = async function _RecorderController_onPlayViaExtension(extension) {
    if (!this.currentRecording || !__classPrivateFieldGet(this, _RecorderController_replayAllowed, "f")) {
        return;
    }
    const pluginManager = PublicExtensions.RecorderPluginManager.RecorderPluginManager.instance();
    const promise = pluginManager.once("showViewRequested" /* PublicExtensions.RecorderPluginManager.Events.SHOW_VIEW_REQUESTED */);
    extension.replay(this.currentRecording.flow);
    const descriptor = await promise;
    this.viewDescriptor = descriptor;
    Host.userMetrics.recordingReplayStarted(3 /* Host.UserMetrics.RecordingReplayStarted.REPLAY_VIA_EXTENSION */);
};
_RecorderController_onPlayRecording = async function _RecorderController_onPlayRecording(event) {
    if (!this.currentRecording || !__classPrivateFieldGet(this, _RecorderController_replayAllowed, "f")) {
        return;
    }
    if (this.viewDescriptor) {
        this.viewDescriptor = undefined;
    }
    if (event.extension) {
        return await __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onPlayViaExtension).call(this, event.extension);
    }
    Host.userMetrics.recordingReplayStarted(event.targetPanel !== "chrome-recorder" /* Components.RecordingView.TargetPanel.DEFAULT */ ?
        2 /* Host.UserMetrics.RecordingReplayStarted.REPLAY_WITH_PERFORMANCE_TRACING */ :
        1 /* Host.UserMetrics.RecordingReplayStarted.REPLAY_ONLY */);
    __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying = true;
    this.currentStep = undefined;
    this.recordingError = undefined;
    this.lastReplayResult = undefined;
    const currentRecording = this.currentRecording;
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_clearError).call(this);
    await __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_disableDeviceModeIfEnabled).call(this);
    this.recordingPlayer = new Models.RecordingPlayer.RecordingPlayer(this.currentRecording.flow, { speed: event.speed, breakpointIndexes: __classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f") });
    const withPerformanceTrace = event.targetPanel === "timeline" /* Components.RecordingView.TargetPanel.PERFORMANCE_PANEL */;
    const sectionsWithScreenshot = new Set();
    this.recordingPlayer.addEventListener("Step" /* Models.RecordingPlayer.Events.STEP */, async ({ data: { step, resolve } }) => {
        this.currentStep = step;
        const currentSection = __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_getSectionFromStep).call(this, step);
        if (this.sections && currentSection && !sectionsWithScreenshot.has(currentSection)) {
            sectionsWithScreenshot.add(currentSection);
            const currentSectionIndex = this.sections.indexOf(currentSection);
            const screenshot = await Models.ScreenshotUtils.takeScreenshot();
            currentSection.screenshot = screenshot;
            Models.ScreenshotStorage.ScreenshotStorage.instance().storeScreenshotForSection(currentRecording.storageName, currentSectionIndex, screenshot);
        }
        resolve();
    });
    this.recordingPlayer.addEventListener("Stop" /* Models.RecordingPlayer.Events.STOP */, () => {
        __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPausedOnBreakpoint = true;
        this.requestUpdate();
    });
    this.recordingPlayer.addEventListener("Continue" /* Models.RecordingPlayer.Events.CONTINUE */, () => {
        __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPausedOnBreakpoint = false;
        this.requestUpdate();
    });
    this.recordingPlayer.addEventListener("Error" /* Models.RecordingPlayer.Events.ERROR */, ({ data: error }) => {
        this.recordingError = error;
        if (!withPerformanceTrace) {
            __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying = false;
            this.recordingPlayer = undefined;
        }
        this.lastReplayResult = "Failure" /* Models.RecordingPlayer.ReplayResult.FAILURE */;
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.startsWith('could not find element')) {
            Host.userMetrics.recordingReplayFinished(2 /* Host.UserMetrics.RecordingReplayFinished.TIMEOUT_ERROR_SELECTORS */);
        }
        else if (errorMessage.startsWith('waiting for target failed')) {
            Host.userMetrics.recordingReplayFinished(3 /* Host.UserMetrics.RecordingReplayFinished.TIMEOUT_ERROR_TARGET */);
        }
        else {
            Host.userMetrics.recordingReplayFinished(4 /* Host.UserMetrics.RecordingReplayFinished.OTHER_ERROR */);
        }
        // Dispatch an event for e2e testing.
        this.dispatchEvent(new Events.ReplayFinishedEvent());
    });
    this.recordingPlayer.addEventListener("Done" /* Models.RecordingPlayer.Events.DONE */, () => {
        if (!withPerformanceTrace) {
            __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying = false;
            this.recordingPlayer = undefined;
        }
        this.lastReplayResult = "Success" /* Models.RecordingPlayer.ReplayResult.SUCCESS */;
        // Dispatch an event for e2e testing.
        this.dispatchEvent(new Events.ReplayFinishedEvent());
        Host.userMetrics.recordingReplayFinished(1 /* Host.UserMetrics.RecordingReplayFinished.SUCCESS */);
    });
    this.recordingPlayer.addEventListener("Abort" /* Models.RecordingPlayer.Events.ABORT */, () => {
        this.currentStep = undefined;
        this.recordingError = undefined;
        this.lastReplayResult = undefined;
        __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying = false;
    });
    let resolveWithEvents = (_events) => { };
    const eventsPromise = new Promise((resolve) => {
        resolveWithEvents = resolve;
    });
    let performanceTracing = null;
    switch (event.targetPanel) {
        case "timeline" /* Components.RecordingView.TargetPanel.PERFORMANCE_PANEL */:
            performanceTracing = new Tracing.PerformanceTracing.PerformanceTracing(__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_getMainTarget).call(this), {
                tracingBufferUsage() { },
                eventsRetrievalProgress() { },
                tracingComplete(events) {
                    resolveWithEvents(events);
                },
            });
            break;
    }
    if (performanceTracing) {
        await performanceTracing.start();
    }
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setTouchEmulationAllowed).call(this, false);
    await this.recordingPlayer.play();
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setTouchEmulationAllowed).call(this, true);
    if (performanceTracing) {
        await performanceTracing.stop();
        const events = await eventsPromise;
        __classPrivateFieldGet(this, _RecorderController_replayState, "f").isPlaying = false;
        this.recordingPlayer = undefined;
        await UI.InspectorView.InspectorView.instance().showPanel(event.targetPanel);
        if (event.targetPanel === "timeline" /* Components.RecordingView.TargetPanel.PERFORMANCE_PANEL */) {
            // Note: this is not passing any metadata to the Performance panel.
            const trace = new SDK.TraceObject.TraceObject(events);
            void Common.Revealer.reveal(trace);
        }
    }
};
_RecorderController_disableDeviceModeIfEnabled = async function _RecorderController_disableDeviceModeIfEnabled() {
    try {
        const deviceModeWrapper = Emulation.DeviceModeWrapper.DeviceModeWrapper.instance();
        if (deviceModeWrapper.isDeviceModeOn()) {
            deviceModeWrapper.toggleDeviceMode();
            const emulationModel = __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_getMainTarget).call(this).model(SDK.EmulationModel.EmulationModel);
            await emulationModel?.emulateDevice(null);
        }
    }
    catch {
        // in the hosted mode, when the DeviceMode toolbar is not supported,
        // Emulation.DeviceModeWrapper.DeviceModeWrapper.instance throws an exception.
    }
};
_RecorderController_setTouchEmulationAllowed = function _RecorderController_setTouchEmulationAllowed(touchEmulationAllowed) {
    const emulationModel = __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_getMainTarget).call(this).model(SDK.EmulationModel.EmulationModel);
    emulationModel?.setTouchEmulationAllowed(touchEmulationAllowed);
};
_RecorderController_onSetRecording = async function _RecorderController_onSetRecording(event) {
    const json = JSON.parse(event.detail);
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").saveRecording(Models.SchemaUtils.parse(json)));
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, "RecordingPage" /* Pages.RECORDING_PAGE */);
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_clearError).call(this);
};
_RecorderController_handleRecordingChanged = async function _RecorderController_handleRecordingChanged(event) {
    if (!this.currentRecording) {
        throw new Error('Current recording expected to be defined.');
    }
    const recording = {
        ...this.currentRecording,
        flow: {
            ...this.currentRecording.flow,
            steps: this.currentRecording.flow.steps.map(step => step === event.currentStep ? event.newStep : step),
        },
    };
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").updateRecording(recording.storageName, recording.flow), { keepBreakpoints: true, updateSession: true });
};
_RecorderController_handleStepAdded = async function _RecorderController_handleStepAdded(event) {
    if (!this.currentRecording) {
        throw new Error('Current recording expected to be defined.');
    }
    const stepOrSection = event.stepOrSection;
    let step;
    let position = event.position;
    if ('steps' in stepOrSection) {
        // section
        const sectionIdx = this.sections?.indexOf(stepOrSection);
        if (sectionIdx === undefined || sectionIdx === -1) {
            throw new Error('There is no section to add a step to');
        }
        if (event.position === "after" /* Components.StepView.AddStepPosition.AFTER */) {
            if (this.sections?.[sectionIdx].steps.length) {
                step = this.sections?.[sectionIdx].steps[0];
                position = "before" /* Components.StepView.AddStepPosition.BEFORE */;
            }
            else {
                step = this.sections?.[sectionIdx].causingStep;
                position = "after" /* Components.StepView.AddStepPosition.AFTER */;
            }
        }
        else {
            if (sectionIdx <= 0) {
                throw new Error('There is no section to add a step to');
            }
            const prevSection = this.sections?.[sectionIdx - 1];
            step = prevSection?.steps[prevSection.steps.length - 1];
            position = "after" /* Components.StepView.AddStepPosition.AFTER */;
        }
    }
    else {
        // step
        step = stepOrSection;
    }
    if (!step) {
        throw new Error('Anchor step is not found when adding a step');
    }
    const steps = this.currentRecording.flow.steps;
    const currentIndex = steps.indexOf(step);
    const indexToInsertAt = currentIndex + (position === "before" /* Components.StepView.AddStepPosition.BEFORE */ ? 0 : 1);
    steps.splice(indexToInsertAt, 0, { type: Models.Schema.StepType.WaitForElement, selectors: ['body'] });
    const recording = { ...this.currentRecording, flow: { ...this.currentRecording.flow, steps } };
    Host.userMetrics.recordingEdited(2 /* Host.UserMetrics.RecordingEdited.STEP_ADDED */);
    __classPrivateFieldSet(this, _RecorderController_stepBreakpointIndexes, new Set([...__classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f").values()].map(breakpointIndex => {
        if (indexToInsertAt > breakpointIndex) {
            return breakpointIndex;
        }
        return breakpointIndex + 1;
    })), "f");
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").updateRecording(recording.storageName, recording.flow), { keepBreakpoints: true, updateSession: true });
};
_RecorderController_handleRecordingTitleChanged = async function _RecorderController_handleRecordingTitleChanged(title) {
    if (!this.currentRecording) {
        throw new Error('Current recording expected to be defined.');
    }
    const flow = { ...this.currentRecording.flow, title };
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").updateRecording(this.currentRecording.storageName, flow));
};
_RecorderController_handleStepRemoved = async function _RecorderController_handleStepRemoved(event) {
    if (!this.currentRecording) {
        throw new Error('Current recording expected to be defined.');
    }
    const steps = this.currentRecording.flow.steps;
    const currentIndex = steps.indexOf(event.step);
    steps.splice(currentIndex, 1);
    const flow = { ...this.currentRecording.flow, steps };
    Host.userMetrics.recordingEdited(3 /* Host.UserMetrics.RecordingEdited.STEP_REMOVED */);
    __classPrivateFieldSet(this, _RecorderController_stepBreakpointIndexes, new Set([...__classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f").values()]
        .map(breakpointIndex => {
        if (currentIndex > breakpointIndex) {
            return breakpointIndex;
        }
        if (currentIndex === breakpointIndex) {
            return -1;
        }
        return breakpointIndex - 1;
    })
        .filter(index => index >= 0)), "f");
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").updateRecording(this.currentRecording.storageName, flow), { keepBreakpoints: true, updateSession: true });
};
_RecorderController_onNetworkConditionsChanged = async function _RecorderController_onNetworkConditionsChanged(data) {
    if (!this.currentRecording) {
        throw new Error('Current recording expected to be defined.');
    }
    const navigateIdx = this.currentRecording.flow.steps.findIndex(step => step.type === 'navigate');
    if (navigateIdx === -1) {
        throw new Error('Current recording does not have a navigate step');
    }
    const emulateNetworkConditionsIdx = this.currentRecording.flow.steps.findIndex((step, idx) => {
        if (idx >= navigateIdx) {
            return false;
        }
        return step.type === 'emulateNetworkConditions';
    });
    if (!data) {
        // Delete step if present.
        if (emulateNetworkConditionsIdx !== -1) {
            this.currentRecording.flow.steps.splice(emulateNetworkConditionsIdx, 1);
        }
    }
    else if (emulateNetworkConditionsIdx === -1) {
        // Insert at the first position.
        this.currentRecording.flow.steps.splice(0, 0, Models.SchemaUtils.createEmulateNetworkConditionsStep({ download: data.download, upload: data.upload, latency: data.latency }));
    }
    else {
        // Update existing step.
        const step = this.currentRecording.flow.steps[emulateNetworkConditionsIdx];
        step.download = data.download;
        step.upload = data.upload;
        step.latency = data.latency;
    }
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").updateRecording(this.currentRecording.storageName, this.currentRecording.flow));
};
_RecorderController_onTimeoutChanged = async function _RecorderController_onTimeoutChanged(timeout) {
    if (!this.currentRecording) {
        throw new Error('Current recording expected to be defined.');
    }
    this.currentRecording.flow.timeout = timeout;
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").updateRecording(this.currentRecording.storageName, this.currentRecording.flow));
};
_RecorderController_onDeleteRecording = async function _RecorderController_onDeleteRecording(event) {
    event.stopPropagation();
    if (event instanceof Components.RecordingListView.DeleteRecordingEvent) {
        await __classPrivateFieldGet(this, _RecorderController_storage, "f").deleteRecording(event.storageName);
        __classPrivateFieldGet(this, _RecorderController_screenshotStorage, "f").deleteScreenshotsForRecording(event.storageName);
        this.requestUpdate();
    }
    else {
        if (!this.currentRecording) {
            return;
        }
        await __classPrivateFieldGet(this, _RecorderController_storage, "f").deleteRecording(this.currentRecording.storageName);
        __classPrivateFieldGet(this, _RecorderController_screenshotStorage, "f").deleteScreenshotsForRecording(this.currentRecording.storageName);
    }
    if ((await __classPrivateFieldGet(this, _RecorderController_storage, "f").getRecordings()).length) {
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, "AllRecordingsPage" /* Pages.ALL_RECORDINGS_PAGE */);
    }
    else {
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, "StartPage" /* Pages.START_PAGE */);
    }
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, undefined);
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_clearError).call(this);
};
_RecorderController_onCreateNewRecording = function _RecorderController_onCreateNewRecording(event) {
    event?.stopPropagation();
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, "CreateRecordingPage" /* Pages.CREATE_RECORDING_PAGE */);
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_clearError).call(this);
};
_RecorderController_onRecordingStarted = async function _RecorderController_onRecordingStarted(event) {
    // Recording is not available in device mode.
    await __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_disableDeviceModeIfEnabled).call(this);
    // Setting up some variables to notify the user we are initializing a recording.
    this.isToggling = true;
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_clearError).call(this);
    // -- Recording logic starts here --
    Host.userMetrics.recordingToggled(1 /* Host.UserMetrics.RecordingToggled.RECORDING_STARTED */);
    this.currentRecordingSession = new Models.RecordingSession.RecordingSession(__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_getMainTarget).call(this), {
        title: event.name,
        selectorAttribute: event.selectorAttribute,
        selectorTypesToRecord: event.selectorTypesToRecord.length ? event.selectorTypesToRecord :
            Object.values(Models.Schema.SelectorType),
    });
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").saveRecording(this.currentRecordingSession.cloneUserFlow()));
    let previousSectionIndex = -1;
    let screenshotPromise;
    const takeScreenshot = async (currentRecording) => {
        if (!this.sections) {
            throw new Error('Could not find sections.');
        }
        const currentSectionIndex = this.sections.length - 1;
        const currentSection = this.sections[currentSectionIndex];
        if (screenshotPromise || previousSectionIndex === currentSectionIndex) {
            return;
        }
        screenshotPromise = Models.ScreenshotUtils.takeScreenshot();
        const screenshot = await screenshotPromise;
        screenshotPromise = undefined;
        currentSection.screenshot = screenshot;
        Models.ScreenshotStorage.ScreenshotStorage.instance().storeScreenshotForSection(currentRecording.storageName, currentSectionIndex, screenshot);
        previousSectionIndex = currentSectionIndex;
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_updateScreenshotsForSections).call(this);
    };
    this.currentRecordingSession.addEventListener("recordingupdated" /* Models.RecordingSession.Events.RECORDING_UPDATED */, async ({ data }) => {
        if (!this.currentRecording) {
            throw new Error('No current recording found');
        }
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").updateRecording(this.currentRecording.storageName, data));
        __classPrivateFieldGet(this, _RecorderController_recordingView, "f")?.scrollToBottom();
        await takeScreenshot(this.currentRecording);
    });
    this.currentRecordingSession.addEventListener("recordingstopped" /* Models.RecordingSession.Events.RECORDING_STOPPED */, async ({ data }) => {
        if (!this.currentRecording) {
            throw new Error('No current recording found');
        }
        Host.userMetrics.keyboardShortcutFired("chrome-recorder.start-recording" /* Actions.RecorderActions.START_RECORDING */);
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").updateRecording(this.currentRecording.storageName, data));
        await __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onRecordingFinished).call(this);
    });
    await this.currentRecordingSession.start();
    // -- Recording logic ends here --
    // Setting up some variables to notify the user we are finished initialization.
    this.isToggling = false;
    this.isRecording = true;
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, "RecordingPage" /* Pages.RECORDING_PAGE */);
    // Dispatch an event for e2e testing.
    this.dispatchEvent(new Events.RecordingStateChangedEvent(this.currentRecording.flow));
};
_RecorderController_onRecordingFinished = async function _RecorderController_onRecordingFinished() {
    if (!this.currentRecording || !this.currentRecordingSession) {
        throw new Error('Recording was never started');
    }
    // Setting up some variables to notify the user we are finalizing a recording.
    this.isToggling = true;
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_clearError).call(this);
    // -- Recording logic starts here --
    Host.userMetrics.recordingToggled(2 /* Host.UserMetrics.RecordingToggled.RECORDING_FINISHED */);
    await this.currentRecordingSession.stop();
    this.currentRecordingSession = undefined;
    // -- Recording logic ends here --
    // Setting up some variables to notify the user we are finished finalizing.
    this.isToggling = false;
    this.isRecording = false;
    // Dispatch an event for e2e testing.
    this.dispatchEvent(new Events.RecordingStateChangedEvent(this.currentRecording.flow));
};
_RecorderController_onRecordingCancelled = async function _RecorderController_onRecordingCancelled() {
    if (this.previousPage) {
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, this.previousPage);
    }
};
_RecorderController_onRecordingSelected = async function _RecorderController_onRecordingSelected(event) {
    const storageName = event instanceof Components.RecordingListView.OpenRecordingEvent ||
        event instanceof Components.RecordingListView.PlayRecordingEvent ?
        event.storageName :
        event.target?.value;
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").getRecording(storageName));
    if (this.currentRecording) {
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, "RecordingPage" /* Pages.RECORDING_PAGE */);
    }
    else if (storageName === "StartPage" /* Pages.START_PAGE */) {
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, "StartPage" /* Pages.START_PAGE */);
    }
    else if (storageName === "AllRecordingsPage" /* Pages.ALL_RECORDINGS_PAGE */) {
        __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentPage).call(this, "AllRecordingsPage" /* Pages.ALL_RECORDINGS_PAGE */);
    }
};
_RecorderController_onExportOptionSelected = async function _RecorderController_onExportOptionSelected(event) {
    if (typeof event.itemValue !== 'string') {
        throw new Error('Invalid export option value');
    }
    if (event.itemValue === GET_EXTENSIONS_MENU_ITEM) {
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(GET_EXTENSIONS_URL);
        return;
    }
    if (!this.currentRecording) {
        throw new Error('No recording selected');
    }
    const id = event.itemValue;
    const byId = (converter) => converter.getId() === id;
    const converter = __classPrivateFieldGet(this, _RecorderController_builtInConverters, "f").find(byId) || this.extensionConverters.find(byId);
    if (!converter) {
        throw new Error('No recording selected');
    }
    const [content] = await converter.stringify(this.currentRecording.flow);
    await __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_exportContent).call(this, converter.getFilename(this.currentRecording.flow), content);
    const builtInMetric = CONVERTER_ID_TO_METRIC[converter.getId()];
    if (builtInMetric) {
        Host.userMetrics.recordingExported(builtInMetric);
    }
    else if (converter.getId().startsWith(Converters.ExtensionConverter.EXTENSION_PREFIX)) {
        Host.userMetrics.recordingExported(4 /* Host.UserMetrics.RecordingExported.TO_EXTENSION */);
    }
    else {
        throw new Error('Could not find a metric for the export option with id = ' + id);
    }
};
_RecorderController_exportContent = async function _RecorderController_exportContent(suggestedName, data) {
    try {
        const handle = await window.showSaveFilePicker({ suggestedName });
        const writable = await handle.createWritable();
        await writable.write(data);
        await writable.close();
    }
    catch (error) {
        // If the user aborts the action no need to report it, otherwise do.
        if (error.name === 'AbortError') {
            return;
        }
        throw error;
    }
};
_RecorderController_handleAddAssertionEvent = async function _RecorderController_handleAddAssertionEvent() {
    if (!this.currentRecordingSession || !this.currentRecording) {
        return;
    }
    const flow = this.currentRecordingSession.cloneUserFlow();
    flow.steps.push({ type: 'waitForElement', selectors: [['.cls']] });
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_setCurrentRecording).call(this, await __classPrivateFieldGet(this, _RecorderController_storage, "f").updateRecording(this.currentRecording.storageName, flow), { keepBreakpoints: true, updateSession: true });
    Host.userMetrics.recordingAssertion(1 /* Host.UserMetrics.RecordingAssertion.ASSERTION_ADDED */);
    await this.updateComplete;
    // FIXME: call a method on the recording view widget.
    await __classPrivateFieldGet(this, _RecorderController_recordingView, "f")?.updateComplete;
    __classPrivateFieldGet(this, _RecorderController_recordingView, "f")?.contentElement?.querySelector('.section:last-child devtools-step-view:last-of-type')
        ?.shadowRoot?.querySelector('.action')
        ?.click();
};
_RecorderController_acknowledgeImportNotice = async function _RecorderController_acknowledgeImportNotice() {
    if (__classPrivateFieldGet(this, _RecorderController_disableRecorderImportWarningSetting, "f").get()) {
        return true;
    }
    if (Root.Runtime.Runtime.queryParam('isChromeForTesting') ||
        Root.Runtime.Runtime.queryParam('disableSelfXssWarnings') || __classPrivateFieldGet(this, _RecorderController_selfXssWarningDisabledSetting, "f").get()) {
        return true;
    }
    const result = await PanelCommon.TypeToAllowDialog.show({
        jslogContext: {
            input: 'confirm-import-recording-input',
            dialog: 'confirm-import-recording-dialog',
        },
        message: i18nString(UIStrings.doNotImport, { PH1: i18nString(UIStrings.allowImporting) }),
        header: i18nString(UIStrings.doYouTrustThisCode),
        typePhrase: i18nString(UIStrings.allowImporting),
        inputPlaceholder: i18nString(UIStrings.typeAllowImporting, { PH1: i18nString(UIStrings.allowImporting) }),
    });
    if (result) {
        __classPrivateFieldGet(this, _RecorderController_disableRecorderImportWarningSetting, "f").set(true);
    }
    return result;
};
_RecorderController_onImportRecording = async function _RecorderController_onImportRecording(event) {
    event.stopPropagation();
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_clearError).call(this);
    if (await __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_acknowledgeImportNotice).call(this)) {
        __classPrivateFieldSet(this, _RecorderController_fileSelector, UI.UIUtils.createFileSelectorElement(__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_importFile).bind(this)), "f");
        __classPrivateFieldGet(this, _RecorderController_fileSelector, "f").click();
    }
};
_RecorderController_onPlayRecordingByName = async function _RecorderController_onPlayRecordingByName(event) {
    await __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onRecordingSelected).call(this, event);
    await __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onPlayRecording).call(this, { targetPanel: "chrome-recorder" /* Components.RecordingView.TargetPanel.DEFAULT */, speed: __classPrivateFieldGet(this, _RecorderController_recorderSettings, "f").speed });
};
_RecorderController_onExtensionViewClosed = function _RecorderController_onExtensionViewClosed() {
    this.viewDescriptor = undefined;
};
_RecorderController_getShortcutsInfo = function _RecorderController_getShortcutsInfo() {
    const getBindingForAction = (action) => {
        const shortcuts = UI.ShortcutRegistry.ShortcutRegistry.instance().shortcutsForAction(action);
        const shortcutsWithSplitBindings = shortcuts.map(shortcut => shortcut.title().split(/[\s+]+/).map(word => {
            return { key: word.trim() };
        }));
        return shortcutsWithSplitBindings;
    };
    return [
        {
            title: i18nString(UIStrings.startStopRecording),
            rows: getBindingForAction("chrome-recorder.start-recording" /* Actions.RecorderActions.START_RECORDING */),
        },
        {
            title: i18nString(UIStrings.replayRecording),
            rows: getBindingForAction("chrome-recorder.replay-recording" /* Actions.RecorderActions.REPLAY_RECORDING */),
        },
        {
            title: i18nString(UIStrings.copyShortcut),
            rows: Host.Platform.isMac() ? [[{ key: '⌘' }, { key: 'C' }]] : [[{ key: 'Ctrl' }, { key: 'C' }]]
        },
        {
            title: i18nString(UIStrings.toggleCode),
            rows: getBindingForAction("chrome-recorder.toggle-code-view" /* Actions.RecorderActions.TOGGLE_CODE_VIEW */),
        },
    ];
};
_RecorderController_renderCurrentPage = function _RecorderController_renderCurrentPage() {
    switch (this.currentPage) {
        case "StartPage" /* Pages.START_PAGE */:
            return __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_renderStartPage).call(this);
        case "AllRecordingsPage" /* Pages.ALL_RECORDINGS_PAGE */:
            return __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_renderAllRecordingsPage).call(this);
        case "RecordingPage" /* Pages.RECORDING_PAGE */:
            return __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_renderRecordingPage).call(this);
        case "CreateRecordingPage" /* Pages.CREATE_RECORDING_PAGE */:
            return __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_renderCreateRecordingPage).call(this);
    }
};
_RecorderController_renderAllRecordingsPage = function _RecorderController_renderAllRecordingsPage() {
    const recordings = __classPrivateFieldGet(this, _RecorderController_storage, "f").getRecordings();
    // clang-format off
    return html `
      <devtools-recording-list-view
        .recordings=${recordings.map(recording => ({
        storageName: recording.storageName,
        name: recording.flow.title,
    }))}
        .replayAllowed=${__classPrivateFieldGet(this, _RecorderController_replayAllowed, "f")}
        @createrecording=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onCreateNewRecording)}
        @deleterecording=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onDeleteRecording)}
        @openrecording=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onRecordingSelected)}
        @playrecording=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onPlayRecordingByName)}
        >
      </devtools-recording-list-view>
    `;
    // clang-format on
};
_RecorderController_renderStartPage = function _RecorderController_renderStartPage() {
    // clang-format off
    return html `
      <div class="empty-state" jslog=${VisualLogging.section().context('start-view')}>
        <div class="empty-state-header">${i18nString(UIStrings.header)}</div>
        <div class="empty-state-description">
          <span>${i18nString(UIStrings.recordingDescription)}</span>
          ${UI.XLink.XLink.create(RECORDER_EXPLANATION_URL, i18nString(UIStrings.learnMore), 'x-link', undefined, 'learn-more')}
        </div>
        <devtools-button .variant=${"tonal" /* Buttons.Button.Variant.TONAL */} jslogContext=${"chrome-recorder.create-recording" /* Actions.RecorderActions.CREATE_RECORDING */} @click=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onCreateNewRecording)}>${i18nString(UIStrings.createRecording)}</devtools-button>
      </div>
    `;
    // clang-format on
};
_RecorderController_renderRecordingPage = function _RecorderController_renderRecordingPage() {
    // clang-format off
    return html `
      <devtools-widget
          class="recording-view"
          .widgetConfig=${UI.Widget.widgetConfig(Components.RecordingView.RecordingView, {
        recording: this.currentRecording?.flow ?? { title: '', steps: [] },
        replayState: __classPrivateFieldGet(this, _RecorderController_replayState, "f"),
        isRecording: this.isRecording,
        recordingTogglingInProgress: this.isToggling,
        currentStep: this.currentStep,
        currentError: this.recordingError,
        sections: this.sections ?? [],
        settings: this.settings,
        recorderSettings: __classPrivateFieldGet(this, _RecorderController_recorderSettings, "f"),
        lastReplayResult: this.lastReplayResult,
        replayAllowed: __classPrivateFieldGet(this, _RecorderController_replayAllowed, "f"),
        breakpointIndexes: __classPrivateFieldGet(this, _RecorderController_stepBreakpointIndexes, "f"),
        builtInConverters: __classPrivateFieldGet(this, _RecorderController_builtInConverters, "f"),
        extensionConverters: this.extensionConverters,
        replayExtensions: this.replayExtensions,
        extensionDescriptor: this.viewDescriptor,
        recordingFinished: __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onRecordingFinished).bind(this),
        addAssertion: __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_handleAddAssertionEvent).bind(this),
        abortReplay: __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onAbortReplay).bind(this),
        playRecording: __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onPlayRecording).bind(this),
        networkConditionsChanged: __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onNetworkConditionsChanged).bind(this),
        timeoutChanged: __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onTimeoutChanged).bind(this),
        titleChanged: __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_handleRecordingTitleChanged).bind(this),
    })}
          @requestselectorattribute=${(event) => {
        event.send(this.currentRecording?.flow.selectorAttribute);
    }}
          @stepchanged=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_handleRecordingChanged).bind(this)}
          @addstep=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_handleStepAdded).bind(this)}
          @removestep=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_handleStepRemoved).bind(this)}
          @addbreakpoint=${__classPrivateFieldGet(this, _RecorderController_onAddBreakpoint, "f").bind(this)}
          @removebreakpoint=${__classPrivateFieldGet(this, _RecorderController_onRemoveBreakpoint, "f").bind(this)}
          @recorderextensionviewclosed=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onExtensionViewClosed).bind(this)}
          ${UI.Widget.widgetRef(Components.RecordingView.RecordingView, widget => { __classPrivateFieldSet(this, _RecorderController_recordingView, widget, "f"); })}
        ></devtools-widget>
    `;
    // clang-format on
};
_RecorderController_renderCreateRecordingPage = function _RecorderController_renderCreateRecordingPage() {
    // clang-format off
    return html `
      <devtools-create-recording-view
        .data=${{
        recorderSettings: __classPrivateFieldGet(this, _RecorderController_recorderSettings, "f"),
    }}
        @recordingstarted=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onRecordingStarted)}
        @recordingcancelled=${__classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_onRecordingCancelled)}
      ></devtools-create-recording-view>
    `;
    // clang-format on
};
_RecorderController_onExportRecording = function _RecorderController_onExportRecording(event) {
    event.stopPropagation();
    __classPrivateFieldGet(this, _RecorderController_instances, "m", _RecorderController_clearError).call(this);
    this.exportMenuExpanded = !this.exportMenuExpanded;
};
_RecorderController_onExportMenuClosed = function _RecorderController_onExportMenuClosed() {
    this.exportMenuExpanded = false;
};
__decorate([
    state(),
    __metadata("design:type", Models.RecordingSession.RecordingSession)
], RecorderController.prototype, "currentRecordingSession", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], RecorderController.prototype, "currentRecording", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], RecorderController.prototype, "currentStep", void 0);
__decorate([
    state(),
    __metadata("design:type", Error)
], RecorderController.prototype, "recordingError", void 0);
__decorate([
    state(),
    __metadata("design:type", Boolean)
], RecorderController.prototype, "isRecording", void 0);
__decorate([
    state(),
    __metadata("design:type", Boolean)
], RecorderController.prototype, "isToggling", void 0);
__decorate([
    state(),
    __metadata("design:type", Models.RecordingPlayer.RecordingPlayer)
], RecorderController.prototype, "recordingPlayer", void 0);
__decorate([
    state(),
    __metadata("design:type", String)
], RecorderController.prototype, "lastReplayResult", void 0);
__decorate([
    state(),
    __metadata("design:type", String)
], RecorderController.prototype, "currentPage", void 0);
__decorate([
    state(),
    __metadata("design:type", String)
], RecorderController.prototype, "previousPage", void 0);
__decorate([
    state(),
    __metadata("design:type", Array)
], RecorderController.prototype, "sections", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], RecorderController.prototype, "settings", void 0);
__decorate([
    state(),
    __metadata("design:type", Error)
], RecorderController.prototype, "importError", void 0);
__decorate([
    state(),
    __metadata("design:type", Boolean)
], RecorderController.prototype, "exportMenuExpanded", void 0);
__decorate([
    state(),
    __metadata("design:type", Array)
], RecorderController.prototype, "extensionConverters", void 0);
__decorate([
    state(),
    __metadata("design:type", Array)
], RecorderController.prototype, "replayExtensions", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], RecorderController.prototype, "viewDescriptor", void 0);
RecorderController = __decorate([
    customElement('devtools-recorder-controller'),
    __metadata("design:paramtypes", [])
], RecorderController);
export { RecorderController };
//# sourceMappingURL=RecorderController.js.map