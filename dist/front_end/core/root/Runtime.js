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
var _ExperimentsSupport_experiments, _ExperimentsSupport_experimentNames, _ExperimentsSupport_enabledTransiently, _ExperimentsSupport_enabledByDefault, _ExperimentsSupport_serverEnabled, _ExperimentsSupport_storage, _ExperimentStorage_instances, _ExperimentStorage_experiments, _ExperimentStorage_syncToLocalStorage, _Experiment_experiments;
import * as Platform from '../platform/platform.js';
const queryParamsObject = new URLSearchParams(location.search);
let runtimePlatform = '';
let runtimeInstance;
let isNode;
/** Returns the base URL (similar to `<base>`).
 * Used to resolve the relative URLs of any additional DevTools files (locale strings, etc) needed.
 * See: https://cs.chromium.org/remoteBase+f:devtools_window
 */
export function getRemoteBase(location = self.location.toString()) {
    const url = new URL(location);
    const remoteBase = url.searchParams.get('remoteBase');
    if (!remoteBase) {
        return null;
    }
    const version = /\/serve_file\/(@[0-9a-zA-Z]+)\/?$/.exec(remoteBase);
    if (!version) {
        return null;
    }
    return { base: `devtools://devtools/remote/serve_file/${version[1]}/`, version: version[1] };
}
export function getPathName() {
    return window.location.pathname;
}
export function isNodeEntry(pathname) {
    const nodeEntryPoints = ['node_app', 'js_app'];
    return nodeEntryPoints.some(component => pathname.includes(component));
}
export const getChromeVersion = () => {
    const chromeRegex = /(?:^|\W)(?:Chrome|HeadlessChrome)\/(\S+)/;
    const chromeMatch = navigator.userAgent.match(chromeRegex);
    if (chromeMatch && chromeMatch.length > 1) {
        return chromeMatch[1];
    }
    return '';
};
export class Runtime {
    constructor() {
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!runtimeInstance || forceNew) {
            runtimeInstance = new Runtime();
        }
        return runtimeInstance;
    }
    static removeInstance() {
        runtimeInstance = undefined;
    }
    static queryParam(name) {
        return queryParamsObject.get(name);
    }
    static setQueryParamForTesting(name, value) {
        queryParamsObject.set(name, value);
    }
    static isNode() {
        if (isNode === undefined) {
            isNode = isNodeEntry(getPathName());
        }
        return isNode;
    }
    static setPlatform(platform) {
        runtimePlatform = platform;
    }
    static platform() {
        return runtimePlatform;
    }
    static isDescriptorEnabled(descriptor) {
        const { experiment } = descriptor;
        if (experiment === '*') {
            return true;
        }
        if (experiment && experiment.startsWith('!') && experiments.isEnabled(experiment.substring(1))) {
            return false;
        }
        if (experiment && !experiment.startsWith('!') && !experiments.isEnabled(experiment)) {
            return false;
        }
        const { condition } = descriptor;
        return condition ? condition(hostConfig) : true;
    }
    loadLegacyModule(modulePath) {
        // eslint-disable-next-line no-console
        console.log('Loading legacy module: ' + modulePath);
        const importPath = `../../${modulePath}`; // Extracted as a variable so esbuild doesn't attempt to bundle all the things.
        return import(importPath).then(m => {
            // eslint-disable-next-line no-console
            console.log('Loaded legacy module: ' + modulePath);
            return m;
        });
    }
}
export class ExperimentsSupport {
    constructor() {
        _ExperimentsSupport_experiments.set(this, []);
        _ExperimentsSupport_experimentNames.set(this, new Set());
        _ExperimentsSupport_enabledTransiently.set(this, new Set());
        _ExperimentsSupport_enabledByDefault.set(this, new Set());
        _ExperimentsSupport_serverEnabled.set(this, new Set());
        _ExperimentsSupport_storage.set(this, new ExperimentStorage());
    }
    allConfigurableExperiments() {
        const result = [];
        for (const experiment of __classPrivateFieldGet(this, _ExperimentsSupport_experiments, "f")) {
            if (!__classPrivateFieldGet(this, _ExperimentsSupport_enabledTransiently, "f").has(experiment.name)) {
                result.push(experiment);
            }
        }
        return result;
    }
    register(experimentName, experimentTitle, unstable, docLink, feedbackLink) {
        if (__classPrivateFieldGet(this, _ExperimentsSupport_experimentNames, "f").has(experimentName)) {
            throw new Error(`Duplicate registration of experiment '${experimentName}'`);
        }
        __classPrivateFieldGet(this, _ExperimentsSupport_experimentNames, "f").add(experimentName);
        __classPrivateFieldGet(this, _ExperimentsSupport_experiments, "f").push(new Experiment(this, experimentName, experimentTitle, Boolean(unstable), docLink ?? Platform.DevToolsPath.EmptyUrlString, feedbackLink ?? Platform.DevToolsPath.EmptyUrlString));
    }
    isEnabled(experimentName) {
        this.checkExperiment(experimentName);
        // Check for explicitly disabled #experiments first - the code could call setEnable(false) on the experiment enabled
        // by default and we should respect that.
        if (__classPrivateFieldGet(this, _ExperimentsSupport_storage, "f").get(experimentName) === false) {
            return false;
        }
        if (__classPrivateFieldGet(this, _ExperimentsSupport_enabledTransiently, "f").has(experimentName) || __classPrivateFieldGet(this, _ExperimentsSupport_enabledByDefault, "f").has(experimentName)) {
            return true;
        }
        if (__classPrivateFieldGet(this, _ExperimentsSupport_serverEnabled, "f").has(experimentName)) {
            return true;
        }
        return Boolean(__classPrivateFieldGet(this, _ExperimentsSupport_storage, "f").get(experimentName));
    }
    setEnabled(experimentName, enabled) {
        this.checkExperiment(experimentName);
        __classPrivateFieldGet(this, _ExperimentsSupport_storage, "f").set(experimentName, enabled);
    }
    enableExperimentsTransiently(experimentNames) {
        for (const experimentName of experimentNames) {
            this.checkExperiment(experimentName);
            __classPrivateFieldGet(this, _ExperimentsSupport_enabledTransiently, "f").add(experimentName);
        }
    }
    enableExperimentsByDefault(experimentNames) {
        for (const experimentName of experimentNames) {
            this.checkExperiment(experimentName);
            __classPrivateFieldGet(this, _ExperimentsSupport_enabledByDefault, "f").add(experimentName);
        }
    }
    setServerEnabledExperiments(experimentNames) {
        for (const experiment of experimentNames) {
            this.checkExperiment(experiment);
            __classPrivateFieldGet(this, _ExperimentsSupport_serverEnabled, "f").add(experiment);
        }
    }
    enableForTest(experimentName) {
        this.checkExperiment(experimentName);
        __classPrivateFieldGet(this, _ExperimentsSupport_enabledTransiently, "f").add(experimentName);
    }
    disableForTest(experimentName) {
        this.checkExperiment(experimentName);
        __classPrivateFieldGet(this, _ExperimentsSupport_enabledTransiently, "f").delete(experimentName);
    }
    clearForTest() {
        __classPrivateFieldSet(this, _ExperimentsSupport_experiments, [], "f");
        __classPrivateFieldGet(this, _ExperimentsSupport_experimentNames, "f").clear();
        __classPrivateFieldGet(this, _ExperimentsSupport_enabledTransiently, "f").clear();
        __classPrivateFieldGet(this, _ExperimentsSupport_enabledByDefault, "f").clear();
        __classPrivateFieldGet(this, _ExperimentsSupport_serverEnabled, "f").clear();
    }
    cleanUpStaleExperiments() {
        __classPrivateFieldGet(this, _ExperimentsSupport_storage, "f").cleanUpStaleExperiments(__classPrivateFieldGet(this, _ExperimentsSupport_experimentNames, "f"));
    }
    checkExperiment(experimentName) {
        if (!__classPrivateFieldGet(this, _ExperimentsSupport_experimentNames, "f").has(experimentName)) {
            throw new Error(`Unknown experiment '${experimentName}'`);
        }
    }
}
_ExperimentsSupport_experiments = new WeakMap(), _ExperimentsSupport_experimentNames = new WeakMap(), _ExperimentsSupport_enabledTransiently = new WeakMap(), _ExperimentsSupport_enabledByDefault = new WeakMap(), _ExperimentsSupport_serverEnabled = new WeakMap(), _ExperimentsSupport_storage = new WeakMap();
/** Manages the 'experiments' dictionary in self.localStorage */
class ExperimentStorage {
    constructor() {
        _ExperimentStorage_instances.add(this);
        _ExperimentStorage_experiments.set(this, {});
        try {
            const storedExperiments = self.localStorage?.getItem('experiments');
            if (storedExperiments) {
                __classPrivateFieldSet(this, _ExperimentStorage_experiments, JSON.parse(storedExperiments), "f");
            }
        }
        catch {
            console.error('Failed to parse localStorage[\'experiments\']');
        }
    }
    /**
     * Experiments are stored with a tri-state:
     *   - true: Explicitly enabled.
     *   - false: Explicitly disabled.
     *   - undefined: Disabled.
     */
    get(experimentName) {
        return __classPrivateFieldGet(this, _ExperimentStorage_experiments, "f")[experimentName];
    }
    set(experimentName, enabled) {
        __classPrivateFieldGet(this, _ExperimentStorage_experiments, "f")[experimentName] = enabled;
        __classPrivateFieldGet(this, _ExperimentStorage_instances, "m", _ExperimentStorage_syncToLocalStorage).call(this);
    }
    cleanUpStaleExperiments(validExperiments) {
        for (const [key] of Object.entries(__classPrivateFieldGet(this, _ExperimentStorage_experiments, "f"))) {
            if (!validExperiments.has(key)) {
                delete __classPrivateFieldGet(this, _ExperimentStorage_experiments, "f")[key];
            }
        }
        __classPrivateFieldGet(this, _ExperimentStorage_instances, "m", _ExperimentStorage_syncToLocalStorage).call(this);
    }
}
_ExperimentStorage_experiments = new WeakMap(), _ExperimentStorage_instances = new WeakSet(), _ExperimentStorage_syncToLocalStorage = function _ExperimentStorage_syncToLocalStorage() {
    self.localStorage?.setItem('experiments', JSON.stringify(__classPrivateFieldGet(this, _ExperimentStorage_experiments, "f")));
};
export class Experiment {
    constructor(experiments, name, title, unstable, docLink, feedbackLink) {
        _Experiment_experiments.set(this, void 0);
        this.name = name;
        this.title = title;
        this.unstable = unstable;
        this.docLink = docLink;
        this.feedbackLink = feedbackLink;
        __classPrivateFieldSet(this, _Experiment_experiments, experiments, "f");
    }
    isEnabled() {
        return __classPrivateFieldGet(this, _Experiment_experiments, "f").isEnabled(this.name);
    }
    setEnabled(enabled) {
        __classPrivateFieldGet(this, _Experiment_experiments, "f").setEnabled(this.name, enabled);
    }
}
_Experiment_experiments = new WeakMap();
// This must be constructed after the query parameters have been parsed.
export const experiments = new ExperimentsSupport();
export var ExperimentName;
(function (ExperimentName) {
    ExperimentName["CAPTURE_NODE_CREATION_STACKS"] = "capture-node-creation-stacks";
    ExperimentName["CSS_OVERVIEW"] = "css-overview";
    ExperimentName["LIVE_HEAP_PROFILE"] = "live-heap-profile";
    ExperimentName["ALL"] = "*";
    ExperimentName["PROTOCOL_MONITOR"] = "protocol-monitor";
    ExperimentName["FULL_ACCESSIBILITY_TREE"] = "full-accessibility-tree";
    ExperimentName["HEADER_OVERRIDES"] = "header-overrides";
    ExperimentName["INSTRUMENTATION_BREAKPOINTS"] = "instrumentation-breakpoints";
    ExperimentName["AUTHORED_DEPLOYED_GROUPING"] = "authored-deployed-grouping";
    ExperimentName["JUST_MY_CODE"] = "just-my-code";
    ExperimentName["HIGHLIGHT_ERRORS_ELEMENTS_PANEL"] = "highlight-errors-elements-panel";
    ExperimentName["USE_SOURCE_MAP_SCOPES"] = "use-source-map-scopes";
    ExperimentName["TIMELINE_SHOW_POST_MESSAGE_EVENTS"] = "timeline-show-postmessage-events";
    ExperimentName["TIMELINE_DEBUG_MODE"] = "timeline-debug-mode";
    ExperimentName["TIMELINE_ENHANCED_TRACES"] = "timeline-enhanced-traces";
    ExperimentName["TIMELINE_COMPILED_SOURCES"] = "timeline-compiled-sources";
    ExperimentName["TIMELINE_EXPERIMENTAL_INSIGHTS"] = "timeline-experimental-insights";
    ExperimentName["VERTICAL_DRAWER"] = "vertical-drawer";
    // Adding or removing an entry from this enum?
    // You will need to update:
    // 1. REGISTERED_EXPERIMENTS in EnvironmentHelpers.ts (to create this experiment in the test env)
    // 2. DevToolsExperiments enum in host/UserMetrics.ts
})(ExperimentName || (ExperimentName = {}));
export var GenAiEnterprisePolicyValue;
(function (GenAiEnterprisePolicyValue) {
    GenAiEnterprisePolicyValue[GenAiEnterprisePolicyValue["ALLOW"] = 0] = "ALLOW";
    GenAiEnterprisePolicyValue[GenAiEnterprisePolicyValue["ALLOW_WITHOUT_LOGGING"] = 1] = "ALLOW_WITHOUT_LOGGING";
    GenAiEnterprisePolicyValue[GenAiEnterprisePolicyValue["DISABLE"] = 2] = "DISABLE";
})(GenAiEnterprisePolicyValue || (GenAiEnterprisePolicyValue = {}));
export var HostConfigFreestylerExecutionMode;
(function (HostConfigFreestylerExecutionMode) {
    HostConfigFreestylerExecutionMode["ALL_SCRIPTS"] = "ALL_SCRIPTS";
    HostConfigFreestylerExecutionMode["SIDE_EFFECT_FREE_SCRIPTS_ONLY"] = "SIDE_EFFECT_FREE_SCRIPTS_ONLY";
    HostConfigFreestylerExecutionMode["NO_SCRIPTS"] = "NO_SCRIPTS";
})(HostConfigFreestylerExecutionMode || (HostConfigFreestylerExecutionMode = {}));
/**
 * The host configuration for this DevTools instance.
 *
 * This is initialized early during app startup and should not be modified
 * afterwards. In some cases it can be necessary to re-request the host
 * configuration from Chrome while DevTools is already running. In these
 * cases, the new host configuration should be reflected here, e.g.:
 *
 * ```js
 * const config = await new Promise<Root.Runtime.HostConfig>(
 *   resolve => InspectorFrontendHostInstance.getHostConfig(resolve));
 * Object.assign(Root.runtime.hostConfig, config);
 * ```
 */
export const hostConfig = Object.create(null);
export const conditions = {
    canDock: () => Boolean(Runtime.queryParam('can_dock')),
};
//# sourceMappingURL=Runtime.js.map