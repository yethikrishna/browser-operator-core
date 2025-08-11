// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _AggregatedIssue_instances, _AggregatedIssue_affectedCookies, _AggregatedIssue_affectedRawCookieLines, _AggregatedIssue_affectedRequests, _AggregatedIssue_affectedRequestIds, _AggregatedIssue_affectedLocations, _AggregatedIssue_heavyAdIssues, _AggregatedIssue_blockedByResponseDetails, _AggregatedIssue_bounceTrackingSites, _AggregatedIssue_corsIssues, _AggregatedIssue_cspIssues, _AggregatedIssue_deprecationIssues, _AggregatedIssue_issueKind, _AggregatedIssue_lowContrastIssues, _AggregatedIssue_cookieDeprecationMetadataIssues, _AggregatedIssue_mixedContentIssues, _AggregatedIssue_partitioningBlobURLIssues, _AggregatedIssue_sharedArrayBufferIssues, _AggregatedIssue_quirksModeIssues, _AggregatedIssue_attributionReportingIssues, _AggregatedIssue_genericIssues, _AggregatedIssue_elementAccessibilityIssues, _AggregatedIssue_representative, _AggregatedIssue_aggregatedIssuesCount, _AggregatedIssue_key, _AggregatedIssue_keyForCookie, _IssueAggregator_instances, _IssueAggregator_aggregatedIssuesByKey, _IssueAggregator_hiddenAggregatedIssuesByKey, _IssueAggregator_onIssueAdded, _IssueAggregator_onFullUpdateRequired, _IssueAggregator_aggregateIssue, _IssueAggregator_aggregateIssueByStatus;
import * as Common from '../../core/common/common.js';
import * as IssuesManager from '../../models/issues_manager/issues_manager.js';
/**
 * An `AggregatedIssue` representes a number of `IssuesManager.Issue.Issue` objects that are displayed together.
 * Currently only grouping by issue code, is supported. The class provides helpers to support displaying
 * of all resources that are affected by the aggregated issues.
 */
export class AggregatedIssue extends IssuesManager.Issue.Issue {
    constructor(code, aggregationKey) {
        super(code);
        _AggregatedIssue_instances.add(this);
        _AggregatedIssue_affectedCookies.set(this, new Map());
        _AggregatedIssue_affectedRawCookieLines.set(this, new Map());
        _AggregatedIssue_affectedRequests.set(this, []);
        _AggregatedIssue_affectedRequestIds.set(this, new Set());
        _AggregatedIssue_affectedLocations.set(this, new Map());
        _AggregatedIssue_heavyAdIssues.set(this, new Set());
        _AggregatedIssue_blockedByResponseDetails.set(this, new Map());
        _AggregatedIssue_bounceTrackingSites.set(this, new Set());
        _AggregatedIssue_corsIssues.set(this, new Set());
        _AggregatedIssue_cspIssues.set(this, new Set());
        _AggregatedIssue_deprecationIssues.set(this, new Set());
        _AggregatedIssue_issueKind.set(this, "Improvement" /* IssuesManager.Issue.IssueKind.IMPROVEMENT */);
        _AggregatedIssue_lowContrastIssues.set(this, new Set());
        _AggregatedIssue_cookieDeprecationMetadataIssues.set(this, new Set());
        _AggregatedIssue_mixedContentIssues.set(this, new Set());
        _AggregatedIssue_partitioningBlobURLIssues.set(this, new Set());
        _AggregatedIssue_sharedArrayBufferIssues.set(this, new Set());
        _AggregatedIssue_quirksModeIssues.set(this, new Set());
        _AggregatedIssue_attributionReportingIssues.set(this, new Set());
        _AggregatedIssue_genericIssues.set(this, new Set());
        _AggregatedIssue_elementAccessibilityIssues.set(this, new Set());
        _AggregatedIssue_representative.set(this, void 0);
        _AggregatedIssue_aggregatedIssuesCount.set(this, 0);
        _AggregatedIssue_key.set(this, void 0);
        __classPrivateFieldSet(this, _AggregatedIssue_key, aggregationKey, "f");
    }
    primaryKey() {
        throw new Error('This should never be called');
    }
    aggregationKey() {
        return __classPrivateFieldGet(this, _AggregatedIssue_key, "f");
    }
    getBlockedByResponseDetails() {
        return __classPrivateFieldGet(this, _AggregatedIssue_blockedByResponseDetails, "f").values();
    }
    cookies() {
        return Array.from(__classPrivateFieldGet(this, _AggregatedIssue_affectedCookies, "f").values()).map(x => x.cookie);
    }
    getRawCookieLines() {
        return __classPrivateFieldGet(this, _AggregatedIssue_affectedRawCookieLines, "f").values();
    }
    sources() {
        return __classPrivateFieldGet(this, _AggregatedIssue_affectedLocations, "f").values();
    }
    getBounceTrackingSites() {
        return __classPrivateFieldGet(this, _AggregatedIssue_bounceTrackingSites, "f").values();
    }
    cookiesWithRequestIndicator() {
        return __classPrivateFieldGet(this, _AggregatedIssue_affectedCookies, "f").values();
    }
    getHeavyAdIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_heavyAdIssues, "f");
    }
    getCookieDeprecationMetadataIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_cookieDeprecationMetadataIssues, "f");
    }
    getMixedContentIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_mixedContentIssues, "f");
    }
    getCorsIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_corsIssues, "f");
    }
    getCspIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_cspIssues, "f");
    }
    getDeprecationIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_deprecationIssues, "f");
    }
    getLowContrastIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_lowContrastIssues, "f");
    }
    requests() {
        return __classPrivateFieldGet(this, _AggregatedIssue_affectedRequests, "f").values();
    }
    getSharedArrayBufferIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_sharedArrayBufferIssues, "f");
    }
    getQuirksModeIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_quirksModeIssues, "f");
    }
    getAttributionReportingIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_attributionReportingIssues, "f");
    }
    getGenericIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_genericIssues, "f");
    }
    getElementAccessibilityIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_elementAccessibilityIssues, "f");
    }
    getDescription() {
        if (__classPrivateFieldGet(this, _AggregatedIssue_representative, "f")) {
            return __classPrivateFieldGet(this, _AggregatedIssue_representative, "f").getDescription();
        }
        return null;
    }
    getCategory() {
        if (__classPrivateFieldGet(this, _AggregatedIssue_representative, "f")) {
            return __classPrivateFieldGet(this, _AggregatedIssue_representative, "f").getCategory();
        }
        return "Other" /* IssuesManager.Issue.IssueCategory.OTHER */;
    }
    getAggregatedIssuesCount() {
        return __classPrivateFieldGet(this, _AggregatedIssue_aggregatedIssuesCount, "f");
    }
    getPartitioningBlobURLIssues() {
        return __classPrivateFieldGet(this, _AggregatedIssue_partitioningBlobURLIssues, "f");
    }
    addInstance(issue) {
        var _a;
        __classPrivateFieldSet(this, _AggregatedIssue_aggregatedIssuesCount, (_a = __classPrivateFieldGet(this, _AggregatedIssue_aggregatedIssuesCount, "f"), _a++, _a), "f");
        if (!__classPrivateFieldGet(this, _AggregatedIssue_representative, "f")) {
            __classPrivateFieldSet(this, _AggregatedIssue_representative, issue, "f");
        }
        __classPrivateFieldSet(this, _AggregatedIssue_issueKind, IssuesManager.Issue.unionIssueKind(__classPrivateFieldGet(this, _AggregatedIssue_issueKind, "f"), issue.getKind()), "f");
        let hasRequest = false;
        for (const request of issue.requests()) {
            const { requestId } = request;
            hasRequest = true;
            if (requestId === undefined) {
                __classPrivateFieldGet(this, _AggregatedIssue_affectedRequests, "f").push(request);
            }
            else if (!__classPrivateFieldGet(this, _AggregatedIssue_affectedRequestIds, "f").has(requestId)) {
                __classPrivateFieldGet(this, _AggregatedIssue_affectedRequests, "f").push(request);
                __classPrivateFieldGet(this, _AggregatedIssue_affectedRequestIds, "f").add(requestId);
            }
        }
        for (const cookie of issue.cookies()) {
            const key = __classPrivateFieldGet(this, _AggregatedIssue_instances, "m", _AggregatedIssue_keyForCookie).call(this, cookie);
            if (!__classPrivateFieldGet(this, _AggregatedIssue_affectedCookies, "f").has(key)) {
                __classPrivateFieldGet(this, _AggregatedIssue_affectedCookies, "f").set(key, { cookie, hasRequest });
            }
        }
        for (const rawCookieLine of issue.rawCookieLines()) {
            if (!__classPrivateFieldGet(this, _AggregatedIssue_affectedRawCookieLines, "f").has(rawCookieLine)) {
                __classPrivateFieldGet(this, _AggregatedIssue_affectedRawCookieLines, "f").set(rawCookieLine, { rawCookieLine, hasRequest });
            }
        }
        for (const site of issue.trackingSites()) {
            if (!__classPrivateFieldGet(this, _AggregatedIssue_bounceTrackingSites, "f").has(site)) {
                __classPrivateFieldGet(this, _AggregatedIssue_bounceTrackingSites, "f").add(site);
            }
        }
        for (const location of issue.sources()) {
            const key = JSON.stringify(location);
            if (!__classPrivateFieldGet(this, _AggregatedIssue_affectedLocations, "f").has(key)) {
                __classPrivateFieldGet(this, _AggregatedIssue_affectedLocations, "f").set(key, location);
            }
        }
        if (issue instanceof IssuesManager.CookieDeprecationMetadataIssue.CookieDeprecationMetadataIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_cookieDeprecationMetadataIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.MixedContentIssue.MixedContentIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_mixedContentIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.HeavyAdIssue.HeavyAdIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_heavyAdIssues, "f").add(issue);
        }
        for (const details of issue.getBlockedByResponseDetails()) {
            const key = JSON.stringify(details, ['parentFrame', 'blockedFrame', 'requestId', 'frameId', 'reason', 'request']);
            __classPrivateFieldGet(this, _AggregatedIssue_blockedByResponseDetails, "f").set(key, details);
        }
        if (issue instanceof IssuesManager.ContentSecurityPolicyIssue.ContentSecurityPolicyIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_cspIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.DeprecationIssue.DeprecationIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_deprecationIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.SharedArrayBufferIssue.SharedArrayBufferIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_sharedArrayBufferIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.LowTextContrastIssue.LowTextContrastIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_lowContrastIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.CorsIssue.CorsIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_corsIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.QuirksModeIssue.QuirksModeIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_quirksModeIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.AttributionReportingIssue.AttributionReportingIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_attributionReportingIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.GenericIssue.GenericIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_genericIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.ElementAccessibilityIssue.ElementAccessibilityIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_elementAccessibilityIssues, "f").add(issue);
        }
        if (issue instanceof IssuesManager.PartitioningBlobURLIssue.PartitioningBlobURLIssue) {
            __classPrivateFieldGet(this, _AggregatedIssue_partitioningBlobURLIssues, "f").add(issue);
        }
    }
    getKind() {
        return __classPrivateFieldGet(this, _AggregatedIssue_issueKind, "f");
    }
    isHidden() {
        return __classPrivateFieldGet(this, _AggregatedIssue_representative, "f")?.isHidden() || false;
    }
    setHidden(_value) {
        throw new Error('Should not call setHidden on aggregatedIssue');
    }
}
_AggregatedIssue_affectedCookies = new WeakMap(), _AggregatedIssue_affectedRawCookieLines = new WeakMap(), _AggregatedIssue_affectedRequests = new WeakMap(), _AggregatedIssue_affectedRequestIds = new WeakMap(), _AggregatedIssue_affectedLocations = new WeakMap(), _AggregatedIssue_heavyAdIssues = new WeakMap(), _AggregatedIssue_blockedByResponseDetails = new WeakMap(), _AggregatedIssue_bounceTrackingSites = new WeakMap(), _AggregatedIssue_corsIssues = new WeakMap(), _AggregatedIssue_cspIssues = new WeakMap(), _AggregatedIssue_deprecationIssues = new WeakMap(), _AggregatedIssue_issueKind = new WeakMap(), _AggregatedIssue_lowContrastIssues = new WeakMap(), _AggregatedIssue_cookieDeprecationMetadataIssues = new WeakMap(), _AggregatedIssue_mixedContentIssues = new WeakMap(), _AggregatedIssue_partitioningBlobURLIssues = new WeakMap(), _AggregatedIssue_sharedArrayBufferIssues = new WeakMap(), _AggregatedIssue_quirksModeIssues = new WeakMap(), _AggregatedIssue_attributionReportingIssues = new WeakMap(), _AggregatedIssue_genericIssues = new WeakMap(), _AggregatedIssue_elementAccessibilityIssues = new WeakMap(), _AggregatedIssue_representative = new WeakMap(), _AggregatedIssue_aggregatedIssuesCount = new WeakMap(), _AggregatedIssue_key = new WeakMap(), _AggregatedIssue_instances = new WeakSet(), _AggregatedIssue_keyForCookie = function _AggregatedIssue_keyForCookie(cookie) {
    const { domain, path, name } = cookie;
    return `${domain};${path};${name}`;
};
export class IssueAggregator extends Common.ObjectWrapper.ObjectWrapper {
    constructor(issuesManager) {
        super();
        _IssueAggregator_instances.add(this);
        this.issuesManager = issuesManager;
        _IssueAggregator_aggregatedIssuesByKey.set(this, new Map());
        _IssueAggregator_hiddenAggregatedIssuesByKey.set(this, new Map());
        this.issuesManager.addEventListener("IssueAdded" /* IssuesManager.IssuesManager.Events.ISSUE_ADDED */, __classPrivateFieldGet(this, _IssueAggregator_instances, "m", _IssueAggregator_onIssueAdded), this);
        this.issuesManager.addEventListener("FullUpdateRequired" /* IssuesManager.IssuesManager.Events.FULL_UPDATE_REQUIRED */, __classPrivateFieldGet(this, _IssueAggregator_instances, "m", _IssueAggregator_onFullUpdateRequired), this);
        for (const issue of this.issuesManager.issues()) {
            __classPrivateFieldGet(this, _IssueAggregator_instances, "m", _IssueAggregator_aggregateIssue).call(this, issue);
        }
    }
    aggregatedIssues() {
        return [...__classPrivateFieldGet(this, _IssueAggregator_aggregatedIssuesByKey, "f").values(), ...__classPrivateFieldGet(this, _IssueAggregator_hiddenAggregatedIssuesByKey, "f").values()];
    }
    aggregatedIssueCodes() {
        return new Set([...__classPrivateFieldGet(this, _IssueAggregator_aggregatedIssuesByKey, "f").keys(), ...__classPrivateFieldGet(this, _IssueAggregator_hiddenAggregatedIssuesByKey, "f").keys()]);
    }
    aggregatedIssueCategories() {
        const result = new Set();
        for (const issue of __classPrivateFieldGet(this, _IssueAggregator_aggregatedIssuesByKey, "f").values()) {
            result.add(issue.getCategory());
        }
        return result;
    }
    aggregatedIssueKinds() {
        const result = new Set();
        for (const issue of __classPrivateFieldGet(this, _IssueAggregator_aggregatedIssuesByKey, "f").values()) {
            result.add(issue.getKind());
        }
        return result;
    }
    numberOfAggregatedIssues() {
        return __classPrivateFieldGet(this, _IssueAggregator_aggregatedIssuesByKey, "f").size;
    }
    numberOfHiddenAggregatedIssues() {
        return __classPrivateFieldGet(this, _IssueAggregator_hiddenAggregatedIssuesByKey, "f").size;
    }
    keyForIssue(issue) {
        return issue.code();
    }
}
_IssueAggregator_aggregatedIssuesByKey = new WeakMap(), _IssueAggregator_hiddenAggregatedIssuesByKey = new WeakMap(), _IssueAggregator_instances = new WeakSet(), _IssueAggregator_onIssueAdded = function _IssueAggregator_onIssueAdded(event) {
    __classPrivateFieldGet(this, _IssueAggregator_instances, "m", _IssueAggregator_aggregateIssue).call(this, event.data.issue);
}, _IssueAggregator_onFullUpdateRequired = function _IssueAggregator_onFullUpdateRequired() {
    __classPrivateFieldGet(this, _IssueAggregator_aggregatedIssuesByKey, "f").clear();
    __classPrivateFieldGet(this, _IssueAggregator_hiddenAggregatedIssuesByKey, "f").clear();
    for (const issue of this.issuesManager.issues()) {
        __classPrivateFieldGet(this, _IssueAggregator_instances, "m", _IssueAggregator_aggregateIssue).call(this, issue);
    }
    this.dispatchEventToListeners("FullUpdateRequired" /* Events.FULL_UPDATE_REQUIRED */);
}, _IssueAggregator_aggregateIssue = function _IssueAggregator_aggregateIssue(issue) {
    if (IssuesManager.CookieIssue.CookieIssue.isThirdPartyCookiePhaseoutRelatedIssue(issue)) {
        return;
    }
    const map = issue.isHidden() ? __classPrivateFieldGet(this, _IssueAggregator_hiddenAggregatedIssuesByKey, "f") : __classPrivateFieldGet(this, _IssueAggregator_aggregatedIssuesByKey, "f");
    const aggregatedIssue = __classPrivateFieldGet(this, _IssueAggregator_instances, "m", _IssueAggregator_aggregateIssueByStatus).call(this, map, issue);
    this.dispatchEventToListeners("AggregatedIssueUpdated" /* Events.AGGREGATED_ISSUE_UPDATED */, aggregatedIssue);
    return aggregatedIssue;
}, _IssueAggregator_aggregateIssueByStatus = function _IssueAggregator_aggregateIssueByStatus(aggregatedIssuesMap, issue) {
    const key = issue.code();
    let aggregatedIssue = aggregatedIssuesMap.get(key);
    if (!aggregatedIssue) {
        aggregatedIssue = new AggregatedIssue(issue.code(), key);
        aggregatedIssuesMap.set(key, aggregatedIssue);
    }
    aggregatedIssue.addInstance(issue);
    return aggregatedIssue;
};
export var Events;
(function (Events) {
    Events["AGGREGATED_ISSUE_UPDATED"] = "AggregatedIssueUpdated";
    Events["FULL_UPDATE_REQUIRED"] = "FullUpdateRequired";
})(Events || (Events = {}));
//# sourceMappingURL=IssueAggregator.js.map