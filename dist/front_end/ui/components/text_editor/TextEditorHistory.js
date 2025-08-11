// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _TextEditorHistory_editor, _TextEditorHistory_history;
import * as CodeMirror from '../../../third_party/codemirror.next/codemirror.next.js';
export var Direction;
(function (Direction) {
    Direction[Direction["FORWARD"] = 1] = "FORWARD";
    Direction[Direction["BACKWARD"] = -1] = "BACKWARD";
})(Direction || (Direction = {}));
/**
 * Small helper class that connects a `TextEditor` and an `AutocompleteHistory`
 * instance.
 */
export class TextEditorHistory {
    constructor(editor, history) {
        _TextEditorHistory_editor.set(this, void 0);
        _TextEditorHistory_history.set(this, void 0);
        __classPrivateFieldSet(this, _TextEditorHistory_editor, editor, "f");
        __classPrivateFieldSet(this, _TextEditorHistory_history, history, "f");
    }
    /**
     * Replaces the text editor content with entries from the history. Does nothing
     * if the cursor is not positioned correctly (unless `force` is `true`).
     */
    moveHistory(dir, force = false) {
        const { editor } = __classPrivateFieldGet(this, _TextEditorHistory_editor, "f"), { main } = editor.state.selection;
        const isBackward = dir === -1 /* Direction.BACKWARD */;
        if (!force) {
            if (!main.empty) {
                return false;
            }
            const cursorCoords = editor.coordsAtPos(main.head);
            const endCoords = editor.coordsAtPos(isBackward ? 0 : editor.state.doc.length);
            // Check if there are wrapped lines in this direction, and let
            // the cursor move normally if there are.
            if (cursorCoords && endCoords &&
                (isBackward ? cursorCoords.top > endCoords.top + 5 : cursorCoords.bottom < endCoords.bottom - 5)) {
                return false;
            }
        }
        const text = editor.state.doc.toString();
        const history = __classPrivateFieldGet(this, _TextEditorHistory_history, "f");
        const newText = isBackward ? history.previous(text) : history.next();
        if (newText === undefined) {
            return false;
        }
        // Change the prompt input to the history content, and scroll to the end to
        // bring the full content (potentially multiple lines) into view.
        const cursorPos = newText.length;
        editor.dispatch({
            changes: { from: 0, to: editor.state.doc.length, insert: newText },
            selection: CodeMirror.EditorSelection.cursor(cursorPos),
            scrollIntoView: true,
        });
        if (isBackward) {
            // If we are going back in history, put the cursor to the end of the first line
            // so that the user can quickly go further back in history.
            const firstLineBreak = newText.search(/\n|$/);
            editor.dispatch({
                selection: CodeMirror.EditorSelection.cursor(firstLineBreak),
            });
        }
        return true;
    }
    historyCompletions(context) {
        const { explicit, pos, state } = context;
        const text = state.doc.toString();
        const caretIsAtEndOfPrompt = pos === text.length;
        if (!caretIsAtEndOfPrompt || (!text.length && !explicit)) {
            return null;
        }
        const matchingEntries = __classPrivateFieldGet(this, _TextEditorHistory_history, "f").matchingEntries(text);
        if (!matchingEntries.size) {
            return null;
        }
        const options = [...matchingEntries].map(label => ({ label, type: 'secondary', boost: -1e5 }));
        return { from: 0, to: text.length, options };
    }
}
_TextEditorHistory_editor = new WeakMap(), _TextEditorHistory_history = new WeakMap();
//# sourceMappingURL=TextEditorHistory.js.map