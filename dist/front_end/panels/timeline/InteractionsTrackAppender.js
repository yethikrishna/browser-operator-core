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
var _InteractionsTrackAppender_instances, _InteractionsTrackAppender_colorGenerator, _InteractionsTrackAppender_compatibilityBuilder, _InteractionsTrackAppender_parsedTrace, _InteractionsTrackAppender_appendTrackHeaderAtLevel, _InteractionsTrackAppender_appendInteractionsAtLevel, _InteractionsTrackAppender_addCandyStripeAndWarningForLongInteraction;
import * as i18n from '../../core/i18n/i18n.js';
import * as Trace from '../../models/trace/trace.js';
import * as PerfUI from '../../ui/legacy/components/perf_ui/perf_ui.js';
import { buildGroupStyle, buildTrackHeader } from './AppenderUtils.js';
import * as Components from './components/components.js';
import * as Utils from './utils/utils.js';
const UIStrings = {
    /**
     *@description Text in Timeline Flame Chart Data Provider of the Performance panel
     */
    interactions: 'Interactions',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/InteractionsTrackAppender.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class InteractionsTrackAppender {
    constructor(compatibilityBuilder, parsedTrace, colorGenerator) {
        _InteractionsTrackAppender_instances.add(this);
        this.appenderName = 'Interactions';
        _InteractionsTrackAppender_colorGenerator.set(this, void 0);
        _InteractionsTrackAppender_compatibilityBuilder.set(this, void 0);
        _InteractionsTrackAppender_parsedTrace.set(this, void 0);
        __classPrivateFieldSet(this, _InteractionsTrackAppender_compatibilityBuilder, compatibilityBuilder, "f");
        __classPrivateFieldSet(this, _InteractionsTrackAppender_colorGenerator, colorGenerator, "f");
        __classPrivateFieldSet(this, _InteractionsTrackAppender_parsedTrace, parsedTrace, "f");
    }
    /**
     * Appends into the flame chart data the data corresponding to the
     * interactions track.
     * @param trackStartLevel the horizontal level of the flame chart events where
     * the track's events will start being appended.
     * @param expanded wether the track should be rendered expanded.
     * @returns the first available level to append more data after having
     * appended the track's events.
     */
    appendTrackAtLevel(trackStartLevel, expanded) {
        if (__classPrivateFieldGet(this, _InteractionsTrackAppender_parsedTrace, "f").UserInteractions.interactionEvents.length === 0) {
            return trackStartLevel;
        }
        __classPrivateFieldGet(this, _InteractionsTrackAppender_instances, "m", _InteractionsTrackAppender_appendTrackHeaderAtLevel).call(this, trackStartLevel, expanded);
        return __classPrivateFieldGet(this, _InteractionsTrackAppender_instances, "m", _InteractionsTrackAppender_appendInteractionsAtLevel).call(this, trackStartLevel);
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
        let idForColorGeneration = Utils.EntryName.nameForEntry(event, __classPrivateFieldGet(this, _InteractionsTrackAppender_parsedTrace, "f"));
        if (Trace.Types.Events.isSyntheticInteraction(event)) {
            // Append the ID so that we vary the colours, ensuring that two events of
            // the same type are coloured differently.
            idForColorGeneration += event.interactionId;
        }
        return __classPrivateFieldGet(this, _InteractionsTrackAppender_colorGenerator, "f").colorForID(idForColorGeneration);
    }
    setPopoverInfo(event, info) {
        if (Trace.Types.Events.isSyntheticInteraction(event)) {
            const breakdown = new Components.InteractionBreakdown.InteractionBreakdown();
            breakdown.entry = event;
            info.additionalElements.push(breakdown);
        }
    }
}
_InteractionsTrackAppender_colorGenerator = new WeakMap(), _InteractionsTrackAppender_compatibilityBuilder = new WeakMap(), _InteractionsTrackAppender_parsedTrace = new WeakMap(), _InteractionsTrackAppender_instances = new WeakSet(), _InteractionsTrackAppender_appendTrackHeaderAtLevel = function _InteractionsTrackAppender_appendTrackHeaderAtLevel(currentLevel, expanded) {
    const trackIsCollapsible = __classPrivateFieldGet(this, _InteractionsTrackAppender_parsedTrace, "f").UserInteractions.interactionEvents.length > 0;
    const style = buildGroupStyle({ collapsible: trackIsCollapsible, useDecoratorsForOverview: true });
    const group = buildTrackHeader("interactions" /* VisualLoggingTrackName.INTERACTIONS */, currentLevel, i18nString(UIStrings.interactions), style, 
    /* selectable= */ true, expanded);
    __classPrivateFieldGet(this, _InteractionsTrackAppender_compatibilityBuilder, "f").registerTrackForGroup(group, this);
}, _InteractionsTrackAppender_appendInteractionsAtLevel = function _InteractionsTrackAppender_appendInteractionsAtLevel(trackStartLevel) {
    const { interactionEventsWithNoNesting, interactionsOverThreshold } = __classPrivateFieldGet(this, _InteractionsTrackAppender_parsedTrace, "f").UserInteractions;
    const addCandyStripeToLongInteraction = (event, index) => {
        // Each interaction that we drew that is over the INP threshold needs to be
        // candy-striped.
        const overThreshold = interactionsOverThreshold.has(event);
        if (!overThreshold) {
            return;
        }
        if (index !== undefined) {
            __classPrivateFieldGet(this, _InteractionsTrackAppender_instances, "m", _InteractionsTrackAppender_addCandyStripeAndWarningForLongInteraction).call(this, event, index);
        }
    };
    // Render all top level interactions (see UserInteractionsHandler for an explanation on the nesting) onto the track.
    const newLevel = __classPrivateFieldGet(this, _InteractionsTrackAppender_compatibilityBuilder, "f").appendEventsAtLevel(interactionEventsWithNoNesting, trackStartLevel, this, addCandyStripeToLongInteraction);
    return newLevel;
}, _InteractionsTrackAppender_addCandyStripeAndWarningForLongInteraction = function _InteractionsTrackAppender_addCandyStripeAndWarningForLongInteraction(entry, eventIndex) {
    const decorationsForEvent = __classPrivateFieldGet(this, _InteractionsTrackAppender_compatibilityBuilder, "f").getFlameChartTimelineData().entryDecorations[eventIndex] || [];
    decorationsForEvent.push({
        type: "CANDY" /* PerfUI.FlameChart.FlameChartDecorationType.CANDY */,
        // Where the striping starts is hard. The problem is the whole interaction, isolating the part of it *responsible* for
        // making the interaction 200ms is hard and our decoration won't do it perfectly. To simplify we just flag all the overage.
        // AKA the first 200ms of the interaction aren't flagged. A downside is we often flag a lot of render delay.
        // It'd be fair to shift the candystriping segment earlier in the interaction... Let's see what the feedback is like.
        startAtTime: Trace.Handlers.ModelHandlers.UserInteractions.LONG_INTERACTION_THRESHOLD,
    }, {
        type: "WARNING_TRIANGLE" /* PerfUI.FlameChart.FlameChartDecorationType.WARNING_TRIANGLE */,
        customEndTime: entry.processingEnd,
    });
    __classPrivateFieldGet(this, _InteractionsTrackAppender_compatibilityBuilder, "f").getFlameChartTimelineData().entryDecorations[eventIndex] = decorationsForEvent;
};
//# sourceMappingURL=InteractionsTrackAppender.js.map