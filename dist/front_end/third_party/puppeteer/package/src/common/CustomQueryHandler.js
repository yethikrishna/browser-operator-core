/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _CustomQueryHandlerRegistry_handlers;
import { assert } from '../util/assert.js';
import { interpolateFunction, stringifyFunction } from '../util/Function.js';
import { QueryHandler, } from './QueryHandler.js';
import { scriptInjector } from './ScriptInjector.js';
/**
 * The registry of {@link CustomQueryHandler | custom query handlers}.
 *
 * @example
 *
 * ```ts
 * Puppeteer.customQueryHandlers.register('lit', { … });
 * const aHandle = await page.$('lit/…');
 * ```
 *
 * @internal
 */
export class CustomQueryHandlerRegistry {
    constructor() {
        _CustomQueryHandlerRegistry_handlers.set(this, new Map());
    }
    get(name) {
        const handler = __classPrivateFieldGet(this, _CustomQueryHandlerRegistry_handlers, "f").get(name);
        return handler ? handler[1] : undefined;
    }
    /**
     * Registers a {@link CustomQueryHandler | custom query handler}.
     *
     * @remarks
     * After registration, the handler can be used everywhere where a selector is
     * expected by prepending the selection string with `<name>/`. The name is
     * only allowed to consist of lower- and upper case latin letters.
     *
     * @example
     *
     * ```ts
     * Puppeteer.customQueryHandlers.register('lit', { … });
     * const aHandle = await page.$('lit/…');
     * ```
     *
     * @param name - Name to register under.
     * @param queryHandler - {@link CustomQueryHandler | Custom query handler} to
     * register.
     */
    register(name, handler) {
        var _a;
        assert(!__classPrivateFieldGet(this, _CustomQueryHandlerRegistry_handlers, "f").has(name), `Cannot register over existing handler: ${name}`);
        assert(/^[a-zA-Z]+$/.test(name), `Custom query handler names may only contain [a-zA-Z]`);
        assert(handler.queryAll || handler.queryOne, `At least one query method must be implemented.`);
        const Handler = (_a = class extends QueryHandler {
            },
            __setFunctionName(_a, "Handler"),
            _a.querySelectorAll = interpolateFunction((node, selector, PuppeteerUtil) => {
                return PuppeteerUtil.customQuerySelectors
                    .get(PLACEHOLDER('name'))
                    .querySelectorAll(node, selector);
            }, { name: JSON.stringify(name) }),
            _a.querySelector = interpolateFunction((node, selector, PuppeteerUtil) => {
                return PuppeteerUtil.customQuerySelectors
                    .get(PLACEHOLDER('name'))
                    .querySelector(node, selector);
            }, { name: JSON.stringify(name) }),
            _a);
        const registerScript = interpolateFunction((PuppeteerUtil) => {
            PuppeteerUtil.customQuerySelectors.register(PLACEHOLDER('name'), {
                queryAll: PLACEHOLDER('queryAll'),
                queryOne: PLACEHOLDER('queryOne'),
            });
        }, {
            name: JSON.stringify(name),
            queryAll: handler.queryAll
                ? stringifyFunction(handler.queryAll)
                : String(undefined),
            queryOne: handler.queryOne
                ? stringifyFunction(handler.queryOne)
                : String(undefined),
        }).toString();
        __classPrivateFieldGet(this, _CustomQueryHandlerRegistry_handlers, "f").set(name, [registerScript, Handler]);
        scriptInjector.append(registerScript);
    }
    /**
     * Unregisters the {@link CustomQueryHandler | custom query handler} for the
     * given name.
     *
     * @throws `Error` if there is no handler under the given name.
     */
    unregister(name) {
        const handler = __classPrivateFieldGet(this, _CustomQueryHandlerRegistry_handlers, "f").get(name);
        if (!handler) {
            throw new Error(`Cannot unregister unknown handler: ${name}`);
        }
        scriptInjector.pop(handler[0]);
        __classPrivateFieldGet(this, _CustomQueryHandlerRegistry_handlers, "f").delete(name);
    }
    /**
     * Gets the names of all {@link CustomQueryHandler | custom query handlers}.
     */
    names() {
        return [...__classPrivateFieldGet(this, _CustomQueryHandlerRegistry_handlers, "f").keys()];
    }
    /**
     * Unregisters all custom query handlers.
     */
    clear() {
        for (const [registerScript] of __classPrivateFieldGet(this, _CustomQueryHandlerRegistry_handlers, "f")) {
            scriptInjector.pop(registerScript);
        }
        __classPrivateFieldGet(this, _CustomQueryHandlerRegistry_handlers, "f").clear();
    }
}
_CustomQueryHandlerRegistry_handlers = new WeakMap();
/**
 * @internal
 */
export const customQueryHandlers = new CustomQueryHandlerRegistry();
//# sourceMappingURL=CustomQueryHandler.js.map