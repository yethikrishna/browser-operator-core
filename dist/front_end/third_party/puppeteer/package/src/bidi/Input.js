/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
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
var _BidiKeyboard_page, _BidiMouse_page, _BidiMouse_lastMovePoint, _BidiTouchHandle_started, _BidiTouchHandle_x, _BidiTouchHandle_y, _BidiTouchHandle_bidiId, _BidiTouchHandle_page, _BidiTouchHandle_touchScreen, _BidiTouchHandle_properties, _BidiTouchscreen_page;
import { Keyboard, Mouse, MouseButton, Touchscreen, } from '../api/Input.js';
import { UnsupportedOperation } from '../common/Errors.js';
import { TouchError } from '../common/Errors.js';
var InputId;
(function (InputId) {
    InputId["Mouse"] = "__puppeteer_mouse";
    InputId["Keyboard"] = "__puppeteer_keyboard";
    InputId["Wheel"] = "__puppeteer_wheel";
    InputId["Finger"] = "__puppeteer_finger";
})(InputId || (InputId = {}));
var SourceActionsType;
(function (SourceActionsType) {
    SourceActionsType["None"] = "none";
    SourceActionsType["Key"] = "key";
    SourceActionsType["Pointer"] = "pointer";
    SourceActionsType["Wheel"] = "wheel";
})(SourceActionsType || (SourceActionsType = {}));
var ActionType;
(function (ActionType) {
    ActionType["Pause"] = "pause";
    ActionType["KeyDown"] = "keyDown";
    ActionType["KeyUp"] = "keyUp";
    ActionType["PointerUp"] = "pointerUp";
    ActionType["PointerDown"] = "pointerDown";
    ActionType["PointerMove"] = "pointerMove";
    ActionType["Scroll"] = "scroll";
})(ActionType || (ActionType = {}));
const getBidiKeyValue = (key) => {
    switch (key) {
        case '\r':
        case '\n':
            key = 'Enter';
            break;
    }
    // Measures the number of code points rather than UTF-16 code units.
    if ([...key].length === 1) {
        return key;
    }
    switch (key) {
        case 'Cancel':
            return '\uE001';
        case 'Help':
            return '\uE002';
        case 'Backspace':
            return '\uE003';
        case 'Tab':
            return '\uE004';
        case 'Clear':
            return '\uE005';
        case 'Enter':
            return '\uE007';
        case 'Shift':
        case 'ShiftLeft':
            return '\uE008';
        case 'Control':
        case 'ControlLeft':
            return '\uE009';
        case 'Alt':
        case 'AltLeft':
            return '\uE00A';
        case 'Pause':
            return '\uE00B';
        case 'Escape':
            return '\uE00C';
        case 'PageUp':
            return '\uE00E';
        case 'PageDown':
            return '\uE00F';
        case 'End':
            return '\uE010';
        case 'Home':
            return '\uE011';
        case 'ArrowLeft':
            return '\uE012';
        case 'ArrowUp':
            return '\uE013';
        case 'ArrowRight':
            return '\uE014';
        case 'ArrowDown':
            return '\uE015';
        case 'Insert':
            return '\uE016';
        case 'Delete':
            return '\uE017';
        case 'NumpadEqual':
            return '\uE019';
        case 'Numpad0':
            return '\uE01A';
        case 'Numpad1':
            return '\uE01B';
        case 'Numpad2':
            return '\uE01C';
        case 'Numpad3':
            return '\uE01D';
        case 'Numpad4':
            return '\uE01E';
        case 'Numpad5':
            return '\uE01F';
        case 'Numpad6':
            return '\uE020';
        case 'Numpad7':
            return '\uE021';
        case 'Numpad8':
            return '\uE022';
        case 'Numpad9':
            return '\uE023';
        case 'NumpadMultiply':
            return '\uE024';
        case 'NumpadAdd':
            return '\uE025';
        case 'NumpadSubtract':
            return '\uE027';
        case 'NumpadDecimal':
            return '\uE028';
        case 'NumpadDivide':
            return '\uE029';
        case 'F1':
            return '\uE031';
        case 'F2':
            return '\uE032';
        case 'F3':
            return '\uE033';
        case 'F4':
            return '\uE034';
        case 'F5':
            return '\uE035';
        case 'F6':
            return '\uE036';
        case 'F7':
            return '\uE037';
        case 'F8':
            return '\uE038';
        case 'F9':
            return '\uE039';
        case 'F10':
            return '\uE03A';
        case 'F11':
            return '\uE03B';
        case 'F12':
            return '\uE03C';
        case 'Meta':
        case 'MetaLeft':
            return '\uE03D';
        case 'ShiftRight':
            return '\uE050';
        case 'ControlRight':
            return '\uE051';
        case 'AltRight':
            return '\uE052';
        case 'MetaRight':
            return '\uE053';
        case 'Digit0':
            return '0';
        case 'Digit1':
            return '1';
        case 'Digit2':
            return '2';
        case 'Digit3':
            return '3';
        case 'Digit4':
            return '4';
        case 'Digit5':
            return '5';
        case 'Digit6':
            return '6';
        case 'Digit7':
            return '7';
        case 'Digit8':
            return '8';
        case 'Digit9':
            return '9';
        case 'KeyA':
            return 'a';
        case 'KeyB':
            return 'b';
        case 'KeyC':
            return 'c';
        case 'KeyD':
            return 'd';
        case 'KeyE':
            return 'e';
        case 'KeyF':
            return 'f';
        case 'KeyG':
            return 'g';
        case 'KeyH':
            return 'h';
        case 'KeyI':
            return 'i';
        case 'KeyJ':
            return 'j';
        case 'KeyK':
            return 'k';
        case 'KeyL':
            return 'l';
        case 'KeyM':
            return 'm';
        case 'KeyN':
            return 'n';
        case 'KeyO':
            return 'o';
        case 'KeyP':
            return 'p';
        case 'KeyQ':
            return 'q';
        case 'KeyR':
            return 'r';
        case 'KeyS':
            return 's';
        case 'KeyT':
            return 't';
        case 'KeyU':
            return 'u';
        case 'KeyV':
            return 'v';
        case 'KeyW':
            return 'w';
        case 'KeyX':
            return 'x';
        case 'KeyY':
            return 'y';
        case 'KeyZ':
            return 'z';
        case 'Semicolon':
            return ';';
        case 'Equal':
            return '=';
        case 'Comma':
            return ',';
        case 'Minus':
            return '-';
        case 'Period':
            return '.';
        case 'Slash':
            return '/';
        case 'Backquote':
            return '`';
        case 'BracketLeft':
            return '[';
        case 'Backslash':
            return '\\';
        case 'BracketRight':
            return ']';
        case 'Quote':
            return '"';
        default:
            throw new Error(`Unknown key: "${key}"`);
    }
};
/**
 * @internal
 */
export class BidiKeyboard extends Keyboard {
    constructor(page) {
        super();
        _BidiKeyboard_page.set(this, void 0);
        __classPrivateFieldSet(this, _BidiKeyboard_page, page, "f");
    }
    async down(key, _options) {
        await __classPrivateFieldGet(this, _BidiKeyboard_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Key,
                id: "__puppeteer_keyboard" /* InputId.Keyboard */,
                actions: [
                    {
                        type: ActionType.KeyDown,
                        value: getBidiKeyValue(key),
                    },
                ],
            },
        ]);
    }
    async up(key) {
        await __classPrivateFieldGet(this, _BidiKeyboard_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Key,
                id: "__puppeteer_keyboard" /* InputId.Keyboard */,
                actions: [
                    {
                        type: ActionType.KeyUp,
                        value: getBidiKeyValue(key),
                    },
                ],
            },
        ]);
    }
    async press(key, options = {}) {
        const { delay = 0 } = options;
        const actions = [
            {
                type: ActionType.KeyDown,
                value: getBidiKeyValue(key),
            },
        ];
        if (delay > 0) {
            actions.push({
                type: ActionType.Pause,
                duration: delay,
            });
        }
        actions.push({
            type: ActionType.KeyUp,
            value: getBidiKeyValue(key),
        });
        await __classPrivateFieldGet(this, _BidiKeyboard_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Key,
                id: "__puppeteer_keyboard" /* InputId.Keyboard */,
                actions,
            },
        ]);
    }
    async type(text, options = {}) {
        const { delay = 0 } = options;
        // This spread separates the characters into code points rather than UTF-16
        // code units.
        const values = [...text].map(getBidiKeyValue);
        const actions = [];
        if (delay <= 0) {
            for (const value of values) {
                actions.push({
                    type: ActionType.KeyDown,
                    value,
                }, {
                    type: ActionType.KeyUp,
                    value,
                });
            }
        }
        else {
            for (const value of values) {
                actions.push({
                    type: ActionType.KeyDown,
                    value,
                }, {
                    type: ActionType.Pause,
                    duration: delay,
                }, {
                    type: ActionType.KeyUp,
                    value,
                });
            }
        }
        await __classPrivateFieldGet(this, _BidiKeyboard_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Key,
                id: "__puppeteer_keyboard" /* InputId.Keyboard */,
                actions,
            },
        ]);
    }
    async sendCharacter(char) {
        // Measures the number of code points rather than UTF-16 code units.
        if ([...char].length > 1) {
            throw new Error('Cannot send more than 1 character.');
        }
        const frame = await __classPrivateFieldGet(this, _BidiKeyboard_page, "f").focusedFrame();
        await frame.isolatedRealm().evaluate(async (char) => {
            document.execCommand('insertText', false, char);
        }, char);
    }
}
_BidiKeyboard_page = new WeakMap();
const getBidiButton = (button) => {
    switch (button) {
        case MouseButton.Left:
            return 0;
        case MouseButton.Middle:
            return 1;
        case MouseButton.Right:
            return 2;
        case MouseButton.Back:
            return 3;
        case MouseButton.Forward:
            return 4;
    }
};
/**
 * @internal
 */
export class BidiMouse extends Mouse {
    constructor(page) {
        super();
        _BidiMouse_page.set(this, void 0);
        _BidiMouse_lastMovePoint.set(this, { x: 0, y: 0 });
        __classPrivateFieldSet(this, _BidiMouse_page, page, "f");
    }
    async reset() {
        __classPrivateFieldSet(this, _BidiMouse_lastMovePoint, { x: 0, y: 0 }, "f");
        await __classPrivateFieldGet(this, _BidiMouse_page, "f").mainFrame().browsingContext.releaseActions();
    }
    async move(x, y, options = {}) {
        const from = __classPrivateFieldGet(this, _BidiMouse_lastMovePoint, "f");
        const to = {
            x: Math.round(x),
            y: Math.round(y),
        };
        const actions = [];
        const steps = options.steps ?? 0;
        for (let i = 0; i < steps; ++i) {
            actions.push({
                type: ActionType.PointerMove,
                x: from.x + (to.x - from.x) * (i / steps),
                y: from.y + (to.y - from.y) * (i / steps),
                origin: options.origin,
            });
        }
        actions.push({
            type: ActionType.PointerMove,
            ...to,
            origin: options.origin,
        });
        // https://w3c.github.io/webdriver-bidi/#command-input-performActions:~:text=input.PointerMoveAction%20%3D%20%7B%0A%20%20type%3A%20%22pointerMove%22%2C%0A%20%20x%3A%20js%2Dint%2C
        __classPrivateFieldSet(this, _BidiMouse_lastMovePoint, to, "f");
        await __classPrivateFieldGet(this, _BidiMouse_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Pointer,
                id: "__puppeteer_mouse" /* InputId.Mouse */,
                actions,
            },
        ]);
    }
    async down(options = {}) {
        await __classPrivateFieldGet(this, _BidiMouse_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Pointer,
                id: "__puppeteer_mouse" /* InputId.Mouse */,
                actions: [
                    {
                        type: ActionType.PointerDown,
                        button: getBidiButton(options.button ?? MouseButton.Left),
                    },
                ],
            },
        ]);
    }
    async up(options = {}) {
        await __classPrivateFieldGet(this, _BidiMouse_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Pointer,
                id: "__puppeteer_mouse" /* InputId.Mouse */,
                actions: [
                    {
                        type: ActionType.PointerUp,
                        button: getBidiButton(options.button ?? MouseButton.Left),
                    },
                ],
            },
        ]);
    }
    async click(x, y, options = {}) {
        const actions = [
            {
                type: ActionType.PointerMove,
                x: Math.round(x),
                y: Math.round(y),
                origin: options.origin,
            },
        ];
        const pointerDownAction = {
            type: ActionType.PointerDown,
            button: getBidiButton(options.button ?? MouseButton.Left),
        };
        const pointerUpAction = {
            type: ActionType.PointerUp,
            button: pointerDownAction.button,
        };
        for (let i = 1; i < (options.count ?? 1); ++i) {
            actions.push(pointerDownAction, pointerUpAction);
        }
        actions.push(pointerDownAction);
        if (options.delay) {
            actions.push({
                type: ActionType.Pause,
                duration: options.delay,
            });
        }
        actions.push(pointerUpAction);
        await __classPrivateFieldGet(this, _BidiMouse_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Pointer,
                id: "__puppeteer_mouse" /* InputId.Mouse */,
                actions,
            },
        ]);
    }
    async wheel(options = {}) {
        await __classPrivateFieldGet(this, _BidiMouse_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Wheel,
                id: "__puppeteer_wheel" /* InputId.Wheel */,
                actions: [
                    {
                        type: ActionType.Scroll,
                        ...(__classPrivateFieldGet(this, _BidiMouse_lastMovePoint, "f") ?? {
                            x: 0,
                            y: 0,
                        }),
                        deltaX: options.deltaX ?? 0,
                        deltaY: options.deltaY ?? 0,
                    },
                ],
            },
        ]);
    }
    drag() {
        throw new UnsupportedOperation();
    }
    dragOver() {
        throw new UnsupportedOperation();
    }
    dragEnter() {
        throw new UnsupportedOperation();
    }
    drop() {
        throw new UnsupportedOperation();
    }
    dragAndDrop() {
        throw new UnsupportedOperation();
    }
}
_BidiMouse_page = new WeakMap(), _BidiMouse_lastMovePoint = new WeakMap();
/**
 * @internal
 */
class BidiTouchHandle {
    constructor(page, touchScreen, id, x, y, properties) {
        _BidiTouchHandle_started.set(this, false);
        _BidiTouchHandle_x.set(this, void 0);
        _BidiTouchHandle_y.set(this, void 0);
        _BidiTouchHandle_bidiId.set(this, void 0);
        _BidiTouchHandle_page.set(this, void 0);
        _BidiTouchHandle_touchScreen.set(this, void 0);
        _BidiTouchHandle_properties.set(this, void 0);
        __classPrivateFieldSet(this, _BidiTouchHandle_page, page, "f");
        __classPrivateFieldSet(this, _BidiTouchHandle_touchScreen, touchScreen, "f");
        __classPrivateFieldSet(this, _BidiTouchHandle_x, Math.round(x), "f");
        __classPrivateFieldSet(this, _BidiTouchHandle_y, Math.round(y), "f");
        __classPrivateFieldSet(this, _BidiTouchHandle_properties, properties, "f");
        __classPrivateFieldSet(this, _BidiTouchHandle_bidiId, `${"__puppeteer_finger" /* InputId.Finger */}_${id}`, "f");
    }
    async start(options = {}) {
        if (__classPrivateFieldGet(this, _BidiTouchHandle_started, "f")) {
            throw new TouchError('Touch has already started');
        }
        await __classPrivateFieldGet(this, _BidiTouchHandle_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Pointer,
                id: __classPrivateFieldGet(this, _BidiTouchHandle_bidiId, "f"),
                parameters: {
                    pointerType: "touch" /* Bidi.Input.PointerType.Touch */,
                },
                actions: [
                    {
                        type: ActionType.PointerMove,
                        x: __classPrivateFieldGet(this, _BidiTouchHandle_x, "f"),
                        y: __classPrivateFieldGet(this, _BidiTouchHandle_y, "f"),
                        origin: options.origin,
                    },
                    {
                        ...__classPrivateFieldGet(this, _BidiTouchHandle_properties, "f"),
                        type: ActionType.PointerDown,
                        button: 0,
                    },
                ],
            },
        ]);
        __classPrivateFieldSet(this, _BidiTouchHandle_started, true, "f");
    }
    move(x, y) {
        const newX = Math.round(x);
        const newY = Math.round(y);
        return __classPrivateFieldGet(this, _BidiTouchHandle_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Pointer,
                id: __classPrivateFieldGet(this, _BidiTouchHandle_bidiId, "f"),
                parameters: {
                    pointerType: "touch" /* Bidi.Input.PointerType.Touch */,
                },
                actions: [
                    {
                        ...__classPrivateFieldGet(this, _BidiTouchHandle_properties, "f"),
                        type: ActionType.PointerMove,
                        x: newX,
                        y: newY,
                    },
                ],
            },
        ]);
    }
    async end() {
        await __classPrivateFieldGet(this, _BidiTouchHandle_page, "f").mainFrame().browsingContext.performActions([
            {
                type: SourceActionsType.Pointer,
                id: __classPrivateFieldGet(this, _BidiTouchHandle_bidiId, "f"),
                parameters: {
                    pointerType: "touch" /* Bidi.Input.PointerType.Touch */,
                },
                actions: [
                    {
                        type: ActionType.PointerUp,
                        button: 0,
                    },
                ],
            },
        ]);
        __classPrivateFieldGet(this, _BidiTouchHandle_touchScreen, "f").removeHandle(this);
    }
}
_BidiTouchHandle_started = new WeakMap(), _BidiTouchHandle_x = new WeakMap(), _BidiTouchHandle_y = new WeakMap(), _BidiTouchHandle_bidiId = new WeakMap(), _BidiTouchHandle_page = new WeakMap(), _BidiTouchHandle_touchScreen = new WeakMap(), _BidiTouchHandle_properties = new WeakMap();
/**
 * @internal
 */
export class BidiTouchscreen extends Touchscreen {
    constructor(page) {
        super();
        _BidiTouchscreen_page.set(this, void 0);
        __classPrivateFieldSet(this, _BidiTouchscreen_page, page, "f");
    }
    async touchStart(x, y, options = {}) {
        const id = this.idGenerator();
        const properties = {
            width: 0.5 * 2, // 2 times default touch radius.
            height: 0.5 * 2, // 2 times default touch radius.
            pressure: 0.5,
            altitudeAngle: Math.PI / 2,
        };
        const touch = new BidiTouchHandle(__classPrivateFieldGet(this, _BidiTouchscreen_page, "f"), this, id, x, y, properties);
        await touch.start(options);
        this.touches.push(touch);
        return touch;
    }
}
_BidiTouchscreen_page = new WeakMap();
//# sourceMappingURL=Input.js.map