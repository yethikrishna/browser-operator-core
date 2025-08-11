// Copyright 2018 The Chromium Authors. All rights reserved.
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
var _NodeIndicator_instances, _NodeIndicator_element, _NodeIndicator_button, _NodeIndicator_update, _BackendSettingsSync_instances, _BackendSettingsSync_autoAttachSetting, _BackendSettingsSync_adBlockEnabledSetting, _BackendSettingsSync_emulatePageFocusSetting, _BackendSettingsSync_updateTarget, _BackendSettingsSync_updateAutoAttach, _BackendSettingsSync_update;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Root from '../../core/root/root.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as MobileThrottling from '../../panels/mobile_throttling/mobile_throttling.js';
import * as Security from '../../panels/security/security.js';
import * as Components from '../../ui/legacy/components/utils/utils.js';
import * as UI from '../../ui/legacy/legacy.js';
import nodeIconStyles from './nodeIcon.css.js';
const UIStrings = {
    /**
     * @description Text that refers to the main target. The main target is the primary webpage that
     * DevTools is connected to. This text is used in various places in the UI as a label/name to inform
     * the user which target/webpage they are currently connected to, as DevTools may connect to multiple
     * targets at the same time in some scenarios.
     */
    main: 'Main',
    /**
     * @description Text that refers to the tab target. The tab target is the Chrome tab that
     * DevTools is connected to. This text is used in various places in the UI as a label/name to inform
     * the user which target they are currently connected to, as DevTools may connect to multiple
     * targets at the same time in some scenarios.
     * @meaning Tab target that's different than the "Tab" of Chrome. (See b/343009012)
     */
    tab: 'Tab',
    /**
     * @description A warning shown to the user when JavaScript is disabled on the webpage that
     * DevTools is connected to.
     */
    javascriptIsDisabled: 'JavaScript is disabled',
    /**
     * @description A message that prompts the user to open devtools for a specific environment (Node.js)
     */
    openDedicatedTools: 'Open dedicated DevTools for `Node.js`',
};
const str_ = i18n.i18n.registerUIStrings('entrypoints/inspector_main/InspectorMain.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
let inspectorMainImplInstance;
export class InspectorMainImpl {
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!inspectorMainImplInstance || forceNew) {
            inspectorMainImplInstance = new InspectorMainImpl();
        }
        return inspectorMainImplInstance;
    }
    async run() {
        let firstCall = true;
        await SDK.Connections.initMainConnection(async () => {
            const type = Root.Runtime.Runtime.queryParam('v8only') ?
                SDK.Target.Type.NODE :
                (Root.Runtime.Runtime.queryParam('targetType') === 'tab' ? SDK.Target.Type.TAB : SDK.Target.Type.FRAME);
            // TODO(crbug.com/1348385): support waiting for debugger with tab target.
            const waitForDebuggerInPage = type === SDK.Target.Type.FRAME && Root.Runtime.Runtime.queryParam('panel') === 'sources';
            const name = type === SDK.Target.Type.FRAME ? i18nString(UIStrings.main) : i18nString(UIStrings.tab);
            const target = SDK.TargetManager.TargetManager.instance().createTarget('main', name, type, null, undefined, waitForDebuggerInPage);
            const waitForPrimaryPageTarget = () => {
                return new Promise(resolve => {
                    const targetManager = SDK.TargetManager.TargetManager.instance();
                    targetManager.observeTargets({
                        targetAdded: (target) => {
                            if (target === targetManager.primaryPageTarget()) {
                                target.setName(i18nString(UIStrings.main));
                                resolve(target);
                            }
                        },
                        targetRemoved: (_) => { },
                    });
                });
            };
            await waitForPrimaryPageTarget();
            // Only resume target during the first connection,
            // subsequent connections are due to connection hand-over,
            // there is no need to pause in debugger.
            if (!firstCall) {
                return;
            }
            firstCall = false;
            if (waitForDebuggerInPage) {
                const debuggerModel = target.model(SDK.DebuggerModel.DebuggerModel);
                if (debuggerModel) {
                    if (!debuggerModel.isReadyToPause()) {
                        await debuggerModel.once(SDK.DebuggerModel.Events.DebuggerIsReadyToPause);
                    }
                    debuggerModel.pause();
                }
            }
            if (type !== SDK.Target.Type.TAB) {
                void target.runtimeAgent().invoke_runIfWaitingForDebugger();
            }
        }, Components.TargetDetachedDialog.TargetDetachedDialog.connectionLost);
        new SourcesPanelIndicator();
        new BackendSettingsSync();
        new MobileThrottling.NetworkPanelIndicator.NetworkPanelIndicator();
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.events.addEventListener(Host.InspectorFrontendHostAPI.Events.ReloadInspectedPage, ({ data: hard }) => {
            SDK.ResourceTreeModel.ResourceTreeModel.reloadAllPages(hard);
        });
        // Skip possibly showing the cookie control reload banner if devtools UI is not enabled or if there is an enterprise policy blocking third party cookies
        if (!Root.Runtime.hostConfig.devToolsPrivacyUI?.enabled ||
            Root.Runtime.hostConfig.thirdPartyCookieControls?.managedBlockThirdPartyCookies === true) {
            return;
        }
        // Third party cookie control settings according to the browser
        const browserCookieControls = Root.Runtime.hostConfig.thirdPartyCookieControls;
        // Devtools cookie controls settings
        const cookieControlOverrideSetting = Common.Settings.Settings.instance().createSetting('cookie-control-override-enabled', undefined);
        const gracePeriodMitigationDisabledSetting = Common.Settings.Settings.instance().createSetting('grace-period-mitigation-disabled', undefined);
        const heuristicMitigationDisabledSetting = Common.Settings.Settings.instance().createSetting('heuristic-mitigation-disabled', undefined);
        // If there are saved cookie control settings, check to see if they differ from the browser config. If they do, prompt a page reload so the user will see the cookie controls behavior.
        if (cookieControlOverrideSetting.get() !== undefined) {
            if (browserCookieControls?.thirdPartyCookieRestrictionEnabled !== cookieControlOverrideSetting.get()) {
                Security.CookieControlsView.showInfobar();
                return;
            }
            // If the devtools third-party cookie control is active, we also need to check if there's a discrepancy in the mitigation behavior.
            if (cookieControlOverrideSetting.get()) {
                if (browserCookieControls?.thirdPartyCookieMetadataEnabled === gracePeriodMitigationDisabledSetting.get()) {
                    Security.CookieControlsView.showInfobar();
                    return;
                }
                if (browserCookieControls?.thirdPartyCookieHeuristicsEnabled === heuristicMitigationDisabledSetting.get()) {
                    Security.CookieControlsView.showInfobar();
                    return;
                }
            }
        }
    }
}
Common.Runnable.registerEarlyInitializationRunnable(InspectorMainImpl.instance);
export class ReloadActionDelegate {
    handleAction(_context, actionId) {
        switch (actionId) {
            case 'inspector-main.reload':
                SDK.ResourceTreeModel.ResourceTreeModel.reloadAllPages(false);
                return true;
            case 'inspector-main.hard-reload':
                SDK.ResourceTreeModel.ResourceTreeModel.reloadAllPages(true);
                return true;
        }
        return false;
    }
}
export class FocusDebuggeeActionDelegate {
    handleAction(_context, _actionId) {
        const mainTarget = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
        if (!mainTarget) {
            return false;
        }
        void mainTarget.pageAgent().invoke_bringToFront();
        return true;
    }
}
let nodeIndicatorInstance;
export class NodeIndicator {
    constructor() {
        _NodeIndicator_instances.add(this);
        _NodeIndicator_element.set(this, void 0);
        _NodeIndicator_button.set(this, void 0);
        const element = document.createElement('div');
        const shadowRoot = UI.UIUtils.createShadowRootWithCoreStyles(element, { cssFile: nodeIconStyles });
        __classPrivateFieldSet(this, _NodeIndicator_element, shadowRoot.createChild('div', 'node-icon'), "f");
        element.addEventListener('click', () => Host.InspectorFrontendHost.InspectorFrontendHostInstance.openNodeFrontend(), false);
        __classPrivateFieldSet(this, _NodeIndicator_button, new UI.Toolbar.ToolbarItem(element), "f");
        __classPrivateFieldGet(this, _NodeIndicator_button, "f").setTitle(i18nString(UIStrings.openDedicatedTools));
        SDK.TargetManager.TargetManager.instance().addEventListener("AvailableTargetsChanged" /* SDK.TargetManager.Events.AVAILABLE_TARGETS_CHANGED */, event => __classPrivateFieldGet(this, _NodeIndicator_instances, "m", _NodeIndicator_update).call(this, event.data));
        __classPrivateFieldGet(this, _NodeIndicator_button, "f").setVisible(false);
        __classPrivateFieldGet(this, _NodeIndicator_instances, "m", _NodeIndicator_update).call(this, []);
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!nodeIndicatorInstance || forceNew) {
            nodeIndicatorInstance = new NodeIndicator();
        }
        return nodeIndicatorInstance;
    }
    item() {
        return __classPrivateFieldGet(this, _NodeIndicator_button, "f");
    }
}
_NodeIndicator_element = new WeakMap(), _NodeIndicator_button = new WeakMap(), _NodeIndicator_instances = new WeakSet(), _NodeIndicator_update = function _NodeIndicator_update(targetInfos) {
    // Disable when we are testing, as debugging e2e
    // attaches a debug process and this changes some view sizes
    if (Host.InspectorFrontendHost.isUnderTest()) {
        return;
    }
    const hasNode = Boolean(targetInfos.find(target => target.type === 'node' && !target.attached));
    __classPrivateFieldGet(this, _NodeIndicator_element, "f").classList.toggle('inactive', !hasNode);
    if (hasNode) {
        __classPrivateFieldGet(this, _NodeIndicator_button, "f").setVisible(true);
    }
};
export class SourcesPanelIndicator {
    constructor() {
        Common.Settings.Settings.instance()
            .moduleSetting('java-script-disabled')
            .addChangeListener(javaScriptDisabledChanged);
        javaScriptDisabledChanged();
        function javaScriptDisabledChanged() {
            const warnings = [];
            if (Common.Settings.Settings.instance().moduleSetting('java-script-disabled').get()) {
                warnings.push(i18nString(UIStrings.javascriptIsDisabled));
            }
            UI.InspectorView.InspectorView.instance().setPanelWarnings('sources', warnings);
        }
    }
}
export class BackendSettingsSync {
    constructor() {
        _BackendSettingsSync_instances.add(this);
        _BackendSettingsSync_autoAttachSetting.set(this, void 0);
        _BackendSettingsSync_adBlockEnabledSetting.set(this, void 0);
        _BackendSettingsSync_emulatePageFocusSetting.set(this, void 0);
        __classPrivateFieldSet(this, _BackendSettingsSync_autoAttachSetting, Common.Settings.Settings.instance().moduleSetting('auto-attach-to-created-pages'), "f");
        __classPrivateFieldGet(this, _BackendSettingsSync_autoAttachSetting, "f").addChangeListener(__classPrivateFieldGet(this, _BackendSettingsSync_instances, "m", _BackendSettingsSync_updateAutoAttach), this);
        __classPrivateFieldGet(this, _BackendSettingsSync_instances, "m", _BackendSettingsSync_updateAutoAttach).call(this);
        __classPrivateFieldSet(this, _BackendSettingsSync_adBlockEnabledSetting, Common.Settings.Settings.instance().moduleSetting('network.ad-blocking-enabled'), "f");
        __classPrivateFieldGet(this, _BackendSettingsSync_adBlockEnabledSetting, "f").addChangeListener(__classPrivateFieldGet(this, _BackendSettingsSync_instances, "m", _BackendSettingsSync_update), this);
        __classPrivateFieldSet(this, _BackendSettingsSync_emulatePageFocusSetting, Common.Settings.Settings.instance().moduleSetting('emulate-page-focus'), "f");
        __classPrivateFieldGet(this, _BackendSettingsSync_emulatePageFocusSetting, "f").addChangeListener(__classPrivateFieldGet(this, _BackendSettingsSync_instances, "m", _BackendSettingsSync_update), this);
        SDK.TargetManager.TargetManager.instance().observeTargets(this);
    }
    targetAdded(target) {
        __classPrivateFieldGet(this, _BackendSettingsSync_instances, "m", _BackendSettingsSync_updateTarget).call(this, target);
    }
    targetRemoved(_target) {
    }
}
_BackendSettingsSync_autoAttachSetting = new WeakMap(), _BackendSettingsSync_adBlockEnabledSetting = new WeakMap(), _BackendSettingsSync_emulatePageFocusSetting = new WeakMap(), _BackendSettingsSync_instances = new WeakSet(), _BackendSettingsSync_updateTarget = function _BackendSettingsSync_updateTarget(target) {
    if (target.type() !== SDK.Target.Type.FRAME || target.parentTarget()?.type() === SDK.Target.Type.FRAME) {
        return;
    }
    void target.pageAgent().invoke_setAdBlockingEnabled({ enabled: __classPrivateFieldGet(this, _BackendSettingsSync_adBlockEnabledSetting, "f").get() });
    void target.emulationAgent().invoke_setFocusEmulationEnabled({ enabled: __classPrivateFieldGet(this, _BackendSettingsSync_emulatePageFocusSetting, "f").get() });
}, _BackendSettingsSync_updateAutoAttach = function _BackendSettingsSync_updateAutoAttach() {
    Host.InspectorFrontendHost.InspectorFrontendHostInstance.setOpenNewWindowForPopups(__classPrivateFieldGet(this, _BackendSettingsSync_autoAttachSetting, "f").get());
}, _BackendSettingsSync_update = function _BackendSettingsSync_update() {
    for (const target of SDK.TargetManager.TargetManager.instance().targets()) {
        __classPrivateFieldGet(this, _BackendSettingsSync_instances, "m", _BackendSettingsSync_updateTarget).call(this, target);
    }
};
SDK.ChildTargetManager.ChildTargetManager.install();
//# sourceMappingURL=InspectorMain.js.map