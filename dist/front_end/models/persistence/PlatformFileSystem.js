// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _PlatformFileSystem_path, _PlatformFileSystem_type;
import * as i18n from '../../core/i18n/i18n.js';
const UIStrings = {
    /**
     * @description Assertion error message when failing to load a file.
     */
    unableToReadFilesWithThis: '`PlatformFileSystem` cannot read files.',
};
const str_ = i18n.i18n.registerUIStrings('models/persistence/PlatformFileSystem.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var PlatformFileSystemType;
(function (PlatformFileSystemType) {
    /**
     * Snippets are implemented as a PlatformFileSystem but they are
     * actually stored in the browser's profile directory and do not
     * create files on the actual filesystem.
     *
     * See Sources > Snippets in the UI.
     */
    PlatformFileSystemType["SNIPPETS"] = "snippets";
    /**
     * Overrides is a filesystem that represents a user-selected folder on
     * disk. This folder is used to replace page resources using request
     * interception.
     *
     * See Sources > Overrides in the UI.
     */
    PlatformFileSystemType["OVERRIDES"] = "overrides";
    /**
     * Represents a filesystem for a workspace folder that the user added
     * to DevTools. It can be manually connected or it can be
     * automatically discovered based on the hints found in devtools.json
     * served by the inspected page (see
     * https://goo.gle/devtools-json-design). DevTools tries to map the
     * page content to the content in such folder but does not use request
     * interception for this.
     */
    PlatformFileSystemType["WORKSPACE_PROJECT"] = "workspace-project";
})(PlatformFileSystemType || (PlatformFileSystemType = {}));
export class PlatformFileSystem {
    constructor(path, type, automatic) {
        _PlatformFileSystem_path.set(this, void 0);
        _PlatformFileSystem_type.set(this, void 0);
        __classPrivateFieldSet(this, _PlatformFileSystem_path, path, "f");
        __classPrivateFieldSet(this, _PlatformFileSystem_type, type, "f");
        this.automatic = automatic;
    }
    getMetadata(_path) {
        return Promise.resolve(null);
    }
    initialFilePaths() {
        return [];
    }
    initialGitFolders() {
        return [];
    }
    path() {
        return __classPrivateFieldGet(this, _PlatformFileSystem_path, "f");
    }
    embedderPath() {
        throw new Error('Not implemented');
    }
    type() {
        return __classPrivateFieldGet(this, _PlatformFileSystem_type, "f");
    }
    async createFile(_path, _name) {
        return await Promise.resolve(null);
    }
    deleteFile(_path) {
        return Promise.resolve(false);
    }
    deleteDirectoryRecursively(_path) {
        return Promise.resolve(false);
    }
    requestFileBlob(_path) {
        return Promise.resolve(null);
    }
    async requestFileContent(_path) {
        return { error: i18nString(UIStrings.unableToReadFilesWithThis) };
    }
    setFileContent(_path, _content, _isBase64) {
        throw new Error('Not implemented');
    }
    renameFile(_path, _newName, callback) {
        callback(false);
    }
    addExcludedFolder(_path) {
    }
    removeExcludedFolder(_path) {
    }
    fileSystemRemoved() {
    }
    isFileExcluded(_folderPath) {
        return false;
    }
    excludedFolders() {
        return new Set();
    }
    searchInPath(_query, _progress) {
        return Promise.resolve([]);
    }
    indexContent(progress) {
        queueMicrotask(() => {
            progress.done();
        });
    }
    mimeFromPath(_path) {
        throw new Error('Not implemented');
    }
    canExcludeFolder(_path) {
        return false;
    }
    contentType(_path) {
        throw new Error('Not implemented');
    }
    tooltipForURL(_url) {
        throw new Error('Not implemented');
    }
    supportsAutomapping() {
        throw new Error('Not implemented');
    }
}
_PlatformFileSystem_path = new WeakMap(), _PlatformFileSystem_type = new WeakMap();
//# sourceMappingURL=PlatformFileSystem.js.map