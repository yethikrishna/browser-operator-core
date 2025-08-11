// Copyright 2016 The Chromium Authors. All rights reserved.
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
var _CSSRegisteredProperty_instances, _CSSRegisteredProperty_registration, _CSSRegisteredProperty_cssModel, _CSSRegisteredProperty_style, _CSSRegisteredProperty_asCSSProperties, _CSSMatchedStyles_cssModelInternal, _CSSMatchedStyles_nodeInternal, _CSSMatchedStyles_addedStyles, _CSSMatchedStyles_matchingSelectors, _CSSMatchedStyles_keyframesInternal, _CSSMatchedStyles_registeredProperties, _CSSMatchedStyles_registeredPropertyMap, _CSSMatchedStyles_nodeForStyleInternal, _CSSMatchedStyles_inheritedStyles, _CSSMatchedStyles_styleToDOMCascade, _CSSMatchedStyles_parentLayoutNodeId, _CSSMatchedStyles_positionTryRules, _CSSMatchedStyles_activePositionFallbackIndex, _CSSMatchedStyles_mainDOMCascade, _CSSMatchedStyles_pseudoDOMCascades, _CSSMatchedStyles_customHighlightPseudoDOMCascades, _CSSMatchedStyles_functionRules, _CSSMatchedStyles_functionRuleMap, _CSSMatchedStyles_fontPaletteValuesRule, _NodeCascade_matchedStyles, _NodeCascade_isInherited, _NodeCascade_isHighlightPseudoCascade, _SCCRecord_time, _SCCRecord_stack, _SCCRecord_entries, _DOMInheritanceCascade_instances, _DOMInheritanceCascade_propertiesState, _DOMInheritanceCascade_availableCSSVariables, _DOMInheritanceCascade_computedCSSVariables, _DOMInheritanceCascade_styleToNodeCascade, _DOMInheritanceCascade_initialized, _DOMInheritanceCascade_nodeCascades, _DOMInheritanceCascade_registeredProperties, _DOMInheritanceCascade_findPropertyInPreviousStyle, _DOMInheritanceCascade_findPropertyInParentCascade, _DOMInheritanceCascade_findPropertyInParentCascadeIfInherited, _DOMInheritanceCascade_findCustomPropertyRegistration;
import * as Platform from '../platform/platform.js';
import { CSSMetadata, cssMetadata } from './CSSMetadata.js';
import { CSSProperty } from './CSSProperty.js';
import * as PropertyParser from './CSSPropertyParser.js';
import { AnchorFunctionMatcher, AngleMatcher, AutoBaseMatcher, BaseVariableMatcher, BezierMatcher, BinOpMatcher, ColorMatcher, ColorMixMatcher, FlexGridMatcher, GridTemplateMatcher, LengthMatcher, LightDarkColorMatcher, LinearGradientMatcher, LinkableNameMatcher, MathFunctionMatcher, PositionAnchorMatcher, PositionTryMatcher, RelativeColorChannelMatcher, ShadowMatcher, StringMatcher, URLMatcher, VariableMatcher } from './CSSPropertyParserMatchers.js';
import { CSSFontPaletteValuesRule, CSSFunctionRule, CSSKeyframeRule, CSSKeyframesRule, CSSPositionTryRule, CSSPropertyRule, CSSStyleRule, } from './CSSRule.js';
import { CSSStyleDeclaration, Type } from './CSSStyleDeclaration.js';
function containsStyle(styles, query) {
    if (!query.styleSheetId || !query.range) {
        return false;
    }
    for (const style of styles) {
        if (query.styleSheetId === style.styleSheetId && style.range && query.range.equal(style.range)) {
            return true;
        }
    }
    return false;
}
function containsCustomProperties(style) {
    const properties = style.allProperties();
    return properties.some(property => cssMetadata().isCustomProperty(property.name));
}
function containsInherited(style) {
    const properties = style.allProperties();
    for (let i = 0; i < properties.length; ++i) {
        const property = properties[i];
        // Does this style contain non-overridden inherited property?
        if (property.activeInStyle() && cssMetadata().isPropertyInherited(property.name)) {
            return true;
        }
    }
    return false;
}
function cleanUserAgentPayload(payload) {
    for (const ruleMatch of payload) {
        cleanUserAgentSelectors(ruleMatch);
    }
    // Merge UA rules that are sequential and have similar selector/media.
    const cleanMatchedPayload = [];
    for (const ruleMatch of payload) {
        const lastMatch = cleanMatchedPayload[cleanMatchedPayload.length - 1];
        if (!lastMatch || ruleMatch.rule.origin !== 'user-agent' || lastMatch.rule.origin !== 'user-agent' ||
            ruleMatch.rule.selectorList.text !== lastMatch.rule.selectorList.text ||
            mediaText(ruleMatch) !== mediaText(lastMatch)) {
            cleanMatchedPayload.push(ruleMatch);
            continue;
        }
        mergeRule(ruleMatch, lastMatch);
    }
    return cleanMatchedPayload;
    function mergeRule(from, to) {
        const shorthands = new Map();
        const properties = new Map();
        for (const entry of to.rule.style.shorthandEntries) {
            shorthands.set(entry.name, entry.value);
        }
        for (const entry of to.rule.style.cssProperties) {
            properties.set(entry.name, entry.value);
        }
        for (const entry of from.rule.style.shorthandEntries) {
            shorthands.set(entry.name, entry.value);
        }
        for (const entry of from.rule.style.cssProperties) {
            properties.set(entry.name, entry.value);
        }
        to.rule.style.shorthandEntries = [...shorthands.entries()].map(([name, value]) => ({ name, value }));
        to.rule.style.cssProperties = [...properties.entries()].map(([name, value]) => ({ name, value }));
    }
    function mediaText(ruleMatch) {
        if (!ruleMatch.rule.media) {
            return null;
        }
        return ruleMatch.rule.media.map(media => media.text).join(', ');
    }
    function cleanUserAgentSelectors(ruleMatch) {
        const { matchingSelectors, rule } = ruleMatch;
        if (rule.origin !== 'user-agent' || !matchingSelectors.length) {
            return;
        }
        rule.selectorList.selectors = rule.selectorList.selectors.filter((_, i) => matchingSelectors.includes(i));
        rule.selectorList.text = rule.selectorList.selectors.map(item => item.text).join(', ');
        ruleMatch.matchingSelectors = matchingSelectors.map((_, i) => i);
    }
}
/**
 * Return a mapping of the highlight names in the specified RuleMatch to
 * the indices of selectors in that selector list with that highlight name.
 *
 * For example, consider the following ruleset:
 * span::highlight(foo), div, #mySpan::highlight(bar), .highlighted::highlight(foo) {
 *   color: blue;
 * }
 *
 * For a <span id="mySpan" class="highlighted"></span>, a RuleMatch for that span
 * would have matchingSelectors [0, 2, 3] indicating that the span
 * matches all of the highlight selectors.
 *
 * For that RuleMatch, this function would produce the following map:
 * {
 *  "foo": [0, 3],
 *  "bar": [2]
 * }
 *
 * @param ruleMatch
 * @returns A mapping of highlight names to lists of indices into the selector
 * list associated with ruleMatch. The indices correspond to the selectors in the rule
 * associated with the key's highlight name.
 */
function customHighlightNamesToMatchingSelectorIndices(ruleMatch) {
    const highlightNamesToMatchingSelectors = new Map();
    for (let i = 0; i < ruleMatch.matchingSelectors.length; i++) {
        const matchingSelectorIndex = ruleMatch.matchingSelectors[i];
        const selectorText = ruleMatch.rule.selectorList.selectors[matchingSelectorIndex].text;
        const highlightNameMatch = selectorText.match(/::highlight\((.*)\)/);
        if (highlightNameMatch) {
            const highlightName = highlightNameMatch[1];
            const selectorsForName = highlightNamesToMatchingSelectors.get(highlightName);
            if (selectorsForName) {
                selectorsForName.push(matchingSelectorIndex);
            }
            else {
                highlightNamesToMatchingSelectors.set(highlightName, [matchingSelectorIndex]);
            }
        }
    }
    return highlightNamesToMatchingSelectors;
}
function queryMatches(style) {
    if (!style.parentRule) {
        return true;
    }
    const parentRule = style.parentRule;
    const queries = [...parentRule.media, ...parentRule.containerQueries, ...parentRule.supports, ...parentRule.scopes];
    for (const query of queries) {
        if (!query.active()) {
            return false;
        }
    }
    return true;
}
export class CSSRegisteredProperty {
    constructor(cssModel, registration) {
        _CSSRegisteredProperty_instances.add(this);
        _CSSRegisteredProperty_registration.set(this, void 0);
        _CSSRegisteredProperty_cssModel.set(this, void 0);
        _CSSRegisteredProperty_style.set(this, void 0);
        __classPrivateFieldSet(this, _CSSRegisteredProperty_cssModel, cssModel, "f");
        __classPrivateFieldSet(this, _CSSRegisteredProperty_registration, registration, "f");
    }
    propertyName() {
        return __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f") instanceof CSSPropertyRule ? __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f").propertyName().text :
            __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f").propertyName;
    }
    initialValue() {
        return __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f") instanceof CSSPropertyRule ? __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f").initialValue() :
            __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f").initialValue?.text ?? null;
    }
    inherits() {
        return __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f") instanceof CSSPropertyRule ? __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f").inherits() : __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f").inherits;
    }
    syntax() {
        return __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f") instanceof CSSPropertyRule ? __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f").syntax() :
            `"${__classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f").syntax}"`;
    }
    parseValue(matchedStyles, computedStyles) {
        const value = this.initialValue();
        if (!value) {
            return null;
        }
        return PropertyParser.matchDeclaration(this.propertyName(), value, matchedStyles.propertyMatchers(this.style(), computedStyles));
    }
    style() {
        if (!__classPrivateFieldGet(this, _CSSRegisteredProperty_style, "f")) {
            __classPrivateFieldSet(this, _CSSRegisteredProperty_style, __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f") instanceof CSSPropertyRule ?
                __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f").style :
                new CSSStyleDeclaration(__classPrivateFieldGet(this, _CSSRegisteredProperty_cssModel, "f"), null, { cssProperties: __classPrivateFieldGet(this, _CSSRegisteredProperty_instances, "m", _CSSRegisteredProperty_asCSSProperties).call(this), shorthandEntries: [] }, Type.Pseudo), "f");
        }
        return __classPrivateFieldGet(this, _CSSRegisteredProperty_style, "f");
    }
}
_CSSRegisteredProperty_registration = new WeakMap(), _CSSRegisteredProperty_cssModel = new WeakMap(), _CSSRegisteredProperty_style = new WeakMap(), _CSSRegisteredProperty_instances = new WeakSet(), _CSSRegisteredProperty_asCSSProperties = function _CSSRegisteredProperty_asCSSProperties() {
    if (__classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f") instanceof CSSPropertyRule) {
        return [];
    }
    const { inherits, initialValue, syntax } = __classPrivateFieldGet(this, _CSSRegisteredProperty_registration, "f");
    const properties = [
        { name: 'inherits', value: `${inherits}` },
        { name: 'syntax', value: `"${syntax}"` },
    ];
    if (initialValue !== undefined) {
        properties.push({ name: 'initial-value', value: initialValue.text });
    }
    return properties;
};
export class CSSMatchedStyles {
    static async create(payload) {
        const cssMatchedStyles = new CSSMatchedStyles(payload);
        await cssMatchedStyles.init(payload);
        return cssMatchedStyles;
    }
    constructor({ cssModel, node, animationsPayload, parentLayoutNodeId, positionTryRules, propertyRules, cssPropertyRegistrations, fontPaletteValuesRule, activePositionFallbackIndex, functionRules, }) {
        _CSSMatchedStyles_cssModelInternal.set(this, void 0);
        _CSSMatchedStyles_nodeInternal.set(this, void 0);
        _CSSMatchedStyles_addedStyles.set(this, new Map());
        _CSSMatchedStyles_matchingSelectors.set(this, new Map());
        _CSSMatchedStyles_keyframesInternal.set(this, []);
        _CSSMatchedStyles_registeredProperties.set(this, void 0);
        _CSSMatchedStyles_registeredPropertyMap.set(this, new Map());
        _CSSMatchedStyles_nodeForStyleInternal.set(this, new Map());
        _CSSMatchedStyles_inheritedStyles.set(this, new Set());
        _CSSMatchedStyles_styleToDOMCascade.set(this, new Map());
        _CSSMatchedStyles_parentLayoutNodeId.set(this, void 0);
        _CSSMatchedStyles_positionTryRules.set(this, void 0);
        _CSSMatchedStyles_activePositionFallbackIndex.set(this, void 0);
        _CSSMatchedStyles_mainDOMCascade.set(this, void 0);
        _CSSMatchedStyles_pseudoDOMCascades.set(this, void 0);
        _CSSMatchedStyles_customHighlightPseudoDOMCascades.set(this, void 0);
        _CSSMatchedStyles_functionRules.set(this, void 0);
        _CSSMatchedStyles_functionRuleMap.set(this, new Map());
        _CSSMatchedStyles_fontPaletteValuesRule.set(this, void 0);
        __classPrivateFieldSet(this, _CSSMatchedStyles_cssModelInternal, cssModel, "f");
        __classPrivateFieldSet(this, _CSSMatchedStyles_nodeInternal, node, "f");
        __classPrivateFieldSet(this, _CSSMatchedStyles_registeredProperties, [
            ...propertyRules.map(rule => new CSSPropertyRule(cssModel, rule)),
            ...cssPropertyRegistrations,
        ].map(r => new CSSRegisteredProperty(cssModel, r)), "f");
        if (animationsPayload) {
            __classPrivateFieldSet(this, _CSSMatchedStyles_keyframesInternal, animationsPayload.map(rule => new CSSKeyframesRule(cssModel, rule)), "f");
        }
        __classPrivateFieldSet(this, _CSSMatchedStyles_positionTryRules, positionTryRules.map(rule => new CSSPositionTryRule(cssModel, rule)), "f");
        __classPrivateFieldSet(this, _CSSMatchedStyles_parentLayoutNodeId, parentLayoutNodeId, "f");
        __classPrivateFieldSet(this, _CSSMatchedStyles_fontPaletteValuesRule, fontPaletteValuesRule ? new CSSFontPaletteValuesRule(cssModel, fontPaletteValuesRule) : undefined, "f");
        __classPrivateFieldSet(this, _CSSMatchedStyles_activePositionFallbackIndex, activePositionFallbackIndex, "f");
        __classPrivateFieldSet(this, _CSSMatchedStyles_functionRules, functionRules.map(rule => new CSSFunctionRule(cssModel, rule)), "f");
    }
    async init({ matchedPayload, inheritedPayload, inlinePayload, attributesPayload, pseudoPayload, inheritedPseudoPayload, animationStylesPayload, transitionsStylePayload, inheritedAnimatedPayload, }) {
        var _a, _b;
        matchedPayload = cleanUserAgentPayload(matchedPayload);
        for (const inheritedResult of inheritedPayload) {
            inheritedResult.matchedCSSRules = cleanUserAgentPayload(inheritedResult.matchedCSSRules);
        }
        __classPrivateFieldSet(this, _CSSMatchedStyles_mainDOMCascade, await this.buildMainCascade(inlinePayload, attributesPayload, matchedPayload, inheritedPayload, animationStylesPayload, transitionsStylePayload, inheritedAnimatedPayload), "f");
        _a = this, _b = this, [({ set value(_c) { __classPrivateFieldSet(_a, _CSSMatchedStyles_pseudoDOMCascades, _c, "f"); } }).value, ({ set value(_c) { __classPrivateFieldSet(_b, _CSSMatchedStyles_customHighlightPseudoDOMCascades, _c, "f"); } }).value] =
            this.buildPseudoCascades(pseudoPayload, inheritedPseudoPayload);
        for (const domCascade of Array.from(__classPrivateFieldGet(this, _CSSMatchedStyles_customHighlightPseudoDOMCascades, "f").values())
            .concat(Array.from(__classPrivateFieldGet(this, _CSSMatchedStyles_pseudoDOMCascades, "f").values()))
            .concat(__classPrivateFieldGet(this, _CSSMatchedStyles_mainDOMCascade, "f"))) {
            for (const style of domCascade.styles()) {
                __classPrivateFieldGet(this, _CSSMatchedStyles_styleToDOMCascade, "f").set(style, domCascade);
            }
        }
        for (const prop of __classPrivateFieldGet(this, _CSSMatchedStyles_registeredProperties, "f")) {
            __classPrivateFieldGet(this, _CSSMatchedStyles_registeredPropertyMap, "f").set(prop.propertyName(), prop);
        }
        for (const rule of __classPrivateFieldGet(this, _CSSMatchedStyles_functionRules, "f")) {
            __classPrivateFieldGet(this, _CSSMatchedStyles_functionRuleMap, "f").set(rule.functionName().text, rule);
        }
    }
    async buildMainCascade(inlinePayload, attributesPayload, matchedPayload, inheritedPayload, animationStylesPayload, transitionsStylePayload, inheritedAnimatedPayload) {
        const nodeCascades = [];
        const nodeStyles = [];
        function addAttributesStyle() {
            if (!attributesPayload) {
                return;
            }
            const style = new CSSStyleDeclaration(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), null, attributesPayload, Type.Attributes);
            __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(style, __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f"));
            nodeStyles.push(style);
        }
        // Transition styles take precedence over animation styles & inline styles.
        if (transitionsStylePayload) {
            const style = new CSSStyleDeclaration(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), null, transitionsStylePayload, Type.Transition);
            __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(style, __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f"));
            nodeStyles.push(style);
        }
        // Animation styles take precedence over inline styles.
        for (const animationsStyle of animationStylesPayload) {
            const style = new CSSStyleDeclaration(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), null, animationsStyle.style, Type.Animation, animationsStyle.name);
            __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(style, __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f"));
            nodeStyles.push(style);
        }
        // Inline style takes precedence over regular and inherited rules.
        if (inlinePayload && __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f").nodeType() === Node.ELEMENT_NODE) {
            const style = new CSSStyleDeclaration(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), null, inlinePayload, Type.Inline);
            __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(style, __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f"));
            nodeStyles.push(style);
        }
        // Add rules in reverse order to match the cascade order.
        let addedAttributesStyle;
        for (let i = matchedPayload.length - 1; i >= 0; --i) {
            const rule = new CSSStyleRule(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), matchedPayload[i].rule);
            if ((rule.isInjected() || rule.isUserAgent()) && !addedAttributesStyle) {
                // Show element's Style Attributes after all author rules.
                addedAttributesStyle = true;
                addAttributesStyle.call(this);
            }
            __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(rule.style, __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f"));
            nodeStyles.push(rule.style);
            this.addMatchingSelectors(__classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f"), rule, matchedPayload[i].matchingSelectors);
        }
        if (!addedAttributesStyle) {
            addAttributesStyle.call(this);
        }
        nodeCascades.push(new NodeCascade(this, nodeStyles, false /* #isInherited */));
        // Walk the node structure and identify styles with inherited properties.
        let parentNode = __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f").parentNode;
        const traverseParentInFlatTree = async (node) => {
            if (node.hasAssignedSlot()) {
                return await node.assignedSlot?.deferredNode.resolvePromise() ?? null;
            }
            return node.parentNode;
        };
        for (let i = 0; parentNode && inheritedPayload && i < inheritedPayload.length; ++i) {
            const inheritedStyles = [];
            const entryPayload = inheritedPayload[i];
            const inheritedAnimatedEntryPayload = inheritedAnimatedPayload[i];
            const inheritedInlineStyle = entryPayload.inlineStyle ?
                new CSSStyleDeclaration(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), null, entryPayload.inlineStyle, Type.Inline) :
                null;
            const inheritedTransitionsStyle = inheritedAnimatedEntryPayload?.transitionsStyle ?
                new CSSStyleDeclaration(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), null, inheritedAnimatedEntryPayload?.transitionsStyle, Type.Transition) :
                null;
            const inheritedAnimationStyles = inheritedAnimatedEntryPayload?.animationStyles?.map(animationStyle => new CSSStyleDeclaration(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), null, animationStyle.style, Type.Animation, animationStyle.name)) ??
                [];
            if (inheritedTransitionsStyle && containsInherited(inheritedTransitionsStyle)) {
                __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(inheritedTransitionsStyle, parentNode);
                inheritedStyles.push(inheritedTransitionsStyle);
                __classPrivateFieldGet(this, _CSSMatchedStyles_inheritedStyles, "f").add(inheritedTransitionsStyle);
            }
            for (const inheritedAnimationsStyle of inheritedAnimationStyles) {
                if (!containsInherited(inheritedAnimationsStyle)) {
                    continue;
                }
                __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(inheritedAnimationsStyle, parentNode);
                inheritedStyles.push(inheritedAnimationsStyle);
                __classPrivateFieldGet(this, _CSSMatchedStyles_inheritedStyles, "f").add(inheritedAnimationsStyle);
            }
            if (inheritedInlineStyle && containsInherited(inheritedInlineStyle)) {
                __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(inheritedInlineStyle, parentNode);
                inheritedStyles.push(inheritedInlineStyle);
                __classPrivateFieldGet(this, _CSSMatchedStyles_inheritedStyles, "f").add(inheritedInlineStyle);
            }
            const inheritedMatchedCSSRules = entryPayload.matchedCSSRules || [];
            for (let j = inheritedMatchedCSSRules.length - 1; j >= 0; --j) {
                const inheritedRule = new CSSStyleRule(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), inheritedMatchedCSSRules[j].rule);
                this.addMatchingSelectors(parentNode, inheritedRule, inheritedMatchedCSSRules[j].matchingSelectors);
                if (!containsInherited(inheritedRule.style)) {
                    continue;
                }
                if (!containsCustomProperties(inheritedRule.style)) {
                    if (containsStyle(nodeStyles, inheritedRule.style) ||
                        containsStyle(__classPrivateFieldGet(this, _CSSMatchedStyles_inheritedStyles, "f"), inheritedRule.style)) {
                        continue;
                    }
                }
                __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(inheritedRule.style, parentNode);
                inheritedStyles.push(inheritedRule.style);
                __classPrivateFieldGet(this, _CSSMatchedStyles_inheritedStyles, "f").add(inheritedRule.style);
            }
            parentNode = await traverseParentInFlatTree(parentNode);
            nodeCascades.push(new NodeCascade(this, inheritedStyles, true /* #isInherited */));
        }
        return new DOMInheritanceCascade(nodeCascades, __classPrivateFieldGet(this, _CSSMatchedStyles_registeredProperties, "f"));
    }
    /**
     * Pseudo rule matches received via the inspector protocol are grouped by pseudo type.
     * For custom highlight pseudos, we need to instead group the rule matches by highlight
     * name in order to produce separate cascades for each highlight name. This is necessary
     * so that styles of ::highlight(foo) are not shown as overriding styles of ::highlight(bar).
     *
     * This helper function takes a list of rule matches and generates separate NodeCascades
     * for each custom highlight name that was matched.
     */
    buildSplitCustomHighlightCascades(rules, node, isInherited, pseudoCascades) {
        const splitHighlightRules = new Map();
        for (let j = rules.length - 1; j >= 0; --j) {
            const highlightNamesToMatchingSelectorIndices = customHighlightNamesToMatchingSelectorIndices(rules[j]);
            for (const [highlightName, matchingSelectors] of highlightNamesToMatchingSelectorIndices) {
                const pseudoRule = new CSSStyleRule(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), rules[j].rule);
                __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(pseudoRule.style, node);
                if (isInherited) {
                    __classPrivateFieldGet(this, _CSSMatchedStyles_inheritedStyles, "f").add(pseudoRule.style);
                }
                this.addMatchingSelectors(node, pseudoRule, matchingSelectors);
                const ruleListForHighlightName = splitHighlightRules.get(highlightName);
                if (ruleListForHighlightName) {
                    ruleListForHighlightName.push(pseudoRule.style);
                }
                else {
                    splitHighlightRules.set(highlightName, [pseudoRule.style]);
                }
            }
        }
        for (const [highlightName, highlightStyles] of splitHighlightRules) {
            const nodeCascade = new NodeCascade(this, highlightStyles, isInherited, true /* #isHighlightPseudoCascade*/);
            const cascadeListForHighlightName = pseudoCascades.get(highlightName);
            if (cascadeListForHighlightName) {
                cascadeListForHighlightName.push(nodeCascade);
            }
            else {
                pseudoCascades.set(highlightName, [nodeCascade]);
            }
        }
    }
    buildPseudoCascades(pseudoPayload, inheritedPseudoPayload) {
        const pseudoInheritanceCascades = new Map();
        const customHighlightPseudoInheritanceCascades = new Map();
        if (!pseudoPayload) {
            return [pseudoInheritanceCascades, customHighlightPseudoInheritanceCascades];
        }
        const pseudoCascades = new Map();
        const customHighlightPseudoCascades = new Map();
        for (let i = 0; i < pseudoPayload.length; ++i) {
            const entryPayload = pseudoPayload[i];
            // PseudoElement nodes are not created unless "content" css property is set.
            const pseudoElement = __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f").pseudoElements().get(entryPayload.pseudoType)?.at(-1) || null;
            const pseudoStyles = [];
            const rules = entryPayload.matches || [];
            if (entryPayload.pseudoType === "highlight" /* Protocol.DOM.PseudoType.Highlight */) {
                this.buildSplitCustomHighlightCascades(rules, __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f"), false /* #isInherited */, customHighlightPseudoCascades);
            }
            else {
                for (let j = rules.length - 1; j >= 0; --j) {
                    const pseudoRule = new CSSStyleRule(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), rules[j].rule);
                    pseudoStyles.push(pseudoRule.style);
                    const nodeForStyle = cssMetadata().isHighlightPseudoType(entryPayload.pseudoType) ? __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f") : pseudoElement;
                    __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(pseudoRule.style, nodeForStyle);
                    if (nodeForStyle) {
                        this.addMatchingSelectors(nodeForStyle, pseudoRule, rules[j].matchingSelectors);
                    }
                }
                const isHighlightPseudoCascade = cssMetadata().isHighlightPseudoType(entryPayload.pseudoType);
                const nodeCascade = new NodeCascade(this, pseudoStyles, false /* #isInherited */, isHighlightPseudoCascade /* #isHighlightPseudoCascade*/);
                pseudoCascades.set(entryPayload.pseudoType, [nodeCascade]);
            }
        }
        if (inheritedPseudoPayload) {
            let parentNode = __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f").parentNode;
            for (let i = 0; parentNode && i < inheritedPseudoPayload.length; ++i) {
                const inheritedPseudoMatches = inheritedPseudoPayload[i].pseudoElements;
                for (let j = 0; j < inheritedPseudoMatches.length; ++j) {
                    const inheritedEntryPayload = inheritedPseudoMatches[j];
                    const rules = inheritedEntryPayload.matches || [];
                    if (inheritedEntryPayload.pseudoType === "highlight" /* Protocol.DOM.PseudoType.Highlight */) {
                        this.buildSplitCustomHighlightCascades(rules, parentNode, true /* #isInherited */, customHighlightPseudoCascades);
                    }
                    else {
                        const pseudoStyles = [];
                        for (let k = rules.length - 1; k >= 0; --k) {
                            const pseudoRule = new CSSStyleRule(__classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f"), rules[k].rule);
                            pseudoStyles.push(pseudoRule.style);
                            __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").set(pseudoRule.style, parentNode);
                            __classPrivateFieldGet(this, _CSSMatchedStyles_inheritedStyles, "f").add(pseudoRule.style);
                            this.addMatchingSelectors(parentNode, pseudoRule, rules[k].matchingSelectors);
                        }
                        const isHighlightPseudoCascade = cssMetadata().isHighlightPseudoType(inheritedEntryPayload.pseudoType);
                        const nodeCascade = new NodeCascade(this, pseudoStyles, true /* #isInherited */, isHighlightPseudoCascade /* #isHighlightPseudoCascade*/);
                        const cascadeListForPseudoType = pseudoCascades.get(inheritedEntryPayload.pseudoType);
                        if (cascadeListForPseudoType) {
                            cascadeListForPseudoType.push(nodeCascade);
                        }
                        else {
                            pseudoCascades.set(inheritedEntryPayload.pseudoType, [nodeCascade]);
                        }
                    }
                }
                parentNode = parentNode.parentNode;
            }
        }
        // Now that we've built the arrays of NodeCascades for each pseudo type, convert them into
        // DOMInheritanceCascades.
        for (const [pseudoType, nodeCascade] of pseudoCascades.entries()) {
            pseudoInheritanceCascades.set(pseudoType, new DOMInheritanceCascade(nodeCascade, __classPrivateFieldGet(this, _CSSMatchedStyles_registeredProperties, "f")));
        }
        for (const [highlightName, nodeCascade] of customHighlightPseudoCascades.entries()) {
            customHighlightPseudoInheritanceCascades.set(highlightName, new DOMInheritanceCascade(nodeCascade, __classPrivateFieldGet(this, _CSSMatchedStyles_registeredProperties, "f")));
        }
        return [pseudoInheritanceCascades, customHighlightPseudoInheritanceCascades];
    }
    addMatchingSelectors(node, rule, matchingSelectorIndices) {
        for (const matchingSelectorIndex of matchingSelectorIndices) {
            const selector = rule.selectors[matchingSelectorIndex];
            if (selector) {
                this.setSelectorMatches(node, selector.text, true);
            }
        }
    }
    node() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f");
    }
    cssModel() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_cssModelInternal, "f");
    }
    hasMatchingSelectors(rule) {
        return (rule.selectors.length === 0 || this.getMatchingSelectors(rule).length > 0) && queryMatches(rule.style);
    }
    getParentLayoutNodeId() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_parentLayoutNodeId, "f");
    }
    getMatchingSelectors(rule) {
        const node = this.nodeForStyle(rule.style);
        if (!node || typeof node.id !== 'number') {
            return [];
        }
        const map = __classPrivateFieldGet(this, _CSSMatchedStyles_matchingSelectors, "f").get(node.id);
        if (!map) {
            return [];
        }
        const result = [];
        for (let i = 0; i < rule.selectors.length; ++i) {
            if (map.get(rule.selectors[i].text)) {
                result.push(i);
            }
        }
        return result;
    }
    async recomputeMatchingSelectors(rule) {
        const node = this.nodeForStyle(rule.style);
        if (!node) {
            return;
        }
        const promises = [];
        for (const selector of rule.selectors) {
            promises.push(querySelector.call(this, node, selector.text));
        }
        await Promise.all(promises);
        async function querySelector(node, selectorText) {
            const ownerDocument = node.ownerDocument;
            if (!ownerDocument) {
                return;
            }
            // We assume that "matching" property does not ever change during the
            // MatchedStyleResult's lifetime.
            if (typeof node.id === 'number') {
                const map = __classPrivateFieldGet(this, _CSSMatchedStyles_matchingSelectors, "f").get(node.id);
                if (map?.has(selectorText)) {
                    return;
                }
            }
            if (typeof ownerDocument.id !== 'number') {
                return;
            }
            const matchingNodeIds = await __classPrivateFieldGet(this, _CSSMatchedStyles_nodeInternal, "f").domModel().querySelectorAll(ownerDocument.id, selectorText);
            if (matchingNodeIds) {
                if (typeof node.id === 'number') {
                    this.setSelectorMatches(node, selectorText, matchingNodeIds.indexOf(node.id) !== -1);
                }
                else {
                    this.setSelectorMatches(node, selectorText, false);
                }
            }
        }
    }
    addNewRule(rule, node) {
        __classPrivateFieldGet(this, _CSSMatchedStyles_addedStyles, "f").set(rule.style, node);
        return this.recomputeMatchingSelectors(rule);
    }
    setSelectorMatches(node, selectorText, value) {
        if (typeof node.id !== 'number') {
            return;
        }
        let map = __classPrivateFieldGet(this, _CSSMatchedStyles_matchingSelectors, "f").get(node.id);
        if (!map) {
            map = new Map();
            __classPrivateFieldGet(this, _CSSMatchedStyles_matchingSelectors, "f").set(node.id, map);
        }
        map.set(selectorText, value);
    }
    nodeStyles() {
        Platform.assertNotNullOrUndefined(__classPrivateFieldGet(this, _CSSMatchedStyles_mainDOMCascade, "f"));
        return __classPrivateFieldGet(this, _CSSMatchedStyles_mainDOMCascade, "f").styles();
    }
    inheritedStyles() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_mainDOMCascade, "f")?.styles().filter(style => this.isInherited(style)) ?? [];
    }
    animationStyles() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_mainDOMCascade, "f")?.styles().filter(style => !this.isInherited(style) && style.type === Type.Animation) ??
            [];
    }
    transitionsStyle() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_mainDOMCascade, "f")?.styles().find(style => !this.isInherited(style) && style.type === Type.Transition) ??
            null;
    }
    registeredProperties() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_registeredProperties, "f");
    }
    getRegisteredProperty(name) {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_registeredPropertyMap, "f").get(name);
    }
    getRegisteredFunction(name) {
        const functionRule = __classPrivateFieldGet(this, _CSSMatchedStyles_functionRuleMap, "f").get(name);
        return functionRule ? functionRule.nameWithParameters() : undefined;
    }
    functionRules() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_functionRules, "f");
    }
    fontPaletteValuesRule() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_fontPaletteValuesRule, "f");
    }
    keyframes() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_keyframesInternal, "f");
    }
    positionTryRules() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_positionTryRules, "f");
    }
    activePositionFallbackIndex() {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_activePositionFallbackIndex, "f");
    }
    pseudoStyles(pseudoType) {
        Platform.assertNotNullOrUndefined(__classPrivateFieldGet(this, _CSSMatchedStyles_pseudoDOMCascades, "f"));
        const domCascade = __classPrivateFieldGet(this, _CSSMatchedStyles_pseudoDOMCascades, "f").get(pseudoType);
        return domCascade ? domCascade.styles() : [];
    }
    pseudoTypes() {
        Platform.assertNotNullOrUndefined(__classPrivateFieldGet(this, _CSSMatchedStyles_pseudoDOMCascades, "f"));
        return new Set(__classPrivateFieldGet(this, _CSSMatchedStyles_pseudoDOMCascades, "f").keys());
    }
    customHighlightPseudoStyles(highlightName) {
        Platform.assertNotNullOrUndefined(__classPrivateFieldGet(this, _CSSMatchedStyles_customHighlightPseudoDOMCascades, "f"));
        const domCascade = __classPrivateFieldGet(this, _CSSMatchedStyles_customHighlightPseudoDOMCascades, "f").get(highlightName);
        return domCascade ? domCascade.styles() : [];
    }
    customHighlightPseudoNames() {
        Platform.assertNotNullOrUndefined(__classPrivateFieldGet(this, _CSSMatchedStyles_customHighlightPseudoDOMCascades, "f"));
        return new Set(__classPrivateFieldGet(this, _CSSMatchedStyles_customHighlightPseudoDOMCascades, "f").keys());
    }
    nodeForStyle(style) {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_addedStyles, "f").get(style) || __classPrivateFieldGet(this, _CSSMatchedStyles_nodeForStyleInternal, "f").get(style) || null;
    }
    availableCSSVariables(style) {
        const domCascade = __classPrivateFieldGet(this, _CSSMatchedStyles_styleToDOMCascade, "f").get(style);
        return domCascade ? domCascade.findAvailableCSSVariables(style) : [];
    }
    computeCSSVariable(style, variableName) {
        if (style.parentRule instanceof CSSKeyframeRule) {
            // The resolution of the variables inside of a CSS keyframe rule depends on where this keyframe rule is used.
            // So, we need to find the style with active CSS property `animation-name` that equals to the keyframe's name.
            const keyframeName = style.parentRule.parentRuleName();
            const activeStyle = __classPrivateFieldGet(this, _CSSMatchedStyles_mainDOMCascade, "f")?.styles().find(searchStyle => {
                return searchStyle.allProperties().some(property => property.name === 'animation-name' && property.value === keyframeName &&
                    __classPrivateFieldGet(this, _CSSMatchedStyles_mainDOMCascade, "f")?.propertyState(property) === "Active" /* PropertyState.ACTIVE */);
            });
            if (!activeStyle) {
                return null;
            }
            style = activeStyle;
        }
        const domCascade = __classPrivateFieldGet(this, _CSSMatchedStyles_styleToDOMCascade, "f").get(style);
        return domCascade ? domCascade.computeCSSVariable(style, variableName) : null;
    }
    resolveProperty(name, ownerStyle) {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_styleToDOMCascade, "f").get(ownerStyle)?.resolveProperty(name, ownerStyle) ?? null;
    }
    resolveGlobalKeyword(property, keyword) {
        const resolved = __classPrivateFieldGet(this, _CSSMatchedStyles_styleToDOMCascade, "f").get(property.ownerStyle)?.resolveGlobalKeyword(property, keyword);
        return resolved ? new CSSValueSource(resolved) : null;
    }
    isInherited(style) {
        return __classPrivateFieldGet(this, _CSSMatchedStyles_inheritedStyles, "f").has(style);
    }
    propertyState(property) {
        const domCascade = __classPrivateFieldGet(this, _CSSMatchedStyles_styleToDOMCascade, "f").get(property.ownerStyle);
        return domCascade ? domCascade.propertyState(property) : null;
    }
    resetActiveProperties() {
        Platform.assertNotNullOrUndefined(__classPrivateFieldGet(this, _CSSMatchedStyles_mainDOMCascade, "f"));
        Platform.assertNotNullOrUndefined(__classPrivateFieldGet(this, _CSSMatchedStyles_pseudoDOMCascades, "f"));
        Platform.assertNotNullOrUndefined(__classPrivateFieldGet(this, _CSSMatchedStyles_customHighlightPseudoDOMCascades, "f"));
        __classPrivateFieldGet(this, _CSSMatchedStyles_mainDOMCascade, "f").reset();
        for (const domCascade of __classPrivateFieldGet(this, _CSSMatchedStyles_pseudoDOMCascades, "f").values()) {
            domCascade.reset();
        }
        for (const domCascade of __classPrivateFieldGet(this, _CSSMatchedStyles_customHighlightPseudoDOMCascades, "f").values()) {
            domCascade.reset();
        }
    }
    propertyMatchers(style, computedStyles) {
        return [
            new VariableMatcher(this, style),
            new ColorMatcher(() => computedStyles?.get('color') ?? null),
            new ColorMixMatcher(),
            new URLMatcher(),
            new AngleMatcher(),
            new LinkableNameMatcher(),
            new BezierMatcher(),
            new StringMatcher(),
            new ShadowMatcher(),
            new LightDarkColorMatcher(style),
            new GridTemplateMatcher(),
            new LinearGradientMatcher(),
            new AnchorFunctionMatcher(),
            new PositionAnchorMatcher(),
            new FlexGridMatcher(),
            new PositionTryMatcher(),
            new LengthMatcher(),
            new MathFunctionMatcher(),
            new AutoBaseMatcher(),
            new BinOpMatcher(),
            new RelativeColorChannelMatcher(),
        ];
    }
}
_CSSMatchedStyles_cssModelInternal = new WeakMap(), _CSSMatchedStyles_nodeInternal = new WeakMap(), _CSSMatchedStyles_addedStyles = new WeakMap(), _CSSMatchedStyles_matchingSelectors = new WeakMap(), _CSSMatchedStyles_keyframesInternal = new WeakMap(), _CSSMatchedStyles_registeredProperties = new WeakMap(), _CSSMatchedStyles_registeredPropertyMap = new WeakMap(), _CSSMatchedStyles_nodeForStyleInternal = new WeakMap(), _CSSMatchedStyles_inheritedStyles = new WeakMap(), _CSSMatchedStyles_styleToDOMCascade = new WeakMap(), _CSSMatchedStyles_parentLayoutNodeId = new WeakMap(), _CSSMatchedStyles_positionTryRules = new WeakMap(), _CSSMatchedStyles_activePositionFallbackIndex = new WeakMap(), _CSSMatchedStyles_mainDOMCascade = new WeakMap(), _CSSMatchedStyles_pseudoDOMCascades = new WeakMap(), _CSSMatchedStyles_customHighlightPseudoDOMCascades = new WeakMap(), _CSSMatchedStyles_functionRules = new WeakMap(), _CSSMatchedStyles_functionRuleMap = new WeakMap(), _CSSMatchedStyles_fontPaletteValuesRule = new WeakMap();
class NodeCascade {
    constructor(matchedStyles, styles, isInherited, isHighlightPseudoCascade = false) {
        _NodeCascade_matchedStyles.set(this, void 0);
        _NodeCascade_isInherited.set(this, void 0);
        _NodeCascade_isHighlightPseudoCascade.set(this, void 0);
        this.propertiesState = new Map();
        this.activeProperties = new Map();
        __classPrivateFieldSet(this, _NodeCascade_matchedStyles, matchedStyles, "f");
        this.styles = styles;
        __classPrivateFieldSet(this, _NodeCascade_isInherited, isInherited, "f");
        __classPrivateFieldSet(this, _NodeCascade_isHighlightPseudoCascade, isHighlightPseudoCascade, "f");
    }
    computeActiveProperties() {
        this.propertiesState.clear();
        this.activeProperties.clear();
        for (let i = this.styles.length - 1; i >= 0; i--) {
            const style = this.styles[i];
            const rule = style.parentRule;
            // Compute cascade for CSSStyleRules only.
            if (rule && !(rule instanceof CSSStyleRule)) {
                continue;
            }
            if (rule && !__classPrivateFieldGet(this, _NodeCascade_matchedStyles, "f").hasMatchingSelectors(rule)) {
                continue;
            }
            for (const property of style.allProperties()) {
                // Do not pick non-inherited properties from inherited styles.
                const metadata = cssMetadata();
                // All properties are inherited for highlight pseudos.
                if (__classPrivateFieldGet(this, _NodeCascade_isInherited, "f") && !__classPrivateFieldGet(this, _NodeCascade_isHighlightPseudoCascade, "f") && !metadata.isPropertyInherited(property.name)) {
                    continue;
                }
                // When a property does not have a range in an otherwise ranged CSSStyleDeclaration,
                // we consider it as a non-leading property (see computeLeadingProperties()), and most
                // of them are computed longhands. We exclude these from activeProperties calculation,
                // and use parsed longhands instead (see below).
                if (style.range && !property.range) {
                    continue;
                }
                if (!property.activeInStyle()) {
                    this.propertiesState.set(property, "Overloaded" /* PropertyState.OVERLOADED */);
                    continue;
                }
                // If the custom property was registered with `inherits: false;`, inherited properties are invalid.
                if (__classPrivateFieldGet(this, _NodeCascade_isInherited, "f")) {
                    const registration = __classPrivateFieldGet(this, _NodeCascade_matchedStyles, "f").getRegisteredProperty(property.name);
                    if (registration && !registration.inherits()) {
                        this.propertiesState.set(property, "Overloaded" /* PropertyState.OVERLOADED */);
                        continue;
                    }
                }
                const canonicalName = metadata.canonicalPropertyName(property.name);
                this.updatePropertyState(property, canonicalName);
                for (const longhand of property.getLonghandProperties()) {
                    if (metadata.isCSSPropertyName(longhand.name)) {
                        this.updatePropertyState(longhand, longhand.name);
                    }
                }
            }
        }
    }
    updatePropertyState(propertyWithHigherSpecificity, canonicalName) {
        const activeProperty = this.activeProperties.get(canonicalName);
        if (activeProperty?.important && !propertyWithHigherSpecificity.important) {
            this.propertiesState.set(propertyWithHigherSpecificity, "Overloaded" /* PropertyState.OVERLOADED */);
            return;
        }
        if (activeProperty) {
            this.propertiesState.set(activeProperty, "Overloaded" /* PropertyState.OVERLOADED */);
        }
        this.propertiesState.set(propertyWithHigherSpecificity, "Active" /* PropertyState.ACTIVE */);
        this.activeProperties.set(canonicalName, propertyWithHigherSpecificity);
    }
}
_NodeCascade_matchedStyles = new WeakMap(), _NodeCascade_isInherited = new WeakMap(), _NodeCascade_isHighlightPseudoCascade = new WeakMap();
function isRegular(declaration) {
    return 'ownerStyle' in declaration;
}
export class CSSValueSource {
    constructor(declaration) {
        this.declaration = declaration;
    }
    get value() {
        return isRegular(this.declaration) ? this.declaration.value : this.declaration.initialValue();
    }
    get style() {
        return isRegular(this.declaration) ? this.declaration.ownerStyle : this.declaration.style();
    }
    get name() {
        return isRegular(this.declaration) ? this.declaration.name : this.declaration.propertyName();
    }
}
class SCCRecordEntry {
    get isRootEntry() {
        return this.rootDiscoveryTime === this.discoveryTime;
    }
    updateRoot(neighbor) {
        this.rootDiscoveryTime = Math.min(this.rootDiscoveryTime, neighbor.rootDiscoveryTime);
    }
    constructor(nodeCascade, name, discoveryTime) {
        this.nodeCascade = nodeCascade;
        this.name = name;
        this.discoveryTime = discoveryTime;
        this.rootDiscoveryTime = discoveryTime;
    }
}
class SCCRecord {
    constructor() {
        _SCCRecord_time.set(this, 0);
        _SCCRecord_stack.set(this, []);
        _SCCRecord_entries.set(this, new Map());
    }
    get(nodeCascade, variable) {
        return __classPrivateFieldGet(this, _SCCRecord_entries, "f").get(nodeCascade)?.get(variable);
    }
    add(nodeCascade, variable) {
        var _a, _b;
        const existing = this.get(nodeCascade, variable);
        if (existing) {
            return existing;
        }
        const entry = new SCCRecordEntry(nodeCascade, variable, (__classPrivateFieldSet(this, _SCCRecord_time, (_b = __classPrivateFieldGet(this, _SCCRecord_time, "f"), _a = _b++, _b), "f"), _a));
        __classPrivateFieldGet(this, _SCCRecord_stack, "f").push(entry);
        let map = __classPrivateFieldGet(this, _SCCRecord_entries, "f").get(nodeCascade);
        if (!map) {
            map = new Map();
            __classPrivateFieldGet(this, _SCCRecord_entries, "f").set(nodeCascade, map);
        }
        map.set(variable, entry);
        return entry;
    }
    isInInProgressSCC(childRecord) {
        return __classPrivateFieldGet(this, _SCCRecord_stack, "f").includes(childRecord);
    }
    finishSCC(root) {
        const startIndex = __classPrivateFieldGet(this, _SCCRecord_stack, "f").lastIndexOf(root);
        console.assert(startIndex >= 0, 'Root is not an in-progress scc');
        return __classPrivateFieldGet(this, _SCCRecord_stack, "f").splice(startIndex);
    }
}
_SCCRecord_time = new WeakMap(), _SCCRecord_stack = new WeakMap(), _SCCRecord_entries = new WeakMap();
function* forEach(array, startAfter) {
    const startIdx = startAfter !== undefined ? array.indexOf(startAfter) + 1 : 0;
    for (let i = startIdx; i < array.length; ++i) {
        yield array[i];
    }
}
class DOMInheritanceCascade {
    constructor(nodeCascades, registeredProperties) {
        _DOMInheritanceCascade_instances.add(this);
        _DOMInheritanceCascade_propertiesState.set(this, new Map());
        _DOMInheritanceCascade_availableCSSVariables.set(this, new Map());
        _DOMInheritanceCascade_computedCSSVariables.set(this, new Map());
        _DOMInheritanceCascade_styleToNodeCascade.set(this, new Map());
        _DOMInheritanceCascade_initialized.set(this, false);
        _DOMInheritanceCascade_nodeCascades.set(this, void 0);
        _DOMInheritanceCascade_registeredProperties.set(this, void 0);
        __classPrivateFieldSet(this, _DOMInheritanceCascade_nodeCascades, nodeCascades, "f");
        __classPrivateFieldSet(this, _DOMInheritanceCascade_registeredProperties, registeredProperties, "f");
        for (const nodeCascade of nodeCascades) {
            for (const style of nodeCascade.styles) {
                __classPrivateFieldGet(this, _DOMInheritanceCascade_styleToNodeCascade, "f").set(style, nodeCascade);
            }
        }
    }
    findAvailableCSSVariables(style) {
        const nodeCascade = __classPrivateFieldGet(this, _DOMInheritanceCascade_styleToNodeCascade, "f").get(style);
        if (!nodeCascade) {
            return [];
        }
        this.ensureInitialized();
        const availableCSSVariables = __classPrivateFieldGet(this, _DOMInheritanceCascade_availableCSSVariables, "f").get(nodeCascade);
        if (!availableCSSVariables) {
            return [];
        }
        return Array.from(availableCSSVariables.keys());
    }
    resolveProperty(name, ownerStyle) {
        const cascade = __classPrivateFieldGet(this, _DOMInheritanceCascade_styleToNodeCascade, "f").get(ownerStyle);
        if (!cascade) {
            return null;
        }
        for (const style of cascade.styles) {
            const candidate = style.allProperties().findLast(candidate => candidate.name === name);
            if (candidate) {
                return candidate;
            }
        }
        return __classPrivateFieldGet(this, _DOMInheritanceCascade_instances, "m", _DOMInheritanceCascade_findPropertyInParentCascadeIfInherited).call(this, { name, ownerStyle });
    }
    resolveGlobalKeyword(property, keyword) {
        const isPreviousLayer = (other) => {
            // If there's no parent rule on then it isn't layered and is thus not in a previous one.
            if (!(other.ownerStyle.parentRule instanceof CSSStyleRule)) {
                return false;
            }
            // Element-attached style -> author origin counts as a previous layer transition for revert-layer.
            if (property.ownerStyle.type === Type.Inline) {
                return true;
            }
            // Compare layers
            if (property.ownerStyle.parentRule instanceof CSSStyleRule &&
                other.ownerStyle.parentRule?.origin === "regular" /* Protocol.CSS.StyleSheetOrigin.Regular */) {
                return JSON.stringify(other.ownerStyle.parentRule.layers) !==
                    JSON.stringify(property.ownerStyle.parentRule.layers);
            }
            return false;
        };
        switch (keyword) {
            case "initial" /* CSSWideKeyword.INITIAL */:
                return __classPrivateFieldGet(this, _DOMInheritanceCascade_instances, "m", _DOMInheritanceCascade_findCustomPropertyRegistration).call(this, property.name);
            case "inherit" /* CSSWideKeyword.INHERIT */:
                return __classPrivateFieldGet(this, _DOMInheritanceCascade_instances, "m", _DOMInheritanceCascade_findPropertyInParentCascade).call(this, property) ?? __classPrivateFieldGet(this, _DOMInheritanceCascade_instances, "m", _DOMInheritanceCascade_findCustomPropertyRegistration).call(this, property.name);
            case "revert" /* CSSWideKeyword.REVERT */:
                return __classPrivateFieldGet(this, _DOMInheritanceCascade_instances, "m", _DOMInheritanceCascade_findPropertyInPreviousStyle).call(this, property, other => other.ownerStyle.parentRule !== null &&
                    other.ownerStyle.parentRule.origin !==
                        (property.ownerStyle.parentRule?.origin ?? "regular" /* Protocol.CSS.StyleSheetOrigin.Regular */)) ??
                    this.resolveGlobalKeyword(property, "unset" /* CSSWideKeyword.UNSET */);
            case "revert-layer" /* CSSWideKeyword.REVERT_LAYER */:
                return __classPrivateFieldGet(this, _DOMInheritanceCascade_instances, "m", _DOMInheritanceCascade_findPropertyInPreviousStyle).call(this, property, isPreviousLayer) ??
                    this.resolveGlobalKeyword(property, "revert" /* CSSWideKeyword.REVERT */);
            case "unset" /* CSSWideKeyword.UNSET */:
                return __classPrivateFieldGet(this, _DOMInheritanceCascade_instances, "m", _DOMInheritanceCascade_findPropertyInParentCascadeIfInherited).call(this, property) ??
                    __classPrivateFieldGet(this, _DOMInheritanceCascade_instances, "m", _DOMInheritanceCascade_findCustomPropertyRegistration).call(this, property.name);
        }
    }
    computeCSSVariable(style, variableName) {
        const nodeCascade = __classPrivateFieldGet(this, _DOMInheritanceCascade_styleToNodeCascade, "f").get(style);
        if (!nodeCascade) {
            return null;
        }
        this.ensureInitialized();
        return this.innerComputeCSSVariable(nodeCascade, variableName);
    }
    innerComputeCSSVariable(nodeCascade, variableName, sccRecord = new SCCRecord()) {
        const availableCSSVariables = __classPrivateFieldGet(this, _DOMInheritanceCascade_availableCSSVariables, "f").get(nodeCascade);
        const computedCSSVariables = __classPrivateFieldGet(this, _DOMInheritanceCascade_computedCSSVariables, "f").get(nodeCascade);
        if (!computedCSSVariables || !availableCSSVariables?.has(variableName)) {
            return null;
        }
        if (computedCSSVariables?.has(variableName)) {
            return computedCSSVariables.get(variableName) || null;
        }
        let definedValue = availableCSSVariables.get(variableName);
        if (definedValue === undefined || definedValue === null) {
            return null;
        }
        if (definedValue.declaration.declaration instanceof CSSProperty && definedValue.declaration.value &&
            CSSMetadata.isCSSWideKeyword(definedValue.declaration.value)) {
            const resolvedProperty = this.resolveGlobalKeyword(definedValue.declaration.declaration, definedValue.declaration.value);
            if (!resolvedProperty) {
                return definedValue;
            }
            const declaration = new CSSValueSource(resolvedProperty);
            const { value } = declaration;
            if (!value) {
                return definedValue;
            }
            definedValue = { declaration, value };
        }
        const ast = PropertyParser.tokenizeDeclaration(`--${variableName}`, definedValue.value);
        if (!ast) {
            return null;
        }
        // While computing CSS variable values we need to detect declaration cycles. Every declaration on the cycle is
        // invalid. However, var()s outside of the cycle that reference a property on the cycle are not automatically
        // invalid, but rather use the fallback value. We use a version of Tarjan's algorithm to detect cycles, which are
        // SCCs on the custom property dependency graph. Computing variable values is DFS. When encountering a previously
        // unseen variable, we record its discovery time. We keep a stack of visited variables and detect cycles when we
        // find a reference to a variable already on the stack. For each node we also keep track of the "root" of the
        // corresponding SCC, which is the node in that component with the smallest discovery time. This is determined by
        // bubbling up the minimum discovery time whenever we close a cycle.
        const record = sccRecord.add(nodeCascade, variableName);
        const matching = PropertyParser.BottomUpTreeMatching.walk(ast, [new BaseVariableMatcher(match => {
                const parentStyle = definedValue.declaration.style;
                const nodeCascade = __classPrivateFieldGet(this, _DOMInheritanceCascade_styleToNodeCascade, "f").get(parentStyle);
                if (!nodeCascade) {
                    return null;
                }
                const childRecord = sccRecord.get(nodeCascade, match.name);
                if (childRecord) {
                    if (sccRecord.isInInProgressSCC(childRecord)) {
                        // Cycle detected, update the root.
                        record.updateRoot(childRecord);
                        return null;
                    }
                    // We've seen the variable before, so we can look up the text directly.
                    return __classPrivateFieldGet(this, _DOMInheritanceCascade_computedCSSVariables, "f").get(nodeCascade)?.get(match.name)?.value ?? null;
                }
                const cssVariableValue = this.innerComputeCSSVariable(nodeCascade, match.name, sccRecord);
                // Variable reference is resolved, so return it.
                const newChildRecord = sccRecord.get(nodeCascade, match.name);
                // The SCC record for the referenced variable may not exist if the var was already computed in a previous
                // iteration. That means it's in a different SCC.
                newChildRecord && record.updateRoot(newChildRecord);
                if (cssVariableValue?.value !== undefined) {
                    return cssVariableValue.value;
                }
                // Variable reference is not resolved, use the fallback.
                if (!match.fallback) {
                    return null;
                }
                if (match.fallback.length === 0) {
                    return '';
                }
                if (match.matching.hasUnresolvedVarsRange(match.fallback[0], match.fallback[match.fallback.length - 1])) {
                    return null;
                }
                return match.matching.getComputedTextRange(match.fallback[0], match.fallback[match.fallback.length - 1]);
            })]);
        const decl = PropertyParser.ASTUtils.siblings(PropertyParser.ASTUtils.declValue(matching.ast.tree));
        const computedText = decl.length > 0 ? matching.getComputedTextRange(decl[0], decl[decl.length - 1]) : '';
        if (record.isRootEntry) {
            // Variables are kept on the stack until all descendents in the same SCC have been visited. That's the case when
            // completing the recursion on the root of the SCC.
            const scc = sccRecord.finishSCC(record);
            if (scc.length > 1) {
                for (const entry of scc) {
                    console.assert(entry.nodeCascade === nodeCascade, 'Circles should be within the cascade');
                    computedCSSVariables.set(entry.name, null);
                }
                return null;
            }
        }
        if (decl.length > 0 && matching.hasUnresolvedVarsRange(decl[0], decl[decl.length - 1])) {
            computedCSSVariables.set(variableName, null);
            return null;
        }
        const cssVariableValue = { value: computedText, declaration: definedValue.declaration };
        computedCSSVariables.set(variableName, cssVariableValue);
        return cssVariableValue;
    }
    styles() {
        return Array.from(__classPrivateFieldGet(this, _DOMInheritanceCascade_styleToNodeCascade, "f").keys());
    }
    propertyState(property) {
        this.ensureInitialized();
        return __classPrivateFieldGet(this, _DOMInheritanceCascade_propertiesState, "f").get(property) || null;
    }
    reset() {
        __classPrivateFieldSet(this, _DOMInheritanceCascade_initialized, false, "f");
        __classPrivateFieldGet(this, _DOMInheritanceCascade_propertiesState, "f").clear();
        __classPrivateFieldGet(this, _DOMInheritanceCascade_availableCSSVariables, "f").clear();
        __classPrivateFieldGet(this, _DOMInheritanceCascade_computedCSSVariables, "f").clear();
    }
    ensureInitialized() {
        if (__classPrivateFieldGet(this, _DOMInheritanceCascade_initialized, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _DOMInheritanceCascade_initialized, true, "f");
        const activeProperties = new Map();
        for (const nodeCascade of __classPrivateFieldGet(this, _DOMInheritanceCascade_nodeCascades, "f")) {
            nodeCascade.computeActiveProperties();
            for (const [property, state] of nodeCascade.propertiesState) {
                if (state === "Overloaded" /* PropertyState.OVERLOADED */) {
                    __classPrivateFieldGet(this, _DOMInheritanceCascade_propertiesState, "f").set(property, "Overloaded" /* PropertyState.OVERLOADED */);
                    continue;
                }
                const canonicalName = cssMetadata().canonicalPropertyName(property.name);
                if (activeProperties.has(canonicalName)) {
                    __classPrivateFieldGet(this, _DOMInheritanceCascade_propertiesState, "f").set(property, "Overloaded" /* PropertyState.OVERLOADED */);
                    continue;
                }
                activeProperties.set(canonicalName, property);
                __classPrivateFieldGet(this, _DOMInheritanceCascade_propertiesState, "f").set(property, "Active" /* PropertyState.ACTIVE */);
            }
        }
        // If every longhand of the shorthand is not active, then the shorthand is not active too.
        for (const [canonicalName, shorthandProperty] of activeProperties) {
            const shorthandStyle = shorthandProperty.ownerStyle;
            const longhands = shorthandProperty.getLonghandProperties();
            if (!longhands.length) {
                continue;
            }
            let hasActiveLonghands = false;
            for (const longhand of longhands) {
                const longhandCanonicalName = cssMetadata().canonicalPropertyName(longhand.name);
                const longhandActiveProperty = activeProperties.get(longhandCanonicalName);
                if (!longhandActiveProperty) {
                    continue;
                }
                if (longhandActiveProperty.ownerStyle === shorthandStyle) {
                    hasActiveLonghands = true;
                    break;
                }
            }
            if (hasActiveLonghands) {
                continue;
            }
            activeProperties.delete(canonicalName);
            __classPrivateFieldGet(this, _DOMInheritanceCascade_propertiesState, "f").set(shorthandProperty, "Overloaded" /* PropertyState.OVERLOADED */);
        }
        // Work inheritance chain backwards to compute visible CSS Variables.
        const accumulatedCSSVariables = new Map();
        for (const rule of __classPrivateFieldGet(this, _DOMInheritanceCascade_registeredProperties, "f")) {
            const initialValue = rule.initialValue();
            accumulatedCSSVariables.set(rule.propertyName(), initialValue !== null ? { value: initialValue, declaration: new CSSValueSource(rule) } : null);
        }
        for (let i = __classPrivateFieldGet(this, _DOMInheritanceCascade_nodeCascades, "f").length - 1; i >= 0; --i) {
            const nodeCascade = __classPrivateFieldGet(this, _DOMInheritanceCascade_nodeCascades, "f")[i];
            const variableNames = [];
            for (const entry of nodeCascade.activeProperties.entries()) {
                const propertyName = entry[0];
                const property = entry[1];
                if (propertyName.startsWith('--')) {
                    accumulatedCSSVariables.set(propertyName, { value: property.value, declaration: new CSSValueSource(property) });
                    variableNames.push(propertyName);
                }
            }
            const availableCSSVariablesMap = new Map(accumulatedCSSVariables);
            const computedVariablesMap = new Map();
            __classPrivateFieldGet(this, _DOMInheritanceCascade_availableCSSVariables, "f").set(nodeCascade, availableCSSVariablesMap);
            __classPrivateFieldGet(this, _DOMInheritanceCascade_computedCSSVariables, "f").set(nodeCascade, computedVariablesMap);
            for (const variableName of variableNames) {
                const prevValue = accumulatedCSSVariables.get(variableName);
                accumulatedCSSVariables.delete(variableName);
                const computedValue = this.innerComputeCSSVariable(nodeCascade, variableName);
                if (prevValue && computedValue?.value === prevValue.value) {
                    computedValue.declaration = prevValue.declaration;
                }
                accumulatedCSSVariables.set(variableName, computedValue);
            }
        }
    }
}
_DOMInheritanceCascade_propertiesState = new WeakMap(), _DOMInheritanceCascade_availableCSSVariables = new WeakMap(), _DOMInheritanceCascade_computedCSSVariables = new WeakMap(), _DOMInheritanceCascade_styleToNodeCascade = new WeakMap(), _DOMInheritanceCascade_initialized = new WeakMap(), _DOMInheritanceCascade_nodeCascades = new WeakMap(), _DOMInheritanceCascade_registeredProperties = new WeakMap(), _DOMInheritanceCascade_instances = new WeakSet(), _DOMInheritanceCascade_findPropertyInPreviousStyle = function _DOMInheritanceCascade_findPropertyInPreviousStyle(property, filter) {
    const cascade = __classPrivateFieldGet(this, _DOMInheritanceCascade_styleToNodeCascade, "f").get(property.ownerStyle);
    if (!cascade) {
        return null;
    }
    for (const style of forEach(cascade.styles, property.ownerStyle)) {
        const candidate = style.allProperties().findLast(candidate => candidate.name === property.name && filter(candidate));
        if (candidate) {
            return candidate;
        }
    }
    return null;
}, _DOMInheritanceCascade_findPropertyInParentCascade = function _DOMInheritanceCascade_findPropertyInParentCascade(property) {
    const nodeCascade = __classPrivateFieldGet(this, _DOMInheritanceCascade_styleToNodeCascade, "f").get(property.ownerStyle);
    if (!nodeCascade) {
        return null;
    }
    for (const cascade of forEach(__classPrivateFieldGet(this, _DOMInheritanceCascade_nodeCascades, "f"), nodeCascade)) {
        for (const style of cascade.styles) {
            const inheritedProperty = style.allProperties().findLast(inheritedProperty => inheritedProperty.name === property.name);
            if (inheritedProperty) {
                return inheritedProperty;
            }
        }
    }
    return null;
}, _DOMInheritanceCascade_findPropertyInParentCascadeIfInherited = function _DOMInheritanceCascade_findPropertyInParentCascadeIfInherited(property) {
    if (!cssMetadata().isPropertyInherited(property.name) ||
        !(__classPrivateFieldGet(this, _DOMInheritanceCascade_instances, "m", _DOMInheritanceCascade_findCustomPropertyRegistration).call(this, property.name)?.inherits() ?? true)) {
        return null;
    }
    return __classPrivateFieldGet(this, _DOMInheritanceCascade_instances, "m", _DOMInheritanceCascade_findPropertyInParentCascade).call(this, property);
}, _DOMInheritanceCascade_findCustomPropertyRegistration = function _DOMInheritanceCascade_findCustomPropertyRegistration(property) {
    const registration = __classPrivateFieldGet(this, _DOMInheritanceCascade_registeredProperties, "f").find(registration => registration.propertyName() === property);
    return registration ? registration : null;
};
export var PropertyState;
(function (PropertyState) {
    PropertyState["ACTIVE"] = "Active";
    PropertyState["OVERLOADED"] = "Overloaded";
})(PropertyState || (PropertyState = {}));
//# sourceMappingURL=CSSMatchedStyles.js.map