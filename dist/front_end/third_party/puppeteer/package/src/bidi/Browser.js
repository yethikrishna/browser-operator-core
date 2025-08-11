/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _BidiBrowser_instances, _BidiBrowser_trustedEmitter_get, _BidiBrowser_trustedEmitter_set, _BidiBrowser_process, _BidiBrowser_closeCallback, _BidiBrowser_browserCore, _BidiBrowser_defaultViewport, _BidiBrowser_browserContexts, _BidiBrowser_target, _BidiBrowser_cdpConnection, _BidiBrowser_networkEnabled, _BidiBrowser_initialize, _BidiBrowser_browserName_get, _BidiBrowser_browserVersion_get, _BidiBrowser_createBrowserContext, _BidiBrowser_trustedEmitter_accessor_storage;
import { Browser, } from '../api/Browser.js';
import { ProtocolError } from '../common/Errors.js';
import { EventEmitter } from '../common/EventEmitter.js';
import { debugError } from '../common/util.js';
import { BidiBrowserContext } from './BrowserContext.js';
import { Session } from './core/Session.js';
import { BidiBrowserTarget } from './Target.js';
/**
 * @internal
 */
export class BidiBrowser extends Browser {
    static async create(opts) {
        const session = await Session.from(opts.connection, {
            firstMatch: opts.capabilities?.firstMatch,
            alwaysMatch: {
                ...opts.capabilities?.alwaysMatch,
                // Capabilities that come from Puppeteer's API take precedence.
                acceptInsecureCerts: opts.acceptInsecureCerts,
                unhandledPromptBehavior: {
                    default: "ignore" /* Bidi.Session.UserPromptHandlerType.Ignore */,
                },
                webSocketUrl: true,
                // Puppeteer with WebDriver BiDi does not support prerendering
                // yet because WebDriver BiDi behavior is not specified. See
                // https://github.com/w3c/webdriver-bidi/issues/321.
                'goog:prerenderingDisabled': true,
            },
        });
        await session.subscribe((session.capabilities.browserName.toLocaleLowerCase().includes('firefox')
            ? BidiBrowser.subscribeModules
            : [...BidiBrowser.subscribeModules, ...BidiBrowser.subscribeCdpEvents]).filter(module => {
            if (!opts.networkEnabled) {
                return (module !== 'network' &&
                    module !== 'goog:cdp.Network.requestWillBeSent');
            }
            return true;
        }));
        try {
            await session.send('network.addDataCollector', {
                dataTypes: [Bidi.Network.DataType.Response],
                // Buffer size of 20 MB is equivalent to the CDP:
                maxEncodedDataSize: 20 * 1000 * 1000, // 20 MB
            });
        }
        catch (err) {
            if (err instanceof ProtocolError) {
                // Ignore protocol errors, as the data collectors can be not implemented.
                debugError(err);
            }
            else {
                throw err;
            }
        }
        const browser = new BidiBrowser(session.browser, opts);
        __classPrivateFieldGet(browser, _BidiBrowser_instances, "m", _BidiBrowser_initialize).call(browser);
        return browser;
    }
    constructor(browserCore, opts) {
        super();
        _BidiBrowser_instances.add(this);
        this.protocol = 'webDriverBiDi';
        _BidiBrowser_trustedEmitter_accessor_storage.set(this, new EventEmitter());
        _BidiBrowser_process.set(this, void 0);
        _BidiBrowser_closeCallback.set(this, void 0);
        _BidiBrowser_browserCore.set(this, void 0);
        _BidiBrowser_defaultViewport.set(this, void 0);
        _BidiBrowser_browserContexts.set(this, new WeakMap());
        _BidiBrowser_target.set(this, new BidiBrowserTarget(this));
        _BidiBrowser_cdpConnection.set(this, void 0);
        _BidiBrowser_networkEnabled.set(this, void 0);
        __classPrivateFieldSet(this, _BidiBrowser_process, opts.process, "f");
        __classPrivateFieldSet(this, _BidiBrowser_closeCallback, opts.closeCallback, "f");
        __classPrivateFieldSet(this, _BidiBrowser_browserCore, browserCore, "f");
        __classPrivateFieldSet(this, _BidiBrowser_defaultViewport, opts.defaultViewport, "f");
        __classPrivateFieldSet(this, _BidiBrowser_cdpConnection, opts.cdpConnection, "f");
        __classPrivateFieldSet(this, _BidiBrowser_networkEnabled, opts.networkEnabled, "f");
    }
    get cdpSupported() {
        return __classPrivateFieldGet(this, _BidiBrowser_cdpConnection, "f") !== undefined;
    }
    get cdpConnection() {
        return __classPrivateFieldGet(this, _BidiBrowser_cdpConnection, "f");
    }
    async userAgent() {
        return __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").session.capabilities.userAgent;
    }
    get connection() {
        // SAFETY: We only have one implementation.
        return __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").session.connection;
    }
    wsEndpoint() {
        return this.connection.url;
    }
    async close() {
        if (this.connection.closed) {
            return;
        }
        try {
            await __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").close();
            await __classPrivateFieldGet(this, _BidiBrowser_closeCallback, "f")?.call(null);
        }
        catch (error) {
            // Fail silently.
            debugError(error);
        }
        finally {
            this.connection.dispose();
        }
    }
    get connected() {
        return !__classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").disconnected;
    }
    process() {
        return __classPrivateFieldGet(this, _BidiBrowser_process, "f") ?? null;
    }
    async createBrowserContext(options = {}) {
        const userContext = await __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").createUserContext(options);
        return __classPrivateFieldGet(this, _BidiBrowser_instances, "m", _BidiBrowser_createBrowserContext).call(this, userContext);
    }
    async version() {
        return `${__classPrivateFieldGet(this, _BidiBrowser_instances, "a", _BidiBrowser_browserName_get)}/${__classPrivateFieldGet(this, _BidiBrowser_instances, "a", _BidiBrowser_browserVersion_get)}`;
    }
    browserContexts() {
        return [...__classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").userContexts].map(context => {
            return __classPrivateFieldGet(this, _BidiBrowser_browserContexts, "f").get(context);
        });
    }
    defaultBrowserContext() {
        return __classPrivateFieldGet(this, _BidiBrowser_browserContexts, "f").get(__classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").defaultUserContext);
    }
    newPage() {
        return this.defaultBrowserContext().newPage();
    }
    installExtension(path) {
        return __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").installExtension(path);
    }
    async uninstallExtension(id) {
        await __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").uninstallExtension(id);
    }
    targets() {
        return [
            __classPrivateFieldGet(this, _BidiBrowser_target, "f"),
            ...this.browserContexts().flatMap(context => {
                return context.targets();
            }),
        ];
    }
    target() {
        return __classPrivateFieldGet(this, _BidiBrowser_target, "f");
    }
    async disconnect() {
        try {
            await __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").session.end();
        }
        catch (error) {
            // Fail silently.
            debugError(error);
        }
        finally {
            this.connection.dispose();
        }
    }
    get debugInfo() {
        return {
            pendingProtocolErrors: this.connection.getPendingProtocolErrors(),
        };
    }
    isNetworkEnabled() {
        return __classPrivateFieldGet(this, _BidiBrowser_networkEnabled, "f");
    }
}
_BidiBrowser_process = new WeakMap(), _BidiBrowser_closeCallback = new WeakMap(), _BidiBrowser_browserCore = new WeakMap(), _BidiBrowser_defaultViewport = new WeakMap(), _BidiBrowser_browserContexts = new WeakMap(), _BidiBrowser_target = new WeakMap(), _BidiBrowser_cdpConnection = new WeakMap(), _BidiBrowser_networkEnabled = new WeakMap(), _BidiBrowser_instances = new WeakSet(), _BidiBrowser_trustedEmitter_accessor_storage = new WeakMap(), _BidiBrowser_trustedEmitter_get = function _BidiBrowser_trustedEmitter_get() { return __classPrivateFieldGet(this, _BidiBrowser_trustedEmitter_accessor_storage, "f"); }, _BidiBrowser_trustedEmitter_set = function _BidiBrowser_trustedEmitter_set(value) { __classPrivateFieldSet(this, _BidiBrowser_trustedEmitter_accessor_storage, value, "f"); }, _BidiBrowser_initialize = function _BidiBrowser_initialize() {
    // Initializing existing contexts.
    for (const userContext of __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").userContexts) {
        __classPrivateFieldGet(this, _BidiBrowser_instances, "m", _BidiBrowser_createBrowserContext).call(this, userContext);
    }
    __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").once('disconnected', () => {
        __classPrivateFieldGet(this, _BidiBrowser_instances, "a", _BidiBrowser_trustedEmitter_get).emit("disconnected" /* BrowserEvent.Disconnected */, undefined);
        __classPrivateFieldGet(this, _BidiBrowser_instances, "a", _BidiBrowser_trustedEmitter_get).removeAllListeners();
    });
    __classPrivateFieldGet(this, _BidiBrowser_process, "f")?.once('close', () => {
        __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").dispose('Browser process exited.', true);
        this.connection.dispose();
    });
}, _BidiBrowser_browserName_get = function _BidiBrowser_browserName_get() {
    return __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").session.capabilities.browserName;
}, _BidiBrowser_browserVersion_get = function _BidiBrowser_browserVersion_get() {
    return __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").session.capabilities.browserVersion;
}, _BidiBrowser_createBrowserContext = function _BidiBrowser_createBrowserContext(userContext) {
    const browserContext = BidiBrowserContext.from(this, userContext, {
        defaultViewport: __classPrivateFieldGet(this, _BidiBrowser_defaultViewport, "f"),
    });
    __classPrivateFieldGet(this, _BidiBrowser_browserContexts, "f").set(userContext, browserContext);
    browserContext.trustedEmitter.on("targetcreated" /* BrowserContextEvent.TargetCreated */, target => {
        __classPrivateFieldGet(this, _BidiBrowser_instances, "a", _BidiBrowser_trustedEmitter_get).emit("targetcreated" /* BrowserEvent.TargetCreated */, target);
    });
    browserContext.trustedEmitter.on("targetchanged" /* BrowserContextEvent.TargetChanged */, target => {
        __classPrivateFieldGet(this, _BidiBrowser_instances, "a", _BidiBrowser_trustedEmitter_get).emit("targetchanged" /* BrowserEvent.TargetChanged */, target);
    });
    browserContext.trustedEmitter.on("targetdestroyed" /* BrowserContextEvent.TargetDestroyed */, target => {
        __classPrivateFieldGet(this, _BidiBrowser_instances, "a", _BidiBrowser_trustedEmitter_get).emit("targetdestroyed" /* BrowserEvent.TargetDestroyed */, target);
    });
    return browserContext;
};
BidiBrowser.subscribeModules = [
    'browsingContext',
    'network',
    'log',
    'script',
    'input',
];
BidiBrowser.subscribeCdpEvents = [
    // Coverage
    'goog:cdp.Debugger.scriptParsed',
    'goog:cdp.CSS.styleSheetAdded',
    'goog:cdp.Runtime.executionContextsCleared',
    // Tracing
    'goog:cdp.Tracing.tracingComplete',
    // TODO: subscribe to all CDP events in the future.
    'goog:cdp.Network.requestWillBeSent',
    'goog:cdp.Debugger.scriptParsed',
    'goog:cdp.Page.screencastFrame',
];
//# sourceMappingURL=Browser.js.map