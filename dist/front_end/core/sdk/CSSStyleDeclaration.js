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
var _CSSStyleDeclaration_instances, _CSSStyleDeclaration_cssModelInternal, _CSSStyleDeclaration_allPropertiesInternal, _CSSStyleDeclaration_shorthandValues, _CSSStyleDeclaration_shorthandIsImportant, _CSSStyleDeclaration_activePropertyMap, _CSSStyleDeclaration_leadingPropertiesInternal, _CSSStyleDeclaration_animationName, _CSSStyleDeclaration_reinitialize, _CSSStyleDeclaration_generateSyntheticPropertiesIfNeeded, _CSSStyleDeclaration_computeLeadingProperties, _CSSStyleDeclaration_computeInactiveProperties, _CSSStyleDeclaration_insertionRange;
import * as TextUtils from '../../models/text_utils/text_utils.js';
import { cssMetadata } from './CSSMetadata.js';
import { CSSProperty } from './CSSProperty.js';
export class CSSStyleDeclaration {
    constructor(cssModel, parentRule, payload, type, animationName) {
        _CSSStyleDeclaration_instances.add(this);
        _CSSStyleDeclaration_cssModelInternal.set(this, void 0);
        _CSSStyleDeclaration_allPropertiesInternal.set(this, void 0);
        _CSSStyleDeclaration_shorthandValues.set(this, new Map());
        _CSSStyleDeclaration_shorthandIsImportant.set(this, new Set());
        _CSSStyleDeclaration_activePropertyMap.set(this, new Map());
        _CSSStyleDeclaration_leadingPropertiesInternal.set(this, void 0);
        // For CSSStyles coming from animations,
        // This holds the name of the animation.
        _CSSStyleDeclaration_animationName.set(this, void 0);
        __classPrivateFieldSet(this, _CSSStyleDeclaration_cssModelInternal, cssModel, "f");
        this.parentRule = parentRule;
        __classPrivateFieldGet(this, _CSSStyleDeclaration_instances, "m", _CSSStyleDeclaration_reinitialize).call(this, payload);
        this.type = type;
        __classPrivateFieldSet(this, _CSSStyleDeclaration_animationName, animationName, "f");
    }
    rebase(edit) {
        if (this.styleSheetId !== edit.styleSheetId || !this.range) {
            return;
        }
        if (edit.oldRange.equal(this.range)) {
            __classPrivateFieldGet(this, _CSSStyleDeclaration_instances, "m", _CSSStyleDeclaration_reinitialize).call(this, edit.payload);
        }
        else {
            this.range = this.range.rebaseAfterTextEdit(edit.oldRange, edit.newRange);
            for (let i = 0; i < __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f").length; ++i) {
                __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f")[i].rebase(edit);
            }
        }
    }
    animationName() {
        return __classPrivateFieldGet(this, _CSSStyleDeclaration_animationName, "f");
    }
    leadingProperties() {
        if (!__classPrivateFieldGet(this, _CSSStyleDeclaration_leadingPropertiesInternal, "f")) {
            __classPrivateFieldSet(this, _CSSStyleDeclaration_leadingPropertiesInternal, __classPrivateFieldGet(this, _CSSStyleDeclaration_instances, "m", _CSSStyleDeclaration_computeLeadingProperties).call(this), "f");
        }
        return __classPrivateFieldGet(this, _CSSStyleDeclaration_leadingPropertiesInternal, "f");
    }
    target() {
        return __classPrivateFieldGet(this, _CSSStyleDeclaration_cssModelInternal, "f").target();
    }
    cssModel() {
        return __classPrivateFieldGet(this, _CSSStyleDeclaration_cssModelInternal, "f");
    }
    allProperties() {
        return __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f");
    }
    hasActiveProperty(name) {
        return __classPrivateFieldGet(this, _CSSStyleDeclaration_activePropertyMap, "f").has(name);
    }
    getPropertyValue(name) {
        const property = __classPrivateFieldGet(this, _CSSStyleDeclaration_activePropertyMap, "f").get(name);
        return property ? property.value : '';
    }
    isPropertyImplicit(name) {
        const property = __classPrivateFieldGet(this, _CSSStyleDeclaration_activePropertyMap, "f").get(name);
        return property ? property.implicit : false;
    }
    propertyAt(index) {
        return (index < this.allProperties().length) ? this.allProperties()[index] : null;
    }
    pastLastSourcePropertyIndex() {
        for (let i = this.allProperties().length - 1; i >= 0; --i) {
            if (this.allProperties()[i].range) {
                return i + 1;
            }
        }
        return 0;
    }
    newBlankProperty(index) {
        index = (typeof index === 'undefined') ? this.pastLastSourcePropertyIndex() : index;
        const property = new CSSProperty(this, index, '', '', false, false, true, false, '', __classPrivateFieldGet(this, _CSSStyleDeclaration_instances, "m", _CSSStyleDeclaration_insertionRange).call(this, index));
        return property;
    }
    setText(text, majorChange) {
        if (!this.range || !this.styleSheetId) {
            return Promise.resolve(false);
        }
        return __classPrivateFieldGet(this, _CSSStyleDeclaration_cssModelInternal, "f").setStyleText(this.styleSheetId, this.range, text, majorChange);
    }
    insertPropertyAt(index, name, value, userCallback) {
        void this.newBlankProperty(index).setText(name + ': ' + value + ';', false, true).then(userCallback);
    }
    appendProperty(name, value, userCallback) {
        this.insertPropertyAt(this.allProperties().length, name, value, userCallback);
    }
}
_CSSStyleDeclaration_cssModelInternal = new WeakMap(), _CSSStyleDeclaration_allPropertiesInternal = new WeakMap(), _CSSStyleDeclaration_shorthandValues = new WeakMap(), _CSSStyleDeclaration_shorthandIsImportant = new WeakMap(), _CSSStyleDeclaration_activePropertyMap = new WeakMap(), _CSSStyleDeclaration_leadingPropertiesInternal = new WeakMap(), _CSSStyleDeclaration_animationName = new WeakMap(), _CSSStyleDeclaration_instances = new WeakSet(), _CSSStyleDeclaration_reinitialize = function _CSSStyleDeclaration_reinitialize(payload) {
    this.styleSheetId = payload.styleSheetId;
    this.range = payload.range ? TextUtils.TextRange.TextRange.fromObject(payload.range) : null;
    const shorthandEntries = payload.shorthandEntries;
    __classPrivateFieldSet(this, _CSSStyleDeclaration_shorthandValues, new Map(), "f");
    __classPrivateFieldSet(this, _CSSStyleDeclaration_shorthandIsImportant, new Set(), "f");
    for (let i = 0; i < shorthandEntries.length; ++i) {
        __classPrivateFieldGet(this, _CSSStyleDeclaration_shorthandValues, "f").set(shorthandEntries[i].name, shorthandEntries[i].value);
        if (shorthandEntries[i].important) {
            __classPrivateFieldGet(this, _CSSStyleDeclaration_shorthandIsImportant, "f").add(shorthandEntries[i].name);
        }
    }
    __classPrivateFieldSet(this, _CSSStyleDeclaration_allPropertiesInternal, [], "f");
    if (payload.cssText && this.range) {
        const longhands = [];
        for (const cssProperty of payload.cssProperties) {
            const range = cssProperty.range;
            if (!range) {
                continue;
            }
            const parsedProperty = CSSProperty.parsePayload(this, __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f").length, cssProperty);
            __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f").push(parsedProperty);
            for (const longhand of parsedProperty.getLonghandProperties()) {
                longhands.push(longhand);
            }
        }
        for (const longhand of longhands) {
            longhand.index = __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f").length;
            __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f").push(longhand);
        }
    }
    else {
        for (const cssProperty of payload.cssProperties) {
            __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f").push(CSSProperty.parsePayload(this, __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f").length, cssProperty));
        }
    }
    __classPrivateFieldGet(this, _CSSStyleDeclaration_instances, "m", _CSSStyleDeclaration_generateSyntheticPropertiesIfNeeded).call(this);
    __classPrivateFieldGet(this, _CSSStyleDeclaration_instances, "m", _CSSStyleDeclaration_computeInactiveProperties).call(this);
    // TODO(changhaohan): verify if this #activePropertyMap is still necessary, or if it is
    // providing different information against the activeness in allPropertiesInternal.
    __classPrivateFieldSet(this, _CSSStyleDeclaration_activePropertyMap, new Map(), "f");
    for (const property of __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f")) {
        if (!property.activeInStyle()) {
            continue;
        }
        __classPrivateFieldGet(this, _CSSStyleDeclaration_activePropertyMap, "f").set(property.name, property);
    }
    this.cssText = payload.cssText;
    __classPrivateFieldSet(this, _CSSStyleDeclaration_leadingPropertiesInternal, null, "f");
}, _CSSStyleDeclaration_generateSyntheticPropertiesIfNeeded = function _CSSStyleDeclaration_generateSyntheticPropertiesIfNeeded() {
    if (this.range) {
        return;
    }
    if (!__classPrivateFieldGet(this, _CSSStyleDeclaration_shorthandValues, "f").size) {
        return;
    }
    const propertiesSet = new Set();
    for (const property of __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f")) {
        propertiesSet.add(property.name);
    }
    const generatedProperties = [];
    // For style-based properties, generate #shorthands with values when possible.
    for (const property of __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f")) {
        // For style-based properties, try generating #shorthands.
        const shorthands = cssMetadata().getShorthands(property.name) || [];
        for (const shorthand of shorthands) {
            if (propertiesSet.has(shorthand)) {
                continue;
            } // There already is a shorthand this #longhand falls under.
            const shorthandValue = __classPrivateFieldGet(this, _CSSStyleDeclaration_shorthandValues, "f").get(shorthand);
            if (!shorthandValue) {
                continue;
            } // Never generate synthetic #shorthands when no value is available.
            // Generate synthetic shorthand we have a value for.
            const shorthandImportance = Boolean(__classPrivateFieldGet(this, _CSSStyleDeclaration_shorthandIsImportant, "f").has(shorthand));
            const shorthandProperty = new CSSProperty(this, this.allProperties().length, shorthand, shorthandValue, shorthandImportance, false, true, false);
            generatedProperties.push(shorthandProperty);
            propertiesSet.add(shorthand);
        }
    }
    __classPrivateFieldSet(this, _CSSStyleDeclaration_allPropertiesInternal, __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f").concat(generatedProperties), "f");
}, _CSSStyleDeclaration_computeLeadingProperties = function _CSSStyleDeclaration_computeLeadingProperties() {
    function propertyHasRange(property) {
        return Boolean(property.range);
    }
    if (this.range) {
        return __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f").filter(propertyHasRange);
    }
    const leadingProperties = [];
    for (const property of __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f")) {
        const shorthands = cssMetadata().getShorthands(property.name) || [];
        let belongToAnyShorthand = false;
        for (const shorthand of shorthands) {
            if (__classPrivateFieldGet(this, _CSSStyleDeclaration_shorthandValues, "f").get(shorthand)) {
                belongToAnyShorthand = true;
                break;
            }
        }
        if (!belongToAnyShorthand) {
            leadingProperties.push(property);
        }
    }
    return leadingProperties;
}, _CSSStyleDeclaration_computeInactiveProperties = function _CSSStyleDeclaration_computeInactiveProperties() {
    const activeProperties = new Map();
    // The order of the properties are:
    // 1. regular property, including shorthands
    // 2. longhand components from shorthands, in the order of their shorthands.
    const processedLonghands = new Set();
    for (const property of __classPrivateFieldGet(this, _CSSStyleDeclaration_allPropertiesInternal, "f")) {
        const metadata = cssMetadata();
        const canonicalName = metadata.canonicalPropertyName(property.name);
        if (property.disabled || !property.parsedOk) {
            if (!property.disabled && metadata.isCustomProperty(property.name)) {
                // Variable declarations that aren't parsedOk still "overload" other previous active declarations.
                activeProperties.get(canonicalName)?.setActive(false);
                activeProperties.delete(canonicalName);
            }
            property.setActive(false);
            continue;
        }
        if (processedLonghands.has(property)) {
            continue;
        }
        for (const longhand of property.getLonghandProperties()) {
            const activeLonghand = activeProperties.get(longhand.name);
            if (!activeLonghand) {
                activeProperties.set(longhand.name, longhand);
            }
            else if (!activeLonghand.important || longhand.important) {
                activeLonghand.setActive(false);
                activeProperties.set(longhand.name, longhand);
            }
            else {
                longhand.setActive(false);
            }
            processedLonghands.add(longhand);
        }
        const activeProperty = activeProperties.get(canonicalName);
        if (!activeProperty) {
            activeProperties.set(canonicalName, property);
        }
        else if (!activeProperty.important || property.important) {
            activeProperty.setActive(false);
            activeProperties.set(canonicalName, property);
        }
        else {
            property.setActive(false);
        }
    }
}, _CSSStyleDeclaration_insertionRange = function _CSSStyleDeclaration_insertionRange(index) {
    const property = this.propertyAt(index);
    if (property?.range) {
        return property.range.collapseToStart();
    }
    if (!this.range) {
        throw new Error('CSSStyleDeclaration.range is null');
    }
    return this.range.collapseToEnd();
};
export var Type;
(function (Type) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Type["Regular"] = "Regular";
    Type["Inline"] = "Inline";
    Type["Attributes"] = "Attributes";
    Type["Pseudo"] = "Pseudo";
    Type["Transition"] = "Transition";
    Type["Animation"] = "Animation";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Type || (Type = {}));
//# sourceMappingURL=CSSStyleDeclaration.js.map