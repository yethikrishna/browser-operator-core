// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Abstract base class providing common functionality for providers
 */
export class LLMBaseProvider {
    constructor(config = {}) {
        this.config = config;
    }
    /**
     * Helper method to handle provider-specific errors
     */
    handleProviderError(error, context) {
        if (error instanceof Error) {
            return error;
        }
        // Handle fetch errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return new Error(`Network error in ${context}: ${error.message}`);
        }
        // Handle HTTP errors
        if (error.status) {
            return new Error(`HTTP ${error.status} error in ${context}: ${error.message || 'Unknown error'}`);
        }
        return new Error(`Unknown error in ${context}: ${String(error)}`);
    }
}
//# sourceMappingURL=LLMProvider.js.map