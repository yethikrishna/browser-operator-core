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
var _SelectorComputer_customAttributes, _SelectorComputer_bindings, _SelectorComputer_logger, _SelectorComputer_nodes, _SelectorComputer_selectorFunctionsInOrder;
import { MonotonicArray } from './MonotonicArray.js';
import { computeARIASelector, } from './selectors/ARIASelector.js';
import { computeCSSSelector } from './selectors/CSSSelector.js';
import { computePierceSelector } from './selectors/PierceSelector.js';
import { computeTextSelector } from './selectors/TextSelector.js';
import { computeXPath } from './selectors/XPath.js';
const prefixSelector = (selector, prefix) => {
    if (selector === undefined) {
        return;
    }
    if (typeof selector === 'string') {
        return `${prefix}/${selector}`;
    }
    return selector.map(selector => `${prefix}/${selector}`);
};
export class SelectorComputer {
    constructor(bindings, logger, customAttribute = '', selectorTypesToRecord) {
        _SelectorComputer_customAttributes.set(this, [
            // Most common attributes first.
            'data-testid',
            'data-test',
            'data-qa',
            'data-cy',
            'data-test-id',
            'data-qa-id',
            'data-testing',
        ]);
        _SelectorComputer_bindings.set(this, void 0);
        _SelectorComputer_logger.set(this, void 0);
        _SelectorComputer_nodes.set(this, new MonotonicArray());
        _SelectorComputer_selectorFunctionsInOrder.set(this, void 0);
        __classPrivateFieldSet(this, _SelectorComputer_bindings, bindings, "f");
        __classPrivateFieldSet(this, _SelectorComputer_logger, logger, "f");
        let selectorOrder = [
            'aria',
            'css',
            'xpath',
            'pierce',
            'text',
        ];
        if (customAttribute) {
            // Custom DOM attributes indicate a preference for CSS/XPath selectors.
            __classPrivateFieldGet(this, _SelectorComputer_customAttributes, "f").unshift(customAttribute);
            selectorOrder = [
                'css',
                'xpath',
                'pierce',
                'aria',
                'text',
            ];
        }
        __classPrivateFieldSet(this, _SelectorComputer_selectorFunctionsInOrder, selectorOrder
            .filter(type => {
            if (selectorTypesToRecord) {
                return selectorTypesToRecord.includes(type);
            }
            return true;
        })
            .map(selectorType => {
            switch (selectorType) {
                case 'css':
                    return this.getCSSSelector.bind(this);
                case 'xpath':
                    return this.getXPathSelector.bind(this);
                case 'pierce':
                    return this.getPierceSelector.bind(this);
                case 'aria':
                    return this.getARIASelector.bind(this);
                case 'text':
                    return this.getTextSelector.bind(this);
                default:
                    throw new Error('Unknown selector type: ' + selectorType);
            }
        }), "f");
    }
    getSelectors(node) {
        const selectors = [];
        for (const getSelector of __classPrivateFieldGet(this, _SelectorComputer_selectorFunctionsInOrder, "f")) {
            const selector = getSelector(node);
            if (selector) {
                selectors.push(selector);
            }
        }
        return selectors;
    }
    getCSSSelector(node) {
        return __classPrivateFieldGet(this, _SelectorComputer_logger, "f").timed(`getCSSSelector: ${__classPrivateFieldGet(this, _SelectorComputer_nodes, "f").getOrInsert(node)} ${node.nodeName}`, () => {
            return computeCSSSelector(node, __classPrivateFieldGet(this, _SelectorComputer_customAttributes, "f"));
        });
    }
    getTextSelector(node) {
        return __classPrivateFieldGet(this, _SelectorComputer_logger, "f").timed(`getTextSelector: ${__classPrivateFieldGet(this, _SelectorComputer_nodes, "f").getOrInsert(node)} ${node.nodeName}`, () => {
            return prefixSelector(computeTextSelector(node), 'text');
        });
    }
    getXPathSelector(node) {
        return __classPrivateFieldGet(this, _SelectorComputer_logger, "f").timed(`getXPathSelector: ${__classPrivateFieldGet(this, _SelectorComputer_nodes, "f").getOrInsert(node)} ${node.nodeName}`, () => {
            return prefixSelector(computeXPath(node, true, __classPrivateFieldGet(this, _SelectorComputer_customAttributes, "f")), 'xpath');
        });
    }
    getPierceSelector(node) {
        return __classPrivateFieldGet(this, _SelectorComputer_logger, "f").timed(`getPierceSelector: ${__classPrivateFieldGet(this, _SelectorComputer_nodes, "f").getOrInsert(node)} ${node.nodeName}`, () => {
            return prefixSelector(computePierceSelector(node, __classPrivateFieldGet(this, _SelectorComputer_customAttributes, "f")), 'pierce');
        });
    }
    getARIASelector(node) {
        return __classPrivateFieldGet(this, _SelectorComputer_logger, "f").timed(`getARIASelector: ${__classPrivateFieldGet(this, _SelectorComputer_nodes, "f").getOrInsert(node)} ${node.nodeName}`, () => {
            return prefixSelector(computeARIASelector(node, __classPrivateFieldGet(this, _SelectorComputer_bindings, "f")), 'aria');
        });
    }
}
_SelectorComputer_customAttributes = new WeakMap(), _SelectorComputer_bindings = new WeakMap(), _SelectorComputer_logger = new WeakMap(), _SelectorComputer_nodes = new WeakMap(), _SelectorComputer_selectorFunctionsInOrder = new WeakMap();
//# sourceMappingURL=SelectorComputer.js.map