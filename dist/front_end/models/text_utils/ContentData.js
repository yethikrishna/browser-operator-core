// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _ContentData_instances, _ContentData_contentAsBase64, _ContentData_contentAsText, _ContentData_contentAsTextObj, _ContentData_createdFromText_get;
import * as Platform from '../../core/platform/platform.js';
import { contentAsDataURL } from './ContentProvider.js';
import { Text } from './Text.js';
/**
 * This class is a small wrapper around either raw binary or text data.
 * As the binary data can actually contain textual data, we also store the
 * MIME type and if applicable, the charset.
 *
 * This information should be generally kept together, as interpreting text
 * from raw bytes requires an encoding.
 *
 * Note that we only rarely have to decode text ourselves in the frontend,
 * this is mostly handled by the backend. There are cases though (e.g. SVG,
 * or streaming response content) where we receive text data in
 * binary (base64-encoded) form.
 *
 * The class only implements decoding. We currently don't have a use-case
 * to re-encode text into base64 bytes using a specified charset.
 */
export class ContentData {
    constructor(data, isBase64, mimeType, charset) {
        _ContentData_instances.add(this);
        _ContentData_contentAsBase64.set(this, void 0);
        _ContentData_contentAsText.set(this, void 0);
        _ContentData_contentAsTextObj.set(this, void 0);
        this.charset = charset || 'utf-8';
        if (isBase64) {
            __classPrivateFieldSet(this, _ContentData_contentAsBase64, data, "f");
        }
        else {
            __classPrivateFieldSet(this, _ContentData_contentAsText, data, "f");
        }
        this.mimeType = mimeType;
        if (!this.mimeType) {
            // Tests or broken requests might pass an empty/undefined mime type. Fallback to
            // "default" mime types.
            this.mimeType = isBase64 ? 'application/octet-stream' : 'text/plain';
        }
    }
    /**
     * Returns the data as base64.
     *
     * @throws if this `ContentData` was constructed from text content.
     */
    get base64() {
        if (__classPrivateFieldGet(this, _ContentData_contentAsBase64, "f") === undefined) {
            throw new Error('Encoding text content as base64 is not supported');
        }
        return __classPrivateFieldGet(this, _ContentData_contentAsBase64, "f");
    }
    /**
     * Returns the content as text. If this `ContentData` was constructed with base64
     * encoded bytes, it will use the provided charset to attempt to decode the bytes.
     *
     * @throws if `mimeType` is not a text type.
     */
    get text() {
        if (__classPrivateFieldGet(this, _ContentData_contentAsText, "f") !== undefined) {
            return __classPrivateFieldGet(this, _ContentData_contentAsText, "f");
        }
        if (!this.isTextContent) {
            throw new Error('Cannot interpret binary data as text');
        }
        const binaryString = window.atob(__classPrivateFieldGet(this, _ContentData_contentAsBase64, "f"));
        const bytes = Uint8Array.from(binaryString, m => m.codePointAt(0));
        __classPrivateFieldSet(this, _ContentData_contentAsText, new TextDecoder(this.charset).decode(bytes), "f");
        return __classPrivateFieldGet(this, _ContentData_contentAsText, "f");
    }
    /** @returns true, if this `ContentData` was constructed from text content or the mime type indicates text that can be decoded */
    get isTextContent() {
        return __classPrivateFieldGet(this, _ContentData_instances, "a", _ContentData_createdFromText_get) || Platform.MimeType.isTextType(this.mimeType);
    }
    get isEmpty() {
        // Don't trigger unnecessary decoding. Only check if both of the strings are empty.
        return !Boolean(__classPrivateFieldGet(this, _ContentData_contentAsBase64, "f")) && !Boolean(__classPrivateFieldGet(this, _ContentData_contentAsText, "f"));
    }
    get createdFromBase64() {
        return __classPrivateFieldGet(this, _ContentData_contentAsBase64, "f") !== undefined;
    }
    /**
     * Returns the text content as a `Text` object. The returned object is always the same to
     * minimize the number of times we have to calculate the line endings array.
     *
     * @throws if `mimeType` is not a text type.
     */
    get textObj() {
        if (__classPrivateFieldGet(this, _ContentData_contentAsTextObj, "f") === undefined) {
            __classPrivateFieldSet(this, _ContentData_contentAsTextObj, new Text(this.text), "f");
        }
        return __classPrivateFieldGet(this, _ContentData_contentAsTextObj, "f");
    }
    /**
     * @returns True, iff the contents (base64 or text) are equal.
     * Does not compare mime type and charset, but will decode base64 data if both
     * mime types indicate that it's text content.
     */
    contentEqualTo(other) {
        if (__classPrivateFieldGet(this, _ContentData_contentAsBase64, "f") !== undefined && __classPrivateFieldGet(other, _ContentData_contentAsBase64, "f") !== undefined) {
            return __classPrivateFieldGet(this, _ContentData_contentAsBase64, "f") === __classPrivateFieldGet(other, _ContentData_contentAsBase64, "f");
        }
        if (__classPrivateFieldGet(this, _ContentData_contentAsText, "f") !== undefined && __classPrivateFieldGet(other, _ContentData_contentAsText, "f") !== undefined) {
            return __classPrivateFieldGet(this, _ContentData_contentAsText, "f") === __classPrivateFieldGet(other, _ContentData_contentAsText, "f");
        }
        if (this.isTextContent && other.isTextContent) {
            return this.text === other.text;
        }
        return false;
    }
    asDataUrl() {
        // To keep with existing behavior we prefer to return the content
        // encoded if that is how this ContentData was constructed with.
        if (__classPrivateFieldGet(this, _ContentData_contentAsBase64, "f") !== undefined) {
            const charset = this.isTextContent ? this.charset : null;
            return contentAsDataURL(__classPrivateFieldGet(this, _ContentData_contentAsBase64, "f"), this.mimeType ?? '', true, charset);
        }
        return contentAsDataURL(this.text, this.mimeType ?? '', false, 'utf-8');
    }
    /**
     * @deprecated Used during migration from `DeferredContent` to `ContentData`.
     */
    asDeferedContent() {
        // To prevent encoding mistakes, we'll return text content already decoded.
        if (this.isTextContent) {
            return { content: this.text, isEncoded: false };
        }
        if (__classPrivateFieldGet(this, _ContentData_contentAsText, "f") !== undefined) {
            // Unknown text mime type, this should not really happen.
            return { content: __classPrivateFieldGet(this, _ContentData_contentAsText, "f"), isEncoded: false };
        }
        if (__classPrivateFieldGet(this, _ContentData_contentAsBase64, "f") !== undefined) {
            return { content: __classPrivateFieldGet(this, _ContentData_contentAsBase64, "f"), isEncoded: true };
        }
        throw new Error('Unreachable');
    }
    static isError(contentDataOrError) {
        return 'error' in contentDataOrError;
    }
    /** @returns `value` if the passed `ContentDataOrError` is an error, or the text content otherwise */
    static textOr(contentDataOrError, value) {
        if (ContentData.isError(contentDataOrError)) {
            return value;
        }
        return contentDataOrError.text;
    }
    /** @returns an empty 'text/plain' content data if the passed `ContentDataOrError` is an error, or the content data itself otherwise */
    static contentDataOrEmpty(contentDataOrError) {
        if (ContentData.isError(contentDataOrError)) {
            return EMPTY_TEXT_CONTENT_DATA;
        }
        return contentDataOrError;
    }
    /**
     * @deprecated Used during migration from `DeferredContent` to `ContentData`.
     */
    static asDeferredContent(contentDataOrError) {
        if (ContentData.isError(contentDataOrError)) {
            return { error: contentDataOrError.error, content: null, isEncoded: false };
        }
        return contentDataOrError.asDeferedContent();
    }
}
_ContentData_contentAsBase64 = new WeakMap(), _ContentData_contentAsText = new WeakMap(), _ContentData_contentAsTextObj = new WeakMap(), _ContentData_instances = new WeakSet(), _ContentData_createdFromText_get = function _ContentData_createdFromText_get() {
    return __classPrivateFieldGet(this, _ContentData_contentAsBase64, "f") === undefined;
};
export const EMPTY_TEXT_CONTENT_DATA = new ContentData('', /* isBase64 */ false, 'text/plain');
//# sourceMappingURL=ContentData.js.map