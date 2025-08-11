// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _SecurityPanelSidebar_instances, _SecurityPanelSidebar_securitySidebarLastItemSetting, _SecurityPanelSidebar_originGroupTitles, _SecurityPanelSidebar_originGroups, _SecurityPanelSidebar_cookieControlsTreeElement, _SecurityPanelSidebar_elementsByOrigin, _SecurityPanelSidebar_mainViewReloadMessage, _SecurityPanelSidebar_mainOrigin, _SecurityPanelSidebar_addSidebarSection, _SecurityPanelSidebar_originGroupTitle, _SecurityPanelSidebar_originGroupElement, _SecurityPanelSidebar_createOriginGroupElement, _SecurityPanelSidebar_clearOriginGroups, _SecurityPanelSidebar_renderTreeElement;
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as Root from '../../core/root/root.js';
import * as UI from '../../ui/legacy/legacy.js';
import { CookieControlsTreeElement } from './CookieControlsTreeElement.js';
import { CookieReportTreeElement } from './CookieReportTreeElement.js';
import lockIconStyles from './lockIcon.css.js';
import { OriginTreeElement } from './OriginTreeElement.js';
import { createHighlightedUrl, getSecurityStateIconForDetailedView, getSecurityStateIconForOverview, OriginGroup, } from './SecurityPanel.js';
import sidebarStyles from './sidebar.css.js';
const UIStrings = {
    /**
     *@description Section title for the the Security Panel's sidebar
     */
    security: 'Security',
    /**
     *@description Section title for the the Security Panel's sidebar
     */
    privacy: 'Privacy',
    /**
     *@description Sidebar element text in the Security panel
     */
    cookieReport: 'Third-party cookies',
    /**
     *@description Sidebar element text in the Security panel
     */
    flagControls: 'Controls',
    /**
     *@description Text in Security Panel of the Security panel
     */
    mainOrigin: 'Main origin',
    /**
     *@description Text in Security Panel of the Security panel
     */
    nonsecureOrigins: 'Non-secure origins',
    /**
     *@description Text in Security Panel of the Security panel
     */
    secureOrigins: 'Secure origins',
    /**
     *@description Text in Security Panel of the Security panel
     */
    unknownCanceled: 'Unknown / canceled',
    /**
     *@description Title text content in Security Panel of the Security panel
     */
    overview: 'Overview',
    /**
     *@description Text in Security Panel of the Security panel
     */
    reloadToViewDetails: 'Reload to view details',
};
const str_ = i18n.i18n.registerUIStrings('panels/security/SecurityPanelSidebar.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class SecurityPanelSidebar extends UI.Widget.VBox {
    constructor(element) {
        super(undefined, undefined, element);
        _SecurityPanelSidebar_instances.add(this);
        _SecurityPanelSidebar_securitySidebarLastItemSetting.set(this, void 0);
        _SecurityPanelSidebar_originGroupTitles.set(this, void 0);
        _SecurityPanelSidebar_originGroups.set(this, void 0);
        _SecurityPanelSidebar_cookieControlsTreeElement.set(this, void 0);
        _SecurityPanelSidebar_elementsByOrigin.set(this, void 0);
        _SecurityPanelSidebar_mainViewReloadMessage.set(this, void 0);
        _SecurityPanelSidebar_mainOrigin.set(this, void 0);
        __classPrivateFieldSet(this, _SecurityPanelSidebar_securitySidebarLastItemSetting, Common.Settings.Settings.instance().createSetting('security-last-selected-element-path', ''), "f");
        __classPrivateFieldSet(this, _SecurityPanelSidebar_mainOrigin, null, "f");
        this.sidebarTree = new UI.TreeOutline.TreeOutlineInShadow("NavigationTree" /* UI.TreeOutline.TreeVariant.NAVIGATION_TREE */);
        this.sidebarTree.registerRequiredCSS(lockIconStyles, sidebarStyles);
        this.sidebarTree.element.classList.add('security-sidebar');
        this.contentElement.appendChild(this.sidebarTree.element);
        if (Root.Runtime.hostConfig.devToolsPrivacyUI?.enabled) {
            const privacyTreeSection = __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_addSidebarSection).call(this, i18nString(UIStrings.privacy), 'privacy');
            __classPrivateFieldSet(this, _SecurityPanelSidebar_cookieControlsTreeElement, new CookieControlsTreeElement(i18nString(UIStrings.flagControls), 'cookie-flag-controls'), "f");
            privacyTreeSection.appendChild(__classPrivateFieldGet(this, _SecurityPanelSidebar_cookieControlsTreeElement, "f"));
            this.cookieReportTreeElement = new CookieReportTreeElement(i18nString(UIStrings.cookieReport), 'cookie-report');
            privacyTreeSection.appendChild(this.cookieReportTreeElement);
            // If this if the first time this setting is set, go to the controls tool
            if (__classPrivateFieldGet(this, _SecurityPanelSidebar_securitySidebarLastItemSetting, "f").get() === '') {
                __classPrivateFieldGet(this, _SecurityPanelSidebar_securitySidebarLastItemSetting, "f").set(__classPrivateFieldGet(this, _SecurityPanelSidebar_cookieControlsTreeElement, "f").elemId);
            }
        }
        const securitySectionTitle = i18nString(UIStrings.security);
        const securityTreeSection = __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_addSidebarSection).call(this, securitySectionTitle, 'security');
        this.securityOverviewElement =
            new OriginTreeElement('security-main-view-sidebar-tree-item', __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_renderTreeElement));
        this.securityOverviewElement.tooltip = i18nString(UIStrings.overview);
        securityTreeSection.appendChild(this.securityOverviewElement);
        __classPrivateFieldSet(this, _SecurityPanelSidebar_originGroupTitles, new Map([
            [OriginGroup.MainOrigin, { title: i18nString(UIStrings.mainOrigin) }],
            [
                OriginGroup.NonSecure,
                {
                    title: i18nString(UIStrings.nonsecureOrigins),
                    icon: getSecurityStateIconForDetailedView("insecure" /* Protocol.Security.SecurityState.Insecure */, `lock-icon lock-icon-${"insecure" /* Protocol.Security.SecurityState.Insecure */}`),
                },
            ],
            [
                OriginGroup.Secure,
                {
                    title: i18nString(UIStrings.secureOrigins),
                    icon: getSecurityStateIconForDetailedView("secure" /* Protocol.Security.SecurityState.Secure */, `lock-icon lock-icon-${"secure" /* Protocol.Security.SecurityState.Secure */}`),
                },
            ],
            [
                OriginGroup.Unknown,
                {
                    title: i18nString(UIStrings.unknownCanceled),
                    icon: getSecurityStateIconForDetailedView("unknown" /* Protocol.Security.SecurityState.Unknown */, `lock-icon lock-icon-${"unknown" /* Protocol.Security.SecurityState.Unknown */}`),
                },
            ],
        ]), "f");
        __classPrivateFieldSet(this, _SecurityPanelSidebar_originGroups, new Map(), "f");
        for (const group of Object.values(OriginGroup)) {
            const element = __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_createOriginGroupElement).call(this, __classPrivateFieldGet(this, _SecurityPanelSidebar_originGroupTitles, "f").get(group)?.title, __classPrivateFieldGet(this, _SecurityPanelSidebar_originGroupTitles, "f").get(group)?.icon);
            __classPrivateFieldGet(this, _SecurityPanelSidebar_originGroups, "f").set(group, element);
            securityTreeSection.appendChild(element);
        }
        __classPrivateFieldSet(this, _SecurityPanelSidebar_mainViewReloadMessage, new UI.TreeOutline.TreeElement(i18nString(UIStrings.reloadToViewDetails)), "f");
        __classPrivateFieldGet(this, _SecurityPanelSidebar_mainViewReloadMessage, "f").selectable = false;
        __classPrivateFieldGet(this, _SecurityPanelSidebar_mainViewReloadMessage, "f").listItemElement.classList.add('security-main-view-reload-message');
        const treeElement = __classPrivateFieldGet(this, _SecurityPanelSidebar_originGroups, "f").get(OriginGroup.MainOrigin);
        treeElement.appendChild(__classPrivateFieldGet(this, _SecurityPanelSidebar_mainViewReloadMessage, "f"));
        __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_clearOriginGroups).call(this);
        __classPrivateFieldSet(this, _SecurityPanelSidebar_elementsByOrigin, new Map(), "f");
        this.element.addEventListener('update-sidebar-selection', (event) => {
            const id = event.detail.id;
            __classPrivateFieldGet(this, _SecurityPanelSidebar_securitySidebarLastItemSetting, "f").set(id);
        });
        this.showLastSelectedElement();
    }
    showLastSelectedElement() {
        if (__classPrivateFieldGet(this, _SecurityPanelSidebar_cookieControlsTreeElement, "f") &&
            __classPrivateFieldGet(this, _SecurityPanelSidebar_securitySidebarLastItemSetting, "f").get() === __classPrivateFieldGet(this, _SecurityPanelSidebar_cookieControlsTreeElement, "f").elemId) {
            __classPrivateFieldGet(this, _SecurityPanelSidebar_cookieControlsTreeElement, "f").select();
            __classPrivateFieldGet(this, _SecurityPanelSidebar_cookieControlsTreeElement, "f").showElement();
        }
        else if (this.cookieReportTreeElement &&
            __classPrivateFieldGet(this, _SecurityPanelSidebar_securitySidebarLastItemSetting, "f").get() === this.cookieReportTreeElement.elemId) {
            this.cookieReportTreeElement.select();
            this.cookieReportTreeElement.showElement();
        }
        else {
            this.securityOverviewElement.select();
            this.securityOverviewElement.showElement();
        }
    }
    toggleOriginsList(hidden) {
        for (const element of __classPrivateFieldGet(this, _SecurityPanelSidebar_originGroups, "f").values()) {
            element.hidden = hidden;
        }
    }
    addOrigin(origin, securityState) {
        __classPrivateFieldGet(this, _SecurityPanelSidebar_mainViewReloadMessage, "f").hidden = true;
        const originElement = new OriginTreeElement('security-sidebar-tree-item', __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_renderTreeElement), origin);
        originElement.tooltip = origin;
        __classPrivateFieldGet(this, _SecurityPanelSidebar_elementsByOrigin, "f").set(origin, originElement);
        this.updateOrigin(origin, securityState);
    }
    setMainOrigin(origin) {
        __classPrivateFieldSet(this, _SecurityPanelSidebar_mainOrigin, origin, "f");
    }
    get mainOrigin() {
        return __classPrivateFieldGet(this, _SecurityPanelSidebar_mainOrigin, "f");
    }
    get originGroups() {
        return __classPrivateFieldGet(this, _SecurityPanelSidebar_originGroups, "f");
    }
    updateOrigin(origin, securityState) {
        const originElement = __classPrivateFieldGet(this, _SecurityPanelSidebar_elementsByOrigin, "f").get(origin);
        originElement.setSecurityState(securityState);
        let newParent;
        if (origin === __classPrivateFieldGet(this, _SecurityPanelSidebar_mainOrigin, "f")) {
            newParent = __classPrivateFieldGet(this, _SecurityPanelSidebar_originGroups, "f").get(OriginGroup.MainOrigin);
            newParent.title = i18nString(UIStrings.mainOrigin);
            if (securityState === "secure" /* Protocol.Security.SecurityState.Secure */) {
                newParent.setLeadingIcons([getSecurityStateIconForOverview(securityState, `lock-icon lock-icon-${securityState}`)]);
            }
            else {
                newParent.setLeadingIcons([getSecurityStateIconForOverview(securityState, `lock-icon lock-icon-${securityState}`)]);
            }
            UI.ARIAUtils.setLabel(newParent.childrenListElement, newParent.title);
        }
        else {
            switch (securityState) {
                case "secure" /* Protocol.Security.SecurityState.Secure */:
                    newParent = __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_originGroupElement).call(this, OriginGroup.Secure);
                    break;
                case "unknown" /* Protocol.Security.SecurityState.Unknown */:
                    newParent = __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_originGroupElement).call(this, OriginGroup.Unknown);
                    break;
                default:
                    newParent = __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_originGroupElement).call(this, OriginGroup.NonSecure);
                    break;
            }
        }
        const oldParent = originElement.parent;
        if (oldParent !== newParent) {
            if (oldParent) {
                oldParent.removeChild(originElement);
                if (oldParent.childCount() === 0) {
                    oldParent.hidden = true;
                }
            }
            newParent.appendChild(originElement);
            newParent.hidden = false;
        }
    }
    clearOrigins() {
        __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_clearOriginGroups).call(this);
        __classPrivateFieldGet(this, _SecurityPanelSidebar_elementsByOrigin, "f").clear();
    }
    focus() {
        this.sidebarTree.focus();
    }
}
_SecurityPanelSidebar_securitySidebarLastItemSetting = new WeakMap(), _SecurityPanelSidebar_originGroupTitles = new WeakMap(), _SecurityPanelSidebar_originGroups = new WeakMap(), _SecurityPanelSidebar_cookieControlsTreeElement = new WeakMap(), _SecurityPanelSidebar_elementsByOrigin = new WeakMap(), _SecurityPanelSidebar_mainViewReloadMessage = new WeakMap(), _SecurityPanelSidebar_mainOrigin = new WeakMap(), _SecurityPanelSidebar_instances = new WeakSet(), _SecurityPanelSidebar_addSidebarSection = function _SecurityPanelSidebar_addSidebarSection(title, jslogContext) {
    const treeElement = new UI.TreeOutline.TreeElement(title, true, jslogContext);
    treeElement.listItemElement.classList.add('security-group-list-item');
    treeElement.setCollapsible(false);
    treeElement.selectable = false;
    this.sidebarTree.appendChild(treeElement);
    UI.ARIAUtils.markAsHeading(treeElement.listItemElement, 3);
    UI.ARIAUtils.setLabel(treeElement.childrenListElement, title);
    return treeElement;
}, _SecurityPanelSidebar_originGroupTitle = function _SecurityPanelSidebar_originGroupTitle(originGroup) {
    return __classPrivateFieldGet(this, _SecurityPanelSidebar_originGroupTitles, "f").get(originGroup)?.title;
}, _SecurityPanelSidebar_originGroupElement = function _SecurityPanelSidebar_originGroupElement(originGroup) {
    return __classPrivateFieldGet(this, _SecurityPanelSidebar_originGroups, "f").get(originGroup);
}, _SecurityPanelSidebar_createOriginGroupElement = function _SecurityPanelSidebar_createOriginGroupElement(originGroupTitle, originGroupIcon) {
    const originGroup = new UI.TreeOutline.TreeElement(originGroupTitle, true);
    originGroup.selectable = false;
    originGroup.expand();
    originGroup.listItemElement.classList.add('security-sidebar-origins');
    if (originGroupIcon) {
        originGroup.setLeadingIcons([originGroupIcon]);
    }
    UI.ARIAUtils.setLabel(originGroup.childrenListElement, originGroupTitle);
    return originGroup;
}, _SecurityPanelSidebar_clearOriginGroups = function _SecurityPanelSidebar_clearOriginGroups() {
    for (const [originGroup, originGroupElement] of __classPrivateFieldGet(this, _SecurityPanelSidebar_originGroups, "f")) {
        if (originGroup === OriginGroup.MainOrigin) {
            for (let i = originGroupElement.childCount() - 1; i > 0; i--) {
                originGroupElement.removeChildAtIndex(i);
            }
            originGroupElement.title = __classPrivateFieldGet(this, _SecurityPanelSidebar_instances, "m", _SecurityPanelSidebar_originGroupTitle).call(this, OriginGroup.MainOrigin);
            originGroupElement.hidden = false;
            __classPrivateFieldGet(this, _SecurityPanelSidebar_mainViewReloadMessage, "f").hidden = false;
        }
        else {
            originGroupElement.removeChildren();
            originGroupElement.hidden = true;
        }
    }
}, _SecurityPanelSidebar_renderTreeElement = function _SecurityPanelSidebar_renderTreeElement(element) {
    if (element instanceof OriginTreeElement) {
        const securityState = element.securityState() ?? "unknown" /* Protocol.Security.SecurityState.Unknown */;
        const isOverviewElement = element.listItemElement.classList.contains('security-main-view-sidebar-tree-item');
        const icon = isOverviewElement ?
            getSecurityStateIconForOverview(securityState, `lock-icon lock-icon-${securityState}`) :
            getSecurityStateIconForDetailedView(securityState, `security-property security-property-${securityState}`);
        const elementTitle = isOverviewElement ? (() => {
            const title = document.createElement('span');
            title.classList.add('title');
            title.textContent = i18nString(UIStrings.overview);
            return title;
        })() : createHighlightedUrl(element.origin() ?? Platform.DevToolsPath.EmptyUrlString, securityState);
        element.setLeadingIcons([icon]);
        if (element.listItemElement.lastChild) {
            element.listItemElement.removeChild(element.listItemElement.lastChild);
        }
        element.listItemElement.appendChild(elementTitle);
    }
};
//# sourceMappingURL=SecurityPanelSidebar.js.map