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
var _PuppeteerConverter_indent, _PuppeteerConverter_extension;
import * as PuppeteerReplay from '../../../third_party/puppeteer-replay/puppeteer-replay.js';
import * as Models from '../models/models.js';
export class PuppeteerConverter {
    constructor(indent) {
        _PuppeteerConverter_indent.set(this, void 0);
        _PuppeteerConverter_extension.set(this, void 0);
        __classPrivateFieldSet(this, _PuppeteerConverter_indent, indent, "f");
        __classPrivateFieldSet(this, _PuppeteerConverter_extension, this.createExtension(), "f");
    }
    getId() {
        return "puppeteer" /* Models.ConverterIds.ConverterIds.PUPPETEER */;
    }
    createExtension() {
        return new PuppeteerReplay.PuppeteerStringifyExtension();
    }
    getFormatName() {
        return 'Puppeteer';
    }
    getFilename(flow) {
        return `${flow.title}.js`;
    }
    async stringify(flow) {
        const text = await PuppeteerReplay.stringify(flow, {
            indentation: __classPrivateFieldGet(this, _PuppeteerConverter_indent, "f"),
            extension: __classPrivateFieldGet(this, _PuppeteerConverter_extension, "f"),
        });
        const sourceMap = PuppeteerReplay.parseSourceMap(text);
        return [PuppeteerReplay.stripSourceMap(text), sourceMap];
    }
    async stringifyStep(step) {
        return await PuppeteerReplay.stringifyStep(step, {
            indentation: __classPrivateFieldGet(this, _PuppeteerConverter_indent, "f"),
            extension: __classPrivateFieldGet(this, _PuppeteerConverter_extension, "f"),
        });
    }
    getMediaType() {
        return 'text/javascript';
    }
}
_PuppeteerConverter_indent = new WeakMap(), _PuppeteerConverter_extension = new WeakMap();
//# sourceMappingURL=PuppeteerConverter.js.map