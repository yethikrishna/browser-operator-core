/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { QueryHandler } from './QueryHandler.js';
/**
 * @internal
 */
export class TextQueryHandler extends QueryHandler {
}
TextQueryHandler.querySelectorAll = (element, selector, { textQuerySelectorAll }) => {
    return textQuerySelectorAll(element, selector);
};
//# sourceMappingURL=TextQueryHandler.js.map
//# sourceMappingURL=TextQueryHandler.js.map