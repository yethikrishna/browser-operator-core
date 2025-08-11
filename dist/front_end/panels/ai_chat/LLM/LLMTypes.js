// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Core type definitions and interfaces for the unified LLM client system.
 * This file contains all shared types used across the LLM infrastructure.
 */
/**
 * Error types that can occur during LLM calls
 */
export var LLMErrorType;
(function (LLMErrorType) {
    LLMErrorType["JSON_PARSE_ERROR"] = "JSON_PARSE_ERROR";
    LLMErrorType["RATE_LIMIT_ERROR"] = "RATE_LIMIT_ERROR";
    LLMErrorType["NETWORK_ERROR"] = "NETWORK_ERROR";
    LLMErrorType["SERVER_ERROR"] = "SERVER_ERROR";
    LLMErrorType["AUTH_ERROR"] = "AUTH_ERROR";
    LLMErrorType["QUOTA_ERROR"] = "QUOTA_ERROR";
    LLMErrorType["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
})(LLMErrorType || (LLMErrorType = {}));
//# sourceMappingURL=LLMTypes.js.map