// Copyright 2017 The Chromium Authors. All rights reserved.
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
var _SourceMapManager_target, _SourceMapManager_isEnabled, _SourceMapManager_clientData, _SourceMapManager_sourceMaps, _SourceMapManager_attachingClient;
import * as Common from '../common/common.js';
import * as Platform from '../platform/platform.js';
import { PageResourceLoader } from './PageResourceLoader.js';
import { parseSourceMap, SourceMap } from './SourceMap.js';
import { Type } from './Target.js';
export class SourceMapManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor(target) {
        super();
        _SourceMapManager_target.set(this, void 0);
        _SourceMapManager_isEnabled.set(this, true);
        _SourceMapManager_clientData.set(this, new Map());
        _SourceMapManager_sourceMaps.set(this, new Map());
        _SourceMapManager_attachingClient.set(this, null);
        __classPrivateFieldSet(this, _SourceMapManager_target, target, "f");
    }
    setEnabled(isEnabled) {
        if (isEnabled === __classPrivateFieldGet(this, _SourceMapManager_isEnabled, "f")) {
            return;
        }
        // We need this copy, because `this.#clientData` is getting modified
        // in the loop body and trying to iterate over it at the same time
        // leads to an infinite loop.
        const clientData = [...__classPrivateFieldGet(this, _SourceMapManager_clientData, "f").entries()];
        for (const [client] of clientData) {
            this.detachSourceMap(client);
        }
        __classPrivateFieldSet(this, _SourceMapManager_isEnabled, isEnabled, "f");
        for (const [client, { relativeSourceURL, relativeSourceMapURL }] of clientData) {
            this.attachSourceMap(client, relativeSourceURL, relativeSourceMapURL);
        }
    }
    static getBaseUrl(target) {
        while (target && target.type() !== Type.FRAME) {
            target = target.parentTarget();
        }
        return target?.inspectedURL() ?? Platform.DevToolsPath.EmptyUrlString;
    }
    static resolveRelativeSourceURL(target, url) {
        url = Common.ParsedURL.ParsedURL.completeURL(SourceMapManager.getBaseUrl(target), url) ?? url;
        return url;
    }
    sourceMapForClient(client) {
        return __classPrivateFieldGet(this, _SourceMapManager_clientData, "f").get(client)?.sourceMap;
    }
    // This method actively awaits the source map, if still loading.
    sourceMapForClientPromise(client) {
        const clientData = __classPrivateFieldGet(this, _SourceMapManager_clientData, "f").get(client);
        if (!clientData) {
            return Promise.resolve(undefined);
        }
        return clientData.sourceMapPromise;
    }
    clientForSourceMap(sourceMap) {
        return __classPrivateFieldGet(this, _SourceMapManager_sourceMaps, "f").get(sourceMap);
    }
    // TODO(bmeurer): We are lying about the type of |relativeSourceURL| here.
    attachSourceMap(client, relativeSourceURL, relativeSourceMapURL) {
        if (__classPrivateFieldGet(this, _SourceMapManager_clientData, "f").has(client)) {
            throw new Error('SourceMap is already attached or being attached to client');
        }
        if (!relativeSourceMapURL) {
            return;
        }
        let clientData = {
            relativeSourceURL,
            relativeSourceMapURL,
            sourceMap: undefined,
            sourceMapPromise: Promise.resolve(undefined),
        };
        if (__classPrivateFieldGet(this, _SourceMapManager_isEnabled, "f")) {
            // The `// #sourceURL=foo` can be a random string, but is generally an absolute path.
            // Complete it to inspected page url for relative links.
            const sourceURL = SourceMapManager.resolveRelativeSourceURL(__classPrivateFieldGet(this, _SourceMapManager_target, "f"), relativeSourceURL);
            const sourceMapURL = Common.ParsedURL.ParsedURL.completeURL(sourceURL, relativeSourceMapURL);
            if (sourceMapURL) {
                if (__classPrivateFieldGet(this, _SourceMapManager_attachingClient, "f")) {
                    // This should not happen
                    console.error('Attaching source map may cancel previously attaching source map');
                }
                __classPrivateFieldSet(this, _SourceMapManager_attachingClient, client, "f");
                this.dispatchEventToListeners(Events.SourceMapWillAttach, { client });
                if (__classPrivateFieldGet(this, _SourceMapManager_attachingClient, "f") === client) {
                    __classPrivateFieldSet(this, _SourceMapManager_attachingClient, null, "f");
                    const initiator = client.createPageResourceLoadInitiator();
                    clientData.sourceMapPromise =
                        loadSourceMap(sourceMapURL, initiator)
                            .then(payload => {
                            const sourceMap = new SourceMap(sourceURL, sourceMapURL, payload);
                            if (__classPrivateFieldGet(this, _SourceMapManager_clientData, "f").get(client) === clientData) {
                                clientData.sourceMap = sourceMap;
                                __classPrivateFieldGet(this, _SourceMapManager_sourceMaps, "f").set(sourceMap, client);
                                this.dispatchEventToListeners(Events.SourceMapAttached, { client, sourceMap });
                            }
                            return sourceMap;
                        }, () => {
                            if (__classPrivateFieldGet(this, _SourceMapManager_clientData, "f").get(client) === clientData) {
                                this.dispatchEventToListeners(Events.SourceMapFailedToAttach, { client });
                            }
                            return undefined;
                        });
                }
                else {
                    // Assume cancelAttachSourceMap was called.
                    if (__classPrivateFieldGet(this, _SourceMapManager_attachingClient, "f")) {
                        // This should not happen
                        console.error('Cancelling source map attach because another source map is attaching');
                    }
                    clientData = null;
                    this.dispatchEventToListeners(Events.SourceMapFailedToAttach, { client });
                }
            }
        }
        if (clientData) {
            __classPrivateFieldGet(this, _SourceMapManager_clientData, "f").set(client, clientData);
        }
    }
    cancelAttachSourceMap(client) {
        if (client === __classPrivateFieldGet(this, _SourceMapManager_attachingClient, "f")) {
            __classPrivateFieldSet(this, _SourceMapManager_attachingClient, null, "f");
            // This should not happen.
        }
        else if (__classPrivateFieldGet(this, _SourceMapManager_attachingClient, "f")) {
            console.error('cancel attach source map requested but a different source map was being attached');
        }
        else {
            console.error('cancel attach source map requested but no source map was being attached');
        }
    }
    detachSourceMap(client) {
        const clientData = __classPrivateFieldGet(this, _SourceMapManager_clientData, "f").get(client);
        if (!clientData) {
            return;
        }
        __classPrivateFieldGet(this, _SourceMapManager_clientData, "f").delete(client);
        if (!__classPrivateFieldGet(this, _SourceMapManager_isEnabled, "f")) {
            return;
        }
        const { sourceMap } = clientData;
        if (sourceMap) {
            __classPrivateFieldGet(this, _SourceMapManager_sourceMaps, "f").delete(sourceMap);
            this.dispatchEventToListeners(Events.SourceMapDetached, { client, sourceMap });
        }
        else {
            this.dispatchEventToListeners(Events.SourceMapFailedToAttach, { client });
        }
    }
}
_SourceMapManager_target = new WeakMap(), _SourceMapManager_isEnabled = new WeakMap(), _SourceMapManager_clientData = new WeakMap(), _SourceMapManager_sourceMaps = new WeakMap(), _SourceMapManager_attachingClient = new WeakMap();
export async function loadSourceMap(url, initiator) {
    try {
        const { content } = await PageResourceLoader.instance().loadResource(url, initiator);
        return parseSourceMap(content);
    }
    catch (cause) {
        throw new Error(`Could not load content for ${url}: ${cause.message}`, { cause });
    }
}
export async function tryLoadSourceMap(url, initiator) {
    try {
        const { content } = await PageResourceLoader.instance().loadResource(url, initiator);
        return parseSourceMap(content);
    }
    catch (cause) {
        console.error(`Could not load content for ${url}: ${cause.message}`, { cause });
        return null;
    }
}
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["SourceMapWillAttach"] = "SourceMapWillAttach";
    Events["SourceMapFailedToAttach"] = "SourceMapFailedToAttach";
    Events["SourceMapAttached"] = "SourceMapAttached";
    Events["SourceMapDetached"] = "SourceMapDetached";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
//# sourceMappingURL=SourceMapManager.js.map