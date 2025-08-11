// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ContrastCheckTrigger_instances, _ContrastCheckTrigger_pageLoadListeners, _ContrastCheckTrigger_frameAddedListeners, _ContrastCheckTrigger_checkContrast, _ContrastCheckTrigger_pageLoaded, _ContrastCheckTrigger_frameAdded;
import * as Common from '../../core/common/common.js';
import * as Root from '../../core/root/root.js';
import * as SDK from '../../core/sdk/sdk.js';
let contrastCheckTriggerInstance = null;
export class ContrastCheckTrigger {
    constructor() {
        _ContrastCheckTrigger_instances.add(this);
        _ContrastCheckTrigger_pageLoadListeners.set(this, new WeakMap());
        _ContrastCheckTrigger_frameAddedListeners.set(this, new WeakMap());
        SDK.TargetManager.TargetManager.instance().observeModels(SDK.ResourceTreeModel.ResourceTreeModel, this);
    }
    static instance({ forceNew } = { forceNew: false }) {
        if (!contrastCheckTriggerInstance || forceNew) {
            contrastCheckTriggerInstance = new ContrastCheckTrigger();
        }
        return contrastCheckTriggerInstance;
    }
    async modelAdded(resourceTreeModel) {
        __classPrivateFieldGet(this, _ContrastCheckTrigger_pageLoadListeners, "f").set(resourceTreeModel, resourceTreeModel.addEventListener(SDK.ResourceTreeModel.Events.Load, __classPrivateFieldGet(this, _ContrastCheckTrigger_instances, "m", _ContrastCheckTrigger_pageLoaded), this));
        __classPrivateFieldGet(this, _ContrastCheckTrigger_frameAddedListeners, "f").set(resourceTreeModel, resourceTreeModel.addEventListener(SDK.ResourceTreeModel.Events.FrameAdded, __classPrivateFieldGet(this, _ContrastCheckTrigger_instances, "m", _ContrastCheckTrigger_frameAdded), this));
    }
    modelRemoved(resourceTreeModel) {
        const pageLoadListener = __classPrivateFieldGet(this, _ContrastCheckTrigger_pageLoadListeners, "f").get(resourceTreeModel);
        if (pageLoadListener) {
            Common.EventTarget.removeEventListeners([pageLoadListener]);
        }
        const frameAddedListeners = __classPrivateFieldGet(this, _ContrastCheckTrigger_frameAddedListeners, "f").get(resourceTreeModel);
        if (frameAddedListeners) {
            Common.EventTarget.removeEventListeners([frameAddedListeners]);
        }
    }
}
_ContrastCheckTrigger_pageLoadListeners = new WeakMap(), _ContrastCheckTrigger_frameAddedListeners = new WeakMap(), _ContrastCheckTrigger_instances = new WeakSet(), _ContrastCheckTrigger_checkContrast = function _ContrastCheckTrigger_checkContrast(resourceTreeModel) {
    if (!Root.Runtime.experiments.isEnabled('contrast-issues')) {
        return;
    }
    void resourceTreeModel.target().auditsAgent().invoke_checkContrast({});
}, _ContrastCheckTrigger_pageLoaded = function _ContrastCheckTrigger_pageLoaded(event) {
    const { resourceTreeModel } = event.data;
    __classPrivateFieldGet(this, _ContrastCheckTrigger_instances, "m", _ContrastCheckTrigger_checkContrast).call(this, resourceTreeModel);
}, _ContrastCheckTrigger_frameAdded = async function _ContrastCheckTrigger_frameAdded(event) {
    if (!Root.Runtime.experiments.isEnabled('contrast-issues')) {
        return;
    }
    const frame = event.data;
    if (!frame.isMainFrame()) {
        return;
    }
    // If the target document finished loading, check the contrast immediately.
    // Otherwise, it should be triggered when the page load event fires.
    const response = await frame.resourceTreeModel().target().runtimeAgent().invoke_evaluate({ expression: 'document.readyState', returnByValue: true });
    if (response.result && response.result.value === 'complete') {
        __classPrivateFieldGet(this, _ContrastCheckTrigger_instances, "m", _ContrastCheckTrigger_checkContrast).call(this, frame.resourceTreeModel());
    }
};
//# sourceMappingURL=ContrastCheckTrigger.js.map