// Copyright 2014 The Chromium Authors. All rights reserved.
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
var _CSSWorkspaceBinding_resourceMapping, _CSSWorkspaceBinding_modelToInfo, _CSSWorkspaceBinding_liveLocationPromises, _ModelInfo_eventListeners, _ModelInfo_resourceMapping, _ModelInfo_stylesSourceMapping, _ModelInfo_sassSourceMapping, _ModelInfo_locations, _ModelInfo_unboundLocations, _LiveLocation_lineNumber, _LiveLocation_columnNumber, _LiveLocation_info;
import * as Common from '../../core/common/common.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import { LiveLocationWithPool, } from './LiveLocation.js';
import { SASSSourceMapping } from './SASSSourceMapping.js';
import { StylesSourceMapping } from './StylesSourceMapping.js';
let cssWorkspaceBindingInstance;
export class CSSWorkspaceBinding {
    constructor(resourceMapping, targetManager) {
        _CSSWorkspaceBinding_resourceMapping.set(this, void 0);
        _CSSWorkspaceBinding_modelToInfo.set(this, void 0);
        _CSSWorkspaceBinding_liveLocationPromises.set(this, void 0);
        __classPrivateFieldSet(this, _CSSWorkspaceBinding_resourceMapping, resourceMapping, "f");
        __classPrivateFieldSet(this, _CSSWorkspaceBinding_modelToInfo, new Map(), "f");
        targetManager.observeModels(SDK.CSSModel.CSSModel, this);
        __classPrivateFieldSet(this, _CSSWorkspaceBinding_liveLocationPromises, new Set(), "f");
    }
    static instance(opts = { forceNew: null, resourceMapping: null, targetManager: null }) {
        const { forceNew, resourceMapping, targetManager } = opts;
        if (!cssWorkspaceBindingInstance || forceNew) {
            if (!resourceMapping || !targetManager) {
                throw new Error(`Unable to create CSSWorkspaceBinding: resourceMapping and targetManager must be provided: ${new Error().stack}`);
            }
            cssWorkspaceBindingInstance = new CSSWorkspaceBinding(resourceMapping, targetManager);
        }
        return cssWorkspaceBindingInstance;
    }
    static removeInstance() {
        cssWorkspaceBindingInstance = undefined;
    }
    get modelToInfo() {
        return __classPrivateFieldGet(this, _CSSWorkspaceBinding_modelToInfo, "f");
    }
    getCSSModelInfo(cssModel) {
        return __classPrivateFieldGet(this, _CSSWorkspaceBinding_modelToInfo, "f").get(cssModel);
    }
    modelAdded(cssModel) {
        __classPrivateFieldGet(this, _CSSWorkspaceBinding_modelToInfo, "f").set(cssModel, new ModelInfo(cssModel, __classPrivateFieldGet(this, _CSSWorkspaceBinding_resourceMapping, "f")));
    }
    modelRemoved(cssModel) {
        this.getCSSModelInfo(cssModel).dispose();
        __classPrivateFieldGet(this, _CSSWorkspaceBinding_modelToInfo, "f").delete(cssModel);
    }
    /**
     * The promise returned by this function is resolved once all *currently*
     * pending LiveLocations are processed.
     */
    async pendingLiveLocationChangesPromise() {
        await Promise.all(__classPrivateFieldGet(this, _CSSWorkspaceBinding_liveLocationPromises, "f"));
    }
    recordLiveLocationChange(promise) {
        void promise.then(() => {
            __classPrivateFieldGet(this, _CSSWorkspaceBinding_liveLocationPromises, "f").delete(promise);
        });
        __classPrivateFieldGet(this, _CSSWorkspaceBinding_liveLocationPromises, "f").add(promise);
    }
    async updateLocations(header) {
        const updatePromise = this.getCSSModelInfo(header.cssModel()).updateLocations(header);
        this.recordLiveLocationChange(updatePromise);
        await updatePromise;
    }
    createLiveLocation(rawLocation, updateDelegate, locationPool) {
        const locationPromise = this.getCSSModelInfo(rawLocation.cssModel()).createLiveLocation(rawLocation, updateDelegate, locationPool);
        this.recordLiveLocationChange(locationPromise);
        return locationPromise;
    }
    propertyRawLocation(cssProperty, forName) {
        const style = cssProperty.ownerStyle;
        if (!style || style.type !== SDK.CSSStyleDeclaration.Type.Regular || !style.styleSheetId) {
            return null;
        }
        const header = style.cssModel().styleSheetHeaderForId(style.styleSheetId);
        if (!header) {
            return null;
        }
        const range = forName ? cssProperty.nameRange() : cssProperty.valueRange();
        if (!range) {
            return null;
        }
        const lineNumber = range.startLine;
        const columnNumber = range.startColumn;
        return new SDK.CSSModel.CSSLocation(header, header.lineNumberInSource(lineNumber), header.columnNumberInSource(lineNumber, columnNumber));
    }
    propertyUILocation(cssProperty, forName) {
        const rawLocation = this.propertyRawLocation(cssProperty, forName);
        if (!rawLocation) {
            return null;
        }
        return this.rawLocationToUILocation(rawLocation);
    }
    rawLocationToUILocation(rawLocation) {
        return this.getCSSModelInfo(rawLocation.cssModel()).rawLocationToUILocation(rawLocation);
    }
    uiLocationToRawLocations(uiLocation) {
        const rawLocations = [];
        for (const modelInfo of __classPrivateFieldGet(this, _CSSWorkspaceBinding_modelToInfo, "f").values()) {
            rawLocations.push(...modelInfo.uiLocationToRawLocations(uiLocation));
        }
        return rawLocations;
    }
}
_CSSWorkspaceBinding_resourceMapping = new WeakMap(), _CSSWorkspaceBinding_modelToInfo = new WeakMap(), _CSSWorkspaceBinding_liveLocationPromises = new WeakMap();
export class ModelInfo {
    constructor(cssModel, resourceMapping) {
        _ModelInfo_eventListeners.set(this, void 0);
        _ModelInfo_resourceMapping.set(this, void 0);
        _ModelInfo_stylesSourceMapping.set(this, void 0);
        _ModelInfo_sassSourceMapping.set(this, void 0);
        _ModelInfo_locations.set(this, void 0);
        _ModelInfo_unboundLocations.set(this, void 0);
        __classPrivateFieldSet(this, _ModelInfo_eventListeners, [
            cssModel.addEventListener(SDK.CSSModel.Events.StyleSheetAdded, event => {
                void this.styleSheetAdded(event);
            }, this),
            cssModel.addEventListener(SDK.CSSModel.Events.StyleSheetRemoved, event => {
                void this.styleSheetRemoved(event);
            }, this),
        ], "f");
        __classPrivateFieldSet(this, _ModelInfo_resourceMapping, resourceMapping, "f");
        __classPrivateFieldSet(this, _ModelInfo_stylesSourceMapping, new StylesSourceMapping(cssModel, resourceMapping.workspace), "f");
        const sourceMapManager = cssModel.sourceMapManager();
        __classPrivateFieldSet(this, _ModelInfo_sassSourceMapping, new SASSSourceMapping(cssModel.target(), sourceMapManager, resourceMapping.workspace), "f");
        __classPrivateFieldSet(this, _ModelInfo_locations, new Platform.MapUtilities.Multimap(), "f");
        __classPrivateFieldSet(this, _ModelInfo_unboundLocations, new Platform.MapUtilities.Multimap(), "f");
    }
    get locations() {
        return __classPrivateFieldGet(this, _ModelInfo_locations, "f");
    }
    async createLiveLocation(rawLocation, updateDelegate, locationPool) {
        const location = new LiveLocation(rawLocation, this, updateDelegate, locationPool);
        const header = rawLocation.header();
        if (header) {
            location.setHeader(header);
            __classPrivateFieldGet(this, _ModelInfo_locations, "f").set(header, location);
            await location.update();
        }
        else {
            __classPrivateFieldGet(this, _ModelInfo_unboundLocations, "f").set(rawLocation.url, location);
        }
        return location;
    }
    disposeLocation(location) {
        const header = location.header();
        if (header) {
            __classPrivateFieldGet(this, _ModelInfo_locations, "f").delete(header, location);
        }
        else {
            __classPrivateFieldGet(this, _ModelInfo_unboundLocations, "f").delete(location.url, location);
        }
    }
    updateLocations(header) {
        const promises = [];
        for (const location of __classPrivateFieldGet(this, _ModelInfo_locations, "f").get(header)) {
            promises.push(location.update());
        }
        return Promise.all(promises);
    }
    async styleSheetAdded(event) {
        const header = event.data;
        if (!header.sourceURL) {
            return;
        }
        const promises = [];
        for (const location of __classPrivateFieldGet(this, _ModelInfo_unboundLocations, "f").get(header.sourceURL)) {
            location.setHeader(header);
            __classPrivateFieldGet(this, _ModelInfo_locations, "f").set(header, location);
            promises.push(location.update());
        }
        await Promise.all(promises);
        __classPrivateFieldGet(this, _ModelInfo_unboundLocations, "f").deleteAll(header.sourceURL);
    }
    async styleSheetRemoved(event) {
        const header = event.data;
        const promises = [];
        for (const location of __classPrivateFieldGet(this, _ModelInfo_locations, "f").get(header)) {
            location.setHeader(header);
            __classPrivateFieldGet(this, _ModelInfo_unboundLocations, "f").set(location.url, location);
            promises.push(location.update());
        }
        await Promise.all(promises);
        __classPrivateFieldGet(this, _ModelInfo_locations, "f").deleteAll(header);
    }
    addSourceMap(sourceUrl, sourceMapUrl) {
        __classPrivateFieldGet(this, _ModelInfo_stylesSourceMapping, "f").addSourceMap(sourceUrl, sourceMapUrl);
    }
    rawLocationToUILocation(rawLocation) {
        let uiLocation = null;
        uiLocation = uiLocation || __classPrivateFieldGet(this, _ModelInfo_sassSourceMapping, "f").rawLocationToUILocation(rawLocation);
        uiLocation = uiLocation || __classPrivateFieldGet(this, _ModelInfo_stylesSourceMapping, "f").rawLocationToUILocation(rawLocation);
        uiLocation = uiLocation || __classPrivateFieldGet(this, _ModelInfo_resourceMapping, "f").cssLocationToUILocation(rawLocation);
        return uiLocation;
    }
    uiLocationToRawLocations(uiLocation) {
        let rawLocations = __classPrivateFieldGet(this, _ModelInfo_sassSourceMapping, "f").uiLocationToRawLocations(uiLocation);
        if (rawLocations.length) {
            return rawLocations;
        }
        rawLocations = __classPrivateFieldGet(this, _ModelInfo_stylesSourceMapping, "f").uiLocationToRawLocations(uiLocation);
        if (rawLocations.length) {
            return rawLocations;
        }
        return __classPrivateFieldGet(this, _ModelInfo_resourceMapping, "f").uiLocationToCSSLocations(uiLocation);
    }
    dispose() {
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _ModelInfo_eventListeners, "f"));
        __classPrivateFieldGet(this, _ModelInfo_stylesSourceMapping, "f").dispose();
        __classPrivateFieldGet(this, _ModelInfo_sassSourceMapping, "f").dispose();
    }
}
_ModelInfo_eventListeners = new WeakMap(), _ModelInfo_resourceMapping = new WeakMap(), _ModelInfo_stylesSourceMapping = new WeakMap(), _ModelInfo_sassSourceMapping = new WeakMap(), _ModelInfo_locations = new WeakMap(), _ModelInfo_unboundLocations = new WeakMap();
export class LiveLocation extends LiveLocationWithPool {
    constructor(rawLocation, info, updateDelegate, locationPool) {
        super(updateDelegate, locationPool);
        _LiveLocation_lineNumber.set(this, void 0);
        _LiveLocation_columnNumber.set(this, void 0);
        _LiveLocation_info.set(this, void 0);
        this.url = rawLocation.url;
        __classPrivateFieldSet(this, _LiveLocation_lineNumber, rawLocation.lineNumber, "f");
        __classPrivateFieldSet(this, _LiveLocation_columnNumber, rawLocation.columnNumber, "f");
        __classPrivateFieldSet(this, _LiveLocation_info, info, "f");
        this.headerInternal = null;
    }
    header() {
        return this.headerInternal;
    }
    setHeader(header) {
        this.headerInternal = header;
    }
    async uiLocation() {
        if (!this.headerInternal) {
            return null;
        }
        const rawLocation = new SDK.CSSModel.CSSLocation(this.headerInternal, __classPrivateFieldGet(this, _LiveLocation_lineNumber, "f"), __classPrivateFieldGet(this, _LiveLocation_columnNumber, "f"));
        return CSSWorkspaceBinding.instance().rawLocationToUILocation(rawLocation);
    }
    dispose() {
        super.dispose();
        __classPrivateFieldGet(this, _LiveLocation_info, "f").disposeLocation(this);
    }
    async isIgnoreListed() {
        return false;
    }
}
_LiveLocation_lineNumber = new WeakMap(), _LiveLocation_columnNumber = new WeakMap(), _LiveLocation_info = new WeakMap();
//# sourceMappingURL=CSSWorkspaceBinding.js.map