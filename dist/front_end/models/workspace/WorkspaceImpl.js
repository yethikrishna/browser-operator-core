/*
 * Copyright (C) 2012 Google Inc. All rights reserved.
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
var _ProjectStore_workspace, _ProjectStore_id, _ProjectStore_type, _ProjectStore_displayName, _ProjectStore_uiSourceCodes, _WorkspaceImpl_projects, _WorkspaceImpl_hasResourceContentTrackingExtensions;
import * as Common from '../../core/common/common.js';
import { UISourceCode } from './UISourceCode.js';
/* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
export var projectTypes;
(function (projectTypes) {
    projectTypes["Debugger"] = "debugger";
    projectTypes["Formatter"] = "formatter";
    projectTypes["Network"] = "network";
    projectTypes["FileSystem"] = "filesystem";
    projectTypes["ConnectableFileSystem"] = "connectablefilesystem";
    projectTypes["ContentScripts"] = "contentscripts";
    projectTypes["Service"] = "service";
})(projectTypes || (projectTypes = {}));
/* eslint-enable @typescript-eslint/naming-convention */
export class ProjectStore {
    constructor(workspace, id, type, displayName) {
        _ProjectStore_workspace.set(this, void 0);
        _ProjectStore_id.set(this, void 0);
        _ProjectStore_type.set(this, void 0);
        _ProjectStore_displayName.set(this, void 0);
        _ProjectStore_uiSourceCodes.set(this, new Map());
        __classPrivateFieldSet(this, _ProjectStore_workspace, workspace, "f");
        __classPrivateFieldSet(this, _ProjectStore_id, id, "f");
        __classPrivateFieldSet(this, _ProjectStore_type, type, "f");
        __classPrivateFieldSet(this, _ProjectStore_displayName, displayName, "f");
    }
    id() {
        return __classPrivateFieldGet(this, _ProjectStore_id, "f");
    }
    type() {
        return __classPrivateFieldGet(this, _ProjectStore_type, "f");
    }
    displayName() {
        return __classPrivateFieldGet(this, _ProjectStore_displayName, "f");
    }
    workspace() {
        return __classPrivateFieldGet(this, _ProjectStore_workspace, "f");
    }
    createUISourceCode(url, contentType) {
        return new UISourceCode(this, url, contentType);
    }
    addUISourceCode(uiSourceCode) {
        const url = uiSourceCode.url();
        if (this.uiSourceCodeForURL(url)) {
            return false;
        }
        __classPrivateFieldGet(this, _ProjectStore_uiSourceCodes, "f").set(url, uiSourceCode);
        __classPrivateFieldGet(this, _ProjectStore_workspace, "f").dispatchEventToListeners(Events.UISourceCodeAdded, uiSourceCode);
        return true;
    }
    removeUISourceCode(url) {
        const uiSourceCode = __classPrivateFieldGet(this, _ProjectStore_uiSourceCodes, "f").get(url);
        if (uiSourceCode === undefined) {
            return;
        }
        __classPrivateFieldGet(this, _ProjectStore_uiSourceCodes, "f").delete(url);
        __classPrivateFieldGet(this, _ProjectStore_workspace, "f").dispatchEventToListeners(Events.UISourceCodeRemoved, uiSourceCode);
    }
    removeProject() {
        __classPrivateFieldGet(this, _ProjectStore_workspace, "f").removeProject(this);
        __classPrivateFieldGet(this, _ProjectStore_uiSourceCodes, "f").clear();
    }
    uiSourceCodeForURL(url) {
        return __classPrivateFieldGet(this, _ProjectStore_uiSourceCodes, "f").get(url) ?? null;
    }
    uiSourceCodes() {
        return __classPrivateFieldGet(this, _ProjectStore_uiSourceCodes, "f").values();
    }
    renameUISourceCode(uiSourceCode, newName) {
        const oldPath = uiSourceCode.url();
        const newPath = uiSourceCode.parentURL() ?
            Common.ParsedURL.ParsedURL.urlFromParentUrlAndName(uiSourceCode.parentURL(), newName) :
            Common.ParsedURL.ParsedURL.preEncodeSpecialCharactersInPath(newName);
        __classPrivateFieldGet(this, _ProjectStore_uiSourceCodes, "f").set(newPath, uiSourceCode);
        __classPrivateFieldGet(this, _ProjectStore_uiSourceCodes, "f").delete(oldPath);
    }
    // No-op implementation for a handful of interface methods.
    rename(_uiSourceCode, _newName, _callback) {
    }
    excludeFolder(_path) {
    }
    deleteFile(_uiSourceCode) {
    }
    deleteDirectoryRecursively(_path) {
        return Promise.resolve(false);
    }
    remove() {
    }
    indexContent(_progress) {
    }
}
_ProjectStore_workspace = new WeakMap(), _ProjectStore_id = new WeakMap(), _ProjectStore_type = new WeakMap(), _ProjectStore_displayName = new WeakMap(), _ProjectStore_uiSourceCodes = new WeakMap();
let workspaceInstance;
export class WorkspaceImpl extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _WorkspaceImpl_projects.set(this, new Map());
        _WorkspaceImpl_hasResourceContentTrackingExtensions.set(this, false);
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!workspaceInstance || forceNew) {
            workspaceInstance = new WorkspaceImpl();
        }
        return workspaceInstance;
    }
    static removeInstance() {
        workspaceInstance = undefined;
    }
    uiSourceCode(projectId, url) {
        const project = __classPrivateFieldGet(this, _WorkspaceImpl_projects, "f").get(projectId);
        return project ? project.uiSourceCodeForURL(url) : null;
    }
    uiSourceCodeForURL(url) {
        for (const project of __classPrivateFieldGet(this, _WorkspaceImpl_projects, "f").values()) {
            const uiSourceCode = project.uiSourceCodeForURL(url);
            if (uiSourceCode) {
                return uiSourceCode;
            }
        }
        return null;
    }
    findCompatibleUISourceCodes(uiSourceCode) {
        const url = uiSourceCode.url();
        const contentType = uiSourceCode.contentType();
        const result = [];
        for (const project of __classPrivateFieldGet(this, _WorkspaceImpl_projects, "f").values()) {
            if (uiSourceCode.project().type() !== project.type()) {
                continue;
            }
            const candidate = project.uiSourceCodeForURL(url);
            if (candidate && candidate.url() === url && candidate.contentType() === contentType) {
                result.push(candidate);
            }
        }
        return result;
    }
    uiSourceCodesForProjectType(type) {
        const result = [];
        for (const project of __classPrivateFieldGet(this, _WorkspaceImpl_projects, "f").values()) {
            if (project.type() === type) {
                for (const uiSourceCode of project.uiSourceCodes()) {
                    result.push(uiSourceCode);
                }
            }
        }
        return result;
    }
    addProject(project) {
        console.assert(!__classPrivateFieldGet(this, _WorkspaceImpl_projects, "f").has(project.id()), `A project with id ${project.id()} already exists!`);
        __classPrivateFieldGet(this, _WorkspaceImpl_projects, "f").set(project.id(), project);
        this.dispatchEventToListeners(Events.ProjectAdded, project);
    }
    removeProject(project) {
        __classPrivateFieldGet(this, _WorkspaceImpl_projects, "f").delete(project.id());
        this.dispatchEventToListeners(Events.ProjectRemoved, project);
    }
    project(projectId) {
        return __classPrivateFieldGet(this, _WorkspaceImpl_projects, "f").get(projectId) || null;
    }
    projectForFileSystemRoot(root) {
        const projectId = Common.ParsedURL.ParsedURL.rawPathToUrlString(root);
        return this.project(projectId);
    }
    projects() {
        return [...__classPrivateFieldGet(this, _WorkspaceImpl_projects, "f").values()];
    }
    projectsForType(type) {
        function filterByType(project) {
            return project.type() === type;
        }
        return this.projects().filter(filterByType);
    }
    uiSourceCodes() {
        const result = [];
        for (const project of __classPrivateFieldGet(this, _WorkspaceImpl_projects, "f").values()) {
            for (const uiSourceCode of project.uiSourceCodes()) {
                result.push(uiSourceCode);
            }
        }
        return result;
    }
    setHasResourceContentTrackingExtensions(hasExtensions) {
        __classPrivateFieldSet(this, _WorkspaceImpl_hasResourceContentTrackingExtensions, hasExtensions, "f");
    }
    hasResourceContentTrackingExtensions() {
        return __classPrivateFieldGet(this, _WorkspaceImpl_hasResourceContentTrackingExtensions, "f");
    }
}
_WorkspaceImpl_projects = new WeakMap(), _WorkspaceImpl_hasResourceContentTrackingExtensions = new WeakMap();
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["UISourceCodeAdded"] = "UISourceCodeAdded";
    Events["UISourceCodeRemoved"] = "UISourceCodeRemoved";
    Events["UISourceCodeRenamed"] = "UISourceCodeRenamed";
    Events["WorkingCopyChanged"] = "WorkingCopyChanged";
    Events["WorkingCopyCommitted"] = "WorkingCopyCommitted";
    Events["WorkingCopyCommittedByUser"] = "WorkingCopyCommittedByUser";
    Events["ProjectAdded"] = "ProjectAdded";
    Events["ProjectRemoved"] = "ProjectRemoved";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
//# sourceMappingURL=WorkspaceImpl.js.map