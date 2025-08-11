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
var _SourceMapScopeChainEntry_callFrame, _SourceMapScopeChainEntry_scope, _SourceMapScopeChainEntry_range, _SourceMapScopeChainEntry_isInnerMostFunction, _SourceMapScopeChainEntry_returnValue, _SourceMapScopeRemoteObject_instances, _a, _SourceMapScopeRemoteObject_callFrame, _SourceMapScopeRemoteObject_scope, _SourceMapScopeRemoteObject_range, _SourceMapScopeRemoteObject_findExpression, _SourceMapScopeRemoteObject_unavailableProperty;
import * as i18n from '../i18n/i18n.js';
import { RemoteObjectImpl, RemoteObjectProperty } from './RemoteObject.js';
import { contains } from './SourceMapScopesInfo.js';
const UIStrings = {
    /**
     *@description Title of a section in the debugger showing local JavaScript variables.
     */
    local: 'Local',
    /**
     *@description Text that refers to closure as a programming term
     */
    closure: 'Closure',
    /**
     *@description Noun that represents a section or block of code in the Debugger Model. Shown in the Sources tab, while paused on a breakpoint.
     */
    block: 'Block',
    /**
     *@description Title of a section in the debugger showing JavaScript variables from the global scope.
     */
    global: 'Global',
    /**
     *@description Text in Scope Chain Sidebar Pane of the Sources panel
     */
    returnValue: 'Return value',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/SourceMapScopeChainEntry.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class SourceMapScopeChainEntry {
    /**
     * @param isInnerMostFunction If `scope` is the innermost 'function' scope. Only used for labeling as we name the
     * scope of the paused function 'Local', while other outer 'function' scopes are named 'Closure'.
     */
    constructor(callFrame, scope, range, isInnerMostFunction, returnValue) {
        _SourceMapScopeChainEntry_callFrame.set(this, void 0);
        _SourceMapScopeChainEntry_scope.set(this, void 0);
        _SourceMapScopeChainEntry_range.set(this, void 0);
        _SourceMapScopeChainEntry_isInnerMostFunction.set(this, void 0);
        _SourceMapScopeChainEntry_returnValue.set(this, void 0);
        __classPrivateFieldSet(this, _SourceMapScopeChainEntry_callFrame, callFrame, "f");
        __classPrivateFieldSet(this, _SourceMapScopeChainEntry_scope, scope, "f");
        __classPrivateFieldSet(this, _SourceMapScopeChainEntry_range, range, "f");
        __classPrivateFieldSet(this, _SourceMapScopeChainEntry_isInnerMostFunction, isInnerMostFunction, "f");
        __classPrivateFieldSet(this, _SourceMapScopeChainEntry_returnValue, returnValue, "f");
    }
    extraProperties() {
        if (__classPrivateFieldGet(this, _SourceMapScopeChainEntry_returnValue, "f")) {
            return [new RemoteObjectProperty(i18nString(UIStrings.returnValue), __classPrivateFieldGet(this, _SourceMapScopeChainEntry_returnValue, "f"), undefined, undefined, undefined, undefined, undefined, 
                /* synthetic */ true)];
        }
        return [];
    }
    callFrame() {
        return __classPrivateFieldGet(this, _SourceMapScopeChainEntry_callFrame, "f");
    }
    type() {
        switch (__classPrivateFieldGet(this, _SourceMapScopeChainEntry_scope, "f").kind) {
            case 'global':
                return "global" /* Protocol.Debugger.ScopeType.Global */;
            case 'function':
                return __classPrivateFieldGet(this, _SourceMapScopeChainEntry_isInnerMostFunction, "f") ? "local" /* Protocol.Debugger.ScopeType.Local */ : "closure" /* Protocol.Debugger.ScopeType.Closure */;
            case 'block':
                return "block" /* Protocol.Debugger.ScopeType.Block */;
        }
        return __classPrivateFieldGet(this, _SourceMapScopeChainEntry_scope, "f").kind ?? '';
    }
    typeName() {
        switch (__classPrivateFieldGet(this, _SourceMapScopeChainEntry_scope, "f").kind) {
            case 'global':
                return i18nString(UIStrings.global);
            case 'function':
                return __classPrivateFieldGet(this, _SourceMapScopeChainEntry_isInnerMostFunction, "f") ? i18nString(UIStrings.local) : i18nString(UIStrings.closure);
            case 'block':
                return i18nString(UIStrings.block);
        }
        return __classPrivateFieldGet(this, _SourceMapScopeChainEntry_scope, "f").kind ?? '';
    }
    name() {
        return __classPrivateFieldGet(this, _SourceMapScopeChainEntry_scope, "f").name;
    }
    range() {
        return null;
    }
    object() {
        return new SourceMapScopeRemoteObject(__classPrivateFieldGet(this, _SourceMapScopeChainEntry_callFrame, "f"), __classPrivateFieldGet(this, _SourceMapScopeChainEntry_scope, "f"), __classPrivateFieldGet(this, _SourceMapScopeChainEntry_range, "f"));
    }
    description() {
        return '';
    }
    icon() {
        return undefined;
    }
}
_SourceMapScopeChainEntry_callFrame = new WeakMap(), _SourceMapScopeChainEntry_scope = new WeakMap(), _SourceMapScopeChainEntry_range = new WeakMap(), _SourceMapScopeChainEntry_isInnerMostFunction = new WeakMap(), _SourceMapScopeChainEntry_returnValue = new WeakMap();
class SourceMapScopeRemoteObject extends RemoteObjectImpl {
    constructor(callFrame, scope, range) {
        super(callFrame.debuggerModel.runtimeModel(), /* objectId */ undefined, 'object', /* sub type */ undefined, 
        /* value */ null);
        _SourceMapScopeRemoteObject_instances.add(this);
        _SourceMapScopeRemoteObject_callFrame.set(this, void 0);
        _SourceMapScopeRemoteObject_scope.set(this, void 0);
        _SourceMapScopeRemoteObject_range.set(this, void 0);
        __classPrivateFieldSet(this, _SourceMapScopeRemoteObject_callFrame, callFrame, "f");
        __classPrivateFieldSet(this, _SourceMapScopeRemoteObject_scope, scope, "f");
        __classPrivateFieldSet(this, _SourceMapScopeRemoteObject_range, range, "f");
    }
    async doGetProperties(_ownProperties, accessorPropertiesOnly, generatePreview) {
        if (accessorPropertiesOnly) {
            return { properties: [], internalProperties: [] };
        }
        const properties = [];
        for (const [index, variable] of __classPrivateFieldGet(this, _SourceMapScopeRemoteObject_scope, "f").variables.entries()) {
            const expression = __classPrivateFieldGet(this, _SourceMapScopeRemoteObject_instances, "m", _SourceMapScopeRemoteObject_findExpression).call(this, index);
            if (expression === null) {
                properties.push(__classPrivateFieldGet(_a, _a, "m", _SourceMapScopeRemoteObject_unavailableProperty).call(_a, variable));
                continue;
            }
            // TODO(crbug.com/40277685): Once we can evaluate expressions in scopes other than the innermost one,
            //         we need to find the find the CDP scope that matches `this.#range` and evaluate in that.
            const result = await __classPrivateFieldGet(this, _SourceMapScopeRemoteObject_callFrame, "f").evaluate({ expression, generatePreview });
            if ('error' in result || result.exceptionDetails) {
                // TODO(crbug.com/40277685): Make these errors user-visible to aid tooling developers.
                //         E.g. show the error on hover or expose it in the developer resources panel.
                properties.push(__classPrivateFieldGet(_a, _a, "m", _SourceMapScopeRemoteObject_unavailableProperty).call(_a, variable));
            }
            else {
                properties.push(new RemoteObjectProperty(variable, result.object, /* enumerable */ false, /* writable */ false, /* isOwn */ true, 
                /* wasThrown */ false));
            }
        }
        return { properties, internalProperties: [] };
    }
}
_a = SourceMapScopeRemoteObject, _SourceMapScopeRemoteObject_callFrame = new WeakMap(), _SourceMapScopeRemoteObject_scope = new WeakMap(), _SourceMapScopeRemoteObject_range = new WeakMap(), _SourceMapScopeRemoteObject_instances = new WeakSet(), _SourceMapScopeRemoteObject_findExpression = function _SourceMapScopeRemoteObject_findExpression(index) {
    if (!__classPrivateFieldGet(this, _SourceMapScopeRemoteObject_range, "f")) {
        return null;
    }
    const expressionOrSubRanges = __classPrivateFieldGet(this, _SourceMapScopeRemoteObject_range, "f").values[index];
    if (typeof expressionOrSubRanges === 'string') {
        return expressionOrSubRanges;
    }
    if (expressionOrSubRanges === null) {
        return null;
    }
    const pausedPosition = __classPrivateFieldGet(this, _SourceMapScopeRemoteObject_callFrame, "f").location();
    for (const range of expressionOrSubRanges) {
        if (contains({ start: range.from, end: range.to }, pausedPosition.lineNumber, pausedPosition.columnNumber)) {
            return range.value ?? null;
        }
    }
    return null;
}, _SourceMapScopeRemoteObject_unavailableProperty = function _SourceMapScopeRemoteObject_unavailableProperty(name) {
    return new RemoteObjectProperty(name, null, /* enumerable */ false, /* writeable */ false, /* isOwn */ true, /* wasThrown */ false);
};
//# sourceMappingURL=SourceMapScopeChainEntry.js.map