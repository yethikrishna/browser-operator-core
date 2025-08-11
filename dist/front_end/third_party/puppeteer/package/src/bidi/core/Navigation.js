/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var _Navigation_instances, _a, _Navigation_request, _Navigation_navigation, _Navigation_browsingContext, _Navigation_disposables, _Navigation_id, _Navigation_initialize, _Navigation_matches, _Navigation_session_get;
import { EventEmitter } from '../../common/EventEmitter.js';
import { inertIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
/**
 * @internal
 */
export class Navigation extends EventEmitter {
    static from(context) {
        const navigation = new _a(context);
        __classPrivateFieldGet(navigation, _Navigation_instances, "m", _Navigation_initialize).call(navigation);
        return navigation;
    }
    constructor(context) {
        super();
        _Navigation_instances.add(this);
        _Navigation_request.set(this, void 0);
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
            __classPrivateFieldSet(this, _Navigation_navigation, _a.from(__classPrivateFieldGet(this, _Navigation_browsingContext, "f")), "f");
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
    }, disposeSymbol)]() {
        __classPrivateFieldGet(this, _Navigation_disposables, "f").dispose();
        super[disposeSymbol]();
    }
}
_a = Navigation;
__decorate([
    inertIfDisposed,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Navigation.prototype, "dispose", null);
//# sourceMappingURL=Navigation.js.map