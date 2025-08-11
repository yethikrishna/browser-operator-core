/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _BidiBrowserContext_instances, _BidiBrowserContext_browser, _BidiBrowserContext_defaultViewport, _BidiBrowserContext_pages, _BidiBrowserContext_targets, _BidiBrowserContext_overrides, _BidiBrowserContext_initialize, _BidiBrowserContext_createPage, _BidiBrowserContext_trustedEmitter_accessor_storage;
import { WEB_PERMISSION_TO_PROTOCOL_PERMISSION } from '../api/Browser.js';
import { BrowserContext } from '../api/BrowserContext.js';
import { EventEmitter } from '../common/EventEmitter.js';
import { debugError } from '../common/util.js';
import { assert } from '../util/assert.js';
import { bubble } from '../util/decorators.js';
import { UserContext } from './core/UserContext.js';
import { BidiPage, bidiToPuppeteerCookie, cdpSpecificCookiePropertiesFromPuppeteerToBidi, convertCookiesExpiryCdpToBiDi, convertCookiesPartitionKeyFromPuppeteerToBiDi, convertCookiesSameSiteCdpToBiDi, } from './Page.js';
import { BidiWorkerTarget } from './Target.js';
import { BidiFrameTarget, BidiPageTarget } from './Target.js';
/**
 * @internal
 */
export class BidiBrowserContext extends BrowserContext {
    static from(browser, userContext, options) {
        const context = new BidiBrowserContext(browser, userContext, options);
        __classPrivateFieldGet(context, _BidiBrowserContext_instances, "m", _BidiBrowserContext_initialize).call(context);
        return context;
    }
    get trustedEmitter() { return __classPrivateFieldGet(this, _BidiBrowserContext_trustedEmitter_accessor_storage, "f"); }
    set trustedEmitter(value) { __classPrivateFieldSet(this, _BidiBrowserContext_trustedEmitter_accessor_storage, value, "f"); }
    constructor(browser, userContext, options) {
        super();
        _BidiBrowserContext_instances.add(this);
        _BidiBrowserContext_trustedEmitter_accessor_storage.set(this, new EventEmitter());
        _BidiBrowserContext_browser.set(this, void 0);
        _BidiBrowserContext_defaultViewport.set(this, void 0);
        _BidiBrowserContext_pages.set(this, new WeakMap());
        _BidiBrowserContext_targets.set(this, new Map());
        _BidiBrowserContext_overrides.set(this, []);
        __classPrivateFieldSet(this, _BidiBrowserContext_browser, browser, "f");
        this.userContext = userContext;
        __classPrivateFieldSet(this, _BidiBrowserContext_defaultViewport, options.defaultViewport, "f");
    }
    targets() {
        return [...__classPrivateFieldGet(this, _BidiBrowserContext_targets, "f").values()].flatMap(([target, frames]) => {
            return [target, ...frames.values()];
        });
    }
    async newPage() {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const _guard = __addDisposableResource(env_1, await this.waitForScreenshotOperations(), false);
            const context = await this.userContext.createBrowsingContext("tab" /* Bidi.BrowsingContext.CreateType.Tab */);
            const page = __classPrivateFieldGet(this, _BidiBrowserContext_pages, "f").get(context);
            if (!page) {
                throw new Error('Page is not found');
            }
            if (__classPrivateFieldGet(this, _BidiBrowserContext_defaultViewport, "f")) {
                try {
                    await page.setViewport(__classPrivateFieldGet(this, _BidiBrowserContext_defaultViewport, "f"));
                }
                catch {
                    // No support for setViewport in Firefox.
                }
            }
            return page;
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    async close() {
        assert(this.userContext.id !== UserContext.DEFAULT, 'Default BrowserContext cannot be closed!');
        try {
            await this.userContext.remove();
        }
        catch (error) {
            debugError(error);
        }
        __classPrivateFieldGet(this, _BidiBrowserContext_targets, "f").clear();
    }
    browser() {
        return __classPrivateFieldGet(this, _BidiBrowserContext_browser, "f");
    }
    async pages() {
        return [...this.userContext.browsingContexts].map(context => {
            return __classPrivateFieldGet(this, _BidiBrowserContext_pages, "f").get(context);
        });
    }
    async overridePermissions(origin, permissions) {
        const permissionsSet = new Set(permissions.map(permission => {
            const protocolPermission = WEB_PERMISSION_TO_PROTOCOL_PERMISSION.get(permission);
            if (!protocolPermission) {
                throw new Error('Unknown permission: ' + permission);
            }
            return permission;
        }));
        await Promise.all(Array.from(WEB_PERMISSION_TO_PROTOCOL_PERMISSION.keys()).map(permission => {
            const result = this.userContext.setPermissions(origin, {
                name: permission,
            }, permissionsSet.has(permission)
                ? "granted" /* Bidi.Permissions.PermissionState.Granted */
                : "denied" /* Bidi.Permissions.PermissionState.Denied */);
            __classPrivateFieldGet(this, _BidiBrowserContext_overrides, "f").push({ origin, permission });
            // TODO: some permissions are outdated and setting them to denied does
            // not work.
            if (!permissionsSet.has(permission)) {
                return result.catch(debugError);
            }
            return result;
        }));
    }
    async clearPermissionOverrides() {
        const promises = __classPrivateFieldGet(this, _BidiBrowserContext_overrides, "f").map(({ permission, origin }) => {
            return this.userContext
                .setPermissions(origin, {
                name: permission,
            }, "prompt" /* Bidi.Permissions.PermissionState.Prompt */)
                .catch(debugError);
        });
        __classPrivateFieldSet(this, _BidiBrowserContext_overrides, [], "f");
        await Promise.all(promises);
    }
    get id() {
        if (this.userContext.id === UserContext.DEFAULT) {
            return undefined;
        }
        return this.userContext.id;
    }
    async cookies() {
        const cookies = await this.userContext.getCookies();
        return cookies.map(cookie => {
            return bidiToPuppeteerCookie(cookie, true);
        });
    }
    async setCookie(...cookies) {
        await Promise.all(cookies.map(async (cookie) => {
            const bidiCookie = {
                domain: cookie.domain,
                name: cookie.name,
                value: {
                    type: 'string',
                    value: cookie.value,
                },
                ...(cookie.path !== undefined ? { path: cookie.path } : {}),
                ...(cookie.httpOnly !== undefined ? { httpOnly: cookie.httpOnly } : {}),
                ...(cookie.secure !== undefined ? { secure: cookie.secure } : {}),
                ...(cookie.sameSite !== undefined
                    ? { sameSite: convertCookiesSameSiteCdpToBiDi(cookie.sameSite) }
                    : {}),
                ...{ expiry: convertCookiesExpiryCdpToBiDi(cookie.expires) },
                // Chrome-specific properties.
                ...cdpSpecificCookiePropertiesFromPuppeteerToBidi(cookie, 'sameParty', 'sourceScheme', 'priority', 'url'),
            };
            return await this.userContext.setCookie(bidiCookie, convertCookiesPartitionKeyFromPuppeteerToBiDi(cookie.partitionKey));
        }));
    }
}
_BidiBrowserContext_browser = new WeakMap(), _BidiBrowserContext_defaultViewport = new WeakMap(), _BidiBrowserContext_pages = new WeakMap(), _BidiBrowserContext_targets = new WeakMap(), _BidiBrowserContext_overrides = new WeakMap(), _BidiBrowserContext_instances = new WeakSet(), _BidiBrowserContext_trustedEmitter_accessor_storage = new WeakMap(), _BidiBrowserContext_initialize = function _BidiBrowserContext_initialize() {
    // Create targets for existing browsing contexts.
    for (const browsingContext of this.userContext.browsingContexts) {
        __classPrivateFieldGet(this, _BidiBrowserContext_instances, "m", _BidiBrowserContext_createPage).call(this, browsingContext);
    }
    this.userContext.on('browsingcontext', ({ browsingContext }) => {
        const page = __classPrivateFieldGet(this, _BidiBrowserContext_instances, "m", _BidiBrowserContext_createPage).call(this, browsingContext);
        // We need to wait for the DOMContentLoaded as the
        // browsingContext still may be navigating from the about:blank
        if (browsingContext.originalOpener) {
            for (const context of this.userContext.browsingContexts) {
                if (context.id === browsingContext.originalOpener) {
                    __classPrivateFieldGet(this, _BidiBrowserContext_pages, "f")
                        .get(context)
                        .trustedEmitter.emit("popup" /* PageEvent.Popup */, page);
                }
            }
        }
    });
    this.userContext.on('closed', () => {
        this.trustedEmitter.removeAllListeners();
    });
}, _BidiBrowserContext_createPage = function _BidiBrowserContext_createPage(browsingContext) {
    const page = BidiPage.from(this, browsingContext);
    __classPrivateFieldGet(this, _BidiBrowserContext_pages, "f").set(browsingContext, page);
    page.trustedEmitter.on("close" /* PageEvent.Close */, () => {
        __classPrivateFieldGet(this, _BidiBrowserContext_pages, "f").delete(browsingContext);
    });
    // -- Target stuff starts here --
    const pageTarget = new BidiPageTarget(page);
    const pageTargets = new Map();
    __classPrivateFieldGet(this, _BidiBrowserContext_targets, "f").set(page, [pageTarget, pageTargets]);
    page.trustedEmitter.on("frameattached" /* PageEvent.FrameAttached */, frame => {
        const bidiFrame = frame;
        const target = new BidiFrameTarget(bidiFrame);
        pageTargets.set(bidiFrame, target);
        this.trustedEmitter.emit("targetcreated" /* BrowserContextEvent.TargetCreated */, target);
    });
    page.trustedEmitter.on("framenavigated" /* PageEvent.FrameNavigated */, frame => {
        const bidiFrame = frame;
        const target = pageTargets.get(bidiFrame);
        // If there is no target, then this is the page's frame.
        if (target === undefined) {
            this.trustedEmitter.emit("targetchanged" /* BrowserContextEvent.TargetChanged */, pageTarget);
        }
        else {
            this.trustedEmitter.emit("targetchanged" /* BrowserContextEvent.TargetChanged */, target);
        }
    });
    page.trustedEmitter.on("framedetached" /* PageEvent.FrameDetached */, frame => {
        const bidiFrame = frame;
        const target = pageTargets.get(bidiFrame);
        if (target === undefined) {
            return;
        }
        pageTargets.delete(bidiFrame);
        this.trustedEmitter.emit("targetdestroyed" /* BrowserContextEvent.TargetDestroyed */, target);
    });
    page.trustedEmitter.on("workercreated" /* PageEvent.WorkerCreated */, worker => {
        const bidiWorker = worker;
        const target = new BidiWorkerTarget(bidiWorker);
        pageTargets.set(bidiWorker, target);
        this.trustedEmitter.emit("targetcreated" /* BrowserContextEvent.TargetCreated */, target);
    });
    page.trustedEmitter.on("workerdestroyed" /* PageEvent.WorkerDestroyed */, worker => {
        const bidiWorker = worker;
        const target = pageTargets.get(bidiWorker);
        if (target === undefined) {
            return;
        }
        pageTargets.delete(worker);
        this.trustedEmitter.emit("targetdestroyed" /* BrowserContextEvent.TargetDestroyed */, target);
    });
    page.trustedEmitter.on("close" /* PageEvent.Close */, () => {
        __classPrivateFieldGet(this, _BidiBrowserContext_targets, "f").delete(page);
        this.trustedEmitter.emit("targetdestroyed" /* BrowserContextEvent.TargetDestroyed */, pageTarget);
    });
    this.trustedEmitter.emit("targetcreated" /* BrowserContextEvent.TargetCreated */, pageTarget);
    // -- Target stuff ends here --
    return page;
};
__decorate([
    bubble(),
    __metadata("design:type", Object)
], BidiBrowserContext.prototype, "trustedEmitter", null);
//# sourceMappingURL=BrowserContext.js.map