// Copyright (c) 2020 The Chromium Authors. All rights reserved.
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
var _LinearMemoryNavigator_instances, _LinearMemoryNavigator_shadow, _LinearMemoryNavigator_address, _LinearMemoryNavigator_error, _LinearMemoryNavigator_valid, _LinearMemoryNavigator_canGoBackInHistory, _LinearMemoryNavigator_canGoForwardInHistory, _LinearMemoryNavigator_render, _LinearMemoryNavigator_createAddressInput, _LinearMemoryNavigator_onAddressChange, _LinearMemoryNavigator_createButton;
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import linearMemoryNavigatorStyles from './linearMemoryNavigator.css.js';
const UIStrings = {
    /**
     *@description Tooltip text that appears when hovering over a valid memory address (e.g. 0x0) in the address line in the Linear memory inspector.
     */
    enterAddress: 'Enter address',
    /**
     *@description Tooltip text that appears when hovering over the button to go back in history in the Linear Memory Navigator
     */
    goBackInAddressHistory: 'Go back in address history',
    /**
     *@description Tooltip text that appears when hovering over the button to go forward in history in the Linear Memory Navigator
     */
    goForwardInAddressHistory: 'Go forward in address history',
    /**
     *@description Tooltip text that appears when hovering over the page back icon in the Linear Memory Navigator
     */
    previousPage: 'Previous page',
    /**
     *@description Tooltip text that appears when hovering over the next page icon in the Linear Memory Navigator
     */
    nextPage: 'Next page',
    /**
     *@description Text to refresh the page
     */
    refresh: 'Refresh',
};
const str_ = i18n.i18n.registerUIStrings('panels/linear_memory_inspector/components/LinearMemoryNavigator.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { render, html, Directives: { ifDefined } } = Lit;
export var Navigation;
(function (Navigation) {
    Navigation["BACKWARD"] = "Backward";
    Navigation["FORWARD"] = "Forward";
})(Navigation || (Navigation = {}));
export class AddressInputChangedEvent extends Event {
    constructor(address, mode) {
        super(AddressInputChangedEvent.eventName);
        this.data = { address, mode };
    }
}
AddressInputChangedEvent.eventName = 'addressinputchanged';
export class PageNavigationEvent extends Event {
    constructor(navigation) {
        super(PageNavigationEvent.eventName, {});
        this.data = navigation;
    }
}
PageNavigationEvent.eventName = 'pagenavigation';
export class HistoryNavigationEvent extends Event {
    constructor(navigation) {
        super(HistoryNavigationEvent.eventName, {});
        this.data = navigation;
    }
}
HistoryNavigationEvent.eventName = 'historynavigation';
export class RefreshRequestedEvent extends Event {
    constructor() {
        super(RefreshRequestedEvent.eventName, {});
    }
}
RefreshRequestedEvent.eventName = 'refreshrequested';
export var Mode;
(function (Mode) {
    Mode["EDIT"] = "Edit";
    Mode["SUBMITTED"] = "Submitted";
    Mode["INVALID_SUBMIT"] = "InvalidSubmit";
})(Mode || (Mode = {}));
export class LinearMemoryNavigator extends HTMLElement {
    constructor() {
        super(...arguments);
        _LinearMemoryNavigator_instances.add(this);
        _LinearMemoryNavigator_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _LinearMemoryNavigator_address.set(this, '0');
        _LinearMemoryNavigator_error.set(this, undefined);
        _LinearMemoryNavigator_valid.set(this, true);
        _LinearMemoryNavigator_canGoBackInHistory.set(this, false);
        _LinearMemoryNavigator_canGoForwardInHistory.set(this, false);
    }
    set data(data) {
        __classPrivateFieldSet(this, _LinearMemoryNavigator_address, data.address, "f");
        __classPrivateFieldSet(this, _LinearMemoryNavigator_error, data.error, "f");
        __classPrivateFieldSet(this, _LinearMemoryNavigator_valid, data.valid, "f");
        __classPrivateFieldSet(this, _LinearMemoryNavigator_canGoBackInHistory, data.canGoBackInHistory, "f");
        __classPrivateFieldSet(this, _LinearMemoryNavigator_canGoForwardInHistory, data.canGoForwardInHistory, "f");
        __classPrivateFieldGet(this, _LinearMemoryNavigator_instances, "m", _LinearMemoryNavigator_render).call(this);
        const addressInput = __classPrivateFieldGet(this, _LinearMemoryNavigator_shadow, "f").querySelector('.address-input');
        if (addressInput) {
            if (data.mode === "Submitted" /* Mode.SUBMITTED */) {
                addressInput.blur();
            }
            else if (data.mode === "InvalidSubmit" /* Mode.INVALID_SUBMIT */) {
                addressInput.select();
            }
        }
    }
}
_LinearMemoryNavigator_shadow = new WeakMap(), _LinearMemoryNavigator_address = new WeakMap(), _LinearMemoryNavigator_error = new WeakMap(), _LinearMemoryNavigator_valid = new WeakMap(), _LinearMemoryNavigator_canGoBackInHistory = new WeakMap(), _LinearMemoryNavigator_canGoForwardInHistory = new WeakMap(), _LinearMemoryNavigator_instances = new WeakSet(), _LinearMemoryNavigator_render = function _LinearMemoryNavigator_render() {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    const result = html `
      <style>${linearMemoryNavigatorStyles}</style>
      <div class="navigator">
        <div class="navigator-item">
          ${__classPrivateFieldGet(this, _LinearMemoryNavigator_instances, "m", _LinearMemoryNavigator_createButton).call(this, { icon: 'undo', title: i18nString(UIStrings.goBackInAddressHistory),
        event: new HistoryNavigationEvent("Backward" /* Navigation.BACKWARD */), enabled: __classPrivateFieldGet(this, _LinearMemoryNavigator_canGoBackInHistory, "f"),
        jslogContext: 'linear-memory-inspector.history-back' })}
          ${__classPrivateFieldGet(this, _LinearMemoryNavigator_instances, "m", _LinearMemoryNavigator_createButton).call(this, { icon: 'redo', title: i18nString(UIStrings.goForwardInAddressHistory),
        event: new HistoryNavigationEvent("Forward" /* Navigation.FORWARD */), enabled: __classPrivateFieldGet(this, _LinearMemoryNavigator_canGoForwardInHistory, "f"),
        jslogContext: 'linear-memory-inspector.history-forward' })}
        </div>
        <div class="navigator-item">
          ${__classPrivateFieldGet(this, _LinearMemoryNavigator_instances, "m", _LinearMemoryNavigator_createButton).call(this, { icon: 'chevron-left', title: i18nString(UIStrings.previousPage),
        event: new PageNavigationEvent("Backward" /* Navigation.BACKWARD */), enabled: true,
        jslogContext: 'linear-memory-inspector.previous-page' })}
          ${__classPrivateFieldGet(this, _LinearMemoryNavigator_instances, "m", _LinearMemoryNavigator_createAddressInput).call(this)}
          ${__classPrivateFieldGet(this, _LinearMemoryNavigator_instances, "m", _LinearMemoryNavigator_createButton).call(this, { icon: 'chevron-right', title: i18nString(UIStrings.nextPage),
        event: new PageNavigationEvent("Forward" /* Navigation.FORWARD */), enabled: true,
        jslogContext: 'linear-memory-inspector.next-page' })}
        </div>
        ${__classPrivateFieldGet(this, _LinearMemoryNavigator_instances, "m", _LinearMemoryNavigator_createButton).call(this, { icon: 'refresh', title: i18nString(UIStrings.refresh),
        event: new RefreshRequestedEvent(), enabled: true,
        jslogContext: 'linear-memory-inspector.refresh' })}
      </div>
      `;
    render(result, __classPrivateFieldGet(this, _LinearMemoryNavigator_shadow, "f"), { host: this });
    // clang-format on
}, _LinearMemoryNavigator_createAddressInput = function _LinearMemoryNavigator_createAddressInput() {
    const classMap = {
        'address-input': true,
        invalid: !__classPrivateFieldGet(this, _LinearMemoryNavigator_valid, "f"),
    };
    return html `
      <input class=${Lit.Directives.classMap(classMap)} data-input="true" .value=${__classPrivateFieldGet(this, _LinearMemoryNavigator_address, "f")}
        jslog=${VisualLogging.textField('linear-memory-inspector.address').track({
        change: true,
    })}
        title=${ifDefined(__classPrivateFieldGet(this, _LinearMemoryNavigator_valid, "f") ? i18nString(UIStrings.enterAddress) : __classPrivateFieldGet(this, _LinearMemoryNavigator_error, "f"))} @change=${__classPrivateFieldGet(this, _LinearMemoryNavigator_instances, "m", _LinearMemoryNavigator_onAddressChange).bind(this, "Submitted" /* Mode.SUBMITTED */)} @input=${__classPrivateFieldGet(this, _LinearMemoryNavigator_instances, "m", _LinearMemoryNavigator_onAddressChange).bind(this, "Edit" /* Mode.EDIT */)}/>`;
}, _LinearMemoryNavigator_onAddressChange = function _LinearMemoryNavigator_onAddressChange(mode, event) {
    const addressInput = event.target;
    this.dispatchEvent(new AddressInputChangedEvent(addressInput.value, mode));
}, _LinearMemoryNavigator_createButton = function _LinearMemoryNavigator_createButton(data) {
    return html `
      <devtools-button class="navigator-button"
        .data=${{ variant: "icon" /* Buttons.Button.Variant.ICON */, iconName: data.icon, disabled: !data.enabled }}
        jslog=${VisualLogging.action().track({ click: true, keydown: 'Enter' }).context(data.jslogContext)}
        data-button=${data.event.type} title=${data.title}
        @click=${this.dispatchEvent.bind(this, data.event)}
      ></devtools-button>`;
};
customElements.define('devtools-linear-memory-inspector-navigator', LinearMemoryNavigator);
//# sourceMappingURL=LinearMemoryNavigator.js.map