// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _a, _InjectedScript_injectedScript, _LiveMetrics_instances, _LiveMetrics_enabled, _LiveMetrics_target, _LiveMetrics_scriptIdentifier, _LiveMetrics_lastResetContextId, _LiveMetrics_lcpValue, _LiveMetrics_clsValue, _LiveMetrics_inpValue, _LiveMetrics_interactions, _LiveMetrics_interactionsByGroupId, _LiveMetrics_layoutShifts, _LiveMetrics_lastEmulationChangeTime, _LiveMetrics_mutex, _LiveMetrics_deviceModeModel, _LiveMetrics_onEmulationChanged, _LiveMetrics_resolveNodeRef, _LiveMetrics_sendStatusUpdate, _LiveMetrics_onDocumentUpdate, _LiveMetrics_handleWebVitalsEvent, _LiveMetrics_getFrameForExecutionContextId, _LiveMetrics_onBindingCalled, _LiveMetrics_killAllLiveMetricContexts;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as EmulationModel from '../../models/emulation/emulation.js';
import * as Spec from './web-vitals-injected/spec/spec.js';
const UIStrings = {
    /**
     * @description Warning text indicating that the Largest Contentful Paint (LCP) performance metric was affected by the user changing the simulated device.
     */
    lcpEmulationWarning: 'Simulating a new device after the page loads can affect LCP. Reload the page after simulating a new device for accurate LCP data.',
    /**
     * @description Warning text indicating that the Largest Contentful Paint (LCP) performance metric was affected by the page loading in the background.
     */
    lcpVisibilityWarning: 'LCP value may be inflated because the page started loading in the background.',
};
const str_ = i18n.i18n.registerUIStrings('models/live-metrics/LiveMetrics.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const LIVE_METRICS_WORLD_NAME = 'DevTools Performance Metrics';
let liveMetricsInstance;
class InjectedScript {
    static async get() {
        if (!__classPrivateFieldGet(this, _a, "f", _InjectedScript_injectedScript)) {
            const url = new URL('./web-vitals-injected/web-vitals-injected.generated.js', import.meta.url);
            const result = await fetch(url);
            __classPrivateFieldSet(this, _a, await result.text(), "f", _InjectedScript_injectedScript);
        }
        return __classPrivateFieldGet(this, _a, "f", _InjectedScript_injectedScript);
    }
}
_a = InjectedScript;
_InjectedScript_injectedScript = { value: void 0 };
export class LiveMetrics extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _LiveMetrics_instances.add(this);
        _LiveMetrics_enabled.set(this, false);
        _LiveMetrics_target.set(this, void 0);
        _LiveMetrics_scriptIdentifier.set(this, void 0);
        _LiveMetrics_lastResetContextId.set(this, void 0);
        _LiveMetrics_lcpValue.set(this, void 0);
        _LiveMetrics_clsValue.set(this, void 0);
        _LiveMetrics_inpValue.set(this, void 0);
        _LiveMetrics_interactions.set(this, new Map());
        _LiveMetrics_interactionsByGroupId.set(this, new Map());
        _LiveMetrics_layoutShifts.set(this, []);
        _LiveMetrics_lastEmulationChangeTime.set(this, void 0);
        _LiveMetrics_mutex.set(this, new Common.Mutex.Mutex());
        _LiveMetrics_deviceModeModel.set(this, EmulationModel.DeviceModeModel.DeviceModeModel.tryInstance());
        SDK.TargetManager.TargetManager.instance().observeTargets(this);
    }
    static instance(opts = { forceNew: false }) {
        const { forceNew } = opts;
        if (!liveMetricsInstance || forceNew) {
            liveMetricsInstance = new LiveMetrics();
        }
        return liveMetricsInstance;
    }
    get lcpValue() {
        return __classPrivateFieldGet(this, _LiveMetrics_lcpValue, "f");
    }
    get clsValue() {
        return __classPrivateFieldGet(this, _LiveMetrics_clsValue, "f");
    }
    get inpValue() {
        return __classPrivateFieldGet(this, _LiveMetrics_inpValue, "f");
    }
    get interactions() {
        return __classPrivateFieldGet(this, _LiveMetrics_interactions, "f");
    }
    get layoutShifts() {
        return __classPrivateFieldGet(this, _LiveMetrics_layoutShifts, "f");
    }
    /**
     * Will create a log message describing the interaction's LoAF scripts.
     * Returns true if the message is successfully logged.
     */
    async logInteractionScripts(interaction) {
        if (!__classPrivateFieldGet(this, _LiveMetrics_target, "f")) {
            return false;
        }
        const executionContextId = __classPrivateFieldGet(this, _LiveMetrics_lastResetContextId, "f");
        if (!executionContextId) {
            return false;
        }
        const scriptsTable = [];
        for (const loaf of interaction.longAnimationFrameTimings) {
            for (const script of loaf.scripts) {
                const scriptEndTime = script.startTime + script.duration;
                if (scriptEndTime < interaction.startTime) {
                    continue;
                }
                const blockingDuration = Math.round(scriptEndTime - Math.max(interaction.startTime, script.startTime));
                // TODO: Use translated strings for the table
                scriptsTable.push({
                    'Blocking duration': blockingDuration,
                    'Invoker type': script.invokerType || null,
                    Invoker: script.invoker || null,
                    Function: script.sourceFunctionName || null,
                    Source: script.sourceURL || null,
                    'Char position': script.sourceCharPosition || null,
                });
            }
        }
        try {
            const scriptsLimit = Spec.LOAF_LIMIT * Spec.SCRIPTS_PER_LOAF_LIMIT;
            const scriptLimitText = scriptsTable.length === scriptsLimit ? ` (limited to ${scriptsLimit})` : '';
            const loafLimitText = interaction.longAnimationFrameTimings.length === Spec.LOAF_LIMIT ?
                ` (limited to last ${Spec.LOAF_LIMIT})` :
                '';
            await __classPrivateFieldGet(this, _LiveMetrics_target, "f").runtimeAgent().invoke_evaluate({
                expression: `
          console.group('[DevTools] Long animation frames for ${interaction.duration}ms ${interaction.interactionType} interaction');
          console.log('Scripts${scriptLimitText}:');
          console.table(${JSON.stringify(scriptsTable)});
          console.log('Intersecting long animation frame events${loafLimitText}:', ${JSON.stringify(interaction.longAnimationFrameTimings)});
          console.groupEnd();
        `,
                contextId: executionContextId,
            });
        }
        catch {
            return false;
        }
        return true;
    }
    setStatusForTesting(status) {
        __classPrivateFieldSet(this, _LiveMetrics_lcpValue, status.lcp, "f");
        __classPrivateFieldSet(this, _LiveMetrics_clsValue, status.cls, "f");
        __classPrivateFieldSet(this, _LiveMetrics_inpValue, status.inp, "f");
        __classPrivateFieldSet(this, _LiveMetrics_interactions, status.interactions, "f");
        __classPrivateFieldSet(this, _LiveMetrics_layoutShifts, status.layoutShifts, "f");
        __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_sendStatusUpdate).call(this);
    }
    clearInteractions() {
        __classPrivateFieldGet(this, _LiveMetrics_interactions, "f").clear();
        __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_sendStatusUpdate).call(this);
    }
    clearLayoutShifts() {
        __classPrivateFieldSet(this, _LiveMetrics_layoutShifts, [], "f");
        __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_sendStatusUpdate).call(this);
    }
    async targetAdded(target) {
        if (target !== SDK.TargetManager.TargetManager.instance().primaryPageTarget()) {
            return;
        }
        __classPrivateFieldSet(this, _LiveMetrics_target, target, "f");
        await this.enable();
    }
    async targetRemoved(target) {
        if (target !== __classPrivateFieldGet(this, _LiveMetrics_target, "f")) {
            return;
        }
        await this.disable();
        __classPrivateFieldSet(this, _LiveMetrics_target, undefined, "f");
        // If the user navigates to a page that was pre-rendered then the primary page target
        // will be swapped and the old target will be removed. We should ensure live metrics
        // remain enabled on the new primary page target.
        const primaryPageTarget = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
        if (primaryPageTarget) {
            __classPrivateFieldSet(this, _LiveMetrics_target, primaryPageTarget, "f");
            await this.enable();
        }
    }
    async enable() {
        if (Host.InspectorFrontendHost.isUnderTest()) {
            // Enabling this impacts a lot of layout tests; we will work on fixing
            // them but for now it is easier to not run this page in layout tests.
            // b/360064852
            return;
        }
        if (!__classPrivateFieldGet(this, _LiveMetrics_target, "f") || __classPrivateFieldGet(this, _LiveMetrics_enabled, "f")) {
            return;
        }
        // Only frame targets will actually give us CWV
        if (__classPrivateFieldGet(this, _LiveMetrics_target, "f").type() !== SDK.Target.Type.FRAME) {
            return;
        }
        const domModel = __classPrivateFieldGet(this, _LiveMetrics_target, "f").model(SDK.DOMModel.DOMModel);
        if (!domModel) {
            return;
        }
        domModel.addEventListener(SDK.DOMModel.Events.DocumentUpdated, __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_onDocumentUpdate), this);
        const runtimeModel = __classPrivateFieldGet(this, _LiveMetrics_target, "f").model(SDK.RuntimeModel.RuntimeModel);
        if (!runtimeModel) {
            return;
        }
        runtimeModel.addEventListener(SDK.RuntimeModel.Events.BindingCalled, __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_onBindingCalled), this);
        await runtimeModel.addBinding({
            name: Spec.EVENT_BINDING_NAME,
            executionContextName: LIVE_METRICS_WORLD_NAME,
        });
        // If DevTools is closed and reopened, the live metrics context from the previous
        // session will persist. We should ensure any old live metrics contexts are killed
        // before starting a new one.
        await __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_killAllLiveMetricContexts).call(this);
        const source = await InjectedScript.get();
        const { identifier } = await __classPrivateFieldGet(this, _LiveMetrics_target, "f").pageAgent().invoke_addScriptToEvaluateOnNewDocument({
            source,
            worldName: LIVE_METRICS_WORLD_NAME,
            runImmediately: true,
        });
        __classPrivateFieldSet(this, _LiveMetrics_scriptIdentifier, identifier, "f");
        __classPrivateFieldGet(this, _LiveMetrics_deviceModeModel, "f")?.addEventListener("Updated" /* EmulationModel.DeviceModeModel.Events.UPDATED */, __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_onEmulationChanged), this);
        __classPrivateFieldSet(this, _LiveMetrics_enabled, true, "f");
    }
    async disable() {
        if (!__classPrivateFieldGet(this, _LiveMetrics_target, "f") || !__classPrivateFieldGet(this, _LiveMetrics_enabled, "f")) {
            return;
        }
        await __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_killAllLiveMetricContexts).call(this);
        const runtimeModel = __classPrivateFieldGet(this, _LiveMetrics_target, "f").model(SDK.RuntimeModel.RuntimeModel);
        if (runtimeModel) {
            await runtimeModel.removeBinding({
                name: Spec.EVENT_BINDING_NAME,
            });
            runtimeModel.removeEventListener(SDK.RuntimeModel.Events.BindingCalled, __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_onBindingCalled), this);
        }
        const domModel = __classPrivateFieldGet(this, _LiveMetrics_target, "f").model(SDK.DOMModel.DOMModel);
        if (domModel) {
            domModel.removeEventListener(SDK.DOMModel.Events.DocumentUpdated, __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_onDocumentUpdate), this);
        }
        if (__classPrivateFieldGet(this, _LiveMetrics_scriptIdentifier, "f")) {
            await __classPrivateFieldGet(this, _LiveMetrics_target, "f").pageAgent().invoke_removeScriptToEvaluateOnNewDocument({
                identifier: __classPrivateFieldGet(this, _LiveMetrics_scriptIdentifier, "f"),
            });
        }
        __classPrivateFieldSet(this, _LiveMetrics_scriptIdentifier, undefined, "f");
        __classPrivateFieldGet(this, _LiveMetrics_deviceModeModel, "f")?.removeEventListener("Updated" /* EmulationModel.DeviceModeModel.Events.UPDATED */, __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_onEmulationChanged), this);
        __classPrivateFieldSet(this, _LiveMetrics_enabled, false, "f");
    }
}
_LiveMetrics_enabled = new WeakMap(), _LiveMetrics_target = new WeakMap(), _LiveMetrics_scriptIdentifier = new WeakMap(), _LiveMetrics_lastResetContextId = new WeakMap(), _LiveMetrics_lcpValue = new WeakMap(), _LiveMetrics_clsValue = new WeakMap(), _LiveMetrics_inpValue = new WeakMap(), _LiveMetrics_interactions = new WeakMap(), _LiveMetrics_interactionsByGroupId = new WeakMap(), _LiveMetrics_layoutShifts = new WeakMap(), _LiveMetrics_lastEmulationChangeTime = new WeakMap(), _LiveMetrics_mutex = new WeakMap(), _LiveMetrics_deviceModeModel = new WeakMap(), _LiveMetrics_instances = new WeakSet(), _LiveMetrics_onEmulationChanged = function _LiveMetrics_onEmulationChanged() {
    __classPrivateFieldSet(this, _LiveMetrics_lastEmulationChangeTime, Date.now(), "f");
}, _LiveMetrics_resolveNodeRef = 
/**
 * DOM nodes can't be sent over a runtime binding, so we have to retrieve
 * them separately.
 */
async function _LiveMetrics_resolveNodeRef(index, executionContextId) {
    if (!__classPrivateFieldGet(this, _LiveMetrics_target, "f")) {
        return null;
    }
    const runtimeModel = __classPrivateFieldGet(this, _LiveMetrics_target, "f").model(SDK.RuntimeModel.RuntimeModel);
    if (!runtimeModel) {
        return null;
    }
    const domModel = __classPrivateFieldGet(this, _LiveMetrics_target, "f").model(SDK.DOMModel.DOMModel);
    if (!domModel) {
        return null;
    }
    const { result } = await __classPrivateFieldGet(this, _LiveMetrics_target, "f").runtimeAgent().invoke_evaluate({
        expression: `window.getNodeForIndex(${index})`,
        contextId: executionContextId,
    });
    if (!result) {
        return null;
    }
    let remoteObject;
    try {
        remoteObject = runtimeModel.createRemoteObject(result);
        const node = await domModel.pushObjectAsNodeToFrontend(remoteObject);
        if (!node) {
            return null;
        }
        const link = await Common.Linkifier.Linkifier.linkify(node);
        return { node, link };
    }
    catch {
        return null;
    }
    finally {
        remoteObject?.release();
    }
}, _LiveMetrics_sendStatusUpdate = function _LiveMetrics_sendStatusUpdate() {
    this.dispatchEventToListeners("status" /* Events.STATUS */, {
        lcp: __classPrivateFieldGet(this, _LiveMetrics_lcpValue, "f"),
        cls: __classPrivateFieldGet(this, _LiveMetrics_clsValue, "f"),
        inp: __classPrivateFieldGet(this, _LiveMetrics_inpValue, "f"),
        interactions: __classPrivateFieldGet(this, _LiveMetrics_interactions, "f"),
        layoutShifts: __classPrivateFieldGet(this, _LiveMetrics_layoutShifts, "f"),
    });
}, _LiveMetrics_onDocumentUpdate = 
/**
 * If there is a document update then any node handles we have already resolved will be invalid.
 * This function should re-resolve any relevant DOM nodes after a document update.
 */
async function _LiveMetrics_onDocumentUpdate(event) {
    const domModel = event.data;
    const toRefresh = [
        __classPrivateFieldGet(this, _LiveMetrics_lcpValue, "f")?.nodeRef,
        ...__classPrivateFieldGet(this, _LiveMetrics_interactions, "f").values().map(i => i.nodeRef),
        ...__classPrivateFieldGet(this, _LiveMetrics_layoutShifts, "f").flatMap(shift => shift.affectedNodeRefs),
    ].filter(nodeRef => !!nodeRef);
    const idsToRefresh = new Set(toRefresh.map(nodeRef => nodeRef.node.backendNodeId()));
    const nodes = await domModel.pushNodesByBackendIdsToFrontend(idsToRefresh);
    if (!nodes) {
        return;
    }
    const allPromises = toRefresh.map(async (nodeRef) => {
        const refreshedNode = nodes.get(nodeRef.node.backendNodeId());
        // It is possible for the refreshed node to be undefined even though it was defined previously.
        // We should keep the affected nodes consistent from the user perspective, so we will just keep the stale node instead of removing it.
        if (!refreshedNode) {
            return;
        }
        nodeRef.node = refreshedNode;
        nodeRef.link = await Common.Linkifier.Linkifier.linkify(refreshedNode);
    });
    await Promise.all(allPromises);
    __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_sendStatusUpdate).call(this);
}, _LiveMetrics_handleWebVitalsEvent = async function _LiveMetrics_handleWebVitalsEvent(webVitalsEvent, executionContextId) {
    switch (webVitalsEvent.name) {
        case 'LCP': {
            const warnings = [];
            const lcpEvent = {
                value: webVitalsEvent.value,
                phases: webVitalsEvent.phases,
                warnings,
            };
            if (webVitalsEvent.nodeIndex !== undefined) {
                const nodeRef = await __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_resolveNodeRef).call(this, webVitalsEvent.nodeIndex, executionContextId);
                if (nodeRef) {
                    lcpEvent.nodeRef = nodeRef;
                }
            }
            if (__classPrivateFieldGet(this, _LiveMetrics_lastEmulationChangeTime, "f") && Date.now() - __classPrivateFieldGet(this, _LiveMetrics_lastEmulationChangeTime, "f") < 500) {
                warnings.push(i18nString(UIStrings.lcpEmulationWarning));
            }
            if (webVitalsEvent.startedHidden) {
                warnings.push(i18nString(UIStrings.lcpVisibilityWarning));
            }
            __classPrivateFieldSet(this, _LiveMetrics_lcpValue, lcpEvent, "f");
            break;
        }
        case 'CLS': {
            const event = {
                value: webVitalsEvent.value,
                clusterShiftIds: webVitalsEvent.clusterShiftIds,
            };
            __classPrivateFieldSet(this, _LiveMetrics_clsValue, event, "f");
            break;
        }
        case 'INP': {
            const inpEvent = {
                value: webVitalsEvent.value,
                phases: webVitalsEvent.phases,
                interactionId: `interaction-${webVitalsEvent.entryGroupId}-${webVitalsEvent.startTime}`,
            };
            __classPrivateFieldSet(this, _LiveMetrics_inpValue, inpEvent, "f");
            break;
        }
        case 'InteractionEntry': {
            const groupInteractions = Platform.MapUtilities.getWithDefault(__classPrivateFieldGet(this, _LiveMetrics_interactionsByGroupId, "f"), webVitalsEvent.entryGroupId, () => []);
            // `nextPaintTime` uses the event duration which is rounded to the nearest 8ms. The best we can do
            // is check if the `nextPaintTime`s are within 8ms.
            // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/duration#event
            let interaction = groupInteractions.find(interaction => Math.abs(interaction.nextPaintTime - webVitalsEvent.nextPaintTime) < 8);
            if (!interaction) {
                interaction = {
                    interactionId: `interaction-${webVitalsEvent.entryGroupId}-${webVitalsEvent.startTime}`,
                    interactionType: webVitalsEvent.interactionType,
                    duration: webVitalsEvent.duration,
                    eventNames: [],
                    phases: webVitalsEvent.phases,
                    startTime: webVitalsEvent.startTime,
                    nextPaintTime: webVitalsEvent.nextPaintTime,
                    longAnimationFrameTimings: webVitalsEvent.longAnimationFrameEntries,
                };
                groupInteractions.push(interaction);
                __classPrivateFieldGet(this, _LiveMetrics_interactions, "f").set(interaction.interactionId, interaction);
            }
            // We can get multiple instances of the first input interaction since web-vitals.js installs
            // an extra listener for events of type `first-input`. This is a simple way to de-dupe those
            // events without adding complexity to the injected code.
            if (!interaction.eventNames.includes(webVitalsEvent.eventName)) {
                interaction.eventNames.push(webVitalsEvent.eventName);
            }
            if (webVitalsEvent.nodeIndex !== undefined) {
                const node = await __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_resolveNodeRef).call(this, webVitalsEvent.nodeIndex, executionContextId);
                if (node) {
                    interaction.nodeRef = node;
                }
            }
            break;
        }
        case 'LayoutShift': {
            const nodePromises = webVitalsEvent.affectedNodeIndices.map(nodeIndex => {
                return __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_resolveNodeRef).call(this, nodeIndex, executionContextId);
            });
            const affectedNodes = (await Promise.all(nodePromises)).filter(nodeRef => !!nodeRef);
            const layoutShift = {
                score: webVitalsEvent.score,
                uniqueLayoutShiftId: webVitalsEvent.uniqueLayoutShiftId,
                affectedNodeRefs: affectedNodes,
            };
            __classPrivateFieldGet(this, _LiveMetrics_layoutShifts, "f").push(layoutShift);
            break;
        }
        case 'reset': {
            __classPrivateFieldSet(this, _LiveMetrics_lcpValue, undefined, "f");
            __classPrivateFieldSet(this, _LiveMetrics_clsValue, undefined, "f");
            __classPrivateFieldSet(this, _LiveMetrics_inpValue, undefined, "f");
            __classPrivateFieldGet(this, _LiveMetrics_interactions, "f").clear();
            __classPrivateFieldSet(this, _LiveMetrics_layoutShifts, [], "f");
            break;
        }
    }
    __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_sendStatusUpdate).call(this);
}, _LiveMetrics_getFrameForExecutionContextId = async function _LiveMetrics_getFrameForExecutionContextId(executionContextId) {
    if (!__classPrivateFieldGet(this, _LiveMetrics_target, "f")) {
        return null;
    }
    const runtimeModel = __classPrivateFieldGet(this, _LiveMetrics_target, "f").model(SDK.RuntimeModel.RuntimeModel);
    if (!runtimeModel) {
        return null;
    }
    const executionContext = runtimeModel.executionContext(executionContextId);
    if (!executionContext) {
        return null;
    }
    const frameId = executionContext.frameId;
    if (!frameId) {
        return null;
    }
    const frameManager = SDK.FrameManager.FrameManager.instance();
    return await frameManager.getOrWaitForFrame(frameId);
}, _LiveMetrics_onBindingCalled = async function _LiveMetrics_onBindingCalled(event) {
    const { data } = event;
    if (data.name !== Spec.EVENT_BINDING_NAME) {
        return;
    }
    // Async tasks can be performed while handling an event (e.g. resolving DOM node)
    // Use a mutex here to ensure the events are handled in the order they are received.
    await __classPrivateFieldGet(this, _LiveMetrics_mutex, "f").run(async () => {
        const webVitalsEvent = JSON.parse(data.payload);
        // This ensures that `#lastResetContextId` will always be an execution context on the
        // primary frame. If we receive events from this execution context then we automatically
        // know that they are for the primary frame.
        if (__classPrivateFieldGet(this, _LiveMetrics_lastResetContextId, "f") !== data.executionContextId) {
            if (webVitalsEvent.name !== 'reset') {
                return;
            }
            // We should avoid calling this function for every event.
            // If an interaction triggers a pre-rendered navigation then the old primary frame could
            // be removed before we reach this point, and then it will hang forever.
            const frame = await __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_getFrameForExecutionContextId).call(this, data.executionContextId);
            if (!frame?.isPrimaryFrame()) {
                return;
            }
            __classPrivateFieldSet(this, _LiveMetrics_lastResetContextId, data.executionContextId, "f");
        }
        await __classPrivateFieldGet(this, _LiveMetrics_instances, "m", _LiveMetrics_handleWebVitalsEvent).call(this, webVitalsEvent, data.executionContextId);
    });
}, _LiveMetrics_killAllLiveMetricContexts = async function _LiveMetrics_killAllLiveMetricContexts() {
    const target = __classPrivateFieldGet(this, _LiveMetrics_target, "f");
    if (!target) {
        return;
    }
    const runtimeModel = target.model(SDK.RuntimeModel.RuntimeModel);
    if (!runtimeModel) {
        return;
    }
    const killPromises = runtimeModel.executionContexts()
        .filter(e => e.name === LIVE_METRICS_WORLD_NAME && !e.isDefault)
        .map(e => target.runtimeAgent().invoke_evaluate({
        // On the off chance something else creates execution contexts with the exact same name
        // this expression should just be a noop.
        expression: `window?.${Spec.INTERNAL_KILL_SWITCH}?.()`,
        contextId: e.id,
    }));
    await Promise.all(killPromises);
};
export var Events;
(function (Events) {
    Events["STATUS"] = "status";
})(Events || (Events = {}));
//# sourceMappingURL=LiveMetrics.js.map