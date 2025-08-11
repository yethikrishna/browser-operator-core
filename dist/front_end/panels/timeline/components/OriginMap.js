// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _OriginMap_instances, _OriginMap_list, _OriginMap_editor, _OriginMap_pullMappingsFromSetting, _OriginMap_pushMappingsToSetting, _OriginMap_updateListFromSetting, _OriginMap_getOrigin, _OriginMap_renderOriginWarning, _OriginMap_developmentValidator, _OriginMap_productionValidator, _OriginMap_createEditor;
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as SDK from '../../../core/sdk/sdk.js';
import * as CrUXManager from '../../../models/crux-manager/crux-manager.js';
import * as RenderCoordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import originMapStyles from './originMap.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Title for a column in a data table representing a site origin used for development
     */
    developmentOrigin: 'Development origin',
    /**
     * @description Title for a column in a data table representing a site origin used by real users in a production environment
     */
    productionOrigin: 'Production origin',
    /**
     * @description Warning message explaining that an input origin is not a valid origin or URL.
     * @example {http//malformed.com} PH1
     */
    invalidOrigin: '"{PH1}" is not a valid origin or URL.',
    /**
     * @description Warning message explaining that an development origin is already mapped to a productionOrigin.
     * @example {https://example.com} PH1
     */
    alreadyMapped: '"{PH1}" is already mapped to a production origin.',
    /**
     * @description Warning message explaining that a page doesn't have enough real user data to show any information for. "Chrome UX Report" is a product name and should not be translated.
     */
    pageHasNoData: 'The Chrome UX Report does not have sufficient real user data for this page.',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/OriginMap.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const DEV_ORIGIN_CONTROL = 'developmentOrigin';
const PROD_ORIGIN_CONTROL = 'productionOrigin';
export class OriginMap extends UI.Widget.WidgetElement {
    constructor() {
        super();
        _OriginMap_instances.add(this);
        _OriginMap_list.set(this, void 0);
        _OriginMap_editor.set(this, void 0);
        __classPrivateFieldSet(this, _OriginMap_list, new UI.ListWidget.ListWidget(this, false /* delegatesFocus */, true /* isTable */), "f");
        CrUXManager.CrUXManager.instance().getConfigSetting().addChangeListener(__classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_updateListFromSetting), this);
        __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_updateListFromSetting).call(this);
    }
    createWidget() {
        const containerWidget = new UI.Widget.Widget(false, false, this);
        __classPrivateFieldGet(this, _OriginMap_list, "f").registerRequiredCSS(originMapStyles);
        __classPrivateFieldGet(this, _OriginMap_list, "f").show(containerWidget.contentElement);
        return containerWidget;
    }
    startCreation() {
        const targetManager = SDK.TargetManager.TargetManager.instance();
        const inspectedURL = targetManager.inspectedURL();
        const currentOrigin = __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_getOrigin).call(this, inspectedURL) || '';
        __classPrivateFieldGet(this, _OriginMap_list, "f").addNewItem(-1, {
            developmentOrigin: currentOrigin,
            productionOrigin: '',
        });
    }
    renderItem(originMapping) {
        const element = document.createElement('div');
        element.classList.add('origin-mapping-row');
        element.role = 'row';
        let cellRole;
        let warningIcon;
        if (originMapping.isTitleRow) {
            element.classList.add('header');
            cellRole = 'columnheader';
            warningIcon = Lit.nothing;
        }
        else {
            cellRole = 'cell';
            warningIcon = Lit.Directives.until(__classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_renderOriginWarning).call(this, originMapping.productionOrigin));
        }
        // clang-format off
        Lit.render(html `
      <div class="origin-mapping-cell development-origin" role=${cellRole}>
        <div class="origin" title=${originMapping.developmentOrigin}>${originMapping.developmentOrigin}</div>
      </div>
      <div class="origin-mapping-cell production-origin" role=${cellRole}>
        ${warningIcon}
        <div class="origin" title=${originMapping.productionOrigin}>${originMapping.productionOrigin}</div>
      </div>
    `, element, { host: this });
        // clang-format on
        return element;
    }
    removeItemRequested(_item, index) {
        const mappings = __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_pullMappingsFromSetting).call(this);
        // `index` will be 1-indexed due to the header row
        mappings.splice(index - 1, 1);
        __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_pushMappingsToSetting).call(this, mappings);
    }
    commitEdit(originMapping, editor, isNew) {
        originMapping.developmentOrigin = __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_getOrigin).call(this, editor.control(DEV_ORIGIN_CONTROL).value) || '';
        originMapping.productionOrigin = __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_getOrigin).call(this, editor.control(PROD_ORIGIN_CONTROL).value) || '';
        const mappings = __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_pullMappingsFromSetting).call(this);
        if (isNew) {
            mappings.push(originMapping);
        }
        __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_pushMappingsToSetting).call(this, mappings);
    }
    beginEdit(originMapping) {
        const editor = __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_createEditor).call(this);
        editor.control(DEV_ORIGIN_CONTROL).value = originMapping.developmentOrigin;
        editor.control(PROD_ORIGIN_CONTROL).value = originMapping.productionOrigin;
        return editor;
    }
}
_OriginMap_list = new WeakMap(), _OriginMap_editor = new WeakMap(), _OriginMap_instances = new WeakSet(), _OriginMap_pullMappingsFromSetting = function _OriginMap_pullMappingsFromSetting() {
    return CrUXManager.CrUXManager.instance().getConfigSetting().get().originMappings || [];
}, _OriginMap_pushMappingsToSetting = function _OriginMap_pushMappingsToSetting(originMappings) {
    const setting = CrUXManager.CrUXManager.instance().getConfigSetting();
    const settingCopy = { ...setting.get() };
    settingCopy.originMappings = originMappings;
    setting.set(settingCopy);
}, _OriginMap_updateListFromSetting = function _OriginMap_updateListFromSetting() {
    const mappings = __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_pullMappingsFromSetting).call(this);
    __classPrivateFieldGet(this, _OriginMap_list, "f").clear();
    __classPrivateFieldGet(this, _OriginMap_list, "f").appendItem({
        developmentOrigin: i18nString(UIStrings.developmentOrigin),
        productionOrigin: i18nString(UIStrings.productionOrigin),
        isTitleRow: true,
    }, false);
    for (const originMapping of mappings) {
        __classPrivateFieldGet(this, _OriginMap_list, "f").appendItem(originMapping, true);
    }
}, _OriginMap_getOrigin = function _OriginMap_getOrigin(url) {
    try {
        return new URL(url).origin;
    }
    catch {
        return null;
    }
}, _OriginMap_renderOriginWarning = function _OriginMap_renderOriginWarning(url) {
    return RenderCoordinator.write(async () => {
        if (!CrUXManager.CrUXManager.instance().isEnabled()) {
            return Lit.nothing;
        }
        const cruxManager = CrUXManager.CrUXManager.instance();
        const result = await cruxManager.getFieldDataForPage(url);
        const hasFieldData = Object.entries(result).some(([key, value]) => {
            if (key === 'warnings') {
                return false;
            }
            return Boolean(value);
        });
        if (hasFieldData) {
            return Lit.nothing;
        }
        return html `
        <devtools-icon
          class="origin-warning-icon"
          name="warning-filled"
          title=${i18nString(UIStrings.pageHasNoData)}
        ></devtools-icon>
      `;
    });
}, _OriginMap_developmentValidator = function _OriginMap_developmentValidator(_item, index, input) {
    const origin = __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_getOrigin).call(this, input.value);
    if (!origin) {
        return { valid: false, errorMessage: i18nString(UIStrings.invalidOrigin, { PH1: input.value }) };
    }
    const mappings = __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_pullMappingsFromSetting).call(this);
    for (let i = 0; i < mappings.length; ++i) {
        // `index` will be 1-indexed due to the header row
        if (i === index - 1) {
            continue;
        }
        const mapping = mappings[i];
        if (mapping.developmentOrigin === origin) {
            return { valid: true, errorMessage: i18nString(UIStrings.alreadyMapped, { PH1: origin }) };
        }
    }
    return { valid: true };
}, _OriginMap_productionValidator = function _OriginMap_productionValidator(_item, _index, input) {
    const origin = __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_getOrigin).call(this, input.value);
    if (!origin) {
        return { valid: false, errorMessage: i18nString(UIStrings.invalidOrigin, { PH1: input.value }) };
    }
    return { valid: true };
}, _OriginMap_createEditor = function _OriginMap_createEditor() {
    if (__classPrivateFieldGet(this, _OriginMap_editor, "f")) {
        return __classPrivateFieldGet(this, _OriginMap_editor, "f");
    }
    const editor = new UI.ListWidget.Editor();
    __classPrivateFieldSet(this, _OriginMap_editor, editor, "f");
    const content = editor.contentElement().createChild('div', 'origin-mapping-editor');
    const devInput = editor.createInput(DEV_ORIGIN_CONTROL, 'text', i18nString(UIStrings.developmentOrigin), __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_developmentValidator).bind(this));
    const prodInput = editor.createInput(PROD_ORIGIN_CONTROL, 'text', i18nString(UIStrings.productionOrigin), __classPrivateFieldGet(this, _OriginMap_instances, "m", _OriginMap_productionValidator).bind(this));
    // clang-format off
    Lit.render(html `
      <label class="development-origin-input">
        ${i18nString(UIStrings.developmentOrigin)}
        ${devInput}
      </label>
      <label class="production-origin-input">
        ${i18nString(UIStrings.productionOrigin)}
        ${prodInput}
      </label>
    `, content, { host: this });
    // clang-format on
    return editor;
};
customElements.define('devtools-origin-map', OriginMap);
//# sourceMappingURL=OriginMap.js.map