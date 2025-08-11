// Copyright (c) 2022 The Chromium Authors. All rights reserved.
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
var _BreakpointsSidebarController_instances, _BreakpointsSidebarController_breakpointManager, _BreakpointsSidebarController_breakpointItemToLocationMap, _BreakpointsSidebarController_breakpointsActiveSetting, _BreakpointsSidebarController_pauseOnUncaughtExceptionSetting, _BreakpointsSidebarController_pauseOnCaughtExceptionSetting, _BreakpointsSidebarController_collapsedFilesSettings, _BreakpointsSidebarController_collapsedFiles, _BreakpointsSidebarController_outstandingBreakpointEdited, _BreakpointsSidebarController_updateScheduled, _BreakpointsSidebarController_updateRunning, _BreakpointsSidebarController_onBreakpointAdded, _BreakpointsSidebarController_onBreakpointRemoved, _BreakpointsSidebarController_saveSettings, _BreakpointsSidebarController_getBreakpointTypeAndDetails, _BreakpointsSidebarController_getLocationsForBreakpointItem, _BreakpointsSidebarController_getHitUILocation, _BreakpointsSidebarController_getBreakpointLocations, _BreakpointsSidebarController_groupBreakpointLocationsById, _BreakpointsSidebarController_getLocationIdsByLineId, _BreakpointsSidebarController_getBreakpointState, _BreakpointsSidebarController_getContent, _BreakpointsView_instances, _BreakpointsView_view, _BreakpointsView_controller, _BreakpointsView_pauseOnUncaughtExceptions, _BreakpointsView_pauseOnCaughtExceptions, _BreakpointsView_breakpointsActive, _BreakpointsView_breakpointGroups, _BreakpointsView_urlToDifferentiatingPath, _BreakpointsView_breakpointItemDetails, _BreakpointsView_clickHandler, _BreakpointsView_groupContextMenuHandler, _BreakpointsView_groupToggleHandler, _BreakpointsView_groupClickHandler, _BreakpointsView_groupCheckboxToggled, _BreakpointsView_removeAllBreakpointsInFileClickHandler, _BreakpointsView_itemContextMenuHandler, _BreakpointsView_itemClickHandler, _BreakpointsView_itemSnippetClickHandler, _BreakpointsView_itemEditClickHandler, _BreakpointsView_itemRemoveClickHandler, _BreakpointsView_keyDownHandler, _BreakpointsView_setSelected, _BreakpointsView_handleArrowKey, _BreakpointsView_handleHomeOrEndKey, _BreakpointsView_onBreakpointGroupContextMenu, _BreakpointsView_onBreakpointEntryContextMenu, _BreakpointsView_getCodeSnippetTooltip, _BreakpointsView_getBreakpointItemDescription, _BreakpointsView_onCheckboxToggled, _BreakpointsView_onPauseOnCaughtExceptionsStateChanged, _BreakpointsView_onPauseOnUncaughtExceptionsStateChanged;
import '../../ui/components/icon_button/icon_button.js';
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import { assertNotNullOrUndefined } from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Bindings from '../../models/bindings/bindings.js';
import * as Breakpoints from '../../models/breakpoints/breakpoints.js';
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Workspace from '../../models/workspace/workspace.js';
import * as Input from '../../ui/components/input/input.js';
import * as RenderCoordinator from '../../ui/components/render_coordinator/render_coordinator.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import breakpointsViewStyles from './breakpointsView.css.js';
import { findNextNodeForKeyboardNavigation, getDifferentiatingPathMap } from './BreakpointsViewUtils.js';
const { html, render, Directives: { ifDefined, repeat, classMap, live } } = Lit;
const UIStrings = {
    /**
     *@description Label for a checkbox to toggle pausing on uncaught exceptions in the breakpoint sidebar of the Sources panel. When the checkbox is checked, DevTools will pause if an uncaught exception is thrown at runtime.
     */
    pauseOnUncaughtExceptions: 'Pause on uncaught exceptions',
    /**
     *@description Label for a checkbox to toggling pausing on caught exceptions in the breakpoint sidebar of the Sources panel. When the checkbox is checked, DevTools will pause if an exception is thrown, but caught (handled) at runtime.
     */
    pauseOnCaughtExceptions: 'Pause on caught exceptions',
    /**
     *@description Text exposed to screen readers on checked items.
     */
    checked: 'checked',
    /**
     *@description Accessible text exposed to screen readers when the screen reader encounters an unchecked checkbox.
     */
    unchecked: 'unchecked',
    /**
     *@description Accessible text for a breakpoint collection with a combination of checked states.
     */
    indeterminate: 'mixed',
    /**
     *@description Accessibility label for hit breakpoints in the Sources panel.
     *@example {checked} PH1
     */
    breakpointHit: '{PH1} breakpoint hit',
    /**
     *@description Tooltip text that shows when hovered over a remove button that appears next to a filename in the breakpoint sidebar of the sources panel. Also used in the context menu for breakpoint groups.
     */
    removeAllBreakpointsInFile: 'Remove all breakpoints in file',
    /**
     *@description Context menu item in the Breakpoints Sidebar Pane of the Sources panel that disables all breakpoints in a file.
     */
    disableAllBreakpointsInFile: 'Disable all breakpoints in file',
    /**
     *@description Context menu item in the Breakpoints Sidebar Pane of the Sources panel that enables all breakpoints in a file.
     */
    enableAllBreakpointsInFile: 'Enable all breakpoints in file',
    /**
     *@description Tooltip text that shows when hovered over an edit button that appears next to a breakpoint or conditional breakpoint in the breakpoint sidebar of the sources panel.
     */
    editCondition: 'Edit condition',
    /**
     *@description Tooltip text that shows when hovered over an edit button that appears next to a logpoint in the breakpoint sidebar of the sources panel.
     */
    editLogpoint: 'Edit logpoint',
    /**
     *@description Context menu item in the Breakpoints Sidebar Pane of the Sources panel that disables all breakpoints.
     */
    disableAllBreakpoints: 'Disable all breakpoints',
    /**
     *@description Context menu item in the Breakpoints Sidebar Pane of the Sources panel that enables all breakpoints.
     */
    enableAllBreakpoints: 'Enable all breakpoints',
    /**
     *@description Tooltip text that shows when hovered over a remove button that appears next to a breakpoint in the breakpoint sidebar of the sources panel. Also used in the context menu for breakpoint items.
     */
    removeBreakpoint: 'Remove breakpoint',
    /**
     *@description Text to remove all breakpoints
     */
    removeAllBreakpoints: 'Remove all breakpoints',
    /**
     *@description Text in Breakpoints Sidebar Pane of the Sources panel
     */
    removeOtherBreakpoints: 'Remove other breakpoints',
    /**
     *@description Context menu item that reveals the source code location of a breakpoint in the Sources panel.
     */
    revealLocation: 'Reveal location',
    /**
     *@description Tooltip text that shows when hovered over a piece of code of a breakpoint in the breakpoint sidebar of the sources panel. It shows the condition, on which the breakpoint will stop.
     *@example {x < 3} PH1
     */
    conditionCode: 'Condition: {PH1}',
    /**
     *@description Tooltip text that shows when hovered over a piece of code of a breakpoint in the breakpoint sidebar of the sources panel. It shows what is going to be printed in the console, if execution hits this breakpoint.
     *@example {'hello'} PH1
     */
    logpointCode: 'Logpoint: {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('panels/sources/BreakpointsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const MAX_SNIPPET_LENGTH = 200;
export var BreakpointStatus;
(function (BreakpointStatus) {
    BreakpointStatus["ENABLED"] = "ENABLED";
    BreakpointStatus["DISABLED"] = "DISABLED";
    BreakpointStatus["INDETERMINATE"] = "INDETERMINATE";
})(BreakpointStatus || (BreakpointStatus = {}));
let breakpointsViewInstance = null;
let breakpointsViewControllerInstance;
export class BreakpointsSidebarController {
    constructor(breakpointManager, settings) {
        _BreakpointsSidebarController_instances.add(this);
        _BreakpointsSidebarController_breakpointManager.set(this, void 0);
        _BreakpointsSidebarController_breakpointItemToLocationMap.set(this, new WeakMap());
        _BreakpointsSidebarController_breakpointsActiveSetting.set(this, void 0);
        _BreakpointsSidebarController_pauseOnUncaughtExceptionSetting.set(this, void 0);
        _BreakpointsSidebarController_pauseOnCaughtExceptionSetting.set(this, void 0);
        _BreakpointsSidebarController_collapsedFilesSettings.set(this, void 0);
        _BreakpointsSidebarController_collapsedFiles.set(this, void 0);
        // This is used to keep track of outstanding edits to breakpoints that were initiated
        // by the breakpoint edit button (for UMA).
        _BreakpointsSidebarController_outstandingBreakpointEdited.set(this, void 0);
        _BreakpointsSidebarController_updateScheduled.set(this, false);
        _BreakpointsSidebarController_updateRunning.set(this, false);
        __classPrivateFieldSet(this, _BreakpointsSidebarController_collapsedFilesSettings, Common.Settings.Settings.instance().createSetting('collapsed-files', []), "f");
        __classPrivateFieldSet(this, _BreakpointsSidebarController_collapsedFiles, new Set(__classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFilesSettings, "f").get()), "f");
        __classPrivateFieldSet(this, _BreakpointsSidebarController_breakpointManager, breakpointManager, "f");
        __classPrivateFieldGet(this, _BreakpointsSidebarController_breakpointManager, "f").addEventListener(Breakpoints.BreakpointManager.Events.BreakpointAdded, __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_onBreakpointAdded), this);
        __classPrivateFieldGet(this, _BreakpointsSidebarController_breakpointManager, "f").addEventListener(Breakpoints.BreakpointManager.Events.BreakpointRemoved, __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_onBreakpointRemoved), this);
        __classPrivateFieldSet(this, _BreakpointsSidebarController_breakpointsActiveSetting, settings.moduleSetting('breakpoints-active'), "f");
        __classPrivateFieldGet(this, _BreakpointsSidebarController_breakpointsActiveSetting, "f").addChangeListener(this.update, this);
        __classPrivateFieldSet(this, _BreakpointsSidebarController_pauseOnUncaughtExceptionSetting, settings.moduleSetting('pause-on-uncaught-exception'), "f");
        __classPrivateFieldGet(this, _BreakpointsSidebarController_pauseOnUncaughtExceptionSetting, "f").addChangeListener(this.update, this);
        __classPrivateFieldSet(this, _BreakpointsSidebarController_pauseOnCaughtExceptionSetting, settings.moduleSetting('pause-on-caught-exception'), "f");
        __classPrivateFieldGet(this, _BreakpointsSidebarController_pauseOnCaughtExceptionSetting, "f").addChangeListener(this.update, this);
    }
    static instance({ forceNew, breakpointManager, settings } = {
        forceNew: null,
        breakpointManager: Breakpoints.BreakpointManager.BreakpointManager.instance(),
        settings: Common.Settings.Settings.instance(),
    }) {
        if (!breakpointsViewControllerInstance || forceNew) {
            breakpointsViewControllerInstance = new BreakpointsSidebarController(breakpointManager, settings);
        }
        return breakpointsViewControllerInstance;
    }
    static removeInstance() {
        breakpointsViewControllerInstance = null;
    }
    flavorChanged(_object) {
        void this.update();
    }
    breakpointEditFinished(breakpoint, edited) {
        if (__classPrivateFieldGet(this, _BreakpointsSidebarController_outstandingBreakpointEdited, "f") && __classPrivateFieldGet(this, _BreakpointsSidebarController_outstandingBreakpointEdited, "f") === breakpoint) {
            if (edited) {
                Host.userMetrics.actionTaken(Host.UserMetrics.Action.BreakpointConditionEditedFromSidebar);
            }
            __classPrivateFieldSet(this, _BreakpointsSidebarController_outstandingBreakpointEdited, undefined, "f");
        }
    }
    breakpointStateChanged(breakpointItem, checked) {
        const locations = __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_getLocationsForBreakpointItem).call(this, breakpointItem);
        locations.forEach((value) => {
            const breakpoint = value.breakpoint;
            breakpoint.setEnabled(checked);
        });
    }
    async breakpointEdited(breakpointItem, editButtonClicked) {
        const locations = __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_getLocationsForBreakpointItem).call(this, breakpointItem);
        let location;
        for (const locationCandidate of locations) {
            if (!location || locationCandidate.uiLocation.compareTo(location.uiLocation) < 0) {
                location = locationCandidate;
            }
        }
        if (location) {
            if (editButtonClicked) {
                __classPrivateFieldSet(this, _BreakpointsSidebarController_outstandingBreakpointEdited, location.breakpoint, "f");
            }
            await Common.Revealer.reveal(location);
        }
    }
    breakpointsRemoved(breakpointItems) {
        const locations = breakpointItems.flatMap(breakpointItem => __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_getLocationsForBreakpointItem).call(this, breakpointItem));
        locations.forEach(location => location?.breakpoint.remove(false /* keepInStorage */));
    }
    expandedStateChanged(url, expanded) {
        if (expanded) {
            __classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFiles, "f").delete(url);
        }
        else {
            __classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFiles, "f").add(url);
        }
        __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_saveSettings).call(this);
    }
    async jumpToSource(breakpointItem) {
        const uiLocations = __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_getLocationsForBreakpointItem).call(this, breakpointItem).map(location => location.uiLocation);
        let uiLocation;
        for (const uiLocationCandidate of uiLocations) {
            if (!uiLocation || uiLocationCandidate.compareTo(uiLocation) < 0) {
                uiLocation = uiLocationCandidate;
            }
        }
        if (uiLocation) {
            await Common.Revealer.reveal(uiLocation);
        }
    }
    setPauseOnUncaughtExceptions(value) {
        __classPrivateFieldGet(this, _BreakpointsSidebarController_pauseOnUncaughtExceptionSetting, "f").set(value);
    }
    setPauseOnCaughtExceptions(value) {
        __classPrivateFieldGet(this, _BreakpointsSidebarController_pauseOnCaughtExceptionSetting, "f").set(value);
    }
    async update() {
        __classPrivateFieldSet(this, _BreakpointsSidebarController_updateScheduled, true, "f");
        if (__classPrivateFieldGet(this, _BreakpointsSidebarController_updateRunning, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _BreakpointsSidebarController_updateRunning, true, "f");
        while (__classPrivateFieldGet(this, _BreakpointsSidebarController_updateScheduled, "f")) {
            __classPrivateFieldSet(this, _BreakpointsSidebarController_updateScheduled, false, "f");
            const data = await this.getUpdatedBreakpointViewData();
            BreakpointsView.instance().data = data;
        }
        __classPrivateFieldSet(this, _BreakpointsSidebarController_updateRunning, false, "f");
    }
    async getUpdatedBreakpointViewData() {
        const breakpointsActive = __classPrivateFieldGet(this, _BreakpointsSidebarController_breakpointsActiveSetting, "f").get();
        const pauseOnUncaughtExceptions = __classPrivateFieldGet(this, _BreakpointsSidebarController_pauseOnUncaughtExceptionSetting, "f").get();
        const pauseOnCaughtExceptions = __classPrivateFieldGet(this, _BreakpointsSidebarController_pauseOnCaughtExceptionSetting, "f").get();
        const breakpointLocations = __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_getBreakpointLocations).call(this);
        if (!breakpointLocations.length) {
            return {
                breakpointsActive,
                pauseOnCaughtExceptions,
                pauseOnUncaughtExceptions,
                groups: [],
            };
        }
        const locationsGroupedById = __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_groupBreakpointLocationsById).call(this, breakpointLocations);
        const locationIdsByLineId = __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_getLocationIdsByLineId).call(this, breakpointLocations);
        const [content, selectedUILocation] = await Promise.all([
            __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_getContent).call(this, locationsGroupedById),
            __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_getHitUILocation).call(this),
        ]);
        const scriptIdToGroup = new Map();
        for (let idx = 0; idx < locationsGroupedById.length; idx++) {
            const locations = locationsGroupedById[idx];
            const fstLocation = locations[0];
            const sourceURL = fstLocation.uiLocation.uiSourceCode.url();
            const scriptId = fstLocation.uiLocation.uiSourceCode.canonicalScriptId();
            const uiLocation = fstLocation.uiLocation;
            const isHit = selectedUILocation !== null &&
                locations.some(location => location.uiLocation.id() === selectedUILocation.id());
            const numBreakpointsOnLine = locationIdsByLineId.get(uiLocation.lineId()).size;
            const showColumn = numBreakpointsOnLine > 1;
            const locationText = uiLocation.lineAndColumnText(showColumn);
            const contentData = content[idx];
            const codeSnippet = contentData instanceof TextUtils.WasmDisassembly.WasmDisassembly ?
                contentData.lines[contentData.bytecodeOffsetToLineNumber(uiLocation.columnNumber ?? 0)] ?? '' :
                contentData.textObj.lineAt(uiLocation.lineNumber);
            if (isHit && __classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFiles, "f").has(sourceURL)) {
                __classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFiles, "f").delete(sourceURL);
                __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_saveSettings).call(this);
            }
            const expanded = !__classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFiles, "f").has(sourceURL);
            const status = __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_getBreakpointState).call(this, locations);
            const { type, hoverText } = __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_getBreakpointTypeAndDetails).call(this, locations);
            const item = {
                id: fstLocation.breakpoint.breakpointStorageId(),
                location: locationText,
                codeSnippet,
                isHit,
                status,
                type,
                hoverText,
            };
            __classPrivateFieldGet(this, _BreakpointsSidebarController_breakpointItemToLocationMap, "f").set(item, locations);
            let group = scriptIdToGroup.get(scriptId);
            if (group) {
                group.breakpointItems.push(item);
                group.expanded || (group.expanded = expanded);
            }
            else {
                const editable = __classPrivateFieldGet(this, _BreakpointsSidebarController_breakpointManager, "f").supportsConditionalBreakpoints(uiLocation.uiSourceCode);
                group = {
                    url: sourceURL,
                    name: uiLocation.uiSourceCode.displayName(),
                    editable,
                    expanded,
                    breakpointItems: [item],
                };
                scriptIdToGroup.set(scriptId, group);
            }
        }
        return {
            breakpointsActive,
            pauseOnCaughtExceptions,
            pauseOnUncaughtExceptions,
            groups: Array.from(scriptIdToGroup.values()),
        };
    }
}
_BreakpointsSidebarController_breakpointManager = new WeakMap(), _BreakpointsSidebarController_breakpointItemToLocationMap = new WeakMap(), _BreakpointsSidebarController_breakpointsActiveSetting = new WeakMap(), _BreakpointsSidebarController_pauseOnUncaughtExceptionSetting = new WeakMap(), _BreakpointsSidebarController_pauseOnCaughtExceptionSetting = new WeakMap(), _BreakpointsSidebarController_collapsedFilesSettings = new WeakMap(), _BreakpointsSidebarController_collapsedFiles = new WeakMap(), _BreakpointsSidebarController_outstandingBreakpointEdited = new WeakMap(), _BreakpointsSidebarController_updateScheduled = new WeakMap(), _BreakpointsSidebarController_updateRunning = new WeakMap(), _BreakpointsSidebarController_instances = new WeakSet(), _BreakpointsSidebarController_onBreakpointAdded = function _BreakpointsSidebarController_onBreakpointAdded(event) {
    const breakpoint = event.data.breakpoint;
    if (breakpoint.origin === "USER_ACTION" /* Breakpoints.BreakpointManager.BreakpointOrigin.USER_ACTION */ &&
        __classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFiles, "f").has(breakpoint.url())) {
        // Auto-expand if a new breakpoint was added to a collapsed group.
        __classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFiles, "f").delete(breakpoint.url());
        __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_saveSettings).call(this);
    }
    return this.update();
}, _BreakpointsSidebarController_onBreakpointRemoved = function _BreakpointsSidebarController_onBreakpointRemoved(event) {
    const breakpoint = event.data.breakpoint;
    if (__classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFiles, "f").has(breakpoint.url())) {
        const locations = Breakpoints.BreakpointManager.BreakpointManager.instance().allBreakpointLocations();
        const otherBreakpointsOnSameFileExist = locations.some(location => location.breakpoint.url() === breakpoint.url());
        if (!otherBreakpointsOnSameFileExist) {
            // Clear up the #collapsedFiles set from this url if no breakpoint is left in this group.
            __classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFiles, "f").delete(breakpoint.url());
            __classPrivateFieldGet(this, _BreakpointsSidebarController_instances, "m", _BreakpointsSidebarController_saveSettings).call(this);
        }
    }
    return this.update();
}, _BreakpointsSidebarController_saveSettings = function _BreakpointsSidebarController_saveSettings() {
    __classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFilesSettings, "f").set(Array.from(__classPrivateFieldGet(this, _BreakpointsSidebarController_collapsedFiles, "f").values()));
}, _BreakpointsSidebarController_getBreakpointTypeAndDetails = function _BreakpointsSidebarController_getBreakpointTypeAndDetails(locations) {
    const breakpointWithCondition = locations.find(location => Boolean(location.breakpoint.condition()));
    const breakpoint = breakpointWithCondition?.breakpoint;
    if (!breakpoint || !breakpoint.condition()) {
        return { type: "REGULAR_BREAKPOINT" /* SDK.DebuggerModel.BreakpointType.REGULAR_BREAKPOINT */ };
    }
    const condition = breakpoint.condition();
    if (breakpoint.isLogpoint()) {
        return { type: "LOGPOINT" /* SDK.DebuggerModel.BreakpointType.LOGPOINT */, hoverText: condition };
    }
    return { type: "CONDITIONAL_BREAKPOINT" /* SDK.DebuggerModel.BreakpointType.CONDITIONAL_BREAKPOINT */, hoverText: condition };
}, _BreakpointsSidebarController_getLocationsForBreakpointItem = function _BreakpointsSidebarController_getLocationsForBreakpointItem(breakpointItem) {
    const locations = __classPrivateFieldGet(this, _BreakpointsSidebarController_breakpointItemToLocationMap, "f").get(breakpointItem);
    assertNotNullOrUndefined(locations);
    return locations;
}, _BreakpointsSidebarController_getHitUILocation = async function _BreakpointsSidebarController_getHitUILocation() {
    const details = UI.Context.Context.instance().flavor(SDK.DebuggerModel.DebuggerPausedDetails);
    if (details?.callFrames.length) {
        return await Bindings.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().rawLocationToUILocation(details.callFrames[0].location());
    }
    return null;
}, _BreakpointsSidebarController_getBreakpointLocations = function _BreakpointsSidebarController_getBreakpointLocations() {
    const locations = __classPrivateFieldGet(this, _BreakpointsSidebarController_breakpointManager, "f").allBreakpointLocations().filter(breakpointLocation => breakpointLocation.uiLocation.uiSourceCode.project().type() !== Workspace.Workspace.projectTypes.Debugger);
    locations.sort((item1, item2) => item1.uiLocation.compareTo(item2.uiLocation));
    const result = [];
    let lastBreakpoint = null;
    let lastLocation = null;
    for (const location of locations) {
        if (location.breakpoint !== lastBreakpoint || (lastLocation && location.uiLocation.compareTo(lastLocation))) {
            result.push(location);
            lastBreakpoint = location.breakpoint;
            lastLocation = location.uiLocation;
        }
    }
    return result;
}, _BreakpointsSidebarController_groupBreakpointLocationsById = function _BreakpointsSidebarController_groupBreakpointLocationsById(breakpointLocations) {
    const map = new Platform.MapUtilities.Multimap();
    for (const breakpointLocation of breakpointLocations) {
        const uiLocation = breakpointLocation.uiLocation;
        map.set(uiLocation.id(), breakpointLocation);
    }
    const arr = [];
    for (const id of map.keysArray()) {
        const locations = Array.from(map.get(id));
        if (locations.length) {
            arr.push(locations);
        }
    }
    return arr;
}, _BreakpointsSidebarController_getLocationIdsByLineId = function _BreakpointsSidebarController_getLocationIdsByLineId(breakpointLocations) {
    const result = new Platform.MapUtilities.Multimap();
    for (const breakpointLocation of breakpointLocations) {
        const uiLocation = breakpointLocation.uiLocation;
        result.set(uiLocation.lineId(), uiLocation.id());
    }
    return result;
}, _BreakpointsSidebarController_getBreakpointState = function _BreakpointsSidebarController_getBreakpointState(locations) {
    const hasEnabled = locations.some(location => location.breakpoint.enabled());
    const hasDisabled = locations.some(location => !location.breakpoint.enabled());
    let status;
    if (hasEnabled) {
        status = hasDisabled ? "INDETERMINATE" /* BreakpointStatus.INDETERMINATE */ : "ENABLED" /* BreakpointStatus.ENABLED */;
    }
    else {
        status = "DISABLED" /* BreakpointStatus.DISABLED */;
    }
    return status;
}, _BreakpointsSidebarController_getContent = function _BreakpointsSidebarController_getContent(locations) {
    return Promise.all(locations.map(async ([{ uiLocation: { uiSourceCode } }]) => {
        const contentData = await uiSourceCode.requestContentData({ cachedWasmOnly: true });
        return TextUtils.ContentData.ContentData.contentDataOrEmpty(contentData);
    }));
};
export const DEFAULT_VIEW = (input, _output, target) => {
    // clang-format off
    render(html `
    <style>${Input.checkboxStyles}</style>
    <style>${breakpointsViewStyles}</style>
    <div jslog=${VisualLogging.section('sources.js-breakpoints')} id="devtools-breakpoint-view">
      <div class='pause-on-uncaught-exceptions'
          tabindex='0'
          @click=${input.clickHandler}
          @keydown=${input.keyDownHandler}
          role='checkbox'
          aria-checked=${input.pauseOnUncaughtExceptions}
          data-first-pause>
        <label class='checkbox-label'>
          <input type='checkbox' tabindex=-1 class="small" ?checked=${input.pauseOnUncaughtExceptions} @change=${input.onPauseOnUncaughtExceptionsStateChanged} jslog=${VisualLogging.toggle('pause-uncaught').track({ change: true })}>
          <span>${i18nString(UIStrings.pauseOnUncaughtExceptions)}</span>
        </label>
      </div>
      <div class='pause-on-caught-exceptions'
            tabindex='-1'
            @click=${input.clickHandler}
            @keydown=${input.keyDownHandler}
            role='checkbox'
            aria-checked=${input.pauseOnCaughtExceptions}
            data-last-pause>
          <label class='checkbox-label'>
            <input data-pause-on-caught-checkbox type='checkbox' class="small" tabindex=-1 ?checked=${input.pauseOnCaughtExceptions} @change=${input.onPauseOnCaughtExceptionsStateChanged.bind(this)} jslog=${VisualLogging.toggle('pause-on-caught-exception').track({ change: true })}>
            <span>${i18nString(UIStrings.pauseOnCaughtExceptions)}</span>
          </label>
      </div>
      <div role=tree>
        ${repeat(input.breakpointGroups, group => group.url, (group, groupIndex) => html `
            <details class=${classMap({ active: input.breakpointsActive })}
                  ?data-first-group=${groupIndex === 0}
                  ?data-last-group=${groupIndex === input.breakpointGroups.length - 1}
                  role=group
                  aria-label='${group.name}'
                  aria-description='${group.url}'
                  ?open=${live(group.expanded)}
                  @toggle=${input.groupToggleHandler.bind(undefined, group)}>
              <summary @contextmenu=${input.groupContextMenuHandler.bind(undefined, group)}
                      tabindex='-1'
                      @keydown=${input.keyDownHandler}
                      @click=${input.clickHandler}>
                <span class='group-header' aria-hidden=true>
                  <span class='group-icon-or-disable'>
                    <devtools-icon name="file-script"></devtools-icon>
                    <input class='group-checkbox small' type='checkbox'
                          aria-label=''
                          .checked=${group.breakpointItems.some(item => item.status === "ENABLED" /* BreakpointStatus.ENABLED */)}
                          @change=${input.groupCheckboxToggled.bind(undefined, group)}
                          tabindex=-1
                          jslog=${VisualLogging.toggle('breakpoint-group').track({ change: true, })}></input>
                  </span>
                  <span class='group-header-title' title='${group.url}'>
                    ${group.name}
                    <span class='group-header-differentiator'>
                      ${input.urlToDifferentiatingPath.get(group.url)}
                    </span>
                  </span>
                </span>
                <span class='group-hover-actions'>
                  <button data-remove-breakpoint
                          @click=${input.removeAllBreakpointsInFileClickHandler.bind(undefined, group.breakpointItems)}
                          title=${i18nString(UIStrings.removeAllBreakpointsInFile)}
                          aria-label=${i18nString(UIStrings.removeAllBreakpointsInFile)}
                          jslog=${VisualLogging.action('remove-breakpoint').track({ click: true })}>
                    <devtools-icon name="bin"></devtools-icon>
                  </button>
                </span>
              </summary>
            ${repeat(group.breakpointItems, item => item.id, (item, itemIndex) => html `
                <div class=${classMap({
        'breakpoint-item': true,
        hit: item.isHit,
        'conditional-breakpoint': item.type === "CONDITIONAL_BREAKPOINT" /* SDK.DebuggerModel.BreakpointType.CONDITIONAL_BREAKPOINT */,
        logpoint: item.type === "LOGPOINT" /* SDK.DebuggerModel.BreakpointType.LOGPOINT */,
    })}
                    ?data-first-breakpoint=${itemIndex === 0}
                    ?data-last-breakpoint=${itemIndex === group.breakpointItems.length - 1}
                    aria-label=${ifDefined(input.itemDetails.get(item.id)?.itemDescription)}
                    role=treeitem
                    tabindex='-1'
                    @contextmenu=${input.itemContextMenuHandler.bind(undefined, item, group.editable)}
                    @click=${input.itemClickHandler}
                    @keydown=${input.keyDownHandler}>
                  <label class='checkbox-label'>
                    <span class='type-indicator'></span>
                    <input type='checkbox'
                          aria-label=${item.location}
                          class='small'
                          ?indeterminate=${item.status === "INDETERMINATE" /* BreakpointStatus.INDETERMINATE */}
                          .checked=${item.status === "ENABLED" /* BreakpointStatus.ENABLED */}
                          @change=${input.itemCheckboxToggled.bind(undefined, item)}
                          tabindex=-1
                          jslog=${VisualLogging.toggle('breakpoint').track({ change: true })}>
                  </label>
                  <span class='code-snippet' @click=${input.itemSnippetClickHandler.bind(undefined, item)}
                          title=${ifDefined(input.itemDetails.get(item.id)?.codeSnippetTooltip)}
                          jslog=${VisualLogging.action('sources.jump-to-breakpoint').track({ click: true })}>${input.itemDetails.get(item.id)?.codeSnippet}</span>
                  <span class='breakpoint-item-location-or-actions'>
                    ${group.editable ? html `
                          <button data-edit-breakpoint @click=${input.itemEditClickHandler.bind(undefined, item)}
                                  title=${item.type === "LOGPOINT" /* SDK.DebuggerModel.BreakpointType.LOGPOINT */ ? i18nString(UIStrings.editLogpoint) : i18nString(UIStrings.editCondition)}
                                  jslog=${VisualLogging.action('edit-breakpoint').track({ click: true })}>
                            <devtools-icon name="edit"></devtools-icon>
                          </button>` : Lit.nothing}
                    <button data-remove-breakpoint
                            @click=${input.itemRemoveClickHandler.bind(undefined, item)}
                            title=${i18nString(UIStrings.removeBreakpoint)}
                            aria-label=${i18nString(UIStrings.removeBreakpoint)}
                            jslog=${VisualLogging.action('remove-breakpoint').track({ click: true })}>
                      <devtools-icon name="bin"></devtools-icon>
                    </button>
                    <span class='location'>${item.location}</span>
                  </span>
                </div>`)}
            </details>`)}
      </div>
    </div>`, target, { host: input });
    // clang-format on
};
export class BreakpointsView extends UI.Widget.VBox {
    static instance({ forceNew } = { forceNew: false }) {
        if (!breakpointsViewInstance || forceNew) {
            breakpointsViewInstance = new BreakpointsView(undefined);
        }
        return breakpointsViewInstance;
    }
    constructor(element, view = DEFAULT_VIEW) {
        // TODO(crbug.com/407751705): Scope CSS via naming/nesting and remove the shadow root.
        super(/* useShadowDom */ true, undefined, element);
        _BreakpointsView_instances.add(this);
        _BreakpointsView_view.set(this, void 0);
        _BreakpointsView_controller.set(this, void 0);
        _BreakpointsView_pauseOnUncaughtExceptions.set(this, false);
        _BreakpointsView_pauseOnCaughtExceptions.set(this, false);
        _BreakpointsView_breakpointsActive.set(this, true);
        _BreakpointsView_breakpointGroups.set(this, []);
        _BreakpointsView_urlToDifferentiatingPath.set(this, new Map());
        _BreakpointsView_breakpointItemDetails.set(this, new Map());
        __classPrivateFieldSet(this, _BreakpointsView_view, view, "f");
        __classPrivateFieldSet(this, _BreakpointsView_controller, BreakpointsSidebarController.instance(), "f");
        void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").update();
    }
    set data(data) {
        __classPrivateFieldSet(this, _BreakpointsView_pauseOnUncaughtExceptions, data.pauseOnUncaughtExceptions, "f");
        __classPrivateFieldSet(this, _BreakpointsView_pauseOnCaughtExceptions, data.pauseOnCaughtExceptions, "f");
        __classPrivateFieldSet(this, _BreakpointsView_breakpointsActive, data.breakpointsActive, "f");
        __classPrivateFieldSet(this, _BreakpointsView_breakpointGroups, data.groups, "f");
        __classPrivateFieldSet(this, _BreakpointsView_breakpointItemDetails, new Map(), "f");
        const titleInfos = [];
        for (const group of data.groups) {
            titleInfos.push({ name: group.name, url: group.url });
            for (const item of group.breakpointItems) {
                __classPrivateFieldGet(this, _BreakpointsView_breakpointItemDetails, "f").set(item.id, {
                    itemDescription: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_getBreakpointItemDescription).call(this, item),
                    codeSnippet: Platform.StringUtilities.trimEndWithMaxLength(item.codeSnippet, MAX_SNIPPET_LENGTH),
                    codeSnippetTooltip: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_getCodeSnippetTooltip).call(this, item.type, item.hoverText),
                });
            }
        }
        __classPrivateFieldSet(this, _BreakpointsView_urlToDifferentiatingPath, getDifferentiatingPathMap(titleInfos), "f");
        this.requestUpdate();
    }
    wasShown() {
        this.requestUpdate();
    }
    performUpdate() {
        const input = {
            clickHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_clickHandler).bind(this),
            keyDownHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_keyDownHandler).bind(this),
            pauseOnUncaughtExceptions: __classPrivateFieldGet(this, _BreakpointsView_pauseOnUncaughtExceptions, "f"),
            onPauseOnUncaughtExceptionsStateChanged: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_onPauseOnUncaughtExceptionsStateChanged).bind(this),
            pauseOnCaughtExceptions: __classPrivateFieldGet(this, _BreakpointsView_pauseOnCaughtExceptions, "f"),
            onPauseOnCaughtExceptionsStateChanged: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_onPauseOnCaughtExceptionsStateChanged).bind(this),
            breakpointGroups: __classPrivateFieldGet(this, _BreakpointsView_breakpointGroups, "f"),
            breakpointsActive: __classPrivateFieldGet(this, _BreakpointsView_breakpointsActive, "f"),
            groupContextMenuHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_groupContextMenuHandler).bind(this),
            groupToggleHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_groupToggleHandler).bind(this),
            groupClickHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_groupClickHandler).bind(this),
            groupCheckboxToggled: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_groupCheckboxToggled).bind(this),
            urlToDifferentiatingPath: __classPrivateFieldGet(this, _BreakpointsView_urlToDifferentiatingPath, "f"),
            removeAllBreakpointsInFileClickHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_removeAllBreakpointsInFileClickHandler).bind(this),
            itemDetails: __classPrivateFieldGet(this, _BreakpointsView_breakpointItemDetails, "f"),
            itemContextMenuHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_itemContextMenuHandler).bind(this),
            itemClickHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_itemClickHandler).bind(this),
            itemSnippetClickHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_itemSnippetClickHandler).bind(this),
            itemCheckboxToggled: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_onCheckboxToggled).bind(this),
            itemEditClickHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_itemEditClickHandler).bind(this),
            itemRemoveClickHandler: __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_itemRemoveClickHandler).bind(this),
        };
        __classPrivateFieldGet(this, _BreakpointsView_view, "f").call(this, input, {}, this.contentElement);
        // If no element is tabbable, set the pause-on-exceptions to be tabbable. This can happen
        // if the previously focused element was removed.
        if (this.contentElement.querySelector('[tabindex="0"]') === null) {
            const element = this.contentElement.querySelector('[data-first-pause]');
            element?.setAttribute('tabindex', '0');
        }
    }
}
_BreakpointsView_view = new WeakMap(), _BreakpointsView_controller = new WeakMap(), _BreakpointsView_pauseOnUncaughtExceptions = new WeakMap(), _BreakpointsView_pauseOnCaughtExceptions = new WeakMap(), _BreakpointsView_breakpointsActive = new WeakMap(), _BreakpointsView_breakpointGroups = new WeakMap(), _BreakpointsView_urlToDifferentiatingPath = new WeakMap(), _BreakpointsView_breakpointItemDetails = new WeakMap(), _BreakpointsView_instances = new WeakSet(), _BreakpointsView_clickHandler = async function _BreakpointsView_clickHandler(event) {
    const currentTarget = event.currentTarget;
    await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_setSelected).call(this, currentTarget);
    event.consume();
}, _BreakpointsView_groupContextMenuHandler = function _BreakpointsView_groupContextMenuHandler(group, event) {
    __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_onBreakpointGroupContextMenu).call(this, event, group);
    event.consume();
}, _BreakpointsView_groupToggleHandler = function _BreakpointsView_groupToggleHandler(group, event) {
    const htmlDetails = event.target;
    group.expanded = htmlDetails.open;
    void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").expandedStateChanged(group.url, group.expanded);
}, _BreakpointsView_groupClickHandler = async function _BreakpointsView_groupClickHandler(event) {
    const selected = event.currentTarget;
    await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_setSelected).call(this, selected);
    // Record the metric for expanding/collapsing in the click handler,
    // as we only then get the number of expand/collapse actions that were
    // initiated by the user.
    Host.userMetrics.actionTaken(Host.UserMetrics.Action.BreakpointGroupExpandedStateChanged);
    event.consume();
}, _BreakpointsView_groupCheckboxToggled = function _BreakpointsView_groupCheckboxToggled(group, event) {
    Host.userMetrics.actionTaken(Host.UserMetrics.Action.BreakpointsInFileCheckboxToggled);
    const element = event.target;
    const updatedStatus = element.checked ? "ENABLED" /* BreakpointStatus.ENABLED */ : "DISABLED" /* BreakpointStatus.DISABLED */;
    const itemsToUpdate = group.breakpointItems.filter(item => item.status !== updatedStatus);
    itemsToUpdate.forEach(item => {
        __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointStateChanged(item, element.checked);
    });
    event.consume();
}, _BreakpointsView_removeAllBreakpointsInFileClickHandler = function _BreakpointsView_removeAllBreakpointsInFileClickHandler(items, event) {
    Host.userMetrics.actionTaken(Host.UserMetrics.Action.BreakpointsInFileRemovedFromRemoveButton);
    void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointsRemoved(items);
    event.consume();
}, _BreakpointsView_itemContextMenuHandler = function _BreakpointsView_itemContextMenuHandler(item, editable, event) {
    __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_onBreakpointEntryContextMenu).call(this, event, item, editable);
    event.consume();
}, _BreakpointsView_itemClickHandler = async function _BreakpointsView_itemClickHandler(event) {
    const target = event.currentTarget;
    await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_setSelected).call(this, target);
    event.consume();
}, _BreakpointsView_itemSnippetClickHandler = function _BreakpointsView_itemSnippetClickHandler(item, event) {
    void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").jumpToSource(item);
    event.consume();
}, _BreakpointsView_itemEditClickHandler = function _BreakpointsView_itemEditClickHandler(item, event) {
    void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointEdited(item, true /* editButtonClicked */);
    event.consume();
}, _BreakpointsView_itemRemoveClickHandler = function _BreakpointsView_itemRemoveClickHandler(item, event) {
    Host.userMetrics.actionTaken(Host.UserMetrics.Action.BreakpointRemovedFromRemoveButton);
    void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointsRemoved([item]);
    event.consume();
}, _BreakpointsView_keyDownHandler = async function _BreakpointsView_keyDownHandler(event) {
    if (!event.target || !(event.target instanceof HTMLElement)) {
        return;
    }
    if (event.key === 'Home' || event.key === 'End') {
        event.consume(true);
        return await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_handleHomeOrEndKey).call(this, event.key);
    }
    if (Platform.KeyboardUtilities.keyIsArrowKey(event.key)) {
        event.consume(true);
        return await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_handleArrowKey).call(this, event.key, event.target);
    }
    if (Platform.KeyboardUtilities.isEnterOrSpaceKey(event)) {
        const currentTarget = event.currentTarget;
        await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_setSelected).call(this, currentTarget);
        const input = currentTarget.querySelector('input');
        if (input) {
            input.click();
        }
        event.consume();
    }
    return;
}, _BreakpointsView_setSelected = async function _BreakpointsView_setSelected(element) {
    if (!element) {
        return;
    }
    void RenderCoordinator.write('BreakpointsView focus on selected element', () => {
        const prevSelected = this.contentElement.querySelector('[tabindex="0"]');
        prevSelected?.setAttribute('tabindex', '-1');
        element.setAttribute('tabindex', '0');
        element.focus();
    });
}, _BreakpointsView_handleArrowKey = async function _BreakpointsView_handleArrowKey(key, target) {
    const setGroupExpandedState = (detailsElement, expanded) => {
        if (expanded) {
            return RenderCoordinator.write('BreakpointsView expand', () => {
                detailsElement.setAttribute('open', '');
            });
        }
        return RenderCoordinator.write('BreakpointsView expand', () => {
            detailsElement.removeAttribute('open');
        });
    };
    const nextNode = await findNextNodeForKeyboardNavigation(target, key, setGroupExpandedState);
    return await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_setSelected).call(this, nextNode);
}, _BreakpointsView_handleHomeOrEndKey = async function _BreakpointsView_handleHomeOrEndKey(key) {
    if (key === 'Home') {
        const pauseOnExceptionsNode = this.contentElement.querySelector('[data-first-pause]');
        return await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_setSelected).call(this, pauseOnExceptionsNode);
    }
    if (key === 'End') {
        const numGroups = __classPrivateFieldGet(this, _BreakpointsView_breakpointGroups, "f").length;
        if (numGroups === 0) {
            const lastPauseOnExceptionsNode = this.contentElement.querySelector('[data-last-pause]');
            return await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_setSelected).call(this, lastPauseOnExceptionsNode);
        }
        const lastGroupIndex = numGroups - 1;
        const lastGroup = __classPrivateFieldGet(this, _BreakpointsView_breakpointGroups, "f")[lastGroupIndex];
        if (lastGroup.expanded) {
            const lastBreakpointItem = this.contentElement.querySelector('[data-last-group] > [data-last-breakpoint]');
            return await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_setSelected).call(this, lastBreakpointItem);
        }
        const lastGroupSummaryElement = this.contentElement.querySelector('[data-last-group] > summary');
        return await __classPrivateFieldGet(this, _BreakpointsView_instances, "m", _BreakpointsView_setSelected).call(this, lastGroupSummaryElement);
    }
}, _BreakpointsView_onBreakpointGroupContextMenu = function _BreakpointsView_onBreakpointGroupContextMenu(event, breakpointGroup) {
    const { breakpointItems } = breakpointGroup;
    const menu = new UI.ContextMenu.ContextMenu(event);
    menu.defaultSection().appendItem(i18nString(UIStrings.removeAllBreakpointsInFile), () => {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.BreakpointsInFileRemovedFromContextMenu);
        void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointsRemoved(breakpointItems);
    }, { jslogContext: 'remove-file-breakpoints' });
    const otherGroups = __classPrivateFieldGet(this, _BreakpointsView_breakpointGroups, "f").filter(group => group !== breakpointGroup);
    menu.defaultSection().appendItem(i18nString(UIStrings.removeOtherBreakpoints), () => {
        const breakpointItems = otherGroups.map(({ breakpointItems }) => breakpointItems).flat();
        void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointsRemoved(breakpointItems);
    }, { disabled: otherGroups.length === 0, jslogContext: 'remove-other-breakpoints' });
    menu.defaultSection().appendItem(i18nString(UIStrings.removeAllBreakpoints), () => {
        const breakpointItems = __classPrivateFieldGet(this, _BreakpointsView_breakpointGroups, "f").map(({ breakpointItems }) => breakpointItems).flat();
        void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointsRemoved(breakpointItems);
    }, { jslogContext: 'remove-all-breakpoints' });
    const notEnabledItems = breakpointItems.filter(breakpointItem => breakpointItem.status !== "ENABLED" /* BreakpointStatus.ENABLED */);
    menu.debugSection().appendItem(i18nString(UIStrings.enableAllBreakpointsInFile), () => {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.BreakpointsInFileEnabledDisabledFromContextMenu);
        for (const breakpointItem of notEnabledItems) {
            __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointStateChanged(breakpointItem, true);
        }
    }, { disabled: notEnabledItems.length === 0, jslogContext: 'enable-file-breakpoints' });
    const notDisabledItems = breakpointItems.filter(breakpointItem => breakpointItem.status !== "DISABLED" /* BreakpointStatus.DISABLED */);
    menu.debugSection().appendItem(i18nString(UIStrings.disableAllBreakpointsInFile), () => {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.BreakpointsInFileEnabledDisabledFromContextMenu);
        for (const breakpointItem of notDisabledItems) {
            __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointStateChanged(breakpointItem, false);
        }
    }, { disabled: notDisabledItems.length === 0, jslogContext: 'disable-file-breakpoints' });
    void menu.show();
}, _BreakpointsView_onBreakpointEntryContextMenu = function _BreakpointsView_onBreakpointEntryContextMenu(event, breakpointItem, editable) {
    const items = __classPrivateFieldGet(this, _BreakpointsView_breakpointGroups, "f").map(({ breakpointItems }) => breakpointItems).flat();
    const otherItems = items.filter(item => item !== breakpointItem);
    const menu = new UI.ContextMenu.ContextMenu(event);
    const editBreakpointText = breakpointItem.type === "LOGPOINT" /* SDK.DebuggerModel.BreakpointType.LOGPOINT */ ?
        i18nString(UIStrings.editLogpoint) :
        i18nString(UIStrings.editCondition);
    menu.revealSection().appendItem(i18nString(UIStrings.revealLocation), () => {
        void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").jumpToSource(breakpointItem);
    }, { jslogContext: 'jump-to-breakpoint' });
    menu.editSection().appendItem(editBreakpointText, () => {
        void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointEdited(breakpointItem, false /* editButtonClicked */);
    }, { disabled: !editable, jslogContext: 'edit-breakpoint' });
    menu.defaultSection().appendItem(i18nString(UIStrings.enableAllBreakpoints), items.forEach.bind(items, item => __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointStateChanged(item, true)), {
        disabled: items.every(item => item.status === "ENABLED" /* BreakpointStatus.ENABLED */),
        jslogContext: 'enable-all-breakpoints',
    });
    menu.defaultSection().appendItem(i18nString(UIStrings.disableAllBreakpoints), items.forEach.bind(items, item => __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointStateChanged(item, false)), {
        disabled: items.every(item => item.status === "DISABLED" /* BreakpointStatus.DISABLED */),
        jslogContext: 'disable-all-breakpoints',
    });
    menu.footerSection().appendItem(i18nString(UIStrings.removeBreakpoint), () => {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.BreakpointRemovedFromContextMenu);
        void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointsRemoved([breakpointItem]);
    }, { jslogContext: 'remove-breakpoint' });
    menu.footerSection().appendItem(i18nString(UIStrings.removeOtherBreakpoints), () => {
        void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointsRemoved(otherItems);
    }, { disabled: otherItems.length === 0, jslogContext: 'remove-other-breakpoints' });
    menu.footerSection().appendItem(i18nString(UIStrings.removeAllBreakpoints), () => {
        const breakpointItems = __classPrivateFieldGet(this, _BreakpointsView_breakpointGroups, "f").map(({ breakpointItems }) => breakpointItems).flat();
        void __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointsRemoved(breakpointItems);
    }, { jslogContext: 'remove-all-breakpoints' });
    void menu.show();
}, _BreakpointsView_getCodeSnippetTooltip = function _BreakpointsView_getCodeSnippetTooltip(type, hoverText) {
    switch (type) {
        case "REGULAR_BREAKPOINT" /* SDK.DebuggerModel.BreakpointType.REGULAR_BREAKPOINT */:
            return undefined;
        case "CONDITIONAL_BREAKPOINT" /* SDK.DebuggerModel.BreakpointType.CONDITIONAL_BREAKPOINT */:
            assertNotNullOrUndefined(hoverText);
            return i18nString(UIStrings.conditionCode, { PH1: hoverText });
        case "LOGPOINT" /* SDK.DebuggerModel.BreakpointType.LOGPOINT */:
            assertNotNullOrUndefined(hoverText);
            return i18nString(UIStrings.logpointCode, { PH1: hoverText });
    }
}, _BreakpointsView_getBreakpointItemDescription = function _BreakpointsView_getBreakpointItemDescription(breakpointItem) {
    let checkboxDescription;
    switch (breakpointItem.status) {
        case "ENABLED" /* BreakpointStatus.ENABLED */:
            checkboxDescription = i18nString(UIStrings.checked);
            break;
        case "DISABLED" /* BreakpointStatus.DISABLED */:
            checkboxDescription = i18nString(UIStrings.unchecked);
            break;
        case "INDETERMINATE" /* BreakpointStatus.INDETERMINATE */:
            checkboxDescription = i18nString(UIStrings.indeterminate);
            break;
    }
    if (!breakpointItem.isHit) {
        return checkboxDescription;
    }
    return i18nString(UIStrings.breakpointHit, { PH1: checkboxDescription });
}, _BreakpointsView_onCheckboxToggled = function _BreakpointsView_onCheckboxToggled(item, event) {
    const element = event.target;
    __classPrivateFieldGet(this, _BreakpointsView_controller, "f").breakpointStateChanged(item, element.checked);
}, _BreakpointsView_onPauseOnCaughtExceptionsStateChanged = function _BreakpointsView_onPauseOnCaughtExceptionsStateChanged(e) {
    const { checked } = e.target;
    __classPrivateFieldGet(this, _BreakpointsView_controller, "f").setPauseOnCaughtExceptions(checked);
}, _BreakpointsView_onPauseOnUncaughtExceptionsStateChanged = function _BreakpointsView_onPauseOnUncaughtExceptionsStateChanged(e) {
    const { checked } = e.target;
    __classPrivateFieldGet(this, _BreakpointsView_controller, "f").setPauseOnUncaughtExceptions(checked);
};
//# sourceMappingURL=BreakpointsView.js.map