// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _TimelineMiniMap_instances, _TimelineMiniMap_overviewComponent, _TimelineMiniMap_controls, _TimelineMiniMap_breadcrumbsUI, _TimelineMiniMap_data, _TimelineMiniMap_onTraceBoundsChangeBound, _TimelineMiniMap_onOverviewPanelWindowChanged, _TimelineMiniMap_onTraceBoundsChange, _TimelineMiniMap_updateMiniMapBoundsToFitNewWindow, _TimelineMiniMap_activateBreadcrumb, _TimelineMiniMap_setMarkers, _TimelineMiniMap_setNavigationStartEvents, _TimelineMiniMap_setInitialBreadcrumb;
import * as Common from '../../core/common/common.js';
import * as Trace from '../../models/trace/trace.js';
import * as TraceBounds from '../../services/trace_bounds/trace_bounds.js';
import * as PerfUI from '../../ui/legacy/components/perf_ui/perf_ui.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as TimelineComponents from './components/components.js';
import { ModificationsManager } from './ModificationsManager.js';
import { TimelineEventOverviewCPUActivity, TimelineEventOverviewMemory, TimelineEventOverviewNetwork, TimelineEventOverviewResponsiveness, TimelineFilmStripOverview, } from './TimelineEventOverview.js';
import miniMapStyles from './timelineMiniMap.css.js';
import { TimelineUIUtils } from './TimelineUIUtils.js';
/**
 * This component wraps the generic PerfUI Overview component and configures it
 * specifically for the Performance Panel, including injecting the CSS we use
 * to customise how the components render within the Performance Panel.
 *
 * It is also responsible for listening to events from the OverviewPane to
 * update the visible trace window, and when this happens it will update the
 * TraceBounds service with the new values.
 */
export class TimelineMiniMap extends Common.ObjectWrapper.eventMixin(UI.Widget.VBox) {
    constructor() {
        super();
        _TimelineMiniMap_instances.add(this);
        _TimelineMiniMap_overviewComponent.set(this, new PerfUI.TimelineOverviewPane.TimelineOverviewPane('timeline'));
        _TimelineMiniMap_controls.set(this, []);
        this.breadcrumbs = null;
        _TimelineMiniMap_breadcrumbsUI.set(this, void 0);
        _TimelineMiniMap_data.set(this, null);
        _TimelineMiniMap_onTraceBoundsChangeBound.set(this, __classPrivateFieldGet(this, _TimelineMiniMap_instances, "m", _TimelineMiniMap_onTraceBoundsChange).bind(this));
        this.registerRequiredCSS(miniMapStyles);
        this.element.classList.add('timeline-minimap', 'no-trace-active');
        __classPrivateFieldSet(this, _TimelineMiniMap_breadcrumbsUI, new TimelineComponents.BreadcrumbsUI.BreadcrumbsUI(), "f");
        this.element.prepend(__classPrivateFieldGet(this, _TimelineMiniMap_breadcrumbsUI, "f"));
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").show(this.element);
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").addEventListener("OverviewPaneWindowChanged" /* PerfUI.TimelineOverviewPane.Events.OVERVIEW_PANE_WINDOW_CHANGED */, event => {
            __classPrivateFieldGet(this, _TimelineMiniMap_instances, "m", _TimelineMiniMap_onOverviewPanelWindowChanged).call(this, event);
        });
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").addEventListener("OverviewPaneBreadcrumbAdded" /* PerfUI.TimelineOverviewPane.Events.OVERVIEW_PANE_BREADCRUMB_ADDED */, event => {
            this.addBreadcrumb(event.data);
        });
        // We want to add/remove an overlay for these two events, and the overlay system is controlled by
        // `TimelineFlameChartView`, so we need to dispatch them up to the `TimelinePanel` level to call
        // `TimelineFlameChartView` -> `addOverlay()/removeOverlay()`.
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").addEventListener("OverviewPaneMouseMove" /* PerfUI.TimelineOverviewPane.Events.OVERVIEW_PANE_MOUSE_MOVE */, event => {
            this.dispatchEventToListeners("OverviewPaneMouseMove" /* PerfUI.TimelineOverviewPane.Events.OVERVIEW_PANE_MOUSE_MOVE */, event.data);
        });
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").addEventListener("OverviewPaneMouseLeave" /* PerfUI.TimelineOverviewPane.Events.OVERVIEW_PANE_MOUSE_LEAVE */, () => {
            this.dispatchEventToListeners("OverviewPaneMouseLeave" /* PerfUI.TimelineOverviewPane.Events.OVERVIEW_PANE_MOUSE_LEAVE */);
        });
        __classPrivateFieldGet(this, _TimelineMiniMap_breadcrumbsUI, "f").addEventListener(TimelineComponents.BreadcrumbsUI.BreadcrumbActivatedEvent.eventName, event => {
            const { breadcrumb, childBreadcrumbsRemoved } = event;
            __classPrivateFieldGet(this, _TimelineMiniMap_instances, "m", _TimelineMiniMap_activateBreadcrumb).call(this, breadcrumb, { removeChildBreadcrumbs: Boolean(childBreadcrumbsRemoved), updateVisibleWindow: true });
        });
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").enableCreateBreadcrumbsButton();
        TraceBounds.TraceBounds.onChange(__classPrivateFieldGet(this, _TimelineMiniMap_onTraceBoundsChangeBound, "f"));
        // Set the initial bounds for the overview. Otherwise if we mount & there
        // is not an immediate RESET event, then we don't render correctly.
        const state = TraceBounds.TraceBounds.BoundsManager.instance().state();
        if (state) {
            const { timelineTraceWindow, minimapTraceBounds } = state.milli;
            __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").setWindowTimes(timelineTraceWindow.min, timelineTraceWindow.max);
            __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").setBounds(minimapTraceBounds.min, minimapTraceBounds.max);
        }
    }
    addBreadcrumb({ startTime, endTime }) {
        if (!this.breadcrumbs) {
            console.warn('ModificationsManager has not been created, therefore Breadcrumbs can not be added');
            return;
        }
        const traceBoundsState = TraceBounds.TraceBounds.BoundsManager.instance().state();
        if (!traceBoundsState) {
            return;
        }
        const bounds = traceBoundsState.milli.minimapTraceBounds;
        // The OverviewPane can emit 0 and Infinity as numbers for the range; in
        // this case we change them to be the min and max values of the minimap
        // bounds.
        const breadcrumbTimes = {
            startTime: Trace.Types.Timing.Milli(Math.max(startTime, bounds.min)),
            endTime: Trace.Types.Timing.Milli(Math.min(endTime, bounds.max)),
        };
        const newVisibleTraceWindow = Trace.Helpers.Timing.traceWindowFromMilliSeconds(breadcrumbTimes.startTime, breadcrumbTimes.endTime);
        const addedBreadcrumb = this.breadcrumbs.add(newVisibleTraceWindow);
        __classPrivateFieldGet(this, _TimelineMiniMap_breadcrumbsUI, "f").data = {
            initialBreadcrumb: this.breadcrumbs.initialBreadcrumb,
            activeBreadcrumb: addedBreadcrumb,
        };
    }
    highlightBounds(bounds, withBracket = false) {
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").highlightBounds(bounds, withBracket);
    }
    clearBoundsHighlight() {
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").clearBoundsHighlight();
    }
    reset() {
        __classPrivateFieldSet(this, _TimelineMiniMap_data, null, "f");
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").reset();
    }
    getControls() {
        return __classPrivateFieldGet(this, _TimelineMiniMap_controls, "f");
    }
    setData(data) {
        this.element.classList.toggle('no-trace-active', data === null);
        if (data === null) {
            __classPrivateFieldSet(this, _TimelineMiniMap_data, null, "f");
            __classPrivateFieldSet(this, _TimelineMiniMap_controls, [], "f");
            return;
        }
        if (__classPrivateFieldGet(this, _TimelineMiniMap_data, "f")?.parsedTrace === data.parsedTrace) {
            return;
        }
        __classPrivateFieldSet(this, _TimelineMiniMap_data, data, "f");
        __classPrivateFieldSet(this, _TimelineMiniMap_controls, [], "f");
        __classPrivateFieldGet(this, _TimelineMiniMap_instances, "m", _TimelineMiniMap_setMarkers).call(this, data.parsedTrace);
        __classPrivateFieldGet(this, _TimelineMiniMap_instances, "m", _TimelineMiniMap_setNavigationStartEvents).call(this, data.parsedTrace);
        __classPrivateFieldGet(this, _TimelineMiniMap_controls, "f").push(new TimelineEventOverviewResponsiveness(data.parsedTrace));
        __classPrivateFieldGet(this, _TimelineMiniMap_controls, "f").push(new TimelineEventOverviewCPUActivity(data.parsedTrace));
        __classPrivateFieldGet(this, _TimelineMiniMap_controls, "f").push(new TimelineEventOverviewNetwork(data.parsedTrace));
        if (data.settings.showScreenshots) {
            const filmStrip = Trace.Extras.FilmStrip.fromParsedTrace(data.parsedTrace);
            if (filmStrip.frames.length) {
                __classPrivateFieldGet(this, _TimelineMiniMap_controls, "f").push(new TimelineFilmStripOverview(filmStrip));
            }
        }
        if (data.settings.showMemory) {
            __classPrivateFieldGet(this, _TimelineMiniMap_controls, "f").push(new TimelineEventOverviewMemory(data.parsedTrace));
        }
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").setOverviewControls(__classPrivateFieldGet(this, _TimelineMiniMap_controls, "f"));
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").showingScreenshots = data.settings.showScreenshots;
        __classPrivateFieldGet(this, _TimelineMiniMap_instances, "m", _TimelineMiniMap_setInitialBreadcrumb).call(this);
    }
}
_TimelineMiniMap_overviewComponent = new WeakMap(), _TimelineMiniMap_controls = new WeakMap(), _TimelineMiniMap_breadcrumbsUI = new WeakMap(), _TimelineMiniMap_data = new WeakMap(), _TimelineMiniMap_onTraceBoundsChangeBound = new WeakMap(), _TimelineMiniMap_instances = new WeakSet(), _TimelineMiniMap_onOverviewPanelWindowChanged = function _TimelineMiniMap_onOverviewPanelWindowChanged(event) {
    const parsedTrace = __classPrivateFieldGet(this, _TimelineMiniMap_data, "f")?.parsedTrace;
    if (!parsedTrace) {
        return;
    }
    const traceBoundsState = TraceBounds.TraceBounds.BoundsManager.instance().state();
    if (!traceBoundsState) {
        return;
    }
    const left = (event.data.startTime > 0) ? event.data.startTime : traceBoundsState.milli.entireTraceBounds.min;
    const right = Number.isFinite(event.data.endTime) ? event.data.endTime : traceBoundsState.milli.entireTraceBounds.max;
    TraceBounds.TraceBounds.BoundsManager.instance().setTimelineVisibleWindow(Trace.Helpers.Timing.traceWindowFromMilliSeconds(Trace.Types.Timing.Milli(left), Trace.Types.Timing.Milli(right)), {
        shouldAnimate: true,
    });
}, _TimelineMiniMap_onTraceBoundsChange = function _TimelineMiniMap_onTraceBoundsChange(event) {
    if (event.updateType === 'RESET' || event.updateType === 'VISIBLE_WINDOW') {
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").setWindowTimes(event.state.milli.timelineTraceWindow.min, event.state.milli.timelineTraceWindow.max);
        // If the visible window has changed because we are revealing a certain
        // time period to the user, we need to ensure that this new time
        // period fits within the current minimap bounds. If it doesn't, we
        // do some work to update the minimap bounds. Note that this only
        // applies if the user has created breadcrumbs, which scope the
        // minimap. If they have not, the entire trace is the minimap, and
        // therefore there is no work to be done.
        const newWindowFitsBounds = Trace.Helpers.Timing.windowFitsInsideBounds({
            window: event.state.micro.timelineTraceWindow,
            bounds: event.state.micro.minimapTraceBounds,
        });
        if (!newWindowFitsBounds) {
            __classPrivateFieldGet(this, _TimelineMiniMap_instances, "m", _TimelineMiniMap_updateMiniMapBoundsToFitNewWindow).call(this, event.state.micro.timelineTraceWindow);
        }
    }
    if (event.updateType === 'RESET' || event.updateType === 'MINIMAP_BOUNDS') {
        __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").setBounds(event.state.milli.minimapTraceBounds.min, event.state.milli.minimapTraceBounds.max);
    }
}, _TimelineMiniMap_updateMiniMapBoundsToFitNewWindow = function _TimelineMiniMap_updateMiniMapBoundsToFitNewWindow(newWindow) {
    if (!this.breadcrumbs) {
        return;
    }
    // Find the smallest breadcrumb that fits this window.
    // Breadcrumbs are a linked list from largest to smallest so we have to
    // walk through until we find one that does not fit, and pick the last
    // before that.
    let currentBreadcrumb = this.breadcrumbs.initialBreadcrumb;
    let lastBreadcrumbThatFits = this.breadcrumbs.initialBreadcrumb;
    while (currentBreadcrumb) {
        const fits = Trace.Helpers.Timing.windowFitsInsideBounds({
            window: newWindow,
            bounds: currentBreadcrumb.window,
        });
        if (fits) {
            lastBreadcrumbThatFits = currentBreadcrumb;
        }
        else {
            // If this breadcrumb does not fit, none of its children (which are all
            // smaller by definition) will, so we can exit the loop early.
            break;
        }
        currentBreadcrumb = currentBreadcrumb.child;
    }
    // Activate the breadcrumb that fits the visible window. We do not update
    // the visible window here as we are doing this work as a reaction to
    // something else triggering a change in the window visibility.
    __classPrivateFieldGet(this, _TimelineMiniMap_instances, "m", _TimelineMiniMap_activateBreadcrumb).call(this, lastBreadcrumbThatFits, { removeChildBreadcrumbs: false, updateVisibleWindow: false });
}, _TimelineMiniMap_activateBreadcrumb = function _TimelineMiniMap_activateBreadcrumb(breadcrumb, options) {
    if (!this.breadcrumbs) {
        return;
    }
    this.breadcrumbs.setActiveBreadcrumb(breadcrumb, options);
    // Only the initial breadcrumb is passed in because breadcrumbs are stored in a linked list and breadcrumbsUI component iterates through them
    __classPrivateFieldGet(this, _TimelineMiniMap_breadcrumbsUI, "f").data = {
        initialBreadcrumb: this.breadcrumbs.initialBreadcrumb,
        activeBreadcrumb: breadcrumb,
    };
}, _TimelineMiniMap_setMarkers = function _TimelineMiniMap_setMarkers(parsedTrace) {
    const markers = new Map();
    const { Meta } = parsedTrace;
    // Only add markers for navigation start times.
    const navStartEvents = Meta.mainFrameNavigations;
    const minTimeInMilliseconds = Trace.Helpers.Timing.microToMilli(Meta.traceBounds.min);
    for (const event of navStartEvents) {
        const { startTime } = Trace.Helpers.Timing.eventTimingsMilliSeconds(event);
        markers.set(startTime, TimelineUIUtils.createEventDivider(event, minTimeInMilliseconds));
    }
    __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").setMarkers(markers);
}, _TimelineMiniMap_setNavigationStartEvents = function _TimelineMiniMap_setNavigationStartEvents(parsedTrace) {
    __classPrivateFieldGet(this, _TimelineMiniMap_overviewComponent, "f").setNavStartTimes(parsedTrace.Meta.mainFrameNavigations);
}, _TimelineMiniMap_setInitialBreadcrumb = function _TimelineMiniMap_setInitialBreadcrumb() {
    // Set the initial breadcrumb that ModificationsManager created from the initial full window
    // or loaded from the file.
    this.breadcrumbs = ModificationsManager.activeManager()?.getTimelineBreadcrumbs() ?? null;
    if (!this.breadcrumbs) {
        return;
    }
    let lastBreadcrumb = this.breadcrumbs.initialBreadcrumb;
    while (lastBreadcrumb.child !== null) {
        lastBreadcrumb = lastBreadcrumb.child;
    }
    __classPrivateFieldGet(this, _TimelineMiniMap_breadcrumbsUI, "f").data = {
        initialBreadcrumb: this.breadcrumbs.initialBreadcrumb,
        activeBreadcrumb: lastBreadcrumb,
    };
};
//# sourceMappingURL=TimelineMiniMap.js.map