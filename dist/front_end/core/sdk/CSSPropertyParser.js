// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _BottomUpTreeMatching_instances, _BottomUpTreeMatching_matchers, _BottomUpTreeMatching_matchedNodes, _BottomUpTreeMatching_key, _ComputedTextChunk_cachedComputedText, _ComputedTextChunk_topLevelValueCount, _ComputedText_instances, _ComputedText_chunks, _ComputedText_topLevelValueCounts, _ComputedText_sorted, _ComputedText_sortIfNecessary, _ComputedText_range, _ComputedText_getPieces, _ComputedText_countTopLevelValuesInStringPiece, _TreeSearch_found, _TreeSearch_predicate;
import * as CodeMirror from '../../third_party/codemirror.next/codemirror.next.js';
import { TextMatcher } from './CSSPropertyParserMatchers.js';
const globalValues = new Set(['inherit', 'initial', 'unset']);
const tagRegexp = /[\x20-\x7E]{4}/;
const numRegexp = /[+-]?(?:\d*\.)?\d+(?:[eE]\d+)?/;
const fontVariationSettingsRegexp = new RegExp(`(?:'(${tagRegexp.source})')|(?:"(${tagRegexp.source})")\\s+(${numRegexp.source})`);
/**
 * Extracts information about font variation settings assuming
 * value is valid according to the spec: https://drafts.csswg.org/css-fonts-4/#font-variation-settings-def
 */
export function parseFontVariationSettings(value) {
    if (globalValues.has(value.trim()) || value.trim() === 'normal') {
        return [];
    }
    const results = [];
    for (const setting of splitByComma(stripComments(value))) {
        const match = setting.match(fontVariationSettingsRegexp);
        if (match) {
            results.push({
                tag: match[1] || match[2],
                value: parseFloat(match[3]),
            });
        }
    }
    return results;
}
// "str" or 'str'
const fontFamilyRegexp = /^"(.+)"|'(.+)'$/;
/**
 * Extracts font families assuming the value is valid according to
 * the spec: https://drafts.csswg.org/css-fonts-4/#font-family-prop
 */
export function parseFontFamily(value) {
    if (globalValues.has(value.trim())) {
        return [];
    }
    const results = [];
    for (const family of splitByComma(stripComments(value))) {
        const match = family.match(fontFamilyRegexp);
        if (match) {
            // Either the 1st or 2nd group matches if the value is in quotes
            results.push(match[1] || match[2]);
        }
        else {
            // Value without without quotes.
            results.push(family);
        }
    }
    return results;
}
/**
 * Splits a list of values by comma and trims parts
 */
export function splitByComma(value) {
    return value.split(',').map(part => part.trim());
}
export function stripComments(value) {
    return value.replaceAll(/(\/\*(?:.|\s)*?\*\/)/g, '');
}
const cssParser = CodeMirror.css.cssLanguage.parser;
function nodeText(node, text) {
    return nodeTextRange(node, node, text);
}
function nodeTextRange(from, to, text) {
    return text.substring(from.from, to.to);
}
export class SyntaxTree {
    constructor(propertyValue, rule, tree, propertyName, trailingNodes = []) {
        this.propertyName = propertyName;
        this.propertyValue = propertyValue;
        this.rule = rule;
        this.tree = tree;
        this.trailingNodes = trailingNodes;
    }
    text(node) {
        if (node === null) {
            return '';
        }
        return nodeText(node ?? this.tree, this.rule);
    }
    textRange(from, to) {
        if (!from || !to) {
            return '';
        }
        return nodeTextRange(from, to, this.rule);
    }
    subtree(node) {
        return new SyntaxTree(this.propertyValue, this.rule, node);
    }
}
export class TreeWalker {
    constructor(ast) {
        this.ast = ast;
    }
    static walkExcludingSuccessors(propertyValue, ...args) {
        const instance = new this(propertyValue, ...args);
        if (propertyValue.tree.name === 'Declaration') {
            instance.iterateDeclaration(propertyValue.tree);
        }
        else {
            instance.iterateExcludingSuccessors(propertyValue.tree);
        }
        return instance;
    }
    static walk(propertyValue, ...args) {
        const instance = new this(propertyValue, ...args);
        if (propertyValue.tree.name === 'Declaration') {
            instance.iterateDeclaration(propertyValue.tree);
        }
        else {
            instance.iterate(propertyValue.tree);
        }
        return instance;
    }
    iterateDeclaration(tree) {
        if (tree.name !== 'Declaration') {
            return;
        }
        if (this.enter(tree)) {
            for (const sibling of ASTUtils.siblings(ASTUtils.declValue(tree))) {
                sibling.cursor().iterate(this.enter.bind(this), this.leave.bind(this));
            }
        }
        this.leave(tree);
    }
    iterate(tree) {
        // Includes siblings of tree.
        for (const sibling of ASTUtils.siblings(tree)) {
            sibling.cursor().iterate(this.enter.bind(this), this.leave.bind(this));
        }
    }
    iterateExcludingSuccessors(tree) {
        tree.cursor().iterate(this.enter.bind(this), this.leave.bind(this));
    }
    enter(_node) {
        return true;
    }
    leave(_node) {
    }
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function matcherBase(matchT) {
    class MatcherBase {
        constructor() {
            this.matchType = matchT;
        }
        accepts(_propertyName) {
            return true;
        }
        matches(_node, _matching) {
            return null;
        }
    }
    return MatcherBase;
}
export class BottomUpTreeMatching extends TreeWalker {
    constructor(ast, matchers) {
        super(ast);
        _BottomUpTreeMatching_instances.add(this);
        _BottomUpTreeMatching_matchers.set(this, []);
        _BottomUpTreeMatching_matchedNodes.set(this, new Map());
        this.computedText = new ComputedText(ast.rule.substring(ast.tree.from));
        __classPrivateFieldGet(this, _BottomUpTreeMatching_matchers, "f").push(...matchers.filter(m => !ast.propertyName || m.accepts(ast.propertyName)));
        __classPrivateFieldGet(this, _BottomUpTreeMatching_matchers, "f").push(new TextMatcher());
    }
    leave({ node }) {
        for (const matcher of __classPrivateFieldGet(this, _BottomUpTreeMatching_matchers, "f")) {
            const match = matcher.matches(node, this);
            if (match) {
                this.computedText.push(match, node.from - this.ast.tree.from);
                __classPrivateFieldGet(this, _BottomUpTreeMatching_matchedNodes, "f").set(__classPrivateFieldGet(this, _BottomUpTreeMatching_instances, "m", _BottomUpTreeMatching_key).call(this, node), match);
                break;
            }
        }
    }
    matchText(node) {
        const matchers = __classPrivateFieldGet(this, _BottomUpTreeMatching_matchers, "f").splice(0);
        __classPrivateFieldGet(this, _BottomUpTreeMatching_matchers, "f").push(new TextMatcher());
        this.iterateExcludingSuccessors(node);
        __classPrivateFieldGet(this, _BottomUpTreeMatching_matchers, "f").push(...matchers);
    }
    hasMatches(...matchTypes) {
        return Boolean(__classPrivateFieldGet(this, _BottomUpTreeMatching_matchedNodes, "f").values().find(match => matchTypes.some(matchType => match instanceof matchType)));
    }
    getMatch(node) {
        return __classPrivateFieldGet(this, _BottomUpTreeMatching_matchedNodes, "f").get(__classPrivateFieldGet(this, _BottomUpTreeMatching_instances, "m", _BottomUpTreeMatching_key).call(this, node));
    }
    hasUnresolvedVars(node) {
        return this.hasUnresolvedVarsRange(node, node);
    }
    hasUnresolvedVarsRange(from, to) {
        return this.computedText.hasUnresolvedVars(from.from - this.ast.tree.from, to.to - this.ast.tree.from);
    }
    getComputedText(node, substitutionHook) {
        return this.getComputedTextRange(node, node, substitutionHook);
    }
    getLonghandValuesCount() {
        const [from, to] = ASTUtils.range(ASTUtils.siblings(ASTUtils.declValue(this.ast.tree)));
        if (!from || !to) {
            return 0;
        }
        return this.computedText.countTopLevelValues(from.from - this.ast.tree.from, to.to - this.ast.tree.from);
    }
    getComputedLonghandName(to) {
        const from = ASTUtils.declValue(this.ast.tree) ?? this.ast.tree;
        return this.computedText.countTopLevelValues(from.from - this.ast.tree.from, to.from - this.ast.tree.from);
    }
    getComputedPropertyValueText() {
        const [from, to] = ASTUtils.range(ASTUtils.siblings(ASTUtils.declValue(this.ast.tree)));
        return this.getComputedTextRange(from ?? this.ast.tree, to ?? this.ast.tree);
    }
    getComputedTextRange(from, to, substitutionHook) {
        if (!from || !to) {
            return '';
        }
        return this.computedText.get(from.from - this.ast.tree.from, to.to - this.ast.tree.from, substitutionHook);
    }
}
_BottomUpTreeMatching_matchers = new WeakMap(), _BottomUpTreeMatching_matchedNodes = new WeakMap(), _BottomUpTreeMatching_instances = new WeakSet(), _BottomUpTreeMatching_key = function _BottomUpTreeMatching_key(node) {
    return `${node.from}:${node.to}`;
};
class ComputedTextChunk {
    constructor(match, offset) {
        this.match = match;
        this.offset = offset;
        _ComputedTextChunk_cachedComputedText.set(this, null);
        _ComputedTextChunk_topLevelValueCount.set(this, null);
    }
    get end() {
        return this.offset + this.length;
    }
    get length() {
        return this.match.text.length;
    }
    get computedText() {
        if (__classPrivateFieldGet(this, _ComputedTextChunk_cachedComputedText, "f") === null) {
            __classPrivateFieldSet(this, _ComputedTextChunk_cachedComputedText, this.match.computedText(), "f");
        }
        return __classPrivateFieldGet(this, _ComputedTextChunk_cachedComputedText, "f");
    }
    // If the match is top-level, i.e. is an outermost subexpression in the property value, count the number of outermost
    // subexpressions after applying any potential substitutions.
    get topLevelValueCount() {
        if (this.match.node.parent?.name !== 'Declaration') {
            // Not a top-level matchh.
            return 0;
        }
        const computedText = this.computedText;
        if (computedText === '') {
            // Substitutions elided the match altogether.
            return 0;
        }
        if (__classPrivateFieldGet(this, _ComputedTextChunk_topLevelValueCount, "f") === null) {
            // computedText may be null, in which case the match text was not replaced.
            __classPrivateFieldSet(this, _ComputedTextChunk_topLevelValueCount, ASTUtils
                .siblings(ASTUtils.declValue(tokenizeDeclaration('--p', computedText ?? this.match.text)?.tree ?? null))
                .length, "f");
        }
        return __classPrivateFieldGet(this, _ComputedTextChunk_topLevelValueCount, "f");
    }
}
_ComputedTextChunk_cachedComputedText = new WeakMap(), _ComputedTextChunk_topLevelValueCount = new WeakMap();
// This class constructs the "computed" text from the input property text, i.e., it will strip comments and substitute
// var() functions if possible. It's intended for use during the bottom-up tree matching process. The original text is
// not modified. Instead, computed text slices are produced on the fly. During bottom-up matching, the sequence of
// top-level comments and var() matches will be recorded. This produces an ordered sequence of text pieces that need to
// be substituted into the original text. When a computed text slice is requested, it is generated by piecing together
// original and computed slices as required.
export class ComputedText {
    constructor(text) {
        _ComputedText_instances.add(this);
        _ComputedText_chunks.set(this, []);
        _ComputedText_topLevelValueCounts.set(this, new Map());
        _ComputedText_sorted.set(this, true);
        this.text = text;
    }
    clear() {
        __classPrivateFieldGet(this, _ComputedText_chunks, "f").splice(0);
        __classPrivateFieldGet(this, _ComputedText_topLevelValueCounts, "f").clear();
    }
    get chunkCount() {
        return __classPrivateFieldGet(this, _ComputedText_chunks, "f").length;
    }
    // Add another substitutable match. The match will either be appended to the list of existing matches or it will
    // be substituted for the last match(es) if it encompasses them.
    push(match, offset) {
        function hasComputedText(match) {
            return Boolean(match.computedText);
        }
        if (!hasComputedText(match) || offset < 0 || offset >= this.text.length) {
            return;
        }
        const chunk = new ComputedTextChunk(match, offset);
        if (chunk.end > this.text.length) {
            return;
        }
        __classPrivateFieldSet(this, _ComputedText_sorted, false, "f");
        __classPrivateFieldGet(this, _ComputedText_chunks, "f").push(chunk);
    }
    hasUnresolvedVars(begin, end) {
        for (const chunk of __classPrivateFieldGet(this, _ComputedText_instances, "m", _ComputedText_range).call(this, begin, end)) {
            if (chunk.computedText === null) {
                return true;
            }
        }
        return false;
    }
    // Get a slice of the computed text corresponding to the property text in the range [begin, end). The slice may not
    // start within a substitution chunk, e.g., it's invalid to request the computed text for the property value text
    // slice "1px var(--".
    get(begin, end, substitutionHook) {
        const pieces = [];
        const getText = (piece) => {
            if (typeof piece === 'string') {
                return piece;
            }
            const substitution = substitutionHook?.(piece.match) ?? null;
            if (substitution !== null) {
                return getText(substitution);
            }
            return piece.computedText ?? piece.match.text;
        };
        for (const piece of __classPrivateFieldGet(this, _ComputedText_instances, "m", _ComputedText_getPieces).call(this, begin, end)) {
            const text = getText(piece);
            if (text.length === 0) {
                continue;
            }
            if (pieces.length > 0 && requiresSpace(pieces[pieces.length - 1], text)) {
                pieces.push(' ');
            }
            pieces.push(text);
        }
        return pieces.join('');
    }
    countTopLevelValues(begin, end) {
        const pieces = Array.from(__classPrivateFieldGet(this, _ComputedText_instances, "m", _ComputedText_getPieces).call(this, begin, end));
        const counts = pieces.map(chunk => (chunk instanceof ComputedTextChunk ? chunk.topLevelValueCount :
            __classPrivateFieldGet(this, _ComputedText_instances, "m", _ComputedText_countTopLevelValuesInStringPiece).call(this, chunk)));
        const count = counts.reduce((sum, v) => sum + v, 0);
        return count;
    }
}
_ComputedText_chunks = new WeakMap(), _ComputedText_topLevelValueCounts = new WeakMap(), _ComputedText_sorted = new WeakMap(), _ComputedText_instances = new WeakSet(), _ComputedText_sortIfNecessary = function _ComputedText_sortIfNecessary() {
    if (__classPrivateFieldGet(this, _ComputedText_sorted, "f")) {
        return;
    }
    // Sort intervals by offset, with longer intervals first if the offset is identical.
    __classPrivateFieldGet(this, _ComputedText_chunks, "f").sort((a, b) => {
        if (a.offset < b.offset) {
            return -1;
        }
        if (b.offset < a.offset) {
            return 1;
        }
        if (a.end > b.end) {
            return -1;
        }
        if (a.end < b.end) {
            return 1;
        }
        return 0;
    });
    __classPrivateFieldSet(this, _ComputedText_sorted, true, "f");
}, _ComputedText_range = function* _ComputedText_range(begin, end) {
    __classPrivateFieldGet(this, _ComputedText_instances, "m", _ComputedText_sortIfNecessary).call(this);
    let i = __classPrivateFieldGet(this, _ComputedText_chunks, "f").findIndex(c => c.offset >= begin);
    while (i >= 0 && i < __classPrivateFieldGet(this, _ComputedText_chunks, "f").length && __classPrivateFieldGet(this, _ComputedText_chunks, "f")[i].end > begin && begin < end) {
        if (__classPrivateFieldGet(this, _ComputedText_chunks, "f")[i].end > end) {
            i++;
            continue;
        }
        yield __classPrivateFieldGet(this, _ComputedText_chunks, "f")[i];
        begin = __classPrivateFieldGet(this, _ComputedText_chunks, "f")[i].end;
        while (begin < end && i < __classPrivateFieldGet(this, _ComputedText_chunks, "f").length && __classPrivateFieldGet(this, _ComputedText_chunks, "f")[i].offset < begin) {
            i++;
        }
    }
}, _ComputedText_getPieces = function* _ComputedText_getPieces(begin, end) {
    for (const chunk of __classPrivateFieldGet(this, _ComputedText_instances, "m", _ComputedText_range).call(this, begin, end)) {
        const piece = this.text.substring(begin, Math.min(chunk.offset, end));
        yield piece;
        if (end >= chunk.end) {
            yield chunk;
        }
        begin = chunk.end;
    }
    if (begin < end) {
        const piece = this.text.substring(begin, end);
        yield piece;
    }
}, _ComputedText_countTopLevelValuesInStringPiece = function _ComputedText_countTopLevelValuesInStringPiece(piece) {
    let count = __classPrivateFieldGet(this, _ComputedText_topLevelValueCounts, "f").get(piece);
    if (count === undefined) {
        count = ASTUtils.siblings(ASTUtils.declValue(tokenizeDeclaration('--p', piece)?.tree ?? null)).length;
        __classPrivateFieldGet(this, _ComputedText_topLevelValueCounts, "f").set(piece, count);
    }
    return count;
};
export function requiresSpace(a, b) {
    const tail = Array.isArray(a) ? a.findLast(node => node.textContent)?.textContent : a;
    const head = Array.isArray(b) ? b.find(node => node.textContent)?.textContent : b;
    const trailingChar = tail ? tail[tail.length - 1] : '';
    const leadingChar = head ? head[0] : '';
    const noSpaceAfter = ['', '(', '{', '}', ';', '['];
    const noSpaceBefore = ['', '(', ')', ',', ':', '*', '{', ';', ']'];
    return !/\s/.test(trailingChar) && !/\s/.test(leadingChar) && !noSpaceAfter.includes(trailingChar) &&
        !noSpaceBefore.includes(leadingChar);
}
export const CSSControlMap = (Map);
export var ASTUtils;
(function (ASTUtils) {
    function siblings(node) {
        const result = [];
        while (node) {
            result.push(node);
            node = node.nextSibling;
        }
        return result;
    }
    ASTUtils.siblings = siblings;
    function children(node) {
        return siblings(node?.firstChild ?? null);
    }
    ASTUtils.children = children;
    function range(node) {
        return [node[0], node[node.length - 1]];
    }
    ASTUtils.range = range;
    function declValue(node) {
        if (node?.name !== 'Declaration') {
            return null;
        }
        return children(node).find(node => node.name === ':')?.nextSibling ?? null;
    }
    ASTUtils.declValue = declValue;
    function* stripComments(nodes) {
        for (const node of nodes) {
            if (node.type.name !== 'Comment') {
                yield node;
            }
        }
    }
    ASTUtils.stripComments = stripComments;
    function split(nodes) {
        const result = [];
        let current = [];
        for (const node of nodes) {
            if (node.name === ',') {
                result.push(current);
                current = [];
            }
            else {
                current.push(node);
            }
        }
        if (nodes.length > 0) {
            result.push(current);
        }
        return result;
    }
    ASTUtils.split = split;
    function callArgs(node) {
        const args = children(node?.getChild('ArgList') ?? null);
        const openParen = args.splice(0, 1)[0];
        const closingParen = args.pop();
        if (openParen?.name !== '(' || closingParen?.name !== ')') {
            return [];
        }
        return split(args);
    }
    ASTUtils.callArgs = callArgs;
    function equals(a, b) {
        return a.name === b.name && a.from === b.from && a.to === b.to;
    }
    ASTUtils.equals = equals;
})(ASTUtils || (ASTUtils = {}));
function declaration(rule) {
    return cssParser.parse(rule).topNode.getChild('RuleSet')?.getChild('Block')?.getChild('Declaration') ?? null;
}
export function tokenizeDeclaration(propertyName, propertyValue) {
    const name = tokenizePropertyName(propertyName);
    if (!name) {
        return null;
    }
    const rule = `*{${name}: ${propertyValue};}`;
    const decl = declaration(rule);
    if (!decl || decl.type.isError) {
        return null;
    }
    const childNodes = ASTUtils.children(decl);
    if (childNodes.length < 2) {
        return null;
    }
    const [varName, colon, tree] = childNodes;
    if (!varName || varName.type.isError || !colon || colon.type.isError || tree?.type.isError) {
        return null;
    }
    // It's possible that there are nodes following the declaration when there are comments or syntax errors. We want to
    // render any comments, so pick up any trailing nodes following the declaration excluding the final semicolon and
    // brace.
    const trailingNodes = ASTUtils.siblings(decl).slice(1);
    const [semicolon, brace] = trailingNodes.splice(trailingNodes.length - 2, 2);
    if (semicolon?.name !== ';' && brace?.name !== '}') {
        return null;
    }
    const ast = new SyntaxTree(propertyValue, rule, decl, name, trailingNodes);
    if (ast.text(varName) !== name || colon.name !== ':') {
        return null;
    }
    return ast;
}
export function tokenizePropertyName(name) {
    const rule = `*{${name}: inherit;}`;
    const decl = declaration(rule);
    if (!decl || decl.type.isError) {
        return null;
    }
    const propertyName = decl.getChild('PropertyName') ?? decl.getChild('VariableName');
    if (!propertyName) {
        return null;
    }
    return nodeText(propertyName, rule);
}
export function matchDeclaration(name, value, matchers) {
    const ast = tokenizeDeclaration(name, value);
    const matchedResult = ast && BottomUpTreeMatching.walk(ast, matchers);
    ast?.trailingNodes.forEach(n => matchedResult?.matchText(n));
    return matchedResult;
}
export class TreeSearch extends TreeWalker {
    constructor(ast, predicate) {
        super(ast);
        _TreeSearch_found.set(this, null);
        _TreeSearch_predicate.set(this, void 0);
        __classPrivateFieldSet(this, _TreeSearch_predicate, predicate, "f");
    }
    enter({ node }) {
        if (__classPrivateFieldGet(this, _TreeSearch_found, "f")) {
            return false;
        }
        if (__classPrivateFieldGet(this, _TreeSearch_predicate, "f").call(this, node)) {
            __classPrivateFieldSet(this, _TreeSearch_found, __classPrivateFieldGet(this, _TreeSearch_found, "f") ?? node, "f");
            return false;
        }
        return true;
    }
    static find(ast, predicate) {
        return __classPrivateFieldGet(TreeSearch.walk(ast, predicate), _TreeSearch_found, "f");
    }
    static findAll(ast, predicate) {
        const foundNodes = [];
        TreeSearch.walk(ast, (node) => {
            if (predicate(node)) {
                foundNodes.push(node);
            }
            return false;
        });
        return foundNodes;
    }
}
_TreeSearch_found = new WeakMap(), _TreeSearch_predicate = new WeakMap();
//# sourceMappingURL=CSSPropertyParser.js.map