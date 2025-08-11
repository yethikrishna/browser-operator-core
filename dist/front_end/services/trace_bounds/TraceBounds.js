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
var _BoundsManager_currentState;
import * as Trace from '../../models/trace/trace.js';
let instance = null;
export class StateChangedEvent extends Event {
    constructor(state, updateType, options = { shouldAnimate: false }) {
        super(StateChangedEvent.eventName, { composed: true, bubbles: true });
        this.state = state;
        this.updateType = updateType;
        this.options = options;
    }
}
StateChangedEvent.eventName = 'traceboundsstatechanged';
// Exposed as a shortcut to BoundsManager.instance().addEventListener, which
// also takes care of type-casting the event to StateChangedEvent.
export function onChange(cb) {
    BoundsManager.instance().addEventListener(StateChangedEvent.eventName, 
    // Cast the callback as TS doesn't know that these events will emit
    // StateChangedEvent types.
    cb);
}
export function removeListener(cb) {
    BoundsManager.instance().removeEventListener(StateChangedEvent.eventName, cb);
}
export class BoundsManager extends EventTarget {
    static instance(opts = { forceNew: null }) {
        const forceNew = Boolean(opts.forceNew);
        if (!instance || forceNew) {
            instance = new BoundsManager();
        }
        return instance;
    }
    static removeInstance() {
        instance = null;
    }
    constructor() {
        // Defined to enable us to mark it as Private.
        super();
        _BoundsManager_currentState.set(this, null);
    }
    resetWithNewBounds(initialBounds) {
        __classPrivateFieldSet(this, _BoundsManager_currentState, {
            entireTraceBounds: initialBounds,
            minimapTraceBounds: initialBounds,
            timelineTraceWindow: initialBounds,
        }, "f");
        this.dispatchEvent(new StateChangedEvent(this.state(), 'RESET'));
        return this;
    }
    state() {
        if (__classPrivateFieldGet(this, _BoundsManager_currentState, "f") === null) {
            return null;
        }
        const entireBoundsMilli = Trace.Helpers.Timing.traceWindowMilliSeconds(__classPrivateFieldGet(this, _BoundsManager_currentState, "f").entireTraceBounds);
        const minimapBoundsMilli = Trace.Helpers.Timing.traceWindowMilliSeconds(__classPrivateFieldGet(this, _BoundsManager_currentState, "f").minimapTraceBounds);
        const timelineTraceWindowMilli = Trace.Helpers.Timing.traceWindowMilliSeconds(__classPrivateFieldGet(this, _BoundsManager_currentState, "f").timelineTraceWindow);
        return {
            micro: __classPrivateFieldGet(this, _BoundsManager_currentState, "f"),
            milli: {
                entireTraceBounds: entireBoundsMilli,
                minimapTraceBounds: minimapBoundsMilli,
                timelineTraceWindow: timelineTraceWindowMilli,
            },
        };
    }
    setMiniMapBounds(newBounds) {
        if (!__classPrivateFieldGet(this, _BoundsManager_currentState, "f")) {
            // If we don't have the existing state and know the trace bounds, we
            // cannot set the minimap bounds.
            console.error('TraceBounds.setMiniMapBounds could not set bounds because there is no existing trace window set.');
            return;
        }
        const existingBounds = __classPrivateFieldGet(this, _BoundsManager_currentState, "f").minimapTraceBounds;
        if (newBounds.min === existingBounds.min && newBounds.max === existingBounds.max) {
            // New bounds are identical to the old ones so no action required.
            return;
        }
        if (newBounds.range < 1000) {
            // Minimum minimap bounds range is 1 millisecond.
            return;
        }
        __classPrivateFieldGet(this, _BoundsManager_currentState, "f").minimapTraceBounds = newBounds;
        // this.state() cannot be null here.
        this.dispatchEvent(new StateChangedEvent(this.state(), 'MINIMAP_BOUNDS'));
    }
    /**
     * Updates the visible part of the trace that the user can see.
     * @param options.ignoreMiniMapBounds - by default the visible window will be
     * bound by the minimap bounds. If you set this to `true` then the timeline
     * visible window will not be constrained by the minimap bounds. Be careful
     * with this! Unless you deal with this situation, the UI of the performance
     * panel will break.
     */
    setTimelineVisibleWindow(newWindow, options = {
        shouldAnimate: false,
        ignoreMiniMapBounds: false,
    }) {
        if (!__classPrivateFieldGet(this, _BoundsManager_currentState, "f")) {
            // This is a weird state to be in: we can't change the visible timeline
            // window if we don't already have an existing state with the trace
            // bounds set.
            console.error('TraceBounds.setTimelineVisibleWindow could not set bounds because there is no existing trace window set.');
            return;
        }
        const existingWindow = __classPrivateFieldGet(this, _BoundsManager_currentState, "f").timelineTraceWindow;
        if (newWindow.range < 1000) {
            // Minimum timeline visible window range is 1 millisecond.
            return;
        }
        if (newWindow.min === existingWindow.min && newWindow.max === existingWindow.max) {
            // New bounds are identical to the old ones so no action required.
            return;
        }
        if (!options.ignoreMiniMapBounds) {
            // Ensure that the setTimelineVisibleWindow can never go outside the bounds of the minimap bounds.
            newWindow.min = Trace.Types.Timing.Micro(Math.max(__classPrivateFieldGet(this, _BoundsManager_currentState, "f").minimapTraceBounds.min, newWindow.min));
            newWindow.max = Trace.Types.Timing.Micro(Math.min(__classPrivateFieldGet(this, _BoundsManager_currentState, "f").minimapTraceBounds.max, newWindow.max));
        }
        if (newWindow.min === existingWindow.min && newWindow.max === existingWindow.max) {
            // If, after we adjust for the minimap bounds, the new window matches the
            // old one, we can exit as no action is required.
            return;
        }
        __classPrivateFieldGet(this, _BoundsManager_currentState, "f").timelineTraceWindow = newWindow;
        this.dispatchEvent(new StateChangedEvent(this.state(), 'VISIBLE_WINDOW', { shouldAnimate: options.shouldAnimate }));
    }
}
_BoundsManager_currentState = new WeakMap();
//# sourceMappingURL=TraceBounds.js.map