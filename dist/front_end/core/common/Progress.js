/*
 * Copyright (C) 2012 Google Inc. All rights reserved.
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
var _CompositeProgress_children, _CompositeProgress_childrenDone, _SubProgress_composite, _SubProgress_weight, _SubProgress_worked, _SubProgress_totalWork, _ProgressProxy_delegate, _ProgressProxy_doneCallback;
export class Progress {
    setTotalWork(_totalWork) {
    }
    setTitle(_title) {
    }
    setWorked(_worked, _title) {
    }
    incrementWorked(_worked) {
    }
    done() {
    }
    isCanceled() {
        return false;
    }
}
export class CompositeProgress {
    constructor(parent) {
        _CompositeProgress_children.set(this, void 0);
        _CompositeProgress_childrenDone.set(this, void 0);
        this.parent = parent;
        __classPrivateFieldSet(this, _CompositeProgress_children, [], "f");
        __classPrivateFieldSet(this, _CompositeProgress_childrenDone, 0, "f");
        this.parent.setTotalWork(1);
        this.parent.setWorked(0);
    }
    childDone() {
        var _a;
        if (__classPrivateFieldSet(this, _CompositeProgress_childrenDone, (_a = __classPrivateFieldGet(this, _CompositeProgress_childrenDone, "f"), ++_a), "f") !== __classPrivateFieldGet(this, _CompositeProgress_children, "f").length) {
            return;
        }
        this.parent.done();
    }
    createSubProgress(weight) {
        const child = new SubProgress(this, weight);
        __classPrivateFieldGet(this, _CompositeProgress_children, "f").push(child);
        return child;
    }
    update() {
        let totalWeights = 0;
        let done = 0;
        for (let i = 0; i < __classPrivateFieldGet(this, _CompositeProgress_children, "f").length; ++i) {
            const child = __classPrivateFieldGet(this, _CompositeProgress_children, "f")[i];
            if (child.getTotalWork()) {
                done += child.getWeight() * child.getWorked() / child.getTotalWork();
            }
            totalWeights += child.getWeight();
        }
        this.parent.setWorked(done / totalWeights);
    }
}
_CompositeProgress_children = new WeakMap(), _CompositeProgress_childrenDone = new WeakMap();
export class SubProgress {
    constructor(composite, weight) {
        _SubProgress_composite.set(this, void 0);
        _SubProgress_weight.set(this, void 0);
        _SubProgress_worked.set(this, void 0);
        _SubProgress_totalWork.set(this, void 0);
        __classPrivateFieldSet(this, _SubProgress_composite, composite, "f");
        __classPrivateFieldSet(this, _SubProgress_weight, weight || 1, "f");
        __classPrivateFieldSet(this, _SubProgress_worked, 0, "f");
        __classPrivateFieldSet(this, _SubProgress_totalWork, 0, "f");
    }
    isCanceled() {
        return __classPrivateFieldGet(this, _SubProgress_composite, "f").parent.isCanceled();
    }
    setTitle(title) {
        __classPrivateFieldGet(this, _SubProgress_composite, "f").parent.setTitle(title);
    }
    done() {
        this.setWorked(__classPrivateFieldGet(this, _SubProgress_totalWork, "f"));
        __classPrivateFieldGet(this, _SubProgress_composite, "f").childDone();
    }
    setTotalWork(totalWork) {
        __classPrivateFieldSet(this, _SubProgress_totalWork, totalWork, "f");
        __classPrivateFieldGet(this, _SubProgress_composite, "f").update();
    }
    setWorked(worked, title) {
        __classPrivateFieldSet(this, _SubProgress_worked, worked, "f");
        if (typeof title !== 'undefined') {
            this.setTitle(title);
        }
        __classPrivateFieldGet(this, _SubProgress_composite, "f").update();
    }
    incrementWorked(worked) {
        this.setWorked(__classPrivateFieldGet(this, _SubProgress_worked, "f") + (worked || 1));
    }
    getWeight() {
        return __classPrivateFieldGet(this, _SubProgress_weight, "f");
    }
    getWorked() {
        return __classPrivateFieldGet(this, _SubProgress_worked, "f");
    }
    getTotalWork() {
        return __classPrivateFieldGet(this, _SubProgress_totalWork, "f");
    }
}
_SubProgress_composite = new WeakMap(), _SubProgress_weight = new WeakMap(), _SubProgress_worked = new WeakMap(), _SubProgress_totalWork = new WeakMap();
export class ProgressProxy {
    constructor(delegate, doneCallback) {
        _ProgressProxy_delegate.set(this, void 0);
        _ProgressProxy_doneCallback.set(this, void 0);
        __classPrivateFieldSet(this, _ProgressProxy_delegate, delegate, "f");
        __classPrivateFieldSet(this, _ProgressProxy_doneCallback, doneCallback, "f");
    }
    isCanceled() {
        return __classPrivateFieldGet(this, _ProgressProxy_delegate, "f") ? __classPrivateFieldGet(this, _ProgressProxy_delegate, "f").isCanceled() : false;
    }
    setTitle(title) {
        if (__classPrivateFieldGet(this, _ProgressProxy_delegate, "f")) {
            __classPrivateFieldGet(this, _ProgressProxy_delegate, "f").setTitle(title);
        }
    }
    done() {
        if (__classPrivateFieldGet(this, _ProgressProxy_delegate, "f")) {
            __classPrivateFieldGet(this, _ProgressProxy_delegate, "f").done();
        }
        if (__classPrivateFieldGet(this, _ProgressProxy_doneCallback, "f")) {
            __classPrivateFieldGet(this, _ProgressProxy_doneCallback, "f").call(this);
        }
    }
    setTotalWork(totalWork) {
        if (__classPrivateFieldGet(this, _ProgressProxy_delegate, "f")) {
            __classPrivateFieldGet(this, _ProgressProxy_delegate, "f").setTotalWork(totalWork);
        }
    }
    setWorked(worked, title) {
        if (__classPrivateFieldGet(this, _ProgressProxy_delegate, "f")) {
            __classPrivateFieldGet(this, _ProgressProxy_delegate, "f").setWorked(worked, title);
        }
    }
    incrementWorked(worked) {
        if (__classPrivateFieldGet(this, _ProgressProxy_delegate, "f")) {
            __classPrivateFieldGet(this, _ProgressProxy_delegate, "f").incrementWorked(worked);
        }
    }
}
_ProgressProxy_delegate = new WeakMap(), _ProgressProxy_doneCallback = new WeakMap();
//# sourceMappingURL=Progress.js.map