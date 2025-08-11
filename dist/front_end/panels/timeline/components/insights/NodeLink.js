// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _NodeLink_instances, _NodeLink_shadow, _NodeLink_backendNodeId, _NodeLink_frame, _NodeLink_options, _NodeLink_fallbackUrl, _NodeLink_fallbackHtmlSnippet, _NodeLink_fallbackText, _NodeLink_linkifiedNodeForBackendId, _NodeLink_linkify, _NodeLink_render;
// TODO: move to ui/components/node_link?
import * as Common from '../../../../core/common/common.js';
import * as SDK from '../../../../core/sdk/sdk.js';
import * as Buttons from '../../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../../ui/components/helpers/helpers.js';
import * as LegacyComponents from '../../../../ui/legacy/components/utils/utils.js';
import * as Lit from '../../../../ui/lit/lit.js';
const { html } = Lit;
export class NodeLink extends HTMLElement {
    constructor() {
        super(...arguments);
        _NodeLink_instances.add(this);
        _NodeLink_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _NodeLink_backendNodeId.set(this, void 0);
        _NodeLink_frame.set(this, void 0);
        _NodeLink_options.set(this, void 0);
        _NodeLink_fallbackUrl.set(this, void 0);
        _NodeLink_fallbackHtmlSnippet.set(this, void 0);
        _NodeLink_fallbackText.set(this, void 0);
        /**
         * Track the linkified Node for a given backend NodeID to avoid repeated lookups on re-render.
         * Also tracks if we fail to resolve a node, to ensure we don't try on each subsequent re-render.
         */
        _NodeLink_linkifiedNodeForBackendId.set(this, new Map());
    }
    set data(data) {
        __classPrivateFieldSet(this, _NodeLink_backendNodeId, data.backendNodeId, "f");
        __classPrivateFieldSet(this, _NodeLink_frame, data.frame, "f");
        __classPrivateFieldSet(this, _NodeLink_options, data.options, "f");
        __classPrivateFieldSet(this, _NodeLink_fallbackUrl, data.fallbackUrl, "f");
        __classPrivateFieldSet(this, _NodeLink_fallbackHtmlSnippet, data.fallbackHtmlSnippet, "f");
        __classPrivateFieldSet(this, _NodeLink_fallbackText, data.fallbackText, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _NodeLink_instances, "m", _NodeLink_render));
    }
}
_NodeLink_shadow = new WeakMap(), _NodeLink_backendNodeId = new WeakMap(), _NodeLink_frame = new WeakMap(), _NodeLink_options = new WeakMap(), _NodeLink_fallbackUrl = new WeakMap(), _NodeLink_fallbackHtmlSnippet = new WeakMap(), _NodeLink_fallbackText = new WeakMap(), _NodeLink_linkifiedNodeForBackendId = new WeakMap(), _NodeLink_instances = new WeakSet(), _NodeLink_linkify = async function _NodeLink_linkify() {
    if (__classPrivateFieldGet(this, _NodeLink_backendNodeId, "f") === undefined) {
        return;
    }
    const fromCache = __classPrivateFieldGet(this, _NodeLink_linkifiedNodeForBackendId, "f").get(__classPrivateFieldGet(this, _NodeLink_backendNodeId, "f"));
    if (fromCache) {
        if (fromCache === 'NO_NODE_FOUND') {
            return undefined;
        }
        return fromCache;
    }
    const target = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    const domModel = target?.model(SDK.DOMModel.DOMModel);
    if (!domModel) {
        return undefined;
    }
    const domNodesMap = await domModel.pushNodesByBackendIdsToFrontend(new Set([__classPrivateFieldGet(this, _NodeLink_backendNodeId, "f")]));
    const node = domNodesMap?.get(__classPrivateFieldGet(this, _NodeLink_backendNodeId, "f"));
    if (!node) {
        __classPrivateFieldGet(this, _NodeLink_linkifiedNodeForBackendId, "f").set(__classPrivateFieldGet(this, _NodeLink_backendNodeId, "f"), 'NO_NODE_FOUND');
        return;
    }
    if (node.frameId() !== __classPrivateFieldGet(this, _NodeLink_frame, "f")) {
        __classPrivateFieldGet(this, _NodeLink_linkifiedNodeForBackendId, "f").set(__classPrivateFieldGet(this, _NodeLink_backendNodeId, "f"), 'NO_NODE_FOUND');
        return;
    }
    // TODO: it'd be nice if we could specify what attributes to render,
    // ex for the Viewport insight: <meta content="..."> (instead of just <meta>)
    const linkedNode = await Common.Linkifier.Linkifier.linkify(node, __classPrivateFieldGet(this, _NodeLink_options, "f"));
    __classPrivateFieldGet(this, _NodeLink_linkifiedNodeForBackendId, "f").set(__classPrivateFieldGet(this, _NodeLink_backendNodeId, "f"), linkedNode);
    return linkedNode;
}, _NodeLink_render = async function _NodeLink_render() {
    const relatedNodeEl = await __classPrivateFieldGet(this, _NodeLink_instances, "m", _NodeLink_linkify).call(this);
    let template;
    if (relatedNodeEl) {
        template = html `<div class='node-link'>${relatedNodeEl}</div>`;
    }
    else if (__classPrivateFieldGet(this, _NodeLink_fallbackUrl, "f")) {
        const MAX_URL_LENGTH = 20;
        const options = {
            tabStop: true,
            showColumnNumber: false,
            inlineFrameIndex: 0,
            maxLength: MAX_URL_LENGTH,
        };
        const linkEl = LegacyComponents.Linkifier.Linkifier.linkifyURL(__classPrivateFieldGet(this, _NodeLink_fallbackUrl, "f"), options);
        template = html `<div class='node-link'>
        <style>${Buttons.textButtonStyles}</style>
        ${linkEl}
      </div>`;
    }
    else if (__classPrivateFieldGet(this, _NodeLink_fallbackHtmlSnippet, "f")) {
        // TODO: Use CodeHighlighter.
        template = html `<pre style='text-wrap: auto'>${__classPrivateFieldGet(this, _NodeLink_fallbackHtmlSnippet, "f")}</pre>`;
    }
    else if (__classPrivateFieldGet(this, _NodeLink_fallbackText, "f")) {
        template = html `<span>${__classPrivateFieldGet(this, _NodeLink_fallbackText, "f")}</span>`;
    }
    else {
        template = Lit.nothing;
    }
    Lit.render(template, __classPrivateFieldGet(this, _NodeLink_shadow, "f"), { host: this });
};
customElements.define('devtools-performance-node-link', NodeLink);
//# sourceMappingURL=NodeLink.js.map