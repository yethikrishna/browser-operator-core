// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _CrUXManager_instances, _CrUXManager_originCache, _CrUXManager_urlCache, _CrUXManager_mainDocumentUrl, _CrUXManager_configSetting, _CrUXManager_endpoint, _CrUXManager_pageResult, _CrUXManager_getMappedUrl, _CrUXManager_getFieldDataForCurrentPage, _CrUXManager_getInspectedURL, _CrUXManager_onFrameNavigated, _CrUXManager_normalizeUrl, _CrUXManager_getScopedData, _CrUXManager_makeRequest, _CrUXManager_getAutoDeviceScope;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Root from '../../core/root/root.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as EmulationModel from '../../models/emulation/emulation.js';
const UIStrings = {
    /**
     * @description Warning message indicating that the user will see real user data for a URL which is different from the URL they are currently looking at.
     */
    fieldOverrideWarning: 'Field metrics are configured for a different URL than the current page.',
};
const str_ = i18n.i18n.registerUIStrings('models/crux-manager/CrUXManager.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
// This key is expected to be visible in the frontend.
// b/349721878
const CRUX_API_KEY = 'AIzaSyCCSOx25vrb5z0tbedCB3_JRzzbVW6Uwgw';
const DEFAULT_ENDPOINT = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${CRUX_API_KEY}`;
let cruxManagerInstance;
// TODO: Potentially support `TABLET`. Tablet field data will always be `null` until then.
export const DEVICE_SCOPE_LIST = ['ALL', 'DESKTOP', 'PHONE'];
const pageScopeList = ['origin', 'url'];
const metrics = [
    'first_contentful_paint',
    'largest_contentful_paint',
    'cumulative_layout_shift',
    'interaction_to_next_paint',
    'round_trip_time',
    'form_factors',
    'largest_contentful_paint_image_time_to_first_byte',
    'largest_contentful_paint_image_resource_load_delay',
    'largest_contentful_paint_image_resource_load_duration',
    'largest_contentful_paint_image_element_render_delay',
];
export class CrUXManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _CrUXManager_instances.add(this);
        _CrUXManager_originCache.set(this, new Map());
        _CrUXManager_urlCache.set(this, new Map());
        _CrUXManager_mainDocumentUrl.set(this, void 0);
        _CrUXManager_configSetting.set(this, void 0);
        _CrUXManager_endpoint.set(this, DEFAULT_ENDPOINT);
        _CrUXManager_pageResult.set(this, void 0);
        this.fieldDeviceOption = 'AUTO';
        this.fieldPageScope = 'url';
        /**
         * In an incognito or guest window - which is called an "OffTheRecord"
         * profile in Chromium -, we do not want to persist the user consent and
         * should ask for it every time. This is why we see what window type the
         * user is in before choosing where to look/create this setting. If the
         * user is in OTR, we store it in the session, which uses sessionStorage
         * and is short-lived. If the user is not in OTR, we use global, which is
         * the default behaviour and persists the value to the Chrome profile.
         * This behaviour has been approved by Chrome Privacy as part of the launch
         * review.
         */
        const useSessionStorage = Root.Runtime.hostConfig.isOffTheRecord === true;
        const storageTypeForConsent = useSessionStorage ? "Session" /* Common.Settings.SettingStorageType.SESSION */ : "Global" /* Common.Settings.SettingStorageType.GLOBAL */;
        __classPrivateFieldSet(this, _CrUXManager_configSetting, Common.Settings.Settings.instance().createSetting('field-data', { enabled: false, override: '', originMappings: [], overrideEnabled: false }, storageTypeForConsent), "f");
        __classPrivateFieldGet(this, _CrUXManager_configSetting, "f").addChangeListener(() => {
            void this.refresh();
        });
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.ResourceTreeModel.ResourceTreeModel, SDK.ResourceTreeModel.Events.FrameNavigated, __classPrivateFieldGet(this, _CrUXManager_instances, "m", _CrUXManager_onFrameNavigated), this);
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!cruxManagerInstance || forceNew) {
            cruxManagerInstance = new CrUXManager();
        }
        return cruxManagerInstance;
    }
    /** The most recent page result from the CrUX service. */
    get pageResult() {
        return __classPrivateFieldGet(this, _CrUXManager_pageResult, "f");
    }
    getConfigSetting() {
        return __classPrivateFieldGet(this, _CrUXManager_configSetting, "f");
    }
    isEnabled() {
        return __classPrivateFieldGet(this, _CrUXManager_configSetting, "f").get().enabled;
    }
    async getFieldDataForPage(pageUrl) {
        const pageResult = {
            'origin-ALL': null,
            'origin-DESKTOP': null,
            'origin-PHONE': null,
            'origin-TABLET': null,
            'url-ALL': null,
            'url-DESKTOP': null,
            'url-PHONE': null,
            'url-TABLET': null,
            warnings: [],
        };
        try {
            const normalizedUrl = __classPrivateFieldGet(this, _CrUXManager_instances, "m", _CrUXManager_normalizeUrl).call(this, pageUrl);
            const promises = [];
            for (const pageScope of pageScopeList) {
                for (const deviceScope of DEVICE_SCOPE_LIST) {
                    const promise = __classPrivateFieldGet(this, _CrUXManager_instances, "m", _CrUXManager_getScopedData).call(this, normalizedUrl, pageScope, deviceScope).then(response => {
                        pageResult[`${pageScope}-${deviceScope}`] = response;
                    });
                    promises.push(promise);
                }
            }
            await Promise.all(promises);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            return pageResult;
        }
    }
    async getFieldDataForCurrentPageForTesting() {
        return await __classPrivateFieldGet(this, _CrUXManager_instances, "m", _CrUXManager_getFieldDataForCurrentPage).call(this);
    }
    async refresh() {
        // This does 2 things:
        // - Tells listeners to clear old data so it isn't shown during a URL transition
        // - Tells listeners to clear old data when field data is disabled.
        __classPrivateFieldSet(this, _CrUXManager_pageResult, undefined, "f");
        this.dispatchEventToListeners("field-data-changed" /* Events.FIELD_DATA_CHANGED */, undefined);
        if (!__classPrivateFieldGet(this, _CrUXManager_configSetting, "f").get().enabled) {
            return;
        }
        __classPrivateFieldSet(this, _CrUXManager_pageResult, await __classPrivateFieldGet(this, _CrUXManager_instances, "m", _CrUXManager_getFieldDataForCurrentPage).call(this), "f");
        this.dispatchEventToListeners("field-data-changed" /* Events.FIELD_DATA_CHANGED */, __classPrivateFieldGet(this, _CrUXManager_pageResult, "f"));
    }
    resolveDeviceOptionToScope(option) {
        return option === 'AUTO' ? __classPrivateFieldGet(this, _CrUXManager_instances, "m", _CrUXManager_getAutoDeviceScope).call(this) : option;
    }
    getSelectedDeviceScope() {
        return this.resolveDeviceOptionToScope(this.fieldDeviceOption);
    }
    getSelectedScope() {
        return { pageScope: this.fieldPageScope, deviceScope: this.getSelectedDeviceScope() };
    }
    getSelectedFieldResponse() {
        const pageScope = this.fieldPageScope;
        const deviceScope = this.getSelectedDeviceScope();
        return this.getFieldResponse(pageScope, deviceScope);
    }
    getSelectedFieldMetricData(fieldMetric) {
        return this.getSelectedFieldResponse()?.record.metrics[fieldMetric];
    }
    getFieldResponse(pageScope, deviceScope) {
        return __classPrivateFieldGet(this, _CrUXManager_pageResult, "f")?.[`${pageScope}-${deviceScope}`];
    }
    setEndpointForTesting(endpoint) {
        __classPrivateFieldSet(this, _CrUXManager_endpoint, endpoint, "f");
    }
}
_CrUXManager_originCache = new WeakMap(), _CrUXManager_urlCache = new WeakMap(), _CrUXManager_mainDocumentUrl = new WeakMap(), _CrUXManager_configSetting = new WeakMap(), _CrUXManager_endpoint = new WeakMap(), _CrUXManager_pageResult = new WeakMap(), _CrUXManager_instances = new WeakSet(), _CrUXManager_getMappedUrl = function _CrUXManager_getMappedUrl(unmappedUrl) {
    try {
        const unmapped = new URL(unmappedUrl);
        const mappings = __classPrivateFieldGet(this, _CrUXManager_configSetting, "f").get().originMappings || [];
        const mapping = mappings.find(m => m.developmentOrigin === unmapped.origin);
        if (!mapping) {
            return unmappedUrl;
        }
        const mapped = new URL(mapping.productionOrigin);
        mapped.pathname = unmapped.pathname;
        return mapped.href;
    }
    catch {
        return unmappedUrl;
    }
}, _CrUXManager_getFieldDataForCurrentPage = 
/**
 * In general, this function should use the main document URL
 * (i.e. the URL after all redirects but before SPA navigations)
 *
 * However, we can't detect the main document URL of the current page if it's
 * navigation occurred before DevTools was first opened. This function will fall
 * back to the currently inspected URL (i.e. what is displayed in the omnibox) if
 * the main document URL cannot be found.
 */
async function _CrUXManager_getFieldDataForCurrentPage() {
    const currentUrl = __classPrivateFieldGet(this, _CrUXManager_mainDocumentUrl, "f") || await __classPrivateFieldGet(this, _CrUXManager_instances, "m", _CrUXManager_getInspectedURL).call(this);
    const urlForCrux = __classPrivateFieldGet(this, _CrUXManager_configSetting, "f").get().overrideEnabled ? __classPrivateFieldGet(this, _CrUXManager_configSetting, "f").get().override || '' :
        __classPrivateFieldGet(this, _CrUXManager_instances, "m", _CrUXManager_getMappedUrl).call(this, currentUrl);
    const result = await this.getFieldDataForPage(urlForCrux);
    if (currentUrl !== urlForCrux) {
        result.warnings.push(i18nString(UIStrings.fieldOverrideWarning));
    }
    return result;
}, _CrUXManager_getInspectedURL = async function _CrUXManager_getInspectedURL() {
    const targetManager = SDK.TargetManager.TargetManager.instance();
    let inspectedURL = targetManager.inspectedURL();
    if (!inspectedURL) {
        inspectedURL = await new Promise(resolve => {
            function handler(event) {
                const newInspectedURL = event.data.inspectedURL();
                if (newInspectedURL) {
                    resolve(newInspectedURL);
                    targetManager.removeEventListener("InspectedURLChanged" /* SDK.TargetManager.Events.INSPECTED_URL_CHANGED */, handler);
                }
            }
            targetManager.addEventListener("InspectedURLChanged" /* SDK.TargetManager.Events.INSPECTED_URL_CHANGED */, handler);
        });
    }
    return inspectedURL;
}, _CrUXManager_onFrameNavigated = async function _CrUXManager_onFrameNavigated(event) {
    if (!event.data.isPrimaryFrame()) {
        return;
    }
    __classPrivateFieldSet(this, _CrUXManager_mainDocumentUrl, event.data.url, "f");
    await this.refresh();
}, _CrUXManager_normalizeUrl = function _CrUXManager_normalizeUrl(inputUrl) {
    const normalizedUrl = new URL(inputUrl);
    normalizedUrl.hash = '';
    normalizedUrl.search = '';
    return normalizedUrl;
}, _CrUXManager_getScopedData = async function _CrUXManager_getScopedData(normalizedUrl, pageScope, deviceScope) {
    const { origin, href: url, hostname } = normalizedUrl;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || !origin.startsWith('http')) {
        return null;
    }
    const cache = pageScope === 'origin' ? __classPrivateFieldGet(this, _CrUXManager_originCache, "f") : __classPrivateFieldGet(this, _CrUXManager_urlCache, "f");
    const cacheKey = pageScope === 'origin' ? `${origin}-${deviceScope}` : `${url}-${deviceScope}`;
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse !== undefined) {
        return cachedResponse;
    }
    // We shouldn't cache the result in the case of an error
    // The error could be a transient issue with the network/CrUX server/etc.
    try {
        const formFactor = deviceScope === 'ALL' ? undefined : deviceScope;
        const result = pageScope === 'origin' ? await __classPrivateFieldGet(this, _CrUXManager_instances, "m", _CrUXManager_makeRequest).call(this, { origin, metrics, formFactor }) :
            await __classPrivateFieldGet(this, _CrUXManager_instances, "m", _CrUXManager_makeRequest).call(this, { url, metrics, formFactor });
        cache.set(cacheKey, result);
        return result;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}, _CrUXManager_makeRequest = async function _CrUXManager_makeRequest(request) {
    const body = JSON.stringify(request);
    const response = await fetch(__classPrivateFieldGet(this, _CrUXManager_endpoint, "f"), {
        method: 'POST',
        body,
    });
    if (!response.ok && response.status !== 404) {
        throw new Error(`Failed to fetch data from CrUX server (Status code: ${response.status})`);
    }
    const responseData = await response.json();
    if (response.status === 404) {
        // This is how CrUX tells us that there is not data available for the provided url/origin
        // Since it's a valid response, just return null instead of throwing an error.
        if (responseData?.error?.status === 'NOT_FOUND') {
            return null;
        }
        throw new Error(`Failed to fetch data from CrUX server (Status code: ${response.status})`);
    }
    if (!('record' in responseData)) {
        throw new Error(`Failed to find data in CrUX response: ${JSON.stringify(responseData)}`);
    }
    return responseData;
}, _CrUXManager_getAutoDeviceScope = function _CrUXManager_getAutoDeviceScope() {
    const emulationModel = EmulationModel.DeviceModeModel.DeviceModeModel.tryInstance();
    if (emulationModel === null) {
        return 'ALL';
    }
    if (emulationModel.isMobile()) {
        if (__classPrivateFieldGet(this, _CrUXManager_pageResult, "f")?.[`${this.fieldPageScope}-PHONE`]) {
            return 'PHONE';
        }
        return 'ALL';
    }
    if (__classPrivateFieldGet(this, _CrUXManager_pageResult, "f")?.[`${this.fieldPageScope}-DESKTOP`]) {
        return 'DESKTOP';
    }
    return 'ALL';
};
export var Events;
(function (Events) {
    Events["FIELD_DATA_CHANGED"] = "field-data-changed";
})(Events || (Events = {}));
//# sourceMappingURL=CrUXManager.js.map