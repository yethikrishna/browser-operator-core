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
var _TargetManager_instances, _TargetManager_connection, _TargetManager_discoveredTargetsByTargetId, _TargetManager_attachedTargetsByTargetId, _TargetManager_attachedTargetsBySessionId, _TargetManager_ignoredTargets, _TargetManager_targetFilterCallback, _TargetManager_targetFactory, _TargetManager_attachedToTargetListenersBySession, _TargetManager_detachedFromTargetListenersBySession, _TargetManager_initializeDeferred, _TargetManager_targetsIdsForInit, _TargetManager_waitForInitiallyDiscoveredTargets, _TargetManager_discoveryFilter, _TargetManager_storeExistingTargetsForInit, _TargetManager_setupAttachmentListeners, _TargetManager_removeAttachmentListeners, _TargetManager_onSessionDetached, _TargetManager_onTargetCreated, _TargetManager_onTargetDestroyed, _TargetManager_onTargetInfoChanged, _TargetManager_onAttachedToTarget, _TargetManager_finishInitializationIfReady, _TargetManager_onDetachedFromTarget;
/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { CDPSession, CDPSessionEvent } from '../api/CDPSession.js';
import { EventEmitter } from '../common/EventEmitter.js';
import { debugError } from '../common/util.js';
import { assert } from '../util/assert.js';
import { Deferred } from '../util/Deferred.js';
import { CdpCDPSession } from './CdpSession.js';
import { CdpTarget, InitializationStatus } from './Target.js';
function isPageTargetBecomingPrimary(target, newTargetInfo) {
    return Boolean(target._subtype()) && !newTargetInfo.subtype;
}
/**
 * TargetManager encapsulates all interactions with CDP targets and is
 * responsible for coordinating the configuration of targets with the rest of
 * Puppeteer. Code outside of this class should not subscribe `Target.*` events
 * and only use the TargetManager events.
 *
 * TargetManager uses the CDP's auto-attach mechanism to intercept
 * new targets and allow the rest of Puppeteer to configure listeners while
 * the target is paused.
 *
 * @internal
 */
export class TargetManager extends EventEmitter {
    constructor(connection, targetFactory, targetFilterCallback, waitForInitiallyDiscoveredTargets = true) {
        super();
        _TargetManager_instances.add(this);
        _TargetManager_connection.set(this, void 0);
        /**
         * Keeps track of the following events: 'Target.targetCreated',
         * 'Target.targetDestroyed', 'Target.targetInfoChanged'.
         *
         * A target becomes discovered when 'Target.targetCreated' is received.
         * A target is removed from this map once 'Target.targetDestroyed' is
         * received.
         *
         * `targetFilterCallback` has no effect on this map.
         */
        _TargetManager_discoveredTargetsByTargetId.set(this, new Map());
        /**
         * A target is added to this map once TargetManager has created
         * a Target and attached at least once to it.
         */
        _TargetManager_attachedTargetsByTargetId.set(this, new Map());
        /**
         * Tracks which sessions attach to which target.
         */
        _TargetManager_attachedTargetsBySessionId.set(this, new Map());
        /**
         * If a target was filtered out by `targetFilterCallback`, we still receive
         * events about it from CDP, but we don't forward them to the rest of Puppeteer.
         */
        _TargetManager_ignoredTargets.set(this, new Set());
        _TargetManager_targetFilterCallback.set(this, void 0);
        _TargetManager_targetFactory.set(this, void 0);
        _TargetManager_attachedToTargetListenersBySession.set(this, new WeakMap());
        _TargetManager_detachedFromTargetListenersBySession.set(this, new WeakMap());
        _TargetManager_initializeDeferred.set(this, Deferred.create());
        _TargetManager_targetsIdsForInit.set(this, new Set());
        _TargetManager_waitForInitiallyDiscoveredTargets.set(this, true);
        _TargetManager_discoveryFilter.set(this, [{}]);
        _TargetManager_storeExistingTargetsForInit.set(this, () => {
            if (!__classPrivateFieldGet(this, _TargetManager_waitForInitiallyDiscoveredTargets, "f")) {
                return;
            }
            for (const [targetId, targetInfo,] of __classPrivateFieldGet(this, _TargetManager_discoveredTargetsByTargetId, "f").entries()) {
                const targetForFilter = new CdpTarget(targetInfo, undefined, undefined, this, undefined);
                // Only wait for pages and frames (except those from extensions)
                // to auto-attach.
                const isPageOrFrame = targetInfo.type === 'page' || targetInfo.type === 'iframe';
                const isExtension = targetInfo.url.startsWith('chrome-extension://');
                if ((!__classPrivateFieldGet(this, _TargetManager_targetFilterCallback, "f") ||
                    __classPrivateFieldGet(this, _TargetManager_targetFilterCallback, "f").call(this, targetForFilter)) &&
                    isPageOrFrame &&
                    !isExtension) {
                    __classPrivateFieldGet(this, _TargetManager_targetsIdsForInit, "f").add(targetId);
                }
            }
        });
        _TargetManager_onSessionDetached.set(this, (session) => {
            __classPrivateFieldGet(this, _TargetManager_instances, "m", _TargetManager_removeAttachmentListeners).call(this, session);
        });
        _TargetManager_onTargetCreated.set(this, async (event) => {
            __classPrivateFieldGet(this, _TargetManager_discoveredTargetsByTargetId, "f").set(event.targetInfo.targetId, event.targetInfo);
            this.emit("targetDiscovered" /* TargetManagerEvent.TargetDiscovered */, event.targetInfo);
            // The connection is already attached to the browser target implicitly,
            // therefore, no new CDPSession is created and we have special handling
            // here.
            if (event.targetInfo.type === 'browser' && event.targetInfo.attached) {
                if (__classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").has(event.targetInfo.targetId)) {
                    return;
                }
                const target = __classPrivateFieldGet(this, _TargetManager_targetFactory, "f").call(this, event.targetInfo, undefined);
                target._initialize();
                __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").set(event.targetInfo.targetId, target);
            }
        });
        _TargetManager_onTargetDestroyed.set(this, (event) => {
            const targetInfo = __classPrivateFieldGet(this, _TargetManager_discoveredTargetsByTargetId, "f").get(event.targetId);
            __classPrivateFieldGet(this, _TargetManager_discoveredTargetsByTargetId, "f").delete(event.targetId);
            __classPrivateFieldGet(this, _TargetManager_instances, "m", _TargetManager_finishInitializationIfReady).call(this, event.targetId);
            if (targetInfo?.type === 'service_worker' &&
                __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").has(event.targetId)) {
                // Special case for service workers: report TargetGone event when
                // the worker is destroyed.
                const target = __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").get(event.targetId);
                if (target) {
                    this.emit("targetGone" /* TargetManagerEvent.TargetGone */, target);
                    __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").delete(event.targetId);
                }
            }
        });
        _TargetManager_onTargetInfoChanged.set(this, (event) => {
            __classPrivateFieldGet(this, _TargetManager_discoveredTargetsByTargetId, "f").set(event.targetInfo.targetId, event.targetInfo);
            if (__classPrivateFieldGet(this, _TargetManager_ignoredTargets, "f").has(event.targetInfo.targetId) ||
                !__classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").has(event.targetInfo.targetId) ||
                !event.targetInfo.attached) {
                return;
            }
            const target = __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").get(event.targetInfo.targetId);
            if (!target) {
                return;
            }
            const previousURL = target.url();
            const wasInitialized = target._initializedDeferred.value() === InitializationStatus.SUCCESS;
            if (isPageTargetBecomingPrimary(target, event.targetInfo)) {
                const session = target?._session();
                assert(session, 'Target that is being activated is missing a CDPSession.');
                session.parentSession()?.emit(CDPSessionEvent.Swapped, session);
            }
            target._targetInfoChanged(event.targetInfo);
            if (wasInitialized && previousURL !== target.url()) {
                this.emit("targetChanged" /* TargetManagerEvent.TargetChanged */, {
                    target,
                    wasInitialized,
                    previousURL,
                });
            }
        });
        _TargetManager_onAttachedToTarget.set(this, async (parentSession, event) => {
            const targetInfo = event.targetInfo;
            const session = __classPrivateFieldGet(this, _TargetManager_connection, "f")._session(event.sessionId);
            if (!session) {
                throw new Error(`Session ${event.sessionId} was not created.`);
            }
            const silentDetach = async () => {
                await session.send('Runtime.runIfWaitingForDebugger').catch(debugError);
                // We don't use `session.detach()` because that dispatches all commands on
                // the connection instead of the parent session.
                await parentSession
                    .send('Target.detachFromTarget', {
                    sessionId: session.id(),
                })
                    .catch(debugError);
            };
            if (!__classPrivateFieldGet(this, _TargetManager_connection, "f").isAutoAttached(targetInfo.targetId)) {
                return;
            }
            // Special case for service workers: being attached to service workers will
            // prevent them from ever being destroyed. Therefore, we silently detach
            // from service workers unless the connection was manually created via
            // `page.worker()`. To determine this, we use
            // `this.#connection.isAutoAttached(targetInfo.targetId)`. In the future, we
            // should determine if a target is auto-attached or not with the help of
            // CDP.
            if (targetInfo.type === 'service_worker') {
                __classPrivateFieldGet(this, _TargetManager_instances, "m", _TargetManager_finishInitializationIfReady).call(this, targetInfo.targetId);
                await silentDetach();
                if (__classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").has(targetInfo.targetId)) {
                    return;
                }
                const target = __classPrivateFieldGet(this, _TargetManager_targetFactory, "f").call(this, targetInfo);
                target._initialize();
                __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").set(targetInfo.targetId, target);
                this.emit("targetAvailable" /* TargetManagerEvent.TargetAvailable */, target);
                return;
            }
            const isExistingTarget = __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").has(targetInfo.targetId);
            const target = isExistingTarget
                ? __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").get(targetInfo.targetId)
                : __classPrivateFieldGet(this, _TargetManager_targetFactory, "f").call(this, targetInfo, session, parentSession instanceof CdpCDPSession ? parentSession : undefined);
            if (__classPrivateFieldGet(this, _TargetManager_targetFilterCallback, "f") && !__classPrivateFieldGet(this, _TargetManager_targetFilterCallback, "f").call(this, target)) {
                __classPrivateFieldGet(this, _TargetManager_ignoredTargets, "f").add(targetInfo.targetId);
                __classPrivateFieldGet(this, _TargetManager_instances, "m", _TargetManager_finishInitializationIfReady).call(this, targetInfo.targetId);
                await silentDetach();
                return;
            }
            __classPrivateFieldGet(this, _TargetManager_instances, "m", _TargetManager_setupAttachmentListeners).call(this, session);
            if (isExistingTarget) {
                session.setTarget(target);
                __classPrivateFieldGet(this, _TargetManager_attachedTargetsBySessionId, "f").set(session.id(), __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").get(targetInfo.targetId));
            }
            else {
                target._initialize();
                __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").set(targetInfo.targetId, target);
                __classPrivateFieldGet(this, _TargetManager_attachedTargetsBySessionId, "f").set(session.id(), target);
            }
            const parentTarget = parentSession instanceof CDPSession
                ? parentSession.target()
                : null;
            parentTarget?._addChildTarget(target);
            parentSession.emit(CDPSessionEvent.Ready, session);
            __classPrivateFieldGet(this, _TargetManager_targetsIdsForInit, "f").delete(target._targetId);
            if (!isExistingTarget) {
                this.emit("targetAvailable" /* TargetManagerEvent.TargetAvailable */, target);
            }
            __classPrivateFieldGet(this, _TargetManager_instances, "m", _TargetManager_finishInitializationIfReady).call(this);
            // TODO: the browser might be shutting down here. What do we do with the
            // error?
            await Promise.all([
                session.send('Target.setAutoAttach', {
                    waitForDebuggerOnStart: true,
                    flatten: true,
                    autoAttach: true,
                    filter: __classPrivateFieldGet(this, _TargetManager_discoveryFilter, "f"),
                }),
                session.send('Runtime.runIfWaitingForDebugger'),
            ]).catch(debugError);
        });
        _TargetManager_onDetachedFromTarget.set(this, (parentSession, event) => {
            const target = __classPrivateFieldGet(this, _TargetManager_attachedTargetsBySessionId, "f").get(event.sessionId);
            __classPrivateFieldGet(this, _TargetManager_attachedTargetsBySessionId, "f").delete(event.sessionId);
            if (!target) {
                return;
            }
            if (parentSession instanceof CDPSession) {
                parentSession.target()._removeChildTarget(target);
            }
            __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f").delete(target._targetId);
            this.emit("targetGone" /* TargetManagerEvent.TargetGone */, target);
        });
        __classPrivateFieldSet(this, _TargetManager_connection, connection, "f");
        __classPrivateFieldSet(this, _TargetManager_targetFilterCallback, targetFilterCallback, "f");
        __classPrivateFieldSet(this, _TargetManager_targetFactory, targetFactory, "f");
        __classPrivateFieldSet(this, _TargetManager_waitForInitiallyDiscoveredTargets, waitForInitiallyDiscoveredTargets, "f");
        __classPrivateFieldGet(this, _TargetManager_connection, "f").on('Target.targetCreated', __classPrivateFieldGet(this, _TargetManager_onTargetCreated, "f"));
        __classPrivateFieldGet(this, _TargetManager_connection, "f").on('Target.targetDestroyed', __classPrivateFieldGet(this, _TargetManager_onTargetDestroyed, "f"));
        __classPrivateFieldGet(this, _TargetManager_connection, "f").on('Target.targetInfoChanged', __classPrivateFieldGet(this, _TargetManager_onTargetInfoChanged, "f"));
        __classPrivateFieldGet(this, _TargetManager_connection, "f").on(CDPSessionEvent.SessionDetached, __classPrivateFieldGet(this, _TargetManager_onSessionDetached, "f"));
        __classPrivateFieldGet(this, _TargetManager_instances, "m", _TargetManager_setupAttachmentListeners).call(this, __classPrivateFieldGet(this, _TargetManager_connection, "f"));
    }
    async initialize() {
        await __classPrivateFieldGet(this, _TargetManager_connection, "f").send('Target.setDiscoverTargets', {
            discover: true,
            filter: __classPrivateFieldGet(this, _TargetManager_discoveryFilter, "f"),
        });
        __classPrivateFieldGet(this, _TargetManager_storeExistingTargetsForInit, "f").call(this);
        await __classPrivateFieldGet(this, _TargetManager_connection, "f").send('Target.setAutoAttach', {
            waitForDebuggerOnStart: true,
            flatten: true,
            autoAttach: true,
            filter: [
                {
                    type: 'page',
                    exclude: true,
                },
                ...__classPrivateFieldGet(this, _TargetManager_discoveryFilter, "f"),
            ],
        });
        __classPrivateFieldGet(this, _TargetManager_instances, "m", _TargetManager_finishInitializationIfReady).call(this);
        await __classPrivateFieldGet(this, _TargetManager_initializeDeferred, "f").valueOrThrow();
    }
    getChildTargets(target) {
        return target._childTargets();
    }
    dispose() {
        __classPrivateFieldGet(this, _TargetManager_connection, "f").off('Target.targetCreated', __classPrivateFieldGet(this, _TargetManager_onTargetCreated, "f"));
        __classPrivateFieldGet(this, _TargetManager_connection, "f").off('Target.targetDestroyed', __classPrivateFieldGet(this, _TargetManager_onTargetDestroyed, "f"));
        __classPrivateFieldGet(this, _TargetManager_connection, "f").off('Target.targetInfoChanged', __classPrivateFieldGet(this, _TargetManager_onTargetInfoChanged, "f"));
        __classPrivateFieldGet(this, _TargetManager_connection, "f").off(CDPSessionEvent.SessionDetached, __classPrivateFieldGet(this, _TargetManager_onSessionDetached, "f"));
        __classPrivateFieldGet(this, _TargetManager_instances, "m", _TargetManager_removeAttachmentListeners).call(this, __classPrivateFieldGet(this, _TargetManager_connection, "f"));
    }
    getAvailableTargets() {
        return __classPrivateFieldGet(this, _TargetManager_attachedTargetsByTargetId, "f");
    }
}
_TargetManager_connection = new WeakMap(), _TargetManager_discoveredTargetsByTargetId = new WeakMap(), _TargetManager_attachedTargetsByTargetId = new WeakMap(), _TargetManager_attachedTargetsBySessionId = new WeakMap(), _TargetManager_ignoredTargets = new WeakMap(), _TargetManager_targetFilterCallback = new WeakMap(), _TargetManager_targetFactory = new WeakMap(), _TargetManager_attachedToTargetListenersBySession = new WeakMap(), _TargetManager_detachedFromTargetListenersBySession = new WeakMap(), _TargetManager_initializeDeferred = new WeakMap(), _TargetManager_targetsIdsForInit = new WeakMap(), _TargetManager_waitForInitiallyDiscoveredTargets = new WeakMap(), _TargetManager_discoveryFilter = new WeakMap(), _TargetManager_storeExistingTargetsForInit = new WeakMap(), _TargetManager_onSessionDetached = new WeakMap(), _TargetManager_onTargetCreated = new WeakMap(), _TargetManager_onTargetDestroyed = new WeakMap(), _TargetManager_onTargetInfoChanged = new WeakMap(), _TargetManager_onAttachedToTarget = new WeakMap(), _TargetManager_onDetachedFromTarget = new WeakMap(), _TargetManager_instances = new WeakSet(), _TargetManager_setupAttachmentListeners = function _TargetManager_setupAttachmentListeners(session) {
    const listener = (event) => {
        void __classPrivateFieldGet(this, _TargetManager_onAttachedToTarget, "f").call(this, session, event);
    };
    assert(!__classPrivateFieldGet(this, _TargetManager_attachedToTargetListenersBySession, "f").has(session));
    __classPrivateFieldGet(this, _TargetManager_attachedToTargetListenersBySession, "f").set(session, listener);
    session.on('Target.attachedToTarget', listener);
    const detachedListener = (event) => {
        return __classPrivateFieldGet(this, _TargetManager_onDetachedFromTarget, "f").call(this, session, event);
    };
    assert(!__classPrivateFieldGet(this, _TargetManager_detachedFromTargetListenersBySession, "f").has(session));
    __classPrivateFieldGet(this, _TargetManager_detachedFromTargetListenersBySession, "f").set(session, detachedListener);
    session.on('Target.detachedFromTarget', detachedListener);
}, _TargetManager_removeAttachmentListeners = function _TargetManager_removeAttachmentListeners(session) {
    const listener = __classPrivateFieldGet(this, _TargetManager_attachedToTargetListenersBySession, "f").get(session);
    if (listener) {
        session.off('Target.attachedToTarget', listener);
        __classPrivateFieldGet(this, _TargetManager_attachedToTargetListenersBySession, "f").delete(session);
    }
    if (__classPrivateFieldGet(this, _TargetManager_detachedFromTargetListenersBySession, "f").has(session)) {
        session.off('Target.detachedFromTarget', __classPrivateFieldGet(this, _TargetManager_detachedFromTargetListenersBySession, "f").get(session));
        __classPrivateFieldGet(this, _TargetManager_detachedFromTargetListenersBySession, "f").delete(session);
    }
}, _TargetManager_finishInitializationIfReady = function _TargetManager_finishInitializationIfReady(targetId) {
    if (targetId !== undefined) {
        __classPrivateFieldGet(this, _TargetManager_targetsIdsForInit, "f").delete(targetId);
    }
    if (__classPrivateFieldGet(this, _TargetManager_targetsIdsForInit, "f").size === 0) {
        __classPrivateFieldGet(this, _TargetManager_initializeDeferred, "f").resolve();
    }
};
//# sourceMappingURL=TargetManager.js.map
//# sourceMappingURL=TargetManager.js.map