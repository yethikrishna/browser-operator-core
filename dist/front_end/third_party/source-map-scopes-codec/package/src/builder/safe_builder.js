// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SafeScopeInfoBuilder_instances, _SafeScopeInfoBuilder_verifyEmptyScopeStack, _SafeScopeInfoBuilder_verifyEmptyRangeStack, _SafeScopeInfoBuilder_verifyScopePresent, _SafeScopeInfoBuilder_verifyRangePresent, _SafeScopeInfoBuilder_verifyRangeValues;
import { comparePositions } from "../util.js";
import { ScopeInfoBuilder } from "./builder.js";
/**
 * Similar to `ScopeInfoBuilder`, but with checks that scopes/ranges are well
 * nested and don't partially overlap.
 */
export class SafeScopeInfoBuilder extends ScopeInfoBuilder {
    constructor() {
        super(...arguments);
        _SafeScopeInfoBuilder_instances.add(this);
    }
    addNullScope() {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyScopeStack).call(this, "add null scope");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyRangeStack).call(this, "add null scope");
        super.addNullScope();
        return this;
    }
    startScope(line, column, options) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyRangeStack).call(this, "start scope");
        const parent = this.scopeStack.at(-1);
        if (parent && comparePositions(parent.start, { line, column }) > 0) {
            throw new Error(`Scope start (${line}, ${column}) must not precede parent start (${parent.start.line}, ${parent.start.column})`);
        }
        const precedingSibling = parent?.children.at(-1);
        if (precedingSibling &&
            comparePositions(precedingSibling.end, { line, column }) > 0) {
            throw new Error(`Scope start (${line}, ${column}) must not precede preceding siblings' end (${precedingSibling
                .end.line,
                precedingSibling.end.column})`);
        }
        super.startScope(line, column, options);
        return this;
    }
    setScopeName(name) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyScopePresent).call(this, "setScopeName");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyRangeStack).call(this, "setScopeName");
        super.setScopeName(name);
        return this;
    }
    setScopeKind(kind) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyScopePresent).call(this, "setScopeKind");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyRangeStack).call(this, "setScopeKind");
        super.setScopeKind(kind);
        return this;
    }
    setScopeStackFrame(isStackFrame) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyScopePresent).call(this, "setScopeStackFrame");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyRangeStack).call(this, "setScopeStackFrame");
        super.setScopeStackFrame(isStackFrame);
        return this;
    }
    setScopeVariables(variables) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyScopePresent).call(this, "setScopeVariables");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyRangeStack).call(this, "setScopeVariables");
        super.setScopeVariables(variables);
        return this;
    }
    endScope(line, column) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyRangeStack).call(this, "end scope");
        if (this.scopeStack.length === 0) {
            throw new Error("No scope to end");
        }
        const scope = this.scopeStack.at(-1);
        if (comparePositions(scope.start, { line, column }) > 0) {
            throw new Error(`Scope end (${line}, ${column}) must not precede scope start (${scope.start.line}, ${scope.start.column})`);
        }
        super.endScope(line, column);
        return this;
    }
    startRange(line, column, options) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyScopeStack).call(this, "starRange");
        const parent = this.rangeStack.at(-1);
        if (parent && comparePositions(parent.start, { line, column }) > 0) {
            throw new Error(`Range start (${line}, ${column}) must not precede parent start (${parent.start.line}, ${parent.start.column})`);
        }
        const precedingSibling = parent?.children.at(-1);
        if (precedingSibling &&
            comparePositions(precedingSibling.end, { line, column }) > 0) {
            throw new Error(`Range start (${line}, ${column}) must not precede preceding siblings' end (${precedingSibling
                .end.line,
                precedingSibling.end.column})`);
        }
        if (options?.scopeKey !== undefined &&
            !this.isValidScopeKey(options.scopeKey)) {
            throw new Error(`${options.scopeKey} does not reference a valid OriginalScope`);
        }
        if (options?.scope && !this.isKnownScope(options.scope)) {
            throw new Error("The provided definition scope was not produced by this builder!");
        }
        if (options?.values?.length && options?.scope === undefined &&
            options?.scopeKey === undefined) {
            throw new Error("Provided bindings without providing an OriginalScope");
        }
        else if (options?.values?.length && options?.scope &&
            options.values.length !== options.scope.variables.length) {
            throw new Error("Provided bindings don't match up with OriginalScope.variables");
        }
        else if (options?.values?.length && options?.scopeKey !== undefined) {
            const scope = this.getScopeByValidKey(options.scopeKey);
            if (options.values.length !== scope.variables.length) {
                throw new Error("Provided bindings don't match up with OriginalScope.variables");
            }
        }
        super.startRange(line, column, options);
        return this;
    }
    setRangeDefinitionScope(scope) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyScopeStack).call(this, "setRangeDefinitionScope");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyRangePresent).call(this, "setRangeDefinitionScope");
        if (!this.isKnownScope(scope)) {
            throw new Error("The provided definition scope was not produced by this builder!");
        }
        super.setRangeDefinitionScope(scope);
        return this;
    }
    setRangeDefinitionScopeKey(scopeKey) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyScopeStack).call(this, "setRangeDefinitionScope");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyRangePresent).call(this, "setRangeDefinitionScope");
        if (!this.isValidScopeKey(scopeKey)) {
            throw new Error(`The provided scope key ${scopeKey} is not know nto the builder!`);
        }
        super.setRangeDefinitionScopeKey(scopeKey);
        return this;
    }
    setRangeStackFrame(isStackFrame) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyScopeStack).call(this, "setRangeStackFrame");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyRangePresent).call(this, "setRangeStackFrame");
        super.setRangeStackFrame(isStackFrame);
        return this;
    }
    setRangeHidden(isHidden) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyScopeStack).call(this, "setRangeHidden");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyRangePresent).call(this, "setRangeHidden");
        super.setRangeHidden(isHidden);
        return this;
    }
    setRangeValues(values) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyScopeStack).call(this, "setRangeValues");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyRangePresent).call(this, "setRangeValues");
        const range = this.rangeStack.at(-1);
        if (!range.originalScope) {
            throw new Error("Setting an OriginalScope for a range is required before value bindings can be provided!");
        }
        else if (range.originalScope.variables.length !== values.length) {
            throw new Error("Provided bindings don't match up with OriginalScope.variables");
        }
        super.setRangeValues(values);
        return this;
    }
    setRangeCallSite(callSite) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyScopeStack).call(this, "setRangeCallSite");
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyRangePresent).call(this, "setRangeCallSite");
        super.setRangeCallSite(callSite);
        return this;
    }
    endRange(line, column) {
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyScopeStack).call(this, "endRange");
        if (this.rangeStack.length === 0) {
            throw new Error("No range to end");
        }
        const range = this.rangeStack.at(-1);
        if (comparePositions(range.start, { line, column }) > 0) {
            throw new Error(`Range end (${line}, ${column}) must not precede range start (${range.start.line}, ${range.start.column})`);
        }
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyRangeValues).call(this, range, { line, column });
        super.endRange(line, column);
        return this;
    }
    build() {
        if (this.scopeStack.length > 0) {
            throw new Error("Can't build ScopeInfo while an OriginalScope is unclosed.");
        }
        __classPrivateFieldGet(this, _SafeScopeInfoBuilder_instances, "m", _SafeScopeInfoBuilder_verifyEmptyRangeStack).call(this, "build ScopeInfo");
        return super.build();
    }
}
_SafeScopeInfoBuilder_instances = new WeakSet(), _SafeScopeInfoBuilder_verifyEmptyScopeStack = function _SafeScopeInfoBuilder_verifyEmptyScopeStack(op) {
    if (this.scopeStack.length > 0) {
        throw new Error(`Can't ${op} while a OriginalScope is unclosed.`);
    }
}, _SafeScopeInfoBuilder_verifyEmptyRangeStack = function _SafeScopeInfoBuilder_verifyEmptyRangeStack(op) {
    if (this.rangeStack.length > 0) {
        throw new Error(`Can't ${op} while a GeneratedRange is unclosed.`);
    }
}, _SafeScopeInfoBuilder_verifyScopePresent = function _SafeScopeInfoBuilder_verifyScopePresent(op) {
    if (this.scopeStack.length === 0) {
        throw new Error(`Can't ${op} while no OriginalScope is on the stack.`);
    }
}, _SafeScopeInfoBuilder_verifyRangePresent = function _SafeScopeInfoBuilder_verifyRangePresent(op) {
    if (this.rangeStack.length === 0) {
        throw new Error(`Can't ${op} while no GeneratedRange is on the stack.`);
    }
}, _SafeScopeInfoBuilder_verifyRangeValues = function _SafeScopeInfoBuilder_verifyRangeValues(range, end) {
    for (const value of range.values) {
        if (!Array.isArray(value)) {
            continue;
        }
        const subRanges = value;
        if (subRanges.length === 0) {
            continue;
        }
        const first = subRanges.at(0);
        if (comparePositions(first.from, range.start) !== 0) {
            throw new Error(`Sub-range bindings must start at the generated range's start. Expected ${range.start.line}:${range.start.column}, but got ${first.from.line}:${first.from.column}`);
        }
        const last = subRanges.at(-1);
        if (comparePositions(last.to, end) !== 0) {
            throw new Error(`Sub-range bindings must end at the generated range's end. Expected ${end.line}:${end.column}, but got ${last.to.line}:${last.to.column}`);
        }
        for (let i = 0; i < subRanges.length; ++i) {
            const current = subRanges[i];
            if (comparePositions(current.from, current.to) >= 0) {
                throw new Error(`Sub-range binding 'from' (${current.from.line}:${current.from.column}) must precede 'to' (${current.to.line}:${current.to.column})`);
            }
            if (i > 0) {
                const prev = subRanges[i - 1];
                if (comparePositions(prev.to, current.from) !== 0) {
                    throw new Error(`Sub-range bindings must be sorted and not overlap. Found gap between ${prev.to.line}:${prev.to.column} and ${current.from.line}:${current.from.column}`);
                }
            }
        }
    }
};
//# sourceMappingURL=safe_builder.js.map