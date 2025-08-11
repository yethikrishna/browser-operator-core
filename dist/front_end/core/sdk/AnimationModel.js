// Copyright (c) 2014 The Chromium Authors. All rights reserved.
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
var _AnimationDOMNode_instances, _AnimationDOMNode_domNode, _AnimationDOMNode_scrollListenersById, _AnimationDOMNode_scrollBindingListener, _AnimationDOMNode_addReportScrollPositionBinding, _AnimationDOMNode_removeReportScrollPositionBinding, _AnimationModel_animationsById, _AnimationModel_pendingAnimations, _AnimationModel_flushPendingAnimations, _AnimationImpl_animationModel, _AnimationImpl_payloadInternal, _AnimationImpl_sourceInternal, _AnimationImpl_playStateInternal, _AnimationEffect_animationModel, _AnimationEffect_payload, _AnimationEffect_keyframesRuleInternal, _AnimationEffect_deferredNodeInternal, _KeyframesRule_payload, _KeyframesRule_keyframesInternal, _KeyframeStyle_payload, _KeyframeStyle_offsetInternal, _AnimationGroup_animationModel, _AnimationGroup_idInternal, _AnimationGroup_scrollNodeInternal, _AnimationGroup_animationsInternal, _AnimationGroup_pausedInternal, _AnimationDispatcher_animationModel;
import * as Common from '../../core/common/common.js';
import { DeferredDOMNode } from './DOMModel.js';
import { RemoteObject } from './RemoteObject.js';
import { Events as ResourceTreeModelEvents, ResourceTreeModel } from './ResourceTreeModel.js';
import { Events as RuntimeModelEvents, RuntimeModel } from './RuntimeModel.js';
import { SDKModel } from './SDKModel.js';
const DEVTOOLS_ANIMATIONS_WORLD_NAME = 'devtools_animations';
const REPORT_SCROLL_POSITION_BINDING_NAME = '__devtools_report_scroll_position__';
const getScrollListenerNameInPage = (id) => `__devtools_scroll_listener_${id}__`;
async function resolveToObjectInWorld(domNode, worldName) {
    const resourceTreeModel = domNode.domModel().target().model(ResourceTreeModel);
    const pageAgent = domNode.domModel().target().pageAgent();
    for (const frame of resourceTreeModel.frames()) {
        // This returns previously created world if it exists for the frame.
        const { executionContextId } = await pageAgent.invoke_createIsolatedWorld({ frameId: frame.id, worldName });
        const object = await domNode.resolveToObject(undefined, executionContextId);
        if (object) {
            return object;
        }
    }
    return null;
}
/**
 * Provides an extension over `DOMNode` that gives it additional
 * capabilities for animation debugging, mainly:
 * - getting a node's scroll information (scroll offsets and scroll range).
 * - updating a node's scroll offset.
 * - tracking the node's scroll offsets with event listeners.
 *
 * It works by running functions on the target page, see `DOMNode`s `callFunction` method
 * for more details on how a function is called on the target page.
 *
 * For listening to events on the target page and getting notified on the devtools frontend
 * side, we're adding a binding to the page `__devtools_report_scroll_position__` in a world `devtools_animation`
 * we've created. Then, we're setting scroll listeners of the `node` in the same world which calls the binding
 * itself with the scroll offsets.
 */
export class AnimationDOMNode {
    constructor(domNode) {
        _AnimationDOMNode_instances.add(this);
        _AnimationDOMNode_domNode.set(this, void 0);
        _AnimationDOMNode_scrollListenersById.set(this, new Map());
        _AnimationDOMNode_scrollBindingListener.set(this, void 0);
        __classPrivateFieldSet(this, _AnimationDOMNode_domNode, domNode, "f");
    }
    async addScrollEventListener(onScroll) {
        AnimationDOMNode.lastAddedListenerId++;
        const id = AnimationDOMNode.lastAddedListenerId;
        __classPrivateFieldGet(this, _AnimationDOMNode_scrollListenersById, "f").set(id, onScroll);
        // Add the binding for reporting scroll events from the page if it doesn't exist.
        if (!__classPrivateFieldGet(this, _AnimationDOMNode_scrollBindingListener, "f")) {
            await __classPrivateFieldGet(this, _AnimationDOMNode_instances, "m", _AnimationDOMNode_addReportScrollPositionBinding).call(this);
        }
        const object = await resolveToObjectInWorld(__classPrivateFieldGet(this, _AnimationDOMNode_domNode, "f"), DEVTOOLS_ANIMATIONS_WORLD_NAME);
        if (!object) {
            return null;
        }
        await object.callFunction(scrollListenerInPage, [
            id,
            REPORT_SCROLL_POSITION_BINDING_NAME,
            getScrollListenerNameInPage(id),
        ].map(arg => RemoteObject.toCallArgument(arg)));
        object.release();
        return id;
        function scrollListenerInPage(id, reportScrollPositionBindingName, scrollListenerNameInPage) {
            if ('scrollingElement' in this && !this.scrollingElement) {
                return;
            }
            const scrollingElement = ('scrollingElement' in this ? this.scrollingElement : this);
            // @ts-expect-error We're setting a custom field on `Element` or `Document` for retaining the function on the page.
            this[scrollListenerNameInPage] = () => {
                // @ts-expect-error `reportScrollPosition` binding is injected to the page before calling the function.
                globalThis[reportScrollPositionBindingName](JSON.stringify({ scrollTop: scrollingElement.scrollTop, scrollLeft: scrollingElement.scrollLeft, id }));
            };
            // @ts-expect-error We've already defined the function used below.
            this.addEventListener('scroll', this[scrollListenerNameInPage], true);
        }
    }
    async removeScrollEventListener(id) {
        const object = await resolveToObjectInWorld(__classPrivateFieldGet(this, _AnimationDOMNode_domNode, "f"), DEVTOOLS_ANIMATIONS_WORLD_NAME);
        if (!object) {
            return;
        }
        await object.callFunction(removeScrollListenerInPage, [getScrollListenerNameInPage(id)].map(arg => RemoteObject.toCallArgument(arg)));
        object.release();
        __classPrivateFieldGet(this, _AnimationDOMNode_scrollListenersById, "f").delete(id);
        // There aren't any scroll listeners remained on the page
        // so we remove the binding.
        if (__classPrivateFieldGet(this, _AnimationDOMNode_scrollListenersById, "f").size === 0) {
            await __classPrivateFieldGet(this, _AnimationDOMNode_instances, "m", _AnimationDOMNode_removeReportScrollPositionBinding).call(this);
        }
        function removeScrollListenerInPage(scrollListenerNameInPage) {
            // @ts-expect-error We've already set this custom field while adding scroll listener.
            this.removeEventListener('scroll', this[scrollListenerNameInPage]);
            // @ts-expect-error We've already set this custom field while adding scroll listener.
            delete this[scrollListenerNameInPage];
        }
    }
    async scrollTop() {
        return await __classPrivateFieldGet(this, _AnimationDOMNode_domNode, "f").callFunction(scrollTopInPage).then(res => res?.value ?? null);
        function scrollTopInPage() {
            if ('scrollingElement' in this) {
                if (!this.scrollingElement) {
                    return 0;
                }
                return this.scrollingElement.scrollTop;
            }
            return this.scrollTop;
        }
    }
    async scrollLeft() {
        return await __classPrivateFieldGet(this, _AnimationDOMNode_domNode, "f").callFunction(scrollLeftInPage).then(res => res?.value ?? null);
        function scrollLeftInPage() {
            if ('scrollingElement' in this) {
                if (!this.scrollingElement) {
                    return 0;
                }
                return this.scrollingElement.scrollLeft;
            }
            return this.scrollLeft;
        }
    }
    async setScrollTop(offset) {
        await __classPrivateFieldGet(this, _AnimationDOMNode_domNode, "f").callFunction(setScrollTopInPage, [offset]);
        function setScrollTopInPage(offsetInPage) {
            if ('scrollingElement' in this) {
                if (!this.scrollingElement) {
                    return;
                }
                this.scrollingElement.scrollTop = offsetInPage;
            }
            else {
                this.scrollTop = offsetInPage;
            }
        }
    }
    async setScrollLeft(offset) {
        await __classPrivateFieldGet(this, _AnimationDOMNode_domNode, "f").callFunction(setScrollLeftInPage, [offset]);
        function setScrollLeftInPage(offsetInPage) {
            if ('scrollingElement' in this) {
                if (!this.scrollingElement) {
                    return;
                }
                this.scrollingElement.scrollLeft = offsetInPage;
            }
            else {
                this.scrollLeft = offsetInPage;
            }
        }
    }
    async verticalScrollRange() {
        return await __classPrivateFieldGet(this, _AnimationDOMNode_domNode, "f").callFunction(verticalScrollRangeInPage).then(res => res?.value ?? null);
        function verticalScrollRangeInPage() {
            if ('scrollingElement' in this) {
                if (!this.scrollingElement) {
                    return 0;
                }
                return this.scrollingElement.scrollHeight - this.scrollingElement.clientHeight;
            }
            return this.scrollHeight - this.clientHeight;
        }
    }
    async horizontalScrollRange() {
        return await __classPrivateFieldGet(this, _AnimationDOMNode_domNode, "f").callFunction(horizontalScrollRangeInPage).then(res => res?.value ?? null);
        function horizontalScrollRangeInPage() {
            if ('scrollingElement' in this) {
                if (!this.scrollingElement) {
                    return 0;
                }
                return this.scrollingElement.scrollWidth - this.scrollingElement.clientWidth;
            }
            return this.scrollWidth - this.clientWidth;
        }
    }
}
_AnimationDOMNode_domNode = new WeakMap(), _AnimationDOMNode_scrollListenersById = new WeakMap(), _AnimationDOMNode_scrollBindingListener = new WeakMap(), _AnimationDOMNode_instances = new WeakSet(), _AnimationDOMNode_addReportScrollPositionBinding = async function _AnimationDOMNode_addReportScrollPositionBinding() {
    // The binding is already added so we don't need to add it again.
    if (__classPrivateFieldGet(this, _AnimationDOMNode_scrollBindingListener, "f")) {
        return;
    }
    __classPrivateFieldSet(this, _AnimationDOMNode_scrollBindingListener, ev => {
        const { name, payload } = ev.data;
        if (name !== REPORT_SCROLL_POSITION_BINDING_NAME) {
            return;
        }
        const { scrollTop, scrollLeft, id } = JSON.parse(payload);
        const scrollListener = __classPrivateFieldGet(this, _AnimationDOMNode_scrollListenersById, "f").get(id);
        if (!scrollListener) {
            return;
        }
        scrollListener({ scrollTop, scrollLeft });
    }, "f");
    const runtimeModel = __classPrivateFieldGet(this, _AnimationDOMNode_domNode, "f").domModel().target().model(RuntimeModel);
    await runtimeModel.addBinding({
        name: REPORT_SCROLL_POSITION_BINDING_NAME,
        executionContextName: DEVTOOLS_ANIMATIONS_WORLD_NAME,
    });
    runtimeModel.addEventListener(RuntimeModelEvents.BindingCalled, __classPrivateFieldGet(this, _AnimationDOMNode_scrollBindingListener, "f"));
}, _AnimationDOMNode_removeReportScrollPositionBinding = async function _AnimationDOMNode_removeReportScrollPositionBinding() {
    // There isn't any binding added yet.
    if (!__classPrivateFieldGet(this, _AnimationDOMNode_scrollBindingListener, "f")) {
        return;
    }
    const runtimeModel = __classPrivateFieldGet(this, _AnimationDOMNode_domNode, "f").domModel().target().model(RuntimeModel);
    await runtimeModel.removeBinding({
        name: REPORT_SCROLL_POSITION_BINDING_NAME,
    });
    runtimeModel.removeEventListener(RuntimeModelEvents.BindingCalled, __classPrivateFieldGet(this, _AnimationDOMNode_scrollBindingListener, "f"));
    __classPrivateFieldSet(this, _AnimationDOMNode_scrollBindingListener, undefined, "f");
};
AnimationDOMNode.lastAddedListenerId = 0;
function shouldGroupAnimations(firstAnimation, anim) {
    const firstAnimationTimeline = firstAnimation.viewOrScrollTimeline();
    const animationTimeline = anim.viewOrScrollTimeline();
    if (firstAnimationTimeline) {
        // This is a SDA group so check whether the animation's
        // scroll container and scroll axis is the same with the first animation.
        return Boolean(animationTimeline && firstAnimationTimeline.sourceNodeId === animationTimeline.sourceNodeId &&
            firstAnimationTimeline.axis === animationTimeline.axis);
    }
    // This is a non-SDA group so check whether the coming animation
    // is a time based one too and if so, compare their start times.
    return !animationTimeline && firstAnimation.startTime() === anim.startTime();
}
export class AnimationModel extends SDKModel {
    constructor(target) {
        super(target);
        _AnimationModel_animationsById.set(this, new Map());
        this.animationGroups = new Map();
        _AnimationModel_pendingAnimations.set(this, new Set());
        this.playbackRate = 1;
        _AnimationModel_flushPendingAnimations.set(this, void 0);
        this.runtimeModel = target.model(RuntimeModel);
        this.agent = target.animationAgent();
        target.registerAnimationDispatcher(new AnimationDispatcher(this));
        if (!target.suspended()) {
            void this.agent.invoke_enable();
        }
        const resourceTreeModel = target.model(ResourceTreeModel);
        resourceTreeModel.addEventListener(ResourceTreeModelEvents.PrimaryPageChanged, this.reset, this);
        __classPrivateFieldSet(this, _AnimationModel_flushPendingAnimations, Common.Debouncer.debounce(() => {
            while (__classPrivateFieldGet(this, _AnimationModel_pendingAnimations, "f").size) {
                this.matchExistingGroups(this.createGroupFromPendingAnimations());
            }
        }, 100), "f");
    }
    reset() {
        __classPrivateFieldGet(this, _AnimationModel_animationsById, "f").clear();
        this.animationGroups.clear();
        __classPrivateFieldGet(this, _AnimationModel_pendingAnimations, "f").clear();
        this.dispatchEventToListeners(Events.ModelReset);
    }
    async devicePixelRatio() {
        const evaluateResult = await this.target().runtimeAgent().invoke_evaluate({ expression: 'window.devicePixelRatio' });
        if (evaluateResult?.result.type === 'number') {
            return evaluateResult?.result.value ?? 1;
        }
        return 1;
    }
    async getAnimationGroupForAnimation(name, nodeId) {
        for (const animationGroup of this.animationGroups.values()) {
            for (const animation of animationGroup.animations()) {
                if (animation.name() === name) {
                    const animationNode = await animation.source().node();
                    if (animationNode?.id === nodeId) {
                        return animationGroup;
                    }
                }
            }
        }
        return null;
    }
    animationCanceled(id) {
        __classPrivateFieldGet(this, _AnimationModel_pendingAnimations, "f").delete(id);
    }
    async animationUpdated(payload) {
        let foundAnimationGroup;
        let foundAnimation;
        for (const animationGroup of this.animationGroups.values()) {
            foundAnimation = animationGroup.animations().find(animation => animation.id() === payload.id);
            if (foundAnimation) {
                foundAnimationGroup = animationGroup;
                break;
            }
        }
        if (!foundAnimation || !foundAnimationGroup) {
            return;
        }
        await foundAnimation.setPayload(payload);
        this.dispatchEventToListeners(Events.AnimationGroupUpdated, foundAnimationGroup);
    }
    async animationStarted(payload) {
        // We are not interested in animations without effect or target.
        if (!payload.source || !payload.source.backendNodeId) {
            return;
        }
        const animation = await AnimationImpl.parsePayload(this, payload);
        // Ignore Web Animations custom effects & groups.
        const keyframesRule = animation.source().keyframesRule();
        if (animation.type() === 'WebAnimation' && keyframesRule && keyframesRule.keyframes().length === 0) {
            __classPrivateFieldGet(this, _AnimationModel_pendingAnimations, "f").delete(animation.id());
        }
        else {
            __classPrivateFieldGet(this, _AnimationModel_animationsById, "f").set(animation.id(), animation);
            __classPrivateFieldGet(this, _AnimationModel_pendingAnimations, "f").add(animation.id());
        }
        __classPrivateFieldGet(this, _AnimationModel_flushPendingAnimations, "f").call(this);
    }
    matchExistingGroups(incomingGroup) {
        let matchedGroup = null;
        for (const group of this.animationGroups.values()) {
            if (group.matches(incomingGroup)) {
                matchedGroup = group;
                group.rebaseTo(incomingGroup);
                break;
            }
            if (group.shouldInclude(incomingGroup)) {
                matchedGroup = group;
                group.appendAnimations(incomingGroup.animations());
                break;
            }
        }
        if (!matchedGroup) {
            this.animationGroups.set(incomingGroup.id(), incomingGroup);
            this.dispatchEventToListeners(Events.AnimationGroupStarted, incomingGroup);
        }
        else {
            this.dispatchEventToListeners(Events.AnimationGroupUpdated, matchedGroup);
        }
        return Boolean(matchedGroup);
    }
    createGroupFromPendingAnimations() {
        console.assert(__classPrivateFieldGet(this, _AnimationModel_pendingAnimations, "f").size > 0);
        const firstAnimationId = __classPrivateFieldGet(this, _AnimationModel_pendingAnimations, "f").values().next().value;
        __classPrivateFieldGet(this, _AnimationModel_pendingAnimations, "f").delete(firstAnimationId);
        const firstAnimation = __classPrivateFieldGet(this, _AnimationModel_animationsById, "f").get(firstAnimationId);
        if (!firstAnimation) {
            throw new Error('Unable to locate first animation');
        }
        const groupedAnimations = [firstAnimation];
        const remainingAnimations = new Set();
        for (const id of __classPrivateFieldGet(this, _AnimationModel_pendingAnimations, "f")) {
            const anim = __classPrivateFieldGet(this, _AnimationModel_animationsById, "f").get(id);
            if (shouldGroupAnimations(firstAnimation, anim)) {
                groupedAnimations.push(anim);
            }
            else {
                remainingAnimations.add(id);
            }
        }
        __classPrivateFieldSet(this, _AnimationModel_pendingAnimations, remainingAnimations, "f");
        // Show the first starting animation at the top of the animations of the animation group.
        groupedAnimations.sort((anim1, anim2) => anim1.startTime() - anim2.startTime());
        return new AnimationGroup(this, firstAnimationId, groupedAnimations);
    }
    setPlaybackRate(playbackRate) {
        this.playbackRate = playbackRate;
        void this.agent.invoke_setPlaybackRate({ playbackRate });
    }
    async releaseAllAnimations() {
        const animationIds = [...this.animationGroups.values()].flatMap(animationGroup => animationGroup.animations().map(animation => animation.id()));
        await this.agent.invoke_releaseAnimations({ animations: animationIds });
    }
    releaseAnimations(animations) {
        void this.agent.invoke_releaseAnimations({ animations });
    }
    async suspendModel() {
        await this.agent.invoke_disable().then(() => this.reset());
    }
    async resumeModel() {
        await this.agent.invoke_enable();
    }
}
_AnimationModel_animationsById = new WeakMap(), _AnimationModel_pendingAnimations = new WeakMap(), _AnimationModel_flushPendingAnimations = new WeakMap();
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["AnimationGroupStarted"] = "AnimationGroupStarted";
    Events["AnimationGroupUpdated"] = "AnimationGroupUpdated";
    Events["ModelReset"] = "ModelReset";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
export class AnimationImpl {
    constructor(animationModel) {
        _AnimationImpl_animationModel.set(this, void 0);
        _AnimationImpl_payloadInternal.set(this, void 0); // Assertion is safe because only way to create `AnimationImpl` is to use `parsePayload` which calls `setPayload` and sets the value.
        _AnimationImpl_sourceInternal.set(this, void 0); // Assertion is safe because only way to create `AnimationImpl` is to use `parsePayload` which calls `setPayload` and sets the value.
        _AnimationImpl_playStateInternal.set(this, void 0);
        __classPrivateFieldSet(this, _AnimationImpl_animationModel, animationModel, "f");
    }
    static async parsePayload(animationModel, payload) {
        const animation = new AnimationImpl(animationModel);
        await animation.setPayload(payload);
        return animation;
    }
    async setPayload(payload) {
        // TODO(b/40929569): Remove normalizing by devicePixelRatio after the attached bug is resolved.
        if (payload.viewOrScrollTimeline) {
            const devicePixelRatio = await __classPrivateFieldGet(this, _AnimationImpl_animationModel, "f").devicePixelRatio();
            if (payload.viewOrScrollTimeline.startOffset) {
                payload.viewOrScrollTimeline.startOffset /= devicePixelRatio;
            }
            if (payload.viewOrScrollTimeline.endOffset) {
                payload.viewOrScrollTimeline.endOffset /= devicePixelRatio;
            }
        }
        __classPrivateFieldSet(this, _AnimationImpl_payloadInternal, payload, "f");
        if (__classPrivateFieldGet(this, _AnimationImpl_sourceInternal, "f") && payload.source) {
            __classPrivateFieldGet(this, _AnimationImpl_sourceInternal, "f").setPayload(payload.source);
        }
        else if (!__classPrivateFieldGet(this, _AnimationImpl_sourceInternal, "f") && payload.source) {
            __classPrivateFieldSet(this, _AnimationImpl_sourceInternal, new AnimationEffect(__classPrivateFieldGet(this, _AnimationImpl_animationModel, "f"), payload.source), "f");
        }
    }
    // `startTime` and `duration` is represented as the
    // percentage of the view timeline range that starts at `startOffset`px
    // from the scroll container and ends at `endOffset`px of the scroll container.
    // This takes a percentage of the timeline range and returns the absolute
    // pixels values as a scroll offset of the scroll container.
    percentageToPixels(percentage, viewOrScrollTimeline) {
        const { startOffset, endOffset } = viewOrScrollTimeline;
        if (startOffset === undefined || endOffset === undefined) {
            // We don't expect this situation to occur since after an animation is started
            // we expect the scroll offsets to be resolved and provided correctly. If `startOffset`
            // or `endOffset` is not provided in a viewOrScrollTimeline; we can assume that there is a bug here
            // so it's fine to throw an error.
            throw new Error('startOffset or endOffset does not exist in viewOrScrollTimeline');
        }
        return (endOffset - startOffset) * (percentage / 100);
    }
    viewOrScrollTimeline() {
        return __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").viewOrScrollTimeline;
    }
    id() {
        return __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").id;
    }
    name() {
        return __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").name;
    }
    paused() {
        return __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").pausedState;
    }
    playState() {
        return __classPrivateFieldGet(this, _AnimationImpl_playStateInternal, "f") || __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").playState;
    }
    playbackRate() {
        return __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").playbackRate;
    }
    // For scroll driven animations, it returns the pixel offset in the scroll container
    // For time animations, it returns milliseconds.
    startTime() {
        const viewOrScrollTimeline = this.viewOrScrollTimeline();
        if (viewOrScrollTimeline) {
            return this.percentageToPixels(this.playbackRate() > 0 ? __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").startTime : 100 - __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").startTime, viewOrScrollTimeline) +
                (this.viewOrScrollTimeline()?.startOffset ?? 0);
        }
        return __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").startTime;
    }
    // For scroll driven animations, it returns the duration in pixels (i.e. after how many pixels of scroll the animation is going to end)
    // For time animations, it returns milliseconds.
    iterationDuration() {
        const viewOrScrollTimeline = this.viewOrScrollTimeline();
        if (viewOrScrollTimeline) {
            return this.percentageToPixels(this.source().duration(), viewOrScrollTimeline);
        }
        return this.source().duration();
    }
    // For scroll driven animations, it returns the duration in pixels (i.e. after how many pixels of scroll the animation is going to end)
    // For time animations, it returns milliseconds.
    endTime() {
        if (!this.source().iterations) {
            return Infinity;
        }
        if (this.viewOrScrollTimeline()) {
            return this.startTime() + this.iterationDuration() * this.source().iterations();
        }
        return this.startTime() + this.source().delay() + this.source().duration() * this.source().iterations() +
            this.source().endDelay();
    }
    // For scroll driven animations, it returns the duration in pixels (i.e. after how many pixels of scroll the animation is going to end)
    // For time animations, it returns milliseconds.
    finiteDuration() {
        const iterations = Math.min(this.source().iterations(), 3);
        if (this.viewOrScrollTimeline()) {
            return this.iterationDuration() * iterations;
        }
        return this.source().delay() + this.source().duration() * iterations;
    }
    // For scroll driven animations, it returns the duration in pixels (i.e. after how many pixels of scroll the animation is going to end)
    // For time animations, it returns milliseconds.
    currentTime() {
        const viewOrScrollTimeline = this.viewOrScrollTimeline();
        if (viewOrScrollTimeline) {
            return this.percentageToPixels(__classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").currentTime, viewOrScrollTimeline);
        }
        return __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").currentTime;
    }
    source() {
        return __classPrivateFieldGet(this, _AnimationImpl_sourceInternal, "f");
    }
    type() {
        return __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").type;
    }
    overlaps(animation) {
        // Infinite animations
        if (!this.source().iterations() || !animation.source().iterations()) {
            return true;
        }
        const firstAnimation = this.startTime() < animation.startTime() ? this : animation;
        const secondAnimation = firstAnimation === this ? animation : this;
        return firstAnimation.endTime() >= secondAnimation.startTime();
    }
    // Utility method for returning `delay` for time based animations
    // and `startTime` in pixels for scroll driven animations. It is used to
    // find the exact starting time of the first keyframe for both cases.
    delayOrStartTime() {
        if (this.viewOrScrollTimeline()) {
            return this.startTime();
        }
        return this.source().delay();
    }
    setTiming(duration, delay) {
        void __classPrivateFieldGet(this, _AnimationImpl_sourceInternal, "f").node().then(node => {
            if (!node) {
                throw new Error('Unable to find node');
            }
            this.updateNodeStyle(duration, delay, node);
        });
        __classPrivateFieldGet(this, _AnimationImpl_sourceInternal, "f").durationInternal = duration;
        __classPrivateFieldGet(this, _AnimationImpl_sourceInternal, "f").delayInternal = delay;
        void __classPrivateFieldGet(this, _AnimationImpl_animationModel, "f").agent.invoke_setTiming({ animationId: this.id(), duration, delay });
    }
    updateNodeStyle(duration, delay, node) {
        let animationPrefix;
        if (this.type() === "CSSTransition" /* Protocol.Animation.AnimationType.CSSTransition */) {
            animationPrefix = 'transition-';
        }
        else if (this.type() === "CSSAnimation" /* Protocol.Animation.AnimationType.CSSAnimation */) {
            animationPrefix = 'animation-';
        }
        else {
            return;
        }
        if (!node.id) {
            throw new Error('Node has no id');
        }
        const cssModel = node.domModel().cssModel();
        cssModel.setEffectivePropertyValueForNode(node.id, animationPrefix + 'duration', duration + 'ms');
        cssModel.setEffectivePropertyValueForNode(node.id, animationPrefix + 'delay', delay + 'ms');
    }
    async remoteObjectPromise() {
        const payload = await __classPrivateFieldGet(this, _AnimationImpl_animationModel, "f").agent.invoke_resolveAnimation({ animationId: this.id() });
        if (!payload) {
            return null;
        }
        return __classPrivateFieldGet(this, _AnimationImpl_animationModel, "f").runtimeModel.createRemoteObject(payload.remoteObject);
    }
    cssId() {
        return __classPrivateFieldGet(this, _AnimationImpl_payloadInternal, "f").cssId || '';
    }
}
_AnimationImpl_animationModel = new WeakMap(), _AnimationImpl_payloadInternal = new WeakMap(), _AnimationImpl_sourceInternal = new WeakMap(), _AnimationImpl_playStateInternal = new WeakMap();
export class AnimationEffect {
    constructor(animationModel, payload) {
        _AnimationEffect_animationModel.set(this, void 0);
        _AnimationEffect_payload.set(this, void 0); // Assertion is safe because `setPayload` call in `constructor` sets the value.
        _AnimationEffect_keyframesRuleInternal.set(this, void 0);
        _AnimationEffect_deferredNodeInternal.set(this, void 0);
        __classPrivateFieldSet(this, _AnimationEffect_animationModel, animationModel, "f");
        this.setPayload(payload);
    }
    setPayload(payload) {
        __classPrivateFieldSet(this, _AnimationEffect_payload, payload, "f");
        if (!__classPrivateFieldGet(this, _AnimationEffect_keyframesRuleInternal, "f") && payload.keyframesRule) {
            __classPrivateFieldSet(this, _AnimationEffect_keyframesRuleInternal, new KeyframesRule(payload.keyframesRule), "f");
        }
        else if (__classPrivateFieldGet(this, _AnimationEffect_keyframesRuleInternal, "f") && payload.keyframesRule) {
            __classPrivateFieldGet(this, _AnimationEffect_keyframesRuleInternal, "f").setPayload(payload.keyframesRule);
        }
        this.delayInternal = payload.delay;
        this.durationInternal = payload.duration;
    }
    delay() {
        return this.delayInternal;
    }
    endDelay() {
        return __classPrivateFieldGet(this, _AnimationEffect_payload, "f").endDelay;
    }
    iterations() {
        // Animations with zero duration, zero delays and infinite iterations can't be shown.
        if (!this.delay() && !this.endDelay() && !this.duration()) {
            return 0;
        }
        return __classPrivateFieldGet(this, _AnimationEffect_payload, "f").iterations || Infinity;
    }
    duration() {
        return this.durationInternal;
    }
    direction() {
        return __classPrivateFieldGet(this, _AnimationEffect_payload, "f").direction;
    }
    fill() {
        return __classPrivateFieldGet(this, _AnimationEffect_payload, "f").fill;
    }
    node() {
        if (!__classPrivateFieldGet(this, _AnimationEffect_deferredNodeInternal, "f")) {
            __classPrivateFieldSet(this, _AnimationEffect_deferredNodeInternal, new DeferredDOMNode(__classPrivateFieldGet(this, _AnimationEffect_animationModel, "f").target(), this.backendNodeId()), "f");
        }
        return __classPrivateFieldGet(this, _AnimationEffect_deferredNodeInternal, "f").resolvePromise();
    }
    deferredNode() {
        return new DeferredDOMNode(__classPrivateFieldGet(this, _AnimationEffect_animationModel, "f").target(), this.backendNodeId());
    }
    backendNodeId() {
        return __classPrivateFieldGet(this, _AnimationEffect_payload, "f").backendNodeId;
    }
    keyframesRule() {
        return __classPrivateFieldGet(this, _AnimationEffect_keyframesRuleInternal, "f") || null;
    }
    easing() {
        return __classPrivateFieldGet(this, _AnimationEffect_payload, "f").easing;
    }
}
_AnimationEffect_animationModel = new WeakMap(), _AnimationEffect_payload = new WeakMap(), _AnimationEffect_keyframesRuleInternal = new WeakMap(), _AnimationEffect_deferredNodeInternal = new WeakMap();
export class KeyframesRule {
    constructor(payload) {
        _KeyframesRule_payload.set(this, void 0); // Assertion is safe because `setPayload` call in `constructor` sets the value.;
        _KeyframesRule_keyframesInternal.set(this, void 0); // Assertion is safe because `setPayload` call in `constructor` sets the value.;
        this.setPayload(payload);
    }
    setPayload(payload) {
        __classPrivateFieldSet(this, _KeyframesRule_payload, payload, "f");
        if (!__classPrivateFieldGet(this, _KeyframesRule_keyframesInternal, "f")) {
            __classPrivateFieldSet(this, _KeyframesRule_keyframesInternal, __classPrivateFieldGet(this, _KeyframesRule_payload, "f").keyframes.map(keyframeStyle => new KeyframeStyle(keyframeStyle)), "f");
        }
        else {
            __classPrivateFieldGet(this, _KeyframesRule_payload, "f").keyframes.forEach((keyframeStyle, index) => {
                __classPrivateFieldGet(this, _KeyframesRule_keyframesInternal, "f")[index]?.setPayload(keyframeStyle);
            });
        }
    }
    name() {
        return __classPrivateFieldGet(this, _KeyframesRule_payload, "f").name;
    }
    keyframes() {
        return __classPrivateFieldGet(this, _KeyframesRule_keyframesInternal, "f");
    }
}
_KeyframesRule_payload = new WeakMap(), _KeyframesRule_keyframesInternal = new WeakMap();
export class KeyframeStyle {
    constructor(payload) {
        _KeyframeStyle_payload.set(this, void 0); // Assertion is safe because `setPayload` call in `constructor` sets the value.
        _KeyframeStyle_offsetInternal.set(this, void 0); // Assertion is safe because `setPayload` call in `constructor` sets the value.
        this.setPayload(payload);
    }
    setPayload(payload) {
        __classPrivateFieldSet(this, _KeyframeStyle_payload, payload, "f");
        __classPrivateFieldSet(this, _KeyframeStyle_offsetInternal, payload.offset, "f");
    }
    offset() {
        return __classPrivateFieldGet(this, _KeyframeStyle_offsetInternal, "f");
    }
    setOffset(offset) {
        __classPrivateFieldSet(this, _KeyframeStyle_offsetInternal, offset * 100 + '%', "f");
    }
    offsetAsNumber() {
        return parseFloat(__classPrivateFieldGet(this, _KeyframeStyle_offsetInternal, "f")) / 100;
    }
    easing() {
        return __classPrivateFieldGet(this, _KeyframeStyle_payload, "f").easing;
    }
}
_KeyframeStyle_payload = new WeakMap(), _KeyframeStyle_offsetInternal = new WeakMap();
export class AnimationGroup {
    constructor(animationModel, id, animations) {
        _AnimationGroup_animationModel.set(this, void 0);
        _AnimationGroup_idInternal.set(this, void 0);
        _AnimationGroup_scrollNodeInternal.set(this, void 0);
        _AnimationGroup_animationsInternal.set(this, void 0);
        _AnimationGroup_pausedInternal.set(this, void 0);
        __classPrivateFieldSet(this, _AnimationGroup_animationModel, animationModel, "f");
        __classPrivateFieldSet(this, _AnimationGroup_idInternal, id, "f");
        __classPrivateFieldSet(this, _AnimationGroup_animationsInternal, animations, "f");
        __classPrivateFieldSet(this, _AnimationGroup_pausedInternal, false, "f");
    }
    isScrollDriven() {
        return Boolean(__classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f")[0]?.viewOrScrollTimeline());
    }
    id() {
        return __classPrivateFieldGet(this, _AnimationGroup_idInternal, "f");
    }
    animations() {
        return __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f");
    }
    release() {
        __classPrivateFieldGet(this, _AnimationGroup_animationModel, "f").animationGroups.delete(this.id());
        __classPrivateFieldGet(this, _AnimationGroup_animationModel, "f").releaseAnimations(this.animationIds());
    }
    animationIds() {
        function extractId(animation) {
            return animation.id();
        }
        return __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f").map(extractId);
    }
    startTime() {
        return __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f")[0].startTime();
    }
    // For scroll driven animations, it returns the duration in pixels (i.e. after how many pixels of scroll the animation is going to end)
    // For time animations, it returns milliseconds.
    groupDuration() {
        let duration = 0;
        for (const anim of __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f")) {
            duration = Math.max(duration, anim.delayOrStartTime() + anim.iterationDuration());
        }
        return duration;
    }
    // For scroll driven animations, it returns the duration in pixels (i.e. after how many pixels of scroll the animation is going to end)
    // For time animations, it returns milliseconds.
    finiteDuration() {
        let maxDuration = 0;
        for (let i = 0; i < __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f").length; ++i) {
            maxDuration = Math.max(maxDuration, __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f")[i].finiteDuration());
        }
        return maxDuration;
    }
    scrollOrientation() {
        const timeline = __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f")[0]?.viewOrScrollTimeline();
        if (!timeline) {
            return null;
        }
        return timeline.axis;
    }
    async scrollNode() {
        if (__classPrivateFieldGet(this, _AnimationGroup_scrollNodeInternal, "f")) {
            return __classPrivateFieldGet(this, _AnimationGroup_scrollNodeInternal, "f");
        }
        if (!this.isScrollDriven()) {
            return null;
        }
        const sourceNodeId = __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f")[0]?.viewOrScrollTimeline()?.sourceNodeId;
        if (!sourceNodeId) {
            return null;
        }
        const deferredScrollNode = new DeferredDOMNode(__classPrivateFieldGet(this, _AnimationGroup_animationModel, "f").target(), sourceNodeId);
        const scrollNode = await deferredScrollNode.resolvePromise();
        if (!scrollNode) {
            return null;
        }
        __classPrivateFieldSet(this, _AnimationGroup_scrollNodeInternal, new AnimationDOMNode(scrollNode), "f");
        return __classPrivateFieldGet(this, _AnimationGroup_scrollNodeInternal, "f");
    }
    seekTo(currentTime) {
        void __classPrivateFieldGet(this, _AnimationGroup_animationModel, "f").agent.invoke_seekAnimations({ animations: this.animationIds(), currentTime });
    }
    paused() {
        return __classPrivateFieldGet(this, _AnimationGroup_pausedInternal, "f");
    }
    togglePause(paused) {
        if (paused === __classPrivateFieldGet(this, _AnimationGroup_pausedInternal, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _AnimationGroup_pausedInternal, paused, "f");
        void __classPrivateFieldGet(this, _AnimationGroup_animationModel, "f").agent.invoke_setPaused({ animations: this.animationIds(), paused });
    }
    currentTimePromise() {
        let longestAnim = null;
        for (const anim of __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f")) {
            if (!longestAnim || anim.endTime() > longestAnim.endTime()) {
                longestAnim = anim;
            }
        }
        if (!longestAnim) {
            throw new Error('No longest animation found');
        }
        return __classPrivateFieldGet(this, _AnimationGroup_animationModel, "f").agent.invoke_getCurrentTime({ id: longestAnim.id() })
            .then(({ currentTime }) => currentTime || 0);
    }
    matches(group) {
        function extractId(anim) {
            const timelineId = (anim.viewOrScrollTimeline()?.sourceNodeId ?? '') + (anim.viewOrScrollTimeline()?.axis ?? '');
            const regularId = anim.type() === "WebAnimation" /* Protocol.Animation.AnimationType.WebAnimation */ ? anim.type() + anim.id() : anim.cssId();
            return regularId + timelineId;
        }
        if (__classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f").length !== __classPrivateFieldGet(group, _AnimationGroup_animationsInternal, "f").length) {
            return false;
        }
        const left = __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f").map(extractId).sort();
        const right = __classPrivateFieldGet(group, _AnimationGroup_animationsInternal, "f").map(extractId).sort();
        for (let i = 0; i < left.length; i++) {
            if (left[i] !== right[i]) {
                return false;
            }
        }
        return true;
    }
    shouldInclude(group) {
        // We want to include the animations coming from the incoming group
        // inside this group if they were to be grouped if the events came at the same time.
        const [firstIncomingAnimation] = __classPrivateFieldGet(group, _AnimationGroup_animationsInternal, "f");
        const [firstAnimation] = __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f");
        return shouldGroupAnimations(firstAnimation, firstIncomingAnimation);
    }
    appendAnimations(animations) {
        __classPrivateFieldGet(this, _AnimationGroup_animationsInternal, "f").push(...animations);
    }
    rebaseTo(group) {
        __classPrivateFieldGet(this, _AnimationGroup_animationModel, "f").releaseAnimations(this.animationIds());
        __classPrivateFieldSet(this, _AnimationGroup_animationsInternal, __classPrivateFieldGet(group, _AnimationGroup_animationsInternal, "f"), "f");
        __classPrivateFieldSet(this, _AnimationGroup_scrollNodeInternal, undefined, "f");
    }
}
_AnimationGroup_animationModel = new WeakMap(), _AnimationGroup_idInternal = new WeakMap(), _AnimationGroup_scrollNodeInternal = new WeakMap(), _AnimationGroup_animationsInternal = new WeakMap(), _AnimationGroup_pausedInternal = new WeakMap();
export class AnimationDispatcher {
    constructor(animationModel) {
        _AnimationDispatcher_animationModel.set(this, void 0);
        __classPrivateFieldSet(this, _AnimationDispatcher_animationModel, animationModel, "f");
    }
    animationCreated(_event) {
        // Previously this event was used to batch the animations into groups
        // and we were waiting for animationStarted events to be sent for
        // all the created animations and until then we weren't creating any
        // groups. This was allowing us to not miss any animations that were
        // going to be in the same group. However, now we're not using this event
        // to do batching and instead:
        // * We debounce the flush calls so that if the animationStarted events
        // for the same animation group come in different times; we create one
        // group for them.
        // * Even though an animation group is created and rendered for some animations
        // that have the same startTime (or same timeline & scroll axis for SDAs), now
        // whenever an `animationStarted` event comes we check whether there is a group
        // we can add the related animation. If so, we add it and emit `animationGroupUpdated`
        // event. So that, all the animations that were supposed to be in the same group
        // will be in the same group.
    }
    animationCanceled({ id }) {
        __classPrivateFieldGet(this, _AnimationDispatcher_animationModel, "f").animationCanceled(id);
    }
    animationStarted({ animation }) {
        void __classPrivateFieldGet(this, _AnimationDispatcher_animationModel, "f").animationStarted(animation);
    }
    animationUpdated({ animation }) {
        void __classPrivateFieldGet(this, _AnimationDispatcher_animationModel, "f").animationUpdated(animation);
    }
}
_AnimationDispatcher_animationModel = new WeakMap();
SDKModel.register(AnimationModel, { capabilities: 2 /* Capability.DOM */, autostart: true });
//# sourceMappingURL=AnimationModel.js.map