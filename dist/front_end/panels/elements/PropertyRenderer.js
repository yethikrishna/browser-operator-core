// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _Highlighting_instances, _Highlighting_activeHighlights, _Highlighting_nodesForMatches, _Highlighting_matchesForNodes, _Highlighting_registry, _Highlighting_boundOnEnter, _Highlighting_boundOnExit, _Highlighting_nodeRangesHitByMouseEvent, _Highlighting_onEnter, _Highlighting_onExit, _TracingContext_instances, _TracingContext_substitutionDepth, _TracingContext_hasMoreSubstitutions, _TracingContext_parent, _TracingContext_evaluationCount, _TracingContext_appliedEvaluations, _TracingContext_hasMoreEvaluations, _TracingContext_longhandOffset, _TracingContext_highlighting, _TracingContext_parsedValueCache, _TracingContext_root, _TracingContext_propertyName, _TracingContext_asyncEvalCallbacks, _TracingContext_setHasMoreEvaluations, _TracingContext_setAppliedEvaluations, _TracingContext_setHasMoreSubstitutions, _Renderer_matchedResult, _Renderer_output, _Renderer_context;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Components from '../../ui/legacy/components/utils/utils.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { ImagePreviewPopover } from './ImagePreviewPopover.js';
import { unescapeCssString } from './StylesSidebarPane.js';
const UIStrings = {
    /**
     *@description Text that is announced by the screen reader when the user focuses on an input field for entering the name of a CSS property in the Styles panel
     *@example {margin} PH1
     */
    cssPropertyName: '`CSS` property name: {PH1}',
    /**
     *@description Text that is announced by the screen reader when the user focuses on an input field for entering the value of a CSS property in the Styles panel
     *@example {10px} PH1
     */
    cssPropertyValue: '`CSS` property value: {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/PropertyRenderer.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
function mergeWithSpacing(nodes, merge) {
    const result = [...nodes];
    if (SDK.CSSPropertyParser.requiresSpace(nodes, merge)) {
        result.push(document.createTextNode(' '));
    }
    result.push(...merge);
    return result;
}
// A mixin to automatically expose the match type on specific renrerers
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function rendererBase(matchT) {
    class RendererBase {
        constructor() {
            this.matchType = matchT;
        }
        render(_match, _context) {
            return [];
        }
    }
    return RendererBase;
}
// This class implements highlighting for rendered nodes in value traces. On hover, all nodes belonging to the same
// Match (using object identity) are highlighted.
export class Highlighting {
    constructor() {
        _Highlighting_instances.add(this);
        // This holds a stack of active ranges, the top-stack is the currently highlighted set. mouseenter and mouseleave
        // push and pop range sets, respectively.
        _Highlighting_activeHighlights.set(this, []);
        // We hold a bidirectional mapping between nodes and matches. A node can belong to multiple matches when matches are
        // nested (via function arguments for instance).
        _Highlighting_nodesForMatches.set(this, new Map());
        _Highlighting_matchesForNodes.set(this, new Map());
        _Highlighting_registry.set(this, void 0);
        _Highlighting_boundOnEnter.set(this, void 0);
        _Highlighting_boundOnExit.set(this, void 0);
        const registry = CSS.highlights.get(Highlighting.REGISTRY_NAME);
        __classPrivateFieldSet(this, _Highlighting_registry, registry ?? new Highlight(), "f");
        if (!registry) {
            CSS.highlights.set(Highlighting.REGISTRY_NAME, __classPrivateFieldGet(this, _Highlighting_registry, "f"));
        }
        __classPrivateFieldSet(this, _Highlighting_boundOnExit, __classPrivateFieldGet(this, _Highlighting_instances, "m", _Highlighting_onExit).bind(this), "f");
        __classPrivateFieldSet(this, _Highlighting_boundOnEnter, __classPrivateFieldGet(this, _Highlighting_instances, "m", _Highlighting_onEnter).bind(this), "f");
    }
    addMatch(match, nodes) {
        if (nodes.length > 0) {
            const ranges = __classPrivateFieldGet(this, _Highlighting_nodesForMatches, "f").get(match);
            if (ranges) {
                ranges.push(nodes);
            }
            else {
                __classPrivateFieldGet(this, _Highlighting_nodesForMatches, "f").set(match, [nodes]);
            }
        }
        for (const node of nodes) {
            const matches = __classPrivateFieldGet(this, _Highlighting_matchesForNodes, "f").get(node);
            if (matches) {
                matches.push(match);
            }
            else {
                __classPrivateFieldGet(this, _Highlighting_matchesForNodes, "f").set(node, [match]);
            }
            if (node instanceof HTMLElement) {
                node.onmouseenter = __classPrivateFieldGet(this, _Highlighting_boundOnEnter, "f");
                node.onmouseleave = __classPrivateFieldGet(this, _Highlighting_boundOnExit, "f");
                node.onfocus = __classPrivateFieldGet(this, _Highlighting_boundOnEnter, "f");
                node.onblur = __classPrivateFieldGet(this, _Highlighting_boundOnExit, "f");
                node.tabIndex = 0;
            }
        }
    }
}
_Highlighting_activeHighlights = new WeakMap(), _Highlighting_nodesForMatches = new WeakMap(), _Highlighting_matchesForNodes = new WeakMap(), _Highlighting_registry = new WeakMap(), _Highlighting_boundOnEnter = new WeakMap(), _Highlighting_boundOnExit = new WeakMap(), _Highlighting_instances = new WeakSet(), _Highlighting_nodeRangesHitByMouseEvent = function* _Highlighting_nodeRangesHitByMouseEvent(e) {
    for (const node of e.composedPath()) {
        const matches = __classPrivateFieldGet(this, _Highlighting_matchesForNodes, "f").get(node);
        if (matches) {
            for (const match of matches) {
                yield* __classPrivateFieldGet(this, _Highlighting_nodesForMatches, "f").get(match) ?? [];
            }
            break;
        }
    }
}, _Highlighting_onEnter = function _Highlighting_onEnter(e) {
    __classPrivateFieldGet(this, _Highlighting_registry, "f").clear();
    __classPrivateFieldGet(this, _Highlighting_activeHighlights, "f").push([]);
    for (const nodeRange of __classPrivateFieldGet(this, _Highlighting_instances, "m", _Highlighting_nodeRangesHitByMouseEvent).call(this, e)) {
        const range = new Range();
        const begin = nodeRange[0];
        const end = nodeRange[nodeRange.length - 1];
        if (begin.parentNode && end.parentNode) {
            range.setStartBefore(begin);
            range.setEndAfter(end);
            __classPrivateFieldGet(this, _Highlighting_activeHighlights, "f")[__classPrivateFieldGet(this, _Highlighting_activeHighlights, "f").length - 1].push(range);
            __classPrivateFieldGet(this, _Highlighting_registry, "f").add(range);
        }
    }
}, _Highlighting_onExit = function _Highlighting_onExit() {
    __classPrivateFieldGet(this, _Highlighting_registry, "f").clear();
    __classPrivateFieldGet(this, _Highlighting_activeHighlights, "f").pop();
    if (__classPrivateFieldGet(this, _Highlighting_activeHighlights, "f").length > 0) {
        __classPrivateFieldGet(this, _Highlighting_activeHighlights, "f")[__classPrivateFieldGet(this, _Highlighting_activeHighlights, "f").length - 1].forEach(range => __classPrivateFieldGet(this, _Highlighting_registry, "f").add(range));
    }
};
Highlighting.REGISTRY_NAME = 'css-value-tracing';
// This class is used to guide value tracing when passed to the Renderer. Tracing has two phases. First, substitutions
// such as var() are applied step by step. In each step, all vars in the value are replaced by their definition until no
// vars remain. In the second phase, we evaluate other functions such as calc() or min() or color-mix(). Which CSS
// function types are actually substituted or evaluated is not relevant here, rather it is decided by an individual
// MatchRenderer.
//
// Callers don't need to keep track of the tracing depth (i.e., the number of substitution/evaluation steps).
// TracingContext is stateful and keeps track of the depth, so callers can progressively produce steps by calling
// TracingContext#nextSubstitution or TracingContext#nextEvaluation. Calling Renderer with the tracing context will then
// produce the next step of tracing. The tracing depth is passed to the individual MatchRenderers by way of
// TracingContext#substitution or TracingContext#applyEvaluation/TracingContext#evaluation (see function-level comments
// about how these two play together), which MatchRenderers call to request a fresh TracingContext for the next level of
// substitution/evaluation.
export class TracingContext {
    constructor(highlighting, expandPercentagesInShorthands, initialLonghandOffset = 0, matchedResult) {
        _TracingContext_instances.add(this);
        _TracingContext_substitutionDepth.set(this, 0);
        _TracingContext_hasMoreSubstitutions.set(this, void 0);
        _TracingContext_parent.set(this, null);
        _TracingContext_evaluationCount.set(this, 0);
        _TracingContext_appliedEvaluations.set(this, 0);
        _TracingContext_hasMoreEvaluations.set(this, true);
        _TracingContext_longhandOffset.set(this, void 0);
        _TracingContext_highlighting.set(this, void 0);
        _TracingContext_parsedValueCache.set(this, new Map());
        _TracingContext_root.set(this, null);
        _TracingContext_propertyName.set(this, void 0);
        _TracingContext_asyncEvalCallbacks.set(this, []);
        __classPrivateFieldSet(this, _TracingContext_highlighting, highlighting, "f");
        __classPrivateFieldSet(this, _TracingContext_hasMoreSubstitutions, matchedResult?.hasMatches(SDK.CSSPropertyParserMatchers.VariableMatch, SDK.CSSPropertyParserMatchers.BaseVariableMatch) ??
            false, "f");
        __classPrivateFieldSet(this, _TracingContext_propertyName, matchedResult?.ast.propertyName ?? null, "f");
        __classPrivateFieldSet(this, _TracingContext_longhandOffset, initialLonghandOffset, "f");
        this.expandPercentagesInShorthands = expandPercentagesInShorthands;
    }
    get highlighting() {
        return __classPrivateFieldGet(this, _TracingContext_highlighting, "f");
    }
    get root() {
        return __classPrivateFieldGet(this, _TracingContext_root, "f");
    }
    get propertyName() {
        return __classPrivateFieldGet(this, _TracingContext_propertyName, "f");
    }
    get longhandOffset() {
        return __classPrivateFieldGet(this, _TracingContext_longhandOffset, "f");
    }
    renderingContext(context) {
        return new RenderingContext(context.ast, context.property, context.renderers, context.matchedResult, context.cssControls, context.options, this);
    }
    nextSubstitution() {
        var _a;
        if (!__classPrivateFieldGet(this, _TracingContext_hasMoreSubstitutions, "f")) {
            return false;
        }
        __classPrivateFieldSet(this, _TracingContext_substitutionDepth, (_a = __classPrivateFieldGet(this, _TracingContext_substitutionDepth, "f"), _a++, _a), "f");
        __classPrivateFieldSet(this, _TracingContext_hasMoreSubstitutions, false, "f");
        __classPrivateFieldSet(this, _TracingContext_asyncEvalCallbacks, [], "f");
        return true;
    }
    nextEvaluation() {
        var _a;
        if (__classPrivateFieldGet(this, _TracingContext_hasMoreSubstitutions, "f")) {
            throw new Error('Need to apply substitutions first');
        }
        if (!__classPrivateFieldGet(this, _TracingContext_hasMoreEvaluations, "f")) {
            return false;
        }
        __classPrivateFieldSet(this, _TracingContext_appliedEvaluations, 0, "f");
        __classPrivateFieldSet(this, _TracingContext_hasMoreEvaluations, false, "f");
        __classPrivateFieldSet(this, _TracingContext_evaluationCount, (_a = __classPrivateFieldGet(this, _TracingContext_evaluationCount, "f"), _a++, _a), "f");
        __classPrivateFieldSet(this, _TracingContext_asyncEvalCallbacks, [], "f");
        return true;
    }
    // Evaluations are applied bottom up, i.e., innermost sub-expressions are evaluated first before evaluating any
    // function call. This function produces TracingContexts for each of the arguments of the function call which should
    // be passed to the Renderer calls for the respective subtrees.
    evaluation(args, root = null) {
        const childContexts = args.map(() => {
            const child = new TracingContext(__classPrivateFieldGet(this, _TracingContext_highlighting, "f"), this.expandPercentagesInShorthands);
            __classPrivateFieldSet(child, _TracingContext_parent, this, "f");
            __classPrivateFieldSet(child, _TracingContext_substitutionDepth, __classPrivateFieldGet(this, _TracingContext_substitutionDepth, "f"), "f");
            __classPrivateFieldSet(child, _TracingContext_evaluationCount, __classPrivateFieldGet(this, _TracingContext_evaluationCount, "f"), "f");
            __classPrivateFieldSet(child, _TracingContext_hasMoreSubstitutions, __classPrivateFieldGet(this, _TracingContext_hasMoreSubstitutions, "f"), "f");
            __classPrivateFieldSet(child, _TracingContext_parsedValueCache, __classPrivateFieldGet(this, _TracingContext_parsedValueCache, "f"), "f");
            __classPrivateFieldSet(child, _TracingContext_root, root, "f");
            __classPrivateFieldSet(child, _TracingContext_propertyName, this.propertyName, "f");
            return child;
        });
        return childContexts;
    }
    // After rendering the arguments of a function call, the TracingContext produced by TracingContext#evaluation need to
    // be passed here to determine whether the "current" function call should be evaluated or not. If so, the
    // evaluation callback is run. The callback should return synchronously an array of Nodes as placeholder to be
    // rendered immediately and optionally a callback for asynchronous updates of the placeholder nodes. The callback
    // returns a boolean indicating whether the update was successful or not.
    applyEvaluation(children, evaluation) {
        if (__classPrivateFieldGet(this, _TracingContext_evaluationCount, "f") === 0 || children.some(child => __classPrivateFieldGet(child, _TracingContext_appliedEvaluations, "f") >= __classPrivateFieldGet(this, _TracingContext_evaluationCount, "f"))) {
            __classPrivateFieldGet(this, _TracingContext_instances, "m", _TracingContext_setHasMoreEvaluations).call(this, true);
            children.forEach(child => __classPrivateFieldGet(this, _TracingContext_asyncEvalCallbacks, "f").push(...__classPrivateFieldGet(child, _TracingContext_asyncEvalCallbacks, "f")));
            return null;
        }
        __classPrivateFieldGet(this, _TracingContext_instances, "m", _TracingContext_setAppliedEvaluations).call(this, children.map(child => __classPrivateFieldGet(child, _TracingContext_appliedEvaluations, "f")).reduce((a, b) => Math.max(a, b), 0) + 1);
        const { placeholder, asyncEvalCallback } = evaluation();
        __classPrivateFieldGet(this, _TracingContext_asyncEvalCallbacks, "f").push(asyncEvalCallback);
        return placeholder;
    }
    // Request a tracing context for the next level of substitutions. If this returns null, no further substitution should
    // be applied on this branch of the AST. Otherwise, the TracingContext should be passed to the Renderer call for the
    // substitution subtree.
    substitution(root = null) {
        if (__classPrivateFieldGet(this, _TracingContext_substitutionDepth, "f") <= 0) {
            __classPrivateFieldGet(this, _TracingContext_instances, "m", _TracingContext_setHasMoreSubstitutions).call(this);
            return null;
        }
        const child = new TracingContext(__classPrivateFieldGet(this, _TracingContext_highlighting, "f"), this.expandPercentagesInShorthands);
        __classPrivateFieldSet(child, _TracingContext_parent, this, "f");
        __classPrivateFieldSet(child, _TracingContext_substitutionDepth, __classPrivateFieldGet(this, _TracingContext_substitutionDepth, "f") - 1, "f");
        __classPrivateFieldSet(child, _TracingContext_evaluationCount, __classPrivateFieldGet(this, _TracingContext_evaluationCount, "f"), "f");
        __classPrivateFieldSet(child, _TracingContext_hasMoreSubstitutions, false, "f");
        __classPrivateFieldSet(child, _TracingContext_parsedValueCache, __classPrivateFieldGet(this, _TracingContext_parsedValueCache, "f"), "f");
        __classPrivateFieldSet(child, _TracingContext_root, root, "f");
        // Async evaluation callbacks need to be gathered across substitution contexts so that they bubble to the root. That
        // is not the case for evaluation contexts since `applyEvaluation` conditionally collects callbacks for its subtree
        // already.
        __classPrivateFieldSet(child, _TracingContext_asyncEvalCallbacks, __classPrivateFieldGet(this, _TracingContext_asyncEvalCallbacks, "f"), "f");
        __classPrivateFieldSet(child, _TracingContext_longhandOffset, __classPrivateFieldGet(this, _TracingContext_longhandOffset, "f") + (root?.context.matchedResult.getComputedLonghandName(root?.match.node) ?? 0), "f");
        __classPrivateFieldSet(child, _TracingContext_propertyName, this.propertyName, "f");
        return child;
    }
    cachedParsedValue(declaration, matchedStyles, computedStyles) {
        const cachedValue = __classPrivateFieldGet(this, _TracingContext_parsedValueCache, "f").get(declaration);
        if (cachedValue?.matchedStyles === matchedStyles && cachedValue?.computedStyles === computedStyles) {
            return cachedValue.parsedValue;
        }
        const parsedValue = declaration.parseValue(matchedStyles, computedStyles);
        __classPrivateFieldGet(this, _TracingContext_parsedValueCache, "f").set(declaration, { matchedStyles, computedStyles, parsedValue });
        return parsedValue;
    }
    // If this returns `false`, all evaluations for this trace line have failed.
    async runAsyncEvaluations() {
        const results = await Promise.all(__classPrivateFieldGet(this, _TracingContext_asyncEvalCallbacks, "f").map(callback => callback?.()));
        return results.some(result => result !== false);
    }
}
_TracingContext_substitutionDepth = new WeakMap(), _TracingContext_hasMoreSubstitutions = new WeakMap(), _TracingContext_parent = new WeakMap(), _TracingContext_evaluationCount = new WeakMap(), _TracingContext_appliedEvaluations = new WeakMap(), _TracingContext_hasMoreEvaluations = new WeakMap(), _TracingContext_longhandOffset = new WeakMap(), _TracingContext_highlighting = new WeakMap(), _TracingContext_parsedValueCache = new WeakMap(), _TracingContext_root = new WeakMap(), _TracingContext_propertyName = new WeakMap(), _TracingContext_asyncEvalCallbacks = new WeakMap(), _TracingContext_instances = new WeakSet(), _TracingContext_setHasMoreEvaluations = function _TracingContext_setHasMoreEvaluations(value) {
    var _a;
    if (__classPrivateFieldGet(this, _TracingContext_parent, "f")) {
        __classPrivateFieldGet((_a = __classPrivateFieldGet(this, _TracingContext_parent, "f")), _TracingContext_instances, "m", _TracingContext_setHasMoreEvaluations).call(_a, value);
    }
    __classPrivateFieldSet(this, _TracingContext_hasMoreEvaluations, value, "f");
}, _TracingContext_setAppliedEvaluations = function _TracingContext_setAppliedEvaluations(value) {
    var _a;
    if (__classPrivateFieldGet(this, _TracingContext_parent, "f")) {
        __classPrivateFieldGet((_a = __classPrivateFieldGet(this, _TracingContext_parent, "f")), _TracingContext_instances, "m", _TracingContext_setAppliedEvaluations).call(_a, value);
    }
    __classPrivateFieldSet(this, _TracingContext_appliedEvaluations, Math.max(__classPrivateFieldGet(this, _TracingContext_appliedEvaluations, "f"), value), "f");
}, _TracingContext_setHasMoreSubstitutions = function _TracingContext_setHasMoreSubstitutions() {
    var _a;
    if (__classPrivateFieldGet(this, _TracingContext_parent, "f")) {
        __classPrivateFieldGet((_a = __classPrivateFieldGet(this, _TracingContext_parent, "f")), _TracingContext_instances, "m", _TracingContext_setHasMoreSubstitutions).call(_a);
    }
    __classPrivateFieldSet(this, _TracingContext_hasMoreSubstitutions, true, "f");
};
export class RenderingContext {
    constructor(ast, property, renderers, matchedResult, cssControls, options = {}, tracing) {
        this.ast = ast;
        this.property = property;
        this.renderers = renderers;
        this.matchedResult = matchedResult;
        this.cssControls = cssControls;
        this.options = options;
        this.tracing = tracing;
    }
    addControl(cssType, control) {
        if (this.cssControls) {
            const controls = this.cssControls.get(cssType);
            if (!controls) {
                this.cssControls.set(cssType, [control]);
            }
            else {
                controls.push(control);
            }
        }
    }
    getComputedLonghandName(node) {
        if (!this.matchedResult.ast.propertyName) {
            return null;
        }
        const longhands = SDK.CSSMetadata.cssMetadata().getLonghands(this.tracing?.propertyName ?? this.matchedResult.ast.propertyName);
        if (!longhands) {
            return null;
        }
        const index = this.matchedResult.getComputedLonghandName(node);
        return longhands[index + (this.tracing?.longhandOffset ?? 0)] ?? null;
    }
    findParent(node, matchType) {
        while (node) {
            const match = this.matchedResult.getMatch(node);
            if (match instanceof matchType) {
                return match;
            }
            node = node.parent;
        }
        if (this.tracing?.root) {
            return this.tracing.root.context.findParent(this.tracing.root.match.node, matchType);
        }
        return null;
    }
}
export class Renderer extends SDK.CSSPropertyParser.TreeWalker {
    constructor(ast, property, renderers, matchedResult, cssControls, options, tracing) {
        super(ast);
        _Renderer_matchedResult.set(this, void 0);
        _Renderer_output.set(this, []);
        _Renderer_context.set(this, void 0);
        __classPrivateFieldSet(this, _Renderer_matchedResult, matchedResult, "f");
        __classPrivateFieldSet(this, _Renderer_context, new RenderingContext(this.ast, property, renderers, __classPrivateFieldGet(this, _Renderer_matchedResult, "f"), cssControls, options, tracing), "f");
    }
    static render(nodeOrNodes, context) {
        if (!Array.isArray(nodeOrNodes)) {
            return this.render([nodeOrNodes], context);
        }
        const cssControls = new SDK.CSSPropertyParser.CSSControlMap();
        const renderers = nodeOrNodes.map(node => this.walkExcludingSuccessors(context.ast.subtree(node), context.property, context.renderers, context.matchedResult, cssControls, context.options, context.tracing));
        const nodes = renderers.map(node => __classPrivateFieldGet(node, _Renderer_output, "f")).reduce(mergeWithSpacing, []);
        return { nodes, cssControls };
    }
    static renderInto(nodeOrNodes, context, parent) {
        const { nodes, cssControls } = this.render(nodeOrNodes, context);
        if (parent.lastChild && SDK.CSSPropertyParser.requiresSpace([parent.lastChild], nodes)) {
            parent.appendChild(document.createTextNode(' '));
        }
        nodes.map(n => parent.appendChild(n));
        return { nodes, cssControls };
    }
    renderedMatchForTest(_nodes, _match) {
    }
    enter({ node }) {
        const match = __classPrivateFieldGet(this, _Renderer_matchedResult, "f").getMatch(node);
        const renderer = match &&
            __classPrivateFieldGet(this, _Renderer_context, "f").renderers.get(match.constructor);
        if (renderer || match instanceof SDK.CSSPropertyParserMatchers.TextMatch) {
            const output = renderer ? renderer.render(match, __classPrivateFieldGet(this, _Renderer_context, "f")) :
                match.render();
            __classPrivateFieldGet(this, _Renderer_context, "f").tracing?.highlighting.addMatch(match, output);
            this.renderedMatchForTest(output, match);
            __classPrivateFieldSet(this, _Renderer_output, mergeWithSpacing(__classPrivateFieldGet(this, _Renderer_output, "f"), output), "f");
            return false;
        }
        return true;
    }
    static renderNameElement(name) {
        const nameElement = document.createElement('span');
        nameElement.setAttribute('jslog', `${VisualLogging.key().track({
            change: true,
            keydown: 'ArrowLeft|ArrowUp|PageUp|Home|PageDown|ArrowRight|ArrowDown|End|Space|Tab|Enter|Escape',
        })}`);
        UI.ARIAUtils.setLabel(nameElement, i18nString(UIStrings.cssPropertyName, { PH1: name }));
        nameElement.className = 'webkit-css-property';
        nameElement.textContent = name;
        nameElement.normalize();
        nameElement.tabIndex = -1;
        return nameElement;
    }
    // This function renders a property value as HTML, customizing the presentation with a set of given AST matchers. This
    // comprises the following steps:
    // 1. Build an AST of the property.
    // 2. Apply tree matchers during bottom up traversal.
    // 3. Render the value from left to right into HTML, deferring rendering of matched subtrees to the matchers
    //
    // More general, longer matches take precedence over shorter, more specific matches. Whitespaces are normalized, for
    // unmatched text and around rendered matching results.
    static renderValueElement(property, matchedResult, renderers, tracing) {
        const valueElement = document.createElement('span');
        valueElement.setAttribute('jslog', `${VisualLogging.value().track({
            change: true,
            keydown: 'ArrowLeft|ArrowUp|PageUp|Home|PageDown|ArrowRight|ArrowDown|End|Space|Tab|Enter|Escape',
        })}`);
        UI.ARIAUtils.setLabel(valueElement, i18nString(UIStrings.cssPropertyValue, { PH1: property.value }));
        valueElement.className = 'value';
        valueElement.tabIndex = -1;
        const { nodes, cssControls } = this.renderValueNodes(property, matchedResult, renderers, tracing);
        nodes.forEach(node => valueElement.appendChild(node));
        valueElement.normalize();
        return { valueElement, cssControls };
    }
    static renderValueNodes(property, matchedResult, renderers, tracing) {
        if (!matchedResult) {
            return { nodes: [document.createTextNode(property.value)], cssControls: new Map() };
        }
        const rendererMap = new Map();
        for (const renderer of renderers) {
            rendererMap.set(renderer.matchType, renderer);
        }
        const context = new RenderingContext(matchedResult.ast, property instanceof SDK.CSSProperty.CSSProperty ? property : null, rendererMap, matchedResult, undefined, {}, tracing);
        return Renderer.render([matchedResult.ast.tree, ...matchedResult.ast.trailingNodes], context);
    }
}
_Renderer_matchedResult = new WeakMap(), _Renderer_output = new WeakMap(), _Renderer_context = new WeakMap();
// clang-format off
export class URLRenderer extends rendererBase(SDK.CSSPropertyParserMatchers.URLMatch) {
    // clang-format on
    constructor(rule, node) {
        super();
        this.rule = rule;
        this.node = node;
    }
    render(match) {
        const url = unescapeCssString(match.url);
        const container = document.createDocumentFragment();
        UI.UIUtils.createTextChild(container, 'url(');
        let hrefUrl = null;
        if (this.rule && this.rule.resourceURL()) {
            hrefUrl = Common.ParsedURL.ParsedURL.completeURL(this.rule.resourceURL(), url);
        }
        else if (this.node) {
            hrefUrl = this.node.resolveURL(url);
        }
        const link = ImagePreviewPopover.setImageUrl(Components.Linkifier.Linkifier.linkifyURL(hrefUrl || url, {
            text: url,
            preventClick: false,
            // crbug.com/1027168
            // We rely on CSS text-overflow: ellipsis to hide long URLs in the Style panel,
            // so that we don't have to keep two versions (original vs. trimmed) of URL
            // at the same time, which complicates both StylesSidebarPane and StylePropertyTreeElement.
            bypassURLTrimming: true,
            showColumnNumber: false,
            inlineFrameIndex: 0,
        }), hrefUrl || url);
        container.appendChild(link);
        UI.UIUtils.createTextChild(container, ')');
        return [container];
    }
}
// clang-format off
export class StringRenderer extends rendererBase(SDK.CSSPropertyParserMatchers.StringMatch) {
    // clang-format on
    render(match) {
        const element = document.createElement('span');
        element.innerText = match.text;
        UI.Tooltip.Tooltip.install(element, unescapeCssString(match.text));
        return [element];
    }
}
// clang-format off
export class BinOpRenderer extends rendererBase(SDK.CSSPropertyParserMatchers.BinOpMatch) {
    // clang-format on
    render(match, context) {
        const [lhs, binop, rhs] = SDK.CSSPropertyParser.ASTUtils.children(match.node).map(child => {
            const span = document.createElement('span');
            Renderer.renderInto(child, context, span);
            return span;
        });
        return [lhs, document.createTextNode(' '), binop, document.createTextNode(' '), rhs];
    }
}
//# sourceMappingURL=PropertyRenderer.js.map