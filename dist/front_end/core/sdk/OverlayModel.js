// Copyright 2017 The Chromium Authors. All rights reserved.
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
var _OverlayModel_domModel, _OverlayModel_debuggerModel, _OverlayModel_inspectModeEnabledInternal, _OverlayModel_hideHighlightTimeout, _OverlayModel_defaultHighlighter, _OverlayModel_highlighter, _OverlayModel_showPaintRectsSetting, _OverlayModel_showLayoutShiftRegionsSetting, _OverlayModel_showAdHighlightsSetting, _OverlayModel_showDebugBordersSetting, _OverlayModel_showFPSCounterSetting, _OverlayModel_showScrollBottleneckRectsSetting, _OverlayModel_registeredListeners, _OverlayModel_showViewportSizeOnResize, _OverlayModel_persistentHighlighter, _OverlayModel_sourceOrderHighlighter, _OverlayModel_sourceOrderModeActiveInternal, _OverlayModel_windowControls, _WindowControls_instances, _a, _WindowControls_cssModel, _WindowControls_originalStylesheetText, _WindowControls_stylesheetId, _WindowControls_currentUrl, _WindowControls_config, _WindowControls_getStyleSheetForPlatform, _WindowControls_fetchCssSourceUrl, _WindowControls_fetchCurrentStyleSheet, _WindowControls_transformStyleSheet, _DefaultHighlighter_model, _SourceOrderHighlighter_model;
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import * as Root from '../root/root.js';
import { DebuggerModel, Events as DebuggerModelEvents } from './DebuggerModel.js';
import { DeferredDOMNode, DOMModel, Events as DOMModelEvents } from './DOMModel.js';
import { OverlayPersistentHighlighter } from './OverlayPersistentHighlighter.js';
import { SDKModel } from './SDKModel.js';
import { TargetManager } from './TargetManager.js';
const UIStrings = {
    /**
     *@description Text in Overlay Model
     */
    pausedInDebugger: 'Paused in debugger',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/OverlayModel.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var EmulatedOSType;
(function (EmulatedOSType) {
    EmulatedOSType["WINDOWS"] = "Windows";
    EmulatedOSType["MAC"] = "Mac";
    EmulatedOSType["LINUX"] = "Linux";
})(EmulatedOSType || (EmulatedOSType = {}));
const platformOverlayDimensions = {
    mac: { x: 85, y: 0, width: 185, height: 40 },
    linux: { x: 0, y: 0, width: 196, height: 34 },
    windows: { x: 0, y: 0, width: 238, height: 33 },
};
export class OverlayModel extends SDKModel {
    constructor(target) {
        super(target);
        _OverlayModel_domModel.set(this, void 0);
        _OverlayModel_debuggerModel.set(this, void 0);
        _OverlayModel_inspectModeEnabledInternal.set(this, false);
        _OverlayModel_hideHighlightTimeout.set(this, null);
        _OverlayModel_defaultHighlighter.set(this, void 0);
        _OverlayModel_highlighter.set(this, void 0);
        _OverlayModel_showPaintRectsSetting.set(this, void 0);
        _OverlayModel_showLayoutShiftRegionsSetting.set(this, void 0);
        _OverlayModel_showAdHighlightsSetting.set(this, void 0);
        _OverlayModel_showDebugBordersSetting.set(this, void 0);
        _OverlayModel_showFPSCounterSetting.set(this, void 0);
        _OverlayModel_showScrollBottleneckRectsSetting.set(this, void 0);
        _OverlayModel_registeredListeners.set(this, []);
        _OverlayModel_showViewportSizeOnResize.set(this, true);
        _OverlayModel_persistentHighlighter.set(this, void 0);
        _OverlayModel_sourceOrderHighlighter.set(this, void 0);
        _OverlayModel_sourceOrderModeActiveInternal.set(this, false);
        _OverlayModel_windowControls.set(this, void 0);
        __classPrivateFieldSet(this, _OverlayModel_domModel, target.model(DOMModel), "f");
        target.registerOverlayDispatcher(this);
        this.overlayAgent = target.overlayAgent();
        __classPrivateFieldSet(this, _OverlayModel_debuggerModel, target.model(DebuggerModel), "f");
        if (__classPrivateFieldGet(this, _OverlayModel_debuggerModel, "f")) {
            Common.Settings.Settings.instance()
                .moduleSetting('disable-paused-state-overlay')
                .addChangeListener(this.updatePausedInDebuggerMessage, this);
            __classPrivateFieldGet(this, _OverlayModel_debuggerModel, "f").addEventListener(DebuggerModelEvents.DebuggerPaused, this.updatePausedInDebuggerMessage, this);
            __classPrivateFieldGet(this, _OverlayModel_debuggerModel, "f").addEventListener(DebuggerModelEvents.DebuggerResumed, this.updatePausedInDebuggerMessage, this);
            // TODO(dgozman): we should get DebuggerResumed on navigations instead of listening to GlobalObjectCleared.
            __classPrivateFieldGet(this, _OverlayModel_debuggerModel, "f").addEventListener(DebuggerModelEvents.GlobalObjectCleared, this.updatePausedInDebuggerMessage, this);
        }
        __classPrivateFieldSet(this, _OverlayModel_defaultHighlighter, new DefaultHighlighter(this), "f");
        __classPrivateFieldSet(this, _OverlayModel_highlighter, __classPrivateFieldGet(this, _OverlayModel_defaultHighlighter, "f"), "f");
        __classPrivateFieldSet(this, _OverlayModel_showPaintRectsSetting, Common.Settings.Settings.instance().moduleSetting('show-paint-rects'), "f");
        __classPrivateFieldSet(this, _OverlayModel_showLayoutShiftRegionsSetting, Common.Settings.Settings.instance().moduleSetting('show-layout-shift-regions'), "f");
        __classPrivateFieldSet(this, _OverlayModel_showAdHighlightsSetting, Common.Settings.Settings.instance().moduleSetting('show-ad-highlights'), "f");
        __classPrivateFieldSet(this, _OverlayModel_showDebugBordersSetting, Common.Settings.Settings.instance().moduleSetting('show-debug-borders'), "f");
        __classPrivateFieldSet(this, _OverlayModel_showFPSCounterSetting, Common.Settings.Settings.instance().moduleSetting('show-fps-counter'), "f");
        __classPrivateFieldSet(this, _OverlayModel_showScrollBottleneckRectsSetting, Common.Settings.Settings.instance().moduleSetting('show-scroll-bottleneck-rects'), "f");
        if (!target.suspended()) {
            void this.overlayAgent.invoke_enable();
            void this.wireAgentToSettings();
        }
        __classPrivateFieldSet(this, _OverlayModel_persistentHighlighter, new OverlayPersistentHighlighter(this, {
            onGridOverlayStateChanged: ({ nodeId, enabled }) => this.dispatchEventToListeners("PersistentGridOverlayStateChanged" /* Events.PERSISTENT_GRID_OVERLAY_STATE_CHANGED */, { nodeId, enabled }),
            onFlexOverlayStateChanged: ({ nodeId, enabled }) => this.dispatchEventToListeners("PersistentFlexContainerOverlayStateChanged" /* Events.PERSISTENT_FLEX_CONTAINER_OVERLAY_STATE_CHANGED */, { nodeId, enabled }),
            onContainerQueryOverlayStateChanged: ({ nodeId, enabled }) => this.dispatchEventToListeners("PersistentContainerQueryOverlayStateChanged" /* Events.PERSISTENT_CONTAINER_QUERY_OVERLAY_STATE_CHANGED */, { nodeId, enabled }),
            onScrollSnapOverlayStateChanged: ({ nodeId, enabled }) => this.dispatchEventToListeners("PersistentScrollSnapOverlayStateChanged" /* Events.PERSISTENT_SCROLL_SNAP_OVERLAY_STATE_CHANGED */, { nodeId, enabled }),
        }), "f");
        __classPrivateFieldGet(this, _OverlayModel_domModel, "f").addEventListener(DOMModelEvents.NodeRemoved, () => {
            if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
                return;
            }
            __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").refreshHighlights();
        });
        __classPrivateFieldGet(this, _OverlayModel_domModel, "f").addEventListener(DOMModelEvents.DocumentUpdated, () => {
            if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
                return;
            }
            // Hide all the overlays initially after document update
            __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").hideAllInOverlayWithoutSave();
            if (!target.suspended()) {
                void __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").restoreHighlightsForDocument();
            }
        });
        __classPrivateFieldSet(this, _OverlayModel_sourceOrderHighlighter, new SourceOrderHighlighter(this), "f");
        __classPrivateFieldSet(this, _OverlayModel_windowControls, new WindowControls(__classPrivateFieldGet(this, _OverlayModel_domModel, "f").cssModel()), "f");
    }
    static highlightObjectAsDOMNode(object) {
        const domModel = object.runtimeModel().target().model(DOMModel);
        if (domModel) {
            domModel.overlayModel().highlightInOverlay({ object, selectorList: undefined });
        }
    }
    static hideDOMNodeHighlight() {
        for (const overlayModel of TargetManager.instance().models(OverlayModel)) {
            overlayModel.delayedHideHighlight(0);
        }
    }
    static async muteHighlight() {
        return await Promise.all(TargetManager.instance().models(OverlayModel).map(model => model.suspendModel()));
    }
    static async unmuteHighlight() {
        return await Promise.all(TargetManager.instance().models(OverlayModel).map(model => model.resumeModel()));
    }
    static highlightRect(rect) {
        for (const overlayModel of TargetManager.instance().models(OverlayModel)) {
            void overlayModel.highlightRect(rect);
        }
    }
    static clearHighlight() {
        for (const overlayModel of TargetManager.instance().models(OverlayModel)) {
            void overlayModel.clearHighlight();
        }
    }
    getDOMModel() {
        return __classPrivateFieldGet(this, _OverlayModel_domModel, "f");
    }
    highlightRect({ x, y, width, height, color, outlineColor }) {
        const highlightColor = color || { r: 255, g: 0, b: 255, a: 0.3 };
        const highlightOutlineColor = outlineColor || { r: 255, g: 0, b: 255, a: 0.5 };
        return this.overlayAgent.invoke_highlightRect({ x, y, width, height, color: highlightColor, outlineColor: highlightOutlineColor });
    }
    clearHighlight() {
        return this.overlayAgent.invoke_hideHighlight();
    }
    async wireAgentToSettings() {
        __classPrivateFieldSet(this, _OverlayModel_registeredListeners, [
            __classPrivateFieldGet(this, _OverlayModel_showPaintRectsSetting, "f").addChangeListener(() => this.overlayAgent.invoke_setShowPaintRects({ result: __classPrivateFieldGet(this, _OverlayModel_showPaintRectsSetting, "f").get() })),
            __classPrivateFieldGet(this, _OverlayModel_showLayoutShiftRegionsSetting, "f").addChangeListener(() => this.overlayAgent.invoke_setShowLayoutShiftRegions({ result: __classPrivateFieldGet(this, _OverlayModel_showLayoutShiftRegionsSetting, "f").get() })),
            __classPrivateFieldGet(this, _OverlayModel_showAdHighlightsSetting, "f").addChangeListener(() => this.overlayAgent.invoke_setShowAdHighlights({ show: __classPrivateFieldGet(this, _OverlayModel_showAdHighlightsSetting, "f").get() })),
            __classPrivateFieldGet(this, _OverlayModel_showDebugBordersSetting, "f").addChangeListener(() => this.overlayAgent.invoke_setShowDebugBorders({ show: __classPrivateFieldGet(this, _OverlayModel_showDebugBordersSetting, "f").get() })),
            __classPrivateFieldGet(this, _OverlayModel_showFPSCounterSetting, "f").addChangeListener(() => this.overlayAgent.invoke_setShowFPSCounter({ show: __classPrivateFieldGet(this, _OverlayModel_showFPSCounterSetting, "f").get() })),
            __classPrivateFieldGet(this, _OverlayModel_showScrollBottleneckRectsSetting, "f").addChangeListener(() => this.overlayAgent.invoke_setShowScrollBottleneckRects({ show: __classPrivateFieldGet(this, _OverlayModel_showScrollBottleneckRectsSetting, "f").get() })),
        ], "f");
        if (__classPrivateFieldGet(this, _OverlayModel_showPaintRectsSetting, "f").get()) {
            void this.overlayAgent.invoke_setShowPaintRects({ result: true });
        }
        if (__classPrivateFieldGet(this, _OverlayModel_showLayoutShiftRegionsSetting, "f").get()) {
            void this.overlayAgent.invoke_setShowLayoutShiftRegions({ result: true });
        }
        if (__classPrivateFieldGet(this, _OverlayModel_showAdHighlightsSetting, "f").get()) {
            void this.overlayAgent.invoke_setShowAdHighlights({ show: true });
        }
        if (__classPrivateFieldGet(this, _OverlayModel_showDebugBordersSetting, "f").get()) {
            void this.overlayAgent.invoke_setShowDebugBorders({ show: true });
        }
        if (__classPrivateFieldGet(this, _OverlayModel_showFPSCounterSetting, "f").get()) {
            void this.overlayAgent.invoke_setShowFPSCounter({ show: true });
        }
        if (__classPrivateFieldGet(this, _OverlayModel_showScrollBottleneckRectsSetting, "f").get()) {
            void this.overlayAgent.invoke_setShowScrollBottleneckRects({ show: true });
        }
        if (__classPrivateFieldGet(this, _OverlayModel_debuggerModel, "f") && __classPrivateFieldGet(this, _OverlayModel_debuggerModel, "f").isPaused()) {
            this.updatePausedInDebuggerMessage();
        }
        await this.overlayAgent.invoke_setShowViewportSizeOnResize({ show: __classPrivateFieldGet(this, _OverlayModel_showViewportSizeOnResize, "f") });
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")?.resetOverlay();
    }
    async suspendModel() {
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _OverlayModel_registeredListeners, "f"));
        await this.overlayAgent.invoke_disable();
    }
    async resumeModel() {
        await Promise.all([this.overlayAgent.invoke_enable(), this.wireAgentToSettings()]);
    }
    setShowViewportSizeOnResize(show) {
        if (__classPrivateFieldGet(this, _OverlayModel_showViewportSizeOnResize, "f") === show) {
            return;
        }
        __classPrivateFieldSet(this, _OverlayModel_showViewportSizeOnResize, show, "f");
        if (this.target().suspended()) {
            return;
        }
        void this.overlayAgent.invoke_setShowViewportSizeOnResize({ show });
    }
    updatePausedInDebuggerMessage() {
        if (this.target().suspended()) {
            return;
        }
        const message = __classPrivateFieldGet(this, _OverlayModel_debuggerModel, "f") && __classPrivateFieldGet(this, _OverlayModel_debuggerModel, "f").isPaused() &&
            !Common.Settings.Settings.instance().moduleSetting('disable-paused-state-overlay').get() ?
            i18nString(UIStrings.pausedInDebugger) :
            undefined;
        void this.overlayAgent.invoke_setPausedInDebuggerMessage({ message });
    }
    setHighlighter(highlighter) {
        __classPrivateFieldSet(this, _OverlayModel_highlighter, highlighter || __classPrivateFieldGet(this, _OverlayModel_defaultHighlighter, "f"), "f");
    }
    async setInspectMode(mode, showDetailedTooltip = true) {
        await __classPrivateFieldGet(this, _OverlayModel_domModel, "f").requestDocument();
        __classPrivateFieldSet(this, _OverlayModel_inspectModeEnabledInternal, mode !== "none" /* Protocol.Overlay.InspectMode.None */, "f");
        this.dispatchEventToListeners("InspectModeWillBeToggled" /* Events.INSPECT_MODE_WILL_BE_TOGGLED */, this);
        void __classPrivateFieldGet(this, _OverlayModel_highlighter, "f").setInspectMode(mode, this.buildHighlightConfig('all', showDetailedTooltip));
    }
    inspectModeEnabled() {
        return __classPrivateFieldGet(this, _OverlayModel_inspectModeEnabledInternal, "f");
    }
    highlightInOverlay(data, mode, showInfo) {
        if (__classPrivateFieldGet(this, _OverlayModel_sourceOrderModeActiveInternal, "f")) {
            // Return early if the source order is currently being shown the in the
            // overlay, so that it is not cleared by the highlight
            return;
        }
        if (__classPrivateFieldGet(this, _OverlayModel_hideHighlightTimeout, "f")) {
            clearTimeout(__classPrivateFieldGet(this, _OverlayModel_hideHighlightTimeout, "f"));
            __classPrivateFieldSet(this, _OverlayModel_hideHighlightTimeout, null, "f");
        }
        const highlightConfig = this.buildHighlightConfig(mode);
        if (typeof showInfo !== 'undefined') {
            highlightConfig.showInfo = showInfo;
        }
        __classPrivateFieldGet(this, _OverlayModel_highlighter, "f").highlightInOverlay(data, highlightConfig);
    }
    highlightInOverlayForTwoSeconds(data) {
        this.highlightInOverlay(data);
        this.delayedHideHighlight(2000);
    }
    highlightGridInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").highlightGridInOverlay(nodeId);
    }
    isHighlightedGridInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return false;
        }
        return __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").isGridHighlighted(nodeId);
    }
    hideGridInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").hideGridInOverlay(nodeId);
    }
    highlightScrollSnapInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").highlightScrollSnapInOverlay(nodeId);
    }
    isHighlightedScrollSnapInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return false;
        }
        return __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").isScrollSnapHighlighted(nodeId);
    }
    hideScrollSnapInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").hideScrollSnapInOverlay(nodeId);
    }
    highlightFlexContainerInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").highlightFlexInOverlay(nodeId);
    }
    isHighlightedFlexContainerInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return false;
        }
        return __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").isFlexHighlighted(nodeId);
    }
    hideFlexContainerInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").hideFlexInOverlay(nodeId);
    }
    highlightContainerQueryInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").highlightContainerQueryInOverlay(nodeId);
    }
    isHighlightedContainerQueryInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return false;
        }
        return __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").isContainerQueryHighlighted(nodeId);
    }
    hideContainerQueryInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").hideContainerQueryInOverlay(nodeId);
    }
    highlightSourceOrderInOverlay(node) {
        const sourceOrderConfig = {
            parentOutlineColor: Common.Color.SourceOrderHighlight.ParentOutline.toProtocolRGBA(),
            childOutlineColor: Common.Color.SourceOrderHighlight.ChildOutline.toProtocolRGBA(),
        };
        __classPrivateFieldGet(this, _OverlayModel_sourceOrderHighlighter, "f").highlightSourceOrderInOverlay(node, sourceOrderConfig);
    }
    colorOfGridInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return null;
        }
        return __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").colorOfGrid(nodeId).asString("hex" /* Common.Color.Format.HEX */);
    }
    setColorOfGridInPersistentOverlay(nodeId, colorStr) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return;
        }
        const color = Common.Color.parse(colorStr);
        if (!color) {
            return;
        }
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").setColorOfGrid(nodeId, color);
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").resetOverlay();
    }
    colorOfFlexInPersistentOverlay(nodeId) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return null;
        }
        return __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").colorOfFlex(nodeId).asString("hex" /* Common.Color.Format.HEX */);
    }
    setColorOfFlexInPersistentOverlay(nodeId, colorStr) {
        if (!__classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f")) {
            return;
        }
        const color = Common.Color.parse(colorStr);
        if (!color) {
            return;
        }
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").setColorOfFlex(nodeId, color);
        __classPrivateFieldGet(this, _OverlayModel_persistentHighlighter, "f").resetOverlay();
    }
    hideSourceOrderInOverlay() {
        __classPrivateFieldGet(this, _OverlayModel_sourceOrderHighlighter, "f").hideSourceOrderHighlight();
    }
    setSourceOrderActive(isActive) {
        __classPrivateFieldSet(this, _OverlayModel_sourceOrderModeActiveInternal, isActive, "f");
    }
    delayedHideHighlight(delay) {
        if (__classPrivateFieldGet(this, _OverlayModel_hideHighlightTimeout, "f") === null) {
            __classPrivateFieldSet(this, _OverlayModel_hideHighlightTimeout, window.setTimeout(() => this.highlightInOverlay({ clear: true }), delay), "f");
        }
    }
    highlightFrame(frameId) {
        if (__classPrivateFieldGet(this, _OverlayModel_hideHighlightTimeout, "f")) {
            clearTimeout(__classPrivateFieldGet(this, _OverlayModel_hideHighlightTimeout, "f"));
            __classPrivateFieldSet(this, _OverlayModel_hideHighlightTimeout, null, "f");
        }
        __classPrivateFieldGet(this, _OverlayModel_highlighter, "f").highlightFrame(frameId);
    }
    showHingeForDualScreen(hinge) {
        if (hinge) {
            const { x, y, width, height, contentColor, outlineColor } = hinge;
            void this.overlayAgent.invoke_setShowHinge({
                hingeConfig: { rect: { x, y, width, height }, contentColor, outlineColor },
            });
        }
        else {
            void this.overlayAgent.invoke_setShowHinge({});
        }
    }
    setWindowControlsPlatform(selectedPlatform) {
        __classPrivateFieldGet(this, _OverlayModel_windowControls, "f").selectedPlatform = selectedPlatform;
    }
    setWindowControlsThemeColor(themeColor) {
        __classPrivateFieldGet(this, _OverlayModel_windowControls, "f").themeColor = themeColor;
    }
    getWindowControlsConfig() {
        return __classPrivateFieldGet(this, _OverlayModel_windowControls, "f").config;
    }
    async toggleWindowControlsToolbar(show) {
        const wcoConfigObj = show ? { windowControlsOverlayConfig: __classPrivateFieldGet(this, _OverlayModel_windowControls, "f").config } : {};
        const setWindowControlsOverlayOperation = this.overlayAgent.invoke_setShowWindowControlsOverlay(wcoConfigObj);
        const toggleStylesheetOperation = __classPrivateFieldGet(this, _OverlayModel_windowControls, "f").toggleEmulatedOverlay(show);
        await Promise.all([setWindowControlsOverlayOperation, toggleStylesheetOperation]);
        this.setShowViewportSizeOnResize(!show);
    }
    buildHighlightConfig(mode = 'all', showDetailedToolip = false) {
        const showRulers = Common.Settings.Settings.instance().moduleSetting('show-metrics-rulers').get();
        const highlightConfig = {
            showInfo: mode === 'all' || mode === 'container-outline',
            showRulers,
            showStyles: showDetailedToolip,
            showAccessibilityInfo: showDetailedToolip,
            showExtensionLines: showRulers,
            gridHighlightConfig: {},
            flexContainerHighlightConfig: {},
            flexItemHighlightConfig: {},
            contrastAlgorithm: Root.Runtime.experiments.isEnabled('apca') ? "apca" /* Protocol.Overlay.ContrastAlgorithm.Apca */ :
                "aa" /* Protocol.Overlay.ContrastAlgorithm.Aa */,
        };
        if (mode === 'all' || mode === 'content') {
            highlightConfig.contentColor = Common.Color.PageHighlight.Content.toProtocolRGBA();
        }
        if (mode === 'all' || mode === 'padding') {
            highlightConfig.paddingColor = Common.Color.PageHighlight.Padding.toProtocolRGBA();
        }
        if (mode === 'all' || mode === 'border') {
            highlightConfig.borderColor = Common.Color.PageHighlight.Border.toProtocolRGBA();
        }
        if (mode === 'all' || mode === 'margin') {
            highlightConfig.marginColor = Common.Color.PageHighlight.Margin.toProtocolRGBA();
        }
        if (mode === 'all') {
            highlightConfig.eventTargetColor = Common.Color.PageHighlight.EventTarget.toProtocolRGBA();
            highlightConfig.shapeColor = Common.Color.PageHighlight.Shape.toProtocolRGBA();
            highlightConfig.shapeMarginColor = Common.Color.PageHighlight.ShapeMargin.toProtocolRGBA();
            highlightConfig.gridHighlightConfig = {
                rowGapColor: Common.Color.PageHighlight.GapBackground.toProtocolRGBA(),
                rowHatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                columnGapColor: Common.Color.PageHighlight.GapBackground.toProtocolRGBA(),
                columnHatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                rowLineColor: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                columnLineColor: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                rowLineDash: true,
                columnLineDash: true,
            };
            highlightConfig.flexContainerHighlightConfig = {
                containerBorder: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
                },
                itemSeparator: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dotted" /* Protocol.Overlay.LineStylePattern.Dotted */,
                },
                lineSeparator: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
                },
                mainDistributedSpace: {
                    hatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                    fillColor: Common.Color.PageHighlight.GapBackground.toProtocolRGBA(),
                },
                crossDistributedSpace: {
                    hatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                    fillColor: Common.Color.PageHighlight.GapBackground.toProtocolRGBA(),
                },
                rowGapSpace: {
                    hatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                    fillColor: Common.Color.PageHighlight.GapBackground.toProtocolRGBA(),
                },
                columnGapSpace: {
                    hatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                    fillColor: Common.Color.PageHighlight.GapBackground.toProtocolRGBA(),
                },
            };
            highlightConfig.flexItemHighlightConfig = {
                baseSizeBox: {
                    hatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                },
                baseSizeBorder: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dotted" /* Protocol.Overlay.LineStylePattern.Dotted */,
                },
                flexibilityArrow: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                },
            };
        }
        if (mode.endsWith('gap')) {
            highlightConfig.gridHighlightConfig = {
                gridBorderColor: Common.Color.PageHighlight.GridBorder.toProtocolRGBA(),
                gridBorderDash: true,
            };
            if (mode === 'gap' || mode === 'row-gap') {
                highlightConfig.gridHighlightConfig.rowGapColor = Common.Color.PageHighlight.GapBackground.toProtocolRGBA();
                highlightConfig.gridHighlightConfig.rowHatchColor = Common.Color.PageHighlight.GapHatch.toProtocolRGBA();
            }
            if (mode === 'gap' || mode === 'column-gap') {
                highlightConfig.gridHighlightConfig.columnGapColor = Common.Color.PageHighlight.GapBackground.toProtocolRGBA();
                highlightConfig.gridHighlightConfig.columnHatchColor = Common.Color.PageHighlight.GapHatch.toProtocolRGBA();
            }
        }
        if (mode.endsWith('gap')) {
            highlightConfig.flexContainerHighlightConfig = {
                containerBorder: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
                },
            };
            if (mode === 'gap' || mode === 'row-gap') {
                highlightConfig.flexContainerHighlightConfig.rowGapSpace = {
                    hatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                    fillColor: Common.Color.PageHighlight.GapBackground.toProtocolRGBA(),
                };
            }
            if (mode === 'gap' || mode === 'column-gap') {
                highlightConfig.flexContainerHighlightConfig.columnGapSpace = {
                    hatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                    fillColor: Common.Color.PageHighlight.GapBackground.toProtocolRGBA(),
                };
            }
        }
        if (mode === 'grid-areas') {
            highlightConfig.gridHighlightConfig = {
                rowLineColor: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                columnLineColor: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                rowLineDash: true,
                columnLineDash: true,
                showAreaNames: true,
                areaBorderColor: Common.Color.PageHighlight.GridAreaBorder.toProtocolRGBA(),
            };
        }
        if (mode === 'grid-template-columns') {
            highlightConfig.contentColor = Common.Color.PageHighlight.Content.toProtocolRGBA();
            highlightConfig.gridHighlightConfig = {
                columnLineColor: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                columnLineDash: true,
            };
        }
        if (mode === 'grid-template-rows') {
            highlightConfig.contentColor = Common.Color.PageHighlight.Content.toProtocolRGBA();
            highlightConfig.gridHighlightConfig = {
                rowLineColor: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                rowLineDash: true,
            };
        }
        if (mode === 'justify-content') {
            highlightConfig.flexContainerHighlightConfig = {
                containerBorder: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
                },
                mainDistributedSpace: {
                    hatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                    fillColor: Common.Color.PageHighlight.GapBackground.toProtocolRGBA(),
                },
            };
        }
        if (mode === 'align-content') {
            highlightConfig.flexContainerHighlightConfig = {
                containerBorder: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
                },
                crossDistributedSpace: {
                    hatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                    fillColor: Common.Color.PageHighlight.GapBackground.toProtocolRGBA(),
                },
            };
        }
        if (mode === 'align-items') {
            highlightConfig.flexContainerHighlightConfig = {
                containerBorder: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
                },
                lineSeparator: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
                },
                crossAlignment: { color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA() },
            };
        }
        if (mode === 'flexibility') {
            highlightConfig.flexItemHighlightConfig = {
                baseSizeBox: {
                    hatchColor: Common.Color.PageHighlight.GapHatch.toProtocolRGBA(),
                },
                baseSizeBorder: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dotted" /* Protocol.Overlay.LineStylePattern.Dotted */,
                },
                flexibilityArrow: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                },
            };
        }
        if (mode === 'container-outline') {
            highlightConfig.containerQueryContainerHighlightConfig = {
                containerBorder: {
                    color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                    pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
                },
            };
        }
        return highlightConfig;
    }
    nodeHighlightRequested({ nodeId }) {
        const node = __classPrivateFieldGet(this, _OverlayModel_domModel, "f").nodeForId(nodeId);
        if (node) {
            this.dispatchEventToListeners("HighlightNodeRequested" /* Events.HIGHLIGHT_NODE_REQUESTED */, node);
        }
    }
    static setInspectNodeHandler(handler) {
        OverlayModel.inspectNodeHandler = handler;
    }
    inspectNodeRequested({ backendNodeId }) {
        const deferredNode = new DeferredDOMNode(this.target(), backendNodeId);
        if (OverlayModel.inspectNodeHandler) {
            void deferredNode.resolvePromise().then(node => {
                if (node && OverlayModel.inspectNodeHandler) {
                    OverlayModel.inspectNodeHandler(node);
                }
            });
        }
        else {
            void Common.Revealer.reveal(deferredNode);
        }
        this.dispatchEventToListeners("InspectModeExited" /* Events.EXITED_INSPECT_MODE */);
    }
    screenshotRequested({ viewport }) {
        this.dispatchEventToListeners("ScreenshotRequested" /* Events.SCREENSHOT_REQUESTED */, viewport);
        this.dispatchEventToListeners("InspectModeExited" /* Events.EXITED_INSPECT_MODE */);
    }
    inspectModeCanceled() {
        this.dispatchEventToListeners("InspectModeExited" /* Events.EXITED_INSPECT_MODE */);
    }
    getOverlayAgent() {
        return this.overlayAgent;
    }
    async hasStyleSheetText(url) {
        return await __classPrivateFieldGet(this, _OverlayModel_windowControls, "f").initializeStyleSheetText(url);
    }
}
_OverlayModel_domModel = new WeakMap(), _OverlayModel_debuggerModel = new WeakMap(), _OverlayModel_inspectModeEnabledInternal = new WeakMap(), _OverlayModel_hideHighlightTimeout = new WeakMap(), _OverlayModel_defaultHighlighter = new WeakMap(), _OverlayModel_highlighter = new WeakMap(), _OverlayModel_showPaintRectsSetting = new WeakMap(), _OverlayModel_showLayoutShiftRegionsSetting = new WeakMap(), _OverlayModel_showAdHighlightsSetting = new WeakMap(), _OverlayModel_showDebugBordersSetting = new WeakMap(), _OverlayModel_showFPSCounterSetting = new WeakMap(), _OverlayModel_showScrollBottleneckRectsSetting = new WeakMap(), _OverlayModel_registeredListeners = new WeakMap(), _OverlayModel_showViewportSizeOnResize = new WeakMap(), _OverlayModel_persistentHighlighter = new WeakMap(), _OverlayModel_sourceOrderHighlighter = new WeakMap(), _OverlayModel_sourceOrderModeActiveInternal = new WeakMap(), _OverlayModel_windowControls = new WeakMap();
OverlayModel.inspectNodeHandler = null;
export class WindowControls {
    constructor(cssModel) {
        _WindowControls_instances.add(this);
        _WindowControls_cssModel.set(this, void 0);
        _WindowControls_originalStylesheetText.set(this, void 0);
        _WindowControls_stylesheetId.set(this, void 0);
        _WindowControls_currentUrl.set(this, void 0);
        _WindowControls_config.set(this, {
            showCSS: false,
            selectedPlatform: "Windows" /* EmulatedOSType.WINDOWS */,
            themeColor: '#ffffff',
        });
        __classPrivateFieldSet(this, _WindowControls_cssModel, cssModel, "f");
    }
    get selectedPlatform() {
        return __classPrivateFieldGet(this, _WindowControls_config, "f").selectedPlatform;
    }
    set selectedPlatform(osType) {
        __classPrivateFieldGet(this, _WindowControls_config, "f").selectedPlatform = osType;
    }
    get themeColor() {
        return __classPrivateFieldGet(this, _WindowControls_config, "f").themeColor;
    }
    set themeColor(color) {
        __classPrivateFieldGet(this, _WindowControls_config, "f").themeColor = color;
    }
    get config() {
        return __classPrivateFieldGet(this, _WindowControls_config, "f");
    }
    async initializeStyleSheetText(url) {
        if (__classPrivateFieldGet(this, _WindowControls_originalStylesheetText, "f") && url === __classPrivateFieldGet(this, _WindowControls_currentUrl, "f")) {
            return true;
        }
        const cssSourceUrl = __classPrivateFieldGet(this, _WindowControls_instances, "m", _WindowControls_fetchCssSourceUrl).call(this, url);
        if (!cssSourceUrl) {
            return false;
        }
        __classPrivateFieldSet(this, _WindowControls_stylesheetId, __classPrivateFieldGet(this, _WindowControls_instances, "m", _WindowControls_fetchCurrentStyleSheet).call(this, cssSourceUrl), "f");
        if (!__classPrivateFieldGet(this, _WindowControls_stylesheetId, "f")) {
            return false;
        }
        const stylesheetText = await __classPrivateFieldGet(this, _WindowControls_cssModel, "f").getStyleSheetText(__classPrivateFieldGet(this, _WindowControls_stylesheetId, "f"));
        if (!stylesheetText) {
            return false;
        }
        __classPrivateFieldSet(this, _WindowControls_originalStylesheetText, stylesheetText, "f");
        __classPrivateFieldSet(this, _WindowControls_currentUrl, url, "f");
        return true;
    }
    async toggleEmulatedOverlay(showOverlay) {
        if (!__classPrivateFieldGet(this, _WindowControls_stylesheetId, "f") || !__classPrivateFieldGet(this, _WindowControls_originalStylesheetText, "f")) {
            return;
        }
        if (showOverlay) {
            const styleSheetText = __classPrivateFieldGet(_a, _a, "m", _WindowControls_getStyleSheetForPlatform).call(_a, __classPrivateFieldGet(this, _WindowControls_config, "f").selectedPlatform.toLowerCase(), __classPrivateFieldGet(this, _WindowControls_originalStylesheetText, "f"));
            if (styleSheetText) {
                await __classPrivateFieldGet(this, _WindowControls_cssModel, "f").setStyleSheetText(__classPrivateFieldGet(this, _WindowControls_stylesheetId, "f"), styleSheetText, false);
            }
        }
        else {
            // Restore the original stylesheet
            await __classPrivateFieldGet(this, _WindowControls_cssModel, "f").setStyleSheetText(__classPrivateFieldGet(this, _WindowControls_stylesheetId, "f"), __classPrivateFieldGet(this, _WindowControls_originalStylesheetText, "f"), false);
        }
    }
    transformStyleSheetforTesting(x, y, width, height, originalStyleSheet) {
        return __classPrivateFieldGet(_a, _a, "m", _WindowControls_transformStyleSheet).call(_a, x, y, width, height, originalStyleSheet);
    }
}
_a = WindowControls, _WindowControls_cssModel = new WeakMap(), _WindowControls_originalStylesheetText = new WeakMap(), _WindowControls_stylesheetId = new WeakMap(), _WindowControls_currentUrl = new WeakMap(), _WindowControls_config = new WeakMap(), _WindowControls_instances = new WeakSet(), _WindowControls_getStyleSheetForPlatform = function _WindowControls_getStyleSheetForPlatform(platform, originalStyleSheet) {
    const overlayDimensions = platformOverlayDimensions[platform];
    return __classPrivateFieldGet(_a, _a, "m", _WindowControls_transformStyleSheet).call(_a, overlayDimensions.x, overlayDimensions.y, overlayDimensions.width, overlayDimensions.height, originalStyleSheet);
}, _WindowControls_fetchCssSourceUrl = function _WindowControls_fetchCssSourceUrl(url) {
    const parentURL = Common.ParsedURL.ParsedURL.extractOrigin(url);
    const cssHeaders = __classPrivateFieldGet(this, _WindowControls_cssModel, "f").styleSheetHeaders();
    const header = cssHeaders.find(header => header.sourceURL && header.sourceURL.includes(parentURL));
    return header?.sourceURL;
}, _WindowControls_fetchCurrentStyleSheet = function _WindowControls_fetchCurrentStyleSheet(cssSourceUrl) {
    const stylesheetIds = __classPrivateFieldGet(this, _WindowControls_cssModel, "f").getStyleSheetIdsForURL(cssSourceUrl);
    return stylesheetIds.length > 0 ? stylesheetIds[0] : undefined;
}, _WindowControls_transformStyleSheet = function _WindowControls_transformStyleSheet(x, y, width, height, originalStyleSheet) {
    if (!originalStyleSheet) {
        return undefined;
    }
    const stylesheetText = originalStyleSheet;
    const updatedStylesheet = stylesheetText.replace(/: env\(titlebar-area-x(?:,[^)]*)?\);/g, `: env(titlebar-area-x, ${x}px);`)
        .replace(/: env\(titlebar-area-y(?:,[^)]*)?\);/g, `: env(titlebar-area-y, ${y}px);`)
        .replace(/: env\(titlebar-area-width(?:,[^)]*)?\);/g, `: env(titlebar-area-width, calc(100% - ${width}px));`)
        .replace(/: env\(titlebar-area-height(?:,[^)]*)?\);/g, `: env(titlebar-area-height, ${height}px);`);
    return updatedStylesheet;
};
export var Events;
(function (Events) {
    Events["INSPECT_MODE_WILL_BE_TOGGLED"] = "InspectModeWillBeToggled";
    Events["EXITED_INSPECT_MODE"] = "InspectModeExited";
    Events["HIGHLIGHT_NODE_REQUESTED"] = "HighlightNodeRequested";
    Events["SCREENSHOT_REQUESTED"] = "ScreenshotRequested";
    Events["PERSISTENT_GRID_OVERLAY_STATE_CHANGED"] = "PersistentGridOverlayStateChanged";
    Events["PERSISTENT_FLEX_CONTAINER_OVERLAY_STATE_CHANGED"] = "PersistentFlexContainerOverlayStateChanged";
    Events["PERSISTENT_SCROLL_SNAP_OVERLAY_STATE_CHANGED"] = "PersistentScrollSnapOverlayStateChanged";
    Events["PERSISTENT_CONTAINER_QUERY_OVERLAY_STATE_CHANGED"] = "PersistentContainerQueryOverlayStateChanged";
})(Events || (Events = {}));
class DefaultHighlighter {
    constructor(model) {
        _DefaultHighlighter_model.set(this, void 0);
        __classPrivateFieldSet(this, _DefaultHighlighter_model, model, "f");
    }
    highlightInOverlay(data, highlightConfig) {
        const { node, deferredNode, object, selectorList } = { node: undefined, deferredNode: undefined, object: undefined, selectorList: undefined, ...data };
        const nodeId = node ? node.id : undefined;
        const backendNodeId = deferredNode ? deferredNode.backendNodeId() : undefined;
        const objectId = object ? object.objectId : undefined;
        if (nodeId || backendNodeId || objectId) {
            void __classPrivateFieldGet(this, _DefaultHighlighter_model, "f").target().overlayAgent().invoke_highlightNode({ highlightConfig, nodeId, backendNodeId, objectId, selector: selectorList });
        }
        else {
            void __classPrivateFieldGet(this, _DefaultHighlighter_model, "f").target().overlayAgent().invoke_hideHighlight();
        }
    }
    async setInspectMode(mode, highlightConfig) {
        await __classPrivateFieldGet(this, _DefaultHighlighter_model, "f").target().overlayAgent().invoke_setInspectMode({ mode, highlightConfig });
    }
    highlightFrame(frameId) {
        void __classPrivateFieldGet(this, _DefaultHighlighter_model, "f").target().overlayAgent().invoke_highlightFrame({
            frameId,
            contentColor: Common.Color.PageHighlight.Content.toProtocolRGBA(),
            contentOutlineColor: Common.Color.PageHighlight.ContentOutline.toProtocolRGBA(),
        });
    }
}
_DefaultHighlighter_model = new WeakMap();
export class SourceOrderHighlighter {
    constructor(model) {
        _SourceOrderHighlighter_model.set(this, void 0);
        __classPrivateFieldSet(this, _SourceOrderHighlighter_model, model, "f");
    }
    highlightSourceOrderInOverlay(node, sourceOrderConfig) {
        __classPrivateFieldGet(this, _SourceOrderHighlighter_model, "f").setSourceOrderActive(true);
        __classPrivateFieldGet(this, _SourceOrderHighlighter_model, "f").setShowViewportSizeOnResize(false);
        void __classPrivateFieldGet(this, _SourceOrderHighlighter_model, "f").getOverlayAgent().invoke_highlightSourceOrder({ sourceOrderConfig, nodeId: node.id });
    }
    hideSourceOrderHighlight() {
        __classPrivateFieldGet(this, _SourceOrderHighlighter_model, "f").setSourceOrderActive(false);
        __classPrivateFieldGet(this, _SourceOrderHighlighter_model, "f").setShowViewportSizeOnResize(true);
        void __classPrivateFieldGet(this, _SourceOrderHighlighter_model, "f").clearHighlight();
    }
}
_SourceOrderHighlighter_model = new WeakMap();
SDKModel.register(OverlayModel, { capabilities: 2 /* Capability.DOM */, autostart: true });
//# sourceMappingURL=OverlayModel.js.map