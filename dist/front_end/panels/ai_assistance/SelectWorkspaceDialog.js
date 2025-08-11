// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _SelectWorkspaceDialog_instances, _SelectWorkspaceDialog_view, _SelectWorkspaceDialog_workspace, _SelectWorkspaceDialog_selectedIndex, _SelectWorkspaceDialog_onProjectSelected, _SelectWorkspaceDialog_dialog, _SelectWorkspaceDialog_automaticFileSystemManager, _SelectWorkspaceDialog_folders, _SelectWorkspaceDialog_onListItemKeyDown, _SelectWorkspaceDialog_onSelectButtonClick, _SelectWorkspaceDialog_addFileSystem, _SelectWorkspaceDialog_connectToAutomaticFilesystem, _SelectWorkspaceDialog_updateProjectsAndFolders, _SelectWorkspaceDialog_onProjectAdded, _SelectWorkspaceDialog_onProjectRemoved;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Persistence from '../../models/persistence/persistence.js';
import * as Workspace from '../../models/workspace/workspace.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as UI from '../../ui/legacy/legacy.js';
import { html, nothing, render } from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import selectWorkspaceDialogStyles from './selectWorkspaceDialog.css.js';
/*
* Strings that don't need to be translated at this time.
*/
const UIStringsNotTranslate = {
    /**
     *@description Heading of dialog box which asks user to select a workspace folder.
     */
    selectFolder: 'Select folder',
    /**
     *@description Heading of dialog box which asks user to select a workspace folder for a11y clients.
     */
    selectFolderAccessibleLabel: 'Select a folder to apply changes',
    /**
     *@description Button text for canceling workspace selection.
     */
    cancel: 'Cancel',
    /**
     *@description Button text for confirming the selected workspace folder.
     */
    select: 'Select',
    /*
     *@description Button text for adding a workspace folder.
     */
    addFolder: 'Add folder',
    /*
     *@description Explanation for selecting the correct workspace folder.
     */
    selectProjectRoot: 'To save patches directly to your project, select the project root folder containing the source files of the inspected page. Relevant code snippets will be sent to Google to generate code suggestions.',
};
const lockedString = i18n.i18n.lockedString;
// clang-format off
export const SELECT_WORKSPACE_DIALOG_DEFAULT_VIEW = (input, _output, target) => {
    const hasFolders = input.folders.length > 0;
    render(html `
      <style>${selectWorkspaceDialogStyles}</style>
      <h2 class="dialog-header">${lockedString(UIStringsNotTranslate.selectFolder)}</h2>
      <div class="main-content">
        <div class="select-project-root">${lockedString(UIStringsNotTranslate.selectProjectRoot)}</div>
        ${input.showAutomaticWorkspaceNudge ? html `
          <!-- Hardcoding, because there is no 'getFormatLocalizedString' equivalent for 'lockedString' -->
          <div>
            Tip: provide a
            <x-link
              class="devtools-link"
              href="https://goo.gle/devtools-automatic-workspace-folders"
              jslog=${VisualLogging.link().track({ click: true, keydown: 'Enter|Space' }).context('automatic-workspaces-documentation')}
            >com.chrome.devtools.json</x-link>
            file to automatically connect your project to DevTools.
          </div>
        ` : nothing}
      </div>
      ${hasFolders ? html `
        <ul role="listbox" aria-label=${lockedString(UIStringsNotTranslate.selectFolder)}
          aria-activedescendant=${input.folders.length > 0 ? `option-${input.selectedIndex}` : ''}>
          ${input.folders.map((folder, index) => {
        const optionId = `option-${index}`;
        return html `
              <li
                id=${optionId}
                @mousedown=${() => input.onProjectSelected(index)}
                @keydown=${input.onListItemKeyDown}
                class=${index === input.selectedIndex ? 'selected' : ''}
                aria-selected=${index === input.selectedIndex ? 'true' : 'false'}
                title=${folder.path}
                role="option"
                tabindex=${index === input.selectedIndex ? '0' : '-1'}
              >
                <devtools-icon class="folder-icon" .name=${'folder'}></devtools-icon>
                <span class="ellipsis">${folder.name}</span>
              </li>`;
    })}
        </ul>
      ` : nothing}
      <div class="buttons">
        <devtools-button
          title=${lockedString(UIStringsNotTranslate.cancel)}
          aria-label="Cancel"
          .jslogContext=${'cancel'}
          @click=${input.onCancelButtonClick}
          .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}>${lockedString(UIStringsNotTranslate.cancel)}</devtools-button>
        <devtools-button
          class="add-folder-button"
          title=${lockedString(UIStringsNotTranslate.addFolder)}
          aria-label="Add folder"
          .iconName=${'plus'}
          .jslogContext=${'add-folder'}
          @click=${input.onAddFolderButtonClick}
          .variant=${hasFolders ? "tonal" /* Buttons.Button.Variant.TONAL */ : "primary" /* Buttons.Button.Variant.PRIMARY */}>${lockedString(UIStringsNotTranslate.addFolder)}</devtools-button>
        ${hasFolders ? html `
          <devtools-button
            title=${lockedString(UIStringsNotTranslate.select)}
            aria-label="Select"
            @click=${input.onSelectButtonClick}
            .jslogContext=${'select'}
            .variant=${"primary" /* Buttons.Button.Variant.PRIMARY */}>${lockedString(UIStringsNotTranslate.select)}</devtools-button>
        ` : nothing}
      </div>
    `, target, { host: target });
};
// clang-format on
export class SelectWorkspaceDialog extends UI.Widget.VBox {
    constructor(options, view) {
        super();
        _SelectWorkspaceDialog_instances.add(this);
        _SelectWorkspaceDialog_view.set(this, void 0);
        _SelectWorkspaceDialog_workspace.set(this, Workspace.Workspace.WorkspaceImpl.instance());
        _SelectWorkspaceDialog_selectedIndex.set(this, 0);
        _SelectWorkspaceDialog_onProjectSelected.set(this, void 0);
        _SelectWorkspaceDialog_dialog.set(this, void 0);
        _SelectWorkspaceDialog_automaticFileSystemManager.set(this, Persistence.AutomaticFileSystemManager.AutomaticFileSystemManager.instance());
        _SelectWorkspaceDialog_folders.set(this, []);
        this.element.classList.add('dialog-container');
        __classPrivateFieldSet(this, _SelectWorkspaceDialog_onProjectSelected, options.onProjectSelected, "f");
        __classPrivateFieldSet(this, _SelectWorkspaceDialog_dialog, options.dialog, "f");
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_updateProjectsAndFolders).call(this);
        if (options.currentProject) {
            __classPrivateFieldSet(this, _SelectWorkspaceDialog_selectedIndex, Math.max(0, __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f").findIndex(folder => folder.project === options.currentProject)), "f");
        }
        __classPrivateFieldSet(this, _SelectWorkspaceDialog_view, view ?? SELECT_WORKSPACE_DIALOG_DEFAULT_VIEW, "f");
        this.requestUpdate();
        void this.updateComplete.then(() => {
            this.contentElement?.querySelector('.selected')?.focus();
        });
    }
    wasShown() {
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_workspace, "f").addEventListener(Workspace.Workspace.Events.ProjectAdded, __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_onProjectAdded), this);
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_workspace, "f").addEventListener(Workspace.Workspace.Events.ProjectRemoved, __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_onProjectRemoved), this);
    }
    willHide() {
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_workspace, "f").removeEventListener(Workspace.Workspace.Events.ProjectAdded, __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_onProjectAdded), this);
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_workspace, "f").removeEventListener(Workspace.Workspace.Events.ProjectRemoved, __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_onProjectRemoved), this);
    }
    performUpdate() {
        const viewInput = {
            folders: __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f"),
            selectedIndex: __classPrivateFieldGet(this, _SelectWorkspaceDialog_selectedIndex, "f"),
            showAutomaticWorkspaceNudge: __classPrivateFieldGet(this, _SelectWorkspaceDialog_automaticFileSystemManager, "f").automaticFileSystem === null &&
                __classPrivateFieldGet(this, _SelectWorkspaceDialog_automaticFileSystemManager, "f").availability === 'available',
            onProjectSelected: (index) => {
                __classPrivateFieldSet(this, _SelectWorkspaceDialog_selectedIndex, index, "f");
                this.requestUpdate();
            },
            onSelectButtonClick: __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_onSelectButtonClick).bind(this),
            onCancelButtonClick: () => {
                __classPrivateFieldGet(this, _SelectWorkspaceDialog_dialog, "f").hide();
            },
            onAddFolderButtonClick: () => {
                void __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_addFileSystem).call(this);
            },
            onListItemKeyDown: __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_onListItemKeyDown).bind(this),
        };
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_view, "f").call(this, viewInput, undefined, this.contentElement);
    }
    static show(onProjectSelected, currentProject) {
        const dialog = new UI.Dialog.Dialog('select-workspace');
        dialog.setAriaLabel(UIStringsNotTranslate.selectFolderAccessibleLabel);
        dialog.setMaxContentSize(new UI.Geometry.Size(384, 340));
        dialog.setSizeBehavior("SetExactWidthMaxHeight" /* UI.GlassPane.SizeBehavior.SET_EXACT_WIDTH_MAX_HEIGHT */);
        dialog.setDimmed(true);
        new SelectWorkspaceDialog({ dialog, onProjectSelected, currentProject }).show(dialog.contentElement);
        dialog.show();
    }
}
_SelectWorkspaceDialog_view = new WeakMap(), _SelectWorkspaceDialog_workspace = new WeakMap(), _SelectWorkspaceDialog_selectedIndex = new WeakMap(), _SelectWorkspaceDialog_onProjectSelected = new WeakMap(), _SelectWorkspaceDialog_dialog = new WeakMap(), _SelectWorkspaceDialog_automaticFileSystemManager = new WeakMap(), _SelectWorkspaceDialog_folders = new WeakMap(), _SelectWorkspaceDialog_instances = new WeakSet(), _SelectWorkspaceDialog_onListItemKeyDown = function _SelectWorkspaceDialog_onListItemKeyDown(event) {
    switch (event.key) {
        case 'ArrowDown': {
            event.preventDefault();
            __classPrivateFieldSet(this, _SelectWorkspaceDialog_selectedIndex, Math.min(__classPrivateFieldGet(this, _SelectWorkspaceDialog_selectedIndex, "f") + 1, __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f").length - 1), "f");
            const targetItem = this.contentElement.querySelectorAll('li')[__classPrivateFieldGet(this, _SelectWorkspaceDialog_selectedIndex, "f")];
            targetItem?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            targetItem?.focus({ preventScroll: true });
            this.requestUpdate();
            break;
        }
        case 'ArrowUp': {
            event.preventDefault();
            __classPrivateFieldSet(this, _SelectWorkspaceDialog_selectedIndex, Math.max(__classPrivateFieldGet(this, _SelectWorkspaceDialog_selectedIndex, "f") - 1, 0), "f");
            const targetItem = this.contentElement.querySelectorAll('li')[__classPrivateFieldGet(this, _SelectWorkspaceDialog_selectedIndex, "f")];
            targetItem?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            targetItem?.focus({ preventScroll: true });
            this.requestUpdate();
            break;
        }
        case 'Enter':
            event.preventDefault();
            __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_onSelectButtonClick).call(this);
            break;
    }
}, _SelectWorkspaceDialog_onSelectButtonClick = function _SelectWorkspaceDialog_onSelectButtonClick() {
    const selectedFolder = __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f")[__classPrivateFieldGet(this, _SelectWorkspaceDialog_selectedIndex, "f")];
    if (selectedFolder.project) {
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_dialog, "f").hide();
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_onProjectSelected, "f").call(this, selectedFolder.project);
    }
    else {
        void __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_connectToAutomaticFilesystem).call(this);
    }
}, _SelectWorkspaceDialog_addFileSystem = async function _SelectWorkspaceDialog_addFileSystem() {
    await Persistence.IsolatedFileSystemManager.IsolatedFileSystemManager.instance().addFileSystem();
    this.contentElement?.querySelector('[aria-label="Select"]')?.shadowRoot?.querySelector('button')?.focus();
}, _SelectWorkspaceDialog_connectToAutomaticFilesystem = async function _SelectWorkspaceDialog_connectToAutomaticFilesystem() {
    const success = await __classPrivateFieldGet(this, _SelectWorkspaceDialog_automaticFileSystemManager, "f").connectAutomaticFileSystem(/* addIfMissing= */ true);
    // In the success-case, we will receive a 'ProjectAdded' event and handle it in '#onProjectAdded'.
    // Only the failure-case is handled here.
    if (!success) {
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_dialog, "f").hide();
    }
}, _SelectWorkspaceDialog_updateProjectsAndFolders = function _SelectWorkspaceDialog_updateProjectsAndFolders() {
    __classPrivateFieldSet(this, _SelectWorkspaceDialog_folders, [], "f");
    const automaticFileSystem = __classPrivateFieldGet(this, _SelectWorkspaceDialog_automaticFileSystemManager, "f").automaticFileSystem;
    // The automatic workspace folder is always added in first position.
    if (automaticFileSystem) {
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f").push({
            name: Common.ParsedURL.ParsedURL.extractName(automaticFileSystem.root),
            path: automaticFileSystem.root,
            automaticFileSystem,
        });
    }
    const projects = __classPrivateFieldGet(this, _SelectWorkspaceDialog_workspace, "f").projectsForType(Workspace.Workspace.projectTypes.FileSystem)
        .filter(project => project instanceof Persistence.FileSystemWorkspaceBinding.FileSystem &&
        project.fileSystem().type() ===
            Persistence.PlatformFileSystem.PlatformFileSystemType.WORKSPACE_PROJECT);
    for (const project of projects) {
        // Deduplication prevents a connected automatic workspace folder from being listed twice.
        if (automaticFileSystem && project === __classPrivateFieldGet(this, _SelectWorkspaceDialog_workspace, "f").projectForFileSystemRoot(automaticFileSystem.root)) {
            __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f")[0].project = project;
            continue;
        }
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f").push({
            name: Common.ParsedURL.ParsedURL.encodedPathToRawPathString(project.displayName()),
            path: Common.ParsedURL.ParsedURL.urlToRawPathString(project.id(), Host.Platform.isWin()),
            project,
        });
    }
}, _SelectWorkspaceDialog_onProjectAdded = function _SelectWorkspaceDialog_onProjectAdded(event) {
    const addedProject = event.data;
    // After connecting to an automatic workspace folder, wait for the 'projectAdded' event,
    // then close the dialog and continue with the selected project.
    const automaticFileSystem = __classPrivateFieldGet(this, _SelectWorkspaceDialog_automaticFileSystemManager, "f").automaticFileSystem;
    if (automaticFileSystem && addedProject === __classPrivateFieldGet(this, _SelectWorkspaceDialog_workspace, "f").projectForFileSystemRoot(automaticFileSystem.root)) {
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_dialog, "f").hide();
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_onProjectSelected, "f").call(this, addedProject);
        return;
    }
    __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_updateProjectsAndFolders).call(this);
    const projectIndex = __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f").findIndex(folder => folder.project === addedProject);
    if (projectIndex !== -1) {
        __classPrivateFieldSet(this, _SelectWorkspaceDialog_selectedIndex, projectIndex, "f");
    }
    this.requestUpdate();
    void this.updateComplete.then(() => {
        this.contentElement?.querySelector('.selected')?.scrollIntoView();
    });
}, _SelectWorkspaceDialog_onProjectRemoved = function _SelectWorkspaceDialog_onProjectRemoved() {
    const selectedProject = (__classPrivateFieldGet(this, _SelectWorkspaceDialog_selectedIndex, "f") >= 0 && __classPrivateFieldGet(this, _SelectWorkspaceDialog_selectedIndex, "f") < __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f").length) ?
        __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f")[__classPrivateFieldGet(this, _SelectWorkspaceDialog_selectedIndex, "f")].project :
        null;
    __classPrivateFieldGet(this, _SelectWorkspaceDialog_instances, "m", _SelectWorkspaceDialog_updateProjectsAndFolders).call(this);
    if (selectedProject) {
        const projectIndex = __classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f").findIndex(folder => folder.project === selectedProject);
        // If the previously selected project still exists, select it again.
        // If the previously selected project has been removed, select the project which is now in its
        // position. If the previously selected and now removed project was in last position, select
        // the project which is now in last position.
        __classPrivateFieldSet(this, _SelectWorkspaceDialog_selectedIndex, projectIndex === -1 ? Math.min(__classPrivateFieldGet(this, _SelectWorkspaceDialog_folders, "f").length - 1, __classPrivateFieldGet(this, _SelectWorkspaceDialog_selectedIndex, "f")) : projectIndex, "f");
    }
    else {
        __classPrivateFieldSet(this, _SelectWorkspaceDialog_selectedIndex, 0, "f");
    }
    this.requestUpdate();
};
//# sourceMappingURL=SelectWorkspaceDialog.js.map