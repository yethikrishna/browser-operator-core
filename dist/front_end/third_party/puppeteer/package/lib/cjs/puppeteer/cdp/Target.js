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
var _CdpTarget_browserContext, _CdpTarget_session, _CdpTarget_targetInfo, _CdpTarget_targetManager, _CdpTarget_sessionFactory, _CdpTarget_childTargets, _PageTarget_defaultViewport, _WorkerTarget_workerPromise;
/**
 * @license
 * Copyright 2019 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtherTarget = exports.WorkerTarget = exports.DevToolsTarget = exports.PageTarget = exports.CdpTarget = exports.InitializationStatus = void 0;
const Target_js_1 = require("../api/Target.js");
const util_js_1 = require("../common/util.js");
const Deferred_js_1 = require("../util/Deferred.js");
const Page_js_1 = require("./Page.js");
const WebWorker_js_1 = require("./WebWorker.js");
/**
 * @internal
 */
var InitializationStatus;
(function (InitializationStatus) {
    InitializationStatus["SUCCESS"] = "success";
    InitializationStatus["ABORTED"] = "aborted";
})(InitializationStatus || (exports.InitializationStatus = InitializationStatus = {}));
/**
 * @internal
 */
class CdpTarget extends Target_js_1.Target {
    /**
     * To initialize the target for use, call initialize.
     *
     * @internal
     */
    constructor(targetInfo, session, browserContext, targetManager, sessionFactory) {
        super();
        _CdpTarget_browserContext.set(this, void 0);
        _CdpTarget_session.set(this, void 0);
        _CdpTarget_targetInfo.set(this, void 0);
        _CdpTarget_targetManager.set(this, void 0);
        _CdpTarget_sessionFactory.set(this, void 0);
        _CdpTarget_childTargets.set(this, new Set());
        this._initializedDeferred = Deferred_js_1.Deferred.create();
        this._isClosedDeferred = Deferred_js_1.Deferred.create();
        __classPrivateFieldSet(this, _CdpTarget_session, session, "f");
        __classPrivateFieldSet(this, _CdpTarget_targetManager, targetManager, "f");
        __classPrivateFieldSet(this, _CdpTarget_targetInfo, targetInfo, "f");
        __classPrivateFieldSet(this, _CdpTarget_browserContext, browserContext, "f");
        this._targetId = targetInfo.targetId;
        __classPrivateFieldSet(this, _CdpTarget_sessionFactory, sessionFactory, "f");
        if (__classPrivateFieldGet(this, _CdpTarget_session, "f")) {
            __classPrivateFieldGet(this, _CdpTarget_session, "f").setTarget(this);
        }
    }
    async asPage() {
        const session = this._session();
        if (!session) {
            return await this.createCDPSession().then(client => {
                return Page_js_1.CdpPage._create(client, this, null);
            });
        }
        return await Page_js_1.CdpPage._create(session, this, null);
    }
    _subtype() {
        return __classPrivateFieldGet(this, _CdpTarget_targetInfo, "f").subtype;
    }
    _session() {
        return __classPrivateFieldGet(this, _CdpTarget_session, "f");
    }
    _addChildTarget(target) {
        __classPrivateFieldGet(this, _CdpTarget_childTargets, "f").add(target);
    }
    _removeChildTarget(target) {
        __classPrivateFieldGet(this, _CdpTarget_childTargets, "f").delete(target);
    }
    _childTargets() {
        return __classPrivateFieldGet(this, _CdpTarget_childTargets, "f");
    }
    _sessionFactory() {
        if (!__classPrivateFieldGet(this, _CdpTarget_sessionFactory, "f")) {
            throw new Error('sessionFactory is not initialized');
        }
        return __classPrivateFieldGet(this, _CdpTarget_sessionFactory, "f");
    }
    createCDPSession() {
        if (!__classPrivateFieldGet(this, _CdpTarget_sessionFactory, "f")) {
            throw new Error('sessionFactory is not initialized');
        }
        return __classPrivateFieldGet(this, _CdpTarget_sessionFactory, "f").call(this, false).then(session => {
            session.setTarget(this);
            return session;
        });
    }
    url() {
        return __classPrivateFieldGet(this, _CdpTarget_targetInfo, "f").url;
    }
    type() {
        const type = __classPrivateFieldGet(this, _CdpTarget_targetInfo, "f").type;
        switch (type) {
            case 'page':
                return Target_js_1.TargetType.PAGE;
            case 'background_page':
                return Target_js_1.TargetType.BACKGROUND_PAGE;
            case 'service_worker':
                return Target_js_1.TargetType.SERVICE_WORKER;
            case 'shared_worker':
                return Target_js_1.TargetType.SHARED_WORKER;
            case 'browser':
                return Target_js_1.TargetType.BROWSER;
            case 'webview':
                return Target_js_1.TargetType.WEBVIEW;
            case 'tab':
                return Target_js_1.TargetType.TAB;
            default:
                return Target_js_1.TargetType.OTHER;
        }
    }
    _targetManager() {
        if (!__classPrivateFieldGet(this, _CdpTarget_targetManager, "f")) {
            throw new Error('targetManager is not initialized');
        }
        return __classPrivateFieldGet(this, _CdpTarget_targetManager, "f");
    }
    _getTargetInfo() {
        return __classPrivateFieldGet(this, _CdpTarget_targetInfo, "f");
    }
    browser() {
        if (!__classPrivateFieldGet(this, _CdpTarget_browserContext, "f")) {
            throw new Error('browserContext is not initialized');
        }
        return __classPrivateFieldGet(this, _CdpTarget_browserContext, "f").browser();
    }
    browserContext() {
        if (!__classPrivateFieldGet(this, _CdpTarget_browserContext, "f")) {
            throw new Error('browserContext is not initialized');
        }
        return __classPrivateFieldGet(this, _CdpTarget_browserContext, "f");
    }
    opener() {
        const { openerId } = __classPrivateFieldGet(this, _CdpTarget_targetInfo, "f");
        if (!openerId) {
            return;
        }
        return this.browser()
            .targets()
            .find(target => {
            return target._targetId === openerId;
        });
    }
    _targetInfoChanged(targetInfo) {
        __classPrivateFieldSet(this, _CdpTarget_targetInfo, targetInfo, "f");
        this._checkIfInitialized();
    }
    _initialize() {
        this._initializedDeferred.resolve(InitializationStatus.SUCCESS);
    }
    _isTargetExposed() {
        return this.type() !== Target_js_1.TargetType.TAB && !this._subtype();
    }
    _checkIfInitialized() {
        if (!this._initializedDeferred.resolved()) {
            this._initializedDeferred.resolve(InitializationStatus.SUCCESS);
        }
    }
}
_CdpTarget_browserContext = new WeakMap(), _CdpTarget_session = new WeakMap(), _CdpTarget_targetInfo = new WeakMap(), _CdpTarget_targetManager = new WeakMap(), _CdpTarget_sessionFactory = new WeakMap(), _CdpTarget_childTargets = new WeakMap();
exports.CdpTarget = CdpTarget;
/**
 * @internal
 */
class PageTarget extends CdpTarget {
    constructor(targetInfo, session, browserContext, targetManager, sessionFactory, defaultViewport) {
        super(targetInfo, session, browserContext, targetManager, sessionFactory);
        _PageTarget_defaultViewport.set(this, void 0);
        __classPrivateFieldSet(this, _PageTarget_defaultViewport, defaultViewport ?? undefined, "f");
    }
    _initialize() {
        this._initializedDeferred
            .valueOrThrow()
            .then(async (result) => {
            if (result === InitializationStatus.ABORTED) {
                return;
            }
            const opener = this.opener();
            if (!(opener instanceof PageTarget)) {
                return;
            }
            if (!opener || !opener.pagePromise || this.type() !== 'page') {
                return true;
            }
            const openerPage = await opener.pagePromise;
            if (!openerPage.listenerCount("popup" /* PageEvent.Popup */)) {
                return true;
            }
            const popupPage = await this.page();
            openerPage.emit("popup" /* PageEvent.Popup */, popupPage);
            return true;
        })
            .catch(util_js_1.debugError);
        this._checkIfInitialized();
    }
    async page() {
        if (!this.pagePromise) {
            const session = this._session();
            this.pagePromise = (session
                ? Promise.resolve(session)
                : this._sessionFactory()(/* isAutoAttachEmulated=*/ false)).then(client => {
                return Page_js_1.CdpPage._create(client, this, __classPrivateFieldGet(this, _PageTarget_defaultViewport, "f") ?? null);
            });
        }
        return (await this.pagePromise) ?? null;
    }
    _checkIfInitialized() {
        if (this._initializedDeferred.resolved()) {
            return;
        }
        if (this._getTargetInfo().url !== '') {
            this._initializedDeferred.resolve(InitializationStatus.SUCCESS);
        }
    }
}
_PageTarget_defaultViewport = new WeakMap();
exports.PageTarget = PageTarget;
/**
 * @internal
 */
class DevToolsTarget extends PageTarget {
}
exports.DevToolsTarget = DevToolsTarget;
/**
 * @internal
 */
class WorkerTarget extends CdpTarget {
    constructor() {
        super(...arguments);
        _WorkerTarget_workerPromise.set(this, void 0);
    }
    async worker() {
        if (!__classPrivateFieldGet(this, _WorkerTarget_workerPromise, "f")) {
            const session = this._session();
            // TODO(einbinder): Make workers send their console logs.
            __classPrivateFieldSet(this, _WorkerTarget_workerPromise, (session
                ? Promise.resolve(session)
                : this._sessionFactory()(/* isAutoAttachEmulated=*/ false)).then(client => {
                return new WebWorker_js_1.CdpWebWorker(client, this._getTargetInfo().url, this._targetId, this.type(), () => { } /* consoleAPICalled */, () => { } /* exceptionThrown */, undefined /* networkManager */);
            }), "f");
        }
        return await __classPrivateFieldGet(this, _WorkerTarget_workerPromise, "f");
    }
}
_WorkerTarget_workerPromise = new WeakMap();
exports.WorkerTarget = WorkerTarget;
/**
 * @internal
 */
class OtherTarget extends CdpTarget {
}
exports.OtherTarget = OtherTarget;
//# sourceMappingURL=Target.js.map