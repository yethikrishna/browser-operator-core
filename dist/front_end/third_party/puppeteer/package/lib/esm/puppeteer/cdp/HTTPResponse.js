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
var _CdpHTTPResponse_instances, _CdpHTTPResponse_request, _CdpHTTPResponse_contentPromise, _CdpHTTPResponse_bodyLoadedDeferred, _CdpHTTPResponse_remoteAddress, _CdpHTTPResponse_status, _CdpHTTPResponse_statusText, _CdpHTTPResponse_fromDiskCache, _CdpHTTPResponse_fromServiceWorker, _CdpHTTPResponse_headers, _CdpHTTPResponse_securityDetails, _CdpHTTPResponse_timing, _CdpHTTPResponse_parseStatusTextFromExtraInfo;
import { HTTPResponse } from '../api/HTTPResponse.js';
import { ProtocolError } from '../common/Errors.js';
import { SecurityDetails } from '../common/SecurityDetails.js';
import { Deferred } from '../util/Deferred.js';
import { stringToTypedArray } from '../util/encoding.js';
/**
 * @internal
 */
export class CdpHTTPResponse extends HTTPResponse {
    constructor(request, responsePayload, extraInfo) {
        super();
        _CdpHTTPResponse_instances.add(this);
        _CdpHTTPResponse_request.set(this, void 0);
        _CdpHTTPResponse_contentPromise.set(this, null);
        _CdpHTTPResponse_bodyLoadedDeferred.set(this, Deferred.create());
        _CdpHTTPResponse_remoteAddress.set(this, void 0);
        _CdpHTTPResponse_status.set(this, void 0);
        _CdpHTTPResponse_statusText.set(this, void 0);
        _CdpHTTPResponse_fromDiskCache.set(this, void 0);
        _CdpHTTPResponse_fromServiceWorker.set(this, void 0);
        _CdpHTTPResponse_headers.set(this, {});
        _CdpHTTPResponse_securityDetails.set(this, void 0);
        _CdpHTTPResponse_timing.set(this, void 0);
        __classPrivateFieldSet(this, _CdpHTTPResponse_request, request, "f");
        __classPrivateFieldSet(this, _CdpHTTPResponse_remoteAddress, {
            ip: responsePayload.remoteIPAddress,
            port: responsePayload.remotePort,
        }, "f");
        __classPrivateFieldSet(this, _CdpHTTPResponse_statusText, __classPrivateFieldGet(this, _CdpHTTPResponse_instances, "m", _CdpHTTPResponse_parseStatusTextFromExtraInfo).call(this, extraInfo) ||
            responsePayload.statusText, "f");
        __classPrivateFieldSet(this, _CdpHTTPResponse_fromDiskCache, !!responsePayload.fromDiskCache, "f");
        __classPrivateFieldSet(this, _CdpHTTPResponse_fromServiceWorker, !!responsePayload.fromServiceWorker, "f");
        __classPrivateFieldSet(this, _CdpHTTPResponse_status, extraInfo ? extraInfo.statusCode : responsePayload.status, "f");
        const headers = extraInfo ? extraInfo.headers : responsePayload.headers;
        for (const [key, value] of Object.entries(headers)) {
            __classPrivateFieldGet(this, _CdpHTTPResponse_headers, "f")[key.toLowerCase()] = value;
        }
        __classPrivateFieldSet(this, _CdpHTTPResponse_securityDetails, responsePayload.securityDetails
            ? new SecurityDetails(responsePayload.securityDetails)
            : null, "f");
        __classPrivateFieldSet(this, _CdpHTTPResponse_timing, responsePayload.timing || null, "f");
    }
    _resolveBody(err) {
        if (err) {
            return __classPrivateFieldGet(this, _CdpHTTPResponse_bodyLoadedDeferred, "f").reject(err);
        }
        return __classPrivateFieldGet(this, _CdpHTTPResponse_bodyLoadedDeferred, "f").resolve();
    }
    remoteAddress() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_remoteAddress, "f");
    }
    url() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_request, "f").url();
    }
    status() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_status, "f");
    }
    statusText() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_statusText, "f");
    }
    headers() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_headers, "f");
    }
    securityDetails() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_securityDetails, "f");
    }
    timing() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_timing, "f");
    }
    content() {
        if (!__classPrivateFieldGet(this, _CdpHTTPResponse_contentPromise, "f")) {
            __classPrivateFieldSet(this, _CdpHTTPResponse_contentPromise, __classPrivateFieldGet(this, _CdpHTTPResponse_bodyLoadedDeferred, "f")
                .valueOrThrow()
                .then(async () => {
                try {
                    // Use CDPSession from corresponding request to retrieve body, as it's client
                    // might have been updated (e.g. for an adopted OOPIF).
                    const response = await __classPrivateFieldGet(this, _CdpHTTPResponse_request, "f").client.send('Network.getResponseBody', {
                        requestId: __classPrivateFieldGet(this, _CdpHTTPResponse_request, "f").id,
                    });
                    return stringToTypedArray(response.body, response.base64Encoded);
                }
                catch (error) {
                    if (error instanceof ProtocolError &&
                        error.originalMessage ===
                            'No resource with given identifier found') {
                        throw new ProtocolError('Could not load body for this request. This might happen if the request is a preflight request.');
                    }
                    throw error;
                }
            }), "f");
        }
        return __classPrivateFieldGet(this, _CdpHTTPResponse_contentPromise, "f");
    }
    request() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_request, "f");
    }
    fromCache() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_fromDiskCache, "f") || __classPrivateFieldGet(this, _CdpHTTPResponse_request, "f")._fromMemoryCache;
    }
    fromServiceWorker() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_fromServiceWorker, "f");
    }
    frame() {
        return __classPrivateFieldGet(this, _CdpHTTPResponse_request, "f").frame();
    }
}
_CdpHTTPResponse_request = new WeakMap(), _CdpHTTPResponse_contentPromise = new WeakMap(), _CdpHTTPResponse_bodyLoadedDeferred = new WeakMap(), _CdpHTTPResponse_remoteAddress = new WeakMap(), _CdpHTTPResponse_status = new WeakMap(), _CdpHTTPResponse_statusText = new WeakMap(), _CdpHTTPResponse_fromDiskCache = new WeakMap(), _CdpHTTPResponse_fromServiceWorker = new WeakMap(), _CdpHTTPResponse_headers = new WeakMap(), _CdpHTTPResponse_securityDetails = new WeakMap(), _CdpHTTPResponse_timing = new WeakMap(), _CdpHTTPResponse_instances = new WeakSet(), _CdpHTTPResponse_parseStatusTextFromExtraInfo = function _CdpHTTPResponse_parseStatusTextFromExtraInfo(extraInfo) {
    if (!extraInfo || !extraInfo.headersText) {
        return;
    }
    const firstLine = extraInfo.headersText.split('\r', 1)[0];
    if (!firstLine || firstLine.length > 1000) {
        return;
    }
    const match = firstLine.match(/[^ ]* [^ ]* (.*)/);
    if (!match) {
        return;
    }
    const statusText = match[1];
    if (!statusText) {
        return;
    }
    return statusText;
};
//# sourceMappingURL=HTTPResponse.js.map
//# sourceMappingURL=HTTPResponse.js.map