// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _FileSourceIcon_instances, _FileSourceIcon_shadow, _FileSourceIcon_iconType, _FileSourceIcon_contentType, _FileSourceIcon_hasDotBadge, _FileSourceIcon_isDotPurple, _FileSourceIcon_render;
import './IconButton.js';
import { Directives, html, render } from '../../lit/lit.js';
import fileSourceIconStyles from './fileSourceIcon.css.js';
const { classMap } = Directives;
export class FileSourceIcon extends HTMLElement {
    constructor() {
        super(...arguments);
        _FileSourceIcon_instances.add(this);
        _FileSourceIcon_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _FileSourceIcon_iconType.set(this, void 0);
        _FileSourceIcon_contentType.set(this, void 0);
        _FileSourceIcon_hasDotBadge.set(this, void 0);
        _FileSourceIcon_isDotPurple.set(this, void 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _FileSourceIcon_contentType, data.contentType, "f");
        __classPrivateFieldSet(this, _FileSourceIcon_hasDotBadge, data.hasDotBadge, "f");
        __classPrivateFieldSet(this, _FileSourceIcon_isDotPurple, data.isDotPurple, "f");
        __classPrivateFieldSet(this, _FileSourceIcon_iconType, data.iconType, "f");
        __classPrivateFieldGet(this, _FileSourceIcon_instances, "m", _FileSourceIcon_render).call(this);
    }
    get data() {
        return {
            iconType: __classPrivateFieldGet(this, _FileSourceIcon_iconType, "f"),
            contentType: __classPrivateFieldGet(this, _FileSourceIcon_contentType, "f"),
            hasDotBadge: __classPrivateFieldGet(this, _FileSourceIcon_hasDotBadge, "f"),
            isDotPurple: __classPrivateFieldGet(this, _FileSourceIcon_isDotPurple, "f"),
        };
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _FileSourceIcon_instances, "m", _FileSourceIcon_render).call(this);
    }
}
_FileSourceIcon_shadow = new WeakMap(), _FileSourceIcon_iconType = new WeakMap(), _FileSourceIcon_contentType = new WeakMap(), _FileSourceIcon_hasDotBadge = new WeakMap(), _FileSourceIcon_isDotPurple = new WeakMap(), _FileSourceIcon_instances = new WeakSet(), _FileSourceIcon_render = function _FileSourceIcon_render() {
    const iconClasses = classMap({
        dot: Boolean(__classPrivateFieldGet(this, _FileSourceIcon_hasDotBadge, "f")),
        purple: Boolean(__classPrivateFieldGet(this, _FileSourceIcon_hasDotBadge, "f") && __classPrivateFieldGet(this, _FileSourceIcon_isDotPurple, "f")),
        green: Boolean(__classPrivateFieldGet(this, _FileSourceIcon_hasDotBadge, "f") && !__classPrivateFieldGet(this, _FileSourceIcon_isDotPurple, "f")),
        ...(__classPrivateFieldGet(this, _FileSourceIcon_contentType, "f") ? { [__classPrivateFieldGet(this, _FileSourceIcon_contentType, "f")]: __classPrivateFieldGet(this, _FileSourceIcon_contentType, "f") } : null)
    });
    // clang-format off
    render(html `
      <style>${fileSourceIconStyles}</style>
      <devtools-icon .name=${__classPrivateFieldGet(this, _FileSourceIcon_iconType, "f") ?? null} class=${iconClasses}></devtools-icon>`, __classPrivateFieldGet(this, _FileSourceIcon_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-file-source-icon', FileSourceIcon);
//# sourceMappingURL=FileSourceIcon.js.map