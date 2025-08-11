// Copyright 2014 The Chromium Authors. All rights reserved.
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
var _ServiceWorkerCacheModel_storageAgent, _ServiceWorkerCacheModel_storageBucketModel, _ServiceWorkerCacheModel_cachesInternal, _ServiceWorkerCacheModel_storageKeysTracked, _ServiceWorkerCacheModel_storageBucketsUpdated, _ServiceWorkerCacheModel_throttler, _ServiceWorkerCacheModel_enabled, _ServiceWorkerCacheModel_scheduleAsSoonAsPossible, _Cache_model;
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import { SDKModel } from './SDKModel.js';
import { StorageBucketsModel } from './StorageBucketsModel.js';
const UIStrings = {
    /**
     *@description Text in Service Worker Cache Model
     *@example {https://cache} PH1
     *@example {error message} PH2
     */
    serviceworkercacheagentError: '`ServiceWorkerCacheAgent` error deleting cache entry {PH1} in cache: {PH2}',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/ServiceWorkerCacheModel.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ServiceWorkerCacheModel extends SDKModel {
    /**
     * Invariant: This #model can only be constructed on a ServiceWorker target.
     */
    constructor(target) {
        super(target);
        _ServiceWorkerCacheModel_storageAgent.set(this, void 0);
        _ServiceWorkerCacheModel_storageBucketModel.set(this, void 0);
        _ServiceWorkerCacheModel_cachesInternal.set(this, new Map());
        _ServiceWorkerCacheModel_storageKeysTracked.set(this, new Set());
        _ServiceWorkerCacheModel_storageBucketsUpdated.set(this, new Set());
        _ServiceWorkerCacheModel_throttler.set(this, new Common.Throttler.Throttler(2000));
        _ServiceWorkerCacheModel_enabled.set(this, false);
        // Used by tests to remove the Throttler timeout.
        _ServiceWorkerCacheModel_scheduleAsSoonAsPossible.set(this, false);
        target.registerStorageDispatcher(this);
        this.cacheAgent = target.cacheStorageAgent();
        __classPrivateFieldSet(this, _ServiceWorkerCacheModel_storageAgent, target.storageAgent(), "f");
        __classPrivateFieldSet(this, _ServiceWorkerCacheModel_storageBucketModel, target.model(StorageBucketsModel), "f");
    }
    enable() {
        if (__classPrivateFieldGet(this, _ServiceWorkerCacheModel_enabled, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketModel, "f").addEventListener("BucketAdded" /* StorageBucketsModelEvents.BUCKET_ADDED */, this.storageBucketAdded, this);
        __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketModel, "f").addEventListener("BucketRemoved" /* StorageBucketsModelEvents.BUCKET_REMOVED */, this.storageBucketRemoved, this);
        for (const storageBucket of __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketModel, "f").getBuckets()) {
            this.addStorageBucket(storageBucket.bucket);
        }
        __classPrivateFieldSet(this, _ServiceWorkerCacheModel_enabled, true, "f");
    }
    clearForStorageKey(storageKey) {
        for (const [opaqueId, cache] of __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").entries()) {
            if (cache.storageKey === storageKey) {
                __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").delete((opaqueId));
                this.cacheRemoved((cache));
            }
        }
        for (const storageBucket of __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketModel, "f").getBucketsForStorageKey(storageKey)) {
            void this.loadCacheNames(storageBucket.bucket);
        }
    }
    refreshCacheNames() {
        for (const cache of __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").values()) {
            this.cacheRemoved(cache);
        }
        __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").clear();
        const storageBuckets = __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketModel, "f").getBuckets();
        for (const storageBucket of storageBuckets) {
            void this.loadCacheNames(storageBucket.bucket);
        }
    }
    async deleteCache(cache) {
        const response = await this.cacheAgent.invoke_deleteCache({ cacheId: cache.cacheId });
        if (response.getError()) {
            console.error(`ServiceWorkerCacheAgent error deleting cache ${cache.toString()}: ${response.getError()}`);
            return;
        }
        __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").delete(cache.cacheId);
        this.cacheRemoved(cache);
    }
    async deleteCacheEntry(cache, request) {
        const response = await this.cacheAgent.invoke_deleteEntry({ cacheId: cache.cacheId, request });
        if (response.getError()) {
            Common.Console.Console.instance().error(i18nString(UIStrings.serviceworkercacheagentError, { PH1: cache.toString(), PH2: String(response.getError()) }));
            return;
        }
    }
    loadCacheData(cache, skipCount, pageSize, pathFilter, callback) {
        void this.requestEntries(cache, skipCount, pageSize, pathFilter, callback);
    }
    loadAllCacheData(cache, pathFilter, callback) {
        void this.requestAllEntries(cache, pathFilter, callback);
    }
    caches() {
        return [...__classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").values()];
    }
    dispose() {
        for (const cache of __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").values()) {
            this.cacheRemoved(cache);
        }
        __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").clear();
        if (__classPrivateFieldGet(this, _ServiceWorkerCacheModel_enabled, "f")) {
            __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketModel, "f").removeEventListener("BucketAdded" /* StorageBucketsModelEvents.BUCKET_ADDED */, this.storageBucketAdded, this);
            __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketModel, "f").removeEventListener("BucketRemoved" /* StorageBucketsModelEvents.BUCKET_REMOVED */, this.storageBucketRemoved, this);
        }
    }
    addStorageBucket(storageBucket) {
        void this.loadCacheNames(storageBucket);
        if (!__classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageKeysTracked, "f").has(storageBucket.storageKey)) {
            __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageKeysTracked, "f").add(storageBucket.storageKey);
            void __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageAgent, "f").invoke_trackCacheStorageForStorageKey({ storageKey: storageBucket.storageKey });
        }
    }
    removeStorageBucket(storageBucket) {
        let storageKeyCount = 0;
        for (const [opaqueId, cache] of __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").entries()) {
            if (storageBucket.storageKey === cache.storageKey) {
                storageKeyCount++;
            }
            if (cache.inBucket(storageBucket)) {
                storageKeyCount--;
                __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").delete((opaqueId));
                this.cacheRemoved((cache));
            }
        }
        if (storageKeyCount === 0) {
            __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageKeysTracked, "f").delete(storageBucket.storageKey);
            void __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageAgent, "f").invoke_untrackCacheStorageForStorageKey({ storageKey: storageBucket.storageKey });
        }
    }
    async loadCacheNames(storageBucket) {
        const response = await this.cacheAgent.invoke_requestCacheNames({ storageBucket });
        if (response.getError()) {
            return;
        }
        this.updateCacheNames(storageBucket, response.caches);
    }
    updateCacheNames(storageBucket, cachesJson) {
        function deleteAndSaveOldCaches(cache) {
            if (cache.inBucket(storageBucket) && !updatingCachesIds.has(cache.cacheId)) {
                oldCaches.set(cache.cacheId, cache);
                __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").delete(cache.cacheId);
            }
        }
        const updatingCachesIds = new Set();
        const newCaches = new Map();
        const oldCaches = new Map();
        for (const cacheJson of cachesJson) {
            const storageBucket = cacheJson.storageBucket ??
                __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketModel, "f").getDefaultBucketForStorageKey(cacheJson.storageKey)?.bucket;
            if (!storageBucket) {
                continue;
            }
            const cache = new Cache(this, storageBucket, cacheJson.cacheName, cacheJson.cacheId);
            updatingCachesIds.add(cache.cacheId);
            if (__classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").has(cache.cacheId)) {
                continue;
            }
            newCaches.set(cache.cacheId, cache);
            __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").set(cache.cacheId, cache);
        }
        __classPrivateFieldGet(this, _ServiceWorkerCacheModel_cachesInternal, "f").forEach(deleteAndSaveOldCaches, this);
        newCaches.forEach(this.cacheAdded, this);
        oldCaches.forEach(this.cacheRemoved, this);
    }
    storageBucketAdded({ data: { bucketInfo: { bucket } } }) {
        this.addStorageBucket(bucket);
    }
    storageBucketRemoved({ data: { bucketInfo: { bucket } } }) {
        this.removeStorageBucket(bucket);
    }
    cacheAdded(cache) {
        this.dispatchEventToListeners("CacheAdded" /* Events.CACHE_ADDED */, { model: this, cache });
    }
    cacheRemoved(cache) {
        this.dispatchEventToListeners("CacheRemoved" /* Events.CACHE_REMOVED */, { model: this, cache });
    }
    async requestEntries(cache, skipCount, pageSize, pathFilter, callback) {
        const response = await this.cacheAgent.invoke_requestEntries({ cacheId: cache.cacheId, skipCount, pageSize, pathFilter });
        if (response.getError()) {
            console.error('ServiceWorkerCacheAgent error while requesting entries: ', response.getError());
            return;
        }
        callback(response.cacheDataEntries, response.returnCount);
    }
    async requestAllEntries(cache, pathFilter, callback) {
        const response = await this.cacheAgent.invoke_requestEntries({ cacheId: cache.cacheId, pathFilter });
        if (response.getError()) {
            console.error('ServiceWorkerCacheAgent error while requesting entries: ', response.getError());
            return;
        }
        callback(response.cacheDataEntries, response.returnCount);
    }
    cacheStorageListUpdated({ bucketId }) {
        const storageBucket = __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketModel, "f").getBucketById(bucketId)?.bucket;
        if (storageBucket) {
            __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketsUpdated, "f").add(storageBucket);
            void __classPrivateFieldGet(this, _ServiceWorkerCacheModel_throttler, "f").schedule(() => {
                const promises = Array.from(__classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketsUpdated, "f"), storageBucket => this.loadCacheNames(storageBucket));
                __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketsUpdated, "f").clear();
                return Promise.all(promises);
            }, __classPrivateFieldGet(this, _ServiceWorkerCacheModel_scheduleAsSoonAsPossible, "f") ? "AsSoonAsPossible" /* Common.Throttler.Scheduling.AS_SOON_AS_POSSIBLE */ :
                "Default" /* Common.Throttler.Scheduling.DEFAULT */);
        }
    }
    cacheStorageContentUpdated({ bucketId, cacheName }) {
        const storageBucket = __classPrivateFieldGet(this, _ServiceWorkerCacheModel_storageBucketModel, "f").getBucketById(bucketId)?.bucket;
        if (storageBucket) {
            this.dispatchEventToListeners("CacheStorageContentUpdated" /* Events.CACHE_STORAGE_CONTENT_UPDATED */, { storageBucket, cacheName });
        }
    }
    attributionReportingTriggerRegistered(_event) {
    }
    indexedDBListUpdated(_event) {
    }
    indexedDBContentUpdated(_event) {
    }
    interestGroupAuctionEventOccurred(_event) {
    }
    interestGroupAccessed(_event) {
    }
    interestGroupAuctionNetworkRequestCreated(_event) {
    }
    sharedStorageAccessed(_event) {
    }
    sharedStorageWorkletOperationExecutionFinished(_event) {
    }
    storageBucketCreatedOrUpdated(_event) {
    }
    storageBucketDeleted(_event) {
    }
    setThrottlerSchedulesAsSoonAsPossibleForTest() {
        __classPrivateFieldSet(this, _ServiceWorkerCacheModel_scheduleAsSoonAsPossible, true, "f");
    }
    attributionReportingSourceRegistered(_event) {
    }
    attributionReportingReportSent(_event) {
    }
    attributionReportingVerboseDebugReportSent(_event) {
    }
}
_ServiceWorkerCacheModel_storageAgent = new WeakMap(), _ServiceWorkerCacheModel_storageBucketModel = new WeakMap(), _ServiceWorkerCacheModel_cachesInternal = new WeakMap(), _ServiceWorkerCacheModel_storageKeysTracked = new WeakMap(), _ServiceWorkerCacheModel_storageBucketsUpdated = new WeakMap(), _ServiceWorkerCacheModel_throttler = new WeakMap(), _ServiceWorkerCacheModel_enabled = new WeakMap(), _ServiceWorkerCacheModel_scheduleAsSoonAsPossible = new WeakMap();
export var Events;
(function (Events) {
    Events["CACHE_ADDED"] = "CacheAdded";
    Events["CACHE_REMOVED"] = "CacheRemoved";
    Events["CACHE_STORAGE_CONTENT_UPDATED"] = "CacheStorageContentUpdated";
})(Events || (Events = {}));
export class Cache {
    constructor(model, storageBucket, cacheName, cacheId) {
        _Cache_model.set(this, void 0);
        __classPrivateFieldSet(this, _Cache_model, model, "f");
        this.storageBucket = storageBucket;
        this.storageKey = storageBucket.storageKey;
        this.cacheName = cacheName;
        this.cacheId = cacheId;
    }
    inBucket(storageBucket) {
        return this.storageKey === storageBucket.storageKey && this.storageBucket.name === storageBucket.name;
    }
    equals(cache) {
        return this.cacheId === cache.cacheId;
    }
    toString() {
        return this.storageKey + this.cacheName;
    }
    async requestCachedResponse(url, requestHeaders) {
        const response = await __classPrivateFieldGet(this, _Cache_model, "f").cacheAgent.invoke_requestCachedResponse({ cacheId: this.cacheId, requestURL: url, requestHeaders });
        if (response.getError()) {
            return null;
        }
        return response.response;
    }
}
_Cache_model = new WeakMap();
SDKModel.register(ServiceWorkerCacheModel, { capabilities: 8192 /* Capability.STORAGE */, autostart: false });
//# sourceMappingURL=ServiceWorkerCacheModel.js.map