// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _CSSModel_domModel, _CSSModel_fontFaces, _CSSModel_originalStyleSheetText, _CSSModel_resourceTreeModel, _CSSModel_sourceMapManager, _CSSModel_styleLoader, _CSSModel_stylePollingThrottler, _CSSModel_styleSheetIdsForURL, _CSSModel_styleSheetIdToHeader, _CSSModel_cachedMatchedCascadeNode, _CSSModel_cachedMatchedCascadePromise, _CSSModel_cssPropertyTracker, _CSSModel_isCSSPropertyTrackingEnabled, _CSSModel_isEnabled, _CSSModel_isRuleUsageTrackingEnabled, _CSSModel_isTrackingRequestPending, _CSSModel_colorScheme, _CSSLocation_cssModelInternal, _CSSDispatcher_cssModel, _ComputedStyleLoader_cssModel, _ComputedStyleLoader_nodeIdToPromise, _CSSPropertyTracker_cssModel, _CSSPropertyTracker_properties;
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import * as Host from '../host/host.js';
import * as Platform from '../platform/platform.js';
import * as Root from '../root/root.js';
import { CSSFontFace } from './CSSFontFace.js';
import { CSSMatchedStyles } from './CSSMatchedStyles.js';
import { CSSMedia } from './CSSMedia.js';
import { cssMetadata } from './CSSMetadata.js';
import { CSSStyleRule } from './CSSRule.js';
import { CSSStyleDeclaration, Type } from './CSSStyleDeclaration.js';
import { CSSStyleSheetHeader } from './CSSStyleSheetHeader.js';
import { DOMModel } from './DOMModel.js';
import { Events as ResourceTreeModelEvents, ResourceTreeModel, } from './ResourceTreeModel.js';
import { SDKModel } from './SDKModel.js';
import { SourceMapManager } from './SourceMapManager.js';
export var ColorScheme;
(function (ColorScheme) {
    ColorScheme["LIGHT"] = "light";
    ColorScheme["DARK"] = "dark";
})(ColorScheme || (ColorScheme = {}));
export class CSSModel extends SDKModel {
    constructor(target) {
        super(target);
        _CSSModel_domModel.set(this, void 0);
        _CSSModel_fontFaces.set(this, new Map());
        _CSSModel_originalStyleSheetText.set(this, new Map());
        _CSSModel_resourceTreeModel.set(this, void 0);
        _CSSModel_sourceMapManager.set(this, void 0);
        _CSSModel_styleLoader.set(this, void 0);
        _CSSModel_stylePollingThrottler.set(this, new Common.Throttler.Throttler(StylePollingInterval));
        _CSSModel_styleSheetIdsForURL.set(this, new Map());
        _CSSModel_styleSheetIdToHeader.set(this, new Map());
        _CSSModel_cachedMatchedCascadeNode.set(this, null);
        _CSSModel_cachedMatchedCascadePromise.set(this, null);
        _CSSModel_cssPropertyTracker.set(this, null);
        _CSSModel_isCSSPropertyTrackingEnabled.set(this, false);
        _CSSModel_isEnabled.set(this, false);
        _CSSModel_isRuleUsageTrackingEnabled.set(this, false);
        _CSSModel_isTrackingRequestPending.set(this, false);
        _CSSModel_colorScheme.set(this, void 0);
        __classPrivateFieldSet(this, _CSSModel_domModel, target.model(DOMModel), "f");
        __classPrivateFieldSet(this, _CSSModel_sourceMapManager, new SourceMapManager(target), "f");
        this.agent = target.cssAgent();
        __classPrivateFieldSet(this, _CSSModel_styleLoader, new ComputedStyleLoader(this), "f");
        __classPrivateFieldSet(this, _CSSModel_resourceTreeModel, target.model(ResourceTreeModel), "f");
        if (__classPrivateFieldGet(this, _CSSModel_resourceTreeModel, "f")) {
            __classPrivateFieldGet(this, _CSSModel_resourceTreeModel, "f").addEventListener(ResourceTreeModelEvents.PrimaryPageChanged, this.onPrimaryPageChanged, this);
        }
        target.registerCSSDispatcher(new CSSDispatcher(this));
        if (!target.suspended()) {
            void this.enable();
        }
        __classPrivateFieldGet(this, _CSSModel_sourceMapManager, "f").setEnabled(Common.Settings.Settings.instance().moduleSetting('css-source-maps-enabled').get());
        Common.Settings.Settings.instance()
            .moduleSetting('css-source-maps-enabled')
            .addChangeListener(event => __classPrivateFieldGet(this, _CSSModel_sourceMapManager, "f").setEnabled(event.data));
    }
    async colorScheme() {
        if (!__classPrivateFieldGet(this, _CSSModel_colorScheme, "f")) {
            const colorSchemeResponse = await this.domModel()?.target().runtimeAgent().invoke_evaluate({ expression: 'window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches' });
            if (colorSchemeResponse && !colorSchemeResponse.exceptionDetails && !colorSchemeResponse.getError()) {
                __classPrivateFieldSet(this, _CSSModel_colorScheme, colorSchemeResponse.result.value ? "dark" /* ColorScheme.DARK */ : "light" /* ColorScheme.LIGHT */, "f");
            }
        }
        return __classPrivateFieldGet(this, _CSSModel_colorScheme, "f");
    }
    async resolveValues(propertyName, nodeId, ...values) {
        if (propertyName && cssMetadata().getLonghands(propertyName)?.length) {
            return null;
        }
        const response = await this.agent.invoke_resolveValues({ values, nodeId, propertyName });
        if (response.getError()) {
            return null;
        }
        return response.results;
    }
    headersForSourceURL(sourceURL) {
        const headers = [];
        for (const headerId of this.getStyleSheetIdsForURL(sourceURL)) {
            const header = this.styleSheetHeaderForId(headerId);
            if (header) {
                headers.push(header);
            }
        }
        return headers;
    }
    createRawLocationsByURL(sourceURL, lineNumber, columnNumber = 0) {
        const headers = this.headersForSourceURL(sourceURL);
        headers.sort(stylesheetComparator);
        const endIndex = Platform.ArrayUtilities.upperBound(headers, undefined, (_, header) => lineNumber - header.startLine || columnNumber - header.startColumn);
        if (!endIndex) {
            return [];
        }
        const locations = [];
        const last = headers[endIndex - 1];
        for (let index = endIndex - 1; index >= 0 && headers[index].startLine === last.startLine && headers[index].startColumn === last.startColumn; --index) {
            if (headers[index].containsLocation(lineNumber, columnNumber)) {
                locations.push(new CSSLocation(headers[index], lineNumber, columnNumber));
            }
        }
        return locations;
        function stylesheetComparator(a, b) {
            return a.startLine - b.startLine || a.startColumn - b.startColumn || a.id.localeCompare(b.id);
        }
    }
    sourceMapManager() {
        return __classPrivateFieldGet(this, _CSSModel_sourceMapManager, "f");
    }
    static readableLayerName(text) {
        return text || '<anonymous>';
    }
    static trimSourceURL(text) {
        let sourceURLIndex = text.lastIndexOf('/*# sourceURL=');
        if (sourceURLIndex === -1) {
            sourceURLIndex = text.lastIndexOf('/*@ sourceURL=');
            if (sourceURLIndex === -1) {
                return text;
            }
        }
        const sourceURLLineIndex = text.lastIndexOf('\n', sourceURLIndex);
        if (sourceURLLineIndex === -1) {
            return text;
        }
        const sourceURLLine = text.substr(sourceURLLineIndex + 1).split('\n', 1)[0];
        const sourceURLRegex = /[\x20\t]*\/\*[#@] sourceURL=[\x20\t]*([^\s]*)[\x20\t]*\*\/[\x20\t]*$/;
        if (sourceURLLine.search(sourceURLRegex) === -1) {
            return text;
        }
        return text.substr(0, sourceURLLineIndex) + text.substr(sourceURLLineIndex + sourceURLLine.length + 1);
    }
    domModel() {
        return __classPrivateFieldGet(this, _CSSModel_domModel, "f");
    }
    async trackComputedStyleUpdatesForNode(nodeId) {
        await this.agent.invoke_trackComputedStyleUpdatesForNode({ nodeId });
    }
    async setStyleText(styleSheetId, range, text, majorChange) {
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { styles } = await this.agent.invoke_setStyleTexts({ edits: [{ styleSheetId, range: range.serializeToObject(), text }] });
            if (!styles || styles.length !== 1) {
                return false;
            }
            __classPrivateFieldGet(this, _CSSModel_domModel, "f").markUndoableState(!majorChange);
            const edit = new Edit(styleSheetId, range, text, styles[0]);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async setSelectorText(styleSheetId, range, text) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { selectorList } = await this.agent.invoke_setRuleSelector({ styleSheetId, range, selector: text });
            if (!selectorList) {
                return false;
            }
            __classPrivateFieldGet(this, _CSSModel_domModel, "f").markUndoableState();
            const edit = new Edit(styleSheetId, range, text, selectorList);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async setPropertyRulePropertyName(styleSheetId, range, text) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { propertyName } = await this.agent.invoke_setPropertyRulePropertyName({ styleSheetId, range, propertyName: text });
            if (!propertyName) {
                return false;
            }
            __classPrivateFieldGet(this, _CSSModel_domModel, "f").markUndoableState();
            const edit = new Edit(styleSheetId, range, text, propertyName);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async setKeyframeKey(styleSheetId, range, text) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { keyText } = await this.agent.invoke_setKeyframeKey({ styleSheetId, range, keyText: text });
            if (!keyText) {
                return false;
            }
            __classPrivateFieldGet(this, _CSSModel_domModel, "f").markUndoableState();
            const edit = new Edit(styleSheetId, range, text, keyText);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    startCoverage() {
        __classPrivateFieldSet(this, _CSSModel_isRuleUsageTrackingEnabled, true, "f");
        return this.agent.invoke_startRuleUsageTracking();
    }
    async takeCoverageDelta() {
        const r = await this.agent.invoke_takeCoverageDelta();
        const timestamp = (r?.timestamp) || 0;
        const coverage = (r?.coverage) || [];
        return { timestamp, coverage };
    }
    setLocalFontsEnabled(enabled) {
        return this.agent.invoke_setLocalFontsEnabled({
            enabled,
        });
    }
    async stopCoverage() {
        __classPrivateFieldSet(this, _CSSModel_isRuleUsageTrackingEnabled, false, "f");
        await this.agent.invoke_stopRuleUsageTracking();
    }
    async getMediaQueries() {
        const { medias } = await this.agent.invoke_getMediaQueries();
        return medias ? CSSMedia.parseMediaArrayPayload(this, medias) : [];
    }
    async getRootLayer(nodeId) {
        const { rootLayer } = await this.agent.invoke_getLayersForNode({ nodeId });
        return rootLayer;
    }
    isEnabled() {
        return __classPrivateFieldGet(this, _CSSModel_isEnabled, "f");
    }
    async enable() {
        await this.agent.invoke_enable();
        __classPrivateFieldSet(this, _CSSModel_isEnabled, true, "f");
        if (__classPrivateFieldGet(this, _CSSModel_isRuleUsageTrackingEnabled, "f")) {
            await this.startCoverage();
        }
        this.dispatchEventToListeners(Events.ModelWasEnabled);
    }
    async getAnimatedStylesForNode(nodeId) {
        const response = await this.agent.invoke_getAnimatedStylesForNode({ nodeId });
        if (response.getError()) {
            return null;
        }
        return response;
    }
    async getMatchedStyles(nodeId) {
        const node = __classPrivateFieldGet(this, _CSSModel_domModel, "f").nodeForId(nodeId);
        if (!node) {
            return null;
        }
        const shouldGetAnimatedStyles = Root.Runtime.hostConfig.devToolsAnimationStylesInStylesTab?.enabled;
        const [matchedStylesResponse, animatedStylesResponse] = await Promise.all([
            this.agent.invoke_getMatchedStylesForNode({ nodeId }),
            shouldGetAnimatedStyles ? this.agent.invoke_getAnimatedStylesForNode({ nodeId }) : undefined,
        ]);
        if (matchedStylesResponse.getError()) {
            return null;
        }
        const payload = {
            cssModel: this,
            node,
            inlinePayload: matchedStylesResponse.inlineStyle || null,
            attributesPayload: matchedStylesResponse.attributesStyle || null,
            matchedPayload: matchedStylesResponse.matchedCSSRules || [],
            pseudoPayload: matchedStylesResponse.pseudoElements || [],
            inheritedPayload: matchedStylesResponse.inherited || [],
            inheritedPseudoPayload: matchedStylesResponse.inheritedPseudoElements || [],
            animationsPayload: matchedStylesResponse.cssKeyframesRules || [],
            parentLayoutNodeId: matchedStylesResponse.parentLayoutNodeId,
            positionTryRules: matchedStylesResponse.cssPositionTryRules || [],
            propertyRules: matchedStylesResponse.cssPropertyRules ?? [],
            functionRules: matchedStylesResponse.cssFunctionRules ?? [],
            cssPropertyRegistrations: matchedStylesResponse.cssPropertyRegistrations ?? [],
            fontPaletteValuesRule: matchedStylesResponse.cssFontPaletteValuesRule,
            activePositionFallbackIndex: matchedStylesResponse.activePositionFallbackIndex ?? -1,
            animationStylesPayload: animatedStylesResponse?.animationStyles || [],
            inheritedAnimatedPayload: animatedStylesResponse?.inherited || [],
            transitionsStylePayload: animatedStylesResponse?.transitionsStyle || null,
        };
        return await CSSMatchedStyles.create(payload);
    }
    async getClassNames(styleSheetId) {
        const { classNames } = await this.agent.invoke_collectClassNames({ styleSheetId });
        return classNames || [];
    }
    async getComputedStyle(nodeId) {
        if (!this.isEnabled()) {
            await this.enable();
        }
        return await __classPrivateFieldGet(this, _CSSModel_styleLoader, "f").computedStylePromise(nodeId);
    }
    async getLayoutPropertiesFromComputedStyle(nodeId) {
        const styles = await this.getComputedStyle(nodeId);
        if (!styles) {
            return null;
        }
        const display = styles.get('display');
        const isFlex = display === 'flex' || display === 'inline-flex';
        const isGrid = display === 'grid' || display === 'inline-grid';
        const isSubgrid = (isGrid &&
            (styles.get('grid-template-columns')?.startsWith('subgrid') ||
                styles.get('grid-template-rows')?.startsWith('subgrid'))) ??
            false;
        const containerType = styles.get('container-type');
        const isContainer = Boolean(containerType) && containerType !== '' && containerType !== 'normal';
        const hasScroll = Boolean(styles.get('scroll-snap-type')) && styles.get('scroll-snap-type') !== 'none';
        return {
            isFlex,
            isGrid,
            isSubgrid,
            isContainer,
            hasScroll,
        };
    }
    async getBackgroundColors(nodeId) {
        const response = await this.agent.invoke_getBackgroundColors({ nodeId });
        if (response.getError()) {
            return null;
        }
        return {
            backgroundColors: response.backgroundColors || null,
            computedFontSize: response.computedFontSize || '',
            computedFontWeight: response.computedFontWeight || '',
        };
    }
    async getPlatformFonts(nodeId) {
        const { fonts } = await this.agent.invoke_getPlatformFontsForNode({ nodeId });
        return fonts;
    }
    allStyleSheets() {
        const values = [...__classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").values()];
        function styleSheetComparator(a, b) {
            if (a.sourceURL < b.sourceURL) {
                return -1;
            }
            if (a.sourceURL > b.sourceURL) {
                return 1;
            }
            return a.startLine - b.startLine || a.startColumn - b.startColumn;
        }
        values.sort(styleSheetComparator);
        return values;
    }
    async getInlineStyles(nodeId) {
        const response = await this.agent.invoke_getInlineStylesForNode({ nodeId });
        if (response.getError() || !response.inlineStyle) {
            return null;
        }
        const inlineStyle = new CSSStyleDeclaration(this, null, response.inlineStyle, Type.Inline);
        const attributesStyle = response.attributesStyle ?
            new CSSStyleDeclaration(this, null, response.attributesStyle, Type.Attributes) :
            null;
        return new InlineStyleResult(inlineStyle, attributesStyle);
    }
    forcePseudoState(node, pseudoClass, enable) {
        const forcedPseudoClasses = node.marker(PseudoStateMarker) || [];
        const hasPseudoClass = forcedPseudoClasses.includes(pseudoClass);
        if (enable) {
            if (hasPseudoClass) {
                return false;
            }
            forcedPseudoClasses.push(pseudoClass);
            node.setMarker(PseudoStateMarker, forcedPseudoClasses);
        }
        else {
            if (!hasPseudoClass) {
                return false;
            }
            Platform.ArrayUtilities.removeElement(forcedPseudoClasses, pseudoClass);
            if (forcedPseudoClasses.length) {
                node.setMarker(PseudoStateMarker, forcedPseudoClasses);
            }
            else {
                node.setMarker(PseudoStateMarker, null);
            }
        }
        if (node.id === undefined) {
            return false;
        }
        void this.agent.invoke_forcePseudoState({ nodeId: node.id, forcedPseudoClasses });
        this.dispatchEventToListeners(Events.PseudoStateForced, { node, pseudoClass, enable });
        return true;
    }
    pseudoState(node) {
        return node.marker(PseudoStateMarker) || [];
    }
    async setMediaText(styleSheetId, range, newMediaText) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { media } = await this.agent.invoke_setMediaText({ styleSheetId, range, text: newMediaText });
            if (!media) {
                return false;
            }
            __classPrivateFieldGet(this, _CSSModel_domModel, "f").markUndoableState();
            const edit = new Edit(styleSheetId, range, newMediaText, media);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async setContainerQueryText(styleSheetId, range, newContainerQueryText) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { containerQuery } = await this.agent.invoke_setContainerQueryText({ styleSheetId, range, text: newContainerQueryText });
            if (!containerQuery) {
                return false;
            }
            __classPrivateFieldGet(this, _CSSModel_domModel, "f").markUndoableState();
            const edit = new Edit(styleSheetId, range, newContainerQueryText, containerQuery);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async setSupportsText(styleSheetId, range, newSupportsText) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { supports } = await this.agent.invoke_setSupportsText({ styleSheetId, range, text: newSupportsText });
            if (!supports) {
                return false;
            }
            __classPrivateFieldGet(this, _CSSModel_domModel, "f").markUndoableState();
            const edit = new Edit(styleSheetId, range, newSupportsText, supports);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async setScopeText(styleSheetId, range, newScopeText) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { scope } = await this.agent.invoke_setScopeText({ styleSheetId, range, text: newScopeText });
            if (!scope) {
                return false;
            }
            __classPrivateFieldGet(this, _CSSModel_domModel, "f").markUndoableState();
            const edit = new Edit(styleSheetId, range, newScopeText, scope);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async addRule(styleSheetId, ruleText, ruleLocation) {
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { rule } = await this.agent.invoke_addRule({ styleSheetId, ruleText, location: ruleLocation });
            if (!rule) {
                return null;
            }
            __classPrivateFieldGet(this, _CSSModel_domModel, "f").markUndoableState();
            const edit = new Edit(styleSheetId, ruleLocation, ruleText, rule);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return new CSSStyleRule(this, rule);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    async requestViaInspectorStylesheet(maybeFrameId) {
        const frameId = maybeFrameId ||
            (__classPrivateFieldGet(this, _CSSModel_resourceTreeModel, "f") && __classPrivateFieldGet(this, _CSSModel_resourceTreeModel, "f").mainFrame ? __classPrivateFieldGet(this, _CSSModel_resourceTreeModel, "f").mainFrame.id : null);
        const headers = [...__classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").values()];
        const styleSheetHeader = headers.find(header => header.frameId === frameId && header.isViaInspector());
        if (styleSheetHeader) {
            return styleSheetHeader;
        }
        if (!frameId) {
            return null;
        }
        try {
            return await this.createInspectorStylesheet(frameId);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    async createInspectorStylesheet(frameId, force = false) {
        const result = await this.agent.invoke_createStyleSheet({ frameId, force });
        if (result.getError()) {
            throw new Error(result.getError());
        }
        return __classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").get(result.styleSheetId) || null;
    }
    mediaQueryResultChanged() {
        __classPrivateFieldSet(this, _CSSModel_colorScheme, undefined, "f");
        this.dispatchEventToListeners(Events.MediaQueryResultChanged);
    }
    fontsUpdated(fontFace) {
        if (fontFace) {
            __classPrivateFieldGet(this, _CSSModel_fontFaces, "f").set(fontFace.src, new CSSFontFace(fontFace));
        }
        this.dispatchEventToListeners(Events.FontsUpdated);
    }
    fontFaces() {
        return [...__classPrivateFieldGet(this, _CSSModel_fontFaces, "f").values()];
    }
    fontFaceForSource(src) {
        return __classPrivateFieldGet(this, _CSSModel_fontFaces, "f").get(src);
    }
    styleSheetHeaderForId(id) {
        return __classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").get(id) || null;
    }
    styleSheetHeaders() {
        return [...__classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").values()];
    }
    fireStyleSheetChanged(styleSheetId, edit) {
        this.dispatchEventToListeners(Events.StyleSheetChanged, { styleSheetId, edit });
    }
    ensureOriginalStyleSheetText(styleSheetId) {
        const header = this.styleSheetHeaderForId(styleSheetId);
        if (!header) {
            return Promise.resolve(null);
        }
        let promise = __classPrivateFieldGet(this, _CSSModel_originalStyleSheetText, "f").get(header);
        if (!promise) {
            promise = this.getStyleSheetText(header.id);
            __classPrivateFieldGet(this, _CSSModel_originalStyleSheetText, "f").set(header, promise);
            this.originalContentRequestedForTest(header);
        }
        return promise;
    }
    originalContentRequestedForTest(_header) {
    }
    originalStyleSheetText(header) {
        return this.ensureOriginalStyleSheetText(header.id);
    }
    getAllStyleSheetHeaders() {
        return __classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").values();
    }
    computedStyleUpdated(nodeId) {
        this.dispatchEventToListeners(Events.ComputedStyleUpdated, { nodeId });
    }
    styleSheetAdded(header) {
        console.assert(!__classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").get(header.styleSheetId));
        if (header.loadingFailed) {
            // When the stylesheet fails to load, treat it as a constructed stylesheet. Failed sheets can still be modified
            // from JS, in which case CSS.styleSheetChanged events are sent. So as to not confuse CSSModel clients we don't
            // just discard the failed sheet here. Treating the failed sheet as a constructed stylesheet lets us keep track
            // of it cleanly.
            header.hasSourceURL = false;
            header.isConstructed = true;
            header.isInline = false;
            header.isMutable = false;
            header.sourceURL = '';
            header.sourceMapURL = undefined;
        }
        const styleSheetHeader = new CSSStyleSheetHeader(this, header);
        __classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").set(header.styleSheetId, styleSheetHeader);
        const url = styleSheetHeader.resourceURL();
        let frameIdToStyleSheetIds = __classPrivateFieldGet(this, _CSSModel_styleSheetIdsForURL, "f").get(url);
        if (!frameIdToStyleSheetIds) {
            frameIdToStyleSheetIds = new Map();
            __classPrivateFieldGet(this, _CSSModel_styleSheetIdsForURL, "f").set(url, frameIdToStyleSheetIds);
        }
        if (frameIdToStyleSheetIds) {
            let styleSheetIds = frameIdToStyleSheetIds.get(styleSheetHeader.frameId);
            if (!styleSheetIds) {
                styleSheetIds = new Set();
                frameIdToStyleSheetIds.set(styleSheetHeader.frameId, styleSheetIds);
            }
            styleSheetIds.add(styleSheetHeader.id);
        }
        __classPrivateFieldGet(this, _CSSModel_sourceMapManager, "f").attachSourceMap(styleSheetHeader, styleSheetHeader.sourceURL, styleSheetHeader.sourceMapURL);
        this.dispatchEventToListeners(Events.StyleSheetAdded, styleSheetHeader);
    }
    styleSheetRemoved(id) {
        const header = __classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").get(id);
        console.assert(Boolean(header));
        if (!header) {
            return;
        }
        __classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").delete(id);
        const url = header.resourceURL();
        const frameIdToStyleSheetIds = __classPrivateFieldGet(this, _CSSModel_styleSheetIdsForURL, "f").get(url);
        console.assert(Boolean(frameIdToStyleSheetIds), 'No frameId to styleSheetId map is available for given style sheet URL.');
        if (frameIdToStyleSheetIds) {
            const stylesheetIds = frameIdToStyleSheetIds.get(header.frameId);
            if (stylesheetIds) {
                stylesheetIds.delete(id);
                if (!stylesheetIds.size) {
                    frameIdToStyleSheetIds.delete(header.frameId);
                    if (!frameIdToStyleSheetIds.size) {
                        __classPrivateFieldGet(this, _CSSModel_styleSheetIdsForURL, "f").delete(url);
                    }
                }
            }
        }
        __classPrivateFieldGet(this, _CSSModel_originalStyleSheetText, "f").delete(header);
        __classPrivateFieldGet(this, _CSSModel_sourceMapManager, "f").detachSourceMap(header);
        this.dispatchEventToListeners(Events.StyleSheetRemoved, header);
    }
    getStyleSheetIdsForURL(url) {
        const frameIdToStyleSheetIds = __classPrivateFieldGet(this, _CSSModel_styleSheetIdsForURL, "f").get(url);
        if (!frameIdToStyleSheetIds) {
            return [];
        }
        const result = [];
        for (const styleSheetIds of frameIdToStyleSheetIds.values()) {
            result.push(...styleSheetIds);
        }
        return result;
    }
    async setStyleSheetText(styleSheetId, newText, majorChange) {
        const header = __classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").get(styleSheetId);
        if (!header) {
            return 'Unknown stylesheet in CSS.setStyleSheetText';
        }
        newText = CSSModel.trimSourceURL(newText);
        if (header.hasSourceURL) {
            newText += '\n/*# sourceURL=' + header.sourceURL + ' */';
        }
        await this.ensureOriginalStyleSheetText(styleSheetId);
        const response = await this.agent.invoke_setStyleSheetText({ styleSheetId: header.id, text: newText });
        const sourceMapURL = response.sourceMapURL;
        __classPrivateFieldGet(this, _CSSModel_sourceMapManager, "f").detachSourceMap(header);
        header.setSourceMapURL(sourceMapURL);
        __classPrivateFieldGet(this, _CSSModel_sourceMapManager, "f").attachSourceMap(header, header.sourceURL, header.sourceMapURL);
        if (sourceMapURL === null) {
            return 'Error in CSS.setStyleSheetText';
        }
        __classPrivateFieldGet(this, _CSSModel_domModel, "f").markUndoableState(!majorChange);
        this.fireStyleSheetChanged(styleSheetId);
        return null;
    }
    async getStyleSheetText(styleSheetId) {
        const response = await this.agent.invoke_getStyleSheetText({ styleSheetId });
        if (response.getError()) {
            return null;
        }
        const { text } = response;
        return text && CSSModel.trimSourceURL(text);
    }
    async onPrimaryPageChanged(event) {
        // If the main frame was restored from the back-forward cache, the order of CDP
        // is different from the regular navigations. In this case, events about CSS
        // stylesheet has already been received and they are mixed with the previous page
        // stylesheets. Therefore, we re-enable the CSS agent to get fresh events.
        // For the regular navigations, we can just clear the local data because events about
        // stylesheets will arrive later.
        if (event.data.frame.backForwardCacheDetails.restoredFromCache) {
            await this.suspendModel();
            await this.resumeModel();
        }
        else if (event.data.type !== "Activation" /* PrimaryPageChangeType.ACTIVATION */) {
            this.resetStyleSheets();
            this.resetFontFaces();
        }
    }
    resetStyleSheets() {
        const headers = [...__classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").values()];
        __classPrivateFieldGet(this, _CSSModel_styleSheetIdsForURL, "f").clear();
        __classPrivateFieldGet(this, _CSSModel_styleSheetIdToHeader, "f").clear();
        for (const header of headers) {
            __classPrivateFieldGet(this, _CSSModel_sourceMapManager, "f").detachSourceMap(header);
            this.dispatchEventToListeners(Events.StyleSheetRemoved, header);
        }
    }
    resetFontFaces() {
        __classPrivateFieldGet(this, _CSSModel_fontFaces, "f").clear();
    }
    async suspendModel() {
        __classPrivateFieldSet(this, _CSSModel_isEnabled, false, "f");
        await this.agent.invoke_disable();
        this.resetStyleSheets();
        this.resetFontFaces();
    }
    async resumeModel() {
        return await this.enable();
    }
    setEffectivePropertyValueForNode(nodeId, propertyName, value) {
        void this.agent.invoke_setEffectivePropertyValueForNode({ nodeId, propertyName, value });
    }
    cachedMatchedCascadeForNode(node) {
        if (__classPrivateFieldGet(this, _CSSModel_cachedMatchedCascadeNode, "f") !== node) {
            this.discardCachedMatchedCascade();
        }
        __classPrivateFieldSet(this, _CSSModel_cachedMatchedCascadeNode, node, "f");
        if (!__classPrivateFieldGet(this, _CSSModel_cachedMatchedCascadePromise, "f")) {
            if (node.id) {
                __classPrivateFieldSet(this, _CSSModel_cachedMatchedCascadePromise, this.getMatchedStyles(node.id), "f");
            }
            else {
                return Promise.resolve(null);
            }
        }
        return __classPrivateFieldGet(this, _CSSModel_cachedMatchedCascadePromise, "f");
    }
    discardCachedMatchedCascade() {
        __classPrivateFieldSet(this, _CSSModel_cachedMatchedCascadeNode, null, "f");
        __classPrivateFieldSet(this, _CSSModel_cachedMatchedCascadePromise, null, "f");
    }
    createCSSPropertyTracker(propertiesToTrack) {
        const cssPropertyTracker = new CSSPropertyTracker(this, propertiesToTrack);
        return cssPropertyTracker;
    }
    enableCSSPropertyTracker(cssPropertyTracker) {
        const propertiesToTrack = cssPropertyTracker.getTrackedProperties();
        if (propertiesToTrack.length === 0) {
            return;
        }
        void this.agent.invoke_trackComputedStyleUpdates({ propertiesToTrack });
        __classPrivateFieldSet(this, _CSSModel_isCSSPropertyTrackingEnabled, true, "f");
        __classPrivateFieldSet(this, _CSSModel_cssPropertyTracker, cssPropertyTracker, "f");
        void this.pollComputedStyleUpdates();
    }
    // Since we only support one tracker at a time, this call effectively disables
    // style tracking.
    disableCSSPropertyTracker() {
        __classPrivateFieldSet(this, _CSSModel_isCSSPropertyTrackingEnabled, false, "f");
        __classPrivateFieldSet(this, _CSSModel_cssPropertyTracker, null, "f");
        // Sending an empty list to the backend signals the close of style tracking
        void this.agent.invoke_trackComputedStyleUpdates({ propertiesToTrack: [] });
    }
    async pollComputedStyleUpdates() {
        if (__classPrivateFieldGet(this, _CSSModel_isTrackingRequestPending, "f")) {
            return;
        }
        if (__classPrivateFieldGet(this, _CSSModel_isCSSPropertyTrackingEnabled, "f")) {
            __classPrivateFieldSet(this, _CSSModel_isTrackingRequestPending, true, "f");
            const result = await this.agent.invoke_takeComputedStyleUpdates();
            __classPrivateFieldSet(this, _CSSModel_isTrackingRequestPending, false, "f");
            if (result.getError() || !result.nodeIds || !__classPrivateFieldGet(this, _CSSModel_isCSSPropertyTrackingEnabled, "f")) {
                return;
            }
            if (__classPrivateFieldGet(this, _CSSModel_cssPropertyTracker, "f")) {
                __classPrivateFieldGet(this, _CSSModel_cssPropertyTracker, "f").dispatchEventToListeners("TrackedCSSPropertiesUpdated" /* CSSPropertyTrackerEvents.TRACKED_CSS_PROPERTIES_UPDATED */, result.nodeIds.map(nodeId => __classPrivateFieldGet(this, _CSSModel_domModel, "f").nodeForId(nodeId)));
            }
        }
        if (__classPrivateFieldGet(this, _CSSModel_isCSSPropertyTrackingEnabled, "f")) {
            void __classPrivateFieldGet(this, _CSSModel_stylePollingThrottler, "f").schedule(this.pollComputedStyleUpdates.bind(this));
        }
    }
    dispose() {
        this.disableCSSPropertyTracker();
        super.dispose();
        this.dispatchEventToListeners(Events.ModelDisposed, this);
    }
    getAgent() {
        return this.agent;
    }
}
_CSSModel_domModel = new WeakMap(), _CSSModel_fontFaces = new WeakMap(), _CSSModel_originalStyleSheetText = new WeakMap(), _CSSModel_resourceTreeModel = new WeakMap(), _CSSModel_sourceMapManager = new WeakMap(), _CSSModel_styleLoader = new WeakMap(), _CSSModel_stylePollingThrottler = new WeakMap(), _CSSModel_styleSheetIdsForURL = new WeakMap(), _CSSModel_styleSheetIdToHeader = new WeakMap(), _CSSModel_cachedMatchedCascadeNode = new WeakMap(), _CSSModel_cachedMatchedCascadePromise = new WeakMap(), _CSSModel_cssPropertyTracker = new WeakMap(), _CSSModel_isCSSPropertyTrackingEnabled = new WeakMap(), _CSSModel_isEnabled = new WeakMap(), _CSSModel_isRuleUsageTrackingEnabled = new WeakMap(), _CSSModel_isTrackingRequestPending = new WeakMap(), _CSSModel_colorScheme = new WeakMap();
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["FontsUpdated"] = "FontsUpdated";
    Events["MediaQueryResultChanged"] = "MediaQueryResultChanged";
    Events["ModelWasEnabled"] = "ModelWasEnabled";
    Events["ModelDisposed"] = "ModelDisposed";
    Events["PseudoStateForced"] = "PseudoStateForced";
    Events["StyleSheetAdded"] = "StyleSheetAdded";
    Events["StyleSheetChanged"] = "StyleSheetChanged";
    Events["StyleSheetRemoved"] = "StyleSheetRemoved";
    Events["ComputedStyleUpdated"] = "ComputedStyleUpdated";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
const PseudoStateMarker = 'pseudo-state-marker';
export class Edit {
    constructor(styleSheetId, oldRange, newText, payload) {
        this.styleSheetId = styleSheetId;
        this.oldRange = oldRange;
        this.newRange = TextUtils.TextRange.TextRange.fromEdit(oldRange, newText);
        this.newText = newText;
        this.payload = payload;
    }
}
export class CSSLocation {
    constructor(header, lineNumber, columnNumber) {
        _CSSLocation_cssModelInternal.set(this, void 0);
        __classPrivateFieldSet(this, _CSSLocation_cssModelInternal, header.cssModel(), "f");
        this.styleSheetId = header.id;
        this.url = header.resourceURL();
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber || 0;
    }
    cssModel() {
        return __classPrivateFieldGet(this, _CSSLocation_cssModelInternal, "f");
    }
    header() {
        return __classPrivateFieldGet(this, _CSSLocation_cssModelInternal, "f").styleSheetHeaderForId(this.styleSheetId);
    }
}
_CSSLocation_cssModelInternal = new WeakMap();
class CSSDispatcher {
    constructor(cssModel) {
        _CSSDispatcher_cssModel.set(this, void 0);
        __classPrivateFieldSet(this, _CSSDispatcher_cssModel, cssModel, "f");
    }
    mediaQueryResultChanged() {
        __classPrivateFieldGet(this, _CSSDispatcher_cssModel, "f").mediaQueryResultChanged();
    }
    fontsUpdated({ font }) {
        __classPrivateFieldGet(this, _CSSDispatcher_cssModel, "f").fontsUpdated(font);
    }
    styleSheetChanged({ styleSheetId }) {
        __classPrivateFieldGet(this, _CSSDispatcher_cssModel, "f").fireStyleSheetChanged(styleSheetId);
    }
    styleSheetAdded({ header }) {
        __classPrivateFieldGet(this, _CSSDispatcher_cssModel, "f").styleSheetAdded(header);
    }
    styleSheetRemoved({ styleSheetId }) {
        __classPrivateFieldGet(this, _CSSDispatcher_cssModel, "f").styleSheetRemoved(styleSheetId);
    }
    computedStyleUpdated({ nodeId }) {
        __classPrivateFieldGet(this, _CSSDispatcher_cssModel, "f").computedStyleUpdated(nodeId);
    }
}
_CSSDispatcher_cssModel = new WeakMap();
class ComputedStyleLoader {
    constructor(cssModel) {
        _ComputedStyleLoader_cssModel.set(this, void 0);
        _ComputedStyleLoader_nodeIdToPromise.set(this, new Map());
        __classPrivateFieldSet(this, _ComputedStyleLoader_cssModel, cssModel, "f");
    }
    computedStylePromise(nodeId) {
        let promise = __classPrivateFieldGet(this, _ComputedStyleLoader_nodeIdToPromise, "f").get(nodeId);
        if (promise) {
            return promise;
        }
        promise = __classPrivateFieldGet(this, _ComputedStyleLoader_cssModel, "f").getAgent().invoke_getComputedStyleForNode({ nodeId }).then(({ computedStyle }) => {
            __classPrivateFieldGet(this, _ComputedStyleLoader_nodeIdToPromise, "f").delete(nodeId);
            if (!computedStyle?.length) {
                return null;
            }
            const result = new Map();
            for (const property of computedStyle) {
                result.set(property.name, property.value);
            }
            return result;
        });
        __classPrivateFieldGet(this, _ComputedStyleLoader_nodeIdToPromise, "f").set(nodeId, promise);
        return promise;
    }
}
_ComputedStyleLoader_cssModel = new WeakMap(), _ComputedStyleLoader_nodeIdToPromise = new WeakMap();
export class InlineStyleResult {
    constructor(inlineStyle, attributesStyle) {
        this.inlineStyle = inlineStyle;
        this.attributesStyle = attributesStyle;
    }
}
export class CSSPropertyTracker extends Common.ObjectWrapper.ObjectWrapper {
    constructor(cssModel, propertiesToTrack) {
        super();
        _CSSPropertyTracker_cssModel.set(this, void 0);
        _CSSPropertyTracker_properties.set(this, void 0);
        __classPrivateFieldSet(this, _CSSPropertyTracker_cssModel, cssModel, "f");
        __classPrivateFieldSet(this, _CSSPropertyTracker_properties, propertiesToTrack, "f");
    }
    start() {
        __classPrivateFieldGet(this, _CSSPropertyTracker_cssModel, "f").enableCSSPropertyTracker(this);
    }
    stop() {
        __classPrivateFieldGet(this, _CSSPropertyTracker_cssModel, "f").disableCSSPropertyTracker();
    }
    getTrackedProperties() {
        return __classPrivateFieldGet(this, _CSSPropertyTracker_properties, "f");
    }
}
_CSSPropertyTracker_cssModel = new WeakMap(), _CSSPropertyTracker_properties = new WeakMap();
const StylePollingInterval = 1000; // throttling interval for style polling, in milliseconds
export var CSSPropertyTrackerEvents;
(function (CSSPropertyTrackerEvents) {
    CSSPropertyTrackerEvents["TRACKED_CSS_PROPERTIES_UPDATED"] = "TrackedCSSPropertiesUpdated";
})(CSSPropertyTrackerEvents || (CSSPropertyTrackerEvents = {}));
SDKModel.register(CSSModel, { capabilities: 2 /* Capability.DOM */, autostart: true });
//# sourceMappingURL=CSSModel.js.map