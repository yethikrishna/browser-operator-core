// Copyright (c) 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _LinearMemoryHighlightChipList_instances, _LinearMemoryHighlightChipList_shadow, _LinearMemoryHighlightChipList_highlightedAreas, _LinearMemoryHighlightChipList_focusedMemoryHighlight, _LinearMemoryHighlightChipList_render, _LinearMemoryHighlightChipList_createChip, _LinearMemoryHighlightChipList_onJumpToHighlightClick, _LinearMemoryHighlightChipList_onDeleteHighlightClick;
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import linearMemoryHighlightChipListStyles from './linearMemoryHighlightChipList.css.js';
const UIStrings = {
    /**
     *@description Tooltip text that appears when hovering over an inspected variable's button in the Linear Memory Highlight Chip List.
    Clicking the button changes the displayed slice of computer memory in the Linear Memory inspector to contain the inspected variable's bytes.
     */
    jumpToAddress: 'Jump to this memory',
    /**
     *@description Tooltip text that appears when hovering over an inspected variable's delete button in the Linear Memory Highlight Chip List.
     Clicking the delete button stops highlighting the variable's memory in the Linear Memory inspector.
     'Memory' is a slice of bytes in the computer memory.
     */
    deleteHighlight: 'Stop highlighting this memory',
};
const str_ = i18n.i18n.registerUIStrings('panels/linear_memory_inspector/components/LinearMemoryHighlightChipList.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { render, html } = Lit;
export class DeleteMemoryHighlightEvent extends Event {
    constructor(highlightInfo) {
        super(DeleteMemoryHighlightEvent.eventName, { bubbles: true, composed: true });
        this.data = highlightInfo;
    }
}
DeleteMemoryHighlightEvent.eventName = 'deletememoryhighlight';
export class JumpToHighlightedMemoryEvent extends Event {
    constructor(address) {
        super(JumpToHighlightedMemoryEvent.eventName);
        this.data = address;
    }
}
JumpToHighlightedMemoryEvent.eventName = 'jumptohighlightedmemory';
export class LinearMemoryHighlightChipList extends HTMLElement {
    constructor() {
        super(...arguments);
        _LinearMemoryHighlightChipList_instances.add(this);
        _LinearMemoryHighlightChipList_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _LinearMemoryHighlightChipList_highlightedAreas.set(this, []);
        _LinearMemoryHighlightChipList_focusedMemoryHighlight.set(this, void 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _LinearMemoryHighlightChipList_highlightedAreas, data.highlightInfos, "f");
        __classPrivateFieldSet(this, _LinearMemoryHighlightChipList_focusedMemoryHighlight, data.focusedMemoryHighlight, "f");
        __classPrivateFieldGet(this, _LinearMemoryHighlightChipList_instances, "m", _LinearMemoryHighlightChipList_render).call(this);
    }
}
_LinearMemoryHighlightChipList_shadow = new WeakMap(), _LinearMemoryHighlightChipList_highlightedAreas = new WeakMap(), _LinearMemoryHighlightChipList_focusedMemoryHighlight = new WeakMap(), _LinearMemoryHighlightChipList_instances = new WeakSet(), _LinearMemoryHighlightChipList_render = function _LinearMemoryHighlightChipList_render() {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    const chips = [];
    for (const highlightInfo of __classPrivateFieldGet(this, _LinearMemoryHighlightChipList_highlightedAreas, "f")) {
        chips.push(__classPrivateFieldGet(this, _LinearMemoryHighlightChipList_instances, "m", _LinearMemoryHighlightChipList_createChip).call(this, highlightInfo));
    }
    const result = html `
            <style>${linearMemoryHighlightChipListStyles}</style>
            <div class="highlight-chip-list">
              ${chips}
            </div>
        `;
    render(result, __classPrivateFieldGet(this, _LinearMemoryHighlightChipList_shadow, "f"), { host: this });
    // clang-format on
}, _LinearMemoryHighlightChipList_createChip = function _LinearMemoryHighlightChipList_createChip(highlightInfo) {
    const expressionName = highlightInfo.name || '<anonymous>';
    const expressionType = highlightInfo.type;
    const isFocused = highlightInfo === __classPrivateFieldGet(this, _LinearMemoryHighlightChipList_focusedMemoryHighlight, "f");
    const classMap = {
        focused: isFocused,
        'highlight-chip': true,
    };
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <div class=${Lit.Directives.classMap(classMap)}>
        <button class="jump-to-highlight-button" title=${i18nString(UIStrings.jumpToAddress)}
            jslog=${VisualLogging.action('linear-memory-inspector.jump-to-highlight').track({ click: true })}
            @click=${() => __classPrivateFieldGet(this, _LinearMemoryHighlightChipList_instances, "m", _LinearMemoryHighlightChipList_onJumpToHighlightClick).call(this, highlightInfo.startAddress)}>
          <span class="source-code">
            <span class="value">${expressionName}</span>
            <span class="separator">: </span>
            <span>${expressionType}</span>
          </span>
        </button>
        <div class="delete-highlight-container">
          <button class="delete-highlight-button" title=${i18nString(UIStrings.deleteHighlight)}
              jslog=${VisualLogging.action('linear-memory-inspector.delete-highlight').track({ click: true })}
              @click=${() => __classPrivateFieldGet(this, _LinearMemoryHighlightChipList_instances, "m", _LinearMemoryHighlightChipList_onDeleteHighlightClick).call(this, highlightInfo)}>
            <devtools-icon .data=${{
        iconName: 'cross',
        color: 'var(--icon-default-hover)',
        width: '16px',
    }}>
            </devtools-icon>
          </button>
        </div>
      </div>
    `;
    // clang-format off
}, _LinearMemoryHighlightChipList_onJumpToHighlightClick = function _LinearMemoryHighlightChipList_onJumpToHighlightClick(startAddress) {
    this.dispatchEvent(new JumpToHighlightedMemoryEvent(startAddress));
}, _LinearMemoryHighlightChipList_onDeleteHighlightClick = function _LinearMemoryHighlightChipList_onDeleteHighlightClick(highlight) {
    this.dispatchEvent(new DeleteMemoryHighlightEvent(highlight));
};
customElements.define('devtools-linear-memory-highlight-chip-list', LinearMemoryHighlightChipList);
//# sourceMappingURL=LinearMemoryHighlightChipList.js.map