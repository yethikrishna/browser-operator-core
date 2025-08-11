// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Type guards for runtime validation
 * Reserved for future use when runtime validation becomes necessary
 */
export class TypeGuards {
    /**
     * Check if value is a ToolExecutionResult
     */
    static isToolExecutionResult(value) {
        return typeof value === 'object' &&
            value !== null &&
            'success' in value &&
            typeof value.success === 'boolean';
    }
    /**
     * Check if value is ScreenshotData
     */
    static isScreenshotData(value) {
        return typeof value === 'object' &&
            value !== null &&
            'dataUrl' in value &&
            'timestamp' in value &&
            typeof value.dataUrl === 'string' &&
            typeof value.timestamp === 'number';
    }
}
//# sourceMappingURL=EvaluationTypes.js.map