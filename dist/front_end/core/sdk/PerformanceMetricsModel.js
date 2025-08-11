// Copyright 2017 The Chromium Authors. All rights reserved.
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
var _PerformanceMetricsModel_agent, _PerformanceMetricsModel_metricModes, _PerformanceMetricsModel_metricData;
import * as Platform from '../platform/platform.js';
import { SDKModel } from './SDKModel.js';
export class PerformanceMetricsModel extends SDKModel {
    constructor(target) {
        super(target);
        _PerformanceMetricsModel_agent.set(this, void 0);
        _PerformanceMetricsModel_metricModes.set(this, new Map([
            ['TaskDuration', "CumulativeTime" /* MetricMode.CUMULATIVE_TIME */],
            ['ScriptDuration', "CumulativeTime" /* MetricMode.CUMULATIVE_TIME */],
            ['LayoutDuration', "CumulativeTime" /* MetricMode.CUMULATIVE_TIME */],
            ['RecalcStyleDuration', "CumulativeTime" /* MetricMode.CUMULATIVE_TIME */],
            ['LayoutCount', "CumulativeCount" /* MetricMode.CUMULATIVE_COUNT */],
            ['RecalcStyleCount', "CumulativeCount" /* MetricMode.CUMULATIVE_COUNT */],
        ]));
        _PerformanceMetricsModel_metricData.set(this, new Map());
        __classPrivateFieldSet(this, _PerformanceMetricsModel_agent, target.performanceAgent(), "f");
    }
    enable() {
        return __classPrivateFieldGet(this, _PerformanceMetricsModel_agent, "f").invoke_enable({});
    }
    disable() {
        return __classPrivateFieldGet(this, _PerformanceMetricsModel_agent, "f").invoke_disable();
    }
    async requestMetrics() {
        const rawMetrics = await __classPrivateFieldGet(this, _PerformanceMetricsModel_agent, "f").invoke_getMetrics() || [];
        const metrics = new Map();
        const timestamp = performance.now();
        for (const metric of rawMetrics.metrics) {
            let data = __classPrivateFieldGet(this, _PerformanceMetricsModel_metricData, "f").get(metric.name);
            if (!data) {
                data = { lastValue: undefined, lastTimestamp: undefined };
                __classPrivateFieldGet(this, _PerformanceMetricsModel_metricData, "f").set(metric.name, data);
            }
            let value;
            switch (__classPrivateFieldGet(this, _PerformanceMetricsModel_metricModes, "f").get(metric.name)) {
                case "CumulativeTime" /* MetricMode.CUMULATIVE_TIME */:
                    value = (data.lastTimestamp && data.lastValue) ?
                        Platform.NumberUtilities.clamp((metric.value - data.lastValue) * 1000 / (timestamp - data.lastTimestamp), 0, 1) :
                        0;
                    data.lastValue = metric.value;
                    data.lastTimestamp = timestamp;
                    break;
                case "CumulativeCount" /* MetricMode.CUMULATIVE_COUNT */:
                    value = (data.lastTimestamp && data.lastValue) ?
                        Math.max(0, (metric.value - data.lastValue) * 1000 / (timestamp - data.lastTimestamp)) :
                        0;
                    data.lastValue = metric.value;
                    data.lastTimestamp = timestamp;
                    break;
                default:
                    value = metric.value;
                    break;
            }
            metrics.set(metric.name, value);
        }
        return { metrics, timestamp };
    }
}
_PerformanceMetricsModel_agent = new WeakMap(), _PerformanceMetricsModel_metricModes = new WeakMap(), _PerformanceMetricsModel_metricData = new WeakMap();
var MetricMode;
(function (MetricMode) {
    MetricMode["CUMULATIVE_TIME"] = "CumulativeTime";
    MetricMode["CUMULATIVE_COUNT"] = "CumulativeCount";
})(MetricMode || (MetricMode = {}));
SDKModel.register(PerformanceMetricsModel, { capabilities: 2 /* Capability.DOM */, autostart: false });
//# sourceMappingURL=PerformanceMetricsModel.js.map