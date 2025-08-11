// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _BinaryResourceViewFactory_uint8ArrayToHexString, _BinaryResourceViewFactory_numberToHex;
import * as TextUtils from '../../../../models/text_utils/text_utils.js';
import { ResourceSourceFrame } from './ResourceSourceFrame.js';
import { StreamingContentHexView } from './StreamingContentHexView.js';
export class BinaryResourceViewFactory {
    constructor(content, contentUrl, resourceType) {
        this.streamingContent = content;
        this.contentUrl = contentUrl;
        this.resourceType = resourceType;
    }
    hex() {
        const binaryString = window.atob(this.base64());
        const array = Uint8Array.from(binaryString, m => m.codePointAt(0));
        return __classPrivateFieldGet(_a, _a, "m", _BinaryResourceViewFactory_uint8ArrayToHexString).call(_a, array);
    }
    base64() {
        return this.streamingContent.content().base64;
    }
    utf8() {
        return new TextUtils.ContentData.ContentData(this.base64(), /* isBase64 */ true, 'text/plain', 'utf-8').text;
    }
    createBase64View() {
        const resourceFrame = new ResourceSourceFrame(TextUtils.StaticContentProvider.StaticContentProvider.fromString(this.contentUrl, this.resourceType, this.streamingContent.content().base64), this.resourceType.canonicalMimeType(), { lineNumbers: false, lineWrapping: true });
        this.streamingContent.addEventListener("ChunkAdded" /* TextUtils.StreamingContentData.Events.CHUNK_ADDED */, () => {
            void resourceFrame.setContent(this.base64());
        });
        return resourceFrame;
    }
    createHexView() {
        return new StreamingContentHexView(this.streamingContent);
    }
    createUtf8View() {
        const resourceFrame = new ResourceSourceFrame(TextUtils.StaticContentProvider.StaticContentProvider.fromString(this.contentUrl, this.resourceType, this.utf8()), this.resourceType.canonicalMimeType(), { lineNumbers: true, lineWrapping: true });
        this.streamingContent.addEventListener("ChunkAdded" /* TextUtils.StreamingContentData.Events.CHUNK_ADDED */, () => {
            void resourceFrame.setContent(this.utf8());
        });
        return resourceFrame;
    }
}
_a = BinaryResourceViewFactory, _BinaryResourceViewFactory_uint8ArrayToHexString = function _BinaryResourceViewFactory_uint8ArrayToHexString(uint8Array) {
    let output = '';
    for (let i = 0; i < uint8Array.length; i++) {
        output += __classPrivateFieldGet(_a, _a, "m", _BinaryResourceViewFactory_numberToHex).call(_a, uint8Array[i], 2);
    }
    return output;
}, _BinaryResourceViewFactory_numberToHex = function _BinaryResourceViewFactory_numberToHex(number, padding) {
    let hex = number.toString(16);
    while (hex.length < padding) {
        hex = '0' + hex;
    }
    return hex;
};
//# sourceMappingURL=BinaryResourceViewFactory.js.map