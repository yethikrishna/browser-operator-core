// Copyright 2019 The Chromium Authors. All rights reserved.
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
var _CSSOverviewSidebarPanel_instances, _CSSOverviewSidebarPanel_view, _CSSOverviewSidebarPanel_items, _CSSOverviewSidebarPanel_selectedId, _CSSOverviewSidebarPanel_onItemSelected, _CSSOverviewSidebarPanel_onReset, _CSSOverviewSidebarPanel_select, _CSSOverviewSidebarPanel_onItemClick, _CSSOverviewSidebarPanel_onItemKeyDown;
import '../../ui/legacy/legacy.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as UI from '../../ui/legacy/legacy.js';
import { Directives, html, render } from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import cssOverviewSidebarPanelStyles from './cssOverviewSidebarPanel.css.js';
const { classMap } = Directives;
const UIStrings = {
    /**
     *@description Label for the 'Clear overview' button in the CSS overview report
     */
    clearOverview: 'Clear overview',
    /**
     * @description Accessible label for the CSS overview panel sidebar
     */
    cssOverviewPanelSidebar: 'CSS overview panel sidebar',
};
const str_ = i18n.i18n.registerUIStrings('panels/css_overview/CSSOverviewSidebarPanel.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export const DEFAULT_VIEW = (input, _output, target) => {
    const onClick = (event) => {
        if (event.target instanceof HTMLElement) {
            const id = event.target.dataset.id;
            if (id) {
                input.onItemClick(id);
            }
        }
    };
    const onKeyDown = (event) => {
        if (event.key !== 'Enter' && event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            return;
        }
        if (event.target instanceof HTMLElement) {
            const id = event.target.dataset.id;
            if (id) {
                input.onItemKeyDown(id, event.key);
            }
        }
        event.consume(true);
    };
    // clang-format off
    render(html `
      <style>${cssOverviewSidebarPanelStyles}</style>
      <div class="overview-sidebar-panel" @click=${onClick} @keydown=${onKeyDown}
           aria-label=${i18nString(UIStrings.cssOverviewPanelSidebar)} role="tree">
        <div class="overview-toolbar">
          <devtools-toolbar>
            <devtools-button title=${i18nString(UIStrings.clearOverview)} @click=${input.onReset}
                .iconName=${'clear'} .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
                .jslogContext=${'css-overview.clear-overview'}></devtools-button>
          </devtools-toolbar>
        </div>
        ${input.items.map(({ id, name }) => {
        const selected = id === input.selectedId;
        return html `
            <div class="overview-sidebar-panel-item ${classMap({ selected })}"
                ?autofocus=${selected}
                role="treeitem" data-id=${id} tabindex="0"
                jslog=${VisualLogging.item(`css-overview.${id}`)
            .track({ click: true, keydown: 'Enter|ArrowUp|ArrowDown' })}>
              ${name}
            </div>`;
    })}
      </div>`, target, { host: input });
    // clang-format on
};
export class CSSOverviewSidebarPanel extends UI.Widget.VBox {
    constructor(element, view = DEFAULT_VIEW) {
        super(true, true, element);
        _CSSOverviewSidebarPanel_instances.add(this);
        _CSSOverviewSidebarPanel_view.set(this, void 0);
        _CSSOverviewSidebarPanel_items.set(this, []);
        _CSSOverviewSidebarPanel_selectedId.set(this, void 0);
        _CSSOverviewSidebarPanel_onItemSelected.set(this, (_id, _shouldFocus) => { });
        _CSSOverviewSidebarPanel_onReset.set(this, () => { });
        __classPrivateFieldSet(this, _CSSOverviewSidebarPanel_view, view, "f");
    }
    performUpdate() {
        const viewInput = {
            items: __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_items, "f"),
            selectedId: __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_selectedId, "f"),
            onReset: __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_onReset, "f"),
            onItemClick: __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_instances, "m", _CSSOverviewSidebarPanel_onItemClick).bind(this),
            onItemKeyDown: __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_instances, "m", _CSSOverviewSidebarPanel_onItemKeyDown).bind(this)
        };
        __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_view, "f").call(this, viewInput, {}, this.contentElement);
    }
    set items(items) {
        __classPrivateFieldSet(this, _CSSOverviewSidebarPanel_items, items, "f");
        this.requestUpdate();
    }
    set selectedId(id) {
        void __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_instances, "m", _CSSOverviewSidebarPanel_select).call(this, id);
    }
    set onItemSelected(callback) {
        __classPrivateFieldSet(this, _CSSOverviewSidebarPanel_onItemSelected, callback, "f");
        this.requestUpdate();
    }
    set onReset(callback) {
        __classPrivateFieldSet(this, _CSSOverviewSidebarPanel_onReset, callback, "f");
        this.requestUpdate();
    }
}
_CSSOverviewSidebarPanel_view = new WeakMap(), _CSSOverviewSidebarPanel_items = new WeakMap(), _CSSOverviewSidebarPanel_selectedId = new WeakMap(), _CSSOverviewSidebarPanel_onItemSelected = new WeakMap(), _CSSOverviewSidebarPanel_onReset = new WeakMap(), _CSSOverviewSidebarPanel_instances = new WeakSet(), _CSSOverviewSidebarPanel_select = function _CSSOverviewSidebarPanel_select(id, shouldFocus = false) {
    __classPrivateFieldSet(this, _CSSOverviewSidebarPanel_selectedId, id, "f");
    this.requestUpdate();
    __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_onItemSelected, "f").call(this, id, shouldFocus);
    return this.updateComplete;
}, _CSSOverviewSidebarPanel_onItemClick = function _CSSOverviewSidebarPanel_onItemClick(id) {
    void __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_instances, "m", _CSSOverviewSidebarPanel_select).call(this, id, false);
}, _CSSOverviewSidebarPanel_onItemKeyDown = function _CSSOverviewSidebarPanel_onItemKeyDown(id, key) {
    if (key === 'Enter') {
        void __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_instances, "m", _CSSOverviewSidebarPanel_select).call(this, id, true);
    }
    else { // arrow up/down key
        let currItemIndex = -1;
        for (let idx = 0; idx < __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_items, "f").length; idx++) {
            if (__classPrivateFieldGet(this, _CSSOverviewSidebarPanel_items, "f")[idx].id === id) {
                currItemIndex = idx;
                break;
            }
        }
        if (currItemIndex < 0) {
            return;
        }
        const moveTo = (key === 'ArrowDown' ? 1 : -1);
        const nextItemIndex = (currItemIndex + moveTo) % __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_items, "f").length;
        const nextItemId = __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_items, "f")[nextItemIndex].id;
        if (!nextItemId) {
            return;
        }
        void __classPrivateFieldGet(this, _CSSOverviewSidebarPanel_instances, "m", _CSSOverviewSidebarPanel_select).call(this, nextItemId, false).then(() => {
            this.element.blur();
            this.element.focus();
        });
    }
};
//# sourceMappingURL=CSSOverviewSidebarPanel.js.map