// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _RecorderPanel_controller;
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { RecorderController } from './RecorderController.js';
let recorderPanelInstance;
export class RecorderPanel extends UI.Panel.Panel {
    constructor() {
        super(RecorderPanel.panelName);
        _RecorderPanel_controller.set(this, void 0);
        this.element.setAttribute('jslog', `${VisualLogging.panel('chrome-recorder').track({ resize: true })}`);
        __classPrivateFieldSet(this, _RecorderPanel_controller, new RecorderController(), "f");
        this.contentElement.append(__classPrivateFieldGet(this, _RecorderPanel_controller, "f"));
        this.setHideOnDetach();
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!recorderPanelInstance || forceNew) {
            recorderPanelInstance = new RecorderPanel();
        }
        return recorderPanelInstance;
    }
    wasShown() {
        UI.Context.Context.instance().setFlavor(RecorderPanel, this);
        // Focus controller so shortcuts become active
        __classPrivateFieldGet(this, _RecorderPanel_controller, "f").focus();
    }
    willHide() {
        UI.Context.Context.instance().setFlavor(RecorderPanel, null);
    }
    handleActions(actionId) {
        __classPrivateFieldGet(this, _RecorderPanel_controller, "f").handleActions(actionId);
    }
    isActionPossible(actionId) {
        return __classPrivateFieldGet(this, _RecorderPanel_controller, "f").isActionPossible(actionId);
    }
}
_RecorderPanel_controller = new WeakMap();
RecorderPanel.panelName = 'chrome-recorder';
export class ActionDelegate {
    handleAction(_context, actionId) {
        void (async () => {
            await UI.ViewManager.ViewManager.instance().showView(RecorderPanel.panelName);
            const view = UI.ViewManager.ViewManager.instance().view(RecorderPanel.panelName);
            if (view) {
                const widget = (await view.widget());
                widget.handleActions(actionId);
            }
        })();
        return true;
    }
}
//# sourceMappingURL=RecorderPanel.js.map