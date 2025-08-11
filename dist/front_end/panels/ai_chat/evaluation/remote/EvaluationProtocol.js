// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Error codes
export const ErrorCodes = {
    PARSE_ERROR: -32700,
    INVALID_REQUEST: -32600,
    METHOD_NOT_FOUND: -32601,
    INVALID_PARAMS: -32602,
    INTERNAL_ERROR: -32603,
    // Custom error codes
    TOOL_EXECUTION_ERROR: -32000,
    TIMEOUT_ERROR: -32001,
    AUTHENTICATION_ERROR: -32002,
    RATE_LIMIT_EXCEEDED: -32003,
    INVALID_TOOL: -32004,
    RESOURCE_ERROR: -32005
};
// Type guards
export function isWelcomeMessage(msg) {
    return msg?.type === 'welcome';
}
export function isRegistrationAckMessage(msg) {
    return msg?.type === 'registration_ack';
}
export function isEvaluationRequest(msg) {
    return msg?.jsonrpc === '2.0' && msg?.method === 'evaluate';
}
export function isPongMessage(msg) {
    return msg?.type === 'pong';
}
// Helper functions
export function createRegisterMessage(clientId, capabilities, secretKey) {
    return {
        type: 'register',
        clientId,
        secretKey,
        capabilities
    };
}
export function createReadyMessage() {
    return {
        type: 'ready',
        timestamp: new Date().toISOString()
    };
}
export function createAuthVerifyMessage(clientId, verified) {
    return {
        type: 'auth_verify',
        clientId,
        verified
    };
}
export function createStatusMessage(evaluationId, status, progress, message) {
    return {
        type: 'status',
        evaluationId,
        status,
        progress,
        message
    };
}
export function createSuccessResponse(id, output, executionTime, toolCalls, metadata) {
    return {
        jsonrpc: '2.0',
        result: {
            status: 'success',
            output,
            executionTime,
            toolCalls,
            metadata
        },
        id
    };
}
export function createErrorResponse(id, code, message, data) {
    return {
        jsonrpc: '2.0',
        error: {
            code,
            message,
            data
        },
        id
    };
}
//# sourceMappingURL=EvaluationProtocol.js.map