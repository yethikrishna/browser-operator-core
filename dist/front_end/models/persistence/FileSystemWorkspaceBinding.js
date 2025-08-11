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
var _FileSystemWorkspaceBinding_workspace, _FileSystemWorkspaceBinding_eventListeners, _FileSystemWorkspaceBinding_boundFileSystems, _FileSystem_fileSystem, _FileSystem_fileSystemParentURL, _FileSystem_fileSystemWorkspaceBinding, _FileSystem_fileSystemPath, _FileSystem_creatingFilesGuard;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as Platform from '../../core/platform/platform.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
import { Events } from './IsolatedFileSystemManager.js';
export class FileSystemWorkspaceBinding {
    constructor(isolatedFileSystemManager, workspace) {
        _FileSystemWorkspaceBinding_workspace.set(this, void 0);
        _FileSystemWorkspaceBinding_eventListeners.set(this, void 0);
        _FileSystemWorkspaceBinding_boundFileSystems.set(this, new Map());
        this.isolatedFileSystemManager = isolatedFileSystemManager;
        __classPrivateFieldSet(this, _FileSystemWorkspaceBinding_workspace, workspace, "f");
        __classPrivateFieldSet(this, _FileSystemWorkspaceBinding_eventListeners, [
            this.isolatedFileSystemManager.addEventListener(Events.FileSystemAdded, this.onFileSystemAdded, this),
            this.isolatedFileSystemManager.addEventListener(Events.FileSystemRemoved, this.onFileSystemRemoved, this),
            this.isolatedFileSystemManager.addEventListener(Events.FileSystemFilesChanged, this.fileSystemFilesChanged, this),
        ], "f");
        void this.isolatedFileSystemManager.waitForFileSystems().then(this.onFileSystemsLoaded.bind(this));
    }
    static projectId(fileSystemPath) {
        return fileSystemPath;
    }
    static relativePath(uiSourceCode) {
        const baseURL = uiSourceCode.project().fileSystemBaseURL;
        return Common.ParsedURL.ParsedURL.split(Common.ParsedURL.ParsedURL.sliceUrlToEncodedPathString(uiSourceCode.url(), baseURL.length), '/');
    }
    static tooltipForUISourceCode(uiSourceCode) {
        const fileSystem = uiSourceCode.project().fileSystem();
        return fileSystem.tooltipForURL(uiSourceCode.url());
    }
    static fileSystemType(project) {
        if (project instanceof FileSystem) {
            return project.fileSystem().type();
        }
        throw new TypeError('project is not a FileSystem');
    }
    static fileSystemSupportsAutomapping(project) {
        const fileSystem = project.fileSystem();
        return fileSystem.supportsAutomapping();
    }
    static completeURL(project, relativePath) {
        const fsProject = project;
        return Common.ParsedURL.ParsedURL.concatenate(fsProject.fileSystemBaseURL, relativePath);
    }
    static fileSystemPath(projectId) {
        return projectId;
    }
    onFileSystemsLoaded(fileSystems) {
        for (const fileSystem of fileSystems) {
            this.addFileSystem(fileSystem);
        }
    }
    onFileSystemAdded(event) {
        const fileSystem = event.data;
        this.addFileSystem(fileSystem);
    }
    addFileSystem(fileSystem) {
        const boundFileSystem = new FileSystem(this, fileSystem, __classPrivateFieldGet(this, _FileSystemWorkspaceBinding_workspace, "f"));
        __classPrivateFieldGet(this, _FileSystemWorkspaceBinding_boundFileSystems, "f").set(fileSystem.path(), boundFileSystem);
    }
    onFileSystemRemoved(event) {
        const fileSystem = event.data;
        const boundFileSystem = __classPrivateFieldGet(this, _FileSystemWorkspaceBinding_boundFileSystems, "f").get(fileSystem.path());
        if (boundFileSystem) {
            boundFileSystem.dispose();
        }
        __classPrivateFieldGet(this, _FileSystemWorkspaceBinding_boundFileSystems, "f").delete(fileSystem.path());
    }
    fileSystemFilesChanged(event) {
        const paths = event.data;
        for (const fileSystemPath of paths.changed.keysArray()) {
            const fileSystem = __classPrivateFieldGet(this, _FileSystemWorkspaceBinding_boundFileSystems, "f").get(fileSystemPath);
            if (!fileSystem) {
                continue;
            }
            paths.changed.get(fileSystemPath).forEach(path => fileSystem.fileChanged(path));
        }
        for (const fileSystemPath of paths.added.keysArray()) {
            const fileSystem = __classPrivateFieldGet(this, _FileSystemWorkspaceBinding_boundFileSystems, "f").get(fileSystemPath);
            if (!fileSystem) {
                continue;
            }
            paths.added.get(fileSystemPath).forEach(path => fileSystem.fileChanged(path));
        }
        for (const fileSystemPath of paths.removed.keysArray()) {
            const fileSystem = __classPrivateFieldGet(this, _FileSystemWorkspaceBinding_boundFileSystems, "f").get(fileSystemPath);
            if (!fileSystem) {
                continue;
            }
            paths.removed.get(fileSystemPath).forEach(path => fileSystem.removeUISourceCode(path));
        }
    }
    dispose() {
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _FileSystemWorkspaceBinding_eventListeners, "f"));
        for (const fileSystem of __classPrivateFieldGet(this, _FileSystemWorkspaceBinding_boundFileSystems, "f").values()) {
            fileSystem.dispose();
            __classPrivateFieldGet(this, _FileSystemWorkspaceBinding_boundFileSystems, "f").delete(fileSystem.fileSystem().path());
        }
    }
}
_FileSystemWorkspaceBinding_workspace = new WeakMap(), _FileSystemWorkspaceBinding_eventListeners = new WeakMap(), _FileSystemWorkspaceBinding_boundFileSystems = new WeakMap();
export class FileSystem extends Workspace.Workspace.ProjectStore {
    constructor(fileSystemWorkspaceBinding, isolatedFileSystem, workspace) {
        const fileSystemPath = isolatedFileSystem.path();
        const id = FileSystemWorkspaceBinding.projectId(fileSystemPath);
        console.assert(!workspace.project(id));
        const displayName = fileSystemPath.substr(fileSystemPath.lastIndexOf('/') + 1);
        super(workspace, id, Workspace.Workspace.projectTypes.FileSystem, displayName);
        _FileSystem_fileSystem.set(this, void 0);
        _FileSystem_fileSystemParentURL.set(this, void 0);
        _FileSystem_fileSystemWorkspaceBinding.set(this, void 0);
        _FileSystem_fileSystemPath.set(this, void 0);
        _FileSystem_creatingFilesGuard.set(this, new Set());
        __classPrivateFieldSet(this, _FileSystem_fileSystem, isolatedFileSystem, "f");
        this.fileSystemBaseURL = Common.ParsedURL.ParsedURL.concatenate(__classPrivateFieldGet(this, _FileSystem_fileSystem, "f").path(), '/');
        __classPrivateFieldSet(this, _FileSystem_fileSystemParentURL, Common.ParsedURL.ParsedURL.substr(this.fileSystemBaseURL, 0, fileSystemPath.lastIndexOf('/') + 1), "f");
        __classPrivateFieldSet(this, _FileSystem_fileSystemWorkspaceBinding, fileSystemWorkspaceBinding, "f");
        __classPrivateFieldSet(this, _FileSystem_fileSystemPath, fileSystemPath, "f");
        workspace.addProject(this);
        this.populate();
    }
    fileSystemPath() {
        return __classPrivateFieldGet(this, _FileSystem_fileSystemPath, "f");
    }
    fileSystem() {
        return __classPrivateFieldGet(this, _FileSystem_fileSystem, "f");
    }
    mimeType(uiSourceCode) {
        return __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").mimeFromPath(uiSourceCode.url());
    }
    initialGitFolders() {
        return __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").initialGitFolders().map(folder => Common.ParsedURL.ParsedURL.concatenate(__classPrivateFieldGet(this, _FileSystem_fileSystemPath, "f"), '/', folder));
    }
    filePathForUISourceCode(uiSourceCode) {
        return Common.ParsedURL.ParsedURL.sliceUrlToEncodedPathString(uiSourceCode.url(), __classPrivateFieldGet(this, _FileSystem_fileSystemPath, "f").length);
    }
    isServiceProject() {
        return false;
    }
    requestMetadata(uiSourceCode) {
        const metadata = sourceCodeToMetadataMap.get(uiSourceCode);
        if (metadata) {
            return metadata;
        }
        const relativePath = this.filePathForUISourceCode(uiSourceCode);
        const promise = __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").getMetadata(relativePath).then(onMetadata);
        sourceCodeToMetadataMap.set(uiSourceCode, promise);
        return promise;
        function onMetadata(metadata) {
            if (!metadata) {
                return null;
            }
            return new Workspace.UISourceCode.UISourceCodeMetadata(metadata.modificationTime, metadata.size);
        }
    }
    requestFileBlob(uiSourceCode) {
        return __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").requestFileBlob(this.filePathForUISourceCode(uiSourceCode));
    }
    requestFileContent(uiSourceCode) {
        const filePath = this.filePathForUISourceCode(uiSourceCode);
        return __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").requestFileContent(filePath);
    }
    canSetFileContent() {
        return true;
    }
    async setFileContent(uiSourceCode, newContent, isBase64) {
        const filePath = this.filePathForUISourceCode(uiSourceCode);
        __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").setFileContent(filePath, newContent, isBase64);
    }
    fullDisplayName(uiSourceCode) {
        const baseURL = __classPrivateFieldGet(uiSourceCode.project(), _FileSystem_fileSystemParentURL, "f");
        return uiSourceCode.url().substring(baseURL.length);
    }
    canRename() {
        return true;
    }
    rename(uiSourceCode, newName, callback) {
        if (newName === uiSourceCode.name()) {
            callback(true, uiSourceCode.name(), uiSourceCode.url(), uiSourceCode.contentType());
            return;
        }
        let filePath = this.filePathForUISourceCode(uiSourceCode);
        __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").renameFile(filePath, newName, innerCallback.bind(this));
        function innerCallback(success, newName) {
            if (!success || !newName) {
                callback(false, newName);
                return;
            }
            console.assert(Boolean(newName));
            const slash = filePath.lastIndexOf('/');
            const parentPath = Common.ParsedURL.ParsedURL.substr(filePath, 0, slash);
            filePath = Common.ParsedURL.ParsedURL.encodedFromParentPathAndName(parentPath, newName);
            filePath = Common.ParsedURL.ParsedURL.substr(filePath, 1);
            const newURL = Common.ParsedURL.ParsedURL.concatenate(this.fileSystemBaseURL, filePath);
            const newContentType = __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").contentType(newName);
            this.renameUISourceCode(uiSourceCode, newName);
            callback(true, newName, newURL, newContentType);
        }
    }
    async searchInFileContent(uiSourceCode, query, caseSensitive, isRegex) {
        const filePath = this.filePathForUISourceCode(uiSourceCode);
        const content = await __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").requestFileContent(filePath);
        return TextUtils.TextUtils.performSearchInContentData(content, query, caseSensitive, isRegex);
    }
    async findFilesMatchingSearchRequest(searchConfig, filesMatchingFileQuery, progress) {
        let workingFileSet = filesMatchingFileQuery.map(uiSoureCode => uiSoureCode.url());
        const queriesToRun = searchConfig.queries().slice();
        if (!queriesToRun.length) {
            queriesToRun.push('');
        }
        progress.setTotalWork(queriesToRun.length);
        for (const query of queriesToRun) {
            const files = await __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").searchInPath(searchConfig.isRegex() ? '' : query, progress);
            files.sort(Platform.StringUtilities.naturalOrderComparator);
            workingFileSet = Platform.ArrayUtilities.intersectOrdered(workingFileSet, files, Platform.StringUtilities.naturalOrderComparator);
            progress.incrementWorked(1);
        }
        const result = new Map();
        for (const file of workingFileSet) {
            const uiSourceCode = this.uiSourceCodeForURL(file);
            if (uiSourceCode) {
                result.set(uiSourceCode, null);
            }
        }
        progress.done();
        return result;
    }
    indexContent(progress) {
        __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").indexContent(progress);
    }
    populate() {
        const filePaths = __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").initialFilePaths();
        if (filePaths.length === 0) {
            return;
        }
        const chunkSize = 1000;
        const startTime = performance.now();
        reportFileChunk.call(this, 0);
        function reportFileChunk(from) {
            const to = Math.min(from + chunkSize, filePaths.length);
            for (let i = from; i < to; ++i) {
                this.addFile(filePaths[i]);
            }
            if (to < filePaths.length) {
                window.setTimeout(reportFileChunk.bind(this, to), 100);
            }
            else if (this.type() === 'filesystem') {
                Host.userMetrics.workspacesPopulated(performance.now() - startTime);
            }
        }
    }
    excludeFolder(url) {
        let relativeFolder = Common.ParsedURL.ParsedURL.sliceUrlToEncodedPathString(url, this.fileSystemBaseURL.length);
        if (!relativeFolder.startsWith('/')) {
            relativeFolder = Common.ParsedURL.ParsedURL.prepend('/', relativeFolder);
        }
        if (!relativeFolder.endsWith('/')) {
            relativeFolder = Common.ParsedURL.ParsedURL.concatenate(relativeFolder, '/');
        }
        __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").addExcludedFolder(relativeFolder);
        for (const uiSourceCode of this.uiSourceCodes()) {
            if (uiSourceCode.url().startsWith(url)) {
                this.removeUISourceCode(uiSourceCode.url());
            }
        }
    }
    canExcludeFolder(path) {
        return __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").canExcludeFolder(path);
    }
    canCreateFile() {
        return true;
    }
    async createFile(path, name, content, isBase64) {
        const guardFileName = __classPrivateFieldGet(this, _FileSystem_fileSystemPath, "f") + path + (!path.endsWith('/') ? '/' : '') + name;
        __classPrivateFieldGet(this, _FileSystem_creatingFilesGuard, "f").add(guardFileName);
        const filePath = await __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").createFile(path, name);
        if (!filePath) {
            return null;
        }
        const uiSourceCode = this.addFile(filePath, content, isBase64);
        __classPrivateFieldGet(this, _FileSystem_creatingFilesGuard, "f").delete(guardFileName);
        return uiSourceCode;
    }
    deleteFile(uiSourceCode) {
        const relativePath = this.filePathForUISourceCode(uiSourceCode);
        void __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").deleteFile(relativePath).then(success => {
            if (success) {
                this.removeUISourceCode(uiSourceCode.url());
            }
        });
    }
    deleteDirectoryRecursively(path) {
        return __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").deleteDirectoryRecursively(path);
    }
    remove() {
        __classPrivateFieldGet(this, _FileSystem_fileSystemWorkspaceBinding, "f").isolatedFileSystemManager.removeFileSystem(__classPrivateFieldGet(this, _FileSystem_fileSystem, "f"));
    }
    addFile(filePath, content, isBase64) {
        const contentType = __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").contentType(filePath);
        const uiSourceCode = this.createUISourceCode(Common.ParsedURL.ParsedURL.concatenate(this.fileSystemBaseURL, filePath), contentType);
        if (content !== undefined) {
            uiSourceCode.setContent(content, Boolean(isBase64));
        }
        this.addUISourceCode(uiSourceCode);
        return uiSourceCode;
    }
    fileChanged(path) {
        // Ignore files that are being created but do not have content yet.
        if (__classPrivateFieldGet(this, _FileSystem_creatingFilesGuard, "f").has(path)) {
            return;
        }
        const uiSourceCode = this.uiSourceCodeForURL(path);
        if (!uiSourceCode) {
            const contentType = __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").contentType(path);
            this.addUISourceCode(this.createUISourceCode(path, contentType));
            return;
        }
        sourceCodeToMetadataMap.delete(uiSourceCode);
        void uiSourceCode.checkContentUpdated();
    }
    tooltipForURL(url) {
        return __classPrivateFieldGet(this, _FileSystem_fileSystem, "f").tooltipForURL(url);
    }
    dispose() {
        this.removeProject();
    }
}
_FileSystem_fileSystem = new WeakMap(), _FileSystem_fileSystemParentURL = new WeakMap(), _FileSystem_fileSystemWorkspaceBinding = new WeakMap(), _FileSystem_fileSystemPath = new WeakMap(), _FileSystem_creatingFilesGuard = new WeakMap();
const sourceCodeToMetadataMap = new WeakMap();
//# sourceMappingURL=FileSystemWorkspaceBinding.js.map