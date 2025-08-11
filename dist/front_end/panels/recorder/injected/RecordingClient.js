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
var _RecordingClient_computer, _RecordingClient_isTrustedEvent, _RecordingClient_stopShortcuts, _RecordingClient_logger, _RecordingClient_wasStopShortcutPress, _RecordingClient_initialInputTarget, _RecordingClient_setInitialInputTarget, _RecordingClient_onKeyDown, _RecordingClient_onBeforeInput, _RecordingClient_onInput, _RecordingClient_onKeyUp, _RecordingClient_initialPointerTarget, _RecordingClient_setInitialPointerTarget, _RecordingClient_pointerDownTimestamp, _RecordingClient_onPointerDown, _RecordingClient_onClick, _RecordingClient_onBeforeUnload, _RecordingClient_addStep;
import { Logger } from './Logger.js';
import { SelectorComputer } from './SelectorComputer.js';
import { queryCSSSelectorAll } from './selectors/CSSSelector.js';
import { assert, createClickAttributes, getClickableTargetFromEvent, haultImmediateEvent, } from './util.js';
/**
 * Determines whether an element is ignorable as an input.
 *
 * This is only called on input-like elements (elements that emit the `input`
 * event).
 *
 * With every `if` statement, please write a comment above explaining your
 * reasoning for ignoring the event.
 */
const isIgnorableInputElement = (element) => {
    if (element instanceof HTMLInputElement) {
        switch (element.type) {
            // Checkboxes are always changed as a consequence of another type of action
            // such as the keyboard or mouse. As such, we can safely ignore these
            // elements.
            case 'checkbox':
                return true;
            // Radios are always changed as a consequence of another type of action
            // such as the keyboard or mouse. As such, we can safely ignore these
            // elements.
            case 'radio':
                return true;
        }
    }
    return false;
};
const getShortcutLength = (shortcut) => {
    return Object.values(shortcut).filter(key => !!key).length.toString();
};
class RecordingClient {
    constructor(bindings, options = RecordingClient.defaultSetupOptions) {
        _RecordingClient_computer.set(this, void 0);
        _RecordingClient_isTrustedEvent.set(this, (event) => event.isTrusted);
        _RecordingClient_stopShortcuts.set(this, []);
        _RecordingClient_logger.set(this, void 0);
        this.start = () => {
            __classPrivateFieldGet(this, _RecordingClient_logger, "f").log('Setting up recording listeners');
            window.addEventListener('keydown', __classPrivateFieldGet(this, _RecordingClient_onKeyDown, "f"), true);
            window.addEventListener('beforeinput', __classPrivateFieldGet(this, _RecordingClient_onBeforeInput, "f"), true);
            window.addEventListener('input', __classPrivateFieldGet(this, _RecordingClient_onInput, "f"), true);
            window.addEventListener('keyup', __classPrivateFieldGet(this, _RecordingClient_onKeyUp, "f"), true);
            window.addEventListener('pointerdown', __classPrivateFieldGet(this, _RecordingClient_onPointerDown, "f"), true);
            window.addEventListener('click', __classPrivateFieldGet(this, _RecordingClient_onClick, "f"), true);
            window.addEventListener('auxclick', __classPrivateFieldGet(this, _RecordingClient_onClick, "f"), true);
            window.addEventListener('beforeunload', __classPrivateFieldGet(this, _RecordingClient_onBeforeUnload, "f"), true);
        };
        this.stop = () => {
            __classPrivateFieldGet(this, _RecordingClient_logger, "f").log('Tearing down client listeners');
            window.removeEventListener('keydown', __classPrivateFieldGet(this, _RecordingClient_onKeyDown, "f"), true);
            window.removeEventListener('beforeinput', __classPrivateFieldGet(this, _RecordingClient_onBeforeInput, "f"), true);
            window.removeEventListener('input', __classPrivateFieldGet(this, _RecordingClient_onInput, "f"), true);
            window.removeEventListener('keyup', __classPrivateFieldGet(this, _RecordingClient_onKeyUp, "f"), true);
            window.removeEventListener('pointerdown', __classPrivateFieldGet(this, _RecordingClient_onPointerDown, "f"), true);
            window.removeEventListener('click', __classPrivateFieldGet(this, _RecordingClient_onClick, "f"), true);
            window.removeEventListener('auxclick', __classPrivateFieldGet(this, _RecordingClient_onClick, "f"), true);
            window.removeEventListener('beforeunload', __classPrivateFieldGet(this, _RecordingClient_onBeforeUnload, "f"), true);
        };
        this.getSelectors = (node) => {
            return __classPrivateFieldGet(this, _RecordingClient_computer, "f").getSelectors(node);
        };
        this.getCSSSelector = (node) => {
            return __classPrivateFieldGet(this, _RecordingClient_computer, "f").getCSSSelector(node);
        };
        this.getTextSelector = (node) => {
            return __classPrivateFieldGet(this, _RecordingClient_computer, "f").getTextSelector(node);
        };
        this.queryCSSSelectorAllForTesting = (selector) => {
            return queryCSSSelectorAll(selector);
        };
        _RecordingClient_wasStopShortcutPress.set(this, (event) => {
            for (const shortcut of __classPrivateFieldGet(this, _RecordingClient_stopShortcuts, "f") ?? []) {
                if (event.shiftKey === shortcut.shift && event.ctrlKey === shortcut.ctrl && event.metaKey === shortcut.meta &&
                    event.keyCode === shortcut.keyCode) {
                    this.stop();
                    haultImmediateEvent(event);
                    window.stopShortcut(getShortcutLength(shortcut));
                    return true;
                }
            }
            return false;
        });
        _RecordingClient_initialInputTarget.set(this, { element: document.documentElement, selectors: [] });
        /**
         * Sets the current input target and computes the selector.
         *
         * This needs to be called before any input-related events (keydown, keyup,
         * input, change, etc) occur so the precise selector is known. Since we
         * capture on the `Window`, it suffices to call this on the first event in any
         * given input sequence. This will always be either `keydown`, `beforeinput`,
         * or `input`.
         */
        _RecordingClient_setInitialInputTarget.set(this, (event) => {
            const element = event.composedPath()[0];
            assert(element instanceof Element);
            if (__classPrivateFieldGet(this, _RecordingClient_initialInputTarget, "f").element === element) {
                return;
            }
            __classPrivateFieldSet(this, _RecordingClient_initialInputTarget, { element, selectors: this.getSelectors(element) }, "f");
        });
        _RecordingClient_onKeyDown.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _RecordingClient_isTrustedEvent, "f").call(this, event)) {
                return;
            }
            if (__classPrivateFieldGet(this, _RecordingClient_wasStopShortcutPress, "f").call(this, event)) {
                return;
            }
            __classPrivateFieldGet(this, _RecordingClient_setInitialInputTarget, "f").call(this, event);
            __classPrivateFieldGet(this, _RecordingClient_addStep, "f").call(this, {
                type: 'keyDown',
                key: event.key,
            });
        });
        _RecordingClient_onBeforeInput.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _RecordingClient_isTrustedEvent, "f").call(this, event)) {
                return;
            }
            __classPrivateFieldGet(this, _RecordingClient_setInitialInputTarget, "f").call(this, event);
        });
        _RecordingClient_onInput.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _RecordingClient_isTrustedEvent, "f").call(this, event)) {
                return;
            }
            __classPrivateFieldGet(this, _RecordingClient_setInitialInputTarget, "f").call(this, event);
            if (isIgnorableInputElement(__classPrivateFieldGet(this, _RecordingClient_initialInputTarget, "f").element)) {
                return;
            }
            const { element, selectors } = __classPrivateFieldGet(this, _RecordingClient_initialInputTarget, "f");
            __classPrivateFieldGet(this, _RecordingClient_addStep, "f").call(this, {
                type: 'change',
                selectors,
                value: 'value' in element ? element.value : element.textContent,
            });
        });
        _RecordingClient_onKeyUp.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _RecordingClient_isTrustedEvent, "f").call(this, event)) {
                return;
            }
            __classPrivateFieldGet(this, _RecordingClient_addStep, "f").call(this, {
                type: 'keyUp',
                key: event.key,
            });
        });
        _RecordingClient_initialPointerTarget.set(this, {
            element: document.documentElement,
            selectors: [],
        });
        _RecordingClient_setInitialPointerTarget.set(this, (event) => {
            const element = getClickableTargetFromEvent(event);
            if (__classPrivateFieldGet(this, _RecordingClient_initialPointerTarget, "f").element === element) {
                return;
            }
            __classPrivateFieldSet(this, _RecordingClient_initialPointerTarget, {
                element,
                selectors: __classPrivateFieldGet(this, _RecordingClient_computer, "f").getSelectors(element),
            }, "f");
        });
        _RecordingClient_pointerDownTimestamp.set(this, 0);
        _RecordingClient_onPointerDown.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _RecordingClient_isTrustedEvent, "f").call(this, event)) {
                return;
            }
            __classPrivateFieldSet(this, _RecordingClient_pointerDownTimestamp, event.timeStamp, "f");
            __classPrivateFieldGet(this, _RecordingClient_setInitialPointerTarget, "f").call(this, event);
        });
        _RecordingClient_onClick.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _RecordingClient_isTrustedEvent, "f").call(this, event)) {
                return;
            }
            __classPrivateFieldGet(this, _RecordingClient_setInitialPointerTarget, "f").call(this, event);
            const attributes = createClickAttributes(event, __classPrivateFieldGet(this, _RecordingClient_initialPointerTarget, "f").element);
            if (!attributes) {
                return;
            }
            const duration = event.timeStamp - __classPrivateFieldGet(this, _RecordingClient_pointerDownTimestamp, "f");
            __classPrivateFieldGet(this, _RecordingClient_addStep, "f").call(this, {
                type: event.detail === 2 ? 'doubleClick' : 'click',
                selectors: __classPrivateFieldGet(this, _RecordingClient_initialPointerTarget, "f").selectors,
                duration: duration > 350 ? duration : undefined,
                ...attributes,
            });
        });
        _RecordingClient_onBeforeUnload.set(this, (event) => {
            __classPrivateFieldGet(this, _RecordingClient_logger, "f").log('Unloading…');
            if (!__classPrivateFieldGet(this, _RecordingClient_isTrustedEvent, "f").call(this, event)) {
                return;
            }
            __classPrivateFieldGet(this, _RecordingClient_addStep, "f").call(this, { type: 'beforeUnload' });
        });
        _RecordingClient_addStep.set(this, (step) => {
            const payload = JSON.stringify(step);
            __classPrivateFieldGet(this, _RecordingClient_logger, "f").log(`Adding step: ${payload}`);
            window.addStep(payload);
        });
        __classPrivateFieldSet(this, _RecordingClient_logger, new Logger(options.debug ? 'debug' : 'silent'), "f");
        __classPrivateFieldGet(this, _RecordingClient_logger, "f").log('creating a RecordingClient');
        __classPrivateFieldSet(this, _RecordingClient_computer, new SelectorComputer(bindings, __classPrivateFieldGet(this, _RecordingClient_logger, "f"), options.selectorAttribute, options.selectorTypesToRecord), "f");
        if (options.allowUntrustedEvents) {
            __classPrivateFieldSet(this, _RecordingClient_isTrustedEvent, () => true, "f");
        }
        __classPrivateFieldSet(this, _RecordingClient_stopShortcuts, options.stopShortcuts ?? [], "f");
    }
}
_RecordingClient_computer = new WeakMap(), _RecordingClient_isTrustedEvent = new WeakMap(), _RecordingClient_stopShortcuts = new WeakMap(), _RecordingClient_logger = new WeakMap(), _RecordingClient_wasStopShortcutPress = new WeakMap(), _RecordingClient_initialInputTarget = new WeakMap(), _RecordingClient_setInitialInputTarget = new WeakMap(), _RecordingClient_onKeyDown = new WeakMap(), _RecordingClient_onBeforeInput = new WeakMap(), _RecordingClient_onInput = new WeakMap(), _RecordingClient_onKeyUp = new WeakMap(), _RecordingClient_initialPointerTarget = new WeakMap(), _RecordingClient_setInitialPointerTarget = new WeakMap(), _RecordingClient_pointerDownTimestamp = new WeakMap(), _RecordingClient_onPointerDown = new WeakMap(), _RecordingClient_onClick = new WeakMap(), _RecordingClient_onBeforeUnload = new WeakMap(), _RecordingClient_addStep = new WeakMap();
RecordingClient.defaultSetupOptions = Object.freeze({
    debug: false,
    allowUntrustedEvents: false,
    selectorTypesToRecord: [
        'aria',
        'css',
        'text',
        'xpath',
        'pierce',
    ],
});
export { RecordingClient };
//# sourceMappingURL=RecordingClient.js.map