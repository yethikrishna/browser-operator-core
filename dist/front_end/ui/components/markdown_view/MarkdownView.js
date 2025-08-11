// Copyright 2020 The Chromium Authors. All rights reserved.
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
var _MarkdownView_instances, _MarkdownView_shadow, _MarkdownView_tokenData, _MarkdownView_renderer, _MarkdownView_animationEnabled, _MarkdownView_isAnimating, _MarkdownView_onOpenTableInViewer, _MarkdownView_handleTableSortChanged, _MarkdownView_finishAnimations, _MarkdownView_animate, _MarkdownView_update, _MarkdownView_render, _MarkdownLitRenderer_customClasses, _MarkdownLitRenderer_tableViewerCallback, _MarkdownLitRenderer_tableSortState, _MarkdownLitRenderer_markdownViewInstance, _MarkdownInsightRenderer_citationClickHandler;
import './CodeBlock.js';
import './MarkdownImage.js';
import './MarkdownLink.js';
import * as Lit from '../../lit/lit.js';
import * as VisualLogging from '../../visual_logging/visual_logging.js';
import markdownViewStyles from './markdownView.css.js';
const html = Lit.html;
const render = Lit.render;
export class MarkdownView extends HTMLElement {
    constructor() {
        super(...arguments);
        _MarkdownView_instances.add(this);
        _MarkdownView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _MarkdownView_tokenData.set(this, []);
        _MarkdownView_renderer.set(this, new MarkdownLitRenderer());
        _MarkdownView_animationEnabled.set(this, false);
        _MarkdownView_isAnimating.set(this, false);
        _MarkdownView_onOpenTableInViewer.set(this, void 0);
    }
    connectedCallback() {
        // Listen for table sort events to trigger re-render
        this.addEventListener('table-sort-changed', __classPrivateFieldGet(this, _MarkdownView_instances, "m", _MarkdownView_handleTableSortChanged).bind(this));
    }
    set data(data) {
        __classPrivateFieldSet(this, _MarkdownView_tokenData, data.tokens, "f");
        if (data.renderer) {
            __classPrivateFieldSet(this, _MarkdownView_renderer, data.renderer, "f");
        }
        __classPrivateFieldSet(this, _MarkdownView_onOpenTableInViewer, data.onOpenTableInViewer, "f");
        // Pass the callback and instance to the renderer
        if (__classPrivateFieldGet(this, _MarkdownView_renderer, "f") && 'setTableViewerCallback' in __classPrivateFieldGet(this, _MarkdownView_renderer, "f")) {
            __classPrivateFieldGet(this, _MarkdownView_renderer, "f").setTableViewerCallback(__classPrivateFieldGet(this, _MarkdownView_onOpenTableInViewer, "f"));
        }
        if (__classPrivateFieldGet(this, _MarkdownView_renderer, "f") && 'setMarkdownViewInstance' in __classPrivateFieldGet(this, _MarkdownView_renderer, "f")) {
            __classPrivateFieldGet(this, _MarkdownView_renderer, "f").setMarkdownViewInstance(this);
        }
        if (data.animationEnabled) {
            __classPrivateFieldSet(this, _MarkdownView_animationEnabled, true, "f");
            __classPrivateFieldGet(this, _MarkdownView_renderer, "f").addCustomClasses({
                paragraph: 'pending',
                heading: 'pending',
                list_item: 'pending',
                code: 'pending',
            });
        }
        else {
            __classPrivateFieldGet(this, _MarkdownView_instances, "m", _MarkdownView_finishAnimations).call(this);
        }
        __classPrivateFieldGet(this, _MarkdownView_instances, "m", _MarkdownView_update).call(this);
    }
}
_MarkdownView_shadow = new WeakMap(), _MarkdownView_tokenData = new WeakMap(), _MarkdownView_renderer = new WeakMap(), _MarkdownView_animationEnabled = new WeakMap(), _MarkdownView_isAnimating = new WeakMap(), _MarkdownView_onOpenTableInViewer = new WeakMap(), _MarkdownView_instances = new WeakSet(), _MarkdownView_handleTableSortChanged = function _MarkdownView_handleTableSortChanged() {
    console.log('[Table Sort] Event received in MarkdownView, triggering re-render');
    // Re-render when table sort changes
    __classPrivateFieldGet(this, _MarkdownView_instances, "m", _MarkdownView_update).call(this);
}, _MarkdownView_finishAnimations = function _MarkdownView_finishAnimations() {
    const animatingElements = __classPrivateFieldGet(this, _MarkdownView_shadow, "f").querySelectorAll('.animating');
    for (const element of animatingElements) {
        element.classList.remove('animating');
    }
    const pendingElements = __classPrivateFieldGet(this, _MarkdownView_shadow, "f").querySelectorAll('.pending');
    for (const element of pendingElements) {
        element.classList.remove('pending');
    }
    __classPrivateFieldSet(this, _MarkdownView_isAnimating, false, "f");
    __classPrivateFieldSet(this, _MarkdownView_animationEnabled, false, "f");
    __classPrivateFieldGet(this, _MarkdownView_renderer, "f").removeCustomClasses({
        paragraph: 'pending',
        heading: 'pending',
        list_item: 'pending',
        code: 'pending',
    });
}, _MarkdownView_animate = function _MarkdownView_animate() {
    if (__classPrivateFieldGet(this, _MarkdownView_isAnimating, "f")) {
        return;
    }
    __classPrivateFieldSet(this, _MarkdownView_isAnimating, true, "f");
    const reveal = () => {
        const pendingElement = __classPrivateFieldGet(this, _MarkdownView_shadow, "f").querySelector('.pending');
        if (!pendingElement) {
            __classPrivateFieldSet(this, _MarkdownView_isAnimating, false, "f");
            return;
        }
        pendingElement.addEventListener('animationend', () => {
            pendingElement.classList.remove('animating');
            reveal();
        }, { once: true });
        pendingElement.classList.remove('pending');
        pendingElement.classList.add('animating');
    };
    reveal();
}, _MarkdownView_update = function _MarkdownView_update() {
    __classPrivateFieldGet(this, _MarkdownView_instances, "m", _MarkdownView_render).call(this);
    if (__classPrivateFieldGet(this, _MarkdownView_animationEnabled, "f")) {
        __classPrivateFieldGet(this, _MarkdownView_instances, "m", _MarkdownView_animate).call(this);
    }
}, _MarkdownView_render = function _MarkdownView_render() {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${markdownViewStyles}</style>
      <div class='message'>
        ${__classPrivateFieldGet(this, _MarkdownView_tokenData, "f").map(token => __classPrivateFieldGet(this, _MarkdownView_renderer, "f").renderToken(token))}
      </div>
    `, __classPrivateFieldGet(this, _MarkdownView_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-markdown-view', MarkdownView);
/**
 * Default renderer is used for the IssuesPanel and allows only well-known images and links to be embedded.
 */
export class MarkdownLitRenderer {
    constructor() {
        _MarkdownLitRenderer_customClasses.set(this, {});
        _MarkdownLitRenderer_tableViewerCallback.set(this, void 0);
        _MarkdownLitRenderer_tableSortState.set(this, new Map());
        _MarkdownLitRenderer_markdownViewInstance.set(this, void 0);
        this.openTableInViewer = (token) => {
            // Convert table back to markdown format for the document viewer
            const markdownTable = this.convertTableToMarkdown(token);
            // Use the callback if available
            if (__classPrivateFieldGet(this, _MarkdownLitRenderer_tableViewerCallback, "f")) {
                __classPrivateFieldGet(this, _MarkdownLitRenderer_tableViewerCallback, "f").call(this, markdownTable);
            }
        };
        // Handle column header click for sorting
        this.handleColumnSort = (tableId, columnIndex) => {
            console.log('[Table Sort] Click handler called', { tableId, columnIndex });
            const currentSort = __classPrivateFieldGet(this, _MarkdownLitRenderer_tableSortState, "f").get(tableId);
            let newDirection = 'asc';
            if (currentSort && currentSort.columnIndex === columnIndex) {
                // Toggle direction if clicking same column
                newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
            }
            __classPrivateFieldGet(this, _MarkdownLitRenderer_tableSortState, "f").set(tableId, { columnIndex, direction: newDirection });
            console.log('[Table Sort] State updated', { tableId, columnIndex, direction: newDirection });
            console.log('[Table Sort] Current state map:', __classPrivateFieldGet(this, _MarkdownLitRenderer_tableSortState, "f"));
            // Use the direct instance reference instead of DOM query
            if (__classPrivateFieldGet(this, _MarkdownLitRenderer_markdownViewInstance, "f")) {
                console.log('[Table Sort] Triggering re-render via direct instance');
                __classPrivateFieldGet(this, _MarkdownLitRenderer_markdownViewInstance, "f").dispatchEvent(new CustomEvent('table-sort-changed'));
            }
            else {
                console.log('[Table Sort] No markdown view instance available');
            }
        };
    }
    addCustomClasses(customClasses) {
        for (const [type, className] of Object.entries(customClasses)) {
            if (!__classPrivateFieldGet(this, _MarkdownLitRenderer_customClasses, "f")[type]) {
                __classPrivateFieldGet(this, _MarkdownLitRenderer_customClasses, "f")[type] = new Set();
            }
            __classPrivateFieldGet(this, _MarkdownLitRenderer_customClasses, "f")[type].add(className);
        }
    }
    setTableViewerCallback(callback) {
        __classPrivateFieldSet(this, _MarkdownLitRenderer_tableViewerCallback, callback, "f");
    }
    setMarkdownViewInstance(instance) {
        __classPrivateFieldSet(this, _MarkdownLitRenderer_markdownViewInstance, instance, "f");
    }
    removeCustomClasses(customClasses) {
        for (const [type, className] of Object.entries(customClasses)) {
            if (__classPrivateFieldGet(this, _MarkdownLitRenderer_customClasses, "f")[type]) {
                __classPrivateFieldGet(this, _MarkdownLitRenderer_customClasses, "f")[type].delete(className);
            }
        }
    }
    customClassMapForToken(type) {
        const classNames = __classPrivateFieldGet(this, _MarkdownLitRenderer_customClasses, "f")[type] || new Set();
        const classInfo = Object.fromEntries([...classNames].map(className => [className, true]));
        return Lit.Directives.classMap(classInfo);
    }
    renderChildTokens(token) {
        if ('tokens' in token && token.tokens) {
            return token.tokens.map(token => this.renderToken(token));
        }
        throw new Error('Tokens not found');
    }
    /**
     * Unescape will get rid of the escaping done by Marked to avoid double escaping due to escaping it also with lit.
     * Table taken from: front_end/third_party/marked/package/src/helpers.js
     */
    unescape(text) {
        const escapeReplacements = new Map([
            ['&amp;', '&'],
            ['&lt;', '<'],
            ['&gt;', '>'],
            ['&quot;', '"'],
            ['&#39;', '\''],
        ]);
        return text.replace(/&(amp|lt|gt|quot|#39);/g, (matchedString) => {
            const replacement = escapeReplacements.get(matchedString);
            return replacement ? replacement : matchedString;
        });
    }
    renderText(token) {
        if ('tokens' in token && token.tokens) {
            return html `${this.renderChildTokens(token)}`;
        }
        // Due to unescaping, unescaped html entities (see escapeReplacements' keys) will be rendered
        // as their corresponding symbol while the rest will be rendered as verbatim.
        // Marked's escape function can be found in front_end/third_party/marked/package/src/helpers.js
        return html `${this.unescape('text' in token ? token.text : '')}`;
    }
    renderHeading(heading) {
        const customClass = this.customClassMapForToken('heading');
        switch (heading.depth) {
            case 1:
                return html `<h1 class=${customClass}>${this.renderText(heading)}</h1>`;
            case 2:
                return html `<h2 class=${customClass}>${this.renderText(heading)}</h2>`;
            case 3:
                return html `<h3 class=${customClass}>${this.renderText(heading)}</h3>`;
            case 4:
                return html `<h4 class=${customClass}>${this.renderText(heading)}</h4>`;
            case 5:
                return html `<h5 class=${customClass}>${this.renderText(heading)}</h5>`;
            default:
                return html `<h6 class=${customClass}>${this.renderText(heading)}</h6>`;
        }
    }
    renderCodeBlock(token) {
        // clang-format off
        return html `<devtools-code-block
      class=${this.customClassMapForToken('code')}
      .code=${this.unescape(token.text)}
      .codeLang=${token.lang || ''}>
    </devtools-code-block>`;
        // clang-format on
    }
    renderTable(token) {
        const customClass = this.customClassMapForToken('table');
        const isLargeTable = this.isLargeTable(token);
        const tableId = this.generateTableId(token);
        const sortState = __classPrivateFieldGet(this, _MarkdownLitRenderer_tableSortState, "f").get(tableId);
        console.log('[Table Sort] Rendering table', { tableId, sortState, hasSortState: !!sortState });
        // Get sorted or original rows
        const rows = sortState ? this.sortTableData(token, sortState.columnIndex, sortState.direction) : token.rows;
        // Create a bound click handler
        const handleClick = (index) => {
            return (e) => {
                e.preventDefault();
                this.handleColumnSort(tableId, index);
            };
        };
        const tableHtml = html `
      <table class=${customClass} data-table-id=${tableId}>
        <thead>
          <tr>
            ${token.header.map((cell, index) => html `
              <th 
                style=${this.getAlignmentStyle(token.align[index])}
                class="sortable-header"
                @click=${handleClick(index)}
                title="Click to sort by ${cell.text}">
                ${this.renderTableCellContent(cell)}
                <span class="sort-indicator ${sortState?.columnIndex === index ? 'active' : ''}">
                  ${sortState?.columnIndex === index ?
            (sortState.direction === 'asc' ? ' ↑' : ' ↓') :
            ' ↕'}
                </span>
              </th>
            `)}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => html `
            <tr>
              ${row.map((cell, index) => html `
                <td style=${this.getAlignmentStyle(token.align[index])}>
                  ${this.renderTableCellContent(cell)}
                </td>
              `)}
            </tr>
          `)}
        </tbody>
      </table>
    `;
        return html `
      <div class="table-container">
        ${tableHtml}
      </div>
      ${isLargeTable ? html `
        <div class="table-actions">
          <span class="scroll-hint">← Scroll horizontally • Click headers to sort →</span>
          <button 
            class="view-document-btn"
            @click=${() => this.openTableInViewer(token)}
            title="Open table in full document viewer for better viewing">
            📊 View Full Table
          </button>
        </div>
      ` : ''}
    `;
    }
    isLargeTable(token) {
        // Consider a table "large" if:
        // 1. More than 4 columns
        // 2. More than 10 rows
        // 3. Any cell content is particularly long
        const columnCount = token.header.length;
        const rowCount = token.rows.length;
        if (columnCount > 4 || rowCount > 10) {
            return true;
        }
        // Check for long cell content
        const allCells = [...token.header, ...token.rows.flat()];
        const hasLongContent = allCells.some(cell => cell.text.length > 50);
        return hasLongContent;
    }
    convertTableToMarkdown(token) {
        // Convert the table token back to markdown format
        let markdown = '# Table Data\n\n';
        // Header row
        const headerRow = '| ' + token.header.map(cell => cell.text).join(' | ') + ' |';
        markdown += headerRow + '\n';
        // Separator row with alignment
        const separatorRow = '|' + token.align.map(align => {
            switch (align) {
                case 'center': return ':---:';
                case 'right': return '---:';
                case 'left': return ':---';
                default: return '---';
            }
        }).map(sep => ' ' + sep + ' ').join('|') + '|';
        markdown += separatorRow + '\n';
        // Data rows
        token.rows.forEach(row => {
            const dataRow = '| ' + row.map(cell => cell.text).join(' | ') + ' |';
            markdown += dataRow + '\n';
        });
        return markdown;
    }
    renderTableCellContent(cell) {
        // If the cell has tokens, render them; otherwise render the text directly
        if (cell.tokens && cell.tokens.length > 0) {
            return html `${cell.tokens.map(token => this.renderToken(token))}`;
        }
        return html `${this.unescape(cell.text)}`;
    }
    getAlignmentStyle(align) {
        switch (align) {
            case 'center':
                return 'text-align: center;';
            case 'right':
                return 'text-align: right;';
            case 'left':
                return 'text-align: left;';
            default:
                return '';
        }
    }
    // Generate a unique ID for each table to track sorting state
    generateTableId(token) {
        // Create a hash based on table structure for consistent ID
        const content = token.header.map(h => h.text).join('|') + token.rows.map(r => r.map(c => c.text).join('|')).join('||');
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return `table-${Math.abs(hash).toString(16)}`;
    }
    // Sort table rows by column
    sortTableData(token, columnIndex, direction) {
        const sortedRows = [...token.rows];
        sortedRows.sort((a, b) => {
            const aCell = a[columnIndex];
            const bCell = b[columnIndex];
            if (!aCell || !bCell)
                return 0;
            const aText = aCell.text.trim();
            const bText = bCell.text.trim();
            // Try to parse as numbers
            const aNum = parseFloat(aText);
            const bNum = parseFloat(bText);
            let comparison = 0;
            if (!isNaN(aNum) && !isNaN(bNum)) {
                // Both are numbers
                comparison = aNum - bNum;
            }
            else {
                // String comparison
                comparison = aText.localeCompare(bText, undefined, { numeric: true, sensitivity: 'base' });
            }
            return direction === 'asc' ? comparison : -comparison;
        });
        return sortedRows;
    }
    renderHorizontalRule(_token) {
        return html `<hr class=${this.customClassMapForToken('hr')}>`;
    }
    renderBlockquote(token) {
        return html `
      <blockquote class=${this.customClassMapForToken('blockquote')}>
        ${this.renderChildTokens(token)}
      </blockquote>
    `;
    }
    renderStrikethrough(token) {
        return html `<del class=${this.customClassMapForToken('del')}>${this.renderChildTokens(token)}</del>`;
    }
    renderLineBreak(_token) {
        return html `<br class=${this.customClassMapForToken('br')}>`;
    }
    templateForToken(token) {
        switch (token.type) {
            case 'paragraph':
                return html `<p class=${this.customClassMapForToken('paragraph')}>${this.renderChildTokens(token)}</p>`;
            case 'list':
                return html `<ul class=${this.customClassMapForToken('list')}>${token.items.map(token => {
                    return this.renderToken(token);
                })}</ul>`;
            case 'list_item':
                return html `<li class=${this.customClassMapForToken('list_item')}>${this.renderChildTokens(token)}</li>`;
            case 'text':
                return this.renderText(token);
            case 'codespan':
                return html `<code class=${this.customClassMapForToken('codespan')}>${this.unescape(token.text)}</code>`;
            case 'code':
                return this.renderCodeBlock(token);
            case 'space':
                return html ``;
            case 'link':
                return html `<devtools-markdown-link
        class=${this.customClassMapForToken('link')}
        .data=${{
                    key: token.href, title: token.text,
                }}></devtools-markdown-link>`;
            case 'image':
                return html `<devtools-markdown-image
        class=${this.customClassMapForToken('image')}
        .data=${{
                    key: token.href, title: token.text,
                }}></devtools-markdown-image>`;
            case 'heading':
                return this.renderHeading(token);
            case 'strong':
                return html `<strong class=${this.customClassMapForToken('strong')}>${this.renderText(token)}</strong>`;
            case 'em':
                return html `<em class=${this.customClassMapForToken('em')}>${this.renderText(token)}</em>`;
            case 'table':
                return this.renderTable(token);
            case 'hr':
                return this.renderHorizontalRule(token);
            case 'blockquote':
                return this.renderBlockquote(token);
            case 'del':
                return this.renderStrikethrough(token);
            case 'br':
                return this.renderLineBreak(token);
            default:
                return null;
        }
    }
    renderToken(token) {
        const template = this.templateForToken(token);
        if (template === null) {
            throw new Error(`Markdown token type '${token.type}' not supported.`);
        }
        return template;
    }
}
_MarkdownLitRenderer_customClasses = new WeakMap(), _MarkdownLitRenderer_tableViewerCallback = new WeakMap(), _MarkdownLitRenderer_tableSortState = new WeakMap(), _MarkdownLitRenderer_markdownViewInstance = new WeakMap();
/**
 * Renderer used in Console Insights and AI assistance for the text generated by an LLM.
 */
export class MarkdownInsightRenderer extends MarkdownLitRenderer {
    constructor(citationClickHandler) {
        super();
        _MarkdownInsightRenderer_citationClickHandler.set(this, void 0);
        __classPrivateFieldSet(this, _MarkdownInsightRenderer_citationClickHandler, citationClickHandler || (() => { }), "f");
        this.addCustomClasses({ heading: 'insight' });
    }
    renderToken(token) {
        const template = this.templateForToken(token);
        if (template === null) {
            return html `${token.raw}`;
        }
        return template;
    }
    sanitizeUrl(maybeUrl) {
        try {
            const url = new URL(maybeUrl);
            if (url.protocol === 'https:' || url.protocol === 'http:') {
                return url.toString();
            }
            return null;
        }
        catch {
            return null;
        }
    }
    detectCodeLanguage(token) {
        if (token.lang) {
            return token.lang;
        }
        if (/^(\.|#)?[\w:\[\]="'-\.]+ ?{/m.test(token.text) || /^@import/.test(token.text)) {
            return 'css';
        }
        if (/^(var|const|let|function|async|import)\s/.test(token.text)) {
            return 'js';
        }
        return '';
    }
    templateForToken(token) {
        switch (token.type) {
            case 'heading':
                return this.renderHeading(token);
            case 'link':
            case 'image': {
                const sanitizedUrl = this.sanitizeUrl(token.href);
                if (!sanitizedUrl) {
                    return null;
                }
                // Only links pointing to resources within DevTools can be rendered here.
                return html `${token.text ?? token.href}`;
            }
            case 'code':
                return html `<devtools-code-block
          class=${this.customClassMapForToken('code')}
          .code=${this.unescape(token.text)}
          .codeLang=${this.detectCodeLanguage(token)}
          .citations=${token.citations || []}
          .displayNotice=${true}>
        </devtools-code-block>`;
            case 'citation':
                // clang-format off
                return html `<sup><button
            class="citation"
            jslog=${VisualLogging.link('inline-citation').track({ click: true })}
            @click=${__classPrivateFieldGet(this, _MarkdownInsightRenderer_citationClickHandler, "f").bind(this, Number(token.linkText))}
          >[${token.linkText}]</button></sup>`;
            // clang-format on
        }
        return super.templateForToken(token);
    }
}
_MarkdownInsightRenderer_citationClickHandler = new WeakMap();
//# sourceMappingURL=MarkdownView.js.map