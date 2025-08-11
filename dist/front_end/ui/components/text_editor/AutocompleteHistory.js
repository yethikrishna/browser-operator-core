// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _AutocompleteHistory_instances, _a, _AutocompleteHistory_historySize, _AutocompleteHistory_setting, _AutocompleteHistory_data, _AutocompleteHistory_historyOffset, _AutocompleteHistory_uncommittedIsTop, _AutocompleteHistory_pushCurrentText, _AutocompleteHistory_currentHistoryItem, _AutocompleteHistory_store;
export class AutocompleteHistory {
    /**
     * Creates a new settings-backed history. The class assumes it has sole
     * ownership of the setting.
     */
    constructor(setting) {
        _AutocompleteHistory_instances.add(this);
        _AutocompleteHistory_setting.set(this, void 0);
        /**
         * The data mirrors the setting. We have the mirror for 2 reasons:
         *   1) The setting is size limited
         *   2) We track the user's current input, even though it's not committed yet.
         */
        _AutocompleteHistory_data.set(this, []);
        /** 1-based entry in the history stack. */
        _AutocompleteHistory_historyOffset.set(this, 1);
        _AutocompleteHistory_uncommittedIsTop.set(this, false);
        __classPrivateFieldSet(this, _AutocompleteHistory_setting, setting, "f");
        __classPrivateFieldSet(this, _AutocompleteHistory_data, __classPrivateFieldGet(this, _AutocompleteHistory_setting, "f").get(), "f");
    }
    clear() {
        __classPrivateFieldSet(this, _AutocompleteHistory_data, [], "f");
        __classPrivateFieldGet(this, _AutocompleteHistory_setting, "f").set([]);
        __classPrivateFieldSet(this, _AutocompleteHistory_historyOffset, 1, "f");
    }
    length() {
        return __classPrivateFieldGet(this, _AutocompleteHistory_data, "f").length;
    }
    /**
     * Pushes a committed text into the history.
     */
    pushHistoryItem(text) {
        if (__classPrivateFieldGet(this, _AutocompleteHistory_uncommittedIsTop, "f")) {
            __classPrivateFieldGet(this, _AutocompleteHistory_data, "f").pop();
            __classPrivateFieldSet(this, _AutocompleteHistory_uncommittedIsTop, false, "f");
        }
        __classPrivateFieldSet(this, _AutocompleteHistory_historyOffset, 1, "f");
        if (text !== __classPrivateFieldGet(this, _AutocompleteHistory_instances, "m", _AutocompleteHistory_currentHistoryItem).call(this)) {
            __classPrivateFieldGet(this, _AutocompleteHistory_data, "f").push(text);
        }
        __classPrivateFieldGet(this, _AutocompleteHistory_instances, "m", _AutocompleteHistory_store).call(this);
    }
    previous(currentText) {
        var _b;
        if (__classPrivateFieldGet(this, _AutocompleteHistory_historyOffset, "f") > __classPrivateFieldGet(this, _AutocompleteHistory_data, "f").length) {
            return undefined;
        }
        if (__classPrivateFieldGet(this, _AutocompleteHistory_historyOffset, "f") === 1) {
            __classPrivateFieldGet(this, _AutocompleteHistory_instances, "m", _AutocompleteHistory_pushCurrentText).call(this, currentText);
        }
        __classPrivateFieldSet(this, _AutocompleteHistory_historyOffset, (_b = __classPrivateFieldGet(this, _AutocompleteHistory_historyOffset, "f"), ++_b), "f");
        return __classPrivateFieldGet(this, _AutocompleteHistory_instances, "m", _AutocompleteHistory_currentHistoryItem).call(this);
    }
    next() {
        var _b;
        if (__classPrivateFieldGet(this, _AutocompleteHistory_historyOffset, "f") === 1) {
            return undefined;
        }
        __classPrivateFieldSet(this, _AutocompleteHistory_historyOffset, (_b = __classPrivateFieldGet(this, _AutocompleteHistory_historyOffset, "f"), --_b), "f");
        return __classPrivateFieldGet(this, _AutocompleteHistory_instances, "m", _AutocompleteHistory_currentHistoryItem).call(this);
    }
    /** Returns a de-duplicated list of history entries that start with the specified prefix */
    matchingEntries(prefix, limit = 50) {
        const result = new Set();
        for (let i = __classPrivateFieldGet(this, _AutocompleteHistory_data, "f").length - 1; i >= 0 && result.size < limit; --i) {
            const entry = __classPrivateFieldGet(this, _AutocompleteHistory_data, "f")[i];
            if (entry.startsWith(prefix)) {
                result.add(entry);
            }
        }
        return result;
    }
}
_a = AutocompleteHistory, _AutocompleteHistory_setting = new WeakMap(), _AutocompleteHistory_data = new WeakMap(), _AutocompleteHistory_historyOffset = new WeakMap(), _AutocompleteHistory_uncommittedIsTop = new WeakMap(), _AutocompleteHistory_instances = new WeakSet(), _AutocompleteHistory_pushCurrentText = function _AutocompleteHistory_pushCurrentText(currentText) {
    if (__classPrivateFieldGet(this, _AutocompleteHistory_uncommittedIsTop, "f")) {
        __classPrivateFieldGet(this, _AutocompleteHistory_data, "f").pop();
    } // Throw away obsolete uncommitted text.
    __classPrivateFieldSet(this, _AutocompleteHistory_uncommittedIsTop, true, "f");
    __classPrivateFieldGet(this, _AutocompleteHistory_data, "f").push(currentText);
}, _AutocompleteHistory_currentHistoryItem = function _AutocompleteHistory_currentHistoryItem() {
    return __classPrivateFieldGet(this, _AutocompleteHistory_data, "f")[__classPrivateFieldGet(this, _AutocompleteHistory_data, "f").length - __classPrivateFieldGet(this, _AutocompleteHistory_historyOffset, "f")];
}, _AutocompleteHistory_store = function _AutocompleteHistory_store() {
    __classPrivateFieldGet(this, _AutocompleteHistory_setting, "f").set(__classPrivateFieldGet(this, _AutocompleteHistory_data, "f").slice(-__classPrivateFieldGet(_a, _a, "f", _AutocompleteHistory_historySize)));
};
_AutocompleteHistory_historySize = { value: 300 };
//# sourceMappingURL=AutocompleteHistory.js.map