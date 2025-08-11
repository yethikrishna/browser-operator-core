// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _PatchWidget_instances, _PatchWidget_aiPatchingFreCompletedSetting, _PatchWidget_projectIdSetting, _PatchWidget_view, _PatchWidget_viewOutput, _PatchWidget_aidaClient, _PatchWidget_applyPatchAbortController, _PatchWidget_project, _PatchWidget_patchSources, _PatchWidget_savedToDisk, _PatchWidget_noLogging, _PatchWidget_patchSuggestionState, _PatchWidget_workspaceDiff, _PatchWidget_workspace, _PatchWidget_automaticFileSystem, _PatchWidget_applyToDisconnectedAutomaticWorkspace, _PatchWidget_popoverHelper, _PatchWidget_rpcId, _PatchWidget_onLearnMoreTooltipClick, _PatchWidget_getDisplayedProject, _PatchWidget_shouldShowChangeButton, _PatchWidget_getSelectedProjectType, _PatchWidget_showFreDisclaimerIfNeeded, _PatchWidget_selectDefaultProject, _PatchWidget_onProjectAdded, _PatchWidget_onProjectRemoved, _PatchWidget_showSelectWorkspaceDialog, _PatchWidget_onApplyToWorkspace, _PatchWidget_modifiedFiles_get, _PatchWidget_applyPatchAndUpdateUI, _PatchWidget_onDiscard, _PatchWidget_onSaveAll, _PatchWidget_submitRating, _PatchWidget_applyPatch;
import '../../ui/legacy/legacy.js';
import '../../ui/components/markdown_view/markdown_view.js';
import '../../ui/components/spinners/spinners.js';
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as Root from '../../core/root/root.js';
import * as AiAssistanceModel from '../../models/ai_assistance/ai_assistance.js';
import * as Persistence from '../../models/persistence/persistence.js';
import * as Workspace from '../../models/workspace/workspace.js';
import * as WorkspaceDiff from '../../models/workspace_diff/workspace_diff.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as UI from '../../ui/legacy/legacy.js';
import { Directives, html, nothing, render } from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as ChangesPanel from '../changes/changes.js';
import * as PanelCommon from '../common/common.js';
import { SelectWorkspaceDialog } from './SelectWorkspaceDialog.js';
/*
* Strings that don't need to be translated at this time.
*/
const UIStringsNotTranslate = {
    /**
     *@description Text displayed for showing patch widget view.
     */
    unsavedChanges: 'Unsaved changes',
    /**
     *@description Loading text displayed as a summary title when the patch suggestion is getting loaded
     */
    applyingToWorkspace: 'Applying to workspace…',
    /**
     *@description Button text for staging changes to workspace.
     */
    applyToWorkspace: 'Apply to workspace',
    /**
     *@description Button text to change the selected workspace
     */
    change: 'Change',
    /**
     * @description Accessible title of the Change button to indicate that
     * the button can be used to change the root folder.
     */
    changeRootFolder: 'Change project root folder',
    /**
     *@description Button text to cancel applying to workspace
     */
    cancel: 'Cancel',
    /**
     *@description Button text to discard the suggested changes and not save them to file system
     */
    discard: 'Discard',
    /**
     *@description Button text to save all the suggested changes to file system
     */
    saveAll: 'Save all',
    /**
     *@description Header text after the user saved the changes to the disk.
     */
    savedToDisk: 'Saved to disk',
    /**
     *@description Disclaimer text shown for using code snippets with caution
     */
    codeDisclaimer: 'Use code snippets with caution',
    /**
     *@description Tooltip text for the info icon beside the "Apply to workspace" button
     */
    applyToWorkspaceTooltip: 'Source code from the selected folder is sent to Google to generate code suggestions.',
    /**
     *@description Tooltip text for the info icon beside the "Apply to workspace" button when enterprise logging is off
     */
    applyToWorkspaceTooltipNoLogging: 'Source code from the selected folder is sent to Google to generate code suggestions. This data will not be used to improve Google’s AI models.',
    /**
     *@description The footer disclaimer that links to more information
     * about the AI feature. Same text as in ChatView.
     */
    learnMore: 'Learn about AI in DevTools',
    /**
     *@description Header text for the AI-powered code suggestions disclaimer dialog.
     */
    freDisclaimerHeader: 'Get AI-powered code suggestions for your workspace',
    /**
     *@description First disclaimer item text for the fre dialog.
     */
    freDisclaimerTextAiWontAlwaysGetItRight: 'This feature uses AI and won’t always get it right',
    /**
     *@description Second disclaimer item text for the fre dialog.
     */
    freDisclaimerTextPrivacy: 'Source code from the selected folder is sent to Google to generate code suggestions',
    /**
     *@description Second disclaimer item text for the fre dialog when enterprise logging is off.
     */
    freDisclaimerTextPrivacyNoLogging: 'Source code from the selected folder is sent to Google to generate code suggestions. This data will not be used to improve Google’s AI models.',
    /**
     *@description Third disclaimer item text for the fre dialog.
     */
    freDisclaimerTextUseWithCaution: 'Use generated code snippets with caution',
    /**
     * @description Title of the link opening data that was used to
     * produce a code suggestion.
     */
    viewUploadedFiles: 'View data sent to Google',
    /**
     * @description Text indicating that a link opens in a new tab (for a11y).
     */
    opensInNewTab: '(opens in a new tab)',
    /**
     * @description Generic error text for the case the changes were not applied to the workspace.
     */
    genericErrorMessage: 'Changes couldn’t be applied to your workspace.',
};
const lockedString = i18n.i18n.lockedString;
const CODE_SNIPPET_WARNING_URL = 'https://support.google.com/legal/answer/13505487';
export var PatchSuggestionState;
(function (PatchSuggestionState) {
    /**
     * The user did not attempt patching yet
     */
    PatchSuggestionState["INITIAL"] = "initial";
    /**
     * Applying to page tree is in progress
     */
    PatchSuggestionState["LOADING"] = "loading";
    /**
     * Applying to page tree succeeded
     */
    PatchSuggestionState["SUCCESS"] = "success";
    /**
     * Applying to page tree failed
     */
    PatchSuggestionState["ERROR"] = "error";
})(PatchSuggestionState || (PatchSuggestionState = {}));
var SelectedProjectType;
(function (SelectedProjectType) {
    /**
     * No project selected
     */
    SelectedProjectType["NONE"] = "none";
    /**
     * The selected project is not an automatic workspace project
     */
    SelectedProjectType["REGULAR"] = "regular";
    /**
     * The selected project is a disconnected automatic workspace project
     */
    SelectedProjectType["AUTOMATIC_DISCONNECTED"] = "automaticDisconncted";
    /**
     * The selected project is a connected automatic workspace project
     */
    SelectedProjectType["AUTOMATIC_CONNECTED"] = "automaticConnected";
})(SelectedProjectType || (SelectedProjectType = {}));
export class PatchWidget extends UI.Widget.Widget {
    constructor(element, view, opts) {
        super(false, false, element);
        _PatchWidget_instances.add(this);
        this.changeSummary = '';
        // Whether the user completed first run experience dialog or not.
        _PatchWidget_aiPatchingFreCompletedSetting.set(this, Common.Settings.Settings.instance().createSetting('ai-assistance-patching-fre-completed', false));
        _PatchWidget_projectIdSetting.set(this, Common.Settings.Settings.instance().createSetting('ai-assistance-patching-selected-project-id', ''));
        _PatchWidget_view.set(this, void 0);
        _PatchWidget_viewOutput.set(this, {});
        _PatchWidget_aidaClient.set(this, void 0);
        _PatchWidget_applyPatchAbortController.set(this, void 0);
        _PatchWidget_project.set(this, void 0);
        _PatchWidget_patchSources.set(this, void 0);
        _PatchWidget_savedToDisk.set(this, void 0);
        _PatchWidget_noLogging.set(this, void 0); // Whether the enterprise setting is `ALLOW_WITHOUT_LOGGING` or not.
        _PatchWidget_patchSuggestionState.set(this, PatchSuggestionState.INITIAL);
        _PatchWidget_workspaceDiff.set(this, WorkspaceDiff.WorkspaceDiff.workspaceDiff());
        _PatchWidget_workspace.set(this, Workspace.Workspace.WorkspaceImpl.instance());
        _PatchWidget_automaticFileSystem.set(this, Persistence.AutomaticFileSystemManager.AutomaticFileSystemManager.instance().automaticFileSystem);
        _PatchWidget_applyToDisconnectedAutomaticWorkspace.set(this, false);
        _PatchWidget_popoverHelper.set(this, null);
        // `rpcId` from the `applyPatch` request
        _PatchWidget_rpcId.set(this, null);
        __classPrivateFieldSet(this, _PatchWidget_aidaClient, opts?.aidaClient ?? new Host.AidaClient.AidaClient(), "f");
        __classPrivateFieldSet(this, _PatchWidget_noLogging, Root.Runtime.hostConfig.aidaAvailability?.enterprisePolicyValue ===
            Root.Runtime.GenAiEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING, "f");
        // clang-format off
        __classPrivateFieldSet(this, _PatchWidget_view, view ?? ((input, output, target) => {
            if (!input.changeSummary && input.patchSuggestionState === PatchSuggestionState.INITIAL) {
                return;
            }
            output.tooltipRef = output.tooltipRef ?? Directives.createRef();
            output.changeRef = output.changeRef ?? Directives.createRef();
            output.summaryRef = output.summaryRef ?? Directives.createRef();
            function renderSourcesLink() {
                if (!input.sources) {
                    return nothing;
                }
                return html `<x-link
          class="link"
          title="${UIStringsNotTranslate.viewUploadedFiles} ${UIStringsNotTranslate.opensInNewTab}"
          href="data:text/plain;charset=utf-8,${encodeURIComponent(input.sources)}"
          jslog=${VisualLogging.link('files-used-in-patching').track({ click: true })}>
          ${UIStringsNotTranslate.viewUploadedFiles}
        </x-link>`;
            }
            function renderHeader() {
                if (input.savedToDisk) {
                    return html `
            <devtools-icon class="green-bright-icon summary-badge" .name=${'check-circle'}></devtools-icon>
            <span class="header-text">
              ${lockedString(UIStringsNotTranslate.savedToDisk)}
            </span>
          `;
                }
                if (input.patchSuggestionState === PatchSuggestionState.SUCCESS) {
                    return html `
            <devtools-icon class="on-tonal-icon summary-badge" .name=${'difference'}></devtools-icon>
            <span class="header-text">
              ${lockedString(`File changes in ${input.projectName}`)}
            </span>
            <devtools-icon
              class="arrow"
              .name=${'chevron-down'}
            ></devtools-icon>
          `;
                }
                return html `
          <devtools-icon class="on-tonal-icon summary-badge" .name=${'pen-spark'}></devtools-icon>
          <span class="header-text">
            ${lockedString(UIStringsNotTranslate.unsavedChanges)}
          </span>
          <devtools-icon
            class="arrow"
            .name=${'chevron-down'}
          ></devtools-icon>
        `;
            }
            function renderContent() {
                if ((!input.changeSummary && input.patchSuggestionState === PatchSuggestionState.INITIAL) || input.savedToDisk) {
                    return nothing;
                }
                if (input.patchSuggestionState === PatchSuggestionState.SUCCESS) {
                    return html `<devtools-widget .widgetConfig=${UI.Widget.widgetConfig(ChangesPanel.CombinedDiffView.CombinedDiffView, {
                        workspaceDiff: input.workspaceDiff,
                        // Ignore user creates inspector-stylesheets
                        ignoredUrls: ['inspector://']
                    })}></devtools-widget>`;
                }
                return html `<devtools-code-block
          .code=${input.changeSummary ?? ''}
          .codeLang=${'css'}
          .displayNotice=${true}
        ></devtools-code-block>
        ${input.patchSuggestionState === PatchSuggestionState.ERROR
                    ? html `<div class="error-container">
              <devtools-icon .name=${'cross-circle-filled'}></devtools-icon>${lockedString(UIStringsNotTranslate.genericErrorMessage)} ${renderSourcesLink()}
            </div>`
                    : nothing}`;
            }
            function renderFooter() {
                if (input.savedToDisk) {
                    return nothing;
                }
                if (input.patchSuggestionState === PatchSuggestionState.SUCCESS) {
                    return html `
          <div class="footer">
            <div class="left-side">
              <x-link class="link disclaimer-link" href="https://support.google.com/legal/answer/13505487" jslog=${VisualLogging.link('code-disclaimer').track({
                        click: true,
                    })}>
                ${lockedString(UIStringsNotTranslate.codeDisclaimer)}
              </x-link>
              ${renderSourcesLink()}
            </div>
            <div class="save-or-discard-buttons">
              <devtools-button
                @click=${input.onDiscard}
                .jslogContext=${'patch-widget.discard'}
                .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}>
                  ${lockedString(UIStringsNotTranslate.discard)}
              </devtools-button>
              <devtools-button
                @click=${input.onSaveAll}
                .jslogContext=${'patch-widget.save-all'}
                .variant=${"primary" /* Buttons.Button.Variant.PRIMARY */}>
                  ${lockedString(UIStringsNotTranslate.saveAll)}
              </devtools-button>
            </div>
          </div>
          `;
                }
                const iconName = input.projectType === SelectedProjectType.AUTOMATIC_DISCONNECTED ? 'folder-off' : input.projectType === SelectedProjectType.AUTOMATIC_CONNECTED ? 'folder-asterisk' : 'folder';
                return html `
        <div class="footer">
          ${input.projectName ? html `
            <div class="change-workspace" jslog=${VisualLogging.section('patch-widget.workspace')}>
                <devtools-icon .name=${iconName}></devtools-icon>
                <span class="folder-name" title=${input.projectPath}>${input.projectName}</span>
              ${input.onChangeWorkspaceClick ? html `
                <devtools-button
                  @click=${input.onChangeWorkspaceClick}
                  .jslogContext=${'change-workspace'}
                  .variant=${"text" /* Buttons.Button.Variant.TEXT */}
                  .title=${lockedString(UIStringsNotTranslate.changeRootFolder)}
                  .disabled=${input.patchSuggestionState === PatchSuggestionState.LOADING}
                  ${Directives.ref(output.changeRef)}
                >${lockedString(UIStringsNotTranslate.change)}</devtools-button>
              ` : nothing}
            </div>
          ` : nothing}
          <div class="apply-to-workspace-container" aria-live="polite">
            ${input.patchSuggestionState === PatchSuggestionState.LOADING ? html `
              <div class="loading-text-container" jslog=${VisualLogging.section('patch-widget.apply-to-workspace-loading')}>
                <devtools-spinner></devtools-spinner>
                <span>
                  ${lockedString(UIStringsNotTranslate.applyingToWorkspace)}
                </span>
              </div>
            ` : html `
                <devtools-button
                @click=${input.onApplyToWorkspace}
                .jslogContext=${'patch-widget.apply-to-workspace'}
                .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}>
                ${lockedString(UIStringsNotTranslate.applyToWorkspace)}
              </devtools-button>
            `}
            ${input.patchSuggestionState === PatchSuggestionState.LOADING ? html `<devtools-button
              @click=${input.onCancel}
              .jslogContext=${'cancel'}
              .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}>
              ${lockedString(UIStringsNotTranslate.cancel)}
            </devtools-button>` : nothing}
            <devtools-button
              aria-details="info-tooltip"
              .jslogContext=${'patch-widget.info-tooltip-trigger'}
              .iconName=${'info'}
              .variant=${"icon" /* Buttons.Button.Variant.ICON */}
              .title=${input.applyToWorkspaceTooltipText}
            ></devtools-button>
          </div>
        </div>`;
            }
            // Use a simple div for the "Saved to disk" state as it's not expandable,
            // otherwise use the interactive <details> element.
            const template = input.savedToDisk
                ? html `
          <div class="change-summary saved-to-disk" role="status" aria-live="polite">
            <div class="header-container">
             ${renderHeader()}
             </div>
          </div>`
                : html `
          <details class="change-summary" jslog=${VisualLogging.section('patch-widget')}>
            <summary class="header-container" ${Directives.ref(output.summaryRef)}>
              ${renderHeader()}
            </summary>
            ${renderContent()}
            ${renderFooter()}
          </details>
        `;
            render(template, target, { host: target });
        }), "f");
        // We're using PopoverHelper as a workaround instead of using <devtools-tooltip>. See the bug for more details.
        // TODO: Update here when b/409965560 is fixed.
        __classPrivateFieldSet(this, _PatchWidget_popoverHelper, new UI.PopoverHelper.PopoverHelper(this.contentElement, event => {
            // There are two ways this event is received for showing a popover case:
            // * The latest element on the composed path is `<devtools-button>`
            // * The 2nd element on the composed path is `<devtools-button>` (the last element is the `<button>` inside it.)
            const hoveredNode = event.composedPath()[0];
            const maybeDevToolsButton = event.composedPath()[2];
            const popoverShownNode = hoveredNode instanceof HTMLElement && hoveredNode.getAttribute('aria-details') === 'info-tooltip' ? hoveredNode
                : maybeDevToolsButton instanceof HTMLElement && maybeDevToolsButton.getAttribute('aria-details') === 'info-tooltip' ? maybeDevToolsButton
                    : null;
            if (!popoverShownNode) {
                return null;
            }
            return {
                box: popoverShownNode.boxInWindow(),
                show: async (popover) => {
                    // clang-format off
                    render(html `
            <style>
              .info-tooltip-container {
                max-width: var(--sys-size-28);
                padding: var(--sys-size-4) var(--sys-size-5);

                .tooltip-link {
                  display: block;
                  margin-top: var(--sys-size-4);
                  color: var(--sys-color-primary);
                  padding-left: 0;
                }
              }
            </style>
            <div class="info-tooltip-container">
              ${UIStringsNotTranslate.applyToWorkspaceTooltip}
              <button
                class="link tooltip-link"
                role="link"
                jslog=${VisualLogging.link('open-ai-settings').track({
                        click: true,
                    })}
                @click=${__classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_onLearnMoreTooltipClick)}
              >${lockedString(UIStringsNotTranslate.learnMore)}</button>
            </div>`, popover.contentElement, { host: this });
                    // clang-forat on
                    return true;
                },
            };
        }, 'patch-widget.info-tooltip'), "f");
        __classPrivateFieldGet(this, _PatchWidget_popoverHelper, "f").setTimeout(0);
        // clang-format on
        this.requestUpdate();
    }
    performUpdate() {
        const { projectName, projectPath } = __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_getDisplayedProject).call(this);
        __classPrivateFieldGet(this, _PatchWidget_view, "f").call(this, {
            workspaceDiff: __classPrivateFieldGet(this, _PatchWidget_workspaceDiff, "f"),
            changeSummary: this.changeSummary,
            patchSuggestionState: __classPrivateFieldGet(this, _PatchWidget_patchSuggestionState, "f"),
            sources: __classPrivateFieldGet(this, _PatchWidget_patchSources, "f"),
            projectName,
            projectPath,
            projectType: __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_getSelectedProjectType).call(this, projectPath),
            savedToDisk: __classPrivateFieldGet(this, _PatchWidget_savedToDisk, "f"),
            applyToWorkspaceTooltipText: __classPrivateFieldGet(this, _PatchWidget_noLogging, "f") ?
                lockedString(UIStringsNotTranslate.applyToWorkspaceTooltipNoLogging) :
                lockedString(UIStringsNotTranslate.applyToWorkspaceTooltip),
            onLearnMoreTooltipClick: __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_onLearnMoreTooltipClick).bind(this),
            onApplyToWorkspace: __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_onApplyToWorkspace).bind(this),
            onCancel: () => {
                __classPrivateFieldGet(this, _PatchWidget_applyPatchAbortController, "f")?.abort();
            },
            onDiscard: __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_onDiscard).bind(this),
            onSaveAll: __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_onSaveAll).bind(this),
            onChangeWorkspaceClick: __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_shouldShowChangeButton).call(this) ?
                __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_showSelectWorkspaceDialog).bind(this, { applyPatch: false }) :
                undefined,
        }, __classPrivateFieldGet(this, _PatchWidget_viewOutput, "f"), this.contentElement);
    }
    wasShown() {
        super.wasShown();
        __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_selectDefaultProject).call(this);
        if (isAiAssistancePatchingEnabled()) {
            __classPrivateFieldGet(this, _PatchWidget_workspace, "f").addEventListener(Workspace.Workspace.Events.ProjectAdded, __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_onProjectAdded), this);
            __classPrivateFieldGet(this, _PatchWidget_workspace, "f").addEventListener(Workspace.Workspace.Events.ProjectRemoved, __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_onProjectRemoved), this);
        }
    }
    willHide() {
        __classPrivateFieldSet(this, _PatchWidget_applyToDisconnectedAutomaticWorkspace, false, "f");
        if (isAiAssistancePatchingEnabled()) {
            __classPrivateFieldGet(this, _PatchWidget_workspace, "f").removeEventListener(Workspace.Workspace.Events.ProjectAdded, __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_onProjectAdded), this);
            __classPrivateFieldGet(this, _PatchWidget_workspace, "f").removeEventListener(Workspace.Workspace.Events.ProjectRemoved, __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_onProjectRemoved), this);
        }
    }
}
_PatchWidget_aiPatchingFreCompletedSetting = new WeakMap(), _PatchWidget_projectIdSetting = new WeakMap(), _PatchWidget_view = new WeakMap(), _PatchWidget_viewOutput = new WeakMap(), _PatchWidget_aidaClient = new WeakMap(), _PatchWidget_applyPatchAbortController = new WeakMap(), _PatchWidget_project = new WeakMap(), _PatchWidget_patchSources = new WeakMap(), _PatchWidget_savedToDisk = new WeakMap(), _PatchWidget_noLogging = new WeakMap(), _PatchWidget_patchSuggestionState = new WeakMap(), _PatchWidget_workspaceDiff = new WeakMap(), _PatchWidget_workspace = new WeakMap(), _PatchWidget_automaticFileSystem = new WeakMap(), _PatchWidget_applyToDisconnectedAutomaticWorkspace = new WeakMap(), _PatchWidget_popoverHelper = new WeakMap(), _PatchWidget_rpcId = new WeakMap(), _PatchWidget_instances = new WeakSet(), _PatchWidget_onLearnMoreTooltipClick = function _PatchWidget_onLearnMoreTooltipClick() {
    __classPrivateFieldGet(this, _PatchWidget_viewOutput, "f").tooltipRef?.value?.hidePopover();
    void UI.ViewManager.ViewManager.instance().showView('chrome-ai');
}, _PatchWidget_getDisplayedProject = function _PatchWidget_getDisplayedProject() {
    if (__classPrivateFieldGet(this, _PatchWidget_project, "f")) {
        return {
            projectName: Common.ParsedURL.ParsedURL.encodedPathToRawPathString(__classPrivateFieldGet(this, _PatchWidget_project, "f").displayName()),
            projectPath: Common.ParsedURL.ParsedURL.urlToRawPathString(__classPrivateFieldGet(this, _PatchWidget_project, "f").id(), Host.Platform.isWin()),
        };
    }
    if (__classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f")) {
        return {
            projectName: Common.ParsedURL.ParsedURL.extractName(__classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f").root),
            projectPath: __classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f").root,
        };
    }
    return {
        projectName: '',
        projectPath: Platform.DevToolsPath.EmptyRawPathString,
    };
}, _PatchWidget_shouldShowChangeButton = function _PatchWidget_shouldShowChangeButton() {
    const automaticFileSystemProject = __classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f") ? __classPrivateFieldGet(this, _PatchWidget_workspace, "f").projectForFileSystemRoot(__classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f").root) : null;
    const regularProjects = __classPrivateFieldGet(this, _PatchWidget_workspace, "f").projectsForType(Workspace.Workspace.projectTypes.FileSystem)
        .filter(project => project instanceof Persistence.FileSystemWorkspaceBinding.FileSystem &&
        project.fileSystem().type() ===
            Persistence.PlatformFileSystem.PlatformFileSystemType.WORKSPACE_PROJECT)
        .filter(project => project !== automaticFileSystemProject);
    return regularProjects.length > 0;
}, _PatchWidget_getSelectedProjectType = function _PatchWidget_getSelectedProjectType(projectPath) {
    if (__classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f") && __classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f").root === projectPath) {
        return __classPrivateFieldGet(this, _PatchWidget_project, "f") ? SelectedProjectType.AUTOMATIC_CONNECTED : SelectedProjectType.AUTOMATIC_DISCONNECTED;
    }
    return __classPrivateFieldGet(this, _PatchWidget_project, "f") ? SelectedProjectType.NONE : SelectedProjectType.REGULAR;
}, _PatchWidget_showFreDisclaimerIfNeeded = async function _PatchWidget_showFreDisclaimerIfNeeded() {
    const isAiPatchingFreCompleted = __classPrivateFieldGet(this, _PatchWidget_aiPatchingFreCompletedSetting, "f").get();
    if (isAiPatchingFreCompleted) {
        return true;
    }
    const result = await PanelCommon.FreDialog.show({
        header: { iconName: 'smart-assistant', text: lockedString(UIStringsNotTranslate.freDisclaimerHeader) },
        reminderItems: [
            {
                iconName: 'psychiatry',
                content: lockedString(UIStringsNotTranslate.freDisclaimerTextAiWontAlwaysGetItRight),
            },
            {
                iconName: 'google',
                content: __classPrivateFieldGet(this, _PatchWidget_noLogging, "f") ? lockedString(UIStringsNotTranslate.freDisclaimerTextPrivacyNoLogging) :
                    lockedString(UIStringsNotTranslate.freDisclaimerTextPrivacy),
            },
            {
                iconName: 'warning',
                // clang-format off
                content: html `<x-link
            href=${CODE_SNIPPET_WARNING_URL}
            class="link devtools-link"
            jslog=${VisualLogging.link('code-snippets-explainer.patch-widget').track({
                    click: true
                })}
          >${lockedString(UIStringsNotTranslate.freDisclaimerTextUseWithCaution)}</x-link>`,
                // clang-format on
            }
        ],
        onLearnMoreClick: () => {
            void UI.ViewManager.ViewManager.instance().showView('chrome-ai');
        },
        ariaLabel: lockedString(UIStringsNotTranslate.freDisclaimerHeader),
        learnMoreButtonTitle: lockedString(UIStringsNotTranslate.learnMore),
    });
    if (result) {
        __classPrivateFieldGet(this, _PatchWidget_aiPatchingFreCompletedSetting, "f").set(true);
    }
    return result;
}, _PatchWidget_selectDefaultProject = function _PatchWidget_selectDefaultProject() {
    const project = __classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f") ?
        __classPrivateFieldGet(this, _PatchWidget_workspace, "f").projectForFileSystemRoot(__classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f").root) :
        __classPrivateFieldGet(this, _PatchWidget_workspace, "f").project(__classPrivateFieldGet(this, _PatchWidget_projectIdSetting, "f").get());
    if (project) {
        __classPrivateFieldSet(this, _PatchWidget_project, project, "f");
    }
    else {
        __classPrivateFieldSet(this, _PatchWidget_project, undefined, "f");
        __classPrivateFieldGet(this, _PatchWidget_projectIdSetting, "f").set('');
    }
    this.requestUpdate();
}, _PatchWidget_onProjectAdded = function _PatchWidget_onProjectAdded(event) {
    const addedProject = event.data;
    if (__classPrivateFieldGet(this, _PatchWidget_applyToDisconnectedAutomaticWorkspace, "f") && __classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f") &&
        addedProject === __classPrivateFieldGet(this, _PatchWidget_workspace, "f").projectForFileSystemRoot(__classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f").root)) {
        __classPrivateFieldSet(this, _PatchWidget_applyToDisconnectedAutomaticWorkspace, false, "f");
        __classPrivateFieldSet(this, _PatchWidget_project, addedProject, "f");
        void __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_applyPatchAndUpdateUI).call(this);
    }
    else if (__classPrivateFieldGet(this, _PatchWidget_project, "f") === undefined) {
        __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_selectDefaultProject).call(this);
    }
}, _PatchWidget_onProjectRemoved = function _PatchWidget_onProjectRemoved() {
    if (__classPrivateFieldGet(this, _PatchWidget_project, "f") && !__classPrivateFieldGet(this, _PatchWidget_workspace, "f").project(__classPrivateFieldGet(this, _PatchWidget_project, "f").id())) {
        __classPrivateFieldGet(this, _PatchWidget_projectIdSetting, "f").set('');
        __classPrivateFieldSet(this, _PatchWidget_project, undefined, "f");
        this.requestUpdate();
    }
}, _PatchWidget_showSelectWorkspaceDialog = function _PatchWidget_showSelectWorkspaceDialog(options = { applyPatch: false }) {
    const onProjectSelected = (project) => {
        __classPrivateFieldSet(this, _PatchWidget_project, project, "f");
        __classPrivateFieldGet(this, _PatchWidget_projectIdSetting, "f").set(project.id());
        if (options.applyPatch) {
            void __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_applyPatchAndUpdateUI).call(this);
        }
        else {
            this.requestUpdate();
            void this.updateComplete.then(() => {
                this.contentElement?.querySelector('.apply-to-workspace-container devtools-button')
                    ?.shadowRoot?.querySelector('button')
                    ?.focus();
            });
        }
    };
    SelectWorkspaceDialog.show(onProjectSelected, __classPrivateFieldGet(this, _PatchWidget_project, "f"));
}, _PatchWidget_onApplyToWorkspace = async function _PatchWidget_onApplyToWorkspace() {
    if (!isAiAssistancePatchingEnabled()) {
        return;
    }
    // Show the FRE dialog if needed and only continue when
    // the user accepted the disclaimer.
    const freDisclaimerCompleted = await __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_showFreDisclaimerIfNeeded).call(this);
    if (!freDisclaimerCompleted) {
        return;
    }
    if (__classPrivateFieldGet(this, _PatchWidget_project, "f")) {
        await __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_applyPatchAndUpdateUI).call(this);
    }
    else if (__classPrivateFieldGet(this, _PatchWidget_automaticFileSystem, "f")) {
        __classPrivateFieldSet(this, _PatchWidget_applyToDisconnectedAutomaticWorkspace, true, "f");
        await Persistence.AutomaticFileSystemManager.AutomaticFileSystemManager.instance().connectAutomaticFileSystem(
        /* addIfMissing= */ true);
    }
    else {
        __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_showSelectWorkspaceDialog).call(this, { applyPatch: true });
    }
}, _PatchWidget_modifiedFiles_get = function _PatchWidget_modifiedFiles_get() {
    return __classPrivateFieldGet(this, _PatchWidget_workspaceDiff, "f").modifiedUISourceCodes().filter(modifiedUISourceCode => {
        return !modifiedUISourceCode.url().startsWith('inspector://');
    });
}, _PatchWidget_applyPatchAndUpdateUI = async function _PatchWidget_applyPatchAndUpdateUI() {
    const changeSummary = this.changeSummary;
    if (!changeSummary) {
        throw new Error('Change summary does not exist');
    }
    __classPrivateFieldSet(this, _PatchWidget_patchSuggestionState, PatchSuggestionState.LOADING, "f");
    __classPrivateFieldSet(this, _PatchWidget_rpcId, null, "f");
    this.requestUpdate();
    const { response, processedFiles } = await __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_applyPatch).call(this, changeSummary);
    if (response && 'rpcId' in response && response.rpcId) {
        __classPrivateFieldSet(this, _PatchWidget_rpcId, response.rpcId, "f");
    }
    // Determines if applying the patch resulted in any actual file changes in the workspace.
    // This is crucial because the agent might return an answer (e.g., an explanation)
    // without making any code modifications (i.e., no `writeFile` calls).
    // If no files were modified, we avoid transitioning to a success state,
    // which would otherwise lead to an empty and potentially confusing diff view.
    //
    // Note: The `hasChanges` check below is based on `modifiedUISourceCodes()`, which reflects
    // *all* current modifications in the workspace. It does not differentiate between
    // changes made by this specific AI patch operation versus pre-existing changes
    // made by the user. Consequently, if the AI patch itself makes no changes but the
    // user already had other modified files, the widget will still transition to the
    // success state (displaying all current workspace modifications).
    const hasChanges = __classPrivateFieldGet(this, _PatchWidget_instances, "a", _PatchWidget_modifiedFiles_get).length > 0;
    if (response?.type === "answer" /* AiAssistanceModel.ResponseType.ANSWER */ && hasChanges) {
        __classPrivateFieldSet(this, _PatchWidget_patchSuggestionState, PatchSuggestionState.SUCCESS, "f");
    }
    else if (response?.type === "error" /* AiAssistanceModel.ResponseType.ERROR */ &&
        response.error === "abort" /* AiAssistanceModel.ErrorType.ABORT */) {
        // If this is an abort error, we're returning back to the initial state.
        __classPrivateFieldSet(this, _PatchWidget_patchSuggestionState, PatchSuggestionState.INITIAL, "f");
    }
    else {
        __classPrivateFieldSet(this, _PatchWidget_patchSuggestionState, PatchSuggestionState.ERROR, "f");
    }
    __classPrivateFieldSet(this, _PatchWidget_patchSources, `Filenames in ${__classPrivateFieldGet(this, _PatchWidget_project, "f")?.displayName()}.
Files:
${processedFiles.map(filename => `* ${filename}`).join('\n')}`, "f");
    this.requestUpdate();
    if (__classPrivateFieldGet(this, _PatchWidget_patchSuggestionState, "f") === PatchSuggestionState.SUCCESS) {
        void this.updateComplete.then(() => {
            __classPrivateFieldGet(this, _PatchWidget_viewOutput, "f").summaryRef?.value?.focus();
        });
    }
}, _PatchWidget_onDiscard = function _PatchWidget_onDiscard() {
    for (const modifiedUISourceCode of __classPrivateFieldGet(this, _PatchWidget_instances, "a", _PatchWidget_modifiedFiles_get)) {
        modifiedUISourceCode.resetWorkingCopy();
    }
    __classPrivateFieldSet(this, _PatchWidget_patchSuggestionState, PatchSuggestionState.INITIAL, "f");
    __classPrivateFieldSet(this, _PatchWidget_patchSources, undefined, "f");
    void this.changeManager?.popStashedChanges();
    __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_submitRating).call(this, "NEGATIVE" /* Host.AidaClient.Rating.NEGATIVE */);
    this.requestUpdate();
    void this.updateComplete.then(() => {
        __classPrivateFieldGet(this, _PatchWidget_viewOutput, "f").changeRef?.value?.focus();
    });
}, _PatchWidget_onSaveAll = function _PatchWidget_onSaveAll() {
    for (const modifiedUISourceCode of __classPrivateFieldGet(this, _PatchWidget_instances, "a", _PatchWidget_modifiedFiles_get)) {
        modifiedUISourceCode.commitWorkingCopy();
    }
    void this.changeManager?.stashChanges().then(() => {
        this.changeManager?.dropStashedChanges();
    });
    __classPrivateFieldSet(this, _PatchWidget_savedToDisk, true, "f");
    __classPrivateFieldGet(this, _PatchWidget_instances, "m", _PatchWidget_submitRating).call(this, "POSITIVE" /* Host.AidaClient.Rating.POSITIVE */);
    this.requestUpdate();
}, _PatchWidget_submitRating = function _PatchWidget_submitRating(rating) {
    if (!__classPrivateFieldGet(this, _PatchWidget_rpcId, "f")) {
        return;
    }
    void __classPrivateFieldGet(this, _PatchWidget_aidaClient, "f").registerClientEvent({
        corresponding_aida_rpc_global_id: __classPrivateFieldGet(this, _PatchWidget_rpcId, "f"),
        disable_user_content_logging: true,
        do_conversation_client_event: {
            user_feedback: {
                sentiment: rating,
            },
        },
    });
}, _PatchWidget_applyPatch = async function _PatchWidget_applyPatch(changeSummary) {
    if (!__classPrivateFieldGet(this, _PatchWidget_project, "f")) {
        throw new Error('Project does not exist');
    }
    __classPrivateFieldSet(this, _PatchWidget_applyPatchAbortController, new AbortController(), "f");
    const agent = new AiAssistanceModel.PatchAgent({
        aidaClient: __classPrivateFieldGet(this, _PatchWidget_aidaClient, "f"),
        serverSideLoggingEnabled: false,
        project: __classPrivateFieldGet(this, _PatchWidget_project, "f"),
    });
    const { responses, processedFiles } = await agent.applyChanges(changeSummary, { signal: __classPrivateFieldGet(this, _PatchWidget_applyPatchAbortController, "f").signal });
    return {
        response: responses.at(-1),
        processedFiles,
    };
};
export function isAiAssistancePatchingEnabled() {
    return Boolean(Root.Runtime.hostConfig.devToolsFreestyler?.patching);
}
// @ts-expect-error temporary global function for local testing.
window.aiAssistanceTestPatchPrompt =
    async (projectName, changeSummary, expectedChanges) => {
        if (!isAiAssistancePatchingEnabled()) {
            return;
        }
        const workspaceDiff = WorkspaceDiff.WorkspaceDiff.workspaceDiff();
        const workspace = Workspace.Workspace.WorkspaceImpl.instance();
        const project = workspace.projectsForType(Workspace.Workspace.projectTypes.FileSystem)
            .filter(project => project instanceof Persistence.FileSystemWorkspaceBinding.FileSystem &&
            project.fileSystem().type() ===
                Persistence.PlatformFileSystem.PlatformFileSystemType.WORKSPACE_PROJECT)
            .find(project => project.displayName() === projectName);
        if (!project) {
            throw new Error('project not found');
        }
        const aidaClient = new Host.AidaClient.AidaClient();
        const agent = new AiAssistanceModel.PatchAgent({
            aidaClient,
            serverSideLoggingEnabled: false,
            project,
        });
        try {
            const assertionFailures = [];
            const { processedFiles, responses } = await agent.applyChanges(changeSummary);
            if (responses.at(-1)?.type === "error" /* AiAssistanceModel.ResponseType.ERROR */) {
                return {
                    error: 'failed to patch',
                    debugInfo: {
                        responses,
                        processedFiles,
                    },
                };
            }
            for (const file of processedFiles) {
                const change = expectedChanges.find(change => change.path === file);
                if (!change) {
                    assertionFailures.push(`Patched ${file} that was not expected`);
                    break;
                }
                const agentProject = agent.agentProject;
                const content = await agentProject.readFile(file);
                if (!content) {
                    throw new Error(`${file} has no content`);
                }
                for (const m of change.matches) {
                    if (!content.match(new RegExp(m, 'gm'))) {
                        assertionFailures.push({
                            message: `Did not match ${m} in ${file}`,
                            file,
                            content,
                        });
                    }
                }
                for (const m of change.doesNotMatch || []) {
                    if (content.match(new RegExp(m, 'gm'))) {
                        assertionFailures.push({
                            message: `Unexpectedly matched ${m} in ${file}`,
                            file,
                            content,
                        });
                    }
                }
            }
            return {
                assertionFailures,
                debugInfo: {
                    responses,
                    processedFiles,
                },
            };
        }
        finally {
            workspaceDiff.modifiedUISourceCodes().forEach(modifiedUISourceCode => {
                modifiedUISourceCode.resetWorkingCopy();
            });
        }
    };
//# sourceMappingURL=PatchWidget.js.map