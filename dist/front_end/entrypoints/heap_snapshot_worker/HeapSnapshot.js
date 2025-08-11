/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
var _HeapSnapshotNodeIndexProvider_node, _HeapSnapshotEdgeIndexProvider_edge, _HeapSnapshotRetainerEdgeIndexProvider_retainerEdge, _HeapSnapshotEdgeIterator_sourceNode, _HeapSnapshotRetainerEdge_instances, _HeapSnapshotRetainerEdge_retainerIndexInternal, _HeapSnapshotRetainerEdge_globalEdgeIndex, _HeapSnapshotRetainerEdge_retainingNodeIndex, _HeapSnapshotRetainerEdge_edgeInstance, _HeapSnapshotRetainerEdge_nodeInstance, _HeapSnapshotRetainerEdge_distance, _HeapSnapshotRetainerEdgeIterator_retainersEnd, _HeapSnapshotNode_instances, _HeapSnapshotNode_detachednessAndClassIndex, _HeapSnapshotNode_setDetachednessAndClassIndex, _HeapSnapshotNodeIterator_nodesLength, _HeapSnapshotIndexRangeIterator_itemProvider, _HeapSnapshotIndexRangeIterator_indexes, _HeapSnapshotIndexRangeIterator_position, _HeapSnapshotFilteredIterator_iterator, _HeapSnapshotFilteredIterator_filter, _HeapSnapshotProgress_dispatcher, _HeapSnapshot_instances, _HeapSnapshot_metaNode, _HeapSnapshot_rawSamples, _HeapSnapshot_samples, _HeapSnapshot_locations, _HeapSnapshot_progress, _HeapSnapshot_noDistance, _HeapSnapshot_snapshotDiffs, _HeapSnapshot_aggregatesForDiffInternal, _HeapSnapshot_aggregates, _HeapSnapshot_aggregatesSortedFlags, _HeapSnapshot_nodeEdgeCountOffset, _HeapSnapshot_locationIndexOffset, _HeapSnapshot_locationScriptIdOffset, _HeapSnapshot_locationLineOffset, _HeapSnapshot_locationColumnOffset, _HeapSnapshot_locationFieldCount, _HeapSnapshot_edgeCount, _HeapSnapshot_allocationProfile, _HeapSnapshot_locationMap, _HeapSnapshot_ignoredNodesInRetainersView, _HeapSnapshot_ignoredEdgesInRetainersView, _HeapSnapshot_nodeDistancesForRetainersView, _HeapSnapshot_edgeNamesThatAreNotWeakMaps, _HeapSnapshot_interfaceNames, _HeapSnapshot_interfaceDefinitions, _HeapSnapshot_updateIgnoredEdgesInRetainersView, _HeapSnapshotItemProvider_indexProvider, _HeapSnapshotItemProvider_isEmptyInternal, _HeapSnapshotItemProvider_sortedPrefixLength, _HeapSnapshotItemProvider_sortedSuffixLength, _JSHeapSnapshot_instances, _JSHeapSnapshot_statistics, _JSHeapSnapshot_hasUserRoots, _JSHeapSnapshotNode_instances, _a, _JSHeapSnapshotNode_plainObjectName;
/* eslint-disable rulesdir/prefer-private-class-members */
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as HeapSnapshotModel from '../../models/heap_snapshot_model/heap_snapshot_model.js';
import { AllocationProfile } from './AllocationProfile.js';
export class HeapSnapshotEdge {
    constructor(snapshot, edgeIndex) {
        this.snapshot = snapshot;
        this.edges = snapshot.containmentEdges;
        this.edgeIndex = edgeIndex || 0;
    }
    clone() {
        return new HeapSnapshotEdge(this.snapshot, this.edgeIndex);
    }
    hasStringName() {
        throw new Error('Not implemented');
    }
    name() {
        throw new Error('Not implemented');
    }
    node() {
        return this.snapshot.createNode(this.nodeIndex());
    }
    nodeIndex() {
        if (typeof this.snapshot.edgeToNodeOffset === 'undefined') {
            throw new Error('edgeToNodeOffset is undefined');
        }
        return this.edges.getValue(this.edgeIndex + this.snapshot.edgeToNodeOffset);
    }
    toString() {
        return 'HeapSnapshotEdge: ' + this.name();
    }
    type() {
        return this.snapshot.edgeTypes[this.rawType()];
    }
    itemIndex() {
        return this.edgeIndex;
    }
    serialize() {
        return new HeapSnapshotModel.HeapSnapshotModel.Edge(this.name(), this.node().serialize(), this.type(), this.edgeIndex);
    }
    rawType() {
        if (typeof this.snapshot.edgeTypeOffset === 'undefined') {
            throw new Error('edgeTypeOffset is undefined');
        }
        return this.edges.getValue(this.edgeIndex + this.snapshot.edgeTypeOffset);
    }
    isInternal() {
        throw new Error('Not implemented');
    }
    isInvisible() {
        throw new Error('Not implemented');
    }
    isWeak() {
        throw new Error('Not implemented');
    }
    getValueForSorting(_fieldName) {
        throw new Error('Not implemented');
    }
    nameIndex() {
        throw new Error('Not implemented');
    }
}
export class HeapSnapshotNodeIndexProvider {
    constructor(snapshot) {
        _HeapSnapshotNodeIndexProvider_node.set(this, void 0);
        __classPrivateFieldSet(this, _HeapSnapshotNodeIndexProvider_node, snapshot.createNode(), "f");
    }
    itemForIndex(index) {
        __classPrivateFieldGet(this, _HeapSnapshotNodeIndexProvider_node, "f").nodeIndex = index;
        return __classPrivateFieldGet(this, _HeapSnapshotNodeIndexProvider_node, "f");
    }
}
_HeapSnapshotNodeIndexProvider_node = new WeakMap();
export class HeapSnapshotEdgeIndexProvider {
    constructor(snapshot) {
        _HeapSnapshotEdgeIndexProvider_edge.set(this, void 0);
        __classPrivateFieldSet(this, _HeapSnapshotEdgeIndexProvider_edge, snapshot.createEdge(0), "f");
    }
    itemForIndex(index) {
        __classPrivateFieldGet(this, _HeapSnapshotEdgeIndexProvider_edge, "f").edgeIndex = index;
        return __classPrivateFieldGet(this, _HeapSnapshotEdgeIndexProvider_edge, "f");
    }
}
_HeapSnapshotEdgeIndexProvider_edge = new WeakMap();
export class HeapSnapshotRetainerEdgeIndexProvider {
    constructor(snapshot) {
        _HeapSnapshotRetainerEdgeIndexProvider_retainerEdge.set(this, void 0);
        __classPrivateFieldSet(this, _HeapSnapshotRetainerEdgeIndexProvider_retainerEdge, snapshot.createRetainingEdge(0), "f");
    }
    itemForIndex(index) {
        __classPrivateFieldGet(this, _HeapSnapshotRetainerEdgeIndexProvider_retainerEdge, "f").setRetainerIndex(index);
        return __classPrivateFieldGet(this, _HeapSnapshotRetainerEdgeIndexProvider_retainerEdge, "f");
    }
}
_HeapSnapshotRetainerEdgeIndexProvider_retainerEdge = new WeakMap();
export class HeapSnapshotEdgeIterator {
    constructor(node) {
        _HeapSnapshotEdgeIterator_sourceNode.set(this, void 0);
        __classPrivateFieldSet(this, _HeapSnapshotEdgeIterator_sourceNode, node, "f");
        this.edge = node.snapshot.createEdge(node.edgeIndexesStart());
    }
    hasNext() {
        return this.edge.edgeIndex < __classPrivateFieldGet(this, _HeapSnapshotEdgeIterator_sourceNode, "f").edgeIndexesEnd();
    }
    item() {
        return this.edge;
    }
    next() {
        if (typeof this.edge.snapshot.edgeFieldsCount === 'undefined') {
            throw new Error('edgeFieldsCount is undefined');
        }
        this.edge.edgeIndex += this.edge.snapshot.edgeFieldsCount;
    }
}
_HeapSnapshotEdgeIterator_sourceNode = new WeakMap();
export class HeapSnapshotRetainerEdge {
    constructor(snapshot, retainerIndex) {
        _HeapSnapshotRetainerEdge_instances.add(this);
        _HeapSnapshotRetainerEdge_retainerIndexInternal.set(this, void 0);
        _HeapSnapshotRetainerEdge_globalEdgeIndex.set(this, void 0);
        _HeapSnapshotRetainerEdge_retainingNodeIndex.set(this, void 0);
        _HeapSnapshotRetainerEdge_edgeInstance.set(this, void 0);
        _HeapSnapshotRetainerEdge_nodeInstance.set(this, void 0);
        this.snapshot = snapshot;
        this.setRetainerIndex(retainerIndex);
    }
    clone() {
        return new HeapSnapshotRetainerEdge(this.snapshot, this.retainerIndex());
    }
    hasStringName() {
        return this.edge().hasStringName();
    }
    name() {
        return this.edge().name();
    }
    nameIndex() {
        return this.edge().nameIndex();
    }
    node() {
        return this.nodeInternal();
    }
    nodeIndex() {
        if (typeof __classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_retainingNodeIndex, "f") === 'undefined') {
            throw new Error('retainingNodeIndex is undefined');
        }
        return __classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_retainingNodeIndex, "f");
    }
    retainerIndex() {
        return __classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_retainerIndexInternal, "f");
    }
    setRetainerIndex(retainerIndex) {
        if (retainerIndex === __classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_retainerIndexInternal, "f")) {
            return;
        }
        if (!this.snapshot.retainingEdges || !this.snapshot.retainingNodes) {
            throw new Error('Snapshot does not contain retaining edges or retaining nodes');
        }
        __classPrivateFieldSet(this, _HeapSnapshotRetainerEdge_retainerIndexInternal, retainerIndex, "f");
        __classPrivateFieldSet(this, _HeapSnapshotRetainerEdge_globalEdgeIndex, this.snapshot.retainingEdges[retainerIndex], "f");
        __classPrivateFieldSet(this, _HeapSnapshotRetainerEdge_retainingNodeIndex, this.snapshot.retainingNodes[retainerIndex], "f");
        __classPrivateFieldSet(this, _HeapSnapshotRetainerEdge_edgeInstance, null, "f");
        __classPrivateFieldSet(this, _HeapSnapshotRetainerEdge_nodeInstance, null, "f");
    }
    set edgeIndex(edgeIndex) {
        this.setRetainerIndex(edgeIndex);
    }
    nodeInternal() {
        if (!__classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_nodeInstance, "f")) {
            __classPrivateFieldSet(this, _HeapSnapshotRetainerEdge_nodeInstance, this.snapshot.createNode(__classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_retainingNodeIndex, "f")), "f");
        }
        return __classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_nodeInstance, "f");
    }
    edge() {
        if (!__classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_edgeInstance, "f")) {
            __classPrivateFieldSet(this, _HeapSnapshotRetainerEdge_edgeInstance, this.snapshot.createEdge(__classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_globalEdgeIndex, "f")), "f");
        }
        return __classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_edgeInstance, "f");
    }
    toString() {
        return this.edge().toString();
    }
    itemIndex() {
        return __classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_retainerIndexInternal, "f");
    }
    serialize() {
        const node = this.node();
        const serializedNode = node.serialize();
        serializedNode.distance = __classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_instances, "m", _HeapSnapshotRetainerEdge_distance).call(this);
        serializedNode.ignored = this.snapshot.isNodeIgnoredInRetainersView(node.nodeIndex);
        return new HeapSnapshotModel.HeapSnapshotModel.Edge(this.name(), serializedNode, this.type(), __classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_globalEdgeIndex, "f"));
    }
    type() {
        return this.edge().type();
    }
    isInternal() {
        return this.edge().isInternal();
    }
    getValueForSorting(fieldName) {
        if (fieldName === '!edgeDistance') {
            return __classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_instances, "m", _HeapSnapshotRetainerEdge_distance).call(this);
        }
        throw new Error('Invalid field name');
    }
}
_HeapSnapshotRetainerEdge_retainerIndexInternal = new WeakMap(), _HeapSnapshotRetainerEdge_globalEdgeIndex = new WeakMap(), _HeapSnapshotRetainerEdge_retainingNodeIndex = new WeakMap(), _HeapSnapshotRetainerEdge_edgeInstance = new WeakMap(), _HeapSnapshotRetainerEdge_nodeInstance = new WeakMap(), _HeapSnapshotRetainerEdge_instances = new WeakSet(), _HeapSnapshotRetainerEdge_distance = function _HeapSnapshotRetainerEdge_distance() {
    if (this.snapshot.isEdgeIgnoredInRetainersView(__classPrivateFieldGet(this, _HeapSnapshotRetainerEdge_globalEdgeIndex, "f"))) {
        return HeapSnapshotModel.HeapSnapshotModel.baseUnreachableDistance;
    }
    return this.node().distanceForRetainersView();
};
export class HeapSnapshotRetainerEdgeIterator {
    constructor(retainedNode) {
        _HeapSnapshotRetainerEdgeIterator_retainersEnd.set(this, void 0);
        const snapshot = retainedNode.snapshot;
        const retainedNodeOrdinal = retainedNode.ordinal();
        if (!snapshot.firstRetainerIndex) {
            throw new Error('Snapshot does not contain firstRetainerIndex');
        }
        const retainerIndex = snapshot.firstRetainerIndex[retainedNodeOrdinal];
        __classPrivateFieldSet(this, _HeapSnapshotRetainerEdgeIterator_retainersEnd, snapshot.firstRetainerIndex[retainedNodeOrdinal + 1], "f");
        this.retainer = snapshot.createRetainingEdge(retainerIndex);
    }
    hasNext() {
        return this.retainer.retainerIndex() < __classPrivateFieldGet(this, _HeapSnapshotRetainerEdgeIterator_retainersEnd, "f");
    }
    item() {
        return this.retainer;
    }
    next() {
        this.retainer.setRetainerIndex(this.retainer.retainerIndex() + 1);
    }
}
_HeapSnapshotRetainerEdgeIterator_retainersEnd = new WeakMap();
export class HeapSnapshotNode {
    constructor(snapshot, nodeIndex) {
        _HeapSnapshotNode_instances.add(this);
        this.snapshot = snapshot;
        this.nodeIndex = nodeIndex || 0;
    }
    distance() {
        return this.snapshot.nodeDistances[this.nodeIndex / this.snapshot.nodeFieldCount];
    }
    distanceForRetainersView() {
        return this.snapshot.getDistanceForRetainersView(this.nodeIndex);
    }
    className() {
        return this.snapshot.strings[this.classIndex()];
    }
    classIndex() {
        return __classPrivateFieldGet(this, _HeapSnapshotNode_instances, "m", _HeapSnapshotNode_detachednessAndClassIndex).call(this) >>> SHIFT_FOR_CLASS_INDEX;
    }
    // Returns a key which can uniquely describe both the class name for this node
    // and its Location, if relevant. These keys are meant to be cheap to produce,
    // so that building aggregates is fast. These keys are NOT the same as the
    // keys exposed to the frontend by functions such as aggregatesWithFilter and
    // aggregatesForDiff.
    classKeyInternal() {
        // It is common for multiple JavaScript constructors to have the same
        // name, so the class key includes the location if available for nodes of
        // type 'object'.
        //
        // JavaScript Functions (node type 'closure') also have locations, but it
        // would not be helpful to split them into categories by location because
        // many of those categories would have only one instance.
        if (this.rawType() !== this.snapshot.nodeObjectType) {
            return this.classIndex();
        }
        const location = this.snapshot.getLocation(this.nodeIndex);
        return location ? `${location.scriptId},${location.lineNumber},${location.columnNumber},${this.className()}` :
            this.classIndex();
    }
    setClassIndex(index) {
        let value = __classPrivateFieldGet(this, _HeapSnapshotNode_instances, "m", _HeapSnapshotNode_detachednessAndClassIndex).call(this);
        value &= BITMASK_FOR_DOM_LINK_STATE; // Clear previous class index.
        value |= (index << SHIFT_FOR_CLASS_INDEX); // Set new class index.
        __classPrivateFieldGet(this, _HeapSnapshotNode_instances, "m", _HeapSnapshotNode_setDetachednessAndClassIndex).call(this, value);
        if (this.classIndex() !== index) {
            throw new Error('String index overflow');
        }
    }
    dominatorIndex() {
        const nodeFieldCount = this.snapshot.nodeFieldCount;
        return this.snapshot.dominatorsTree[this.nodeIndex / this.snapshot.nodeFieldCount] * nodeFieldCount;
    }
    edges() {
        return new HeapSnapshotEdgeIterator(this);
    }
    edgesCount() {
        return (this.edgeIndexesEnd() - this.edgeIndexesStart()) / this.snapshot.edgeFieldsCount;
    }
    id() {
        throw new Error('Not implemented');
    }
    rawName() {
        return this.snapshot.strings[this.rawNameIndex()];
    }
    isRoot() {
        return this.nodeIndex === this.snapshot.rootNodeIndex;
    }
    isUserRoot() {
        throw new Error('Not implemented');
    }
    isHidden() {
        throw new Error('Not implemented');
    }
    isArray() {
        throw new Error('Not implemented');
    }
    isSynthetic() {
        throw new Error('Not implemented');
    }
    isDocumentDOMTreesRoot() {
        throw new Error('Not implemented');
    }
    name() {
        return this.rawName();
    }
    retainedSize() {
        return this.snapshot.retainedSizes[this.ordinal()];
    }
    retainers() {
        return new HeapSnapshotRetainerEdgeIterator(this);
    }
    retainersCount() {
        const snapshot = this.snapshot;
        const ordinal = this.ordinal();
        return snapshot.firstRetainerIndex[ordinal + 1] - snapshot.firstRetainerIndex[ordinal];
    }
    selfSize() {
        const snapshot = this.snapshot;
        return snapshot.nodes.getValue(this.nodeIndex + snapshot.nodeSelfSizeOffset);
    }
    type() {
        return this.snapshot.nodeTypes[this.rawType()];
    }
    traceNodeId() {
        const snapshot = this.snapshot;
        return snapshot.nodes.getValue(this.nodeIndex + snapshot.nodeTraceNodeIdOffset);
    }
    itemIndex() {
        return this.nodeIndex;
    }
    serialize() {
        return new HeapSnapshotModel.HeapSnapshotModel.Node(this.id(), this.name(), this.distance(), this.nodeIndex, this.retainedSize(), this.selfSize(), this.type());
    }
    rawNameIndex() {
        const snapshot = this.snapshot;
        return snapshot.nodes.getValue(this.nodeIndex + snapshot.nodeNameOffset);
    }
    edgeIndexesStart() {
        return this.snapshot.firstEdgeIndexes[this.ordinal()];
    }
    edgeIndexesEnd() {
        return this.snapshot.firstEdgeIndexes[this.ordinal() + 1];
    }
    ordinal() {
        return this.nodeIndex / this.snapshot.nodeFieldCount;
    }
    nextNodeIndex() {
        return this.nodeIndex + this.snapshot.nodeFieldCount;
    }
    rawType() {
        const snapshot = this.snapshot;
        return snapshot.nodes.getValue(this.nodeIndex + snapshot.nodeTypeOffset);
    }
    isFlatConsString() {
        if (this.rawType() !== this.snapshot.nodeConsStringType) {
            return false;
        }
        for (let iter = this.edges(); iter.hasNext(); iter.next()) {
            const edge = iter.edge;
            if (!edge.isInternal()) {
                continue;
            }
            const edgeName = edge.name();
            if ((edgeName === 'first' || edgeName === 'second') && edge.node().name() === '') {
                return true;
            }
        }
        return false;
    }
    detachedness() {
        return __classPrivateFieldGet(this, _HeapSnapshotNode_instances, "m", _HeapSnapshotNode_detachednessAndClassIndex).call(this) & BITMASK_FOR_DOM_LINK_STATE;
    }
    setDetachedness(detachedness) {
        let value = __classPrivateFieldGet(this, _HeapSnapshotNode_instances, "m", _HeapSnapshotNode_detachednessAndClassIndex).call(this);
        value &= ~BITMASK_FOR_DOM_LINK_STATE; // Clear the old bits.
        value |= detachedness; // Set the new bits.
        __classPrivateFieldGet(this, _HeapSnapshotNode_instances, "m", _HeapSnapshotNode_setDetachednessAndClassIndex).call(this, value);
    }
}
_HeapSnapshotNode_instances = new WeakSet(), _HeapSnapshotNode_detachednessAndClassIndex = function _HeapSnapshotNode_detachednessAndClassIndex() {
    const { snapshot, nodeIndex } = this;
    const nodeDetachednessAndClassIndexOffset = snapshot.nodeDetachednessAndClassIndexOffset;
    return nodeDetachednessAndClassIndexOffset !== -1 ?
        snapshot.nodes.getValue(nodeIndex + nodeDetachednessAndClassIndexOffset) :
        snapshot.detachednessAndClassIndexArray[nodeIndex / snapshot.nodeFieldCount];
}, _HeapSnapshotNode_setDetachednessAndClassIndex = function _HeapSnapshotNode_setDetachednessAndClassIndex(value) {
    const { snapshot, nodeIndex } = this;
    const nodeDetachednessAndClassIndexOffset = snapshot.nodeDetachednessAndClassIndexOffset;
    if (nodeDetachednessAndClassIndexOffset !== -1) {
        snapshot.nodes.setValue(nodeIndex + nodeDetachednessAndClassIndexOffset, value);
    }
    else {
        snapshot.detachednessAndClassIndexArray[nodeIndex / snapshot.nodeFieldCount] = value;
    }
};
export class HeapSnapshotNodeIterator {
    constructor(node) {
        _HeapSnapshotNodeIterator_nodesLength.set(this, void 0);
        this.node = node;
        __classPrivateFieldSet(this, _HeapSnapshotNodeIterator_nodesLength, node.snapshot.nodes.length, "f");
    }
    hasNext() {
        return this.node.nodeIndex < __classPrivateFieldGet(this, _HeapSnapshotNodeIterator_nodesLength, "f");
    }
    item() {
        return this.node;
    }
    next() {
        this.node.nodeIndex = this.node.nextNodeIndex();
    }
}
_HeapSnapshotNodeIterator_nodesLength = new WeakMap();
export class HeapSnapshotIndexRangeIterator {
    constructor(itemProvider, indexes) {
        _HeapSnapshotIndexRangeIterator_itemProvider.set(this, void 0);
        _HeapSnapshotIndexRangeIterator_indexes.set(this, void 0);
        _HeapSnapshotIndexRangeIterator_position.set(this, void 0);
        __classPrivateFieldSet(this, _HeapSnapshotIndexRangeIterator_itemProvider, itemProvider, "f");
        __classPrivateFieldSet(this, _HeapSnapshotIndexRangeIterator_indexes, indexes, "f");
        __classPrivateFieldSet(this, _HeapSnapshotIndexRangeIterator_position, 0, "f");
    }
    hasNext() {
        return __classPrivateFieldGet(this, _HeapSnapshotIndexRangeIterator_position, "f") < __classPrivateFieldGet(this, _HeapSnapshotIndexRangeIterator_indexes, "f").length;
    }
    item() {
        const index = __classPrivateFieldGet(this, _HeapSnapshotIndexRangeIterator_indexes, "f")[__classPrivateFieldGet(this, _HeapSnapshotIndexRangeIterator_position, "f")];
        return __classPrivateFieldGet(this, _HeapSnapshotIndexRangeIterator_itemProvider, "f").itemForIndex(index);
    }
    next() {
        var _b;
        __classPrivateFieldSet(this, _HeapSnapshotIndexRangeIterator_position, (_b = __classPrivateFieldGet(this, _HeapSnapshotIndexRangeIterator_position, "f"), ++_b), "f");
    }
}
_HeapSnapshotIndexRangeIterator_itemProvider = new WeakMap(), _HeapSnapshotIndexRangeIterator_indexes = new WeakMap(), _HeapSnapshotIndexRangeIterator_position = new WeakMap();
export class HeapSnapshotFilteredIterator {
    constructor(iterator, filter) {
        _HeapSnapshotFilteredIterator_iterator.set(this, void 0);
        _HeapSnapshotFilteredIterator_filter.set(this, void 0);
        __classPrivateFieldSet(this, _HeapSnapshotFilteredIterator_iterator, iterator, "f");
        __classPrivateFieldSet(this, _HeapSnapshotFilteredIterator_filter, filter, "f");
        this.skipFilteredItems();
    }
    hasNext() {
        return __classPrivateFieldGet(this, _HeapSnapshotFilteredIterator_iterator, "f").hasNext();
    }
    item() {
        return __classPrivateFieldGet(this, _HeapSnapshotFilteredIterator_iterator, "f").item();
    }
    next() {
        __classPrivateFieldGet(this, _HeapSnapshotFilteredIterator_iterator, "f").next();
        this.skipFilteredItems();
    }
    skipFilteredItems() {
        while (__classPrivateFieldGet(this, _HeapSnapshotFilteredIterator_iterator, "f").hasNext() && __classPrivateFieldGet(this, _HeapSnapshotFilteredIterator_filter, "f") && !__classPrivateFieldGet(this, _HeapSnapshotFilteredIterator_filter, "f").call(this, __classPrivateFieldGet(this, _HeapSnapshotFilteredIterator_iterator, "f").item())) {
            __classPrivateFieldGet(this, _HeapSnapshotFilteredIterator_iterator, "f").next();
        }
    }
}
_HeapSnapshotFilteredIterator_iterator = new WeakMap(), _HeapSnapshotFilteredIterator_filter = new WeakMap();
export class HeapSnapshotProgress {
    constructor(dispatcher) {
        _HeapSnapshotProgress_dispatcher.set(this, void 0);
        __classPrivateFieldSet(this, _HeapSnapshotProgress_dispatcher, dispatcher, "f");
    }
    updateStatus(status) {
        this.sendUpdateEvent(i18n.i18n.serializeUIString(status));
    }
    updateProgress(title, value, total) {
        const percentValue = ((total ? (value / total) : 0) * 100).toFixed(0);
        this.sendUpdateEvent(i18n.i18n.serializeUIString(title, { PH1: percentValue }));
    }
    reportProblem(error) {
        // May be undefined in tests.
        if (__classPrivateFieldGet(this, _HeapSnapshotProgress_dispatcher, "f")) {
            __classPrivateFieldGet(this, _HeapSnapshotProgress_dispatcher, "f").sendEvent(HeapSnapshotModel.HeapSnapshotModel.HeapSnapshotProgressEvent.BrokenSnapshot, error);
        }
    }
    sendUpdateEvent(serializedText) {
        // May be undefined in tests.
        if (__classPrivateFieldGet(this, _HeapSnapshotProgress_dispatcher, "f")) {
            __classPrivateFieldGet(this, _HeapSnapshotProgress_dispatcher, "f").sendEvent(HeapSnapshotModel.HeapSnapshotModel.HeapSnapshotProgressEvent.Update, serializedText);
        }
    }
}
_HeapSnapshotProgress_dispatcher = new WeakMap();
function appendToProblemReport(report, messageOrNodeIndex) {
    if (report.length > 100) {
        return;
    }
    report.push(messageOrNodeIndex);
}
function formatProblemReport(snapshot, report) {
    const node = snapshot.rootNode();
    return report
        .map(messageOrNodeIndex => {
        if (typeof messageOrNodeIndex === 'string') {
            return messageOrNodeIndex;
        }
        node.nodeIndex = messageOrNodeIndex;
        return `${node.name()} @${node.id()}`;
    })
        .join('\n  ');
}
function reportProblemToPrimaryWorker(problemReport, port) {
    port.postMessage({ problemReport });
}
// Initialization work is split into two threads. This class is the entry point
// for work done by the second thread.
export class SecondaryInitManager {
    constructor(port) {
        const { promise: argsStep1, resolve: resolveArgsStep1 } = Promise.withResolvers();
        this.argsStep1 = argsStep1;
        const { promise: argsStep2, resolve: resolveArgsStep2 } = Promise.withResolvers();
        this.argsStep2 = argsStep2;
        const { promise: argsStep3, resolve: resolveArgsStep3 } = Promise.withResolvers();
        this.argsStep3 = argsStep3;
        port.onmessage = e => {
            const data = e.data;
            switch (data.step) {
                case 1:
                    resolveArgsStep1(data.args);
                    break;
                case 2:
                    resolveArgsStep2(data.args);
                    break;
                case 3:
                    resolveArgsStep3(data.args);
                    break;
            }
        };
        void this.initialize(port);
    }
    async getNodeSelfSizes() {
        return (await this.argsStep3).nodeSelfSizes;
    }
    async initialize(port) {
        try {
            const argsStep1 = await this.argsStep1;
            const retainers = HeapSnapshot.buildRetainers(argsStep1);
            const argsStep2 = await this.argsStep2;
            const args = {
                ...argsStep2,
                ...argsStep1,
                ...retainers,
                essentialEdges: Platform.TypedArrayUtilities.createBitVector(argsStep2.essentialEdgesBuffer),
                port,
                nodeSelfSizesPromise: this.getNodeSelfSizes()
            };
            const dominatorsAndRetainedSizes = await HeapSnapshot.calculateDominatorsAndRetainedSizes(args);
            const dominatedNodesOutputs = HeapSnapshot.buildDominatedNodes({ ...args, ...dominatorsAndRetainedSizes });
            const results = {
                ...retainers,
                ...dominatorsAndRetainedSizes,
                ...dominatedNodesOutputs,
            };
            port.postMessage({ resultsFromSecondWorker: results }, {
                transfer: [
                    results.dominatorsTree.buffer,
                    results.firstRetainerIndex.buffer,
                    results.retainedSizes.buffer,
                    results.retainingEdges.buffer,
                    results.retainingNodes.buffer,
                    results.dominatedNodes.buffer,
                    results.firstDominatedNodeIndex.buffer,
                ]
            });
        }
        catch (e) {
            port.postMessage({ error: e + '\n' + e?.stack });
        }
    }
}
/**
 * DOM node link state.
 */
var DOMLinkState;
(function (DOMLinkState) {
    DOMLinkState[DOMLinkState["UNKNOWN"] = 0] = "UNKNOWN";
    DOMLinkState[DOMLinkState["ATTACHED"] = 1] = "ATTACHED";
    DOMLinkState[DOMLinkState["DETACHED"] = 2] = "DETACHED";
})(DOMLinkState || (DOMLinkState = {}));
const BITMASK_FOR_DOM_LINK_STATE = 3;
// The class index is stored in the upper 30 bits of the detachedness field.
const SHIFT_FOR_CLASS_INDEX = 2;
// After this many properties, inferInterfaceDefinitions can stop adding more
// properties to an interface definition if the name is getting too long.
const MIN_INTERFACE_PROPERTY_COUNT = 1;
// The maximum length of an interface name produced by inferInterfaceDefinitions.
// This limit can be exceeded if the first MIN_INTERFACE_PROPERTY_COUNT property
// names are long.
const MAX_INTERFACE_NAME_LENGTH = 120;
// Each interface definition produced by inferInterfaceDefinitions will match at
// least this many objects. There's no point in defining interfaces which match
// only a single object.
const MIN_OBJECT_COUNT_PER_INTERFACE = 2;
// Each interface definition produced by inferInterfaceDefinitions should
// match at least 1 out of 1000 Objects in the heap. Otherwise, we end up with a
// long tail of unpopular interfaces that don't help analysis.
const MIN_OBJECT_PROPORTION_PER_INTERFACE = 1000;
export class HeapSnapshot {
    constructor(profile, progress) {
        _HeapSnapshot_instances.add(this);
        _HeapSnapshot_metaNode.set(this, void 0);
        _HeapSnapshot_rawSamples.set(this, void 0);
        _HeapSnapshot_samples.set(this, null);
        _HeapSnapshot_locations.set(this, void 0);
        _HeapSnapshot_progress.set(this, void 0);
        _HeapSnapshot_noDistance.set(this, -5);
        this.rootNodeIndexInternal = 0;
        _HeapSnapshot_snapshotDiffs.set(this, {});
        _HeapSnapshot_aggregatesForDiffInternal.set(this, void 0);
        _HeapSnapshot_aggregates.set(this, {});
        _HeapSnapshot_aggregatesSortedFlags.set(this, {});
        _HeapSnapshot_nodeEdgeCountOffset.set(this, void 0);
        _HeapSnapshot_locationIndexOffset.set(this, void 0);
        _HeapSnapshot_locationScriptIdOffset.set(this, void 0);
        _HeapSnapshot_locationLineOffset.set(this, void 0);
        _HeapSnapshot_locationColumnOffset.set(this, void 0);
        _HeapSnapshot_locationFieldCount.set(this, void 0);
        _HeapSnapshot_edgeCount.set(this, void 0);
        _HeapSnapshot_allocationProfile.set(this, void 0);
        _HeapSnapshot_locationMap.set(this, void 0);
        _HeapSnapshot_ignoredNodesInRetainersView.set(this, new Set());
        _HeapSnapshot_ignoredEdgesInRetainersView.set(this, new Set());
        _HeapSnapshot_nodeDistancesForRetainersView.set(this, void 0);
        _HeapSnapshot_edgeNamesThatAreNotWeakMaps.set(this, void 0);
        _HeapSnapshot_interfaceNames.set(this, new Map());
        _HeapSnapshot_interfaceDefinitions.set(this, void 0);
        this.nodes = profile.nodes;
        this.containmentEdges = profile.edges;
        __classPrivateFieldSet(this, _HeapSnapshot_metaNode, profile.snapshot.meta, "f");
        __classPrivateFieldSet(this, _HeapSnapshot_rawSamples, profile.samples, "f");
        this.strings = profile.strings;
        __classPrivateFieldSet(this, _HeapSnapshot_locations, profile.locations, "f");
        __classPrivateFieldSet(this, _HeapSnapshot_progress, progress, "f");
        if (profile.snapshot.root_index) {
            this.rootNodeIndexInternal = profile.snapshot.root_index;
        }
        this.profile = profile;
        __classPrivateFieldSet(this, _HeapSnapshot_edgeNamesThatAreNotWeakMaps, Platform.TypedArrayUtilities.createBitVector(this.strings.length), "f");
    }
    async initialize(secondWorker) {
        const meta = __classPrivateFieldGet(this, _HeapSnapshot_metaNode, "f");
        this.nodeTypeOffset = meta.node_fields.indexOf('type');
        this.nodeNameOffset = meta.node_fields.indexOf('name');
        this.nodeIdOffset = meta.node_fields.indexOf('id');
        this.nodeSelfSizeOffset = meta.node_fields.indexOf('self_size');
        __classPrivateFieldSet(this, _HeapSnapshot_nodeEdgeCountOffset, meta.node_fields.indexOf('edge_count'), "f");
        this.nodeTraceNodeIdOffset = meta.node_fields.indexOf('trace_node_id');
        this.nodeDetachednessAndClassIndexOffset = meta.node_fields.indexOf('detachedness');
        this.nodeFieldCount = meta.node_fields.length;
        this.nodeTypes = meta.node_types[this.nodeTypeOffset];
        this.nodeArrayType = this.nodeTypes.indexOf('array');
        this.nodeHiddenType = this.nodeTypes.indexOf('hidden');
        this.nodeObjectType = this.nodeTypes.indexOf('object');
        this.nodeNativeType = this.nodeTypes.indexOf('native');
        this.nodeStringType = this.nodeTypes.indexOf('string');
        this.nodeConsStringType = this.nodeTypes.indexOf('concatenated string');
        this.nodeSlicedStringType = this.nodeTypes.indexOf('sliced string');
        this.nodeCodeType = this.nodeTypes.indexOf('code');
        this.nodeSyntheticType = this.nodeTypes.indexOf('synthetic');
        this.nodeClosureType = this.nodeTypes.indexOf('closure');
        this.nodeRegExpType = this.nodeTypes.indexOf('regexp');
        this.edgeFieldsCount = meta.edge_fields.length;
        this.edgeTypeOffset = meta.edge_fields.indexOf('type');
        this.edgeNameOffset = meta.edge_fields.indexOf('name_or_index');
        this.edgeToNodeOffset = meta.edge_fields.indexOf('to_node');
        this.edgeTypes = meta.edge_types[this.edgeTypeOffset];
        this.edgeTypes.push('invisible');
        this.edgeElementType = this.edgeTypes.indexOf('element');
        this.edgeHiddenType = this.edgeTypes.indexOf('hidden');
        this.edgeInternalType = this.edgeTypes.indexOf('internal');
        this.edgeShortcutType = this.edgeTypes.indexOf('shortcut');
        this.edgeWeakType = this.edgeTypes.indexOf('weak');
        this.edgeInvisibleType = this.edgeTypes.indexOf('invisible');
        this.edgePropertyType = this.edgeTypes.indexOf('property');
        const locationFields = meta.location_fields || [];
        __classPrivateFieldSet(this, _HeapSnapshot_locationIndexOffset, locationFields.indexOf('object_index'), "f");
        __classPrivateFieldSet(this, _HeapSnapshot_locationScriptIdOffset, locationFields.indexOf('script_id'), "f");
        __classPrivateFieldSet(this, _HeapSnapshot_locationLineOffset, locationFields.indexOf('line'), "f");
        __classPrivateFieldSet(this, _HeapSnapshot_locationColumnOffset, locationFields.indexOf('column'), "f");
        __classPrivateFieldSet(this, _HeapSnapshot_locationFieldCount, locationFields.length, "f");
        this.nodeCount = this.nodes.length / this.nodeFieldCount;
        __classPrivateFieldSet(this, _HeapSnapshot_edgeCount, this.containmentEdges.length / this.edgeFieldsCount, "f");
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Building edge indexes…');
        this.firstEdgeIndexes = new Uint32Array(this.nodeCount + 1);
        this.buildEdgeIndexes();
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Building retainers…');
        const resultsFromSecondWorker = this.startInitStep1InSecondThread(secondWorker);
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Propagating DOM state…');
        this.propagateDOMState();
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Calculating node flags…');
        this.calculateFlags();
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Building dominated nodes…');
        this.startInitStep2InSecondThread(secondWorker);
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Calculating shallow sizes…');
        this.calculateShallowSizes();
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Calculating retained sizes…');
        this.startInitStep3InSecondThread(secondWorker);
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Calculating distances…');
        this.nodeDistances = new Int32Array(this.nodeCount);
        this.calculateDistances(/* isForRetainersView=*/ false);
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Calculating object names…');
        this.calculateObjectNames();
        this.applyInterfaceDefinitions(this.inferInterfaceDefinitions());
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Calculating samples…');
        this.buildSamples();
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Building locations…');
        this.buildLocationMap();
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Calculating retained sizes…');
        await this.installResultsFromSecondThread(resultsFromSecondWorker);
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Calculating statistics…');
        this.calculateStatistics();
        if (this.profile.snapshot.trace_function_count) {
            __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Building allocation statistics…');
            const nodes = this.nodes;
            const nodesLength = nodes.length;
            const nodeFieldCount = this.nodeFieldCount;
            const node = this.rootNode();
            const liveObjects = {};
            for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
                node.nodeIndex = nodeIndex;
                const traceNodeId = node.traceNodeId();
                let stats = liveObjects[traceNodeId];
                if (!stats) {
                    liveObjects[traceNodeId] = stats = { count: 0, size: 0, ids: [] };
                }
                stats.count++;
                stats.size += node.selfSize();
                stats.ids.push(node.id());
            }
            __classPrivateFieldSet(this, _HeapSnapshot_allocationProfile, new AllocationProfile(this.profile, liveObjects), "f");
        }
        __classPrivateFieldGet(this, _HeapSnapshot_progress, "f").updateStatus('Finished processing.');
    }
    startInitStep1InSecondThread(secondWorker) {
        const resultsFromSecondWorker = new Promise((resolve, reject) => {
            secondWorker.onmessage = (event) => {
                const data = event.data;
                if (data?.problemReport) {
                    const problemReport = data.problemReport;
                    console.warn(formatProblemReport(this, problemReport));
                }
                else if (data?.resultsFromSecondWorker) {
                    const resultsFromSecondWorker = data.resultsFromSecondWorker;
                    resolve(resultsFromSecondWorker);
                }
                else if (data?.error) {
                    reject(data.error);
                }
            };
        });
        const edgeCount = __classPrivateFieldGet(this, _HeapSnapshot_edgeCount, "f");
        const { containmentEdges, edgeToNodeOffset, edgeFieldsCount, nodeFieldCount } = this;
        const edgeToNodeOrdinals = new Uint32Array(edgeCount);
        for (let edgeOrdinal = 0; edgeOrdinal < edgeCount; ++edgeOrdinal) {
            const toNodeIndex = containmentEdges.getValue(edgeOrdinal * edgeFieldsCount + edgeToNodeOffset);
            if (toNodeIndex % nodeFieldCount) {
                throw new Error('Invalid toNodeIndex ' + toNodeIndex);
            }
            edgeToNodeOrdinals[edgeOrdinal] = toNodeIndex / nodeFieldCount;
        }
        const args = {
            edgeToNodeOrdinals,
            firstEdgeIndexes: this.firstEdgeIndexes,
            nodeCount: this.nodeCount,
            edgeFieldsCount: this.edgeFieldsCount,
            nodeFieldCount: this.nodeFieldCount,
        };
        // Note that firstEdgeIndexes is not transferred; each thread needs its own copy.
        secondWorker.postMessage({ step: 1, args }, [edgeToNodeOrdinals.buffer]);
        return resultsFromSecondWorker;
    }
    startInitStep2InSecondThread(secondWorker) {
        const rootNodeOrdinal = this.rootNodeIndexInternal / this.nodeFieldCount;
        const essentialEdges = this.initEssentialEdges();
        const args = { rootNodeOrdinal, essentialEdgesBuffer: essentialEdges.buffer };
        secondWorker.postMessage({ step: 2, args }, [essentialEdges.buffer]);
    }
    startInitStep3InSecondThread(secondWorker) {
        const { nodes, nodeFieldCount, nodeSelfSizeOffset, nodeCount } = this;
        const nodeSelfSizes = new Uint32Array(nodeCount);
        for (let nodeOrdinal = 0; nodeOrdinal < nodeCount; ++nodeOrdinal) {
            nodeSelfSizes[nodeOrdinal] = nodes.getValue(nodeOrdinal * nodeFieldCount + nodeSelfSizeOffset);
        }
        const args = { nodeSelfSizes };
        secondWorker.postMessage({ step: 3, args }, [nodeSelfSizes.buffer]);
    }
    async installResultsFromSecondThread(resultsFromSecondWorker) {
        const results = await resultsFromSecondWorker;
        this.dominatedNodes = results.dominatedNodes;
        this.dominatorsTree = results.dominatorsTree;
        this.firstDominatedNodeIndex = results.firstDominatedNodeIndex;
        this.firstRetainerIndex = results.firstRetainerIndex;
        this.retainedSizes = results.retainedSizes;
        this.retainingEdges = results.retainingEdges;
        this.retainingNodes = results.retainingNodes;
    }
    buildEdgeIndexes() {
        const nodes = this.nodes;
        const nodeCount = this.nodeCount;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const nodeFieldCount = this.nodeFieldCount;
        const edgeFieldsCount = this.edgeFieldsCount;
        const nodeEdgeCountOffset = __classPrivateFieldGet(this, _HeapSnapshot_nodeEdgeCountOffset, "f");
        firstEdgeIndexes[nodeCount] = this.containmentEdges.length;
        for (let nodeOrdinal = 0, edgeIndex = 0; nodeOrdinal < nodeCount; ++nodeOrdinal) {
            firstEdgeIndexes[nodeOrdinal] = edgeIndex;
            edgeIndex += nodes.getValue(nodeOrdinal * nodeFieldCount + nodeEdgeCountOffset) * edgeFieldsCount;
        }
    }
    static buildRetainers(inputs) {
        const { edgeToNodeOrdinals, firstEdgeIndexes, nodeCount, edgeFieldsCount, nodeFieldCount } = inputs;
        const edgeCount = edgeToNodeOrdinals.length;
        const retainingNodes = new Uint32Array(edgeCount);
        const retainingEdges = new Uint32Array(edgeCount);
        const firstRetainerIndex = new Uint32Array(nodeCount + 1);
        for (let edgeOrdinal = 0; edgeOrdinal < edgeCount; ++edgeOrdinal) {
            const toNodeOrdinal = edgeToNodeOrdinals[edgeOrdinal];
            ++firstRetainerIndex[toNodeOrdinal];
        }
        for (let i = 0, firstUnusedRetainerSlot = 0; i < nodeCount; i++) {
            const retainersCount = firstRetainerIndex[i];
            firstRetainerIndex[i] = firstUnusedRetainerSlot;
            retainingNodes[firstUnusedRetainerSlot] = retainersCount;
            firstUnusedRetainerSlot += retainersCount;
        }
        firstRetainerIndex[nodeCount] = retainingNodes.length;
        let nextNodeFirstEdgeIndex = firstEdgeIndexes[0];
        for (let srcNodeOrdinal = 0; srcNodeOrdinal < nodeCount; ++srcNodeOrdinal) {
            const firstEdgeIndex = nextNodeFirstEdgeIndex;
            nextNodeFirstEdgeIndex = firstEdgeIndexes[srcNodeOrdinal + 1];
            const srcNodeIndex = srcNodeOrdinal * nodeFieldCount;
            for (let edgeIndex = firstEdgeIndex; edgeIndex < nextNodeFirstEdgeIndex; edgeIndex += edgeFieldsCount) {
                const toNodeOrdinal = edgeToNodeOrdinals[edgeIndex / edgeFieldsCount];
                const firstRetainerSlotIndex = firstRetainerIndex[toNodeOrdinal];
                const nextUnusedRetainerSlotIndex = firstRetainerSlotIndex + (--retainingNodes[firstRetainerSlotIndex]);
                retainingNodes[nextUnusedRetainerSlotIndex] = srcNodeIndex;
                retainingEdges[nextUnusedRetainerSlotIndex] = edgeIndex;
            }
        }
        return {
            retainingNodes,
            retainingEdges,
            firstRetainerIndex,
        };
    }
    allNodes() {
        return new HeapSnapshotNodeIterator(this.rootNode());
    }
    rootNode() {
        return this.createNode(this.rootNodeIndexInternal);
    }
    get rootNodeIndex() {
        return this.rootNodeIndexInternal;
    }
    get totalSize() {
        return this.rootNode().retainedSize() + (this.profile.snapshot.extra_native_bytes ?? 0);
    }
    createFilter(nodeFilter) {
        const { minNodeId, maxNodeId, allocationNodeId, filterName } = nodeFilter;
        let filter;
        if (typeof allocationNodeId === 'number') {
            filter = this.createAllocationStackFilter(allocationNodeId);
            if (!filter) {
                throw new Error('Unable to create filter');
            }
            // @ts-expect-error key can be added as a static property
            filter.key = 'AllocationNodeId: ' + allocationNodeId;
        }
        else if (typeof minNodeId === 'number' && typeof maxNodeId === 'number') {
            filter = this.createNodeIdFilter(minNodeId, maxNodeId);
            // @ts-expect-error key can be added as a static property
            filter.key = 'NodeIdRange: ' + minNodeId + '..' + maxNodeId;
        }
        else if (filterName !== undefined) {
            filter = this.createNamedFilter(filterName);
            // @ts-expect-error key can be added as a static property
            filter.key = 'NamedFilter: ' + filterName;
        }
        return filter;
    }
    search(searchConfig, nodeFilter) {
        const query = searchConfig.query;
        function filterString(matchedStringIndexes, string, index) {
            if (string.indexOf(query) !== -1) {
                matchedStringIndexes.add(index);
            }
            return matchedStringIndexes;
        }
        const regexp = searchConfig.isRegex ? new RegExp(query) : Platform.StringUtilities.createPlainTextSearchRegex(query, 'i');
        function filterRegexp(matchedStringIndexes, string, index) {
            if (regexp.test(string)) {
                matchedStringIndexes.add(index);
            }
            return matchedStringIndexes;
        }
        const useRegExp = searchConfig.isRegex || !searchConfig.caseSensitive;
        const stringFilter = useRegExp ? filterRegexp : filterString;
        const stringIndexes = this.strings.reduce(stringFilter, new Set());
        const filter = this.createFilter(nodeFilter);
        const nodeIds = [];
        const nodesLength = this.nodes.length;
        const nodes = this.nodes;
        const nodeNameOffset = this.nodeNameOffset;
        const nodeIdOffset = this.nodeIdOffset;
        const nodeFieldCount = this.nodeFieldCount;
        const node = this.rootNode();
        for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            node.nodeIndex = nodeIndex;
            if (filter && !filter(node)) {
                continue;
            }
            if (node.selfSize() === 0) {
                // Nodes with size zero are omitted in the data grid, so avoid returning
                // search results that can't be navigated to.
                continue;
            }
            const name = node.name();
            if (name === node.rawName()) {
                // If the string displayed to the user matches the raw name from the
                // snapshot, then we can use the Set computed above. This avoids
                // repeated work when multiple nodes have the same name.
                if (stringIndexes.has(nodes.getValue(nodeIndex + nodeNameOffset))) {
                    nodeIds.push(nodes.getValue(nodeIndex + nodeIdOffset));
                }
                // If the node is displaying a customized name, then we must perform the
                // full string search within that name here.
            }
            else if (useRegExp ? regexp.test(name) : (name.indexOf(query) !== -1)) {
                nodeIds.push(nodes.getValue(nodeIndex + nodeIdOffset));
            }
        }
        return nodeIds;
    }
    aggregatesWithFilter(nodeFilter) {
        const filter = this.createFilter(nodeFilter);
        // @ts-expect-error key is added in createFilter
        const key = filter ? filter.key : 'allObjects';
        return this.getAggregatesByClassKey(false, key, filter);
    }
    createNodeIdFilter(minNodeId, maxNodeId) {
        function nodeIdFilter(node) {
            const id = node.id();
            return id > minNodeId && id <= maxNodeId;
        }
        return nodeIdFilter;
    }
    createAllocationStackFilter(bottomUpAllocationNodeId) {
        if (!__classPrivateFieldGet(this, _HeapSnapshot_allocationProfile, "f")) {
            throw new Error('No Allocation Profile provided');
        }
        const traceIds = __classPrivateFieldGet(this, _HeapSnapshot_allocationProfile, "f").traceIds(bottomUpAllocationNodeId);
        if (!traceIds.length) {
            return undefined;
        }
        const set = {};
        for (let i = 0; i < traceIds.length; i++) {
            set[traceIds[i]] = true;
        }
        function traceIdFilter(node) {
            return Boolean(set[node.traceNodeId()]);
        }
        return traceIdFilter;
    }
    createNamedFilter(filterName) {
        // Allocate an array with a single bit per node, which can be used by each
        // specific filter implemented below.
        const bitmap = Platform.TypedArrayUtilities.createBitVector(this.nodeCount);
        const getBit = (node) => {
            const ordinal = node.nodeIndex / this.nodeFieldCount;
            return bitmap.getBit(ordinal);
        };
        // Traverses the graph in breadth-first order with the given filter, and
        // sets the bit in `bitmap` for every visited node.
        const traverse = (filter) => {
            const distances = new Int32Array(this.nodeCount);
            for (let i = 0; i < this.nodeCount; ++i) {
                distances[i] = __classPrivateFieldGet(this, _HeapSnapshot_noDistance, "f");
            }
            const nodesToVisit = new Uint32Array(this.nodeCount);
            distances[this.rootNode().ordinal()] = 0;
            nodesToVisit[0] = this.rootNode().nodeIndex;
            const nodesToVisitLength = 1;
            this.bfs(nodesToVisit, nodesToVisitLength, distances, filter);
            for (let i = 0; i < this.nodeCount; ++i) {
                if (distances[i] !== __classPrivateFieldGet(this, _HeapSnapshot_noDistance, "f")) {
                    bitmap.setBit(i);
                }
            }
        };
        const markUnreachableNodes = () => {
            for (let i = 0; i < this.nodeCount; ++i) {
                if (this.nodeDistances[i] === __classPrivateFieldGet(this, _HeapSnapshot_noDistance, "f")) {
                    bitmap.setBit(i);
                }
            }
        };
        switch (filterName) {
            case 'objectsRetainedByDetachedDomNodes':
                // Traverse the graph, avoiding detached nodes.
                traverse((_node, edge) => {
                    return edge.node().detachedness() !== 2 /* DOMLinkState.DETACHED */;
                });
                markUnreachableNodes();
                return (node) => !getBit(node);
            case 'objectsRetainedByConsole':
                // Traverse the graph, avoiding edges that represent globals owned by
                // the DevTools console.
                traverse((node, edge) => {
                    return !(node.isSynthetic() && edge.hasStringName() && edge.name().endsWith(' / DevTools console'));
                });
                markUnreachableNodes();
                return (node) => !getBit(node);
            case 'duplicatedStrings': {
                const stringToNodeIndexMap = new Map();
                const node = this.createNode(0);
                for (let i = 0; i < this.nodeCount; ++i) {
                    node.nodeIndex = i * this.nodeFieldCount;
                    const rawType = node.rawType();
                    if (rawType === this.nodeStringType || rawType === this.nodeConsStringType) {
                        // Check whether the cons string is already "flattened", meaning
                        // that one of its two parts is the empty string. If so, we should
                        // skip it. We don't help anyone by reporting a flattened cons
                        // string as a duplicate with its own content, since V8 controls
                        // that behavior internally.
                        if (node.isFlatConsString()) {
                            continue;
                        }
                        const name = node.name();
                        const alreadyVisitedNodeIndex = stringToNodeIndexMap.get(name);
                        if (alreadyVisitedNodeIndex === undefined) {
                            stringToNodeIndexMap.set(name, node.nodeIndex);
                        }
                        else {
                            bitmap.setBit(alreadyVisitedNodeIndex / this.nodeFieldCount);
                            bitmap.setBit(node.nodeIndex / this.nodeFieldCount);
                        }
                    }
                }
                return getBit;
            }
        }
        throw new Error('Invalid filter name');
    }
    getAggregatesByClassKey(sortedIndexes, key, filter) {
        let aggregates;
        if (key && __classPrivateFieldGet(this, _HeapSnapshot_aggregates, "f")[key]) {
            aggregates = __classPrivateFieldGet(this, _HeapSnapshot_aggregates, "f")[key];
        }
        else {
            const aggregatesMap = this.buildAggregates(filter);
            this.calculateClassesRetainedSize(aggregatesMap, filter);
            // In the two previous steps, we used class keys that were simple and
            // could be produced quickly. For many objects, this meant using the index
            // of the string containing its class name. However, string indices are
            // not consistent across snapshots, and this aggregate data might end up
            // being used in a comparison, so here we convert to a more durable format
            // for class keys.
            aggregates = Object.create(null);
            for (const [classKey, aggregate] of aggregatesMap.entries()) {
                const newKey = this.classKeyFromClassKeyInternal(classKey);
                aggregates[newKey] = aggregate;
            }
            if (key) {
                __classPrivateFieldGet(this, _HeapSnapshot_aggregates, "f")[key] = aggregates;
            }
        }
        if (sortedIndexes && (!key || !__classPrivateFieldGet(this, _HeapSnapshot_aggregatesSortedFlags, "f")[key])) {
            this.sortAggregateIndexes(aggregates);
            if (key) {
                __classPrivateFieldGet(this, _HeapSnapshot_aggregatesSortedFlags, "f")[key] = sortedIndexes;
            }
        }
        return aggregates;
    }
    allocationTracesTops() {
        return __classPrivateFieldGet(this, _HeapSnapshot_allocationProfile, "f").serializeTraceTops();
    }
    allocationNodeCallers(nodeId) {
        return __classPrivateFieldGet(this, _HeapSnapshot_allocationProfile, "f").serializeCallers(nodeId);
    }
    allocationStack(nodeIndex) {
        const node = this.createNode(nodeIndex);
        const allocationNodeId = node.traceNodeId();
        if (!allocationNodeId) {
            return null;
        }
        return __classPrivateFieldGet(this, _HeapSnapshot_allocationProfile, "f").serializeAllocationStack(allocationNodeId);
    }
    aggregatesForDiff(interfaceDefinitions) {
        if (__classPrivateFieldGet(this, _HeapSnapshot_aggregatesForDiffInternal, "f")?.interfaceDefinitions === interfaceDefinitions) {
            return __classPrivateFieldGet(this, _HeapSnapshot_aggregatesForDiffInternal, "f").aggregates;
        }
        // Temporarily apply the interface definitions from the other snapshot.
        const originalInterfaceDefinitions = __classPrivateFieldGet(this, _HeapSnapshot_interfaceDefinitions, "f");
        this.applyInterfaceDefinitions(JSON.parse(interfaceDefinitions));
        const aggregates = this.getAggregatesByClassKey(true, 'allObjects');
        this.applyInterfaceDefinitions(originalInterfaceDefinitions ?? []);
        const result = {};
        const node = this.createNode();
        for (const classKey in aggregates) {
            const aggregate = aggregates[classKey];
            const indexes = aggregate.idxs;
            const ids = new Array(indexes.length);
            const selfSizes = new Array(indexes.length);
            for (let i = 0; i < indexes.length; i++) {
                node.nodeIndex = indexes[i];
                ids[i] = node.id();
                selfSizes[i] = node.selfSize();
            }
            result[classKey] = { name: node.className(), indexes, ids, selfSizes };
        }
        __classPrivateFieldSet(this, _HeapSnapshot_aggregatesForDiffInternal, { interfaceDefinitions, aggregates: result }, "f");
        return result;
    }
    isUserRoot(_node) {
        return true;
    }
    calculateShallowSizes() {
    }
    calculateDistances(isForRetainersView, filter) {
        const nodeCount = this.nodeCount;
        if (isForRetainersView) {
            const originalFilter = filter;
            filter = (node, edge) => {
                return !__classPrivateFieldGet(this, _HeapSnapshot_ignoredNodesInRetainersView, "f").has(edge.nodeIndex()) &&
                    (!originalFilter || originalFilter(node, edge));
            };
            if (__classPrivateFieldGet(this, _HeapSnapshot_nodeDistancesForRetainersView, "f") === undefined) {
                __classPrivateFieldSet(this, _HeapSnapshot_nodeDistancesForRetainersView, new Int32Array(nodeCount), "f");
            }
        }
        const distances = isForRetainersView ? __classPrivateFieldGet(this, _HeapSnapshot_nodeDistancesForRetainersView, "f") : this.nodeDistances;
        const noDistance = __classPrivateFieldGet(this, _HeapSnapshot_noDistance, "f");
        for (let i = 0; i < nodeCount; ++i) {
            distances[i] = noDistance;
        }
        const nodesToVisit = new Uint32Array(this.nodeCount);
        let nodesToVisitLength = 0;
        // BFS for user root objects.
        for (let iter = this.rootNode().edges(); iter.hasNext(); iter.next()) {
            const node = iter.edge.node();
            if (this.isUserRoot(node)) {
                distances[node.ordinal()] = 1;
                nodesToVisit[nodesToVisitLength++] = node.nodeIndex;
            }
        }
        this.bfs(nodesToVisit, nodesToVisitLength, distances, filter);
        // BFS for objects not reached from user roots.
        distances[this.rootNode().ordinal()] =
            nodesToVisitLength > 0 ? HeapSnapshotModel.HeapSnapshotModel.baseSystemDistance : 0;
        nodesToVisit[0] = this.rootNode().nodeIndex;
        nodesToVisitLength = 1;
        this.bfs(nodesToVisit, nodesToVisitLength, distances, filter);
    }
    bfs(nodesToVisit, nodesToVisitLength, distances, filter) {
        // Preload fields into local variables for better performance.
        const edgeFieldsCount = this.edgeFieldsCount;
        const nodeFieldCount = this.nodeFieldCount;
        const containmentEdges = this.containmentEdges;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const edgeTypeOffset = this.edgeTypeOffset;
        const nodeCount = this.nodeCount;
        const edgeWeakType = this.edgeWeakType;
        const noDistance = __classPrivateFieldGet(this, _HeapSnapshot_noDistance, "f");
        let index = 0;
        const edge = this.createEdge(0);
        const node = this.createNode(0);
        while (index < nodesToVisitLength) {
            const nodeIndex = nodesToVisit[index++]; // shift generates too much garbage.
            const nodeOrdinal = nodeIndex / nodeFieldCount;
            const distance = distances[nodeOrdinal] + 1;
            const firstEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            const edgesEnd = firstEdgeIndexes[nodeOrdinal + 1];
            node.nodeIndex = nodeIndex;
            for (let edgeIndex = firstEdgeIndex; edgeIndex < edgesEnd; edgeIndex += edgeFieldsCount) {
                const edgeType = containmentEdges.getValue(edgeIndex + edgeTypeOffset);
                if (edgeType === edgeWeakType) {
                    continue;
                }
                const childNodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
                const childNodeOrdinal = childNodeIndex / nodeFieldCount;
                if (distances[childNodeOrdinal] !== noDistance) {
                    continue;
                }
                edge.edgeIndex = edgeIndex;
                if (filter && !filter(node, edge)) {
                    continue;
                }
                distances[childNodeOrdinal] = distance;
                nodesToVisit[nodesToVisitLength++] = childNodeIndex;
            }
        }
        if (nodesToVisitLength > nodeCount) {
            throw new Error('BFS failed. Nodes to visit (' + nodesToVisitLength + ') is more than nodes count (' + nodeCount + ')');
        }
    }
    buildAggregates(filter) {
        const aggregates = new Map();
        const nodes = this.nodes;
        const nodesLength = nodes.length;
        const nodeFieldCount = this.nodeFieldCount;
        const selfSizeOffset = this.nodeSelfSizeOffset;
        const node = this.rootNode();
        const nodeDistances = this.nodeDistances;
        for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            node.nodeIndex = nodeIndex;
            if (filter && !filter(node)) {
                continue;
            }
            const selfSize = nodes.getValue(nodeIndex + selfSizeOffset);
            if (!selfSize) {
                continue;
            }
            const classKey = node.classKeyInternal();
            const nodeOrdinal = nodeIndex / nodeFieldCount;
            const distance = nodeDistances[nodeOrdinal];
            let aggregate = aggregates.get(classKey);
            if (!aggregate) {
                aggregate = {
                    count: 1,
                    distance,
                    self: selfSize,
                    maxRet: 0,
                    name: node.className(),
                    idxs: [nodeIndex],
                };
                aggregates.set(classKey, aggregate);
            }
            else {
                aggregate.distance = Math.min(aggregate.distance, distance);
                ++aggregate.count;
                aggregate.self += selfSize;
                aggregate.idxs.push(nodeIndex);
            }
        }
        // Shave off provisionally allocated space.
        for (const aggregate of aggregates.values()) {
            aggregate.idxs = aggregate.idxs.slice();
        }
        return aggregates;
    }
    calculateClassesRetainedSize(aggregates, filter) {
        const rootNodeIndex = this.rootNodeIndexInternal;
        const node = this.createNode(rootNodeIndex);
        const list = [rootNodeIndex];
        const sizes = [-1];
        const classKeys = [];
        const seenClassKeys = new Map();
        const nodeFieldCount = this.nodeFieldCount;
        const dominatedNodes = this.dominatedNodes;
        const firstDominatedNodeIndex = this.firstDominatedNodeIndex;
        while (list.length) {
            const nodeIndex = list.pop();
            node.nodeIndex = nodeIndex;
            let classKey = node.classKeyInternal();
            const seen = Boolean(seenClassKeys.get(classKey));
            const nodeOrdinal = nodeIndex / nodeFieldCount;
            const dominatedIndexFrom = firstDominatedNodeIndex[nodeOrdinal];
            const dominatedIndexTo = firstDominatedNodeIndex[nodeOrdinal + 1];
            if (!seen && (!filter || filter(node)) && node.selfSize()) {
                aggregates.get(classKey).maxRet += node.retainedSize();
                if (dominatedIndexFrom !== dominatedIndexTo) {
                    seenClassKeys.set(classKey, true);
                    sizes.push(list.length);
                    classKeys.push(classKey);
                }
            }
            for (let i = dominatedIndexFrom; i < dominatedIndexTo; i++) {
                list.push(dominatedNodes[i]);
            }
            const l = list.length;
            while (sizes[sizes.length - 1] === l) {
                sizes.pop();
                classKey = classKeys.pop();
                seenClassKeys.set(classKey, false);
            }
        }
    }
    sortAggregateIndexes(aggregates) {
        const nodeA = this.createNode();
        const nodeB = this.createNode();
        for (const clss in aggregates) {
            aggregates[clss].idxs.sort((idxA, idxB) => {
                nodeA.nodeIndex = idxA;
                nodeB.nodeIndex = idxB;
                return nodeA.id() < nodeB.id() ? -1 : 1;
            });
        }
    }
    tryParseWeakMapEdgeName(edgeNameIndex) {
        const previousResult = __classPrivateFieldGet(this, _HeapSnapshot_edgeNamesThatAreNotWeakMaps, "f").getBit(edgeNameIndex);
        if (previousResult) {
            return undefined;
        }
        const edgeName = this.strings[edgeNameIndex];
        const ephemeronNameRegex = /^\d+(?<duplicatedPart> \/ part of key \(.*? @\d+\) -> value \(.*? @\d+\) pair in WeakMap \(table @(?<tableId>\d+)\))$/;
        const match = edgeName.match(ephemeronNameRegex);
        if (!match) {
            __classPrivateFieldGet(this, _HeapSnapshot_edgeNamesThatAreNotWeakMaps, "f").setBit(edgeNameIndex);
            return undefined;
        }
        return match.groups;
    }
    computeIsEssentialEdge(nodeIndex, edgeIndex, userObjectsMapAndFlag) {
        const edgeType = this.containmentEdges.getValue(edgeIndex + this.edgeTypeOffset);
        // Values in WeakMaps are retained by the key and table together. Removing
        // either the key or the table would be sufficient to remove the edge from
        // the other one, so we needn't use both of those edges when computing
        // dominators. We've found that the edge from the key generally produces
        // more useful results, so here we skip the edge from the table.
        if (edgeType === this.edgeInternalType) {
            const edgeNameIndex = this.containmentEdges.getValue(edgeIndex + this.edgeNameOffset);
            const match = this.tryParseWeakMapEdgeName(edgeNameIndex);
            if (match) {
                const nodeId = this.nodes.getValue(nodeIndex + this.nodeIdOffset);
                if (nodeId === parseInt(match.tableId, 10)) {
                    return false;
                }
            }
        }
        // Weak edges never retain anything.
        if (edgeType === this.edgeWeakType) {
            return false;
        }
        const childNodeIndex = this.containmentEdges.getValue(edgeIndex + this.edgeToNodeOffset);
        // Ignore self edges.
        if (nodeIndex === childNodeIndex) {
            return false;
        }
        if (nodeIndex !== this.rootNodeIndex) {
            // Shortcuts at the root node have special meaning of marking user global objects.
            if (edgeType === this.edgeShortcutType) {
                return false;
            }
            const flags = userObjectsMapAndFlag ? userObjectsMapAndFlag.map : null;
            const userObjectFlag = userObjectsMapAndFlag ? userObjectsMapAndFlag.flag : 0;
            const nodeOrdinal = nodeIndex / this.nodeFieldCount;
            const childNodeOrdinal = childNodeIndex / this.nodeFieldCount;
            const nodeFlag = !flags || (flags[nodeOrdinal] & userObjectFlag);
            const childNodeFlag = !flags || (flags[childNodeOrdinal] & userObjectFlag);
            // We are skipping the edges from non-page-owned nodes to page-owned nodes.
            // Otherwise the dominators for the objects that also were retained by debugger would be affected.
            if (childNodeFlag && !nodeFlag) {
                return false;
            }
        }
        return true;
    }
    // Returns a bitmap indicating whether each edge should be considered when building the dominator tree.
    initEssentialEdges() {
        const essentialEdges = Platform.TypedArrayUtilities.createBitVector(__classPrivateFieldGet(this, _HeapSnapshot_edgeCount, "f"));
        const { nodes, nodeFieldCount, edgeFieldsCount } = this;
        const userObjectsMapAndFlag = this.userObjectsMapAndFlag();
        const endNodeIndex = nodes.length;
        const node = this.createNode(0);
        for (let nodeIndex = 0; nodeIndex < endNodeIndex; nodeIndex += nodeFieldCount) {
            node.nodeIndex = nodeIndex;
            const edgeIndexesEnd = node.edgeIndexesEnd();
            for (let edgeIndex = node.edgeIndexesStart(); edgeIndex < edgeIndexesEnd; edgeIndex += edgeFieldsCount) {
                if (this.computeIsEssentialEdge(nodeIndex, edgeIndex, userObjectsMapAndFlag)) {
                    essentialEdges.setBit(edgeIndex / edgeFieldsCount);
                }
            }
        }
        return essentialEdges;
    }
    static hasOnlyWeakRetainers(inputs, nodeOrdinal) {
        const { retainingEdges, edgeFieldsCount, firstRetainerIndex, essentialEdges } = inputs;
        const beginRetainerIndex = firstRetainerIndex[nodeOrdinal];
        const endRetainerIndex = firstRetainerIndex[nodeOrdinal + 1];
        for (let retainerIndex = beginRetainerIndex; retainerIndex < endRetainerIndex; ++retainerIndex) {
            const retainerEdgeIndex = retainingEdges[retainerIndex];
            if (essentialEdges.getBit(retainerEdgeIndex / edgeFieldsCount)) {
                return false;
            }
        }
        return true;
    }
    // The algorithm for building the dominator tree is from the paper:
    // Thomas Lengauer and Robert Endre Tarjan. 1979. A fast algorithm for finding dominators in a flowgraph.
    // ACM Trans. Program. Lang. Syst. 1, 1 (July 1979), 121–141. https://doi.org/10.1145/357062.357071
    static async calculateDominatorsAndRetainedSizes(inputs) {
        // Preload fields into local variables for better performance.
        const { nodeCount, firstEdgeIndexes, edgeFieldsCount, nodeFieldCount, firstRetainerIndex, retainingEdges, retainingNodes, edgeToNodeOrdinals, rootNodeOrdinal, essentialEdges, nodeSelfSizesPromise, port } = inputs;
        function isEssentialEdge(edgeIndex) {
            return essentialEdges.getBit(edgeIndex / edgeFieldsCount);
        }
        // The Lengauer-Tarjan algorithm expects vectors to be numbered from 1 to n
        // and uses 0 as an invalid value, so use 1-indexing for all the arrays.
        // Convert between ordinals and vertex numbers by adding/subtracting 1.
        const arrayLength = nodeCount + 1;
        const parent = new Uint32Array(arrayLength);
        const ancestor = new Uint32Array(arrayLength);
        const vertex = new Uint32Array(arrayLength);
        const label = new Uint32Array(arrayLength);
        const semi = new Uint32Array(arrayLength);
        const bucket = new Array(arrayLength);
        let n = 0;
        // Iterative DFS since the recursive version can cause stack overflows.
        // Use an array to keep track of the next edge index to be examined for each node.
        const nextEdgeIndex = new Uint32Array(arrayLength);
        const dfs = (root) => {
            const rootOrdinal = root - 1;
            nextEdgeIndex[rootOrdinal] = firstEdgeIndexes[rootOrdinal];
            let v = root;
            while (v !== 0) {
                // First process v if not done already.
                if (semi[v] === 0) {
                    semi[v] = ++n;
                    vertex[n] = label[v] = v;
                }
                // The next node to process is the first unprocessed successor w of v,
                // or parent[v] if all of v's successors have already been processed.
                let vNext = parent[v];
                const vOrdinal = v - 1;
                for (; nextEdgeIndex[vOrdinal] < firstEdgeIndexes[vOrdinal + 1]; nextEdgeIndex[vOrdinal] += edgeFieldsCount) {
                    const edgeIndex = nextEdgeIndex[vOrdinal];
                    if (!isEssentialEdge(edgeIndex)) {
                        continue;
                    }
                    const wOrdinal = edgeToNodeOrdinals[edgeIndex / edgeFieldsCount];
                    const w = wOrdinal + 1;
                    if (semi[w] === 0) {
                        parent[w] = v;
                        nextEdgeIndex[wOrdinal] = firstEdgeIndexes[wOrdinal];
                        vNext = w;
                        break;
                    }
                }
                v = vNext;
            }
        };
        // Iterative version since the recursive version can cause stack overflows.
        // Preallocate a stack since compress() is called several times.
        // The stack cannot grow larger than the number of nodes since we walk up
        // the tree represented by the ancestor array.
        const compressionStack = new Uint32Array(arrayLength);
        const compress = (v) => {
            let stackPointer = 0;
            while (ancestor[ancestor[v]] !== 0) {
                compressionStack[++stackPointer] = v;
                v = ancestor[v];
            }
            while (stackPointer > 0) {
                const w = compressionStack[stackPointer--];
                if (semi[label[ancestor[w]]] < semi[label[w]]) {
                    label[w] = label[ancestor[w]];
                }
                ancestor[w] = ancestor[ancestor[w]];
            }
        };
        // Simple versions of eval and link from the paper.
        const evaluate = (v) => {
            if (ancestor[v] === 0) {
                return v;
            }
            compress(v);
            return label[v];
        };
        const link = (v, w) => {
            ancestor[w] = v;
        };
        // Algorithm begins here. The variable names are as per the paper.
        const r = rootNodeOrdinal + 1;
        n = 0;
        const dom = new Uint32Array(arrayLength);
        // First perform DFS from the root.
        dfs(r);
        // Then perform DFS from orphan nodes (ones with only weak retainers) if any.
        if (n < nodeCount) {
            const errors = [`Heap snapshot: ${nodeCount - n} nodes are unreachable from the root.`];
            appendToProblemReport(errors, 'The following nodes have only weak retainers:');
            for (let v = 1; v <= nodeCount; v++) {
                const vOrdinal = v - 1;
                if (semi[v] === 0 && HeapSnapshot.hasOnlyWeakRetainers(inputs, vOrdinal)) {
                    appendToProblemReport(errors, vOrdinal * nodeFieldCount);
                    parent[v] = r;
                    dfs(v);
                }
            }
            reportProblemToPrimaryWorker(errors, port);
        }
        // If there are unreachable nodes still, visit them individually from the root.
        // This can happen when there is a clique of nodes retained by one another.
        if (n < nodeCount) {
            const errors = [`Heap snapshot: Still found ${nodeCount - n} unreachable nodes:`];
            for (let v = 1; v <= nodeCount; v++) {
                if (semi[v] === 0) {
                    const vOrdinal = v - 1;
                    appendToProblemReport(errors, vOrdinal * nodeFieldCount);
                    parent[v] = r;
                    semi[v] = ++n;
                    vertex[n] = label[v] = v;
                }
            }
            reportProblemToPrimaryWorker(errors, port);
        }
        // Main loop. Process the vertices in decreasing order by DFS number.
        for (let i = n; i >= 2; --i) {
            const w = vertex[i];
            // Iterate over all predecessors v of w.
            const wOrdinal = w - 1;
            let isOrphanNode = true;
            for (let retainerIndex = firstRetainerIndex[wOrdinal]; retainerIndex < firstRetainerIndex[wOrdinal + 1]; retainerIndex++) {
                if (!isEssentialEdge(retainingEdges[retainerIndex])) {
                    continue;
                }
                isOrphanNode = false;
                const vOrdinal = retainingNodes[retainerIndex] / nodeFieldCount;
                const v = vOrdinal + 1;
                const u = evaluate(v);
                if (semi[u] < semi[w]) {
                    semi[w] = semi[u];
                }
            }
            if (isOrphanNode) {
                // We treat orphan nodes as having a single predecessor - the root.
                // semi[r] is always less than any semi[w] so set it unconditionally.
                semi[w] = semi[r];
            }
            if (bucket[vertex[semi[w]]] === undefined) {
                bucket[vertex[semi[w]]] = new Set();
            }
            bucket[vertex[semi[w]]].add(w);
            link(parent[w], w);
            // Process all vertices v in bucket(parent(w)).
            if (bucket[parent[w]] !== undefined) {
                for (const v of bucket[parent[w]]) {
                    const u = evaluate(v);
                    dom[v] = semi[u] < semi[v] ? u : parent[w];
                }
                bucket[parent[w]].clear();
            }
        }
        // Final step. Fill in the immediate dominators not explicitly computed above.
        // Unlike the paper, we consider the root to be its own dominator and
        // set dom[0] to r to propagate the root as the dominator of unreachable nodes.
        dom[0] = dom[r] = r;
        for (let i = 2; i <= n; i++) {
            const w = vertex[i];
            if (dom[w] !== vertex[semi[w]]) {
                dom[w] = dom[dom[w]];
            }
        }
        // Algorithm ends here.
        // Transform the dominators into an ordinal-indexed array and populate the self sizes.
        const dominatorsTree = new Uint32Array(nodeCount);
        const retainedSizes = new Float64Array(nodeCount);
        const nodeSelfSizes = await nodeSelfSizesPromise;
        for (let nodeOrdinal = 0; nodeOrdinal < nodeCount; nodeOrdinal++) {
            dominatorsTree[nodeOrdinal] = dom[nodeOrdinal + 1] - 1;
            retainedSizes[nodeOrdinal] = nodeSelfSizes[nodeOrdinal];
        }
        // Then propagate up the retained sizes for each traversed node excluding the root.
        for (let i = n; i > 1; i--) {
            const nodeOrdinal = vertex[i] - 1;
            const dominatorOrdinal = dominatorsTree[nodeOrdinal];
            retainedSizes[dominatorOrdinal] += retainedSizes[nodeOrdinal];
        }
        return { dominatorsTree, retainedSizes };
    }
    static buildDominatedNodes(inputs) {
        const { nodeCount, dominatorsTree, rootNodeOrdinal, nodeFieldCount } = inputs;
        // Builds up two arrays:
        //  - "dominatedNodes" is a continuous array, where each node owns an
        //    interval (can be empty) with corresponding dominated nodes.
        //  - "indexArray" is an array of indexes in the "dominatedNodes"
        //    with the same positions as in the _nodeIndex.
        const indexArray = new Uint32Array(nodeCount + 1);
        // All nodes except the root have dominators.
        const dominatedNodes = new Uint32Array(nodeCount - 1);
        // Count the number of dominated nodes for each node. Skip the root (node at
        // index 0) as it is the only node that dominates itself.
        let fromNodeOrdinal = 0;
        let toNodeOrdinal = nodeCount;
        if (rootNodeOrdinal === fromNodeOrdinal) {
            fromNodeOrdinal = 1;
        }
        else if (rootNodeOrdinal === toNodeOrdinal - 1) {
            toNodeOrdinal = toNodeOrdinal - 1;
        }
        else {
            throw new Error('Root node is expected to be either first or last');
        }
        for (let nodeOrdinal = fromNodeOrdinal; nodeOrdinal < toNodeOrdinal; ++nodeOrdinal) {
            ++indexArray[dominatorsTree[nodeOrdinal]];
        }
        // Put in the first slot of each dominatedNodes slice the count of entries
        // that will be filled.
        let firstDominatedNodeIndex = 0;
        for (let i = 0, l = nodeCount; i < l; ++i) {
            const dominatedCount = dominatedNodes[firstDominatedNodeIndex] = indexArray[i];
            indexArray[i] = firstDominatedNodeIndex;
            firstDominatedNodeIndex += dominatedCount;
        }
        indexArray[nodeCount] = dominatedNodes.length;
        // Fill up the dominatedNodes array with indexes of dominated nodes. Skip the root (node at
        // index 0) as it is the only node that dominates itself.
        for (let nodeOrdinal = fromNodeOrdinal; nodeOrdinal < toNodeOrdinal; ++nodeOrdinal) {
            const dominatorOrdinal = dominatorsTree[nodeOrdinal];
            let dominatedRefIndex = indexArray[dominatorOrdinal];
            dominatedRefIndex += (--dominatedNodes[dominatedRefIndex]);
            dominatedNodes[dominatedRefIndex] = nodeOrdinal * nodeFieldCount;
        }
        return { firstDominatedNodeIndex: indexArray, dominatedNodes };
    }
    calculateObjectNames() {
        const { nodes, nodeCount, nodeNameOffset, nodeNativeType, nodeHiddenType, nodeObjectType, nodeCodeType, nodeClosureType, nodeRegExpType, } = this;
        // If the snapshot doesn't contain a detachedness field in each node, then
        // allocate a separate array so there is somewhere to store the class index.
        if (this.nodeDetachednessAndClassIndexOffset === -1) {
            this.detachednessAndClassIndexArray = new Uint32Array(nodeCount);
        }
        // We'll add some new values to the `strings` array during the processing below.
        // This map lets us easily find the index for each added string.
        const stringTable = new Map();
        const getIndexForString = (s) => {
            let index = stringTable.get(s);
            if (index === undefined) {
                index = this.addString(s);
                stringTable.set(s, index);
            }
            return index;
        };
        const hiddenClassIndex = getIndexForString('(system)');
        const codeClassIndex = getIndexForString('(compiled code)');
        const functionClassIndex = getIndexForString('Function');
        const regExpClassIndex = getIndexForString('RegExp');
        function getNodeClassIndex(node) {
            switch (node.rawType()) {
                case nodeHiddenType:
                    return hiddenClassIndex;
                case nodeObjectType:
                case nodeNativeType: {
                    let name = node.rawName();
                    // If the node name is (for example) '<div id="a">', then the class
                    // name should be just '<div>'. If the node name is already short
                    // enough, like '<div>', we must still call getIndexForString on that
                    // name, because the names added by getIndexForString are not
                    // deduplicated with preexisting strings, and we want all objects with
                    // class name '<div>' to refer to that class name via the same index.
                    // Otherwise, object categorization doesn't work.
                    if (name.startsWith('<')) {
                        const firstSpace = name.indexOf(' ');
                        if (firstSpace !== -1) {
                            name = name.substring(0, firstSpace) + '>';
                        }
                        return getIndexForString(name);
                    }
                    if (name.startsWith('Detached <')) {
                        const firstSpace = name.indexOf(' ', 10);
                        if (firstSpace !== -1) {
                            name = name.substring(0, firstSpace) + '>';
                        }
                        return getIndexForString(name);
                    }
                    // Avoid getIndexForString here; the class name index should match the name index.
                    return nodes.getValue(node.nodeIndex + nodeNameOffset);
                }
                case nodeCodeType:
                    return codeClassIndex;
                case nodeClosureType:
                    return functionClassIndex;
                case nodeRegExpType:
                    return regExpClassIndex;
                default:
                    return getIndexForString('(' + node.type() + ')');
            }
        }
        const node = this.createNode(0);
        for (let i = 0; i < nodeCount; ++i) {
            node.setClassIndex(getNodeClassIndex(node));
            node.nodeIndex = node.nextNodeIndex();
        }
    }
    interfaceDefinitions() {
        return JSON.stringify(__classPrivateFieldGet(this, _HeapSnapshot_interfaceDefinitions, "f") ?? []);
    }
    isPlainJSObject(node) {
        return node.rawType() === this.nodeObjectType && node.rawName() === 'Object';
    }
    inferInterfaceDefinitions() {
        const { edgePropertyType } = this;
        // A map from interface names to their definitions.
        const candidates = new Map();
        let totalObjectCount = 0;
        for (let it = this.allNodes(); it.hasNext(); it.next()) {
            const node = it.item();
            if (!this.isPlainJSObject(node)) {
                continue;
            }
            ++totalObjectCount;
            let interfaceName = '{';
            const properties = [];
            for (let edgeIt = node.edges(); edgeIt.hasNext(); edgeIt.next()) {
                const edge = edgeIt.item();
                const edgeName = edge.name();
                if (edge.rawType() !== edgePropertyType || edgeName === '__proto__') {
                    continue;
                }
                const formattedEdgeName = JSHeapSnapshotNode.formatPropertyName(edgeName);
                if (interfaceName.length > MIN_INTERFACE_PROPERTY_COUNT &&
                    interfaceName.length + formattedEdgeName.length > MAX_INTERFACE_NAME_LENGTH) {
                    break; // The interface name is getting too long.
                }
                if (interfaceName.length !== 1) {
                    interfaceName += ', ';
                }
                interfaceName += formattedEdgeName;
                properties.push(edgeName);
            }
            // The empty interface is not very meaningful, and can be sort of misleading
            // since someone might incorrectly interpret it as objects with no properties.
            if (properties.length === 0) {
                continue;
            }
            interfaceName += '}';
            const candidate = candidates.get(interfaceName);
            if (candidate) {
                ++candidate.count;
            }
            else {
                candidates.set(interfaceName, { name: interfaceName, properties, count: 1 });
            }
        }
        // Next, sort the candidates and select the most popular ones. It's possible that
        // some candidates represent the same properties in different orders, but that's
        // okay: by sorting here, we ensure that the most popular ordering appears first
        // in the result list, and the rules for applying interface definitions will prefer
        // the first matching definition if multiple matches contain the same properties.
        const sortedCandidates = Array.from(candidates.values());
        sortedCandidates.sort((a, b) => b.count - a.count);
        const result = [];
        const minCount = Math.max(MIN_OBJECT_COUNT_PER_INTERFACE, totalObjectCount / MIN_OBJECT_PROPORTION_PER_INTERFACE);
        for (let i = 0; i < sortedCandidates.length; ++i) {
            const candidate = sortedCandidates[i];
            if (candidate.count < minCount) {
                break;
            }
            result.push(candidate);
        }
        return result;
    }
    applyInterfaceDefinitions(definitions) {
        const { edgePropertyType } = this;
        __classPrivateFieldSet(this, _HeapSnapshot_interfaceDefinitions, definitions, "f");
        // Any computed aggregate data will be wrong after recategorization, so clear it.
        __classPrivateFieldSet(this, _HeapSnapshot_aggregates, {}, "f");
        __classPrivateFieldSet(this, _HeapSnapshot_aggregatesSortedFlags, {}, "f");
        function selectBetterMatch(a, b) {
            if (!b || a.propertyCount > b.propertyCount) {
                return a;
            }
            if (b.propertyCount > a.propertyCount) {
                return b;
            }
            return a.index <= b.index ? a : b;
        }
        // The root node of the tree.
        const propertyTree = {
            next: new Map(),
            matchInfo: null,
            greatestNext: null,
        };
        // Build up the property tree.
        for (let interfaceIndex = 0; interfaceIndex < definitions.length; ++interfaceIndex) {
            const definition = definitions[interfaceIndex];
            const properties = definition.properties.toSorted();
            let currentNode = propertyTree;
            for (const property of properties) {
                const nextMap = currentNode.next;
                let nextNode = nextMap.get(property);
                if (!nextNode) {
                    nextNode = {
                        next: new Map(),
                        matchInfo: null,
                        greatestNext: null,
                    };
                    nextMap.set(property, nextNode);
                    if (currentNode.greatestNext === null || currentNode.greatestNext < property) {
                        currentNode.greatestNext = property;
                    }
                }
                currentNode = nextNode;
            }
            // Only set matchInfo on this node if it wasn't already set, to ensure that
            // interfaces defined earlier in the list have priority.
            if (!currentNode.matchInfo) {
                currentNode.matchInfo = {
                    name: definition.name,
                    propertyCount: properties.length,
                    index: interfaceIndex,
                };
            }
        }
        // The fallback match for objects which don't match any defined interface.
        const initialMatch = {
            name: 'Object',
            propertyCount: 0,
            index: Infinity,
        };
        // Iterate all nodes and check whether they match a named interface, using
        // the tree constructed above. Then update the class name for each node.
        for (let it = this.allNodes(); it.hasNext(); it.next()) {
            const node = it.item();
            if (!this.isPlainJSObject(node)) {
                continue;
            }
            // Collect and sort the properties of this object.
            const properties = [];
            for (let edgeIt = node.edges(); edgeIt.hasNext(); edgeIt.next()) {
                const edge = edgeIt.item();
                if (edge.rawType() === edgePropertyType) {
                    properties.push(edge.name());
                }
            }
            properties.sort();
            // We may explore multiple possible paths through the tree, so this set tracks
            // all states that match with the properties iterated thus far.
            const states = new Set();
            states.add(propertyTree);
            // This variable represents the best match found thus far. We start by checking
            // whether there is an interface definition for the empty object.
            let match = selectBetterMatch(initialMatch, propertyTree.matchInfo);
            // Traverse the tree to find any matches.
            for (const property of properties) {
                // Iterate only the states that already exist, not the ones added during the loop below.
                for (const currentState of Array.from(states.keys())) {
                    if (currentState.greatestNext === null || property >= currentState.greatestNext) {
                        // No further transitions are possible from this state.
                        states.delete(currentState);
                    }
                    const nextState = currentState.next.get(property);
                    if (nextState) {
                        states.add(nextState);
                        match = selectBetterMatch(match, nextState.matchInfo);
                    }
                }
            }
            // Update the node's class name accordingly.
            let classIndex = match === initialMatch ? node.rawNameIndex() : __classPrivateFieldGet(this, _HeapSnapshot_interfaceNames, "f").get(match.name);
            if (classIndex === undefined) {
                classIndex = this.addString(match.name);
                __classPrivateFieldGet(this, _HeapSnapshot_interfaceNames, "f").set(match.name, classIndex);
            }
            node.setClassIndex(classIndex);
        }
    }
    /**
     * Iterates children of a node.
     */
    iterateFilteredChildren(nodeOrdinal, edgeFilterCallback, childCallback) {
        const beginEdgeIndex = this.firstEdgeIndexes[nodeOrdinal];
        const endEdgeIndex = this.firstEdgeIndexes[nodeOrdinal + 1];
        for (let edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += this.edgeFieldsCount) {
            const childNodeIndex = this.containmentEdges.getValue(edgeIndex + this.edgeToNodeOffset);
            const childNodeOrdinal = childNodeIndex / this.nodeFieldCount;
            const type = this.containmentEdges.getValue(edgeIndex + this.edgeTypeOffset);
            if (!edgeFilterCallback(type)) {
                continue;
            }
            childCallback(childNodeOrdinal);
        }
    }
    /**
     * Adds a string to the snapshot.
     */
    addString(string) {
        this.strings.push(string);
        return this.strings.length - 1;
    }
    /**
     * The phase propagates whether a node is attached or detached through the
     * graph and adjusts the low-level representation of nodes.
     *
     * State propagation:
     * 1. Any object reachable from an attached object is itself attached.
     * 2. Any object reachable from a detached object that is not already
     *    attached is considered detached.
     *
     * Representation:
     * - Name of any detached node is changed from "<Name>"" to
     *   "Detached <Name>".
     */
    propagateDOMState() {
        if (this.nodeDetachednessAndClassIndexOffset === -1) {
            return;
        }
        console.time('propagateDOMState');
        const visited = new Uint8Array(this.nodeCount);
        const attached = [];
        const detached = [];
        const stringIndexCache = new Map();
        const node = this.createNode(0);
        /**
         * Adds a 'Detached ' prefix to the name of a node.
         */
        const addDetachedPrefixToNodeName = function (snapshot, nodeIndex) {
            const oldStringIndex = snapshot.nodes.getValue(nodeIndex + snapshot.nodeNameOffset);
            let newStringIndex = stringIndexCache.get(oldStringIndex);
            if (newStringIndex === undefined) {
                newStringIndex = snapshot.addString('Detached ' + snapshot.strings[oldStringIndex]);
                stringIndexCache.set(oldStringIndex, newStringIndex);
            }
            snapshot.nodes.setValue(nodeIndex + snapshot.nodeNameOffset, newStringIndex);
        };
        /**
         * Processes a node represented by nodeOrdinal:
         * - Changes its name based on newState.
         * - Puts it onto working sets for attached or detached nodes.
         */
        const processNode = function (snapshot, nodeOrdinal, newState) {
            if (visited[nodeOrdinal]) {
                return;
            }
            const nodeIndex = nodeOrdinal * snapshot.nodeFieldCount;
            // Early bailout: Do not propagate the state (and name change) through JavaScript. Every
            // entry point into embedder code is a node that knows its own state. All embedder nodes
            // have their node type set to native.
            if (snapshot.nodes.getValue(nodeIndex + snapshot.nodeTypeOffset) !== snapshot.nodeNativeType) {
                visited[nodeOrdinal] = 1;
                return;
            }
            node.nodeIndex = nodeIndex;
            node.setDetachedness(newState);
            if (newState === 1 /* DOMLinkState.ATTACHED */) {
                attached.push(nodeOrdinal);
            }
            else if (newState === 2 /* DOMLinkState.DETACHED */) {
                // Detached state: Rewire node name.
                addDetachedPrefixToNodeName(snapshot, nodeIndex);
                detached.push(nodeOrdinal);
            }
            visited[nodeOrdinal] = 1;
        };
        const propagateState = function (snapshot, parentNodeOrdinal, newState) {
            snapshot.iterateFilteredChildren(parentNodeOrdinal, edgeType => ![snapshot.edgeHiddenType, snapshot.edgeInvisibleType, snapshot.edgeWeakType].includes(edgeType), nodeOrdinal => processNode(snapshot, nodeOrdinal, newState));
        };
        // 1. We re-use the deserialized field to store the propagated state. While
        //    the state for known nodes is already set, they still need to go
        //    through processing to have their name adjusted and them enqueued in
        //    the respective queues.
        for (let nodeOrdinal = 0; nodeOrdinal < this.nodeCount; ++nodeOrdinal) {
            node.nodeIndex = nodeOrdinal * this.nodeFieldCount;
            const state = node.detachedness();
            // Bail out for objects that have no known state. For all other objects set that state.
            if (state === 0 /* DOMLinkState.UNKNOWN */) {
                continue;
            }
            processNode(this, nodeOrdinal, state);
        }
        // 2. If the parent is attached, then the child is also attached.
        while (attached.length !== 0) {
            const nodeOrdinal = attached.pop();
            propagateState(this, nodeOrdinal, 1 /* DOMLinkState.ATTACHED */);
        }
        // 3. If the parent is not attached, then the child inherits the parent's state.
        while (detached.length !== 0) {
            const nodeOrdinal = detached.pop();
            node.nodeIndex = nodeOrdinal * this.nodeFieldCount;
            const nodeState = node.detachedness();
            // Ignore if the node has been found through propagating forward attached state.
            if (nodeState === 1 /* DOMLinkState.ATTACHED */) {
                continue;
            }
            propagateState(this, nodeOrdinal, 2 /* DOMLinkState.DETACHED */);
        }
        console.timeEnd('propagateDOMState');
    }
    buildSamples() {
        const samples = __classPrivateFieldGet(this, _HeapSnapshot_rawSamples, "f");
        if (!samples?.length) {
            return;
        }
        const sampleCount = samples.length / 2;
        const sizeForRange = new Array(sampleCount);
        const timestamps = new Array(sampleCount);
        const lastAssignedIds = new Array(sampleCount);
        const timestampOffset = __classPrivateFieldGet(this, _HeapSnapshot_metaNode, "f").sample_fields.indexOf('timestamp_us');
        const lastAssignedIdOffset = __classPrivateFieldGet(this, _HeapSnapshot_metaNode, "f").sample_fields.indexOf('last_assigned_id');
        for (let i = 0; i < sampleCount; i++) {
            sizeForRange[i] = 0;
            timestamps[i] = (samples[2 * i + timestampOffset]) / 1000;
            lastAssignedIds[i] = samples[2 * i + lastAssignedIdOffset];
        }
        const nodes = this.nodes;
        const nodesLength = nodes.length;
        const nodeFieldCount = this.nodeFieldCount;
        const node = this.rootNode();
        for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            node.nodeIndex = nodeIndex;
            const nodeId = node.id();
            // JS objects have odd ids, skip native objects.
            if (nodeId % 2 === 0) {
                continue;
            }
            const rangeIndex = Platform.ArrayUtilities.lowerBound(lastAssignedIds, nodeId, Platform.ArrayUtilities.DEFAULT_COMPARATOR);
            if (rangeIndex === sampleCount) {
                // TODO: make heap profiler not allocate while taking snapshot
                continue;
            }
            sizeForRange[rangeIndex] += node.selfSize();
        }
        __classPrivateFieldSet(this, _HeapSnapshot_samples, new HeapSnapshotModel.HeapSnapshotModel.Samples(timestamps, lastAssignedIds, sizeForRange), "f");
    }
    buildLocationMap() {
        const map = new Map();
        const locations = __classPrivateFieldGet(this, _HeapSnapshot_locations, "f");
        for (let i = 0; i < locations.length; i += __classPrivateFieldGet(this, _HeapSnapshot_locationFieldCount, "f")) {
            const nodeIndex = locations[i + __classPrivateFieldGet(this, _HeapSnapshot_locationIndexOffset, "f")];
            const scriptId = locations[i + __classPrivateFieldGet(this, _HeapSnapshot_locationScriptIdOffset, "f")];
            const line = locations[i + __classPrivateFieldGet(this, _HeapSnapshot_locationLineOffset, "f")];
            const col = locations[i + __classPrivateFieldGet(this, _HeapSnapshot_locationColumnOffset, "f")];
            map.set(nodeIndex, new HeapSnapshotModel.HeapSnapshotModel.Location(scriptId, line, col));
        }
        __classPrivateFieldSet(this, _HeapSnapshot_locationMap, map, "f");
    }
    getLocation(nodeIndex) {
        return __classPrivateFieldGet(this, _HeapSnapshot_locationMap, "f").get(nodeIndex) || null;
    }
    getSamples() {
        return __classPrivateFieldGet(this, _HeapSnapshot_samples, "f");
    }
    calculateFlags() {
        throw new Error('Not implemented');
    }
    calculateStatistics() {
        throw new Error('Not implemented');
    }
    userObjectsMapAndFlag() {
        throw new Error('Not implemented');
    }
    calculateSnapshotDiff(baseSnapshotId, baseSnapshotAggregates) {
        let snapshotDiff = __classPrivateFieldGet(this, _HeapSnapshot_snapshotDiffs, "f")[baseSnapshotId];
        if (snapshotDiff) {
            return snapshotDiff;
        }
        snapshotDiff = {};
        const aggregates = this.getAggregatesByClassKey(true, 'allObjects');
        for (const classKey in baseSnapshotAggregates) {
            const baseAggregate = baseSnapshotAggregates[classKey];
            const diff = this.calculateDiffForClass(baseAggregate, aggregates[classKey]);
            if (diff) {
                snapshotDiff[classKey] = diff;
            }
        }
        const emptyBaseAggregate = new HeapSnapshotModel.HeapSnapshotModel.AggregateForDiff();
        for (const classKey in aggregates) {
            if (classKey in baseSnapshotAggregates) {
                continue;
            }
            const classDiff = this.calculateDiffForClass(emptyBaseAggregate, aggregates[classKey]);
            if (classDiff) {
                snapshotDiff[classKey] = classDiff;
            }
        }
        __classPrivateFieldGet(this, _HeapSnapshot_snapshotDiffs, "f")[baseSnapshotId] = snapshotDiff;
        return snapshotDiff;
    }
    calculateDiffForClass(baseAggregate, aggregate) {
        const baseIds = baseAggregate.ids;
        const baseIndexes = baseAggregate.indexes;
        const baseSelfSizes = baseAggregate.selfSizes;
        const indexes = aggregate ? aggregate.idxs : [];
        let i = 0;
        let j = 0;
        const l = baseIds.length;
        const m = indexes.length;
        const diff = new HeapSnapshotModel.HeapSnapshotModel.Diff(aggregate ? aggregate.name : baseAggregate.name);
        const nodeB = this.createNode(indexes[j]);
        while (i < l && j < m) {
            const nodeAId = baseIds[i];
            if (nodeAId < nodeB.id()) {
                diff.deletedIndexes.push(baseIndexes[i]);
                diff.removedCount++;
                diff.removedSize += baseSelfSizes[i];
                ++i;
            }
            else if (nodeAId >
                nodeB.id()) { // Native nodes(e.g. dom groups) may have ids less than max JS object id in the base snapshot
                diff.addedIndexes.push(indexes[j]);
                diff.addedCount++;
                diff.addedSize += nodeB.selfSize();
                nodeB.nodeIndex = indexes[++j];
            }
            else { // nodeAId === nodeB.id()
                ++i;
                nodeB.nodeIndex = indexes[++j];
            }
        }
        while (i < l) {
            diff.deletedIndexes.push(baseIndexes[i]);
            diff.removedCount++;
            diff.removedSize += baseSelfSizes[i];
            ++i;
        }
        while (j < m) {
            diff.addedIndexes.push(indexes[j]);
            diff.addedCount++;
            diff.addedSize += nodeB.selfSize();
            nodeB.nodeIndex = indexes[++j];
        }
        diff.countDelta = diff.addedCount - diff.removedCount;
        diff.sizeDelta = diff.addedSize - diff.removedSize;
        if (!diff.addedCount && !diff.removedCount) {
            return null;
        }
        return diff;
    }
    nodeForSnapshotObjectId(snapshotObjectId) {
        for (let it = this.allNodes(); it.hasNext(); it.next()) {
            if (it.node.id() === snapshotObjectId) {
                return it.node;
            }
        }
        return null;
    }
    // Converts an internal class key, suitable for categorizing within this
    // snapshot, to a public class key, which can be used in comparisons
    // between multiple snapshots.
    classKeyFromClassKeyInternal(key) {
        return typeof key === 'number' ? (',' + this.strings[key]) : key;
    }
    nodeClassKey(snapshotObjectId) {
        const node = this.nodeForSnapshotObjectId(snapshotObjectId);
        if (node) {
            return this.classKeyFromClassKeyInternal(node.classKeyInternal());
        }
        return null;
    }
    idsOfObjectsWithName(name) {
        const ids = [];
        for (let it = this.allNodes(); it.hasNext(); it.next()) {
            if (it.item().name() === name) {
                ids.push(it.item().id());
            }
        }
        return ids;
    }
    createEdgesProvider(nodeIndex) {
        const node = this.createNode(nodeIndex);
        const filter = this.containmentEdgesFilter();
        const indexProvider = new HeapSnapshotEdgeIndexProvider(this);
        return new HeapSnapshotEdgesProvider(this, filter, node.edges(), indexProvider);
    }
    createEdgesProviderForTest(nodeIndex, filter) {
        const node = this.createNode(nodeIndex);
        const indexProvider = new HeapSnapshotEdgeIndexProvider(this);
        return new HeapSnapshotEdgesProvider(this, filter, node.edges(), indexProvider);
    }
    retainingEdgesFilter() {
        return null;
    }
    containmentEdgesFilter() {
        return null;
    }
    createRetainingEdgesProvider(nodeIndex) {
        const node = this.createNode(nodeIndex);
        const filter = this.retainingEdgesFilter();
        const indexProvider = new HeapSnapshotRetainerEdgeIndexProvider(this);
        return new HeapSnapshotEdgesProvider(this, filter, node.retainers(), indexProvider);
    }
    createAddedNodesProvider(baseSnapshotId, classKey) {
        const snapshotDiff = __classPrivateFieldGet(this, _HeapSnapshot_snapshotDiffs, "f")[baseSnapshotId];
        const diffForClass = snapshotDiff[classKey];
        return new HeapSnapshotNodesProvider(this, diffForClass.addedIndexes);
    }
    createDeletedNodesProvider(nodeIndexes) {
        return new HeapSnapshotNodesProvider(this, nodeIndexes);
    }
    createNodesProviderForClass(classKey, nodeFilter) {
        return new HeapSnapshotNodesProvider(this, this.aggregatesWithFilter(nodeFilter)[classKey].idxs);
    }
    maxJsNodeId() {
        const nodeFieldCount = this.nodeFieldCount;
        const nodes = this.nodes;
        const nodesLength = nodes.length;
        let id = 0;
        for (let nodeIndex = this.nodeIdOffset; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            const nextId = nodes.getValue(nodeIndex);
            // JS objects have odd ids, skip native objects.
            if (nextId % 2 === 0) {
                continue;
            }
            if (id < nextId) {
                id = nextId;
            }
        }
        return id;
    }
    updateStaticData() {
        return new HeapSnapshotModel.HeapSnapshotModel.StaticData(this.nodeCount, this.rootNodeIndexInternal, this.totalSize, this.maxJsNodeId());
    }
    ignoreNodeInRetainersView(nodeIndex) {
        __classPrivateFieldGet(this, _HeapSnapshot_ignoredNodesInRetainersView, "f").add(nodeIndex);
        this.calculateDistances(/* isForRetainersView=*/ true);
        __classPrivateFieldGet(this, _HeapSnapshot_instances, "m", _HeapSnapshot_updateIgnoredEdgesInRetainersView).call(this);
    }
    unignoreNodeInRetainersView(nodeIndex) {
        __classPrivateFieldGet(this, _HeapSnapshot_ignoredNodesInRetainersView, "f").delete(nodeIndex);
        if (__classPrivateFieldGet(this, _HeapSnapshot_ignoredNodesInRetainersView, "f").size === 0) {
            __classPrivateFieldSet(this, _HeapSnapshot_nodeDistancesForRetainersView, undefined, "f");
        }
        else {
            this.calculateDistances(/* isForRetainersView=*/ true);
        }
        __classPrivateFieldGet(this, _HeapSnapshot_instances, "m", _HeapSnapshot_updateIgnoredEdgesInRetainersView).call(this);
    }
    unignoreAllNodesInRetainersView() {
        __classPrivateFieldGet(this, _HeapSnapshot_ignoredNodesInRetainersView, "f").clear();
        __classPrivateFieldSet(this, _HeapSnapshot_nodeDistancesForRetainersView, undefined, "f");
        __classPrivateFieldGet(this, _HeapSnapshot_instances, "m", _HeapSnapshot_updateIgnoredEdgesInRetainersView).call(this);
    }
    areNodesIgnoredInRetainersView() {
        return __classPrivateFieldGet(this, _HeapSnapshot_ignoredNodesInRetainersView, "f").size > 0;
    }
    getDistanceForRetainersView(nodeIndex) {
        const nodeOrdinal = nodeIndex / this.nodeFieldCount;
        const distances = __classPrivateFieldGet(this, _HeapSnapshot_nodeDistancesForRetainersView, "f") ?? this.nodeDistances;
        const distance = distances[nodeOrdinal];
        if (distance === __classPrivateFieldGet(this, _HeapSnapshot_noDistance, "f")) {
            // An unreachable node should be sorted to the end, not the beginning.
            // To give such nodes a reasonable sorting order, we add a very large
            // number to the original distance computed without ignoring any nodes.
            return Math.max(0, this.nodeDistances[nodeOrdinal]) + HeapSnapshotModel.HeapSnapshotModel.baseUnreachableDistance;
        }
        return distance;
    }
    isNodeIgnoredInRetainersView(nodeIndex) {
        return __classPrivateFieldGet(this, _HeapSnapshot_ignoredNodesInRetainersView, "f").has(nodeIndex);
    }
    isEdgeIgnoredInRetainersView(edgeIndex) {
        return __classPrivateFieldGet(this, _HeapSnapshot_ignoredEdgesInRetainersView, "f").has(edgeIndex);
    }
}
_HeapSnapshot_metaNode = new WeakMap(), _HeapSnapshot_rawSamples = new WeakMap(), _HeapSnapshot_samples = new WeakMap(), _HeapSnapshot_locations = new WeakMap(), _HeapSnapshot_progress = new WeakMap(), _HeapSnapshot_noDistance = new WeakMap(), _HeapSnapshot_snapshotDiffs = new WeakMap(), _HeapSnapshot_aggregatesForDiffInternal = new WeakMap(), _HeapSnapshot_aggregates = new WeakMap(), _HeapSnapshot_aggregatesSortedFlags = new WeakMap(), _HeapSnapshot_nodeEdgeCountOffset = new WeakMap(), _HeapSnapshot_locationIndexOffset = new WeakMap(), _HeapSnapshot_locationScriptIdOffset = new WeakMap(), _HeapSnapshot_locationLineOffset = new WeakMap(), _HeapSnapshot_locationColumnOffset = new WeakMap(), _HeapSnapshot_locationFieldCount = new WeakMap(), _HeapSnapshot_edgeCount = new WeakMap(), _HeapSnapshot_allocationProfile = new WeakMap(), _HeapSnapshot_locationMap = new WeakMap(), _HeapSnapshot_ignoredNodesInRetainersView = new WeakMap(), _HeapSnapshot_ignoredEdgesInRetainersView = new WeakMap(), _HeapSnapshot_nodeDistancesForRetainersView = new WeakMap(), _HeapSnapshot_edgeNamesThatAreNotWeakMaps = new WeakMap(), _HeapSnapshot_interfaceNames = new WeakMap(), _HeapSnapshot_interfaceDefinitions = new WeakMap(), _HeapSnapshot_instances = new WeakSet(), _HeapSnapshot_updateIgnoredEdgesInRetainersView = function _HeapSnapshot_updateIgnoredEdgesInRetainersView() {
    const distances = __classPrivateFieldGet(this, _HeapSnapshot_nodeDistancesForRetainersView, "f");
    __classPrivateFieldGet(this, _HeapSnapshot_ignoredEdgesInRetainersView, "f").clear();
    if (distances === undefined) {
        return;
    }
    // To retain a value in a WeakMap, both the WeakMap and the corresponding
    // key must stay alive. If one of those two retainers is unreachable due to
    // the user ignoring some nodes, then the other retainer edge should also be
    // shown as unreachable, since it would be insufficient on its own to retain
    // the value.
    const unreachableWeakMapEdges = new Platform.MapUtilities.Multimap();
    const noDistance = __classPrivateFieldGet(this, _HeapSnapshot_noDistance, "f");
    const { nodeCount, nodeFieldCount } = this;
    const node = this.createNode(0);
    // Populate unreachableWeakMapEdges.
    for (let nodeOrdinal = 0; nodeOrdinal < nodeCount; ++nodeOrdinal) {
        if (distances[nodeOrdinal] !== noDistance) {
            continue;
        }
        node.nodeIndex = nodeOrdinal * nodeFieldCount;
        for (let iter = node.edges(); iter.hasNext(); iter.next()) {
            const edge = iter.edge;
            if (!edge.isInternal()) {
                continue;
            }
            const match = this.tryParseWeakMapEdgeName(edge.nameIndex());
            if (match) {
                unreachableWeakMapEdges.set(edge.nodeIndex(), match.duplicatedPart);
            }
        }
    }
    // Iterate the retaining edges for the target nodes found in the previous
    // step and mark any relevant WeakMap edges as ignored.
    for (const targetNodeIndex of unreachableWeakMapEdges.keys()) {
        node.nodeIndex = targetNodeIndex;
        for (let it = node.retainers(); it.hasNext(); it.next()) {
            const reverseEdge = it.item();
            if (!reverseEdge.isInternal()) {
                continue;
            }
            const match = this.tryParseWeakMapEdgeName(reverseEdge.nameIndex());
            if (match && unreachableWeakMapEdges.hasValue(targetNodeIndex, match.duplicatedPart)) {
                const forwardEdgeIndex = this.retainingEdges[reverseEdge.itemIndex()];
                __classPrivateFieldGet(this, _HeapSnapshot_ignoredEdgesInRetainersView, "f").add(forwardEdgeIndex);
            }
        }
    }
};
export class HeapSnapshotItemProvider {
    constructor(iterator, indexProvider) {
        _HeapSnapshotItemProvider_indexProvider.set(this, void 0);
        _HeapSnapshotItemProvider_isEmptyInternal.set(this, void 0);
        _HeapSnapshotItemProvider_sortedPrefixLength.set(this, void 0);
        _HeapSnapshotItemProvider_sortedSuffixLength.set(this, void 0);
        this.iterator = iterator;
        __classPrivateFieldSet(this, _HeapSnapshotItemProvider_indexProvider, indexProvider, "f");
        __classPrivateFieldSet(this, _HeapSnapshotItemProvider_isEmptyInternal, !iterator.hasNext(), "f");
        this.iterationOrder = null;
        this.currentComparator = null;
        __classPrivateFieldSet(this, _HeapSnapshotItemProvider_sortedPrefixLength, 0, "f");
        __classPrivateFieldSet(this, _HeapSnapshotItemProvider_sortedSuffixLength, 0, "f");
    }
    createIterationOrder() {
        if (this.iterationOrder) {
            return;
        }
        this.iterationOrder = [];
        for (let iterator = this.iterator; iterator.hasNext(); iterator.next()) {
            this.iterationOrder.push(iterator.item().itemIndex());
        }
    }
    isEmpty() {
        return __classPrivateFieldGet(this, _HeapSnapshotItemProvider_isEmptyInternal, "f");
    }
    serializeItemsRange(begin, end) {
        this.createIterationOrder();
        if (begin > end) {
            throw new Error('Start position > end position: ' + begin + ' > ' + end);
        }
        if (!this.iterationOrder) {
            throw new Error('Iteration order undefined');
        }
        if (end > this.iterationOrder.length) {
            end = this.iterationOrder.length;
        }
        if (__classPrivateFieldGet(this, _HeapSnapshotItemProvider_sortedPrefixLength, "f") < end && begin < this.iterationOrder.length - __classPrivateFieldGet(this, _HeapSnapshotItemProvider_sortedSuffixLength, "f") &&
            this.currentComparator) {
            const currentComparator = this.currentComparator;
            this.sort(currentComparator, __classPrivateFieldGet(this, _HeapSnapshotItemProvider_sortedPrefixLength, "f"), this.iterationOrder.length - 1 - __classPrivateFieldGet(this, _HeapSnapshotItemProvider_sortedSuffixLength, "f"), begin, end - 1);
            if (begin <= __classPrivateFieldGet(this, _HeapSnapshotItemProvider_sortedPrefixLength, "f")) {
                __classPrivateFieldSet(this, _HeapSnapshotItemProvider_sortedPrefixLength, end, "f");
            }
            if (end >= this.iterationOrder.length - __classPrivateFieldGet(this, _HeapSnapshotItemProvider_sortedSuffixLength, "f")) {
                __classPrivateFieldSet(this, _HeapSnapshotItemProvider_sortedSuffixLength, this.iterationOrder.length - begin, "f");
            }
        }
        let position = begin;
        const count = end - begin;
        const result = new Array(count);
        for (let i = 0; i < count; ++i) {
            const itemIndex = this.iterationOrder[position++];
            const item = __classPrivateFieldGet(this, _HeapSnapshotItemProvider_indexProvider, "f").itemForIndex(itemIndex);
            result[i] = item.serialize();
        }
        return new HeapSnapshotModel.HeapSnapshotModel.ItemsRange(begin, end, this.iterationOrder.length, result);
    }
    sortAndRewind(comparator) {
        this.currentComparator = comparator;
        __classPrivateFieldSet(this, _HeapSnapshotItemProvider_sortedPrefixLength, 0, "f");
        __classPrivateFieldSet(this, _HeapSnapshotItemProvider_sortedSuffixLength, 0, "f");
    }
}
_HeapSnapshotItemProvider_indexProvider = new WeakMap(), _HeapSnapshotItemProvider_isEmptyInternal = new WeakMap(), _HeapSnapshotItemProvider_sortedPrefixLength = new WeakMap(), _HeapSnapshotItemProvider_sortedSuffixLength = new WeakMap();
export class HeapSnapshotEdgesProvider extends HeapSnapshotItemProvider {
    constructor(snapshot, filter, edgesIter, indexProvider) {
        const iter = filter ? new HeapSnapshotFilteredIterator(edgesIter, filter) :
            edgesIter;
        super(iter, indexProvider);
        this.snapshot = snapshot;
    }
    sort(comparator, leftBound, rightBound, windowLeft, windowRight) {
        const fieldName1 = comparator.fieldName1;
        const fieldName2 = comparator.fieldName2;
        const ascending1 = comparator.ascending1;
        const ascending2 = comparator.ascending2;
        const edgeA = this.iterator.item().clone();
        const edgeB = edgeA.clone();
        const nodeA = this.snapshot.createNode();
        const nodeB = this.snapshot.createNode();
        function compareEdgeField(fieldName, ascending, indexA, indexB) {
            edgeA.edgeIndex = indexA;
            edgeB.edgeIndex = indexB;
            let result = 0;
            if (fieldName === '!edgeName') {
                if (edgeB.name() === '__proto__') {
                    return -1;
                }
                if (edgeA.name() === '__proto__') {
                    return 1;
                }
                result = edgeA.hasStringName() === edgeB.hasStringName() ?
                    (edgeA.name() < edgeB.name() ? -1 : (edgeA.name() > edgeB.name() ? 1 : 0)) :
                    (edgeA.hasStringName() ? -1 : 1);
            }
            else {
                result = edgeA.getValueForSorting(fieldName) - edgeB.getValueForSorting(fieldName);
            }
            return ascending ? result : -result;
        }
        function compareNodeField(fieldName, ascending, indexA, indexB) {
            edgeA.edgeIndex = indexA;
            nodeA.nodeIndex = edgeA.nodeIndex();
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const valueA = nodeA[fieldName]();
            edgeB.edgeIndex = indexB;
            nodeB.nodeIndex = edgeB.nodeIndex();
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const valueB = nodeB[fieldName]();
            const result = valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
            return ascending ? result : -result;
        }
        function compareEdgeAndEdge(indexA, indexB) {
            let result = compareEdgeField(fieldName1, ascending1, indexA, indexB);
            if (result === 0) {
                result = compareEdgeField(fieldName2, ascending2, indexA, indexB);
            }
            if (result === 0) {
                return indexA - indexB;
            }
            return result;
        }
        function compareEdgeAndNode(indexA, indexB) {
            let result = compareEdgeField(fieldName1, ascending1, indexA, indexB);
            if (result === 0) {
                result = compareNodeField(fieldName2, ascending2, indexA, indexB);
            }
            if (result === 0) {
                return indexA - indexB;
            }
            return result;
        }
        function compareNodeAndEdge(indexA, indexB) {
            let result = compareNodeField(fieldName1, ascending1, indexA, indexB);
            if (result === 0) {
                result = compareEdgeField(fieldName2, ascending2, indexA, indexB);
            }
            if (result === 0) {
                return indexA - indexB;
            }
            return result;
        }
        function compareNodeAndNode(indexA, indexB) {
            let result = compareNodeField(fieldName1, ascending1, indexA, indexB);
            if (result === 0) {
                result = compareNodeField(fieldName2, ascending2, indexA, indexB);
            }
            if (result === 0) {
                return indexA - indexB;
            }
            return result;
        }
        if (!this.iterationOrder) {
            throw new Error('Iteration order not defined');
        }
        function isEdgeFieldName(fieldName) {
            return fieldName.startsWith('!edge');
        }
        if (isEdgeFieldName(fieldName1)) {
            if (isEdgeFieldName(fieldName2)) {
                Platform.ArrayUtilities.sortRange(this.iterationOrder, compareEdgeAndEdge, leftBound, rightBound, windowLeft, windowRight);
            }
            else {
                Platform.ArrayUtilities.sortRange(this.iterationOrder, compareEdgeAndNode, leftBound, rightBound, windowLeft, windowRight);
            }
        }
        else if (isEdgeFieldName(fieldName2)) {
            Platform.ArrayUtilities.sortRange(this.iterationOrder, compareNodeAndEdge, leftBound, rightBound, windowLeft, windowRight);
        }
        else {
            Platform.ArrayUtilities.sortRange(this.iterationOrder, compareNodeAndNode, leftBound, rightBound, windowLeft, windowRight);
        }
    }
}
export class HeapSnapshotNodesProvider extends HeapSnapshotItemProvider {
    constructor(snapshot, nodeIndexes) {
        const indexProvider = new HeapSnapshotNodeIndexProvider(snapshot);
        const it = new HeapSnapshotIndexRangeIterator(indexProvider, nodeIndexes);
        super(it, indexProvider);
        this.snapshot = snapshot;
    }
    nodePosition(snapshotObjectId) {
        this.createIterationOrder();
        const node = this.snapshot.createNode();
        let i = 0;
        if (!this.iterationOrder) {
            throw new Error('Iteration order not defined');
        }
        for (; i < this.iterationOrder.length; i++) {
            node.nodeIndex = this.iterationOrder[i];
            if (node.id() === snapshotObjectId) {
                break;
            }
        }
        if (i === this.iterationOrder.length) {
            return -1;
        }
        const targetNodeIndex = this.iterationOrder[i];
        let smallerCount = 0;
        const currentComparator = this.currentComparator;
        const compare = this.buildCompareFunction(currentComparator);
        for (let i = 0; i < this.iterationOrder.length; i++) {
            if (compare(this.iterationOrder[i], targetNodeIndex) < 0) {
                ++smallerCount;
            }
        }
        return smallerCount;
    }
    buildCompareFunction(comparator) {
        const nodeA = this.snapshot.createNode();
        const nodeB = this.snapshot.createNode();
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fieldAccessor1 = nodeA[comparator.fieldName1];
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fieldAccessor2 = nodeA[comparator.fieldName2];
        const ascending1 = comparator.ascending1 ? 1 : -1;
        const ascending2 = comparator.ascending2 ? 1 : -1;
        function sortByNodeField(fieldAccessor, ascending) {
            const valueA = fieldAccessor.call(nodeA);
            const valueB = fieldAccessor.call(nodeB);
            return valueA < valueB ? -ascending : (valueA > valueB ? ascending : 0);
        }
        function sortByComparator(indexA, indexB) {
            nodeA.nodeIndex = indexA;
            nodeB.nodeIndex = indexB;
            let result = sortByNodeField(fieldAccessor1, ascending1);
            if (result === 0) {
                result = sortByNodeField(fieldAccessor2, ascending2);
            }
            return result || indexA - indexB;
        }
        return sortByComparator;
    }
    sort(comparator, leftBound, rightBound, windowLeft, windowRight) {
        if (!this.iterationOrder) {
            throw new Error('Iteration order not defined');
        }
        Platform.ArrayUtilities.sortRange(this.iterationOrder, this.buildCompareFunction(comparator), leftBound, rightBound, windowLeft, windowRight);
    }
}
export class JSHeapSnapshot extends HeapSnapshot {
    constructor(profile, progress) {
        super(profile, progress);
        _JSHeapSnapshot_instances.add(this);
        _JSHeapSnapshot_statistics.set(this, void 0);
        this.nodeFlags = {
            // bit flags in 8-bit value
            canBeQueried: 1,
            detachedDOMTreeNode: 2,
            pageObject: 4, // The idea is to track separately the objects owned by the page and the objects owned by debugger.
        };
    }
    createNode(nodeIndex) {
        return new JSHeapSnapshotNode(this, nodeIndex === undefined ? -1 : nodeIndex);
    }
    createEdge(edgeIndex) {
        return new JSHeapSnapshotEdge(this, edgeIndex);
    }
    createRetainingEdge(retainerIndex) {
        return new JSHeapSnapshotRetainerEdge(this, retainerIndex);
    }
    containmentEdgesFilter() {
        return (edge) => !edge.isInvisible();
    }
    retainingEdgesFilter() {
        const containmentEdgesFilter = this.containmentEdgesFilter();
        function filter(edge) {
            return containmentEdgesFilter(edge) && !edge.node().isRoot() && !edge.isWeak();
        }
        return filter;
    }
    calculateFlags() {
        this.flags = new Uint8Array(this.nodeCount);
        this.markDetachedDOMTreeNodes();
        this.markQueriableHeapObjects();
        this.markPageOwnedNodes();
    }
    // Updates the shallow sizes for "owned" objects of types kArray or kHidden to
    // zero, and add their sizes to the "owner" object instead.
    calculateShallowSizes() {
        // If there are no user roots, then that means the snapshot was produced with
        // the "expose internals" option enabled. In that case, we should faithfully
        // represent the actual memory allocations rather than attempting to make the
        // output more understandable to web developers.
        if (!__classPrivateFieldGet(this, _JSHeapSnapshot_instances, "m", _JSHeapSnapshot_hasUserRoots).call(this)) {
            return;
        }
        const { nodeCount, nodes, nodeFieldCount, nodeSelfSizeOffset } = this;
        const kUnvisited = 0xffffffff;
        const kHasMultipleOwners = 0xfffffffe;
        if (nodeCount >= kHasMultipleOwners) {
            throw new Error('Too many nodes for calculateShallowSizes');
        }
        // For each node in order, `owners` will contain the index of the owning
        // node or one of the two values kUnvisited or kHasMultipleOwners. The
        // indexes in this array are NOT already multiplied by nodeFieldCount.
        const owners = new Uint32Array(nodeCount);
        // The worklist contains the indexes of nodes which should be visited during
        // the second loop below. The order of visiting doesn't matter. The indexes
        // in this array are NOT already multiplied by nodeFieldCount.
        const worklist = [];
        const node = this.createNode(0);
        for (let i = 0; i < nodeCount; ++i) {
            if (node.isHidden() || node.isArray() || (node.isNative() && node.rawName() === 'system / ExternalStringData')) {
                owners[i] = kUnvisited;
            }
            else {
                // The node owns itself.
                owners[i] = i;
                worklist.push(i);
            }
            node.nodeIndex = node.nextNodeIndex();
        }
        while (worklist.length !== 0) {
            const id = worklist.pop();
            const owner = owners[id];
            node.nodeIndex = id * nodeFieldCount;
            for (let iter = node.edges(); iter.hasNext(); iter.next()) {
                const edge = iter.edge;
                if (edge.isWeak()) {
                    continue;
                }
                const targetId = edge.nodeIndex() / nodeFieldCount;
                switch (owners[targetId]) {
                    case kUnvisited:
                        owners[targetId] = owner;
                        worklist.push(targetId);
                        break;
                    case targetId:
                    case owner:
                    case kHasMultipleOwners:
                        // There is no change necessary if the target is already marked as:
                        // * owned by itself,
                        // * owned by the owner of the current source node, or
                        // * owned by multiple nodes.
                        break;
                    default:
                        owners[targetId] = kHasMultipleOwners;
                        // It is possible that this node is already in the worklist
                        // somewhere, but visiting it an extra time is not harmful. The
                        // iteration is guaranteed to complete because each node can only be
                        // added twice to the worklist: once when changing from kUnvisited
                        // to a specific owner, and a second time when changing from that
                        // owner to kHasMultipleOwners.
                        worklist.push(targetId);
                        break;
                }
            }
        }
        for (let i = 0; i < nodeCount; ++i) {
            const ownerId = owners[i];
            switch (ownerId) {
                case kUnvisited:
                case kHasMultipleOwners:
                case i:
                    break;
                default: {
                    const ownedNodeIndex = i * nodeFieldCount;
                    const ownerNodeIndex = ownerId * nodeFieldCount;
                    node.nodeIndex = ownerNodeIndex;
                    if (node.isSynthetic() || node.isRoot()) {
                        // Adding shallow size to synthetic or root nodes is not useful.
                        break;
                    }
                    const sizeToTransfer = nodes.getValue(ownedNodeIndex + nodeSelfSizeOffset);
                    nodes.setValue(ownedNodeIndex + nodeSelfSizeOffset, 0);
                    nodes.setValue(ownerNodeIndex + nodeSelfSizeOffset, nodes.getValue(ownerNodeIndex + nodeSelfSizeOffset) + sizeToTransfer);
                    break;
                }
            }
        }
    }
    calculateDistances(isForRetainersView) {
        const pendingEphemeronEdges = new Set();
        const snapshot = this;
        function filter(node, edge) {
            if (node.isHidden() && edge.name() === 'sloppy_function_map' && node.rawName() === 'system / NativeContext') {
                return false;
            }
            if (node.isArray() && node.rawName() === '(map descriptors)') {
                // DescriptorArrays are fixed arrays used to hold instance descriptors.
                // The format of the these objects is:
                //   [0]: Number of descriptors
                //   [1]: Either Smi(0) if uninitialized, or a pointer to small fixed array:
                //          [0]: pointer to fixed array with enum cache
                //          [1]: either Smi(0) or pointer to fixed array with indices
                //   [i*3+2]: i-th key
                //   [i*3+3]: i-th type
                //   [i*3+4]: i-th descriptor
                // As long as maps may share descriptor arrays some of the descriptor
                // links may not be valid for all the maps. We just skip
                // all the descriptor links when calculating distances.
                // For more details see http://crbug.com/413608
                const index = parseInt(edge.name(), 10);
                return index < 2 || (index % 3) !== 1;
            }
            if (edge.isInternal()) {
                // Snapshots represent WeakMap values as being referenced by two edges:
                // one from the WeakMap, and a second from the corresponding key. To
                // avoid the case described in crbug.com/1290800, we should set the
                // distance of that value to the greater of (WeakMap+1, key+1). This
                // part of the filter skips the first edge in the matched pair of edges,
                // so that the distance gets set based on the second, which should be
                // greater or equal due to traversal order.
                const match = snapshot.tryParseWeakMapEdgeName(edge.nameIndex());
                if (match) {
                    if (!pendingEphemeronEdges.delete(match.duplicatedPart)) {
                        pendingEphemeronEdges.add(match.duplicatedPart);
                        return false;
                    }
                }
            }
            return true;
        }
        super.calculateDistances(isForRetainersView, filter);
    }
    isUserRoot(node) {
        return node.isUserRoot() || node.isDocumentDOMTreesRoot();
    }
    userObjectsMapAndFlag() {
        return { map: this.flags, flag: this.nodeFlags.pageObject };
    }
    flagsOfNode(node) {
        return this.flags[node.nodeIndex / this.nodeFieldCount];
    }
    markDetachedDOMTreeNodes() {
        const nodes = this.nodes;
        const nodesLength = nodes.length;
        const nodeFieldCount = this.nodeFieldCount;
        const nodeNativeType = this.nodeNativeType;
        const nodeTypeOffset = this.nodeTypeOffset;
        const flag = this.nodeFlags.detachedDOMTreeNode;
        const node = this.rootNode();
        for (let nodeIndex = 0, ordinal = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount, ordinal++) {
            const nodeType = nodes.getValue(nodeIndex + nodeTypeOffset);
            if (nodeType !== nodeNativeType) {
                continue;
            }
            node.nodeIndex = nodeIndex;
            if (node.name().startsWith('Detached ')) {
                this.flags[ordinal] |= flag;
            }
        }
    }
    markQueriableHeapObjects() {
        // Allow runtime properties query for objects accessible from Window objects
        // via regular properties, and for DOM wrappers. Trying to access random objects
        // can cause a crash due to inconsistent state of internal properties of wrappers.
        const flag = this.nodeFlags.canBeQueried;
        const hiddenEdgeType = this.edgeHiddenType;
        const internalEdgeType = this.edgeInternalType;
        const invisibleEdgeType = this.edgeInvisibleType;
        const weakEdgeType = this.edgeWeakType;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const edgeTypeOffset = this.edgeTypeOffset;
        const edgeFieldsCount = this.edgeFieldsCount;
        const containmentEdges = this.containmentEdges;
        const nodeFieldCount = this.nodeFieldCount;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const flags = this.flags;
        const list = [];
        for (let iter = this.rootNode().edges(); iter.hasNext(); iter.next()) {
            if (iter.edge.node().isUserRoot()) {
                list.push(iter.edge.node().nodeIndex / nodeFieldCount);
            }
        }
        while (list.length) {
            const nodeOrdinal = list.pop();
            if (flags[nodeOrdinal] & flag) {
                continue;
            }
            flags[nodeOrdinal] |= flag;
            const beginEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            const endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            for (let edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
                const childNodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
                const childNodeOrdinal = childNodeIndex / nodeFieldCount;
                if (flags[childNodeOrdinal] & flag) {
                    continue;
                }
                const type = containmentEdges.getValue(edgeIndex + edgeTypeOffset);
                if (type === hiddenEdgeType || type === invisibleEdgeType || type === internalEdgeType ||
                    type === weakEdgeType) {
                    continue;
                }
                list.push(childNodeOrdinal);
            }
        }
    }
    markPageOwnedNodes() {
        const edgeShortcutType = this.edgeShortcutType;
        const edgeElementType = this.edgeElementType;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const edgeTypeOffset = this.edgeTypeOffset;
        const edgeFieldsCount = this.edgeFieldsCount;
        const edgeWeakType = this.edgeWeakType;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const containmentEdges = this.containmentEdges;
        const nodeFieldCount = this.nodeFieldCount;
        const nodesCount = this.nodeCount;
        const flags = this.flags;
        const pageObjectFlag = this.nodeFlags.pageObject;
        const nodesToVisit = new Uint32Array(nodesCount);
        let nodesToVisitLength = 0;
        const rootNodeOrdinal = this.rootNodeIndexInternal / nodeFieldCount;
        const node = this.rootNode();
        // Populate the entry points. They are Window objects and DOM Tree Roots.
        for (let edgeIndex = firstEdgeIndexes[rootNodeOrdinal], endEdgeIndex = firstEdgeIndexes[rootNodeOrdinal + 1]; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
            const edgeType = containmentEdges.getValue(edgeIndex + edgeTypeOffset);
            const nodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
            if (edgeType === edgeElementType) {
                node.nodeIndex = nodeIndex;
                if (!node.isDocumentDOMTreesRoot()) {
                    continue;
                }
            }
            else if (edgeType !== edgeShortcutType) {
                continue;
            }
            const nodeOrdinal = nodeIndex / nodeFieldCount;
            nodesToVisit[nodesToVisitLength++] = nodeOrdinal;
            flags[nodeOrdinal] |= pageObjectFlag;
        }
        // Mark everything reachable with the pageObject flag.
        while (nodesToVisitLength) {
            const nodeOrdinal = nodesToVisit[--nodesToVisitLength];
            const beginEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            const endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            for (let edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
                const childNodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
                const childNodeOrdinal = childNodeIndex / nodeFieldCount;
                if (flags[childNodeOrdinal] & pageObjectFlag) {
                    continue;
                }
                const type = containmentEdges.getValue(edgeIndex + edgeTypeOffset);
                if (type === edgeWeakType) {
                    continue;
                }
                nodesToVisit[nodesToVisitLength++] = childNodeOrdinal;
                flags[childNodeOrdinal] |= pageObjectFlag;
            }
        }
    }
    calculateStatistics() {
        const nodeFieldCount = this.nodeFieldCount;
        const nodes = this.nodes;
        const nodesLength = nodes.length;
        const nodeTypeOffset = this.nodeTypeOffset;
        const nodeSizeOffset = this.nodeSelfSizeOffset;
        const nodeNativeType = this.nodeNativeType;
        const nodeCodeType = this.nodeCodeType;
        const nodeConsStringType = this.nodeConsStringType;
        const nodeSlicedStringType = this.nodeSlicedStringType;
        const nodeHiddenType = this.nodeHiddenType;
        const nodeStringType = this.nodeStringType;
        let sizeNative = this.profile.snapshot.extra_native_bytes ?? 0;
        let sizeTypedArrays = 0;
        let sizeCode = 0;
        let sizeStrings = 0;
        let sizeJSArrays = 0;
        let sizeSystem = 0;
        const node = this.rootNode();
        for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            const nodeSize = nodes.getValue(nodeIndex + nodeSizeOffset);
            const nodeType = nodes.getValue(nodeIndex + nodeTypeOffset);
            if (nodeType === nodeHiddenType) {
                sizeSystem += nodeSize;
                continue;
            }
            node.nodeIndex = nodeIndex;
            if (nodeType === nodeNativeType) {
                sizeNative += nodeSize;
                if (node.rawName() === 'system / JSArrayBufferData') {
                    sizeTypedArrays += nodeSize;
                }
            }
            else if (nodeType === nodeCodeType) {
                sizeCode += nodeSize;
            }
            else if (nodeType === nodeConsStringType || nodeType === nodeSlicedStringType || nodeType === nodeStringType) {
                sizeStrings += nodeSize;
            }
            else if (node.rawName() === 'Array') {
                sizeJSArrays += this.calculateArraySize(node);
            }
        }
        __classPrivateFieldSet(this, _JSHeapSnapshot_statistics, {
            total: this.totalSize,
            native: {
                total: sizeNative,
                typedArrays: sizeTypedArrays,
            },
            v8heap: {
                total: this.totalSize - sizeNative,
                code: sizeCode,
                jsArrays: sizeJSArrays,
                strings: sizeStrings,
                system: sizeSystem,
            }
        }, "f");
    }
    calculateArraySize(node) {
        let size = node.selfSize();
        const beginEdgeIndex = node.edgeIndexesStart();
        const endEdgeIndex = node.edgeIndexesEnd();
        const containmentEdges = this.containmentEdges;
        const strings = this.strings;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const edgeTypeOffset = this.edgeTypeOffset;
        const edgeNameOffset = this.edgeNameOffset;
        const edgeFieldsCount = this.edgeFieldsCount;
        const edgeInternalType = this.edgeInternalType;
        for (let edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
            const edgeType = containmentEdges.getValue(edgeIndex + edgeTypeOffset);
            if (edgeType !== edgeInternalType) {
                continue;
            }
            const edgeName = strings[containmentEdges.getValue(edgeIndex + edgeNameOffset)];
            if (edgeName !== 'elements') {
                continue;
            }
            const elementsNodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
            node.nodeIndex = elementsNodeIndex;
            if (node.retainersCount() === 1) {
                size += node.selfSize();
            }
            break;
        }
        return size;
    }
    getStatistics() {
        return __classPrivateFieldGet(this, _JSHeapSnapshot_statistics, "f");
    }
}
_JSHeapSnapshot_statistics = new WeakMap(), _JSHeapSnapshot_instances = new WeakSet(), _JSHeapSnapshot_hasUserRoots = function _JSHeapSnapshot_hasUserRoots() {
    for (let iter = this.rootNode().edges(); iter.hasNext(); iter.next()) {
        if (this.isUserRoot(iter.edge.node())) {
            return true;
        }
    }
    return false;
};
// Creates and initializes a JSHeapSnapshot using only one thread.
export async function createJSHeapSnapshotForTesting(profile) {
    const result = new JSHeapSnapshot(profile, new HeapSnapshotProgress());
    const channel = new MessageChannel();
    new SecondaryInitManager(channel.port2);
    await result.initialize(channel.port1);
    return result;
}
export class JSHeapSnapshotNode extends HeapSnapshotNode {
    constructor() {
        super(...arguments);
        _JSHeapSnapshotNode_instances.add(this);
    }
    canBeQueried() {
        const snapshot = this.snapshot;
        const flags = snapshot.flagsOfNode(this);
        return Boolean(flags & snapshot.nodeFlags.canBeQueried);
    }
    name() {
        const snapshot = this.snapshot;
        if (this.rawType() === snapshot.nodeConsStringType) {
            return this.consStringName();
        }
        if (this.rawType() === snapshot.nodeObjectType && this.rawName() === 'Object') {
            return __classPrivateFieldGet(this, _JSHeapSnapshotNode_instances, "m", _JSHeapSnapshotNode_plainObjectName).call(this);
        }
        return this.rawName();
    }
    consStringName() {
        const snapshot = this.snapshot;
        const consStringType = snapshot.nodeConsStringType;
        const edgeInternalType = snapshot.edgeInternalType;
        const edgeFieldsCount = snapshot.edgeFieldsCount;
        const edgeToNodeOffset = snapshot.edgeToNodeOffset;
        const edgeTypeOffset = snapshot.edgeTypeOffset;
        const edgeNameOffset = snapshot.edgeNameOffset;
        const strings = snapshot.strings;
        const edges = snapshot.containmentEdges;
        const firstEdgeIndexes = snapshot.firstEdgeIndexes;
        const nodeFieldCount = snapshot.nodeFieldCount;
        const nodeTypeOffset = snapshot.nodeTypeOffset;
        const nodeNameOffset = snapshot.nodeNameOffset;
        const nodes = snapshot.nodes;
        const nodesStack = [];
        nodesStack.push(this.nodeIndex);
        let name = '';
        while (nodesStack.length && name.length < 1024) {
            const nodeIndex = nodesStack.pop();
            if (nodes.getValue(nodeIndex + nodeTypeOffset) !== consStringType) {
                name += strings[nodes.getValue(nodeIndex + nodeNameOffset)];
                continue;
            }
            const nodeOrdinal = nodeIndex / nodeFieldCount;
            const beginEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            const endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            let firstNodeIndex = 0;
            let secondNodeIndex = 0;
            for (let edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex && (!firstNodeIndex || !secondNodeIndex); edgeIndex += edgeFieldsCount) {
                const edgeType = edges.getValue(edgeIndex + edgeTypeOffset);
                if (edgeType === edgeInternalType) {
                    const edgeName = strings[edges.getValue(edgeIndex + edgeNameOffset)];
                    if (edgeName === 'first') {
                        firstNodeIndex = edges.getValue(edgeIndex + edgeToNodeOffset);
                    }
                    else if (edgeName === 'second') {
                        secondNodeIndex = edges.getValue(edgeIndex + edgeToNodeOffset);
                    }
                }
            }
            nodesStack.push(secondNodeIndex);
            nodesStack.push(firstNodeIndex);
        }
        return name;
    }
    static formatPropertyName(name) {
        // We don't need a strict test for whether a property name follows the
        // rules for being a JS identifier, but property names containing commas,
        // quotation marks, or braces could cause confusion, so we'll escape those.
        if (/[,'"{}]/.test(name)) {
            name = JSON.stringify({ [name]: 0 });
            name = name.substring(1, name.length - 3);
        }
        return name;
    }
    id() {
        const snapshot = this.snapshot;
        return snapshot.nodes.getValue(this.nodeIndex + snapshot.nodeIdOffset);
    }
    isHidden() {
        return this.rawType() === this.snapshot.nodeHiddenType;
    }
    isArray() {
        return this.rawType() === this.snapshot.nodeArrayType;
    }
    isSynthetic() {
        return this.rawType() === this.snapshot.nodeSyntheticType;
    }
    isNative() {
        return this.rawType() === this.snapshot.nodeNativeType;
    }
    isUserRoot() {
        return !this.isSynthetic();
    }
    isDocumentDOMTreesRoot() {
        return this.isSynthetic() && this.rawName() === '(Document DOM trees)';
    }
    serialize() {
        const result = super.serialize();
        const snapshot = this.snapshot;
        const flags = snapshot.flagsOfNode(this);
        if (flags & snapshot.nodeFlags.canBeQueried) {
            result.canBeQueried = true;
        }
        if (flags & snapshot.nodeFlags.detachedDOMTreeNode) {
            result.detachedDOMTreeNode = true;
        }
        return result;
    }
}
_a = JSHeapSnapshotNode, _JSHeapSnapshotNode_instances = new WeakSet(), _JSHeapSnapshotNode_plainObjectName = function _JSHeapSnapshotNode_plainObjectName() {
    const snapshot = this.snapshot;
    const { edgeFieldsCount, edgePropertyType } = snapshot;
    const edge = snapshot.createEdge(0);
    let categoryNameStart = '{';
    let categoryNameEnd = '}';
    let edgeIndexFromStart = this.edgeIndexesStart();
    let edgeIndexFromEnd = this.edgeIndexesEnd() - edgeFieldsCount;
    let nextFromEnd = false;
    while (edgeIndexFromStart <= edgeIndexFromEnd) {
        edge.edgeIndex = nextFromEnd ? edgeIndexFromEnd : edgeIndexFromStart;
        // Skip non-property edges and the special __proto__ property.
        if (edge.rawType() !== edgePropertyType || edge.name() === '__proto__') {
            if (nextFromEnd) {
                edgeIndexFromEnd -= edgeFieldsCount;
            }
            else {
                edgeIndexFromStart += edgeFieldsCount;
            }
            continue;
        }
        const formatted = _a.formatPropertyName(edge.name());
        // Always include at least one property, regardless of its length. Beyond that point,
        // only include more properties if the name isn't too long.
        if (categoryNameStart.length > 1 && categoryNameStart.length + categoryNameEnd.length + formatted.length > 100) {
            break;
        }
        if (nextFromEnd) {
            edgeIndexFromEnd -= edgeFieldsCount;
            if (categoryNameEnd.length > 1) {
                categoryNameEnd = ', ' + categoryNameEnd;
            }
            categoryNameEnd = formatted + categoryNameEnd;
        }
        else {
            edgeIndexFromStart += edgeFieldsCount;
            if (categoryNameStart.length > 1) {
                categoryNameStart += ', ';
            }
            categoryNameStart += formatted;
        }
        nextFromEnd = !nextFromEnd;
    }
    if (edgeIndexFromStart <= edgeIndexFromEnd) {
        categoryNameStart += ', …';
    }
    if (categoryNameEnd.length > 1) {
        categoryNameStart += ', ';
    }
    return categoryNameStart + categoryNameEnd;
};
export class JSHeapSnapshotEdge extends HeapSnapshotEdge {
    clone() {
        const snapshot = this.snapshot;
        return new JSHeapSnapshotEdge(snapshot, this.edgeIndex);
    }
    hasStringName() {
        if (!this.isShortcut()) {
            return this.hasStringNameInternal();
        }
        // @ts-expect-error parseInt is successful against numbers.
        return isNaN(parseInt(this.nameInternal(), 10));
    }
    isElement() {
        return this.rawType() === this.snapshot.edgeElementType;
    }
    isHidden() {
        return this.rawType() === this.snapshot.edgeHiddenType;
    }
    isWeak() {
        return this.rawType() === this.snapshot.edgeWeakType;
    }
    isInternal() {
        return this.rawType() === this.snapshot.edgeInternalType;
    }
    isInvisible() {
        return this.rawType() === this.snapshot.edgeInvisibleType;
    }
    isShortcut() {
        return this.rawType() === this.snapshot.edgeShortcutType;
    }
    name() {
        const name = this.nameInternal();
        if (!this.isShortcut()) {
            return String(name);
        }
        // @ts-expect-error parseInt is successful against numbers.
        const numName = parseInt(name, 10);
        return String(isNaN(numName) ? name : numName);
    }
    toString() {
        const name = this.name();
        switch (this.type()) {
            case 'context':
                return '->' + name;
            case 'element':
                return '[' + name + ']';
            case 'weak':
                return '[[' + name + ']]';
            case 'property':
                return name.indexOf(' ') === -1 ? '.' + name : '["' + name + '"]';
            case 'shortcut':
                if (typeof name === 'string') {
                    return name.indexOf(' ') === -1 ? '.' + name : '["' + name + '"]';
                }
                return '[' + name + ']';
            case 'internal':
            case 'hidden':
            case 'invisible':
                return '{' + name + '}';
        }
        return '?' + name + '?';
    }
    hasStringNameInternal() {
        const type = this.rawType();
        const snapshot = this.snapshot;
        return type !== snapshot.edgeElementType && type !== snapshot.edgeHiddenType;
    }
    nameInternal() {
        return this.hasStringNameInternal() ? this.snapshot.strings[this.nameOrIndex()] : this.nameOrIndex();
    }
    nameOrIndex() {
        return this.edges.getValue(this.edgeIndex + this.snapshot.edgeNameOffset);
    }
    rawType() {
        return this.edges.getValue(this.edgeIndex + this.snapshot.edgeTypeOffset);
    }
    nameIndex() {
        if (!this.hasStringNameInternal()) {
            throw new Error('Edge does not have string name');
        }
        return this.nameOrIndex();
    }
}
export class JSHeapSnapshotRetainerEdge extends HeapSnapshotRetainerEdge {
    clone() {
        const snapshot = this.snapshot;
        return new JSHeapSnapshotRetainerEdge(snapshot, this.retainerIndex());
    }
    isHidden() {
        return this.edge().isHidden();
    }
    isInvisible() {
        return this.edge().isInvisible();
    }
    isShortcut() {
        return this.edge().isShortcut();
    }
    isWeak() {
        return this.edge().isWeak();
    }
}
//# sourceMappingURL=HeapSnapshot.js.map