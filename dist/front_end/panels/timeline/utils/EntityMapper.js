// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _EntityMapper_instances, _EntityMapper_parsedTrace, _EntityMapper_entityMappings, _EntityMapper_firstPartyEntity, _EntityMapper_thirdPartyEvents, _EntityMapper_resolvedCallFrames, _EntityMapper_findFirstPartyEntity, _EntityMapper_getThirdPartyEvents;
import * as Trace from '../../../models/trace/trace.js';
export class EntityMapper {
    constructor(parsedTrace) {
        _EntityMapper_instances.add(this);
        _EntityMapper_parsedTrace.set(this, void 0);
        _EntityMapper_entityMappings.set(this, void 0);
        _EntityMapper_firstPartyEntity.set(this, void 0);
        _EntityMapper_thirdPartyEvents.set(this, []);
        /**
         * When resolving urls and updating our entity mapping in the
         * SourceMapsResolver, a single call frame can appear multiple times
         * as different cpu profile nodes. To avoid duplicate work on the
         * same CallFrame, we can keep track of them.
         */
        _EntityMapper_resolvedCallFrames.set(this, new Set());
        __classPrivateFieldSet(this, _EntityMapper_parsedTrace, parsedTrace, "f");
        __classPrivateFieldSet(this, _EntityMapper_entityMappings, __classPrivateFieldGet(this, _EntityMapper_parsedTrace, "f").Renderer.entityMappings, "f");
        __classPrivateFieldSet(this, _EntityMapper_firstPartyEntity, __classPrivateFieldGet(this, _EntityMapper_instances, "m", _EntityMapper_findFirstPartyEntity).call(this), "f");
        __classPrivateFieldSet(this, _EntityMapper_thirdPartyEvents, __classPrivateFieldGet(this, _EntityMapper_instances, "m", _EntityMapper_getThirdPartyEvents).call(this), "f");
    }
    /**
     * Returns an entity for a given event if any.
     */
    entityForEvent(event) {
        return __classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").entityByEvent.get(event) ?? null;
    }
    /**
     * Returns trace events that correspond with a given entity if any.
     */
    eventsForEntity(entity) {
        return __classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").eventsByEntity.get(entity) ?? [];
    }
    firstPartyEntity() {
        return __classPrivateFieldGet(this, _EntityMapper_firstPartyEntity, "f");
    }
    thirdPartyEvents() {
        return __classPrivateFieldGet(this, _EntityMapper_thirdPartyEvents, "f");
    }
    mappings() {
        return __classPrivateFieldGet(this, _EntityMapper_entityMappings, "f");
    }
    /**
     * This updates entity mapping given a callFrame and sourceURL (newly resolved),
     * updating both eventsByEntity and entityByEvent. The call frame provides us the
     * URL and sourcemap source location that events map to. This describes the exact events we
     * want to update. We then update the events with the new sourceURL.
     *
     * compiledURLs -> the actual file's url (e.g. my-big-bundle.min.js)
     * sourceURLs -> the resolved urls (e.g. react.development.js, my-app.ts)
     * @param callFrame
     * @param sourceURL
     */
    updateSourceMapEntities(callFrame, sourceURL) {
        // Avoid the extra work, if we have already resolved this callFrame.
        if (__classPrivateFieldGet(this, _EntityMapper_resolvedCallFrames, "f").has(callFrame)) {
            return;
        }
        const compiledURL = callFrame.url;
        const currentEntity = Trace.Handlers.Helpers.getEntityForUrl(compiledURL, __classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").createdEntityCache);
        const resolvedEntity = Trace.Handlers.Helpers.getEntityForUrl(sourceURL, __classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").createdEntityCache);
        // If the entity changed, then we should update our caches. If we don't have a currentEntity,
        // we can't do much with that. Additionally without our current entity, we don't have a reference to the related
        // events so there are no relationships to be made.
        if ((resolvedEntity === currentEntity) || (!currentEntity || !resolvedEntity)) {
            return;
        }
        const currentEntityEvents = (currentEntity && __classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").eventsByEntity.get(currentEntity)) ?? [];
        // The events of the entity that match said source location.
        const sourceLocationEvents = [];
        // The events that don't match the source location, but that we should keep mapped to its current entity.
        const unrelatedEvents = [];
        currentEntityEvents?.forEach(e => {
            const stackTrace = Trace.Helpers.Trace.getZeroIndexedStackTraceInEventPayload(e);
            const cf = stackTrace?.at(0);
            const matchesCallFrame = cf && Trace.Helpers.Trace.isMatchingCallFrame(cf, callFrame);
            if (matchesCallFrame) {
                sourceLocationEvents.push(e);
            }
            else {
                unrelatedEvents.push(e);
            }
        });
        // Update current entity.
        __classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").eventsByEntity.set(currentEntity, unrelatedEvents);
        // Map the source location events to the new entity.
        __classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").eventsByEntity.set(resolvedEntity, sourceLocationEvents);
        sourceLocationEvents.forEach(e => {
            __classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").entityByEvent.set(e, resolvedEntity);
        });
        // Update our CallFrame cache when we've got a resolved entity.
        __classPrivateFieldGet(this, _EntityMapper_resolvedCallFrames, "f").add(callFrame);
    }
    // Update entities with proper Chrome Extension names.
    updateExtensionEntitiesWithName(executionContextNamesByOrigin) {
        const entities = Array.from(__classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").eventsByEntity.keys());
        for (const [origin, name] of executionContextNamesByOrigin) {
            // In makeUpChromeExtensionEntity, the extension origin is set as the only domain for the entity.
            const entity = entities.find(e => e.domains[0] === origin);
            if (entity) {
                entity.name = entity.company = name;
            }
        }
    }
}
_EntityMapper_parsedTrace = new WeakMap(), _EntityMapper_entityMappings = new WeakMap(), _EntityMapper_firstPartyEntity = new WeakMap(), _EntityMapper_thirdPartyEvents = new WeakMap(), _EntityMapper_resolvedCallFrames = new WeakMap(), _EntityMapper_instances = new WeakSet(), _EntityMapper_findFirstPartyEntity = function _EntityMapper_findFirstPartyEntity() {
    // As a starting point, we consider the first navigation as the 1P.
    const nav = Array.from(__classPrivateFieldGet(this, _EntityMapper_parsedTrace, "f").Meta.navigationsByNavigationId.values()).sort((a, b) => a.ts - b.ts)[0];
    const firstPartyUrl = nav?.args.data?.documentLoaderURL ?? __classPrivateFieldGet(this, _EntityMapper_parsedTrace, "f").Meta.mainFrameURL;
    if (!firstPartyUrl) {
        return null;
    }
    return Trace.Handlers.Helpers.getEntityForUrl(firstPartyUrl, __classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").createdEntityCache) ?? null;
}, _EntityMapper_getThirdPartyEvents = function _EntityMapper_getThirdPartyEvents() {
    const entries = Array.from(__classPrivateFieldGet(this, _EntityMapper_entityMappings, "f").eventsByEntity.entries());
    const thirdPartyEvents = entries.flatMap(([entity, events]) => {
        return entity !== __classPrivateFieldGet(this, _EntityMapper_firstPartyEntity, "f") ? events : [];
    });
    return thirdPartyEvents;
};
//# sourceMappingURL=EntityMapper.js.map