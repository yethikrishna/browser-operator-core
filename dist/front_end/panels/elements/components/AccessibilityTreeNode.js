// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _AccessibilityTreeNode_instances, _AccessibilityTreeNode_shadow, _AccessibilityTreeNode_ignored, _AccessibilityTreeNode_name, _AccessibilityTreeNode_role, _AccessibilityTreeNode_properties, _AccessibilityTreeNode_id, _AccessibilityTreeNode_render;
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as UI from '../../../ui/legacy/legacy.js';
import { html, nothing, render } from '../../../ui/lit/lit.js';
import accessibilityTreeNodeStyles from './accessibilityTreeNode.css.js';
const UIStrings = {
    /**
     *@description Ignored node element text content in Accessibility Tree View of the Elements panel
     */
    ignored: 'Ignored',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/components/AccessibilityTreeNode.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
// TODO(jobay) move this to Platform.StringUtilities if still needed.
// This function is a variant of setTextContentTruncatedIfNeeded found in DOMExtension.
function truncateTextIfNeeded(text) {
    const maxTextContentLength = 10000;
    if (text.length > maxTextContentLength) {
        return Platform.StringUtilities.trimMiddle(text, maxTextContentLength);
    }
    return text;
}
function isPrintable(valueType) {
    switch (valueType) {
        case "boolean" /* Protocol.Accessibility.AXValueType.Boolean */:
        case "booleanOrUndefined" /* Protocol.Accessibility.AXValueType.BooleanOrUndefined */:
        case "string" /* Protocol.Accessibility.AXValueType.String */:
        case "number" /* Protocol.Accessibility.AXValueType.Number */:
            return true;
        default:
            return false;
    }
}
export class AccessibilityTreeNode extends HTMLElement {
    constructor() {
        super(...arguments);
        _AccessibilityTreeNode_instances.add(this);
        _AccessibilityTreeNode_shadow.set(this, UI.UIUtils.createShadowRootWithCoreStyles(this, { cssFile: accessibilityTreeNodeStyles }));
        _AccessibilityTreeNode_ignored.set(this, true);
        _AccessibilityTreeNode_name.set(this, '');
        _AccessibilityTreeNode_role.set(this, '');
        _AccessibilityTreeNode_properties.set(this, []);
        _AccessibilityTreeNode_id.set(this, '');
    }
    set data(data) {
        __classPrivateFieldSet(this, _AccessibilityTreeNode_ignored, data.ignored, "f");
        __classPrivateFieldSet(this, _AccessibilityTreeNode_name, data.name, "f");
        __classPrivateFieldSet(this, _AccessibilityTreeNode_role, data.role, "f");
        __classPrivateFieldSet(this, _AccessibilityTreeNode_properties, data.properties, "f");
        __classPrivateFieldSet(this, _AccessibilityTreeNode_id, data.id, "f");
        void __classPrivateFieldGet(this, _AccessibilityTreeNode_instances, "m", _AccessibilityTreeNode_render).call(this);
    }
}
_AccessibilityTreeNode_shadow = new WeakMap(), _AccessibilityTreeNode_ignored = new WeakMap(), _AccessibilityTreeNode_name = new WeakMap(), _AccessibilityTreeNode_role = new WeakMap(), _AccessibilityTreeNode_properties = new WeakMap(), _AccessibilityTreeNode_id = new WeakMap(), _AccessibilityTreeNode_instances = new WeakSet(), _AccessibilityTreeNode_render = async function _AccessibilityTreeNode_render() {
    const role = html `<span class='role-value'>${truncateTextIfNeeded(__classPrivateFieldGet(this, _AccessibilityTreeNode_role, "f"))}</span>`;
    const name = html `"<span class='attribute-value'>${__classPrivateFieldGet(this, _AccessibilityTreeNode_name, "f")}</span>"`;
    const properties = __classPrivateFieldGet(this, _AccessibilityTreeNode_properties, "f").map(({ name, value }) => isPrintable(value.type) ?
        html ` <span class='attribute-name'>${name}</span>:&nbsp;<span class='attribute-value'>${value.value}</span>` :
        nothing);
    const content = __classPrivateFieldGet(this, _AccessibilityTreeNode_ignored, "f") ? html `<span>${i18nString(UIStrings.ignored)}</span>` : html `${role}&nbsp;${name}${properties}`;
    await RenderCoordinator.write(`Accessibility node ${__classPrivateFieldGet(this, _AccessibilityTreeNode_id, "f")} render`, () => {
        // clang-format off
        render(html `<div class='container'>${content}</div>`, __classPrivateFieldGet(this, _AccessibilityTreeNode_shadow, "f"), { host: this });
        // clang-format on
    });
};
customElements.define('devtools-accessibility-tree-node', AccessibilityTreeNode);
//# sourceMappingURL=AccessibilityTreeNode.js.map