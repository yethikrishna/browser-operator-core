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
var _SelectorPicker_logger, _SelectorPicker_computer, _SelectorPicker_handleClickEvent;
import { Logger } from './Logger.js';
import { SelectorComputer } from './SelectorComputer.js';
import { getClickableTargetFromEvent, getMouseEventOffsets, haultImmediateEvent } from './util.js';
class SelectorPicker {
    constructor(bindings, customAttribute = '', debug = true) {
        _SelectorPicker_logger.set(this, void 0);
        _SelectorPicker_computer.set(this, void 0);
        _SelectorPicker_handleClickEvent.set(this, (event) => {
            haultImmediateEvent(event);
            const target = getClickableTargetFromEvent(event);
            window.captureSelectors(JSON.stringify({
                selectors: __classPrivateFieldGet(this, _SelectorPicker_computer, "f").getSelectors(target),
                ...getMouseEventOffsets(event, target),
            }));
        });
        this.start = () => {
            __classPrivateFieldGet(this, _SelectorPicker_logger, "f").log('Setting up selector listeners');
            window.addEventListener('click', __classPrivateFieldGet(this, _SelectorPicker_handleClickEvent, "f"), true);
            window.addEventListener('mousedown', haultImmediateEvent, true);
            window.addEventListener('mouseup', haultImmediateEvent, true);
        };
        this.stop = () => {
            __classPrivateFieldGet(this, _SelectorPicker_logger, "f").log('Tearing down selector listeners');
            window.removeEventListener('click', __classPrivateFieldGet(this, _SelectorPicker_handleClickEvent, "f"), true);
            window.removeEventListener('mousedown', haultImmediateEvent, true);
            window.removeEventListener('mouseup', haultImmediateEvent, true);
        };
        __classPrivateFieldSet(this, _SelectorPicker_logger, new Logger(debug ? 'debug' : 'silent'), "f");
        __classPrivateFieldGet(this, _SelectorPicker_logger, "f").log('Creating a SelectorPicker');
        __classPrivateFieldSet(this, _SelectorPicker_computer, new SelectorComputer(bindings, __classPrivateFieldGet(this, _SelectorPicker_logger, "f"), customAttribute), "f");
    }
}
_SelectorPicker_logger = new WeakMap(), _SelectorPicker_computer = new WeakMap(), _SelectorPicker_handleClickEvent = new WeakMap();
export { SelectorPicker };
//# sourceMappingURL=SelectorPicker.js.map