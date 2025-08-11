// Copyright (c) 2015 The Chromium Authors. All rights reserved.
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
var _AnimationTimeline_instances, _AnimationTimeline_gridWrapper, _AnimationTimeline_grid, _AnimationTimeline_playbackRate, _AnimationTimeline_allPaused, _AnimationTimeline_animationsContainer, _AnimationTimeline_previewContainer, _AnimationTimeline_timelineScrubber, _AnimationTimeline_currentTime, _AnimationTimeline_clearButton, _AnimationTimeline_selectedGroup, _AnimationTimeline_renderQueue, _AnimationTimeline_defaultDuration, _AnimationTimeline_durationInternal, _AnimationTimeline_timelineControlsWidth, _AnimationTimeline_nodesMap, _AnimationTimeline_uiAnimations, _AnimationTimeline_groupBuffer, _AnimationTimeline_previewMap, _AnimationTimeline_animationsMap, _AnimationTimeline_timelineScrubberLine, _AnimationTimeline_pauseButton, _AnimationTimeline_controlButton, _AnimationTimeline_controlState, _AnimationTimeline_redrawing, _AnimationTimeline_cachedTimelineWidth, _AnimationTimeline_scrubberPlayer, _AnimationTimeline_gridOffsetLeft, _AnimationTimeline_originalScrubberTime, _AnimationTimeline_animationGroupPausedBeforeScrub, _AnimationTimeline_originalMousePosition, _AnimationTimeline_timelineControlsResizer, _AnimationTimeline_gridHeader, _AnimationTimeline_scrollListenerId, _AnimationTimeline_collectedGroups, _AnimationTimeline_createPreviewForCollectedGroupsThrottler, _AnimationTimeline_animationGroupUpdatedThrottler, _AnimationTimeline_toolbarViewContainer, _AnimationTimeline_toolbarView, _AnimationTimeline_playbackRateButtonsDisabled, _AnimationTimeline_setupTimelineControlsResizer, _AnimationTimeline_addExistingAnimationGroups, _AnimationTimeline_showPanelInDrawer, _AnimationTimeline_scrubberCurrentTime, _NodeUI_description, _NodeUI_timelineElement, _NodeUI_overlayElement, _NodeUI_node;
/* The following disable is needed until all the partial view functions are part of one view function */
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
import '../../ui/legacy/legacy.js';
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { AnimationGroupPreviewUI } from './AnimationGroupPreviewUI.js';
import animationTimelineStyles from './animationTimeline.css.js';
import { AnimationUI } from './AnimationUI.js';
const UIStrings = {
    /**
     *@description Timeline hint text content in Animation Timeline of the Animation Inspector if no effect
     * is shown.
     * Animation effects are the visual effects of an animation on the page.
     */
    noEffectSelected: 'No animation effect selected',
    /**
     *@description Timeline hint text content in Animation Timeline of the Animation Inspector that instructs
     * users to select an effect.
     * Animation effects are the visual effects of an animation on the page.
     */
    selectAnEffectAboveToInspectAnd: 'Select an effect above to inspect and modify',
    /**
     *@description Text to clear everything
     */
    clearAll: 'Clear all',
    /**
     *@description Tooltip text that appears when hovering over largeicon pause button in Animation Timeline of the Animation Inspector
     */
    pauseAll: 'Pause all',
    /**
     *@description Title of the playback rate button listbox
     */
    playbackRates: 'Playback rates',
    /**
     *@description Text in Animation Timeline of the Animation Inspector
     *@example {50} PH1
     */
    playbackRatePlaceholder: '{PH1}%',
    /**
     *@description Text of an item that pause the running task
     */
    pause: 'Pause',
    /**
     *@description Button title in Animation Timeline of the Animation Inspector
     *@example {50%} PH1
     */
    setSpeedToS: 'Set speed to {PH1}',
    /**
     *@description Title of Animation Previews listbox
     */
    animationPreviews: 'Animation previews',
    /**
     *@description Empty buffer hint text content in Animation Timeline of the Animation Inspector.
     */
    waitingForAnimations: 'Currently waiting for animations',
    /**
     *@description Empty buffer hint text content in Animation Timeline of the Animation Inspector that explains the panel.
     */
    animationDescription: 'On this page you can inspect and modify animations.',
    /**
     *@description Tooltip text that appears when hovering over largeicon replay animation button in Animation Timeline of the Animation Inspector
     */
    replayTimeline: 'Replay timeline',
    /**
     *@description Text in Animation Timeline of the Animation Inspector
     */
    resumeAll: 'Resume all',
    /**
     *@description Title of control button in animation timeline of the animation inspector
     */
    playTimeline: 'Play timeline',
    /**
     *@description Title of control button in animation timeline of the animation inspector
     */
    pauseTimeline: 'Pause timeline',
    /**
     *@description Title of a specific Animation Preview
     *@example {1} PH1
     */
    animationPreviewS: 'Animation Preview {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('panels/animation/AnimationTimeline.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
const { render, html, Directives: { classMap } } = Lit;
const nodeUIsByNode = new WeakMap();
const MIN_TIMELINE_CONTROLS_WIDTH = 120;
const DEFAULT_TIMELINE_CONTROLS_WIDTH = 150;
const MAX_TIMELINE_CONTROLS_WIDTH = 720;
const ANIMATION_EXPLANATION_URL = 'https://developer.chrome.com/docs/devtools/css/animations';
// clang-format off
const DEFAULT_TOOLBAR_VIEW = (input, output, target) => {
    const renderPlaybackRateControl = () => {
        const focusNextPlaybackRateButton = (eventTarget, focusPrevious) => {
            const currentPlaybackRateButton = eventTarget;
            const currentPlaybackRate = Number(currentPlaybackRateButton.dataset.playbackRate);
            if (Number.isNaN(currentPlaybackRate)) {
                return;
            }
            const currentIndex = GlobalPlaybackRates.indexOf(currentPlaybackRate);
            const nextIndex = focusPrevious ? currentIndex - 1 : currentIndex + 1;
            if (nextIndex < 0 || nextIndex >= GlobalPlaybackRates.length) {
                return;
            }
            const nextPlaybackRate = GlobalPlaybackRates[nextIndex];
            const nextPlaybackRateButton = target.querySelector(`[data-playback-rate="${nextPlaybackRate}"]`);
            if (!nextPlaybackRateButton) {
                return;
            }
            currentPlaybackRateButton.tabIndex = -1;
            nextPlaybackRateButton.tabIndex = 0;
            nextPlaybackRateButton.focus();
        };
        const handleKeyDown = (event) => {
            const keyboardEvent = event;
            switch (keyboardEvent.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    focusNextPlaybackRateButton(event.target, /* focusPrevious */ true);
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    focusNextPlaybackRateButton(event.target);
                    break;
            }
        };
        return html `
      <div class="animation-playback-rate-control" role="listbox" aria-label=${i18nString(UIStrings.playbackRates)} @keydown=${handleKeyDown}>
        ${GlobalPlaybackRates.map(playbackRate => {
            const isSelected = input.selectedPlaybackRate === playbackRate;
            const textContent = playbackRate ? i18nString(UIStrings.playbackRatePlaceholder, { PH1: playbackRate * 100 }) : i18nString(UIStrings.pause);
            return html `
            <button class="animation-playback-rate-button" jslog=${VisualLogging.action().context(`animations.playback-rate-${playbackRate * 100}`).track({
                click: true,
                keydown: 'ArrowUp|ArrowDown|ArrowLeft|ArrowRight',
            })}
            data-playback-rate=${playbackRate}
            .disabled=${input.playbackRateButtonsDisabled}
            class=${classMap({
                'animation-playback-rate-button': true,
                selected: isSelected,
            })}
            tabindex=${isSelected ? 0 : -1}
            role="option"
            title=${i18nString(UIStrings.setSpeedToS, { PH1: textContent })}
            @click=${() => input.onSetPlaybackRateClick(playbackRate)}>
            ${textContent}
          </button>
          `;
        })}
      </div>
    `;
    };
    render(html `
    <div class="animation-timeline-toolbar-container" role="toolbar" jslog=${VisualLogging.toolbar()}>
      <devtools-toolbar class="animation-timeline-toolbar" role="presentation">
        <devtools-button
          title=${i18nString(UIStrings.clearAll)}
          aria-label=${i18nString(UIStrings.clearAll)}
          .iconName=${'clear'}
          .jslogContext=${'animations.clear'}
          .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
          @click=${input.onClearClick}>
        </devtools-button>
        <div class="toolbar-divider"></div>
        <devtools-button
          title=${i18nString(UIStrings.pauseAll)}
          aria-label=${i18nString(UIStrings.pauseAll)}
          jslog=${
    /* Do not use `.jslogContext` here because we want this to be reported as Toggle */
    VisualLogging.toggle().track({ click: true }).context('animations.pause-resume-all')}
          .iconName=${'pause'}
          .toggledIconName=${'resume'}
          .variant=${"icon_toggle" /* Buttons.Button.Variant.ICON_TOGGLE */}
          .toggleType=${"primary-toggle" /* Buttons.Button.ToggleType.PRIMARY */}
          .toggled=${input.allPaused}
          @click=${input.onTogglePauseAllClick}>
        </devtools-button>
      </devtools-toolbar>
      ${renderPlaybackRateControl()}
    </div>
  `, target, { host: target });
};
// clang-format on
let animationTimelineInstance;
export class AnimationTimeline extends UI.Widget.VBox {
    constructor(toolbarView = DEFAULT_TOOLBAR_VIEW) {
        super(true);
        _AnimationTimeline_instances.add(this);
        _AnimationTimeline_gridWrapper.set(this, void 0);
        _AnimationTimeline_grid.set(this, void 0);
        _AnimationTimeline_playbackRate.set(this, void 0);
        _AnimationTimeline_allPaused.set(this, void 0);
        _AnimationTimeline_animationsContainer.set(this, void 0);
        _AnimationTimeline_previewContainer.set(this, void 0);
        _AnimationTimeline_timelineScrubber.set(this, void 0);
        _AnimationTimeline_currentTime.set(this, void 0);
        _AnimationTimeline_clearButton.set(this, void 0);
        _AnimationTimeline_selectedGroup.set(this, void 0);
        _AnimationTimeline_renderQueue.set(this, void 0);
        _AnimationTimeline_defaultDuration.set(this, void 0);
        _AnimationTimeline_durationInternal.set(this, void 0);
        _AnimationTimeline_timelineControlsWidth.set(this, void 0);
        _AnimationTimeline_nodesMap.set(this, void 0);
        _AnimationTimeline_uiAnimations.set(this, void 0);
        _AnimationTimeline_groupBuffer.set(this, void 0);
        _AnimationTimeline_previewMap.set(this, void 0);
        _AnimationTimeline_animationsMap.set(this, void 0);
        _AnimationTimeline_timelineScrubberLine.set(this, void 0);
        _AnimationTimeline_pauseButton.set(this, void 0);
        _AnimationTimeline_controlButton.set(this, void 0);
        _AnimationTimeline_controlState.set(this, void 0);
        _AnimationTimeline_redrawing.set(this, void 0);
        _AnimationTimeline_cachedTimelineWidth.set(this, void 0);
        _AnimationTimeline_scrubberPlayer.set(this, void 0);
        _AnimationTimeline_gridOffsetLeft.set(this, void 0);
        _AnimationTimeline_originalScrubberTime.set(this, void 0);
        _AnimationTimeline_animationGroupPausedBeforeScrub.set(this, void 0);
        _AnimationTimeline_originalMousePosition.set(this, void 0);
        _AnimationTimeline_timelineControlsResizer.set(this, void 0);
        _AnimationTimeline_gridHeader.set(this, void 0);
        _AnimationTimeline_scrollListenerId.set(this, void 0);
        _AnimationTimeline_collectedGroups.set(this, void 0);
        _AnimationTimeline_createPreviewForCollectedGroupsThrottler.set(this, new Common.Throttler.Throttler(10));
        _AnimationTimeline_animationGroupUpdatedThrottler.set(this, new Common.Throttler.Throttler(10));
        /** Container & state for rendering `toolbarView` */
        _AnimationTimeline_toolbarViewContainer.set(this, void 0);
        _AnimationTimeline_toolbarView.set(this, void 0);
        _AnimationTimeline_playbackRateButtonsDisabled.set(this, false);
        this.registerRequiredCSS(animationTimelineStyles);
        __classPrivateFieldSet(this, _AnimationTimeline_toolbarView, toolbarView, "f");
        this.element.classList.add('animations-timeline');
        this.element.setAttribute('jslog', `${VisualLogging.panel('animations').track({ resize: true })}`);
        __classPrivateFieldSet(this, _AnimationTimeline_timelineControlsResizer, this.contentElement.createChild('div', 'timeline-controls-resizer'), "f");
        __classPrivateFieldSet(this, _AnimationTimeline_gridWrapper, this.contentElement.createChild('div', 'grid-overflow-wrapper'), "f");
        __classPrivateFieldSet(this, _AnimationTimeline_grid, UI.UIUtils.createSVGChild(__classPrivateFieldGet(this, _AnimationTimeline_gridWrapper, "f"), 'svg', 'animation-timeline-grid'), "f");
        __classPrivateFieldSet(this, _AnimationTimeline_playbackRate, 1, "f");
        __classPrivateFieldSet(this, _AnimationTimeline_allPaused, false, "f");
        __classPrivateFieldSet(this, _AnimationTimeline_animationGroupPausedBeforeScrub, false, "f");
        __classPrivateFieldSet(this, _AnimationTimeline_toolbarViewContainer, this.contentElement.createChild('div'), "f");
        this.createHeader();
        __classPrivateFieldSet(this, _AnimationTimeline_animationsContainer, this.contentElement.createChild('div', 'animation-timeline-rows'), "f");
        __classPrivateFieldGet(this, _AnimationTimeline_animationsContainer, "f").setAttribute('jslog', `${VisualLogging.section('animations')}`);
        const emptyBufferHint = this.contentElement.createChild('div', 'animation-timeline-buffer-hint');
        const noAnimationsPlaceholder = new UI.EmptyWidget.EmptyWidget(i18nString(UIStrings.waitingForAnimations), i18nString(UIStrings.animationDescription));
        noAnimationsPlaceholder.link = ANIMATION_EXPLANATION_URL;
        noAnimationsPlaceholder.show(emptyBufferHint);
        const timelineHint = this.contentElement.createChild('div', 'animation-timeline-rows-hint');
        const noEffectSelectedPlaceholder = new UI.EmptyWidget.EmptyWidget(i18nString(UIStrings.noEffectSelected), i18nString(UIStrings.selectAnEffectAboveToInspectAnd));
        noEffectSelectedPlaceholder.show(timelineHint);
        /** @const */ __classPrivateFieldSet(this, _AnimationTimeline_defaultDuration, 100, "f");
        __classPrivateFieldSet(this, _AnimationTimeline_durationInternal, __classPrivateFieldGet(this, _AnimationTimeline_defaultDuration, "f"), "f");
        __classPrivateFieldSet(this, _AnimationTimeline_nodesMap, new Map(), "f");
        __classPrivateFieldSet(this, _AnimationTimeline_uiAnimations, [], "f");
        __classPrivateFieldSet(this, _AnimationTimeline_groupBuffer, [], "f");
        __classPrivateFieldSet(this, _AnimationTimeline_collectedGroups, [], "f");
        __classPrivateFieldSet(this, _AnimationTimeline_previewMap, new Map(), "f");
        __classPrivateFieldSet(this, _AnimationTimeline_animationsMap, new Map(), "f");
        __classPrivateFieldSet(this, _AnimationTimeline_timelineControlsWidth, DEFAULT_TIMELINE_CONTROLS_WIDTH, "f");
        this.element.style.setProperty('--timeline-controls-width', `${__classPrivateFieldGet(this, _AnimationTimeline_timelineControlsWidth, "f")}px`);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMModel.DOMModel, SDK.DOMModel.Events.NodeRemoved, ev => this.markNodeAsRemoved(ev.data.node), this, { scoped: true });
        SDK.TargetManager.TargetManager.instance().observeModels(SDK.AnimationModel.AnimationModel, this, { scoped: true });
        UI.Context.Context.instance().addFlavorChangeListener(SDK.DOMModel.DOMNode, this.nodeChanged, this);
        __classPrivateFieldGet(this, _AnimationTimeline_instances, "m", _AnimationTimeline_setupTimelineControlsResizer).call(this);
        this.performToolbarViewUpdate();
    }
    static instance(opts) {
        if (!animationTimelineInstance || opts?.forceNew) {
            animationTimelineInstance = new AnimationTimeline();
        }
        return animationTimelineInstance;
    }
    get previewMap() {
        return __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f");
    }
    get uiAnimations() {
        return __classPrivateFieldGet(this, _AnimationTimeline_uiAnimations, "f");
    }
    get groupBuffer() {
        return __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f");
    }
    wasShown() {
        super.wasShown();
        for (const animationModel of SDK.TargetManager.TargetManager.instance().models(SDK.AnimationModel.AnimationModel, { scoped: true })) {
            __classPrivateFieldGet(this, _AnimationTimeline_instances, "m", _AnimationTimeline_addExistingAnimationGroups).call(this, animationModel);
            this.addEventListeners(animationModel);
        }
    }
    willHide() {
        for (const animationModel of SDK.TargetManager.TargetManager.instance().models(SDK.AnimationModel.AnimationModel, { scoped: true })) {
            this.removeEventListeners(animationModel);
        }
    }
    async revealAnimationGroup(animationGroup) {
        if (!__classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").has(animationGroup)) {
            await this.addAnimationGroup(animationGroup);
        }
        __classPrivateFieldGet(this, _AnimationTimeline_instances, "m", _AnimationTimeline_showPanelInDrawer).call(this);
        return await this.selectAnimationGroup(animationGroup);
    }
    modelAdded(animationModel) {
        if (this.isShowing()) {
            this.addEventListeners(animationModel);
        }
    }
    modelRemoved(animationModel) {
        this.removeEventListeners(animationModel);
    }
    addEventListeners(animationModel) {
        animationModel.addEventListener(SDK.AnimationModel.Events.AnimationGroupStarted, this.animationGroupStarted, this);
        animationModel.addEventListener(SDK.AnimationModel.Events.AnimationGroupUpdated, this.animationGroupUpdated, this);
        animationModel.addEventListener(SDK.AnimationModel.Events.ModelReset, this.reset, this);
    }
    removeEventListeners(animationModel) {
        animationModel.removeEventListener(SDK.AnimationModel.Events.AnimationGroupStarted, this.animationGroupStarted, this);
        animationModel.removeEventListener(SDK.AnimationModel.Events.AnimationGroupUpdated, this.animationGroupUpdated, this);
        animationModel.removeEventListener(SDK.AnimationModel.Events.ModelReset, this.reset, this);
    }
    nodeChanged() {
        for (const nodeUI of __classPrivateFieldGet(this, _AnimationTimeline_nodesMap, "f").values()) {
            nodeUI.nodeChanged();
        }
    }
    createScrubber() {
        __classPrivateFieldSet(this, _AnimationTimeline_timelineScrubber, document.createElement('div'), "f");
        __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubber, "f").classList.add('animation-scrubber');
        __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubber, "f").classList.add('hidden');
        __classPrivateFieldSet(this, _AnimationTimeline_timelineScrubberLine, __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubber, "f").createChild('div', 'animation-scrubber-line'), "f");
        __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubberLine, "f").createChild('div', 'animation-scrubber-head');
        __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubber, "f").createChild('div', 'animation-time-overlay');
        return __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubber, "f");
    }
    performToolbarViewUpdate() {
        __classPrivateFieldGet(this, _AnimationTimeline_toolbarView, "f").call(this, {
            selectedPlaybackRate: __classPrivateFieldGet(this, _AnimationTimeline_playbackRate, "f"),
            playbackRateButtonsDisabled: __classPrivateFieldGet(this, _AnimationTimeline_playbackRateButtonsDisabled, "f"),
            allPaused: __classPrivateFieldGet(this, _AnimationTimeline_allPaused, "f"),
            onClearClick: () => {
                Host.userMetrics.actionTaken(Host.UserMetrics.Action.AnimationGroupsCleared);
                this.reset();
            },
            onTogglePauseAllClick: () => {
                __classPrivateFieldSet(this, _AnimationTimeline_allPaused, !__classPrivateFieldGet(this, _AnimationTimeline_allPaused, "f"), "f");
                Host.userMetrics.actionTaken(__classPrivateFieldGet(this, _AnimationTimeline_allPaused, "f") ? Host.UserMetrics.Action.AnimationsPaused : Host.UserMetrics.Action.AnimationsResumed);
                this.setPlaybackRate(__classPrivateFieldGet(this, _AnimationTimeline_playbackRate, "f"));
                if (__classPrivateFieldGet(this, _AnimationTimeline_pauseButton, "f")) {
                    __classPrivateFieldGet(this, _AnimationTimeline_pauseButton, "f").setTitle(__classPrivateFieldGet(this, _AnimationTimeline_allPaused, "f") ? i18nString(UIStrings.resumeAll) : i18nString(UIStrings.pauseAll));
                }
            },
            onSetPlaybackRateClick: (playbackRate) => {
                this.setPlaybackRate(playbackRate);
            }
        }, undefined, __classPrivateFieldGet(this, _AnimationTimeline_toolbarViewContainer, "f"));
    }
    createHeader() {
        __classPrivateFieldSet(this, _AnimationTimeline_previewContainer, this.contentElement.createChild('div', 'animation-timeline-buffer'), "f");
        __classPrivateFieldGet(this, _AnimationTimeline_previewContainer, "f").setAttribute('jslog', `${VisualLogging.section('film-strip')}`);
        UI.ARIAUtils.markAsListBox(__classPrivateFieldGet(this, _AnimationTimeline_previewContainer, "f"));
        UI.ARIAUtils.setLabel(__classPrivateFieldGet(this, _AnimationTimeline_previewContainer, "f"), i18nString(UIStrings.animationPreviews));
        const container = this.contentElement.createChild('div', 'animation-timeline-header');
        const controls = container.createChild('div', 'animation-controls');
        __classPrivateFieldSet(this, _AnimationTimeline_currentTime, controls.createChild('div', 'animation-timeline-current-time monospace'), "f");
        const toolbar = controls.createChild('devtools-toolbar', 'animation-controls-toolbar');
        __classPrivateFieldSet(this, _AnimationTimeline_controlButton, new UI.Toolbar.ToolbarButton(i18nString(UIStrings.replayTimeline), 'replay', undefined, 'animations.play-replay-pause-animation-group'), "f");
        __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").element.classList.add('toolbar-state-on');
        __classPrivateFieldSet(this, _AnimationTimeline_controlState, "replay-outline" /* ControlState.REPLAY */, "f");
        __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").addEventListener("Click" /* UI.Toolbar.ToolbarButton.Events.CLICK */, this.controlButtonToggle.bind(this));
        toolbar.appendToolbarItem(__classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f"));
        __classPrivateFieldSet(this, _AnimationTimeline_gridHeader, container.createChild('div', 'animation-grid-header'), "f");
        __classPrivateFieldGet(this, _AnimationTimeline_gridHeader, "f").setAttribute('jslog', `${VisualLogging.timeline('animations.grid-header').track({ drag: true, click: true })}`);
        UI.UIUtils.installDragHandle(__classPrivateFieldGet(this, _AnimationTimeline_gridHeader, "f"), this.scrubberDragStart.bind(this), this.scrubberDragMove.bind(this), this.scrubberDragEnd.bind(this), null);
        __classPrivateFieldGet(this, _AnimationTimeline_gridWrapper, "f").appendChild(this.createScrubber());
        this.clearCurrentTimeText();
        return container;
    }
    setPlaybackRate(playbackRate) {
        if (playbackRate !== __classPrivateFieldGet(this, _AnimationTimeline_playbackRate, "f")) {
            Host.userMetrics.animationPlaybackRateChanged(playbackRate === 0.1 ? 2 /* Host.UserMetrics.AnimationsPlaybackRate.PERCENT_10 */ :
                playbackRate === 0.25 ? 1 /* Host.UserMetrics.AnimationsPlaybackRate.PERCENT_25 */ :
                    playbackRate === 1 ? 0 /* Host.UserMetrics.AnimationsPlaybackRate.PERCENT_100 */ :
                        3 /* Host.UserMetrics.AnimationsPlaybackRate.OTHER */);
        }
        __classPrivateFieldSet(this, _AnimationTimeline_playbackRate, playbackRate, "f");
        for (const animationModel of SDK.TargetManager.TargetManager.instance().models(SDK.AnimationModel.AnimationModel, { scoped: true })) {
            animationModel.setPlaybackRate(__classPrivateFieldGet(this, _AnimationTimeline_allPaused, "f") ? 0 : __classPrivateFieldGet(this, _AnimationTimeline_playbackRate, "f"));
        }
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.AnimationsPlaybackRateChanged);
        if (__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")) {
            __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").playbackRate = this.effectivePlaybackRate();
        }
        this.performToolbarViewUpdate();
    }
    controlButtonToggle() {
        if (__classPrivateFieldGet(this, _AnimationTimeline_controlState, "f") === "play-outline" /* ControlState.PLAY */) {
            this.togglePause(false);
        }
        else if (__classPrivateFieldGet(this, _AnimationTimeline_controlState, "f") === "replay-outline" /* ControlState.REPLAY */) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.AnimationGroupReplayed);
            this.replay();
        }
        else {
            this.togglePause(true);
        }
    }
    updateControlButton() {
        if (!__classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").setEnabled(Boolean(__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f")) && this.hasAnimationGroupActiveNodes() && !__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f")?.isScrollDriven());
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") && __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").paused()) {
            __classPrivateFieldSet(this, _AnimationTimeline_controlState, "play-outline" /* ControlState.PLAY */, "f");
            __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").element.classList.toggle('toolbar-state-on', true);
            __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").setTitle(i18nString(UIStrings.playTimeline));
            __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").setGlyph('play');
        }
        else if (!__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f") || !__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").currentTime ||
            typeof __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").currentTime !== 'number' || __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").currentTime >= this.duration()) {
            __classPrivateFieldSet(this, _AnimationTimeline_controlState, "replay-outline" /* ControlState.REPLAY */, "f");
            __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").element.classList.toggle('toolbar-state-on', true);
            __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").setTitle(i18nString(UIStrings.replayTimeline));
            __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").setGlyph('replay');
        }
        else {
            __classPrivateFieldSet(this, _AnimationTimeline_controlState, "pause-outline" /* ControlState.PAUSE */, "f");
            __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").element.classList.toggle('toolbar-state-on', false);
            __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").setTitle(i18nString(UIStrings.pauseTimeline));
            __classPrivateFieldGet(this, _AnimationTimeline_controlButton, "f").setGlyph('pause');
        }
    }
    effectivePlaybackRate() {
        return (__classPrivateFieldGet(this, _AnimationTimeline_allPaused, "f") || (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") && __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").paused())) ? 0 : __classPrivateFieldGet(this, _AnimationTimeline_playbackRate, "f");
    }
    togglePause(pause) {
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f")) {
            __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").togglePause(pause);
            const preview = __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").get(__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f"));
            if (preview) {
                preview.setPaused(pause);
            }
        }
        if (__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")) {
            __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").playbackRate = this.effectivePlaybackRate();
        }
        this.updateControlButton();
    }
    replay() {
        if (!__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") || !this.hasAnimationGroupActiveNodes() || __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").isScrollDriven()) {
            return;
        }
        __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").seekTo(0);
        this.animateTime(0);
        this.updateControlButton();
    }
    duration() {
        return __classPrivateFieldGet(this, _AnimationTimeline_durationInternal, "f");
    }
    setDuration(duration) {
        __classPrivateFieldSet(this, _AnimationTimeline_durationInternal, duration, "f");
        this.scheduleRedraw();
    }
    clearTimeline() {
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") && __classPrivateFieldGet(this, _AnimationTimeline_scrollListenerId, "f")) {
            void __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").scrollNode().then((node) => {
                void node?.removeScrollEventListener(__classPrivateFieldGet(this, _AnimationTimeline_scrollListenerId, "f"));
                __classPrivateFieldSet(this, _AnimationTimeline_scrollListenerId, undefined, "f");
            });
        }
        __classPrivateFieldSet(this, _AnimationTimeline_uiAnimations, [], "f");
        __classPrivateFieldGet(this, _AnimationTimeline_nodesMap, "f").clear();
        __classPrivateFieldGet(this, _AnimationTimeline_animationsMap, "f").clear();
        __classPrivateFieldGet(this, _AnimationTimeline_animationsContainer, "f").removeChildren();
        __classPrivateFieldSet(this, _AnimationTimeline_durationInternal, __classPrivateFieldGet(this, _AnimationTimeline_defaultDuration, "f"), "f");
        __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubber, "f").classList.add('hidden');
        __classPrivateFieldGet(this, _AnimationTimeline_gridHeader, "f").classList.remove('scrubber-enabled');
        __classPrivateFieldSet(this, _AnimationTimeline_selectedGroup, null, "f");
        if (__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")) {
            __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").cancel();
        }
        __classPrivateFieldSet(this, _AnimationTimeline_scrubberPlayer, undefined, "f");
        this.clearCurrentTimeText();
        this.updateControlButton();
    }
    reset() {
        this.clearTimeline();
        this.setPlaybackRate(__classPrivateFieldGet(this, _AnimationTimeline_playbackRate, "f"));
        for (const group of __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f")) {
            group.release();
        }
        __classPrivateFieldSet(this, _AnimationTimeline_groupBuffer, [], "f");
        this.clearPreviews();
        this.renderGrid();
    }
    animationGroupStarted({ data }) {
        void this.addAnimationGroup(data);
    }
    scheduledRedrawAfterAnimationGroupUpdatedForTest() {
    }
    animationGroupUpdated({ data: group, }) {
        void __classPrivateFieldGet(this, _AnimationTimeline_animationGroupUpdatedThrottler, "f").schedule(async () => {
            const preview = __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").get(group);
            if (preview) {
                preview.replay();
            }
            if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") !== group) {
                return;
            }
            if (group.isScrollDriven()) {
                const animationNode = await group.scrollNode();
                if (animationNode) {
                    const scrollRange = group.scrollOrientation() === "vertical" /* Protocol.DOM.ScrollOrientation.Vertical */ ?
                        await animationNode.verticalScrollRange() :
                        await animationNode.horizontalScrollRange();
                    const scrollOffset = group.scrollOrientation() === "vertical" /* Protocol.DOM.ScrollOrientation.Vertical */ ?
                        await animationNode.scrollTop() :
                        await animationNode.scrollLeft();
                    if (scrollRange !== null) {
                        this.setDuration(scrollRange);
                    }
                    if (scrollOffset !== null) {
                        this.setCurrentTimeText(scrollOffset);
                        this.setTimelineScrubberPosition(scrollOffset);
                    }
                }
            }
            else {
                this.setDuration(group.finiteDuration());
            }
            this.updateControlButton();
            this.scheduleRedraw();
            this.scheduledRedrawAfterAnimationGroupUpdatedForTest();
        });
    }
    clearPreviews() {
        __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").clear();
        __classPrivateFieldGet(this, _AnimationTimeline_previewContainer, "f").removeChildren();
    }
    createPreview(group) {
        const preview = new AnimationGroupPreviewUI({
            animationGroup: group,
            label: i18nString(UIStrings.animationPreviewS, { PH1: __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").length + 1 }),
            onRemoveAnimationGroup: () => {
                this.removeAnimationGroup(group);
            },
            onSelectAnimationGroup: () => {
                void this.selectAnimationGroup(group);
            },
            onFocusNextGroup: () => {
                this.focusNextGroup(group);
            },
            onFocusPreviousGroup: () => {
                this.focusNextGroup(group, /* focusPrevious */ true);
            }
        });
        const previewUiContainer = document.createElement('div');
        previewUiContainer.classList.add('preview-ui-container');
        preview.markAsRoot();
        preview.show(previewUiContainer);
        __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").push(group);
        __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").set(group, preview);
        __classPrivateFieldGet(this, _AnimationTimeline_previewContainer, "f").appendChild(previewUiContainer);
        // If this is the first preview attached, we want it to be focusable directly.
        // Otherwise, we don't want the previews to be focusable via Tabbing and manage
        // their focus via arrow keys.
        if (__classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").size === 1) {
            const preview = __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").get(__classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f")[0]);
            if (preview) {
                preview.setFocusable(true);
            }
        }
    }
    previewsCreatedForTest() {
    }
    scrubberOnFinishForTest() {
    }
    createPreviewForCollectedGroups() {
        __classPrivateFieldGet(this, _AnimationTimeline_collectedGroups, "f").sort((a, b) => {
            // Scroll driven animations are rendered first.
            if (a.isScrollDriven() && !b.isScrollDriven()) {
                return -1;
            }
            if (!a.isScrollDriven() && b.isScrollDriven()) {
                return 1;
            }
            // Then compare the start times for the same type of animations.
            if (a.startTime() !== b.startTime()) {
                return a.startTime() - b.startTime();
            }
            // If the start times are the same, the one with the more animations take precedence.
            return a.animations.length - b.animations.length;
        });
        for (const group of __classPrivateFieldGet(this, _AnimationTimeline_collectedGroups, "f")) {
            this.createPreview(group);
        }
        __classPrivateFieldSet(this, _AnimationTimeline_collectedGroups, [], "f");
        this.previewsCreatedForTest();
    }
    addAnimationGroup(group) {
        const previewGroup = __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").get(group);
        if (previewGroup) {
            if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") === group) {
                this.syncScrubber();
            }
            else {
                previewGroup.replay();
            }
            return Promise.resolve();
        }
        __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").sort((left, right) => left.startTime() - right.startTime());
        // Discard oldest groups from buffer if necessary
        const groupsToDiscard = [];
        const bufferSize = this.width() / 50;
        while (__classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").length > bufferSize) {
            const toDiscard = __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").splice(__classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f")[0] === __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") ? 1 : 0, 1);
            groupsToDiscard.push(toDiscard[0]);
        }
        for (const g of groupsToDiscard) {
            const discardGroup = __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").get(g);
            if (!discardGroup) {
                continue;
            }
            discardGroup.detach();
            __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").delete(g);
            g.release();
        }
        // Batch creating preview for arrivals happening closely together to ensure
        // stable UI sorting in the preview container.
        __classPrivateFieldGet(this, _AnimationTimeline_collectedGroups, "f").push(group);
        return __classPrivateFieldGet(this, _AnimationTimeline_createPreviewForCollectedGroupsThrottler, "f").schedule(() => Promise.resolve(this.createPreviewForCollectedGroups()));
    }
    focusNextGroup(group, focusPrevious) {
        const currentGroupIndex = __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").indexOf(group);
        const nextIndex = focusPrevious ? currentGroupIndex - 1 : currentGroupIndex + 1;
        if (nextIndex < 0 || nextIndex >= __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").length) {
            return;
        }
        const preview = __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").get(__classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f")[nextIndex]);
        if (preview) {
            preview.setFocusable(true);
            preview.focus();
        }
        const previousPreview = __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").get(group);
        if (previousPreview) {
            previousPreview.setFocusable(false);
        }
    }
    removeAnimationGroup(group) {
        const currentGroupIndex = __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").indexOf(group);
        Platform.ArrayUtilities.removeElement(__classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f"), group);
        const previewGroup = __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").get(group);
        if (previewGroup) {
            previewGroup.detach();
        }
        __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").delete(group);
        group.release();
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") === group) {
            this.clearTimeline();
            this.renderGrid();
        }
        const groupLength = __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").length;
        if (groupLength === 0) {
            __classPrivateFieldGet(this, _AnimationTimeline_clearButton, "f").element.focus();
            return;
        }
        const nextGroup = currentGroupIndex >= __classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").length ?
            __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").get(__classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f")[__classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f").length - 1]) :
            __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").get(__classPrivateFieldGet(this, _AnimationTimeline_groupBuffer, "f")[currentGroupIndex]);
        if (nextGroup) {
            nextGroup.setFocusable(true);
            nextGroup.focus();
        }
    }
    clearCurrentTimeText() {
        __classPrivateFieldGet(this, _AnimationTimeline_currentTime, "f").textContent = '';
    }
    setCurrentTimeText(time) {
        if (!__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _AnimationTimeline_currentTime, "f").textContent =
            __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f")?.isScrollDriven() ? `${time.toFixed(0)}px` : i18n.TimeUtilities.millisToString(time);
    }
    async selectAnimationGroup(group) {
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") === group) {
            this.togglePause(false);
            this.replay();
            return;
        }
        this.clearTimeline();
        __classPrivateFieldSet(this, _AnimationTimeline_selectedGroup, group, "f");
        __classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").forEach((previewUI, group) => {
            previewUI.setSelected(__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") === group);
        });
        if (group.isScrollDriven()) {
            const animationNode = await group.scrollNode();
            if (!animationNode) {
                throw new Error('Scroll container is not found for the scroll driven animation');
            }
            const scrollRange = group.scrollOrientation() === "vertical" /* Protocol.DOM.ScrollOrientation.Vertical */ ?
                await animationNode.verticalScrollRange() :
                await animationNode.horizontalScrollRange();
            const scrollOffset = group.scrollOrientation() === "vertical" /* Protocol.DOM.ScrollOrientation.Vertical */ ?
                await animationNode.scrollTop() :
                await animationNode.scrollLeft();
            if (typeof scrollRange !== 'number' || typeof scrollOffset !== 'number') {
                throw new Error('Scroll range or scroll offset is not resolved for the scroll driven animation');
            }
            __classPrivateFieldSet(this, _AnimationTimeline_scrollListenerId, await animationNode.addScrollEventListener(({ scrollTop, scrollLeft }) => {
                const offset = group.scrollOrientation() === "vertical" /* Protocol.DOM.ScrollOrientation.Vertical */ ? scrollTop : scrollLeft;
                this.setCurrentTimeText(offset);
                this.setTimelineScrubberPosition(offset);
            }), "f");
            this.setDuration(scrollRange);
            this.setCurrentTimeText(scrollOffset);
            this.setTimelineScrubberPosition(scrollOffset);
            if (__classPrivateFieldGet(this, _AnimationTimeline_pauseButton, "f")) {
                __classPrivateFieldGet(this, _AnimationTimeline_pauseButton, "f").setEnabled(false);
            }
            __classPrivateFieldSet(this, _AnimationTimeline_playbackRateButtonsDisabled, true, "f");
            this.performToolbarViewUpdate();
        }
        else {
            this.setDuration(group.finiteDuration());
            if (__classPrivateFieldGet(this, _AnimationTimeline_pauseButton, "f")) {
                __classPrivateFieldGet(this, _AnimationTimeline_pauseButton, "f").setEnabled(true);
            }
            __classPrivateFieldSet(this, _AnimationTimeline_playbackRateButtonsDisabled, false, "f");
            this.performToolbarViewUpdate();
        }
        // Wait for all animations to be added and nodes to be resolved
        // until we schedule a redraw.
        await Promise.all(group.animations().map(anim => this.addAnimation(anim)));
        this.scheduleRedraw();
        this.togglePause(false);
        this.replay();
        if (this.hasAnimationGroupActiveNodes()) {
            __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubber, "f").classList.remove('hidden');
            __classPrivateFieldGet(this, _AnimationTimeline_gridHeader, "f").classList.add('scrubber-enabled');
        }
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.AnimationGroupSelected);
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").isScrollDriven()) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.ScrollDrivenAnimationGroupSelected);
        }
        this.animationGroupSelectedForTest();
    }
    animationGroupSelectedForTest() {
    }
    async addAnimation(animation) {
        let nodeUI = __classPrivateFieldGet(this, _AnimationTimeline_nodesMap, "f").get(animation.source().backendNodeId());
        if (!nodeUI) {
            nodeUI = new NodeUI(animation.source());
            __classPrivateFieldGet(this, _AnimationTimeline_animationsContainer, "f").appendChild(nodeUI.element);
            __classPrivateFieldGet(this, _AnimationTimeline_nodesMap, "f").set(animation.source().backendNodeId(), nodeUI);
        }
        const nodeRow = nodeUI.createNewRow();
        const uiAnimation = new AnimationUI(animation, this, nodeRow);
        const node = await animation.source().deferredNode().resolvePromise();
        uiAnimation.setNode(node);
        if (node && nodeUI) {
            nodeUI.nodeResolved(node);
            nodeUIsByNode.set(node, nodeUI);
        }
        __classPrivateFieldGet(this, _AnimationTimeline_uiAnimations, "f").push(uiAnimation);
        __classPrivateFieldGet(this, _AnimationTimeline_animationsMap, "f").set(animation.id(), animation);
    }
    markNodeAsRemoved(node) {
        nodeUIsByNode.get(node)?.nodeRemoved();
        // Mark nodeUIs of pseudo elements of the node as removed for instance, for view transitions.
        for (const pseudoElements of node.pseudoElements().values()) {
            pseudoElements.forEach(pseudoElement => this.markNodeAsRemoved(pseudoElement));
        }
        // Mark nodeUIs of children as node removed.
        node.children()?.forEach(child => {
            this.markNodeAsRemoved(child);
        });
        // If the user already has a selected animation group and
        // some of the nodes are removed, we check whether all the nodes
        // are removed for the currently selected animation. If that's the case
        // we remove the scrubber and update control button to be disabled.
        if (!this.hasAnimationGroupActiveNodes()) {
            __classPrivateFieldGet(this, _AnimationTimeline_gridHeader, "f").classList.remove('scrubber-enabled');
            __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubber, "f").classList.add('hidden');
            __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")?.cancel();
            __classPrivateFieldSet(this, _AnimationTimeline_scrubberPlayer, undefined, "f");
            this.clearCurrentTimeText();
            this.updateControlButton();
        }
    }
    hasAnimationGroupActiveNodes() {
        for (const nodeUI of __classPrivateFieldGet(this, _AnimationTimeline_nodesMap, "f").values()) {
            if (nodeUI.hasActiveNode()) {
                return true;
            }
        }
        return false;
    }
    renderGrid() {
        const isScrollDriven = __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f")?.isScrollDriven();
        // For scroll driven animations, show divider lines for each 10% progres.
        // For time based animations, show divider lines for each 250ms progress.
        const gridSize = isScrollDriven ? this.duration() / 10 : 250;
        __classPrivateFieldGet(this, _AnimationTimeline_grid, "f").removeChildren();
        let lastDraw = undefined;
        for (let time = 0; time < this.duration(); time += gridSize) {
            const line = UI.UIUtils.createSVGChild(__classPrivateFieldGet(this, _AnimationTimeline_grid, "f"), 'rect', 'animation-timeline-grid-line');
            line.setAttribute('x', (time * this.pixelTimeRatio() + 10).toString());
            line.setAttribute('y', '23');
            line.setAttribute('height', '100%');
            line.setAttribute('width', '1');
        }
        for (let time = 0; time < this.duration(); time += gridSize) {
            const gridWidth = time * this.pixelTimeRatio();
            if (lastDraw === undefined || gridWidth - lastDraw > 50) {
                lastDraw = gridWidth;
                const label = UI.UIUtils.createSVGChild(__classPrivateFieldGet(this, _AnimationTimeline_grid, "f"), 'text', 'animation-timeline-grid-label');
                label.textContent = isScrollDriven ? `${time.toFixed(0)}px` : i18n.TimeUtilities.millisToString(time);
                label.setAttribute('x', (gridWidth + 12).toString());
                label.setAttribute('y', '16');
            }
        }
    }
    scheduleRedraw() {
        this.renderGrid();
        __classPrivateFieldSet(this, _AnimationTimeline_renderQueue, [], "f");
        for (const ui of __classPrivateFieldGet(this, _AnimationTimeline_uiAnimations, "f")) {
            __classPrivateFieldGet(this, _AnimationTimeline_renderQueue, "f").push(ui);
        }
        if (__classPrivateFieldGet(this, _AnimationTimeline_redrawing, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _AnimationTimeline_redrawing, true, "f");
        __classPrivateFieldGet(this, _AnimationTimeline_animationsContainer, "f").window().requestAnimationFrame(this.render.bind(this));
    }
    render(timestamp) {
        while (__classPrivateFieldGet(this, _AnimationTimeline_renderQueue, "f").length && (!timestamp || window.performance.now() - timestamp < 50)) {
            const animationUI = __classPrivateFieldGet(this, _AnimationTimeline_renderQueue, "f").shift();
            if (animationUI) {
                animationUI.redraw();
            }
        }
        if (__classPrivateFieldGet(this, _AnimationTimeline_renderQueue, "f").length) {
            __classPrivateFieldGet(this, _AnimationTimeline_animationsContainer, "f").window().requestAnimationFrame(this.render.bind(this));
        }
        else {
            __classPrivateFieldSet(this, _AnimationTimeline_redrawing, undefined, "f");
        }
    }
    onResize() {
        __classPrivateFieldSet(this, _AnimationTimeline_cachedTimelineWidth, Math.max(0, this.contentElement.offsetWidth - __classPrivateFieldGet(this, _AnimationTimeline_timelineControlsWidth, "f")) || 0, "f");
        this.scheduleRedraw();
        if (__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")) {
            this.syncScrubber();
        }
        __classPrivateFieldSet(this, _AnimationTimeline_gridOffsetLeft, undefined, "f");
    }
    width() {
        return __classPrivateFieldGet(this, _AnimationTimeline_cachedTimelineWidth, "f") || 0;
    }
    syncScrubber() {
        if (!__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") || !this.hasAnimationGroupActiveNodes()) {
            return;
        }
        void __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").currentTimePromise()
            .then(this.animateTime.bind(this))
            .then(this.updateControlButton.bind(this));
    }
    animateTime(currentTime) {
        // Scroll driven animations are bound to the scroll position of the scroll container
        // thus we don't animate the scrubber based on time for scroll driven animations.
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f")?.isScrollDriven()) {
            return;
        }
        if (__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")) {
            __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").cancel();
        }
        __classPrivateFieldSet(this, _AnimationTimeline_scrubberPlayer, __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubber, "f").animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(' + this.width() + 'px)' }], { duration: this.duration(), fill: 'forwards' }), "f");
        __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").playbackRate = this.effectivePlaybackRate();
        __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").onfinish = () => {
            this.updateControlButton();
            this.scrubberOnFinishForTest();
        };
        __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").currentTime = currentTime;
        this.element.window().requestAnimationFrame(this.updateScrubber.bind(this));
    }
    pixelTimeRatio() {
        return this.width() / this.duration() || 0;
    }
    updateScrubber(_timestamp) {
        if (!__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")) {
            return;
        }
        this.setCurrentTimeText(__classPrivateFieldGet(this, _AnimationTimeline_instances, "m", _AnimationTimeline_scrubberCurrentTime).call(this));
        if (__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").playState.toString() === 'pending' || __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").playState === 'running') {
            this.element.window().requestAnimationFrame(this.updateScrubber.bind(this));
        }
    }
    scrubberDragStart(event) {
        if (!__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") || !this.hasAnimationGroupActiveNodes()) {
            return false;
        }
        // Seek to current mouse position.
        if (!__classPrivateFieldGet(this, _AnimationTimeline_gridOffsetLeft, "f")) {
            __classPrivateFieldSet(this, _AnimationTimeline_gridOffsetLeft, __classPrivateFieldGet(this, _AnimationTimeline_grid, "f").getBoundingClientRect().left + 10, "f");
        }
        const { x } = event;
        const seekTime = Math.max(0, x - __classPrivateFieldGet(this, _AnimationTimeline_gridOffsetLeft, "f")) / this.pixelTimeRatio();
        // Interface with scrubber drag.
        __classPrivateFieldSet(this, _AnimationTimeline_originalScrubberTime, seekTime, "f");
        __classPrivateFieldSet(this, _AnimationTimeline_originalMousePosition, x, "f");
        this.setCurrentTimeText(seekTime);
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").isScrollDriven()) {
            this.setTimelineScrubberPosition(seekTime);
            void this.updateScrollOffsetOnPage(seekTime);
        }
        else {
            const currentTime = __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")?.currentTime;
            __classPrivateFieldSet(this, _AnimationTimeline_animationGroupPausedBeforeScrub, __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").paused() || typeof currentTime === 'number' && currentTime >= this.duration(), "f");
            __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").seekTo(seekTime);
            this.togglePause(true);
            this.animateTime(seekTime);
        }
        return true;
    }
    async updateScrollOffsetOnPage(offset) {
        const node = await __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f")?.scrollNode();
        if (!node) {
            return;
        }
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f")?.scrollOrientation() === "vertical" /* Protocol.DOM.ScrollOrientation.Vertical */) {
            return await node.setScrollTop(offset);
        }
        return await node.setScrollLeft(offset);
    }
    setTimelineScrubberPosition(time) {
        __classPrivateFieldGet(this, _AnimationTimeline_timelineScrubber, "f").style.transform = `translateX(${time * this.pixelTimeRatio()}px)`;
    }
    scrubberDragMove(event) {
        const { x } = event;
        const delta = x - (__classPrivateFieldGet(this, _AnimationTimeline_originalMousePosition, "f") || 0);
        const currentTime = Math.max(0, Math.min((__classPrivateFieldGet(this, _AnimationTimeline_originalScrubberTime, "f") || 0) + delta / this.pixelTimeRatio(), this.duration()));
        if (__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")) {
            __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").currentTime = currentTime;
        }
        else {
            this.setTimelineScrubberPosition(currentTime);
            void this.updateScrollOffsetOnPage(currentTime);
        }
        this.setCurrentTimeText(currentTime);
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f") && !__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").isScrollDriven()) {
            __classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f").seekTo(currentTime);
        }
    }
    scrubberDragEnd(_event) {
        if (__classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")) {
            const currentTime = Math.max(0, __classPrivateFieldGet(this, _AnimationTimeline_instances, "m", _AnimationTimeline_scrubberCurrentTime).call(this));
            __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").play();
            __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").currentTime = currentTime;
        }
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.AnimationGroupScrubbed);
        if (__classPrivateFieldGet(this, _AnimationTimeline_selectedGroup, "f")?.isScrollDriven()) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.ScrollDrivenAnimationGroupScrubbed);
        }
        __classPrivateFieldGet(this, _AnimationTimeline_currentTime, "f").window().requestAnimationFrame(this.updateScrubber.bind(this));
        if (!__classPrivateFieldGet(this, _AnimationTimeline_animationGroupPausedBeforeScrub, "f")) {
            this.togglePause(false);
        }
    }
}
_AnimationTimeline_gridWrapper = new WeakMap(), _AnimationTimeline_grid = new WeakMap(), _AnimationTimeline_playbackRate = new WeakMap(), _AnimationTimeline_allPaused = new WeakMap(), _AnimationTimeline_animationsContainer = new WeakMap(), _AnimationTimeline_previewContainer = new WeakMap(), _AnimationTimeline_timelineScrubber = new WeakMap(), _AnimationTimeline_currentTime = new WeakMap(), _AnimationTimeline_clearButton = new WeakMap(), _AnimationTimeline_selectedGroup = new WeakMap(), _AnimationTimeline_renderQueue = new WeakMap(), _AnimationTimeline_defaultDuration = new WeakMap(), _AnimationTimeline_durationInternal = new WeakMap(), _AnimationTimeline_timelineControlsWidth = new WeakMap(), _AnimationTimeline_nodesMap = new WeakMap(), _AnimationTimeline_uiAnimations = new WeakMap(), _AnimationTimeline_groupBuffer = new WeakMap(), _AnimationTimeline_previewMap = new WeakMap(), _AnimationTimeline_animationsMap = new WeakMap(), _AnimationTimeline_timelineScrubberLine = new WeakMap(), _AnimationTimeline_pauseButton = new WeakMap(), _AnimationTimeline_controlButton = new WeakMap(), _AnimationTimeline_controlState = new WeakMap(), _AnimationTimeline_redrawing = new WeakMap(), _AnimationTimeline_cachedTimelineWidth = new WeakMap(), _AnimationTimeline_scrubberPlayer = new WeakMap(), _AnimationTimeline_gridOffsetLeft = new WeakMap(), _AnimationTimeline_originalScrubberTime = new WeakMap(), _AnimationTimeline_animationGroupPausedBeforeScrub = new WeakMap(), _AnimationTimeline_originalMousePosition = new WeakMap(), _AnimationTimeline_timelineControlsResizer = new WeakMap(), _AnimationTimeline_gridHeader = new WeakMap(), _AnimationTimeline_scrollListenerId = new WeakMap(), _AnimationTimeline_collectedGroups = new WeakMap(), _AnimationTimeline_createPreviewForCollectedGroupsThrottler = new WeakMap(), _AnimationTimeline_animationGroupUpdatedThrottler = new WeakMap(), _AnimationTimeline_toolbarViewContainer = new WeakMap(), _AnimationTimeline_toolbarView = new WeakMap(), _AnimationTimeline_playbackRateButtonsDisabled = new WeakMap(), _AnimationTimeline_instances = new WeakSet(), _AnimationTimeline_setupTimelineControlsResizer = function _AnimationTimeline_setupTimelineControlsResizer() {
    let resizeOriginX = undefined;
    UI.UIUtils.installDragHandle(__classPrivateFieldGet(this, _AnimationTimeline_timelineControlsResizer, "f"), (ev) => {
        resizeOriginX = ev.clientX;
        return true;
    }, (ev) => {
        if (resizeOriginX === undefined) {
            return;
        }
        const newWidth = __classPrivateFieldGet(this, _AnimationTimeline_timelineControlsWidth, "f") + ev.clientX - resizeOriginX;
        __classPrivateFieldSet(this, _AnimationTimeline_timelineControlsWidth, Math.min(Math.max(newWidth, MIN_TIMELINE_CONTROLS_WIDTH), MAX_TIMELINE_CONTROLS_WIDTH), "f");
        resizeOriginX = ev.clientX;
        this.element.style.setProperty('--timeline-controls-width', __classPrivateFieldGet(this, _AnimationTimeline_timelineControlsWidth, "f") + 'px');
        this.onResize();
    }, () => {
        resizeOriginX = undefined;
    }, 'ew-resize');
}, _AnimationTimeline_addExistingAnimationGroups = function _AnimationTimeline_addExistingAnimationGroups(animationModel) {
    for (const animationGroup of animationModel.animationGroups.values()) {
        if (__classPrivateFieldGet(this, _AnimationTimeline_previewMap, "f").has(animationGroup)) {
            continue;
        }
        void this.addAnimationGroup(animationGroup);
    }
}, _AnimationTimeline_showPanelInDrawer = function _AnimationTimeline_showPanelInDrawer() {
    const viewManager = UI.ViewManager.ViewManager.instance();
    viewManager.moveView('animations', 'drawer-view', {
        shouldSelectTab: true,
        overrideSaving: true,
    });
}, _AnimationTimeline_scrubberCurrentTime = function _AnimationTimeline_scrubberCurrentTime() {
    return typeof __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f")?.currentTime === 'number' ? __classPrivateFieldGet(this, _AnimationTimeline_scrubberPlayer, "f").currentTime : 0;
};
export const GlobalPlaybackRates = [1, 0.25, 0.1];
var ControlState;
(function (ControlState) {
    ControlState["PLAY"] = "play-outline";
    ControlState["REPLAY"] = "replay-outline";
    ControlState["PAUSE"] = "pause-outline";
})(ControlState || (ControlState = {}));
export class NodeUI {
    constructor(_animationEffect) {
        _NodeUI_description.set(this, void 0);
        _NodeUI_timelineElement.set(this, void 0);
        _NodeUI_overlayElement.set(this, void 0);
        _NodeUI_node.set(this, void 0);
        this.element = document.createElement('div');
        this.element.classList.add('animation-node-row');
        __classPrivateFieldSet(this, _NodeUI_description, this.element.createChild('div', 'animation-node-description'), "f");
        __classPrivateFieldGet(this, _NodeUI_description, "f").setAttribute('jslog', `${VisualLogging.tableCell('description').track({ resize: true })}`);
        __classPrivateFieldSet(this, _NodeUI_timelineElement, this.element.createChild('div', 'animation-node-timeline'), "f");
        __classPrivateFieldGet(this, _NodeUI_timelineElement, "f").setAttribute('jslog', `${VisualLogging.tableCell('timeline').track({ resize: true })}`);
        UI.ARIAUtils.markAsApplication(__classPrivateFieldGet(this, _NodeUI_timelineElement, "f"));
    }
    nodeResolved(node) {
        if (!node) {
            UI.UIUtils.createTextChild(__classPrivateFieldGet(this, _NodeUI_description, "f"), '<node>');
            return;
        }
        __classPrivateFieldSet(this, _NodeUI_node, node, "f");
        this.nodeChanged();
        void Common.Linkifier.Linkifier.linkify(node).then(link => {
            link.addEventListener('click', () => {
                Host.userMetrics.actionTaken(Host.UserMetrics.Action.AnimatedNodeDescriptionClicked);
            });
            __classPrivateFieldGet(this, _NodeUI_description, "f").appendChild(link);
        });
        if (!node.ownerDocument) {
            this.nodeRemoved();
        }
    }
    createNewRow() {
        return __classPrivateFieldGet(this, _NodeUI_timelineElement, "f").createChild('div', 'animation-timeline-row');
    }
    nodeRemoved() {
        this.element.classList.add('animation-node-removed');
        if (!__classPrivateFieldGet(this, _NodeUI_overlayElement, "f")) {
            __classPrivateFieldSet(this, _NodeUI_overlayElement, document.createElement('div'), "f");
            __classPrivateFieldGet(this, _NodeUI_overlayElement, "f").classList.add('animation-node-removed-overlay');
            __classPrivateFieldGet(this, _NodeUI_description, "f").appendChild(__classPrivateFieldGet(this, _NodeUI_overlayElement, "f"));
        }
        __classPrivateFieldSet(this, _NodeUI_node, null, "f");
    }
    hasActiveNode() {
        return Boolean(__classPrivateFieldGet(this, _NodeUI_node, "f"));
    }
    nodeChanged() {
        let animationNodeSelected = false;
        if (__classPrivateFieldGet(this, _NodeUI_node, "f")) {
            animationNodeSelected = (__classPrivateFieldGet(this, _NodeUI_node, "f") === UI.Context.Context.instance().flavor(SDK.DOMModel.DOMNode));
        }
        this.element.classList.toggle('animation-node-selected', animationNodeSelected);
    }
}
_NodeUI_description = new WeakMap(), _NodeUI_timelineElement = new WeakMap(), _NodeUI_overlayElement = new WeakMap(), _NodeUI_node = new WeakMap();
export class StepTimingFunction {
    constructor(steps, stepAtPosition) {
        this.steps = steps;
        this.stepAtPosition = stepAtPosition;
    }
    static parse(text) {
        let match = text.match(/^steps\((\d+), (start|middle)\)$/);
        if (match) {
            return new StepTimingFunction(parseInt(match[1], 10), match[2]);
        }
        match = text.match(/^steps\((\d+)\)$/);
        if (match) {
            return new StepTimingFunction(parseInt(match[1], 10), 'end');
        }
        return null;
    }
}
export class AnimationGroupRevealer {
    async reveal(animationGroup) {
        await AnimationTimeline.instance().revealAnimationGroup(animationGroup);
    }
}
//# sourceMappingURL=AnimationTimeline.js.map