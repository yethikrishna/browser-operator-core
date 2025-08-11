// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
import * as CodeMirror from '../../../third_party/codemirror.next/codemirror.next.js';
/**
 * The CodeMirror effect used to change the highlighted execution position.
 *
 * Usage:
 * ```js
 * view.dispatch({effects: setHighlightedPosition.of(position)});
 * ```
 */
export const setHighlightedPosition = CodeMirror.StateEffect.define();
/**
 * The CodeMirror effect used to clear the highlighted execution position.
 *
 * Usage:
 * ```js
 * view.dispatch({effects: clearHighlightedPosition.of()});
 * ```
 */
export const clearHighlightedPosition = CodeMirror.StateEffect.define();
/**
 * Constructs a CodeMirror extension that can be used to decorate the current execution
 * line (and token), for example when the debugger is paused, with specific CSS classes.
 *
 * @param executionLineClassName The CSS class name to use for decorating the execution line (e.g. `'cm-executionLine'`).
 * @param executionTokenClassName The CSS class name to use for decorating the execution token (e.g. `'cm-executionToken'`).
 *
 * @returns a CodeMirror extension that highlights the current execution line and token when set.
 */
export function positionHighlighter(executionLineClassName, executionTokenClassName) {
    var _PositionHighlighter_instances, _PositionHighlighter_computeDecorations;
    const executionLine = CodeMirror.Decoration.line({ attributes: { class: executionLineClassName } });
    const executionToken = CodeMirror.Decoration.mark({ attributes: { class: executionTokenClassName } });
    const positionHighlightedState = CodeMirror.StateField.define({
        create() {
            return null;
        },
        update(pos, tr) {
            if (pos) {
                pos = tr.changes.mapPos(pos, -1, CodeMirror.MapMode.TrackDel);
            }
            for (const effect of tr.effects) {
                if (effect.is(clearHighlightedPosition)) {
                    pos = null;
                }
                else if (effect.is(setHighlightedPosition)) {
                    pos = Math.max(0, Math.min(effect.value, tr.newDoc.length - 1));
                }
            }
            return pos;
        },
    });
    function getHighlightedPosition(state) {
        return state.field(positionHighlightedState);
    }
    class PositionHighlighter {
        constructor({ state }) {
            _PositionHighlighter_instances.add(this);
            this.tree = CodeMirror.syntaxTree(state);
            this.decorations = __classPrivateFieldGet(this, _PositionHighlighter_instances, "m", _PositionHighlighter_computeDecorations).call(this, state, getHighlightedPosition(state));
        }
        update(update) {
            const tree = CodeMirror.syntaxTree(update.state);
            const position = getHighlightedPosition(update.state);
            const positionChanged = position !== getHighlightedPosition(update.startState);
            if (tree.length !== this.tree.length || positionChanged) {
                this.tree = tree;
                this.decorations = __classPrivateFieldGet(this, _PositionHighlighter_instances, "m", _PositionHighlighter_computeDecorations).call(this, update.state, position);
            }
            else {
                this.decorations = this.decorations.map(update.changes);
            }
        }
    }
    _PositionHighlighter_instances = new WeakSet(), _PositionHighlighter_computeDecorations = function _PositionHighlighter_computeDecorations(state, position) {
        const builder = new CodeMirror.RangeSetBuilder();
        if (position !== null) {
            const { doc } = state;
            const line = doc.lineAt(position);
            builder.add(line.from, line.from, executionLine);
            const syntaxTree = CodeMirror.syntaxTree(state);
            const syntaxNode = syntaxTree.resolveInner(position, 1);
            const tokenEnd = Math.min(line.to, syntaxNode.to);
            if (tokenEnd > position) {
                builder.add(position, tokenEnd, executionToken);
            }
        }
        return builder.finish();
    };
    const positionHighlighterSpec = {
        decorations: ({ decorations }) => decorations,
    };
    return [
        positionHighlightedState,
        CodeMirror.ViewPlugin.fromClass(PositionHighlighter, positionHighlighterSpec),
    ];
}
//# sourceMappingURL=ExecutionPositionHighlighter.js.map