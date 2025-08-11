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
var _ModificationsManager_instances, _ModificationsManager_entriesFilter, _ModificationsManager_timelineBreadcrumbs, _ModificationsManager_modifications, _ModificationsManager_parsedTrace, _ModificationsManager_eventsSerializer, _ModificationsManager_overlayForAnnotation, _ModificationsManager_annotationsHiddenSetting, _ModificationsManager_findLabelOverlayForEntry, _ModificationsManager_createOverlayFromAnnotation, _ModificationsManager_annotationsJSON, _ModificationsManager_applyStoredAnnotations, _ModificationsManager_applyEntriesFilterModifications;
import * as Common from '../../core/common/common.js';
import * as Platform from '../../core/platform/platform.js';
import * as Trace from '../../models/trace/trace.js';
import * as TimelineComponents from '../../panels/timeline/components/components.js';
import * as AnnotationHelpers from './AnnotationHelpers.js';
import { EntriesFilter } from './EntriesFilter.js';
import { EventsSerializer } from './EventsSerializer.js';
const modificationsManagerByTraceIndex = [];
let activeManager;
// Event dispatched after an annotation was added, removed or updated.
// The event argument is the Overlay that needs to be created,removed
// or updated by `Overlays.ts` and the action that needs to be applied to it.
export class AnnotationModifiedEvent extends Event {
    constructor(overlay, action) {
        super(AnnotationModifiedEvent.eventName);
        this.overlay = overlay;
        this.action = action;
    }
}
AnnotationModifiedEvent.eventName = 'annotationmodifiedevent';
export class ModificationsManager extends EventTarget {
    /**
     * Gets the ModificationsManager instance corresponding to a trace
     * given its index used in Model#traces. If no index is passed gets
     * the manager instance for the last trace. If no instance is found,
     * throws.
     */
    static activeManager() {
        return activeManager;
    }
    static reset() {
        modificationsManagerByTraceIndex.length = 0;
        activeManager = null;
    }
    /**
     * Initializes a ModificationsManager instance for a parsed trace or changes the active manager for an existing one.
     * This needs to be called if and a trace has been parsed or switched to.
     */
    static initAndActivateModificationsManager(traceModel, traceIndex) {
        // If a manager for a given index has already been created, active it.
        if (modificationsManagerByTraceIndex[traceIndex]) {
            if (activeManager === modificationsManagerByTraceIndex[traceIndex]) {
                return activeManager;
            }
            activeManager = modificationsManagerByTraceIndex[traceIndex];
            ModificationsManager.activeManager()?.applyModificationsIfPresent();
        }
        const parsedTrace = traceModel.parsedTrace(traceIndex);
        if (!parsedTrace) {
            throw new Error('ModificationsManager was initialized without a corresponding trace data');
        }
        const traceBounds = parsedTrace.Meta.traceBounds;
        const traceEvents = traceModel.rawTraceEvents(traceIndex);
        if (!traceEvents) {
            throw new Error('ModificationsManager was initialized without a corresponding raw trace events array');
        }
        const syntheticEventsManager = traceModel.syntheticTraceEventsManager(traceIndex);
        if (!syntheticEventsManager) {
            throw new Error('ModificationsManager was initialized without a corresponding SyntheticEventsManager');
        }
        const metadata = traceModel.metadata(traceIndex);
        const newModificationsManager = new ModificationsManager({
            parsedTrace,
            traceBounds,
            rawTraceEvents: traceEvents,
            modifications: metadata?.modifications,
            syntheticEvents: syntheticEventsManager.getSyntheticTraces(),
        });
        modificationsManagerByTraceIndex[traceIndex] = newModificationsManager;
        activeManager = newModificationsManager;
        ModificationsManager.activeManager()?.applyModificationsIfPresent();
        return this.activeManager();
    }
    constructor({ parsedTrace, traceBounds, modifications }) {
        super();
        _ModificationsManager_instances.add(this);
        _ModificationsManager_entriesFilter.set(this, void 0);
        _ModificationsManager_timelineBreadcrumbs.set(this, void 0);
        _ModificationsManager_modifications.set(this, null);
        _ModificationsManager_parsedTrace.set(this, void 0);
        _ModificationsManager_eventsSerializer.set(this, void 0);
        _ModificationsManager_overlayForAnnotation.set(this, void 0);
        _ModificationsManager_annotationsHiddenSetting.set(this, void 0);
        __classPrivateFieldSet(this, _ModificationsManager_entriesFilter, new EntriesFilter(parsedTrace), "f");
        // Create first breadcrumb from the initial full window
        __classPrivateFieldSet(this, _ModificationsManager_timelineBreadcrumbs, new TimelineComponents.Breadcrumbs.Breadcrumbs(traceBounds), "f");
        __classPrivateFieldSet(this, _ModificationsManager_modifications, modifications || null, "f");
        __classPrivateFieldSet(this, _ModificationsManager_parsedTrace, parsedTrace, "f");
        __classPrivateFieldSet(this, _ModificationsManager_eventsSerializer, new EventsSerializer(), "f");
        // This method is also called in SidebarAnnotationsTab, but calling this multiple times doesn't recreate the setting.
        // Instead, after the second call, the cached setting is returned.
        __classPrivateFieldSet(this, _ModificationsManager_annotationsHiddenSetting, Common.Settings.Settings.instance().moduleSetting('annotations-hidden'), "f");
        // TODO: Assign annotations loaded from the trace file
        __classPrivateFieldSet(this, _ModificationsManager_overlayForAnnotation, new Map(), "f");
    }
    getEntriesFilter() {
        return __classPrivateFieldGet(this, _ModificationsManager_entriesFilter, "f");
    }
    getTimelineBreadcrumbs() {
        return __classPrivateFieldGet(this, _ModificationsManager_timelineBreadcrumbs, "f");
    }
    deleteEmptyRangeAnnotations() {
        for (const annotation of __classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").keys()) {
            if (annotation.type === 'TIME_RANGE' && annotation.label.length === 0) {
                this.removeAnnotation(annotation);
            }
        }
    }
    /**
     * Stores the annotation and creates its overlay.
     * @returns the Overlay that gets created and associated with this annotation.
     */
    createAnnotation(newAnnotation, loadedFromFile = false) {
        // If a label already exists on an entry and a user is trying to create a new one, start editing an existing label instead.
        if (newAnnotation.type === 'ENTRY_LABEL') {
            const overlay = __classPrivateFieldGet(this, _ModificationsManager_instances, "m", _ModificationsManager_findLabelOverlayForEntry).call(this, newAnnotation.entry);
            if (overlay) {
                this.dispatchEvent(new AnnotationModifiedEvent(overlay, 'EnterLabelEditState'));
                return overlay;
            }
        }
        // If the new annotation created was not loaded from the file, set the annotations visibility setting to true. That way we make sure
        // the annotations are on when a new one is created.
        if (!loadedFromFile) {
            // Time range annotation could also be used to check the length of a selection in the timeline. Therefore, only set the annotations
            // hidden to true if annotations label is added. This is done in OverlaysImpl.
            if (newAnnotation.type !== 'TIME_RANGE') {
                __classPrivateFieldGet(this, _ModificationsManager_annotationsHiddenSetting, "f").set(false);
            }
        }
        const newOverlay = __classPrivateFieldGet(this, _ModificationsManager_instances, "m", _ModificationsManager_createOverlayFromAnnotation).call(this, newAnnotation);
        __classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").set(newAnnotation, newOverlay);
        this.dispatchEvent(new AnnotationModifiedEvent(newOverlay, 'Add'));
        return newOverlay;
    }
    linkAnnotationBetweenEntriesExists(entryFrom, entryTo) {
        for (const annotation of __classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").keys()) {
            if (annotation.type === 'ENTRIES_LINK' &&
                ((annotation.entryFrom === entryFrom && annotation.entryTo === entryTo) ||
                    (annotation.entryFrom === entryTo && annotation.entryTo === entryFrom))) {
                return true;
            }
        }
        return false;
    }
    bringEntryLabelForwardIfExists(entry) {
        const overlay = __classPrivateFieldGet(this, _ModificationsManager_instances, "m", _ModificationsManager_findLabelOverlayForEntry).call(this, entry);
        if (overlay?.type === 'ENTRY_LABEL') {
            this.dispatchEvent(new AnnotationModifiedEvent(overlay, 'LabelBringForward'));
        }
    }
    removeAnnotation(removedAnnotation) {
        const overlayToRemove = __classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").get(removedAnnotation);
        if (!overlayToRemove) {
            console.warn('Overlay for deleted Annotation does not exist', removedAnnotation);
            return;
        }
        __classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").delete(removedAnnotation);
        this.dispatchEvent(new AnnotationModifiedEvent(overlayToRemove, 'Remove'));
    }
    removeAnnotationOverlay(removedOverlay) {
        const annotationForRemovedOverlay = this.getAnnotationByOverlay(removedOverlay);
        if (!annotationForRemovedOverlay) {
            console.warn('Annotation for deleted Overlay does not exist', removedOverlay);
            return;
        }
        this.removeAnnotation(annotationForRemovedOverlay);
    }
    updateAnnotation(updatedAnnotation) {
        const overlay = __classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").get(updatedAnnotation);
        if (overlay && AnnotationHelpers.isTimeRangeLabel(overlay) &&
            Trace.Types.File.isTimeRangeAnnotation(updatedAnnotation)) {
            overlay.label = updatedAnnotation.label;
            overlay.bounds = updatedAnnotation.bounds;
            this.dispatchEvent(new AnnotationModifiedEvent(overlay, 'UpdateTimeRange'));
        }
        else if (overlay && AnnotationHelpers.isEntriesLink(overlay) &&
            Trace.Types.File.isEntriesLinkAnnotation(updatedAnnotation)) {
            overlay.state = updatedAnnotation.state;
            overlay.entryFrom = updatedAnnotation.entryFrom;
            overlay.entryTo = updatedAnnotation.entryTo;
            this.dispatchEvent(new AnnotationModifiedEvent(overlay, 'UpdateLinkToEntry'));
        }
        else {
            console.error('Annotation could not be updated');
        }
    }
    updateAnnotationOverlay(updatedOverlay) {
        const annotationForUpdatedOverlay = this.getAnnotationByOverlay(updatedOverlay);
        if (!annotationForUpdatedOverlay) {
            console.warn('Annotation for updated Overlay does not exist');
            return;
        }
        if ((updatedOverlay.type === 'ENTRY_LABEL' && annotationForUpdatedOverlay.type === 'ENTRY_LABEL') ||
            (updatedOverlay.type === 'TIME_RANGE' && annotationForUpdatedOverlay.type === 'TIME_RANGE')) {
            __classPrivateFieldGet(this, _ModificationsManager_annotationsHiddenSetting, "f").set(false);
            annotationForUpdatedOverlay.label = updatedOverlay.label;
            this.dispatchEvent(new AnnotationModifiedEvent(updatedOverlay, 'UpdateLabel'));
        }
        if ((updatedOverlay.type === 'ENTRIES_LINK' && annotationForUpdatedOverlay.type === 'ENTRIES_LINK')) {
            __classPrivateFieldGet(this, _ModificationsManager_annotationsHiddenSetting, "f").set(false);
            annotationForUpdatedOverlay.state = updatedOverlay.state;
        }
    }
    getAnnotationByOverlay(overlay) {
        for (const [annotation, currOverlay] of __classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").entries()) {
            if (currOverlay === overlay) {
                return annotation;
            }
        }
        return null;
    }
    getAnnotations() {
        return [...__classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").keys()];
    }
    getOverlays() {
        return [...__classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").values()];
    }
    applyAnnotationsFromCache() {
        __classPrivateFieldSet(this, _ModificationsManager_modifications, this.toJSON(), "f");
        // The cache is filled by applyModificationsIfPresent, so we clear
        // it beforehand to prevent duplicate entries.
        __classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").clear();
        __classPrivateFieldGet(this, _ModificationsManager_instances, "m", _ModificationsManager_applyStoredAnnotations).call(this, __classPrivateFieldGet(this, _ModificationsManager_modifications, "f").annotations);
    }
    /**
     * Builds all modifications into a serializable object written into
     * the 'modifications' trace file metadata field.
     */
    toJSON() {
        const hiddenEntries = __classPrivateFieldGet(this, _ModificationsManager_entriesFilter, "f").invisibleEntries()
            .map(entry => __classPrivateFieldGet(this, _ModificationsManager_eventsSerializer, "f").keyForEvent(entry))
            .filter(entry => entry !== null);
        const expandableEntries = __classPrivateFieldGet(this, _ModificationsManager_entriesFilter, "f").expandableEntries()
            .map(entry => __classPrivateFieldGet(this, _ModificationsManager_eventsSerializer, "f").keyForEvent(entry))
            .filter(entry => entry !== null);
        __classPrivateFieldSet(this, _ModificationsManager_modifications, {
            entriesModifications: {
                hiddenEntries,
                expandableEntries,
            },
            initialBreadcrumb: __classPrivateFieldGet(this, _ModificationsManager_timelineBreadcrumbs, "f").initialBreadcrumb,
            annotations: __classPrivateFieldGet(this, _ModificationsManager_instances, "m", _ModificationsManager_annotationsJSON).call(this),
        }, "f");
        return __classPrivateFieldGet(this, _ModificationsManager_modifications, "f");
    }
    applyModificationsIfPresent() {
        if (!__classPrivateFieldGet(this, _ModificationsManager_modifications, "f") || !__classPrivateFieldGet(this, _ModificationsManager_modifications, "f").annotations) {
            return;
        }
        const hiddenEntries = __classPrivateFieldGet(this, _ModificationsManager_modifications, "f").entriesModifications.hiddenEntries;
        const expandableEntries = __classPrivateFieldGet(this, _ModificationsManager_modifications, "f").entriesModifications.expandableEntries;
        __classPrivateFieldGet(this, _ModificationsManager_timelineBreadcrumbs, "f").setInitialBreadcrumbFromLoadedModifications(__classPrivateFieldGet(this, _ModificationsManager_modifications, "f").initialBreadcrumb);
        __classPrivateFieldGet(this, _ModificationsManager_instances, "m", _ModificationsManager_applyEntriesFilterModifications).call(this, hiddenEntries, expandableEntries);
        __classPrivateFieldGet(this, _ModificationsManager_instances, "m", _ModificationsManager_applyStoredAnnotations).call(this, __classPrivateFieldGet(this, _ModificationsManager_modifications, "f").annotations);
    }
}
_ModificationsManager_entriesFilter = new WeakMap(), _ModificationsManager_timelineBreadcrumbs = new WeakMap(), _ModificationsManager_modifications = new WeakMap(), _ModificationsManager_parsedTrace = new WeakMap(), _ModificationsManager_eventsSerializer = new WeakMap(), _ModificationsManager_overlayForAnnotation = new WeakMap(), _ModificationsManager_annotationsHiddenSetting = new WeakMap(), _ModificationsManager_instances = new WeakSet(), _ModificationsManager_findLabelOverlayForEntry = function _ModificationsManager_findLabelOverlayForEntry(entry) {
    for (const [annotation, overlay] of __classPrivateFieldGet(this, _ModificationsManager_overlayForAnnotation, "f").entries()) {
        if (annotation.type === 'ENTRY_LABEL' && annotation.entry === entry) {
            return overlay;
        }
    }
    return null;
}, _ModificationsManager_createOverlayFromAnnotation = function _ModificationsManager_createOverlayFromAnnotation(annotation) {
    switch (annotation.type) {
        case 'ENTRY_LABEL':
            return {
                type: 'ENTRY_LABEL',
                entry: annotation.entry,
                label: annotation.label,
            };
        case 'TIME_RANGE':
            return {
                type: 'TIME_RANGE',
                label: annotation.label,
                showDuration: true,
                bounds: annotation.bounds,
            };
        case 'ENTRIES_LINK':
            return {
                type: 'ENTRIES_LINK',
                state: annotation.state,
                entryFrom: annotation.entryFrom,
                entryTo: annotation.entryTo,
            };
        default:
            Platform.assertNever(annotation, 'Overlay for provided annotation cannot be created');
    }
}, _ModificationsManager_annotationsJSON = function _ModificationsManager_annotationsJSON() {
    const annotations = this.getAnnotations();
    const entryLabelsSerialized = [];
    const labelledTimeRangesSerialized = [];
    const linksBetweenEntriesSerialized = [];
    for (let i = 0; i < annotations.length; i++) {
        const currAnnotation = annotations[i];
        if (Trace.Types.File.isEntryLabelAnnotation(currAnnotation)) {
            const serializedEvent = __classPrivateFieldGet(this, _ModificationsManager_eventsSerializer, "f").keyForEvent(currAnnotation.entry);
            if (serializedEvent) {
                entryLabelsSerialized.push({
                    entry: serializedEvent,
                    label: currAnnotation.label,
                });
            }
        }
        else if (Trace.Types.File.isTimeRangeAnnotation(currAnnotation)) {
            labelledTimeRangesSerialized.push({
                bounds: currAnnotation.bounds,
                label: currAnnotation.label,
            });
        }
        else if (Trace.Types.File.isEntriesLinkAnnotation(currAnnotation)) {
            // Only save the links between entries that are fully created and have the entry that it is pointing to set
            if (currAnnotation.entryTo) {
                const serializedFromEvent = __classPrivateFieldGet(this, _ModificationsManager_eventsSerializer, "f").keyForEvent(currAnnotation.entryFrom);
                const serializedToEvent = __classPrivateFieldGet(this, _ModificationsManager_eventsSerializer, "f").keyForEvent(currAnnotation.entryTo);
                if (serializedFromEvent && serializedToEvent) {
                    linksBetweenEntriesSerialized.push({
                        entryFrom: serializedFromEvent,
                        entryTo: serializedToEvent,
                    });
                }
            }
        }
    }
    return {
        entryLabels: entryLabelsSerialized,
        labelledTimeRanges: labelledTimeRangesSerialized,
        linksBetweenEntries: linksBetweenEntriesSerialized,
    };
}, _ModificationsManager_applyStoredAnnotations = function _ModificationsManager_applyStoredAnnotations(annotations) {
    try {
        // Assign annotations to an empty array if they don't exist to not
        // break the traces that were saved before those annotations were implemented
        const entryLabels = annotations.entryLabels ?? [];
        entryLabels.forEach(entryLabel => {
            this.createAnnotation({
                type: 'ENTRY_LABEL',
                entry: __classPrivateFieldGet(this, _ModificationsManager_eventsSerializer, "f").eventForKey(entryLabel.entry, __classPrivateFieldGet(this, _ModificationsManager_parsedTrace, "f")),
                label: entryLabel.label,
            }, true);
        });
        const timeRanges = annotations.labelledTimeRanges ?? [];
        timeRanges.forEach(timeRange => {
            this.createAnnotation({
                type: 'TIME_RANGE',
                bounds: timeRange.bounds,
                label: timeRange.label,
            }, true);
        });
        const linksBetweenEntries = annotations.linksBetweenEntries ?? [];
        linksBetweenEntries.forEach(linkBetweenEntries => {
            this.createAnnotation({
                type: 'ENTRIES_LINK',
                state: "connected" /* Trace.Types.File.EntriesLinkState.CONNECTED */,
                entryFrom: __classPrivateFieldGet(this, _ModificationsManager_eventsSerializer, "f").eventForKey(linkBetweenEntries.entryFrom, __classPrivateFieldGet(this, _ModificationsManager_parsedTrace, "f")),
                entryTo: __classPrivateFieldGet(this, _ModificationsManager_eventsSerializer, "f").eventForKey(linkBetweenEntries.entryTo, __classPrivateFieldGet(this, _ModificationsManager_parsedTrace, "f")),
            }, true);
        });
    }
    catch (err) {
        // This function is wrapped in a try/catch just in case we get any incoming
        // trace files with broken event keys. Shouldn't happen of course, but if
        // it does, we can discard all the data and then continue loading the
        // trace, rather than have the panel entirely break. This also prevents any
        // issue where we accidentally break the event serializer and break people
        // loading traces; let's at least make sure they can load the panel, even
        // if their annotations are gone.
        console.warn('Failed to apply stored annotations', err);
    }
}, _ModificationsManager_applyEntriesFilterModifications = function _ModificationsManager_applyEntriesFilterModifications(hiddenEntriesKeys, expandableEntriesKeys) {
    try {
        const hiddenEntries = hiddenEntriesKeys.map(key => __classPrivateFieldGet(this, _ModificationsManager_eventsSerializer, "f").eventForKey(key, __classPrivateFieldGet(this, _ModificationsManager_parsedTrace, "f")));
        const expandableEntries = expandableEntriesKeys.map(key => __classPrivateFieldGet(this, _ModificationsManager_eventsSerializer, "f").eventForKey(key, __classPrivateFieldGet(this, _ModificationsManager_parsedTrace, "f")));
        __classPrivateFieldGet(this, _ModificationsManager_entriesFilter, "f").setHiddenAndExpandableEntries(hiddenEntries, expandableEntries);
    }
    catch (err) {
        console.warn('Failed to apply entriesFilter modifications', err);
        // If there was some invalid data, let's just back out and clear it
        // entirely. This is better than applying a subset of all the hidden
        // entries, which could cause an odd state in the flamechart.
        __classPrivateFieldGet(this, _ModificationsManager_entriesFilter, "f").setHiddenAndExpandableEntries([], []);
    }
};
//# sourceMappingURL=ModificationsManager.js.map