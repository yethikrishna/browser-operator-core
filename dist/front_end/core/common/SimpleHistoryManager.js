/*
 * Copyright (C) 2014 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
var _SimpleHistoryManager_entries, _SimpleHistoryManager_activeEntryIndex, _SimpleHistoryManager_coalescingReadonly, _SimpleHistoryManager_historyDepth;
export class SimpleHistoryManager {
    constructor(historyDepth) {
        _SimpleHistoryManager_entries.set(this, void 0);
        _SimpleHistoryManager_activeEntryIndex.set(this, void 0);
        _SimpleHistoryManager_coalescingReadonly.set(this, void 0);
        _SimpleHistoryManager_historyDepth.set(this, void 0);
        __classPrivateFieldSet(this, _SimpleHistoryManager_entries, [], "f");
        __classPrivateFieldSet(this, _SimpleHistoryManager_activeEntryIndex, -1, "f");
        // Lock is used to make sure that reveal() does not
        // make any changes to the history while we are
        // rolling back or rolling over.
        __classPrivateFieldSet(this, _SimpleHistoryManager_coalescingReadonly, 0, "f");
        __classPrivateFieldSet(this, _SimpleHistoryManager_historyDepth, historyDepth, "f");
    }
    readOnlyLock() {
        var _a;
        __classPrivateFieldSet(this, _SimpleHistoryManager_coalescingReadonly, (_a = __classPrivateFieldGet(this, _SimpleHistoryManager_coalescingReadonly, "f"), ++_a), "f");
    }
    releaseReadOnlyLock() {
        var _a;
        __classPrivateFieldSet(this, _SimpleHistoryManager_coalescingReadonly, (_a = __classPrivateFieldGet(this, _SimpleHistoryManager_coalescingReadonly, "f"), --_a), "f");
    }
    getPreviousValidIndex() {
        if (this.empty()) {
            return -1;
        }
        let revealIndex = __classPrivateFieldGet(this, _SimpleHistoryManager_activeEntryIndex, "f") - 1;
        while (revealIndex >= 0 && !__classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f")[revealIndex].valid()) {
            --revealIndex;
        }
        if (revealIndex < 0) {
            return -1;
        }
        return revealIndex;
    }
    getNextValidIndex() {
        let revealIndex = __classPrivateFieldGet(this, _SimpleHistoryManager_activeEntryIndex, "f") + 1;
        while (revealIndex < __classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f").length && !__classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f")[revealIndex].valid()) {
            ++revealIndex;
        }
        if (revealIndex >= __classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f").length) {
            return -1;
        }
        return revealIndex;
    }
    readOnly() {
        return Boolean(__classPrivateFieldGet(this, _SimpleHistoryManager_coalescingReadonly, "f"));
    }
    empty() {
        return !__classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f").length;
    }
    active() {
        return this.empty() ? null : __classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f")[__classPrivateFieldGet(this, _SimpleHistoryManager_activeEntryIndex, "f")];
    }
    push(entry) {
        if (this.readOnly()) {
            return;
        }
        if (!this.empty()) {
            __classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f").splice(__classPrivateFieldGet(this, _SimpleHistoryManager_activeEntryIndex, "f") + 1);
        }
        __classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f").push(entry);
        if (__classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f").length > __classPrivateFieldGet(this, _SimpleHistoryManager_historyDepth, "f")) {
            __classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f").shift();
        }
        __classPrivateFieldSet(this, _SimpleHistoryManager_activeEntryIndex, __classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f").length - 1, "f");
    }
    canRollback() {
        return this.getPreviousValidIndex() >= 0;
    }
    canRollover() {
        return this.getNextValidIndex() >= 0;
    }
    rollback() {
        const revealIndex = this.getPreviousValidIndex();
        if (revealIndex === -1) {
            return false;
        }
        this.readOnlyLock();
        __classPrivateFieldSet(this, _SimpleHistoryManager_activeEntryIndex, revealIndex, "f");
        __classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f")[revealIndex].reveal();
        this.releaseReadOnlyLock();
        return true;
    }
    rollover() {
        const revealIndex = this.getNextValidIndex();
        if (revealIndex === -1) {
            return false;
        }
        this.readOnlyLock();
        __classPrivateFieldSet(this, _SimpleHistoryManager_activeEntryIndex, revealIndex, "f");
        __classPrivateFieldGet(this, _SimpleHistoryManager_entries, "f")[revealIndex].reveal();
        this.releaseReadOnlyLock();
        return true;
    }
}
_SimpleHistoryManager_entries = new WeakMap(), _SimpleHistoryManager_activeEntryIndex = new WeakMap(), _SimpleHistoryManager_coalescingReadonly = new WeakMap(), _SimpleHistoryManager_historyDepth = new WeakMap();
//# sourceMappingURL=SimpleHistoryManager.js.map