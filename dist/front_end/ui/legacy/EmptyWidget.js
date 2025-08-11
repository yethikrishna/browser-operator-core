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
var _EmptyWidget_headerElement, _EmptyWidget_textElement, _EmptyWidget_linkElement;
/* eslint-disable rulesdir/no-imperative-dom-api */
import * as i18n from '../../core/i18n/i18n.js';
import * as VisualLogging from '../visual_logging/visual_logging.js';
import emptyWidgetStyles from './emptyWidget.css.js';
import { VBox } from './Widget.js';
import { XLink } from './XLink.js';
const UIStrings = {
    /**
     *@description Text that is usually a hyperlink to more documentation
     */
    learnMore: 'Learn more',
};
const str_ = i18n.i18n.registerUIStrings('ui/legacy/EmptyWidget.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class EmptyWidget extends VBox {
    constructor(headerOrElement, text = '', element) {
        const header = typeof headerOrElement === 'string' ? headerOrElement : '';
        if (!element && headerOrElement instanceof HTMLElement) {
            element = headerOrElement;
        }
        super(undefined, undefined, element);
        _EmptyWidget_headerElement.set(this, void 0);
        _EmptyWidget_textElement.set(this, void 0);
        _EmptyWidget_linkElement.set(this, void 0);
        this.registerRequiredCSS(emptyWidgetStyles);
        this.element.classList.add('empty-view-scroller');
        this.contentElement = this.element.createChild('div', 'empty-state');
        this.contentElement.setAttribute('jslog', `${VisualLogging.section('empty-view')}`);
        __classPrivateFieldSet(this, _EmptyWidget_headerElement, this.contentElement.createChild('div', 'empty-state-header'), "f");
        __classPrivateFieldGet(this, _EmptyWidget_headerElement, "f").textContent = header;
        __classPrivateFieldSet(this, _EmptyWidget_textElement, this.contentElement.createChild('div', 'empty-state-description').createChild('span'), "f");
        __classPrivateFieldGet(this, _EmptyWidget_textElement, "f").textContent = text;
    }
    set link(link) {
        if (__classPrivateFieldGet(this, _EmptyWidget_linkElement, "f")) {
            __classPrivateFieldGet(this, _EmptyWidget_linkElement, "f").remove();
        }
        if (!link) {
            return;
        }
        __classPrivateFieldSet(this, _EmptyWidget_linkElement, XLink.create(link, i18nString(UIStrings.learnMore), undefined, undefined, 'learn-more'), "f");
        __classPrivateFieldGet(this, _EmptyWidget_textElement, "f").insertAdjacentElement('afterend', __classPrivateFieldGet(this, _EmptyWidget_linkElement, "f"));
    }
    set text(text) {
        __classPrivateFieldGet(this, _EmptyWidget_textElement, "f").textContent = text;
    }
    set header(header) {
        __classPrivateFieldGet(this, _EmptyWidget_headerElement, "f").textContent = header;
    }
}
_EmptyWidget_headerElement = new WeakMap(), _EmptyWidget_textElement = new WeakMap(), _EmptyWidget_linkElement = new WeakMap();
//# sourceMappingURL=EmptyWidget.js.map