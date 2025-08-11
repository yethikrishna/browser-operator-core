// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _ReplaySection_instances, _ReplaySection_shadow, _ReplaySection_props, _ReplaySection_settings, _ReplaySection_replayExtensions, _ReplaySection_handleSelectMenuSelected, _ReplaySection_handleSelectButtonClick, _ReplaySection_render;
import * as Host from '../../../core/host/host.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
const { html } = Lit;
const UIStrings = {
    /**
     * @description Replay button label
     */
    Replay: 'Replay',
    /**
     * @description Button label for the normal speed replay option
     */
    ReplayNormalButtonLabel: 'Normal speed',
    /**
     * @description Item label for the normal speed replay option
     */
    ReplayNormalItemLabel: 'Normal (Default)',
    /**
     * @description Button label for the slow speed replay option
     */
    ReplaySlowButtonLabel: 'Slow speed',
    /**
     * @description Item label for the slow speed replay option
     */
    ReplaySlowItemLabel: 'Slow',
    /**
     * @description Button label for the very slow speed replay option
     */
    ReplayVerySlowButtonLabel: 'Very slow speed',
    /**
     * @description Item label for the very slow speed replay option
     */
    ReplayVerySlowItemLabel: 'Very slow',
    /**
     * @description Button label for the extremely slow speed replay option
     */
    ReplayExtremelySlowButtonLabel: 'Extremely slow speed',
    /**
     * @description Item label for the slow speed replay option
     */
    ReplayExtremelySlowItemLabel: 'Extremely slow',
    /**
     * @description Label for a group of items in the replay menu that indicate various replay speeds (e.g., Normal, Fast, Slow).
     */
    speedGroup: 'Speed',
    /**
     * @description Label for a group of items in the replay menu that indicate various extensions that can be used for replay.
     */
    extensionGroup: 'Extensions',
};
const items = [
    {
        value: "normal" /* PlayRecordingSpeed.NORMAL */,
        buttonIconName: 'play',
        buttonLabel: () => i18nString(UIStrings.ReplayNormalButtonLabel),
        label: () => i18nString(UIStrings.ReplayNormalItemLabel),
    },
    {
        value: "slow" /* PlayRecordingSpeed.SLOW */,
        buttonIconName: 'play',
        buttonLabel: () => i18nString(UIStrings.ReplaySlowButtonLabel),
        label: () => i18nString(UIStrings.ReplaySlowItemLabel),
    },
    {
        value: "very_slow" /* PlayRecordingSpeed.VERY_SLOW */,
        buttonIconName: 'play',
        buttonLabel: () => i18nString(UIStrings.ReplayVerySlowButtonLabel),
        label: () => i18nString(UIStrings.ReplayVerySlowItemLabel),
    },
    {
        value: "extremely_slow" /* PlayRecordingSpeed.EXTREMELY_SLOW */,
        buttonIconName: 'play',
        buttonLabel: () => i18nString(UIStrings.ReplayExtremelySlowButtonLabel),
        label: () => i18nString(UIStrings.ReplayExtremelySlowItemLabel),
    },
];
const replaySpeedToMetricSpeedMap = {
    ["normal" /* PlayRecordingSpeed.NORMAL */]: 1 /* Host.UserMetrics.RecordingReplaySpeed.NORMAL */,
    ["slow" /* PlayRecordingSpeed.SLOW */]: 2 /* Host.UserMetrics.RecordingReplaySpeed.SLOW */,
    ["very_slow" /* PlayRecordingSpeed.VERY_SLOW */]: 3 /* Host.UserMetrics.RecordingReplaySpeed.VERY_SLOW */,
    ["extremely_slow" /* PlayRecordingSpeed.EXTREMELY_SLOW */]: 4 /* Host.UserMetrics.RecordingReplaySpeed.EXTREMELY_SLOW */,
};
const str_ = i18n.i18n.registerUIStrings('panels/recorder/components/ReplaySection.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class StartReplayEvent extends Event {
    constructor(speed, extension) {
        super(StartReplayEvent.eventName, { bubbles: true, composed: true });
        this.speed = speed;
        this.extension = extension;
    }
}
StartReplayEvent.eventName = 'startreplay';
const REPLAY_EXTENSION_PREFIX = 'extension';
export class ReplaySection extends HTMLElement {
    constructor() {
        super(...arguments);
        _ReplaySection_instances.add(this);
        _ReplaySection_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _ReplaySection_props.set(this, { disabled: false });
        _ReplaySection_settings.set(this, void 0);
        _ReplaySection_replayExtensions.set(this, []);
    }
    set data(data) {
        __classPrivateFieldSet(this, _ReplaySection_settings, data.settings, "f");
        __classPrivateFieldSet(this, _ReplaySection_replayExtensions, data.replayExtensions, "f");
    }
    get disabled() {
        return __classPrivateFieldGet(this, _ReplaySection_props, "f").disabled;
    }
    set disabled(disabled) {
        __classPrivateFieldGet(this, _ReplaySection_props, "f").disabled = disabled;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ReplaySection_instances, "m", _ReplaySection_render));
    }
    connectedCallback() {
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ReplaySection_instances, "m", _ReplaySection_render));
    }
}
_ReplaySection_shadow = new WeakMap(), _ReplaySection_props = new WeakMap(), _ReplaySection_settings = new WeakMap(), _ReplaySection_replayExtensions = new WeakMap(), _ReplaySection_instances = new WeakSet(), _ReplaySection_handleSelectMenuSelected = function _ReplaySection_handleSelectMenuSelected(event) {
    const speed = event.value;
    if (__classPrivateFieldGet(this, _ReplaySection_settings, "f") && event.value) {
        __classPrivateFieldGet(this, _ReplaySection_settings, "f").speed = speed;
        __classPrivateFieldGet(this, _ReplaySection_settings, "f").replayExtension = '';
    }
    Host.userMetrics.recordingReplaySpeed(replaySpeedToMetricSpeedMap[speed]);
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ReplaySection_instances, "m", _ReplaySection_render));
}, _ReplaySection_handleSelectButtonClick = function _ReplaySection_handleSelectButtonClick(event) {
    event.stopPropagation();
    if (event.value?.startsWith(REPLAY_EXTENSION_PREFIX)) {
        if (__classPrivateFieldGet(this, _ReplaySection_settings, "f")) {
            __classPrivateFieldGet(this, _ReplaySection_settings, "f").replayExtension = event.value;
        }
        const extensionIdx = Number(event.value.substring(REPLAY_EXTENSION_PREFIX.length));
        this.dispatchEvent(new StartReplayEvent("normal" /* PlayRecordingSpeed.NORMAL */, __classPrivateFieldGet(this, _ReplaySection_replayExtensions, "f")[extensionIdx]));
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ReplaySection_instances, "m", _ReplaySection_render));
        return;
    }
    this.dispatchEvent(new StartReplayEvent(__classPrivateFieldGet(this, _ReplaySection_settings, "f") ? __classPrivateFieldGet(this, _ReplaySection_settings, "f").speed : "normal" /* PlayRecordingSpeed.NORMAL */));
    void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _ReplaySection_instances, "m", _ReplaySection_render));
}, _ReplaySection_render = function _ReplaySection_render() {
    const groups = [{ name: i18nString(UIStrings.speedGroup), items }];
    if (__classPrivateFieldGet(this, _ReplaySection_replayExtensions, "f").length) {
        groups.push({
            name: i18nString(UIStrings.extensionGroup),
            items: __classPrivateFieldGet(this, _ReplaySection_replayExtensions, "f").map((extension, idx) => {
                return {
                    value: REPLAY_EXTENSION_PREFIX + idx,
                    buttonIconName: 'play',
                    buttonLabel: () => extension.getName(),
                    label: () => extension.getName(),
                };
            }),
        });
    }
    // clang-format off
    Lit.render(html `
    <devtools-select-button
      @selectmenuselected=${__classPrivateFieldGet(this, _ReplaySection_instances, "m", _ReplaySection_handleSelectMenuSelected)}
      @selectbuttonclick=${__classPrivateFieldGet(this, _ReplaySection_instances, "m", _ReplaySection_handleSelectButtonClick)}
      .variant=${"primary" /* SelectButtonVariant.PRIMARY */}
      .showItemDivider=${false}
      .disabled=${__classPrivateFieldGet(this, _ReplaySection_props, "f").disabled}
      .action=${"chrome-recorder.replay-recording" /* Actions.RecorderActions.REPLAY_RECORDING */}
      .value=${__classPrivateFieldGet(this, _ReplaySection_settings, "f")?.replayExtension || __classPrivateFieldGet(this, _ReplaySection_settings, "f")?.speed || ''}
      .buttonLabel=${i18nString(UIStrings.Replay)}
      .groups=${groups}
      jslog=${VisualLogging.action("chrome-recorder.replay-recording" /* Actions.RecorderActions.REPLAY_RECORDING */).track({ click: true })}
    ></devtools-select-button>`, __classPrivateFieldGet(this, _ReplaySection_shadow, "f"), { host: this });
    // clang-format on
};
customElements.define('devtools-replay-section', ReplaySection);
//# sourceMappingURL=ReplaySection.js.map