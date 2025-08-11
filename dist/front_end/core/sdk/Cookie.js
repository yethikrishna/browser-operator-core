// Copyright 2019 The Chromium Authors. All rights reserved.
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
var _Cookie_nameInternal, _Cookie_valueInternal, _Cookie_typeInternal, _Cookie_attributes, _Cookie_sizeInternal, _Cookie_priorityInternal, _Cookie_cookieLine, _Cookie_partitionKey;
const OPAQUE_PARTITION_KEY = '<opaque>';
export class Cookie {
    constructor(name, value, type, priority, partitionKey) {
        _Cookie_nameInternal.set(this, void 0);
        _Cookie_valueInternal.set(this, void 0);
        _Cookie_typeInternal.set(this, void 0);
        _Cookie_attributes.set(this, new Map());
        _Cookie_sizeInternal.set(this, 0);
        _Cookie_priorityInternal.set(this, void 0);
        _Cookie_cookieLine.set(this, null);
        _Cookie_partitionKey.set(this, void 0);
        __classPrivateFieldSet(this, _Cookie_nameInternal, name, "f");
        __classPrivateFieldSet(this, _Cookie_valueInternal, value, "f");
        __classPrivateFieldSet(this, _Cookie_typeInternal, type, "f");
        __classPrivateFieldSet(this, _Cookie_priorityInternal, (priority || 'Medium'), "f");
        __classPrivateFieldSet(this, _Cookie_partitionKey, partitionKey, "f");
    }
    static fromProtocolCookie(protocolCookie) {
        const cookie = new Cookie(protocolCookie.name, protocolCookie.value, null, protocolCookie.priority);
        cookie.addAttribute("domain" /* Attribute.DOMAIN */, protocolCookie['domain']);
        cookie.addAttribute("path" /* Attribute.PATH */, protocolCookie['path']);
        if (protocolCookie['expires']) {
            cookie.addAttribute("expires" /* Attribute.EXPIRES */, protocolCookie['expires'] * 1000);
        }
        if (protocolCookie['httpOnly']) {
            cookie.addAttribute("http-only" /* Attribute.HTTP_ONLY */);
        }
        if (protocolCookie['secure']) {
            cookie.addAttribute("secure" /* Attribute.SECURE */);
        }
        if (protocolCookie['sameSite']) {
            cookie.addAttribute("same-site" /* Attribute.SAME_SITE */, protocolCookie['sameSite']);
        }
        if ('sourcePort' in protocolCookie) {
            cookie.addAttribute("source-port" /* Attribute.SOURCE_PORT */, protocolCookie.sourcePort);
        }
        if ('sourceScheme' in protocolCookie) {
            cookie.addAttribute("source-scheme" /* Attribute.SOURCE_SCHEME */, protocolCookie.sourceScheme);
        }
        if ('partitionKey' in protocolCookie) {
            if (protocolCookie.partitionKey) {
                cookie.setPartitionKey(protocolCookie.partitionKey.topLevelSite, protocolCookie.partitionKey.hasCrossSiteAncestor);
            }
        }
        if ('partitionKeyOpaque' in protocolCookie && protocolCookie.partitionKeyOpaque) {
            cookie.addAttribute("partition-key" /* Attribute.PARTITION_KEY */, OPAQUE_PARTITION_KEY);
        }
        cookie.setSize(protocolCookie['size']);
        return cookie;
    }
    key() {
        return (this.domain() || '-') + ' ' + this.name() + ' ' + (this.path() || '-') + ' ' +
            (this.partitionKey() ?
                (this.topLevelSite() + ' ' + (this.hasCrossSiteAncestor() ? 'cross_site' : 'same_site')) :
                '-');
    }
    name() {
        return __classPrivateFieldGet(this, _Cookie_nameInternal, "f");
    }
    value() {
        return __classPrivateFieldGet(this, _Cookie_valueInternal, "f");
    }
    type() {
        return __classPrivateFieldGet(this, _Cookie_typeInternal, "f");
    }
    httpOnly() {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").has("http-only" /* Attribute.HTTP_ONLY */);
    }
    secure() {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").has("secure" /* Attribute.SECURE */);
    }
    partitioned() {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").has("partitioned" /* Attribute.PARTITIONED */) || Boolean(this.partitionKey()) || this.partitionKeyOpaque();
    }
    sameSite() {
        // TODO(allada) This should not rely on #attributes and instead store them individually.
        // when #attributes get added via addAttribute() they are lowercased, hence the lowercasing of samesite here
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").get("same-site" /* Attribute.SAME_SITE */);
    }
    partitionKey() {
        return __classPrivateFieldGet(this, _Cookie_partitionKey, "f");
    }
    setPartitionKey(topLevelSite, hasCrossSiteAncestor) {
        __classPrivateFieldSet(this, _Cookie_partitionKey, { topLevelSite, hasCrossSiteAncestor }, "f");
        if (!__classPrivateFieldGet(this, _Cookie_attributes, "f").has("partitioned" /* Attribute.PARTITIONED */)) {
            this.addAttribute("partitioned" /* Attribute.PARTITIONED */);
        }
    }
    topLevelSite() {
        if (!__classPrivateFieldGet(this, _Cookie_partitionKey, "f")) {
            return '';
        }
        return __classPrivateFieldGet(this, _Cookie_partitionKey, "f")?.topLevelSite;
    }
    setTopLevelSite(topLevelSite, hasCrossSiteAncestor) {
        this.setPartitionKey(topLevelSite, hasCrossSiteAncestor);
    }
    hasCrossSiteAncestor() {
        if (!__classPrivateFieldGet(this, _Cookie_partitionKey, "f")) {
            return false;
        }
        return __classPrivateFieldGet(this, _Cookie_partitionKey, "f")?.hasCrossSiteAncestor;
    }
    setHasCrossSiteAncestor(hasCrossSiteAncestor) {
        if (!this.partitionKey() || !Boolean(this.topLevelSite())) {
            return;
        }
        this.setPartitionKey(this.topLevelSite(), hasCrossSiteAncestor);
    }
    partitionKeyOpaque() {
        if (!__classPrivateFieldGet(this, _Cookie_partitionKey, "f")) {
            return false;
        }
        return (this.topLevelSite() === OPAQUE_PARTITION_KEY);
    }
    setPartitionKeyOpaque() {
        this.addAttribute("partition-key" /* Attribute.PARTITION_KEY */, OPAQUE_PARTITION_KEY);
        this.setPartitionKey(OPAQUE_PARTITION_KEY, false);
    }
    priority() {
        return __classPrivateFieldGet(this, _Cookie_priorityInternal, "f");
    }
    session() {
        // RFC 2965 suggests using Discard attribute to mark session cookies, but this does not seem to be widely used.
        // Check for absence of explicitly max-age or expiry date instead.
        return !(__classPrivateFieldGet(this, _Cookie_attributes, "f").has("expires" /* Attribute.EXPIRES */) || __classPrivateFieldGet(this, _Cookie_attributes, "f").has("max-age" /* Attribute.MAX_AGE */));
    }
    path() {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").get("path" /* Attribute.PATH */);
    }
    domain() {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").get("domain" /* Attribute.DOMAIN */);
    }
    expires() {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").get("expires" /* Attribute.EXPIRES */);
    }
    maxAge() {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").get("max-age" /* Attribute.MAX_AGE */);
    }
    sourcePort() {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").get("source-port" /* Attribute.SOURCE_PORT */);
    }
    sourceScheme() {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").get("source-scheme" /* Attribute.SOURCE_SCHEME */);
    }
    size() {
        return __classPrivateFieldGet(this, _Cookie_sizeInternal, "f");
    }
    /**
     * @deprecated
     */
    url() {
        if (!this.domain() || !this.path()) {
            return null;
        }
        let port = '';
        const sourcePort = this.sourcePort();
        // Do not include standard ports to ensure the back-end will change standard ports according to the scheme.
        if (sourcePort && sourcePort !== 80 && sourcePort !== 443) {
            port = `:${this.sourcePort()}`;
        }
        // We must not consider the this.sourceScheme() here, otherwise it will be impossible to set a cookie without
        // the Secure attribute from a secure origin.
        return (this.secure() ? 'https://' : 'http://') + this.domain() + port + this.path();
    }
    setSize(size) {
        __classPrivateFieldSet(this, _Cookie_sizeInternal, size, "f");
    }
    expiresDate(requestDate) {
        // RFC 6265 indicates that the max-age attribute takes precedence over the expires attribute
        if (this.maxAge()) {
            return new Date(requestDate.getTime() + 1000 * this.maxAge());
        }
        if (this.expires()) {
            return new Date(this.expires());
        }
        return null;
    }
    addAttribute(key, value) {
        if (!key) {
            return;
        }
        switch (key) {
            case "priority" /* Attribute.PRIORITY */:
                __classPrivateFieldSet(this, _Cookie_priorityInternal, value, "f");
                break;
            default:
                __classPrivateFieldGet(this, _Cookie_attributes, "f").set(key, value);
        }
    }
    hasAttribute(key) {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").has(key);
    }
    getAttribute(key) {
        return __classPrivateFieldGet(this, _Cookie_attributes, "f").get(key);
    }
    setCookieLine(cookieLine) {
        __classPrivateFieldSet(this, _Cookie_cookieLine, cookieLine, "f");
    }
    getCookieLine() {
        return __classPrivateFieldGet(this, _Cookie_cookieLine, "f");
    }
    matchesSecurityOrigin(securityOrigin) {
        const hostname = new URL(securityOrigin).hostname;
        return Cookie.isDomainMatch(this.domain(), hostname);
    }
    static isDomainMatch(domain, hostname) {
        // This implementation mirrors
        // https://source.chromium.org/search?q=net::cookie_util::IsDomainMatch()
        //
        // Can domain match in two ways; as a domain cookie (where the cookie
        // domain begins with ".") or as a host cookie (where it doesn't).
        // Some consumers of the CookieMonster expect to set cookies on
        // URLs like http://.strange.url.  To retrieve cookies in this instance,
        // we allow matching as a host cookie even when the domain_ starts with
        // a period.
        if (hostname === domain) {
            return true;
        }
        // Domain cookie must have an initial ".".  To match, it must be
        // equal to url's host with initial period removed, or a suffix of
        // it.
        // Arguably this should only apply to "http" or "https" cookies, but
        // extension cookie tests currently use the funtionality, and if we
        // ever decide to implement that it should be done by preventing
        // such cookies from being set.
        if (!domain || domain[0] !== '.') {
            return false;
        }
        // The host with a "." prefixed.
        if (domain.substr(1) === hostname) {
            return true;
        }
        // A pure suffix of the host (ok since we know the domain already
        // starts with a ".")
        return hostname.length > domain.length && hostname.endsWith(domain);
    }
}
_Cookie_nameInternal = new WeakMap(), _Cookie_valueInternal = new WeakMap(), _Cookie_typeInternal = new WeakMap(), _Cookie_attributes = new WeakMap(), _Cookie_sizeInternal = new WeakMap(), _Cookie_priorityInternal = new WeakMap(), _Cookie_cookieLine = new WeakMap(), _Cookie_partitionKey = new WeakMap();
export var Type;
(function (Type) {
    Type[Type["REQUEST"] = 0] = "REQUEST";
    Type[Type["RESPONSE"] = 1] = "RESPONSE";
})(Type || (Type = {}));
export var Attribute;
(function (Attribute) {
    Attribute["NAME"] = "name";
    Attribute["VALUE"] = "value";
    Attribute["SIZE"] = "size";
    Attribute["DOMAIN"] = "domain";
    Attribute["PATH"] = "path";
    Attribute["EXPIRES"] = "expires";
    Attribute["MAX_AGE"] = "max-age";
    Attribute["HTTP_ONLY"] = "http-only";
    Attribute["SECURE"] = "secure";
    Attribute["SAME_SITE"] = "same-site";
    Attribute["SOURCE_SCHEME"] = "source-scheme";
    Attribute["SOURCE_PORT"] = "source-port";
    Attribute["PRIORITY"] = "priority";
    Attribute["PARTITIONED"] = "partitioned";
    Attribute["PARTITION_KEY"] = "partition-key";
    Attribute["PARTITION_KEY_SITE"] = "partition-key-site";
    Attribute["HAS_CROSS_SITE_ANCESTOR"] = "has-cross-site-ancestor";
})(Attribute || (Attribute = {}));
//# sourceMappingURL=Cookie.js.map