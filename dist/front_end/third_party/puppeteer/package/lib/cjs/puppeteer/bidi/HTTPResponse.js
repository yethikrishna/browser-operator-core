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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidiHTTPResponse = void 0;
const HTTPResponse_js_1 = require("../api/HTTPResponse.js");
const Errors_js_1 = require("../common/Errors.js");
const SecurityDetails_js_1 = require("../common/SecurityDetails.js");
const decorators_js_1 = require("../util/decorators.js");
/**
 * @internal
 */
let BidiHTTPResponse = (() => {
    var _BidiHTTPResponse_instances, _a, _BidiHTTPResponse_data, _BidiHTTPResponse_request, _BidiHTTPResponse_securityDetails, _BidiHTTPResponse_cdpSupported, _BidiHTTPResponse_initialize;
    let _classSuper = HTTPResponse_js_1.HTTPResponse;
    let _instanceExtraInitializers = [];
    let _remoteAddress_decorators;
    return _a = class BidiHTTPResponse extends _classSuper {
            static from(data, request, cdpSupported) {
                const response = new _a(data, request, cdpSupported);
                __classPrivateFieldGet(response, _BidiHTTPResponse_instances, "m", _BidiHTTPResponse_initialize).call(response);
                return response;
            }
            constructor(data, request, cdpSupported) {
                super();
                _BidiHTTPResponse_instances.add(this);
                _BidiHTTPResponse_data.set(this, __runInitializers(this, _instanceExtraInitializers));
                _BidiHTTPResponse_request.set(this, void 0);
                _BidiHTTPResponse_securityDetails.set(this, void 0);
                _BidiHTTPResponse_cdpSupported.set(this, false);
                __classPrivateFieldSet(this, _BidiHTTPResponse_data, data, "f");
                __classPrivateFieldSet(this, _BidiHTTPResponse_request, request, "f");
                __classPrivateFieldSet(this, _BidiHTTPResponse_cdpSupported, cdpSupported, "f");
                // @ts-expect-error non-standard property.
                const securityDetails = data['goog:securityDetails'];
                if (cdpSupported && securityDetails) {
                    __classPrivateFieldSet(this, _BidiHTTPResponse_securityDetails, new SecurityDetails_js_1.SecurityDetails(securityDetails), "f");
                }
            }
            remoteAddress() {
                return {
                    ip: '',
                    port: -1,
                };
            }
            url() {
                return __classPrivateFieldGet(this, _BidiHTTPResponse_data, "f").url;
            }
            status() {
                return __classPrivateFieldGet(this, _BidiHTTPResponse_data, "f").status;
            }
            statusText() {
                return __classPrivateFieldGet(this, _BidiHTTPResponse_data, "f").statusText;
            }
            headers() {
                const headers = {};
                for (const header of __classPrivateFieldGet(this, _BidiHTTPResponse_data, "f").headers) {
                    // TODO: How to handle Binary Headers
                    // https://w3c.github.io/webdriver-bidi/#type-network-Header
                    if (header.value.type === 'string') {
                        headers[header.name.toLowerCase()] = header.value.value;
                    }
                }
                return headers;
            }
            request() {
                return __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f");
            }
            fromCache() {
                return __classPrivateFieldGet(this, _BidiHTTPResponse_data, "f").fromCache;
            }
            timing() {
                const bidiTiming = __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f").timing();
                return {
                    requestTime: bidiTiming.requestTime,
                    proxyStart: -1,
                    proxyEnd: -1,
                    dnsStart: bidiTiming.dnsStart,
                    dnsEnd: bidiTiming.dnsEnd,
                    connectStart: bidiTiming.connectStart,
                    connectEnd: bidiTiming.connectEnd,
                    sslStart: bidiTiming.tlsStart,
                    sslEnd: -1,
                    workerStart: -1,
                    workerReady: -1,
                    workerFetchStart: -1,
                    workerRespondWithSettled: -1,
                    workerRouterEvaluationStart: -1,
                    workerCacheLookupStart: -1,
                    sendStart: bidiTiming.requestStart,
                    sendEnd: -1,
                    pushStart: -1,
                    pushEnd: -1,
                    receiveHeadersStart: bidiTiming.responseStart,
                    receiveHeadersEnd: bidiTiming.responseEnd,
                };
            }
            frame() {
                return __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f").frame();
            }
            fromServiceWorker() {
                return false;
            }
            securityDetails() {
                if (!__classPrivateFieldGet(this, _BidiHTTPResponse_cdpSupported, "f")) {
                    throw new Errors_js_1.UnsupportedOperation();
                }
                return __classPrivateFieldGet(this, _BidiHTTPResponse_securityDetails, "f") ?? null;
            }
            async content() {
                return await __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f").getResponseContent();
            }
        },
        _BidiHTTPResponse_data = new WeakMap(),
        _BidiHTTPResponse_request = new WeakMap(),
        _BidiHTTPResponse_securityDetails = new WeakMap(),
        _BidiHTTPResponse_cdpSupported = new WeakMap(),
        _BidiHTTPResponse_instances = new WeakSet(),
        _BidiHTTPResponse_initialize = function _BidiHTTPResponse_initialize() {
            if (__classPrivateFieldGet(this, _BidiHTTPResponse_data, "f").fromCache) {
                __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f")._fromMemoryCache = true;
                __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f")
                    .frame()
                    ?.page()
                    .trustedEmitter.emit("requestservedfromcache" /* PageEvent.RequestServedFromCache */, __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f"));
            }
            __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f").frame()?.page().trustedEmitter.emit("response" /* PageEvent.Response */, this);
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _remoteAddress_decorators = [decorators_js_1.invokeAtMostOnceForArguments];
            __esDecorate(_a, null, _remoteAddress_decorators, { kind: "method", name: "remoteAddress", static: false, private: false, access: { has: obj => "remoteAddress" in obj, get: obj => obj.remoteAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata)
                Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BidiHTTPResponse = BidiHTTPResponse;
//# sourceMappingURL=HTTPResponse.js.map