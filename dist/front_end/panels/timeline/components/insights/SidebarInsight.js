// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export class InsightActivated extends Event {
    constructor(model, insightSetKey) {
        super(InsightActivated.eventName, { bubbles: true, composed: true });
        this.model = model;
        this.insightSetKey = insightSetKey;
    }
}
InsightActivated.eventName = 'insightactivated';
export class InsightDeactivated extends Event {
    constructor() {
        super(InsightDeactivated.eventName, { bubbles: true, composed: true });
    }
}
InsightDeactivated.eventName = 'insightdeactivated';
export class InsightSetHovered extends Event {
    constructor(bounds) {
        super(InsightSetHovered.eventName, { bubbles: true, composed: true });
        this.bounds = bounds;
    }
}
InsightSetHovered.eventName = 'insightsethovered';
export class InsightSetZoom extends Event {
    constructor(bounds) {
        super(InsightSetZoom.eventName, { bubbles: true, composed: true });
        this.bounds = bounds;
    }
}
InsightSetZoom.eventName = 'insightsetzoom';
export class InsightProvideOverlays extends Event {
    constructor(overlays, options) {
        super(InsightProvideOverlays.eventName, { bubbles: true, composed: true });
        this.overlays = overlays;
        this.options = options;
    }
}
InsightProvideOverlays.eventName = 'insightprovideoverlays';
//# sourceMappingURL=SidebarInsight.js.map