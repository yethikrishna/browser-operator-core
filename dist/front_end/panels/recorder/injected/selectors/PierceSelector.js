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
var _PierceSelectorRangeOpts_selector, _PierceSelectorRangeOpts_attributes, _PierceSelectorRangeOpts_depth;
import { pierceQuerySelectorAll, } from '../../../../third_party/puppeteer/package/lib/esm/puppeteer/injected/PierceQuerySelector.js';
import { findMinMax, SelectorRangeOps, } from './CSSSelector.js';
class PierceSelectorRangeOpts {
    constructor(attributes = []) {
        _PierceSelectorRangeOpts_selector.set(this, [[]]);
        _PierceSelectorRangeOpts_attributes.set(this, void 0);
        _PierceSelectorRangeOpts_depth.set(this, 0);
        __classPrivateFieldSet(this, _PierceSelectorRangeOpts_attributes, attributes, "f");
    }
    inc(node) {
        return node.getRootNode();
    }
    self(node) {
        return node instanceof ShadowRoot ? node.host : node;
    }
    valueOf(node) {
        const selector = findMinMax([node, node.getRootNode()], new SelectorRangeOps(__classPrivateFieldGet(this, _PierceSelectorRangeOpts_attributes, "f")));
        if (__classPrivateFieldGet(this, _PierceSelectorRangeOpts_depth, "f") > 1) {
            __classPrivateFieldGet(this, _PierceSelectorRangeOpts_selector, "f").unshift([selector]);
        }
        else {
            __classPrivateFieldGet(this, _PierceSelectorRangeOpts_selector, "f")[0].unshift(selector);
        }
        __classPrivateFieldSet(this, _PierceSelectorRangeOpts_depth, 0, "f");
        return __classPrivateFieldGet(this, _PierceSelectorRangeOpts_selector, "f");
    }
    gte(selector, node) {
        var _a;
        __classPrivateFieldSet(this, _PierceSelectorRangeOpts_depth, (_a = __classPrivateFieldGet(this, _PierceSelectorRangeOpts_depth, "f"), ++_a), "f");
        // Note we use some insider logic here. `valueOf(node)` will always
        // correspond to `selector.flat().slice(1)`, so it suffices to check
        // uniqueness for `selector.flat()[0]`.
        return pierceQuerySelectorAll(node, selector[0][0]).length === 1;
    }
}
_PierceSelectorRangeOpts_selector = new WeakMap(), _PierceSelectorRangeOpts_attributes = new WeakMap(), _PierceSelectorRangeOpts_depth = new WeakMap();
/**
 * Computes the pierce CSS selector for a node.
 *
 * @param node - The node to compute.
 * @returns The computed pierce CSS selector.
 *
 * @internal
 */
export const computePierceSelector = (node, attributes) => {
    try {
        const ops = new PierceSelectorRangeOpts(attributes);
        return findMinMax([node, document], ops).flat();
    }
    catch {
        return undefined;
    }
};
export const queryPierceSelectorAll = (selectors) => {
    if (typeof selectors === 'string') {
        selectors = [selectors];
    }
    else if (selectors.length === 0) {
        return [];
    }
    let lists = [[document.documentElement]];
    do {
        const selector = selectors.shift();
        const roots = [];
        for (const nodes of lists) {
            for (const node of nodes) {
                const list = pierceQuerySelectorAll(node.shadowRoot ?? node, selector);
                if (list.length > 0) {
                    roots.push(list);
                }
            }
        }
        lists = roots;
    } while (selectors.length > 0 && lists.length > 0);
    return lists.flatMap(list => [...list]);
};
//# sourceMappingURL=PierceSelector.js.map