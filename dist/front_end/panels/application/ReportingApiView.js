// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _ReportingApiView_instances, _ReportingApiView_emptyWidget, _ReportingApiView_reportingApiReports, _ReportingApiView_showReportsAndEndpoints;
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { ReportingApiReportsView } from './ReportingApiReportsView.js';
const UIStrings = {
    /**
     *@description Placeholder text that shows if no report or endpoint was detected.
     *             A report contains information on issues or events that were encountered by a web browser.
     *             An endpoint is a URL where the report is sent to.
     *             (https://developer.chrome.com/docs/capabilities/web-apis/reporting-api)
     */
    noReportOrEndpoint: 'No report or endpoint',
    /**
     *@description Placeholder text that shows if no report or endpoint was detected.
     *             A report contains information on issues or events that were encountered by a web browser.
     *             An endpoint is a URL where the report is sent to.
     *             (https://developer.chrome.com/docs/capabilities/web-apis/reporting-api)
     */
    reportingApiDescription: 'On this page you will be able to inspect `Reporting API` reports and endpoints.',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/ReportingApiView.ts', UIStrings);
export const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const REPORTING_API_EXPLANATION_URL = 'https://developer.chrome.com/docs/capabilities/web-apis/reporting-api';
export class ReportingApiView extends UI.SplitWidget.SplitWidget {
    constructor(endpointsGrid) {
        super(/* isVertical: */ false, /* secondIsSidebar: */ true);
        _ReportingApiView_instances.add(this);
        _ReportingApiView_emptyWidget.set(this, void 0);
        _ReportingApiView_reportingApiReports.set(this, void 0);
        this.element.setAttribute('jslog', `${VisualLogging.pane('reporting-api')}`);
        this.endpointsGrid = endpointsGrid;
        this.endpoints = new Map();
        const mainTarget = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
        const networkManager = mainTarget?.model(SDK.NetworkManager.NetworkManager);
        __classPrivateFieldSet(this, _ReportingApiView_emptyWidget, new UI.EmptyWidget.EmptyWidget(i18nString(UIStrings.noReportOrEndpoint), i18nString(UIStrings.reportingApiDescription)), "f");
        __classPrivateFieldGet(this, _ReportingApiView_emptyWidget, "f").link = REPORTING_API_EXPLANATION_URL;
        this.setMainWidget(__classPrivateFieldGet(this, _ReportingApiView_emptyWidget, "f"));
        if (networkManager) {
            networkManager.addEventListener(SDK.NetworkManager.Events.ReportingApiEndpointsChangedForOrigin, event => this.onEndpointsChangedForOrigin(event.data), this);
            networkManager.addEventListener(SDK.NetworkManager.Events.ReportingApiReportAdded, __classPrivateFieldGet(this, _ReportingApiView_instances, "m", _ReportingApiView_showReportsAndEndpoints), this);
            __classPrivateFieldSet(this, _ReportingApiView_reportingApiReports, new ReportingApiReportsView(networkManager), "f");
            const reportingApiEndpointsView = new UI.Widget.VBox();
            reportingApiEndpointsView.setMinimumSize(0, 40);
            reportingApiEndpointsView.contentElement.appendChild(this.endpointsGrid);
            this.setSidebarWidget(reportingApiEndpointsView);
            void networkManager.enableReportingApi();
            this.hideSidebar();
        }
    }
    onEndpointsChangedForOrigin(data) {
        __classPrivateFieldGet(this, _ReportingApiView_instances, "m", _ReportingApiView_showReportsAndEndpoints).call(this);
        this.endpoints.set(data.origin, data.endpoints);
        this.endpointsGrid.data = { endpoints: this.endpoints };
    }
}
_ReportingApiView_emptyWidget = new WeakMap(), _ReportingApiView_reportingApiReports = new WeakMap(), _ReportingApiView_instances = new WeakSet(), _ReportingApiView_showReportsAndEndpoints = function _ReportingApiView_showReportsAndEndpoints() {
    // Either we don't have reports and endpoints to show (first case), or we have already
    // replaced the empty widget with a different main view (second case).
    if (__classPrivateFieldGet(this, _ReportingApiView_reportingApiReports, "f") === undefined || this.mainWidget() !== __classPrivateFieldGet(this, _ReportingApiView_emptyWidget, "f")) {
        return;
    }
    __classPrivateFieldGet(this, _ReportingApiView_emptyWidget, "f")?.detach();
    __classPrivateFieldSet(this, _ReportingApiView_emptyWidget, undefined, "f");
    this.setMainWidget(__classPrivateFieldGet(this, _ReportingApiView_reportingApiReports, "f"));
    this.showBoth();
};
//# sourceMappingURL=ReportingApiView.js.map