// Copyright (c) 2015 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _FilterToolbar_view, _FilterToolbar_filterText, _CategorizedBreakpointsSidebarPane_instances, _CategorizedBreakpointsSidebarPane_categoriesTreeOutline, _CategorizedBreakpointsSidebarPane_viewId, _CategorizedBreakpointsSidebarPane_detailsPausedReason, _CategorizedBreakpointsSidebarPane_categories, _CategorizedBreakpointsSidebarPane_breakpoints, _CategorizedBreakpointsSidebarPane_highlightedElement, _CategorizedBreakpointsSidebarPane_sortedCategories, _CategorizedBreakpointsSidebarPane_expandedForFilter, _CategorizedBreakpointsSidebarPane_onFilterChanged;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Sources from '../../panels/sources/sources.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import categorizedBreakpointsSidebarPaneStyles from './categorizedBreakpointsSidebarPane.css.js';
const UIStrings = {
    /**
     * @description Category of breakpoints
     */
    auctionWorklet: 'Ad Auction Worklet',
    /**
     *@description Text that refers to the animation of the web page
     */
    animation: 'Animation',
    /**
     *@description Screen reader description of a hit breakpoint in the Sources panel
     */
    breakpointHit: 'breakpoint hit',
    /**
     *@description Text in DOMDebugger Model
     */
    canvas: 'Canvas',
    /**
     *@description Text in DOMDebugger Model
     */
    clipboard: 'Clipboard',
    /**
     * @description Noun. Describes a group of DOM events (such as 'select' and 'submit') in this context.
     */
    control: 'Control',
    /**
     *@description Text that refers to device such as a phone
     */
    device: 'Device',
    /**
     *@description Text in DOMDebugger Model
     */
    domMutation: 'DOM Mutation',
    /**
     *@description Text in DOMDebugger Model
     */
    dragDrop: 'Drag / drop',
    /**
     *@description Title for a group of cities
     */
    geolocation: 'Geolocation',
    /**
     *@description Text in DOMDebugger Model
     */
    keyboard: 'Keyboard',
    /**
     *@description Text to load something
     */
    load: 'Load',
    /**
     *@description Text that appears on a button for the media resource type filter.
     */
    media: 'Media',
    /**
     *@description Text in DOMDebugger Model
     */
    mouse: 'Mouse',
    /**
     *@description Text in DOMDebugger Model
     */
    notification: 'Notification',
    /**
     *@description Text to parse something
     */
    parse: 'Parse',
    /**
     *@description Text in DOMDebugger Model
     */
    pictureinpicture: 'Picture-in-Picture',
    /**
     *@description Text in DOMDebugger Model
     */
    pointer: 'Pointer',
    /**
     *@description Label for a group of JavaScript files
     */
    script: 'Script',
    /**
     *@description Category of breakpoints
     */
    sharedStorageWorklet: 'Shared Storage Worklet',
    /**
     *@description Text in DOMDebugger Model
     */
    timer: 'Timer',
    /**
     *@description Text for the touch type to simulate on a device
     */
    touch: 'Touch',
    /**
     *@description Title for a category of breakpoints on Trusted Type violations
     */
    trustedTypeViolations: 'Trusted Type Violations',
    /**
     *@description Title of the WebAudio tool
     */
    webaudio: 'WebAudio',
    /**
     *@description Text in DOMDebugger Model
     */
    window: 'Window',
    /**
     *@description Text for the service worker type.
     */
    worker: 'Worker',
    /**
     *@description Text that appears on a button for the xhr resource type filter.
     */
    xhr: 'XHR',
};
const str_ = i18n.i18n.registerUIStrings('panels/browser_debugger/CategorizedBreakpointsSidebarPane.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
const { html, render } = Lit;
const DEFAULT_VIEW = (input, _output, target) => {
    render(
    // clang-format off
    html `
    <devtools-toolbar jslog=${VisualLogging.toolbar()}>
      <devtools-toolbar-input
        type="filter"
        @change=${input.onFilterChanged}
        style="flex: 1;"
        ></devtools-toolbar-input>
    </devtools-toolbar>`, 
    // clang-format on
    target, { host: input });
};
export class FilterToolbar extends Common.ObjectWrapper.eventMixin(UI.Widget.VBox) {
    constructor(element, view = DEFAULT_VIEW) {
        super(false, false, element);
        _FilterToolbar_view.set(this, void 0);
        _FilterToolbar_filterText.set(this, null);
        __classPrivateFieldSet(this, _FilterToolbar_view, view, "f");
        this.performUpdate();
    }
    get filterText() {
        return __classPrivateFieldGet(this, _FilterToolbar_filterText, "f");
    }
    performUpdate() {
        const input = {
            onFilterChanged: e => {
                __classPrivateFieldSet(this, _FilterToolbar_filterText, e.detail, "f");
                this.dispatchEventToListeners(FilterToolbar.Events.FILTER_CHANGED, e.detail);
            },
        };
        __classPrivateFieldGet(this, _FilterToolbar_view, "f").call(this, input, {}, this.contentElement);
    }
}
_FilterToolbar_view = new WeakMap(), _FilterToolbar_filterText = new WeakMap();
(function (FilterToolbar) {
    let Events;
    (function (Events) {
        Events["FILTER_CHANGED"] = "filter-changed";
    })(Events = FilterToolbar.Events || (FilterToolbar.Events = {}));
})(FilterToolbar || (FilterToolbar = {}));
export class CategorizedBreakpointsSidebarPane extends UI.Widget.VBox {
    constructor(breakpoints, viewId, detailsPausedReason) {
        super(true);
        _CategorizedBreakpointsSidebarPane_instances.add(this);
        _CategorizedBreakpointsSidebarPane_categoriesTreeOutline.set(this, void 0);
        _CategorizedBreakpointsSidebarPane_viewId.set(this, void 0);
        _CategorizedBreakpointsSidebarPane_detailsPausedReason.set(this, void 0);
        _CategorizedBreakpointsSidebarPane_categories.set(this, void 0);
        _CategorizedBreakpointsSidebarPane_breakpoints.set(this, void 0);
        _CategorizedBreakpointsSidebarPane_highlightedElement.set(this, void 0);
        _CategorizedBreakpointsSidebarPane_sortedCategories.set(this, void 0);
        _CategorizedBreakpointsSidebarPane_expandedForFilter.set(this, new Set());
        this.filterToolbar = new FilterToolbar();
        this.filterToolbar.addEventListener(FilterToolbar.Events.FILTER_CHANGED, __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_instances, "m", _CategorizedBreakpointsSidebarPane_onFilterChanged).bind(this));
        this.filterToolbar.show(this.contentElement);
        __classPrivateFieldSet(this, _CategorizedBreakpointsSidebarPane_categoriesTreeOutline, new UI.TreeOutline.TreeOutlineInShadow(), "f");
        __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categoriesTreeOutline, "f").registerRequiredCSS(categorizedBreakpointsSidebarPaneStyles);
        __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categoriesTreeOutline, "f").setShowSelectionOnKeyboardFocus(/* show */ true);
        this.contentElement.appendChild(__classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categoriesTreeOutline, "f").element);
        __classPrivateFieldSet(this, _CategorizedBreakpointsSidebarPane_viewId, viewId, "f");
        __classPrivateFieldSet(this, _CategorizedBreakpointsSidebarPane_detailsPausedReason, detailsPausedReason, "f");
        const categories = new Set(breakpoints.map(bp => bp.category()));
        __classPrivateFieldSet(this, _CategorizedBreakpointsSidebarPane_sortedCategories, [...categories].sort((a, b) => {
            const categoryA = getLocalizedCategory(a);
            const categoryB = getLocalizedCategory(b);
            return categoryA.localeCompare(categoryB, i18n.DevToolsLocale.DevToolsLocale.instance().locale);
        }), "f");
        __classPrivateFieldSet(this, _CategorizedBreakpointsSidebarPane_categories, new Map(), "f");
        for (const category of __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_sortedCategories, "f")) {
            this.createCategory(category);
        }
        if (__classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_sortedCategories, "f").length > 0) {
            const firstCategory = __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categories, "f").get(__classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_sortedCategories, "f")[0]);
            if (firstCategory) {
                firstCategory.element.select();
            }
        }
        __classPrivateFieldSet(this, _CategorizedBreakpointsSidebarPane_breakpoints, new Map(), "f");
        for (const breakpoint of breakpoints) {
            this.createBreakpoint(breakpoint);
        }
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DebuggerModel.DebuggerModel, SDK.DebuggerModel.Events.DebuggerPaused, this.update, this);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DebuggerModel.DebuggerModel, SDK.DebuggerModel.Events.DebuggerResumed, this.update, this);
        UI.Context.Context.instance().addFlavorChangeListener(SDK.Target.Target, this.update, this);
        this.populate();
    }
    get categories() {
        return __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categories, "f");
    }
    get breakpoints() {
        return __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_breakpoints, "f");
    }
    get treeOutline() {
        return __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categoriesTreeOutline, "f");
    }
    focus() {
        __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categoriesTreeOutline, "f").forceSelect();
    }
    handleSpaceKeyEventOnBreakpoint(event, breakpoint) {
        if (event && event.key === ' ') {
            if (breakpoint) {
                breakpoint.checkbox.click();
            }
            event.consume(true);
        }
    }
    createCategory(name) {
        const labelNode = UI.UIUtils.CheckboxLabel.create(getLocalizedCategory(name), undefined, undefined, name, /* small */ true);
        labelNode.addEventListener('click', this.categoryCheckboxClicked.bind(this, name), true);
        labelNode.tabIndex = -1;
        const treeElement = new UI.TreeOutline.TreeElement(labelNode, undefined, name);
        treeElement.listItemElement.addEventListener('keydown', event => {
            this.handleSpaceKeyEventOnBreakpoint(event, __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categories, "f").get(name));
        });
        labelNode.addEventListener('keydown', event => {
            treeElement.listItemElement.focus();
            this.handleSpaceKeyEventOnBreakpoint(event, __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categories, "f").get(name));
        });
        UI.ARIAUtils.setChecked(treeElement.listItemElement, false);
        __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categories, "f").set(name, { element: treeElement, checkbox: labelNode, category: name });
    }
    createBreakpoint(breakpoint) {
        const labelNode = UI.UIUtils.CheckboxLabel.create(Sources.CategorizedBreakpointL10n.getLocalizedBreakpointName(breakpoint.name), undefined, undefined, Platform.StringUtilities.toKebabCase(breakpoint.name), /* small */ true);
        labelNode.classList.add('source-code', 'breakpoint');
        labelNode.addEventListener('click', this.breakpointCheckboxClicked.bind(this, breakpoint), true);
        labelNode.tabIndex = -1;
        const treeElement = new UI.TreeOutline.TreeElement(labelNode, undefined, Platform.StringUtilities.toKebabCase(breakpoint.name));
        treeElement.listItemElement.addEventListener('keydown', event => {
            this.handleSpaceKeyEventOnBreakpoint(event, __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_breakpoints, "f").get(breakpoint));
        });
        labelNode.addEventListener('keydown', event => {
            treeElement.listItemElement.focus();
            this.handleSpaceKeyEventOnBreakpoint(event, __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_breakpoints, "f").get(breakpoint));
        });
        UI.ARIAUtils.setChecked(treeElement.listItemElement, false);
        treeElement.listItemElement.createChild('div', 'breakpoint-hit-marker');
        const category = __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categories, "f").get(breakpoint.category());
        if (category) {
            __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_breakpoints, "f").set(breakpoint, { element: treeElement, checkbox: labelNode, category: category.category });
        }
    }
    getBreakpointFromPausedDetails(_details) {
        return null;
    }
    update() {
        const target = UI.Context.Context.instance().flavor(SDK.Target.Target);
        const debuggerModel = target ? target.model(SDK.DebuggerModel.DebuggerModel) : null;
        const details = debuggerModel ? debuggerModel.debuggerPausedDetails() : null;
        if (!details || details.reason !== __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_detailsPausedReason, "f") || !details.auxData) {
            if (__classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_highlightedElement, "f")) {
                UI.ARIAUtils.setDescription(__classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_highlightedElement, "f"), '');
                __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_highlightedElement, "f").classList.remove('breakpoint-hit');
                __classPrivateFieldSet(this, _CategorizedBreakpointsSidebarPane_highlightedElement, undefined, "f");
            }
            return;
        }
        const breakpoint = this.getBreakpointFromPausedDetails(details);
        if (!breakpoint) {
            return;
        }
        void UI.ViewManager.ViewManager.instance().showView(__classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_viewId, "f"));
        const category = __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categories, "f").get(breakpoint.category());
        if (category) {
            category.element.expand();
            __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_expandedForFilter, "f").delete(category.category);
        }
        const matchingBreakpoint = __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_breakpoints, "f").get(breakpoint);
        if (matchingBreakpoint) {
            __classPrivateFieldSet(this, _CategorizedBreakpointsSidebarPane_highlightedElement, matchingBreakpoint.element.listItemElement, "f");
            UI.ARIAUtils.setDescription(__classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_highlightedElement, "f"), i18nString(UIStrings.breakpointHit));
            __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_highlightedElement, "f").classList.add('breakpoint-hit');
        }
        this.populate(this.filterToolbar.filterText);
    }
    populate(filterText = null) {
        __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categoriesTreeOutline, "f").removeChildren();
        for (const category of __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_sortedCategories, "f")) {
            this.categories.get(category)?.element.removeChildren();
        }
        const nonEmptyCategories = new Set();
        for (const [breakpoint, item] of __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_breakpoints, "f")) {
            if (!filterText || breakpoint.name.match(filterText) ||
                item.element.listItemElement === __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_highlightedElement, "f")) {
                const categoryItem = this.categories.get(breakpoint.category());
                if (!categoryItem) {
                    continue;
                }
                if (!nonEmptyCategories.has(breakpoint.category())) {
                    nonEmptyCategories.add(breakpoint.category());
                }
                categoryItem.element.appendChild(item.element);
            }
        }
        for (const category of __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_sortedCategories, "f")) {
            if (nonEmptyCategories.has(category)) {
                const treeElement = this.categories.get(category).element;
                __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categoriesTreeOutline, "f").appendChild(treeElement);
                if (filterText && !treeElement.expanded) {
                    __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_expandedForFilter, "f").add(category);
                    treeElement.expand();
                }
                else if (!filterText && __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_expandedForFilter, "f").has(category)) {
                    __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_expandedForFilter, "f").delete(category);
                    treeElement.collapse();
                }
            }
        }
    }
    // Probably can be kept although eventListener does not call this._breakpointCheckboxClicke
    categoryCheckboxClicked(category) {
        const item = __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categories, "f").get(category);
        if (!item) {
            return;
        }
        const enabled = item.checkbox.checked;
        UI.ARIAUtils.setChecked(item.element.listItemElement, enabled);
        for (const [breakpoint, treeItem] of __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_breakpoints, "f")) {
            if (breakpoint.category() === category) {
                const matchingBreakpoint = __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_breakpoints, "f").get(breakpoint);
                if (matchingBreakpoint) {
                    matchingBreakpoint.checkbox.checked = enabled;
                    this.toggleBreakpoint(breakpoint, enabled);
                    UI.ARIAUtils.setChecked(treeItem.element.listItemElement, enabled);
                }
            }
        }
    }
    toggleBreakpoint(breakpoint, enabled) {
        breakpoint.setEnabled(enabled);
    }
    breakpointCheckboxClicked(breakpoint) {
        const item = __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_breakpoints, "f").get(breakpoint);
        if (!item) {
            return;
        }
        this.toggleBreakpoint(breakpoint, item.checkbox.checked);
        UI.ARIAUtils.setChecked(item.element.listItemElement, item.checkbox.checked);
        // Put the rest in a separate function
        let hasEnabled = false;
        let hasDisabled = false;
        for (const other of __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_breakpoints, "f").keys()) {
            if (other.category() === breakpoint.category()) {
                if (other.enabled()) {
                    hasEnabled = true;
                }
                else {
                    hasDisabled = true;
                }
            }
        }
        const category = __classPrivateFieldGet(this, _CategorizedBreakpointsSidebarPane_categories, "f").get(breakpoint.category());
        if (!category) {
            return;
        }
        category.checkbox.checked = hasEnabled;
        category.checkbox.indeterminate = hasEnabled && hasDisabled;
        if (category.checkbox.indeterminate) {
            UI.ARIAUtils.setCheckboxAsIndeterminate(category.element.listItemElement);
        }
        else {
            UI.ARIAUtils.setChecked(category.element.listItemElement, hasEnabled);
        }
    }
}
_CategorizedBreakpointsSidebarPane_categoriesTreeOutline = new WeakMap(), _CategorizedBreakpointsSidebarPane_viewId = new WeakMap(), _CategorizedBreakpointsSidebarPane_detailsPausedReason = new WeakMap(), _CategorizedBreakpointsSidebarPane_categories = new WeakMap(), _CategorizedBreakpointsSidebarPane_breakpoints = new WeakMap(), _CategorizedBreakpointsSidebarPane_highlightedElement = new WeakMap(), _CategorizedBreakpointsSidebarPane_sortedCategories = new WeakMap(), _CategorizedBreakpointsSidebarPane_expandedForFilter = new WeakMap(), _CategorizedBreakpointsSidebarPane_instances = new WeakSet(), _CategorizedBreakpointsSidebarPane_onFilterChanged = function _CategorizedBreakpointsSidebarPane_onFilterChanged(e) {
    this.populate(e.data);
};
const LOCALIZED_CATEGORIES = {
    ["animation" /* SDK.CategorizedBreakpoint.Category.ANIMATION */]: i18nLazyString(UIStrings.animation),
    ["auction-worklet" /* SDK.CategorizedBreakpoint.Category.AUCTION_WORKLET */]: i18nLazyString(UIStrings.auctionWorklet),
    ["canvas" /* SDK.CategorizedBreakpoint.Category.CANVAS */]: i18nLazyString(UIStrings.canvas),
    ["clipboard" /* SDK.CategorizedBreakpoint.Category.CLIPBOARD */]: i18nLazyString(UIStrings.clipboard),
    ["control" /* SDK.CategorizedBreakpoint.Category.CONTROL */]: i18nLazyString(UIStrings.control),
    ["device" /* SDK.CategorizedBreakpoint.Category.DEVICE */]: i18nLazyString(UIStrings.device),
    ["dom-mutation" /* SDK.CategorizedBreakpoint.Category.DOM_MUTATION */]: i18nLazyString(UIStrings.domMutation),
    ["drag-drop" /* SDK.CategorizedBreakpoint.Category.DRAG_DROP */]: i18nLazyString(UIStrings.dragDrop),
    ["geolocation" /* SDK.CategorizedBreakpoint.Category.GEOLOCATION */]: i18nLazyString(UIStrings.geolocation),
    ["keyboard" /* SDK.CategorizedBreakpoint.Category.KEYBOARD */]: i18nLazyString(UIStrings.keyboard),
    ["load" /* SDK.CategorizedBreakpoint.Category.LOAD */]: i18nLazyString(UIStrings.load),
    ["media" /* SDK.CategorizedBreakpoint.Category.MEDIA */]: i18nLazyString(UIStrings.media),
    ["mouse" /* SDK.CategorizedBreakpoint.Category.MOUSE */]: i18nLazyString(UIStrings.mouse),
    ["notification" /* SDK.CategorizedBreakpoint.Category.NOTIFICATION */]: i18nLazyString(UIStrings.notification),
    ["parse" /* SDK.CategorizedBreakpoint.Category.PARSE */]: i18nLazyString(UIStrings.parse),
    ["picture-in-picture" /* SDK.CategorizedBreakpoint.Category.PICTURE_IN_PICTURE */]: i18nLazyString(UIStrings.pictureinpicture),
    ["pointer" /* SDK.CategorizedBreakpoint.Category.POINTER */]: i18nLazyString(UIStrings.pointer),
    ["script" /* SDK.CategorizedBreakpoint.Category.SCRIPT */]: i18nLazyString(UIStrings.script),
    ["shared-storage-worklet" /* SDK.CategorizedBreakpoint.Category.SHARED_STORAGE_WORKLET */]: i18nLazyString(UIStrings.sharedStorageWorklet),
    ["timer" /* SDK.CategorizedBreakpoint.Category.TIMER */]: i18nLazyString(UIStrings.timer),
    ["touch" /* SDK.CategorizedBreakpoint.Category.TOUCH */]: i18nLazyString(UIStrings.touch),
    ["trusted-type-violation" /* SDK.CategorizedBreakpoint.Category.TRUSTED_TYPE_VIOLATION */]: i18nLazyString(UIStrings.trustedTypeViolations),
    ["web-audio" /* SDK.CategorizedBreakpoint.Category.WEB_AUDIO */]: i18nLazyString(UIStrings.webaudio),
    ["window" /* SDK.CategorizedBreakpoint.Category.WINDOW */]: i18nLazyString(UIStrings.window),
    ["worker" /* SDK.CategorizedBreakpoint.Category.WORKER */]: i18nLazyString(UIStrings.worker),
    ["xhr" /* SDK.CategorizedBreakpoint.Category.XHR */]: i18nLazyString(UIStrings.xhr),
};
function getLocalizedCategory(category) {
    return LOCALIZED_CATEGORIES[category]();
}
//# sourceMappingURL=CategorizedBreakpointsSidebarPane.js.map