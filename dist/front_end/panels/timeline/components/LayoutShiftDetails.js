// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _LayoutShiftDetails_instances, _LayoutShiftDetails_shadow, _LayoutShiftDetails_event, _LayoutShiftDetails_traceInsightsSets, _LayoutShiftDetails_parsedTrace, _LayoutShiftDetails_isFreshRecording, _LayoutShiftDetails_renderTitle, _LayoutShiftDetails_renderShiftedElements, _LayoutShiftDetails_renderIframe, _LayoutShiftDetails_linkifyURL, _LayoutShiftDetails_renderFontRequest, _LayoutShiftDetails_clickEvent, _LayoutShiftDetails_renderAnimation, _LayoutShiftDetails_renderUnsizedImage, _LayoutShiftDetails_renderRootCauseValues, _LayoutShiftDetails_renderStartTime, _LayoutShiftDetails_renderShiftRow, _LayoutShiftDetails_renderParentCluster, _LayoutShiftDetails_renderClusterTotalRow, _LayoutShiftDetails_renderShiftDetails, _LayoutShiftDetails_renderClusterDetails, _LayoutShiftDetails_render, _LayoutShiftDetails_togglePopover;
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as Helpers from '../../../models/trace/helpers/helpers.js';
import * as Trace from '../../../models/trace/trace.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as LegacyComponents from '../../../ui/legacy/components/utils/utils.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as Utils from '../utils/utils.js';
import * as Insights from './insights/insights.js';
import layoutShiftDetailsStyles from './layoutShiftDetails.css.js';
const { html } = Lit;
const MAX_URL_LENGTH = 20;
const UIStrings = {
    /**
     * @description Text referring to the start time of a given event.
     */
    startTime: 'Start time',
    /**
     * @description Text for a table header referring to the score of a Layout Shift event.
     */
    shiftScore: 'Shift score',
    /**
     * @description Text for a table header referring to the elements shifted for a Layout Shift event.
     */
    elementsShifted: 'Elements shifted',
    /**
     * @description Text for a table header referring to the culprit of a Layout Shift event.
     */
    culprit: 'Culprit',
    /**
     * @description Text for a culprit type of Injected iframe.
     */
    injectedIframe: 'Injected iframe',
    /**
     * @description Text for a culprit type of Font request.
     */
    fontRequest: 'Font request',
    /**
     * @description Text for a culprit type of non-composited animation.
     */
    nonCompositedAnimation: 'Non-composited animation',
    /**
     * @description Text referring to an animation.
     */
    animation: 'Animation',
    /**
     * @description Text referring to a parent cluster.
     */
    parentCluster: 'Parent cluster',
    /**
     * @description Text referring to a layout shift cluster and its start time.
     * @example {32 ms} PH1
     */
    cluster: 'Layout shift cluster @ {PH1}',
    /**
     * @description Text referring to a layout shift and its start time.
     * @example {32 ms} PH1
     */
    layoutShift: 'Layout shift @ {PH1}',
    /**
     * @description Text referring to the total cumulative score of a layout shift cluster.
     */
    total: 'Total',
    /**
     * @description Text for a culprit type of Unsized image.
     */
    unsizedImage: 'Unsized image',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/LayoutShiftDetails.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class LayoutShiftDetails extends HTMLElement {
    constructor() {
        super(...arguments);
        _LayoutShiftDetails_instances.add(this);
        _LayoutShiftDetails_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _LayoutShiftDetails_event.set(this, null);
        _LayoutShiftDetails_traceInsightsSets.set(this, null);
        _LayoutShiftDetails_parsedTrace.set(this, null);
        _LayoutShiftDetails_isFreshRecording.set(this, false);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_render).call(this);
    }
    setData(event, traceInsightsSets, parsedTrace, isFreshRecording) {
        if (__classPrivateFieldGet(this, _LayoutShiftDetails_event, "f") === event) {
            return;
        }
        __classPrivateFieldSet(this, _LayoutShiftDetails_event, event, "f");
        __classPrivateFieldSet(this, _LayoutShiftDetails_traceInsightsSets, traceInsightsSets, "f");
        __classPrivateFieldSet(this, _LayoutShiftDetails_parsedTrace, parsedTrace, "f");
        __classPrivateFieldSet(this, _LayoutShiftDetails_isFreshRecording, isFreshRecording, "f");
        __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_render).call(this);
    }
}
_LayoutShiftDetails_shadow = new WeakMap(), _LayoutShiftDetails_event = new WeakMap(), _LayoutShiftDetails_traceInsightsSets = new WeakMap(), _LayoutShiftDetails_parsedTrace = new WeakMap(), _LayoutShiftDetails_isFreshRecording = new WeakMap(), _LayoutShiftDetails_instances = new WeakSet(), _LayoutShiftDetails_renderTitle = function _LayoutShiftDetails_renderTitle(event) {
    const title = Utils.EntryName.nameForEntry(event);
    return html `
      <div class="layout-shift-details-title">
        <div class="layout-shift-event-title"></div>
        ${title}
      </div>
    `;
}, _LayoutShiftDetails_renderShiftedElements = function _LayoutShiftDetails_renderShiftedElements(shift, elementsShifted) {
    // clang-format off
    return html `
      ${elementsShifted?.map(el => {
        if (el.node_id !== undefined) {
            return html `
            <devtools-performance-node-link
              .data=${{
                backendNodeId: el.node_id,
                frame: shift.args.frame,
                fallbackHtmlSnippet: el.debug_name,
            }}>
            </devtools-performance-node-link>`;
        }
        return Lit.nothing;
    })}`;
    // clang-format on
}, _LayoutShiftDetails_renderIframe = function _LayoutShiftDetails_renderIframe(iframeRootCause) {
    const domLoadingId = iframeRootCause.frame;
    const domLoadingFrame = SDK.FrameManager.FrameManager.instance().getFrame(domLoadingId);
    let el;
    if (domLoadingFrame) {
        el = LegacyComponents.Linkifier.Linkifier.linkifyRevealable(domLoadingFrame, domLoadingFrame.displayName());
    }
    else {
        el = __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_linkifyURL).call(this, iframeRootCause.url);
    }
    // clang-format off
    return html `
      <span class="culprit">
        <span class="culprit-type"> ${i18nString(UIStrings.injectedIframe)}: </span>
        <span class="culprit-value">${el}</span>
      </span>`;
    // clang-format on
}, _LayoutShiftDetails_linkifyURL = function _LayoutShiftDetails_linkifyURL(url) {
    return LegacyComponents.Linkifier.Linkifier.linkifyURL(url, {
        tabStop: true,
        showColumnNumber: false,
        inlineFrameIndex: 0,
        maxLength: MAX_URL_LENGTH,
    });
}, _LayoutShiftDetails_renderFontRequest = function _LayoutShiftDetails_renderFontRequest(request) {
    const linkifiedURL = __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_linkifyURL).call(this, request.args.data.url);
    // clang-format off
    return html `
      <span class="culprit">
        <span class="culprit-type">${i18nString(UIStrings.fontRequest)}: </span>
        <span class="culprit-value">${linkifiedURL}</span>
      </span>`;
    // clang-format on
}, _LayoutShiftDetails_clickEvent = function _LayoutShiftDetails_clickEvent(event) {
    this.dispatchEvent(new Insights.EventRef.EventReferenceClick(event));
}, _LayoutShiftDetails_renderAnimation = function _LayoutShiftDetails_renderAnimation(failure) {
    const event = failure.animation;
    if (!event) {
        return null;
    }
    // clang-format off
    return html `
        <span class="culprit">
        <span class="culprit-type">${i18nString(UIStrings.nonCompositedAnimation)}: </span>
        <button type="button" class="culprit-value timeline-link" @click=${() => __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_clickEvent).call(this, event)}>${i18nString(UIStrings.animation)}</button>
      </span>`;
    // clang-format on
}, _LayoutShiftDetails_renderUnsizedImage = function _LayoutShiftDetails_renderUnsizedImage(frame, unsizedImage) {
    // clang-format off
    const el = html `
      <devtools-performance-node-link
        .data=${{
        backendNodeId: unsizedImage.backendNodeId,
        frame,
        fallbackUrl: unsizedImage.paintImageEvent.args.data.url,
    }}>
      </devtools-performance-node-link>`;
    return html `
      <span class="culprit">
        <span class="culprit-type">${i18nString(UIStrings.unsizedImage)}: </span>
        <span class="culprit-value">${el}</span>
      </span>`;
    // clang-format on
}, _LayoutShiftDetails_renderRootCauseValues = function _LayoutShiftDetails_renderRootCauseValues(frame, rootCauses) {
    return html `
      ${rootCauses?.webFonts.map(fontReq => __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderFontRequest).call(this, fontReq))}
      ${rootCauses?.iframes.map(iframe => __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderIframe).call(this, iframe))}
      ${rootCauses?.nonCompositedAnimations.map(failure => __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderAnimation).call(this, failure))}
      ${rootCauses?.unsizedImages.map(unsizedImage => __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderUnsizedImage).call(this, frame, unsizedImage))}
    `;
}, _LayoutShiftDetails_renderStartTime = function _LayoutShiftDetails_renderStartTime(shift, parsedTrace) {
    const ts = Trace.Types.Timing.Micro(shift.ts - parsedTrace.Meta.traceBounds.min);
    if (shift === __classPrivateFieldGet(this, _LayoutShiftDetails_event, "f")) {
        return html `${i18n.TimeUtilities.preciseMillisToString(Helpers.Timing.microToMilli(ts))}`;
    }
    const shiftTs = i18n.TimeUtilities.formatMicroSecondsTime(ts);
    // clang-format off
    return html `
         <button type="button" class="timeline-link" @click=${() => __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_clickEvent).call(this, shift)}>${i18nString(UIStrings.layoutShift, { PH1: shiftTs })}</button>`;
    // clang-format on
}, _LayoutShiftDetails_renderShiftRow = function _LayoutShiftDetails_renderShiftRow(shift, parsedTrace, elementsShifted, rootCauses) {
    const score = shift.args.data?.weighted_score_delta;
    if (!score) {
        return null;
    }
    const hasCulprits = Boolean(rootCauses &&
        (rootCauses.webFonts.length || rootCauses.iframes.length || rootCauses.nonCompositedAnimations.length ||
            rootCauses.unsizedImages.length));
    // clang-format off
    return html `
      <tr class="shift-row" data-ts=${shift.ts}>
        <td>${__classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderStartTime).call(this, shift, parsedTrace)}</td>
        <td>${(score.toFixed(4))}</td>
        ${elementsShifted.length ? html `
          <td>
            <div class="elements-shifted">
              ${__classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderShiftedElements).call(this, shift, elementsShifted)}
            </div>
          </td>` : Lit.nothing}
        ${hasCulprits ? html `
          <td class="culprits">
            ${__classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderRootCauseValues).call(this, shift.args.frame, rootCauses)}
          </td>` : Lit.nothing}
      </tr>`;
    // clang-format on
}, _LayoutShiftDetails_renderParentCluster = function _LayoutShiftDetails_renderParentCluster(cluster, parsedTrace) {
    if (!cluster) {
        return null;
    }
    const ts = Trace.Types.Timing.Micro(cluster.ts - (parsedTrace?.Meta.traceBounds.min ?? 0));
    const clusterTs = i18n.TimeUtilities.formatMicroSecondsTime(ts);
    // clang-format off
    return html `
      <span class="parent-cluster">${i18nString(UIStrings.parentCluster)}:
         <button type="button" class="timeline-link" @click=${() => __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_clickEvent).call(this, cluster)}>${i18nString(UIStrings.cluster, { PH1: clusterTs })}</button>
      </span>`;
    // clang-format on
}, _LayoutShiftDetails_renderClusterTotalRow = function _LayoutShiftDetails_renderClusterTotalRow(cluster) {
    // clang-format off
    return html `
      <td class="total-row">${i18nString(UIStrings.total)}</td>
      <td class="total-row">${(cluster.clusterCumulativeScore.toFixed(4))}</td>`;
    // clang-format on
}, _LayoutShiftDetails_renderShiftDetails = function _LayoutShiftDetails_renderShiftDetails(layoutShift, traceInsightsSets, parsedTrace) {
    if (!traceInsightsSets) {
        return null;
    }
    const insightsId = layoutShift.args.data?.navigationId ?? Trace.Types.Events.NO_NAVIGATION;
    const clsInsight = traceInsightsSets.get(insightsId)?.model.CLSCulprits;
    if (!clsInsight || clsInsight instanceof Error) {
        return null;
    }
    const rootCauses = clsInsight.shifts.get(layoutShift);
    let elementsShifted = layoutShift.args.data?.impacted_nodes ?? [];
    if (!__classPrivateFieldGet(this, _LayoutShiftDetails_isFreshRecording, "f")) {
        elementsShifted = elementsShifted?.filter(el => el.debug_name);
    }
    const hasCulprits = rootCauses &&
        (rootCauses.webFonts.length || rootCauses.iframes.length || rootCauses.nonCompositedAnimations.length ||
            rootCauses.unsizedImages.length);
    const hasShiftedElements = elementsShifted?.length;
    const parentCluster = clsInsight.clusters.find(cluster => {
        return cluster.events.find(event => event === layoutShift);
    });
    // clang-format off
    return html `
      <table class="layout-shift-details-table">
        <thead class="table-title">
          <tr>
            <th>${i18nString(UIStrings.startTime)}</th>
            <th>${i18nString(UIStrings.shiftScore)}</th>
            ${hasShiftedElements ? html `
              <th>${i18nString(UIStrings.elementsShifted)}</th>` : Lit.nothing}
            ${hasCulprits ? html `
              <th>${i18nString(UIStrings.culprit)}</th> ` : Lit.nothing}
          </tr>
        </thead>
        <tbody>
          ${__classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderShiftRow).call(this, layoutShift, parsedTrace, elementsShifted, rootCauses)}
        </tbody>
      </table>
      ${__classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderParentCluster).call(this, parentCluster, parsedTrace)}
    `;
    // clang-format on
}, _LayoutShiftDetails_renderClusterDetails = function _LayoutShiftDetails_renderClusterDetails(cluster, traceInsightsSets, parsedTrace) {
    if (!traceInsightsSets) {
        return null;
    }
    const insightsId = cluster.navigationId ?? Trace.Types.Events.NO_NAVIGATION;
    const clsInsight = traceInsightsSets.get(insightsId)?.model.CLSCulprits;
    if (!clsInsight || clsInsight instanceof Error) {
        return null;
    }
    // This finds the culprits of the cluster and returns an array of the culprits.
    const clusterCulprits = Array.from(clsInsight.shifts.entries())
        .filter(([key]) => cluster.events.includes(key))
        .map(([, value]) => value)
        .flatMap(x => Object.values(x))
        .flat();
    const hasCulprits = Boolean(clusterCulprits.length);
    // clang-format off
    return html `
          <table class="layout-shift-details-table">
            <thead class="table-title">
              <tr>
                <th>${i18nString(UIStrings.startTime)}</th>
                <th>${i18nString(UIStrings.shiftScore)}</th>
                <th>${i18nString(UIStrings.elementsShifted)}</th>
                ${hasCulprits ? html `
                  <th>${i18nString(UIStrings.culprit)}</th> ` : Lit.nothing}
              </tr>
            </thead>
            <tbody>
              ${cluster.events.map(shift => {
        const rootCauses = clsInsight.shifts.get(shift);
        const elementsShifted = shift.args.data?.impacted_nodes ?? [];
        return __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderShiftRow).call(this, shift, parsedTrace, elementsShifted, rootCauses);
    })}
              ${__classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderClusterTotalRow).call(this, cluster)}
            </tbody>
          </table>
        `;
    // clang-format on
}, _LayoutShiftDetails_render = function _LayoutShiftDetails_render() {
    if (!__classPrivateFieldGet(this, _LayoutShiftDetails_event, "f") || !__classPrivateFieldGet(this, _LayoutShiftDetails_parsedTrace, "f")) {
        return;
    }
    // clang-format off
    const output = html `
      <style>${layoutShiftDetailsStyles}</style>
      <style>${Buttons.textButtonStyles}</style>
      <div class="layout-shift-summary-details">
        <div
          class="event-details"
          @mouseover=${__classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_togglePopover)}
          @mouseleave=${__classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_togglePopover)}
        >
          ${__classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderTitle).call(this, __classPrivateFieldGet(this, _LayoutShiftDetails_event, "f"))}
          ${Trace.Types.Events.isSyntheticLayoutShift(__classPrivateFieldGet(this, _LayoutShiftDetails_event, "f"))
        ? __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderShiftDetails).call(this, __classPrivateFieldGet(this, _LayoutShiftDetails_event, "f"), __classPrivateFieldGet(this, _LayoutShiftDetails_traceInsightsSets, "f"), __classPrivateFieldGet(this, _LayoutShiftDetails_parsedTrace, "f"))
        : __classPrivateFieldGet(this, _LayoutShiftDetails_instances, "m", _LayoutShiftDetails_renderClusterDetails).call(this, __classPrivateFieldGet(this, _LayoutShiftDetails_event, "f"), __classPrivateFieldGet(this, _LayoutShiftDetails_traceInsightsSets, "f"), __classPrivateFieldGet(this, _LayoutShiftDetails_parsedTrace, "f"))}
        </div>
      </div>
    `;
    // clang-format on
    Lit.render(output, __classPrivateFieldGet(this, _LayoutShiftDetails_shadow, "f"), { host: this });
}, _LayoutShiftDetails_togglePopover = function _LayoutShiftDetails_togglePopover(e) {
    const show = e.type === 'mouseover';
    if (e.type === 'mouseleave') {
        this.dispatchEvent(new CustomEvent('toggle-popover', { detail: { show }, bubbles: true, composed: true }));
    }
    if (!(e.target instanceof HTMLElement) || !__classPrivateFieldGet(this, _LayoutShiftDetails_event, "f")) {
        return;
    }
    const rowEl = e.target.closest('tbody tr');
    if (!rowEl?.parentElement) {
        return;
    }
    // Grab the associated trace event of this row.
    const event = Trace.Types.Events.isSyntheticLayoutShift(__classPrivateFieldGet(this, _LayoutShiftDetails_event, "f")) ?
        __classPrivateFieldGet(this, _LayoutShiftDetails_event, "f") :
        __classPrivateFieldGet(this, _LayoutShiftDetails_event, "f").events.find(e => e.ts === parseInt(rowEl.getAttribute('data-ts') ?? '', 10));
    this.dispatchEvent(new CustomEvent('toggle-popover', { detail: { event, show }, bubbles: true, composed: true }));
};
customElements.define('devtools-performance-layout-shift-details', LayoutShiftDetails);
//# sourceMappingURL=LayoutShiftDetails.js.map