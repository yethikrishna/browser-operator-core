// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _ExtensionStorage_model, _ExtensionStorage_extensionIdInternal, _ExtensionStorage_nameInternal, _ExtensionStorage_storageAreaInternal, _ExtensionStorageModel_instances, _ExtensionStorageModel_runtimeModelInternal, _ExtensionStorageModel_storagesInternal, _ExtensionStorageModel_enabled, _ExtensionStorageModel_getStoragesForExtension, _ExtensionStorageModel_addExtension, _ExtensionStorageModel_removeExtension, _ExtensionStorageModel_executionContextCreated, _ExtensionStorageModel_onExecutionContextCreated, _ExtensionStorageModel_extensionIdForContext, _ExtensionStorageModel_executionContextDestroyed, _ExtensionStorageModel_onExecutionContextDestroyed;
import * as Common from '../../core/common/common.js';
import * as SDK from '../../core/sdk/sdk.js';
export class ExtensionStorage extends Common.ObjectWrapper.ObjectWrapper {
    constructor(model, extensionId, name, storageArea) {
        super();
        _ExtensionStorage_model.set(this, void 0);
        _ExtensionStorage_extensionIdInternal.set(this, void 0);
        _ExtensionStorage_nameInternal.set(this, void 0);
        _ExtensionStorage_storageAreaInternal.set(this, void 0);
        __classPrivateFieldSet(this, _ExtensionStorage_model, model, "f");
        __classPrivateFieldSet(this, _ExtensionStorage_extensionIdInternal, extensionId, "f");
        __classPrivateFieldSet(this, _ExtensionStorage_nameInternal, name, "f");
        __classPrivateFieldSet(this, _ExtensionStorage_storageAreaInternal, storageArea, "f");
    }
    get model() {
        return __classPrivateFieldGet(this, _ExtensionStorage_model, "f");
    }
    get extensionId() {
        return __classPrivateFieldGet(this, _ExtensionStorage_extensionIdInternal, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _ExtensionStorage_nameInternal, "f");
    }
    // Returns a key that uniquely identifies this extension ID and storage area,
    // but which is not unique across targets, so we can identify two identical
    // storage areas across frames.
    get key() {
        return `${this.extensionId}-${this.storageArea}`;
    }
    get storageArea() {
        return __classPrivateFieldGet(this, _ExtensionStorage_storageAreaInternal, "f");
    }
    async getItems(keys) {
        const params = {
            id: __classPrivateFieldGet(this, _ExtensionStorage_extensionIdInternal, "f"),
            storageArea: __classPrivateFieldGet(this, _ExtensionStorage_storageAreaInternal, "f"),
        };
        if (keys) {
            params.keys = keys;
        }
        const response = await __classPrivateFieldGet(this, _ExtensionStorage_model, "f").agent.invoke_getStorageItems(params);
        if (response.getError()) {
            throw new Error(response.getError());
        }
        return response.data;
    }
    async setItem(key, value) {
        const response = await __classPrivateFieldGet(this, _ExtensionStorage_model, "f").agent.invoke_setStorageItems({ id: __classPrivateFieldGet(this, _ExtensionStorage_extensionIdInternal, "f"), storageArea: __classPrivateFieldGet(this, _ExtensionStorage_storageAreaInternal, "f"), values: { [key]: value } });
        if (response.getError()) {
            throw new Error(response.getError());
        }
    }
    async removeItem(key) {
        const response = await __classPrivateFieldGet(this, _ExtensionStorage_model, "f").agent.invoke_removeStorageItems({ id: __classPrivateFieldGet(this, _ExtensionStorage_extensionIdInternal, "f"), storageArea: __classPrivateFieldGet(this, _ExtensionStorage_storageAreaInternal, "f"), keys: [key] });
        if (response.getError()) {
            throw new Error(response.getError());
        }
    }
    async clear() {
        const response = await __classPrivateFieldGet(this, _ExtensionStorage_model, "f").agent.invoke_clearStorageItems({ id: __classPrivateFieldGet(this, _ExtensionStorage_extensionIdInternal, "f"), storageArea: __classPrivateFieldGet(this, _ExtensionStorage_storageAreaInternal, "f") });
        if (response.getError()) {
            throw new Error(response.getError());
        }
    }
    matchesTarget(target) {
        if (!target) {
            return false;
        }
        const targetURL = target.targetInfo()?.url;
        const parsedURL = targetURL ? Common.ParsedURL.ParsedURL.fromString(targetURL) : null;
        return parsedURL?.scheme === 'chrome-extension' && parsedURL?.host === this.extensionId;
    }
}
_ExtensionStorage_model = new WeakMap(), _ExtensionStorage_extensionIdInternal = new WeakMap(), _ExtensionStorage_nameInternal = new WeakMap(), _ExtensionStorage_storageAreaInternal = new WeakMap();
export class ExtensionStorageModel extends SDK.SDKModel.SDKModel {
    constructor(target) {
        super(target);
        _ExtensionStorageModel_instances.add(this);
        _ExtensionStorageModel_runtimeModelInternal.set(this, void 0);
        _ExtensionStorageModel_storagesInternal.set(this, void 0);
        _ExtensionStorageModel_enabled.set(this, void 0);
        __classPrivateFieldSet(this, _ExtensionStorageModel_runtimeModelInternal, target.model(SDK.RuntimeModel.RuntimeModel), "f");
        __classPrivateFieldSet(this, _ExtensionStorageModel_storagesInternal, new Map(), "f");
        this.agent = target.extensionsAgent();
    }
    enable() {
        if (__classPrivateFieldGet(this, _ExtensionStorageModel_enabled, "f")) {
            return;
        }
        if (__classPrivateFieldGet(this, _ExtensionStorageModel_runtimeModelInternal, "f")) {
            __classPrivateFieldGet(this, _ExtensionStorageModel_runtimeModelInternal, "f").addEventListener(SDK.RuntimeModel.Events.ExecutionContextCreated, __classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_onExecutionContextCreated), this);
            __classPrivateFieldGet(this, _ExtensionStorageModel_runtimeModelInternal, "f").addEventListener(SDK.RuntimeModel.Events.ExecutionContextDestroyed, __classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_onExecutionContextDestroyed), this);
            __classPrivateFieldGet(this, _ExtensionStorageModel_runtimeModelInternal, "f").executionContexts().forEach(__classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_executionContextCreated), this);
        }
        __classPrivateFieldSet(this, _ExtensionStorageModel_enabled, true, "f");
    }
    storageForIdAndArea(id, storageArea) {
        return __classPrivateFieldGet(this, _ExtensionStorageModel_storagesInternal, "f").get(id)?.get(storageArea);
    }
    storages() {
        const result = [];
        for (const storages of __classPrivateFieldGet(this, _ExtensionStorageModel_storagesInternal, "f").values()) {
            result.push(...storages.values());
        }
        return result;
    }
}
_ExtensionStorageModel_runtimeModelInternal = new WeakMap(), _ExtensionStorageModel_storagesInternal = new WeakMap(), _ExtensionStorageModel_enabled = new WeakMap(), _ExtensionStorageModel_instances = new WeakSet(), _ExtensionStorageModel_getStoragesForExtension = function _ExtensionStorageModel_getStoragesForExtension(id) {
    const existingStorages = __classPrivateFieldGet(this, _ExtensionStorageModel_storagesInternal, "f").get(id);
    if (existingStorages) {
        return existingStorages;
    }
    const newStorages = new Map();
    __classPrivateFieldGet(this, _ExtensionStorageModel_storagesInternal, "f").set(id, newStorages);
    return newStorages;
}, _ExtensionStorageModel_addExtension = function _ExtensionStorageModel_addExtension(id, name) {
    for (const storageArea of ["session" /* Protocol.Extensions.StorageArea.Session */, "local" /* Protocol.Extensions.StorageArea.Local */,
        "sync" /* Protocol.Extensions.StorageArea.Sync */, "managed" /* Protocol.Extensions.StorageArea.Managed */]) {
        const storages = __classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_getStoragesForExtension).call(this, id);
        const storage = new ExtensionStorage(this, id, name, storageArea);
        console.assert(!storages.get(storageArea));
        storage.getItems([])
            .then(() => {
            // The extension may have been removed in the meantime.
            if (__classPrivateFieldGet(this, _ExtensionStorageModel_storagesInternal, "f").get(id) !== storages) {
                return;
            }
            // The storage area may have been added in the meantime.
            if (storages.get(storageArea)) {
                return;
            }
            storages.set(storageArea, storage);
            this.dispatchEventToListeners("ExtensionStorageAdded" /* Events.EXTENSION_STORAGE_ADDED */, storage);
        })
            .catch(() => {
            // Storage area is inaccessible (extension may have restricted access
            // or not enabled the API).
        });
    }
}, _ExtensionStorageModel_removeExtension = function _ExtensionStorageModel_removeExtension(id) {
    const storages = __classPrivateFieldGet(this, _ExtensionStorageModel_storagesInternal, "f").get(id);
    if (!storages) {
        return;
    }
    for (const [key, storage] of storages) {
        // Delete this before firing the event, since this matches the behavior
        // of other models and meets expectations for a removed event.
        storages.delete(key);
        this.dispatchEventToListeners("ExtensionStorageRemoved" /* Events.EXTENSION_STORAGE_REMOVED */, storage);
    }
    __classPrivateFieldGet(this, _ExtensionStorageModel_storagesInternal, "f").delete(id);
}, _ExtensionStorageModel_executionContextCreated = function _ExtensionStorageModel_executionContextCreated(context) {
    const extensionId = __classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_extensionIdForContext).call(this, context);
    if (extensionId) {
        __classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_addExtension).call(this, extensionId, context.name);
    }
}, _ExtensionStorageModel_onExecutionContextCreated = function _ExtensionStorageModel_onExecutionContextCreated(event) {
    __classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_executionContextCreated).call(this, event.data);
}, _ExtensionStorageModel_extensionIdForContext = function _ExtensionStorageModel_extensionIdForContext(context) {
    const url = Common.ParsedURL.ParsedURL.fromString(context.origin);
    return url && url.scheme === 'chrome-extension' ? url.host : undefined;
}, _ExtensionStorageModel_executionContextDestroyed = function _ExtensionStorageModel_executionContextDestroyed(context) {
    const extensionId = __classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_extensionIdForContext).call(this, context);
    if (extensionId) {
        // Ignore event if there is still another context for this extension.
        if (__classPrivateFieldGet(this, _ExtensionStorageModel_runtimeModelInternal, "f")?.executionContexts().some(c => __classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_extensionIdForContext).call(this, c) === extensionId)) {
            return;
        }
        __classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_removeExtension).call(this, extensionId);
    }
}, _ExtensionStorageModel_onExecutionContextDestroyed = function _ExtensionStorageModel_onExecutionContextDestroyed(event) {
    __classPrivateFieldGet(this, _ExtensionStorageModel_instances, "m", _ExtensionStorageModel_executionContextDestroyed).call(this, event.data);
};
SDK.SDKModel.SDKModel.register(ExtensionStorageModel, { capabilities: 4 /* SDK.Target.Capability.JS */, autostart: false });
export var Events;
(function (Events) {
    Events["EXTENSION_STORAGE_ADDED"] = "ExtensionStorageAdded";
    Events["EXTENSION_STORAGE_REMOVED"] = "ExtensionStorageRemoved";
})(Events || (Events = {}));
//# sourceMappingURL=ExtensionStorageModel.js.map