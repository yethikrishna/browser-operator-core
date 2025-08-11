/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { QueryHandler } from './QueryHandler.js';
/**
 * @internal
 */
export class CSSQueryHandler extends QueryHandler {
}
CSSQueryHandler.querySelector = (element, selector, { cssQuerySelector }) => {
    return cssQuerySelector(element, selector);
};
CSSQueryHandler.querySelectorAll = (element, selector, { cssQuerySelectorAll }) => {
    return cssQuerySelectorAll(element, selector);
};
//# sourceMappingURL=CSSQueryHandler.js.map
//# sourceMappingURL=CSSQueryHandler.js.map