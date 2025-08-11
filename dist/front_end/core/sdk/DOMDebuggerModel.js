// Copyright 2017 The Chromium Authors. All rights reserved.
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
var _DOMDebuggerModel_runtimeModelInternal, _DOMDebuggerModel_domModel, _DOMDebuggerModel_domBreakpointsInternal, _DOMDebuggerModel_domBreakpointsSetting, _EventListener_domDebuggerModelInternal, _EventListener_eventTarget, _EventListener_typeInternal, _EventListener_useCaptureInternal, _EventListener_passiveInternal, _EventListener_onceInternal, _EventListener_handlerInternal, _EventListener_originalHandlerInternal, _EventListener_locationInternal, _EventListener_sourceURLInternal, _EventListener_customRemoveFunction, _EventListener_originInternal, _CSPViolationBreakpoint_typeInternal, _DOMDebuggerManager_xhrBreakpointsSetting, _DOMDebuggerManager_xhrBreakpointsInternal, _DOMDebuggerManager_cspViolationsToBreakOn, _DOMDebuggerManager_eventListenerBreakpointsInternal;
import * as Common from '../common/common.js';
import * as Platform from '../platform/platform.js';
import { CategorizedBreakpoint } from './CategorizedBreakpoint.js';
import { DOMModel, Events as DOMModelEvents } from './DOMModel.js';
import { RemoteObject } from './RemoteObject.js';
import { RuntimeModel } from './RuntimeModel.js';
import { SDKModel } from './SDKModel.js';
import { TargetManager } from './TargetManager.js';
export class DOMDebuggerModel extends SDKModel {
    constructor(target) {
        super(target);
        _DOMDebuggerModel_runtimeModelInternal.set(this, void 0);
        _DOMDebuggerModel_domModel.set(this, void 0);
        _DOMDebuggerModel_domBreakpointsInternal.set(this, void 0);
        _DOMDebuggerModel_domBreakpointsSetting.set(this, void 0);
        this.suspended = false;
        this.agent = target.domdebuggerAgent();
        __classPrivateFieldSet(this, _DOMDebuggerModel_runtimeModelInternal, target.model(RuntimeModel), "f");
        __classPrivateFieldSet(this, _DOMDebuggerModel_domModel, target.model(DOMModel), "f");
        __classPrivateFieldGet(this, _DOMDebuggerModel_domModel, "f").addEventListener(DOMModelEvents.DocumentUpdated, this.documentUpdated, this);
        __classPrivateFieldGet(this, _DOMDebuggerModel_domModel, "f").addEventListener(DOMModelEvents.NodeRemoved, this.nodeRemoved, this);
        __classPrivateFieldSet(this, _DOMDebuggerModel_domBreakpointsInternal, [], "f");
        __classPrivateFieldSet(this, _DOMDebuggerModel_domBreakpointsSetting, Common.Settings.Settings.instance().createLocalSetting('dom-breakpoints', []), "f");
        if (__classPrivateFieldGet(this, _DOMDebuggerModel_domModel, "f").existingDocument()) {
            void this.documentUpdated();
        }
    }
    runtimeModel() {
        return __classPrivateFieldGet(this, _DOMDebuggerModel_runtimeModelInternal, "f");
    }
    async suspendModel() {
        this.suspended = true;
    }
    async resumeModel() {
        this.suspended = false;
    }
    async eventListeners(remoteObject) {
        console.assert(remoteObject.runtimeModel() === __classPrivateFieldGet(this, _DOMDebuggerModel_runtimeModelInternal, "f"));
        if (!remoteObject.objectId) {
            return [];
        }
        const listeners = await this.agent.invoke_getEventListeners({ objectId: remoteObject.objectId });
        const eventListeners = [];
        for (const payload of listeners.listeners || []) {
            const location = __classPrivateFieldGet(this, _DOMDebuggerModel_runtimeModelInternal, "f").debuggerModel().createRawLocationByScriptId(payload.scriptId, payload.lineNumber, payload.columnNumber);
            if (!location) {
                continue;
            }
            eventListeners.push(new EventListener(this, remoteObject, payload.type, payload.useCapture, payload.passive, payload.once, payload.handler ? __classPrivateFieldGet(this, _DOMDebuggerModel_runtimeModelInternal, "f").createRemoteObject(payload.handler) : null, payload.originalHandler ? __classPrivateFieldGet(this, _DOMDebuggerModel_runtimeModelInternal, "f").createRemoteObject(payload.originalHandler) : null, location, null));
        }
        return eventListeners;
    }
    retrieveDOMBreakpoints() {
        void __classPrivateFieldGet(this, _DOMDebuggerModel_domModel, "f").requestDocument();
    }
    domBreakpoints() {
        return __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsInternal, "f").slice();
    }
    hasDOMBreakpoint(node, type) {
        return __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsInternal, "f").some(breakpoint => (breakpoint.node === node && breakpoint.type === type));
    }
    setDOMBreakpoint(node, type) {
        for (const breakpoint of __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsInternal, "f")) {
            if (breakpoint.node === node && breakpoint.type === type) {
                this.toggleDOMBreakpoint(breakpoint, true);
                return breakpoint;
            }
        }
        const breakpoint = new DOMBreakpoint(this, node, type, true);
        __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsInternal, "f").push(breakpoint);
        this.enableDOMBreakpoint(breakpoint);
        this.saveDOMBreakpoints();
        this.dispatchEventToListeners("DOMBreakpointAdded" /* Events.DOM_BREAKPOINT_ADDED */, breakpoint);
        return breakpoint;
    }
    removeDOMBreakpoint(node, type) {
        this.removeDOMBreakpoints(breakpoint => breakpoint.node === node && breakpoint.type === type);
    }
    removeAllDOMBreakpoints() {
        this.removeDOMBreakpoints(_breakpoint => true);
    }
    toggleDOMBreakpoint(breakpoint, enabled) {
        if (enabled === breakpoint.enabled) {
            return;
        }
        breakpoint.enabled = enabled;
        if (enabled) {
            this.enableDOMBreakpoint(breakpoint);
        }
        else {
            this.disableDOMBreakpoint(breakpoint);
        }
        this.saveDOMBreakpoints();
        this.dispatchEventToListeners("DOMBreakpointToggled" /* Events.DOM_BREAKPOINT_TOGGLED */, breakpoint);
    }
    enableDOMBreakpoint(breakpoint) {
        if (breakpoint.node.id) {
            void this.agent.invoke_setDOMBreakpoint({ nodeId: breakpoint.node.id, type: breakpoint.type });
            breakpoint.node.setMarker(Marker, true);
        }
    }
    disableDOMBreakpoint(breakpoint) {
        if (breakpoint.node.id) {
            void this.agent.invoke_removeDOMBreakpoint({ nodeId: breakpoint.node.id, type: breakpoint.type });
            breakpoint.node.setMarker(Marker, this.nodeHasBreakpoints(breakpoint.node) ? true : null);
        }
    }
    nodeHasBreakpoints(node) {
        for (const breakpoint of __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsInternal, "f")) {
            if (breakpoint.node === node && breakpoint.enabled) {
                return true;
            }
        }
        return false;
    }
    resolveDOMBreakpointData(auxData) {
        const type = auxData['type'];
        const node = __classPrivateFieldGet(this, _DOMDebuggerModel_domModel, "f").nodeForId(auxData['nodeId']);
        if (!type || !node) {
            return null;
        }
        let targetNode = null;
        let insertion = false;
        if (type === "subtree-modified" /* Protocol.DOMDebugger.DOMBreakpointType.SubtreeModified */) {
            insertion = auxData['insertion'] || false;
            targetNode = __classPrivateFieldGet(this, _DOMDebuggerModel_domModel, "f").nodeForId(auxData['targetNodeId']);
        }
        return { type, node, targetNode, insertion };
    }
    currentURL() {
        const domDocument = __classPrivateFieldGet(this, _DOMDebuggerModel_domModel, "f").existingDocument();
        return domDocument ? domDocument.documentURL : Platform.DevToolsPath.EmptyUrlString;
    }
    async documentUpdated() {
        if (this.suspended) {
            return;
        }
        const removed = __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsInternal, "f");
        __classPrivateFieldSet(this, _DOMDebuggerModel_domBreakpointsInternal, [], "f");
        this.dispatchEventToListeners("DOMBreakpointsRemoved" /* Events.DOM_BREAKPOINTS_REMOVED */, removed);
        // this.currentURL() is empty when the page is reloaded because the
        // new document has not been requested yet and the old one has been
        // removed. Therefore, we need to request the document and wait for it.
        // Note that requestDocument() caches the document so that it is requested
        // only once.
        const document = await __classPrivateFieldGet(this, _DOMDebuggerModel_domModel, "f").requestDocument();
        const currentURL = document ? document.documentURL : Platform.DevToolsPath.EmptyUrlString;
        for (const breakpoint of __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsSetting, "f").get()) {
            if (breakpoint.url === currentURL) {
                void __classPrivateFieldGet(this, _DOMDebuggerModel_domModel, "f").pushNodeByPathToFrontend(breakpoint.path).then(appendBreakpoint.bind(this, breakpoint));
            }
        }
        function appendBreakpoint(breakpoint, nodeId) {
            const node = nodeId ? __classPrivateFieldGet(this, _DOMDebuggerModel_domModel, "f").nodeForId(nodeId) : null;
            if (!node) {
                return;
            }
            // Before creating a new DOMBreakpoint, we need to ensure there's no
            // existing breakpoint with the same node and breakpoint type, else we would create
            // multiple DOMBreakpoints of the same type and for the same node.
            for (const existingBreakpoint of __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsInternal, "f")) {
                if (existingBreakpoint.node === node && existingBreakpoint.type === breakpoint.type) {
                    return;
                }
            }
            const domBreakpoint = new DOMBreakpoint(this, node, breakpoint.type, breakpoint.enabled);
            __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsInternal, "f").push(domBreakpoint);
            if (breakpoint.enabled) {
                this.enableDOMBreakpoint(domBreakpoint);
            }
            this.dispatchEventToListeners("DOMBreakpointAdded" /* Events.DOM_BREAKPOINT_ADDED */, domBreakpoint);
        }
    }
    removeDOMBreakpoints(filter) {
        const removed = [];
        const left = [];
        for (const breakpoint of __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsInternal, "f")) {
            if (filter(breakpoint)) {
                removed.push(breakpoint);
                if (breakpoint.enabled) {
                    breakpoint.enabled = false;
                    this.disableDOMBreakpoint(breakpoint);
                }
            }
            else {
                left.push(breakpoint);
            }
        }
        if (!removed.length) {
            return;
        }
        __classPrivateFieldSet(this, _DOMDebuggerModel_domBreakpointsInternal, left, "f");
        this.saveDOMBreakpoints();
        this.dispatchEventToListeners("DOMBreakpointsRemoved" /* Events.DOM_BREAKPOINTS_REMOVED */, removed);
    }
    nodeRemoved(event) {
        if (this.suspended) {
            return;
        }
        const { node } = event.data;
        const children = node.children() || [];
        this.removeDOMBreakpoints(breakpoint => breakpoint.node === node || children.indexOf(breakpoint.node) !== -1);
    }
    saveDOMBreakpoints() {
        const currentURL = this.currentURL();
        const breakpoints = __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsSetting, "f").get().filter((breakpoint) => breakpoint.url !== currentURL);
        for (const breakpoint of __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsInternal, "f")) {
            breakpoints.push({ url: currentURL, path: breakpoint.node.path(), type: breakpoint.type, enabled: breakpoint.enabled });
        }
        __classPrivateFieldGet(this, _DOMDebuggerModel_domBreakpointsSetting, "f").set(breakpoints);
    }
}
_DOMDebuggerModel_runtimeModelInternal = new WeakMap(), _DOMDebuggerModel_domModel = new WeakMap(), _DOMDebuggerModel_domBreakpointsInternal = new WeakMap(), _DOMDebuggerModel_domBreakpointsSetting = new WeakMap();
export var Events;
(function (Events) {
    Events["DOM_BREAKPOINT_ADDED"] = "DOMBreakpointAdded";
    Events["DOM_BREAKPOINT_TOGGLED"] = "DOMBreakpointToggled";
    Events["DOM_BREAKPOINTS_REMOVED"] = "DOMBreakpointsRemoved";
})(Events || (Events = {}));
const Marker = 'breakpoint-marker';
export class DOMBreakpoint {
    constructor(domDebuggerModel, node, type, enabled) {
        this.domDebuggerModel = domDebuggerModel;
        this.node = node;
        this.type = type;
        this.enabled = enabled;
    }
}
export class EventListener {
    constructor(domDebuggerModel, eventTarget, type, useCapture, passive, once, handler, originalHandler, location, customRemoveFunction, origin) {
        _EventListener_domDebuggerModelInternal.set(this, void 0);
        _EventListener_eventTarget.set(this, void 0);
        _EventListener_typeInternal.set(this, void 0);
        _EventListener_useCaptureInternal.set(this, void 0);
        _EventListener_passiveInternal.set(this, void 0);
        _EventListener_onceInternal.set(this, void 0);
        _EventListener_handlerInternal.set(this, void 0);
        _EventListener_originalHandlerInternal.set(this, void 0);
        _EventListener_locationInternal.set(this, void 0);
        _EventListener_sourceURLInternal.set(this, void 0);
        _EventListener_customRemoveFunction.set(this, void 0);
        _EventListener_originInternal.set(this, void 0);
        __classPrivateFieldSet(this, _EventListener_domDebuggerModelInternal, domDebuggerModel, "f");
        __classPrivateFieldSet(this, _EventListener_eventTarget, eventTarget, "f");
        __classPrivateFieldSet(this, _EventListener_typeInternal, type, "f");
        __classPrivateFieldSet(this, _EventListener_useCaptureInternal, useCapture, "f");
        __classPrivateFieldSet(this, _EventListener_passiveInternal, passive, "f");
        __classPrivateFieldSet(this, _EventListener_onceInternal, once, "f");
        __classPrivateFieldSet(this, _EventListener_handlerInternal, handler, "f");
        __classPrivateFieldSet(this, _EventListener_originalHandlerInternal, originalHandler || handler, "f");
        __classPrivateFieldSet(this, _EventListener_locationInternal, location, "f");
        const script = location.script();
        __classPrivateFieldSet(this, _EventListener_sourceURLInternal, script ? script.contentURL() : Platform.DevToolsPath.EmptyUrlString, "f");
        __classPrivateFieldSet(this, _EventListener_customRemoveFunction, customRemoveFunction, "f");
        __classPrivateFieldSet(this, _EventListener_originInternal, origin || "Raw" /* EventListener.Origin.RAW */, "f");
    }
    domDebuggerModel() {
        return __classPrivateFieldGet(this, _EventListener_domDebuggerModelInternal, "f");
    }
    type() {
        return __classPrivateFieldGet(this, _EventListener_typeInternal, "f");
    }
    useCapture() {
        return __classPrivateFieldGet(this, _EventListener_useCaptureInternal, "f");
    }
    passive() {
        return __classPrivateFieldGet(this, _EventListener_passiveInternal, "f");
    }
    once() {
        return __classPrivateFieldGet(this, _EventListener_onceInternal, "f");
    }
    handler() {
        return __classPrivateFieldGet(this, _EventListener_handlerInternal, "f");
    }
    location() {
        return __classPrivateFieldGet(this, _EventListener_locationInternal, "f");
    }
    sourceURL() {
        return __classPrivateFieldGet(this, _EventListener_sourceURLInternal, "f");
    }
    originalHandler() {
        return __classPrivateFieldGet(this, _EventListener_originalHandlerInternal, "f");
    }
    canRemove() {
        return Boolean(__classPrivateFieldGet(this, _EventListener_customRemoveFunction, "f")) || __classPrivateFieldGet(this, _EventListener_originInternal, "f") !== "FrameworkUser" /* EventListener.Origin.FRAMEWORK_USER */;
    }
    remove() {
        if (!this.canRemove()) {
            return Promise.resolve(undefined);
        }
        if (__classPrivateFieldGet(this, _EventListener_originInternal, "f") !== "FrameworkUser" /* EventListener.Origin.FRAMEWORK_USER */) {
            function removeListener(type, listener, useCapture) {
                this.removeEventListener(type, listener, useCapture);
                // @ts-expect-error:
                if (this['on' + type]) {
                    // @ts-expect-error:
                    this['on' + type] = undefined;
                }
            }
            return __classPrivateFieldGet(this, _EventListener_eventTarget, "f")
                .callFunction(removeListener, [
                RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_typeInternal, "f")),
                RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_originalHandlerInternal, "f")),
                RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_useCaptureInternal, "f")),
            ])
                .then(() => undefined);
        }
        if (__classPrivateFieldGet(this, _EventListener_customRemoveFunction, "f")) {
            function callCustomRemove(type, listener, useCapture, passive) {
                this.call(null, type, listener, useCapture, passive);
            }
            return __classPrivateFieldGet(this, _EventListener_customRemoveFunction, "f")
                .callFunction(callCustomRemove, [
                RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_typeInternal, "f")),
                RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_originalHandlerInternal, "f")),
                RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_useCaptureInternal, "f")),
                RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_passiveInternal, "f")),
            ])
                .then(() => undefined);
        }
        return Promise.resolve(undefined);
    }
    canTogglePassive() {
        return __classPrivateFieldGet(this, _EventListener_originInternal, "f") !== "FrameworkUser" /* EventListener.Origin.FRAMEWORK_USER */;
    }
    togglePassive() {
        return __classPrivateFieldGet(this, _EventListener_eventTarget, "f")
            .callFunction(callTogglePassive, [
            RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_typeInternal, "f")),
            RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_originalHandlerInternal, "f")),
            RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_useCaptureInternal, "f")),
            RemoteObject.toCallArgument(__classPrivateFieldGet(this, _EventListener_passiveInternal, "f")),
        ])
            .then(() => undefined);
        function callTogglePassive(type, listener, useCapture, passive) {
            this.removeEventListener(type, listener, { capture: useCapture });
            this.addEventListener(type, listener, { capture: useCapture, passive: !passive });
        }
    }
    origin() {
        return __classPrivateFieldGet(this, _EventListener_originInternal, "f");
    }
    markAsFramework() {
        __classPrivateFieldSet(this, _EventListener_originInternal, "Framework" /* EventListener.Origin.FRAMEWORK */, "f");
    }
    isScrollBlockingType() {
        return __classPrivateFieldGet(this, _EventListener_typeInternal, "f") === 'touchstart' || __classPrivateFieldGet(this, _EventListener_typeInternal, "f") === 'touchmove' ||
            __classPrivateFieldGet(this, _EventListener_typeInternal, "f") === 'mousewheel' || __classPrivateFieldGet(this, _EventListener_typeInternal, "f") === 'wheel';
    }
}
_EventListener_domDebuggerModelInternal = new WeakMap(), _EventListener_eventTarget = new WeakMap(), _EventListener_typeInternal = new WeakMap(), _EventListener_useCaptureInternal = new WeakMap(), _EventListener_passiveInternal = new WeakMap(), _EventListener_onceInternal = new WeakMap(), _EventListener_handlerInternal = new WeakMap(), _EventListener_originalHandlerInternal = new WeakMap(), _EventListener_locationInternal = new WeakMap(), _EventListener_sourceURLInternal = new WeakMap(), _EventListener_customRemoveFunction = new WeakMap(), _EventListener_originInternal = new WeakMap();
(function (EventListener) {
    let Origin;
    (function (Origin) {
        Origin["RAW"] = "Raw";
        Origin["FRAMEWORK"] = "Framework";
        Origin["FRAMEWORK_USER"] = "FrameworkUser";
    })(Origin = EventListener.Origin || (EventListener.Origin = {}));
})(EventListener || (EventListener = {}));
export class CSPViolationBreakpoint extends CategorizedBreakpoint {
    constructor(category, type) {
        super(category, type);
        _CSPViolationBreakpoint_typeInternal.set(this, void 0);
        __classPrivateFieldSet(this, _CSPViolationBreakpoint_typeInternal, type, "f");
    }
    type() {
        return __classPrivateFieldGet(this, _CSPViolationBreakpoint_typeInternal, "f");
    }
}
_CSPViolationBreakpoint_typeInternal = new WeakMap();
export class DOMEventListenerBreakpoint extends CategorizedBreakpoint {
    constructor(eventName, eventTargetNames, category) {
        super(category, eventName);
        this.eventTargetNames = eventTargetNames;
    }
    setEnabled(enabled) {
        if (this.enabled() === enabled) {
            return;
        }
        super.setEnabled(enabled);
        for (const model of TargetManager.instance().models(DOMDebuggerModel)) {
            this.updateOnModel(model);
        }
    }
    updateOnModel(model) {
        for (const eventTargetName of this.eventTargetNames) {
            if (this.enabled()) {
                void model.agent.invoke_setEventListenerBreakpoint({ eventName: this.name, targetName: eventTargetName });
            }
            else {
                void model.agent.invoke_removeEventListenerBreakpoint({ eventName: this.name, targetName: eventTargetName });
            }
        }
    }
}
DOMEventListenerBreakpoint.listener = 'listener:';
let domDebuggerManagerInstance;
export class DOMDebuggerManager {
    constructor() {
        _DOMDebuggerManager_xhrBreakpointsSetting.set(this, void 0);
        _DOMDebuggerManager_xhrBreakpointsInternal.set(this, new Map());
        _DOMDebuggerManager_cspViolationsToBreakOn.set(this, []);
        _DOMDebuggerManager_eventListenerBreakpointsInternal.set(this, []);
        __classPrivateFieldSet(this, _DOMDebuggerManager_xhrBreakpointsSetting, Common.Settings.Settings.instance().createLocalSetting('xhr-breakpoints', []), "f");
        for (const breakpoint of __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsSetting, "f").get()) {
            __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsInternal, "f").set(breakpoint.url, breakpoint.enabled);
        }
        __classPrivateFieldGet(this, _DOMDebuggerManager_cspViolationsToBreakOn, "f").push(new CSPViolationBreakpoint("trusted-type-violation" /* Category.TRUSTED_TYPE_VIOLATION */, "trustedtype-sink-violation" /* Protocol.DOMDebugger.CSPViolationType.TrustedtypeSinkViolation */));
        __classPrivateFieldGet(this, _DOMDebuggerManager_cspViolationsToBreakOn, "f").push(new CSPViolationBreakpoint("trusted-type-violation" /* Category.TRUSTED_TYPE_VIOLATION */, "trustedtype-policy-violation" /* Protocol.DOMDebugger.CSPViolationType.TrustedtypePolicyViolation */));
        this.createEventListenerBreakpoints("media" /* Category.MEDIA */, [
            'play', 'pause', 'playing', 'canplay', 'canplaythrough', 'seeking',
            'seeked', 'timeupdate', 'ended', 'ratechange', 'durationchange', 'volumechange',
            'loadstart', 'progress', 'suspend', 'abort', 'error', 'emptied',
            'stalled', 'loadedmetadata', 'loadeddata', 'waiting',
        ], ['audio', 'video']);
        this.createEventListenerBreakpoints("picture-in-picture" /* Category.PICTURE_IN_PICTURE */, ['enterpictureinpicture', 'leavepictureinpicture'], ['video']);
        this.createEventListenerBreakpoints("picture-in-picture" /* Category.PICTURE_IN_PICTURE */, ['resize'], ['PictureInPictureWindow']);
        this.createEventListenerBreakpoints("picture-in-picture" /* Category.PICTURE_IN_PICTURE */, ['enter'], ['documentPictureInPicture']);
        this.createEventListenerBreakpoints("clipboard" /* Category.CLIPBOARD */, ['copy', 'cut', 'paste', 'beforecopy', 'beforecut', 'beforepaste'], ['*']);
        this.createEventListenerBreakpoints("control" /* Category.CONTROL */, [
            'resize',
            'scroll',
            'scrollend',
            'scrollsnapchange',
            'scrollsnapchanging',
            'zoom',
            'focus',
            'blur',
            'select',
            'change',
            'submit',
            'reset',
        ], ['*']);
        this.createEventListenerBreakpoints("device" /* Category.DEVICE */, ['deviceorientation', 'devicemotion'], ['*']);
        this.createEventListenerBreakpoints("dom-mutation" /* Category.DOM_MUTATION */, [
            'DOMActivate',
            'DOMFocusIn',
            'DOMFocusOut',
            'DOMAttrModified',
            'DOMCharacterDataModified',
            'DOMNodeInserted',
            'DOMNodeInsertedIntoDocument',
            'DOMNodeRemoved',
            'DOMNodeRemovedFromDocument',
            'DOMSubtreeModified',
            'DOMContentLoaded',
        ], ['*']);
        this.createEventListenerBreakpoints("drag-drop" /* Category.DRAG_DROP */, ['drag', 'dragstart', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop'], ['*']);
        this.createEventListenerBreakpoints("keyboard" /* Category.KEYBOARD */, ['keydown', 'keyup', 'keypress', 'input'], ['*']);
        this.createEventListenerBreakpoints("load" /* Category.LOAD */, [
            'load',
            'beforeunload',
            'unload',
            'abort',
            'error',
            'hashchange',
            'popstate',
            'navigate',
            'navigatesuccess',
            'navigateerror',
            'currentchange',
            'navigateto',
            'navigatefrom',
            'finish',
            'dispose',
        ], ['*']);
        this.createEventListenerBreakpoints("mouse" /* Category.MOUSE */, [
            'auxclick',
            'click',
            'dblclick',
            'mousedown',
            'mouseup',
            'mouseover',
            'mousemove',
            'mouseout',
            'mouseenter',
            'mouseleave',
            'mousewheel',
            'wheel',
            'contextmenu',
        ], ['*']);
        this.createEventListenerBreakpoints("pointer" /* Category.POINTER */, [
            'pointerover',
            'pointerout',
            'pointerenter',
            'pointerleave',
            'pointerdown',
            'pointerup',
            'pointermove',
            'pointercancel',
            'gotpointercapture',
            'lostpointercapture',
            'pointerrawupdate',
        ], ['*']);
        this.createEventListenerBreakpoints("touch" /* Category.TOUCH */, ['touchstart', 'touchmove', 'touchend', 'touchcancel'], ['*']);
        this.createEventListenerBreakpoints("worker" /* Category.WORKER */, ['message', 'messageerror'], ['*']);
        this.createEventListenerBreakpoints("xhr" /* Category.XHR */, ['readystatechange', 'load', 'loadstart', 'loadend', 'abort', 'error', 'progress', 'timeout'], ['xmlhttprequest', 'xmlhttprequestupload']);
        TargetManager.instance().observeModels(DOMDebuggerModel, this);
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!domDebuggerManagerInstance || forceNew) {
            domDebuggerManagerInstance = new DOMDebuggerManager();
        }
        return domDebuggerManagerInstance;
    }
    cspViolationBreakpoints() {
        return __classPrivateFieldGet(this, _DOMDebuggerManager_cspViolationsToBreakOn, "f").slice();
    }
    createEventListenerBreakpoints(category, eventNames, eventTargetNames) {
        for (const eventName of eventNames) {
            __classPrivateFieldGet(this, _DOMDebuggerManager_eventListenerBreakpointsInternal, "f").push(new DOMEventListenerBreakpoint(eventName, eventTargetNames, category));
        }
    }
    resolveEventListenerBreakpoint({ eventName, targetName }) {
        const listenerPrefix = 'listener:';
        if (eventName.startsWith(listenerPrefix)) {
            eventName = eventName.substring(listenerPrefix.length);
        }
        else {
            return null;
        }
        targetName = (targetName || '*').toLowerCase();
        let result = null;
        for (const breakpoint of __classPrivateFieldGet(this, _DOMDebuggerManager_eventListenerBreakpointsInternal, "f")) {
            if (eventName && breakpoint.name === eventName && breakpoint.eventTargetNames.indexOf(targetName) !== -1) {
                result = breakpoint;
            }
            if (!result && eventName && breakpoint.name === eventName && breakpoint.eventTargetNames.indexOf('*') !== -1) {
                result = breakpoint;
            }
        }
        return result;
    }
    eventListenerBreakpoints() {
        return __classPrivateFieldGet(this, _DOMDebuggerManager_eventListenerBreakpointsInternal, "f").slice();
    }
    updateCSPViolationBreakpoints() {
        const violationTypes = __classPrivateFieldGet(this, _DOMDebuggerManager_cspViolationsToBreakOn, "f").filter(v => v.enabled()).map(v => v.type());
        for (const model of TargetManager.instance().models(DOMDebuggerModel)) {
            this.updateCSPViolationBreakpointsForModel(model, violationTypes);
        }
    }
    updateCSPViolationBreakpointsForModel(model, violationTypes) {
        void model.agent.invoke_setBreakOnCSPViolation({ violationTypes });
    }
    xhrBreakpoints() {
        return __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsInternal, "f");
    }
    saveXHRBreakpoints() {
        const breakpoints = [];
        for (const url of __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsInternal, "f").keys()) {
            breakpoints.push({ url, enabled: __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsInternal, "f").get(url) || false });
        }
        __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsSetting, "f").set(breakpoints);
    }
    addXHRBreakpoint(url, enabled) {
        __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsInternal, "f").set(url, enabled);
        if (enabled) {
            for (const model of TargetManager.instance().models(DOMDebuggerModel)) {
                void model.agent.invoke_setXHRBreakpoint({ url });
            }
        }
        this.saveXHRBreakpoints();
    }
    removeXHRBreakpoint(url) {
        const enabled = __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsInternal, "f").get(url);
        __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsInternal, "f").delete(url);
        if (enabled) {
            for (const model of TargetManager.instance().models(DOMDebuggerModel)) {
                void model.agent.invoke_removeXHRBreakpoint({ url });
            }
        }
        this.saveXHRBreakpoints();
    }
    toggleXHRBreakpoint(url, enabled) {
        __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsInternal, "f").set(url, enabled);
        for (const model of TargetManager.instance().models(DOMDebuggerModel)) {
            if (enabled) {
                void model.agent.invoke_setXHRBreakpoint({ url });
            }
            else {
                void model.agent.invoke_removeXHRBreakpoint({ url });
            }
        }
        this.saveXHRBreakpoints();
    }
    modelAdded(domDebuggerModel) {
        for (const url of __classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsInternal, "f").keys()) {
            if (__classPrivateFieldGet(this, _DOMDebuggerManager_xhrBreakpointsInternal, "f").get(url)) {
                void domDebuggerModel.agent.invoke_setXHRBreakpoint({ url });
            }
        }
        for (const breakpoint of __classPrivateFieldGet(this, _DOMDebuggerManager_eventListenerBreakpointsInternal, "f")) {
            if (breakpoint.enabled()) {
                breakpoint.updateOnModel(domDebuggerModel);
            }
        }
        const violationTypes = __classPrivateFieldGet(this, _DOMDebuggerManager_cspViolationsToBreakOn, "f").filter(v => v.enabled()).map(v => v.type());
        this.updateCSPViolationBreakpointsForModel(domDebuggerModel, violationTypes);
    }
    modelRemoved(_domDebuggerModel) {
    }
}
_DOMDebuggerManager_xhrBreakpointsSetting = new WeakMap(), _DOMDebuggerManager_xhrBreakpointsInternal = new WeakMap(), _DOMDebuggerManager_cspViolationsToBreakOn = new WeakMap(), _DOMDebuggerManager_eventListenerBreakpointsInternal = new WeakMap();
SDKModel.register(DOMDebuggerModel, { capabilities: 2 /* Capability.DOM */, autostart: false });
//# sourceMappingURL=DOMDebuggerModel.js.map