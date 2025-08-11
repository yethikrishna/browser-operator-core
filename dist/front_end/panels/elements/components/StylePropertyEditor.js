// Copyright (c) 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _StylePropertyEditor_instances, _StylePropertyEditor_shadow, _StylePropertyEditor_authoredProperties, _StylePropertyEditor_computedProperties, _StylePropertyEditor_render, _StylePropertyEditor_renderProperty, _StylePropertyEditor_renderButton, _StylePropertyEditor_onButtonClick;
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import { findFlexContainerIcon, findGridContainerIcon } from './CSSPropertyIconResolver.js';
import stylePropertyEditorStyles from './stylePropertyEditor.css.js';
const UIStrings = {
    /**
     * @description Title of the button that selects a flex property.
     * @example {flex-direction} propertyName
     * @example {column} propertyValue
     */
    selectButton: 'Add {propertyName}: {propertyValue}',
    /**
     * @description Title of the button that deselects a flex property.
     * @example {flex-direction} propertyName
     * @example {row} propertyValue
     */
    deselectButton: 'Remove {propertyName}: {propertyValue}',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/components/StylePropertyEditor.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { render, html, Directives } = Lit;
export class PropertySelectedEvent extends Event {
    constructor(name, value) {
        super(PropertySelectedEvent.eventName, {});
        this.data = { name, value };
    }
}
PropertySelectedEvent.eventName = 'propertyselected';
export class PropertyDeselectedEvent extends Event {
    constructor(name, value) {
        super(PropertyDeselectedEvent.eventName, {});
        this.data = { name, value };
    }
}
PropertyDeselectedEvent.eventName = 'propertydeselected';
export class StylePropertyEditor extends HTMLElement {
    constructor() {
        super(...arguments);
        _StylePropertyEditor_instances.add(this);
        _StylePropertyEditor_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _StylePropertyEditor_authoredProperties.set(this, new Map());
        _StylePropertyEditor_computedProperties.set(this, new Map());
        this.editableProperties = [];
    }
    getEditableProperties() {
        return this.editableProperties;
    }
    set data(data) {
        __classPrivateFieldSet(this, _StylePropertyEditor_authoredProperties, data.authoredProperties, "f");
        __classPrivateFieldSet(this, _StylePropertyEditor_computedProperties, data.computedProperties, "f");
        __classPrivateFieldGet(this, _StylePropertyEditor_instances, "m", _StylePropertyEditor_render).call(this);
    }
    findIcon(_query, _computedProperties) {
        throw new Error('Not implemented');
    }
}
_StylePropertyEditor_shadow = new WeakMap(), _StylePropertyEditor_authoredProperties = new WeakMap(), _StylePropertyEditor_computedProperties = new WeakMap(), _StylePropertyEditor_instances = new WeakSet(), _StylePropertyEditor_render = function _StylePropertyEditor_render() {
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    render(html `
      <style>${stylePropertyEditorStyles}</style>
      <div class="container">
        ${this.editableProperties.map(prop => __classPrivateFieldGet(this, _StylePropertyEditor_instances, "m", _StylePropertyEditor_renderProperty).call(this, prop))}
      </div>
    `, __classPrivateFieldGet(this, _StylePropertyEditor_shadow, "f"), {
        host: this,
    });
    // clang-format on
}, _StylePropertyEditor_renderProperty = function _StylePropertyEditor_renderProperty(prop) {
    const authoredValue = __classPrivateFieldGet(this, _StylePropertyEditor_authoredProperties, "f").get(prop.propertyName);
    const notAuthored = !authoredValue;
    const shownValue = authoredValue || __classPrivateFieldGet(this, _StylePropertyEditor_computedProperties, "f").get(prop.propertyName);
    const classes = Directives.classMap({
        'property-value': true,
        'not-authored': notAuthored,
    });
    return html `<div class="row">
      <div class="property">
        <span class="property-name">${prop.propertyName}</span>: <span class=${classes}>${shownValue}</span>
      </div>
      <div class="buttons">
        ${prop.propertyValues.map(value => __classPrivateFieldGet(this, _StylePropertyEditor_instances, "m", _StylePropertyEditor_renderButton).call(this, value, prop.propertyName, value === authoredValue))}
      </div>
    </div>`;
}, _StylePropertyEditor_renderButton = function _StylePropertyEditor_renderButton(propertyValue, propertyName, selected = false) {
    const query = `${propertyName}: ${propertyValue}`;
    const iconInfo = this.findIcon(query, __classPrivateFieldGet(this, _StylePropertyEditor_computedProperties, "f"));
    if (!iconInfo) {
        throw new Error(`Icon for ${query} is not found`);
    }
    const transform = `transform: rotate(${iconInfo.rotate}deg) scale(${iconInfo.scaleX}, ${iconInfo.scaleY})`;
    const classes = Directives.classMap({
        button: true,
        selected,
    });
    const values = { propertyName, propertyValue };
    const title = selected ? i18nString(UIStrings.deselectButton, values) : i18nString(UIStrings.selectButton, values);
    return html `
      <button title=${title}
              class=${classes}
              jslog=${VisualLogging.item().track({ click: true }).context(`${propertyName}-${propertyValue}`)}
              @click=${() => __classPrivateFieldGet(this, _StylePropertyEditor_instances, "m", _StylePropertyEditor_onButtonClick).call(this, propertyName, propertyValue, selected)}>
        <devtools-icon style=${transform} name=${iconInfo.iconName}>
        </devtools-icon>
      </button>
    `;
}, _StylePropertyEditor_onButtonClick = function _StylePropertyEditor_onButtonClick(propertyName, propertyValue, selected) {
    if (selected) {
        this.dispatchEvent(new PropertyDeselectedEvent(propertyName, propertyValue));
    }
    else {
        this.dispatchEvent(new PropertySelectedEvent(propertyName, propertyValue));
    }
};
export class FlexboxEditor extends StylePropertyEditor {
    constructor() {
        super(...arguments);
        this.jslogContext = 'cssFlexboxEditor';
        this.editableProperties = FlexboxEditableProperties;
    }
    findIcon(query, computedProperties) {
        return findFlexContainerIcon(query, computedProperties);
    }
}
customElements.define('devtools-flexbox-editor', FlexboxEditor);
export class GridEditor extends StylePropertyEditor {
    constructor() {
        super(...arguments);
        this.jslogContext = 'cssGridEditor';
        this.editableProperties = GridEditableProperties;
    }
    findIcon(query, computedProperties) {
        return findGridContainerIcon(query, computedProperties);
    }
}
customElements.define('devtools-grid-editor', GridEditor);
export const FlexboxEditableProperties = [
    {
        propertyName: 'flex-direction',
        propertyValues: [
            'row',
            'column',
            'row-reverse',
            'column-reverse',
        ],
    },
    {
        propertyName: 'flex-wrap',
        propertyValues: [
            'nowrap',
            'wrap',
        ],
    },
    {
        propertyName: 'align-content',
        propertyValues: [
            'center',
            'flex-start',
            'flex-end',
            'space-around',
            'space-between',
            'stretch',
        ],
    },
    {
        propertyName: 'justify-content',
        propertyValues: [
            'center',
            'flex-start',
            'flex-end',
            'space-between',
            'space-around',
            'space-evenly',
        ],
    },
    {
        propertyName: 'align-items',
        propertyValues: [
            'center',
            'flex-start',
            'flex-end',
            'stretch',
            'baseline',
        ],
    },
];
export const GridEditableProperties = [
    {
        propertyName: 'align-content',
        propertyValues: [
            'center',
            'space-between',
            'space-around',
            'space-evenly',
            'stretch',
        ],
    },
    {
        propertyName: 'justify-content',
        propertyValues: [
            'center',
            'start',
            'end',
            'space-between',
            'space-around',
            'space-evenly',
        ],
    },
    {
        propertyName: 'align-items',
        propertyValues: [
            'center',
            'start',
            'end',
            'stretch',
            'baseline',
        ],
    },
    {
        propertyName: 'justify-items',
        propertyValues: [
            'center',
            'start',
            'end',
            'stretch',
        ],
    },
];
//# sourceMappingURL=StylePropertyEditor.js.map