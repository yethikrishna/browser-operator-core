// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EventBreakpointsManager_eventListenerBreakpointsInternal;
import { CategorizedBreakpoint } from './CategorizedBreakpoint.js';
import { SDKModel } from './SDKModel.js';
import { TargetManager } from './TargetManager.js';
export var InstrumentationNames;
(function (InstrumentationNames) {
    InstrumentationNames["BEFORE_BIDDER_WORKLET_BIDDING_START"] = "beforeBidderWorkletBiddingStart";
    InstrumentationNames["BEFORE_BIDDER_WORKLET_REPORTING_START"] = "beforeBidderWorkletReportingStart";
    InstrumentationNames["BEFORE_SELLER_WORKLET_SCORING_START"] = "beforeSellerWorkletScoringStart";
    InstrumentationNames["BEFORE_SELLER_WORKLET_REPORTING_START"] = "beforeSellerWorkletReportingStart";
    InstrumentationNames["SET_TIMEOUT"] = "setTimeout";
    InstrumentationNames["CLEAR_TIMEOUT"] = "clearTimeout";
    InstrumentationNames["SET_TIMEOUT_CALLBACK"] = "setTimeout.callback";
    InstrumentationNames["SET_INTERVAL"] = "setInterval";
    InstrumentationNames["CLEAR_INTERVAL"] = "clearInterval";
    InstrumentationNames["SET_INTERVAL_CALLBACK"] = "setInterval.callback";
    InstrumentationNames["SCRIPT_FIRST_STATEMENT"] = "scriptFirstStatement";
    InstrumentationNames["SCRIPT_BLOCKED_BY_CSP"] = "scriptBlockedByCSP";
    InstrumentationNames["SHARED_STORAGE_WORKLET_SCRIPT_FIRST_STATEMENT"] = "sharedStorageWorkletScriptFirstStatement";
    InstrumentationNames["REQUEST_ANIMATION_FRAME"] = "requestAnimationFrame";
    InstrumentationNames["CANCEL_ANIMATION_FRAME"] = "cancelAnimationFrame";
    InstrumentationNames["REQUEST_ANIMATION_FRAME_CALLBACK"] = "requestAnimationFrame.callback";
    InstrumentationNames["WEBGL_ERROR_FIRED"] = "webglErrorFired";
    InstrumentationNames["WEBGL_WARNING_FIRED"] = "webglWarningFired";
    InstrumentationNames["ELEMENT_SET_INNER_HTML"] = "Element.setInnerHTML";
    InstrumentationNames["CANVAS_CONTEXT_CREATED"] = "canvasContextCreated";
    InstrumentationNames["GEOLOCATION_GET_CURRENT_POSITION"] = "Geolocation.getCurrentPosition";
    InstrumentationNames["GEOLOCATION_WATCH_POSITION"] = "Geolocation.watchPosition";
    InstrumentationNames["NOTIFCATION_REQUEST_PERMISSION"] = "Notification.requestPermission";
    InstrumentationNames["DOM_WINDOW_CLOSE"] = "DOMWindow.close";
    InstrumentationNames["DOCUMENT_WRITE"] = "Document.write";
    InstrumentationNames["AUDIO_CONTEXT_CREATED"] = "audioContextCreated";
    InstrumentationNames["AUDIO_CONTEXT_CLOSED"] = "audioContextClosed";
    InstrumentationNames["AUDIO_CONTEXT_RESUMED"] = "audioContextResumed";
    InstrumentationNames["AUDIO_CONTEXT_SUSPENDED"] = "audioContextSuspended";
})(InstrumentationNames || (InstrumentationNames = {}));
export class EventBreakpointsModel extends SDKModel {
    constructor(target) {
        super(target);
        this.agent = target.eventBreakpointsAgent();
    }
}
// This implementation (as opposed to similar class in DOMDebuggerModel) is for
// instrumentation breakpoints in targets that run JS but do not have a DOM.
class EventListenerBreakpoint extends CategorizedBreakpoint {
    setEnabled(enabled) {
        if (this.enabled() === enabled) {
            return;
        }
        super.setEnabled(enabled);
        for (const model of TargetManager.instance().models(EventBreakpointsModel)) {
            this.updateOnModel(model);
        }
    }
    updateOnModel(model) {
        if (this.enabled()) {
            void model.agent.invoke_setInstrumentationBreakpoint({ eventName: this.name });
        }
        else {
            void model.agent.invoke_removeInstrumentationBreakpoint({ eventName: this.name });
        }
    }
}
EventListenerBreakpoint.instrumentationPrefix = 'instrumentation:';
let eventBreakpointManagerInstance;
export class EventBreakpointsManager {
    constructor() {
        _EventBreakpointsManager_eventListenerBreakpointsInternal.set(this, []);
        this.createInstrumentationBreakpoints("auction-worklet" /* Category.AUCTION_WORKLET */, [
            "beforeBidderWorkletBiddingStart" /* InstrumentationNames.BEFORE_BIDDER_WORKLET_BIDDING_START */,
            "beforeBidderWorkletReportingStart" /* InstrumentationNames.BEFORE_BIDDER_WORKLET_REPORTING_START */,
            "beforeSellerWorkletScoringStart" /* InstrumentationNames.BEFORE_SELLER_WORKLET_SCORING_START */,
            "beforeSellerWorkletReportingStart" /* InstrumentationNames.BEFORE_SELLER_WORKLET_REPORTING_START */,
        ]);
        this.createInstrumentationBreakpoints("animation" /* Category.ANIMATION */, [
            "requestAnimationFrame" /* InstrumentationNames.REQUEST_ANIMATION_FRAME */,
            "cancelAnimationFrame" /* InstrumentationNames.CANCEL_ANIMATION_FRAME */,
            "requestAnimationFrame.callback" /* InstrumentationNames.REQUEST_ANIMATION_FRAME_CALLBACK */,
        ]);
        this.createInstrumentationBreakpoints("canvas" /* Category.CANVAS */, [
            "canvasContextCreated" /* InstrumentationNames.CANVAS_CONTEXT_CREATED */,
            "webglErrorFired" /* InstrumentationNames.WEBGL_ERROR_FIRED */,
            "webglWarningFired" /* InstrumentationNames.WEBGL_WARNING_FIRED */,
        ]);
        this.createInstrumentationBreakpoints("geolocation" /* Category.GEOLOCATION */, [
            "Geolocation.getCurrentPosition" /* InstrumentationNames.GEOLOCATION_GET_CURRENT_POSITION */,
            "Geolocation.watchPosition" /* InstrumentationNames.GEOLOCATION_WATCH_POSITION */,
        ]);
        this.createInstrumentationBreakpoints("notification" /* Category.NOTIFICATION */, [
            "Notification.requestPermission" /* InstrumentationNames.NOTIFCATION_REQUEST_PERMISSION */,
        ]);
        this.createInstrumentationBreakpoints("parse" /* Category.PARSE */, [
            "Element.setInnerHTML" /* InstrumentationNames.ELEMENT_SET_INNER_HTML */,
            "Document.write" /* InstrumentationNames.DOCUMENT_WRITE */,
        ]);
        this.createInstrumentationBreakpoints("script" /* Category.SCRIPT */, [
            "scriptFirstStatement" /* InstrumentationNames.SCRIPT_FIRST_STATEMENT */,
            "scriptBlockedByCSP" /* InstrumentationNames.SCRIPT_BLOCKED_BY_CSP */,
        ]);
        this.createInstrumentationBreakpoints("shared-storage-worklet" /* Category.SHARED_STORAGE_WORKLET */, [
            "sharedStorageWorkletScriptFirstStatement" /* InstrumentationNames.SHARED_STORAGE_WORKLET_SCRIPT_FIRST_STATEMENT */,
        ]);
        this.createInstrumentationBreakpoints("timer" /* Category.TIMER */, [
            "setTimeout" /* InstrumentationNames.SET_TIMEOUT */,
            "clearTimeout" /* InstrumentationNames.CLEAR_TIMEOUT */,
            "setTimeout.callback" /* InstrumentationNames.SET_TIMEOUT_CALLBACK */,
            "setInterval" /* InstrumentationNames.SET_INTERVAL */,
            "clearInterval" /* InstrumentationNames.CLEAR_INTERVAL */,
            "setInterval.callback" /* InstrumentationNames.SET_INTERVAL_CALLBACK */,
        ]);
        this.createInstrumentationBreakpoints("window" /* Category.WINDOW */, [
            "DOMWindow.close" /* InstrumentationNames.DOM_WINDOW_CLOSE */,
        ]);
        this.createInstrumentationBreakpoints("web-audio" /* Category.WEB_AUDIO */, [
            "audioContextCreated" /* InstrumentationNames.AUDIO_CONTEXT_CREATED */,
            "audioContextClosed" /* InstrumentationNames.AUDIO_CONTEXT_CLOSED */,
            "audioContextResumed" /* InstrumentationNames.AUDIO_CONTEXT_RESUMED */,
            "audioContextSuspended" /* InstrumentationNames.AUDIO_CONTEXT_SUSPENDED */,
        ]);
        TargetManager.instance().observeModels(EventBreakpointsModel, this);
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!eventBreakpointManagerInstance || forceNew) {
            eventBreakpointManagerInstance = new EventBreakpointsManager();
        }
        return eventBreakpointManagerInstance;
    }
    createInstrumentationBreakpoints(category, instrumentationNames) {
        for (const instrumentationName of instrumentationNames) {
            __classPrivateFieldGet(this, _EventBreakpointsManager_eventListenerBreakpointsInternal, "f").push(new EventListenerBreakpoint(category, instrumentationName));
        }
    }
    eventListenerBreakpoints() {
        return __classPrivateFieldGet(this, _EventBreakpointsManager_eventListenerBreakpointsInternal, "f").slice();
    }
    resolveEventListenerBreakpoint({ eventName }) {
        if (!eventName.startsWith(EventListenerBreakpoint.instrumentationPrefix)) {
            return null;
        }
        const instrumentationName = eventName.substring(EventListenerBreakpoint.instrumentationPrefix.length);
        return __classPrivateFieldGet(this, _EventBreakpointsManager_eventListenerBreakpointsInternal, "f").find(b => b.name === instrumentationName) || null;
    }
    modelAdded(eventBreakpointModel) {
        for (const breakpoint of __classPrivateFieldGet(this, _EventBreakpointsManager_eventListenerBreakpointsInternal, "f")) {
            if (breakpoint.enabled()) {
                breakpoint.updateOnModel(eventBreakpointModel);
            }
        }
    }
    modelRemoved(_eventBreakpointModel) {
    }
}
_EventBreakpointsManager_eventListenerBreakpointsInternal = new WeakMap();
SDKModel.register(EventBreakpointsModel, { capabilities: 524288 /* Capability.EVENT_BREAKPOINTS */, autostart: false });
//# sourceMappingURL=EventBreakpointsModel.js.map