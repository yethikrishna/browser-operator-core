// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _ExtensionManager_views, _ExtensionManager_handlePlugin, _ExtensionManager_handleView, _ExtensionIframe_descriptor, _ExtensionIframe_iframe, _ExtensionIframe_isShowing, _ExtensionIframe_isLoaded, _ExtensionIframe_onIframeLoad;
import * as Common from '../../../core/common/common.js';
import * as Extensions from '../../../models/extensions/extensions.js';
let instance = null;
export class ExtensionManager extends Common.ObjectWrapper.ObjectWrapper {
    static instance() {
        if (!instance) {
            instance = new ExtensionManager();
        }
        return instance;
    }
    constructor() {
        super();
        _ExtensionManager_views.set(this, new Map());
        _ExtensionManager_handlePlugin.set(this, () => {
            this.dispatchEventToListeners("extensionsUpdated" /* Events.EXTENSIONS_UPDATED */, this.extensions());
        });
        _ExtensionManager_handleView.set(this, (event) => {
            const descriptor = event.data;
            if (!__classPrivateFieldGet(this, _ExtensionManager_views, "f").has(descriptor.id)) {
                __classPrivateFieldGet(this, _ExtensionManager_views, "f").set(descriptor.id, new ExtensionIframe(descriptor));
            }
        });
        this.attach();
    }
    attach() {
        const pluginManager = Extensions.RecorderPluginManager.RecorderPluginManager.instance();
        pluginManager.addEventListener("pluginAdded" /* Extensions.RecorderPluginManager.Events.PLUGIN_ADDED */, __classPrivateFieldGet(this, _ExtensionManager_handlePlugin, "f"));
        pluginManager.addEventListener("pluginRemoved" /* Extensions.RecorderPluginManager.Events.PLUGIN_REMOVED */, __classPrivateFieldGet(this, _ExtensionManager_handlePlugin, "f"));
        pluginManager.addEventListener("viewRegistered" /* Extensions.RecorderPluginManager.Events.VIEW_REGISTERED */, __classPrivateFieldGet(this, _ExtensionManager_handleView, "f"));
        for (const descriptor of pluginManager.views()) {
            __classPrivateFieldGet(this, _ExtensionManager_handleView, "f").call(this, { data: descriptor });
        }
    }
    detach() {
        const pluginManager = Extensions.RecorderPluginManager.RecorderPluginManager.instance();
        pluginManager.removeEventListener("pluginAdded" /* Extensions.RecorderPluginManager.Events.PLUGIN_ADDED */, __classPrivateFieldGet(this, _ExtensionManager_handlePlugin, "f"));
        pluginManager.removeEventListener("pluginRemoved" /* Extensions.RecorderPluginManager.Events.PLUGIN_REMOVED */, __classPrivateFieldGet(this, _ExtensionManager_handlePlugin, "f"));
        pluginManager.removeEventListener("viewRegistered" /* Extensions.RecorderPluginManager.Events.VIEW_REGISTERED */, __classPrivateFieldGet(this, _ExtensionManager_handleView, "f"));
        __classPrivateFieldGet(this, _ExtensionManager_views, "f").clear();
    }
    extensions() {
        return Extensions.RecorderPluginManager.RecorderPluginManager.instance().plugins();
    }
    getView(descriptorId) {
        const view = __classPrivateFieldGet(this, _ExtensionManager_views, "f").get(descriptorId);
        if (!view) {
            throw new Error('View not found');
        }
        return view;
    }
}
_ExtensionManager_views = new WeakMap(), _ExtensionManager_handlePlugin = new WeakMap(), _ExtensionManager_handleView = new WeakMap();
class ExtensionIframe {
    constructor(descriptor) {
        _ExtensionIframe_descriptor.set(this, void 0);
        _ExtensionIframe_iframe.set(this, void 0);
        _ExtensionIframe_isShowing.set(this, false);
        _ExtensionIframe_isLoaded.set(this, false);
        _ExtensionIframe_onIframeLoad.set(this, () => {
            __classPrivateFieldSet(this, _ExtensionIframe_isLoaded, true, "f");
            if (__classPrivateFieldGet(this, _ExtensionIframe_isShowing, "f")) {
                __classPrivateFieldGet(this, _ExtensionIframe_descriptor, "f").onShown();
            }
        });
        __classPrivateFieldSet(this, _ExtensionIframe_descriptor, descriptor, "f");
        __classPrivateFieldSet(this, _ExtensionIframe_iframe, document.createElement('iframe'), "f");
        __classPrivateFieldGet(this, _ExtensionIframe_iframe, "f").src = descriptor.pagePath;
        __classPrivateFieldGet(this, _ExtensionIframe_iframe, "f").onload = __classPrivateFieldGet(this, _ExtensionIframe_onIframeLoad, "f");
    }
    show() {
        if (__classPrivateFieldGet(this, _ExtensionIframe_isShowing, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _ExtensionIframe_isShowing, true, "f");
        if (__classPrivateFieldGet(this, _ExtensionIframe_isLoaded, "f")) {
            __classPrivateFieldGet(this, _ExtensionIframe_descriptor, "f").onShown();
        }
    }
    hide() {
        if (!__classPrivateFieldGet(this, _ExtensionIframe_isShowing, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _ExtensionIframe_isShowing, false, "f");
        __classPrivateFieldSet(this, _ExtensionIframe_isLoaded, false, "f");
        __classPrivateFieldGet(this, _ExtensionIframe_descriptor, "f").onHidden();
    }
    frame() {
        return __classPrivateFieldGet(this, _ExtensionIframe_iframe, "f");
    }
}
_ExtensionIframe_descriptor = new WeakMap(), _ExtensionIframe_iframe = new WeakMap(), _ExtensionIframe_isShowing = new WeakMap(), _ExtensionIframe_isLoaded = new WeakMap(), _ExtensionIframe_onIframeLoad = new WeakMap();
export var Events;
(function (Events) {
    Events["EXTENSIONS_UPDATED"] = "extensionsUpdated";
})(Events || (Events = {}));
//# sourceMappingURL=ExtensionManager.js.map