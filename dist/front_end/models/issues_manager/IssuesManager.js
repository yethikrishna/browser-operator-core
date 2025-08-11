// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _IssuesManager_instances, _IssuesManager_eventListeners, _IssuesManager_allIssues, _IssuesManager_filteredIssues, _IssuesManager_issueCounts, _IssuesManager_hiddenIssueCount, _IssuesManager_thirdPartyCookiePhaseoutIssueCount, _IssuesManager_issuesById, _IssuesManager_issuesByOutermostTarget, _IssuesManager_thirdPartyCookiePhaseoutIssueMessageSent, _IssuesManager_onPrimaryPageChanged, _IssuesManager_onFrameAddedToTarget, _IssuesManager_onIssueAddedEvent, _IssuesManager_issueFilter, _IssuesManager_updateIssueHiddenStatus, _IssuesManager_updateFilteredIssues;
import * as Common from '../../core/common/common.js';
import * as Root from '../../core/root/root.js';
import * as SDK from '../../core/sdk/sdk.js';
import { AttributionReportingIssue } from './AttributionReportingIssue.js';
import { BounceTrackingIssue } from './BounceTrackingIssue.js';
import { ClientHintIssue } from './ClientHintIssue.js';
import { ContentSecurityPolicyIssue } from './ContentSecurityPolicyIssue.js';
import { CookieDeprecationMetadataIssue } from './CookieDeprecationMetadataIssue.js';
import { CookieIssue } from './CookieIssue.js';
import { CorsIssue } from './CorsIssue.js';
import { CrossOriginEmbedderPolicyIssue, isCrossOriginEmbedderPolicyIssue } from './CrossOriginEmbedderPolicyIssue.js';
import { DeprecationIssue } from './DeprecationIssue.js';
import { ElementAccessibilityIssue } from './ElementAccessibilityIssue.js';
import { FederatedAuthRequestIssue } from './FederatedAuthRequestIssue.js';
import { GenericIssue } from './GenericIssue.js';
import { HeavyAdIssue } from './HeavyAdIssue.js';
import { LowTextContrastIssue } from './LowTextContrastIssue.js';
import { MixedContentIssue } from './MixedContentIssue.js';
import { PartitioningBlobURLIssue } from './PartitioningBlobURLIssue.js';
import { PropertyRuleIssue } from './PropertyRuleIssue.js';
import { QuirksModeIssue } from './QuirksModeIssue.js';
import { SharedArrayBufferIssue } from './SharedArrayBufferIssue.js';
import { SharedDictionaryIssue } from './SharedDictionaryIssue.js';
import { SourceFrameIssuesManager } from './SourceFrameIssuesManager.js';
import { SRIMessageSignatureIssue } from './SRIMessageSignatureIssue.js';
import { StylesheetLoadingIssue } from './StylesheetLoadingIssue.js';
import { UserReidentificationIssue } from './UserReidentificationIssue.js';
export { Events } from './IssuesManagerEvents.js';
let issuesManagerInstance = null;
function createIssuesForBlockedByResponseIssue(issuesModel, inspectorIssue) {
    const blockedByResponseIssueDetails = inspectorIssue.details.blockedByResponseIssueDetails;
    if (!blockedByResponseIssueDetails) {
        console.warn('BlockedByResponse issue without details received.');
        return [];
    }
    if (isCrossOriginEmbedderPolicyIssue(blockedByResponseIssueDetails.reason)) {
        return [new CrossOriginEmbedderPolicyIssue(blockedByResponseIssueDetails, issuesModel)];
    }
    return [];
}
const issueCodeHandlers = new Map([
    [
        "CookieIssue" /* Protocol.Audits.InspectorIssueCode.CookieIssue */,
        CookieIssue.fromInspectorIssue,
    ],
    [
        "MixedContentIssue" /* Protocol.Audits.InspectorIssueCode.MixedContentIssue */,
        MixedContentIssue.fromInspectorIssue,
    ],
    [
        "HeavyAdIssue" /* Protocol.Audits.InspectorIssueCode.HeavyAdIssue */,
        HeavyAdIssue.fromInspectorIssue,
    ],
    [
        "ContentSecurityPolicyIssue" /* Protocol.Audits.InspectorIssueCode.ContentSecurityPolicyIssue */,
        ContentSecurityPolicyIssue.fromInspectorIssue,
    ],
    ["BlockedByResponseIssue" /* Protocol.Audits.InspectorIssueCode.BlockedByResponseIssue */, createIssuesForBlockedByResponseIssue],
    [
        "SharedArrayBufferIssue" /* Protocol.Audits.InspectorIssueCode.SharedArrayBufferIssue */,
        SharedArrayBufferIssue.fromInspectorIssue,
    ],
    [
        "SharedDictionaryIssue" /* Protocol.Audits.InspectorIssueCode.SharedDictionaryIssue */,
        SharedDictionaryIssue.fromInspectorIssue,
    ],
    [
        "LowTextContrastIssue" /* Protocol.Audits.InspectorIssueCode.LowTextContrastIssue */,
        LowTextContrastIssue.fromInspectorIssue,
    ],
    [
        "CorsIssue" /* Protocol.Audits.InspectorIssueCode.CorsIssue */,
        CorsIssue.fromInspectorIssue,
    ],
    [
        "QuirksModeIssue" /* Protocol.Audits.InspectorIssueCode.QuirksModeIssue */,
        QuirksModeIssue.fromInspectorIssue,
    ],
    [
        "AttributionReportingIssue" /* Protocol.Audits.InspectorIssueCode.AttributionReportingIssue */,
        AttributionReportingIssue.fromInspectorIssue,
    ],
    [
        "GenericIssue" /* Protocol.Audits.InspectorIssueCode.GenericIssue */,
        GenericIssue.fromInspectorIssue,
    ],
    [
        "DeprecationIssue" /* Protocol.Audits.InspectorIssueCode.DeprecationIssue */,
        DeprecationIssue.fromInspectorIssue,
    ],
    [
        "ClientHintIssue" /* Protocol.Audits.InspectorIssueCode.ClientHintIssue */,
        ClientHintIssue.fromInspectorIssue,
    ],
    [
        "FederatedAuthRequestIssue" /* Protocol.Audits.InspectorIssueCode.FederatedAuthRequestIssue */,
        FederatedAuthRequestIssue.fromInspectorIssue,
    ],
    [
        "BounceTrackingIssue" /* Protocol.Audits.InspectorIssueCode.BounceTrackingIssue */,
        BounceTrackingIssue.fromInspectorIssue,
    ],
    [
        "StylesheetLoadingIssue" /* Protocol.Audits.InspectorIssueCode.StylesheetLoadingIssue */,
        StylesheetLoadingIssue.fromInspectorIssue,
    ],
    [
        "PartitioningBlobURLIssue" /* Protocol.Audits.InspectorIssueCode.PartitioningBlobURLIssue */,
        PartitioningBlobURLIssue.fromInspectorIssue,
    ],
    [
        "PropertyRuleIssue" /* Protocol.Audits.InspectorIssueCode.PropertyRuleIssue */,
        PropertyRuleIssue.fromInspectorIssue,
    ],
    [
        "CookieDeprecationMetadataIssue" /* Protocol.Audits.InspectorIssueCode.CookieDeprecationMetadataIssue */,
        CookieDeprecationMetadataIssue.fromInspectorIssue,
    ],
    [
        "ElementAccessibilityIssue" /* Protocol.Audits.InspectorIssueCode.ElementAccessibilityIssue */,
        ElementAccessibilityIssue.fromInspectorIssue,
    ],
    [
        "SRIMessageSignatureIssue" /* Protocol.Audits.InspectorIssueCode.SRIMessageSignatureIssue */,
        SRIMessageSignatureIssue.fromInspectorIssue,
    ],
    [
        "UserReidentificationIssue" /* Protocol.Audits.InspectorIssueCode.UserReidentificationIssue */,
        UserReidentificationIssue.fromInspectorIssue,
    ],
]);
/**
 * Each issue reported by the backend can result in multiple `Issue` instances.
 * Handlers are simple functions hard-coded into a map.
 */
export function createIssuesFromProtocolIssue(issuesModel, inspectorIssue) {
    const handler = issueCodeHandlers.get(inspectorIssue.code);
    if (handler) {
        return handler(issuesModel, inspectorIssue);
    }
    console.warn(`No handler registered for issue code ${inspectorIssue.code}`);
    return [];
}
export var IssueStatus;
(function (IssueStatus) {
    IssueStatus["HIDDEN"] = "Hidden";
    IssueStatus["UNHIDDEN"] = "Unhidden";
})(IssueStatus || (IssueStatus = {}));
export function defaultHideIssueByCodeSetting() {
    const setting = {};
    return setting;
}
export function getHideIssueByCodeSetting() {
    return Common.Settings.Settings.instance().createSetting('hide-issue-by-code-setting-experiment-2021', defaultHideIssueByCodeSetting());
}
/**
 * The `IssuesManager` is the central storage for issues. It collects issues from all the
 * `IssuesModel` instances in the page, and deduplicates them wrt their primary key.
 * It also takes care of clearing the issues when it sees a main-frame navigated event.
 * Any client can subscribe to the events provided, and/or query the issues via the public
 * interface.
 *
 * Additionally, the `IssuesManager` can filter Issues. All Issues are stored, but only
 * Issues that are accepted by the filter cause events to be fired or are returned by
 * `IssuesManager#issues()`.
 */
export class IssuesManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor(showThirdPartyIssuesSetting, hideIssueSetting) {
        super();
        _IssuesManager_instances.add(this);
        this.showThirdPartyIssuesSetting = showThirdPartyIssuesSetting;
        this.hideIssueSetting = hideIssueSetting;
        _IssuesManager_eventListeners.set(this, new WeakMap());
        _IssuesManager_allIssues.set(this, new Map());
        _IssuesManager_filteredIssues.set(this, new Map());
        _IssuesManager_issueCounts.set(this, new Map());
        _IssuesManager_hiddenIssueCount.set(this, new Map());
        _IssuesManager_thirdPartyCookiePhaseoutIssueCount.set(this, new Map());
        _IssuesManager_issuesById.set(this, new Map());
        _IssuesManager_issuesByOutermostTarget.set(this, new Map());
        _IssuesManager_thirdPartyCookiePhaseoutIssueMessageSent.set(this, false);
        new SourceFrameIssuesManager(this);
        SDK.TargetManager.TargetManager.instance().observeModels(SDK.IssuesModel.IssuesModel, this);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.ResourceTreeModel.ResourceTreeModel, SDK.ResourceTreeModel.Events.PrimaryPageChanged, __classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_onPrimaryPageChanged), this);
        SDK.FrameManager.FrameManager.instance().addEventListener("FrameAddedToTarget" /* SDK.FrameManager.Events.FRAME_ADDED_TO_TARGET */, __classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_onFrameAddedToTarget), this);
        // issueFilter uses the 'show-third-party-issues' setting. Clients of IssuesManager need
        // a full update when the setting changes to get an up-to-date issues list.
        this.showThirdPartyIssuesSetting?.addChangeListener(() => __classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_updateFilteredIssues).call(this));
        this.hideIssueSetting?.addChangeListener(() => __classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_updateFilteredIssues).call(this));
        SDK.TargetManager.TargetManager.instance().observeTargets({
            targetAdded: (target) => {
                if (target.outermostTarget() === target) {
                    __classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_updateFilteredIssues).call(this);
                }
            },
            targetRemoved: (_) => { },
        }, { scoped: true });
    }
    static instance(opts = {
        forceNew: false,
        ensureFirst: false,
    }) {
        if (issuesManagerInstance && opts.ensureFirst) {
            throw new Error('IssuesManager was already created. Either set "ensureFirst" to false or make sure that this invocation is really the first one.');
        }
        if (!issuesManagerInstance || opts.forceNew) {
            issuesManagerInstance = new IssuesManager(opts.showThirdPartyIssuesSetting, opts.hideIssueSetting);
        }
        return issuesManagerInstance;
    }
    static removeInstance() {
        issuesManagerInstance = null;
    }
    modelAdded(issuesModel) {
        const listener = issuesModel.addEventListener("IssueAdded" /* SDK.IssuesModel.Events.ISSUE_ADDED */, __classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_onIssueAddedEvent), this);
        __classPrivateFieldGet(this, _IssuesManager_eventListeners, "f").set(issuesModel, listener);
    }
    modelRemoved(issuesModel) {
        const listener = __classPrivateFieldGet(this, _IssuesManager_eventListeners, "f").get(issuesModel);
        if (listener) {
            Common.EventTarget.removeEventListeners([listener]);
        }
    }
    addIssue(issuesModel, issue) {
        // Ignore issues without proper description; they are invisible to the user and only cause confusion.
        if (!issue.getDescription()) {
            return;
        }
        const primaryKey = issue.primaryKey();
        if (__classPrivateFieldGet(this, _IssuesManager_allIssues, "f").has(primaryKey)) {
            return;
        }
        __classPrivateFieldGet(this, _IssuesManager_allIssues, "f").set(primaryKey, issue);
        const outermostTarget = issuesModel.target().outermostTarget();
        if (outermostTarget) {
            let issuesForTarget = __classPrivateFieldGet(this, _IssuesManager_issuesByOutermostTarget, "f").get(outermostTarget);
            if (!issuesForTarget) {
                issuesForTarget = new Set();
                __classPrivateFieldGet(this, _IssuesManager_issuesByOutermostTarget, "f").set(outermostTarget, issuesForTarget);
            }
            issuesForTarget.add(issue);
        }
        if (__classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_issueFilter).call(this, issue)) {
            __classPrivateFieldGet(this, _IssuesManager_filteredIssues, "f").set(primaryKey, issue);
            __classPrivateFieldGet(this, _IssuesManager_issueCounts, "f").set(issue.getKind(), 1 + (__classPrivateFieldGet(this, _IssuesManager_issueCounts, "f").get(issue.getKind()) || 0));
            const issueId = issue.getIssueId();
            if (issueId) {
                __classPrivateFieldGet(this, _IssuesManager_issuesById, "f").set(issueId, issue);
            }
            const values = this.hideIssueSetting?.get();
            __classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_updateIssueHiddenStatus).call(this, issue, values);
            if (CookieIssue.isThirdPartyCookiePhaseoutRelatedIssue(issue)) {
                __classPrivateFieldGet(this, _IssuesManager_thirdPartyCookiePhaseoutIssueCount, "f").set(issue.getKind(), 1 + (__classPrivateFieldGet(this, _IssuesManager_thirdPartyCookiePhaseoutIssueCount, "f").get(issue.getKind()) || 0));
            }
            else if (issue.isHidden()) {
                __classPrivateFieldGet(this, _IssuesManager_hiddenIssueCount, "f").set(issue.getKind(), 1 + (__classPrivateFieldGet(this, _IssuesManager_hiddenIssueCount, "f").get(issue.getKind()) || 0));
            }
            this.dispatchEventToListeners("IssueAdded" /* Events.ISSUE_ADDED */, { issuesModel, issue });
        }
        // Always fire the "count" event even if the issue was filtered out.
        // The result of `hasOnlyThirdPartyIssues` could still change.
        this.dispatchEventToListeners("IssuesCountUpdated" /* Events.ISSUES_COUNT_UPDATED */);
    }
    issues() {
        return __classPrivateFieldGet(this, _IssuesManager_filteredIssues, "f").values();
    }
    numberOfIssues(kind) {
        if (kind) {
            return (__classPrivateFieldGet(this, _IssuesManager_issueCounts, "f").get(kind) ?? 0) - this.numberOfHiddenIssues(kind) -
                this.numberOfThirdPartyCookiePhaseoutIssues(kind);
        }
        return __classPrivateFieldGet(this, _IssuesManager_filteredIssues, "f").size - this.numberOfHiddenIssues() - this.numberOfThirdPartyCookiePhaseoutIssues();
    }
    numberOfHiddenIssues(kind) {
        if (kind) {
            return __classPrivateFieldGet(this, _IssuesManager_hiddenIssueCount, "f").get(kind) ?? 0;
        }
        let count = 0;
        for (const num of __classPrivateFieldGet(this, _IssuesManager_hiddenIssueCount, "f").values()) {
            count += num;
        }
        return count;
    }
    numberOfThirdPartyCookiePhaseoutIssues(kind) {
        if (kind) {
            return __classPrivateFieldGet(this, _IssuesManager_thirdPartyCookiePhaseoutIssueCount, "f").get(kind) ?? 0;
        }
        let count = 0;
        for (const num of __classPrivateFieldGet(this, _IssuesManager_thirdPartyCookiePhaseoutIssueCount, "f").values()) {
            count += num;
        }
        return count;
    }
    numberOfAllStoredIssues() {
        return __classPrivateFieldGet(this, _IssuesManager_allIssues, "f").size;
    }
    unhideAllIssues() {
        for (const issue of __classPrivateFieldGet(this, _IssuesManager_allIssues, "f").values()) {
            issue.setHidden(false);
        }
        this.hideIssueSetting?.set(defaultHideIssueByCodeSetting());
    }
    getIssueById(id) {
        return __classPrivateFieldGet(this, _IssuesManager_issuesById, "f").get(id);
    }
}
_IssuesManager_eventListeners = new WeakMap(), _IssuesManager_allIssues = new WeakMap(), _IssuesManager_filteredIssues = new WeakMap(), _IssuesManager_issueCounts = new WeakMap(), _IssuesManager_hiddenIssueCount = new WeakMap(), _IssuesManager_thirdPartyCookiePhaseoutIssueCount = new WeakMap(), _IssuesManager_issuesById = new WeakMap(), _IssuesManager_issuesByOutermostTarget = new WeakMap(), _IssuesManager_thirdPartyCookiePhaseoutIssueMessageSent = new WeakMap(), _IssuesManager_instances = new WeakSet(), _IssuesManager_onPrimaryPageChanged = function _IssuesManager_onPrimaryPageChanged(event) {
    const { frame, type } = event.data;
    const keptIssues = new Map();
    for (const [key, issue] of __classPrivateFieldGet(this, _IssuesManager_allIssues, "f").entries()) {
        if (issue.isAssociatedWithRequestId(frame.loaderId)) {
            keptIssues.set(key, issue);
            // Keep issues for prerendered target alive in case of prerender-activation.
        }
        else if ((type === "Activation" /* SDK.ResourceTreeModel.PrimaryPageChangeType.ACTIVATION */) &&
            (frame.resourceTreeModel().target() === issue.model()?.target())) {
            keptIssues.set(key, issue);
            // Keep BounceTrackingIssues alive for non-user-initiated navigations.
        }
        else if (issue.code() === "BounceTrackingIssue" /* Protocol.Audits.InspectorIssueCode.BounceTrackingIssue */ ||
            issue.code() === "CookieIssue" /* Protocol.Audits.InspectorIssueCode.CookieIssue */) {
            const networkManager = frame.resourceTreeModel().target().model(SDK.NetworkManager.NetworkManager);
            if (networkManager?.requestForLoaderId(frame.loaderId)?.hasUserGesture() === false) {
                keptIssues.set(key, issue);
            }
        }
    }
    __classPrivateFieldSet(this, _IssuesManager_allIssues, keptIssues, "f");
    __classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_updateFilteredIssues).call(this);
}, _IssuesManager_onFrameAddedToTarget = function _IssuesManager_onFrameAddedToTarget(event) {
    const { frame } = event.data;
    // Determining third-party status usually requires the registered domain of the outermost frame.
    // When DevTools is opened after navigation has completed, issues may be received
    // before the outermost frame is available. Thus, we trigger a recalcuation of third-party-ness
    // when we attach to the outermost frame.
    if (frame.isOutermostFrame() && SDK.TargetManager.TargetManager.instance().isInScope(frame.resourceTreeModel())) {
        __classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_updateFilteredIssues).call(this);
    }
}, _IssuesManager_onIssueAddedEvent = function _IssuesManager_onIssueAddedEvent(event) {
    const { issuesModel, inspectorIssue } = event.data;
    const isPrivacyUiEnabled = Root.Runtime.hostConfig.devToolsPrivacyUI?.enabled;
    const issues = createIssuesFromProtocolIssue(issuesModel, inspectorIssue);
    for (const issue of issues) {
        this.addIssue(issuesModel, issue);
        const message = issue.maybeCreateConsoleMessage();
        if (!message) {
            continue;
        }
        // Only show one message for third-party cookie phaseout issues if the new privacy ui is enabled
        const is3rdPartyCookiePhaseoutIssue = CookieIssue.getSubCategory(issue.code()) === "ThirdPartyPhaseoutCookie" /* CookieIssueSubCategory.THIRD_PARTY_PHASEOUT_COOKIE */;
        if (!is3rdPartyCookiePhaseoutIssue || !isPrivacyUiEnabled || !__classPrivateFieldGet(this, _IssuesManager_thirdPartyCookiePhaseoutIssueMessageSent, "f")) {
            issuesModel.target().model(SDK.ConsoleModel.ConsoleModel)?.addMessage(message);
        }
        if (is3rdPartyCookiePhaseoutIssue && isPrivacyUiEnabled) {
            __classPrivateFieldSet(this, _IssuesManager_thirdPartyCookiePhaseoutIssueMessageSent, true, "f");
        }
    }
}, _IssuesManager_issueFilter = function _IssuesManager_issueFilter(issue) {
    const scopeTarget = SDK.TargetManager.TargetManager.instance().scopeTarget();
    if (!scopeTarget) {
        return false;
    }
    if (!__classPrivateFieldGet(this, _IssuesManager_issuesByOutermostTarget, "f").get(scopeTarget)?.has(issue)) {
        return false;
    }
    return this.showThirdPartyIssuesSetting?.get() || !issue.isCausedByThirdParty();
}, _IssuesManager_updateIssueHiddenStatus = function _IssuesManager_updateIssueHiddenStatus(issue, values) {
    const code = issue.code();
    // All issues are hidden via their code.
    // For hiding we check whether the issue code is present and has a value of IssueStatus.Hidden
    // assosciated with it. If all these conditions are met the issue is hidden.
    // IssueStatus is set in hidden issues menu.
    // In case a user wants to hide a specific issue, the issue code is added to "code" section
    // of our setting and its value is set to IssueStatus.Hidden. Then issue then gets hidden.
    if (values?.[code]) {
        if (values[code] === "Hidden" /* IssueStatus.HIDDEN */) {
            issue.setHidden(true);
            return;
        }
        issue.setHidden(false);
        return;
    }
}, _IssuesManager_updateFilteredIssues = function _IssuesManager_updateFilteredIssues() {
    __classPrivateFieldGet(this, _IssuesManager_filteredIssues, "f").clear();
    __classPrivateFieldGet(this, _IssuesManager_issueCounts, "f").clear();
    __classPrivateFieldGet(this, _IssuesManager_issuesById, "f").clear();
    __classPrivateFieldGet(this, _IssuesManager_hiddenIssueCount, "f").clear();
    __classPrivateFieldGet(this, _IssuesManager_thirdPartyCookiePhaseoutIssueCount, "f").clear();
    __classPrivateFieldSet(this, _IssuesManager_thirdPartyCookiePhaseoutIssueMessageSent, false, "f");
    const values = this.hideIssueSetting?.get();
    for (const [key, issue] of __classPrivateFieldGet(this, _IssuesManager_allIssues, "f")) {
        if (__classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_issueFilter).call(this, issue)) {
            __classPrivateFieldGet(this, _IssuesManager_instances, "m", _IssuesManager_updateIssueHiddenStatus).call(this, issue, values);
            __classPrivateFieldGet(this, _IssuesManager_filteredIssues, "f").set(key, issue);
            __classPrivateFieldGet(this, _IssuesManager_issueCounts, "f").set(issue.getKind(), 1 + (__classPrivateFieldGet(this, _IssuesManager_issueCounts, "f").get(issue.getKind()) ?? 0));
            if (issue.isHidden()) {
                __classPrivateFieldGet(this, _IssuesManager_hiddenIssueCount, "f").set(issue.getKind(), 1 + (__classPrivateFieldGet(this, _IssuesManager_hiddenIssueCount, "f").get(issue.getKind()) || 0));
            }
            const issueId = issue.getIssueId();
            if (issueId) {
                __classPrivateFieldGet(this, _IssuesManager_issuesById, "f").set(issueId, issue);
            }
        }
    }
    this.dispatchEventToListeners("FullUpdateRequired" /* Events.FULL_UPDATE_REQUIRED */);
    this.dispatchEventToListeners("IssuesCountUpdated" /* Events.ISSUES_COUNT_UPDATED */);
};
// @ts-expect-error
globalThis.addIssueForTest = (issue) => {
    const mainTarget = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    const issuesModel = mainTarget?.model(SDK.IssuesModel.IssuesModel);
    issuesModel?.issueAdded({ issue });
};
//# sourceMappingURL=IssuesManager.js.map