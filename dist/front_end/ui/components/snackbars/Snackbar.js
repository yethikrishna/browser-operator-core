// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _Snackbar_instances, _a, _Snackbar_shadow, _Snackbar_timeout, _Snackbar_isLongAction, _Snackbar_actionButtonClickHandler, _Snackbar_show, _Snackbar_close, _Snackbar_onActionButtonClickHandler;
import * as i18n from '../../../core/i18n/i18n.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as UI from '../../legacy/legacy.js';
import * as Lit from '../../lit/lit.js';
import * as Buttons from '../buttons/buttons.js';
import snackbarStyles from './snackbar.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Title for close button
     */
    dismiss: 'Dismiss',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/snackbars/Snackbar.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export const DEFAULT_AUTO_DISMISS_MS = 5000;
const LONG_ACTION_THRESHOLD = 15;
/**
 * @attr dismiss-timeout - Timeout in ms after which the snackbar is dismissed (if closable is false).
 * @attr message - The message to display in the snackbar.
 * @attr closable - If true, the snackbar will have a dismiss button. This cancels the auto dismiss behavior.
 * @attr action-button-label - The text for the action button.
 * @attr action-button-title - The title for the action button.
 *
 * @prop {Number} dismissTimeout - reflects the `"dismiss-timeout"` attribute.
 * @prop {String} message - reflects the `"message"` attribute.
 * @prop {Boolean} closable - reflects the `"closable"` attribute.
 * @prop {String} actionButtonLabel - reflects the `"action-button-label"` attribute.
 * @prop {String} actionButtonTitle - reflects the `"action-button-title"` attribute.
 * @prop {Function} actionButtonClickHandler - Function to be triggered when action button is clicked.
 */
export class Snackbar extends HTMLElement {
    /**
     * Returns the timeout (in ms) after which the snackbar is dismissed.
     */
    get dismissTimeout() {
        return this.hasAttribute('dismiss-timeout') ? Number(this.getAttribute('dismiss-timeout')) :
            DEFAULT_AUTO_DISMISS_MS;
    }
    /**
     * Sets the value of the `"dismiss-timeout"` attribute for the snackbar.
     */
    set dismissTimeout(dismissMs) {
        this.setAttribute('dismiss-timeout', dismissMs.toString());
    }
    /**
     * Returns the message displayed in the snackbar.
     */
    get message() {
        return this.getAttribute('message');
    }
    /**
     * Sets the `"message"` attribute for the snackbar.
     */
    set message(message) {
        this.setAttribute('message', message);
    }
    /**
     * Returns whether the snackbar is closable. If true, the snackbar will have a dismiss button.
     * @default false
     */
    get closable() {
        return this.hasAttribute('closable');
    }
    /**
     * Sets the `"closable"` attribute for the snackbar.
     */
    set closable(closable) {
        this.toggleAttribute('closable', closable);
    }
    /**
     * Returns the text for the action button.
     */
    get actionButtonLabel() {
        return this.getAttribute('action-button-label');
    }
    /**
     * Sets the `"action-button-label"` attribute for the snackbar.
     */
    set actionButtonLabel(actionButtonLabel) {
        this.setAttribute('action-button-label', actionButtonLabel);
    }
    /**
     * Returns the title for the action button.
     */
    get actionButtonTitle() {
        return this.getAttribute('action-button-title');
    }
    /**
     * Sets the `"action-button-title"` attribute for the snackbar.
     */
    set actionButtonTitle(actionButtonTitle) {
        this.setAttribute('action-button-title', actionButtonTitle);
    }
    /**
     * Sets the function to be triggered when the action button is clicked.
     * @param {Function} actionButtonClickHandler
     */
    set actionButtonClickHandler(actionButtonClickHandler) {
        __classPrivateFieldSet(this, _Snackbar_actionButtonClickHandler, actionButtonClickHandler, "f");
    }
    constructor(properties) {
        super();
        _Snackbar_instances.add(this);
        _Snackbar_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _Snackbar_timeout.set(this, null);
        _Snackbar_isLongAction.set(this, false);
        _Snackbar_actionButtonClickHandler.set(this, void 0);
        this.message = properties.message;
        if (properties.closable) {
            this.closable = properties.closable;
        }
        if (properties.actionProperties) {
            this.actionButtonLabel = properties.actionProperties.label;
            __classPrivateFieldSet(this, _Snackbar_actionButtonClickHandler, properties.actionProperties.onClick, "f");
            if (properties.actionProperties.title) {
                this.actionButtonTitle = properties.actionProperties.title;
            }
        }
    }
    static show(properties) {
        const snackbar = new _a(properties);
        _a.snackbarQueue.push(snackbar);
        if (_a.snackbarQueue.length === 1) {
            __classPrivateFieldGet(snackbar, _Snackbar_instances, "m", _Snackbar_show).call(snackbar);
        }
        return snackbar;
    }
    connectedCallback() {
        if (this.actionButtonLabel) {
            __classPrivateFieldSet(this, _Snackbar_isLongAction, this.actionButtonLabel.length > LONG_ACTION_THRESHOLD, "f");
        }
        this.role = 'alert';
        const containerCls = Lit.Directives.classMap({
            container: true,
            'long-action': Boolean(__classPrivateFieldGet(this, _Snackbar_isLongAction, "f")),
            closable: Boolean(this.closable),
        });
        // clang-format off
        const actionButton = this.actionButtonLabel ? html `<devtools-button
        class="snackbar-button"
        @click=${__classPrivateFieldGet(this, _Snackbar_instances, "m", _Snackbar_onActionButtonClickHandler)}
        jslog=${VisualLogging.action('snackbar.action').track({ click: true })}
        .variant=${"text" /* Buttons.Button.Variant.TEXT */}
        .title=${this.actionButtonTitle ?? ''}
        .inverseColorTheme=${true}
    >${this.actionButtonLabel}</devtools-button>` : Lit.nothing;
        const crossButton = this.closable ? html `<devtools-button
        class="dismiss snackbar-button"
        @click=${__classPrivateFieldGet(this, _Snackbar_instances, "m", _Snackbar_close)}
        jslog=${VisualLogging.action('snackbar.dismiss').track({ click: true })}
        aria-label=${i18nString(UIStrings.dismiss)}
        .iconName=${'cross'}
        .variant=${"icon" /* Buttons.Button.Variant.ICON */}
        .title=${i18nString(UIStrings.dismiss)}
        .inverseColorTheme=${true}
    ></devtools-button>` : Lit.nothing;
        Lit.render(html `
        <style>${snackbarStyles}</style>
        <div class=${containerCls}>
            <div class="label-container">
                <div class="message">${this.message}</div>
                ${!__classPrivateFieldGet(this, _Snackbar_isLongAction, "f") ? actionButton : Lit.nothing}
                ${crossButton}
            </div>
            ${__classPrivateFieldGet(this, _Snackbar_isLongAction, "f") ? html `<div class="long-action-container">${actionButton}</div>` : Lit.nothing}
        </div>
    `, __classPrivateFieldGet(this, _Snackbar_shadow, "f"), { host: this });
        // clang-format on
    }
}
_a = Snackbar, _Snackbar_shadow = new WeakMap(), _Snackbar_timeout = new WeakMap(), _Snackbar_isLongAction = new WeakMap(), _Snackbar_actionButtonClickHandler = new WeakMap(), _Snackbar_instances = new WeakSet(), _Snackbar_show = function _Snackbar_show() {
    UI.InspectorView.InspectorView.instance().element.appendChild(this);
    if (__classPrivateFieldGet(this, _Snackbar_timeout, "f")) {
        window.clearTimeout(__classPrivateFieldGet(this, _Snackbar_timeout, "f"));
    }
    if (!this.closable) {
        __classPrivateFieldSet(this, _Snackbar_timeout, window.setTimeout(() => {
            __classPrivateFieldGet(this, _Snackbar_instances, "m", _Snackbar_close).call(this);
        }, this.dismissTimeout), "f");
    }
}, _Snackbar_close = function _Snackbar_close() {
    if (__classPrivateFieldGet(this, _Snackbar_timeout, "f")) {
        window.clearTimeout(__classPrivateFieldGet(this, _Snackbar_timeout, "f"));
    }
    this.remove();
    _a.snackbarQueue.shift();
    if (_a.snackbarQueue.length > 0) {
        const nextSnackbar = _a.snackbarQueue[0];
        if (nextSnackbar) {
            __classPrivateFieldGet(nextSnackbar, _Snackbar_instances, "m", _Snackbar_show).call(nextSnackbar);
        }
    }
}, _Snackbar_onActionButtonClickHandler = function _Snackbar_onActionButtonClickHandler(event) {
    if (__classPrivateFieldGet(this, _Snackbar_actionButtonClickHandler, "f")) {
        event.preventDefault();
        __classPrivateFieldGet(this, _Snackbar_actionButtonClickHandler, "f").call(this);
        __classPrivateFieldGet(this, _Snackbar_instances, "m", _Snackbar_close).call(this);
    }
};
Snackbar.snackbarQueue = [];
customElements.define('devtools-snackbar', Snackbar);
//# sourceMappingURL=Snackbar.js.map