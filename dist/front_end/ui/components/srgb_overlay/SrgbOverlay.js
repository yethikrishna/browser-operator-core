// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SrgbOverlay_instances, _SrgbOverlay_shadow, _SrgbOverlay_getLinePoints, _SrgbOverlay_closestPointAtHeight;
import * as Common from '../../../core/common/common.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import { html, render } from '../../../ui/lit/lit.js';
import srgbOverlayStyles from './srgbOverlay.css.js';
const SRGB_LABEL_HEIGHT = 10;
const SRGB_LABEL_BOTTOM = 3;
const SRGB_TEXT_UPPER_POINT_FROM_BOTTOM = SRGB_LABEL_HEIGHT + SRGB_LABEL_BOTTOM;
const EPSILON = 0.001;
function isColorInSrgbGamut(hsv) {
    const rgba = Common.Color.hsva2rgba([...hsv, 1]);
    const xyzd50 = Common.ColorConverter.ColorConverter.displayP3ToXyzd50(rgba[0], rgba[1], rgba[2]);
    const srgb = Common.ColorConverter.ColorConverter.xyzd50ToSrgb(xyzd50[0], xyzd50[1], xyzd50[2]);
    return srgb.every(val => val + EPSILON >= 0 && val - EPSILON <= 1);
}
export class SrgbOverlay extends HTMLElement {
    constructor() {
        super(...arguments);
        _SrgbOverlay_instances.add(this);
        _SrgbOverlay_shadow.set(this, this.attachShadow({ mode: 'open' }));
    }
    render({ hue, width, height }) {
        return RenderCoordinator.write('Srgb Overlay render', () => {
            const points = __classPrivateFieldGet(this, _SrgbOverlay_instances, "m", _SrgbOverlay_getLinePoints).call(this, { hue, width, height });
            if (!points || points.length === 0) {
                return;
            }
            const closestPoint = __classPrivateFieldGet(this, _SrgbOverlay_instances, "m", _SrgbOverlay_closestPointAtHeight).call(this, points, height - SRGB_TEXT_UPPER_POINT_FROM_BOTTOM);
            if (!closestPoint) {
                return;
            }
            render(html `
          <style>${srgbOverlayStyles}</style>
          <span class="label" style="right: ${width - closestPoint.x}px">sRGB</span>
          <svg>
            <polyline points=${points.map(point => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ')} class="gamut-line" />
          </svg>
        `, __classPrivateFieldGet(this, _SrgbOverlay_shadow, "f"), { host: this });
        });
    }
}
_SrgbOverlay_shadow = new WeakMap(), _SrgbOverlay_instances = new WeakSet(), _SrgbOverlay_getLinePoints = function _SrgbOverlay_getLinePoints({ hue, width, height }) {
    if (width === 0 || height === 0) {
        return null;
    }
    const step = 1 / window.devicePixelRatio;
    const linePoints = [];
    let x = 0;
    for (let y = 0; y < height; y += step) {
        const value = 1 - (y / height);
        for (; x < width; x += step) {
            const saturation = x / width;
            if (!isColorInSrgbGamut([hue, saturation, value])) {
                linePoints.push({ x, y });
                break;
            }
        }
    }
    if (linePoints.length === 0) {
        return null;
    }
    const lastPoint = linePoints[linePoints.length - 1];
    if (lastPoint.x < width) {
        linePoints.push({
            y: lastPoint.y,
            x: width,
        });
    }
    return linePoints;
}, _SrgbOverlay_closestPointAtHeight = function _SrgbOverlay_closestPointAtHeight(points, atHeight) {
    let min = Infinity;
    let closestPoint = null;
    for (const point of points) {
        if (Math.abs(atHeight - point.y) <= min) {
            min = Math.abs(atHeight - point.y);
            closestPoint = point;
        }
    }
    return closestPoint;
};
customElements.define('devtools-spectrum-srgb-overlay', SrgbOverlay);
//# sourceMappingURL=SrgbOverlay.js.map