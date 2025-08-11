var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EventEmitter_emitter, _EventEmitter_handlers;
/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import mitt from '../../third_party/mitt/mitt.js';
import { disposeSymbol } from '../util/disposable.js';
/**
 * The EventEmitter class that many Puppeteer classes extend.
 *
 * @remarks
 *
 * This allows you to listen to events that Puppeteer classes fire and act
 * accordingly. Therefore you'll mostly use {@link EventEmitter.on | on} and
 * {@link EventEmitter.off | off} to bind
 * and unbind to event listeners.
 *
 * @public
 */
export class EventEmitter {
    /**
     * If you pass an emitter, the returned emitter will wrap the passed emitter.
     *
     * @internal
     */
    constructor(emitter = mitt(new Map())) {
        _EventEmitter_emitter.set(this, void 0);
        _EventEmitter_handlers.set(this, new Map());
        __classPrivateFieldSet(this, _EventEmitter_emitter, emitter, "f");
    }
    /**
     * Bind an event listener to fire when an event occurs.
     * @param type - the event type you'd like to listen to. Can be a string or symbol.
     * @param handler - the function to be called when the event occurs.
     * @returns `this` to enable you to chain method calls.
     */
    on(type, handler) {
        const handlers = __classPrivateFieldGet(this, _EventEmitter_handlers, "f").get(type);
        if (handlers === undefined) {
            __classPrivateFieldGet(this, _EventEmitter_handlers, "f").set(type, [handler]);
        }
        else {
            handlers.push(handler);
        }
        __classPrivateFieldGet(this, _EventEmitter_emitter, "f").on(type, handler);
        return this;
    }
    /**
     * Remove an event listener from firing.
     * @param type - the event type you'd like to stop listening to.
     * @param handler - the function that should be removed.
     * @returns `this` to enable you to chain method calls.
     */
    off(type, handler) {
        const handlers = __classPrivateFieldGet(this, _EventEmitter_handlers, "f").get(type) ?? [];
        if (handler === undefined) {
            for (const handler of handlers) {
                __classPrivateFieldGet(this, _EventEmitter_emitter, "f").off(type, handler);
            }
            __classPrivateFieldGet(this, _EventEmitter_handlers, "f").delete(type);
            return this;
        }
        const index = handlers.lastIndexOf(handler);
        if (index > -1) {
            __classPrivateFieldGet(this, _EventEmitter_emitter, "f").off(type, ...handlers.splice(index, 1));
        }
        return this;
    }
    /**
     * Emit an event and call any associated listeners.
     *
     * @param type - the event you'd like to emit
     * @param eventData - any data you'd like to emit with the event
     * @returns `true` if there are any listeners, `false` if there are not.
     */
    emit(type, event) {
        __classPrivateFieldGet(this, _EventEmitter_emitter, "f").emit(type, event);
        return this.listenerCount(type) > 0;
    }
    /**
     * Like `on` but the listener will only be fired once and then it will be removed.
     * @param type - the event you'd like to listen to
     * @param handler - the handler function to run when the event occurs
     * @returns `this` to enable you to chain method calls.
     */
    once(type, handler) {
        const onceHandler = eventData => {
            handler(eventData);
            this.off(type, onceHandler);
        };
        return this.on(type, onceHandler);
    }
    /**
     * Gets the number of listeners for a given event.
     *
     * @param type - the event to get the listener count for
     * @returns the number of listeners bound to the given event
     */
    listenerCount(type) {
        return __classPrivateFieldGet(this, _EventEmitter_handlers, "f").get(type)?.length || 0;
    }
    /**
     * Removes all listeners. If given an event argument, it will remove only
     * listeners for that event.
     *
     * @param type - the event to remove listeners for.
     * @returns `this` to enable you to chain method calls.
     */
    removeAllListeners(type) {
        if (type !== undefined) {
            return this.off(type);
        }
        this[disposeSymbol]();
        return this;
    }
    /**
     * @internal
     */
    [(_EventEmitter_emitter = new WeakMap(), _EventEmitter_handlers = new WeakMap(), disposeSymbol)]() {
        for (const [type, handlers] of __classPrivateFieldGet(this, _EventEmitter_handlers, "f")) {
            for (const handler of handlers) {
                __classPrivateFieldGet(this, _EventEmitter_emitter, "f").off(type, handler);
            }
        }
        __classPrivateFieldGet(this, _EventEmitter_handlers, "f").clear();
    }
}
//# sourceMappingURL=EventEmitter.js.map
//# sourceMappingURL=EventEmitter.js.map