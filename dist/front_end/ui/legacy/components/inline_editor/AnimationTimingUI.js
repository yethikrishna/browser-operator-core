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
var _BezierCurveUI_curveUI, _BezierCurveUI_bezier, _BezierCurveUI_curve, _BezierCurveUI_mouseDownPosition, _BezierCurveUI_controlPosition, _BezierCurveUI_selectedPoint, _BezierCurveUI_onBezierChange, _LinearEasingPresentation_instances, _LinearEasingPresentation_curveWidth, _LinearEasingPresentation_curveHeight, _LinearEasingPresentation_drawControlPoint, _LinearEasingUI_instances, _LinearEasingUI_model, _LinearEasingUI_onChange, _LinearEasingUI_presentation, _LinearEasingUI_selectedPointIndex, _LinearEasingUI_doubleClickTimer, _LinearEasingUI_pointIndexForDoubleClick, _LinearEasingUI_mouseDownPosition, _LinearEasingUI_svg, _LinearEasingUI_handleLineClick, _LinearEasingUI_handleControlPointClick, _LinearEasingUI_dragStart, _LinearEasingUI_updatePointPosition, _LinearEasingUI_dragMove, _LinearEasingUI_dragEnd, _PresetUI_linearEasingPresentation, _PresetUI_bezierPresentation, _AnimationTimingUI_container, _AnimationTimingUI_bezierContainer, _AnimationTimingUI_linearEasingContainer, _AnimationTimingUI_model, _AnimationTimingUI_onChange, _AnimationTimingUI_bezierCurveUI, _AnimationTimingUI_linearEasingUI;
import * as Platform from '../../../../core/platform/platform.js';
import * as VisualLogging from '../../../visual_logging/visual_logging.js';
import * as UI from '../../legacy.js';
import { BezierUI } from './BezierUI.js';
import { CSSLinearEasingModel } from './CSSLinearEasingModel.js';
const DOUBLE_CLICK_DELAY = 500;
class BezierCurveUI {
    constructor({ bezier, container, onBezierChange }) {
        _BezierCurveUI_curveUI.set(this, void 0);
        _BezierCurveUI_bezier.set(this, void 0);
        _BezierCurveUI_curve.set(this, void 0);
        _BezierCurveUI_mouseDownPosition.set(this, void 0);
        _BezierCurveUI_controlPosition.set(this, void 0);
        _BezierCurveUI_selectedPoint.set(this, void 0);
        _BezierCurveUI_onBezierChange.set(this, void 0);
        __classPrivateFieldSet(this, _BezierCurveUI_bezier, bezier, "f");
        __classPrivateFieldSet(this, _BezierCurveUI_curveUI, new BezierUI({
            width: 150,
            height: 250,
            marginTop: 50,
            controlPointRadius: 7,
            shouldDrawLine: true,
        }), "f");
        __classPrivateFieldSet(this, _BezierCurveUI_curve, UI.UIUtils.createSVGChild(container, 'svg', 'bezier-curve'), "f");
        __classPrivateFieldSet(this, _BezierCurveUI_onBezierChange, onBezierChange, "f");
        UI.UIUtils.installDragHandle(__classPrivateFieldGet(this, _BezierCurveUI_curve, "f"), this.dragStart.bind(this), this.dragMove.bind(this), this.dragEnd.bind(this), 'default');
    }
    dragStart(event) {
        __classPrivateFieldSet(this, _BezierCurveUI_mouseDownPosition, new UI.Geometry.Point(event.x, event.y), "f");
        const ui = __classPrivateFieldGet(this, _BezierCurveUI_curveUI, "f");
        __classPrivateFieldSet(this, _BezierCurveUI_controlPosition, new UI.Geometry.Point(Platform.NumberUtilities.clamp((event.offsetX - ui.radius) / ui.curveWidth(), 0, 1), (ui.curveHeight() + ui.marginTop + ui.radius - event.offsetY) / ui.curveHeight()), "f");
        const firstControlPointIsCloser = __classPrivateFieldGet(this, _BezierCurveUI_controlPosition, "f").distanceTo(__classPrivateFieldGet(this, _BezierCurveUI_bezier, "f").controlPoints[0]) <
            __classPrivateFieldGet(this, _BezierCurveUI_controlPosition, "f").distanceTo(__classPrivateFieldGet(this, _BezierCurveUI_bezier, "f").controlPoints[1]);
        __classPrivateFieldSet(this, _BezierCurveUI_selectedPoint, firstControlPointIsCloser ? 0 : 1, "f");
        __classPrivateFieldGet(this, _BezierCurveUI_bezier, "f").controlPoints[__classPrivateFieldGet(this, _BezierCurveUI_selectedPoint, "f")] = __classPrivateFieldGet(this, _BezierCurveUI_controlPosition, "f");
        __classPrivateFieldGet(this, _BezierCurveUI_onBezierChange, "f").call(this, __classPrivateFieldGet(this, _BezierCurveUI_bezier, "f"));
        event.consume(true);
        return true;
    }
    updateControlPosition(mouseX, mouseY) {
        if (__classPrivateFieldGet(this, _BezierCurveUI_mouseDownPosition, "f") === undefined || __classPrivateFieldGet(this, _BezierCurveUI_controlPosition, "f") === undefined ||
            __classPrivateFieldGet(this, _BezierCurveUI_selectedPoint, "f") === undefined) {
            return;
        }
        const deltaX = (mouseX - __classPrivateFieldGet(this, _BezierCurveUI_mouseDownPosition, "f").x) / __classPrivateFieldGet(this, _BezierCurveUI_curveUI, "f").curveWidth();
        const deltaY = (mouseY - __classPrivateFieldGet(this, _BezierCurveUI_mouseDownPosition, "f").y) / __classPrivateFieldGet(this, _BezierCurveUI_curveUI, "f").curveHeight();
        const newPosition = new UI.Geometry.Point(Platform.NumberUtilities.clamp(__classPrivateFieldGet(this, _BezierCurveUI_controlPosition, "f").x + deltaX, 0, 1), __classPrivateFieldGet(this, _BezierCurveUI_controlPosition, "f").y - deltaY);
        __classPrivateFieldGet(this, _BezierCurveUI_bezier, "f").controlPoints[__classPrivateFieldGet(this, _BezierCurveUI_selectedPoint, "f")] = newPosition;
    }
    dragMove(event) {
        this.updateControlPosition(event.x, event.y);
        __classPrivateFieldGet(this, _BezierCurveUI_onBezierChange, "f").call(this, __classPrivateFieldGet(this, _BezierCurveUI_bezier, "f"));
    }
    dragEnd(event) {
        this.updateControlPosition(event.x, event.y);
        __classPrivateFieldGet(this, _BezierCurveUI_onBezierChange, "f").call(this, __classPrivateFieldGet(this, _BezierCurveUI_bezier, "f"));
    }
    setBezier(bezier) {
        __classPrivateFieldSet(this, _BezierCurveUI_bezier, bezier, "f");
        this.draw();
    }
    draw() {
        __classPrivateFieldGet(this, _BezierCurveUI_curveUI, "f").drawCurve(__classPrivateFieldGet(this, _BezierCurveUI_bezier, "f"), __classPrivateFieldGet(this, _BezierCurveUI_curve, "f"));
    }
}
_BezierCurveUI_curveUI = new WeakMap(), _BezierCurveUI_bezier = new WeakMap(), _BezierCurveUI_curve = new WeakMap(), _BezierCurveUI_mouseDownPosition = new WeakMap(), _BezierCurveUI_controlPosition = new WeakMap(), _BezierCurveUI_selectedPoint = new WeakMap(), _BezierCurveUI_onBezierChange = new WeakMap();
class LinearEasingPresentation {
    constructor(params) {
        _LinearEasingPresentation_instances.add(this);
        this.params = params;
    }
    timingPointToPosition(point) {
        return {
            x: (point.input / 100) * __classPrivateFieldGet(this, _LinearEasingPresentation_instances, "m", _LinearEasingPresentation_curveWidth).call(this) + this.params.pointRadius,
            y: (1 - point.output) * __classPrivateFieldGet(this, _LinearEasingPresentation_instances, "m", _LinearEasingPresentation_curveHeight).call(this) + this.params.pointRadius,
        };
    }
    positionToTimingPoint(position) {
        return {
            input: ((position.x - this.params.pointRadius) / __classPrivateFieldGet(this, _LinearEasingPresentation_instances, "m", _LinearEasingPresentation_curveWidth).call(this)) * 100,
            output: 1 - (position.y - this.params.pointRadius) / __classPrivateFieldGet(this, _LinearEasingPresentation_instances, "m", _LinearEasingPresentation_curveHeight).call(this),
        };
    }
    draw(linearEasingModel, svg) {
        svg.setAttribute('width', String(__classPrivateFieldGet(this, _LinearEasingPresentation_instances, "m", _LinearEasingPresentation_curveWidth).call(this)));
        svg.setAttribute('height', String(__classPrivateFieldGet(this, _LinearEasingPresentation_instances, "m", _LinearEasingPresentation_curveHeight).call(this)));
        svg.removeChildren();
        const group = UI.UIUtils.createSVGChild(svg, 'g');
        const positions = linearEasingModel.points().map(point => this.timingPointToPosition(point));
        this.renderedPositions = positions;
        let startingPoint = positions[0];
        for (let i = 1; i < positions.length; i++) {
            const position = positions[i];
            const line = UI.UIUtils.createSVGChild(group, 'path', 'bezier-path linear-path');
            line.setAttribute('d', `M ${startingPoint.x} ${startingPoint.y} L ${position.x} ${position.y}`);
            line.setAttribute('data-line-index', String(i));
            startingPoint = position;
        }
        for (let i = 0; i < positions.length; i++) {
            const point = positions[i];
            __classPrivateFieldGet(this, _LinearEasingPresentation_instances, "m", _LinearEasingPresentation_drawControlPoint).call(this, group, point.x, point.y, i);
        }
    }
}
_LinearEasingPresentation_instances = new WeakSet(), _LinearEasingPresentation_curveWidth = function _LinearEasingPresentation_curveWidth() {
    return this.params.width - this.params.pointRadius * 2;
}, _LinearEasingPresentation_curveHeight = function _LinearEasingPresentation_curveHeight() {
    return this.params.height - this.params.pointRadius * 2 - this.params.marginTop * 2;
}, _LinearEasingPresentation_drawControlPoint = function _LinearEasingPresentation_drawControlPoint(parentElement, controlX, controlY, index) {
    const circle = UI.UIUtils.createSVGChild(parentElement, 'circle', 'bezier-control-circle');
    circle.setAttribute('jslog', `${VisualLogging.controlPoint('bezier.linear-control-circle').track({ drag: true, dblclick: true })}`);
    circle.setAttribute('data-point-index', String(index));
    circle.setAttribute('cx', String(controlX));
    circle.setAttribute('cy', String(controlY));
    circle.setAttribute('r', String(this.params.pointRadius));
};
class LinearEasingUI {
    constructor({ model, container, onChange, }) {
        _LinearEasingUI_instances.add(this);
        _LinearEasingUI_model.set(this, void 0);
        _LinearEasingUI_onChange.set(this, void 0);
        _LinearEasingUI_presentation.set(this, void 0);
        _LinearEasingUI_selectedPointIndex.set(this, void 0);
        _LinearEasingUI_doubleClickTimer.set(this, void 0);
        _LinearEasingUI_pointIndexForDoubleClick.set(this, void 0);
        _LinearEasingUI_mouseDownPosition.set(this, void 0);
        _LinearEasingUI_svg.set(this, void 0);
        __classPrivateFieldSet(this, _LinearEasingUI_model, model, "f");
        __classPrivateFieldSet(this, _LinearEasingUI_onChange, onChange, "f");
        __classPrivateFieldSet(this, _LinearEasingUI_presentation, new LinearEasingPresentation({
            width: 150,
            height: 250,
            pointRadius: 7,
            marginTop: 50,
        }), "f");
        __classPrivateFieldSet(this, _LinearEasingUI_svg, UI.UIUtils.createSVGChild(container, 'svg', 'bezier-curve linear'), "f");
        UI.UIUtils.installDragHandle(__classPrivateFieldGet(this, _LinearEasingUI_svg, "f"), __classPrivateFieldGet(this, _LinearEasingUI_instances, "m", _LinearEasingUI_dragStart).bind(this), __classPrivateFieldGet(this, _LinearEasingUI_instances, "m", _LinearEasingUI_dragMove).bind(this), __classPrivateFieldGet(this, _LinearEasingUI_instances, "m", _LinearEasingUI_dragEnd).bind(this), 'default');
    }
    setCSSLinearEasingModel(model) {
        __classPrivateFieldSet(this, _LinearEasingUI_model, model, "f");
        this.draw();
    }
    draw() {
        __classPrivateFieldGet(this, _LinearEasingUI_presentation, "f").draw(__classPrivateFieldGet(this, _LinearEasingUI_model, "f"), __classPrivateFieldGet(this, _LinearEasingUI_svg, "f"));
    }
}
_LinearEasingUI_model = new WeakMap(), _LinearEasingUI_onChange = new WeakMap(), _LinearEasingUI_presentation = new WeakMap(), _LinearEasingUI_selectedPointIndex = new WeakMap(), _LinearEasingUI_doubleClickTimer = new WeakMap(), _LinearEasingUI_pointIndexForDoubleClick = new WeakMap(), _LinearEasingUI_mouseDownPosition = new WeakMap(), _LinearEasingUI_svg = new WeakMap(), _LinearEasingUI_instances = new WeakSet(), _LinearEasingUI_handleLineClick = function _LinearEasingUI_handleLineClick(event, lineIndex) {
    const newPoint = __classPrivateFieldGet(this, _LinearEasingUI_presentation, "f").positionToTimingPoint({ x: event.offsetX, y: event.offsetY });
    __classPrivateFieldGet(this, _LinearEasingUI_model, "f").addPoint(newPoint, lineIndex);
    __classPrivateFieldSet(this, _LinearEasingUI_selectedPointIndex, undefined, "f");
    __classPrivateFieldSet(this, _LinearEasingUI_mouseDownPosition, undefined, "f");
}, _LinearEasingUI_handleControlPointClick = function _LinearEasingUI_handleControlPointClick(event, pointIndex) {
    __classPrivateFieldSet(this, _LinearEasingUI_selectedPointIndex, pointIndex, "f");
    __classPrivateFieldSet(this, _LinearEasingUI_mouseDownPosition, { x: event.x, y: event.y }, "f");
    // This is a workaround to understand whether the user double clicked
    // a point or not. The reason is, we also want to handle drag interactions
    // for the point and the way we install drag handlers (starting with mousedown event)
    // doesn't allow us to register a `dblclick` handler. So, we're checking
    // whether user double clicked (or mouse downed) a point with a timer.
    // `#pointIndexForDoubleClick` holds the point clicked in a double click
    // delay time frame. We reset that point after
    // the DOUBLE_CLICK_DELAY time has passed.
    clearTimeout(__classPrivateFieldGet(this, _LinearEasingUI_doubleClickTimer, "f"));
    if (__classPrivateFieldGet(this, _LinearEasingUI_pointIndexForDoubleClick, "f") === __classPrivateFieldGet(this, _LinearEasingUI_selectedPointIndex, "f")) {
        __classPrivateFieldGet(this, _LinearEasingUI_model, "f").removePoint(__classPrivateFieldGet(this, _LinearEasingUI_selectedPointIndex, "f"));
        __classPrivateFieldSet(this, _LinearEasingUI_pointIndexForDoubleClick, undefined, "f");
        __classPrivateFieldSet(this, _LinearEasingUI_selectedPointIndex, undefined, "f");
        __classPrivateFieldSet(this, _LinearEasingUI_mouseDownPosition, undefined, "f");
        return;
    }
    __classPrivateFieldSet(this, _LinearEasingUI_pointIndexForDoubleClick, __classPrivateFieldGet(this, _LinearEasingUI_selectedPointIndex, "f"), "f");
    __classPrivateFieldSet(this, _LinearEasingUI_doubleClickTimer, window.setTimeout(() => {
        __classPrivateFieldSet(this, _LinearEasingUI_pointIndexForDoubleClick, undefined, "f");
    }, DOUBLE_CLICK_DELAY), "f");
}, _LinearEasingUI_dragStart = function _LinearEasingUI_dragStart(event) {
    if (!(event.target instanceof SVGElement)) {
        return false;
    }
    if (event.target.dataset.lineIndex !== undefined) {
        __classPrivateFieldGet(this, _LinearEasingUI_instances, "m", _LinearEasingUI_handleLineClick).call(this, event, Number(event.target.dataset.lineIndex));
        event.consume(true);
        return true;
    }
    if (event.target.dataset.pointIndex !== undefined) {
        __classPrivateFieldGet(this, _LinearEasingUI_instances, "m", _LinearEasingUI_handleControlPointClick).call(this, event, Number(event.target.dataset.pointIndex));
        event.consume(true);
        return true;
    }
    return false;
}, _LinearEasingUI_updatePointPosition = function _LinearEasingUI_updatePointPosition(mouseX, mouseY) {
    if (__classPrivateFieldGet(this, _LinearEasingUI_selectedPointIndex, "f") === undefined || __classPrivateFieldGet(this, _LinearEasingUI_mouseDownPosition, "f") === undefined) {
        return;
    }
    const controlPosition = __classPrivateFieldGet(this, _LinearEasingUI_presentation, "f").renderedPositions?.[__classPrivateFieldGet(this, _LinearEasingUI_selectedPointIndex, "f")];
    if (!controlPosition) {
        return;
    }
    const deltaX = mouseX - __classPrivateFieldGet(this, _LinearEasingUI_mouseDownPosition, "f").x;
    const deltaY = mouseY - __classPrivateFieldGet(this, _LinearEasingUI_mouseDownPosition, "f").y;
    __classPrivateFieldSet(this, _LinearEasingUI_mouseDownPosition, {
        x: mouseX,
        y: mouseY,
    }, "f");
    const newPoint = {
        x: controlPosition.x + deltaX,
        y: controlPosition.y + deltaY,
    };
    __classPrivateFieldGet(this, _LinearEasingUI_model, "f").setPoint(__classPrivateFieldGet(this, _LinearEasingUI_selectedPointIndex, "f"), __classPrivateFieldGet(this, _LinearEasingUI_presentation, "f").positionToTimingPoint(newPoint));
}, _LinearEasingUI_dragMove = function _LinearEasingUI_dragMove(event) {
    __classPrivateFieldGet(this, _LinearEasingUI_instances, "m", _LinearEasingUI_updatePointPosition).call(this, event.x, event.y);
    __classPrivateFieldGet(this, _LinearEasingUI_onChange, "f").call(this, __classPrivateFieldGet(this, _LinearEasingUI_model, "f"));
}, _LinearEasingUI_dragEnd = function _LinearEasingUI_dragEnd(event) {
    __classPrivateFieldGet(this, _LinearEasingUI_instances, "m", _LinearEasingUI_updatePointPosition).call(this, event.x, event.y);
    __classPrivateFieldGet(this, _LinearEasingUI_onChange, "f").call(this, __classPrivateFieldGet(this, _LinearEasingUI_model, "f"));
};
export class PresetUI {
    constructor() {
        _PresetUI_linearEasingPresentation.set(this, void 0);
        _PresetUI_bezierPresentation.set(this, void 0);
        __classPrivateFieldSet(this, _PresetUI_linearEasingPresentation, new LinearEasingPresentation({
            width: 40,
            height: 40,
            marginTop: 0,
            pointRadius: 2,
        }), "f");
        __classPrivateFieldSet(this, _PresetUI_bezierPresentation, new BezierUI({
            width: 40,
            height: 40,
            marginTop: 0,
            controlPointRadius: 2,
            shouldDrawLine: false,
        }), "f");
    }
    draw(model, svg) {
        if (model instanceof CSSLinearEasingModel) {
            __classPrivateFieldGet(this, _PresetUI_linearEasingPresentation, "f").draw(model, svg);
        }
        else if (model instanceof UI.Geometry.CubicBezier) {
            __classPrivateFieldGet(this, _PresetUI_bezierPresentation, "f").drawCurve(model, svg);
        }
    }
}
_PresetUI_linearEasingPresentation = new WeakMap(), _PresetUI_bezierPresentation = new WeakMap();
export class AnimationTimingUI {
    constructor({ model, onChange }) {
        _AnimationTimingUI_container.set(this, void 0);
        _AnimationTimingUI_bezierContainer.set(this, void 0);
        _AnimationTimingUI_linearEasingContainer.set(this, void 0);
        _AnimationTimingUI_model.set(this, void 0);
        _AnimationTimingUI_onChange.set(this, void 0);
        _AnimationTimingUI_bezierCurveUI.set(this, void 0);
        _AnimationTimingUI_linearEasingUI.set(this, void 0);
        __classPrivateFieldSet(this, _AnimationTimingUI_container, document.createElement('div'), "f");
        __classPrivateFieldGet(this, _AnimationTimingUI_container, "f").className = 'animation-timing-ui';
        __classPrivateFieldGet(this, _AnimationTimingUI_container, "f").style.width = '150px';
        __classPrivateFieldGet(this, _AnimationTimingUI_container, "f").style.height = '250px';
        __classPrivateFieldSet(this, _AnimationTimingUI_bezierContainer, document.createElement('div'), "f");
        __classPrivateFieldGet(this, _AnimationTimingUI_bezierContainer, "f").classList.add('bezier-ui-container');
        __classPrivateFieldSet(this, _AnimationTimingUI_linearEasingContainer, document.createElement('div'), "f");
        __classPrivateFieldGet(this, _AnimationTimingUI_linearEasingContainer, "f").classList.add('linear-easing-ui-container');
        __classPrivateFieldGet(this, _AnimationTimingUI_container, "f").appendChild(__classPrivateFieldGet(this, _AnimationTimingUI_bezierContainer, "f"));
        __classPrivateFieldGet(this, _AnimationTimingUI_container, "f").appendChild(__classPrivateFieldGet(this, _AnimationTimingUI_linearEasingContainer, "f"));
        __classPrivateFieldSet(this, _AnimationTimingUI_model, model, "f");
        __classPrivateFieldSet(this, _AnimationTimingUI_onChange, onChange, "f");
        if (__classPrivateFieldGet(this, _AnimationTimingUI_model, "f") instanceof UI.Geometry.CubicBezier) {
            __classPrivateFieldSet(this, _AnimationTimingUI_bezierCurveUI, new BezierCurveUI({ bezier: __classPrivateFieldGet(this, _AnimationTimingUI_model, "f"), container: __classPrivateFieldGet(this, _AnimationTimingUI_bezierContainer, "f"), onBezierChange: __classPrivateFieldGet(this, _AnimationTimingUI_onChange, "f") }), "f");
        }
        else if (__classPrivateFieldGet(this, _AnimationTimingUI_model, "f") instanceof CSSLinearEasingModel) {
            __classPrivateFieldSet(this, _AnimationTimingUI_linearEasingUI, new LinearEasingUI({
                model: __classPrivateFieldGet(this, _AnimationTimingUI_model, "f"),
                container: __classPrivateFieldGet(this, _AnimationTimingUI_linearEasingContainer, "f"),
                onChange: __classPrivateFieldGet(this, _AnimationTimingUI_onChange, "f"),
            }), "f");
        }
    }
    element() {
        return __classPrivateFieldGet(this, _AnimationTimingUI_container, "f");
    }
    setModel(model) {
        __classPrivateFieldSet(this, _AnimationTimingUI_model, model, "f");
        if (__classPrivateFieldGet(this, _AnimationTimingUI_model, "f") instanceof UI.Geometry.CubicBezier) {
            if (__classPrivateFieldGet(this, _AnimationTimingUI_bezierCurveUI, "f")) {
                __classPrivateFieldGet(this, _AnimationTimingUI_bezierCurveUI, "f").setBezier(__classPrivateFieldGet(this, _AnimationTimingUI_model, "f"));
            }
            else {
                __classPrivateFieldSet(this, _AnimationTimingUI_bezierCurveUI, new BezierCurveUI({ bezier: __classPrivateFieldGet(this, _AnimationTimingUI_model, "f"), container: __classPrivateFieldGet(this, _AnimationTimingUI_bezierContainer, "f"), onBezierChange: __classPrivateFieldGet(this, _AnimationTimingUI_onChange, "f") }), "f");
            }
        }
        else if (__classPrivateFieldGet(this, _AnimationTimingUI_model, "f") instanceof CSSLinearEasingModel) {
            if (__classPrivateFieldGet(this, _AnimationTimingUI_linearEasingUI, "f")) {
                __classPrivateFieldGet(this, _AnimationTimingUI_linearEasingUI, "f").setCSSLinearEasingModel(__classPrivateFieldGet(this, _AnimationTimingUI_model, "f"));
            }
            else {
                __classPrivateFieldSet(this, _AnimationTimingUI_linearEasingUI, new LinearEasingUI({ model: __classPrivateFieldGet(this, _AnimationTimingUI_model, "f"), container: __classPrivateFieldGet(this, _AnimationTimingUI_linearEasingContainer, "f"), onChange: __classPrivateFieldGet(this, _AnimationTimingUI_onChange, "f") }), "f");
            }
        }
        this.draw();
    }
    draw() {
        __classPrivateFieldGet(this, _AnimationTimingUI_linearEasingContainer, "f").classList.toggle('hidden', !(__classPrivateFieldGet(this, _AnimationTimingUI_model, "f") instanceof CSSLinearEasingModel));
        __classPrivateFieldGet(this, _AnimationTimingUI_bezierContainer, "f").classList.toggle('hidden', !(__classPrivateFieldGet(this, _AnimationTimingUI_model, "f") instanceof UI.Geometry.CubicBezier));
        if (__classPrivateFieldGet(this, _AnimationTimingUI_bezierCurveUI, "f")) {
            __classPrivateFieldGet(this, _AnimationTimingUI_bezierCurveUI, "f").draw();
        }
        if (__classPrivateFieldGet(this, _AnimationTimingUI_linearEasingUI, "f")) {
            __classPrivateFieldGet(this, _AnimationTimingUI_linearEasingUI, "f").draw();
        }
    }
}
_AnimationTimingUI_container = new WeakMap(), _AnimationTimingUI_bezierContainer = new WeakMap(), _AnimationTimingUI_linearEasingContainer = new WeakMap(), _AnimationTimingUI_model = new WeakMap(), _AnimationTimingUI_onChange = new WeakMap(), _AnimationTimingUI_bezierCurveUI = new WeakMap(), _AnimationTimingUI_linearEasingUI = new WeakMap();
//# sourceMappingURL=AnimationTimingUI.js.map