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
var _ServerSentEvents_instances, _ServerSentEvents_request, _ServerSentEvents_parser, _ServerSentEvents_lastDataReceivedTime, _ServerSentEvents_eventSourceMessages, _ServerSentEvents_onParserEvent, _ServerSentEvents_recordMessageAndDispatchEvent;
import * as TextUtils from '../../models/text_utils/text_utils.js';
import { Events } from './NetworkRequest.js';
import { ServerSentEventsParser } from './ServerSentEventsProtocol.js';
/**
 * Server sent events only arrive via CDP (Explicit Network.eventSourceMessageReceived) when
 * the page uses "EventSource" in the code.
 *
 * If the page manually uses 'fetch' or XHR we have to do the protocol parsing
 * ourselves.
 *
 * `ServerSentEvents` is a small helper class that manages this distinction for a specific
 * request, stores the event data and sends out "EventSourceMessageAdded" events for a request.
 */
export class ServerSentEvents {
    constructor(request, parseFromStreamedData) {
        _ServerSentEvents_instances.add(this);
        _ServerSentEvents_request.set(this, void 0);
        _ServerSentEvents_parser.set(this, void 0);
        // In the case where we parse the events ourselves we use the time of the last 'dataReceived'
        // event for all the events that come out of the corresponding chunk of data.
        _ServerSentEvents_lastDataReceivedTime.set(this, 0);
        _ServerSentEvents_eventSourceMessages.set(this, []);
        __classPrivateFieldSet(this, _ServerSentEvents_request, request, "f");
        // Only setup parsing if we don't get the events over CDP directly.
        if (parseFromStreamedData) {
            __classPrivateFieldSet(this, _ServerSentEvents_lastDataReceivedTime, request.pseudoWallTime(request.startTime), "f");
            __classPrivateFieldSet(this, _ServerSentEvents_parser, new ServerSentEventsParser(__classPrivateFieldGet(this, _ServerSentEvents_instances, "m", _ServerSentEvents_onParserEvent).bind(this), request.charset() ?? undefined), "f");
            // Get the streaming content and add the already received bytes if someone else started
            // the streaming earlier.
            void __classPrivateFieldGet(this, _ServerSentEvents_request, "f").requestStreamingContent().then(streamingContentData => {
                if (!TextUtils.StreamingContentData.isError(streamingContentData)) {
                    void __classPrivateFieldGet(this, _ServerSentEvents_parser, "f")?.addBase64Chunk(streamingContentData.content().base64);
                    streamingContentData.addEventListener("ChunkAdded" /* TextUtils.StreamingContentData.Events.CHUNK_ADDED */, ({ data: { chunk } }) => {
                        __classPrivateFieldSet(this, _ServerSentEvents_lastDataReceivedTime, request.pseudoWallTime(request.endTime), "f");
                        void __classPrivateFieldGet(this, _ServerSentEvents_parser, "f")?.addBase64Chunk(chunk);
                    });
                }
            });
        }
    }
    get eventSourceMessages() {
        return __classPrivateFieldGet(this, _ServerSentEvents_eventSourceMessages, "f");
    }
    /** Forwarded Network.eventSourceMessage received */
    onProtocolEventSourceMessageReceived(eventName, data, eventId, time) {
        __classPrivateFieldGet(this, _ServerSentEvents_instances, "m", _ServerSentEvents_recordMessageAndDispatchEvent).call(this, {
            eventName,
            eventId,
            data,
            time,
        });
    }
}
_ServerSentEvents_request = new WeakMap(), _ServerSentEvents_parser = new WeakMap(), _ServerSentEvents_lastDataReceivedTime = new WeakMap(), _ServerSentEvents_eventSourceMessages = new WeakMap(), _ServerSentEvents_instances = new WeakSet(), _ServerSentEvents_onParserEvent = function _ServerSentEvents_onParserEvent(eventName, data, eventId) {
    __classPrivateFieldGet(this, _ServerSentEvents_instances, "m", _ServerSentEvents_recordMessageAndDispatchEvent).call(this, {
        eventName,
        eventId,
        data,
        time: __classPrivateFieldGet(this, _ServerSentEvents_lastDataReceivedTime, "f"),
    });
}, _ServerSentEvents_recordMessageAndDispatchEvent = function _ServerSentEvents_recordMessageAndDispatchEvent(message) {
    __classPrivateFieldGet(this, _ServerSentEvents_eventSourceMessages, "f").push(message);
    __classPrivateFieldGet(this, _ServerSentEvents_request, "f").dispatchEventToListeners(Events.EVENT_SOURCE_MESSAGE_ADDED, message);
};
//# sourceMappingURL=ServerSentEvents.js.map