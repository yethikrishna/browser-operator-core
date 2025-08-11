// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _Dialog_instances, _Dialog_shadow, _Dialog_forceDialogCloseInDevToolsBound, _Dialog_handleScrollAttemptBound, _Dialog_props, _Dialog_dialog, _Dialog_isPendingShowDialog, _Dialog_isPendingCloseDialog, _Dialog_hitArea, _Dialog_dialogClientRect, _Dialog_bestVerticalPositionInternal, _Dialog_bestHorizontalAlignment, _Dialog_devtoolsMutationObserver, _Dialog_dialogResizeObserver, _Dialog_devToolsBoundingElement, _Dialog_onKeyDownBound, _Dialog_updateDialogBounds, _Dialog_onStateChange, _Dialog_getDialog, _Dialog_handlePointerEvent, _Dialog_animationEndedEvent, _Dialog_mouseEventWasInDialogContent, _Dialog_mouseEventWasInHitArea, _Dialog_getCoordinatesFromDialogOrigin, _Dialog_getBestHorizontalAlignment, _Dialog_getBestVerticalPosition, _Dialog_positionDialog, _Dialog_showDialog, _Dialog_handleScrollAttempt, _Dialog_onKeyDown, _Dialog_onCancel, _Dialog_forceDialogCloseInDevToolsMutation, _Dialog_closeDialog, _Dialog_renderHeaderRow, _Dialog_render;
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as WindowBoundsService from '../../../services/window_bounds/window_bounds.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Buttons from '../buttons/buttons.js';
import dialogStyles from './dialog.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Title of close button for the shortcuts dialog.
     */
    close: 'Close',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/dialogs/Dialog.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const IS_DIALOG_SUPPORTED = 'HTMLDialogElement' in globalThis;
// Height in pixels of the dialog's connector. The connector is represented as
// as a diamond and the height corresponds to half the height of the diamond.
// (the visible height is only half of the diamond).
export const CONNECTOR_HEIGHT = 10;
const CONNECTOR_WIDTH = 2 * CONNECTOR_HEIGHT;
// The offset used by the dialog's animation as it slides in when opened.
const DIALOG_ANIMATION_OFFSET = 20;
export const DIALOG_SIDE_PADDING = 5;
export const DIALOG_VERTICAL_PADDING = 3;
// If the content of the dialog cannot be completely shown because otherwise
// the dialog would overflow the window, the dialog's max width and height are
// set such that the dialog remains inside the visible bounds. In this cases
// some extra, determined by this constant, is added so that the dialog's borders
// remain clearly visible. This constant accounts for the padding of the dialog's
// content (20 px) and a 5px gap left on each extreme of the dialog from the viewport.
export const DIALOG_PADDING_FROM_WINDOW = 3 * CONNECTOR_HEIGHT;
export const MODAL = 'MODAL';
export class Dialog extends HTMLElement {
    constructor() {
        super(...arguments);
        _Dialog_instances.add(this);
        _Dialog_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _Dialog_forceDialogCloseInDevToolsBound.set(this, __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_forceDialogCloseInDevToolsMutation).bind(this));
        _Dialog_handleScrollAttemptBound.set(this, __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_handleScrollAttempt).bind(this));
        _Dialog_props.set(this, {
            origin: MODAL,
            position: "bottom" /* DialogVerticalPosition.BOTTOM */,
            horizontalAlignment: "center" /* DialogHorizontalAlignment.CENTER */,
            getConnectorCustomXPosition: null,
            dialogShownCallback: null,
            windowBoundsService: WindowBoundsService.WindowBoundsService.WindowBoundsServiceImpl.instance(),
            closeOnESC: true,
            closeOnScroll: true,
            closeButton: false,
            dialogTitle: '',
            jslogContext: '',
        });
        _Dialog_dialog.set(this, null);
        _Dialog_isPendingShowDialog.set(this, false);
        _Dialog_isPendingCloseDialog.set(this, false);
        _Dialog_hitArea.set(this, new DOMRect(0, 0, 0, 0));
        _Dialog_dialogClientRect.set(this, new DOMRect(0, 0, 0, 0));
        _Dialog_bestVerticalPositionInternal.set(this, null);
        _Dialog_bestHorizontalAlignment.set(this, null);
        _Dialog_devtoolsMutationObserver.set(this, new MutationObserver(mutations => {
            if (__classPrivateFieldGet(this, _Dialog_props, "f").expectedMutationsSelector) {
                const allExcluded = mutations.every(mutation => {
                    return mutation.target instanceof Element &&
                        mutation.target.matches(__classPrivateFieldGet(this, _Dialog_props, "f").expectedMutationsSelector ?? '');
                });
                if (allExcluded) {
                    return;
                }
            }
            __classPrivateFieldGet(this, _Dialog_forceDialogCloseInDevToolsBound, "f").call(this);
        }));
        _Dialog_dialogResizeObserver.set(this, new ResizeObserver(__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_updateDialogBounds).bind(this)));
        _Dialog_devToolsBoundingElement.set(this, this.windowBoundsService.getDevToolsBoundingElement());
        // We bind here because we have to listen to keydowns on the entire window,
        // not on the Dialog element itself. This is because if the user has the
        // dialog open, but their focus is elsewhere, and they hit ESC, we should
        // still close the dialog.
        _Dialog_onKeyDownBound.set(this, __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onKeyDown).bind(this));
    }
    get origin() {
        return __classPrivateFieldGet(this, _Dialog_props, "f").origin;
    }
    set origin(origin) {
        __classPrivateFieldGet(this, _Dialog_props, "f").origin = origin;
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    set expectedMutationsSelector(mutationSelector) {
        __classPrivateFieldGet(this, _Dialog_props, "f").expectedMutationsSelector = mutationSelector;
    }
    get expectedMutationsSelector() {
        return __classPrivateFieldGet(this, _Dialog_props, "f").expectedMutationsSelector;
    }
    get position() {
        return __classPrivateFieldGet(this, _Dialog_props, "f").position;
    }
    set position(position) {
        __classPrivateFieldGet(this, _Dialog_props, "f").position = position;
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    get horizontalAlignment() {
        return __classPrivateFieldGet(this, _Dialog_props, "f").horizontalAlignment;
    }
    set horizontalAlignment(alignment) {
        __classPrivateFieldGet(this, _Dialog_props, "f").horizontalAlignment = alignment;
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    get windowBoundsService() {
        return __classPrivateFieldGet(this, _Dialog_props, "f").windowBoundsService;
    }
    set windowBoundsService(windowBoundsService) {
        __classPrivateFieldGet(this, _Dialog_props, "f").windowBoundsService = windowBoundsService;
        __classPrivateFieldSet(this, _Dialog_devToolsBoundingElement, this.windowBoundsService.getDevToolsBoundingElement(), "f");
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    get bestVerticalPosition() {
        return __classPrivateFieldGet(this, _Dialog_bestVerticalPositionInternal, "f");
    }
    get bestHorizontalAlignment() {
        return __classPrivateFieldGet(this, _Dialog_bestHorizontalAlignment, "f");
    }
    get getConnectorCustomXPosition() {
        return __classPrivateFieldGet(this, _Dialog_props, "f").getConnectorCustomXPosition;
    }
    set getConnectorCustomXPosition(connectorXPosition) {
        __classPrivateFieldGet(this, _Dialog_props, "f").getConnectorCustomXPosition = connectorXPosition;
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    get dialogShownCallback() {
        return __classPrivateFieldGet(this, _Dialog_props, "f").dialogShownCallback;
    }
    get jslogContext() {
        return __classPrivateFieldGet(this, _Dialog_props, "f").jslogContext;
    }
    set dialogShownCallback(dialogShownCallback) {
        __classPrivateFieldGet(this, _Dialog_props, "f").dialogShownCallback = dialogShownCallback;
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    set closeOnESC(closeOnESC) {
        __classPrivateFieldGet(this, _Dialog_props, "f").closeOnESC = closeOnESC;
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    set closeOnScroll(closeOnScroll) {
        __classPrivateFieldGet(this, _Dialog_props, "f").closeOnScroll = closeOnScroll;
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    set closeButton(closeButton) {
        __classPrivateFieldGet(this, _Dialog_props, "f").closeButton = closeButton;
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    set dialogTitle(dialogTitle) {
        __classPrivateFieldGet(this, _Dialog_props, "f").dialogTitle = dialogTitle;
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    set jslogContext(jslogContext) {
        __classPrivateFieldGet(this, _Dialog_props, "f").jslogContext = jslogContext;
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onStateChange).call(this);
    }
    connectedCallback() {
        window.addEventListener('resize', __classPrivateFieldGet(this, _Dialog_forceDialogCloseInDevToolsBound, "f"));
        __classPrivateFieldGet(this, _Dialog_devtoolsMutationObserver, "f").observe(__classPrivateFieldGet(this, _Dialog_devToolsBoundingElement, "f"), { childList: true, subtree: true });
        __classPrivateFieldGet(this, _Dialog_devToolsBoundingElement, "f").addEventListener('wheel', __classPrivateFieldGet(this, _Dialog_handleScrollAttemptBound, "f"));
        this.style.setProperty('--dialog-padding', '0');
        this.style.setProperty('--dialog-display', IS_DIALOG_SUPPORTED ? 'block' : 'none');
        this.style.setProperty('--override-dialog-content-border', `${CONNECTOR_HEIGHT}px solid transparent`);
        this.style.setProperty('--dialog-padding', `${DIALOG_VERTICAL_PADDING}px ${DIALOG_SIDE_PADDING}px`);
    }
    disconnectedCallback() {
        window.removeEventListener('resize', __classPrivateFieldGet(this, _Dialog_forceDialogCloseInDevToolsBound, "f"));
        __classPrivateFieldGet(this, _Dialog_devToolsBoundingElement, "f").removeEventListener('wheel', __classPrivateFieldGet(this, _Dialog_handleScrollAttemptBound, "f"));
        __classPrivateFieldGet(this, _Dialog_devtoolsMutationObserver, "f").disconnect();
        __classPrivateFieldGet(this, _Dialog_dialogResizeObserver, "f").disconnect();
    }
    getHitArea() {
        return __classPrivateFieldGet(this, _Dialog_hitArea, "f");
    }
    async setDialogVisible(show) {
        if (show) {
            await __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_showDialog).call(this);
            return;
        }
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_closeDialog).call(this);
    }
    getDialogBounds() {
        return __classPrivateFieldGet(this, _Dialog_dialogClientRect, "f");
    }
}
_Dialog_shadow = new WeakMap(), _Dialog_forceDialogCloseInDevToolsBound = new WeakMap(), _Dialog_handleScrollAttemptBound = new WeakMap(), _Dialog_props = new WeakMap(), _Dialog_dialog = new WeakMap(), _Dialog_isPendingShowDialog = new WeakMap(), _Dialog_isPendingCloseDialog = new WeakMap(), _Dialog_hitArea = new WeakMap(), _Dialog_dialogClientRect = new WeakMap(), _Dialog_bestVerticalPositionInternal = new WeakMap(), _Dialog_bestHorizontalAlignment = new WeakMap(), _Dialog_devtoolsMutationObserver = new WeakMap(), _Dialog_dialogResizeObserver = new WeakMap(), _Dialog_devToolsBoundingElement = new WeakMap(), _Dialog_onKeyDownBound = new WeakMap(), _Dialog_instances = new WeakSet(), _Dialog_updateDialogBounds = function _Dialog_updateDialogBounds() {
    __classPrivateFieldSet(this, _Dialog_dialogClientRect, __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getDialog).call(this).getBoundingClientRect(), "f");
}, _Dialog_onStateChange = function _Dialog_onStateChange() {
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_render));
}, _Dialog_getDialog = function _Dialog_getDialog() {
    if (!__classPrivateFieldGet(this, _Dialog_dialog, "f")) {
        __classPrivateFieldSet(this, _Dialog_dialog, __classPrivateFieldGet(this, _Dialog_shadow, "f").querySelector('dialog'), "f");
        if (!__classPrivateFieldGet(this, _Dialog_dialog, "f")) {
            throw new Error('Dialog not found');
        }
        __classPrivateFieldGet(this, _Dialog_dialogResizeObserver, "f").observe(__classPrivateFieldGet(this, _Dialog_dialog, "f"));
    }
    return __classPrivateFieldGet(this, _Dialog_dialog, "f");
}, _Dialog_handlePointerEvent = async function _Dialog_handlePointerEvent(evt) {
    evt.stopPropagation();
    // If the user uses the keyboard to interact with an element within the
    // dialog, it will trigger a pointer event (for example, the user might use
    // their spacebar to "click" on a form input element). In that case the
    // pointerType will be an empty string, rather than `mouse`, `pen` or
    // `touch`. In this instance, we early return, because we only need to
    // worry about clicks outside of the dialog. Once the dialog is open, the
    // user can only use the keyboard to navigate within the dialog; so we
    // don't have to concern ourselves with keyboard events that occur outside
    // the dialog's bounds.
    if (evt instanceof PointerEvent && evt.pointerType === '') {
        return;
    }
    const eventWasInDialogContent = __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_mouseEventWasInDialogContent).call(this, evt);
    const eventWasInHitArea = __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_mouseEventWasInHitArea).call(this, evt);
    if (eventWasInDialogContent) {
        return;
    }
    if (evt.type === 'pointermove') {
        if (eventWasInHitArea) {
            return;
        }
        this.dispatchEvent(new PointerLeftDialogEvent());
        return;
    }
    this.dispatchEvent(new ClickOutsideDialogEvent());
}, _Dialog_animationEndedEvent = function _Dialog_animationEndedEvent() {
    this.dispatchEvent(new AnimationEndedEvent());
}, _Dialog_mouseEventWasInDialogContent = function _Dialog_mouseEventWasInDialogContent(evt) {
    const dialogBounds = __classPrivateFieldGet(this, _Dialog_dialogClientRect, "f");
    let animationOffSetValue = this.bestVerticalPosition === "bottom" /* DialogVerticalPosition.BOTTOM */ ?
        DIALOG_ANIMATION_OFFSET :
        -1 * DIALOG_ANIMATION_OFFSET;
    if (__classPrivateFieldGet(this, _Dialog_props, "f").origin === MODAL) {
        // When shown as a modal, the dialog is not animated
        animationOffSetValue = 0;
    }
    const eventWasDialogContentX = evt.pageX >= dialogBounds.left && evt.pageX <= dialogBounds.left + dialogBounds.width;
    const eventWasDialogContentY = evt.pageY >= dialogBounds.top + animationOffSetValue &&
        evt.pageY <= dialogBounds.top + dialogBounds.height + animationOffSetValue;
    return eventWasDialogContentX && eventWasDialogContentY;
}, _Dialog_mouseEventWasInHitArea = function _Dialog_mouseEventWasInHitArea(evt) {
    const hitAreaBounds = __classPrivateFieldGet(this, _Dialog_hitArea, "f");
    const eventWasInHitAreaX = evt.pageX >= hitAreaBounds.left && evt.pageX <= hitAreaBounds.left + hitAreaBounds.width;
    const eventWasInHitAreaY = evt.pageY >= hitAreaBounds.top && evt.pageY <= hitAreaBounds.top + hitAreaBounds.height;
    return eventWasInHitAreaX && eventWasInHitAreaY;
}, _Dialog_getCoordinatesFromDialogOrigin = function _Dialog_getCoordinatesFromDialogOrigin(origin) {
    if (!origin || origin === MODAL) {
        throw new Error('Dialog origin is null');
    }
    const anchor = origin instanceof Function ? origin() : origin;
    if (anchor instanceof DOMPoint) {
        return { top: anchor.y, bottom: anchor.y, left: anchor.x, right: anchor.x };
    }
    if (anchor instanceof HTMLElement) {
        return anchor.getBoundingClientRect();
    }
    return anchor;
}, _Dialog_getBestHorizontalAlignment = function _Dialog_getBestHorizontalAlignment(anchorBounds, devtoolsBounds) {
    if (devtoolsBounds.right - anchorBounds.left > anchorBounds.right - devtoolsBounds.left) {
        return "left" /* DialogHorizontalAlignment.LEFT */;
    }
    return "right" /* DialogHorizontalAlignment.RIGHT */;
}, _Dialog_getBestVerticalPosition = function _Dialog_getBestVerticalPosition(originBounds, dialogHeight, devtoolsBounds) {
    // If the dialog's full height doesn't fit at the bottom attempt to
    // position it at the top. If it doesn't fit at the top either
    // position it at the bottom and make the overflow scrollable.
    if (originBounds.bottom + dialogHeight > devtoolsBounds.height &&
        originBounds.top - dialogHeight > devtoolsBounds.top) {
        return "top" /* DialogVerticalPosition.TOP */;
    }
    return "bottom" /* DialogVerticalPosition.BOTTOM */;
}, _Dialog_positionDialog = function _Dialog_positionDialog() {
    if (!__classPrivateFieldGet(this, _Dialog_props, "f").origin) {
        return;
    }
    __classPrivateFieldSet(this, _Dialog_isPendingShowDialog, true, "f");
    void RenderCoordinator.read(() => {
        // Fixed elements are positioned relative to the window, regardless if
        // DevTools is docked. As such, if DevTools is docked we must account for
        // its offset relative to the window when positioning fixed elements.
        // DevTools' effective offset can be determined using
        // this.#devToolsBoundingElement.
        const devtoolsBounds = __classPrivateFieldGet(this, _Dialog_devToolsBoundingElement, "f").getBoundingClientRect();
        const devToolsWidth = devtoolsBounds.width;
        const devToolsHeight = devtoolsBounds.height;
        const devToolsLeft = devtoolsBounds.left;
        const devToolsTop = devtoolsBounds.top;
        const devToolsRight = devtoolsBounds.right;
        if (__classPrivateFieldGet(this, _Dialog_props, "f").origin === MODAL) {
            void RenderCoordinator.write(() => {
                this.style.setProperty('--dialog-top', `${devToolsTop}px`);
                this.style.setProperty('--dialog-left', `${devToolsLeft}px`);
                this.style.setProperty('--dialog-margin', 'auto');
                this.style.setProperty('--dialog-margin-left', 'auto');
                this.style.setProperty('--dialog-margin-bottom', 'auto');
                this.style.setProperty('--dialog-max-height', `${devToolsHeight - DIALOG_PADDING_FROM_WINDOW}px`);
                this.style.setProperty('--dialog-max-width', `${devToolsWidth - DIALOG_PADDING_FROM_WINDOW}px`);
                this.style.setProperty('--dialog-right', `${document.body.clientWidth - devToolsRight}px`);
            });
            return;
        }
        const anchor = __classPrivateFieldGet(this, _Dialog_props, "f").origin;
        const absoluteAnchorBounds = __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getCoordinatesFromDialogOrigin).call(this, anchor);
        const { top: anchorTop, right: anchorRight, bottom: anchorBottom, left: anchorLeft } = absoluteAnchorBounds;
        const originCenterX = (anchorLeft + anchorRight) / 2;
        const hitAreaWidth = anchorRight - anchorLeft + CONNECTOR_HEIGHT;
        const windowWidth = document.body.clientWidth;
        const connectorFixedXValue = __classPrivateFieldGet(this, _Dialog_props, "f").getConnectorCustomXPosition ? __classPrivateFieldGet(this, _Dialog_props, "f").getConnectorCustomXPosition() : originCenterX;
        void RenderCoordinator.write(() => {
            this.style.setProperty('--dialog-top', '0');
            // Start by showing the dialog hidden to allow measuring its width.
            const dialog = __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getDialog).call(this);
            dialog.style.visibility = 'hidden';
            if (__classPrivateFieldGet(this, _Dialog_isPendingShowDialog, "f") && !dialog.hasAttribute('open')) {
                dialog.showModal();
                this.setAttribute('open', '');
                __classPrivateFieldSet(this, _Dialog_isPendingShowDialog, false, "f");
            }
            const { width: dialogWidth, height: dialogHeight } = dialog.getBoundingClientRect();
            __classPrivateFieldSet(this, _Dialog_bestHorizontalAlignment, __classPrivateFieldGet(this, _Dialog_props, "f").horizontalAlignment === "auto" /* DialogHorizontalAlignment.AUTO */ ?
                __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getBestHorizontalAlignment).call(this, absoluteAnchorBounds, devtoolsBounds) :
                __classPrivateFieldGet(this, _Dialog_props, "f").horizontalAlignment, "f");
            __classPrivateFieldSet(this, _Dialog_bestVerticalPositionInternal, __classPrivateFieldGet(this, _Dialog_props, "f").position === "auto" /* DialogVerticalPosition.AUTO */ ?
                __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getBestVerticalPosition).call(this, absoluteAnchorBounds, dialogHeight, devtoolsBounds) :
                __classPrivateFieldGet(this, _Dialog_props, "f").position, "f");
            if (__classPrivateFieldGet(this, _Dialog_bestHorizontalAlignment, "f") === "auto" /* DialogHorizontalAlignment.AUTO */ ||
                __classPrivateFieldGet(this, _Dialog_bestVerticalPositionInternal, "f") === "auto" /* DialogVerticalPosition.AUTO */) {
                return;
            }
            __classPrivateFieldGet(this, _Dialog_hitArea, "f").height = anchorBottom - anchorTop + CONNECTOR_HEIGHT;
            __classPrivateFieldGet(this, _Dialog_hitArea, "f").width = hitAreaWidth;
            // If the connector is to be shown, the dialog needs a minimum width such that it covers
            // the connector's width.
            this.style.setProperty('--content-min-width', `${connectorFixedXValue - anchorLeft + CONNECTOR_WIDTH + DIALOG_SIDE_PADDING * 2}px`);
            this.style.setProperty('--dialog-left', 'auto');
            this.style.setProperty('--dialog-right', 'auto');
            this.style.setProperty('--dialog-margin', '0');
            switch (__classPrivateFieldGet(this, _Dialog_bestHorizontalAlignment, "f")) {
                case "left" /* DialogHorizontalAlignment.LEFT */: {
                    // Position the dialog such that its left border is in line with that of its anchor.
                    // If this means the dialog's left border is out of DevTools bounds, move it to the right.
                    // Cap its width as needed so that the right border doesn't overflow.
                    const dialogLeft = Math.max(anchorLeft, devToolsLeft);
                    const devtoolsRightBorderToDialogLeft = devToolsRight - dialogLeft;
                    const dialogMaxWidth = devtoolsRightBorderToDialogLeft - DIALOG_PADDING_FROM_WINDOW;
                    this.style.setProperty('--dialog-left', `${dialogLeft}px`);
                    __classPrivateFieldGet(this, _Dialog_hitArea, "f").x = anchorLeft;
                    this.style.setProperty('--dialog-max-width', `${dialogMaxWidth}px`);
                    break;
                }
                case "right" /* DialogHorizontalAlignment.RIGHT */: {
                    // Position the dialog such that its right border is in line with that of its anchor.
                    // If this means the dialog's right border is out of DevTools bounds, move it to the left.
                    // Cap its width as needed so that the left border doesn't overflow.
                    const windowRightBorderToAnchorRight = windowWidth - anchorRight;
                    const windowRightBorderToDevToolsRight = windowWidth - devToolsRight;
                    const windowRightBorderToDialogRight = Math.max(windowRightBorderToAnchorRight, windowRightBorderToDevToolsRight);
                    const dialogRight = windowWidth - windowRightBorderToDialogRight;
                    const devtoolsLeftBorderToDialogRight = dialogRight - devToolsLeft;
                    const dialogMaxWidth = devtoolsLeftBorderToDialogRight - DIALOG_PADDING_FROM_WINDOW;
                    __classPrivateFieldGet(this, _Dialog_hitArea, "f").x = windowWidth - windowRightBorderToDialogRight - hitAreaWidth;
                    this.style.setProperty('--dialog-right', `${windowRightBorderToDialogRight}px`);
                    this.style.setProperty('--dialog-max-width', `${dialogMaxWidth}px`);
                    break;
                }
                case "center" /* DialogHorizontalAlignment.CENTER */: {
                    // Position the dialog aligned with its anchor's center as long as its borders don't overlap
                    // with those of DevTools. In case one border overlaps, move the dialog to the opposite side.
                    // In case both borders overlap, reduce its width to that of DevTools.
                    const dialogCappedWidth = Math.min(devToolsWidth - DIALOG_PADDING_FROM_WINDOW, dialogWidth);
                    let dialogLeft = Math.max(originCenterX - dialogCappedWidth * 0.5, devToolsLeft);
                    dialogLeft = Math.min(dialogLeft, devToolsRight - dialogCappedWidth);
                    this.style.setProperty('--dialog-left', `${dialogLeft}px`);
                    __classPrivateFieldGet(this, _Dialog_hitArea, "f").x = originCenterX - hitAreaWidth * 0.5;
                    this.style.setProperty('--dialog-max-width', `${devToolsWidth - DIALOG_PADDING_FROM_WINDOW}px`);
                    break;
                }
                default:
                    Platform.assertNever(__classPrivateFieldGet(this, _Dialog_bestHorizontalAlignment, "f"), `Unknown alignment type: ${__classPrivateFieldGet(this, _Dialog_bestHorizontalAlignment, "f")}`);
            }
            switch (__classPrivateFieldGet(this, _Dialog_bestVerticalPositionInternal, "f")) {
                case "top" /* DialogVerticalPosition.TOP */: {
                    this.style.setProperty('--dialog-top', '0');
                    this.style.setProperty('--dialog-margin', 'auto');
                    this.style.setProperty('--dialog-margin-bottom', `${innerHeight - anchorTop}px`);
                    __classPrivateFieldGet(this, _Dialog_hitArea, "f").y = anchorTop - CONNECTOR_HEIGHT;
                    this.style.setProperty('--dialog-offset-y', `${DIALOG_ANIMATION_OFFSET}px`);
                    this.style.setProperty('--dialog-max-height', `${devToolsHeight - (innerHeight - anchorTop) - DIALOG_PADDING_FROM_WINDOW}px`);
                    break;
                }
                case "bottom" /* DialogVerticalPosition.BOTTOM */: {
                    this.style.setProperty('--dialog-top', `${anchorBottom}px`);
                    __classPrivateFieldGet(this, _Dialog_hitArea, "f").y = anchorTop;
                    this.style.setProperty('--dialog-offset-y', `-${DIALOG_ANIMATION_OFFSET}px`);
                    this.style.setProperty('--dialog-max-height', `${devToolsHeight - (anchorBottom - devToolsTop) - DIALOG_PADDING_FROM_WINDOW}px`);
                    break;
                }
                default:
                    Platform.assertNever(__classPrivateFieldGet(this, _Dialog_bestVerticalPositionInternal, "f"), `Unknown position type: ${__classPrivateFieldGet(this, _Dialog_bestVerticalPositionInternal, "f")}`);
            }
            dialog.close();
            dialog.style.visibility = '';
        });
    });
}, _Dialog_showDialog = async function _Dialog_showDialog() {
    if (!IS_DIALOG_SUPPORTED) {
        return;
    }
    if (__classPrivateFieldGet(this, _Dialog_isPendingShowDialog, "f") || this.hasAttribute('open')) {
        return;
    }
    __classPrivateFieldSet(this, _Dialog_isPendingShowDialog, true, "f");
    __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_positionDialog).call(this);
    // Allow the CSS variables to be set before showing.
    await RenderCoordinator.done();
    __classPrivateFieldSet(this, _Dialog_isPendingShowDialog, false, "f");
    const dialog = __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getDialog).call(this);
    // Make the dialog visible now.
    if (!dialog.hasAttribute('open')) {
        dialog.showModal();
    }
    if (__classPrivateFieldGet(this, _Dialog_props, "f").dialogShownCallback) {
        await __classPrivateFieldGet(this, _Dialog_props, "f").dialogShownCallback();
    }
    __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_updateDialogBounds).call(this);
    document.body.addEventListener('keydown', __classPrivateFieldGet(this, _Dialog_onKeyDownBound, "f"));
}, _Dialog_handleScrollAttempt = function _Dialog_handleScrollAttempt(event) {
    if (__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_mouseEventWasInDialogContent).call(this, event) || !__classPrivateFieldGet(this, _Dialog_props, "f").closeOnScroll ||
        !__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getDialog).call(this).hasAttribute('open')) {
        return;
    }
    __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_closeDialog).call(this);
    this.dispatchEvent(new ForcedDialogClose());
}, _Dialog_onKeyDown = function _Dialog_onKeyDown(event) {
    if (!__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getDialog).call(this).hasAttribute('open') || !__classPrivateFieldGet(this, _Dialog_props, "f").closeOnESC) {
        return;
    }
    if (event.key !== Platform.KeyboardUtilities.ESCAPE_KEY) {
        return;
    }
    event.stopPropagation();
    event.preventDefault();
    __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_closeDialog).call(this);
    this.dispatchEvent(new ForcedDialogClose());
}, _Dialog_onCancel = function _Dialog_onCancel(event) {
    event.stopPropagation();
    event.preventDefault();
    if (!__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getDialog).call(this).hasAttribute('open') || !__classPrivateFieldGet(this, _Dialog_props, "f").closeOnESC) {
        return;
    }
    this.dispatchEvent(new ForcedDialogClose());
}, _Dialog_forceDialogCloseInDevToolsMutation = function _Dialog_forceDialogCloseInDevToolsMutation() {
    if (!__classPrivateFieldGet(this, _Dialog_dialog, "f")?.hasAttribute('open')) {
        return;
    }
    if (__classPrivateFieldGet(this, _Dialog_devToolsBoundingElement, "f") === document.body) {
        // Do not close if running in test environment.
        return;
    }
    __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_closeDialog).call(this);
    this.dispatchEvent(new ForcedDialogClose());
}, _Dialog_closeDialog = function _Dialog_closeDialog() {
    if (__classPrivateFieldGet(this, _Dialog_isPendingCloseDialog, "f") || !__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getDialog).call(this).hasAttribute('open')) {
        return;
    }
    __classPrivateFieldSet(this, _Dialog_isPendingCloseDialog, true, "f");
    void RenderCoordinator.write(() => {
        __classPrivateFieldGet(this, _Dialog_hitArea, "f").width = 0;
        this.removeAttribute('open');
        __classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getDialog).call(this).close();
        __classPrivateFieldSet(this, _Dialog_isPendingCloseDialog, false, "f");
        document.body.removeEventListener('keydown', __classPrivateFieldGet(this, _Dialog_onKeyDownBound, "f"));
    });
}, _Dialog_renderHeaderRow = function _Dialog_renderHeaderRow() {
    // If the title is empty and close button is false, let's skip the header row.
    if (!__classPrivateFieldGet(this, _Dialog_props, "f").dialogTitle && !__classPrivateFieldGet(this, _Dialog_props, "f").closeButton) {
        return null;
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
        <span class="dialog-header-text">${__classPrivateFieldGet(this, _Dialog_props, "f").dialogTitle}</span>
        ${__classPrivateFieldGet(this, _Dialog_props, "f").closeButton ? html `
          <devtools-button
            @click=${__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_closeDialog)}
            .data=${{
        variant: "toolbar" /* Buttons.Button.Variant.TOOLBAR */,
        iconName: 'cross',
        title: i18nString(UIStrings.close),
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
    }}
            jslog=${VisualLogging.close().track({ click: true })}
          ></devtools-button>
        ` : Lit.nothing}
    `;
    // clang-format on
}, _Dialog_render = function _Dialog_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('Dialog render was not scheduled');
    }
    if (!IS_DIALOG_SUPPORTED) {
        // To make sure that light dom content passed into this component doesn't show up,
        // we have to explicitly render a slot and hide it with CSS.
        Lit.render(
        // clang-format off
        html `
        <slot></slot>
      `, __classPrivateFieldGet(this, _Dialog_shadow, "f"), { host: this });
        // clang-format on
        return;
    }
    // clang-format off
    Lit.render(html `
      <style>${dialogStyles}</style>
      <dialog @click=${__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_handlePointerEvent)} @pointermove=${__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_handlePointerEvent)} @cancel=${__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_onCancel)} @animationend=${__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_animationEndedEvent)}
              jslog=${VisualLogging.dialog(__classPrivateFieldGet(this, _Dialog_props, "f").jslogContext).track({ resize: true, keydown: 'Escape' }).parent('mapped')}>
        <div id="content">
          <div class="dialog-header">${__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_renderHeaderRow).call(this)}</div>
          <div class='dialog-content'>
            <slot></slot>
          </div>
        </div>
      </dialog>
    `, __classPrivateFieldGet(this, _Dialog_shadow, "f"), { host: this });
    VisualLogging.setMappedParent(__classPrivateFieldGet(this, _Dialog_instances, "m", _Dialog_getDialog).call(this), this.parentElementOrShadowHost());
    // clang-format on
};
customElements.define('devtools-dialog', Dialog);
export class PointerLeftDialogEvent extends Event {
    constructor() {
        super(PointerLeftDialogEvent.eventName, { bubbles: true, composed: true });
    }
}
PointerLeftDialogEvent.eventName = 'pointerleftdialog';
export class ClickOutsideDialogEvent extends Event {
    constructor() {
        super(ClickOutsideDialogEvent.eventName, { bubbles: true, composed: true });
    }
}
ClickOutsideDialogEvent.eventName = 'clickoutsidedialog';
export class AnimationEndedEvent extends Event {
    constructor() {
        super(AnimationEndedEvent.eventName, { bubbles: true, composed: true });
    }
}
AnimationEndedEvent.eventName = 'animationended';
export class ForcedDialogClose extends Event {
    constructor() {
        super(ForcedDialogClose.eventName, { bubbles: true, composed: true });
    }
}
ForcedDialogClose.eventName = 'forceddialogclose';
export var DialogVerticalPosition;
(function (DialogVerticalPosition) {
    DialogVerticalPosition["TOP"] = "top";
    DialogVerticalPosition["BOTTOM"] = "bottom";
    DialogVerticalPosition["AUTO"] = "auto";
})(DialogVerticalPosition || (DialogVerticalPosition = {}));
export var DialogHorizontalAlignment;
(function (DialogHorizontalAlignment) {
    // Dialog and anchor are aligned on their left borders.
    DialogHorizontalAlignment["LEFT"] = "left";
    // Dialog and anchor are aligned on their right borders.
    DialogHorizontalAlignment["RIGHT"] = "right";
    DialogHorizontalAlignment["CENTER"] = "center";
    // This option allows to set the alignment
    // automatically to LEFT or RIGHT depending
    // on whether the dialog overflows the
    // viewport if it's aligned to the left.
    DialogHorizontalAlignment["AUTO"] = "auto";
})(DialogHorizontalAlignment || (DialogHorizontalAlignment = {}));
//# sourceMappingURL=Dialog.js.map