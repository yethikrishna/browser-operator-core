// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _TimelineFrameModel_instances, _TimelineFrameModel_frames, _TimelineFrameModel_frameById, _TimelineFrameModel_beginFrameQueue, _TimelineFrameModel_lastFrame, _TimelineFrameModel_mainFrameCommitted, _TimelineFrameModel_mainFrameRequested, _TimelineFrameModel_lastLayerTree, _TimelineFrameModel_framePendingActivation, _TimelineFrameModel_framePendingCommit, _TimelineFrameModel_lastBeginFrame, _TimelineFrameModel_lastNeedsBeginFrame, _TimelineFrameModel_lastTaskBeginTime, _TimelineFrameModel_layerTreeId, _TimelineFrameModel_activeProcessId, _TimelineFrameModel_activeThreadId, _TimelineFrameModel_layerTreeData, _TimelineFrameModel_handleBeginFrame, _TimelineFrameModel_handleDroppedFrame, _TimelineFrameModel_handleDrawFrame, _TimelineFrameModel_handleActivateLayerTree, _TimelineFrameModel_handleRequestMainThreadFrame, _TimelineFrameModel_handleCommit, _TimelineFrameModel_handleLayerTreeSnapshot, _TimelineFrameModel_handleNeedFrameChanged, _TimelineFrameModel_startFrame, _TimelineFrameModel_flushFrame, _TimelineFrameModel_commitPendingFrame, _TimelineFrameModel_addTraceEvents, _TimelineFrameModel_addTraceEvent, _TimelineFrameModel_processCompositorEvents, _TimelineFrameModel_addMainThreadTraceEvent, _LayerPaintEvent_event, _LayerPaintEvent_snapshot;
import * as Platform from '../../../core/platform/platform.js';
import * as Helpers from '../helpers/helpers.js';
import * as Types from '../types/types.js';
import { data as auctionWorkletsData } from './AuctionWorkletsHandler.js';
import { data as layerTreeHandlerData } from './LayerTreeHandler.js';
import { data as metaHandlerData } from './MetaHandler.js';
import { data as rendererHandlerData } from './RendererHandler.js';
import * as Threads from './Threads.js';
/**
 * IMPORTANT: this handler is slightly different to the rest. This is because
 * it is an adaptation of the TimelineFrameModel that has been used in DevTools
 * for many years. Rather than re-implement all the logic from scratch, instead
 * this handler gathers up the events and instantitates the class in the
 * finalize() method. Once the class has parsed all events, it is used to then
 * return the array of frames.
 *
 * In time we expect to migrate this code to a more "typical" handler.
 */
const allEvents = [];
let model = null;
export function reset() {
    allEvents.length = 0;
}
export function handleEvent(event) {
    allEvents.push(event);
}
export async function finalize() {
    // Snapshot events can be emitted out of order, so we need to sort before
    // building the frames model.
    Helpers.Trace.sortTraceEventsInPlace(allEvents);
    const modelForTrace = new TimelineFrameModel(allEvents, rendererHandlerData(), auctionWorkletsData(), metaHandlerData(), layerTreeHandlerData());
    model = modelForTrace;
}
export function data() {
    return {
        frames: model ? Array.from(model.frames()) : [],
        framesById: model ? { ...model.framesById() } : {},
    };
}
export function deps() {
    return ['Meta', 'Renderer', 'AuctionWorklets', 'LayerTree'];
}
function isFrameEvent(event) {
    return (Types.Events.isSetLayerId(event) || Types.Events.isBeginFrame(event) || Types.Events.isDroppedFrame(event) ||
        Types.Events.isRequestMainThreadFrame(event) || Types.Events.isBeginMainThreadFrame(event) ||
        Types.Events.isNeedsBeginFrameChanged(event) ||
        // Note that "Commit" is the replacement for "CompositeLayers" so in a trace
        // we wouldn't expect to see a combination of these. All "new" trace
        // recordings use "Commit", but we can easily support "CompositeLayers" too
        // to not break older traces being imported.
        Types.Events.isCommit(event) || Types.Events.isCompositeLayers(event) ||
        Types.Events.isActivateLayerTree(event) || Types.Events.isDrawFrame(event));
}
function entryIsTopLevel(entry) {
    const devtoolsTimelineCategory = 'disabled-by-default-devtools.timeline';
    return entry.name === "RunTask" /* Types.Events.Name.RUN_TASK */ && entry.cat.includes(devtoolsTimelineCategory);
}
export class TimelineFrameModel {
    constructor(allEvents, rendererData, auctionWorkletsData, metaData, layerTreeData) {
        _TimelineFrameModel_instances.add(this);
        _TimelineFrameModel_frames.set(this, []);
        _TimelineFrameModel_frameById.set(this, {});
        _TimelineFrameModel_beginFrameQueue.set(this, new TimelineFrameBeginFrameQueue());
        _TimelineFrameModel_lastFrame.set(this, null);
        _TimelineFrameModel_mainFrameCommitted.set(this, false);
        _TimelineFrameModel_mainFrameRequested.set(this, false);
        _TimelineFrameModel_lastLayerTree.set(this, null);
        _TimelineFrameModel_framePendingActivation.set(this, null);
        _TimelineFrameModel_framePendingCommit.set(this, null);
        _TimelineFrameModel_lastBeginFrame.set(this, null);
        _TimelineFrameModel_lastNeedsBeginFrame.set(this, null);
        _TimelineFrameModel_lastTaskBeginTime.set(this, null);
        _TimelineFrameModel_layerTreeId.set(this, null);
        _TimelineFrameModel_activeProcessId.set(this, null);
        _TimelineFrameModel_activeThreadId.set(this, null);
        _TimelineFrameModel_layerTreeData.set(this, void 0);
        // We only care about getting threads from the Renderer, not Samples,
        // because Frames don't exist in a CPU Profile (which won't have Renderer
        // threads.)
        const mainThreads = Threads.threadsInRenderer(rendererData, auctionWorkletsData).filter(thread => {
            return thread.type === "MAIN_THREAD" /* Threads.ThreadType.MAIN_THREAD */ && thread.processIsOnMainFrame;
        });
        const threadData = mainThreads.map(thread => {
            return {
                tid: thread.tid,
                pid: thread.pid,
                startTime: thread.entries[0].ts,
            };
        });
        __classPrivateFieldSet(this, _TimelineFrameModel_layerTreeData, layerTreeData, "f");
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_addTraceEvents).call(this, allEvents, threadData, metaData.mainFrameId);
    }
    framesById() {
        return __classPrivateFieldGet(this, _TimelineFrameModel_frameById, "f");
    }
    frames() {
        return __classPrivateFieldGet(this, _TimelineFrameModel_frames, "f");
    }
}
_TimelineFrameModel_frames = new WeakMap(), _TimelineFrameModel_frameById = new WeakMap(), _TimelineFrameModel_beginFrameQueue = new WeakMap(), _TimelineFrameModel_lastFrame = new WeakMap(), _TimelineFrameModel_mainFrameCommitted = new WeakMap(), _TimelineFrameModel_mainFrameRequested = new WeakMap(), _TimelineFrameModel_lastLayerTree = new WeakMap(), _TimelineFrameModel_framePendingActivation = new WeakMap(), _TimelineFrameModel_framePendingCommit = new WeakMap(), _TimelineFrameModel_lastBeginFrame = new WeakMap(), _TimelineFrameModel_lastNeedsBeginFrame = new WeakMap(), _TimelineFrameModel_lastTaskBeginTime = new WeakMap(), _TimelineFrameModel_layerTreeId = new WeakMap(), _TimelineFrameModel_activeProcessId = new WeakMap(), _TimelineFrameModel_activeThreadId = new WeakMap(), _TimelineFrameModel_layerTreeData = new WeakMap(), _TimelineFrameModel_instances = new WeakSet(), _TimelineFrameModel_handleBeginFrame = function _TimelineFrameModel_handleBeginFrame(startTime, seqId) {
    if (!__classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f")) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_startFrame).call(this, startTime, seqId);
    }
    __classPrivateFieldSet(this, _TimelineFrameModel_lastBeginFrame, startTime, "f");
    __classPrivateFieldGet(this, _TimelineFrameModel_beginFrameQueue, "f").addFrameIfNotExists(seqId, startTime, false, false);
}, _TimelineFrameModel_handleDroppedFrame = function _TimelineFrameModel_handleDroppedFrame(startTime, seqId, isPartial) {
    if (!__classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f")) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_startFrame).call(this, startTime, seqId);
    }
    // This line handles the case where no BeginFrame event is issued for
    // the dropped frame. In this situation, add a BeginFrame to the queue
    // as if it actually occurred.
    __classPrivateFieldGet(this, _TimelineFrameModel_beginFrameQueue, "f").addFrameIfNotExists(seqId, startTime, true, isPartial);
    __classPrivateFieldGet(this, _TimelineFrameModel_beginFrameQueue, "f").setDropped(seqId, true);
    __classPrivateFieldGet(this, _TimelineFrameModel_beginFrameQueue, "f").setPartial(seqId, isPartial);
}, _TimelineFrameModel_handleDrawFrame = function _TimelineFrameModel_handleDrawFrame(startTime, seqId) {
    if (!__classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f")) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_startFrame).call(this, startTime, seqId);
        return;
    }
    // - if it wasn't drawn, it didn't happen!
    // - only show frames that either did not wait for the main thread frame or had one committed.
    if (__classPrivateFieldGet(this, _TimelineFrameModel_mainFrameCommitted, "f") || !__classPrivateFieldGet(this, _TimelineFrameModel_mainFrameRequested, "f")) {
        if (__classPrivateFieldGet(this, _TimelineFrameModel_lastNeedsBeginFrame, "f")) {
            const idleTimeEnd = __classPrivateFieldGet(this, _TimelineFrameModel_framePendingActivation, "f") ? __classPrivateFieldGet(this, _TimelineFrameModel_framePendingActivation, "f").triggerTime :
                (__classPrivateFieldGet(this, _TimelineFrameModel_lastBeginFrame, "f") || __classPrivateFieldGet(this, _TimelineFrameModel_lastNeedsBeginFrame, "f"));
            if (idleTimeEnd > __classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f").startTime) {
                __classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f").idle = true;
                __classPrivateFieldSet(this, _TimelineFrameModel_lastBeginFrame, null, "f");
            }
            __classPrivateFieldSet(this, _TimelineFrameModel_lastNeedsBeginFrame, null, "f");
        }
        const framesToVisualize = __classPrivateFieldGet(this, _TimelineFrameModel_beginFrameQueue, "f").processPendingBeginFramesOnDrawFrame(seqId);
        // Visualize the current frame and all pending frames before it.
        for (const frame of framesToVisualize) {
            const isLastFrameIdle = __classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f").idle;
            // If |frame| is the first frame after an idle period, the CPU time
            // will be logged ("committed") under |frame| if applicable.
            __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_startFrame).call(this, frame.startTime, seqId);
            if (isLastFrameIdle && __classPrivateFieldGet(this, _TimelineFrameModel_framePendingActivation, "f")) {
                __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_commitPendingFrame).call(this);
            }
            if (frame.isDropped) {
                __classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f").dropped = true;
            }
            if (frame.isPartial) {
                __classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f").isPartial = true;
            }
        }
    }
    __classPrivateFieldSet(this, _TimelineFrameModel_mainFrameCommitted, false, "f");
}, _TimelineFrameModel_handleActivateLayerTree = function _TimelineFrameModel_handleActivateLayerTree() {
    if (!__classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f")) {
        return;
    }
    if (__classPrivateFieldGet(this, _TimelineFrameModel_framePendingActivation, "f") && !__classPrivateFieldGet(this, _TimelineFrameModel_lastNeedsBeginFrame, "f")) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_commitPendingFrame).call(this);
    }
}, _TimelineFrameModel_handleRequestMainThreadFrame = function _TimelineFrameModel_handleRequestMainThreadFrame() {
    if (!__classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f")) {
        return;
    }
    __classPrivateFieldSet(this, _TimelineFrameModel_mainFrameRequested, true, "f");
}, _TimelineFrameModel_handleCommit = function _TimelineFrameModel_handleCommit() {
    if (!__classPrivateFieldGet(this, _TimelineFrameModel_framePendingCommit, "f")) {
        return;
    }
    __classPrivateFieldSet(this, _TimelineFrameModel_framePendingActivation, __classPrivateFieldGet(this, _TimelineFrameModel_framePendingCommit, "f"), "f");
    __classPrivateFieldSet(this, _TimelineFrameModel_framePendingCommit, null, "f");
    __classPrivateFieldSet(this, _TimelineFrameModel_mainFrameRequested, false, "f");
    __classPrivateFieldSet(this, _TimelineFrameModel_mainFrameCommitted, true, "f");
}, _TimelineFrameModel_handleLayerTreeSnapshot = function _TimelineFrameModel_handleLayerTreeSnapshot(layerTree) {
    __classPrivateFieldSet(this, _TimelineFrameModel_lastLayerTree, layerTree, "f");
}, _TimelineFrameModel_handleNeedFrameChanged = function _TimelineFrameModel_handleNeedFrameChanged(startTime, needsBeginFrame) {
    if (needsBeginFrame) {
        __classPrivateFieldSet(this, _TimelineFrameModel_lastNeedsBeginFrame, startTime, "f");
    }
}, _TimelineFrameModel_startFrame = function _TimelineFrameModel_startFrame(startTime, seqId) {
    if (__classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f")) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_flushFrame).call(this, __classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f"), startTime);
    }
    __classPrivateFieldSet(this, _TimelineFrameModel_lastFrame, new TimelineFrame(seqId, startTime, Types.Timing.Micro(startTime - metaHandlerData().traceBounds.min)), "f");
}, _TimelineFrameModel_flushFrame = function _TimelineFrameModel_flushFrame(frame, endTime) {
    frame.setLayerTree(__classPrivateFieldGet(this, _TimelineFrameModel_lastLayerTree, "f"));
    frame.setEndTime(endTime);
    if (__classPrivateFieldGet(this, _TimelineFrameModel_lastLayerTree, "f")) {
        __classPrivateFieldGet(this, _TimelineFrameModel_lastLayerTree, "f").paints = frame.paints;
    }
    const lastFrame = __classPrivateFieldGet(this, _TimelineFrameModel_frames, "f")[__classPrivateFieldGet(this, _TimelineFrameModel_frames, "f").length - 1];
    if (__classPrivateFieldGet(this, _TimelineFrameModel_frames, "f").length && lastFrame &&
        (frame.startTime !== lastFrame.endTime || frame.startTime > frame.endTime)) {
        console.assert(false, `Inconsistent frame time for frame ${__classPrivateFieldGet(this, _TimelineFrameModel_frames, "f").length} (${frame.startTime} - ${frame.endTime})`);
    }
    const newFramesLength = __classPrivateFieldGet(this, _TimelineFrameModel_frames, "f").push(frame);
    frame.setIndex(newFramesLength - 1);
    if (typeof frame.mainFrameId === 'number') {
        __classPrivateFieldGet(this, _TimelineFrameModel_frameById, "f")[frame.mainFrameId] = frame;
    }
}, _TimelineFrameModel_commitPendingFrame = function _TimelineFrameModel_commitPendingFrame() {
    if (!__classPrivateFieldGet(this, _TimelineFrameModel_framePendingActivation, "f") || !__classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f")) {
        return;
    }
    __classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f").paints = __classPrivateFieldGet(this, _TimelineFrameModel_framePendingActivation, "f").paints;
    __classPrivateFieldGet(this, _TimelineFrameModel_lastFrame, "f").mainFrameId = __classPrivateFieldGet(this, _TimelineFrameModel_framePendingActivation, "f").mainFrameId;
    __classPrivateFieldSet(this, _TimelineFrameModel_framePendingActivation, null, "f");
}, _TimelineFrameModel_addTraceEvents = function _TimelineFrameModel_addTraceEvents(events, threadData, mainFrameId) {
    let j = 0;
    __classPrivateFieldSet(this, _TimelineFrameModel_activeThreadId, threadData.length && threadData[0].tid || null, "f");
    __classPrivateFieldSet(this, _TimelineFrameModel_activeProcessId, threadData.length && threadData[0].pid || null, "f");
    for (let i = 0; i < events.length; ++i) {
        while (j + 1 < threadData.length && threadData[j + 1].startTime <= events[i].ts) {
            __classPrivateFieldSet(this, _TimelineFrameModel_activeThreadId, threadData[++j].tid, "f");
            __classPrivateFieldSet(this, _TimelineFrameModel_activeProcessId, threadData[j].pid, "f");
        }
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_addTraceEvent).call(this, events[i], mainFrameId);
    }
    __classPrivateFieldSet(this, _TimelineFrameModel_activeThreadId, null, "f");
    __classPrivateFieldSet(this, _TimelineFrameModel_activeProcessId, null, "f");
}, _TimelineFrameModel_addTraceEvent = function _TimelineFrameModel_addTraceEvent(event, mainFrameId) {
    if (Types.Events.isSetLayerId(event) && event.args.data.frame === mainFrameId) {
        __classPrivateFieldSet(this, _TimelineFrameModel_layerTreeId, event.args.data.layerTreeId, "f");
    }
    else if (Types.Events.isLayerTreeHostImplSnapshot(event) && Number(event.id) === __classPrivateFieldGet(this, _TimelineFrameModel_layerTreeId, "f")) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_handleLayerTreeSnapshot).call(this, {
            entry: event,
            paints: [],
        });
    }
    else {
        if (isFrameEvent(event)) {
            __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_processCompositorEvents).call(this, event);
        }
        // Make sure we only use events from the main thread: we check the PID as
        // well in case two processes have a thread with the same TID.
        if (event.tid === __classPrivateFieldGet(this, _TimelineFrameModel_activeThreadId, "f") && event.pid === __classPrivateFieldGet(this, _TimelineFrameModel_activeProcessId, "f")) {
            __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_addMainThreadTraceEvent).call(this, event);
        }
    }
}, _TimelineFrameModel_processCompositorEvents = function _TimelineFrameModel_processCompositorEvents(entry) {
    if (entry.args['layerTreeId'] !== __classPrivateFieldGet(this, _TimelineFrameModel_layerTreeId, "f")) {
        return;
    }
    if (Types.Events.isBeginFrame(entry)) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_handleBeginFrame).call(this, entry.ts, entry.args['frameSeqId']);
    }
    else if (Types.Events.isDrawFrame(entry)) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_handleDrawFrame).call(this, entry.ts, entry.args['frameSeqId']);
    }
    else if (Types.Events.isActivateLayerTree(entry)) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_handleActivateLayerTree).call(this);
    }
    else if (Types.Events.isRequestMainThreadFrame(entry)) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_handleRequestMainThreadFrame).call(this);
    }
    else if (Types.Events.isNeedsBeginFrameChanged(entry)) {
        // needsBeginFrame property will either be 0 or 1, which represents
        // true/false in this case, hence the Boolean() wrapper.
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_handleNeedFrameChanged).call(this, entry.ts, entry.args['data'] && Boolean(entry.args['data']['needsBeginFrame']));
    }
    else if (Types.Events.isDroppedFrame(entry)) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_handleDroppedFrame).call(this, entry.ts, entry.args['frameSeqId'], Boolean(entry.args['hasPartialUpdate']));
    }
}, _TimelineFrameModel_addMainThreadTraceEvent = function _TimelineFrameModel_addMainThreadTraceEvent(entry) {
    if (entryIsTopLevel(entry)) {
        __classPrivateFieldSet(this, _TimelineFrameModel_lastTaskBeginTime, entry.ts, "f");
    }
    if (!__classPrivateFieldGet(this, _TimelineFrameModel_framePendingCommit, "f") && MAIN_FRAME_MARKERS.has(entry.name)) {
        __classPrivateFieldSet(this, _TimelineFrameModel_framePendingCommit, new PendingFrame(__classPrivateFieldGet(this, _TimelineFrameModel_lastTaskBeginTime, "f") || entry.ts), "f");
    }
    if (!__classPrivateFieldGet(this, _TimelineFrameModel_framePendingCommit, "f")) {
        return;
    }
    if (Types.Events.isBeginMainThreadFrame(entry) && entry.args.data.frameId) {
        __classPrivateFieldGet(this, _TimelineFrameModel_framePendingCommit, "f").mainFrameId = entry.args.data.frameId;
    }
    if (Types.Events.isPaint(entry)) {
        const snapshot = __classPrivateFieldGet(this, _TimelineFrameModel_layerTreeData, "f").paintsToSnapshots.get(entry);
        if (snapshot) {
            __classPrivateFieldGet(this, _TimelineFrameModel_framePendingCommit, "f").paints.push(new LayerPaintEvent(entry, snapshot));
        }
    }
    // Commit will be replacing CompositeLayers but CompositeLayers is kept
    // around for backwards compatibility.
    if ((Types.Events.isCompositeLayers(entry) || Types.Events.isCommit(entry)) &&
        entry.args['layerTreeId'] === __classPrivateFieldGet(this, _TimelineFrameModel_layerTreeId, "f")) {
        __classPrivateFieldGet(this, _TimelineFrameModel_instances, "m", _TimelineFrameModel_handleCommit).call(this);
    }
};
const MAIN_FRAME_MARKERS = new Set([
    "ScheduleStyleRecalculation" /* Types.Events.Name.SCHEDULE_STYLE_RECALCULATION */,
    "InvalidateLayout" /* Types.Events.Name.INVALIDATE_LAYOUT */,
    "BeginMainThreadFrame" /* Types.Events.Name.BEGIN_MAIN_THREAD_FRAME */,
    "ScrollLayer" /* Types.Events.Name.SCROLL_LAYER */,
]);
/**
 * Legacy class that represents TimelineFrames that was ported from the old SDK.
 * This class is purposefully not exported as it breaks the abstraction that
 * every event shown on the timeline is a trace event. Instead, we use the Type
 * LegacyTimelineFrame to represent frames in the codebase. These do implement
 * the right interface to be treated just like they were a trace event.
 */
class TimelineFrame {
    constructor(seqId, startTime, startTimeOffset) {
        // These fields exist to satisfy the base Event type which all
        // "trace events" must implement. They aren't used, but doing this means we
        // can pass `TimelineFrame` instances into places that expect
        // Types.Events.Event.
        this.cat = 'devtools.legacy_frame';
        this.name = 'frame';
        this.ph = "X" /* Types.Events.Phase.COMPLETE */;
        this.pid = Types.Events.ProcessID(-1);
        this.tid = Types.Events.ThreadID(-1);
        this.index = -1;
        this.seqId = seqId;
        this.startTime = startTime;
        this.ts = startTime;
        this.startTimeOffset = startTimeOffset;
        this.endTime = this.startTime;
        this.duration = Types.Timing.Micro(0);
        this.idle = false;
        this.dropped = false;
        this.isPartial = false;
        this.layerTree = null;
        this.paints = [];
        this.mainFrameId = undefined;
    }
    setIndex(i) {
        this.index = i;
    }
    setEndTime(endTime) {
        this.endTime = endTime;
        this.duration = Types.Timing.Micro(this.endTime - this.startTime);
    }
    setLayerTree(layerTree) {
        this.layerTree = layerTree;
    }
    /**
     * Fake the `dur` field to meet the expected value given that we pretend
     * these TimelineFrame classes are trace events across the codebase.
     */
    get dur() {
        return this.duration;
    }
}
export class LayerPaintEvent {
    constructor(event, snapshot) {
        _LayerPaintEvent_event.set(this, void 0);
        _LayerPaintEvent_snapshot.set(this, void 0);
        __classPrivateFieldSet(this, _LayerPaintEvent_event, event, "f");
        __classPrivateFieldSet(this, _LayerPaintEvent_snapshot, snapshot, "f");
    }
    layerId() {
        return __classPrivateFieldGet(this, _LayerPaintEvent_event, "f").args.data.layerId;
    }
    event() {
        return __classPrivateFieldGet(this, _LayerPaintEvent_event, "f");
    }
    picture() {
        const rect = __classPrivateFieldGet(this, _LayerPaintEvent_snapshot, "f").args.snapshot.params?.layer_rect;
        const pictureData = __classPrivateFieldGet(this, _LayerPaintEvent_snapshot, "f").args.snapshot.skp64;
        return rect && pictureData ? { rect, serializedPicture: pictureData } : null;
    }
}
_LayerPaintEvent_event = new WeakMap(), _LayerPaintEvent_snapshot = new WeakMap();
export class PendingFrame {
    constructor(triggerTime) {
        this.paints = [];
        this.mainFrameId = undefined;
        this.triggerTime = triggerTime;
    }
}
// The parameters of an impl-side BeginFrame.
class BeginFrameInfo {
    constructor(seqId, startTime, isDropped, isPartial) {
        this.seqId = seqId;
        this.startTime = startTime;
        this.isDropped = isDropped;
        this.isPartial = isPartial;
    }
}
// A queue of BeginFrames pending visualization.
// BeginFrames are added into this queue as they occur; later when their
// corresponding DrawFrames occur (or lack thereof), the BeginFrames are removed
// from the queue and their timestamps are used for visualization.
export class TimelineFrameBeginFrameQueue {
    constructor() {
        this.queueFrames = [];
        // Maps frameSeqId to BeginFrameInfo.
        this.mapFrames = {};
    }
    // Add a BeginFrame to the queue, if it does not already exit.
    addFrameIfNotExists(seqId, startTime, isDropped, isPartial) {
        if (!(seqId in this.mapFrames)) {
            this.mapFrames[seqId] = new BeginFrameInfo(seqId, startTime, isDropped, isPartial);
            this.queueFrames.push(seqId);
        }
    }
    // Set a BeginFrame in queue as dropped.
    setDropped(seqId, isDropped) {
        if (seqId in this.mapFrames) {
            this.mapFrames[seqId].isDropped = isDropped;
        }
    }
    setPartial(seqId, isPartial) {
        if (seqId in this.mapFrames) {
            this.mapFrames[seqId].isPartial = isPartial;
        }
    }
    processPendingBeginFramesOnDrawFrame(seqId) {
        const framesToVisualize = [];
        // Do not visualize this frame in the rare case where the current DrawFrame
        // does not have a corresponding BeginFrame.
        if (seqId in this.mapFrames) {
            // Pop all BeginFrames before the current frame, and add only the dropped
            // ones in |frames_to_visualize|.
            // Non-dropped frames popped here are BeginFrames that are never
            // drawn (but not considered dropped either for some reason).
            // Those frames do not require an proactive visualization effort and will
            // be naturally presented as continuationss of other frames.
            while (this.queueFrames[0] !== seqId) {
                const currentSeqId = this.queueFrames[0];
                if (this.mapFrames[currentSeqId].isDropped) {
                    framesToVisualize.push(this.mapFrames[currentSeqId]);
                }
                delete this.mapFrames[currentSeqId];
                this.queueFrames.shift();
            }
            // Pop the BeginFrame associated with the current DrawFrame.
            framesToVisualize.push(this.mapFrames[seqId]);
            delete this.mapFrames[seqId];
            this.queueFrames.shift();
        }
        return framesToVisualize;
    }
}
export function framesWithinWindow(frames, startTime, endTime) {
    const firstFrame = Platform.ArrayUtilities.lowerBound(frames, startTime || 0, (time, frame) => time - frame.endTime);
    const lastFrame = Platform.ArrayUtilities.lowerBound(frames, endTime || Infinity, (time, frame) => time - frame.startTime);
    return frames.slice(firstFrame, lastFrame);
}
//# sourceMappingURL=FramesHandler.js.map