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
var _CSSPropertyRule_name, _CSSFontPaletteValuesRule_paletteName, _CSSKeyframesRule_animationName, _CSSKeyframesRule_keyframesInternal, _CSSKeyframeRule_keyText, _CSSKeyframeRule_parentRuleName, _CSSPositionTryRule_name, _CSSPositionTryRule_active, _CSSFunctionRule_name, _CSSFunctionRule_parameters, _CSSFunctionRule_children;
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Platform from '../platform/platform.js';
import { CSSContainerQuery } from './CSSContainerQuery.js';
import { CSSLayer } from './CSSLayer.js';
import { CSSMedia } from './CSSMedia.js';
import { CSSScope } from './CSSScope.js';
import { CSSStyleDeclaration, Type } from './CSSStyleDeclaration.js';
import { CSSSupports } from './CSSSupports.js';
export class CSSRule {
    constructor(cssModel, payload) {
        this.cssModelInternal = cssModel;
        this.styleSheetId = payload.styleSheetId;
        if (this.styleSheetId) {
            const styleSheetHeader = this.getStyleSheetHeader(this.styleSheetId);
            this.sourceURL = styleSheetHeader.sourceURL;
        }
        this.origin = payload.origin;
        this.style = new CSSStyleDeclaration(this.cssModelInternal, this, payload.style, Type.Regular);
    }
    rebase(edit) {
        if (this.styleSheetId !== edit.styleSheetId) {
            return;
        }
        this.style.rebase(edit);
    }
    resourceURL() {
        if (!this.styleSheetId) {
            return Platform.DevToolsPath.EmptyUrlString;
        }
        const styleSheetHeader = this.getStyleSheetHeader(this.styleSheetId);
        return styleSheetHeader.resourceURL();
    }
    isUserAgent() {
        return this.origin === "user-agent" /* Protocol.CSS.StyleSheetOrigin.UserAgent */;
    }
    isInjected() {
        return this.origin === "injected" /* Protocol.CSS.StyleSheetOrigin.Injected */;
    }
    isViaInspector() {
        return this.origin === "inspector" /* Protocol.CSS.StyleSheetOrigin.Inspector */;
    }
    isRegular() {
        return this.origin === "regular" /* Protocol.CSS.StyleSheetOrigin.Regular */;
    }
    isKeyframeRule() {
        return false;
    }
    cssModel() {
        return this.cssModelInternal;
    }
    getStyleSheetHeader(styleSheetId) {
        const styleSheetHeader = this.cssModelInternal.styleSheetHeaderForId(styleSheetId);
        console.assert(styleSheetHeader !== null);
        return styleSheetHeader;
    }
}
class CSSValue {
    constructor(payload) {
        this.text = payload.text;
        if (payload.range) {
            this.range = TextUtils.TextRange.TextRange.fromObject(payload.range);
        }
        if (payload.specificity) {
            this.specificity = payload.specificity;
        }
    }
    rebase(edit) {
        if (!this.range) {
            return;
        }
        this.range = this.range.rebaseAfterTextEdit(edit.oldRange, edit.newRange);
    }
}
export class CSSStyleRule extends CSSRule {
    constructor(cssModel, payload, wasUsed) {
        super(cssModel, { origin: payload.origin, style: payload.style, styleSheetId: payload.styleSheetId });
        this.reinitializeSelectors(payload.selectorList);
        this.nestingSelectors = payload.nestingSelectors;
        this.media = payload.media ? CSSMedia.parseMediaArrayPayload(cssModel, payload.media) : [];
        this.containerQueries = payload.containerQueries ?
            CSSContainerQuery.parseContainerQueriesPayload(cssModel, payload.containerQueries) :
            [];
        this.scopes = payload.scopes ? CSSScope.parseScopesPayload(cssModel, payload.scopes) : [];
        this.supports = payload.supports ? CSSSupports.parseSupportsPayload(cssModel, payload.supports) : [];
        this.layers = payload.layers ? CSSLayer.parseLayerPayload(cssModel, payload.layers) : [];
        this.ruleTypes = payload.ruleTypes || [];
        this.wasUsed = wasUsed || false;
    }
    static createDummyRule(cssModel, selectorText) {
        const dummyPayload = {
            selectorList: {
                text: '',
                selectors: [{ text: selectorText, value: undefined }],
            },
            style: {
                styleSheetId: '0',
                range: new TextUtils.TextRange.TextRange(0, 0, 0, 0),
                shorthandEntries: [],
                cssProperties: [],
            },
            origin: "inspector" /* Protocol.CSS.StyleSheetOrigin.Inspector */,
        };
        return new CSSStyleRule(cssModel, dummyPayload);
    }
    reinitializeSelectors(selectorList) {
        this.selectors = [];
        for (let i = 0; i < selectorList.selectors.length; ++i) {
            this.selectors.push(new CSSValue(selectorList.selectors[i]));
        }
    }
    setSelectorText(newSelector) {
        const styleSheetId = this.styleSheetId;
        if (!styleSheetId) {
            throw new Error('No rule stylesheet id');
        }
        const range = this.selectorRange();
        if (!range) {
            throw new Error('Rule selector is not editable');
        }
        return this.cssModelInternal.setSelectorText(styleSheetId, range, newSelector);
    }
    selectorText() {
        return this.selectors.map(selector => selector.text).join(', ');
    }
    selectorRange() {
        // Nested group rules might not contain a selector.
        // https://www.w3.org/TR/css-nesting-1/#conditionals
        if (this.selectors.length === 0) {
            return null;
        }
        const firstRange = this.selectors[0].range;
        const lastRange = this.selectors[this.selectors.length - 1].range;
        if (!firstRange || !lastRange) {
            return null;
        }
        return new TextUtils.TextRange.TextRange(firstRange.startLine, firstRange.startColumn, lastRange.endLine, lastRange.endColumn);
    }
    lineNumberInSource(selectorIndex) {
        const selector = this.selectors[selectorIndex];
        if (!selector?.range || !this.styleSheetId) {
            return 0;
        }
        const styleSheetHeader = this.getStyleSheetHeader(this.styleSheetId);
        return styleSheetHeader.lineNumberInSource(selector.range.startLine);
    }
    columnNumberInSource(selectorIndex) {
        const selector = this.selectors[selectorIndex];
        if (!selector?.range || !this.styleSheetId) {
            return undefined;
        }
        const styleSheetHeader = this.getStyleSheetHeader(this.styleSheetId);
        return styleSheetHeader.columnNumberInSource(selector.range.startLine, selector.range.startColumn);
    }
    rebase(edit) {
        if (this.styleSheetId !== edit.styleSheetId) {
            return;
        }
        const range = this.selectorRange();
        if (range?.equal(edit.oldRange)) {
            this.reinitializeSelectors(edit.payload);
        }
        else {
            for (let i = 0; i < this.selectors.length; ++i) {
                this.selectors[i].rebase(edit);
            }
        }
        this.media.forEach(media => media.rebase(edit));
        this.containerQueries.forEach(cq => cq.rebase(edit));
        this.scopes.forEach(scope => scope.rebase(edit));
        this.supports.forEach(supports => supports.rebase(edit));
        super.rebase(edit);
    }
}
export class CSSPropertyRule extends CSSRule {
    constructor(cssModel, payload) {
        super(cssModel, { origin: payload.origin, style: payload.style, styleSheetId: payload.styleSheetId });
        _CSSPropertyRule_name.set(this, void 0);
        __classPrivateFieldSet(this, _CSSPropertyRule_name, new CSSValue(payload.propertyName), "f");
    }
    propertyName() {
        return __classPrivateFieldGet(this, _CSSPropertyRule_name, "f");
    }
    initialValue() {
        return this.style.hasActiveProperty('initial-value') ? this.style.getPropertyValue('initial-value') : null;
    }
    syntax() {
        return this.style.getPropertyValue('syntax');
    }
    inherits() {
        return this.style.getPropertyValue('inherits') === 'true';
    }
    setPropertyName(newPropertyName) {
        const styleSheetId = this.styleSheetId;
        if (!styleSheetId) {
            throw new Error('No rule stylesheet id');
        }
        const range = __classPrivateFieldGet(this, _CSSPropertyRule_name, "f").range;
        if (!range) {
            throw new Error('Property name is not editable');
        }
        return this.cssModelInternal.setPropertyRulePropertyName(styleSheetId, range, newPropertyName);
    }
}
_CSSPropertyRule_name = new WeakMap();
export class CSSFontPaletteValuesRule extends CSSRule {
    constructor(cssModel, payload) {
        super(cssModel, { origin: payload.origin, style: payload.style, styleSheetId: payload.styleSheetId });
        _CSSFontPaletteValuesRule_paletteName.set(this, void 0);
        __classPrivateFieldSet(this, _CSSFontPaletteValuesRule_paletteName, new CSSValue(payload.fontPaletteName), "f");
    }
    name() {
        return __classPrivateFieldGet(this, _CSSFontPaletteValuesRule_paletteName, "f");
    }
}
_CSSFontPaletteValuesRule_paletteName = new WeakMap();
export class CSSKeyframesRule {
    constructor(cssModel, payload) {
        _CSSKeyframesRule_animationName.set(this, void 0);
        _CSSKeyframesRule_keyframesInternal.set(this, void 0);
        __classPrivateFieldSet(this, _CSSKeyframesRule_animationName, new CSSValue(payload.animationName), "f");
        __classPrivateFieldSet(this, _CSSKeyframesRule_keyframesInternal, payload.keyframes.map(keyframeRule => new CSSKeyframeRule(cssModel, keyframeRule, __classPrivateFieldGet(this, _CSSKeyframesRule_animationName, "f").text)), "f");
    }
    name() {
        return __classPrivateFieldGet(this, _CSSKeyframesRule_animationName, "f");
    }
    keyframes() {
        return __classPrivateFieldGet(this, _CSSKeyframesRule_keyframesInternal, "f");
    }
}
_CSSKeyframesRule_animationName = new WeakMap(), _CSSKeyframesRule_keyframesInternal = new WeakMap();
export class CSSKeyframeRule extends CSSRule {
    constructor(cssModel, payload, parentRuleName) {
        super(cssModel, { origin: payload.origin, style: payload.style, styleSheetId: payload.styleSheetId });
        _CSSKeyframeRule_keyText.set(this, void 0);
        _CSSKeyframeRule_parentRuleName.set(this, void 0);
        this.reinitializeKey(payload.keyText);
        __classPrivateFieldSet(this, _CSSKeyframeRule_parentRuleName, parentRuleName, "f");
    }
    parentRuleName() {
        return __classPrivateFieldGet(this, _CSSKeyframeRule_parentRuleName, "f");
    }
    key() {
        return __classPrivateFieldGet(this, _CSSKeyframeRule_keyText, "f");
    }
    reinitializeKey(payload) {
        __classPrivateFieldSet(this, _CSSKeyframeRule_keyText, new CSSValue(payload), "f");
    }
    rebase(edit) {
        if (this.styleSheetId !== edit.styleSheetId || !__classPrivateFieldGet(this, _CSSKeyframeRule_keyText, "f").range) {
            return;
        }
        if (edit.oldRange.equal(__classPrivateFieldGet(this, _CSSKeyframeRule_keyText, "f").range)) {
            this.reinitializeKey(edit.payload);
        }
        else {
            __classPrivateFieldGet(this, _CSSKeyframeRule_keyText, "f").rebase(edit);
        }
        super.rebase(edit);
    }
    isKeyframeRule() {
        return true;
    }
    setKeyText(newKeyText) {
        const styleSheetId = this.styleSheetId;
        if (!styleSheetId) {
            throw new Error('No rule stylesheet id');
        }
        const range = __classPrivateFieldGet(this, _CSSKeyframeRule_keyText, "f").range;
        if (!range) {
            throw new Error('Keyframe key is not editable');
        }
        return this.cssModelInternal.setKeyframeKey(styleSheetId, range, newKeyText);
    }
}
_CSSKeyframeRule_keyText = new WeakMap(), _CSSKeyframeRule_parentRuleName = new WeakMap();
export class CSSPositionTryRule extends CSSRule {
    constructor(cssModel, payload) {
        super(cssModel, { origin: payload.origin, style: payload.style, styleSheetId: payload.styleSheetId });
        _CSSPositionTryRule_name.set(this, void 0);
        _CSSPositionTryRule_active.set(this, void 0);
        __classPrivateFieldSet(this, _CSSPositionTryRule_name, new CSSValue(payload.name), "f");
        __classPrivateFieldSet(this, _CSSPositionTryRule_active, payload.active, "f");
    }
    name() {
        return __classPrivateFieldGet(this, _CSSPositionTryRule_name, "f");
    }
    active() {
        return __classPrivateFieldGet(this, _CSSPositionTryRule_active, "f");
    }
}
_CSSPositionTryRule_name = new WeakMap(), _CSSPositionTryRule_active = new WeakMap();
export class CSSFunctionRule extends CSSRule {
    constructor(cssModel, payload) {
        super(cssModel, { origin: payload.origin, style: { cssProperties: [], shorthandEntries: [] }, styleSheetId: payload.styleSheetId });
        _CSSFunctionRule_name.set(this, void 0);
        _CSSFunctionRule_parameters.set(this, void 0);
        _CSSFunctionRule_children.set(this, void 0);
        __classPrivateFieldSet(this, _CSSFunctionRule_name, new CSSValue(payload.name), "f");
        __classPrivateFieldSet(this, _CSSFunctionRule_parameters, payload.parameters.map(({ name }) => name), "f");
        __classPrivateFieldSet(this, _CSSFunctionRule_children, this.protocolNodesToNestedStyles(payload.children), "f");
    }
    functionName() {
        return __classPrivateFieldGet(this, _CSSFunctionRule_name, "f");
    }
    parameters() {
        return __classPrivateFieldGet(this, _CSSFunctionRule_parameters, "f");
    }
    children() {
        return __classPrivateFieldGet(this, _CSSFunctionRule_children, "f");
    }
    nameWithParameters() {
        return `${this.functionName().text}(${this.parameters().join(', ')})`;
    }
    protocolNodesToNestedStyles(nodes) {
        const result = [];
        for (const node of nodes) {
            const nestedStyle = this.protocolNodeToNestedStyle(node);
            if (nestedStyle) {
                result.push(nestedStyle);
            }
        }
        return result;
    }
    protocolNodeToNestedStyle(node) {
        if (node.style) {
            return { style: new CSSStyleDeclaration(this.cssModelInternal, this, node.style, Type.Regular) };
        }
        if (node.condition) {
            const children = this.protocolNodesToNestedStyles(node.condition.children);
            if (node.condition.media) {
                return { children, media: new CSSMedia(this.cssModelInternal, node.condition.media) };
            }
            if (node.condition.containerQueries) {
                return {
                    children,
                    container: new CSSContainerQuery(this.cssModelInternal, node.condition.containerQueries),
                };
            }
            if (node.condition.supports) {
                return {
                    children,
                    supports: new CSSSupports(this.cssModelInternal, node.condition.supports),
                };
            }
            console.error('A function rule condition must have a media, container, or supports');
            return;
        }
        console.error('A function rule node must have a style or condition');
        return;
    }
}
_CSSFunctionRule_name = new WeakMap(), _CSSFunctionRule_parameters = new WeakMap(), _CSSFunctionRule_children = new WeakMap();
//# sourceMappingURL=CSSRule.js.map