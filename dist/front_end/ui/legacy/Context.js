// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Context_instances, _Context_flavors, _Context_eventDispatchers, _Context_dispatchFlavorChange;
import * as Common from '../../core/common/common.js';
let contextInstance;
export class Context {
    constructor() {
        _Context_instances.add(this);
        _Context_flavors.set(this, new Map());
        _Context_eventDispatchers.set(this, new Map());
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!contextInstance || forceNew) {
            contextInstance = new Context();
        }
        return contextInstance;
    }
    static removeInstance() {
        contextInstance = undefined;
    }
    setFlavor(flavorType, flavorValue) {
        const value = __classPrivateFieldGet(this, _Context_flavors, "f").get(flavorType) || null;
        if (value === flavorValue) {
            return;
        }
        if (flavorValue) {
            __classPrivateFieldGet(this, _Context_flavors, "f").set(flavorType, flavorValue);
        }
        else {
            __classPrivateFieldGet(this, _Context_flavors, "f").delete(flavorType);
        }
        __classPrivateFieldGet(this, _Context_instances, "m", _Context_dispatchFlavorChange).call(this, flavorType, flavorValue);
    }
    addFlavorChangeListener(flavorType, listener, thisObject) {
        let dispatcher = __classPrivateFieldGet(this, _Context_eventDispatchers, "f").get(flavorType);
        if (!dispatcher) {
            dispatcher = new Common.ObjectWrapper.ObjectWrapper();
            __classPrivateFieldGet(this, _Context_eventDispatchers, "f").set(flavorType, dispatcher);
        }
        dispatcher.addEventListener("FlavorChanged" /* Events.FLAVOR_CHANGED */, listener, thisObject);
    }
    removeFlavorChangeListener(flavorType, listener, thisObject) {
        const dispatcher = __classPrivateFieldGet(this, _Context_eventDispatchers, "f").get(flavorType);
        if (!dispatcher) {
            return;
        }
        dispatcher.removeEventListener("FlavorChanged" /* Events.FLAVOR_CHANGED */, listener, thisObject);
        if (!dispatcher.hasEventListeners("FlavorChanged" /* Events.FLAVOR_CHANGED */)) {
            __classPrivateFieldGet(this, _Context_eventDispatchers, "f").delete(flavorType);
        }
    }
    flavor(flavorType) {
        return __classPrivateFieldGet(this, _Context_flavors, "f").get(flavorType) || null;
    }
    flavors() {
        return new Set(__classPrivateFieldGet(this, _Context_flavors, "f").keys());
    }
}
_Context_flavors = new WeakMap(), _Context_eventDispatchers = new WeakMap(), _Context_instances = new WeakSet(), _Context_dispatchFlavorChange = function _Context_dispatchFlavorChange(flavorType, flavorValue) {
    for (const extension of getRegisteredListeners()) {
        if (extension.contextTypes().includes(flavorType)) {
            void extension.loadListener().then(instance => instance.flavorChanged(flavorValue));
        }
    }
    const dispatcher = __classPrivateFieldGet(this, _Context_eventDispatchers, "f").get(flavorType);
    if (!dispatcher) {
        return;
    }
    dispatcher.dispatchEventToListeners("FlavorChanged" /* Events.FLAVOR_CHANGED */, flavorValue);
};
var Events;
(function (Events) {
    Events["FLAVOR_CHANGED"] = "FlavorChanged";
})(Events || (Events = {}));
const registeredListeners = [];
export function registerListener(registration) {
    registeredListeners.push(registration);
}
function getRegisteredListeners() {
    return registeredListeners;
}
//# sourceMappingURL=Context.js.map