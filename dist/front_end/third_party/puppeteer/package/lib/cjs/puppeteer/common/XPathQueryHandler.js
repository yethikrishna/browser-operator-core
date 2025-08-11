"use strict";
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.XPathQueryHandler = void 0;
const QueryHandler_js_1 = require("./QueryHandler.js");
/**
 * @internal
 */
class XPathQueryHandler extends QueryHandler_js_1.QueryHandler {
}
XPathQueryHandler.querySelectorAll = (element, selector, { xpathQuerySelectorAll }) => {
    return xpathQuerySelectorAll(element, selector);
};
XPathQueryHandler.querySelector = (element, selector, { xpathQuerySelectorAll }) => {
    for (const result of xpathQuerySelectorAll(element, selector, 1)) {
        return result;
    }
    return null;
};
exports.XPathQueryHandler = XPathQueryHandler;
//# sourceMappingURL=XPathQueryHandler.js.map