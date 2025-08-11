// Copyright (c) 2023 The Chromium Authors. All rights reserved.
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
var _CodeBlock_instances, _CodeBlock_shadow, _CodeBlock_code, _CodeBlock_codeLang, _CodeBlock_copyTimeout, _CodeBlock_timer, _CodeBlock_copied, _CodeBlock_editorState, _CodeBlock_languageConf, _CodeBlock_displayNotice, _CodeBlock_header, _CodeBlock_showCopyButton, _CodeBlock_citations, _CodeBlock_onCopy, _CodeBlock_renderNotice, _CodeBlock_renderCopyButton, _CodeBlock_maybeRenderCitations, _CodeBlock_render;
import '../../../ui/legacy/legacy.js'; // for x-link
import * as i18n from '../../../core/i18n/i18n.js';
import * as CodeMirror from '../../../third_party/codemirror.next/codemirror.next.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as CopyToClipboard from '../../../ui/components/copy_to_clipboard/copy_to_clipboard.js';
import * as TextEditor from '../../../ui/components/text_editor/text_editor.js';
import * as Lit from '../../lit/lit.js';
import * as VisualLogging from '../../visual_logging/visual_logging.js';
import styles from './codeBlock.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description The header text if not present and language is not set.
     */
    code: 'Code',
    /**
     * @description The title of the button to copy the codeblock from a Markdown view.
     */
    copy: 'Copy code',
    /**
     * @description The title of the button after it was pressed and the text was copied to clipboard.
     */
    copied: 'Copied to clipboard',
    /**
     * @description Disclaimer shown in the code blocks.
     */
    disclaimer: 'Use code snippets with caution',
};
const str_ = i18n.i18n.registerUIStrings('ui/components/markdown_view/CodeBlock.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export async function languageFromToken(lang) {
    switch (lang) {
        case 'javascript':
        case 'js':
        case 'jsx':
            // We intentionally allow JSX in normal .js as well as .jsx files,
            // because there are simply too many existing applications and
            // examples out there that use JSX within .js files, and we don't
            // want to break them.
            return CodeMirror.javascript.javascript({ jsx: true });
        case 'typescript':
        case 'ts':
            return CodeMirror.javascript.javascript({ typescript: true });
        case 'tsx':
            return CodeMirror.javascript.javascript({ typescript: true, jsx: true });
        case 'less':
        case 'scss':
        case 'sass':
        case 'css':
            return CodeMirror.css.css();
        case 'html':
            return CodeMirror.html.html({ autoCloseTags: false, selfClosingTags: true });
        case 'xml':
            return (await CodeMirror.xml()).xml();
        case 'cpp':
            return (await CodeMirror.cpp()).cpp();
        case 'go':
            return new CodeMirror.LanguageSupport(await CodeMirror.go());
        case 'java':
            return (await CodeMirror.java()).java();
        case 'kotlin':
            return new CodeMirror.LanguageSupport(await CodeMirror.kotlin());
        case 'json': {
            const jsonLanguage = CodeMirror.javascript.javascriptLanguage.configure({ top: 'SingleExpression' });
            return new CodeMirror.LanguageSupport(jsonLanguage);
        }
        case 'php':
            return (await CodeMirror.php()).php();
        case 'python':
        case 'py':
            return (await CodeMirror.python()).python();
        case 'markdown':
        case 'md':
            return (await CodeMirror.markdown()).markdown();
        case 'sh':
        case 'bash':
            return new CodeMirror.LanguageSupport(await CodeMirror.shell());
        case 'dart':
            return new CodeMirror.LanguageSupport(await CodeMirror.dart());
        case 'angular':
            return (await CodeMirror.angular()).angular();
        case 'svelte':
            return (await CodeMirror.svelte()).svelte();
        case 'vue':
            return (await CodeMirror.vue()).vue();
        default:
            return CodeMirror.html.html({ autoCloseTags: false, selfClosingTags: true });
    }
}
export class CodeBlock extends HTMLElement {
    constructor() {
        super(...arguments);
        _CodeBlock_instances.add(this);
        _CodeBlock_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _CodeBlock_code.set(this, '');
        _CodeBlock_codeLang.set(this, '');
        _CodeBlock_copyTimeout.set(this, 1000);
        _CodeBlock_timer.set(this, void 0);
        _CodeBlock_copied.set(this, false);
        _CodeBlock_editorState.set(this, void 0);
        _CodeBlock_languageConf.set(this, new CodeMirror.Compartment());
        /**
         * Whether to display a notice "​​Use code snippets with caution" in code
         * blocks.
         */
        _CodeBlock_displayNotice.set(this, false);
        _CodeBlock_header.set(this, void 0);
        _CodeBlock_showCopyButton.set(this, true);
        _CodeBlock_citations.set(this, []);
    }
    connectedCallback() {
        void __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_render).call(this);
    }
    set code(value) {
        __classPrivateFieldSet(this, _CodeBlock_code, value, "f");
        __classPrivateFieldSet(this, _CodeBlock_editorState, CodeMirror.EditorState.create({
            doc: __classPrivateFieldGet(this, _CodeBlock_code, "f"),
            extensions: [
                TextEditor.Config.baseConfiguration(__classPrivateFieldGet(this, _CodeBlock_code, "f")),
                CodeMirror.EditorState.readOnly.of(true),
                CodeMirror.EditorView.lineWrapping,
                __classPrivateFieldGet(this, _CodeBlock_languageConf, "f").of(CodeMirror.javascript.javascript()),
            ],
        }), "f");
        void __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_render).call(this);
    }
    get code() {
        return __classPrivateFieldGet(this, _CodeBlock_code, "f");
    }
    set codeLang(value) {
        __classPrivateFieldSet(this, _CodeBlock_codeLang, value, "f");
        void __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_render).call(this);
    }
    set timeout(value) {
        __classPrivateFieldSet(this, _CodeBlock_copyTimeout, value, "f");
        void __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_render).call(this);
    }
    set displayNotice(value) {
        __classPrivateFieldSet(this, _CodeBlock_displayNotice, value, "f");
        void __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_render).call(this);
    }
    set header(header) {
        __classPrivateFieldSet(this, _CodeBlock_header, header, "f");
        void __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_render).call(this);
    }
    set showCopyButton(show) {
        __classPrivateFieldSet(this, _CodeBlock_showCopyButton, show, "f");
        void __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_render).call(this);
    }
    set citations(citations) {
        __classPrivateFieldSet(this, _CodeBlock_citations, citations, "f");
    }
}
_CodeBlock_shadow = new WeakMap(), _CodeBlock_code = new WeakMap(), _CodeBlock_codeLang = new WeakMap(), _CodeBlock_copyTimeout = new WeakMap(), _CodeBlock_timer = new WeakMap(), _CodeBlock_copied = new WeakMap(), _CodeBlock_editorState = new WeakMap(), _CodeBlock_languageConf = new WeakMap(), _CodeBlock_displayNotice = new WeakMap(), _CodeBlock_header = new WeakMap(), _CodeBlock_showCopyButton = new WeakMap(), _CodeBlock_citations = new WeakMap(), _CodeBlock_instances = new WeakSet(), _CodeBlock_onCopy = function _CodeBlock_onCopy() {
    CopyToClipboard.copyTextToClipboard(__classPrivateFieldGet(this, _CodeBlock_code, "f"), i18nString(UIStrings.copied));
    __classPrivateFieldSet(this, _CodeBlock_copied, true, "f");
    void __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_render).call(this);
    clearTimeout(__classPrivateFieldGet(this, _CodeBlock_timer, "f"));
    __classPrivateFieldSet(this, _CodeBlock_timer, setTimeout(() => {
        __classPrivateFieldSet(this, _CodeBlock_copied, false, "f");
        void __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_render).call(this);
    }, __classPrivateFieldGet(this, _CodeBlock_copyTimeout, "f")), "f");
}, _CodeBlock_renderNotice = function _CodeBlock_renderNotice() {
    // clang-format off
    return html `<p class="notice">
      <x-link class="link" href="https://support.google.com/legal/answer/13505487" jslog=${VisualLogging.link('code-disclaimer').track({
        click: true,
    })}>
        ${i18nString(UIStrings.disclaimer)}
      </x-link>
    </p>`;
    // clang-format on
}, _CodeBlock_renderCopyButton = function _CodeBlock_renderCopyButton() {
    // clang-format off
    return html `
      <div class="copy-button-container">
        <devtools-button
          .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        jslogContext: 'copy',
        iconName: 'copy',
        title: i18nString(UIStrings.copy),
    }}
          @click=${__classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_onCopy)}
        ></devtools-button>
        ${__classPrivateFieldGet(this, _CodeBlock_copied, "f") ? html `<span>${i18nString(UIStrings.copied)}</span>` : Lit.nothing}
      </div>`;
    // clang-format on
}, _CodeBlock_maybeRenderCitations = function _CodeBlock_maybeRenderCitations() {
    if (!__classPrivateFieldGet(this, _CodeBlock_citations, "f").length) {
        return Lit.nothing;
    }
    // clang-format off
    return html `
      ${__classPrivateFieldGet(this, _CodeBlock_citations, "f").map(citation => html `
        <button
          class="citation"
          jslog=${VisualLogging.link('inline-citation').track({ click: true })}
          @click=${citation.clickHandler}
        >[${citation.index}]</button>
      `)}
    `;
    // clang-format on
}, _CodeBlock_render = async function _CodeBlock_render() {
    const header = (__classPrivateFieldGet(this, _CodeBlock_header, "f") ?? __classPrivateFieldGet(this, _CodeBlock_codeLang, "f")) || i18nString(UIStrings.code);
    if (!__classPrivateFieldGet(this, _CodeBlock_editorState, "f")) {
        throw new Error('Unexpected: trying to render the text editor without editorState');
    }
    // clang-format off
    Lit.render(html `<div class='codeblock' jslog=${VisualLogging.section('code')}>
      <style>${styles}</style>
        <div class="editor-wrapper">
        <div class="heading">
          <div class="heading-text-wrapper">
            <h4 class="heading-text">${header}</h4>
            ${__classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_maybeRenderCitations).call(this)}
          </div>
          ${__classPrivateFieldGet(this, _CodeBlock_showCopyButton, "f") ? __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_renderCopyButton).call(this) : Lit.nothing}
        </div>
        <div class="code">
          <devtools-text-editor .state=${__classPrivateFieldGet(this, _CodeBlock_editorState, "f")}></devtools-text-editor>
        </div>
      </div>
      ${__classPrivateFieldGet(this, _CodeBlock_displayNotice, "f") ? __classPrivateFieldGet(this, _CodeBlock_instances, "m", _CodeBlock_renderNotice).call(this) : Lit.nothing}
    </div>`, __classPrivateFieldGet(this, _CodeBlock_shadow, "f"), {
        host: this,
    });
    // clang-format on
    const editor = __classPrivateFieldGet(this, _CodeBlock_shadow, "f")?.querySelector('devtools-text-editor')?.editor;
    if (!editor) {
        return;
    }
    const language = await languageFromToken(__classPrivateFieldGet(this, _CodeBlock_codeLang, "f"));
    editor.dispatch({
        effects: __classPrivateFieldGet(this, _CodeBlock_languageConf, "f").reconfigure(language),
    });
};
customElements.define('devtools-code-block', CodeBlock);
//# sourceMappingURL=CodeBlock.js.map