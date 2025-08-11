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
var _AnimationsTrackAppender_instances, _AnimationsTrackAppender_compatibilityBuilder, _AnimationsTrackAppender_parsedTrace, _AnimationsTrackAppender_eventAppendedCallback, _AnimationsTrackAppender_appendTrackHeaderAtLevel, _AnimationsTrackAppender_eventAppendedCallbackFunction;
import * as i18n from '../../core/i18n/i18n.js';
import * as Trace from '../../models/trace/trace.js';
import * as PerfUI from '../../ui/legacy/components/perf_ui/perf_ui.js';
import * as ThemeSupport from '../../ui/legacy/theme_support/theme_support.js';
import { addDecorationToEvent, buildGroupStyle, buildTrackHeader } from './AppenderUtils.js';
const UIStrings = {
    /**
     *@description Text in Timeline Flame Chart Data Provider of the Performance panel
     */
    animations: 'Animations',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/AnimationsTrackAppender.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AnimationsTrackAppender {
    constructor(compatibilityBuilder, parsedTrace) {
        _AnimationsTrackAppender_instances.add(this);
        this.appenderName = 'Animations';
        _AnimationsTrackAppender_compatibilityBuilder.set(this, void 0);
        _AnimationsTrackAppender_parsedTrace.set(this, void 0);
        _AnimationsTrackAppender_eventAppendedCallback.set(this, __classPrivateFieldGet(this, _AnimationsTrackAppender_instances, "m", _AnimationsTrackAppender_eventAppendedCallbackFunction).bind(this));
        __classPrivateFieldSet(this, _AnimationsTrackAppender_compatibilityBuilder, compatibilityBuilder, "f");
        __classPrivateFieldSet(this, _AnimationsTrackAppender_parsedTrace, parsedTrace, "f");
    }
    appendTrackAtLevel(trackStartLevel, expanded) {
        const animations = __classPrivateFieldGet(this, _AnimationsTrackAppender_parsedTrace, "f").Animations.animations;
        if (animations.length === 0) {
            return trackStartLevel;
        }
        __classPrivateFieldGet(this, _AnimationsTrackAppender_instances, "m", _AnimationsTrackAppender_appendTrackHeaderAtLevel).call(this, trackStartLevel, expanded);
        return __classPrivateFieldGet(this, _AnimationsTrackAppender_compatibilityBuilder, "f").appendEventsAtLevel(animations, trackStartLevel, this, __classPrivateFieldGet(this, _AnimationsTrackAppender_eventAppendedCallback, "f"));
    }
    colorForEvent() {
        return ThemeSupport.ThemeSupport.instance().getComputedValue('--app-color-rendering');
    }
}
_AnimationsTrackAppender_compatibilityBuilder = new WeakMap(), _AnimationsTrackAppender_parsedTrace = new WeakMap(), _AnimationsTrackAppender_eventAppendedCallback = new WeakMap(), _AnimationsTrackAppender_instances = new WeakSet(), _AnimationsTrackAppender_appendTrackHeaderAtLevel = function _AnimationsTrackAppender_appendTrackHeaderAtLevel(currentLevel, expanded) {
    const style = buildGroupStyle({ useFirstLineForOverview: false });
    const group = buildTrackHeader("animations" /* VisualLoggingTrackName.ANIMATIONS */, currentLevel, i18nString(UIStrings.animations), style, 
    /* selectable= */ true, expanded);
    __classPrivateFieldGet(this, _AnimationsTrackAppender_compatibilityBuilder, "f").registerTrackForGroup(group, this);
}, _AnimationsTrackAppender_eventAppendedCallbackFunction = function _AnimationsTrackAppender_eventAppendedCallbackFunction(event, index) {
    if (event && Trace.Types.Events.isSyntheticAnimation(event)) {
        const failures = Trace.Insights.Models.CLSCulprits.getNonCompositedFailure(event);
        if (failures.length) {
            addDecorationToEvent(__classPrivateFieldGet(this, _AnimationsTrackAppender_compatibilityBuilder, "f").getFlameChartTimelineData(), index, {
                type: "WARNING_TRIANGLE" /* PerfUI.FlameChart.FlameChartDecorationType.WARNING_TRIANGLE */,
            });
        }
    }
};
//# sourceMappingURL=AnimationsTrackAppender.js.map