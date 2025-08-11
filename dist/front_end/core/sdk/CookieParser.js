/*
 * Copyright (C) 2010 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
var _CookieParser_domain, _CookieParser_cookiesInternal, _CookieParser_input, _CookieParser_originalInputLength, _CookieParser_lastCookie, _CookieParser_lastCookieLine, _CookieParser_lastCookiePosition;
// Ideally, we would rely on platform support for parsing a cookie, since
// this would save us from any potential inconsistency. However, exposing
// platform cookie parsing logic would require quite a bit of additional
// plumbing, and at least some platforms lack support for parsing Cookie,
// which is in a format slightly different from Set-Cookie and is normally
// only required on the server side.
import { Cookie } from './Cookie.js';
export class CookieParser {
    constructor(domain) {
        _CookieParser_domain.set(this, void 0);
        _CookieParser_cookiesInternal.set(this, void 0);
        _CookieParser_input.set(this, void 0);
        _CookieParser_originalInputLength.set(this, void 0);
        _CookieParser_lastCookie.set(this, void 0);
        _CookieParser_lastCookieLine.set(this, void 0);
        _CookieParser_lastCookiePosition.set(this, void 0);
        if (domain) {
            // Handle #domain according to
            // https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-5.3.3
            __classPrivateFieldSet(this, _CookieParser_domain, domain.toLowerCase().replace(/^\./, ''), "f");
        }
        __classPrivateFieldSet(this, _CookieParser_cookiesInternal, [], "f");
        __classPrivateFieldSet(this, _CookieParser_originalInputLength, 0, "f");
    }
    static parseSetCookie(header, domain) {
        return (new CookieParser(domain)).parseSetCookie(header);
    }
    getCookieAttribute(header) {
        if (!header) {
            return null;
        }
        switch (header.toLowerCase()) {
            case 'domain':
                return "domain" /* Attribute.DOMAIN */;
            case 'expires':
                return "expires" /* Attribute.EXPIRES */;
            case 'max-age':
                return "max-age" /* Attribute.MAX_AGE */;
            case 'httponly':
                return "http-only" /* Attribute.HTTP_ONLY */;
            case 'name':
                return "name" /* Attribute.NAME */;
            case 'path':
                return "path" /* Attribute.PATH */;
            case 'samesite':
                return "same-site" /* Attribute.SAME_SITE */;
            case 'secure':
                return "secure" /* Attribute.SECURE */;
            case 'value':
                return "value" /* Attribute.VALUE */;
            case 'priority':
                return "priority" /* Attribute.PRIORITY */;
            case 'sourceport':
                return "source-port" /* Attribute.SOURCE_PORT */;
            case 'sourcescheme':
                return "source-scheme" /* Attribute.SOURCE_SCHEME */;
            case 'partitioned':
                return "partitioned" /* Attribute.PARTITIONED */;
            default:
                console.error('Failed getting cookie attribute: ' + header);
                return null;
        }
    }
    cookies() {
        return __classPrivateFieldGet(this, _CookieParser_cookiesInternal, "f");
    }
    parseSetCookie(setCookieHeader) {
        if (!this.initialize(setCookieHeader)) {
            return null;
        }
        for (let kv = this.extractKeyValue(); kv; kv = this.extractKeyValue()) {
            if (__classPrivateFieldGet(this, _CookieParser_lastCookie, "f")) {
                __classPrivateFieldGet(this, _CookieParser_lastCookie, "f").addAttribute(this.getCookieAttribute(kv.key), kv.value);
            }
            else {
                this.addCookie(kv, 1 /* Type.RESPONSE */);
            }
            if (this.advanceAndCheckCookieDelimiter()) {
                this.flushCookie();
            }
        }
        this.flushCookie();
        return __classPrivateFieldGet(this, _CookieParser_cookiesInternal, "f");
    }
    initialize(headerValue) {
        __classPrivateFieldSet(this, _CookieParser_input, headerValue, "f");
        if (typeof headerValue !== 'string') {
            return false;
        }
        __classPrivateFieldSet(this, _CookieParser_cookiesInternal, [], "f");
        __classPrivateFieldSet(this, _CookieParser_lastCookie, null, "f");
        __classPrivateFieldSet(this, _CookieParser_lastCookieLine, '', "f");
        __classPrivateFieldSet(this, _CookieParser_originalInputLength, __classPrivateFieldGet(this, _CookieParser_input, "f").length, "f");
        return true;
    }
    flushCookie() {
        if (__classPrivateFieldGet(this, _CookieParser_lastCookie, "f")) {
            // if we have a last cookie we know that these valeus all exist, hence the typecasts
            __classPrivateFieldGet(this, _CookieParser_lastCookie, "f").setSize(__classPrivateFieldGet(this, _CookieParser_originalInputLength, "f") - __classPrivateFieldGet(this, _CookieParser_input, "f").length - __classPrivateFieldGet(this, _CookieParser_lastCookiePosition, "f"));
            __classPrivateFieldGet(this, _CookieParser_lastCookie, "f").setCookieLine(__classPrivateFieldGet(this, _CookieParser_lastCookieLine, "f").replace('\n', ''));
        }
        __classPrivateFieldSet(this, _CookieParser_lastCookie, null, "f");
        __classPrivateFieldSet(this, _CookieParser_lastCookieLine, '', "f");
    }
    extractKeyValue() {
        if (!__classPrivateFieldGet(this, _CookieParser_input, "f") || !__classPrivateFieldGet(this, _CookieParser_input, "f").length) {
            return null;
        }
        // Note: RFCs offer an option for quoted values that may contain commas and semicolons.
        // Many browsers/platforms do not support this, however (see http://webkit.org/b/16699
        // and http://crbug.com/12361). The logic below matches latest versions of IE, Firefox,
        // Chrome and Safari on some old platforms. The latest version of Safari supports quoted
        // cookie values, though.
        const keyValueMatch = /^[ \t]*([^=;\n]+)[ \t]*(?:=[ \t]*([^;\n]*))?/.exec(__classPrivateFieldGet(this, _CookieParser_input, "f"));
        if (!keyValueMatch) {
            console.error('Failed parsing cookie header before: ' + __classPrivateFieldGet(this, _CookieParser_input, "f"));
            return null;
        }
        const result = new KeyValue(keyValueMatch[1]?.trim(), keyValueMatch[2]?.trim(), (__classPrivateFieldGet(this, _CookieParser_originalInputLength, "f")) - __classPrivateFieldGet(this, _CookieParser_input, "f").length);
        __classPrivateFieldSet(this, _CookieParser_lastCookieLine, __classPrivateFieldGet(this, _CookieParser_lastCookieLine, "f") + keyValueMatch[0], "f");
        __classPrivateFieldSet(this, _CookieParser_input, __classPrivateFieldGet(this, _CookieParser_input, "f").slice(keyValueMatch[0].length), "f");
        return result;
    }
    advanceAndCheckCookieDelimiter() {
        if (!__classPrivateFieldGet(this, _CookieParser_input, "f")) {
            return false;
        }
        const match = /^\s*[\n;]\s*/.exec(__classPrivateFieldGet(this, _CookieParser_input, "f"));
        if (!match) {
            return false;
        }
        __classPrivateFieldSet(this, _CookieParser_lastCookieLine, __classPrivateFieldGet(this, _CookieParser_lastCookieLine, "f") + match[0], "f");
        __classPrivateFieldSet(this, _CookieParser_input, __classPrivateFieldGet(this, _CookieParser_input, "f").slice(match[0].length), "f");
        return match[0].match('\n') !== null;
    }
    addCookie(keyValue, type) {
        if (__classPrivateFieldGet(this, _CookieParser_lastCookie, "f")) {
            __classPrivateFieldGet(this, _CookieParser_lastCookie, "f").setSize(keyValue.position - __classPrivateFieldGet(this, _CookieParser_lastCookiePosition, "f"));
        }
        // Mozilla bug 169091: Mozilla, IE and Chrome treat single token (w/o "=") as
        // specifying a value for a cookie with empty name.
        __classPrivateFieldSet(this, _CookieParser_lastCookie, typeof keyValue.value === 'string' ? new Cookie(keyValue.key, keyValue.value, type) :
            new Cookie('', keyValue.key, type), "f");
        if (__classPrivateFieldGet(this, _CookieParser_domain, "f")) {
            __classPrivateFieldGet(this, _CookieParser_lastCookie, "f").addAttribute("domain" /* Attribute.DOMAIN */, __classPrivateFieldGet(this, _CookieParser_domain, "f"));
        }
        __classPrivateFieldSet(this, _CookieParser_lastCookiePosition, keyValue.position, "f");
        __classPrivateFieldGet(this, _CookieParser_cookiesInternal, "f").push(__classPrivateFieldGet(this, _CookieParser_lastCookie, "f"));
    }
}
_CookieParser_domain = new WeakMap(), _CookieParser_cookiesInternal = new WeakMap(), _CookieParser_input = new WeakMap(), _CookieParser_originalInputLength = new WeakMap(), _CookieParser_lastCookie = new WeakMap(), _CookieParser_lastCookieLine = new WeakMap(), _CookieParser_lastCookiePosition = new WeakMap();
class KeyValue {
    constructor(key, value, position) {
        this.key = key;
        this.value = value;
        this.position = position;
    }
}
//# sourceMappingURL=CookieParser.js.map