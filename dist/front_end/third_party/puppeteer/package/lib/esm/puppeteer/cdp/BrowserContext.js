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
var _CdpBrowserContext_connection, _CdpBrowserContext_browser, _CdpBrowserContext_id;
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function")
            throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose)
                throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose)
                throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async)
                inner = dispose;
        }
        if (typeof dispose !== "function")
            throw new TypeError("Object not disposable.");
        if (inner)
            dispose = function () { try {
                inner.call(this);
            }
            catch (e) {
                return Promise.reject(e);
            } };
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
                    if (!r.async && s === 1)
                        return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async)
                            return s |= 2, Promise.resolve(result).then(next, function (e) { fail(e); return next(); });
                    }
                    else
                        s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1)
                return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError)
                throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
import { WEB_PERMISSION_TO_PROTOCOL_PERMISSION, } from '../api/Browser.js';
import { BrowserContext } from '../api/BrowserContext.js';
import { assert } from '../util/assert.js';
import { convertCookiesPartitionKeyFromPuppeteerToCdp } from './Page.js';
/**
 * @internal
 */
export class CdpBrowserContext extends BrowserContext {
    constructor(connection, browser, contextId) {
        super();
        _CdpBrowserContext_connection.set(this, void 0);
        _CdpBrowserContext_browser.set(this, void 0);
        _CdpBrowserContext_id.set(this, void 0);
        __classPrivateFieldSet(this, _CdpBrowserContext_connection, connection, "f");
        __classPrivateFieldSet(this, _CdpBrowserContext_browser, browser, "f");
        __classPrivateFieldSet(this, _CdpBrowserContext_id, contextId, "f");
    }
    get id() {
        return __classPrivateFieldGet(this, _CdpBrowserContext_id, "f");
    }
    targets() {
        return __classPrivateFieldGet(this, _CdpBrowserContext_browser, "f").targets().filter(target => {
            return target.browserContext() === this;
        });
    }
    async pages() {
        const pages = await Promise.all(this.targets()
            .filter(target => {
            return (target.type() === 'page' ||
                (target.type() === 'other' &&
                    __classPrivateFieldGet(this, _CdpBrowserContext_browser, "f")._getIsPageTargetCallback()?.(target)));
        })
            .map(target => {
            return target.page();
        }));
        return pages.filter((page) => {
            return !!page;
        });
    }
    async overridePermissions(origin, permissions) {
        const protocolPermissions = permissions.map(permission => {
            const protocolPermission = WEB_PERMISSION_TO_PROTOCOL_PERMISSION.get(permission);
            if (!protocolPermission) {
                throw new Error('Unknown permission: ' + permission);
            }
            return protocolPermission;
        });
        await __classPrivateFieldGet(this, _CdpBrowserContext_connection, "f").send('Browser.grantPermissions', {
            origin,
            browserContextId: __classPrivateFieldGet(this, _CdpBrowserContext_id, "f") || undefined,
            permissions: protocolPermissions,
        });
    }
    async clearPermissionOverrides() {
        await __classPrivateFieldGet(this, _CdpBrowserContext_connection, "f").send('Browser.resetPermissions', {
            browserContextId: __classPrivateFieldGet(this, _CdpBrowserContext_id, "f") || undefined,
        });
    }
    async newPage() {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const _guard = __addDisposableResource(env_1, await this.waitForScreenshotOperations(), false);
            return await __classPrivateFieldGet(this, _CdpBrowserContext_browser, "f")._createPageInContext(__classPrivateFieldGet(this, _CdpBrowserContext_id, "f"));
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    browser() {
        return __classPrivateFieldGet(this, _CdpBrowserContext_browser, "f");
    }
    async close() {
        assert(__classPrivateFieldGet(this, _CdpBrowserContext_id, "f"), 'Default BrowserContext cannot be closed!');
        await __classPrivateFieldGet(this, _CdpBrowserContext_browser, "f")._disposeContext(__classPrivateFieldGet(this, _CdpBrowserContext_id, "f"));
    }
    async cookies() {
        const { cookies } = await __classPrivateFieldGet(this, _CdpBrowserContext_connection, "f").send('Storage.getCookies', {
            browserContextId: __classPrivateFieldGet(this, _CdpBrowserContext_id, "f"),
        });
        return cookies.map(cookie => {
            return {
                ...cookie,
                partitionKey: cookie.partitionKey
                    ? {
                        sourceOrigin: cookie.partitionKey.topLevelSite,
                        hasCrossSiteAncestor: cookie.partitionKey.hasCrossSiteAncestor,
                    }
                    : undefined,
            };
        });
    }
    async setCookie(...cookies) {
        return await __classPrivateFieldGet(this, _CdpBrowserContext_connection, "f").send('Storage.setCookies', {
            browserContextId: __classPrivateFieldGet(this, _CdpBrowserContext_id, "f"),
            cookies: cookies.map(cookie => {
                return {
                    ...cookie,
                    partitionKey: convertCookiesPartitionKeyFromPuppeteerToCdp(cookie.partitionKey),
                };
            }),
        });
    }
    async setDownloadBehavior(downloadBehavior) {
        await __classPrivateFieldGet(this, _CdpBrowserContext_connection, "f").send('Browser.setDownloadBehavior', {
            behavior: downloadBehavior.policy,
            downloadPath: downloadBehavior.downloadPath,
            browserContextId: __classPrivateFieldGet(this, _CdpBrowserContext_id, "f"),
        });
    }
}
_CdpBrowserContext_connection = new WeakMap(), _CdpBrowserContext_browser = new WeakMap(), _CdpBrowserContext_id = new WeakMap();
//# sourceMappingURL=BrowserContext.js.map
//# sourceMappingURL=BrowserContext.js.map