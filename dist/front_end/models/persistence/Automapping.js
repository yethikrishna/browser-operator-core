// Copyright 2016 The Chromium Authors. All rights reserved.
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
var _Automapping_instances, _Automapping_workspace, _Automapping_onStatusAdded, _Automapping_onStatusRemoved, _Automapping_fileSystemUISourceCodes, _Automapping_sourceCodeToProcessingPromiseMap, _Automapping_sourceCodeToAutoMappingStatusMap, _Automapping_sourceCodeToMetadataMap, _Automapping_filesIndex, _Automapping_projectFoldersIndex, _Automapping_activeFoldersIndex, _Automapping_interceptors, _Automapping_scheduleSweep, _Automapping_onProjectRemoved, _Automapping_onProjectAdded, _Automapping_onUISourceCodeAdded, _Automapping_onUISourceCodeRemoved, _Automapping_onUISourceCodeRenamed, _Automapping_clearNetworkStatus, _Automapping_createBinding, _Automapping_filterWithMetadata, _FilePathIndex_reversedIndex, _FolderIndex_instances, _FolderIndex_index, _FolderIndex_folderCount, _FolderIndex_removeTrailingSlash, _FileSystemUISourceCodes_sourceCodes;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Bindings from '../bindings/bindings.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
import { FileSystemWorkspaceBinding } from './FileSystemWorkspaceBinding.js';
import { PersistenceImpl } from './PersistenceImpl.js';
export class Automapping {
    constructor(workspace, onStatusAdded, onStatusRemoved) {
        _Automapping_instances.add(this);
        _Automapping_workspace.set(this, void 0);
        _Automapping_onStatusAdded.set(this, void 0);
        _Automapping_onStatusRemoved.set(this, void 0);
        // Used in web tests
        this.statuses = new Set();
        _Automapping_fileSystemUISourceCodes.set(this, new FileSystemUISourceCodes());
        // Used in web tests
        this.sweepThrottler = new Common.Throttler.Throttler(100);
        _Automapping_sourceCodeToProcessingPromiseMap.set(this, new WeakMap());
        _Automapping_sourceCodeToAutoMappingStatusMap.set(this, new WeakMap());
        _Automapping_sourceCodeToMetadataMap.set(this, new WeakMap());
        _Automapping_filesIndex.set(this, new FilePathIndex());
        _Automapping_projectFoldersIndex.set(this, new FolderIndex());
        _Automapping_activeFoldersIndex.set(this, new FolderIndex());
        _Automapping_interceptors.set(this, []);
        __classPrivateFieldSet(this, _Automapping_workspace, workspace, "f");
        __classPrivateFieldSet(this, _Automapping_onStatusAdded, onStatusAdded, "f");
        __classPrivateFieldSet(this, _Automapping_onStatusRemoved, onStatusRemoved, "f");
        __classPrivateFieldGet(this, _Automapping_workspace, "f").addEventListener(Workspace.Workspace.Events.UISourceCodeAdded, event => __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_onUISourceCodeAdded).call(this, event.data));
        __classPrivateFieldGet(this, _Automapping_workspace, "f").addEventListener(Workspace.Workspace.Events.UISourceCodeRemoved, event => __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_onUISourceCodeRemoved).call(this, event.data));
        __classPrivateFieldGet(this, _Automapping_workspace, "f").addEventListener(Workspace.Workspace.Events.UISourceCodeRenamed, __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_onUISourceCodeRenamed), this);
        __classPrivateFieldGet(this, _Automapping_workspace, "f").addEventListener(Workspace.Workspace.Events.ProjectAdded, event => __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_onProjectAdded).call(this, event.data), this);
        __classPrivateFieldGet(this, _Automapping_workspace, "f").addEventListener(Workspace.Workspace.Events.ProjectRemoved, event => __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_onProjectRemoved).call(this, event.data), this);
        for (const fileSystem of workspace.projects()) {
            __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_onProjectAdded).call(this, fileSystem);
        }
        for (const uiSourceCode of workspace.uiSourceCodes()) {
            __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_onUISourceCodeAdded).call(this, uiSourceCode);
        }
    }
    addNetworkInterceptor(interceptor) {
        __classPrivateFieldGet(this, _Automapping_interceptors, "f").push(interceptor);
        this.scheduleRemap();
    }
    scheduleRemap() {
        for (const status of this.statuses.values()) {
            __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_clearNetworkStatus).call(this, status.network);
        }
        __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_scheduleSweep).call(this);
    }
    onSweepHappenedForTest() {
    }
    computeNetworkStatus(networkSourceCode) {
        const processingPromise = __classPrivateFieldGet(this, _Automapping_sourceCodeToProcessingPromiseMap, "f").get(networkSourceCode);
        if (processingPromise) {
            return processingPromise;
        }
        if (__classPrivateFieldGet(this, _Automapping_sourceCodeToAutoMappingStatusMap, "f").has(networkSourceCode)) {
            return Promise.resolve();
        }
        if (__classPrivateFieldGet(this, _Automapping_interceptors, "f").some(interceptor => interceptor(networkSourceCode))) {
            return Promise.resolve();
        }
        if (Common.ParsedURL.schemeIs(networkSourceCode.url(), 'wasm:')) {
            return Promise.resolve();
        }
        const createBindingPromise = __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_createBinding).call(this, networkSourceCode).then(validateStatus.bind(this)).then(onStatus.bind(this));
        __classPrivateFieldGet(this, _Automapping_sourceCodeToProcessingPromiseMap, "f").set(networkSourceCode, createBindingPromise);
        return createBindingPromise;
        async function validateStatus(status) {
            if (!status) {
                return null;
            }
            if (__classPrivateFieldGet(this, _Automapping_sourceCodeToProcessingPromiseMap, "f").get(networkSourceCode) !== createBindingPromise) {
                return null;
            }
            if (status.network.contentType().isFromSourceMap() || !status.fileSystem.contentType().isTextType()) {
                return status;
            }
            // At the time binding comes, there are multiple user scenarios:
            // 1. Both network and fileSystem files are **not** dirty.
            //    This is a typical scenario when user hasn't done any edits yet to the
            //    files in question.
            // 2. FileSystem file has unsaved changes, network is clear.
            //    This typically happens with CSS files editing. Consider the following
            //    scenario:
            //      - user edits file that has been successfully mapped before
            //      - user doesn't save the file
            //      - user hits reload
            // 3. Network file has either unsaved changes or commits, but fileSystem file is clear.
            //    This typically happens when we've been editing file and then realized we'd like to drop
            //    a folder and persist all the changes.
            // 4. Network file has either unsaved changes or commits, and fileSystem file has unsaved changes.
            //    We consider this to be un-realistic scenario and in this case just fail gracefully.
            //
            // To support usecase (3), we need to validate against original network content.
            if (status.fileSystem.isDirty() && (status.network.isDirty() || status.network.hasCommits())) {
                return null;
            }
            const [fileSystemContent, networkContent] = (await Promise.all([
                status.fileSystem.requestContentData(),
                status.network.project().requestFileContent(status.network),
            ])).map(TextUtils.ContentData.ContentData.asDeferredContent);
            if (fileSystemContent.content === null || networkContent === null) {
                return null;
            }
            if (__classPrivateFieldGet(this, _Automapping_sourceCodeToProcessingPromiseMap, "f").get(networkSourceCode) !== createBindingPromise) {
                return null;
            }
            const target = Bindings.NetworkProject.NetworkProject.targetForUISourceCode(status.network);
            let isValid = false;
            const fileContent = fileSystemContent.content;
            if (target && target.type() === SDK.Target.Type.NODE) {
                if (networkContent.content) {
                    const rewrappedNetworkContent = PersistenceImpl.rewrapNodeJSContent(status.fileSystem, fileContent, networkContent.content);
                    isValid = fileContent === rewrappedNetworkContent;
                }
            }
            else if (networkContent.content) {
                // Trim trailing whitespaces because V8 adds trailing newline.
                isValid = fileContent.trimEnd() === networkContent.content.trimEnd();
            }
            if (!isValid) {
                this.prevalidationFailedForTest(status);
                return null;
            }
            return status;
        }
        async function onStatus(status) {
            if (__classPrivateFieldGet(this, _Automapping_sourceCodeToProcessingPromiseMap, "f").get(networkSourceCode) !== createBindingPromise) {
                return;
            }
            if (!status) {
                this.onBindingFailedForTest();
                __classPrivateFieldGet(this, _Automapping_sourceCodeToProcessingPromiseMap, "f").delete(networkSourceCode);
                return;
            }
            // TODO(lushnikov): remove this check once there's a single uiSourceCode per url. @see crbug.com/670180
            if (__classPrivateFieldGet(this, _Automapping_sourceCodeToAutoMappingStatusMap, "f").has(status.network) ||
                __classPrivateFieldGet(this, _Automapping_sourceCodeToAutoMappingStatusMap, "f").has(status.fileSystem)) {
                __classPrivateFieldGet(this, _Automapping_sourceCodeToProcessingPromiseMap, "f").delete(networkSourceCode);
                return;
            }
            this.statuses.add(status);
            __classPrivateFieldGet(this, _Automapping_sourceCodeToAutoMappingStatusMap, "f").set(status.network, status);
            __classPrivateFieldGet(this, _Automapping_sourceCodeToAutoMappingStatusMap, "f").set(status.fileSystem, status);
            if (status.exactMatch) {
                const projectFolder = __classPrivateFieldGet(this, _Automapping_projectFoldersIndex, "f").closestParentFolder(status.fileSystem.url());
                const newFolderAdded = projectFolder ? __classPrivateFieldGet(this, _Automapping_activeFoldersIndex, "f").addFolder(projectFolder) : false;
                if (newFolderAdded) {
                    __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_scheduleSweep).call(this);
                }
            }
            await __classPrivateFieldGet(this, _Automapping_onStatusAdded, "f").call(null, status);
            __classPrivateFieldGet(this, _Automapping_sourceCodeToProcessingPromiseMap, "f").delete(networkSourceCode);
        }
    }
    prevalidationFailedForTest(_binding) {
    }
    onBindingFailedForTest() {
    }
}
_Automapping_workspace = new WeakMap(), _Automapping_onStatusAdded = new WeakMap(), _Automapping_onStatusRemoved = new WeakMap(), _Automapping_fileSystemUISourceCodes = new WeakMap(), _Automapping_sourceCodeToProcessingPromiseMap = new WeakMap(), _Automapping_sourceCodeToAutoMappingStatusMap = new WeakMap(), _Automapping_sourceCodeToMetadataMap = new WeakMap(), _Automapping_filesIndex = new WeakMap(), _Automapping_projectFoldersIndex = new WeakMap(), _Automapping_activeFoldersIndex = new WeakMap(), _Automapping_interceptors = new WeakMap(), _Automapping_instances = new WeakSet(), _Automapping_scheduleSweep = function _Automapping_scheduleSweep() {
    void this.sweepThrottler.schedule(sweepUnmapped.bind(this));
    function sweepUnmapped() {
        const networkProjects = __classPrivateFieldGet(this, _Automapping_workspace, "f").projectsForType(Workspace.Workspace.projectTypes.Network);
        for (const networkProject of networkProjects) {
            for (const uiSourceCode of networkProject.uiSourceCodes()) {
                void this.computeNetworkStatus(uiSourceCode);
            }
        }
        this.onSweepHappenedForTest();
        return Promise.resolve();
    }
}, _Automapping_onProjectRemoved = function _Automapping_onProjectRemoved(project) {
    for (const uiSourceCode of project.uiSourceCodes()) {
        __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_onUISourceCodeRemoved).call(this, uiSourceCode);
    }
    if (project.type() !== Workspace.Workspace.projectTypes.FileSystem) {
        return;
    }
    const fileSystem = project;
    for (const gitFolder of fileSystem.initialGitFolders()) {
        __classPrivateFieldGet(this, _Automapping_projectFoldersIndex, "f").removeFolder(gitFolder);
    }
    __classPrivateFieldGet(this, _Automapping_projectFoldersIndex, "f").removeFolder(fileSystem.fileSystemPath());
    this.scheduleRemap();
}, _Automapping_onProjectAdded = function _Automapping_onProjectAdded(project) {
    if (project.type() !== Workspace.Workspace.projectTypes.FileSystem) {
        return;
    }
    const fileSystem = project;
    for (const gitFolder of fileSystem.initialGitFolders()) {
        __classPrivateFieldGet(this, _Automapping_projectFoldersIndex, "f").addFolder(gitFolder);
    }
    __classPrivateFieldGet(this, _Automapping_projectFoldersIndex, "f").addFolder(fileSystem.fileSystemPath());
    for (const uiSourceCode of project.uiSourceCodes()) {
        __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_onUISourceCodeAdded).call(this, uiSourceCode);
    }
    this.scheduleRemap();
}, _Automapping_onUISourceCodeAdded = function _Automapping_onUISourceCodeAdded(uiSourceCode) {
    const project = uiSourceCode.project();
    if (project.type() === Workspace.Workspace.projectTypes.FileSystem) {
        if (!FileSystemWorkspaceBinding.fileSystemSupportsAutomapping(project)) {
            return;
        }
        __classPrivateFieldGet(this, _Automapping_filesIndex, "f").addPath(uiSourceCode.url());
        __classPrivateFieldGet(this, _Automapping_fileSystemUISourceCodes, "f").add(uiSourceCode);
        __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_scheduleSweep).call(this);
    }
    else if (project.type() === Workspace.Workspace.projectTypes.Network) {
        void this.computeNetworkStatus(uiSourceCode);
    }
}, _Automapping_onUISourceCodeRemoved = function _Automapping_onUISourceCodeRemoved(uiSourceCode) {
    if (uiSourceCode.project().type() === Workspace.Workspace.projectTypes.FileSystem) {
        __classPrivateFieldGet(this, _Automapping_filesIndex, "f").removePath(uiSourceCode.url());
        __classPrivateFieldGet(this, _Automapping_fileSystemUISourceCodes, "f").delete(uiSourceCode.url());
        const status = __classPrivateFieldGet(this, _Automapping_sourceCodeToAutoMappingStatusMap, "f").get(uiSourceCode);
        if (status) {
            __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_clearNetworkStatus).call(this, status.network);
        }
    }
    else if (uiSourceCode.project().type() === Workspace.Workspace.projectTypes.Network) {
        __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_clearNetworkStatus).call(this, uiSourceCode);
    }
}, _Automapping_onUISourceCodeRenamed = function _Automapping_onUISourceCodeRenamed(event) {
    const { uiSourceCode, oldURL } = event.data;
    if (uiSourceCode.project().type() !== Workspace.Workspace.projectTypes.FileSystem) {
        return;
    }
    __classPrivateFieldGet(this, _Automapping_filesIndex, "f").removePath(oldURL);
    __classPrivateFieldGet(this, _Automapping_fileSystemUISourceCodes, "f").delete(oldURL);
    const status = __classPrivateFieldGet(this, _Automapping_sourceCodeToAutoMappingStatusMap, "f").get(uiSourceCode);
    if (status) {
        __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_clearNetworkStatus).call(this, status.network);
    }
    __classPrivateFieldGet(this, _Automapping_filesIndex, "f").addPath(uiSourceCode.url());
    __classPrivateFieldGet(this, _Automapping_fileSystemUISourceCodes, "f").add(uiSourceCode);
    __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_scheduleSweep).call(this);
}, _Automapping_clearNetworkStatus = function _Automapping_clearNetworkStatus(networkSourceCode) {
    if (__classPrivateFieldGet(this, _Automapping_sourceCodeToProcessingPromiseMap, "f").has(networkSourceCode)) {
        __classPrivateFieldGet(this, _Automapping_sourceCodeToProcessingPromiseMap, "f").delete(networkSourceCode);
        return;
    }
    const status = __classPrivateFieldGet(this, _Automapping_sourceCodeToAutoMappingStatusMap, "f").get(networkSourceCode);
    if (!status) {
        return;
    }
    this.statuses.delete(status);
    __classPrivateFieldGet(this, _Automapping_sourceCodeToAutoMappingStatusMap, "f").delete(status.network);
    __classPrivateFieldGet(this, _Automapping_sourceCodeToAutoMappingStatusMap, "f").delete(status.fileSystem);
    if (status.exactMatch) {
        const projectFolder = __classPrivateFieldGet(this, _Automapping_projectFoldersIndex, "f").closestParentFolder(status.fileSystem.url());
        if (projectFolder) {
            __classPrivateFieldGet(this, _Automapping_activeFoldersIndex, "f").removeFolder(projectFolder);
        }
    }
    void __classPrivateFieldGet(this, _Automapping_onStatusRemoved, "f").call(null, status);
}, _Automapping_createBinding = async function _Automapping_createBinding(networkSourceCode) {
    const url = networkSourceCode.url();
    if (Common.ParsedURL.schemeIs(url, 'file:') || Common.ParsedURL.schemeIs(url, 'snippet:')) {
        const fileSourceCode = __classPrivateFieldGet(this, _Automapping_fileSystemUISourceCodes, "f").get(url);
        const status = fileSourceCode ? new AutomappingStatus(networkSourceCode, fileSourceCode, false) : null;
        return status;
    }
    let networkPath = Common.ParsedURL.ParsedURL.extractPath(url);
    if (networkPath === null) {
        return null;
    }
    if (networkPath.endsWith('/')) {
        networkPath = Common.ParsedURL.ParsedURL.concatenate(networkPath, 'index.html');
    }
    const similarFiles = __classPrivateFieldGet(this, _Automapping_filesIndex, "f").similarFiles(networkPath).map(path => __classPrivateFieldGet(this, _Automapping_fileSystemUISourceCodes, "f").get(path));
    if (!similarFiles.length) {
        return null;
    }
    await Promise.all(similarFiles.concat(networkSourceCode).map(async (sourceCode) => {
        __classPrivateFieldGet(this, _Automapping_sourceCodeToMetadataMap, "f").set(sourceCode, await sourceCode.requestMetadata());
    }));
    const activeFiles = similarFiles.filter(file => !!__classPrivateFieldGet(this, _Automapping_activeFoldersIndex, "f").closestParentFolder(file.url()));
    const networkMetadata = __classPrivateFieldGet(this, _Automapping_sourceCodeToMetadataMap, "f").get(networkSourceCode);
    if (!networkMetadata || (!networkMetadata.modificationTime && typeof networkMetadata.contentSize !== 'number')) {
        // If networkSourceCode does not have metadata, try to match against active folders.
        if (activeFiles.length !== 1) {
            return null;
        }
        return new AutomappingStatus(networkSourceCode, activeFiles[0], false);
    }
    // Try to find exact matches, prioritizing active folders.
    let exactMatches = __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_filterWithMetadata).call(this, activeFiles, networkMetadata);
    if (!exactMatches.length) {
        exactMatches = __classPrivateFieldGet(this, _Automapping_instances, "m", _Automapping_filterWithMetadata).call(this, similarFiles, networkMetadata);
    }
    if (exactMatches.length !== 1) {
        return null;
    }
    return new AutomappingStatus(networkSourceCode, exactMatches[0], true);
}, _Automapping_filterWithMetadata = function _Automapping_filterWithMetadata(files, networkMetadata) {
    return files.filter(file => {
        const fileMetadata = __classPrivateFieldGet(this, _Automapping_sourceCodeToMetadataMap, "f").get(file);
        if (!fileMetadata) {
            return false;
        }
        // Allow a second of difference due to network timestamps lack of precision.
        const timeMatches = !networkMetadata.modificationTime || !fileMetadata.modificationTime ||
            Math.abs(networkMetadata.modificationTime.getTime() - fileMetadata.modificationTime.getTime()) < 1000;
        const contentMatches = !networkMetadata.contentSize || fileMetadata.contentSize === networkMetadata.contentSize;
        return timeMatches && contentMatches;
    });
};
class FilePathIndex {
    constructor() {
        _FilePathIndex_reversedIndex.set(this, Common.Trie.Trie.newArrayTrie());
    }
    addPath(path) {
        const reversePathParts = path.split('/').reverse();
        __classPrivateFieldGet(this, _FilePathIndex_reversedIndex, "f").add(reversePathParts);
    }
    removePath(path) {
        const reversePathParts = path.split('/').reverse();
        __classPrivateFieldGet(this, _FilePathIndex_reversedIndex, "f").remove(reversePathParts);
    }
    similarFiles(networkPath) {
        const reversePathParts = networkPath.split('/').reverse();
        const longestCommonPrefix = __classPrivateFieldGet(this, _FilePathIndex_reversedIndex, "f").longestPrefix(reversePathParts, false);
        if (longestCommonPrefix.length === 0) {
            return [];
        }
        return __classPrivateFieldGet(this, _FilePathIndex_reversedIndex, "f").words(longestCommonPrefix)
            .map(reversePathParts => reversePathParts.reverse().join('/'));
    }
}
_FilePathIndex_reversedIndex = new WeakMap();
class FolderIndex {
    constructor() {
        _FolderIndex_instances.add(this);
        _FolderIndex_index.set(this, Common.Trie.Trie.newArrayTrie());
        _FolderIndex_folderCount.set(this, new Map());
    }
    addFolder(path) {
        const pathParts = __classPrivateFieldGet(this, _FolderIndex_instances, "m", _FolderIndex_removeTrailingSlash).call(this, path).split('/');
        __classPrivateFieldGet(this, _FolderIndex_index, "f").add(pathParts);
        const pathForCount = pathParts.join('/');
        const count = __classPrivateFieldGet(this, _FolderIndex_folderCount, "f").get(pathForCount) ?? 0;
        __classPrivateFieldGet(this, _FolderIndex_folderCount, "f").set(pathForCount, count + 1);
        return count === 0;
    }
    removeFolder(path) {
        const pathParts = __classPrivateFieldGet(this, _FolderIndex_instances, "m", _FolderIndex_removeTrailingSlash).call(this, path).split('/');
        const pathForCount = pathParts.join('/');
        const count = __classPrivateFieldGet(this, _FolderIndex_folderCount, "f").get(pathForCount) ?? 0;
        if (!count) {
            return false;
        }
        if (count > 1) {
            __classPrivateFieldGet(this, _FolderIndex_folderCount, "f").set(pathForCount, count - 1);
            return false;
        }
        __classPrivateFieldGet(this, _FolderIndex_index, "f").remove(pathParts);
        __classPrivateFieldGet(this, _FolderIndex_folderCount, "f").delete(pathForCount);
        return true;
    }
    closestParentFolder(path) {
        const pathParts = path.split('/');
        const commonPrefix = __classPrivateFieldGet(this, _FolderIndex_index, "f").longestPrefix(pathParts, /* fullWordOnly */ true);
        return commonPrefix.join('/');
    }
}
_FolderIndex_index = new WeakMap(), _FolderIndex_folderCount = new WeakMap(), _FolderIndex_instances = new WeakSet(), _FolderIndex_removeTrailingSlash = function _FolderIndex_removeTrailingSlash(path) {
    if (path.endsWith('/')) {
        return Common.ParsedURL.ParsedURL.substring(path, 0, path.length - 1);
    }
    return path;
};
class FileSystemUISourceCodes {
    constructor() {
        _FileSystemUISourceCodes_sourceCodes.set(this, new Map());
    }
    getPlatformCanonicalFileUrl(path) {
        return Host.Platform.isWin() ? Common.ParsedURL.ParsedURL.toLowerCase(path) : path;
    }
    add(sourceCode) {
        const fileUrl = this.getPlatformCanonicalFileUrl(sourceCode.url());
        __classPrivateFieldGet(this, _FileSystemUISourceCodes_sourceCodes, "f").set(fileUrl, sourceCode);
    }
    get(fileUrl) {
        fileUrl = this.getPlatformCanonicalFileUrl(fileUrl);
        return __classPrivateFieldGet(this, _FileSystemUISourceCodes_sourceCodes, "f").get(fileUrl);
    }
    delete(fileUrl) {
        fileUrl = this.getPlatformCanonicalFileUrl(fileUrl);
        __classPrivateFieldGet(this, _FileSystemUISourceCodes_sourceCodes, "f").delete(fileUrl);
    }
}
_FileSystemUISourceCodes_sourceCodes = new WeakMap();
export class AutomappingStatus {
    constructor(network, fileSystem, exactMatch) {
        this.network = network;
        this.fileSystem = fileSystem;
        this.exactMatch = exactMatch;
    }
}
//# sourceMappingURL=Automapping.js.map