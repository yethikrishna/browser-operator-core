// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SelectButton_instances, _SelectButton_shadow, _SelectButton_props, _SelectButton_handleClick, _SelectButton_handleSelectMenuSelect, _SelectButton_renderSelectItem, _SelectButton_renderSelectGroup, _SelectButton_getTitle, _SelectButton_render;
import '../../../ui/components/menus/menus.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Models from '../models/models.js';
import selectButtonStyles from './selectButton.css.js'; // Keep the import for the raw string
const { html, Directives: { ifDefined, classMap } } = Lit;
export var Variant;
(function (Variant) {
    Variant["PRIMARY"] = "primary";
    Variant["OUTLINED"] = "outlined";
})(Variant || (Variant = {}));
export class SelectButtonClickEvent extends Event {
    constructor(value) {
        super(SelectButtonClickEvent.eventName, { bubbles: true, composed: true });
        this.value = value;
    }
}
SelectButtonClickEvent.eventName = 'selectbuttonclick';
export class SelectMenuSelectedEvent extends Event {
    constructor(value) {
        super(SelectMenuSelectedEvent.eventName, { bubbles: true, composed: true });
        this.value = value;
    }
}
SelectMenuSelectedEvent.eventName = 'selectmenuselected';
export class SelectButton extends HTMLElement {
    constructor() {
        super(...arguments);
        _SelectButton_instances.add(this);
        _SelectButton_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _SelectButton_props.set(this, {
            disabled: false,
            value: '',
            items: [],
            buttonLabel: '',
            groups: [],
            variant: "primary" /* Variant.PRIMARY */,
        });
        _SelectButton_render.set(this, () => {
            const hasGroups = Boolean(__classPrivateFieldGet(this, _SelectButton_props, "f").groups.length);
            const items = hasGroups ? __classPrivateFieldGet(this, _SelectButton_props, "f").groups.flatMap(group => group.items) : __classPrivateFieldGet(this, _SelectButton_props, "f").items;
            const selectedItem = items.find(item => item.value === __classPrivateFieldGet(this, _SelectButton_props, "f").value) || items[0];
            if (!selectedItem) {
                return;
            }
            const classes = {
                primary: __classPrivateFieldGet(this, _SelectButton_props, "f").variant === "primary" /* Variant.PRIMARY */,
                secondary: __classPrivateFieldGet(this, _SelectButton_props, "f").variant === "outlined" /* Variant.OUTLINED */,
            };
            const buttonVariant = __classPrivateFieldGet(this, _SelectButton_props, "f").variant === "outlined" /* Variant.OUTLINED */ ? "outlined" /* Buttons.Button.Variant.OUTLINED */ : "primary" /* Buttons.Button.Variant.PRIMARY */;
            const menuLabel = selectedItem.buttonLabel ? selectedItem.buttonLabel() : selectedItem.label();
            // clang-format off
            Lit.render(html `
      <style>${UI.inspectorCommonStyles}</style>
      <style>${selectButtonStyles}</style>
      <div class="select-button" title=${ifDefined(__classPrivateFieldGet(this, _SelectButton_instances, "m", _SelectButton_getTitle).call(this, menuLabel))}>
      <select
      class=${classMap(classes)}
      ?disabled=${__classPrivateFieldGet(this, _SelectButton_props, "f").disabled}
      jslog=${VisualLogging.dropDown('network-conditions').track({ change: true })}
      @change=${__classPrivateFieldGet(this, _SelectButton_instances, "m", _SelectButton_handleSelectMenuSelect)}>
        ${hasGroups
                ? __classPrivateFieldGet(this, _SelectButton_props, "f").groups.map(group => __classPrivateFieldGet(this, _SelectButton_instances, "m", _SelectButton_renderSelectGroup).call(this, group, selectedItem))
                : __classPrivateFieldGet(this, _SelectButton_props, "f").items.map(item => __classPrivateFieldGet(this, _SelectButton_instances, "m", _SelectButton_renderSelectItem).call(this, item, selectedItem))}
    </select>
        ${selectedItem
                ? html `
        <devtools-button
            .disabled=${__classPrivateFieldGet(this, _SelectButton_props, "f").disabled}
            .variant=${buttonVariant}
            .iconName=${selectedItem.buttonIconName}
            @click=${__classPrivateFieldGet(this, _SelectButton_instances, "m", _SelectButton_handleClick)}>
            ${__classPrivateFieldGet(this, _SelectButton_props, "f").buttonLabel}
        </devtools-button>`
                : ''}
      </div>`, __classPrivateFieldGet(this, _SelectButton_shadow, "f"), { host: this });
            // clang-format on
        });
    }
    connectedCallback() {
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectButton_render, "f"));
    }
    get disabled() {
        return __classPrivateFieldGet(this, _SelectButton_props, "f").disabled;
    }
    set disabled(disabled) {
        __classPrivateFieldGet(this, _SelectButton_props, "f").disabled = disabled;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectButton_render, "f"));
    }
    get items() {
        return __classPrivateFieldGet(this, _SelectButton_props, "f").items;
    }
    set items(items) {
        __classPrivateFieldGet(this, _SelectButton_props, "f").items = items;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectButton_render, "f"));
    }
    set buttonLabel(buttonLabel) {
        __classPrivateFieldGet(this, _SelectButton_props, "f").buttonLabel = buttonLabel;
    }
    set groups(groups) {
        __classPrivateFieldGet(this, _SelectButton_props, "f").groups = groups;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectButton_render, "f"));
    }
    get value() {
        return __classPrivateFieldGet(this, _SelectButton_props, "f").value;
    }
    set value(value) {
        __classPrivateFieldGet(this, _SelectButton_props, "f").value = value;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectButton_render, "f"));
    }
    get variant() {
        return __classPrivateFieldGet(this, _SelectButton_props, "f").variant;
    }
    set variant(variant) {
        __classPrivateFieldGet(this, _SelectButton_props, "f").variant = variant;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectButton_render, "f"));
    }
    set action(value) {
        __classPrivateFieldGet(this, _SelectButton_props, "f").action = value;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectButton_render, "f"));
    }
}
_SelectButton_shadow = new WeakMap(), _SelectButton_props = new WeakMap(), _SelectButton_render = new WeakMap(), _SelectButton_instances = new WeakSet(), _SelectButton_handleClick = function _SelectButton_handleClick(ev) {
    ev.stopPropagation();
    this.dispatchEvent(new SelectButtonClickEvent(__classPrivateFieldGet(this, _SelectButton_props, "f").value));
}, _SelectButton_handleSelectMenuSelect = function _SelectButton_handleSelectMenuSelect(evt) {
    if (evt.target instanceof HTMLSelectElement) {
        this.dispatchEvent(new SelectMenuSelectedEvent(evt.target.value));
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectButton_render, "f"));
    }
}, _SelectButton_renderSelectItem = function _SelectButton_renderSelectItem(item, selectedItem) {
    const selected = item.value === selectedItem.value;
    // clang-format off
    return html `
      <option
      .title=${item.label()}
      value=${item.value}
      ?selected=${selected}
      jslog=${VisualLogging.item(Platform.StringUtilities.toKebabCase(item.value)).track({ click: true })}
      >${(selected && item.buttonLabel) ? item.buttonLabel() : item.label()}</option>
    `;
    // clang-format on
}, _SelectButton_renderSelectGroup = function _SelectButton_renderSelectGroup(group, selectedItem) {
    // clang-format off
    return html `
      <optgroup label=${group.name}>
        ${group.items.map(item => __classPrivateFieldGet(this, _SelectButton_instances, "m", _SelectButton_renderSelectItem).call(this, item, selectedItem))}
      </optgroup>
    `;
    // clang-format on
}, _SelectButton_getTitle = function _SelectButton_getTitle(label) {
    return __classPrivateFieldGet(this, _SelectButton_props, "f").action ? Models.Tooltip.getTooltipForActions(label, __classPrivateFieldGet(this, _SelectButton_props, "f").action) : '';
};
customElements.define('devtools-select-button', SelectButton);
//# sourceMappingURL=SelectButton.js.map