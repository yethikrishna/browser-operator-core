// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _SourceMap_instances, _a, _SourceMap_json, _SourceMap_compiledURLInternal, _SourceMap_sourceMappingURL, _SourceMap_baseURL, _SourceMap_mappingsInternal, _SourceMap_sourceInfos, _SourceMap_sourceInfoByURL, _SourceMap_scopesInfo, _SourceMap_sourceIndex, _SourceMap_ensureMappingsProcessed, _SourceMap_computeReverseMappings, _TokenIterator_string, _TokenIterator_position;
/*
 * Copyright (C) 2012 Google Inc. All rights reserved.
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
 *     * Neither the #name of Google Inc. nor the names of its
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
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import * as Platform from '../platform/platform.js';
import * as Root from '../root/root.js';
import { buildOriginalScopes, decodePastaRanges } from './SourceMapFunctionRanges.js';
import { decodeScopes } from './SourceMapScopes.js';
import { SourceMapScopesInfo } from './SourceMapScopesInfo.js';
/**
 * Parses the {@link content} as JSON, ignoring BOM markers in the beginning, and
 * also handling the CORB bypass prefix correctly.
 *
 * @param content the string representation of a sourcemap.
 * @returns the {@link SourceMapV3} representation of the {@link content}.
 */
export function parseSourceMap(content) {
    if (content.startsWith(')]}')) {
        content = content.substring(content.indexOf('\n'));
    }
    if (content.charCodeAt(0) === 0xFEFF) {
        // Strip BOM at the beginning before parsing the JSON.
        content = content.slice(1);
    }
    return JSON.parse(content);
}
export class SourceMapEntry {
    constructor(lineNumber, columnNumber, sourceIndex, sourceURL, sourceLineNumber, sourceColumnNumber, name) {
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber;
        this.sourceIndex = sourceIndex;
        this.sourceURL = sourceURL;
        this.sourceLineNumber = sourceLineNumber;
        this.sourceColumnNumber = sourceColumnNumber;
        this.name = name;
    }
    static compare(entry1, entry2) {
        if (entry1.lineNumber !== entry2.lineNumber) {
            return entry1.lineNumber - entry2.lineNumber;
        }
        return entry1.columnNumber - entry2.columnNumber;
    }
}
export class SourceMap {
    /**
     * Implements Source Map V3 model. See https://github.com/google/closure-compiler/wiki/Source-Maps
     * for format description.
     */
    constructor(compiledURL, sourceMappingURL, payload) {
        _SourceMap_instances.add(this);
        _SourceMap_json.set(this, void 0);
        _SourceMap_compiledURLInternal.set(this, void 0);
        _SourceMap_sourceMappingURL.set(this, void 0);
        _SourceMap_baseURL.set(this, void 0);
        _SourceMap_mappingsInternal.set(this, void 0);
        _SourceMap_sourceInfos.set(this, []);
        _SourceMap_sourceInfoByURL.set(this, new Map());
        _SourceMap_scopesInfo.set(this, null);
        __classPrivateFieldSet(this, _SourceMap_json, payload, "f");
        __classPrivateFieldSet(this, _SourceMap_compiledURLInternal, compiledURL, "f");
        __classPrivateFieldSet(this, _SourceMap_sourceMappingURL, sourceMappingURL, "f");
        __classPrivateFieldSet(this, _SourceMap_baseURL, (Common.ParsedURL.schemeIs(sourceMappingURL, 'data:')) ? compiledURL : sourceMappingURL, "f");
        __classPrivateFieldSet(this, _SourceMap_mappingsInternal, null, "f");
        if ('sections' in __classPrivateFieldGet(this, _SourceMap_json, "f")) {
            if (__classPrivateFieldGet(this, _SourceMap_json, "f").sections.find(section => 'url' in section)) {
                Common.Console.Console.instance().warn(`SourceMap "${sourceMappingURL}" contains unsupported "URL" field in one of its sections.`);
            }
        }
        this.eachSection(this.parseSources.bind(this));
    }
    json() {
        return __classPrivateFieldGet(this, _SourceMap_json, "f");
    }
    augmentWithScopes(scriptUrl, ranges) {
        __classPrivateFieldGet(this, _SourceMap_instances, "m", _SourceMap_ensureMappingsProcessed).call(this);
        if (__classPrivateFieldGet(this, _SourceMap_json, "f") && __classPrivateFieldGet(this, _SourceMap_json, "f").version > 3) {
            throw new Error('Only support augmenting source maps up to version 3.');
        }
        // Ensure scriptUrl is associated with sourceMap sources
        const sourceIdx = __classPrivateFieldGet(this, _SourceMap_instances, "m", _SourceMap_sourceIndex).call(this, scriptUrl);
        if (sourceIdx >= 0) {
            if (!__classPrivateFieldGet(this, _SourceMap_scopesInfo, "f")) {
                // First time seeing this sourcemap, create an new empty scopesInfo object
                __classPrivateFieldSet(this, _SourceMap_scopesInfo, new SourceMapScopesInfo(this, { scopes: [], ranges: [] }), "f");
            }
            if (!__classPrivateFieldGet(this, _SourceMap_scopesInfo, "f").hasOriginalScopes(sourceIdx)) {
                const originalScopes = buildOriginalScopes(ranges);
                __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f").addOriginalScopesAtIndex(sourceIdx, originalScopes);
            }
        }
        else {
            throw new Error(`Could not find sourceURL ${scriptUrl} in sourceMap`);
        }
    }
    compiledURL() {
        return __classPrivateFieldGet(this, _SourceMap_compiledURLInternal, "f");
    }
    url() {
        return __classPrivateFieldGet(this, _SourceMap_sourceMappingURL, "f");
    }
    sourceURLs() {
        return [...__classPrivateFieldGet(this, _SourceMap_sourceInfoByURL, "f").keys()];
    }
    embeddedContentByURL(sourceURL) {
        const entry = __classPrivateFieldGet(this, _SourceMap_sourceInfoByURL, "f").get(sourceURL);
        if (!entry) {
            return null;
        }
        return entry.content;
    }
    hasScopeInfo() {
        __classPrivateFieldGet(this, _SourceMap_instances, "m", _SourceMap_ensureMappingsProcessed).call(this);
        return __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f") !== null;
    }
    findEntry(lineNumber, columnNumber, inlineFrameIndex) {
        __classPrivateFieldGet(this, _SourceMap_instances, "m", _SourceMap_ensureMappingsProcessed).call(this);
        if (inlineFrameIndex && __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f") !== null) {
            // For inlineFrameIndex != 0 we use the callsite info for the corresponding inlining site.
            // Note that the callsite for "inlineFrameIndex" is actually in the previous frame.
            const { inlinedFunctions } = __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f").findInlinedFunctions(lineNumber, columnNumber);
            const { callsite } = inlinedFunctions[inlineFrameIndex - 1];
            if (!callsite) {
                console.error('Malformed source map. Expected to have a callsite info for index', inlineFrameIndex);
                return null;
            }
            return {
                lineNumber,
                columnNumber,
                sourceIndex: callsite.sourceIndex,
                sourceURL: this.sourceURLs()[callsite.sourceIndex],
                sourceLineNumber: callsite.line,
                sourceColumnNumber: callsite.column,
                name: undefined,
            };
        }
        const mappings = this.mappings();
        const index = Platform.ArrayUtilities.upperBound(mappings, undefined, (_, entry) => lineNumber - entry.lineNumber || columnNumber - entry.columnNumber);
        return index ? mappings[index - 1] : null;
    }
    findEntryRanges(lineNumber, columnNumber) {
        const mappings = this.mappings();
        const endIndex = Platform.ArrayUtilities.upperBound(mappings, undefined, (_, entry) => lineNumber - entry.lineNumber || columnNumber - entry.columnNumber);
        if (!endIndex) {
            // If the line and column are preceding all the entries, then there is nothing to map.
            return null;
        }
        // startIndex must be within mappings range because endIndex must be not falsy
        const startIndex = endIndex - 1;
        const sourceURL = mappings[startIndex].sourceURL;
        if (!sourceURL) {
            return null;
        }
        // Let us compute the range that contains the source position in the compiled code.
        const endLine = endIndex < mappings.length ? mappings[endIndex].lineNumber : 2 ** 31 - 1;
        const endColumn = endIndex < mappings.length ? mappings[endIndex].columnNumber : 2 ** 31 - 1;
        const range = new TextUtils.TextRange.TextRange(mappings[startIndex].lineNumber, mappings[startIndex].columnNumber, endLine, endColumn);
        // Now try to find the corresponding token in the original code.
        const reverseMappings = this.reversedMappings(sourceURL);
        const startSourceLine = mappings[startIndex].sourceLineNumber;
        const startSourceColumn = mappings[startIndex].sourceColumnNumber;
        const endReverseIndex = Platform.ArrayUtilities.upperBound(reverseMappings, undefined, (_, i) => startSourceLine - mappings[i].sourceLineNumber || startSourceColumn - mappings[i].sourceColumnNumber);
        if (!endReverseIndex) {
            return null;
        }
        const endSourceLine = endReverseIndex < reverseMappings.length ?
            mappings[reverseMappings[endReverseIndex]].sourceLineNumber :
            2 ** 31 - 1;
        const endSourceColumn = endReverseIndex < reverseMappings.length ?
            mappings[reverseMappings[endReverseIndex]].sourceColumnNumber :
            2 ** 31 - 1;
        const sourceRange = new TextUtils.TextRange.TextRange(startSourceLine, startSourceColumn, endSourceLine, endSourceColumn);
        return { range, sourceRange, sourceURL };
    }
    sourceLineMapping(sourceURL, lineNumber, columnNumber) {
        const mappings = this.mappings();
        const reverseMappings = this.reversedMappings(sourceURL);
        const first = Platform.ArrayUtilities.lowerBound(reverseMappings, lineNumber, lineComparator);
        const last = Platform.ArrayUtilities.upperBound(reverseMappings, lineNumber, lineComparator);
        if (first >= reverseMappings.length || mappings[reverseMappings[first]].sourceLineNumber !== lineNumber) {
            return null;
        }
        const columnMappings = reverseMappings.slice(first, last);
        if (!columnMappings.length) {
            return null;
        }
        const index = Platform.ArrayUtilities.lowerBound(columnMappings, columnNumber, (columnNumber, i) => columnNumber - mappings[i].sourceColumnNumber);
        return index >= columnMappings.length ? mappings[columnMappings[columnMappings.length - 1]] :
            mappings[columnMappings[index]];
        function lineComparator(lineNumber, i) {
            return lineNumber - mappings[i].sourceLineNumber;
        }
    }
    findReverseIndices(sourceURL, lineNumber, columnNumber) {
        const mappings = this.mappings();
        const reverseMappings = this.reversedMappings(sourceURL);
        const endIndex = Platform.ArrayUtilities.upperBound(reverseMappings, undefined, (_, i) => lineNumber - mappings[i].sourceLineNumber || columnNumber - mappings[i].sourceColumnNumber);
        let startIndex = endIndex;
        while (startIndex > 0 &&
            mappings[reverseMappings[startIndex - 1]].sourceLineNumber ===
                mappings[reverseMappings[endIndex - 1]].sourceLineNumber &&
            mappings[reverseMappings[startIndex - 1]].sourceColumnNumber ===
                mappings[reverseMappings[endIndex - 1]].sourceColumnNumber) {
            --startIndex;
        }
        return reverseMappings.slice(startIndex, endIndex);
    }
    findReverseEntries(sourceURL, lineNumber, columnNumber) {
        const mappings = this.mappings();
        return this.findReverseIndices(sourceURL, lineNumber, columnNumber).map(i => mappings[i]);
    }
    findReverseRanges(sourceURL, lineNumber, columnNumber) {
        const mappings = this.mappings();
        const indices = this.findReverseIndices(sourceURL, lineNumber, columnNumber);
        const ranges = [];
        for (let i = 0; i < indices.length; ++i) {
            const startIndex = indices[i];
            // Merge adjacent ranges.
            let endIndex = startIndex + 1;
            while (i + 1 < indices.length && endIndex === indices[i + 1]) {
                ++endIndex;
                ++i;
            }
            // Source maps don't contain end positions for entries, but each entry is assumed to
            // span until the following entry. This doesn't work however in case of the last
            // entry, where there's no following entry. We also don't know the number of lines
            // and columns in the original source code (which might not be available at all), so
            // for that case we store the maximum signed 32-bit integer, which is definitely going
            // to be larger than any script we can process and can safely be serialized as part of
            // the skip list we send to V8 with `Debugger.stepOver` (http://crbug.com/1305956).
            const startLine = mappings[startIndex].lineNumber;
            const startColumn = mappings[startIndex].columnNumber;
            const endLine = endIndex < mappings.length ? mappings[endIndex].lineNumber : 2 ** 31 - 1;
            const endColumn = endIndex < mappings.length ? mappings[endIndex].columnNumber : 2 ** 31 - 1;
            ranges.push(new TextUtils.TextRange.TextRange(startLine, startColumn, endLine, endColumn));
        }
        return ranges;
    }
    mappings() {
        __classPrivateFieldGet(this, _SourceMap_instances, "m", _SourceMap_ensureMappingsProcessed).call(this);
        return __classPrivateFieldGet(this, _SourceMap_mappingsInternal, "f") ?? [];
    }
    reversedMappings(sourceURL) {
        __classPrivateFieldGet(this, _SourceMap_instances, "m", _SourceMap_ensureMappingsProcessed).call(this);
        return __classPrivateFieldGet(this, _SourceMap_sourceInfoByURL, "f").get(sourceURL)?.reverseMappings ?? [];
    }
    eachSection(callback) {
        if (!__classPrivateFieldGet(this, _SourceMap_json, "f")) {
            return;
        }
        if ('sections' in __classPrivateFieldGet(this, _SourceMap_json, "f")) {
            let sourcesIndex = 0;
            for (const section of __classPrivateFieldGet(this, _SourceMap_json, "f").sections) {
                if ('map' in section) {
                    callback(section.map, sourcesIndex, section.offset.line, section.offset.column);
                    sourcesIndex += section.map.sources.length;
                }
            }
        }
        else {
            callback(__classPrivateFieldGet(this, _SourceMap_json, "f"), 0, 0, 0);
        }
    }
    parseSources(sourceMap) {
        const sourceRoot = sourceMap.sourceRoot ?? '';
        const ignoreList = new Set(sourceMap.ignoreList ?? sourceMap.x_google_ignoreList);
        for (let i = 0; i < sourceMap.sources.length; ++i) {
            let href = sourceMap.sources[i];
            // The source map v3 proposal says to prepend the sourceRoot to the source URL
            // and if the resulting URL is not absolute, then resolve the source URL against
            // the source map URL. Prepending the sourceRoot (if one exists) is not likely to
            // be meaningful or useful if the source URL is already absolute though. In this
            // case, use the source URL as is without prepending the sourceRoot.
            if (Common.ParsedURL.ParsedURL.isRelativeURL(href)) {
                if (sourceRoot && !sourceRoot.endsWith('/') && href && !href.startsWith('/')) {
                    href = sourceRoot.concat('/', href);
                }
                else {
                    href = sourceRoot.concat(href);
                }
            }
            const url = Common.ParsedURL.ParsedURL.completeURL(__classPrivateFieldGet(this, _SourceMap_baseURL, "f"), href) || href;
            const source = sourceMap.sourcesContent?.[i];
            const sourceInfo = {
                sourceURL: url,
                content: source ?? null,
                ignoreListHint: ignoreList.has(i),
                reverseMappings: null,
            };
            __classPrivateFieldGet(this, _SourceMap_sourceInfos, "f").push(sourceInfo);
            if (!__classPrivateFieldGet(this, _SourceMap_sourceInfoByURL, "f").has(url)) {
                __classPrivateFieldGet(this, _SourceMap_sourceInfoByURL, "f").set(url, sourceInfo);
            }
        }
    }
    parseMap(map, baseSourceIndex, baseLineNumber, baseColumnNumber) {
        let sourceIndex = baseSourceIndex;
        let lineNumber = baseLineNumber;
        let columnNumber = baseColumnNumber;
        let sourceLineNumber = 0;
        let sourceColumnNumber = 0;
        let nameIndex = 0;
        const names = map.names ?? [];
        const tokenIter = new TokenIterator(map.mappings);
        let sourceURL = __classPrivateFieldGet(this, _SourceMap_sourceInfos, "f")[sourceIndex]?.sourceURL;
        while (true) {
            if (tokenIter.peek() === ',') {
                tokenIter.next();
            }
            else {
                while (tokenIter.peek() === ';') {
                    lineNumber += 1;
                    columnNumber = 0;
                    tokenIter.next();
                }
                if (!tokenIter.hasNext()) {
                    break;
                }
            }
            columnNumber += tokenIter.nextVLQ();
            if (!tokenIter.hasNext() || this.isSeparator(tokenIter.peek())) {
                this.mappings().push(new SourceMapEntry(lineNumber, columnNumber));
                continue;
            }
            const sourceIndexDelta = tokenIter.nextVLQ();
            if (sourceIndexDelta) {
                sourceIndex += sourceIndexDelta;
                sourceURL = __classPrivateFieldGet(this, _SourceMap_sourceInfos, "f")[sourceIndex]?.sourceURL;
            }
            sourceLineNumber += tokenIter.nextVLQ();
            sourceColumnNumber += tokenIter.nextVLQ();
            if (!tokenIter.hasNext() || this.isSeparator(tokenIter.peek())) {
                this.mappings().push(new SourceMapEntry(lineNumber, columnNumber, sourceIndex, sourceURL, sourceLineNumber, sourceColumnNumber));
                continue;
            }
            nameIndex += tokenIter.nextVLQ();
            this.mappings().push(new SourceMapEntry(lineNumber, columnNumber, sourceIndex, sourceURL, sourceLineNumber, sourceColumnNumber, names[nameIndex]));
        }
        if (Root.Runtime.experiments.isEnabled("use-source-map-scopes" /* Root.Runtime.ExperimentName.USE_SOURCE_MAP_SCOPES */)) {
            if (!__classPrivateFieldGet(this, _SourceMap_scopesInfo, "f")) {
                __classPrivateFieldSet(this, _SourceMap_scopesInfo, new SourceMapScopesInfo(this, { scopes: [], ranges: [] }), "f");
            }
            if (map.originalScopes && map.generatedRanges) {
                const { originalScopes, generatedRanges } = decodeScopes(map, { line: baseLineNumber, column: baseColumnNumber });
                __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f").addOriginalScopes(originalScopes);
                __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f").addGeneratedRanges(generatedRanges);
            }
            else if (map.x_com_bloomberg_sourcesFunctionMappings) {
                const originalScopes = this.parseBloombergScopes(map);
                __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f").addOriginalScopes(originalScopes);
            }
            else {
                // Keep the OriginalScope[] tree array consistent with sources.
                __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f").addOriginalScopes(new Array(map.sources.length));
            }
        }
    }
    parseBloombergScopes(map) {
        const scopeList = map.x_com_bloomberg_sourcesFunctionMappings;
        if (!scopeList) {
            throw new Error('Cant decode pasta scopes without x_com_bloomberg_sourcesFunctionMappings field');
        }
        else if (scopeList.length !== map.sources.length) {
            throw new Error(`x_com_bloomberg_sourcesFunctionMappings must have ${map.sources.length} scope trees`);
        }
        const names = map.names ?? [];
        return scopeList.map(rawScopes => {
            if (!rawScopes) {
                return undefined;
            }
            const ranges = decodePastaRanges(rawScopes, names);
            return buildOriginalScopes(ranges);
        });
    }
    isSeparator(char) {
        return char === ',' || char === ';';
    }
    /**
     * Finds all the reverse mappings that intersect with the given `textRange` within the
     * source entity identified by the `url`. If the `url` does not have any reverse mappings
     * within this source map, an empty array is returned.
     *
     * @param url the URL of the source entity to query.
     * @param textRange the range of text within the entity to check, considered `[start,end[`.
     * @returns the list of ranges in the generated file that map to locations overlapping the
     *          {@link textRange} in the source file identified by the {@link url}, or `[]`
     *          if the {@link url} does not identify an entity in this source map.
     */
    reverseMapTextRanges(url, textRange) {
        const reverseMappings = this.reversedMappings(url);
        const mappings = this.mappings();
        if (reverseMappings.length === 0) {
            return [];
        }
        // Determine the first reverse mapping that contains the starting point of the `textRange`.
        let startReverseIndex = Platform.ArrayUtilities.lowerBound(reverseMappings, textRange, ({ startLine, startColumn }, index) => {
            const { sourceLineNumber, sourceColumnNumber } = mappings[index];
            return startLine - sourceLineNumber || startColumn - sourceColumnNumber;
        });
        // Check if the current mapping does not start on the exact start of the `textRange`, and if
        // so we know that a previous mapping entry (if any) would also overlap. If we reach the end
        // of the reverse mappings table, we just take the last entry and report that.
        while (startReverseIndex === reverseMappings.length ||
            startReverseIndex > 0 &&
                (mappings[reverseMappings[startReverseIndex]].sourceLineNumber > textRange.startLine ||
                    mappings[reverseMappings[startReverseIndex]].sourceColumnNumber > textRange.startColumn)) {
            startReverseIndex--;
        }
        // Determine the last reverse mapping that contains the end point of the `textRange`.
        let endReverseIndex = startReverseIndex + 1;
        for (; endReverseIndex < reverseMappings.length; ++endReverseIndex) {
            const { sourceLineNumber, sourceColumnNumber } = mappings[reverseMappings[endReverseIndex]];
            if (sourceLineNumber < textRange.endLine ||
                (sourceLineNumber === textRange.endLine && sourceColumnNumber < textRange.endColumn)) {
                continue;
            }
            break;
        }
        // Create the ranges...
        const ranges = [];
        for (let reverseIndex = startReverseIndex; reverseIndex < endReverseIndex; ++reverseIndex) {
            const startIndex = reverseMappings[reverseIndex], endIndex = startIndex + 1;
            const range = TextUtils.TextRange.TextRange.createUnboundedFromLocation(mappings[startIndex].lineNumber, mappings[startIndex].columnNumber);
            if (endIndex < mappings.length) {
                range.endLine = mappings[endIndex].lineNumber;
                range.endColumn = mappings[endIndex].columnNumber;
            }
            ranges.push(range);
        }
        // ...sort them...
        ranges.sort(TextUtils.TextRange.TextRange.comparator);
        // ...and ensure they are maximally merged.
        let j = 0;
        for (let i = 1; i < ranges.length; ++i) {
            if (ranges[j].immediatelyPrecedes(ranges[i])) {
                ranges[j].endLine = ranges[i].endLine;
                ranges[j].endColumn = ranges[i].endColumn;
            }
            else {
                ranges[++j] = ranges[i];
            }
        }
        ranges.length = j + 1;
        return ranges;
    }
    mapsOrigin() {
        const mappings = this.mappings();
        if (mappings.length > 0) {
            const firstEntry = mappings[0];
            return firstEntry?.lineNumber === 0 || firstEntry.columnNumber === 0;
        }
        return false;
    }
    hasIgnoreListHint(sourceURL) {
        return __classPrivateFieldGet(this, _SourceMap_sourceInfoByURL, "f").get(sourceURL)?.ignoreListHint ?? false;
    }
    /**
     * Returns a list of ranges in the generated script for original sources that
     * match a predicate. Each range is a [begin, end) pair, meaning that code at
     * the beginning location, up to but not including the end location, matches
     * the predicate.
     */
    findRanges(predicate, options) {
        const mappings = this.mappings();
        const ranges = [];
        if (!mappings.length) {
            return [];
        }
        let current = null;
        // If the first mapping isn't at the beginning of the original source, it's
        // up to the caller to decide if it should be considered matching the
        // predicate or not. By default, it's not.
        if ((mappings[0].lineNumber !== 0 || mappings[0].columnNumber !== 0) && options?.isStartMatching) {
            current = TextUtils.TextRange.TextRange.createUnboundedFromLocation(0, 0);
            ranges.push(current);
        }
        for (const { sourceURL, lineNumber, columnNumber } of mappings) {
            const ignoreListHint = sourceURL && predicate(sourceURL);
            if (!current && ignoreListHint) {
                current = TextUtils.TextRange.TextRange.createUnboundedFromLocation(lineNumber, columnNumber);
                ranges.push(current);
                continue;
            }
            if (current && !ignoreListHint) {
                current.endLine = lineNumber;
                current.endColumn = columnNumber;
                current = null;
            }
        }
        return ranges;
    }
    /**
     * Determines whether this and the {@link other} `SourceMap` agree on content and ignore-list hint
     * with respect to the {@link sourceURL}.
     *
     * @param sourceURL the URL to test for (might not be provided by either of the sourcemaps).
     * @param other the other `SourceMap` to check.
     * @returns `true` if both this and the {@link other} `SourceMap` either both have the ignore-list
     *          hint for {@link sourceURL} or neither, and if both of them either provide the same
     *          content for the {@link sourceURL} inline or both provide no `sourcesContent` entry
     *          for it.
     */
    compatibleForURL(sourceURL, other) {
        return this.embeddedContentByURL(sourceURL) === other.embeddedContentByURL(sourceURL) &&
            this.hasIgnoreListHint(sourceURL) === other.hasIgnoreListHint(sourceURL);
    }
    expandCallFrame(frame) {
        __classPrivateFieldGet(this, _SourceMap_instances, "m", _SourceMap_ensureMappingsProcessed).call(this);
        if (__classPrivateFieldGet(this, _SourceMap_scopesInfo, "f") === null) {
            return [frame];
        }
        return __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f").expandCallFrame(frame);
    }
    resolveScopeChain(frame) {
        __classPrivateFieldGet(this, _SourceMap_instances, "m", _SourceMap_ensureMappingsProcessed).call(this);
        if (__classPrivateFieldGet(this, _SourceMap_scopesInfo, "f") === null) {
            return null;
        }
        return __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f").resolveMappedScopeChain(frame);
    }
    findOriginalFunctionName(position) {
        __classPrivateFieldGet(this, _SourceMap_instances, "m", _SourceMap_ensureMappingsProcessed).call(this);
        return __classPrivateFieldGet(this, _SourceMap_scopesInfo, "f")?.findOriginalFunctionName(position) ?? null;
    }
}
_a = SourceMap, _SourceMap_json = new WeakMap(), _SourceMap_compiledURLInternal = new WeakMap(), _SourceMap_sourceMappingURL = new WeakMap(), _SourceMap_baseURL = new WeakMap(), _SourceMap_mappingsInternal = new WeakMap(), _SourceMap_sourceInfos = new WeakMap(), _SourceMap_sourceInfoByURL = new WeakMap(), _SourceMap_scopesInfo = new WeakMap(), _SourceMap_instances = new WeakSet(), _SourceMap_sourceIndex = function _SourceMap_sourceIndex(sourceURL) {
    return __classPrivateFieldGet(this, _SourceMap_sourceInfos, "f").findIndex(info => info.sourceURL === sourceURL);
}, _SourceMap_ensureMappingsProcessed = function _SourceMap_ensureMappingsProcessed() {
    if (__classPrivateFieldGet(this, _SourceMap_mappingsInternal, "f") === null) {
        __classPrivateFieldSet(this, _SourceMap_mappingsInternal, [], "f");
        try {
            this.eachSection(this.parseMap.bind(this));
        }
        catch (e) {
            console.error('Failed to parse source map', e);
            __classPrivateFieldSet(this, _SourceMap_mappingsInternal, [], "f");
        }
        // As per spec, mappings are not necessarily sorted.
        this.mappings().sort(SourceMapEntry.compare);
        __classPrivateFieldGet(this, _SourceMap_instances, "m", _SourceMap_computeReverseMappings).call(this, __classPrivateFieldGet(this, _SourceMap_mappingsInternal, "f"));
    }
    if (!_a.retainRawSourceMaps) {
        __classPrivateFieldSet(this, _SourceMap_json, null, "f");
    }
}, _SourceMap_computeReverseMappings = function _SourceMap_computeReverseMappings(mappings) {
    const reverseMappingsPerUrl = new Map();
    for (let i = 0; i < mappings.length; i++) {
        const entryUrl = mappings[i].sourceURL;
        if (!entryUrl) {
            continue;
        }
        let reverseMap = reverseMappingsPerUrl.get(entryUrl);
        if (!reverseMap) {
            reverseMap = [];
            reverseMappingsPerUrl.set(entryUrl, reverseMap);
        }
        reverseMap.push(i);
    }
    for (const [url, reverseMap] of reverseMappingsPerUrl.entries()) {
        const info = __classPrivateFieldGet(this, _SourceMap_sourceInfoByURL, "f").get(url);
        if (!info) {
            continue;
        }
        reverseMap.sort(sourceMappingComparator);
        info.reverseMappings = reverseMap;
    }
    function sourceMappingComparator(indexA, indexB) {
        const a = mappings[indexA];
        const b = mappings[indexB];
        return a.sourceLineNumber - b.sourceLineNumber || a.sourceColumnNumber - b.sourceColumnNumber ||
            a.lineNumber - b.lineNumber || a.columnNumber - b.columnNumber;
    }
};
SourceMap.retainRawSourceMaps = false;
const VLQ_BASE_SHIFT = 5;
const VLQ_BASE_MASK = (1 << 5) - 1;
const VLQ_CONTINUATION_MASK = 1 << 5;
export class TokenIterator {
    constructor(string) {
        _TokenIterator_string.set(this, void 0);
        _TokenIterator_position.set(this, void 0);
        __classPrivateFieldSet(this, _TokenIterator_string, string, "f");
        __classPrivateFieldSet(this, _TokenIterator_position, 0, "f");
    }
    next() {
        var _b, _c;
        return __classPrivateFieldGet(this, _TokenIterator_string, "f").charAt((__classPrivateFieldSet(this, _TokenIterator_position, (_c = __classPrivateFieldGet(this, _TokenIterator_position, "f"), _b = _c++, _c), "f"), _b));
    }
    /** Returns the unicode value of the next character and advances the iterator  */
    nextCharCode() {
        var _b, _c;
        return __classPrivateFieldGet(this, _TokenIterator_string, "f").charCodeAt((__classPrivateFieldSet(this, _TokenIterator_position, (_c = __classPrivateFieldGet(this, _TokenIterator_position, "f"), _b = _c++, _c), "f"), _b));
    }
    peek() {
        return __classPrivateFieldGet(this, _TokenIterator_string, "f").charAt(__classPrivateFieldGet(this, _TokenIterator_position, "f"));
    }
    hasNext() {
        return __classPrivateFieldGet(this, _TokenIterator_position, "f") < __classPrivateFieldGet(this, _TokenIterator_string, "f").length;
    }
    nextVLQ() {
        // Read unsigned value.
        let result = 0;
        let shift = 0;
        let digit = VLQ_CONTINUATION_MASK;
        while (digit & VLQ_CONTINUATION_MASK) {
            if (!this.hasNext()) {
                throw new Error('Unexpected end of input while decodling VLQ number!');
            }
            const charCode = this.nextCharCode();
            digit = Common.Base64.BASE64_CODES[charCode];
            if (charCode !== 65 /* 'A' */ && digit === 0) {
                throw new Error(`Unexpected char '${String.fromCharCode(charCode)}' encountered while decoding`);
            }
            result += (digit & VLQ_BASE_MASK) << shift;
            shift += VLQ_BASE_SHIFT;
        }
        // Fix the sign.
        const negative = result & 1;
        result >>= 1;
        return negative ? -result : result;
    }
    /**
     * @returns the next VLQ number without iterating further. Or returns null if
     * the iterator is at the end or it's not a valid number.
     */
    peekVLQ() {
        const pos = __classPrivateFieldGet(this, _TokenIterator_position, "f");
        try {
            return this.nextVLQ();
        }
        catch {
            return null;
        }
        finally {
            __classPrivateFieldSet(this, _TokenIterator_position, pos, "f"); // Reset the iterator.
        }
    }
}
_TokenIterator_string = new WeakMap(), _TokenIterator_position = new WeakMap();
//# sourceMappingURL=SourceMap.js.map