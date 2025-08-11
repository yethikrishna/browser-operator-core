// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
export class ObjectWrapper {
    addEventListener(eventType, listener, thisObject) {
        if (!this.listeners) {
            this.listeners = new Map();
        }
        let listenersForEventType = this.listeners.get(eventType);
        if (!listenersForEventType) {
            listenersForEventType = new Set();
            this.listeners.set(eventType, listenersForEventType);
        }
        listenersForEventType.add({ thisObject, listener });
        return { eventTarget: this, eventType, thisObject, listener };
    }
    once(eventType) {
        return new Promise(resolve => {
            const descriptor = this.addEventListener(eventType, event => {
                this.removeEventListener(eventType, descriptor.listener);
                resolve(event.data);
            });
        });
    }
    removeEventListener(eventType, listener, thisObject) {
        const listeners = this.listeners?.get(eventType);
        if (!listeners) {
            return;
        }
        for (const listenerTuple of listeners) {
            if (listenerTuple.listener === listener && listenerTuple.thisObject === thisObject) {
                listenerTuple.disposed = true;
                listeners.delete(listenerTuple);
            }
        }
        if (!listeners.size) {
            this.listeners?.delete(eventType);
        }
    }
    hasEventListeners(eventType) {
        return Boolean(this.listeners?.has(eventType));
    }
    dispatchEventToListeners(eventType, ...[eventData]) {
        const listeners = this.listeners?.get(eventType);
        if (!listeners) {
            return;
        }
        // `eventData` is typed as `Events[T] | undefined`:
        //   - `undefined` when `Events[T]` is void.
        //   - `Events[T]` otherwise.
        // We cast it to `Events[T]` which is the correct type in all instances, as
        // `void` will be cast and used as `undefined`.
        const event = { data: eventData, source: this };
        // Work on a snapshot of the current listeners, callbacks might remove/add
        // new listeners.
        for (const listener of [...listeners]) {
            if (!listener.disposed) {
                listener.listener.call(listener.thisObject, event);
            }
        }
    }
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function eventMixin(base) {
    var _EventHandling_events, _a;
    console.assert(base !== HTMLElement);
    return _a = class EventHandling extends base {
            constructor() {
                super(...arguments);
                _EventHandling_events.set(this, new ObjectWrapper());
            }
            addEventListener(eventType, listener, thisObject) {
                return __classPrivateFieldGet(this, _EventHandling_events, "f").addEventListener(eventType, listener, thisObject);
            }
            once(eventType) {
                return __classPrivateFieldGet(this, _EventHandling_events, "f").once(eventType);
            }
            removeEventListener(eventType, listener, thisObject) {
                __classPrivateFieldGet(this, _EventHandling_events, "f").removeEventListener(eventType, listener, thisObject);
            }
            hasEventListeners(eventType) {
                return __classPrivateFieldGet(this, _EventHandling_events, "f").hasEventListeners(eventType);
            }
            dispatchEventToListeners(eventType, ...eventData) {
                __classPrivateFieldGet(this, _EventHandling_events, "f").dispatchEventToListeners(eventType, ...eventData);
            }
        },
        _EventHandling_events = new WeakMap(),
        _a;
}
//# sourceMappingURL=Object.js.map