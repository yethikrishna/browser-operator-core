// Copyright 2018 The Chromium Authors. All rights reserved.
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
var _DOMNodeLink_node, _DOMNodeLink_options, _DOMNodeLink_view, _DeferredDOMNodeLink_deferredNode, _DeferredDOMNodeLink_options, _DeferredDOMNodeLink_view;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import { Directives, html, nothing, render } from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import domLinkifierStyles from './domLinkifier.css.js';
const { classMap } = Directives;
const UIStrings = {
    /**
     * @description Text displayed when trying to create a link to a node in the UI, but the node
     * location could not be found so we display this placeholder instead. Node refers to a DOM node.
     * This should be translated if appropriate.
     */
    node: '<node>',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/DOMLinkifier.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const DEFAULT_VIEW = (input, _output, target) => {
    // clang-format off
    render(html `${(input.tagName || input.pseudo) ? html `
    <style>${domLinkifierStyles}</style>
    <span class="monospace">
      <button class="node-link text-button link-style ${classMap({
        'dynamic-link': Boolean(input.dynamic),
        disabled: Boolean(input.disabled)
    })}"
          jslog=${VisualLogging.link('node').track({ click: true, keydown: 'Enter' })}
          tabindex=${input.preventKeyboardFocus ? -1 : 0}
          @click=${input.onClick}
          @mouseover=${input.onMouseOver}
          @mouseleave=${input.onMouseLeave}
          title=${[
        input.tagName ?? '',
        input.id ? `#${input.id}` : '',
        ...input.classes.map(c => `.${c}`),
        input.pseudo ? `::${input.pseudo}` : '',
    ].join(' ')}>${[
        input.tagName ? html `<span class="node-label-name">${input.tagName}</span>` : nothing,
        input.id ? html `<span class="node-label-id">#${input.id}</span>` : nothing,
        ...input.classes.map(className => html `<span class="extra node-label-class">.${className}</span>`),
        input.pseudo ? html `<span class="extra node-label-pseudo">${input.pseudo}</span>` : nothing,
    ]}</button>
    </span>` : i18nString(UIStrings.node)}`, target, { host: input });
    // clang-format on
};
export class DOMNodeLink extends UI.Widget.Widget {
    constructor(element, node, options, view = DEFAULT_VIEW) {
        super(true, undefined, element);
        _DOMNodeLink_node.set(this, undefined);
        _DOMNodeLink_options.set(this, undefined);
        _DOMNodeLink_view.set(this, void 0);
        this.element.classList.remove('vbox');
        __classPrivateFieldSet(this, _DOMNodeLink_node, node, "f");
        __classPrivateFieldSet(this, _DOMNodeLink_options, options, "f");
        __classPrivateFieldSet(this, _DOMNodeLink_view, view, "f");
        this.performUpdate();
    }
    set node(node) {
        __classPrivateFieldSet(this, _DOMNodeLink_node, node, "f");
        this.performUpdate();
    }
    set options(options) {
        __classPrivateFieldSet(this, _DOMNodeLink_options, options, "f");
        this.performUpdate();
    }
    performUpdate() {
        const options = __classPrivateFieldGet(this, _DOMNodeLink_options, "f") ?? {
            tooltip: undefined,
            preventKeyboardFocus: undefined,
            textContent: undefined,
            isDynamicLink: false,
            disabled: false,
        };
        const viewInput = {
            dynamic: options.isDynamicLink,
            disabled: options.disabled,
            preventKeyboardFocus: options.preventKeyboardFocus,
            classes: [],
            onClick: () => {
                void Common.Revealer.reveal(__classPrivateFieldGet(this, _DOMNodeLink_node, "f"));
                void __classPrivateFieldGet(this, _DOMNodeLink_node, "f")?.scrollIntoView();
                return false;
            },
            onMouseOver: () => {
                __classPrivateFieldGet(this, _DOMNodeLink_node, "f")?.highlight?.();
            },
            onMouseLeave: () => {
                SDK.OverlayModel.OverlayModel.hideDOMNodeHighlight();
            },
        };
        if (!__classPrivateFieldGet(this, _DOMNodeLink_node, "f")) {
            __classPrivateFieldGet(this, _DOMNodeLink_view, "f").call(this, viewInput, {}, this.contentElement);
            return;
        }
        let node = __classPrivateFieldGet(this, _DOMNodeLink_node, "f");
        const isPseudo = node.nodeType() === Node.ELEMENT_NODE && node.pseudoType();
        if (isPseudo && node.parentNode) {
            node = node.parentNode;
        }
        // Special case rendering the node links for view transition pseudo elements.
        // We don't include the ancestor name in the node link because
        // they always have the same ancestor. See crbug.com/340633630.
        if (node.isViewTransitionPseudoNode()) {
            viewInput.pseudo = `::${__classPrivateFieldGet(this, _DOMNodeLink_node, "f").pseudoType()}(${__classPrivateFieldGet(this, _DOMNodeLink_node, "f").pseudoIdentifier()})`;
            __classPrivateFieldGet(this, _DOMNodeLink_view, "f").call(this, viewInput, {}, this.contentElement);
            return;
        }
        if (options.textContent) {
            viewInput.tagName = options.textContent;
            __classPrivateFieldGet(this, _DOMNodeLink_view, "f").call(this, viewInput, {}, this.contentElement);
            return;
        }
        viewInput.tagName = node.nodeNameInCorrectCase();
        const idAttribute = node.getAttribute('id');
        if (idAttribute) {
            viewInput.id = idAttribute;
        }
        const classAttribute = node.getAttribute('class');
        if (classAttribute) {
            const classes = classAttribute.split(/\s+/);
            if (classes.length) {
                const foundClasses = new Set();
                for (let i = 0; i < classes.length; ++i) {
                    const className = classes[i];
                    if (className && !options.hiddenClassList?.includes(className) && !foundClasses.has(className)) {
                        foundClasses.add(className);
                    }
                }
                viewInput.classes = [...foundClasses];
            }
        }
        if (isPseudo) {
            const pseudoIdentifier = __classPrivateFieldGet(this, _DOMNodeLink_node, "f").pseudoIdentifier();
            let pseudoText = '::' + __classPrivateFieldGet(this, _DOMNodeLink_node, "f").pseudoType();
            if (pseudoIdentifier) {
                pseudoText += `(${pseudoIdentifier})`;
            }
            viewInput.pseudo = pseudoText;
        }
        __classPrivateFieldGet(this, _DOMNodeLink_view, "f").call(this, viewInput, {}, this.contentElement);
    }
}
_DOMNodeLink_node = new WeakMap(), _DOMNodeLink_options = new WeakMap(), _DOMNodeLink_view = new WeakMap();
const DEFERRED_DEFAULT_VIEW = (input, _output, target) => {
    // clang-format off
    render(html `
      <style>${domLinkifierStyles}</style>
      <button class="node-link text-button link-style"
          jslog=${VisualLogging.link('node').track({ click: true })}
          tabindex=${input.preventKeyboardFocus ? -1 : 0}
          @click=${input.onClick}
          @mousedown=${(e) => e.consume()}>
        <slot></slot>
      </button>`, target, { host: input });
    // clang-format on
};
export class DeferredDOMNodeLink extends UI.Widget.Widget {
    constructor(element, deferredNode, options, view = DEFERRED_DEFAULT_VIEW) {
        super(true, undefined, element);
        _DeferredDOMNodeLink_deferredNode.set(this, undefined);
        _DeferredDOMNodeLink_options.set(this, undefined);
        _DeferredDOMNodeLink_view.set(this, void 0);
        this.element.classList.remove('vbox');
        __classPrivateFieldSet(this, _DeferredDOMNodeLink_deferredNode, deferredNode, "f");
        __classPrivateFieldSet(this, _DeferredDOMNodeLink_options, options, "f");
        __classPrivateFieldSet(this, _DeferredDOMNodeLink_view, view, "f");
        this.performUpdate();
    }
    performUpdate() {
        const viewInput = {
            preventKeyboardFocus: __classPrivateFieldGet(this, _DeferredDOMNodeLink_options, "f")?.preventKeyboardFocus,
            onClick: () => {
                __classPrivateFieldGet(this, _DeferredDOMNodeLink_deferredNode, "f")?.resolve?.(node => {
                    void Common.Revealer.reveal(node);
                    void node?.scrollIntoView();
                });
            },
        };
        __classPrivateFieldGet(this, _DeferredDOMNodeLink_view, "f").call(this, viewInput, {}, this.contentElement);
    }
}
_DeferredDOMNodeLink_deferredNode = new WeakMap(), _DeferredDOMNodeLink_options = new WeakMap(), _DeferredDOMNodeLink_view = new WeakMap();
let linkifierInstance;
export class Linkifier {
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!linkifierInstance || forceNew) {
            linkifierInstance = new Linkifier();
        }
        return linkifierInstance;
    }
    linkify(object, options) {
        if (object instanceof SDK.DOMModel.DOMNode) {
            const link = document.createElement('devtools-widget');
            link.widgetConfig = UI.Widget.widgetConfig(e => new DOMNodeLink(e, object, options));
            return link;
        }
        if (object instanceof SDK.DOMModel.DeferredDOMNode) {
            const link = document.createElement('devtools-widget');
            link.widgetConfig = UI.Widget.widgetConfig(e => new DeferredDOMNodeLink(e, object, options));
            return link;
        }
        throw new Error('Can\'t linkify non-node');
    }
}
//# sourceMappingURL=DOMLinkifier.js.map