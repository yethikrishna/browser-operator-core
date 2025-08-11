// Copyright 2016 The Chromium Authors. All rights reserved.
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
var _TimelineLoader_instances, _TimelineLoader_traceIsCPUProfile, _TimelineLoader_collectedEvents, _TimelineLoader_metadata, _TimelineLoader_traceFinalizedCallbackForTest, _TimelineLoader_traceFinalizedPromiseForTest, _TimelineLoader_processParsedFile, _TimelineLoader_parseCPUProfileFormatFromFile, _TimelineLoader_collectEvents;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Bindings from '../../models/bindings/bindings.js';
import * as Trace from '../../models/trace/trace.js';
import * as RecordingMetadata from './RecordingMetadata.js';
const UIStrings = {
    /**
     *@description Text in Timeline Loader of the Performance panel
     *@example {Unknown JSON format} PH1
     */
    malformedTimelineDataS: 'Malformed timeline data: {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/TimelineLoader.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
/**
 * This class handles loading traces from file and URL, and from the Lighthouse panel
 * It also handles loading cpuprofiles from file, url and console.profileEnd()
 *
 * Meanwhile, the normal trace recording flow bypasses TimelineLoader entirely,
 * as it's handled from TracingManager => TimelineController.
 */
export class TimelineLoader {
    constructor(client) {
        _TimelineLoader_instances.add(this);
        _TimelineLoader_traceIsCPUProfile.set(this, void 0);
        _TimelineLoader_collectedEvents.set(this, []);
        _TimelineLoader_metadata.set(this, void 0);
        _TimelineLoader_traceFinalizedCallbackForTest.set(this, void 0);
        _TimelineLoader_traceFinalizedPromiseForTest.set(this, void 0);
        this.client = client;
        this.canceledCallback = null;
        this.buffer = '';
        this.firstRawChunk = true;
        this.filter = null;
        __classPrivateFieldSet(this, _TimelineLoader_traceIsCPUProfile, false, "f");
        __classPrivateFieldSet(this, _TimelineLoader_metadata, null, "f");
        __classPrivateFieldSet(this, _TimelineLoader_traceFinalizedPromiseForTest, new Promise(resolve => {
            __classPrivateFieldSet(this, _TimelineLoader_traceFinalizedCallbackForTest, resolve, "f");
        }), "f");
    }
    static async loadFromFile(file, client) {
        const loader = new TimelineLoader(client);
        const fileReader = new Bindings.FileUtils.ChunkedFileReader(file);
        loader.canceledCallback = fileReader.cancel.bind(fileReader);
        loader.totalSize = file.size;
        // We'll resolve and return the loader instance before finalizing the trace.
        setTimeout(async () => {
            const success = await fileReader.read(loader);
            if (!success && fileReader.error()) {
                // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                loader.reportErrorAndCancelLoading(fileReader.error().message);
            }
        });
        return loader;
    }
    static loadFromParsedJsonFile(contents, client) {
        const loader = new TimelineLoader(client);
        window.setTimeout(async () => {
            client.loadingStarted();
            try {
                __classPrivateFieldGet(loader, _TimelineLoader_instances, "m", _TimelineLoader_processParsedFile).call(loader, contents);
                await loader.close();
            }
            catch (e) {
                await loader.close();
                const message = e instanceof Error ? e.message : '';
                return loader.reportErrorAndCancelLoading(i18nString(UIStrings.malformedTimelineDataS, { PH1: message }));
            }
        });
        return loader;
    }
    static loadFromEvents(events, client) {
        const loader = new TimelineLoader(client);
        window.setTimeout(async () => {
            void loader.addEvents(events, null);
        });
        return loader;
    }
    static loadFromTraceFile(traceFile, client) {
        const loader = new TimelineLoader(client);
        window.setTimeout(async () => {
            void loader.addEvents(traceFile.traceEvents, traceFile.metadata);
        });
        return loader;
    }
    static loadFromCpuProfile(profile, client) {
        const loader = new TimelineLoader(client);
        __classPrivateFieldSet(loader, _TimelineLoader_traceIsCPUProfile, true, "f");
        try {
            const contents = Trace.Helpers.SamplesIntegrator.SamplesIntegrator.createFakeTraceFromCpuProfile(profile, Trace.Types.Events.ThreadID(1));
            window.setTimeout(async () => {
                void loader.addEvents(contents.traceEvents, null);
            });
        }
        catch (e) {
            console.error(e.stack);
        }
        return loader;
    }
    static async loadFromURL(url, client) {
        const loader = new TimelineLoader(client);
        const stream = new Common.StringOutputStream.StringOutputStream();
        client.loadingStarted();
        const allowRemoteFilePaths = Common.Settings.Settings.instance().moduleSetting('network.enable-remote-file-loading').get();
        Host.ResourceLoader.loadAsStream(url, null, stream, finishedCallback, allowRemoteFilePaths);
        async function finishedCallback(success, _headers, errorDescription) {
            if (!success) {
                return loader.reportErrorAndCancelLoading(errorDescription.message);
            }
            try {
                const txt = stream.data();
                const trace = JSON.parse(txt);
                __classPrivateFieldGet(loader, _TimelineLoader_instances, "m", _TimelineLoader_processParsedFile).call(loader, trace);
                await loader.close();
            }
            catch (e) {
                await loader.close();
                const message = e instanceof Error ? e.message : '';
                return loader.reportErrorAndCancelLoading(i18nString(UIStrings.malformedTimelineDataS, { PH1: message }));
            }
        }
        return loader;
    }
    async addEvents(events, metadata) {
        __classPrivateFieldSet(this, _TimelineLoader_metadata, metadata, "f");
        this.client?.loadingStarted();
        /**
         * See the `eventsPerChunk` comment in `models/trace/types/Configuration.ts`.
         *
         * This value is different though. Why? `The addEvents()` work below is different
         * (and much faster!) than running `handleEvent()` on all handlers.
         */
        const eventsPerChunk = 150000;
        for (let i = 0; i < events.length; i += eventsPerChunk) {
            const chunk = events.slice(i, i + eventsPerChunk);
            __classPrivateFieldGet(this, _TimelineLoader_instances, "m", _TimelineLoader_collectEvents).call(this, chunk);
            this.client?.loadingProgress((i + chunk.length) / events.length);
            await new Promise(r => window.setTimeout(r, 0)); // Yield event loop to paint.
        }
        void this.close();
    }
    async cancel() {
        if (this.client) {
            await this.client.loadingComplete(
            /* collectedEvents */ [], /* exclusiveFilter= */ null, /* metadata= */ null);
            this.client = null;
        }
        if (this.canceledCallback) {
            this.canceledCallback();
        }
    }
    /**
     * As TimelineLoader implements `Common.StringOutputStream.OutputStream`, `write()` is called when a
     * Common.StringOutputStream.StringOutputStream instance has decoded a chunk. This path is only used
     * by `loadFromFile()`; it's NOT used by `loadFromEvents` or `loadFromURL`.
     */
    async write(chunk, endOfFile) {
        if (!this.client) {
            return await Promise.resolve();
        }
        this.buffer += chunk;
        if (this.firstRawChunk) {
            this.client.loadingStarted();
            // Ensure we paint the loading dialog before continuing
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            this.firstRawChunk = false;
        }
        else {
            let progress = undefined;
            progress = this.buffer.length / this.totalSize;
            // For compressed traces, we can't provide a definite progress percentage. So, just keep it moving.
            // For other traces, calculate a loaded part.
            progress = progress > 1 ? progress - Math.floor(progress) : progress;
            this.client.loadingProgress(progress);
        }
        if (endOfFile) {
            let trace;
            try {
                trace = JSON.parse(this.buffer);
                __classPrivateFieldGet(this, _TimelineLoader_instances, "m", _TimelineLoader_processParsedFile).call(this, trace);
            }
            catch (e) {
                this.reportErrorAndCancelLoading(i18nString(UIStrings.malformedTimelineDataS, { PH1: e.toString() }));
            }
            return;
        }
    }
    reportErrorAndCancelLoading(message) {
        if (message) {
            Common.Console.Console.instance().error(message);
        }
        void this.cancel();
    }
    async close() {
        if (!this.client) {
            return;
        }
        this.client.processingStarted();
        await this.finalizeTrace();
    }
    async finalizeTrace() {
        if (!__classPrivateFieldGet(this, _TimelineLoader_metadata, "f") && __classPrivateFieldGet(this, _TimelineLoader_traceIsCPUProfile, "f")) {
            __classPrivateFieldSet(this, _TimelineLoader_metadata, RecordingMetadata.forCPUProfile(), "f");
        }
        await this.client.loadingComplete(__classPrivateFieldGet(this, _TimelineLoader_collectedEvents, "f"), this.filter, __classPrivateFieldGet(this, _TimelineLoader_metadata, "f"));
        __classPrivateFieldGet(this, _TimelineLoader_traceFinalizedCallbackForTest, "f")?.call(this);
    }
    traceFinalizedForTest() {
        return __classPrivateFieldGet(this, _TimelineLoader_traceFinalizedPromiseForTest, "f");
    }
}
_TimelineLoader_traceIsCPUProfile = new WeakMap(), _TimelineLoader_collectedEvents = new WeakMap(), _TimelineLoader_metadata = new WeakMap(), _TimelineLoader_traceFinalizedCallbackForTest = new WeakMap(), _TimelineLoader_traceFinalizedPromiseForTest = new WeakMap(), _TimelineLoader_instances = new WeakSet(), _TimelineLoader_processParsedFile = function _TimelineLoader_processParsedFile(trace) {
    if ('traceEvents' in trace || Array.isArray(trace)) {
        // We know that this is NOT a raw CPU Profile because it has traceEvents
        // (either at the top level, or nested under the traceEvents key)
        const items = Array.isArray(trace) ? trace : trace.traceEvents;
        __classPrivateFieldGet(this, _TimelineLoader_instances, "m", _TimelineLoader_collectEvents).call(this, items);
    }
    else if (trace.nodes) {
        // We know it's a raw Protocol CPU Profile.
        __classPrivateFieldGet(this, _TimelineLoader_instances, "m", _TimelineLoader_parseCPUProfileFormatFromFile).call(this, trace);
        __classPrivateFieldSet(this, _TimelineLoader_traceIsCPUProfile, true, "f");
    }
    else {
        this.reportErrorAndCancelLoading(i18nString(UIStrings.malformedTimelineDataS));
        return;
    }
    if ('metadata' in trace) {
        __classPrivateFieldSet(this, _TimelineLoader_metadata, trace.metadata, "f");
        // Older traces set these fields even when throttling is not active, while newer traces do not.
        // Clear them out on load to simplify usage.
        if (__classPrivateFieldGet(this, _TimelineLoader_metadata, "f").cpuThrottling === 1) {
            __classPrivateFieldGet(this, _TimelineLoader_metadata, "f").cpuThrottling = undefined;
        }
        // This string is translated, so this only covers the english case and the current locale.
        // Due to this, older traces in other locales will end up displaying "No throttling" in the trace history selector.
        const noThrottlingString = typeof SDK.NetworkManager.NoThrottlingConditions.title === 'string' ?
            SDK.NetworkManager.NoThrottlingConditions.title :
            SDK.NetworkManager.NoThrottlingConditions.title();
        if (__classPrivateFieldGet(this, _TimelineLoader_metadata, "f").networkThrottling === 'No throttling' ||
            __classPrivateFieldGet(this, _TimelineLoader_metadata, "f").networkThrottling === noThrottlingString) {
            __classPrivateFieldGet(this, _TimelineLoader_metadata, "f").networkThrottling = undefined;
        }
    }
}, _TimelineLoader_parseCPUProfileFormatFromFile = function _TimelineLoader_parseCPUProfileFormatFromFile(parsedTrace) {
    const traceFile = Trace.Helpers.SamplesIntegrator.SamplesIntegrator.createFakeTraceFromCpuProfile(parsedTrace, Trace.Types.Events.ThreadID(1));
    __classPrivateFieldGet(this, _TimelineLoader_instances, "m", _TimelineLoader_collectEvents).call(this, traceFile.traceEvents);
}, _TimelineLoader_collectEvents = function _TimelineLoader_collectEvents(events) {
    __classPrivateFieldSet(this, _TimelineLoader_collectedEvents, __classPrivateFieldGet(this, _TimelineLoader_collectedEvents, "f").concat(events), "f");
};
//# sourceMappingURL=TimelineLoader.js.map