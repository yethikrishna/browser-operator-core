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
var _EntriesLinkOverlay_instances, _EntriesLinkOverlay_shadow, _EntriesLinkOverlay_coordinateFrom, _EntriesLinkOverlay_fromEntryDimensions, _EntriesLinkOverlay_coordinateTo, _EntriesLinkOverlay_toEntryDimensions, _EntriesLinkOverlay_connectorLineContainer, _EntriesLinkOverlay_connector, _EntriesLinkOverlay_entryFromWrapper, _EntriesLinkOverlay_entryToWrapper, _EntriesLinkOverlay_entryFromCirleConnector, _EntriesLinkOverlay_entryToCircleConnector, _EntriesLinkOverlay_entryFromVisible, _EntriesLinkOverlay_entryToVisible, _EntriesLinkOverlay_canvasRect, _EntriesLinkOverlay_fromEntryIsSource, _EntriesLinkOverlay_toEntryIsSource, _EntriesLinkOverlay_arrowHidden, _EntriesLinkOverlay_linkState, _EntriesLinkOverlay_redrawAllEntriesLinkParts, _EntriesLinkOverlay_setEntriesWrappersVisibility, _EntriesLinkOverlay_setConnectorCirclesVisibility, _EntriesLinkOverlay_setArrowConnectorStyle, _EntriesLinkOverlay_positionConnectorLineAndCircles, _EntriesLinkOverlay_partlyVisibleConnectionLinePercentage, _EntriesLinkOverlay_updateCreateLinkBox, _EntriesLinkOverlay_startCreatingConnection, _EntriesLinkOverlay_render;
// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '../../../../ui/components/icon_button/icon_button.js';
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
import * as i18n from '../../../../core/i18n/i18n.js';
import * as Trace from '../../../../models/trace/trace.js';
import * as ThemeSupport from '../../../../ui/legacy/theme_support/theme_support.js';
import { html, render } from '../../../../ui/lit/lit.js';
import * as VisualLogging from '../../../../ui/visual_logging/visual_logging.js';
import entriesLinkOverlayStyles from './entriesLinkOverlay.css.js';
const UIStrings = {
    /**
     *@description Accessible label used to explain to a user that they are viewing an arrow representing a link between two entries.
     */
    diagram: 'Links between entries',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/overlays/components/EntriesLinkOverlay.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class EntryLinkStartCreating extends Event {
    constructor() {
        super(EntryLinkStartCreating.eventName, { bubbles: true, composed: true });
    }
}
EntryLinkStartCreating.eventName = 'entrylinkstartcreating';
export class EntriesLinkOverlay extends HTMLElement {
    constructor(initialFromEntryCoordinateAndDimensions, linkCreationNotStartedState) {
        super();
        _EntriesLinkOverlay_instances.add(this);
        _EntriesLinkOverlay_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _EntriesLinkOverlay_coordinateFrom.set(this, void 0);
        _EntriesLinkOverlay_fromEntryDimensions.set(this, void 0);
        _EntriesLinkOverlay_coordinateTo.set(this, void 0);
        _EntriesLinkOverlay_toEntryDimensions.set(this, null);
        _EntriesLinkOverlay_connectorLineContainer.set(this, null);
        _EntriesLinkOverlay_connector.set(this, null);
        _EntriesLinkOverlay_entryFromWrapper.set(this, null);
        _EntriesLinkOverlay_entryToWrapper.set(this, null);
        _EntriesLinkOverlay_entryFromCirleConnector.set(this, null);
        _EntriesLinkOverlay_entryToCircleConnector.set(this, null);
        _EntriesLinkOverlay_entryFromVisible.set(this, true);
        _EntriesLinkOverlay_entryToVisible.set(this, true);
        _EntriesLinkOverlay_canvasRect.set(this, null);
        // These flags let us know if the entry we are drawing from/to are the
        // originals, or if they are the parent, which can happen if an entry is
        // collapsed. We care about this because if the entry is not the source, we
        // draw the border as dashed, not solid.
        _EntriesLinkOverlay_fromEntryIsSource.set(this, true);
        _EntriesLinkOverlay_toEntryIsSource.set(this, true);
        _EntriesLinkOverlay_arrowHidden.set(this, false);
        _EntriesLinkOverlay_linkState.set(this, void 0);
        __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_render).call(this);
        __classPrivateFieldSet(this, _EntriesLinkOverlay_coordinateFrom, { x: initialFromEntryCoordinateAndDimensions.x, y: initialFromEntryCoordinateAndDimensions.y }, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_fromEntryDimensions, {
            width: initialFromEntryCoordinateAndDimensions.width,
            height: initialFromEntryCoordinateAndDimensions.height,
        }, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_coordinateTo, { x: initialFromEntryCoordinateAndDimensions.x, y: initialFromEntryCoordinateAndDimensions.y }, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_connectorLineContainer, __classPrivateFieldGet(this, _EntriesLinkOverlay_shadow, "f").querySelector('.connectorContainer') ?? null, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_connector, __classPrivateFieldGet(this, _EntriesLinkOverlay_connectorLineContainer, "f")?.querySelector('line') ?? null, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_entryFromWrapper, __classPrivateFieldGet(this, _EntriesLinkOverlay_shadow, "f").querySelector('.from-highlight-wrapper') ?? null, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_entryToWrapper, __classPrivateFieldGet(this, _EntriesLinkOverlay_shadow, "f").querySelector('.to-highlight-wrapper') ?? null, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_entryFromCirleConnector, __classPrivateFieldGet(this, _EntriesLinkOverlay_connectorLineContainer, "f")?.querySelector('.entryFromConnector') ?? null, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_entryToCircleConnector, __classPrivateFieldGet(this, _EntriesLinkOverlay_connectorLineContainer, "f")?.querySelector('.entryToConnector') ?? null, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_linkState, linkCreationNotStartedState, "f");
        __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_render).call(this);
    }
    set canvasRect(rect) {
        if (rect === null) {
            return;
        }
        if (__classPrivateFieldGet(this, _EntriesLinkOverlay_canvasRect, "f") && __classPrivateFieldGet(this, _EntriesLinkOverlay_canvasRect, "f").width === rect.width && __classPrivateFieldGet(this, _EntriesLinkOverlay_canvasRect, "f").height === rect.height) {
            return;
        }
        __classPrivateFieldSet(this, _EntriesLinkOverlay_canvasRect, rect, "f");
        __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_render).call(this);
    }
    entryFromWrapper() {
        return __classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromWrapper, "f");
    }
    entryToWrapper() {
        return __classPrivateFieldGet(this, _EntriesLinkOverlay_entryToWrapper, "f");
    }
    /**
     * If one entry that is linked is in a collapsed track, we show the outlines
     * but hide only the arrow.
     */
    set hideArrow(shouldHide) {
        __classPrivateFieldSet(this, _EntriesLinkOverlay_arrowHidden, shouldHide, "f");
        if (__classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f")) {
            __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").style.display = shouldHide ? 'none' : 'block';
        }
    }
    set fromEntryCoordinateAndDimensions(fromEntryParams) {
        __classPrivateFieldSet(this, _EntriesLinkOverlay_coordinateFrom, { x: fromEntryParams.x, y: fromEntryParams.y }, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_fromEntryDimensions, { width: fromEntryParams.length, height: fromEntryParams.height }, "f");
        __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_updateCreateLinkBox).call(this);
        __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_redrawAllEntriesLinkParts).call(this);
    }
    set entriesVisibility(entriesVisibility) {
        __classPrivateFieldSet(this, _EntriesLinkOverlay_entryFromVisible, entriesVisibility.fromEntryVisibility, "f");
        __classPrivateFieldSet(this, _EntriesLinkOverlay_entryToVisible, entriesVisibility.toEntryVisibility, "f");
        __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_redrawAllEntriesLinkParts).call(this);
    }
    // The arrow might be pointing either to an entry or an empty space.
    // If the dimensions are not passed, it is pointing at an empty space.
    set toEntryCoordinateAndDimensions(toEntryParams) {
        __classPrivateFieldSet(this, _EntriesLinkOverlay_coordinateTo, { x: toEntryParams.x, y: toEntryParams.y }, "f");
        if (toEntryParams.length && toEntryParams.height) {
            __classPrivateFieldSet(this, _EntriesLinkOverlay_toEntryDimensions, { width: toEntryParams.length, height: toEntryParams.height }, "f");
        }
        else {
            __classPrivateFieldSet(this, _EntriesLinkOverlay_toEntryDimensions, null, "f");
        }
        __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_updateCreateLinkBox).call(this);
        __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_redrawAllEntriesLinkParts).call(this);
    }
    set fromEntryIsSource(x) {
        if (x === __classPrivateFieldGet(this, _EntriesLinkOverlay_fromEntryIsSource, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _EntriesLinkOverlay_fromEntryIsSource, x, "f");
        __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_render).call(this);
    }
    set toEntryIsSource(x) {
        if (x === __classPrivateFieldGet(this, _EntriesLinkOverlay_toEntryIsSource, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _EntriesLinkOverlay_toEntryIsSource, x, "f");
        __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_render).call(this);
    }
}
_EntriesLinkOverlay_shadow = new WeakMap(), _EntriesLinkOverlay_coordinateFrom = new WeakMap(), _EntriesLinkOverlay_fromEntryDimensions = new WeakMap(), _EntriesLinkOverlay_coordinateTo = new WeakMap(), _EntriesLinkOverlay_toEntryDimensions = new WeakMap(), _EntriesLinkOverlay_connectorLineContainer = new WeakMap(), _EntriesLinkOverlay_connector = new WeakMap(), _EntriesLinkOverlay_entryFromWrapper = new WeakMap(), _EntriesLinkOverlay_entryToWrapper = new WeakMap(), _EntriesLinkOverlay_entryFromCirleConnector = new WeakMap(), _EntriesLinkOverlay_entryToCircleConnector = new WeakMap(), _EntriesLinkOverlay_entryFromVisible = new WeakMap(), _EntriesLinkOverlay_entryToVisible = new WeakMap(), _EntriesLinkOverlay_canvasRect = new WeakMap(), _EntriesLinkOverlay_fromEntryIsSource = new WeakMap(), _EntriesLinkOverlay_toEntryIsSource = new WeakMap(), _EntriesLinkOverlay_arrowHidden = new WeakMap(), _EntriesLinkOverlay_linkState = new WeakMap(), _EntriesLinkOverlay_instances = new WeakSet(), _EntriesLinkOverlay_redrawAllEntriesLinkParts = function _EntriesLinkOverlay_redrawAllEntriesLinkParts() {
    if (!__classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f") || !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromWrapper, "f") || !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryToWrapper, "f") || !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromCirleConnector, "f") ||
        !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryToCircleConnector, "f")) {
        console.error('one of the required Entries Link elements is missing.');
        return;
    }
    if (__classPrivateFieldGet(this, _EntriesLinkOverlay_linkState, "f") === "creation_not_started" /* Trace.Types.File.EntriesLinkState.CREATION_NOT_STARTED */) {
        __classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromCirleConnector, "f").setAttribute('visibility', 'hidden');
        __classPrivateFieldGet(this, _EntriesLinkOverlay_entryToCircleConnector, "f").setAttribute('visibility', 'hidden');
        __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").style.display = 'none';
        return;
    }
    __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_setEntriesWrappersVisibility).call(this);
    __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_setConnectorCirclesVisibility).call(this);
    __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_setArrowConnectorStyle).call(this);
    __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_positionConnectorLineAndCircles).call(this);
    __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_render).call(this);
}, _EntriesLinkOverlay_setEntriesWrappersVisibility = function _EntriesLinkOverlay_setEntriesWrappersVisibility() {
    if (!__classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromWrapper, "f") || !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryToWrapper, "f")) {
        return;
    }
    __classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromWrapper, "f").style.visibility = __classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromVisible, "f") ? 'visible' : 'hidden';
    __classPrivateFieldGet(this, _EntriesLinkOverlay_entryToWrapper, "f").style.visibility = __classPrivateFieldGet(this, _EntriesLinkOverlay_entryToVisible, "f") ? 'visible' : 'hidden';
}, _EntriesLinkOverlay_setConnectorCirclesVisibility = function _EntriesLinkOverlay_setConnectorCirclesVisibility() {
    if (!__classPrivateFieldGet(this, _EntriesLinkOverlay_toEntryDimensions, "f") || !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromCirleConnector, "f") || !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryToCircleConnector, "f")) {
        return;
    }
    // If the user is zoomed out, the connector circles can be as large as the
    // event itself. So if the rectangle for this entry is too small, we
    // don't draw the circles.
    const minWidthToDrawConnectorCircles = 8;
    const drawFromEntryConnectorCircle = __classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromVisible, "f") && !__classPrivateFieldGet(this, _EntriesLinkOverlay_arrowHidden, "f") && __classPrivateFieldGet(this, _EntriesLinkOverlay_fromEntryIsSource, "f") &&
        __classPrivateFieldGet(this, _EntriesLinkOverlay_fromEntryDimensions, "f").width >= minWidthToDrawConnectorCircles;
    const drawToEntryConnectorCircle = !__classPrivateFieldGet(this, _EntriesLinkOverlay_arrowHidden, "f") && __classPrivateFieldGet(this, _EntriesLinkOverlay_entryToVisible, "f") && __classPrivateFieldGet(this, _EntriesLinkOverlay_toEntryIsSource, "f") &&
        __classPrivateFieldGet(this, _EntriesLinkOverlay_toEntryDimensions, "f")?.width >= minWidthToDrawConnectorCircles && !__classPrivateFieldGet(this, _EntriesLinkOverlay_arrowHidden, "f");
    __classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromCirleConnector, "f").setAttribute('visibility', drawFromEntryConnectorCircle ? 'visible' : 'hidden');
    __classPrivateFieldGet(this, _EntriesLinkOverlay_entryToCircleConnector, "f").setAttribute('visibility', drawToEntryConnectorCircle ? 'visible' : 'hidden');
}, _EntriesLinkOverlay_setArrowConnectorStyle = function _EntriesLinkOverlay_setArrowConnectorStyle() {
    if (!__classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f")) {
        return;
    }
    // If neither entry is visible, do not display the connector
    __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").style.display = (__classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromVisible, "f") || __classPrivateFieldGet(this, _EntriesLinkOverlay_entryToVisible, "f")) ? 'block' : 'none';
    __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").setAttribute('stroke-width', '2');
    const arrowColor = ThemeSupport.ThemeSupport.instance().getComputedValue('--color-text-primary');
    // Use a solid stroke if the 'to' entry's dimensions are unknown (during link creation) or if both entries are visible.
    if (!__classPrivateFieldGet(this, _EntriesLinkOverlay_toEntryDimensions, "f") || (__classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromVisible, "f") && __classPrivateFieldGet(this, _EntriesLinkOverlay_entryToVisible, "f"))) {
        __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").setAttribute('stroke', arrowColor);
        return;
    }
    // If one entry is not visible and one is, fade the arrow.
    if (__classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromVisible, "f") && !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryToVisible, "f")) {
        __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").setAttribute('stroke', 'url(#fromVisibleLineGradient)');
    }
    else if (__classPrivateFieldGet(this, _EntriesLinkOverlay_entryToVisible, "f") && !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromVisible, "f")) {
        __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").setAttribute('stroke', 'url(#toVisibleLineGradient)');
    }
}, _EntriesLinkOverlay_positionConnectorLineAndCircles = function _EntriesLinkOverlay_positionConnectorLineAndCircles() {
    if (!__classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f") || !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromCirleConnector, "f") || !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryToCircleConnector, "f")) {
        return;
    }
    // If the entry is visible, the entry arrow starts from the middle of the right edge of the entry (end on the X axis and middle of the Y axis).
    // If not, draw it to the y coordinate of the entry and the edge of the timeline so it is pointing in the direction of the entry.
    const halfFromEntryHeight = __classPrivateFieldGet(this, _EntriesLinkOverlay_fromEntryDimensions, "f").height / 2;
    const fromX = __classPrivateFieldGet(this, _EntriesLinkOverlay_coordinateFrom, "f").x + __classPrivateFieldGet(this, _EntriesLinkOverlay_fromEntryDimensions, "f").width;
    const fromY = __classPrivateFieldGet(this, _EntriesLinkOverlay_coordinateFrom, "f").y + halfFromEntryHeight;
    __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").setAttribute('x1', fromX.toString());
    __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").setAttribute('y1', fromY.toString());
    __classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromCirleConnector, "f").setAttribute('cx', fromX.toString());
    __classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromCirleConnector, "f").setAttribute('cy', fromY.toString());
    // If the arrow is pointing to the entry and that entry is visible, point it to the middle of the entry.
    // If the entry is not visible, point the arrow to the edge of the screen towards the entry.
    // Otherwise, the arrow is following the mouse so we assign it to the provided coordinates.
    const toX = __classPrivateFieldGet(this, _EntriesLinkOverlay_coordinateTo, "f").x;
    const toY = __classPrivateFieldGet(this, _EntriesLinkOverlay_toEntryDimensions, "f") ? __classPrivateFieldGet(this, _EntriesLinkOverlay_coordinateTo, "f").y + (__classPrivateFieldGet(this, _EntriesLinkOverlay_toEntryDimensions, "f")?.height ?? 0) / 2 :
        __classPrivateFieldGet(this, _EntriesLinkOverlay_coordinateTo, "f").y;
    __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").setAttribute('x2', toX.toString());
    __classPrivateFieldGet(this, _EntriesLinkOverlay_connector, "f").setAttribute('y2', toY.toString());
    __classPrivateFieldGet(this, _EntriesLinkOverlay_entryToCircleConnector, "f").setAttribute('cx', toX.toString());
    __classPrivateFieldGet(this, _EntriesLinkOverlay_entryToCircleConnector, "f").setAttribute('cy', toY.toString());
}, _EntriesLinkOverlay_partlyVisibleConnectionLinePercentage = function _EntriesLinkOverlay_partlyVisibleConnectionLinePercentage() {
    if (!__classPrivateFieldGet(this, _EntriesLinkOverlay_canvasRect, "f")) {
        return 100;
    }
    const fadedLineLength = 25;
    const lineLength = __classPrivateFieldGet(this, _EntriesLinkOverlay_coordinateTo, "f").x - (__classPrivateFieldGet(this, _EntriesLinkOverlay_coordinateFrom, "f").x + __classPrivateFieldGet(this, _EntriesLinkOverlay_fromEntryDimensions, "f").width);
    const visibleLineFromTotalPercentage = (fadedLineLength * 100) / lineLength;
    return (visibleLineFromTotalPercentage < 100) ? visibleLineFromTotalPercentage : 100;
}, _EntriesLinkOverlay_updateCreateLinkBox = function _EntriesLinkOverlay_updateCreateLinkBox() {
    const createLinkBox = __classPrivateFieldGet(this, _EntriesLinkOverlay_shadow, "f").querySelector('.create-link-box');
    const createLinkIcon = createLinkBox?.querySelector('.create-link-icon') ?? null;
    if (!createLinkBox || !createLinkIcon) {
        console.error('creating element is missing.');
        return;
    }
    if (__classPrivateFieldGet(this, _EntriesLinkOverlay_linkState, "f") !== "creation_not_started" /* Trace.Types.File.EntriesLinkState.CREATION_NOT_STARTED */) {
        createLinkIcon.style.display = 'none';
        return;
    }
    createLinkIcon.style.left = `${__classPrivateFieldGet(this, _EntriesLinkOverlay_coordinateFrom, "f").x + __classPrivateFieldGet(this, _EntriesLinkOverlay_fromEntryDimensions, "f").width}px`;
    createLinkIcon.style.top = `${__classPrivateFieldGet(this, _EntriesLinkOverlay_coordinateFrom, "f").y}px`;
}, _EntriesLinkOverlay_startCreatingConnection = function _EntriesLinkOverlay_startCreatingConnection() {
    __classPrivateFieldSet(this, _EntriesLinkOverlay_linkState, "pending_to_event" /* Trace.Types.File.EntriesLinkState.PENDING_TO_EVENT */, "f");
    this.dispatchEvent(new EntryLinkStartCreating());
}, _EntriesLinkOverlay_render = function _EntriesLinkOverlay_render() {
    const arrowColor = ThemeSupport.ThemeSupport.instance().getComputedValue('--color-text-primary');
    // clang-format off
    render(html `
          <style>${entriesLinkOverlayStyles}</style>
          <svg class="connectorContainer" width="100%" height="100%" role="region" aria-label=${i18nString(UIStrings.diagram)}>
            <defs>
              <linearGradient
                id="fromVisibleLineGradient"
                x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  stop-color=${arrowColor}
                  stop-opacity="1" />
                <stop
                  offset="${__classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_partlyVisibleConnectionLinePercentage).call(this)}%"
                  stop-color=${arrowColor}
                  stop-opacity="0" />
              </linearGradient>

              <linearGradient
                id="toVisibleLineGradient"
                x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="${100 - __classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_partlyVisibleConnectionLinePercentage).call(this)}%"
                  stop-color=${arrowColor}
                  stop-opacity="0" />
                <stop
                  offset="100%"
                  stop-color=${arrowColor}
                  stop-opacity="1" />
              </linearGradient>
              <marker
                id="arrow"
                orient="auto"
                markerWidth="3"
                markerHeight="4"
                fill-opacity="1"
                refX="4"
                refY="2"
                visibility=${__classPrivateFieldGet(this, _EntriesLinkOverlay_entryToVisible, "f") || !__classPrivateFieldGet(this, _EntriesLinkOverlay_toEntryDimensions, "f") ? 'visible' : 'hidden'}>
                <path d="M0,0 V4 L4,2 Z" fill=${arrowColor} />
              </marker>
            </defs>
            <line
              marker-end="url(#arrow)"
              stroke-dasharray=${!__classPrivateFieldGet(this, _EntriesLinkOverlay_fromEntryIsSource, "f") || !__classPrivateFieldGet(this, _EntriesLinkOverlay_toEntryIsSource, "f") ? DASHED_STROKE_AMOUNT : 'none'}
              visibility=${!__classPrivateFieldGet(this, _EntriesLinkOverlay_entryFromVisible, "f") && !__classPrivateFieldGet(this, _EntriesLinkOverlay_entryToVisible, "f") ? 'hidden' : 'visible'}
              />
            <circle class="entryFromConnector" fill="none" stroke=${arrowColor} stroke-width=${CONNECTOR_CIRCLE_STROKE_WIDTH} r=${CONNECTOR_CIRCLE_RADIUS} />
            <circle class="entryToConnector" fill="none" stroke=${arrowColor} stroke-width=${CONNECTOR_CIRCLE_STROKE_WIDTH} r=${CONNECTOR_CIRCLE_RADIUS} />
          </svg>
          <div class="entry-wrapper from-highlight-wrapper ${__classPrivateFieldGet(this, _EntriesLinkOverlay_fromEntryIsSource, "f") ? '' : 'entry-is-not-source'}"></div>
          <div class="entry-wrapper to-highlight-wrapper ${__classPrivateFieldGet(this, _EntriesLinkOverlay_toEntryIsSource, "f") ? '' : 'entry-is-not-source'}"></div>
          <div class="create-link-box ${__classPrivateFieldGet(this, _EntriesLinkOverlay_linkState, "f") ? 'visible' : 'hidden'}">
            <devtools-icon
              class='create-link-icon'
              jslog=${VisualLogging.action('timeline.annotations.create-entry-link').track({ click: true })}
              @click=${__classPrivateFieldGet(this, _EntriesLinkOverlay_instances, "m", _EntriesLinkOverlay_startCreatingConnection)}
              name='arrow-right-circle'>
            </devtools-icon>
          </div>
        `, __classPrivateFieldGet(this, _EntriesLinkOverlay_shadow, "f"), { host: this });
    // clang-format on
};
const CONNECTOR_CIRCLE_RADIUS = 2;
const CONNECTOR_CIRCLE_STROKE_WIDTH = 1;
// Defines the gap in the border when we are drawing a dashed outline.
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
const DASHED_STROKE_AMOUNT = 4;
customElements.define('devtools-entries-link-overlay', EntriesLinkOverlay);
//# sourceMappingURL=EntriesLinkOverlay.js.map