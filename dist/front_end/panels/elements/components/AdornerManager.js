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
var _AdornerManager_instances, _AdornerManager_adornerSettings, _AdornerManager_settingStore, _AdornerManager_persistCurrentSettings, _AdornerManager_loadSettings, _AdornerManager_syncSettings;
export var AdornerCategories;
(function (AdornerCategories) {
    AdornerCategories["SECURITY"] = "Security";
    AdornerCategories["LAYOUT"] = "Layout";
    AdornerCategories["DEFAULT"] = "Default";
})(AdornerCategories || (AdornerCategories = {}));
export var RegisteredAdorners;
(function (RegisteredAdorners) {
    RegisteredAdorners["GRID"] = "grid";
    RegisteredAdorners["SUBGRID"] = "subgrid";
    RegisteredAdorners["FLEX"] = "flex";
    RegisteredAdorners["AD"] = "ad";
    RegisteredAdorners["SCROLL_SNAP"] = "scroll-snap";
    RegisteredAdorners["CONTAINER"] = "container";
    RegisteredAdorners["SLOT"] = "slot";
    RegisteredAdorners["TOP_LAYER"] = "top-layer";
    RegisteredAdorners["REVEAL"] = "reveal";
    RegisteredAdorners["MEDIA"] = "media";
    RegisteredAdorners["SCROLL"] = "scroll";
    RegisteredAdorners["POPOVER"] = "popover";
})(RegisteredAdorners || (RegisteredAdorners = {}));
// This enum-like const object serves as the authoritative registry for all the
// adorners available.
export function getRegisteredAdorner(which) {
    switch (which) {
        case RegisteredAdorners.GRID:
            return {
                name: 'grid',
                category: "Layout" /* AdornerCategories.LAYOUT */,
                enabledByDefault: true,
            };
        case RegisteredAdorners.SUBGRID:
            return {
                name: 'subgrid',
                category: "Layout" /* AdornerCategories.LAYOUT */,
                enabledByDefault: true,
            };
        case RegisteredAdorners.FLEX:
            return {
                name: 'flex',
                category: "Layout" /* AdornerCategories.LAYOUT */,
                enabledByDefault: true,
            };
        case RegisteredAdorners.AD:
            return {
                name: 'ad',
                category: "Security" /* AdornerCategories.SECURITY */,
                enabledByDefault: true,
            };
        case RegisteredAdorners.SCROLL_SNAP:
            return {
                name: 'scroll-snap',
                category: "Layout" /* AdornerCategories.LAYOUT */,
                enabledByDefault: true,
            };
        case RegisteredAdorners.CONTAINER:
            return {
                name: 'container',
                category: "Layout" /* AdornerCategories.LAYOUT */,
                enabledByDefault: true,
            };
        case RegisteredAdorners.SLOT:
            return {
                name: 'slot',
                category: "Layout" /* AdornerCategories.LAYOUT */,
                enabledByDefault: true,
            };
        case RegisteredAdorners.TOP_LAYER:
            return {
                name: 'top-layer',
                category: "Layout" /* AdornerCategories.LAYOUT */,
                enabledByDefault: true,
            };
        case RegisteredAdorners.REVEAL:
            return {
                name: 'reveal',
                category: "Default" /* AdornerCategories.DEFAULT */,
                enabledByDefault: true,
            };
        case RegisteredAdorners.MEDIA:
            return {
                name: 'media',
                category: "Default" /* AdornerCategories.DEFAULT */,
                enabledByDefault: false,
            };
        case RegisteredAdorners.SCROLL:
            return {
                name: 'scroll',
                category: "Layout" /* AdornerCategories.LAYOUT */,
                enabledByDefault: true,
            };
        case RegisteredAdorners.POPOVER: {
            return {
                name: 'popover',
                category: "Layout" /* AdornerCategories.LAYOUT */,
                enabledByDefault: true,
            };
        }
    }
}
let adornerNameToCategoryMap = undefined;
function getCategoryFromAdornerName(name) {
    if (!adornerNameToCategoryMap) {
        adornerNameToCategoryMap = new Map();
        for (const { name, category } of Object.values(RegisteredAdorners).map(getRegisteredAdorner)) {
            adornerNameToCategoryMap.set(name, category);
        }
    }
    return adornerNameToCategoryMap.get(name) || "Default" /* AdornerCategories.DEFAULT */;
}
export const DefaultAdornerSettings = Object.values(RegisteredAdorners).map(getRegisteredAdorner).map(({ name, enabledByDefault }) => ({
    adorner: name,
    isEnabled: enabledByDefault,
}));
export class AdornerManager {
    constructor(settingStore) {
        _AdornerManager_instances.add(this);
        _AdornerManager_adornerSettings.set(this, new Map());
        _AdornerManager_settingStore.set(this, void 0);
        __classPrivateFieldSet(this, _AdornerManager_settingStore, settingStore, "f");
        __classPrivateFieldGet(this, _AdornerManager_instances, "m", _AdornerManager_syncSettings).call(this);
    }
    updateSettings(settings) {
        __classPrivateFieldSet(this, _AdornerManager_adornerSettings, settings, "f");
        __classPrivateFieldGet(this, _AdornerManager_instances, "m", _AdornerManager_persistCurrentSettings).call(this);
    }
    getSettings() {
        return __classPrivateFieldGet(this, _AdornerManager_adornerSettings, "f");
    }
    isAdornerEnabled(adornerText) {
        return __classPrivateFieldGet(this, _AdornerManager_adornerSettings, "f").get(adornerText) || false;
    }
}
_AdornerManager_adornerSettings = new WeakMap(), _AdornerManager_settingStore = new WeakMap(), _AdornerManager_instances = new WeakSet(), _AdornerManager_persistCurrentSettings = function _AdornerManager_persistCurrentSettings() {
    const settingList = [];
    for (const [adorner, isEnabled] of __classPrivateFieldGet(this, _AdornerManager_adornerSettings, "f")) {
        settingList.push({ adorner, isEnabled });
    }
    __classPrivateFieldGet(this, _AdornerManager_settingStore, "f").set(settingList);
}, _AdornerManager_loadSettings = function _AdornerManager_loadSettings() {
    const settingList = __classPrivateFieldGet(this, _AdornerManager_settingStore, "f").get();
    for (const setting of settingList) {
        __classPrivateFieldGet(this, _AdornerManager_adornerSettings, "f").set(setting.adorner, setting.isEnabled);
    }
}, _AdornerManager_syncSettings = function _AdornerManager_syncSettings() {
    __classPrivateFieldGet(this, _AdornerManager_instances, "m", _AdornerManager_loadSettings).call(this);
    // Prune outdated adorners and add new ones to the persistence.
    const outdatedAdorners = new Set(__classPrivateFieldGet(this, _AdornerManager_adornerSettings, "f").keys());
    for (const { adorner, isEnabled } of DefaultAdornerSettings) {
        outdatedAdorners.delete(adorner);
        if (!__classPrivateFieldGet(this, _AdornerManager_adornerSettings, "f").has(adorner)) {
            __classPrivateFieldGet(this, _AdornerManager_adornerSettings, "f").set(adorner, isEnabled);
        }
    }
    for (const outdatedAdorner of outdatedAdorners) {
        __classPrivateFieldGet(this, _AdornerManager_adornerSettings, "f").delete(outdatedAdorner);
    }
    __classPrivateFieldGet(this, _AdornerManager_instances, "m", _AdornerManager_persistCurrentSettings).call(this);
};
const OrderedAdornerCategories = [
    "Security" /* AdornerCategories.SECURITY */,
    "Layout" /* AdornerCategories.LAYOUT */,
    "Default" /* AdornerCategories.DEFAULT */,
];
// Use idx + 1 for the order to avoid JavaScript's 0 == false issue
export const AdornerCategoryOrder = new Map(OrderedAdornerCategories.map((category, idx) => [category, idx + 1]));
export function compareAdornerNamesByCategory(nameA, nameB) {
    const orderA = AdornerCategoryOrder.get(getCategoryFromAdornerName(nameA)) || Number.POSITIVE_INFINITY;
    const orderB = AdornerCategoryOrder.get(getCategoryFromAdornerName(nameB)) || Number.POSITIVE_INFINITY;
    return orderA - orderB;
}
//# sourceMappingURL=AdornerManager.js.map