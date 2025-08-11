// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export var FilterType;
(function (FilterType) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    FilterType["Domain"] = "domain";
    FilterType["HasResponseHeader"] = "has-response-header";
    FilterType["HasRequestHeader"] = "has-request-header";
    FilterType["HasOverrides"] = "has-overrides";
    FilterType["ResponseHeaderValueSetCookie"] = "response-header-set-cookie";
    FilterType["Is"] = "is";
    FilterType["LargerThan"] = "larger-than";
    FilterType["Method"] = "method";
    FilterType["MimeType"] = "mime-type";
    FilterType["MixedContent"] = "mixed-content";
    FilterType["Priority"] = "priority";
    FilterType["Scheme"] = "scheme";
    FilterType["SetCookieDomain"] = "set-cookie-domain";
    FilterType["SetCookieName"] = "set-cookie-name";
    FilterType["SetCookieValue"] = "set-cookie-value";
    FilterType["ResourceType"] = "resource-type";
    FilterType["CookieDomain"] = "cookie-domain";
    FilterType["CookieName"] = "cookie-name";
    FilterType["CookiePath"] = "cookie-path";
    FilterType["CookieValue"] = "cookie-value";
    FilterType["StatusCode"] = "status-code";
    FilterType["Url"] = "url";
    /* eslint-enable @typescript-eslint/naming-convention */
})(FilterType || (FilterType = {}));
export var IsFilterType;
(function (IsFilterType) {
    IsFilterType["RUNNING"] = "running";
    IsFilterType["FROM_CACHE"] = "from-cache";
    IsFilterType["SERVICE_WORKER_INTERCEPTED"] = "service-worker-intercepted";
    IsFilterType["SERVICE_WORKER_INITIATED"] = "service-worker-initiated";
})(IsFilterType || (IsFilterType = {}));
export var MixedContentFilterValues;
(function (MixedContentFilterValues) {
    MixedContentFilterValues["ALL"] = "all";
    MixedContentFilterValues["DISPLAYED"] = "displayed";
    MixedContentFilterValues["BLOCKED"] = "blocked";
    MixedContentFilterValues["BLOCK_OVERRIDDEN"] = "block-overridden";
})(MixedContentFilterValues || (MixedContentFilterValues = {}));
export class UIRequestFilter {
    constructor(filters) {
        this.filters = filters;
    }
    static filters(filters) {
        return new UIRequestFilter(filters);
    }
}
//# sourceMappingURL=UIFilter.js.map