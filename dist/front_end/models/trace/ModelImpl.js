// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _Model_instances, _Model_traces, _Model_nextNumberByDomain, _Model_recordingsAvailable, _Model_lastRecordingIndex, _Model_processor, _Model_config, _Model_storeParsedFileData;
import * as Platform from '../../core/platform/platform.js';
import * as Handlers from './handlers/handlers.js';
import * as Helpers from './helpers/helpers.js';
import { TraceParseProgressEvent, TraceProcessor } from './Processor.js';
import * as Types from './types/types.js';
/**
 * The Model is responsible for parsing arrays of raw trace events and storing the
 * resulting data. It can store multiple traces at once, and can return the data for
 * any of them.
 *
 * Most uses of this class should be through `createWithAllHandlers`, but
 * `createWithSubsetOfHandlers` can be used to run just some handlers.
 **/
export class Model extends EventTarget {
    static createWithAllHandlers(config) {
        return new Model(Handlers.ModelHandlers, config);
    }
    /**
     * Runs only the provided handlers.
     *
     * Callers must ensure they are providing all dependant handlers (although Meta is included automatically),
     * and must know that the result of `.parsedTrace` will be limited to the handlers provided, even though
     * the type won't reflect that.
     */
    static createWithSubsetOfHandlers(traceHandlers, config) {
        return new Model(traceHandlers, config);
    }
    constructor(handlers, config) {
        super();
        _Model_instances.add(this);
        _Model_traces.set(this, []);
        _Model_nextNumberByDomain.set(this, new Map());
        _Model_recordingsAvailable.set(this, []);
        _Model_lastRecordingIndex.set(this, 0);
        _Model_processor.set(this, void 0);
        _Model_config.set(this, Types.Configuration.defaults());
        if (config) {
            __classPrivateFieldSet(this, _Model_config, config, "f");
        }
        __classPrivateFieldSet(this, _Model_processor, new TraceProcessor(handlers, __classPrivateFieldGet(this, _Model_config, "f")), "f");
    }
    /**
     * Parses an array of trace events into a structured object containing all the
     * information parsed by the trace handlers.
     * You can `await` this function to pause execution until parsing is complete,
     * or instead rely on the `ModuleUpdateEvent` that is dispatched when the
     * parsing is finished.
     *
     * Once parsed, you then have to call the `parsedTrace` method, providing an
     * index of the trace you want to have the data for. This is because any model
     * can store a number of traces. Each trace is given an index, which starts at 0
     * and increments by one as a new trace is parsed.
     *
     * @example
     * // Awaiting the parse method() to block until parsing complete
     * await this.traceModel.parse(events);
     * const data = this.traceModel.parsedTrace(0)
     *
     * @example
     * // Using an event listener to be notified when tracing is complete.
     * this.traceModel.addEventListener(Trace.ModelUpdateEvent.eventName, (event) => {
     *   if(event.data.data === 'done') {
     *     // trace complete
     *     const data = this.traceModel.parsedTrace(0);
     *   }
     * });
     * void this.traceModel.parse(events);
     **/
    async parse(traceEvents, config) {
        const metadata = config?.metadata || {};
        const isFreshRecording = config?.isFreshRecording || false;
        const isCPUProfile = metadata?.dataOrigin === "CPUProfile" /* Types.File.DataOrigin.CPU_PROFILE */;
        // During parsing, periodically update any listeners on each processors'
        // progress (if they have any updates).
        const onTraceUpdate = (event) => {
            const { data } = event;
            this.dispatchEvent(new ModelUpdateEvent({ type: "PROGRESS_UPDATE" /* ModelUpdateType.PROGRESS_UPDATE */, data }));
        };
        __classPrivateFieldGet(this, _Model_processor, "f").addEventListener(TraceParseProgressEvent.eventName, onTraceUpdate);
        // Create a parsed trace file.  It will be populated with data from the processor.
        const file = {
            traceEvents,
            metadata,
            parsedTrace: null,
            traceInsights: null,
            syntheticEventsManager: Helpers.SyntheticEvents.SyntheticEventsManager.createAndActivate(traceEvents),
        };
        try {
            // Wait for all outstanding promises before finishing the async execution,
            // but perform all tasks in parallel.
            await __classPrivateFieldGet(this, _Model_processor, "f").parse(traceEvents, {
                isFreshRecording,
                isCPUProfile,
                metadata,
                resolveSourceMap: config?.resolveSourceMap,
            });
            __classPrivateFieldGet(this, _Model_instances, "m", _Model_storeParsedFileData).call(this, file, __classPrivateFieldGet(this, _Model_processor, "f").parsedTrace, __classPrivateFieldGet(this, _Model_processor, "f").insights);
            // We only push the file onto this.#traces here once we know it's valid
            // and there's been no errors in the parsing.
            __classPrivateFieldGet(this, _Model_traces, "f").push(file);
        }
        catch (e) {
            throw e;
        }
        finally {
            // All processors have finished parsing, no more updates are expected.
            __classPrivateFieldGet(this, _Model_processor, "f").removeEventListener(TraceParseProgressEvent.eventName, onTraceUpdate);
            // Finally, update any listeners that all processors are 'done'.
            this.dispatchEvent(new ModelUpdateEvent({ type: "COMPLETE" /* ModelUpdateType.COMPLETE */, data: 'done' }));
        }
    }
    lastTraceIndex() {
        return this.size() - 1;
    }
    /**
     * Returns the parsed trace data indexed by the order in which it was stored.
     * If no index is given, the last stored parsed data is returned.
     */
    parsedTrace(index = __classPrivateFieldGet(this, _Model_traces, "f").length - 1) {
        return __classPrivateFieldGet(this, _Model_traces, "f").at(index)?.parsedTrace ?? null;
    }
    traceInsights(index = __classPrivateFieldGet(this, _Model_traces, "f").length - 1) {
        return __classPrivateFieldGet(this, _Model_traces, "f").at(index)?.traceInsights ?? null;
    }
    metadata(index = __classPrivateFieldGet(this, _Model_traces, "f").length - 1) {
        return __classPrivateFieldGet(this, _Model_traces, "f").at(index)?.metadata ?? null;
    }
    overrideModifications(index, newModifications) {
        if (__classPrivateFieldGet(this, _Model_traces, "f")[index]) {
            __classPrivateFieldGet(this, _Model_traces, "f")[index].metadata.modifications = newModifications;
        }
    }
    rawTraceEvents(index = __classPrivateFieldGet(this, _Model_traces, "f").length - 1) {
        return __classPrivateFieldGet(this, _Model_traces, "f").at(index)?.traceEvents ?? null;
    }
    syntheticTraceEventsManager(index = __classPrivateFieldGet(this, _Model_traces, "f").length - 1) {
        return __classPrivateFieldGet(this, _Model_traces, "f").at(index)?.syntheticEventsManager ?? null;
    }
    size() {
        return __classPrivateFieldGet(this, _Model_traces, "f").length;
    }
    deleteTraceByIndex(recordingIndex) {
        __classPrivateFieldGet(this, _Model_traces, "f").splice(recordingIndex, 1);
        __classPrivateFieldGet(this, _Model_recordingsAvailable, "f").splice(recordingIndex, 1);
    }
    getRecordingsAvailable() {
        return __classPrivateFieldGet(this, _Model_recordingsAvailable, "f");
    }
    resetProcessor() {
        __classPrivateFieldGet(this, _Model_processor, "f").reset();
    }
}
_Model_traces = new WeakMap(), _Model_nextNumberByDomain = new WeakMap(), _Model_recordingsAvailable = new WeakMap(), _Model_lastRecordingIndex = new WeakMap(), _Model_processor = new WeakMap(), _Model_config = new WeakMap(), _Model_instances = new WeakSet(), _Model_storeParsedFileData = function _Model_storeParsedFileData(file, data, insights) {
    var _a;
    file.parsedTrace = data;
    file.traceInsights = insights;
    __classPrivateFieldSet(this, _Model_lastRecordingIndex, (_a = __classPrivateFieldGet(this, _Model_lastRecordingIndex, "f"), _a++, _a), "f");
    let recordingName = `Trace ${__classPrivateFieldGet(this, _Model_lastRecordingIndex, "f")}`;
    let origin = null;
    if (file.parsedTrace) {
        origin = Helpers.Trace.extractOriginFromTrace(file.parsedTrace.Meta.mainFrameURL);
        if (origin) {
            const nextSequenceForDomain = Platform.MapUtilities.getWithDefault(__classPrivateFieldGet(this, _Model_nextNumberByDomain, "f"), origin, () => 1);
            recordingName = `${origin} (${nextSequenceForDomain})`;
            __classPrivateFieldGet(this, _Model_nextNumberByDomain, "f").set(origin, nextSequenceForDomain + 1);
        }
    }
    __classPrivateFieldGet(this, _Model_recordingsAvailable, "f").push(recordingName);
};
export var ModelUpdateType;
(function (ModelUpdateType) {
    ModelUpdateType["COMPLETE"] = "COMPLETE";
    ModelUpdateType["PROGRESS_UPDATE"] = "PROGRESS_UPDATE";
})(ModelUpdateType || (ModelUpdateType = {}));
export class ModelUpdateEvent extends Event {
    constructor(data) {
        super(ModelUpdateEvent.eventName);
        this.data = data;
    }
}
ModelUpdateEvent.eventName = 'modelupdate';
export function isModelUpdateDataComplete(eventData) {
    return eventData.type === "COMPLETE" /* ModelUpdateType.COMPLETE */;
}
//# sourceMappingURL=ModelImpl.js.map