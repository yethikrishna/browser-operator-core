// Copyright (c) 2015 The Chromium Authors. All rights reserved.
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
var _MainConnection_onDisconnect, _MainConnection_messageBuffer, _MainConnection_messageSize, _MainConnection_eventListeners, _WebSocketConnection_socket, _WebSocketConnection_onDisconnect, _WebSocketConnection_onWebSocketDisconnect, _WebSocketConnection_connected, _WebSocketConnection_messages, _StubConnection_onDisconnect, _ParallelConnection_connection, _ParallelConnection_sessionId, _ParallelConnection_onDisconnect;
import * as i18n from '../../core/i18n/i18n.js';
import * as Common from '../common/common.js';
import * as Host from '../host/host.js';
import * as ProtocolClient from '../protocol_client/protocol_client.js';
import * as Root from '../root/root.js';
import { RehydratingConnection } from './RehydratingConnection.js';
const UIStrings = {
    /**
     *@description Text on the remote debugging window to indicate the connection is lost
     */
    websocketDisconnected: 'WebSocket disconnected',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/Connections.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class MainConnection {
    constructor() {
        _MainConnection_onDisconnect.set(this, void 0);
        _MainConnection_messageBuffer.set(this, void 0);
        _MainConnection_messageSize.set(this, void 0);
        _MainConnection_eventListeners.set(this, void 0);
        this.onMessage = null;
        __classPrivateFieldSet(this, _MainConnection_onDisconnect, null, "f");
        __classPrivateFieldSet(this, _MainConnection_messageBuffer, '', "f");
        __classPrivateFieldSet(this, _MainConnection_messageSize, 0, "f");
        __classPrivateFieldSet(this, _MainConnection_eventListeners, [
            Host.InspectorFrontendHost.InspectorFrontendHostInstance.events.addEventListener(Host.InspectorFrontendHostAPI.Events.DispatchMessage, this.dispatchMessage, this),
            Host.InspectorFrontendHost.InspectorFrontendHostInstance.events.addEventListener(Host.InspectorFrontendHostAPI.Events.DispatchMessageChunk, this.dispatchMessageChunk, this),
        ], "f");
    }
    setOnMessage(onMessage) {
        this.onMessage = onMessage;
    }
    setOnDisconnect(onDisconnect) {
        __classPrivateFieldSet(this, _MainConnection_onDisconnect, onDisconnect, "f");
    }
    sendRawMessage(message) {
        if (this.onMessage) {
            Host.InspectorFrontendHost.InspectorFrontendHostInstance.sendMessageToBackend(message);
        }
    }
    dispatchMessage(event) {
        if (this.onMessage) {
            this.onMessage.call(null, event.data);
        }
    }
    dispatchMessageChunk(event) {
        const { messageChunk, messageSize } = event.data;
        if (messageSize) {
            __classPrivateFieldSet(this, _MainConnection_messageBuffer, '', "f");
            __classPrivateFieldSet(this, _MainConnection_messageSize, messageSize, "f");
        }
        __classPrivateFieldSet(this, _MainConnection_messageBuffer, __classPrivateFieldGet(this, _MainConnection_messageBuffer, "f") + messageChunk, "f");
        if (__classPrivateFieldGet(this, _MainConnection_messageBuffer, "f").length === __classPrivateFieldGet(this, _MainConnection_messageSize, "f") && this.onMessage) {
            this.onMessage.call(null, __classPrivateFieldGet(this, _MainConnection_messageBuffer, "f"));
            __classPrivateFieldSet(this, _MainConnection_messageBuffer, '', "f");
            __classPrivateFieldSet(this, _MainConnection_messageSize, 0, "f");
        }
    }
    async disconnect() {
        const onDisconnect = __classPrivateFieldGet(this, _MainConnection_onDisconnect, "f");
        Common.EventTarget.removeEventListeners(__classPrivateFieldGet(this, _MainConnection_eventListeners, "f"));
        __classPrivateFieldSet(this, _MainConnection_onDisconnect, null, "f");
        this.onMessage = null;
        if (onDisconnect) {
            onDisconnect.call(null, 'force disconnect');
        }
    }
}
_MainConnection_onDisconnect = new WeakMap(), _MainConnection_messageBuffer = new WeakMap(), _MainConnection_messageSize = new WeakMap(), _MainConnection_eventListeners = new WeakMap();
export class WebSocketConnection {
    constructor(url, onWebSocketDisconnect) {
        _WebSocketConnection_socket.set(this, void 0);
        _WebSocketConnection_onDisconnect.set(this, void 0);
        _WebSocketConnection_onWebSocketDisconnect.set(this, void 0);
        _WebSocketConnection_connected.set(this, void 0);
        _WebSocketConnection_messages.set(this, void 0);
        __classPrivateFieldSet(this, _WebSocketConnection_socket, new WebSocket(url), "f");
        __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").onerror = this.onError.bind(this);
        __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").onopen = this.onOpen.bind(this);
        __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").onmessage = (messageEvent) => {
            if (this.onMessage) {
                this.onMessage.call(null, messageEvent.data);
            }
        };
        __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").onclose = this.onClose.bind(this);
        this.onMessage = null;
        __classPrivateFieldSet(this, _WebSocketConnection_onDisconnect, null, "f");
        __classPrivateFieldSet(this, _WebSocketConnection_onWebSocketDisconnect, onWebSocketDisconnect, "f");
        __classPrivateFieldSet(this, _WebSocketConnection_connected, false, "f");
        __classPrivateFieldSet(this, _WebSocketConnection_messages, [], "f");
    }
    setOnMessage(onMessage) {
        this.onMessage = onMessage;
    }
    setOnDisconnect(onDisconnect) {
        __classPrivateFieldSet(this, _WebSocketConnection_onDisconnect, onDisconnect, "f");
    }
    onError() {
        if (__classPrivateFieldGet(this, _WebSocketConnection_onWebSocketDisconnect, "f")) {
            __classPrivateFieldGet(this, _WebSocketConnection_onWebSocketDisconnect, "f").call(null, i18nString(UIStrings.websocketDisconnected));
        }
        if (__classPrivateFieldGet(this, _WebSocketConnection_onDisconnect, "f")) {
            // This is called if error occurred while connecting.
            __classPrivateFieldGet(this, _WebSocketConnection_onDisconnect, "f").call(null, 'connection failed');
        }
        this.close();
    }
    onOpen() {
        __classPrivateFieldSet(this, _WebSocketConnection_connected, true, "f");
        if (__classPrivateFieldGet(this, _WebSocketConnection_socket, "f")) {
            __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").onerror = console.error;
            for (const message of __classPrivateFieldGet(this, _WebSocketConnection_messages, "f")) {
                __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").send(message);
            }
        }
        __classPrivateFieldSet(this, _WebSocketConnection_messages, [], "f");
    }
    onClose() {
        if (__classPrivateFieldGet(this, _WebSocketConnection_onWebSocketDisconnect, "f")) {
            __classPrivateFieldGet(this, _WebSocketConnection_onWebSocketDisconnect, "f").call(null, i18nString(UIStrings.websocketDisconnected));
        }
        if (__classPrivateFieldGet(this, _WebSocketConnection_onDisconnect, "f")) {
            __classPrivateFieldGet(this, _WebSocketConnection_onDisconnect, "f").call(null, 'websocket closed');
        }
        this.close();
    }
    close(callback) {
        if (__classPrivateFieldGet(this, _WebSocketConnection_socket, "f")) {
            __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").onerror = null;
            __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").onopen = null;
            __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").onclose = callback || null;
            __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").onmessage = null;
            __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").close();
            __classPrivateFieldSet(this, _WebSocketConnection_socket, null, "f");
        }
        __classPrivateFieldSet(this, _WebSocketConnection_onWebSocketDisconnect, null, "f");
    }
    sendRawMessage(message) {
        if (__classPrivateFieldGet(this, _WebSocketConnection_connected, "f") && __classPrivateFieldGet(this, _WebSocketConnection_socket, "f")) {
            __classPrivateFieldGet(this, _WebSocketConnection_socket, "f").send(message);
        }
        else {
            __classPrivateFieldGet(this, _WebSocketConnection_messages, "f").push(message);
        }
    }
    disconnect() {
        return new Promise(fulfill => {
            this.close(() => {
                if (__classPrivateFieldGet(this, _WebSocketConnection_onDisconnect, "f")) {
                    __classPrivateFieldGet(this, _WebSocketConnection_onDisconnect, "f").call(null, 'force disconnect');
                }
                fulfill();
            });
        });
    }
}
_WebSocketConnection_socket = new WeakMap(), _WebSocketConnection_onDisconnect = new WeakMap(), _WebSocketConnection_onWebSocketDisconnect = new WeakMap(), _WebSocketConnection_connected = new WeakMap(), _WebSocketConnection_messages = new WeakMap();
export class StubConnection {
    constructor() {
        _StubConnection_onDisconnect.set(this, void 0);
        this.onMessage = null;
        __classPrivateFieldSet(this, _StubConnection_onDisconnect, null, "f");
    }
    setOnMessage(onMessage) {
        this.onMessage = onMessage;
    }
    setOnDisconnect(onDisconnect) {
        __classPrivateFieldSet(this, _StubConnection_onDisconnect, onDisconnect, "f");
    }
    sendRawMessage(message) {
        window.setTimeout(this.respondWithError.bind(this, message), 0);
    }
    respondWithError(message) {
        const messageObject = JSON.parse(message);
        const error = {
            message: 'This is a stub connection, can\'t dispatch message.',
            code: ProtocolClient.InspectorBackend.DevToolsStubErrorCode,
            data: messageObject,
        };
        if (this.onMessage) {
            this.onMessage.call(null, { id: messageObject.id, error });
        }
    }
    async disconnect() {
        if (__classPrivateFieldGet(this, _StubConnection_onDisconnect, "f")) {
            __classPrivateFieldGet(this, _StubConnection_onDisconnect, "f").call(null, 'force disconnect');
        }
        __classPrivateFieldSet(this, _StubConnection_onDisconnect, null, "f");
        this.onMessage = null;
    }
}
_StubConnection_onDisconnect = new WeakMap();
export class ParallelConnection {
    constructor(connection, sessionId) {
        _ParallelConnection_connection.set(this, void 0);
        _ParallelConnection_sessionId.set(this, void 0);
        _ParallelConnection_onDisconnect.set(this, void 0);
        __classPrivateFieldSet(this, _ParallelConnection_connection, connection, "f");
        __classPrivateFieldSet(this, _ParallelConnection_sessionId, sessionId, "f");
        this.onMessage = null;
        __classPrivateFieldSet(this, _ParallelConnection_onDisconnect, null, "f");
    }
    setOnMessage(onMessage) {
        this.onMessage = onMessage;
    }
    setOnDisconnect(onDisconnect) {
        __classPrivateFieldSet(this, _ParallelConnection_onDisconnect, onDisconnect, "f");
    }
    getOnDisconnect() {
        return __classPrivateFieldGet(this, _ParallelConnection_onDisconnect, "f");
    }
    sendRawMessage(message) {
        const messageObject = JSON.parse(message);
        // If the message isn't for a specific session, it must be for the root session.
        if (!messageObject.sessionId) {
            messageObject.sessionId = __classPrivateFieldGet(this, _ParallelConnection_sessionId, "f");
        }
        __classPrivateFieldGet(this, _ParallelConnection_connection, "f").sendRawMessage(JSON.stringify(messageObject));
    }
    getSessionId() {
        return __classPrivateFieldGet(this, _ParallelConnection_sessionId, "f");
    }
    async disconnect() {
        if (__classPrivateFieldGet(this, _ParallelConnection_onDisconnect, "f")) {
            __classPrivateFieldGet(this, _ParallelConnection_onDisconnect, "f").call(null, 'force disconnect');
        }
        __classPrivateFieldSet(this, _ParallelConnection_onDisconnect, null, "f");
        this.onMessage = null;
    }
}
_ParallelConnection_connection = new WeakMap(), _ParallelConnection_sessionId = new WeakMap(), _ParallelConnection_onDisconnect = new WeakMap();
export async function initMainConnection(createRootTarget, onConnectionLost) {
    ProtocolClient.InspectorBackend.Connection.setFactory(createMainConnection.bind(null, onConnectionLost));
    await createRootTarget();
    Host.InspectorFrontendHost.InspectorFrontendHostInstance.connectionReady();
}
function createMainConnection(onConnectionLost) {
    if (Root.Runtime.getPathName().includes('rehydrated_devtools_app')) {
        return new RehydratingConnection(onConnectionLost);
    }
    const wsParam = Root.Runtime.Runtime.queryParam('ws');
    const wssParam = Root.Runtime.Runtime.queryParam('wss');
    if (wsParam || wssParam) {
        const ws = (wsParam ? `ws://${wsParam}` : `wss://${wssParam}`);
        return new WebSocketConnection(ws, onConnectionLost);
    }
    if (Host.InspectorFrontendHost.InspectorFrontendHostInstance.isHostedMode()) {
        // Hosted mode (e.g. `http://localhost:9222/devtools/inspector.html`) but no WebSocket URL.
        return new StubConnection();
    }
    return new MainConnection();
}
//# sourceMappingURL=Connections.js.map