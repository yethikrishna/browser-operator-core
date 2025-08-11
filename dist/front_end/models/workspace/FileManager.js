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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FileManager_instances, _FileManager_saveCallbacks, _FileManager_canceledSavedURL;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
let fileManagerInstance;
export class FileManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _FileManager_instances.add(this);
        _FileManager_saveCallbacks.set(this, new Map());
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.events.addEventListener(Host.InspectorFrontendHostAPI.Events.SavedURL, this.savedURL, this);
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.events.addEventListener(Host.InspectorFrontendHostAPI.Events.CanceledSaveURL, __classPrivateFieldGet(this, _FileManager_instances, "m", _FileManager_canceledSavedURL), this);
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.events.addEventListener(Host.InspectorFrontendHostAPI.Events.AppendedToURL, this.appendedToURL, this);
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!fileManagerInstance || forceNew) {
            fileManagerInstance = new FileManager();
        }
        return fileManagerInstance;
    }
    /**
     * {@link FileManager.close | close} *must* be called, for the InspectorFrontendHostStub case, to complete the saving.
     */
    save(url, contentData, forceSaveAs) {
        // Remove this url from the saved URLs while it is being saved.
        const result = new Promise(resolve => __classPrivateFieldGet(this, _FileManager_saveCallbacks, "f").set(url, resolve));
        const { isTextContent } = contentData;
        const content = isTextContent ? contentData.text : contentData.base64;
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.save(url, content, forceSaveAs, !isTextContent);
        return result;
    }
    /**
     * Used in web tests
     */
    savedURL(event) {
        const { url, fileSystemPath } = event.data;
        const callback = __classPrivateFieldGet(this, _FileManager_saveCallbacks, "f").get(url);
        __classPrivateFieldGet(this, _FileManager_saveCallbacks, "f").delete(url);
        if (callback) {
            callback({ fileSystemPath });
        }
    }
    append(url, content) {
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.append(url, content);
    }
    close(url) {
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.close(url);
    }
    /**
     * Used in web tests
     */
    appendedToURL({ data: url }) {
        this.dispatchEventToListeners("AppendedToURL" /* Events.APPENDED_TO_URL */, url);
    }
}
_FileManager_saveCallbacks = new WeakMap(), _FileManager_instances = new WeakSet(), _FileManager_canceledSavedURL = function _FileManager_canceledSavedURL({ data: url }) {
    const callback = __classPrivateFieldGet(this, _FileManager_saveCallbacks, "f").get(url);
    __classPrivateFieldGet(this, _FileManager_saveCallbacks, "f").delete(url);
    if (callback) {
        callback(null);
    }
};
export var Events;
(function (Events) {
    Events["APPENDED_TO_URL"] = "AppendedToURL";
})(Events || (Events = {}));
//# sourceMappingURL=FileManager.js.map