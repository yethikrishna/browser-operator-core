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
var _OriginTreeElement_securityStateInternal, _OriginTreeElement_renderTreeElement, _OriginTreeElement_originInternal;
import { SecurityPanelSidebarTreeElement } from './SecurityPanelSidebarTreeElement.js';
export class ShowOriginEvent extends Event {
    constructor(origin) {
        super(ShowOriginEvent.eventName, { bubbles: true, composed: true });
        this.origin = origin;
    }
}
ShowOriginEvent.eventName = 'showorigin';
export class OriginTreeElement extends SecurityPanelSidebarTreeElement {
    constructor(className, renderTreeElement, origin = null) {
        super();
        _OriginTreeElement_securityStateInternal.set(this, void 0);
        _OriginTreeElement_renderTreeElement.set(this, void 0);
        _OriginTreeElement_originInternal.set(this, null);
        __classPrivateFieldSet(this, _OriginTreeElement_renderTreeElement, renderTreeElement, "f");
        __classPrivateFieldSet(this, _OriginTreeElement_originInternal, origin, "f");
        this.listItemElement.classList.add(className);
        __classPrivateFieldSet(this, _OriginTreeElement_securityStateInternal, null, "f");
        this.setSecurityState("unknown" /* Protocol.Security.SecurityState.Unknown */);
    }
    setSecurityState(newSecurityState) {
        __classPrivateFieldSet(this, _OriginTreeElement_securityStateInternal, newSecurityState, "f");
        __classPrivateFieldGet(this, _OriginTreeElement_renderTreeElement, "f").call(this, this);
    }
    securityState() {
        return __classPrivateFieldGet(this, _OriginTreeElement_securityStateInternal, "f");
    }
    origin() {
        return __classPrivateFieldGet(this, _OriginTreeElement_originInternal, "f");
    }
    showElement() {
        this.listItemElement.dispatchEvent(new ShowOriginEvent(__classPrivateFieldGet(this, _OriginTreeElement_originInternal, "f")));
    }
}
_OriginTreeElement_securityStateInternal = new WeakMap(), _OriginTreeElement_renderTreeElement = new WeakMap(), _OriginTreeElement_originInternal = new WeakMap();
//# sourceMappingURL=OriginTreeElement.js.map