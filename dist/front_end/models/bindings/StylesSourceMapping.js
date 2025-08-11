/*
 * Copyright (C) 2012 Google Inc. All rights reserved.
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
var _StylesSourceMapping_cssModel, _StylesSourceMapping_project, _StylesSourceMapping_styleFiles, _StylesSourceMapping_eventListeners, _StyleFile_instances, _StyleFile_cssModel, _StyleFile_project, _StyleFile_eventListeners, _StyleFile_throttler, _StyleFile_terminated, _StyleFile_isAddingRevision, _StyleFile_isUpdatingHeaders, _StyleFile_firstHeader;
import * as Common from '../../core/common/common.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
import { ContentProviderBasedProject } from './ContentProviderBasedProject.js';
import { NetworkProject } from './NetworkProject.js';
import { metadataForURL } from './ResourceUtils.js';
const uiSourceCodeToStyleMap = new WeakMap();
export class StylesSourceMapping {
    constructor(cssModel, workspace) {
        _StylesSourceMapping_cssModel.set(this, void 0);
        _StylesSourceMapping_project.set(this, void 0);
        _StylesSourceMapping_styleFiles.set(this, new Map());
        _StylesSourceMapping_eventListeners.set(this, void 0);
        __classPrivateFieldSet(this, _StylesSourceMapping_cssModel, cssModel, "f");
        const target = __classPrivateFieldGet(this, _StylesSourceMapping_cssModel, "f").target();
        __classPrivateFieldSet(this, _StylesSourceMapping_project, new ContentProviderBasedProject(workspace, 'css:' + target.id(), Workspace.Workspace.projectTypes.Network, '', false /* isServiceProject */), "f");
        NetworkProject.setTargetForProject(__classPrivateFieldGet(this, _StylesSourceMapping_project, "f"), target);
        __classPrivateFieldSet(this, _StylesSourceMapping_eventListeners, [
            __classPrivateFieldGet(this, _StylesSourceMapping_cssModel, "f").addEventListener(SDK.CSSModel.Events.StyleSheetAdded, this.styleSheetAdded, this),
            __classPrivateFieldGet(this, _StylesSourceMapping_cssModel, "f").addEventListener(SDK.CSSModel.Events.StyleSheetRemoved, this.styleSheetRemoved, this),
            __classPrivateFieldGet(this, _StylesSourceMapping_cssModel, "f").addEventListener(SDK.CSSModel.Events.StyleSheetChanged, this.styleSheetChanged, this),
        ], "f");
    }
    addSourceMap(sourceUrl, sourceMapUrl) {
        __classPrivateFieldGet(this, _StylesSourceMapping_styleFiles, "f").get(sourceUrl)?.addSourceMap(sourceUrl, sourceMapUrl);
    }
    rawLocationToUILocation(rawLocation) {
        const header = rawLocation.header();
        if (!header || !this.acceptsHeader(header)) {
            return null;
        }
        const styleFile = __classPrivateFieldGet(this, _StylesSourceMapping_styleFiles, "f").get(header.resourceURL());
        if (!styleFile) {
            return null;
        }
        let lineNumber = rawLocation.lineNumber;
        let columnNumber = rawLocation.columnNumber;
        if (header.isInline && header.hasSourceURL) {
            lineNumber -= header.lineNumberInSource(0);
            const headerColumnNumber = header.columnNumberInSource(lineNumber, 0);
            if (typeof headerColumnNumber === 'undefined') {
                columnNumber = headerColumnNumber;
            }
            else {
                columnNumber -= headerColumnNumber;
            }
        }
        return styleFile.getUiSourceCode().uiLocation(lineNumber, columnNumber);
    }
    uiLocationToRawLocations(uiLocation) {
        const styleFile = uiSourceCodeToStyleMap.get(uiLocation.uiSourceCode);
        if (!styleFile) {
            return [];
        }
        const rawLocations = [];
        for (const header of styleFile.getHeaders()) {
            let lineNumber = uiLocation.lineNumber;
            let columnNumber = uiLocation.columnNumber;
            if (header.isInline && header.hasSourceURL) {
                // TODO(crbug.com/1153123): Revisit the `#columnNumber || 0` and also preserve `undefined` for source maps?
                columnNumber = header.columnNumberInSource(lineNumber, uiLocation.columnNumber || 0);
                lineNumber = header.lineNumberInSource(lineNumber);
            }
            rawLocations.push(new SDK.CSSModel.CSSLocation(header, lineNumber, columnNumber));
        }
        return rawLocations;
    }
    acceptsHeader(header) {
        if (header.isConstructedByNew()) {
            return false;
        }
        if (header.isInline && !header.hasSourceURL && header.origin !== 'inspector') {
            return false;
        }
        if (!header.resourceURL()) {
            return false;
        }
        return true;
    }
    styleSheetAdded(event) {
        const header = event.data;
        if (!this.acceptsHeader(header)) {
            return;
        }
        const url = header.resourceURL();
        let styleFile = __classPrivateFieldGet(this, _StylesSourceMapping_styleFiles, "f").get(url);
        if (!styleFile) {
            styleFile = new StyleFile(__classPrivateFieldGet(this, _StylesSourceMapping_cssModel, "f"), __classPrivateFieldGet(this, _StylesSourceMapping_project, "f"), header);
            __classPrivateFieldGet(this, _StylesSourceMapping_styleFiles, "f").set(url, styleFile);
        }
        else {
            styleFile.addHeader(header);
        }
    }
    styleSheetRemoved(event) {
        const header = event.data;
        if (!this.acceptsHeader(header)) {
            return;
        }
        const url = header.resourceURL();
        const styleFile = __classPrivateFieldGet(this, _StylesSourceMapping_styleFiles, "f").get(url);
        if (styleFile) {
            if (styleFile.getHeaders().size === 1) {
                styleFile.dispose();
                __classPrivateFieldGet(this, _StylesSourceMapping_styleFiles, "f").delete(url);
            }
            else {
                styleFile.removeHeader(header);
            }
        }
    }
    styleSheetChanged(event) {
        const header = __classPrivateFieldGet(this, _StylesSourceMapping_cssModel, "f").styleSheetHeaderForId(event.data.styleSheetId);
        if (!header || !this.acceptsHeader(header)) {
            return;
        }
        const styleFile = __classPrivateFieldGet(this, _StylesSourceMapping_styleFiles, "f").get(header.resourceURL());
        if (styleFile) {
            styleFile.styleSheetChanged(header);
        }
    }
    dispose() {
        for (const styleFile of __classPrivateFieldGet(this, _StylesSourceMapping_styleFiles, "f").values()) {
            styleFile.dispose();
        }
        __classPrivateFieldGet(this, _StylesSourceMapping_styleFiles, "f").clear();
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _StylesSourceMapping_eventListeners, "f"));
        __classPrivateFieldGet(this, _StylesSourceMapping_project, "f").removeProject();
    }
}
_StylesSourceMapping_cssModel = new WeakMap(), _StylesSourceMapping_project = new WeakMap(), _StylesSourceMapping_styleFiles = new WeakMap(), _StylesSourceMapping_eventListeners = new WeakMap();
export class StyleFile {
    constructor(cssModel, project, header) {
        _StyleFile_instances.add(this);
        _StyleFile_cssModel.set(this, void 0);
        _StyleFile_project.set(this, void 0);
        _StyleFile_eventListeners.set(this, void 0);
        _StyleFile_throttler.set(this, new Common.Throttler.Throttler(200));
        _StyleFile_terminated.set(this, false);
        _StyleFile_isAddingRevision.set(this, void 0);
        _StyleFile_isUpdatingHeaders.set(this, void 0);
        __classPrivateFieldSet(this, _StyleFile_cssModel, cssModel, "f");
        __classPrivateFieldSet(this, _StyleFile_project, project, "f");
        this.headers = new Set([header]);
        const target = cssModel.target();
        const url = header.resourceURL();
        const metadata = metadataForURL(target, header.frameId, url);
        this.uiSourceCode = __classPrivateFieldGet(this, _StyleFile_project, "f").createUISourceCode(url, header.contentType());
        uiSourceCodeToStyleMap.set(this.uiSourceCode, this);
        NetworkProject.setInitialFrameAttribution(this.uiSourceCode, header.frameId);
        __classPrivateFieldGet(this, _StyleFile_project, "f").addUISourceCodeWithProvider(this.uiSourceCode, this, metadata, 'text/css');
        __classPrivateFieldSet(this, _StyleFile_eventListeners, [
            this.uiSourceCode.addEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged, this.workingCopyChanged, this),
            this.uiSourceCode.addEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, this.workingCopyCommitted, this),
        ], "f");
    }
    addHeader(header) {
        this.headers.add(header);
        NetworkProject.addFrameAttribution(this.uiSourceCode, header.frameId);
    }
    removeHeader(header) {
        this.headers.delete(header);
        NetworkProject.removeFrameAttribution(this.uiSourceCode, header.frameId);
    }
    styleSheetChanged(header) {
        console.assert(this.headers.has(header));
        if (__classPrivateFieldGet(this, _StyleFile_isUpdatingHeaders, "f") || !this.headers.has(header)) {
            return;
        }
        const mirrorContentBound = this.mirrorContent.bind(this, header, true /* majorChange */);
        void __classPrivateFieldGet(this, _StyleFile_throttler, "f").schedule(mirrorContentBound, "Default" /* Common.Throttler.Scheduling.DEFAULT */);
    }
    workingCopyCommitted() {
        if (__classPrivateFieldGet(this, _StyleFile_isAddingRevision, "f")) {
            return;
        }
        const mirrorContentBound = this.mirrorContent.bind(this, this.uiSourceCode, true /* majorChange */);
        void __classPrivateFieldGet(this, _StyleFile_throttler, "f").schedule(mirrorContentBound, "AsSoonAsPossible" /* Common.Throttler.Scheduling.AS_SOON_AS_POSSIBLE */);
    }
    workingCopyChanged() {
        if (__classPrivateFieldGet(this, _StyleFile_isAddingRevision, "f")) {
            return;
        }
        const mirrorContentBound = this.mirrorContent.bind(this, this.uiSourceCode, false /* majorChange */);
        void __classPrivateFieldGet(this, _StyleFile_throttler, "f").schedule(mirrorContentBound, "Default" /* Common.Throttler.Scheduling.DEFAULT */);
    }
    async mirrorContent(fromProvider, majorChange) {
        if (__classPrivateFieldGet(this, _StyleFile_terminated, "f")) {
            this.styleFileSyncedForTest();
            return;
        }
        let newContent = null;
        if (fromProvider === this.uiSourceCode) {
            newContent = this.uiSourceCode.workingCopy();
        }
        else {
            newContent = TextUtils.ContentData.ContentData.textOr(await fromProvider.requestContentData(), null);
        }
        if (newContent === null || __classPrivateFieldGet(this, _StyleFile_terminated, "f")) {
            this.styleFileSyncedForTest();
            return;
        }
        if (fromProvider !== this.uiSourceCode) {
            __classPrivateFieldSet(this, _StyleFile_isAddingRevision, true, "f");
            this.uiSourceCode.setWorkingCopy(newContent);
            __classPrivateFieldSet(this, _StyleFile_isAddingRevision, false, "f");
        }
        __classPrivateFieldSet(this, _StyleFile_isUpdatingHeaders, true, "f");
        const promises = [];
        for (const header of this.headers) {
            if (header === fromProvider) {
                continue;
            }
            promises.push(__classPrivateFieldGet(this, _StyleFile_cssModel, "f").setStyleSheetText(header.id, newContent, majorChange));
        }
        // ------ ASYNC ------
        await Promise.all(promises);
        __classPrivateFieldSet(this, _StyleFile_isUpdatingHeaders, false, "f");
        this.styleFileSyncedForTest();
    }
    styleFileSyncedForTest() {
    }
    dispose() {
        if (__classPrivateFieldGet(this, _StyleFile_terminated, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _StyleFile_terminated, true, "f");
        __classPrivateFieldGet(this, _StyleFile_project, "f").removeUISourceCode(this.uiSourceCode.url());
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _StyleFile_eventListeners, "f"));
    }
    contentURL() {
        console.assert(this.headers.size > 0);
        return __classPrivateFieldGet(this, _StyleFile_instances, "m", _StyleFile_firstHeader).call(this).originalContentProvider().contentURL();
    }
    contentType() {
        console.assert(this.headers.size > 0);
        return __classPrivateFieldGet(this, _StyleFile_instances, "m", _StyleFile_firstHeader).call(this).originalContentProvider().contentType();
    }
    requestContentData() {
        console.assert(this.headers.size > 0);
        return __classPrivateFieldGet(this, _StyleFile_instances, "m", _StyleFile_firstHeader).call(this).originalContentProvider().requestContentData();
    }
    searchInContent(query, caseSensitive, isRegex) {
        console.assert(this.headers.size > 0);
        return __classPrivateFieldGet(this, _StyleFile_instances, "m", _StyleFile_firstHeader).call(this).originalContentProvider().searchInContent(query, caseSensitive, isRegex);
    }
    getHeaders() {
        return this.headers;
    }
    getUiSourceCode() {
        return this.uiSourceCode;
    }
    addSourceMap(sourceUrl, sourceMapUrl) {
        const sourceMapManager = __classPrivateFieldGet(this, _StyleFile_cssModel, "f").sourceMapManager();
        this.headers.forEach(header => {
            sourceMapManager.detachSourceMap(header);
            sourceMapManager.attachSourceMap(header, sourceUrl, sourceMapUrl);
        });
    }
}
_StyleFile_cssModel = new WeakMap(), _StyleFile_project = new WeakMap(), _StyleFile_eventListeners = new WeakMap(), _StyleFile_throttler = new WeakMap(), _StyleFile_terminated = new WeakMap(), _StyleFile_isAddingRevision = new WeakMap(), _StyleFile_isUpdatingHeaders = new WeakMap(), _StyleFile_instances = new WeakSet(), _StyleFile_firstHeader = function _StyleFile_firstHeader() {
    console.assert(this.headers.size > 0);
    return this.headers.values().next().value;
};
//# sourceMappingURL=StylesSourceMapping.js.map