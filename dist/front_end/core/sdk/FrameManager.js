// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _FrameManager_eventListeners, _FrameManager_frames, _FrameManager_framesForTarget, _FrameManager_outermostFrame, _FrameManager_transferringFramesDataCache, _FrameManager_awaitedFrames;
import * as Common from '../common/common.js';
import { Events as ResourceTreeModelEvents, ResourceTreeModel } from './ResourceTreeModel.js';
import { TargetManager } from './TargetManager.js';
let frameManagerInstance = null;
/**
 * The FrameManager is a central storage for all #frames. It collects #frames from all
 * ResourceTreeModel-instances (one per target), so that #frames can be found by id
 * without needing to know their target.
 */
export class FrameManager extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _FrameManager_eventListeners.set(this, new WeakMap());
        // Maps frameIds to #frames and a count of how many ResourceTreeModels contain this frame.
        // (OOPIFs are usually first attached to a new target and then detached from their old target,
        // therefore being contained in 2 models for a short period of time.)
        _FrameManager_frames.set(this, new Map());
        _FrameManager_framesForTarget.set(this, new Map());
        _FrameManager_outermostFrame.set(this, null);
        _FrameManager_transferringFramesDataCache.set(this, new Map());
        _FrameManager_awaitedFrames.set(this, new Map());
        TargetManager.instance().observeModels(ResourceTreeModel, this);
    }
    static instance({ forceNew } = { forceNew: false }) {
        if (!frameManagerInstance || forceNew) {
            frameManagerInstance = new FrameManager();
        }
        return frameManagerInstance;
    }
    static removeInstance() {
        frameManagerInstance = null;
    }
    modelAdded(resourceTreeModel) {
        const addListener = resourceTreeModel.addEventListener(ResourceTreeModelEvents.FrameAdded, this.frameAdded, this);
        const detachListener = resourceTreeModel.addEventListener(ResourceTreeModelEvents.FrameDetached, this.frameDetached, this);
        const navigatedListener = resourceTreeModel.addEventListener(ResourceTreeModelEvents.FrameNavigated, this.frameNavigated, this);
        const resourceAddedListener = resourceTreeModel.addEventListener(ResourceTreeModelEvents.ResourceAdded, this.resourceAdded, this);
        __classPrivateFieldGet(this, _FrameManager_eventListeners, "f").set(resourceTreeModel, [addListener, detachListener, navigatedListener, resourceAddedListener]);
        __classPrivateFieldGet(this, _FrameManager_framesForTarget, "f").set(resourceTreeModel.target().id(), new Set());
    }
    modelRemoved(resourceTreeModel) {
        const listeners = __classPrivateFieldGet(this, _FrameManager_eventListeners, "f").get(resourceTreeModel);
        if (listeners) {
            Common.EventTarget.removeEventListeners(listeners);
        }
        // Iterate over this model's #frames and decrease their count or remove them.
        // (The ResourceTreeModel does not send FrameDetached events when a model
        // is removed.)
        const frameSet = __classPrivateFieldGet(this, _FrameManager_framesForTarget, "f").get(resourceTreeModel.target().id());
        if (frameSet) {
            for (const frameId of frameSet) {
                this.decreaseOrRemoveFrame(frameId);
            }
        }
        __classPrivateFieldGet(this, _FrameManager_framesForTarget, "f").delete(resourceTreeModel.target().id());
    }
    frameAdded(event) {
        const frame = event.data;
        const frameData = __classPrivateFieldGet(this, _FrameManager_frames, "f").get(frame.id);
        // If the frame is already in the map, increase its count, otherwise add it to the map.
        if (frameData) {
            // In order to not lose the following attributes of a frame during
            // an OOPIF transfer we need to copy them to the new frame
            frame.setCreationStackTrace(frameData.frame.getCreationStackTraceData());
            __classPrivateFieldGet(this, _FrameManager_frames, "f").set(frame.id, { frame, count: frameData.count + 1 });
        }
        else {
            // If the transferring frame's detached event is received before its frame added
            // event in the new target, the frame's cached attributes are reassigned.
            const cachedFrameAttributes = __classPrivateFieldGet(this, _FrameManager_transferringFramesDataCache, "f").get(frame.id);
            if (cachedFrameAttributes?.creationStackTrace && cachedFrameAttributes?.creationStackTraceTarget) {
                frame.setCreationStackTrace({
                    creationStackTrace: cachedFrameAttributes.creationStackTrace,
                    creationStackTraceTarget: cachedFrameAttributes.creationStackTraceTarget,
                });
            }
            __classPrivateFieldGet(this, _FrameManager_frames, "f").set(frame.id, { frame, count: 1 });
            __classPrivateFieldGet(this, _FrameManager_transferringFramesDataCache, "f").delete(frame.id);
        }
        this.resetOutermostFrame();
        // Add the frameId to the the targetId's set of frameIds.
        const frameSet = __classPrivateFieldGet(this, _FrameManager_framesForTarget, "f").get(frame.resourceTreeModel().target().id());
        if (frameSet) {
            frameSet.add(frame.id);
        }
        this.dispatchEventToListeners("FrameAddedToTarget" /* Events.FRAME_ADDED_TO_TARGET */, { frame });
        this.resolveAwaitedFrame(frame);
    }
    frameDetached(event) {
        const { frame, isSwap } = event.data;
        // Decrease the frame's count or remove it entirely from the map.
        this.decreaseOrRemoveFrame(frame.id);
        // If the transferring frame's detached event is received before its frame
        // added event in the new target, we persist some attributes of the frame here
        // so that later on the frame added event in the new target they can be reassigned.
        if (isSwap && !__classPrivateFieldGet(this, _FrameManager_frames, "f").get(frame.id)) {
            const traceData = frame.getCreationStackTraceData();
            const cachedFrameAttributes = {
                ...(traceData.creationStackTrace && { creationStackTrace: traceData.creationStackTrace }),
                ...(traceData.creationStackTrace && { creationStackTraceTarget: traceData.creationStackTraceTarget }),
            };
            __classPrivateFieldGet(this, _FrameManager_transferringFramesDataCache, "f").set(frame.id, cachedFrameAttributes);
        }
        // Remove the frameId from the target's set of frameIds.
        const frameSet = __classPrivateFieldGet(this, _FrameManager_framesForTarget, "f").get(frame.resourceTreeModel().target().id());
        if (frameSet) {
            frameSet.delete(frame.id);
        }
    }
    frameNavigated(event) {
        const frame = event.data;
        this.dispatchEventToListeners("FrameNavigated" /* Events.FRAME_NAVIGATED */, { frame });
        if (frame.isOutermostFrame()) {
            this.dispatchEventToListeners("OutermostFrameNavigated" /* Events.OUTERMOST_FRAME_NAVIGATED */, { frame });
        }
    }
    resourceAdded(event) {
        this.dispatchEventToListeners("ResourceAdded" /* Events.RESOURCE_ADDED */, { resource: event.data });
    }
    decreaseOrRemoveFrame(frameId) {
        const frameData = __classPrivateFieldGet(this, _FrameManager_frames, "f").get(frameId);
        if (frameData) {
            if (frameData.count === 1) {
                __classPrivateFieldGet(this, _FrameManager_frames, "f").delete(frameId);
                this.resetOutermostFrame();
                this.dispatchEventToListeners("FrameRemoved" /* Events.FRAME_REMOVED */, { frameId });
            }
            else {
                frameData.count--;
            }
        }
    }
    /**
     * Looks for the outermost frame in `#frames` and sets `#outermostFrame` accordingly.
     *
     * Important: This method needs to be called everytime `#frames` is updated.
     */
    resetOutermostFrame() {
        const outermostFrames = this.getAllFrames().filter(frame => frame.isOutermostFrame());
        __classPrivateFieldSet(this, _FrameManager_outermostFrame, outermostFrames.length > 0 ? outermostFrames[0] : null, "f");
    }
    /**
     * Returns the ResourceTreeFrame with a given frameId.
     * When a frame is being detached a new ResourceTreeFrame but with the same
     * frameId is created. Consequently getFrame() will return a different
     * ResourceTreeFrame after detachment. Callers of getFrame() should therefore
     * immediately use the function return value and not store it for later use.
     */
    getFrame(frameId) {
        const frameData = __classPrivateFieldGet(this, _FrameManager_frames, "f").get(frameId);
        if (frameData) {
            return frameData.frame;
        }
        return null;
    }
    getAllFrames() {
        return Array.from(__classPrivateFieldGet(this, _FrameManager_frames, "f").values(), frameData => frameData.frame);
    }
    getOutermostFrame() {
        return __classPrivateFieldGet(this, _FrameManager_outermostFrame, "f");
    }
    async getOrWaitForFrame(frameId, notInTarget) {
        const frame = this.getFrame(frameId);
        if (frame && (!notInTarget || notInTarget !== frame.resourceTreeModel().target())) {
            return frame;
        }
        return await new Promise(resolve => {
            const waiting = __classPrivateFieldGet(this, _FrameManager_awaitedFrames, "f").get(frameId);
            if (waiting) {
                waiting.push({ notInTarget, resolve });
            }
            else {
                __classPrivateFieldGet(this, _FrameManager_awaitedFrames, "f").set(frameId, [{ notInTarget, resolve }]);
            }
        });
    }
    resolveAwaitedFrame(frame) {
        const waiting = __classPrivateFieldGet(this, _FrameManager_awaitedFrames, "f").get(frame.id);
        if (!waiting) {
            return;
        }
        const newWaiting = waiting.filter(({ notInTarget, resolve }) => {
            if (!notInTarget || notInTarget !== frame.resourceTreeModel().target()) {
                resolve(frame);
                return false;
            }
            return true;
        });
        if (newWaiting.length > 0) {
            __classPrivateFieldGet(this, _FrameManager_awaitedFrames, "f").set(frame.id, newWaiting);
        }
        else {
            __classPrivateFieldGet(this, _FrameManager_awaitedFrames, "f").delete(frame.id);
        }
    }
}
_FrameManager_eventListeners = new WeakMap(), _FrameManager_frames = new WeakMap(), _FrameManager_framesForTarget = new WeakMap(), _FrameManager_outermostFrame = new WeakMap(), _FrameManager_transferringFramesDataCache = new WeakMap(), _FrameManager_awaitedFrames = new WeakMap();
export var Events;
(function (Events) {
    // The FrameAddedToTarget event is sent whenever a frame is added to a target.
    // This means that for OOPIFs it is sent twice: once when it's added to a
    // parent target and a second time when it's added to its own target.
    Events["FRAME_ADDED_TO_TARGET"] = "FrameAddedToTarget";
    Events["FRAME_NAVIGATED"] = "FrameNavigated";
    // The FrameRemoved event is only sent when a frame has been detached from
    // all targets.
    Events["FRAME_REMOVED"] = "FrameRemoved";
    Events["RESOURCE_ADDED"] = "ResourceAdded";
    Events["OUTERMOST_FRAME_NAVIGATED"] = "OutermostFrameNavigated";
})(Events || (Events = {}));
//# sourceMappingURL=FrameManager.js.map