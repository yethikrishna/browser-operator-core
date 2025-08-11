// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RecordingListView_instances, _RecordingListView_shadow, _RecordingListView_props, _RecordingListView_onCreateClick, _RecordingListView_onDeleteClick, _RecordingListView_onOpenClick, _RecordingListView_onPlayRecordingClick, _RecordingListView_onKeyDown, _RecordingListView_stopPropagation, _RecordingListView_render;
import '../../../ui/components/icon_button/icon_button.js';
import * as i18n from '../../../core/i18n/i18n.js';
import * as Buttons from '../../../ui/components/buttons/buttons.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Lit from '../../../ui/lit/lit.js';
import * as VisualLogging from '../../../ui/visual_logging/visual_logging.js';
import * as Models from '../models/models.js';
import recordingListViewStyles from './recordingListView.css.js';
const { html } = Lit;
const UIStrings = {
    /**
     *@description The title of the page that contains a list of saved recordings that the user has..
     */
    savedRecordings: 'Saved recordings',
    /**
     * @description The title of the button that leads to create a new recording page.
     */
    createRecording: 'Create a new recording',
    /**
     * @description The title of the button that is shown next to each of the recordings and that triggers playing of the recording.
     */
    playRecording: 'Play recording',
    /**
     * @description The title of the button that is shown next to each of the recordings and that triggers deletion of the recording.
     */
    deleteRecording: 'Delete recording',
    /**
     * @description The title of the row corresponding to a recording. By clicking on the row, the user open the recording for editing.
     */
    openRecording: 'Open recording',
};
const str_ = i18n.i18n.registerUIStrings('panels/recorder/components/RecordingListView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class CreateRecordingEvent extends Event {
    constructor() {
        super(CreateRecordingEvent.eventName);
    }
}
CreateRecordingEvent.eventName = 'createrecording';
export class DeleteRecordingEvent extends Event {
    constructor(storageName) {
        super(DeleteRecordingEvent.eventName);
        this.storageName = storageName;
    }
}
DeleteRecordingEvent.eventName = 'deleterecording';
export class OpenRecordingEvent extends Event {
    constructor(storageName) {
        super(OpenRecordingEvent.eventName);
        this.storageName = storageName;
    }
}
OpenRecordingEvent.eventName = 'openrecording';
export class PlayRecordingEvent extends Event {
    constructor(storageName) {
        super(PlayRecordingEvent.eventName);
        this.storageName = storageName;
    }
}
PlayRecordingEvent.eventName = 'playrecording';
export class RecordingListView extends HTMLElement {
    constructor() {
        super(...arguments);
        _RecordingListView_instances.add(this);
        _RecordingListView_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _RecordingListView_props.set(this, {
            recordings: [],
            replayAllowed: true,
        });
        _RecordingListView_render.set(this, () => {
            // clang-format off
            Lit.render(html `
        <style>${recordingListViewStyles}</style>
        <div class="wrapper">
          <div class="header">
            <h1>${i18nString(UIStrings.savedRecordings)}</h1>
            <devtools-button
              .variant=${"primary" /* Buttons.Button.Variant.PRIMARY */}
              @click=${__classPrivateFieldGet(this, _RecordingListView_instances, "m", _RecordingListView_onCreateClick)}
              title=${Models.Tooltip.getTooltipForActions(i18nString(UIStrings.createRecording), "chrome-recorder.create-recording" /* Actions.RecorderActions.CREATE_RECORDING */)}
              .jslogContext=${'create-recording'}
            >
              ${i18nString(UIStrings.createRecording)}
            </devtools-button>
          </div>
          <div class="table">
            ${__classPrivateFieldGet(this, _RecordingListView_props, "f").recordings.map(recording => {
                return html `
                  <div
                    role="button"
                    tabindex="0"
                    aria-label=${i18nString(UIStrings.openRecording)}
                    class="row"
                    @keydown=${__classPrivateFieldGet(this, _RecordingListView_instances, "m", _RecordingListView_onKeyDown).bind(this, recording.storageName)}
                    @click=${__classPrivateFieldGet(this, _RecordingListView_instances, "m", _RecordingListView_onOpenClick).bind(this, recording.storageName)}
                    jslog=${VisualLogging.item()
                    .track({ click: true })
                    .context('recording')}>
                    <div class="icon">
                      <devtools-icon name="flow">
                      </devtools-icon>
                    </div>
                    <div class="title">${recording.name}</div>
                    <div class="actions">
                      ${__classPrivateFieldGet(this, _RecordingListView_props, "f").replayAllowed
                    ? html `
                              <devtools-button
                                title=${i18nString(UIStrings.playRecording)}
                                .data=${{
                        variant: "icon" /* Buttons.Button.Variant.ICON */,
                        iconName: 'play',
                        jslogContext: 'play-recording',
                    }}
                                @click=${__classPrivateFieldGet(this, _RecordingListView_instances, "m", _RecordingListView_onPlayRecordingClick).bind(this, recording.storageName)}
                                @keydown=${__classPrivateFieldGet(this, _RecordingListView_instances, "m", _RecordingListView_stopPropagation)}
                              ></devtools-button>
                              <div class="divider"></div>`
                    : ''}
                      <devtools-button
                        class="delete-recording-button"
                        title=${i18nString(UIStrings.deleteRecording)}
                        .data=${{
                    variant: "icon" /* Buttons.Button.Variant.ICON */,
                    iconName: 'bin',
                    jslogContext: 'delete-recording',
                }}
                        @click=${__classPrivateFieldGet(this, _RecordingListView_instances, "m", _RecordingListView_onDeleteClick).bind(this, recording.storageName)}
                        @keydown=${__classPrivateFieldGet(this, _RecordingListView_instances, "m", _RecordingListView_stopPropagation)}
                      ></devtools-button>
                    </div>
                  </div>
                `;
            })}
          </div>
        </div>
      `, __classPrivateFieldGet(this, _RecordingListView_shadow, "f"), { host: this });
            // clang-format on
        });
    }
    connectedCallback() {
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _RecordingListView_render, "f"));
    }
    set recordings(recordings) {
        __classPrivateFieldGet(this, _RecordingListView_props, "f").recordings = recordings;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _RecordingListView_render, "f"));
    }
    set replayAllowed(value) {
        __classPrivateFieldGet(this, _RecordingListView_props, "f").replayAllowed = value;
        void ComponentHelpers.ScheduledRender.scheduleRender(this, __classPrivateFieldGet(this, _RecordingListView_render, "f"));
    }
}
_RecordingListView_shadow = new WeakMap(), _RecordingListView_props = new WeakMap(), _RecordingListView_render = new WeakMap(), _RecordingListView_instances = new WeakSet(), _RecordingListView_onCreateClick = function _RecordingListView_onCreateClick() {
    this.dispatchEvent(new CreateRecordingEvent());
}, _RecordingListView_onDeleteClick = function _RecordingListView_onDeleteClick(storageName, event) {
    event.stopPropagation();
    this.dispatchEvent(new DeleteRecordingEvent(storageName));
}, _RecordingListView_onOpenClick = function _RecordingListView_onOpenClick(storageName, event) {
    event.stopPropagation();
    this.dispatchEvent(new OpenRecordingEvent(storageName));
}, _RecordingListView_onPlayRecordingClick = function _RecordingListView_onPlayRecordingClick(storageName, event) {
    event.stopPropagation();
    this.dispatchEvent(new PlayRecordingEvent(storageName));
}, _RecordingListView_onKeyDown = function _RecordingListView_onKeyDown(storageName, event) {
    if (event.key !== 'Enter') {
        return;
    }
    __classPrivateFieldGet(this, _RecordingListView_instances, "m", _RecordingListView_onOpenClick).call(this, storageName, event);
}, _RecordingListView_stopPropagation = function _RecordingListView_stopPropagation(event) {
    event.stopPropagation();
};
customElements.define('devtools-recording-list-view', RecordingListView);
//# sourceMappingURL=RecordingListView.js.map