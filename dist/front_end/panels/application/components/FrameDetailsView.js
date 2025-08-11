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
var _FrameDetailsReportView_instances, _FrameDetailsReportView_shadow, _FrameDetailsReportView_frame, _FrameDetailsReportView_target, _FrameDetailsReportView_protocolMonitorExperimentEnabled, _FrameDetailsReportView_permissionsPolicies, _FrameDetailsReportView_permissionsPolicySectionData, _FrameDetailsReportView_originTrialTreeView, _FrameDetailsReportView_linkifier, _FrameDetailsReportView_adScriptAncestry, _FrameDetailsReportView_renderOriginTrial, _FrameDetailsReportView_renderDocumentSection, _FrameDetailsReportView_maybeRenderSourcesLinkForURL, _FrameDetailsReportView_maybeRenderNetworkLinkForURL, _FrameDetailsReportView_uiSourceCodeForFrame, _FrameDetailsReportView_maybeRenderUnreachableURL, _FrameDetailsReportView_renderNetworkLinkForUnreachableURL, _FrameDetailsReportView_maybeRenderOrigin, _FrameDetailsReportView_renderOwnerElement, _FrameDetailsReportView_maybeRenderCreationStacktrace, _FrameDetailsReportView_getAdFrameTypeStrings, _FrameDetailsReportView_getAdFrameExplanationString, _FrameDetailsReportView_maybeRenderAdStatus, _FrameDetailsReportView_maybeRenderCreatorAdScriptAncestry, _FrameDetailsReportView_renderIsolationSection, _FrameDetailsReportView_maybeRenderSecureContextExplanation, _FrameDetailsReportView_getSecureContextExplanation, _FrameDetailsReportView_maybeRenderCoopCoepCSPStatus, _FrameDetailsReportView_maybeRenderCrossOriginStatus, _FrameDetailsReportView_renderEffectiveDirectives, _FrameDetailsReportView_renderSingleCSP, _FrameDetailsReportView_renderCSPSection, _FrameDetailsReportView_renderApiAvailabilitySection, _FrameDetailsReportView_renderSharedArrayBufferAvailability, _FrameDetailsReportView_renderMeasureMemoryAvailability, _FrameDetailsReportView_renderAdditionalInfoSection;
import '../../../ui/components/expandable_list/expandable_list.js';
import '../../../ui/components/report_view/report_view.js';
import './StackTrace.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as Root from '../../../core/root/root.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as Bindings from '../../../models/bindings/bindings.js';
import * as Workspace from '../../../models/workspace/workspace.js';
import * as NetworkForward from '../../../panels/network/forward/forward.js';
import * as CspEvaluator from '../../../third_party/csp_evaluator/csp_evaluator.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as LegacyWrapper from '../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as Components from '../../../ui/legacy/components/utils/utils.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import frameDetailsReportViewStyles from './frameDetailsReportView.css.js';
import { OriginTrialTreeView } from './OriginTrialTreeView.js';
import { renderIconLink, } from './PermissionsPolicySection.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description Section header in the Frame Details view
     */
    additionalInformation: 'Additional Information',
    /**
     *@description Explanation for why the additional information section is being shown
     */
    thisAdditionalDebugging: 'This additional (debugging) information is shown because the \'Protocol Monitor\' experiment is enabled.',
    /**
     *@description Label for subtitle of frame details view
     */
    frameId: 'Frame ID',
    /**
     *@description Name of a network resource type
     */
    document: 'Document',
    /**
     *@description A web URL (for a lot of languages this does not need to be translated, please translate only where necessary)
     */
    url: 'URL',
    /**
    /**
     *@description Title for a link to the Sources panel
     */
    clickToOpenInSourcesPanel: 'Click to open in Sources panel',
    /**
     *@description Title for a link to the Network panel
     */
    clickToOpenInNetworkPanel: 'Click to open in Network panel',
    /**
     *@description Title for unreachable URL field
     */
    unreachableUrl: 'Unreachable URL',
    /**
     *@description Title for a link that applies a filter to the network panel
     */
    clickToOpenInNetworkPanelMight: 'Click to open in Network panel (might require page reload)',
    /**
     *@description The origin of a URL (https://web.dev/same-site-same-origin/#origin)
     *(for a lot of languages this does not need to be translated, please translate only where necessary)
     */
    origin: 'Origin',
    /**
    /**
     *@description Related node label in Timeline UIUtils of the Performance panel
     */
    ownerElement: 'Owner Element',
    /**
     *@description Title for a link to the Elements panel
     */
    clickToOpenInElementsPanel: 'Click to open in Elements panel',
    /**
     *@description Title for ad frame type field
     */
    adStatus: 'Ad Status',
    /**
     *@description Description for ad frame type
     */
    rootDescription: 'This frame has been identified as the root frame of an ad',
    /**
     *@description Value for ad frame type
     */
    root: 'root',
    /**
     *@description Description for ad frame type
     */
    childDescription: 'This frame has been identified as a child frame of an ad',
    /**
     *@description Value for ad frame type
     */
    child: 'child',
    /**
     *@description Section header in the Frame Details view
     */
    securityIsolation: 'Security & Isolation',
    /**
     *@description Section header in the Frame Details view
     */
    contentSecurityPolicy: 'Content Security Policy (CSP)',
    /**
     *@description Row title for in the Frame Details view
     */
    secureContext: 'Secure Context',
    /**
     *@description Text in Timeline indicating that input has happened recently
     */
    yes: 'Yes',
    /**
     *@description Text in Timeline indicating that input has not happened recently
     */
    no: 'No',
    /**
     *@description Label for whether a frame is cross-origin isolated
     *(https://developer.chrome.com/docs/extensions/mv3/cross-origin-isolation/)
     *(for a lot of languages this does not need to be translated, please translate only where necessary)
     */
    crossoriginIsolated: 'Cross-Origin Isolated',
    /**
     *@description Explanatory text in the Frame Details view
     */
    localhostIsAlwaysASecureContext: '`Localhost` is always a secure context',
    /**
     *@description Explanatory text in the Frame Details view
     */
    aFrameAncestorIsAnInsecure: 'A frame ancestor is an insecure context',
    /**
     *@description Explanatory text in the Frame Details view
     */
    theFramesSchemeIsInsecure: 'The frame\'s scheme is insecure',
    /**
     *@description This label specifies the server endpoints to which the server is reporting errors
     *and warnings through the Report-to API. Following this label will be the URL of the server.
     */
    reportingTo: 'reporting to',
    /**
     *@description Section header in the Frame Details view
     */
    apiAvailability: 'API availability',
    /**
     *@description Explanation of why cross-origin isolation is important
     *(https://web.dev/why-coop-coep/)
     *(for a lot of languages 'cross-origin isolation' does not need to be translated, please translate only where necessary)
     */
    availabilityOfCertainApisDepends: 'Availability of certain APIs depends on the document being cross-origin isolated.',
    /**
     *@description Description of the SharedArrayBuffer status
     */
    availableTransferable: 'available, transferable',
    /**
     *@description Description of the SharedArrayBuffer status
     */
    availableNotTransferable: 'available, not transferable',
    /**
     *@description Explanation for the SharedArrayBuffer availability status
     */
    unavailable: 'unavailable',
    /**
     *@description Tooltip for the SharedArrayBuffer availability status
     */
    sharedarraybufferConstructorIs: '`SharedArrayBuffer` constructor is available and `SABs` can be transferred via `postMessage`',
    /**
     *@description Tooltip for the SharedArrayBuffer availability status
     */
    sharedarraybufferConstructorIsAvailable: '`SharedArrayBuffer` constructor is available but `SABs` cannot be transferred via `postMessage`',
    /**
     *@description Explanation why SharedArrayBuffer will not be available in the future
     *(https://developer.chrome.com/docs/extensions/mv3/cross-origin-isolation/)
     *(for a lot of languages 'cross-origin isolation' does not need to be translated, please translate only where necessary)
     */
    willRequireCrossoriginIsolated: '⚠️ will require cross-origin isolated context in the future',
    /**
     *@description Explanation why SharedArrayBuffer is not available
     *(https://developer.chrome.com/docs/extensions/mv3/cross-origin-isolation/)
     *(for a lot of languages 'cross-origin isolation' does not need to be translated, please translate only where necessary).
     */
    requiresCrossoriginIsolated: 'requires cross-origin isolated context',
    /**
     *@description Explanation for the SharedArrayBuffer availability status in case the transfer of a SAB requires the
     * permission policy `cross-origin-isolated` to be enabled (e.g. because the message refers to the situation in an iframe).
     */
    transferRequiresCrossoriginIsolatedPermission: '`SharedArrayBuffer` transfer requires enabling the permission policy:',
    /**
     *@description Explanation for the Measure Memory availability status
     */
    available: 'available',
    /**
     *@description Tooltip for the Measure Memory availability status
     */
    thePerformanceAPI: 'The `performance.measureUserAgentSpecificMemory()` API is available',
    /**
     *@description Tooltip for the Measure Memory availability status
     */
    thePerformancemeasureuseragentspecificmemory: 'The `performance.measureUserAgentSpecificMemory()` API is not available',
    /**
     *@description Entry in the API availability section of the frame details view
     */
    measureMemory: 'Measure Memory',
    /**
     *@description Text that is usually a hyperlink to more documentation
     */
    learnMore: 'Learn more',
    /**
     *@description Label for a stack trace. If a frame is created programmatically (i.e. via JavaScript), there is a
     * stack trace for the line of code which caused the creation of the iframe. This is the stack trace we are showing here.
     */
    creationStackTrace: 'Frame Creation `Stack Trace`',
    /**
     *@description Tooltip for 'Frame Creation Stack Trace' explaining that the stack
     *trace shows where in the code the frame has been created programmatically
     */
    creationStackTraceExplanation: 'This frame was created programmatically. The `stack trace` shows where this happened.',
    /**
     *@description Text descripting why a frame has been indentified as an advertisement.
     */
    parentIsAdExplanation: 'This frame is considered an ad frame because its parent frame is an ad frame.',
    /**
     *@description Text descripting why a frame has been indentified as an advertisement.
     */
    matchedBlockingRuleExplanation: 'This frame is considered an ad frame because its current (or previous) main document is an ad resource.',
    /**
     *@description Text descripting why a frame has been indentified as an advertisement.
     */
    createdByAdScriptExplanation: 'There was an ad script in the `(async) stack` when this frame was created. Examining the creation `stack trace` of this frame might provide more insight.',
    /**
     *@description Label for the link(s) to the ad script(s) that led to this frame's creation.
     */
    creatorAdScriptAncestry: 'Creator Ad Script Ancestry',
    /**
     *@description Label for the filterlist rule that identified the root script in 'Creator Ad Script Ancestry' as an ad.
     */
    rootScriptFilterlistRule: 'Root Script Filterlist Rule',
    /**
     *@description Text describing the absence of a value.
     */
    none: 'None',
    /**
     *@description Explanation of what origin trials are
     *(https://developer.chrome.com/docs/web-platform/origin-trials/)
     *(please don't translate 'origin trials').
     */
    originTrialsExplanation: 'Origin trials give you access to a new or experimental feature.',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/components/FrameDetailsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class FrameDetailsReportView extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor(frame) {
        super();
        _FrameDetailsReportView_instances.add(this);
        _FrameDetailsReportView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _FrameDetailsReportView_frame.set(this, void 0);
        _FrameDetailsReportView_target.set(this, null);
        _FrameDetailsReportView_protocolMonitorExperimentEnabled.set(this, false);
        _FrameDetailsReportView_permissionsPolicies.set(this, null);
        _FrameDetailsReportView_permissionsPolicySectionData.set(this, { policies: [], showDetails: false });
        _FrameDetailsReportView_originTrialTreeView.set(this, new OriginTrialTreeView());
        _FrameDetailsReportView_linkifier.set(this, new Components.Linkifier.Linkifier());
        _FrameDetailsReportView_adScriptAncestry.set(this, null);
        __classPrivateFieldSet(this, _FrameDetailsReportView_frame, frame, "f");
        void this.render();
    }
    connectedCallback() {
        this.parentElement?.classList.add('overflow-auto');
        __classPrivateFieldSet(this, _FrameDetailsReportView_protocolMonitorExperimentEnabled, Root.Runtime.experiments.isEnabled('protocol-monitor'), "f");
    }
    async render() {
        const result = await __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")?.parentFrame()?.getAdScriptAncestry(__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")?.id);
        if (result && result.ancestryChain.length > 0) {
            __classPrivateFieldSet(this, _FrameDetailsReportView_adScriptAncestry, result, "f");
            // Obtain the Target associated with the first ad script, because in most scenarios all
            // scripts share the same debuggerId. However, discrepancies might arise when content scripts
            // from browser extensions are involved. We will monitor the debugging experiences and revisit
            // this approach if it proves problematic.
            const firstScript = __classPrivateFieldGet(this, _FrameDetailsReportView_adScriptAncestry, "f").ancestryChain[0];
            const debuggerModel = firstScript?.debuggerId ?
                await SDK.DebuggerModel.DebuggerModel.modelForDebuggerId(firstScript.debuggerId) :
                null;
            __classPrivateFieldSet(this, _FrameDetailsReportView_target, debuggerModel?.target() ?? null, "f");
        }
        if (!__classPrivateFieldGet(this, _FrameDetailsReportView_permissionsPolicies, "f") && __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
            __classPrivateFieldSet(this, _FrameDetailsReportView_permissionsPolicies, __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").getPermissionsPolicyState(), "f");
        }
        await RenderCoordinator.write('FrameDetailsView render', () => {
            if (!__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
                return;
            }
            // Disabled until https://crbug.com/1079231 is fixed.
            // clang-format off
            Lit.render(html `
        <style>${frameDetailsReportViewStyles}</style>
        <devtools-report .data=${{ reportTitle: __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").displayName() }}
        jslog=${VisualLogging.pane('frames')}>
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderDocumentSection).call(this)}
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderIsolationSection).call(this)}
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderApiAvailabilitySection).call(this)}
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderOriginTrial).call(this)}
          ${Lit.Directives.until(__classPrivateFieldGet(this, _FrameDetailsReportView_permissionsPolicies, "f")?.then(policies => {
                __classPrivateFieldGet(this, _FrameDetailsReportView_permissionsPolicySectionData, "f").policies = policies || [];
                return html `
              <devtools-resources-permissions-policy-section
                .data=${__classPrivateFieldGet(this, _FrameDetailsReportView_permissionsPolicySectionData, "f")}
              >
              </devtools-resources-permissions-policy-section>
            `;
            }), Lit.nothing)}
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_protocolMonitorExperimentEnabled, "f") ? __classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderAdditionalInfoSection).call(this) : Lit.nothing}
        </devtools-report>
      `, __classPrivateFieldGet(this, _FrameDetailsReportView_shadow, "f"), { host: this });
            // clang-format on
        });
    }
}
_FrameDetailsReportView_shadow = new WeakMap(), _FrameDetailsReportView_frame = new WeakMap(), _FrameDetailsReportView_target = new WeakMap(), _FrameDetailsReportView_protocolMonitorExperimentEnabled = new WeakMap(), _FrameDetailsReportView_permissionsPolicies = new WeakMap(), _FrameDetailsReportView_permissionsPolicySectionData = new WeakMap(), _FrameDetailsReportView_originTrialTreeView = new WeakMap(), _FrameDetailsReportView_linkifier = new WeakMap(), _FrameDetailsReportView_adScriptAncestry = new WeakMap(), _FrameDetailsReportView_instances = new WeakSet(), _FrameDetailsReportView_renderOriginTrial = function _FrameDetailsReportView_renderOriginTrial() {
    if (!__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        return Lit.nothing;
    }
    __classPrivateFieldGet(this, _FrameDetailsReportView_originTrialTreeView, "f").classList.add('span-cols');
    void __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").getOriginTrials().then(trials => {
        __classPrivateFieldGet(this, _FrameDetailsReportView_originTrialTreeView, "f").data = { trials };
    });
    // clang-format off
    return html `
    <devtools-report-section-header>
      ${i18n.i18n.lockedString('Origin trials')}
    </devtools-report-section-header>
    <devtools-report-section>
      <span class="report-section">
        ${i18nString(UIStrings.originTrialsExplanation)}
        <x-link href="https://developer.chrome.com/docs/web-platform/origin-trials/" class="link"
                jslog=${VisualLogging.link('learn-more.origin-trials').track({ click: true })}>
          ${i18nString(UIStrings.learnMore)}
        </x-link>
      </span>
    </devtools-report-section>
    ${__classPrivateFieldGet(this, _FrameDetailsReportView_originTrialTreeView, "f")}
    <devtools-report-divider></devtools-report-divider>`;
    // clang-format on
}, _FrameDetailsReportView_renderDocumentSection = function _FrameDetailsReportView_renderDocumentSection() {
    if (!__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        return Lit.nothing;
    }
    return html `
      <devtools-report-section-header>${i18nString(UIStrings.document)}</devtools-report-section-header>
      <devtools-report-key>${i18nString(UIStrings.url)}</devtools-report-key>
      <devtools-report-value>
        <div class="inline-items">
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderSourcesLinkForURL).call(this)}
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderNetworkLinkForURL).call(this)}
          <div class="text-ellipsis" title=${__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").url}>${__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").url}</div>
        </div>
      </devtools-report-value>
      ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderUnreachableURL).call(this)}
      ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderOrigin).call(this)}
      ${Lit.Directives.until(__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderOwnerElement).call(this), Lit.nothing)}
      ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderCreationStacktrace).call(this)}
      ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderAdStatus).call(this)}
      ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderCreatorAdScriptAncestry).call(this)}
      <devtools-report-divider></devtools-report-divider>
    `;
}, _FrameDetailsReportView_maybeRenderSourcesLinkForURL = function _FrameDetailsReportView_maybeRenderSourcesLinkForURL() {
    const frame = __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f");
    if (!frame || frame.unreachableUrl()) {
        return Lit.nothing;
    }
    return renderIconLink('label', i18nString(UIStrings.clickToOpenInSourcesPanel), async () => {
        const sourceCode = __classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_uiSourceCodeForFrame).call(this, frame);
        if (sourceCode) {
            await Common.Revealer.reveal(sourceCode);
        }
    }, 'reveal-in-sources');
}, _FrameDetailsReportView_maybeRenderNetworkLinkForURL = function _FrameDetailsReportView_maybeRenderNetworkLinkForURL() {
    if (__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        const resource = __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").resourceForURL(__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").url);
        if (resource?.request) {
            const request = resource.request;
            return renderIconLink('arrow-up-down-circle', i18nString(UIStrings.clickToOpenInNetworkPanel), () => {
                const requestLocation = NetworkForward.UIRequestLocation.UIRequestLocation.tab(request, "headers-component" /* NetworkForward.UIRequestLocation.UIRequestTabs.HEADERS_COMPONENT */);
                return Common.Revealer.reveal(requestLocation);
            }, 'reveal-in-network');
        }
    }
    return Lit.nothing;
}, _FrameDetailsReportView_uiSourceCodeForFrame = function _FrameDetailsReportView_uiSourceCodeForFrame(frame) {
    for (const project of Workspace.Workspace.WorkspaceImpl.instance().projects()) {
        const projectTarget = Bindings.NetworkProject.NetworkProject.getTargetForProject(project);
        if (projectTarget && projectTarget === frame.resourceTreeModel().target()) {
            const uiSourceCode = project.uiSourceCodeForURL(frame.url);
            if (uiSourceCode) {
                return uiSourceCode;
            }
        }
    }
    return null;
}, _FrameDetailsReportView_maybeRenderUnreachableURL = function _FrameDetailsReportView_maybeRenderUnreachableURL() {
    if (!__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f") || !__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").unreachableUrl()) {
        return Lit.nothing;
    }
    return html `
      <devtools-report-key>${i18nString(UIStrings.unreachableUrl)}</devtools-report-key>
      <devtools-report-value>
        <div class="inline-items">
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderNetworkLinkForUnreachableURL).call(this)}
          <div class="text-ellipsis" title=${__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").unreachableUrl()}>${__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").unreachableUrl()}</div>
        </div>
      </devtools-report-value>
    `;
}, _FrameDetailsReportView_renderNetworkLinkForUnreachableURL = function _FrameDetailsReportView_renderNetworkLinkForUnreachableURL() {
    if (__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        const unreachableUrl = Common.ParsedURL.ParsedURL.fromString(__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").unreachableUrl());
        if (unreachableUrl) {
            return renderIconLink('arrow-up-down-circle', i18nString(UIStrings.clickToOpenInNetworkPanelMight), () => {
                void Common.Revealer.reveal(NetworkForward.UIFilter.UIRequestFilter.filters([
                    {
                        filterType: NetworkForward.UIFilter.FilterType.Domain,
                        filterValue: unreachableUrl.domain(),
                    },
                    {
                        filterType: null,
                        filterValue: unreachableUrl.path,
                    },
                ]));
            }, 'unreachable-url.reveal-in-network');
        }
    }
    return Lit.nothing;
}, _FrameDetailsReportView_maybeRenderOrigin = function _FrameDetailsReportView_maybeRenderOrigin() {
    if (__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f") && __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").securityOrigin && __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").securityOrigin !== '://') {
        return html `
        <devtools-report-key>${i18nString(UIStrings.origin)}</devtools-report-key>
        <devtools-report-value>
          <div class="text-ellipsis" title=${__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").securityOrigin}>${__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").securityOrigin}</div>
        </devtools-report-value>
      `;
    }
    return Lit.nothing;
}, _FrameDetailsReportView_renderOwnerElement = async function _FrameDetailsReportView_renderOwnerElement() {
    if (__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        const linkTargetDOMNode = await __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").getOwnerDOMNodeOrDocument();
        if (linkTargetDOMNode) {
            // Disabled until https://crbug.com/1079231 is fixed.
            // clang-format off
            return html `
          <devtools-report-key>${i18nString(UIStrings.ownerElement)}</devtools-report-key>
          <devtools-report-value class="without-min-width">
            <div class="inline-items">
              <button class="link text-link" role="link" tabindex=0 title=${i18nString(UIStrings.clickToOpenInElementsPanel)}
                @mouseenter=${() => __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")?.highlight()}
                @mouseleave=${() => SDK.OverlayModel.OverlayModel.hideDOMNodeHighlight()}
                @click=${() => Common.Revealer.reveal(linkTargetDOMNode)}
                jslog=${VisualLogging.action('reveal-in-elements').track({ click: true })}
              >
                &lt;${linkTargetDOMNode.nodeName().toLocaleLowerCase()}&gt;
              </button>
            </div>
          </devtools-report-value>
        `;
            // clang-format on
        }
    }
    return Lit.nothing;
}, _FrameDetailsReportView_maybeRenderCreationStacktrace = function _FrameDetailsReportView_maybeRenderCreationStacktrace() {
    const creationStackTraceData = __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")?.getCreationStackTraceData();
    if (creationStackTraceData?.creationStackTrace) {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
        <devtools-report-key title=${i18nString(UIStrings.creationStackTraceExplanation)}>${i18nString(UIStrings.creationStackTrace)}</devtools-report-key>
        <devtools-report-value
        jslog=${VisualLogging.section('frame-creation-stack-trace')}
        >
          <devtools-resources-stack-trace .data=${{
            frame: __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f"),
            buildStackTraceRows: Components.JSPresentationUtils.buildStackTraceRows,
        }}>
          </devtools-resources-stack-trace>
        </devtools-report-value>
      `;
        // clang-format on
    }
    return Lit.nothing;
}, _FrameDetailsReportView_getAdFrameTypeStrings = function _FrameDetailsReportView_getAdFrameTypeStrings(type) {
    switch (type) {
        case "child" /* Protocol.Page.AdFrameType.Child */:
            return { value: i18nString(UIStrings.child), description: i18nString(UIStrings.childDescription) };
        case "root" /* Protocol.Page.AdFrameType.Root */:
            return { value: i18nString(UIStrings.root), description: i18nString(UIStrings.rootDescription) };
    }
}, _FrameDetailsReportView_getAdFrameExplanationString = function _FrameDetailsReportView_getAdFrameExplanationString(explanation) {
    switch (explanation) {
        case "CreatedByAdScript" /* Protocol.Page.AdFrameExplanation.CreatedByAdScript */:
            return i18nString(UIStrings.createdByAdScriptExplanation);
        case "MatchedBlockingRule" /* Protocol.Page.AdFrameExplanation.MatchedBlockingRule */:
            return i18nString(UIStrings.matchedBlockingRuleExplanation);
        case "ParentIsAd" /* Protocol.Page.AdFrameExplanation.ParentIsAd */:
            return i18nString(UIStrings.parentIsAdExplanation);
    }
}, _FrameDetailsReportView_maybeRenderAdStatus = function _FrameDetailsReportView_maybeRenderAdStatus() {
    if (!__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        return Lit.nothing;
    }
    const adFrameType = __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").adFrameType();
    if (adFrameType === "none" /* Protocol.Page.AdFrameType.None */) {
        return Lit.nothing;
    }
    const typeStrings = __classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_getAdFrameTypeStrings).call(this, adFrameType);
    const rows = [html `<div title=${typeStrings.description}>${typeStrings.value}</div>`];
    for (const explanation of __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").adFrameStatus()?.explanations || []) {
        rows.push(html `<div>${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_getAdFrameExplanationString).call(this, explanation)}</div>`);
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-report-key>${i18nString(UIStrings.adStatus)}</devtools-report-key>
      <devtools-report-value class="ad-status-list" jslog=${VisualLogging.section('ad-status')}>
        <devtools-expandable-list .data=${{ rows, title: i18nString(UIStrings.adStatus) }}>
        </devtools-expandable-list>
      </devtools-report-value>`;
    // clang-format on
}, _FrameDetailsReportView_maybeRenderCreatorAdScriptAncestry = function _FrameDetailsReportView_maybeRenderCreatorAdScriptAncestry() {
    if (!__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        return Lit.nothing;
    }
    const adFrameType = __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").adFrameType();
    if (adFrameType === "none" /* Protocol.Page.AdFrameType.None */) {
        return Lit.nothing;
    }
    if (!__classPrivateFieldGet(this, _FrameDetailsReportView_target, "f") || !__classPrivateFieldGet(this, _FrameDetailsReportView_adScriptAncestry, "f") || __classPrivateFieldGet(this, _FrameDetailsReportView_adScriptAncestry, "f").ancestryChain.length === 0) {
        return Lit.nothing;
    }
    const rows = __classPrivateFieldGet(this, _FrameDetailsReportView_adScriptAncestry, "f").ancestryChain.map(adScriptId => {
        const adScriptLinkElement = __classPrivateFieldGet(this, _FrameDetailsReportView_linkifier, "f").linkifyScriptLocation(__classPrivateFieldGet(this, _FrameDetailsReportView_target, "f"), adScriptId.scriptId || null, Platform.DevToolsPath.EmptyUrlString, undefined, undefined);
        adScriptLinkElement?.setAttribute('jslog', `${VisualLogging.link('ad-script').track({ click: true })}`);
        return html `<div>${adScriptLinkElement}</div>`;
    });
    const shouldRenderFilterlistRule = (__classPrivateFieldGet(this, _FrameDetailsReportView_adScriptAncestry, "f").rootScriptFilterlistRule !== undefined);
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-report-key>${i18nString(UIStrings.creatorAdScriptAncestry)}</devtools-report-key>
      <devtools-report-value class="creator-ad-script-ancestry-list" jslog=${VisualLogging.section('creator-ad-script-ancestry')}>
        <devtools-expandable-list .data=${{ rows, title: i18nString(UIStrings.creatorAdScriptAncestry) }}>
        </devtools-expandable-list>
      </devtools-report-value>
      ${shouldRenderFilterlistRule ? html `
        <devtools-report-key>${i18nString(UIStrings.rootScriptFilterlistRule)}</devtools-report-key>
        <devtools-report-value jslog=${VisualLogging.section('root-script-filterlist-rule')}>${__classPrivateFieldGet(this, _FrameDetailsReportView_adScriptAncestry, "f").rootScriptFilterlistRule}</devtools-report-value>
      ` : Lit.nothing}
    `;
    // clang-format on
}, _FrameDetailsReportView_renderIsolationSection = function _FrameDetailsReportView_renderIsolationSection() {
    if (!__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        return Lit.nothing;
    }
    return html `
      <devtools-report-section-header>${i18nString(UIStrings.securityIsolation)}</devtools-report-section-header>
      <devtools-report-key>${i18nString(UIStrings.secureContext)}</devtools-report-key>
      <devtools-report-value>
        ${__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").isSecureContext() ? i18nString(UIStrings.yes) : i18nString(UIStrings.no)}\xA0${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderSecureContextExplanation).call(this)}
      </devtools-report-value>
      <devtools-report-key>${i18nString(UIStrings.crossoriginIsolated)}</devtools-report-key>
      <devtools-report-value>
        ${__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").isCrossOriginIsolated() ? i18nString(UIStrings.yes) : i18nString(UIStrings.no)}
      </devtools-report-value>
      ${Lit.Directives.until(__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderCoopCoepCSPStatus).call(this), Lit.nothing)}
      <devtools-report-divider></devtools-report-divider>
    `;
}, _FrameDetailsReportView_maybeRenderSecureContextExplanation = function _FrameDetailsReportView_maybeRenderSecureContextExplanation() {
    const explanation = __classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_getSecureContextExplanation).call(this);
    if (explanation) {
        return html `<span class="inline-comment">${explanation}</span>`;
    }
    return Lit.nothing;
}, _FrameDetailsReportView_getSecureContextExplanation = function _FrameDetailsReportView_getSecureContextExplanation() {
    switch (__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")?.getSecureContextType()) {
        case "Secure" /* Protocol.Page.SecureContextType.Secure */:
            return null;
        case "SecureLocalhost" /* Protocol.Page.SecureContextType.SecureLocalhost */:
            return i18nString(UIStrings.localhostIsAlwaysASecureContext);
        case "InsecureAncestor" /* Protocol.Page.SecureContextType.InsecureAncestor */:
            return i18nString(UIStrings.aFrameAncestorIsAnInsecure);
        case "InsecureScheme" /* Protocol.Page.SecureContextType.InsecureScheme */:
            return i18nString(UIStrings.theFramesSchemeIsInsecure);
    }
    return null;
}, _FrameDetailsReportView_maybeRenderCoopCoepCSPStatus = async function _FrameDetailsReportView_maybeRenderCoopCoepCSPStatus() {
    if (__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        const model = __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").resourceTreeModel().target().model(SDK.NetworkManager.NetworkManager);
        const info = model && await model.getSecurityIsolationStatus(__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").id);
        if (info) {
            return html `
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderCrossOriginStatus).call(this, info.coep, i18n.i18n.lockedString('Cross-Origin Embedder Policy (COEP)'), "None" /* Protocol.Network.CrossOriginEmbedderPolicyValue.None */)}
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_maybeRenderCrossOriginStatus).call(this, info.coop, i18n.i18n.lockedString('Cross-Origin Opener Policy (COOP)'), "UnsafeNone" /* Protocol.Network.CrossOriginOpenerPolicyValue.UnsafeNone */)}
          ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderCSPSection).call(this, info.csp)}
        `;
        }
    }
    return Lit.nothing;
}, _FrameDetailsReportView_maybeRenderCrossOriginStatus = function _FrameDetailsReportView_maybeRenderCrossOriginStatus(info, policyName, noneValue) {
    if (!info) {
        return Lit.nothing;
    }
    function crossOriginValueToString(value) {
        switch (value) {
            case "Credentialless" /* Protocol.Network.CrossOriginEmbedderPolicyValue.Credentialless */:
                return 'credentialless';
            case "None" /* Protocol.Network.CrossOriginEmbedderPolicyValue.None */:
                return 'none';
            case "RequireCorp" /* Protocol.Network.CrossOriginEmbedderPolicyValue.RequireCorp */:
                return 'require-corp';
            case "NoopenerAllowPopups" /* Protocol.Network.CrossOriginOpenerPolicyValue.NoopenerAllowPopups */:
                return 'noopenener-allow-popups';
            case "SameOrigin" /* Protocol.Network.CrossOriginOpenerPolicyValue.SameOrigin */:
                return 'same-origin';
            case "SameOriginAllowPopups" /* Protocol.Network.CrossOriginOpenerPolicyValue.SameOriginAllowPopups */:
                return 'same-origin-allow-popups';
            case "SameOriginPlusCoep" /* Protocol.Network.CrossOriginOpenerPolicyValue.SameOriginPlusCoep */:
                return 'same-origin-plus-coep';
            case "RestrictProperties" /* Protocol.Network.CrossOriginOpenerPolicyValue.RestrictProperties */:
                return 'restrict-properties';
            case "RestrictPropertiesPlusCoep" /* Protocol.Network.CrossOriginOpenerPolicyValue.RestrictPropertiesPlusCoep */:
                return 'restrict-properties-plus-coep';
            case "UnsafeNone" /* Protocol.Network.CrossOriginOpenerPolicyValue.UnsafeNone */:
                return 'unsafe-none';
        }
    }
    const isEnabled = info.value !== noneValue;
    const isReportOnly = (!isEnabled && info.reportOnlyValue !== noneValue);
    const endpoint = isEnabled ? info.reportingEndpoint : info.reportOnlyReportingEndpoint;
    return html `
      <devtools-report-key>${policyName}</devtools-report-key>
      <devtools-report-value>
        ${crossOriginValueToString(isEnabled ? info.value : info.reportOnlyValue)}
        ${isReportOnly ? html `<span class="inline-comment">report-only</span>` : Lit.nothing}
        ${endpoint ? html `<span class="inline-name">${i18nString(UIStrings.reportingTo)}</span>${endpoint}` : Lit.nothing}
      </devtools-report-value>
    `;
}, _FrameDetailsReportView_renderEffectiveDirectives = function _FrameDetailsReportView_renderEffectiveDirectives(directives) {
    const parsedDirectives = new CspEvaluator.CspParser.CspParser(directives).csp.directives;
    const result = [];
    for (const directive in parsedDirectives) {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        result.push(html `
          <div>
            <span class="bold">${directive}</span>
            ${': ' + parsedDirectives[directive]?.join(', ')}
          </div>`);
        // clang-format on
    }
    return result;
}, _FrameDetailsReportView_renderSingleCSP = function _FrameDetailsReportView_renderSingleCSP(cspInfo, divider) {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-report-key>
        ${cspInfo.isEnforced ? i18n.i18n.lockedString('Content-Security-Policy') : html `
          ${i18n.i18n.lockedString('Content-Security-Policy-Report-Only')}
          <devtools-button
            .iconName=${'help'}
            class='help-button'
            .variant=${"icon" /* Buttons.Button.Variant.ICON */}
            .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
            @click=${() => { window.location.href = 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only'; }}
            jslog=${VisualLogging.link('learn-more.csp-report-only').track({ click: true })}
            ></devtools-button>`}
      </devtools-report-key>
      <devtools-report-value>
        ${cspInfo.source === "HTTP" /* Protocol.Network.ContentSecurityPolicySource.HTTP */ ?
        i18n.i18n.lockedString('HTTP header') : i18n.i18n.lockedString('Meta tag')}
        ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderEffectiveDirectives).call(this, cspInfo.effectiveDirectives)}
      </devtools-report-value>
      ${divider ? html `<devtools-report-divider class="subsection-divider"></devtools-report-divider>` : Lit.nothing}
    `;
    // clang-format on
}, _FrameDetailsReportView_renderCSPSection = function _FrameDetailsReportView_renderCSPSection(cspInfos) {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-report-divider></devtools-report-divider>
      <devtools-report-section-header>
        ${i18nString(UIStrings.contentSecurityPolicy)}
      </devtools-report-section-header>
      ${(cspInfos?.length) ? cspInfos.map((cspInfo, index) => __classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderSingleCSP).call(this, cspInfo, index < cspInfos?.length - 1)) : html `
        <devtools-report-key>
          ${i18n.i18n.lockedString('Content-Security-Policy')}
        </devtools-report-key>
        <devtools-report-value>
          ${i18nString(UIStrings.none)}
        </devtools-report-value>
      `}
    `;
    // clang-format on
}, _FrameDetailsReportView_renderApiAvailabilitySection = function _FrameDetailsReportView_renderApiAvailabilitySection() {
    if (!__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        return Lit.nothing;
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-report-section-header>
        ${i18nString(UIStrings.apiAvailability)}
      </devtools-report-section-header>
      <devtools-report-section>
        <span class="report-section">
          ${i18nString(UIStrings.availabilityOfCertainApisDepends)}
          <x-link
            href="https://web.dev/why-coop-coep/" class="link"
            jslog=${VisualLogging.link('learn-more.coop-coep').track({ click: true })}>
            ${i18nString(UIStrings.learnMore)}
          </x-link>
        </span>
      </devtools-report-section>
      ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderSharedArrayBufferAvailability).call(this)}
      ${__classPrivateFieldGet(this, _FrameDetailsReportView_instances, "m", _FrameDetailsReportView_renderMeasureMemoryAvailability).call(this)}
      <devtools-report-divider></devtools-report-divider>`;
    // clang-format on
}, _FrameDetailsReportView_renderSharedArrayBufferAvailability = function _FrameDetailsReportView_renderSharedArrayBufferAvailability() {
    if (__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        const features = __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").getGatedAPIFeatures();
        if (features) {
            const sabAvailable = features.includes("SharedArrayBuffers" /* Protocol.Page.GatedAPIFeatures.SharedArrayBuffers */);
            const sabTransferAvailable = sabAvailable && features.includes("SharedArrayBuffersTransferAllowed" /* Protocol.Page.GatedAPIFeatures.SharedArrayBuffersTransferAllowed */);
            const availabilityText = sabTransferAvailable ?
                i18nString(UIStrings.availableTransferable) :
                (sabAvailable ? i18nString(UIStrings.availableNotTransferable) : i18nString(UIStrings.unavailable));
            const tooltipText = sabTransferAvailable ?
                i18nString(UIStrings.sharedarraybufferConstructorIs) :
                (sabAvailable ? i18nString(UIStrings.sharedarraybufferConstructorIsAvailable) : '');
            function renderHint(frame) {
                switch (frame.getCrossOriginIsolatedContextType()) {
                    case "Isolated" /* Protocol.Page.CrossOriginIsolatedContextType.Isolated */:
                        return Lit.nothing;
                    case "NotIsolated" /* Protocol.Page.CrossOriginIsolatedContextType.NotIsolated */:
                        if (sabAvailable) {
                            // clang-format off
                            return html `
                  <span class="inline-comment">
                    ${i18nString(UIStrings.willRequireCrossoriginIsolated)}
                  </span>`;
                            // clang-format on
                        }
                        return html `<span class="inline-comment">${i18nString(UIStrings.requiresCrossoriginIsolated)}</span>`;
                    case "NotIsolatedFeatureDisabled" /* Protocol.Page.CrossOriginIsolatedContextType.NotIsolatedFeatureDisabled */:
                        if (!sabTransferAvailable) {
                            // clang-format off
                            return html `
                  <span class="inline-comment">
                    ${i18nString(UIStrings.transferRequiresCrossoriginIsolatedPermission)}
                    <code> cross-origin-isolated</code>
                  </span>`;
                            // clang-format on
                        }
                        break;
                }
                return Lit.nothing;
            }
            // SharedArrayBuffer is an API name, so we don't translate it.
            return html `
          <devtools-report-key>SharedArrayBuffers</devtools-report-key>
          <devtools-report-value title=${tooltipText}>
            ${availabilityText}\xA0${renderHint(__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f"))}
          </devtools-report-value>
        `;
        }
    }
    return Lit.nothing;
}, _FrameDetailsReportView_renderMeasureMemoryAvailability = function _FrameDetailsReportView_renderMeasureMemoryAvailability() {
    if (__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        const measureMemoryAvailable = __classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").isCrossOriginIsolated();
        const availabilityText = measureMemoryAvailable ? i18nString(UIStrings.available) : i18nString(UIStrings.unavailable);
        const tooltipText = measureMemoryAvailable ? i18nString(UIStrings.thePerformanceAPI) :
            i18nString(UIStrings.thePerformancemeasureuseragentspecificmemory);
        return html `
        <devtools-report-key>${i18nString(UIStrings.measureMemory)}</devtools-report-key>
        <devtools-report-value>
          <span title=${tooltipText}>${availabilityText}</span>\xA0<x-link class="link" href="https://web.dev/monitor-total-page-memory-usage/" jslog=${VisualLogging.link('learn-more.monitor-memory-usage').track({ click: true })}>${i18nString(UIStrings.learnMore)}</x-link>
        </devtools-report-value>
      `;
    }
    return Lit.nothing;
}, _FrameDetailsReportView_renderAdditionalInfoSection = function _FrameDetailsReportView_renderAdditionalInfoSection() {
    if (!__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f")) {
        return Lit.nothing;
    }
    return html `
      <devtools-report-section-header
        title=${i18nString(UIStrings.thisAdditionalDebugging)}
      >${i18nString(UIStrings.additionalInformation)}</devtools-report-section-header>
      <devtools-report-key>${i18nString(UIStrings.frameId)}</devtools-report-key>
      <devtools-report-value>
        <div class="text-ellipsis" title=${__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").id}>${__classPrivateFieldGet(this, _FrameDetailsReportView_frame, "f").id}</div>
      </devtools-report-value>
      <devtools-report-divider></devtools-report-divider>
    `;
};
customElements.define('devtools-resources-frame-details-view', FrameDetailsReportView);
//# sourceMappingURL=FrameDetailsView.js.map