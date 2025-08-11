// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Button_instances, _Button_shadow, _Button_boundOnClick, _Button_props, _Button_internals, _Button_slotRef, _Button_setDisabledProperty, _Button_onClick, _Button_isToolbarVariant, _Button_render;
import '../icon_button/icon_button.js';
import * as Lit from '../../lit/lit.js';
import * as VisualLogging from '../../visual_logging/visual_logging.js';
import buttonStyles from './button.css.js';
const { html, Directives: { ifDefined, ref, classMap } } = Lit;
export var Variant;
(function (Variant) {
    Variant["PRIMARY"] = "primary";
    Variant["TONAL"] = "tonal";
    Variant["OUTLINED"] = "outlined";
    Variant["TEXT"] = "text";
    Variant["TOOLBAR"] = "toolbar";
    // Just like toolbar but has a style similar to a primary button.
    Variant["PRIMARY_TOOLBAR"] = "primary_toolbar";
    Variant["ICON"] = "icon";
    Variant["ICON_TOGGLE"] = "icon_toggle";
    Variant["ADORNER_ICON"] = "adorner_icon";
})(Variant || (Variant = {}));
export var Size;
(function (Size) {
    Size["MICRO"] = "MICRO";
    Size["SMALL"] = "SMALL";
    Size["REGULAR"] = "REGULAR";
})(Size || (Size = {}));
export var ToggleType;
(function (ToggleType) {
    ToggleType["PRIMARY"] = "primary-toggle";
    ToggleType["RED"] = "red-toggle";
})(ToggleType || (ToggleType = {}));
export class Button extends HTMLElement {
    constructor() {
        super();
        _Button_instances.add(this);
        _Button_shadow.set(this, this.attachShadow({ mode: 'open', delegatesFocus: true }));
        _Button_boundOnClick.set(this, __classPrivateFieldGet(this, _Button_instances, "m", _Button_onClick).bind(this));
        _Button_props.set(this, {
            size: "REGULAR" /* Size.REGULAR */,
            variant: "primary" /* Variant.PRIMARY */,
            toggleOnClick: true,
            disabled: false,
            active: false,
            spinner: false,
            type: 'button',
            longClickable: false,
        });
        _Button_internals.set(this, this.attachInternals());
        _Button_slotRef.set(this, Lit.Directives.createRef());
        this.setAttribute('role', 'presentation');
        this.addEventListener('click', __classPrivateFieldGet(this, _Button_boundOnClick, "f"), true);
    }
    cloneNode(deep) {
        const node = super.cloneNode(deep);
        Object.assign(__classPrivateFieldGet(node, _Button_props, "f"), __classPrivateFieldGet(this, _Button_props, "f"));
        __classPrivateFieldGet(node, _Button_instances, "m", _Button_render).call(node);
        return node;
    }
    /**
     * Perfer using the .data= setter instead of setting the individual properties
     * for increased type-safety.
     */
    set data(data) {
        __classPrivateFieldGet(this, _Button_props, "f").variant = data.variant;
        __classPrivateFieldGet(this, _Button_props, "f").iconName = data.iconName;
        __classPrivateFieldGet(this, _Button_props, "f").toggledIconName = data.toggledIconName;
        __classPrivateFieldGet(this, _Button_props, "f").toggleOnClick = data.toggleOnClick !== undefined ? data.toggleOnClick : true;
        __classPrivateFieldGet(this, _Button_props, "f").size = "REGULAR" /* Size.REGULAR */;
        if ('size' in data && data.size) {
            __classPrivateFieldGet(this, _Button_props, "f").size = data.size;
        }
        __classPrivateFieldGet(this, _Button_props, "f").active = Boolean(data.active);
        __classPrivateFieldGet(this, _Button_props, "f").spinner = Boolean('spinner' in data ? data.spinner : false);
        __classPrivateFieldGet(this, _Button_props, "f").type = 'button';
        if ('type' in data && data.type) {
            __classPrivateFieldGet(this, _Button_props, "f").type = data.type;
        }
        __classPrivateFieldGet(this, _Button_props, "f").toggled = data.toggled;
        __classPrivateFieldGet(this, _Button_props, "f").toggleType = data.toggleType;
        __classPrivateFieldGet(this, _Button_props, "f").checked = data.checked;
        __classPrivateFieldGet(this, _Button_props, "f").disabled = Boolean(data.disabled);
        __classPrivateFieldGet(this, _Button_props, "f").title = data.title;
        __classPrivateFieldGet(this, _Button_props, "f").jslogContext = data.jslogContext;
        __classPrivateFieldGet(this, _Button_props, "f").longClickable = data.longClickable;
        __classPrivateFieldGet(this, _Button_props, "f").inverseColorTheme = data.inverseColorTheme;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set iconName(iconName) {
        __classPrivateFieldGet(this, _Button_props, "f").iconName = iconName;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set toggledIconName(toggledIconName) {
        __classPrivateFieldGet(this, _Button_props, "f").toggledIconName = toggledIconName;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set toggleType(toggleType) {
        __classPrivateFieldGet(this, _Button_props, "f").toggleType = toggleType;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set variant(variant) {
        __classPrivateFieldGet(this, _Button_props, "f").variant = variant;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set size(size) {
        __classPrivateFieldGet(this, _Button_props, "f").size = size;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set reducedFocusRing(reducedFocusRing) {
        __classPrivateFieldGet(this, _Button_props, "f").reducedFocusRing = reducedFocusRing;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set type(type) {
        __classPrivateFieldGet(this, _Button_props, "f").type = type;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set title(title) {
        __classPrivateFieldGet(this, _Button_props, "f").title = title;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    get disabled() {
        return __classPrivateFieldGet(this, _Button_props, "f").disabled;
    }
    set disabled(disabled) {
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_setDisabledProperty).call(this, disabled);
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set toggleOnClick(toggleOnClick) {
        __classPrivateFieldGet(this, _Button_props, "f").toggleOnClick = toggleOnClick;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set toggled(toggled) {
        __classPrivateFieldGet(this, _Button_props, "f").toggled = toggled;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    get toggled() {
        return Boolean(__classPrivateFieldGet(this, _Button_props, "f").toggled);
    }
    set checked(checked) {
        __classPrivateFieldGet(this, _Button_props, "f").checked = checked;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set active(active) {
        __classPrivateFieldGet(this, _Button_props, "f").active = active;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    get active() {
        return __classPrivateFieldGet(this, _Button_props, "f").active;
    }
    set spinner(spinner) {
        __classPrivateFieldGet(this, _Button_props, "f").spinner = spinner;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    get jslogContext() {
        return __classPrivateFieldGet(this, _Button_props, "f").jslogContext;
    }
    set jslogContext(jslogContext) {
        __classPrivateFieldGet(this, _Button_props, "f").jslogContext = jslogContext;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set longClickable(longClickable) {
        __classPrivateFieldGet(this, _Button_props, "f").longClickable = longClickable;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    set inverseColorTheme(inverseColorTheme) {
        __classPrivateFieldGet(this, _Button_props, "f").inverseColorTheme = inverseColorTheme;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
    }
    // Based on https://web.dev/more-capable-form-controls/ to make custom elements form-friendly.
    // Form controls usually expose a "value" property.
    get value() {
        return __classPrivateFieldGet(this, _Button_props, "f").value || '';
    }
    set value(value) {
        __classPrivateFieldGet(this, _Button_props, "f").value = value;
    }
    // The following properties and methods aren't strictly required,
    // but browser-level form controls provide them. Providing them helps
    // ensure consistency with browser-provided controls.
    get form() {
        return __classPrivateFieldGet(this, _Button_internals, "f").form;
    }
    get name() {
        return this.getAttribute('name');
    }
    get type() {
        return __classPrivateFieldGet(this, _Button_props, "f").type;
    }
    get validity() {
        return __classPrivateFieldGet(this, _Button_internals, "f").validity;
    }
    get validationMessage() {
        return __classPrivateFieldGet(this, _Button_internals, "f").validationMessage;
    }
    get willValidate() {
        return __classPrivateFieldGet(this, _Button_internals, "f").willValidate;
    }
    checkValidity() {
        return __classPrivateFieldGet(this, _Button_internals, "f").checkValidity();
    }
    reportValidity() {
        return __classPrivateFieldGet(this, _Button_internals, "f").reportValidity();
    }
}
_Button_shadow = new WeakMap(), _Button_boundOnClick = new WeakMap(), _Button_props = new WeakMap(), _Button_internals = new WeakMap(), _Button_slotRef = new WeakMap(), _Button_instances = new WeakSet(), _Button_setDisabledProperty = function _Button_setDisabledProperty(disabled) {
    __classPrivateFieldGet(this, _Button_props, "f").disabled = disabled;
    __classPrivateFieldGet(this, _Button_instances, "m", _Button_render).call(this);
}, _Button_onClick = function _Button_onClick(event) {
    if (__classPrivateFieldGet(this, _Button_props, "f").disabled) {
        event.stopPropagation();
        event.preventDefault();
        return;
    }
    if (this.form && __classPrivateFieldGet(this, _Button_props, "f").type === 'submit') {
        event.preventDefault();
        this.form.dispatchEvent(new SubmitEvent('submit', {
            submitter: this,
        }));
    }
    if (this.form && __classPrivateFieldGet(this, _Button_props, "f").type === 'reset') {
        event.preventDefault();
        this.form.reset();
    }
    if (__classPrivateFieldGet(this, _Button_props, "f").toggleOnClick && __classPrivateFieldGet(this, _Button_props, "f").variant === "icon_toggle" /* Variant.ICON_TOGGLE */ && __classPrivateFieldGet(this, _Button_props, "f").iconName) {
        this.toggled = !__classPrivateFieldGet(this, _Button_props, "f").toggled;
    }
}, _Button_isToolbarVariant = function _Button_isToolbarVariant() {
    return __classPrivateFieldGet(this, _Button_props, "f").variant === "toolbar" /* Variant.TOOLBAR */ || __classPrivateFieldGet(this, _Button_props, "f").variant === "primary_toolbar" /* Variant.PRIMARY_TOOLBAR */;
}, _Button_render = function _Button_render() {
    const nodes = __classPrivateFieldGet(this, _Button_slotRef, "f").value?.assignedNodes();
    const isEmpty = !Boolean(nodes?.length);
    if (!__classPrivateFieldGet(this, _Button_props, "f").variant) {
        throw new Error('Button requires a variant to be defined');
    }
    if (__classPrivateFieldGet(this, _Button_instances, "m", _Button_isToolbarVariant).call(this)) {
        if (!__classPrivateFieldGet(this, _Button_props, "f").iconName) {
            throw new Error('Toolbar button requires an icon');
        }
        if (!isEmpty) {
            throw new Error('Toolbar button does not accept children');
        }
    }
    if (__classPrivateFieldGet(this, _Button_props, "f").variant === "icon" /* Variant.ICON */) {
        if (!__classPrivateFieldGet(this, _Button_props, "f").iconName) {
            throw new Error('Icon button requires an icon');
        }
        if (!isEmpty) {
            throw new Error('Icon button does not accept children');
        }
    }
    const hasIcon = Boolean(__classPrivateFieldGet(this, _Button_props, "f").iconName);
    const classes = {
        primary: __classPrivateFieldGet(this, _Button_props, "f").variant === "primary" /* Variant.PRIMARY */,
        tonal: __classPrivateFieldGet(this, _Button_props, "f").variant === "tonal" /* Variant.TONAL */,
        outlined: __classPrivateFieldGet(this, _Button_props, "f").variant === "outlined" /* Variant.OUTLINED */,
        text: __classPrivateFieldGet(this, _Button_props, "f").variant === "text" /* Variant.TEXT */,
        toolbar: __classPrivateFieldGet(this, _Button_instances, "m", _Button_isToolbarVariant).call(this),
        'primary-toolbar': __classPrivateFieldGet(this, _Button_props, "f").variant === "primary_toolbar" /* Variant.PRIMARY_TOOLBAR */,
        icon: __classPrivateFieldGet(this, _Button_props, "f").variant === "icon" /* Variant.ICON */ || __classPrivateFieldGet(this, _Button_props, "f").variant === "icon_toggle" /* Variant.ICON_TOGGLE */ ||
            __classPrivateFieldGet(this, _Button_props, "f").variant === "adorner_icon" /* Variant.ADORNER_ICON */,
        'primary-toggle': __classPrivateFieldGet(this, _Button_props, "f").toggleType === "primary-toggle" /* ToggleType.PRIMARY */,
        'red-toggle': __classPrivateFieldGet(this, _Button_props, "f").toggleType === "red-toggle" /* ToggleType.RED */,
        toggled: Boolean(__classPrivateFieldGet(this, _Button_props, "f").toggled),
        checked: Boolean(__classPrivateFieldGet(this, _Button_props, "f").checked),
        'text-with-icon': hasIcon && !isEmpty,
        'only-icon': hasIcon && isEmpty,
        micro: __classPrivateFieldGet(this, _Button_props, "f").size === "MICRO" /* Size.MICRO */,
        small: __classPrivateFieldGet(this, _Button_props, "f").size === "SMALL" /* Size.SMALL */,
        'reduced-focus-ring': Boolean(__classPrivateFieldGet(this, _Button_props, "f").reducedFocusRing),
        active: __classPrivateFieldGet(this, _Button_props, "f").active,
        inverse: Boolean(__classPrivateFieldGet(this, _Button_props, "f").inverseColorTheme),
    };
    const spinnerClasses = {
        primary: __classPrivateFieldGet(this, _Button_props, "f").variant === "primary" /* Variant.PRIMARY */,
        outlined: __classPrivateFieldGet(this, _Button_props, "f").variant === "outlined" /* Variant.OUTLINED */,
        disabled: __classPrivateFieldGet(this, _Button_props, "f").disabled,
        spinner: true,
    };
    const jslog = __classPrivateFieldGet(this, _Button_props, "f").jslogContext && VisualLogging.action().track({ click: true }).context(__classPrivateFieldGet(this, _Button_props, "f").jslogContext);
    // clang-format off
    Lit.render(html `
        <style>${buttonStyles}</style>
        <button title=${ifDefined(__classPrivateFieldGet(this, _Button_props, "f").title)}
                .disabled=${__classPrivateFieldGet(this, _Button_props, "f").disabled}
                class=${classMap(classes)}
                aria-pressed=${ifDefined(__classPrivateFieldGet(this, _Button_props, "f").toggled)}
                jslog=${ifDefined(jslog)}>
          ${hasIcon ? html `
            <devtools-icon name=${ifDefined(__classPrivateFieldGet(this, _Button_props, "f").toggled ? __classPrivateFieldGet(this, _Button_props, "f").toggledIconName : __classPrivateFieldGet(this, _Button_props, "f").iconName)}>
            </devtools-icon>`
        : ''}
          ${__classPrivateFieldGet(this, _Button_props, "f").longClickable ? html `
              <devtools-icon name=${'triangle-bottom-right'} class="long-click">
              </devtools-icon>`
        : ''}
          ${__classPrivateFieldGet(this, _Button_props, "f").spinner ? html `<span class=${classMap(spinnerClasses)}></span>` : ''}
          <slot @slotchange=${__classPrivateFieldGet(this, _Button_instances, "m", _Button_render)} ${ref(__classPrivateFieldGet(this, _Button_slotRef, "f"))}></slot>
        </button>
      `, __classPrivateFieldGet(this, _Button_shadow, "f"), { host: this });
    // clang-format on
};
Button.formAssociated = true;
customElements.define('devtools-button', Button);
//# sourceMappingURL=Button.js.map