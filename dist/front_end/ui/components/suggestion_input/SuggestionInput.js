// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var _EditableContent_instances, _EditableContent_mimeType, _EditableContent_highlight, _SuggestionBox_instances, _SuggestionBox_suggestions, _SuggestionBox_handleKeyDownEvent, _SuggestionBox_moveCursor, _SuggestionBox_dispatchSuggestEvent, _SuggestionInput_instances, _SuggestionInput_cachedEditableContent, _SuggestionInput_editableContent_get, _SuggestionInput_handleBlurEvent, _SuggestionInput_handleFocusEvent, _SuggestionInput_handleKeyDownEvent, _SuggestionInput_handleInputEvent, _SuggestionInput_handleSuggestionInitEvent, _SuggestionInput_handleSuggestEvent;
import * as CodeHighlighter from '../../../ui/components/code_highlighter/code_highlighter.js';
import codeHighlighterStyles from '../../../ui/components/code_highlighter/codeHighlighter.css.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import contentEditableStyles from './suggestionInput.css.js';
const mod = (a, n) => {
    return ((a % n) + n) % n;
};
function assert(predicate, message = 'Assertion failed!') {
    if (!predicate) {
        throw new Error(message);
    }
}
const { html, Decorators, Directives, LitElement } = Lit;
const { customElement, property, state } = Decorators;
const { classMap } = Directives;
const jsonPropertyOptions = {
    hasChanged(value, oldValue) {
        return JSON.stringify(value) !== JSON.stringify(oldValue);
    },
    attribute: false,
};
let EditableContent = class EditableContent extends HTMLElement {
    static get observedAttributes() {
        return ['disabled', 'placeholder'];
    }
    set disabled(disabled) {
        this.contentEditable = String(!disabled);
    }
    get disabled() {
        return this.contentEditable !== 'true';
    }
    set value(value) {
        this.innerText = value;
        __classPrivateFieldGet(this, _EditableContent_instances, "m", _EditableContent_highlight).call(this);
    }
    get value() {
        return this.innerText;
    }
    set mimeType(type) {
        __classPrivateFieldSet(this, _EditableContent_mimeType, type, "f");
        __classPrivateFieldGet(this, _EditableContent_instances, "m", _EditableContent_highlight).call(this);
    }
    get mimeType() {
        return __classPrivateFieldGet(this, _EditableContent_mimeType, "f");
    }
    constructor() {
        super();
        _EditableContent_instances.add(this);
        _EditableContent_mimeType.set(this, '');
        this.contentEditable = 'true';
        this.tabIndex = 0;
        this.addEventListener('focus', () => {
            this.innerHTML = this.innerText;
        });
        this.addEventListener('blur', __classPrivateFieldGet(this, _EditableContent_instances, "m", _EditableContent_highlight).bind(this));
    }
    attributeChangedCallback(name, _, value) {
        switch (name) {
            case 'disabled':
                this.disabled = value !== null;
                break;
        }
    }
};
_EditableContent_mimeType = new WeakMap();
_EditableContent_instances = new WeakSet();
_EditableContent_highlight = function _EditableContent_highlight() {
    if (__classPrivateFieldGet(this, _EditableContent_mimeType, "f")) {
        void CodeHighlighter.CodeHighlighter.highlightNode(this, __classPrivateFieldGet(this, _EditableContent_mimeType, "f"));
    }
};
EditableContent = __decorate([
    customElement('devtools-editable-content'),
    __metadata("design:paramtypes", [])
], EditableContent);
/**
 * Contains a suggestion emitted due to action by the user.
 */
class SuggestEvent extends Event {
    constructor(suggestion) {
        super(SuggestEvent.eventName);
        this.suggestion = suggestion;
    }
}
SuggestEvent.eventName = 'suggest';
/**
 * Parents should listen for this event and register the listeners provided by
 * this event.
 */
class SuggestionInitEvent extends Event {
    constructor(listeners) {
        super(SuggestionInitEvent.eventName);
        this.listeners = listeners;
    }
}
SuggestionInitEvent.eventName = 'suggestioninit';
const defaultSuggestionFilter = (option, query) => option.toLowerCase().startsWith(query.toLowerCase());
/**
 * @fires SuggestionInitEvent#suggestioninit
 * @fires SuggestEvent#suggest
 */
let SuggestionBox = class SuggestionBox extends LitElement {
    constructor() {
        super();
        _SuggestionBox_instances.add(this);
        _SuggestionBox_suggestions.set(this, []);
        _SuggestionBox_handleKeyDownEvent.set(this, (event) => {
            assert(event instanceof KeyboardEvent, 'Bound to the wrong event.');
            if (__classPrivateFieldGet(this, _SuggestionBox_suggestions, "f").length > 0) {
                switch (event.key) {
                    case 'ArrowDown':
                        event.stopPropagation();
                        event.preventDefault();
                        __classPrivateFieldGet(this, _SuggestionBox_instances, "m", _SuggestionBox_moveCursor).call(this, 1);
                        break;
                    case 'ArrowUp':
                        event.stopPropagation();
                        event.preventDefault();
                        __classPrivateFieldGet(this, _SuggestionBox_instances, "m", _SuggestionBox_moveCursor).call(this, -1);
                        break;
                }
            }
            switch (event.key) {
                case 'Enter':
                    if (__classPrivateFieldGet(this, _SuggestionBox_suggestions, "f")[this.cursor]) {
                        __classPrivateFieldGet(this, _SuggestionBox_instances, "m", _SuggestionBox_dispatchSuggestEvent).call(this, __classPrivateFieldGet(this, _SuggestionBox_suggestions, "f")[this.cursor]);
                    }
                    event.preventDefault();
                    break;
            }
        });
        this.options = [];
        this.expression = '';
        this.cursor = 0;
    }
    connectedCallback() {
        super.connectedCallback();
        this.dispatchEvent(new SuggestionInitEvent([['keydown', __classPrivateFieldGet(this, _SuggestionBox_handleKeyDownEvent, "f")]]));
    }
    willUpdate(changedProperties) {
        if (changedProperties.has('options')) {
            this.options = Object.freeze([...this.options].sort());
        }
        if (changedProperties.has('expression') || changedProperties.has('options')) {
            this.cursor = 0;
            __classPrivateFieldSet(this, _SuggestionBox_suggestions, this.options.filter(option => (this.suggestionFilter || defaultSuggestionFilter)(option, this.expression)), "f");
        }
    }
    render() {
        if (__classPrivateFieldGet(this, _SuggestionBox_suggestions, "f").length === 0) {
            return;
        }
        return html `<style>${contentEditableStyles}</style><ul class="suggestions">
      ${__classPrivateFieldGet(this, _SuggestionBox_suggestions, "f").map((suggestion, index) => {
            return html `<li
          class=${classMap({
                selected: index === this.cursor,
            })}
          @mousedown=${__classPrivateFieldGet(this, _SuggestionBox_instances, "m", _SuggestionBox_dispatchSuggestEvent).bind(this, suggestion)}
          jslog=${VisualLogging.item('suggestion').track({
                click: true,
            })}
        >
          ${suggestion}
        </li>`;
        })}
    </ul>`;
    }
};
_SuggestionBox_suggestions = new WeakMap();
_SuggestionBox_handleKeyDownEvent = new WeakMap();
_SuggestionBox_instances = new WeakSet();
_SuggestionBox_moveCursor = function _SuggestionBox_moveCursor(delta) {
    this.cursor = mod(this.cursor + delta, __classPrivateFieldGet(this, _SuggestionBox_suggestions, "f").length);
};
_SuggestionBox_dispatchSuggestEvent = function _SuggestionBox_dispatchSuggestEvent(suggestion) {
    this.dispatchEvent(new SuggestEvent(suggestion));
};
__decorate([
    property(jsonPropertyOptions),
    __metadata("design:type", Array)
], SuggestionBox.prototype, "options", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], SuggestionBox.prototype, "expression", void 0);
__decorate([
    property(),
    __metadata("design:type", Function)
], SuggestionBox.prototype, "suggestionFilter", void 0);
__decorate([
    state(),
    __metadata("design:type", Number)
], SuggestionBox.prototype, "cursor", void 0);
SuggestionBox = __decorate([
    customElement('devtools-suggestion-box'),
    __metadata("design:paramtypes", [])
], SuggestionBox);
let SuggestionInput = class SuggestionInput extends LitElement {
    constructor() {
        super();
        _SuggestionInput_instances.add(this);
        _SuggestionInput_cachedEditableContent.set(this, void 0);
        _SuggestionInput_handleBlurEvent.set(this, () => {
            window.getSelection()?.removeAllRanges();
            this.value = __classPrivateFieldGet(this, _SuggestionInput_instances, "a", _SuggestionInput_editableContent_get).value;
            this.expression = __classPrivateFieldGet(this, _SuggestionInput_instances, "a", _SuggestionInput_editableContent_get).value;
        });
        _SuggestionInput_handleFocusEvent.set(this, (event) => {
            assert(event.target instanceof Node);
            const range = document.createRange();
            range.selectNodeContents(event.target);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });
        _SuggestionInput_handleKeyDownEvent.set(this, (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });
        _SuggestionInput_handleInputEvent.set(this, (event) => {
            this.expression = event.target.value;
        });
        _SuggestionInput_handleSuggestionInitEvent.set(this, (event) => {
            for (const [name, listener] of event.listeners) {
                this.addEventListener(name, listener);
            }
        });
        _SuggestionInput_handleSuggestEvent.set(this, (event) => {
            __classPrivateFieldGet(this, _SuggestionInput_instances, "a", _SuggestionInput_editableContent_get).value = event.suggestion;
            // If actions result in a `focus` after this blur, then the blur won't
            // happen. `setTimeout` guarantees `blur` will always come after `focus`.
            setTimeout(this.blur.bind(this), 0);
        });
        this.options = [];
        this.expression = '';
        this.placeholder = '';
        this.value = '';
        this.disabled = false;
        this.strikethrough = true;
        this.mimeType = '';
        this.autocomplete = true;
        this.addEventListener('blur', __classPrivateFieldGet(this, _SuggestionInput_handleBlurEvent, "f"));
        let jslog = VisualLogging.value().track({ keydown: 'ArrowUp|ArrowDown|Enter', change: true, click: true });
        if (this.jslogContext) {
            jslog = jslog.context(this.jslogContext);
        }
        this.setAttribute('jslog', jslog.toString());
    }
    willUpdate(properties) {
        if (properties.has('value')) {
            this.expression = this.value;
        }
    }
    render() {
        // clang-format off
        return html `<style>${contentEditableStyles}</style>
      <style>${codeHighlighterStyles}</style>
      <devtools-editable-content
        ?disabled=${this.disabled}
        class=${classMap({
            strikethrough: !this.strikethrough,
        })}
        .enterKeyHint=${'done'}
        .value=${this.value}
        .mimeType=${this.mimeType}
        @focus=${__classPrivateFieldGet(this, _SuggestionInput_handleFocusEvent, "f")}
        @input=${__classPrivateFieldGet(this, _SuggestionInput_handleInputEvent, "f")}
        @keydown=${__classPrivateFieldGet(this, _SuggestionInput_handleKeyDownEvent, "f")}
        autocapitalize="off"
        inputmode="text"
        placeholder=${this.placeholder}
        spellcheck="false"
      ></devtools-editable-content>
      <devtools-suggestion-box
        @suggestioninit=${__classPrivateFieldGet(this, _SuggestionInput_handleSuggestionInitEvent, "f")}
        @suggest=${__classPrivateFieldGet(this, _SuggestionInput_handleSuggestEvent, "f")}
        .options=${this.options}
        .suggestionFilter=${this.suggestionFilter}
        .expression=${this.autocomplete ? this.expression : ''}
      ></devtools-suggestion-box>`;
        // clang-format on
    }
};
_SuggestionInput_cachedEditableContent = new WeakMap();
_SuggestionInput_handleBlurEvent = new WeakMap();
_SuggestionInput_handleFocusEvent = new WeakMap();
_SuggestionInput_handleKeyDownEvent = new WeakMap();
_SuggestionInput_handleInputEvent = new WeakMap();
_SuggestionInput_handleSuggestionInitEvent = new WeakMap();
_SuggestionInput_handleSuggestEvent = new WeakMap();
_SuggestionInput_instances = new WeakSet();
_SuggestionInput_editableContent_get = function _SuggestionInput_editableContent_get() {
    if (__classPrivateFieldGet(this, _SuggestionInput_cachedEditableContent, "f")) {
        return __classPrivateFieldGet(this, _SuggestionInput_cachedEditableContent, "f");
    }
    const node = this.renderRoot.querySelector('devtools-editable-content');
    if (!node) {
        throw new Error('Attempted to query node before rendering.');
    }
    __classPrivateFieldSet(this, _SuggestionInput_cachedEditableContent, node, "f");
    return node;
};
SuggestionInput.shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
};
__decorate([
    property(jsonPropertyOptions),
    __metadata("design:type", Array)
], SuggestionInput.prototype, "options", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], SuggestionInput.prototype, "autocomplete", void 0);
__decorate([
    property(),
    __metadata("design:type", Function)
], SuggestionInput.prototype, "suggestionFilter", void 0);
__decorate([
    state(),
    __metadata("design:type", String)
], SuggestionInput.prototype, "expression", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], SuggestionInput.prototype, "placeholder", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], SuggestionInput.prototype, "value", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], SuggestionInput.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], SuggestionInput.prototype, "strikethrough", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], SuggestionInput.prototype, "mimeType", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], SuggestionInput.prototype, "jslogContext", void 0);
SuggestionInput = __decorate([
    customElement('devtools-suggestion-input'),
    __metadata("design:paramtypes", [])
], SuggestionInput);
export { SuggestionInput };
//# sourceMappingURL=SuggestionInput.js.map