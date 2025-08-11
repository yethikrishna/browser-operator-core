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
var _ContentProviderBasedProject_isServiceProject, _ContentProviderBasedProject_uiSourceCodeToData;
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
const UIStrings = {
    /**
     * @description Error message that is displayed in the Sources panel when can't be loaded.
     */
    unknownErrorLoadingFile: 'Unknown error loading file',
};
const str_ = i18n.i18n.registerUIStrings('models/bindings/ContentProviderBasedProject.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ContentProviderBasedProject extends Workspace.Workspace.ProjectStore {
    constructor(workspace, id, type, displayName, isServiceProject) {
        super(workspace, id, type, displayName);
        _ContentProviderBasedProject_isServiceProject.set(this, void 0);
        _ContentProviderBasedProject_uiSourceCodeToData.set(this, new WeakMap());
        __classPrivateFieldSet(this, _ContentProviderBasedProject_isServiceProject, isServiceProject, "f");
        workspace.addProject(this);
    }
    async requestFileContent(uiSourceCode) {
        const { contentProvider } = __classPrivateFieldGet(this, _ContentProviderBasedProject_uiSourceCodeToData, "f").get(uiSourceCode);
        try {
            return await contentProvider.requestContentData();
        }
        catch (err) {
            // TODO(rob.paveza): CRBug 1013683 - Consider propagating exceptions full-stack
            return {
                error: err ? String(err) : i18nString(UIStrings.unknownErrorLoadingFile),
            };
        }
    }
    isServiceProject() {
        return __classPrivateFieldGet(this, _ContentProviderBasedProject_isServiceProject, "f");
    }
    async requestMetadata(uiSourceCode) {
        const { metadata } = __classPrivateFieldGet(this, _ContentProviderBasedProject_uiSourceCodeToData, "f").get(uiSourceCode);
        return metadata;
    }
    canSetFileContent() {
        return false;
    }
    async setFileContent(_uiSourceCode, _newContent, _isBase64) {
    }
    fullDisplayName(uiSourceCode) {
        let parentPath = uiSourceCode.parentURL().replace(/^(?:https?|file)\:\/\//, '');
        try {
            parentPath = decodeURI(parentPath);
        }
        catch {
        }
        return parentPath + '/' + uiSourceCode.displayName(true);
    }
    mimeType(uiSourceCode) {
        const { mimeType } = __classPrivateFieldGet(this, _ContentProviderBasedProject_uiSourceCodeToData, "f").get(uiSourceCode);
        return mimeType;
    }
    canRename() {
        return false;
    }
    rename(_uiSourceCode, _newName, callback) {
        callback(false);
    }
    excludeFolder(_path) {
    }
    canExcludeFolder(_path) {
        return false;
    }
    async createFile(_path, _name, _content, _isBase64) {
        return null;
    }
    canCreateFile() {
        return false;
    }
    deleteFile(_uiSourceCode) {
    }
    remove() {
    }
    searchInFileContent(uiSourceCode, query, caseSensitive, isRegex) {
        const { contentProvider } = __classPrivateFieldGet(this, _ContentProviderBasedProject_uiSourceCodeToData, "f").get(uiSourceCode);
        return contentProvider.searchInContent(query, caseSensitive, isRegex);
    }
    async findFilesMatchingSearchRequest(searchConfig, filesMatchingFileQuery, progress) {
        const result = new Map();
        progress.setTotalWork(filesMatchingFileQuery.length);
        await Promise.all(filesMatchingFileQuery.map(searchInContent.bind(this)));
        progress.done();
        return result;
        async function searchInContent(uiSourceCode) {
            let allMatchesFound = true;
            let matches = [];
            for (const query of searchConfig.queries().slice()) {
                const searchMatches = await this.searchInFileContent(uiSourceCode, query, !searchConfig.ignoreCase(), searchConfig.isRegex());
                if (!searchMatches.length) {
                    allMatchesFound = false;
                    break;
                }
                matches = Platform.ArrayUtilities.mergeOrdered(matches, searchMatches, TextUtils.ContentProvider.SearchMatch.comparator);
            }
            if (allMatchesFound) {
                result.set(uiSourceCode, matches);
            }
            progress.incrementWorked(1);
        }
    }
    indexContent(progress) {
        queueMicrotask(progress.done.bind(progress));
    }
    addUISourceCodeWithProvider(uiSourceCode, contentProvider, metadata, mimeType) {
        __classPrivateFieldGet(this, _ContentProviderBasedProject_uiSourceCodeToData, "f").set(uiSourceCode, { mimeType, metadata, contentProvider });
        this.addUISourceCode(uiSourceCode);
    }
    addContentProvider(url, contentProvider, mimeType) {
        const uiSourceCode = this.createUISourceCode(url, contentProvider.contentType());
        this.addUISourceCodeWithProvider(uiSourceCode, contentProvider, null, mimeType);
        return uiSourceCode;
    }
    reset() {
        this.removeProject();
        this.workspace().addProject(this);
    }
    dispose() {
        this.removeProject();
    }
}
_ContentProviderBasedProject_isServiceProject = new WeakMap(), _ContentProviderBasedProject_uiSourceCodeToData = new WeakMap();
//# sourceMappingURL=ContentProviderBasedProject.js.map