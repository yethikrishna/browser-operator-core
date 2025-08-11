/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
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
var _CdpBrowser_instances, _CdpBrowser_defaultViewport, _CdpBrowser_process, _CdpBrowser_connection, _CdpBrowser_closeCallback, _CdpBrowser_targetFilterCallback, _CdpBrowser_isPageTargetCallback, _CdpBrowser_defaultContext, _CdpBrowser_contexts, _CdpBrowser_networkEnabled, _CdpBrowser_targetManager, _CdpBrowser_emitDisconnected, _CdpBrowser_setIsPageTargetCallback, _CdpBrowser_createTarget, _CdpBrowser_onAttachedToTarget, _CdpBrowser_onDetachedFromTarget, _CdpBrowser_onTargetChanged, _CdpBrowser_onTargetDiscovered, _CdpBrowser_getVersion;
import { Browser as BrowserBase, } from '../api/Browser.js';
import { CDPSessionEvent } from '../api/CDPSession.js';
import { CdpBrowserContext } from './BrowserContext.js';
import { DevToolsTarget, InitializationStatus, OtherTarget, PageTarget, WorkerTarget, } from './Target.js';
import { TargetManager } from './TargetManager.js';
/**
 * @internal
 */
export class CdpBrowser extends BrowserBase {
    static async _create(connection, contextIds, acceptInsecureCerts, defaultViewport, downloadBehavior, process, closeCallback, targetFilterCallback, isPageTargetCallback, waitForInitiallyDiscoveredTargets = true, networkEnabled = true) {
        const browser = new CdpBrowser(connection, contextIds, defaultViewport, process, closeCallback, targetFilterCallback, isPageTargetCallback, waitForInitiallyDiscoveredTargets, networkEnabled);
        if (acceptInsecureCerts) {
            await connection.send('Security.setIgnoreCertificateErrors', {
                ignore: true,
            });
        }
        await browser._attach(downloadBehavior);
        return browser;
    }
    constructor(connection, contextIds, defaultViewport, process, closeCallback, targetFilterCallback, isPageTargetCallback, waitForInitiallyDiscoveredTargets = true, networkEnabled = true) {
        super();
        _CdpBrowser_instances.add(this);
        this.protocol = 'cdp';
        _CdpBrowser_defaultViewport.set(this, void 0);
        _CdpBrowser_process.set(this, void 0);
        _CdpBrowser_connection.set(this, void 0);
        _CdpBrowser_closeCallback.set(this, void 0);
        _CdpBrowser_targetFilterCallback.set(this, void 0);
        _CdpBrowser_isPageTargetCallback.set(this, void 0);
        _CdpBrowser_defaultContext.set(this, void 0);
        _CdpBrowser_contexts.set(this, new Map());
        _CdpBrowser_networkEnabled.set(this, true);
        _CdpBrowser_targetManager.set(this, void 0);
        _CdpBrowser_emitDisconnected.set(this, () => {
            this.emit("disconnected" /* BrowserEvent.Disconnected */, undefined);
        });
        _CdpBrowser_createTarget.set(this, (targetInfo, session) => {
            const { browserContextId } = targetInfo;
            const context = browserContextId && __classPrivateFieldGet(this, _CdpBrowser_contexts, "f").has(browserContextId)
                ? __classPrivateFieldGet(this, _CdpBrowser_contexts, "f").get(browserContextId)
                : __classPrivateFieldGet(this, _CdpBrowser_defaultContext, "f");
            if (!context) {
                throw new Error('Missing browser context');
            }
            const createSession = (isAutoAttachEmulated) => {
                return __classPrivateFieldGet(this, _CdpBrowser_connection, "f")._createSession(targetInfo, isAutoAttachEmulated);
            };
            const otherTarget = new OtherTarget(targetInfo, session, context, __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f"), createSession);
            if (targetInfo.url?.startsWith('devtools://')) {
                return new DevToolsTarget(targetInfo, session, context, __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f"), createSession, __classPrivateFieldGet(this, _CdpBrowser_defaultViewport, "f") ?? null);
            }
            if (__classPrivateFieldGet(this, _CdpBrowser_isPageTargetCallback, "f").call(this, otherTarget)) {
                return new PageTarget(targetInfo, session, context, __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f"), createSession, __classPrivateFieldGet(this, _CdpBrowser_defaultViewport, "f") ?? null);
            }
            if (targetInfo.type === 'service_worker' ||
                targetInfo.type === 'shared_worker') {
                return new WorkerTarget(targetInfo, session, context, __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f"), createSession);
            }
            return otherTarget;
        });
        _CdpBrowser_onAttachedToTarget.set(this, async (target) => {
            if (target._isTargetExposed() &&
                (await target._initializedDeferred.valueOrThrow()) ===
                    InitializationStatus.SUCCESS) {
                this.emit("targetcreated" /* BrowserEvent.TargetCreated */, target);
                target.browserContext().emit("targetcreated" /* BrowserContextEvent.TargetCreated */, target);
            }
        });
        _CdpBrowser_onDetachedFromTarget.set(this, async (target) => {
            target._initializedDeferred.resolve(InitializationStatus.ABORTED);
            target._isClosedDeferred.resolve();
            if (target._isTargetExposed() &&
                (await target._initializedDeferred.valueOrThrow()) ===
                    InitializationStatus.SUCCESS) {
                this.emit("targetdestroyed" /* BrowserEvent.TargetDestroyed */, target);
                target.browserContext().emit("targetdestroyed" /* BrowserContextEvent.TargetDestroyed */, target);
            }
        });
        _CdpBrowser_onTargetChanged.set(this, ({ target }) => {
            this.emit("targetchanged" /* BrowserEvent.TargetChanged */, target);
            target.browserContext().emit("targetchanged" /* BrowserContextEvent.TargetChanged */, target);
        });
        _CdpBrowser_onTargetDiscovered.set(this, (targetInfo) => {
            this.emit("targetdiscovered" /* BrowserEvent.TargetDiscovered */, targetInfo);
        });
        __classPrivateFieldSet(this, _CdpBrowser_networkEnabled, networkEnabled, "f");
        __classPrivateFieldSet(this, _CdpBrowser_defaultViewport, defaultViewport, "f");
        __classPrivateFieldSet(this, _CdpBrowser_process, process, "f");
        __classPrivateFieldSet(this, _CdpBrowser_connection, connection, "f");
        __classPrivateFieldSet(this, _CdpBrowser_closeCallback, closeCallback || (() => { }), "f");
        __classPrivateFieldSet(this, _CdpBrowser_targetFilterCallback, targetFilterCallback ||
            (() => {
                return true;
            }), "f");
        __classPrivateFieldGet(this, _CdpBrowser_instances, "m", _CdpBrowser_setIsPageTargetCallback).call(this, isPageTargetCallback);
        __classPrivateFieldSet(this, _CdpBrowser_targetManager, new TargetManager(connection, __classPrivateFieldGet(this, _CdpBrowser_createTarget, "f"), __classPrivateFieldGet(this, _CdpBrowser_targetFilterCallback, "f"), waitForInitiallyDiscoveredTargets), "f");
        __classPrivateFieldSet(this, _CdpBrowser_defaultContext, new CdpBrowserContext(__classPrivateFieldGet(this, _CdpBrowser_connection, "f"), this), "f");
        for (const contextId of contextIds) {
            __classPrivateFieldGet(this, _CdpBrowser_contexts, "f").set(contextId, new CdpBrowserContext(__classPrivateFieldGet(this, _CdpBrowser_connection, "f"), this, contextId));
        }
    }
    async _attach(downloadBehavior) {
        __classPrivateFieldGet(this, _CdpBrowser_connection, "f").on(CDPSessionEvent.Disconnected, __classPrivateFieldGet(this, _CdpBrowser_emitDisconnected, "f"));
        if (downloadBehavior) {
            await __classPrivateFieldGet(this, _CdpBrowser_defaultContext, "f").setDownloadBehavior(downloadBehavior);
        }
        __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").on("targetAvailable" /* TargetManagerEvent.TargetAvailable */, __classPrivateFieldGet(this, _CdpBrowser_onAttachedToTarget, "f"));
        __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").on("targetGone" /* TargetManagerEvent.TargetGone */, __classPrivateFieldGet(this, _CdpBrowser_onDetachedFromTarget, "f"));
        __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").on("targetChanged" /* TargetManagerEvent.TargetChanged */, __classPrivateFieldGet(this, _CdpBrowser_onTargetChanged, "f"));
        __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").on("targetDiscovered" /* TargetManagerEvent.TargetDiscovered */, __classPrivateFieldGet(this, _CdpBrowser_onTargetDiscovered, "f"));
        await __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").initialize();
    }
    _detach() {
        __classPrivateFieldGet(this, _CdpBrowser_connection, "f").off(CDPSessionEvent.Disconnected, __classPrivateFieldGet(this, _CdpBrowser_emitDisconnected, "f"));
        __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").off("targetAvailable" /* TargetManagerEvent.TargetAvailable */, __classPrivateFieldGet(this, _CdpBrowser_onAttachedToTarget, "f"));
        __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").off("targetGone" /* TargetManagerEvent.TargetGone */, __classPrivateFieldGet(this, _CdpBrowser_onDetachedFromTarget, "f"));
        __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").off("targetChanged" /* TargetManagerEvent.TargetChanged */, __classPrivateFieldGet(this, _CdpBrowser_onTargetChanged, "f"));
        __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").off("targetDiscovered" /* TargetManagerEvent.TargetDiscovered */, __classPrivateFieldGet(this, _CdpBrowser_onTargetDiscovered, "f"));
    }
    process() {
        return __classPrivateFieldGet(this, _CdpBrowser_process, "f") ?? null;
    }
    _targetManager() {
        return __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f");
    }
    _getIsPageTargetCallback() {
        return __classPrivateFieldGet(this, _CdpBrowser_isPageTargetCallback, "f");
    }
    async createBrowserContext(options = {}) {
        const { proxyServer, proxyBypassList, downloadBehavior } = options;
        const { browserContextId } = await __classPrivateFieldGet(this, _CdpBrowser_connection, "f").send('Target.createBrowserContext', {
            proxyServer,
            proxyBypassList: proxyBypassList && proxyBypassList.join(','),
        });
        const context = new CdpBrowserContext(__classPrivateFieldGet(this, _CdpBrowser_connection, "f"), this, browserContextId);
        if (downloadBehavior) {
            await context.setDownloadBehavior(downloadBehavior);
        }
        __classPrivateFieldGet(this, _CdpBrowser_contexts, "f").set(browserContextId, context);
        return context;
    }
    browserContexts() {
        return [__classPrivateFieldGet(this, _CdpBrowser_defaultContext, "f"), ...Array.from(__classPrivateFieldGet(this, _CdpBrowser_contexts, "f").values())];
    }
    defaultBrowserContext() {
        return __classPrivateFieldGet(this, _CdpBrowser_defaultContext, "f");
    }
    async _disposeContext(contextId) {
        if (!contextId) {
            return;
        }
        await __classPrivateFieldGet(this, _CdpBrowser_connection, "f").send('Target.disposeBrowserContext', {
            browserContextId: contextId,
        });
        __classPrivateFieldGet(this, _CdpBrowser_contexts, "f").delete(contextId);
    }
    wsEndpoint() {
        return __classPrivateFieldGet(this, _CdpBrowser_connection, "f").url();
    }
    async newPage() {
        return await __classPrivateFieldGet(this, _CdpBrowser_defaultContext, "f").newPage();
    }
    async _createPageInContext(contextId) {
        const { targetId } = await __classPrivateFieldGet(this, _CdpBrowser_connection, "f").send('Target.createTarget', {
            url: 'about:blank',
            browserContextId: contextId || undefined,
        });
        const target = (await this.waitForTarget(t => {
            return t._targetId === targetId;
        }));
        if (!target) {
            throw new Error(`Missing target for page (id = ${targetId})`);
        }
        const initialized = (await target._initializedDeferred.valueOrThrow()) ===
            InitializationStatus.SUCCESS;
        if (!initialized) {
            throw new Error(`Failed to create target for page (id = ${targetId})`);
        }
        const page = await target.page();
        if (!page) {
            throw new Error(`Failed to create a page for context (id = ${contextId})`);
        }
        return page;
    }
    async installExtension(path) {
        const { id } = await __classPrivateFieldGet(this, _CdpBrowser_connection, "f").send('Extensions.loadUnpacked', { path });
        return id;
    }
    uninstallExtension(id) {
        return __classPrivateFieldGet(this, _CdpBrowser_connection, "f").send('Extensions.uninstall', { id });
    }
    targets() {
        return Array.from(__classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").getAvailableTargets().values()).filter(target => {
            return (target._isTargetExposed() &&
                target._initializedDeferred.value() === InitializationStatus.SUCCESS);
        });
    }
    target() {
        const browserTarget = this.targets().find(target => {
            return target.type() === 'browser';
        });
        if (!browserTarget) {
            throw new Error('Browser target is not found');
        }
        return browserTarget;
    }
    async version() {
        const version = await __classPrivateFieldGet(this, _CdpBrowser_instances, "m", _CdpBrowser_getVersion).call(this);
        return version.product;
    }
    async userAgent() {
        const version = await __classPrivateFieldGet(this, _CdpBrowser_instances, "m", _CdpBrowser_getVersion).call(this);
        return version.userAgent;
    }
    async close() {
        await __classPrivateFieldGet(this, _CdpBrowser_closeCallback, "f").call(null);
        await this.disconnect();
    }
    disconnect() {
        __classPrivateFieldGet(this, _CdpBrowser_targetManager, "f").dispose();
        __classPrivateFieldGet(this, _CdpBrowser_connection, "f").dispose();
        this._detach();
        return Promise.resolve();
    }
    get connected() {
        return !__classPrivateFieldGet(this, _CdpBrowser_connection, "f")._closed;
    }
    get debugInfo() {
        return {
            pendingProtocolErrors: __classPrivateFieldGet(this, _CdpBrowser_connection, "f").getPendingProtocolErrors(),
        };
    }
    isNetworkEnabled() {
        return __classPrivateFieldGet(this, _CdpBrowser_networkEnabled, "f");
    }
}
_CdpBrowser_defaultViewport = new WeakMap(), _CdpBrowser_process = new WeakMap(), _CdpBrowser_connection = new WeakMap(), _CdpBrowser_closeCallback = new WeakMap(), _CdpBrowser_targetFilterCallback = new WeakMap(), _CdpBrowser_isPageTargetCallback = new WeakMap(), _CdpBrowser_defaultContext = new WeakMap(), _CdpBrowser_contexts = new WeakMap(), _CdpBrowser_networkEnabled = new WeakMap(), _CdpBrowser_targetManager = new WeakMap(), _CdpBrowser_emitDisconnected = new WeakMap(), _CdpBrowser_createTarget = new WeakMap(), _CdpBrowser_onAttachedToTarget = new WeakMap(), _CdpBrowser_onDetachedFromTarget = new WeakMap(), _CdpBrowser_onTargetChanged = new WeakMap(), _CdpBrowser_onTargetDiscovered = new WeakMap(), _CdpBrowser_instances = new WeakSet(), _CdpBrowser_setIsPageTargetCallback = function _CdpBrowser_setIsPageTargetCallback(isPageTargetCallback) {
    __classPrivateFieldSet(this, _CdpBrowser_isPageTargetCallback, isPageTargetCallback ||
        ((target) => {
            return (target.type() === 'page' ||
                target.type() === 'background_page' ||
                target.type() === 'webview');
        }), "f");
}, _CdpBrowser_getVersion = function _CdpBrowser_getVersion() {
    return __classPrivateFieldGet(this, _CdpBrowser_connection, "f").send('Browser.getVersion');
};
//# sourceMappingURL=Browser.js.map