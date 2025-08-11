/*
 * Copyright (C) 2013 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
var _EditFileSystemView_instances, _a, _EditFileSystemView_fileSystem, _EditFileSystemView_excludedFolderPaths, _EditFileSystemView_view, _EditFileSystemView_resyncExcludedFolderPaths, _EditFileSystemView_onCreate, _EditFileSystemView_onEdit, _EditFileSystemView_onDelete, _EditFileSystemView_validateFolder, _EditFileSystemView_normalizePrefix;
import '../../ui/legacy/components/data_grid/data_grid.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as UI from '../../ui/legacy/legacy.js';
import { Directives, html, render } from '../../ui/lit/lit.js';
import editFileSystemViewStyles from './editFileSystemView.css.js';
const { styleMap } = Directives;
const UIStrings = {
    /**
     *@description Text in Edit File System View of the Workspace settings in Settings to indicate that the following string is a folder URL
     */
    url: 'URL',
    /**
     *@description Text in Edit File System View of the Workspace settings in Settings
     */
    excludedFolders: 'Excluded sub-folders',
    /**
     *@description Error message when a file system path is an empty string.
     */
    enterAPath: 'Enter a path',
    /**
     *@description Error message when a file system path is identical to an existing path.
     */
    enterAUniquePath: 'Enter a unique path',
};
const str_ = i18n.i18n.registerUIStrings('models/persistence/EditFileSystemView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var ExcludedFolderStatus;
(function (ExcludedFolderStatus) {
    ExcludedFolderStatus[ExcludedFolderStatus["VALID"] = 1] = "VALID";
    ExcludedFolderStatus[ExcludedFolderStatus["ERROR_NOT_A_PATH"] = 2] = "ERROR_NOT_A_PATH";
    ExcludedFolderStatus[ExcludedFolderStatus["ERROR_NOT_UNIQUE"] = 3] = "ERROR_NOT_UNIQUE";
})(ExcludedFolderStatus || (ExcludedFolderStatus = {}));
function statusString(status) {
    switch (status) {
        case 2 /* ExcludedFolderStatus.ERROR_NOT_A_PATH */:
            return i18nString(UIStrings.enterAPath);
        case 3 /* ExcludedFolderStatus.ERROR_NOT_UNIQUE */:
            return i18nString(UIStrings.enterAUniquePath);
        case 1 /* ExcludedFolderStatus.VALID */:
            throw new Error('unreachable');
    }
}
export const DEFAULT_VIEW = (input, _output, target) => {
    // clang-format off
    render(html `
      <style>${editFileSystemViewStyles}</style>
      <div class="excluded-folder-header">
        <span>${i18nString(UIStrings.url)}</span>
        <span class="excluded-folder-url">${input.fileSystemPath}</span>
        <devtools-data-grid
          @create=${input.onCreate}
          @edit=${input.onEdit}
          @delete=${input.onDelete}
          class="exclude-subfolders-table"
          parts="excluded-folder-row-with-error"
          inline striped>
          <table>
            <thead>
              <tr>
                <th id="url" editable>${i18nString(UIStrings.excludedFolders)}</th>
              </tr>
            </thead>
            <tbody>
            ${input.excludedFolderPaths.map((path, index) => html `
              <tr data-url=${path.path} data-index=${index}>
                <td style=${styleMap({ backgroundColor: path.status !== 1 /* ExcludedFolderStatus.VALID */ ? 'var(--sys-color-error-container)' : undefined })}>${path.path}</td>
              </tr>
            `)}
            <tr placeholder></tr>
            </tbody>
          </table>
        </devtools-data-grid>
        ${input.excludedFolderPaths.filter(({ status }) => status !== 1 /* ExcludedFolderStatus.VALID */).map(({ status }) => html `<span class="excluded-folder-error">${statusString(status)}</span>`)}
    </div>`, target, { host: input });
    // clang-format on
};
export class EditFileSystemView extends UI.Widget.VBox {
    constructor(element, view = DEFAULT_VIEW) {
        super(undefined, undefined, element);
        _EditFileSystemView_instances.add(this);
        _EditFileSystemView_fileSystem.set(this, void 0);
        _EditFileSystemView_excludedFolderPaths.set(this, []);
        _EditFileSystemView_view.set(this, void 0);
        __classPrivateFieldSet(this, _EditFileSystemView_view, view, "f");
    }
    set fileSystem(fileSystem) {
        __classPrivateFieldSet(this, _EditFileSystemView_fileSystem, fileSystem, "f");
        __classPrivateFieldGet(this, _EditFileSystemView_instances, "m", _EditFileSystemView_resyncExcludedFolderPaths).call(this);
        this.requestUpdate();
    }
    wasShown() {
        __classPrivateFieldGet(this, _EditFileSystemView_instances, "m", _EditFileSystemView_resyncExcludedFolderPaths).call(this);
        this.requestUpdate();
    }
    performUpdate() {
        const input = {
            fileSystemPath: __classPrivateFieldGet(this, _EditFileSystemView_fileSystem, "f")?.path() ?? Platform.DevToolsPath.urlString ``,
            excludedFolderPaths: __classPrivateFieldGet(this, _EditFileSystemView_excludedFolderPaths, "f"),
            onCreate: e => __classPrivateFieldGet(this, _EditFileSystemView_instances, "m", _EditFileSystemView_onCreate).call(this, e.detail.url),
            onEdit: e => __classPrivateFieldGet(this, _EditFileSystemView_instances, "m", _EditFileSystemView_onEdit).call(this, e.detail.node.dataset.index ?? '-1', e.detail.valueBeforeEditing, e.detail.newText),
            onDelete: e => __classPrivateFieldGet(this, _EditFileSystemView_instances, "m", _EditFileSystemView_onDelete).call(this, e.detail.dataset.index ?? '-1'),
        };
        __classPrivateFieldGet(this, _EditFileSystemView_view, "f").call(this, input, {}, this.contentElement);
    }
}
_a = EditFileSystemView, _EditFileSystemView_fileSystem = new WeakMap(), _EditFileSystemView_excludedFolderPaths = new WeakMap(), _EditFileSystemView_view = new WeakMap(), _EditFileSystemView_instances = new WeakSet(), _EditFileSystemView_resyncExcludedFolderPaths = function _EditFileSystemView_resyncExcludedFolderPaths() {
    __classPrivateFieldSet(this, _EditFileSystemView_excludedFolderPaths, __classPrivateFieldGet(this, _EditFileSystemView_fileSystem, "f")?.excludedFolders()
        .values()
        .map(path => ({ path, status: 1 /* ExcludedFolderStatus.VALID */ }))
        .toArray() ??
        [], "f");
}, _EditFileSystemView_onCreate = function _EditFileSystemView_onCreate(url) {
    if (url === undefined) {
        // The data grid fires onCreate even when the user just selects and then deselects the
        // creation row. Ignore those occurrences.
        return;
    }
    const pathWithStatus = __classPrivateFieldGet(this, _EditFileSystemView_instances, "m", _EditFileSystemView_validateFolder).call(this, url);
    __classPrivateFieldGet(this, _EditFileSystemView_excludedFolderPaths, "f").push(pathWithStatus);
    if (pathWithStatus.status === 1 /* ExcludedFolderStatus.VALID */) {
        __classPrivateFieldGet(this, _EditFileSystemView_fileSystem, "f")?.addExcludedFolder(pathWithStatus.path);
    }
    this.requestUpdate();
}, _EditFileSystemView_onEdit = function _EditFileSystemView_onEdit(idx, valueBeforeEditing, newText) {
    const index = Number.parseInt(idx, 10);
    if (index < 0 || index >= __classPrivateFieldGet(this, _EditFileSystemView_excludedFolderPaths, "f").length) {
        return;
    }
    const pathWithStatus = __classPrivateFieldGet(this, _EditFileSystemView_instances, "m", _EditFileSystemView_validateFolder).call(this, newText);
    const oldPathWithStatus = __classPrivateFieldGet(this, _EditFileSystemView_excludedFolderPaths, "f")[index];
    __classPrivateFieldGet(this, _EditFileSystemView_excludedFolderPaths, "f")[index] = pathWithStatus;
    if (oldPathWithStatus.status === 1 /* ExcludedFolderStatus.VALID */) {
        __classPrivateFieldGet(this, _EditFileSystemView_fileSystem, "f")?.removeExcludedFolder(valueBeforeEditing);
    }
    if (pathWithStatus.status === 1 /* ExcludedFolderStatus.VALID */) {
        __classPrivateFieldGet(this, _EditFileSystemView_fileSystem, "f")?.addExcludedFolder(pathWithStatus.path);
    }
    this.requestUpdate();
}, _EditFileSystemView_onDelete = function _EditFileSystemView_onDelete(idx) {
    const index = Number.parseInt(idx, 10);
    if (index < 0 || index >= __classPrivateFieldGet(this, _EditFileSystemView_excludedFolderPaths, "f").length) {
        return;
    }
    __classPrivateFieldGet(this, _EditFileSystemView_fileSystem, "f")?.removeExcludedFolder(__classPrivateFieldGet(this, _EditFileSystemView_excludedFolderPaths, "f")[index].path);
    __classPrivateFieldGet(this, _EditFileSystemView_excludedFolderPaths, "f").splice(index, 1);
    this.requestUpdate();
}, _EditFileSystemView_validateFolder = function _EditFileSystemView_validateFolder(rawInput) {
    const path = __classPrivateFieldGet(_a, _a, "m", _EditFileSystemView_normalizePrefix).call(_a, rawInput.trim());
    if (!path) {
        return { path, status: 2 /* ExcludedFolderStatus.ERROR_NOT_A_PATH */ };
    }
    if (__classPrivateFieldGet(this, _EditFileSystemView_excludedFolderPaths, "f").findIndex(({ path: p }) => p === path) !== -1) {
        return { path, status: 3 /* ExcludedFolderStatus.ERROR_NOT_UNIQUE */ };
    }
    return { path, status: 1 /* ExcludedFolderStatus.VALID */ };
}, _EditFileSystemView_normalizePrefix = function _EditFileSystemView_normalizePrefix(prefix) {
    if (!prefix) {
        return '';
    }
    return prefix + (prefix[prefix.length - 1] === '/' ? '' : '/');
};
//# sourceMappingURL=EditFileSystemView.js.map