// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _DeveloperResourcesListView_instances, _DeveloperResourcesListView_items, _DeveloperResourcesListView_selectedItem, _DeveloperResourcesListView_onSelect, _DeveloperResourcesListView_view, _DeveloperResourcesListView_filters, _DeveloperResourcesListView_populateContextMenu, _DeveloperResourcesListView_highlight;
import '../../ui/legacy/components/data_grid/data_grid.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as UI from '../../ui/legacy/legacy.js';
import { Directives, html, nothing, render } from '../../ui/lit/lit.js';
import developerResourcesListViewStyles from './developerResourcesListView.css.js';
const { ref } = Directives;
const UIStrings = {
    /**
     *@description Text for the status of something
     */
    status: 'Status',
    /**
     *@description Text for web URLs
     */
    url: 'URL',
    /**
     *@description Text for the initiator of something
     */
    initiator: 'Initiator',
    /**
     *@description Text in Coverage List View of the Coverage tab
     */
    totalBytes: 'Total Bytes',
    /**
     * @description Column header. The column contains the time it took to load a resource.
     */
    duration: 'Duration',
    /**
     *@description Text for errors
     */
    error: 'Error',
    /**
     *@description Title for the Developer resources tab
     */
    developerResources: 'Developer resources',
    /**
     *@description Text for a context menu entry
     */
    copyUrl: 'Copy URL',
    /**
     * @description Text for a context menu entry. Command to copy a URL to the clipboard. The initiator
     * of a request is the entity that caused this request to be sent.
     */
    copyInitiatorUrl: 'Copy initiator URL',
    /**
     *@description Text for the status column of a list view
     */
    pending: 'pending',
    /**
     *@description Text for the status column of a list view
     */
    success: 'success',
    /**
     *@description Text for the status column of a list view
     */
    failure: 'failure',
    /**
     *@description Accessible text for the value in bytes in memory allocation.
     */
    sBytes: '{n, plural, =1 {# byte} other {# bytes}}',
    /**
     * @description Number of resource(s) match
     */
    numberOfResourceMatch: '{n, plural, =1 {# resource matches} other {# resources match}}',
    /**
     * @description No resource matches
     */
    noResourceMatches: 'No resource matches',
};
const str_ = i18n.i18n.registerUIStrings('panels/developer_resources/DeveloperResourcesListView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { withThousandsSeparator } = Platform.NumberUtilities;
const DEFAULT_VIEW = (input, _output, target) => {
    // clang-format off
    render(html `
      <style>${developerResourcesListViewStyles}</style>
      <devtools-data-grid name=${i18nString(UIStrings.developerResources)} striped class="flex-auto"
         .filters=${input.filters} @contextmenu=${input.onContextMenu} @selected=${input.onSelect}>
        <table>
          <tr>
            <th id="status" sortable fixed width="60px">
              ${i18nString(UIStrings.status)}
            </th>
            <th id="url" sortable width="250px">
              ${i18nString(UIStrings.url)}
            </th>
            <th id="initiator" sortable width="80px">
              ${i18nString(UIStrings.initiator)}
            </th>
            <th id="size" sortable fixed width="80px" align="right">
              ${i18nString(UIStrings.totalBytes)}
            </th>
            <th id="duration" sortable fixed width="80px" align="right">
              ${i18nString(UIStrings.duration)}
            </th>
            <th id="error-message" sortable width="200px">
              ${i18nString(UIStrings.error)}
            </th>
          </tr>
          ${input.items.map((item, index) => {
        const splitURL = /^(.*)(\/[^/]*)$/.exec(item.url);
        return html `
            <tr selected=${(item === input.selectedItem) || nothing}
                data-url=${item.url ?? nothing}
                data-initiator-url=${item.initiator.initiatorUrl ?? nothing}
                data-index=${index}>
              <td>${item.success === true ? i18nString(UIStrings.success) :
            item.success === false ? i18nString(UIStrings.failure) :
                i18nString(UIStrings.pending)}</td>
              <td title=${item.url} aria-label=${item.url}>
                <div aria-hidden="true" part="url-outer"
                     ${ref(e => input.highlight(e, item.url, 'url'))}>
                  <div part="url-prefix">${splitURL ? splitURL[1] : item.url}</div>
                  <div part="url-suffix">${splitURL ? splitURL[2] : ''}</div>
                </div>
              </td>
              <td title=${item.initiator.initiatorUrl || ''}
                  aria-label=${item.initiator.initiatorUrl || ''}
                  @mouseenter=${() => input.onInitiatorMouseEnter(item.initiator.frameId)}
                  @mouseleave=${input.onInitiatorMouseLeave}
              >${item.initiator.initiatorUrl || ''}</td>
              <td aria-label=${item.size !== null ? i18nString(UIStrings.sBytes, { n: item.size }) : nothing}
                  data-value=${item.size ?? nothing}>${item.size !== null ? html `<span>${withThousandsSeparator(item.size)}</span>` : ''}</td>
              <td aria-label=${item.duration !== null ? i18n.TimeUtilities.millisToString(item.duration) : nothing}
                  data-value=${item.duration ?? nothing}>${item.duration !== null ? html `<span>${i18n.TimeUtilities.millisToString(item.duration)}</span>` : ''}</td>
              <td class="error-message">
                ${item.errorMessage ? html `
                <span ${ref(e => input.highlight(e, item.errorMessage, 'error-message'))}>
                  ${item.errorMessage}
                </span>` : nothing}
              </td>
            </tr>`;
    })}
          </table>
        </devtools-data-grid>`, target, { host: input });
    // clang-format on
};
export class DeveloperResourcesListView extends UI.Widget.VBox {
    constructor(element, view = DEFAULT_VIEW) {
        super(true, undefined, element);
        _DeveloperResourcesListView_instances.add(this);
        _DeveloperResourcesListView_items.set(this, []);
        _DeveloperResourcesListView_selectedItem.set(this, null);
        _DeveloperResourcesListView_onSelect.set(this, null);
        _DeveloperResourcesListView_view.set(this, void 0);
        _DeveloperResourcesListView_filters.set(this, []);
        __classPrivateFieldSet(this, _DeveloperResourcesListView_view, view, "f");
    }
    set selectedItem(item) {
        __classPrivateFieldSet(this, _DeveloperResourcesListView_selectedItem, item, "f");
        this.requestUpdate();
    }
    set onSelect(onSelect) {
        __classPrivateFieldSet(this, _DeveloperResourcesListView_onSelect, onSelect, "f");
    }
    set items(items) {
        __classPrivateFieldSet(this, _DeveloperResourcesListView_items, [...items], "f");
        this.requestUpdate();
    }
    reset() {
        this.items = [];
        this.requestUpdate();
    }
    set filters(filters) {
        __classPrivateFieldSet(this, _DeveloperResourcesListView_filters, filters, "f");
        this.requestUpdate();
        void this.updateComplete.then(() => {
            const numberOfResourceMatch = Number(this.contentElement.querySelector('devtools-data-grid')?.getAttribute('aria-rowcount')) ?? 0;
            let resourceMatch = '';
            if (numberOfResourceMatch === 0) {
                resourceMatch = i18nString(UIStrings.noResourceMatches);
            }
            else {
                resourceMatch = i18nString(UIStrings.numberOfResourceMatch, { n: numberOfResourceMatch });
            }
            UI.ARIAUtils.LiveAnnouncer.alert(resourceMatch);
        });
    }
    performUpdate() {
        const input = {
            items: __classPrivateFieldGet(this, _DeveloperResourcesListView_items, "f"),
            selectedItem: __classPrivateFieldGet(this, _DeveloperResourcesListView_selectedItem, "f"),
            filters: __classPrivateFieldGet(this, _DeveloperResourcesListView_filters, "f"),
            highlight: __classPrivateFieldGet(this, _DeveloperResourcesListView_instances, "m", _DeveloperResourcesListView_highlight).bind(this),
            onContextMenu: (e) => {
                if (e.detail?.element) {
                    __classPrivateFieldGet(this, _DeveloperResourcesListView_instances, "m", _DeveloperResourcesListView_populateContextMenu).call(this, e.detail.menu, e.detail.element);
                }
            },
            onSelect: (e) => {
                __classPrivateFieldSet(this, _DeveloperResourcesListView_selectedItem, e.detail ? __classPrivateFieldGet(this, _DeveloperResourcesListView_items, "f")[Number(e.detail.dataset.index)] : null, "f");
                __classPrivateFieldGet(this, _DeveloperResourcesListView_onSelect, "f")?.call(this, __classPrivateFieldGet(this, _DeveloperResourcesListView_selectedItem, "f"));
            },
            onInitiatorMouseEnter: (frameId) => {
                const frame = frameId ? SDK.FrameManager.FrameManager.instance().getFrame(frameId) : null;
                if (frame) {
                    void frame.highlight();
                }
            },
            onInitiatorMouseLeave: () => {
                SDK.OverlayModel.OverlayModel.hideDOMNodeHighlight();
            },
        };
        const output = {};
        __classPrivateFieldGet(this, _DeveloperResourcesListView_view, "f").call(this, input, output, this.contentElement);
    }
}
_DeveloperResourcesListView_items = new WeakMap(), _DeveloperResourcesListView_selectedItem = new WeakMap(), _DeveloperResourcesListView_onSelect = new WeakMap(), _DeveloperResourcesListView_view = new WeakMap(), _DeveloperResourcesListView_filters = new WeakMap(), _DeveloperResourcesListView_instances = new WeakSet(), _DeveloperResourcesListView_populateContextMenu = function _DeveloperResourcesListView_populateContextMenu(contextMenu, element) {
    const url = element.dataset.url;
    if (url) {
        contextMenu.clipboardSection().appendItem(i18nString(UIStrings.copyUrl), () => {
            Host.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(url);
        }, { jslogContext: 'copy-url' });
    }
    const initiatorUrl = element.dataset.initiatorUrl;
    if (initiatorUrl) {
        contextMenu.clipboardSection().appendItem(i18nString(UIStrings.copyInitiatorUrl), () => {
            Host.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(initiatorUrl);
        }, { jslogContext: 'copy-initiator-url' });
    }
}, _DeveloperResourcesListView_highlight = function _DeveloperResourcesListView_highlight(element, textContent, columnId) {
    if (!element || !textContent) {
        return;
    }
    const highlightContainers = new Set([...element.querySelectorAll('.filter-highlight')].map(e => e.parentElement));
    for (const container of highlightContainers) {
        container.textContent = container.textContent;
    }
    const filter = __classPrivateFieldGet(this, _DeveloperResourcesListView_filters, "f").find(filter => filter.key?.split(',')?.includes(columnId));
    if (!filter?.regex) {
        return;
    }
    const matches = filter.regex.exec(element.textContent ?? '');
    if (!matches?.length) {
        return;
    }
    const range = new TextUtils.TextRange.SourceRange(matches.index, matches[0].length);
    UI.UIUtils.highlightRangesWithStyleClass(element, [range], 'filter-highlight');
    for (const el of element.querySelectorAll('.filter-highlight')) {
        el.setAttribute('part', 'filter-highlight');
    }
};
//# sourceMappingURL=DeveloperResourcesListView.js.map