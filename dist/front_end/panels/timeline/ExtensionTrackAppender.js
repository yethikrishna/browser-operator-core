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
var _ExtensionTrackAppender_instances, _ExtensionTrackAppender_extensionTopLevelTrack, _ExtensionTrackAppender_compatibilityBuilder, _ExtensionTrackAppender_appendTopLevelHeaderAtLevel, _ExtensionTrackAppender_appendSecondLevelHeader, _ExtensionTrackAppender_appendExtensionTrackData;
// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../../core/i18n/i18n.js';
import * as Trace from '../../models/trace/trace.js';
import * as ThemeSupport from '../../ui/legacy/theme_support/theme_support.js';
import { buildGroupStyle, buildTrackHeader, getDurationString } from './AppenderUtils.js';
import * as Extensions from './extensions/extensions.js';
const UIStrings = {
    /**
     * @description The name of a track, which is a horizontal division of the timeline, synonym with "swimlane".
     * @example {A track name} PH1
     */
    customTrackName: '{PH1} — Custom track',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/ExtensionTrackAppender.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ExtensionTrackAppender {
    constructor(compatibilityBuilder, extensionTracks) {
        _ExtensionTrackAppender_instances.add(this);
        this.appenderName = 'Extension';
        _ExtensionTrackAppender_extensionTopLevelTrack.set(this, void 0);
        _ExtensionTrackAppender_compatibilityBuilder.set(this, void 0);
        __classPrivateFieldSet(this, _ExtensionTrackAppender_extensionTopLevelTrack, extensionTracks, "f");
        __classPrivateFieldSet(this, _ExtensionTrackAppender_compatibilityBuilder, compatibilityBuilder, "f");
    }
    appendTrackAtLevel(trackStartLevel, expanded) {
        const totalEntryCount = Object.values(__classPrivateFieldGet(this, _ExtensionTrackAppender_extensionTopLevelTrack, "f").entriesByTrack).reduce((prev, current) => current.length + prev, 0);
        if (totalEntryCount === 0) {
            return trackStartLevel;
        }
        __classPrivateFieldGet(this, _ExtensionTrackAppender_instances, "m", _ExtensionTrackAppender_appendTopLevelHeaderAtLevel).call(this, trackStartLevel, expanded);
        return __classPrivateFieldGet(this, _ExtensionTrackAppender_instances, "m", _ExtensionTrackAppender_appendExtensionTrackData).call(this, trackStartLevel);
    }
    colorForEvent(event) {
        const defaultColor = ThemeSupport.ThemeSupport.instance().getComputedValue('--app-color-rendering');
        if (!Trace.Types.Extensions.isSyntheticExtensionEntry(event)) {
            return defaultColor;
        }
        return Extensions.ExtensionUI.extensionEntryColor(event);
    }
    titleForEvent(event) {
        return event.name;
    }
    setPopoverInfo(event, info) {
        info.title = Trace.Types.Extensions.isSyntheticExtensionEntry(event) && event.args.tooltipText ?
            event.args.tooltipText :
            this.titleForEvent(event);
        info.formattedTime = getDurationString(event.dur);
    }
}
_ExtensionTrackAppender_extensionTopLevelTrack = new WeakMap(), _ExtensionTrackAppender_compatibilityBuilder = new WeakMap(), _ExtensionTrackAppender_instances = new WeakSet(), _ExtensionTrackAppender_appendTopLevelHeaderAtLevel = function _ExtensionTrackAppender_appendTopLevelHeaderAtLevel(currentLevel, expanded) {
    const style = buildGroupStyle({ shareHeaderLine: false, collapsible: true });
    const headerTitle = i18nString(UIStrings.customTrackName, { PH1: __classPrivateFieldGet(this, _ExtensionTrackAppender_extensionTopLevelTrack, "f").name });
    const jsLogContext = __classPrivateFieldGet(this, _ExtensionTrackAppender_extensionTopLevelTrack, "f").name === '🅰️ Angular' ? "angular-track" /* VisualLoggingTrackName.ANGULAR_TRACK */ :
        "extension" /* VisualLoggingTrackName.EXTENSION */;
    const group = buildTrackHeader(jsLogContext, currentLevel, headerTitle, style, 
    /* selectable= */ true, expanded);
    __classPrivateFieldGet(this, _ExtensionTrackAppender_compatibilityBuilder, "f").registerTrackForGroup(group, this);
}, _ExtensionTrackAppender_appendSecondLevelHeader = function _ExtensionTrackAppender_appendSecondLevelHeader(trackStartLevel, headerTitle) {
    const style = buildGroupStyle({ shareHeaderLine: false, padding: 2, nestingLevel: 1, collapsible: true });
    const group = buildTrackHeader("extension" /* VisualLoggingTrackName.EXTENSION */, trackStartLevel, headerTitle, style, 
    /* selectable= */ true);
    __classPrivateFieldGet(this, _ExtensionTrackAppender_compatibilityBuilder, "f").registerTrackForGroup(group, this);
}, _ExtensionTrackAppender_appendExtensionTrackData = function _ExtensionTrackAppender_appendExtensionTrackData(trackStartLevel) {
    let currentStartLevel = trackStartLevel;
    for (const [trackName, entries] of Object.entries(__classPrivateFieldGet(this, _ExtensionTrackAppender_extensionTopLevelTrack, "f").entriesByTrack)) {
        if (__classPrivateFieldGet(this, _ExtensionTrackAppender_extensionTopLevelTrack, "f").isTrackGroup) {
            // Second level header is used for only sub-tracks.
            __classPrivateFieldGet(this, _ExtensionTrackAppender_instances, "m", _ExtensionTrackAppender_appendSecondLevelHeader).call(this, currentStartLevel, trackName);
        }
        currentStartLevel = __classPrivateFieldGet(this, _ExtensionTrackAppender_compatibilityBuilder, "f").appendEventsAtLevel(entries, currentStartLevel, this);
    }
    return currentStartLevel;
};
//# sourceMappingURL=ExtensionTrackAppender.js.map