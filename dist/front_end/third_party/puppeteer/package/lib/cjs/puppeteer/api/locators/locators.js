"use strict";
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
var _Locator_instances, _Locator_ensureElementIsInTheViewport, _Locator_waitForEnabled, _Locator_waitForStableBoundingBox, _Locator_waitForEnabledIfNeeded, _Locator_waitForStableBoundingBoxIfNeeded, _Locator_ensureElementIsInTheViewportIfNeeded, _Locator_click, _Locator_fill, _Locator_hover, _Locator_scroll, _FunctionLocator_pageOrFrame, _FunctionLocator_func, _DelegatedLocator_delegate, _FilteredLocator_predicate, _MappedLocator_mapper, _NodeLocator_pageOrFrame, _NodeLocator_selector, _NodeLocator_waitForVisibilityIfNeeded, _RaceLocator_locators;
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function")
            throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose)
                throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose)
                throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async)
                inner = dispose;
        }
        if (typeof dispose !== "function")
            throw new TypeError("Object not disposable.");
        if (inner)
            dispose = function () { try {
                inner.call(this);
            }
            catch (e) {
                return Promise.reject(e);
            } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1)
                        return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async)
                            return s |= 2, Promise.resolve(result).then(next, function (e) { fail(e); return next(); });
                    }
                    else
                        s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1)
                return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError)
                throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.RETRY_DELAY = exports.RaceLocator = exports.NodeLocator = exports.MappedLocator = exports.FilteredLocator = exports.DelegatedLocator = exports.FunctionLocator = exports.Locator = exports.LocatorEvent = void 0;
const rxjs_js_1 = require("../../../third_party/rxjs/rxjs.js");
const EventEmitter_js_1 = require("../../common/EventEmitter.js");
const util_js_1 = require("../../common/util.js");
/**
 * All the events that a locator instance may emit.
 *
 * @public
 */
var LocatorEvent;
(function (LocatorEvent) {
    /**
     * Emitted every time before the locator performs an action on the located element(s).
     */
    LocatorEvent["Action"] = "action";
})(LocatorEvent || (exports.LocatorEvent = LocatorEvent = {}));
/**
 * Locators describe a strategy of locating objects and performing an action on
 * them. If the action fails because the object is not ready for the action, the
 * whole operation is retried. Various preconditions for a successful action are
 * checked automatically.
 *
 * See {@link https://pptr.dev/guides/page-interactions#locators} for details.
 *
 * @public
 */
class Locator extends EventEmitter_js_1.EventEmitter {
    constructor() {
        super(...arguments);
        _Locator_instances.add(this);
        /**
         * @internal
         */
        this.visibility = null;
        /**
         * @internal
         */
        this._timeout = 30000;
        _Locator_ensureElementIsInTheViewport.set(this, true);
        _Locator_waitForEnabled.set(this, true);
        _Locator_waitForStableBoundingBox.set(this, true);
        /**
         * @internal
         */
        this.operators = {
            conditions: (conditions, signal) => {
                return (0, rxjs_js_1.mergeMap)((handle) => {
                    return (0, rxjs_js_1.merge)(...conditions.map(condition => {
                        return condition(handle, signal);
                    })).pipe((0, rxjs_js_1.defaultIfEmpty)(handle));
                });
            },
            retryAndRaceWithSignalAndTimer: (signal, cause) => {
                const candidates = [];
                if (signal) {
                    candidates.push((0, util_js_1.fromAbortSignal)(signal, cause));
                }
                candidates.push((0, util_js_1.timeout)(this._timeout, cause));
                return (0, rxjs_js_1.pipe)((0, rxjs_js_1.retry)({ delay: exports.RETRY_DELAY }), (0, rxjs_js_1.raceWith)(...candidates));
            },
        };
        /**
         * If the element has a "disabled" property, wait for the element to be
         * enabled.
         */
        _Locator_waitForEnabledIfNeeded.set(this, (handle, signal) => {
            if (!__classPrivateFieldGet(this, _Locator_waitForEnabled, "f")) {
                return rxjs_js_1.EMPTY;
            }
            return (0, rxjs_js_1.from)(handle.frame.waitForFunction(element => {
                if (!(element instanceof HTMLElement)) {
                    return true;
                }
                const isNativeFormControl = [
                    'BUTTON',
                    'INPUT',
                    'SELECT',
                    'TEXTAREA',
                    'OPTION',
                    'OPTGROUP',
                ].includes(element.nodeName);
                return !isNativeFormControl || !element.hasAttribute('disabled');
            }, {
                timeout: this._timeout,
                signal,
            }, handle)).pipe((0, rxjs_js_1.ignoreElements)());
        });
        /**
         * Compares the bounding box of the element for two consecutive animation
         * frames and waits till they are the same.
         */
        _Locator_waitForStableBoundingBoxIfNeeded.set(this, (handle) => {
            if (!__classPrivateFieldGet(this, _Locator_waitForStableBoundingBox, "f")) {
                return rxjs_js_1.EMPTY;
            }
            return (0, rxjs_js_1.defer)(() => {
                // Note we don't use waitForFunction because that relies on RAF.
                return (0, rxjs_js_1.from)(handle.evaluate(element => {
                    return new Promise(resolve => {
                        window.requestAnimationFrame(() => {
                            const rect1 = element.getBoundingClientRect();
                            window.requestAnimationFrame(() => {
                                const rect2 = element.getBoundingClientRect();
                                resolve([
                                    {
                                        x: rect1.x,
                                        y: rect1.y,
                                        width: rect1.width,
                                        height: rect1.height,
                                    },
                                    {
                                        x: rect2.x,
                                        y: rect2.y,
                                        width: rect2.width,
                                        height: rect2.height,
                                    },
                                ]);
                            });
                        });
                    });
                }));
            }).pipe((0, rxjs_js_1.first)(([rect1, rect2]) => {
                return (rect1.x === rect2.x &&
                    rect1.y === rect2.y &&
                    rect1.width === rect2.width &&
                    rect1.height === rect2.height);
            }), (0, rxjs_js_1.retry)({ delay: exports.RETRY_DELAY }), (0, rxjs_js_1.ignoreElements)());
        });
        /**
         * Checks if the element is in the viewport and auto-scrolls it if it is not.
         */
        _Locator_ensureElementIsInTheViewportIfNeeded.set(this, (handle) => {
            if (!__classPrivateFieldGet(this, _Locator_ensureElementIsInTheViewport, "f")) {
                return rxjs_js_1.EMPTY;
            }
            return (0, rxjs_js_1.from)(handle.isIntersectingViewport({ threshold: 0 })).pipe((0, rxjs_js_1.filter)(isIntersectingViewport => {
                return !isIntersectingViewport;
            }), (0, rxjs_js_1.mergeMap)(() => {
                return (0, rxjs_js_1.from)(handle.scrollIntoView());
            }), (0, rxjs_js_1.mergeMap)(() => {
                return (0, rxjs_js_1.defer)(() => {
                    return (0, rxjs_js_1.from)(handle.isIntersectingViewport({ threshold: 0 }));
                }).pipe((0, rxjs_js_1.first)(rxjs_js_1.identity), (0, rxjs_js_1.retry)({ delay: exports.RETRY_DELAY }), (0, rxjs_js_1.ignoreElements)());
            }));
        });
    }
    /**
     * Creates a race between multiple locators trying to locate elements in
     * parallel but ensures that only a single element receives the action.
     *
     * @public
     */
    static race(locators) {
        return RaceLocator.create(locators);
    }
    // Determines when the locator will timeout for actions.
    get timeout() {
        return this._timeout;
    }
    /**
     * Creates a new locator instance by cloning the current locator and setting
     * the total timeout for the locator actions.
     *
     * Pass `0` to disable timeout.
     *
     * @defaultValue `Page.getDefaultTimeout()`
     */
    setTimeout(timeout) {
        const locator = this._clone();
        locator._timeout = timeout;
        return locator;
    }
    /**
     * Creates a new locator instance by cloning the current locator with the
     * visibility property changed to the specified value.
     */
    setVisibility(visibility) {
        const locator = this._clone();
        locator.visibility = visibility;
        return locator;
    }
    /**
     * Creates a new locator instance by cloning the current locator and
     * specifying whether to wait for input elements to become enabled before the
     * action. Applicable to `click` and `fill` actions.
     *
     * @defaultValue `true`
     */
    setWaitForEnabled(value) {
        const locator = this._clone();
        __classPrivateFieldSet(locator, _Locator_waitForEnabled, value, "f");
        return locator;
    }
    /**
     * Creates a new locator instance by cloning the current locator and
     * specifying whether the locator should scroll the element into viewport if
     * it is not in the viewport already.
     *
     * @defaultValue `true`
     */
    setEnsureElementIsInTheViewport(value) {
        const locator = this._clone();
        __classPrivateFieldSet(locator, _Locator_ensureElementIsInTheViewport, value, "f");
        return locator;
    }
    /**
     * Creates a new locator instance by cloning the current locator and
     * specifying whether the locator has to wait for the element's bounding box
     * to be same between two consecutive animation frames.
     *
     * @defaultValue `true`
     */
    setWaitForStableBoundingBox(value) {
        const locator = this._clone();
        __classPrivateFieldSet(locator, _Locator_waitForStableBoundingBox, value, "f");
        return locator;
    }
    /**
     * @internal
     */
    copyOptions(locator) {
        this._timeout = locator._timeout;
        this.visibility = locator.visibility;
        __classPrivateFieldSet(this, _Locator_waitForEnabled, __classPrivateFieldGet(locator, _Locator_waitForEnabled, "f"), "f");
        __classPrivateFieldSet(this, _Locator_ensureElementIsInTheViewport, __classPrivateFieldGet(locator, _Locator_ensureElementIsInTheViewport, "f"), "f");
        __classPrivateFieldSet(this, _Locator_waitForStableBoundingBox, __classPrivateFieldGet(locator, _Locator_waitForStableBoundingBox, "f"), "f");
        return this;
    }
    /**
     * Clones the locator.
     */
    clone() {
        return this._clone();
    }
    /**
     * Waits for the locator to get a handle from the page.
     *
     * @public
     */
    async waitHandle(options) {
        const cause = new Error('Locator.waitHandle');
        return await (0, rxjs_js_1.firstValueFrom)(this._wait(options).pipe(this.operators.retryAndRaceWithSignalAndTimer(options?.signal, cause)));
    }
    /**
     * Waits for the locator to get the serialized value from the page.
     *
     * Note this requires the value to be JSON-serializable.
     *
     * @public
     */
    async wait(options) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const handle = __addDisposableResource(env_1, await this.waitHandle(options), false);
            return await handle.jsonValue();
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    /**
     * Maps the locator using the provided mapper.
     *
     * @public
     */
    map(mapper) {
        return new MappedLocator(this._clone(), handle => {
            // SAFETY: TypeScript cannot deduce the type.
            return handle.evaluateHandle(mapper);
        });
    }
    /**
     * Creates an expectation that is evaluated against located values.
     *
     * If the expectations do not match, then the locator will retry.
     *
     * @public
     */
    filter(predicate) {
        return new FilteredLocator(this._clone(), async (handle, signal) => {
            await handle.frame.waitForFunction(predicate, { signal, timeout: this._timeout }, handle);
            return true;
        });
    }
    /**
     * Creates an expectation that is evaluated against located handles.
     *
     * If the expectations do not match, then the locator will retry.
     *
     * @internal
     */
    filterHandle(predicate) {
        return new FilteredLocator(this._clone(), predicate);
    }
    /**
     * Maps the locator using the provided mapper.
     *
     * @internal
     */
    mapHandle(mapper) {
        return new MappedLocator(this._clone(), mapper);
    }
    /**
     * Clicks the located element.
     */
    click(options) {
        return (0, rxjs_js_1.firstValueFrom)(__classPrivateFieldGet(this, _Locator_instances, "m", _Locator_click).call(this, options));
    }
    /**
     * Fills out the input identified by the locator using the provided value. The
     * type of the input is determined at runtime and the appropriate fill-out
     * method is chosen based on the type. `contenteditable`, select, textarea and
     * input elements are supported.
     */
    fill(value, options) {
        return (0, rxjs_js_1.firstValueFrom)(__classPrivateFieldGet(this, _Locator_instances, "m", _Locator_fill).call(this, value, options));
    }
    /**
     * Hovers over the located element.
     */
    hover(options) {
        return (0, rxjs_js_1.firstValueFrom)(__classPrivateFieldGet(this, _Locator_instances, "m", _Locator_hover).call(this, options));
    }
    /**
     * Scrolls the located element.
     */
    scroll(options) {
        return (0, rxjs_js_1.firstValueFrom)(__classPrivateFieldGet(this, _Locator_instances, "m", _Locator_scroll).call(this, options));
    }
}
_Locator_ensureElementIsInTheViewport = new WeakMap(), _Locator_waitForEnabled = new WeakMap(), _Locator_waitForStableBoundingBox = new WeakMap(), _Locator_waitForEnabledIfNeeded = new WeakMap(), _Locator_waitForStableBoundingBoxIfNeeded = new WeakMap(), _Locator_ensureElementIsInTheViewportIfNeeded = new WeakMap(), _Locator_instances = new WeakSet(), _Locator_click = function _Locator_click(options) {
    const signal = options?.signal;
    const cause = new Error('Locator.click');
    return this._wait(options).pipe(this.operators.conditions([
        __classPrivateFieldGet(this, _Locator_ensureElementIsInTheViewportIfNeeded, "f"),
        __classPrivateFieldGet(this, _Locator_waitForStableBoundingBoxIfNeeded, "f"),
        __classPrivateFieldGet(this, _Locator_waitForEnabledIfNeeded, "f"),
    ], signal), (0, rxjs_js_1.tap)(() => {
        return this.emit(LocatorEvent.Action, undefined);
    }), (0, rxjs_js_1.mergeMap)(handle => {
        return (0, rxjs_js_1.from)(handle.click(options)).pipe((0, rxjs_js_1.catchError)(err => {
            void handle.dispose().catch(util_js_1.debugError);
            throw err;
        }));
    }), this.operators.retryAndRaceWithSignalAndTimer(signal, cause));
}, _Locator_fill = function _Locator_fill(value, options) {
    const signal = options?.signal;
    const cause = new Error('Locator.fill');
    return this._wait(options).pipe(this.operators.conditions([
        __classPrivateFieldGet(this, _Locator_ensureElementIsInTheViewportIfNeeded, "f"),
        __classPrivateFieldGet(this, _Locator_waitForStableBoundingBoxIfNeeded, "f"),
        __classPrivateFieldGet(this, _Locator_waitForEnabledIfNeeded, "f"),
    ], signal), (0, rxjs_js_1.tap)(() => {
        return this.emit(LocatorEvent.Action, undefined);
    }), (0, rxjs_js_1.mergeMap)(handle => {
        return (0, rxjs_js_1.from)(handle.evaluate(el => {
            if (el instanceof HTMLSelectElement) {
                return 'select';
            }
            if (el instanceof HTMLTextAreaElement) {
                return 'typeable-input';
            }
            if (el instanceof HTMLInputElement) {
                if (new Set([
                    'textarea',
                    'text',
                    'url',
                    'tel',
                    'search',
                    'password',
                    'number',
                    'email',
                ]).has(el.type)) {
                    return 'typeable-input';
                }
                else {
                    return 'other-input';
                }
            }
            if (el.isContentEditable) {
                return 'contenteditable';
            }
            return 'unknown';
        }))
            .pipe((0, rxjs_js_1.mergeMap)(inputType => {
            switch (inputType) {
                case 'select':
                    return (0, rxjs_js_1.from)(handle.select(value).then(rxjs_js_1.noop));
                case 'contenteditable':
                case 'typeable-input':
                    return (0, rxjs_js_1.from)(handle.evaluate((input, newValue) => {
                        const currentValue = input.isContentEditable
                            ? input.innerText
                            : input.value;
                        // Clear the input if the current value does not match the filled
                        // out value.
                        if (newValue.length <= currentValue.length ||
                            !newValue.startsWith(input.value)) {
                            if (input.isContentEditable) {
                                input.innerText = '';
                            }
                            else {
                                input.value = '';
                            }
                            return newValue;
                        }
                        const originalValue = input.isContentEditable
                            ? input.innerText
                            : input.value;
                        // If the value is partially filled out, only type the rest. Move
                        // cursor to the end of the common prefix.
                        if (input.isContentEditable) {
                            input.innerText = '';
                            input.innerText = originalValue;
                        }
                        else {
                            input.value = '';
                            input.value = originalValue;
                        }
                        return newValue.substring(originalValue.length);
                    }, value)).pipe((0, rxjs_js_1.mergeMap)(textToType => {
                        return (0, rxjs_js_1.from)(handle.type(textToType));
                    }));
                case 'other-input':
                    return (0, rxjs_js_1.from)(handle.focus()).pipe((0, rxjs_js_1.mergeMap)(() => {
                        return (0, rxjs_js_1.from)(handle.evaluate((input, value) => {
                            input.value = value;
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }, value));
                    }));
                case 'unknown':
                    throw new Error(`Element cannot be filled out.`);
            }
        }))
            .pipe((0, rxjs_js_1.catchError)(err => {
            void handle.dispose().catch(util_js_1.debugError);
            throw err;
        }));
    }), this.operators.retryAndRaceWithSignalAndTimer(signal, cause));
}, _Locator_hover = function _Locator_hover(options) {
    const signal = options?.signal;
    const cause = new Error('Locator.hover');
    return this._wait(options).pipe(this.operators.conditions([
        __classPrivateFieldGet(this, _Locator_ensureElementIsInTheViewportIfNeeded, "f"),
        __classPrivateFieldGet(this, _Locator_waitForStableBoundingBoxIfNeeded, "f"),
    ], signal), (0, rxjs_js_1.tap)(() => {
        return this.emit(LocatorEvent.Action, undefined);
    }), (0, rxjs_js_1.mergeMap)(handle => {
        return (0, rxjs_js_1.from)(handle.hover()).pipe((0, rxjs_js_1.catchError)(err => {
            void handle.dispose().catch(util_js_1.debugError);
            throw err;
        }));
    }), this.operators.retryAndRaceWithSignalAndTimer(signal, cause));
}, _Locator_scroll = function _Locator_scroll(options) {
    const signal = options?.signal;
    const cause = new Error('Locator.scroll');
    return this._wait(options).pipe(this.operators.conditions([
        __classPrivateFieldGet(this, _Locator_ensureElementIsInTheViewportIfNeeded, "f"),
        __classPrivateFieldGet(this, _Locator_waitForStableBoundingBoxIfNeeded, "f"),
    ], signal), (0, rxjs_js_1.tap)(() => {
        return this.emit(LocatorEvent.Action, undefined);
    }), (0, rxjs_js_1.mergeMap)(handle => {
        return (0, rxjs_js_1.from)(handle.evaluate((el, scrollTop, scrollLeft) => {
            if (scrollTop !== undefined) {
                el.scrollTop = scrollTop;
            }
            if (scrollLeft !== undefined) {
                el.scrollLeft = scrollLeft;
            }
        }, options?.scrollTop, options?.scrollLeft)).pipe((0, rxjs_js_1.catchError)(err => {
            void handle.dispose().catch(util_js_1.debugError);
            throw err;
        }));
    }), this.operators.retryAndRaceWithSignalAndTimer(signal, cause));
};
exports.Locator = Locator;
/**
 * @internal
 */
class FunctionLocator extends Locator {
    static create(pageOrFrame, func) {
        return new FunctionLocator(pageOrFrame, func).setTimeout('getDefaultTimeout' in pageOrFrame
            ? pageOrFrame.getDefaultTimeout()
            : pageOrFrame.page().getDefaultTimeout());
    }
    constructor(pageOrFrame, func) {
        super();
        _FunctionLocator_pageOrFrame.set(this, void 0);
        _FunctionLocator_func.set(this, void 0);
        __classPrivateFieldSet(this, _FunctionLocator_pageOrFrame, pageOrFrame, "f");
        __classPrivateFieldSet(this, _FunctionLocator_func, func, "f");
    }
    _clone() {
        return new FunctionLocator(__classPrivateFieldGet(this, _FunctionLocator_pageOrFrame, "f"), __classPrivateFieldGet(this, _FunctionLocator_func, "f"));
    }
    _wait(options) {
        const signal = options?.signal;
        return (0, rxjs_js_1.defer)(() => {
            return (0, rxjs_js_1.from)(__classPrivateFieldGet(this, _FunctionLocator_pageOrFrame, "f").waitForFunction(__classPrivateFieldGet(this, _FunctionLocator_func, "f"), {
                timeout: this.timeout,
                signal,
            }));
        }).pipe((0, rxjs_js_1.throwIfEmpty)());
    }
}
_FunctionLocator_pageOrFrame = new WeakMap(), _FunctionLocator_func = new WeakMap();
exports.FunctionLocator = FunctionLocator;
/**
 * @internal
 */
class DelegatedLocator extends Locator {
    constructor(delegate) {
        super();
        _DelegatedLocator_delegate.set(this, void 0);
        __classPrivateFieldSet(this, _DelegatedLocator_delegate, delegate, "f");
        this.copyOptions(__classPrivateFieldGet(this, _DelegatedLocator_delegate, "f"));
    }
    get delegate() {
        return __classPrivateFieldGet(this, _DelegatedLocator_delegate, "f");
    }
    setTimeout(timeout) {
        const locator = super.setTimeout(timeout);
        __classPrivateFieldSet(locator, _DelegatedLocator_delegate, __classPrivateFieldGet(this, _DelegatedLocator_delegate, "f").setTimeout(timeout), "f");
        return locator;
    }
    setVisibility(visibility) {
        const locator = super.setVisibility(visibility);
        __classPrivateFieldSet(locator, _DelegatedLocator_delegate, __classPrivateFieldGet(locator, _DelegatedLocator_delegate, "f").setVisibility(visibility), "f");
        return locator;
    }
    setWaitForEnabled(value) {
        const locator = super.setWaitForEnabled(value);
        __classPrivateFieldSet(locator, _DelegatedLocator_delegate, __classPrivateFieldGet(this, _DelegatedLocator_delegate, "f").setWaitForEnabled(value), "f");
        return locator;
    }
    setEnsureElementIsInTheViewport(value) {
        const locator = super.setEnsureElementIsInTheViewport(value);
        __classPrivateFieldSet(locator, _DelegatedLocator_delegate, __classPrivateFieldGet(this, _DelegatedLocator_delegate, "f").setEnsureElementIsInTheViewport(value), "f");
        return locator;
    }
    setWaitForStableBoundingBox(value) {
        const locator = super.setWaitForStableBoundingBox(value);
        __classPrivateFieldSet(locator, _DelegatedLocator_delegate, __classPrivateFieldGet(this, _DelegatedLocator_delegate, "f").setWaitForStableBoundingBox(value), "f");
        return locator;
    }
}
_DelegatedLocator_delegate = new WeakMap();
exports.DelegatedLocator = DelegatedLocator;
/**
 * @internal
 */
class FilteredLocator extends DelegatedLocator {
    constructor(base, predicate) {
        super(base);
        _FilteredLocator_predicate.set(this, void 0);
        __classPrivateFieldSet(this, _FilteredLocator_predicate, predicate, "f");
    }
    _clone() {
        return new FilteredLocator(this.delegate.clone(), __classPrivateFieldGet(this, _FilteredLocator_predicate, "f")).copyOptions(this);
    }
    _wait(options) {
        return this.delegate._wait(options).pipe((0, rxjs_js_1.mergeMap)(handle => {
            return (0, rxjs_js_1.from)(Promise.resolve(__classPrivateFieldGet(this, _FilteredLocator_predicate, "f").call(this, handle, options?.signal))).pipe((0, rxjs_js_1.filter)(value => {
                return value;
            }), (0, rxjs_js_1.map)(() => {
                // SAFETY: It passed the predicate, so this is correct.
                return handle;
            }));
        }), (0, rxjs_js_1.throwIfEmpty)());
    }
}
_FilteredLocator_predicate = new WeakMap();
exports.FilteredLocator = FilteredLocator;
/**
 * @internal
 */
class MappedLocator extends DelegatedLocator {
    constructor(base, mapper) {
        super(base);
        _MappedLocator_mapper.set(this, void 0);
        __classPrivateFieldSet(this, _MappedLocator_mapper, mapper, "f");
    }
    _clone() {
        return new MappedLocator(this.delegate.clone(), __classPrivateFieldGet(this, _MappedLocator_mapper, "f")).copyOptions(this);
    }
    _wait(options) {
        return this.delegate._wait(options).pipe((0, rxjs_js_1.mergeMap)(handle => {
            return (0, rxjs_js_1.from)(Promise.resolve(__classPrivateFieldGet(this, _MappedLocator_mapper, "f").call(this, handle, options?.signal)));
        }));
    }
}
_MappedLocator_mapper = new WeakMap();
exports.MappedLocator = MappedLocator;
/**
 * @internal
 */
class NodeLocator extends Locator {
    static create(pageOrFrame, selector) {
        return new NodeLocator(pageOrFrame, selector).setTimeout('getDefaultTimeout' in pageOrFrame
            ? pageOrFrame.getDefaultTimeout()
            : pageOrFrame.page().getDefaultTimeout());
    }
    constructor(pageOrFrame, selector) {
        super();
        _NodeLocator_pageOrFrame.set(this, void 0);
        _NodeLocator_selector.set(this, void 0);
        /**
         * Waits for the element to become visible or hidden. visibility === 'visible'
         * means that the element has a computed style, the visibility property other
         * than 'hidden' or 'collapse' and non-empty bounding box. visibility ===
         * 'hidden' means the opposite of that.
         */
        _NodeLocator_waitForVisibilityIfNeeded.set(this, (handle) => {
            if (!this.visibility) {
                return rxjs_js_1.EMPTY;
            }
            return (() => {
                switch (this.visibility) {
                    case 'hidden':
                        return (0, rxjs_js_1.defer)(() => {
                            return (0, rxjs_js_1.from)(handle.isHidden());
                        });
                    case 'visible':
                        return (0, rxjs_js_1.defer)(() => {
                            return (0, rxjs_js_1.from)(handle.isVisible());
                        });
                }
            })().pipe((0, rxjs_js_1.first)(rxjs_js_1.identity), (0, rxjs_js_1.retry)({ delay: exports.RETRY_DELAY }), (0, rxjs_js_1.ignoreElements)());
        });
        __classPrivateFieldSet(this, _NodeLocator_pageOrFrame, pageOrFrame, "f");
        __classPrivateFieldSet(this, _NodeLocator_selector, selector, "f");
    }
    _clone() {
        return new NodeLocator(__classPrivateFieldGet(this, _NodeLocator_pageOrFrame, "f"), __classPrivateFieldGet(this, _NodeLocator_selector, "f")).copyOptions(this);
    }
    _wait(options) {
        const signal = options?.signal;
        return (0, rxjs_js_1.defer)(() => {
            return (0, rxjs_js_1.from)(__classPrivateFieldGet(this, _NodeLocator_pageOrFrame, "f").waitForSelector(__classPrivateFieldGet(this, _NodeLocator_selector, "f"), {
                visible: false,
                timeout: this._timeout,
                signal,
            }));
        }).pipe((0, rxjs_js_1.filter)((value) => {
            return value !== null;
        }), (0, rxjs_js_1.throwIfEmpty)(), this.operators.conditions([__classPrivateFieldGet(this, _NodeLocator_waitForVisibilityIfNeeded, "f")], signal));
    }
}
_NodeLocator_pageOrFrame = new WeakMap(), _NodeLocator_selector = new WeakMap(), _NodeLocator_waitForVisibilityIfNeeded = new WeakMap();
exports.NodeLocator = NodeLocator;
function checkLocatorArray(locators) {
    for (const locator of locators) {
        if (!(locator instanceof Locator)) {
            throw new Error('Unknown locator for race candidate');
        }
    }
    return locators;
}
/**
 * @internal
 */
class RaceLocator extends Locator {
    static create(locators) {
        const array = checkLocatorArray(locators);
        return new RaceLocator(array);
    }
    constructor(locators) {
        super();
        _RaceLocator_locators.set(this, void 0);
        __classPrivateFieldSet(this, _RaceLocator_locators, locators, "f");
    }
    _clone() {
        return new RaceLocator(__classPrivateFieldGet(this, _RaceLocator_locators, "f").map(locator => {
            return locator.clone();
        })).copyOptions(this);
    }
    _wait(options) {
        return (0, rxjs_js_1.race)(...__classPrivateFieldGet(this, _RaceLocator_locators, "f").map(locator => {
            return locator._wait(options);
        }));
    }
}
_RaceLocator_locators = new WeakMap();
exports.RaceLocator = RaceLocator;
/**
 * For observables coming from promises, a delay is needed, otherwise RxJS will
 * never yield in a permanent failure for a promise.
 *
 * We also don't want RxJS to do promise operations to often, so we bump the
 * delay up to 100ms.
 *
 * @internal
 */
exports.RETRY_DELAY = 100;
//# sourceMappingURL=locators.js.map