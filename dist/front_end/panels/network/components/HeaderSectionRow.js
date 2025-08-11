// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _HeaderSectionRow_instances, _HeaderSectionRow_shadow, _HeaderSectionRow_header, _HeaderSectionRow_isHeaderValueEdited, _HeaderSectionRow_isValidHeaderName, _HeaderSectionRow_render, _HeaderSectionRow_renderHeaderValue, _HeaderSectionRow_renderXClientDataHeader, _HeaderSectionRow_maybeRenderHeaderValueSuffix, _HeaderSectionRow_maybeRenderBlockedDetails, _HeaderSectionRow_maybeRenderBlockedDetailsLink, _HeaderSectionRow_onHeaderValueFocusOut, _HeaderSectionRow_onHeaderNameFocusOut, _HeaderSectionRow_onRemoveOverrideClick, _HeaderSectionRow_onKeyDown, _HeaderSectionRow_onHeaderNameEdit, _HeaderSectionRow_onHeaderValueEdit, _HeaderSectionRow_onHeaderNamePaste;
import '../../../ui/legacy/legacy.js';
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as ClientVariations from '../../../third_party/chromium/client-variations/client-variations.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import headerSectionRowStyles from './HeaderSectionRow.css.js';
const { render, html } = Lit;
const UIStrings = {
    /**
     *@description Comment used in decoded X-Client-Data HTTP header output in Headers View of the Network panel
     */
    activeClientExperimentVariation: 'Active `client experiment variation IDs`.',
    /**
     *@description Comment used in decoded X-Client-Data HTTP header output in Headers View of the Network panel
     */
    activeClientExperimentVariationIds: 'Active `client experiment variation IDs` that trigger server-side behavior.',
    /**
     *@description Text in Headers View of the Network panel for X-Client-Data HTTP headers
     */
    decoded: 'Decoded:',
    /**
     *@description The title of a button to enable overriding a HTTP header.
     */
    editHeader: 'Override header',
    /**
     *@description Description of which letters the name of an HTTP header may contain (a-z, A-Z, 0-9, '-', or '_').
     */
    headerNamesOnlyLetters: 'Header names should contain only letters, digits, hyphens or underscores',
    /**
     *@description Text that is usually a hyperlink to more documentation
     */
    learnMore: 'Learn more',
    /**
     *@description Text for a link to the issues panel
     */
    learnMoreInTheIssuesTab: 'Learn more in the issues tab',
    /**
     *@description Hover text prompting the user to reload the whole page or refresh the particular request, so that the changes they made take effect.
     */
    reloadPrompt: 'Refresh the page/request for these changes to take effect',
    /**
     *@description The title of a button which removes a HTTP header override.
     */
    removeOverride: 'Remove this header override',
};
const str_ = i18n.i18n.registerUIStrings('panels/network/components/HeaderSectionRow.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export const isValidHeaderName = (headerName) => {
    return /^[a-z0-9_\-]+$/i.test(headerName);
};
export const compareHeaders = (first, second) => {
    // Replaces all whitespace characters with regular spaces.
    // When working with contenteditables, their content can contain (non-obvious)
    // non-breaking spaces (NBSPs). It would be tricky to get rid of NBSPs during
    // editing and saving, so we just handle them after reading them in.
    // Tab characters are invalid in headers (and DevTools shows a warning for
    // them), the replacement here ensures that headers containing tabs are not
    // incorrectly marked as being overridden.
    return first?.replaceAll(/\s/g, ' ') === second?.replaceAll(/\s/g, ' ');
};
export class HeaderEditedEvent extends Event {
    constructor(headerName, headerValue) {
        super(HeaderEditedEvent.eventName, {});
        this.headerName = headerName;
        this.headerValue = headerValue;
    }
}
HeaderEditedEvent.eventName = 'headeredited';
export class HeaderRemovedEvent extends Event {
    constructor(headerName, headerValue) {
        super(HeaderRemovedEvent.eventName, {});
        this.headerName = headerName;
        this.headerValue = headerValue;
    }
}
HeaderRemovedEvent.eventName = 'headerremoved';
export class EnableHeaderEditingEvent extends Event {
    constructor() {
        super(EnableHeaderEditingEvent.eventName, {});
    }
}
EnableHeaderEditingEvent.eventName = 'enableheaderediting';
export class HeaderSectionRow extends HTMLElement {
    constructor() {
        super(...arguments);
        _HeaderSectionRow_instances.add(this);
        _HeaderSectionRow_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _HeaderSectionRow_header.set(this, null);
        _HeaderSectionRow_isHeaderValueEdited.set(this, false);
        _HeaderSectionRow_isValidHeaderName.set(this, true);
    }
    set data(data) {
        __classPrivateFieldSet(this, _HeaderSectionRow_header, data.header, "f");
        __classPrivateFieldSet(this, _HeaderSectionRow_isHeaderValueEdited, __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").originalValue !== undefined && __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").value !== __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").originalValue, "f");
        __classPrivateFieldSet(this, _HeaderSectionRow_isValidHeaderName, isValidHeaderName(__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name), "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_render));
    }
    focus() {
        requestAnimationFrame(() => {
            const editableName = __classPrivateFieldGet(this, _HeaderSectionRow_shadow, "f").querySelector('.header-name devtools-editable-span');
            editableName?.focus();
        });
    }
}
_HeaderSectionRow_shadow = new WeakMap(), _HeaderSectionRow_header = new WeakMap(), _HeaderSectionRow_isHeaderValueEdited = new WeakMap(), _HeaderSectionRow_isValidHeaderName = new WeakMap(), _HeaderSectionRow_instances = new WeakSet(), _HeaderSectionRow_render = function _HeaderSectionRow_render() {
    if (!ComponentHelpers.ScheduledRender.isScheduledRender(this)) {
        throw new Error('HeaderSectionRow render was not scheduled');
    }
    if (!__classPrivateFieldGet(this, _HeaderSectionRow_header, "f")) {
        return;
    }
    const rowClasses = Lit.Directives.classMap({
        row: true,
        'header-highlight': Boolean(__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").highlight),
        'header-overridden': Boolean(__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").isOverride) || __classPrivateFieldGet(this, _HeaderSectionRow_isHeaderValueEdited, "f"),
        'header-editable': __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").valueEditable === 1 /* EditingAllowedStatus.ENABLED */,
        'header-deleted': Boolean(__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").isDeleted),
    });
    const headerNameClasses = Lit.Directives.classMap({
        'header-name': true,
        'pseudo-header': __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name.startsWith(':'),
    });
    const headerValueClasses = Lit.Directives.classMap({
        'header-value': true,
        'header-warning': Boolean(__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").headerValueIncorrect),
        'flex-columns': __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name === 'x-client-data' && !__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").isResponseHeader,
    });
    // The header name is only editable when the header value is editable as well.
    // This ensures the header name's editability reacts correctly to enabling or
    // disabling local overrides.
    const isHeaderNameEditable = __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").nameEditable && __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").valueEditable === 1 /* EditingAllowedStatus.ENABLED */;
    // Case 1: Headers which were just now added via the 'Add header button'.
    //         'nameEditable' is true only for such headers.
    // Case 2: Headers for which the user clicked the 'remove' button.
    // Case 3: Headers for which there is a mismatch between original header
    //         value and current header value.
    const showReloadInfoIcon = __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").nameEditable || __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").isDeleted || __classPrivateFieldGet(this, _HeaderSectionRow_isHeaderValueEdited, "f");
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${headerSectionRowStyles}</style>
      <div class=${rowClasses}>
        <div class=${headerNameClasses}>
          ${__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").headerNotSet ?
        html `<div class="header-badge header-badge-text">${i18n.i18n.lockedString('not-set')}</div> ` :
        Lit.nothing}
          ${isHeaderNameEditable && !__classPrivateFieldGet(this, _HeaderSectionRow_isValidHeaderName, "f") ?
        html `<devtools-icon class="inline-icon disallowed-characters" title=${UIStrings.headerNamesOnlyLetters} .data=${{
            iconName: 'cross-circle-filled',
            width: '16px',
            height: '16px',
            color: 'var(--icon-error)',
        }}>
            </devtools-icon>` : Lit.nothing}
          ${isHeaderNameEditable && !__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").isDeleted ?
        html `<devtools-editable-span
              @focusout=${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onHeaderNameFocusOut)}
              @keydown=${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onKeyDown)}
              @input=${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onHeaderNameEdit)}
              @paste=${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onHeaderNamePaste)}
              .data=${{ value: __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name }}
            ></devtools-editable-span>` :
        __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name}
        </div>
        <div
          class=${headerValueClasses}
          @copy=${() => Host.userMetrics.actionTaken(Host.UserMetrics.Action.NetworkPanelCopyValue)}
        >
          ${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_renderHeaderValue).call(this)}
        </div>
        ${showReloadInfoIcon ?
        html `<devtools-icon class="row-flex-icon flex-right" title=${UIStrings.reloadPrompt} .data=${{
            iconName: 'info',
            width: '16px',
            height: '16px',
            color: 'var(--icon-default)',
        }}>
          </devtools-icon>` : Lit.nothing}
      </div>
      ${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_maybeRenderBlockedDetails).call(this, __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").blockedDetails)}
    `, __classPrivateFieldGet(this, _HeaderSectionRow_shadow, "f"), { host: this });
    // clang-format on
    if (__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").highlight) {
        this.scrollIntoView({ behavior: 'auto' });
    }
}, _HeaderSectionRow_renderHeaderValue = function _HeaderSectionRow_renderHeaderValue() {
    if (!__classPrivateFieldGet(this, _HeaderSectionRow_header, "f")) {
        return Lit.nothing;
    }
    if (__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name === 'x-client-data' && !__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").isResponseHeader) {
        return __classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_renderXClientDataHeader).call(this, __classPrivateFieldGet(this, _HeaderSectionRow_header, "f"));
    }
    if (__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").isDeleted || __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").valueEditable !== 1 /* EditingAllowedStatus.ENABLED */) {
        const showEditHeaderButton = __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").isResponseHeader && !__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").isDeleted &&
            __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").valueEditable !== 2 /* EditingAllowedStatus.FORBIDDEN */;
        // clang-format off
        return html `
      ${__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").value || ''}
      ${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_maybeRenderHeaderValueSuffix).call(this, __classPrivateFieldGet(this, _HeaderSectionRow_header, "f"))}
      ${showEditHeaderButton ? html `
        <devtools-button
          title=${i18nString(UIStrings.editHeader)}
          .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
          .iconName=${'edit'}
          .variant=${"icon" /* Buttons.Button.Variant.ICON */}
          @click=${() => {
            this.dispatchEvent(new EnableHeaderEditingEvent());
        }}
          jslog=${VisualLogging.action('enable-header-overrides').track({ click: true })}
          class="enable-editing inline-button"
        ></devtools-button>
      ` : Lit.nothing}
    `;
    }
    return html `
      <devtools-editable-span
        @focusout=${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onHeaderValueFocusOut)}
        @input=${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onHeaderValueEdit)}
        @paste=${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onHeaderValueEdit)}
        @keydown=${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onKeyDown)}
        .data=${{ value: __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").value || '' }}
      ></devtools-editable-span>
      ${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_maybeRenderHeaderValueSuffix).call(this, __classPrivateFieldGet(this, _HeaderSectionRow_header, "f"))}
      <devtools-button
        title=${i18nString(UIStrings.removeOverride)}
        .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
        .iconName=${'bin'}
        .variant=${"icon" /* Buttons.Button.Variant.ICON */}
        class="remove-header inline-button"
        @click=${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onRemoveOverrideClick)}
        jslog=${VisualLogging.action('remove-header-override').track({ click: true })}
      ></devtools-button>
    `;
    // clang-format on
}, _HeaderSectionRow_renderXClientDataHeader = function _HeaderSectionRow_renderXClientDataHeader(header) {
    const data = ClientVariations.parseClientVariations(header.value || '');
    const output = ClientVariations.formatClientVariations(data, i18nString(UIStrings.activeClientExperimentVariation), i18nString(UIStrings.activeClientExperimentVariationIds));
    // clang-format off
    return html `
      <div>${header.value || ''}</div>
      <div>${i18nString(UIStrings.decoded)}</div>
      <code>${output}</code>
    `;
    // clang-format on
}, _HeaderSectionRow_maybeRenderHeaderValueSuffix = function _HeaderSectionRow_maybeRenderHeaderValueSuffix(header) {
    if (header.name === 'set-cookie' && header.setCookieBlockedReasons) {
        const titleText = header.setCookieBlockedReasons.map(SDK.NetworkRequest.setCookieBlockedReasonToUiString).join('\n');
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
        <devtools-icon class="row-flex-icon" title=${titleText} .data=${{
            iconName: 'warning-filled',
            color: 'var(--icon-warning)',
            width: '16px',
            height: '16px',
        }}>
        </devtools-icon>
      `;
        // clang-format on
    }
    return Lit.nothing;
}, _HeaderSectionRow_maybeRenderBlockedDetails = function _HeaderSectionRow_maybeRenderBlockedDetails(blockedDetails) {
    if (!blockedDetails) {
        return Lit.nothing;
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <div class="call-to-action">
        <div class="call-to-action-body">
          <div class="explanation">${blockedDetails.explanation()}</div>
          ${blockedDetails.examples.map(example => html `
            <div class="example">
              <code>${example.codeSnippet}</code> ${example.comment ? html `<span class="comment"> ${example.comment()}</span>` : ''}
           </div>`)} ${__classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_maybeRenderBlockedDetailsLink).call(this, blockedDetails)}
        </div>
      </div>
    `;
    // clang-format on
}, _HeaderSectionRow_maybeRenderBlockedDetailsLink = function _HeaderSectionRow_maybeRenderBlockedDetailsLink(blockedDetails) {
    if (blockedDetails?.reveal) {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
        <div class="devtools-link" @click=${blockedDetails.reveal}>
          <devtools-icon class="inline-icon" .data=${{
            iconName: 'issue-exclamation-filled',
            color: 'var(--icon-warning)',
            width: '16px',
            height: '16px',
        }}>
          </devtools-icon
          >${i18nString(UIStrings.learnMoreInTheIssuesTab)}
        </div>
      `;
        // clang-format on
    }
    if (blockedDetails?.link) {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
        <x-link href=${blockedDetails.link.url} class="link">
          <devtools-icon class="inline-icon" .data=${{
            iconName: 'open-externally',
            color: 'var(--icon-link)',
            width: '20px',
            height: '20px',
        }}>
          </devtools-icon
          >${i18nString(UIStrings.learnMore)}
        </x-link>
      `;
        // clang-format on
    }
    return Lit.nothing;
}, _HeaderSectionRow_onHeaderValueFocusOut = function _HeaderSectionRow_onHeaderValueFocusOut(event) {
    const target = event.target;
    if (!__classPrivateFieldGet(this, _HeaderSectionRow_header, "f")) {
        return;
    }
    const headerValue = target.value.trim();
    if (!compareHeaders(headerValue, __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").value?.trim())) {
        __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").value = headerValue;
        this.dispatchEvent(new HeaderEditedEvent(__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name, headerValue));
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_render));
    }
    // Clear selection (needed when pressing 'enter' in editable span).
    const selection = window.getSelection();
    selection?.removeAllRanges();
    // Reset pasted header name
    __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").originalName = '';
}, _HeaderSectionRow_onHeaderNameFocusOut = function _HeaderSectionRow_onHeaderNameFocusOut(event) {
    const target = event.target;
    if (!__classPrivateFieldGet(this, _HeaderSectionRow_header, "f")) {
        return;
    }
    const headerName = Platform.StringUtilities.toLowerCaseString(target.value.trim());
    // If the header name has been edited to '', reset it to its previous value.
    if (headerName === '') {
        target.value = __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name;
    }
    else if (!compareHeaders(headerName, __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name.trim())) {
        __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name = headerName;
        this.dispatchEvent(new HeaderEditedEvent(headerName, __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").value || ''));
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_render));
    }
    // Clear selection (needed when pressing 'enter' in editable span).
    const selection = window.getSelection();
    selection?.removeAllRanges();
}, _HeaderSectionRow_onRemoveOverrideClick = function _HeaderSectionRow_onRemoveOverrideClick() {
    if (!__classPrivateFieldGet(this, _HeaderSectionRow_header, "f")) {
        return;
    }
    const headerValueElement = __classPrivateFieldGet(this, _HeaderSectionRow_shadow, "f").querySelector('.header-value devtools-editable-span');
    if (__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").originalValue) {
        headerValueElement.value = __classPrivateFieldGet(this, _HeaderSectionRow_header, "f")?.originalValue;
    }
    this.dispatchEvent(new HeaderRemovedEvent(__classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name, __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").value || ''));
}, _HeaderSectionRow_onKeyDown = function _HeaderSectionRow_onKeyDown(event) {
    const keyboardEvent = event;
    const target = event.target;
    if (keyboardEvent.key === 'Escape') {
        event.consume();
        if (target.matches('.header-name devtools-editable-span')) {
            target.value = __classPrivateFieldGet(this, _HeaderSectionRow_header, "f")?.name || '';
            __classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onHeaderNameEdit).call(this, event);
        }
        else if (target.matches('.header-value devtools-editable-span')) {
            target.value = __classPrivateFieldGet(this, _HeaderSectionRow_header, "f")?.value || '';
            __classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_onHeaderValueEdit).call(this, event);
            if (__classPrivateFieldGet(this, _HeaderSectionRow_header, "f")?.originalName) {
                const headerNameElement = __classPrivateFieldGet(this, _HeaderSectionRow_shadow, "f").querySelector('.header-name devtools-editable-span');
                headerNameElement.value = __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").originalName;
                __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").originalName = '';
                headerNameElement.dispatchEvent(new Event('input'));
                headerNameElement.focus();
                return;
            }
        }
        target.blur();
    }
}, _HeaderSectionRow_onHeaderNameEdit = function _HeaderSectionRow_onHeaderNameEdit(event) {
    const editable = event.target;
    const isValidName = isValidHeaderName(editable.value);
    if (__classPrivateFieldGet(this, _HeaderSectionRow_isValidHeaderName, "f") !== isValidName) {
        __classPrivateFieldSet(this, _HeaderSectionRow_isValidHeaderName, isValidName, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_render));
    }
}, _HeaderSectionRow_onHeaderValueEdit = function _HeaderSectionRow_onHeaderValueEdit(event) {
    const editable = event.target;
    const isEdited = __classPrivateFieldGet(this, _HeaderSectionRow_header, "f")?.originalValue !== undefined && !compareHeaders(__classPrivateFieldGet(this, _HeaderSectionRow_header, "f")?.originalValue || '', editable.value);
    if (__classPrivateFieldGet(this, _HeaderSectionRow_isHeaderValueEdited, "f") !== isEdited) {
        __classPrivateFieldSet(this, _HeaderSectionRow_isHeaderValueEdited, isEdited, "f");
        if (__classPrivateFieldGet(this, _HeaderSectionRow_header, "f")) {
            __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").highlight = false;
        }
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _HeaderSectionRow_instances, "m", _HeaderSectionRow_render));
    }
}, _HeaderSectionRow_onHeaderNamePaste = function _HeaderSectionRow_onHeaderNamePaste(event) {
    if (!event.clipboardData) {
        return;
    }
    const nameEl = event.target;
    const clipboardText = event.clipboardData.getData('text/plain') || '';
    const separatorPosition = clipboardText.indexOf(':');
    if (separatorPosition < 1) {
        // Not processing further either case 'abc' or ':abc'
        nameEl.value = clipboardText;
        event.preventDefault();
        nameEl.dispatchEvent(new Event('input', { bubbles: true }));
        return;
    }
    if (__classPrivateFieldGet(this, _HeaderSectionRow_header, "f")) {
        __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").originalName = __classPrivateFieldGet(this, _HeaderSectionRow_header, "f").name;
    }
    const headerValue = clipboardText.substring(separatorPosition + 1, clipboardText.length).trim();
    const headerName = clipboardText.substring(0, separatorPosition);
    nameEl.value = headerName;
    nameEl.dispatchEvent(new Event('input'));
    const valueEL = __classPrivateFieldGet(this, _HeaderSectionRow_shadow, "f").querySelector('.header-value devtools-editable-span');
    if (valueEL) {
        valueEL.focus();
        valueEL.value = headerValue;
        valueEL.dispatchEvent(new Event('input'));
    }
    event.preventDefault();
};
customElements.define('devtools-header-section-row', HeaderSectionRow);
export var EditingAllowedStatus;
(function (EditingAllowedStatus) {
    EditingAllowedStatus[EditingAllowedStatus["DISABLED"] = 0] = "DISABLED";
    EditingAllowedStatus[EditingAllowedStatus["ENABLED"] = 1] = "ENABLED";
    EditingAllowedStatus[EditingAllowedStatus["FORBIDDEN"] = 2] = "FORBIDDEN";
})(EditingAllowedStatus || (EditingAllowedStatus = {}));
//# sourceMappingURL=HeaderSectionRow.js.map