// Copyright (c) 2020 The Chromium Authors. All rights reserved.
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
var _LinearMemoryInspectorPane_instances, _LinearMemoryInspectorPane_tabbedPane, _LinearMemoryInspectorPane_tabView, _LinearMemoryInspectorPane_tabClosed, _LinearMemoryInspectorView_instances, _LinearMemoryInspectorView_memoryWrapper, _LinearMemoryInspectorView_address, _LinearMemoryInspectorView_tabId, _LinearMemoryInspectorView_inspector, _LinearMemoryInspectorView_hideValueInspector, _LinearMemoryInspectorView_memoryRequested, _LinearMemoryInspectorView_getHighlightInfo;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as LinearMemoryInspectorComponents from './components/components.js';
import { LinearMemoryInspectorController } from './LinearMemoryInspectorController.js';
const UIStrings = {
    /**
     *@description Label in the Linear Memory inspector tool that serves as a placeholder if no inspections are open (i.e. nothing to see here).
     *             Inspection hereby refers to viewing, navigating and understanding the memory through this tool.
     */
    noOpenInspections: 'No open inspections',
    /**
     *@description Label in the Linear Memory inspector tool that serves as a placeholder if no inspections are open (i.e. nothing to see here).
     *             Inspection hereby refers to viewing, navigating and understanding the memory through this tool.
     */
    memoryInspectorExplanation: 'On this page you can inspect binary data.',
    /**
     *@description Label in the Linear Memory inspector tool for a link.
     */
    learnMore: 'Learn more',
};
const str_ = i18n.i18n.registerUIStrings('panels/linear_memory_inspector/LinearMemoryInspectorPane.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
let inspectorInstance;
const MEMORY_INSPECTOR_EXPLANATION_URL = 'https://developer.chrome.com/docs/devtools/memory-inspector';
export class LinearMemoryInspectorPane extends Common.ObjectWrapper.eventMixin(UI.Widget.VBox) {
    constructor() {
        super(false);
        _LinearMemoryInspectorPane_instances.add(this);
        _LinearMemoryInspectorPane_tabbedPane.set(this, void 0);
        this.element.setAttribute('jslog', `${VisualLogging.panel('linear-memory-inspector').track({ resize: true })}`);
        __classPrivateFieldSet(this, _LinearMemoryInspectorPane_tabbedPane, new UI.TabbedPane.TabbedPane(), "f");
        __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").setPlaceholderElement(this.createPlaceholder());
        __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").setCloseableTabs(true);
        __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").setAllowTabReorder(true, true);
        __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").addEventListener(UI.TabbedPane.Events.TabClosed, __classPrivateFieldGet(this, _LinearMemoryInspectorPane_instances, "m", _LinearMemoryInspectorPane_tabClosed), this);
        __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").show(this.contentElement);
        __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").headerElement().setAttribute('jslog', `${VisualLogging.toolbar().track({ keydown: 'ArrowUp|ArrowLeft|ArrowDown|ArrowRight|Enter|Space' })}`);
    }
    createPlaceholder() {
        const placeholder = document.createElement('div');
        placeholder.classList.add('empty-state');
        placeholder.createChild('span', 'empty-state-header').textContent = i18nString(UIStrings.noOpenInspections);
        const description = placeholder.createChild('div', 'empty-state-description');
        description.createChild('span').textContent = i18nString(UIStrings.memoryInspectorExplanation);
        const link = UI.XLink.XLink.create(MEMORY_INSPECTOR_EXPLANATION_URL, i18nString(UIStrings.learnMore), undefined, undefined, 'learn-more');
        description.appendChild(link);
        return placeholder;
    }
    static instance() {
        if (!inspectorInstance) {
            inspectorInstance = new LinearMemoryInspectorPane();
        }
        return inspectorInstance;
    }
    create(tabId, title, arrayWrapper, address) {
        const inspectorView = new LinearMemoryInspectorView(arrayWrapper, address, tabId);
        __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").appendTab(tabId, title, inspectorView, undefined, false, true);
        __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").selectTab(tabId);
    }
    close(tabId) {
        __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").closeTab(tabId, false);
    }
    reveal(tabId, address) {
        const view = __classPrivateFieldGet(this, _LinearMemoryInspectorPane_instances, "m", _LinearMemoryInspectorPane_tabView).call(this, tabId);
        if (address !== undefined) {
            view.updateAddress(address);
        }
        this.refreshView(tabId);
        __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").selectTab(tabId);
    }
    refreshView(tabId) {
        const view = __classPrivateFieldGet(this, _LinearMemoryInspectorPane_instances, "m", _LinearMemoryInspectorPane_tabView).call(this, tabId);
        view.refreshData();
    }
}
_LinearMemoryInspectorPane_tabbedPane = new WeakMap(), _LinearMemoryInspectorPane_instances = new WeakSet(), _LinearMemoryInspectorPane_tabView = function _LinearMemoryInspectorPane_tabView(tabId) {
    const view = __classPrivateFieldGet(this, _LinearMemoryInspectorPane_tabbedPane, "f").tabView(tabId);
    if (view === null) {
        throw new Error(`No linear memory inspector view for the given tab id: ${tabId}`);
    }
    return view;
}, _LinearMemoryInspectorPane_tabClosed = function _LinearMemoryInspectorPane_tabClosed(event) {
    const { tabId } = event.data;
    this.dispatchEventToListeners("ViewClosed" /* Events.VIEW_CLOSED */, tabId);
};
export var Events;
(function (Events) {
    Events["VIEW_CLOSED"] = "ViewClosed";
})(Events || (Events = {}));
export class LinearMemoryInspectorView extends UI.Widget.VBox {
    constructor(memoryWrapper, address = 0, tabId, hideValueInspector) {
        super(false);
        _LinearMemoryInspectorView_instances.add(this);
        _LinearMemoryInspectorView_memoryWrapper.set(this, void 0);
        _LinearMemoryInspectorView_address.set(this, void 0);
        _LinearMemoryInspectorView_tabId.set(this, void 0);
        _LinearMemoryInspectorView_inspector.set(this, void 0);
        _LinearMemoryInspectorView_hideValueInspector.set(this, void 0);
        if (address < 0 || address >= memoryWrapper.length()) {
            throw new Error('Requested address is out of bounds.');
        }
        __classPrivateFieldSet(this, _LinearMemoryInspectorView_memoryWrapper, memoryWrapper, "f");
        __classPrivateFieldSet(this, _LinearMemoryInspectorView_address, address, "f");
        __classPrivateFieldSet(this, _LinearMemoryInspectorView_tabId, tabId, "f");
        __classPrivateFieldSet(this, _LinearMemoryInspectorView_hideValueInspector, Boolean(hideValueInspector), "f");
        __classPrivateFieldSet(this, _LinearMemoryInspectorView_inspector, new LinearMemoryInspectorComponents.LinearMemoryInspector.LinearMemoryInspector(), "f");
        __classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f").addEventListener(LinearMemoryInspectorComponents.LinearMemoryInspector.MemoryRequestEvent.eventName, (event) => {
            __classPrivateFieldGet(this, _LinearMemoryInspectorView_instances, "m", _LinearMemoryInspectorView_memoryRequested).call(this, event);
        });
        __classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f").addEventListener(LinearMemoryInspectorComponents.LinearMemoryInspector.AddressChangedEvent.eventName, (event) => {
            this.updateAddress(event.data);
        });
        __classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f").addEventListener(LinearMemoryInspectorComponents.LinearMemoryInspector.SettingsChangedEvent.eventName, (event) => {
            // Stop event from bubbling up, since no element further up needs the event.
            event.stopPropagation();
            this.saveSettings(event.data);
        });
        __classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f").addEventListener(LinearMemoryInspectorComponents.LinearMemoryHighlightChipList.DeleteMemoryHighlightEvent.eventName, (event) => {
            LinearMemoryInspectorController.instance().removeHighlight(__classPrivateFieldGet(this, _LinearMemoryInspectorView_tabId, "f"), event.data);
            this.refreshData();
        });
        this.contentElement.appendChild(__classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f"));
        this.firstTimeOpen = true;
    }
    wasShown() {
        this.refreshData();
    }
    saveSettings(settings) {
        LinearMemoryInspectorController.instance().saveSettings(settings);
    }
    updateAddress(address) {
        if (address < 0 || address >= __classPrivateFieldGet(this, _LinearMemoryInspectorView_memoryWrapper, "f").length()) {
            throw new Error('Requested address is out of bounds.');
        }
        __classPrivateFieldSet(this, _LinearMemoryInspectorView_address, address, "f");
    }
    refreshData() {
        void LinearMemoryInspectorController.getMemoryForAddress(__classPrivateFieldGet(this, _LinearMemoryInspectorView_memoryWrapper, "f"), __classPrivateFieldGet(this, _LinearMemoryInspectorView_address, "f")).then(({ memory, offset, }) => {
            let valueTypes;
            let valueTypeModes;
            let endianness;
            if (this.firstTimeOpen) {
                const settings = LinearMemoryInspectorController.instance().loadSettings();
                valueTypes = settings.valueTypes;
                valueTypeModes = settings.modes;
                endianness = settings.endianness;
                this.firstTimeOpen = false;
            }
            __classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f").data = {
                memory,
                address: __classPrivateFieldGet(this, _LinearMemoryInspectorView_address, "f"),
                memoryOffset: offset,
                outerMemoryLength: __classPrivateFieldGet(this, _LinearMemoryInspectorView_memoryWrapper, "f").length(),
                valueTypes,
                valueTypeModes,
                endianness,
                highlightInfo: __classPrivateFieldGet(this, _LinearMemoryInspectorView_instances, "m", _LinearMemoryInspectorView_getHighlightInfo).call(this),
                hideValueInspector: __classPrivateFieldGet(this, _LinearMemoryInspectorView_hideValueInspector, "f"),
            };
        });
    }
}
_LinearMemoryInspectorView_memoryWrapper = new WeakMap(), _LinearMemoryInspectorView_address = new WeakMap(), _LinearMemoryInspectorView_tabId = new WeakMap(), _LinearMemoryInspectorView_inspector = new WeakMap(), _LinearMemoryInspectorView_hideValueInspector = new WeakMap(), _LinearMemoryInspectorView_instances = new WeakSet(), _LinearMemoryInspectorView_memoryRequested = function _LinearMemoryInspectorView_memoryRequested(event) {
    const { start, end, address } = event.data;
    if (address < start || address >= end) {
        throw new Error('Requested address is out of bounds.');
    }
    void LinearMemoryInspectorController.getMemoryRange(__classPrivateFieldGet(this, _LinearMemoryInspectorView_memoryWrapper, "f"), start, end).then(memory => {
        __classPrivateFieldGet(this, _LinearMemoryInspectorView_inspector, "f").data = {
            memory,
            address,
            memoryOffset: start,
            outerMemoryLength: __classPrivateFieldGet(this, _LinearMemoryInspectorView_memoryWrapper, "f").length(),
            highlightInfo: __classPrivateFieldGet(this, _LinearMemoryInspectorView_instances, "m", _LinearMemoryInspectorView_getHighlightInfo).call(this),
            hideValueInspector: __classPrivateFieldGet(this, _LinearMemoryInspectorView_hideValueInspector, "f"),
        };
    });
}, _LinearMemoryInspectorView_getHighlightInfo = function _LinearMemoryInspectorView_getHighlightInfo() {
    const highlightInfo = LinearMemoryInspectorController.instance().getHighlightInfo(__classPrivateFieldGet(this, _LinearMemoryInspectorView_tabId, "f"));
    if (highlightInfo !== undefined) {
        if (highlightInfo.startAddress < 0 || highlightInfo.startAddress >= __classPrivateFieldGet(this, _LinearMemoryInspectorView_memoryWrapper, "f").length()) {
            throw new Error('HighlightInfo start address is out of bounds.');
        }
        if (highlightInfo.size <= 0) {
            throw new Error('Highlight size must be a positive number.');
        }
    }
    return highlightInfo;
};
//# sourceMappingURL=LinearMemoryInspectorPane.js.map