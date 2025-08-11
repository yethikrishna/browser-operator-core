// Copyright 2016 The Chromium Authors. All rights reserved.
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
var _HTMLFormatter_instances, _HTMLFormatter_builder, _HTMLFormatter_jsFormatter, _HTMLFormatter_jsonFormatter, _HTMLFormatter_cssFormatter, _HTMLFormatter_text, _HTMLFormatter_lineEndings, _HTMLFormatter_model, _HTMLFormatter_formatTokensTill, _HTMLFormatter_walk, _HTMLFormatter_beforeOpenTag, _HTMLFormatter_afterOpenTag, _HTMLFormatter_beforeCloseTag, _HTMLFormatter_afterCloseTag, _HTMLFormatter_formatToken, _HTMLModel_instances, _HTMLModel_state, _HTMLModel_documentInternal, _HTMLModel_stack, _HTMLModel_tokens, _HTMLModel_tokenIndex, _HTMLModel_attributes, _HTMLModel_attributeName, _HTMLModel_tagName, _HTMLModel_isOpenTag, _HTMLModel_tagStartOffset, _HTMLModel_tagEndOffset, _HTMLModel_build, _HTMLModel_updateDOM, _HTMLModel_onStartTag, _HTMLModel_onEndTag, _HTMLModel_onTagComplete, _HTMLModel_popElement, _HTMLModel_pushElement;
import * as Platform from '../../core/platform/platform.js';
import { CSSFormatter } from './CSSFormatter.js';
import { AbortTokenization, createTokenizer } from './FormatterWorker.js';
import { JavaScriptFormatter } from './JavaScriptFormatter.js';
import { JSONFormatter } from './JSONFormatter.js';
export class HTMLFormatter {
    constructor(builder) {
        _HTMLFormatter_instances.add(this);
        _HTMLFormatter_builder.set(this, void 0);
        _HTMLFormatter_jsFormatter.set(this, void 0);
        _HTMLFormatter_jsonFormatter.set(this, void 0);
        _HTMLFormatter_cssFormatter.set(this, void 0);
        _HTMLFormatter_text.set(this, void 0);
        _HTMLFormatter_lineEndings.set(this, void 0);
        _HTMLFormatter_model.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLFormatter_builder, builder, "f");
        __classPrivateFieldSet(this, _HTMLFormatter_jsFormatter, new JavaScriptFormatter(builder), "f");
        __classPrivateFieldSet(this, _HTMLFormatter_jsonFormatter, new JSONFormatter(builder), "f");
        __classPrivateFieldSet(this, _HTMLFormatter_cssFormatter, new CSSFormatter(builder), "f");
    }
    format(text, lineEndings) {
        __classPrivateFieldSet(this, _HTMLFormatter_text, text, "f");
        __classPrivateFieldSet(this, _HTMLFormatter_lineEndings, lineEndings, "f");
        __classPrivateFieldSet(this, _HTMLFormatter_model, new HTMLModel(text), "f");
        __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_walk).call(this, __classPrivateFieldGet(this, _HTMLFormatter_model, "f").document());
    }
}
_HTMLFormatter_builder = new WeakMap(), _HTMLFormatter_jsFormatter = new WeakMap(), _HTMLFormatter_jsonFormatter = new WeakMap(), _HTMLFormatter_cssFormatter = new WeakMap(), _HTMLFormatter_text = new WeakMap(), _HTMLFormatter_lineEndings = new WeakMap(), _HTMLFormatter_model = new WeakMap(), _HTMLFormatter_instances = new WeakSet(), _HTMLFormatter_formatTokensTill = function _HTMLFormatter_formatTokensTill(element, offset) {
    if (!__classPrivateFieldGet(this, _HTMLFormatter_model, "f")) {
        return;
    }
    let nextToken = __classPrivateFieldGet(this, _HTMLFormatter_model, "f").peekToken();
    while (nextToken && nextToken.startOffset < offset) {
        const token = __classPrivateFieldGet(this, _HTMLFormatter_model, "f").nextToken();
        __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_formatToken).call(this, element, token);
        nextToken = __classPrivateFieldGet(this, _HTMLFormatter_model, "f").peekToken();
    }
}, _HTMLFormatter_walk = function _HTMLFormatter_walk(element) {
    if (!element.openTag || !element.closeTag) {
        throw new Error('Element is missing open or close tag');
    }
    if (element.parent) {
        __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_formatTokensTill).call(this, element.parent, element.openTag.startOffset);
    }
    __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_beforeOpenTag).call(this, element);
    __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_formatTokensTill).call(this, element, element.openTag.endOffset);
    __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_afterOpenTag).call(this, element);
    for (let i = 0; i < element.children.length; ++i) {
        __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_walk).call(this, element.children[i]);
    }
    __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_formatTokensTill).call(this, element, element.closeTag.startOffset);
    __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_beforeCloseTag).call(this, element);
    __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_formatTokensTill).call(this, element, element.closeTag.endOffset);
    __classPrivateFieldGet(this, _HTMLFormatter_instances, "m", _HTMLFormatter_afterCloseTag).call(this, element);
}, _HTMLFormatter_beforeOpenTag = function _HTMLFormatter_beforeOpenTag(element) {
    if (!__classPrivateFieldGet(this, _HTMLFormatter_model, "f")) {
        return;
    }
    if (!element.children.length || element === __classPrivateFieldGet(this, _HTMLFormatter_model, "f").document()) {
        return;
    }
    __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addNewLine();
}, _HTMLFormatter_afterOpenTag = function _HTMLFormatter_afterOpenTag(element) {
    if (!__classPrivateFieldGet(this, _HTMLFormatter_model, "f")) {
        return;
    }
    if (!element.children.length || element === __classPrivateFieldGet(this, _HTMLFormatter_model, "f").document()) {
        return;
    }
    __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").increaseNestingLevel();
    __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addNewLine();
}, _HTMLFormatter_beforeCloseTag = function _HTMLFormatter_beforeCloseTag(element) {
    if (!__classPrivateFieldGet(this, _HTMLFormatter_model, "f")) {
        return;
    }
    if (!element.children.length || element === __classPrivateFieldGet(this, _HTMLFormatter_model, "f").document()) {
        return;
    }
    __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").decreaseNestingLevel();
    __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addNewLine();
}, _HTMLFormatter_afterCloseTag = function _HTMLFormatter_afterCloseTag(_element) {
    __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addNewLine();
}, _HTMLFormatter_formatToken = function _HTMLFormatter_formatToken(element, token) {
    if (Platform.StringUtilities.isWhitespace(token.value)) {
        return;
    }
    if (hasTokenInSet(token.type, 'comment') || hasTokenInSet(token.type, 'meta')) {
        __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addNewLine();
        __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addToken(token.value.trim(), token.startOffset);
        __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addNewLine();
        return;
    }
    if (!element.openTag || !element.closeTag) {
        return;
    }
    const isBodyToken = element.openTag.endOffset <= token.startOffset && token.startOffset < element.closeTag.startOffset;
    if (isBodyToken && element.name === 'style') {
        __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addNewLine();
        __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").increaseNestingLevel();
        __classPrivateFieldGet(this, _HTMLFormatter_cssFormatter, "f").format(__classPrivateFieldGet(this, _HTMLFormatter_text, "f") || '', __classPrivateFieldGet(this, _HTMLFormatter_lineEndings, "f") || [], token.startOffset, token.endOffset);
        __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").decreaseNestingLevel();
        return;
    }
    if (isBodyToken && element.name === 'script') {
        __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addNewLine();
        __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").increaseNestingLevel();
        if (scriptTagIsJavaScript(element)) {
            __classPrivateFieldGet(this, _HTMLFormatter_jsFormatter, "f").format(__classPrivateFieldGet(this, _HTMLFormatter_text, "f") || '', __classPrivateFieldGet(this, _HTMLFormatter_lineEndings, "f") || [], token.startOffset, token.endOffset);
        }
        else if (scriptTagIsJSON(element)) {
            __classPrivateFieldGet(this, _HTMLFormatter_jsonFormatter, "f").format(__classPrivateFieldGet(this, _HTMLFormatter_text, "f") || '', __classPrivateFieldGet(this, _HTMLFormatter_lineEndings, "f") || [], token.startOffset, token.endOffset);
        }
        else {
            __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addToken(token.value, token.startOffset);
            __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addNewLine();
        }
        __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").decreaseNestingLevel();
        return;
    }
    if (!isBodyToken && hasTokenInSet(token.type, 'attribute')) {
        __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addSoftSpace();
    }
    __classPrivateFieldGet(this, _HTMLFormatter_builder, "f").addToken(token.value, token.startOffset);
};
function scriptTagIsJavaScript(element) {
    if (!element.openTag) {
        return true;
    }
    if (!element.openTag.attributes.has('type')) {
        return true;
    }
    let type = element.openTag.attributes.get('type');
    if (!type) {
        return true;
    }
    type = type.toLowerCase();
    const isWrappedInQuotes = /^(["\'])(.*)\1$/.exec(type.trim());
    if (isWrappedInQuotes) {
        type = isWrappedInQuotes[2];
    }
    return [
        'application/ecmascript',
        'application/javascript',
        'application/x-ecmascript',
        'application/x-javascript',
        'module',
        'text/ecmascript',
        'text/javascript',
        'text/javascript1.0',
        'text/javascript1.1',
        'text/javascript1.2',
        'text/javascript1.3',
        'text/javascript1.4',
        'text/javascript1.5',
        'text/jscript',
        'text/livescript',
        'text/x-ecmascript',
        'text/x-javascript',
    ].includes(type.trim());
}
function scriptTagIsJSON(element) {
    if (!element.openTag) {
        return false;
    }
    let type = element.openTag.attributes.get('type');
    if (!type) {
        return false;
    }
    type = type.toLowerCase();
    const isWrappedInQuotes = /^(["\'])(.*)\1$/.exec(type.trim());
    if (isWrappedInQuotes) {
        type = isWrappedInQuotes[2];
    }
    const isSubtype = /^application\/\w+\+json$/.exec(type.trim());
    if (isSubtype) {
        type = 'application/json';
    }
    return [
        'application/json',
        'importmap',
        'speculationrules',
    ].includes(type.trim());
}
function hasTokenInSet(tokenTypes, type) {
    // We prefix the CodeMirror HTML tokenizer with the xml- prefix
    // in a full version. When running in a worker context, this
    // prefix is not appended, as the global is only overridden
    // in CodeMirrorTextEditor.js.
    return tokenTypes.has(type) || tokenTypes.has(`xml-${type}`);
}
export class HTMLModel {
    constructor(text) {
        _HTMLModel_instances.add(this);
        _HTMLModel_state.set(this, "Initial" /* ParseState.INITIAL */);
        _HTMLModel_documentInternal.set(this, void 0);
        _HTMLModel_stack.set(this, void 0);
        _HTMLModel_tokens.set(this, []);
        _HTMLModel_tokenIndex.set(this, 0);
        _HTMLModel_attributes.set(this, new Map());
        _HTMLModel_attributeName.set(this, '');
        _HTMLModel_tagName.set(this, '');
        _HTMLModel_isOpenTag.set(this, false);
        _HTMLModel_tagStartOffset.set(this, void 0);
        _HTMLModel_tagEndOffset.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLModel_documentInternal, new FormatterElement('document'), "f");
        __classPrivateFieldGet(this, _HTMLModel_documentInternal, "f").openTag = new Tag('document', 0, 0, new Map(), true, false);
        __classPrivateFieldGet(this, _HTMLModel_documentInternal, "f").closeTag = new Tag('document', text.length, text.length, new Map(), false, false);
        __classPrivateFieldSet(this, _HTMLModel_stack, [__classPrivateFieldGet(this, _HTMLModel_documentInternal, "f")], "f");
        __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_build).call(this, text);
    }
    peekToken() {
        return __classPrivateFieldGet(this, _HTMLModel_tokenIndex, "f") < __classPrivateFieldGet(this, _HTMLModel_tokens, "f").length ? __classPrivateFieldGet(this, _HTMLModel_tokens, "f")[__classPrivateFieldGet(this, _HTMLModel_tokenIndex, "f")] : null;
    }
    nextToken() {
        var _a, _b;
        return __classPrivateFieldGet(this, _HTMLModel_tokens, "f")[__classPrivateFieldSet(this, _HTMLModel_tokenIndex, (_b = __classPrivateFieldGet(this, _HTMLModel_tokenIndex, "f"), _a = _b++, _b), "f"), _a];
    }
    document() {
        return __classPrivateFieldGet(this, _HTMLModel_documentInternal, "f");
    }
}
_HTMLModel_state = new WeakMap(), _HTMLModel_documentInternal = new WeakMap(), _HTMLModel_stack = new WeakMap(), _HTMLModel_tokens = new WeakMap(), _HTMLModel_tokenIndex = new WeakMap(), _HTMLModel_attributes = new WeakMap(), _HTMLModel_attributeName = new WeakMap(), _HTMLModel_tagName = new WeakMap(), _HTMLModel_isOpenTag = new WeakMap(), _HTMLModel_tagStartOffset = new WeakMap(), _HTMLModel_tagEndOffset = new WeakMap(), _HTMLModel_instances = new WeakSet(), _HTMLModel_build = function _HTMLModel_build(text) {
    const tokenizer = createTokenizer('text/html');
    let baseOffset = 0, lastOffset = 0;
    let pendingToken = null;
    const pushToken = (token) => {
        __classPrivateFieldGet(this, _HTMLModel_tokens, "f").push(token);
        __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_updateDOM).call(this, token);
        const element = __classPrivateFieldGet(this, _HTMLModel_stack, "f")[__classPrivateFieldGet(this, _HTMLModel_stack, "f").length - 1];
        if (element && (element.name === 'script' || element.name === 'style') && element.openTag &&
            element.openTag.endOffset === lastOffset) {
            return AbortTokenization;
        }
        return;
    };
    const processToken = (tokenValue, type, tokenStart, tokenEnd) => {
        tokenStart += baseOffset;
        tokenEnd += baseOffset;
        lastOffset = tokenEnd;
        const tokenType = type ? new Set(type.split(' ')) : new Set();
        const token = new Token(tokenValue, tokenType, tokenStart, tokenEnd);
        // This is a pretty horrible work-around for two bugs in the CodeMirror 5 HTML
        // tokenizer, which aren't easy to fix because it shares this code with the
        // XML parser[^1], and which is also not actively maintained anymore. The
        // real fix here is to migrate off of CodeMirror 5 also for formatting and
        // pretty printing and use CodeMirror 6 instead, but that's a bigger
        // project.
        //
        // For now we ducktape the first problem by merging a '/' token
        // following a string token in the HTML formatter, which does the trick, and
        // also merging the error tokens for unescaped ampersands with text tokens
        // (where `type` is `null`) preceeding and following the error tokens.
        //
        // [^1]: https://github.com/codemirror/codemirror5/blob/742627a/mode/xml/xml.js#L137
        //
        if (pendingToken) {
            if (tokenValue === '/' && type === 'attribute' && pendingToken.type.has('string')) {
                token.startOffset = pendingToken.startOffset;
                token.value = `${pendingToken.value}${tokenValue}`;
                token.type = pendingToken.type;
            }
            else if ((tokenValue.startsWith('&') && type === 'error' && pendingToken.type.size === 0) ||
                (type === null && pendingToken.type.has('error'))) {
                pendingToken.endOffset = token.endOffset;
                pendingToken.value += tokenValue;
                pendingToken.type = token.type;
                return;
            }
            else if (pushToken(pendingToken) === AbortTokenization) {
                return AbortTokenization;
            }
            pendingToken = null;
        }
        if (type === 'string' || type === null) {
            pendingToken = token;
            return;
        }
        return pushToken(token);
    };
    while (true) {
        baseOffset = lastOffset;
        tokenizer(text.substring(lastOffset), processToken);
        if (pendingToken) {
            pushToken(pendingToken);
            pendingToken = null;
        }
        if (lastOffset >= text.length) {
            break;
        }
        const element = __classPrivateFieldGet(this, _HTMLModel_stack, "f")[__classPrivateFieldGet(this, _HTMLModel_stack, "f").length - 1];
        if (!element) {
            break;
        }
        while (true) {
            lastOffset = text.indexOf('</', lastOffset);
            if (lastOffset === -1) {
                lastOffset = text.length;
                break;
            }
            if (text.substring(lastOffset + 2).toLowerCase().startsWith(element.name)) {
                break;
            }
            lastOffset += 2;
        }
        if (!element.openTag) {
            break;
        }
        const tokenStart = element.openTag.endOffset;
        const tokenEnd = lastOffset;
        const tokenValue = text.substring(tokenStart, tokenEnd);
        __classPrivateFieldGet(this, _HTMLModel_tokens, "f").push(new Token(tokenValue, new Set(), tokenStart, tokenEnd));
    }
    while (__classPrivateFieldGet(this, _HTMLModel_stack, "f").length > 1) {
        const element = __classPrivateFieldGet(this, _HTMLModel_stack, "f")[__classPrivateFieldGet(this, _HTMLModel_stack, "f").length - 1];
        if (!element) {
            break;
        }
        __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_popElement).call(this, new Tag(element.name, text.length, text.length, new Map(), false, false));
    }
}, _HTMLModel_updateDOM = function _HTMLModel_updateDOM(token) {
    const value = token.value;
    const type = token.type;
    switch (__classPrivateFieldGet(this, _HTMLModel_state, "f")) {
        case "Initial" /* ParseState.INITIAL */:
            if (hasTokenInSet(type, 'bracket') && (value === '<' || value === '</')) {
                __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_onStartTag).call(this, token);
                __classPrivateFieldSet(this, _HTMLModel_state, "Tag" /* ParseState.TAG */, "f");
            }
            return;
        case "Tag" /* ParseState.TAG */:
            if (hasTokenInSet(type, 'tag') && !hasTokenInSet(type, 'bracket')) {
                __classPrivateFieldSet(this, _HTMLModel_tagName, value.trim().toLowerCase(), "f");
            }
            else if (hasTokenInSet(type, 'attribute')) {
                __classPrivateFieldSet(this, _HTMLModel_attributeName, value.trim().toLowerCase(), "f");
                __classPrivateFieldGet(this, _HTMLModel_attributes, "f").set(__classPrivateFieldGet(this, _HTMLModel_attributeName, "f"), '');
                __classPrivateFieldSet(this, _HTMLModel_state, "AttributeName" /* ParseState.ATTRIBUTE_NAME */, "f");
            }
            else if (hasTokenInSet(type, 'bracket') && (value === '>' || value === '/>')) {
                __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_onEndTag).call(this, token);
                __classPrivateFieldSet(this, _HTMLModel_state, "Initial" /* ParseState.INITIAL */, "f");
            }
            return;
        case "AttributeName" /* ParseState.ATTRIBUTE_NAME */:
            if (!type.size && value === '=') {
                __classPrivateFieldSet(this, _HTMLModel_state, "AttributeValue" /* ParseState.ATTRIBUTE_VALUE */, "f");
            }
            else if (hasTokenInSet(type, 'bracket') && (value === '>' || value === '/>')) {
                __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_onEndTag).call(this, token);
                __classPrivateFieldSet(this, _HTMLModel_state, "Initial" /* ParseState.INITIAL */, "f");
            }
            return;
        case "AttributeValue" /* ParseState.ATTRIBUTE_VALUE */:
            if (hasTokenInSet(type, 'string')) {
                __classPrivateFieldGet(this, _HTMLModel_attributes, "f").set(__classPrivateFieldGet(this, _HTMLModel_attributeName, "f"), value);
                __classPrivateFieldSet(this, _HTMLModel_state, "Tag" /* ParseState.TAG */, "f");
            }
            else if (hasTokenInSet(type, 'bracket') && (value === '>' || value === '/>')) {
                __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_onEndTag).call(this, token);
                __classPrivateFieldSet(this, _HTMLModel_state, "Initial" /* ParseState.INITIAL */, "f");
            }
            return;
    }
}, _HTMLModel_onStartTag = function _HTMLModel_onStartTag(token) {
    __classPrivateFieldSet(this, _HTMLModel_tagName, '', "f");
    __classPrivateFieldSet(this, _HTMLModel_tagStartOffset, token.startOffset, "f");
    __classPrivateFieldSet(this, _HTMLModel_tagEndOffset, null, "f");
    __classPrivateFieldSet(this, _HTMLModel_attributes, new Map(), "f");
    __classPrivateFieldSet(this, _HTMLModel_attributeName, '', "f");
    __classPrivateFieldSet(this, _HTMLModel_isOpenTag, token.value === '<', "f");
}, _HTMLModel_onEndTag = function _HTMLModel_onEndTag(token) {
    __classPrivateFieldSet(this, _HTMLModel_tagEndOffset, token.endOffset, "f");
    const selfClosingTag = token.value === '/>' || SelfClosingTags.has(__classPrivateFieldGet(this, _HTMLModel_tagName, "f"));
    const tag = new Tag(__classPrivateFieldGet(this, _HTMLModel_tagName, "f"), __classPrivateFieldGet(this, _HTMLModel_tagStartOffset, "f") || 0, __classPrivateFieldGet(this, _HTMLModel_tagEndOffset, "f"), __classPrivateFieldGet(this, _HTMLModel_attributes, "f"), __classPrivateFieldGet(this, _HTMLModel_isOpenTag, "f"), selfClosingTag);
    __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_onTagComplete).call(this, tag);
}, _HTMLModel_onTagComplete = function _HTMLModel_onTagComplete(tag) {
    if (tag.isOpenTag) {
        const topElement = __classPrivateFieldGet(this, _HTMLModel_stack, "f")[__classPrivateFieldGet(this, _HTMLModel_stack, "f").length - 1];
        if (topElement) {
            const tagSet = AutoClosingTags.get(topElement.name);
            if (topElement !== __classPrivateFieldGet(this, _HTMLModel_documentInternal, "f") && topElement.openTag?.selfClosingTag) {
                __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_popElement).call(this, autocloseTag(topElement, topElement.openTag.endOffset));
            }
            else if (tagSet?.has(tag.name)) {
                __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_popElement).call(this, autocloseTag(topElement, tag.startOffset));
            }
            __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_pushElement).call(this, tag);
        }
        return;
    }
    let lastTag = __classPrivateFieldGet(this, _HTMLModel_stack, "f")[__classPrivateFieldGet(this, _HTMLModel_stack, "f").length - 1];
    while (__classPrivateFieldGet(this, _HTMLModel_stack, "f").length > 1 && lastTag && lastTag.name !== tag.name) {
        __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_popElement).call(this, autocloseTag(lastTag, tag.startOffset));
        lastTag = __classPrivateFieldGet(this, _HTMLModel_stack, "f")[__classPrivateFieldGet(this, _HTMLModel_stack, "f").length - 1];
    }
    if (__classPrivateFieldGet(this, _HTMLModel_stack, "f").length === 1) {
        return;
    }
    __classPrivateFieldGet(this, _HTMLModel_instances, "m", _HTMLModel_popElement).call(this, tag);
    function autocloseTag(element, offset) {
        return new Tag(element.name, offset, offset, new Map(), false, false);
    }
}, _HTMLModel_popElement = function _HTMLModel_popElement(closeTag) {
    const element = __classPrivateFieldGet(this, _HTMLModel_stack, "f").pop();
    if (!element) {
        return;
    }
    element.closeTag = closeTag;
}, _HTMLModel_pushElement = function _HTMLModel_pushElement(openTag) {
    const topElement = __classPrivateFieldGet(this, _HTMLModel_stack, "f")[__classPrivateFieldGet(this, _HTMLModel_stack, "f").length - 1];
    const newElement = new FormatterElement(openTag.name);
    if (topElement) {
        newElement.parent = topElement;
        topElement.children.push(newElement);
    }
    newElement.openTag = openTag;
    __classPrivateFieldGet(this, _HTMLModel_stack, "f").push(newElement);
};
const SelfClosingTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);
// @see https://www.w3.org/TR/html/syntax.html 8.1.2.4 Optional tags
const AutoClosingTags = new Map([
    ['head', new Set(['body'])],
    ['li', new Set(['li'])],
    ['dt', new Set(['dt', 'dd'])],
    ['dd', new Set(['dt', 'dd'])],
    [
        'p',
        new Set([
            'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'footer', 'form',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr',
            'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul',
        ]),
    ],
    ['rb', new Set(['rb', 'rt', 'rtc', 'rp'])],
    ['rt', new Set(['rb', 'rt', 'rtc', 'rp'])],
    ['rtc', new Set(['rb', 'rtc', 'rp'])],
    ['rp', new Set(['rb', 'rt', 'rtc', 'rp'])],
    ['optgroup', new Set(['optgroup'])],
    ['option', new Set(['option', 'optgroup'])],
    ['colgroup', new Set(['colgroup'])],
    ['thead', new Set(['tbody', 'tfoot'])],
    ['tbody', new Set(['tbody', 'tfoot'])],
    ['tfoot', new Set(['tbody'])],
    ['tr', new Set(['tr'])],
    ['td', new Set(['td', 'th'])],
    ['th', new Set(['td', 'th'])],
]);
var ParseState;
(function (ParseState) {
    ParseState["INITIAL"] = "Initial";
    ParseState["TAG"] = "Tag";
    ParseState["ATTRIBUTE_NAME"] = "AttributeName";
    ParseState["ATTRIBUTE_VALUE"] = "AttributeValue";
})(ParseState || (ParseState = {}));
class Token {
    constructor(value, type, startOffset, endOffset) {
        this.value = value;
        this.type = type;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
    }
}
class Tag {
    constructor(name, startOffset, endOffset, attributes, isOpenTag, selfClosingTag) {
        this.name = name;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        this.attributes = attributes;
        this.isOpenTag = isOpenTag;
        this.selfClosingTag = selfClosingTag;
    }
}
class FormatterElement {
    constructor(name) {
        this.children = [];
        this.parent = null;
        this.openTag = null;
        this.closeTag = null;
        this.name = name;
    }
}
//# sourceMappingURL=HTMLFormatter.js.map