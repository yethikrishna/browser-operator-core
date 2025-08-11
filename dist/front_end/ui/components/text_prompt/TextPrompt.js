// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _TextPrompt_instances, _TextPrompt_shadow, _TextPrompt_ariaLabelText, _TextPrompt_prefixText, _TextPrompt_suggestionText, _TextPrompt_input, _TextPrompt_suggestion, _TextPrompt_text, _TextPrompt_render;
import * as Platform from '../../../core/platform/platform.js';
import { html, render } from '../../lit/lit.js';
import textPromptStyles from './textPrompt.css.js';
export class PromptInputEvent extends Event {
    constructor(value) {
        super(PromptInputEvent.eventName);
        this.data = value;
    }
}
PromptInputEvent.eventName = 'promptinputchanged';
export class TextPrompt extends HTMLElement {
    constructor() {
        super(...arguments);
        _TextPrompt_instances.add(this);
        _TextPrompt_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _TextPrompt_ariaLabelText.set(this, '');
        _TextPrompt_prefixText.set(this, '');
        _TextPrompt_suggestionText.set(this, '');
    }
    set data(data) {
        __classPrivateFieldSet(this, _TextPrompt_ariaLabelText, data.ariaLabel, "f");
        __classPrivateFieldSet(this, _TextPrompt_prefixText, data.prefix, "f");
        __classPrivateFieldSet(this, _TextPrompt_suggestionText, data.suggestion, "f");
        __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_render).call(this);
    }
    get data() {
        return {
            ariaLabel: __classPrivateFieldGet(this, _TextPrompt_ariaLabelText, "f"),
            prefix: __classPrivateFieldGet(this, _TextPrompt_prefixText, "f"),
            suggestion: __classPrivateFieldGet(this, _TextPrompt_suggestionText, "f"),
        };
    }
    focus() {
        __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_input).call(this).focus();
    }
    moveCaretToEndOfInput() {
        this.setSelectedRange(__classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_text).call(this).length, __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_text).call(this).length);
    }
    onKeyDown(event) {
        if (event.key === Platform.KeyboardUtilities.ENTER_KEY) {
            event.preventDefault();
        }
    }
    setSelectedRange(startIndex, endIndex) {
        if (startIndex < 0) {
            throw new RangeError('Selected range start must be a nonnegative integer');
        }
        const textContentLength = __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_text).call(this).length;
        if (endIndex > textContentLength) {
            endIndex = textContentLength;
        }
        if (endIndex < startIndex) {
            endIndex = startIndex;
        }
        __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_input).call(this).setSelectionRange(startIndex, endIndex);
    }
    setPrefix(prefix) {
        __classPrivateFieldSet(this, _TextPrompt_prefixText, prefix, "f");
        __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_render).call(this);
    }
    setSuggestion(suggestion) {
        __classPrivateFieldSet(this, _TextPrompt_suggestionText, suggestion, "f");
        __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_suggestion).call(this).value = __classPrivateFieldGet(this, _TextPrompt_suggestionText, "f");
        __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_render).call(this);
    }
    setText(text) {
        __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_input).call(this).value = text;
        if (__classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_input).call(this).hasFocus()) {
            this.moveCaretToEndOfInput();
            __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_input).call(this).scrollIntoView();
        }
    }
    connectedCallback() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
                    const writingDirection = __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_input).call(this).getAttribute('dir');
                    if (!writingDirection) {
                        __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_suggestion).call(this).removeAttribute('dir');
                        return;
                    }
                    __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_suggestion).call(this).setAttribute('dir', writingDirection);
                }
            }
        });
        observer.observe(__classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_input).call(this), { attributeFilter: ['dir'] });
    }
}
_TextPrompt_shadow = new WeakMap(), _TextPrompt_ariaLabelText = new WeakMap(), _TextPrompt_prefixText = new WeakMap(), _TextPrompt_suggestionText = new WeakMap(), _TextPrompt_instances = new WeakSet(), _TextPrompt_input = function _TextPrompt_input() {
    const inputElement = __classPrivateFieldGet(this, _TextPrompt_shadow, "f").querySelector('.input');
    if (!inputElement) {
        throw new Error('Expected an input element!');
    }
    return inputElement;
}, _TextPrompt_suggestion = function _TextPrompt_suggestion() {
    const suggestionElement = __classPrivateFieldGet(this, _TextPrompt_shadow, "f").querySelector('.suggestion');
    if (!suggestionElement) {
        throw new Error('Expected an suggestion element!');
    }
    return suggestionElement;
}, _TextPrompt_text = function _TextPrompt_text() {
    return __classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_input).call(this).value || '';
}, _TextPrompt_render = function _TextPrompt_render() {
    // clang-format off
    const output = html `
      <style>${textPromptStyles}</style>
      <span class="prefix">${__classPrivateFieldGet(this, _TextPrompt_prefixText, "f")} </span>
      <span class="text-prompt-input">
        <input
            class="input" aria-label=${__classPrivateFieldGet(this, _TextPrompt_ariaLabelText, "f")} spellcheck="false"
            @input=${() => this.dispatchEvent(new PromptInputEvent(__classPrivateFieldGet(this, _TextPrompt_instances, "m", _TextPrompt_text).call(this)))}
            @keydown=${this.onKeyDown}>
        <input class="suggestion" tabindex=-1 aria-label=${__classPrivateFieldGet(this, _TextPrompt_ariaLabelText, "f") + ' Suggestion'}>
      </span>`;
    // clang-format on
    render(output, __classPrivateFieldGet(this, _TextPrompt_shadow, "f"), { host: this });
};
customElements.define('devtools-text-prompt', TextPrompt);
//# sourceMappingURL=TextPrompt.js.map