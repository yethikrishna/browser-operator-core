// Copyright (c) 2024 The Chromium Authors. All rights reserved.
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
var _RehydratingConnection_instances, _RehydratingConnection_onConnectionLost, _RehydratingConnection_rehydratingWindow, _RehydratingConnection_onReceiveHostWindowPayloadBound, _RehydratingConnection_setupMessagePassing, _RehydratingConnection_onReceiveHostWindowPayload, _RehydratingConnection_onRehydrated;
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import * as EnhancedTraces from './EnhancedTracesParser.js';
import { TraceObject } from './TraceObject.js';
const UIStrings = {
    /**
     * @description Text that appears when no source text is available for the given script
     */
    noSourceText: 'No source text available',
    /**
     * @description Text to indicate rehydrating connection cannot find host window
     */
    noHostWindow: 'Can not find host window',
    /**
     * @description Text to indicate that there is an error loading the log
     */
    errorLoadingLog: 'Error loading log',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/RehydratingConnection.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var RehydratingConnectionState;
(function (RehydratingConnectionState) {
    RehydratingConnectionState[RehydratingConnectionState["UNINITIALIZED"] = 1] = "UNINITIALIZED";
    RehydratingConnectionState[RehydratingConnectionState["INITIALIZED"] = 2] = "INITIALIZED";
    RehydratingConnectionState[RehydratingConnectionState["REHYDRATED"] = 3] = "REHYDRATED";
})(RehydratingConnectionState || (RehydratingConnectionState = {}));
export class RehydratingConnection {
    constructor(onConnectionLost) {
        _RehydratingConnection_instances.add(this);
        this.rehydratingConnectionState = 1 /* RehydratingConnectionState.UNINITIALIZED */;
        this.onDisconnect = null;
        this.onMessage = null;
        this.trace = null;
        this.sessions = new Map();
        _RehydratingConnection_onConnectionLost.set(this, void 0);
        _RehydratingConnection_rehydratingWindow.set(this, void 0);
        _RehydratingConnection_onReceiveHostWindowPayloadBound.set(this, __classPrivateFieldGet(this, _RehydratingConnection_instances, "m", _RehydratingConnection_onReceiveHostWindowPayload).bind(this));
        // If we're invoking this class, we're in the rehydrating pop-up window. Rename window for clarity.
        __classPrivateFieldSet(this, _RehydratingConnection_onConnectionLost, onConnectionLost, "f");
        __classPrivateFieldSet(this, _RehydratingConnection_rehydratingWindow, window, "f");
        __classPrivateFieldGet(this, _RehydratingConnection_instances, "m", _RehydratingConnection_setupMessagePassing).call(this);
    }
    async startHydration(trace) {
        // OnMessage should've been set before hydration, and the connection should
        // be initialized and not hydrated already.
        if (!this.onMessage || this.rehydratingConnectionState !== 2 /* RehydratingConnectionState.INITIALIZED */) {
            return false;
        }
        if (!('traceEvents' in trace)) {
            console.error('RehydratingConnection failed to initialize due to missing trace events in payload');
            return false;
        }
        this.trace = trace;
        const enhancedTracesParser = new EnhancedTraces.EnhancedTracesParser(trace);
        const hydratingData = enhancedTracesParser.data();
        let sessionId = 0;
        // Set up default rehydrating session.
        this.sessions.set(sessionId, new RehydratingSessionBase(this));
        for (const hydratingDataPerTarget of hydratingData) {
            const target = hydratingDataPerTarget.target;
            const executionContexts = hydratingDataPerTarget.executionContexts;
            const scripts = hydratingDataPerTarget.scripts;
            this.postToFrontend({
                method: 'Target.targetCreated',
                params: {
                    targetInfo: {
                        targetId: target.targetId,
                        type: target.type,
                        title: target.url,
                        url: target.url,
                        attached: false,
                        canAccessOpener: false,
                    },
                },
            });
            // Create new session associated to the target created and send
            // Target.attachedToTarget to frontend.
            sessionId += 1;
            this.sessions.set(sessionId, new RehydratingSession(sessionId, target, executionContexts, scripts, this));
        }
        await __classPrivateFieldGet(this, _RehydratingConnection_instances, "m", _RehydratingConnection_onRehydrated).call(this);
        return true;
    }
    setOnMessage(onMessage) {
        this.onMessage = onMessage;
        this.rehydratingConnectionState = 2 /* RehydratingConnectionState.INITIALIZED */;
    }
    setOnDisconnect(onDisconnect) {
        this.onDisconnect = onDisconnect;
    }
    // The function "sendRawMessage" is typically devtools front-end
    // sending message to the backend via CDP. In this case, given that Rehydrating
    // connection is an emulation of devtool back-end, sendRawMessage here
    // is in fact rehydrating connection directly handling and acting on the
    // receieved message.
    sendRawMessage(message) {
        if (typeof message === 'string') {
            message = JSON.parse(message);
        }
        const data = message;
        if (typeof data.sessionId !== 'undefined') {
            const session = this.sessions.get(data.sessionId);
            if (session) {
                session.handleFrontendMessageAsFakeCDPAgent(data);
            }
            else {
                console.error('Invalid SessionId: ' + data.sessionId);
            }
        }
        else {
            this.sessions.get(0)?.handleFrontendMessageAsFakeCDPAgent(data);
        }
    }
    // Posting rehydrating connection's message/response
    // to devtools frontend through debugger protocol.
    postToFrontend(arg) {
        if (this.onMessage) {
            this.onMessage(arg);
        }
        else {
            // onMessage should be set before the connection is rehydrated
            console.error('onMessage was not initialized');
        }
    }
    disconnect() {
        return Promise.reject();
    }
}
_RehydratingConnection_onConnectionLost = new WeakMap(), _RehydratingConnection_rehydratingWindow = new WeakMap(), _RehydratingConnection_onReceiveHostWindowPayloadBound = new WeakMap(), _RehydratingConnection_instances = new WeakSet(), _RehydratingConnection_setupMessagePassing = function _RehydratingConnection_setupMessagePassing() {
    __classPrivateFieldGet(this, _RehydratingConnection_rehydratingWindow, "f").addEventListener('message', __classPrivateFieldGet(this, _RehydratingConnection_onReceiveHostWindowPayloadBound, "f"));
    if (!__classPrivateFieldGet(this, _RehydratingConnection_rehydratingWindow, "f").opener) {
        __classPrivateFieldGet(this, _RehydratingConnection_onConnectionLost, "f").call(this, i18nString(UIStrings.noHostWindow));
    }
    __classPrivateFieldGet(this, _RehydratingConnection_rehydratingWindow, "f").opener.postMessage({ type: 'REHYDRATING_WINDOW_READY' });
}, _RehydratingConnection_onReceiveHostWindowPayload = function _RehydratingConnection_onReceiveHostWindowPayload(event) {
    if (event.data.type === 'REHYDRATING_TRACE_FILE') {
        const traceJson = event.data.traceJson;
        let trace;
        try {
            trace = JSON.parse(traceJson);
        }
        catch {
            __classPrivateFieldGet(this, _RehydratingConnection_onConnectionLost, "f").call(this, i18nString(UIStrings.errorLoadingLog));
            return;
        }
        void this.startHydration(trace);
    }
    __classPrivateFieldGet(this, _RehydratingConnection_rehydratingWindow, "f").removeEventListener('message', __classPrivateFieldGet(this, _RehydratingConnection_onReceiveHostWindowPayloadBound, "f"));
}, _RehydratingConnection_onRehydrated = async function _RehydratingConnection_onRehydrated() {
    if (!this.trace) {
        return;
    }
    this.rehydratingConnectionState = 3 /* RehydratingConnectionState.REHYDRATED */;
    // Use revealer to load trace into performance panel
    const trace = new TraceObject(this.trace.traceEvents, this.trace.metadata);
    await Common.Revealer.reveal(trace);
};
// Default rehydrating session with default responses.
class RehydratingSessionBase {
    constructor(connection) {
        this.connection = null;
        this.connection = connection;
    }
    sendMessageToFrontend(payload) {
        requestAnimationFrame(() => {
            if (this.connection) {
                this.connection.postToFrontend(payload);
            }
        });
    }
    handleFrontendMessageAsFakeCDPAgent(data) {
        // Send default response in default session.
        this.sendMessageToFrontend({
            id: data.id,
            result: {},
        });
    }
}
export class RehydratingSession extends RehydratingSessionBase {
    constructor(sessionId, target, executionContexts, scripts, connection) {
        super(connection);
        this.executionContexts = [];
        this.scripts = [];
        this.sessionId = sessionId;
        this.target = target;
        this.executionContexts = executionContexts;
        this.scripts = scripts;
        this.sessionAttachToTarget();
    }
    sendMessageToFrontend(payload, attachSessionId = true) {
        // Attach the session's Id to the message.
        if (this.sessionId !== 0 && attachSessionId) {
            payload.sessionId = this.sessionId;
        }
        super.sendMessageToFrontend(payload);
    }
    handleFrontendMessageAsFakeCDPAgent(data) {
        switch (data.method) {
            case 'Runtime.enable':
                this.handleRuntimeEnabled(data.id);
                break;
            case 'Debugger.enable':
                this.handleDebuggerEnable(data.id);
                break;
            case 'Debugger.getScriptSource':
                if (data.params) {
                    const params = data.params;
                    this.handleDebuggerGetScriptSource(data.id, params.scriptId);
                }
                break;
            default:
                this.sendMessageToFrontend({
                    id: data.id,
                    result: {},
                });
                break;
        }
    }
    sessionAttachToTarget() {
        this.sendMessageToFrontend({
            method: 'Target.attachedToTarget',
            params: {
                sessionId: this.sessionId,
                waitingForDebugger: false,
                targetInfo: {
                    targetId: this.target.targetId,
                    type: this.target.type,
                    title: this.target.url,
                    url: this.target.url,
                    attached: true,
                    canAccessOpener: false,
                },
            },
        }, 
        /* attachSessionId */ false);
    }
    // Runtime.Enable indicates that Runtime domain is flushing the event to communicate
    // the current state with the backend. In rehydrating connection, we made up the artificial
    // execution context to support the rehydrated session.
    handleRuntimeEnabled(id) {
        for (const executionContext of this.executionContexts) {
            executionContext.name = executionContext.origin;
            this.sendMessageToFrontend({
                method: 'Runtime.executionContextCreated',
                params: {
                    context: executionContext,
                },
            });
        }
        this.sendMessageToFrontend({
            id,
            result: {},
        });
    }
    handleDebuggerGetScriptSource(id, scriptId) {
        const script = this.scripts.find(script => script.scriptId === scriptId);
        if (!script) {
            console.error('No script for id: ' + scriptId);
            return;
        }
        this.sendMessageToFrontend({
            id,
            result: {
                scriptSource: typeof script.sourceText === 'undefined' ? i18nString(UIStrings.noSourceText) : script.sourceText,
            },
        });
    }
    // Debugger.Enable indicates that Debugger domain is flushing the event to communicate
    // the current state with the backend. In rehydrating connection, we made up the artificial
    // script parsed event to communicate the current script state and respond with a mock
    // debugger id.
    handleDebuggerEnable(id) {
        for (const script of this.scripts) {
            this.sendMessageToFrontend({
                method: 'Debugger.scriptParsed',
                params: script,
            });
        }
        const mockDebuggerId = '7777777777777777777.8888888888888888888';
        this.sendMessageToFrontend({
            id,
            result: {
                debuggerId: mockDebuggerId,
            },
        });
    }
}
//# sourceMappingURL=RehydratingConnection.js.map