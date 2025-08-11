"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _BrowserContext_pageScreenshotMutex, _BrowserContext_screenshotOperationsCount;
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserContext = void 0;
const rxjs_js_1 = require("../../third_party/rxjs/rxjs.js");
const EventEmitter_js_1 = require("../common/EventEmitter.js");
const util_js_1 = require("../common/util.js");
const disposable_js_1 = require("../util/disposable.js");
const Mutex_js_1 = require("../util/Mutex.js");
/**
 * {@link BrowserContext} represents individual user contexts within a
 * {@link Browser | browser}.
 *
 * When a {@link Browser | browser} is launched, it has at least one default
 * {@link BrowserContext | browser context}. Others can be created
 * using {@link Browser.createBrowserContext}. Each context has isolated storage
 * (cookies/localStorage/etc.)
 *
 * {@link BrowserContext} {@link EventEmitter | emits} various events which are
 * documented in the {@link BrowserContextEvent} enum.
 *
 * If a {@link Page | page} opens another {@link Page | page}, e.g. using
 * `window.open`, the popup will belong to the parent {@link Page.browserContext
 * | page's browser context}.
 *
 * @example Creating a new {@link BrowserContext | browser context}:
 *
 * ```ts
 * // Create a new browser context
 * const context = await browser.createBrowserContext();
 * // Create a new page inside context.
 * const page = await context.newPage();
 * // ... do stuff with page ...
 * await page.goto('https://example.com');
 * // Dispose context once it's no longer needed.
 * await context.close();
 * ```
 *
 * @remarks
 *
 * In Chrome all non-default contexts are incognito,
 * and {@link Browser.defaultBrowserContext | default browser context}
 * might be incognito if you provide the `--incognito` argument when launching
 * the browser.
 *
 * @public
 */
class BrowserContext extends EventEmitter_js_1.EventEmitter {
    /**
     * @internal
     */
    constructor() {
        super();
        /**
         * If defined, indicates an ongoing screenshot opereation.
         */
        _BrowserContext_pageScreenshotMutex.set(this, void 0);
        _BrowserContext_screenshotOperationsCount.set(this, 0);
    }
    /**
     * @internal
     */
    startScreenshot() {
        var _a;
        const mutex = __classPrivateFieldGet(this, _BrowserContext_pageScreenshotMutex, "f") || new Mutex_js_1.Mutex();
        __classPrivateFieldSet(this, _BrowserContext_pageScreenshotMutex, mutex, "f");
        __classPrivateFieldSet(this, _BrowserContext_screenshotOperationsCount, (_a = __classPrivateFieldGet(this, _BrowserContext_screenshotOperationsCount, "f"), _a++, _a), "f");
        return mutex.acquire(() => {
            var _a;
            __classPrivateFieldSet(this, _BrowserContext_screenshotOperationsCount, (_a = __classPrivateFieldGet(this, _BrowserContext_screenshotOperationsCount, "f"), _a--, _a), "f");
            if (__classPrivateFieldGet(this, _BrowserContext_screenshotOperationsCount, "f") === 0) {
                // Remove the mutex to indicate no ongoing screenshot operation.
                __classPrivateFieldSet(this, _BrowserContext_pageScreenshotMutex, undefined, "f");
            }
        });
    }
    /**
     * @internal
     */
    waitForScreenshotOperations() {
        return __classPrivateFieldGet(this, _BrowserContext_pageScreenshotMutex, "f")?.acquire();
    }
    /**
     * Waits until a {@link Target | target} matching the given `predicate`
     * appears and returns it.
     *
     * This will look all open {@link BrowserContext | browser contexts}.
     *
     * @example Finding a target for a page opened via `window.open`:
     *
     * ```ts
     * await page.evaluate(() => window.open('https://www.example.com/'));
     * const newWindowTarget = await browserContext.waitForTarget(
     *   target => target.url() === 'https://www.example.com/',
     * );
     * ```
     */
    async waitForTarget(predicate, options = {}) {
        const { timeout: ms = 30000 } = options;
        return await (0, rxjs_js_1.firstValueFrom)((0, rxjs_js_1.merge)((0, util_js_1.fromEmitterEvent)(this, "targetcreated" /* BrowserContextEvent.TargetCreated */), (0, util_js_1.fromEmitterEvent)(this, "targetchanged" /* BrowserContextEvent.TargetChanged */), (0, rxjs_js_1.from)(this.targets())).pipe((0, util_js_1.filterAsync)(predicate), (0, rxjs_js_1.raceWith)((0, util_js_1.timeout)(ms))));
    }
    /**
     * Removes cookie in the browser context
     * @param cookies - {@link Cookie | cookie} to remove
     */
    async deleteCookie(...cookies) {
        return await this.setCookie(...cookies.map(cookie => {
            return {
                ...cookie,
                expires: 1,
            };
        }));
    }
    /**
     * Whether this {@link BrowserContext | browser context} is closed.
     */
    get closed() {
        return !this.browser().browserContexts().includes(this);
    }
    /**
     * Identifier for this {@link BrowserContext | browser context}.
     */
    get id() {
        return undefined;
    }
    /** @internal */
    [(_BrowserContext_pageScreenshotMutex = new WeakMap(), _BrowserContext_screenshotOperationsCount = new WeakMap(), disposable_js_1.disposeSymbol)]() {
        return void this.close().catch(util_js_1.debugError);
    }
    /** @internal */
    [disposable_js_1.asyncDisposeSymbol]() {
        return this.close();
    }
}
exports.BrowserContext = BrowserContext;
//# sourceMappingURL=BrowserContext.js.map