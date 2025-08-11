// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
import * as VisualLogging from '../../visual_logging/visual_logging.js';
export class WrappableComponent extends HTMLElement {
    constructor() {
        super(...arguments);
        this.wrapper = null;
    }
    async render() {
    }
    wasShown() {
    }
    willHide() {
    }
}
export function legacyWrapper(base, component, jsLogContext) {
    var _component, _a;
    return new (_a = class extends base {
            constructor(..._args) {
                super(/* useShadowDom=*/ true);
                _component.set(this, void 0);
                __classPrivateFieldSet(this, _component, component, "f");
                __classPrivateFieldGet(this, _component, "f").wrapper = this;
                void __classPrivateFieldGet(this, _component, "f").render();
                this.contentElement.appendChild(__classPrivateFieldGet(this, _component, "f"));
                if (jsLogContext) {
                    this.element.setAttribute('jslog', `${VisualLogging.pane().context(jsLogContext)}`);
                }
            }
            wasShown() {
                __classPrivateFieldGet(this, _component, "f").wasShown();
                void __classPrivateFieldGet(this, _component, "f").render();
            }
            willHide() {
                __classPrivateFieldGet(this, _component, "f").willHide();
            }
            async performUpdate() {
                await __classPrivateFieldGet(this, _component, "f").render();
            }
            getComponent() {
                return __classPrivateFieldGet(this, _component, "f");
            }
        },
        _component = new WeakMap(),
        _a)();
    // clang-format on
}
//# sourceMappingURL=LegacyWrapper.js.map