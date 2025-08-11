// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _PerformanceInsightFormatter_instances, _PerformanceInsightFormatter_insight, _PerformanceInsightFormatter_parsedTrace, _PerformanceInsightFormatter_lcpMetricSharedContext, _PerformanceInsightFormatter_details, _PerformanceInsightFormatter_links, _PerformanceInsightFormatter_description, _a, _TraceEventFormatter_networkRequestVerbosely, _TraceEventFormatter_getOrAssignUrlIndex, _TraceEventFormatter_networkRequestsArrayCompressed, _TraceEventFormatter_networkRequestCompressedFormat;
import * as i18n from '../../../core/i18n/i18n.js';
import * as Trace from '../../trace/trace.js';
import { NetworkRequestFormatter, } from './NetworkRequestFormatter.js';
function formatMilli(x) {
    if (x === undefined) {
        return '';
    }
    return i18n.TimeUtilities.preciseMillisToString(x, 2, /* separator */ ' ');
}
function formatMicroToMilli(x) {
    if (x === undefined) {
        return '';
    }
    return formatMilli(Trace.Helpers.Timing.microToMilli(x));
}
/**
 * For a given frame ID and navigation ID, returns the LCP Event and the LCP Request, if the resource was an image.
 */
function getLCPData(parsedTrace, frameId, navigationId) {
    const navMetrics = parsedTrace.PageLoadMetrics.metricScoresByFrameId.get(frameId)?.get(navigationId);
    if (!navMetrics) {
        return null;
    }
    const metric = navMetrics.get("LCP" /* Trace.Handlers.ModelHandlers.PageLoadMetrics.MetricName.LCP */);
    if (!metric || !Trace.Handlers.ModelHandlers.PageLoadMetrics.metricIsLCP(metric)) {
        return null;
    }
    const lcpEvent = metric?.event;
    if (!lcpEvent || !Trace.Types.Events.isLargestContentfulPaintCandidate(lcpEvent)) {
        return null;
    }
    return {
        lcpEvent,
        lcpRequest: parsedTrace.LargestImagePaint.lcpRequestByNavigationId.get(navigationId),
        metricScore: metric,
    };
}
export class PerformanceInsightFormatter {
    constructor(activeInsight) {
        _PerformanceInsightFormatter_instances.add(this);
        _PerformanceInsightFormatter_insight.set(this, void 0);
        _PerformanceInsightFormatter_parsedTrace.set(this, void 0);
        __classPrivateFieldSet(this, _PerformanceInsightFormatter_insight, activeInsight.insight, "f");
        __classPrivateFieldSet(this, _PerformanceInsightFormatter_parsedTrace, activeInsight.parsedTrace, "f");
    }
    insightIsSupported() {
        return __classPrivateFieldGet(this, _PerformanceInsightFormatter_instances, "m", _PerformanceInsightFormatter_description).call(this).length > 0;
    }
    /**
     * Formats and outputs the insight's data.
     * Pass `{headingLevel: X}` to determine what heading level to use for the
     * titles in the markdown output. The default is 2 (##).
     */
    formatInsight(opts = { headingLevel: 2 }) {
        const header = '#'.repeat(opts.headingLevel);
        const { title } = __classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f");
        return `${header} Insight Title: ${title}

${header} Insight Summary:
${__classPrivateFieldGet(this, _PerformanceInsightFormatter_instances, "m", _PerformanceInsightFormatter_description).call(this)}

${header} Detailed analysis:
${__classPrivateFieldGet(this, _PerformanceInsightFormatter_instances, "m", _PerformanceInsightFormatter_details).call(this)}

${header} External resources:
${__classPrivateFieldGet(this, _PerformanceInsightFormatter_instances, "m", _PerformanceInsightFormatter_links).call(this)}`;
    }
}
_PerformanceInsightFormatter_insight = new WeakMap(), _PerformanceInsightFormatter_parsedTrace = new WeakMap(), _PerformanceInsightFormatter_instances = new WeakSet(), _PerformanceInsightFormatter_lcpMetricSharedContext = function _PerformanceInsightFormatter_lcpMetricSharedContext() {
    if (!__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").navigationId) {
        // No navigation ID = no LCP.
        return '';
    }
    if (!__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").frameId || !__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").navigationId) {
        return '';
    }
    const data = getLCPData(__classPrivateFieldGet(this, _PerformanceInsightFormatter_parsedTrace, "f"), __classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").frameId, __classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").navigationId);
    if (!data) {
        return '';
    }
    const { metricScore, lcpRequest, lcpEvent } = data;
    const theLcpElement = lcpEvent.args.data?.nodeName ? `The LCP element (${lcpEvent.args.data.nodeName})` : 'The LCP element';
    const parts = [
        `The Largest Contentful Paint (LCP) time for this navigation was ${formatMicroToMilli(metricScore.timing)}.`,
    ];
    if (lcpRequest) {
        parts.push(`${theLcpElement} is an image fetched from \`${lcpRequest.args.data.url}\`.`);
        const request = TraceEventFormatter.networkRequests([lcpRequest], __classPrivateFieldGet(this, _PerformanceInsightFormatter_parsedTrace, "f"), { verbose: true, customTitle: 'LCP resource network request' });
        parts.push(request);
    }
    else {
        parts.push(`${theLcpElement} is text and was not fetched from the network.`);
    }
    return parts.join('\n');
}, _PerformanceInsightFormatter_details = function _PerformanceInsightFormatter_details() {
    if (Trace.Insights.Models.LCPBreakdown.isLCPBreakdown(__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f"))) {
        const { subparts, lcpMs } = __classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f");
        if (!lcpMs || !subparts) {
            return '';
        }
        // Text based LCP has TTFB & Render delay
        // Image based has TTFB, Load delay, Load time and Render delay
        // Note that we expect every trace + LCP to have TTFB + Render delay, but
        // very old traces are missing the data, so we have to code defensively
        // in case the subparts are not present.
        const phaseBulletPoints = [];
        Object.values(subparts).forEach((subpart) => {
            const phaseMilli = Trace.Helpers.Timing.microToMilli(subpart.range);
            const percentage = (phaseMilli / lcpMs * 100).toFixed(1);
            phaseBulletPoints.push({ name: subpart.label, value: formatMilli(phaseMilli), percentage });
        });
        return `${__classPrivateFieldGet(this, _PerformanceInsightFormatter_instances, "m", _PerformanceInsightFormatter_lcpMetricSharedContext).call(this)}

We can break this time down into the ${phaseBulletPoints.length} phases that combine to make the LCP time:

${phaseBulletPoints.map(phase => `- ${phase.name}: ${phase.value} (${phase.percentage}% of total LCP time)`)
            .join('\n')}`;
    }
    if (Trace.Insights.Models.LCPDiscovery.isLCPDiscovery(__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f"))) {
        const { checklist, lcpEvent, lcpRequest, earliestDiscoveryTimeTs } = __classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f");
        if (!checklist || !lcpEvent || !lcpRequest || !earliestDiscoveryTimeTs) {
            return '';
        }
        const checklistBulletPoints = [];
        checklistBulletPoints.push({
            name: checklist.priorityHinted.label,
            passed: checklist.priorityHinted.value,
        });
        checklistBulletPoints.push({
            name: checklist.eagerlyLoaded.label,
            passed: checklist.eagerlyLoaded.value,
        });
        checklistBulletPoints.push({
            name: checklist.requestDiscoverable.label,
            passed: checklist.requestDiscoverable.value,
        });
        return `${__classPrivateFieldGet(this, _PerformanceInsightFormatter_instances, "m", _PerformanceInsightFormatter_lcpMetricSharedContext).call(this)}

The result of the checks for this insight are:
${checklistBulletPoints.map(point => `- ${point.name}: ${point.passed ? 'PASSED' : 'FAILED'}`).join('\n')}`;
    }
    if (Trace.Insights.Models.RenderBlocking.isRenderBlocking(__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f"))) {
        const requestSummary = TraceEventFormatter.networkRequests(__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").renderBlockingRequests, __classPrivateFieldGet(this, _PerformanceInsightFormatter_parsedTrace, "f"), { verbose: false });
        if (requestSummary.length === 0) {
            return 'There are no network requests that are render blocking.';
        }
        return `Here is a list of the network requests that were render blocking on this page and their duration:

${requestSummary}`;
    }
    if (Trace.Insights.Models.DocumentLatency.isDocumentLatency(__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f"))) {
        if (!__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").data) {
            return '';
        }
        const { checklist, documentRequest } = __classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").data;
        if (!documentRequest) {
            return '';
        }
        const checklistBulletPoints = [];
        checklistBulletPoints.push({
            name: 'The request was not redirected',
            passed: checklist.noRedirects.value,
        });
        checklistBulletPoints.push({
            name: 'Server responded quickly',
            passed: checklist.serverResponseIsFast.value,
        });
        checklistBulletPoints.push({
            name: 'Compression was applied',
            passed: checklist.usesCompression.value,
        });
        return `${__classPrivateFieldGet(this, _PerformanceInsightFormatter_instances, "m", _PerformanceInsightFormatter_lcpMetricSharedContext).call(this)}

${TraceEventFormatter.networkRequests([documentRequest], __classPrivateFieldGet(this, _PerformanceInsightFormatter_parsedTrace, "f"), {
            verbose: true,
            customTitle: 'Document network request'
        })}

The result of the checks for this insight are:
${checklistBulletPoints.map(point => `- ${point.name}: ${point.passed ? 'PASSED' : 'FAILED'}`).join('\n')}`;
    }
    if (Trace.Insights.Models.INPBreakdown.isINPBreakdown(__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f"))) {
        const event = __classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").longestInteractionEvent;
        if (!event) {
            return '';
        }
        const inpInfoForEvent = `The longest interaction on the page was a \`${event.type}\` which had a total duration of \`${formatMicroToMilli(event.dur)}\`. The timings of each of the three phases were:

1. Input delay: ${formatMicroToMilli(event.inputDelay)}
2. Processing duration: ${formatMicroToMilli(event.mainThreadHandling)}
3. Presentation delay: ${formatMicroToMilli(event.presentationDelay)}.`;
        return inpInfoForEvent;
    }
    if (Trace.Insights.Models.CLSCulprits.isCLSCulprits(__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f"))) {
        const { worstCluster, shifts } = __classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f");
        if (!worstCluster) {
            return '';
        }
        const baseTime = __classPrivateFieldGet(this, _PerformanceInsightFormatter_parsedTrace, "f").Meta.traceBounds.min;
        const clusterTimes = {
            start: worstCluster.ts - baseTime,
            end: worstCluster.ts + worstCluster.dur - baseTime,
        };
        const shiftsFormatted = worstCluster.events.map((layoutShift, index) => {
            return TraceEventFormatter.layoutShift(layoutShift, index, __classPrivateFieldGet(this, _PerformanceInsightFormatter_parsedTrace, "f"), shifts.get(layoutShift));
        });
        return `The worst layout shift cluster was the cluster that started at ${formatMicroToMilli(clusterTimes.start)} and ended at ${formatMicroToMilli(clusterTimes.end)}, with a duration of ${formatMicroToMilli(worstCluster.dur)}.
The score for this cluster is ${worstCluster.clusterCumulativeScore.toFixed(4)}.

Layout shifts in this cluster:
${shiftsFormatted.join('\n')}`;
    }
    if (Trace.Insights.Models.ModernHTTP.isModernHTTP(__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f"))) {
        const requestSummary = (__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").http1Requests.length === 1) ?
            TraceEventFormatter.networkRequests(__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").http1Requests, __classPrivateFieldGet(this, _PerformanceInsightFormatter_parsedTrace, "f"), { verbose: true }) :
            TraceEventFormatter.networkRequests(__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").http1Requests, __classPrivateFieldGet(this, _PerformanceInsightFormatter_parsedTrace, "f"));
        if (requestSummary.length === 0) {
            return 'There are no requests that were served over a legacy HTTP protocol.';
        }
        return `Here is a list of the network requests that were served over a legacy HTTP protocol:
${requestSummary}`;
    }
    return '';
}, _PerformanceInsightFormatter_links = function _PerformanceInsightFormatter_links() {
    switch (__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").insightKey) {
        case 'CLSCulprits':
            return `- https://wdeb.dev/articles/cls
- https://web.dev/articles/optimize-cls`;
        case 'DocumentLatency':
            return '- https://web.dev/articles/optimize-ttfb';
        case 'DOMSize':
            return '';
        case 'DuplicatedJavaScript':
            return '';
        case 'FontDisplay':
            return '';
        case 'ForcedReflow':
            return '';
        case 'ImageDelivery':
            return '';
        case 'INPBreakdown':
            return `- https://web.dev/articles/inp
- https://web.dev/explore/how-to-optimize-inp
- https://web.dev/articles/optimize-long-tasks
- https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing`;
        case 'LCPDiscovery':
            return `- https://web.dev/articles/lcp
- https://web.dev/articles/optimize-lcp`;
        case 'LCPBreakdown':
            return `- https://web.dev/articles/lcp
- https://web.dev/articles/optimize-lcp`;
        case 'NetworkDependencyTree':
            return '';
        case 'RenderBlocking':
            return `- https://web.dev/articles/lcp
- https://web.dev/articles/optimize-lcp`;
        case 'SlowCSSSelector':
            return '';
        case 'ThirdParties':
            return '';
        case 'Viewport':
            return '';
        case 'Cache':
            return '';
        case 'ModernHTTP':
            return '- https://developer.chrome.com/docs/lighthouse/best-practices/uses-http2';
        case 'LegacyJavaScript':
            return '';
    }
}, _PerformanceInsightFormatter_description = function _PerformanceInsightFormatter_description() {
    switch (__classPrivateFieldGet(this, _PerformanceInsightFormatter_insight, "f").insightKey) {
        case 'CLSCulprits':
            return `Cumulative Layout Shifts (CLS) is a measure of the largest burst of layout shifts for every unexpected layout shift that occurs during the lifecycle of a page. This is a Core Web Vital and the thresholds for categorizing a score are:
- Good: 0.1 or less
- Needs improvement: more than 0.1 and less than or equal to 0.25
- Bad: over 0.25`;
        case 'DocumentLatency':
            return `This insight checks that the first request is responded to promptly. We use the following criteria to check this:
1. Was the initial request redirected?
2. Did the server respond in 600ms or less? We want developers to aim for as close to 100ms as possible, but our threshold for this insight is 600ms.
3. Was there compression applied to the response to minimize the transfer size?`;
        case 'DOMSize':
            return '';
        case 'DuplicatedJavaScript':
            return '';
        case 'FontDisplay':
            return '';
        case 'ForcedReflow':
            return '';
        case 'ImageDelivery':
            return '';
        case 'INPBreakdown':
            return `Interaction to Next Paint (INP) is a metric that tracks the responsiveness of the page when the user interacts with it. INP is a Core Web Vital and the thresholds for how we categorize a score are:
- Good: 200 milliseconds or less.
- Needs improvement: more than 200 milliseconds and 500 milliseconds or less.
- Bad: over 500 milliseconds.

For a given slow interaction, we can break it down into 3 phases:
1. Input delay: starts when the user initiates an interaction with the page, and ends when the event callbacks for the interaction begin to run.
2. Processing duration: the time it takes for the event callbacks to run to completion.
3. Presentation delay: the time it takes for the browser to present the next frame which contains the visual result of the interaction.

The sum of these three phases is the total latency. It is important to optimize each of these phases to ensure interactions take as little time as possible. Focusing on the phase that has the largest score is a good way to start optimizing.`;
        case 'LCPDiscovery':
            return `This insight analyzes the time taken to discover the LCP resource and request it on the network. It only applies if the LCP element was a resource like an image that has to be fetched over the network. There are 3 checks this insight makes:
1. Did the resource have \`fetchpriority=high\` applied?
2. Was the resource discoverable in the initial document, rather than injected from a script or stylesheet?
3. The resource was not lazy loaded as this can delay the browser loading the resource.

It is important that all of these checks pass to minimize the delay between the initial page load and the LCP resource being loaded.`;
        case 'LCPBreakdown':
            return 'This insight is used to analyze the time spent that contributed to the final LCP time and identify which of the 4 phases (or 2 if there was no LCP resource) are contributing most to the delay in rendering the LCP element.';
        case 'NetworkDependencyTree':
            return '';
        case 'RenderBlocking':
            return 'This insight identifies network requests that were render blocking. Render blocking requests are impactful because they are deemed critical to the page and therefore the browser stops rendering the page until it has dealt with these resources. For this insight make sure you fully inspect the details of each render blocking network request and prioritize your suggestions to the user based on the impact of each render blocking request.';
        case 'SlowCSSSelector':
            return '';
        case 'ThirdParties':
            return '';
        case 'Viewport':
            return '';
        case 'Cache':
            return '';
        case 'ModernHTTP':
            return `Modern HTTP protocols, such as HTTP/2, are more efficient than older versions like HTTP/1.1 because they allow for multiple requests and responses to be sent over a single network connection, significantly improving page load performance by reducing latency and overhead. This insight identifies requests that can be upgraded to a modern HTTP protocol.

We apply a conservative approach when flagging HTTP/1.1 usage. This insight will only flag requests that meet all of the following criteria:
1.  Were served over HTTP/1.1 or an earlier protocol.
2.  Originate from an origin that serves at least 6 static asset requests, as the benefits of multiplexing are less significant with fewer requests.
3.  Are not served from 'localhost' or coming from a third-party source, where developers have no control over the server's protocol.

To pass this insight, ensure your server supports and prioritizes a modern HTTP protocol (like HTTP/2) for static assets, especially when serving a substantial number of them.`;
        case 'LegacyJavaScript':
            return '';
    }
};
export class TraceEventFormatter {
    static layoutShift(shift, index, parsedTrace, rootCauses) {
        const baseTime = parsedTrace.Meta.traceBounds.min;
        const potentialRootCauses = [];
        if (rootCauses) {
            rootCauses.iframes.forEach(iframe => potentialRootCauses.push(`An iframe (id: ${iframe.frame}, url: ${iframe.url ?? 'unknown'} was injected into the page)`));
            rootCauses.webFonts.forEach(req => {
                potentialRootCauses.push(`A font that was loaded over the network (${req.args.data.url}).`);
            });
            // TODO(b/413285103): use the nice strings for non-composited animations.
            // The code for this lives in TimelineUIUtils but that cannot be used
            // within models. We should move it and then expose the animations info
            // more nicely.
            rootCauses.nonCompositedAnimations.forEach(_ => {
                potentialRootCauses.push('A non composited animation.');
            });
            rootCauses.unsizedImages.forEach(img => {
                // TODO(b/413284569): if we store a nice human readable name for this
                // image in the trace metadata, we can do something much nicer here.
                const url = img.paintImageEvent.args.data.url;
                const nodeName = img.paintImageEvent.args.data.nodeName;
                const extraText = url ? `url: ${url}` : `id: ${img.backendNodeId}`;
                potentialRootCauses.push(`An unsized image (${nodeName}) (${extraText}).`);
            });
        }
        const rootCauseText = potentialRootCauses.length ?
            `- Potential root causes:\n  - ${potentialRootCauses.join('\n  - ')}` :
            '- No potential root causes identified';
        return `### Layout shift ${index + 1}:
- Start time: ${formatMicroToMilli(shift.ts - baseTime)}
- Score: ${shift.args.data?.weighted_score_delta.toFixed(4)}
${rootCauseText}`;
    }
    // Stringify network requests for the LLM model.
    static networkRequests(requests, parsedTrace, options) {
        if (requests.length === 0) {
            return '';
        }
        // Use verbose format for a single network request. With the compressed format, a format description
        // needs to be provided, which is not worth sending if only one network request is being stringified.
        // For a single request, use `formatRequestVerbosely`, which formats with all fields specified and does not require a
        // format description.
        if (options?.verbose || requests.length === 1) {
            return requests.map(request => __classPrivateFieldGet(this, _a, "m", _TraceEventFormatter_networkRequestVerbosely).call(this, request, parsedTrace, options?.customTitle))
                .join('\n');
        }
        return __classPrivateFieldGet(this, _a, "m", _TraceEventFormatter_networkRequestsArrayCompressed).call(this, requests, parsedTrace);
    }
}
_a = TraceEventFormatter, _TraceEventFormatter_networkRequestVerbosely = function _TraceEventFormatter_networkRequestVerbosely(request, parsedTrace, customTitle) {
    const { url, statusCode, initialPriority, priority, fromServiceWorker, mimeType, responseHeaders, syntheticData, protocol } = request.args.data;
    const titlePrefix = `## ${customTitle ?? 'Network request'}`;
    // Note: unlike other agents, we do have the ability to include
    // cross-origins, hence why we do not sanitize the URLs here.
    const navigationForEvent = Trace.Helpers.Trace.getNavigationForTraceEvent(request, request.args.data.frame, parsedTrace.Meta.navigationsByFrameId);
    const baseTime = navigationForEvent?.ts ?? parsedTrace.Meta.traceBounds.min;
    // Gets all the timings for this request, relative to the base time.
    // Note that this is the start time, not total time. E.g. "queuedAt: X"
    // means that the request was queued at Xms, not that it queued for Xms.
    const startTimesForLifecycle = {
        queuedAt: request.ts - baseTime,
        requestSentAt: syntheticData.sendStartTime - baseTime,
        downloadCompletedAt: syntheticData.finishTime - baseTime,
        processingCompletedAt: request.ts + request.dur - baseTime,
    };
    const mainThreadProcessingDuration = startTimesForLifecycle.processingCompletedAt - startTimesForLifecycle.downloadCompletedAt;
    const downloadTime = syntheticData.finishTime - syntheticData.downloadStart;
    const renderBlocking = Trace.Helpers.Network.isSyntheticNetworkRequestEventRenderBlocking(request);
    const initiator = parsedTrace.NetworkRequests.eventToInitiator.get(request);
    const priorityLines = [];
    if (initialPriority === priority) {
        priorityLines.push(`Priority: ${priority}`);
    }
    else {
        priorityLines.push(`Initial priority: ${initialPriority}`);
        priorityLines.push(`Final priority: ${priority}`);
    }
    const redirects = request.args.data.redirects.map((redirect, index) => {
        const startTime = redirect.ts - baseTime;
        return `#### Redirect ${index + 1}: ${redirect.url}
- Start time: ${formatMicroToMilli(startTime)}
- Duration: ${formatMicroToMilli(redirect.dur)}`;
    });
    return `${titlePrefix}: ${url}
Timings:
- Queued at: ${formatMicroToMilli(startTimesForLifecycle.queuedAt)}
- Request sent at: ${formatMicroToMilli(startTimesForLifecycle.requestSentAt)}
- Download complete at: ${formatMicroToMilli(startTimesForLifecycle.downloadCompletedAt)}
- Main thread processing completed at: ${formatMicroToMilli(startTimesForLifecycle.processingCompletedAt)}
Durations:
- Download time: ${formatMicroToMilli(downloadTime)}
- Main thread processing time: ${formatMicroToMilli(mainThreadProcessingDuration)}
- Total duration: ${formatMicroToMilli(request.dur)}${initiator ? `\nInitiator: ${initiator.args.data.url}` : ''}
Redirects:${redirects.length ? '\n' + redirects.join('\n') : ' no redirects'}
Status code: ${statusCode}
MIME Type: ${mimeType}
Protocol: ${protocol}
${priorityLines.join('\n')}
Render blocking: ${renderBlocking ? 'Yes' : 'No'}
From a service worker: ${fromServiceWorker ? 'Yes' : 'No'}
${NetworkRequestFormatter.formatHeaders('Response headers', responseHeaders ?? [], true)}`;
}, _TraceEventFormatter_getOrAssignUrlIndex = function _TraceEventFormatter_getOrAssignUrlIndex(urlIdToIndex, url) {
    let index = urlIdToIndex.get(url);
    if (index !== undefined) {
        return index;
    }
    index = urlIdToIndex.size;
    urlIdToIndex.set(url, index);
    return index;
}, _TraceEventFormatter_networkRequestsArrayCompressed = function _TraceEventFormatter_networkRequestsArrayCompressed(requests, parsedTrace) {
    const formatDescription = `The format is as follows:
    \`urlIndex;queuedTime;requestSentTime;downloadCompleteTime;processingCompleteTime;totalDuration;downloadDuration;mainThreadProcessingDuration;statusCode;mimeType;priority;initialPriority;finalPriority;renderBlocking;protocol;fromServiceWorker;initiatorUrlIndex;redirects:[[redirectUrlIndex|startTime|duration]];responseHeaders:[header1Value|header2Value|...]\`

    - \`urlIndex\`: Numerical index for the request's URL, referencing the "All URLs" list.
    Timings (all in milliseconds, relative to navigation start):
    - \`queuedTime\`: When the request was queued.
    - \`requestSentTime\`: When the request was sent.
    - \`downloadCompleteTime\`: When the download completed.
    - \`processingCompleteTime\`: When main thread processing finished.
    Durations (all in milliseconds):
    - \`totalDuration\`: Total time from the request being queued until its main thread processing completed.
    - \`downloadDuration\`: Time spent actively downloading the resource.
    - \`mainThreadProcessingDuration\`: Time spent on the main thread after the download completed.
    - \`statusCode\`: The HTTP status code of the response (e.g., 200, 404).
    - \`mimeType\`: The MIME type of the resource (e.g., "text/html", "application/javascript").
    - \`priority\`: The final network request priority (e.g., "VeryHigh", "Low").
    - \`initialPriority\`: The initial network request priority.
    - \`finalPriority\`: The final network request priority (redundant if \`priority\` is always final, but kept for clarity if \`initialPriority\` and \`priority\` differ).
    - \`renderBlocking\`: 't' if the request was render-blocking, 'f' otherwise.
    - \`protocol\`: The network protocol used (e.g., "h2", "http/1.1").
    - \`fromServiceWorker\`: 't' if the request was served from a service worker, 'f' otherwise.
    - \`initiatorUrlIndex\`: Numerical index for the URL of the resource that initiated this request, or empty string if no initiator.
    - \`redirects\`: A comma-separated list of redirects, enclosed in square brackets. Each redirect is formatted as
    \`[redirectUrlIndex|startTime|duration]\`, where: \`redirectUrlIndex\`: Numerical index for the redirect's URL. \`startTime\`: The start time of the redirect in milliseconds, relative to navigation start. \`duration\`: The duration of the redirect in milliseconds.
    - \`responseHeaders\`: A list separated by '|' of values for specific, pre-defined response headers, enclosed in square brackets.
    The order of headers corresponds to an internal fixed list. If a header is not present, its value will be empty.

    Network requests data:

    `;
    const urlIdToIndex = new Map();
    const allRequestsText = requests
        .map(request => {
        const urlIndex = __classPrivateFieldGet(_a, _a, "m", _TraceEventFormatter_getOrAssignUrlIndex).call(_a, urlIdToIndex, request.args.data.url);
        return __classPrivateFieldGet(this, _a, "m", _TraceEventFormatter_networkRequestCompressedFormat).call(this, urlIndex, request, parsedTrace, urlIdToIndex);
    })
        .join('\n');
    const urlsMapString = 'allUrls = ' +
        `[${Array.from(urlIdToIndex.entries())
            .map(([url, index]) => {
            return `${index}: ${url}`;
        })
            .join(', ')}]`;
    return formatDescription + '\n\n' + urlsMapString + '\n\n' + allRequestsText;
}, _TraceEventFormatter_networkRequestCompressedFormat = function _TraceEventFormatter_networkRequestCompressedFormat(urlIndex, request, parsedTrace, urlIdToIndex) {
    const { statusCode, initialPriority, priority, fromServiceWorker, mimeType, responseHeaders, syntheticData, protocol, } = request.args.data;
    const navigationForEvent = Trace.Helpers.Trace.getNavigationForTraceEvent(request, request.args.data.frame, parsedTrace.Meta.navigationsByFrameId);
    const baseTime = navigationForEvent?.ts ?? parsedTrace.Meta.traceBounds.min;
    const queuedTime = formatMicroToMilli(request.ts - baseTime);
    const requestSentTime = formatMicroToMilli(syntheticData.sendStartTime - baseTime);
    const downloadCompleteTime = formatMicroToMilli(syntheticData.finishTime - baseTime);
    const processingCompleteTime = formatMicroToMilli(request.ts + request.dur - baseTime);
    const totalDuration = formatMicroToMilli(request.dur);
    const downloadDuration = formatMicroToMilli(syntheticData.finishTime - syntheticData.downloadStart);
    const mainThreadProcessingDuration = formatMicroToMilli(request.ts + request.dur - syntheticData.finishTime);
    const renderBlocking = Trace.Helpers.Network.isSyntheticNetworkRequestEventRenderBlocking(request) ? 't' : 'f';
    const finalPriority = priority;
    const headerValues = responseHeaders
        ?.map(header => {
        const value = NetworkRequestFormatter.allowHeader(header.name) ? header.value : '<redacted>';
        return `${header.name}: ${value}`;
    })
        .join('|');
    const redirects = request.args.data.redirects
        .map(redirect => {
        const urlIndex = __classPrivateFieldGet(_a, _a, "m", _TraceEventFormatter_getOrAssignUrlIndex).call(_a, urlIdToIndex, redirect.url);
        const redirectStartTime = formatMicroToMilli(redirect.ts - baseTime);
        const redirectDuration = formatMicroToMilli(redirect.dur);
        return `[${urlIndex}|${redirectStartTime}|${redirectDuration}]`;
    })
        .join(',');
    const initiator = parsedTrace.NetworkRequests.eventToInitiator.get(request);
    const initiatorUrlIndex = initiator ? __classPrivateFieldGet(_a, _a, "m", _TraceEventFormatter_getOrAssignUrlIndex).call(_a, urlIdToIndex, initiator.args.data.url) : '';
    const parts = [
        urlIndex,
        queuedTime,
        requestSentTime,
        downloadCompleteTime,
        processingCompleteTime,
        totalDuration,
        downloadDuration,
        mainThreadProcessingDuration,
        statusCode,
        mimeType,
        priority,
        initialPriority,
        finalPriority,
        renderBlocking,
        protocol,
        fromServiceWorker ? 't' : 'f',
        initiatorUrlIndex,
        `[${redirects}]`,
        `[${headerValues ?? ''}]`,
    ];
    return parts.join(';');
};
//# sourceMappingURL=PerformanceInsightFormatter.js.map