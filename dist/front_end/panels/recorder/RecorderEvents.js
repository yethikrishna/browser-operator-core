// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export class ReplayFinishedEvent extends Event {
    constructor() {
        super(ReplayFinishedEvent.eventName, { bubbles: true, composed: true });
    }
}
ReplayFinishedEvent.eventName = 'replayfinished';
export class RecordingStateChangedEvent extends Event {
    constructor(recording) {
        super(RecordingStateChangedEvent.eventName, {
            bubbles: true,
            composed: true,
        });
        this.recording = recording;
    }
}
RecordingStateChangedEvent.eventName = 'recordingstatechanged';
//# sourceMappingURL=RecorderEvents.js.map