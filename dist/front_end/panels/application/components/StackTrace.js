// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _StackTraceRow_instances, _StackTraceRow_shadow, _StackTraceRow_stackTraceRowItem, _StackTraceRow_render, _StackTraceLinkButton_instances, _StackTraceLinkButton_shadow, _StackTraceLinkButton_onShowAllClick, _StackTraceLinkButton_hiddenCallFramesCount, _StackTraceLinkButton_expandedView, _StackTraceLinkButton_render, _StackTrace_instances, _StackTrace_shadow, _StackTrace_linkifier, _StackTrace_stackTraceRows, _StackTrace_showHidden, _StackTrace_onStackTraceRowsUpdated, _StackTrace_onToggleShowAllClick, _StackTrace_render;
import '../../../ui/components/expandable_list/expandable_list.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Bindings from '../../../models/bindings/bindings.js';
import * as Components from '../../../ui/legacy/components/utils/utils.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import stackTraceLinkButtonStyles from './stackTraceLinkButton.css.js';
import stackTraceRowStyles from './stackTraceRow.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description Error message stating that something went wrong when tring to render stack trace
     */
    cannotRenderStackTrace: 'Cannot render stack trace',
    /**
     *@description A link to show more frames in the stack trace if more are available. Never 0.
     */
    showSMoreFrames: '{n, plural, =1 {Show # more frame} other {Show # more frames}}',
    /**
     *@description A link to rehide frames that are by default hidden.
     */
    showLess: 'Show less',
    /**
     *@description Label for a stack trace. If a frame is created programmatically (i.e. via JavaScript), there is a
     * stack trace for the line of code which caused the creation of the iframe. This is the stack trace we are showing here.
     */
    creationStackTrace: 'Frame Creation `Stack Trace`',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/components/StackTrace.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class StackTraceRow extends HTMLElement {
    constructor() {
        super(...arguments);
        _StackTraceRow_instances.add(this);
        _StackTraceRow_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _StackTraceRow_stackTraceRowItem.set(this, null);
    }
    set data(data) {
        __classPrivateFieldSet(this, _StackTraceRow_stackTraceRowItem, data.stackTraceRowItem, "f");
        __classPrivateFieldGet(this, _StackTraceRow_instances, "m", _StackTraceRow_render).call(this);
    }
}
_StackTraceRow_shadow = new WeakMap(), _StackTraceRow_stackTraceRowItem = new WeakMap(), _StackTraceRow_instances = new WeakSet(), _StackTraceRow_render = function _StackTraceRow_render() {
    if (!__classPrivateFieldGet(this, _StackTraceRow_stackTraceRowItem, "f")) {
        return;
    }
    Lit.render(html `
      <style>${stackTraceRowStyles}</style>
      <div class="stack-trace-row">
              <div class="stack-trace-function-name text-ellipsis" title=${__classPrivateFieldGet(this, _StackTraceRow_stackTraceRowItem, "f").functionName}>
                ${__classPrivateFieldGet(this, _StackTraceRow_stackTraceRowItem, "f").functionName}
              </div>
              <div class="stack-trace-source-location">
                ${__classPrivateFieldGet(this, _StackTraceRow_stackTraceRowItem, "f").link ?
        html `<div class="text-ellipsis">\xA0@\xA0${__classPrivateFieldGet(this, _StackTraceRow_stackTraceRowItem, "f").link}</div>` :
        Lit.nothing}
              </div>
            </div>
    `, __classPrivateFieldGet(this, _StackTraceRow_shadow, "f"), { host: this });
};
export class StackTraceLinkButton extends HTMLElement {
    constructor() {
        super(...arguments);
        _StackTraceLinkButton_instances.add(this);
        _StackTraceLinkButton_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _StackTraceLinkButton_onShowAllClick.set(this, () => { });
        _StackTraceLinkButton_hiddenCallFramesCount.set(this, null);
        _StackTraceLinkButton_expandedView.set(this, false);
    }
    set data(data) {
        __classPrivateFieldSet(this, _StackTraceLinkButton_onShowAllClick, data.onShowAllClick, "f");
        __classPrivateFieldSet(this, _StackTraceLinkButton_hiddenCallFramesCount, data.hiddenCallFramesCount, "f");
        __classPrivateFieldSet(this, _StackTraceLinkButton_expandedView, data.expandedView, "f");
        __classPrivateFieldGet(this, _StackTraceLinkButton_instances, "m", _StackTraceLinkButton_render).call(this);
    }
}
_StackTraceLinkButton_shadow = new WeakMap(), _StackTraceLinkButton_onShowAllClick = new WeakMap(), _StackTraceLinkButton_hiddenCallFramesCount = new WeakMap(), _StackTraceLinkButton_expandedView = new WeakMap(), _StackTraceLinkButton_instances = new WeakSet(), _StackTraceLinkButton_render = function _StackTraceLinkButton_render() {
    if (!__classPrivateFieldGet(this, _StackTraceLinkButton_hiddenCallFramesCount, "f")) {
        return;
    }
    const linkText = __classPrivateFieldGet(this, _StackTraceLinkButton_expandedView, "f") ? i18nString(UIStrings.showLess) :
        i18nString(UIStrings.showSMoreFrames, { n: __classPrivateFieldGet(this, _StackTraceLinkButton_hiddenCallFramesCount, "f") });
    Lit.render(html `
      <style>${stackTraceLinkButtonStyles}</style>
      <div class="stack-trace-row">
          <button class="link" @click=${() => __classPrivateFieldGet(this, _StackTraceLinkButton_onShowAllClick, "f").call(this)}>
            ${linkText}
          </button>
        </div>
    `, __classPrivateFieldGet(this, _StackTraceLinkButton_shadow, "f"), { host: this });
};
export class StackTrace extends HTMLElement {
    constructor() {
        super(...arguments);
        _StackTrace_instances.add(this);
        _StackTrace_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _StackTrace_linkifier.set(this, new Components.Linkifier.Linkifier());
        _StackTrace_stackTraceRows.set(this, []);
        _StackTrace_showHidden.set(this, false);
    }
    set data(data) {
        const frame = data.frame;
        const { creationStackTrace, creationStackTraceTarget } = frame.getCreationStackTraceData();
        if (creationStackTrace) {
            __classPrivateFieldSet(this, _StackTrace_stackTraceRows, data.buildStackTraceRows(creationStackTrace, creationStackTraceTarget, __classPrivateFieldGet(this, _StackTrace_linkifier, "f"), true, __classPrivateFieldGet(this, _StackTrace_instances, "m", _StackTrace_onStackTraceRowsUpdated).bind(this)), "f");
        }
        __classPrivateFieldGet(this, _StackTrace_instances, "m", _StackTrace_render).call(this);
    }
    createRowTemplates() {
        const expandableRows = [];
        let hiddenCallFramesCount = 0;
        for (const item of __classPrivateFieldGet(this, _StackTrace_stackTraceRows, "f")) {
            let ignoreListHide = false;
            // TODO(crbug.com/1183325): fix race condition with uiLocation still being null here
            // Note: This has always checked whether the call frame location *in the generated
            // code* is ignore-listed or not. This can change after the live location updates,
            // and is handled again in the linkifier live location update callback.
            if ('link' in item && item.link) {
                const uiLocation = Components.Linkifier.Linkifier.uiLocation(item.link);
                if (uiLocation &&
                    Bindings.IgnoreListManager.IgnoreListManager.instance().isUserOrSourceMapIgnoreListedUISourceCode(uiLocation.uiSourceCode)) {
                    ignoreListHide = true;
                }
            }
            if (__classPrivateFieldGet(this, _StackTrace_showHidden, "f") || !ignoreListHide) {
                if ('functionName' in item) {
                    expandableRows.push(html `
          <devtools-stack-trace-row data-stack-trace-row .data=${{
                        stackTraceRowItem: item,
                    }}></devtools-stack-trace-row>`);
                }
                if ('asyncDescription' in item) {
                    expandableRows.push(html `
            <div>${item.asyncDescription}</div>
          `);
                }
            }
            if ('functionName' in item && ignoreListHide) {
                hiddenCallFramesCount++;
            }
        }
        if (hiddenCallFramesCount) {
            // Disabled until https://crbug.com/1079231 is fixed.
            // clang-format off
            expandableRows.push(html `
      <devtools-stack-trace-link-button data-stack-trace-row .data=${{ onShowAllClick: __classPrivateFieldGet(this, _StackTrace_instances, "m", _StackTrace_onToggleShowAllClick).bind(this), hiddenCallFramesCount, expandedView: __classPrivateFieldGet(this, _StackTrace_showHidden, "f") }}></devtools-stack-trace-link-button>
      `);
            // clang-format on
        }
        return expandableRows;
    }
}
_StackTrace_shadow = new WeakMap(), _StackTrace_linkifier = new WeakMap(), _StackTrace_stackTraceRows = new WeakMap(), _StackTrace_showHidden = new WeakMap(), _StackTrace_instances = new WeakSet(), _StackTrace_onStackTraceRowsUpdated = function _StackTrace_onStackTraceRowsUpdated(stackTraceRows) {
    __classPrivateFieldSet(this, _StackTrace_stackTraceRows, stackTraceRows, "f");
    __classPrivateFieldGet(this, _StackTrace_instances, "m", _StackTrace_render).call(this);
}, _StackTrace_onToggleShowAllClick = function _StackTrace_onToggleShowAllClick() {
    __classPrivateFieldSet(this, _StackTrace_showHidden, !__classPrivateFieldGet(this, _StackTrace_showHidden, "f"), "f");
    __classPrivateFieldGet(this, _StackTrace_instances, "m", _StackTrace_render).call(this);
}, _StackTrace_render = function _StackTrace_render() {
    if (!__classPrivateFieldGet(this, _StackTrace_stackTraceRows, "f").length) {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        Lit.render(html `
          <span>${i18nString(UIStrings.cannotRenderStackTrace)}</span>
        `, __classPrivateFieldGet(this, _StackTrace_shadow, "f"), { host: this });
        return;
    }
    const expandableRows = this.createRowTemplates();
    Lit.render(html `
        <devtools-expandable-list .data=${{ rows: expandableRows, title: i18nString(UIStrings.creationStackTrace) }}
                                  jslog=${VisualLogging.tree()}>
        </devtools-expandable-list>
      `, __classPrivateFieldGet(this, _StackTrace_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-stack-trace-row', StackTraceRow);
customElements.define('devtools-stack-trace-link-button', StackTraceLinkButton);
customElements.define('devtools-resources-stack-trace', StackTrace);
//# sourceMappingURL=StackTrace.js.map