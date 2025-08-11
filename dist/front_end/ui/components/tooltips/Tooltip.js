// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _Tooltip_instances, _Tooltip_shadow, _Tooltip_anchor, _Tooltip_timeout, _Tooltip_closing, _Tooltip_anchorObserver, _Tooltip_openedViaHotkey, _Tooltip_previousAnchorRect, _Tooltip_previousPopoverRect, _Tooltip_positionPopover, _Tooltip_updateJslog, _Tooltip_setAttributes, _Tooltip_stopPropagation, _Tooltip_setClosing, _Tooltip_resetClosing, _Tooltip_keyDown, _Tooltip_registerEventListeners, _Tooltip_removeEventListeners, _Tooltip_attachToAnchor, _Tooltip_observeAnchorRemoval;
import * as UI from '../../legacy/legacy.js';
import * as Lit from '../../lit/lit.js';
import * as VisualLogging from '../../visual_logging/visual_logging.js';
import tooltipStyles from './tooltip.css.js';
const { html } = Lit;
const positioningUtils = {
    bottomSpanRight: ({ anchorRect }) => {
        return {
            left: anchorRect.left,
            top: anchorRect.bottom,
        };
    },
    bottomSpanLeft: ({ anchorRect, currentPopoverRect }) => {
        return {
            left: anchorRect.right - currentPopoverRect.width,
            top: anchorRect.bottom,
        };
    },
    bottomCentered: ({ anchorRect, currentPopoverRect }) => {
        return {
            left: anchorRect.left + anchorRect.width / 2 - currentPopoverRect.width / 2,
            top: anchorRect.bottom,
        };
    },
    topCentered: ({ anchorRect, currentPopoverRect }) => {
        return {
            left: anchorRect.left + anchorRect.width / 2 - currentPopoverRect.width / 2,
            top: anchorRect.top - currentPopoverRect.height,
        };
    },
    topSpanRight: ({ anchorRect, currentPopoverRect }) => {
        return {
            left: anchorRect.left,
            top: anchorRect.top - currentPopoverRect.height,
        };
    },
    topSpanLeft: ({ anchorRect, currentPopoverRect }) => {
        return {
            left: anchorRect.right - currentPopoverRect.width,
            top: anchorRect.top - currentPopoverRect.height,
        };
    },
    // Adjusts proposed rect so that the resulting popover is always inside the inspector view bounds.
    insetAdjustedRect: ({ inspectorViewRect, anchorRect, currentPopoverRect, proposedRect }) => {
        if (inspectorViewRect.left > proposedRect.left) {
            proposedRect.left = inspectorViewRect.left;
        }
        if (inspectorViewRect.right < proposedRect.left + currentPopoverRect.width) {
            proposedRect.left = inspectorViewRect.right - currentPopoverRect.width;
        }
        if (proposedRect.top + currentPopoverRect.height > inspectorViewRect.bottom) {
            proposedRect.top = anchorRect.top - currentPopoverRect.height;
        }
        return proposedRect;
    },
    isInBounds: ({ inspectorViewRect, currentPopoverRect, proposedRect }) => {
        return inspectorViewRect.left < proposedRect.left &&
            proposedRect.left + currentPopoverRect.width < inspectorViewRect.right &&
            inspectorViewRect.top < proposedRect.top &&
            proposedRect.top + currentPopoverRect.height < inspectorViewRect.bottom;
    },
    isSameRect: (rect1, rect2) => {
        if (!rect1 || !rect2) {
            return false;
        }
        return rect1 && rect1.left === rect2.left && rect1.top === rect2.top && rect1.width === rect2.width &&
            rect1.height === rect2.height;
    }
};
const proposedRectForRichTooltip = ({ inspectorViewRect, anchorRect, currentPopoverRect }) => {
    // Tries the default positioning of bottom right, bottom left, top right and top left.
    // If they don't work out, we default back to showing in bottom right and adjust its insets so that the popover is inside the inspector view bounds.
    let proposedRect = positioningUtils.bottomSpanRight({ anchorRect, currentPopoverRect });
    if (positioningUtils.isInBounds({ inspectorViewRect, currentPopoverRect, proposedRect })) {
        return proposedRect;
    }
    proposedRect = positioningUtils.bottomSpanLeft({ anchorRect, currentPopoverRect });
    if (positioningUtils.isInBounds({ inspectorViewRect, currentPopoverRect, proposedRect })) {
        return proposedRect;
    }
    proposedRect = positioningUtils.topSpanRight({ anchorRect, currentPopoverRect });
    if (positioningUtils.isInBounds({ inspectorViewRect, currentPopoverRect, proposedRect })) {
        return proposedRect;
    }
    proposedRect = positioningUtils.topSpanLeft({ anchorRect, currentPopoverRect });
    if (positioningUtils.isInBounds({ inspectorViewRect, currentPopoverRect, proposedRect })) {
        return proposedRect;
    }
    // If none of the options work above, we position to bottom right
    // and adjust the insets so that it does not go out of bounds.
    proposedRect = positioningUtils.bottomSpanRight({ anchorRect, currentPopoverRect });
    return positioningUtils.insetAdjustedRect({ anchorRect, currentPopoverRect, inspectorViewRect, proposedRect });
};
const proposedRectForSimpleTooltip = ({ inspectorViewRect, anchorRect, currentPopoverRect }) => {
    // Default options are bottom centered & top centered.
    let proposedRect = positioningUtils.bottomCentered({ anchorRect, currentPopoverRect });
    if (positioningUtils.isInBounds({ inspectorViewRect, currentPopoverRect, proposedRect })) {
        return proposedRect;
    }
    proposedRect = positioningUtils.topCentered({ anchorRect, currentPopoverRect });
    if (positioningUtils.isInBounds({ inspectorViewRect, currentPopoverRect, proposedRect })) {
        return proposedRect;
    }
    // The default options did not work out, so position it to bottom center
    // and adjust the insets to make sure that it does not go out of bounds.
    proposedRect = positioningUtils.bottomCentered({ anchorRect, currentPopoverRect });
    return positioningUtils.insetAdjustedRect({ anchorRect, currentPopoverRect, inspectorViewRect, proposedRect });
};
/**
 * @attr id - Id of the tooltip. Used for searching an anchor element with aria-describedby.
 * @attr hover-delay - Hover length in ms before the tooltip is shown and hidden.
 * @attr variant - Variant of the tooltip, `"simple"` for strings only, inverted background,
 *                 `"rich"` for interactive content, background according to theme's surface.
 * @attr padding - Which padding to use, defaults to `"small"`. Use `"large"` for richer content.
 * @attr use-click - If present, the tooltip will be shown on click instead of on hover.
 * @attr use-hotkey - If present, the tooltip will be shown on hover but not when receiving focus.
 *                    Requires a hotkey to open when fosed (Alt-down). When `"use-click"` is present
 *                    as well, use-click takes precedence.
 * @prop {String} id - reflects the `"id"` attribute.
 * @prop {Number} hoverDelay - reflects the `"hover-delay"` attribute.
 * @prop {String} variant - reflects the `"variant"` attribute.
 * @prop {Boolean} padding - reflects the `"padding"` attribute.
 * @prop {Boolean} useClick - reflects the `"click"` attribute.
 * @prop {Boolean} useHotkey - reflects the `"use-hotkey"` attribute.
 */
export class Tooltip extends HTMLElement {
    get openedViaHotkey() {
        return __classPrivateFieldGet(this, _Tooltip_openedViaHotkey, "f");
    }
    get open() {
        return this.matches(':popover-open');
    }
    get useHotkey() {
        return this.hasAttribute('use-hotkey') ?? false;
    }
    set useHotkey(useHotkey) {
        if (useHotkey) {
            this.setAttribute('use-hotkey', '');
        }
        else {
            this.removeAttribute('use-hotkey');
        }
    }
    get useClick() {
        return this.hasAttribute('use-click') ?? false;
    }
    set useClick(useClick) {
        if (useClick) {
            this.setAttribute('use-click', '');
        }
        else {
            this.removeAttribute('use-click');
        }
    }
    get hoverDelay() {
        return this.hasAttribute('hover-delay') ? Number(this.getAttribute('hover-delay')) : 300;
    }
    set hoverDelay(delay) {
        this.setAttribute('hover-delay', delay.toString());
    }
    get variant() {
        return this.getAttribute('variant') === 'rich' ? 'rich' : 'simple';
    }
    set variant(variant) {
        this.setAttribute('variant', variant);
    }
    get padding() {
        return this.getAttribute('padding') === 'large' ? 'large' : 'small';
    }
    set padding(padding) {
        this.setAttribute('padding', padding);
    }
    get jslogContext() {
        return this.getAttribute('jslogcontext');
    }
    set jslogContext(jslogContext) {
        this.setAttribute('jslogcontext', jslogContext);
        __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_updateJslog).call(this);
    }
    get anchor() {
        return __classPrivateFieldGet(this, _Tooltip_anchor, "f");
    }
    constructor(properties) {
        super();
        _Tooltip_instances.add(this);
        _Tooltip_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _Tooltip_anchor.set(this, null);
        _Tooltip_timeout.set(this, null);
        _Tooltip_closing.set(this, false);
        _Tooltip_anchorObserver.set(this, null);
        _Tooltip_openedViaHotkey.set(this, false);
        _Tooltip_previousAnchorRect.set(this, null);
        _Tooltip_previousPopoverRect.set(this, null);
        this.showTooltip = (event) => {
            // Don't show the tooltip if the mouse is down.
            if (event && 'buttons' in event && event.buttons) {
                return;
            }
            if (__classPrivateFieldGet(this, _Tooltip_timeout, "f")) {
                window.clearTimeout(__classPrivateFieldGet(this, _Tooltip_timeout, "f"));
            }
            __classPrivateFieldSet(this, _Tooltip_timeout, window.setTimeout(() => {
                this.showPopover();
                Tooltip.lastOpenedTooltipId = this.id;
            }, this.hoverDelay), "f");
        };
        this.hideTooltip = (event) => {
            if (__classPrivateFieldGet(this, _Tooltip_timeout, "f")) {
                window.clearTimeout(__classPrivateFieldGet(this, _Tooltip_timeout, "f"));
            }
            // If the event is a blur event, then:
            // 1. event.currentTarget = the element that got blurred
            // 2. event.relatedTarget = the element that gained focus
            // https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget
            // If the blurred element (1) was our anchor, and the newly focused element
            // (2) is within the tooltip, we do not want to hide the tooltip.
            if (event && this.variant === 'rich' && event.target === __classPrivateFieldGet(this, _Tooltip_anchor, "f") && event.relatedTarget instanceof Node &&
                this.contains(event.relatedTarget)) {
                return;
            }
            // Don't hide a rich tooltip when hovering over the tooltip itself.
            if (event && this.variant === 'rich' &&
                (event.relatedTarget === this || event.relatedTarget?.parentElement === this)) {
                return;
            }
            if (this.open && Tooltip.lastOpenedTooltipId === this.id) {
                Tooltip.lastOpenedTooltipId = null;
            }
            __classPrivateFieldSet(this, _Tooltip_timeout, window.setTimeout(() => {
                this.hidePopover();
            }, this.hoverDelay), "f");
        };
        this.toggle = () => {
            // We need this check because clicking on the anchor while the tooltip is open will trigger both
            // the click event on the anchor and the toggle event from the backdrop of the tooltip.
            if (!__classPrivateFieldGet(this, _Tooltip_closing, "f")) {
                this.togglePopover();
            }
        };
        _Tooltip_positionPopover.set(this, () => {
            if (!__classPrivateFieldGet(this, _Tooltip_anchor, "f") || !this.open) {
                __classPrivateFieldSet(this, _Tooltip_previousAnchorRect, null, "f");
                __classPrivateFieldSet(this, _Tooltip_previousPopoverRect, null, "f");
                this.style.visibility = 'hidden';
                return;
            }
            // If there is no change from the previous anchor rect, we don't need to recompute the position.
            const anchorRect = __classPrivateFieldGet(this, _Tooltip_anchor, "f").getBoundingClientRect();
            const currentPopoverRect = this.getBoundingClientRect();
            if (positioningUtils.isSameRect(__classPrivateFieldGet(this, _Tooltip_previousAnchorRect, "f"), anchorRect) &&
                positioningUtils.isSameRect(__classPrivateFieldGet(this, _Tooltip_previousPopoverRect, "f"), currentPopoverRect)) {
                requestAnimationFrame(__classPrivateFieldGet(this, _Tooltip_positionPopover, "f"));
                return;
            }
            __classPrivateFieldSet(this, _Tooltip_previousAnchorRect, anchorRect, "f");
            __classPrivateFieldSet(this, _Tooltip_previousPopoverRect, currentPopoverRect, "f");
            const inspectorViewRect = UI.InspectorView.InspectorView.instance().element.getBoundingClientRect();
            const proposedPopoverRect = this.variant === 'rich' ?
                proposedRectForRichTooltip({ inspectorViewRect, anchorRect, currentPopoverRect }) :
                proposedRectForSimpleTooltip({ inspectorViewRect, anchorRect, currentPopoverRect });
            this.style.left = `${proposedPopoverRect.left}px`;
            this.style.top = `${proposedPopoverRect.top}px`;
            this.style.visibility = 'visible';
            requestAnimationFrame(__classPrivateFieldGet(this, _Tooltip_positionPopover, "f"));
        });
        _Tooltip_setClosing.set(this, (event) => {
            if (event.newState === 'closed') {
                __classPrivateFieldSet(this, _Tooltip_closing, true, "f");
            }
        });
        _Tooltip_resetClosing.set(this, (event) => {
            if (event.newState === 'closed') {
                __classPrivateFieldSet(this, _Tooltip_closing, false, "f");
                __classPrivateFieldSet(this, _Tooltip_openedViaHotkey, false, "f");
            }
        });
        _Tooltip_keyDown.set(this, (event) => {
            if ((event.altKey && event.key === 'ArrowDown') || (event.key === 'Escape' && this.open)) {
                __classPrivateFieldSet(this, _Tooltip_openedViaHotkey, !this.open, "f");
                this.toggle();
                event.consume(true);
            }
        });
        const { id, variant, padding, jslogContext, anchor } = properties ?? {};
        if (id) {
            this.id = id;
        }
        if (variant) {
            this.variant = variant;
        }
        if (padding) {
            this.padding = padding;
        }
        if (jslogContext) {
            this.jslogContext = jslogContext;
        }
        if (anchor) {
            const ref = anchor.getAttribute('aria-details') ?? anchor.getAttribute('aria-describedby');
            if (ref !== id) {
                throw new Error('aria-details or aria-describedby must be set on the anchor');
            }
            __classPrivateFieldSet(this, _Tooltip_anchor, anchor, "f");
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isConnected) {
            // There is no need to do anything before the connectedCallback is called.
            return;
        }
        if (name === 'id') {
            __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_removeEventListeners).call(this);
            __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_attachToAnchor).call(this);
            if (Tooltip.lastOpenedTooltipId === oldValue) {
                Tooltip.lastOpenedTooltipId = newValue;
            }
        }
        else if (name === 'jslogcontext') {
            __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_updateJslog).call(this);
        }
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_attachToAnchor).call(this);
        __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_registerEventListeners).call(this);
        __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_setAttributes).call(this);
        // clang-format off
        Lit.render(html `
      <style>${tooltipStyles}</style>
      <!-- Wrapping it into a container, so that the tooltip doesn't disappear when the mouse moves from the anchor to the tooltip. -->
      <div class="container ${this.padding === 'large' ? 'large-padding' : ''}">
        <slot></slot>
      </div>
    `, __classPrivateFieldGet(this, _Tooltip_shadow, "f"), { host: this });
        // clang-format on
        if (Tooltip.lastOpenedTooltipId === this.id) {
            this.showPopover();
        }
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_removeEventListeners).call(this);
        __classPrivateFieldGet(this, _Tooltip_anchorObserver, "f")?.disconnect();
    }
}
_Tooltip_shadow = new WeakMap(), _Tooltip_anchor = new WeakMap(), _Tooltip_timeout = new WeakMap(), _Tooltip_closing = new WeakMap(), _Tooltip_anchorObserver = new WeakMap(), _Tooltip_openedViaHotkey = new WeakMap(), _Tooltip_previousAnchorRect = new WeakMap(), _Tooltip_previousPopoverRect = new WeakMap(), _Tooltip_positionPopover = new WeakMap(), _Tooltip_setClosing = new WeakMap(), _Tooltip_resetClosing = new WeakMap(), _Tooltip_keyDown = new WeakMap(), _Tooltip_instances = new WeakSet(), _Tooltip_updateJslog = function _Tooltip_updateJslog() {
    if (this.jslogContext && __classPrivateFieldGet(this, _Tooltip_anchor, "f")) {
        VisualLogging.setMappedParent(this, __classPrivateFieldGet(this, _Tooltip_anchor, "f"));
        this.setAttribute('jslog', VisualLogging.popover(this.jslogContext).parent('mapped').toString());
    }
    else {
        this.removeAttribute('jslog');
    }
}, _Tooltip_setAttributes = function _Tooltip_setAttributes() {
    if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'tooltip');
    }
    this.setAttribute('popover', this.useClick ? 'auto' : 'manual');
    __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_updateJslog).call(this);
}, _Tooltip_stopPropagation = function _Tooltip_stopPropagation(event) {
    event.stopPropagation();
}, _Tooltip_registerEventListeners = function _Tooltip_registerEventListeners() {
    if (__classPrivateFieldGet(this, _Tooltip_anchor, "f")) {
        if (this.useClick) {
            __classPrivateFieldGet(this, _Tooltip_anchor, "f").addEventListener('click', this.toggle);
        }
        else {
            __classPrivateFieldGet(this, _Tooltip_anchor, "f").addEventListener('mouseenter', this.showTooltip);
            if (this.useHotkey) {
                __classPrivateFieldGet(this, _Tooltip_anchor, "f").addEventListener('keydown', __classPrivateFieldGet(this, _Tooltip_keyDown, "f"));
            }
            else {
                __classPrivateFieldGet(this, _Tooltip_anchor, "f").addEventListener('focus', this.showTooltip);
            }
            __classPrivateFieldGet(this, _Tooltip_anchor, "f").addEventListener('blur', this.hideTooltip);
            __classPrivateFieldGet(this, _Tooltip_anchor, "f").addEventListener('mouseleave', this.hideTooltip);
            this.addEventListener('mouseleave', this.hideTooltip);
        }
    }
    // Prevent interaction with the parent element.
    this.addEventListener('click', __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_stopPropagation));
    this.addEventListener('mouseup', __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_stopPropagation));
    this.addEventListener('beforetoggle', __classPrivateFieldGet(this, _Tooltip_setClosing, "f"));
    this.addEventListener('toggle', __classPrivateFieldGet(this, _Tooltip_resetClosing, "f"));
    this.addEventListener('toggle', __classPrivateFieldGet(this, _Tooltip_positionPopover, "f"));
}, _Tooltip_removeEventListeners = function _Tooltip_removeEventListeners() {
    if (__classPrivateFieldGet(this, _Tooltip_timeout, "f")) {
        window.clearTimeout(__classPrivateFieldGet(this, _Tooltip_timeout, "f"));
    }
    if (__classPrivateFieldGet(this, _Tooltip_anchor, "f")) {
        __classPrivateFieldGet(this, _Tooltip_anchor, "f").removeEventListener('click', this.toggle);
        __classPrivateFieldGet(this, _Tooltip_anchor, "f").removeEventListener('mouseenter', this.showTooltip);
        __classPrivateFieldGet(this, _Tooltip_anchor, "f").removeEventListener('focus', this.showTooltip);
        __classPrivateFieldGet(this, _Tooltip_anchor, "f").removeEventListener('blur', this.hideTooltip);
        __classPrivateFieldGet(this, _Tooltip_anchor, "f").removeEventListener('keydown', __classPrivateFieldGet(this, _Tooltip_keyDown, "f"));
        __classPrivateFieldGet(this, _Tooltip_anchor, "f").removeEventListener('mouseleave', this.hideTooltip);
    }
    this.removeEventListener('mouseleave', this.hideTooltip);
    this.removeEventListener('click', __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_stopPropagation));
    this.removeEventListener('mouseup', __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_stopPropagation));
    this.removeEventListener('beforetoggle', __classPrivateFieldGet(this, _Tooltip_setClosing, "f"));
    this.removeEventListener('toggle', __classPrivateFieldGet(this, _Tooltip_resetClosing, "f"));
    this.removeEventListener('toggle', __classPrivateFieldGet(this, _Tooltip_positionPopover, "f"));
}, _Tooltip_attachToAnchor = function _Tooltip_attachToAnchor() {
    if (!__classPrivateFieldGet(this, _Tooltip_anchor, "f")) {
        const id = this.getAttribute('id');
        if (!id) {
            throw new Error('<devtools-tooltip> must have an id.');
        }
        const root = this.getRootNode();
        if (root.querySelectorAll(`#${id}`)?.length > 1) {
            throw new Error('Duplicate <devtools-tooltip> ids found.');
        }
        const describedbyAnchor = root.querySelector(`[aria-describedby="${id}"]`);
        const detailsAnchor = root.querySelector(`[aria-details="${id}"]`);
        const anchor = describedbyAnchor ?? detailsAnchor;
        if (!anchor) {
            throw new Error(`No anchor for tooltip with id ${id} found.`);
        }
        if (!(anchor instanceof HTMLElement)) {
            throw new Error('Anchor must be an HTMLElement.');
        }
        __classPrivateFieldSet(this, _Tooltip_anchor, anchor, "f");
        if (this.variant === 'rich' && describedbyAnchor) {
            console.warn(`The anchor for tooltip ${id} was defined with "aria-describedby". For rich tooltips "aria-details" is more appropriate.`);
        }
    }
    __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_observeAnchorRemoval).call(this, __classPrivateFieldGet(this, _Tooltip_anchor, "f"));
    __classPrivateFieldGet(this, _Tooltip_instances, "m", _Tooltip_updateJslog).call(this);
}, _Tooltip_observeAnchorRemoval = function _Tooltip_observeAnchorRemoval(anchor) {
    if (anchor.parentElement === null) {
        return;
    }
    if (__classPrivateFieldGet(this, _Tooltip_anchorObserver, "f")) {
        __classPrivateFieldGet(this, _Tooltip_anchorObserver, "f").disconnect();
    }
    __classPrivateFieldSet(this, _Tooltip_anchorObserver, new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && [...mutation.removedNodes].includes(anchor)) {
                if (__classPrivateFieldGet(this, _Tooltip_timeout, "f")) {
                    window.clearTimeout(__classPrivateFieldGet(this, _Tooltip_timeout, "f"));
                }
                this.hidePopover();
            }
        }
    }), "f");
    __classPrivateFieldGet(this, _Tooltip_anchorObserver, "f").observe(anchor.parentElement, { childList: true });
};
Tooltip.observedAttributes = ['id', 'variant', 'jslogcontext'];
Tooltip.lastOpenedTooltipId = null;
customElements.define('devtools-tooltip', Tooltip);
//# sourceMappingURL=Tooltip.js.map