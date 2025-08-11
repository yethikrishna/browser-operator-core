// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Menu_instances, _Menu_shadow, _Menu_dialog, _Menu_itemIsFocused, _Menu_props, _Menu_getDialog, _Menu_dialogDeployed, _Menu_focusFirstItem, _Menu_getFirstItem, _Menu_handleItemClick, _Menu_handleDialogKeyDown, _Menu_updateSelectedValue, _Menu_handleArrowKeyNavigation, _Menu_firstItemInNextGroup, _Menu_lastItemInPreviousGroup, _Menu_handleHomeKeyDown, _Menu_focusLastItem, _Menu_closeDialog, _Menu_render, _MenuItem_instances, _MenuItem_shadow, _MenuItem_props, _MenuItem_render, _MenuGroup_instances, _MenuGroup_shadow, _MenuGroup_props, _MenuGroup_render;
import * as Platform from '../../../core/platform/platform.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Dialogs from '../dialogs/dialogs.js';
import menuStyles from './menu.css.js';
import menuGroupStyles from './menuGroup.css.js';
import menuItemStyles from './menuItem.css.js';
const { html } = Lit;
const selectedItemCheckmark = new URL('../../../Images/checkmark.svg', import.meta.url).toString();
export class Menu extends HTMLElement {
    constructor() {
        super(...arguments);
        _Menu_instances.add(this);
        _Menu_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _Menu_dialog.set(this, null);
        _Menu_itemIsFocused.set(this, false);
        _Menu_props.set(this, {
            origin: null,
            open: false,
            position: "auto" /* Dialogs.Dialog.DialogVerticalPosition.AUTO */,
            showDivider: false,
            showSelectedItem: true,
            horizontalAlignment: "auto" /* Dialogs.Dialog.DialogHorizontalAlignment.AUTO */,
            getConnectorCustomXPosition: null,
        });
    }
    get origin() {
        return __classPrivateFieldGet(this, _Menu_props, "f").origin;
    }
    set origin(origin) {
        __classPrivateFieldGet(this, _Menu_props, "f").origin = origin;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_render));
    }
    get open() {
        return __classPrivateFieldGet(this, _Menu_props, "f").open;
    }
    set open(open) {
        if (open === this.open) {
            return;
        }
        __classPrivateFieldGet(this, _Menu_props, "f").open = open;
        this.toggleAttribute('has-open-dialog', this.open);
        void __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_getDialog).call(this).setDialogVisible(this.open);
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_render));
    }
    get position() {
        return __classPrivateFieldGet(this, _Menu_props, "f").position;
    }
    set position(position) {
        __classPrivateFieldGet(this, _Menu_props, "f").position = position;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_render));
    }
    get showDivider() {
        return __classPrivateFieldGet(this, _Menu_props, "f").showDivider;
    }
    set showDivider(showDivider) {
        __classPrivateFieldGet(this, _Menu_props, "f").showDivider = showDivider;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_render));
    }
    get showSelectedItem() {
        return __classPrivateFieldGet(this, _Menu_props, "f").showSelectedItem;
    }
    set showSelectedItem(showSelectedItem) {
        __classPrivateFieldGet(this, _Menu_props, "f").showSelectedItem = showSelectedItem;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_render));
    }
    get horizontalAlignment() {
        return __classPrivateFieldGet(this, _Menu_props, "f").horizontalAlignment;
    }
    set horizontalAlignment(horizontalAlignment) {
        __classPrivateFieldGet(this, _Menu_props, "f").horizontalAlignment = horizontalAlignment;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_render));
    }
    get getConnectorCustomXPosition() {
        return __classPrivateFieldGet(this, _Menu_props, "f").getConnectorCustomXPosition;
    }
    set getConnectorCustomXPosition(connectorXPosition) {
        __classPrivateFieldGet(this, _Menu_props, "f").getConnectorCustomXPosition = connectorXPosition;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_render));
    }
    connectedCallback() {
        void RenderCoordinator.write(() => {
            this.style.setProperty('--selected-item-check', `url(${selectedItemCheckmark})`);
            this.style.setProperty('--menu-checkmark-width', __classPrivateFieldGet(this, _Menu_props, "f").showSelectedItem ? '26px' : '0px');
            this.style.setProperty('--menu-checkmark-height', __classPrivateFieldGet(this, _Menu_props, "f").showSelectedItem ? '12px' : '0px');
            const dividerLine = this.showDivider ? '1px var(--divider-line) solid' : 'none';
            this.style.setProperty('--override-divider-line', dividerLine);
        });
    }
}
_Menu_shadow = new WeakMap(), _Menu_dialog = new WeakMap(), _Menu_itemIsFocused = new WeakMap(), _Menu_props = new WeakMap(), _Menu_instances = new WeakSet(), _Menu_getDialog = function _Menu_getDialog() {
    if (!__classPrivateFieldGet(this, _Menu_dialog, "f")) {
        throw new Error('Dialog not found');
    }
    return __classPrivateFieldGet(this, _Menu_dialog, "f");
}, _Menu_dialogDeployed = async function _Menu_dialogDeployed() {
    await RenderCoordinator.write(() => {
        this.setAttribute('has-open-dialog', 'has-open-dialog');
        // Focus the container so tha twe can capture key events.
        const container = __classPrivateFieldGet(this, _Menu_shadow, "f").querySelector('#container');
        if (!(container instanceof HTMLElement)) {
            return;
        }
        container.focus();
    });
}, _Menu_focusFirstItem = function _Menu_focusFirstItem() {
    __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_getFirstItem).call(this).focus();
}, _Menu_getFirstItem = function _Menu_getFirstItem() {
    const defaultSlot = __classPrivateFieldGet(this, _Menu_shadow, "f").querySelector('slot');
    const items = defaultSlot?.assignedElements();
    let firstItem = items[0];
    if (firstItem instanceof HTMLSlotElement) {
        firstItem = firstItem?.assignedElements()[0];
    }
    if (firstItem instanceof MenuGroup) {
        const groupDefaultSlot = firstItem.shadowRoot?.querySelector('slot');
        firstItem = groupDefaultSlot?.assignedElements()[0];
    }
    if (firstItem instanceof HTMLElement) {
        return firstItem;
    }
    throw new Error('First item not found');
}, _Menu_handleItemClick = function _Menu_handleItemClick(evt) {
    const path = evt.composedPath();
    evt.stopPropagation();
    // If the clicked item is an input element, do not follow the default behaviour.
    if (path.find(element => element instanceof HTMLInputElement)) {
        return;
    }
    const item = evt.composedPath().find(element => element instanceof MenuItem);
    // Compare against MenuItem again to narrow the item's type.
    if (!(item instanceof MenuItem)) {
        return;
    }
    if (item.disabled) {
        return;
    }
    __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_updateSelectedValue).call(this, item);
}, _Menu_handleDialogKeyDown = function _Menu_handleDialogKeyDown(evt) {
    const key = evt.key;
    evt.stopImmediatePropagation();
    let item = evt.target;
    const path = evt.composedPath();
    const shouldFocusFirstItem = key === "ArrowDown" /* Platform.KeyboardUtilities.ArrowKey.DOWN */ || key === "ArrowRight" /* Platform.KeyboardUtilities.ArrowKey.RIGHT */;
    if (!__classPrivateFieldGet(this, _Menu_itemIsFocused, "f") && shouldFocusFirstItem) {
        __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_focusFirstItem).call(this);
        __classPrivateFieldSet(this, _Menu_itemIsFocused, true, "f");
        return;
    }
    if (!__classPrivateFieldGet(this, _Menu_itemIsFocused, "f") && key === "ArrowUp" /* Platform.KeyboardUtilities.ArrowKey.UP */) {
        __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_focusLastItem).call(this);
        __classPrivateFieldSet(this, _Menu_itemIsFocused, true, "f");
        return;
    }
    // The focused item could be nested inside the MenuItem, hence
    // find the MenuItem item inside the event's composed path.
    if (!(item instanceof MenuItem)) {
        item = path.find(element => element instanceof MenuItem);
        // Compare against MenuItem again to narrow the item's type.
        if (!(item instanceof MenuItem)) {
            return;
        }
    }
    if (Platform.KeyboardUtilities.keyIsArrowKey(key)) {
        __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_handleArrowKeyNavigation).call(this, key, item);
    }
    else if (key === 'Home') {
        __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_handleHomeKeyDown).call(this, item);
    }
    else if (key === 'End') {
        __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_focusLastItem).call(this);
    }
    else if (key === 'Enter' || evt.code === 'Space') {
        __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_updateSelectedValue).call(this, item);
    }
    else if (key === 'Escape') {
        evt.preventDefault();
        __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_closeDialog).call(this);
    }
}, _Menu_updateSelectedValue = function _Menu_updateSelectedValue(item) {
    if (item.value === '') {
        return;
    }
    this.dispatchEvent(new MenuItemSelectedEvent(item.value));
    if (item.preventMenuCloseOnSelection) {
        return;
    }
    __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_closeDialog).call(this);
}, _Menu_handleArrowKeyNavigation = function _Menu_handleArrowKeyNavigation(key, currentItem) {
    let nextSibling = currentItem;
    if (key === "ArrowDown" /* Platform.KeyboardUtilities.ArrowKey.DOWN */) {
        nextSibling = currentItem.nextElementSibling;
        // Handle last item in a group and navigating down:
        if (nextSibling === null && currentItem.parentElement instanceof MenuGroup) {
            nextSibling = __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_firstItemInNextGroup).call(this, currentItem);
        }
    }
    else if (key === "ArrowUp" /* Platform.KeyboardUtilities.ArrowKey.UP */) {
        nextSibling = currentItem.previousElementSibling;
        // Handle first item in a group and navigating up:
        if (nextSibling === null && currentItem.parentElement instanceof MenuGroup) {
            nextSibling = __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_lastItemInPreviousGroup).call(this, currentItem);
        }
    }
    if (nextSibling instanceof MenuItem) {
        nextSibling.focus();
    }
}, _Menu_firstItemInNextGroup = function _Menu_firstItemInNextGroup(currentItem) {
    const parentElement = currentItem.parentElement;
    if (!(parentElement instanceof MenuGroup)) {
        return null;
    }
    const parentNextSibling = parentElement.nextElementSibling;
    if (parentNextSibling instanceof MenuItem) {
        return parentNextSibling;
    }
    if (!(parentNextSibling instanceof MenuGroup)) {
        return null;
    }
    for (const child of parentNextSibling.children) {
        if (child instanceof MenuItem) {
            return child;
        }
    }
    return null;
}, _Menu_lastItemInPreviousGroup = function _Menu_lastItemInPreviousGroup(currentItem) {
    const parentElement = currentItem.parentElement;
    if (!(parentElement instanceof MenuGroup)) {
        return null;
    }
    const parentPreviousSibling = parentElement.previousElementSibling;
    if (parentPreviousSibling instanceof MenuItem) {
        return parentPreviousSibling;
    }
    if (!(parentPreviousSibling instanceof MenuGroup)) {
        return null;
    }
    if (parentPreviousSibling.lastElementChild instanceof MenuItem) {
        return parentPreviousSibling.lastElementChild;
    }
    return null;
}, _Menu_handleHomeKeyDown = function _Menu_handleHomeKeyDown(currentItem) {
    let topMenuPart = currentItem;
    if (currentItem.parentElement instanceof MenuGroup) {
        topMenuPart = currentItem.parentElement;
    }
    while (topMenuPart?.previousElementSibling) {
        topMenuPart = topMenuPart?.previousElementSibling;
    }
    if (topMenuPart instanceof MenuItem) {
        topMenuPart.focus();
        return;
    }
    for (const child of topMenuPart.children) {
        if (child instanceof MenuItem) {
            child.focus();
            return;
        }
    }
}, _Menu_focusLastItem = function _Menu_focusLastItem() {
    const currentItem = __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_getFirstItem).call(this);
    let lastMenuPart = currentItem;
    if (currentItem.parentElement instanceof MenuGroup) {
        lastMenuPart = currentItem.parentElement;
    }
    while (lastMenuPart?.nextElementSibling) {
        lastMenuPart = lastMenuPart?.nextElementSibling;
    }
    if (lastMenuPart instanceof MenuItem) {
        lastMenuPart.focus();
        return;
    }
    if (lastMenuPart instanceof MenuGroup && lastMenuPart.lastElementChild instanceof MenuItem) {
        lastMenuPart.lastElementChild.focus();
    }
}, _Menu_closeDialog = function _Menu_closeDialog(evt) {
    if (evt) {
        evt.stopImmediatePropagation();
    }
    this.dispatchEvent(new MenuCloseRequest());
    void __classPrivateFieldGet(this, _Menu_instances, "m", _Menu_getDialog).call(this).setDialogVisible(false);
    __classPrivateFieldSet(this, _Menu_itemIsFocused, false, "f");
}, _Menu_render = async function _Menu_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('Menu render was not scheduled');
    }
    // clang-format off
    Lit.render(html `
      <style>${menuStyles}</style>
      <devtools-dialog
        @clickoutsidedialog=${__classPrivateFieldGet(this, _Menu_instances, "m", _Menu_closeDialog)}
        @forceddialogclose=${__classPrivateFieldGet(this, _Menu_instances, "m", _Menu_closeDialog)}
        .position=${this.position}
        .origin=${this.origin}
        .dialogShownCallback=${__classPrivateFieldGet(this, _Menu_instances, "m", _Menu_dialogDeployed).bind(this)}
        .horizontalAlignment=${this.horizontalAlignment}
        .getConnectorCustomXPosition=${this.getConnectorCustomXPosition}
        on-render=${ComponentHelpers.Directives.nodeRenderedCallback((domNode) => {
        __classPrivateFieldSet(this, _Menu_dialog, domNode, "f");
    })}
        >
        <span id="container" role="menu" tabIndex="0" @keydown=${__classPrivateFieldGet(this, _Menu_instances, "m", _Menu_handleDialogKeyDown)} jslog=${VisualLogging.menu().track({ resize: true, keydown: 'Escape' })}>
          <slot @click=${__classPrivateFieldGet(this, _Menu_instances, "m", _Menu_handleItemClick)}>
          </slot>
        </span>
      </devtools-dialog>
    `, __classPrivateFieldGet(this, _Menu_shadow, "f"), { host: this });
    // clang-format on
};
export class MenuItem extends HTMLElement {
    constructor() {
        super(...arguments);
        _MenuItem_instances.add(this);
        _MenuItem_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _MenuItem_props.set(this, {
            value: '',
            preventMenuCloseOnSelection: false,
            selected: false,
            disabled: false,
        });
    }
    connectedCallback() {
        this.tabIndex = 0;
        this.setAttribute('role', 'menuitem');
    }
    get preventMenuCloseOnSelection() {
        return __classPrivateFieldGet(this, _MenuItem_props, "f").preventMenuCloseOnSelection;
    }
    set preventMenuCloseOnSelection(preventMenuCloseOnSelection) {
        __classPrivateFieldGet(this, _MenuItem_props, "f").preventMenuCloseOnSelection = preventMenuCloseOnSelection;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _MenuItem_instances, "m", _MenuItem_render));
    }
    get value() {
        return __classPrivateFieldGet(this, _MenuItem_props, "f").value;
    }
    set value(value) {
        __classPrivateFieldGet(this, _MenuItem_props, "f").value = value;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _MenuItem_instances, "m", _MenuItem_render));
    }
    get selected() {
        return __classPrivateFieldGet(this, _MenuItem_props, "f").selected;
    }
    set selected(selected) {
        __classPrivateFieldGet(this, _MenuItem_props, "f").selected = selected;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _MenuItem_instances, "m", _MenuItem_render));
    }
    get disabled() {
        return __classPrivateFieldGet(this, _MenuItem_props, "f").disabled;
    }
    set disabled(disabled) {
        __classPrivateFieldGet(this, _MenuItem_props, "f").disabled = disabled;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _MenuItem_instances, "m", _MenuItem_render));
    }
}
_MenuItem_shadow = new WeakMap(), _MenuItem_props = new WeakMap(), _MenuItem_instances = new WeakSet(), _MenuItem_render = async function _MenuItem_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('MenuItem render was not scheduled');
    }
    // clang-format off
    Lit.render(html `
      <style>${menuItemStyles}</style>
      <span class=${Lit.Directives.classMap({
        'menu-item': true,
        'is-selected-item': this.selected,
        'is-disabled-item': this.disabled,
        'prevents-close': this.preventMenuCloseOnSelection,
    })}
      >
        <slot></slot>
      </span>
    `, __classPrivateFieldGet(this, _MenuItem_shadow, "f"), { host: this });
    // clang-format on
};
export class MenuGroup extends HTMLElement {
    constructor() {
        super(...arguments);
        _MenuGroup_instances.add(this);
        _MenuGroup_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _MenuGroup_props.set(this, {
            name: null,
        });
    }
    get name() {
        return __classPrivateFieldGet(this, _MenuGroup_props, "f").name;
    }
    set name(name) {
        __classPrivateFieldGet(this, _MenuGroup_props, "f").name = name;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _MenuGroup_instances, "m", _MenuGroup_render));
    }
}
_MenuGroup_shadow = new WeakMap(), _MenuGroup_props = new WeakMap(), _MenuGroup_instances = new WeakSet(), _MenuGroup_render = async function _MenuGroup_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('MenuGroup render was not scheduled');
    }
    // clang-format off
    Lit.render(html `
      <style>${menuGroupStyles}</style>
      <span class="menu-group">
        <span class="menu-group-label">${this.name}</span>
        <slot></slot>
      </span>
    `, __classPrivateFieldGet(this, _MenuGroup_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-menu', Menu);
customElements.define('devtools-menu-item', MenuItem);
customElements.define('devtools-menu-group', MenuGroup);
export class MenuItemSelectedEvent extends Event {
    constructor(itemValue) {
        super(MenuItemSelectedEvent.eventName, { bubbles: true, composed: true });
        this.itemValue = itemValue;
    }
}
MenuItemSelectedEvent.eventName = 'menuitemselected';
export class MenuCloseRequest extends Event {
    constructor() {
        super(MenuCloseRequest.eventName, { bubbles: true, composed: true });
    }
}
MenuCloseRequest.eventName = 'menucloserequest';
//# sourceMappingURL=Menu.js.map