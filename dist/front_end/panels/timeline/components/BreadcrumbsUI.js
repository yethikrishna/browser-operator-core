// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _BreadcrumbsUI_instances, _BreadcrumbsUI_shadow, _BreadcrumbsUI_initialBreadcrumb, _BreadcrumbsUI_activeBreadcrumb, _BreadcrumbsUI_activateBreadcrumb, _BreadcrumbsUI_showBreadcrumbsAndScrollLastCrumbIntoView, _BreadcrumbsUI_onContextMenu, _BreadcrumbsUI_renderElement, _BreadcrumbsUI_render;
import * as i18n from '../../../core/i18n/i18n.js';
import * as Trace from '../../../models/trace/trace.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import { flattenBreadcrumbs } from './Breadcrumbs.js';
import breadcrumbsUIStyles from './breadcrumbsUI.css.js';
const { render, html } = Lit;
const UIStrings = {
    /**
     *@description A context menu item in the Minimap Breadcrumb context menu.
     * This context menu option activates the breadcrumb that the context menu was opened on.
     */
    activateBreadcrumb: 'Activate breadcrumb',
    /**
     *@description A context menu item in the Minimap Breadcrumb context menu.
     * This context menu option removed all the child breadcrumbs and activates
     * the breadcrumb that the context menu was opened on.
     */
    removeChildBreadcrumbs: 'Remove child breadcrumbs',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/BreadcrumbsUI.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class BreadcrumbActivatedEvent extends Event {
    constructor(breadcrumb, childBreadcrumbsRemoved) {
        super(BreadcrumbActivatedEvent.eventName);
        this.breadcrumb = breadcrumb;
        this.childBreadcrumbsRemoved = childBreadcrumbsRemoved;
    }
}
BreadcrumbActivatedEvent.eventName = 'breadcrumbactivated';
export class BreadcrumbsUI extends HTMLElement {
    constructor() {
        super(...arguments);
        _BreadcrumbsUI_instances.add(this);
        _BreadcrumbsUI_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _BreadcrumbsUI_initialBreadcrumb.set(this, null);
        _BreadcrumbsUI_activeBreadcrumb.set(this, null);
    }
    set data(data) {
        __classPrivateFieldSet(this, _BreadcrumbsUI_initialBreadcrumb, data.initialBreadcrumb, "f");
        __classPrivateFieldSet(this, _BreadcrumbsUI_activeBreadcrumb, data.activeBreadcrumb, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _BreadcrumbsUI_instances, "m", _BreadcrumbsUI_render));
    }
}
_BreadcrumbsUI_shadow = new WeakMap(), _BreadcrumbsUI_initialBreadcrumb = new WeakMap(), _BreadcrumbsUI_activeBreadcrumb = new WeakMap(), _BreadcrumbsUI_instances = new WeakSet(), _BreadcrumbsUI_activateBreadcrumb = function _BreadcrumbsUI_activateBreadcrumb(breadcrumb) {
    __classPrivateFieldSet(this, _BreadcrumbsUI_activeBreadcrumb, breadcrumb, "f");
    this.dispatchEvent(new BreadcrumbActivatedEvent(breadcrumb));
}, _BreadcrumbsUI_showBreadcrumbsAndScrollLastCrumbIntoView = function _BreadcrumbsUI_showBreadcrumbsAndScrollLastCrumbIntoView() {
    const container = __classPrivateFieldGet(this, _BreadcrumbsUI_shadow, "f").querySelector('.breadcrumbs');
    if (!container) {
        return;
    }
    // Display Breadcrumbs after at least one was created
    container.style.display = 'flex';
    requestAnimationFrame(() => {
        // If the width of all the elements is greater than the width of the
        // container, we need to scroll the last element into view.
        if (container.scrollWidth - container.clientWidth > 0) {
            requestAnimationFrame(() => {
                // For some unknown reason, if we scroll after one rAF, the values
                // are slightly off by a few pixels which means that the element does
                // not get properly scrolled fully into view. Therefore we wait for a
                // second rAF, at which point the values are correct and this will
                // scroll the container fully to ensure the last breadcrumb is fully
                // visible.
                container.scrollLeft = container.scrollWidth - container.clientWidth;
            });
        }
    });
}, _BreadcrumbsUI_onContextMenu = function _BreadcrumbsUI_onContextMenu(event, breadcrumb) {
    const menu = new UI.ContextMenu.ContextMenu(event);
    menu.defaultSection().appendItem(i18nString(UIStrings.activateBreadcrumb), () => {
        this.dispatchEvent(new BreadcrumbActivatedEvent(breadcrumb));
    });
    menu.defaultSection().appendItem(i18nString(UIStrings.removeChildBreadcrumbs), () => {
        this.dispatchEvent(new BreadcrumbActivatedEvent(breadcrumb, true));
    });
    void menu.show();
}, _BreadcrumbsUI_renderElement = function _BreadcrumbsUI_renderElement(breadcrumb, index) {
    const breadcrumbRange = Trace.Helpers.Timing.microToMilli(breadcrumb.window.range);
    // clang-format off
    return html `
          <div class="breadcrumb" @contextmenu=${(event) => __classPrivateFieldGet(this, _BreadcrumbsUI_instances, "m", _BreadcrumbsUI_onContextMenu).call(this, event, breadcrumb)} @click=${() => __classPrivateFieldGet(this, _BreadcrumbsUI_instances, "m", _BreadcrumbsUI_activateBreadcrumb).call(this, breadcrumb)}
          jslog=${VisualLogging.item('timeline.breadcrumb-select').track({ click: true })}>
           <span class="${(breadcrumb === __classPrivateFieldGet(this, _BreadcrumbsUI_activeBreadcrumb, "f")) ? 'active-breadcrumb' : ''} range">
            ${(index === 0) ?
        `Full range (${i18n.TimeUtilities.preciseMillisToString(breadcrumbRange, 2)})` :
        `${i18n.TimeUtilities.preciseMillisToString(breadcrumbRange, 2)}`}
            </span>
          </div>
          ${breadcrumb.child !== null ?
        html `
            <devtools-icon .data=${{
            iconName: 'chevron-right',
            color: 'var(--icon-default)',
            width: '16px',
            height: '16px',
        }}>`
        : ''}
      `;
    // clang-format on
}, _BreadcrumbsUI_render = function _BreadcrumbsUI_render() {
    // clang-format off
    const output = html `
      <style>${breadcrumbsUIStyles}</style>
      ${__classPrivateFieldGet(this, _BreadcrumbsUI_initialBreadcrumb, "f") === null ? Lit.nothing : html `<div class="breadcrumbs" jslog=${VisualLogging.section('breadcrumbs')}>
        ${flattenBreadcrumbs(__classPrivateFieldGet(this, _BreadcrumbsUI_initialBreadcrumb, "f")).map((breadcrumb, index) => __classPrivateFieldGet(this, _BreadcrumbsUI_instances, "m", _BreadcrumbsUI_renderElement).call(this, breadcrumb, index))}
      </div>`}
    `;
    // clang-format on
    render(output, __classPrivateFieldGet(this, _BreadcrumbsUI_shadow, "f"), { host: this });
    if (__classPrivateFieldGet(this, _BreadcrumbsUI_initialBreadcrumb, "f")?.child) {
        // If we have >1 crumbs show breadcrumbs and ensure the last one is visible by scrolling the container.
        __classPrivateFieldGet(this, _BreadcrumbsUI_instances, "m", _BreadcrumbsUI_showBreadcrumbsAndScrollLastCrumbIntoView).call(this);
    }
};
customElements.define('devtools-breadcrumbs-ui', BreadcrumbsUI);
//# sourceMappingURL=BreadcrumbsUI.js.map