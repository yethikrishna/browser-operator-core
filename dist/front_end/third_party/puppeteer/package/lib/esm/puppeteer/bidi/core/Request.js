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
import { ProtocolError } from '../../common/Errors.js';
import { EventEmitter } from '../../common/EventEmitter.js';
import { inertIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
import { stringToTypedArray } from '../../util/encoding.js';
/**
 * @internal
 */
let Request = (() => {
    var _Request_instances, _b, _Request_responseContentPromise, _Request_error, _Request_redirect, _Request_response, _Request_browsingContext, _Request_disposables, _Request_event, _Request_initialize, _Request_session_get;
    var _a;
    let _classSuper = EventEmitter;
    let _instanceExtraInitializers = [];
    let _dispose_decorators;
    return _b = class Request extends _classSuper {
            static from(browsingContext, event) {
                const request = new _b(browsingContext, event);
                __classPrivateFieldGet(request, _Request_instances, "m", _Request_initialize).call(request);
                return request;
            }
            constructor(browsingContext, event) {
                super();
                _Request_instances.add(this);
                _Request_responseContentPromise.set(this, (__runInitializers(this, _instanceExtraInitializers), null));
                _Request_error.set(this, void 0);
                _Request_redirect.set(this, void 0);
                _Request_response.set(this, void 0);
                _Request_browsingContext.set(this, void 0);
                _Request_disposables.set(this, new DisposableStack());
                _Request_event.set(this, void 0);
                __classPrivateFieldSet(this, _Request_browsingContext, browsingContext, "f");
                __classPrivateFieldSet(this, _Request_event, event, "f");
            }
            get disposed() {
                return __classPrivateFieldGet(this, _Request_disposables, "f").disposed;
            }
            get error() {
                return __classPrivateFieldGet(this, _Request_error, "f");
            }
            get headers() {
                return __classPrivateFieldGet(this, _Request_event, "f").request.headers;
            }
            get id() {
                return __classPrivateFieldGet(this, _Request_event, "f").request.request;
            }
            get initiator() {
                return __classPrivateFieldGet(this, _Request_event, "f").initiator;
            }
            get method() {
                return __classPrivateFieldGet(this, _Request_event, "f").request.method;
            }
            get navigation() {
                return __classPrivateFieldGet(this, _Request_event, "f").navigation ?? undefined;
            }
            get redirect() {
                return __classPrivateFieldGet(this, _Request_redirect, "f");
            }
            get lastRedirect() {
                let redirect = __classPrivateFieldGet(this, _Request_redirect, "f");
                while (redirect) {
                    if (redirect && !__classPrivateFieldGet(redirect, _Request_redirect, "f")) {
                        return redirect;
                    }
                    redirect = __classPrivateFieldGet(redirect, _Request_redirect, "f");
                }
                return redirect;
            }
            get response() {
                return __classPrivateFieldGet(this, _Request_response, "f");
            }
            get url() {
                return __classPrivateFieldGet(this, _Request_event, "f").request.url;
            }
            get isBlocked() {
                return __classPrivateFieldGet(this, _Request_event, "f").isBlocked;
            }
            get resourceType() {
                // @ts-expect-error non-standard attribute.
                return __classPrivateFieldGet(this, _Request_event, "f").request['goog:resourceType'] ?? undefined;
            }
            get postData() {
                // @ts-expect-error non-standard attribute.
                return __classPrivateFieldGet(this, _Request_event, "f").request['goog:postData'] ?? undefined;
            }
            get hasPostData() {
                // @ts-expect-error non-standard attribute.
                return __classPrivateFieldGet(this, _Request_event, "f").request['goog:hasPostData'] ?? false;
            }
            async continueRequest({ url, method, headers, cookies, body, }) {
                await __classPrivateFieldGet(this, _Request_instances, "a", _Request_session_get).send('network.continueRequest', {
                    request: this.id,
                    url,
                    method,
                    headers,
                    body,
                    cookies,
                });
            }
            async failRequest() {
                await __classPrivateFieldGet(this, _Request_instances, "a", _Request_session_get).send('network.failRequest', {
                    request: this.id,
                });
            }
            async provideResponse({ statusCode, reasonPhrase, headers, body, }) {
                await __classPrivateFieldGet(this, _Request_instances, "a", _Request_session_get).send('network.provideResponse', {
                    request: this.id,
                    statusCode,
                    reasonPhrase,
                    headers,
                    body,
                });
            }
            async getResponseContent() {
                if (!__classPrivateFieldGet(this, _Request_responseContentPromise, "f")) {
                    __classPrivateFieldSet(this, _Request_responseContentPromise, (async () => {
                        try {
                            const data = await __classPrivateFieldGet(this, _Request_instances, "a", _Request_session_get).send('network.getData', {
                                dataType: "response" /* Bidi.Network.DataType.Response */,
                                request: this.id,
                            });
                            return stringToTypedArray(data.result.bytes.value, data.result.bytes.type === 'base64');
                        }
                        catch (error) {
                            if (error instanceof ProtocolError &&
                                error.originalMessage.includes('No resource with given identifier found')) {
                                throw new ProtocolError('Could not load body for this request. This might happen if the request is a preflight request.');
                            }
                            throw error;
                        }
                    })(), "f");
                }
                return await __classPrivateFieldGet(this, _Request_responseContentPromise, "f");
            }
            async continueWithAuth(parameters) {
                if (parameters.action === 'provideCredentials') {
                    await __classPrivateFieldGet(this, _Request_instances, "a", _Request_session_get).send('network.continueWithAuth', {
                        request: this.id,
                        action: parameters.action,
                        credentials: parameters.credentials,
                    });
                }
                else {
                    await __classPrivateFieldGet(this, _Request_instances, "a", _Request_session_get).send('network.continueWithAuth', {
                        request: this.id,
                        action: parameters.action,
                    });
                }
            }
            dispose() {
                this[disposeSymbol]();
            }
            [(_Request_responseContentPromise = new WeakMap(), _Request_error = new WeakMap(), _Request_redirect = new WeakMap(), _Request_response = new WeakMap(), _Request_browsingContext = new WeakMap(), _Request_disposables = new WeakMap(), _Request_event = new WeakMap(), _Request_instances = new WeakSet(), _Request_initialize = function _Request_initialize() {
                const browsingContextEmitter = __classPrivateFieldGet(this, _Request_disposables, "f").use(new EventEmitter(__classPrivateFieldGet(this, _Request_browsingContext, "f")));
                browsingContextEmitter.once('closed', ({ reason }) => {
                    __classPrivateFieldSet(this, _Request_error, reason, "f");
                    this.emit('error', __classPrivateFieldGet(this, _Request_error, "f"));
                    this.dispose();
                });
                const sessionEmitter = __classPrivateFieldGet(this, _Request_disposables, "f").use(new EventEmitter(__classPrivateFieldGet(this, _Request_instances, "a", _Request_session_get)));
                sessionEmitter.on('network.beforeRequestSent', event => {
                    if (event.context !== __classPrivateFieldGet(this, _Request_browsingContext, "f").id ||
                        event.request.request !== this.id ||
                        event.redirectCount !== __classPrivateFieldGet(this, _Request_event, "f").redirectCount + 1) {
                        return;
                    }
                    __classPrivateFieldSet(this, _Request_redirect, _b.from(__classPrivateFieldGet(this, _Request_browsingContext, "f"), event), "f");
                    this.emit('redirect', __classPrivateFieldGet(this, _Request_redirect, "f"));
                    this.dispose();
                });
                sessionEmitter.on('network.authRequired', event => {
                    if (event.context !== __classPrivateFieldGet(this, _Request_browsingContext, "f").id ||
                        event.request.request !== this.id ||
                        // Don't try to authenticate for events that are not blocked
                        !event.isBlocked) {
                        return;
                    }
                    this.emit('authenticate', undefined);
                });
                sessionEmitter.on('network.fetchError', event => {
                    if (event.context !== __classPrivateFieldGet(this, _Request_browsingContext, "f").id ||
                        event.request.request !== this.id ||
                        __classPrivateFieldGet(this, _Request_event, "f").redirectCount !== event.redirectCount) {
                        return;
                    }
                    __classPrivateFieldSet(this, _Request_error, event.errorText, "f");
                    this.emit('error', __classPrivateFieldGet(this, _Request_error, "f"));
                    this.dispose();
                });
                sessionEmitter.on('network.responseCompleted', event => {
                    if (event.context !== __classPrivateFieldGet(this, _Request_browsingContext, "f").id ||
                        event.request.request !== this.id ||
                        __classPrivateFieldGet(this, _Request_event, "f").redirectCount !== event.redirectCount) {
                        return;
                    }
                    __classPrivateFieldSet(this, _Request_response, event.response, "f");
                    __classPrivateFieldGet(this, _Request_event, "f").request.timings = event.request.timings;
                    this.emit('success', __classPrivateFieldGet(this, _Request_response, "f"));
                    // In case this is a redirect.
                    if (__classPrivateFieldGet(this, _Request_response, "f").status >= 300 && __classPrivateFieldGet(this, _Request_response, "f").status < 400) {
                        return;
                    }
                    this.dispose();
                });
            }, _Request_session_get = function _Request_session_get() {
                return __classPrivateFieldGet(this, _Request_browsingContext, "f").userContext.browser.session;
            }, _dispose_decorators = [inertIfDisposed], disposeSymbol)]() {
                __classPrivateFieldGet(this, _Request_disposables, "f").dispose();
                super[disposeSymbol]();
            }
            timing() {
                return __classPrivateFieldGet(this, _Request_event, "f").request.timings;
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
export { Request };
//# sourceMappingURL=Request.js.map
//# sourceMappingURL=Request.js.map