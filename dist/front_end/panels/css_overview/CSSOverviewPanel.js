// Copyright 2019 The Chromium Authors. All rights reserved.
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
var _CSSOverviewPanel_instances, _CSSOverviewPanel_currentUrl, _CSSOverviewPanel_model, _CSSOverviewPanel_backgroundColors, _CSSOverviewPanel_textColors, _CSSOverviewPanel_fillColors, _CSSOverviewPanel_borderColors, _CSSOverviewPanel_fontInfo, _CSSOverviewPanel_mediaQueries, _CSSOverviewPanel_unusedDeclarations, _CSSOverviewPanel_elementCount, _CSSOverviewPanel_globalStyleStats, _CSSOverviewPanel_textColorContrastIssues, _CSSOverviewPanel_state, _CSSOverviewPanel_view, _CSSOverviewPanel_onStartCapture, _CSSOverviewPanel_checkUrlAndResetIfChanged, _CSSOverviewPanel_getModel, _CSSOverviewPanel_reset, _CSSOverviewPanel_renderInitialView, _CSSOverviewPanel_renderOverviewStartedView, _CSSOverviewPanel_renderOverviewCompletedView, _CSSOverviewPanel_startOverview;
import * as Host from '../../core/host/host.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import { html, render } from '../../ui/lit/lit.js';
import { CSSOverviewCompletedView } from './CSSOverviewCompletedView.js';
import { CSSOverviewModel } from './CSSOverviewModel.js';
import { CSSOverviewProcessingView } from './CSSOverviewProcessingView.js';
import { CSSOverviewStartView } from './CSSOverviewStartView.js';
const { widgetConfig } = UI.Widget;
export const DEFAULT_VIEW = (input, _output, target) => {
    // clang-format off
    render(input.state === 'start' ? html `
      <devtools-widget .widgetConfig=${widgetConfig(CSSOverviewStartView, { onStartCapture: input.onStartCapture })}></devtools-widget>`
        : input.state === 'processing' ? html `
      <devtools-widget .widgetConfig=${widgetConfig(CSSOverviewProcessingView, { onCancel: input.onCancel })}></devtools-widget>`
            : html `
      <devtools-widget .widgetConfig=${widgetConfig(CSSOverviewCompletedView, {
                onReset: input.onReset,
                overviewData: input.overviewData,
                target: input.target,
            })}></devtools-widget>`, target, { host: input });
    // clang-format on
};
export class CSSOverviewPanel extends UI.Panel.Panel {
    constructor(view = DEFAULT_VIEW) {
        super('css-overview');
        _CSSOverviewPanel_instances.add(this);
        _CSSOverviewPanel_currentUrl.set(this, void 0);
        _CSSOverviewPanel_model.set(this, void 0);
        _CSSOverviewPanel_backgroundColors.set(this, void 0);
        _CSSOverviewPanel_textColors.set(this, void 0);
        _CSSOverviewPanel_fillColors.set(this, void 0);
        _CSSOverviewPanel_borderColors.set(this, void 0);
        _CSSOverviewPanel_fontInfo.set(this, void 0);
        _CSSOverviewPanel_mediaQueries.set(this, void 0);
        _CSSOverviewPanel_unusedDeclarations.set(this, void 0);
        _CSSOverviewPanel_elementCount.set(this, void 0);
        _CSSOverviewPanel_globalStyleStats.set(this, void 0);
        _CSSOverviewPanel_textColorContrastIssues.set(this, void 0);
        _CSSOverviewPanel_state.set(this, void 0);
        _CSSOverviewPanel_view.set(this, void 0);
        __classPrivateFieldSet(this, _CSSOverviewPanel_currentUrl, SDK.TargetManager.TargetManager.instance().inspectedURL(), "f");
        SDK.TargetManager.TargetManager.instance().addEventListener("InspectedURLChanged" /* SDK.TargetManager.Events.INSPECTED_URL_CHANGED */, __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_checkUrlAndResetIfChanged), this);
        __classPrivateFieldSet(this, _CSSOverviewPanel_view, view, "f");
        SDK.TargetManager.TargetManager.instance().observeTargets(this);
        __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_reset).call(this);
    }
    targetAdded(target) {
        if (target !== SDK.TargetManager.TargetManager.instance().primaryPageTarget()) {
            return;
        }
        __classPrivateFieldSet(this, _CSSOverviewPanel_model, target.model(CSSOverviewModel) ?? undefined, "f");
    }
    targetRemoved() {
    }
    performUpdate() {
        const viewInput = {
            state: __classPrivateFieldGet(this, _CSSOverviewPanel_state, "f"),
            onStartCapture: __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_onStartCapture).bind(this),
            onCancel: __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_reset).bind(this),
            onReset: __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_reset).bind(this),
            target: __classPrivateFieldGet(this, _CSSOverviewPanel_model, "f")?.target(),
            overviewData: {
                backgroundColors: __classPrivateFieldGet(this, _CSSOverviewPanel_backgroundColors, "f"),
                textColors: __classPrivateFieldGet(this, _CSSOverviewPanel_textColors, "f"),
                textColorContrastIssues: __classPrivateFieldGet(this, _CSSOverviewPanel_textColorContrastIssues, "f"),
                fillColors: __classPrivateFieldGet(this, _CSSOverviewPanel_fillColors, "f"),
                borderColors: __classPrivateFieldGet(this, _CSSOverviewPanel_borderColors, "f"),
                globalStyleStats: __classPrivateFieldGet(this, _CSSOverviewPanel_globalStyleStats, "f"),
                fontInfo: __classPrivateFieldGet(this, _CSSOverviewPanel_fontInfo, "f"),
                elementCount: __classPrivateFieldGet(this, _CSSOverviewPanel_elementCount, "f"),
                mediaQueries: __classPrivateFieldGet(this, _CSSOverviewPanel_mediaQueries, "f"),
                unusedDeclarations: __classPrivateFieldGet(this, _CSSOverviewPanel_unusedDeclarations, "f"),
            },
        };
        __classPrivateFieldGet(this, _CSSOverviewPanel_view, "f").call(this, viewInput, {}, this.contentElement);
    }
}
_CSSOverviewPanel_currentUrl = new WeakMap(), _CSSOverviewPanel_model = new WeakMap(), _CSSOverviewPanel_backgroundColors = new WeakMap(), _CSSOverviewPanel_textColors = new WeakMap(), _CSSOverviewPanel_fillColors = new WeakMap(), _CSSOverviewPanel_borderColors = new WeakMap(), _CSSOverviewPanel_fontInfo = new WeakMap(), _CSSOverviewPanel_mediaQueries = new WeakMap(), _CSSOverviewPanel_unusedDeclarations = new WeakMap(), _CSSOverviewPanel_elementCount = new WeakMap(), _CSSOverviewPanel_globalStyleStats = new WeakMap(), _CSSOverviewPanel_textColorContrastIssues = new WeakMap(), _CSSOverviewPanel_state = new WeakMap(), _CSSOverviewPanel_view = new WeakMap(), _CSSOverviewPanel_instances = new WeakSet(), _CSSOverviewPanel_onStartCapture = function _CSSOverviewPanel_onStartCapture() {
    Host.userMetrics.actionTaken(Host.UserMetrics.Action.CaptureCssOverviewClicked);
    void __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_startOverview).call(this);
}, _CSSOverviewPanel_checkUrlAndResetIfChanged = function _CSSOverviewPanel_checkUrlAndResetIfChanged() {
    if (__classPrivateFieldGet(this, _CSSOverviewPanel_currentUrl, "f") === SDK.TargetManager.TargetManager.instance().inspectedURL()) {
        return;
    }
    __classPrivateFieldSet(this, _CSSOverviewPanel_currentUrl, SDK.TargetManager.TargetManager.instance().inspectedURL(), "f");
    __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_reset).call(this);
}, _CSSOverviewPanel_getModel = function _CSSOverviewPanel_getModel() {
    if (!__classPrivateFieldGet(this, _CSSOverviewPanel_model, "f")) {
        throw new Error('Did not retrieve model information yet.');
    }
    return __classPrivateFieldGet(this, _CSSOverviewPanel_model, "f");
}, _CSSOverviewPanel_reset = function _CSSOverviewPanel_reset() {
    __classPrivateFieldSet(this, _CSSOverviewPanel_backgroundColors, new Map(), "f");
    __classPrivateFieldSet(this, _CSSOverviewPanel_textColors, new Map(), "f");
    __classPrivateFieldSet(this, _CSSOverviewPanel_fillColors, new Map(), "f");
    __classPrivateFieldSet(this, _CSSOverviewPanel_borderColors, new Map(), "f");
    __classPrivateFieldSet(this, _CSSOverviewPanel_fontInfo, new Map(), "f");
    __classPrivateFieldSet(this, _CSSOverviewPanel_mediaQueries, new Map(), "f");
    __classPrivateFieldSet(this, _CSSOverviewPanel_unusedDeclarations, new Map(), "f");
    __classPrivateFieldSet(this, _CSSOverviewPanel_elementCount, 0, "f");
    __classPrivateFieldSet(this, _CSSOverviewPanel_globalStyleStats, {
        styleRules: 0,
        inlineStyles: 0,
        externalSheets: 0,
        stats: {
            // Simple.
            type: 0,
            class: 0,
            id: 0,
            universal: 0,
            attribute: 0,
            // Non-simple.
            nonSimple: 0,
        },
    }, "f");
    __classPrivateFieldSet(this, _CSSOverviewPanel_textColorContrastIssues, new Map(), "f");
    __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_renderInitialView).call(this);
}, _CSSOverviewPanel_renderInitialView = function _CSSOverviewPanel_renderInitialView() {
    __classPrivateFieldSet(this, _CSSOverviewPanel_state, 'start', "f");
    this.performUpdate();
}, _CSSOverviewPanel_renderOverviewStartedView = function _CSSOverviewPanel_renderOverviewStartedView() {
    __classPrivateFieldSet(this, _CSSOverviewPanel_state, 'processing', "f");
    this.performUpdate();
}, _CSSOverviewPanel_renderOverviewCompletedView = function _CSSOverviewPanel_renderOverviewCompletedView() {
    __classPrivateFieldSet(this, _CSSOverviewPanel_state, 'completed', "f");
    this.performUpdate();
}, _CSSOverviewPanel_startOverview = async function _CSSOverviewPanel_startOverview() {
    __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_renderOverviewStartedView).call(this);
    const model = __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_getModel).call(this);
    const [globalStyleStats, { elementCount, backgroundColors, textColors, textColorContrastIssues, fillColors, borderColors, fontInfo, unusedDeclarations }, mediaQueries] = await Promise.all([
        model.getGlobalStylesheetStats(),
        model.getNodeStyleStats(),
        model.getMediaQueries(),
    ]);
    if (elementCount) {
        __classPrivateFieldSet(this, _CSSOverviewPanel_elementCount, elementCount, "f");
    }
    if (globalStyleStats) {
        __classPrivateFieldSet(this, _CSSOverviewPanel_globalStyleStats, globalStyleStats, "f");
    }
    if (mediaQueries) {
        __classPrivateFieldSet(this, _CSSOverviewPanel_mediaQueries, mediaQueries, "f");
    }
    if (backgroundColors) {
        __classPrivateFieldSet(this, _CSSOverviewPanel_backgroundColors, backgroundColors, "f");
    }
    if (textColors) {
        __classPrivateFieldSet(this, _CSSOverviewPanel_textColors, textColors, "f");
    }
    if (textColorContrastIssues) {
        __classPrivateFieldSet(this, _CSSOverviewPanel_textColorContrastIssues, textColorContrastIssues, "f");
    }
    if (fillColors) {
        __classPrivateFieldSet(this, _CSSOverviewPanel_fillColors, fillColors, "f");
    }
    if (borderColors) {
        __classPrivateFieldSet(this, _CSSOverviewPanel_borderColors, borderColors, "f");
    }
    if (fontInfo) {
        __classPrivateFieldSet(this, _CSSOverviewPanel_fontInfo, fontInfo, "f");
    }
    if (unusedDeclarations) {
        __classPrivateFieldSet(this, _CSSOverviewPanel_unusedDeclarations, unusedDeclarations, "f");
    }
    __classPrivateFieldGet(this, _CSSOverviewPanel_instances, "m", _CSSOverviewPanel_renderOverviewCompletedView).call(this);
};
//# sourceMappingURL=CSSOverviewPanel.js.map