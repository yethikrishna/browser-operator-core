/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { QueryHandler } from './QueryHandler.js';
/**
 * @internal
 */
export class PierceQueryHandler extends QueryHandler {
}
PierceQueryHandler.querySelector = (element, selector, { pierceQuerySelector }) => {
    return pierceQuerySelector(element, selector);
};
PierceQueryHandler.querySelectorAll = (element, selector, { pierceQuerySelectorAll }) => {
    return pierceQuerySelectorAll(element, selector);
};
//# sourceMappingURL=PierceQueryHandler.js.map