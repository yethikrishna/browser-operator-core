// Copyright (c) 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _NetworkPersistenceManager_instances, _a, _NetworkPersistenceManager_bindings, _NetworkPersistenceManager_originalResponseContentPromises, _NetworkPersistenceManager_savingForOverrides, _NetworkPersistenceManager_enabledSetting, _NetworkPersistenceManager_workspace, _NetworkPersistenceManager_networkUISourceCodeForEncodedPath, _NetworkPersistenceManager_interceptionHandlerBound, _NetworkPersistenceManager_updateInterceptionThrottler, _NetworkPersistenceManager_project, _NetworkPersistenceManager_active, _NetworkPersistenceManager_enabled, _NetworkPersistenceManager_eventDescriptors, _NetworkPersistenceManager_headerOverridesMap, _NetworkPersistenceManager_sourceCodeToBindProcessMutex, _NetworkPersistenceManager_eventDispatchThrottler, _NetworkPersistenceManager_headerOverridesForEventDispatch, _NetworkPersistenceManager_fileNamePartsFromEncodedPath, _NetworkPersistenceManager_unbind, _NetworkPersistenceManager_unbindUnguarded, _NetworkPersistenceManager_innerUnbind, _NetworkPersistenceManager_bind, _NetworkPersistenceManager_getOrCreateMutex, _NetworkPersistenceManager_innerAddBinding, _NetworkPersistenceManager_isUISourceCodeAlreadyOverridden, _NetworkPersistenceManager_shouldPromptSaveForOverridesDialog, _NetworkPersistenceManager_canSaveUISourceCodeForOverrides, _NetworkPersistenceManager_getHeaderOverridesFromUiSourceCode, _NetworkPersistenceManager_doubleDecodeEncodedPathString, _NetworkPersistenceManager_generateHeaderPatternsForHttpUrl, _NetworkPersistenceManager_generateHeaderPatternsForFileUrl, _NetworkPersistenceManager_generateHeaderPatternsForLongUrl, _NetworkPersistenceManager_innerUpdateInterceptionPatterns, _NetworkPersistenceManager_maybeDispatchRequestsForHeaderOverridesFileChanged, _NetworkPersistenceManager_dispatchRequestsForHeaderOverridesFileChanged, _NetworkPersistenceManager_maybeMergeHeadersForPathSegment;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Breakpoints from '../breakpoints/breakpoints.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
import { FileSystemWorkspaceBinding } from './FileSystemWorkspaceBinding.js';
import { IsolatedFileSystemManager } from './IsolatedFileSystemManager.js';
import { PersistenceBinding, PersistenceImpl } from './PersistenceImpl.js';
let networkPersistenceManagerInstance;
const forbiddenUrls = ['chromewebstore.google.com', 'chrome.google.com'];
export class NetworkPersistenceManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor(workspace) {
        super();
        _NetworkPersistenceManager_instances.add(this);
        _NetworkPersistenceManager_bindings.set(this, new WeakMap());
        _NetworkPersistenceManager_originalResponseContentPromises.set(this, new WeakMap());
        _NetworkPersistenceManager_savingForOverrides.set(this, new WeakSet());
        _NetworkPersistenceManager_enabledSetting.set(this, Common.Settings.Settings.instance().moduleSetting('persistence-network-overrides-enabled'));
        _NetworkPersistenceManager_workspace.set(this, void 0);
        _NetworkPersistenceManager_networkUISourceCodeForEncodedPath.set(this, new Map());
        _NetworkPersistenceManager_interceptionHandlerBound.set(this, void 0);
        _NetworkPersistenceManager_updateInterceptionThrottler.set(this, new Common.Throttler.Throttler(50));
        _NetworkPersistenceManager_project.set(this, null);
        _NetworkPersistenceManager_active.set(this, false);
        _NetworkPersistenceManager_enabled.set(this, false);
        _NetworkPersistenceManager_eventDescriptors.set(this, []);
        _NetworkPersistenceManager_headerOverridesMap.set(this, new Map());
        _NetworkPersistenceManager_sourceCodeToBindProcessMutex.set(this, new WeakMap());
        _NetworkPersistenceManager_eventDispatchThrottler.set(this, new Common.Throttler.Throttler(50));
        _NetworkPersistenceManager_headerOverridesForEventDispatch.set(this, new Set());
        __classPrivateFieldGet(this, _NetworkPersistenceManager_enabledSetting, "f").addChangeListener(this.enabledChanged, this);
        __classPrivateFieldSet(this, _NetworkPersistenceManager_workspace, workspace, "f");
        __classPrivateFieldSet(this, _NetworkPersistenceManager_interceptionHandlerBound, this.interceptionHandler.bind(this), "f");
        __classPrivateFieldGet(this, _NetworkPersistenceManager_workspace, "f").addEventListener(Workspace.Workspace.Events.ProjectAdded, event => {
            void this.onProjectAdded(event.data);
        });
        __classPrivateFieldGet(this, _NetworkPersistenceManager_workspace, "f").addEventListener(Workspace.Workspace.Events.ProjectRemoved, event => {
            void this.onProjectRemoved(event.data);
        });
        PersistenceImpl.instance().addNetworkInterceptor(this.canHandleNetworkUISourceCode.bind(this));
        Breakpoints.BreakpointManager.BreakpointManager.instance().addUpdateBindingsCallback(this.networkUISourceCodeAdded.bind(this));
        void this.enabledChanged();
        SDK.TargetManager.TargetManager.instance().observeTargets(this);
    }
    targetAdded() {
        void this.updateActiveProject();
    }
    targetRemoved() {
        void this.updateActiveProject();
    }
    static instance(opts = { forceNew: null, workspace: null }) {
        const { forceNew, workspace } = opts;
        if (!networkPersistenceManagerInstance || forceNew) {
            if (!workspace) {
                throw new Error('Missing workspace for NetworkPersistenceManager');
            }
            networkPersistenceManagerInstance = new _a(workspace);
        }
        return networkPersistenceManagerInstance;
    }
    active() {
        return __classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f");
    }
    project() {
        return __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f");
    }
    originalContentForUISourceCode(uiSourceCode) {
        const binding = __classPrivateFieldGet(this, _NetworkPersistenceManager_bindings, "f").get(uiSourceCode);
        if (!binding) {
            return null;
        }
        const fileSystemUISourceCode = binding.fileSystem;
        return __classPrivateFieldGet(this, _NetworkPersistenceManager_originalResponseContentPromises, "f").get(fileSystemUISourceCode) || null;
    }
    async enabledChanged() {
        if (__classPrivateFieldGet(this, _NetworkPersistenceManager_enabled, "f") === __classPrivateFieldGet(this, _NetworkPersistenceManager_enabledSetting, "f").get()) {
            return;
        }
        __classPrivateFieldSet(this, _NetworkPersistenceManager_enabled, __classPrivateFieldGet(this, _NetworkPersistenceManager_enabledSetting, "f").get(), "f");
        if (__classPrivateFieldGet(this, _NetworkPersistenceManager_enabled, "f")) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.PersistenceNetworkOverridesEnabled);
            __classPrivateFieldSet(this, _NetworkPersistenceManager_eventDescriptors, [
                Workspace.Workspace.WorkspaceImpl.instance().addEventListener(Workspace.Workspace.Events.UISourceCodeRenamed, event => {
                    void this.uiSourceCodeRenamedListener(event);
                }),
                Workspace.Workspace.WorkspaceImpl.instance().addEventListener(Workspace.Workspace.Events.UISourceCodeAdded, event => {
                    void this.uiSourceCodeAdded(event);
                }),
                Workspace.Workspace.WorkspaceImpl.instance().addEventListener(Workspace.Workspace.Events.UISourceCodeRemoved, event => {
                    void this.uiSourceCodeRemovedListener(event);
                }),
                Workspace.Workspace.WorkspaceImpl.instance().addEventListener(Workspace.Workspace.Events.WorkingCopyCommitted, event => this.onUISourceCodeWorkingCopyCommitted(event.data.uiSourceCode)),
            ], "f");
            await this.updateActiveProject();
        }
        else {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.PersistenceNetworkOverridesDisabled);
            Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _NetworkPersistenceManager_eventDescriptors, "f"));
            await this.updateActiveProject();
        }
        this.dispatchEventToListeners("LocalOverridesProjectUpdated" /* Events.LOCAL_OVERRIDES_PROJECT_UPDATED */, __classPrivateFieldGet(this, _NetworkPersistenceManager_enabled, "f"));
    }
    async uiSourceCodeRenamedListener(event) {
        const uiSourceCode = event.data.uiSourceCode;
        await this.onUISourceCodeRemoved(uiSourceCode);
        await this.onUISourceCodeAdded(uiSourceCode);
    }
    async uiSourceCodeRemovedListener(event) {
        await this.onUISourceCodeRemoved(event.data);
    }
    async uiSourceCodeAdded(event) {
        await this.onUISourceCodeAdded(event.data);
    }
    async updateActiveProject() {
        const wasActive = __classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f");
        __classPrivateFieldSet(this, _NetworkPersistenceManager_active, Boolean(__classPrivateFieldGet(this, _NetworkPersistenceManager_enabledSetting, "f").get() && SDK.TargetManager.TargetManager.instance().rootTarget() && __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")), "f");
        if (__classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f") === wasActive) {
            return;
        }
        if (__classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f") && __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            await Promise.all([...__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f").uiSourceCodes()].map(uiSourceCode => this.filesystemUISourceCodeAdded(uiSourceCode)));
            const networkProjects = __classPrivateFieldGet(this, _NetworkPersistenceManager_workspace, "f").projectsForType(Workspace.Workspace.projectTypes.Network);
            for (const networkProject of networkProjects) {
                await Promise.all([...networkProject.uiSourceCodes()].map(uiSourceCode => this.networkUISourceCodeAdded(uiSourceCode)));
            }
        }
        else if (__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            await Promise.all([...__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f").uiSourceCodes()].map(uiSourceCode => this.filesystemUISourceCodeRemoved(uiSourceCode)));
            __classPrivateFieldGet(this, _NetworkPersistenceManager_networkUISourceCodeForEncodedPath, "f").clear();
        }
        PersistenceImpl.instance().refreshAutomapping();
    }
    encodedPathFromUrl(url, ignoreInactive) {
        return Common.ParsedURL.ParsedURL.rawPathToEncodedPathString(this.rawPathFromUrl(url, ignoreInactive));
    }
    rawPathFromUrl(url, ignoreInactive) {
        if ((!__classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f") && !ignoreInactive) || !__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            return Platform.DevToolsPath.EmptyRawPathString;
        }
        let initialEncodedPath = Common.ParsedURL.ParsedURL.urlWithoutHash(url.replace(/^https?:\/\//, ''));
        if (initialEncodedPath.endsWith('/') && initialEncodedPath.indexOf('?') === -1) {
            initialEncodedPath = Common.ParsedURL.ParsedURL.concatenate(initialEncodedPath, 'index.html');
        }
        let encodedPathParts = _a.encodeEncodedPathToLocalPathParts(initialEncodedPath);
        const projectPath = FileSystemWorkspaceBinding.fileSystemPath(__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f").id());
        const encodedPath = encodedPathParts.join('/');
        if (projectPath.length + encodedPath.length > 200) {
            const domain = encodedPathParts[0];
            const encodedFileName = encodedPathParts[encodedPathParts.length - 1];
            const shortFileName = encodedFileName ? encodedFileName.substr(0, 10) + '-' : '';
            const extension = Common.ParsedURL.ParsedURL.extractExtension(initialEncodedPath);
            const extensionPart = extension ? '.' + extension.substr(0, 10) : '';
            encodedPathParts = [
                domain,
                'longurls',
                shortFileName + Platform.StringUtilities.hashCode(encodedPath).toString(16) + extensionPart,
            ];
        }
        return Common.ParsedURL.ParsedURL.join(encodedPathParts, '/');
    }
    static encodeEncodedPathToLocalPathParts(encodedPath) {
        const encodedParts = [];
        for (const pathPart of __classPrivateFieldGet(this, _a, "m", _NetworkPersistenceManager_fileNamePartsFromEncodedPath).call(this, encodedPath)) {
            if (!pathPart) {
                continue;
            }
            // encodeURI() escapes all the unsafe filename characters except '/' and '*'
            let encodedName = encodeURI(pathPart).replace(/[\/\*]/g, match => '%' + match[0].charCodeAt(0).toString(16).toUpperCase());
            if (Host.Platform.isWin()) {
                // Windows does not allow ':' and '?' in filenames
                encodedName = encodedName.replace(/[:\?]/g, match => '%' + match[0].charCodeAt(0).toString(16).toUpperCase());
                // Windows does not allow a small set of filenames.
                if (RESERVED_FILENAMES.has(encodedName.toLowerCase())) {
                    encodedName = encodedName.split('').map(char => '%' + char.charCodeAt(0).toString(16).toUpperCase()).join('');
                }
                // Windows does not allow the file to end in a space or dot (space should already be encoded).
                const lastChar = encodedName.charAt(encodedName.length - 1);
                if (lastChar === '.') {
                    encodedName = encodedName.substr(0, encodedName.length - 1) + '%2E';
                }
            }
            encodedParts.push(encodedName);
        }
        return encodedParts;
    }
    fileUrlFromNetworkUrl(url, ignoreInactive) {
        if (!__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            return Platform.DevToolsPath.EmptyUrlString;
        }
        return Common.ParsedURL.ParsedURL.concatenate(__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f").fileSystemPath(), '/', this.encodedPathFromUrl(url, ignoreInactive));
    }
    getHeadersUISourceCodeFromUrl(url) {
        const fileUrlFromRequest = this.fileUrlFromNetworkUrl(url, /* ignoreNoActive */ true);
        const folderUrlFromRequest = Common.ParsedURL.ParsedURL.substring(fileUrlFromRequest, 0, fileUrlFromRequest.lastIndexOf('/'));
        const headersFileUrl = Common.ParsedURL.ParsedURL.concatenate(folderUrlFromRequest, '/', HEADERS_FILENAME);
        return Workspace.Workspace.WorkspaceImpl.instance().uiSourceCodeForURL(headersFileUrl);
    }
    async getOrCreateHeadersUISourceCodeFromUrl(url) {
        let uiSourceCode = this.getHeadersUISourceCodeFromUrl(url);
        if (!uiSourceCode && __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            const encodedFilePath = this.encodedPathFromUrl(url, /* ignoreNoActive */ true);
            const encodedPath = Common.ParsedURL.ParsedURL.substring(encodedFilePath, 0, encodedFilePath.lastIndexOf('/'));
            uiSourceCode = await __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f").createFile(encodedPath, HEADERS_FILENAME, '');
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.HeaderOverrideFileCreated);
        }
        return uiSourceCode;
    }
    decodeLocalPathToUrlPath(path) {
        try {
            return unescape(path);
        }
        catch (e) {
            console.error(e);
        }
        return path;
    }
    onUISourceCodeWorkingCopyCommitted(uiSourceCode) {
        void this.saveUISourceCodeForOverrides(uiSourceCode);
        this.updateInterceptionPatterns();
    }
    isActiveHeaderOverrides(uiSourceCode) {
        // If this overridden file is actively in use at the moment.
        if (!__classPrivateFieldGet(this, _NetworkPersistenceManager_enabledSetting, "f").get()) {
            return false;
        }
        return uiSourceCode.url().endsWith(HEADERS_FILENAME) &&
            this.hasMatchingNetworkUISourceCodeForHeaderOverridesFile(uiSourceCode);
    }
    isUISourceCodeOverridable(uiSourceCode) {
        return uiSourceCode.project().type() === Workspace.Workspace.projectTypes.Network &&
            !_a.isForbiddenNetworkUrl(uiSourceCode.url());
    }
    async setupAndStartLocalOverrides(uiSourceCode) {
        // No overrides folder, set it up
        if (__classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_shouldPromptSaveForOverridesDialog).call(this, uiSourceCode)) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.OverrideContentContextMenuSetup);
            await new Promise(resolve => UI.InspectorView.InspectorView.instance().displaySelectOverrideFolderInfobar(resolve));
            await IsolatedFileSystemManager.instance().addFileSystem('overrides');
        }
        if (!this.project()) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.OverrideContentContextMenuAbandonSetup);
            return false;
        }
        // Already have an overrides folder, enable setting
        if (!__classPrivateFieldGet(this, _NetworkPersistenceManager_enabledSetting, "f").get()) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.OverrideContentContextMenuActivateDisabled);
            __classPrivateFieldGet(this, _NetworkPersistenceManager_enabledSetting, "f").set(true);
            await this.once("LocalOverridesProjectUpdated" /* Events.LOCAL_OVERRIDES_PROJECT_UPDATED */);
        }
        // Save new file
        if (!__classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_isUISourceCodeAlreadyOverridden).call(this, uiSourceCode)) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.OverrideContentContextMenuSaveNewFile);
            uiSourceCode.commitWorkingCopy();
            await this.saveUISourceCodeForOverrides(uiSourceCode);
        }
        else {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.OverrideContentContextMenuOpenExistingFile);
        }
        return true;
    }
    async saveUISourceCodeForOverrides(uiSourceCode) {
        if (!__classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_canSaveUISourceCodeForOverrides).call(this, uiSourceCode)) {
            return;
        }
        __classPrivateFieldGet(this, _NetworkPersistenceManager_savingForOverrides, "f").add(uiSourceCode);
        let encodedPath = this.encodedPathFromUrl(uiSourceCode.url());
        const contentDataOrError = await uiSourceCode.requestContentData();
        const { content, isEncoded } = TextUtils.ContentData.ContentData.asDeferredContent(contentDataOrError);
        const lastIndexOfSlash = encodedPath.lastIndexOf('/');
        const encodedFileName = Common.ParsedURL.ParsedURL.substring(encodedPath, lastIndexOfSlash + 1);
        const rawFileName = Common.ParsedURL.ParsedURL.encodedPathToRawPathString(encodedFileName);
        encodedPath = Common.ParsedURL.ParsedURL.substr(encodedPath, 0, lastIndexOfSlash);
        if (__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            await __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f").createFile(encodedPath, rawFileName, content ?? '', isEncoded);
        }
        this.fileCreatedForTest(encodedPath, rawFileName);
        __classPrivateFieldGet(this, _NetworkPersistenceManager_savingForOverrides, "f").delete(uiSourceCode);
    }
    fileCreatedForTest(_path, _fileName) {
    }
    patternForFileSystemUISourceCode(uiSourceCode) {
        const relativePathParts = FileSystemWorkspaceBinding.relativePath(uiSourceCode);
        if (relativePathParts.length < 2) {
            return '';
        }
        if (relativePathParts[1] === 'longurls' && relativePathParts.length !== 2) {
            if (relativePathParts[0] === 'file:') {
                return 'file:///*';
            }
            return 'http?://' + relativePathParts[0] + '/*';
        }
        // 'relativePath' returns an encoded string of the local file name which itself is already encoded.
        // We therefore need to decode twice to get the raw path.
        const path = this.decodeLocalPathToUrlPath(this.decodeLocalPathToUrlPath(relativePathParts.join('/')));
        if (path.startsWith('file:/')) {
            // The file path of the override file looks like '/path/to/overrides/file:/path/to/local/files/index.html'.
            // The decoded relative path then starts with 'file:/' which we modify to start with 'file:///' instead.
            return 'file:///' + path.substring('file:/'.length);
        }
        return 'http?://' + path;
    }
    // 'chrome://'-URLs and the Chrome Web Store are privileged URLs. We don't want users
    // to be able to override those. Ideally we'd have a similar check in the backend,
    // because the fix here has no effect on non-DevTools CDP clients.
    isForbiddenFileUrl(uiSourceCode) {
        const relativePathParts = FileSystemWorkspaceBinding.relativePath(uiSourceCode);
        // Decode twice to handle paths generated on Windows OS.
        const host = this.decodeLocalPathToUrlPath(this.decodeLocalPathToUrlPath(relativePathParts[0] || ''));
        return host === 'chrome:' || forbiddenUrls.includes(host);
    }
    static isForbiddenNetworkUrl(urlString) {
        const url = Common.ParsedURL.ParsedURL.fromString(urlString);
        if (!url) {
            return false;
        }
        return url.scheme === 'chrome' || forbiddenUrls.includes(url.host);
    }
    async onUISourceCodeAdded(uiSourceCode) {
        await this.networkUISourceCodeAdded(uiSourceCode);
        await this.filesystemUISourceCodeAdded(uiSourceCode);
    }
    canHandleNetworkUISourceCode(uiSourceCode) {
        return __classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f") && !Common.ParsedURL.schemeIs(uiSourceCode.url(), 'snippet:');
    }
    async networkUISourceCodeAdded(uiSourceCode) {
        if (uiSourceCode.project().type() !== Workspace.Workspace.projectTypes.Network ||
            !this.canHandleNetworkUISourceCode(uiSourceCode)) {
            return;
        }
        const url = Common.ParsedURL.ParsedURL.urlWithoutHash(uiSourceCode.url());
        __classPrivateFieldGet(this, _NetworkPersistenceManager_networkUISourceCodeForEncodedPath, "f").set(this.encodedPathFromUrl(url), uiSourceCode);
        const project = __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f");
        const fileSystemUISourceCode = project.uiSourceCodeForURL(this.fileUrlFromNetworkUrl(url));
        if (fileSystemUISourceCode) {
            await __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_bind).call(this, uiSourceCode, fileSystemUISourceCode);
        }
        __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_maybeDispatchRequestsForHeaderOverridesFileChanged).call(this, uiSourceCode);
    }
    async filesystemUISourceCodeAdded(uiSourceCode) {
        if (!__classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f") || uiSourceCode.project() !== __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            return;
        }
        this.updateInterceptionPatterns();
        const relativePath = FileSystemWorkspaceBinding.relativePath(uiSourceCode);
        const networkUISourceCode = __classPrivateFieldGet(this, _NetworkPersistenceManager_networkUISourceCodeForEncodedPath, "f").get(Common.ParsedURL.ParsedURL.join(relativePath, '/'));
        if (networkUISourceCode) {
            await __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_bind).call(this, networkUISourceCode, uiSourceCode);
        }
    }
    async generateHeaderPatterns(uiSourceCode) {
        const headerOverrides = await __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_getHeaderOverridesFromUiSourceCode).call(this, uiSourceCode);
        const relativePathParts = FileSystemWorkspaceBinding.relativePath(uiSourceCode);
        const relativePath = Common.ParsedURL.ParsedURL.slice(Common.ParsedURL.ParsedURL.join(relativePathParts, '/'), 0, -HEADERS_FILENAME.length);
        const { singlyDecodedPath, decodedPath } = __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_doubleDecodeEncodedPathString).call(this, relativePath);
        let patterns;
        // Long URLS are encoded as `[domain]/longurls/[hashed path]` by `rawPathFromUrl()`.
        if (relativePathParts.length > 2 && relativePathParts[1] === 'longurls' && headerOverrides.length) {
            patterns = __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_generateHeaderPatternsForLongUrl).call(this, decodedPath, headerOverrides, relativePathParts[0]);
        }
        else if (decodedPath.startsWith('file:/')) {
            patterns = __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_generateHeaderPatternsForFileUrl).call(this, Common.ParsedURL.ParsedURL.substring(decodedPath, 'file:/'.length), headerOverrides);
        }
        else {
            patterns = __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_generateHeaderPatternsForHttpUrl).call(this, decodedPath, headerOverrides);
        }
        return { ...patterns, path: singlyDecodedPath };
    }
    async updateInterceptionPatternsForTests() {
        await __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_innerUpdateInterceptionPatterns).call(this);
    }
    updateInterceptionPatterns() {
        void __classPrivateFieldGet(this, _NetworkPersistenceManager_updateInterceptionThrottler, "f").schedule(__classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_innerUpdateInterceptionPatterns).bind(this));
    }
    async onUISourceCodeRemoved(uiSourceCode) {
        await this.networkUISourceCodeRemoved(uiSourceCode);
        await this.filesystemUISourceCodeRemoved(uiSourceCode);
    }
    async networkUISourceCodeRemoved(uiSourceCode) {
        if (uiSourceCode.project().type() === Workspace.Workspace.projectTypes.Network) {
            await __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_unbind).call(this, uiSourceCode);
            __classPrivateFieldGet(this, _NetworkPersistenceManager_sourceCodeToBindProcessMutex, "f").delete(uiSourceCode);
            __classPrivateFieldGet(this, _NetworkPersistenceManager_networkUISourceCodeForEncodedPath, "f").delete(this.encodedPathFromUrl(uiSourceCode.url()));
        }
        __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_maybeDispatchRequestsForHeaderOverridesFileChanged).call(this, uiSourceCode);
    }
    hasMatchingNetworkUISourceCodeForHeaderOverridesFile(headersFile) {
        const relativePathParts = FileSystemWorkspaceBinding.relativePath(headersFile);
        const relativePath = Common.ParsedURL.ParsedURL.slice(Common.ParsedURL.ParsedURL.join(relativePathParts, '/'), 0, -HEADERS_FILENAME.length);
        for (const encodedNetworkPath of __classPrivateFieldGet(this, _NetworkPersistenceManager_networkUISourceCodeForEncodedPath, "f").keys()) {
            if (encodedNetworkPath.startsWith(relativePath)) {
                return true;
            }
        }
        return false;
    }
    async filesystemUISourceCodeRemoved(uiSourceCode) {
        if (uiSourceCode.project() !== __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            return;
        }
        this.updateInterceptionPatterns();
        __classPrivateFieldGet(this, _NetworkPersistenceManager_originalResponseContentPromises, "f").delete(uiSourceCode);
        await __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_unbind).call(this, uiSourceCode);
    }
    async setProject(project) {
        if (project === __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            return;
        }
        if (__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            await Promise.all([...__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f").uiSourceCodes()].map(uiSourceCode => this.filesystemUISourceCodeRemoved(uiSourceCode)));
        }
        __classPrivateFieldSet(this, _NetworkPersistenceManager_project, project, "f");
        if (__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            await Promise.all([...__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f").uiSourceCodes()].map(uiSourceCode => this.filesystemUISourceCodeAdded(uiSourceCode)));
        }
        await this.updateActiveProject();
        this.dispatchEventToListeners("ProjectChanged" /* Events.PROJECT_CHANGED */, __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f"));
    }
    async onProjectAdded(project) {
        if (project.type() !== Workspace.Workspace.projectTypes.FileSystem ||
            FileSystemWorkspaceBinding.fileSystemType(project) !== 'overrides') {
            return;
        }
        const fileSystemPath = FileSystemWorkspaceBinding.fileSystemPath(project.id());
        if (!fileSystemPath) {
            return;
        }
        if (__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f").remove();
        }
        await this.setProject(project);
    }
    async onProjectRemoved(project) {
        for (const uiSourceCode of project.uiSourceCodes()) {
            await this.networkUISourceCodeRemoved(uiSourceCode);
        }
        if (project === __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
            await this.setProject(null);
        }
    }
    mergeHeaders(baseHeaders, overrideHeaders) {
        const headerMap = new Platform.MapUtilities.Multimap();
        for (const { name, value } of overrideHeaders) {
            if (name.toLowerCase() !== 'set-cookie') {
                headerMap.set(name.toLowerCase(), value);
            }
        }
        const overriddenHeaderNames = new Set(headerMap.keysArray());
        for (const { name, value } of baseHeaders) {
            const lowerCaseName = name.toLowerCase();
            if (!overriddenHeaderNames.has(lowerCaseName) && lowerCaseName !== 'set-cookie') {
                headerMap.set(lowerCaseName, value);
            }
        }
        const result = [];
        for (const headerName of headerMap.keysArray()) {
            for (const headerValue of headerMap.get(headerName)) {
                result.push({ name: headerName, value: headerValue });
            }
        }
        const originalSetCookieHeaders = baseHeaders.filter(header => header.name.toLowerCase() === 'set-cookie') || [];
        const setCookieHeadersFromOverrides = overrideHeaders.filter(header => header.name.toLowerCase() === 'set-cookie');
        const mergedHeaders = SDK.NetworkManager.InterceptedRequest.mergeSetCookieHeaders(originalSetCookieHeaders, setCookieHeadersFromOverrides);
        result.push(...mergedHeaders);
        return result;
    }
    handleHeaderInterception(interceptedRequest) {
        let result = interceptedRequest.responseHeaders || [];
        // 'rawPathFromUrl()''s return value is already (singly-)encoded, so we can
        // treat it as an 'EncodedPathString' here.
        const urlSegments = this.rawPathFromUrl(interceptedRequest.request.url).split('/');
        // Traverse the hierarchy of overrides from the most general to the most
        // specific. Check with empty string first to match overrides applying to
        // all domains.
        // e.g. '', 'www.example.com/', 'www.example.com/path/', ...
        let path = Platform.DevToolsPath.EmptyEncodedPathString;
        result = __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_maybeMergeHeadersForPathSegment).call(this, path, interceptedRequest.request.url, result);
        for (const segment of urlSegments) {
            path = Common.ParsedURL.ParsedURL.concatenate(path, segment, '/');
            result = __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_maybeMergeHeadersForPathSegment).call(this, path, interceptedRequest.request.url, result);
        }
        return result;
    }
    async interceptionHandler(interceptedRequest) {
        const method = interceptedRequest.request.method;
        if (!__classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f") || (method === 'OPTIONS')) {
            return;
        }
        const proj = __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f");
        const path = this.fileUrlFromNetworkUrl(interceptedRequest.request.url);
        const fileSystemUISourceCode = proj.uiSourceCodeForURL(path);
        let responseHeaders = this.handleHeaderInterception(interceptedRequest);
        if (!fileSystemUISourceCode && !responseHeaders.length) {
            return;
        }
        if (!responseHeaders.length) {
            responseHeaders = interceptedRequest.responseHeaders || [];
        }
        let { mimeType } = interceptedRequest.getMimeTypeAndCharset();
        if (!mimeType) {
            const expectedResourceType = Common.ResourceType.resourceTypes[interceptedRequest.resourceType] || Common.ResourceType.resourceTypes.Other;
            mimeType = fileSystemUISourceCode?.mimeType() || '';
            if (Common.ResourceType.ResourceType.fromMimeType(mimeType) !== expectedResourceType) {
                mimeType = expectedResourceType.canonicalMimeType();
            }
        }
        if (fileSystemUISourceCode) {
            __classPrivateFieldGet(this, _NetworkPersistenceManager_originalResponseContentPromises, "f").set(fileSystemUISourceCode, interceptedRequest.responseBody().then(response => {
                if (TextUtils.ContentData.ContentData.isError(response) || !response.isTextContent) {
                    return null;
                }
                return response.text;
            }));
            const project = fileSystemUISourceCode.project();
            const blob = await project.requestFileBlob(fileSystemUISourceCode);
            if (blob) {
                void interceptedRequest.continueRequestWithContent(new Blob([blob], { type: mimeType }), /* encoded */ false, responseHeaders, /* isBodyOverridden */ true);
            }
        }
        else if (interceptedRequest.isRedirect()) {
            void interceptedRequest.continueRequestWithContent(new Blob([], { type: mimeType }), /* encoded */ true, responseHeaders, /* isBodyOverridden */ false);
        }
        else {
            const responseBody = await interceptedRequest.responseBody();
            if (!TextUtils.ContentData.ContentData.isError(responseBody)) {
                const content = responseBody.isTextContent ? responseBody.text : responseBody.base64;
                void interceptedRequest.continueRequestWithContent(new Blob([content], { type: mimeType }), /* encoded */ !responseBody.isTextContent, responseHeaders, 
                /* isBodyOverridden */ false);
            }
        }
    }
}
_a = NetworkPersistenceManager, _NetworkPersistenceManager_bindings = new WeakMap(), _NetworkPersistenceManager_originalResponseContentPromises = new WeakMap(), _NetworkPersistenceManager_savingForOverrides = new WeakMap(), _NetworkPersistenceManager_enabledSetting = new WeakMap(), _NetworkPersistenceManager_workspace = new WeakMap(), _NetworkPersistenceManager_networkUISourceCodeForEncodedPath = new WeakMap(), _NetworkPersistenceManager_interceptionHandlerBound = new WeakMap(), _NetworkPersistenceManager_updateInterceptionThrottler = new WeakMap(), _NetworkPersistenceManager_project = new WeakMap(), _NetworkPersistenceManager_active = new WeakMap(), _NetworkPersistenceManager_enabled = new WeakMap(), _NetworkPersistenceManager_eventDescriptors = new WeakMap(), _NetworkPersistenceManager_headerOverridesMap = new WeakMap(), _NetworkPersistenceManager_sourceCodeToBindProcessMutex = new WeakMap(), _NetworkPersistenceManager_eventDispatchThrottler = new WeakMap(), _NetworkPersistenceManager_headerOverridesForEventDispatch = new WeakMap(), _NetworkPersistenceManager_instances = new WeakSet(), _NetworkPersistenceManager_fileNamePartsFromEncodedPath = function _NetworkPersistenceManager_fileNamePartsFromEncodedPath(encodedPath) {
    encodedPath = Common.ParsedURL.ParsedURL.urlWithoutHash(encodedPath);
    const queryIndex = encodedPath.indexOf('?');
    if (queryIndex === -1) {
        return encodedPath.split('/');
    }
    if (queryIndex === 0) {
        return [encodedPath];
    }
    const endSection = encodedPath.substr(queryIndex);
    const parts = encodedPath.substr(0, encodedPath.length - endSection.length).split('/');
    parts[parts.length - 1] += endSection;
    return parts;
}, _NetworkPersistenceManager_unbind = async function _NetworkPersistenceManager_unbind(uiSourceCode) {
    const binding = __classPrivateFieldGet(this, _NetworkPersistenceManager_bindings, "f").get(uiSourceCode);
    const headerBinding = uiSourceCode.url().endsWith(HEADERS_FILENAME);
    if (binding) {
        const mutex = __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_getOrCreateMutex).call(this, binding.network);
        await mutex.run(__classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_innerUnbind).bind(this, binding));
    }
    else if (headerBinding) {
        this.dispatchEventToListeners("RequestsForHeaderOverridesFileChanged" /* Events.REQUEST_FOR_HEADER_OVERRIDES_FILE_CHANGED */, uiSourceCode);
    }
}, _NetworkPersistenceManager_unbindUnguarded = async function _NetworkPersistenceManager_unbindUnguarded(uiSourceCode) {
    const binding = __classPrivateFieldGet(this, _NetworkPersistenceManager_bindings, "f").get(uiSourceCode);
    if (binding) {
        await __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_innerUnbind).call(this, binding);
    }
}, _NetworkPersistenceManager_innerUnbind = function _NetworkPersistenceManager_innerUnbind(binding) {
    __classPrivateFieldGet(this, _NetworkPersistenceManager_bindings, "f").delete(binding.network);
    __classPrivateFieldGet(this, _NetworkPersistenceManager_bindings, "f").delete(binding.fileSystem);
    return PersistenceImpl.instance().removeBinding(binding);
}, _NetworkPersistenceManager_bind = async function _NetworkPersistenceManager_bind(networkUISourceCode, fileSystemUISourceCode) {
    const mutex = __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_getOrCreateMutex).call(this, networkUISourceCode);
    await mutex.run(async () => {
        const existingBinding = __classPrivateFieldGet(this, _NetworkPersistenceManager_bindings, "f").get(networkUISourceCode);
        if (existingBinding) {
            const { network, fileSystem } = existingBinding;
            if (networkUISourceCode === network && fileSystemUISourceCode === fileSystem) {
                return;
            }
            await __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_unbindUnguarded).call(this, networkUISourceCode);
            await __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_unbindUnguarded).call(this, fileSystemUISourceCode);
        }
        await __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_innerAddBinding).call(this, networkUISourceCode, fileSystemUISourceCode);
    });
}, _NetworkPersistenceManager_getOrCreateMutex = function _NetworkPersistenceManager_getOrCreateMutex(networkUISourceCode) {
    let mutex = __classPrivateFieldGet(this, _NetworkPersistenceManager_sourceCodeToBindProcessMutex, "f").get(networkUISourceCode);
    if (!mutex) {
        mutex = new Common.Mutex.Mutex();
        __classPrivateFieldGet(this, _NetworkPersistenceManager_sourceCodeToBindProcessMutex, "f").set(networkUISourceCode, mutex);
    }
    return mutex;
}, _NetworkPersistenceManager_innerAddBinding = async function _NetworkPersistenceManager_innerAddBinding(networkUISourceCode, fileSystemUISourceCode) {
    const binding = new PersistenceBinding(networkUISourceCode, fileSystemUISourceCode);
    __classPrivateFieldGet(this, _NetworkPersistenceManager_bindings, "f").set(networkUISourceCode, binding);
    __classPrivateFieldGet(this, _NetworkPersistenceManager_bindings, "f").set(fileSystemUISourceCode, binding);
    await PersistenceImpl.instance().addBinding(binding);
    const uiSourceCodeOfTruth = __classPrivateFieldGet(this, _NetworkPersistenceManager_savingForOverrides, "f").has(networkUISourceCode) ? networkUISourceCode : fileSystemUISourceCode;
    const contentDataOrError = await uiSourceCodeOfTruth.requestContentData();
    const { content, isEncoded } = TextUtils.ContentData.ContentData.asDeferredContent(contentDataOrError);
    PersistenceImpl.instance().syncContent(uiSourceCodeOfTruth, content || '', isEncoded);
}, _NetworkPersistenceManager_isUISourceCodeAlreadyOverridden = function _NetworkPersistenceManager_isUISourceCodeAlreadyOverridden(uiSourceCode) {
    return __classPrivateFieldGet(this, _NetworkPersistenceManager_bindings, "f").has(uiSourceCode) || __classPrivateFieldGet(this, _NetworkPersistenceManager_savingForOverrides, "f").has(uiSourceCode);
}, _NetworkPersistenceManager_shouldPromptSaveForOverridesDialog = function _NetworkPersistenceManager_shouldPromptSaveForOverridesDialog(uiSourceCode) {
    return this.isUISourceCodeOverridable(uiSourceCode) && !__classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_isUISourceCodeAlreadyOverridden).call(this, uiSourceCode) &&
        !__classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f") && !__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f");
}, _NetworkPersistenceManager_canSaveUISourceCodeForOverrides = function _NetworkPersistenceManager_canSaveUISourceCodeForOverrides(uiSourceCode) {
    return __classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f") && this.isUISourceCodeOverridable(uiSourceCode) &&
        !__classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_isUISourceCodeAlreadyOverridden).call(this, uiSourceCode);
}, _NetworkPersistenceManager_getHeaderOverridesFromUiSourceCode = async function _NetworkPersistenceManager_getHeaderOverridesFromUiSourceCode(uiSourceCode) {
    const contentData = await uiSourceCode.requestContentData().then(TextUtils.ContentData.ContentData.contentDataOrEmpty);
    const content = contentData.text || '[]';
    let headerOverrides = [];
    try {
        headerOverrides = JSON.parse(content);
        if (!headerOverrides.every(isHeaderOverride)) {
            throw new Error('Type mismatch after parsing');
        }
    }
    catch {
        console.error('Failed to parse', uiSourceCode.url(), 'for locally overriding headers.');
        return [];
    }
    return headerOverrides;
}, _NetworkPersistenceManager_doubleDecodeEncodedPathString = function _NetworkPersistenceManager_doubleDecodeEncodedPathString(relativePath) {
    // 'relativePath' is an encoded string of a local file path, which is itself already encoded.
    // e.g. relativePath: 'www.example.com%253A443/path/.headers'
    // singlyDecodedPath: 'www.example.com%3A443/path/.headers'
    // decodedPath: 'www.example.com:443/path/.headers'
    const singlyDecodedPath = this.decodeLocalPathToUrlPath(relativePath);
    const decodedPath = this.decodeLocalPathToUrlPath(singlyDecodedPath);
    return { singlyDecodedPath, decodedPath };
}, _NetworkPersistenceManager_generateHeaderPatternsForHttpUrl = function _NetworkPersistenceManager_generateHeaderPatternsForHttpUrl(decodedPath, headerOverrides) {
    const headerPatterns = new Set();
    const overridesWithRegex = [];
    for (const headerOverride of headerOverrides) {
        headerPatterns.add('http?://' + decodedPath + headerOverride.applyTo);
        // Make 'global' overrides apply to file URLs as well.
        if (decodedPath === '') {
            headerPatterns.add('file:///' + headerOverride.applyTo);
            overridesWithRegex.push({
                applyToRegex: new RegExp('^file:\/\/\/' + escapeRegex(decodedPath + headerOverride.applyTo) + '$'),
                headers: headerOverride.headers,
            });
        }
        // Most servers have the concept of a "directory index", which is a
        // default resource name for a request targeting a "directory", e. g.
        // requesting "example.com/path/" would result in the same response as
        // requesting "example.com/path/index.html". To match this behavior we
        // generate an additional pattern without "index.html" as the longer
        // pattern would not match against a shorter request.
        const { head, tail } = extractDirectoryIndex(headerOverride.applyTo);
        if (tail) {
            headerPatterns.add('http?://' + decodedPath + head);
            overridesWithRegex.push({
                applyToRegex: new RegExp(`^${escapeRegex(decodedPath + head)}(${escapeRegex(tail)})?$`),
                headers: headerOverride.headers,
            });
        }
        else {
            overridesWithRegex.push({
                applyToRegex: new RegExp(`^${escapeRegex(decodedPath + headerOverride.applyTo)}$`),
                headers: headerOverride.headers,
            });
        }
    }
    return { headerPatterns, overridesWithRegex };
}, _NetworkPersistenceManager_generateHeaderPatternsForFileUrl = function _NetworkPersistenceManager_generateHeaderPatternsForFileUrl(decodedPath, headerOverrides) {
    const headerPatterns = new Set();
    const overridesWithRegex = [];
    for (const headerOverride of headerOverrides) {
        headerPatterns.add('file:///' + decodedPath + headerOverride.applyTo);
        overridesWithRegex.push({
            applyToRegex: new RegExp(`^file:\/${escapeRegex(decodedPath + headerOverride.applyTo)}$`),
            headers: headerOverride.headers,
        });
    }
    return { headerPatterns, overridesWithRegex };
}, _NetworkPersistenceManager_generateHeaderPatternsForLongUrl = function _NetworkPersistenceManager_generateHeaderPatternsForLongUrl(decodedPath, headerOverrides, relativePathPart) {
    const headerPatterns = new Set();
    // Use pattern with wildcard => every request which matches will be paused
    // and checked whether its hashed URL matches a stored local override in
    // `maybeMergeHeadersForPathSegment()`.
    let { decodedPath: decodedPattern } = __classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_doubleDecodeEncodedPathString).call(this, Common.ParsedURL.ParsedURL.concatenate(relativePathPart, '/*'));
    const isFileUrl = decodedPath.startsWith('file:/');
    if (isFileUrl) {
        decodedPath = Common.ParsedURL.ParsedURL.substring(decodedPath, 'file:/'.length);
        decodedPattern = Common.ParsedURL.ParsedURL.substring(decodedPattern, 'file:/'.length);
    }
    headerPatterns.add((isFileUrl ? 'file:///' : 'http?://') + decodedPattern);
    const overridesWithRegex = [];
    for (const headerOverride of headerOverrides) {
        overridesWithRegex.push({
            applyToRegex: new RegExp(`^${isFileUrl ? 'file:\/' : ''}${escapeRegex(decodedPath + headerOverride.applyTo)}$`),
            headers: headerOverride.headers,
        });
    }
    return { headerPatterns, overridesWithRegex };
}, _NetworkPersistenceManager_innerUpdateInterceptionPatterns = async function _NetworkPersistenceManager_innerUpdateInterceptionPatterns() {
    __classPrivateFieldGet(this, _NetworkPersistenceManager_headerOverridesMap, "f").clear();
    if (!__classPrivateFieldGet(this, _NetworkPersistenceManager_active, "f") || !__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
        return await SDK.NetworkManager.MultitargetNetworkManager.instance().setInterceptionHandlerForPatterns([], __classPrivateFieldGet(this, _NetworkPersistenceManager_interceptionHandlerBound, "f"));
    }
    let patterns = new Set();
    for (const uiSourceCode of __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f").uiSourceCodes()) {
        if (this.isForbiddenFileUrl(uiSourceCode)) {
            continue;
        }
        const pattern = this.patternForFileSystemUISourceCode(uiSourceCode);
        if (uiSourceCode.name() === HEADERS_FILENAME) {
            const { headerPatterns, path, overridesWithRegex } = await this.generateHeaderPatterns(uiSourceCode);
            if (headerPatterns.size > 0) {
                patterns = new Set([...patterns, ...headerPatterns]);
                __classPrivateFieldGet(this, _NetworkPersistenceManager_headerOverridesMap, "f").set(path, overridesWithRegex);
            }
        }
        else {
            patterns.add(pattern);
        }
        // Most servers have the concept of a "directory index", which is a
        // default resource name for a request targeting a "directory", e. g.
        // requesting "example.com/path/" would result in the same response as
        // requesting "example.com/path/index.html". To match this behavior we
        // generate an additional pattern without "index.html" as the longer
        // pattern would not match against a shorter request.
        const { head, tail } = extractDirectoryIndex(pattern);
        if (tail) {
            patterns.add(head);
        }
    }
    return await SDK.NetworkManager.MultitargetNetworkManager.instance().setInterceptionHandlerForPatterns(Array.from(patterns).map(pattern => ({ urlPattern: pattern, requestStage: "Response" /* Protocol.Fetch.RequestStage.Response */ })), __classPrivateFieldGet(this, _NetworkPersistenceManager_interceptionHandlerBound, "f"));
}, _NetworkPersistenceManager_maybeDispatchRequestsForHeaderOverridesFileChanged = function _NetworkPersistenceManager_maybeDispatchRequestsForHeaderOverridesFileChanged(uiSourceCode) {
    if (!__classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f")) {
        return;
    }
    const project = __classPrivateFieldGet(this, _NetworkPersistenceManager_project, "f");
    const fileUrl = this.fileUrlFromNetworkUrl(uiSourceCode.url());
    for (let i = project.fileSystemPath().length; i < fileUrl.length; i++) {
        if (fileUrl[i] !== '/') {
            continue;
        }
        const headersFilePath = Common.ParsedURL.ParsedURL.concatenate(Common.ParsedURL.ParsedURL.substring(fileUrl, 0, i + 1), '.headers');
        const headersFileUiSourceCode = project.uiSourceCodeForURL(headersFilePath);
        if (!headersFileUiSourceCode) {
            continue;
        }
        __classPrivateFieldGet(this, _NetworkPersistenceManager_headerOverridesForEventDispatch, "f").add(headersFileUiSourceCode);
        void __classPrivateFieldGet(this, _NetworkPersistenceManager_eventDispatchThrottler, "f").schedule(__classPrivateFieldGet(this, _NetworkPersistenceManager_instances, "m", _NetworkPersistenceManager_dispatchRequestsForHeaderOverridesFileChanged).bind(this));
    }
}, _NetworkPersistenceManager_dispatchRequestsForHeaderOverridesFileChanged = function _NetworkPersistenceManager_dispatchRequestsForHeaderOverridesFileChanged() {
    for (const headersFileUiSourceCode of __classPrivateFieldGet(this, _NetworkPersistenceManager_headerOverridesForEventDispatch, "f")) {
        this.dispatchEventToListeners("RequestsForHeaderOverridesFileChanged" /* Events.REQUEST_FOR_HEADER_OVERRIDES_FILE_CHANGED */, headersFileUiSourceCode);
    }
    __classPrivateFieldGet(this, _NetworkPersistenceManager_headerOverridesForEventDispatch, "f").clear();
    return Promise.resolve();
}, _NetworkPersistenceManager_maybeMergeHeadersForPathSegment = function _NetworkPersistenceManager_maybeMergeHeadersForPathSegment(path, requestUrl, headers) {
    const headerOverrides = __classPrivateFieldGet(this, _NetworkPersistenceManager_headerOverridesMap, "f").get(path) || [];
    for (const headerOverride of headerOverrides) {
        const requestUrlWithLongUrlReplacement = this.decodeLocalPathToUrlPath(this.rawPathFromUrl(requestUrl));
        if (headerOverride.applyToRegex.test(requestUrlWithLongUrlReplacement)) {
            headers = this.mergeHeaders(headers, headerOverride.headers);
        }
    }
    return headers;
};
const RESERVED_FILENAMES = new Set([
    'con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7',
    'com8', 'com9', 'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9',
]);
export const HEADERS_FILENAME = '.headers';
export var Events;
(function (Events) {
    Events["PROJECT_CHANGED"] = "ProjectChanged";
    Events["REQUEST_FOR_HEADER_OVERRIDES_FILE_CHANGED"] = "RequestsForHeaderOverridesFileChanged";
    Events["LOCAL_OVERRIDES_PROJECT_UPDATED"] = "LocalOverridesProjectUpdated";
})(Events || (Events = {}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isHeaderOverride(arg) {
    if (!(arg && typeof arg.applyTo === 'string' && arg.headers?.length && Array.isArray(arg.headers))) {
        return false;
    }
    return arg.headers.every((header) => typeof header.name === 'string' && typeof header.value === 'string');
}
export function escapeRegex(pattern) {
    return Platform.StringUtilities.escapeCharacters(pattern, '[]{}()\\.^$+|-,?').replaceAll('*', '.*');
}
export function extractDirectoryIndex(pattern) {
    const lastSlash = pattern.lastIndexOf('/');
    const tail = lastSlash >= 0 ? pattern.slice(lastSlash + 1) : pattern;
    const head = lastSlash >= 0 ? pattern.slice(0, lastSlash + 1) : '';
    const regex = new RegExp('^' + escapeRegex(tail) + '$');
    if (tail !== '*' && (regex.test('index.html') || regex.test('index.htm') || regex.test('index.php'))) {
        return { head, tail };
    }
    return { head: pattern };
}
//# sourceMappingURL=NetworkPersistenceManager.js.map