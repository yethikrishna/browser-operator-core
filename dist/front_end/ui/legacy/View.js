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
var _SimpleView_title, _SimpleView_viewId;
import * as Platform from '../../core/platform/platform.js';
import { ViewManager } from './ViewManager.js';
import { VBox } from './Widget.js';
export class SimpleView extends VBox {
    constructor(title, useShadowDom, viewId) {
        super(useShadowDom);
        _SimpleView_title.set(this, void 0);
        _SimpleView_viewId.set(this, void 0);
        __classPrivateFieldSet(this, _SimpleView_title, title, "f");
        if (viewId) {
            if (!Platform.StringUtilities.isExtendedKebabCase(viewId)) {
                throw new Error(`Invalid view ID '${viewId}'`);
            }
        }
        __classPrivateFieldSet(this, _SimpleView_viewId, viewId ?? Platform.StringUtilities.toKebabCase(title), "f");
    }
    viewId() {
        return __classPrivateFieldGet(this, _SimpleView_viewId, "f");
    }
    title() {
        return __classPrivateFieldGet(this, _SimpleView_title, "f");
    }
    isCloseable() {
        return false;
    }
    isTransient() {
        return false;
    }
    toolbarItems() {
        return Promise.resolve([]);
    }
    widget() {
        return Promise.resolve(this);
    }
    revealView() {
        return ViewManager.instance().revealView(this);
    }
    disposeView() {
    }
    isPreviewFeature() {
        return false;
    }
    iconName() {
        return undefined;
    }
}
_SimpleView_title = new WeakMap(), _SimpleView_viewId = new WeakMap();
//# sourceMappingURL=View.js.map