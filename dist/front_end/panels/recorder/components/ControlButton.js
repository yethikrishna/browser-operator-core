// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ControlButton_handleClickEvent;
import * as Lit from '../../../ui/lit/lit.js';
import controlButtonStyles from './controlButton.css.js';
const { html, Decorators, LitElement } = Lit;
const { customElement, property } = Decorators;
let ControlButton = class ControlButton extends LitElement {
    constructor() {
        super();
        _ControlButton_handleClickEvent.set(this, (event) => {
            if (this.disabled) {
                event.stopPropagation();
                event.preventDefault();
            }
        });
        this.label = '';
        this.shape = 'square';
        this.disabled = false;
    }
    render() {
        // clang-format off
        return html `
            <style>${controlButtonStyles}</style>
            <button
                @click=${__classPrivateFieldGet(this, _ControlButton_handleClickEvent, "f")}
                .disabled=${this.disabled}
                class="control">
              <div class="icon ${this.shape}"></div>
              <div class="label">${this.label}</div>
            </button>
        `;
        // clang-format on
    }
};
_ControlButton_handleClickEvent = new WeakMap();
__decorate([
    property(),
    __metadata("design:type", String)
], ControlButton.prototype, "label", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], ControlButton.prototype, "shape", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], ControlButton.prototype, "disabled", void 0);
ControlButton = __decorate([
    customElement('devtools-control-button'),
    __metadata("design:paramtypes", [])
], ControlButton);
export { ControlButton };
//# sourceMappingURL=ControlButton.js.map