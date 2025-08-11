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
var _SourceMapScopesInfo_instances, _SourceMapScopesInfo_sourceMap, _SourceMapScopesInfo_originalScopes, _SourceMapScopesInfo_generatedRanges, _SourceMapScopesInfo_cachedVariablesAndBindingsPresent, _SourceMapScopesInfo_findGeneratedRangeChain, _SourceMapScopesInfo_areVariablesAndBindingsPresent, _SourceMapScopesInfo_findGeneratedRangeChainForFrame, _SourceMapScopesInfo_findOriginalScopeChain;
import { SourceMapScopeChainEntry } from './SourceMapScopeChainEntry.js';
export class SourceMapScopesInfo {
    constructor(sourceMap, scopeInfo) {
        _SourceMapScopesInfo_instances.add(this);
        _SourceMapScopesInfo_sourceMap.set(this, void 0);
        _SourceMapScopesInfo_originalScopes.set(this, void 0);
        _SourceMapScopesInfo_generatedRanges.set(this, void 0);
        _SourceMapScopesInfo_cachedVariablesAndBindingsPresent.set(this, null);
        __classPrivateFieldSet(this, _SourceMapScopesInfo_sourceMap, sourceMap, "f");
        __classPrivateFieldSet(this, _SourceMapScopesInfo_originalScopes, scopeInfo.scopes, "f");
        __classPrivateFieldSet(this, _SourceMapScopesInfo_generatedRanges, scopeInfo.ranges, "f");
    }
    addOriginalScopes(scopes) {
        for (const scope of scopes) {
            __classPrivateFieldGet(this, _SourceMapScopesInfo_originalScopes, "f").push(scope ?? null);
        }
    }
    addGeneratedRanges(ranges) {
        for (const range of ranges) {
            __classPrivateFieldGet(this, _SourceMapScopesInfo_generatedRanges, "f").push(range);
        }
    }
    hasOriginalScopes(sourceIdx) {
        return Boolean(__classPrivateFieldGet(this, _SourceMapScopesInfo_originalScopes, "f")[sourceIdx]);
    }
    addOriginalScopesAtIndex(sourceIdx, scope) {
        if (!__classPrivateFieldGet(this, _SourceMapScopesInfo_originalScopes, "f")[sourceIdx]) {
            __classPrivateFieldGet(this, _SourceMapScopesInfo_originalScopes, "f")[sourceIdx] = scope;
        }
        else {
            throw new Error(`Trying to re-augment existing scopes for source at index: ${sourceIdx}`);
        }
    }
    /**
     * Given a generated position, returns the original name of the surrounding function as well as
     * all the original function names that got inlined into the surrounding generated function and their
     * respective callsites in the original code (ordered from inner to outer).
     *
     * @returns a list with inlined functions. Every entry in the list has a callsite in the orignal code,
     * except the last function (since the last function didn't get inlined).
     */
    findInlinedFunctions(generatedLine, generatedColumn) {
        const rangeChain = __classPrivateFieldGet(this, _SourceMapScopesInfo_instances, "m", _SourceMapScopesInfo_findGeneratedRangeChain).call(this, generatedLine, generatedColumn);
        const result = {
            inlinedFunctions: [],
            originalFunctionName: '',
        };
        // Walk the generated ranges from the innermost containing range outwards as long as we don't
        // encounter a range that is a scope in the generated code and a function scope originally.
        for (let i = rangeChain.length - 1; i >= 0; --i) {
            const range = rangeChain[i];
            if (range.callSite) {
                // Record the name and call-site if the range corresponds to an inlined function.
                result.inlinedFunctions.push({ name: range.originalScope?.name ?? '', callsite: range.callSite });
            }
            if (range.isStackFrame) {
                // We arrived at an actual generated JS function, don't go further.
                // The corresponding original scope could not actually be a function
                // (e.g. a block scope transpiled down to a JS function), but we'll
                // filter that out later.
                result.originalFunctionName = range.originalScope?.name ?? '';
                break;
            }
        }
        return result;
    }
    /**
     * Takes a V8 provided call frame and expands any inlined frames into virtual call frames.
     *
     * For call frames where nothing was inlined, the result contains only a single element,
     * the provided frame but with the original name.
     *
     * For call frames where we are paused in inlined code, this function returns a list of
     * call frames from "inner to outer". This is the call frame at index 0
     * signifies the top of this stack trace fragment.
     *
     * The rest are "virtual" call frames and will have an "inlineFrameIndex" set in ascending
     * order, so the condition `result[index] === result[index].inlineFrameIndex` always holds.
     */
    expandCallFrame(callFrame) {
        const { originalFunctionName, inlinedFunctions } = this.findInlinedFunctions(callFrame.location().lineNumber, callFrame.location().columnNumber);
        const result = [];
        for (const [index, fn] of inlinedFunctions.entries()) {
            result.push(callFrame.createVirtualCallFrame(index, fn.name));
        }
        result.push(callFrame.createVirtualCallFrame(result.length, originalFunctionName));
        return result;
    }
    /**
     * @returns true if we have enough info (i.e. variable and binding expressions) to build
     * a scope view.
     */
    hasVariablesAndBindings() {
        if (__classPrivateFieldGet(this, _SourceMapScopesInfo_cachedVariablesAndBindingsPresent, "f") === null) {
            __classPrivateFieldSet(this, _SourceMapScopesInfo_cachedVariablesAndBindingsPresent, __classPrivateFieldGet(this, _SourceMapScopesInfo_instances, "m", _SourceMapScopesInfo_areVariablesAndBindingsPresent).call(this), "f");
        }
        return __classPrivateFieldGet(this, _SourceMapScopesInfo_cachedVariablesAndBindingsPresent, "f");
    }
    /**
     * Constructs a scope chain based on the CallFrame's paused position.
     *
     * The algorithm to obtain the original scope chain is straight-forward:
     *
     *   1) Find the inner-most generated range that contains the CallFrame's
     *      paused position.
     *
     *   2) Does the found range have an associated original scope?
     *
     *      2a) If no, return null. This is a "hidden" range and technically
     *          we shouldn't be pausing here in the first place. This code doesn't
     *          correspond to anything in the authored code.
     *
     *      2b) If yes, the associated original scope is the inner-most
     *          original scope in the resulting scope chain.
     *
     *   3) Walk the parent chain of the found original scope outwards. This is
     *      our scope view. For each original scope we also try to find a
     *      corresponding generated range that contains the CallFrame's
     *      paused position. We need the generated range to resolve variable
     *      values.
     */
    resolveMappedScopeChain(callFrame) {
        const rangeChain = __classPrivateFieldGet(this, _SourceMapScopesInfo_instances, "m", _SourceMapScopesInfo_findGeneratedRangeChainForFrame).call(this, callFrame);
        const innerMostOriginalScope = rangeChain.at(-1)?.originalScope;
        if (innerMostOriginalScope === undefined) {
            return null;
        }
        // TODO(crbug.com/40277685): Add a sanity check here where we map the paused position using
        //         the source map's mappings, find the inner-most original scope with that mapped paused
        //         position and compare that result with `innerMostOriginalScope`. If they don't match we
        //         should emit a warning about the broken source map as mappings and scopes are inconsistent
        //         w.r.t. each other.
        let seenFunctionScope = false;
        const result = [];
        // Walk the original scope chain outwards and try to find the corresponding generated range along the way.
        for (let originalScope = rangeChain.at(-1)?.originalScope; originalScope; originalScope = originalScope.parent) {
            const range = rangeChain.findLast(r => r.originalScope === originalScope);
            const isFunctionScope = originalScope.kind === 'function';
            const isInnerMostFunction = isFunctionScope && !seenFunctionScope;
            const returnValue = isInnerMostFunction ? callFrame.returnValue() : null;
            result.push(new SourceMapScopeChainEntry(callFrame, originalScope, range, isInnerMostFunction, returnValue ?? undefined));
            seenFunctionScope || (seenFunctionScope = isFunctionScope);
        }
        // If we are paused on a return statement, we need to drop inner block scopes. This is because V8 only emits a
        // single return bytecode and "gotos" at the functions' end, where we are now paused.
        if (callFrame.returnValue() !== null) {
            while (result.length && result[0].type() !== "local" /* Protocol.Debugger.ScopeType.Local */) {
                result.shift();
            }
        }
        return result;
    }
    /**
     * Returns the authored function name of the function containing the provided generated position.
     */
    findOriginalFunctionName({ line, column }) {
        // There are 2 approaches:
        //   1) Find the inner-most generated range containing the provided generated position
        //      and use it's OriginalScope (then walk it outwards until we hit a function).
        //   2) Use the mappings to turn the generated position into an original position.
        //      Then find the inner-most original scope containing that original position.
        //      Then walk it outwards until we hit a function.
        //
        // Both approaches should yield the same result (assuming the mappings are spec compliant
        // w.r.t. generated ranges). But in the case of "pasta" scopes and extension provided
        // scope info, we only have the OriginalScope parts and mappings without GeneratedRanges.
        let originalInnerMostScope;
        if (__classPrivateFieldGet(this, _SourceMapScopesInfo_generatedRanges, "f").length > 0) {
            const rangeChain = __classPrivateFieldGet(this, _SourceMapScopesInfo_instances, "m", _SourceMapScopesInfo_findGeneratedRangeChain).call(this, line, column);
            originalInnerMostScope = rangeChain.at(-1)?.originalScope;
        }
        else {
            // No GeneratedRanges. Try to use mappings.
            const entry = __classPrivateFieldGet(this, _SourceMapScopesInfo_sourceMap, "f").findEntry(line, column);
            if (entry?.sourceIndex === undefined) {
                return null;
            }
            originalInnerMostScope =
                __classPrivateFieldGet(this, _SourceMapScopesInfo_instances, "m", _SourceMapScopesInfo_findOriginalScopeChain).call(this, { sourceIndex: entry.sourceIndex, line: entry.sourceLineNumber, column: entry.sourceColumnNumber })
                    .at(-1);
        }
        // Walk the original scope chain outwards until we find a function.
        for (let originalScope = originalInnerMostScope; originalScope; originalScope = originalScope.parent) {
            if (originalScope.isStackFrame) {
                return originalScope.name ?? '';
            }
        }
        return null;
    }
}
_SourceMapScopesInfo_sourceMap = new WeakMap(), _SourceMapScopesInfo_originalScopes = new WeakMap(), _SourceMapScopesInfo_generatedRanges = new WeakMap(), _SourceMapScopesInfo_cachedVariablesAndBindingsPresent = new WeakMap(), _SourceMapScopesInfo_instances = new WeakSet(), _SourceMapScopesInfo_findGeneratedRangeChain = function _SourceMapScopesInfo_findGeneratedRangeChain(line, column) {
    const result = [];
    (function walkRanges(ranges) {
        for (const range of ranges) {
            if (!contains(range, line, column)) {
                continue;
            }
            result.push(range);
            walkRanges(range.children);
        }
    })(__classPrivateFieldGet(this, _SourceMapScopesInfo_generatedRanges, "f"));
    return result;
}, _SourceMapScopesInfo_areVariablesAndBindingsPresent = function _SourceMapScopesInfo_areVariablesAndBindingsPresent() {
    // We check whether any original scope has a non-empty list of variables, and
    // generated ranges with a non-empty binding list.
    function walkTree(nodes) {
        for (const node of nodes) {
            if (!node) {
                continue;
            }
            if ('variables' in node && node.variables.length > 0) {
                return true;
            }
            if ('values' in node && node.values.some(v => v !== null)) {
                return true;
            }
            if (walkTree(node.children)) {
                return true;
            }
        }
        return false;
    }
    return walkTree(__classPrivateFieldGet(this, _SourceMapScopesInfo_originalScopes, "f")) && walkTree(__classPrivateFieldGet(this, _SourceMapScopesInfo_generatedRanges, "f"));
}, _SourceMapScopesInfo_findGeneratedRangeChainForFrame = function _SourceMapScopesInfo_findGeneratedRangeChainForFrame(callFrame) {
    const rangeChain = __classPrivateFieldGet(this, _SourceMapScopesInfo_instances, "m", _SourceMapScopesInfo_findGeneratedRangeChain).call(this, callFrame.location().lineNumber, callFrame.location().columnNumber);
    if (callFrame.inlineFrameIndex === 0) {
        return rangeChain;
    }
    // Drop ranges in the chain until we reach our desired inlined range.
    for (let inlineIndex = 0; inlineIndex < callFrame.inlineFrameIndex;) {
        const range = rangeChain.pop();
        if (range?.callSite) {
            ++inlineIndex;
        }
    }
    return rangeChain;
}, _SourceMapScopesInfo_findOriginalScopeChain = function _SourceMapScopesInfo_findOriginalScopeChain({ sourceIndex, line, column }) {
    const scope = __classPrivateFieldGet(this, _SourceMapScopesInfo_originalScopes, "f")[sourceIndex];
    if (!scope) {
        return [];
    }
    const result = [];
    (function walkScopes(scopes) {
        for (const scope of scopes) {
            if (!contains(scope, line, column)) {
                continue;
            }
            result.push(scope);
            walkScopes(scope.children);
        }
    })([scope]);
    return result;
};
export function contains(range, line, column) {
    if (range.start.line > line || (range.start.line === line && range.start.column > column)) {
        return false;
    }
    if (range.end.line < line || (range.end.line === line && range.end.column <= column)) {
        return false;
    }
    return true;
}
//# sourceMappingURL=SourceMapScopesInfo.js.map