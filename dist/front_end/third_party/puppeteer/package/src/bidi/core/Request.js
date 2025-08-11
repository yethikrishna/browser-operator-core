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
var _Request_instances, _a, _Request_responseContentPromise, _Request_error, _Request_redirect, _Request_response, _Request_browsingContext, _Request_disposables, _Request_event, _Request_initialize, _Request_session_get;
import { ProtocolError } from '../../common/Errors.js';
import { EventEmitter } from '../../common/EventEmitter.js';
import { inertIfDisposed } from '../../util/decorators.js';
import { DisposableStack, disposeSymbol } from '../../util/disposable.js';
import { stringToTypedArray } from '../../util/encoding.js';
/**
 * @internal
 */
export class Request extends EventEmitter {
    static from(browsingContext, event) {
        const request = new _a(browsingContext, event);
        __classPrivateFieldGet(request, _Request_instances, "m", _Request_initialize).call(request);
        return request;
    }
    constructor(browsingContext, event) {
        super();
        _Request_instances.add(this);
        _Request_responseContentPromise.set(this, null);
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
                        dataType: Bidi.Network.DataType.Response,
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
            __classPrivateFieldSet(this, _Request_redirect, _a.from(__classPrivateFieldGet(this, _Request_browsingContext, "f"), event), "f");
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
    }, disposeSymbol)]() {
        __classPrivateFieldGet(this, _Request_disposables, "f").dispose();
        super[disposeSymbol]();
    }
    timing() {
        return __classPrivateFieldGet(this, _Request_event, "f").request.timings;
    }
}
_a = Request;
__decorate([
    inertIfDisposed,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Request.prototype, "dispose", null);
//# sourceMappingURL=Request.js.map