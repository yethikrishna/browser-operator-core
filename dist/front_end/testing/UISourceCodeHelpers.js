// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _TestPlatformFileSystem_mimeType, _TestPlatformFileSystem_autoMapping, _TestFileSystem_content, _TestFileSystem_metadata;
import * as Common from '../core/common/common.js';
import * as Platform from '../core/platform/platform.js';
import * as Bindings from '../models/bindings/bindings.js';
import * as Persistence from '../models/persistence/persistence.js';
import * as TextUtils from '../models/text_utils/text_utils.js';
import * as Workspace from '../models/workspace/workspace.js';
const { urlString } = Platform.DevToolsPath;
export function createContentProviderUISourceCodes(options) {
    const workspace = Workspace.Workspace.WorkspaceImpl.instance();
    const projectType = options.projectType || Workspace.Workspace.projectTypes.Formatter;
    assert.notEqual(projectType, Workspace.Workspace.projectTypes.FileSystem, 'For creating file system UISourceCodes use \'createFileSystemUISourceCode\' helper.');
    const project = new Bindings.ContentProviderBasedProject.ContentProviderBasedProject(workspace, options.projectId || 'PROJECT_ID', projectType, 'Test project', false /* isServiceProject*/);
    if (options.target) {
        Bindings.NetworkProject.NetworkProject.setTargetForProject(project, options.target);
    }
    const uiSourceCodes = [];
    for (const item of options.items) {
        const resourceType = item.resourceType || Common.ResourceType.ResourceType.fromMimeType(item.mimeType);
        const uiSourceCode = project.createUISourceCode(item.url, resourceType);
        const contentProvider = TextUtils.StaticContentProvider.StaticContentProvider.fromString(item.url, resourceType, item.content || '');
        const metadata = item.metadata || new Workspace.UISourceCode.UISourceCodeMetadata(null, null);
        project.addUISourceCodeWithProvider(uiSourceCode, contentProvider, metadata, item.mimeType);
        uiSourceCodes.push(uiSourceCode);
    }
    return { project, uiSourceCodes };
}
export function createContentProviderUISourceCode(options) {
    const { url, content, mimeType, metadata, projectType, projectId, target } = options;
    const { project, uiSourceCodes } = createContentProviderUISourceCodes({ items: [{ url, content, mimeType, metadata }], projectType, projectId, target });
    return { project, uiSourceCode: uiSourceCodes[0] };
}
class TestPlatformFileSystem extends Persistence.PlatformFileSystem.PlatformFileSystem {
    constructor(path, type, mimeType, autoMapping) {
        super(path, type, false);
        _TestPlatformFileSystem_mimeType.set(this, void 0);
        _TestPlatformFileSystem_autoMapping.set(this, void 0);
        __classPrivateFieldSet(this, _TestPlatformFileSystem_mimeType, mimeType, "f");
        __classPrivateFieldSet(this, _TestPlatformFileSystem_autoMapping, autoMapping, "f");
    }
    tooltipForURL(_url) {
        return 'tooltip-for-url';
    }
    supportsAutomapping() {
        return __classPrivateFieldGet(this, _TestPlatformFileSystem_autoMapping, "f");
    }
    mimeFromPath(_path) {
        return __classPrivateFieldGet(this, _TestPlatformFileSystem_mimeType, "f");
    }
}
_TestPlatformFileSystem_mimeType = new WeakMap(), _TestPlatformFileSystem_autoMapping = new WeakMap();
class TestFileSystem extends Persistence.FileSystemWorkspaceBinding.FileSystem {
    constructor(options) {
        super(options.fileSystemWorkspaceBinding, options.platformFileSystem, options.workspace);
        _TestFileSystem_content.set(this, void 0);
        _TestFileSystem_metadata.set(this, void 0);
        __classPrivateFieldSet(this, _TestFileSystem_content, options.content, "f");
        __classPrivateFieldSet(this, _TestFileSystem_metadata, options.metadata, "f");
    }
    requestFileContent(_uiSourceCode) {
        return Promise.resolve(new TextUtils.ContentData.ContentData(__classPrivateFieldGet(this, _TestFileSystem_content, "f"), /* isBase64 */ false, 'text/plain'));
    }
    requestMetadata(_uiSourceCode) {
        return Promise.resolve(__classPrivateFieldGet(this, _TestFileSystem_metadata, "f"));
    }
}
_TestFileSystem_content = new WeakMap(), _TestFileSystem_metadata = new WeakMap();
export function createFileSystemUISourceCode(options) {
    const workspace = Workspace.Workspace.WorkspaceImpl.instance();
    const isolatedFileSystemManager = Persistence.IsolatedFileSystemManager.IsolatedFileSystemManager.instance();
    const fileSystemWorkspaceBinding = new Persistence.FileSystemWorkspaceBinding.FileSystemWorkspaceBinding(isolatedFileSystemManager, workspace);
    const fileSystemPath = urlString `${options.fileSystemPath || ''}`;
    const type = options.type || '';
    const content = options.content || '';
    const platformFileSystem = new TestPlatformFileSystem(fileSystemPath, type || Persistence.PlatformFileSystem.PlatformFileSystemType.WORKSPACE_PROJECT, options.mimeType, Boolean(options.autoMapping));
    const metadata = options.metadata || new Workspace.UISourceCode.UISourceCodeMetadata(null, null);
    const project = new TestFileSystem({ fileSystemWorkspaceBinding, platformFileSystem, workspace, content, metadata });
    const uiSourceCode = project.createUISourceCode(options.url, Common.ResourceType.ResourceType.fromMimeType(options.mimeType));
    project.addUISourceCode(uiSourceCode);
    return { uiSourceCode, project };
}
export function setupMockedUISourceCode(url = 'https://example.com/') {
    const projectStub = sinon.createStubInstance(Bindings.ContentProviderBasedProject.ContentProviderBasedProject);
    const urlStringTagExample = urlString `${url}`;
    const contentTypeStub = sinon.createStubInstance(Common.ResourceType.ResourceType);
    const uiSourceCode = new Workspace.UISourceCode.UISourceCode(projectStub, urlStringTagExample, contentTypeStub);
    return { sut: uiSourceCode, projectStub, contentTypeStub };
}
//# sourceMappingURL=UISourceCodeHelpers.js.map