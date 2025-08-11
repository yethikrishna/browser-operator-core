var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CustomQuerySelectorRegistry_selectors;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * This class mimics the injected {@link CustomQuerySelectorRegistry}.
 */
class CustomQuerySelectorRegistry {
    constructor() {
        _CustomQuerySelectorRegistry_selectors.set(this, new Map());
    }
    register(name, handler) {
        if (!handler.queryOne && handler.queryAll) {
            const querySelectorAll = handler.queryAll;
            handler.queryOne = (node, selector) => {
                for (const result of querySelectorAll(node, selector)) {
                    return result;
                }
                return null;
            };
        }
        else if (handler.queryOne && !handler.queryAll) {
            const querySelector = handler.queryOne;
            handler.queryAll = (node, selector) => {
                const result = querySelector(node, selector);
                return result ? [result] : [];
            };
        }
        else if (!handler.queryOne || !handler.queryAll) {
            throw new Error('At least one query method must be defined.');
        }
        __classPrivateFieldGet(this, _CustomQuerySelectorRegistry_selectors, "f").set(name, {
            querySelector: handler.queryOne,
            querySelectorAll: handler.queryAll,
        });
    }
    unregister(name) {
        __classPrivateFieldGet(this, _CustomQuerySelectorRegistry_selectors, "f").delete(name);
    }
    get(name) {
        return __classPrivateFieldGet(this, _CustomQuerySelectorRegistry_selectors, "f").get(name);
    }
    clear() {
        __classPrivateFieldGet(this, _CustomQuerySelectorRegistry_selectors, "f").clear();
    }
}
_CustomQuerySelectorRegistry_selectors = new WeakMap();
export const customQuerySelectors = new CustomQuerySelectorRegistry();
//# sourceMappingURL=CustomQuerySelector.js.map
//# sourceMappingURL=CustomQuerySelector.js.map