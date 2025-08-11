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
var _RuleSetDetailsView_instances, _RuleSetDetailsView_shadow, _RuleSetDetailsView_data, _RuleSetDetailsView_shouldPrettyPrint, _RuleSetDetailsView_editorState, _RuleSetDetailsView_render, _RuleSetDetailsView_maybeError, _RuleSetDetailsView_renderSource, _RuleSetDetailsView_getSourceText;
import * as i18n from '../../../../core/i18n/i18n.js';
import { assertNotNullOrUndefined } from '../../../../core/platform/platform.js';
import * as SDK from '../../../../core/sdk/sdk.js';
import * as Formatter from '../../../../models/formatter/formatter.js';
import * as CodeMirror from '../../../../third_party/codemirror.next/codemirror.next.js';
import * as CodeHighlighter from '../../../../ui/components/code_highlighter/code_highlighter.js';
import * as LegacyWrapper from '../../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as RenderCoordinator from '../../../../ui/components/render_coordinator/render_coordinator.js';
import * as TextEditor from '../../../../ui/components/text_editor/text_editor.js';
import * as UI from '../../../../ui/legacy/legacy.js';
import * as Lit from '../../../../ui/lit/lit.js';
import ruleSetDetailsViewStyles from './RuleSetDetailsView.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description Text in RuleSetDetailsView of the Application panel if no element is selected. An element here is an item in a
     *             table of speculation rules. Speculation rules define the rules when and which urls should be prefetched.
     *             https://developer.chrome.com/docs/devtools/application/debugging-speculation-rules
     */
    noElementSelected: 'No element selected',
    /**
     *@description Text in RuleSetDetailsView of the Application panel if no element is selected. An element here is an item in a
     *             table of speculation rules. Speculation rules define the rules when and which urls should be prefetched.
     *             https://developer.chrome.com/docs/devtools/application/debugging-speculation-rules
     */
    selectAnElementForMoreDetails: 'Select an element for more details',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/preloading/components/RuleSetDetailsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const codeMirrorJsonType = await CodeHighlighter.CodeHighlighter.languageFromMIME('application/json');
export class RuleSetDetailsView extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super(...arguments);
        _RuleSetDetailsView_instances.add(this);
        _RuleSetDetailsView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _RuleSetDetailsView_data.set(this, null);
        _RuleSetDetailsView_shouldPrettyPrint.set(this, true);
        _RuleSetDetailsView_editorState.set(this, void 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _RuleSetDetailsView_data, data, "f");
        void __classPrivateFieldGet(this, _RuleSetDetailsView_instances, "m", _RuleSetDetailsView_render).call(this);
    }
    set shouldPrettyPrint(shouldPrettyPrint) {
        __classPrivateFieldSet(this, _RuleSetDetailsView_shouldPrettyPrint, shouldPrettyPrint, "f");
    }
}
_RuleSetDetailsView_shadow = new WeakMap(), _RuleSetDetailsView_data = new WeakMap(), _RuleSetDetailsView_shouldPrettyPrint = new WeakMap(), _RuleSetDetailsView_editorState = new WeakMap(), _RuleSetDetailsView_instances = new WeakSet(), _RuleSetDetailsView_render = async function _RuleSetDetailsView_render() {
    await RenderCoordinator.write('RuleSetDetailsView render', async () => {
        if (__classPrivateFieldGet(this, _RuleSetDetailsView_data, "f") === null) {
            Lit.render(html `
          <style>${ruleSetDetailsViewStyles}</style>
          <style>${UI.inspectorCommonStyles}</style>
          <div class="placeholder">
            <div class="empty-state">
              <span class="empty-state-header">${i18nString(UIStrings.noElementSelected)}</span>
              <span class="empty-state-description">${i18nString(UIStrings.selectAnElementForMoreDetails)}</span>
            </div>
          </div>
      `, __classPrivateFieldGet(this, _RuleSetDetailsView_shadow, "f"), { host: this });
            // clang-format on
            return;
        }
        const sourceText = await __classPrivateFieldGet(this, _RuleSetDetailsView_instances, "m", _RuleSetDetailsView_getSourceText).call(this);
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        Lit.render(html `
        <style>${ruleSetDetailsViewStyles}</style>
        <style>${UI.inspectorCommonStyles}</style>
        <div class="content">
          <div class="ruleset-header" id="ruleset-url">${__classPrivateFieldGet(this, _RuleSetDetailsView_data, "f")?.url || SDK.TargetManager.TargetManager.instance().inspectedURL()}</div>
          ${__classPrivateFieldGet(this, _RuleSetDetailsView_instances, "m", _RuleSetDetailsView_maybeError).call(this)}
        </div>
        <div class="text-ellipsis">
          ${__classPrivateFieldGet(this, _RuleSetDetailsView_instances, "m", _RuleSetDetailsView_renderSource).call(this, sourceText)}
        </div>
      `, __classPrivateFieldGet(this, _RuleSetDetailsView_shadow, "f"), { host: this });
        // clang-format on
    });
}, _RuleSetDetailsView_maybeError = function _RuleSetDetailsView_maybeError() {
    assertNotNullOrUndefined(__classPrivateFieldGet(this, _RuleSetDetailsView_data, "f"));
    if (__classPrivateFieldGet(this, _RuleSetDetailsView_data, "f").errorMessage === undefined) {
        return Lit.nothing;
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <div class="ruleset-header">
        <devtools-icon
          .data=${{
        iconName: 'cross-circle',
        color: 'var(--icon-error)',
        width: '16px',
        height: '16px',
    }}>
        </devtools-icon>
        <span id="error-message-text">${__classPrivateFieldGet(this, _RuleSetDetailsView_data, "f").errorMessage}</span>
      </div>
    `;
    // clang-format on
}, _RuleSetDetailsView_renderSource = function _RuleSetDetailsView_renderSource(sourceText) {
    __classPrivateFieldSet(this, _RuleSetDetailsView_editorState, CodeMirror.EditorState.create({
        doc: sourceText,
        extensions: [
            TextEditor.Config.baseConfiguration(sourceText || ''),
            CodeMirror.lineNumbers(),
            CodeMirror.EditorState.readOnly.of(true),
            codeMirrorJsonType,
            CodeMirror.syntaxHighlighting(CodeHighlighter.CodeHighlighter.highlightStyle),
        ],
    }), "f");
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    // TODO(https://crbug.com/1425354): Add Raw button.
    return html `
      <devtools-text-editor .style.flexGrow=${'1'} .state=${__classPrivateFieldGet(this, _RuleSetDetailsView_editorState, "f")}></devtools-text-editor>
    `;
    // clang-format on
}, _RuleSetDetailsView_getSourceText = async function _RuleSetDetailsView_getSourceText() {
    if (__classPrivateFieldGet(this, _RuleSetDetailsView_shouldPrettyPrint, "f") && __classPrivateFieldGet(this, _RuleSetDetailsView_data, "f")?.sourceText !== undefined) {
        const formattedResult = await Formatter.ScriptFormatter.formatScriptContent('application/json', __classPrivateFieldGet(this, _RuleSetDetailsView_data, "f").sourceText);
        return formattedResult.formattedContent;
    }
    return __classPrivateFieldGet(this, _RuleSetDetailsView_data, "f")?.sourceText || '';
};
customElements.define('devtools-resources-rulesets-details-view', RuleSetDetailsView);
//# sourceMappingURL=RuleSetDetailsView.js.map