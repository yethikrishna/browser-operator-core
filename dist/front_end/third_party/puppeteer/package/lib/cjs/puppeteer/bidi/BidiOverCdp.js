"use strict";
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
var _CdpConnectionAdapter_cdp, _CdpConnectionAdapter_adapters, _CdpConnectionAdapter_browserCdpConnection, _CDPClientAdapter_closed, _CDPClientAdapter_client, _CDPClientAdapter_browserClient, _CDPClientAdapter_forwardMessage, _NoOpTransport_onMessage;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o)
                if (Object.prototype.hasOwnProperty.call(o, k))
                    ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k = ownKeys(mod), i = 0; i < k.length; i++)
                if (k[i] !== "default")
                    __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectBidiOverCdp = connectBidiOverCdp;
const BidiMapper = __importStar(require("chromium-bidi/lib/cjs/bidiMapper/BidiMapper.js"));
const Debug_js_1 = require("../common/Debug.js");
const Errors_js_1 = require("../common/Errors.js");
const Connection_js_1 = require("./Connection.js");
const bidiServerLogger = (prefix, ...args) => {
    (0, Debug_js_1.debug)(`bidi:${prefix}`)(args);
};
/**
 * @internal
 */
async function connectBidiOverCdp(cdp) {
    const transportBiDi = new NoOpTransport();
    const cdpConnectionAdapter = new CdpConnectionAdapter(cdp);
    const pptrTransport = {
        send(message) {
            // Forwards a BiDi command sent by Puppeteer to the input of the BidiServer.
            transportBiDi.emitMessage(JSON.parse(message));
        },
        close() {
            bidiServer.close();
            cdpConnectionAdapter.close();
            cdp.dispose();
        },
        onmessage(_message) {
            // The method is overridden by the Connection.
        },
    };
    transportBiDi.on('bidiResponse', (message) => {
        // Forwards a BiDi event sent by BidiServer to Puppeteer.
        pptrTransport.onmessage(JSON.stringify(message));
    });
    const pptrBiDiConnection = new Connection_js_1.BidiConnection(cdp.url(), pptrTransport, cdp.delay, cdp.timeout);
    const bidiServer = await BidiMapper.BidiServer.createAndStart(transportBiDi, cdpConnectionAdapter, cdpConnectionAdapter.browserClient(), 
    /* selfTargetId= */ '', undefined, bidiServerLogger);
    return pptrBiDiConnection;
}
/**
 * Manages CDPSessions for BidiServer.
 * @internal
 */
class CdpConnectionAdapter {
    constructor(cdp) {
        _CdpConnectionAdapter_cdp.set(this, void 0);
        _CdpConnectionAdapter_adapters.set(this, new Map());
        _CdpConnectionAdapter_browserCdpConnection.set(this, void 0);
        __classPrivateFieldSet(this, _CdpConnectionAdapter_cdp, cdp, "f");
        __classPrivateFieldSet(this, _CdpConnectionAdapter_browserCdpConnection, new CDPClientAdapter(cdp), "f");
    }
    browserClient() {
        return __classPrivateFieldGet(this, _CdpConnectionAdapter_browserCdpConnection, "f");
    }
    getCdpClient(id) {
        const session = __classPrivateFieldGet(this, _CdpConnectionAdapter_cdp, "f").session(id);
        if (!session) {
            throw new Error(`Unknown CDP session with id ${id}`);
        }
        if (!__classPrivateFieldGet(this, _CdpConnectionAdapter_adapters, "f").has(session)) {
            const adapter = new CDPClientAdapter(session, id, __classPrivateFieldGet(this, _CdpConnectionAdapter_browserCdpConnection, "f"));
            __classPrivateFieldGet(this, _CdpConnectionAdapter_adapters, "f").set(session, adapter);
            return adapter;
        }
        return __classPrivateFieldGet(this, _CdpConnectionAdapter_adapters, "f").get(session);
    }
    close() {
        __classPrivateFieldGet(this, _CdpConnectionAdapter_browserCdpConnection, "f").close();
        for (const adapter of __classPrivateFieldGet(this, _CdpConnectionAdapter_adapters, "f").values()) {
            adapter.close();
        }
    }
}
_CdpConnectionAdapter_cdp = new WeakMap(), _CdpConnectionAdapter_adapters = new WeakMap(), _CdpConnectionAdapter_browserCdpConnection = new WeakMap();
/**
 * Wrapper on top of CDPSession/CDPConnection to satisfy CDP interface that
 * BidiServer needs.
 *
 * @internal
 */
class CDPClientAdapter extends BidiMapper.EventEmitter {
    constructor(client, sessionId, browserClient) {
        super();
        _CDPClientAdapter_closed.set(this, false);
        _CDPClientAdapter_client.set(this, void 0);
        this.sessionId = undefined;
        _CDPClientAdapter_browserClient.set(this, void 0);
        _CDPClientAdapter_forwardMessage.set(this, (method, event) => {
            this.emit(method, event);
        });
        __classPrivateFieldSet(this, _CDPClientAdapter_client, client, "f");
        this.sessionId = sessionId;
        __classPrivateFieldSet(this, _CDPClientAdapter_browserClient, browserClient, "f");
        __classPrivateFieldGet(this, _CDPClientAdapter_client, "f").on('*', __classPrivateFieldGet(this, _CDPClientAdapter_forwardMessage, "f"));
    }
    browserClient() {
        return __classPrivateFieldGet(this, _CDPClientAdapter_browserClient, "f");
    }
    async sendCommand(method, ...params) {
        if (__classPrivateFieldGet(this, _CDPClientAdapter_closed, "f")) {
            return;
        }
        try {
            return await __classPrivateFieldGet(this, _CDPClientAdapter_client, "f").send(method, ...params);
        }
        catch (err) {
            if (__classPrivateFieldGet(this, _CDPClientAdapter_closed, "f")) {
                return;
            }
            throw err;
        }
    }
    close() {
        __classPrivateFieldGet(this, _CDPClientAdapter_client, "f").off('*', __classPrivateFieldGet(this, _CDPClientAdapter_forwardMessage, "f"));
        __classPrivateFieldSet(this, _CDPClientAdapter_closed, true, "f");
    }
    isCloseError(error) {
        return error instanceof Errors_js_1.TargetCloseError;
    }
}
_CDPClientAdapter_closed = new WeakMap(), _CDPClientAdapter_client = new WeakMap(), _CDPClientAdapter_browserClient = new WeakMap(), _CDPClientAdapter_forwardMessage = new WeakMap();
/**
 * This transport is given to the BiDi server instance and allows Puppeteer
 * to send and receive commands to the BiDiServer.
 * @internal
 */
class NoOpTransport extends BidiMapper.EventEmitter {
    constructor() {
        super(...arguments);
        _NoOpTransport_onMessage.set(this, async (_m) => {
            return;
        });
    }
    emitMessage(message) {
        void __classPrivateFieldGet(this, _NoOpTransport_onMessage, "f").call(this, message);
    }
    setOnMessage(onMessage) {
        __classPrivateFieldSet(this, _NoOpTransport_onMessage, onMessage, "f");
    }
    async sendMessage(message) {
        this.emit('bidiResponse', message);
    }
    close() {
        __classPrivateFieldSet(this, _NoOpTransport_onMessage, async (_m) => {
            return;
        }, "f");
    }
}
_NoOpTransport_onMessage = new WeakMap();
//# sourceMappingURL=BidiOverCdp.js.map