"use strict";
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
var _BidiBrowserTarget_browser, _BidiPageTarget_page, _BidiFrameTarget_frame, _BidiFrameTarget_page, _BidiWorkerTarget_worker;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidiWorkerTarget = exports.BidiFrameTarget = exports.BidiPageTarget = exports.BidiBrowserTarget = void 0;
const Target_js_1 = require("../api/Target.js");
const Errors_js_1 = require("../common/Errors.js");
const Page_js_1 = require("./Page.js");
/**
 * @internal
 */
class BidiBrowserTarget extends Target_js_1.Target {
    constructor(browser) {
        super();
        _BidiBrowserTarget_browser.set(this, void 0);
        __classPrivateFieldSet(this, _BidiBrowserTarget_browser, browser, "f");
    }
    asPage() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    url() {
        return '';
    }
    createCDPSession() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    type() {
        return Target_js_1.TargetType.BROWSER;
    }
    browser() {
        return __classPrivateFieldGet(this, _BidiBrowserTarget_browser, "f");
    }
    browserContext() {
        return __classPrivateFieldGet(this, _BidiBrowserTarget_browser, "f").defaultBrowserContext();
    }
    opener() {
        throw new Errors_js_1.UnsupportedOperation();
    }
}
_BidiBrowserTarget_browser = new WeakMap();
exports.BidiBrowserTarget = BidiBrowserTarget;
/**
 * @internal
 */
class BidiPageTarget extends Target_js_1.Target {
    constructor(page) {
        super();
        _BidiPageTarget_page.set(this, void 0);
        __classPrivateFieldSet(this, _BidiPageTarget_page, page, "f");
    }
    async page() {
        return __classPrivateFieldGet(this, _BidiPageTarget_page, "f");
    }
    async asPage() {
        return Page_js_1.BidiPage.from(this.browserContext(), __classPrivateFieldGet(this, _BidiPageTarget_page, "f").mainFrame().browsingContext);
    }
    url() {
        return __classPrivateFieldGet(this, _BidiPageTarget_page, "f").url();
    }
    createCDPSession() {
        return __classPrivateFieldGet(this, _BidiPageTarget_page, "f").createCDPSession();
    }
    type() {
        return Target_js_1.TargetType.PAGE;
    }
    browser() {
        return this.browserContext().browser();
    }
    browserContext() {
        return __classPrivateFieldGet(this, _BidiPageTarget_page, "f").browserContext();
    }
    opener() {
        throw new Errors_js_1.UnsupportedOperation();
    }
}
_BidiPageTarget_page = new WeakMap();
exports.BidiPageTarget = BidiPageTarget;
/**
 * @internal
 */
class BidiFrameTarget extends Target_js_1.Target {
    constructor(frame) {
        super();
        _BidiFrameTarget_frame.set(this, void 0);
        _BidiFrameTarget_page.set(this, void 0);
        __classPrivateFieldSet(this, _BidiFrameTarget_frame, frame, "f");
    }
    async page() {
        if (__classPrivateFieldGet(this, _BidiFrameTarget_page, "f") === undefined) {
            __classPrivateFieldSet(this, _BidiFrameTarget_page, Page_js_1.BidiPage.from(this.browserContext(), __classPrivateFieldGet(this, _BidiFrameTarget_frame, "f").browsingContext), "f");
        }
        return __classPrivateFieldGet(this, _BidiFrameTarget_page, "f");
    }
    async asPage() {
        return Page_js_1.BidiPage.from(this.browserContext(), __classPrivateFieldGet(this, _BidiFrameTarget_frame, "f").browsingContext);
    }
    url() {
        return __classPrivateFieldGet(this, _BidiFrameTarget_frame, "f").url();
    }
    createCDPSession() {
        return __classPrivateFieldGet(this, _BidiFrameTarget_frame, "f").createCDPSession();
    }
    type() {
        return Target_js_1.TargetType.PAGE;
    }
    browser() {
        return this.browserContext().browser();
    }
    browserContext() {
        return __classPrivateFieldGet(this, _BidiFrameTarget_frame, "f").page().browserContext();
    }
    opener() {
        throw new Errors_js_1.UnsupportedOperation();
    }
}
_BidiFrameTarget_frame = new WeakMap(), _BidiFrameTarget_page = new WeakMap();
exports.BidiFrameTarget = BidiFrameTarget;
/**
 * @internal
 */
class BidiWorkerTarget extends Target_js_1.Target {
    constructor(worker) {
        super();
        _BidiWorkerTarget_worker.set(this, void 0);
        __classPrivateFieldSet(this, _BidiWorkerTarget_worker, worker, "f");
    }
    async page() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    async asPage() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    url() {
        return __classPrivateFieldGet(this, _BidiWorkerTarget_worker, "f").url();
    }
    createCDPSession() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    type() {
        return Target_js_1.TargetType.OTHER;
    }
    browser() {
        return this.browserContext().browser();
    }
    browserContext() {
        return __classPrivateFieldGet(this, _BidiWorkerTarget_worker, "f").frame.page().browserContext();
    }
    opener() {
        throw new Errors_js_1.UnsupportedOperation();
    }
}
_BidiWorkerTarget_worker = new WeakMap();
exports.BidiWorkerTarget = BidiWorkerTarget;
//# sourceMappingURL=Target.js.map