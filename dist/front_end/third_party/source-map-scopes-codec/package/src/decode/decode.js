// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _Decoder_instances, _Decoder_encodedScopes, _Decoder_names, _Decoder_mode, _Decoder_scopes, _Decoder_ranges, _Decoder_scopeState, _Decoder_rangeState, _Decoder_scopeStack, _Decoder_rangeStack, _Decoder_flatOriginalScopes, _Decoder_subRangeBindingsForRange, _Decoder_throwInStrictMode, _Decoder_handleOriginalScopeStartItem, _Decoder_handleOriginalScopeVariablesItem, _Decoder_handleOriginalScopeEndItem, _Decoder_handleGeneratedRangeStartItem, _Decoder_handleGeneratedRangeBindingsItem, _Decoder_recordGeneratedSubRangeBindingItem, _Decoder_handleGeneratedRangeCallSite, _Decoder_handleGeneratedRangeEndItem, _Decoder_handleGeneratedRangeSubRangeBindings, _Decoder_resolveName;
import { TokenIterator } from "../vlq.js";
/**
 * The mode decides how well-formed the encoded scopes have to be, to be accepted by the decoder.
 *
 * LAX is the default and is much more lenient. It's still best effort though and the decoder doesn't
 * implement any error recovery: e.g. superfluous "start" items can lead to whole trees being omitted.
 *
 * STRICT mode will throw in the following situations:
 *
 *   - Encountering ORIGINAL_SCOPE_END, or GENERATED_RANGE_END items that don't have matching *_START items.
 *   - Encountering ORIGINAL_SCOPE_VARIABLES items outside a surrounding scope START/END.
 *   - Encountering GENERATED_RANGE_BINDINGS items outside a surrounding range START/END.
 *   - Miss-matches between the number of variables in a scope vs the number of value expressions in the ranges.
 *   - Out-of-bound indices into the "names" array.
 */
export var DecodeMode;
(function (DecodeMode) {
    DecodeMode[DecodeMode["STRICT"] = 1] = "STRICT";
    DecodeMode[DecodeMode["LAX"] = 2] = "LAX";
})(DecodeMode || (DecodeMode = {}));
export const DEFAULT_DECODE_OPTIONS = {
    mode: 2 /* DecodeMode.LAX */,
    generatedOffset: { line: 0, column: 0 },
};
export function decode(sourceMap, options = DEFAULT_DECODE_OPTIONS) {
    const opts = { ...DEFAULT_DECODE_OPTIONS, ...options };
    if ("sections" in sourceMap) {
        return decodeIndexMap(sourceMap, {
            ...opts,
            generatedOffset: { line: 0, column: 0 },
        });
    }
    return decodeMap(sourceMap, opts);
}
function decodeMap(sourceMap, options) {
    if (!sourceMap.scopes || !sourceMap.names)
        return { scopes: [], ranges: [] };
    return new Decoder(sourceMap.scopes, sourceMap.names, options).decode();
}
function decodeIndexMap(sourceMap, options) {
    const scopeInfo = { scopes: [], ranges: [] };
    for (const section of sourceMap.sections) {
        const { scopes, ranges } = decode(section.map, {
            ...options,
            generatedOffset: section.offset,
        });
        for (const scope of scopes)
            scopeInfo.scopes.push(scope);
        for (const range of ranges)
            scopeInfo.ranges.push(range);
    }
    return scopeInfo;
}
const DEFAULT_SCOPE_STATE = {
    line: 0,
    column: 0,
    name: 0,
    kind: 0,
    variable: 0,
};
const DEFAULT_RANGE_STATE = {
    line: 0,
    column: 0,
    defScopeIdx: 0,
};
class Decoder {
    constructor(scopes, names, options) {
        _Decoder_instances.add(this);
        _Decoder_encodedScopes.set(this, void 0);
        _Decoder_names.set(this, void 0);
        _Decoder_mode.set(this, void 0);
        _Decoder_scopes.set(this, []);
        _Decoder_ranges.set(this, []);
        _Decoder_scopeState.set(this, { ...DEFAULT_SCOPE_STATE });
        _Decoder_rangeState.set(this, { ...DEFAULT_RANGE_STATE });
        _Decoder_scopeStack.set(this, []);
        _Decoder_rangeStack.set(this, []);
        _Decoder_flatOriginalScopes.set(this, []);
        _Decoder_subRangeBindingsForRange.set(this, new Map());
        __classPrivateFieldSet(this, _Decoder_encodedScopes, scopes, "f");
        __classPrivateFieldSet(this, _Decoder_names, names, "f");
        __classPrivateFieldSet(this, _Decoder_mode, options.mode, "f");
        __classPrivateFieldGet(this, _Decoder_rangeState, "f").line = options.generatedOffset.line;
        __classPrivateFieldGet(this, _Decoder_rangeState, "f").column = options.generatedOffset.column;
    }
    decode() {
        const iter = new TokenIterator(__classPrivateFieldGet(this, _Decoder_encodedScopes, "f"));
        while (iter.hasNext()) {
            if (iter.peek() === ",") {
                iter.nextChar(); // Consume ",".
                __classPrivateFieldGet(this, _Decoder_scopes, "f").push(null); // Add an EmptyItem;
                continue;
            }
            const tag = iter.nextUnsignedVLQ();
            switch (tag) {
                case 1 /* Tag.ORIGINAL_SCOPE_START */: {
                    const item = {
                        flags: iter.nextUnsignedVLQ(),
                        line: iter.nextUnsignedVLQ(),
                        column: iter.nextUnsignedVLQ(),
                    };
                    if (item.flags & 1 /* OriginalScopeFlags.HAS_NAME */) {
                        item.nameIdx = iter.nextSignedVLQ();
                    }
                    if (item.flags & 2 /* OriginalScopeFlags.HAS_KIND */) {
                        item.kindIdx = iter.nextSignedVLQ();
                    }
                    __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_handleOriginalScopeStartItem).call(this, item);
                    break;
                }
                case 3 /* Tag.ORIGINAL_SCOPE_VARIABLES */: {
                    const variableIdxs = [];
                    while (iter.hasNext() && iter.peek() !== ",") {
                        variableIdxs.push(iter.nextSignedVLQ());
                    }
                    __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_handleOriginalScopeVariablesItem).call(this, variableIdxs);
                    break;
                }
                case 2 /* Tag.ORIGINAL_SCOPE_END */: {
                    __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_handleOriginalScopeEndItem).call(this, iter.nextUnsignedVLQ(), iter.nextUnsignedVLQ());
                    break;
                }
                case 4 /* Tag.GENERATED_RANGE_START */: {
                    const flags = iter.nextUnsignedVLQ();
                    const line = flags & 1 /* GeneratedRangeFlags.HAS_LINE */
                        ? iter.nextUnsignedVLQ()
                        : undefined;
                    const column = iter.nextUnsignedVLQ();
                    const definitionIdx = flags & 2 /* GeneratedRangeFlags.HAS_DEFINITION */
                        ? iter.nextSignedVLQ()
                        : undefined;
                    __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_handleGeneratedRangeStartItem).call(this, {
                        flags,
                        line,
                        column,
                        definitionIdx,
                    });
                    break;
                }
                case 5 /* Tag.GENERATED_RANGE_END */: {
                    const lineOrColumn = iter.nextUnsignedVLQ();
                    const maybeColumn = iter.hasNext() && iter.peek() !== ","
                        ? iter.nextUnsignedVLQ()
                        : undefined;
                    if (maybeColumn !== undefined) {
                        __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_handleGeneratedRangeEndItem).call(this, lineOrColumn, maybeColumn);
                    }
                    else {
                        __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_handleGeneratedRangeEndItem).call(this, 0, lineOrColumn);
                    }
                    break;
                }
                case 6 /* Tag.GENERATED_RANGE_BINDINGS */: {
                    const valueIdxs = [];
                    while (iter.hasNext() && iter.peek() !== ",") {
                        valueIdxs.push(iter.nextUnsignedVLQ());
                    }
                    __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_handleGeneratedRangeBindingsItem).call(this, valueIdxs);
                    break;
                }
                case 7 /* Tag.GENERATED_RANGE_SUBRANGE_BINDING */: {
                    const variableIndex = iter.nextUnsignedVLQ();
                    const bindings = [];
                    while (iter.hasNext() && iter.peek() !== ",") {
                        bindings.push([
                            iter.nextUnsignedVLQ(),
                            iter.nextUnsignedVLQ(),
                            iter.nextUnsignedVLQ(),
                        ]);
                    }
                    __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_recordGeneratedSubRangeBindingItem).call(this, variableIndex, bindings);
                    break;
                }
                case 8 /* Tag.GENERATED_RANGE_CALL_SITE */: {
                    __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_handleGeneratedRangeCallSite).call(this, iter.nextUnsignedVLQ(), iter.nextUnsignedVLQ(), iter.nextUnsignedVLQ());
                    break;
                }
            }
            // Consume any trailing VLQ and the the ","
            while (iter.hasNext() && iter.peek() !== ",")
                iter.nextUnsignedVLQ();
            if (iter.hasNext())
                iter.nextChar();
        }
        if (iter.currentChar() === ",") {
            // Handle trailing EmptyItem.
            __classPrivateFieldGet(this, _Decoder_scopes, "f").push(null);
        }
        if (__classPrivateFieldGet(this, _Decoder_scopeStack, "f").length > 0) {
            __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_throwInStrictMode).call(this, "Encountered ORIGINAL_SCOPE_START without matching END!");
        }
        if (__classPrivateFieldGet(this, _Decoder_rangeStack, "f").length > 0) {
            __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_throwInStrictMode).call(this, "Encountered GENERATED_RANGE_START without matching END!");
        }
        const info = { scopes: __classPrivateFieldGet(this, _Decoder_scopes, "f"), ranges: __classPrivateFieldGet(this, _Decoder_ranges, "f") };
        __classPrivateFieldSet(this, _Decoder_scopes, [], "f");
        __classPrivateFieldSet(this, _Decoder_ranges, [], "f");
        __classPrivateFieldSet(this, _Decoder_flatOriginalScopes, [], "f");
        return info;
    }
}
_Decoder_encodedScopes = new WeakMap(), _Decoder_names = new WeakMap(), _Decoder_mode = new WeakMap(), _Decoder_scopes = new WeakMap(), _Decoder_ranges = new WeakMap(), _Decoder_scopeState = new WeakMap(), _Decoder_rangeState = new WeakMap(), _Decoder_scopeStack = new WeakMap(), _Decoder_rangeStack = new WeakMap(), _Decoder_flatOriginalScopes = new WeakMap(), _Decoder_subRangeBindingsForRange = new WeakMap(), _Decoder_instances = new WeakSet(), _Decoder_throwInStrictMode = function _Decoder_throwInStrictMode(message) {
    if (__classPrivateFieldGet(this, _Decoder_mode, "f") === 1 /* DecodeMode.STRICT */)
        throw new Error(message);
}, _Decoder_handleOriginalScopeStartItem = function _Decoder_handleOriginalScopeStartItem(item) {
    __classPrivateFieldGet(this, _Decoder_scopeState, "f").line += item.line;
    if (item.line === 0) {
        __classPrivateFieldGet(this, _Decoder_scopeState, "f").column += item.column;
    }
    else {
        __classPrivateFieldGet(this, _Decoder_scopeState, "f").column = item.column;
    }
    const scope = {
        start: { line: __classPrivateFieldGet(this, _Decoder_scopeState, "f").line, column: __classPrivateFieldGet(this, _Decoder_scopeState, "f").column },
        end: { line: __classPrivateFieldGet(this, _Decoder_scopeState, "f").line, column: __classPrivateFieldGet(this, _Decoder_scopeState, "f").column },
        isStackFrame: false,
        variables: [],
        children: [],
    };
    if (item.nameIdx !== undefined) {
        __classPrivateFieldGet(this, _Decoder_scopeState, "f").name += item.nameIdx;
        scope.name = __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_resolveName).call(this, __classPrivateFieldGet(this, _Decoder_scopeState, "f").name);
    }
    if (item.kindIdx !== undefined) {
        __classPrivateFieldGet(this, _Decoder_scopeState, "f").kind += item.kindIdx;
        scope.kind = __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_resolveName).call(this, __classPrivateFieldGet(this, _Decoder_scopeState, "f").kind);
    }
    scope.isStackFrame = Boolean(item.flags & 4 /* OriginalScopeFlags.IS_STACK_FRAME */);
    __classPrivateFieldGet(this, _Decoder_scopeStack, "f").push(scope);
    __classPrivateFieldGet(this, _Decoder_flatOriginalScopes, "f").push(scope);
}, _Decoder_handleOriginalScopeVariablesItem = function _Decoder_handleOriginalScopeVariablesItem(variableIdxs) {
    const scope = __classPrivateFieldGet(this, _Decoder_scopeStack, "f").at(-1);
    if (!scope) {
        __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_throwInStrictMode).call(this, "Encountered ORIGINAL_SCOPE_VARIABLES without surrounding ORIGINAL_SCOPE_START");
        return;
    }
    for (const variableIdx of variableIdxs) {
        __classPrivateFieldGet(this, _Decoder_scopeState, "f").variable += variableIdx;
        scope.variables.push(__classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_resolveName).call(this, __classPrivateFieldGet(this, _Decoder_scopeState, "f").variable));
    }
}, _Decoder_handleOriginalScopeEndItem = function _Decoder_handleOriginalScopeEndItem(line, column) {
    __classPrivateFieldGet(this, _Decoder_scopeState, "f").line += line;
    if (line === 0) {
        __classPrivateFieldGet(this, _Decoder_scopeState, "f").column += column;
    }
    else {
        __classPrivateFieldGet(this, _Decoder_scopeState, "f").column = column;
    }
    const scope = __classPrivateFieldGet(this, _Decoder_scopeStack, "f").pop();
    if (!scope) {
        __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_throwInStrictMode).call(this, "Encountered ORIGINAL_SCOPE_END without matching ORIGINAL_SCOPE_START!");
        return;
    }
    scope.end = {
        line: __classPrivateFieldGet(this, _Decoder_scopeState, "f").line,
        column: __classPrivateFieldGet(this, _Decoder_scopeState, "f").column,
    };
    if (__classPrivateFieldGet(this, _Decoder_scopeStack, "f").length > 0) {
        const parent = __classPrivateFieldGet(this, _Decoder_scopeStack, "f").at(-1);
        scope.parent = parent;
        parent.children.push(scope);
    }
    else {
        __classPrivateFieldGet(this, _Decoder_scopes, "f").push(scope);
        __classPrivateFieldGet(this, _Decoder_scopeState, "f").line = 0;
        __classPrivateFieldGet(this, _Decoder_scopeState, "f").column = 0;
    }
}, _Decoder_handleGeneratedRangeStartItem = function _Decoder_handleGeneratedRangeStartItem(item) {
    if (item.line !== undefined) {
        __classPrivateFieldGet(this, _Decoder_rangeState, "f").line += item.line;
        __classPrivateFieldGet(this, _Decoder_rangeState, "f").column = item.column;
    }
    else {
        __classPrivateFieldGet(this, _Decoder_rangeState, "f").column += item.column;
    }
    const range = {
        start: {
            line: __classPrivateFieldGet(this, _Decoder_rangeState, "f").line,
            column: __classPrivateFieldGet(this, _Decoder_rangeState, "f").column,
        },
        end: {
            line: __classPrivateFieldGet(this, _Decoder_rangeState, "f").line,
            column: __classPrivateFieldGet(this, _Decoder_rangeState, "f").column,
        },
        isStackFrame: Boolean(item.flags & 4 /* GeneratedRangeFlags.IS_STACK_FRAME */),
        isHidden: Boolean(item.flags & 8 /* GeneratedRangeFlags.IS_HIDDEN */),
        values: [],
        children: [],
    };
    if (item.definitionIdx !== undefined) {
        __classPrivateFieldGet(this, _Decoder_rangeState, "f").defScopeIdx += item.definitionIdx;
        if (__classPrivateFieldGet(this, _Decoder_rangeState, "f").defScopeIdx < 0 ||
            __classPrivateFieldGet(this, _Decoder_rangeState, "f").defScopeIdx >= __classPrivateFieldGet(this, _Decoder_flatOriginalScopes, "f").length) {
            __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_throwInStrictMode).call(this, "Invalid definition scope index");
        }
        else {
            range.originalScope =
                __classPrivateFieldGet(this, _Decoder_flatOriginalScopes, "f")[__classPrivateFieldGet(this, _Decoder_rangeState, "f").defScopeIdx];
        }
    }
    __classPrivateFieldGet(this, _Decoder_rangeStack, "f").push(range);
    __classPrivateFieldGet(this, _Decoder_subRangeBindingsForRange, "f").clear();
}, _Decoder_handleGeneratedRangeBindingsItem = function _Decoder_handleGeneratedRangeBindingsItem(valueIdxs) {
    const range = __classPrivateFieldGet(this, _Decoder_rangeStack, "f").at(-1);
    if (!range) {
        __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_throwInStrictMode).call(this, "Encountered GENERATED_RANGE_BINDINGS without surrounding GENERATED_RANGE_START");
        return;
    }
    for (const valueIdx of valueIdxs) {
        if (valueIdx === 0) {
            range.values.push(null);
        }
        else {
            range.values.push(__classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_resolveName).call(this, valueIdx - 1));
        }
    }
}, _Decoder_recordGeneratedSubRangeBindingItem = function _Decoder_recordGeneratedSubRangeBindingItem(variableIndex, bindings) {
    if (__classPrivateFieldGet(this, _Decoder_subRangeBindingsForRange, "f").has(variableIndex)) {
        __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_throwInStrictMode).call(this, "Encountered multiple GENERATED_RANGE_SUBRANGE_BINDING items for the same variable");
        return;
    }
    __classPrivateFieldGet(this, _Decoder_subRangeBindingsForRange, "f").set(variableIndex, bindings);
}, _Decoder_handleGeneratedRangeCallSite = function _Decoder_handleGeneratedRangeCallSite(sourceIndex, line, column) {
    const range = __classPrivateFieldGet(this, _Decoder_rangeStack, "f").at(-1);
    if (!range) {
        __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_throwInStrictMode).call(this, "Encountered GENERATED_RANGE_CALL_SITE without surrounding GENERATED_RANGE_START");
        return;
    }
    range.callSite = {
        sourceIndex,
        line,
        column,
    };
}, _Decoder_handleGeneratedRangeEndItem = function _Decoder_handleGeneratedRangeEndItem(line, column) {
    if (line !== 0) {
        __classPrivateFieldGet(this, _Decoder_rangeState, "f").line += line;
        __classPrivateFieldGet(this, _Decoder_rangeState, "f").column = column;
    }
    else {
        __classPrivateFieldGet(this, _Decoder_rangeState, "f").column += column;
    }
    const range = __classPrivateFieldGet(this, _Decoder_rangeStack, "f").pop();
    if (!range) {
        __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_throwInStrictMode).call(this, "Encountered GENERATED_RANGE_END without matching GENERATED_RANGE_START!");
        return;
    }
    range.end = {
        line: __classPrivateFieldGet(this, _Decoder_rangeState, "f").line,
        column: __classPrivateFieldGet(this, _Decoder_rangeState, "f").column,
    };
    __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_handleGeneratedRangeSubRangeBindings).call(this, range);
    if (__classPrivateFieldGet(this, _Decoder_rangeStack, "f").length > 0) {
        const parent = __classPrivateFieldGet(this, _Decoder_rangeStack, "f").at(-1);
        range.parent = parent;
        parent.children.push(range);
    }
    else {
        __classPrivateFieldGet(this, _Decoder_ranges, "f").push(range);
    }
}, _Decoder_handleGeneratedRangeSubRangeBindings = function _Decoder_handleGeneratedRangeSubRangeBindings(range) {
    for (const [variableIndex, bindings] of __classPrivateFieldGet(this, _Decoder_subRangeBindingsForRange, "f")) {
        const value = range.values[variableIndex];
        const subRanges = [];
        range.values[variableIndex] = subRanges;
        let lastLine = range.start.line;
        let lastColumn = range.start.column;
        subRanges.push({
            from: { line: lastLine, column: lastColumn },
            to: { line: 0, column: 0 },
            value: value,
        });
        for (const [binding, line, column] of bindings) {
            lastLine += line;
            if (line === 0) {
                lastColumn += column;
            }
            else {
                lastColumn = column;
            }
            subRanges.push({
                from: { line: lastLine, column: lastColumn },
                to: { line: 0, column: 0 }, // This will be fixed in the post-processing step.
                value: binding === 0 ? undefined : __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_resolveName).call(this, binding - 1),
            });
        }
    }
    for (const value of range.values) {
        if (Array.isArray(value)) {
            const subRanges = value;
            for (let i = 0; i < subRanges.length - 1; ++i) {
                subRanges[i].to = subRanges[i + 1].from;
            }
            subRanges[subRanges.length - 1].to = range.end;
        }
    }
}, _Decoder_resolveName = function _Decoder_resolveName(index) {
    if (index < 0 || index >= __classPrivateFieldGet(this, _Decoder_names, "f").length) {
        __classPrivateFieldGet(this, _Decoder_instances, "m", _Decoder_throwInStrictMode).call(this, "Illegal index into the 'names' array");
    }
    return __classPrivateFieldGet(this, _Decoder_names, "f")[index] ?? "";
};
//# sourceMappingURL=decode.js.map