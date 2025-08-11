// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _LayoutPane_instances, _LayoutPane_settings, _LayoutPane_uaShadowDOMSetting, _LayoutPane_domModels, _LayoutPane_view, _LayoutPane_fetchNodesByStyle, _LayoutPane_fetchGridNodes, _LayoutPane_fetchFlexContainerNodes, _LayoutPane_makeSettings, _LayoutPane_onSummaryKeyDown, _LayoutPane_getEnumSettings, _LayoutPane_getBooleanSettings, _LayoutPane_onBooleanSettingChange, _LayoutPane_onEnumSettingChange, _LayoutPane_onElementToggle, _LayoutPane_onElementClick, _LayoutPane_onColorChange, _LayoutPane_onElementMouseEnter, _LayoutPane_onElementMouseLeave;
import '../../ui/components/node_text/node_text.js';
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import layoutPaneStyles from './layoutPane.css.js';
const UIStrings = {
    /**
     *@description Title of the input to select the overlay color for an element using the color picker
     */
    chooseElementOverlayColor: 'Choose the overlay color for this element',
    /**
     *@description Title of the show element button in the Layout pane of the Elements panel
     */
    showElementInTheElementsPanel: 'Show element in the Elements panel',
    /**
     *@description Title of a section on CSS Grid tooling
     */
    grid: 'Grid',
    /**
     *@description Title of a section in the Layout Sidebar pane of the Elements panel
     */
    overlayDisplaySettings: 'Overlay display settings',
    /**
     *@description Title of a section in Layout sidebar pane
     */
    gridOverlays: 'Grid overlays',
    /**
     *@description Message in the Layout panel informing users that no CSS Grid layouts were found on the page
     */
    noGridLayoutsFoundOnThisPage: 'No grid layouts found on this page',
    /**
     *@description Title of the Flexbox section in the Layout panel
     */
    flexbox: 'Flexbox',
    /**
     *@description Title of a section in the Layout panel
     */
    flexboxOverlays: 'Flexbox overlays',
    /**
     *@description Text in the Layout panel, when no flexbox elements are found
     */
    noFlexboxLayoutsFoundOnThisPage: 'No flexbox layouts found on this page',
    /**
     *@description Screen reader announcement when opening color picker tool.
     */
    colorPickerOpened: 'Color picker opened.',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/LayoutPane.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { render, html } = Lit;
const nodeToLayoutElement = (node) => {
    const className = node.getAttribute('class');
    const nodeId = node.id;
    return {
        id: nodeId,
        color: 'var(--sys-color-inverse-surface)',
        name: node.localName(),
        domId: node.getAttribute('id'),
        domClasses: className ? className.split(/\s+/).filter(s => !!s) : undefined,
        enabled: false,
        reveal: () => {
            void Common.Revealer.reveal(node);
            void node.scrollIntoView();
        },
        highlight: () => {
            node.highlight();
        },
        hideHighlight: () => {
            SDK.OverlayModel.OverlayModel.hideDOMNodeHighlight();
        },
        toggle: (_value) => {
            throw new Error('Not implemented');
        },
        setColor(_value) {
            throw new Error('Not implemented');
        },
    };
};
const gridNodesToElements = (nodes) => {
    return nodes.map(node => {
        const layoutElement = nodeToLayoutElement(node);
        const nodeId = node.id;
        return {
            ...layoutElement,
            color: node.domModel().overlayModel().colorOfGridInPersistentOverlay(nodeId) || 'var(--sys-color-inverse-surface)',
            enabled: node.domModel().overlayModel().isHighlightedGridInPersistentOverlay(nodeId),
            toggle: (value) => {
                if (value) {
                    node.domModel().overlayModel().highlightGridInPersistentOverlay(nodeId);
                }
                else {
                    node.domModel().overlayModel().hideGridInPersistentOverlay(nodeId);
                }
            },
            setColor(value) {
                this.color = value;
                node.domModel().overlayModel().setColorOfGridInPersistentOverlay(nodeId, value);
            },
        };
    });
};
const flexContainerNodesToElements = (nodes) => {
    return nodes.map(node => {
        const layoutElement = nodeToLayoutElement(node);
        const nodeId = node.id;
        return {
            ...layoutElement,
            color: node.domModel().overlayModel().colorOfFlexInPersistentOverlay(nodeId) || 'var(--sys-color-inverse-surface)',
            enabled: node.domModel().overlayModel().isHighlightedFlexContainerInPersistentOverlay(nodeId),
            toggle: (value) => {
                if (value) {
                    node.domModel().overlayModel().highlightFlexContainerInPersistentOverlay(nodeId);
                }
                else {
                    node.domModel().overlayModel().hideFlexContainerInPersistentOverlay(nodeId);
                }
            },
            setColor(value) {
                this.color = value;
                node.domModel().overlayModel().setColorOfFlexInPersistentOverlay(nodeId, value);
            },
        };
    });
};
function isEnumSetting(setting) {
    return setting.type === "enum" /* Common.Settings.SettingType.ENUM */;
}
function isBooleanSetting(setting) {
    return setting.type === "boolean" /* Common.Settings.SettingType.BOOLEAN */;
}
let layoutPaneInstance;
const DEFAULT_VIEW = (input, output, target) => {
    const onColorLabelKeyUp = (event) => {
        // Handle Enter and Space events to make the color picker accessible.
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        const target = event.target;
        const input = target.querySelector('input');
        input.click();
        UI.ARIAUtils.LiveAnnouncer.alert(i18nString(UIStrings.colorPickerOpened));
        event.preventDefault();
    };
    const onColorLabelKeyDown = (event) => {
        // Prevent default scrolling when the Space key is pressed.
        if (event.key === ' ') {
            event.preventDefault();
        }
    };
    const renderElement = (element) => html `<div
          class="element"
          jslog=${VisualLogging.item()}>
        <devtools-checkbox
          data-element="true"
          class="checkbox-label"
          .checked=${element.enabled}
          @change=${(e) => input.onElementToggle(element, e)}
          jslog=${VisualLogging.toggle().track({
        click: true
    })}>
          <span
              class="node-text-container"
              data-label="true"
              @mouseenter=${(e) => input.onMouseEnter(element, e)}
              @mouseleave=${(e) => input.onMouseLeave(element, e)}>
            <devtools-node-text .data=${{
        nodeId: element.domId, nodeTitle: element.name, nodeClasses: element.domClasses,
    }}></devtools-node-text>
          </span>
        </devtools-checkbox>
        <label
            @keyup=${onColorLabelKeyUp}
            @keydown=${onColorLabelKeyDown}
            class="color-picker-label"
            style="background: ${element.color};"
            jslog=${VisualLogging.showStyleEditor('color')
        .track({
        click: true
    })}>
          <input
              @change=${(e) => input.onColorChange(element, e)}
              @input=${(e) => input.onColorChange(element, e)}
              title=${i18nString(UIStrings.chooseElementOverlayColor)}
              tabindex="0"
              class="color-picker"
              type="color"
              value=${element.color} />
        </label>
        <devtools-button class="show-element"
           .title=${i18nString(UIStrings.showElementInTheElementsPanel)}
           aria-label=${i18nString(UIStrings.showElementInTheElementsPanel)}
           .iconName=${'select-element'}
           .jslogContext=${'elements.select-element'}
           .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
           .variant=${"icon" /* Buttons.Button.Variant.ICON */}
           @click=${(e) => input.onElementClick(element, e)}
           ></devtools-button>
      </div>`;
    // clang-format off
    render(html `
      <div style="min-width: min-content;" jslog=${VisualLogging.pane('layout').track({ resize: true })}>
        <style>${UI.Widget.widgetScoped(layoutPaneStyles)}</style>
        <style>${UI.Widget.widgetScoped(UI.inspectorCommonStyles)}</style>
        <details open>
          <summary class="header"
            @keydown=${input.onSummaryKeyDown}
            jslog=${VisualLogging.sectionHeader('grid-settings').track({ click: true })}>
            ${i18nString(UIStrings.grid)}
          </summary>
          <div class="content-section" jslog=${VisualLogging.section('grid-settings')}>
            <h3 class="content-section-title">${i18nString(UIStrings.overlayDisplaySettings)}</h3>
            <div class="select-settings">
              ${input.enumSettings.map(setting => html `<label data-enum-setting="true" class="select-label" title=${setting.title}>
                      <select
                        data-input="true"
                        jslog=${VisualLogging.dropDown().track({ change: true }).context(setting.name)}
                        @change=${(e) => input.onEnumSettingChange(setting, e)}>
                        ${setting.options.map(opt => html `<option
                                value=${opt.value}
                                .selected=${setting.value === opt.value}
                                jslog=${VisualLogging.item(Platform.StringUtilities.toKebabCase(opt.value)).track({
        click: true
    })}>${opt.title}</option>`)}
                      </select>
                    </label>`)}
            </div>
            <div class="checkbox-settings">
              ${input.booleanSettings.map(setting => html `<devtools-checkbox
                      data-boolean-setting="true"
                      class="checkbox-label"
                      title=${setting.title}
                      .checked=${setting.value}
                      @change=${(e) => input.onBooleanSettingChange(setting, e)}
                      jslog=${VisualLogging.toggle().track({ click: true }).context(setting.name)}>
                    ${setting.title}
                  </devtools-checkbox>`)}
            </div>
          </div>
          ${input.gridElements ?
        html `<div class="content-section" jslog=${VisualLogging.section('grid-overlays')}>
              <h3 class="content-section-title">
                ${input.gridElements.length ?
            i18nString(UIStrings.gridOverlays) :
            i18nString(UIStrings.noGridLayoutsFoundOnThisPage)}
              </h3>
              ${input.gridElements.length ?
            html `<div class="elements">${input.gridElements.map(renderElement)}</div>` :
            ''}
            </div>` : ''}
        </details>
        ${input.flexContainerElements !== undefined ?
        html `
          <details open>
            <summary
                class="header"
                @keydown=${input.onSummaryKeyDown}
                jslog=${VisualLogging.sectionHeader('flexbox-overlays').track({ click: true })}>
              ${i18nString(UIStrings.flexbox)}
            </summary>
            ${input.flexContainerElements ?
            html `<div class="content-section" jslog=${VisualLogging.section('flexbox-overlays')}>
                <h3 class="content-section-title">
                  ${input.flexContainerElements.length ?
                i18nString(UIStrings.flexboxOverlays) :
                i18nString(UIStrings.noFlexboxLayoutsFoundOnThisPage)}
                </h3>
                ${input.flexContainerElements.length ?
                html `<div class="elements">${input.flexContainerElements.map(renderElement)}</div>` :
                ''}
              </div>` : ''}
          </details>`
        : ''}
      </div>`, 
    // clang-format on
    target, { host: input });
};
export class LayoutPane extends UI.Widget.Widget {
    constructor(element, view = DEFAULT_VIEW) {
        super(false, false, element);
        _LayoutPane_instances.add(this);
        _LayoutPane_settings.set(this, []);
        _LayoutPane_uaShadowDOMSetting.set(this, void 0);
        _LayoutPane_domModels.set(this, void 0);
        _LayoutPane_view.set(this, void 0);
        __classPrivateFieldSet(this, _LayoutPane_settings, __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_makeSettings).call(this), "f");
        __classPrivateFieldSet(this, _LayoutPane_uaShadowDOMSetting, Common.Settings.Settings.instance().moduleSetting('show-ua-shadow-dom'), "f");
        __classPrivateFieldSet(this, _LayoutPane_domModels, [], "f");
        __classPrivateFieldSet(this, _LayoutPane_view, view, "f");
    }
    static instance() {
        if (!layoutPaneInstance) {
            layoutPaneInstance = new LayoutPane();
        }
        return layoutPaneInstance;
    }
    modelAdded(domModel) {
        const overlayModel = domModel.overlayModel();
        overlayModel.addEventListener("PersistentGridOverlayStateChanged" /* SDK.OverlayModel.Events.PERSISTENT_GRID_OVERLAY_STATE_CHANGED */, this.requestUpdate, this);
        overlayModel.addEventListener("PersistentFlexContainerOverlayStateChanged" /* SDK.OverlayModel.Events.PERSISTENT_FLEX_CONTAINER_OVERLAY_STATE_CHANGED */, this.requestUpdate, this);
        __classPrivateFieldGet(this, _LayoutPane_domModels, "f").push(domModel);
    }
    modelRemoved(domModel) {
        const overlayModel = domModel.overlayModel();
        overlayModel.removeEventListener("PersistentGridOverlayStateChanged" /* SDK.OverlayModel.Events.PERSISTENT_GRID_OVERLAY_STATE_CHANGED */, this.requestUpdate, this);
        overlayModel.removeEventListener("PersistentFlexContainerOverlayStateChanged" /* SDK.OverlayModel.Events.PERSISTENT_FLEX_CONTAINER_OVERLAY_STATE_CHANGED */, this.requestUpdate, this);
        __classPrivateFieldSet(this, _LayoutPane_domModels, __classPrivateFieldGet(this, _LayoutPane_domModels, "f").filter(model => model !== domModel), "f");
    }
    onSettingChanged(setting, value) {
        Common.Settings.Settings.instance().moduleSetting(setting).set(value);
    }
    wasShown() {
        super.wasShown();
        for (const setting of __classPrivateFieldGet(this, _LayoutPane_settings, "f")) {
            Common.Settings.Settings.instance().moduleSetting(setting.name).addChangeListener(this.requestUpdate, this);
        }
        for (const domModel of __classPrivateFieldGet(this, _LayoutPane_domModels, "f")) {
            this.modelRemoved(domModel);
        }
        __classPrivateFieldSet(this, _LayoutPane_domModels, [], "f");
        SDK.TargetManager.TargetManager.instance().observeModels(SDK.DOMModel.DOMModel, this, { scoped: true });
        UI.Context.Context.instance().addFlavorChangeListener(SDK.DOMModel.DOMNode, this.requestUpdate, this);
        __classPrivateFieldGet(this, _LayoutPane_uaShadowDOMSetting, "f").addChangeListener(this.requestUpdate, this);
        this.requestUpdate();
    }
    willHide() {
        for (const setting of __classPrivateFieldGet(this, _LayoutPane_settings, "f")) {
            Common.Settings.Settings.instance().moduleSetting(setting.name).removeChangeListener(this.requestUpdate, this);
        }
        SDK.TargetManager.TargetManager.instance().unobserveModels(SDK.DOMModel.DOMModel, this);
        UI.Context.Context.instance().removeFlavorChangeListener(SDK.DOMModel.DOMNode, this.requestUpdate, this);
        __classPrivateFieldGet(this, _LayoutPane_uaShadowDOMSetting, "f").removeChangeListener(this.requestUpdate, this);
    }
    async performUpdate() {
        const input = {
            gridElements: gridNodesToElements(await __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_fetchGridNodes).call(this)),
            flexContainerElements: flexContainerNodesToElements(await __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_fetchFlexContainerNodes).call(this)),
            onEnumSettingChange: __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_onEnumSettingChange).bind(this),
            onElementClick: __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_onElementClick).bind(this),
            onColorChange: __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_onColorChange).bind(this),
            onMouseLeave: __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_onElementMouseLeave).bind(this),
            onMouseEnter: __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_onElementMouseEnter).bind(this),
            onElementToggle: __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_onElementToggle).bind(this),
            onBooleanSettingChange: __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_onBooleanSettingChange).bind(this),
            enumSettings: __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_getEnumSettings).call(this),
            booleanSettings: __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_getBooleanSettings).call(this),
            onSummaryKeyDown: __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_onSummaryKeyDown).bind(this),
        };
        __classPrivateFieldGet(this, _LayoutPane_view, "f").call(this, input, {}, this.contentElement);
    }
}
_LayoutPane_settings = new WeakMap(), _LayoutPane_uaShadowDOMSetting = new WeakMap(), _LayoutPane_domModels = new WeakMap(), _LayoutPane_view = new WeakMap(), _LayoutPane_instances = new WeakSet(), _LayoutPane_fetchNodesByStyle = async function _LayoutPane_fetchNodesByStyle(style) {
    const showUAShadowDOM = __classPrivateFieldGet(this, _LayoutPane_uaShadowDOMSetting, "f").get();
    const nodes = [];
    for (const domModel of __classPrivateFieldGet(this, _LayoutPane_domModels, "f")) {
        try {
            const nodeIds = await domModel.getNodesByStyle(style, true /* pierce */);
            for (const nodeId of nodeIds) {
                const node = domModel.nodeForId(nodeId);
                if (node !== null && (showUAShadowDOM || !node.ancestorUserAgentShadowRoot())) {
                    nodes.push(node);
                }
            }
        }
        catch (error) {
            // TODO(crbug.com/1167706): Sometimes in E2E tests the layout panel is updated after a DOM node
            // has been removed. This causes an error that a node has not been found.
            // We can skip nodes that resulted in an error.
            console.warn(error);
        }
    }
    return nodes;
}, _LayoutPane_fetchGridNodes = async function _LayoutPane_fetchGridNodes() {
    return await __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_fetchNodesByStyle).call(this, [{ name: 'display', value: 'grid' }, { name: 'display', value: 'inline-grid' }]);
}, _LayoutPane_fetchFlexContainerNodes = async function _LayoutPane_fetchFlexContainerNodes() {
    return await __classPrivateFieldGet(this, _LayoutPane_instances, "m", _LayoutPane_fetchNodesByStyle).call(this, [{ name: 'display', value: 'flex' }, { name: 'display', value: 'inline-flex' }]);
}, _LayoutPane_makeSettings = function _LayoutPane_makeSettings() {
    const settings = [];
    for (const settingName of ['show-grid-line-labels', 'show-grid-track-sizes', 'show-grid-areas', 'extend-grid-lines']) {
        const setting = Common.Settings.Settings.instance().moduleSetting(settingName);
        const settingValue = setting.get();
        const settingType = setting.type();
        if (!settingType) {
            throw new Error('A setting provided to LayoutSidebarPane does not have a setting type');
        }
        if (settingType !== "boolean" /* Common.Settings.SettingType.BOOLEAN */ && settingType !== "enum" /* Common.Settings.SettingType.ENUM */) {
            throw new Error('A setting provided to LayoutSidebarPane does not have a supported setting type');
        }
        const mappedSetting = {
            type: settingType,
            name: setting.name,
            title: setting.title(),
        };
        if (typeof settingValue === 'boolean') {
            settings.push({
                ...mappedSetting,
                value: settingValue,
                options: setting.options().map(opt => ({
                    ...opt,
                    value: opt.value,
                })),
            });
        }
        else if (typeof settingValue === 'string') {
            settings.push({
                ...mappedSetting,
                value: settingValue,
                options: setting.options().map(opt => ({
                    ...opt,
                    value: opt.value,
                })),
            });
        }
    }
    return settings;
}, _LayoutPane_onSummaryKeyDown = function _LayoutPane_onSummaryKeyDown(event) {
    if (!event.target) {
        return;
    }
    const summaryElement = event.target;
    const detailsElement = summaryElement.parentElement;
    if (!detailsElement) {
        throw new Error('<details> element is not found for a <summary> element');
    }
    switch (event.key) {
        case 'ArrowLeft':
            detailsElement.open = false;
            break;
        case 'ArrowRight':
            detailsElement.open = true;
            break;
    }
}, _LayoutPane_getEnumSettings = function _LayoutPane_getEnumSettings() {
    return __classPrivateFieldGet(this, _LayoutPane_settings, "f").filter(isEnumSetting);
}, _LayoutPane_getBooleanSettings = function _LayoutPane_getBooleanSettings() {
    return __classPrivateFieldGet(this, _LayoutPane_settings, "f").filter(isBooleanSetting);
}, _LayoutPane_onBooleanSettingChange = function _LayoutPane_onBooleanSettingChange(setting, event) {
    event.preventDefault();
    this.onSettingChanged(setting.name, event.target.checked);
}, _LayoutPane_onEnumSettingChange = function _LayoutPane_onEnumSettingChange(setting, event) {
    event.preventDefault();
    this.onSettingChanged(setting.name, event.target.value);
}, _LayoutPane_onElementToggle = function _LayoutPane_onElementToggle(element, event) {
    event.preventDefault();
    element.toggle(event.target.checked);
}, _LayoutPane_onElementClick = function _LayoutPane_onElementClick(element, event) {
    event.preventDefault();
    element.reveal();
}, _LayoutPane_onColorChange = function _LayoutPane_onColorChange(element, event) {
    event.preventDefault();
    element.setColor(event.target.value);
    this.requestUpdate();
}, _LayoutPane_onElementMouseEnter = function _LayoutPane_onElementMouseEnter(element, event) {
    event.preventDefault();
    element.highlight();
}, _LayoutPane_onElementMouseLeave = function _LayoutPane_onElementMouseLeave(element, event) {
    event.preventDefault();
    element.hideHighlight();
};
//# sourceMappingURL=LayoutPane.js.map