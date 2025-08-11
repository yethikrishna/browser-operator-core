// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _ResourceTreeModel_instances, _ResourceTreeModel_securityOriginManager, _ResourceTreeModel_storageKeyManager, _ResourceTreeModel_cachedResourcesProcessed, _ResourceTreeModel_pendingReloadOptions, _ResourceTreeModel_reloadSuspensionCount, _ResourceTreeModel_pendingBackForwardCacheNotUsedEvents, _ResourceTreeModel_buildResourceTree, _ResourceTreeFrame_model, _ResourceTreeFrame_sameTargetParentFrameInternal, _ResourceTreeFrame_idInternal, _ResourceTreeFrame_loaderIdInternal, _ResourceTreeFrame_nameInternal, _ResourceTreeFrame_urlInternal, _ResourceTreeFrame_domainAndRegistryInternal, _ResourceTreeFrame_securityOrigin, _ResourceTreeFrame_securityOriginDetails, _ResourceTreeFrame_storageKeyInternal, _ResourceTreeFrame_unreachableUrlInternal, _ResourceTreeFrame_adFrameStatusInternal, _ResourceTreeFrame_secureContextType, _ResourceTreeFrame_crossOriginIsolatedContextType, _ResourceTreeFrame_gatedAPIFeatures, _ResourceTreeFrame_creationStackTrace, _ResourceTreeFrame_creationStackTraceTarget, _ResourceTreeFrame_childFramesInternal, _PageDispatcher_resourceTreeModel;
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import * as Platform from '../platform/platform.js';
import { DOMModel } from './DOMModel.js';
import { FrameManager } from './FrameManager.js';
import { Events as NetworkManagerEvents, NetworkManager } from './NetworkManager.js';
import { Resource } from './Resource.js';
import { ExecutionContext, RuntimeModel } from './RuntimeModel.js';
import { SDKModel } from './SDKModel.js';
import { SecurityOriginManager } from './SecurityOriginManager.js';
import { StorageKeyManager } from './StorageKeyManager.js';
import { Type } from './Target.js';
import { TargetManager } from './TargetManager.js';
export class ResourceTreeModel extends SDKModel {
    constructor(target) {
        super(target);
        _ResourceTreeModel_instances.add(this);
        _ResourceTreeModel_securityOriginManager.set(this, void 0);
        _ResourceTreeModel_storageKeyManager.set(this, void 0);
        this.framesInternal = new Map();
        _ResourceTreeModel_cachedResourcesProcessed.set(this, false);
        _ResourceTreeModel_pendingReloadOptions.set(this, null);
        _ResourceTreeModel_reloadSuspensionCount.set(this, 0);
        this.isInterstitialShowing = false;
        this.mainFrame = null;
        _ResourceTreeModel_pendingBackForwardCacheNotUsedEvents.set(this, new Set());
        const networkManager = target.model(NetworkManager);
        if (networkManager) {
            networkManager.addEventListener(NetworkManagerEvents.RequestFinished, this.onRequestFinished, this);
            networkManager.addEventListener(NetworkManagerEvents.RequestUpdateDropped, this.onRequestUpdateDropped, this);
        }
        this.agent = target.pageAgent();
        this.storageAgent = target.storageAgent();
        void this.agent.invoke_enable({});
        __classPrivateFieldSet(this, _ResourceTreeModel_securityOriginManager, target.model(SecurityOriginManager), "f");
        __classPrivateFieldSet(this, _ResourceTreeModel_storageKeyManager, target.model(StorageKeyManager), "f");
        target.registerPageDispatcher(new PageDispatcher(this));
        void __classPrivateFieldGet(this, _ResourceTreeModel_instances, "m", _ResourceTreeModel_buildResourceTree).call(this);
    }
    static frameForRequest(request) {
        const networkManager = NetworkManager.forRequest(request);
        const resourceTreeModel = networkManager ? networkManager.target().model(ResourceTreeModel) : null;
        if (!resourceTreeModel) {
            return null;
        }
        return request.frameId ? resourceTreeModel.frameForId(request.frameId) : null;
    }
    static frames() {
        const result = [];
        for (const resourceTreeModel of TargetManager.instance().models(ResourceTreeModel)) {
            result.push(...resourceTreeModel.frames());
        }
        return result;
    }
    static resourceForURL(url) {
        for (const resourceTreeModel of TargetManager.instance().models(ResourceTreeModel)) {
            const mainFrame = resourceTreeModel.mainFrame;
            // Workers call into this with no #frames available.
            const result = mainFrame ? mainFrame.resourceForURL(url) : null;
            if (result) {
                return result;
            }
        }
        return null;
    }
    static reloadAllPages(bypassCache, scriptToEvaluateOnLoad) {
        for (const resourceTreeModel of TargetManager.instance().models(ResourceTreeModel)) {
            if (resourceTreeModel.target().parentTarget()?.type() !== Type.FRAME) {
                resourceTreeModel.reloadPage(bypassCache, scriptToEvaluateOnLoad);
            }
        }
    }
    async storageKeyForFrame(frameId) {
        if (!this.framesInternal.has(frameId)) {
            return null;
        }
        const response = await this.storageAgent.invoke_getStorageKeyForFrame({ frameId });
        if (response.getError() === 'Frame tree node for given frame not found') {
            return null;
        }
        return response.storageKey;
    }
    domModel() {
        return this.target().model(DOMModel);
    }
    processCachedResources(mainFramePayload) {
        // TODO(caseq): the url check below is a mergeable, conservative
        // workaround for a problem caused by us requesting resources from a
        // subtarget frame before it has committed. The proper fix is likely
        // to be too complicated to be safely merged.
        // See https://crbug.com/1081270 for details.
        if (mainFramePayload && mainFramePayload.frame.url !== ':') {
            this.dispatchEventToListeners(Events.WillLoadCachedResources);
            this.addFramesRecursively(null, mainFramePayload);
            this.target().setInspectedURL(mainFramePayload.frame.url);
        }
        __classPrivateFieldSet(this, _ResourceTreeModel_cachedResourcesProcessed, true, "f");
        const runtimeModel = this.target().model(RuntimeModel);
        if (runtimeModel) {
            runtimeModel.setExecutionContextComparator(this.executionContextComparator.bind(this));
            runtimeModel.fireExecutionContextOrderChanged();
        }
        this.dispatchEventToListeners(Events.CachedResourcesLoaded, this);
    }
    cachedResourcesLoaded() {
        return __classPrivateFieldGet(this, _ResourceTreeModel_cachedResourcesProcessed, "f");
    }
    addFrame(frame, _aboutToNavigate) {
        this.framesInternal.set(frame.id, frame);
        if (frame.isMainFrame()) {
            this.mainFrame = frame;
        }
        this.dispatchEventToListeners(Events.FrameAdded, frame);
        this.updateSecurityOrigins();
        void this.updateStorageKeys();
    }
    frameAttached(frameId, parentFrameId, stackTrace) {
        const sameTargetParentFrame = parentFrameId ? (this.framesInternal.get(parentFrameId) || null) : null;
        // Do nothing unless cached resource tree is processed - it will overwrite everything.
        if (!__classPrivateFieldGet(this, _ResourceTreeModel_cachedResourcesProcessed, "f") && sameTargetParentFrame) {
            return null;
        }
        if (this.framesInternal.has(frameId)) {
            return null;
        }
        const frame = new ResourceTreeFrame(this, sameTargetParentFrame, frameId, null, stackTrace || null);
        if (parentFrameId && !sameTargetParentFrame) {
            frame.crossTargetParentFrameId = parentFrameId;
        }
        if (frame.isMainFrame() && this.mainFrame) {
            // Navigation to the new backend process.
            this.frameDetached(this.mainFrame.id, false);
        }
        this.addFrame(frame, true);
        return frame;
    }
    frameNavigated(framePayload, type) {
        const sameTargetParentFrame = framePayload.parentId ? (this.framesInternal.get(framePayload.parentId) || null) : null;
        // Do nothing unless cached resource tree is processed - it will overwrite everything.
        if (!__classPrivateFieldGet(this, _ResourceTreeModel_cachedResourcesProcessed, "f") && sameTargetParentFrame) {
            return;
        }
        let frame = this.framesInternal.get(framePayload.id) || null;
        if (!frame) {
            // Simulate missed "frameAttached" for a main frame navigation to the new backend process.
            frame = this.frameAttached(framePayload.id, framePayload.parentId || null);
            console.assert(Boolean(frame));
            if (!frame) {
                return;
            }
        }
        this.dispatchEventToListeners(Events.FrameWillNavigate, frame);
        frame.navigate(framePayload);
        if (type) {
            frame.backForwardCacheDetails.restoredFromCache = type === "BackForwardCacheRestore" /* Protocol.Page.NavigationType.BackForwardCacheRestore */;
        }
        if (frame.isMainFrame()) {
            this.target().setInspectedURL(frame.url);
        }
        this.dispatchEventToListeners(Events.FrameNavigated, frame);
        if (frame.isPrimaryFrame()) {
            this.primaryPageChanged(frame, "Navigation" /* PrimaryPageChangeType.NAVIGATION */);
        }
        // Fill frame with retained resources (the ones loaded using new loader).
        const resources = frame.resources();
        for (let i = 0; i < resources.length; ++i) {
            this.dispatchEventToListeners(Events.ResourceAdded, resources[i]);
        }
        this.updateSecurityOrigins();
        void this.updateStorageKeys();
        if (frame.backForwardCacheDetails.restoredFromCache) {
            FrameManager.instance().modelRemoved(this);
            FrameManager.instance().modelAdded(this);
            void __classPrivateFieldGet(this, _ResourceTreeModel_instances, "m", _ResourceTreeModel_buildResourceTree).call(this);
        }
    }
    primaryPageChanged(frame, type) {
        this.processPendingEvents(frame);
        this.dispatchEventToListeners(Events.PrimaryPageChanged, { frame, type });
        const networkManager = this.target().model(NetworkManager);
        if (networkManager && frame.isOutermostFrame()) {
            networkManager.clearRequests();
        }
    }
    documentOpened(framePayload) {
        this.frameNavigated(framePayload, undefined);
        const frame = this.framesInternal.get(framePayload.id);
        if (frame && !frame.getResourcesMap().get(framePayload.url)) {
            const frameResource = this.createResourceFromFramePayload(framePayload, framePayload.url, Common.ResourceType.resourceTypes.Document, framePayload.mimeType, null, null);
            frameResource.isGenerated = true;
            frame.addResource(frameResource);
        }
    }
    frameDetached(frameId, isSwap) {
        // Do nothing unless cached resource tree is processed - it will overwrite everything.
        if (!__classPrivateFieldGet(this, _ResourceTreeModel_cachedResourcesProcessed, "f")) {
            return;
        }
        const frame = this.framesInternal.get(frameId);
        if (!frame) {
            return;
        }
        const sameTargetParentFrame = frame.sameTargetParentFrame();
        if (sameTargetParentFrame) {
            sameTargetParentFrame.removeChildFrame(frame, isSwap);
        }
        else {
            frame.remove(isSwap);
        }
        this.updateSecurityOrigins();
        void this.updateStorageKeys();
    }
    onRequestFinished(event) {
        if (!__classPrivateFieldGet(this, _ResourceTreeModel_cachedResourcesProcessed, "f")) {
            return;
        }
        const request = event.data;
        if (request.failed) {
            return;
        }
        const frame = request.frameId ? this.framesInternal.get(request.frameId) : null;
        if (frame) {
            frame.addRequest(request);
        }
    }
    onRequestUpdateDropped(event) {
        if (!__classPrivateFieldGet(this, _ResourceTreeModel_cachedResourcesProcessed, "f")) {
            return;
        }
        const data = event.data;
        const frameId = data.frameId;
        if (!frameId) {
            return;
        }
        const frame = this.framesInternal.get(frameId);
        if (!frame) {
            return;
        }
        const url = data.url;
        if (frame.getResourcesMap().get(url)) {
            return;
        }
        const resource = new Resource(this, null, url, frame.url, frameId, data.loaderId, Common.ResourceType.resourceTypes[data.resourceType], data.mimeType, data.lastModified, null);
        frame.addResource(resource);
    }
    frameForId(frameId) {
        return this.framesInternal.get(frameId) || null;
    }
    forAllResources(callback) {
        if (this.mainFrame) {
            return this.mainFrame.callForFrameResources(callback);
        }
        return false;
    }
    frames() {
        return [...this.framesInternal.values()];
    }
    addFramesRecursively(sameTargetParentFrame, frameTreePayload) {
        const framePayload = frameTreePayload.frame;
        let frame = this.framesInternal.get(framePayload.id);
        if (!frame) {
            frame = new ResourceTreeFrame(this, sameTargetParentFrame, framePayload.id, framePayload, null);
        }
        if (!sameTargetParentFrame && framePayload.parentId) {
            frame.crossTargetParentFrameId = framePayload.parentId;
        }
        this.addFrame(frame);
        for (const childFrame of frameTreePayload.childFrames || []) {
            this.addFramesRecursively(frame, childFrame);
        }
        for (let i = 0; i < frameTreePayload.resources.length; ++i) {
            const subresource = frameTreePayload.resources[i];
            const resource = this.createResourceFromFramePayload(framePayload, subresource.url, Common.ResourceType.resourceTypes[subresource.type], subresource.mimeType, subresource.lastModified || null, subresource.contentSize || null);
            frame.addResource(resource);
        }
        if (!frame.getResourcesMap().get(framePayload.url)) {
            const frameResource = this.createResourceFromFramePayload(framePayload, framePayload.url, Common.ResourceType.resourceTypes.Document, framePayload.mimeType, null, null);
            frame.addResource(frameResource);
        }
    }
    createResourceFromFramePayload(frame, url, type, mimeType, lastModifiedTime, contentSize) {
        const lastModified = typeof lastModifiedTime === 'number' ? new Date(lastModifiedTime * 1000) : null;
        return new Resource(this, null, url, frame.url, frame.id, frame.loaderId, type, mimeType, lastModified, contentSize);
    }
    suspendReload() {
        var _a;
        __classPrivateFieldSet(this, _ResourceTreeModel_reloadSuspensionCount, (_a = __classPrivateFieldGet(this, _ResourceTreeModel_reloadSuspensionCount, "f"), _a++, _a), "f");
    }
    resumeReload() {
        var _a;
        __classPrivateFieldSet(this, _ResourceTreeModel_reloadSuspensionCount, (_a = __classPrivateFieldGet(this, _ResourceTreeModel_reloadSuspensionCount, "f"), _a--, _a), "f");
        console.assert(__classPrivateFieldGet(this, _ResourceTreeModel_reloadSuspensionCount, "f") >= 0, 'Unbalanced call to ResourceTreeModel.resumeReload()');
        if (!__classPrivateFieldGet(this, _ResourceTreeModel_reloadSuspensionCount, "f") && __classPrivateFieldGet(this, _ResourceTreeModel_pendingReloadOptions, "f")) {
            const { ignoreCache, scriptToEvaluateOnLoad } = __classPrivateFieldGet(this, _ResourceTreeModel_pendingReloadOptions, "f");
            this.reloadPage(ignoreCache, scriptToEvaluateOnLoad);
        }
    }
    reloadPage(ignoreCache, scriptToEvaluateOnLoad) {
        const loaderId = this.mainFrame?.loaderId;
        if (!loaderId) {
            return;
        }
        // Only dispatch PageReloadRequested upon first reload request to simplify client logic.
        if (!__classPrivateFieldGet(this, _ResourceTreeModel_pendingReloadOptions, "f")) {
            this.dispatchEventToListeners(Events.PageReloadRequested, this);
        }
        if (__classPrivateFieldGet(this, _ResourceTreeModel_reloadSuspensionCount, "f")) {
            __classPrivateFieldSet(this, _ResourceTreeModel_pendingReloadOptions, { ignoreCache, scriptToEvaluateOnLoad }, "f");
            return;
        }
        __classPrivateFieldSet(this, _ResourceTreeModel_pendingReloadOptions, null, "f");
        const networkManager = this.target().model(NetworkManager);
        if (networkManager) {
            networkManager.clearRequests();
        }
        this.dispatchEventToListeners(Events.WillReloadPage);
        void this.agent.invoke_reload({ ignoreCache, scriptToEvaluateOnLoad, loaderId });
    }
    navigate(url) {
        return this.agent.invoke_navigate({ url });
    }
    async navigationHistory() {
        const response = await this.agent.invoke_getNavigationHistory();
        if (response.getError()) {
            return null;
        }
        return { currentIndex: response.currentIndex, entries: response.entries };
    }
    navigateToHistoryEntry(entry) {
        void this.agent.invoke_navigateToHistoryEntry({ entryId: entry.id });
    }
    setLifecycleEventsEnabled(enabled) {
        return this.agent.invoke_setLifecycleEventsEnabled({ enabled });
    }
    async fetchAppManifest() {
        const response = await this.agent.invoke_getAppManifest({});
        if (response.getError()) {
            return { url: response.url, data: null, errors: [] };
        }
        return { url: response.url, data: response.data || null, errors: response.errors };
    }
    async getInstallabilityErrors() {
        const response = await this.agent.invoke_getInstallabilityErrors();
        return response.installabilityErrors || [];
    }
    async getAppId() {
        return await this.agent.invoke_getAppId();
    }
    executionContextComparator(a, b) {
        function framePath(frame) {
            let currentFrame = frame;
            const parents = [];
            while (currentFrame) {
                parents.push(currentFrame);
                currentFrame = currentFrame.sameTargetParentFrame();
            }
            return parents.reverse();
        }
        if (a.target() !== b.target()) {
            return ExecutionContext.comparator(a, b);
        }
        const framesA = a.frameId ? framePath(this.frameForId(a.frameId)) : [];
        const framesB = b.frameId ? framePath(this.frameForId(b.frameId)) : [];
        let frameA;
        let frameB;
        for (let i = 0;; i++) {
            if (!framesA[i] || !framesB[i] || (framesA[i] !== framesB[i])) {
                frameA = framesA[i];
                frameB = framesB[i];
                break;
            }
        }
        if (!frameA && frameB) {
            return -1;
        }
        if (!frameB && frameA) {
            return 1;
        }
        if (frameA && frameB) {
            return frameA.id.localeCompare(frameB.id);
        }
        return ExecutionContext.comparator(a, b);
    }
    getSecurityOriginData() {
        const securityOrigins = new Set();
        let mainSecurityOrigin = null;
        let unreachableMainSecurityOrigin = null;
        for (const frame of this.framesInternal.values()) {
            const origin = frame.securityOrigin;
            if (!origin) {
                continue;
            }
            securityOrigins.add(origin);
            if (frame.isMainFrame()) {
                mainSecurityOrigin = origin;
                if (frame.unreachableUrl()) {
                    const unreachableParsed = new Common.ParsedURL.ParsedURL(frame.unreachableUrl());
                    unreachableMainSecurityOrigin = unreachableParsed.securityOrigin();
                }
            }
        }
        return {
            securityOrigins,
            mainSecurityOrigin,
            unreachableMainSecurityOrigin,
        };
    }
    async getStorageKeyData() {
        const storageKeys = new Set();
        let mainStorageKey = null;
        for (const { isMainFrame, storageKey } of await Promise.all([...this.framesInternal.values()].map(f => f.getStorageKey(/* forceFetch */ false).then(k => ({
            isMainFrame: f.isMainFrame(),
            storageKey: k,
        }))))) {
            if (isMainFrame) {
                mainStorageKey = storageKey;
            }
            if (storageKey) {
                storageKeys.add(storageKey);
            }
        }
        return { storageKeys, mainStorageKey };
    }
    updateSecurityOrigins() {
        const data = this.getSecurityOriginData();
        __classPrivateFieldGet(this, _ResourceTreeModel_securityOriginManager, "f").setMainSecurityOrigin(data.mainSecurityOrigin || '', data.unreachableMainSecurityOrigin || '');
        __classPrivateFieldGet(this, _ResourceTreeModel_securityOriginManager, "f").updateSecurityOrigins(data.securityOrigins);
    }
    async updateStorageKeys() {
        const data = await this.getStorageKeyData();
        __classPrivateFieldGet(this, _ResourceTreeModel_storageKeyManager, "f").setMainStorageKey(data.mainStorageKey || '');
        __classPrivateFieldGet(this, _ResourceTreeModel_storageKeyManager, "f").updateStorageKeys(data.storageKeys);
    }
    async getMainStorageKey() {
        return this.mainFrame ? await this.mainFrame.getStorageKey(/* forceFetch */ false) : null;
    }
    getMainSecurityOrigin() {
        const data = this.getSecurityOriginData();
        return data.mainSecurityOrigin || data.unreachableMainSecurityOrigin;
    }
    onBackForwardCacheNotUsed(event) {
        if (this.mainFrame && this.mainFrame.id === event.frameId && this.mainFrame.loaderId === event.loaderId) {
            this.mainFrame.setBackForwardCacheDetails(event);
            this.dispatchEventToListeners(Events.BackForwardCacheDetailsUpdated, this.mainFrame);
        }
        else {
            __classPrivateFieldGet(this, _ResourceTreeModel_pendingBackForwardCacheNotUsedEvents, "f").add(event);
        }
    }
    processPendingEvents(frame) {
        if (!frame.isMainFrame()) {
            return;
        }
        for (const event of __classPrivateFieldGet(this, _ResourceTreeModel_pendingBackForwardCacheNotUsedEvents, "f")) {
            if (frame.id === event.frameId && frame.loaderId === event.loaderId) {
                frame.setBackForwardCacheDetails(event);
                __classPrivateFieldGet(this, _ResourceTreeModel_pendingBackForwardCacheNotUsedEvents, "f").delete(event);
                break;
            }
        }
        // No need to dispatch events here as this method call is followed by a `PrimaryPageChanged` event.
    }
}
_ResourceTreeModel_securityOriginManager = new WeakMap(), _ResourceTreeModel_storageKeyManager = new WeakMap(), _ResourceTreeModel_cachedResourcesProcessed = new WeakMap(), _ResourceTreeModel_pendingReloadOptions = new WeakMap(), _ResourceTreeModel_reloadSuspensionCount = new WeakMap(), _ResourceTreeModel_pendingBackForwardCacheNotUsedEvents = new WeakMap(), _ResourceTreeModel_instances = new WeakSet(), _ResourceTreeModel_buildResourceTree = async function _ResourceTreeModel_buildResourceTree() {
    return await this.agent.invoke_getResourceTree().then(event => {
        this.processCachedResources(event.getError() ? null : event.frameTree);
        if (this.mainFrame) {
            this.processPendingEvents(this.mainFrame);
        }
    });
};
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["FrameAdded"] = "FrameAdded";
    Events["FrameNavigated"] = "FrameNavigated";
    Events["FrameDetached"] = "FrameDetached";
    Events["FrameResized"] = "FrameResized";
    Events["FrameWillNavigate"] = "FrameWillNavigate";
    Events["PrimaryPageChanged"] = "PrimaryPageChanged";
    Events["ResourceAdded"] = "ResourceAdded";
    Events["WillLoadCachedResources"] = "WillLoadCachedResources";
    Events["CachedResourcesLoaded"] = "CachedResourcesLoaded";
    Events["DOMContentLoaded"] = "DOMContentLoaded";
    Events["LifecycleEvent"] = "LifecycleEvent";
    Events["Load"] = "Load";
    Events["PageReloadRequested"] = "PageReloadRequested";
    Events["WillReloadPage"] = "WillReloadPage";
    Events["InterstitialShown"] = "InterstitialShown";
    Events["InterstitialHidden"] = "InterstitialHidden";
    Events["BackForwardCacheDetailsUpdated"] = "BackForwardCacheDetailsUpdated";
    Events["JavaScriptDialogOpening"] = "JavaScriptDialogOpening";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
export class ResourceTreeFrame {
    constructor(model, parentFrame, frameId, payload, creationStackTrace) {
        _ResourceTreeFrame_model.set(this, void 0);
        _ResourceTreeFrame_sameTargetParentFrameInternal.set(this, void 0);
        _ResourceTreeFrame_idInternal.set(this, void 0);
        this.crossTargetParentFrameId = null;
        _ResourceTreeFrame_loaderIdInternal.set(this, void 0);
        _ResourceTreeFrame_nameInternal.set(this, void 0);
        _ResourceTreeFrame_urlInternal.set(this, void 0);
        _ResourceTreeFrame_domainAndRegistryInternal.set(this, void 0);
        _ResourceTreeFrame_securityOrigin.set(this, void 0);
        _ResourceTreeFrame_securityOriginDetails.set(this, void 0);
        _ResourceTreeFrame_storageKeyInternal.set(this, void 0);
        _ResourceTreeFrame_unreachableUrlInternal.set(this, void 0);
        _ResourceTreeFrame_adFrameStatusInternal.set(this, void 0);
        _ResourceTreeFrame_secureContextType.set(this, void 0);
        _ResourceTreeFrame_crossOriginIsolatedContextType.set(this, void 0);
        _ResourceTreeFrame_gatedAPIFeatures.set(this, void 0);
        _ResourceTreeFrame_creationStackTrace.set(this, void 0);
        _ResourceTreeFrame_creationStackTraceTarget.set(this, null);
        _ResourceTreeFrame_childFramesInternal.set(this, new Set());
        this.resourcesMap = new Map();
        this.backForwardCacheDetails = {
            restoredFromCache: undefined,
            explanations: [],
            explanationsTree: undefined,
        };
        __classPrivateFieldSet(this, _ResourceTreeFrame_model, model, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_sameTargetParentFrameInternal, parentFrame, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_idInternal, frameId, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_loaderIdInternal, payload?.loaderId ?? '', "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_nameInternal, payload?.name, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_urlInternal, payload && payload.url || Platform.DevToolsPath.EmptyUrlString, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_domainAndRegistryInternal, (payload?.domainAndRegistry) || '', "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_securityOrigin, payload?.securityOrigin ?? null, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_securityOriginDetails, payload?.securityOriginDetails, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_unreachableUrlInternal, (payload && payload.unreachableUrl) || Platform.DevToolsPath.EmptyUrlString, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_adFrameStatusInternal, payload?.adFrameStatus, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_secureContextType, payload?.secureContextType ?? null, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_crossOriginIsolatedContextType, payload?.crossOriginIsolatedContextType ?? null, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_gatedAPIFeatures, payload?.gatedAPIFeatures ?? null, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_creationStackTrace, creationStackTrace, "f");
        if (__classPrivateFieldGet(this, _ResourceTreeFrame_sameTargetParentFrameInternal, "f")) {
            __classPrivateFieldGet(__classPrivateFieldGet(this, _ResourceTreeFrame_sameTargetParentFrameInternal, "f"), _ResourceTreeFrame_childFramesInternal, "f").add(this);
        }
    }
    isSecureContext() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_secureContextType, "f") !== null && __classPrivateFieldGet(this, _ResourceTreeFrame_secureContextType, "f").startsWith('Secure');
    }
    getSecureContextType() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_secureContextType, "f");
    }
    isCrossOriginIsolated() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_crossOriginIsolatedContextType, "f") !== null && __classPrivateFieldGet(this, _ResourceTreeFrame_crossOriginIsolatedContextType, "f").startsWith('Isolated');
    }
    getCrossOriginIsolatedContextType() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_crossOriginIsolatedContextType, "f");
    }
    getGatedAPIFeatures() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_gatedAPIFeatures, "f");
    }
    getCreationStackTraceData() {
        return {
            creationStackTrace: __classPrivateFieldGet(this, _ResourceTreeFrame_creationStackTrace, "f"),
            creationStackTraceTarget: __classPrivateFieldGet(this, _ResourceTreeFrame_creationStackTraceTarget, "f") || this.resourceTreeModel().target(),
        };
    }
    navigate(framePayload) {
        __classPrivateFieldSet(this, _ResourceTreeFrame_loaderIdInternal, framePayload.loaderId, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_nameInternal, framePayload.name, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_urlInternal, framePayload.url, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_domainAndRegistryInternal, framePayload.domainAndRegistry, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_securityOrigin, framePayload.securityOrigin, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_securityOriginDetails, framePayload.securityOriginDetails, "f");
        void this.getStorageKey(/* forceFetch */ true);
        __classPrivateFieldSet(this, _ResourceTreeFrame_unreachableUrlInternal, framePayload.unreachableUrl || Platform.DevToolsPath.EmptyUrlString, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_adFrameStatusInternal, framePayload?.adFrameStatus, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_secureContextType, framePayload.secureContextType, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_crossOriginIsolatedContextType, framePayload.crossOriginIsolatedContextType, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_gatedAPIFeatures, framePayload.gatedAPIFeatures, "f");
        this.backForwardCacheDetails = {
            restoredFromCache: undefined,
            explanations: [],
            explanationsTree: undefined,
        };
        const mainResource = this.resourcesMap.get(__classPrivateFieldGet(this, _ResourceTreeFrame_urlInternal, "f"));
        this.resourcesMap.clear();
        this.removeChildFrames();
        if (mainResource && mainResource.loaderId === __classPrivateFieldGet(this, _ResourceTreeFrame_loaderIdInternal, "f")) {
            this.addResource(mainResource);
        }
    }
    resourceTreeModel() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_model, "f");
    }
    get id() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_idInternal, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_nameInternal, "f") || '';
    }
    get url() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_urlInternal, "f");
    }
    domainAndRegistry() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_domainAndRegistryInternal, "f");
    }
    async getAdScriptAncestry(frameId) {
        const res = await __classPrivateFieldGet(this, _ResourceTreeFrame_model, "f").agent.invoke_getAdScriptAncestry({ frameId });
        return res.adScriptAncestry || null;
    }
    get securityOrigin() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_securityOrigin, "f");
    }
    get securityOriginDetails() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_securityOriginDetails, "f") ?? null;
    }
    getStorageKey(forceFetch) {
        if (!__classPrivateFieldGet(this, _ResourceTreeFrame_storageKeyInternal, "f") || forceFetch) {
            __classPrivateFieldSet(this, _ResourceTreeFrame_storageKeyInternal, __classPrivateFieldGet(this, _ResourceTreeFrame_model, "f").storageKeyForFrame(__classPrivateFieldGet(this, _ResourceTreeFrame_idInternal, "f")), "f");
        }
        return __classPrivateFieldGet(this, _ResourceTreeFrame_storageKeyInternal, "f");
    }
    unreachableUrl() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_unreachableUrlInternal, "f");
    }
    get loaderId() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_loaderIdInternal, "f");
    }
    adFrameType() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_adFrameStatusInternal, "f")?.adFrameType || "none" /* Protocol.Page.AdFrameType.None */;
    }
    adFrameStatus() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_adFrameStatusInternal, "f");
    }
    get childFrames() {
        return [...__classPrivateFieldGet(this, _ResourceTreeFrame_childFramesInternal, "f")];
    }
    /**
     * Returns the parent frame if both #frames are part of the same process/target.
     */
    sameTargetParentFrame() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_sameTargetParentFrameInternal, "f");
    }
    /**
     * Returns the parent frame if both #frames are part of different processes/targets (child is an OOPIF).
     */
    crossTargetParentFrame() {
        if (!this.crossTargetParentFrameId) {
            return null;
        }
        const parentTarget = __classPrivateFieldGet(this, _ResourceTreeFrame_model, "f").target().parentTarget();
        if (parentTarget?.type() !== Type.FRAME) {
            return null;
        }
        const parentModel = parentTarget.model(ResourceTreeModel);
        if (!parentModel) {
            return null;
        }
        // Note that parent #model has already processed cached resources:
        // - when parent target was created, we issued getResourceTree call;
        // - strictly after we issued setAutoAttach call;
        // - both of them were handled in renderer in the same order;
        // - cached resource tree got processed on parent #model;
        // - child target was created as a result of setAutoAttach call.
        return parentModel.framesInternal.get(this.crossTargetParentFrameId) || null;
    }
    /**
     * Returns the parent frame. There is only 1 parent and it's either in the
     * same target or it's cross-target.
     */
    parentFrame() {
        return this.sameTargetParentFrame() || this.crossTargetParentFrame();
    }
    /**
     * Returns true if this is the main frame of its target. A main frame is the root of the frame tree i.e. a frame without
     * a parent, but the whole frame tree could be embedded in another frame tree (e.g. OOPIFs, fenced frames, portals).
     * https://chromium.googlesource.com/chromium/src/+/HEAD/docs/frame_trees.md
     */
    isMainFrame() {
        return !__classPrivateFieldGet(this, _ResourceTreeFrame_sameTargetParentFrameInternal, "f");
    }
    /**
     * Returns true if this is a main frame which is not embedded in another frame tree. With MPArch features such as
     * back/forward cache or prerender there can be multiple outermost frames.
     * https://chromium.googlesource.com/chromium/src/+/HEAD/docs/frame_trees.md
     */
    isOutermostFrame() {
        return __classPrivateFieldGet(this, _ResourceTreeFrame_model, "f").target().parentTarget()?.type() !== Type.FRAME && !__classPrivateFieldGet(this, _ResourceTreeFrame_sameTargetParentFrameInternal, "f") &&
            !this.crossTargetParentFrameId;
    }
    /**
     * Returns true if this is the primary frame of the browser tab. There can only be one primary frame for each
     * browser tab. It is the outermost frame being actively displayed in the browser tab.
     * https://chromium.googlesource.com/chromium/src/+/HEAD/docs/frame_trees.md
     */
    isPrimaryFrame() {
        return !__classPrivateFieldGet(this, _ResourceTreeFrame_sameTargetParentFrameInternal, "f") &&
            __classPrivateFieldGet(this, _ResourceTreeFrame_model, "f").target() === TargetManager.instance().primaryPageTarget();
    }
    removeChildFrame(frame, isSwap) {
        __classPrivateFieldGet(this, _ResourceTreeFrame_childFramesInternal, "f").delete(frame);
        frame.remove(isSwap);
    }
    removeChildFrames() {
        const frames = __classPrivateFieldGet(this, _ResourceTreeFrame_childFramesInternal, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_childFramesInternal, new Set(), "f");
        for (const frame of frames) {
            frame.remove(false);
        }
    }
    remove(isSwap) {
        this.removeChildFrames();
        __classPrivateFieldGet(this, _ResourceTreeFrame_model, "f").framesInternal.delete(this.id);
        __classPrivateFieldGet(this, _ResourceTreeFrame_model, "f").dispatchEventToListeners(Events.FrameDetached, { frame: this, isSwap });
    }
    addResource(resource) {
        if (this.resourcesMap.get(resource.url) === resource) {
            // Already in the tree, we just got an extra update.
            return;
        }
        this.resourcesMap.set(resource.url, resource);
        __classPrivateFieldGet(this, _ResourceTreeFrame_model, "f").dispatchEventToListeners(Events.ResourceAdded, resource);
    }
    addRequest(request) {
        let resource = this.resourcesMap.get(request.url());
        if (resource && resource.request === request) {
            // Already in the tree, we just got an extra update.
            return;
        }
        resource = new Resource(__classPrivateFieldGet(this, _ResourceTreeFrame_model, "f"), request, request.url(), request.documentURL, request.frameId, request.loaderId, request.resourceType(), request.mimeType, null, null);
        this.resourcesMap.set(resource.url, resource);
        __classPrivateFieldGet(this, _ResourceTreeFrame_model, "f").dispatchEventToListeners(Events.ResourceAdded, resource);
    }
    resources() {
        return Array.from(this.resourcesMap.values());
    }
    resourceForURL(url) {
        const resource = this.resourcesMap.get(url);
        if (resource) {
            return resource;
        }
        for (const frame of __classPrivateFieldGet(this, _ResourceTreeFrame_childFramesInternal, "f")) {
            const resource = frame.resourceForURL(url);
            if (resource) {
                return resource;
            }
        }
        return null;
    }
    callForFrameResources(callback) {
        for (const resource of this.resourcesMap.values()) {
            if (callback(resource)) {
                return true;
            }
        }
        for (const frame of __classPrivateFieldGet(this, _ResourceTreeFrame_childFramesInternal, "f")) {
            if (frame.callForFrameResources(callback)) {
                return true;
            }
        }
        return false;
    }
    displayName() {
        if (this.isOutermostFrame()) {
            return i18n.i18n.lockedString('top');
        }
        const subtitle = new Common.ParsedURL.ParsedURL(__classPrivateFieldGet(this, _ResourceTreeFrame_urlInternal, "f")).displayName;
        if (subtitle) {
            if (!__classPrivateFieldGet(this, _ResourceTreeFrame_nameInternal, "f")) {
                return subtitle;
            }
            return __classPrivateFieldGet(this, _ResourceTreeFrame_nameInternal, "f") + ' (' + subtitle + ')';
        }
        return i18n.i18n.lockedString('iframe');
    }
    async getOwnerDeferredDOMNode() {
        const parentFrame = this.parentFrame();
        if (!parentFrame) {
            return null;
        }
        return await parentFrame.resourceTreeModel().domModel().getOwnerNodeForFrame(__classPrivateFieldGet(this, _ResourceTreeFrame_idInternal, "f"));
    }
    async getOwnerDOMNodeOrDocument() {
        const deferredNode = await this.getOwnerDeferredDOMNode();
        if (deferredNode) {
            return await deferredNode.resolvePromise();
        }
        if (this.isOutermostFrame()) {
            return await this.resourceTreeModel().domModel().requestDocument();
        }
        return null;
    }
    async highlight() {
        const parentFrame = this.parentFrame();
        const parentTarget = this.resourceTreeModel().target().parentTarget();
        const highlightFrameOwner = async (domModel) => {
            const deferredNode = await domModel.getOwnerNodeForFrame(__classPrivateFieldGet(this, _ResourceTreeFrame_idInternal, "f"));
            if (deferredNode) {
                domModel.overlayModel().highlightInOverlay({ deferredNode, selectorList: '' }, 'all', true);
            }
        };
        if (parentFrame) {
            return await highlightFrameOwner(parentFrame.resourceTreeModel().domModel());
        }
        // Fenced frames.
        if (parentTarget?.type() === Type.FRAME) {
            const domModel = parentTarget.model(DOMModel);
            if (domModel) {
                return await highlightFrameOwner(domModel);
            }
        }
        // For the outermost frame there is no owner node. Highlight the whole #document instead.
        const document = await this.resourceTreeModel().domModel().requestDocument();
        if (document) {
            this.resourceTreeModel().domModel().overlayModel().highlightInOverlay({ node: document, selectorList: '' }, 'all', true);
        }
    }
    async getPermissionsPolicyState() {
        const response = await this.resourceTreeModel().target().pageAgent().invoke_getPermissionsPolicyState({ frameId: __classPrivateFieldGet(this, _ResourceTreeFrame_idInternal, "f") });
        if (response.getError()) {
            return null;
        }
        return response.states;
    }
    async getOriginTrials() {
        const response = await this.resourceTreeModel().target().pageAgent().invoke_getOriginTrials({ frameId: __classPrivateFieldGet(this, _ResourceTreeFrame_idInternal, "f") });
        if (response.getError()) {
            return [];
        }
        return response.originTrials;
    }
    setCreationStackTrace(creationStackTraceData) {
        __classPrivateFieldSet(this, _ResourceTreeFrame_creationStackTrace, creationStackTraceData.creationStackTrace, "f");
        __classPrivateFieldSet(this, _ResourceTreeFrame_creationStackTraceTarget, creationStackTraceData.creationStackTraceTarget, "f");
    }
    setBackForwardCacheDetails(event) {
        this.backForwardCacheDetails.restoredFromCache = false;
        this.backForwardCacheDetails.explanations = event.notRestoredExplanations;
        this.backForwardCacheDetails.explanationsTree = event.notRestoredExplanationsTree;
    }
    getResourcesMap() {
        return this.resourcesMap;
    }
}
_ResourceTreeFrame_model = new WeakMap(), _ResourceTreeFrame_sameTargetParentFrameInternal = new WeakMap(), _ResourceTreeFrame_idInternal = new WeakMap(), _ResourceTreeFrame_loaderIdInternal = new WeakMap(), _ResourceTreeFrame_nameInternal = new WeakMap(), _ResourceTreeFrame_urlInternal = new WeakMap(), _ResourceTreeFrame_domainAndRegistryInternal = new WeakMap(), _ResourceTreeFrame_securityOrigin = new WeakMap(), _ResourceTreeFrame_securityOriginDetails = new WeakMap(), _ResourceTreeFrame_storageKeyInternal = new WeakMap(), _ResourceTreeFrame_unreachableUrlInternal = new WeakMap(), _ResourceTreeFrame_adFrameStatusInternal = new WeakMap(), _ResourceTreeFrame_secureContextType = new WeakMap(), _ResourceTreeFrame_crossOriginIsolatedContextType = new WeakMap(), _ResourceTreeFrame_gatedAPIFeatures = new WeakMap(), _ResourceTreeFrame_creationStackTrace = new WeakMap(), _ResourceTreeFrame_creationStackTraceTarget = new WeakMap(), _ResourceTreeFrame_childFramesInternal = new WeakMap();
export class PageDispatcher {
    constructor(resourceTreeModel) {
        _PageDispatcher_resourceTreeModel.set(this, void 0);
        __classPrivateFieldSet(this, _PageDispatcher_resourceTreeModel, resourceTreeModel, "f");
    }
    backForwardCacheNotUsed(params) {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").onBackForwardCacheNotUsed(params);
    }
    domContentEventFired({ timestamp }) {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").dispatchEventToListeners(Events.DOMContentLoaded, timestamp);
    }
    loadEventFired({ timestamp }) {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").dispatchEventToListeners(Events.Load, { resourceTreeModel: __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f"), loadTime: timestamp });
    }
    lifecycleEvent({ frameId, name }) {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").dispatchEventToListeners(Events.LifecycleEvent, { frameId, name });
    }
    frameAttached({ frameId, parentFrameId, stack }) {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").frameAttached(frameId, parentFrameId, stack);
    }
    frameNavigated({ frame, type }) {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").frameNavigated(frame, type);
    }
    documentOpened({ frame }) {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").documentOpened(frame);
    }
    frameDetached({ frameId, reason }) {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").frameDetached(frameId, reason === "swap" /* Protocol.Page.FrameDetachedEventReason.Swap */);
    }
    frameSubtreeWillBeDetached(_params) {
    }
    frameStartedLoading({}) {
    }
    frameStoppedLoading({}) {
    }
    frameRequestedNavigation({}) {
    }
    frameScheduledNavigation({}) {
    }
    frameClearedScheduledNavigation({}) {
    }
    frameStartedNavigating({}) {
    }
    navigatedWithinDocument({}) {
    }
    frameResized() {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").dispatchEventToListeners(Events.FrameResized);
    }
    javascriptDialogOpening(event) {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").dispatchEventToListeners(Events.JavaScriptDialogOpening, event);
        if (!event.hasBrowserHandler) {
            void __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").agent.invoke_handleJavaScriptDialog({ accept: false });
        }
    }
    javascriptDialogClosed({}) {
    }
    screencastFrame({}) {
    }
    screencastVisibilityChanged({}) {
    }
    interstitialShown() {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").isInterstitialShowing = true;
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").dispatchEventToListeners(Events.InterstitialShown);
    }
    interstitialHidden() {
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").isInterstitialShowing = false;
        __classPrivateFieldGet(this, _PageDispatcher_resourceTreeModel, "f").dispatchEventToListeners(Events.InterstitialHidden);
    }
    windowOpen({}) {
    }
    compilationCacheProduced({}) {
    }
    fileChooserOpened({}) {
    }
    downloadWillBegin({}) {
    }
    downloadProgress() {
    }
}
_PageDispatcher_resourceTreeModel = new WeakMap();
SDKModel.register(ResourceTreeModel, { capabilities: 2 /* Capability.DOM */, autostart: true, early: true });
export var PrimaryPageChangeType;
(function (PrimaryPageChangeType) {
    PrimaryPageChangeType["NAVIGATION"] = "Navigation";
    PrimaryPageChangeType["ACTIVATION"] = "Activation";
})(PrimaryPageChangeType || (PrimaryPageChangeType = {}));
//# sourceMappingURL=ResourceTreeModel.js.map