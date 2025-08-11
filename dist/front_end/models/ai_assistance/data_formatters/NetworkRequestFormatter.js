// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _NetworkRequestFormatter_instances, _a, _NetworkRequestFormatter_request, _NetworkRequestFormatter_formatRequestInitiated;
import * as i18n from '../../../core/i18n/i18n.js';
import * as Network from '../../../panels/network/network.js';
import * as Logs from '../../logs/logs.js';
const MAX_HEADERS_SIZE = 1000;
/**
 * Sanitizes the set of headers, removing values that are not on the allow-list and replacing them with '<redacted>'.
 */
function sanitizeHeaders(headers) {
    return headers.map(header => {
        if (NetworkRequestFormatter.allowHeader(header.name)) {
            return header;
        }
        return { name: header.name, value: '<redacted>' };
    });
}
export class NetworkRequestFormatter {
    static allowHeader(headerName) {
        return allowedHeaders.has(headerName.toLowerCase().trim());
    }
    static formatHeaders(title, headers, addListPrefixToEachLine) {
        return formatLines(title, sanitizeHeaders(headers).map(header => {
            const prefix = addListPrefixToEachLine ? '- ' : '';
            return prefix + header.name + ': ' + header.value + '\n';
        }), MAX_HEADERS_SIZE);
    }
    static formatInitiatorUrl(initiatorUrl, allowedOrigin) {
        const initiatorOrigin = new URL(initiatorUrl).origin;
        if (initiatorOrigin === allowedOrigin) {
            return initiatorUrl;
        }
        return '<redacted cross-origin initiator URL>';
    }
    constructor(request) {
        _NetworkRequestFormatter_instances.add(this);
        _NetworkRequestFormatter_request.set(this, void 0);
        __classPrivateFieldSet(this, _NetworkRequestFormatter_request, request, "f");
    }
    formatRequestHeaders() {
        return _a.formatHeaders('Request headers:', __classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f").requestHeaders());
    }
    formatResponseHeaders() {
        return _a.formatHeaders('Response headers:', __classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f").responseHeaders);
    }
    /**
     * Note: nothing here should include information from origins other than
     * the request's origin.
     */
    formatNetworkRequest() {
        return `Request: ${__classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f").url()}

${this.formatRequestHeaders()}

${this.formatResponseHeaders()}

Response status: ${__classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f").statusCode} ${__classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f").statusText}

Request timing:\n${this.formatNetworkRequestTiming()}

Request initiator chain:\n${this.formatRequestInitiatorChain()}`;
    }
    /**
     * Note: nothing here should include information from origins other than
     * the request's origin.
     */
    formatRequestInitiatorChain() {
        const allowedOrigin = new URL(__classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f").url()).origin;
        let initiatorChain = '';
        let lineStart = '- URL: ';
        const graph = Logs.NetworkLog.NetworkLog.instance().initiatorGraphForRequest(__classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f"));
        for (const initiator of Array.from(graph.initiators).reverse()) {
            initiatorChain = initiatorChain + lineStart +
                _a.formatInitiatorUrl(initiator.url(), allowedOrigin) + '\n';
            lineStart = '\t' + lineStart;
            if (initiator === __classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f")) {
                initiatorChain =
                    __classPrivateFieldGet(this, _NetworkRequestFormatter_instances, "m", _NetworkRequestFormatter_formatRequestInitiated).call(this, graph.initiated, __classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f"), initiatorChain, lineStart, allowedOrigin);
            }
        }
        return initiatorChain.trim();
    }
    formatNetworkRequestTiming() {
        const calculator = Network.NetworkPanel.NetworkPanel.instance().networkLogView.timeCalculator();
        const results = Network.RequestTimingView.RequestTimingView.calculateRequestTimeRanges(__classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f"), calculator.minimumBoundary());
        function getDuration(name) {
            const result = results.find(r => r.name === name);
            if (!result) {
                return;
            }
            return i18n.TimeUtilities.secondsToString(result.end - result.start, true);
        }
        const labels = [
            {
                label: 'Queued at (timestamp)',
                value: calculator.formatValue(__classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f").issueTime(), 2),
            },
            {
                label: 'Started at (timestamp)',
                value: calculator.formatValue(__classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f").startTime, 2),
            },
            {
                label: 'Queueing (duration)',
                value: getDuration('queueing'),
            },
            {
                label: 'Connection start (stalled) (duration)',
                value: getDuration('blocking'),
            },
            {
                label: 'Request sent (duration)',
                value: getDuration('sending'),
            },
            {
                label: 'Waiting for server response (duration)',
                value: getDuration('waiting'),
            },
            {
                label: 'Content download (duration)',
                value: getDuration('receiving'),
            },
            {
                label: 'Duration (duration)',
                value: getDuration('total'),
            },
        ];
        return labels.filter(label => !!label.value).map(label => `${label.label}: ${label.value}`).join('\n');
    }
}
_a = NetworkRequestFormatter, _NetworkRequestFormatter_request = new WeakMap(), _NetworkRequestFormatter_instances = new WeakSet(), _NetworkRequestFormatter_formatRequestInitiated = function _NetworkRequestFormatter_formatRequestInitiated(initiated, parentRequest, initiatorChain, lineStart, allowedOrigin) {
    const visited = new Set();
    // this.request should be already in the tree when build initiator part
    visited.add(__classPrivateFieldGet(this, _NetworkRequestFormatter_request, "f"));
    for (const [keyRequest, initiatedRequest] of initiated.entries()) {
        if (initiatedRequest === parentRequest) {
            if (!visited.has(keyRequest)) {
                visited.add(keyRequest);
                initiatorChain = initiatorChain + lineStart +
                    _a.formatInitiatorUrl(keyRequest.url(), allowedOrigin) + '\n';
                initiatorChain =
                    __classPrivateFieldGet(this, _NetworkRequestFormatter_instances, "m", _NetworkRequestFormatter_formatRequestInitiated).call(this, initiated, keyRequest, initiatorChain, '\t' + lineStart, allowedOrigin);
            }
        }
    }
    return initiatorChain;
};
// Header names that could be included in the prompt, lowercase.
const allowedHeaders = new Set([
    ':authority',
    ':method',
    ':path',
    ':scheme',
    'a-im',
    'accept-ch',
    'accept-charset',
    'accept-datetime',
    'accept-encoding',
    'accept-language',
    'accept-patch',
    'accept-ranges',
    'accept',
    'access-control-allow-credentials',
    'access-control-allow-headers',
    'access-control-allow-methods',
    'access-control-allow-origin',
    'access-control-expose-headers',
    'access-control-max-age',
    'access-control-request-headers',
    'access-control-request-method',
    'age',
    'allow',
    'alt-svc',
    'cache-control',
    'connection',
    'content-disposition',
    'content-encoding',
    'content-language',
    'content-location',
    'content-range',
    'content-security-policy',
    'content-type',
    'correlation-id',
    'date',
    'delta-base',
    'dnt',
    'expect-ct',
    'expect',
    'expires',
    'forwarded',
    'front-end-https',
    'host',
    'http2-settings',
    'if-modified-since',
    'if-range',
    'if-unmodified-source',
    'im',
    'last-modified',
    'link',
    'location',
    'max-forwards',
    'nel',
    'origin',
    'permissions-policy',
    'pragma',
    'preference-applied',
    'proxy-connection',
    'public-key-pins',
    'range',
    'referer',
    'refresh',
    'report-to',
    'retry-after',
    'save-data',
    'sec-gpc',
    'server',
    'status',
    'strict-transport-security',
    'te',
    'timing-allow-origin',
    'tk',
    'trailer',
    'transfer-encoding',
    'upgrade-insecure-requests',
    'upgrade',
    'user-agent',
    'vary',
    'via',
    'warning',
    'www-authenticate',
    'x-att-deviceid',
    'x-content-duration',
    'x-content-security-policy',
    'x-content-type-options',
    'x-correlation-id',
    'x-forwarded-for',
    'x-forwarded-host',
    'x-forwarded-proto',
    'x-frame-options',
    'x-http-method-override',
    'x-powered-by',
    'x-redirected-by',
    'x-request-id',
    'x-requested-with',
    'x-ua-compatible',
    'x-wap-profile',
    'x-webkit-csp',
    'x-xss-protection',
]);
function formatLines(title, lines, maxLength) {
    let result = '';
    for (const line of lines) {
        if (result.length + line.length > maxLength) {
            break;
        }
        result += line;
    }
    result = result.trim();
    return result && title ? title + '\n' + result : result;
}
//# sourceMappingURL=NetworkRequestFormatter.js.map