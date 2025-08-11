// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Abstract base class for tracing providers
 */
export class TracingProvider {
    constructor(enabled = true) {
        this.enabled = true;
        this.enabled = enabled;
    }
    /**
     * Check if tracing is enabled
     */
    isEnabled() {
        return this.enabled;
    }
}
/**
 * No-op tracing provider for when tracing is disabled
 */
export class NoOpTracingProvider extends TracingProvider {
    async initialize() { }
    async createSession() { }
    async createTrace() { }
    async createObservation() { }
    async updateObservation() { }
    async finalizeTrace() { }
    async flush() { }
}
//# sourceMappingURL=TracingProvider.js.map