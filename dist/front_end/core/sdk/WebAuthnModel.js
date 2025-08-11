// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _WebAuthnModel_agent, _WebAuthnDispatcher_model;
import { SDKModel } from './SDKModel.js';
export var Events;
(function (Events) {
    Events["CREDENTIAL_ADDED"] = "CredentialAdded";
    Events["CREDENTIAL_ASSERTED"] = "CredentialAsserted";
    Events["CREDENTIAL_DELETED"] = "CredentialDeleted";
    Events["CREDENTIAL_UPDATED"] = "CredentialUpdated";
})(Events || (Events = {}));
export class WebAuthnModel extends SDKModel {
    constructor(target) {
        super(target);
        _WebAuthnModel_agent.set(this, void 0);
        __classPrivateFieldSet(this, _WebAuthnModel_agent, target.webAuthnAgent(), "f");
        target.registerWebAuthnDispatcher(new WebAuthnDispatcher(this));
    }
    setVirtualAuthEnvEnabled(enable) {
        if (enable) {
            return __classPrivateFieldGet(this, _WebAuthnModel_agent, "f").invoke_enable({ enableUI: true });
        }
        return __classPrivateFieldGet(this, _WebAuthnModel_agent, "f").invoke_disable();
    }
    async addAuthenticator(options) {
        const response = await __classPrivateFieldGet(this, _WebAuthnModel_agent, "f").invoke_addVirtualAuthenticator({ options });
        return response.authenticatorId;
    }
    async removeAuthenticator(authenticatorId) {
        await __classPrivateFieldGet(this, _WebAuthnModel_agent, "f").invoke_removeVirtualAuthenticator({ authenticatorId });
    }
    async setAutomaticPresenceSimulation(authenticatorId, enabled) {
        await __classPrivateFieldGet(this, _WebAuthnModel_agent, "f").invoke_setAutomaticPresenceSimulation({ authenticatorId, enabled });
    }
    async getCredentials(authenticatorId) {
        const response = await __classPrivateFieldGet(this, _WebAuthnModel_agent, "f").invoke_getCredentials({ authenticatorId });
        return response.credentials;
    }
    async removeCredential(authenticatorId, credentialId) {
        await __classPrivateFieldGet(this, _WebAuthnModel_agent, "f").invoke_removeCredential({ authenticatorId, credentialId });
    }
    credentialAdded(params) {
        this.dispatchEventToListeners("CredentialAdded" /* Events.CREDENTIAL_ADDED */, params);
    }
    credentialAsserted(params) {
        this.dispatchEventToListeners("CredentialAsserted" /* Events.CREDENTIAL_ASSERTED */, params);
    }
    credentialDeleted(params) {
        this.dispatchEventToListeners("CredentialDeleted" /* Events.CREDENTIAL_DELETED */, params);
    }
    credentialUpdated(params) {
        this.dispatchEventToListeners("CredentialUpdated" /* Events.CREDENTIAL_UPDATED */, params);
    }
}
_WebAuthnModel_agent = new WeakMap();
class WebAuthnDispatcher {
    constructor(model) {
        _WebAuthnDispatcher_model.set(this, void 0);
        __classPrivateFieldSet(this, _WebAuthnDispatcher_model, model, "f");
    }
    credentialAdded(params) {
        __classPrivateFieldGet(this, _WebAuthnDispatcher_model, "f").credentialAdded(params);
    }
    credentialAsserted(params) {
        __classPrivateFieldGet(this, _WebAuthnDispatcher_model, "f").credentialAsserted(params);
    }
    credentialDeleted(params) {
        __classPrivateFieldGet(this, _WebAuthnDispatcher_model, "f").credentialDeleted(params);
    }
    credentialUpdated(params) {
        __classPrivateFieldGet(this, _WebAuthnDispatcher_model, "f").credentialUpdated(params);
    }
}
_WebAuthnDispatcher_model = new WeakMap();
SDKModel.register(WebAuthnModel, { capabilities: 65536 /* Capability.WEB_AUTHN */, autostart: false });
//# sourceMappingURL=WebAuthnModel.js.map