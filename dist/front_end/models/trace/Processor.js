// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _TraceProcessor_instances, _a, _TraceProcessor_traceHandlers, _TraceProcessor_status, _TraceProcessor_modelConfiguration, _TraceProcessor_data, _TraceProcessor_insights, _TraceProcessor_passConfigToHandlers, _TraceProcessor_verifyHandlers, _TraceProcessor_computeParsedTrace, _TraceProcessor_createLanternContext, _TraceProcessor_computeInsightSet, _TraceProcessor_computeInsights, _TraceProcessor_computeInsightsForInitialTracePeriod, _TraceProcessor_computeInsightsForNavigation;
import * as Handlers from './handlers/handlers.js';
import * as Helpers from './helpers/helpers.js';
import * as Insights from './insights/insights.js';
import * as Lantern from './lantern/lantern.js';
import * as LanternComputationData from './LanternComputationData.js';
import * as Types from './types/types.js';
var Status;
(function (Status) {
    Status["IDLE"] = "IDLE";
    Status["PARSING"] = "PARSING";
    Status["FINISHED_PARSING"] = "FINISHED_PARSING";
    Status["ERRORED_WHILE_PARSING"] = "ERRORED_WHILE_PARSING";
})(Status || (Status = {}));
export class TraceParseProgressEvent extends Event {
    constructor(data, init = { bubbles: true }) {
        super(TraceParseProgressEvent.eventName, init);
        this.data = data;
    }
}
TraceParseProgressEvent.eventName = 'traceparseprogress';
/**
 * Parsing a trace can take time. On large traces we see a breakdown of time like so:
 *   - handleEvent() loop:  ~20%
 *   - finalize() loop:     ~60%
 *   - shallowClone calls:  ~20%
 * The numbers below are set so we can report a progress percentage of [0...1]
 */
var ProgressPhase;
(function (ProgressPhase) {
    ProgressPhase[ProgressPhase["HANDLE_EVENT"] = 0.2] = "HANDLE_EVENT";
    ProgressPhase[ProgressPhase["FINALIZE"] = 0.8] = "FINALIZE";
    ProgressPhase[ProgressPhase["CLONE"] = 1] = "CLONE";
})(ProgressPhase || (ProgressPhase = {}));
function calculateProgress(value, phase) {
    // Finalize values should be [0.2...0.8]
    if (phase === 0.8 /* ProgressPhase.FINALIZE */) {
        return (value * (0.8 /* ProgressPhase.FINALIZE */ - 0.2 /* ProgressPhase.HANDLE_EVENT */)) + 0.2 /* ProgressPhase.HANDLE_EVENT */;
    }
    return value * phase;
}
export class TraceProcessor extends EventTarget {
    static createWithAllHandlers() {
        return new _a(Handlers.ModelHandlers, Types.Configuration.defaults());
    }
    /**
     * This function is kept for testing with `stub`.
     */
    static getInsightRunners() {
        return { ...Insights.Models };
    }
    constructor(traceHandlers, modelConfiguration) {
        super();
        _TraceProcessor_instances.add(this);
        // We force the Meta handler to be enabled, so the TraceHandlers type here is
        // the model handlers the user passes in and the Meta handler.
        _TraceProcessor_traceHandlers.set(this, void 0);
        _TraceProcessor_status.set(this, "IDLE" /* Status.IDLE */);
        _TraceProcessor_modelConfiguration.set(this, Types.Configuration.defaults());
        _TraceProcessor_data.set(this, null);
        _TraceProcessor_insights.set(this, null);
        __classPrivateFieldGet(this, _TraceProcessor_instances, "m", _TraceProcessor_verifyHandlers).call(this, traceHandlers);
        __classPrivateFieldSet(this, _TraceProcessor_traceHandlers, {
            Meta: Handlers.ModelHandlers.Meta,
            ...traceHandlers,
        }, "f");
        if (modelConfiguration) {
            __classPrivateFieldSet(this, _TraceProcessor_modelConfiguration, modelConfiguration, "f");
        }
        __classPrivateFieldGet(this, _TraceProcessor_instances, "m", _TraceProcessor_passConfigToHandlers).call(this);
    }
    reset() {
        if (__classPrivateFieldGet(this, _TraceProcessor_status, "f") === "PARSING" /* Status.PARSING */) {
            throw new Error('Trace processor can\'t reset while parsing.');
        }
        const handlers = Object.values(__classPrivateFieldGet(this, _TraceProcessor_traceHandlers, "f"));
        for (const handler of handlers) {
            handler.reset();
        }
        __classPrivateFieldSet(this, _TraceProcessor_data, null, "f");
        __classPrivateFieldSet(this, _TraceProcessor_insights, null, "f");
        __classPrivateFieldSet(this, _TraceProcessor_status, "IDLE" /* Status.IDLE */, "f");
    }
    async parse(traceEvents, options) {
        if (__classPrivateFieldGet(this, _TraceProcessor_status, "f") !== "IDLE" /* Status.IDLE */) {
            throw new Error(`Trace processor can't start parsing when not idle. Current state: ${__classPrivateFieldGet(this, _TraceProcessor_status, "f")}`);
        }
        options.logger?.start('total');
        try {
            __classPrivateFieldSet(this, _TraceProcessor_status, "PARSING" /* Status.PARSING */, "f");
            options.logger?.start('parse');
            await __classPrivateFieldGet(this, _TraceProcessor_instances, "m", _TraceProcessor_computeParsedTrace).call(this, traceEvents, options);
            options.logger?.end('parse');
            if (__classPrivateFieldGet(this, _TraceProcessor_data, "f") && !options.isCPUProfile) { // We do not calculate insights for CPU Profiles.
                options.logger?.start('insights');
                __classPrivateFieldGet(this, _TraceProcessor_instances, "m", _TraceProcessor_computeInsights).call(this, __classPrivateFieldGet(this, _TraceProcessor_data, "f"), traceEvents, options);
                options.logger?.end('insights');
            }
            __classPrivateFieldSet(this, _TraceProcessor_status, "FINISHED_PARSING" /* Status.FINISHED_PARSING */, "f");
        }
        catch (e) {
            __classPrivateFieldSet(this, _TraceProcessor_status, "ERRORED_WHILE_PARSING" /* Status.ERRORED_WHILE_PARSING */, "f");
            throw e;
        }
        finally {
            options.logger?.end('total');
        }
    }
    get parsedTrace() {
        if (__classPrivateFieldGet(this, _TraceProcessor_status, "f") !== "FINISHED_PARSING" /* Status.FINISHED_PARSING */) {
            return null;
        }
        return __classPrivateFieldGet(this, _TraceProcessor_data, "f");
    }
    get insights() {
        if (__classPrivateFieldGet(this, _TraceProcessor_status, "f") !== "FINISHED_PARSING" /* Status.FINISHED_PARSING */) {
            return null;
        }
        return __classPrivateFieldGet(this, _TraceProcessor_insights, "f");
    }
    /**
     * Sort the insight models based on the impact of each insight's estimated savings, additionally weighted by the
     * worst metrics according to field data (if present).
     */
    sortInsightSet(insightSet, metadata) {
        // The initial order of the insights is alphabetical, based on `front_end/models/trace/insights/Models.ts`.
        // The order here provides a baseline that groups insights in a more logical way.
        const baselineOrder = {
            INPBreakdown: null,
            LCPBreakdown: null,
            LCPDiscovery: null,
            CLSCulprits: null,
            RenderBlocking: null,
            NetworkDependencyTree: null,
            ImageDelivery: null,
            DocumentLatency: null,
            FontDisplay: null,
            Viewport: null,
            DOMSize: null,
            ThirdParties: null,
            DuplicatedJavaScript: null,
            SlowCSSSelector: null,
            ForcedReflow: null,
            Cache: null,
            ModernHTTP: null,
            LegacyJavaScript: null,
        };
        // Determine the weights for each metric based on field data, utilizing the same scoring curve that Lighthouse uses.
        const weights = Insights.Common.calculateMetricWeightsForSorting(insightSet, metadata);
        // Normalize the estimated savings to a single number, weighted by its relative impact
        // to the page experience based on the same scoring curve that Lighthouse uses.
        const observedLcpMicro = Insights.Common.getLCP(__classPrivateFieldGet(this, _TraceProcessor_insights, "f"), insightSet.id)?.value;
        const observedLcp = observedLcpMicro ? Helpers.Timing.microToMilli(observedLcpMicro) : Types.Timing.Milli(0);
        const observedCls = Insights.Common.getCLS(__classPrivateFieldGet(this, _TraceProcessor_insights, "f"), insightSet.id).value;
        // INP is special - if users did not interact with the page, we'll have no INP, but we should still
        // be able to prioritize insights based on this metric. When we observe no interaction, instead use
        // a default value for the baseline INP.
        const observedInpMicro = Insights.Common.getINP(__classPrivateFieldGet(this, _TraceProcessor_insights, "f"), insightSet.id)?.value;
        const observedInp = observedInpMicro ? Helpers.Timing.microToMilli(observedInpMicro) : Types.Timing.Milli(200);
        const observedLcpScore = observedLcp !== undefined ? Insights.Common.evaluateLCPMetricScore(observedLcp) : undefined;
        const observedInpScore = Insights.Common.evaluateINPMetricScore(observedInp);
        const observedClsScore = Insights.Common.evaluateCLSMetricScore(observedCls);
        const insightToSortingRank = new Map();
        for (const [name, model] of Object.entries(insightSet.model)) {
            const lcp = model.metricSavings?.LCP ?? 0;
            const inp = model.metricSavings?.INP ?? 0;
            const cls = model.metricSavings?.CLS ?? 0;
            const lcpPostSavings = observedLcp !== undefined ? Math.max(0, observedLcp - lcp) : undefined;
            const inpPostSavings = Math.max(0, observedInp - inp);
            const clsPostSavings = Math.max(0, observedCls - cls);
            let score = 0;
            if (weights.lcp && lcp && observedLcpScore !== undefined && lcpPostSavings !== undefined) {
                score += weights.lcp * (Insights.Common.evaluateLCPMetricScore(lcpPostSavings) - observedLcpScore);
            }
            if (weights.inp && inp && observedInpScore !== undefined) {
                score += weights.inp * (Insights.Common.evaluateINPMetricScore(inpPostSavings) - observedInpScore);
            }
            if (weights.cls && cls && observedClsScore !== undefined) {
                score += weights.cls * (Insights.Common.evaluateCLSMetricScore(clsPostSavings) - observedClsScore);
            }
            insightToSortingRank.set(name, score);
        }
        // Now perform the actual sorting.
        const baselineOrderKeys = Object.keys(baselineOrder);
        const orderedKeys = Object.keys(insightSet.model);
        orderedKeys.sort((a, b) => {
            const a1 = baselineOrderKeys.indexOf(a);
            const b1 = baselineOrderKeys.indexOf(b);
            if (a1 >= 0 && b1 >= 0) {
                return a1 - b1;
            }
            if (a1 >= 0) {
                return -1;
            }
            if (b1 >= 0) {
                return 1;
            }
            return 0;
        });
        orderedKeys.sort((a, b) => (insightToSortingRank.get(b) ?? 0) - (insightToSortingRank.get(a) ?? 0));
        const newModel = {};
        for (const key of orderedKeys) {
            const model = insightSet.model[key];
            // @ts-expect-error Maybe someday typescript will be powerful enough to handle this.
            newModel[key] = model;
        }
        insightSet.model = newModel;
    }
}
_a = TraceProcessor, _TraceProcessor_traceHandlers = new WeakMap(), _TraceProcessor_status = new WeakMap(), _TraceProcessor_modelConfiguration = new WeakMap(), _TraceProcessor_data = new WeakMap(), _TraceProcessor_insights = new WeakMap(), _TraceProcessor_instances = new WeakSet(), _TraceProcessor_passConfigToHandlers = function _TraceProcessor_passConfigToHandlers() {
    for (const handler of Object.values(__classPrivateFieldGet(this, _TraceProcessor_traceHandlers, "f"))) {
        // Bit of an odd double check, but without this TypeScript refuses to let
        // you call the function as it thinks it might be undefined.
        if ('handleUserConfig' in handler && handler.handleUserConfig) {
            handler.handleUserConfig(__classPrivateFieldGet(this, _TraceProcessor_modelConfiguration, "f"));
        }
    }
}, _TraceProcessor_verifyHandlers = function _TraceProcessor_verifyHandlers(providedHandlers) {
    // Tiny optimisation: if the amount of provided handlers matches the amount
    // of handlers in the Handlers.ModelHandlers object, that means that the
    // user has passed in every handler we have. So therefore they cannot have
    // missed any, and there is no need to iterate through the handlers and
    // check the dependencies.
    if (Object.keys(providedHandlers).length === Object.keys(Handlers.ModelHandlers).length) {
        return;
    }
    const requiredHandlerKeys = new Set();
    for (const [handlerName, handler] of Object.entries(providedHandlers)) {
        requiredHandlerKeys.add(handlerName);
        const deps = 'deps' in handler ? handler.deps() : [];
        for (const depName of deps) {
            requiredHandlerKeys.add(depName);
        }
    }
    const providedHandlerKeys = new Set(Object.keys(providedHandlers));
    // We always force the Meta handler to be enabled when creating the
    // Processor, so if it is missing from the set the user gave us that is OK,
    // as we will have enabled it anyway.
    requiredHandlerKeys.delete('Meta');
    for (const requiredKey of requiredHandlerKeys) {
        if (!providedHandlerKeys.has(requiredKey)) {
            throw new Error(`Required handler ${requiredKey} not provided.`);
        }
    }
}, _TraceProcessor_computeParsedTrace = 
/**
 * Run all the handlers and set the result to `#data`.
 */
async function _TraceProcessor_computeParsedTrace(traceEvents, options) {
    /**
     * We want to yield regularly to maintain responsiveness. If we yield too often, we're wasting idle time.
     * We could do this by checking `performance.now()` regularly, but it's an expensive call in such a hot loop.
     * `eventsPerChunk` is an approximated proxy metric.
     * But how big a chunk? We're aiming for long tasks that are no smaller than 100ms and not bigger than 200ms.
     * It's CPU dependent, so it should be calibrated on oldish hardware.
     * Illustration of a previous change to `eventsPerChunk`: https://imgur.com/wzp8BnR
     */
    const eventsPerChunk = 50000;
    // Convert to array so that we are able to iterate all handlers multiple times.
    const sortedHandlers = [...sortHandlers(__classPrivateFieldGet(this, _TraceProcessor_traceHandlers, "f")).entries()];
    // Reset.
    for (const [, handler] of sortedHandlers) {
        handler.reset();
    }
    options.logger?.start('parse:handleEvent');
    // Handle each event.
    for (let i = 0; i < traceEvents.length; ++i) {
        // Every so often we take a break just to render.
        if (i % eventsPerChunk === 0 && i) {
            // Take the opportunity to provide status update events.
            const percent = calculateProgress(i / traceEvents.length, 0.2 /* ProgressPhase.HANDLE_EVENT */);
            this.dispatchEvent(new TraceParseProgressEvent({ percent }));
            // TODO(paulirish): consider using `scheduler.yield()` or `scheduler.postTask(() => {}, {priority: 'user-blocking'})`
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        const event = traceEvents[i];
        for (let j = 0; j < sortedHandlers.length; ++j) {
            const [, handler] = sortedHandlers[j];
            handler.handleEvent(event);
        }
    }
    options.logger?.end('parse:handleEvent');
    // Finalize.
    for (let i = 0; i < sortedHandlers.length; i++) {
        const [name, handler] = sortedHandlers[i];
        if (handler.finalize) {
            options.logger?.start(`parse:${name}:finalize`);
            // Yield to the UI because finalize() calls can be expensive
            // TODO(jacktfranklin): consider using `scheduler.yield()` or `scheduler.postTask(() => {}, {priority: 'user-blocking'})`
            await new Promise(resolve => setTimeout(resolve, 0));
            await handler.finalize(options);
            options.logger?.end(`parse:${name}:finalize`);
        }
        const percent = calculateProgress(i / sortedHandlers.length, 0.8 /* ProgressPhase.FINALIZE */);
        this.dispatchEvent(new TraceParseProgressEvent({ percent }));
    }
    // Handlers that depend on other handlers do so via .data(), which used to always
    // return a shallow clone of its internal data structures. However, that pattern
    // easily results in egregious amounts of allocation. Now .data() does not do any
    // cloning, and it happens here instead so that users of the trace processor may
    // still assume that the parsed data is theirs.
    // See: crbug/41484172
    const shallowClone = (value, recurse = true) => {
        if (value instanceof Map) {
            return new Map(value);
        }
        if (value instanceof Set) {
            return new Set(value);
        }
        if (Array.isArray(value)) {
            return [...value];
        }
        if (typeof value === 'object' && value && recurse) {
            const obj = {};
            for (const [key, v] of Object.entries(value)) {
                obj[key] = shallowClone(v, false);
            }
            return obj;
        }
        return value;
    };
    options.logger?.start('parse:clone');
    const parsedTrace = {};
    for (const [name, handler] of Object.entries(__classPrivateFieldGet(this, _TraceProcessor_traceHandlers, "f"))) {
        const data = shallowClone(handler.data());
        Object.assign(parsedTrace, { [name]: data });
    }
    options.logger?.end('parse:clone');
    this.dispatchEvent(new TraceParseProgressEvent({ percent: 1 /* ProgressPhase.CLONE */ }));
    __classPrivateFieldSet(this, _TraceProcessor_data, parsedTrace, "f");
}, _TraceProcessor_createLanternContext = function _TraceProcessor_createLanternContext(parsedTrace, traceEvents, frameId, navigationId, options) {
    // Check for required handlers.
    if (!parsedTrace.NetworkRequests || !parsedTrace.Workers || !parsedTrace.PageLoadMetrics) {
        return;
    }
    if (!parsedTrace.NetworkRequests.byTime.length) {
        throw new Lantern.Core.LanternError('No network requests found in trace');
    }
    const navStarts = parsedTrace.Meta.navigationsByFrameId.get(frameId);
    const navStartIndex = navStarts?.findIndex(n => n.args.data?.navigationId === navigationId);
    if (!navStarts || navStartIndex === undefined || navStartIndex === -1) {
        throw new Lantern.Core.LanternError('Could not find navigation start');
    }
    const startTime = navStarts[navStartIndex].ts;
    const endTime = navStartIndex + 1 < navStarts.length ? navStarts[navStartIndex + 1].ts : Number.POSITIVE_INFINITY;
    const boundedTraceEvents = traceEvents.filter(e => e.ts >= startTime && e.ts < endTime);
    // Lantern.Types.TraceEvent and Types.Events.Event represent the same
    // object - a trace event - but one is more flexible than the other. It should be safe to cast between them.
    const trace = {
        traceEvents: boundedTraceEvents,
    };
    const requests = LanternComputationData.createNetworkRequests(trace, parsedTrace, startTime, endTime);
    const graph = LanternComputationData.createGraph(requests, trace, parsedTrace);
    const processedNavigation = LanternComputationData.createProcessedNavigation(parsedTrace, frameId, navigationId);
    const networkAnalysis = Lantern.Core.NetworkAnalyzer.analyze(requests);
    if (!networkAnalysis) {
        return;
    }
    const lanternSettings = {
        // TODO(crbug.com/372674229): if devtools throttling was on, does this network analysis capture
        // that? Do we need to set 'devtools' throttlingMethod?
        networkAnalysis,
        throttlingMethod: 'provided',
        ...options.lanternSettings,
    };
    const simulator = Lantern.Simulation.Simulator.createSimulator(lanternSettings);
    const computeData = { graph, simulator, processedNavigation };
    const fcpResult = Lantern.Metrics.FirstContentfulPaint.compute(computeData);
    const lcpResult = Lantern.Metrics.LargestContentfulPaint.compute(computeData, { fcpResult });
    const interactiveResult = Lantern.Metrics.Interactive.compute(computeData, { lcpResult });
    const tbtResult = Lantern.Metrics.TotalBlockingTime.compute(computeData, { fcpResult, interactiveResult });
    const metrics = {
        firstContentfulPaint: fcpResult,
        interactive: interactiveResult,
        largestContentfulPaint: lcpResult,
        totalBlockingTime: tbtResult,
    };
    return { requests, graph, simulator, metrics };
}, _TraceProcessor_computeInsightSet = function _TraceProcessor_computeInsightSet(parsedTrace, context, options) {
    let id, urlString, navigation;
    if (context.navigation) {
        id = context.navigationId;
        urlString =
            parsedTrace.Meta.finalDisplayUrlByNavigationId.get(context.navigationId) ?? parsedTrace.Meta.mainFrameURL;
        navigation = context.navigation;
    }
    else {
        id = Types.Events.NO_NAVIGATION;
        urlString = parsedTrace.Meta.finalDisplayUrlByNavigationId.get('') ?? parsedTrace.Meta.mainFrameURL;
    }
    const insightSetModel = {};
    for (const [name, insight] of Object.entries(_a.getInsightRunners())) {
        let model;
        try {
            options.logger?.start(`insights:${name}`);
            model = insight.generateInsight(parsedTrace, context);
            model.frameId = context.frameId;
            const navId = context.navigation?.args.data?.navigationId;
            if (navId) {
                model.navigationId = navId;
            }
            model.createOverlays = () => {
                // @ts-expect-error: model is a union of all possible insight model types.
                return insight.createOverlays(model);
            };
        }
        catch (err) {
            model = err;
        }
        finally {
            options.logger?.end(`insights:${name}`);
        }
        Object.assign(insightSetModel, { [name]: model });
    }
    // We may choose to exclude the insightSet if it's trivial. Trivial means:
    //   1. There's no navigation (it's an initial trace period)
    //   2. The duration is short.
    //   3. All the insights are passing (aka no insights to show the user)
    //   4. It has no metrics to report (apart from a CLS of 0, which is default)
    // Generally, these cases are the short time ranges before a page reload starts.
    const isNavigation = id === Types.Events.NO_NAVIGATION;
    const trivialThreshold = Helpers.Timing.milliToMicro(Types.Timing.Milli(5000));
    const everyInsightPasses = Object.values(insightSetModel)
        .filter(model => !(model instanceof Error))
        .every(model => model.state === 'pass');
    const noLcp = !insightSetModel.LCPBreakdown.lcpEvent;
    const noInp = !insightSetModel.INPBreakdown.longestInteractionEvent;
    const noLayoutShifts = insightSetModel.CLSCulprits.shifts?.size === 0;
    const shouldExclude = isNavigation && context.bounds.range < trivialThreshold && everyInsightPasses && noLcp &&
        noInp && noLayoutShifts;
    if (shouldExclude) {
        return;
    }
    let url;
    try {
        url = new URL(urlString);
    }
    catch {
        // We're pretty sure this only happens for our test fixture: missing-url.json.gz. Shouldn't
        // happen for real traces.
        return;
    }
    const insightSet = {
        id,
        url,
        navigation,
        frameId: context.frameId,
        bounds: context.bounds,
        model: insightSetModel,
    };
    if (!__classPrivateFieldGet(this, _TraceProcessor_insights, "f")) {
        __classPrivateFieldSet(this, _TraceProcessor_insights, new Map(), "f");
    }
    __classPrivateFieldGet(this, _TraceProcessor_insights, "f").set(insightSet.id, insightSet);
    this.sortInsightSet(insightSet, options.metadata ?? null);
}, _TraceProcessor_computeInsights = function _TraceProcessor_computeInsights(parsedTrace, traceEvents, options) {
    // This insights map will be populated by the helper methods.
    __classPrivateFieldSet(this, _TraceProcessor_insights, new Map(), "f");
    // Filter main frame navigations to those that have the necessary data (frameId and navigationId).
    // TODO(cjamcl): Does this filtering makes the "use the next nav as the end time" logic potentially broken? Are navs without nav id or frame even real?
    const navigations = parsedTrace.Meta.mainFrameNavigations.filter(navigation => navigation.args.frame && navigation.args.data?.navigationId);
    __classPrivateFieldGet(this, _TraceProcessor_instances, "m", _TraceProcessor_computeInsightsForInitialTracePeriod).call(this, parsedTrace, navigations, options);
    for (const [index, navigation] of navigations.entries()) {
        const min = navigation.ts;
        // Use trace end for the last navigation, otherwise use the start of the next navigation.
        const max = index + 1 < navigations.length ? navigations[index + 1].ts : parsedTrace.Meta.traceBounds.max;
        const bounds = Helpers.Timing.traceWindowFromMicroSeconds(min, max);
        __classPrivateFieldGet(this, _TraceProcessor_instances, "m", _TraceProcessor_computeInsightsForNavigation).call(this, navigation, bounds, parsedTrace, traceEvents, options);
    }
}, _TraceProcessor_computeInsightsForInitialTracePeriod = function _TraceProcessor_computeInsightsForInitialTracePeriod(parsedTrace, navigations, options) {
    // Determine bounds: Use the period before the first navigation if navigations exist, otherwise use the entire trace bounds.
    const bounds = navigations.length > 0 ?
        Helpers.Timing.traceWindowFromMicroSeconds(parsedTrace.Meta.traceBounds.min, navigations[0].ts) :
        parsedTrace.Meta.traceBounds;
    const context = {
        bounds,
        frameId: parsedTrace.Meta.mainFrameId,
        // No navigation or lantern context applies to this initial/no-navigation period.
    };
    __classPrivateFieldGet(this, _TraceProcessor_instances, "m", _TraceProcessor_computeInsightSet).call(this, parsedTrace, context, options);
}, _TraceProcessor_computeInsightsForNavigation = function _TraceProcessor_computeInsightsForNavigation(navigation, bounds, parsedTrace, traceEvents, options) {
    const frameId = navigation.args.frame;
    // Guaranteed by the filter in #computeInsights
    const navigationId = navigation.args.data?.navigationId;
    // The lantern sub-context is optional on InsightSetContext, so not setting it is OK.
    // This is also a hedge against an error inside Lantern resulting in breaking the entire performance panel.
    // Additionally, many trace fixtures are too old to be processed by Lantern.
    let lantern;
    try {
        options.logger?.start('insights:createLanternContext');
        lantern = __classPrivateFieldGet(this, _TraceProcessor_instances, "m", _TraceProcessor_createLanternContext).call(this, parsedTrace, traceEvents, frameId, navigationId, options);
    }
    catch (e) {
        // Handle Lantern errors gracefully
        // Don't allow an error in constructing the Lantern graphs to break the rest of the trace processor.
        // Log unexpected errors, but suppress anything that occurs from a trace being too old.
        // Otherwise tests using old fixtures become way too noisy.
        const expectedErrors = [
            'mainDocumentRequest not found',
            'missing metric scores for main frame',
            'missing metric: FCP',
            'missing metric: LCP',
            'No network requests found in trace',
            'Trace is too old',
        ];
        if (!(e instanceof Lantern.Core.LanternError)) {
            // If this wasn't a managed LanternError, the stack trace is likely needed for debugging.
            console.error(e);
        }
        else if (!expectedErrors.some(err => e.message === err)) {
            // To reduce noise from tests, only print errors that are not expected to occur because a trace is
            // too old (for which there is no single check).
            console.error(e);
        }
    }
    finally {
        options.logger?.end('insights:createLanternContext');
    }
    const context = {
        bounds,
        frameId,
        navigation,
        navigationId,
        lantern,
    };
    __classPrivateFieldGet(this, _TraceProcessor_instances, "m", _TraceProcessor_computeInsightSet).call(this, parsedTrace, context, options);
};
/**
 * Some Handlers need data provided by others. Dependencies of a handler handler are
 * declared in the `deps` field.
 * @returns A map from trace event handler name to trace event handler whose entries
 * iterate in such a way that each handler is visited after its dependencies.
 */
export function sortHandlers(traceHandlers) {
    const sortedMap = new Map();
    const visited = new Set();
    const visitHandler = (handlerName) => {
        if (sortedMap.has(handlerName)) {
            return;
        }
        if (visited.has(handlerName)) {
            let stackPath = '';
            for (const handler of visited) {
                if (stackPath || handler === handlerName) {
                    stackPath += `${handler}->`;
                }
            }
            stackPath += handlerName;
            throw new Error(`Found dependency cycle in trace event handlers: ${stackPath}`);
        }
        visited.add(handlerName);
        const handler = traceHandlers[handlerName];
        if (!handler) {
            return;
        }
        const deps = handler.deps?.();
        if (deps) {
            deps.forEach(visitHandler);
        }
        sortedMap.set(handlerName, handler);
    };
    for (const handlerName of Object.keys(traceHandlers)) {
        visitHandler(handlerName);
    }
    return sortedMap;
}
//# sourceMappingURL=Processor.js.map