// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export var Accessibility;
(function (Accessibility) {
    /**
     * Enum of possible property types.
     */
    let AXValueType;
    (function (AXValueType) {
        AXValueType["Boolean"] = "boolean";
        AXValueType["Tristate"] = "tristate";
        AXValueType["BooleanOrUndefined"] = "booleanOrUndefined";
        AXValueType["Idref"] = "idref";
        AXValueType["IdrefList"] = "idrefList";
        AXValueType["Integer"] = "integer";
        AXValueType["Node"] = "node";
        AXValueType["NodeList"] = "nodeList";
        AXValueType["Number"] = "number";
        AXValueType["String"] = "string";
        AXValueType["ComputedString"] = "computedString";
        AXValueType["Token"] = "token";
        AXValueType["TokenList"] = "tokenList";
        AXValueType["DomRelation"] = "domRelation";
        AXValueType["Role"] = "role";
        AXValueType["InternalRole"] = "internalRole";
        AXValueType["ValueUndefined"] = "valueUndefined";
    })(AXValueType = Accessibility.AXValueType || (Accessibility.AXValueType = {}));
    /**
     * Enum of possible property sources.
     */
    let AXValueSourceType;
    (function (AXValueSourceType) {
        AXValueSourceType["Attribute"] = "attribute";
        AXValueSourceType["Implicit"] = "implicit";
        AXValueSourceType["Style"] = "style";
        AXValueSourceType["Contents"] = "contents";
        AXValueSourceType["Placeholder"] = "placeholder";
        AXValueSourceType["RelatedElement"] = "relatedElement";
    })(AXValueSourceType = Accessibility.AXValueSourceType || (Accessibility.AXValueSourceType = {}));
    /**
     * Enum of possible native property sources (as a subtype of a particular AXValueSourceType).
     */
    let AXValueNativeSourceType;
    (function (AXValueNativeSourceType) {
        AXValueNativeSourceType["Description"] = "description";
        AXValueNativeSourceType["Figcaption"] = "figcaption";
        AXValueNativeSourceType["Label"] = "label";
        AXValueNativeSourceType["Labelfor"] = "labelfor";
        AXValueNativeSourceType["Labelwrapped"] = "labelwrapped";
        AXValueNativeSourceType["Legend"] = "legend";
        AXValueNativeSourceType["Rubyannotation"] = "rubyannotation";
        AXValueNativeSourceType["Tablecaption"] = "tablecaption";
        AXValueNativeSourceType["Title"] = "title";
        AXValueNativeSourceType["Other"] = "other";
    })(AXValueNativeSourceType = Accessibility.AXValueNativeSourceType || (Accessibility.AXValueNativeSourceType = {}));
    /**
     * Values of AXProperty name:
     * - from 'busy' to 'roledescription': states which apply to every AX node
     * - from 'live' to 'root': attributes which apply to nodes in live regions
     * - from 'autocomplete' to 'valuetext': attributes which apply to widgets
     * - from 'checked' to 'selected': states which apply to widgets
     * - from 'activedescendant' to 'owns' - relationships between elements other than parent/child/sibling.
     */
    let AXPropertyName;
    (function (AXPropertyName) {
        AXPropertyName["Actions"] = "actions";
        AXPropertyName["Busy"] = "busy";
        AXPropertyName["Disabled"] = "disabled";
        AXPropertyName["Editable"] = "editable";
        AXPropertyName["Focusable"] = "focusable";
        AXPropertyName["Focused"] = "focused";
        AXPropertyName["Hidden"] = "hidden";
        AXPropertyName["HiddenRoot"] = "hiddenRoot";
        AXPropertyName["Invalid"] = "invalid";
        AXPropertyName["Keyshortcuts"] = "keyshortcuts";
        AXPropertyName["Settable"] = "settable";
        AXPropertyName["Roledescription"] = "roledescription";
        AXPropertyName["Live"] = "live";
        AXPropertyName["Atomic"] = "atomic";
        AXPropertyName["Relevant"] = "relevant";
        AXPropertyName["Root"] = "root";
        AXPropertyName["Autocomplete"] = "autocomplete";
        AXPropertyName["HasPopup"] = "hasPopup";
        AXPropertyName["Level"] = "level";
        AXPropertyName["Multiselectable"] = "multiselectable";
        AXPropertyName["Orientation"] = "orientation";
        AXPropertyName["Multiline"] = "multiline";
        AXPropertyName["Readonly"] = "readonly";
        AXPropertyName["Required"] = "required";
        AXPropertyName["Valuemin"] = "valuemin";
        AXPropertyName["Valuemax"] = "valuemax";
        AXPropertyName["Valuetext"] = "valuetext";
        AXPropertyName["Checked"] = "checked";
        AXPropertyName["Expanded"] = "expanded";
        AXPropertyName["Modal"] = "modal";
        AXPropertyName["Pressed"] = "pressed";
        AXPropertyName["Selected"] = "selected";
        AXPropertyName["Activedescendant"] = "activedescendant";
        AXPropertyName["Controls"] = "controls";
        AXPropertyName["Describedby"] = "describedby";
        AXPropertyName["Details"] = "details";
        AXPropertyName["Errormessage"] = "errormessage";
        AXPropertyName["Flowto"] = "flowto";
        AXPropertyName["Labelledby"] = "labelledby";
        AXPropertyName["Owns"] = "owns";
        AXPropertyName["Url"] = "url";
    })(AXPropertyName = Accessibility.AXPropertyName || (Accessibility.AXPropertyName = {}));
})(Accessibility || (Accessibility = {}));
export var Animation;
(function (Animation) {
    let AnimationType;
    (function (AnimationType) {
        AnimationType["CSSTransition"] = "CSSTransition";
        AnimationType["CSSAnimation"] = "CSSAnimation";
        AnimationType["WebAnimation"] = "WebAnimation";
    })(AnimationType = Animation.AnimationType || (Animation.AnimationType = {}));
})(Animation || (Animation = {}));
/**
 * Audits domain allows investigation of page violations and possible improvements.
 */
export var Audits;
(function (Audits) {
    let CookieExclusionReason;
    (function (CookieExclusionReason) {
        CookieExclusionReason["ExcludeSameSiteUnspecifiedTreatedAsLax"] = "ExcludeSameSiteUnspecifiedTreatedAsLax";
        CookieExclusionReason["ExcludeSameSiteNoneInsecure"] = "ExcludeSameSiteNoneInsecure";
        CookieExclusionReason["ExcludeSameSiteLax"] = "ExcludeSameSiteLax";
        CookieExclusionReason["ExcludeSameSiteStrict"] = "ExcludeSameSiteStrict";
        CookieExclusionReason["ExcludeInvalidSameParty"] = "ExcludeInvalidSameParty";
        CookieExclusionReason["ExcludeSamePartyCrossPartyContext"] = "ExcludeSamePartyCrossPartyContext";
        CookieExclusionReason["ExcludeDomainNonASCII"] = "ExcludeDomainNonASCII";
        CookieExclusionReason["ExcludeThirdPartyCookieBlockedInFirstPartySet"] = "ExcludeThirdPartyCookieBlockedInFirstPartySet";
        CookieExclusionReason["ExcludeThirdPartyPhaseout"] = "ExcludeThirdPartyPhaseout";
        CookieExclusionReason["ExcludePortMismatch"] = "ExcludePortMismatch";
        CookieExclusionReason["ExcludeSchemeMismatch"] = "ExcludeSchemeMismatch";
    })(CookieExclusionReason = Audits.CookieExclusionReason || (Audits.CookieExclusionReason = {}));
    let CookieWarningReason;
    (function (CookieWarningReason) {
        CookieWarningReason["WarnSameSiteUnspecifiedCrossSiteContext"] = "WarnSameSiteUnspecifiedCrossSiteContext";
        CookieWarningReason["WarnSameSiteNoneInsecure"] = "WarnSameSiteNoneInsecure";
        CookieWarningReason["WarnSameSiteUnspecifiedLaxAllowUnsafe"] = "WarnSameSiteUnspecifiedLaxAllowUnsafe";
        CookieWarningReason["WarnSameSiteStrictLaxDowngradeStrict"] = "WarnSameSiteStrictLaxDowngradeStrict";
        CookieWarningReason["WarnSameSiteStrictCrossDowngradeStrict"] = "WarnSameSiteStrictCrossDowngradeStrict";
        CookieWarningReason["WarnSameSiteStrictCrossDowngradeLax"] = "WarnSameSiteStrictCrossDowngradeLax";
        CookieWarningReason["WarnSameSiteLaxCrossDowngradeStrict"] = "WarnSameSiteLaxCrossDowngradeStrict";
        CookieWarningReason["WarnSameSiteLaxCrossDowngradeLax"] = "WarnSameSiteLaxCrossDowngradeLax";
        CookieWarningReason["WarnAttributeValueExceedsMaxSize"] = "WarnAttributeValueExceedsMaxSize";
        CookieWarningReason["WarnDomainNonASCII"] = "WarnDomainNonASCII";
        CookieWarningReason["WarnThirdPartyPhaseout"] = "WarnThirdPartyPhaseout";
        CookieWarningReason["WarnCrossSiteRedirectDowngradeChangesInclusion"] = "WarnCrossSiteRedirectDowngradeChangesInclusion";
        CookieWarningReason["WarnDeprecationTrialMetadata"] = "WarnDeprecationTrialMetadata";
        CookieWarningReason["WarnThirdPartyCookieHeuristic"] = "WarnThirdPartyCookieHeuristic";
    })(CookieWarningReason = Audits.CookieWarningReason || (Audits.CookieWarningReason = {}));
    let CookieOperation;
    (function (CookieOperation) {
        CookieOperation["SetCookie"] = "SetCookie";
        CookieOperation["ReadCookie"] = "ReadCookie";
    })(CookieOperation = Audits.CookieOperation || (Audits.CookieOperation = {}));
    /**
     * Represents the category of insight that a cookie issue falls under.
     */
    let InsightType;
    (function (InsightType) {
        InsightType["GitHubResource"] = "GitHubResource";
        InsightType["GracePeriod"] = "GracePeriod";
        InsightType["Heuristics"] = "Heuristics";
    })(InsightType = Audits.InsightType || (Audits.InsightType = {}));
    let MixedContentResolutionStatus;
    (function (MixedContentResolutionStatus) {
        MixedContentResolutionStatus["MixedContentBlocked"] = "MixedContentBlocked";
        MixedContentResolutionStatus["MixedContentAutomaticallyUpgraded"] = "MixedContentAutomaticallyUpgraded";
        MixedContentResolutionStatus["MixedContentWarning"] = "MixedContentWarning";
    })(MixedContentResolutionStatus = Audits.MixedContentResolutionStatus || (Audits.MixedContentResolutionStatus = {}));
    let MixedContentResourceType;
    (function (MixedContentResourceType) {
        MixedContentResourceType["AttributionSrc"] = "AttributionSrc";
        MixedContentResourceType["Audio"] = "Audio";
        MixedContentResourceType["Beacon"] = "Beacon";
        MixedContentResourceType["CSPReport"] = "CSPReport";
        MixedContentResourceType["Download"] = "Download";
        MixedContentResourceType["EventSource"] = "EventSource";
        MixedContentResourceType["Favicon"] = "Favicon";
        MixedContentResourceType["Font"] = "Font";
        MixedContentResourceType["Form"] = "Form";
        MixedContentResourceType["Frame"] = "Frame";
        MixedContentResourceType["Image"] = "Image";
        MixedContentResourceType["Import"] = "Import";
        MixedContentResourceType["JSON"] = "JSON";
        MixedContentResourceType["Manifest"] = "Manifest";
        MixedContentResourceType["Ping"] = "Ping";
        MixedContentResourceType["PluginData"] = "PluginData";
        MixedContentResourceType["PluginResource"] = "PluginResource";
        MixedContentResourceType["Prefetch"] = "Prefetch";
        MixedContentResourceType["Resource"] = "Resource";
        MixedContentResourceType["Script"] = "Script";
        MixedContentResourceType["ServiceWorker"] = "ServiceWorker";
        MixedContentResourceType["SharedWorker"] = "SharedWorker";
        MixedContentResourceType["SpeculationRules"] = "SpeculationRules";
        MixedContentResourceType["Stylesheet"] = "Stylesheet";
        MixedContentResourceType["Track"] = "Track";
        MixedContentResourceType["Video"] = "Video";
        MixedContentResourceType["Worker"] = "Worker";
        MixedContentResourceType["XMLHttpRequest"] = "XMLHttpRequest";
        MixedContentResourceType["XSLT"] = "XSLT";
    })(MixedContentResourceType = Audits.MixedContentResourceType || (Audits.MixedContentResourceType = {}));
    /**
     * Enum indicating the reason a response has been blocked. These reasons are
     * refinements of the net error BLOCKED_BY_RESPONSE.
     */
    let BlockedByResponseReason;
    (function (BlockedByResponseReason) {
        BlockedByResponseReason["CoepFrameResourceNeedsCoepHeader"] = "CoepFrameResourceNeedsCoepHeader";
        BlockedByResponseReason["CoopSandboxedIFrameCannotNavigateToCoopPage"] = "CoopSandboxedIFrameCannotNavigateToCoopPage";
        BlockedByResponseReason["CorpNotSameOrigin"] = "CorpNotSameOrigin";
        BlockedByResponseReason["CorpNotSameOriginAfterDefaultedToSameOriginByCoep"] = "CorpNotSameOriginAfterDefaultedToSameOriginByCoep";
        BlockedByResponseReason["CorpNotSameOriginAfterDefaultedToSameOriginByDip"] = "CorpNotSameOriginAfterDefaultedToSameOriginByDip";
        BlockedByResponseReason["CorpNotSameOriginAfterDefaultedToSameOriginByCoepAndDip"] = "CorpNotSameOriginAfterDefaultedToSameOriginByCoepAndDip";
        BlockedByResponseReason["CorpNotSameSite"] = "CorpNotSameSite";
        BlockedByResponseReason["SRIMessageSignatureMismatch"] = "SRIMessageSignatureMismatch";
    })(BlockedByResponseReason = Audits.BlockedByResponseReason || (Audits.BlockedByResponseReason = {}));
    let HeavyAdResolutionStatus;
    (function (HeavyAdResolutionStatus) {
        HeavyAdResolutionStatus["HeavyAdBlocked"] = "HeavyAdBlocked";
        HeavyAdResolutionStatus["HeavyAdWarning"] = "HeavyAdWarning";
    })(HeavyAdResolutionStatus = Audits.HeavyAdResolutionStatus || (Audits.HeavyAdResolutionStatus = {}));
    let HeavyAdReason;
    (function (HeavyAdReason) {
        HeavyAdReason["NetworkTotalLimit"] = "NetworkTotalLimit";
        HeavyAdReason["CpuTotalLimit"] = "CpuTotalLimit";
        HeavyAdReason["CpuPeakLimit"] = "CpuPeakLimit";
    })(HeavyAdReason = Audits.HeavyAdReason || (Audits.HeavyAdReason = {}));
    let ContentSecurityPolicyViolationType;
    (function (ContentSecurityPolicyViolationType) {
        ContentSecurityPolicyViolationType["KInlineViolation"] = "kInlineViolation";
        ContentSecurityPolicyViolationType["KEvalViolation"] = "kEvalViolation";
        ContentSecurityPolicyViolationType["KURLViolation"] = "kURLViolation";
        ContentSecurityPolicyViolationType["KSRIViolation"] = "kSRIViolation";
        ContentSecurityPolicyViolationType["KTrustedTypesSinkViolation"] = "kTrustedTypesSinkViolation";
        ContentSecurityPolicyViolationType["KTrustedTypesPolicyViolation"] = "kTrustedTypesPolicyViolation";
        ContentSecurityPolicyViolationType["KWasmEvalViolation"] = "kWasmEvalViolation";
    })(ContentSecurityPolicyViolationType = Audits.ContentSecurityPolicyViolationType || (Audits.ContentSecurityPolicyViolationType = {}));
    let SharedArrayBufferIssueType;
    (function (SharedArrayBufferIssueType) {
        SharedArrayBufferIssueType["TransferIssue"] = "TransferIssue";
        SharedArrayBufferIssueType["CreationIssue"] = "CreationIssue";
    })(SharedArrayBufferIssueType = Audits.SharedArrayBufferIssueType || (Audits.SharedArrayBufferIssueType = {}));
    let AttributionReportingIssueType;
    (function (AttributionReportingIssueType) {
        AttributionReportingIssueType["PermissionPolicyDisabled"] = "PermissionPolicyDisabled";
        AttributionReportingIssueType["UntrustworthyReportingOrigin"] = "UntrustworthyReportingOrigin";
        AttributionReportingIssueType["InsecureContext"] = "InsecureContext";
        AttributionReportingIssueType["InvalidHeader"] = "InvalidHeader";
        AttributionReportingIssueType["InvalidRegisterTriggerHeader"] = "InvalidRegisterTriggerHeader";
        AttributionReportingIssueType["SourceAndTriggerHeaders"] = "SourceAndTriggerHeaders";
        AttributionReportingIssueType["SourceIgnored"] = "SourceIgnored";
        AttributionReportingIssueType["TriggerIgnored"] = "TriggerIgnored";
        AttributionReportingIssueType["OsSourceIgnored"] = "OsSourceIgnored";
        AttributionReportingIssueType["OsTriggerIgnored"] = "OsTriggerIgnored";
        AttributionReportingIssueType["InvalidRegisterOsSourceHeader"] = "InvalidRegisterOsSourceHeader";
        AttributionReportingIssueType["InvalidRegisterOsTriggerHeader"] = "InvalidRegisterOsTriggerHeader";
        AttributionReportingIssueType["WebAndOsHeaders"] = "WebAndOsHeaders";
        AttributionReportingIssueType["NoWebOrOsSupport"] = "NoWebOrOsSupport";
        AttributionReportingIssueType["NavigationRegistrationWithoutTransientUserActivation"] = "NavigationRegistrationWithoutTransientUserActivation";
        AttributionReportingIssueType["InvalidInfoHeader"] = "InvalidInfoHeader";
        AttributionReportingIssueType["NoRegisterSourceHeader"] = "NoRegisterSourceHeader";
        AttributionReportingIssueType["NoRegisterTriggerHeader"] = "NoRegisterTriggerHeader";
        AttributionReportingIssueType["NoRegisterOsSourceHeader"] = "NoRegisterOsSourceHeader";
        AttributionReportingIssueType["NoRegisterOsTriggerHeader"] = "NoRegisterOsTriggerHeader";
        AttributionReportingIssueType["NavigationRegistrationUniqueScopeAlreadySet"] = "NavigationRegistrationUniqueScopeAlreadySet";
    })(AttributionReportingIssueType = Audits.AttributionReportingIssueType || (Audits.AttributionReportingIssueType = {}));
    let SharedDictionaryError;
    (function (SharedDictionaryError) {
        SharedDictionaryError["UseErrorCrossOriginNoCorsRequest"] = "UseErrorCrossOriginNoCorsRequest";
        SharedDictionaryError["UseErrorDictionaryLoadFailure"] = "UseErrorDictionaryLoadFailure";
        SharedDictionaryError["UseErrorMatchingDictionaryNotUsed"] = "UseErrorMatchingDictionaryNotUsed";
        SharedDictionaryError["UseErrorUnexpectedContentDictionaryHeader"] = "UseErrorUnexpectedContentDictionaryHeader";
        SharedDictionaryError["WriteErrorCossOriginNoCorsRequest"] = "WriteErrorCossOriginNoCorsRequest";
        SharedDictionaryError["WriteErrorDisallowedBySettings"] = "WriteErrorDisallowedBySettings";
        SharedDictionaryError["WriteErrorExpiredResponse"] = "WriteErrorExpiredResponse";
        SharedDictionaryError["WriteErrorFeatureDisabled"] = "WriteErrorFeatureDisabled";
        SharedDictionaryError["WriteErrorInsufficientResources"] = "WriteErrorInsufficientResources";
        SharedDictionaryError["WriteErrorInvalidMatchField"] = "WriteErrorInvalidMatchField";
        SharedDictionaryError["WriteErrorInvalidStructuredHeader"] = "WriteErrorInvalidStructuredHeader";
        SharedDictionaryError["WriteErrorNavigationRequest"] = "WriteErrorNavigationRequest";
        SharedDictionaryError["WriteErrorNoMatchField"] = "WriteErrorNoMatchField";
        SharedDictionaryError["WriteErrorNonListMatchDestField"] = "WriteErrorNonListMatchDestField";
        SharedDictionaryError["WriteErrorNonSecureContext"] = "WriteErrorNonSecureContext";
        SharedDictionaryError["WriteErrorNonStringIdField"] = "WriteErrorNonStringIdField";
        SharedDictionaryError["WriteErrorNonStringInMatchDestList"] = "WriteErrorNonStringInMatchDestList";
        SharedDictionaryError["WriteErrorNonStringMatchField"] = "WriteErrorNonStringMatchField";
        SharedDictionaryError["WriteErrorNonTokenTypeField"] = "WriteErrorNonTokenTypeField";
        SharedDictionaryError["WriteErrorRequestAborted"] = "WriteErrorRequestAborted";
        SharedDictionaryError["WriteErrorShuttingDown"] = "WriteErrorShuttingDown";
        SharedDictionaryError["WriteErrorTooLongIdField"] = "WriteErrorTooLongIdField";
        SharedDictionaryError["WriteErrorUnsupportedType"] = "WriteErrorUnsupportedType";
    })(SharedDictionaryError = Audits.SharedDictionaryError || (Audits.SharedDictionaryError = {}));
    let SRIMessageSignatureError;
    (function (SRIMessageSignatureError) {
        SRIMessageSignatureError["MissingSignatureHeader"] = "MissingSignatureHeader";
        SRIMessageSignatureError["MissingSignatureInputHeader"] = "MissingSignatureInputHeader";
        SRIMessageSignatureError["InvalidSignatureHeader"] = "InvalidSignatureHeader";
        SRIMessageSignatureError["InvalidSignatureInputHeader"] = "InvalidSignatureInputHeader";
        SRIMessageSignatureError["SignatureHeaderValueIsNotByteSequence"] = "SignatureHeaderValueIsNotByteSequence";
        SRIMessageSignatureError["SignatureHeaderValueIsParameterized"] = "SignatureHeaderValueIsParameterized";
        SRIMessageSignatureError["SignatureHeaderValueIsIncorrectLength"] = "SignatureHeaderValueIsIncorrectLength";
        SRIMessageSignatureError["SignatureInputHeaderMissingLabel"] = "SignatureInputHeaderMissingLabel";
        SRIMessageSignatureError["SignatureInputHeaderValueNotInnerList"] = "SignatureInputHeaderValueNotInnerList";
        SRIMessageSignatureError["SignatureInputHeaderValueMissingComponents"] = "SignatureInputHeaderValueMissingComponents";
        SRIMessageSignatureError["SignatureInputHeaderInvalidComponentType"] = "SignatureInputHeaderInvalidComponentType";
        SRIMessageSignatureError["SignatureInputHeaderInvalidComponentName"] = "SignatureInputHeaderInvalidComponentName";
        SRIMessageSignatureError["SignatureInputHeaderInvalidHeaderComponentParameter"] = "SignatureInputHeaderInvalidHeaderComponentParameter";
        SRIMessageSignatureError["SignatureInputHeaderInvalidDerivedComponentParameter"] = "SignatureInputHeaderInvalidDerivedComponentParameter";
        SRIMessageSignatureError["SignatureInputHeaderKeyIdLength"] = "SignatureInputHeaderKeyIdLength";
        SRIMessageSignatureError["SignatureInputHeaderInvalidParameter"] = "SignatureInputHeaderInvalidParameter";
        SRIMessageSignatureError["SignatureInputHeaderMissingRequiredParameters"] = "SignatureInputHeaderMissingRequiredParameters";
        SRIMessageSignatureError["ValidationFailedSignatureExpired"] = "ValidationFailedSignatureExpired";
        SRIMessageSignatureError["ValidationFailedInvalidLength"] = "ValidationFailedInvalidLength";
        SRIMessageSignatureError["ValidationFailedSignatureMismatch"] = "ValidationFailedSignatureMismatch";
        SRIMessageSignatureError["ValidationFailedIntegrityMismatch"] = "ValidationFailedIntegrityMismatch";
    })(SRIMessageSignatureError = Audits.SRIMessageSignatureError || (Audits.SRIMessageSignatureError = {}));
    let GenericIssueErrorType;
    (function (GenericIssueErrorType) {
        GenericIssueErrorType["FormLabelForNameError"] = "FormLabelForNameError";
        GenericIssueErrorType["FormDuplicateIdForInputError"] = "FormDuplicateIdForInputError";
        GenericIssueErrorType["FormInputWithNoLabelError"] = "FormInputWithNoLabelError";
        GenericIssueErrorType["FormAutocompleteAttributeEmptyError"] = "FormAutocompleteAttributeEmptyError";
        GenericIssueErrorType["FormEmptyIdAndNameAttributesForInputError"] = "FormEmptyIdAndNameAttributesForInputError";
        GenericIssueErrorType["FormAriaLabelledByToNonExistingId"] = "FormAriaLabelledByToNonExistingId";
        GenericIssueErrorType["FormInputAssignedAutocompleteValueToIdOrNameAttributeError"] = "FormInputAssignedAutocompleteValueToIdOrNameAttributeError";
        GenericIssueErrorType["FormLabelHasNeitherForNorNestedInput"] = "FormLabelHasNeitherForNorNestedInput";
        GenericIssueErrorType["FormLabelForMatchesNonExistingIdError"] = "FormLabelForMatchesNonExistingIdError";
        GenericIssueErrorType["FormInputHasWrongButWellIntendedAutocompleteValueError"] = "FormInputHasWrongButWellIntendedAutocompleteValueError";
        GenericIssueErrorType["ResponseWasBlockedByORB"] = "ResponseWasBlockedByORB";
    })(GenericIssueErrorType = Audits.GenericIssueErrorType || (Audits.GenericIssueErrorType = {}));
    let ClientHintIssueReason;
    (function (ClientHintIssueReason) {
        ClientHintIssueReason["MetaTagAllowListInvalidOrigin"] = "MetaTagAllowListInvalidOrigin";
        ClientHintIssueReason["MetaTagModifiedHTML"] = "MetaTagModifiedHTML";
    })(ClientHintIssueReason = Audits.ClientHintIssueReason || (Audits.ClientHintIssueReason = {}));
    /**
     * Represents the failure reason when a federated authentication reason fails.
     * Should be updated alongside RequestIdTokenStatus in
     * third_party/blink/public/mojom/devtools/inspector_issue.mojom to include
     * all cases except for success.
     */
    let FederatedAuthRequestIssueReason;
    (function (FederatedAuthRequestIssueReason) {
        FederatedAuthRequestIssueReason["ShouldEmbargo"] = "ShouldEmbargo";
        FederatedAuthRequestIssueReason["TooManyRequests"] = "TooManyRequests";
        FederatedAuthRequestIssueReason["WellKnownHttpNotFound"] = "WellKnownHttpNotFound";
        FederatedAuthRequestIssueReason["WellKnownNoResponse"] = "WellKnownNoResponse";
        FederatedAuthRequestIssueReason["WellKnownInvalidResponse"] = "WellKnownInvalidResponse";
        FederatedAuthRequestIssueReason["WellKnownListEmpty"] = "WellKnownListEmpty";
        FederatedAuthRequestIssueReason["WellKnownInvalidContentType"] = "WellKnownInvalidContentType";
        FederatedAuthRequestIssueReason["ConfigNotInWellKnown"] = "ConfigNotInWellKnown";
        FederatedAuthRequestIssueReason["WellKnownTooBig"] = "WellKnownTooBig";
        FederatedAuthRequestIssueReason["ConfigHttpNotFound"] = "ConfigHttpNotFound";
        FederatedAuthRequestIssueReason["ConfigNoResponse"] = "ConfigNoResponse";
        FederatedAuthRequestIssueReason["ConfigInvalidResponse"] = "ConfigInvalidResponse";
        FederatedAuthRequestIssueReason["ConfigInvalidContentType"] = "ConfigInvalidContentType";
        FederatedAuthRequestIssueReason["ClientMetadataHttpNotFound"] = "ClientMetadataHttpNotFound";
        FederatedAuthRequestIssueReason["ClientMetadataNoResponse"] = "ClientMetadataNoResponse";
        FederatedAuthRequestIssueReason["ClientMetadataInvalidResponse"] = "ClientMetadataInvalidResponse";
        FederatedAuthRequestIssueReason["ClientMetadataInvalidContentType"] = "ClientMetadataInvalidContentType";
        FederatedAuthRequestIssueReason["IdpNotPotentiallyTrustworthy"] = "IdpNotPotentiallyTrustworthy";
        FederatedAuthRequestIssueReason["DisabledInSettings"] = "DisabledInSettings";
        FederatedAuthRequestIssueReason["DisabledInFlags"] = "DisabledInFlags";
        FederatedAuthRequestIssueReason["ErrorFetchingSignin"] = "ErrorFetchingSignin";
        FederatedAuthRequestIssueReason["InvalidSigninResponse"] = "InvalidSigninResponse";
        FederatedAuthRequestIssueReason["AccountsHttpNotFound"] = "AccountsHttpNotFound";
        FederatedAuthRequestIssueReason["AccountsNoResponse"] = "AccountsNoResponse";
        FederatedAuthRequestIssueReason["AccountsInvalidResponse"] = "AccountsInvalidResponse";
        FederatedAuthRequestIssueReason["AccountsListEmpty"] = "AccountsListEmpty";
        FederatedAuthRequestIssueReason["AccountsInvalidContentType"] = "AccountsInvalidContentType";
        FederatedAuthRequestIssueReason["IdTokenHttpNotFound"] = "IdTokenHttpNotFound";
        FederatedAuthRequestIssueReason["IdTokenNoResponse"] = "IdTokenNoResponse";
        FederatedAuthRequestIssueReason["IdTokenInvalidResponse"] = "IdTokenInvalidResponse";
        FederatedAuthRequestIssueReason["IdTokenIdpErrorResponse"] = "IdTokenIdpErrorResponse";
        FederatedAuthRequestIssueReason["IdTokenCrossSiteIdpErrorResponse"] = "IdTokenCrossSiteIdpErrorResponse";
        FederatedAuthRequestIssueReason["IdTokenInvalidRequest"] = "IdTokenInvalidRequest";
        FederatedAuthRequestIssueReason["IdTokenInvalidContentType"] = "IdTokenInvalidContentType";
        FederatedAuthRequestIssueReason["ErrorIdToken"] = "ErrorIdToken";
        FederatedAuthRequestIssueReason["Canceled"] = "Canceled";
        FederatedAuthRequestIssueReason["RpPageNotVisible"] = "RpPageNotVisible";
        FederatedAuthRequestIssueReason["SilentMediationFailure"] = "SilentMediationFailure";
        FederatedAuthRequestIssueReason["ThirdPartyCookiesBlocked"] = "ThirdPartyCookiesBlocked";
        FederatedAuthRequestIssueReason["NotSignedInWithIdp"] = "NotSignedInWithIdp";
        FederatedAuthRequestIssueReason["MissingTransientUserActivation"] = "MissingTransientUserActivation";
        FederatedAuthRequestIssueReason["ReplacedByActiveMode"] = "ReplacedByActiveMode";
        FederatedAuthRequestIssueReason["InvalidFieldsSpecified"] = "InvalidFieldsSpecified";
        FederatedAuthRequestIssueReason["RelyingPartyOriginIsOpaque"] = "RelyingPartyOriginIsOpaque";
        FederatedAuthRequestIssueReason["TypeNotMatching"] = "TypeNotMatching";
        FederatedAuthRequestIssueReason["UiDismissedNoEmbargo"] = "UiDismissedNoEmbargo";
        FederatedAuthRequestIssueReason["CorsError"] = "CorsError";
        FederatedAuthRequestIssueReason["SuppressedBySegmentationPlatform"] = "SuppressedBySegmentationPlatform";
    })(FederatedAuthRequestIssueReason = Audits.FederatedAuthRequestIssueReason || (Audits.FederatedAuthRequestIssueReason = {}));
    /**
     * Represents the failure reason when a getUserInfo() call fails.
     * Should be updated alongside FederatedAuthUserInfoRequestResult in
     * third_party/blink/public/mojom/devtools/inspector_issue.mojom.
     */
    let FederatedAuthUserInfoRequestIssueReason;
    (function (FederatedAuthUserInfoRequestIssueReason) {
        FederatedAuthUserInfoRequestIssueReason["NotSameOrigin"] = "NotSameOrigin";
        FederatedAuthUserInfoRequestIssueReason["NotIframe"] = "NotIframe";
        FederatedAuthUserInfoRequestIssueReason["NotPotentiallyTrustworthy"] = "NotPotentiallyTrustworthy";
        FederatedAuthUserInfoRequestIssueReason["NoAPIPermission"] = "NoApiPermission";
        FederatedAuthUserInfoRequestIssueReason["NotSignedInWithIdp"] = "NotSignedInWithIdp";
        FederatedAuthUserInfoRequestIssueReason["NoAccountSharingPermission"] = "NoAccountSharingPermission";
        FederatedAuthUserInfoRequestIssueReason["InvalidConfigOrWellKnown"] = "InvalidConfigOrWellKnown";
        FederatedAuthUserInfoRequestIssueReason["InvalidAccountsResponse"] = "InvalidAccountsResponse";
        FederatedAuthUserInfoRequestIssueReason["NoReturningUserFromFetchedAccounts"] = "NoReturningUserFromFetchedAccounts";
    })(FederatedAuthUserInfoRequestIssueReason = Audits.FederatedAuthUserInfoRequestIssueReason || (Audits.FederatedAuthUserInfoRequestIssueReason = {}));
    let PartitioningBlobURLInfo;
    (function (PartitioningBlobURLInfo) {
        PartitioningBlobURLInfo["BlockedCrossPartitionFetching"] = "BlockedCrossPartitionFetching";
        PartitioningBlobURLInfo["EnforceNoopenerForNavigation"] = "EnforceNoopenerForNavigation";
    })(PartitioningBlobURLInfo = Audits.PartitioningBlobURLInfo || (Audits.PartitioningBlobURLInfo = {}));
    let ElementAccessibilityIssueReason;
    (function (ElementAccessibilityIssueReason) {
        ElementAccessibilityIssueReason["DisallowedSelectChild"] = "DisallowedSelectChild";
        ElementAccessibilityIssueReason["DisallowedOptGroupChild"] = "DisallowedOptGroupChild";
        ElementAccessibilityIssueReason["NonPhrasingContentOptionChild"] = "NonPhrasingContentOptionChild";
        ElementAccessibilityIssueReason["InteractiveContentOptionChild"] = "InteractiveContentOptionChild";
        ElementAccessibilityIssueReason["InteractiveContentLegendChild"] = "InteractiveContentLegendChild";
        ElementAccessibilityIssueReason["InteractiveContentSummaryDescendant"] = "InteractiveContentSummaryDescendant";
    })(ElementAccessibilityIssueReason = Audits.ElementAccessibilityIssueReason || (Audits.ElementAccessibilityIssueReason = {}));
    let StyleSheetLoadingIssueReason;
    (function (StyleSheetLoadingIssueReason) {
        StyleSheetLoadingIssueReason["LateImportRule"] = "LateImportRule";
        StyleSheetLoadingIssueReason["RequestFailed"] = "RequestFailed";
    })(StyleSheetLoadingIssueReason = Audits.StyleSheetLoadingIssueReason || (Audits.StyleSheetLoadingIssueReason = {}));
    let PropertyRuleIssueReason;
    (function (PropertyRuleIssueReason) {
        PropertyRuleIssueReason["InvalidSyntax"] = "InvalidSyntax";
        PropertyRuleIssueReason["InvalidInitialValue"] = "InvalidInitialValue";
        PropertyRuleIssueReason["InvalidInherits"] = "InvalidInherits";
        PropertyRuleIssueReason["InvalidName"] = "InvalidName";
    })(PropertyRuleIssueReason = Audits.PropertyRuleIssueReason || (Audits.PropertyRuleIssueReason = {}));
    let UserReidentificationIssueType;
    (function (UserReidentificationIssueType) {
        UserReidentificationIssueType["BlockedFrameNavigation"] = "BlockedFrameNavigation";
        UserReidentificationIssueType["BlockedSubresource"] = "BlockedSubresource";
    })(UserReidentificationIssueType = Audits.UserReidentificationIssueType || (Audits.UserReidentificationIssueType = {}));
    /**
     * A unique identifier for the type of issue. Each type may use one of the
     * optional fields in InspectorIssueDetails to convey more specific
     * information about the kind of issue.
     */
    let InspectorIssueCode;
    (function (InspectorIssueCode) {
        InspectorIssueCode["CookieIssue"] = "CookieIssue";
        InspectorIssueCode["MixedContentIssue"] = "MixedContentIssue";
        InspectorIssueCode["BlockedByResponseIssue"] = "BlockedByResponseIssue";
        InspectorIssueCode["HeavyAdIssue"] = "HeavyAdIssue";
        InspectorIssueCode["ContentSecurityPolicyIssue"] = "ContentSecurityPolicyIssue";
        InspectorIssueCode["SharedArrayBufferIssue"] = "SharedArrayBufferIssue";
        InspectorIssueCode["LowTextContrastIssue"] = "LowTextContrastIssue";
        InspectorIssueCode["CorsIssue"] = "CorsIssue";
        InspectorIssueCode["AttributionReportingIssue"] = "AttributionReportingIssue";
        InspectorIssueCode["QuirksModeIssue"] = "QuirksModeIssue";
        InspectorIssueCode["PartitioningBlobURLIssue"] = "PartitioningBlobURLIssue";
        InspectorIssueCode["NavigatorUserAgentIssue"] = "NavigatorUserAgentIssue";
        InspectorIssueCode["GenericIssue"] = "GenericIssue";
        InspectorIssueCode["DeprecationIssue"] = "DeprecationIssue";
        InspectorIssueCode["ClientHintIssue"] = "ClientHintIssue";
        InspectorIssueCode["FederatedAuthRequestIssue"] = "FederatedAuthRequestIssue";
        InspectorIssueCode["BounceTrackingIssue"] = "BounceTrackingIssue";
        InspectorIssueCode["CookieDeprecationMetadataIssue"] = "CookieDeprecationMetadataIssue";
        InspectorIssueCode["StylesheetLoadingIssue"] = "StylesheetLoadingIssue";
        InspectorIssueCode["FederatedAuthUserInfoRequestIssue"] = "FederatedAuthUserInfoRequestIssue";
        InspectorIssueCode["PropertyRuleIssue"] = "PropertyRuleIssue";
        InspectorIssueCode["SharedDictionaryIssue"] = "SharedDictionaryIssue";
        InspectorIssueCode["ElementAccessibilityIssue"] = "ElementAccessibilityIssue";
        InspectorIssueCode["SRIMessageSignatureIssue"] = "SRIMessageSignatureIssue";
        InspectorIssueCode["UserReidentificationIssue"] = "UserReidentificationIssue";
    })(InspectorIssueCode = Audits.InspectorIssueCode || (Audits.InspectorIssueCode = {}));
    let GetEncodedResponseRequestEncoding;
    (function (GetEncodedResponseRequestEncoding) {
        GetEncodedResponseRequestEncoding["Webp"] = "webp";
        GetEncodedResponseRequestEncoding["Jpeg"] = "jpeg";
        GetEncodedResponseRequestEncoding["Png"] = "png";
    })(GetEncodedResponseRequestEncoding = Audits.GetEncodedResponseRequestEncoding || (Audits.GetEncodedResponseRequestEncoding = {}));
})(Audits || (Audits = {}));
/**
 * Defines commands and events for browser extensions.
 */
export var Extensions;
(function (Extensions) {
    /**
     * Storage areas.
     */
    let StorageArea;
    (function (StorageArea) {
        StorageArea["Session"] = "session";
        StorageArea["Local"] = "local";
        StorageArea["Sync"] = "sync";
        StorageArea["Managed"] = "managed";
    })(StorageArea = Extensions.StorageArea || (Extensions.StorageArea = {}));
})(Extensions || (Extensions = {}));
/**
 * Defines commands and events for Autofill.
 */
export var Autofill;
(function (Autofill) {
    /**
     * Specified whether a filled field was done so by using the html autocomplete attribute or autofill heuristics.
     */
    let FillingStrategy;
    (function (FillingStrategy) {
        FillingStrategy["AutocompleteAttribute"] = "autocompleteAttribute";
        FillingStrategy["AutofillInferred"] = "autofillInferred";
    })(FillingStrategy = Autofill.FillingStrategy || (Autofill.FillingStrategy = {}));
})(Autofill || (Autofill = {}));
/**
 * Defines events for background web platform features.
 */
export var BackgroundService;
(function (BackgroundService) {
    /**
     * The Background Service that will be associated with the commands/events.
     * Every Background Service operates independently, but they share the same
     * API.
     */
    let ServiceName;
    (function (ServiceName) {
        ServiceName["BackgroundFetch"] = "backgroundFetch";
        ServiceName["BackgroundSync"] = "backgroundSync";
        ServiceName["PushMessaging"] = "pushMessaging";
        ServiceName["Notifications"] = "notifications";
        ServiceName["PaymentHandler"] = "paymentHandler";
        ServiceName["PeriodicBackgroundSync"] = "periodicBackgroundSync";
    })(ServiceName = BackgroundService.ServiceName || (BackgroundService.ServiceName = {}));
})(BackgroundService || (BackgroundService = {}));
/**
 * The Browser domain defines methods and events for browser managing.
 */
export var Browser;
(function (Browser) {
    /**
     * The state of the browser window.
     */
    let WindowState;
    (function (WindowState) {
        WindowState["Normal"] = "normal";
        WindowState["Minimized"] = "minimized";
        WindowState["Maximized"] = "maximized";
        WindowState["Fullscreen"] = "fullscreen";
    })(WindowState = Browser.WindowState || (Browser.WindowState = {}));
    let PermissionType;
    (function (PermissionType) {
        PermissionType["Ar"] = "ar";
        PermissionType["AudioCapture"] = "audioCapture";
        PermissionType["AutomaticFullscreen"] = "automaticFullscreen";
        PermissionType["BackgroundFetch"] = "backgroundFetch";
        PermissionType["BackgroundSync"] = "backgroundSync";
        PermissionType["CameraPanTiltZoom"] = "cameraPanTiltZoom";
        PermissionType["CapturedSurfaceControl"] = "capturedSurfaceControl";
        PermissionType["ClipboardReadWrite"] = "clipboardReadWrite";
        PermissionType["ClipboardSanitizedWrite"] = "clipboardSanitizedWrite";
        PermissionType["DisplayCapture"] = "displayCapture";
        PermissionType["DurableStorage"] = "durableStorage";
        PermissionType["Geolocation"] = "geolocation";
        PermissionType["HandTracking"] = "handTracking";
        PermissionType["IdleDetection"] = "idleDetection";
        PermissionType["KeyboardLock"] = "keyboardLock";
        PermissionType["LocalFonts"] = "localFonts";
        PermissionType["LocalNetworkAccess"] = "localNetworkAccess";
        PermissionType["Midi"] = "midi";
        PermissionType["MidiSysex"] = "midiSysex";
        PermissionType["Nfc"] = "nfc";
        PermissionType["Notifications"] = "notifications";
        PermissionType["PaymentHandler"] = "paymentHandler";
        PermissionType["PeriodicBackgroundSync"] = "periodicBackgroundSync";
        PermissionType["PointerLock"] = "pointerLock";
        PermissionType["ProtectedMediaIdentifier"] = "protectedMediaIdentifier";
        PermissionType["Sensors"] = "sensors";
        PermissionType["SmartCard"] = "smartCard";
        PermissionType["SpeakerSelection"] = "speakerSelection";
        PermissionType["StorageAccess"] = "storageAccess";
        PermissionType["TopLevelStorageAccess"] = "topLevelStorageAccess";
        PermissionType["VideoCapture"] = "videoCapture";
        PermissionType["Vr"] = "vr";
        PermissionType["WakeLockScreen"] = "wakeLockScreen";
        PermissionType["WakeLockSystem"] = "wakeLockSystem";
        PermissionType["WebAppInstallation"] = "webAppInstallation";
        PermissionType["WebPrinting"] = "webPrinting";
        PermissionType["WindowManagement"] = "windowManagement";
    })(PermissionType = Browser.PermissionType || (Browser.PermissionType = {}));
    let PermissionSetting;
    (function (PermissionSetting) {
        PermissionSetting["Granted"] = "granted";
        PermissionSetting["Denied"] = "denied";
        PermissionSetting["Prompt"] = "prompt";
    })(PermissionSetting = Browser.PermissionSetting || (Browser.PermissionSetting = {}));
    /**
     * Browser command ids used by executeBrowserCommand.
     */
    let BrowserCommandId;
    (function (BrowserCommandId) {
        BrowserCommandId["OpenTabSearch"] = "openTabSearch";
        BrowserCommandId["CloseTabSearch"] = "closeTabSearch";
        BrowserCommandId["OpenGlic"] = "openGlic";
    })(BrowserCommandId = Browser.BrowserCommandId || (Browser.BrowserCommandId = {}));
    let PrivacySandboxAPI;
    (function (PrivacySandboxAPI) {
        PrivacySandboxAPI["BiddingAndAuctionServices"] = "BiddingAndAuctionServices";
        PrivacySandboxAPI["TrustedKeyValue"] = "TrustedKeyValue";
    })(PrivacySandboxAPI = Browser.PrivacySandboxAPI || (Browser.PrivacySandboxAPI = {}));
    let SetDownloadBehaviorRequestBehavior;
    (function (SetDownloadBehaviorRequestBehavior) {
        SetDownloadBehaviorRequestBehavior["Deny"] = "deny";
        SetDownloadBehaviorRequestBehavior["Allow"] = "allow";
        SetDownloadBehaviorRequestBehavior["AllowAndName"] = "allowAndName";
        SetDownloadBehaviorRequestBehavior["Default"] = "default";
    })(SetDownloadBehaviorRequestBehavior = Browser.SetDownloadBehaviorRequestBehavior || (Browser.SetDownloadBehaviorRequestBehavior = {}));
    let DownloadProgressEventState;
    (function (DownloadProgressEventState) {
        DownloadProgressEventState["InProgress"] = "inProgress";
        DownloadProgressEventState["Completed"] = "completed";
        DownloadProgressEventState["Canceled"] = "canceled";
    })(DownloadProgressEventState = Browser.DownloadProgressEventState || (Browser.DownloadProgressEventState = {}));
})(Browser || (Browser = {}));
/**
 * This domain exposes CSS read/write operations. All CSS objects (stylesheets, rules, and styles)
 * have an associated `id` used in subsequent operations on the related object. Each object type has
 * a specific `id` structure, and those are not interchangeable between objects of different kinds.
 * CSS objects can be loaded using the `get*ForNode()` calls (which accept a DOM node id). A client
 * can also keep track of stylesheets via the `styleSheetAdded`/`styleSheetRemoved` events and
 * subsequently load the required stylesheet contents using the `getStyleSheet[Text]()` methods.
 */
export var CSS;
(function (CSS) {
    /**
     * Stylesheet type: "injected" for stylesheets injected via extension, "user-agent" for user-agent
     * stylesheets, "inspector" for stylesheets created by the inspector (i.e. those holding the "via
     * inspector" rules), "regular" for regular stylesheets.
     */
    let StyleSheetOrigin;
    (function (StyleSheetOrigin) {
        StyleSheetOrigin["Injected"] = "injected";
        StyleSheetOrigin["UserAgent"] = "user-agent";
        StyleSheetOrigin["Inspector"] = "inspector";
        StyleSheetOrigin["Regular"] = "regular";
    })(StyleSheetOrigin = CSS.StyleSheetOrigin || (CSS.StyleSheetOrigin = {}));
    /**
     * Enum indicating the type of a CSS rule, used to represent the order of a style rule's ancestors.
     * This list only contains rule types that are collected during the ancestor rule collection.
     */
    let CSSRuleType;
    (function (CSSRuleType) {
        CSSRuleType["MediaRule"] = "MediaRule";
        CSSRuleType["SupportsRule"] = "SupportsRule";
        CSSRuleType["ContainerRule"] = "ContainerRule";
        CSSRuleType["LayerRule"] = "LayerRule";
        CSSRuleType["ScopeRule"] = "ScopeRule";
        CSSRuleType["StyleRule"] = "StyleRule";
        CSSRuleType["StartingStyleRule"] = "StartingStyleRule";
    })(CSSRuleType = CSS.CSSRuleType || (CSS.CSSRuleType = {}));
    let CSSMediaSource;
    (function (CSSMediaSource) {
        CSSMediaSource["MediaRule"] = "mediaRule";
        CSSMediaSource["ImportRule"] = "importRule";
        CSSMediaSource["LinkedSheet"] = "linkedSheet";
        CSSMediaSource["InlineSheet"] = "inlineSheet";
    })(CSSMediaSource = CSS.CSSMediaSource || (CSS.CSSMediaSource = {}));
})(CSS || (CSS = {}));
export var CacheStorage;
(function (CacheStorage) {
    /**
     * type of HTTP response cached
     */
    let CachedResponseType;
    (function (CachedResponseType) {
        CachedResponseType["Basic"] = "basic";
        CachedResponseType["Cors"] = "cors";
        CachedResponseType["Default"] = "default";
        CachedResponseType["Error"] = "error";
        CachedResponseType["OpaqueResponse"] = "opaqueResponse";
        CachedResponseType["OpaqueRedirect"] = "opaqueRedirect";
    })(CachedResponseType = CacheStorage.CachedResponseType || (CacheStorage.CachedResponseType = {}));
})(CacheStorage || (CacheStorage = {}));
/**
 * This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object
 * that has an `id`. This `id` can be used to get additional information on the Node, resolve it into
 * the JavaScript object wrapper, etc. It is important that client receives DOM events only for the
 * nodes that are known to the client. Backend keeps track of the nodes that were sent to the client
 * and never sends the same node twice. It is client's responsibility to collect information about
 * the nodes that were sent to the client. Note that `iframe` owner elements will return
 * corresponding document elements as their child nodes.
 */
export var DOM;
(function (DOM) {
    /**
     * Pseudo element type.
     */
    let PseudoType;
    (function (PseudoType) {
        PseudoType["FirstLine"] = "first-line";
        PseudoType["FirstLetter"] = "first-letter";
        PseudoType["Checkmark"] = "checkmark";
        PseudoType["Before"] = "before";
        PseudoType["After"] = "after";
        PseudoType["PickerIcon"] = "picker-icon";
        PseudoType["Marker"] = "marker";
        PseudoType["Backdrop"] = "backdrop";
        PseudoType["Column"] = "column";
        PseudoType["Selection"] = "selection";
        PseudoType["SearchText"] = "search-text";
        PseudoType["TargetText"] = "target-text";
        PseudoType["SpellingError"] = "spelling-error";
        PseudoType["GrammarError"] = "grammar-error";
        PseudoType["Highlight"] = "highlight";
        PseudoType["FirstLineInherited"] = "first-line-inherited";
        PseudoType["ScrollMarker"] = "scroll-marker";
        PseudoType["ScrollMarkerGroup"] = "scroll-marker-group";
        PseudoType["ScrollButton"] = "scroll-button";
        PseudoType["Scrollbar"] = "scrollbar";
        PseudoType["ScrollbarThumb"] = "scrollbar-thumb";
        PseudoType["ScrollbarButton"] = "scrollbar-button";
        PseudoType["ScrollbarTrack"] = "scrollbar-track";
        PseudoType["ScrollbarTrackPiece"] = "scrollbar-track-piece";
        PseudoType["ScrollbarCorner"] = "scrollbar-corner";
        PseudoType["Resizer"] = "resizer";
        PseudoType["InputListButton"] = "input-list-button";
        PseudoType["ViewTransition"] = "view-transition";
        PseudoType["ViewTransitionGroup"] = "view-transition-group";
        PseudoType["ViewTransitionImagePair"] = "view-transition-image-pair";
        PseudoType["ViewTransitionGroupChildren"] = "view-transition-group-children";
        PseudoType["ViewTransitionOld"] = "view-transition-old";
        PseudoType["ViewTransitionNew"] = "view-transition-new";
        PseudoType["Placeholder"] = "placeholder";
        PseudoType["FileSelectorButton"] = "file-selector-button";
        PseudoType["DetailsContent"] = "details-content";
        PseudoType["Picker"] = "picker";
        PseudoType["PermissionIcon"] = "permission-icon";
    })(PseudoType = DOM.PseudoType || (DOM.PseudoType = {}));
    /**
     * Shadow root type.
     */
    let ShadowRootType;
    (function (ShadowRootType) {
        ShadowRootType["UserAgent"] = "user-agent";
        ShadowRootType["Open"] = "open";
        ShadowRootType["Closed"] = "closed";
    })(ShadowRootType = DOM.ShadowRootType || (DOM.ShadowRootType = {}));
    /**
     * Document compatibility mode.
     */
    let CompatibilityMode;
    (function (CompatibilityMode) {
        CompatibilityMode["QuirksMode"] = "QuirksMode";
        CompatibilityMode["LimitedQuirksMode"] = "LimitedQuirksMode";
        CompatibilityMode["NoQuirksMode"] = "NoQuirksMode";
    })(CompatibilityMode = DOM.CompatibilityMode || (DOM.CompatibilityMode = {}));
    /**
     * ContainerSelector physical axes
     */
    let PhysicalAxes;
    (function (PhysicalAxes) {
        PhysicalAxes["Horizontal"] = "Horizontal";
        PhysicalAxes["Vertical"] = "Vertical";
        PhysicalAxes["Both"] = "Both";
    })(PhysicalAxes = DOM.PhysicalAxes || (DOM.PhysicalAxes = {}));
    /**
     * ContainerSelector logical axes
     */
    let LogicalAxes;
    (function (LogicalAxes) {
        LogicalAxes["Inline"] = "Inline";
        LogicalAxes["Block"] = "Block";
        LogicalAxes["Both"] = "Both";
    })(LogicalAxes = DOM.LogicalAxes || (DOM.LogicalAxes = {}));
    /**
     * Physical scroll orientation
     */
    let ScrollOrientation;
    (function (ScrollOrientation) {
        ScrollOrientation["Horizontal"] = "horizontal";
        ScrollOrientation["Vertical"] = "vertical";
    })(ScrollOrientation = DOM.ScrollOrientation || (DOM.ScrollOrientation = {}));
    let EnableRequestIncludeWhitespace;
    (function (EnableRequestIncludeWhitespace) {
        EnableRequestIncludeWhitespace["None"] = "none";
        EnableRequestIncludeWhitespace["All"] = "all";
    })(EnableRequestIncludeWhitespace = DOM.EnableRequestIncludeWhitespace || (DOM.EnableRequestIncludeWhitespace = {}));
    let GetElementByRelationRequestRelation;
    (function (GetElementByRelationRequestRelation) {
        GetElementByRelationRequestRelation["PopoverTarget"] = "PopoverTarget";
        GetElementByRelationRequestRelation["InterestTarget"] = "InterestTarget";
        GetElementByRelationRequestRelation["CommandFor"] = "CommandFor";
    })(GetElementByRelationRequestRelation = DOM.GetElementByRelationRequestRelation || (DOM.GetElementByRelationRequestRelation = {}));
})(DOM || (DOM = {}));
/**
 * DOM debugging allows setting breakpoints on particular DOM operations and events. JavaScript
 * execution will stop on these operations as if there was a regular breakpoint set.
 */
export var DOMDebugger;
(function (DOMDebugger) {
    /**
     * DOM breakpoint type.
     */
    let DOMBreakpointType;
    (function (DOMBreakpointType) {
        DOMBreakpointType["SubtreeModified"] = "subtree-modified";
        DOMBreakpointType["AttributeModified"] = "attribute-modified";
        DOMBreakpointType["NodeRemoved"] = "node-removed";
    })(DOMBreakpointType = DOMDebugger.DOMBreakpointType || (DOMDebugger.DOMBreakpointType = {}));
    /**
     * CSP Violation type.
     */
    let CSPViolationType;
    (function (CSPViolationType) {
        CSPViolationType["TrustedtypeSinkViolation"] = "trustedtype-sink-violation";
        CSPViolationType["TrustedtypePolicyViolation"] = "trustedtype-policy-violation";
    })(CSPViolationType = DOMDebugger.CSPViolationType || (DOMDebugger.CSPViolationType = {}));
})(DOMDebugger || (DOMDebugger = {}));
/**
 * This domain emulates different environments for the page.
 */
export var Emulation;
(function (Emulation) {
    let ScreenOrientationType;
    (function (ScreenOrientationType) {
        ScreenOrientationType["PortraitPrimary"] = "portraitPrimary";
        ScreenOrientationType["PortraitSecondary"] = "portraitSecondary";
        ScreenOrientationType["LandscapePrimary"] = "landscapePrimary";
        ScreenOrientationType["LandscapeSecondary"] = "landscapeSecondary";
    })(ScreenOrientationType = Emulation.ScreenOrientationType || (Emulation.ScreenOrientationType = {}));
    let DisplayFeatureOrientation;
    (function (DisplayFeatureOrientation) {
        DisplayFeatureOrientation["Vertical"] = "vertical";
        DisplayFeatureOrientation["Horizontal"] = "horizontal";
    })(DisplayFeatureOrientation = Emulation.DisplayFeatureOrientation || (Emulation.DisplayFeatureOrientation = {}));
    let DevicePostureType;
    (function (DevicePostureType) {
        DevicePostureType["Continuous"] = "continuous";
        DevicePostureType["Folded"] = "folded";
    })(DevicePostureType = Emulation.DevicePostureType || (Emulation.DevicePostureType = {}));
    /**
     * advance: If the scheduler runs out of immediate work, the virtual time base may fast forward to
     * allow the next delayed task (if any) to run; pause: The virtual time base may not advance;
     * pauseIfNetworkFetchesPending: The virtual time base may not advance if there are any pending
     * resource fetches.
     */
    let VirtualTimePolicy;
    (function (VirtualTimePolicy) {
        VirtualTimePolicy["Advance"] = "advance";
        VirtualTimePolicy["Pause"] = "pause";
        VirtualTimePolicy["PauseIfNetworkFetchesPending"] = "pauseIfNetworkFetchesPending";
    })(VirtualTimePolicy = Emulation.VirtualTimePolicy || (Emulation.VirtualTimePolicy = {}));
    /**
     * Used to specify sensor types to emulate.
     * See https://w3c.github.io/sensors/#automation for more information.
     */
    let SensorType;
    (function (SensorType) {
        SensorType["AbsoluteOrientation"] = "absolute-orientation";
        SensorType["Accelerometer"] = "accelerometer";
        SensorType["AmbientLight"] = "ambient-light";
        SensorType["Gravity"] = "gravity";
        SensorType["Gyroscope"] = "gyroscope";
        SensorType["LinearAcceleration"] = "linear-acceleration";
        SensorType["Magnetometer"] = "magnetometer";
        SensorType["RelativeOrientation"] = "relative-orientation";
    })(SensorType = Emulation.SensorType || (Emulation.SensorType = {}));
    let PressureSource;
    (function (PressureSource) {
        PressureSource["Cpu"] = "cpu";
    })(PressureSource = Emulation.PressureSource || (Emulation.PressureSource = {}));
    let PressureState;
    (function (PressureState) {
        PressureState["Nominal"] = "nominal";
        PressureState["Fair"] = "fair";
        PressureState["Serious"] = "serious";
        PressureState["Critical"] = "critical";
    })(PressureState = Emulation.PressureState || (Emulation.PressureState = {}));
    /**
     * Enum of image types that can be disabled.
     */
    let DisabledImageType;
    (function (DisabledImageType) {
        DisabledImageType["Avif"] = "avif";
        DisabledImageType["Webp"] = "webp";
    })(DisabledImageType = Emulation.DisabledImageType || (Emulation.DisabledImageType = {}));
    let SetEmitTouchEventsForMouseRequestConfiguration;
    (function (SetEmitTouchEventsForMouseRequestConfiguration) {
        SetEmitTouchEventsForMouseRequestConfiguration["Mobile"] = "mobile";
        SetEmitTouchEventsForMouseRequestConfiguration["Desktop"] = "desktop";
    })(SetEmitTouchEventsForMouseRequestConfiguration = Emulation.SetEmitTouchEventsForMouseRequestConfiguration || (Emulation.SetEmitTouchEventsForMouseRequestConfiguration = {}));
    let SetEmulatedVisionDeficiencyRequestType;
    (function (SetEmulatedVisionDeficiencyRequestType) {
        SetEmulatedVisionDeficiencyRequestType["None"] = "none";
        SetEmulatedVisionDeficiencyRequestType["BlurredVision"] = "blurredVision";
        SetEmulatedVisionDeficiencyRequestType["ReducedContrast"] = "reducedContrast";
        SetEmulatedVisionDeficiencyRequestType["Achromatopsia"] = "achromatopsia";
        SetEmulatedVisionDeficiencyRequestType["Deuteranopia"] = "deuteranopia";
        SetEmulatedVisionDeficiencyRequestType["Protanopia"] = "protanopia";
        SetEmulatedVisionDeficiencyRequestType["Tritanopia"] = "tritanopia";
    })(SetEmulatedVisionDeficiencyRequestType = Emulation.SetEmulatedVisionDeficiencyRequestType || (Emulation.SetEmulatedVisionDeficiencyRequestType = {}));
})(Emulation || (Emulation = {}));
/**
 * This domain provides experimental commands only supported in headless mode.
 */
export var HeadlessExperimental;
(function (HeadlessExperimental) {
    let ScreenshotParamsFormat;
    (function (ScreenshotParamsFormat) {
        ScreenshotParamsFormat["Jpeg"] = "jpeg";
        ScreenshotParamsFormat["Png"] = "png";
        ScreenshotParamsFormat["Webp"] = "webp";
    })(ScreenshotParamsFormat = HeadlessExperimental.ScreenshotParamsFormat || (HeadlessExperimental.ScreenshotParamsFormat = {}));
})(HeadlessExperimental || (HeadlessExperimental = {}));
export var IndexedDB;
(function (IndexedDB) {
    let KeyType;
    (function (KeyType) {
        KeyType["Number"] = "number";
        KeyType["String"] = "string";
        KeyType["Date"] = "date";
        KeyType["Array"] = "array";
    })(KeyType = IndexedDB.KeyType || (IndexedDB.KeyType = {}));
    let KeyPathType;
    (function (KeyPathType) {
        KeyPathType["Null"] = "null";
        KeyPathType["String"] = "string";
        KeyPathType["Array"] = "array";
    })(KeyPathType = IndexedDB.KeyPathType || (IndexedDB.KeyPathType = {}));
})(IndexedDB || (IndexedDB = {}));
export var Input;
(function (Input) {
    let GestureSourceType;
    (function (GestureSourceType) {
        GestureSourceType["Default"] = "default";
        GestureSourceType["Touch"] = "touch";
        GestureSourceType["Mouse"] = "mouse";
    })(GestureSourceType = Input.GestureSourceType || (Input.GestureSourceType = {}));
    let MouseButton;
    (function (MouseButton) {
        MouseButton["None"] = "none";
        MouseButton["Left"] = "left";
        MouseButton["Middle"] = "middle";
        MouseButton["Right"] = "right";
        MouseButton["Back"] = "back";
        MouseButton["Forward"] = "forward";
    })(MouseButton = Input.MouseButton || (Input.MouseButton = {}));
    let DispatchDragEventRequestType;
    (function (DispatchDragEventRequestType) {
        DispatchDragEventRequestType["DragEnter"] = "dragEnter";
        DispatchDragEventRequestType["DragOver"] = "dragOver";
        DispatchDragEventRequestType["Drop"] = "drop";
        DispatchDragEventRequestType["DragCancel"] = "dragCancel";
    })(DispatchDragEventRequestType = Input.DispatchDragEventRequestType || (Input.DispatchDragEventRequestType = {}));
    let DispatchKeyEventRequestType;
    (function (DispatchKeyEventRequestType) {
        DispatchKeyEventRequestType["KeyDown"] = "keyDown";
        DispatchKeyEventRequestType["KeyUp"] = "keyUp";
        DispatchKeyEventRequestType["RawKeyDown"] = "rawKeyDown";
        DispatchKeyEventRequestType["Char"] = "char";
    })(DispatchKeyEventRequestType = Input.DispatchKeyEventRequestType || (Input.DispatchKeyEventRequestType = {}));
    let DispatchMouseEventRequestType;
    (function (DispatchMouseEventRequestType) {
        DispatchMouseEventRequestType["MousePressed"] = "mousePressed";
        DispatchMouseEventRequestType["MouseReleased"] = "mouseReleased";
        DispatchMouseEventRequestType["MouseMoved"] = "mouseMoved";
        DispatchMouseEventRequestType["MouseWheel"] = "mouseWheel";
    })(DispatchMouseEventRequestType = Input.DispatchMouseEventRequestType || (Input.DispatchMouseEventRequestType = {}));
    let DispatchMouseEventRequestPointerType;
    (function (DispatchMouseEventRequestPointerType) {
        DispatchMouseEventRequestPointerType["Mouse"] = "mouse";
        DispatchMouseEventRequestPointerType["Pen"] = "pen";
    })(DispatchMouseEventRequestPointerType = Input.DispatchMouseEventRequestPointerType || (Input.DispatchMouseEventRequestPointerType = {}));
    let DispatchTouchEventRequestType;
    (function (DispatchTouchEventRequestType) {
        DispatchTouchEventRequestType["TouchStart"] = "touchStart";
        DispatchTouchEventRequestType["TouchEnd"] = "touchEnd";
        DispatchTouchEventRequestType["TouchMove"] = "touchMove";
        DispatchTouchEventRequestType["TouchCancel"] = "touchCancel";
    })(DispatchTouchEventRequestType = Input.DispatchTouchEventRequestType || (Input.DispatchTouchEventRequestType = {}));
    let EmulateTouchFromMouseEventRequestType;
    (function (EmulateTouchFromMouseEventRequestType) {
        EmulateTouchFromMouseEventRequestType["MousePressed"] = "mousePressed";
        EmulateTouchFromMouseEventRequestType["MouseReleased"] = "mouseReleased";
        EmulateTouchFromMouseEventRequestType["MouseMoved"] = "mouseMoved";
        EmulateTouchFromMouseEventRequestType["MouseWheel"] = "mouseWheel";
    })(EmulateTouchFromMouseEventRequestType = Input.EmulateTouchFromMouseEventRequestType || (Input.EmulateTouchFromMouseEventRequestType = {}));
})(Input || (Input = {}));
export var LayerTree;
(function (LayerTree) {
    let ScrollRectType;
    (function (ScrollRectType) {
        ScrollRectType["RepaintsOnScroll"] = "RepaintsOnScroll";
        ScrollRectType["TouchEventHandler"] = "TouchEventHandler";
        ScrollRectType["WheelEventHandler"] = "WheelEventHandler";
    })(ScrollRectType = LayerTree.ScrollRectType || (LayerTree.ScrollRectType = {}));
})(LayerTree || (LayerTree = {}));
/**
 * Provides access to log entries.
 */
export var Log;
(function (Log) {
    let LogEntrySource;
    (function (LogEntrySource) {
        LogEntrySource["XML"] = "xml";
        LogEntrySource["Javascript"] = "javascript";
        LogEntrySource["Network"] = "network";
        LogEntrySource["Storage"] = "storage";
        LogEntrySource["Appcache"] = "appcache";
        LogEntrySource["Rendering"] = "rendering";
        LogEntrySource["Security"] = "security";
        LogEntrySource["Deprecation"] = "deprecation";
        LogEntrySource["Worker"] = "worker";
        LogEntrySource["Violation"] = "violation";
        LogEntrySource["Intervention"] = "intervention";
        LogEntrySource["Recommendation"] = "recommendation";
        LogEntrySource["Other"] = "other";
    })(LogEntrySource = Log.LogEntrySource || (Log.LogEntrySource = {}));
    let LogEntryLevel;
    (function (LogEntryLevel) {
        LogEntryLevel["Verbose"] = "verbose";
        LogEntryLevel["Info"] = "info";
        LogEntryLevel["Warning"] = "warning";
        LogEntryLevel["Error"] = "error";
    })(LogEntryLevel = Log.LogEntryLevel || (Log.LogEntryLevel = {}));
    let LogEntryCategory;
    (function (LogEntryCategory) {
        LogEntryCategory["Cors"] = "cors";
    })(LogEntryCategory = Log.LogEntryCategory || (Log.LogEntryCategory = {}));
    let ViolationSettingName;
    (function (ViolationSettingName) {
        ViolationSettingName["LongTask"] = "longTask";
        ViolationSettingName["LongLayout"] = "longLayout";
        ViolationSettingName["BlockedEvent"] = "blockedEvent";
        ViolationSettingName["BlockedParser"] = "blockedParser";
        ViolationSettingName["DiscouragedAPIUse"] = "discouragedAPIUse";
        ViolationSettingName["Handler"] = "handler";
        ViolationSettingName["RecurringHandler"] = "recurringHandler";
    })(ViolationSettingName = Log.ViolationSettingName || (Log.ViolationSettingName = {}));
})(Log || (Log = {}));
export var Memory;
(function (Memory) {
    /**
     * Memory pressure level.
     */
    let PressureLevel;
    (function (PressureLevel) {
        PressureLevel["Moderate"] = "moderate";
        PressureLevel["Critical"] = "critical";
    })(PressureLevel = Memory.PressureLevel || (Memory.PressureLevel = {}));
})(Memory || (Memory = {}));
/**
 * Network domain allows tracking network activities of the page. It exposes information about http,
 * file, data and other requests and responses, their headers, bodies, timing, etc.
 */
export var Network;
(function (Network) {
    /**
     * Resource type as it was perceived by the rendering engine.
     */
    let ResourceType;
    (function (ResourceType) {
        ResourceType["Document"] = "Document";
        ResourceType["Stylesheet"] = "Stylesheet";
        ResourceType["Image"] = "Image";
        ResourceType["Media"] = "Media";
        ResourceType["Font"] = "Font";
        ResourceType["Script"] = "Script";
        ResourceType["TextTrack"] = "TextTrack";
        ResourceType["XHR"] = "XHR";
        ResourceType["Fetch"] = "Fetch";
        ResourceType["Prefetch"] = "Prefetch";
        ResourceType["EventSource"] = "EventSource";
        ResourceType["WebSocket"] = "WebSocket";
        ResourceType["Manifest"] = "Manifest";
        ResourceType["SignedExchange"] = "SignedExchange";
        ResourceType["Ping"] = "Ping";
        ResourceType["CSPViolationReport"] = "CSPViolationReport";
        ResourceType["Preflight"] = "Preflight";
        ResourceType["FedCM"] = "FedCM";
        ResourceType["Other"] = "Other";
    })(ResourceType = Network.ResourceType || (Network.ResourceType = {}));
    /**
     * Network level fetch failure reason.
     */
    let ErrorReason;
    (function (ErrorReason) {
        ErrorReason["Failed"] = "Failed";
        ErrorReason["Aborted"] = "Aborted";
        ErrorReason["TimedOut"] = "TimedOut";
        ErrorReason["AccessDenied"] = "AccessDenied";
        ErrorReason["ConnectionClosed"] = "ConnectionClosed";
        ErrorReason["ConnectionReset"] = "ConnectionReset";
        ErrorReason["ConnectionRefused"] = "ConnectionRefused";
        ErrorReason["ConnectionAborted"] = "ConnectionAborted";
        ErrorReason["ConnectionFailed"] = "ConnectionFailed";
        ErrorReason["NameNotResolved"] = "NameNotResolved";
        ErrorReason["InternetDisconnected"] = "InternetDisconnected";
        ErrorReason["AddressUnreachable"] = "AddressUnreachable";
        ErrorReason["BlockedByClient"] = "BlockedByClient";
        ErrorReason["BlockedByResponse"] = "BlockedByResponse";
    })(ErrorReason = Network.ErrorReason || (Network.ErrorReason = {}));
    /**
     * The underlying connection technology that the browser is supposedly using.
     */
    let ConnectionType;
    (function (ConnectionType) {
        ConnectionType["None"] = "none";
        ConnectionType["Cellular2g"] = "cellular2g";
        ConnectionType["Cellular3g"] = "cellular3g";
        ConnectionType["Cellular4g"] = "cellular4g";
        ConnectionType["Bluetooth"] = "bluetooth";
        ConnectionType["Ethernet"] = "ethernet";
        ConnectionType["Wifi"] = "wifi";
        ConnectionType["Wimax"] = "wimax";
        ConnectionType["Other"] = "other";
    })(ConnectionType = Network.ConnectionType || (Network.ConnectionType = {}));
    /**
     * Represents the cookie's 'SameSite' status:
     * https://tools.ietf.org/html/draft-west-first-party-cookies
     */
    let CookieSameSite;
    (function (CookieSameSite) {
        CookieSameSite["Strict"] = "Strict";
        CookieSameSite["Lax"] = "Lax";
        CookieSameSite["None"] = "None";
    })(CookieSameSite = Network.CookieSameSite || (Network.CookieSameSite = {}));
    /**
     * Represents the cookie's 'Priority' status:
     * https://tools.ietf.org/html/draft-west-cookie-priority-00
     */
    let CookiePriority;
    (function (CookiePriority) {
        CookiePriority["Low"] = "Low";
        CookiePriority["Medium"] = "Medium";
        CookiePriority["High"] = "High";
    })(CookiePriority = Network.CookiePriority || (Network.CookiePriority = {}));
    /**
     * Represents the source scheme of the origin that originally set the cookie.
     * A value of "Unset" allows protocol clients to emulate legacy cookie scope for the scheme.
     * This is a temporary ability and it will be removed in the future.
     */
    let CookieSourceScheme;
    (function (CookieSourceScheme) {
        CookieSourceScheme["Unset"] = "Unset";
        CookieSourceScheme["NonSecure"] = "NonSecure";
        CookieSourceScheme["Secure"] = "Secure";
    })(CookieSourceScheme = Network.CookieSourceScheme || (Network.CookieSourceScheme = {}));
    /**
     * Loading priority of a resource request.
     */
    let ResourcePriority;
    (function (ResourcePriority) {
        ResourcePriority["VeryLow"] = "VeryLow";
        ResourcePriority["Low"] = "Low";
        ResourcePriority["Medium"] = "Medium";
        ResourcePriority["High"] = "High";
        ResourcePriority["VeryHigh"] = "VeryHigh";
    })(ResourcePriority = Network.ResourcePriority || (Network.ResourcePriority = {}));
    let RequestReferrerPolicy;
    (function (RequestReferrerPolicy) {
        RequestReferrerPolicy["UnsafeUrl"] = "unsafe-url";
        RequestReferrerPolicy["NoReferrerWhenDowngrade"] = "no-referrer-when-downgrade";
        RequestReferrerPolicy["NoReferrer"] = "no-referrer";
        RequestReferrerPolicy["Origin"] = "origin";
        RequestReferrerPolicy["OriginWhenCrossOrigin"] = "origin-when-cross-origin";
        RequestReferrerPolicy["SameOrigin"] = "same-origin";
        RequestReferrerPolicy["StrictOrigin"] = "strict-origin";
        RequestReferrerPolicy["StrictOriginWhenCrossOrigin"] = "strict-origin-when-cross-origin";
    })(RequestReferrerPolicy = Network.RequestReferrerPolicy || (Network.RequestReferrerPolicy = {}));
    /**
     * Whether the request complied with Certificate Transparency policy.
     */
    let CertificateTransparencyCompliance;
    (function (CertificateTransparencyCompliance) {
        CertificateTransparencyCompliance["Unknown"] = "unknown";
        CertificateTransparencyCompliance["NotCompliant"] = "not-compliant";
        CertificateTransparencyCompliance["Compliant"] = "compliant";
    })(CertificateTransparencyCompliance = Network.CertificateTransparencyCompliance || (Network.CertificateTransparencyCompliance = {}));
    /**
     * The reason why request was blocked.
     */
    let BlockedReason;
    (function (BlockedReason) {
        BlockedReason["Other"] = "other";
        BlockedReason["Csp"] = "csp";
        BlockedReason["MixedContent"] = "mixed-content";
        BlockedReason["Origin"] = "origin";
        BlockedReason["Inspector"] = "inspector";
        BlockedReason["Integrity"] = "integrity";
        BlockedReason["SubresourceFilter"] = "subresource-filter";
        BlockedReason["ContentType"] = "content-type";
        BlockedReason["CoepFrameResourceNeedsCoepHeader"] = "coep-frame-resource-needs-coep-header";
        BlockedReason["CoopSandboxedIframeCannotNavigateToCoopPage"] = "coop-sandboxed-iframe-cannot-navigate-to-coop-page";
        BlockedReason["CorpNotSameOrigin"] = "corp-not-same-origin";
        BlockedReason["CorpNotSameOriginAfterDefaultedToSameOriginByCoep"] = "corp-not-same-origin-after-defaulted-to-same-origin-by-coep";
        BlockedReason["CorpNotSameOriginAfterDefaultedToSameOriginByDip"] = "corp-not-same-origin-after-defaulted-to-same-origin-by-dip";
        BlockedReason["CorpNotSameOriginAfterDefaultedToSameOriginByCoepAndDip"] = "corp-not-same-origin-after-defaulted-to-same-origin-by-coep-and-dip";
        BlockedReason["CorpNotSameSite"] = "corp-not-same-site";
        BlockedReason["SriMessageSignatureMismatch"] = "sri-message-signature-mismatch";
    })(BlockedReason = Network.BlockedReason || (Network.BlockedReason = {}));
    /**
     * The reason why request was blocked.
     */
    let CorsError;
    (function (CorsError) {
        CorsError["DisallowedByMode"] = "DisallowedByMode";
        CorsError["InvalidResponse"] = "InvalidResponse";
        CorsError["WildcardOriginNotAllowed"] = "WildcardOriginNotAllowed";
        CorsError["MissingAllowOriginHeader"] = "MissingAllowOriginHeader";
        CorsError["MultipleAllowOriginValues"] = "MultipleAllowOriginValues";
        CorsError["InvalidAllowOriginValue"] = "InvalidAllowOriginValue";
        CorsError["AllowOriginMismatch"] = "AllowOriginMismatch";
        CorsError["InvalidAllowCredentials"] = "InvalidAllowCredentials";
        CorsError["CorsDisabledScheme"] = "CorsDisabledScheme";
        CorsError["PreflightInvalidStatus"] = "PreflightInvalidStatus";
        CorsError["PreflightDisallowedRedirect"] = "PreflightDisallowedRedirect";
        CorsError["PreflightWildcardOriginNotAllowed"] = "PreflightWildcardOriginNotAllowed";
        CorsError["PreflightMissingAllowOriginHeader"] = "PreflightMissingAllowOriginHeader";
        CorsError["PreflightMultipleAllowOriginValues"] = "PreflightMultipleAllowOriginValues";
        CorsError["PreflightInvalidAllowOriginValue"] = "PreflightInvalidAllowOriginValue";
        CorsError["PreflightAllowOriginMismatch"] = "PreflightAllowOriginMismatch";
        CorsError["PreflightInvalidAllowCredentials"] = "PreflightInvalidAllowCredentials";
        CorsError["PreflightMissingAllowExternal"] = "PreflightMissingAllowExternal";
        CorsError["PreflightInvalidAllowExternal"] = "PreflightInvalidAllowExternal";
        CorsError["PreflightMissingAllowPrivateNetwork"] = "PreflightMissingAllowPrivateNetwork";
        CorsError["PreflightInvalidAllowPrivateNetwork"] = "PreflightInvalidAllowPrivateNetwork";
        CorsError["InvalidAllowMethodsPreflightResponse"] = "InvalidAllowMethodsPreflightResponse";
        CorsError["InvalidAllowHeadersPreflightResponse"] = "InvalidAllowHeadersPreflightResponse";
        CorsError["MethodDisallowedByPreflightResponse"] = "MethodDisallowedByPreflightResponse";
        CorsError["HeaderDisallowedByPreflightResponse"] = "HeaderDisallowedByPreflightResponse";
        CorsError["RedirectContainsCredentials"] = "RedirectContainsCredentials";
        CorsError["InsecurePrivateNetwork"] = "InsecurePrivateNetwork";
        CorsError["InvalidPrivateNetworkAccess"] = "InvalidPrivateNetworkAccess";
        CorsError["UnexpectedPrivateNetworkAccess"] = "UnexpectedPrivateNetworkAccess";
        CorsError["NoCorsRedirectModeNotFollow"] = "NoCorsRedirectModeNotFollow";
        CorsError["PreflightMissingPrivateNetworkAccessId"] = "PreflightMissingPrivateNetworkAccessId";
        CorsError["PreflightMissingPrivateNetworkAccessName"] = "PreflightMissingPrivateNetworkAccessName";
        CorsError["PrivateNetworkAccessPermissionUnavailable"] = "PrivateNetworkAccessPermissionUnavailable";
        CorsError["PrivateNetworkAccessPermissionDenied"] = "PrivateNetworkAccessPermissionDenied";
        CorsError["LocalNetworkAccessPermissionDenied"] = "LocalNetworkAccessPermissionDenied";
    })(CorsError = Network.CorsError || (Network.CorsError = {}));
    /**
     * Source of serviceworker response.
     */
    let ServiceWorkerResponseSource;
    (function (ServiceWorkerResponseSource) {
        ServiceWorkerResponseSource["CacheStorage"] = "cache-storage";
        ServiceWorkerResponseSource["HttpCache"] = "http-cache";
        ServiceWorkerResponseSource["FallbackCode"] = "fallback-code";
        ServiceWorkerResponseSource["Network"] = "network";
    })(ServiceWorkerResponseSource = Network.ServiceWorkerResponseSource || (Network.ServiceWorkerResponseSource = {}));
    let TrustTokenParamsRefreshPolicy;
    (function (TrustTokenParamsRefreshPolicy) {
        TrustTokenParamsRefreshPolicy["UseCached"] = "UseCached";
        TrustTokenParamsRefreshPolicy["Refresh"] = "Refresh";
    })(TrustTokenParamsRefreshPolicy = Network.TrustTokenParamsRefreshPolicy || (Network.TrustTokenParamsRefreshPolicy = {}));
    let TrustTokenOperationType;
    (function (TrustTokenOperationType) {
        TrustTokenOperationType["Issuance"] = "Issuance";
        TrustTokenOperationType["Redemption"] = "Redemption";
        TrustTokenOperationType["Signing"] = "Signing";
    })(TrustTokenOperationType = Network.TrustTokenOperationType || (Network.TrustTokenOperationType = {}));
    /**
     * The reason why Chrome uses a specific transport protocol for HTTP semantics.
     */
    let AlternateProtocolUsage;
    (function (AlternateProtocolUsage) {
        AlternateProtocolUsage["AlternativeJobWonWithoutRace"] = "alternativeJobWonWithoutRace";
        AlternateProtocolUsage["AlternativeJobWonRace"] = "alternativeJobWonRace";
        AlternateProtocolUsage["MainJobWonRace"] = "mainJobWonRace";
        AlternateProtocolUsage["MappingMissing"] = "mappingMissing";
        AlternateProtocolUsage["Broken"] = "broken";
        AlternateProtocolUsage["DnsAlpnH3JobWonWithoutRace"] = "dnsAlpnH3JobWonWithoutRace";
        AlternateProtocolUsage["DnsAlpnH3JobWonRace"] = "dnsAlpnH3JobWonRace";
        AlternateProtocolUsage["UnspecifiedReason"] = "unspecifiedReason";
    })(AlternateProtocolUsage = Network.AlternateProtocolUsage || (Network.AlternateProtocolUsage = {}));
    /**
     * Source of service worker router.
     */
    let ServiceWorkerRouterSource;
    (function (ServiceWorkerRouterSource) {
        ServiceWorkerRouterSource["Network"] = "network";
        ServiceWorkerRouterSource["Cache"] = "cache";
        ServiceWorkerRouterSource["FetchEvent"] = "fetch-event";
        ServiceWorkerRouterSource["RaceNetworkAndFetchHandler"] = "race-network-and-fetch-handler";
        ServiceWorkerRouterSource["RaceNetworkAndCache"] = "race-network-and-cache";
    })(ServiceWorkerRouterSource = Network.ServiceWorkerRouterSource || (Network.ServiceWorkerRouterSource = {}));
    let InitiatorType;
    (function (InitiatorType) {
        InitiatorType["Parser"] = "parser";
        InitiatorType["Script"] = "script";
        InitiatorType["Preload"] = "preload";
        InitiatorType["SignedExchange"] = "SignedExchange";
        InitiatorType["Preflight"] = "preflight";
        InitiatorType["Other"] = "other";
    })(InitiatorType = Network.InitiatorType || (Network.InitiatorType = {}));
    /**
     * Types of reasons why a cookie may not be stored from a response.
     */
    let SetCookieBlockedReason;
    (function (SetCookieBlockedReason) {
        SetCookieBlockedReason["SecureOnly"] = "SecureOnly";
        SetCookieBlockedReason["SameSiteStrict"] = "SameSiteStrict";
        SetCookieBlockedReason["SameSiteLax"] = "SameSiteLax";
        SetCookieBlockedReason["SameSiteUnspecifiedTreatedAsLax"] = "SameSiteUnspecifiedTreatedAsLax";
        SetCookieBlockedReason["SameSiteNoneInsecure"] = "SameSiteNoneInsecure";
        SetCookieBlockedReason["UserPreferences"] = "UserPreferences";
        SetCookieBlockedReason["ThirdPartyPhaseout"] = "ThirdPartyPhaseout";
        SetCookieBlockedReason["ThirdPartyBlockedInFirstPartySet"] = "ThirdPartyBlockedInFirstPartySet";
        SetCookieBlockedReason["SyntaxError"] = "SyntaxError";
        SetCookieBlockedReason["SchemeNotSupported"] = "SchemeNotSupported";
        SetCookieBlockedReason["OverwriteSecure"] = "OverwriteSecure";
        SetCookieBlockedReason["InvalidDomain"] = "InvalidDomain";
        SetCookieBlockedReason["InvalidPrefix"] = "InvalidPrefix";
        SetCookieBlockedReason["UnknownError"] = "UnknownError";
        SetCookieBlockedReason["SchemefulSameSiteStrict"] = "SchemefulSameSiteStrict";
        SetCookieBlockedReason["SchemefulSameSiteLax"] = "SchemefulSameSiteLax";
        SetCookieBlockedReason["SchemefulSameSiteUnspecifiedTreatedAsLax"] = "SchemefulSameSiteUnspecifiedTreatedAsLax";
        SetCookieBlockedReason["SamePartyFromCrossPartyContext"] = "SamePartyFromCrossPartyContext";
        SetCookieBlockedReason["SamePartyConflictsWithOtherAttributes"] = "SamePartyConflictsWithOtherAttributes";
        SetCookieBlockedReason["NameValuePairExceedsMaxSize"] = "NameValuePairExceedsMaxSize";
        SetCookieBlockedReason["DisallowedCharacter"] = "DisallowedCharacter";
        SetCookieBlockedReason["NoCookieContent"] = "NoCookieContent";
    })(SetCookieBlockedReason = Network.SetCookieBlockedReason || (Network.SetCookieBlockedReason = {}));
    /**
     * Types of reasons why a cookie may not be sent with a request.
     */
    let CookieBlockedReason;
    (function (CookieBlockedReason) {
        CookieBlockedReason["SecureOnly"] = "SecureOnly";
        CookieBlockedReason["NotOnPath"] = "NotOnPath";
        CookieBlockedReason["DomainMismatch"] = "DomainMismatch";
        CookieBlockedReason["SameSiteStrict"] = "SameSiteStrict";
        CookieBlockedReason["SameSiteLax"] = "SameSiteLax";
        CookieBlockedReason["SameSiteUnspecifiedTreatedAsLax"] = "SameSiteUnspecifiedTreatedAsLax";
        CookieBlockedReason["SameSiteNoneInsecure"] = "SameSiteNoneInsecure";
        CookieBlockedReason["UserPreferences"] = "UserPreferences";
        CookieBlockedReason["ThirdPartyPhaseout"] = "ThirdPartyPhaseout";
        CookieBlockedReason["ThirdPartyBlockedInFirstPartySet"] = "ThirdPartyBlockedInFirstPartySet";
        CookieBlockedReason["UnknownError"] = "UnknownError";
        CookieBlockedReason["SchemefulSameSiteStrict"] = "SchemefulSameSiteStrict";
        CookieBlockedReason["SchemefulSameSiteLax"] = "SchemefulSameSiteLax";
        CookieBlockedReason["SchemefulSameSiteUnspecifiedTreatedAsLax"] = "SchemefulSameSiteUnspecifiedTreatedAsLax";
        CookieBlockedReason["SamePartyFromCrossPartyContext"] = "SamePartyFromCrossPartyContext";
        CookieBlockedReason["NameValuePairExceedsMaxSize"] = "NameValuePairExceedsMaxSize";
        CookieBlockedReason["PortMismatch"] = "PortMismatch";
        CookieBlockedReason["SchemeMismatch"] = "SchemeMismatch";
        CookieBlockedReason["AnonymousContext"] = "AnonymousContext";
    })(CookieBlockedReason = Network.CookieBlockedReason || (Network.CookieBlockedReason = {}));
    /**
     * Types of reasons why a cookie should have been blocked by 3PCD but is exempted for the request.
     */
    let CookieExemptionReason;
    (function (CookieExemptionReason) {
        CookieExemptionReason["None"] = "None";
        CookieExemptionReason["UserSetting"] = "UserSetting";
        CookieExemptionReason["TPCDMetadata"] = "TPCDMetadata";
        CookieExemptionReason["TPCDDeprecationTrial"] = "TPCDDeprecationTrial";
        CookieExemptionReason["TopLevelTPCDDeprecationTrial"] = "TopLevelTPCDDeprecationTrial";
        CookieExemptionReason["TPCDHeuristics"] = "TPCDHeuristics";
        CookieExemptionReason["EnterprisePolicy"] = "EnterprisePolicy";
        CookieExemptionReason["StorageAccess"] = "StorageAccess";
        CookieExemptionReason["TopLevelStorageAccess"] = "TopLevelStorageAccess";
        CookieExemptionReason["Scheme"] = "Scheme";
        CookieExemptionReason["SameSiteNoneCookiesInSandbox"] = "SameSiteNoneCookiesInSandbox";
    })(CookieExemptionReason = Network.CookieExemptionReason || (Network.CookieExemptionReason = {}));
    let AuthChallengeSource;
    (function (AuthChallengeSource) {
        AuthChallengeSource["Server"] = "Server";
        AuthChallengeSource["Proxy"] = "Proxy";
    })(AuthChallengeSource = Network.AuthChallengeSource || (Network.AuthChallengeSource = {}));
    let AuthChallengeResponseResponse;
    (function (AuthChallengeResponseResponse) {
        AuthChallengeResponseResponse["Default"] = "Default";
        AuthChallengeResponseResponse["CancelAuth"] = "CancelAuth";
        AuthChallengeResponseResponse["ProvideCredentials"] = "ProvideCredentials";
    })(AuthChallengeResponseResponse = Network.AuthChallengeResponseResponse || (Network.AuthChallengeResponseResponse = {}));
    /**
     * Stages of the interception to begin intercepting. Request will intercept before the request is
     * sent. Response will intercept after the response is received.
     */
    let InterceptionStage;
    (function (InterceptionStage) {
        InterceptionStage["Request"] = "Request";
        InterceptionStage["HeadersReceived"] = "HeadersReceived";
    })(InterceptionStage = Network.InterceptionStage || (Network.InterceptionStage = {}));
    /**
     * Field type for a signed exchange related error.
     */
    let SignedExchangeErrorField;
    (function (SignedExchangeErrorField) {
        SignedExchangeErrorField["SignatureSig"] = "signatureSig";
        SignedExchangeErrorField["SignatureIntegrity"] = "signatureIntegrity";
        SignedExchangeErrorField["SignatureCertUrl"] = "signatureCertUrl";
        SignedExchangeErrorField["SignatureCertSha256"] = "signatureCertSha256";
        SignedExchangeErrorField["SignatureValidityUrl"] = "signatureValidityUrl";
        SignedExchangeErrorField["SignatureTimestamps"] = "signatureTimestamps";
    })(SignedExchangeErrorField = Network.SignedExchangeErrorField || (Network.SignedExchangeErrorField = {}));
    /**
     * List of content encodings supported by the backend.
     */
    let ContentEncoding;
    (function (ContentEncoding) {
        ContentEncoding["Deflate"] = "deflate";
        ContentEncoding["Gzip"] = "gzip";
        ContentEncoding["Br"] = "br";
        ContentEncoding["Zstd"] = "zstd";
    })(ContentEncoding = Network.ContentEncoding || (Network.ContentEncoding = {}));
    let DirectSocketDnsQueryType;
    (function (DirectSocketDnsQueryType) {
        DirectSocketDnsQueryType["Ipv4"] = "ipv4";
        DirectSocketDnsQueryType["Ipv6"] = "ipv6";
    })(DirectSocketDnsQueryType = Network.DirectSocketDnsQueryType || (Network.DirectSocketDnsQueryType = {}));
    let PrivateNetworkRequestPolicy;
    (function (PrivateNetworkRequestPolicy) {
        PrivateNetworkRequestPolicy["Allow"] = "Allow";
        PrivateNetworkRequestPolicy["BlockFromInsecureToMorePrivate"] = "BlockFromInsecureToMorePrivate";
        PrivateNetworkRequestPolicy["WarnFromInsecureToMorePrivate"] = "WarnFromInsecureToMorePrivate";
        PrivateNetworkRequestPolicy["PreflightBlock"] = "PreflightBlock";
        PrivateNetworkRequestPolicy["PreflightWarn"] = "PreflightWarn";
        PrivateNetworkRequestPolicy["PermissionBlock"] = "PermissionBlock";
        PrivateNetworkRequestPolicy["PermissionWarn"] = "PermissionWarn";
    })(PrivateNetworkRequestPolicy = Network.PrivateNetworkRequestPolicy || (Network.PrivateNetworkRequestPolicy = {}));
    let IPAddressSpace;
    (function (IPAddressSpace) {
        IPAddressSpace["Loopback"] = "Loopback";
        IPAddressSpace["Private"] = "Private";
        IPAddressSpace["Public"] = "Public";
        IPAddressSpace["Unknown"] = "Unknown";
    })(IPAddressSpace = Network.IPAddressSpace || (Network.IPAddressSpace = {}));
    let CrossOriginOpenerPolicyValue;
    (function (CrossOriginOpenerPolicyValue) {
        CrossOriginOpenerPolicyValue["SameOrigin"] = "SameOrigin";
        CrossOriginOpenerPolicyValue["SameOriginAllowPopups"] = "SameOriginAllowPopups";
        CrossOriginOpenerPolicyValue["RestrictProperties"] = "RestrictProperties";
        CrossOriginOpenerPolicyValue["UnsafeNone"] = "UnsafeNone";
        CrossOriginOpenerPolicyValue["SameOriginPlusCoep"] = "SameOriginPlusCoep";
        CrossOriginOpenerPolicyValue["RestrictPropertiesPlusCoep"] = "RestrictPropertiesPlusCoep";
        CrossOriginOpenerPolicyValue["NoopenerAllowPopups"] = "NoopenerAllowPopups";
    })(CrossOriginOpenerPolicyValue = Network.CrossOriginOpenerPolicyValue || (Network.CrossOriginOpenerPolicyValue = {}));
    let CrossOriginEmbedderPolicyValue;
    (function (CrossOriginEmbedderPolicyValue) {
        CrossOriginEmbedderPolicyValue["None"] = "None";
        CrossOriginEmbedderPolicyValue["Credentialless"] = "Credentialless";
        CrossOriginEmbedderPolicyValue["RequireCorp"] = "RequireCorp";
    })(CrossOriginEmbedderPolicyValue = Network.CrossOriginEmbedderPolicyValue || (Network.CrossOriginEmbedderPolicyValue = {}));
    let ContentSecurityPolicySource;
    (function (ContentSecurityPolicySource) {
        ContentSecurityPolicySource["HTTP"] = "HTTP";
        ContentSecurityPolicySource["Meta"] = "Meta";
    })(ContentSecurityPolicySource = Network.ContentSecurityPolicySource || (Network.ContentSecurityPolicySource = {}));
    /**
     * The status of a Reporting API report.
     */
    let ReportStatus;
    (function (ReportStatus) {
        ReportStatus["Queued"] = "Queued";
        ReportStatus["Pending"] = "Pending";
        ReportStatus["MarkedForRemoval"] = "MarkedForRemoval";
        ReportStatus["Success"] = "Success";
    })(ReportStatus = Network.ReportStatus || (Network.ReportStatus = {}));
    let TrustTokenOperationDoneEventStatus;
    (function (TrustTokenOperationDoneEventStatus) {
        TrustTokenOperationDoneEventStatus["Ok"] = "Ok";
        TrustTokenOperationDoneEventStatus["InvalidArgument"] = "InvalidArgument";
        TrustTokenOperationDoneEventStatus["MissingIssuerKeys"] = "MissingIssuerKeys";
        TrustTokenOperationDoneEventStatus["FailedPrecondition"] = "FailedPrecondition";
        TrustTokenOperationDoneEventStatus["ResourceExhausted"] = "ResourceExhausted";
        TrustTokenOperationDoneEventStatus["AlreadyExists"] = "AlreadyExists";
        TrustTokenOperationDoneEventStatus["ResourceLimited"] = "ResourceLimited";
        TrustTokenOperationDoneEventStatus["Unauthorized"] = "Unauthorized";
        TrustTokenOperationDoneEventStatus["BadResponse"] = "BadResponse";
        TrustTokenOperationDoneEventStatus["InternalError"] = "InternalError";
        TrustTokenOperationDoneEventStatus["UnknownError"] = "UnknownError";
        TrustTokenOperationDoneEventStatus["FulfilledLocally"] = "FulfilledLocally";
        TrustTokenOperationDoneEventStatus["SiteIssuerLimit"] = "SiteIssuerLimit";
    })(TrustTokenOperationDoneEventStatus = Network.TrustTokenOperationDoneEventStatus || (Network.TrustTokenOperationDoneEventStatus = {}));
})(Network || (Network = {}));
/**
 * This domain provides various functionality related to drawing atop the inspected page.
 */
export var Overlay;
(function (Overlay) {
    let LineStylePattern;
    (function (LineStylePattern) {
        LineStylePattern["Dashed"] = "dashed";
        LineStylePattern["Dotted"] = "dotted";
    })(LineStylePattern = Overlay.LineStylePattern || (Overlay.LineStylePattern = {}));
    let ContrastAlgorithm;
    (function (ContrastAlgorithm) {
        ContrastAlgorithm["Aa"] = "aa";
        ContrastAlgorithm["Aaa"] = "aaa";
        ContrastAlgorithm["Apca"] = "apca";
    })(ContrastAlgorithm = Overlay.ContrastAlgorithm || (Overlay.ContrastAlgorithm = {}));
    let ColorFormat;
    (function (ColorFormat) {
        ColorFormat["Rgb"] = "rgb";
        ColorFormat["Hsl"] = "hsl";
        ColorFormat["Hwb"] = "hwb";
        ColorFormat["Hex"] = "hex";
    })(ColorFormat = Overlay.ColorFormat || (Overlay.ColorFormat = {}));
    let InspectMode;
    (function (InspectMode) {
        InspectMode["SearchForNode"] = "searchForNode";
        InspectMode["SearchForUAShadowDOM"] = "searchForUAShadowDOM";
        InspectMode["CaptureAreaScreenshot"] = "captureAreaScreenshot";
        InspectMode["None"] = "none";
    })(InspectMode = Overlay.InspectMode || (Overlay.InspectMode = {}));
})(Overlay || (Overlay = {}));
/**
 * Actions and events related to the inspected page belong to the page domain.
 */
export var Page;
(function (Page) {
    /**
     * Indicates whether a frame has been identified as an ad.
     */
    let AdFrameType;
    (function (AdFrameType) {
        AdFrameType["None"] = "none";
        AdFrameType["Child"] = "child";
        AdFrameType["Root"] = "root";
    })(AdFrameType = Page.AdFrameType || (Page.AdFrameType = {}));
    let AdFrameExplanation;
    (function (AdFrameExplanation) {
        AdFrameExplanation["ParentIsAd"] = "ParentIsAd";
        AdFrameExplanation["CreatedByAdScript"] = "CreatedByAdScript";
        AdFrameExplanation["MatchedBlockingRule"] = "MatchedBlockingRule";
    })(AdFrameExplanation = Page.AdFrameExplanation || (Page.AdFrameExplanation = {}));
    /**
     * Indicates whether the frame is a secure context and why it is the case.
     */
    let SecureContextType;
    (function (SecureContextType) {
        SecureContextType["Secure"] = "Secure";
        SecureContextType["SecureLocalhost"] = "SecureLocalhost";
        SecureContextType["InsecureScheme"] = "InsecureScheme";
        SecureContextType["InsecureAncestor"] = "InsecureAncestor";
    })(SecureContextType = Page.SecureContextType || (Page.SecureContextType = {}));
    /**
     * Indicates whether the frame is cross-origin isolated and why it is the case.
     */
    let CrossOriginIsolatedContextType;
    (function (CrossOriginIsolatedContextType) {
        CrossOriginIsolatedContextType["Isolated"] = "Isolated";
        CrossOriginIsolatedContextType["NotIsolated"] = "NotIsolated";
        CrossOriginIsolatedContextType["NotIsolatedFeatureDisabled"] = "NotIsolatedFeatureDisabled";
    })(CrossOriginIsolatedContextType = Page.CrossOriginIsolatedContextType || (Page.CrossOriginIsolatedContextType = {}));
    let GatedAPIFeatures;
    (function (GatedAPIFeatures) {
        GatedAPIFeatures["SharedArrayBuffers"] = "SharedArrayBuffers";
        GatedAPIFeatures["SharedArrayBuffersTransferAllowed"] = "SharedArrayBuffersTransferAllowed";
        GatedAPIFeatures["PerformanceMeasureMemory"] = "PerformanceMeasureMemory";
        GatedAPIFeatures["PerformanceProfile"] = "PerformanceProfile";
    })(GatedAPIFeatures = Page.GatedAPIFeatures || (Page.GatedAPIFeatures = {}));
    /**
     * All Permissions Policy features. This enum should match the one defined
     * in services/network/public/cpp/permissions_policy/permissions_policy_features.json5.
     * LINT_SKIP.IfChange(PermissionsPolicyFeature)
     */
    let PermissionsPolicyFeature;
    (function (PermissionsPolicyFeature) {
        PermissionsPolicyFeature["Accelerometer"] = "accelerometer";
        PermissionsPolicyFeature["AllScreensCapture"] = "all-screens-capture";
        PermissionsPolicyFeature["AmbientLightSensor"] = "ambient-light-sensor";
        PermissionsPolicyFeature["AriaNotify"] = "aria-notify";
        PermissionsPolicyFeature["AttributionReporting"] = "attribution-reporting";
        PermissionsPolicyFeature["Autoplay"] = "autoplay";
        PermissionsPolicyFeature["Bluetooth"] = "bluetooth";
        PermissionsPolicyFeature["BrowsingTopics"] = "browsing-topics";
        PermissionsPolicyFeature["Camera"] = "camera";
        PermissionsPolicyFeature["CapturedSurfaceControl"] = "captured-surface-control";
        PermissionsPolicyFeature["ChDpr"] = "ch-dpr";
        PermissionsPolicyFeature["ChDeviceMemory"] = "ch-device-memory";
        PermissionsPolicyFeature["ChDownlink"] = "ch-downlink";
        PermissionsPolicyFeature["ChEct"] = "ch-ect";
        PermissionsPolicyFeature["ChPrefersColorScheme"] = "ch-prefers-color-scheme";
        PermissionsPolicyFeature["ChPrefersReducedMotion"] = "ch-prefers-reduced-motion";
        PermissionsPolicyFeature["ChPrefersReducedTransparency"] = "ch-prefers-reduced-transparency";
        PermissionsPolicyFeature["ChRtt"] = "ch-rtt";
        PermissionsPolicyFeature["ChSaveData"] = "ch-save-data";
        PermissionsPolicyFeature["ChUa"] = "ch-ua";
        PermissionsPolicyFeature["ChUaArch"] = "ch-ua-arch";
        PermissionsPolicyFeature["ChUaBitness"] = "ch-ua-bitness";
        PermissionsPolicyFeature["ChUaHighEntropyValues"] = "ch-ua-high-entropy-values";
        PermissionsPolicyFeature["ChUaPlatform"] = "ch-ua-platform";
        PermissionsPolicyFeature["ChUaModel"] = "ch-ua-model";
        PermissionsPolicyFeature["ChUaMobile"] = "ch-ua-mobile";
        PermissionsPolicyFeature["ChUaFormFactors"] = "ch-ua-form-factors";
        PermissionsPolicyFeature["ChUaFullVersion"] = "ch-ua-full-version";
        PermissionsPolicyFeature["ChUaFullVersionList"] = "ch-ua-full-version-list";
        PermissionsPolicyFeature["ChUaPlatformVersion"] = "ch-ua-platform-version";
        PermissionsPolicyFeature["ChUaWow64"] = "ch-ua-wow64";
        PermissionsPolicyFeature["ChViewportHeight"] = "ch-viewport-height";
        PermissionsPolicyFeature["ChViewportWidth"] = "ch-viewport-width";
        PermissionsPolicyFeature["ChWidth"] = "ch-width";
        PermissionsPolicyFeature["ClipboardRead"] = "clipboard-read";
        PermissionsPolicyFeature["ClipboardWrite"] = "clipboard-write";
        PermissionsPolicyFeature["ComputePressure"] = "compute-pressure";
        PermissionsPolicyFeature["ControlledFrame"] = "controlled-frame";
        PermissionsPolicyFeature["CrossOriginIsolated"] = "cross-origin-isolated";
        PermissionsPolicyFeature["DeferredFetch"] = "deferred-fetch";
        PermissionsPolicyFeature["DeferredFetchMinimal"] = "deferred-fetch-minimal";
        PermissionsPolicyFeature["DeviceAttributes"] = "device-attributes";
        PermissionsPolicyFeature["DigitalCredentialsGet"] = "digital-credentials-get";
        PermissionsPolicyFeature["DirectSockets"] = "direct-sockets";
        PermissionsPolicyFeature["DirectSocketsPrivate"] = "direct-sockets-private";
        PermissionsPolicyFeature["DisplayCapture"] = "display-capture";
        PermissionsPolicyFeature["DocumentDomain"] = "document-domain";
        PermissionsPolicyFeature["EncryptedMedia"] = "encrypted-media";
        PermissionsPolicyFeature["ExecutionWhileOutOfViewport"] = "execution-while-out-of-viewport";
        PermissionsPolicyFeature["ExecutionWhileNotRendered"] = "execution-while-not-rendered";
        PermissionsPolicyFeature["FencedUnpartitionedStorageRead"] = "fenced-unpartitioned-storage-read";
        PermissionsPolicyFeature["FocusWithoutUserActivation"] = "focus-without-user-activation";
        PermissionsPolicyFeature["Fullscreen"] = "fullscreen";
        PermissionsPolicyFeature["Frobulate"] = "frobulate";
        PermissionsPolicyFeature["Gamepad"] = "gamepad";
        PermissionsPolicyFeature["Geolocation"] = "geolocation";
        PermissionsPolicyFeature["Gyroscope"] = "gyroscope";
        PermissionsPolicyFeature["Hid"] = "hid";
        PermissionsPolicyFeature["IdentityCredentialsGet"] = "identity-credentials-get";
        PermissionsPolicyFeature["IdleDetection"] = "idle-detection";
        PermissionsPolicyFeature["InterestCohort"] = "interest-cohort";
        PermissionsPolicyFeature["JoinAdInterestGroup"] = "join-ad-interest-group";
        PermissionsPolicyFeature["KeyboardMap"] = "keyboard-map";
        PermissionsPolicyFeature["LanguageDetector"] = "language-detector";
        PermissionsPolicyFeature["LanguageModel"] = "language-model";
        PermissionsPolicyFeature["LocalFonts"] = "local-fonts";
        PermissionsPolicyFeature["LocalNetworkAccess"] = "local-network-access";
        PermissionsPolicyFeature["Magnetometer"] = "magnetometer";
        PermissionsPolicyFeature["MediaPlaybackWhileNotVisible"] = "media-playback-while-not-visible";
        PermissionsPolicyFeature["Microphone"] = "microphone";
        PermissionsPolicyFeature["Midi"] = "midi";
        PermissionsPolicyFeature["OnDeviceSpeechRecognition"] = "on-device-speech-recognition";
        PermissionsPolicyFeature["OtpCredentials"] = "otp-credentials";
        PermissionsPolicyFeature["Payment"] = "payment";
        PermissionsPolicyFeature["PictureInPicture"] = "picture-in-picture";
        PermissionsPolicyFeature["Popins"] = "popins";
        PermissionsPolicyFeature["PrivateAggregation"] = "private-aggregation";
        PermissionsPolicyFeature["PrivateStateTokenIssuance"] = "private-state-token-issuance";
        PermissionsPolicyFeature["PrivateStateTokenRedemption"] = "private-state-token-redemption";
        PermissionsPolicyFeature["PublickeyCredentialsCreate"] = "publickey-credentials-create";
        PermissionsPolicyFeature["PublickeyCredentialsGet"] = "publickey-credentials-get";
        PermissionsPolicyFeature["RecordAdAuctionEvents"] = "record-ad-auction-events";
        PermissionsPolicyFeature["Rewriter"] = "rewriter";
        PermissionsPolicyFeature["RunAdAuction"] = "run-ad-auction";
        PermissionsPolicyFeature["ScreenWakeLock"] = "screen-wake-lock";
        PermissionsPolicyFeature["Serial"] = "serial";
        PermissionsPolicyFeature["SharedAutofill"] = "shared-autofill";
        PermissionsPolicyFeature["SharedStorage"] = "shared-storage";
        PermissionsPolicyFeature["SharedStorageSelectUrl"] = "shared-storage-select-url";
        PermissionsPolicyFeature["SmartCard"] = "smart-card";
        PermissionsPolicyFeature["SpeakerSelection"] = "speaker-selection";
        PermissionsPolicyFeature["StorageAccess"] = "storage-access";
        PermissionsPolicyFeature["SubApps"] = "sub-apps";
        PermissionsPolicyFeature["Summarizer"] = "summarizer";
        PermissionsPolicyFeature["SyncXhr"] = "sync-xhr";
        PermissionsPolicyFeature["Translator"] = "translator";
        PermissionsPolicyFeature["Unload"] = "unload";
        PermissionsPolicyFeature["Usb"] = "usb";
        PermissionsPolicyFeature["UsbUnrestricted"] = "usb-unrestricted";
        PermissionsPolicyFeature["VerticalScroll"] = "vertical-scroll";
        PermissionsPolicyFeature["WebAppInstallation"] = "web-app-installation";
        PermissionsPolicyFeature["WebPrinting"] = "web-printing";
        PermissionsPolicyFeature["WebShare"] = "web-share";
        PermissionsPolicyFeature["WindowManagement"] = "window-management";
        PermissionsPolicyFeature["Writer"] = "writer";
        PermissionsPolicyFeature["XrSpatialTracking"] = "xr-spatial-tracking";
    })(PermissionsPolicyFeature = Page.PermissionsPolicyFeature || (Page.PermissionsPolicyFeature = {}));
    /**
     * Reason for a permissions policy feature to be disabled.
     */
    let PermissionsPolicyBlockReason;
    (function (PermissionsPolicyBlockReason) {
        PermissionsPolicyBlockReason["Header"] = "Header";
        PermissionsPolicyBlockReason["IframeAttribute"] = "IframeAttribute";
        PermissionsPolicyBlockReason["InFencedFrameTree"] = "InFencedFrameTree";
        PermissionsPolicyBlockReason["InIsolatedApp"] = "InIsolatedApp";
    })(PermissionsPolicyBlockReason = Page.PermissionsPolicyBlockReason || (Page.PermissionsPolicyBlockReason = {}));
    /**
     * Origin Trial(https://www.chromium.org/blink/origin-trials) support.
     * Status for an Origin Trial token.
     */
    let OriginTrialTokenStatus;
    (function (OriginTrialTokenStatus) {
        OriginTrialTokenStatus["Success"] = "Success";
        OriginTrialTokenStatus["NotSupported"] = "NotSupported";
        OriginTrialTokenStatus["Insecure"] = "Insecure";
        OriginTrialTokenStatus["Expired"] = "Expired";
        OriginTrialTokenStatus["WrongOrigin"] = "WrongOrigin";
        OriginTrialTokenStatus["InvalidSignature"] = "InvalidSignature";
        OriginTrialTokenStatus["Malformed"] = "Malformed";
        OriginTrialTokenStatus["WrongVersion"] = "WrongVersion";
        OriginTrialTokenStatus["FeatureDisabled"] = "FeatureDisabled";
        OriginTrialTokenStatus["TokenDisabled"] = "TokenDisabled";
        OriginTrialTokenStatus["FeatureDisabledForUser"] = "FeatureDisabledForUser";
        OriginTrialTokenStatus["UnknownTrial"] = "UnknownTrial";
    })(OriginTrialTokenStatus = Page.OriginTrialTokenStatus || (Page.OriginTrialTokenStatus = {}));
    /**
     * Status for an Origin Trial.
     */
    let OriginTrialStatus;
    (function (OriginTrialStatus) {
        OriginTrialStatus["Enabled"] = "Enabled";
        OriginTrialStatus["ValidTokenNotProvided"] = "ValidTokenNotProvided";
        OriginTrialStatus["OSNotSupported"] = "OSNotSupported";
        OriginTrialStatus["TrialNotAllowed"] = "TrialNotAllowed";
    })(OriginTrialStatus = Page.OriginTrialStatus || (Page.OriginTrialStatus = {}));
    let OriginTrialUsageRestriction;
    (function (OriginTrialUsageRestriction) {
        OriginTrialUsageRestriction["None"] = "None";
        OriginTrialUsageRestriction["Subset"] = "Subset";
    })(OriginTrialUsageRestriction = Page.OriginTrialUsageRestriction || (Page.OriginTrialUsageRestriction = {}));
    /**
     * Transition type.
     */
    let TransitionType;
    (function (TransitionType) {
        TransitionType["Link"] = "link";
        TransitionType["Typed"] = "typed";
        TransitionType["Address_bar"] = "address_bar";
        TransitionType["Auto_bookmark"] = "auto_bookmark";
        TransitionType["Auto_subframe"] = "auto_subframe";
        TransitionType["Manual_subframe"] = "manual_subframe";
        TransitionType["Generated"] = "generated";
        TransitionType["Auto_toplevel"] = "auto_toplevel";
        TransitionType["Form_submit"] = "form_submit";
        TransitionType["Reload"] = "reload";
        TransitionType["Keyword"] = "keyword";
        TransitionType["Keyword_generated"] = "keyword_generated";
        TransitionType["Other"] = "other";
    })(TransitionType = Page.TransitionType || (Page.TransitionType = {}));
    /**
     * Javascript dialog type.
     */
    let DialogType;
    (function (DialogType) {
        DialogType["Alert"] = "alert";
        DialogType["Confirm"] = "confirm";
        DialogType["Prompt"] = "prompt";
        DialogType["Beforeunload"] = "beforeunload";
    })(DialogType = Page.DialogType || (Page.DialogType = {}));
    let ClientNavigationReason;
    (function (ClientNavigationReason) {
        ClientNavigationReason["AnchorClick"] = "anchorClick";
        ClientNavigationReason["FormSubmissionGet"] = "formSubmissionGet";
        ClientNavigationReason["FormSubmissionPost"] = "formSubmissionPost";
        ClientNavigationReason["HttpHeaderRefresh"] = "httpHeaderRefresh";
        ClientNavigationReason["InitialFrameNavigation"] = "initialFrameNavigation";
        ClientNavigationReason["MetaTagRefresh"] = "metaTagRefresh";
        ClientNavigationReason["Other"] = "other";
        ClientNavigationReason["PageBlockInterstitial"] = "pageBlockInterstitial";
        ClientNavigationReason["Reload"] = "reload";
        ClientNavigationReason["ScriptInitiated"] = "scriptInitiated";
    })(ClientNavigationReason = Page.ClientNavigationReason || (Page.ClientNavigationReason = {}));
    let ClientNavigationDisposition;
    (function (ClientNavigationDisposition) {
        ClientNavigationDisposition["CurrentTab"] = "currentTab";
        ClientNavigationDisposition["NewTab"] = "newTab";
        ClientNavigationDisposition["NewWindow"] = "newWindow";
        ClientNavigationDisposition["Download"] = "download";
    })(ClientNavigationDisposition = Page.ClientNavigationDisposition || (Page.ClientNavigationDisposition = {}));
    /**
     * The referring-policy used for the navigation.
     */
    let ReferrerPolicy;
    (function (ReferrerPolicy) {
        ReferrerPolicy["NoReferrer"] = "noReferrer";
        ReferrerPolicy["NoReferrerWhenDowngrade"] = "noReferrerWhenDowngrade";
        ReferrerPolicy["Origin"] = "origin";
        ReferrerPolicy["OriginWhenCrossOrigin"] = "originWhenCrossOrigin";
        ReferrerPolicy["SameOrigin"] = "sameOrigin";
        ReferrerPolicy["StrictOrigin"] = "strictOrigin";
        ReferrerPolicy["StrictOriginWhenCrossOrigin"] = "strictOriginWhenCrossOrigin";
        ReferrerPolicy["UnsafeUrl"] = "unsafeUrl";
    })(ReferrerPolicy = Page.ReferrerPolicy || (Page.ReferrerPolicy = {}));
    /**
     * The type of a frameNavigated event.
     */
    let NavigationType;
    (function (NavigationType) {
        NavigationType["Navigation"] = "Navigation";
        NavigationType["BackForwardCacheRestore"] = "BackForwardCacheRestore";
    })(NavigationType = Page.NavigationType || (Page.NavigationType = {}));
    /**
     * List of not restored reasons for back-forward cache.
     */
    let BackForwardCacheNotRestoredReason;
    (function (BackForwardCacheNotRestoredReason) {
        BackForwardCacheNotRestoredReason["NotPrimaryMainFrame"] = "NotPrimaryMainFrame";
        BackForwardCacheNotRestoredReason["BackForwardCacheDisabled"] = "BackForwardCacheDisabled";
        BackForwardCacheNotRestoredReason["RelatedActiveContentsExist"] = "RelatedActiveContentsExist";
        BackForwardCacheNotRestoredReason["HTTPStatusNotOK"] = "HTTPStatusNotOK";
        BackForwardCacheNotRestoredReason["SchemeNotHTTPOrHTTPS"] = "SchemeNotHTTPOrHTTPS";
        BackForwardCacheNotRestoredReason["Loading"] = "Loading";
        BackForwardCacheNotRestoredReason["WasGrantedMediaAccess"] = "WasGrantedMediaAccess";
        BackForwardCacheNotRestoredReason["DisableForRenderFrameHostCalled"] = "DisableForRenderFrameHostCalled";
        BackForwardCacheNotRestoredReason["DomainNotAllowed"] = "DomainNotAllowed";
        BackForwardCacheNotRestoredReason["HTTPMethodNotGET"] = "HTTPMethodNotGET";
        BackForwardCacheNotRestoredReason["SubframeIsNavigating"] = "SubframeIsNavigating";
        BackForwardCacheNotRestoredReason["Timeout"] = "Timeout";
        BackForwardCacheNotRestoredReason["CacheLimit"] = "CacheLimit";
        BackForwardCacheNotRestoredReason["JavaScriptExecution"] = "JavaScriptExecution";
        BackForwardCacheNotRestoredReason["RendererProcessKilled"] = "RendererProcessKilled";
        BackForwardCacheNotRestoredReason["RendererProcessCrashed"] = "RendererProcessCrashed";
        BackForwardCacheNotRestoredReason["SchedulerTrackedFeatureUsed"] = "SchedulerTrackedFeatureUsed";
        BackForwardCacheNotRestoredReason["ConflictingBrowsingInstance"] = "ConflictingBrowsingInstance";
        BackForwardCacheNotRestoredReason["CacheFlushed"] = "CacheFlushed";
        BackForwardCacheNotRestoredReason["ServiceWorkerVersionActivation"] = "ServiceWorkerVersionActivation";
        BackForwardCacheNotRestoredReason["SessionRestored"] = "SessionRestored";
        BackForwardCacheNotRestoredReason["ServiceWorkerPostMessage"] = "ServiceWorkerPostMessage";
        BackForwardCacheNotRestoredReason["EnteredBackForwardCacheBeforeServiceWorkerHostAdded"] = "EnteredBackForwardCacheBeforeServiceWorkerHostAdded";
        BackForwardCacheNotRestoredReason["RenderFrameHostReused_SameSite"] = "RenderFrameHostReused_SameSite";
        BackForwardCacheNotRestoredReason["RenderFrameHostReused_CrossSite"] = "RenderFrameHostReused_CrossSite";
        BackForwardCacheNotRestoredReason["ServiceWorkerClaim"] = "ServiceWorkerClaim";
        BackForwardCacheNotRestoredReason["IgnoreEventAndEvict"] = "IgnoreEventAndEvict";
        BackForwardCacheNotRestoredReason["HaveInnerContents"] = "HaveInnerContents";
        BackForwardCacheNotRestoredReason["TimeoutPuttingInCache"] = "TimeoutPuttingInCache";
        BackForwardCacheNotRestoredReason["BackForwardCacheDisabledByLowMemory"] = "BackForwardCacheDisabledByLowMemory";
        BackForwardCacheNotRestoredReason["BackForwardCacheDisabledByCommandLine"] = "BackForwardCacheDisabledByCommandLine";
        BackForwardCacheNotRestoredReason["NetworkRequestDatAPIpeDrainedAsBytesConsumer"] = "NetworkRequestDatapipeDrainedAsBytesConsumer";
        BackForwardCacheNotRestoredReason["NetworkRequestRedirected"] = "NetworkRequestRedirected";
        BackForwardCacheNotRestoredReason["NetworkRequestTimeout"] = "NetworkRequestTimeout";
        BackForwardCacheNotRestoredReason["NetworkExceedsBufferLimit"] = "NetworkExceedsBufferLimit";
        BackForwardCacheNotRestoredReason["NavigationCancelledWhileRestoring"] = "NavigationCancelledWhileRestoring";
        BackForwardCacheNotRestoredReason["NotMostRecentNavigationEntry"] = "NotMostRecentNavigationEntry";
        BackForwardCacheNotRestoredReason["BackForwardCacheDisabledForPrerender"] = "BackForwardCacheDisabledForPrerender";
        BackForwardCacheNotRestoredReason["UserAgentOverrideDiffers"] = "UserAgentOverrideDiffers";
        BackForwardCacheNotRestoredReason["ForegroundCacheLimit"] = "ForegroundCacheLimit";
        BackForwardCacheNotRestoredReason["BrowsingInstanceNotSwapped"] = "BrowsingInstanceNotSwapped";
        BackForwardCacheNotRestoredReason["BackForwardCacheDisabledForDelegate"] = "BackForwardCacheDisabledForDelegate";
        BackForwardCacheNotRestoredReason["UnloadHandlerExistsInMainFrame"] = "UnloadHandlerExistsInMainFrame";
        BackForwardCacheNotRestoredReason["UnloadHandlerExistsInSubFrame"] = "UnloadHandlerExistsInSubFrame";
        BackForwardCacheNotRestoredReason["ServiceWorkerUnregistration"] = "ServiceWorkerUnregistration";
        BackForwardCacheNotRestoredReason["CacheControlNoStore"] = "CacheControlNoStore";
        BackForwardCacheNotRestoredReason["CacheControlNoStoreCookieModified"] = "CacheControlNoStoreCookieModified";
        BackForwardCacheNotRestoredReason["CacheControlNoStoreHTTPOnlyCookieModified"] = "CacheControlNoStoreHTTPOnlyCookieModified";
        BackForwardCacheNotRestoredReason["NoResponseHead"] = "NoResponseHead";
        BackForwardCacheNotRestoredReason["Unknown"] = "Unknown";
        BackForwardCacheNotRestoredReason["ActivationNavigationsDisallowedForBug1234857"] = "ActivationNavigationsDisallowedForBug1234857";
        BackForwardCacheNotRestoredReason["ErrorDocument"] = "ErrorDocument";
        BackForwardCacheNotRestoredReason["FencedFramesEmbedder"] = "FencedFramesEmbedder";
        BackForwardCacheNotRestoredReason["CookieDisabled"] = "CookieDisabled";
        BackForwardCacheNotRestoredReason["HTTPAuthRequired"] = "HTTPAuthRequired";
        BackForwardCacheNotRestoredReason["CookieFlushed"] = "CookieFlushed";
        BackForwardCacheNotRestoredReason["BroadcastChannelOnMessage"] = "BroadcastChannelOnMessage";
        BackForwardCacheNotRestoredReason["WebViewSettingsChanged"] = "WebViewSettingsChanged";
        BackForwardCacheNotRestoredReason["WebViewJavaScriptObjectChanged"] = "WebViewJavaScriptObjectChanged";
        BackForwardCacheNotRestoredReason["WebViewMessageListenerInjected"] = "WebViewMessageListenerInjected";
        BackForwardCacheNotRestoredReason["WebViewSafeBrowsingAllowlistChanged"] = "WebViewSafeBrowsingAllowlistChanged";
        BackForwardCacheNotRestoredReason["WebViewDocumentStartJavascriptChanged"] = "WebViewDocumentStartJavascriptChanged";
        BackForwardCacheNotRestoredReason["WebSocket"] = "WebSocket";
        BackForwardCacheNotRestoredReason["WebTransport"] = "WebTransport";
        BackForwardCacheNotRestoredReason["WebRTC"] = "WebRTC";
        BackForwardCacheNotRestoredReason["MainResourceHasCacheControlNoStore"] = "MainResourceHasCacheControlNoStore";
        BackForwardCacheNotRestoredReason["MainResourceHasCacheControlNoCache"] = "MainResourceHasCacheControlNoCache";
        BackForwardCacheNotRestoredReason["SubresourceHasCacheControlNoStore"] = "SubresourceHasCacheControlNoStore";
        BackForwardCacheNotRestoredReason["SubresourceHasCacheControlNoCache"] = "SubresourceHasCacheControlNoCache";
        BackForwardCacheNotRestoredReason["ContainsPlugins"] = "ContainsPlugins";
        BackForwardCacheNotRestoredReason["DocumentLoaded"] = "DocumentLoaded";
        BackForwardCacheNotRestoredReason["OutstandingNetworkRequestOthers"] = "OutstandingNetworkRequestOthers";
        BackForwardCacheNotRestoredReason["RequestedMIDIPermission"] = "RequestedMIDIPermission";
        BackForwardCacheNotRestoredReason["RequestedAudioCapturePermission"] = "RequestedAudioCapturePermission";
        BackForwardCacheNotRestoredReason["RequestedVideoCapturePermission"] = "RequestedVideoCapturePermission";
        BackForwardCacheNotRestoredReason["RequestedBackForwardCacheBlockedSensors"] = "RequestedBackForwardCacheBlockedSensors";
        BackForwardCacheNotRestoredReason["RequestedBackgroundWorkPermission"] = "RequestedBackgroundWorkPermission";
        BackForwardCacheNotRestoredReason["BroadcastChannel"] = "BroadcastChannel";
        BackForwardCacheNotRestoredReason["WebXR"] = "WebXR";
        BackForwardCacheNotRestoredReason["SharedWorker"] = "SharedWorker";
        BackForwardCacheNotRestoredReason["SharedWorkerMessage"] = "SharedWorkerMessage";
        BackForwardCacheNotRestoredReason["WebLocks"] = "WebLocks";
        BackForwardCacheNotRestoredReason["WebHID"] = "WebHID";
        BackForwardCacheNotRestoredReason["WebShare"] = "WebShare";
        BackForwardCacheNotRestoredReason["RequestedStorageAccessGrant"] = "RequestedStorageAccessGrant";
        BackForwardCacheNotRestoredReason["WebNfc"] = "WebNfc";
        BackForwardCacheNotRestoredReason["OutstandingNetworkRequestFetch"] = "OutstandingNetworkRequestFetch";
        BackForwardCacheNotRestoredReason["OutstandingNetworkRequestXHR"] = "OutstandingNetworkRequestXHR";
        BackForwardCacheNotRestoredReason["AppBanner"] = "AppBanner";
        BackForwardCacheNotRestoredReason["Printing"] = "Printing";
        BackForwardCacheNotRestoredReason["WebDatabase"] = "WebDatabase";
        BackForwardCacheNotRestoredReason["PictureInPicture"] = "PictureInPicture";
        BackForwardCacheNotRestoredReason["SpeechRecognizer"] = "SpeechRecognizer";
        BackForwardCacheNotRestoredReason["IdleManager"] = "IdleManager";
        BackForwardCacheNotRestoredReason["PaymentManager"] = "PaymentManager";
        BackForwardCacheNotRestoredReason["SpeechSynthesis"] = "SpeechSynthesis";
        BackForwardCacheNotRestoredReason["KeyboardLock"] = "KeyboardLock";
        BackForwardCacheNotRestoredReason["WebOTPService"] = "WebOTPService";
        BackForwardCacheNotRestoredReason["OutstandingNetworkRequestDirectSocket"] = "OutstandingNetworkRequestDirectSocket";
        BackForwardCacheNotRestoredReason["InjectedJavascript"] = "InjectedJavascript";
        BackForwardCacheNotRestoredReason["InjectedStyleSheet"] = "InjectedStyleSheet";
        BackForwardCacheNotRestoredReason["KeepaliveRequest"] = "KeepaliveRequest";
        BackForwardCacheNotRestoredReason["IndexedDBEvent"] = "IndexedDBEvent";
        BackForwardCacheNotRestoredReason["Dummy"] = "Dummy";
        BackForwardCacheNotRestoredReason["JsNetworkRequestReceivedCacheControlNoStoreResource"] = "JsNetworkRequestReceivedCacheControlNoStoreResource";
        BackForwardCacheNotRestoredReason["WebRTCSticky"] = "WebRTCSticky";
        BackForwardCacheNotRestoredReason["WebTransportSticky"] = "WebTransportSticky";
        BackForwardCacheNotRestoredReason["WebSocketSticky"] = "WebSocketSticky";
        BackForwardCacheNotRestoredReason["SmartCard"] = "SmartCard";
        BackForwardCacheNotRestoredReason["LiveMediaStreamTrack"] = "LiveMediaStreamTrack";
        BackForwardCacheNotRestoredReason["UnloadHandler"] = "UnloadHandler";
        BackForwardCacheNotRestoredReason["ParserAborted"] = "ParserAborted";
        BackForwardCacheNotRestoredReason["ContentSecurityHandler"] = "ContentSecurityHandler";
        BackForwardCacheNotRestoredReason["ContentWebAuthenticationAPI"] = "ContentWebAuthenticationAPI";
        BackForwardCacheNotRestoredReason["ContentFileChooser"] = "ContentFileChooser";
        BackForwardCacheNotRestoredReason["ContentSerial"] = "ContentSerial";
        BackForwardCacheNotRestoredReason["ContentFileSystemAccess"] = "ContentFileSystemAccess";
        BackForwardCacheNotRestoredReason["ContentMediaDevicesDispatcherHost"] = "ContentMediaDevicesDispatcherHost";
        BackForwardCacheNotRestoredReason["ContentWebBluetooth"] = "ContentWebBluetooth";
        BackForwardCacheNotRestoredReason["ContentWebUSB"] = "ContentWebUSB";
        BackForwardCacheNotRestoredReason["ContentMediaSessionService"] = "ContentMediaSessionService";
        BackForwardCacheNotRestoredReason["ContentScreenReader"] = "ContentScreenReader";
        BackForwardCacheNotRestoredReason["ContentDiscarded"] = "ContentDiscarded";
        BackForwardCacheNotRestoredReason["EmbedderPopupBlockerTabHelper"] = "EmbedderPopupBlockerTabHelper";
        BackForwardCacheNotRestoredReason["EmbedderSafeBrowsingTriggeredPopupBlocker"] = "EmbedderSafeBrowsingTriggeredPopupBlocker";
        BackForwardCacheNotRestoredReason["EmbedderSafeBrowsingThreatDetails"] = "EmbedderSafeBrowsingThreatDetails";
        BackForwardCacheNotRestoredReason["EmbedderAppBannerManager"] = "EmbedderAppBannerManager";
        BackForwardCacheNotRestoredReason["EmbedderDomDistillerViewerSource"] = "EmbedderDomDistillerViewerSource";
        BackForwardCacheNotRestoredReason["EmbedderDomDistillerSelfDeletingRequestDelegate"] = "EmbedderDomDistillerSelfDeletingRequestDelegate";
        BackForwardCacheNotRestoredReason["EmbedderOomInterventionTabHelper"] = "EmbedderOomInterventionTabHelper";
        BackForwardCacheNotRestoredReason["EmbedderOfflinePage"] = "EmbedderOfflinePage";
        BackForwardCacheNotRestoredReason["EmbedderChromePasswordManagerClientBindCredentialManager"] = "EmbedderChromePasswordManagerClientBindCredentialManager";
        BackForwardCacheNotRestoredReason["EmbedderPermissionRequestManager"] = "EmbedderPermissionRequestManager";
        BackForwardCacheNotRestoredReason["EmbedderModalDialog"] = "EmbedderModalDialog";
        BackForwardCacheNotRestoredReason["EmbedderExtensions"] = "EmbedderExtensions";
        BackForwardCacheNotRestoredReason["EmbedderExtensionMessaging"] = "EmbedderExtensionMessaging";
        BackForwardCacheNotRestoredReason["EmbedderExtensionMessagingForOpenPort"] = "EmbedderExtensionMessagingForOpenPort";
        BackForwardCacheNotRestoredReason["EmbedderExtensionSentMessageToCachedFrame"] = "EmbedderExtensionSentMessageToCachedFrame";
        BackForwardCacheNotRestoredReason["RequestedByWebViewClient"] = "RequestedByWebViewClient";
        BackForwardCacheNotRestoredReason["PostMessageByWebViewClient"] = "PostMessageByWebViewClient";
        BackForwardCacheNotRestoredReason["CacheControlNoStoreDeviceBoundSessionTerminated"] = "CacheControlNoStoreDeviceBoundSessionTerminated";
        BackForwardCacheNotRestoredReason["CacheLimitPrunedOnModerateMemoryPressure"] = "CacheLimitPrunedOnModerateMemoryPressure";
        BackForwardCacheNotRestoredReason["CacheLimitPrunedOnCriticalMemoryPressure"] = "CacheLimitPrunedOnCriticalMemoryPressure";
    })(BackForwardCacheNotRestoredReason = Page.BackForwardCacheNotRestoredReason || (Page.BackForwardCacheNotRestoredReason = {}));
    /**
     * Types of not restored reasons for back-forward cache.
     */
    let BackForwardCacheNotRestoredReasonType;
    (function (BackForwardCacheNotRestoredReasonType) {
        BackForwardCacheNotRestoredReasonType["SupportPending"] = "SupportPending";
        BackForwardCacheNotRestoredReasonType["PageSupportNeeded"] = "PageSupportNeeded";
        BackForwardCacheNotRestoredReasonType["Circumstantial"] = "Circumstantial";
    })(BackForwardCacheNotRestoredReasonType = Page.BackForwardCacheNotRestoredReasonType || (Page.BackForwardCacheNotRestoredReasonType = {}));
    let CaptureScreenshotRequestFormat;
    (function (CaptureScreenshotRequestFormat) {
        CaptureScreenshotRequestFormat["Jpeg"] = "jpeg";
        CaptureScreenshotRequestFormat["Png"] = "png";
        CaptureScreenshotRequestFormat["Webp"] = "webp";
    })(CaptureScreenshotRequestFormat = Page.CaptureScreenshotRequestFormat || (Page.CaptureScreenshotRequestFormat = {}));
    let CaptureSnapshotRequestFormat;
    (function (CaptureSnapshotRequestFormat) {
        CaptureSnapshotRequestFormat["MHTML"] = "mhtml";
    })(CaptureSnapshotRequestFormat = Page.CaptureSnapshotRequestFormat || (Page.CaptureSnapshotRequestFormat = {}));
    let PrintToPDFRequestTransferMode;
    (function (PrintToPDFRequestTransferMode) {
        PrintToPDFRequestTransferMode["ReturnAsBase64"] = "ReturnAsBase64";
        PrintToPDFRequestTransferMode["ReturnAsStream"] = "ReturnAsStream";
    })(PrintToPDFRequestTransferMode = Page.PrintToPDFRequestTransferMode || (Page.PrintToPDFRequestTransferMode = {}));
    let SetDownloadBehaviorRequestBehavior;
    (function (SetDownloadBehaviorRequestBehavior) {
        SetDownloadBehaviorRequestBehavior["Deny"] = "deny";
        SetDownloadBehaviorRequestBehavior["Allow"] = "allow";
        SetDownloadBehaviorRequestBehavior["Default"] = "default";
    })(SetDownloadBehaviorRequestBehavior = Page.SetDownloadBehaviorRequestBehavior || (Page.SetDownloadBehaviorRequestBehavior = {}));
    let SetTouchEmulationEnabledRequestConfiguration;
    (function (SetTouchEmulationEnabledRequestConfiguration) {
        SetTouchEmulationEnabledRequestConfiguration["Mobile"] = "mobile";
        SetTouchEmulationEnabledRequestConfiguration["Desktop"] = "desktop";
    })(SetTouchEmulationEnabledRequestConfiguration = Page.SetTouchEmulationEnabledRequestConfiguration || (Page.SetTouchEmulationEnabledRequestConfiguration = {}));
    let StartScreencastRequestFormat;
    (function (StartScreencastRequestFormat) {
        StartScreencastRequestFormat["Jpeg"] = "jpeg";
        StartScreencastRequestFormat["Png"] = "png";
    })(StartScreencastRequestFormat = Page.StartScreencastRequestFormat || (Page.StartScreencastRequestFormat = {}));
    let SetWebLifecycleStateRequestState;
    (function (SetWebLifecycleStateRequestState) {
        SetWebLifecycleStateRequestState["Frozen"] = "frozen";
        SetWebLifecycleStateRequestState["Active"] = "active";
    })(SetWebLifecycleStateRequestState = Page.SetWebLifecycleStateRequestState || (Page.SetWebLifecycleStateRequestState = {}));
    let SetSPCTransactionModeRequestMode;
    (function (SetSPCTransactionModeRequestMode) {
        SetSPCTransactionModeRequestMode["None"] = "none";
        SetSPCTransactionModeRequestMode["AutoAccept"] = "autoAccept";
        SetSPCTransactionModeRequestMode["AutoChooseToAuthAnotherWay"] = "autoChooseToAuthAnotherWay";
        SetSPCTransactionModeRequestMode["AutoReject"] = "autoReject";
        SetSPCTransactionModeRequestMode["AutoOptOut"] = "autoOptOut";
    })(SetSPCTransactionModeRequestMode = Page.SetSPCTransactionModeRequestMode || (Page.SetSPCTransactionModeRequestMode = {}));
    let SetRPHRegistrationModeRequestMode;
    (function (SetRPHRegistrationModeRequestMode) {
        SetRPHRegistrationModeRequestMode["None"] = "none";
        SetRPHRegistrationModeRequestMode["AutoAccept"] = "autoAccept";
        SetRPHRegistrationModeRequestMode["AutoReject"] = "autoReject";
    })(SetRPHRegistrationModeRequestMode = Page.SetRPHRegistrationModeRequestMode || (Page.SetRPHRegistrationModeRequestMode = {}));
    let FileChooserOpenedEventMode;
    (function (FileChooserOpenedEventMode) {
        FileChooserOpenedEventMode["SelectSingle"] = "selectSingle";
        FileChooserOpenedEventMode["SelectMultiple"] = "selectMultiple";
    })(FileChooserOpenedEventMode = Page.FileChooserOpenedEventMode || (Page.FileChooserOpenedEventMode = {}));
    let FrameDetachedEventReason;
    (function (FrameDetachedEventReason) {
        FrameDetachedEventReason["Remove"] = "remove";
        FrameDetachedEventReason["Swap"] = "swap";
    })(FrameDetachedEventReason = Page.FrameDetachedEventReason || (Page.FrameDetachedEventReason = {}));
    let FrameStartedNavigatingEventNavigationType;
    (function (FrameStartedNavigatingEventNavigationType) {
        FrameStartedNavigatingEventNavigationType["Reload"] = "reload";
        FrameStartedNavigatingEventNavigationType["ReloadBypassingCache"] = "reloadBypassingCache";
        FrameStartedNavigatingEventNavigationType["Restore"] = "restore";
        FrameStartedNavigatingEventNavigationType["RestoreWithPost"] = "restoreWithPost";
        FrameStartedNavigatingEventNavigationType["HistorySameDocument"] = "historySameDocument";
        FrameStartedNavigatingEventNavigationType["HistoryDifferentDocument"] = "historyDifferentDocument";
        FrameStartedNavigatingEventNavigationType["SameDocument"] = "sameDocument";
        FrameStartedNavigatingEventNavigationType["DifferentDocument"] = "differentDocument";
    })(FrameStartedNavigatingEventNavigationType = Page.FrameStartedNavigatingEventNavigationType || (Page.FrameStartedNavigatingEventNavigationType = {}));
    let DownloadProgressEventState;
    (function (DownloadProgressEventState) {
        DownloadProgressEventState["InProgress"] = "inProgress";
        DownloadProgressEventState["Completed"] = "completed";
        DownloadProgressEventState["Canceled"] = "canceled";
    })(DownloadProgressEventState = Page.DownloadProgressEventState || (Page.DownloadProgressEventState = {}));
    let NavigatedWithinDocumentEventNavigationType;
    (function (NavigatedWithinDocumentEventNavigationType) {
        NavigatedWithinDocumentEventNavigationType["Fragment"] = "fragment";
        NavigatedWithinDocumentEventNavigationType["HistoryAPI"] = "historyApi";
        NavigatedWithinDocumentEventNavigationType["Other"] = "other";
    })(NavigatedWithinDocumentEventNavigationType = Page.NavigatedWithinDocumentEventNavigationType || (Page.NavigatedWithinDocumentEventNavigationType = {}));
})(Page || (Page = {}));
export var Performance;
(function (Performance) {
    let EnableRequestTimeDomain;
    (function (EnableRequestTimeDomain) {
        EnableRequestTimeDomain["TimeTicks"] = "timeTicks";
        EnableRequestTimeDomain["ThreadTicks"] = "threadTicks";
    })(EnableRequestTimeDomain = Performance.EnableRequestTimeDomain || (Performance.EnableRequestTimeDomain = {}));
    let SetTimeDomainRequestTimeDomain;
    (function (SetTimeDomainRequestTimeDomain) {
        SetTimeDomainRequestTimeDomain["TimeTicks"] = "timeTicks";
        SetTimeDomainRequestTimeDomain["ThreadTicks"] = "threadTicks";
    })(SetTimeDomainRequestTimeDomain = Performance.SetTimeDomainRequestTimeDomain || (Performance.SetTimeDomainRequestTimeDomain = {}));
})(Performance || (Performance = {}));
/**
 * Security
 */
export var Security;
(function (Security) {
    /**
     * A description of mixed content (HTTP resources on HTTPS pages), as defined by
     * https://www.w3.org/TR/mixed-content/#categories
     */
    let MixedContentType;
    (function (MixedContentType) {
        MixedContentType["Blockable"] = "blockable";
        MixedContentType["OptionallyBlockable"] = "optionally-blockable";
        MixedContentType["None"] = "none";
    })(MixedContentType = Security.MixedContentType || (Security.MixedContentType = {}));
    /**
     * The security level of a page or resource.
     */
    let SecurityState;
    (function (SecurityState) {
        SecurityState["Unknown"] = "unknown";
        SecurityState["Neutral"] = "neutral";
        SecurityState["Insecure"] = "insecure";
        SecurityState["Secure"] = "secure";
        SecurityState["Info"] = "info";
        SecurityState["InsecureBroken"] = "insecure-broken";
    })(SecurityState = Security.SecurityState || (Security.SecurityState = {}));
    let SafetyTipStatus;
    (function (SafetyTipStatus) {
        SafetyTipStatus["BadReputation"] = "badReputation";
        SafetyTipStatus["Lookalike"] = "lookalike";
    })(SafetyTipStatus = Security.SafetyTipStatus || (Security.SafetyTipStatus = {}));
    /**
     * The action to take when a certificate error occurs. continue will continue processing the
     * request and cancel will cancel the request.
     */
    let CertificateErrorAction;
    (function (CertificateErrorAction) {
        CertificateErrorAction["Continue"] = "continue";
        CertificateErrorAction["Cancel"] = "cancel";
    })(CertificateErrorAction = Security.CertificateErrorAction || (Security.CertificateErrorAction = {}));
})(Security || (Security = {}));
export var ServiceWorker;
(function (ServiceWorker) {
    let ServiceWorkerVersionRunningStatus;
    (function (ServiceWorkerVersionRunningStatus) {
        ServiceWorkerVersionRunningStatus["Stopped"] = "stopped";
        ServiceWorkerVersionRunningStatus["Starting"] = "starting";
        ServiceWorkerVersionRunningStatus["Running"] = "running";
        ServiceWorkerVersionRunningStatus["Stopping"] = "stopping";
    })(ServiceWorkerVersionRunningStatus = ServiceWorker.ServiceWorkerVersionRunningStatus || (ServiceWorker.ServiceWorkerVersionRunningStatus = {}));
    let ServiceWorkerVersionStatus;
    (function (ServiceWorkerVersionStatus) {
        ServiceWorkerVersionStatus["New"] = "new";
        ServiceWorkerVersionStatus["Installing"] = "installing";
        ServiceWorkerVersionStatus["Installed"] = "installed";
        ServiceWorkerVersionStatus["Activating"] = "activating";
        ServiceWorkerVersionStatus["Activated"] = "activated";
        ServiceWorkerVersionStatus["Redundant"] = "redundant";
    })(ServiceWorkerVersionStatus = ServiceWorker.ServiceWorkerVersionStatus || (ServiceWorker.ServiceWorkerVersionStatus = {}));
})(ServiceWorker || (ServiceWorker = {}));
export var Storage;
(function (Storage) {
    /**
     * Enum of possible storage types.
     */
    let StorageType;
    (function (StorageType) {
        StorageType["Cookies"] = "cookies";
        StorageType["File_systems"] = "file_systems";
        StorageType["Indexeddb"] = "indexeddb";
        StorageType["Local_storage"] = "local_storage";
        StorageType["Shader_cache"] = "shader_cache";
        StorageType["Websql"] = "websql";
        StorageType["Service_workers"] = "service_workers";
        StorageType["Cache_storage"] = "cache_storage";
        StorageType["Interest_groups"] = "interest_groups";
        StorageType["Shared_storage"] = "shared_storage";
        StorageType["Storage_buckets"] = "storage_buckets";
        StorageType["All"] = "all";
        StorageType["Other"] = "other";
    })(StorageType = Storage.StorageType || (Storage.StorageType = {}));
    /**
     * Enum of interest group access types.
     */
    let InterestGroupAccessType;
    (function (InterestGroupAccessType) {
        InterestGroupAccessType["Join"] = "join";
        InterestGroupAccessType["Leave"] = "leave";
        InterestGroupAccessType["Update"] = "update";
        InterestGroupAccessType["Loaded"] = "loaded";
        InterestGroupAccessType["Bid"] = "bid";
        InterestGroupAccessType["Win"] = "win";
        InterestGroupAccessType["AdditionalBid"] = "additionalBid";
        InterestGroupAccessType["AdditionalBidWin"] = "additionalBidWin";
        InterestGroupAccessType["TopLevelBid"] = "topLevelBid";
        InterestGroupAccessType["TopLevelAdditionalBid"] = "topLevelAdditionalBid";
        InterestGroupAccessType["Clear"] = "clear";
    })(InterestGroupAccessType = Storage.InterestGroupAccessType || (Storage.InterestGroupAccessType = {}));
    /**
     * Enum of auction events.
     */
    let InterestGroupAuctionEventType;
    (function (InterestGroupAuctionEventType) {
        InterestGroupAuctionEventType["Started"] = "started";
        InterestGroupAuctionEventType["ConfigResolved"] = "configResolved";
    })(InterestGroupAuctionEventType = Storage.InterestGroupAuctionEventType || (Storage.InterestGroupAuctionEventType = {}));
    /**
     * Enum of network fetches auctions can do.
     */
    let InterestGroupAuctionFetchType;
    (function (InterestGroupAuctionFetchType) {
        InterestGroupAuctionFetchType["BidderJs"] = "bidderJs";
        InterestGroupAuctionFetchType["BidderWasm"] = "bidderWasm";
        InterestGroupAuctionFetchType["SellerJs"] = "sellerJs";
        InterestGroupAuctionFetchType["BidderTrustedSignals"] = "bidderTrustedSignals";
        InterestGroupAuctionFetchType["SellerTrustedSignals"] = "sellerTrustedSignals";
    })(InterestGroupAuctionFetchType = Storage.InterestGroupAuctionFetchType || (Storage.InterestGroupAuctionFetchType = {}));
    /**
     * Enum of shared storage access scopes.
     */
    let SharedStorageAccessScope;
    (function (SharedStorageAccessScope) {
        SharedStorageAccessScope["Window"] = "window";
        SharedStorageAccessScope["SharedStorageWorklet"] = "sharedStorageWorklet";
        SharedStorageAccessScope["ProtectedAudienceWorklet"] = "protectedAudienceWorklet";
        SharedStorageAccessScope["Header"] = "header";
    })(SharedStorageAccessScope = Storage.SharedStorageAccessScope || (Storage.SharedStorageAccessScope = {}));
    /**
     * Enum of shared storage access methods.
     */
    let SharedStorageAccessMethod;
    (function (SharedStorageAccessMethod) {
        SharedStorageAccessMethod["AddModule"] = "addModule";
        SharedStorageAccessMethod["CreateWorklet"] = "createWorklet";
        SharedStorageAccessMethod["SelectURL"] = "selectURL";
        SharedStorageAccessMethod["Run"] = "run";
        SharedStorageAccessMethod["BatchUpdate"] = "batchUpdate";
        SharedStorageAccessMethod["Set"] = "set";
        SharedStorageAccessMethod["Append"] = "append";
        SharedStorageAccessMethod["Delete"] = "delete";
        SharedStorageAccessMethod["Clear"] = "clear";
        SharedStorageAccessMethod["Get"] = "get";
        SharedStorageAccessMethod["Keys"] = "keys";
        SharedStorageAccessMethod["Values"] = "values";
        SharedStorageAccessMethod["Entries"] = "entries";
        SharedStorageAccessMethod["Length"] = "length";
        SharedStorageAccessMethod["RemainingBudget"] = "remainingBudget";
    })(SharedStorageAccessMethod = Storage.SharedStorageAccessMethod || (Storage.SharedStorageAccessMethod = {}));
    let StorageBucketsDurability;
    (function (StorageBucketsDurability) {
        StorageBucketsDurability["Relaxed"] = "relaxed";
        StorageBucketsDurability["Strict"] = "strict";
    })(StorageBucketsDurability = Storage.StorageBucketsDurability || (Storage.StorageBucketsDurability = {}));
    let AttributionReportingSourceType;
    (function (AttributionReportingSourceType) {
        AttributionReportingSourceType["Navigation"] = "navigation";
        AttributionReportingSourceType["Event"] = "event";
    })(AttributionReportingSourceType = Storage.AttributionReportingSourceType || (Storage.AttributionReportingSourceType = {}));
    let AttributionReportingTriggerDataMatching;
    (function (AttributionReportingTriggerDataMatching) {
        AttributionReportingTriggerDataMatching["Exact"] = "exact";
        AttributionReportingTriggerDataMatching["Modulus"] = "modulus";
    })(AttributionReportingTriggerDataMatching = Storage.AttributionReportingTriggerDataMatching || (Storage.AttributionReportingTriggerDataMatching = {}));
    let AttributionReportingSourceRegistrationResult;
    (function (AttributionReportingSourceRegistrationResult) {
        AttributionReportingSourceRegistrationResult["Success"] = "success";
        AttributionReportingSourceRegistrationResult["InternalError"] = "internalError";
        AttributionReportingSourceRegistrationResult["InsufficientSourceCapacity"] = "insufficientSourceCapacity";
        AttributionReportingSourceRegistrationResult["InsufficientUniqueDestinationCapacity"] = "insufficientUniqueDestinationCapacity";
        AttributionReportingSourceRegistrationResult["ExcessiveReportingOrigins"] = "excessiveReportingOrigins";
        AttributionReportingSourceRegistrationResult["ProhibitedByBrowserPolicy"] = "prohibitedByBrowserPolicy";
        AttributionReportingSourceRegistrationResult["SuccessNoised"] = "successNoised";
        AttributionReportingSourceRegistrationResult["DestinationReportingLimitReached"] = "destinationReportingLimitReached";
        AttributionReportingSourceRegistrationResult["DestinationGlobalLimitReached"] = "destinationGlobalLimitReached";
        AttributionReportingSourceRegistrationResult["DestinationBothLimitsReached"] = "destinationBothLimitsReached";
        AttributionReportingSourceRegistrationResult["ReportingOriginsPerSiteLimitReached"] = "reportingOriginsPerSiteLimitReached";
        AttributionReportingSourceRegistrationResult["ExceedsMaxChannelCapacity"] = "exceedsMaxChannelCapacity";
        AttributionReportingSourceRegistrationResult["ExceedsMaxScopesChannelCapacity"] = "exceedsMaxScopesChannelCapacity";
        AttributionReportingSourceRegistrationResult["ExceedsMaxTriggerStateCardinality"] = "exceedsMaxTriggerStateCardinality";
        AttributionReportingSourceRegistrationResult["ExceedsMaxEventStatesLimit"] = "exceedsMaxEventStatesLimit";
        AttributionReportingSourceRegistrationResult["DestinationPerDayReportingLimitReached"] = "destinationPerDayReportingLimitReached";
    })(AttributionReportingSourceRegistrationResult = Storage.AttributionReportingSourceRegistrationResult || (Storage.AttributionReportingSourceRegistrationResult = {}));
    let AttributionReportingSourceRegistrationTimeConfig;
    (function (AttributionReportingSourceRegistrationTimeConfig) {
        AttributionReportingSourceRegistrationTimeConfig["Include"] = "include";
        AttributionReportingSourceRegistrationTimeConfig["Exclude"] = "exclude";
    })(AttributionReportingSourceRegistrationTimeConfig = Storage.AttributionReportingSourceRegistrationTimeConfig || (Storage.AttributionReportingSourceRegistrationTimeConfig = {}));
    let AttributionReportingEventLevelResult;
    (function (AttributionReportingEventLevelResult) {
        AttributionReportingEventLevelResult["Success"] = "success";
        AttributionReportingEventLevelResult["SuccessDroppedLowerPriority"] = "successDroppedLowerPriority";
        AttributionReportingEventLevelResult["InternalError"] = "internalError";
        AttributionReportingEventLevelResult["NoCapacityForAttributionDestination"] = "noCapacityForAttributionDestination";
        AttributionReportingEventLevelResult["NoMatchingSources"] = "noMatchingSources";
        AttributionReportingEventLevelResult["Deduplicated"] = "deduplicated";
        AttributionReportingEventLevelResult["ExcessiveAttributions"] = "excessiveAttributions";
        AttributionReportingEventLevelResult["PriorityTooLow"] = "priorityTooLow";
        AttributionReportingEventLevelResult["NeverAttributedSource"] = "neverAttributedSource";
        AttributionReportingEventLevelResult["ExcessiveReportingOrigins"] = "excessiveReportingOrigins";
        AttributionReportingEventLevelResult["NoMatchingSourceFilterData"] = "noMatchingSourceFilterData";
        AttributionReportingEventLevelResult["ProhibitedByBrowserPolicy"] = "prohibitedByBrowserPolicy";
        AttributionReportingEventLevelResult["NoMatchingConfigurations"] = "noMatchingConfigurations";
        AttributionReportingEventLevelResult["ExcessiveReports"] = "excessiveReports";
        AttributionReportingEventLevelResult["FalselyAttributedSource"] = "falselyAttributedSource";
        AttributionReportingEventLevelResult["ReportWindowPassed"] = "reportWindowPassed";
        AttributionReportingEventLevelResult["NotRegistered"] = "notRegistered";
        AttributionReportingEventLevelResult["ReportWindowNotStarted"] = "reportWindowNotStarted";
        AttributionReportingEventLevelResult["NoMatchingTriggerData"] = "noMatchingTriggerData";
    })(AttributionReportingEventLevelResult = Storage.AttributionReportingEventLevelResult || (Storage.AttributionReportingEventLevelResult = {}));
    let AttributionReportingAggregatableResult;
    (function (AttributionReportingAggregatableResult) {
        AttributionReportingAggregatableResult["Success"] = "success";
        AttributionReportingAggregatableResult["InternalError"] = "internalError";
        AttributionReportingAggregatableResult["NoCapacityForAttributionDestination"] = "noCapacityForAttributionDestination";
        AttributionReportingAggregatableResult["NoMatchingSources"] = "noMatchingSources";
        AttributionReportingAggregatableResult["ExcessiveAttributions"] = "excessiveAttributions";
        AttributionReportingAggregatableResult["ExcessiveReportingOrigins"] = "excessiveReportingOrigins";
        AttributionReportingAggregatableResult["NoHistograms"] = "noHistograms";
        AttributionReportingAggregatableResult["InsufficientBudget"] = "insufficientBudget";
        AttributionReportingAggregatableResult["InsufficientNamedBudget"] = "insufficientNamedBudget";
        AttributionReportingAggregatableResult["NoMatchingSourceFilterData"] = "noMatchingSourceFilterData";
        AttributionReportingAggregatableResult["NotRegistered"] = "notRegistered";
        AttributionReportingAggregatableResult["ProhibitedByBrowserPolicy"] = "prohibitedByBrowserPolicy";
        AttributionReportingAggregatableResult["Deduplicated"] = "deduplicated";
        AttributionReportingAggregatableResult["ReportWindowPassed"] = "reportWindowPassed";
        AttributionReportingAggregatableResult["ExcessiveReports"] = "excessiveReports";
    })(AttributionReportingAggregatableResult = Storage.AttributionReportingAggregatableResult || (Storage.AttributionReportingAggregatableResult = {}));
    let AttributionReportingReportResult;
    (function (AttributionReportingReportResult) {
        AttributionReportingReportResult["Sent"] = "sent";
        AttributionReportingReportResult["Prohibited"] = "prohibited";
        AttributionReportingReportResult["FailedToAssemble"] = "failedToAssemble";
        AttributionReportingReportResult["Expired"] = "expired";
    })(AttributionReportingReportResult = Storage.AttributionReportingReportResult || (Storage.AttributionReportingReportResult = {}));
})(Storage || (Storage = {}));
/**
 * The SystemInfo domain defines methods and events for querying low-level system information.
 */
export var SystemInfo;
(function (SystemInfo) {
    /**
     * YUV subsampling type of the pixels of a given image.
     */
    let SubsamplingFormat;
    (function (SubsamplingFormat) {
        SubsamplingFormat["Yuv420"] = "yuv420";
        SubsamplingFormat["Yuv422"] = "yuv422";
        SubsamplingFormat["Yuv444"] = "yuv444";
    })(SubsamplingFormat = SystemInfo.SubsamplingFormat || (SystemInfo.SubsamplingFormat = {}));
    /**
     * Image format of a given image.
     */
    let ImageType;
    (function (ImageType) {
        ImageType["Jpeg"] = "jpeg";
        ImageType["Webp"] = "webp";
        ImageType["Unknown"] = "unknown";
    })(ImageType = SystemInfo.ImageType || (SystemInfo.ImageType = {}));
})(SystemInfo || (SystemInfo = {}));
/**
 * Supports additional targets discovery and allows to attach to them.
 */
export var Target;
(function (Target) {
    /**
     * The state of the target window.
     */
    let WindowState;
    (function (WindowState) {
        WindowState["Normal"] = "normal";
        WindowState["Minimized"] = "minimized";
        WindowState["Maximized"] = "maximized";
        WindowState["Fullscreen"] = "fullscreen";
    })(WindowState = Target.WindowState || (Target.WindowState = {}));
})(Target || (Target = {}));
export var Tracing;
(function (Tracing) {
    let TraceConfigRecordMode;
    (function (TraceConfigRecordMode) {
        TraceConfigRecordMode["RecordUntilFull"] = "recordUntilFull";
        TraceConfigRecordMode["RecordContinuously"] = "recordContinuously";
        TraceConfigRecordMode["RecordAsMuchAsPossible"] = "recordAsMuchAsPossible";
        TraceConfigRecordMode["EchoToConsole"] = "echoToConsole";
    })(TraceConfigRecordMode = Tracing.TraceConfigRecordMode || (Tracing.TraceConfigRecordMode = {}));
    /**
     * Data format of a trace. Can be either the legacy JSON format or the
     * protocol buffer format. Note that the JSON format will be deprecated soon.
     */
    let StreamFormat;
    (function (StreamFormat) {
        StreamFormat["Json"] = "json";
        StreamFormat["Proto"] = "proto";
    })(StreamFormat = Tracing.StreamFormat || (Tracing.StreamFormat = {}));
    /**
     * Compression type to use for traces returned via streams.
     */
    let StreamCompression;
    (function (StreamCompression) {
        StreamCompression["None"] = "none";
        StreamCompression["Gzip"] = "gzip";
    })(StreamCompression = Tracing.StreamCompression || (Tracing.StreamCompression = {}));
    /**
     * Details exposed when memory request explicitly declared.
     * Keep consistent with memory_dump_request_args.h and
     * memory_instrumentation.mojom
     */
    let MemoryDumpLevelOfDetail;
    (function (MemoryDumpLevelOfDetail) {
        MemoryDumpLevelOfDetail["Background"] = "background";
        MemoryDumpLevelOfDetail["Light"] = "light";
        MemoryDumpLevelOfDetail["Detailed"] = "detailed";
    })(MemoryDumpLevelOfDetail = Tracing.MemoryDumpLevelOfDetail || (Tracing.MemoryDumpLevelOfDetail = {}));
    /**
     * Backend type to use for tracing. `chrome` uses the Chrome-integrated
     * tracing service and is supported on all platforms. `system` is only
     * supported on Chrome OS and uses the Perfetto system tracing service.
     * `auto` chooses `system` when the perfettoConfig provided to Tracing.start
     * specifies at least one non-Chrome data source; otherwise uses `chrome`.
     */
    let TracingBackend;
    (function (TracingBackend) {
        TracingBackend["Auto"] = "auto";
        TracingBackend["Chrome"] = "chrome";
        TracingBackend["System"] = "system";
    })(TracingBackend = Tracing.TracingBackend || (Tracing.TracingBackend = {}));
    let StartRequestTransferMode;
    (function (StartRequestTransferMode) {
        StartRequestTransferMode["ReportEvents"] = "ReportEvents";
        StartRequestTransferMode["ReturnAsStream"] = "ReturnAsStream";
    })(StartRequestTransferMode = Tracing.StartRequestTransferMode || (Tracing.StartRequestTransferMode = {}));
})(Tracing || (Tracing = {}));
/**
 * A domain for letting clients substitute browser's network layer with client code.
 */
export var Fetch;
(function (Fetch) {
    /**
     * Stages of the request to handle. Request will intercept before the request is
     * sent. Response will intercept after the response is received (but before response
     * body is received).
     */
    let RequestStage;
    (function (RequestStage) {
        RequestStage["Request"] = "Request";
        RequestStage["Response"] = "Response";
    })(RequestStage = Fetch.RequestStage || (Fetch.RequestStage = {}));
    let AuthChallengeSource;
    (function (AuthChallengeSource) {
        AuthChallengeSource["Server"] = "Server";
        AuthChallengeSource["Proxy"] = "Proxy";
    })(AuthChallengeSource = Fetch.AuthChallengeSource || (Fetch.AuthChallengeSource = {}));
    let AuthChallengeResponseResponse;
    (function (AuthChallengeResponseResponse) {
        AuthChallengeResponseResponse["Default"] = "Default";
        AuthChallengeResponseResponse["CancelAuth"] = "CancelAuth";
        AuthChallengeResponseResponse["ProvideCredentials"] = "ProvideCredentials";
    })(AuthChallengeResponseResponse = Fetch.AuthChallengeResponseResponse || (Fetch.AuthChallengeResponseResponse = {}));
})(Fetch || (Fetch = {}));
/**
 * This domain allows inspection of Web Audio API.
 * https://webaudio.github.io/web-audio-api/
 */
export var WebAudio;
(function (WebAudio) {
    /**
     * Enum of BaseAudioContext types
     */
    let ContextType;
    (function (ContextType) {
        ContextType["Realtime"] = "realtime";
        ContextType["Offline"] = "offline";
    })(ContextType = WebAudio.ContextType || (WebAudio.ContextType = {}));
    /**
     * Enum of AudioContextState from the spec
     */
    let ContextState;
    (function (ContextState) {
        ContextState["Suspended"] = "suspended";
        ContextState["Running"] = "running";
        ContextState["Closed"] = "closed";
        ContextState["Interrupted"] = "interrupted";
    })(ContextState = WebAudio.ContextState || (WebAudio.ContextState = {}));
    /**
     * Enum of AudioNode::ChannelCountMode from the spec
     */
    let ChannelCountMode;
    (function (ChannelCountMode) {
        ChannelCountMode["ClampedMax"] = "clamped-max";
        ChannelCountMode["Explicit"] = "explicit";
        ChannelCountMode["Max"] = "max";
    })(ChannelCountMode = WebAudio.ChannelCountMode || (WebAudio.ChannelCountMode = {}));
    /**
     * Enum of AudioNode::ChannelInterpretation from the spec
     */
    let ChannelInterpretation;
    (function (ChannelInterpretation) {
        ChannelInterpretation["Discrete"] = "discrete";
        ChannelInterpretation["Speakers"] = "speakers";
    })(ChannelInterpretation = WebAudio.ChannelInterpretation || (WebAudio.ChannelInterpretation = {}));
    /**
     * Enum of AudioParam::AutomationRate from the spec
     */
    let AutomationRate;
    (function (AutomationRate) {
        AutomationRate["ARate"] = "a-rate";
        AutomationRate["KRate"] = "k-rate";
    })(AutomationRate = WebAudio.AutomationRate || (WebAudio.AutomationRate = {}));
})(WebAudio || (WebAudio = {}));
/**
 * This domain allows configuring virtual authenticators to test the WebAuthn
 * API.
 */
export var WebAuthn;
(function (WebAuthn) {
    let AuthenticatorProtocol;
    (function (AuthenticatorProtocol) {
        AuthenticatorProtocol["U2f"] = "u2f";
        AuthenticatorProtocol["Ctap2"] = "ctap2";
    })(AuthenticatorProtocol = WebAuthn.AuthenticatorProtocol || (WebAuthn.AuthenticatorProtocol = {}));
    let Ctap2Version;
    (function (Ctap2Version) {
        Ctap2Version["Ctap2_0"] = "ctap2_0";
        Ctap2Version["Ctap2_1"] = "ctap2_1";
    })(Ctap2Version = WebAuthn.Ctap2Version || (WebAuthn.Ctap2Version = {}));
    let AuthenticatorTransport;
    (function (AuthenticatorTransport) {
        AuthenticatorTransport["Usb"] = "usb";
        AuthenticatorTransport["Nfc"] = "nfc";
        AuthenticatorTransport["Ble"] = "ble";
        AuthenticatorTransport["Cable"] = "cable";
        AuthenticatorTransport["Internal"] = "internal";
    })(AuthenticatorTransport = WebAuthn.AuthenticatorTransport || (WebAuthn.AuthenticatorTransport = {}));
})(WebAuthn || (WebAuthn = {}));
/**
 * This domain allows detailed inspection of media elements
 */
export var Media;
(function (Media) {
    let PlayerMessageLevel;
    (function (PlayerMessageLevel) {
        PlayerMessageLevel["Error"] = "error";
        PlayerMessageLevel["Warning"] = "warning";
        PlayerMessageLevel["Info"] = "info";
        PlayerMessageLevel["Debug"] = "debug";
    })(PlayerMessageLevel = Media.PlayerMessageLevel || (Media.PlayerMessageLevel = {}));
})(Media || (Media = {}));
export var Preload;
(function (Preload) {
    let RuleSetErrorType;
    (function (RuleSetErrorType) {
        RuleSetErrorType["SourceIsNotJsonObject"] = "SourceIsNotJsonObject";
        RuleSetErrorType["InvalidRulesSkipped"] = "InvalidRulesSkipped";
    })(RuleSetErrorType = Preload.RuleSetErrorType || (Preload.RuleSetErrorType = {}));
    /**
     * The type of preloading attempted. It corresponds to
     * mojom::SpeculationAction (although PrefetchWithSubresources is omitted as it
     * isn't being used by clients).
     */
    let SpeculationAction;
    (function (SpeculationAction) {
        SpeculationAction["Prefetch"] = "Prefetch";
        SpeculationAction["Prerender"] = "Prerender";
    })(SpeculationAction = Preload.SpeculationAction || (Preload.SpeculationAction = {}));
    /**
     * Corresponds to mojom::SpeculationTargetHint.
     * See https://github.com/WICG/nav-speculation/blob/main/triggers.md#window-name-targeting-hints
     */
    let SpeculationTargetHint;
    (function (SpeculationTargetHint) {
        SpeculationTargetHint["Blank"] = "Blank";
        SpeculationTargetHint["Self"] = "Self";
    })(SpeculationTargetHint = Preload.SpeculationTargetHint || (Preload.SpeculationTargetHint = {}));
    /**
     * List of FinalStatus reasons for Prerender2.
     */
    let PrerenderFinalStatus;
    (function (PrerenderFinalStatus) {
        PrerenderFinalStatus["Activated"] = "Activated";
        PrerenderFinalStatus["Destroyed"] = "Destroyed";
        PrerenderFinalStatus["LowEndDevice"] = "LowEndDevice";
        PrerenderFinalStatus["InvalidSchemeRedirect"] = "InvalidSchemeRedirect";
        PrerenderFinalStatus["InvalidSchemeNavigation"] = "InvalidSchemeNavigation";
        PrerenderFinalStatus["NavigationRequestBlockedByCsp"] = "NavigationRequestBlockedByCsp";
        PrerenderFinalStatus["MojoBinderPolicy"] = "MojoBinderPolicy";
        PrerenderFinalStatus["RendererProcessCrashed"] = "RendererProcessCrashed";
        PrerenderFinalStatus["RendererProcessKilled"] = "RendererProcessKilled";
        PrerenderFinalStatus["Download"] = "Download";
        PrerenderFinalStatus["TriggerDestroyed"] = "TriggerDestroyed";
        PrerenderFinalStatus["NavigationNotCommitted"] = "NavigationNotCommitted";
        PrerenderFinalStatus["NavigationBadHttpStatus"] = "NavigationBadHttpStatus";
        PrerenderFinalStatus["ClientCertRequested"] = "ClientCertRequested";
        PrerenderFinalStatus["NavigationRequestNetworkError"] = "NavigationRequestNetworkError";
        PrerenderFinalStatus["CancelAllHostsForTesting"] = "CancelAllHostsForTesting";
        PrerenderFinalStatus["DidFailLoad"] = "DidFailLoad";
        PrerenderFinalStatus["Stop"] = "Stop";
        PrerenderFinalStatus["SslCertificateError"] = "SslCertificateError";
        PrerenderFinalStatus["LoginAuthRequested"] = "LoginAuthRequested";
        PrerenderFinalStatus["UaChangeRequiresReload"] = "UaChangeRequiresReload";
        PrerenderFinalStatus["BlockedByClient"] = "BlockedByClient";
        PrerenderFinalStatus["AudioOutputDeviceRequested"] = "AudioOutputDeviceRequested";
        PrerenderFinalStatus["MixedContent"] = "MixedContent";
        PrerenderFinalStatus["TriggerBackgrounded"] = "TriggerBackgrounded";
        PrerenderFinalStatus["MemoryLimitExceeded"] = "MemoryLimitExceeded";
        PrerenderFinalStatus["DataSaverEnabled"] = "DataSaverEnabled";
        PrerenderFinalStatus["TriggerUrlHasEffectiveUrl"] = "TriggerUrlHasEffectiveUrl";
        PrerenderFinalStatus["ActivatedBeforeStarted"] = "ActivatedBeforeStarted";
        PrerenderFinalStatus["InactivePageRestriction"] = "InactivePageRestriction";
        PrerenderFinalStatus["StartFailed"] = "StartFailed";
        PrerenderFinalStatus["TimeoutBackgrounded"] = "TimeoutBackgrounded";
        PrerenderFinalStatus["CrossSiteRedirectInInitialNavigation"] = "CrossSiteRedirectInInitialNavigation";
        PrerenderFinalStatus["CrossSiteNavigationInInitialNavigation"] = "CrossSiteNavigationInInitialNavigation";
        PrerenderFinalStatus["SameSiteCrossOriginRedirectNotOptInInInitialNavigation"] = "SameSiteCrossOriginRedirectNotOptInInInitialNavigation";
        PrerenderFinalStatus["SameSiteCrossOriginNavigationNotOptInInInitialNavigation"] = "SameSiteCrossOriginNavigationNotOptInInInitialNavigation";
        PrerenderFinalStatus["ActivationNavigationParameterMismatch"] = "ActivationNavigationParameterMismatch";
        PrerenderFinalStatus["ActivatedInBackground"] = "ActivatedInBackground";
        PrerenderFinalStatus["EmbedderHostDisallowed"] = "EmbedderHostDisallowed";
        PrerenderFinalStatus["ActivationNavigationDestroyedBeforeSuccess"] = "ActivationNavigationDestroyedBeforeSuccess";
        PrerenderFinalStatus["TabClosedByUserGesture"] = "TabClosedByUserGesture";
        PrerenderFinalStatus["TabClosedWithoutUserGesture"] = "TabClosedWithoutUserGesture";
        PrerenderFinalStatus["PrimaryMainFrameRendererProcessCrashed"] = "PrimaryMainFrameRendererProcessCrashed";
        PrerenderFinalStatus["PrimaryMainFrameRendererProcessKilled"] = "PrimaryMainFrameRendererProcessKilled";
        PrerenderFinalStatus["ActivationFramePolicyNotCompatible"] = "ActivationFramePolicyNotCompatible";
        PrerenderFinalStatus["PreloadingDisabled"] = "PreloadingDisabled";
        PrerenderFinalStatus["BatterySaverEnabled"] = "BatterySaverEnabled";
        PrerenderFinalStatus["ActivatedDuringMainFrameNavigation"] = "ActivatedDuringMainFrameNavigation";
        PrerenderFinalStatus["PreloadingUnsupportedByWebContents"] = "PreloadingUnsupportedByWebContents";
        PrerenderFinalStatus["CrossSiteRedirectInMainFrameNavigation"] = "CrossSiteRedirectInMainFrameNavigation";
        PrerenderFinalStatus["CrossSiteNavigationInMainFrameNavigation"] = "CrossSiteNavigationInMainFrameNavigation";
        PrerenderFinalStatus["SameSiteCrossOriginRedirectNotOptInInMainFrameNavigation"] = "SameSiteCrossOriginRedirectNotOptInInMainFrameNavigation";
        PrerenderFinalStatus["SameSiteCrossOriginNavigationNotOptInInMainFrameNavigation"] = "SameSiteCrossOriginNavigationNotOptInInMainFrameNavigation";
        PrerenderFinalStatus["MemoryPressureOnTrigger"] = "MemoryPressureOnTrigger";
        PrerenderFinalStatus["MemoryPressureAfterTriggered"] = "MemoryPressureAfterTriggered";
        PrerenderFinalStatus["PrerenderingDisabledByDevTools"] = "PrerenderingDisabledByDevTools";
        PrerenderFinalStatus["SpeculationRuleRemoved"] = "SpeculationRuleRemoved";
        PrerenderFinalStatus["ActivatedWithAuxiliaryBrowsingContexts"] = "ActivatedWithAuxiliaryBrowsingContexts";
        PrerenderFinalStatus["MaxNumOfRunningEagerPrerendersExceeded"] = "MaxNumOfRunningEagerPrerendersExceeded";
        PrerenderFinalStatus["MaxNumOfRunningNonEagerPrerendersExceeded"] = "MaxNumOfRunningNonEagerPrerendersExceeded";
        PrerenderFinalStatus["MaxNumOfRunningEmbedderPrerendersExceeded"] = "MaxNumOfRunningEmbedderPrerendersExceeded";
        PrerenderFinalStatus["PrerenderingUrlHasEffectiveUrl"] = "PrerenderingUrlHasEffectiveUrl";
        PrerenderFinalStatus["RedirectedPrerenderingUrlHasEffectiveUrl"] = "RedirectedPrerenderingUrlHasEffectiveUrl";
        PrerenderFinalStatus["ActivationUrlHasEffectiveUrl"] = "ActivationUrlHasEffectiveUrl";
        PrerenderFinalStatus["JavaScriptInterfaceAdded"] = "JavaScriptInterfaceAdded";
        PrerenderFinalStatus["JavaScriptInterfaceRemoved"] = "JavaScriptInterfaceRemoved";
        PrerenderFinalStatus["AllPrerenderingCanceled"] = "AllPrerenderingCanceled";
        PrerenderFinalStatus["WindowClosed"] = "WindowClosed";
        PrerenderFinalStatus["SlowNetwork"] = "SlowNetwork";
        PrerenderFinalStatus["OtherPrerenderedPageActivated"] = "OtherPrerenderedPageActivated";
        PrerenderFinalStatus["V8OptimizerDisabled"] = "V8OptimizerDisabled";
        PrerenderFinalStatus["PrerenderFailedDuringPrefetch"] = "PrerenderFailedDuringPrefetch";
        PrerenderFinalStatus["BrowsingDataRemoved"] = "BrowsingDataRemoved";
    })(PrerenderFinalStatus = Preload.PrerenderFinalStatus || (Preload.PrerenderFinalStatus = {}));
    /**
     * Preloading status values, see also PreloadingTriggeringOutcome. This
     * status is shared by prefetchStatusUpdated and prerenderStatusUpdated.
     */
    let PreloadingStatus;
    (function (PreloadingStatus) {
        PreloadingStatus["Pending"] = "Pending";
        PreloadingStatus["Running"] = "Running";
        PreloadingStatus["Ready"] = "Ready";
        PreloadingStatus["Success"] = "Success";
        PreloadingStatus["Failure"] = "Failure";
        PreloadingStatus["NotSupported"] = "NotSupported";
    })(PreloadingStatus = Preload.PreloadingStatus || (Preload.PreloadingStatus = {}));
    /**
     * TODO(https://crbug.com/1384419): revisit the list of PrefetchStatus and
     * filter out the ones that aren't necessary to the developers.
     */
    let PrefetchStatus;
    (function (PrefetchStatus) {
        PrefetchStatus["PrefetchAllowed"] = "PrefetchAllowed";
        PrefetchStatus["PrefetchFailedIneligibleRedirect"] = "PrefetchFailedIneligibleRedirect";
        PrefetchStatus["PrefetchFailedInvalidRedirect"] = "PrefetchFailedInvalidRedirect";
        PrefetchStatus["PrefetchFailedMIMENotSupported"] = "PrefetchFailedMIMENotSupported";
        PrefetchStatus["PrefetchFailedNetError"] = "PrefetchFailedNetError";
        PrefetchStatus["PrefetchFailedNon2XX"] = "PrefetchFailedNon2XX";
        PrefetchStatus["PrefetchEvictedAfterBrowsingDataRemoved"] = "PrefetchEvictedAfterBrowsingDataRemoved";
        PrefetchStatus["PrefetchEvictedAfterCandidateRemoved"] = "PrefetchEvictedAfterCandidateRemoved";
        PrefetchStatus["PrefetchEvictedForNewerPrefetch"] = "PrefetchEvictedForNewerPrefetch";
        PrefetchStatus["PrefetchHeldback"] = "PrefetchHeldback";
        PrefetchStatus["PrefetchIneligibleRetryAfter"] = "PrefetchIneligibleRetryAfter";
        PrefetchStatus["PrefetchIsPrivacyDecoy"] = "PrefetchIsPrivacyDecoy";
        PrefetchStatus["PrefetchIsStale"] = "PrefetchIsStale";
        PrefetchStatus["PrefetchNotEligibleBrowserContextOffTheRecord"] = "PrefetchNotEligibleBrowserContextOffTheRecord";
        PrefetchStatus["PrefetchNotEligibleDataSaverEnabled"] = "PrefetchNotEligibleDataSaverEnabled";
        PrefetchStatus["PrefetchNotEligibleExistingProxy"] = "PrefetchNotEligibleExistingProxy";
        PrefetchStatus["PrefetchNotEligibleHostIsNonUnique"] = "PrefetchNotEligibleHostIsNonUnique";
        PrefetchStatus["PrefetchNotEligibleNonDefaultStoragePartition"] = "PrefetchNotEligibleNonDefaultStoragePartition";
        PrefetchStatus["PrefetchNotEligibleSameSiteCrossOriginPrefetchRequiredProxy"] = "PrefetchNotEligibleSameSiteCrossOriginPrefetchRequiredProxy";
        PrefetchStatus["PrefetchNotEligibleSchemeIsNotHttps"] = "PrefetchNotEligibleSchemeIsNotHttps";
        PrefetchStatus["PrefetchNotEligibleUserHasCookies"] = "PrefetchNotEligibleUserHasCookies";
        PrefetchStatus["PrefetchNotEligibleUserHasServiceWorker"] = "PrefetchNotEligibleUserHasServiceWorker";
        PrefetchStatus["PrefetchNotEligibleUserHasServiceWorkerNoFetchHandler"] = "PrefetchNotEligibleUserHasServiceWorkerNoFetchHandler";
        PrefetchStatus["PrefetchNotEligibleRedirectFromServiceWorker"] = "PrefetchNotEligibleRedirectFromServiceWorker";
        PrefetchStatus["PrefetchNotEligibleRedirectToServiceWorker"] = "PrefetchNotEligibleRedirectToServiceWorker";
        PrefetchStatus["PrefetchNotEligibleBatterySaverEnabled"] = "PrefetchNotEligibleBatterySaverEnabled";
        PrefetchStatus["PrefetchNotEligiblePreloadingDisabled"] = "PrefetchNotEligiblePreloadingDisabled";
        PrefetchStatus["PrefetchNotFinishedInTime"] = "PrefetchNotFinishedInTime";
        PrefetchStatus["PrefetchNotStarted"] = "PrefetchNotStarted";
        PrefetchStatus["PrefetchNotUsedCookiesChanged"] = "PrefetchNotUsedCookiesChanged";
        PrefetchStatus["PrefetchProxyNotAvailable"] = "PrefetchProxyNotAvailable";
        PrefetchStatus["PrefetchResponseUsed"] = "PrefetchResponseUsed";
        PrefetchStatus["PrefetchSuccessfulButNotUsed"] = "PrefetchSuccessfulButNotUsed";
        PrefetchStatus["PrefetchNotUsedProbeFailed"] = "PrefetchNotUsedProbeFailed";
    })(PrefetchStatus = Preload.PrefetchStatus || (Preload.PrefetchStatus = {}));
})(Preload || (Preload = {}));
/**
 * This domain allows interacting with the FedCM dialog.
 */
export var FedCm;
(function (FedCm) {
    /**
     * Whether this is a sign-up or sign-in action for this account, i.e.
     * whether this account has ever been used to sign in to this RP before.
     */
    let LoginState;
    (function (LoginState) {
        LoginState["SignIn"] = "SignIn";
        LoginState["SignUp"] = "SignUp";
    })(LoginState = FedCm.LoginState || (FedCm.LoginState = {}));
    /**
     * The types of FedCM dialogs.
     */
    let DialogType;
    (function (DialogType) {
        DialogType["AccountChooser"] = "AccountChooser";
        DialogType["AutoReauthn"] = "AutoReauthn";
        DialogType["ConfirmIdpLogin"] = "ConfirmIdpLogin";
        DialogType["Error"] = "Error";
    })(DialogType = FedCm.DialogType || (FedCm.DialogType = {}));
    /**
     * The buttons on the FedCM dialog.
     */
    let DialogButton;
    (function (DialogButton) {
        DialogButton["ConfirmIdpLoginContinue"] = "ConfirmIdpLoginContinue";
        DialogButton["ErrorGotIt"] = "ErrorGotIt";
        DialogButton["ErrorMoreDetails"] = "ErrorMoreDetails";
    })(DialogButton = FedCm.DialogButton || (FedCm.DialogButton = {}));
    /**
     * The URLs that each account has
     */
    let AccountUrlType;
    (function (AccountUrlType) {
        AccountUrlType["TermsOfService"] = "TermsOfService";
        AccountUrlType["PrivacyPolicy"] = "PrivacyPolicy";
    })(AccountUrlType = FedCm.AccountUrlType || (FedCm.AccountUrlType = {}));
})(FedCm || (FedCm = {}));
/**
 * This domain allows interacting with the browser to control PWAs.
 */
export var PWA;
(function (PWA) {
    /**
     * If user prefers opening the app in browser or an app window.
     */
    let DisplayMode;
    (function (DisplayMode) {
        DisplayMode["Standalone"] = "standalone";
        DisplayMode["Browser"] = "browser";
    })(DisplayMode = PWA.DisplayMode || (PWA.DisplayMode = {}));
})(PWA || (PWA = {}));
/**
 * This domain allows configuring virtual Bluetooth devices to test
 * the web-bluetooth API.
 */
export var BluetoothEmulation;
(function (BluetoothEmulation) {
    /**
     * Indicates the various states of Central.
     */
    let CentralState;
    (function (CentralState) {
        CentralState["Absent"] = "absent";
        CentralState["PoweredOff"] = "powered-off";
        CentralState["PoweredOn"] = "powered-on";
    })(CentralState = BluetoothEmulation.CentralState || (BluetoothEmulation.CentralState = {}));
    /**
     * Indicates the various types of GATT event.
     */
    let GATTOperationType;
    (function (GATTOperationType) {
        GATTOperationType["Connection"] = "connection";
        GATTOperationType["Discovery"] = "discovery";
    })(GATTOperationType = BluetoothEmulation.GATTOperationType || (BluetoothEmulation.GATTOperationType = {}));
    /**
     * Indicates the various types of characteristic write.
     */
    let CharacteristicWriteType;
    (function (CharacteristicWriteType) {
        CharacteristicWriteType["WriteDefaultDeprecated"] = "write-default-deprecated";
        CharacteristicWriteType["WriteWithResponse"] = "write-with-response";
        CharacteristicWriteType["WriteWithoutResponse"] = "write-without-response";
    })(CharacteristicWriteType = BluetoothEmulation.CharacteristicWriteType || (BluetoothEmulation.CharacteristicWriteType = {}));
    /**
     * Indicates the various types of characteristic operation.
     */
    let CharacteristicOperationType;
    (function (CharacteristicOperationType) {
        CharacteristicOperationType["Read"] = "read";
        CharacteristicOperationType["Write"] = "write";
        CharacteristicOperationType["SubscribeToNotifications"] = "subscribe-to-notifications";
        CharacteristicOperationType["UnsubscribeFromNotifications"] = "unsubscribe-from-notifications";
    })(CharacteristicOperationType = BluetoothEmulation.CharacteristicOperationType || (BluetoothEmulation.CharacteristicOperationType = {}));
    /**
     * Indicates the various types of descriptor operation.
     */
    let DescriptorOperationType;
    (function (DescriptorOperationType) {
        DescriptorOperationType["Read"] = "read";
        DescriptorOperationType["Write"] = "write";
    })(DescriptorOperationType = BluetoothEmulation.DescriptorOperationType || (BluetoothEmulation.DescriptorOperationType = {}));
})(BluetoothEmulation || (BluetoothEmulation = {}));
/**
 * Debugger domain exposes JavaScript debugging capabilities. It allows setting and removing
 * breakpoints, stepping through execution, exploring stack traces, etc.
 */
export var Debugger;
(function (Debugger) {
    let ScopeType;
    (function (ScopeType) {
        ScopeType["Global"] = "global";
        ScopeType["Local"] = "local";
        ScopeType["With"] = "with";
        ScopeType["Closure"] = "closure";
        ScopeType["Catch"] = "catch";
        ScopeType["Block"] = "block";
        ScopeType["Script"] = "script";
        ScopeType["Eval"] = "eval";
        ScopeType["Module"] = "module";
        ScopeType["WasmExpressionStack"] = "wasm-expression-stack";
    })(ScopeType = Debugger.ScopeType || (Debugger.ScopeType = {}));
    let BreakLocationType;
    (function (BreakLocationType) {
        BreakLocationType["DebuggerStatement"] = "debuggerStatement";
        BreakLocationType["Call"] = "call";
        BreakLocationType["Return"] = "return";
    })(BreakLocationType = Debugger.BreakLocationType || (Debugger.BreakLocationType = {}));
    /**
     * Enum of possible script languages.
     */
    let ScriptLanguage;
    (function (ScriptLanguage) {
        ScriptLanguage["JavaScript"] = "JavaScript";
        ScriptLanguage["WebAssembly"] = "WebAssembly";
    })(ScriptLanguage = Debugger.ScriptLanguage || (Debugger.ScriptLanguage = {}));
    let DebugSymbolsType;
    (function (DebugSymbolsType) {
        DebugSymbolsType["SourceMap"] = "SourceMap";
        DebugSymbolsType["EmbeddedDWARF"] = "EmbeddedDWARF";
        DebugSymbolsType["ExternalDWARF"] = "ExternalDWARF";
    })(DebugSymbolsType = Debugger.DebugSymbolsType || (Debugger.DebugSymbolsType = {}));
    let ContinueToLocationRequestTargetCallFrames;
    (function (ContinueToLocationRequestTargetCallFrames) {
        ContinueToLocationRequestTargetCallFrames["Any"] = "any";
        ContinueToLocationRequestTargetCallFrames["Current"] = "current";
    })(ContinueToLocationRequestTargetCallFrames = Debugger.ContinueToLocationRequestTargetCallFrames || (Debugger.ContinueToLocationRequestTargetCallFrames = {}));
    let RestartFrameRequestMode;
    (function (RestartFrameRequestMode) {
        RestartFrameRequestMode["StepInto"] = "StepInto";
    })(RestartFrameRequestMode = Debugger.RestartFrameRequestMode || (Debugger.RestartFrameRequestMode = {}));
    let SetInstrumentationBreakpointRequestInstrumentation;
    (function (SetInstrumentationBreakpointRequestInstrumentation) {
        SetInstrumentationBreakpointRequestInstrumentation["BeforeScriptExecution"] = "beforeScriptExecution";
        SetInstrumentationBreakpointRequestInstrumentation["BeforeScriptWithSourceMapExecution"] = "beforeScriptWithSourceMapExecution";
    })(SetInstrumentationBreakpointRequestInstrumentation = Debugger.SetInstrumentationBreakpointRequestInstrumentation || (Debugger.SetInstrumentationBreakpointRequestInstrumentation = {}));
    let SetPauseOnExceptionsRequestState;
    (function (SetPauseOnExceptionsRequestState) {
        SetPauseOnExceptionsRequestState["None"] = "none";
        SetPauseOnExceptionsRequestState["Caught"] = "caught";
        SetPauseOnExceptionsRequestState["Uncaught"] = "uncaught";
        SetPauseOnExceptionsRequestState["All"] = "all";
    })(SetPauseOnExceptionsRequestState = Debugger.SetPauseOnExceptionsRequestState || (Debugger.SetPauseOnExceptionsRequestState = {}));
    let SetScriptSourceResponseStatus;
    (function (SetScriptSourceResponseStatus) {
        SetScriptSourceResponseStatus["Ok"] = "Ok";
        SetScriptSourceResponseStatus["CompileError"] = "CompileError";
        SetScriptSourceResponseStatus["BlockedByActiveGenerator"] = "BlockedByActiveGenerator";
        SetScriptSourceResponseStatus["BlockedByActiveFunction"] = "BlockedByActiveFunction";
        SetScriptSourceResponseStatus["BlockedByTopLevelEsModuleChange"] = "BlockedByTopLevelEsModuleChange";
    })(SetScriptSourceResponseStatus = Debugger.SetScriptSourceResponseStatus || (Debugger.SetScriptSourceResponseStatus = {}));
    let PausedEventReason;
    (function (PausedEventReason) {
        PausedEventReason["Ambiguous"] = "ambiguous";
        PausedEventReason["Assert"] = "assert";
        PausedEventReason["CSPViolation"] = "CSPViolation";
        PausedEventReason["DebugCommand"] = "debugCommand";
        PausedEventReason["DOM"] = "DOM";
        PausedEventReason["EventListener"] = "EventListener";
        PausedEventReason["Exception"] = "exception";
        PausedEventReason["Instrumentation"] = "instrumentation";
        PausedEventReason["OOM"] = "OOM";
        PausedEventReason["Other"] = "other";
        PausedEventReason["PromiseRejection"] = "promiseRejection";
        PausedEventReason["XHR"] = "XHR";
        PausedEventReason["Step"] = "step";
    })(PausedEventReason = Debugger.PausedEventReason || (Debugger.PausedEventReason = {}));
})(Debugger || (Debugger = {}));
/**
 * Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects.
 * Evaluation results are returned as mirror object that expose object type, string representation
 * and unique identifier that can be used for further object reference. Original objects are
 * maintained in memory unless they are either explicitly released or are released along with the
 * other objects in their object group.
 */
export var Runtime;
(function (Runtime) {
    let SerializationOptionsSerialization;
    (function (SerializationOptionsSerialization) {
        SerializationOptionsSerialization["Deep"] = "deep";
        SerializationOptionsSerialization["Json"] = "json";
        SerializationOptionsSerialization["IdOnly"] = "idOnly";
    })(SerializationOptionsSerialization = Runtime.SerializationOptionsSerialization || (Runtime.SerializationOptionsSerialization = {}));
    let DeepSerializedValueType;
    (function (DeepSerializedValueType) {
        DeepSerializedValueType["Undefined"] = "undefined";
        DeepSerializedValueType["Null"] = "null";
        DeepSerializedValueType["String"] = "string";
        DeepSerializedValueType["Number"] = "number";
        DeepSerializedValueType["Boolean"] = "boolean";
        DeepSerializedValueType["Bigint"] = "bigint";
        DeepSerializedValueType["Regexp"] = "regexp";
        DeepSerializedValueType["Date"] = "date";
        DeepSerializedValueType["Symbol"] = "symbol";
        DeepSerializedValueType["Array"] = "array";
        DeepSerializedValueType["Object"] = "object";
        DeepSerializedValueType["Function"] = "function";
        DeepSerializedValueType["Map"] = "map";
        DeepSerializedValueType["Set"] = "set";
        DeepSerializedValueType["Weakmap"] = "weakmap";
        DeepSerializedValueType["Weakset"] = "weakset";
        DeepSerializedValueType["Error"] = "error";
        DeepSerializedValueType["Proxy"] = "proxy";
        DeepSerializedValueType["Promise"] = "promise";
        DeepSerializedValueType["Typedarray"] = "typedarray";
        DeepSerializedValueType["Arraybuffer"] = "arraybuffer";
        DeepSerializedValueType["Node"] = "node";
        DeepSerializedValueType["Window"] = "window";
        DeepSerializedValueType["Generator"] = "generator";
    })(DeepSerializedValueType = Runtime.DeepSerializedValueType || (Runtime.DeepSerializedValueType = {}));
    let RemoteObjectType;
    (function (RemoteObjectType) {
        RemoteObjectType["Object"] = "object";
        RemoteObjectType["Function"] = "function";
        RemoteObjectType["Undefined"] = "undefined";
        RemoteObjectType["String"] = "string";
        RemoteObjectType["Number"] = "number";
        RemoteObjectType["Boolean"] = "boolean";
        RemoteObjectType["Symbol"] = "symbol";
        RemoteObjectType["Bigint"] = "bigint";
    })(RemoteObjectType = Runtime.RemoteObjectType || (Runtime.RemoteObjectType = {}));
    let RemoteObjectSubtype;
    (function (RemoteObjectSubtype) {
        RemoteObjectSubtype["Array"] = "array";
        RemoteObjectSubtype["Null"] = "null";
        RemoteObjectSubtype["Node"] = "node";
        RemoteObjectSubtype["Regexp"] = "regexp";
        RemoteObjectSubtype["Date"] = "date";
        RemoteObjectSubtype["Map"] = "map";
        RemoteObjectSubtype["Set"] = "set";
        RemoteObjectSubtype["Weakmap"] = "weakmap";
        RemoteObjectSubtype["Weakset"] = "weakset";
        RemoteObjectSubtype["Iterator"] = "iterator";
        RemoteObjectSubtype["Generator"] = "generator";
        RemoteObjectSubtype["Error"] = "error";
        RemoteObjectSubtype["Proxy"] = "proxy";
        RemoteObjectSubtype["Promise"] = "promise";
        RemoteObjectSubtype["Typedarray"] = "typedarray";
        RemoteObjectSubtype["Arraybuffer"] = "arraybuffer";
        RemoteObjectSubtype["Dataview"] = "dataview";
        RemoteObjectSubtype["Webassemblymemory"] = "webassemblymemory";
        RemoteObjectSubtype["Wasmvalue"] = "wasmvalue";
    })(RemoteObjectSubtype = Runtime.RemoteObjectSubtype || (Runtime.RemoteObjectSubtype = {}));
    let ObjectPreviewType;
    (function (ObjectPreviewType) {
        ObjectPreviewType["Object"] = "object";
        ObjectPreviewType["Function"] = "function";
        ObjectPreviewType["Undefined"] = "undefined";
        ObjectPreviewType["String"] = "string";
        ObjectPreviewType["Number"] = "number";
        ObjectPreviewType["Boolean"] = "boolean";
        ObjectPreviewType["Symbol"] = "symbol";
        ObjectPreviewType["Bigint"] = "bigint";
    })(ObjectPreviewType = Runtime.ObjectPreviewType || (Runtime.ObjectPreviewType = {}));
    let ObjectPreviewSubtype;
    (function (ObjectPreviewSubtype) {
        ObjectPreviewSubtype["Array"] = "array";
        ObjectPreviewSubtype["Null"] = "null";
        ObjectPreviewSubtype["Node"] = "node";
        ObjectPreviewSubtype["Regexp"] = "regexp";
        ObjectPreviewSubtype["Date"] = "date";
        ObjectPreviewSubtype["Map"] = "map";
        ObjectPreviewSubtype["Set"] = "set";
        ObjectPreviewSubtype["Weakmap"] = "weakmap";
        ObjectPreviewSubtype["Weakset"] = "weakset";
        ObjectPreviewSubtype["Iterator"] = "iterator";
        ObjectPreviewSubtype["Generator"] = "generator";
        ObjectPreviewSubtype["Error"] = "error";
        ObjectPreviewSubtype["Proxy"] = "proxy";
        ObjectPreviewSubtype["Promise"] = "promise";
        ObjectPreviewSubtype["Typedarray"] = "typedarray";
        ObjectPreviewSubtype["Arraybuffer"] = "arraybuffer";
        ObjectPreviewSubtype["Dataview"] = "dataview";
        ObjectPreviewSubtype["Webassemblymemory"] = "webassemblymemory";
        ObjectPreviewSubtype["Wasmvalue"] = "wasmvalue";
    })(ObjectPreviewSubtype = Runtime.ObjectPreviewSubtype || (Runtime.ObjectPreviewSubtype = {}));
    let PropertyPreviewType;
    (function (PropertyPreviewType) {
        PropertyPreviewType["Object"] = "object";
        PropertyPreviewType["Function"] = "function";
        PropertyPreviewType["Undefined"] = "undefined";
        PropertyPreviewType["String"] = "string";
        PropertyPreviewType["Number"] = "number";
        PropertyPreviewType["Boolean"] = "boolean";
        PropertyPreviewType["Symbol"] = "symbol";
        PropertyPreviewType["Accessor"] = "accessor";
        PropertyPreviewType["Bigint"] = "bigint";
    })(PropertyPreviewType = Runtime.PropertyPreviewType || (Runtime.PropertyPreviewType = {}));
    let PropertyPreviewSubtype;
    (function (PropertyPreviewSubtype) {
        PropertyPreviewSubtype["Array"] = "array";
        PropertyPreviewSubtype["Null"] = "null";
        PropertyPreviewSubtype["Node"] = "node";
        PropertyPreviewSubtype["Regexp"] = "regexp";
        PropertyPreviewSubtype["Date"] = "date";
        PropertyPreviewSubtype["Map"] = "map";
        PropertyPreviewSubtype["Set"] = "set";
        PropertyPreviewSubtype["Weakmap"] = "weakmap";
        PropertyPreviewSubtype["Weakset"] = "weakset";
        PropertyPreviewSubtype["Iterator"] = "iterator";
        PropertyPreviewSubtype["Generator"] = "generator";
        PropertyPreviewSubtype["Error"] = "error";
        PropertyPreviewSubtype["Proxy"] = "proxy";
        PropertyPreviewSubtype["Promise"] = "promise";
        PropertyPreviewSubtype["Typedarray"] = "typedarray";
        PropertyPreviewSubtype["Arraybuffer"] = "arraybuffer";
        PropertyPreviewSubtype["Dataview"] = "dataview";
        PropertyPreviewSubtype["Webassemblymemory"] = "webassemblymemory";
        PropertyPreviewSubtype["Wasmvalue"] = "wasmvalue";
    })(PropertyPreviewSubtype = Runtime.PropertyPreviewSubtype || (Runtime.PropertyPreviewSubtype = {}));
    let ConsoleAPICalledEventType;
    (function (ConsoleAPICalledEventType) {
        ConsoleAPICalledEventType["Log"] = "log";
        ConsoleAPICalledEventType["Debug"] = "debug";
        ConsoleAPICalledEventType["Info"] = "info";
        ConsoleAPICalledEventType["Error"] = "error";
        ConsoleAPICalledEventType["Warning"] = "warning";
        ConsoleAPICalledEventType["Dir"] = "dir";
        ConsoleAPICalledEventType["DirXML"] = "dirxml";
        ConsoleAPICalledEventType["Table"] = "table";
        ConsoleAPICalledEventType["Trace"] = "trace";
        ConsoleAPICalledEventType["Clear"] = "clear";
        ConsoleAPICalledEventType["StartGroup"] = "startGroup";
        ConsoleAPICalledEventType["StartGroupCollapsed"] = "startGroupCollapsed";
        ConsoleAPICalledEventType["EndGroup"] = "endGroup";
        ConsoleAPICalledEventType["Assert"] = "assert";
        ConsoleAPICalledEventType["Profile"] = "profile";
        ConsoleAPICalledEventType["ProfileEnd"] = "profileEnd";
        ConsoleAPICalledEventType["Count"] = "count";
        ConsoleAPICalledEventType["TimeEnd"] = "timeEnd";
    })(ConsoleAPICalledEventType = Runtime.ConsoleAPICalledEventType || (Runtime.ConsoleAPICalledEventType = {}));
})(Runtime || (Runtime = {}));
//# sourceMappingURL=protocol.js.map