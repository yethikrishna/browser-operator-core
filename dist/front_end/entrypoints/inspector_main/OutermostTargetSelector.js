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
var _OutermostTargetSelector_instances, _OutermostTargetSelector_dropDown, _OutermostTargetSelector_toolbarItem, _OutermostTargetSelector_targetComparator, _OutermostTargetSelector_onTargetInfoChanged, _OutermostTargetSelector_onInspectedURLChanged, _OutermostTargetSelector_targetChanged, _OutermostTargetSelector_subtitleFor;
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Bindings from '../../models/bindings/bindings.js';
import * as UI from '../../ui/legacy/legacy.js';
import outermostTargetSelectorStyles from './outermostTargetSelector.css.js';
const UIStrings = {
    /**
     *@description Title of toolbar item in outermost target selector in the main toolbar
     */
    targetNotSelected: 'Page: Not selected',
    /**
     *@description Title of toolbar item in outermost target selector in the main toolbar
     *@example {top} PH1
     */
    targetS: 'Page: {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('entrypoints/inspector_main/OutermostTargetSelector.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
let outermostTargetSelectorInstance;
export class OutermostTargetSelector {
    constructor() {
        _OutermostTargetSelector_instances.add(this);
        this.listItems = new UI.ListModel.ListModel();
        _OutermostTargetSelector_dropDown.set(this, void 0);
        _OutermostTargetSelector_toolbarItem.set(this, void 0);
        __classPrivateFieldSet(this, _OutermostTargetSelector_dropDown, new UI.SoftDropDown.SoftDropDown(this.listItems, this), "f");
        __classPrivateFieldGet(this, _OutermostTargetSelector_dropDown, "f").setRowHeight(36);
        __classPrivateFieldSet(this, _OutermostTargetSelector_toolbarItem, new UI.Toolbar.ToolbarItem(__classPrivateFieldGet(this, _OutermostTargetSelector_dropDown, "f").element), "f");
        __classPrivateFieldGet(this, _OutermostTargetSelector_toolbarItem, "f").setTitle(i18nString(UIStrings.targetNotSelected));
        this.listItems.addEventListener("ItemsReplaced" /* UI.ListModel.Events.ITEMS_REPLACED */, () => __classPrivateFieldGet(this, _OutermostTargetSelector_toolbarItem, "f").setEnabled(Boolean(this.listItems.length)));
        __classPrivateFieldGet(this, _OutermostTargetSelector_toolbarItem, "f").element.classList.add('toolbar-has-dropdown');
        const targetManager = SDK.TargetManager.TargetManager.instance();
        targetManager.addModelListener(SDK.ChildTargetManager.ChildTargetManager, "TargetInfoChanged" /* SDK.ChildTargetManager.Events.TARGET_INFO_CHANGED */, __classPrivateFieldGet(this, _OutermostTargetSelector_instances, "m", _OutermostTargetSelector_onTargetInfoChanged), this);
        targetManager.addEventListener("NameChanged" /* SDK.TargetManager.Events.NAME_CHANGED */, __classPrivateFieldGet(this, _OutermostTargetSelector_instances, "m", _OutermostTargetSelector_onInspectedURLChanged), this);
        targetManager.observeTargets(this);
        UI.Context.Context.instance().addFlavorChangeListener(SDK.Target.Target, __classPrivateFieldGet(this, _OutermostTargetSelector_instances, "m", _OutermostTargetSelector_targetChanged), this);
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!outermostTargetSelectorInstance || forceNew) {
            outermostTargetSelectorInstance = new OutermostTargetSelector();
        }
        return outermostTargetSelectorInstance;
    }
    item() {
        return __classPrivateFieldGet(this, _OutermostTargetSelector_toolbarItem, "f");
    }
    highlightedItemChanged(_from, _to, fromElement, toElement) {
        if (fromElement) {
            fromElement.classList.remove('highlighted');
        }
        if (toElement) {
            toElement.classList.add('highlighted');
        }
    }
    titleFor(target) {
        return target.name();
    }
    targetAdded(target) {
        if (target.outermostTarget() !== target) {
            return;
        }
        this.listItems.insertWithComparator(target, __classPrivateFieldGet(this, _OutermostTargetSelector_instances, "m", _OutermostTargetSelector_targetComparator).call(this));
        __classPrivateFieldGet(this, _OutermostTargetSelector_toolbarItem, "f").setVisible(this.listItems.length > 1);
        if (target === UI.Context.Context.instance().flavor(SDK.Target.Target)) {
            __classPrivateFieldGet(this, _OutermostTargetSelector_dropDown, "f").selectItem(target);
        }
    }
    targetRemoved(target) {
        const index = this.listItems.indexOf(target);
        if (index === -1) {
            return;
        }
        this.listItems.remove(index);
        __classPrivateFieldGet(this, _OutermostTargetSelector_toolbarItem, "f").setVisible(this.listItems.length > 1);
    }
    createElementForItem(item) {
        const element = document.createElement('div');
        element.classList.add('target');
        const shadowRoot = UI.UIUtils.createShadowRootWithCoreStyles(element, { cssFile: outermostTargetSelectorStyles });
        const title = shadowRoot.createChild('div', 'title');
        UI.UIUtils.createTextChild(title, Platform.StringUtilities.trimEndWithMaxLength(this.titleFor(item), 100));
        const subTitle = shadowRoot.createChild('div', 'subtitle');
        UI.UIUtils.createTextChild(subTitle, __classPrivateFieldGet(this, _OutermostTargetSelector_instances, "m", _OutermostTargetSelector_subtitleFor).call(this, item));
        return element;
    }
    isItemSelectable(_item) {
        return true;
    }
    itemSelected(item) {
        const title = item ? i18nString(UIStrings.targetS, { PH1: this.titleFor(item) }) : i18nString(UIStrings.targetNotSelected);
        __classPrivateFieldGet(this, _OutermostTargetSelector_toolbarItem, "f").setTitle(title);
        if (item && item !== UI.Context.Context.instance().flavor(SDK.Target.Target)?.outermostTarget()) {
            UI.Context.Context.instance().setFlavor(SDK.Target.Target, item);
        }
    }
}
_OutermostTargetSelector_dropDown = new WeakMap(), _OutermostTargetSelector_toolbarItem = new WeakMap(), _OutermostTargetSelector_instances = new WeakSet(), _OutermostTargetSelector_targetComparator = function _OutermostTargetSelector_targetComparator() {
    return (a, b) => {
        const aTargetInfo = a.targetInfo();
        const bTargetInfo = b.targetInfo();
        if (!aTargetInfo || !bTargetInfo) {
            return 0;
        }
        if (!aTargetInfo.subtype?.length && bTargetInfo.subtype?.length) {
            return -1;
        }
        if (aTargetInfo.subtype?.length && !bTargetInfo.subtype?.length) {
            return 1;
        }
        return aTargetInfo.url.localeCompare(bTargetInfo.url);
    };
}, _OutermostTargetSelector_onTargetInfoChanged = function _OutermostTargetSelector_onTargetInfoChanged(event) {
    const targetManager = SDK.TargetManager.TargetManager.instance();
    const target = targetManager.targetById(event.data.targetId);
    if (!target || target.outermostTarget() !== target) {
        return;
    }
    this.targetRemoved(target);
    this.targetAdded(target);
}, _OutermostTargetSelector_onInspectedURLChanged = function _OutermostTargetSelector_onInspectedURLChanged(event) {
    const target = event.data;
    if (!target || target.outermostTarget() !== target) {
        return;
    }
    this.targetRemoved(target);
    this.targetAdded(target);
}, _OutermostTargetSelector_targetChanged = function _OutermostTargetSelector_targetChanged({ data: target, }) {
    __classPrivateFieldGet(this, _OutermostTargetSelector_dropDown, "f").selectItem(target?.outermostTarget() || null);
}, _OutermostTargetSelector_subtitleFor = function _OutermostTargetSelector_subtitleFor(target) {
    const targetInfo = target.targetInfo();
    if (target === SDK.TargetManager.TargetManager.instance().primaryPageTarget() && targetInfo) {
        return Bindings.ResourceUtils.displayNameForURL(targetInfo.url);
    }
    return target.targetInfo()?.subtype || '';
};
//# sourceMappingURL=OutermostTargetSelector.js.map