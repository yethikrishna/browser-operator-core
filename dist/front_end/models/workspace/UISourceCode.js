/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
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
var _UISourceCode_instances, _UISourceCode_origin, _UISourceCode_parentURL, _UISourceCode_project, _UISourceCode_url, _UISourceCode_name, _UISourceCode_contentType, _UISourceCode_requestContentPromise, _UISourceCode_decorations, _UISourceCode_hasCommits, _UISourceCode_messages, _UISourceCode_content, _UISourceCode_forceLoadOnCheckContent, _UISourceCode_checkingContent, _UISourceCode_lastAcceptedContent, _UISourceCode_workingCopy, _UISourceCode_workingCopyGetter, _UISourceCode_disableEdit, _UISourceCode_contentEncoded, _UISourceCode_isKnownThirdParty, _UISourceCode_isUnconditionallyIgnoreListed, _UISourceCode_containsAiChanges, _UISourceCode_updateName, _UISourceCode_requestContent, _UISourceCode_decodeContent, _UISourceCode_unsafeDecodeContentData, _UISourceCode_commitContent, _UISourceCode_contentCommitted, _UISourceCode_resetWorkingCopy, _UISourceCode_workingCopyChanged, _UISourceCode_removeAllMessages, _Message_level, _Message_text, _Message_clickHandler;
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as TextUtils from '../text_utils/text_utils.js';
import { Events as WorkspaceImplEvents } from './WorkspaceImpl.js';
const UIStrings = {
    /**
     *@description Text for the index of something
     */
    index: '(index)',
    /**
     *@description Text in UISource Code of the DevTools local workspace
     */
    thisFileWasChangedExternally: 'This file was changed externally. Would you like to reload it?',
};
const str_ = i18n.i18n.registerUIStrings('models/workspace/UISourceCode.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class UISourceCode extends Common.ObjectWrapper.ObjectWrapper {
    constructor(project, url, contentType) {
        super();
        _UISourceCode_instances.add(this);
        _UISourceCode_origin.set(this, void 0);
        _UISourceCode_parentURL.set(this, void 0);
        _UISourceCode_project.set(this, void 0);
        _UISourceCode_url.set(this, void 0);
        _UISourceCode_name.set(this, void 0);
        _UISourceCode_contentType.set(this, void 0);
        _UISourceCode_requestContentPromise.set(this, null);
        _UISourceCode_decorations.set(this, new Map());
        _UISourceCode_hasCommits.set(this, false);
        _UISourceCode_messages.set(this, null);
        _UISourceCode_content.set(this, null);
        _UISourceCode_forceLoadOnCheckContent.set(this, false);
        _UISourceCode_checkingContent.set(this, false);
        _UISourceCode_lastAcceptedContent.set(this, null);
        _UISourceCode_workingCopy.set(this, null);
        _UISourceCode_workingCopyGetter.set(this, null);
        _UISourceCode_disableEdit.set(this, false);
        _UISourceCode_contentEncoded.set(this, void 0);
        _UISourceCode_isKnownThirdParty.set(this, false);
        _UISourceCode_isUnconditionallyIgnoreListed.set(this, false);
        _UISourceCode_containsAiChanges.set(this, false);
        __classPrivateFieldSet(this, _UISourceCode_project, project, "f");
        __classPrivateFieldSet(this, _UISourceCode_url, url, "f");
        const parsedURL = Common.ParsedURL.ParsedURL.fromString(url);
        if (parsedURL) {
            __classPrivateFieldSet(this, _UISourceCode_origin, parsedURL.securityOrigin(), "f");
            __classPrivateFieldSet(this, _UISourceCode_parentURL, Common.ParsedURL.ParsedURL.concatenate(__classPrivateFieldGet(this, _UISourceCode_origin, "f"), parsedURL.folderPathComponents), "f");
            if (parsedURL.queryParams && !(parsedURL.lastPathComponent && contentType.isFromSourceMap())) {
                // If there is a query param, display it like a URL. Unless it is from a source map,
                // in which case the query param is probably a hash that is best left hidden.
                __classPrivateFieldSet(this, _UISourceCode_name, parsedURL.lastPathComponent + '?' + parsedURL.queryParams, "f");
            }
            else {
                // file name looks best decoded
                try {
                    __classPrivateFieldSet(this, _UISourceCode_name, decodeURIComponent(parsedURL.lastPathComponent), "f");
                }
                catch {
                    // Decoding might fail.
                    __classPrivateFieldSet(this, _UISourceCode_name, parsedURL.lastPathComponent, "f");
                }
            }
        }
        else {
            __classPrivateFieldSet(this, _UISourceCode_origin, Platform.DevToolsPath.EmptyUrlString, "f");
            __classPrivateFieldSet(this, _UISourceCode_parentURL, Platform.DevToolsPath.EmptyUrlString, "f");
            __classPrivateFieldSet(this, _UISourceCode_name, url, "f");
        }
        __classPrivateFieldSet(this, _UISourceCode_contentType, contentType, "f");
    }
    requestMetadata() {
        return __classPrivateFieldGet(this, _UISourceCode_project, "f").requestMetadata(this);
    }
    name() {
        return __classPrivateFieldGet(this, _UISourceCode_name, "f");
    }
    mimeType() {
        return __classPrivateFieldGet(this, _UISourceCode_project, "f").mimeType(this);
    }
    url() {
        return __classPrivateFieldGet(this, _UISourceCode_url, "f");
    }
    // Identifier used for deduplicating scripts that are considered by the
    // DevTools UI to be the same script. For now this is just the url but this
    // is likely to change in the future.
    canonicalScriptId() {
        return `${__classPrivateFieldGet(this, _UISourceCode_contentType, "f").name()},${__classPrivateFieldGet(this, _UISourceCode_url, "f")}`;
    }
    parentURL() {
        return __classPrivateFieldGet(this, _UISourceCode_parentURL, "f");
    }
    origin() {
        return __classPrivateFieldGet(this, _UISourceCode_origin, "f");
    }
    fullDisplayName() {
        return __classPrivateFieldGet(this, _UISourceCode_project, "f").fullDisplayName(this);
    }
    displayName(skipTrim) {
        if (!__classPrivateFieldGet(this, _UISourceCode_name, "f")) {
            return i18nString(UIStrings.index);
        }
        const name = __classPrivateFieldGet(this, _UISourceCode_name, "f");
        return skipTrim ? name : Platform.StringUtilities.trimEndWithMaxLength(name, 100);
    }
    canRename() {
        return __classPrivateFieldGet(this, _UISourceCode_project, "f").canRename();
    }
    rename(newName) {
        const { resolve, promise } = Promise.withResolvers();
        __classPrivateFieldGet(this, _UISourceCode_project, "f").rename(this, newName, innerCallback.bind(this));
        return promise;
        function innerCallback(success, newName, newURL, newContentType) {
            if (success) {
                __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_updateName).call(this, newName, newURL, newContentType);
            }
            resolve(success);
        }
    }
    remove() {
        __classPrivateFieldGet(this, _UISourceCode_project, "f").deleteFile(this);
    }
    contentURL() {
        return this.url();
    }
    contentType() {
        return __classPrivateFieldGet(this, _UISourceCode_contentType, "f");
    }
    project() {
        return __classPrivateFieldGet(this, _UISourceCode_project, "f");
    }
    requestContentData({ cachedWasmOnly } = {}) {
        if (__classPrivateFieldGet(this, _UISourceCode_requestContentPromise, "f")) {
            return __classPrivateFieldGet(this, _UISourceCode_requestContentPromise, "f");
        }
        if (__classPrivateFieldGet(this, _UISourceCode_content, "f")) {
            return Promise.resolve(__classPrivateFieldGet(this, _UISourceCode_content, "f"));
        }
        if (cachedWasmOnly && this.mimeType() === 'application/wasm') {
            return Promise.resolve(new TextUtils.WasmDisassembly.WasmDisassembly([], [], []));
        }
        __classPrivateFieldSet(this, _UISourceCode_requestContentPromise, __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_requestContent).call(this), "f");
        return __classPrivateFieldGet(this, _UISourceCode_requestContentPromise, "f");
    }
    async checkContentUpdated() {
        if (!__classPrivateFieldGet(this, _UISourceCode_content, "f") && !__classPrivateFieldGet(this, _UISourceCode_forceLoadOnCheckContent, "f")) {
            return;
        }
        if (!__classPrivateFieldGet(this, _UISourceCode_project, "f").canSetFileContent() || __classPrivateFieldGet(this, _UISourceCode_checkingContent, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _UISourceCode_checkingContent, true, "f");
        const updatedContent = TextUtils.ContentData.ContentData.asDeferredContent(await __classPrivateFieldGet(this, _UISourceCode_project, "f").requestFileContent(this));
        if ('error' in updatedContent) {
            return;
        }
        __classPrivateFieldSet(this, _UISourceCode_checkingContent, false, "f");
        if (updatedContent.content === null) {
            const workingCopy = this.workingCopy();
            __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_contentCommitted).call(this, '', false);
            this.setWorkingCopy(workingCopy);
            return;
        }
        if (__classPrivateFieldGet(this, _UISourceCode_lastAcceptedContent, "f") === updatedContent.content) {
            return;
        }
        if (__classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_unsafeDecodeContentData).call(this, __classPrivateFieldGet(this, _UISourceCode_content, "f")) === __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_decodeContent).call(this, updatedContent)) {
            __classPrivateFieldSet(this, _UISourceCode_lastAcceptedContent, null, "f");
            return;
        }
        if (!this.isDirty() || __classPrivateFieldGet(this, _UISourceCode_workingCopy, "f") === updatedContent.content) {
            __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_contentCommitted).call(this, updatedContent.content, false);
            return;
        }
        await Common.Revealer.reveal(this);
        // Make sure we are in the next frame before stopping the world with confirm
        await new Promise(resolve => window.setTimeout(resolve, 0));
        const shouldUpdate = window.confirm(i18nString(UIStrings.thisFileWasChangedExternally));
        if (shouldUpdate) {
            __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_contentCommitted).call(this, updatedContent.content, false);
        }
        else {
            __classPrivateFieldSet(this, _UISourceCode_lastAcceptedContent, updatedContent.content, "f");
        }
    }
    forceLoadOnCheckContent() {
        __classPrivateFieldSet(this, _UISourceCode_forceLoadOnCheckContent, true, "f");
    }
    addRevision(content) {
        __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_commitContent).call(this, content);
    }
    hasCommits() {
        return __classPrivateFieldGet(this, _UISourceCode_hasCommits, "f");
    }
    workingCopy() {
        return this.workingCopyContent().content || '';
    }
    workingCopyContent() {
        return this.workingCopyContentData().asDeferedContent();
    }
    workingCopyContentData() {
        if (__classPrivateFieldGet(this, _UISourceCode_workingCopyGetter, "f")) {
            __classPrivateFieldSet(this, _UISourceCode_workingCopy, __classPrivateFieldGet(this, _UISourceCode_workingCopyGetter, "f").call(this), "f");
            __classPrivateFieldSet(this, _UISourceCode_workingCopyGetter, null, "f");
        }
        const contentData = __classPrivateFieldGet(this, _UISourceCode_content, "f") ? TextUtils.ContentData.ContentData.contentDataOrEmpty(__classPrivateFieldGet(this, _UISourceCode_content, "f")) :
            TextUtils.ContentData.EMPTY_TEXT_CONTENT_DATA;
        if (__classPrivateFieldGet(this, _UISourceCode_workingCopy, "f") !== null) {
            return new TextUtils.ContentData.ContentData(__classPrivateFieldGet(this, _UISourceCode_workingCopy, "f"), /* isBase64 */ false, contentData.mimeType);
        }
        return contentData;
    }
    resetWorkingCopy() {
        __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_resetWorkingCopy).call(this);
        __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_workingCopyChanged).call(this);
    }
    setWorkingCopy(newWorkingCopy) {
        __classPrivateFieldSet(this, _UISourceCode_workingCopy, newWorkingCopy, "f");
        __classPrivateFieldSet(this, _UISourceCode_workingCopyGetter, null, "f");
        __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_workingCopyChanged).call(this);
    }
    setContainsAiChanges(containsAiChanges) {
        __classPrivateFieldSet(this, _UISourceCode_containsAiChanges, containsAiChanges, "f");
    }
    containsAiChanges() {
        return __classPrivateFieldGet(this, _UISourceCode_containsAiChanges, "f");
    }
    setContent(content, isBase64) {
        __classPrivateFieldSet(this, _UISourceCode_contentEncoded, isBase64, "f");
        if (__classPrivateFieldGet(this, _UISourceCode_project, "f").canSetFileContent()) {
            void __classPrivateFieldGet(this, _UISourceCode_project, "f").setFileContent(this, content, isBase64);
        }
        __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_contentCommitted).call(this, content, true);
    }
    setWorkingCopyGetter(workingCopyGetter) {
        __classPrivateFieldSet(this, _UISourceCode_workingCopyGetter, workingCopyGetter, "f");
        __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_workingCopyChanged).call(this);
    }
    removeWorkingCopyGetter() {
        if (!__classPrivateFieldGet(this, _UISourceCode_workingCopyGetter, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _UISourceCode_workingCopy, __classPrivateFieldGet(this, _UISourceCode_workingCopyGetter, "f").call(this), "f");
        __classPrivateFieldSet(this, _UISourceCode_workingCopyGetter, null, "f");
    }
    commitWorkingCopy() {
        if (this.isDirty()) {
            __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_commitContent).call(this, this.workingCopy());
        }
    }
    isDirty() {
        return __classPrivateFieldGet(this, _UISourceCode_workingCopy, "f") !== null || __classPrivateFieldGet(this, _UISourceCode_workingCopyGetter, "f") !== null;
    }
    isKnownThirdParty() {
        return __classPrivateFieldGet(this, _UISourceCode_isKnownThirdParty, "f");
    }
    markKnownThirdParty() {
        __classPrivateFieldSet(this, _UISourceCode_isKnownThirdParty, true, "f");
    }
    /**
     * {@link markAsUnconditionallyIgnoreListed}
     */
    isUnconditionallyIgnoreListed() {
        return __classPrivateFieldGet(this, _UISourceCode_isUnconditionallyIgnoreListed, "f");
    }
    isFetchXHR() {
        return [Common.ResourceType.resourceTypes.XHR, Common.ResourceType.resourceTypes.Fetch].includes(this.contentType());
    }
    /**
     * Unconditionally ignore list this UISourcecode, ignoring any user
     * setting. We use this to mark breakpoint/logpoint condition scripts for now.
     */
    markAsUnconditionallyIgnoreListed() {
        __classPrivateFieldSet(this, _UISourceCode_isUnconditionallyIgnoreListed, true, "f");
    }
    extension() {
        return Common.ParsedURL.ParsedURL.extractExtension(__classPrivateFieldGet(this, _UISourceCode_name, "f"));
    }
    content() {
        if (!__classPrivateFieldGet(this, _UISourceCode_content, "f") || 'error' in __classPrivateFieldGet(this, _UISourceCode_content, "f")) {
            return '';
        }
        return __classPrivateFieldGet(this, _UISourceCode_content, "f").text;
    }
    loadError() {
        return (__classPrivateFieldGet(this, _UISourceCode_content, "f") && 'error' in __classPrivateFieldGet(this, _UISourceCode_content, "f") && __classPrivateFieldGet(this, _UISourceCode_content, "f").error) || null;
    }
    searchInContent(query, caseSensitive, isRegex) {
        if (!__classPrivateFieldGet(this, _UISourceCode_content, "f") || 'error' in __classPrivateFieldGet(this, _UISourceCode_content, "f")) {
            return __classPrivateFieldGet(this, _UISourceCode_project, "f").searchInFileContent(this, query, caseSensitive, isRegex);
        }
        return Promise.resolve(TextUtils.TextUtils.performSearchInContentData(__classPrivateFieldGet(this, _UISourceCode_content, "f"), query, caseSensitive, isRegex));
    }
    contentLoaded() {
        return Boolean(__classPrivateFieldGet(this, _UISourceCode_content, "f"));
    }
    uiLocation(lineNumber, columnNumber) {
        return new UILocation(this, lineNumber, columnNumber);
    }
    messages() {
        return __classPrivateFieldGet(this, _UISourceCode_messages, "f") ? new Set(__classPrivateFieldGet(this, _UISourceCode_messages, "f")) : new Set();
    }
    addLineMessage(level, text, lineNumber, columnNumber, clickHandler) {
        const range = TextUtils.TextRange.TextRange.createFromLocation(lineNumber, columnNumber || 0);
        const message = new Message(level, text, clickHandler, range);
        this.addMessage(message);
        return message;
    }
    addMessage(message) {
        if (!__classPrivateFieldGet(this, _UISourceCode_messages, "f")) {
            __classPrivateFieldSet(this, _UISourceCode_messages, new Set(), "f");
        }
        __classPrivateFieldGet(this, _UISourceCode_messages, "f").add(message);
        this.dispatchEventToListeners(Events.MessageAdded, message);
    }
    removeMessage(message) {
        if (__classPrivateFieldGet(this, _UISourceCode_messages, "f")?.delete(message)) {
            this.dispatchEventToListeners(Events.MessageRemoved, message);
        }
    }
    setDecorationData(type, data) {
        if (data !== __classPrivateFieldGet(this, _UISourceCode_decorations, "f").get(type)) {
            __classPrivateFieldGet(this, _UISourceCode_decorations, "f").set(type, data);
            this.dispatchEventToListeners(Events.DecorationChanged, type);
        }
    }
    getDecorationData(type) {
        return __classPrivateFieldGet(this, _UISourceCode_decorations, "f").get(type);
    }
    disableEdit() {
        __classPrivateFieldSet(this, _UISourceCode_disableEdit, true, "f");
    }
    editDisabled() {
        return __classPrivateFieldGet(this, _UISourceCode_disableEdit, "f");
    }
}
_UISourceCode_origin = new WeakMap(), _UISourceCode_parentURL = new WeakMap(), _UISourceCode_project = new WeakMap(), _UISourceCode_url = new WeakMap(), _UISourceCode_name = new WeakMap(), _UISourceCode_contentType = new WeakMap(), _UISourceCode_requestContentPromise = new WeakMap(), _UISourceCode_decorations = new WeakMap(), _UISourceCode_hasCommits = new WeakMap(), _UISourceCode_messages = new WeakMap(), _UISourceCode_content = new WeakMap(), _UISourceCode_forceLoadOnCheckContent = new WeakMap(), _UISourceCode_checkingContent = new WeakMap(), _UISourceCode_lastAcceptedContent = new WeakMap(), _UISourceCode_workingCopy = new WeakMap(), _UISourceCode_workingCopyGetter = new WeakMap(), _UISourceCode_disableEdit = new WeakMap(), _UISourceCode_contentEncoded = new WeakMap(), _UISourceCode_isKnownThirdParty = new WeakMap(), _UISourceCode_isUnconditionallyIgnoreListed = new WeakMap(), _UISourceCode_containsAiChanges = new WeakMap(), _UISourceCode_instances = new WeakSet(), _UISourceCode_updateName = function _UISourceCode_updateName(name, url, contentType) {
    const oldURL = __classPrivateFieldGet(this, _UISourceCode_url, "f");
    __classPrivateFieldSet(this, _UISourceCode_name, name, "f");
    if (url) {
        __classPrivateFieldSet(this, _UISourceCode_url, url, "f");
    }
    else {
        __classPrivateFieldSet(this, _UISourceCode_url, Common.ParsedURL.ParsedURL.relativePathToUrlString(name, oldURL), "f");
    }
    if (contentType) {
        __classPrivateFieldSet(this, _UISourceCode_contentType, contentType, "f");
    }
    this.dispatchEventToListeners(Events.TitleChanged, this);
    this.project().workspace().dispatchEventToListeners(WorkspaceImplEvents.UISourceCodeRenamed, { oldURL, uiSourceCode: this });
}, _UISourceCode_requestContent = async function _UISourceCode_requestContent() {
    if (__classPrivateFieldGet(this, _UISourceCode_content, "f")) {
        throw new Error('Called UISourceCode#requestContentImpl even though content is available for ' + __classPrivateFieldGet(this, _UISourceCode_url, "f"));
    }
    try {
        __classPrivateFieldSet(this, _UISourceCode_content, await __classPrivateFieldGet(this, _UISourceCode_project, "f").requestFileContent(this), "f");
    }
    catch (err) {
        __classPrivateFieldSet(this, _UISourceCode_content, { error: err ? String(err) : '' }, "f");
    }
    return __classPrivateFieldGet(this, _UISourceCode_content, "f");
}, _UISourceCode_decodeContent = function _UISourceCode_decodeContent(content) {
    if (!content) {
        return null;
    }
    return content.isEncoded && content.content ? window.atob(content.content) : content.content;
}, _UISourceCode_unsafeDecodeContentData = function _UISourceCode_unsafeDecodeContentData(content) {
    if (!content || TextUtils.ContentData.ContentData.isError(content)) {
        return null;
    }
    return content.createdFromBase64 ? window.atob(content.base64) : content.text;
}, _UISourceCode_commitContent = function _UISourceCode_commitContent(content) {
    if (__classPrivateFieldGet(this, _UISourceCode_project, "f").canSetFileContent()) {
        void __classPrivateFieldGet(this, _UISourceCode_project, "f").setFileContent(this, content, false);
    }
    __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_contentCommitted).call(this, content, true);
}, _UISourceCode_contentCommitted = function _UISourceCode_contentCommitted(content, committedByUser) {
    __classPrivateFieldSet(this, _UISourceCode_lastAcceptedContent, null, "f");
    __classPrivateFieldSet(this, _UISourceCode_content, new TextUtils.ContentData.ContentData(content, Boolean(__classPrivateFieldGet(this, _UISourceCode_contentEncoded, "f")), this.mimeType()), "f");
    __classPrivateFieldSet(this, _UISourceCode_requestContentPromise, null, "f");
    __classPrivateFieldSet(this, _UISourceCode_hasCommits, true, "f");
    __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_resetWorkingCopy).call(this);
    const data = { uiSourceCode: this, content, encoded: __classPrivateFieldGet(this, _UISourceCode_contentEncoded, "f") };
    this.dispatchEventToListeners(Events.WorkingCopyCommitted, data);
    __classPrivateFieldGet(this, _UISourceCode_project, "f").workspace().dispatchEventToListeners(WorkspaceImplEvents.WorkingCopyCommitted, data);
    if (committedByUser) {
        __classPrivateFieldGet(this, _UISourceCode_project, "f").workspace().dispatchEventToListeners(WorkspaceImplEvents.WorkingCopyCommittedByUser, data);
    }
}, _UISourceCode_resetWorkingCopy = function _UISourceCode_resetWorkingCopy() {
    __classPrivateFieldSet(this, _UISourceCode_workingCopy, null, "f");
    __classPrivateFieldSet(this, _UISourceCode_workingCopyGetter, null, "f");
    this.setContainsAiChanges(false);
}, _UISourceCode_workingCopyChanged = function _UISourceCode_workingCopyChanged() {
    __classPrivateFieldGet(this, _UISourceCode_instances, "m", _UISourceCode_removeAllMessages).call(this);
    this.dispatchEventToListeners(Events.WorkingCopyChanged, this);
    __classPrivateFieldGet(this, _UISourceCode_project, "f").workspace().dispatchEventToListeners(WorkspaceImplEvents.WorkingCopyChanged, { uiSourceCode: this });
}, _UISourceCode_removeAllMessages = function _UISourceCode_removeAllMessages() {
    if (!__classPrivateFieldGet(this, _UISourceCode_messages, "f")) {
        return;
    }
    for (const message of __classPrivateFieldGet(this, _UISourceCode_messages, "f")) {
        this.dispatchEventToListeners(Events.MessageRemoved, message);
    }
    __classPrivateFieldSet(this, _UISourceCode_messages, null, "f");
};
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["WorkingCopyChanged"] = "WorkingCopyChanged";
    Events["WorkingCopyCommitted"] = "WorkingCopyCommitted";
    Events["TitleChanged"] = "TitleChanged";
    Events["MessageAdded"] = "MessageAdded";
    Events["MessageRemoved"] = "MessageRemoved";
    Events["DecorationChanged"] = "DecorationChanged";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
export class UILocation {
    constructor(uiSourceCode, lineNumber, columnNumber) {
        this.uiSourceCode = uiSourceCode;
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber;
    }
    linkText(skipTrim = false, showColumnNumber = false) {
        const displayName = this.uiSourceCode.displayName(skipTrim);
        const lineAndColumnText = this.lineAndColumnText(showColumnNumber);
        let text = lineAndColumnText ? displayName + ':' + lineAndColumnText : displayName;
        if (this.uiSourceCode.isDirty()) {
            text = '*' + text;
        }
        return text;
    }
    lineAndColumnText(showColumnNumber = false) {
        let lineAndColumnText;
        if (this.uiSourceCode.mimeType() === 'application/wasm') {
            // For WebAssembly locations, we follow the conventions described in
            // github.com/WebAssembly/design/blob/master/Web.md#developer-facing-display-conventions
            if (typeof this.columnNumber === 'number') {
                lineAndColumnText = `0x${this.columnNumber.toString(16)}`;
            }
        }
        else {
            lineAndColumnText = `${this.lineNumber + 1}`;
            if (showColumnNumber && typeof this.columnNumber === 'number') {
                lineAndColumnText += ':' + (this.columnNumber + 1);
            }
        }
        return lineAndColumnText;
    }
    id() {
        if (typeof this.columnNumber === 'number') {
            return this.uiSourceCode.project().id() + ':' + this.uiSourceCode.url() + ':' + this.lineNumber + ':' +
                this.columnNumber;
        }
        return this.lineId();
    }
    lineId() {
        return this.uiSourceCode.project().id() + ':' + this.uiSourceCode.url() + ':' + this.lineNumber;
    }
    static comparator(location1, location2) {
        return location1.compareTo(location2);
    }
    compareTo(other) {
        if (this.uiSourceCode.url() !== other.uiSourceCode.url()) {
            return this.uiSourceCode.url() > other.uiSourceCode.url() ? 1 : -1;
        }
        if (this.lineNumber !== other.lineNumber) {
            return this.lineNumber - other.lineNumber;
        }
        // We consider `undefined` less than an actual column number, since
        // UI location without a column number corresponds to the whole line.
        if (this.columnNumber === other.columnNumber) {
            return 0;
        }
        if (typeof this.columnNumber !== 'number') {
            return -1;
        }
        if (typeof other.columnNumber !== 'number') {
            return 1;
        }
        return this.columnNumber - other.columnNumber;
    }
}
/**
 * A text range inside a specific {@link UISourceCode}.
 *
 * We use a class instead of an interface so we can implement a revealer for it.
 */
export class UILocationRange {
    constructor(uiSourceCode, range) {
        this.uiSourceCode = uiSourceCode;
        this.range = range;
    }
}
/**
 * A message associated with a range in a `UISourceCode`. The range will be
 * underlined starting at the range's start and ending at the line end (the
 * end of the range is currently disregarded).
 * An icon is going to appear at the end of the line according to the
 * `level` of the Message. This is only the model; displaying is handled
 * where UISourceCode displaying is handled.
 */
export class Message {
    constructor(level, text, clickHandler, range) {
        _Message_level.set(this, void 0);
        _Message_text.set(this, void 0);
        _Message_clickHandler.set(this, void 0);
        __classPrivateFieldSet(this, _Message_level, level, "f");
        __classPrivateFieldSet(this, _Message_text, text, "f");
        this.range = range ?? new TextUtils.TextRange.TextRange(0, 0, 0, 0);
        __classPrivateFieldSet(this, _Message_clickHandler, clickHandler, "f");
    }
    level() {
        return __classPrivateFieldGet(this, _Message_level, "f");
    }
    text() {
        return __classPrivateFieldGet(this, _Message_text, "f");
    }
    clickHandler() {
        return __classPrivateFieldGet(this, _Message_clickHandler, "f");
    }
    lineNumber() {
        return this.range.startLine;
    }
    columnNumber() {
        return this.range.startColumn;
    }
    isEqual(another) {
        return this.text() === another.text() && this.level() === another.level() && this.range.equal(another.range);
    }
}
_Message_level = new WeakMap(), _Message_text = new WeakMap(), _Message_clickHandler = new WeakMap();
(function (Message) {
    let Level;
    (function (Level) {
        Level["ERROR"] = "Error";
        Level["ISSUE"] = "Issue";
        Level["WARNING"] = "Warning";
    })(Level = Message.Level || (Message.Level = {}));
})(Message || (Message = {}));
export class UISourceCodeMetadata {
    constructor(modificationTime, contentSize) {
        this.modificationTime = modificationTime;
        this.contentSize = contentSize;
    }
}
//# sourceMappingURL=UISourceCode.js.map