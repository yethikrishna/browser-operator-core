// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ExtensionView_instances, _ExtensionView_shadow, _ExtensionView_descriptor, _ExtensionView_closeView, _ExtensionView_render;
import '../../../ui/legacy/legacy.js';
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Extensions from '../extensions/extensions.js';
import extensionViewStyles from './extensionView.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description The button label that closes the panel that shows the extension content inside the Recorder panel.
     */
    closeView: 'Close',
    /**
     * @description The label that indicates that the content shown is provided by a browser extension.
     */
    extension: 'Content provided by a browser extension',
};
const str_ = i18n.i18n.registerUIStrings('panels/recorder/components/ExtensionView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ClosedEvent extends Event {
    constructor() {
        super(ClosedEvent.eventName, { bubbles: true, composed: true });
    }
}
ClosedEvent.eventName = 'recorderextensionviewclosed';
export class ExtensionView extends HTMLElement {
    constructor() {
        super();
        _ExtensionView_instances.add(this);
        _ExtensionView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ExtensionView_descriptor.set(this, void 0);
        this.setAttribute('jslog', `${VisualLogging.section('extension-view')}`);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _ExtensionView_instances, "m", _ExtensionView_render).call(this);
    }
    disconnectedCallback() {
        if (!__classPrivateFieldGet(this, _ExtensionView_descriptor, "f")) {
            return;
        }
        Extensions.ExtensionManager.ExtensionManager.instance().getView(__classPrivateFieldGet(this, _ExtensionView_descriptor, "f").id).hide();
    }
    set descriptor(descriptor) {
        __classPrivateFieldSet(this, _ExtensionView_descriptor, descriptor, "f");
        __classPrivateFieldGet(this, _ExtensionView_instances, "m", _ExtensionView_render).call(this);
        Extensions.ExtensionManager.ExtensionManager.instance().getView(descriptor.id).show();
    }
}
_ExtensionView_shadow = new WeakMap(), _ExtensionView_descriptor = new WeakMap(), _ExtensionView_instances = new WeakSet(), _ExtensionView_closeView = function _ExtensionView_closeView() {
    this.dispatchEvent(new ClosedEvent());
}, _ExtensionView_render = function _ExtensionView_render() {
    if (!__classPrivateFieldGet(this, _ExtensionView_descriptor, "f")) {
        return;
    }
    const iframe = Extensions.ExtensionManager.ExtensionManager.instance().getView(__classPrivateFieldGet(this, _ExtensionView_descriptor, "f").id).frame();
    // clang-format off
    Lit.render(html `
        <style>${extensionViewStyles}</style>
        <div class="extension-view">
          <header>
            <div class="title">
              <devtools-icon
                class="icon"
                title=${i18nString(UIStrings.extension)}
                name="extension">
              </devtools-icon>
              ${__classPrivateFieldGet(this, _ExtensionView_descriptor, "f").title}
            </div>
            <devtools-button
              title=${i18nString(UIStrings.closeView)}
              jslog=${VisualLogging.close().track({ click: true })}
              .data=${{
        variant: "icon" /* Buttons.Button.Variant.ICON */,
        size: "SMALL" /* Buttons.Button.Size.SMALL */,
        iconName: 'cross',
    }}
              @click=${__classPrivateFieldGet(this, _ExtensionView_instances, "m", _ExtensionView_closeView)}
            ></devtools-button>
          </header>
          <main>
            ${iframe}
          </main>
      </div>
    `, __classPrivateFieldGet(this, _ExtensionView_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-recorder-extension-view', ExtensionView);
//# sourceMappingURL=ExtensionView.js.map