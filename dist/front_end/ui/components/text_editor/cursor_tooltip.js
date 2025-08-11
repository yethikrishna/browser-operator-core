// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
import * as CodeMirror from '../../../third_party/codemirror.next/codemirror.next.js';
export const closeTooltip = CodeMirror.StateEffect.define();
export function cursorTooltip(source) {
    var _instances, _scheduleUpdate, _startUpdate, _a;
    const openTooltip = CodeMirror.StateEffect.define();
    const state = CodeMirror.StateField.define({
        create() {
            return null;
        },
        update(val, tr) {
            if (tr.selection) {
                val = null;
            }
            if (val && !tr.changes.empty) {
                const newPos = tr.changes.mapPos(val.pos, -1, CodeMirror.MapMode.TrackDel);
                val = newPos === null ? null : { pos: newPos, create: val.create, above: true };
            }
            for (const effect of tr.effects) {
                if (effect.is(openTooltip)) {
                    val = { pos: tr.state.selection.main.from, create: effect.value, above: true };
                }
                else if (effect.is(closeTooltip)) {
                    val = null;
                }
            }
            return val;
        },
        provide: field => CodeMirror.showTooltip.from(field),
    });
    const plugin = CodeMirror.ViewPlugin.fromClass((_a = class {
            constructor() {
                _instances.add(this);
                this.pending = -1;
                this.updateID = 0;
            }
            update(update) {
                this.updateID++;
                if (update.transactions.some(tr => tr.selection) && update.state.selection.main.empty) {
                    __classPrivateFieldGet(this, _instances, "m", _scheduleUpdate).call(this, update.view);
                }
            }
        },
        _instances = new WeakSet(),
        _scheduleUpdate = function _scheduleUpdate(view) {
            if (this.pending > -1) {
                clearTimeout(this.pending);
            }
            this.pending = window.setTimeout(() => __classPrivateFieldGet(this, _instances, "m", _startUpdate).call(this, view), 50);
        },
        _startUpdate = function _startUpdate(view) {
            this.pending = -1;
            const { main } = view.state.selection;
            if (main.empty) {
                const { updateID } = this;
                void source(view.state, main.from).then(tooltip => {
                    if (this.updateID !== updateID) {
                        if (this.pending < 0) {
                            __classPrivateFieldGet(this, _instances, "m", _scheduleUpdate).call(this, view);
                        }
                    }
                    else if (tooltip) {
                        view.dispatch({ effects: openTooltip.of(tooltip) });
                    }
                    else {
                        view.dispatch({ effects: closeTooltip.of(null) });
                    }
                });
            }
        },
        _a));
    return [state, plugin];
}
//# sourceMappingURL=cursor_tooltip.js.map