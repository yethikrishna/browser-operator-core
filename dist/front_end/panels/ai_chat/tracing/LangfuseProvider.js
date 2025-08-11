// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { createLogger } from '../core/Logger.js';
import { TracingProvider } from './TracingProvider.js';
const logger = createLogger('LangfuseProvider');
/**
 * Langfuse implementation of TracingProvider
 */
export class LangfuseProvider extends TracingProvider {
    constructor(endpoint, publicKey, secretKey, enabled = true) {
        super(enabled);
        this.eventBuffer = [];
        this.batchSize = 20; // Reasonable batch size for hierarchical tracing
        this.flushInterval = 5000; // 5 seconds - less frequent auto-flush
        this.maxBufferSize = 1000; // Prevent memory exhaustion
        this.maxRetryEvents = 100; // Keep only recent events on buffer overflow
        this.observationStore = new Map();
        // Thread safety for buffer operations
        this.isFlushInProgress = false;
        this.isTimerStarted = false;
        this.lastCleanup = Date.now();
        this.maxObservationAge = 24 * 60 * 60 * 1000; // 24 hours
        this.endpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }
    async initialize() {
        if (!this.enabled)
            return;
        logger.info('Initializing Langfuse provider', {
            endpoint: this.endpoint,
            publicKey: this.publicKey.substring(0, 10) + '...'
        });
        // Stop existing timer if any to prevent memory leaks
        this.stopAutoFlush();
        // Start auto-flush timer
        this.startAutoFlush();
    }
    async createSession(sessionId, metadata) {
        if (!this.enabled)
            return;
        // Sessions are implicitly created when traces reference them
        logger.debug('Session will be created implicitly', { sessionId });
    }
    async createTrace(traceId, sessionId, name, input, metadata, userId, tags) {
        if (!this.enabled)
            return;
        const event = {
            id: this.generateEventId(),
            timestamp: new Date().toISOString(),
            type: 'trace-create',
            body: {
                id: traceId,
                sessionId,
                name,
                timestamp: new Date().toISOString(),
                ...(input !== undefined && { input: this.sanitizeObservationData(input) }),
                ...(metadata && { metadata: this.sanitizeObservationData(metadata) }),
                ...(userId && { userId }),
                ...(tags && tags.length > 0 && { tags })
            }
        };
        this.addEvent(event);
    }
    async createObservation(observation, traceId) {
        if (!this.enabled) {
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Tracing disabled, skipping observation creation:`, {
                observationId: observation.id,
                name: observation.name,
                type: observation.type
            });
            return;
        }
        console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Creating observation:`, {
            observationId: observation.id,
            name: observation.name,
            type: observation.type,
            traceId,
            parentObservationId: observation.parentObservationId,
            metadata: observation.metadata
        });
        // Determine the correct event type based on observation type
        let eventType;
        switch (observation.type) {
            case 'span':
                eventType = 'span-create';
                break;
            case 'event':
                eventType = 'event-create';
                break;
            case 'generation':
                eventType = 'generation-create';
                break;
            default:
                eventType = 'event-create'; // Default fallback
        }
        const startTime = observation.startTime || new Date();
        const body = {
            id: observation.id,
            traceId,
            name: observation.name || 'Unnamed Observation',
            startTime: startTime.toISOString(), // Required field for all observations
            ...(observation.parentObservationId && { parentObservationId: observation.parentObservationId }),
            ...(observation.input !== undefined && { input: this.sanitizeObservationData(observation.input) }),
            ...(observation.output !== undefined && { output: this.sanitizeObservationData(observation.output) }),
            ...(observation.metadata && { metadata: this.sanitizeObservationData(observation.metadata) }),
            ...(observation.error && { level: 'ERROR', statusMessage: observation.error })
        };
        // Add type-specific fields
        if (observation.type === 'span') {
            if (observation.endTime) {
                body.endTime = observation.endTime.toISOString();
            }
        }
        if (observation.type === 'generation') {
            if (observation.model) {
                body.model = observation.model;
            }
            if (observation.modelParameters) {
                body.modelParameters = observation.modelParameters;
            }
            if (observation.usage) {
                body.usage = {
                    promptTokens: observation.usage.promptTokens,
                    completionTokens: observation.usage.completionTokens,
                    totalTokens: observation.usage.totalTokens
                };
            }
            // Generation uses completionStartTime
            body.completionStartTime = startTime.toISOString();
        }
        const event = {
            id: this.generateEventId(),
            timestamp: new Date().toISOString(),
            type: eventType, // Use correct Langfuse event type
            body,
            metadata: observation.metadata
        };
        this.addEvent(event);
        // Store observation data for potential updates
        this.observationStore.set(observation.id, { observation: { ...observation }, traceId });
        // Periodic cleanup of old observations
        this.cleanupObservationStore();
        console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Successfully created observation:`, {
            observationId: observation.id,
            eventType,
            stored: true,
            eventId: event.id
        });
    }
    async updateObservation(observationId, updates) {
        if (!this.enabled) {
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Tracing disabled, skipping observation update:`, {
                observationId,
                updates
            });
            return;
        }
        console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Updating observation:`, {
            observationId,
            updates,
            hasEndTime: !!updates.endTime,
            hasOutput: !!updates.output,
            hasError: !!updates.error
        });
        // Get the stored observation data
        const stored = this.observationStore.get(observationId);
        if (!stored) {
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Cannot update observation - not found:`, {
                observationId,
                availableObservations: Array.from(this.observationStore.keys())
            });
            logger.warn('Cannot update observation - original observation not found', { observationId });
            return;
        }
        // Merge updates with original observation data
        const updatedObservation = {
            ...stored.observation,
            ...updates,
            // Ensure ID stays the same
            id: observationId
        };
        // Determine the correct event type based on observation type
        let eventType;
        switch (updatedObservation.type) {
            case 'span':
                eventType = 'span-create';
                break;
            case 'event':
                eventType = 'event-create';
                break;
            case 'generation':
                eventType = 'generation-create';
                break;
            default:
                eventType = 'event-create';
        }
        const startTime = updatedObservation.startTime || new Date();
        const body = {
            id: updatedObservation.id,
            traceId: stored.traceId,
            name: updatedObservation.name || 'Unnamed Observation',
            startTime: startTime.toISOString(),
            ...(updatedObservation.parentObservationId && { parentObservationId: updatedObservation.parentObservationId }),
            ...(updatedObservation.input !== undefined && { input: this.sanitizeObservationData(updatedObservation.input) }),
            ...(updatedObservation.output !== undefined && { output: this.sanitizeObservationData(updatedObservation.output) }),
            ...(updatedObservation.metadata && { metadata: this.sanitizeObservationData(updatedObservation.metadata) }),
            ...(updatedObservation.error && { level: 'ERROR', statusMessage: updatedObservation.error })
        };
        // Add type-specific fields
        if (updatedObservation.type === 'span') {
            if (updatedObservation.endTime) {
                body.endTime = updatedObservation.endTime.toISOString();
            }
        }
        if (updatedObservation.type === 'generation') {
            if (updatedObservation.model) {
                body.model = updatedObservation.model;
            }
            if (updatedObservation.modelParameters) {
                body.modelParameters = updatedObservation.modelParameters;
            }
            if (updatedObservation.usage) {
                body.usage = {
                    promptTokens: updatedObservation.usage.promptTokens,
                    completionTokens: updatedObservation.usage.completionTokens,
                    totalTokens: updatedObservation.usage.totalTokens
                };
            }
            // Generation uses completionStartTime
            if (updatedObservation.endTime) {
                body.endTime = updatedObservation.endTime.toISOString();
            }
        }
        const event = {
            id: this.generateEventId(),
            timestamp: new Date().toISOString(),
            type: eventType,
            body,
            metadata: updatedObservation.metadata
        };
        this.addEvent(event);
        // Update stored observation data
        this.observationStore.set(observationId, { observation: updatedObservation, traceId: stored.traceId });
        console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Successfully updated observation:`, {
            observationId,
            eventType,
            eventId: event.id,
            hasEndTime: !!updatedObservation.endTime,
            hasOutput: !!updatedObservation.output,
            hasError: !!updatedObservation.error
        });
        logger.debug('Updated observation', { observationId, updates });
    }
    async finalizeTrace(traceId, output, metadata) {
        if (!this.enabled)
            return;
        // Create a trace-create event with output to update the trace
        const event = {
            id: this.generateEventId(),
            timestamp: new Date().toISOString(),
            type: 'trace-create',
            body: {
                id: traceId,
                timestamp: new Date().toISOString(),
                ...(output !== undefined && { output: this.sanitizeObservationData(output) }),
                ...(metadata && { metadata: this.sanitizeObservationData(metadata) })
            }
        };
        this.addEvent(event);
        // Flush immediately when trace is finalized
        await this.flush();
    }
    async flush() {
        // Return existing flush promise if one is in progress
        if (this.isFlushInProgress && this.flushPromise) {
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Flush already in progress, waiting...`);
            return this.flushPromise;
        }
        if (!this.enabled || this.eventBuffer.length === 0) {
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Flush called but skipped:`, {
                enabled: this.enabled,
                bufferLength: this.eventBuffer.length
            });
            return;
        }
        this.isFlushInProgress = true;
        this.flushPromise = this.performFlush();
        try {
            await this.flushPromise;
        }
        finally {
            this.isFlushInProgress = false;
            this.flushPromise = undefined;
        }
    }
    async performFlush() {
        console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Starting atomic flush of ${this.eventBuffer.length} events`);
        // Atomic buffer clear using splice - prevents race conditions
        const events = this.eventBuffer.splice(0);
        if (events.length === 0) {
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: No events to flush after atomic clear`);
            return;
        }
        // Log event types being flushed
        const eventSummary = events.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
        }, {});
        console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Event types being flushed:`, eventSummary);
        try {
            await this.sendBatch(events);
            logger.debug(`Flushed ${events.length} events to Langfuse`);
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Successfully flushed ${events.length} events`);
        }
        catch (error) {
            logger.error('Failed to flush events to Langfuse', error);
            console.error(`[HIERARCHICAL_TRACING] LangfuseProvider: Failed to flush events:`, error);
            // Re-add events to front maintaining chronological order
            this.eventBuffer.unshift(...events);
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Restored ${events.length} events to buffer`);
            throw error;
        }
    }
    sanitizeObservationData(data) {
        if (data === null || data === undefined)
            return data;
        // Handle primitive types
        if (typeof data !== 'object') {
            return typeof data === 'string' && data.length > 5000 ?
                data.substring(0, 5000) + '... [truncated]' : data;
        }
        // Handle arrays
        if (Array.isArray(data)) {
            return data.slice(0, 100).map(item => this.sanitizeObservationData(item)); // Limit array size
        }
        // Handle objects - create a new clean object
        const sanitized = {};
        const seen = new WeakSet();
        for (const [key, value] of Object.entries(data)) {
            // Skip problematic keys that often cause circular references
            if (key === 'agentSession' && value && typeof value === 'object') {
                // Keep only essential agentSession data
                sanitized[key] = {
                    sessionId: value.sessionId,
                    agentName: value.agentName,
                    status: value.status,
                    messageCount: value.messages?.length || 0,
                    startTime: value.startTime,
                    endTime: value.endTime
                };
                continue;
            }
            // Skip DOM elements and functions
            if (value && typeof value === 'object') {
                if (seen.has(value))
                    continue; // Skip circular refs
                if (value.nodeType || value.constructor?.name === 'HTMLElement')
                    continue;
                if (value.constructor?.name?.includes('Promise'))
                    continue;
                if (value.constructor?.name?.includes('Function'))
                    continue;
                seen.add(value);
            }
            // Recursively sanitize nested objects
            sanitized[key] = this.sanitizeObservationData(value);
        }
        return sanitized;
    }
    safeStringify(obj) {
        const seen = new WeakSet();
        return JSON.stringify(obj, (key, value) => {
            // Skip circular references
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return '[Circular Reference]';
                }
                seen.add(value);
            }
            // Truncate very large strings to prevent payload bloat
            if (typeof value === 'string' && value.length > 10000) {
                return value.substring(0, 10000) + '... [truncated]';
            }
            // Remove problematic properties that often contain circular refs
            if (key === 'agentSession' && typeof value === 'object') {
                // Keep only essential agentSession data for tracing
                return {
                    agentName: value.agentName,
                    sessionId: value.sessionId,
                    messageCount: value.messages?.length || 0,
                    status: value.status
                };
            }
            // Remove DOM elements and complex objects that can't be serialized
            if (value && typeof value === 'object') {
                if (value.nodeType || value.constructor?.name === 'HTMLElement') {
                    return '[DOM Element]';
                }
                if (value.constructor?.name?.includes('Promise')) {
                    return '[Promise]';
                }
                if (value.constructor?.name?.includes('Function')) {
                    return '[Function]';
                }
            }
            return value;
        });
    }
    async sendBatch(events) {
        const batch = {
            batch: events,
            metadata: {
                source: 'devtools-ai-chat',
                version: '1.0.0'
            }
        };
        let bodyString;
        try {
            bodyString = this.safeStringify(batch);
        }
        catch (error) {
            logger.error('Failed to serialize batch for Langfuse ingestion', error);
            console.error(`[HIERARCHICAL_TRACING] LangfuseProvider: Serialization failed:`, error);
            throw new Error(`Failed to serialize tracing data: ${error instanceof Error ? error.message : String(error)}`);
        }
        const response = await fetch(`${this.endpoint}/api/public/ingestion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${this.publicKey}:${this.secretKey}`)
            },
            body: bodyString
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Langfuse ingestion failed: ${response.status} ${errorText}`);
        }
    }
    addEvent(event) {
        // Implement buffer size limits to prevent memory exhaustion
        if (this.eventBuffer.length >= this.maxBufferSize) {
            const discarded = this.eventBuffer.length - this.maxRetryEvents;
            this.eventBuffer.splice(0, discarded);
            logger.warn(`Buffer overflow: discarded ${discarded} oldest events`, {
                maxBufferSize: this.maxBufferSize,
                maxRetryEvents: this.maxRetryEvents
            });
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Buffer overflow, discarded ${discarded} events`);
        }
        console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Adding event to buffer:`, {
            eventType: event.type,
            eventId: event.id,
            bufferSizeBefore: this.eventBuffer.length,
            bufferSizeAfter: this.eventBuffer.length + 1,
            batchSize: this.batchSize
        });
        logger.debug('Adding event to buffer', {
            eventType: event.type,
            eventId: event.id,
            bufferSize: this.eventBuffer.length + 1
        });
        this.eventBuffer.push(event);
        if (this.eventBuffer.length >= this.batchSize) {
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Buffer full, triggering auto-flush`);
            logger.debug('Buffer full, triggering auto-flush');
            this.flush().catch(error => {
                logger.error('Auto-flush failed', error);
            });
        }
        else {
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Buffer not full yet:`, {
                currentSize: this.eventBuffer.length,
                batchSize: this.batchSize,
                remaining: this.batchSize - this.eventBuffer.length
            });
        }
    }
    startAutoFlush() {
        if (this.isTimerStarted) {
            logger.warn('Auto-flush timer already started, skipping');
            return;
        }
        this.isTimerStarted = true;
        this.flushTimer = window.setInterval(() => {
            this.flush().catch(error => {
                logger.error('Periodic flush failed', error);
            });
        }, this.flushInterval);
        logger.debug('Auto-flush timer started', { interval: this.flushInterval });
    }
    stopAutoFlush() {
        if (this.flushTimer) {
            window.clearInterval(this.flushTimer);
            this.flushTimer = undefined;
        }
        this.isTimerStarted = false;
        logger.debug('Auto-flush timer stopped');
    }
    generateEventId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }
    cleanupObservationStore() {
        const now = Date.now();
        // Only cleanup every hour to avoid performance impact
        if (now - this.lastCleanup < 60 * 60 * 1000)
            return;
        let cleaned = 0;
        for (const [observationId, stored] of this.observationStore.entries()) {
            const age = now - (stored.observation.startTime?.getTime() || 0);
            if (age > this.maxObservationAge) {
                this.observationStore.delete(observationId);
                cleaned++;
            }
        }
        this.lastCleanup = now;
        if (cleaned > 0) {
            logger.info(`Cleaned up ${cleaned} old observations from store`);
            console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Cleaned up ${cleaned} old observations`);
        }
    }
    /**
     * Cleanup method to stop auto-flush timer and clean resources
     */
    destroy() {
        logger.info('Destroying LangfuseProvider');
        // Stop timer
        this.stopAutoFlush();
        // Clear observation store to prevent memory leaks
        this.observationStore.clear();
        // Final flush attempt
        this.flush().catch(error => {
            logger.error('Final flush failed during destroy', error);
        });
        console.log(`[HIERARCHICAL_TRACING] LangfuseProvider: Destroyed with ${this.eventBuffer.length} remaining events`);
    }
}
//# sourceMappingURL=LangfuseProvider.js.map