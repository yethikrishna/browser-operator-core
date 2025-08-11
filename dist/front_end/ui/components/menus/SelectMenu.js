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
var _SelectMenu_instances, _SelectMenu_shadow, _SelectMenu_button, _SelectMenu_open, _SelectMenu_props, _SelectMenu_getButton, _SelectMenu_showMenu, _SelectMenu_sideButtonClicked, _SelectMenu_getButtonText, _SelectMenu_renderButton, _SelectMenu_onMenuClose, _SelectMenu_onItemSelected, _SelectMenu_render, _SelectMenuButton_instances, _SelectMenuButton_shadow, _SelectMenuButton_showButton, _SelectMenuButton_props, _SelectMenuButton_getShowButton, _SelectMenuButton_handleButtonKeyDown, _SelectMenuButton_handleClick, _SelectMenuButton_render;
import * as Platform from '../../../core/platform/platform.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Dialogs from '../dialogs/dialogs.js';
import { MenuGroup, } from './Menu.js';
import selectMenuStyles from './selectMenu.css.js';
import selectMenuButtonStyles from './selectMenuButton.css.js';
const { html } = Lit;
const deployMenuArrow = new URL('../../../Images/triangle-down.svg', import.meta.url).toString();
/**
 * @deprecated use `<select>` instead.
 */
export class SelectMenu extends HTMLElement {
    constructor() {
        super(...arguments);
        _SelectMenu_instances.add(this);
        _SelectMenu_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _SelectMenu_button.set(this, null);
        _SelectMenu_open.set(this, false);
        _SelectMenu_props.set(this, {
            buttonTitle: '',
            position: "bottom" /* Dialogs.Dialog.DialogVerticalPosition.BOTTOM */,
            horizontalAlignment: "auto" /* Dialogs.Dialog.DialogHorizontalAlignment.AUTO */,
            showArrow: false,
            sideButton: false,
            showDivider: false,
            disabled: false,
            showSelectedItem: true,
            jslogContext: '',
        });
    }
    get buttonTitle() {
        return __classPrivateFieldGet(this, _SelectMenu_props, "f").buttonTitle;
    }
    set buttonTitle(buttonTitle) {
        __classPrivateFieldGet(this, _SelectMenu_props, "f").buttonTitle = buttonTitle;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
    }
    get position() {
        return __classPrivateFieldGet(this, _SelectMenu_props, "f").position;
    }
    set position(position) {
        __classPrivateFieldGet(this, _SelectMenu_props, "f").position = position;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
    }
    get horizontalAlignment() {
        return __classPrivateFieldGet(this, _SelectMenu_props, "f").horizontalAlignment;
    }
    set horizontalAlignment(horizontalAlignment) {
        __classPrivateFieldGet(this, _SelectMenu_props, "f").horizontalAlignment = horizontalAlignment;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
    }
    get showArrow() {
        return __classPrivateFieldGet(this, _SelectMenu_props, "f").showArrow;
    }
    set showArrow(showArrow) {
        __classPrivateFieldGet(this, _SelectMenu_props, "f").showArrow = showArrow;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
    }
    get sideButton() {
        return __classPrivateFieldGet(this, _SelectMenu_props, "f").sideButton;
    }
    set sideButton(sideButton) {
        __classPrivateFieldGet(this, _SelectMenu_props, "f").sideButton = sideButton;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
    }
    get disabled() {
        return __classPrivateFieldGet(this, _SelectMenu_props, "f").disabled;
    }
    set disabled(disabled) {
        __classPrivateFieldGet(this, _SelectMenu_props, "f").disabled = disabled;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
    }
    get showDivider() {
        return __classPrivateFieldGet(this, _SelectMenu_props, "f").showDivider;
    }
    set showDivider(showDivider) {
        __classPrivateFieldGet(this, _SelectMenu_props, "f").showDivider = showDivider;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
    }
    get showSelectedItem() {
        return __classPrivateFieldGet(this, _SelectMenu_props, "f").showSelectedItem;
    }
    set showSelectedItem(showSelectedItem) {
        __classPrivateFieldGet(this, _SelectMenu_props, "f").showSelectedItem = showSelectedItem;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
    }
    get jslogContext() {
        return __classPrivateFieldGet(this, _SelectMenu_props, "f").jslogContext;
    }
    set jslogContext(jslogContext) {
        __classPrivateFieldGet(this, _SelectMenu_props, "f").jslogContext = jslogContext;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
    }
    click() {
        __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_getButton).call(this).click();
    }
}
_SelectMenu_shadow = new WeakMap(), _SelectMenu_button = new WeakMap(), _SelectMenu_open = new WeakMap(), _SelectMenu_props = new WeakMap(), _SelectMenu_instances = new WeakSet(), _SelectMenu_getButton = function _SelectMenu_getButton() {
    if (!__classPrivateFieldGet(this, _SelectMenu_button, "f")) {
        __classPrivateFieldSet(this, _SelectMenu_button, __classPrivateFieldGet(this, _SelectMenu_shadow, "f").querySelector('devtools-select-menu-button'), "f");
        if (!__classPrivateFieldGet(this, _SelectMenu_button, "f")) {
            throw new Error('Arrow not found');
        }
    }
    return __classPrivateFieldGet(this, _SelectMenu_button, "f");
}, _SelectMenu_showMenu = function _SelectMenu_showMenu() {
    __classPrivateFieldSet(this, _SelectMenu_open, true, "f");
    this.setAttribute('has-open-dialog', 'has-open-dialog');
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
}, _SelectMenu_sideButtonClicked = function _SelectMenu_sideButtonClicked() {
    this.dispatchEvent(new SelectMenuSideButtonClickEvent());
}, _SelectMenu_getButtonText = function _SelectMenu_getButtonText() {
    return this.buttonTitle instanceof Function ? this.buttonTitle() : this.buttonTitle;
}, _SelectMenu_renderButton = function _SelectMenu_renderButton() {
    const buttonLabel = __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_getButtonText).call(this);
    if (!this.sideButton) {
        // clang-format off
        /* eslint-disable rulesdir/no-deprecated-component-usages */
        return html `
          <devtools-select-menu-button
            @selectmenubuttontrigger=${__classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_showMenu)}
            .open=${__classPrivateFieldGet(this, _SelectMenu_open, "f")} .showArrow=${this.showArrow}
            .arrowDirection=${this.position}
            .disabled=${this.disabled}
            .jslogContext=${this.jslogContext}>
              ${buttonLabel}
            </devtools-select-menu-button>
        `;
        /* eslint-enable rulesdir/no-deprecated-component-usages */
        // clang-format on
    }
    // clang-format off
    /* eslint-disable rulesdir/no-deprecated-component-usages */
    return html `
      <button id="side-button" @click=${__classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_sideButtonClicked)} ?disabled=${this.disabled}>
        ${buttonLabel}
      </button>
      <devtools-select-menu-button
        @click=${__classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_showMenu)}
        @selectmenubuttontrigger=${__classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_showMenu)}
        .singleArrow=${true}
        .open=${__classPrivateFieldGet(this, _SelectMenu_open, "f")}
        .showArrow=${true}
        .arrowDirection=${this.position}
        .disabled=${this.disabled}>
      </devtools-select-menu-button>
    `;
    /* eslint-enable rulesdir/no-deprecated-component-usages */
    // clang-format on
}, _SelectMenu_onMenuClose = function _SelectMenu_onMenuClose(evt) {
    if (evt) {
        evt.stopImmediatePropagation();
    }
    void RenderCoordinator.write(() => {
        this.removeAttribute('has-open-dialog');
    });
    __classPrivateFieldSet(this, _SelectMenu_open, false, "f");
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_render));
}, _SelectMenu_onItemSelected = function _SelectMenu_onItemSelected(evt) {
    this.dispatchEvent(new SelectMenuItemSelectedEvent(evt.itemValue));
}, _SelectMenu_render = async function _SelectMenu_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('SelectMenu render was not scheduled');
    }
    // clang-format off
    Lit.render(html `
        <style>${selectMenuStyles}</style>
        <devtools-menu
            @menucloserequest=${__classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_onMenuClose)}
            @menuitemselected=${__classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_onItemSelected)}
            .position=${this.position}
            .origin=${this}
            .showDivider=${this.showDivider}
            .showSelectedItem=${this.showSelectedItem}
            .open=${__classPrivateFieldGet(this, _SelectMenu_open, "f")}
            .getConnectorCustomXPosition=${null}>
          <slot></slot>
        </devtools-menu>
        ${__classPrivateFieldGet(this, _SelectMenu_instances, "m", _SelectMenu_renderButton).call(this)}`, __classPrivateFieldGet(this, _SelectMenu_shadow, "f"), { host: this });
    // clang-format on
};
export class SelectMenuButton extends HTMLElement {
    constructor() {
        super(...arguments);
        _SelectMenuButton_instances.add(this);
        _SelectMenuButton_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _SelectMenuButton_showButton.set(this, null);
        _SelectMenuButton_props.set(this, {
            showArrow: false,
            arrowDirection: "bottom" /* Dialogs.Dialog.DialogVerticalPosition.BOTTOM */,
            disabled: false,
            singleArrow: false,
            jslogContext: '',
        });
    }
    connectedCallback() {
        this.style.setProperty('--deploy-menu-arrow', `url(${deployMenuArrow})`);
        void RenderCoordinator.write(() => {
            switch (this.arrowDirection) {
                case "auto" /* Dialogs.Dialog.DialogVerticalPosition.AUTO */:
                case "top" /* Dialogs.Dialog.DialogVerticalPosition.TOP */: {
                    this.style.setProperty('--arrow-angle', '180deg');
                    break;
                }
                case "bottom" /* Dialogs.Dialog.DialogVerticalPosition.BOTTOM */: {
                    this.style.setProperty('--arrow-angle', '0deg');
                    break;
                }
                default:
                    Platform.assertNever(this.arrowDirection, `Unknown position type: ${this.arrowDirection}`);
            }
        });
    }
    get showArrow() {
        return __classPrivateFieldGet(this, _SelectMenuButton_props, "f").showArrow;
    }
    set showArrow(showArrow) {
        __classPrivateFieldGet(this, _SelectMenuButton_props, "f").showArrow = showArrow;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenuButton_instances, "m", _SelectMenuButton_render));
    }
    get arrowDirection() {
        return __classPrivateFieldGet(this, _SelectMenuButton_props, "f").arrowDirection;
    }
    set arrowDirection(arrowDirection) {
        __classPrivateFieldGet(this, _SelectMenuButton_props, "f").arrowDirection = arrowDirection;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenuButton_instances, "m", _SelectMenuButton_render));
    }
    get disabled() {
        return __classPrivateFieldGet(this, _SelectMenuButton_props, "f").disabled;
    }
    set disabled(disabled) {
        __classPrivateFieldGet(this, _SelectMenuButton_props, "f").disabled = disabled;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenuButton_instances, "m", _SelectMenuButton_render));
    }
    set open(open) {
        void RenderCoordinator.write(() => {
            __classPrivateFieldGet(this, _SelectMenuButton_instances, "m", _SelectMenuButton_getShowButton).call(this)?.setAttribute('aria-expanded', String(open));
        });
    }
    set singleArrow(singleArrow) {
        __classPrivateFieldGet(this, _SelectMenuButton_props, "f").singleArrow = singleArrow;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenuButton_instances, "m", _SelectMenuButton_render));
    }
    get jslogContext() {
        return __classPrivateFieldGet(this, _SelectMenuButton_props, "f").jslogContext;
    }
    set jslogContext(jslogContext) {
        __classPrivateFieldGet(this, _SelectMenuButton_props, "f").jslogContext = jslogContext;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _SelectMenuButton_instances, "m", _SelectMenuButton_render));
    }
    click() {
        __classPrivateFieldGet(this, _SelectMenuButton_instances, "m", _SelectMenuButton_getShowButton).call(this)?.click();
    }
}
_SelectMenuButton_shadow = new WeakMap(), _SelectMenuButton_showButton = new WeakMap(), _SelectMenuButton_props = new WeakMap(), _SelectMenuButton_instances = new WeakSet(), _SelectMenuButton_getShowButton = function _SelectMenuButton_getShowButton() {
    if (!__classPrivateFieldGet(this, _SelectMenuButton_showButton, "f")) {
        __classPrivateFieldSet(this, _SelectMenuButton_showButton, __classPrivateFieldGet(this, _SelectMenuButton_shadow, "f").querySelector('button'), "f");
    }
    return __classPrivateFieldGet(this, _SelectMenuButton_showButton, "f");
}, _SelectMenuButton_handleButtonKeyDown = function _SelectMenuButton_handleButtonKeyDown(evt) {
    const key = evt.key;
    const shouldShowDialogBelow = this.arrowDirection === "bottom" /* Dialogs.Dialog.DialogVerticalPosition.BOTTOM */ &&
        key === "ArrowDown" /* Platform.KeyboardUtilities.ArrowKey.DOWN */;
    const shouldShowDialogAbove = this.arrowDirection === "top" /* Dialogs.Dialog.DialogVerticalPosition.TOP */ &&
        key === "ArrowUp" /* Platform.KeyboardUtilities.ArrowKey.UP */;
    const isEnter = key === Platform.KeyboardUtilities.ENTER_KEY;
    const isSpace = evt.code === 'Space';
    if (shouldShowDialogBelow || shouldShowDialogAbove || isEnter || isSpace) {
        this.dispatchEvent(new SelectMenuButtonTriggerEvent());
        evt.preventDefault();
    }
}, _SelectMenuButton_handleClick = function _SelectMenuButton_handleClick() {
    this.dispatchEvent(new SelectMenuButtonTriggerEvent());
}, _SelectMenuButton_render = async function _SelectMenuButton_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('SelectMenuItem render was not scheduled');
    }
    const arrow = __classPrivateFieldGet(this, _SelectMenuButton_props, "f").showArrow ? html `<span id="arrow"></span>` : Lit.nothing;
    const classMap = { 'single-arrow': __classPrivateFieldGet(this, _SelectMenuButton_props, "f").singleArrow };
    // clang-format off
    const buttonTitle = html `
      <span id="button-label-wrapper">
        <span id="label" ?witharrow=${this.showArrow} class=${Lit.Directives.classMap(classMap)}>
          <slot></slot>
        </span>
        ${arrow}
      </span>`;
    // clang-format off
    Lit.render(html `
        <style>${selectMenuButtonStyles}</style>
        <button
            aria-haspopup="true" aria-expanded="false" class="show"
            @keydown=${__classPrivateFieldGet(this, _SelectMenuButton_instances, "m", _SelectMenuButton_handleButtonKeyDown)} @click=${__classPrivateFieldGet(this, _SelectMenuButton_instances, "m", _SelectMenuButton_handleClick)}
            ?disabled=${this.disabled}
            jslog=${VisualLogging.dropDown(this.jslogContext)}>
          ${buttonTitle}
        </button>`, __classPrivateFieldGet(this, _SelectMenuButton_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-select-menu', SelectMenu);
customElements.define('devtools-select-menu-button', SelectMenuButton);
export class SelectMenuItemSelectedEvent extends Event {
    constructor(itemValue) {
        super(SelectMenuItemSelectedEvent.eventName, { bubbles: true, composed: true });
        this.itemValue = itemValue;
    }
}
SelectMenuItemSelectedEvent.eventName = 'selectmenuselected';
export class SelectMenuSideButtonClickEvent extends Event {
    constructor() {
        super(SelectMenuSideButtonClickEvent.eventName, { bubbles: true, composed: true });
    }
}
SelectMenuSideButtonClickEvent.eventName = 'selectmenusidebuttonclick';
export class SelectMenuButtonTriggerEvent extends Event {
    constructor() {
        super(SelectMenuButtonTriggerEvent.eventName, { bubbles: true, composed: true });
    }
}
SelectMenuButtonTriggerEvent.eventName = 'selectmenubuttontrigger';
export { MenuGroup as SelectMenuGroup };
//# sourceMappingURL=SelectMenu.js.map