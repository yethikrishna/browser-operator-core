// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _NetworkRequest_instances, _NetworkRequest_requestId, _NetworkRequest_backendRequestId, _NetworkRequest_documentURL, _NetworkRequest_frameId, _NetworkRequest_loaderId, _NetworkRequest_hasUserGesture, _NetworkRequest_initiator, _NetworkRequest_redirectSource, _NetworkRequest_preflightRequest, _NetworkRequest_preflightInitiatorRequest, _NetworkRequest_isRedirect, _NetworkRequest_redirectDestination, _NetworkRequest_issueTime, _NetworkRequest_startTime, _NetworkRequest_endTime, _NetworkRequest_blockedReason, _NetworkRequest_corsErrorStatus, _NetworkRequest_initialPriority, _NetworkRequest_currentPriority, _NetworkRequest_signedExchangeInfo, _NetworkRequest_webBundleInfo, _NetworkRequest_webBundleInnerRequestInfo, _NetworkRequest_resourceType, _NetworkRequest_contentData, _NetworkRequest_streamingContentData, _NetworkRequest_frames, _NetworkRequest_responseHeaderValues, _NetworkRequest_responseHeadersText, _NetworkRequest_originalResponseHeaders, _NetworkRequest_sortedOriginalResponseHeaders, _NetworkRequest_setCookieHeaders, _NetworkRequest_requestHeaders, _NetworkRequest_requestHeaderValues, _NetworkRequest_remoteAddress, _NetworkRequest_remoteAddressSpace, _NetworkRequest_referrerPolicy, _NetworkRequest_securityState, _NetworkRequest_securityDetails, _NetworkRequest_formParametersPromise, _NetworkRequest_requestFormDataPromise, _NetworkRequest_hasExtraRequestInfo, _NetworkRequest_hasExtraResponseInfo, _NetworkRequest_blockedRequestCookies, _NetworkRequest_includedRequestCookies, _NetworkRequest_blockedResponseCookies, _NetworkRequest_exemptedResponseCookies, _NetworkRequest_responseCookiesPartitionKey, _NetworkRequest_responseCookiesPartitionKeyOpaque, _NetworkRequest_siteHasCookieInOtherPartition, _NetworkRequest_url, _NetworkRequest_responseReceivedTime, _NetworkRequest_transferSize, _NetworkRequest_finished, _NetworkRequest_failed, _NetworkRequest_canceled, _NetworkRequest_preserved, _NetworkRequest_mimeType, _NetworkRequest_charset, _NetworkRequest_parsedURL, _NetworkRequest_name, _NetworkRequest_path, _NetworkRequest_clientSecurityState, _NetworkRequest_trustTokenParams, _NetworkRequest_trustTokenOperationDoneEvent, _NetworkRequest_responseCacheStorageCacheName, _NetworkRequest_serviceWorkerResponseSource, _NetworkRequest_wallIssueTime, _NetworkRequest_responseRetrievalTime, _NetworkRequest_resourceSize, _NetworkRequest_fromMemoryCache, _NetworkRequest_fromDiskCache, _NetworkRequest_fromPrefetchCache, _NetworkRequest_fromEarlyHints, _NetworkRequest_fetchedViaServiceWorker, _NetworkRequest_serviceWorkerRouterInfo, _NetworkRequest_timing, _NetworkRequest_requestHeadersText, _NetworkRequest_responseHeaders, _NetworkRequest_earlyHintsHeaders, _NetworkRequest_sortedResponseHeaders, _NetworkRequest_responseCookies, _NetworkRequest_serverTimings, _NetworkRequest_queryString, _NetworkRequest_parsedQueryParameters, _NetworkRequest_contentDataProvider, _NetworkRequest_isSameSite, _NetworkRequest_wasIntercepted, _NetworkRequest_associatedData, _NetworkRequest_hasOverriddenContent, _NetworkRequest_hasThirdPartyCookiePhaseoutIssue, _NetworkRequest_serverSentEvents, _NetworkRequest_directSocketChunks, _NetworkRequest_deduplicateHeaders;
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import * as Platform from '../platform/platform.js';
import { CookieModel } from './CookieModel.js';
import { CookieParser } from './CookieParser.js';
import * as HttpReasonPhraseStrings from './HttpReasonPhraseStrings.js';
import { Events as NetworkManagerEvents, NetworkManager, } from './NetworkManager.js';
import { ServerSentEvents } from './ServerSentEvents.js';
import { ServerTiming } from './ServerTiming.js';
import { Type } from './Target.js';
// clang-format off
const UIStrings = {
    /**
     *@description Text in Network Request
     */
    binary: '(binary)',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    secureOnly: 'This cookie was blocked because it had the "`Secure`" attribute and the connection was not secure.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    notOnPath: 'This cookie was blocked because its path was not an exact match for or a superdirectory of the request url\'s path.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    domainMismatch: 'This cookie was blocked because neither did the request URL\'s domain exactly match the cookie\'s domain, nor was the request URL\'s domain a subdomain of the cookie\'s Domain attribute value.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    sameSiteStrict: 'This cookie was blocked because it had the "`SameSite=Strict`" attribute and the request was made from a different site. This includes top-level navigation requests initiated by other sites.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    sameSiteLax: 'This cookie was blocked because it had the "`SameSite=Lax`" attribute and the request was made from a different site and was not initiated by a top-level navigation.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    sameSiteUnspecifiedTreatedAsLax: 'This cookie didn\'t specify a "`SameSite`" attribute when it was stored and was defaulted to "SameSite=Lax," and was blocked because the request was made from a different site and was not initiated by a top-level navigation. The cookie had to have been set with "`SameSite=None`" to enable cross-site usage.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    sameSiteNoneInsecure: 'This cookie was blocked because it had the "`SameSite=None`" attribute but was not marked "Secure". Cookies without SameSite restrictions must be marked "Secure" and sent over a secure connection.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    userPreferences: 'This cookie was blocked due to user preferences.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    thirdPartyPhaseout: 'This cookie was blocked either because of Chrome flags or browser configuration. Learn more in the Issues panel.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    unknownError: 'An unknown error was encountered when trying to send this cookie.',
    /**
     *@description Tooltip to explain why a cookie was blocked due to Schemeful Same-Site
     */
    schemefulSameSiteStrict: 'This cookie was blocked because it had the "`SameSite=Strict`" attribute but the request was cross-site. This includes top-level navigation requests initiated by other sites. This request is considered cross-site because the URL has a different scheme than the current site.',
    /**
     *@description Tooltip to explain why a cookie was blocked due to Schemeful Same-Site
     */
    schemefulSameSiteLax: 'This cookie was blocked because it had the "`SameSite=Lax`" attribute but the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.',
    /**
     *@description Tooltip to explain why a cookie was blocked due to Schemeful Same-Site
     */
    schemefulSameSiteUnspecifiedTreatedAsLax: 'This cookie didn\'t specify a "`SameSite`" attribute when it was stored, was defaulted to "`SameSite=Lax"`, and was blocked because the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.',
    /**
     *@description Tooltip to explain why a cookie was blocked due to SameParty
     */
    samePartyFromCrossPartyContext: 'This cookie was blocked because it had the "`SameParty`" attribute but the request was cross-party. The request was considered cross-party because the domain of the resource\'s URL and the domains of the resource\'s enclosing frames/documents are neither owners nor members in the same First-Party Set.',
    /**
     *@description Tooltip to explain why a cookie was blocked due to exceeding the maximum size
     */
    nameValuePairExceedsMaxSize: 'This cookie was blocked because it was too large. The combined size of the name and value must be less than or equal to 4096 characters.',
    /**
     *@description Tooltip to explain why an attempt to set a cookie via `Set-Cookie` HTTP header on a request's response was blocked.
     */
    thisSetcookieWasBlockedDueToUser: 'This attempt to set a cookie via a `Set-Cookie` header was blocked due to user preferences.',
    /**
     *@description Tooltip to explain why an attempt to set a cookie via `Set-Cookie` HTTP header on a request's response was blocked.
     */
    thisSetcookieWasBlockedDueThirdPartyPhaseout: 'Setting this cookie was blocked either because of Chrome flags or browser configuration. Learn more in the Issues panel.',
    /**
     *@description Tooltip to explain why an attempt to set a cookie via `Set-Cookie` HTTP header on a request's response was blocked.
     */
    thisSetcookieHadInvalidSyntax: 'This `Set-Cookie` header had invalid syntax.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    thisSetcookieHadADisallowedCharacter: 'This `Set-Cookie` header contained a disallowed character (a forbidden ASCII control character, or the tab character if it appears in the middle of the cookie name, value, an attribute name, or an attribute value).',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    theSchemeOfThisConnectionIsNot: 'The scheme of this connection is not allowed to store cookies.',
    /**
     *@description Tooltip to explain why a cookie was blocked
     */
    anUnknownErrorWasEncounteredWhenTrying: 'An unknown error was encountered when trying to store this cookie.',
    /**
     *@description Tooltip to explain why a cookie was blocked due to Schemeful Same-Site
     *@example {SameSite=Strict} PH1
     */
    thisSetcookieWasBlockedBecauseItHadTheSamesiteStrictLax: 'This attempt to set a cookie via a `Set-Cookie` header was blocked because it had the "{PH1}" attribute but came from a cross-site response which was not the response to a top-level navigation. This response is considered cross-site because the URL has a different scheme than the current site.',
    /**
     *@description Tooltip to explain why a cookie was blocked due to Schemeful Same-Site
     */
    thisSetcookieDidntSpecifyASamesite: 'This `Set-Cookie` header didn\'t specify a "`SameSite`" attribute, was defaulted to "`SameSite=Lax"`, and was blocked because it came from a cross-site response which was not the response to a top-level navigation. This response is considered cross-site because the URL has a different scheme than the current site.',
    /**
     *@description Tooltip to explain why a cookie was blocked due to SameParty
     */
    thisSetcookieWasBlockedBecauseItHadTheSameparty: 'This attempt to set a cookie via a `Set-Cookie` header was blocked because it had the "`SameParty`" attribute but the request was cross-party. The request was considered cross-party because the domain of the resource\'s URL and the domains of the resource\'s enclosing frames/documents are neither owners nor members in the same First-Party Set.',
    /**
     *@description Tooltip to explain why a cookie was blocked due to SameParty
     */
    thisSetcookieWasBlockedBecauseItHadTheSamepartyAttribute: 'This attempt to set a cookie via a `Set-Cookie` header was blocked because it had the "`SameParty`" attribute but also had other conflicting attributes. Chrome requires cookies that use the "`SameParty`" attribute to also have the "Secure" attribute, and to not be restricted to "`SameSite=Strict`".',
    /**
     *@description Tooltip to explain why an attempt to set a cookie via a `Set-Cookie` HTTP header on a request's response was blocked.
     */
    blockedReasonSecureOnly: 'This attempt to set a cookie via a `Set-Cookie` header was blocked because it had the "Secure" attribute but was not received over a secure connection.',
    /**
     *@description Tooltip to explain why an attempt to set a cookie via a `Set-Cookie` HTTP header on a request's response was blocked.
     *@example {SameSite=Strict} PH1
     */
    blockedReasonSameSiteStrictLax: 'This attempt to set a cookie via a `Set-Cookie` header was blocked because it had the "{PH1}" attribute but came from a cross-site response which was not the response to a top-level navigation.',
    /**
     *@description Tooltip to explain why an attempt to set a cookie via a `Set-Cookie` HTTP header on a request's response was blocked.
     */
    blockedReasonSameSiteUnspecifiedTreatedAsLax: 'This `Set-Cookie` header didn\'t specify a "`SameSite`" attribute and was defaulted to "`SameSite=Lax,`" and was blocked because it came from a cross-site response which was not the response to a top-level navigation. The `Set-Cookie` had to have been set with "`SameSite=None`" to enable cross-site usage.',
    /**
     *@description Tooltip to explain why an attempt to set a cookie via a `Set-Cookie` HTTP header on a request's response was blocked.
     */
    blockedReasonSameSiteNoneInsecure: 'This attempt to set a cookie via a `Set-Cookie` header was blocked because it had the "`SameSite=None`" attribute but did not have the "Secure" attribute, which is required in order to use "`SameSite=None`".',
    /**
     *@description Tooltip to explain why an attempt to set a cookie via a `Set-Cookie` HTTP header on a request's response was blocked.
     */
    blockedReasonOverwriteSecure: 'This attempt to set a cookie via a `Set-Cookie` header was blocked because it was not sent over a secure connection and would have overwritten a cookie with the Secure attribute.',
    /**
     *@description Tooltip to explain why an attempt to set a cookie via a `Set-Cookie` HTTP header on a request's response was blocked.
     */
    blockedReasonInvalidDomain: 'This attempt to set a cookie via a `Set-Cookie` header was blocked because its Domain attribute was invalid with regards to the current host url.',
    /**
     *@description Tooltip to explain why an attempt to set a cookie via a `Set-Cookie` HTTP header on a request's response was blocked.
     */
    blockedReasonInvalidPrefix: 'This attempt to set a cookie via a `Set-Cookie` header was blocked because it used the "`__Secure-`" or "`__Host-`" prefix in its name and broke the additional rules applied to cookies with these prefixes as defined in `https://tools.ietf.org/html/draft-west-cookie-prefixes-05`.',
    /**
     *@description Tooltip to explain why a cookie was blocked when the size of the #name plus the size of the value exceeds the max size.
     */
    thisSetcookieWasBlockedBecauseTheNameValuePairExceedsMaxSize: 'This attempt to set a cookie via a `Set-Cookie` header was blocked because the cookie was too large. The combined size of the name and value must be less than or equal to 4096 characters.',
    /**
     *@description Text in Network Manager
     *@example {https://example.com} PH1
     */
    setcookieHeaderIsIgnoredIn: 'Set-Cookie header is ignored in response from url: {PH1}. The combined size of the name and value must be less than or equal to 4096 characters.',
    /**
     *@description Tooltip to explain why the cookie should have been blocked by third-party cookie phaseout but is exempted.
     */
    exemptionReasonUserSetting: 'This cookie is allowed by user preference.',
    /**
     *@description Tooltip to explain why the cookie should have been blocked by third-party cookie phaseout but is exempted.
     */
    exemptionReasonTPCDMetadata: 'This cookie is allowed by a third-party cookie deprecation trial grace period. Learn more: goo.gle/dt-grace.',
    /**
     *@description Tooltip to explain why the cookie should have been blocked by third-party cookie phaseout but is exempted.
     */
    exemptionReasonTPCDDeprecationTrial: 'This cookie is allowed by third-party cookie deprecation trial. Learn more: goo.gle/ps-dt.',
    /**
     *@description Tooltip to explain why the cookie should have been blocked by third-party cookie phaseout but is exempted.
     */
    exemptionReasonTopLevelTPCDDeprecationTrial: 'This cookie is allowed by top-level third-party cookie deprecation trial. Learn more: goo.gle/ps-dt.',
    /**
     *@description Tooltip to explain why the cookie should have been blocked by third-party cookie phaseout but is exempted.
     */
    exemptionReasonTPCDHeuristics: 'This cookie is allowed by third-party cookie heuristics. Learn more: goo.gle/hbe',
    /**
     *@description Tooltip to explain why the cookie should have been blocked by third-party cookie phaseout but is exempted.
     */
    exemptionReasonEnterprisePolicy: 'This cookie is allowed by Chrome Enterprise policy. Learn more: goo.gle/ce-3pc',
    /**
     *@description Tooltip to explain why the cookie should have been blocked by third-party cookie phaseout but is exempted.
     */
    exemptionReasonStorageAccessAPI: 'This cookie is allowed by the Storage Access API. Learn more: goo.gle/saa',
    /**
     *@description Tooltip to explain why the cookie should have been blocked by third-party cookie phaseout but is exempted.
     */
    exemptionReasonTopLevelStorageAccessAPI: 'This cookie is allowed by the top-level Storage Access API. Learn more: goo.gle/saa-top',
    /**
     *@description Tooltip to explain why the cookie should have been blocked by third-party cookie phaseout but is exempted.
     */
    exemptionReasonScheme: 'This cookie is allowed by the top-level url scheme',
};
// clang-format on
const str_ = i18n.i18n.registerUIStrings('core/sdk/NetworkRequest.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class NetworkRequest extends Common.ObjectWrapper.ObjectWrapper {
    constructor(requestId, backendRequestId, url, documentURL, frameId, loaderId, initiator, hasUserGesture) {
        super();
        _NetworkRequest_instances.add(this);
        _NetworkRequest_requestId.set(this, void 0);
        _NetworkRequest_backendRequestId.set(this, void 0);
        _NetworkRequest_documentURL.set(this, void 0);
        _NetworkRequest_frameId.set(this, void 0);
        _NetworkRequest_loaderId.set(this, void 0);
        _NetworkRequest_hasUserGesture.set(this, void 0);
        _NetworkRequest_initiator.set(this, void 0);
        _NetworkRequest_redirectSource.set(this, null);
        _NetworkRequest_preflightRequest.set(this, null);
        _NetworkRequest_preflightInitiatorRequest.set(this, null);
        _NetworkRequest_isRedirect.set(this, false);
        _NetworkRequest_redirectDestination.set(this, null);
        _NetworkRequest_issueTime.set(this, -1);
        _NetworkRequest_startTime.set(this, -1);
        _NetworkRequest_endTime.set(this, -1);
        _NetworkRequest_blockedReason.set(this, undefined);
        _NetworkRequest_corsErrorStatus.set(this, undefined);
        this.statusCode = 0;
        this.statusText = '';
        this.requestMethod = '';
        this.requestTime = 0;
        this.protocol = '';
        this.alternateProtocolUsage = undefined;
        this.mixedContentType = "none" /* Protocol.Security.MixedContentType.None */;
        _NetworkRequest_initialPriority.set(this, null);
        _NetworkRequest_currentPriority.set(this, null);
        _NetworkRequest_signedExchangeInfo.set(this, null);
        _NetworkRequest_webBundleInfo.set(this, null);
        _NetworkRequest_webBundleInnerRequestInfo.set(this, null);
        _NetworkRequest_resourceType.set(this, Common.ResourceType.resourceTypes.Other);
        _NetworkRequest_contentData.set(this, null);
        _NetworkRequest_streamingContentData.set(this, null);
        _NetworkRequest_frames.set(this, []);
        _NetworkRequest_responseHeaderValues.set(this, {});
        _NetworkRequest_responseHeadersText.set(this, '');
        _NetworkRequest_originalResponseHeaders.set(this, []);
        _NetworkRequest_sortedOriginalResponseHeaders.set(this, void 0);
        // This field is only used when intercepting and overriding requests, because
        // in that case 'this.responseHeaders' does not contain 'set-cookie' headers.
        _NetworkRequest_setCookieHeaders.set(this, []);
        _NetworkRequest_requestHeaders.set(this, []);
        _NetworkRequest_requestHeaderValues.set(this, {});
        _NetworkRequest_remoteAddress.set(this, '');
        _NetworkRequest_remoteAddressSpace.set(this, "Unknown" /* Protocol.Network.IPAddressSpace.Unknown */);
        _NetworkRequest_referrerPolicy.set(this, null);
        _NetworkRequest_securityState.set(this, "unknown" /* Protocol.Security.SecurityState.Unknown */);
        _NetworkRequest_securityDetails.set(this, null);
        this.connectionId = '0';
        this.connectionReused = false;
        this.hasNetworkData = false;
        _NetworkRequest_formParametersPromise.set(this, null);
        _NetworkRequest_requestFormDataPromise.set(this, Promise.resolve(null));
        _NetworkRequest_hasExtraRequestInfo.set(this, false);
        _NetworkRequest_hasExtraResponseInfo.set(this, false);
        _NetworkRequest_blockedRequestCookies.set(this, []);
        _NetworkRequest_includedRequestCookies.set(this, []);
        _NetworkRequest_blockedResponseCookies.set(this, []);
        _NetworkRequest_exemptedResponseCookies.set(this, []);
        _NetworkRequest_responseCookiesPartitionKey.set(this, null);
        _NetworkRequest_responseCookiesPartitionKeyOpaque.set(this, null);
        _NetworkRequest_siteHasCookieInOtherPartition.set(this, false);
        this.localizedFailDescription = null;
        _NetworkRequest_url.set(this, void 0);
        _NetworkRequest_responseReceivedTime.set(this, void 0);
        _NetworkRequest_transferSize.set(this, void 0);
        _NetworkRequest_finished.set(this, void 0);
        _NetworkRequest_failed.set(this, void 0);
        _NetworkRequest_canceled.set(this, void 0);
        _NetworkRequest_preserved.set(this, void 0);
        _NetworkRequest_mimeType.set(this, void 0);
        _NetworkRequest_charset.set(this, void 0);
        _NetworkRequest_parsedURL.set(this, void 0);
        _NetworkRequest_name.set(this, void 0);
        _NetworkRequest_path.set(this, void 0);
        _NetworkRequest_clientSecurityState.set(this, void 0);
        _NetworkRequest_trustTokenParams.set(this, void 0);
        _NetworkRequest_trustTokenOperationDoneEvent.set(this, void 0);
        _NetworkRequest_responseCacheStorageCacheName.set(this, void 0);
        _NetworkRequest_serviceWorkerResponseSource.set(this, void 0);
        _NetworkRequest_wallIssueTime.set(this, void 0);
        _NetworkRequest_responseRetrievalTime.set(this, void 0);
        _NetworkRequest_resourceSize.set(this, void 0);
        _NetworkRequest_fromMemoryCache.set(this, void 0);
        _NetworkRequest_fromDiskCache.set(this, void 0);
        _NetworkRequest_fromPrefetchCache.set(this, void 0);
        _NetworkRequest_fromEarlyHints.set(this, void 0);
        _NetworkRequest_fetchedViaServiceWorker.set(this, void 0);
        _NetworkRequest_serviceWorkerRouterInfo.set(this, void 0);
        _NetworkRequest_timing.set(this, void 0);
        _NetworkRequest_requestHeadersText.set(this, void 0);
        _NetworkRequest_responseHeaders.set(this, void 0);
        _NetworkRequest_earlyHintsHeaders.set(this, void 0);
        _NetworkRequest_sortedResponseHeaders.set(this, void 0);
        _NetworkRequest_responseCookies.set(this, void 0);
        _NetworkRequest_serverTimings.set(this, void 0);
        _NetworkRequest_queryString.set(this, void 0);
        _NetworkRequest_parsedQueryParameters.set(this, void 0);
        _NetworkRequest_contentDataProvider.set(this, void 0);
        _NetworkRequest_isSameSite.set(this, null);
        _NetworkRequest_wasIntercepted.set(this, false);
        _NetworkRequest_associatedData.set(this, new Map());
        _NetworkRequest_hasOverriddenContent.set(this, false);
        _NetworkRequest_hasThirdPartyCookiePhaseoutIssue.set(this, false);
        _NetworkRequest_serverSentEvents.set(this, void 0);
        _NetworkRequest_directSocketChunks.set(this, []);
        __classPrivateFieldSet(this, _NetworkRequest_requestId, requestId, "f");
        __classPrivateFieldSet(this, _NetworkRequest_backendRequestId, backendRequestId, "f");
        this.setUrl(url);
        __classPrivateFieldSet(this, _NetworkRequest_documentURL, documentURL, "f");
        __classPrivateFieldSet(this, _NetworkRequest_frameId, frameId, "f");
        __classPrivateFieldSet(this, _NetworkRequest_loaderId, loaderId, "f");
        __classPrivateFieldSet(this, _NetworkRequest_initiator, initiator, "f");
        __classPrivateFieldSet(this, _NetworkRequest_hasUserGesture, hasUserGesture, "f");
    }
    static create(backendRequestId, url, documentURL, frameId, loaderId, initiator, hasUserGesture) {
        return new NetworkRequest(backendRequestId, backendRequestId, url, documentURL, frameId, loaderId, initiator, hasUserGesture);
    }
    static createForSocket(backendRequestId, requestURL, initiator) {
        return new NetworkRequest(backendRequestId, backendRequestId, requestURL, Platform.DevToolsPath.EmptyUrlString, null, null, initiator || null);
    }
    static createWithoutBackendRequest(requestId, url, documentURL, initiator) {
        return new NetworkRequest(requestId, undefined, url, documentURL, null, null, initiator);
    }
    identityCompare(other) {
        const thisId = this.requestId();
        const thatId = other.requestId();
        if (thisId > thatId) {
            return 1;
        }
        if (thisId < thatId) {
            return -1;
        }
        return 0;
    }
    requestId() {
        return __classPrivateFieldGet(this, _NetworkRequest_requestId, "f");
    }
    backendRequestId() {
        return __classPrivateFieldGet(this, _NetworkRequest_backendRequestId, "f");
    }
    url() {
        return __classPrivateFieldGet(this, _NetworkRequest_url, "f");
    }
    isBlobRequest() {
        return Common.ParsedURL.schemeIs(__classPrivateFieldGet(this, _NetworkRequest_url, "f"), 'blob:');
    }
    setUrl(x) {
        if (__classPrivateFieldGet(this, _NetworkRequest_url, "f") === x) {
            return;
        }
        __classPrivateFieldSet(this, _NetworkRequest_url, x, "f");
        __classPrivateFieldSet(this, _NetworkRequest_parsedURL, new Common.ParsedURL.ParsedURL(x), "f");
        __classPrivateFieldSet(this, _NetworkRequest_queryString, undefined, "f");
        __classPrivateFieldSet(this, _NetworkRequest_parsedQueryParameters, undefined, "f");
        __classPrivateFieldSet(this, _NetworkRequest_name, undefined, "f");
        __classPrivateFieldSet(this, _NetworkRequest_path, undefined, "f");
    }
    get documentURL() {
        return __classPrivateFieldGet(this, _NetworkRequest_documentURL, "f");
    }
    get parsedURL() {
        return __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f");
    }
    get frameId() {
        return __classPrivateFieldGet(this, _NetworkRequest_frameId, "f");
    }
    get loaderId() {
        return __classPrivateFieldGet(this, _NetworkRequest_loaderId, "f");
    }
    setRemoteAddress(ip, port) {
        __classPrivateFieldSet(this, _NetworkRequest_remoteAddress, ip + ':' + port, "f");
        this.dispatchEventToListeners(Events.REMOTE_ADDRESS_CHANGED, this);
    }
    remoteAddress() {
        return __classPrivateFieldGet(this, _NetworkRequest_remoteAddress, "f");
    }
    remoteAddressSpace() {
        return __classPrivateFieldGet(this, _NetworkRequest_remoteAddressSpace, "f");
    }
    /**
     * The cache #name of the CacheStorage from where the response is served via
     * the ServiceWorker.
     */
    getResponseCacheStorageCacheName() {
        return __classPrivateFieldGet(this, _NetworkRequest_responseCacheStorageCacheName, "f");
    }
    setResponseCacheStorageCacheName(x) {
        __classPrivateFieldSet(this, _NetworkRequest_responseCacheStorageCacheName, x, "f");
    }
    serviceWorkerResponseSource() {
        return __classPrivateFieldGet(this, _NetworkRequest_serviceWorkerResponseSource, "f");
    }
    setServiceWorkerResponseSource(serviceWorkerResponseSource) {
        __classPrivateFieldSet(this, _NetworkRequest_serviceWorkerResponseSource, serviceWorkerResponseSource, "f");
    }
    setReferrerPolicy(referrerPolicy) {
        __classPrivateFieldSet(this, _NetworkRequest_referrerPolicy, referrerPolicy, "f");
    }
    referrerPolicy() {
        return __classPrivateFieldGet(this, _NetworkRequest_referrerPolicy, "f");
    }
    securityState() {
        return __classPrivateFieldGet(this, _NetworkRequest_securityState, "f");
    }
    setSecurityState(securityState) {
        __classPrivateFieldSet(this, _NetworkRequest_securityState, securityState, "f");
    }
    securityDetails() {
        return __classPrivateFieldGet(this, _NetworkRequest_securityDetails, "f");
    }
    securityOrigin() {
        return __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").securityOrigin();
    }
    setSecurityDetails(securityDetails) {
        __classPrivateFieldSet(this, _NetworkRequest_securityDetails, securityDetails, "f");
    }
    get startTime() {
        return __classPrivateFieldGet(this, _NetworkRequest_startTime, "f") || -1;
    }
    setIssueTime(monotonicTime, wallTime) {
        __classPrivateFieldSet(this, _NetworkRequest_issueTime, monotonicTime, "f");
        __classPrivateFieldSet(this, _NetworkRequest_wallIssueTime, wallTime, "f");
        __classPrivateFieldSet(this, _NetworkRequest_startTime, monotonicTime, "f");
    }
    issueTime() {
        return __classPrivateFieldGet(this, _NetworkRequest_issueTime, "f");
    }
    pseudoWallTime(monotonicTime) {
        return __classPrivateFieldGet(this, _NetworkRequest_wallIssueTime, "f") ? __classPrivateFieldGet(this, _NetworkRequest_wallIssueTime, "f") - __classPrivateFieldGet(this, _NetworkRequest_issueTime, "f") + monotonicTime : monotonicTime;
    }
    get responseReceivedTime() {
        return __classPrivateFieldGet(this, _NetworkRequest_responseReceivedTime, "f") || -1;
    }
    set responseReceivedTime(x) {
        __classPrivateFieldSet(this, _NetworkRequest_responseReceivedTime, x, "f");
    }
    /**
     * The time at which the returned response was generated. For cached
     * responses, this is the last time the cache entry was validated.
     */
    getResponseRetrievalTime() {
        return __classPrivateFieldGet(this, _NetworkRequest_responseRetrievalTime, "f");
    }
    setResponseRetrievalTime(x) {
        __classPrivateFieldSet(this, _NetworkRequest_responseRetrievalTime, x, "f");
    }
    get endTime() {
        return __classPrivateFieldGet(this, _NetworkRequest_endTime, "f") || -1;
    }
    set endTime(x) {
        if (this.timing?.requestTime) {
            // Check against accurate responseReceivedTime.
            __classPrivateFieldSet(this, _NetworkRequest_endTime, Math.max(x, this.responseReceivedTime), "f");
        }
        else {
            // Prefer endTime since it might be from the network stack.
            __classPrivateFieldSet(this, _NetworkRequest_endTime, x, "f");
            if (__classPrivateFieldGet(this, _NetworkRequest_responseReceivedTime, "f") > x) {
                __classPrivateFieldSet(this, _NetworkRequest_responseReceivedTime, x, "f");
            }
        }
        this.dispatchEventToListeners(Events.TIMING_CHANGED, this);
    }
    get duration() {
        if (__classPrivateFieldGet(this, _NetworkRequest_endTime, "f") === -1 || __classPrivateFieldGet(this, _NetworkRequest_startTime, "f") === -1) {
            return -1;
        }
        return __classPrivateFieldGet(this, _NetworkRequest_endTime, "f") - __classPrivateFieldGet(this, _NetworkRequest_startTime, "f");
    }
    get latency() {
        if (__classPrivateFieldGet(this, _NetworkRequest_responseReceivedTime, "f") === -1 || __classPrivateFieldGet(this, _NetworkRequest_startTime, "f") === -1) {
            return -1;
        }
        return __classPrivateFieldGet(this, _NetworkRequest_responseReceivedTime, "f") - __classPrivateFieldGet(this, _NetworkRequest_startTime, "f");
    }
    get resourceSize() {
        return __classPrivateFieldGet(this, _NetworkRequest_resourceSize, "f") || 0;
    }
    set resourceSize(x) {
        __classPrivateFieldSet(this, _NetworkRequest_resourceSize, x, "f");
    }
    get transferSize() {
        return __classPrivateFieldGet(this, _NetworkRequest_transferSize, "f") || 0;
    }
    increaseTransferSize(x) {
        __classPrivateFieldSet(this, _NetworkRequest_transferSize, (__classPrivateFieldGet(this, _NetworkRequest_transferSize, "f") || 0) + x, "f");
    }
    setTransferSize(x) {
        __classPrivateFieldSet(this, _NetworkRequest_transferSize, x, "f");
    }
    get finished() {
        return __classPrivateFieldGet(this, _NetworkRequest_finished, "f");
    }
    set finished(x) {
        if (__classPrivateFieldGet(this, _NetworkRequest_finished, "f") === x) {
            return;
        }
        __classPrivateFieldSet(this, _NetworkRequest_finished, x, "f");
        if (x) {
            this.dispatchEventToListeners(Events.FINISHED_LOADING, this);
        }
    }
    get failed() {
        return __classPrivateFieldGet(this, _NetworkRequest_failed, "f");
    }
    set failed(x) {
        __classPrivateFieldSet(this, _NetworkRequest_failed, x, "f");
    }
    get canceled() {
        return __classPrivateFieldGet(this, _NetworkRequest_canceled, "f");
    }
    set canceled(x) {
        __classPrivateFieldSet(this, _NetworkRequest_canceled, x, "f");
    }
    get preserved() {
        return __classPrivateFieldGet(this, _NetworkRequest_preserved, "f");
    }
    set preserved(x) {
        __classPrivateFieldSet(this, _NetworkRequest_preserved, x, "f");
    }
    blockedReason() {
        return __classPrivateFieldGet(this, _NetworkRequest_blockedReason, "f");
    }
    setBlockedReason(reason) {
        __classPrivateFieldSet(this, _NetworkRequest_blockedReason, reason, "f");
    }
    corsErrorStatus() {
        return __classPrivateFieldGet(this, _NetworkRequest_corsErrorStatus, "f");
    }
    setCorsErrorStatus(corsErrorStatus) {
        __classPrivateFieldSet(this, _NetworkRequest_corsErrorStatus, corsErrorStatus, "f");
    }
    wasBlocked() {
        return Boolean(__classPrivateFieldGet(this, _NetworkRequest_blockedReason, "f"));
    }
    cached() {
        return ((Boolean(__classPrivateFieldGet(this, _NetworkRequest_fromMemoryCache, "f")) || Boolean(__classPrivateFieldGet(this, _NetworkRequest_fromDiskCache, "f"))) && !__classPrivateFieldGet(this, _NetworkRequest_transferSize, "f"));
    }
    cachedInMemory() {
        return Boolean(__classPrivateFieldGet(this, _NetworkRequest_fromMemoryCache, "f")) && !__classPrivateFieldGet(this, _NetworkRequest_transferSize, "f");
    }
    fromPrefetchCache() {
        return Boolean(__classPrivateFieldGet(this, _NetworkRequest_fromPrefetchCache, "f"));
    }
    setFromMemoryCache() {
        __classPrivateFieldSet(this, _NetworkRequest_fromMemoryCache, true, "f");
        __classPrivateFieldSet(this, _NetworkRequest_timing, undefined, "f");
    }
    get fromDiskCache() {
        return __classPrivateFieldGet(this, _NetworkRequest_fromDiskCache, "f");
    }
    setFromDiskCache() {
        __classPrivateFieldSet(this, _NetworkRequest_fromDiskCache, true, "f");
    }
    setFromPrefetchCache() {
        __classPrivateFieldSet(this, _NetworkRequest_fromPrefetchCache, true, "f");
    }
    fromEarlyHints() {
        return Boolean(__classPrivateFieldGet(this, _NetworkRequest_fromEarlyHints, "f"));
    }
    setFromEarlyHints() {
        __classPrivateFieldSet(this, _NetworkRequest_fromEarlyHints, true, "f");
    }
    /**
     * Returns true if the request was intercepted by a service worker and it
     * provided its own response.
     */
    get fetchedViaServiceWorker() {
        return Boolean(__classPrivateFieldGet(this, _NetworkRequest_fetchedViaServiceWorker, "f"));
    }
    set fetchedViaServiceWorker(x) {
        __classPrivateFieldSet(this, _NetworkRequest_fetchedViaServiceWorker, x, "f");
    }
    get serviceWorkerRouterInfo() {
        return __classPrivateFieldGet(this, _NetworkRequest_serviceWorkerRouterInfo, "f");
    }
    set serviceWorkerRouterInfo(x) {
        __classPrivateFieldSet(this, _NetworkRequest_serviceWorkerRouterInfo, x, "f");
    }
    /**
     * Returns true if the request was matched to a route when using the
     * ServiceWorker static routing API.
     */
    hasMatchingServiceWorkerRouter() {
        // See definitions in `browser_protocol.pdl` for justification.
        return (__classPrivateFieldGet(this, _NetworkRequest_serviceWorkerRouterInfo, "f") !== undefined && this.serviceWorkerRouterInfo?.matchedSourceType !== undefined);
    }
    /**
     * Returns true if the request was sent by a service worker.
     */
    initiatedByServiceWorker() {
        const networkManager = NetworkManager.forRequest(this);
        if (!networkManager) {
            return false;
        }
        return networkManager.target().type() === Type.ServiceWorker;
    }
    get timing() {
        return __classPrivateFieldGet(this, _NetworkRequest_timing, "f");
    }
    set timing(timingInfo) {
        if (!timingInfo || __classPrivateFieldGet(this, _NetworkRequest_fromMemoryCache, "f")) {
            return;
        }
        // Take startTime and responseReceivedTime from timing data for better accuracy.
        // Timing's requestTime is a baseline in seconds, rest of the numbers there are ticks in millis.
        __classPrivateFieldSet(this, _NetworkRequest_startTime, timingInfo.requestTime, "f");
        const headersReceivedTime = timingInfo.requestTime + timingInfo.receiveHeadersEnd / 1000.0;
        if ((__classPrivateFieldGet(this, _NetworkRequest_responseReceivedTime, "f") || -1) < 0 || __classPrivateFieldGet(this, _NetworkRequest_responseReceivedTime, "f") > headersReceivedTime) {
            __classPrivateFieldSet(this, _NetworkRequest_responseReceivedTime, headersReceivedTime, "f");
        }
        if (__classPrivateFieldGet(this, _NetworkRequest_startTime, "f") > __classPrivateFieldGet(this, _NetworkRequest_responseReceivedTime, "f")) {
            __classPrivateFieldSet(this, _NetworkRequest_responseReceivedTime, __classPrivateFieldGet(this, _NetworkRequest_startTime, "f"), "f");
        }
        __classPrivateFieldSet(this, _NetworkRequest_timing, timingInfo, "f");
        this.dispatchEventToListeners(Events.TIMING_CHANGED, this);
    }
    setConnectTimingFromExtraInfo(connectTiming) {
        __classPrivateFieldSet(this, _NetworkRequest_startTime, connectTiming.requestTime, "f");
        this.dispatchEventToListeners(Events.TIMING_CHANGED, this);
    }
    get mimeType() {
        return __classPrivateFieldGet(this, _NetworkRequest_mimeType, "f");
    }
    set mimeType(x) {
        __classPrivateFieldSet(this, _NetworkRequest_mimeType, x, "f");
        if (x === "text/event-stream" /* Platform.MimeType.MimeType.EVENTSTREAM */ && !__classPrivateFieldGet(this, _NetworkRequest_serverSentEvents, "f")) {
            const parseFromStreamedData = this.resourceType() !== Common.ResourceType.resourceTypes.EventSource;
            __classPrivateFieldSet(this, _NetworkRequest_serverSentEvents, new ServerSentEvents(this, parseFromStreamedData), "f");
        }
    }
    get displayName() {
        return __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").displayName;
    }
    name() {
        if (__classPrivateFieldGet(this, _NetworkRequest_name, "f")) {
            return __classPrivateFieldGet(this, _NetworkRequest_name, "f");
        }
        this.parseNameAndPathFromURL();
        return __classPrivateFieldGet(this, _NetworkRequest_name, "f");
    }
    path() {
        if (__classPrivateFieldGet(this, _NetworkRequest_path, "f")) {
            return __classPrivateFieldGet(this, _NetworkRequest_path, "f");
        }
        this.parseNameAndPathFromURL();
        return __classPrivateFieldGet(this, _NetworkRequest_path, "f");
    }
    parseNameAndPathFromURL() {
        if (__classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").isDataURL()) {
            __classPrivateFieldSet(this, _NetworkRequest_name, __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").dataURLDisplayName(), "f");
            __classPrivateFieldSet(this, _NetworkRequest_path, '', "f");
        }
        else if (__classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").isBlobURL()) {
            __classPrivateFieldSet(this, _NetworkRequest_name, __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").url, "f");
            __classPrivateFieldSet(this, _NetworkRequest_path, '', "f");
        }
        else if (__classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").isAboutBlank()) {
            __classPrivateFieldSet(this, _NetworkRequest_name, __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").url, "f");
            __classPrivateFieldSet(this, _NetworkRequest_path, '', "f");
        }
        else {
            __classPrivateFieldSet(this, _NetworkRequest_path, __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").host + __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").folderPathComponents, "f");
            const networkManager = NetworkManager.forRequest(this);
            const inspectedURL = networkManager ? Common.ParsedURL.ParsedURL.fromString(networkManager.target().inspectedURL()) :
                null;
            __classPrivateFieldSet(this, _NetworkRequest_path, Platform.StringUtilities.trimURL(__classPrivateFieldGet(this, _NetworkRequest_path, "f"), inspectedURL ? inspectedURL.host : ''), "f");
            if (__classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").lastPathComponent || __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").queryParams) {
                __classPrivateFieldSet(this, _NetworkRequest_name, __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").lastPathComponent + (__classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").queryParams ? '?' + __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").queryParams : ''), "f");
            }
            else if (__classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").folderPathComponents) {
                __classPrivateFieldSet(this, _NetworkRequest_name, __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").folderPathComponents.substring(__classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").folderPathComponents.lastIndexOf('/') + 1) +
                    '/', "f");
                __classPrivateFieldSet(this, _NetworkRequest_path, __classPrivateFieldGet(this, _NetworkRequest_path, "f").substring(0, __classPrivateFieldGet(this, _NetworkRequest_path, "f").lastIndexOf('/')), "f");
            }
            else {
                __classPrivateFieldSet(this, _NetworkRequest_name, __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").host, "f");
                __classPrivateFieldSet(this, _NetworkRequest_path, '', "f");
            }
        }
    }
    get folder() {
        let path = __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").path;
        const indexOfQuery = path.indexOf('?');
        if (indexOfQuery !== -1) {
            path = path.substring(0, indexOfQuery);
        }
        const lastSlashIndex = path.lastIndexOf('/');
        return lastSlashIndex !== -1 ? path.substring(0, lastSlashIndex) : '';
    }
    get pathname() {
        return __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").path;
    }
    resourceType() {
        return __classPrivateFieldGet(this, _NetworkRequest_resourceType, "f");
    }
    setResourceType(resourceType) {
        __classPrivateFieldSet(this, _NetworkRequest_resourceType, resourceType, "f");
    }
    get domain() {
        return __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").host;
    }
    get scheme() {
        return __classPrivateFieldGet(this, _NetworkRequest_parsedURL, "f").scheme;
    }
    getInferredStatusText() {
        return (this.statusText || HttpReasonPhraseStrings.getStatusText(this.statusCode));
    }
    redirectSource() {
        return __classPrivateFieldGet(this, _NetworkRequest_redirectSource, "f");
    }
    setRedirectSource(originatingRequest) {
        __classPrivateFieldSet(this, _NetworkRequest_redirectSource, originatingRequest, "f");
    }
    preflightRequest() {
        return __classPrivateFieldGet(this, _NetworkRequest_preflightRequest, "f");
    }
    setPreflightRequest(preflightRequest) {
        __classPrivateFieldSet(this, _NetworkRequest_preflightRequest, preflightRequest, "f");
    }
    preflightInitiatorRequest() {
        return __classPrivateFieldGet(this, _NetworkRequest_preflightInitiatorRequest, "f");
    }
    setPreflightInitiatorRequest(preflightInitiatorRequest) {
        __classPrivateFieldSet(this, _NetworkRequest_preflightInitiatorRequest, preflightInitiatorRequest, "f");
    }
    isPreflightRequest() {
        return (__classPrivateFieldGet(this, _NetworkRequest_initiator, "f") !== null && __classPrivateFieldGet(this, _NetworkRequest_initiator, "f") !== undefined &&
            __classPrivateFieldGet(this, _NetworkRequest_initiator, "f").type === "preflight" /* Protocol.Network.InitiatorType.Preflight */);
    }
    redirectDestination() {
        return __classPrivateFieldGet(this, _NetworkRequest_redirectDestination, "f");
    }
    setRedirectDestination(redirectDestination) {
        __classPrivateFieldSet(this, _NetworkRequest_redirectDestination, redirectDestination, "f");
    }
    requestHeaders() {
        return __classPrivateFieldGet(this, _NetworkRequest_requestHeaders, "f");
    }
    setRequestHeaders(headers) {
        __classPrivateFieldSet(this, _NetworkRequest_requestHeaders, headers, "f");
        this.dispatchEventToListeners(Events.REQUEST_HEADERS_CHANGED);
    }
    requestHeadersText() {
        return __classPrivateFieldGet(this, _NetworkRequest_requestHeadersText, "f");
    }
    setRequestHeadersText(text) {
        __classPrivateFieldSet(this, _NetworkRequest_requestHeadersText, text, "f");
        this.dispatchEventToListeners(Events.REQUEST_HEADERS_CHANGED);
    }
    requestHeaderValue(headerName) {
        if (__classPrivateFieldGet(this, _NetworkRequest_requestHeaderValues, "f")[headerName]) {
            return __classPrivateFieldGet(this, _NetworkRequest_requestHeaderValues, "f")[headerName];
        }
        __classPrivateFieldGet(this, _NetworkRequest_requestHeaderValues, "f")[headerName] = this.computeHeaderValue(this.requestHeaders(), headerName);
        return __classPrivateFieldGet(this, _NetworkRequest_requestHeaderValues, "f")[headerName];
    }
    requestFormData() {
        if (!__classPrivateFieldGet(this, _NetworkRequest_requestFormDataPromise, "f")) {
            __classPrivateFieldSet(this, _NetworkRequest_requestFormDataPromise, NetworkManager.requestPostData(this), "f");
        }
        return __classPrivateFieldGet(this, _NetworkRequest_requestFormDataPromise, "f");
    }
    setRequestFormData(hasData, data) {
        __classPrivateFieldSet(this, _NetworkRequest_requestFormDataPromise, hasData && data === null ? null : Promise.resolve(data), "f");
        __classPrivateFieldSet(this, _NetworkRequest_formParametersPromise, null, "f");
    }
    filteredProtocolName() {
        const protocol = this.protocol.toLowerCase();
        if (protocol === 'h2') {
            return 'http/2.0';
        }
        return protocol.replace(/^http\/2(\.0)?\+/, 'http/2.0+');
    }
    requestHttpVersion() {
        const headersText = this.requestHeadersText();
        if (!headersText) {
            const version = this.requestHeaderValue('version') || this.requestHeaderValue(':version');
            if (version) {
                return version;
            }
            return this.filteredProtocolName();
        }
        const firstLine = headersText.split(/\r\n/)[0];
        const match = firstLine.match(/(HTTP\/\d+\.\d+)$/);
        return match ? match[1] : 'HTTP/0.9';
    }
    get responseHeaders() {
        return __classPrivateFieldGet(this, _NetworkRequest_responseHeaders, "f") || [];
    }
    set responseHeaders(x) {
        __classPrivateFieldSet(this, _NetworkRequest_responseHeaders, x, "f");
        __classPrivateFieldSet(this, _NetworkRequest_sortedResponseHeaders, undefined, "f");
        __classPrivateFieldSet(this, _NetworkRequest_serverTimings, undefined, "f");
        __classPrivateFieldSet(this, _NetworkRequest_responseCookies, undefined, "f");
        __classPrivateFieldSet(this, _NetworkRequest_responseHeaderValues, {}, "f");
        this.dispatchEventToListeners(Events.RESPONSE_HEADERS_CHANGED);
    }
    get earlyHintsHeaders() {
        return __classPrivateFieldGet(this, _NetworkRequest_earlyHintsHeaders, "f") || [];
    }
    set earlyHintsHeaders(x) {
        __classPrivateFieldSet(this, _NetworkRequest_earlyHintsHeaders, x, "f");
    }
    get originalResponseHeaders() {
        return __classPrivateFieldGet(this, _NetworkRequest_originalResponseHeaders, "f");
    }
    set originalResponseHeaders(headers) {
        __classPrivateFieldSet(this, _NetworkRequest_originalResponseHeaders, headers, "f");
        __classPrivateFieldSet(this, _NetworkRequest_sortedOriginalResponseHeaders, undefined, "f");
    }
    get setCookieHeaders() {
        return __classPrivateFieldGet(this, _NetworkRequest_setCookieHeaders, "f");
    }
    set setCookieHeaders(headers) {
        __classPrivateFieldSet(this, _NetworkRequest_setCookieHeaders, headers, "f");
    }
    get responseHeadersText() {
        return __classPrivateFieldGet(this, _NetworkRequest_responseHeadersText, "f");
    }
    set responseHeadersText(x) {
        __classPrivateFieldSet(this, _NetworkRequest_responseHeadersText, x, "f");
        this.dispatchEventToListeners(Events.RESPONSE_HEADERS_CHANGED);
    }
    get sortedResponseHeaders() {
        if (__classPrivateFieldGet(this, _NetworkRequest_sortedResponseHeaders, "f") !== undefined) {
            return __classPrivateFieldGet(this, _NetworkRequest_sortedResponseHeaders, "f");
        }
        __classPrivateFieldSet(this, _NetworkRequest_sortedResponseHeaders, this.responseHeaders.slice(), "f");
        return __classPrivateFieldGet(this, _NetworkRequest_sortedResponseHeaders, "f").sort(function (a, b) {
            return Platform.StringUtilities.compare(a.name.toLowerCase(), b.name.toLowerCase());
        });
    }
    get sortedOriginalResponseHeaders() {
        if (__classPrivateFieldGet(this, _NetworkRequest_sortedOriginalResponseHeaders, "f") !== undefined) {
            return __classPrivateFieldGet(this, _NetworkRequest_sortedOriginalResponseHeaders, "f");
        }
        __classPrivateFieldSet(this, _NetworkRequest_sortedOriginalResponseHeaders, this.originalResponseHeaders.slice(), "f");
        return __classPrivateFieldGet(this, _NetworkRequest_sortedOriginalResponseHeaders, "f").sort(function (a, b) {
            return Platform.StringUtilities.compare(a.name.toLowerCase(), b.name.toLowerCase());
        });
    }
    get overrideTypes() {
        const types = [];
        if (this.hasOverriddenContent) {
            types.push('content');
        }
        if (this.hasOverriddenHeaders()) {
            types.push('headers');
        }
        return types;
    }
    get hasOverriddenContent() {
        return __classPrivateFieldGet(this, _NetworkRequest_hasOverriddenContent, "f");
    }
    set hasOverriddenContent(value) {
        __classPrivateFieldSet(this, _NetworkRequest_hasOverriddenContent, value, "f");
    }
    hasOverriddenHeaders() {
        if (!__classPrivateFieldGet(this, _NetworkRequest_originalResponseHeaders, "f").length) {
            return false;
        }
        const responseHeaders = __classPrivateFieldGet(this, _NetworkRequest_instances, "m", _NetworkRequest_deduplicateHeaders).call(this, this.sortedResponseHeaders);
        const originalResponseHeaders = __classPrivateFieldGet(this, _NetworkRequest_instances, "m", _NetworkRequest_deduplicateHeaders).call(this, this.sortedOriginalResponseHeaders);
        if (responseHeaders.length !== originalResponseHeaders.length) {
            return true;
        }
        for (let i = 0; i < responseHeaders.length; i++) {
            if (responseHeaders[i].name.toLowerCase() !== originalResponseHeaders[i].name.toLowerCase()) {
                return true;
            }
            if (responseHeaders[i].value !== originalResponseHeaders[i].value) {
                return true;
            }
        }
        return false;
    }
    responseHeaderValue(headerName) {
        if (headerName in __classPrivateFieldGet(this, _NetworkRequest_responseHeaderValues, "f")) {
            return __classPrivateFieldGet(this, _NetworkRequest_responseHeaderValues, "f")[headerName];
        }
        __classPrivateFieldGet(this, _NetworkRequest_responseHeaderValues, "f")[headerName] = this.computeHeaderValue(this.responseHeaders, headerName);
        return __classPrivateFieldGet(this, _NetworkRequest_responseHeaderValues, "f")[headerName];
    }
    wasIntercepted() {
        return __classPrivateFieldGet(this, _NetworkRequest_wasIntercepted, "f");
    }
    setWasIntercepted(wasIntercepted) {
        __classPrivateFieldSet(this, _NetworkRequest_wasIntercepted, wasIntercepted, "f");
    }
    setEarlyHintsHeaders(headers) {
        this.earlyHintsHeaders = headers;
    }
    get responseCookies() {
        if (!__classPrivateFieldGet(this, _NetworkRequest_responseCookies, "f")) {
            __classPrivateFieldSet(this, _NetworkRequest_responseCookies, CookieParser.parseSetCookie(this.responseHeaderValue('Set-Cookie'), this.domain) ||
                [], "f");
            if (__classPrivateFieldGet(this, _NetworkRequest_responseCookiesPartitionKey, "f")) {
                for (const cookie of __classPrivateFieldGet(this, _NetworkRequest_responseCookies, "f")) {
                    if (cookie.partitioned()) {
                        cookie.setPartitionKey(__classPrivateFieldGet(this, _NetworkRequest_responseCookiesPartitionKey, "f").topLevelSite, __classPrivateFieldGet(this, _NetworkRequest_responseCookiesPartitionKey, "f").hasCrossSiteAncestor);
                    }
                }
            }
            else if (__classPrivateFieldGet(this, _NetworkRequest_responseCookiesPartitionKeyOpaque, "f")) {
                for (const cookie of __classPrivateFieldGet(this, _NetworkRequest_responseCookies, "f")) {
                    // Do not check cookie.partitioned() since most opaque partitions
                    // are fenced/credentialless frames partitioned by default.
                    cookie.setPartitionKeyOpaque();
                }
            }
        }
        return __classPrivateFieldGet(this, _NetworkRequest_responseCookies, "f");
    }
    responseLastModified() {
        return this.responseHeaderValue('last-modified');
    }
    allCookiesIncludingBlockedOnes() {
        return [
            ...this.includedRequestCookies().map(includedRequestCookie => includedRequestCookie.cookie),
            ...this.responseCookies,
            ...this.blockedRequestCookies().map(blockedRequestCookie => blockedRequestCookie.cookie),
            ...this.blockedResponseCookies().map(blockedResponseCookie => blockedResponseCookie.cookie),
        ].filter(v => !!v);
    }
    get serverTimings() {
        if (typeof __classPrivateFieldGet(this, _NetworkRequest_serverTimings, "f") === 'undefined') {
            __classPrivateFieldSet(this, _NetworkRequest_serverTimings, ServerTiming.parseHeaders(this.responseHeaders), "f");
        }
        return __classPrivateFieldGet(this, _NetworkRequest_serverTimings, "f");
    }
    queryString() {
        if (__classPrivateFieldGet(this, _NetworkRequest_queryString, "f") !== undefined) {
            return __classPrivateFieldGet(this, _NetworkRequest_queryString, "f");
        }
        let queryString = null;
        const url = this.url();
        const questionMarkPosition = url.indexOf('?');
        if (questionMarkPosition !== -1) {
            queryString = url.substring(questionMarkPosition + 1);
            const hashSignPosition = queryString.indexOf('#');
            if (hashSignPosition !== -1) {
                queryString = queryString.substring(0, hashSignPosition);
            }
        }
        __classPrivateFieldSet(this, _NetworkRequest_queryString, queryString, "f");
        return __classPrivateFieldGet(this, _NetworkRequest_queryString, "f");
    }
    get queryParameters() {
        if (__classPrivateFieldGet(this, _NetworkRequest_parsedQueryParameters, "f")) {
            return __classPrivateFieldGet(this, _NetworkRequest_parsedQueryParameters, "f");
        }
        const queryString = this.queryString();
        if (!queryString) {
            return null;
        }
        __classPrivateFieldSet(this, _NetworkRequest_parsedQueryParameters, this.parseParameters(queryString), "f");
        return __classPrivateFieldGet(this, _NetworkRequest_parsedQueryParameters, "f");
    }
    async parseFormParameters() {
        const requestContentType = this.requestContentType();
        if (!requestContentType) {
            return null;
        }
        // Handling application/#x-www-form-urlencoded request bodies.
        if (requestContentType.match(/^application\/x-www-form-urlencoded\s*(;.*)?$/i)) {
            const formData = await this.requestFormData();
            if (!formData) {
                return null;
            }
            return this.parseParameters(formData);
        }
        // Handling multipart/form-data request bodies.
        const multipartDetails = requestContentType.match(/^multipart\/form-data\s*;\s*boundary\s*=\s*(\S+)\s*$/);
        if (!multipartDetails) {
            return null;
        }
        const boundary = multipartDetails[1];
        if (!boundary) {
            return null;
        }
        const formData = await this.requestFormData();
        if (!formData) {
            return null;
        }
        return this.parseMultipartFormDataParameters(formData, boundary);
    }
    formParameters() {
        if (!__classPrivateFieldGet(this, _NetworkRequest_formParametersPromise, "f")) {
            __classPrivateFieldSet(this, _NetworkRequest_formParametersPromise, this.parseFormParameters(), "f");
        }
        return __classPrivateFieldGet(this, _NetworkRequest_formParametersPromise, "f");
    }
    responseHttpVersion() {
        const headersText = __classPrivateFieldGet(this, _NetworkRequest_responseHeadersText, "f");
        if (!headersText) {
            const version = this.responseHeaderValue('version') || this.responseHeaderValue(':version');
            if (version) {
                return version;
            }
            return this.filteredProtocolName();
        }
        const firstLine = headersText.split(/\r\n/)[0];
        const match = firstLine.match(/^(HTTP\/\d+\.\d+)/);
        return match ? match[1] : 'HTTP/0.9';
    }
    parseParameters(queryString) {
        function parseNameValue(pair) {
            const position = pair.indexOf('=');
            if (position === -1) {
                return { name: pair, value: '' };
            }
            return {
                name: pair.substring(0, position),
                value: pair.substring(position + 1),
            };
        }
        return queryString.split('&').map(parseNameValue);
    }
    /**
     * Parses multipart/form-data; boundary=boundaryString request bodies -
     * --boundaryString
     * Content-Disposition: form-data; #name="field-#name"; filename="r.gif"
     * Content-Type: application/octet-stream
     *
     * optionalValue
     * --boundaryString
     * Content-Disposition: form-data; #name="field-#name-2"
     *
     * optionalValue2
     * --boundaryString--
     */
    parseMultipartFormDataParameters(data, boundary) {
        const sanitizedBoundary = Platform.StringUtilities.escapeForRegExp(boundary);
        const keyValuePattern = new RegExp(
        // Header with an optional file #name.
        '^\\r\\ncontent-disposition\\s*:\\s*form-data\\s*;\\s*name="([^"]*)"(?:\\s*;\\s*filename="([^"]*)")?' +
            // Optional secondary header with the content type.
            '(?:\\r\\ncontent-type\\s*:\\s*([^\\r\\n]*))?' +
            // Padding.
            '\\r\\n\\r\\n' +
            // Value
            '(.*)' +
            // Padding.
            '\\r\\n$', 'is');
        const fields = data.split(new RegExp(`--${sanitizedBoundary}(?:--\s*$)?`, 'g'));
        return fields.reduce(parseMultipartField, []);
        function parseMultipartField(result, field) {
            const [match, name, filename, contentType, value] = field.match(keyValuePattern) || [];
            if (!match) {
                return result;
            }
            const processedValue = filename || contentType ? i18nString(UIStrings.binary) : value;
            result.push({ name, value: processedValue });
            return result;
        }
    }
    computeHeaderValue(headers, headerName) {
        headerName = headerName.toLowerCase();
        const values = [];
        for (let i = 0; i < headers.length; ++i) {
            if (headers[i].name.toLowerCase() === headerName) {
                values.push(headers[i].value);
            }
        }
        if (!values.length) {
            return undefined;
        }
        // Set-Cookie #values should be separated by '\n', not comma, otherwise cookies could not be parsed.
        if (headerName === 'set-cookie') {
            return values.join('\n');
        }
        return values.join(', ');
    }
    requestContentData() {
        if (__classPrivateFieldGet(this, _NetworkRequest_contentData, "f")) {
            return __classPrivateFieldGet(this, _NetworkRequest_contentData, "f");
        }
        if (__classPrivateFieldGet(this, _NetworkRequest_contentDataProvider, "f")) {
            __classPrivateFieldSet(this, _NetworkRequest_contentData, __classPrivateFieldGet(this, _NetworkRequest_contentDataProvider, "f").call(this), "f");
        }
        else {
            __classPrivateFieldSet(this, _NetworkRequest_contentData, NetworkManager.requestContentData(this), "f");
        }
        return __classPrivateFieldGet(this, _NetworkRequest_contentData, "f");
    }
    setContentDataProvider(dataProvider) {
        console.assert(!__classPrivateFieldGet(this, _NetworkRequest_contentData, "f"), 'contentData can only be set once.');
        __classPrivateFieldSet(this, _NetworkRequest_contentDataProvider, dataProvider, "f");
    }
    requestStreamingContent() {
        if (__classPrivateFieldGet(this, _NetworkRequest_streamingContentData, "f")) {
            return __classPrivateFieldGet(this, _NetworkRequest_streamingContentData, "f");
        }
        const contentPromise = this.finished ? this.requestContentData() : NetworkManager.streamResponseBody(this);
        __classPrivateFieldSet(this, _NetworkRequest_streamingContentData, contentPromise.then(contentData => {
            if (TextUtils.ContentData.ContentData.isError(contentData)) {
                return contentData;
            }
            // Note that this is save: "streamResponseBody()" always creates base64-based ContentData and
            // for "contentData()" we'll never call "addChunk".
            return TextUtils.StreamingContentData.StreamingContentData.from(contentData);
        }), "f");
        return __classPrivateFieldGet(this, _NetworkRequest_streamingContentData, "f");
    }
    contentURL() {
        return __classPrivateFieldGet(this, _NetworkRequest_url, "f");
    }
    contentType() {
        return __classPrivateFieldGet(this, _NetworkRequest_resourceType, "f");
    }
    async searchInContent(query, caseSensitive, isRegex) {
        if (!__classPrivateFieldGet(this, _NetworkRequest_contentDataProvider, "f")) {
            return await NetworkManager.searchInRequest(this, query, caseSensitive, isRegex);
        }
        const contentData = await this.requestContentData();
        if (TextUtils.ContentData.ContentData.isError(contentData) || !contentData.isTextContent) {
            return [];
        }
        return TextUtils.TextUtils.performSearchInContentData(contentData, query, caseSensitive, isRegex);
    }
    requestContentType() {
        return this.requestHeaderValue('Content-Type');
    }
    hasErrorStatusCode() {
        return this.statusCode >= 400;
    }
    setInitialPriority(priority) {
        __classPrivateFieldSet(this, _NetworkRequest_initialPriority, priority, "f");
    }
    initialPriority() {
        return __classPrivateFieldGet(this, _NetworkRequest_initialPriority, "f");
    }
    setPriority(priority) {
        __classPrivateFieldSet(this, _NetworkRequest_currentPriority, priority, "f");
    }
    priority() {
        return __classPrivateFieldGet(this, _NetworkRequest_currentPriority, "f") || __classPrivateFieldGet(this, _NetworkRequest_initialPriority, "f") || null;
    }
    setSignedExchangeInfo(info) {
        __classPrivateFieldSet(this, _NetworkRequest_signedExchangeInfo, info, "f");
    }
    signedExchangeInfo() {
        return __classPrivateFieldGet(this, _NetworkRequest_signedExchangeInfo, "f");
    }
    setWebBundleInfo(info) {
        __classPrivateFieldSet(this, _NetworkRequest_webBundleInfo, info, "f");
    }
    webBundleInfo() {
        return __classPrivateFieldGet(this, _NetworkRequest_webBundleInfo, "f");
    }
    setWebBundleInnerRequestInfo(info) {
        __classPrivateFieldSet(this, _NetworkRequest_webBundleInnerRequestInfo, info, "f");
    }
    webBundleInnerRequestInfo() {
        return __classPrivateFieldGet(this, _NetworkRequest_webBundleInnerRequestInfo, "f");
    }
    async populateImageSource(image) {
        const contentData = await this.requestContentData();
        if (TextUtils.ContentData.ContentData.isError(contentData)) {
            return;
        }
        let imageSrc = contentData.asDataUrl();
        if (imageSrc === null && !__classPrivateFieldGet(this, _NetworkRequest_failed, "f")) {
            const cacheControl = this.responseHeaderValue('cache-control') || '';
            if (!cacheControl.includes('no-cache')) {
                imageSrc = __classPrivateFieldGet(this, _NetworkRequest_url, "f");
            }
        }
        if (imageSrc !== null) {
            image.src = imageSrc;
        }
    }
    initiator() {
        return __classPrivateFieldGet(this, _NetworkRequest_initiator, "f") || null;
    }
    hasUserGesture() {
        return __classPrivateFieldGet(this, _NetworkRequest_hasUserGesture, "f") ?? null;
    }
    frames() {
        return __classPrivateFieldGet(this, _NetworkRequest_frames, "f");
    }
    addProtocolFrameError(errorMessage, time) {
        this.addFrame({
            type: WebSocketFrameType.Error,
            text: errorMessage,
            time: this.pseudoWallTime(time),
            opCode: -1,
            mask: false,
        });
    }
    addProtocolFrame(response, time, sent) {
        const type = sent ? WebSocketFrameType.Send : WebSocketFrameType.Receive;
        this.addFrame({
            type,
            text: response.payloadData,
            time: this.pseudoWallTime(time),
            opCode: response.opcode,
            mask: response.mask,
        });
    }
    addFrame(frame) {
        __classPrivateFieldGet(this, _NetworkRequest_frames, "f").push(frame);
        this.dispatchEventToListeners(Events.WEBSOCKET_FRAME_ADDED, frame);
    }
    directSocketChunks() {
        return __classPrivateFieldGet(this, _NetworkRequest_directSocketChunks, "f");
    }
    addDirectSocketChunk(chunk) {
        __classPrivateFieldGet(this, _NetworkRequest_directSocketChunks, "f").push(chunk);
        this.dispatchEventToListeners(Events.DIRECTSOCKET_CHUNK_ADDED, chunk);
    }
    eventSourceMessages() {
        return __classPrivateFieldGet(this, _NetworkRequest_serverSentEvents, "f")?.eventSourceMessages ?? [];
    }
    addEventSourceMessage(time, eventName, eventId, data) {
        __classPrivateFieldGet(this, _NetworkRequest_serverSentEvents, "f")?.onProtocolEventSourceMessageReceived(eventName, data, eventId, this.pseudoWallTime(time));
    }
    markAsRedirect(redirectCount) {
        __classPrivateFieldSet(this, _NetworkRequest_isRedirect, true, "f");
        __classPrivateFieldSet(this, _NetworkRequest_requestId, `${__classPrivateFieldGet(this, _NetworkRequest_backendRequestId, "f")}:redirected.${redirectCount}`, "f");
    }
    isRedirect() {
        return __classPrivateFieldGet(this, _NetworkRequest_isRedirect, "f");
    }
    setRequestIdForTest(requestId) {
        __classPrivateFieldSet(this, _NetworkRequest_backendRequestId, requestId, "f");
        __classPrivateFieldSet(this, _NetworkRequest_requestId, requestId, "f");
    }
    charset() {
        return __classPrivateFieldGet(this, _NetworkRequest_charset, "f") ?? null;
    }
    setCharset(charset) {
        __classPrivateFieldSet(this, _NetworkRequest_charset, charset, "f");
    }
    addExtraRequestInfo(extraRequestInfo) {
        __classPrivateFieldSet(this, _NetworkRequest_blockedRequestCookies, extraRequestInfo.blockedRequestCookies, "f");
        __classPrivateFieldSet(this, _NetworkRequest_includedRequestCookies, extraRequestInfo.includedRequestCookies, "f");
        this.setRequestHeaders(extraRequestInfo.requestHeaders);
        __classPrivateFieldSet(this, _NetworkRequest_hasExtraRequestInfo, true, "f");
        this.setRequestHeadersText(''); // Mark request headers as non-provisional
        __classPrivateFieldSet(this, _NetworkRequest_clientSecurityState, extraRequestInfo.clientSecurityState, "f");
        this.setConnectTimingFromExtraInfo(extraRequestInfo.connectTiming);
        __classPrivateFieldSet(this, _NetworkRequest_siteHasCookieInOtherPartition, extraRequestInfo.siteHasCookieInOtherPartition ?? false, "f");
        __classPrivateFieldSet(this, _NetworkRequest_hasThirdPartyCookiePhaseoutIssue, __classPrivateFieldGet(this, _NetworkRequest_blockedRequestCookies, "f").some(item => item.blockedReasons.includes("ThirdPartyPhaseout" /* Protocol.Network.CookieBlockedReason.ThirdPartyPhaseout */)), "f");
    }
    hasExtraRequestInfo() {
        return __classPrivateFieldGet(this, _NetworkRequest_hasExtraRequestInfo, "f");
    }
    blockedRequestCookies() {
        return __classPrivateFieldGet(this, _NetworkRequest_blockedRequestCookies, "f");
    }
    includedRequestCookies() {
        return __classPrivateFieldGet(this, _NetworkRequest_includedRequestCookies, "f");
    }
    hasRequestCookies() {
        return (__classPrivateFieldGet(this, _NetworkRequest_includedRequestCookies, "f").length > 0 || __classPrivateFieldGet(this, _NetworkRequest_blockedRequestCookies, "f").length > 0);
    }
    siteHasCookieInOtherPartition() {
        return __classPrivateFieldGet(this, _NetworkRequest_siteHasCookieInOtherPartition, "f");
    }
    // Parse the status text from the first line of the response headers text.
    // See net::HttpResponseHeaders::GetStatusText.
    static parseStatusTextFromResponseHeadersText(responseHeadersText) {
        const firstLineParts = responseHeadersText.split('\r')[0].split(' ');
        return firstLineParts.slice(2).join(' ');
    }
    addExtraResponseInfo(extraResponseInfo) {
        __classPrivateFieldSet(this, _NetworkRequest_blockedResponseCookies, extraResponseInfo.blockedResponseCookies, "f");
        if (extraResponseInfo.exemptedResponseCookies) {
            __classPrivateFieldSet(this, _NetworkRequest_exemptedResponseCookies, extraResponseInfo.exemptedResponseCookies, "f");
        }
        __classPrivateFieldSet(this, _NetworkRequest_responseCookiesPartitionKey, extraResponseInfo.cookiePartitionKey ? extraResponseInfo.cookiePartitionKey : null, "f");
        __classPrivateFieldSet(this, _NetworkRequest_responseCookiesPartitionKeyOpaque, extraResponseInfo.cookiePartitionKeyOpaque || null, "f");
        this.responseHeaders = extraResponseInfo.responseHeaders;
        // We store a copy of the headers we initially received, so that after
        // potential header overrides, we can compare actual with original headers.
        this.originalResponseHeaders = extraResponseInfo.responseHeaders.map(headerEntry => ({ ...headerEntry }));
        if (extraResponseInfo.responseHeadersText) {
            this.responseHeadersText = extraResponseInfo.responseHeadersText;
            if (!this.requestHeadersText()) {
                // Generate request headers text from raw headers in extra request info because
                // Network.requestWillBeSentExtraInfo doesn't include headers text.
                let requestHeadersText = `${this.requestMethod} ${this.parsedURL.path}`;
                if (this.parsedURL.queryParams) {
                    requestHeadersText += `?${this.parsedURL.queryParams}`;
                }
                requestHeadersText += ' HTTP/1.1\r\n';
                for (const { name, value } of this.requestHeaders()) {
                    requestHeadersText += `${name}: ${value}\r\n`;
                }
                this.setRequestHeadersText(requestHeadersText);
            }
            this.statusText = NetworkRequest.parseStatusTextFromResponseHeadersText(extraResponseInfo.responseHeadersText);
        }
        __classPrivateFieldSet(this, _NetworkRequest_remoteAddressSpace, extraResponseInfo.resourceIPAddressSpace, "f");
        if (extraResponseInfo.statusCode) {
            this.statusCode = extraResponseInfo.statusCode;
        }
        __classPrivateFieldSet(this, _NetworkRequest_hasExtraResponseInfo, true, "f");
        // TODO(crbug.com/1252463) Explore replacing this with a DevTools Issue.
        const networkManager = NetworkManager.forRequest(this);
        if (!networkManager) {
            return;
        }
        for (const blockedCookie of __classPrivateFieldGet(this, _NetworkRequest_blockedResponseCookies, "f")) {
            if (blockedCookie.blockedReasons.includes("NameValuePairExceedsMaxSize" /* Protocol.Network.SetCookieBlockedReason.NameValuePairExceedsMaxSize */)) {
                const message = i18nString(UIStrings.setcookieHeaderIsIgnoredIn, {
                    PH1: this.url(),
                });
                networkManager.dispatchEventToListeners(NetworkManagerEvents.MessageGenerated, { message, requestId: __classPrivateFieldGet(this, _NetworkRequest_requestId, "f"), warning: true });
            }
        }
        const cookieModel = networkManager.target().model(CookieModel);
        if (!cookieModel) {
            return;
        }
        for (const exemptedCookie of __classPrivateFieldGet(this, _NetworkRequest_exemptedResponseCookies, "f")) {
            cookieModel.removeBlockedCookie(exemptedCookie.cookie);
        }
        for (const blockedCookie of __classPrivateFieldGet(this, _NetworkRequest_blockedResponseCookies, "f")) {
            const cookie = blockedCookie.cookie;
            if (!cookie) {
                continue;
            }
            if (blockedCookie.blockedReasons.includes("ThirdPartyPhaseout" /* Protocol.Network.SetCookieBlockedReason.ThirdPartyPhaseout */)) {
                __classPrivateFieldSet(this, _NetworkRequest_hasThirdPartyCookiePhaseoutIssue, true, "f");
            }
            cookieModel.addBlockedCookie(cookie, blockedCookie.blockedReasons.map(blockedReason => ({
                attribute: setCookieBlockedReasonToAttribute(blockedReason),
                uiString: setCookieBlockedReasonToUiString(blockedReason),
            })));
        }
    }
    hasExtraResponseInfo() {
        return __classPrivateFieldGet(this, _NetworkRequest_hasExtraResponseInfo, "f");
    }
    blockedResponseCookies() {
        return __classPrivateFieldGet(this, _NetworkRequest_blockedResponseCookies, "f");
    }
    exemptedResponseCookies() {
        return __classPrivateFieldGet(this, _NetworkRequest_exemptedResponseCookies, "f");
    }
    nonBlockedResponseCookies() {
        const blockedCookieLines = this.blockedResponseCookies().map(blockedCookie => blockedCookie.cookieLine);
        // Use array and remove 1 by 1 to handle the (potential) case of multiple
        // identical cookies, only some of which are blocked.
        const responseCookies = this.responseCookies.filter(cookie => {
            const index = blockedCookieLines.indexOf(cookie.getCookieLine());
            if (index !== -1) {
                blockedCookieLines[index] = null;
                return false;
            }
            return true;
        });
        return responseCookies;
    }
    responseCookiesPartitionKey() {
        return __classPrivateFieldGet(this, _NetworkRequest_responseCookiesPartitionKey, "f");
    }
    responseCookiesPartitionKeyOpaque() {
        return __classPrivateFieldGet(this, _NetworkRequest_responseCookiesPartitionKeyOpaque, "f");
    }
    redirectSourceSignedExchangeInfoHasNoErrors() {
        return (__classPrivateFieldGet(this, _NetworkRequest_redirectSource, "f") !== null && __classPrivateFieldGet(__classPrivateFieldGet(this, _NetworkRequest_redirectSource, "f"), _NetworkRequest_signedExchangeInfo, "f") !== null &&
            !__classPrivateFieldGet(__classPrivateFieldGet(this, _NetworkRequest_redirectSource, "f"), _NetworkRequest_signedExchangeInfo, "f").errors);
    }
    clientSecurityState() {
        return __classPrivateFieldGet(this, _NetworkRequest_clientSecurityState, "f");
    }
    setTrustTokenParams(trustTokenParams) {
        __classPrivateFieldSet(this, _NetworkRequest_trustTokenParams, trustTokenParams, "f");
    }
    trustTokenParams() {
        return __classPrivateFieldGet(this, _NetworkRequest_trustTokenParams, "f");
    }
    setTrustTokenOperationDoneEvent(doneEvent) {
        __classPrivateFieldSet(this, _NetworkRequest_trustTokenOperationDoneEvent, doneEvent, "f");
        this.dispatchEventToListeners(Events.TRUST_TOKEN_RESULT_ADDED);
    }
    trustTokenOperationDoneEvent() {
        return __classPrivateFieldGet(this, _NetworkRequest_trustTokenOperationDoneEvent, "f");
    }
    setIsSameSite(isSameSite) {
        __classPrivateFieldSet(this, _NetworkRequest_isSameSite, isSameSite, "f");
    }
    isSameSite() {
        return __classPrivateFieldGet(this, _NetworkRequest_isSameSite, "f");
    }
    getAssociatedData(key) {
        return __classPrivateFieldGet(this, _NetworkRequest_associatedData, "f").get(key) || null;
    }
    setAssociatedData(key, data) {
        __classPrivateFieldGet(this, _NetworkRequest_associatedData, "f").set(key, data);
    }
    deleteAssociatedData(key) {
        __classPrivateFieldGet(this, _NetworkRequest_associatedData, "f").delete(key);
    }
    hasThirdPartyCookiePhaseoutIssue() {
        return __classPrivateFieldGet(this, _NetworkRequest_hasThirdPartyCookiePhaseoutIssue, "f");
    }
    addDataReceivedEvent({ timestamp, dataLength, encodedDataLength, data, }) {
        this.resourceSize += dataLength;
        if (encodedDataLength !== -1) {
            this.increaseTransferSize(encodedDataLength);
        }
        this.endTime = timestamp;
        if (data) {
            void __classPrivateFieldGet(this, _NetworkRequest_streamingContentData, "f")?.then(contentData => {
                if (!TextUtils.StreamingContentData.isError(contentData)) {
                    contentData.addChunk(data);
                }
            });
        }
    }
    waitForResponseReceived() {
        if (this.responseReceivedPromise) {
            return this.responseReceivedPromise;
        }
        const { promise, resolve } = Promise.withResolvers();
        this.responseReceivedPromise = promise;
        this.responseReceivedPromiseResolve = resolve;
        return this.responseReceivedPromise;
    }
}
_NetworkRequest_requestId = new WeakMap(), _NetworkRequest_backendRequestId = new WeakMap(), _NetworkRequest_documentURL = new WeakMap(), _NetworkRequest_frameId = new WeakMap(), _NetworkRequest_loaderId = new WeakMap(), _NetworkRequest_hasUserGesture = new WeakMap(), _NetworkRequest_initiator = new WeakMap(), _NetworkRequest_redirectSource = new WeakMap(), _NetworkRequest_preflightRequest = new WeakMap(), _NetworkRequest_preflightInitiatorRequest = new WeakMap(), _NetworkRequest_isRedirect = new WeakMap(), _NetworkRequest_redirectDestination = new WeakMap(), _NetworkRequest_issueTime = new WeakMap(), _NetworkRequest_startTime = new WeakMap(), _NetworkRequest_endTime = new WeakMap(), _NetworkRequest_blockedReason = new WeakMap(), _NetworkRequest_corsErrorStatus = new WeakMap(), _NetworkRequest_initialPriority = new WeakMap(), _NetworkRequest_currentPriority = new WeakMap(), _NetworkRequest_signedExchangeInfo = new WeakMap(), _NetworkRequest_webBundleInfo = new WeakMap(), _NetworkRequest_webBundleInnerRequestInfo = new WeakMap(), _NetworkRequest_resourceType = new WeakMap(), _NetworkRequest_contentData = new WeakMap(), _NetworkRequest_streamingContentData = new WeakMap(), _NetworkRequest_frames = new WeakMap(), _NetworkRequest_responseHeaderValues = new WeakMap(), _NetworkRequest_responseHeadersText = new WeakMap(), _NetworkRequest_originalResponseHeaders = new WeakMap(), _NetworkRequest_sortedOriginalResponseHeaders = new WeakMap(), _NetworkRequest_setCookieHeaders = new WeakMap(), _NetworkRequest_requestHeaders = new WeakMap(), _NetworkRequest_requestHeaderValues = new WeakMap(), _NetworkRequest_remoteAddress = new WeakMap(), _NetworkRequest_remoteAddressSpace = new WeakMap(), _NetworkRequest_referrerPolicy = new WeakMap(), _NetworkRequest_securityState = new WeakMap(), _NetworkRequest_securityDetails = new WeakMap(), _NetworkRequest_formParametersPromise = new WeakMap(), _NetworkRequest_requestFormDataPromise = new WeakMap(), _NetworkRequest_hasExtraRequestInfo = new WeakMap(), _NetworkRequest_hasExtraResponseInfo = new WeakMap(), _NetworkRequest_blockedRequestCookies = new WeakMap(), _NetworkRequest_includedRequestCookies = new WeakMap(), _NetworkRequest_blockedResponseCookies = new WeakMap(), _NetworkRequest_exemptedResponseCookies = new WeakMap(), _NetworkRequest_responseCookiesPartitionKey = new WeakMap(), _NetworkRequest_responseCookiesPartitionKeyOpaque = new WeakMap(), _NetworkRequest_siteHasCookieInOtherPartition = new WeakMap(), _NetworkRequest_url = new WeakMap(), _NetworkRequest_responseReceivedTime = new WeakMap(), _NetworkRequest_transferSize = new WeakMap(), _NetworkRequest_finished = new WeakMap(), _NetworkRequest_failed = new WeakMap(), _NetworkRequest_canceled = new WeakMap(), _NetworkRequest_preserved = new WeakMap(), _NetworkRequest_mimeType = new WeakMap(), _NetworkRequest_charset = new WeakMap(), _NetworkRequest_parsedURL = new WeakMap(), _NetworkRequest_name = new WeakMap(), _NetworkRequest_path = new WeakMap(), _NetworkRequest_clientSecurityState = new WeakMap(), _NetworkRequest_trustTokenParams = new WeakMap(), _NetworkRequest_trustTokenOperationDoneEvent = new WeakMap(), _NetworkRequest_responseCacheStorageCacheName = new WeakMap(), _NetworkRequest_serviceWorkerResponseSource = new WeakMap(), _NetworkRequest_wallIssueTime = new WeakMap(), _NetworkRequest_responseRetrievalTime = new WeakMap(), _NetworkRequest_resourceSize = new WeakMap(), _NetworkRequest_fromMemoryCache = new WeakMap(), _NetworkRequest_fromDiskCache = new WeakMap(), _NetworkRequest_fromPrefetchCache = new WeakMap(), _NetworkRequest_fromEarlyHints = new WeakMap(), _NetworkRequest_fetchedViaServiceWorker = new WeakMap(), _NetworkRequest_serviceWorkerRouterInfo = new WeakMap(), _NetworkRequest_timing = new WeakMap(), _NetworkRequest_requestHeadersText = new WeakMap(), _NetworkRequest_responseHeaders = new WeakMap(), _NetworkRequest_earlyHintsHeaders = new WeakMap(), _NetworkRequest_sortedResponseHeaders = new WeakMap(), _NetworkRequest_responseCookies = new WeakMap(), _NetworkRequest_serverTimings = new WeakMap(), _NetworkRequest_queryString = new WeakMap(), _NetworkRequest_parsedQueryParameters = new WeakMap(), _NetworkRequest_contentDataProvider = new WeakMap(), _NetworkRequest_isSameSite = new WeakMap(), _NetworkRequest_wasIntercepted = new WeakMap(), _NetworkRequest_associatedData = new WeakMap(), _NetworkRequest_hasOverriddenContent = new WeakMap(), _NetworkRequest_hasThirdPartyCookiePhaseoutIssue = new WeakMap(), _NetworkRequest_serverSentEvents = new WeakMap(), _NetworkRequest_directSocketChunks = new WeakMap(), _NetworkRequest_instances = new WeakSet(), _NetworkRequest_deduplicateHeaders = function _NetworkRequest_deduplicateHeaders(sortedHeaders) {
    const dedupedHeaders = [];
    for (const header of sortedHeaders) {
        if (dedupedHeaders.length && dedupedHeaders[dedupedHeaders.length - 1].name === header.name) {
            dedupedHeaders[dedupedHeaders.length - 1].value += `, ${header.value}`;
        }
        else {
            dedupedHeaders.push({ name: header.name, value: header.value });
        }
    }
    return dedupedHeaders;
};
export var Events;
(function (Events) {
    Events["FINISHED_LOADING"] = "FinishedLoading";
    Events["TIMING_CHANGED"] = "TimingChanged";
    Events["REMOTE_ADDRESS_CHANGED"] = "RemoteAddressChanged";
    Events["REQUEST_HEADERS_CHANGED"] = "RequestHeadersChanged";
    Events["RESPONSE_HEADERS_CHANGED"] = "ResponseHeadersChanged";
    Events["WEBSOCKET_FRAME_ADDED"] = "WebsocketFrameAdded";
    Events["DIRECTSOCKET_CHUNK_ADDED"] = "DirectsocketChunkAdded";
    Events["EVENT_SOURCE_MESSAGE_ADDED"] = "EventSourceMessageAdded";
    Events["TRUST_TOKEN_RESULT_ADDED"] = "TrustTokenResultAdded";
})(Events || (Events = {}));
export var InitiatorType;
(function (InitiatorType) {
    InitiatorType["OTHER"] = "other";
    InitiatorType["PARSER"] = "parser";
    InitiatorType["REDIRECT"] = "redirect";
    InitiatorType["SCRIPT"] = "script";
    InitiatorType["PRELOAD"] = "preload";
    InitiatorType["SIGNED_EXCHANGE"] = "signedExchange";
    InitiatorType["PREFLIGHT"] = "preflight";
})(InitiatorType || (InitiatorType = {}));
export var WebSocketFrameType;
(function (WebSocketFrameType) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    WebSocketFrameType["Send"] = "send";
    WebSocketFrameType["Receive"] = "receive";
    WebSocketFrameType["Error"] = "error";
    /* eslint-enable @typescript-eslint/naming-convention */
})(WebSocketFrameType || (WebSocketFrameType = {}));
export const cookieExemptionReasonToUiString = function (exemptionReason) {
    switch (exemptionReason) {
        case "UserSetting" /* Protocol.Network.CookieExemptionReason.UserSetting */:
            return i18nString(UIStrings.exemptionReasonUserSetting);
        case "TPCDMetadata" /* Protocol.Network.CookieExemptionReason.TPCDMetadata */:
            return i18nString(UIStrings.exemptionReasonTPCDMetadata);
        case "TopLevelTPCDDeprecationTrial" /* Protocol.Network.CookieExemptionReason.TopLevelTPCDDeprecationTrial */:
            return i18nString(UIStrings.exemptionReasonTopLevelTPCDDeprecationTrial);
        case "TPCDDeprecationTrial" /* Protocol.Network.CookieExemptionReason.TPCDDeprecationTrial */:
            return i18nString(UIStrings.exemptionReasonTPCDDeprecationTrial);
        case "TPCDHeuristics" /* Protocol.Network.CookieExemptionReason.TPCDHeuristics */:
            return i18nString(UIStrings.exemptionReasonTPCDHeuristics);
        case "EnterprisePolicy" /* Protocol.Network.CookieExemptionReason.EnterprisePolicy */:
            return i18nString(UIStrings.exemptionReasonEnterprisePolicy);
        case "StorageAccess" /* Protocol.Network.CookieExemptionReason.StorageAccess */:
            return i18nString(UIStrings.exemptionReasonStorageAccessAPI);
        case "TopLevelStorageAccess" /* Protocol.Network.CookieExemptionReason.TopLevelStorageAccess */:
            return i18nString(UIStrings.exemptionReasonTopLevelStorageAccessAPI);
        case "Scheme" /* Protocol.Network.CookieExemptionReason.Scheme */:
            return i18nString(UIStrings.exemptionReasonScheme);
    }
    return '';
};
export const cookieBlockedReasonToUiString = function (blockedReason) {
    switch (blockedReason) {
        case "SecureOnly" /* Protocol.Network.CookieBlockedReason.SecureOnly */:
            return i18nString(UIStrings.secureOnly);
        case "NotOnPath" /* Protocol.Network.CookieBlockedReason.NotOnPath */:
            return i18nString(UIStrings.notOnPath);
        case "DomainMismatch" /* Protocol.Network.CookieBlockedReason.DomainMismatch */:
            return i18nString(UIStrings.domainMismatch);
        case "SameSiteStrict" /* Protocol.Network.CookieBlockedReason.SameSiteStrict */:
            return i18nString(UIStrings.sameSiteStrict);
        case "SameSiteLax" /* Protocol.Network.CookieBlockedReason.SameSiteLax */:
            return i18nString(UIStrings.sameSiteLax);
        case "SameSiteUnspecifiedTreatedAsLax" /* Protocol.Network.CookieBlockedReason.SameSiteUnspecifiedTreatedAsLax */:
            return i18nString(UIStrings.sameSiteUnspecifiedTreatedAsLax);
        case "SameSiteNoneInsecure" /* Protocol.Network.CookieBlockedReason.SameSiteNoneInsecure */:
            return i18nString(UIStrings.sameSiteNoneInsecure);
        case "UserPreferences" /* Protocol.Network.CookieBlockedReason.UserPreferences */:
            return i18nString(UIStrings.userPreferences);
        case "UnknownError" /* Protocol.Network.CookieBlockedReason.UnknownError */:
            return i18nString(UIStrings.unknownError);
        case "SchemefulSameSiteStrict" /* Protocol.Network.CookieBlockedReason.SchemefulSameSiteStrict */:
            return i18nString(UIStrings.schemefulSameSiteStrict);
        case "SchemefulSameSiteLax" /* Protocol.Network.CookieBlockedReason.SchemefulSameSiteLax */:
            return i18nString(UIStrings.schemefulSameSiteLax);
        case "SchemefulSameSiteUnspecifiedTreatedAsLax" /* Protocol.Network.CookieBlockedReason.SchemefulSameSiteUnspecifiedTreatedAsLax */:
            return i18nString(UIStrings.schemefulSameSiteUnspecifiedTreatedAsLax);
        case "SamePartyFromCrossPartyContext" /* Protocol.Network.CookieBlockedReason.SamePartyFromCrossPartyContext */:
            return i18nString(UIStrings.samePartyFromCrossPartyContext);
        case "NameValuePairExceedsMaxSize" /* Protocol.Network.CookieBlockedReason.NameValuePairExceedsMaxSize */:
            return i18nString(UIStrings.nameValuePairExceedsMaxSize);
        case "ThirdPartyPhaseout" /* Protocol.Network.CookieBlockedReason.ThirdPartyPhaseout */:
            return i18nString(UIStrings.thirdPartyPhaseout);
    }
    return '';
};
export const setCookieBlockedReasonToUiString = function (blockedReason) {
    switch (blockedReason) {
        case "SecureOnly" /* Protocol.Network.SetCookieBlockedReason.SecureOnly */:
            return i18nString(UIStrings.blockedReasonSecureOnly);
        case "SameSiteStrict" /* Protocol.Network.SetCookieBlockedReason.SameSiteStrict */:
            return i18nString(UIStrings.blockedReasonSameSiteStrictLax, {
                PH1: 'SameSite=Strict',
            });
        case "SameSiteLax" /* Protocol.Network.SetCookieBlockedReason.SameSiteLax */:
            return i18nString(UIStrings.blockedReasonSameSiteStrictLax, {
                PH1: 'SameSite=Lax',
            });
        case "SameSiteUnspecifiedTreatedAsLax" /* Protocol.Network.SetCookieBlockedReason.SameSiteUnspecifiedTreatedAsLax */:
            return i18nString(UIStrings.blockedReasonSameSiteUnspecifiedTreatedAsLax);
        case "SameSiteNoneInsecure" /* Protocol.Network.SetCookieBlockedReason.SameSiteNoneInsecure */:
            return i18nString(UIStrings.blockedReasonSameSiteNoneInsecure);
        case "UserPreferences" /* Protocol.Network.SetCookieBlockedReason.UserPreferences */:
            return i18nString(UIStrings.thisSetcookieWasBlockedDueToUser);
        case "SyntaxError" /* Protocol.Network.SetCookieBlockedReason.SyntaxError */:
            return i18nString(UIStrings.thisSetcookieHadInvalidSyntax);
        case "SchemeNotSupported" /* Protocol.Network.SetCookieBlockedReason.SchemeNotSupported */:
            return i18nString(UIStrings.theSchemeOfThisConnectionIsNot);
        case "OverwriteSecure" /* Protocol.Network.SetCookieBlockedReason.OverwriteSecure */:
            return i18nString(UIStrings.blockedReasonOverwriteSecure);
        case "InvalidDomain" /* Protocol.Network.SetCookieBlockedReason.InvalidDomain */:
            return i18nString(UIStrings.blockedReasonInvalidDomain);
        case "InvalidPrefix" /* Protocol.Network.SetCookieBlockedReason.InvalidPrefix */:
            return i18nString(UIStrings.blockedReasonInvalidPrefix);
        case "UnknownError" /* Protocol.Network.SetCookieBlockedReason.UnknownError */:
            return i18nString(UIStrings.anUnknownErrorWasEncounteredWhenTrying);
        case "SchemefulSameSiteStrict" /* Protocol.Network.SetCookieBlockedReason.SchemefulSameSiteStrict */:
            return i18nString(UIStrings.thisSetcookieWasBlockedBecauseItHadTheSamesiteStrictLax, { PH1: 'SameSite=Strict' });
        case "SchemefulSameSiteLax" /* Protocol.Network.SetCookieBlockedReason.SchemefulSameSiteLax */:
            return i18nString(UIStrings.thisSetcookieWasBlockedBecauseItHadTheSamesiteStrictLax, { PH1: 'SameSite=Lax' });
        case "SchemefulSameSiteUnspecifiedTreatedAsLax" /* Protocol.Network.SetCookieBlockedReason.SchemefulSameSiteUnspecifiedTreatedAsLax */:
            return i18nString(UIStrings.thisSetcookieDidntSpecifyASamesite);
        case "SamePartyFromCrossPartyContext" /* Protocol.Network.SetCookieBlockedReason.SamePartyFromCrossPartyContext */:
            return i18nString(UIStrings.thisSetcookieWasBlockedBecauseItHadTheSameparty);
        case "SamePartyConflictsWithOtherAttributes" /* Protocol.Network.SetCookieBlockedReason.SamePartyConflictsWithOtherAttributes */:
            return i18nString(UIStrings.thisSetcookieWasBlockedBecauseItHadTheSamepartyAttribute);
        case "NameValuePairExceedsMaxSize" /* Protocol.Network.SetCookieBlockedReason.NameValuePairExceedsMaxSize */:
            return i18nString(UIStrings.thisSetcookieWasBlockedBecauseTheNameValuePairExceedsMaxSize);
        case "DisallowedCharacter" /* Protocol.Network.SetCookieBlockedReason.DisallowedCharacter */:
            return i18nString(UIStrings.thisSetcookieHadADisallowedCharacter);
        case "ThirdPartyPhaseout" /* Protocol.Network.SetCookieBlockedReason.ThirdPartyPhaseout */:
            return i18nString(UIStrings.thisSetcookieWasBlockedDueThirdPartyPhaseout);
    }
    return '';
};
export const cookieBlockedReasonToAttribute = function (blockedReason) {
    switch (blockedReason) {
        case "SecureOnly" /* Protocol.Network.CookieBlockedReason.SecureOnly */:
            return "secure" /* Attribute.SECURE */;
        case "NotOnPath" /* Protocol.Network.CookieBlockedReason.NotOnPath */:
            return "path" /* Attribute.PATH */;
        case "DomainMismatch" /* Protocol.Network.CookieBlockedReason.DomainMismatch */:
            return "domain" /* Attribute.DOMAIN */;
        case "SameSiteStrict" /* Protocol.Network.CookieBlockedReason.SameSiteStrict */:
        case "SameSiteLax" /* Protocol.Network.CookieBlockedReason.SameSiteLax */:
        case "SameSiteUnspecifiedTreatedAsLax" /* Protocol.Network.CookieBlockedReason.SameSiteUnspecifiedTreatedAsLax */:
        case "SameSiteNoneInsecure" /* Protocol.Network.CookieBlockedReason.SameSiteNoneInsecure */:
        case "SchemefulSameSiteStrict" /* Protocol.Network.CookieBlockedReason.SchemefulSameSiteStrict */:
        case "SchemefulSameSiteLax" /* Protocol.Network.CookieBlockedReason.SchemefulSameSiteLax */:
        case "SchemefulSameSiteUnspecifiedTreatedAsLax" /* Protocol.Network.CookieBlockedReason.SchemefulSameSiteUnspecifiedTreatedAsLax */:
            return "same-site" /* Attribute.SAME_SITE */;
        case "SamePartyFromCrossPartyContext" /* Protocol.Network.CookieBlockedReason.SamePartyFromCrossPartyContext */:
        case "NameValuePairExceedsMaxSize" /* Protocol.Network.CookieBlockedReason.NameValuePairExceedsMaxSize */:
        case "UserPreferences" /* Protocol.Network.CookieBlockedReason.UserPreferences */:
        case "ThirdPartyPhaseout" /* Protocol.Network.CookieBlockedReason.ThirdPartyPhaseout */:
        case "UnknownError" /* Protocol.Network.CookieBlockedReason.UnknownError */:
            return null;
    }
    return null;
};
export const setCookieBlockedReasonToAttribute = function (blockedReason) {
    switch (blockedReason) {
        case "SecureOnly" /* Protocol.Network.SetCookieBlockedReason.SecureOnly */:
        case "OverwriteSecure" /* Protocol.Network.SetCookieBlockedReason.OverwriteSecure */:
            return "secure" /* Attribute.SECURE */;
        case "SameSiteStrict" /* Protocol.Network.SetCookieBlockedReason.SameSiteStrict */:
        case "SameSiteLax" /* Protocol.Network.SetCookieBlockedReason.SameSiteLax */:
        case "SameSiteUnspecifiedTreatedAsLax" /* Protocol.Network.SetCookieBlockedReason.SameSiteUnspecifiedTreatedAsLax */:
        case "SameSiteNoneInsecure" /* Protocol.Network.SetCookieBlockedReason.SameSiteNoneInsecure */:
        case "SchemefulSameSiteStrict" /* Protocol.Network.SetCookieBlockedReason.SchemefulSameSiteStrict */:
        case "SchemefulSameSiteLax" /* Protocol.Network.SetCookieBlockedReason.SchemefulSameSiteLax */:
        case "SchemefulSameSiteUnspecifiedTreatedAsLax" /* Protocol.Network.SetCookieBlockedReason.SchemefulSameSiteUnspecifiedTreatedAsLax */:
            return "same-site" /* Attribute.SAME_SITE */;
        case "InvalidDomain" /* Protocol.Network.SetCookieBlockedReason.InvalidDomain */:
            return "domain" /* Attribute.DOMAIN */;
        case "InvalidPrefix" /* Protocol.Network.SetCookieBlockedReason.InvalidPrefix */:
            return "name" /* Attribute.NAME */;
        case "SamePartyConflictsWithOtherAttributes" /* Protocol.Network.SetCookieBlockedReason.SamePartyConflictsWithOtherAttributes */:
        case "SamePartyFromCrossPartyContext" /* Protocol.Network.SetCookieBlockedReason.SamePartyFromCrossPartyContext */:
        case "NameValuePairExceedsMaxSize" /* Protocol.Network.SetCookieBlockedReason.NameValuePairExceedsMaxSize */:
        case "UserPreferences" /* Protocol.Network.SetCookieBlockedReason.UserPreferences */:
        case "ThirdPartyPhaseout" /* Protocol.Network.SetCookieBlockedReason.ThirdPartyPhaseout */:
        case "SyntaxError" /* Protocol.Network.SetCookieBlockedReason.SyntaxError */:
        case "SchemeNotSupported" /* Protocol.Network.SetCookieBlockedReason.SchemeNotSupported */:
        case "UnknownError" /* Protocol.Network.SetCookieBlockedReason.UnknownError */:
        case "DisallowedCharacter" /* Protocol.Network.SetCookieBlockedReason.DisallowedCharacter */:
            return null;
    }
    return null;
};
export var DirectSocketType;
(function (DirectSocketType) {
    DirectSocketType[DirectSocketType["TCP"] = 1] = "TCP";
    DirectSocketType[DirectSocketType["UDP_BOUND"] = 2] = "UDP_BOUND";
    DirectSocketType[DirectSocketType["UDP_CONNECTED"] = 3] = "UDP_CONNECTED";
})(DirectSocketType || (DirectSocketType = {}));
export var DirectSocketStatus;
(function (DirectSocketStatus) {
    DirectSocketStatus[DirectSocketStatus["OPENING"] = 1] = "OPENING";
    DirectSocketStatus[DirectSocketStatus["OPEN"] = 2] = "OPEN";
    DirectSocketStatus[DirectSocketStatus["CLOSED"] = 3] = "CLOSED";
    DirectSocketStatus[DirectSocketStatus["ABORTED"] = 4] = "ABORTED";
})(DirectSocketStatus || (DirectSocketStatus = {}));
export var DirectSocketChunkType;
(function (DirectSocketChunkType) {
    DirectSocketChunkType["SEND"] = "send";
    DirectSocketChunkType["RECEIVE"] = "receive";
})(DirectSocketChunkType || (DirectSocketChunkType = {}));
//# sourceMappingURL=NetworkRequest.js.map