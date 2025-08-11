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
var _EventRef_instances, _EventRef_shadow, _EventRef_text, _EventRef_event, _EventRef_render, _ImageRef_instances, _ImageRef_shadow, _ImageRef_request, _ImageRef_imageDataUrl, _ImageRef_getOrCreateImageDataUrl, _ImageRef_render;
import * as i18n from '../../../../core/i18n/i18n.js';
import * as SDK from '../../../../core/sdk/sdk.js';
import * as Trace from '../../../../models/trace/trace.js';
import * as ComponentHelpers from '../../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../../ui/lit/lit.js';
import * as Utils from '../../utils/utils.js';
import baseInsightComponentStyles from './baseInsightComponent.css.js';
const { html, Directives: { ifDefined } } = Lit;
export class EventReferenceClick extends Event {
    constructor(event) {
        super(EventReferenceClick.eventName, { bubbles: true, composed: true });
        this.event = event;
    }
}
EventReferenceClick.eventName = 'eventreferenceclick';
class EventRef extends HTMLElement {
    constructor() {
        super(...arguments);
        _EventRef_instances.add(this);
        _EventRef_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _EventRef_text.set(this, null);
        _EventRef_event.set(this, null);
    }
    set text(text) {
        __classPrivateFieldSet(this, _EventRef_text, text, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _EventRef_instances, "m", _EventRef_render));
    }
    set event(event) {
        __classPrivateFieldSet(this, _EventRef_event, event, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _EventRef_instances, "m", _EventRef_render));
    }
}
_EventRef_shadow = new WeakMap(), _EventRef_text = new WeakMap(), _EventRef_event = new WeakMap(), _EventRef_instances = new WeakSet(), _EventRef_render = function _EventRef_render() {
    if (!__classPrivateFieldGet(this, _EventRef_text, "f") || !__classPrivateFieldGet(this, _EventRef_event, "f")) {
        return;
    }
    // clang-format off
    Lit.render(html `
      <style>${baseInsightComponentStyles}</style>
      <button type="button" class="timeline-link" @click=${(e) => {
        e.stopPropagation();
        if (__classPrivateFieldGet(this, _EventRef_event, "f")) {
            this.dispatchEvent(new EventReferenceClick(__classPrivateFieldGet(this, _EventRef_event, "f")));
        }
    }}>${__classPrivateFieldGet(this, _EventRef_text, "f")}</button>
    `, __classPrivateFieldGet(this, _EventRef_shadow, "f"), { host: this });
    // clang-format on
};
export function eventRef(event, options) {
    let title = options?.title;
    let text = options?.text;
    if (Trace.Types.Events.isSyntheticNetworkRequest(event)) {
        text = text ?? Utils.Helpers.shortenUrl(new URL(event.args.data.url));
        title = title ?? event.args.data.url;
    }
    else if (!text) {
        console.warn('No text given for eventRef');
        text = event.name;
    }
    return html `<devtools-performance-event-ref
    .event=${event}
    .text=${text}
    title=${ifDefined(title)}
  ></devtools-performance-event-ref>`;
}
class ImageRef extends HTMLElement {
    constructor() {
        super(...arguments);
        _ImageRef_instances.add(this);
        _ImageRef_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ImageRef_request.set(this, void 0);
        _ImageRef_imageDataUrl.set(this, void 0);
    }
    set request(request) {
        __classPrivateFieldSet(this, _ImageRef_request, request, "f");
        __classPrivateFieldSet(this, _ImageRef_imageDataUrl, undefined, "f");
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ImageRef_instances, "m", _ImageRef_render));
    }
}
_ImageRef_shadow = new WeakMap(), _ImageRef_request = new WeakMap(), _ImageRef_imageDataUrl = new WeakMap(), _ImageRef_instances = new WeakSet(), _ImageRef_getOrCreateImageDataUrl = 
/**
 * This only returns a data url if the resource is currently present from the active
 * inspected page.
 */
async function _ImageRef_getOrCreateImageDataUrl() {
    if (!__classPrivateFieldGet(this, _ImageRef_request, "f")) {
        return null;
    }
    if (__classPrivateFieldGet(this, _ImageRef_imageDataUrl, "f") !== undefined) {
        return __classPrivateFieldGet(this, _ImageRef_imageDataUrl, "f");
    }
    const originalUrl = __classPrivateFieldGet(this, _ImageRef_request, "f").args.data.url;
    const resource = SDK.ResourceTreeModel.ResourceTreeModel.resourceForURL(originalUrl);
    if (!resource) {
        __classPrivateFieldSet(this, _ImageRef_imageDataUrl, null, "f");
        return __classPrivateFieldGet(this, _ImageRef_imageDataUrl, "f");
    }
    const content = await resource.requestContentData();
    if ('error' in content) {
        __classPrivateFieldSet(this, _ImageRef_imageDataUrl, null, "f");
        return __classPrivateFieldGet(this, _ImageRef_imageDataUrl, "f");
    }
    __classPrivateFieldSet(this, _ImageRef_imageDataUrl, content.asDataUrl(), "f");
    return __classPrivateFieldGet(this, _ImageRef_imageDataUrl, "f");
}, _ImageRef_render = async function _ImageRef_render() {
    if (!__classPrivateFieldGet(this, _ImageRef_request, "f")) {
        return;
    }
    const url = __classPrivateFieldGet(this, _ImageRef_request, "f").args.data.mimeType.includes('image') ? await __classPrivateFieldGet(this, _ImageRef_instances, "m", _ImageRef_getOrCreateImageDataUrl).call(this) : null;
    const img = url ? html `<img src=${url} class="element-img"/>` : Lit.nothing;
    // clang-format off
    Lit.render(html `
      <style>${baseInsightComponentStyles}</style>
      <div class="image-ref">
        ${img}
        <span class="element-img-details">
          ${eventRef(__classPrivateFieldGet(this, _ImageRef_request, "f"))}
          <span class="element-img-details-size">${i18n.ByteUtilities.bytesToString(__classPrivateFieldGet(this, _ImageRef_request, "f").args.data.decodedBodyLength ?? 0)}</span>
        </span>
      </div>
    `, __classPrivateFieldGet(this, _ImageRef_shadow, "f"), { host: this });
    // clang-format on
};
export function imageRef(request) {
    return html `
    <devtools-performance-image-ref
      .request=${request}
    ></devtools-performance-image-ref>
  `;
}
customElements.define('devtools-performance-event-ref', EventRef);
customElements.define('devtools-performance-image-ref', ImageRef);
//# sourceMappingURL=EventRef.js.map