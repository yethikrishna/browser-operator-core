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
var _UserPrompt_instances, _UserPrompt_reason, _UserPrompt_result, _UserPrompt_disposables, _UserPrompt_initialize, _UserPrompt_session_get;
import { EventEmitter } from '../../common/EventEmitter.js';
import { inertIfDisposed, throwIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
/**
 * @internal
 */
export class UserPrompt extends EventEmitter {
    static from(browsingContext, info) {
        const userPrompt = new UserPrompt(browsingContext, info);
        __classPrivateFieldGet(userPrompt, _UserPrompt_instances, "m", _UserPrompt_initialize).call(userPrompt);
        return userPrompt;
    }
    constructor(context, info) {
        super();
        _UserPrompt_instances.add(this);
        _UserPrompt_reason.set(this, void 0);
        _UserPrompt_result.set(this, void 0);
        _UserPrompt_disposables.set(this, new DisposableStack());
        this.browsingContext = context;
        this.info = info;
    }
    get closed() {
        return __classPrivateFieldGet(this, _UserPrompt_reason, "f") !== undefined;
    }
    get disposed() {
        return this.closed;
    }
    get handled() {
        if (this.info.handler === "accept" /* Bidi.Session.UserPromptHandlerType.Accept */ ||
            this.info.handler === "dismiss" /* Bidi.Session.UserPromptHandlerType.Dismiss */) {
            return true;
        }
        return __classPrivateFieldGet(this, _UserPrompt_result, "f") !== undefined;
    }
    get result() {
        return __classPrivateFieldGet(this, _UserPrompt_result, "f");
    }
    dispose(reason) {
        __classPrivateFieldSet(this, _UserPrompt_reason, reason, "f");
        this[disposeSymbol]();
    }
    async handle(options = {}) {
        await __classPrivateFieldGet(this, _UserPrompt_instances, "a", _UserPrompt_session_get).send('browsingContext.handleUserPrompt', {
            ...options,
            context: this.info.context,
        });
        // SAFETY: `handled` is triggered before the above promise resolved.
        return __classPrivateFieldGet(this, _UserPrompt_result, "f");
    }
    [(_UserPrompt_reason = new WeakMap(), _UserPrompt_result = new WeakMap(), _UserPrompt_disposables = new WeakMap(), _UserPrompt_instances = new WeakSet(), _UserPrompt_initialize = function _UserPrompt_initialize() {
        const browserContextEmitter = __classPrivateFieldGet(this, _UserPrompt_disposables, "f").use(new EventEmitter(this.browsingContext));
        browserContextEmitter.once('closed', ({ reason }) => {
            this.dispose(`User prompt already closed: ${reason}`);
        });
        const sessionEmitter = __classPrivateFieldGet(this, _UserPrompt_disposables, "f").use(new EventEmitter(__classPrivateFieldGet(this, _UserPrompt_instances, "a", _UserPrompt_session_get)));
        sessionEmitter.on('browsingContext.userPromptClosed', parameters => {
            if (parameters.context !== this.browsingContext.id) {
                return;
            }
            __classPrivateFieldSet(this, _UserPrompt_result, parameters, "f");
            this.emit('handled', parameters);
            this.dispose('User prompt already handled.');
        });
    }, _UserPrompt_session_get = function _UserPrompt_session_get() {
        return this.browsingContext.userContext.browser.session;
    }, disposeSymbol)]() {
        __classPrivateFieldSet(this, _UserPrompt_reason, __classPrivateFieldGet(this, _UserPrompt_reason, "f") ?? 'User prompt already closed, probably because the associated browsing context was destroyed.', "f");
        this.emit('closed', { reason: __classPrivateFieldGet(this, _UserPrompt_reason, "f") });
        __classPrivateFieldGet(this, _UserPrompt_disposables, "f").dispose();
        super[disposeSymbol]();
    }
}
(() => {
    __decorate([
        inertIfDisposed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], UserPrompt.prototype, "dispose", null);
    __decorate([
        throwIfDisposed(prompt => {
            // SAFETY: Disposal implies this exists.
            return __classPrivateFieldGet(prompt, _UserPrompt_reason, "f");
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], UserPrompt.prototype, "handle", null);
})();
//# sourceMappingURL=UserPrompt.js.map