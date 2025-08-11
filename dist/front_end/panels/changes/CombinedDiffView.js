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
var _CombinedDiffView_instances, _CombinedDiffView_selectedFileUrl, _CombinedDiffView_workspaceDiff, _CombinedDiffView_modifiedUISourceCodes, _CombinedDiffView_copiedFiles, _CombinedDiffView_view, _CombinedDiffView_viewOutput, _CombinedDiffView_onCopyFileContent, _CombinedDiffView_onFileNameClick, _CombinedDiffView_initializeModifiedUISourceCodes, _CombinedDiffView_onDiffModifiedStatusChanged;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Persistence from '../../models/persistence/persistence.js';
import * as WorkspaceDiff from '../../models/workspace_diff/workspace_diff.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as CopyToClipboard from '../../ui/components/copy_to_clipboard/copy_to_clipboard.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as PanelUtils from '../utils/utils.js';
import combinedDiffViewStyles from './combinedDiffView.css.js';
const COPIED_TO_CLIPBOARD_TEXT_TIMEOUT_MS = 1000;
const { html, Directives: { classMap } } = Lit;
const UIStrings = {
    /**
     * @description The title of the button after it was pressed and the text was copied to clipboard.
     */
    copied: 'Copied to clipboard',
    /**
     * @description The title of the copy file to clipboard button
     * @example {index.css} PH1
     */
    copyFile: 'Copy file {PH1} to clipboard',
};
const str_ = i18n.i18n.registerUIStrings('panels/changes/CombinedDiffView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
function renderSingleDiffView(singleDiffViewInput) {
    const { fileName, fileUrl, mimeType, icon, diff, copied, selectedFileUrl, onCopy, onFileNameClick } = singleDiffViewInput;
    const classes = classMap({
        selected: selectedFileUrl === fileUrl,
    });
    // clang-format off
    return html `
    <details open class=${classes}>
      <summary>
        <div class="summary-left">
          <devtools-icon class="drop-down-icon" .name=${'arrow-drop-down'}></devtools-icon>
          ${icon}
          <button class="file-name-link" jslog=${VisualLogging.action('jump-to-file')} @click=${() => onFileNameClick(fileUrl)}>${fileName}</button>
        </div>
        <div class="summary-right">
          <devtools-button
            .title=${i18nString(UIStrings.copyFile, { PH1: fileName })}
            .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
            .iconName=${'copy'}
            .jslogContext=${'combined-diff-view.copy'}
            .variant=${"icon" /* Buttons.Button.Variant.ICON */}
            @click=${() => onCopy(fileUrl)}
          ></devtools-button>
          ${copied
        ? html `<span class="copied">${i18nString(UIStrings.copied)}</span>`
        : Lit.nothing}
        </div>
      </summary>
      <div class="diff-view-container">
        <devtools-diff-view
          .data=${{ diff, mimeType }}>
        </devtools-diff-view>
      </div>
    </details>
  `;
    // clang-format on
}
export class CombinedDiffView extends UI.Widget.Widget {
    constructor(element, view = (input, output, target) => {
        output.scrollToSelectedDiff = () => {
            target.querySelector('details.selected')?.scrollIntoView();
        };
        Lit.render(html `
      <div class="combined-diff-view">
        ${input.singleDiffViewInputs.map(singleDiffViewInput => renderSingleDiffView(singleDiffViewInput))}
      </div>
    `, target, { host: target });
    }) {
        super(false, false, element);
        _CombinedDiffView_instances.add(this);
        /**
         * Ignores urls that start with any in the list
         */
        this.ignoredUrls = [];
        _CombinedDiffView_selectedFileUrl.set(this, void 0);
        _CombinedDiffView_workspaceDiff.set(this, void 0);
        _CombinedDiffView_modifiedUISourceCodes.set(this, []);
        _CombinedDiffView_copiedFiles.set(this, {});
        _CombinedDiffView_view.set(this, void 0);
        _CombinedDiffView_viewOutput.set(this, {});
        this.registerRequiredCSS(combinedDiffViewStyles);
        __classPrivateFieldSet(this, _CombinedDiffView_view, view, "f");
    }
    wasShown() {
        super.wasShown();
        __classPrivateFieldGet(this, _CombinedDiffView_workspaceDiff, "f")?.addEventListener("ModifiedStatusChanged" /* WorkspaceDiff.WorkspaceDiff.Events.MODIFIED_STATUS_CHANGED */, __classPrivateFieldGet(this, _CombinedDiffView_instances, "m", _CombinedDiffView_onDiffModifiedStatusChanged), this);
        void __classPrivateFieldGet(this, _CombinedDiffView_instances, "m", _CombinedDiffView_initializeModifiedUISourceCodes).call(this);
    }
    willHide() {
        __classPrivateFieldGet(this, _CombinedDiffView_workspaceDiff, "f")?.removeEventListener("ModifiedStatusChanged" /* WorkspaceDiff.WorkspaceDiff.Events.MODIFIED_STATUS_CHANGED */, __classPrivateFieldGet(this, _CombinedDiffView_instances, "m", _CombinedDiffView_onDiffModifiedStatusChanged), this);
    }
    set workspaceDiff(workspaceDiff) {
        __classPrivateFieldSet(this, _CombinedDiffView_workspaceDiff, workspaceDiff, "f");
        void __classPrivateFieldGet(this, _CombinedDiffView_instances, "m", _CombinedDiffView_initializeModifiedUISourceCodes).call(this);
    }
    set selectedFileUrl(fileUrl) {
        __classPrivateFieldSet(this, _CombinedDiffView_selectedFileUrl, fileUrl, "f");
        this.requestUpdate();
        void this.updateComplete.then(() => {
            __classPrivateFieldGet(this, _CombinedDiffView_viewOutput, "f").scrollToSelectedDiff?.();
        });
    }
    async performUpdate() {
        const uiSourceCodeAndDiffs = (await Promise.all(__classPrivateFieldGet(this, _CombinedDiffView_modifiedUISourceCodes, "f").map(async (modifiedUISourceCode) => {
            for (const ignoredUrl of this.ignoredUrls) {
                if (modifiedUISourceCode.url().startsWith(ignoredUrl)) {
                    return;
                }
            }
            // `requestDiff` caches the response from the previous `requestDiff` calls if the file did not change
            // so we can safely call it here without concerns for performance.
            const diffResponse = await __classPrivateFieldGet(this, _CombinedDiffView_workspaceDiff, "f")?.requestDiff(modifiedUISourceCode);
            return {
                diff: diffResponse?.diff ?? [],
                uiSourceCode: modifiedUISourceCode,
            };
        }))).filter(uiSourceCodeAndDiff => !!uiSourceCodeAndDiff);
        const singleDiffViewInputs = uiSourceCodeAndDiffs.map(({ uiSourceCode, diff }) => {
            let displayText = uiSourceCode.fullDisplayName();
            // If the UISourceCode is backed by a workspace, we show the path as "{workspace-name}/path/relative/to/workspace"
            const fileSystemUiSourceCode = Persistence.Persistence.PersistenceImpl.instance().fileSystem(uiSourceCode);
            if (fileSystemUiSourceCode) {
                displayText = [
                    fileSystemUiSourceCode.project().displayName(),
                    ...Persistence.FileSystemWorkspaceBinding.FileSystemWorkspaceBinding.relativePath(fileSystemUiSourceCode)
                ].join('/');
            }
            return {
                diff,
                fileName: `${uiSourceCode.isDirty() ? '*' : ''}${displayText}`,
                fileUrl: uiSourceCode.url(),
                mimeType: uiSourceCode.mimeType(),
                icon: PanelUtils.PanelUtils.getIconForSourceFile(uiSourceCode),
                copied: __classPrivateFieldGet(this, _CombinedDiffView_copiedFiles, "f")[uiSourceCode.url()],
                selectedFileUrl: __classPrivateFieldGet(this, _CombinedDiffView_selectedFileUrl, "f"),
                onCopy: __classPrivateFieldGet(this, _CombinedDiffView_instances, "m", _CombinedDiffView_onCopyFileContent).bind(this),
                onFileNameClick: __classPrivateFieldGet(this, _CombinedDiffView_instances, "m", _CombinedDiffView_onFileNameClick).bind(this),
            };
        });
        __classPrivateFieldGet(this, _CombinedDiffView_view, "f").call(this, { singleDiffViewInputs }, __classPrivateFieldGet(this, _CombinedDiffView_viewOutput, "f"), this.contentElement);
    }
}
_CombinedDiffView_selectedFileUrl = new WeakMap(), _CombinedDiffView_workspaceDiff = new WeakMap(), _CombinedDiffView_modifiedUISourceCodes = new WeakMap(), _CombinedDiffView_copiedFiles = new WeakMap(), _CombinedDiffView_view = new WeakMap(), _CombinedDiffView_viewOutput = new WeakMap(), _CombinedDiffView_instances = new WeakSet(), _CombinedDiffView_onCopyFileContent = async function _CombinedDiffView_onCopyFileContent(fileUrl) {
    const file = __classPrivateFieldGet(this, _CombinedDiffView_modifiedUISourceCodes, "f").find(uiSource => uiSource.url() === fileUrl);
    if (!file) {
        return;
    }
    const content = file.workingCopyContentData();
    if (!content.isTextContent) {
        return;
    }
    CopyToClipboard.copyTextToClipboard(content.text, i18nString(UIStrings.copied));
    __classPrivateFieldGet(this, _CombinedDiffView_copiedFiles, "f")[fileUrl] = true;
    this.requestUpdate();
    setTimeout(() => {
        delete __classPrivateFieldGet(this, _CombinedDiffView_copiedFiles, "f")[fileUrl];
        this.requestUpdate();
    }, COPIED_TO_CLIPBOARD_TEXT_TIMEOUT_MS);
}, _CombinedDiffView_onFileNameClick = function _CombinedDiffView_onFileNameClick(fileUrl) {
    const uiSourceCode = __classPrivateFieldGet(this, _CombinedDiffView_modifiedUISourceCodes, "f").find(uiSourceCode => uiSourceCode.url() === fileUrl);
    void Common.Revealer.reveal(uiSourceCode);
}, _CombinedDiffView_initializeModifiedUISourceCodes = async function _CombinedDiffView_initializeModifiedUISourceCodes() {
    if (!__classPrivateFieldGet(this, _CombinedDiffView_workspaceDiff, "f")) {
        return;
    }
    const currentModifiedUISourceCodes = __classPrivateFieldGet(this, _CombinedDiffView_modifiedUISourceCodes, "f");
    const nextModifiedUISourceCodes = __classPrivateFieldGet(this, _CombinedDiffView_workspaceDiff, "f").modifiedUISourceCodes();
    // Find the now non modified UI source codes and unsubscribe from their diff changes.
    const nowNonModifiedUISourceCodes = currentModifiedUISourceCodes.filter(uiSourceCode => !nextModifiedUISourceCodes.includes(uiSourceCode));
    nowNonModifiedUISourceCodes.forEach(nonModifiedUISourceCode => __classPrivateFieldGet(this, _CombinedDiffView_workspaceDiff, "f")?.unsubscribeFromDiffChange(nonModifiedUISourceCode, this.requestUpdate, this));
    // Find the newly modified UI source codes and subscribe for their diff changes.
    const newlyModifiedUISourceCodes = nextModifiedUISourceCodes.filter(uiSourceCode => !currentModifiedUISourceCodes.includes(uiSourceCode));
    newlyModifiedUISourceCodes.forEach(modifiedUISourceCode => __classPrivateFieldGet(this, _CombinedDiffView_workspaceDiff, "f")?.subscribeToDiffChange(modifiedUISourceCode, this.requestUpdate, this));
    __classPrivateFieldSet(this, _CombinedDiffView_modifiedUISourceCodes, nextModifiedUISourceCodes, "f");
    if (this.isShowing()) {
        this.requestUpdate();
    }
}, _CombinedDiffView_onDiffModifiedStatusChanged = async function _CombinedDiffView_onDiffModifiedStatusChanged() {
    if (!__classPrivateFieldGet(this, _CombinedDiffView_workspaceDiff, "f")) {
        return;
    }
    await __classPrivateFieldGet(this, _CombinedDiffView_instances, "m", _CombinedDiffView_initializeModifiedUISourceCodes).call(this);
};
//# sourceMappingURL=CombinedDiffView.js.map