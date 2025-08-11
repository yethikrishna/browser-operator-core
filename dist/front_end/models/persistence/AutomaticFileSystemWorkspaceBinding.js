// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _FileSystem_workspace, _AutomaticFileSystemWorkspaceBinding_instances, _AutomaticFileSystemWorkspaceBinding_automaticFileSystemManager, _AutomaticFileSystemWorkspaceBinding_fileSystem, _AutomaticFileSystemWorkspaceBinding_isolatedFileSystemManager, _AutomaticFileSystemWorkspaceBinding_workspace, _AutomaticFileSystemWorkspaceBinding_dispose, _AutomaticFileSystemWorkspaceBinding_update;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as Workspace from '../workspace/workspace.js';
import { Events as IsolatedFileSystemManagerEvents } from './IsolatedFileSystemManager.js';
/**
 * Placeholder project that acts as an empty file system within the workspace,
 * and automatically disappears when the user connects the automatic workspace
 * folder.
 *
 * @see AutomaticFileSystemWorkspaceBinding
 */
export class FileSystem {
    constructor(automaticFileSystem, automaticFileSystemManager, workspace) {
        _FileSystem_workspace.set(this, void 0);
        this.automaticFileSystem = automaticFileSystem;
        this.automaticFileSystemManager = automaticFileSystemManager;
        __classPrivateFieldSet(this, _FileSystem_workspace, workspace, "f");
    }
    workspace() {
        return __classPrivateFieldGet(this, _FileSystem_workspace, "f");
    }
    id() {
        return `${this.type()}:${this.automaticFileSystem.root}:${this.automaticFileSystem.uuid}`;
    }
    type() {
        return Workspace.Workspace.projectTypes.ConnectableFileSystem;
    }
    isServiceProject() {
        return false;
    }
    displayName() {
        const { root } = this.automaticFileSystem;
        let slash = root.lastIndexOf('/');
        if (slash === -1 && Host.Platform.isWin()) {
            slash = root.lastIndexOf('\\');
        }
        return root.substr(slash + 1);
    }
    async requestMetadata(_uiSourceCode) {
        throw new Error('Not implemented');
    }
    async requestFileContent(_uiSourceCode) {
        throw new Error('Not implemented');
    }
    canSetFileContent() {
        return false;
    }
    async setFileContent(_uiSourceCode, _newContent, _isBase64) {
        throw new Error('Not implemented');
    }
    fullDisplayName(_uiSourceCode) {
        throw new Error('Not implemented');
    }
    mimeType(_uiSourceCode) {
        throw new Error('Not implemented');
    }
    canRename() {
        return false;
    }
    rename(_uiSourceCode, _newName, _callback) {
        throw new Error('Not implemented');
    }
    excludeFolder(_path) {
        throw new Error('Not implemented');
    }
    canExcludeFolder(_path) {
        return false;
    }
    async createFile(_path, _name, _content, _isBase64) {
        throw new Error('Not implemented');
    }
    canCreateFile() {
        return false;
    }
    deleteFile(_uiSourceCode) {
        throw new Error('Not implemented');
    }
    async deleteDirectoryRecursively(_path) {
        throw new Error('Not implemented');
    }
    remove() {
    }
    removeUISourceCode(_url) {
        throw new Error('Not implemented');
    }
    async searchInFileContent(_uiSourceCode, _query, _caseSensitive, _isRegex) {
        return [];
    }
    async findFilesMatchingSearchRequest(_searchConfig, _filesMatchingFileQuery, _progress) {
        return new Map();
    }
    indexContent(_progress) {
    }
    uiSourceCodeForURL(_url) {
        return null;
    }
    uiSourceCodes() {
        return [];
    }
}
_FileSystem_workspace = new WeakMap();
let automaticFileSystemWorkspaceBindingInstance;
/**
 * Provides a transient workspace `Project` that doesn't contain any `UISourceCode`s,
 * and only acts as a placeholder for the automatic file system, while it's not
 * connected yet. The placeholder project automatically disappears as soon as
 * the automatic file system is connected successfully.
 */
export class AutomaticFileSystemWorkspaceBinding {
    /**
     * @internal
     */
    constructor(automaticFileSystemManager, isolatedFileSystemManager, workspace) {
        _AutomaticFileSystemWorkspaceBinding_instances.add(this);
        _AutomaticFileSystemWorkspaceBinding_automaticFileSystemManager.set(this, void 0);
        _AutomaticFileSystemWorkspaceBinding_fileSystem.set(this, null);
        _AutomaticFileSystemWorkspaceBinding_isolatedFileSystemManager.set(this, void 0);
        _AutomaticFileSystemWorkspaceBinding_workspace.set(this, void 0);
        __classPrivateFieldSet(this, _AutomaticFileSystemWorkspaceBinding_automaticFileSystemManager, automaticFileSystemManager, "f");
        __classPrivateFieldSet(this, _AutomaticFileSystemWorkspaceBinding_isolatedFileSystemManager, isolatedFileSystemManager, "f");
        __classPrivateFieldSet(this, _AutomaticFileSystemWorkspaceBinding_workspace, workspace, "f");
        __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_automaticFileSystemManager, "f").addEventListener("AutomaticFileSystemChanged" /* AutomaticFileSystemManagerEvents.AUTOMATIC_FILE_SYSTEM_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_instances, "m", _AutomaticFileSystemWorkspaceBinding_update), this);
        __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_isolatedFileSystemManager, "f").addEventListener(IsolatedFileSystemManagerEvents.FileSystemAdded, __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_instances, "m", _AutomaticFileSystemWorkspaceBinding_update), this);
        __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_isolatedFileSystemManager, "f").addEventListener(IsolatedFileSystemManagerEvents.FileSystemRemoved, __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_instances, "m", _AutomaticFileSystemWorkspaceBinding_update), this);
        __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_instances, "m", _AutomaticFileSystemWorkspaceBinding_update).call(this);
    }
    /**
     * Yields the `AutomaticFileSystemWorkspaceBinding` singleton.
     *
     * @returns the singleton.
     */
    static instance({ forceNew, automaticFileSystemManager, isolatedFileSystemManager, workspace } = {
        forceNew: false,
        automaticFileSystemManager: null,
        isolatedFileSystemManager: null,
        workspace: null,
    }) {
        if (!automaticFileSystemWorkspaceBindingInstance || forceNew) {
            if (!automaticFileSystemManager || !isolatedFileSystemManager || !workspace) {
                throw new Error('Unable to create AutomaticFileSystemWorkspaceBinding: ' +
                    'automaticFileSystemManager, isolatedFileSystemManager, ' +
                    'and workspace must be provided');
            }
            automaticFileSystemWorkspaceBindingInstance = new AutomaticFileSystemWorkspaceBinding(automaticFileSystemManager, isolatedFileSystemManager, workspace);
        }
        return automaticFileSystemWorkspaceBindingInstance;
    }
    /**
     * Clears the `AutomaticFileSystemWorkspaceBinding` singleton (if any);
     */
    static removeInstance() {
        if (automaticFileSystemWorkspaceBindingInstance) {
            __classPrivateFieldGet(automaticFileSystemWorkspaceBindingInstance, _AutomaticFileSystemWorkspaceBinding_instances, "m", _AutomaticFileSystemWorkspaceBinding_dispose).call(automaticFileSystemWorkspaceBindingInstance);
            automaticFileSystemWorkspaceBindingInstance = undefined;
        }
    }
}
_AutomaticFileSystemWorkspaceBinding_automaticFileSystemManager = new WeakMap(), _AutomaticFileSystemWorkspaceBinding_fileSystem = new WeakMap(), _AutomaticFileSystemWorkspaceBinding_isolatedFileSystemManager = new WeakMap(), _AutomaticFileSystemWorkspaceBinding_workspace = new WeakMap(), _AutomaticFileSystemWorkspaceBinding_instances = new WeakSet(), _AutomaticFileSystemWorkspaceBinding_dispose = function _AutomaticFileSystemWorkspaceBinding_dispose() {
    if (__classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_fileSystem, "f")) {
        __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_workspace, "f").removeProject(__classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_fileSystem, "f"));
    }
    __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_automaticFileSystemManager, "f").removeEventListener("AutomaticFileSystemChanged" /* AutomaticFileSystemManagerEvents.AUTOMATIC_FILE_SYSTEM_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_instances, "m", _AutomaticFileSystemWorkspaceBinding_update), this);
    __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_isolatedFileSystemManager, "f").removeEventListener(IsolatedFileSystemManagerEvents.FileSystemAdded, __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_instances, "m", _AutomaticFileSystemWorkspaceBinding_update), this);
    __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_isolatedFileSystemManager, "f").removeEventListener(IsolatedFileSystemManagerEvents.FileSystemRemoved, __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_instances, "m", _AutomaticFileSystemWorkspaceBinding_update), this);
}, _AutomaticFileSystemWorkspaceBinding_update = function _AutomaticFileSystemWorkspaceBinding_update() {
    const automaticFileSystem = __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_automaticFileSystemManager, "f").automaticFileSystem;
    if (__classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_fileSystem, "f") !== null) {
        if (__classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_fileSystem, "f").automaticFileSystem === automaticFileSystem) {
            return;
        }
        __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_workspace, "f").removeProject(__classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_fileSystem, "f"));
        __classPrivateFieldSet(this, _AutomaticFileSystemWorkspaceBinding_fileSystem, null, "f");
    }
    if (automaticFileSystem !== null && automaticFileSystem.state !== 'connected') {
        // Check if we already have a (manually added) file system, and if so, don't
        // offer the option to connect the automatic file system.
        const fileSystemURL = Common.ParsedURL.ParsedURL.rawPathToUrlString(automaticFileSystem.root);
        if (__classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_isolatedFileSystemManager, "f").fileSystem(fileSystemURL) === null) {
            __classPrivateFieldSet(this, _AutomaticFileSystemWorkspaceBinding_fileSystem, new FileSystem(automaticFileSystem, __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_automaticFileSystemManager, "f"), __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_workspace, "f")), "f");
            __classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_workspace, "f").addProject(__classPrivateFieldGet(this, _AutomaticFileSystemWorkspaceBinding_fileSystem, "f"));
        }
    }
};
//# sourceMappingURL=AutomaticFileSystemWorkspaceBinding.js.map