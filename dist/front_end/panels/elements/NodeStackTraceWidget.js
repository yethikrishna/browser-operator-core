// Copyright 2019 The Chromium Authors. All rights reserved.
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
var _NodeStackTraceWidget_linkifier, _NodeStackTraceWidget_view;
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Components from '../../ui/legacy/components/utils/utils.js';
import * as UI from '../../ui/legacy/legacy.js';
import { html, render } from '../../ui/lit/lit.js';
import nodeStackTraceWidgetStyles from './nodeStackTraceWidget.css.js';
const UIStrings = {
    /**
     *@description Message displayed when no JavaScript stack trace is available for the DOM node in the Stack Trace widget of the Elements panel
     */
    noStackTraceAvailable: 'No stack trace available',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/NodeStackTraceWidget.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export const DEFAULT_VIEW = (input, _output, target) => {
    // clang-format off
    render(html `
    <style>${nodeStackTraceWidgetStyles}</style>
    ${input.stackTracePreview ?
        html `<div class="stack-trace">${input.stackTracePreview}</div>` :
        html `<div class="gray-info-message">${i18nString(UIStrings.noStackTraceAvailable)}</div>`}`, target, { host: input });
    // clang-format on
};
export class NodeStackTraceWidget extends UI.ThrottledWidget.ThrottledWidget {
    constructor(view = DEFAULT_VIEW) {
        super(true /* isWebComponent */);
        _NodeStackTraceWidget_linkifier.set(this, new Components.Linkifier.Linkifier(MaxLengthForLinks));
        _NodeStackTraceWidget_view.set(this, void 0);
        __classPrivateFieldSet(this, _NodeStackTraceWidget_view, view, "f");
    }
    wasShown() {
        super.wasShown();
        UI.Context.Context.instance().addFlavorChangeListener(SDK.DOMModel.DOMNode, this.update, this);
        this.update();
    }
    willHide() {
        UI.Context.Context.instance().removeFlavorChangeListener(SDK.DOMModel.DOMNode, this.update, this);
    }
    async doUpdate() {
        const node = UI.Context.Context.instance().flavor(SDK.DOMModel.DOMNode);
        const creationStackTrace = node ? await node.creationStackTrace() : null;
        const stackTracePreview = node && creationStackTrace ?
            Components.JSPresentationUtils
                .buildStackTracePreviewContents(node.domModel().target(), __classPrivateFieldGet(this, _NodeStackTraceWidget_linkifier, "f"), { stackTrace: creationStackTrace, tabStops: undefined })
                .element :
            null;
        const input = {
            stackTracePreview,
        };
        __classPrivateFieldGet(this, _NodeStackTraceWidget_view, "f").call(this, input, {}, this.contentElement);
    }
}
_NodeStackTraceWidget_linkifier = new WeakMap(), _NodeStackTraceWidget_view = new WeakMap();
export const MaxLengthForLinks = 40;
//# sourceMappingURL=NodeStackTraceWidget.js.map