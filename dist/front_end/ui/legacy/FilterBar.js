/*
 * Copyright (C) 2013 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
var _TextFilterUI_filter, _NamedBitSetFilterUIElement_instances, _NamedBitSetFilterUIElement_options, _NamedBitSetFilterUIElement_shadow, _NamedBitSetFilterUIElement_namedBitSetFilterUI, _NamedBitSetFilterUIElement_filterChanged;
/* eslint-disable rulesdir/no-imperative-dom-api */
import './Toolbar.js';
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as ARIAUtils from './ARIAUtils.js';
import filterStyles from './filter.css.js';
import { KeyboardShortcut, Modifiers } from './KeyboardShortcut.js';
import { bindCheckbox } from './SettingsUI.js';
import { ToolbarFilter, ToolbarSettingToggle } from './Toolbar.js';
import { Tooltip } from './Tooltip.js';
import { CheckboxLabel, createTextChild } from './UIUtils.js';
import { HBox } from './Widget.js';
const UIStrings = {
    /**
     *@description Text to filter result items
     */
    filter: 'Filter',
    /**
     *@description Text that appears when hover over the filter bar in the Network tool
     */
    egSmalldUrlacomb: 'e.g. `/small[\d]+/ url:a.com/b`',
    /**
     *@description Text that appears when hover over the All button in the Network tool
     *@example {Ctrl + } PH1
     */
    sclickToSelectMultipleTypes: '{PH1}Click to select multiple types',
    /**
     *@description Text for everything
     */
    allStrings: 'All',
};
const str_ = i18n.i18n.registerUIStrings('ui/legacy/FilterBar.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class FilterBar extends Common.ObjectWrapper.eventMixin(HBox) {
    constructor(name, visibleByDefault) {
        super();
        this.registerRequiredCSS(filterStyles);
        this.enabled = true;
        this.element.classList.add('filter-bar');
        this.element.setAttribute('jslog', `${VisualLogging.toolbar('filter-bar')}`);
        this.stateSetting =
            Common.Settings.Settings.instance().createSetting('filter-bar-' + name + '-toggled', Boolean(visibleByDefault));
        this.filterButtonInternal =
            new ToolbarSettingToggle(this.stateSetting, 'filter', i18nString(UIStrings.filter), 'filter-filled', 'filter');
        this.filterButtonInternal.element.style.setProperty('--dot-toggle-top', '13px');
        this.filterButtonInternal.element.style.setProperty('--dot-toggle-left', '14px');
        this.filters = [];
        this.updateFilterBar();
        this.stateSetting.addChangeListener(this.updateFilterBar.bind(this));
    }
    filterButton() {
        return this.filterButtonInternal;
    }
    addDivider() {
        const element = document.createElement('div');
        element.classList.add('filter-divider');
        this.element.appendChild(element);
    }
    addFilter(filter) {
        this.filters.push(filter);
        this.element.appendChild(filter.element());
        filter.addEventListener("FilterChanged" /* FilterUIEvents.FILTER_CHANGED */, this.filterChanged, this);
        this.updateFilterButton();
    }
    setEnabled(enabled) {
        this.enabled = enabled;
        this.filterButtonInternal.setEnabled(enabled);
        this.updateFilterBar();
    }
    filterChanged() {
        this.updateFilterButton();
        this.dispatchEventToListeners("Changed" /* FilterBarEvents.CHANGED */);
    }
    wasShown() {
        super.wasShown();
        this.updateFilterBar();
    }
    updateFilterBar() {
        if (!this.parentWidget() || this.showingWidget) {
            return;
        }
        if (this.visible()) {
            this.showingWidget = true;
            this.showWidget();
            this.showingWidget = false;
        }
        else {
            this.hideWidget();
        }
    }
    focus() {
        for (let i = 0; i < this.filters.length; ++i) {
            if (this.filters[i] instanceof TextFilterUI) {
                const textFilterUI = this.filters[i];
                textFilterUI.focus();
                break;
            }
        }
    }
    hasActiveFilter() {
        for (const filter of this.filters) {
            if (filter.isActive()) {
                return true;
            }
        }
        return false;
    }
    updateFilterButton() {
        const isActive = this.hasActiveFilter();
        this.filterButtonInternal.setChecked(isActive);
    }
    clear() {
        this.element.removeChildren();
        this.filters = [];
        this.updateFilterButton();
    }
    setting() {
        return this.stateSetting;
    }
    visible() {
        return this.alwaysShowFilters || (this.stateSetting.get() && this.enabled);
    }
}
export var FilterBarEvents;
(function (FilterBarEvents) {
    FilterBarEvents["CHANGED"] = "Changed";
})(FilterBarEvents || (FilterBarEvents = {}));
export var FilterUIEvents;
(function (FilterUIEvents) {
    FilterUIEvents["FILTER_CHANGED"] = "FilterChanged";
})(FilterUIEvents || (FilterUIEvents = {}));
export class TextFilterUI extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _TextFilterUI_filter.set(this, void 0);
        this.filterElement = document.createElement('div');
        this.filterElement.classList.add('text-filter');
        const filterToolbar = this.filterElement.createChild('devtools-toolbar');
        // Set the style directly on the element to overwrite parent css styling.
        filterToolbar.style.borderBottom = 'none';
        __classPrivateFieldSet(this, _TextFilterUI_filter, new ToolbarFilter(undefined, 1, 1, i18nString(UIStrings.egSmalldUrlacomb), this.completions.bind(this)), "f");
        filterToolbar.appendToolbarItem(__classPrivateFieldGet(this, _TextFilterUI_filter, "f"));
        __classPrivateFieldGet(this, _TextFilterUI_filter, "f").addEventListener("TextChanged" /* ToolbarInput.Event.TEXT_CHANGED */, () => this.valueChanged());
        this.suggestionProvider = null;
    }
    completions(expression, prefix, force) {
        if (this.suggestionProvider) {
            return this.suggestionProvider(expression, prefix, force);
        }
        return Promise.resolve([]);
    }
    isActive() {
        return Boolean(__classPrivateFieldGet(this, _TextFilterUI_filter, "f").valueWithoutSuggestion());
    }
    element() {
        return this.filterElement;
    }
    value() {
        return __classPrivateFieldGet(this, _TextFilterUI_filter, "f").valueWithoutSuggestion();
    }
    setValue(value) {
        __classPrivateFieldGet(this, _TextFilterUI_filter, "f").setValue(value);
        this.valueChanged();
    }
    focus() {
        __classPrivateFieldGet(this, _TextFilterUI_filter, "f").focus();
    }
    setSuggestionProvider(suggestionProvider) {
        __classPrivateFieldGet(this, _TextFilterUI_filter, "f").clearAutocomplete();
        this.suggestionProvider = suggestionProvider;
    }
    valueChanged() {
        this.dispatchEventToListeners("FilterChanged" /* FilterUIEvents.FILTER_CHANGED */);
    }
    clear() {
        this.setValue('');
    }
}
_TextFilterUI_filter = new WeakMap();
export class NamedBitSetFilterUIElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _NamedBitSetFilterUIElement_instances.add(this);
        _NamedBitSetFilterUIElement_options.set(this, { items: [] });
        _NamedBitSetFilterUIElement_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _NamedBitSetFilterUIElement_namedBitSetFilterUI.set(this, void 0);
    }
    set options(options) {
        // return if they are the same
        if (__classPrivateFieldGet(this, _NamedBitSetFilterUIElement_options, "f").items.toString() === options.items.toString() && __classPrivateFieldGet(this, _NamedBitSetFilterUIElement_options, "f").setting === options.setting) {
            return;
        }
        __classPrivateFieldSet(this, _NamedBitSetFilterUIElement_options, options, "f");
        // When options are updated, clear the UI so that a new one is created with the new options
        __classPrivateFieldGet(this, _NamedBitSetFilterUIElement_shadow, "f").innerHTML = '';
        __classPrivateFieldSet(this, _NamedBitSetFilterUIElement_namedBitSetFilterUI, undefined, "f");
    }
    getOrCreateNamedBitSetFilterUI() {
        if (__classPrivateFieldGet(this, _NamedBitSetFilterUIElement_namedBitSetFilterUI, "f")) {
            return __classPrivateFieldGet(this, _NamedBitSetFilterUIElement_namedBitSetFilterUI, "f");
        }
        const namedBitSetFilterUI = new NamedBitSetFilterUI(__classPrivateFieldGet(this, _NamedBitSetFilterUIElement_options, "f").items, __classPrivateFieldGet(this, _NamedBitSetFilterUIElement_options, "f").setting);
        namedBitSetFilterUI.element().classList.add('named-bitset-filter');
        const styleElement = __classPrivateFieldGet(this, _NamedBitSetFilterUIElement_shadow, "f").createChild('style');
        styleElement.textContent = filterStyles;
        const disclosureElement = __classPrivateFieldGet(this, _NamedBitSetFilterUIElement_shadow, "f").createChild('div', 'named-bit-set-filter-disclosure');
        disclosureElement.appendChild(namedBitSetFilterUI.element());
        // Translate existing filter ("ObjectWrapper") events to DOM CustomEvents so clients can
        // use lit templates to bind listeners.
        namedBitSetFilterUI.addEventListener("FilterChanged" /* FilterUIEvents.FILTER_CHANGED */, __classPrivateFieldGet(this, _NamedBitSetFilterUIElement_instances, "m", _NamedBitSetFilterUIElement_filterChanged).bind(this));
        __classPrivateFieldSet(this, _NamedBitSetFilterUIElement_namedBitSetFilterUI, namedBitSetFilterUI, "f");
        return __classPrivateFieldGet(this, _NamedBitSetFilterUIElement_namedBitSetFilterUI, "f");
    }
}
_NamedBitSetFilterUIElement_options = new WeakMap(), _NamedBitSetFilterUIElement_shadow = new WeakMap(), _NamedBitSetFilterUIElement_namedBitSetFilterUI = new WeakMap(), _NamedBitSetFilterUIElement_instances = new WeakSet(), _NamedBitSetFilterUIElement_filterChanged = function _NamedBitSetFilterUIElement_filterChanged() {
    const domEvent = new CustomEvent('filterChanged');
    this.dispatchEvent(domEvent);
};
customElements.define('devtools-named-bit-set-filter', NamedBitSetFilterUIElement);
export class NamedBitSetFilterUI extends Common.ObjectWrapper.ObjectWrapper {
    constructor(items, setting) {
        super();
        this.typeFilterElementTypeNames = new WeakMap();
        this.allowedTypes = new Set();
        this.typeFilterElements = [];
        this.filtersElement = document.createElement('div');
        this.filtersElement.classList.add('filter-bitset-filter');
        this.filtersElement.setAttribute('jslog', `${VisualLogging.section('filter-bitset')}`);
        ARIAUtils.markAsListBox(this.filtersElement);
        ARIAUtils.markAsMultiSelectable(this.filtersElement);
        Tooltip.install(this.filtersElement, i18nString(UIStrings.sclickToSelectMultipleTypes, {
            PH1: KeyboardShortcut.shortcutToString('', Modifiers.CtrlOrMeta.value),
        }));
        this.addBit(NamedBitSetFilterUI.ALL_TYPES, i18nString(UIStrings.allStrings), NamedBitSetFilterUI.ALL_TYPES);
        this.typeFilterElements[0].tabIndex = 0;
        this.filtersElement.createChild('div', 'filter-bitset-filter-divider');
        for (let i = 0; i < items.length; ++i) {
            this.addBit(items[i].name, items[i].label(), items[i].jslogContext, items[i].title);
        }
        if (setting) {
            this.setting = setting;
            setting.addChangeListener(this.settingChanged.bind(this));
            this.settingChanged();
        }
        else {
            this.toggleTypeFilter(NamedBitSetFilterUI.ALL_TYPES, false /* allowMultiSelect */);
        }
    }
    reset() {
        this.toggleTypeFilter(NamedBitSetFilterUI.ALL_TYPES, false /* allowMultiSelect */);
    }
    isActive() {
        return !this.allowedTypes.has(NamedBitSetFilterUI.ALL_TYPES);
    }
    element() {
        return this.filtersElement;
    }
    accept(typeName) {
        return this.allowedTypes.has(NamedBitSetFilterUI.ALL_TYPES) || this.allowedTypes.has(typeName);
    }
    settingChanged() {
        const allowedTypesFromSetting = this.setting.get();
        this.allowedTypes = new Set();
        for (const element of this.typeFilterElements) {
            const typeName = this.typeFilterElementTypeNames.get(element);
            if (typeName && allowedTypesFromSetting[typeName]) {
                this.allowedTypes.add(typeName);
            }
        }
        this.update();
    }
    update() {
        if (this.allowedTypes.size === 0 || this.allowedTypes.has(NamedBitSetFilterUI.ALL_TYPES)) {
            this.allowedTypes = new Set();
            this.allowedTypes.add(NamedBitSetFilterUI.ALL_TYPES);
        }
        for (const element of this.typeFilterElements) {
            const typeName = this.typeFilterElementTypeNames.get(element);
            const active = this.allowedTypes.has(typeName || '');
            element.classList.toggle('selected', active);
            ARIAUtils.setSelected(element, active);
        }
        this.dispatchEventToListeners("FilterChanged" /* FilterUIEvents.FILTER_CHANGED */);
    }
    addBit(name, label, jslogContext, title) {
        const typeFilterElement = this.filtersElement.createChild('span', name);
        typeFilterElement.tabIndex = -1;
        this.typeFilterElementTypeNames.set(typeFilterElement, name);
        createTextChild(typeFilterElement, label);
        ARIAUtils.markAsOption(typeFilterElement);
        if (title) {
            typeFilterElement.title = title;
        }
        typeFilterElement.addEventListener('click', this.onTypeFilterClicked.bind(this), false);
        typeFilterElement.addEventListener('keydown', this.onTypeFilterKeydown.bind(this), false);
        typeFilterElement.setAttribute('jslog', `${VisualLogging.item(jslogContext).track({ click: true })}`);
        this.typeFilterElements.push(typeFilterElement);
    }
    onTypeFilterClicked(event) {
        const e = event;
        let toggle;
        if (Host.Platform.isMac()) {
            toggle = e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey;
        }
        else {
            toggle = e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey;
        }
        if (e.target) {
            const element = e.target;
            const typeName = this.typeFilterElementTypeNames.get(element);
            this.toggleTypeFilter(typeName, toggle);
        }
    }
    onTypeFilterKeydown(event) {
        const element = event.target;
        if (!element) {
            return;
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
            if (this.keyFocusNextBit(element, true /* selectPrevious */)) {
                event.consume(true);
            }
        }
        else if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
            if (this.keyFocusNextBit(element, false /* selectPrevious */)) {
                event.consume(true);
            }
        }
        else if (Platform.KeyboardUtilities.isEnterOrSpaceKey(event)) {
            this.onTypeFilterClicked(event);
        }
    }
    keyFocusNextBit(target, selectPrevious) {
        let index = this.typeFilterElements.indexOf(target);
        if (index === -1) {
            index = this.typeFilterElements.findIndex(el => el.classList.contains('selected'));
            if (index === -1) {
                index = selectPrevious ? this.typeFilterElements.length : -1;
            }
        }
        const nextIndex = selectPrevious ? index - 1 : index + 1;
        if (nextIndex < 0 || nextIndex >= this.typeFilterElements.length) {
            return false;
        }
        const nextElement = this.typeFilterElements[nextIndex];
        nextElement.tabIndex = 0;
        target.tabIndex = -1;
        nextElement.focus();
        return true;
    }
    toggleTypeFilter(typeName, allowMultiSelect) {
        if (allowMultiSelect && typeName !== NamedBitSetFilterUI.ALL_TYPES) {
            this.allowedTypes.delete(NamedBitSetFilterUI.ALL_TYPES);
        }
        else {
            this.allowedTypes = new Set();
        }
        if (this.allowedTypes.has(typeName)) {
            this.allowedTypes.delete(typeName);
        }
        else {
            this.allowedTypes.add(typeName);
        }
        if (this.allowedTypes.size === 0) {
            this.allowedTypes.add(NamedBitSetFilterUI.ALL_TYPES);
        }
        if (this.setting) {
            // Settings do not support `Sets` so convert it back to the Map-like object.
            const updatedSetting = {};
            for (const type of this.allowedTypes) {
                updatedSetting[type] = true;
            }
            this.setting.set(updatedSetting);
        }
        else {
            this.update();
        }
    }
}
NamedBitSetFilterUI.ALL_TYPES = 'all';
export class CheckboxFilterUI extends Common.ObjectWrapper.ObjectWrapper {
    constructor(title, activeWhenChecked, setting, jslogContext) {
        super();
        this.filterElement = document.createElement('div');
        this.filterElement.classList.add('filter-checkbox-filter');
        this.activeWhenChecked = Boolean(activeWhenChecked);
        this.checkbox = CheckboxLabel.create(title, undefined, undefined, jslogContext);
        this.filterElement.appendChild(this.checkbox);
        if (setting) {
            bindCheckbox(this.checkbox, setting);
        }
        else {
            this.checkbox.checked = true;
        }
        this.checkbox.addEventListener('change', this.fireUpdated.bind(this), false);
    }
    isActive() {
        return this.activeWhenChecked === this.checkbox.checked;
    }
    checked() {
        return this.checkbox.checked;
    }
    setChecked(checked) {
        this.checkbox.checked = checked;
    }
    element() {
        return this.filterElement;
    }
    labelElement() {
        return this.checkbox;
    }
    fireUpdated() {
        this.dispatchEventToListeners("FilterChanged" /* FilterUIEvents.FILTER_CHANGED */);
    }
}
//# sourceMappingURL=FilterBar.js.map