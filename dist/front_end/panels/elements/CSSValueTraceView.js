// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _CSSValueTraceView_instances, _CSSValueTraceView_highlighting, _CSSValueTraceView_view, _CSSValueTraceView_evaluations, _CSSValueTraceView_substitutions, _CSSValueTraceView_pendingFocus, _CSSValueTraceView_showTrace;
import * as Lit from '../../third_party/lit/lit.js';
import * as UI from '../../ui/legacy/legacy.js';
import cssValueTraceViewStyles from './cssValueTraceView.css.js';
import { Highlighting, Renderer, RenderingContext, TracingContext, } from './PropertyRenderer.js';
import stylePropertiesTreeOutlineStyles from './stylePropertiesTreeOutline.css.js';
const { html, render, Directives: { classMap, ifDefined } } = Lit;
function defaultView(input, output, target) {
    const substitutions = [...input.substitutions];
    const evaluations = [...input.evaluations];
    const finalResult = evaluations.pop() ?? substitutions.pop();
    const [firstEvaluation, ...intermediateEvaluations] = evaluations;
    const hiddenSummary = !firstEvaluation || intermediateEvaluations.length === 0;
    const summaryTabIndex = hiddenSummary ? undefined : 0;
    const singleResult = evaluations.length === 0 && substitutions.length === 0;
    // clang-format off
    render(html `
      <div role=dialog class="css-value-trace monospace" @keydown=${onKeyDown}>
        ${substitutions.map(line => html `
          <span class="trace-line-icon" aria-label="is equal to">↳</span>
          <span class="trace-line">${line}</span>`)}
        ${firstEvaluation && intermediateEvaluations.length === 0 ? html `
          <span class="trace-line-icon" aria-label="is equal to">↳</span>
          <span class="trace-line">${firstEvaluation}</span>`
        : html `
          <details @toggle=${input.onToggle} ?hidden=${hiddenSummary}>
            <summary tabindex=${ifDefined(summaryTabIndex)}>
              <span class="trace-line-icon" aria-label="is equal to">↳</span>
              <devtools-icon class="marker"></devtools-icon>
              <span class="trace-line">${firstEvaluation}</span>
            </summary>
            <div>
              ${intermediateEvaluations.map(evaluation => html `
                  <span class="trace-line-icon" aria-label="is equal to" >↳</span>
                  <span class="trace-line">${evaluation}</span>`)}
            </div>
          </details>`}
        ${finalResult ? html `
          <span class="trace-line-icon" aria-label="is equal to" ?hidden=${singleResult}>↳</span>
          <span class=${classMap({ 'trace-line': true, 'full-row': singleResult })}>
            ${finalResult}
          </span>` : ''}
      </div>`, target);
    // clang-format on
    function onKeyDown(e) {
        // prevent styles-tab keyboard navigation
        if (!e.altKey) {
            if (e.key.startsWith('Arrow') || e.key === ' ' || e.key === 'Enter') {
                e.consume();
            }
        }
        // Capture tab focus within
        if (e.key === 'Tab') {
            const tabstops = this.querySelectorAll('[tabindex]') ?? [];
            const firstTabStop = tabstops[0];
            const lastTabStop = tabstops[tabstops.length - 1];
            if (e.target === lastTabStop && !e.shiftKey) {
                e.consume(true);
                if (firstTabStop instanceof HTMLElement) {
                    firstTabStop.focus();
                }
            }
            if (e.target === firstTabStop && e.shiftKey) {
                e.consume(true);
                if (lastTabStop instanceof HTMLElement) {
                    lastTabStop.focus();
                }
            }
        }
    }
}
export class CSSValueTraceView extends UI.Widget.VBox {
    constructor(element, view = defaultView) {
        super(true, false, element);
        _CSSValueTraceView_instances.add(this);
        _CSSValueTraceView_highlighting.set(this, void 0);
        _CSSValueTraceView_view.set(this, void 0);
        _CSSValueTraceView_evaluations.set(this, []);
        _CSSValueTraceView_substitutions.set(this, []);
        _CSSValueTraceView_pendingFocus.set(this, false);
        this.registerRequiredCSS(cssValueTraceViewStyles, stylePropertiesTreeOutlineStyles);
        __classPrivateFieldSet(this, _CSSValueTraceView_view, view, "f");
        this.requestUpdate();
    }
    async showTrace(property, subexpression, matchedStyles, computedStyles, renderers, expandPercentagesInShorthands, shorthandPositionOffset, focus) {
        const matchedResult = subexpression === null ?
            property.parseValue(matchedStyles, computedStyles) :
            property.parseExpression(subexpression, matchedStyles, computedStyles);
        if (!matchedResult) {
            return undefined;
        }
        return await __classPrivateFieldGet(this, _CSSValueTraceView_instances, "m", _CSSValueTraceView_showTrace).call(this, property, matchedResult, renderers, expandPercentagesInShorthands, shorthandPositionOffset, focus);
    }
    performUpdate() {
        const viewInput = {
            substitutions: __classPrivateFieldGet(this, _CSSValueTraceView_substitutions, "f"),
            evaluations: __classPrivateFieldGet(this, _CSSValueTraceView_evaluations, "f"),
            onToggle: () => this.onResize(),
        };
        __classPrivateFieldGet(this, _CSSValueTraceView_view, "f").call(this, viewInput, {}, this.contentElement);
        const tabStop = this.contentElement.querySelector('[tabindex]');
        this.setDefaultFocusedElement(tabStop);
        if (tabStop && __classPrivateFieldGet(this, _CSSValueTraceView_pendingFocus, "f")) {
            this.focus();
            this.resetPendingFocus();
        }
    }
    resetPendingFocus() {
        __classPrivateFieldSet(this, _CSSValueTraceView_pendingFocus, false, "f");
    }
}
_CSSValueTraceView_highlighting = new WeakMap(), _CSSValueTraceView_view = new WeakMap(), _CSSValueTraceView_evaluations = new WeakMap(), _CSSValueTraceView_substitutions = new WeakMap(), _CSSValueTraceView_pendingFocus = new WeakMap(), _CSSValueTraceView_instances = new WeakSet(), _CSSValueTraceView_showTrace = async function _CSSValueTraceView_showTrace(property, matchedResult, renderers, expandPercentagesInShorthands, shorthandPositionOffset, focus) {
    __classPrivateFieldSet(this, _CSSValueTraceView_highlighting, new Highlighting(), "f");
    const rendererMap = new Map(renderers.map(r => [r.matchType, r]));
    // Compute all trace lines
    // 1st: Apply substitutions for var() functions
    const substitutions = [];
    const evaluations = [];
    const tracing = new TracingContext(__classPrivateFieldGet(this, _CSSValueTraceView_highlighting, "f"), expandPercentagesInShorthands, shorthandPositionOffset, matchedResult);
    while (tracing.nextSubstitution()) {
        const context = new RenderingContext(matchedResult.ast, property, rendererMap, matchedResult, 
        /* cssControls */ undefined, 
        /* options */ {}, tracing);
        substitutions.push(Renderer.render(matchedResult.ast.tree, context).nodes);
    }
    // 2nd: Apply evaluations for calc, min, max, etc.
    const asyncCallbackResults = [];
    while (tracing.nextEvaluation()) {
        const context = new RenderingContext(matchedResult.ast, property, rendererMap, matchedResult, 
        /* cssControls */ undefined, 
        /* options */ {}, tracing);
        evaluations.push(Renderer.render(matchedResult.ast.tree, context).nodes);
        asyncCallbackResults.push(tracing.runAsyncEvaluations());
    }
    __classPrivateFieldSet(this, _CSSValueTraceView_substitutions, substitutions, "f");
    __classPrivateFieldSet(this, _CSSValueTraceView_evaluations, [], "f");
    for (const [index, success] of (await Promise.all(asyncCallbackResults)).entries()) {
        if (success) {
            __classPrivateFieldGet(this, _CSSValueTraceView_evaluations, "f").push(evaluations[index]);
        }
    }
    if (__classPrivateFieldGet(this, _CSSValueTraceView_substitutions, "f").length === 0 && __classPrivateFieldGet(this, _CSSValueTraceView_evaluations, "f").length === 0) {
        const context = new RenderingContext(matchedResult.ast, property, rendererMap, matchedResult);
        __classPrivateFieldGet(this, _CSSValueTraceView_evaluations, "f").push(Renderer.render(matchedResult.ast.tree, context).nodes);
    }
    __classPrivateFieldSet(this, _CSSValueTraceView_pendingFocus, focus, "f");
    this.requestUpdate();
};
//# sourceMappingURL=CSSValueTraceView.js.map