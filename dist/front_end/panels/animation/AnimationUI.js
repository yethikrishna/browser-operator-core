// Copyright (c) 2015 The Chromium Authors. All rights reserved.
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
var _AnimationUI_animationInternal, _AnimationUI_timeline, _AnimationUI_keyframes, _AnimationUI_nameElement, _AnimationUI_svg, _AnimationUI_activeIntervalGroup, _AnimationUI_cachedElements, _AnimationUI_movementInMs, _AnimationUI_keyboardMovementRateMs, _AnimationUI_color, _AnimationUI_node, _AnimationUI_delayLine, _AnimationUI_endDelayLine, _AnimationUI_tailGroup, _AnimationUI_mouseEventType, _AnimationUI_keyframeMoved, _AnimationUI_downMouseX;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as InlineEditor from '../../ui/legacy/components/inline_editor/inline_editor.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { StepTimingFunction } from './AnimationTimeline.js';
const UIStrings = {
    /**
     *@description Title of the first and last points of an animation
     */
    animationEndpointSlider: 'Animation Endpoint slider',
    /**
     *@description Title of an Animation Keyframe point
     */
    animationKeyframeSlider: 'Animation Keyframe slider',
    /**
     *@description Title of an animation keyframe group
     *@example {anilogo} PH1
     */
    sSlider: '{PH1} slider',
};
const str_ = i18n.i18n.registerUIStrings('panels/animation/AnimationUI.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AnimationUI {
    constructor(animation, timeline, parentElement) {
        _AnimationUI_animationInternal.set(this, void 0);
        _AnimationUI_timeline.set(this, void 0);
        _AnimationUI_keyframes.set(this, void 0);
        _AnimationUI_nameElement.set(this, void 0);
        _AnimationUI_svg.set(this, void 0);
        _AnimationUI_activeIntervalGroup.set(this, void 0);
        _AnimationUI_cachedElements.set(this, void 0);
        _AnimationUI_movementInMs.set(this, void 0);
        _AnimationUI_keyboardMovementRateMs.set(this, void 0);
        _AnimationUI_color.set(this, void 0);
        _AnimationUI_node.set(this, void 0);
        _AnimationUI_delayLine.set(this, void 0);
        _AnimationUI_endDelayLine.set(this, void 0);
        _AnimationUI_tailGroup.set(this, void 0);
        _AnimationUI_mouseEventType.set(this, void 0);
        _AnimationUI_keyframeMoved.set(this, void 0);
        _AnimationUI_downMouseX.set(this, void 0);
        __classPrivateFieldSet(this, _AnimationUI_animationInternal, animation, "f");
        __classPrivateFieldSet(this, _AnimationUI_timeline, timeline, "f");
        const keyframesRule = __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").source().keyframesRule();
        if (keyframesRule) {
            __classPrivateFieldSet(this, _AnimationUI_keyframes, keyframesRule.keyframes(), "f");
            if (animation.viewOrScrollTimeline() && animation.playbackRate() < 0) {
                __classPrivateFieldGet(this, _AnimationUI_keyframes, "f").reverse();
            }
        }
        __classPrivateFieldSet(this, _AnimationUI_nameElement, parentElement.createChild('div', 'animation-name'), "f");
        __classPrivateFieldGet(this, _AnimationUI_nameElement, "f").textContent = __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").name();
        __classPrivateFieldSet(this, _AnimationUI_svg, UI.UIUtils.createSVGChild(parentElement, 'svg', 'animation-ui'), "f");
        __classPrivateFieldGet(this, _AnimationUI_svg, "f").setAttribute('height', Options.AnimationSVGHeight.toString());
        __classPrivateFieldGet(this, _AnimationUI_svg, "f").style.marginLeft = '-' + Options.AnimationMargin + 'px';
        __classPrivateFieldGet(this, _AnimationUI_svg, "f").addEventListener('contextmenu', this.onContextMenu.bind(this));
        __classPrivateFieldSet(this, _AnimationUI_activeIntervalGroup, UI.UIUtils.createSVGChild(__classPrivateFieldGet(this, _AnimationUI_svg, "f"), 'g'), "f");
        __classPrivateFieldGet(this, _AnimationUI_activeIntervalGroup, "f").setAttribute('jslog', `${VisualLogging.animationClip().track({ drag: true })}`);
        if (!__classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").viewOrScrollTimeline()) {
            UI.UIUtils.installDragHandle(__classPrivateFieldGet(this, _AnimationUI_activeIntervalGroup, "f"), this.mouseDown.bind(this, "AnimationDrag" /* Events.ANIMATION_DRAG */, null), this.mouseMove.bind(this), this.mouseUp.bind(this), '-webkit-grabbing', '-webkit-grab');
            AnimationUI.installDragHandleKeyboard(__classPrivateFieldGet(this, _AnimationUI_activeIntervalGroup, "f"), this.keydownMove.bind(this, "AnimationDrag" /* Events.ANIMATION_DRAG */, null));
        }
        __classPrivateFieldSet(this, _AnimationUI_cachedElements, [], "f");
        __classPrivateFieldSet(this, _AnimationUI_movementInMs, 0, "f");
        __classPrivateFieldSet(this, _AnimationUI_keyboardMovementRateMs, 50, "f");
        __classPrivateFieldSet(this, _AnimationUI_color, AnimationUI.colorForAnimation(__classPrivateFieldGet(this, _AnimationUI_animationInternal, "f")), "f");
    }
    static colorForAnimation(animation) {
        const names = Array.from(Colors.keys());
        const hashCode = Platform.StringUtilities.hashCode(animation.name() || animation.id());
        const cappedHashCode = hashCode % names.length;
        const colorName = names[cappedHashCode];
        const color = Colors.get(colorName);
        if (!color) {
            throw new Error('Unable to locate color');
        }
        return color.asString("rgb" /* Common.Color.Format.RGB */) || '';
    }
    static installDragHandleKeyboard(element, elementDrag) {
        element.addEventListener('keydown', elementDrag, false);
    }
    animation() {
        return __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f");
    }
    get nameElement() {
        return __classPrivateFieldGet(this, _AnimationUI_nameElement, "f");
    }
    get svg() {
        return __classPrivateFieldGet(this, _AnimationUI_svg, "f");
    }
    setNode(node) {
        __classPrivateFieldSet(this, _AnimationUI_node, node, "f");
    }
    createLine(parentElement, className) {
        const line = UI.UIUtils.createSVGChild(parentElement, 'line', className);
        line.setAttribute('x1', Options.AnimationMargin.toString());
        line.setAttribute('y1', Options.AnimationHeight.toString());
        line.setAttribute('y2', Options.AnimationHeight.toString());
        line.style.stroke = __classPrivateFieldGet(this, _AnimationUI_color, "f");
        return line;
    }
    drawAnimationLine(iteration, parentElement) {
        const cache = __classPrivateFieldGet(this, _AnimationUI_cachedElements, "f")[iteration];
        if (!cache.animationLine) {
            cache.animationLine = this.createLine(parentElement, 'animation-line');
        }
        if (!cache.animationLine) {
            return;
        }
        cache.animationLine.setAttribute('x2', (this.duration() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio() + Options.AnimationMargin).toFixed(2));
    }
    drawDelayLine(parentElement) {
        if (!__classPrivateFieldGet(this, _AnimationUI_delayLine, "f") || !__classPrivateFieldGet(this, _AnimationUI_endDelayLine, "f")) {
            __classPrivateFieldSet(this, _AnimationUI_delayLine, this.createLine(parentElement, 'animation-delay-line'), "f");
            __classPrivateFieldSet(this, _AnimationUI_endDelayLine, this.createLine(parentElement, 'animation-delay-line'), "f");
        }
        const fill = __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").source().fill();
        __classPrivateFieldGet(this, _AnimationUI_delayLine, "f").classList.toggle('animation-fill', fill === 'backwards' || fill === 'both');
        const margin = Options.AnimationMargin;
        __classPrivateFieldGet(this, _AnimationUI_delayLine, "f").setAttribute('x1', margin.toString());
        __classPrivateFieldGet(this, _AnimationUI_delayLine, "f").setAttribute('x2', (this.delayOrStartTime() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio() + margin).toFixed(2));
        const forwardsFill = fill === 'forwards' || fill === 'both';
        __classPrivateFieldGet(this, _AnimationUI_endDelayLine, "f").classList.toggle('animation-fill', forwardsFill);
        const leftMargin = Math.min(__classPrivateFieldGet(this, _AnimationUI_timeline, "f").width(), (this.delayOrStartTime() + this.duration() * __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").source().iterations()) *
            __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio());
        __classPrivateFieldGet(this, _AnimationUI_endDelayLine, "f").style.transform = 'translateX(' + leftMargin.toFixed(2) + 'px)';
        __classPrivateFieldGet(this, _AnimationUI_endDelayLine, "f").setAttribute('x1', margin.toString());
        __classPrivateFieldGet(this, _AnimationUI_endDelayLine, "f").setAttribute('x2', forwardsFill ?
            (__classPrivateFieldGet(this, _AnimationUI_timeline, "f").width() - leftMargin + margin).toFixed(2) :
            (__classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").source().endDelay() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio() + margin).toFixed(2));
    }
    drawPoint(iteration, parentElement, x, keyframeIndex, attachEvents) {
        if (__classPrivateFieldGet(this, _AnimationUI_cachedElements, "f")[iteration].keyframePoints[keyframeIndex]) {
            __classPrivateFieldGet(this, _AnimationUI_cachedElements, "f")[iteration].keyframePoints[keyframeIndex].setAttribute('cx', x.toFixed(2));
            return;
        }
        const circle = UI.UIUtils.createSVGChild(parentElement, 'circle', keyframeIndex <= 0 ? 'animation-endpoint' : 'animation-keyframe-point');
        circle.setAttribute('cx', x.toFixed(2));
        circle.setAttribute('cy', Options.AnimationHeight.toString());
        circle.style.stroke = __classPrivateFieldGet(this, _AnimationUI_color, "f");
        circle.setAttribute('r', (Options.AnimationMargin / 2).toString());
        circle.setAttribute('jslog', `${VisualLogging.controlPoint('animations.keyframe').track({ drag: true })}`);
        circle.tabIndex = 0;
        UI.ARIAUtils.setLabel(circle, keyframeIndex <= 0 ? i18nString(UIStrings.animationEndpointSlider) :
            i18nString(UIStrings.animationKeyframeSlider));
        if (keyframeIndex <= 0) {
            circle.style.fill = __classPrivateFieldGet(this, _AnimationUI_color, "f");
        }
        __classPrivateFieldGet(this, _AnimationUI_cachedElements, "f")[iteration].keyframePoints[keyframeIndex] = (circle);
        if (!attachEvents) {
            return;
        }
        let eventType;
        if (keyframeIndex === 0) {
            eventType = "StartEndpointMove" /* Events.START_ENDPOINT_MOVE */;
        }
        else if (keyframeIndex === -1) {
            eventType = "FinishEndpointMove" /* Events.FINISH_ENDPOINT_MOVE */;
        }
        else {
            eventType = "KeyframeMove" /* Events.KEYFRAME_MOVE */;
        }
        if (!this.animation().viewOrScrollTimeline()) {
            UI.UIUtils.installDragHandle(circle, this.mouseDown.bind(this, eventType, keyframeIndex), this.mouseMove.bind(this), this.mouseUp.bind(this), 'ew-resize');
            AnimationUI.installDragHandleKeyboard(circle, this.keydownMove.bind(this, eventType, keyframeIndex));
        }
    }
    renderKeyframe(iteration, keyframeIndex, parentElement, leftDistance, width, easing) {
        function createStepLine(parentElement, x, strokeColor) {
            const line = UI.UIUtils.createSVGChild(parentElement, 'line');
            line.setAttribute('x1', x.toString());
            line.setAttribute('x2', x.toString());
            line.setAttribute('y1', Options.AnimationMargin.toString());
            line.setAttribute('y2', Options.AnimationHeight.toString());
            line.style.stroke = strokeColor;
        }
        const bezier = UI.Geometry.CubicBezier.parse(easing);
        const cache = __classPrivateFieldGet(this, _AnimationUI_cachedElements, "f")[iteration].keyframeRender;
        if (!cache[keyframeIndex]) {
            const svg = bezier ? UI.UIUtils.createSVGChild(parentElement, 'path', 'animation-keyframe') :
                UI.UIUtils.createSVGChild(parentElement, 'g', 'animation-keyframe-step');
            cache[keyframeIndex] = svg;
        }
        const group = cache[keyframeIndex];
        group.tabIndex = 0;
        UI.ARIAUtils.setLabel(group, i18nString(UIStrings.sSlider, { PH1: __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").name() }));
        group.style.transform = 'translateX(' + leftDistance.toFixed(2) + 'px)';
        if (easing === 'linear') {
            group.style.fill = __classPrivateFieldGet(this, _AnimationUI_color, "f");
            const height = InlineEditor.BezierUI.Height;
            group.setAttribute('d', ['M', 0, height, 'L', 0, 5, 'L', width.toFixed(2), 5, 'L', width.toFixed(2), height, 'Z'].join(' '));
        }
        else if (bezier) {
            group.style.fill = __classPrivateFieldGet(this, _AnimationUI_color, "f");
            InlineEditor.BezierUI.BezierUI.drawVelocityChart(bezier, group, width);
        }
        else {
            const stepFunction = StepTimingFunction.parse(easing);
            group.removeChildren();
            const offsetMap = { start: 0, middle: 0.5, end: 1 };
            if (stepFunction) {
                const offsetWeight = offsetMap[stepFunction.stepAtPosition];
                for (let i = 0; i < stepFunction.steps; i++) {
                    createStepLine(group, (i + offsetWeight) * width / stepFunction.steps, __classPrivateFieldGet(this, _AnimationUI_color, "f"));
                }
            }
        }
    }
    redraw() {
        const maxWidth = __classPrivateFieldGet(this, _AnimationUI_timeline, "f").width() - Options.AnimationMargin;
        __classPrivateFieldGet(this, _AnimationUI_svg, "f").setAttribute('width', (maxWidth + 2 * Options.AnimationMargin).toFixed(2));
        __classPrivateFieldGet(this, _AnimationUI_activeIntervalGroup, "f").style.transform =
            'translateX(' + (this.delayOrStartTime() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio()).toFixed(2) + 'px)';
        __classPrivateFieldGet(this, _AnimationUI_nameElement, "f").style.transform = 'translateX(' +
            (Math.max(this.delayOrStartTime(), 0) * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio() + Options.AnimationMargin).toFixed(2) +
            'px)';
        __classPrivateFieldGet(this, _AnimationUI_nameElement, "f").style.width = (this.duration() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio()).toFixed(2) + 'px';
        this.drawDelayLine(__classPrivateFieldGet(this, _AnimationUI_svg, "f"));
        if (__classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").type() === 'CSSTransition') {
            this.renderTransition();
            return;
        }
        this.renderIteration(__classPrivateFieldGet(this, _AnimationUI_activeIntervalGroup, "f"), 0);
        if (!__classPrivateFieldGet(this, _AnimationUI_tailGroup, "f")) {
            __classPrivateFieldSet(this, _AnimationUI_tailGroup, UI.UIUtils.createSVGChild(__classPrivateFieldGet(this, _AnimationUI_activeIntervalGroup, "f"), 'g', 'animation-tail-iterations'), "f");
        }
        const iterationWidth = this.duration() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio();
        let iteration;
        // Some iterations are getting rendered in an invisible area if the delay is negative.
        const invisibleAreaWidth = this.delayOrStartTime() < 0 ? -this.delayOrStartTime() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio() : 0;
        for (iteration = 1; iteration < __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").source().iterations() &&
            iterationWidth * (iteration - 1) < invisibleAreaWidth + __classPrivateFieldGet(this, _AnimationUI_timeline, "f").width() &&
            (iterationWidth > 0 || __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").source().iterations() !== Infinity); iteration++) {
            this.renderIteration(__classPrivateFieldGet(this, _AnimationUI_tailGroup, "f"), iteration);
        }
        while (iteration < __classPrivateFieldGet(this, _AnimationUI_cachedElements, "f").length) {
            const poppedElement = __classPrivateFieldGet(this, _AnimationUI_cachedElements, "f").pop();
            if (poppedElement?.group) {
                poppedElement.group.remove();
            }
        }
    }
    renderTransition() {
        const activeIntervalGroup = __classPrivateFieldGet(this, _AnimationUI_activeIntervalGroup, "f");
        if (!__classPrivateFieldGet(this, _AnimationUI_cachedElements, "f")[0]) {
            __classPrivateFieldGet(this, _AnimationUI_cachedElements, "f")[0] = { animationLine: null, keyframePoints: {}, keyframeRender: {}, group: null };
        }
        this.drawAnimationLine(0, activeIntervalGroup);
        this.renderKeyframe(0, 0, activeIntervalGroup, Options.AnimationMargin, this.duration() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio(), __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").source().easing());
        this.drawPoint(0, activeIntervalGroup, Options.AnimationMargin, 0, true);
        this.drawPoint(0, activeIntervalGroup, this.duration() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio() + Options.AnimationMargin, -1, true);
    }
    renderIteration(parentElement, iteration) {
        if (!__classPrivateFieldGet(this, _AnimationUI_cachedElements, "f")[iteration]) {
            __classPrivateFieldGet(this, _AnimationUI_cachedElements, "f")[iteration] = {
                animationLine: null,
                keyframePoints: {},
                keyframeRender: {},
                group: UI.UIUtils.createSVGChild(parentElement, 'g'),
            };
        }
        const group = __classPrivateFieldGet(this, _AnimationUI_cachedElements, "f")[iteration].group;
        if (!group) {
            return;
        }
        group.style.transform =
            'translateX(' + (iteration * this.duration() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio()).toFixed(2) + 'px)';
        this.drawAnimationLine(iteration, group);
        if (__classPrivateFieldGet(this, _AnimationUI_keyframes, "f") && __classPrivateFieldGet(this, _AnimationUI_keyframes, "f").length > 1) {
            for (let i = 0; i < __classPrivateFieldGet(this, _AnimationUI_keyframes, "f").length - 1; i++) {
                const leftDistance = this.offset(i) * this.duration() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio() + Options.AnimationMargin;
                const width = this.duration() * (this.offset(i + 1) - this.offset(i)) * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio();
                this.renderKeyframe(iteration, i, group, leftDistance, width, __classPrivateFieldGet(this, _AnimationUI_keyframes, "f")[i].easing());
                if (i || (!i && iteration === 0)) {
                    this.drawPoint(iteration, group, leftDistance, i, iteration === 0);
                }
            }
        }
        this.drawPoint(iteration, group, this.duration() * __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio() + Options.AnimationMargin, -1, iteration === 0);
    }
    delayOrStartTime() {
        let delay = __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").delayOrStartTime();
        if (__classPrivateFieldGet(this, _AnimationUI_mouseEventType, "f") === "AnimationDrag" /* Events.ANIMATION_DRAG */ || __classPrivateFieldGet(this, _AnimationUI_mouseEventType, "f") === "StartEndpointMove" /* Events.START_ENDPOINT_MOVE */) {
            delay += __classPrivateFieldGet(this, _AnimationUI_movementInMs, "f");
        }
        return delay;
    }
    duration() {
        let duration = __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").iterationDuration();
        if (__classPrivateFieldGet(this, _AnimationUI_mouseEventType, "f") === "FinishEndpointMove" /* Events.FINISH_ENDPOINT_MOVE */) {
            duration += __classPrivateFieldGet(this, _AnimationUI_movementInMs, "f");
        }
        else if (__classPrivateFieldGet(this, _AnimationUI_mouseEventType, "f") === "StartEndpointMove" /* Events.START_ENDPOINT_MOVE */) {
            duration -= __classPrivateFieldGet(this, _AnimationUI_movementInMs, "f");
        }
        return Math.max(0, duration);
    }
    offset(i) {
        if (!__classPrivateFieldGet(this, _AnimationUI_keyframes, "f")) {
            throw new Error('Unable to calculate offset; keyframes do not exist');
        }
        let offset = __classPrivateFieldGet(this, _AnimationUI_keyframes, "f")[i].offsetAsNumber();
        if (__classPrivateFieldGet(this, _AnimationUI_mouseEventType, "f") === "KeyframeMove" /* Events.KEYFRAME_MOVE */ && i === __classPrivateFieldGet(this, _AnimationUI_keyframeMoved, "f")) {
            console.assert(i > 0 && i < __classPrivateFieldGet(this, _AnimationUI_keyframes, "f").length - 1, 'First and last keyframe cannot be moved');
            offset += __classPrivateFieldGet(this, _AnimationUI_movementInMs, "f") / __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").iterationDuration();
            offset = Math.max(offset, __classPrivateFieldGet(this, _AnimationUI_keyframes, "f")[i - 1].offsetAsNumber());
            offset = Math.min(offset, __classPrivateFieldGet(this, _AnimationUI_keyframes, "f")[i + 1].offsetAsNumber());
        }
        return offset;
    }
    mouseDown(mouseEventType, keyframeIndex, event) {
        const mouseEvent = event;
        if (mouseEvent.buttons === 2) {
            return false;
        }
        if (__classPrivateFieldGet(this, _AnimationUI_svg, "f").enclosingNodeOrSelfWithClass('animation-node-removed')) {
            return false;
        }
        __classPrivateFieldSet(this, _AnimationUI_mouseEventType, mouseEventType, "f");
        __classPrivateFieldSet(this, _AnimationUI_keyframeMoved, keyframeIndex, "f");
        __classPrivateFieldSet(this, _AnimationUI_downMouseX, mouseEvent.clientX, "f");
        event.consume(true);
        const viewManagerInstance = UI.ViewManager.ViewManager.instance();
        const animationLocation = viewManagerInstance.locationNameForViewId('animations');
        const elementsLocation = viewManagerInstance.locationNameForViewId('elements');
        // Prevents revealing the node if the animations and elements view share the same view location.
        // If they share the same view location, the animations view will change to the elements view when editing an animation
        if (__classPrivateFieldGet(this, _AnimationUI_node, "f") && animationLocation !== elementsLocation) {
            void Common.Revealer.reveal(__classPrivateFieldGet(this, _AnimationUI_node, "f"));
        }
        return true;
    }
    mouseMove(event) {
        const mouseEvent = event;
        this.setMovementAndRedraw((mouseEvent.clientX - (__classPrivateFieldGet(this, _AnimationUI_downMouseX, "f") || 0)) / __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio());
    }
    setMovementAndRedraw(movement) {
        __classPrivateFieldSet(this, _AnimationUI_movementInMs, movement, "f");
        if (this.delayOrStartTime() + this.duration() > __classPrivateFieldGet(this, _AnimationUI_timeline, "f").duration() * 0.8) {
            __classPrivateFieldGet(this, _AnimationUI_timeline, "f").setDuration(__classPrivateFieldGet(this, _AnimationUI_timeline, "f").duration() * 1.2);
        }
        this.redraw();
    }
    mouseUp(event) {
        const mouseEvent = event;
        __classPrivateFieldSet(this, _AnimationUI_movementInMs, (mouseEvent.clientX - (__classPrivateFieldGet(this, _AnimationUI_downMouseX, "f") || 0)) / __classPrivateFieldGet(this, _AnimationUI_timeline, "f").pixelTimeRatio(), "f");
        // Commit changes
        if (__classPrivateFieldGet(this, _AnimationUI_mouseEventType, "f") === "KeyframeMove" /* Events.KEYFRAME_MOVE */) {
            if (__classPrivateFieldGet(this, _AnimationUI_keyframes, "f") && __classPrivateFieldGet(this, _AnimationUI_keyframeMoved, "f") !== null && typeof __classPrivateFieldGet(this, _AnimationUI_keyframeMoved, "f") !== 'undefined') {
                __classPrivateFieldGet(this, _AnimationUI_keyframes, "f")[__classPrivateFieldGet(this, _AnimationUI_keyframeMoved, "f")].setOffset(this.offset(__classPrivateFieldGet(this, _AnimationUI_keyframeMoved, "f")));
            }
        }
        else {
            __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").setTiming(this.duration(), this.delayOrStartTime());
        }
        __classPrivateFieldSet(this, _AnimationUI_movementInMs, 0, "f");
        this.redraw();
        __classPrivateFieldSet(this, _AnimationUI_mouseEventType, undefined, "f");
        __classPrivateFieldSet(this, _AnimationUI_downMouseX, undefined, "f");
        __classPrivateFieldSet(this, _AnimationUI_keyframeMoved, undefined, "f");
    }
    keydownMove(mouseEventType, keyframeIndex, event) {
        const keyboardEvent = event;
        __classPrivateFieldSet(this, _AnimationUI_mouseEventType, mouseEventType, "f");
        __classPrivateFieldSet(this, _AnimationUI_keyframeMoved, keyframeIndex, "f");
        switch (keyboardEvent.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                __classPrivateFieldSet(this, _AnimationUI_movementInMs, -__classPrivateFieldGet(this, _AnimationUI_keyboardMovementRateMs, "f"), "f");
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                __classPrivateFieldSet(this, _AnimationUI_movementInMs, __classPrivateFieldGet(this, _AnimationUI_keyboardMovementRateMs, "f"), "f");
                break;
            default:
                return;
        }
        if (__classPrivateFieldGet(this, _AnimationUI_mouseEventType, "f") === "KeyframeMove" /* Events.KEYFRAME_MOVE */) {
            if (__classPrivateFieldGet(this, _AnimationUI_keyframes, "f") && __classPrivateFieldGet(this, _AnimationUI_keyframeMoved, "f") !== null) {
                __classPrivateFieldGet(this, _AnimationUI_keyframes, "f")[__classPrivateFieldGet(this, _AnimationUI_keyframeMoved, "f")].setOffset(this.offset(__classPrivateFieldGet(this, _AnimationUI_keyframeMoved, "f")));
            }
        }
        else {
            __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").setTiming(this.duration(), this.delayOrStartTime());
        }
        this.setMovementAndRedraw(0);
        __classPrivateFieldSet(this, _AnimationUI_mouseEventType, undefined, "f");
        __classPrivateFieldSet(this, _AnimationUI_keyframeMoved, undefined, "f");
        event.consume(true);
    }
    onContextMenu(event) {
        function showContextMenu(remoteObject) {
            if (!remoteObject) {
                return;
            }
            const contextMenu = new UI.ContextMenu.ContextMenu(event);
            contextMenu.appendApplicableItems(remoteObject);
            void contextMenu.show();
        }
        void __classPrivateFieldGet(this, _AnimationUI_animationInternal, "f").remoteObjectPromise().then(showContextMenu);
        event.consume(true);
    }
}
_AnimationUI_animationInternal = new WeakMap(), _AnimationUI_timeline = new WeakMap(), _AnimationUI_keyframes = new WeakMap(), _AnimationUI_nameElement = new WeakMap(), _AnimationUI_svg = new WeakMap(), _AnimationUI_activeIntervalGroup = new WeakMap(), _AnimationUI_cachedElements = new WeakMap(), _AnimationUI_movementInMs = new WeakMap(), _AnimationUI_keyboardMovementRateMs = new WeakMap(), _AnimationUI_color = new WeakMap(), _AnimationUI_node = new WeakMap(), _AnimationUI_delayLine = new WeakMap(), _AnimationUI_endDelayLine = new WeakMap(), _AnimationUI_tailGroup = new WeakMap(), _AnimationUI_mouseEventType = new WeakMap(), _AnimationUI_keyframeMoved = new WeakMap(), _AnimationUI_downMouseX = new WeakMap();
export var Events;
(function (Events) {
    Events["ANIMATION_DRAG"] = "AnimationDrag";
    Events["KEYFRAME_MOVE"] = "KeyframeMove";
    Events["START_ENDPOINT_MOVE"] = "StartEndpointMove";
    Events["FINISH_ENDPOINT_MOVE"] = "FinishEndpointMove";
})(Events || (Events = {}));
export const Options = {
    AnimationHeight: 26,
    AnimationSVGHeight: 50,
    AnimationMargin: 7,
    EndpointsClickRegionSize: 10,
    GridCanvasHeight: 40,
};
export const Colors = new Map([
    ['Purple', Common.Color.parse('#9C27B0')],
    ['Light Blue', Common.Color.parse('#03A9F4')],
    ['Deep Orange', Common.Color.parse('#FF5722')],
    ['Blue', Common.Color.parse('#5677FC')],
    ['Lime', Common.Color.parse('#CDDC39')],
    ['Blue Grey', Common.Color.parse('#607D8B')],
    ['Pink', Common.Color.parse('#E91E63')],
    ['Green', Common.Color.parse('#0F9D58')],
    ['Brown', Common.Color.parse('#795548')],
    ['Cyan', Common.Color.parse('#00BCD4')],
]);
//# sourceMappingURL=AnimationUI.js.map