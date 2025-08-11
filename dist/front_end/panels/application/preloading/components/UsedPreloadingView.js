// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _UsedPreloadingView_instances, _UsedPreloadingView_shadow, _UsedPreloadingView_data, _UsedPreloadingView_render, _UsedPreloadingView_renderInternal, _UsedPreloadingView_speculativeLoadingStatusForThisPageSections, _UsedPreloadingView_maybeMismatchedSections, _UsedPreloadingView_maybeMismatchedHTTPHeadersSections, _UsedPreloadingView_speculationsInitiatedByThisPageSummarySections, _UsedPreloadingView_badgeSuccess, _UsedPreloadingView_badgeFailure, _UsedPreloadingView_badgeNeutral, _UsedPreloadingView_badge;
import '../../../../ui/components/icon_button/icon_button.js';
import '../../../../ui/components/report_view/report_view.js';
import './PreloadingMismatchedHeadersGrid.js';
import './MismatchedPreloadingGrid.js';
import * as Common from '../../../../core/common/common.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import { assertNotNullOrUndefined } from '../../../../core/platform/platform.js';
import * as SDK from '../../../../core/sdk/sdk.js';
import * as LegacyWrapper from '../../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as RenderCoordinator from '../../../../ui/components/render_coordinator/render_coordinator.js';
import * as UI from '../../../../ui/legacy/legacy.js';
import * as Lit from '../../../../ui/lit/lit.js';
import * as VisualLogging from '../../../../ui/visual_logging/visual_logging.js';
import * as PreloadingHelper from '../helper/helper.js';
import { prefetchFailureReason, prerenderFailureReason } from './PreloadingString.js';
import usedPreloadingStyles from './usedPreloadingView.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description Header for preloading status.
     */
    speculativeLoadingStatusForThisPage: 'Speculative loading status for this page',
    /**
     *@description Label for failure reason of preloeading
     */
    detailsFailureReason: 'Failure reason',
    /**
     *@description Message that tells this page was prerendered.
     */
    downgradedPrefetchUsed: 'The initiating page attempted to prerender this page\'s URL. The prerender failed, but the resulting response body was still used as a prefetch.',
    /**
     *@description Message that tells this page was prefetched.
     */
    prefetchUsed: 'This page was successfully prefetched.',
    /**
     *@description Message that tells this page was prerendered.
     */
    prerenderUsed: 'This page was successfully prerendered.',
    /**
     *@description Message that tells this page was prefetched.
     */
    prefetchFailed: 'The initiating page attempted to prefetch this page\'s URL, but the prefetch failed, so a full navigation was performed instead.',
    /**
     *@description Message that tells this page was prerendered.
     */
    prerenderFailed: 'The initiating page attempted to prerender this page\'s URL, but the prerender failed, so a full navigation was performed instead.',
    /**
     *@description Message that tells this page was not preloaded.
     */
    noPreloads: 'The initiating page did not attempt to speculatively load this page\'s URL.',
    /**
     *@description Header for current URL.
     */
    currentURL: 'Current URL',
    /**
     *@description Header for mismatched preloads.
     */
    preloadedURLs: 'URLs being speculatively loaded by the initiating page',
    /**
     *@description Header for summary.
     */
    speculationsInitiatedByThisPage: 'Speculations initiated by this page',
    /**
     *@description Link text to reveal rules.
     */
    viewAllRules: 'View all speculation rules',
    /**
     *@description Link text to reveal preloads.
     */
    viewAllSpeculations: 'View all speculations',
    /**
     *@description Link to learn more about Preloading
     */
    learnMore: 'Learn more: Speculative loading on developer.chrome.com',
    /**
     *@description Header for the table of mismatched network request header.
     */
    mismatchedHeadersDetail: 'Mismatched HTTP request headers',
    /**
     *@description Label for badge, indicating speculative load successfully used for this page.
     */
    badgeSuccess: 'Success',
    /**
     *@description Label for badge, indicating speculative load failed for this page.
     */
    badgeFailure: 'Failure',
    /**
     *@description Label for badge, indicating no speculative loads used for this page.
     */
    badgeNoSpeculativeLoads: 'No speculative loads',
    /**
     *@description Label for badge, indicating how many not triggered speculations there are.
     */
    badgeNotTriggeredWithCount: '{n, plural, =1 {# not triggered} other {# not triggered}}',
    /**
     *@description Label for badge, indicating how many in progress speculations there are.
     */
    badgeInProgressWithCount: '{n, plural, =1 {# in progress} other {# in progress}}',
    /**
     *@description Label for badge, indicating how many succeeded speculations there are.
     */
    badgeSuccessWithCount: '{n, plural, =1 {# success} other {# success}}',
    /**
     *@description Label for badge, indicating how many failed speculations there are.
     */
    badgeFailureWithCount: '{n, plural, =1 {# failure} other {# failures}}',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/preloading/components/UsedPreloadingView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var UsedKind;
(function (UsedKind) {
    UsedKind["DOWNGRADED_PRERENDER_TO_PREFETCH_AND_USED"] = "DowngradedPrerenderToPrefetchAndUsed";
    UsedKind["PREFETCH_USED"] = "PrefetchUsed";
    UsedKind["PRERENDER_USED"] = "PrerenderUsed";
    UsedKind["PREFETCH_FAILED"] = "PrefetchFailed";
    UsedKind["PRERENDER_FAILED"] = "PrerenderFailed";
    UsedKind["NO_PRELOADS"] = "NoPreloads";
})(UsedKind || (UsedKind = {}));
// TODO(kenoss): Rename this class and file once https://crrev.com/c/4933567 landed.
// This also shows summary of speculations initiated by this page.
export class UsedPreloadingView extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super(...arguments);
        _UsedPreloadingView_instances.add(this);
        _UsedPreloadingView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _UsedPreloadingView_data.set(this, {
            pageURL: '',
            previousAttempts: [],
            currentAttempts: [],
        });
    }
    set data(data) {
        __classPrivateFieldSet(this, _UsedPreloadingView_data, data, "f");
        void __classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_render).call(this);
    }
}
_UsedPreloadingView_shadow = new WeakMap(), _UsedPreloadingView_data = new WeakMap(), _UsedPreloadingView_instances = new WeakSet(), _UsedPreloadingView_render = async function _UsedPreloadingView_render() {
    await RenderCoordinator.write('UsedPreloadingView render', () => {
        Lit.render(__classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_renderInternal).call(this), __classPrivateFieldGet(this, _UsedPreloadingView_shadow, "f"), { host: this });
    });
}, _UsedPreloadingView_renderInternal = function _UsedPreloadingView_renderInternal() {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <style>${usedPreloadingStyles}</style>
      <devtools-report>
        ${__classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_speculativeLoadingStatusForThisPageSections).call(this)}

        <devtools-report-divider></devtools-report-divider>

        ${__classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_speculationsInitiatedByThisPageSummarySections).call(this)}

        <devtools-report-divider></devtools-report-divider>

        <devtools-report-section>
          ${UI.XLink.XLink.create('https://developer.chrome.com/blog/prerender-pages/', i18nString(UIStrings.learnMore), 'link', undefined, 'learn-more')}
        </devtools-report-section>
      </devtools-report>
    `;
    // clang-format on
}, _UsedPreloadingView_speculativeLoadingStatusForThisPageSections = function _UsedPreloadingView_speculativeLoadingStatusForThisPageSections() {
    const pageURL = Common.ParsedURL.ParsedURL.urlWithoutHash(__classPrivateFieldGet(this, _UsedPreloadingView_data, "f").pageURL);
    const forThisPage = __classPrivateFieldGet(this, _UsedPreloadingView_data, "f").previousAttempts.filter(attempt => Common.ParsedURL.ParsedURL.urlWithoutHash(attempt.key.url) === pageURL);
    const prefetch = forThisPage.filter(attempt => attempt.key.action === "Prefetch" /* Protocol.Preload.SpeculationAction.Prefetch */)[0];
    const prerender = forThisPage.filter(attempt => attempt.key.action === "Prerender" /* Protocol.Preload.SpeculationAction.Prerender */)[0];
    let kind = "NoPreloads" /* UsedKind.NO_PRELOADS */;
    // Prerender -> prefetch downgrade case
    //
    // This code does not handle the case SpecRules designate these preloads rather than prerenderer automatically downgrade prerendering.
    // TODO(https://crbug.com/1410709): Improve this logic once automatic downgrade implemented.
    if (prerender?.status === "Failure" /* SDK.PreloadingModel.PreloadingStatus.FAILURE */ &&
        prefetch?.status === "Success" /* SDK.PreloadingModel.PreloadingStatus.SUCCESS */) {
        kind = "DowngradedPrerenderToPrefetchAndUsed" /* UsedKind.DOWNGRADED_PRERENDER_TO_PREFETCH_AND_USED */;
    }
    else if (prefetch?.status === "Success" /* SDK.PreloadingModel.PreloadingStatus.SUCCESS */) {
        kind = "PrefetchUsed" /* UsedKind.PREFETCH_USED */;
    }
    else if (prerender?.status === "Success" /* SDK.PreloadingModel.PreloadingStatus.SUCCESS */) {
        kind = "PrerenderUsed" /* UsedKind.PRERENDER_USED */;
    }
    else if (prefetch?.status === "Failure" /* SDK.PreloadingModel.PreloadingStatus.FAILURE */) {
        kind = "PrefetchFailed" /* UsedKind.PREFETCH_FAILED */;
    }
    else if (prerender?.status === "Failure" /* SDK.PreloadingModel.PreloadingStatus.FAILURE */) {
        kind = "PrerenderFailed" /* UsedKind.PRERENDER_FAILED */;
    }
    else {
        kind = "NoPreloads" /* UsedKind.NO_PRELOADS */;
    }
    let badge;
    let basicMessage;
    switch (kind) {
        case "DowngradedPrerenderToPrefetchAndUsed" /* UsedKind.DOWNGRADED_PRERENDER_TO_PREFETCH_AND_USED */:
            badge = __classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeSuccess).call(this);
            basicMessage = html `${i18nString(UIStrings.downgradedPrefetchUsed)}`;
            break;
        case "PrefetchUsed" /* UsedKind.PREFETCH_USED */:
            badge = __classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeSuccess).call(this);
            basicMessage = html `${i18nString(UIStrings.prefetchUsed)}`;
            break;
        case "PrerenderUsed" /* UsedKind.PRERENDER_USED */:
            badge = __classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeSuccess).call(this);
            basicMessage = html `${i18nString(UIStrings.prerenderUsed)}`;
            break;
        case "PrefetchFailed" /* UsedKind.PREFETCH_FAILED */:
            badge = __classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeFailure).call(this);
            basicMessage = html `${i18nString(UIStrings.prefetchFailed)}`;
            break;
        case "PrerenderFailed" /* UsedKind.PRERENDER_FAILED */:
            badge = __classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeFailure).call(this);
            basicMessage = html `${i18nString(UIStrings.prerenderFailed)}`;
            break;
        case "NoPreloads" /* UsedKind.NO_PRELOADS */:
            badge = __classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeNeutral).call(this, i18nString(UIStrings.badgeNoSpeculativeLoads));
            basicMessage = html `${i18nString(UIStrings.noPreloads)}`;
            break;
    }
    let maybeFailureReasonMessage;
    if (kind === "PrefetchFailed" /* UsedKind.PREFETCH_FAILED */) {
        assertNotNullOrUndefined(prefetch);
        maybeFailureReasonMessage = prefetchFailureReason(prefetch);
    }
    else if (kind === "PrerenderFailed" /* UsedKind.PRERENDER_FAILED */ || kind === "DowngradedPrerenderToPrefetchAndUsed" /* UsedKind.DOWNGRADED_PRERENDER_TO_PREFETCH_AND_USED */) {
        assertNotNullOrUndefined(prerender);
        maybeFailureReasonMessage = prerenderFailureReason(prerender);
    }
    let maybeFailureReason = Lit.nothing;
    if (maybeFailureReasonMessage !== undefined) {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        maybeFailureReason = html `
      <devtools-report-section-header>${i18nString(UIStrings.detailsFailureReason)}</devtools-report-section-header>
      <devtools-report-section>
        ${maybeFailureReasonMessage}
      </devtools-report-section>
      `;
        // clang-format on
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-report-section-header>${i18nString(UIStrings.speculativeLoadingStatusForThisPage)}</devtools-report-section-header>
      <devtools-report-section>
        <div>
          <div class="status-badge-container">
            ${badge}
          </div>
          <div>
            ${basicMessage}
          </div>
        </div>
      </devtools-report-section>

      ${maybeFailureReason}

      ${__classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_maybeMismatchedSections).call(this, kind)}
      ${__classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_maybeMismatchedHTTPHeadersSections).call(this)}
    `;
    // clang-format on
}, _UsedPreloadingView_maybeMismatchedSections = function _UsedPreloadingView_maybeMismatchedSections(kind) {
    if (kind !== "NoPreloads" /* UsedKind.NO_PRELOADS */ || __classPrivateFieldGet(this, _UsedPreloadingView_data, "f").previousAttempts.length === 0) {
        return Lit.nothing;
    }
    const rows = __classPrivateFieldGet(this, _UsedPreloadingView_data, "f").previousAttempts.map(attempt => {
        return {
            url: attempt.key.url,
            action: attempt.key.action,
            status: attempt.status,
        };
    });
    const data = {
        pageURL: __classPrivateFieldGet(this, _UsedPreloadingView_data, "f").pageURL,
        rows,
    };
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-report-section-header>${i18nString(UIStrings.currentURL)}</devtools-report-section-header>
      <devtools-report-section>
        ${UI.XLink.XLink.create(__classPrivateFieldGet(this, _UsedPreloadingView_data, "f").pageURL, undefined, 'link', undefined, 'current-url')}
      </devtools-report-section>

      <devtools-report-section-header>${i18nString(UIStrings.preloadedURLs)}</devtools-report-section-header>
      <devtools-report-section
      jslog=${VisualLogging.section('preloaded-urls')}>
        <devtools-resources-mismatched-preloading-grid
          .data=${data}></devtools-resources-mismatched-preloading-grid>
      </devtools-report-section>
    `;
    // clang-format on
}, _UsedPreloadingView_maybeMismatchedHTTPHeadersSections = function _UsedPreloadingView_maybeMismatchedHTTPHeadersSections() {
    const attempt = __classPrivateFieldGet(this, _UsedPreloadingView_data, "f").previousAttempts.find(attempt => attempt.action === "Prerender" /* Protocol.Preload.SpeculationAction.Prerender */ && attempt.mismatchedHeaders !== null);
    if (attempt === undefined) {
        return Lit.nothing;
    }
    if (attempt.key.url !== __classPrivateFieldGet(this, _UsedPreloadingView_data, "f").pageURL) {
        // This place should never be reached since mismatched headers is reported only if the activation is attempted.
        // TODO(crbug.com/1456673): remove this check once DevTools support embedder-triggered prerender or prerender
        // supports non-vary-search.
        throw new Error('unreachable');
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-report-section-header>${i18nString(UIStrings.mismatchedHeadersDetail)}</devtools-report-section-header>
      <devtools-report-section>
        <devtools-resources-preloading-mismatched-headers-grid
          .data=${attempt}></devtools-resources-preloading-mismatched-headers-grid>
      </devtools-report-section>
    `;
    // clang-format on
}, _UsedPreloadingView_speculationsInitiatedByThisPageSummarySections = function _UsedPreloadingView_speculationsInitiatedByThisPageSummarySections() {
    const count = __classPrivateFieldGet(this, _UsedPreloadingView_data, "f").currentAttempts.reduce((acc, attempt) => {
        acc.set(attempt.status, (acc.get(attempt.status) ?? 0) + 1);
        return acc;
    }, new Map());
    const notTriggeredCount = count.get("NotTriggered" /* SDK.PreloadingModel.PreloadingStatus.NOT_TRIGGERED */) ?? 0;
    const readyCount = count.get("Ready" /* SDK.PreloadingModel.PreloadingStatus.READY */) ?? 0;
    const failureCount = count.get("Failure" /* SDK.PreloadingModel.PreloadingStatus.FAILURE */) ?? 0;
    const inProgressCount = (count.get("Pending" /* SDK.PreloadingModel.PreloadingStatus.PENDING */) ?? 0) +
        (count.get("Running" /* SDK.PreloadingModel.PreloadingStatus.RUNNING */) ?? 0);
    const badges = [];
    if (__classPrivateFieldGet(this, _UsedPreloadingView_data, "f").currentAttempts.length === 0) {
        badges.push(__classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeNeutral).call(this, i18nString(UIStrings.badgeNoSpeculativeLoads)));
    }
    if (notTriggeredCount > 0) {
        badges.push(__classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeNeutral).call(this, i18nString(UIStrings.badgeNotTriggeredWithCount, { n: notTriggeredCount })));
    }
    if (inProgressCount > 0) {
        badges.push(__classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeNeutral).call(this, i18nString(UIStrings.badgeInProgressWithCount, { n: inProgressCount })));
    }
    if (readyCount > 0) {
        badges.push(__classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeSuccess).call(this, readyCount));
    }
    if (failureCount > 0) {
        badges.push(__classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badgeFailure).call(this, failureCount));
    }
    const revealRuleSetView = () => {
        void Common.Revealer.reveal(new PreloadingHelper.PreloadingForward.RuleSetView(null));
    };
    const revealAttemptViewWithFilter = () => {
        void Common.Revealer.reveal(new PreloadingHelper.PreloadingForward.AttemptViewWithFilter(null));
    };
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <devtools-report-section-header>${i18nString(UIStrings.speculationsInitiatedByThisPage)}</devtools-report-section-header>
      <devtools-report-section>
        <div>
          <div class="status-badge-container">
            ${badges}
          </div>

          <div class="reveal-links">
            <button class="link devtools-link" @click=${revealRuleSetView}
            jslog=${VisualLogging.action('view-all-rules').track({ click: true })}>
              ${i18nString(UIStrings.viewAllRules)}
            </button>
           ・
            <button class="link devtools-link" @click=${revealAttemptViewWithFilter}
            jslog=${VisualLogging.action('view-all-speculations').track({ click: true })}>
             ${i18nString(UIStrings.viewAllSpeculations)}
            </button>
          </div>
        </div>
      </devtools-report-section>
    `;
    // clang-format on
}, _UsedPreloadingView_badgeSuccess = function _UsedPreloadingView_badgeSuccess(count) {
    let message;
    if (count === undefined) {
        message = i18nString(UIStrings.badgeSuccess);
    }
    else {
        message = i18nString(UIStrings.badgeSuccessWithCount, { n: count });
    }
    return __classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badge).call(this, 'status-badge status-badge-success', 'check-circle', message);
}, _UsedPreloadingView_badgeFailure = function _UsedPreloadingView_badgeFailure(count) {
    let message;
    if (count === undefined) {
        message = i18nString(UIStrings.badgeFailure);
    }
    else {
        message = i18nString(UIStrings.badgeFailureWithCount, { n: count });
    }
    return __classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badge).call(this, 'status-badge status-badge-failure', 'cross-circle', message);
}, _UsedPreloadingView_badgeNeutral = function _UsedPreloadingView_badgeNeutral(message) {
    return __classPrivateFieldGet(this, _UsedPreloadingView_instances, "m", _UsedPreloadingView_badge).call(this, 'status-badge status-badge-neutral', 'clear', message);
}, _UsedPreloadingView_badge = function _UsedPreloadingView_badge(klass, iconName, message) {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      <span class=${klass}>
        <devtools-icon name=${iconName}></devtools-icon>
        <span>
          ${message}
        </span>
      </span>
    `;
    // clang-format on
};
customElements.define('devtools-resources-used-preloading-view', UsedPreloadingView);
//# sourceMappingURL=UsedPreloadingView.js.map