// Copyright 2016 The Chromium Authors. All rights reserved.
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
var _SecurityOriginManager_mainSecurityOriginInternal, _SecurityOriginManager_unreachableMainSecurityOriginInternal, _SecurityOriginManager_securityOriginsInternal;
import { SDKModel } from './SDKModel.js';
export class SecurityOriginManager extends SDKModel {
    constructor() {
        super(...arguments);
        // if a URL is unreachable, the browser will jump to an error page at
        // 'chrome-error://chromewebdata/', and |this.#mainSecurityOriginInternal| stores
        // its origin. In this situation, the original unreachable URL's security
        // origin will be stored in |this.#unreachableMainSecurityOriginInternal|.
        _SecurityOriginManager_mainSecurityOriginInternal.set(this, '');
        _SecurityOriginManager_unreachableMainSecurityOriginInternal.set(this, '');
        _SecurityOriginManager_securityOriginsInternal.set(this, new Set());
    }
    updateSecurityOrigins(securityOrigins) {
        const oldOrigins = __classPrivateFieldGet(this, _SecurityOriginManager_securityOriginsInternal, "f");
        __classPrivateFieldSet(this, _SecurityOriginManager_securityOriginsInternal, securityOrigins, "f");
        for (const origin of oldOrigins) {
            if (!__classPrivateFieldGet(this, _SecurityOriginManager_securityOriginsInternal, "f").has(origin)) {
                this.dispatchEventToListeners(Events.SecurityOriginRemoved, origin);
            }
        }
        for (const origin of __classPrivateFieldGet(this, _SecurityOriginManager_securityOriginsInternal, "f")) {
            if (!oldOrigins.has(origin)) {
                this.dispatchEventToListeners(Events.SecurityOriginAdded, origin);
            }
        }
    }
    securityOrigins() {
        return [...__classPrivateFieldGet(this, _SecurityOriginManager_securityOriginsInternal, "f")];
    }
    mainSecurityOrigin() {
        return __classPrivateFieldGet(this, _SecurityOriginManager_mainSecurityOriginInternal, "f");
    }
    unreachableMainSecurityOrigin() {
        return __classPrivateFieldGet(this, _SecurityOriginManager_unreachableMainSecurityOriginInternal, "f");
    }
    setMainSecurityOrigin(securityOrigin, unreachableSecurityOrigin) {
        __classPrivateFieldSet(this, _SecurityOriginManager_mainSecurityOriginInternal, securityOrigin, "f");
        __classPrivateFieldSet(this, _SecurityOriginManager_unreachableMainSecurityOriginInternal, unreachableSecurityOrigin || null, "f");
        this.dispatchEventToListeners(Events.MainSecurityOriginChanged, {
            mainSecurityOrigin: __classPrivateFieldGet(this, _SecurityOriginManager_mainSecurityOriginInternal, "f"),
            unreachableMainSecurityOrigin: __classPrivateFieldGet(this, _SecurityOriginManager_unreachableMainSecurityOriginInternal, "f"),
        });
    }
}
_SecurityOriginManager_mainSecurityOriginInternal = new WeakMap(), _SecurityOriginManager_unreachableMainSecurityOriginInternal = new WeakMap(), _SecurityOriginManager_securityOriginsInternal = new WeakMap();
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["SecurityOriginAdded"] = "SecurityOriginAdded";
    Events["SecurityOriginRemoved"] = "SecurityOriginRemoved";
    Events["MainSecurityOriginChanged"] = "MainSecurityOriginChanged";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
// TODO(jarhar): this is the one of the two usages of Capability.None. Do something about it!
SDKModel.register(SecurityOriginManager, { capabilities: 0 /* Capability.NONE */, autostart: false });
//# sourceMappingURL=SecurityOriginManager.js.map