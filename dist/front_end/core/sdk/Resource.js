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
var _Resource_resourceTreeModel, _Resource_requestInternal, _Resource_urlInternal, _Resource_documentURLInternal, _Resource_frameIdInternal, _Resource_loaderIdInternal, _Resource_type, _Resource_mimeTypeInternal, _Resource_isGeneratedInternal, _Resource_lastModifiedInternal, _Resource_contentSizeInternal, _Resource_parsedURLInternal, _Resource_contentData, _Resource_pendingContentData;
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import * as Platform from '../platform/platform.js';
export class Resource {
    constructor(resourceTreeModel, request, url, documentURL, frameId, loaderId, type, mimeType, lastModified, contentSize) {
        _Resource_resourceTreeModel.set(this, void 0);
        _Resource_requestInternal.set(this, void 0);
        _Resource_urlInternal.set(this, void 0);
        _Resource_documentURLInternal.set(this, void 0);
        _Resource_frameIdInternal.set(this, void 0);
        _Resource_loaderIdInternal.set(this, void 0);
        _Resource_type.set(this, void 0);
        _Resource_mimeTypeInternal.set(this, void 0);
        _Resource_isGeneratedInternal.set(this, void 0);
        _Resource_lastModifiedInternal.set(this, void 0);
        _Resource_contentSizeInternal.set(this, void 0);
        _Resource_parsedURLInternal.set(this, void 0);
        _Resource_contentData.set(this, null);
        /**
         * There is always at most one CDP "getResourceContent" call in-flight. But once it's done
         * we'll hit the backend again in case we failed.
         */
        _Resource_pendingContentData.set(this, null);
        __classPrivateFieldSet(this, _Resource_resourceTreeModel, resourceTreeModel, "f");
        __classPrivateFieldSet(this, _Resource_requestInternal, request, "f");
        this.url = url;
        __classPrivateFieldSet(this, _Resource_documentURLInternal, documentURL, "f");
        __classPrivateFieldSet(this, _Resource_frameIdInternal, frameId, "f");
        __classPrivateFieldSet(this, _Resource_loaderIdInternal, loaderId, "f");
        __classPrivateFieldSet(this, _Resource_type, type || Common.ResourceType.resourceTypes.Other, "f");
        __classPrivateFieldSet(this, _Resource_mimeTypeInternal, mimeType, "f");
        __classPrivateFieldSet(this, _Resource_isGeneratedInternal, false, "f");
        __classPrivateFieldSet(this, _Resource_lastModifiedInternal, lastModified && Platform.DateUtilities.isValid(lastModified) ? lastModified : null, "f");
        __classPrivateFieldSet(this, _Resource_contentSizeInternal, contentSize, "f");
    }
    lastModified() {
        if (__classPrivateFieldGet(this, _Resource_lastModifiedInternal, "f") || !__classPrivateFieldGet(this, _Resource_requestInternal, "f")) {
            return __classPrivateFieldGet(this, _Resource_lastModifiedInternal, "f");
        }
        const lastModifiedHeader = __classPrivateFieldGet(this, _Resource_requestInternal, "f").responseLastModified();
        const date = lastModifiedHeader ? new Date(lastModifiedHeader) : null;
        __classPrivateFieldSet(this, _Resource_lastModifiedInternal, date && Platform.DateUtilities.isValid(date) ? date : null, "f");
        return __classPrivateFieldGet(this, _Resource_lastModifiedInternal, "f");
    }
    contentSize() {
        if (typeof __classPrivateFieldGet(this, _Resource_contentSizeInternal, "f") === 'number' || !__classPrivateFieldGet(this, _Resource_requestInternal, "f")) {
            return __classPrivateFieldGet(this, _Resource_contentSizeInternal, "f");
        }
        return __classPrivateFieldGet(this, _Resource_requestInternal, "f").resourceSize;
    }
    get request() {
        return __classPrivateFieldGet(this, _Resource_requestInternal, "f");
    }
    get url() {
        return __classPrivateFieldGet(this, _Resource_urlInternal, "f");
    }
    set url(x) {
        __classPrivateFieldSet(this, _Resource_urlInternal, x, "f");
        __classPrivateFieldSet(this, _Resource_parsedURLInternal, new Common.ParsedURL.ParsedURL(x), "f");
    }
    get parsedURL() {
        return __classPrivateFieldGet(this, _Resource_parsedURLInternal, "f");
    }
    get documentURL() {
        return __classPrivateFieldGet(this, _Resource_documentURLInternal, "f");
    }
    get frameId() {
        return __classPrivateFieldGet(this, _Resource_frameIdInternal, "f");
    }
    get loaderId() {
        return __classPrivateFieldGet(this, _Resource_loaderIdInternal, "f");
    }
    get displayName() {
        return __classPrivateFieldGet(this, _Resource_parsedURLInternal, "f") ? __classPrivateFieldGet(this, _Resource_parsedURLInternal, "f").displayName : '';
    }
    resourceType() {
        return __classPrivateFieldGet(this, _Resource_requestInternal, "f") ? __classPrivateFieldGet(this, _Resource_requestInternal, "f").resourceType() : __classPrivateFieldGet(this, _Resource_type, "f");
    }
    get mimeType() {
        return __classPrivateFieldGet(this, _Resource_requestInternal, "f") ? __classPrivateFieldGet(this, _Resource_requestInternal, "f").mimeType : __classPrivateFieldGet(this, _Resource_mimeTypeInternal, "f");
    }
    get content() {
        if (__classPrivateFieldGet(this, _Resource_contentData, "f")?.isTextContent) {
            return __classPrivateFieldGet(this, _Resource_contentData, "f").text;
        }
        return __classPrivateFieldGet(this, _Resource_contentData, "f")?.base64 ?? null;
    }
    get isGenerated() {
        return __classPrivateFieldGet(this, _Resource_isGeneratedInternal, "f");
    }
    set isGenerated(val) {
        __classPrivateFieldSet(this, _Resource_isGeneratedInternal, val, "f");
    }
    contentURL() {
        return __classPrivateFieldGet(this, _Resource_urlInternal, "f");
    }
    contentType() {
        if (this.resourceType() === Common.ResourceType.resourceTypes.Document &&
            this.mimeType.indexOf('javascript') !== -1) {
            return Common.ResourceType.resourceTypes.Script;
        }
        return this.resourceType();
    }
    async requestContentData() {
        if (__classPrivateFieldGet(this, _Resource_contentData, "f")) {
            return __classPrivateFieldGet(this, _Resource_contentData, "f");
        }
        if (__classPrivateFieldGet(this, _Resource_pendingContentData, "f")) {
            return await __classPrivateFieldGet(this, _Resource_pendingContentData, "f");
        }
        __classPrivateFieldSet(this, _Resource_pendingContentData, this.innerRequestContent().then(contentData => {
            // If an error happended we don't set `this.#contentData` so future `requestContentData` will
            // attempt again to hit the backend for this Resource.
            if (!TextUtils.ContentData.ContentData.isError(contentData)) {
                __classPrivateFieldSet(this, _Resource_contentData, contentData, "f");
            }
            __classPrivateFieldSet(this, _Resource_pendingContentData, null, "f");
            return contentData;
        }), "f");
        return await __classPrivateFieldGet(this, _Resource_pendingContentData, "f");
    }
    canonicalMimeType() {
        return this.contentType().canonicalMimeType() || this.mimeType;
    }
    async searchInContent(query, caseSensitive, isRegex) {
        if (!this.frameId) {
            return [];
        }
        if (this.request) {
            return await this.request.searchInContent(query, caseSensitive, isRegex);
        }
        const result = await __classPrivateFieldGet(this, _Resource_resourceTreeModel, "f").target().pageAgent().invoke_searchInResource({ frameId: this.frameId, url: this.url, query, caseSensitive, isRegex });
        return TextUtils.TextUtils.performSearchInSearchMatches(result.result || [], query, caseSensitive, isRegex);
    }
    async populateImageSource(image) {
        const contentData = await this.requestContentData();
        if (TextUtils.ContentData.ContentData.isError(contentData)) {
            return;
        }
        image.src = contentData.asDataUrl() ?? __classPrivateFieldGet(this, _Resource_urlInternal, "f");
    }
    async innerRequestContent() {
        if (this.request) {
            // The `contentData` promise only resolves once the request is done.
            return await this.request.requestContentData();
        }
        const response = await __classPrivateFieldGet(this, _Resource_resourceTreeModel, "f").target().pageAgent().invoke_getResourceContent({ frameId: this.frameId, url: this.url });
        const error = response.getError();
        if (error) {
            return { error };
        }
        return new TextUtils.ContentData.ContentData(response.content, response.base64Encoded, this.mimeType);
    }
    frame() {
        return __classPrivateFieldGet(this, _Resource_frameIdInternal, "f") ? __classPrivateFieldGet(this, _Resource_resourceTreeModel, "f").frameForId(__classPrivateFieldGet(this, _Resource_frameIdInternal, "f")) : null;
    }
    statusCode() {
        return __classPrivateFieldGet(this, _Resource_requestInternal, "f") ? __classPrivateFieldGet(this, _Resource_requestInternal, "f").statusCode : 0;
    }
}
_Resource_resourceTreeModel = new WeakMap(), _Resource_requestInternal = new WeakMap(), _Resource_urlInternal = new WeakMap(), _Resource_documentURLInternal = new WeakMap(), _Resource_frameIdInternal = new WeakMap(), _Resource_loaderIdInternal = new WeakMap(), _Resource_type = new WeakMap(), _Resource_mimeTypeInternal = new WeakMap(), _Resource_isGeneratedInternal = new WeakMap(), _Resource_lastModifiedInternal = new WeakMap(), _Resource_contentSizeInternal = new WeakMap(), _Resource_parsedURLInternal = new WeakMap(), _Resource_contentData = new WeakMap(), _Resource_pendingContentData = new WeakMap();
//# sourceMappingURL=Resource.js.map