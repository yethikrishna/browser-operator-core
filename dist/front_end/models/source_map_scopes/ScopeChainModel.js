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
var _ScopeChainModel_instances, _ScopeChainModel_callFrame, _ScopeChainModel_throttler, _ScopeChainModel_boundUpdate, _ScopeChainModel_update, _ScopeChainModel_debugInfoAttached, _ScopeChainModel_sourceMapAttached;
import * as Common from '../../core/common/common.js';
import * as SDK from '../../core/sdk/sdk.js';
import { resolveScopeChain } from './NamesResolver.js';
/**
 * This class is responsible for resolving / updating the scope chain for a specific {@link SDK.DebuggerModel.CallFrame}
 * instance.
 *
 * There are several sources that can influence the scope view:
 *   - Debugger plugins can provide the whole scope info (e.g. from DWARF)
 *   - Source Maps can provide OR augment scope info
 *
 * Source maps can be enabled/disabled dynamically and debugger plugins can attach debug info after the fact.
 *
 * This class tracks all that and sends events with the latest scope chain for a specific call frame.
 */
export class ScopeChainModel extends Common.ObjectWrapper.ObjectWrapper {
    constructor(callFrame) {
        super();
        _ScopeChainModel_instances.add(this);
        _ScopeChainModel_callFrame.set(this, void 0);
        /** We use the `Throttler` here to make sure that `#boundUpdate` is not run multiple times simultanously */
        _ScopeChainModel_throttler.set(this, new Common.Throttler.Throttler(5));
        _ScopeChainModel_boundUpdate.set(this, __classPrivateFieldGet(this, _ScopeChainModel_instances, "m", _ScopeChainModel_update).bind(this));
        __classPrivateFieldSet(this, _ScopeChainModel_callFrame, callFrame, "f");
        __classPrivateFieldGet(this, _ScopeChainModel_callFrame, "f").debuggerModel.addEventListener(SDK.DebuggerModel.Events.DebugInfoAttached, __classPrivateFieldGet(this, _ScopeChainModel_instances, "m", _ScopeChainModel_debugInfoAttached), this);
        __classPrivateFieldGet(this, _ScopeChainModel_callFrame, "f").debuggerModel.sourceMapManager().addEventListener(SDK.SourceMapManager.Events.SourceMapAttached, __classPrivateFieldGet(this, _ScopeChainModel_instances, "m", _ScopeChainModel_sourceMapAttached), this);
        void __classPrivateFieldGet(this, _ScopeChainModel_throttler, "f").schedule(__classPrivateFieldGet(this, _ScopeChainModel_boundUpdate, "f"));
    }
    dispose() {
        __classPrivateFieldGet(this, _ScopeChainModel_callFrame, "f").debuggerModel.removeEventListener(SDK.DebuggerModel.Events.DebugInfoAttached, __classPrivateFieldGet(this, _ScopeChainModel_instances, "m", _ScopeChainModel_debugInfoAttached), this);
        __classPrivateFieldGet(this, _ScopeChainModel_callFrame, "f").debuggerModel.sourceMapManager().removeEventListener(SDK.SourceMapManager.Events.SourceMapAttached, __classPrivateFieldGet(this, _ScopeChainModel_instances, "m", _ScopeChainModel_sourceMapAttached), this);
        this.listeners?.clear();
    }
}
_ScopeChainModel_callFrame = new WeakMap(), _ScopeChainModel_throttler = new WeakMap(), _ScopeChainModel_boundUpdate = new WeakMap(), _ScopeChainModel_instances = new WeakSet(), _ScopeChainModel_update = async function _ScopeChainModel_update() {
    const scopeChain = await resolveScopeChain(__classPrivateFieldGet(this, _ScopeChainModel_callFrame, "f"));
    this.dispatchEventToListeners("ScopeChainUpdated" /* Events.SCOPE_CHAIN_UPDATED */, new ScopeChain(scopeChain));
}, _ScopeChainModel_debugInfoAttached = function _ScopeChainModel_debugInfoAttached(event) {
    if (event.data === __classPrivateFieldGet(this, _ScopeChainModel_callFrame, "f").script) {
        void __classPrivateFieldGet(this, _ScopeChainModel_throttler, "f").schedule(__classPrivateFieldGet(this, _ScopeChainModel_boundUpdate, "f"));
    }
}, _ScopeChainModel_sourceMapAttached = function _ScopeChainModel_sourceMapAttached(event) {
    if (event.data.client === __classPrivateFieldGet(this, _ScopeChainModel_callFrame, "f").script) {
        void __classPrivateFieldGet(this, _ScopeChainModel_throttler, "f").schedule(__classPrivateFieldGet(this, _ScopeChainModel_boundUpdate, "f"));
    }
};
export var Events;
(function (Events) {
    Events["SCOPE_CHAIN_UPDATED"] = "ScopeChainUpdated";
})(Events || (Events = {}));
/**
 * A scope chain ready to be shown in the UI with debugging info applied.
 */
export class ScopeChain {
    constructor(scopeChain) {
        this.scopeChain = scopeChain;
    }
}
//# sourceMappingURL=ScopeChainModel.js.map