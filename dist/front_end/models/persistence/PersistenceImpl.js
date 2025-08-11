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
var _PersistenceImpl_instances, _PersistenceImpl_workspace, _PersistenceImpl_breakpointManager, _PersistenceImpl_filePathPrefixesToBindingCount, _PersistenceImpl_subscribedBindingEventListeners, _PersistenceImpl_mapping, _PersistenceImpl_setupBindings, _FilePathPrefixesBindingCounts_prefixCounts;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Components from '../../ui/legacy/components/utils/utils.js';
import * as Bindings from '../bindings/bindings.js';
import * as BreakpointManager from '../breakpoints/breakpoints.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
import { Automapping } from './Automapping.js';
import { LinkDecorator } from './PersistenceUtils.js';
let persistenceInstance;
export class PersistenceImpl extends Common.ObjectWrapper.ObjectWrapper {
    constructor(workspace, breakpointManager) {
        super();
        _PersistenceImpl_instances.add(this);
        _PersistenceImpl_workspace.set(this, void 0);
        _PersistenceImpl_breakpointManager.set(this, void 0);
        _PersistenceImpl_filePathPrefixesToBindingCount.set(this, new FilePathPrefixesBindingCounts());
        _PersistenceImpl_subscribedBindingEventListeners.set(this, new Platform.MapUtilities.Multimap());
        _PersistenceImpl_mapping.set(this, void 0);
        __classPrivateFieldSet(this, _PersistenceImpl_workspace, workspace, "f");
        __classPrivateFieldSet(this, _PersistenceImpl_breakpointManager, breakpointManager, "f");
        __classPrivateFieldGet(this, _PersistenceImpl_breakpointManager, "f").addUpdateBindingsCallback(__classPrivateFieldGet(this, _PersistenceImpl_instances, "m", _PersistenceImpl_setupBindings).bind(this));
        const linkDecorator = new LinkDecorator(this);
        Components.Linkifier.Linkifier.setLinkDecorator(linkDecorator);
        __classPrivateFieldSet(this, _PersistenceImpl_mapping, new Automapping(__classPrivateFieldGet(this, _PersistenceImpl_workspace, "f"), this.onStatusAdded.bind(this), this.onStatusRemoved.bind(this)), "f");
    }
    static instance(opts = { forceNew: null, workspace: null, breakpointManager: null }) {
        const { forceNew, workspace, breakpointManager } = opts;
        if (!persistenceInstance || forceNew) {
            if (!workspace || !breakpointManager) {
                throw new Error('Missing arguments for workspace');
            }
            persistenceInstance = new PersistenceImpl(workspace, breakpointManager);
        }
        return persistenceInstance;
    }
    addNetworkInterceptor(interceptor) {
        __classPrivateFieldGet(this, _PersistenceImpl_mapping, "f").addNetworkInterceptor(interceptor);
    }
    refreshAutomapping() {
        __classPrivateFieldGet(this, _PersistenceImpl_mapping, "f").scheduleRemap();
    }
    async addBinding(binding) {
        await this.innerAddBinding(binding);
    }
    async addBindingForTest(binding) {
        await this.innerAddBinding(binding);
    }
    async removeBinding(binding) {
        await this.innerRemoveBinding(binding);
    }
    async removeBindingForTest(binding) {
        await this.innerRemoveBinding(binding);
    }
    async innerAddBinding(binding) {
        bindings.set(binding.network, binding);
        bindings.set(binding.fileSystem, binding);
        binding.fileSystem.forceLoadOnCheckContent();
        binding.network.addEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, this.onWorkingCopyCommitted, this);
        binding.fileSystem.addEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, this.onWorkingCopyCommitted, this);
        binding.network.addEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged, this.onWorkingCopyChanged, this);
        binding.fileSystem.addEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged, this.onWorkingCopyChanged, this);
        __classPrivateFieldGet(this, _PersistenceImpl_filePathPrefixesToBindingCount, "f").add(binding.fileSystem.url());
        await this.moveBreakpoints(binding.fileSystem, binding.network);
        console.assert(!binding.fileSystem.isDirty() || !binding.network.isDirty());
        if (binding.fileSystem.isDirty()) {
            this.syncWorkingCopy(binding.fileSystem);
        }
        else if (binding.network.isDirty()) {
            this.syncWorkingCopy(binding.network);
        }
        else if (binding.network.hasCommits() && binding.network.content() !== binding.fileSystem.content()) {
            binding.network.setWorkingCopy(binding.network.content());
            this.syncWorkingCopy(binding.network);
        }
        this.notifyBindingEvent(binding.network);
        this.notifyBindingEvent(binding.fileSystem);
        this.dispatchEventToListeners(Events.BindingCreated, binding);
    }
    async innerRemoveBinding(binding) {
        if (bindings.get(binding.network) !== binding) {
            return;
        }
        console.assert(bindings.get(binding.network) === bindings.get(binding.fileSystem), 'ERROR: inconsistent binding for networkURL ' + binding.network.url());
        bindings.delete(binding.network);
        bindings.delete(binding.fileSystem);
        binding.network.removeEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, this.onWorkingCopyCommitted, this);
        binding.fileSystem.removeEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, this.onWorkingCopyCommitted, this);
        binding.network.removeEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged, this.onWorkingCopyChanged, this);
        binding.fileSystem.removeEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged, this.onWorkingCopyChanged, this);
        __classPrivateFieldGet(this, _PersistenceImpl_filePathPrefixesToBindingCount, "f").remove(binding.fileSystem.url());
        await __classPrivateFieldGet(this, _PersistenceImpl_breakpointManager, "f").copyBreakpoints(binding.network, binding.fileSystem);
        this.notifyBindingEvent(binding.network);
        this.notifyBindingEvent(binding.fileSystem);
        this.dispatchEventToListeners(Events.BindingRemoved, binding);
    }
    onStatusAdded(status) {
        const binding = new PersistenceBinding(status.network, status.fileSystem);
        statusBindings.set(status, binding);
        return this.innerAddBinding(binding);
    }
    async onStatusRemoved(status) {
        const binding = statusBindings.get(status);
        await this.innerRemoveBinding(binding);
    }
    onWorkingCopyChanged(event) {
        const uiSourceCode = event.data;
        this.syncWorkingCopy(uiSourceCode);
    }
    syncWorkingCopy(uiSourceCode) {
        const binding = bindings.get(uiSourceCode);
        if (!binding || mutedWorkingCopies.has(binding)) {
            return;
        }
        const other = binding.network === uiSourceCode ? binding.fileSystem : binding.network;
        if (!uiSourceCode.isDirty()) {
            mutedWorkingCopies.add(binding);
            other.resetWorkingCopy();
            mutedWorkingCopies.delete(binding);
            this.contentSyncedForTest();
            return;
        }
        const target = Bindings.NetworkProject.NetworkProject.targetForUISourceCode(binding.network);
        if (target && target.type() === SDK.Target.Type.NODE) {
            const newContent = uiSourceCode.workingCopy();
            void other.requestContentData().then(() => {
                const nodeJSContent = PersistenceImpl.rewrapNodeJSContent(other, other.workingCopy(), newContent);
                setWorkingCopy.call(this, () => nodeJSContent);
            });
            return;
        }
        setWorkingCopy.call(this, () => uiSourceCode.workingCopy());
        function setWorkingCopy(workingCopyGetter) {
            if (binding) {
                mutedWorkingCopies.add(binding);
            }
            other.setWorkingCopyGetter(workingCopyGetter);
            if (binding) {
                mutedWorkingCopies.delete(binding);
            }
            this.contentSyncedForTest();
        }
    }
    onWorkingCopyCommitted(event) {
        const uiSourceCode = event.data.uiSourceCode;
        const newContent = event.data.content;
        this.syncContent(uiSourceCode, newContent, Boolean(event.data.encoded));
    }
    syncContent(uiSourceCode, newContent, encoded) {
        const binding = bindings.get(uiSourceCode);
        if (!binding || mutedCommits.has(binding)) {
            return;
        }
        const other = binding.network === uiSourceCode ? binding.fileSystem : binding.network;
        const target = Bindings.NetworkProject.NetworkProject.targetForUISourceCode(binding.network);
        if (target && target.type() === SDK.Target.Type.NODE) {
            void other.requestContentData()
                .then(contentDataOrError => TextUtils.ContentData.ContentData.textOr(contentDataOrError, ''))
                .then(currentContent => {
                const nodeJSContent = PersistenceImpl.rewrapNodeJSContent(other, currentContent, newContent);
                setContent.call(this, nodeJSContent);
            });
            return;
        }
        setContent.call(this, newContent);
        function setContent(newContent) {
            if (binding) {
                mutedCommits.add(binding);
            }
            other.setContent(newContent, encoded);
            if (binding) {
                mutedCommits.delete(binding);
            }
            this.contentSyncedForTest();
        }
    }
    static rewrapNodeJSContent(uiSourceCode, currentContent, newContent) {
        if (uiSourceCode.project().type() === Workspace.Workspace.projectTypes.FileSystem) {
            if (newContent.startsWith(NodePrefix) && newContent.endsWith(NodeSuffix)) {
                newContent = newContent.substring(NodePrefix.length, newContent.length - NodeSuffix.length);
            }
            if (currentContent.startsWith(NodeShebang)) {
                newContent = NodeShebang + newContent;
            }
        }
        else {
            if (newContent.startsWith(NodeShebang)) {
                newContent = newContent.substring(NodeShebang.length);
            }
            if (currentContent.startsWith(NodePrefix) && currentContent.endsWith(NodeSuffix)) {
                newContent = NodePrefix + newContent + NodeSuffix;
            }
        }
        return newContent;
    }
    contentSyncedForTest() {
    }
    async moveBreakpoints(from, to) {
        const breakpoints = __classPrivateFieldGet(this, _PersistenceImpl_breakpointManager, "f").breakpointLocationsForUISourceCode(from).map(breakpointLocation => breakpointLocation.breakpoint);
        await Promise.all(breakpoints.map(async (breakpoint) => {
            await breakpoint.remove(false /* keepInStorage */);
            return await __classPrivateFieldGet(this, _PersistenceImpl_breakpointManager, "f").setBreakpoint(to, breakpoint.lineNumber(), breakpoint.columnNumber(), breakpoint.condition(), breakpoint.enabled(), breakpoint.isLogpoint(), "RESTORED" /* BreakpointManager.BreakpointManager.BreakpointOrigin.OTHER */);
        }));
    }
    hasUnsavedCommittedChanges(uiSourceCode) {
        if (__classPrivateFieldGet(this, _PersistenceImpl_workspace, "f").hasResourceContentTrackingExtensions()) {
            return false;
        }
        if (uiSourceCode.project().canSetFileContent()) {
            return false;
        }
        if (bindings.has(uiSourceCode)) {
            return false;
        }
        return Boolean(uiSourceCode.hasCommits());
    }
    binding(uiSourceCode) {
        return bindings.get(uiSourceCode) || null;
    }
    subscribeForBindingEvent(uiSourceCode, listener) {
        __classPrivateFieldGet(this, _PersistenceImpl_subscribedBindingEventListeners, "f").set(uiSourceCode, listener);
    }
    unsubscribeFromBindingEvent(uiSourceCode, listener) {
        __classPrivateFieldGet(this, _PersistenceImpl_subscribedBindingEventListeners, "f").delete(uiSourceCode, listener);
    }
    notifyBindingEvent(uiSourceCode) {
        if (!__classPrivateFieldGet(this, _PersistenceImpl_subscribedBindingEventListeners, "f").has(uiSourceCode)) {
            return;
        }
        const listeners = Array.from(__classPrivateFieldGet(this, _PersistenceImpl_subscribedBindingEventListeners, "f").get(uiSourceCode));
        for (const listener of listeners) {
            listener.call(null);
        }
    }
    fileSystem(uiSourceCode) {
        const binding = this.binding(uiSourceCode);
        return binding ? binding.fileSystem : null;
    }
    network(uiSourceCode) {
        const binding = this.binding(uiSourceCode);
        return binding ? binding.network : null;
    }
    filePathHasBindings(filePath) {
        return __classPrivateFieldGet(this, _PersistenceImpl_filePathPrefixesToBindingCount, "f").hasBindingPrefix(filePath);
    }
}
_PersistenceImpl_workspace = new WeakMap(), _PersistenceImpl_breakpointManager = new WeakMap(), _PersistenceImpl_filePathPrefixesToBindingCount = new WeakMap(), _PersistenceImpl_subscribedBindingEventListeners = new WeakMap(), _PersistenceImpl_mapping = new WeakMap(), _PersistenceImpl_instances = new WeakSet(), _PersistenceImpl_setupBindings = function _PersistenceImpl_setupBindings(networkUISourceCode) {
    if (networkUISourceCode.project().type() !== Workspace.Workspace.projectTypes.Network) {
        return Promise.resolve();
    }
    return __classPrivateFieldGet(this, _PersistenceImpl_mapping, "f").computeNetworkStatus(networkUISourceCode);
};
class FilePathPrefixesBindingCounts {
    constructor() {
        _FilePathPrefixesBindingCounts_prefixCounts.set(this, new Map());
    }
    getPlatformCanonicalFilePath(path) {
        return Host.Platform.isWin() ? Common.ParsedURL.ParsedURL.toLowerCase(path) : path;
    }
    add(filePath) {
        filePath = this.getPlatformCanonicalFilePath(filePath);
        let relative = '';
        for (const token of filePath.split('/')) {
            relative += token + '/';
            const count = __classPrivateFieldGet(this, _FilePathPrefixesBindingCounts_prefixCounts, "f").get(relative) || 0;
            __classPrivateFieldGet(this, _FilePathPrefixesBindingCounts_prefixCounts, "f").set(relative, count + 1);
        }
    }
    remove(filePath) {
        filePath = this.getPlatformCanonicalFilePath(filePath);
        let relative = '';
        for (const token of filePath.split('/')) {
            relative += token + '/';
            const count = __classPrivateFieldGet(this, _FilePathPrefixesBindingCounts_prefixCounts, "f").get(relative);
            if (count === 1) {
                __classPrivateFieldGet(this, _FilePathPrefixesBindingCounts_prefixCounts, "f").delete(relative);
            }
            else if (count !== undefined) {
                __classPrivateFieldGet(this, _FilePathPrefixesBindingCounts_prefixCounts, "f").set(relative, count - 1);
            }
        }
    }
    hasBindingPrefix(filePath) {
        filePath = this.getPlatformCanonicalFilePath(filePath);
        if (!filePath.endsWith('/')) {
            filePath = Common.ParsedURL.ParsedURL.concatenate(filePath, '/');
        }
        return __classPrivateFieldGet(this, _FilePathPrefixesBindingCounts_prefixCounts, "f").has(filePath);
    }
}
_FilePathPrefixesBindingCounts_prefixCounts = new WeakMap();
const bindings = new WeakMap();
const statusBindings = new WeakMap();
const mutedCommits = new WeakSet();
const mutedWorkingCopies = new WeakSet();
export const NodePrefix = '(function (exports, require, module, __filename, __dirname) { ';
export const NodeSuffix = '\n});';
export const NodeShebang = '#!/usr/bin/env node';
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["BindingCreated"] = "BindingCreated";
    Events["BindingRemoved"] = "BindingRemoved";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
export class PersistenceBinding {
    constructor(network, fileSystem) {
        this.network = network;
        this.fileSystem = fileSystem;
    }
}
//# sourceMappingURL=PersistenceImpl.js.map