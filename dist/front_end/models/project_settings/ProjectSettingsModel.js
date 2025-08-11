// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _ProjectSettingsModel_instances, _ProjectSettingsModel_pageResourceLoader, _ProjectSettingsModel_targetManager, _ProjectSettingsModel_availability, _ProjectSettingsModel_projectSettings, _ProjectSettingsModel_promise, _ProjectSettingsModel_dispose, _ProjectSettingsModel_inspectedURLChanged, _ProjectSettingsModel_loadAndValidateProjectSettings;
import * as Common from '../../core/common/common.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
/** The security origin for all DevTools (front-end) resources. */
const DEVTOOLS_SECURITY_ORIGIN = 'devtools://devtools';
/** The (absolute) path to the project settings file. */
const WELL_KNOWN_DEVTOOLS_JSON_PATH = '/.well-known/appspecific/com.chrome.devtools.json';
/**
 * Checks if the origin of the `url` is `devtools://devtools` (meaning that it's
 * served by the `DevToolsDataSource` in Chromium) and it's path starts with
 * `/bundled/`.
 *
 * @param url the URL string to check.
 * @returns `true` if `url` refers to a resource in the Chromium DevTools bundle.
 */
function isDevToolsBundledURL(url) {
    return url.startsWith(`${DEVTOOLS_SECURITY_ORIGIN}/bundled/`);
}
/**
 * Checks if the `frame` should be considered local and safe for loading the
 * project settings from.
 *
 * This checks the security origin of `frame` for whether Chromium considers it
 * to be localhost. It also supports special logic for when the origin of the
 * `frame` is `'devtools://devtools'`, in which case we check whether the path
 * starts with `'/bundled/'` and `debugFrontend=true` is passed as a query
 * parameter (indicating that `--custom-devtools-frontend=` command line option
 * was used).
 *
 * @param frame the `ResourceTreeFrame` to check.
 * @returns `true` if `frame` is considered safe for loading the project settings.
 * @see https://goo.gle/devtools-json-design
 */
function isLocalFrame(frame) {
    if (!frame) {
        return false;
    }
    if (isDevToolsBundledURL(frame.url)) {
        return new URL(frame.url).searchParams.get('debugFrontend') === 'true';
    }
    return frame.securityOriginDetails?.isLocalhost ?? false;
}
const EMPTY_PROJECT_SETTINGS = Object.freeze({});
const IDLE_PROMISE = Promise.resolve();
let projectSettingsModelInstance;
export class ProjectSettingsModel extends Common.ObjectWrapper.ObjectWrapper {
    /**
     * Yields the availability of the project settings feature.
     *
     * `'available'` means that the feature is enabled, the origin of the inspected
     * page is `localhost`. It doesn't however indicate whether or not the page is
     * actually providing a `com.chrome.devtools.json` or not.
     *
     * @return `'available'` if the feature is enabled and the inspected page is
     *         `localhost`, otherwise `'unavailable'`.
     */
    get availability() {
        return __classPrivateFieldGet(this, _ProjectSettingsModel_availability, "f");
    }
    /**
     * Yields the current project settings.
     *
     * @return the current project settings.
     */
    get projectSettings() {
        return __classPrivateFieldGet(this, _ProjectSettingsModel_projectSettings, "f");
    }
    get projectSettingsPromise() {
        return __classPrivateFieldGet(this, _ProjectSettingsModel_promise, "f").then(() => __classPrivateFieldGet(this, _ProjectSettingsModel_projectSettings, "f"));
    }
    constructor(hostConfig, pageResourceLoader, targetManager) {
        super();
        _ProjectSettingsModel_instances.add(this);
        _ProjectSettingsModel_pageResourceLoader.set(this, void 0);
        _ProjectSettingsModel_targetManager.set(this, void 0);
        _ProjectSettingsModel_availability.set(this, 'unavailable');
        _ProjectSettingsModel_projectSettings.set(this, EMPTY_PROJECT_SETTINGS);
        _ProjectSettingsModel_promise.set(this, IDLE_PROMISE);
        __classPrivateFieldSet(this, _ProjectSettingsModel_pageResourceLoader, pageResourceLoader, "f");
        __classPrivateFieldSet(this, _ProjectSettingsModel_targetManager, targetManager, "f");
        if (hostConfig.devToolsWellKnown?.enabled) {
            __classPrivateFieldGet(this, _ProjectSettingsModel_targetManager, "f").addEventListener("InspectedURLChanged" /* SDK.TargetManager.Events.INSPECTED_URL_CHANGED */, __classPrivateFieldGet(this, _ProjectSettingsModel_instances, "m", _ProjectSettingsModel_inspectedURLChanged), this);
            const target = __classPrivateFieldGet(this, _ProjectSettingsModel_targetManager, "f").primaryPageTarget();
            if (target !== null) {
                __classPrivateFieldGet(this, _ProjectSettingsModel_instances, "m", _ProjectSettingsModel_inspectedURLChanged).call(this, { data: target });
            }
        }
    }
    /**
     * Yields the `ProjectSettingsModel` singleton.
     *
     * @returns the singleton.
     */
    static instance({ forceNew, hostConfig, pageResourceLoader, targetManager }) {
        if (!projectSettingsModelInstance || forceNew) {
            if (!hostConfig || !pageResourceLoader || !targetManager) {
                throw new Error('Unable to create ProjectSettingsModel: ' +
                    'hostConfig, pageResourceLoader, and targetManager must be provided');
            }
            projectSettingsModelInstance = new ProjectSettingsModel(hostConfig, pageResourceLoader, targetManager);
        }
        return projectSettingsModelInstance;
    }
    /**
     * Clears the `ProjectSettingsModel` singleton (if any).
     */
    static removeInstance() {
        if (projectSettingsModelInstance) {
            __classPrivateFieldGet(projectSettingsModelInstance, _ProjectSettingsModel_instances, "m", _ProjectSettingsModel_dispose).call(projectSettingsModelInstance);
            projectSettingsModelInstance = undefined;
        }
    }
}
_ProjectSettingsModel_pageResourceLoader = new WeakMap(), _ProjectSettingsModel_targetManager = new WeakMap(), _ProjectSettingsModel_availability = new WeakMap(), _ProjectSettingsModel_projectSettings = new WeakMap(), _ProjectSettingsModel_promise = new WeakMap(), _ProjectSettingsModel_instances = new WeakSet(), _ProjectSettingsModel_dispose = function _ProjectSettingsModel_dispose() {
    __classPrivateFieldGet(this, _ProjectSettingsModel_targetManager, "f").removeEventListener("InspectedURLChanged" /* SDK.TargetManager.Events.INSPECTED_URL_CHANGED */, __classPrivateFieldGet(this, _ProjectSettingsModel_instances, "m", _ProjectSettingsModel_inspectedURLChanged), this);
}, _ProjectSettingsModel_inspectedURLChanged = function _ProjectSettingsModel_inspectedURLChanged(event) {
    const target = event.data;
    const promise = __classPrivateFieldSet(this, _ProjectSettingsModel_promise, __classPrivateFieldGet(this, _ProjectSettingsModel_promise, "f").then(async () => {
        let projectSettings = EMPTY_PROJECT_SETTINGS;
        try {
            projectSettings = await __classPrivateFieldGet(this, _ProjectSettingsModel_instances, "m", _ProjectSettingsModel_loadAndValidateProjectSettings).call(this, target);
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.debug(`Could not load project settings for ${target.inspectedURL()}: ${error.message}`);
        }
        if (__classPrivateFieldGet(this, _ProjectSettingsModel_promise, "f") === promise) {
            if (__classPrivateFieldGet(this, _ProjectSettingsModel_projectSettings, "f") !== projectSettings) {
                __classPrivateFieldSet(this, _ProjectSettingsModel_projectSettings, projectSettings, "f");
                this.dispatchEventToListeners("ProjectSettingsChanged" /* Events.PROJECT_SETTINGS_CHANGED */, projectSettings);
            }
            __classPrivateFieldSet(this, _ProjectSettingsModel_promise, IDLE_PROMISE, "f");
        }
    }), "f");
}, _ProjectSettingsModel_loadAndValidateProjectSettings = async function _ProjectSettingsModel_loadAndValidateProjectSettings(target) {
    const frame = target.model(SDK.ResourceTreeModel.ResourceTreeModel)?.mainFrame;
    if (!isLocalFrame(frame)) {
        if (__classPrivateFieldGet(this, _ProjectSettingsModel_availability, "f") !== 'unavailable') {
            __classPrivateFieldSet(this, _ProjectSettingsModel_availability, 'unavailable', "f");
            this.dispatchEventToListeners("AvailabilityChanged" /* Events.AVAILABILITY_CHANGED */, __classPrivateFieldGet(this, _ProjectSettingsModel_availability, "f"));
        }
        return EMPTY_PROJECT_SETTINGS;
    }
    if (__classPrivateFieldGet(this, _ProjectSettingsModel_availability, "f") !== 'available') {
        __classPrivateFieldSet(this, _ProjectSettingsModel_availability, 'available', "f");
        this.dispatchEventToListeners("AvailabilityChanged" /* Events.AVAILABILITY_CHANGED */, __classPrivateFieldGet(this, _ProjectSettingsModel_availability, "f"));
    }
    const initiatorUrl = frame.url;
    const frameId = frame.id;
    let url = WELL_KNOWN_DEVTOOLS_JSON_PATH;
    if (isDevToolsBundledURL(initiatorUrl)) {
        url = '/bundled' + url;
    }
    url = new URL(url, initiatorUrl).toString();
    const { content } = await __classPrivateFieldGet(this, _ProjectSettingsModel_pageResourceLoader, "f").loadResource(Platform.DevToolsPath.urlString `${url}`, { target, frameId, initiatorUrl });
    const devtoolsJSON = JSON.parse(content);
    if (typeof devtoolsJSON.workspace !== 'undefined') {
        const { workspace } = devtoolsJSON;
        if (typeof workspace !== 'object' || workspace === null) {
            throw new Error('Invalid "workspace" field');
        }
        if (typeof workspace.root !== 'string') {
            throw new Error('Invalid or missing "workspace.root" field');
        }
        if (typeof workspace.uuid !== 'string') {
            throw new Error('Invalid or missing "workspace.uuid" field');
        }
    }
    return Object.freeze(devtoolsJSON);
};
/**
 * Events emitted by the `ProjectSettingsModel`.
 */
export var Events;
(function (Events) {
    /**
     * Emitted whenever the `availability` property of the
     * `ProjectSettingsModel` changes.
     */
    Events["AVAILABILITY_CHANGED"] = "AvailabilityChanged";
    /**
     * Emitted whenever the `projectSettings` property of the
     * `ProjectSettingsModel` changes.
     */
    Events["PROJECT_SETTINGS_CHANGED"] = "ProjectSettingsChanged";
})(Events || (Events = {}));
//# sourceMappingURL=ProjectSettingsModel.js.map