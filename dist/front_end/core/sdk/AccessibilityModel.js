// Copyright (c) 2014 The Chromium Authors. All rights reserved.
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
var _AccessibilityNode_accessibilityModelInternal, _AccessibilityNode_idInternal, _AccessibilityNode_backendDOMNodeIdInternal, _AccessibilityNode_deferredDOMNodeInternal, _AccessibilityNode_ignoredInternal, _AccessibilityNode_ignoredReasonsInternal, _AccessibilityNode_roleInternal, _AccessibilityNode_nameInternal, _AccessibilityNode_descriptionInternal, _AccessibilityNode_valueInternal, _AccessibilityNode_propertiesInternal, _AccessibilityNode_parentId, _AccessibilityNode_frameId, _AccessibilityNode_childIds, _AccessibilityModel_axIdToAXNode, _AccessibilityModel_backendDOMNodeIdToAXNode, _AccessibilityModel_frameIdToAXNode, _AccessibilityModel_pendingChildRequests, _AccessibilityModel_root;
import { DeferredDOMNode } from './DOMModel.js';
import { SDKModel } from './SDKModel.js';
export var CoreAxPropertyName;
(function (CoreAxPropertyName) {
    CoreAxPropertyName["NAME"] = "name";
    CoreAxPropertyName["DESCRIPTION"] = "description";
    CoreAxPropertyName["VALUE"] = "value";
    CoreAxPropertyName["ROLE"] = "role";
})(CoreAxPropertyName || (CoreAxPropertyName = {}));
export class AccessibilityNode {
    constructor(accessibilityModel, payload) {
        _AccessibilityNode_accessibilityModelInternal.set(this, void 0);
        _AccessibilityNode_idInternal.set(this, void 0);
        _AccessibilityNode_backendDOMNodeIdInternal.set(this, void 0);
        _AccessibilityNode_deferredDOMNodeInternal.set(this, void 0);
        _AccessibilityNode_ignoredInternal.set(this, void 0);
        _AccessibilityNode_ignoredReasonsInternal.set(this, void 0);
        _AccessibilityNode_roleInternal.set(this, void 0);
        _AccessibilityNode_nameInternal.set(this, void 0);
        _AccessibilityNode_descriptionInternal.set(this, void 0);
        _AccessibilityNode_valueInternal.set(this, void 0);
        _AccessibilityNode_propertiesInternal.set(this, void 0);
        _AccessibilityNode_parentId.set(this, void 0);
        _AccessibilityNode_frameId.set(this, void 0);
        _AccessibilityNode_childIds.set(this, void 0);
        __classPrivateFieldSet(this, _AccessibilityNode_accessibilityModelInternal, accessibilityModel, "f");
        __classPrivateFieldSet(this, _AccessibilityNode_idInternal, payload.nodeId, "f");
        accessibilityModel.setAXNodeForAXId(__classPrivateFieldGet(this, _AccessibilityNode_idInternal, "f"), this);
        if (payload.backendDOMNodeId) {
            accessibilityModel.setAXNodeForBackendDOMNodeId(payload.backendDOMNodeId, this);
            __classPrivateFieldSet(this, _AccessibilityNode_backendDOMNodeIdInternal, payload.backendDOMNodeId, "f");
            __classPrivateFieldSet(this, _AccessibilityNode_deferredDOMNodeInternal, new DeferredDOMNode(accessibilityModel.target(), payload.backendDOMNodeId), "f");
        }
        else {
            __classPrivateFieldSet(this, _AccessibilityNode_backendDOMNodeIdInternal, null, "f");
            __classPrivateFieldSet(this, _AccessibilityNode_deferredDOMNodeInternal, null, "f");
        }
        __classPrivateFieldSet(this, _AccessibilityNode_ignoredInternal, payload.ignored, "f");
        if (__classPrivateFieldGet(this, _AccessibilityNode_ignoredInternal, "f") && 'ignoredReasons' in payload) {
            __classPrivateFieldSet(this, _AccessibilityNode_ignoredReasonsInternal, payload.ignoredReasons, "f");
        }
        __classPrivateFieldSet(this, _AccessibilityNode_roleInternal, payload.role || null, "f");
        __classPrivateFieldSet(this, _AccessibilityNode_nameInternal, payload.name || null, "f");
        __classPrivateFieldSet(this, _AccessibilityNode_descriptionInternal, payload.description || null, "f");
        __classPrivateFieldSet(this, _AccessibilityNode_valueInternal, payload.value || null, "f");
        __classPrivateFieldSet(this, _AccessibilityNode_propertiesInternal, payload.properties || null, "f");
        __classPrivateFieldSet(this, _AccessibilityNode_childIds, [...new Set(payload.childIds)], "f");
        __classPrivateFieldSet(this, _AccessibilityNode_parentId, payload.parentId || null, "f");
        if (payload.frameId && !payload.parentId) {
            __classPrivateFieldSet(this, _AccessibilityNode_frameId, payload.frameId, "f");
            accessibilityModel.setRootAXNodeForFrameId(payload.frameId, this);
        }
        else {
            __classPrivateFieldSet(this, _AccessibilityNode_frameId, null, "f");
        }
    }
    id() {
        return __classPrivateFieldGet(this, _AccessibilityNode_idInternal, "f");
    }
    accessibilityModel() {
        return __classPrivateFieldGet(this, _AccessibilityNode_accessibilityModelInternal, "f");
    }
    ignored() {
        return __classPrivateFieldGet(this, _AccessibilityNode_ignoredInternal, "f");
    }
    ignoredReasons() {
        return __classPrivateFieldGet(this, _AccessibilityNode_ignoredReasonsInternal, "f") || null;
    }
    role() {
        return __classPrivateFieldGet(this, _AccessibilityNode_roleInternal, "f") || null;
    }
    coreProperties() {
        const properties = [];
        if (__classPrivateFieldGet(this, _AccessibilityNode_nameInternal, "f")) {
            properties.push({ name: "name" /* CoreAxPropertyName.NAME */, value: __classPrivateFieldGet(this, _AccessibilityNode_nameInternal, "f") });
        }
        if (__classPrivateFieldGet(this, _AccessibilityNode_descriptionInternal, "f")) {
            properties.push({ name: "description" /* CoreAxPropertyName.DESCRIPTION */, value: __classPrivateFieldGet(this, _AccessibilityNode_descriptionInternal, "f") });
        }
        if (__classPrivateFieldGet(this, _AccessibilityNode_valueInternal, "f")) {
            properties.push({ name: "value" /* CoreAxPropertyName.VALUE */, value: __classPrivateFieldGet(this, _AccessibilityNode_valueInternal, "f") });
        }
        return properties;
    }
    name() {
        return __classPrivateFieldGet(this, _AccessibilityNode_nameInternal, "f") || null;
    }
    description() {
        return __classPrivateFieldGet(this, _AccessibilityNode_descriptionInternal, "f") || null;
    }
    value() {
        return __classPrivateFieldGet(this, _AccessibilityNode_valueInternal, "f") || null;
    }
    properties() {
        return __classPrivateFieldGet(this, _AccessibilityNode_propertiesInternal, "f") || null;
    }
    parentNode() {
        if (__classPrivateFieldGet(this, _AccessibilityNode_parentId, "f")) {
            return __classPrivateFieldGet(this, _AccessibilityNode_accessibilityModelInternal, "f").axNodeForId(__classPrivateFieldGet(this, _AccessibilityNode_parentId, "f"));
        }
        return null;
    }
    isDOMNode() {
        return Boolean(__classPrivateFieldGet(this, _AccessibilityNode_backendDOMNodeIdInternal, "f"));
    }
    backendDOMNodeId() {
        return __classPrivateFieldGet(this, _AccessibilityNode_backendDOMNodeIdInternal, "f");
    }
    deferredDOMNode() {
        return __classPrivateFieldGet(this, _AccessibilityNode_deferredDOMNodeInternal, "f");
    }
    highlightDOMNode() {
        const deferredNode = this.deferredDOMNode();
        if (!deferredNode) {
            return;
        }
        // Highlight node in page.
        deferredNode.highlight();
    }
    children() {
        if (!__classPrivateFieldGet(this, _AccessibilityNode_childIds, "f")) {
            return [];
        }
        const children = [];
        for (const childId of __classPrivateFieldGet(this, _AccessibilityNode_childIds, "f")) {
            const child = __classPrivateFieldGet(this, _AccessibilityNode_accessibilityModelInternal, "f").axNodeForId(childId);
            if (child) {
                children.push(child);
            }
        }
        return children;
    }
    numChildren() {
        if (!__classPrivateFieldGet(this, _AccessibilityNode_childIds, "f")) {
            return 0;
        }
        return __classPrivateFieldGet(this, _AccessibilityNode_childIds, "f").length;
    }
    hasOnlyUnloadedChildren() {
        if (!__classPrivateFieldGet(this, _AccessibilityNode_childIds, "f") || !__classPrivateFieldGet(this, _AccessibilityNode_childIds, "f").length) {
            return false;
        }
        return __classPrivateFieldGet(this, _AccessibilityNode_childIds, "f").every(id => __classPrivateFieldGet(this, _AccessibilityNode_accessibilityModelInternal, "f").axNodeForId(id) === null);
    }
    hasUnloadedChildren() {
        if (!__classPrivateFieldGet(this, _AccessibilityNode_childIds, "f") || !__classPrivateFieldGet(this, _AccessibilityNode_childIds, "f").length) {
            return false;
        }
        return __classPrivateFieldGet(this, _AccessibilityNode_childIds, "f").some(id => __classPrivateFieldGet(this, _AccessibilityNode_accessibilityModelInternal, "f").axNodeForId(id) === null);
    }
    // Only the root node gets a frameId, so nodes have to walk up the tree to find their frameId.
    getFrameId() {
        return __classPrivateFieldGet(this, _AccessibilityNode_frameId, "f") || this.parentNode()?.getFrameId() || null;
    }
}
_AccessibilityNode_accessibilityModelInternal = new WeakMap(), _AccessibilityNode_idInternal = new WeakMap(), _AccessibilityNode_backendDOMNodeIdInternal = new WeakMap(), _AccessibilityNode_deferredDOMNodeInternal = new WeakMap(), _AccessibilityNode_ignoredInternal = new WeakMap(), _AccessibilityNode_ignoredReasonsInternal = new WeakMap(), _AccessibilityNode_roleInternal = new WeakMap(), _AccessibilityNode_nameInternal = new WeakMap(), _AccessibilityNode_descriptionInternal = new WeakMap(), _AccessibilityNode_valueInternal = new WeakMap(), _AccessibilityNode_propertiesInternal = new WeakMap(), _AccessibilityNode_parentId = new WeakMap(), _AccessibilityNode_frameId = new WeakMap(), _AccessibilityNode_childIds = new WeakMap();
export var Events;
(function (Events) {
    Events["TREE_UPDATED"] = "TreeUpdated";
})(Events || (Events = {}));
export class AccessibilityModel extends SDKModel {
    constructor(target) {
        super(target);
        _AccessibilityModel_axIdToAXNode.set(this, new Map());
        _AccessibilityModel_backendDOMNodeIdToAXNode.set(this, new Map());
        _AccessibilityModel_frameIdToAXNode.set(this, new Map());
        _AccessibilityModel_pendingChildRequests.set(this, new Map());
        _AccessibilityModel_root.set(this, null);
        target.registerAccessibilityDispatcher(this);
        this.agent = target.accessibilityAgent();
        void this.resumeModel();
    }
    clear() {
        __classPrivateFieldSet(this, _AccessibilityModel_root, null, "f");
        __classPrivateFieldGet(this, _AccessibilityModel_axIdToAXNode, "f").clear();
        __classPrivateFieldGet(this, _AccessibilityModel_backendDOMNodeIdToAXNode, "f").clear();
        __classPrivateFieldGet(this, _AccessibilityModel_frameIdToAXNode, "f").clear();
    }
    async resumeModel() {
        await this.agent.invoke_enable();
    }
    async suspendModel() {
        await this.agent.invoke_disable();
    }
    async requestPartialAXTree(node) {
        const { nodes } = await this.agent.invoke_getPartialAXTree({ nodeId: node.id, fetchRelatives: true });
        if (!nodes) {
            return;
        }
        const axNodes = [];
        for (const payload of nodes) {
            axNodes.push(new AccessibilityNode(this, payload));
        }
    }
    loadComplete({ root }) {
        this.clear();
        __classPrivateFieldSet(this, _AccessibilityModel_root, new AccessibilityNode(this, root), "f");
        this.dispatchEventToListeners("TreeUpdated" /* Events.TREE_UPDATED */, { root: __classPrivateFieldGet(this, _AccessibilityModel_root, "f") });
    }
    nodesUpdated({ nodes }) {
        this.createNodesFromPayload(nodes);
        this.dispatchEventToListeners("TreeUpdated" /* Events.TREE_UPDATED */, {});
        return;
    }
    createNodesFromPayload(payloadNodes) {
        const accessibilityNodes = payloadNodes.map(node => {
            const sdkNode = new AccessibilityNode(this, node);
            return sdkNode;
        });
        return accessibilityNodes;
    }
    async requestRootNode(frameId) {
        if (frameId && __classPrivateFieldGet(this, _AccessibilityModel_frameIdToAXNode, "f").has(frameId)) {
            return __classPrivateFieldGet(this, _AccessibilityModel_frameIdToAXNode, "f").get(frameId);
        }
        if (!frameId && __classPrivateFieldGet(this, _AccessibilityModel_root, "f")) {
            return __classPrivateFieldGet(this, _AccessibilityModel_root, "f");
        }
        const { node } = await this.agent.invoke_getRootAXNode({ frameId });
        if (!node) {
            return;
        }
        return this.createNodesFromPayload([node])[0];
    }
    async requestAXChildren(nodeId, frameId) {
        const parent = __classPrivateFieldGet(this, _AccessibilityModel_axIdToAXNode, "f").get(nodeId);
        if (!parent) {
            throw new Error('Cannot request children before parent');
        }
        if (!parent.hasUnloadedChildren()) {
            return parent.children();
        }
        const request = __classPrivateFieldGet(this, _AccessibilityModel_pendingChildRequests, "f").get(nodeId);
        if (request) {
            await request;
        }
        else {
            const request = this.agent.invoke_getChildAXNodes({ id: nodeId, frameId });
            __classPrivateFieldGet(this, _AccessibilityModel_pendingChildRequests, "f").set(nodeId, request);
            const result = await request;
            if (!result.getError()) {
                this.createNodesFromPayload(result.nodes);
                __classPrivateFieldGet(this, _AccessibilityModel_pendingChildRequests, "f").delete(nodeId);
            }
        }
        return parent.children();
    }
    async requestAndLoadSubTreeToNode(node) {
        // Node may have already been loaded, so don't bother requesting it again.
        const result = [];
        let ancestor = this.axNodeForDOMNode(node);
        while (ancestor) {
            result.push(ancestor);
            const parent = ancestor.parentNode();
            if (!parent) {
                return result;
            }
            ancestor = parent;
        }
        const { nodes } = await this.agent.invoke_getAXNodeAndAncestors({ backendNodeId: node.backendNodeId() });
        if (!nodes) {
            return null;
        }
        const ancestors = this.createNodesFromPayload(nodes);
        return ancestors;
    }
    axNodeForId(axId) {
        return __classPrivateFieldGet(this, _AccessibilityModel_axIdToAXNode, "f").get(axId) || null;
    }
    setRootAXNodeForFrameId(frameId, axNode) {
        __classPrivateFieldGet(this, _AccessibilityModel_frameIdToAXNode, "f").set(frameId, axNode);
    }
    setAXNodeForAXId(axId, axNode) {
        __classPrivateFieldGet(this, _AccessibilityModel_axIdToAXNode, "f").set(axId, axNode);
    }
    axNodeForDOMNode(domNode) {
        if (!domNode) {
            return null;
        }
        return __classPrivateFieldGet(this, _AccessibilityModel_backendDOMNodeIdToAXNode, "f").get(domNode.backendNodeId()) ?? null;
    }
    setAXNodeForBackendDOMNodeId(backendDOMNodeId, axNode) {
        __classPrivateFieldGet(this, _AccessibilityModel_backendDOMNodeIdToAXNode, "f").set(backendDOMNodeId, axNode);
    }
    getAgent() {
        return this.agent;
    }
}
_AccessibilityModel_axIdToAXNode = new WeakMap(), _AccessibilityModel_backendDOMNodeIdToAXNode = new WeakMap(), _AccessibilityModel_frameIdToAXNode = new WeakMap(), _AccessibilityModel_pendingChildRequests = new WeakMap(), _AccessibilityModel_root = new WeakMap();
SDKModel.register(AccessibilityModel, { capabilities: 2 /* Capability.DOM */, autostart: false });
//# sourceMappingURL=AccessibilityModel.js.map