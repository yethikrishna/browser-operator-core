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
var _ExtensionView_server, _ExtensionView_id, _ExtensionView_src, _ExtensionView_className, _ExtensionView_iframe, _ExtensionView_frameIndex, _ExtensionView_view;
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
const { render, html, Directives: { ref } } = Lit;
const DEFAULT_VIEW = (input, output, target) => {
    // clang-format off
    render(html `<iframe
    ${ref(element => { output.iframe = element; })}
    src=${input.src}
    class=${input.className}
    @load=${input.onLoad}></iframe>`, target, { host: input });
    // clang-format on
};
export class ExtensionView extends UI.Widget.Widget {
    constructor(server, id, src, className, view = DEFAULT_VIEW) {
        super();
        _ExtensionView_server.set(this, void 0);
        _ExtensionView_id.set(this, void 0);
        _ExtensionView_src.set(this, void 0);
        _ExtensionView_className.set(this, void 0);
        _ExtensionView_iframe.set(this, void 0);
        _ExtensionView_frameIndex.set(this, void 0);
        _ExtensionView_view.set(this, void 0);
        __classPrivateFieldSet(this, _ExtensionView_view, view, "f");
        __classPrivateFieldSet(this, _ExtensionView_server, server, "f");
        __classPrivateFieldSet(this, _ExtensionView_src, src, "f");
        __classPrivateFieldSet(this, _ExtensionView_className, className, "f");
        __classPrivateFieldSet(this, _ExtensionView_id, id, "f");
        this.setHideOnDetach(); // Override
        void this.performUpdate();
    }
    performUpdate() {
        const output = {};
        __classPrivateFieldGet(this, _ExtensionView_view, "f").call(this, {
            src: __classPrivateFieldGet(this, _ExtensionView_src, "f"),
            className: __classPrivateFieldGet(this, _ExtensionView_className, "f"),
            onLoad: this.onLoad.bind(this),
        }, output, this.element);
        if (output.iframe) {
            __classPrivateFieldSet(this, _ExtensionView_iframe, output.iframe, "f");
        }
    }
    wasShown() {
        super.wasShown();
        if (typeof __classPrivateFieldGet(this, _ExtensionView_frameIndex, "f") === 'number') {
            __classPrivateFieldGet(this, _ExtensionView_server, "f").notifyViewShown(__classPrivateFieldGet(this, _ExtensionView_id, "f"), __classPrivateFieldGet(this, _ExtensionView_frameIndex, "f"));
        }
    }
    willHide() {
        if (typeof __classPrivateFieldGet(this, _ExtensionView_frameIndex, "f") === 'number') {
            __classPrivateFieldGet(this, _ExtensionView_server, "f").notifyViewHidden(__classPrivateFieldGet(this, _ExtensionView_id, "f"));
        }
    }
    onLoad() {
        if (!__classPrivateFieldGet(this, _ExtensionView_iframe, "f")) {
            return;
        }
        const frames = window.frames;
        __classPrivateFieldSet(this, _ExtensionView_frameIndex, Array.prototype.indexOf.call(frames, __classPrivateFieldGet(this, _ExtensionView_iframe, "f").contentWindow), "f");
        if (this.isShowing()) {
            __classPrivateFieldGet(this, _ExtensionView_server, "f").notifyViewShown(__classPrivateFieldGet(this, _ExtensionView_id, "f"), __classPrivateFieldGet(this, _ExtensionView_frameIndex, "f"));
        }
    }
}
_ExtensionView_server = new WeakMap(), _ExtensionView_id = new WeakMap(), _ExtensionView_src = new WeakMap(), _ExtensionView_className = new WeakMap(), _ExtensionView_iframe = new WeakMap(), _ExtensionView_frameIndex = new WeakMap(), _ExtensionView_view = new WeakMap();
export class ExtensionNotifierView extends UI.Widget.VBox {
    constructor(server, id) {
        super();
        this.server = server;
        this.id = id;
    }
    wasShown() {
        this.server.notifyViewShown(this.id);
    }
    willHide() {
        this.server.notifyViewHidden(this.id);
    }
}
//# sourceMappingURL=ExtensionView.js.map