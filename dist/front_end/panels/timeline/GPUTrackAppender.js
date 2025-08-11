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
var _GPUTrackAppender_instances, _GPUTrackAppender_compatibilityBuilder, _GPUTrackAppender_parsedTrace, _GPUTrackAppender_appendTrackHeaderAtLevel;
// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../../core/i18n/i18n.js';
import * as Trace from '../../models/trace/trace.js';
import * as ThemeSupport from '../../ui/legacy/theme_support/theme_support.js';
import { buildGroupStyle, buildTrackHeader } from './AppenderUtils.js';
const UIStrings = {
    /**
     *@description Text in Timeline Flame Chart Data Provider of the Performance panel
     */
    gpu: 'GPU',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/GPUTrackAppender.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class GPUTrackAppender {
    constructor(compatibilityBuilder, parsedTrace) {
        _GPUTrackAppender_instances.add(this);
        this.appenderName = 'GPU';
        _GPUTrackAppender_compatibilityBuilder.set(this, void 0);
        _GPUTrackAppender_parsedTrace.set(this, void 0);
        __classPrivateFieldSet(this, _GPUTrackAppender_compatibilityBuilder, compatibilityBuilder, "f");
        __classPrivateFieldSet(this, _GPUTrackAppender_parsedTrace, parsedTrace, "f");
    }
    /**
     * Appends into the flame chart data the data corresponding to the
     * GPU track.
     * @param trackStartLevel the horizontal level of the flame chart events where
     * the track's events will start being appended.
     * @param expanded wether the track should be rendered expanded.
     * @returns the first available level to append more data after having
     * appended the track's events.
     */
    appendTrackAtLevel(trackStartLevel, expanded) {
        const gpuEvents = __classPrivateFieldGet(this, _GPUTrackAppender_parsedTrace, "f").GPU.mainGPUThreadTasks;
        if (gpuEvents.length === 0) {
            return trackStartLevel;
        }
        __classPrivateFieldGet(this, _GPUTrackAppender_instances, "m", _GPUTrackAppender_appendTrackHeaderAtLevel).call(this, trackStartLevel, expanded);
        return __classPrivateFieldGet(this, _GPUTrackAppender_compatibilityBuilder, "f").appendEventsAtLevel(gpuEvents, trackStartLevel, this);
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
        if (!Trace.Types.Events.isGPUTask(event)) {
            throw new Error(`Unexpected GPU Task: The event's type is '${event.name}'`);
        }
        return ThemeSupport.ThemeSupport.instance().getComputedValue('--app-color-painting');
    }
}
_GPUTrackAppender_compatibilityBuilder = new WeakMap(), _GPUTrackAppender_parsedTrace = new WeakMap(), _GPUTrackAppender_instances = new WeakSet(), _GPUTrackAppender_appendTrackHeaderAtLevel = function _GPUTrackAppender_appendTrackHeaderAtLevel(currentLevel, expanded) {
    const style = buildGroupStyle({ collapsible: false });
    const group = buildTrackHeader("gpu" /* VisualLoggingTrackName.GPU */, currentLevel, i18nString(UIStrings.gpu), style, /* selectable= */ true, expanded);
    __classPrivateFieldGet(this, _GPUTrackAppender_compatibilityBuilder, "f").registerTrackForGroup(group, this);
};
//# sourceMappingURL=GPUTrackAppender.js.map