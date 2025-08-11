// Copyright 2015 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _ObjectEventListenersSidebarPane_lastRequestedContext;
import * as SDK from '../../core/sdk/sdk.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as EventListeners from '../event_listeners/event_listeners.js';
export class ObjectEventListenersSidebarPane extends UI.ThrottledWidget.ThrottledWidget {
    constructor() {
        super();
        _ObjectEventListenersSidebarPane_lastRequestedContext.set(this, void 0);
        this.contentElement.setAttribute('jslog', `${VisualLogging.section('sources.global-listeners')}`);
        this.eventListenersView = new EventListeners.EventListenersView.EventListenersView(this.update.bind(this), /* enableDefaultTreeFocus */ true);
        this.eventListenersView.show(this.element);
        this.setDefaultFocusedChild(this.eventListenersView);
        this.update();
    }
    toolbarItems() {
        const refreshButton = UI.Toolbar.Toolbar.createActionButton('browser-debugger.refresh-global-event-listeners');
        refreshButton.setSize("SMALL" /* Buttons.Button.Size.SMALL */);
        return [refreshButton];
    }
    async doUpdate() {
        if (__classPrivateFieldGet(this, _ObjectEventListenersSidebarPane_lastRequestedContext, "f")) {
            __classPrivateFieldGet(this, _ObjectEventListenersSidebarPane_lastRequestedContext, "f").runtimeModel.releaseObjectGroup(objectGroupName);
            __classPrivateFieldSet(this, _ObjectEventListenersSidebarPane_lastRequestedContext, undefined, "f");
        }
        const windowObjects = [];
        const executionContext = UI.Context.Context.instance().flavor(SDK.RuntimeModel.ExecutionContext);
        if (executionContext) {
            __classPrivateFieldSet(this, _ObjectEventListenersSidebarPane_lastRequestedContext, executionContext, "f");
            const result = await executionContext.evaluate({
                expression: 'self',
                objectGroup: objectGroupName,
                includeCommandLineAPI: false,
                silent: true,
                returnByValue: false,
                generatePreview: false,
            }, 
            /* userGesture */ false, 
            /* awaitPromise */ false);
            if (!('error' in result) && !result.exceptionDetails) {
                windowObjects.push(result.object);
            }
        }
        await this.eventListenersView.addObjects(windowObjects);
    }
    wasShown() {
        super.wasShown();
        UI.Context.Context.instance().addFlavorChangeListener(SDK.RuntimeModel.ExecutionContext, this.update, this);
        UI.Context.Context.instance().setFlavor(ObjectEventListenersSidebarPane, this);
    }
    willHide() {
        UI.Context.Context.instance().setFlavor(ObjectEventListenersSidebarPane, null);
        UI.Context.Context.instance().removeFlavorChangeListener(SDK.RuntimeModel.ExecutionContext, this.update, this);
        super.willHide();
        if (__classPrivateFieldGet(this, _ObjectEventListenersSidebarPane_lastRequestedContext, "f")) {
            __classPrivateFieldGet(this, _ObjectEventListenersSidebarPane_lastRequestedContext, "f").runtimeModel.releaseObjectGroup(objectGroupName);
            __classPrivateFieldSet(this, _ObjectEventListenersSidebarPane_lastRequestedContext, undefined, "f");
        }
    }
}
_ObjectEventListenersSidebarPane_lastRequestedContext = new WeakMap();
export class ActionDelegate {
    handleAction(context, actionId) {
        switch (actionId) {
            case 'browser-debugger.refresh-global-event-listeners': {
                const eventListenersSidebarPane = context.flavor(ObjectEventListenersSidebarPane);
                if (eventListenersSidebarPane) {
                    eventListenersSidebarPane.update();
                    return true;
                }
                return false;
            }
        }
        return false;
    }
}
export const objectGroupName = 'object-event-listeners-sidebar-pane';
//# sourceMappingURL=ObjectEventListenersSidebarPane.js.map