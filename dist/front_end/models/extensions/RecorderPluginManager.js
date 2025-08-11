// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RecorderPluginManager_plugins, _RecorderPluginManager_views;
import * as Common from '../../core/common/common.js';
let instance = null;
export class RecorderPluginManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super(...arguments);
        _RecorderPluginManager_plugins.set(this, new Set());
        _RecorderPluginManager_views.set(this, new Map());
    }
    static instance() {
        if (!instance) {
            instance = new RecorderPluginManager();
        }
        return instance;
    }
    addPlugin(plugin) {
        __classPrivateFieldGet(this, _RecorderPluginManager_plugins, "f").add(plugin);
        this.dispatchEventToListeners("pluginAdded" /* Events.PLUGIN_ADDED */, plugin);
    }
    removePlugin(plugin) {
        __classPrivateFieldGet(this, _RecorderPluginManager_plugins, "f").delete(plugin);
        this.dispatchEventToListeners("pluginRemoved" /* Events.PLUGIN_REMOVED */, plugin);
    }
    plugins() {
        return Array.from(__classPrivateFieldGet(this, _RecorderPluginManager_plugins, "f").values());
    }
    registerView(descriptor) {
        __classPrivateFieldGet(this, _RecorderPluginManager_views, "f").set(descriptor.id, descriptor);
        this.dispatchEventToListeners("viewRegistered" /* Events.VIEW_REGISTERED */, descriptor);
    }
    views() {
        return Array.from(__classPrivateFieldGet(this, _RecorderPluginManager_views, "f").values());
    }
    getViewDescriptor(id) {
        return __classPrivateFieldGet(this, _RecorderPluginManager_views, "f").get(id);
    }
    showView(id) {
        const descriptor = __classPrivateFieldGet(this, _RecorderPluginManager_views, "f").get(id);
        if (!descriptor) {
            throw new Error(`View with id ${id} is not found.`);
        }
        this.dispatchEventToListeners("showViewRequested" /* Events.SHOW_VIEW_REQUESTED */, descriptor);
    }
}
_RecorderPluginManager_plugins = new WeakMap(), _RecorderPluginManager_views = new WeakMap();
export var Events;
(function (Events) {
    Events["PLUGIN_ADDED"] = "pluginAdded";
    Events["PLUGIN_REMOVED"] = "pluginRemoved";
    Events["VIEW_REGISTERED"] = "viewRegistered";
    Events["SHOW_VIEW_REQUESTED"] = "showViewRequested";
})(Events || (Events = {}));
//# sourceMappingURL=RecorderPluginManager.js.map