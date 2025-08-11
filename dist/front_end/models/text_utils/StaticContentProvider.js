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
var _StaticContentProvider_contentURL, _StaticContentProvider_contentType, _StaticContentProvider_lazyContent;
import { ContentData } from './ContentData.js';
import { performSearchInContentData } from './TextUtils.js';
export class StaticContentProvider {
    constructor(contentURL, contentType, lazyContent) {
        _StaticContentProvider_contentURL.set(this, void 0);
        _StaticContentProvider_contentType.set(this, void 0);
        _StaticContentProvider_lazyContent.set(this, void 0);
        __classPrivateFieldSet(this, _StaticContentProvider_contentURL, contentURL, "f");
        __classPrivateFieldSet(this, _StaticContentProvider_contentType, contentType, "f");
        __classPrivateFieldSet(this, _StaticContentProvider_lazyContent, lazyContent, "f");
    }
    static fromString(contentURL, contentType, content) {
        const lazyContent = () => Promise.resolve(new ContentData(content, /* isBase64 */ false, contentType.canonicalMimeType()));
        return new StaticContentProvider(contentURL, contentType, lazyContent);
    }
    contentURL() {
        return __classPrivateFieldGet(this, _StaticContentProvider_contentURL, "f");
    }
    contentType() {
        return __classPrivateFieldGet(this, _StaticContentProvider_contentType, "f");
    }
    requestContentData() {
        return __classPrivateFieldGet(this, _StaticContentProvider_lazyContent, "f").call(this);
    }
    async searchInContent(query, caseSensitive, isRegex) {
        const contentData = await this.requestContentData();
        return performSearchInContentData(contentData, query, caseSensitive, isRegex);
    }
}
_StaticContentProvider_contentURL = new WeakMap(), _StaticContentProvider_contentType = new WeakMap(), _StaticContentProvider_lazyContent = new WeakMap();
//# sourceMappingURL=StaticContentProvider.js.map