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
var _BounceTrackingMitigationsView_instances, _BounceTrackingMitigationsView_shadow, _BounceTrackingMitigationsView_trackingSites, _BounceTrackingMitigationsView_screenStatus, _BounceTrackingMitigationsView_checkedFeature, _BounceTrackingMitigationsView_seenButtonClick, _BounceTrackingMitigationsView_render, _BounceTrackingMitigationsView_renderMainFrameInformation, _BounceTrackingMitigationsView_renderForceRunButton, _BounceTrackingMitigationsView_renderDeletedSitesOrNoSitesMessage, _BounceTrackingMitigationsView_runMitigations, _BounceTrackingMitigationsView_renderMitigationsResult, _BounceTrackingMitigationsView_checkFeatureState;
import '../../../ui/components/report_view/report_view.js';
import '../../../ui/legacy/components/data_grid/data_grid.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as LegacyWrapper from '../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import bounceTrackingMitigationsViewStyles from './bounceTrackingMitigationsView.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Title text in bounce tracking mitigations view of the Application panel.
     */
    bounceTrackingMitigationsTitle: 'Bounce tracking mitigations',
    /**
     * @description Label for the button to force bounce tracking mitigations to run.
     */
    forceRun: 'Force run',
    /**
     * @description Label for the disabled button while bounce tracking mitigations are running
     */
    runningMitigations: 'Running',
    /**
     * @description Heading of table which displays sites whose state was deleted by bounce tracking mitigations.
     */
    stateDeletedFor: 'State was deleted for the following sites:',
    /**
     * @description Text shown once the deletion command has been sent to the browser process.
     */
    checkingPotentialTrackers: 'Checking for potential bounce tracking sites.',
    /**
     * @description Link text about explanation of Bounce Tracking Mitigations.
     */
    learnMore: 'Learn more: Bounce Tracking Mitigations',
    /**
     * @description Text shown when bounce tracking mitigations have been forced to run and
     * identified no potential bounce tracking sites to delete state for. This may also
     * indicate that bounce tracking mitigations are disabled or third-party cookies aren't being blocked.
     */
    noPotentialBounceTrackersIdentified: 'State was not cleared for any potential bounce tracking sites. Either none were identified or third-party cookies are not blocked.',
    /**
     * @description Text shown when bounce tracking mitigations are disabled.
     */
    featureDisabled: 'Bounce tracking mitigations are disabled.',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/components/BounceTrackingMitigationsView.ts', UIStrings);
export const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
var ScreenStatusType;
(function (ScreenStatusType) {
    ScreenStatusType["RUNNING"] = "Running";
    ScreenStatusType["RESULT"] = "Result";
    ScreenStatusType["DISABLED"] = "Disabled";
})(ScreenStatusType || (ScreenStatusType = {}));
export class BounceTrackingMitigationsView extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super(...arguments);
        _BounceTrackingMitigationsView_instances.add(this);
        _BounceTrackingMitigationsView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _BounceTrackingMitigationsView_trackingSites.set(this, []);
        _BounceTrackingMitigationsView_screenStatus.set(this, "Result" /* ScreenStatusType.RESULT */);
        _BounceTrackingMitigationsView_checkedFeature.set(this, false);
        _BounceTrackingMitigationsView_seenButtonClick.set(this, false);
    }
    connectedCallback() {
        void __classPrivateFieldGet(this, _BounceTrackingMitigationsView_instances, "m", _BounceTrackingMitigationsView_render).call(this);
        this.parentElement?.classList.add('overflow-auto');
    }
}
_BounceTrackingMitigationsView_shadow = new WeakMap(), _BounceTrackingMitigationsView_trackingSites = new WeakMap(), _BounceTrackingMitigationsView_screenStatus = new WeakMap(), _BounceTrackingMitigationsView_checkedFeature = new WeakMap(), _BounceTrackingMitigationsView_seenButtonClick = new WeakMap(), _BounceTrackingMitigationsView_instances = new WeakSet(), _BounceTrackingMitigationsView_render = async function _BounceTrackingMitigationsView_render() {
    // clang-format off
    Lit.render(html `
      <style>${bounceTrackingMitigationsViewStyles}</style>
      <devtools-report .data=${{ reportTitle: i18nString(UIStrings.bounceTrackingMitigationsTitle) }}
                       jslog=${VisualLogging.pane('bounce-tracking-mitigations')}>
        ${await __classPrivateFieldGet(this, _BounceTrackingMitigationsView_instances, "m", _BounceTrackingMitigationsView_renderMainFrameInformation).call(this)}
      </devtools-report>
    `, __classPrivateFieldGet(this, _BounceTrackingMitigationsView_shadow, "f"), { host: this });
    // clang-format on
}, _BounceTrackingMitigationsView_renderMainFrameInformation = async function _BounceTrackingMitigationsView_renderMainFrameInformation() {
    if (!__classPrivateFieldGet(this, _BounceTrackingMitigationsView_checkedFeature, "f")) {
        await __classPrivateFieldGet(this, _BounceTrackingMitigationsView_instances, "m", _BounceTrackingMitigationsView_checkFeatureState).call(this);
    }
    if (__classPrivateFieldGet(this, _BounceTrackingMitigationsView_screenStatus, "f") === "Disabled" /* ScreenStatusType.DISABLED */) {
        // clang-format off
        return html `
        <devtools-report-section>
          ${i18nString(UIStrings.featureDisabled)}
        </devtools-report-section>
      `;
        // clang-format on
    }
    // clang-format off
    return html `
      <devtools-report-section>
        ${__classPrivateFieldGet(this, _BounceTrackingMitigationsView_instances, "m", _BounceTrackingMitigationsView_renderForceRunButton).call(this)}
      </devtools-report-section>
      ${__classPrivateFieldGet(this, _BounceTrackingMitigationsView_instances, "m", _BounceTrackingMitigationsView_renderDeletedSitesOrNoSitesMessage).call(this)}
      <devtools-report-divider>
      </devtools-report-divider>
      <devtools-report-section>
        <x-link href="https://privacycg.github.io/nav-tracking-mitigations/#bounce-tracking-mitigations" class="link"
        jslog=${VisualLogging.link('learn-more').track({ click: true })}>
          ${i18nString(UIStrings.learnMore)}
        </x-link>
      </devtools-report-section>
    `;
    // clang-format on
}, _BounceTrackingMitigationsView_renderForceRunButton = function _BounceTrackingMitigationsView_renderForceRunButton() {
    const isMitigationRunning = (__classPrivateFieldGet(this, _BounceTrackingMitigationsView_screenStatus, "f") === "Running" /* ScreenStatusType.RUNNING */);
    // clang-format off
    return html `
      <devtools-button
        aria-label=${i18nString(UIStrings.forceRun)}
        .disabled=${isMitigationRunning}
        .spinner=${isMitigationRunning}
        .variant=${"primary" /* Buttons.Button.Variant.PRIMARY */}
        @click=${__classPrivateFieldGet(this, _BounceTrackingMitigationsView_instances, "m", _BounceTrackingMitigationsView_runMitigations)}
        jslog=${VisualLogging.action('force-run').track({ click: true })}>
        ${isMitigationRunning ? html `
          ${i18nString(UIStrings.runningMitigations)}` : `
          ${i18nString(UIStrings.forceRun)}
        `}
      </devtools-button>
    `;
    // clang-format on
}, _BounceTrackingMitigationsView_renderDeletedSitesOrNoSitesMessage = function _BounceTrackingMitigationsView_renderDeletedSitesOrNoSitesMessage() {
    if (!__classPrivateFieldGet(this, _BounceTrackingMitigationsView_seenButtonClick, "f")) {
        return html ``;
    }
    if (__classPrivateFieldGet(this, _BounceTrackingMitigationsView_trackingSites, "f").length === 0) {
        // clang-format off
        return html `
        <devtools-report-section>
        ${(__classPrivateFieldGet(this, _BounceTrackingMitigationsView_screenStatus, "f") === "Running" /* ScreenStatusType.RUNNING */) ? html `
          ${i18nString(UIStrings.checkingPotentialTrackers)}` : `
          ${i18nString(UIStrings.noPotentialBounceTrackersIdentified)}
        `}
        </devtools-report-section>
      `;
        // clang-format on
    }
    // clang-format off
    return html `
      <devtools-report-section>
        <devtools-data-grid striped inline>
          <table>
            <tr>
              <th id="sites" weight="10" sortable>
                ${i18nString(UIStrings.stateDeletedFor)}
              </th>
            </tr>
            ${__classPrivateFieldGet(this, _BounceTrackingMitigationsView_trackingSites, "f").map(site => html `
              <tr><td>${site}</td></tr>`)}
          </table>
        </devtools-data-grid>
      </devtools-report-section>
    `;
    // clang-format on
}, _BounceTrackingMitigationsView_runMitigations = async function _BounceTrackingMitigationsView_runMitigations() {
    const mainTarget = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    if (!mainTarget) {
        return;
    }
    __classPrivateFieldSet(this, _BounceTrackingMitigationsView_seenButtonClick, true, "f");
    __classPrivateFieldSet(this, _BounceTrackingMitigationsView_screenStatus, "Running" /* ScreenStatusType.RUNNING */, "f");
    void __classPrivateFieldGet(this, _BounceTrackingMitigationsView_instances, "m", _BounceTrackingMitigationsView_render).call(this);
    const response = await mainTarget.storageAgent().invoke_runBounceTrackingMitigations();
    __classPrivateFieldSet(this, _BounceTrackingMitigationsView_trackingSites, [], "f");
    response.deletedSites.forEach(element => {
        __classPrivateFieldGet(this, _BounceTrackingMitigationsView_trackingSites, "f").push(element);
    });
    __classPrivateFieldGet(this, _BounceTrackingMitigationsView_instances, "m", _BounceTrackingMitigationsView_renderMitigationsResult).call(this);
}, _BounceTrackingMitigationsView_renderMitigationsResult = function _BounceTrackingMitigationsView_renderMitigationsResult() {
    __classPrivateFieldSet(this, _BounceTrackingMitigationsView_screenStatus, "Result" /* ScreenStatusType.RESULT */, "f");
    void __classPrivateFieldGet(this, _BounceTrackingMitigationsView_instances, "m", _BounceTrackingMitigationsView_render).call(this);
}, _BounceTrackingMitigationsView_checkFeatureState = async function _BounceTrackingMitigationsView_checkFeatureState() {
    __classPrivateFieldSet(this, _BounceTrackingMitigationsView_checkedFeature, true, "f");
    const mainTarget = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    if (!mainTarget) {
        return;
    }
    if (!(await mainTarget.systemInfo().invoke_getFeatureState({ featureState: 'DIPS' })).featureEnabled) {
        __classPrivateFieldSet(this, _BounceTrackingMitigationsView_screenStatus, "Disabled" /* ScreenStatusType.DISABLED */, "f");
    }
};
customElements.define('devtools-bounce-tracking-mitigations-view', BounceTrackingMitigationsView);
//# sourceMappingURL=BounceTrackingMitigationsView.js.map