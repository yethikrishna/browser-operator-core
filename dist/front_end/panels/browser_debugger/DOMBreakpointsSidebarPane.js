/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
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
var _DOMBreakpointsSidebarPane_emptyElement, _DOMBreakpointsSidebarPane_breakpoints, _DOMBreakpointsSidebarPane_list, _DOMBreakpointsSidebarPane_highlightedBreakpoint;
/* eslint-disable rulesdir/no-imperative-dom-api */
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as Sources from '../sources/sources.js';
import domBreakpointsSidebarPaneStyles from './domBreakpointsSidebarPane.css.js';
const UIStrings = {
    /**
     *@description Header text to indicate there are no breakpoints
     */
    noBreakpoints: 'No DOM breakpoints',
    /**
     *@description DOM breakpoints description that shows if no DOM breakpoints are set
     */
    domBreakpointsDescription: 'DOM breakpoints pause on the code that changes a DOM node or its children.',
    /**
     *@description Accessibility label for the DOM breakpoints list in the Sources panel
     */
    domBreakpointsList: 'DOM Breakpoints list',
    /**
     *@description Text with two placeholders separated by a colon
     *@example {Node removed} PH1
     *@example {div#id1} PH2
     */
    sS: '{PH1}: {PH2}',
    /**
     *@description Text with three placeholders separated by a colon and a comma
     *@example {Node removed} PH1
     *@example {div#id1} PH2
     *@example {checked} PH3
     */
    sSS: '{PH1}: {PH2}, {PH3}',
    /**
     *@description Text exposed to screen readers on checked items.
     */
    checked: 'checked',
    /**
     *@description Accessible text exposed to screen readers when the screen reader encounters an unchecked checkbox.
     */
    unchecked: 'unchecked',
    /**
     *@description Accessibility label for hit breakpoints in the Sources panel.
     *@example {checked} PH1
     */
    sBreakpointHit: '{PH1} breakpoint hit',
    /**
     *@description Screen reader description of a hit breakpoint in the Sources panel
     */
    breakpointHit: 'breakpoint hit',
    /**
     *@description A context menu item in the DOM Breakpoints sidebar that reveals the node on which the current breakpoint is set.
     */
    revealDomNodeInElementsPanel: 'Reveal DOM node in Elements panel',
    /**
     *@description Text to remove a breakpoint
     */
    removeBreakpoint: 'Remove breakpoint',
    /**
     *@description A context menu item in the DOMBreakpoints Sidebar Pane of the JavaScript Debugging pane in the Sources panel or the DOM Breakpoints pane in the Elements panel
     */
    removeAllDomBreakpoints: 'Remove all DOM breakpoints',
    /**
     *@description Text in DOMBreakpoints Sidebar Pane of the JavaScript Debugging pane in the Sources panel or the DOM Breakpoints pane in the Elements panel
     */
    subtreeModified: 'Subtree modified',
    /**
     *@description Text in DOMBreakpoints Sidebar Pane of the JavaScript Debugging pane in the Sources panel or the DOM Breakpoints pane in the Elements panel
     */
    attributeModified: 'Attribute modified',
    /**
     *@description Text in DOMBreakpoints Sidebar Pane of the JavaScript Debugging pane in the Sources panel or the DOM Breakpoints pane in the Elements panel
     */
    nodeRemoved: 'Node removed',
    /**
     *@description Entry in context menu of the elements pane, allowing developers to select a DOM
     * breakpoint for the element that they have right-clicked on. Short for the action 'set a
     * breakpoint on this DOM Element'. A breakpoint pauses the website when the code reaches a
     * specified line, or when a specific action happen (in this case, when the DOM Element is
     * modified).
     */
    breakOn: 'Break on',
    /**
     *@description Screen reader description for removing a DOM breakpoint.
     */
    breakpointRemoved: 'Breakpoint removed',
    /**
     *@description Screen reader description for setting a DOM breakpoint.
     */
    breakpointSet: 'Breakpoint set',
};
const str_ = i18n.i18n.registerUIStrings('panels/browser_debugger/DOMBreakpointsSidebarPane.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
const DOM_BREAKPOINT_DOCUMENTATION_URL = 'https://developer.chrome.com/docs/devtools/javascript/breakpoints#dom';
let domBreakpointsSidebarPaneInstance;
export class DOMBreakpointsSidebarPane extends UI.Widget.VBox {
    constructor() {
        super(true);
        _DOMBreakpointsSidebarPane_emptyElement.set(this, void 0);
        _DOMBreakpointsSidebarPane_breakpoints.set(this, void 0);
        _DOMBreakpointsSidebarPane_list.set(this, void 0);
        _DOMBreakpointsSidebarPane_highlightedBreakpoint.set(this, void 0);
        this.registerRequiredCSS(domBreakpointsSidebarPaneStyles);
        this.elementToCheckboxes = new WeakMap();
        this.contentElement.setAttribute('jslog', `${VisualLogging.section('sources.dom-breakpoints').track({ resize: true })}`);
        this.contentElement.classList.add('dom-breakpoints-container');
        __classPrivateFieldSet(this, _DOMBreakpointsSidebarPane_emptyElement, this.contentElement.createChild('div', 'placeholder'), "f");
        __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_emptyElement, "f").createChild('div', 'gray-info-message').textContent = i18nString(UIStrings.noBreakpoints);
        const emptyWidget = new UI.EmptyWidget.EmptyWidget(UIStrings.noBreakpoints, i18nString(UIStrings.domBreakpointsDescription));
        emptyWidget.link = DOM_BREAKPOINT_DOCUMENTATION_URL;
        emptyWidget.show(__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_emptyElement, "f"));
        __classPrivateFieldSet(this, _DOMBreakpointsSidebarPane_breakpoints, new UI.ListModel.ListModel(), "f");
        __classPrivateFieldSet(this, _DOMBreakpointsSidebarPane_list, new UI.ListControl.ListControl(__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_breakpoints, "f"), this, UI.ListControl.ListMode.NonViewport), "f");
        this.contentElement.appendChild(__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").element);
        __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").element.classList.add('breakpoint-list', 'hidden');
        UI.ARIAUtils.markAsList(__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").element);
        UI.ARIAUtils.setLabel(__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").element, i18nString(UIStrings.domBreakpointsList));
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMDebuggerModel.DOMDebuggerModel, "DOMBreakpointAdded" /* SDK.DOMDebuggerModel.Events.DOM_BREAKPOINT_ADDED */, this.breakpointAdded, this);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMDebuggerModel.DOMDebuggerModel, "DOMBreakpointToggled" /* SDK.DOMDebuggerModel.Events.DOM_BREAKPOINT_TOGGLED */, this.breakpointToggled, this);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMDebuggerModel.DOMDebuggerModel, "DOMBreakpointsRemoved" /* SDK.DOMDebuggerModel.Events.DOM_BREAKPOINTS_REMOVED */, this.breakpointsRemoved, this);
        for (const domDebuggerModel of SDK.TargetManager.TargetManager.instance().models(SDK.DOMDebuggerModel.DOMDebuggerModel)) {
            domDebuggerModel.retrieveDOMBreakpoints();
            for (const breakpoint of domDebuggerModel.domBreakpoints()) {
                this.addBreakpoint(breakpoint);
            }
        }
        __classPrivateFieldSet(this, _DOMBreakpointsSidebarPane_highlightedBreakpoint, null, "f");
        this.update();
    }
    static instance() {
        if (!domBreakpointsSidebarPaneInstance) {
            domBreakpointsSidebarPaneInstance = new DOMBreakpointsSidebarPane();
        }
        return domBreakpointsSidebarPaneInstance;
    }
    createElementForItem(item) {
        const element = document.createElement('div');
        element.classList.add('breakpoint-entry');
        element.setAttribute('jslog', `${VisualLogging.domBreakpoint().context(item.type).track({ keydown: 'ArrowUp|ArrowDown|PageUp|PageDown' })}`);
        element.addEventListener('contextmenu', this.contextMenu.bind(this, item), true);
        UI.ARIAUtils.markAsListitem(element);
        element.tabIndex = -1;
        const checkbox = UI.UIUtils.CheckboxLabel.create(/* title */ undefined, item.enabled);
        checkbox.addEventListener('click', this.checkboxClicked.bind(this, item), false);
        checkbox.tabIndex = -1;
        this.elementToCheckboxes.set(element, checkbox);
        element.appendChild(checkbox);
        element.addEventListener('keydown', event => {
            if (event.key === ' ') {
                checkbox.click();
                event.consume(true);
            }
        });
        const labelElement = document.createElement('div');
        labelElement.classList.add('dom-breakpoint');
        element.appendChild(labelElement);
        const description = document.createElement('div');
        const breakpointTypeLabel = BreakpointTypeLabels.get(item.type);
        description.textContent = breakpointTypeLabel ? breakpointTypeLabel() : null;
        const breakpointTypeText = breakpointTypeLabel ? breakpointTypeLabel() : '';
        UI.ARIAUtils.setLabel(checkbox, breakpointTypeText);
        checkbox.setAttribute('jslog', `${VisualLogging.toggle().track({ click: true })}`);
        const checkedStateText = item.enabled ? i18nString(UIStrings.checked) : i18nString(UIStrings.unchecked);
        const linkifiedNode = document.createElement('monospace');
        linkifiedNode.style.display = 'block';
        labelElement.appendChild(linkifiedNode);
        void Common.Linkifier.Linkifier.linkify(item.node, { preventKeyboardFocus: true, tooltip: undefined })
            .then(linkified => {
            linkifiedNode.appendChild(linkified);
            // Give the checkbox an aria-label as it is required for all form element
            UI.ARIAUtils.setLabel(checkbox, i18nString(UIStrings.sS, { PH1: breakpointTypeText, PH2: linkified.deepTextContent() }));
            // The parent list element is the one that actually gets focused.
            // Assign it an aria-label with complete information for the screen reader to read out properly
            UI.ARIAUtils.setLabel(element, i18nString(UIStrings.sSS, { PH1: breakpointTypeText, PH2: linkified.deepTextContent(), PH3: checkedStateText }));
        });
        labelElement.appendChild(description);
        if (item === __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_highlightedBreakpoint, "f")) {
            element.classList.add('breakpoint-hit');
            UI.ARIAUtils.setDescription(element, i18nString(UIStrings.sBreakpointHit, { PH1: checkedStateText }));
            UI.ARIAUtils.setDescription(checkbox, i18nString(UIStrings.breakpointHit));
        }
        else {
            UI.ARIAUtils.setDescription(element, checkedStateText);
        }
        __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_emptyElement, "f").classList.add('hidden');
        __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").element.classList.remove('hidden');
        return element;
    }
    heightForItem(_item) {
        return 0;
    }
    isItemSelectable(_item) {
        return true;
    }
    updateSelectedItemARIA(_fromElement, _toElement) {
        return true;
    }
    selectedItemChanged(_from, _to, fromElement, toElement) {
        if (fromElement) {
            fromElement.tabIndex = -1;
        }
        if (toElement) {
            this.setDefaultFocusedElement(toElement);
            toElement.tabIndex = 0;
            if (this.hasFocus()) {
                toElement.focus();
            }
        }
    }
    breakpointAdded(event) {
        this.addBreakpoint(event.data);
    }
    breakpointToggled(event) {
        const hadFocus = this.hasFocus();
        const breakpoint = event.data;
        __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").refreshItem(breakpoint);
        if (hadFocus) {
            this.focus();
        }
    }
    breakpointsRemoved(event) {
        const hadFocus = this.hasFocus();
        const breakpoints = event.data;
        let lastIndex = -1;
        for (const breakpoint of breakpoints) {
            const index = __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_breakpoints, "f").indexOf(breakpoint);
            if (index >= 0) {
                __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_breakpoints, "f").remove(index);
                lastIndex = index;
            }
        }
        if (__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_breakpoints, "f").length === 0) {
            __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_emptyElement, "f").classList.remove('hidden');
            this.setDefaultFocusedElement(__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_emptyElement, "f"));
            __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").element.classList.add('hidden');
        }
        else if (lastIndex >= 0) {
            const breakpointToSelect = __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_breakpoints, "f").at(lastIndex);
            if (breakpointToSelect) {
                __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").selectItem(breakpointToSelect);
            }
        }
        if (hadFocus) {
            this.focus();
        }
    }
    addBreakpoint(breakpoint) {
        __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_breakpoints, "f").insertWithComparator(breakpoint, (breakpointA, breakpointB) => {
            if (breakpointA.type > breakpointB.type) {
                return -1;
            }
            if (breakpointA.type < breakpointB.type) {
                return 1;
            }
            return 0;
        });
        if (!__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").selectedItem() || !this.hasFocus()) {
            __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").selectItem(__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_breakpoints, "f").at(0));
        }
    }
    contextMenu(breakpoint, event) {
        const contextMenu = new UI.ContextMenu.ContextMenu(event);
        contextMenu.defaultSection().appendItem(i18nString(UIStrings.revealDomNodeInElementsPanel), () => Common.Revealer.reveal(breakpoint.node), { jslogContext: 'reveal-in-elements' });
        contextMenu.defaultSection().appendItem(i18nString(UIStrings.removeBreakpoint), () => {
            breakpoint.domDebuggerModel.removeDOMBreakpoint(breakpoint.node, breakpoint.type);
        }, { jslogContext: 'remove-breakpoint' });
        contextMenu.defaultSection().appendItem(i18nString(UIStrings.removeAllDomBreakpoints), () => {
            breakpoint.domDebuggerModel.removeAllDOMBreakpoints();
        }, { jslogContext: 'remove-all-dom-breakpoints' });
        void contextMenu.show();
    }
    checkboxClicked(breakpoint, event) {
        breakpoint.domDebuggerModel.toggleDOMBreakpoint(breakpoint, event.target ? event.target.checked : false);
    }
    flavorChanged(_object) {
        this.update();
    }
    update() {
        const details = UI.Context.Context.instance().flavor(SDK.DebuggerModel.DebuggerPausedDetails);
        if (__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_highlightedBreakpoint, "f")) {
            const oldHighlightedBreakpoint = __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_highlightedBreakpoint, "f");
            __classPrivateFieldSet(this, _DOMBreakpointsSidebarPane_highlightedBreakpoint, null, "f");
            __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").refreshItem(oldHighlightedBreakpoint);
        }
        if (!details?.auxData || details.reason !== "DOM" /* Protocol.Debugger.PausedEventReason.DOM */) {
            return;
        }
        const domDebuggerModel = details.debuggerModel.target().model(SDK.DOMDebuggerModel.DOMDebuggerModel);
        if (!domDebuggerModel) {
            return;
        }
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = domDebuggerModel.resolveDOMBreakpointData(details.auxData);
        if (!data) {
            return;
        }
        for (const breakpoint of __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_breakpoints, "f")) {
            if (breakpoint.node === data.node && breakpoint.type === data.type) {
                __classPrivateFieldSet(this, _DOMBreakpointsSidebarPane_highlightedBreakpoint, breakpoint, "f");
            }
        }
        if (__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_highlightedBreakpoint, "f")) {
            __classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_list, "f").refreshItem(__classPrivateFieldGet(this, _DOMBreakpointsSidebarPane_highlightedBreakpoint, "f"));
        }
        void UI.ViewManager.ViewManager.instance().showView('sources.dom-breakpoints');
    }
}
_DOMBreakpointsSidebarPane_emptyElement = new WeakMap(), _DOMBreakpointsSidebarPane_breakpoints = new WeakMap(), _DOMBreakpointsSidebarPane_list = new WeakMap(), _DOMBreakpointsSidebarPane_highlightedBreakpoint = new WeakMap();
const BreakpointTypeLabels = new Map([
    ["subtree-modified" /* Protocol.DOMDebugger.DOMBreakpointType.SubtreeModified */, i18nLazyString(UIStrings.subtreeModified)],
    ["attribute-modified" /* Protocol.DOMDebugger.DOMBreakpointType.AttributeModified */, i18nLazyString(UIStrings.attributeModified)],
    ["node-removed" /* Protocol.DOMDebugger.DOMBreakpointType.NodeRemoved */, i18nLazyString(UIStrings.nodeRemoved)],
]);
export class ContextMenuProvider {
    appendApplicableItems(_event, contextMenu, node) {
        if (node.pseudoType()) {
            return;
        }
        const domDebuggerModel = node.domModel().target().model(SDK.DOMDebuggerModel.DOMDebuggerModel);
        if (!domDebuggerModel) {
            return;
        }
        function toggleBreakpoint(type) {
            if (!domDebuggerModel) {
                return;
            }
            const label = Sources.DebuggerPausedMessage.BreakpointTypeNouns.get(type);
            const labelString = label ? label() : '';
            if (domDebuggerModel.hasDOMBreakpoint(node, type)) {
                domDebuggerModel.removeDOMBreakpoint(node, type);
                UI.ARIAUtils.LiveAnnouncer.alert(`${i18nString(UIStrings.breakpointRemoved)}: ${labelString}`);
            }
            else {
                domDebuggerModel.setDOMBreakpoint(node, type);
                UI.ARIAUtils.LiveAnnouncer.alert(`${i18nString(UIStrings.breakpointSet)}: ${labelString}`);
            }
        }
        const breakpointsMenu = contextMenu.debugSection().appendSubMenuItem(i18nString(UIStrings.breakOn), false, 'break-on');
        const allBreakpointTypes = {
            SubtreeModified: "subtree-modified" /* Protocol.DOMDebugger.DOMBreakpointType.SubtreeModified */,
            AttributeModified: "attribute-modified" /* Protocol.DOMDebugger.DOMBreakpointType.AttributeModified */,
            NodeRemoved: "node-removed" /* Protocol.DOMDebugger.DOMBreakpointType.NodeRemoved */,
        };
        for (const type of Object.values(allBreakpointTypes)) {
            const label = Sources.DebuggerPausedMessage.BreakpointTypeNouns.get(type);
            if (label) {
                breakpointsMenu.defaultSection().appendCheckboxItem(label(), toggleBreakpoint.bind(null, type), { checked: domDebuggerModel.hasDOMBreakpoint(node, type), jslogContext: type });
            }
        }
    }
}
//# sourceMappingURL=DOMBreakpointsSidebarPane.js.map