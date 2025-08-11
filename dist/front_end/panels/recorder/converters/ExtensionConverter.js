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
var _ExtensionConverter_instances, _ExtensionConverter_idx, _ExtensionConverter_extension, _ExtensionConverter_mediaTypeToExtension;
import * as PuppeteerReplay from '../../../third_party/puppeteer-replay/puppeteer-replay.js';
export const EXTENSION_PREFIX = 'extension_';
export class ExtensionConverter {
    constructor(idx, extension) {
        _ExtensionConverter_instances.add(this);
        _ExtensionConverter_idx.set(this, void 0);
        _ExtensionConverter_extension.set(this, void 0);
        __classPrivateFieldSet(this, _ExtensionConverter_idx, idx, "f");
        __classPrivateFieldSet(this, _ExtensionConverter_extension, extension, "f");
    }
    getId() {
        return EXTENSION_PREFIX + __classPrivateFieldGet(this, _ExtensionConverter_idx, "f");
    }
    getFormatName() {
        return __classPrivateFieldGet(this, _ExtensionConverter_extension, "f").getName();
    }
    getMediaType() {
        return __classPrivateFieldGet(this, _ExtensionConverter_extension, "f").getMediaType();
    }
    getFilename(flow) {
        const fileExtension = __classPrivateFieldGet(this, _ExtensionConverter_instances, "m", _ExtensionConverter_mediaTypeToExtension).call(this, __classPrivateFieldGet(this, _ExtensionConverter_extension, "f").getMediaType());
        return `${flow.title}${fileExtension}`;
    }
    async stringify(flow) {
        const text = await __classPrivateFieldGet(this, _ExtensionConverter_extension, "f").stringify(flow);
        const sourceMap = PuppeteerReplay.parseSourceMap(text);
        return [PuppeteerReplay.stripSourceMap(text), sourceMap];
    }
    async stringifyStep(step) {
        return await __classPrivateFieldGet(this, _ExtensionConverter_extension, "f").stringifyStep(step);
    }
}
_ExtensionConverter_idx = new WeakMap(), _ExtensionConverter_extension = new WeakMap(), _ExtensionConverter_instances = new WeakSet(), _ExtensionConverter_mediaTypeToExtension = function _ExtensionConverter_mediaTypeToExtension(mediaType) {
    // See https://www.iana.org/assignments/media-types/media-types.xhtml
    switch (mediaType) {
        case 'application/json':
            return '.json';
        case 'application/javascript':
        case 'text/javascript':
            return '.js';
        case 'application/typescript':
        case 'text/typescript':
            return '.ts';
        default:
            // TODO: think of exhaustive mapping once the feature gets traction.
            return '';
    }
};
//# sourceMappingURL=ExtensionConverter.js.map