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
var _TimespanBreakdownOverlay_instances, _TimespanBreakdownOverlay_shadow, _TimespanBreakdownOverlay_canvasRect, _TimespanBreakdownOverlay_sections, _TimespanBreakdownOverlay_renderSection, _TimespanBreakdownOverlay_render;
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Lit from '../../../../ui/lit/lit.js';
import timespanBreakdownOverlayStyles from './timespanBreakdownOverlay.css.js';
const { html } = Lit;
export class TimespanBreakdownOverlay extends HTMLElement {
    constructor() {
        super(...arguments);
        _TimespanBreakdownOverlay_instances.add(this);
        _TimespanBreakdownOverlay_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _TimespanBreakdownOverlay_canvasRect.set(this, null);
        _TimespanBreakdownOverlay_sections.set(this, null);
    }
    set isBelowEntry(isBelow) {
        this.classList.toggle('is-below', isBelow);
    }
    set canvasRect(rect) {
        if (__classPrivateFieldGet(this, _TimespanBreakdownOverlay_canvasRect, "f") && rect && __classPrivateFieldGet(this, _TimespanBreakdownOverlay_canvasRect, "f").width === rect.width && __classPrivateFieldGet(this, _TimespanBreakdownOverlay_canvasRect, "f").height === rect.height) {
            return;
        }
        __classPrivateFieldSet(this, _TimespanBreakdownOverlay_canvasRect, rect, "f");
        __classPrivateFieldGet(this, _TimespanBreakdownOverlay_instances, "m", _TimespanBreakdownOverlay_render).call(this);
    }
    set sections(sections) {
        if (sections === __classPrivateFieldGet(this, _TimespanBreakdownOverlay_sections, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _TimespanBreakdownOverlay_sections, sections, "f");
        __classPrivateFieldGet(this, _TimespanBreakdownOverlay_instances, "m", _TimespanBreakdownOverlay_render).call(this);
    }
    /**
     * We use this method after the overlay has been positioned in order to move
     * the section label as required to keep it on screen.
     * If the label is off to the left or right, we fix it to that corner and
     * align the text so the label is visible as long as possible.
     */
    checkSectionLabelPositioning() {
        const sections = __classPrivateFieldGet(this, _TimespanBreakdownOverlay_shadow, "f").querySelectorAll('.timespan-breakdown-overlay-section');
        if (!sections) {
            return;
        }
        if (!__classPrivateFieldGet(this, _TimespanBreakdownOverlay_canvasRect, "f")) {
            return;
        }
        // On the RHS of the panel a scrollbar can be shown which means the canvas
        // has a 9px gap on the right hand edge. We use this value when calculating
        // values and label positioning from the left hand side in order to be
        // consistent on both edges of the UI.
        const paddingForScrollbar = 9;
        // Fetch the rects for each section and label now, rather than in the loop,
        // to avoid causing a bunch of recalcStyles
        const sectionLayoutData = new Map();
        for (const section of sections) {
            const label = section.querySelector('.timespan-breakdown-overlay-label');
            if (!label) {
                continue;
            }
            const sectionRect = section.getBoundingClientRect();
            const labelRect = label.getBoundingClientRect();
            sectionLayoutData.set(section, { sectionRect, labelRect, label });
        }
        const minSectionWidthToShowAnyLabel = 30;
        // Align the labels for all the breakdown sections.
        for (const section of sections) {
            const layoutData = sectionLayoutData.get(section);
            if (!layoutData) {
                break;
            }
            const { labelRect, sectionRect, label } = layoutData;
            const labelHidden = sectionRect.width < minSectionWidthToShowAnyLabel;
            // Subtract 5 from the section width to allow a tiny bit of padding.
            const labelTruncated = sectionRect.width - 5 <= labelRect.width;
            // We differentiate between hidden + truncated; if it is truncated we
            // will show the text with ellipsis for overflow, but if the section is
            // really small we just hide the label entirely.
            label.classList.toggle('labelHidden', labelHidden);
            label.classList.toggle('labelTruncated', labelTruncated);
            if (labelHidden || labelTruncated) {
                // Label is hidden or doesn't fully fit, so we don't need to do the
                // logic to left/right align if it needs it.
                continue;
            }
            // Check if label is off the LHS of the screen.
            const labelLeftMarginToCenter = (sectionRect.width - labelRect.width) / 2;
            const newLabelX = sectionRect.x + labelLeftMarginToCenter;
            const labelOffLeftOfScreen = newLabelX < __classPrivateFieldGet(this, _TimespanBreakdownOverlay_canvasRect, "f").x;
            label.classList.toggle('offScreenLeft', labelOffLeftOfScreen);
            // Check if label is off the RHS of the screen
            const rightBound = __classPrivateFieldGet(this, _TimespanBreakdownOverlay_canvasRect, "f").x + __classPrivateFieldGet(this, _TimespanBreakdownOverlay_canvasRect, "f").width;
            // The label's right hand edge is the gap from the left of the range to the
            // label, and then the width of the label.
            const labelRightEdge = sectionRect.x + labelLeftMarginToCenter + labelRect.width;
            const labelOffRightOfScreen = labelRightEdge > rightBound;
            label.classList.toggle('offScreenRight', labelOffRightOfScreen);
            if (labelOffLeftOfScreen) {
                // If the label is off the left of the screen, we adjust by the
                // difference between the X that represents the start of the cavnas, and
                // the X that represents the start of the overlay.
                // We then take the absolute value of this - because if the canvas starts
                // at 0, and the overlay is -200px, we have to adjust the label by +200.
                // Add on 9 pixels to pad from the left; this is the width of the sidebar
                // on the RHS so we match it so the label is equally padded on either
                // side.
                label.style.marginLeft = `${Math.abs(__classPrivateFieldGet(this, _TimespanBreakdownOverlay_canvasRect, "f").x - sectionRect.x) + paddingForScrollbar}px`;
            }
            else if (labelOffRightOfScreen) {
                // To calculate how far left to push the label, we take the right hand
                // bound (the canvas width and subtract the label's width).
                // Finally, we subtract the X position of the overlay (if the overlay is
                // 200px within the view, we don't need to push the label that 200px too
                // otherwise it will be off-screen)
                const leftMargin = rightBound - labelRect.width - sectionRect.x;
                label.style.marginLeft = `${leftMargin}px`;
            }
            else {
                // Keep the label central.
                label.style.marginLeft = `${labelLeftMarginToCenter}px`;
            }
        }
    }
    renderedSections() {
        return Array.from(__classPrivateFieldGet(this, _TimespanBreakdownOverlay_shadow, "f").querySelectorAll('.timespan-breakdown-overlay-section'));
    }
}
_TimespanBreakdownOverlay_shadow = new WeakMap(), _TimespanBreakdownOverlay_canvasRect = new WeakMap(), _TimespanBreakdownOverlay_sections = new WeakMap(), _TimespanBreakdownOverlay_instances = new WeakSet(), _TimespanBreakdownOverlay_renderSection = function _TimespanBreakdownOverlay_renderSection(section) {
    // clang-format off
    return html `
      <div class="timespan-breakdown-overlay-section">
        <div class="timespan-breakdown-overlay-label">
        ${section.showDuration ?
        html `<span class="duration-text">${i18n.TimeUtilities.formatMicroSecondsAsMillisFixed(section.bounds.range)}</span> ` : Lit.nothing}
          <span class="section-label-text">${section.label}</span>
        </div>
      </div>`;
    // clang-format on
}, _TimespanBreakdownOverlay_render = function _TimespanBreakdownOverlay_render() {
    if (__classPrivateFieldGet(this, _TimespanBreakdownOverlay_sections, "f")) {
        this.classList.toggle('odd-number-of-sections', __classPrivateFieldGet(this, _TimespanBreakdownOverlay_sections, "f").length % 2 === 1);
        this.classList.toggle('even-number-of-sections', __classPrivateFieldGet(this, _TimespanBreakdownOverlay_sections, "f").length % 2 === 0);
    }
    Lit.render(html `<style>${timespanBreakdownOverlayStyles}</style>
             ${__classPrivateFieldGet(this, _TimespanBreakdownOverlay_sections, "f")?.map(__classPrivateFieldGet(this, _TimespanBreakdownOverlay_instances, "m", _TimespanBreakdownOverlay_renderSection))}`, __classPrivateFieldGet(this, _TimespanBreakdownOverlay_shadow, "f"), { host: this });
    this.checkSectionLabelPositioning();
};
customElements.define('devtools-timespan-breakdown-overlay', TimespanBreakdownOverlay);
//# sourceMappingURL=TimespanBreakdownOverlay.js.map