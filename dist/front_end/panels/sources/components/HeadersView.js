// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _HeadersView_instances, _HeadersView_headersViewComponent, _HeadersView_uiSourceCode, _HeadersView_setInitialData, _HeadersView_setComponentData, _HeadersView_onWorkingCopyChanged, _HeadersView_onWorkingCopyCommitted, _HeadersViewComponent_instances, _HeadersViewComponent_shadow, _HeadersViewComponent_headerOverrides, _HeadersViewComponent_uiSourceCode, _HeadersViewComponent_parsingError, _HeadersViewComponent_focusElement, _HeadersViewComponent_textOnFocusIn, _HeadersViewComponent_onKeyDown, _HeadersViewComponent_focusNext, _HeadersViewComponent_selectAllText, _HeadersViewComponent_onFocusIn, _HeadersViewComponent_onFocusOut, _HeadersViewComponent_onContextMenu, _HeadersViewComponent_generateNextHeaderName, _HeadersViewComponent_onClick, _HeadersViewComponent_isDeletable, _HeadersViewComponent_removeHeader, _HeadersViewComponent_onInput, _HeadersViewComponent_onChange, _HeadersViewComponent_onHeadersChanged, _HeadersViewComponent_onPaste, _HeadersViewComponent_render, _HeadersViewComponent_renderApplyToRow, _HeadersViewComponent_renderHeaderRow, _HeadersViewComponent_renderEditable;
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Persistence from '../../../models/persistence/persistence.js';
import * as TextUtils from '../../../models/text_utils/text_utils.js';
import * as Workspace from '../../../models/workspace/workspace.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import headersViewStyles from './HeadersView.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description The title of a button that adds a field to input a header in the editor form.
     */
    addHeader: 'Add a header',
    /**
     *@description The title of a button that removes a field to input a header in the editor form.
     */
    removeHeader: 'Remove this header',
    /**
     *@description The title of a button that removes a section for defining header overrides in the editor form.
     */
    removeBlock: 'Remove this \'`ApplyTo`\'-section',
    /**
     *@description Error message for files which cannot not be parsed.
     *@example {.headers} PH1
     */
    errorWhenParsing: 'Error when parsing \'\'{PH1}\'\'.',
    /**
     *@description Explainer for files which cannot be parsed.
     *@example {.headers} PH1
     */
    parsingErrorExplainer: 'This is most likely due to a syntax error in \'\'{PH1}\'\'. Try opening this file in an external editor to fix the error or delete the file and re-create the override.',
    /**
     *@description Button text for a button which adds an additional header override rule.
     */
    addOverrideRule: 'Add override rule',
    /**
     *@description Text which is a hyperlink to more documentation
     */
    learnMore: 'Learn more',
};
const str_ = i18n.i18n.registerUIStrings('panels/sources/components/HeadersView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const DEFAULT_HEADER_VALUE = 'header value';
const getDefaultHeaderName = (i) => `header-name-${i}`;
export class HeadersView extends UI.View.SimpleView {
    constructor(uiSourceCode) {
        super(i18n.i18n.lockedString('HeadersView'));
        _HeadersView_instances.add(this);
        _HeadersView_headersViewComponent.set(this, new HeadersViewComponent());
        _HeadersView_uiSourceCode.set(this, void 0);
        this.element.setAttribute('jslog', `${VisualLogging.pane('headers-view')}`);
        __classPrivateFieldSet(this, _HeadersView_uiSourceCode, uiSourceCode, "f");
        __classPrivateFieldGet(this, _HeadersView_uiSourceCode, "f").addEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged, __classPrivateFieldGet(this, _HeadersView_instances, "m", _HeadersView_onWorkingCopyChanged), this);
        __classPrivateFieldGet(this, _HeadersView_uiSourceCode, "f").addEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, __classPrivateFieldGet(this, _HeadersView_instances, "m", _HeadersView_onWorkingCopyCommitted), this);
        this.element.appendChild(__classPrivateFieldGet(this, _HeadersView_headersViewComponent, "f"));
        void __classPrivateFieldGet(this, _HeadersView_instances, "m", _HeadersView_setInitialData).call(this);
    }
    getComponent() {
        return __classPrivateFieldGet(this, _HeadersView_headersViewComponent, "f");
    }
    dispose() {
        __classPrivateFieldGet(this, _HeadersView_uiSourceCode, "f").removeEventListener(Workspace.UISourceCode.Events.WorkingCopyChanged, __classPrivateFieldGet(this, _HeadersView_instances, "m", _HeadersView_onWorkingCopyChanged), this);
        __classPrivateFieldGet(this, _HeadersView_uiSourceCode, "f").removeEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, __classPrivateFieldGet(this, _HeadersView_instances, "m", _HeadersView_onWorkingCopyCommitted), this);
    }
}
_HeadersView_headersViewComponent = new WeakMap(), _HeadersView_uiSourceCode = new WeakMap(), _HeadersView_instances = new WeakSet(), _HeadersView_setInitialData = async function _HeadersView_setInitialData() {
    const contentDataOrError = await __classPrivateFieldGet(this, _HeadersView_uiSourceCode, "f").requestContentData();
    __classPrivateFieldGet(this, _HeadersView_instances, "m", _HeadersView_setComponentData).call(this, TextUtils.ContentData.ContentData.textOr(contentDataOrError, ''));
}, _HeadersView_setComponentData = function _HeadersView_setComponentData(content) {
    let parsingError = false;
    let headerOverrides = [];
    content = content || '[]';
    try {
        headerOverrides = JSON.parse(content);
        if (!headerOverrides.every(Persistence.NetworkPersistenceManager.isHeaderOverride)) {
            throw new Error('Type mismatch after parsing');
        }
    }
    catch {
        console.error('Failed to parse', __classPrivateFieldGet(this, _HeadersView_uiSourceCode, "f").url(), 'for locally overriding headers.');
        parsingError = true;
    }
    __classPrivateFieldGet(this, _HeadersView_headersViewComponent, "f").data = {
        headerOverrides,
        uiSourceCode: __classPrivateFieldGet(this, _HeadersView_uiSourceCode, "f"),
        parsingError,
    };
}, _HeadersView_onWorkingCopyChanged = function _HeadersView_onWorkingCopyChanged() {
    __classPrivateFieldGet(this, _HeadersView_instances, "m", _HeadersView_setComponentData).call(this, __classPrivateFieldGet(this, _HeadersView_uiSourceCode, "f").workingCopy());
}, _HeadersView_onWorkingCopyCommitted = function _HeadersView_onWorkingCopyCommitted() {
    __classPrivateFieldGet(this, _HeadersView_instances, "m", _HeadersView_setComponentData).call(this, __classPrivateFieldGet(this, _HeadersView_uiSourceCode, "f").workingCopy());
};
export class HeadersViewComponent extends HTMLElement {
    constructor() {
        super();
        _HeadersViewComponent_instances.add(this);
        _HeadersViewComponent_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _HeadersViewComponent_headerOverrides.set(this, []);
        _HeadersViewComponent_uiSourceCode.set(this, null);
        _HeadersViewComponent_parsingError.set(this, false);
        _HeadersViewComponent_focusElement.set(this, null);
        _HeadersViewComponent_textOnFocusIn.set(this, '');
        __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f").addEventListener('focusin', __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onFocusIn).bind(this));
        __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f").addEventListener('focusout', __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onFocusOut).bind(this));
        __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f").addEventListener('click', __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onClick).bind(this));
        __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f").addEventListener('input', __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onInput).bind(this));
        __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f").addEventListener('keydown', __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onKeyDown).bind(this));
        __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f").addEventListener('paste', __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onPaste).bind(this));
        this.addEventListener('contextmenu', __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onContextMenu).bind(this));
    }
    set data(data) {
        __classPrivateFieldSet(this, _HeadersViewComponent_headerOverrides, data.headerOverrides, "f");
        __classPrivateFieldSet(this, _HeadersViewComponent_uiSourceCode, data.uiSourceCode, "f");
        __classPrivateFieldSet(this, _HeadersViewComponent_parsingError, data.parsingError, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_render));
    }
}
_HeadersViewComponent_shadow = new WeakMap(), _HeadersViewComponent_headerOverrides = new WeakMap(), _HeadersViewComponent_uiSourceCode = new WeakMap(), _HeadersViewComponent_parsingError = new WeakMap(), _HeadersViewComponent_focusElement = new WeakMap(), _HeadersViewComponent_textOnFocusIn = new WeakMap(), _HeadersViewComponent_instances = new WeakSet(), _HeadersViewComponent_onKeyDown = function _HeadersViewComponent_onKeyDown(event) {
    const target = event.target;
    if (!target.matches('.editable')) {
        return;
    }
    const keyboardEvent = event;
    if (target.matches('.header-name') && target.innerText === '' &&
        (keyboardEvent.key === 'Enter' || keyboardEvent.key === 'Tab')) {
        // onFocusOut will remove the header -> blur instead of focusing on next editable
        event.preventDefault();
        target.blur();
    }
    else if (keyboardEvent.key === 'Enter') {
        event.preventDefault();
        target.blur();
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_focusNext).call(this, target);
    }
    else if (keyboardEvent.key === 'Escape') {
        event.consume();
        target.innerText = __classPrivateFieldGet(this, _HeadersViewComponent_textOnFocusIn, "f");
        target.blur();
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onChange).call(this, target);
    }
}, _HeadersViewComponent_focusNext = function _HeadersViewComponent_focusNext(target) {
    const elements = Array.from(__classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f").querySelectorAll('.editable'));
    const idx = elements.indexOf(target);
    if (idx !== -1 && idx + 1 < elements.length) {
        elements[idx + 1].focus();
    }
}, _HeadersViewComponent_selectAllText = function _HeadersViewComponent_selectAllText(target) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection?.removeAllRanges();
    selection?.addRange(range);
}, _HeadersViewComponent_onFocusIn = function _HeadersViewComponent_onFocusIn(event) {
    const target = event.target;
    if (target.matches('.editable')) {
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_selectAllText).call(this, target);
        __classPrivateFieldSet(this, _HeadersViewComponent_textOnFocusIn, target.innerText, "f");
    }
}, _HeadersViewComponent_onFocusOut = function _HeadersViewComponent_onFocusOut(event) {
    const target = event.target;
    if (target.innerText === '') {
        const rowElement = target.closest('.row');
        const blockIndex = Number(rowElement.dataset.blockIndex);
        const headerIndex = Number(rowElement.dataset.headerIndex);
        if (target.matches('.apply-to')) {
            target.innerText = '*';
            __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].applyTo = '*';
            __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onHeadersChanged).call(this);
        }
        else if (target.matches('.header-name')) {
            __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_removeHeader).call(this, blockIndex, headerIndex);
        }
    }
    // clear selection
    const selection = window.getSelection();
    selection?.removeAllRanges();
    __classPrivateFieldGet(this, _HeadersViewComponent_uiSourceCode, "f")?.commitWorkingCopy();
}, _HeadersViewComponent_onContextMenu = function _HeadersViewComponent_onContextMenu(event) {
    if (!__classPrivateFieldGet(this, _HeadersViewComponent_uiSourceCode, "f")) {
        return;
    }
    const contextMenu = new UI.ContextMenu.ContextMenu(event);
    contextMenu.appendApplicableItems(__classPrivateFieldGet(this, _HeadersViewComponent_uiSourceCode, "f"));
    void contextMenu.show();
}, _HeadersViewComponent_generateNextHeaderName = function _HeadersViewComponent_generateNextHeaderName(headers) {
    const takenNames = new Set(headers.map(header => header.name));
    let idx = 1;
    while (takenNames.has(getDefaultHeaderName(idx))) {
        idx++;
    }
    return getDefaultHeaderName(idx);
}, _HeadersViewComponent_onClick = function _HeadersViewComponent_onClick(event) {
    const target = event.target;
    const rowElement = target.closest('.row');
    const blockIndex = Number(rowElement?.dataset.blockIndex || 0);
    const headerIndex = Number(rowElement?.dataset.headerIndex || 0);
    if (target.matches('.add-header')) {
        __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers.splice(headerIndex + 1, 0, { name: __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_generateNextHeaderName).call(this, __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers), value: DEFAULT_HEADER_VALUE });
        __classPrivateFieldSet(this, _HeadersViewComponent_focusElement, { blockIndex, headerIndex: headerIndex + 1 }, "f");
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onHeadersChanged).call(this);
    }
    else if (target.matches('.remove-header')) {
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_removeHeader).call(this, blockIndex, headerIndex);
    }
    else if (target.matches('.add-block')) {
        __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f").push({ applyTo: '*', headers: [{ name: getDefaultHeaderName(1), value: DEFAULT_HEADER_VALUE }] });
        __classPrivateFieldSet(this, _HeadersViewComponent_focusElement, { blockIndex: __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f").length - 1 }, "f");
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onHeadersChanged).call(this);
    }
    else if (target.matches('.remove-block')) {
        __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f").splice(blockIndex, 1);
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onHeadersChanged).call(this);
    }
}, _HeadersViewComponent_isDeletable = function _HeadersViewComponent_isDeletable(blockIndex, headerIndex) {
    const isOnlyDefaultHeader = headerIndex === 0 && __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers.length === 1 &&
        __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers[headerIndex].name === getDefaultHeaderName(1) &&
        __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers[headerIndex].value === DEFAULT_HEADER_VALUE;
    return !isOnlyDefaultHeader;
}, _HeadersViewComponent_removeHeader = function _HeadersViewComponent_removeHeader(blockIndex, headerIndex) {
    __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers.splice(headerIndex, 1);
    if (__classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers.length === 0) {
        __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers.push({ name: __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_generateNextHeaderName).call(this, __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers), value: DEFAULT_HEADER_VALUE });
    }
    __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onHeadersChanged).call(this);
}, _HeadersViewComponent_onInput = function _HeadersViewComponent_onInput(event) {
    __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onChange).call(this, event.target);
}, _HeadersViewComponent_onChange = function _HeadersViewComponent_onChange(target) {
    const rowElement = target.closest('.row');
    const blockIndex = Number(rowElement.dataset.blockIndex);
    const headerIndex = Number(rowElement.dataset.headerIndex);
    if (target.matches('.header-name')) {
        __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers[headerIndex].name = target.innerText;
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onHeadersChanged).call(this);
    }
    if (target.matches('.header-value')) {
        __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].headers[headerIndex].value = target.innerText;
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onHeadersChanged).call(this);
    }
    if (target.matches('.apply-to')) {
        __classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f")[blockIndex].applyTo = target.innerText;
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onHeadersChanged).call(this);
    }
}, _HeadersViewComponent_onHeadersChanged = function _HeadersViewComponent_onHeadersChanged() {
    __classPrivateFieldGet(this, _HeadersViewComponent_uiSourceCode, "f")?.setWorkingCopy(JSON.stringify(__classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f"), null, 2));
    Host.userMetrics.actionTaken(Host.UserMetrics.Action.HeaderOverrideHeadersFileEdited);
}, _HeadersViewComponent_onPaste = function _HeadersViewComponent_onPaste(event) {
    const clipboardEvent = event;
    event.preventDefault();
    if (clipboardEvent.clipboardData) {
        const text = clipboardEvent.clipboardData.getData('text/plain');
        const range = __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f").getSelection()?.getRangeAt(0);
        if (!range) {
            return;
        }
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.selectNodeContents(textNode);
        range.collapse(false);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        __classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_onChange).call(this, event.target);
    }
}, _HeadersViewComponent_render = function _HeadersViewComponent_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('HeadersView render was not scheduled');
    }
    if (__classPrivateFieldGet(this, _HeadersViewComponent_parsingError, "f")) {
        const fileName = __classPrivateFieldGet(this, _HeadersViewComponent_uiSourceCode, "f")?.name() || '.headers';
        // clang-format off
        Lit.render(html `
        <style>${headersViewStyles}</style>
        <div class="center-wrapper">
          <div class="centered">
            <div class="error-header">${i18nString(UIStrings.errorWhenParsing, { PH1: fileName })}</div>
            <div class="error-body">${i18nString(UIStrings.parsingErrorExplainer, { PH1: fileName })}</div>
          </div>
        </div>
      `, __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f"), { host: this });
        // clang-format on
        return;
    }
    // clang-format off
    Lit.render(html `
      <style>${headersViewStyles}</style>
      ${__classPrivateFieldGet(this, _HeadersViewComponent_headerOverrides, "f").map((headerOverride, blockIndex) => html `
          ${__classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_renderApplyToRow).call(this, headerOverride.applyTo, blockIndex)}
          ${headerOverride.headers.map((header, headerIndex) => html `
              ${__classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_renderHeaderRow).call(this, header, blockIndex, headerIndex)}
            `)}
        `)}
      <devtools-button
          .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}
          .jslogContext=${'headers-view.add-override-rule'}
          class="add-block">
        ${i18nString(UIStrings.addOverrideRule)}
      </devtools-button>
      <div class="learn-more-row">
        <x-link
            href="https://goo.gle/devtools-override"
            class="link"
            jslog=${VisualLogging.link('learn-more').track({ click: true })}>${i18nString(UIStrings.learnMore)}</x-link>
      </div>
    `, __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f"), { host: this });
    // clang-format on
    if (__classPrivateFieldGet(this, _HeadersViewComponent_focusElement, "f")) {
        let focusElement = null;
        if (__classPrivateFieldGet(this, _HeadersViewComponent_focusElement, "f").headerIndex) {
            focusElement = __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f").querySelector(`[data-block-index="${__classPrivateFieldGet(this, _HeadersViewComponent_focusElement, "f").blockIndex}"][data-header-index="${__classPrivateFieldGet(this, _HeadersViewComponent_focusElement, "f").headerIndex}"] .header-name`);
        }
        else {
            focusElement = __classPrivateFieldGet(this, _HeadersViewComponent_shadow, "f").querySelector(`[data-block-index="${__classPrivateFieldGet(this, _HeadersViewComponent_focusElement, "f").blockIndex}"] .apply-to`);
        }
        if (focusElement) {
            focusElement.focus();
        }
        __classPrivateFieldSet(this, _HeadersViewComponent_focusElement, null, "f");
    }
}, _HeadersViewComponent_renderApplyToRow = function _HeadersViewComponent_renderApplyToRow(pattern, blockIndex) {
    // clang-format off
    return html `
      <div class="row" data-block-index=${blockIndex}
           jslog=${VisualLogging.treeItem(pattern === '*' ? pattern : undefined)}>
        <div>${i18n.i18n.lockedString('Apply to')}</div>
        <div class="separator">:</div>
        ${__classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_renderEditable).call(this, pattern, 'apply-to')}
        <devtools-button
        title=${i18nString(UIStrings.removeBlock)}
        .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
        .iconName=${'bin'}
        .iconWidth=${'14px'}
        .iconHeight=${'14px'}
        .variant=${"icon" /* Buttons.Button.Variant.ICON */}
        .jslogContext=${'headers-view.remove-apply-to-section'}
        class="remove-block inline-button"
      ></devtools-button>
      </div>
    `;
    // clang-format on
}, _HeadersViewComponent_renderHeaderRow = function _HeadersViewComponent_renderHeaderRow(header, blockIndex, headerIndex) {
    // clang-format off
    return html `
      <div class="row padded" data-block-index=${blockIndex} data-header-index=${headerIndex}
           jslog=${VisualLogging.treeItem(header.name).parent('headers-editor-row-parent')}>
        ${__classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_renderEditable).call(this, header.name, 'header-name red', true)}
        <div class="separator">:</div>
        ${__classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_renderEditable).call(this, header.value, 'header-value')}
        <devtools-button
          title=${i18nString(UIStrings.addHeader)}
          .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
          .iconName=${'plus'}
          .variant=${"icon" /* Buttons.Button.Variant.ICON */}
          .jslogContext=${'headers-view.add-header'}
          class="add-header inline-button"
        ></devtools-button>
        <devtools-button
          title=${i18nString(UIStrings.removeHeader)}
          .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
          .iconName=${'bin'}
          .variant=${"icon" /* Buttons.Button.Variant.ICON */}
          ?hidden=${!__classPrivateFieldGet(this, _HeadersViewComponent_instances, "m", _HeadersViewComponent_isDeletable).call(this, blockIndex, headerIndex)}
          .jslogContext=${'headers-view.remove-header'}
          class="remove-header inline-button"
        ></devtools-button>
      </div>
    `;
    // clang-format on
}, _HeadersViewComponent_renderEditable = function _HeadersViewComponent_renderEditable(value, className, isKey) {
    // This uses Lit's `live`-directive, so that when checking whether to
    // update during re-render, `value` is compared against the actual live DOM
    // value of the contenteditable element and not the potentially outdated
    // value from the previous render.
    // clang-format off
    const jslog = isKey ? VisualLogging.key() : VisualLogging.value();
    return html `<span jslog=${jslog.track({ change: true, keydown: 'Enter|Escape|Tab', click: true })}
                              contenteditable="true"
                              class="editable ${className}"
                              tabindex="0"
                              .innerText=${Lit.Directives.live(value)}></span>`;
    // clang-format on
};
VisualLogging.registerParentProvider('headers-editor-row-parent', (e) => {
    while (e.previousElementSibling?.classList?.contains('padded')) {
        e = e.previousElementSibling;
    }
    return e.previousElementSibling || undefined;
});
customElements.define('devtools-sources-headers-view', HeadersViewComponent);
//# sourceMappingURL=HeadersView.js.map