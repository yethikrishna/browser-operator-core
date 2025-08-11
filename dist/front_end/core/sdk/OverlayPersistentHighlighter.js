// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _OverlayPersistentHighlighter_model, _OverlayPersistentHighlighter_colors, _OverlayPersistentHighlighter_persistentHighlightSetting, _OverlayPersistentHighlighter_gridHighlights, _OverlayPersistentHighlighter_scrollSnapHighlights, _OverlayPersistentHighlighter_flexHighlights, _OverlayPersistentHighlighter_containerQueryHighlights, _OverlayPersistentHighlighter_isolatedElementHighlights, _OverlayPersistentHighlighter_gridColorGenerator, _OverlayPersistentHighlighter_flexColorGenerator, _OverlayPersistentHighlighter_showGridLineLabelsSetting, _OverlayPersistentHighlighter_extendGridLinesSetting, _OverlayPersistentHighlighter_showGridAreasSetting, _OverlayPersistentHighlighter_showGridTrackSizesSetting, _OverlayPersistentHighlighter_callbacks;
import * as Common from '../common/common.js';
import * as Platform from '../platform/platform.js';
import { OverlayColorGenerator } from './OverlayColorGenerator.js';
export var HighlightType;
(function (HighlightType) {
    HighlightType["FLEX"] = "FLEX";
    HighlightType["GRID"] = "GRID";
    HighlightType["SCROLL_SNAP"] = "SCROLL_SNAP";
    HighlightType["CONTAINER_QUERY"] = "CONTAINER_QUERY";
    HighlightType["ISOLATED_ELEMENT"] = "ISOLATED_ELEMENT";
})(HighlightType || (HighlightType = {}));
export class OverlayPersistentHighlighter {
    constructor(model, callbacks) {
        _OverlayPersistentHighlighter_model.set(this, void 0);
        _OverlayPersistentHighlighter_colors.set(this, new Map());
        _OverlayPersistentHighlighter_persistentHighlightSetting.set(this, Common.Settings.Settings.instance().createLocalSetting('persistent-highlight-setting', []));
        _OverlayPersistentHighlighter_gridHighlights.set(this, new Map());
        _OverlayPersistentHighlighter_scrollSnapHighlights.set(this, new Map());
        _OverlayPersistentHighlighter_flexHighlights.set(this, new Map());
        _OverlayPersistentHighlighter_containerQueryHighlights.set(this, new Map());
        _OverlayPersistentHighlighter_isolatedElementHighlights.set(this, new Map());
        _OverlayPersistentHighlighter_gridColorGenerator.set(this, new OverlayColorGenerator());
        _OverlayPersistentHighlighter_flexColorGenerator.set(this, new OverlayColorGenerator());
        /**
         * @see `front_end/core/sdk/sdk-meta.ts`
         */
        _OverlayPersistentHighlighter_showGridLineLabelsSetting.set(this, Common.Settings.Settings.instance().moduleSetting('show-grid-line-labels'));
        _OverlayPersistentHighlighter_extendGridLinesSetting.set(this, Common.Settings.Settings.instance().moduleSetting('extend-grid-lines'));
        _OverlayPersistentHighlighter_showGridAreasSetting.set(this, Common.Settings.Settings.instance().moduleSetting('show-grid-areas'));
        _OverlayPersistentHighlighter_showGridTrackSizesSetting.set(this, Common.Settings.Settings.instance().moduleSetting('show-grid-track-sizes'));
        _OverlayPersistentHighlighter_callbacks.set(this, void 0);
        __classPrivateFieldSet(this, _OverlayPersistentHighlighter_model, model, "f");
        __classPrivateFieldSet(this, _OverlayPersistentHighlighter_callbacks, callbacks, "f");
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_showGridLineLabelsSetting, "f").addChangeListener(this.onSettingChange, this);
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_extendGridLinesSetting, "f").addChangeListener(this.onSettingChange, this);
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_showGridAreasSetting, "f").addChangeListener(this.onSettingChange, this);
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_showGridTrackSizesSetting, "f").addChangeListener(this.onSettingChange, this);
    }
    onSettingChange() {
        this.resetOverlay();
    }
    buildGridHighlightConfig(nodeId) {
        const mainColor = this.colorOfGrid(nodeId).asLegacyColor();
        const background = mainColor.setAlpha(0.1).asLegacyColor();
        const gapBackground = mainColor.setAlpha(0.3).asLegacyColor();
        const gapHatch = mainColor.setAlpha(0.8).asLegacyColor();
        const showGridExtensionLines = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_extendGridLinesSetting, "f").get();
        const showPositiveLineNumbers = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_showGridLineLabelsSetting, "f").get() === 'lineNumbers';
        const showNegativeLineNumbers = showPositiveLineNumbers;
        const showLineNames = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_showGridLineLabelsSetting, "f").get() === 'lineNames';
        return {
            rowGapColor: gapBackground.toProtocolRGBA(),
            rowHatchColor: gapHatch.toProtocolRGBA(),
            columnGapColor: gapBackground.toProtocolRGBA(),
            columnHatchColor: gapHatch.toProtocolRGBA(),
            gridBorderColor: mainColor.toProtocolRGBA(),
            gridBorderDash: false,
            rowLineColor: mainColor.toProtocolRGBA(),
            columnLineColor: mainColor.toProtocolRGBA(),
            rowLineDash: true,
            columnLineDash: true,
            showGridExtensionLines,
            showPositiveLineNumbers,
            showNegativeLineNumbers,
            showLineNames,
            showAreaNames: __classPrivateFieldGet(this, _OverlayPersistentHighlighter_showGridAreasSetting, "f").get(),
            showTrackSizes: __classPrivateFieldGet(this, _OverlayPersistentHighlighter_showGridTrackSizesSetting, "f").get(),
            areaBorderColor: mainColor.toProtocolRGBA(),
            gridBackgroundColor: background.toProtocolRGBA(),
        };
    }
    buildFlexContainerHighlightConfig(nodeId) {
        const mainColor = this.colorOfFlex(nodeId).asLegacyColor();
        return {
            containerBorder: { color: mainColor.toProtocolRGBA(), pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */ },
            itemSeparator: { color: mainColor.toProtocolRGBA(), pattern: "dotted" /* Protocol.Overlay.LineStylePattern.Dotted */ },
            lineSeparator: { color: mainColor.toProtocolRGBA(), pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */ },
            mainDistributedSpace: { hatchColor: mainColor.toProtocolRGBA() },
            crossDistributedSpace: { hatchColor: mainColor.toProtocolRGBA() },
        };
    }
    buildScrollSnapContainerHighlightConfig(_nodeId) {
        return {
            snapAreaBorder: {
                color: Common.Color.PageHighlight.GridBorder.toProtocolRGBA(),
                pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
            },
            snapportBorder: { color: Common.Color.PageHighlight.GridBorder.toProtocolRGBA() },
            scrollMarginColor: Common.Color.PageHighlight.Margin.toProtocolRGBA(),
            scrollPaddingColor: Common.Color.PageHighlight.Padding.toProtocolRGBA(),
        };
    }
    highlightGridInOverlay(nodeId) {
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f").set(nodeId, this.buildGridHighlightConfig(nodeId));
        this.updateHighlightsInOverlay();
        this.savePersistentHighlightSetting();
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onGridOverlayStateChanged({ nodeId, enabled: true });
    }
    isGridHighlighted(nodeId) {
        return __classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f").has(nodeId);
    }
    colorOfGrid(nodeId) {
        let color = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_colors, "f").get(nodeId);
        if (!color) {
            color = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridColorGenerator, "f").next();
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_colors, "f").set(nodeId, color);
        }
        return color;
    }
    setColorOfGrid(nodeId, color) {
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_colors, "f").set(nodeId, color);
    }
    hideGridInOverlay(nodeId) {
        if (__classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f").has(nodeId)) {
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f").delete(nodeId);
            this.updateHighlightsInOverlay();
            this.savePersistentHighlightSetting();
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onGridOverlayStateChanged({ nodeId, enabled: false });
        }
    }
    highlightScrollSnapInOverlay(nodeId) {
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f").set(nodeId, this.buildScrollSnapContainerHighlightConfig(nodeId));
        this.updateHighlightsInOverlay();
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onScrollSnapOverlayStateChanged({ nodeId, enabled: true });
        this.savePersistentHighlightSetting();
    }
    isScrollSnapHighlighted(nodeId) {
        return __classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f").has(nodeId);
    }
    hideScrollSnapInOverlay(nodeId) {
        if (__classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f").has(nodeId)) {
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f").delete(nodeId);
            this.updateHighlightsInOverlay();
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onScrollSnapOverlayStateChanged({ nodeId, enabled: false });
            this.savePersistentHighlightSetting();
        }
    }
    highlightFlexInOverlay(nodeId) {
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f").set(nodeId, this.buildFlexContainerHighlightConfig(nodeId));
        this.updateHighlightsInOverlay();
        this.savePersistentHighlightSetting();
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onFlexOverlayStateChanged({ nodeId, enabled: true });
    }
    isFlexHighlighted(nodeId) {
        return __classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f").has(nodeId);
    }
    colorOfFlex(nodeId) {
        let color = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_colors, "f").get(nodeId);
        if (!color) {
            color = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexColorGenerator, "f").next();
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_colors, "f").set(nodeId, color);
        }
        return color;
    }
    setColorOfFlex(nodeId, color) {
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_colors, "f").set(nodeId, color);
    }
    hideFlexInOverlay(nodeId) {
        if (__classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f").has(nodeId)) {
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f").delete(nodeId);
            this.updateHighlightsInOverlay();
            this.savePersistentHighlightSetting();
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onFlexOverlayStateChanged({ nodeId, enabled: false });
        }
    }
    highlightContainerQueryInOverlay(nodeId) {
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f").set(nodeId, this.buildContainerQueryContainerHighlightConfig());
        this.updateHighlightsInOverlay();
        this.savePersistentHighlightSetting();
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onContainerQueryOverlayStateChanged({ nodeId, enabled: true });
    }
    hideContainerQueryInOverlay(nodeId) {
        if (__classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f").has(nodeId)) {
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f").delete(nodeId);
            this.updateHighlightsInOverlay();
            this.savePersistentHighlightSetting();
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onContainerQueryOverlayStateChanged({ nodeId, enabled: false });
        }
    }
    isContainerQueryHighlighted(nodeId) {
        return __classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f").has(nodeId);
    }
    buildContainerQueryContainerHighlightConfig() {
        return {
            containerBorder: {
                color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
            },
            descendantBorder: {
                color: Common.Color.PageHighlight.LayoutLine.toProtocolRGBA(),
                pattern: "dashed" /* Protocol.Overlay.LineStylePattern.Dashed */,
            },
        };
    }
    highlightIsolatedElementInOverlay(nodeId) {
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f").set(nodeId, this.buildIsolationModeHighlightConfig());
        this.updateHighlightsInOverlay();
        this.savePersistentHighlightSetting();
    }
    hideIsolatedElementInOverlay(nodeId) {
        if (__classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f").has(nodeId)) {
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f").delete(nodeId);
            this.updateHighlightsInOverlay();
            this.savePersistentHighlightSetting();
        }
    }
    isIsolatedElementHighlighted(nodeId) {
        return __classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f").has(nodeId);
    }
    buildIsolationModeHighlightConfig() {
        return {
            resizerColor: Common.Color.IsolationModeHighlight.Resizer.toProtocolRGBA(),
            resizerHandleColor: Common.Color.IsolationModeHighlight.ResizerHandle.toProtocolRGBA(),
            maskColor: Common.Color.IsolationModeHighlight.Mask.toProtocolRGBA(),
        };
    }
    hideAllInOverlayWithoutSave() {
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f").clear();
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f").clear();
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f").clear();
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f").clear();
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f").clear();
        this.updateHighlightsInOverlay();
    }
    refreshHighlights() {
        const gridsNeedUpdate = this.updateHighlightsForDeletedNodes(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f"));
        const flexboxesNeedUpdate = this.updateHighlightsForDeletedNodes(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f"));
        const scrollSnapsNeedUpdate = this.updateHighlightsForDeletedNodes(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f"));
        const containerQueriesNeedUpdate = this.updateHighlightsForDeletedNodes(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f"));
        const isolatedElementsNeedUpdate = this.updateHighlightsForDeletedNodes(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f"));
        if (flexboxesNeedUpdate || gridsNeedUpdate || scrollSnapsNeedUpdate || containerQueriesNeedUpdate ||
            isolatedElementsNeedUpdate) {
            this.updateHighlightsInOverlay();
            this.savePersistentHighlightSetting();
        }
    }
    updateHighlightsForDeletedNodes(highlights) {
        let needsUpdate = false;
        for (const nodeId of highlights.keys()) {
            if (__classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f").getDOMModel().nodeForId(nodeId) === null) {
                highlights.delete(nodeId);
                needsUpdate = true;
            }
        }
        return needsUpdate;
    }
    resetOverlay() {
        for (const nodeId of __classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f").keys()) {
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f").set(nodeId, this.buildGridHighlightConfig(nodeId));
        }
        for (const nodeId of __classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f").keys()) {
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f").set(nodeId, this.buildFlexContainerHighlightConfig(nodeId));
        }
        for (const nodeId of __classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f").keys()) {
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f").set(nodeId, this.buildScrollSnapContainerHighlightConfig(nodeId));
        }
        for (const nodeId of __classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f").keys()) {
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f").set(nodeId, this.buildContainerQueryContainerHighlightConfig());
        }
        for (const nodeId of __classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f").keys()) {
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f").set(nodeId, this.buildIsolationModeHighlightConfig());
        }
        this.updateHighlightsInOverlay();
    }
    updateHighlightsInOverlay() {
        const hasNodesToHighlight = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f").size > 0 || __classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f").size > 0 ||
            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f").size > 0 || __classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f").size > 0;
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f").setShowViewportSizeOnResize(!hasNodesToHighlight);
        this.updateGridHighlightsInOverlay();
        this.updateFlexHighlightsInOverlay();
        this.updateScrollSnapHighlightsInOverlay();
        this.updateContainerQueryHighlightsInOverlay();
        this.updateIsolatedElementHighlightsInOverlay();
    }
    updateGridHighlightsInOverlay() {
        const overlayModel = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f");
        const gridNodeHighlightConfigs = [];
        for (const [nodeId, gridHighlightConfig] of __classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f").entries()) {
            gridNodeHighlightConfigs.push({ nodeId, gridHighlightConfig });
        }
        overlayModel.target().overlayAgent().invoke_setShowGridOverlays({ gridNodeHighlightConfigs });
    }
    updateFlexHighlightsInOverlay() {
        const overlayModel = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f");
        const flexNodeHighlightConfigs = [];
        for (const [nodeId, flexContainerHighlightConfig] of __classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f").entries()) {
            flexNodeHighlightConfigs.push({ nodeId, flexContainerHighlightConfig });
        }
        overlayModel.target().overlayAgent().invoke_setShowFlexOverlays({ flexNodeHighlightConfigs });
    }
    updateScrollSnapHighlightsInOverlay() {
        const overlayModel = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f");
        const scrollSnapHighlightConfigs = [];
        for (const [nodeId, scrollSnapContainerHighlightConfig] of __classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f").entries()) {
            scrollSnapHighlightConfigs.push({ nodeId, scrollSnapContainerHighlightConfig });
        }
        overlayModel.target().overlayAgent().invoke_setShowScrollSnapOverlays({ scrollSnapHighlightConfigs });
    }
    updateContainerQueryHighlightsInOverlay() {
        const overlayModel = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f");
        const containerQueryHighlightConfigs = [];
        for (const [nodeId, containerQueryContainerHighlightConfig] of __classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f").entries()) {
            containerQueryHighlightConfigs.push({ nodeId, containerQueryContainerHighlightConfig });
        }
        overlayModel.target().overlayAgent().invoke_setShowContainerQueryOverlays({ containerQueryHighlightConfigs });
    }
    updateIsolatedElementHighlightsInOverlay() {
        const overlayModel = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f");
        const isolatedElementHighlightConfigs = [];
        for (const [nodeId, isolationModeHighlightConfig] of __classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f").entries()) {
            isolatedElementHighlightConfigs.push({ nodeId, isolationModeHighlightConfig });
        }
        overlayModel.target().overlayAgent().invoke_setShowIsolatedElements({ isolatedElementHighlightConfigs });
    }
    async restoreHighlightsForDocument() {
        __classPrivateFieldSet(this, _OverlayPersistentHighlighter_flexHighlights, new Map(), "f");
        __classPrivateFieldSet(this, _OverlayPersistentHighlighter_gridHighlights, new Map(), "f");
        __classPrivateFieldSet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, new Map(), "f");
        __classPrivateFieldSet(this, _OverlayPersistentHighlighter_containerQueryHighlights, new Map(), "f");
        __classPrivateFieldSet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, new Map(), "f");
        // this.currentURL() is empty when the page is reloaded because the
        // new document has not been requested yet and the old one has been
        // removed. Therefore, we need to request the document and wait for it.
        // Note that requestDocument() caches the document so that it is requested
        // only once.
        const document = await __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f").getDOMModel().requestDocument();
        const currentURL = document ? document.documentURL : Platform.DevToolsPath.EmptyUrlString;
        await Promise.all(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_persistentHighlightSetting, "f").get().map(async (persistentHighlight) => {
            if (persistentHighlight.url === currentURL) {
                return await __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f").getDOMModel().pushNodeByPathToFrontend(persistentHighlight.path).then(nodeId => {
                    const node = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f").getDOMModel().nodeForId(nodeId);
                    if (!node) {
                        return;
                    }
                    switch (persistentHighlight.type) {
                        case "GRID" /* HighlightType.GRID */:
                            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f").set(node.id, this.buildGridHighlightConfig(node.id));
                            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onGridOverlayStateChanged({ nodeId: node.id, enabled: true });
                            break;
                        case "FLEX" /* HighlightType.FLEX */:
                            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f").set(node.id, this.buildFlexContainerHighlightConfig(node.id));
                            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onFlexOverlayStateChanged({ nodeId: node.id, enabled: true });
                            break;
                        case "CONTAINER_QUERY" /* HighlightType.CONTAINER_QUERY */:
                            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f").set(node.id, this.buildContainerQueryContainerHighlightConfig());
                            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onContainerQueryOverlayStateChanged({ nodeId: node.id, enabled: true });
                            break;
                        case "SCROLL_SNAP" /* HighlightType.SCROLL_SNAP */:
                            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f").set(node.id, this.buildScrollSnapContainerHighlightConfig(node.id));
                            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_callbacks, "f").onScrollSnapOverlayStateChanged({ nodeId: node.id, enabled: true });
                            break;
                        case "ISOLATED_ELEMENT" /* HighlightType.ISOLATED_ELEMENT */:
                            __classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f").set(node.id, this.buildIsolationModeHighlightConfig());
                            break;
                    }
                });
            }
        }));
        this.updateHighlightsInOverlay();
    }
    currentUrl() {
        const domDocument = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f").getDOMModel().existingDocument();
        return domDocument ? domDocument.documentURL : Platform.DevToolsPath.EmptyUrlString;
    }
    getPersistentHighlightSettingForOneType(highlights, type) {
        const persistentHighlights = [];
        for (const nodeId of highlights.keys()) {
            const node = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_model, "f").getDOMModel().nodeForId(nodeId);
            if (node) {
                persistentHighlights.push({ url: this.currentUrl(), path: node.path(), type });
            }
        }
        return persistentHighlights;
    }
    savePersistentHighlightSetting() {
        const currentURL = this.currentUrl();
        // Keep the highlights that are not related to this document.
        const highlightsInOtherDocuments = __classPrivateFieldGet(this, _OverlayPersistentHighlighter_persistentHighlightSetting, "f").get().filter((persistentSetting) => persistentSetting.url !== currentURL);
        const persistentHighlights = [
            ...highlightsInOtherDocuments,
            ...this.getPersistentHighlightSettingForOneType(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_gridHighlights, "f"), "GRID" /* HighlightType.GRID */),
            ...this.getPersistentHighlightSettingForOneType(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_flexHighlights, "f"), "FLEX" /* HighlightType.FLEX */),
            ...this.getPersistentHighlightSettingForOneType(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_containerQueryHighlights, "f"), "CONTAINER_QUERY" /* HighlightType.CONTAINER_QUERY */),
            ...this.getPersistentHighlightSettingForOneType(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_scrollSnapHighlights, "f"), "SCROLL_SNAP" /* HighlightType.SCROLL_SNAP */),
            ...this.getPersistentHighlightSettingForOneType(__classPrivateFieldGet(this, _OverlayPersistentHighlighter_isolatedElementHighlights, "f"), "ISOLATED_ELEMENT" /* HighlightType.ISOLATED_ELEMENT */),
        ];
        __classPrivateFieldGet(this, _OverlayPersistentHighlighter_persistentHighlightSetting, "f").set(persistentHighlights);
    }
}
_OverlayPersistentHighlighter_model = new WeakMap(), _OverlayPersistentHighlighter_colors = new WeakMap(), _OverlayPersistentHighlighter_persistentHighlightSetting = new WeakMap(), _OverlayPersistentHighlighter_gridHighlights = new WeakMap(), _OverlayPersistentHighlighter_scrollSnapHighlights = new WeakMap(), _OverlayPersistentHighlighter_flexHighlights = new WeakMap(), _OverlayPersistentHighlighter_containerQueryHighlights = new WeakMap(), _OverlayPersistentHighlighter_isolatedElementHighlights = new WeakMap(), _OverlayPersistentHighlighter_gridColorGenerator = new WeakMap(), _OverlayPersistentHighlighter_flexColorGenerator = new WeakMap(), _OverlayPersistentHighlighter_showGridLineLabelsSetting = new WeakMap(), _OverlayPersistentHighlighter_extendGridLinesSetting = new WeakMap(), _OverlayPersistentHighlighter_showGridAreasSetting = new WeakMap(), _OverlayPersistentHighlighter_showGridTrackSizesSetting = new WeakMap(), _OverlayPersistentHighlighter_callbacks = new WeakMap();
//# sourceMappingURL=OverlayPersistentHighlighter.js.map