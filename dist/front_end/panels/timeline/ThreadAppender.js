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
var _ThreadAppender_instances, _ThreadAppender_colorGenerator, _ThreadAppender_compatibilityBuilder, _ThreadAppender_parsedTrace, _ThreadAppender_entries, _ThreadAppender_tree, _ThreadAppender_processId, _ThreadAppender_threadId, _ThreadAppender_threadDefaultName, _ThreadAppender_expanded, _ThreadAppender_headerAppended, _ThreadAppender_showAllEventsEnabled, _ThreadAppender_url, _ThreadAppender_headerNestingLevel, _ThreadAppender_ensureTrackHeaderAppended, _ThreadAppender_appendTrackHeaderAtLevel, _ThreadAppender_visualLoggingNameForThread, _ThreadAppender_appendGroupedTrackHeaderAndTitle, _ThreadAppender_buildNameForAuctionWorklet, _ThreadAppender_buildNameForWorker, _ThreadAppender_appendTreeAtLevel, _ThreadAppender_appendNodesAtLevel, _ThreadAppender_appendEntryAtLevel, _ThreadAppender_addDecorationsToEntry;
// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as Root from '../../core/root/root.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Bindings from '../../models/bindings/bindings.js';
import * as Trace from '../../models/trace/trace.js';
import * as PerfUI from '../../ui/legacy/components/perf_ui/perf_ui.js';
import { addDecorationToEvent, buildGroupStyle, buildTrackHeader, getDurationString, } from './AppenderUtils.js';
import { entryIsVisibleInTimeline, } from './CompatibilityTracksAppender.js';
import * as ModificationsManager from './ModificationsManager.js';
import * as Utils from './utils/utils.js';
const UIStrings = {
    /**
     * @description Text shown for an entry in the flame chart that is ignored because it matches
     * a predefined ignore list.
     * @example {/analytics\.js$} rule
     */
    onIgnoreList: 'On ignore list ({rule})',
    /**
     * @description Refers to the "Main frame", meaning the top level frame. See https://www.w3.org/TR/html401/present/frames.html
     * @example{example.com} PH1
     */
    mainS: 'Main — {PH1}',
    /**
     * @description Refers to the main thread of execution of a program. See https://developer.mozilla.org/en-US/docs/Glossary/Main_thread
     */
    main: 'Main',
    /**
     * @description Refers to any frame in the page. See https://www.w3.org/TR/html401/present/frames.html
     * @example {https://example.com} PH1
     */
    frameS: 'Frame — {PH1}',
    /**
     *@description A web worker in the page. See https://developer.mozilla.org/en-US/docs/Web/API/Worker
     *@example {https://google.com} PH1
     */
    workerS: '`Worker` — {PH1}',
    /**
     *@description A web worker in the page. See https://developer.mozilla.org/en-US/docs/Web/API/Worker
     *@example {FormatterWorker} PH1
     *@example {https://google.com} PH2
     */
    workerSS: '`Worker`: {PH1} — {PH2}',
    /**
     *@description Label for a web worker exclusively allocated for a purpose.
     */
    dedicatedWorker: 'Dedicated `Worker`',
    /**
     *@description A generic name given for a thread running in the browser (sequence of programmed instructions).
     * The placeholder is an enumeration given to the thread.
     *@example {1} PH1
     */
    threadS: 'Thread {PH1}',
    /**
     *@description Rasterization in computer graphics.
     */
    raster: 'Raster',
    /**
     *@description Threads used for background tasks.
     */
    threadPool: 'Thread pool',
    /**
     *@description Name for a thread that rasterizes graphics in a website.
     *@example {2} PH1
     */
    rasterizerThreadS: 'Rasterizer thread {PH1}',
    /**
     *@description Text in Timeline Flame Chart Data Provider of the Performance panel
     *@example {2} PH1
     */
    threadPoolThreadS: 'Thread pool worker {PH1}',
    /**
     *@description Title of a bidder auction worklet with known URL in the timeline flame chart of the Performance panel
     *@example {https://google.com} PH1
     */
    bidderWorkletS: 'Bidder Worklet — {PH1}',
    /**
     *@description Title of a bidder auction worklet in the timeline flame chart of the Performance panel with an unknown URL
     */
    bidderWorklet: 'Bidder Worklet',
    /**
     *@description Title of a seller auction worklet in the timeline flame chart of the Performance panel with an unknown URL
     */
    sellerWorklet: 'Seller Worklet',
    /**
     *@description Title of an auction worklet in the timeline flame chart of the Performance panel with an unknown URL
     */
    unknownWorklet: 'Auction Worklet',
    /**
     *@description Title of control thread of a service process for an auction worklet in the timeline flame chart of the Performance panel with an unknown URL
     */
    workletService: 'Auction Worklet service',
    /**
     *@description Title of a seller auction worklet with known URL in the timeline flame chart of the Performance panel
     *@example {https://google.com} PH1
     */
    sellerWorkletS: 'Seller Worklet — {PH1}',
    /**
     *@description Title of an auction worklet with known URL in the timeline flame chart of the Performance panel
     *@example {https://google.com} PH1
     */
    unknownWorkletS: 'Auction Worklet — {PH1}',
    /**
     *@description Title of control thread of a service process for an auction worklet with known URL in the timeline flame chart of the Performance panel
     * @example {https://google.com} PH1
     */
    workletServiceS: 'Auction Worklet service — {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/ThreadAppender.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
// This appender is only triggered when the Renderer handler is run. At
// the moment this only happens in the basic component server example.
// In the future, once this appender fully supports the behaviour of the
// old engine's thread/sync tracks we can always run it by enabling the
// Renderer and Samples handler by default.
export class ThreadAppender {
    constructor(compatibilityBuilder, parsedTrace, processId, threadId, threadName, type, entries, tree) {
        _ThreadAppender_instances.add(this);
        this.appenderName = 'Thread';
        _ThreadAppender_colorGenerator.set(this, void 0);
        _ThreadAppender_compatibilityBuilder.set(this, void 0);
        _ThreadAppender_parsedTrace.set(this, void 0);
        _ThreadAppender_entries.set(this, []);
        _ThreadAppender_tree.set(this, void 0);
        _ThreadAppender_processId.set(this, void 0);
        _ThreadAppender_threadId.set(this, void 0);
        _ThreadAppender_threadDefaultName.set(this, void 0);
        _ThreadAppender_expanded.set(this, false);
        _ThreadAppender_headerAppended.set(this, false);
        this.threadType = "MAIN_THREAD" /* Trace.Handlers.Threads.ThreadType.MAIN_THREAD */;
        _ThreadAppender_showAllEventsEnabled.set(this, Root.Runtime.experiments.isEnabled('timeline-show-all-events'));
        _ThreadAppender_url.set(this, '');
        _ThreadAppender_headerNestingLevel.set(this, null);
        __classPrivateFieldSet(this, _ThreadAppender_compatibilityBuilder, compatibilityBuilder, "f");
        // TODO(crbug.com/1456706):
        // The values for this color generator have been taken from the old
        // engine to keep the colors the same after the migration. This
        // generator is used here to create colors for js frames (profile
        // calls) in the flamechart by hashing the script's url. We might
        // need to reconsider this generator when migrating to GM3 colors.
        __classPrivateFieldSet(this, _ThreadAppender_colorGenerator, new Common.Color.Generator({ min: 30, max: 330, count: undefined }, { min: 50, max: 80, count: 3 }, 85), "f");
        // Add a default color for call frames with no url.
        __classPrivateFieldGet(this, _ThreadAppender_colorGenerator, "f").setColorForID('', '#f2ecdc');
        __classPrivateFieldSet(this, _ThreadAppender_parsedTrace, parsedTrace, "f");
        __classPrivateFieldSet(this, _ThreadAppender_processId, processId, "f");
        __classPrivateFieldSet(this, _ThreadAppender_threadId, threadId, "f");
        if (!entries || !tree) {
            throw new Error(`Could not find data for thread with id ${threadId} in process with id ${processId}`);
        }
        __classPrivateFieldSet(this, _ThreadAppender_entries, entries, "f");
        __classPrivateFieldSet(this, _ThreadAppender_tree, tree, "f");
        __classPrivateFieldSet(this, _ThreadAppender_threadDefaultName, threadName || i18nString(UIStrings.threadS, { PH1: threadId }), "f");
        this.isOnMainFrame = Boolean(__classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").Renderer?.processes.get(processId)?.isOnMainFrame);
        this.threadType = type;
        // AuctionWorklets are threads, so we re-use this appender rather than
        // duplicate it, but we change the name because we want to render these
        // lower down than other threads.
        if (__classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").AuctionWorklets.worklets.has(processId)) {
            this.appenderName = 'Thread_AuctionWorklet';
        }
        __classPrivateFieldSet(this, _ThreadAppender_url, __classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").Renderer?.processes.get(__classPrivateFieldGet(this, _ThreadAppender_processId, "f"))?.url || '', "f");
    }
    processId() {
        return __classPrivateFieldGet(this, _ThreadAppender_processId, "f");
    }
    threadId() {
        return __classPrivateFieldGet(this, _ThreadAppender_threadId, "f");
    }
    /**
     * Appends into the flame chart data the data corresponding to the
     * this thread.
     * @param trackStartLevel the horizontal level of the flame chart events where
     * the track's events will start being appended.
     * @param expanded wether the track should be rendered expanded.
     * @returns the first available level to append more data after having
     * appended the track's events.
     */
    appendTrackAtLevel(trackStartLevel, expanded = false) {
        if (__classPrivateFieldGet(this, _ThreadAppender_entries, "f").length === 0) {
            return trackStartLevel;
        }
        __classPrivateFieldSet(this, _ThreadAppender_expanded, expanded, "f");
        return __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_appendTreeAtLevel).call(this, trackStartLevel);
    }
    setHeaderNestingLevel(level) {
        __classPrivateFieldSet(this, _ThreadAppender_headerNestingLevel, level, "f");
    }
    setHeaderAppended(headerAppended) {
        __classPrivateFieldSet(this, _ThreadAppender_headerAppended, headerAppended, "f");
    }
    headerAppended() {
        return __classPrivateFieldGet(this, _ThreadAppender_headerAppended, "f");
    }
    trackName() {
        let threadTypeLabel = null;
        switch (this.threadType) {
            case "MAIN_THREAD" /* Trace.Handlers.Threads.ThreadType.MAIN_THREAD */:
                threadTypeLabel = this.isOnMainFrame ? i18nString(UIStrings.mainS, { PH1: __classPrivateFieldGet(this, _ThreadAppender_url, "f") }) :
                    i18nString(UIStrings.frameS, { PH1: __classPrivateFieldGet(this, _ThreadAppender_url, "f") });
                break;
            case "CPU_PROFILE" /* Trace.Handlers.Threads.ThreadType.CPU_PROFILE */:
                threadTypeLabel = i18nString(UIStrings.main);
                break;
            case "WORKER" /* Trace.Handlers.Threads.ThreadType.WORKER */:
                threadTypeLabel = __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_buildNameForWorker).call(this);
                break;
            case "RASTERIZER" /* Trace.Handlers.Threads.ThreadType.RASTERIZER */:
                threadTypeLabel = i18nString(UIStrings.raster);
                break;
            case "THREAD_POOL" /* Trace.Handlers.Threads.ThreadType.THREAD_POOL */:
                threadTypeLabel = i18nString(UIStrings.threadPool);
                break;
            case "OTHER" /* Trace.Handlers.Threads.ThreadType.OTHER */:
                break;
            case "AUCTION_WORKLET" /* Trace.Handlers.Threads.ThreadType.AUCTION_WORKLET */:
                threadTypeLabel = __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_buildNameForAuctionWorklet).call(this);
                break;
            default:
                return Platform.assertNever(this.threadType, `Unknown thread type: ${this.threadType}`);
        }
        let suffix = '';
        if (__classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").Meta.traceIsGeneric) {
            suffix = suffix + ` (${this.threadId()})`;
        }
        return (threadTypeLabel || __classPrivateFieldGet(this, _ThreadAppender_threadDefaultName, "f")) + suffix;
    }
    getUrl() {
        return __classPrivateFieldGet(this, _ThreadAppender_url, "f");
    }
    getEntries() {
        return __classPrivateFieldGet(this, _ThreadAppender_entries, "f");
    }
    /*
      ------------------------------------------------------------------------------------
       The following methods  are invoked by the flame chart renderer to query features about
       events on rendering.
      ------------------------------------------------------------------------------------
    */
    /**
     * Gets the color an event added by this appender should be rendered with.
     */
    colorForEvent(event) {
        if (__classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").Meta.traceIsGeneric) {
            return event.name ? `hsl(${Platform.StringUtilities.hashCode(event.name) % 300 + 30}, 40%, 70%)` : '#ccc';
        }
        if (Trace.Types.Events.isProfileCall(event)) {
            if (event.callFrame.functionName === '(idle)') {
                return Utils.EntryStyles.getCategoryStyles().idle.getComputedColorValue();
            }
            if (event.callFrame.functionName === '(program)') {
                return Utils.EntryStyles.getCategoryStyles().other.getComputedColorValue();
            }
            if (event.callFrame.scriptId === '0') {
                // If we can not match this frame to a script, return the
                // generic "scripting" color.
                return Utils.EntryStyles.getCategoryStyles().scripting.getComputedColorValue();
            }
            // Otherwise, return a color created based on its URL.
            return __classPrivateFieldGet(this, _ThreadAppender_colorGenerator, "f").colorForID(event.callFrame.url);
        }
        const defaultColor = Utils.EntryStyles.getEventStyle(event.name)?.category.getComputedColorValue();
        return defaultColor || Utils.EntryStyles.getCategoryStyles().other.getComputedColorValue();
    }
    /**
     * Gets the title an event added by this appender should be rendered with.
     */
    titleForEvent(entry) {
        if (Utils.IgnoreList.isIgnoreListedEntry(entry)) {
            const rule = Utils.IgnoreList.getIgnoredReasonString(entry);
            return i18nString(UIStrings.onIgnoreList, { rule });
        }
        return Utils.EntryName.nameForEntry(entry, __classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f"));
    }
    setPopoverInfo(event, info) {
        if (Trace.Types.Events.isParseHTML(event)) {
            const startLine = event.args['beginData']['startLine'];
            const endLine = event.args['endData']?.['endLine'];
            const eventURL = event.args['beginData']['url'];
            const url = Bindings.ResourceUtils.displayNameForURL(eventURL);
            const range = (endLine !== -1 || endLine === startLine) ? `${startLine}...${endLine}` : startLine;
            info.title += ` - ${url} [${range}]`;
        }
        const selfTime = __classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").Renderer.entryToNode.get(event)?.selfTime;
        info.formattedTime = getDurationString(event.dur, selfTime);
    }
}
_ThreadAppender_colorGenerator = new WeakMap(), _ThreadAppender_compatibilityBuilder = new WeakMap(), _ThreadAppender_parsedTrace = new WeakMap(), _ThreadAppender_entries = new WeakMap(), _ThreadAppender_tree = new WeakMap(), _ThreadAppender_processId = new WeakMap(), _ThreadAppender_threadId = new WeakMap(), _ThreadAppender_threadDefaultName = new WeakMap(), _ThreadAppender_expanded = new WeakMap(), _ThreadAppender_headerAppended = new WeakMap(), _ThreadAppender_showAllEventsEnabled = new WeakMap(), _ThreadAppender_url = new WeakMap(), _ThreadAppender_headerNestingLevel = new WeakMap(), _ThreadAppender_instances = new WeakSet(), _ThreadAppender_ensureTrackHeaderAppended = function _ThreadAppender_ensureTrackHeaderAppended(trackStartLevel) {
    if (__classPrivateFieldGet(this, _ThreadAppender_headerAppended, "f")) {
        return;
    }
    if (this.threadType === "RASTERIZER" /* Trace.Handlers.Threads.ThreadType.RASTERIZER */ ||
        this.threadType === "THREAD_POOL" /* Trace.Handlers.Threads.ThreadType.THREAD_POOL */) {
        __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_appendGroupedTrackHeaderAndTitle).call(this, trackStartLevel, this.threadType);
    }
    else {
        __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_appendTrackHeaderAtLevel).call(this, trackStartLevel);
    }
    __classPrivateFieldSet(this, _ThreadAppender_headerAppended, true, "f");
}, _ThreadAppender_appendTrackHeaderAtLevel = function _ThreadAppender_appendTrackHeaderAtLevel(currentLevel) {
    const trackIsCollapsible = __classPrivateFieldGet(this, _ThreadAppender_entries, "f").length > 0;
    const style = buildGroupStyle({ shareHeaderLine: false, collapsible: trackIsCollapsible });
    if (__classPrivateFieldGet(this, _ThreadAppender_headerNestingLevel, "f") !== null) {
        style.nestingLevel = __classPrivateFieldGet(this, _ThreadAppender_headerNestingLevel, "f");
    }
    const visualLoggingName = __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_visualLoggingNameForThread).call(this);
    const group = buildTrackHeader(visualLoggingName, currentLevel, this.trackName(), style, /* selectable= */ true, __classPrivateFieldGet(this, _ThreadAppender_expanded, "f"), 
    /* showStackContextMenu= */ true);
    __classPrivateFieldGet(this, _ThreadAppender_compatibilityBuilder, "f").registerTrackForGroup(group, this);
}, _ThreadAppender_visualLoggingNameForThread = function _ThreadAppender_visualLoggingNameForThread() {
    switch (this.threadType) {
        case "MAIN_THREAD" /* Trace.Handlers.Threads.ThreadType.MAIN_THREAD */:
            return this.isOnMainFrame ? "thread.main" /* VisualLoggingTrackName.THREAD_MAIN */ : "thread.frame" /* VisualLoggingTrackName.THREAD_FRAME */;
        case "WORKER" /* Trace.Handlers.Threads.ThreadType.WORKER */:
            return "thread.worker" /* VisualLoggingTrackName.THREAD_WORKER */;
        case "RASTERIZER" /* Trace.Handlers.Threads.ThreadType.RASTERIZER */:
            return "thread.rasterizer" /* VisualLoggingTrackName.THREAD_RASTERIZER */;
        case "AUCTION_WORKLET" /* Trace.Handlers.Threads.ThreadType.AUCTION_WORKLET */:
            return "thread.auction-worklet" /* VisualLoggingTrackName.THREAD_AUCTION_WORKLET */;
        case "OTHER" /* Trace.Handlers.Threads.ThreadType.OTHER */:
            return "thread.other" /* VisualLoggingTrackName.THREAD_OTHER */;
        case "CPU_PROFILE" /* Trace.Handlers.Threads.ThreadType.CPU_PROFILE */:
            return "thread.cpu-profile" /* VisualLoggingTrackName.THREAD_CPU_PROFILE */;
        case "THREAD_POOL" /* Trace.Handlers.Threads.ThreadType.THREAD_POOL */:
            return "thread.pool" /* VisualLoggingTrackName.THREAD_POOL */;
        default:
            return null;
    }
}, _ThreadAppender_appendGroupedTrackHeaderAndTitle = function _ThreadAppender_appendGroupedTrackHeaderAndTitle(trackStartLevel, threadType) {
    const currentTrackCount = __classPrivateFieldGet(this, _ThreadAppender_compatibilityBuilder, "f").getCurrentTrackCountForThreadType(threadType);
    if (currentTrackCount === 0) {
        const trackIsCollapsible = __classPrivateFieldGet(this, _ThreadAppender_entries, "f").length > 0;
        const headerStyle = buildGroupStyle({ shareHeaderLine: false, collapsible: trackIsCollapsible });
        // Don't set any jslogcontext (first argument) because this is a shared
        // header group. Each child will have its context set.
        const headerGroup = buildTrackHeader(null, trackStartLevel, this.trackName(), headerStyle, /* selectable= */ false, __classPrivateFieldGet(this, _ThreadAppender_expanded, "f"));
        __classPrivateFieldGet(this, _ThreadAppender_compatibilityBuilder, "f").getFlameChartTimelineData().groups.push(headerGroup);
    }
    // Nesting is set to 1 because the track is appended inside the
    // header for all raster threads.
    const titleStyle = buildGroupStyle({ padding: 2, nestingLevel: 1, collapsible: false });
    const rasterizerTitle = this.threadType === "RASTERIZER" /* Trace.Handlers.Threads.ThreadType.RASTERIZER */ ?
        i18nString(UIStrings.rasterizerThreadS, { PH1: currentTrackCount + 1 }) :
        i18nString(UIStrings.threadPoolThreadS, { PH1: currentTrackCount + 1 });
    const visualLoggingName = __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_visualLoggingNameForThread).call(this);
    const titleGroup = buildTrackHeader(visualLoggingName, trackStartLevel, rasterizerTitle, titleStyle, /* selectable= */ true, __classPrivateFieldGet(this, _ThreadAppender_expanded, "f"));
    __classPrivateFieldGet(this, _ThreadAppender_compatibilityBuilder, "f").registerTrackForGroup(titleGroup, this);
}, _ThreadAppender_buildNameForAuctionWorklet = function _ThreadAppender_buildNameForAuctionWorklet() {
    const workletMetadataEvent = __classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").AuctionWorklets.worklets.get(__classPrivateFieldGet(this, _ThreadAppender_processId, "f"));
    // We should always have this event - if we do not, we were instantiated with invalid data.
    if (!workletMetadataEvent) {
        return i18nString(UIStrings.unknownWorklet);
    }
    // Host could be empty - in which case we do not want to add it.
    const host = workletMetadataEvent.host ? `https://${workletMetadataEvent.host}` : '';
    const shouldAddHost = host.length > 0;
    // For each Auction Worklet in a page there are two threads we care about on the same process.
    // 1. The "Worklet Service" which is a generic helper service. This thread
    // is always named "auction_worklet.CrUtilityMain".
    //
    // 2. The "Seller/Bidder" service. This thread is always named
    // "AuctionV8HelperThread". The AuctionWorkets handler does the job of
    // figuring this out for us - the metadata event it provides for each
    // worklet process will have a `type` already set.
    //
    // Therefore, for this given thread, which we know is part of
    // an AuctionWorklet process, we need to figure out if this thread is the
    // generic service, or a seller/bidder worklet.
    //
    // Note that the worklet could also have the "unknown" type - this is not
    // expected but implemented to prevent trace event changes causing DevTools
    // to break with unknown worklet types.
    const isUtilityThread = workletMetadataEvent.args.data.utilityThread.tid === __classPrivateFieldGet(this, _ThreadAppender_threadId, "f");
    const isBidderOrSeller = workletMetadataEvent.args.data.v8HelperThread.tid === __classPrivateFieldGet(this, _ThreadAppender_threadId, "f");
    if (isUtilityThread) {
        return shouldAddHost ? i18nString(UIStrings.workletServiceS, { PH1: host }) : i18nString(UIStrings.workletService);
    }
    if (isBidderOrSeller) {
        switch (workletMetadataEvent.type) {
            case "seller" /* Trace.Types.Events.AuctionWorkletType.SELLER */:
                return shouldAddHost ? i18nString(UIStrings.sellerWorkletS, { PH1: host }) :
                    i18nString(UIStrings.sellerWorklet);
            case "bidder" /* Trace.Types.Events.AuctionWorkletType.BIDDER */:
                return shouldAddHost ? i18nString(UIStrings.bidderWorkletS, { PH1: host }) :
                    i18nString(UIStrings.bidderWorklet);
            case "unknown" /* Trace.Types.Events.AuctionWorkletType.UNKNOWN */:
                return shouldAddHost ? i18nString(UIStrings.unknownWorkletS, { PH1: host }) :
                    i18nString(UIStrings.unknownWorklet);
            default:
                Platform.assertNever(workletMetadataEvent.type, `Unexpected Auction Worklet Type ${workletMetadataEvent.type}`);
        }
    }
    // We should never reach here, but just in case!
    return shouldAddHost ? i18nString(UIStrings.unknownWorkletS, { PH1: host }) : i18nString(UIStrings.unknownWorklet);
}, _ThreadAppender_buildNameForWorker = function _ThreadAppender_buildNameForWorker() {
    const url = __classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").Renderer?.processes.get(__classPrivateFieldGet(this, _ThreadAppender_processId, "f"))?.url || '';
    const workerId = __classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").Workers.workerIdByThread.get(__classPrivateFieldGet(this, _ThreadAppender_threadId, "f"));
    const workerURL = workerId ? __classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").Workers.workerURLById.get(workerId) : url;
    // Try to create a name using the worker url if present. If not, use a generic label.
    let workerName = workerURL ? i18nString(UIStrings.workerS, { PH1: workerURL }) : i18nString(UIStrings.dedicatedWorker);
    const workerTarget = workerId !== undefined && SDK.TargetManager.TargetManager.instance().targetById(workerId);
    if (workerTarget) {
        // Get the worker name from the target, which corresponds to the name
        // assigned to the worker when it was constructed.
        workerName = i18nString(UIStrings.workerSS, { PH1: workerTarget.name(), PH2: url });
    }
    return workerName;
}, _ThreadAppender_appendTreeAtLevel = function _ThreadAppender_appendTreeAtLevel(trackStartLevel) {
    // We can not used the tree maxDepth in the tree from the
    // RendererHandler because ignore listing and visibility of events
    // alter the final depth of the flame chart.
    return __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_appendNodesAtLevel).call(this, __classPrivateFieldGet(this, _ThreadAppender_tree, "f").roots, trackStartLevel);
}, _ThreadAppender_appendNodesAtLevel = function _ThreadAppender_appendNodesAtLevel(nodes, startingLevel, parentIsIgnoredListed = false) {
    const invisibleEntries = ModificationsManager.ModificationsManager.activeManager()?.getEntriesFilter().invisibleEntries() ?? [];
    let maxDepthInTree = startingLevel;
    for (const node of nodes) {
        let nextLevel = startingLevel;
        const entry = node.entry;
        const entryIsIgnoreListed = Utils.IgnoreList.isIgnoreListedEntry(entry);
        // Events' visibility is determined from their predefined styles,
        // which is something that's not available in the engine data.
        // Thus it needs to be checked in the appenders, but preemptively
        // checking if there are visible events and returning early if not
        // is potentially expensive since, in theory, we would be adding
        // another traversal to the entries array (which could grow
        // large). To avoid the extra cost we  add the check in the
        // traversal we already need to append events.
        const entryIsVisible = !invisibleEntries.includes(entry) &&
            (entryIsVisibleInTimeline(entry, __classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f")) || __classPrivateFieldGet(this, _ThreadAppender_showAllEventsEnabled, "f"));
        // For ignore listing support, these two conditions need to be met
        // to not append a profile call to the flame chart:
        // 1. It is ignore listed
        // 2. It is NOT the bottom-most call in an ignore listed stack (a
        //    set of chained profile calls that belong to ignore listed
        //    URLs).
        // This means that all of the ignore listed calls are ignored (not
        // appended), except if it is the bottom call of an ignored stack.
        // This is becaue to represent ignore listed stack frames, we add
        // a flame chart entry with the length and position of the bottom
        // frame, which is distictively marked to denote an ignored listed
        // stack.
        const skipEventDueToIgnoreListing = entryIsIgnoreListed && parentIsIgnoredListed;
        if (entryIsVisible && !skipEventDueToIgnoreListing) {
            __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_appendEntryAtLevel).call(this, entry, startingLevel);
            nextLevel++;
        }
        const depthInChildTree = __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_appendNodesAtLevel).call(this, node.children, nextLevel, entryIsIgnoreListed);
        maxDepthInTree = Math.max(depthInChildTree, maxDepthInTree);
    }
    return maxDepthInTree;
}, _ThreadAppender_appendEntryAtLevel = function _ThreadAppender_appendEntryAtLevel(entry, level) {
    __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_ensureTrackHeaderAppended).call(this, level);
    const index = __classPrivateFieldGet(this, _ThreadAppender_compatibilityBuilder, "f").appendEventAtLevel(entry, level, this);
    __classPrivateFieldGet(this, _ThreadAppender_instances, "m", _ThreadAppender_addDecorationsToEntry).call(this, entry, index);
}, _ThreadAppender_addDecorationsToEntry = function _ThreadAppender_addDecorationsToEntry(entry, index) {
    const flameChartData = __classPrivateFieldGet(this, _ThreadAppender_compatibilityBuilder, "f").getFlameChartTimelineData();
    if (ModificationsManager.ModificationsManager.activeManager()?.getEntriesFilter().isEntryExpandable(entry)) {
        addDecorationToEvent(flameChartData, index, { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ });
    }
    const warnings = __classPrivateFieldGet(this, _ThreadAppender_parsedTrace, "f").Warnings.perEvent.get(entry);
    if (!warnings) {
        return;
    }
    addDecorationToEvent(flameChartData, index, { type: "WARNING_TRIANGLE" /* PerfUI.FlameChart.FlameChartDecorationType.WARNING_TRIANGLE */ });
    if (!warnings.includes('LONG_TASK')) {
        return;
    }
    addDecorationToEvent(flameChartData, index, {
        type: "CANDY" /* PerfUI.FlameChart.FlameChartDecorationType.CANDY */,
        startAtTime: Trace.Handlers.ModelHandlers.Warnings.LONG_MAIN_THREAD_TASK_THRESHOLD,
    });
};
//# sourceMappingURL=ThreadAppender.js.map