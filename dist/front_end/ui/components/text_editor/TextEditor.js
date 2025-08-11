// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _TextEditor_instances, _TextEditor_shadow, _TextEditor_activeEditor, _TextEditor_dynamicSettings, _TextEditor_activeSettingListeners, _TextEditor_pendingState, _TextEditor_lastScrollSnapshot, _TextEditor_resizeTimeout, _TextEditor_resizeListener, _TextEditor_devtoolsResizeObserver, _TextEditor_createEditor, _TextEditor_ensureSettingListeners, _TextEditor_startObservingResize, _TextEditor_maybeDispatchInput;
import * as Common from '../../../core/common/common.js';
import * as WindowBoundsService from '../../../services/window_bounds/window_bounds.js';
import * as CodeMirror from '../../../third_party/codemirror.next/codemirror.next.js';
import * as ThemeSupport from '../../legacy/theme_support/theme_support.js';
import * as CodeHighlighter from '../code_highlighter/code_highlighter.js';
import { baseConfiguration, dummyDarkTheme, dynamicSetting, DynamicSetting, themeSelection } from './config.js';
import { toLineColumn, toOffset } from './position.js';
import textEditorStyles from './textEditor.css.js';
export class TextEditor extends HTMLElement {
    constructor(pendingState) {
        super();
        _TextEditor_instances.add(this);
        _TextEditor_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _TextEditor_activeEditor.set(this, undefined);
        _TextEditor_dynamicSettings.set(this, DynamicSetting.none);
        _TextEditor_activeSettingListeners.set(this, []);
        _TextEditor_pendingState.set(this, void 0);
        _TextEditor_lastScrollSnapshot.set(this, void 0);
        _TextEditor_resizeTimeout.set(this, -1);
        _TextEditor_resizeListener.set(this, () => {
            if (__classPrivateFieldGet(this, _TextEditor_resizeTimeout, "f") < 0) {
                __classPrivateFieldSet(this, _TextEditor_resizeTimeout, window.setTimeout(() => {
                    __classPrivateFieldSet(this, _TextEditor_resizeTimeout, -1, "f");
                    if (__classPrivateFieldGet(this, _TextEditor_activeEditor, "f")) {
                        CodeMirror.repositionTooltips(__classPrivateFieldGet(this, _TextEditor_activeEditor, "f"));
                    }
                }, 50), "f");
            }
        });
        _TextEditor_devtoolsResizeObserver.set(this, new ResizeObserver(__classPrivateFieldGet(this, _TextEditor_resizeListener, "f")));
        __classPrivateFieldSet(this, _TextEditor_pendingState, pendingState, "f");
        __classPrivateFieldGet(this, _TextEditor_shadow, "f").createChild('style').textContent = CodeHighlighter.codeHighlighterStyles;
        __classPrivateFieldGet(this, _TextEditor_shadow, "f").createChild('style').textContent = textEditorStyles;
    }
    get editor() {
        return __classPrivateFieldGet(this, _TextEditor_activeEditor, "f") || __classPrivateFieldGet(this, _TextEditor_instances, "m", _TextEditor_createEditor).call(this);
    }
    dispatch(spec) {
        return this.editor.dispatch(spec);
    }
    get state() {
        if (__classPrivateFieldGet(this, _TextEditor_activeEditor, "f")) {
            return __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").state;
        }
        if (!__classPrivateFieldGet(this, _TextEditor_pendingState, "f")) {
            __classPrivateFieldSet(this, _TextEditor_pendingState, CodeMirror.EditorState.create({ extensions: baseConfiguration('') }), "f");
        }
        return __classPrivateFieldGet(this, _TextEditor_pendingState, "f");
    }
    set state(state) {
        if (__classPrivateFieldGet(this, _TextEditor_pendingState, "f") === state) {
            return;
        }
        __classPrivateFieldSet(this, _TextEditor_pendingState, state, "f");
        if (__classPrivateFieldGet(this, _TextEditor_activeEditor, "f")) {
            __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").setState(state);
            __classPrivateFieldGet(this, _TextEditor_instances, "m", _TextEditor_ensureSettingListeners).call(this);
        }
    }
    scrollEventHandledToSaveScrollPositionForTest() {
    }
    connectedCallback() {
        if (!__classPrivateFieldGet(this, _TextEditor_activeEditor, "f")) {
            __classPrivateFieldGet(this, _TextEditor_instances, "m", _TextEditor_createEditor).call(this);
        }
        else {
            __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").dispatch({ effects: __classPrivateFieldGet(this, _TextEditor_lastScrollSnapshot, "f") });
        }
    }
    disconnectedCallback() {
        if (__classPrivateFieldGet(this, _TextEditor_activeEditor, "f")) {
            __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").dispatch({ effects: clearHighlightedLine.of(null) });
            __classPrivateFieldSet(this, _TextEditor_pendingState, __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").state, "f");
            __classPrivateFieldGet(this, _TextEditor_devtoolsResizeObserver, "f").disconnect();
            window.removeEventListener('resize', __classPrivateFieldGet(this, _TextEditor_resizeListener, "f"));
            __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").destroy();
            __classPrivateFieldSet(this, _TextEditor_activeEditor, undefined, "f");
            __classPrivateFieldGet(this, _TextEditor_instances, "m", _TextEditor_ensureSettingListeners).call(this);
        }
    }
    focus() {
        if (__classPrivateFieldGet(this, _TextEditor_activeEditor, "f")) {
            __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").focus();
        }
    }
    revealPosition(selection, highlight = true) {
        const view = __classPrivateFieldGet(this, _TextEditor_activeEditor, "f");
        if (!view) {
            return;
        }
        const line = view.state.doc.lineAt(selection.main.head);
        const effects = [];
        if (highlight) {
            // Lazily register the highlight line state.
            if (!view.state.field(highlightedLineState, false)) {
                view.dispatch({ effects: CodeMirror.StateEffect.appendConfig.of(highlightedLineState) });
            }
            else {
                // Always clear the previous highlight line first. This cannot be done
                // in combination with the other effects, as it wouldn't restart the CSS
                // highlight line animation.
                view.dispatch({ effects: clearHighlightedLine.of(null) });
            }
            // Here we finally start the actual highlight line effects.
            effects.push(setHighlightedLine.of(line.from));
        }
        const editorRect = view.scrollDOM.getBoundingClientRect();
        const targetPos = view.coordsAtPos(selection.main.head);
        if (!selection.main.empty) {
            // If the caller provided an actual range, we use the default 'nearest' on both axis.
            // Otherwise we 'center' on an axis to provide more context around the single point.
            effects.push(CodeMirror.EditorView.scrollIntoView(selection.main));
        }
        else if (!targetPos || targetPos.top < editorRect.top || targetPos.bottom > editorRect.bottom) {
            effects.push(CodeMirror.EditorView.scrollIntoView(selection.main, { y: 'center' }));
        }
        else if (targetPos.left < editorRect.left || targetPos.right > editorRect.right) {
            effects.push(CodeMirror.EditorView.scrollIntoView(selection.main, { x: 'center' }));
        }
        view.dispatch({
            selection,
            effects,
            userEvent: 'select.reveal',
        });
    }
    createSelection(head, anchor) {
        const { doc } = this.state;
        const headPos = toOffset(doc, head);
        return CodeMirror.EditorSelection.single(anchor ? toOffset(doc, anchor) : headPos, headPos);
    }
    toLineColumn(pos) {
        return toLineColumn(this.state.doc, pos);
    }
    toOffset(pos) {
        return toOffset(this.state.doc, pos);
    }
}
_TextEditor_shadow = new WeakMap(), _TextEditor_activeEditor = new WeakMap(), _TextEditor_dynamicSettings = new WeakMap(), _TextEditor_activeSettingListeners = new WeakMap(), _TextEditor_pendingState = new WeakMap(), _TextEditor_lastScrollSnapshot = new WeakMap(), _TextEditor_resizeTimeout = new WeakMap(), _TextEditor_resizeListener = new WeakMap(), _TextEditor_devtoolsResizeObserver = new WeakMap(), _TextEditor_instances = new WeakSet(), _TextEditor_createEditor = function _TextEditor_createEditor() {
    __classPrivateFieldSet(this, _TextEditor_activeEditor, new CodeMirror.EditorView({
        state: this.state,
        parent: __classPrivateFieldGet(this, _TextEditor_shadow, "f"),
        root: __classPrivateFieldGet(this, _TextEditor_shadow, "f"),
        dispatch: (tr, view) => {
            view.update([tr]);
            __classPrivateFieldGet(this, _TextEditor_instances, "m", _TextEditor_maybeDispatchInput).call(this, tr);
            if (tr.reconfigured) {
                __classPrivateFieldGet(this, _TextEditor_instances, "m", _TextEditor_ensureSettingListeners).call(this);
            }
        },
        scrollTo: __classPrivateFieldGet(this, _TextEditor_lastScrollSnapshot, "f"),
    }), "f");
    __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").scrollDOM.addEventListener('scroll', () => {
        if (!__classPrivateFieldGet(this, _TextEditor_activeEditor, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _TextEditor_lastScrollSnapshot, __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").scrollSnapshot(), "f");
        this.scrollEventHandledToSaveScrollPositionForTest();
    });
    __classPrivateFieldGet(this, _TextEditor_instances, "m", _TextEditor_ensureSettingListeners).call(this);
    __classPrivateFieldGet(this, _TextEditor_instances, "m", _TextEditor_startObservingResize).call(this);
    ThemeSupport.ThemeSupport.instance().addEventListener(ThemeSupport.ThemeChangeEvent.eventName, () => {
        const currentTheme = ThemeSupport.ThemeSupport.instance().themeName() === 'dark' ? dummyDarkTheme : [];
        this.editor.dispatch({
            effects: themeSelection.reconfigure(currentTheme),
        });
    });
    return __classPrivateFieldGet(this, _TextEditor_activeEditor, "f");
}, _TextEditor_ensureSettingListeners = function _TextEditor_ensureSettingListeners() {
    const dynamicSettings = __classPrivateFieldGet(this, _TextEditor_activeEditor, "f") ?
        __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").state.facet(dynamicSetting) :
        DynamicSetting.none;
    if (dynamicSettings === __classPrivateFieldGet(this, _TextEditor_dynamicSettings, "f")) {
        return;
    }
    __classPrivateFieldSet(this, _TextEditor_dynamicSettings, dynamicSettings, "f");
    for (const [setting, listener] of __classPrivateFieldGet(this, _TextEditor_activeSettingListeners, "f")) {
        setting.removeChangeListener(listener);
    }
    __classPrivateFieldSet(this, _TextEditor_activeSettingListeners, [], "f");
    for (const dynamicSetting of dynamicSettings) {
        const handler = ({ data }) => {
            const change = dynamicSetting.sync(this.state, data);
            if (change && __classPrivateFieldGet(this, _TextEditor_activeEditor, "f")) {
                __classPrivateFieldGet(this, _TextEditor_activeEditor, "f").dispatch({ effects: change });
            }
        };
        const setting = Common.Settings.Settings.instance().moduleSetting(dynamicSetting.settingName);
        setting.addChangeListener(handler);
        __classPrivateFieldGet(this, _TextEditor_activeSettingListeners, "f").push([setting, handler]);
    }
}, _TextEditor_startObservingResize = function _TextEditor_startObservingResize() {
    const devtoolsElement = WindowBoundsService.WindowBoundsService.WindowBoundsServiceImpl.instance().getDevToolsBoundingElement();
    if (devtoolsElement) {
        __classPrivateFieldGet(this, _TextEditor_devtoolsResizeObserver, "f").observe(devtoolsElement);
    }
    window.addEventListener('resize', __classPrivateFieldGet(this, _TextEditor_resizeListener, "f"));
}, _TextEditor_maybeDispatchInput = function _TextEditor_maybeDispatchInput(transaction) {
    const userEvent = transaction.annotation(CodeMirror.Transaction.userEvent);
    const inputType = userEvent ? CODE_MIRROR_USER_EVENT_TO_INPUT_EVENT_TYPE.get(userEvent) : null;
    if (inputType) {
        this.dispatchEvent(new InputEvent('input', { inputType }));
    }
};
customElements.define('devtools-text-editor', TextEditor);
// Line highlighting
const clearHighlightedLine = CodeMirror.StateEffect.define();
const setHighlightedLine = CodeMirror.StateEffect.define();
const highlightedLineState = CodeMirror.StateField.define({
    create: () => CodeMirror.Decoration.none,
    update(value, tr) {
        if (!tr.changes.empty && value.size) {
            value = value.map(tr.changes);
        }
        for (const effect of tr.effects) {
            if (effect.is(clearHighlightedLine)) {
                value = CodeMirror.Decoration.none;
            }
            else if (effect.is(setHighlightedLine)) {
                value = CodeMirror.Decoration.set([
                    CodeMirror.Decoration.line({ attributes: { class: 'cm-highlightedLine' } }).range(effect.value),
                ]);
            }
        }
        return value;
    },
    provide: field => CodeMirror.EditorView.decorations.from(field, value => value),
});
const CODE_MIRROR_USER_EVENT_TO_INPUT_EVENT_TYPE = new Map([
    ['input.type', 'insertText'],
    ['input.type.compose', 'insertCompositionText'],
    ['input.paste', 'insertFromPaste'],
    ['input.drop', 'insertFromDrop'],
    ['input.complete', 'insertReplacementText'],
    ['delete.selection', 'deleteContent'],
    ['delete.forward', 'deleteContentForward'],
    ['delete.backward', 'deleteContentBackward'],
    ['delete.cut', 'deleteByCut'],
    ['move.drop', 'deleteByDrag'],
    ['undo', 'historyUndo'],
    ['redo', 'historyRedo'],
]);
//# sourceMappingURL=TextEditor.js.map