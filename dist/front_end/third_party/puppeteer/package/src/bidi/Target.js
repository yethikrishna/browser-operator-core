/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
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
var _BidiBrowserTarget_browser, _BidiPageTarget_page, _BidiFrameTarget_frame, _BidiFrameTarget_page, _BidiWorkerTarget_worker;
import { Target, TargetType } from '../api/Target.js';
import { UnsupportedOperation } from '../common/Errors.js';
import { BidiPage } from './Page.js';
/**
 * @internal
 */
export class BidiBrowserTarget extends Target {
    constructor(browser) {
        super();
        _BidiBrowserTarget_browser.set(this, void 0);
        __classPrivateFieldSet(this, _BidiBrowserTarget_browser, browser, "f");
    }
    asPage() {
        throw new UnsupportedOperation();
    }
    url() {
        return '';
    }
    createCDPSession() {
        throw new UnsupportedOperation();
    }
    type() {
        return TargetType.BROWSER;
    }
    browser() {
        return __classPrivateFieldGet(this, _BidiBrowserTarget_browser, "f");
    }
    browserContext() {
        return __classPrivateFieldGet(this, _BidiBrowserTarget_browser, "f").defaultBrowserContext();
    }
    opener() {
        throw new UnsupportedOperation();
    }
}
_BidiBrowserTarget_browser = new WeakMap();
/**
 * @internal
 */
export class BidiPageTarget extends Target {
    constructor(page) {
        super();
        _BidiPageTarget_page.set(this, void 0);
        __classPrivateFieldSet(this, _BidiPageTarget_page, page, "f");
    }
    async page() {
        return __classPrivateFieldGet(this, _BidiPageTarget_page, "f");
    }
    async asPage() {
        return BidiPage.from(this.browserContext(), __classPrivateFieldGet(this, _BidiPageTarget_page, "f").mainFrame().browsingContext);
    }
    url() {
        return __classPrivateFieldGet(this, _BidiPageTarget_page, "f").url();
    }
    createCDPSession() {
        return __classPrivateFieldGet(this, _BidiPageTarget_page, "f").createCDPSession();
    }
    type() {
        return TargetType.PAGE;
    }
    browser() {
        return this.browserContext().browser();
    }
    browserContext() {
        return __classPrivateFieldGet(this, _BidiPageTarget_page, "f").browserContext();
    }
    opener() {
        throw new UnsupportedOperation();
    }
}
_BidiPageTarget_page = new WeakMap();
/**
 * @internal
 */
export class BidiFrameTarget extends Target {
    constructor(frame) {
        super();
        _BidiFrameTarget_frame.set(this, void 0);
        _BidiFrameTarget_page.set(this, void 0);
        __classPrivateFieldSet(this, _BidiFrameTarget_frame, frame, "f");
    }
    async page() {
        if (__classPrivateFieldGet(this, _BidiFrameTarget_page, "f") === undefined) {
            __classPrivateFieldSet(this, _BidiFrameTarget_page, BidiPage.from(this.browserContext(), __classPrivateFieldGet(this, _BidiFrameTarget_frame, "f").browsingContext), "f");
        }
        return __classPrivateFieldGet(this, _BidiFrameTarget_page, "f");
    }
    async asPage() {
        return BidiPage.from(this.browserContext(), __classPrivateFieldGet(this, _BidiFrameTarget_frame, "f").browsingContext);
    }
    url() {
        return __classPrivateFieldGet(this, _BidiFrameTarget_frame, "f").url();
    }
    createCDPSession() {
        return __classPrivateFieldGet(this, _BidiFrameTarget_frame, "f").createCDPSession();
    }
    type() {
        return TargetType.PAGE;
    }
    browser() {
        return this.browserContext().browser();
    }
    browserContext() {
        return __classPrivateFieldGet(this, _BidiFrameTarget_frame, "f").page().browserContext();
    }
    opener() {
        throw new UnsupportedOperation();
    }
}
_BidiFrameTarget_frame = new WeakMap(), _BidiFrameTarget_page = new WeakMap();
/**
 * @internal
 */
export class BidiWorkerTarget extends Target {
    constructor(worker) {
        super();
        _BidiWorkerTarget_worker.set(this, void 0);
        __classPrivateFieldSet(this, _BidiWorkerTarget_worker, worker, "f");
    }
    async page() {
        throw new UnsupportedOperation();
    }
    async asPage() {
        throw new UnsupportedOperation();
    }
    url() {
        return __classPrivateFieldGet(this, _BidiWorkerTarget_worker, "f").url();
    }
    createCDPSession() {
        throw new UnsupportedOperation();
    }
    type() {
        return TargetType.OTHER;
    }
    browser() {
        return this.browserContext().browser();
    }
    browserContext() {
        return __classPrivateFieldGet(this, _BidiWorkerTarget_worker, "f").frame.page().browserContext();
    }
    opener() {
        throw new UnsupportedOperation();
    }
}
_BidiWorkerTarget_worker = new WeakMap();
//# sourceMappingURL=Target.js.map