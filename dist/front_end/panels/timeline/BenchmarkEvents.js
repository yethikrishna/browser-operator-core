// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export class TraceLoadEvent extends Event {
    constructor(duration) {
        super(TraceLoadEvent.eventName, { bubbles: true, composed: true });
        this.duration = duration;
    }
}
TraceLoadEvent.eventName = 'traceload';
//# sourceMappingURL=BenchmarkEvents.js.map