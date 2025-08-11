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
var _JSONConverter_indent;
import * as PuppeteerReplay from '../../../third_party/puppeteer-replay/puppeteer-replay.js';
import * as Models from '../models/models.js';
export class JSONConverter {
    constructor(indent) {
        _JSONConverter_indent.set(this, void 0);
        __classPrivateFieldSet(this, _JSONConverter_indent, indent, "f");
    }
    getId() {
        return "json" /* Models.ConverterIds.ConverterIds.JSON */;
    }
    getFormatName() {
        return 'JSON';
    }
    getFilename(flow) {
        return `${flow.title}.json`;
    }
    async stringify(flow) {
        const text = await PuppeteerReplay.stringify(flow, {
            extension: new PuppeteerReplay.JSONStringifyExtension(),
            indentation: __classPrivateFieldGet(this, _JSONConverter_indent, "f"),
        });
        const sourceMap = PuppeteerReplay.parseSourceMap(text);
        return [PuppeteerReplay.stripSourceMap(text), sourceMap];
    }
    async stringifyStep(step) {
        return await PuppeteerReplay.stringifyStep(step, {
            extension: new PuppeteerReplay.JSONStringifyExtension(),
            indentation: __classPrivateFieldGet(this, _JSONConverter_indent, "f"),
        });
    }
    getMediaType() {
        return 'application/json';
    }
}
_JSONConverter_indent = new WeakMap();
//# sourceMappingURL=JSONConverter.js.map