"use strict";
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
var __classPrivateFieldIn = (this && this.__classPrivateFieldIn) || function(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
};
/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function")
        throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn)
            context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
            context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done)
            throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0)
                continue;
            if (result === null || typeof result !== "object")
                throw new TypeError("Object expected");
            if (_ = accept(result.get))
                descriptor.get = _;
            if (_ = accept(result.set))
                descriptor.set = _;
            if (_ = accept(result.init))
                initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field")
                initializers.unshift(_);
            else
                descriptor[key] = _;
        }
    }
    if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol")
        name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidiBrowser = void 0;
const Browser_js_1 = require("../api/Browser.js");
const Errors_js_1 = require("../common/Errors.js");
const EventEmitter_js_1 = require("../common/EventEmitter.js");
const util_js_1 = require("../common/util.js");
const decorators_js_1 = require("../util/decorators.js");
const BrowserContext_js_1 = require("./BrowserContext.js");
const Session_js_1 = require("./core/Session.js");
const Target_js_1 = require("./Target.js");
/**
 * @internal
 */
let BidiBrowser = (() => {
    var _BidiBrowser_instances, _a, _BidiBrowser_trustedEmitter_accessor_storage, _BidiBrowser_trustedEmitter_get, _BidiBrowser_trustedEmitter_set, _BidiBrowser_process, _BidiBrowser_closeCallback, _BidiBrowser_browserCore, _BidiBrowser_defaultViewport, _BidiBrowser_browserContexts, _BidiBrowser_target, _BidiBrowser_cdpConnection, _BidiBrowser_networkEnabled, _BidiBrowser_initialize, _BidiBrowser_browserName_get, _BidiBrowser_browserVersion_get, _BidiBrowser_createBrowserContext;
    let _classSuper = Browser_js_1.Browser;
    let _private_trustedEmitter_decorators;
    let _private_trustedEmitter_initializers = [];
    let _private_trustedEmitter_extraInitializers = [];
    let _private_trustedEmitter_descriptor;
    return _a = class BidiBrowser extends _classSuper {
            static async create(opts) {
                const session = await Session_js_1.Session.from(opts.connection, {
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
                    ? _a.subscribeModules
                    : [..._a.subscribeModules, ..._a.subscribeCdpEvents]).filter(module => {
                    if (!opts.networkEnabled) {
                        return (module !== 'network' &&
                            module !== 'goog:cdp.Network.requestWillBeSent');
                    }
                    return true;
                }));
                try {
                    await session.send('network.addDataCollector', {
                        dataTypes: ["response" /* Bidi.Network.DataType.Response */],
                        // Buffer size of 20 MB is equivalent to the CDP:
                        maxEncodedDataSize: 20 * 1000 * 1000, // 20 MB
                    });
                }
                catch (err) {
                    if (err instanceof Errors_js_1.ProtocolError) {
                        // Ignore protocol errors, as the data collectors can be not implemented.
                        (0, util_js_1.debugError)(err);
                    }
                    else {
                        throw err;
                    }
                }
                const browser = new _a(session.browser, opts);
                __classPrivateFieldGet(browser, _BidiBrowser_instances, "m", _BidiBrowser_initialize).call(browser);
                return browser;
            }
            constructor(browserCore, opts) {
                super();
                _BidiBrowser_instances.add(this);
                this.protocol = 'webDriverBiDi';
                _BidiBrowser_trustedEmitter_accessor_storage.set(this, __runInitializers(this, _private_trustedEmitter_initializers, new EventEmitter_js_1.EventEmitter()));
                _BidiBrowser_process.set(this, __runInitializers(this, _private_trustedEmitter_extraInitializers));
                _BidiBrowser_closeCallback.set(this, void 0);
                _BidiBrowser_browserCore.set(this, void 0);
                _BidiBrowser_defaultViewport.set(this, void 0);
                _BidiBrowser_browserContexts.set(this, new WeakMap());
                _BidiBrowser_target.set(this, new Target_js_1.BidiBrowserTarget(this));
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
                    (0, util_js_1.debugError)(error);
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
                    (0, util_js_1.debugError)(error);
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
        },
        _BidiBrowser_trustedEmitter_accessor_storage = new WeakMap(),
        _BidiBrowser_process = new WeakMap(),
        _BidiBrowser_closeCallback = new WeakMap(),
        _BidiBrowser_browserCore = new WeakMap(),
        _BidiBrowser_defaultViewport = new WeakMap(),
        _BidiBrowser_browserContexts = new WeakMap(),
        _BidiBrowser_target = new WeakMap(),
        _BidiBrowser_cdpConnection = new WeakMap(),
        _BidiBrowser_networkEnabled = new WeakMap(),
        _BidiBrowser_instances = new WeakSet(),
        _BidiBrowser_trustedEmitter_get = function _BidiBrowser_trustedEmitter_get() { return _private_trustedEmitter_descriptor.get.call(this); },
        _BidiBrowser_trustedEmitter_set = function _BidiBrowser_trustedEmitter_set(value) { return _private_trustedEmitter_descriptor.set.call(this, value); },
        _BidiBrowser_initialize = function _BidiBrowser_initialize() {
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
        },
        _BidiBrowser_browserName_get = function _BidiBrowser_browserName_get() {
            return __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").session.capabilities.browserName;
        },
        _BidiBrowser_browserVersion_get = function _BidiBrowser_browserVersion_get() {
            return __classPrivateFieldGet(this, _BidiBrowser_browserCore, "f").session.capabilities.browserVersion;
        },
        _BidiBrowser_createBrowserContext = function _BidiBrowser_createBrowserContext(userContext) {
            const browserContext = BrowserContext_js_1.BidiBrowserContext.from(this, userContext, {
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
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _private_trustedEmitter_decorators = [(0, decorators_js_1.bubble)()];
            __esDecorate(_a, _private_trustedEmitter_descriptor = { get: __setFunctionName(function () { return __classPrivateFieldGet(this, _BidiBrowser_trustedEmitter_accessor_storage, "f"); }, "#trustedEmitter", "get"), set: __setFunctionName(function (value) { __classPrivateFieldSet(this, _BidiBrowser_trustedEmitter_accessor_storage, value, "f"); }, "#trustedEmitter", "set") }, _private_trustedEmitter_decorators, { kind: "accessor", name: "#trustedEmitter", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_BidiBrowser_instances, obj), get: obj => __classPrivateFieldGet(obj, _BidiBrowser_instances, "a", _BidiBrowser_trustedEmitter_get), set: (obj, value) => { __classPrivateFieldSet(obj, _BidiBrowser_instances, value, "a", _BidiBrowser_trustedEmitter_set); } }, metadata: _metadata }, _private_trustedEmitter_initializers, _private_trustedEmitter_extraInitializers);
            if (_metadata)
                Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.subscribeModules = [
            'browsingContext',
            'network',
            'log',
            'script',
            'input',
        ],
        _a.subscribeCdpEvents = [
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
        ],
        _a;
})();
exports.BidiBrowser = BidiBrowser;
//# sourceMappingURL=Browser.js.map