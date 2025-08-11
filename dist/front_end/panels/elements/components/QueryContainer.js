// Copyright (c) 2021 The Chromium Authors. All rights reserved.
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
var _QueryContainer_instances, _QueryContainer_shadow, _QueryContainer_queryName, _QueryContainer_container, _QueryContainer_onContainerLinkClick, _QueryContainer_isContainerLinkHovered, _QueryContainer_queriedSizeDetails, _QueryContainer_onContainerLinkMouseEnter, _QueryContainer_onContainerLinkMouseLeave, _QueryContainer_render, _QueryContainer_renderQueriedSizeDetails;
import '../../../ui/components/icon_button/icon_button.js';
import '../../../ui/components/node_text/node_text.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import queryContainerStyles from './queryContainer.css.js';
const { render, html } = Lit;
const { PhysicalAxis, QueryAxis } = SDK.CSSContainerQuery;
export class QueriedSizeRequestedEvent extends Event {
    constructor() {
        super(QueriedSizeRequestedEvent.eventName, {});
    }
}
QueriedSizeRequestedEvent.eventName = 'queriedsizerequested';
export class QueryContainer extends HTMLElement {
    constructor() {
        super(...arguments);
        _QueryContainer_instances.add(this);
        _QueryContainer_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _QueryContainer_queryName.set(this, void 0);
        _QueryContainer_container.set(this, void 0);
        _QueryContainer_onContainerLinkClick.set(this, void 0);
        _QueryContainer_isContainerLinkHovered.set(this, false);
        _QueryContainer_queriedSizeDetails.set(this, void 0);
    }
    set data(data) {
        __classPrivateFieldSet(this, _QueryContainer_queryName, data.queryName, "f");
        __classPrivateFieldSet(this, _QueryContainer_container, data.container, "f");
        __classPrivateFieldSet(this, _QueryContainer_onContainerLinkClick, data.onContainerLinkClick, "f");
        __classPrivateFieldGet(this, _QueryContainer_instances, "m", _QueryContainer_render).call(this);
    }
    updateContainerQueriedSizeDetails(details) {
        __classPrivateFieldSet(this, _QueryContainer_queriedSizeDetails, details, "f");
        __classPrivateFieldGet(this, _QueryContainer_instances, "m", _QueryContainer_render).call(this);
    }
}
_QueryContainer_shadow = new WeakMap(), _QueryContainer_queryName = new WeakMap(), _QueryContainer_container = new WeakMap(), _QueryContainer_onContainerLinkClick = new WeakMap(), _QueryContainer_isContainerLinkHovered = new WeakMap(), _QueryContainer_queriedSizeDetails = new WeakMap(), _QueryContainer_instances = new WeakSet(), _QueryContainer_onContainerLinkMouseEnter = async function _QueryContainer_onContainerLinkMouseEnter() {
    __classPrivateFieldGet(this, _QueryContainer_container, "f")?.highlightNode('container-outline');
    __classPrivateFieldSet(this, _QueryContainer_isContainerLinkHovered, true, "f");
    this.dispatchEvent(new QueriedSizeRequestedEvent());
}, _QueryContainer_onContainerLinkMouseLeave = function _QueryContainer_onContainerLinkMouseLeave() {
    __classPrivateFieldGet(this, _QueryContainer_container, "f")?.clearHighlight();
    __classPrivateFieldSet(this, _QueryContainer_isContainerLinkHovered, false, "f");
    __classPrivateFieldGet(this, _QueryContainer_instances, "m", _QueryContainer_render).call(this);
}, _QueryContainer_render = function _QueryContainer_render() {
    if (!__classPrivateFieldGet(this, _QueryContainer_container, "f")) {
        return;
    }
    let idToDisplay, classesToDisplay;
    if (!__classPrivateFieldGet(this, _QueryContainer_queryName, "f")) {
        idToDisplay = __classPrivateFieldGet(this, _QueryContainer_container, "f").getAttribute('id');
        classesToDisplay = __classPrivateFieldGet(this, _QueryContainer_container, "f").getAttribute('class')?.split(/\s+/).filter(Boolean);
    }
    const nodeTitle = __classPrivateFieldGet(this, _QueryContainer_queryName, "f") || __classPrivateFieldGet(this, _QueryContainer_container, "f").nodeNameNicelyCased;
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    // eslint-disable-next-line rulesdir/no-a-tags-in-lit
    render(html `
      <style>${queryContainerStyles}</style>
      →
      <a href="#" draggable=false class="container-link"
         jslog=${VisualLogging.cssRuleHeader('container-query').track({ click: true })}
         @click=${__classPrivateFieldGet(this, _QueryContainer_onContainerLinkClick, "f")}
         @mouseenter=${__classPrivateFieldGet(this, _QueryContainer_instances, "m", _QueryContainer_onContainerLinkMouseEnter)}
         @mouseleave=${__classPrivateFieldGet(this, _QueryContainer_instances, "m", _QueryContainer_onContainerLinkMouseLeave)}>
        <devtools-node-text data-node-title=${nodeTitle} .data=${{
        nodeTitle,
        nodeId: idToDisplay,
        nodeClasses: classesToDisplay,
    }}>
        </devtools-node-text>
      </a>
      ${__classPrivateFieldGet(this, _QueryContainer_isContainerLinkHovered, "f") ? __classPrivateFieldGet(this, _QueryContainer_instances, "m", _QueryContainer_renderQueriedSizeDetails).call(this) : Lit.nothing}
    `, __classPrivateFieldGet(this, _QueryContainer_shadow, "f"), {
        host: this,
    });
    // clang-format on
}, _QueryContainer_renderQueriedSizeDetails = function _QueryContainer_renderQueriedSizeDetails() {
    if (!__classPrivateFieldGet(this, _QueryContainer_queriedSizeDetails, "f") || __classPrivateFieldGet(this, _QueryContainer_queriedSizeDetails, "f").queryAxis === "" /* QueryAxis.NONE */) {
        return Lit.nothing;
    }
    const areBothAxesQueried = __classPrivateFieldGet(this, _QueryContainer_queriedSizeDetails, "f").queryAxis === "size" /* QueryAxis.BOTH */;
    const axisIconClasses = Lit.Directives.classMap({
        'axis-icon': true,
        hidden: areBothAxesQueried,
        vertical: __classPrivateFieldGet(this, _QueryContainer_queriedSizeDetails, "f").physicalAxis === "Vertical" /* PhysicalAxis.VERTICAL */,
    });
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <span class="queried-size-details">
        (${__classPrivateFieldGet(this, _QueryContainer_queriedSizeDetails, "f").queryAxis}
        <devtools-icon
          class=${axisIconClasses} .data=${{
        iconName: 'width',
        color: 'var(--icon-default)',
    }}></devtools-icon>
        ) ${areBothAxesQueried && __classPrivateFieldGet(this, _QueryContainer_queriedSizeDetails, "f").width ? ' width: ' : Lit.nothing}
        ${__classPrivateFieldGet(this, _QueryContainer_queriedSizeDetails, "f").width || Lit.nothing}
        ${areBothAxesQueried && __classPrivateFieldGet(this, _QueryContainer_queriedSizeDetails, "f").height ? ' height: ' : Lit.nothing}
        ${__classPrivateFieldGet(this, _QueryContainer_queriedSizeDetails, "f").height || Lit.nothing}
      </span>
    `;
    // clang-format on
};
customElements.define('devtools-query-container', QueryContainer);
//# sourceMappingURL=QueryContainer.js.map