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
var _CSSStyleSheetHeader_cssModelInternal, _CSSStyleSheetHeader_originalContentProviderInternal;
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import * as Platform from '../platform/platform.js';
import { DeferredDOMNode } from './DOMModel.js';
import { ResourceTreeModel } from './ResourceTreeModel.js';
const UIStrings = {
    /**
     *@description Error message for when a CSS file can't be loaded
     */
    couldNotFindTheOriginalStyle: 'Could not find the original style sheet.',
    /**
     *@description Error message to display when a source CSS file could not be retrieved.
     */
    thereWasAnErrorRetrievingThe: 'There was an error retrieving the source styles.',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/CSSStyleSheetHeader.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class CSSStyleSheetHeader {
    constructor(cssModel, payload) {
        _CSSStyleSheetHeader_cssModelInternal.set(this, void 0);
        _CSSStyleSheetHeader_originalContentProviderInternal.set(this, void 0);
        __classPrivateFieldSet(this, _CSSStyleSheetHeader_cssModelInternal, cssModel, "f");
        this.id = payload.styleSheetId;
        this.frameId = payload.frameId;
        this.sourceURL = payload.sourceURL;
        this.hasSourceURL = Boolean(payload.hasSourceURL);
        this.origin = payload.origin;
        this.title = payload.title;
        this.disabled = payload.disabled;
        this.isInline = payload.isInline;
        this.isMutable = payload.isMutable;
        this.isConstructed = payload.isConstructed;
        this.startLine = payload.startLine;
        this.startColumn = payload.startColumn;
        this.endLine = payload.endLine;
        this.endColumn = payload.endColumn;
        this.contentLength = payload.length;
        if (payload.ownerNode) {
            this.ownerNode = new DeferredDOMNode(cssModel.target(), payload.ownerNode);
        }
        this.sourceMapURL = payload.sourceMapURL;
        this.loadingFailed = payload.loadingFailed ?? false;
        __classPrivateFieldSet(this, _CSSStyleSheetHeader_originalContentProviderInternal, null, "f");
    }
    originalContentProvider() {
        if (!__classPrivateFieldGet(this, _CSSStyleSheetHeader_originalContentProviderInternal, "f")) {
            const lazyContent = (async () => {
                const originalText = await __classPrivateFieldGet(this, _CSSStyleSheetHeader_cssModelInternal, "f").originalStyleSheetText(this);
                if (originalText === null) {
                    return { error: i18nString(UIStrings.couldNotFindTheOriginalStyle) };
                }
                return new TextUtils.ContentData.ContentData(originalText, /* isBase64=*/ false, 'text/css');
            });
            __classPrivateFieldSet(this, _CSSStyleSheetHeader_originalContentProviderInternal, new TextUtils.StaticContentProvider.StaticContentProvider(this.contentURL(), this.contentType(), lazyContent), "f");
        }
        return __classPrivateFieldGet(this, _CSSStyleSheetHeader_originalContentProviderInternal, "f");
    }
    setSourceMapURL(sourceMapURL) {
        this.sourceMapURL = sourceMapURL;
    }
    cssModel() {
        return __classPrivateFieldGet(this, _CSSStyleSheetHeader_cssModelInternal, "f");
    }
    isAnonymousInlineStyleSheet() {
        return !this.resourceURL() && !__classPrivateFieldGet(this, _CSSStyleSheetHeader_cssModelInternal, "f").sourceMapManager().sourceMapForClient(this);
    }
    isConstructedByNew() {
        return this.isConstructed && this.sourceURL.length === 0;
    }
    resourceURL() {
        return this.isViaInspector() ? this.viaInspectorResourceURL() : this.sourceURL;
    }
    getFrameURLPath() {
        const model = __classPrivateFieldGet(this, _CSSStyleSheetHeader_cssModelInternal, "f").target().model(ResourceTreeModel);
        console.assert(Boolean(model));
        if (!model) {
            return '';
        }
        const frame = model.frameForId(this.frameId);
        if (!frame) {
            return '';
        }
        console.assert(Boolean(frame));
        const parsedURL = new Common.ParsedURL.ParsedURL(frame.url);
        let urlPath = parsedURL.host;
        if (parsedURL.port) {
            urlPath += ':' + parsedURL.port;
        }
        urlPath += parsedURL.folderPathComponents;
        if (!urlPath.endsWith('/')) {
            urlPath += '/';
        }
        return urlPath;
    }
    viaInspectorResourceURL() {
        return `inspector://${this.getFrameURLPath()}inspector-stylesheet#${this.id}`;
    }
    lineNumberInSource(lineNumberInStyleSheet) {
        return this.startLine + lineNumberInStyleSheet;
    }
    columnNumberInSource(lineNumberInStyleSheet, columnNumberInStyleSheet) {
        return (lineNumberInStyleSheet ? 0 : this.startColumn) + columnNumberInStyleSheet;
    }
    /**
     * Checks whether the position is in this style sheet. Assumes that the
     * position's columnNumber is consistent with line endings.
     */
    containsLocation(lineNumber, columnNumber) {
        const afterStart = (lineNumber === this.startLine && columnNumber >= this.startColumn) || lineNumber > this.startLine;
        const beforeEnd = lineNumber < this.endLine || (lineNumber === this.endLine && columnNumber <= this.endColumn);
        return afterStart && beforeEnd;
    }
    contentURL() {
        return this.resourceURL();
    }
    contentType() {
        return Common.ResourceType.resourceTypes.Stylesheet;
    }
    async requestContentData() {
        const cssText = await __classPrivateFieldGet(this, _CSSStyleSheetHeader_cssModelInternal, "f").getStyleSheetText(this.id);
        if (cssText === null) {
            return { error: i18nString(UIStrings.thereWasAnErrorRetrievingThe) };
        }
        return new TextUtils.ContentData.ContentData(cssText, /* isBase64=*/ false, 'text/css');
    }
    async searchInContent(query, caseSensitive, isRegex) {
        const contentData = await this.requestContentData();
        return TextUtils.TextUtils.performSearchInContentData(contentData, query, caseSensitive, isRegex);
    }
    isViaInspector() {
        return this.origin === 'inspector';
    }
    createPageResourceLoadInitiator() {
        return {
            target: __classPrivateFieldGet(this, _CSSStyleSheetHeader_cssModelInternal, "f").target(),
            frameId: this.frameId,
            initiatorUrl: this.hasSourceURL ? Platform.DevToolsPath.EmptyUrlString : this.sourceURL,
        };
    }
}
_CSSStyleSheetHeader_cssModelInternal = new WeakMap(), _CSSStyleSheetHeader_originalContentProviderInternal = new WeakMap();
//# sourceMappingURL=CSSStyleSheetHeader.js.map