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
var _SASSSourceMapping_sourceMapManager, _SASSSourceMapping_project, _SASSSourceMapping_eventListeners, _SASSSourceMapping_bindings, _Binding_project, _Binding_url, _Binding_initiator;
import * as Common from '../../core/common/common.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
import { ContentProviderBasedProject } from './ContentProviderBasedProject.js';
import { CSSWorkspaceBinding } from './CSSWorkspaceBinding.js';
import { NetworkProject } from './NetworkProject.js';
export class SASSSourceMapping {
    constructor(target, sourceMapManager, workspace) {
        _SASSSourceMapping_sourceMapManager.set(this, void 0);
        _SASSSourceMapping_project.set(this, void 0);
        _SASSSourceMapping_eventListeners.set(this, void 0);
        _SASSSourceMapping_bindings.set(this, void 0);
        __classPrivateFieldSet(this, _SASSSourceMapping_sourceMapManager, sourceMapManager, "f");
        __classPrivateFieldSet(this, _SASSSourceMapping_project, new ContentProviderBasedProject(workspace, 'cssSourceMaps:' + target.id(), Workspace.Workspace.projectTypes.Network, '', false /* isServiceProject */), "f");
        NetworkProject.setTargetForProject(__classPrivateFieldGet(this, _SASSSourceMapping_project, "f"), target);
        __classPrivateFieldSet(this, _SASSSourceMapping_bindings, new Map(), "f");
        __classPrivateFieldSet(this, _SASSSourceMapping_eventListeners, [
            __classPrivateFieldGet(this, _SASSSourceMapping_sourceMapManager, "f").addEventListener(SDK.SourceMapManager.Events.SourceMapAttached, this.sourceMapAttached, this),
            __classPrivateFieldGet(this, _SASSSourceMapping_sourceMapManager, "f").addEventListener(SDK.SourceMapManager.Events.SourceMapDetached, this.sourceMapDetached, this),
        ], "f");
    }
    sourceMapAttachedForTest(_sourceMap) {
    }
    async sourceMapAttached(event) {
        const header = event.data.client;
        const sourceMap = event.data.sourceMap;
        const project = __classPrivateFieldGet(this, _SASSSourceMapping_project, "f");
        const bindings = __classPrivateFieldGet(this, _SASSSourceMapping_bindings, "f");
        for (const sourceURL of sourceMap.sourceURLs()) {
            let binding = bindings.get(sourceURL);
            if (!binding) {
                binding = new Binding(project, sourceURL, header.createPageResourceLoadInitiator());
                bindings.set(sourceURL, binding);
            }
            binding.addSourceMap(sourceMap, header.frameId);
        }
        await CSSWorkspaceBinding.instance().updateLocations(header);
        this.sourceMapAttachedForTest(sourceMap);
    }
    async sourceMapDetached(event) {
        const header = event.data.client;
        const sourceMap = event.data.sourceMap;
        const bindings = __classPrivateFieldGet(this, _SASSSourceMapping_bindings, "f");
        for (const sourceURL of sourceMap.sourceURLs()) {
            const binding = bindings.get(sourceURL);
            if (binding) {
                binding.removeSourceMap(sourceMap, header.frameId);
                if (!binding.getUiSourceCode()) {
                    bindings.delete(sourceURL);
                }
            }
        }
        await CSSWorkspaceBinding.instance().updateLocations(header);
    }
    rawLocationToUILocation(rawLocation) {
        const header = rawLocation.header();
        if (!header) {
            return null;
        }
        const sourceMap = __classPrivateFieldGet(this, _SASSSourceMapping_sourceMapManager, "f").sourceMapForClient(header);
        if (!sourceMap) {
            return null;
        }
        let { lineNumber, columnNumber } = rawLocation;
        // If the source map maps the origin (line:0, column:0) but the CSS header is inline (in a HTML doc),
        // then adjust the line and column numbers.
        if (sourceMap.mapsOrigin() && header.isInline) {
            lineNumber -= header.startLine;
            if (lineNumber === 0) {
                columnNumber -= header.startColumn;
            }
        }
        const entry = sourceMap.findEntry(lineNumber, columnNumber);
        if (!entry || !entry.sourceURL) {
            return null;
        }
        const uiSourceCode = __classPrivateFieldGet(this, _SASSSourceMapping_project, "f").uiSourceCodeForURL(entry.sourceURL);
        if (!uiSourceCode) {
            return null;
        }
        return uiSourceCode.uiLocation(entry.sourceLineNumber, entry.sourceColumnNumber);
    }
    uiLocationToRawLocations(uiLocation) {
        // TODO(crbug.com/1153123): Revisit the `#columnNumber || 0` and also preserve `undefined` for source maps?
        const { uiSourceCode, lineNumber, columnNumber = 0 } = uiLocation;
        const binding = uiSourceCodeToBinding.get(uiSourceCode);
        if (!binding) {
            return [];
        }
        const locations = [];
        for (const sourceMap of binding.getReferringSourceMaps()) {
            const entries = sourceMap.findReverseEntries(uiSourceCode.url(), lineNumber, columnNumber);
            const header = __classPrivateFieldGet(this, _SASSSourceMapping_sourceMapManager, "f").clientForSourceMap(sourceMap);
            if (header) {
                locations.push(...entries.map(entry => new SDK.CSSModel.CSSLocation(header, entry.lineNumber, entry.columnNumber)));
            }
        }
        return locations;
    }
    static uiSourceOrigin(uiSourceCode) {
        const binding = uiSourceCodeToBinding.get(uiSourceCode);
        if (binding) {
            return binding.getReferringSourceMaps().map(sourceMap => sourceMap.compiledURL());
        }
        return [];
    }
    dispose() {
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _SASSSourceMapping_eventListeners, "f"));
        __classPrivateFieldGet(this, _SASSSourceMapping_project, "f").dispose();
    }
}
_SASSSourceMapping_sourceMapManager = new WeakMap(), _SASSSourceMapping_project = new WeakMap(), _SASSSourceMapping_eventListeners = new WeakMap(), _SASSSourceMapping_bindings = new WeakMap();
const uiSourceCodeToBinding = new WeakMap();
class Binding {
    constructor(project, url, initiator) {
        _Binding_project.set(this, void 0);
        _Binding_url.set(this, void 0);
        _Binding_initiator.set(this, void 0);
        __classPrivateFieldSet(this, _Binding_project, project, "f");
        __classPrivateFieldSet(this, _Binding_url, url, "f");
        __classPrivateFieldSet(this, _Binding_initiator, initiator, "f");
        this.referringSourceMaps = [];
        this.uiSourceCode = null;
    }
    recreateUISourceCodeIfNeeded(frameId) {
        const sourceMap = this.referringSourceMaps[this.referringSourceMaps.length - 1];
        const contentType = Common.ResourceType.resourceTypes.SourceMapStyleSheet;
        const embeddedContent = sourceMap.embeddedContentByURL(__classPrivateFieldGet(this, _Binding_url, "f"));
        const contentProvider = embeddedContent !== null ?
            TextUtils.StaticContentProvider.StaticContentProvider.fromString(__classPrivateFieldGet(this, _Binding_url, "f"), contentType, embeddedContent) :
            new SDK.CompilerSourceMappingContentProvider.CompilerSourceMappingContentProvider(__classPrivateFieldGet(this, _Binding_url, "f"), contentType, __classPrivateFieldGet(this, _Binding_initiator, "f"));
        const newUISourceCode = __classPrivateFieldGet(this, _Binding_project, "f").createUISourceCode(__classPrivateFieldGet(this, _Binding_url, "f"), contentType);
        uiSourceCodeToBinding.set(newUISourceCode, this);
        const mimeType = Common.ResourceType.ResourceType.mimeFromURL(__classPrivateFieldGet(this, _Binding_url, "f")) || contentType.canonicalMimeType();
        const metadata = typeof embeddedContent === 'string' ?
            new Workspace.UISourceCode.UISourceCodeMetadata(null, embeddedContent.length) :
            null;
        if (this.uiSourceCode) {
            NetworkProject.cloneInitialFrameAttribution(this.uiSourceCode, newUISourceCode);
            __classPrivateFieldGet(this, _Binding_project, "f").removeUISourceCode(this.uiSourceCode.url());
        }
        else {
            NetworkProject.setInitialFrameAttribution(newUISourceCode, frameId);
        }
        this.uiSourceCode = newUISourceCode;
        __classPrivateFieldGet(this, _Binding_project, "f").addUISourceCodeWithProvider(this.uiSourceCode, contentProvider, metadata, mimeType);
    }
    addSourceMap(sourceMap, frameId) {
        if (this.uiSourceCode) {
            NetworkProject.addFrameAttribution(this.uiSourceCode, frameId);
        }
        this.referringSourceMaps.push(sourceMap);
        this.recreateUISourceCodeIfNeeded(frameId);
    }
    removeSourceMap(sourceMap, frameId) {
        const uiSourceCode = this.uiSourceCode;
        NetworkProject.removeFrameAttribution(uiSourceCode, frameId);
        const lastIndex = this.referringSourceMaps.lastIndexOf(sourceMap);
        if (lastIndex !== -1) {
            this.referringSourceMaps.splice(lastIndex, 1);
        }
        if (!this.referringSourceMaps.length) {
            __classPrivateFieldGet(this, _Binding_project, "f").removeUISourceCode(uiSourceCode.url());
            this.uiSourceCode = null;
        }
        else {
            this.recreateUISourceCodeIfNeeded(frameId);
        }
    }
    getReferringSourceMaps() {
        return this.referringSourceMaps;
    }
    getUiSourceCode() {
        return this.uiSourceCode;
    }
}
_Binding_project = new WeakMap(), _Binding_url = new WeakMap(), _Binding_initiator = new WeakMap();
//# sourceMappingURL=SASSSourceMapping.js.map