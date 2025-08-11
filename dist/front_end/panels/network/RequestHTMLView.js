/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
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
var _RequestHTMLView_dataURL, _RequestHTMLView_view;
import * as UI from '../../ui/legacy/legacy.js';
import { html, nothing, render } from '../../ui/lit/lit.js';
import requestHTMLViewStyles from './requestHTMLView.css.js';
export const DEFAULT_VIEW = (input, _output, target) => {
    // Forbid to run JavaScript and set unique origin.
    // clang-format off
    render(html `
    <style>${requestHTMLViewStyles}</style>
    <div class="html request-view widget vbox">
      ${input.dataURL ? html `
        <!-- @ts-ignore -->
        <iframe class="html-preview-frame" sandbox
          csp="default-src 'none';img-src data:;style-src 'unsafe-inline'" src=${input.dataURL}
          tabindex="-1" role="presentation"></iframe>` : nothing}
    </div>`, target, { host: input });
    // clang-format on
};
export class RequestHTMLView extends UI.Widget.VBox {
    constructor(dataURL, view = DEFAULT_VIEW) {
        super(true);
        _RequestHTMLView_dataURL.set(this, void 0);
        _RequestHTMLView_view.set(this, void 0);
        __classPrivateFieldSet(this, _RequestHTMLView_dataURL, dataURL, "f");
        __classPrivateFieldSet(this, _RequestHTMLView_view, view, "f");
    }
    static create(contentData) {
        const dataURL = contentData.asDataUrl();
        return dataURL ? new RequestHTMLView(dataURL) : null;
    }
    wasShown() {
        super.wasShown();
        this.requestUpdate();
    }
    willHide() {
        this.requestUpdate();
    }
    performUpdate() {
        __classPrivateFieldGet(this, _RequestHTMLView_view, "f").call(this, { dataURL: __classPrivateFieldGet(this, _RequestHTMLView_dataURL, "f") }, {}, this.contentElement);
    }
}
_RequestHTMLView_dataURL = new WeakMap(), _RequestHTMLView_view = new WeakMap();
//# sourceMappingURL=RequestHTMLView.js.map