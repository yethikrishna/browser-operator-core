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
var _Encoder_instances, _Encoder_info, _Encoder_names, _Encoder_namesToIndex, _Encoder_scopeState, _Encoder_rangeState, _Encoder_encodedItems, _Encoder_currentItem, _Encoder_scopeToCount, _Encoder_scopeCounter, _Encoder_encodeOriginalScope, _Encoder_encodeOriginalScopeStart, _Encoder_encodeOriginalScopeVariables, _Encoder_encodeOriginalScopeEnd, _Encoder_encodeGeneratedRange, _Encoder_encodeGeneratedRangeStart, _Encoder_encodeGeneratedRangeSubRangeBindings, _Encoder_encodeGeneratedRangeBindings, _Encoder_encodeGeneratedRangeCallSite, _Encoder_encodeGeneratedRangeEnd, _Encoder_resolveNamesIdx, _Encoder_verifyPositionWithScopeState, _Encoder_verifyPositionWithRangeState, _Encoder_encodeTag, _Encoder_encodeSigned, _Encoder_encodeUnsigned, _Encoder_finishItem;
import { encodeSigned, encodeUnsigned } from "../vlq.js";
import { comparePositions } from "../util.js";
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
export class Encoder {
    constructor(info, names) {
        _Encoder_instances.add(this);
        _Encoder_info.set(this, void 0);
        _Encoder_names.set(this, void 0);
        // Hash map to resolve indices of strings in the "names" array. Otherwise we'd have
        // to use 'indexOf' for every name we want to encode.
        _Encoder_namesToIndex.set(this, new Map());
        _Encoder_scopeState.set(this, { ...DEFAULT_SCOPE_STATE });
        _Encoder_rangeState.set(this, { ...DEFAULT_RANGE_STATE });
        _Encoder_encodedItems.set(this, []);
        _Encoder_currentItem.set(this, "");
        _Encoder_scopeToCount.set(this, new Map());
        _Encoder_scopeCounter.set(this, 0);
        __classPrivateFieldSet(this, _Encoder_info, info, "f");
        __classPrivateFieldSet(this, _Encoder_names, names, "f");
        for (let i = 0; i < names.length; ++i) {
            __classPrivateFieldGet(this, _Encoder_namesToIndex, "f").set(names[i], i);
        }
    }
    encode() {
        __classPrivateFieldSet(this, _Encoder_encodedItems, [], "f");
        __classPrivateFieldGet(this, _Encoder_info, "f").scopes.forEach((scope) => {
            __classPrivateFieldGet(this, _Encoder_scopeState, "f").line = 0;
            __classPrivateFieldGet(this, _Encoder_scopeState, "f").column = 0;
            __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeOriginalScope).call(this, scope);
        });
        __classPrivateFieldGet(this, _Encoder_info, "f").ranges.forEach((range) => {
            __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeGeneratedRange).call(this, range);
        });
        return __classPrivateFieldGet(this, _Encoder_encodedItems, "f").join(",");
    }
}
_Encoder_info = new WeakMap(), _Encoder_names = new WeakMap(), _Encoder_namesToIndex = new WeakMap(), _Encoder_scopeState = new WeakMap(), _Encoder_rangeState = new WeakMap(), _Encoder_encodedItems = new WeakMap(), _Encoder_currentItem = new WeakMap(), _Encoder_scopeToCount = new WeakMap(), _Encoder_scopeCounter = new WeakMap(), _Encoder_instances = new WeakSet(), _Encoder_encodeOriginalScope = function _Encoder_encodeOriginalScope(scope) {
    if (scope === null) {
        __classPrivateFieldGet(this, _Encoder_encodedItems, "f").push("");
        return;
    }
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeOriginalScopeStart).call(this, scope);
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeOriginalScopeVariables).call(this, scope);
    scope.children.forEach((child) => __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeOriginalScope).call(this, child));
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeOriginalScopeEnd).call(this, scope);
}, _Encoder_encodeOriginalScopeStart = function _Encoder_encodeOriginalScopeStart(scope) {
    var _a, _b, _c, _d, _e;
    const { line, column } = scope.start;
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_verifyPositionWithScopeState).call(this, line, column);
    let flags = 0;
    const encodedLine = line - __classPrivateFieldGet(this, _Encoder_scopeState, "f").line;
    const encodedColumn = encodedLine === 0
        ? column - __classPrivateFieldGet(this, _Encoder_scopeState, "f").column
        : column;
    __classPrivateFieldGet(this, _Encoder_scopeState, "f").line = line;
    __classPrivateFieldGet(this, _Encoder_scopeState, "f").column = column;
    let encodedName;
    if (scope.name !== undefined) {
        flags |= 1 /* OriginalScopeFlags.HAS_NAME */;
        const nameIdx = __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_resolveNamesIdx).call(this, scope.name);
        encodedName = nameIdx - __classPrivateFieldGet(this, _Encoder_scopeState, "f").name;
        __classPrivateFieldGet(this, _Encoder_scopeState, "f").name = nameIdx;
    }
    let encodedKind;
    if (scope.kind !== undefined) {
        flags |= 2 /* OriginalScopeFlags.HAS_KIND */;
        const kindIdx = __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_resolveNamesIdx).call(this, scope.kind);
        encodedKind = kindIdx - __classPrivateFieldGet(this, _Encoder_scopeState, "f").kind;
        __classPrivateFieldGet(this, _Encoder_scopeState, "f").kind = kindIdx;
    }
    if (scope.isStackFrame)
        flags |= 4 /* OriginalScopeFlags.IS_STACK_FRAME */;
    __classPrivateFieldGet((_a = __classPrivateFieldGet((_b = __classPrivateFieldGet((_c = __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeTag).call(this, "B" /* EncodedTag.ORIGINAL_SCOPE_START */)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_c, flags)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_b, encodedLine)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_a, encodedColumn);
    if (encodedName !== undefined)
        __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeSigned).call(this, encodedName);
    if (encodedKind !== undefined)
        __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeSigned).call(this, encodedKind);
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_finishItem).call(this);
    __classPrivateFieldGet(this, _Encoder_scopeToCount, "f").set(scope, (__classPrivateFieldSet(this, _Encoder_scopeCounter, (_e = __classPrivateFieldGet(this, _Encoder_scopeCounter, "f"), _d = _e++, _e), "f"), _d));
}, _Encoder_encodeOriginalScopeVariables = function _Encoder_encodeOriginalScopeVariables(scope) {
    if (scope.variables.length === 0)
        return;
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeTag).call(this, "D" /* EncodedTag.ORIGINAL_SCOPE_VARIABLES */);
    for (const variable of scope.variables) {
        const idx = __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_resolveNamesIdx).call(this, variable);
        __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeSigned).call(this, idx - __classPrivateFieldGet(this, _Encoder_scopeState, "f").variable);
        __classPrivateFieldGet(this, _Encoder_scopeState, "f").variable = idx;
    }
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_finishItem).call(this);
}, _Encoder_encodeOriginalScopeEnd = function _Encoder_encodeOriginalScopeEnd(scope) {
    var _a, _b, _c;
    const { line, column } = scope.end;
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_verifyPositionWithScopeState).call(this, line, column);
    const encodedLine = line - __classPrivateFieldGet(this, _Encoder_scopeState, "f").line;
    const encodedColumn = encodedLine === 0
        ? column - __classPrivateFieldGet(this, _Encoder_scopeState, "f").column
        : column;
    __classPrivateFieldGet(this, _Encoder_scopeState, "f").line = line;
    __classPrivateFieldGet(this, _Encoder_scopeState, "f").column = column;
    __classPrivateFieldGet((_a = __classPrivateFieldGet((_b = __classPrivateFieldGet((_c = __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeTag).call(this, "C" /* EncodedTag.ORIGINAL_SCOPE_END */)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_c, encodedLine)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_b, encodedColumn)), _Encoder_instances, "m", _Encoder_finishItem).call(_a);
}, _Encoder_encodeGeneratedRange = function _Encoder_encodeGeneratedRange(range) {
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeGeneratedRangeStart).call(this, range);
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeGeneratedRangeBindings).call(this, range);
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeGeneratedRangeSubRangeBindings).call(this, range);
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeGeneratedRangeCallSite).call(this, range);
    range.children.forEach((child) => __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeGeneratedRange).call(this, child));
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeGeneratedRangeEnd).call(this, range);
}, _Encoder_encodeGeneratedRangeStart = function _Encoder_encodeGeneratedRangeStart(range) {
    var _a;
    const { line, column } = range.start;
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_verifyPositionWithRangeState).call(this, line, column);
    let flags = 0;
    const encodedLine = line - __classPrivateFieldGet(this, _Encoder_rangeState, "f").line;
    let encodedColumn = column - __classPrivateFieldGet(this, _Encoder_rangeState, "f").column;
    if (encodedLine > 0) {
        flags |= 1 /* GeneratedRangeFlags.HAS_LINE */;
        encodedColumn = column;
    }
    __classPrivateFieldGet(this, _Encoder_rangeState, "f").line = line;
    __classPrivateFieldGet(this, _Encoder_rangeState, "f").column = column;
    let encodedDefinition;
    if (range.originalScope) {
        const definitionIdx = __classPrivateFieldGet(this, _Encoder_scopeToCount, "f").get(range.originalScope);
        if (definitionIdx === undefined) {
            throw new Error("Unknown OriginalScope for definition!");
        }
        flags |= 2 /* GeneratedRangeFlags.HAS_DEFINITION */;
        encodedDefinition = definitionIdx - __classPrivateFieldGet(this, _Encoder_rangeState, "f").defScopeIdx;
        __classPrivateFieldGet(this, _Encoder_rangeState, "f").defScopeIdx = definitionIdx;
    }
    if (range.isStackFrame)
        flags |= 4 /* GeneratedRangeFlags.IS_STACK_FRAME */;
    if (range.isHidden)
        flags |= 8 /* GeneratedRangeFlags.IS_HIDDEN */;
    __classPrivateFieldGet((_a = __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeTag).call(this, "E" /* EncodedTag.GENERATED_RANGE_START */)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_a, flags);
    if (encodedLine > 0)
        __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeUnsigned).call(this, encodedLine);
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeUnsigned).call(this, encodedColumn);
    if (encodedDefinition !== undefined)
        __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeSigned).call(this, encodedDefinition);
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_finishItem).call(this);
}, _Encoder_encodeGeneratedRangeSubRangeBindings = function _Encoder_encodeGeneratedRangeSubRangeBindings(range) {
    var _a, _b, _c;
    if (range.values.length === 0)
        return;
    for (let i = 0; i < range.values.length; ++i) {
        const value = range.values[i];
        if (!Array.isArray(value) || value.length <= 1) {
            continue;
        }
        __classPrivateFieldGet((_a = __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeTag).call(this, "H" /* EncodedTag.GENERATED_RANGE_SUBRANGE_BINDING */)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_a, i);
        let lastLine = range.start.line;
        let lastColumn = range.start.column;
        for (let j = 1; j < value.length; ++j) {
            const subRange = value[j];
            const prevSubRange = value[j - 1];
            if (comparePositions(prevSubRange.to, subRange.from) !== 0) {
                throw new Error("Sub-range bindings must not have gaps");
            }
            const encodedLine = subRange.from.line - lastLine;
            const encodedColumn = encodedLine === 0
                ? subRange.from.column - lastColumn
                : subRange.from.column;
            if (encodedLine < 0 || encodedColumn < 0) {
                throw new Error("Sub-range bindings must be sorted");
            }
            lastLine = subRange.from.line;
            lastColumn = subRange.from.column;
            const binding = subRange.value === undefined
                ? 0
                : __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_resolveNamesIdx).call(this, subRange.value) + 1;
            __classPrivateFieldGet((_b = __classPrivateFieldGet((_c = __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeUnsigned).call(this, binding)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_c, encodedLine)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_b, encodedColumn);
        }
        __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_finishItem).call(this);
    }
}, _Encoder_encodeGeneratedRangeBindings = function _Encoder_encodeGeneratedRangeBindings(range) {
    if (range.values.length === 0)
        return;
    if (!range.originalScope) {
        throw new Error("Range has binding expressions but no OriginalScope");
    }
    else if (range.originalScope.variables.length !== range.values.length) {
        throw new Error("Range's binding expressions don't match OriginalScopes' variables");
    }
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeTag).call(this, "G" /* EncodedTag.GENERATED_RANGE_BINDINGS */);
    for (const val of range.values) {
        if (val === null || val === undefined) {
            __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeUnsigned).call(this, 0);
        }
        else if (typeof val === "string") {
            __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeUnsigned).call(this, __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_resolveNamesIdx).call(this, val) + 1);
        }
        else {
            const initialValue = val[0];
            const binding = initialValue.value === undefined
                ? 0
                : __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_resolveNamesIdx).call(this, initialValue.value) + 1;
            __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeUnsigned).call(this, binding);
        }
    }
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_finishItem).call(this);
}, _Encoder_encodeGeneratedRangeCallSite = function _Encoder_encodeGeneratedRangeCallSite(range) {
    var _a, _b, _c, _d;
    if (!range.callSite)
        return;
    const { sourceIndex, line, column } = range.callSite;
    // TODO: Throw if stackFrame flag is set or OriginalScope index is invalid or no generated range is here.
    __classPrivateFieldGet((_a = __classPrivateFieldGet((_b = __classPrivateFieldGet((_c = __classPrivateFieldGet((_d = __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeTag).call(this, "I" /* EncodedTag.GENERATED_RANGE_CALL_SITE */)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_d, sourceIndex)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_c, line)), _Encoder_instances, "m", _Encoder_encodeUnsigned).call(_b, column)), _Encoder_instances, "m", _Encoder_finishItem).call(_a);
}, _Encoder_encodeGeneratedRangeEnd = function _Encoder_encodeGeneratedRangeEnd(range) {
    var _a;
    const { line, column } = range.end;
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_verifyPositionWithRangeState).call(this, line, column);
    let flags = 0;
    const encodedLine = line - __classPrivateFieldGet(this, _Encoder_rangeState, "f").line;
    let encodedColumn = column - __classPrivateFieldGet(this, _Encoder_rangeState, "f").column;
    if (encodedLine > 0) {
        flags |= 1 /* GeneratedRangeFlags.HAS_LINE */;
        encodedColumn = column;
    }
    __classPrivateFieldGet(this, _Encoder_rangeState, "f").line = line;
    __classPrivateFieldGet(this, _Encoder_rangeState, "f").column = column;
    __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeTag).call(this, "F" /* EncodedTag.GENERATED_RANGE_END */);
    if (encodedLine > 0)
        __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeUnsigned).call(this, encodedLine);
    __classPrivateFieldGet((_a = __classPrivateFieldGet(this, _Encoder_instances, "m", _Encoder_encodeUnsigned).call(this, encodedColumn)), _Encoder_instances, "m", _Encoder_finishItem).call(_a);
}, _Encoder_resolveNamesIdx = function _Encoder_resolveNamesIdx(name) {
    const index = __classPrivateFieldGet(this, _Encoder_namesToIndex, "f").get(name);
    if (index !== undefined)
        return index;
    const addedIndex = __classPrivateFieldGet(this, _Encoder_names, "f").length;
    __classPrivateFieldGet(this, _Encoder_names, "f").push(name);
    __classPrivateFieldGet(this, _Encoder_namesToIndex, "f").set(name, addedIndex);
    return addedIndex;
}, _Encoder_verifyPositionWithScopeState = function _Encoder_verifyPositionWithScopeState(line, column) {
    if (__classPrivateFieldGet(this, _Encoder_scopeState, "f").line > line ||
        (__classPrivateFieldGet(this, _Encoder_scopeState, "f").line === line && __classPrivateFieldGet(this, _Encoder_scopeState, "f").column > column)) {
        throw new Error(`Attempting to encode scope item (${line}, ${column}) that precedes the last encoded scope item (${__classPrivateFieldGet(this, _Encoder_scopeState, "f").line}, ${__classPrivateFieldGet(this, _Encoder_scopeState, "f").column})`);
    }
}, _Encoder_verifyPositionWithRangeState = function _Encoder_verifyPositionWithRangeState(line, column) {
    if (__classPrivateFieldGet(this, _Encoder_rangeState, "f").line > line ||
        (__classPrivateFieldGet(this, _Encoder_rangeState, "f").line === line && __classPrivateFieldGet(this, _Encoder_rangeState, "f").column > column)) {
        throw new Error(`Attempting to encode range item that precedes the last encoded range item (${line}, ${column})`);
    }
}, _Encoder_encodeTag = function _Encoder_encodeTag(tag) {
    __classPrivateFieldSet(this, _Encoder_currentItem, __classPrivateFieldGet(this, _Encoder_currentItem, "f") + tag, "f");
    return this;
}, _Encoder_encodeSigned = function _Encoder_encodeSigned(n) {
    __classPrivateFieldSet(this, _Encoder_currentItem, __classPrivateFieldGet(this, _Encoder_currentItem, "f") + encodeSigned(n), "f");
    return this;
}, _Encoder_encodeUnsigned = function _Encoder_encodeUnsigned(n) {
    __classPrivateFieldSet(this, _Encoder_currentItem, __classPrivateFieldGet(this, _Encoder_currentItem, "f") + encodeUnsigned(n), "f");
    return this;
}, _Encoder_finishItem = function _Encoder_finishItem() {
    __classPrivateFieldGet(this, _Encoder_encodedItems, "f").push(__classPrivateFieldGet(this, _Encoder_currentItem, "f"));
    __classPrivateFieldSet(this, _Encoder_currentItem, "", "f");
};
//# sourceMappingURL=encoder.js.map