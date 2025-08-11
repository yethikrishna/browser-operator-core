// Copyright 2018 The Chromium Authors. All rights reserved.
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
var _a, _NetworkSearchScope_networkLog, _NetworkSearchScope_responseBodyMatches;
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as NetworkForward from '../../panels/network/forward/forward.js';
const UIStrings = {
    /**
     *@description Text for web URLs
     */
    url: 'URL',
};
const str_ = i18n.i18n.registerUIStrings('panels/network/NetworkSearchScope.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class NetworkSearchScope {
    constructor(networkLog) {
        _NetworkSearchScope_networkLog.set(this, void 0);
        __classPrivateFieldSet(this, _NetworkSearchScope_networkLog, networkLog, "f");
    }
    performIndexing(progress) {
        queueMicrotask(() => {
            progress.done();
        });
    }
    async performSearch(searchConfig, progress, searchResultCallback, searchFinishedCallback) {
        const promises = [];
        const requests = __classPrivateFieldGet(this, _NetworkSearchScope_networkLog, "f").requests().filter(request => searchConfig.filePathMatchesFileQuery(request.url()));
        progress.setTotalWork(requests.length);
        for (const request of requests) {
            const promise = this.searchRequest(searchConfig, request, progress);
            promises.push(promise);
        }
        const resultsWithNull = await Promise.all(promises);
        const results = (resultsWithNull.filter(result => result !== null));
        if (progress.isCanceled()) {
            searchFinishedCallback(false);
            return;
        }
        for (const result of results.sort((r1, r2) => r1.label().localeCompare(r2.label()))) {
            if (result.matchesCount() > 0) {
                searchResultCallback(result);
            }
        }
        progress.done();
        searchFinishedCallback(true);
    }
    async searchRequest(searchConfig, request, progress) {
        const bodyMatches = await __classPrivateFieldGet(_a, _a, "m", _NetworkSearchScope_responseBodyMatches).call(_a, searchConfig, request);
        if (progress.isCanceled()) {
            return null;
        }
        const locations = [];
        if (stringMatchesQuery(request.url())) {
            locations.push(NetworkForward.UIRequestLocation.UIRequestLocation.urlMatch(request));
        }
        for (const header of request.requestHeaders()) {
            if (headerMatchesQuery(header)) {
                locations.push(NetworkForward.UIRequestLocation.UIRequestLocation.requestHeaderMatch(request, header));
            }
        }
        for (const header of request.responseHeaders) {
            if (headerMatchesQuery(header)) {
                locations.push(NetworkForward.UIRequestLocation.UIRequestLocation.responseHeaderMatch(request, header));
            }
        }
        for (const match of bodyMatches) {
            locations.push(NetworkForward.UIRequestLocation.UIRequestLocation.bodyMatch(request, match));
        }
        progress.incrementWorked();
        return new NetworkSearchResult(request, locations);
        function headerMatchesQuery(header) {
            return stringMatchesQuery(`${header.name}: ${header.value}`);
        }
        function stringMatchesQuery(string) {
            const flags = searchConfig.ignoreCase() ? 'i' : '';
            const regExps = searchConfig.queries().map(query => new RegExp(Platform.StringUtilities.escapeForRegExp(query), flags));
            let pos = 0;
            for (const regExp of regExps) {
                const match = string.substr(pos).match(regExp);
                if (match?.index === undefined) {
                    return false;
                }
                pos += match.index + match[0].length;
            }
            return true;
        }
    }
    stopSearch() {
    }
}
_a = NetworkSearchScope, _NetworkSearchScope_networkLog = new WeakMap(), _NetworkSearchScope_responseBodyMatches = async function _NetworkSearchScope_responseBodyMatches(searchConfig, request) {
    if (!request.contentType().isTextType()) {
        return [];
    }
    let matches = [];
    for (const query of searchConfig.queries()) {
        const tmpMatches = await request.searchInContent(query, !searchConfig.ignoreCase(), searchConfig.isRegex());
        if (tmpMatches.length === 0) {
            // Mirror file search that all individual queries must produce matches.
            return [];
        }
        matches =
            Platform.ArrayUtilities.mergeOrdered(matches, tmpMatches, TextUtils.ContentProvider.SearchMatch.comparator);
    }
    return matches;
};
export class NetworkSearchResult {
    constructor(request, locations) {
        this.request = request;
        this.locations = locations;
    }
    matchesCount() {
        return this.locations.length;
    }
    label() {
        return this.request.displayName;
    }
    description() {
        const parsedUrl = this.request.parsedURL;
        if (!parsedUrl) {
            return this.request.url();
        }
        return parsedUrl.urlWithoutScheme();
    }
    matchLineContent(index) {
        const location = this.locations[index];
        if (location.isUrlMatch) {
            return this.request.url();
        }
        const header = location?.header?.header;
        if (header) {
            return header.value;
        }
        return location.searchMatch.lineContent;
    }
    matchRevealable(index) {
        return this.locations[index];
    }
    matchLabel(index) {
        const location = this.locations[index];
        if (location.isUrlMatch) {
            return i18nString(UIStrings.url);
        }
        const header = location?.header?.header;
        if (header) {
            return `${header.name}:`;
        }
        return (location.searchMatch.lineNumber + 1).toString();
    }
    matchColumn(index) {
        const location = this.locations[index];
        return location.searchMatch?.columnNumber;
    }
    matchLength(index) {
        const location = this.locations[index];
        return location.searchMatch?.matchLength;
    }
}
//# sourceMappingURL=NetworkSearchScope.js.map