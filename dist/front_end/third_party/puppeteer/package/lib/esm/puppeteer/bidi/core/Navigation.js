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
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { EventEmitter } from '../../common/EventEmitter.js';
import { inertIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
/**
 * @internal
 */
let Navigation = (() => {
    var _Navigation_instances, _b, _Navigation_request, _Navigation_navigation, _Navigation_browsingContext, _Navigation_disposables, _Navigation_id, _Navigation_initialize, _Navigation_matches, _Navigation_session_get;
    var _a;
    let _classSuper = EventEmitter;
    let _instanceExtraInitializers = [];
    let _dispose_decorators;
    return _b = class Navigation extends _classSuper {
            static from(context) {
                const navigation = new _b(context);
                __classPrivateFieldGet(navigation, _Navigation_instances, "m", _Navigation_initialize).call(navigation);
                return navigation;
            }
            constructor(context) {
                super();
                _Navigation_instances.add(this);
                _Navigation_request.set(this, __runInitializers(this, _instanceExtraInitializers));
                _Navigation_navigation.set(this, void 0);
                _Navigation_browsingContext.set(this, void 0);
                _Navigation_disposables.set(this, new DisposableStack());
                _Navigation_id.set(this, void 0);
                __classPrivateFieldSet(this, _Navigation_browsingContext, context, "f");
            }
            get disposed() {
                return __classPrivateFieldGet(this, _Navigation_disposables, "f").disposed;
            }
            get request() {
                return __classPrivateFieldGet(this, _Navigation_request, "f");
            }
            get navigation() {
                return __classPrivateFieldGet(this, _Navigation_navigation, "f");
            }
            dispose() {
                this[disposeSymbol]();
            }
            [(_Navigation_request = new WeakMap(), _Navigation_navigation = new WeakMap(), _Navigation_browsingContext = new WeakMap(), _Navigation_disposables = new WeakMap(), _Navigation_id = new WeakMap(), _Navigation_instances = new WeakSet(), _Navigation_initialize = function _Navigation_initialize() {
                const browsingContextEmitter = __classPrivateFieldGet(this, _Navigation_disposables, "f").use(new EventEmitter(__classPrivateFieldGet(this, _Navigation_browsingContext, "f")));
                browsingContextEmitter.once('closed', () => {
                    this.emit('failed', {
                        url: __classPrivateFieldGet(this, _Navigation_browsingContext, "f").url,
                        timestamp: new Date(),
                    });
                    this.dispose();
                });
                browsingContextEmitter.on('request', ({ request }) => {
                    if (request.navigation === undefined ||
                        // If a request with a navigation ID comes in, then the navigation ID is
                        // for this navigation.
                        !__classPrivateFieldGet(this, _Navigation_instances, "m", _Navigation_matches).call(this, request.navigation)) {
                        return;
                    }
                    __classPrivateFieldSet(this, _Navigation_request, request, "f");
                    this.emit('request', request);
                    const requestEmitter = __classPrivateFieldGet(this, _Navigation_disposables, "f").use(new EventEmitter(__classPrivateFieldGet(this, _Navigation_request, "f")));
                    requestEmitter.on('redirect', request => {
                        __classPrivateFieldSet(this, _Navigation_request, request, "f");
                    });
                });
                const sessionEmitter = __classPrivateFieldGet(this, _Navigation_disposables, "f").use(new EventEmitter(__classPrivateFieldGet(this, _Navigation_instances, "a", _Navigation_session_get)));
                sessionEmitter.on('browsingContext.navigationStarted', info => {
                    if (info.context !== __classPrivateFieldGet(this, _Navigation_browsingContext, "f").id ||
                        __classPrivateFieldGet(this, _Navigation_navigation, "f") !== undefined) {
                        return;
                    }
                    __classPrivateFieldSet(this, _Navigation_navigation, _b.from(__classPrivateFieldGet(this, _Navigation_browsingContext, "f")), "f");
                });
                for (const eventName of [
                    'browsingContext.domContentLoaded',
                    'browsingContext.load',
                ]) {
                    sessionEmitter.on(eventName, info => {
                        if (info.context !== __classPrivateFieldGet(this, _Navigation_browsingContext, "f").id ||
                            info.navigation === null ||
                            !__classPrivateFieldGet(this, _Navigation_instances, "m", _Navigation_matches).call(this, info.navigation)) {
                            return;
                        }
                        this.dispose();
                    });
                }
                for (const [eventName, event] of [
                    ['browsingContext.fragmentNavigated', 'fragment'],
                    ['browsingContext.navigationFailed', 'failed'],
                    ['browsingContext.navigationAborted', 'aborted'],
                ]) {
                    sessionEmitter.on(eventName, info => {
                        if (info.context !== __classPrivateFieldGet(this, _Navigation_browsingContext, "f").id ||
                            // Note we don't check if `navigation` is null since `null` means the
                            // fragment navigated.
                            !__classPrivateFieldGet(this, _Navigation_instances, "m", _Navigation_matches).call(this, info.navigation)) {
                            return;
                        }
                        this.emit(event, {
                            url: info.url,
                            timestamp: new Date(info.timestamp),
                        });
                        this.dispose();
                    });
                }
            }, _Navigation_matches = function _Navigation_matches(navigation) {
                if (__classPrivateFieldGet(this, _Navigation_navigation, "f") !== undefined && !__classPrivateFieldGet(this, _Navigation_navigation, "f").disposed) {
                    return false;
                }
                if (__classPrivateFieldGet(this, _Navigation_id, "f") === undefined) {
                    __classPrivateFieldSet(this, _Navigation_id, navigation, "f");
                    return true;
                }
                return __classPrivateFieldGet(this, _Navigation_id, "f") === navigation;
            }, _Navigation_session_get = function _Navigation_session_get() {
                return __classPrivateFieldGet(this, _Navigation_browsingContext, "f").userContext.browser.session;
            }, _dispose_decorators = [inertIfDisposed], disposeSymbol)]() {
                __classPrivateFieldGet(this, _Navigation_disposables, "f").dispose();
                super[disposeSymbol]();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(_b, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: obj => "dispose" in obj, get: obj => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata)
                Object.defineProperty(_b, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _b;
})();
export { Navigation };
//# sourceMappingURL=Navigation.js.map
//# sourceMappingURL=Navigation.js.map