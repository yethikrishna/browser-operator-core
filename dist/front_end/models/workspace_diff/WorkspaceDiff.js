// Copyright 2017 The Chromium Authors. All rights reserved.
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
var _WorkspaceDiffImpl_instances, _WorkspaceDiffImpl_persistence, _WorkspaceDiffImpl_diffs, _WorkspaceDiffImpl_modified, _WorkspaceDiffImpl_uiSourceCodeDiff, _WorkspaceDiffImpl_uiSourceCodeChanged, _WorkspaceDiffImpl_uiSourceCodeAdded, _WorkspaceDiffImpl_uiSourceCodeRemoved, _WorkspaceDiffImpl_projectRemoved, _WorkspaceDiffImpl_removeUISourceCode, _WorkspaceDiffImpl_markAsUnmodified, _WorkspaceDiffImpl_markAsModified, _WorkspaceDiffImpl_shouldTrack, _WorkspaceDiffImpl_updateModifiedState, _UISourceCodeDiff_instances, _UISourceCodeDiff_uiSourceCode, _UISourceCodeDiff_requestDiffPromise, _UISourceCodeDiff_pendingChanges, _UISourceCodeDiff_uiSourceCodeChanged, _UISourceCodeDiff_requestDiff;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as Diff from '../../third_party/diff/diff.js';
import * as FormatterModule from '../formatter/formatter.js';
import * as Persistence from '../persistence/persistence.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
export class WorkspaceDiffImpl extends Common.ObjectWrapper.ObjectWrapper {
    constructor(workspace) {
        super();
        _WorkspaceDiffImpl_instances.add(this);
        _WorkspaceDiffImpl_persistence.set(this, Persistence.Persistence.PersistenceImpl.instance());
        _WorkspaceDiffImpl_diffs.set(this, new WeakMap());
        /** used in web tests */
        this.loadingUISourceCodes = new Map();
        _WorkspaceDiffImpl_modified.set(this, new Set());
        workspace.addEventListener(Workspace.Workspace.Events.WorkingCopyChanged, __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_uiSourceCodeChanged), this);
        workspace.addEventListener(Workspace.Workspace.Events.WorkingCopyCommitted, __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_uiSourceCodeChanged), this);
        workspace.addEventListener(Workspace.Workspace.Events.UISourceCodeAdded, __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_uiSourceCodeAdded), this);
        workspace.addEventListener(Workspace.Workspace.Events.UISourceCodeRemoved, __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_uiSourceCodeRemoved), this);
        workspace.addEventListener(Workspace.Workspace.Events.ProjectRemoved, __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_projectRemoved), this);
        workspace.uiSourceCodes().forEach(__classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_updateModifiedState).bind(this));
    }
    requestDiff(uiSourceCode) {
        return __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_uiSourceCodeDiff).call(this, uiSourceCode).requestDiff();
    }
    subscribeToDiffChange(uiSourceCode, callback, thisObj) {
        __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_uiSourceCodeDiff).call(this, uiSourceCode).addEventListener("DiffChanged" /* UISourceCodeDiffEvents.DIFF_CHANGED */, callback, thisObj);
    }
    unsubscribeFromDiffChange(uiSourceCode, callback, thisObj) {
        __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_uiSourceCodeDiff).call(this, uiSourceCode).removeEventListener("DiffChanged" /* UISourceCodeDiffEvents.DIFF_CHANGED */, callback, thisObj);
    }
    modifiedUISourceCodes() {
        return Array.from(__classPrivateFieldGet(this, _WorkspaceDiffImpl_modified, "f"));
    }
    uiSourceCodeProcessedForTest() {
    }
    requestOriginalContentForUISourceCode(uiSourceCode) {
        return __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_uiSourceCodeDiff).call(this, uiSourceCode).originalContent();
    }
    revertToOriginal(uiSourceCode) {
        function callback(content) {
            if (typeof content !== 'string') {
                return;
            }
            uiSourceCode.addRevision(content);
        }
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.RevisionApplied);
        return this.requestOriginalContentForUISourceCode(uiSourceCode).then(callback);
    }
}
_WorkspaceDiffImpl_persistence = new WeakMap(), _WorkspaceDiffImpl_diffs = new WeakMap(), _WorkspaceDiffImpl_modified = new WeakMap(), _WorkspaceDiffImpl_instances = new WeakSet(), _WorkspaceDiffImpl_uiSourceCodeDiff = function _WorkspaceDiffImpl_uiSourceCodeDiff(uiSourceCode) {
    let diff = __classPrivateFieldGet(this, _WorkspaceDiffImpl_diffs, "f").get(uiSourceCode);
    if (!diff) {
        diff = new UISourceCodeDiff(uiSourceCode);
        __classPrivateFieldGet(this, _WorkspaceDiffImpl_diffs, "f").set(uiSourceCode, diff);
    }
    return diff;
}, _WorkspaceDiffImpl_uiSourceCodeChanged = function _WorkspaceDiffImpl_uiSourceCodeChanged(event) {
    const uiSourceCode = event.data.uiSourceCode;
    void __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_updateModifiedState).call(this, uiSourceCode);
}, _WorkspaceDiffImpl_uiSourceCodeAdded = function _WorkspaceDiffImpl_uiSourceCodeAdded(event) {
    const uiSourceCode = event.data;
    void __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_updateModifiedState).call(this, uiSourceCode);
}, _WorkspaceDiffImpl_uiSourceCodeRemoved = function _WorkspaceDiffImpl_uiSourceCodeRemoved(event) {
    const uiSourceCode = event.data;
    __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_removeUISourceCode).call(this, uiSourceCode);
}, _WorkspaceDiffImpl_projectRemoved = function _WorkspaceDiffImpl_projectRemoved(event) {
    const project = event.data;
    for (const uiSourceCode of project.uiSourceCodes()) {
        __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_removeUISourceCode).call(this, uiSourceCode);
    }
}, _WorkspaceDiffImpl_removeUISourceCode = function _WorkspaceDiffImpl_removeUISourceCode(uiSourceCode) {
    this.loadingUISourceCodes.delete(uiSourceCode);
    const uiSourceCodeDiff = __classPrivateFieldGet(this, _WorkspaceDiffImpl_diffs, "f").get(uiSourceCode);
    if (uiSourceCodeDiff) {
        uiSourceCodeDiff.dispose = true;
    }
    __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_markAsUnmodified).call(this, uiSourceCode);
}, _WorkspaceDiffImpl_markAsUnmodified = function _WorkspaceDiffImpl_markAsUnmodified(uiSourceCode) {
    this.uiSourceCodeProcessedForTest();
    if (__classPrivateFieldGet(this, _WorkspaceDiffImpl_modified, "f").delete(uiSourceCode)) {
        this.dispatchEventToListeners("ModifiedStatusChanged" /* Events.MODIFIED_STATUS_CHANGED */, { uiSourceCode, isModified: false });
    }
}, _WorkspaceDiffImpl_markAsModified = function _WorkspaceDiffImpl_markAsModified(uiSourceCode) {
    this.uiSourceCodeProcessedForTest();
    if (__classPrivateFieldGet(this, _WorkspaceDiffImpl_modified, "f").has(uiSourceCode)) {
        return;
    }
    __classPrivateFieldGet(this, _WorkspaceDiffImpl_modified, "f").add(uiSourceCode);
    this.dispatchEventToListeners("ModifiedStatusChanged" /* Events.MODIFIED_STATUS_CHANGED */, { uiSourceCode, isModified: true });
}, _WorkspaceDiffImpl_shouldTrack = function _WorkspaceDiffImpl_shouldTrack(uiSourceCode) {
    switch (uiSourceCode.project().type()) {
        case Workspace.Workspace.projectTypes.Network:
            // We track differences for all Network resources.
            return __classPrivateFieldGet(this, _WorkspaceDiffImpl_persistence, "f").binding(uiSourceCode) === null;
        case Workspace.Workspace.projectTypes.FileSystem:
            // We track differences for FileSystem resources without bindings.
            return true;
        default:
            return false;
    }
}, _WorkspaceDiffImpl_updateModifiedState = async function _WorkspaceDiffImpl_updateModifiedState(uiSourceCode) {
    this.loadingUISourceCodes.delete(uiSourceCode);
    if (!__classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_shouldTrack).call(this, uiSourceCode)) {
        __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_markAsUnmodified).call(this, uiSourceCode);
        return;
    }
    if (uiSourceCode.isDirty()) {
        __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_markAsModified).call(this, uiSourceCode);
        return;
    }
    if (!uiSourceCode.hasCommits()) {
        __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_markAsUnmodified).call(this, uiSourceCode);
        return;
    }
    const contentsPromise = Promise.all([
        this.requestOriginalContentForUISourceCode(uiSourceCode),
        uiSourceCode.requestContentData().then(contentDataOrError => TextUtils.ContentData.ContentData.textOr(contentDataOrError, null))
    ]);
    this.loadingUISourceCodes.set(uiSourceCode, contentsPromise);
    const contents = await contentsPromise;
    if (this.loadingUISourceCodes.get(uiSourceCode) !== contentsPromise) {
        return;
    }
    this.loadingUISourceCodes.delete(uiSourceCode);
    if (contents[0] !== null && contents[1] !== null && contents[0] !== contents[1]) {
        __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_markAsModified).call(this, uiSourceCode);
    }
    else {
        __classPrivateFieldGet(this, _WorkspaceDiffImpl_instances, "m", _WorkspaceDiffImpl_markAsUnmodified).call(this, uiSourceCode);
    }
};
export var Events;
(function (Events) {
    Events["MODIFIED_STATUS_CHANGED"] = "ModifiedStatusChanged";
})(Events || (Events = {}));
export class UISourceCodeDiff extends Common.ObjectWrapper.ObjectWrapper {
    constructor(uiSourceCode) {
        super();
        _UISourceCodeDiff_instances.add(this);
        _UISourceCodeDiff_uiSourceCode.set(this, void 0);
        _UISourceCodeDiff_requestDiffPromise.set(this, null);
        _UISourceCodeDiff_pendingChanges.set(this, null);
        this.dispose = false;
        __classPrivateFieldSet(this, _UISourceCodeDiff_uiSourceCode, uiSourceCode, "f");
        uiSourceCode.addEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged, __classPrivateFieldGet(this, _UISourceCodeDiff_instances, "m", _UISourceCodeDiff_uiSourceCodeChanged), this);
        uiSourceCode.addEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, __classPrivateFieldGet(this, _UISourceCodeDiff_instances, "m", _UISourceCodeDiff_uiSourceCodeChanged), this);
    }
    requestDiff() {
        if (!__classPrivateFieldGet(this, _UISourceCodeDiff_requestDiffPromise, "f")) {
            __classPrivateFieldSet(this, _UISourceCodeDiff_requestDiffPromise, __classPrivateFieldGet(this, _UISourceCodeDiff_instances, "m", _UISourceCodeDiff_requestDiff).call(this), "f");
        }
        return __classPrivateFieldGet(this, _UISourceCodeDiff_requestDiffPromise, "f");
    }
    async originalContent() {
        const originalNetworkContent = Persistence.NetworkPersistenceManager.NetworkPersistenceManager.instance().originalContentForUISourceCode(__classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f"));
        if (originalNetworkContent) {
            return await originalNetworkContent;
        }
        const content = await __classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f").project().requestFileContent(__classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f"));
        if (TextUtils.ContentData.ContentData.isError(content)) {
            return content.error;
        }
        return content.asDeferedContent().content;
    }
}
_UISourceCodeDiff_uiSourceCode = new WeakMap(), _UISourceCodeDiff_requestDiffPromise = new WeakMap(), _UISourceCodeDiff_pendingChanges = new WeakMap(), _UISourceCodeDiff_instances = new WeakSet(), _UISourceCodeDiff_uiSourceCodeChanged = function _UISourceCodeDiff_uiSourceCodeChanged() {
    if (__classPrivateFieldGet(this, _UISourceCodeDiff_pendingChanges, "f")) {
        clearTimeout(__classPrivateFieldGet(this, _UISourceCodeDiff_pendingChanges, "f"));
        __classPrivateFieldSet(this, _UISourceCodeDiff_pendingChanges, null, "f");
    }
    __classPrivateFieldSet(this, _UISourceCodeDiff_requestDiffPromise, null, "f");
    const content = __classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f").content();
    const delay = (!content || content.length < 65536) ? 0 : 200;
    __classPrivateFieldSet(this, _UISourceCodeDiff_pendingChanges, window.setTimeout(emitDiffChanged.bind(this), delay), "f");
    function emitDiffChanged() {
        if (this.dispose) {
            return;
        }
        this.dispatchEventToListeners("DiffChanged" /* UISourceCodeDiffEvents.DIFF_CHANGED */);
        __classPrivateFieldSet(this, _UISourceCodeDiff_pendingChanges, null, "f");
    }
}, _UISourceCodeDiff_requestDiff = async function _UISourceCodeDiff_requestDiff() {
    if (this.dispose) {
        return null;
    }
    let baseline = await this.originalContent();
    if (baseline === null) {
        return null;
    }
    if (baseline.length > 1024 * 1024) {
        return null;
    }
    // ------------ ASYNC ------------
    if (this.dispose) {
        return null;
    }
    let current = __classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f").workingCopy();
    if (!current && !__classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f").contentLoaded()) {
        const contentDataOrError = await __classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f").requestContentData();
        if (TextUtils.ContentData.ContentData.isError(contentDataOrError)) {
            return null;
        }
        current = contentDataOrError.text;
    }
    if (current.length > 1024 * 1024) {
        return null;
    }
    if (this.dispose) {
        return null;
    }
    baseline = (await FormatterModule.ScriptFormatter.format(__classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f").contentType(), __classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f").mimeType(), baseline))
        .formattedContent;
    const formatCurrentResult = await FormatterModule.ScriptFormatter.format(__classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f").contentType(), __classPrivateFieldGet(this, _UISourceCodeDiff_uiSourceCode, "f").mimeType(), current);
    current = formatCurrentResult.formattedContent;
    const formattedCurrentMapping = formatCurrentResult.formattedMapping;
    const reNewline = /\r\n?|\n/;
    const diff = Diff.Diff.DiffWrapper.lineDiff(baseline.split(reNewline), current.split(reNewline));
    return {
        diff,
        formattedCurrentMapping,
    };
};
export var UISourceCodeDiffEvents;
(function (UISourceCodeDiffEvents) {
    UISourceCodeDiffEvents["DIFF_CHANGED"] = "DiffChanged";
})(UISourceCodeDiffEvents || (UISourceCodeDiffEvents = {}));
let workspaceDiffImplInstance = null;
export function workspaceDiff({ forceNew } = {}) {
    if (!workspaceDiffImplInstance || forceNew) {
        workspaceDiffImplInstance = new WorkspaceDiffImpl(Workspace.Workspace.WorkspaceImpl.instance());
    }
    return workspaceDiffImplInstance;
}
//# sourceMappingURL=WorkspaceDiff.js.map