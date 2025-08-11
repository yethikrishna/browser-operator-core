// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _Conversation_instances, _Conversation_isReadOnly, _Conversation_isExternal, _Conversation_reconstructHistory, _AiHistoryStorage_historySetting, _AiHistoryStorage_imageHistorySettings, _AiHistoryStorage_mutex, _AiHistoryStorage_maxStorageSize;
import * as Common from '../../core/common/common.js';
const MAX_TITLE_LENGTH = 80;
export var ConversationType;
(function (ConversationType) {
    ConversationType["STYLING"] = "freestyler";
    ConversationType["FILE"] = "drjones-file";
    ConversationType["NETWORK"] = "drjones-network-request";
    ConversationType["PERFORMANCE"] = "drjones-performance";
    ConversationType["PERFORMANCE_INSIGHT"] = "performance-insight";
})(ConversationType || (ConversationType = {}));
export const NOT_FOUND_IMAGE_DATA = '';
export class Conversation {
    constructor(type, data = [], id = crypto.randomUUID(), isReadOnly = true, isExternal = false) {
        _Conversation_instances.add(this);
        _Conversation_isReadOnly.set(this, void 0);
        _Conversation_isExternal.set(this, void 0);
        this.type = type;
        this.id = id;
        __classPrivateFieldSet(this, _Conversation_isReadOnly, isReadOnly, "f");
        __classPrivateFieldSet(this, _Conversation_isExternal, isExternal, "f");
        this.history = __classPrivateFieldGet(this, _Conversation_instances, "m", _Conversation_reconstructHistory).call(this, data);
    }
    get isReadOnly() {
        return __classPrivateFieldGet(this, _Conversation_isReadOnly, "f");
    }
    get title() {
        const query = this.history.find(response => response.type === "user-query" /* ResponseType.USER_QUERY */)?.query;
        if (!query) {
            return;
        }
        if (__classPrivateFieldGet(this, _Conversation_isExternal, "f")) {
            return `[External] ${query.substring(0, MAX_TITLE_LENGTH - 11)}${query.length > MAX_TITLE_LENGTH - 11 ? '…' : ''}`;
        }
        return `${query.substring(0, MAX_TITLE_LENGTH)}${query.length > MAX_TITLE_LENGTH ? '…' : ''}`;
    }
    get isEmpty() {
        return this.history.length === 0;
    }
    archiveConversation() {
        __classPrivateFieldSet(this, _Conversation_isReadOnly, true, "f");
    }
    async addHistoryItem(item) {
        if (item.type === "user-query" /* ResponseType.USER_QUERY */) {
            if (item.imageId && item.imageInput && 'inlineData' in item.imageInput) {
                const inlineData = item.imageInput.inlineData;
                await AiHistoryStorage.instance().upsertImage({ id: item.imageId, data: inlineData.data, mimeType: inlineData.mimeType });
            }
        }
        this.history.push(item);
        await AiHistoryStorage.instance().upsertHistoryEntry(this.serialize());
    }
    serialize() {
        return {
            id: this.id,
            history: this.history.map(item => {
                if (item.type === "user-query" /* ResponseType.USER_QUERY */) {
                    return { ...item, imageInput: undefined };
                }
                return item;
            }),
            type: this.type,
            isExternal: __classPrivateFieldGet(this, _Conversation_isExternal, "f"),
        };
    }
}
_Conversation_isReadOnly = new WeakMap(), _Conversation_isExternal = new WeakMap(), _Conversation_instances = new WeakSet(), _Conversation_reconstructHistory = function _Conversation_reconstructHistory(historyWithoutImages) {
    const imageHistory = AiHistoryStorage.instance().getImageHistory();
    if (imageHistory && imageHistory.length > 0) {
        const history = [];
        for (const data of historyWithoutImages) {
            if (data.type === "user-query" /* ResponseType.USER_QUERY */ && data.imageId) {
                const image = imageHistory.find(item => item.id === data.imageId);
                const inlineData = image ? { data: image.data, mimeType: image.mimeType } :
                    { data: NOT_FOUND_IMAGE_DATA, mimeType: 'image/jpeg' };
                history.push({ ...data, imageInput: { inlineData } });
            }
            else {
                history.push(data);
            }
        }
        return history;
    }
    return historyWithoutImages;
};
let instance = null;
const DEFAULT_MAX_STORAGE_SIZE = 50 * 1024 * 1024;
export var Events;
(function (Events) {
    Events["HISTORY_DELETED"] = "AiHistoryDeleted";
})(Events || (Events = {}));
export class AiHistoryStorage extends Common.ObjectWrapper.ObjectWrapper {
    constructor(maxStorageSize = DEFAULT_MAX_STORAGE_SIZE) {
        super();
        _AiHistoryStorage_historySetting.set(this, void 0);
        _AiHistoryStorage_imageHistorySettings.set(this, void 0);
        _AiHistoryStorage_mutex.set(this, new Common.Mutex.Mutex());
        _AiHistoryStorage_maxStorageSize.set(this, void 0);
        __classPrivateFieldSet(this, _AiHistoryStorage_historySetting, Common.Settings.Settings.instance().createSetting('ai-assistance-history-entries', []), "f");
        __classPrivateFieldSet(this, _AiHistoryStorage_imageHistorySettings, Common.Settings.Settings.instance().createSetting('ai-assistance-history-images', []), "f");
        __classPrivateFieldSet(this, _AiHistoryStorage_maxStorageSize, maxStorageSize, "f");
    }
    clearForTest() {
        __classPrivateFieldGet(this, _AiHistoryStorage_historySetting, "f").set([]);
        __classPrivateFieldGet(this, _AiHistoryStorage_imageHistorySettings, "f").set([]);
    }
    async upsertHistoryEntry(agentEntry) {
        const release = await __classPrivateFieldGet(this, _AiHistoryStorage_mutex, "f").acquire();
        try {
            const history = structuredClone(await __classPrivateFieldGet(this, _AiHistoryStorage_historySetting, "f").forceGet());
            const historyEntryIndex = history.findIndex(entry => entry.id === agentEntry.id);
            if (historyEntryIndex !== -1) {
                history[historyEntryIndex] = agentEntry;
            }
            else {
                history.push(agentEntry);
            }
            __classPrivateFieldGet(this, _AiHistoryStorage_historySetting, "f").set(history);
        }
        finally {
            release();
        }
    }
    async upsertImage(image) {
        const release = await __classPrivateFieldGet(this, _AiHistoryStorage_mutex, "f").acquire();
        try {
            const imageHistory = structuredClone(await __classPrivateFieldGet(this, _AiHistoryStorage_imageHistorySettings, "f").forceGet());
            const imageHistoryEntryIndex = imageHistory.findIndex(entry => entry.id === image.id);
            if (imageHistoryEntryIndex !== -1) {
                imageHistory[imageHistoryEntryIndex] = image;
            }
            else {
                imageHistory.push(image);
            }
            const imagesToBeStored = [];
            let currentStorageSize = 0;
            for (const [, serializedImage] of Array
                .from(imageHistory.entries())
                .reverse()) {
                if (currentStorageSize >= __classPrivateFieldGet(this, _AiHistoryStorage_maxStorageSize, "f")) {
                    break;
                }
                currentStorageSize += serializedImage.data.length;
                imagesToBeStored.push(serializedImage);
            }
            __classPrivateFieldGet(this, _AiHistoryStorage_imageHistorySettings, "f").set(imagesToBeStored.reverse());
        }
        finally {
            release();
        }
    }
    async deleteHistoryEntry(id) {
        const release = await __classPrivateFieldGet(this, _AiHistoryStorage_mutex, "f").acquire();
        try {
            const history = structuredClone(await __classPrivateFieldGet(this, _AiHistoryStorage_historySetting, "f").forceGet());
            const imageIdsForDeletion = history.find(entry => entry.id === id)
                ?.history
                .map(item => {
                if (item.type === "user-query" /* ResponseType.USER_QUERY */ && item.imageId) {
                    return item.imageId;
                }
                return undefined;
            })
                .filter(item => !!item);
            __classPrivateFieldGet(this, _AiHistoryStorage_historySetting, "f").set(history.filter(entry => entry.id !== id));
            const images = structuredClone(await __classPrivateFieldGet(this, _AiHistoryStorage_imageHistorySettings, "f").forceGet());
            __classPrivateFieldGet(this, _AiHistoryStorage_imageHistorySettings, "f").set(
            // Filter images for which ids are not present in deletion list
            images.filter(entry => !Boolean(imageIdsForDeletion?.find(id => id === entry.id))));
        }
        finally {
            release();
        }
    }
    async deleteAll() {
        const release = await __classPrivateFieldGet(this, _AiHistoryStorage_mutex, "f").acquire();
        try {
            __classPrivateFieldGet(this, _AiHistoryStorage_historySetting, "f").set([]);
            __classPrivateFieldGet(this, _AiHistoryStorage_imageHistorySettings, "f").set([]);
        }
        finally {
            release();
            this.dispatchEventToListeners("AiHistoryDeleted" /* Events.HISTORY_DELETED */);
        }
    }
    getHistory() {
        return structuredClone(__classPrivateFieldGet(this, _AiHistoryStorage_historySetting, "f").get());
    }
    getImageHistory() {
        return structuredClone(__classPrivateFieldGet(this, _AiHistoryStorage_imageHistorySettings, "f").get());
    }
    static instance(opts = { forceNew: false, maxStorageSize: DEFAULT_MAX_STORAGE_SIZE }) {
        const { forceNew, maxStorageSize } = opts;
        if (!instance || forceNew) {
            instance = new AiHistoryStorage(maxStorageSize);
        }
        return instance;
    }
}
_AiHistoryStorage_historySetting = new WeakMap(), _AiHistoryStorage_imageHistorySettings = new WeakMap(), _AiHistoryStorage_mutex = new WeakMap(), _AiHistoryStorage_maxStorageSize = new WeakMap();
//# sourceMappingURL=AiHistoryStorage.js.map