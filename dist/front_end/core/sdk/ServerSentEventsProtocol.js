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
var _ServerSentEventsParser_instances, _ServerSentEventsParser_onEventCallback, _ServerSentEventsParser_decoder, _ServerSentEventsParser_isRecognizingCrLf, _ServerSentEventsParser_line, _ServerSentEventsParser_id, _ServerSentEventsParser_data, _ServerSentEventsParser_eventType, _ServerSentEventsParser_onTextChunk, _ServerSentEventsParser_parseLine, _Base64TextDecoder_decoder, _Base64TextDecoder_writer;
/**
 * Implements Server-Sent-Events protocl parsing as described by
 * https://html.spec.whatwg.org/multipage/server-sent-events.html#parsing-an-event-stream
 *
 * Webpages can use SSE over fetch/XHR and not go through EventSource. DevTools
 * only receives the raw binary data in this case, which means we have to decode
 * and parse the event stream ourselves here.
 *
 * Implementation mostly ported over from blink
 * third_party/blink/renderer/modules/eventsource/event_source_parser.cc.
 */
export class ServerSentEventsParser {
    constructor(callback, encodingLabel) {
        _ServerSentEventsParser_instances.add(this);
        _ServerSentEventsParser_onEventCallback.set(this, void 0);
        _ServerSentEventsParser_decoder.set(this, void 0);
        // Parser state.
        _ServerSentEventsParser_isRecognizingCrLf.set(this, false);
        _ServerSentEventsParser_line.set(this, '');
        _ServerSentEventsParser_id.set(this, '');
        _ServerSentEventsParser_data.set(this, '');
        _ServerSentEventsParser_eventType.set(this, '');
        __classPrivateFieldSet(this, _ServerSentEventsParser_onEventCallback, callback, "f");
        __classPrivateFieldSet(this, _ServerSentEventsParser_decoder, new Base64TextDecoder(__classPrivateFieldGet(this, _ServerSentEventsParser_instances, "m", _ServerSentEventsParser_onTextChunk).bind(this), encodingLabel), "f");
    }
    async addBase64Chunk(raw) {
        await __classPrivateFieldGet(this, _ServerSentEventsParser_decoder, "f").addBase64Chunk(raw);
    }
}
_ServerSentEventsParser_onEventCallback = new WeakMap(), _ServerSentEventsParser_decoder = new WeakMap(), _ServerSentEventsParser_isRecognizingCrLf = new WeakMap(), _ServerSentEventsParser_line = new WeakMap(), _ServerSentEventsParser_id = new WeakMap(), _ServerSentEventsParser_data = new WeakMap(), _ServerSentEventsParser_eventType = new WeakMap(), _ServerSentEventsParser_instances = new WeakSet(), _ServerSentEventsParser_onTextChunk = function _ServerSentEventsParser_onTextChunk(chunk) {
    // A line consists of "this.#line" plus a slice of "chunk[start:<next new cr/lf>]".
    let start = 0;
    for (let i = 0; i < chunk.length; ++i) {
        if (__classPrivateFieldGet(this, _ServerSentEventsParser_isRecognizingCrLf, "f") && chunk[i] === '\n') {
            // We found the latter part of "\r\n".
            __classPrivateFieldSet(this, _ServerSentEventsParser_isRecognizingCrLf, false, "f");
            ++start;
            continue;
        }
        __classPrivateFieldSet(this, _ServerSentEventsParser_isRecognizingCrLf, false, "f");
        if (chunk[i] === '\r' || chunk[i] === '\n') {
            __classPrivateFieldSet(this, _ServerSentEventsParser_line, __classPrivateFieldGet(this, _ServerSentEventsParser_line, "f") + chunk.substring(start, i), "f");
            __classPrivateFieldGet(this, _ServerSentEventsParser_instances, "m", _ServerSentEventsParser_parseLine).call(this);
            __classPrivateFieldSet(this, _ServerSentEventsParser_line, '', "f");
            start = i + 1;
            __classPrivateFieldSet(this, _ServerSentEventsParser_isRecognizingCrLf, chunk[i] === '\r', "f");
        }
    }
    __classPrivateFieldSet(this, _ServerSentEventsParser_line, __classPrivateFieldGet(this, _ServerSentEventsParser_line, "f") + chunk.substring(start), "f");
}, _ServerSentEventsParser_parseLine = function _ServerSentEventsParser_parseLine() {
    if (__classPrivateFieldGet(this, _ServerSentEventsParser_line, "f").length === 0) {
        // We dispatch an event when seeing an empty line.
        if (__classPrivateFieldGet(this, _ServerSentEventsParser_data, "f").length > 0) {
            const data = __classPrivateFieldGet(this, _ServerSentEventsParser_data, "f").slice(0, -1); // Remove the last newline.
            __classPrivateFieldGet(this, _ServerSentEventsParser_onEventCallback, "f").call(this, __classPrivateFieldGet(this, _ServerSentEventsParser_eventType, "f") || 'message', data, __classPrivateFieldGet(this, _ServerSentEventsParser_id, "f"));
            __classPrivateFieldSet(this, _ServerSentEventsParser_data, '', "f");
        }
        __classPrivateFieldSet(this, _ServerSentEventsParser_eventType, '', "f");
        return;
    }
    let fieldNameEnd = __classPrivateFieldGet(this, _ServerSentEventsParser_line, "f").indexOf(':');
    let fieldValueStart;
    if (fieldNameEnd < 0) {
        fieldNameEnd = __classPrivateFieldGet(this, _ServerSentEventsParser_line, "f").length;
        fieldValueStart = fieldNameEnd;
    }
    else {
        fieldValueStart = fieldNameEnd + 1;
        if (fieldValueStart < __classPrivateFieldGet(this, _ServerSentEventsParser_line, "f").length && __classPrivateFieldGet(this, _ServerSentEventsParser_line, "f")[fieldValueStart] === ' ') {
            // Skip a single space preceeding the value.
            ++fieldValueStart;
        }
    }
    const fieldName = __classPrivateFieldGet(this, _ServerSentEventsParser_line, "f").substring(0, fieldNameEnd);
    if (fieldName === 'event') {
        __classPrivateFieldSet(this, _ServerSentEventsParser_eventType, __classPrivateFieldGet(this, _ServerSentEventsParser_line, "f").substring(fieldValueStart), "f");
        return;
    }
    if (fieldName === 'data') {
        __classPrivateFieldSet(this, _ServerSentEventsParser_data, __classPrivateFieldGet(this, _ServerSentEventsParser_data, "f") + __classPrivateFieldGet(this, _ServerSentEventsParser_line, "f").substring(fieldValueStart), "f");
        __classPrivateFieldSet(this, _ServerSentEventsParser_data, __classPrivateFieldGet(this, _ServerSentEventsParser_data, "f") + '\n', "f");
    }
    if (fieldName === 'id') {
        // We should do a check here whether the id field contains "\0" and ignore it.
        __classPrivateFieldSet(this, _ServerSentEventsParser_id, __classPrivateFieldGet(this, _ServerSentEventsParser_line, "f").substring(fieldValueStart), "f");
    }
    // Ignore all other fields. Also ignore "retry", we won't forward that to the backend.
};
/**
 * Small helper class that can decode a stream of base64 encoded bytes. Specify the
 * text encoding for the raw bytes via constructor. Default is utf-8.
 */
class Base64TextDecoder {
    constructor(onTextChunk, encodingLabel) {
        _Base64TextDecoder_decoder.set(this, void 0);
        _Base64TextDecoder_writer.set(this, void 0);
        __classPrivateFieldSet(this, _Base64TextDecoder_decoder, new TextDecoderStream(encodingLabel), "f");
        __classPrivateFieldSet(this, _Base64TextDecoder_writer, __classPrivateFieldGet(this, _Base64TextDecoder_decoder, "f").writable.getWriter(), "f");
        void __classPrivateFieldGet(this, _Base64TextDecoder_decoder, "f").readable.pipeTo(new WritableStream({ write: onTextChunk }));
    }
    async addBase64Chunk(chunk) {
        const binString = window.atob(chunk);
        const bytes = Uint8Array.from(binString, m => m.codePointAt(0));
        await __classPrivateFieldGet(this, _Base64TextDecoder_writer, "f").ready;
        await __classPrivateFieldGet(this, _Base64TextDecoder_writer, "f").write(bytes);
    }
}
_Base64TextDecoder_decoder = new WeakMap(), _Base64TextDecoder_writer = new WeakMap();
//# sourceMappingURL=ServerSentEventsProtocol.js.map