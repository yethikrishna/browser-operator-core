// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _TimeRangeOverlay_instances, _TimeRangeOverlay_shadow, _TimeRangeOverlay_duration, _TimeRangeOverlay_canvasRect, _TimeRangeOverlay_label, _TimeRangeOverlay_isLabelEditable, _TimeRangeOverlay_rangeContainer, _TimeRangeOverlay_labelBox, _TimeRangeOverlay_visibleOverlayWidth, _TimeRangeOverlay_focusInputBox, _TimeRangeOverlay_setLabelEditability, _TimeRangeOverlay_handleLabelInputKeyUp, _TimeRangeOverlay_handleLabelInputKeyDown, _TimeRangeOverlay_render;
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Platform from '../../../../core/platform/platform.js';
import { html, render } from '../../../../ui/lit/lit.js';
import * as VisualLogging from '../../../../ui/visual_logging/visual_logging.js';
import timeRangeOverlayStyles from './timeRangeOverlay.css.js';
const UIStrings = {
    /**
     *@description Accessible label used to explain to a user that they are viewing an entry label.
     */
    timeRange: 'Time range',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/overlays/components/TimeRangeOverlay.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class TimeRangeLabelChangeEvent extends Event {
    constructor(newLabel) {
        super(TimeRangeLabelChangeEvent.eventName);
        this.newLabel = newLabel;
    }
}
TimeRangeLabelChangeEvent.eventName = 'timerangelabelchange';
export class TimeRangeRemoveEvent extends Event {
    constructor() {
        super(TimeRangeRemoveEvent.eventName);
    }
}
TimeRangeRemoveEvent.eventName = 'timerangeremoveevent';
export class TimeRangeOverlay extends HTMLElement {
    constructor(initialLabel) {
        super();
        _TimeRangeOverlay_instances.add(this);
        _TimeRangeOverlay_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _TimeRangeOverlay_duration.set(this, null);
        _TimeRangeOverlay_canvasRect.set(this, null);
        _TimeRangeOverlay_label.set(this, void 0);
        // The label is set to editable and in focus anytime the label is empty and when the label it is double clicked.
        // If the user clicks away from the selected range element and the label is not empty, the label is set to not editable until it is double clicked.
        _TimeRangeOverlay_isLabelEditable.set(this, true);
        _TimeRangeOverlay_rangeContainer.set(this, null);
        _TimeRangeOverlay_labelBox.set(this, null);
        __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_render).call(this);
        __classPrivateFieldSet(this, _TimeRangeOverlay_rangeContainer, __classPrivateFieldGet(this, _TimeRangeOverlay_shadow, "f").querySelector('.range-container'), "f");
        __classPrivateFieldSet(this, _TimeRangeOverlay_labelBox, __classPrivateFieldGet(this, _TimeRangeOverlay_rangeContainer, "f")?.querySelector('.label-text') ?? null, "f");
        __classPrivateFieldSet(this, _TimeRangeOverlay_label, initialLabel, "f");
        if (!__classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f")) {
            console.error('`labelBox` element is missing.');
            return;
        }
        __classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f").innerText = initialLabel;
        if (initialLabel) {
            __classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f")?.setAttribute('aria-label', initialLabel);
            // To construct a time range with a predefined label, it must have been
            // loaded from the trace file. In this case we do not want it to default
            // to editable.
            __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_setLabelEditability).call(this, false);
        }
    }
    set canvasRect(rect) {
        if (rect === null) {
            return;
        }
        if (__classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f") && __classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f").width === rect.width && __classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f").height === rect.height) {
            return;
        }
        __classPrivateFieldSet(this, _TimeRangeOverlay_canvasRect, rect, "f");
        __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_render).call(this);
    }
    set duration(duration) {
        if (duration === __classPrivateFieldGet(this, _TimeRangeOverlay_duration, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _TimeRangeOverlay_duration, duration, "f");
        __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_render).call(this);
    }
    /**
     * We use this method after the overlay has been positioned in order to move
     * the label as required to keep it on screen.
     * If the label is off to the left or right, we fix it to that corner and
     * align the text so the label is visible as long as possible.
     */
    updateLabelPositioning() {
        if (!__classPrivateFieldGet(this, _TimeRangeOverlay_rangeContainer, "f")) {
            return;
        }
        if (!__classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f") || !__classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f")) {
            return;
        }
        // On the RHS of the panel a scrollbar can be shown which means the canvas
        // has a 9px gap on the right hand edge. We use this value when calculating
        // values and label positioning from the left hand side in order to be
        // consistent on both edges of the UI.
        const paddingForScrollbar = 9;
        const overlayRect = this.getBoundingClientRect();
        const labelFocused = __classPrivateFieldGet(this, _TimeRangeOverlay_shadow, "f").activeElement === __classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f");
        const labelRect = __classPrivateFieldGet(this, _TimeRangeOverlay_rangeContainer, "f").getBoundingClientRect();
        const visibleOverlayWidth = __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_visibleOverlayWidth).call(this, overlayRect) - paddingForScrollbar;
        const durationBox = __classPrivateFieldGet(this, _TimeRangeOverlay_rangeContainer, "f").querySelector('.duration') ?? null;
        const durationBoxLength = durationBox?.getBoundingClientRect().width;
        if (!durationBoxLength) {
            return;
        }
        const overlayTooNarrow = visibleOverlayWidth <= durationBoxLength;
        // We do not hide the label if:
        // 1. it is focused (user is typing into it)
        // 2. it is empty - this means it's a new label and we need to let the user type into it!
        // 3. it is too narrow - narrower than the duration length
        const hideLabel = overlayTooNarrow && !labelFocused && __classPrivateFieldGet(this, _TimeRangeOverlay_label, "f").length > 0;
        __classPrivateFieldGet(this, _TimeRangeOverlay_rangeContainer, "f").classList.toggle('labelHidden', hideLabel);
        if (hideLabel) {
            // Label is invisible, no need to do all the layout.
            return;
        }
        // Check if label is off the LHS of the screen.
        const labelLeftMarginToCenter = (overlayRect.width - labelRect.width) / 2;
        const newLabelX = overlayRect.x + labelLeftMarginToCenter;
        const labelOffLeftOfScreen = newLabelX < __classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f").x;
        __classPrivateFieldGet(this, _TimeRangeOverlay_rangeContainer, "f").classList.toggle('offScreenLeft', labelOffLeftOfScreen);
        // Check if label is off the RHS of the screen
        const rightBound = __classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f").x + __classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f").width;
        // The label's right hand edge is the gap from the left of the range to the
        // label, and then the width of the label.
        const labelRightEdge = overlayRect.x + labelLeftMarginToCenter + labelRect.width;
        const labelOffRightOfScreen = labelRightEdge > rightBound;
        __classPrivateFieldGet(this, _TimeRangeOverlay_rangeContainer, "f").classList.toggle('offScreenRight', labelOffRightOfScreen);
        if (labelOffLeftOfScreen) {
            // If the label is off the left of the screen, we adjust by the
            // difference between the X that represents the start of the cavnas, and
            // the X that represents the start of the overlay.
            // We then take the absolute value of this - because if the canvas starts
            // at 0, and the overlay is -200px, we have to adjust the label by +200.
            // Add on 9 pixels to pad from the left; this is the width of the sidebar
            // on the RHS so we match it so the label is equally padded on either
            // side.
            __classPrivateFieldGet(this, _TimeRangeOverlay_rangeContainer, "f").style.marginLeft = `${Math.abs(__classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f").x - overlayRect.x) + paddingForScrollbar}px`;
        }
        else if (labelOffRightOfScreen) {
            // If the label is off the right of the screen, we adjust by adding the
            // right margin equal to the difference between the right edge of the
            // overlay and the right edge of the canvas.
            __classPrivateFieldGet(this, _TimeRangeOverlay_rangeContainer, "f").style.marginRight = `${overlayRect.right - __classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f").right + paddingForScrollbar}px`;
        }
        else {
            // Keep the label central.
            __classPrivateFieldGet(this, _TimeRangeOverlay_rangeContainer, "f").style.margin = '0px';
        }
        // If the text is empty, set the label editibility to true.
        // Only allow to remove the focus and save the range as annotation if the label is not empty.
        if (__classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f")?.innerText === '') {
            __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_setLabelEditability).call(this, true);
        }
    }
}
_TimeRangeOverlay_shadow = new WeakMap(), _TimeRangeOverlay_duration = new WeakMap(), _TimeRangeOverlay_canvasRect = new WeakMap(), _TimeRangeOverlay_label = new WeakMap(), _TimeRangeOverlay_isLabelEditable = new WeakMap(), _TimeRangeOverlay_rangeContainer = new WeakMap(), _TimeRangeOverlay_labelBox = new WeakMap(), _TimeRangeOverlay_instances = new WeakSet(), _TimeRangeOverlay_visibleOverlayWidth = function _TimeRangeOverlay_visibleOverlayWidth(overlayRect) {
    if (!__classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f")) {
        return 0;
    }
    const { x: overlayStartX, width } = overlayRect;
    const overlayEndX = overlayStartX + width;
    const canvasStartX = __classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f").x;
    const canvasEndX = __classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f").x + __classPrivateFieldGet(this, _TimeRangeOverlay_canvasRect, "f").width;
    const leftVisible = Math.max(canvasStartX, overlayStartX);
    const rightVisible = Math.min(canvasEndX, overlayEndX);
    return rightVisible - leftVisible;
}, _TimeRangeOverlay_focusInputBox = function _TimeRangeOverlay_focusInputBox() {
    if (!__classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f")) {
        console.error('`labelBox` element is missing.');
        return;
    }
    __classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f").focus();
}, _TimeRangeOverlay_setLabelEditability = function _TimeRangeOverlay_setLabelEditability(editable) {
    // Always keep focus on the label input field if the label is empty.
    // TODO: Do not remove a range that is being navigated away from if the label is not empty
    if (__classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f")?.innerText === '') {
        __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_focusInputBox).call(this);
        return;
    }
    __classPrivateFieldSet(this, _TimeRangeOverlay_isLabelEditable, editable, "f");
    __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_render).call(this);
    // If the label is editable, focus cursor on it
    if (editable) {
        __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_focusInputBox).call(this);
    }
}, _TimeRangeOverlay_handleLabelInputKeyUp = function _TimeRangeOverlay_handleLabelInputKeyUp() {
    // If the label changed on key up, dispatch label changed event
    const labelBoxTextContent = __classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f")?.textContent ?? '';
    if (labelBoxTextContent !== __classPrivateFieldGet(this, _TimeRangeOverlay_label, "f")) {
        __classPrivateFieldSet(this, _TimeRangeOverlay_label, labelBoxTextContent, "f");
        this.dispatchEvent(new TimeRangeLabelChangeEvent(__classPrivateFieldGet(this, _TimeRangeOverlay_label, "f")));
        __classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f")?.setAttribute('aria-label', labelBoxTextContent);
    }
}, _TimeRangeOverlay_handleLabelInputKeyDown = function _TimeRangeOverlay_handleLabelInputKeyDown(event) {
    // If the new key is `Enter` or `Escape` key, treat it
    // as the end of the label input and blur the input field.
    // If the text field is empty when `Enter` or `Escape` are pressed,
    // dispatch an event to remove the time range.
    if (event.key === Platform.KeyboardUtilities.ENTER_KEY || event.key === Platform.KeyboardUtilities.ESCAPE_KEY) {
        // In DevTools, the `Escape` button will by default toggle the console
        // drawer, which we don't want here, so we need to call
        // `stopPropagation()`.
        event.stopPropagation();
        if (__classPrivateFieldGet(this, _TimeRangeOverlay_label, "f") === '') {
            this.dispatchEvent(new TimeRangeRemoveEvent());
        }
        __classPrivateFieldGet(this, _TimeRangeOverlay_labelBox, "f")?.blur();
        return false;
    }
    return true;
}, _TimeRangeOverlay_render = function _TimeRangeOverlay_render() {
    const durationText = __classPrivateFieldGet(this, _TimeRangeOverlay_duration, "f") ? i18n.TimeUtilities.formatMicroSecondsTime(__classPrivateFieldGet(this, _TimeRangeOverlay_duration, "f")) : '';
    // clang-format off
    render(html `
          <style>${timeRangeOverlayStyles}</style>
          <span class="range-container" role="region" aria-label=${i18nString(UIStrings.timeRange)}>
            <span
             class="label-text"
             role="textbox"
             @focusout=${() => __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_setLabelEditability).call(this, false)}
             @dblclick=${() => __classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_setLabelEditability).call(this, true)}
             @keydown=${__classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_handleLabelInputKeyDown)}
             @keyup=${__classPrivateFieldGet(this, _TimeRangeOverlay_instances, "m", _TimeRangeOverlay_handleLabelInputKeyUp)}
             contenteditable=${__classPrivateFieldGet(this, _TimeRangeOverlay_isLabelEditable, "f") ? 'plaintext-only' : false}
             jslog=${VisualLogging.textField('timeline.annotations.time-range-label-input').track({ keydown: true, click: true })}
            ></span>
            <span class="duration">${durationText}</span>
          </span>
          `, __classPrivateFieldGet(this, _TimeRangeOverlay_shadow, "f"), { host: this });
    // clang-format on
    // Now we have rendered, we need to re-run the code to tweak the margin &
    // positioning of the label.
    this.updateLabelPositioning();
};
customElements.define('devtools-time-range-overlay', TimeRangeOverlay);
//# sourceMappingURL=TimeRangeOverlay.js.map