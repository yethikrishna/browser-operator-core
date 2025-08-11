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
var _StorageKeyManager_mainStorageKeyInternal, _StorageKeyManager_storageKeysInternal;
import * as Common from '../common/common.js';
import { SDKModel } from './SDKModel.js';
export class StorageKeyManager extends SDKModel {
    constructor(target) {
        super(target);
        _StorageKeyManager_mainStorageKeyInternal.set(this, void 0);
        _StorageKeyManager_storageKeysInternal.set(this, void 0);
        __classPrivateFieldSet(this, _StorageKeyManager_mainStorageKeyInternal, '', "f");
        __classPrivateFieldSet(this, _StorageKeyManager_storageKeysInternal, new Set(), "f");
    }
    updateStorageKeys(storageKeys) {
        const oldStorageKeys = __classPrivateFieldGet(this, _StorageKeyManager_storageKeysInternal, "f");
        __classPrivateFieldSet(this, _StorageKeyManager_storageKeysInternal, storageKeys, "f");
        for (const storageKey of oldStorageKeys) {
            if (!__classPrivateFieldGet(this, _StorageKeyManager_storageKeysInternal, "f").has(storageKey)) {
                this.dispatchEventToListeners("StorageKeyRemoved" /* Events.STORAGE_KEY_REMOVED */, storageKey);
            }
        }
        for (const storageKey of __classPrivateFieldGet(this, _StorageKeyManager_storageKeysInternal, "f")) {
            if (!oldStorageKeys.has(storageKey)) {
                this.dispatchEventToListeners("StorageKeyAdded" /* Events.STORAGE_KEY_ADDED */, storageKey);
            }
        }
    }
    storageKeys() {
        return [...__classPrivateFieldGet(this, _StorageKeyManager_storageKeysInternal, "f")];
    }
    mainStorageKey() {
        return __classPrivateFieldGet(this, _StorageKeyManager_mainStorageKeyInternal, "f");
    }
    setMainStorageKey(storageKey) {
        __classPrivateFieldSet(this, _StorageKeyManager_mainStorageKeyInternal, storageKey, "f");
        this.dispatchEventToListeners("MainStorageKeyChanged" /* Events.MAIN_STORAGE_KEY_CHANGED */, {
            mainStorageKey: __classPrivateFieldGet(this, _StorageKeyManager_mainStorageKeyInternal, "f"),
        });
    }
}
_StorageKeyManager_mainStorageKeyInternal = new WeakMap(), _StorageKeyManager_storageKeysInternal = new WeakMap();
export function parseStorageKey(storageKeyString) {
    // Based on the canonical implementation of StorageKey::Deserialize in
    // third_party/blink/common/storage_key/storage_key.cc
    const components = storageKeyString.split('^');
    const origin = Common.ParsedURL.ParsedURL.extractOrigin(components[0]);
    const storageKey = { origin, components: new Map() };
    for (let i = 1; i < components.length; ++i) {
        storageKey.components.set(components[i].charAt(0), components[i].substring(1));
    }
    return storageKey;
}
export var StorageKeyComponent;
(function (StorageKeyComponent) {
    StorageKeyComponent["TOP_LEVEL_SITE"] = "0";
    StorageKeyComponent["NONCE_HIGH"] = "1";
    StorageKeyComponent["NONCE_LOW"] = "2";
    StorageKeyComponent["ANCESTOR_CHAIN_BIT"] = "3";
    StorageKeyComponent["TOP_LEVEL_SITE_OPAQUE_NONCE_HIGH"] = "4";
    StorageKeyComponent["TOP_LEVEL_SITE_OPAQUE_NONCE_LOW"] = "5";
    StorageKeyComponent["TOP_LEVEL_SITE_OPAQUE_NONCE_PRECURSOR"] = "6";
})(StorageKeyComponent || (StorageKeyComponent = {}));
export var Events;
(function (Events) {
    Events["STORAGE_KEY_ADDED"] = "StorageKeyAdded";
    Events["STORAGE_KEY_REMOVED"] = "StorageKeyRemoved";
    Events["MAIN_STORAGE_KEY_CHANGED"] = "MainStorageKeyChanged";
})(Events || (Events = {}));
// TODO(jarhar): this is the one of the two usages of Capability.None. Do something about it!
SDKModel.register(StorageKeyManager, { capabilities: 0 /* Capability.NONE */, autostart: false });
//# sourceMappingURL=StorageKeyManager.js.map