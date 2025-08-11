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
var _SamplesIntegrator_instances, _a, _SamplesIntegrator_constructedProfileCalls, _SamplesIntegrator_currentJSStack, _SamplesIntegrator_processId, _SamplesIntegrator_threadId, _SamplesIntegrator_lockedJsStackDepth, _SamplesIntegrator_fakeJSInvocation, _SamplesIntegrator_profileModel, _SamplesIntegrator_nodeForGC, _SamplesIntegrator_engineConfig, _SamplesIntegrator_profileId, _SamplesIntegrator_onTraceEventStart, _SamplesIntegrator_onProfileCall, _SamplesIntegrator_onTraceEventEnd, _SamplesIntegrator_makeProfileCallsForStack, _SamplesIntegrator_getStackForSampleTraceId, _SamplesIntegrator_extractStackTrace, _SamplesIntegrator_truncateJSStack, _SamplesIntegrator_makeJSSampleEvent;
import * as Types from '../types/types.js';
import { milliToMicro } from './Timing.js';
import { extractSampleTraceId, makeProfileCall, mergeEventsInOrder, sortTraceEventsInPlace } from './Trace.js';
/**
 * This is a helper that integrates CPU profiling data coming in the
 * shape of samples, with trace events. Samples indicate what the JS
 * stack trace looked at a given point in time, but they don't have
 * duration. The SamplesIntegrator task is to make an approximation
 * of what the duration of each JS call was, given the sample data and
 * given the trace events profiled during that time. At the end of its
 * execution, the SamplesIntegrator returns an array of ProfileCalls
 * (under SamplesIntegrator::buildProfileCalls()), which
 * represent JS calls, with a call frame and duration. These calls have
 * the shape of a complete trace events and can be treated as flame
 * chart entries in the timeline.
 *
 * The approach to build the profile calls consists in tracking the
 * current stack as the following events happen (in order):
 * 1. A sample was done.
 * 2. A trace event started.
 * 3. A trace event ended.
 * Depending on the event and on the data that's coming with it the
 * stack is updated by adding or removing JS calls to it and updating
 * the duration of the calls in the tracking stack.
 *
 * note: Although this approach has been implemented since long ago, and
 * is relatively efficient (adds a complexity over the trace parsing of
 * O(n) where n is the number of samples) it has proven to be faulty.
 * It might be worthwhile experimenting with improvements or with a
 * completely different approach. Improving the approach is tracked in
 * crbug.com/1417439
 */
export class SamplesIntegrator {
    constructor(profileModel, profileId, pid, tid, configuration) {
        _SamplesIntegrator_instances.add(this);
        /**
         * The result of running the samples integrator. Holds the JS calls
         * with their approximated duration after integrating samples into the
         * trace event tree.
         */
        _SamplesIntegrator_constructedProfileCalls.set(this, []);
        /**
         * tracks the state of the JS stack at each point in time to update
         * the profile call durations as new events arrive. This doesn't only
         * happen with new profile calls (in which case we would compare the
         * stack in them) but also with trace events (in which case we would
         * update the duration of the events we are tracking at the moment).
         */
        _SamplesIntegrator_currentJSStack.set(this, []);
        /**
         * Process holding the CPU profile and trace events.
         */
        _SamplesIntegrator_processId.set(this, void 0);
        /**
         * Thread holding the CPU profile and trace events.
         */
        _SamplesIntegrator_threadId.set(this, void 0);
        /**
         * Tracks the depth of the JS stack at the moment a trace event starts
         * or ends. It is assumed that for the duration of a trace event, the
         * JS stack's depth cannot decrease, since JS calls that started
         * before a trace event cannot end during the trace event. So as trace
         * events arrive, we store the "locked" amount of JS frames that were
         * in the stack before the event came.
         */
        _SamplesIntegrator_lockedJsStackDepth.set(this, []);
        /**
         * Used to keep track when samples should be integrated even if they
         * are not children of invocation trace events. This is useful in
         * cases where we can be missing the start of JS invocation events if
         * we start tracing half-way through.
         */
        _SamplesIntegrator_fakeJSInvocation.set(this, false);
        /**
         * The parsed CPU profile, holding the tree hierarchy of JS frames and
         * the sample data.
         */
        _SamplesIntegrator_profileModel.set(this, void 0);
        /**
         * Because GC nodes don't have a stack, we artificially add a stack to
         * them which corresponds to that of the previous sample. This map
         * tracks which node is used for the stack of a GC call.
         * Note that GC samples are not shown in the flamechart, however they
         * are used during the construction of for profile calls, as we can
         * infer information about the duration of the executed code when a
         * GC node is sampled.
         */
        _SamplesIntegrator_nodeForGC.set(this, new Map());
        _SamplesIntegrator_engineConfig.set(this, void 0);
        _SamplesIntegrator_profileId.set(this, void 0);
        /**
         * Keeps track of the individual samples from the CPU Profile.
         * Only used with Debug Mode experiment enabled.
         */
        this.jsSampleEvents = [];
        __classPrivateFieldSet(this, _SamplesIntegrator_profileModel, profileModel, "f");
        __classPrivateFieldSet(this, _SamplesIntegrator_threadId, tid, "f");
        __classPrivateFieldSet(this, _SamplesIntegrator_processId, pid, "f");
        __classPrivateFieldSet(this, _SamplesIntegrator_engineConfig, configuration || Types.Configuration.defaults(), "f");
        __classPrivateFieldSet(this, _SamplesIntegrator_profileId, profileId, "f");
    }
    buildProfileCalls(traceEvents) {
        const mergedEvents = mergeEventsInOrder(traceEvents, this.callsFromProfileSamples());
        const stack = [];
        for (let i = 0; i < mergedEvents.length; i++) {
            const event = mergedEvents[i];
            // Because instant trace events have no duration, they don't provide
            // useful information for possible changes in the duration of calls
            // in the JS stack.
            if (event.ph === "I" /* Types.Events.Phase.INSTANT */ && !extractSampleTraceId(event)) {
                continue;
            }
            if (stack.length === 0) {
                if (Types.Events.isProfileCall(event)) {
                    __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_onProfileCall).call(this, event);
                    continue;
                }
                stack.push(event);
                __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_onTraceEventStart).call(this, event);
                continue;
            }
            const parentEvent = stack.at(-1);
            if (parentEvent === undefined) {
                continue;
            }
            const begin = event.ts;
            const parentBegin = parentEvent.ts;
            const parentDuration = parentEvent.dur || 0;
            const parentEnd = parentBegin + parentDuration;
            const startsAfterParent = begin >= parentEnd;
            if (startsAfterParent) {
                __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_onTraceEventEnd).call(this, parentEvent);
                stack.pop();
                i--;
                continue;
            }
            if (Types.Events.isProfileCall(event)) {
                __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_onProfileCall).call(this, event, parentEvent);
                continue;
            }
            __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_onTraceEventStart).call(this, event);
            stack.push(event);
        }
        while (stack.length) {
            const last = stack.pop();
            if (last) {
                __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_onTraceEventEnd).call(this, last);
            }
        }
        sortTraceEventsInPlace(this.jsSampleEvents);
        return __classPrivateFieldGet(this, _SamplesIntegrator_constructedProfileCalls, "f");
    }
    /**
     * Builds the initial calls with no duration from samples. Their
     * purpose is to be merged with the trace event array being parsed so
     * that they can be traversed in order with them and their duration
     * can be updated as the SampleIntegrator callbacks are invoked.
     */
    callsFromProfileSamples() {
        const samples = __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").samples;
        const timestamps = __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").timestamps;
        if (!samples) {
            return [];
        }
        const calls = [];
        let prevNode;
        for (let i = 0; i < samples.length; i++) {
            const node = __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").nodeByIndex(i);
            const timestamp = milliToMicro(Types.Timing.Milli(timestamps[i]));
            if (!node) {
                continue;
            }
            const call = makeProfileCall(node, __classPrivateFieldGet(this, _SamplesIntegrator_profileId, "f"), i, timestamp, __classPrivateFieldGet(this, _SamplesIntegrator_processId, "f"), __classPrivateFieldGet(this, _SamplesIntegrator_threadId, "f"));
            calls.push(call);
            if (__classPrivateFieldGet(this, _SamplesIntegrator_engineConfig, "f").debugMode) {
                const traceId = __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").traceIds?.[i];
                this.jsSampleEvents.push(__classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_makeJSSampleEvent).call(this, call, timestamp, traceId));
            }
            if (node.id === __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").gcNode?.id && prevNode) {
                // GC samples have no stack, so we just put GC node on top of the
                // last recorded sample. Cache the previous sample for future
                // reference.
                __classPrivateFieldGet(this, _SamplesIntegrator_nodeForGC, "f").set(call, prevNode);
                continue;
            }
            prevNode = node;
        }
        return calls;
    }
    static framesAreEqual(frame1, frame2) {
        return frame1.scriptId === frame2.scriptId && frame1.functionName === frame2.functionName &&
            frame1.lineNumber === frame2.lineNumber;
    }
    static showNativeName(name, runtimeCallStatsEnabled) {
        return runtimeCallStatsEnabled && Boolean(_a.nativeGroup(name));
    }
    static nativeGroup(nativeName) {
        if (nativeName.startsWith('Parse')) {
            return "Parse" /* SamplesIntegrator.NativeGroups.PARSE */;
        }
        if (nativeName.startsWith('Compile') || nativeName.startsWith('Recompile')) {
            return "Compile" /* SamplesIntegrator.NativeGroups.COMPILE */;
        }
        return null;
    }
    static isNativeRuntimeFrame(frame) {
        return frame.url === 'native V8Runtime';
    }
    static filterStackFrames(stack, engineConfig) {
        const showAllEvents = engineConfig.showAllEvents;
        if (showAllEvents) {
            return;
        }
        let previousNativeFrameName = null;
        let j = 0;
        for (let i = 0; i < stack.length; ++i) {
            const frame = stack[i].callFrame;
            const nativeRuntimeFrame = _a.isNativeRuntimeFrame(frame);
            if (nativeRuntimeFrame &&
                !_a.showNativeName(frame.functionName, engineConfig.includeRuntimeCallStats)) {
                continue;
            }
            const nativeFrameName = nativeRuntimeFrame ? _a.nativeGroup(frame.functionName) : null;
            if (previousNativeFrameName && previousNativeFrameName === nativeFrameName) {
                continue;
            }
            previousNativeFrameName = nativeFrameName;
            stack[j++] = stack[i];
        }
        stack.length = j;
    }
    static createFakeTraceFromCpuProfile(profile, tid) {
        if (!profile) {
            return { traceEvents: [], metadata: {} };
        }
        // The |Name.CPU_PROFILE| will let MetaHandler to set |traceIsGeneric| to false
        // The start time and duration is important here because we'll use them to determine the traceBounds
        // We use the start and end time of the profile (which is longer than all samples), so the Performance
        // panel won't truncate this time period.
        const cpuProfileEvent = {
            cat: 'disabled-by-default-devtools.timeline',
            name: "CpuProfile" /* Types.Events.Name.CPU_PROFILE */,
            ph: "X" /* Types.Events.Phase.COMPLETE */,
            pid: Types.Events.ProcessID(1),
            tid,
            ts: Types.Timing.Micro(profile.startTime),
            dur: Types.Timing.Micro(profile.endTime - profile.startTime),
            args: { data: { cpuProfile: profile } },
            // Create an arbitrary profile id.
            id: '0x1',
        };
        return {
            traceEvents: [cpuProfileEvent],
            metadata: {
                dataOrigin: "CPUProfile" /* Types.File.DataOrigin.CPU_PROFILE */,
            }
        };
    }
}
_a = SamplesIntegrator, _SamplesIntegrator_constructedProfileCalls = new WeakMap(), _SamplesIntegrator_currentJSStack = new WeakMap(), _SamplesIntegrator_processId = new WeakMap(), _SamplesIntegrator_threadId = new WeakMap(), _SamplesIntegrator_lockedJsStackDepth = new WeakMap(), _SamplesIntegrator_fakeJSInvocation = new WeakMap(), _SamplesIntegrator_profileModel = new WeakMap(), _SamplesIntegrator_nodeForGC = new WeakMap(), _SamplesIntegrator_engineConfig = new WeakMap(), _SamplesIntegrator_profileId = new WeakMap(), _SamplesIntegrator_instances = new WeakSet(), _SamplesIntegrator_onTraceEventStart = function _SamplesIntegrator_onTraceEventStart(event) {
    // Top level events cannot be nested into JS frames so we reset
    // the stack when we find one.
    if (event.name === "RunMicrotasks" /* Types.Events.Name.RUN_MICROTASKS */ || event.name === "RunTask" /* Types.Events.Name.RUN_TASK */) {
        __classPrivateFieldSet(this, _SamplesIntegrator_lockedJsStackDepth, [], "f");
        __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_truncateJSStack).call(this, 0, event.ts);
        __classPrivateFieldSet(this, _SamplesIntegrator_fakeJSInvocation, false, "f");
    }
    if (__classPrivateFieldGet(this, _SamplesIntegrator_fakeJSInvocation, "f")) {
        __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_truncateJSStack).call(this, __classPrivateFieldGet(this, _SamplesIntegrator_lockedJsStackDepth, "f").pop() || 0, event.ts);
        __classPrivateFieldSet(this, _SamplesIntegrator_fakeJSInvocation, false, "f");
    }
    __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_extractStackTrace).call(this, event);
    // Keep track of the call frames in the stack before the event
    // happened. For the duration of this event, these frames cannot
    // change (none can be terminated before this event finishes).
    //
    // Also, every frame that is opened after this event, is considered
    // to be a descendant of the event. So once the event finishes, the
    // frames that were opened after it, need to be closed (see
    // onEndEvent).
    //
    // TODO(crbug.com/1417439):
    // The assumption that every frame opened after an event is a
    // descendant of the event is incorrect. For example, a JS call that
    // parents a trace event might have been sampled after the event was
    // dispatched. In this case the JS call would be discarded if this
    // event isn't an invocation event, otherwise the call will be
    // considered a child of the event. In both cases, the result would
    // be incorrect.
    __classPrivateFieldGet(this, _SamplesIntegrator_lockedJsStackDepth, "f").push(__classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f").length);
}, _SamplesIntegrator_onProfileCall = function _SamplesIntegrator_onProfileCall(event, parent) {
    if ((parent && Types.Events.isJSInvocationEvent(parent)) || __classPrivateFieldGet(this, _SamplesIntegrator_fakeJSInvocation, "f")) {
        __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_extractStackTrace).call(this, event);
    }
    else if (Types.Events.isProfileCall(event) && __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f").length === 0) {
        // Force JS Samples to show up even if we are not inside a JS
        // invocation event, because we can be missing the start of JS
        // invocation events if we start tracing half-way through. Pretend
        // we have a top-level JS invocation event.
        __classPrivateFieldSet(this, _SamplesIntegrator_fakeJSInvocation, true, "f");
        const stackDepthBefore = __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f").length;
        __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_extractStackTrace).call(this, event);
        __classPrivateFieldGet(this, _SamplesIntegrator_lockedJsStackDepth, "f").push(stackDepthBefore);
    }
}, _SamplesIntegrator_onTraceEventEnd = function _SamplesIntegrator_onTraceEventEnd(event) {
    // Because the event has ended, any frames that happened after
    // this event are terminated. Frames that are ancestors to this
    // event are extended to cover its ending.
    const endTime = Types.Timing.Micro(event.ts + (event.dur ?? 0));
    __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_truncateJSStack).call(this, __classPrivateFieldGet(this, _SamplesIntegrator_lockedJsStackDepth, "f").pop() || 0, endTime);
}, _SamplesIntegrator_makeProfileCallsForStack = function _SamplesIntegrator_makeProfileCallsForStack(profileCall, overrideTimeStamp) {
    let node = __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").nodeById(profileCall.nodeId);
    const isGarbageCollection = node?.id === __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").gcNode?.id;
    if (isGarbageCollection) {
        // Because GC don't have a stack, we use the stack of the previous
        // sample.
        node = __classPrivateFieldGet(this, _SamplesIntegrator_nodeForGC, "f").get(profileCall) || null;
    }
    if (!node) {
        return [];
    }
    // `node.depth` is 0 based, so to set the size of the array we need
    // to add 1 to its value.
    const callFrames = new Array(node.depth + 1 + Number(isGarbageCollection));
    // Add the stack trace in reverse order (bottom first).
    let i = callFrames.length - 1;
    if (isGarbageCollection) {
        // Place the garbage collection call frame on top of the stack.
        callFrames[i--] = profileCall;
    }
    // Many of these ProfileCalls will be GC'd later when we estimate the frame
    // durations
    while (node) {
        callFrames[i--] = makeProfileCall(node, profileCall.profileId, profileCall.sampleIndex, overrideTimeStamp ?? profileCall.ts, __classPrivateFieldGet(this, _SamplesIntegrator_processId, "f"), __classPrivateFieldGet(this, _SamplesIntegrator_threadId, "f"));
        node = node.parent;
    }
    return callFrames;
}, _SamplesIntegrator_getStackForSampleTraceId = function _SamplesIntegrator_getStackForSampleTraceId(traceId, timestamp) {
    const nodeId = __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").traceIds?.[traceId];
    const node = nodeId && __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").nodeById(nodeId);
    const maybeCallForTraceId = node && makeProfileCall(node, __classPrivateFieldGet(this, _SamplesIntegrator_profileId, "f"), -1, timestamp, __classPrivateFieldGet(this, _SamplesIntegrator_processId, "f"), __classPrivateFieldGet(this, _SamplesIntegrator_threadId, "f"));
    if (!maybeCallForTraceId) {
        return null;
    }
    if (__classPrivateFieldGet(this, _SamplesIntegrator_engineConfig, "f").debugMode) {
        this.jsSampleEvents.push(__classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_makeJSSampleEvent).call(this, maybeCallForTraceId, timestamp, traceId));
    }
    return __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_makeProfileCallsForStack).call(this, maybeCallForTraceId);
}, _SamplesIntegrator_extractStackTrace = function _SamplesIntegrator_extractStackTrace(event) {
    let stackTrace = __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f");
    if (Types.Events.isProfileCall(event)) {
        stackTrace = __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_makeProfileCallsForStack).call(this, event);
    }
    const traceId = extractSampleTraceId(event);
    const maybeCallForTraceId = traceId && __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_getStackForSampleTraceId).call(this, traceId, event.ts);
    if (maybeCallForTraceId) {
        stackTrace = maybeCallForTraceId;
    }
    _a.filterStackFrames(stackTrace, __classPrivateFieldGet(this, _SamplesIntegrator_engineConfig, "f"));
    const endTime = event.ts + (event.dur || 0);
    const minFrames = Math.min(stackTrace.length, __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f").length);
    let i;
    // Merge a sample's stack frames with the stack frames we have
    // so far if we detect they are equivalent.
    // Graphically
    // This:
    // Current stack trace       Sample
    // [-------A------]          [A]
    // [-------B------]          [B]
    // [-------C------]          [C]
    //                ^ t = x1    ^ t = x2
    // Becomes this:
    // New stack trace after merge
    // [--------A-------]
    // [--------B-------]
    // [--------C-------]
    //                  ^ t = x2
    for (i = __classPrivateFieldGet(this, _SamplesIntegrator_lockedJsStackDepth, "f").at(-1) || 0; i < minFrames; ++i) {
        const newFrame = stackTrace[i].callFrame;
        const oldFrame = __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f")[i].callFrame;
        if (!_a.framesAreEqual(newFrame, oldFrame)) {
            break;
        }
        // Scoot the right edge of this callFrame to the right
        __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f")[i].dur =
            Types.Timing.Micro(Math.max(__classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f")[i].dur || 0, endTime - __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f")[i].ts));
    }
    // If there are call frames in the sample that differ with the stack
    // we have, update the stack, but keeping the common frames in place
    // Graphically
    // This:
    // Current stack trace       Sample
    // [-------A------]          [A]
    // [-------B------]          [B]
    // [-------C------]          [C]
    // [-------D------]          [E]
    //                ^ t = x1    ^ t = x2
    // Becomes this:
    // New stack trace after merge
    // [--------A-------]
    // [--------B-------]
    // [--------C-------]
    //                [E]
    //                  ^ t = x2
    __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_truncateJSStack).call(this, i, event.ts);
    for (; i < stackTrace.length; ++i) {
        const call = stackTrace[i];
        if (call.nodeId === __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").programNode?.id || call.nodeId === __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").root?.id ||
            call.nodeId === __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").idleNode?.id || call.nodeId === __classPrivateFieldGet(this, _SamplesIntegrator_profileModel, "f").gcNode?.id) {
            // Skip (root), (program) and (idle) frames, since this are not
            // relevant for web profiling and we don't want to show them in
            // the timeline.
            continue;
        }
        __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f").push(call);
        __classPrivateFieldGet(this, _SamplesIntegrator_constructedProfileCalls, "f").push(call);
    }
}, _SamplesIntegrator_truncateJSStack = function _SamplesIntegrator_truncateJSStack(depth, time) {
    if (__classPrivateFieldGet(this, _SamplesIntegrator_lockedJsStackDepth, "f").length) {
        const lockedDepth = __classPrivateFieldGet(this, _SamplesIntegrator_lockedJsStackDepth, "f").at(-1);
        if (lockedDepth && depth < lockedDepth) {
            console.error(`Child stack is shallower (${depth}) than the parent stack (${lockedDepth}) at ${time}`);
            depth = lockedDepth;
        }
    }
    if (__classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f").length < depth) {
        console.error(`Trying to truncate higher than the current stack size at ${time}`);
        depth = __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f").length;
    }
    for (let k = 0; k < __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f").length; ++k) {
        __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f")[k].dur = Types.Timing.Micro(Math.max(time - __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f")[k].ts, 0));
    }
    __classPrivateFieldGet(this, _SamplesIntegrator_currentJSStack, "f").length = depth;
}, _SamplesIntegrator_makeJSSampleEvent = function _SamplesIntegrator_makeJSSampleEvent(call, timestamp, traceId) {
    const JSSampleEvent = {
        name: "JSSample" /* Types.Events.Name.JS_SAMPLE */,
        cat: 'devtools.timeline',
        args: {
            data: { traceId, stackTrace: __classPrivateFieldGet(this, _SamplesIntegrator_instances, "m", _SamplesIntegrator_makeProfileCallsForStack).call(this, call).map(e => e.callFrame) },
        },
        ph: "I" /* Types.Events.Phase.INSTANT */,
        ts: timestamp,
        dur: Types.Timing.Micro(0),
        pid: __classPrivateFieldGet(this, _SamplesIntegrator_processId, "f"),
        tid: __classPrivateFieldGet(this, _SamplesIntegrator_threadId, "f"),
    };
    return JSSampleEvent;
};
(function (SamplesIntegrator) {
    let NativeGroups;
    (function (NativeGroups) {
        NativeGroups["COMPILE"] = "Compile";
        NativeGroups["PARSE"] = "Parse";
    })(NativeGroups = SamplesIntegrator.NativeGroups || (SamplesIntegrator.NativeGroups = {}));
})(SamplesIntegrator || (SamplesIntegrator = {}));
//# sourceMappingURL=SamplesIntegrator.js.map