// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _CookieModel_instances, _CookieModel_blockedCookies, _CookieModel_cookieToBlockedReasons, _CookieModel_refreshThrottler, _CookieModel_cookies, _CookieModel_onPrimaryPageChanged, _CookieModel_getCookies, _CookieModel_isRefreshing, _CookieModel_isUpdated, _CookieModel_refreshThrottled, _CookieModel_refresh, _CookieModel_onResponseReceived, _CookieModel_onLoadingFinished;
import * as Common from '../common/common.js';
import * as Platform from '../platform/platform.js';
import * as Root from '../root/root.js';
import { Cookie } from './Cookie.js';
import { Events as NetworkManagerEvents, NetworkManager } from './NetworkManager.js';
import { Events as ResourceTreeModelEvents, ResourceTreeModel } from './ResourceTreeModel.js';
import { SDKModel } from './SDKModel.js';
export class CookieModel extends SDKModel {
    constructor(target) {
        super(target);
        _CookieModel_instances.add(this);
        _CookieModel_blockedCookies.set(this, new Map());
        _CookieModel_cookieToBlockedReasons.set(this, new Map());
        _CookieModel_refreshThrottler.set(this, new Common.Throttler.Throttler(300));
        _CookieModel_cookies.set(this, new Map());
        target.model(ResourceTreeModel)
            ?.addEventListener(ResourceTreeModelEvents.PrimaryPageChanged, __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_onPrimaryPageChanged), this);
        target.model(NetworkManager)
            ?.addEventListener(NetworkManagerEvents.ResponseReceived, __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_onResponseReceived), this);
        target.model(NetworkManager)?.addEventListener(NetworkManagerEvents.LoadingFinished, __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_onLoadingFinished), this);
    }
    addBlockedCookie(cookie, blockedReasons) {
        const key = cookie.key();
        const previousCookie = __classPrivateFieldGet(this, _CookieModel_blockedCookies, "f").get(key);
        __classPrivateFieldGet(this, _CookieModel_blockedCookies, "f").set(key, cookie);
        if (blockedReasons) {
            __classPrivateFieldGet(this, _CookieModel_cookieToBlockedReasons, "f").set(cookie, blockedReasons);
        }
        else {
            __classPrivateFieldGet(this, _CookieModel_cookieToBlockedReasons, "f").delete(cookie);
        }
        if (previousCookie) {
            __classPrivateFieldGet(this, _CookieModel_cookieToBlockedReasons, "f").delete(previousCookie);
        }
    }
    removeBlockedCookie(cookie) {
        __classPrivateFieldGet(this, _CookieModel_blockedCookies, "f").delete(cookie.key());
    }
    getCookieToBlockedReasonsMap() {
        return __classPrivateFieldGet(this, _CookieModel_cookieToBlockedReasons, "f");
    }
    async deleteCookie(cookie) {
        await this.deleteCookies([cookie]);
    }
    async clear(domain, securityOrigin) {
        if (!__classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_isRefreshing).call(this)) {
            await __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_refreshThrottled).call(this);
        }
        const cookies = domain ? (__classPrivateFieldGet(this, _CookieModel_cookies, "f").get(domain) || []) : [...__classPrivateFieldGet(this, _CookieModel_cookies, "f").values()].flat();
        cookies.push(...__classPrivateFieldGet(this, _CookieModel_blockedCookies, "f").values());
        if (securityOrigin) {
            const cookiesToDelete = cookies.filter(cookie => {
                return cookie.matchesSecurityOrigin(securityOrigin);
            });
            await this.deleteCookies(cookiesToDelete);
        }
        else {
            await this.deleteCookies(cookies);
        }
    }
    async saveCookie(cookie) {
        let domain = cookie.domain();
        if (!domain.startsWith('.')) {
            domain = '';
        }
        let expires = undefined;
        if (cookie.expires()) {
            expires = Math.floor(Date.parse(`${cookie.expires()}`) / 1000);
        }
        const enabled = Root.Runtime.experiments.isEnabled('experimental-cookie-features');
        const preserveUnset = (scheme) => scheme === "Unset" /* Protocol.Network.CookieSourceScheme.Unset */ ? scheme : undefined;
        const protocolCookie = {
            name: cookie.name(),
            value: cookie.value(),
            url: cookie.url() || undefined,
            domain,
            path: cookie.path(),
            secure: cookie.secure(),
            httpOnly: cookie.httpOnly(),
            sameSite: cookie.sameSite(),
            expires,
            priority: cookie.priority(),
            partitionKey: cookie.partitionKey(),
            sourceScheme: enabled ? cookie.sourceScheme() : preserveUnset(cookie.sourceScheme()),
            sourcePort: enabled ? cookie.sourcePort() : undefined,
        };
        const response = await this.target().networkAgent().invoke_setCookie(protocolCookie);
        const error = response.getError();
        if (error || !response.success) {
            return false;
        }
        await __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_refreshThrottled).call(this);
        return response.success;
    }
    /**
     * Returns cookies needed by current page's frames whose security origins are |domain|.
     */
    async getCookiesForDomain(domain, forceUpdate) {
        if (!__classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_isRefreshing).call(this) || forceUpdate) {
            await __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_refreshThrottled).call(this);
        }
        const normalCookies = __classPrivateFieldGet(this, _CookieModel_cookies, "f").get(domain) || [];
        return normalCookies.concat(Array.from(__classPrivateFieldGet(this, _CookieModel_blockedCookies, "f").values()));
    }
    async deleteCookies(cookies) {
        const networkAgent = this.target().networkAgent();
        __classPrivateFieldGet(this, _CookieModel_blockedCookies, "f").clear();
        __classPrivateFieldGet(this, _CookieModel_cookieToBlockedReasons, "f").clear();
        await Promise.all(cookies.map(cookie => networkAgent.invoke_deleteCookies({
            name: cookie.name(),
            url: undefined,
            domain: cookie.domain(),
            path: cookie.path(),
            partitionKey: cookie.partitionKey(),
        })));
        await __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_refreshThrottled).call(this);
    }
}
_CookieModel_blockedCookies = new WeakMap(), _CookieModel_cookieToBlockedReasons = new WeakMap(), _CookieModel_refreshThrottler = new WeakMap(), _CookieModel_cookies = new WeakMap(), _CookieModel_instances = new WeakSet(), _CookieModel_onPrimaryPageChanged = async function _CookieModel_onPrimaryPageChanged() {
    __classPrivateFieldGet(this, _CookieModel_blockedCookies, "f").clear();
    __classPrivateFieldGet(this, _CookieModel_cookieToBlockedReasons, "f").clear();
    await __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_refresh).call(this);
}, _CookieModel_getCookies = async function _CookieModel_getCookies(urls) {
    const networkAgent = this.target().networkAgent();
    const newCookies = new Map(await Promise.all(urls.keysArray().map(domain => networkAgent.invoke_getCookies({ urls: [...urls.get(domain).values()] })
        .then(({ cookies }) => [domain, cookies.map(Cookie.fromProtocolCookie)]))));
    const updated = __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_isUpdated).call(this, newCookies);
    __classPrivateFieldSet(this, _CookieModel_cookies, newCookies, "f");
    if (updated) {
        this.dispatchEventToListeners("CookieListUpdated" /* Events.COOKIE_LIST_UPDATED */);
    }
}, _CookieModel_isRefreshing = function _CookieModel_isRefreshing() {
    return Boolean(this.listeners?.size);
}, _CookieModel_isUpdated = function _CookieModel_isUpdated(newCookies) {
    if (newCookies.size !== __classPrivateFieldGet(this, _CookieModel_cookies, "f").size) {
        return true;
    }
    for (const [domain, newDomainCookies] of newCookies) {
        if (!__classPrivateFieldGet(this, _CookieModel_cookies, "f").has(domain)) {
            return true;
        }
        const oldDomainCookies = __classPrivateFieldGet(this, _CookieModel_cookies, "f").get(domain) || [];
        if (newDomainCookies.length !== oldDomainCookies.length) {
            return true;
        }
        const comparisonKey = (c) => c.key() + ' ' + c.value();
        const oldDomainCookieKeys = new Set(oldDomainCookies.map(comparisonKey));
        for (const newCookie of newDomainCookies) {
            if (!oldDomainCookieKeys.has(comparisonKey(newCookie))) {
                return true;
            }
        }
    }
    return false;
}, _CookieModel_refreshThrottled = function _CookieModel_refreshThrottled() {
    return __classPrivateFieldGet(this, _CookieModel_refreshThrottler, "f").schedule(() => __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_refresh).call(this));
}, _CookieModel_refresh = function _CookieModel_refresh() {
    const resourceURLs = new Platform.MapUtilities.Multimap();
    function populateResourceURLs(resource) {
        const documentURL = Common.ParsedURL.ParsedURL.fromString(resource.documentURL);
        if (documentURL) {
            resourceURLs.set(documentURL.securityOrigin(), resource.url);
        }
        return false;
    }
    const resourceTreeModel = this.target().model(ResourceTreeModel);
    if (resourceTreeModel) {
        // In case the current frame was unreachable, add its cookies
        // because they might help to debug why the frame was unreachable.
        const unreachableUrl = resourceTreeModel.mainFrame?.unreachableUrl();
        if (unreachableUrl) {
            const documentURL = Common.ParsedURL.ParsedURL.fromString(unreachableUrl);
            if (documentURL) {
                resourceURLs.set(documentURL.securityOrigin(), unreachableUrl);
            }
        }
        resourceTreeModel.forAllResources(populateResourceURLs);
    }
    return __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_getCookies).call(this, resourceURLs);
}, _CookieModel_onResponseReceived = function _CookieModel_onResponseReceived() {
    if (__classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_isRefreshing).call(this)) {
        void __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_refreshThrottled).call(this);
    }
}, _CookieModel_onLoadingFinished = function _CookieModel_onLoadingFinished() {
    if (__classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_isRefreshing).call(this)) {
        void __classPrivateFieldGet(this, _CookieModel_instances, "m", _CookieModel_refreshThrottled).call(this);
    }
};
SDKModel.register(CookieModel, { capabilities: 16 /* Capability.NETWORK */, autostart: false });
export var Events;
(function (Events) {
    Events["COOKIE_LIST_UPDATED"] = "CookieListUpdated";
})(Events || (Events = {}));
//# sourceMappingURL=CookieModel.js.map