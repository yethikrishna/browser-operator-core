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
var _a, _SearchConfig_query, _SearchConfig_ignoreCase, _SearchConfig_isRegex, _SearchConfig_queries, _SearchConfig_fileRegexQueries, _SearchConfig_parse, _SearchConfig_parseUnquotedQuery, _SearchConfig_parseQuotedQuery, _SearchConfig_parseFileQuery;
import * as Platform from '../../core/platform/platform.js';
export class SearchConfig {
    constructor(query, ignoreCase, isRegex) {
        _SearchConfig_query.set(this, void 0);
        _SearchConfig_ignoreCase.set(this, void 0);
        _SearchConfig_isRegex.set(this, void 0);
        _SearchConfig_queries.set(this, void 0);
        _SearchConfig_fileRegexQueries.set(this, void 0);
        __classPrivateFieldSet(this, _SearchConfig_query, query, "f");
        __classPrivateFieldSet(this, _SearchConfig_ignoreCase, ignoreCase, "f");
        __classPrivateFieldSet(this, _SearchConfig_isRegex, isRegex, "f");
        const { queries, fileRegexQueries } = __classPrivateFieldGet(_a, _a, "m", _SearchConfig_parse).call(_a, query, ignoreCase, isRegex);
        __classPrivateFieldSet(this, _SearchConfig_queries, queries, "f");
        __classPrivateFieldSet(this, _SearchConfig_fileRegexQueries, fileRegexQueries, "f");
    }
    static fromPlainObject(object) {
        return new _a(object.query, object.ignoreCase, object.isRegex);
    }
    filePathMatchesFileQuery(filePath) {
        return __classPrivateFieldGet(this, _SearchConfig_fileRegexQueries, "f").every(({ regex, shouldMatch }) => (Boolean(filePath.match(regex)) === shouldMatch));
    }
    queries() {
        return __classPrivateFieldGet(this, _SearchConfig_queries, "f");
    }
    query() {
        return __classPrivateFieldGet(this, _SearchConfig_query, "f");
    }
    ignoreCase() {
        return __classPrivateFieldGet(this, _SearchConfig_ignoreCase, "f");
    }
    isRegex() {
        return __classPrivateFieldGet(this, _SearchConfig_isRegex, "f");
    }
    toPlainObject() {
        return { query: this.query(), ignoreCase: this.ignoreCase(), isRegex: this.isRegex() };
    }
}
_a = SearchConfig, _SearchConfig_query = new WeakMap(), _SearchConfig_ignoreCase = new WeakMap(), _SearchConfig_isRegex = new WeakMap(), _SearchConfig_queries = new WeakMap(), _SearchConfig_fileRegexQueries = new WeakMap(), _SearchConfig_parse = function _SearchConfig_parse(query, ignoreCase, isRegex) {
    // Inside double quotes: any symbol except double quote and backslash or any symbol escaped with a backslash.
    const quotedPattern = /"([^\\"]|\\.)+"/;
    // A word is a sequence of any symbols except space and backslash or any symbols escaped with a backslash, that does not start with file:.
    const unquotedWordPattern = /(\s*(?!-?f(ile)?:)[^\\ ]|\\.)+/;
    const unquotedPattern = unquotedWordPattern.source + '(\\s+' + unquotedWordPattern.source + ')*';
    const pattern = [
        '(\\s*' + FilePatternRegex.source + '\\s*)',
        '(' + quotedPattern.source + ')',
        '(' + unquotedPattern + ')',
    ].join('|');
    const regexp = new RegExp(pattern, 'g');
    const queryParts = query.match(regexp) || [];
    const queries = [];
    const fileRegexQueries = [];
    for (const queryPart of queryParts) {
        if (!queryPart) {
            continue;
        }
        const fileQuery = __classPrivateFieldGet(_a, _a, "m", _SearchConfig_parseFileQuery).call(_a, queryPart);
        if (fileQuery) {
            const regex = new RegExp(fileQuery.text, ignoreCase ? 'i' : '');
            fileRegexQueries.push({ regex, shouldMatch: fileQuery.shouldMatch });
        }
        else if (isRegex) {
            queries.push(queryPart);
        }
        else if (queryPart.startsWith('"') && queryPart.endsWith('"')) {
            queries.push(__classPrivateFieldGet(_a, _a, "m", _SearchConfig_parseQuotedQuery).call(_a, queryPart));
        }
        else {
            queries.push(__classPrivateFieldGet(_a, _a, "m", _SearchConfig_parseUnquotedQuery).call(_a, queryPart));
        }
    }
    return { queries, fileRegexQueries };
}, _SearchConfig_parseUnquotedQuery = function _SearchConfig_parseUnquotedQuery(query) {
    return query.replace(/\\(.)/g, '$1');
}, _SearchConfig_parseQuotedQuery = function _SearchConfig_parseQuotedQuery(query) {
    return query.substring(1, query.length - 1).replace(/\\(.)/g, '$1');
}, _SearchConfig_parseFileQuery = function _SearchConfig_parseFileQuery(query) {
    const match = query.match(FilePatternRegex);
    if (!match) {
        return null;
    }
    query = match[3];
    let result = '';
    for (let i = 0; i < query.length; ++i) {
        const char = query[i];
        if (char === '*') {
            result += '.*';
        }
        else if (char === '\\') {
            ++i;
            const nextChar = query[i];
            if (nextChar === ' ') {
                result += ' ';
            }
        }
        else {
            if (Platform.StringUtilities.regexSpecialCharacters().indexOf(query.charAt(i)) !== -1) {
                result += '\\';
            }
            result += query.charAt(i);
        }
    }
    const shouldMatch = !Boolean(match[1]);
    return { text: result, shouldMatch };
};
// After file: prefix: any symbol except space and backslash or any symbol escaped with a backslash.
const FilePatternRegex = /(-)?f(ile)?:((?:[^\\ ]|\\.)+)/;
//# sourceMappingURL=SearchConfig.js.map