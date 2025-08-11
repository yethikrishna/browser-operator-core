// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { createLogger } from '../core/Logger.js';
const logger = createLogger('WebSocketRPCClient');
export class WebSocketRPCClient {
    constructor(options) {
        this.websocket = null;
        this.currentReconnectAttempt = 0;
        this.reconnectTimeoutId = null;
        this.pendingRequests = new Map();
        this.isConnecting = false;
        this.isConnected = false;
        this.eventListeners = new Map();
        this.endpoint = options.endpoint;
        this.secretKey = options.secretKey;
        this.reconnectAttempts = options.reconnectAttempts ?? 3;
        this.reconnectDelay = options.reconnectDelay ?? 1000;
        this.connectionTimeout = options.connectionTimeout ?? 5000;
    }
    async connect() {
        if (this.isConnecting || this.isConnected) {
            logger.warn('Already connecting or connected');
            return;
        }
        this.isConnecting = true;
        return new Promise((resolve, reject) => {
            const connectionTimer = setTimeout(() => {
                this.isConnecting = false;
                reject(new Error('Connection timeout'));
            }, this.connectionTimeout);
            try {
                this.websocket = new WebSocket(this.endpoint);
                this.websocket.onopen = () => {
                    clearTimeout(connectionTimer);
                    this.isConnecting = false;
                    this.isConnected = true;
                    this.currentReconnectAttempt = 0;
                    logger.info('WebSocket connected', { endpoint: this.endpoint, readyState: this.websocket?.readyState });
                    this.emit('connected');
                    // Note: Authentication is handled via the register message in the evaluation protocol
                    resolve();
                };
                this.websocket.onmessage = (event) => {
                    logger.debug('Received WebSocket message:', event.data);
                    this.handleMessage(event);
                };
                this.websocket.onclose = (event) => {
                    this.isConnected = false;
                    logger.warn('WebSocket connection closed', {
                        code: event.code,
                        reason: event.reason,
                        wasClean: event.wasClean,
                        endpoint: this.endpoint
                    });
                    this.emit('disconnected');
                    if (!event.wasClean && this.currentReconnectAttempt < this.reconnectAttempts) {
                        this.scheduleReconnect();
                    }
                };
                this.websocket.onerror = (error) => {
                    clearTimeout(connectionTimer);
                    this.isConnecting = false;
                    const errorDetails = {
                        type: error.type,
                        readyState: this.websocket?.readyState,
                        url: this.endpoint,
                        timestamp: new Date().toISOString(),
                        message: 'WebSocket connection error'
                    };
                    logger.error('WebSocket error:', JSON.stringify(errorDetails));
                    this.emit('error', errorDetails);
                    if (this.isConnecting) {
                        reject(new Error('WebSocket connection failed'));
                    }
                };
            }
            catch (error) {
                clearTimeout(connectionTimer);
                this.isConnecting = false;
                reject(error);
            }
        });
    }
    disconnect() {
        if (this.reconnectTimeoutId) {
            clearTimeout(this.reconnectTimeoutId);
            this.reconnectTimeoutId = null;
        }
        if (this.websocket) {
            this.websocket.close(1000, 'Manual disconnect');
            this.websocket = null;
        }
        this.isConnected = false;
        this.isConnecting = false;
        this.currentReconnectAttempt = 0;
        // Reject all pending requests
        for (const [id, request] of this.pendingRequests) {
            clearTimeout(request.timeout);
            request.reject(new Error('Connection closed'));
        }
        this.pendingRequests.clear();
    }
    async call(method, params, timeout = 30000) {
        if (!this.isConnected) {
            throw new Error('WebSocket not connected');
        }
        const id = this.generateRequestId();
        const request = { id, method, params };
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                this.pendingRequests.delete(id);
                reject(new Error(`RPC call timeout: ${method}`));
            }, timeout);
            this.pendingRequests.set(id, {
                resolve,
                reject,
                timeout: timeoutId,
            });
            try {
                this.websocket.send(JSON.stringify(request));
                logger.debug('Sent RPC request', { method, id });
            }
            catch (error) {
                this.pendingRequests.delete(id);
                clearTimeout(timeoutId);
                reject(error);
            }
        });
    }
    send(message) {
        if (!this.isConnected || !this.websocket) {
            throw new Error('WebSocket not connected');
        }
        this.websocket.send(JSON.stringify(message));
        logger.debug('Sent message:', message);
    }
    isConnectionReady() {
        return this.isConnected && this.websocket?.readyState === WebSocket.OPEN;
    }
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);
    }
    off(event, callback) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.delete(callback);
        }
    }
    emit(event, data) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            for (const callback of listeners) {
                try {
                    callback(data);
                }
                catch (error) {
                    logger.error('Error in event listener:', error);
                }
            }
        }
    }
    handleMessage(event) {
        try {
            const message = JSON.parse(event.data);
            logger.debug('Received WebSocket message', { type: message.type, id: message.id });
            // Check if this is an RPC response (has id and either result or error)
            if (message.id && (message.hasOwnProperty('result') || message.hasOwnProperty('error'))) {
                const response = message;
                const pendingRequest = this.pendingRequests.get(response.id);
                if (!pendingRequest) {
                    logger.warn('Received response for unknown request ID:', response.id);
                    return;
                }
                this.pendingRequests.delete(response.id);
                clearTimeout(pendingRequest.timeout);
                if (response.error) {
                    pendingRequest.reject(new Error(`RPC Error: ${response.error.message} (Code: ${response.error.code})`));
                }
                else {
                    pendingRequest.resolve(response.result);
                }
            }
            else {
                // This is a general WebSocket message (like welcome, evaluation requests, etc.)
                this.emit('message', message);
            }
        }
        catch (error) {
            logger.error('Failed to parse WebSocket message:', error);
        }
    }
    scheduleReconnect() {
        if (this.reconnectTimeoutId) {
            return;
        }
        this.currentReconnectAttempt++;
        const delay = this.reconnectDelay * Math.pow(2, this.currentReconnectAttempt - 1);
        logger.info(`Scheduling reconnect attempt ${this.currentReconnectAttempt}/${this.reconnectAttempts} in ${delay}ms`);
        this.reconnectTimeoutId = setTimeout(() => {
            this.reconnectTimeoutId = null;
            this.connect().catch((error) => {
                logger.error('Reconnect failed:', error);
                if (this.currentReconnectAttempt < this.reconnectAttempts) {
                    this.scheduleReconnect();
                }
                else {
                    logger.error('Max reconnect attempts reached');
                    this.emit('reconnect_failed');
                }
            });
        }, delay);
    }
    generateRequestId() {
        return `rpc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}
//# sourceMappingURL=WebSocketRPCClient.js.map