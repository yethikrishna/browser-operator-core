// Copyright (c) 2015 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _AnimationGroupPreviewUI_view, _AnimationGroupPreviewUI_viewOutput, _AnimationGroupPreviewUI_config, _AnimationGroupPreviewUI_previewAnimationDisabled, _AnimationGroupPreviewUI_selected, _AnimationGroupPreviewUI_paused, _AnimationGroupPreviewUI_focusable;
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { AnimationUI } from './AnimationUI.js';
const { render, html, svg, Directives: { classMap, ref } } = Lit;
const VIEW_BOX_HEIGHT = 32;
const MAX_ANIMATION_LINES_TO_SHOW = 10;
const MIN_ANIMATION_GROUP_DURATION = 750;
const DEFAULT_VIEW = (input, output, target) => {
    const classes = classMap({
        'animation-buffer-preview': true,
        selected: input.isSelected,
        paused: input.isPaused,
        'no-animation': input.isPreviewAnimationDisabled,
    });
    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'Backspace':
            case 'Delete':
                input.onRemoveAnimationGroup();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                input.onFocusPreviousGroup();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                input.onFocusNextGroup();
        }
    };
    const renderAnimationLines = () => {
        const timeToPixelRatio = 100 / Math.max(input.animationGroupDuration, MIN_ANIMATION_GROUP_DURATION);
        const viewBox = `0 0 100 ${VIEW_BOX_HEIGHT}`;
        const lines = input.animations.map((animation, index) => {
            const xStartPoint = animation.delayOrStartTime();
            const xEndPoint = xStartPoint + animation.iterationDuration();
            const yPoint = Math.floor(VIEW_BOX_HEIGHT / Math.max(6, input.animations.length) * index + 1);
            const colorForAnimation = AnimationUI.colorForAnimation(animation);
            // clang-format off
            return svg `<line
        x1="${xStartPoint * timeToPixelRatio}"
        x2="${xEndPoint * timeToPixelRatio}"
        y1="${yPoint}"
        y2="${yPoint}"
        style="stroke: ${colorForAnimation}"></line>`;
            // clang-format on
        });
        // clang-format off
        return html `
      <svg
        width="100%"
        height="100%"
        viewBox=${viewBox}
        preserveAspectRatio="none"
        shape-rendering="crispEdges">
        ${lines}
      </svg>
    `;
        // clang-format on
    };
    // clang-format off
    render(html `
    <div class="animation-group-preview-ui">
      <button
        jslog=${VisualLogging.item(`animations.buffer-preview${input.isScrollDrivenAnimationGroup ? '-sda' : ''}`).track({ click: true })}
        class=${classes}
        role="option"
        aria-label=${input.label}
        tabindex=${input.isFocusable ? 0 : -1}
        @keydown=${handleKeyDown}
        @click=${input.onSelectAnimationGroup}
        @animationend=${input.onPreviewAnimationEnd}
        ${ref(el => {
        if (el instanceof HTMLElement) {
            output.focus = () => {
                el.focus();
            };
        }
    })}>
          <div class="animation-paused fill"></div>
          <devtools-icon name=${input.isScrollDrivenAnimationGroup ? 'mouse' : 'watch'} class="preview-icon"></devtools-icon>
          <div class="animation-buffer-preview-animation" ${ref(el => {
        if (el instanceof HTMLElement) {
            output.replay = () => {
                el.animate([
                    { offset: 0, width: '0%', opacity: 1 },
                    { offset: 0.9, width: '100%', opacity: 1 },
                    { offset: 1, width: '100%', opacity: 0 },
                ], { duration: 200, easing: 'cubic-bezier(0, 0, 0.2, 1)' });
            };
        }
    })}></div>
          ${renderAnimationLines()}
        </button>
        <button
          class="animation-remove-button"
          jslog=${VisualLogging.action('animations.remove-preview').track({ click: true })}
          @click=${input.onRemoveAnimationGroup}>
            <devtools-icon name="cross"></devtools-icon>
        </button>
    </div>
  `, target, { host: input });
    // clang-format on
};
export class AnimationGroupPreviewUI extends UI.Widget.Widget {
    constructor(config, view = DEFAULT_VIEW) {
        super();
        _AnimationGroupPreviewUI_view.set(this, void 0);
        _AnimationGroupPreviewUI_viewOutput.set(this, {});
        _AnimationGroupPreviewUI_config.set(this, void 0);
        _AnimationGroupPreviewUI_previewAnimationDisabled.set(this, false);
        _AnimationGroupPreviewUI_selected.set(this, false);
        _AnimationGroupPreviewUI_paused.set(this, false);
        _AnimationGroupPreviewUI_focusable.set(this, false);
        __classPrivateFieldSet(this, _AnimationGroupPreviewUI_view, view, "f");
        __classPrivateFieldSet(this, _AnimationGroupPreviewUI_config, config, "f");
        this.requestUpdate();
    }
    setSelected(selected) {
        if (__classPrivateFieldGet(this, _AnimationGroupPreviewUI_selected, "f") === selected) {
            return;
        }
        __classPrivateFieldSet(this, _AnimationGroupPreviewUI_selected, selected, "f");
        this.requestUpdate();
    }
    setPaused(paused) {
        if (__classPrivateFieldGet(this, _AnimationGroupPreviewUI_paused, "f") === paused) {
            return;
        }
        __classPrivateFieldSet(this, _AnimationGroupPreviewUI_paused, paused, "f");
        this.requestUpdate();
    }
    setFocusable(focusable) {
        if (__classPrivateFieldGet(this, _AnimationGroupPreviewUI_focusable, "f") === focusable) {
            return;
        }
        __classPrivateFieldSet(this, _AnimationGroupPreviewUI_focusable, focusable, "f");
        this.requestUpdate();
    }
    performUpdate() {
        __classPrivateFieldGet(this, _AnimationGroupPreviewUI_view, "f").call(this, {
            isScrollDrivenAnimationGroup: __classPrivateFieldGet(this, _AnimationGroupPreviewUI_config, "f").animationGroup.isScrollDriven(),
            isPreviewAnimationDisabled: __classPrivateFieldGet(this, _AnimationGroupPreviewUI_previewAnimationDisabled, "f"),
            isSelected: __classPrivateFieldGet(this, _AnimationGroupPreviewUI_selected, "f"),
            isPaused: __classPrivateFieldGet(this, _AnimationGroupPreviewUI_paused, "f"),
            isFocusable: __classPrivateFieldGet(this, _AnimationGroupPreviewUI_focusable, "f"),
            label: __classPrivateFieldGet(this, _AnimationGroupPreviewUI_config, "f").label,
            animationGroupDuration: __classPrivateFieldGet(this, _AnimationGroupPreviewUI_config, "f").animationGroup.groupDuration(),
            animations: __classPrivateFieldGet(this, _AnimationGroupPreviewUI_config, "f").animationGroup.animations().slice(0, MAX_ANIMATION_LINES_TO_SHOW),
            onPreviewAnimationEnd: () => {
                __classPrivateFieldSet(this, _AnimationGroupPreviewUI_previewAnimationDisabled, true, "f");
                this.requestUpdate();
            },
            onRemoveAnimationGroup: () => {
                __classPrivateFieldGet(this, _AnimationGroupPreviewUI_config, "f").onRemoveAnimationGroup();
            },
            onSelectAnimationGroup: () => {
                __classPrivateFieldGet(this, _AnimationGroupPreviewUI_config, "f").onSelectAnimationGroup();
            },
            onFocusNextGroup: () => {
                __classPrivateFieldGet(this, _AnimationGroupPreviewUI_config, "f").onFocusNextGroup();
            },
            onFocusPreviousGroup: () => {
                __classPrivateFieldGet(this, _AnimationGroupPreviewUI_config, "f").onFocusPreviousGroup();
            }
        }, __classPrivateFieldGet(this, _AnimationGroupPreviewUI_viewOutput, "f"), this.contentElement);
    }
    focus() {
        __classPrivateFieldGet(this, _AnimationGroupPreviewUI_viewOutput, "f").focus?.();
    }
    replay() {
        __classPrivateFieldGet(this, _AnimationGroupPreviewUI_viewOutput, "f").replay?.();
    }
}
_AnimationGroupPreviewUI_view = new WeakMap(), _AnimationGroupPreviewUI_viewOutput = new WeakMap(), _AnimationGroupPreviewUI_config = new WeakMap(), _AnimationGroupPreviewUI_previewAnimationDisabled = new WeakMap(), _AnimationGroupPreviewUI_selected = new WeakMap(), _AnimationGroupPreviewUI_paused = new WeakMap(), _AnimationGroupPreviewUI_focusable = new WeakMap();
//# sourceMappingURL=AnimationGroupPreviewUI.js.map