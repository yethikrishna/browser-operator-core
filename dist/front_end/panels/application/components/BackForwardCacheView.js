// Copyright (c) 2021 The Chromium Authors. All rights reserved.
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
var _BackForwardCacheView_instances, _BackForwardCacheView_shadow, _BackForwardCacheView_screenStatus, _BackForwardCacheView_nextNodeId, _BackForwardCacheView_historyIndex, _BackForwardCacheView_getMainResourceTreeModel, _BackForwardCacheView_getMainFrame, _BackForwardCacheView_renderBackForwardCacheTestResult, _BackForwardCacheView_onNavigatedAway, _BackForwardCacheView_waitAndGoBackInHistory, _BackForwardCacheView_navigateAwayAndBack, _BackForwardCacheView_renderMainFrameInformation, _BackForwardCacheView_maybeRenderFrameTree, _BackForwardCacheView_buildFrameTreeDataRecursive, _BackForwardCacheView_renderBackForwardCacheStatus, _BackForwardCacheView_buildReasonToFramesMap, _BackForwardCacheView_maybeRenderExplanations, _BackForwardCacheView_renderExplanations, _BackForwardCacheView_maybeRenderReasonContext, _BackForwardCacheView_renderFramesPerReason, _BackForwardCacheView_maybeRenderDeepLinkToUnload, _BackForwardCacheView_maybeRenderJavaScriptDetails, _BackForwardCacheView_renderReason;
import '../../../ui/components/chrome_link/chrome_link.js';
import '../../../ui/components/expandable_list/expandable_list.js';
import '../../../ui/components/report_view/report_view.js';
import '../../../ui/components/tree_outline/tree_outline.js';
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as LegacyWrapper from '../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as Components from '../../../ui/legacy/components/utils/utils.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import { NotRestoredReasonDescription } from './BackForwardCacheStrings.js';
import backForwardCacheViewStyles from './backForwardCacheView.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Title text in back/forward cache view of the Application panel
     */
    mainFrame: 'Main Frame',
    /**
     * @description Title text in back/forward cache view of the Application panel
     */
    backForwardCacheTitle: 'Back/forward cache',
    /**
     * @description Status text for the status of the main frame
     */
    unavailable: 'unavailable',
    /**
     * @description Entry name text in the back/forward cache view of the Application panel
     */
    url: 'URL',
    /**
     * @description Status text for the status of the back/forward cache status
     */
    unknown: 'Unknown Status',
    /**
     * @description Status text for the status of the back/forward cache status indicating that
     * the back/forward cache was not used and a normal navigation occured instead.
     */
    normalNavigation: 'Not served from back/forward cache: to trigger back/forward cache, use Chrome\'s back/forward buttons, or use the test button below to automatically navigate away and back.',
    /**
     * @description Status text for the status of the back/forward cache status indicating that
     * the back/forward cache was used to restore the page instead of reloading it.
     */
    restoredFromBFCache: 'Successfully served from back/forward cache.',
    /**
     * @description Label for a list of reasons which prevent the page from being eligible for
     * back/forward cache. These reasons are actionable i.e. they can be cleaned up to make the
     * page eligible for back/forward cache.
     */
    pageSupportNeeded: 'Actionable',
    /**
     * @description Explanation for actionable items which prevent the page from being eligible
     * for back/forward cache.
     */
    pageSupportNeededExplanation: 'These reasons are actionable i.e. they can be cleaned up to make the page eligible for back/forward cache.',
    /**
     * @description Label for a list of reasons which prevent the page from being eligible for
     * back/forward cache. These reasons are circumstantial / not actionable i.e. they cannot be
     * cleaned up by developers to make the page eligible for back/forward cache.
     */
    circumstantial: 'Not Actionable',
    /**
     * @description Explanation for circumstantial/non-actionable items which prevent the page from being eligible
     * for back/forward cache.
     */
    circumstantialExplanation: 'These reasons are not actionable i.e. caching was prevented by something outside of the direct control of the page.',
    /**
     * @description Label for a list of reasons which prevent the page from being eligible for
     * back/forward cache. These reasons are pending support by chrome i.e. in a future version
     * of chrome they will not prevent back/forward cache usage anymore.
     */
    supportPending: 'Pending Support',
    /**
     * @description Label for the button to test whether BFCache is available for the page
     */
    runTest: 'Test back/forward cache',
    /**
     * @description Label for the disabled button while the test is running
     */
    runningTest: 'Running test',
    /**
     * @description Link Text about explanation of back/forward cache
     */
    learnMore: 'Learn more: back/forward cache eligibility',
    /**
     * @description Link Text about unload handler
     */
    neverUseUnload: 'Learn more: Never use unload handler',
    /**
     * @description Explanation for 'pending support' items which prevent the page from being eligible
     * for back/forward cache.
     */
    supportPendingExplanation: 'Chrome support for these reasons is pending i.e. they will not prevent the page from being eligible for back/forward cache in a future version of Chrome.',
    /**
     * @description Text that precedes displaying a link to the extension which blocked the page from being eligible for back/forward cache.
     */
    blockingExtensionId: 'Extension id: ',
    /**
     * @description Label for the 'Frames' section of the back/forward cache view, which shows a frame tree of the
     * page with reasons why the frames can't be cached.
     */
    framesTitle: 'Frames',
    /**
     * @description Top level summary of the total number of issues found in a single frame.
     */
    issuesInSingleFrame: '{n, plural, =1 {# issue found in 1 frame.} other {# issues found in 1 frame.}}',
    /**
     * @description Top level summary of the total number of issues found and the number of frames they were found in.
     * 'm' is never less than 2.
     * @example {3} m
     */
    issuesInMultipleFrames: '{n, plural, =1 {# issue found in {m} frames.} other {# issues found in {m} frames.}}',
    /**
     * @description Shows the number of frames with a particular issue.
     */
    framesPerIssue: '{n, plural, =1 {# frame} other {# frames}}',
    /**
     *@description Title for a frame in the frame tree that doesn't have a URL. Placeholder indicates which number frame with a blank URL it is.
     *@example {3} PH1
     */
    blankURLTitle: 'Blank URL [{PH1}]',
    /**
     * @description Shows the number of files with a particular issue.
     */
    filesPerIssue: '{n, plural, =1 {# file} other {# files}}',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/components/BackForwardCacheView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
var ScreenStatusType;
(function (ScreenStatusType) {
    ScreenStatusType["RUNNING"] = "Running";
    ScreenStatusType["RESULT"] = "Result";
})(ScreenStatusType || (ScreenStatusType = {}));
export class BackForwardCacheView extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super();
        _BackForwardCacheView_instances.add(this);
        _BackForwardCacheView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _BackForwardCacheView_screenStatus.set(this, "Result" /* ScreenStatusType.RESULT */);
        _BackForwardCacheView_nextNodeId.set(this, 0);
        _BackForwardCacheView_historyIndex.set(this, 0);
        __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_getMainResourceTreeModel).call(this)?.addEventListener(SDK.ResourceTreeModel.Events.PrimaryPageChanged, this.render, this);
        __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_getMainResourceTreeModel).call(this)?.addEventListener(SDK.ResourceTreeModel.Events.BackForwardCacheDetailsUpdated, this.render, this);
    }
    connectedCallback() {
        this.parentElement?.classList.add('overflow-auto');
    }
    async render() {
        await RenderCoordinator.write('BackForwardCacheView render', () => {
            // Disabled until https://crbug.com/1079231 is fixed.
            // clang-format off
            Lit.render(html `
        <style>${backForwardCacheViewStyles}</style>
        <devtools-report .data=${{ reportTitle: i18nString(UIStrings.backForwardCacheTitle) }} jslog=${VisualLogging.pane('back-forward-cache')}>

          ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_renderMainFrameInformation).call(this)}
        </devtools-report>
      `, __classPrivateFieldGet(this, _BackForwardCacheView_shadow, "f"), { host: this });
            // clang-format on
        });
    }
}
_BackForwardCacheView_shadow = new WeakMap(), _BackForwardCacheView_screenStatus = new WeakMap(), _BackForwardCacheView_nextNodeId = new WeakMap(), _BackForwardCacheView_historyIndex = new WeakMap(), _BackForwardCacheView_instances = new WeakSet(), _BackForwardCacheView_getMainResourceTreeModel = function _BackForwardCacheView_getMainResourceTreeModel() {
    const mainTarget = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    return mainTarget?.model(SDK.ResourceTreeModel.ResourceTreeModel) || null;
}, _BackForwardCacheView_getMainFrame = function _BackForwardCacheView_getMainFrame() {
    return __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_getMainResourceTreeModel).call(this)?.mainFrame || null;
}, _BackForwardCacheView_renderBackForwardCacheTestResult = function _BackForwardCacheView_renderBackForwardCacheTestResult() {
    SDK.TargetManager.TargetManager.instance().removeModelListener(SDK.ResourceTreeModel.ResourceTreeModel, SDK.ResourceTreeModel.Events.FrameNavigated, __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_renderBackForwardCacheTestResult), this);
    __classPrivateFieldSet(this, _BackForwardCacheView_screenStatus, "Result" /* ScreenStatusType.RESULT */, "f");
    void this.render();
}, _BackForwardCacheView_onNavigatedAway = async function _BackForwardCacheView_onNavigatedAway() {
    SDK.TargetManager.TargetManager.instance().removeModelListener(SDK.ResourceTreeModel.ResourceTreeModel, SDK.ResourceTreeModel.Events.FrameNavigated, __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_onNavigatedAway), this);
    await __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_waitAndGoBackInHistory).call(this, 50);
}, _BackForwardCacheView_waitAndGoBackInHistory = async function _BackForwardCacheView_waitAndGoBackInHistory(delay) {
    const mainTarget = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    const resourceTreeModel = mainTarget?.model(SDK.ResourceTreeModel.ResourceTreeModel);
    const historyResults = await resourceTreeModel?.navigationHistory();
    if (!resourceTreeModel || !historyResults) {
        return;
    }
    // The navigation history can be delayed. If this is the case we wait and
    // check again later. Otherwise it would be possible to press the 'Test
    // BFCache' button again too soon, leading to the browser stepping back in
    // history without returning to the correct page.
    if (historyResults.currentIndex === __classPrivateFieldGet(this, _BackForwardCacheView_historyIndex, "f")) {
        window.setTimeout(__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_waitAndGoBackInHistory).bind(this, delay * 2), delay);
    }
    else {
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.ResourceTreeModel.ResourceTreeModel, SDK.ResourceTreeModel.Events.FrameNavigated, __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_renderBackForwardCacheTestResult), this);
        resourceTreeModel.navigateToHistoryEntry(historyResults.entries[historyResults.currentIndex - 1]);
    }
}, _BackForwardCacheView_navigateAwayAndBack = async function _BackForwardCacheView_navigateAwayAndBack() {
    // Checking BFCache Compatibility
    const mainTarget = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
    const resourceTreeModel = mainTarget?.model(SDK.ResourceTreeModel.ResourceTreeModel);
    const historyResults = await resourceTreeModel?.navigationHistory();
    if (!resourceTreeModel || !historyResults) {
        return;
    }
    __classPrivateFieldSet(this, _BackForwardCacheView_historyIndex, historyResults.currentIndex, "f");
    __classPrivateFieldSet(this, _BackForwardCacheView_screenStatus, "Running" /* ScreenStatusType.RUNNING */, "f");
    void this.render();
    // This event listener is removed inside of onNavigatedAway().
    SDK.TargetManager.TargetManager.instance().addModelListener(SDK.ResourceTreeModel.ResourceTreeModel, SDK.ResourceTreeModel.Events.FrameNavigated, __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_onNavigatedAway), this);
    // We can know whether the current page can use BFCache
    // as the browser navigates to another unrelated page and goes back to the current page.
    // We chose "chrome://terms" because it must be cross-site.
    // Ideally, We want to have our own testing page like "chrome: //bfcache-test".
    void resourceTreeModel.navigate('chrome://terms');
}, _BackForwardCacheView_renderMainFrameInformation = function _BackForwardCacheView_renderMainFrameInformation() {
    const frame = __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_getMainFrame).call(this);
    if (!frame) {
        // clang-format off
        return html `
        <devtools-report-key>
          ${i18nString(UIStrings.mainFrame)}
        </devtools-report-key>
        <devtools-report-value>
          ${i18nString(UIStrings.unavailable)}
        </devtools-report-value>
      `;
        // clang-format on
    }
    const isTestRunning = (__classPrivateFieldGet(this, _BackForwardCacheView_screenStatus, "f") === "Running" /* ScreenStatusType.RUNNING */);
    // Prevent running BFCache test on the DevTools window itself via DevTools on DevTools
    const isTestingForbidden = Common.ParsedURL.schemeIs(frame.url, 'devtools:');
    // clang-format off
    return html `
      ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_renderBackForwardCacheStatus).call(this, frame.backForwardCacheDetails.restoredFromCache)}
      <devtools-report-key>${i18nString(UIStrings.url)}</devtools-report-key>
      <devtools-report-value>${frame.url}</devtools-report-value>
      ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_maybeRenderFrameTree).call(this, frame.backForwardCacheDetails.explanationsTree)}
      <devtools-report-section>
        <devtools-button
          aria-label=${i18nString(UIStrings.runTest)}
          .disabled=${isTestRunning || isTestingForbidden}
          .spinner=${isTestRunning}
          .variant=${"primary" /* Buttons.Button.Variant.PRIMARY */}
          @click=${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_navigateAwayAndBack)}
          jslog=${VisualLogging.action('back-forward-cache.run-test').track({ click: true })}>
          ${isTestRunning ? html `
            ${i18nString(UIStrings.runningTest)}` : `
            ${i18nString(UIStrings.runTest)}
          `}
        </devtools-button>
      </devtools-report-section>
      <devtools-report-divider>
      </devtools-report-divider>
      ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_maybeRenderExplanations).call(this, frame.backForwardCacheDetails.explanations, frame.backForwardCacheDetails.explanationsTree)}
      <devtools-report-section>
        <x-link href="https://web.dev/bfcache/" class="link"
        jslog=${VisualLogging.action('learn-more.eligibility').track({ click: true })}>
          ${i18nString(UIStrings.learnMore)}
        </x-link>
      </devtools-report-section>
    `;
    // clang-format on
}, _BackForwardCacheView_maybeRenderFrameTree = function _BackForwardCacheView_maybeRenderFrameTree(explanationTree) {
    if (!explanationTree || (explanationTree.explanations.length === 0 && explanationTree.children.length === 0)) {
        return Lit.nothing;
    }
    function treeNodeRenderer(node) {
        // clang-format off
        return html `
        <div class="text-ellipsis">
          ${node.treeNodeData.iconName ? html `
            <devtools-icon class="inline-icon" style="margin-bottom: -3px;" .data=${{
            iconName: node.treeNodeData.iconName,
            color: 'var(--icon-default)',
            width: '20px',
            height: '20px',
        }}>
            </devtools-icon>
          ` : Lit.nothing}
          ${node.treeNodeData.text}
        </div>
      `;
        // clang-format on
    }
    const frameTreeData = __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_buildFrameTreeDataRecursive).call(this, explanationTree, { blankCount: 1 });
    // Override the icon for the outermost frame.
    frameTreeData.node.treeNodeData.iconName = 'frame';
    let title = '';
    // The translation pipeline does not support nested plurals. We avoid this
    // here by pulling out the logic for one of the plurals into code instead.
    if (frameTreeData.frameCount === 1) {
        title = i18nString(UIStrings.issuesInSingleFrame, { n: frameTreeData.issueCount });
    }
    else {
        title = i18nString(UIStrings.issuesInMultipleFrames, { n: frameTreeData.issueCount, m: frameTreeData.frameCount });
    }
    const root = {
        treeNodeData: {
            text: title,
        },
        id: 'root',
        children: () => Promise.resolve([frameTreeData.node]),
    };
    // clang-format off
    return html `
      <devtools-report-key jslog=${VisualLogging.section('frames')}>${i18nString(UIStrings.framesTitle)}</devtools-report-key>
      <devtools-report-value>
        <devtools-tree-outline .data=${{
        tree: [root],
        defaultRenderer: treeNodeRenderer,
        compact: true,
    }}>
        </devtools-tree-outline>
      </devtools-report-value>
    `;
    // clang-format on
}, _BackForwardCacheView_buildFrameTreeDataRecursive = function _BackForwardCacheView_buildFrameTreeDataRecursive(explanationTree, nextBlankURLCount) {
    var _a, _b, _c, _d;
    let frameCount = 1;
    let issueCount = 0;
    const children = [];
    let nodeUrlText = '';
    if (explanationTree.url.length) {
        nodeUrlText = explanationTree.url;
    }
    else {
        nodeUrlText = i18nString(UIStrings.blankURLTitle, { PH1: nextBlankURLCount.blankCount });
        nextBlankURLCount.blankCount += 1;
    }
    for (const explanation of explanationTree.explanations) {
        const child = { treeNodeData: { text: explanation.reason }, id: String((__classPrivateFieldSet(this, _BackForwardCacheView_nextNodeId, (_b = __classPrivateFieldGet(this, _BackForwardCacheView_nextNodeId, "f"), _a = _b++, _b), "f"), _a)) };
        issueCount += 1;
        children.push(child);
    }
    for (const child of explanationTree.children) {
        const frameTreeData = __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_buildFrameTreeDataRecursive).call(this, child, nextBlankURLCount);
        if (frameTreeData.issueCount > 0) {
            children.push(frameTreeData.node);
            issueCount += frameTreeData.issueCount;
            frameCount += frameTreeData.frameCount;
        }
    }
    let node = {
        treeNodeData: {
            text: `(${issueCount}) ${nodeUrlText}`,
        },
        id: String((__classPrivateFieldSet(this, _BackForwardCacheView_nextNodeId, (_d = __classPrivateFieldGet(this, _BackForwardCacheView_nextNodeId, "f"), _c = _d++, _d), "f"), _c)),
    };
    if (children.length) {
        node = {
            ...node,
            children: () => Promise.resolve(children),
        };
        node.treeNodeData.iconName = 'iframe';
    }
    else if (!explanationTree.url.length) {
        // If the current node increased the blank count, but it has no children and
        // is therefore not shown, decrement the blank count again.
        nextBlankURLCount.blankCount -= 1;
    }
    return { node, frameCount, issueCount };
}, _BackForwardCacheView_renderBackForwardCacheStatus = function _BackForwardCacheView_renderBackForwardCacheStatus(status) {
    switch (status) {
        case true:
            // clang-format off
            return html `
          <devtools-report-section>
            <div class="status">
              <devtools-icon class="inline-icon" .data=${{
                iconName: 'check-circle',
                color: 'var(--icon-checkmark-green)',
                width: '20px',
                height: '20px',
            }}>
              </devtools-icon>
            </div>
            ${i18nString(UIStrings.restoredFromBFCache)}
          </devtools-report-section>
        `;
        // clang-format on
        case false:
            // clang-format off
            return html `
          <devtools-report-section>
            <div class="status">
              <devtools-icon class="inline-icon" .data=${{
                iconName: 'clear',
                color: 'var(--icon-default)',
                width: '20px',
                height: '20px',
            }}>
              </devtools-icon>
            </div>
            ${i18nString(UIStrings.normalNavigation)}
          </devtools-report-section>
        `;
        // clang-format on
    }
    // clang-format off
    return html `
    <devtools-report-section>
      ${i18nString(UIStrings.unknown)}
    </devtools-report-section>
    `;
    // clang-format on
}, _BackForwardCacheView_buildReasonToFramesMap = function _BackForwardCacheView_buildReasonToFramesMap(explanationTree, nextBlankURLCount, outputMap) {
    let url = explanationTree.url;
    if (url.length === 0) {
        url = i18nString(UIStrings.blankURLTitle, { PH1: nextBlankURLCount.blankCount });
        nextBlankURLCount.blankCount += 1;
    }
    explanationTree.explanations.forEach(explanation => {
        let frames = outputMap.get(explanation.reason);
        if (frames === undefined) {
            frames = [url];
            outputMap.set(explanation.reason, frames);
        }
        else {
            frames.push(url);
        }
    });
    explanationTree.children.map(child => {
        __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_buildReasonToFramesMap).call(this, child, nextBlankURLCount, outputMap);
    });
}, _BackForwardCacheView_maybeRenderExplanations = function _BackForwardCacheView_maybeRenderExplanations(explanations, explanationTree) {
    if (explanations.length === 0) {
        return Lit.nothing;
    }
    const pageSupportNeeded = explanations.filter(explanation => explanation.type === "PageSupportNeeded" /* Protocol.Page.BackForwardCacheNotRestoredReasonType.PageSupportNeeded */);
    const supportPending = explanations.filter(explanation => explanation.type === "SupportPending" /* Protocol.Page.BackForwardCacheNotRestoredReasonType.SupportPending */);
    const circumstantial = explanations.filter(explanation => explanation.type === "Circumstantial" /* Protocol.Page.BackForwardCacheNotRestoredReasonType.Circumstantial */);
    const reasonToFramesMap = new Map();
    if (explanationTree) {
        __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_buildReasonToFramesMap).call(this, explanationTree, { blankCount: 1 }, reasonToFramesMap);
    }
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_renderExplanations).call(this, i18nString(UIStrings.pageSupportNeeded), i18nString(UIStrings.pageSupportNeededExplanation), pageSupportNeeded, reasonToFramesMap)}
      ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_renderExplanations).call(this, i18nString(UIStrings.supportPending), i18nString(UIStrings.supportPendingExplanation), supportPending, reasonToFramesMap)}
      ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_renderExplanations).call(this, i18nString(UIStrings.circumstantial), i18nString(UIStrings.circumstantialExplanation), circumstantial, reasonToFramesMap)}
    `;
    // clang-format on
}, _BackForwardCacheView_renderExplanations = function _BackForwardCacheView_renderExplanations(category, explainerText, explanations, reasonToFramesMap) {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    return html `
      ${explanations.length > 0 ? html `
        <devtools-report-section-header>
          ${category}
          <div class="help-outline-icon">
            <devtools-icon class="inline-icon" .data=${{
        iconName: 'help',
        color: 'var(--icon-default)',
        width: '16px',
        height: '16px',
    }} title=${explainerText}>
            </devtools-icon>
          </div>
        </devtools-report-section-header>
        ${explanations.map(explanation => __classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_renderReason).call(this, explanation, reasonToFramesMap.get(explanation.reason)))}
      ` : Lit.nothing}
    `;
    // clang-format on
}, _BackForwardCacheView_maybeRenderReasonContext = function _BackForwardCacheView_maybeRenderReasonContext(explanation) {
    if (explanation.reason ===
        "EmbedderExtensionSentMessageToCachedFrame" /* Protocol.Page.BackForwardCacheNotRestoredReason.EmbedderExtensionSentMessageToCachedFrame */ &&
        explanation.context) {
        const link = 'chrome://extensions/?id=' + explanation.context;
        // clang-format off
        return html `${i18nString(UIStrings.blockingExtensionId)}
      <devtools-chrome-link .href=${link}>${explanation.context}</devtools-chrome-link>`;
        // clang-format on
    }
    return Lit.nothing;
}, _BackForwardCacheView_renderFramesPerReason = function _BackForwardCacheView_renderFramesPerReason(frames) {
    if (frames === undefined || frames.length === 0) {
        return Lit.nothing;
    }
    const rows = [html `<div>${i18nString(UIStrings.framesPerIssue, { n: frames.length })}</div>`];
    rows.push(...frames.map(url => html `<div class="text-ellipsis" title=${url}
    jslog=${VisualLogging.treeItem()}>${url}</div>`));
    return html `
      <div class="details-list"
      jslog=${VisualLogging.tree('frames-per-issue')}>
        <devtools-expandable-list .data=${{
        rows,
        title: i18nString(UIStrings.framesPerIssue, { n: frames.length }),
    }}
        jslog=${VisualLogging.treeItem()}></devtools-expandable-list>
      </div>
    `;
}, _BackForwardCacheView_maybeRenderDeepLinkToUnload = function _BackForwardCacheView_maybeRenderDeepLinkToUnload(explanation) {
    if (explanation.reason === "UnloadHandlerExistsInMainFrame" /* Protocol.Page.BackForwardCacheNotRestoredReason.UnloadHandlerExistsInMainFrame */ ||
        explanation.reason === "UnloadHandlerExistsInSubFrame" /* Protocol.Page.BackForwardCacheNotRestoredReason.UnloadHandlerExistsInSubFrame */) {
        return html `
        <x-link href="https://web.dev/bfcache/#never-use-the-unload-event" class="link"
        jslog=${VisualLogging.action('learn-more.never-use-unload').track({
            click: true,
        })}>
          ${i18nString(UIStrings.neverUseUnload)}
        </x-link>`;
    }
    return Lit.nothing;
}, _BackForwardCacheView_maybeRenderJavaScriptDetails = function _BackForwardCacheView_maybeRenderJavaScriptDetails(details) {
    if (details === undefined || details.length === 0) {
        return Lit.nothing;
    }
    const maxLengthForDisplayedURLs = 50;
    const linkifier = new Components.Linkifier.Linkifier(maxLengthForDisplayedURLs);
    const rows = [html `<div>${i18nString(UIStrings.filesPerIssue, { n: details.length })}</div>`];
    rows.push(...details.map(detail => html `${linkifier.linkifyScriptLocation(null, null, detail.url, detail.lineNumber, {
        columnNumber: detail.columnNumber,
        showColumnNumber: true,
        inlineFrameIndex: 0,
    })}`));
    return html `
      <div class="details-list">
        <devtools-expandable-list .data=${{ rows }}></devtools-expandable-list>
      </div>
    `;
}, _BackForwardCacheView_renderReason = function _BackForwardCacheView_renderReason(explanation, frames) {
    // clang-format off
    return html `
      <devtools-report-section>
        ${(explanation.reason in NotRestoredReasonDescription) ?
        html `
            <div class="circled-exclamation-icon">
              <devtools-icon class="inline-icon" .data=${{
            iconName: 'warning',
            color: 'var(--icon-warning)',
            width: '16px',
            height: '16px',
        }}>
              </devtools-icon>
            </div>
            <div>
              ${NotRestoredReasonDescription[explanation.reason].name()}
              ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_maybeRenderDeepLinkToUnload).call(this, explanation)}
              ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_maybeRenderReasonContext).call(this, explanation)}
           </div>` :
        Lit.nothing}
      </devtools-report-section>
      <div class="gray-text">
        ${explanation.reason}
      </div>
      ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_maybeRenderJavaScriptDetails).call(this, explanation.details)}
      ${__classPrivateFieldGet(this, _BackForwardCacheView_instances, "m", _BackForwardCacheView_renderFramesPerReason).call(this, frames)}
    `;
    // clang-format on
};
customElements.define('devtools-resources-back-forward-cache-view', BackForwardCacheView);
//# sourceMappingURL=BackForwardCacheView.js.map