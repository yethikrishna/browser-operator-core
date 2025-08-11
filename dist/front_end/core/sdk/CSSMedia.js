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
var _CSSMediaQuery_activeInternal, _CSSMediaQuery_expressionsInternal, _CSSMediaQueryExpression_valueInternal, _CSSMediaQueryExpression_unitInternal, _CSSMediaQueryExpression_featureInternal, _CSSMediaQueryExpression_valueRangeInternal, _CSSMediaQueryExpression_computedLengthInternal;
import * as TextUtils from '../../models/text_utils/text_utils.js';
import { CSSQuery } from './CSSQuery.js';
export class CSSMediaQuery {
    constructor(payload) {
        _CSSMediaQuery_activeInternal.set(this, void 0);
        _CSSMediaQuery_expressionsInternal.set(this, void 0);
        __classPrivateFieldSet(this, _CSSMediaQuery_activeInternal, payload.active, "f");
        __classPrivateFieldSet(this, _CSSMediaQuery_expressionsInternal, [], "f");
        for (let j = 0; j < payload.expressions.length; ++j) {
            __classPrivateFieldGet(this, _CSSMediaQuery_expressionsInternal, "f").push(CSSMediaQueryExpression.parsePayload(payload.expressions[j]));
        }
    }
    static parsePayload(payload) {
        return new CSSMediaQuery(payload);
    }
    active() {
        return __classPrivateFieldGet(this, _CSSMediaQuery_activeInternal, "f");
    }
    expressions() {
        return __classPrivateFieldGet(this, _CSSMediaQuery_expressionsInternal, "f");
    }
}
_CSSMediaQuery_activeInternal = new WeakMap(), _CSSMediaQuery_expressionsInternal = new WeakMap();
export class CSSMediaQueryExpression {
    constructor(payload) {
        _CSSMediaQueryExpression_valueInternal.set(this, void 0);
        _CSSMediaQueryExpression_unitInternal.set(this, void 0);
        _CSSMediaQueryExpression_featureInternal.set(this, void 0);
        _CSSMediaQueryExpression_valueRangeInternal.set(this, void 0);
        _CSSMediaQueryExpression_computedLengthInternal.set(this, void 0);
        __classPrivateFieldSet(this, _CSSMediaQueryExpression_valueInternal, payload.value, "f");
        __classPrivateFieldSet(this, _CSSMediaQueryExpression_unitInternal, payload.unit, "f");
        __classPrivateFieldSet(this, _CSSMediaQueryExpression_featureInternal, payload.feature, "f");
        __classPrivateFieldSet(this, _CSSMediaQueryExpression_valueRangeInternal, payload.valueRange ? TextUtils.TextRange.TextRange.fromObject(payload.valueRange) : null, "f");
        __classPrivateFieldSet(this, _CSSMediaQueryExpression_computedLengthInternal, payload.computedLength || null, "f");
    }
    static parsePayload(payload) {
        return new CSSMediaQueryExpression(payload);
    }
    value() {
        return __classPrivateFieldGet(this, _CSSMediaQueryExpression_valueInternal, "f");
    }
    unit() {
        return __classPrivateFieldGet(this, _CSSMediaQueryExpression_unitInternal, "f");
    }
    feature() {
        return __classPrivateFieldGet(this, _CSSMediaQueryExpression_featureInternal, "f");
    }
    valueRange() {
        return __classPrivateFieldGet(this, _CSSMediaQueryExpression_valueRangeInternal, "f");
    }
    computedLength() {
        return __classPrivateFieldGet(this, _CSSMediaQueryExpression_computedLengthInternal, "f");
    }
}
_CSSMediaQueryExpression_valueInternal = new WeakMap(), _CSSMediaQueryExpression_unitInternal = new WeakMap(), _CSSMediaQueryExpression_featureInternal = new WeakMap(), _CSSMediaQueryExpression_valueRangeInternal = new WeakMap(), _CSSMediaQueryExpression_computedLengthInternal = new WeakMap();
export class CSSMedia extends CSSQuery {
    static parseMediaArrayPayload(cssModel, payload) {
        return payload.map(mq => new CSSMedia(cssModel, mq));
    }
    constructor(cssModel, payload) {
        super(cssModel);
        this.reinitialize(payload);
    }
    reinitialize(payload) {
        this.text = payload.text;
        this.source = payload.source;
        this.sourceURL = payload.sourceURL || '';
        this.range = payload.range ? TextUtils.TextRange.TextRange.fromObject(payload.range) : null;
        this.styleSheetId = payload.styleSheetId;
        this.mediaList = null;
        if (payload.mediaList) {
            this.mediaList = [];
            for (let i = 0; i < payload.mediaList.length; ++i) {
                this.mediaList.push(CSSMediaQuery.parsePayload(payload.mediaList[i]));
            }
        }
    }
    active() {
        if (!this.mediaList) {
            return true;
        }
        for (let i = 0; i < this.mediaList.length; ++i) {
            if (this.mediaList[i].active()) {
                return true;
            }
        }
        return false;
    }
}
export const Source = {
    LINKED_SHEET: 'linkedSheet',
    INLINE_SHEET: 'inlineSheet',
    MEDIA_RULE: 'mediaRule',
    IMPORT_RULE: 'importRule',
};
//# sourceMappingURL=CSSMedia.js.map