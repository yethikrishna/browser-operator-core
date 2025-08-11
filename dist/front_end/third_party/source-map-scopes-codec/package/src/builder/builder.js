// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _ScopeInfoBuilder_scopes, _ScopeInfoBuilder_ranges, _ScopeInfoBuilder_scopeStack, _ScopeInfoBuilder_rangeStack, _ScopeInfoBuilder_knownScopes, _ScopeInfoBuilder_keyToScope, _ScopeInfoBuilder_lastScope;
/**
 * Small utility class to build scope and range trees.
 *
 * This class allows construction of scope/range trees that will be rejected by the encoder.
 * Use this class if you guarantee proper nesting yourself and don't want to pay for the
 * checks, otherwise use the `SafeScopeInfoBuilder`.
 *
 * This class will also silently ignore calls that would fail otherwise. E.g. calling
 * `end*` without a matching `start*`.
 */
export class ScopeInfoBuilder {
    constructor() {
        _ScopeInfoBuilder_scopes.set(this, []);
        _ScopeInfoBuilder_ranges.set(this, []);
        _ScopeInfoBuilder_scopeStack.set(this, []);
        _ScopeInfoBuilder_rangeStack.set(this, []);
        _ScopeInfoBuilder_knownScopes.set(this, new Set());
        _ScopeInfoBuilder_keyToScope.set(this, new Map());
        _ScopeInfoBuilder_lastScope.set(this, null);
    }
    addNullScope() {
        __classPrivateFieldGet(this, _ScopeInfoBuilder_scopes, "f").push(null);
        return this;
    }
    startScope(line, column, options) {
        const scope = {
            start: { line, column },
            end: { line, column },
            variables: options?.variables?.slice(0) ?? [],
            children: [],
            isStackFrame: Boolean(options?.isStackFrame),
        };
        if (options?.name !== undefined)
            scope.name = options.name;
        if (options?.kind !== undefined)
            scope.kind = options.kind;
        if (__classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").length > 0) {
            scope.parent = __classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").at(-1);
        }
        __classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").push(scope);
        __classPrivateFieldGet(this, _ScopeInfoBuilder_knownScopes, "f").add(scope);
        if (options?.key !== undefined)
            __classPrivateFieldGet(this, _ScopeInfoBuilder_keyToScope, "f").set(options.key, scope);
        return this;
    }
    setScopeName(name) {
        const scope = __classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").at(-1);
        if (scope)
            scope.name = name;
        return this;
    }
    setScopeKind(kind) {
        const scope = __classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").at(-1);
        if (scope)
            scope.kind = kind;
        return this;
    }
    setScopeStackFrame(isStackFrame) {
        const scope = __classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").at(-1);
        if (scope)
            scope.isStackFrame = isStackFrame;
        return this;
    }
    setScopeVariables(variables) {
        const scope = __classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").at(-1);
        if (scope)
            scope.variables = variables.slice(0);
        return this;
    }
    endScope(line, column) {
        const scope = __classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").pop();
        if (!scope)
            return this;
        scope.end = { line, column };
        if (__classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").length === 0) {
            __classPrivateFieldGet(this, _ScopeInfoBuilder_scopes, "f").push(scope);
        }
        else {
            __classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").at(-1).children.push(scope);
        }
        __classPrivateFieldSet(this, _ScopeInfoBuilder_lastScope, scope, "f");
        return this;
    }
    /**
     * @returns The OriginalScope opened with the most recent `startScope` call, but not yet closed.
     */
    currentScope() {
        return __classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f").at(-1) ?? null;
    }
    /**
     * @returns The most recent OriginalScope closed with `endScope`.
     */
    lastScope() {
        return __classPrivateFieldGet(this, _ScopeInfoBuilder_lastScope, "f");
    }
    /**
     * @param option The definition 'scope' of this range can either be the "OriginalScope" directly
     * (produced by this builder) or the scope's key set while building the scope.
     */
    startRange(line, column, options) {
        const range = {
            start: { line, column },
            end: { line, column },
            isStackFrame: Boolean(options?.isStackFrame),
            isHidden: Boolean(options?.isHidden),
            values: options?.values ?? [],
            children: [],
        };
        if (__classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").length > 0) {
            range.parent = __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").at(-1);
        }
        if (options?.scope !== undefined) {
            range.originalScope = options.scope;
        }
        else if (options?.scopeKey !== undefined) {
            range.originalScope = __classPrivateFieldGet(this, _ScopeInfoBuilder_keyToScope, "f").get(options.scopeKey);
        }
        if (options?.callSite) {
            range.callSite = options.callSite;
        }
        __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").push(range);
        return this;
    }
    setRangeDefinitionScope(scope) {
        const range = __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").at(-1);
        if (range)
            range.originalScope = scope;
        return this;
    }
    setRangeDefinitionScopeKey(scopeKey) {
        const range = __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").at(-1);
        if (range)
            range.originalScope = __classPrivateFieldGet(this, _ScopeInfoBuilder_keyToScope, "f").get(scopeKey);
        return this;
    }
    setRangeStackFrame(isStackFrame) {
        const range = __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").at(-1);
        if (range)
            range.isStackFrame = isStackFrame;
        return this;
    }
    setRangeHidden(isHidden) {
        const range = __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").at(-1);
        if (range)
            range.isHidden = isHidden;
        return this;
    }
    setRangeValues(values) {
        const range = __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").at(-1);
        if (range)
            range.values = values;
        return this;
    }
    setRangeCallSite(callSite) {
        const range = __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").at(-1);
        if (range)
            range.callSite = callSite;
        return this;
    }
    endRange(line, column) {
        const range = __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").pop();
        if (!range)
            return this;
        range.end = { line, column };
        if (__classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").length === 0) {
            __classPrivateFieldGet(this, _ScopeInfoBuilder_ranges, "f").push(range);
        }
        else {
            __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f").at(-1).children.push(range);
        }
        return this;
    }
    build() {
        const info = { scopes: __classPrivateFieldGet(this, _ScopeInfoBuilder_scopes, "f"), ranges: __classPrivateFieldGet(this, _ScopeInfoBuilder_ranges, "f") };
        __classPrivateFieldSet(this, _ScopeInfoBuilder_scopes, [], "f");
        __classPrivateFieldSet(this, _ScopeInfoBuilder_ranges, [], "f");
        __classPrivateFieldGet(this, _ScopeInfoBuilder_knownScopes, "f").clear();
        return info;
    }
    get scopeStack() {
        return __classPrivateFieldGet(this, _ScopeInfoBuilder_scopeStack, "f");
    }
    get rangeStack() {
        return __classPrivateFieldGet(this, _ScopeInfoBuilder_rangeStack, "f");
    }
    isKnownScope(scope) {
        return __classPrivateFieldGet(this, _ScopeInfoBuilder_knownScopes, "f").has(scope);
    }
    isValidScopeKey(key) {
        return __classPrivateFieldGet(this, _ScopeInfoBuilder_keyToScope, "f").has(key);
    }
    getScopeByValidKey(key) {
        return __classPrivateFieldGet(this, _ScopeInfoBuilder_keyToScope, "f").get(key);
    }
}
_ScopeInfoBuilder_scopes = new WeakMap(), _ScopeInfoBuilder_ranges = new WeakMap(), _ScopeInfoBuilder_scopeStack = new WeakMap(), _ScopeInfoBuilder_rangeStack = new WeakMap(), _ScopeInfoBuilder_knownScopes = new WeakMap(), _ScopeInfoBuilder_keyToScope = new WeakMap(), _ScopeInfoBuilder_lastScope = new WeakMap();
//# sourceMappingURL=builder.js.map