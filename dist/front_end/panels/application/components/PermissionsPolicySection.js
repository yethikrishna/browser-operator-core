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
var _PermissionsPolicySection_instances, _PermissionsPolicySection_shadow, _PermissionsPolicySection_permissionsPolicySectionData, _PermissionsPolicySection_toggleShowPermissionsDisallowedDetails, _PermissionsPolicySection_renderAllowed, _PermissionsPolicySection_renderDisallowed, _PermissionsPolicySection_render;
import '../../../ui/components/icon_button/icon_button.js';
import '../../../ui/components/report_view/report_view.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as NetworkForward from '../../../panels/network/forward/forward.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import permissionsPolicySectionStyles from './permissionsPolicySection.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description Label for a button. When clicked more details (for the content this button refers to) will be shown.
     */
    showDetails: 'Show details',
    /**
     *@description Label for a button. When clicked some details (for the content this button refers to) will be hidden.
     */
    hideDetails: 'Hide details',
    /**
     *@description Label for a list of features which are allowed according to the current Permissions policy
     *(a mechanism that allows developers to enable/disable browser features and APIs (e.g. camera, geolocation, autoplay))
     */
    allowedFeatures: 'Allowed Features',
    /**
     *@description Label for a list of features which are disabled according to the current Permissions policy
     *(a mechanism that allows developers to enable/disable browser features and APIs (e.g. camera, geolocation, autoplay))
     */
    disabledFeatures: 'Disabled Features',
    /**
     *@description Tooltip text for a link to a specific request's headers in the Network panel.
     */
    clickToShowHeader: 'Click to reveal the request whose "`Permissions-Policy`" HTTP header disables this feature.',
    /**
     *@description Tooltip text for a link to a specific iframe in the Elements panel (Iframes can be nested, the link goes
     *  to the outer-most iframe which blocks a certain feature).
     */
    clickToShowIframe: 'Click to reveal the top-most iframe which does not allow this feature in the elements panel.',
    /**
     *@description Text describing that a specific feature is blocked by not being included in the iframe's "allow" attribute.
     */
    disabledByIframe: 'missing in iframe "`allow`" attribute',
    /**
     *@description Text describing that a specific feature is blocked by a Permissions Policy specified in a request header.
     */
    disabledByHeader: 'disabled by "`Permissions-Policy`" header',
    /**
     *@description Text describing that a specific feature is blocked by virtue of being inside a fenced frame tree.
     */
    disabledByFencedFrame: 'disabled inside a `fencedframe`',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/components/PermissionsPolicySection.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export function renderIconLink(iconName, title, clickHandler, jsLogContext) {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
  <devtools-button
    .iconName=${iconName}
    title=${title}
    .variant=${"icon" /* Buttons.Button.Variant.ICON */}
    .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
    @click=${clickHandler}
    jslog=${VisualLogging.action().track({ click: true }).context(jsLogContext)}></devtools-button>
  `;
    // clang-format on
}
export class PermissionsPolicySection extends HTMLElement {
    constructor() {
        super(...arguments);
        _PermissionsPolicySection_instances.add(this);
        _PermissionsPolicySection_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _PermissionsPolicySection_permissionsPolicySectionData.set(this, { policies: [], showDetails: false });
    }
    set data(data) {
        __classPrivateFieldSet(this, _PermissionsPolicySection_permissionsPolicySectionData, data, "f");
        void __classPrivateFieldGet(this, _PermissionsPolicySection_instances, "m", _PermissionsPolicySection_render).call(this);
    }
}
_PermissionsPolicySection_shadow = new WeakMap(), _PermissionsPolicySection_permissionsPolicySectionData = new WeakMap(), _PermissionsPolicySection_instances = new WeakSet(), _PermissionsPolicySection_toggleShowPermissionsDisallowedDetails = function _PermissionsPolicySection_toggleShowPermissionsDisallowedDetails() {
    __classPrivateFieldGet(this, _PermissionsPolicySection_permissionsPolicySectionData, "f").showDetails = !__classPrivateFieldGet(this, _PermissionsPolicySection_permissionsPolicySectionData, "f").showDetails;
    void __classPrivateFieldGet(this, _PermissionsPolicySection_instances, "m", _PermissionsPolicySection_render).call(this);
}, _PermissionsPolicySection_renderAllowed = function _PermissionsPolicySection_renderAllowed() {
    const allowed = __classPrivateFieldGet(this, _PermissionsPolicySection_permissionsPolicySectionData, "f").policies.filter(p => p.allowed).map(p => p.feature).sort();
    if (!allowed.length) {
        return Lit.nothing;
    }
    return html `
      <devtools-report-key>${i18nString(UIStrings.allowedFeatures)}</devtools-report-key>
      <devtools-report-value>
        ${allowed.join(', ')}
      </devtools-report-value>
    `;
}, _PermissionsPolicySection_renderDisallowed = async function _PermissionsPolicySection_renderDisallowed() {
    const disallowed = __classPrivateFieldGet(this, _PermissionsPolicySection_permissionsPolicySectionData, "f").policies.filter(p => !p.allowed)
        .sort((a, b) => a.feature.localeCompare(b.feature));
    if (!disallowed.length) {
        return Lit.nothing;
    }
    if (!__classPrivateFieldGet(this, _PermissionsPolicySection_permissionsPolicySectionData, "f").showDetails) {
        return html `
        <devtools-report-key>${i18nString(UIStrings.disabledFeatures)}</devtools-report-key>
        <devtools-report-value>
          ${disallowed.map(p => p.feature).join(', ')}
          <devtools-button
          class="disabled-features-button"
          .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}
          @click=${() => __classPrivateFieldGet(this, _PermissionsPolicySection_instances, "m", _PermissionsPolicySection_toggleShowPermissionsDisallowedDetails).call(this)}
          jslog=${VisualLogging.action('show-disabled-features-details').track({
            click: true,
        })}>${i18nString(UIStrings.showDetails)}
        </devtools-button>
        </devtools-report-value>
      `;
    }
    const frameManager = SDK.FrameManager.FrameManager.instance();
    const featureRows = await Promise.all(disallowed.map(async (policy) => {
        const frame = policy.locator ? frameManager.getFrame(policy.locator.frameId) : null;
        const blockReason = policy.locator?.blockReason;
        const linkTargetDOMNode = await (blockReason === "IframeAttribute" /* Protocol.Page.PermissionsPolicyBlockReason.IframeAttribute */ &&
            frame?.getOwnerDOMNodeOrDocument());
        const resource = frame?.resourceForURL(frame.url);
        const linkTargetRequest = blockReason === "Header" /* Protocol.Page.PermissionsPolicyBlockReason.Header */ && resource?.request;
        const blockReasonText = (() => {
            switch (blockReason) {
                case "IframeAttribute" /* Protocol.Page.PermissionsPolicyBlockReason.IframeAttribute */:
                    return i18nString(UIStrings.disabledByIframe);
                case "Header" /* Protocol.Page.PermissionsPolicyBlockReason.Header */:
                    return i18nString(UIStrings.disabledByHeader);
                case "InFencedFrameTree" /* Protocol.Page.PermissionsPolicyBlockReason.InFencedFrameTree */:
                    return i18nString(UIStrings.disabledByFencedFrame);
                default:
                    return '';
            }
        })();
        const revealHeader = async () => {
            if (!linkTargetRequest) {
                return;
            }
            const headerName = linkTargetRequest.responseHeaderValue('permissions-policy') ? 'permissions-policy' : 'feature-policy';
            const requestLocation = NetworkForward.UIRequestLocation.UIRequestLocation.responseHeaderMatch(linkTargetRequest, { name: headerName, value: '' });
            await Common.Revealer.reveal(requestLocation);
        };
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
        <div class="permissions-row">
          <div>
            <devtools-icon class="allowed-icon"
              .data=${{
            color: 'var(--icon-error)',
            iconName: 'cross-circle',
            width: '20px', height: '20px',
        }}>
            </devtools-icon>
          </div>
          <div class="feature-name text-ellipsis">
            ${policy.feature}
          </div>
          <div class="block-reason">${blockReasonText}</div>
          <div>
            ${linkTargetDOMNode ? renderIconLink('code-circle', i18nString(UIStrings.clickToShowIframe), () => Common.Revealer.reveal(linkTargetDOMNode), 'reveal-in-elements') :
            Lit.nothing}
            ${linkTargetRequest ? renderIconLink('arrow-up-down-circle', i18nString(UIStrings.clickToShowHeader), revealHeader, 'reveal-in-network') :
            Lit.nothing}
          </div>
        </div>
      `;
        // clang-format on
    }));
    return html `
      <devtools-report-key>${i18nString(UIStrings.disabledFeatures)}</devtools-report-key>
      <devtools-report-value class="policies-list">
        ${featureRows}
        <div class="permissions-row">
        <devtools-button
          .variant=${"outlined" /* Buttons.Button.Variant.OUTLINED */}
          @click=${() => __classPrivateFieldGet(this, _PermissionsPolicySection_instances, "m", _PermissionsPolicySection_toggleShowPermissionsDisallowedDetails).call(this)}
          jslog=${VisualLogging.action('hide-disabled-features-details').track({
        click: true,
    })}>${i18nString(UIStrings.hideDetails)}
        </devtools-button>
        </div>
      </devtools-report-value>
    `;
}, _PermissionsPolicySection_render = async function _PermissionsPolicySection_render() {
    await RenderCoordinator.write('PermissionsPolicySection render', () => {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        Lit.render(html `
          <style>${permissionsPolicySectionStyles}</style>
          <devtools-report-section-header>${i18n.i18n.lockedString('Permissions Policy')}</devtools-report-section-header>
          ${__classPrivateFieldGet(this, _PermissionsPolicySection_instances, "m", _PermissionsPolicySection_renderAllowed).call(this)}
          ${(__classPrivateFieldGet(this, _PermissionsPolicySection_permissionsPolicySectionData, "f").policies.findIndex(p => p.allowed) > 0 ||
            __classPrivateFieldGet(this, _PermissionsPolicySection_permissionsPolicySectionData, "f").policies.findIndex(p => !p.allowed) > 0) ?
            html `<devtools-report-divider class="subsection-divider"></devtools-report-divider>` : Lit.nothing}
          ${Lit.Directives.until(__classPrivateFieldGet(this, _PermissionsPolicySection_instances, "m", _PermissionsPolicySection_renderDisallowed).call(this), Lit.nothing)}
          <devtools-report-divider></devtools-report-divider>
        `, __classPrivateFieldGet(this, _PermissionsPolicySection_shadow, "f"), { host: this });
        // clang-format on
    });
};
customElements.define('devtools-resources-permissions-policy-section', PermissionsPolicySection);
//# sourceMappingURL=PermissionsPolicySection.js.map