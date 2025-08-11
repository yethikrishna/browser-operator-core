// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _ChromeLink_instances, _ChromeLink_shadow, _ChromeLink_href, _ChromeLink_handleClick, _ChromeLink_render;
import * as Common from '../../../core/common/common.js';
import * as Host from '../../../core/host/host.js';
import * as Platform from '../../../core/platform/platform.js';
import * as SDK from '../../../core/sdk/sdk.js';
import { html, render } from '../../lit/lit.js';
import * as VisualLogging from '../../visual_logging/visual_logging.js';
import * as ComponentHelpers from '../helpers/helpers.js';
import chromeLinkStyles from './chromeLink.css.js';
// Use this component to render links to 'chrome://...'-URLs
// (for which regular <x-link>s do not work).
export class ChromeLink extends HTMLElement {
    constructor() {
        super(...arguments);
        _ChromeLink_instances.add(this);
        _ChromeLink_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ChromeLink_href.set(this, '');
    }
    connectedCallback() {
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChromeLink_instances, "m", _ChromeLink_render));
    }
    set href(href) {
        if (!Common.ParsedURL.schemeIs(href, 'chrome:')) {
            throw new Error('ChromeLink href needs to start with \'chrome://\'');
        }
        __classPrivateFieldSet(this, _ChromeLink_href, href, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ChromeLink_instances, "m", _ChromeLink_render));
    }
}
_ChromeLink_shadow = new WeakMap(), _ChromeLink_href = new WeakMap(), _ChromeLink_instances = new WeakSet(), _ChromeLink_handleClick = function _ChromeLink_handleClick(event) {
    const rootTarget = SDK.TargetManager.TargetManager.instance().rootTarget();
    if (rootTarget === null) {
        return;
    }
    const url = __classPrivateFieldGet(this, _ChromeLink_href, "f");
    void rootTarget.targetAgent().invoke_createTarget({ url }).then(result => {
        if (result.getError()) {
            Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(url);
        }
    });
    event.consume(true);
}, _ChromeLink_render = function _ChromeLink_render() {
    const urlForContext = new URL(__classPrivateFieldGet(this, _ChromeLink_href, "f"));
    urlForContext.search = '';
    const jslogContext = Platform.StringUtilities.toKebabCase(urlForContext.toString());
    // clang-format off
    render(
    /* x-link doesn't work with custom click/keydown handlers */
    /* eslint-disable rulesdir/no-a-tags-in-lit */
    html `
        <style>${chromeLinkStyles}</style>
        <a href=${__classPrivateFieldGet(this, _ChromeLink_href, "f")} class="link" target="_blank"
          jslog=${VisualLogging.link().track({ click: true }).context(jslogContext)}
          @click=${__classPrivateFieldGet(this, _ChromeLink_instances, "m", _ChromeLink_handleClick)}><slot></slot></a>
      `, __classPrivateFieldGet(this, _ChromeLink_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-chrome-link', ChromeLink);
//# sourceMappingURL=ChromeLink.js.map