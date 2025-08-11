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
var _BidiHTTPResponse_instances, _BidiHTTPResponse_data, _BidiHTTPResponse_request, _BidiHTTPResponse_securityDetails, _BidiHTTPResponse_cdpSupported, _BidiHTTPResponse_initialize;
import { HTTPResponse } from '../api/HTTPResponse.js';
import { UnsupportedOperation } from '../common/Errors.js';
import { SecurityDetails } from '../common/SecurityDetails.js';
import { invokeAtMostOnceForArguments } from '../util/decorators.js';
/**
 * @internal
 */
export class BidiHTTPResponse extends HTTPResponse {
    static from(data, request, cdpSupported) {
        const response = new BidiHTTPResponse(data, request, cdpSupported);
        __classPrivateFieldGet(response, _BidiHTTPResponse_instances, "m", _BidiHTTPResponse_initialize).call(response);
        return response;
    }
    constructor(data, request, cdpSupported) {
        super();
        _BidiHTTPResponse_instances.add(this);
        _BidiHTTPResponse_data.set(this, void 0);
        _BidiHTTPResponse_request.set(this, void 0);
        _BidiHTTPResponse_securityDetails.set(this, void 0);
        _BidiHTTPResponse_cdpSupported.set(this, false);
        __classPrivateFieldSet(this, _BidiHTTPResponse_data, data, "f");
        __classPrivateFieldSet(this, _BidiHTTPResponse_request, request, "f");
        __classPrivateFieldSet(this, _BidiHTTPResponse_cdpSupported, cdpSupported, "f");
        // @ts-expect-error non-standard property.
        const securityDetails = data['goog:securityDetails'];
        if (cdpSupported && securityDetails) {
            __classPrivateFieldSet(this, _BidiHTTPResponse_securityDetails, new SecurityDetails(securityDetails), "f");
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
            throw new UnsupportedOperation();
        }
        return __classPrivateFieldGet(this, _BidiHTTPResponse_securityDetails, "f") ?? null;
    }
    async content() {
        return await __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f").getResponseContent();
    }
}
_BidiHTTPResponse_data = new WeakMap(), _BidiHTTPResponse_request = new WeakMap(), _BidiHTTPResponse_securityDetails = new WeakMap(), _BidiHTTPResponse_cdpSupported = new WeakMap(), _BidiHTTPResponse_instances = new WeakSet(), _BidiHTTPResponse_initialize = function _BidiHTTPResponse_initialize() {
    if (__classPrivateFieldGet(this, _BidiHTTPResponse_data, "f").fromCache) {
        __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f")._fromMemoryCache = true;
        __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f")
            .frame()
            ?.page()
            .trustedEmitter.emit("requestservedfromcache" /* PageEvent.RequestServedFromCache */, __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f"));
    }
    __classPrivateFieldGet(this, _BidiHTTPResponse_request, "f").frame()?.page().trustedEmitter.emit("response" /* PageEvent.Response */, this);
};
__decorate([
    invokeAtMostOnceForArguments,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], BidiHTTPResponse.prototype, "remoteAddress", null);
//# sourceMappingURL=HTTPResponse.js.map