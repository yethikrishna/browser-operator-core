// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _AiWarningInfobarPlugin_instances, _AiWarningInfobarPlugin_editor, _AiWarningInfobarPlugin_aiWarningInfobar, _AiWarningInfobarPlugin_onWorkingCopyCommitted, _AiWarningInfobarPlugin_showAiWarningInfobar;
import * as i18n from '../../core/i18n/i18n.js';
import * as Workspace from '../../models/workspace/workspace.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import * as UI from '../../ui/legacy/legacy.js';
import { Plugin } from './Plugin.js';
const UIStrings = {
    /**
     *@description Infobar text announcing that the file contents have been changed by AI
     */
    aiContentWarning: 'This file contains AI-generated content',
};
const str_ = i18n.i18n.registerUIStrings('panels/sources/AiWarningInfobarPlugin.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class AiWarningInfobarPlugin extends Plugin {
    constructor(uiSourceCode) {
        super(uiSourceCode);
        _AiWarningInfobarPlugin_instances.add(this);
        _AiWarningInfobarPlugin_editor.set(this, undefined);
        _AiWarningInfobarPlugin_aiWarningInfobar.set(this, null);
        this.uiSourceCode.addEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, __classPrivateFieldGet(this, _AiWarningInfobarPlugin_instances, "m", _AiWarningInfobarPlugin_onWorkingCopyCommitted), this);
    }
    dispose() {
        __classPrivateFieldGet(this, _AiWarningInfobarPlugin_aiWarningInfobar, "f")?.dispose();
        __classPrivateFieldSet(this, _AiWarningInfobarPlugin_aiWarningInfobar, null, "f");
        this.uiSourceCode.removeEventListener(Workspace.UISourceCode.Events.WorkingCopyCommitted, __classPrivateFieldGet(this, _AiWarningInfobarPlugin_instances, "m", _AiWarningInfobarPlugin_onWorkingCopyCommitted), this);
        super.dispose();
    }
    static accepts(uiSourceCode) {
        return uiSourceCode.contentType().hasScripts() || uiSourceCode.contentType().hasStyleSheets();
    }
    editorInitialized(editor) {
        __classPrivateFieldSet(this, _AiWarningInfobarPlugin_editor, editor, "f");
        if (this.uiSourceCode.containsAiChanges()) {
            __classPrivateFieldGet(this, _AiWarningInfobarPlugin_instances, "m", _AiWarningInfobarPlugin_showAiWarningInfobar).call(this);
        }
    }
    attachInfobar(bar) {
        if (__classPrivateFieldGet(this, _AiWarningInfobarPlugin_editor, "f")) {
            __classPrivateFieldGet(this, _AiWarningInfobarPlugin_editor, "f").dispatch({ effects: SourceFrame.SourceFrame.addInfobar.of(bar) });
        }
    }
    removeInfobar(bar) {
        if (__classPrivateFieldGet(this, _AiWarningInfobarPlugin_editor, "f") && bar) {
            __classPrivateFieldGet(this, _AiWarningInfobarPlugin_editor, "f").dispatch({ effects: SourceFrame.SourceFrame.removeInfobar.of(bar) });
        }
    }
}
_AiWarningInfobarPlugin_editor = new WeakMap(), _AiWarningInfobarPlugin_aiWarningInfobar = new WeakMap(), _AiWarningInfobarPlugin_instances = new WeakSet(), _AiWarningInfobarPlugin_onWorkingCopyCommitted = function _AiWarningInfobarPlugin_onWorkingCopyCommitted() {
    if (!this.uiSourceCode.containsAiChanges()) {
        __classPrivateFieldGet(this, _AiWarningInfobarPlugin_aiWarningInfobar, "f")?.dispose();
        __classPrivateFieldSet(this, _AiWarningInfobarPlugin_aiWarningInfobar, null, "f");
    }
}, _AiWarningInfobarPlugin_showAiWarningInfobar = function _AiWarningInfobarPlugin_showAiWarningInfobar() {
    const infobar = new UI.Infobar.Infobar("warning" /* UI.Infobar.Type.WARNING */, i18nString(UIStrings.aiContentWarning), undefined, undefined, 'contains-ai-content-warning');
    __classPrivateFieldSet(this, _AiWarningInfobarPlugin_aiWarningInfobar, infobar, "f");
    infobar.setCloseCallback(() => this.removeInfobar(__classPrivateFieldGet(this, _AiWarningInfobarPlugin_aiWarningInfobar, "f")));
    this.attachInfobar(__classPrivateFieldGet(this, _AiWarningInfobarPlugin_aiWarningInfobar, "f"));
};
//# sourceMappingURL=AiWarningInfobarPlugin.js.map