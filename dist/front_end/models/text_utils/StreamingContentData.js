// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _StreamingContentData_charset, _StreamingContentData_disallowStreaming, _StreamingContentData_chunks, _StreamingContentData_contentData;
import * as Common from '../../core/common/common.js';
import * as Platform from '../../core/platform/platform.js';
import { ContentData } from './ContentData.js';
/**
 * Usage of this class is mostly intended for content that is never "complete".
 * E.g. streaming XHR/fetch requests.
 *
 * Due to the streaming nature this class only supports base64-encoded binary data.
 * Decoding to text only happens on-demand by clients. This ensures that at most we have
 * incomplete unicode at the end and not in-between chunks.
 */
export class StreamingContentData extends Common.ObjectWrapper.ObjectWrapper {
    constructor(mimeType, charset, initialContent) {
        super();
        _StreamingContentData_charset.set(this, void 0);
        _StreamingContentData_disallowStreaming.set(this, void 0);
        _StreamingContentData_chunks.set(this, []);
        _StreamingContentData_contentData.set(this, void 0);
        this.mimeType = mimeType;
        __classPrivateFieldSet(this, _StreamingContentData_charset, charset, "f");
        __classPrivateFieldSet(this, _StreamingContentData_disallowStreaming, Boolean(initialContent && !initialContent.createdFromBase64), "f");
        __classPrivateFieldSet(this, _StreamingContentData_contentData, initialContent, "f");
    }
    /**
     * Creates a new StreamingContentData with the given MIME type/charset.
     */
    static create(mimeType, charset) {
        return new StreamingContentData(mimeType, charset);
    }
    /**
     * Creates a new StringContentData from an existing ContentData instance.
     *
     * Calling `addChunk` is on the resulting `StreamingContentData` is illegal if
     * `content` was not created from base64 data. The reason is that JavaScript TextEncoder
     * only supports UTF-8. We can't convert text with arbitrary encoding back to base64 for concatenation.
     */
    static from(content) {
        return new StreamingContentData(content.mimeType, content.charset, content);
    }
    /** @returns true, if this `ContentData` was constructed from text content or the mime type indicates text that can be decoded */
    get isTextContent() {
        if (__classPrivateFieldGet(this, _StreamingContentData_contentData, "f")) {
            return __classPrivateFieldGet(this, _StreamingContentData_contentData, "f").isTextContent;
        }
        return Platform.MimeType.isTextType(this.mimeType);
    }
    /** @param chunk base64 encoded data */
    addChunk(chunk) {
        if (__classPrivateFieldGet(this, _StreamingContentData_disallowStreaming, "f")) {
            throw new Error('Cannot add base64 data to a text-only ContentData.');
        }
        __classPrivateFieldGet(this, _StreamingContentData_chunks, "f").push(chunk);
        this.dispatchEventToListeners("ChunkAdded" /* Events.CHUNK_ADDED */, { content: this, chunk });
    }
    /** @returns An immutable ContentData with all the bytes received so far */
    content() {
        if (__classPrivateFieldGet(this, _StreamingContentData_contentData, "f") && __classPrivateFieldGet(this, _StreamingContentData_chunks, "f").length === 0) {
            return __classPrivateFieldGet(this, _StreamingContentData_contentData, "f");
        }
        const initialBase64 = __classPrivateFieldGet(this, _StreamingContentData_contentData, "f")?.base64 ?? '';
        const base64Content = __classPrivateFieldGet(this, _StreamingContentData_chunks, "f").reduce((acc, chunk) => Platform.StringUtilities.concatBase64(acc, chunk), initialBase64);
        __classPrivateFieldSet(this, _StreamingContentData_contentData, new ContentData(base64Content, /* isBase64=*/ true, this.mimeType, __classPrivateFieldGet(this, _StreamingContentData_charset, "f")), "f");
        __classPrivateFieldSet(this, _StreamingContentData_chunks, [], "f");
        return __classPrivateFieldGet(this, _StreamingContentData_contentData, "f");
    }
}
_StreamingContentData_charset = new WeakMap(), _StreamingContentData_disallowStreaming = new WeakMap(), _StreamingContentData_chunks = new WeakMap(), _StreamingContentData_contentData = new WeakMap();
export const isError = function (contentDataOrError) {
    return 'error' in contentDataOrError;
};
export const asContentDataOrError = function (contentDataOrError) {
    if (isError(contentDataOrError)) {
        return contentDataOrError;
    }
    return contentDataOrError.content();
};
export var Events;
(function (Events) {
    Events["CHUNK_ADDED"] = "ChunkAdded";
})(Events || (Events = {}));
//# sourceMappingURL=StreamingContentData.js.map