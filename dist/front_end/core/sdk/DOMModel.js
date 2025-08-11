// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _DOMNode_domModelInternal, _DOMNode_agent, _DOMNode_isInShadowTreeInternal, _DOMNode_backendNodeIdInternal, _DOMNode_nodeTypeInternal, _DOMNode_nodeNameInternal, _DOMNode_localNameInternal, _DOMNode_pseudoTypeInternal, _DOMNode_pseudoIdentifier, _DOMNode_shadowRootTypeInternal, _DOMNode_frameOwnerFrameIdInternal, _DOMNode_xmlVersion, _DOMNode_isSVGNodeInternal, _DOMNode_isScrollableInternal, _DOMNode_creationStackTraceInternal, _DOMNode_pseudoElements, _DOMNode_distributedNodesInternal, _DOMNode_attributesInternal, _DOMNode_markers, _DOMNode_subtreeMarkerCount, _DOMNode_importedDocumentInternal, _DeferredDOMNode_domModelInternal, _DeferredDOMNode_backendNodeIdInternal, _DOMModel_document, _DOMModel_attributeLoadNodeIds, _DOMModel_lastMutationId, _DOMModel_pendingDocumentRequestPromise, _DOMModel_frameOwnerNode, _DOMModel_loadNodeAttributesTimeout, _DOMModel_searchId, _DOMDispatcher_domModel, _DOMModelUndoStack_stack, _DOMModelUndoStack_index, _DOMModelUndoStack_lastModelWithMinorChange;
import * as Common from '../common/common.js';
import * as Platform from '../platform/platform.js';
import * as Root from '../root/root.js';
import { CSSModel } from './CSSModel.js';
import { FrameManager } from './FrameManager.js';
import { OverlayModel } from './OverlayModel.js';
import { RemoteObject } from './RemoteObject.js';
import { ResourceTreeModel } from './ResourceTreeModel.js';
import { RuntimeModel } from './RuntimeModel.js';
import { SDKModel } from './SDKModel.js';
import { TargetManager } from './TargetManager.js';
export class DOMNode {
    constructor(domModel) {
        _DOMNode_domModelInternal.set(this, void 0);
        _DOMNode_agent.set(this, void 0);
        _DOMNode_isInShadowTreeInternal.set(this, void 0);
        this.index = undefined;
        _DOMNode_backendNodeIdInternal.set(this, void 0);
        _DOMNode_nodeTypeInternal.set(this, void 0);
        _DOMNode_nodeNameInternal.set(this, void 0);
        _DOMNode_localNameInternal.set(this, void 0);
        _DOMNode_pseudoTypeInternal.set(this, void 0);
        _DOMNode_pseudoIdentifier.set(this, void 0);
        _DOMNode_shadowRootTypeInternal.set(this, void 0);
        _DOMNode_frameOwnerFrameIdInternal.set(this, void 0);
        _DOMNode_xmlVersion.set(this, void 0);
        _DOMNode_isSVGNodeInternal.set(this, void 0);
        _DOMNode_isScrollableInternal.set(this, void 0);
        _DOMNode_creationStackTraceInternal.set(this, null);
        _DOMNode_pseudoElements.set(this, new Map());
        _DOMNode_distributedNodesInternal.set(this, []);
        this.assignedSlot = null;
        this.shadowRootsInternal = [];
        _DOMNode_attributesInternal.set(this, new Map());
        _DOMNode_markers.set(this, new Map());
        _DOMNode_subtreeMarkerCount.set(this, 0);
        this.childrenInternal = null;
        this.nextSibling = null;
        this.previousSibling = null;
        this.firstChild = null;
        this.lastChild = null;
        this.parentNode = null;
        _DOMNode_importedDocumentInternal.set(this, void 0);
        __classPrivateFieldSet(this, _DOMNode_domModelInternal, domModel, "f");
        __classPrivateFieldSet(this, _DOMNode_agent, __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").getAgent(), "f");
    }
    static create(domModel, doc, isInShadowTree, payload) {
        const node = new DOMNode(domModel);
        node.init(doc, isInShadowTree, payload);
        return node;
    }
    init(doc, isInShadowTree, payload) {
        __classPrivateFieldSet(this, _DOMNode_agent, __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").getAgent(), "f");
        this.ownerDocument = doc;
        __classPrivateFieldSet(this, _DOMNode_isInShadowTreeInternal, isInShadowTree, "f");
        this.id = payload.nodeId;
        __classPrivateFieldSet(this, _DOMNode_backendNodeIdInternal, payload.backendNodeId, "f");
        __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").registerNode(this);
        __classPrivateFieldSet(this, _DOMNode_nodeTypeInternal, payload.nodeType, "f");
        __classPrivateFieldSet(this, _DOMNode_nodeNameInternal, payload.nodeName, "f");
        __classPrivateFieldSet(this, _DOMNode_localNameInternal, payload.localName, "f");
        this.nodeValueInternal = payload.nodeValue;
        __classPrivateFieldSet(this, _DOMNode_pseudoTypeInternal, payload.pseudoType, "f");
        __classPrivateFieldSet(this, _DOMNode_pseudoIdentifier, payload.pseudoIdentifier, "f");
        __classPrivateFieldSet(this, _DOMNode_shadowRootTypeInternal, payload.shadowRootType, "f");
        __classPrivateFieldSet(this, _DOMNode_frameOwnerFrameIdInternal, payload.frameId || null, "f");
        __classPrivateFieldSet(this, _DOMNode_xmlVersion, payload.xmlVersion, "f");
        __classPrivateFieldSet(this, _DOMNode_isSVGNodeInternal, Boolean(payload.isSVG), "f");
        __classPrivateFieldSet(this, _DOMNode_isScrollableInternal, Boolean(payload.isScrollable), "f");
        if (payload.attributes) {
            this.setAttributesPayload(payload.attributes);
        }
        this.childNodeCountInternal = payload.childNodeCount || 0;
        if (payload.shadowRoots) {
            for (let i = 0; i < payload.shadowRoots.length; ++i) {
                const root = payload.shadowRoots[i];
                const node = DOMNode.create(__classPrivateFieldGet(this, _DOMNode_domModelInternal, "f"), this.ownerDocument, true, root);
                this.shadowRootsInternal.push(node);
                node.parentNode = this;
            }
        }
        if (payload.templateContent) {
            this.templateContentInternal =
                DOMNode.create(__classPrivateFieldGet(this, _DOMNode_domModelInternal, "f"), this.ownerDocument, true, payload.templateContent);
            this.templateContentInternal.parentNode = this;
            this.childrenInternal = [];
        }
        const frameOwnerTags = new Set(['EMBED', 'IFRAME', 'OBJECT', 'FENCEDFRAME']);
        if (payload.contentDocument) {
            this.contentDocumentInternal = new DOMDocument(__classPrivateFieldGet(this, _DOMNode_domModelInternal, "f"), payload.contentDocument);
            this.contentDocumentInternal.parentNode = this;
            this.childrenInternal = [];
        }
        else if (payload.frameId && frameOwnerTags.has(payload.nodeName)) {
            // At this point we know we are in an OOPIF, otherwise `payload.contentDocument` would have been set.
            this.childDocumentPromiseForTesting = this.requestChildDocument(payload.frameId, __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").target());
            this.childrenInternal = [];
        }
        if (payload.importedDocument) {
            __classPrivateFieldSet(this, _DOMNode_importedDocumentInternal, DOMNode.create(__classPrivateFieldGet(this, _DOMNode_domModelInternal, "f"), this.ownerDocument, true, payload.importedDocument), "f");
            __classPrivateFieldGet(this, _DOMNode_importedDocumentInternal, "f").parentNode = this;
            this.childrenInternal = [];
        }
        if (payload.distributedNodes) {
            this.setDistributedNodePayloads(payload.distributedNodes);
        }
        if (payload.assignedSlot) {
            this.setAssignedSlot(payload.assignedSlot);
        }
        if (payload.children) {
            this.setChildrenPayload(payload.children);
        }
        this.setPseudoElements(payload.pseudoElements);
        if (__classPrivateFieldGet(this, _DOMNode_nodeTypeInternal, "f") === Node.ELEMENT_NODE) {
            // HTML and BODY from internal iframes should not overwrite top-level ones.
            if (this.ownerDocument && !this.ownerDocument.documentElement && __classPrivateFieldGet(this, _DOMNode_nodeNameInternal, "f") === 'HTML') {
                this.ownerDocument.documentElement = this;
            }
            if (this.ownerDocument && !this.ownerDocument.body && __classPrivateFieldGet(this, _DOMNode_nodeNameInternal, "f") === 'BODY') {
                this.ownerDocument.body = this;
            }
        }
        else if (__classPrivateFieldGet(this, _DOMNode_nodeTypeInternal, "f") === Node.DOCUMENT_TYPE_NODE) {
            this.publicId = payload.publicId;
            this.systemId = payload.systemId;
            this.internalSubset = payload.internalSubset;
        }
        else if (__classPrivateFieldGet(this, _DOMNode_nodeTypeInternal, "f") === Node.ATTRIBUTE_NODE) {
            this.name = payload.name;
            this.value = payload.value;
        }
    }
    async requestChildDocument(frameId, notInTarget) {
        const frame = await FrameManager.instance().getOrWaitForFrame(frameId, notInTarget);
        const childModel = frame.resourceTreeModel()?.target().model(DOMModel);
        return await (childModel?.requestDocument() || null);
    }
    isAdFrameNode() {
        if (this.isIframe() && __classPrivateFieldGet(this, _DOMNode_frameOwnerFrameIdInternal, "f")) {
            const frame = FrameManager.instance().getFrame(__classPrivateFieldGet(this, _DOMNode_frameOwnerFrameIdInternal, "f"));
            if (!frame) {
                return false;
            }
            return frame.adFrameType() !== "none" /* Protocol.Page.AdFrameType.None */;
        }
        return false;
    }
    isSVGNode() {
        return __classPrivateFieldGet(this, _DOMNode_isSVGNodeInternal, "f");
    }
    isScrollable() {
        return __classPrivateFieldGet(this, _DOMNode_isScrollableInternal, "f");
    }
    isMediaNode() {
        return __classPrivateFieldGet(this, _DOMNode_nodeNameInternal, "f") === 'AUDIO' || __classPrivateFieldGet(this, _DOMNode_nodeNameInternal, "f") === 'VIDEO';
    }
    isViewTransitionPseudoNode() {
        if (!__classPrivateFieldGet(this, _DOMNode_pseudoTypeInternal, "f")) {
            return false;
        }
        return [
            "view-transition" /* Protocol.DOM.PseudoType.ViewTransition */,
            "view-transition-group" /* Protocol.DOM.PseudoType.ViewTransitionGroup */,
            "view-transition-group-children" /* Protocol.DOM.PseudoType.ViewTransitionGroupChildren */,
            "view-transition-image-pair" /* Protocol.DOM.PseudoType.ViewTransitionImagePair */,
            "view-transition-old" /* Protocol.DOM.PseudoType.ViewTransitionOld */,
            "view-transition-new" /* Protocol.DOM.PseudoType.ViewTransitionNew */,
        ].includes(__classPrivateFieldGet(this, _DOMNode_pseudoTypeInternal, "f"));
    }
    creationStackTrace() {
        if (__classPrivateFieldGet(this, _DOMNode_creationStackTraceInternal, "f")) {
            return __classPrivateFieldGet(this, _DOMNode_creationStackTraceInternal, "f");
        }
        const stackTracesPromise = __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_getNodeStackTraces({ nodeId: this.id });
        __classPrivateFieldSet(this, _DOMNode_creationStackTraceInternal, stackTracesPromise.then(res => res.creation || null), "f");
        return __classPrivateFieldGet(this, _DOMNode_creationStackTraceInternal, "f");
    }
    get subtreeMarkerCount() {
        return __classPrivateFieldGet(this, _DOMNode_subtreeMarkerCount, "f");
    }
    domModel() {
        return __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f");
    }
    backendNodeId() {
        return __classPrivateFieldGet(this, _DOMNode_backendNodeIdInternal, "f");
    }
    children() {
        return this.childrenInternal ? this.childrenInternal.slice() : null;
    }
    setChildren(children) {
        this.childrenInternal = children;
    }
    setIsScrollable(isScrollable) {
        __classPrivateFieldSet(this, _DOMNode_isScrollableInternal, isScrollable, "f");
    }
    hasAttributes() {
        return __classPrivateFieldGet(this, _DOMNode_attributesInternal, "f").size > 0;
    }
    childNodeCount() {
        return this.childNodeCountInternal;
    }
    setChildNodeCount(childNodeCount) {
        this.childNodeCountInternal = childNodeCount;
    }
    shadowRoots() {
        return this.shadowRootsInternal.slice();
    }
    templateContent() {
        return this.templateContentInternal || null;
    }
    contentDocument() {
        return this.contentDocumentInternal || null;
    }
    setContentDocument(node) {
        this.contentDocumentInternal = node;
    }
    isIframe() {
        return __classPrivateFieldGet(this, _DOMNode_nodeNameInternal, "f") === 'IFRAME';
    }
    importedDocument() {
        return __classPrivateFieldGet(this, _DOMNode_importedDocumentInternal, "f") || null;
    }
    nodeType() {
        return __classPrivateFieldGet(this, _DOMNode_nodeTypeInternal, "f");
    }
    nodeName() {
        return __classPrivateFieldGet(this, _DOMNode_nodeNameInternal, "f");
    }
    pseudoType() {
        return __classPrivateFieldGet(this, _DOMNode_pseudoTypeInternal, "f");
    }
    pseudoIdentifier() {
        return __classPrivateFieldGet(this, _DOMNode_pseudoIdentifier, "f");
    }
    hasPseudoElements() {
        return __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").size > 0;
    }
    pseudoElements() {
        return __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f");
    }
    checkmarkPseudoElement() {
        return __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("checkmark" /* Protocol.DOM.PseudoType.Checkmark */)?.at(-1);
    }
    beforePseudoElement() {
        return __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("before" /* Protocol.DOM.PseudoType.Before */)?.at(-1);
    }
    afterPseudoElement() {
        return __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("after" /* Protocol.DOM.PseudoType.After */)?.at(-1);
    }
    pickerIconPseudoElement() {
        return __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("picker-icon" /* Protocol.DOM.PseudoType.PickerIcon */)?.at(-1);
    }
    markerPseudoElement() {
        return __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("marker" /* Protocol.DOM.PseudoType.Marker */)?.at(-1);
    }
    backdropPseudoElement() {
        return __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("backdrop" /* Protocol.DOM.PseudoType.Backdrop */)?.at(-1);
    }
    viewTransitionPseudoElements() {
        return [
            ...__classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("view-transition" /* Protocol.DOM.PseudoType.ViewTransition */) || [],
            ...__classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("view-transition-group" /* Protocol.DOM.PseudoType.ViewTransitionGroup */) || [],
            ...__classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("view-transition-group-children" /* Protocol.DOM.PseudoType.ViewTransitionGroupChildren */) || [],
            ...__classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("view-transition-image-pair" /* Protocol.DOM.PseudoType.ViewTransitionImagePair */) || [],
            ...__classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("view-transition-old" /* Protocol.DOM.PseudoType.ViewTransitionOld */) || [],
            ...__classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("view-transition-new" /* Protocol.DOM.PseudoType.ViewTransitionNew */) || [],
        ];
    }
    carouselPseudoElements() {
        return [
            ...__classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("scroll-button" /* Protocol.DOM.PseudoType.ScrollButton */) || [],
            ...__classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("column" /* Protocol.DOM.PseudoType.Column */) || [],
            ...__classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("scroll-marker" /* Protocol.DOM.PseudoType.ScrollMarker */) || [],
            ...__classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get("scroll-marker-group" /* Protocol.DOM.PseudoType.ScrollMarkerGroup */) || [],
        ];
    }
    hasAssignedSlot() {
        return this.assignedSlot !== null;
    }
    isInsertionPoint() {
        return !this.isXMLNode() &&
            (__classPrivateFieldGet(this, _DOMNode_nodeNameInternal, "f") === 'SHADOW' || __classPrivateFieldGet(this, _DOMNode_nodeNameInternal, "f") === 'CONTENT' ||
                __classPrivateFieldGet(this, _DOMNode_nodeNameInternal, "f") === 'SLOT');
    }
    distributedNodes() {
        return __classPrivateFieldGet(this, _DOMNode_distributedNodesInternal, "f");
    }
    isInShadowTree() {
        return __classPrivateFieldGet(this, _DOMNode_isInShadowTreeInternal, "f");
    }
    ancestorShadowHost() {
        const ancestorShadowRoot = this.ancestorShadowRoot();
        return ancestorShadowRoot ? ancestorShadowRoot.parentNode : null;
    }
    ancestorShadowRoot() {
        if (!__classPrivateFieldGet(this, _DOMNode_isInShadowTreeInternal, "f")) {
            return null;
        }
        let current = this;
        while (current && !current.isShadowRoot()) {
            current = current.parentNode;
        }
        return current;
    }
    ancestorUserAgentShadowRoot() {
        const ancestorShadowRoot = this.ancestorShadowRoot();
        if (!ancestorShadowRoot) {
            return null;
        }
        return ancestorShadowRoot.shadowRootType() === DOMNode.ShadowRootTypes.UserAgent ? ancestorShadowRoot : null;
    }
    isShadowRoot() {
        return Boolean(__classPrivateFieldGet(this, _DOMNode_shadowRootTypeInternal, "f"));
    }
    shadowRootType() {
        return __classPrivateFieldGet(this, _DOMNode_shadowRootTypeInternal, "f") || null;
    }
    nodeNameInCorrectCase() {
        const shadowRootType = this.shadowRootType();
        if (shadowRootType) {
            return '#shadow-root (' + shadowRootType + ')';
        }
        // If there is no local #name, it's case sensitive
        if (!this.localName()) {
            return this.nodeName();
        }
        // If the names are different lengths, there is a prefix and it's case sensitive
        if (this.localName().length !== this.nodeName().length) {
            return this.nodeName();
        }
        // Return the localname, which will be case insensitive if its an html node
        return this.localName();
    }
    setNodeName(name, callback) {
        void __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_setNodeName({ nodeId: this.id, name }).then(response => {
            if (!response.getError()) {
                __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").markUndoableState();
            }
            if (callback) {
                callback(response.getError() || null, __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").nodeForId(response.nodeId));
            }
        });
    }
    localName() {
        return __classPrivateFieldGet(this, _DOMNode_localNameInternal, "f");
    }
    nodeValue() {
        return this.nodeValueInternal;
    }
    setNodeValueInternal(nodeValue) {
        this.nodeValueInternal = nodeValue;
    }
    setNodeValue(value, callback) {
        void __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_setNodeValue({ nodeId: this.id, value }).then(response => {
            if (!response.getError()) {
                __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").markUndoableState();
            }
            if (callback) {
                callback(response.getError() || null);
            }
        });
    }
    getAttribute(name) {
        const attr = __classPrivateFieldGet(this, _DOMNode_attributesInternal, "f").get(name);
        return attr ? attr.value : undefined;
    }
    setAttribute(name, text, callback) {
        void __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_setAttributesAsText({ nodeId: this.id, text, name }).then(response => {
            if (!response.getError()) {
                __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").markUndoableState();
            }
            if (callback) {
                callback(response.getError() || null);
            }
        });
    }
    setAttributeValue(name, value, callback) {
        void __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_setAttributeValue({ nodeId: this.id, name, value }).then(response => {
            if (!response.getError()) {
                __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").markUndoableState();
            }
            if (callback) {
                callback(response.getError() || null);
            }
        });
    }
    setAttributeValuePromise(name, value) {
        return new Promise(fulfill => this.setAttributeValue(name, value, fulfill));
    }
    attributes() {
        return [...__classPrivateFieldGet(this, _DOMNode_attributesInternal, "f").values()];
    }
    async removeAttribute(name) {
        const response = await __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_removeAttribute({ nodeId: this.id, name });
        if (response.getError()) {
            return;
        }
        __classPrivateFieldGet(this, _DOMNode_attributesInternal, "f").delete(name);
        __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").markUndoableState();
    }
    getChildNodesPromise() {
        return new Promise(resolve => {
            return this.getChildNodes(childNodes => resolve(childNodes));
        });
    }
    getChildNodes(callback) {
        if (this.childrenInternal) {
            callback(this.children());
            return;
        }
        void __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_requestChildNodes({ nodeId: this.id }).then(response => {
            callback(response.getError() ? null : this.children());
        });
    }
    async getSubtree(depth, pierce) {
        const response = await __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_requestChildNodes({ nodeId: this.id, depth, pierce });
        return response.getError() ? null : this.childrenInternal;
    }
    async getOuterHTML(includeShadowDOM = false) {
        const { outerHTML } = await __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_getOuterHTML({ nodeId: this.id, includeShadowDOM });
        return outerHTML;
    }
    setOuterHTML(html, callback) {
        void __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_setOuterHTML({ nodeId: this.id, outerHTML: html }).then(response => {
            if (!response.getError()) {
                __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").markUndoableState();
            }
            if (callback) {
                callback(response.getError() || null);
            }
        });
    }
    removeNode(callback) {
        return __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_removeNode({ nodeId: this.id }).then(response => {
            if (!response.getError()) {
                __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").markUndoableState();
            }
            if (callback) {
                callback(response.getError() || null);
            }
        });
    }
    path() {
        function getNodeKey(node) {
            if (!__classPrivateFieldGet(node, _DOMNode_nodeNameInternal, "f").length) {
                return null;
            }
            if (node.index !== undefined) {
                return node.index;
            }
            if (!node.parentNode) {
                return null;
            }
            if (node.isShadowRoot()) {
                return node.shadowRootType() === DOMNode.ShadowRootTypes.UserAgent ? 'u' : 'a';
            }
            if (node.nodeType() === Node.DOCUMENT_NODE) {
                return 'd';
            }
            return null;
        }
        const path = [];
        let node = this;
        while (node) {
            const key = getNodeKey(node);
            if (key === null) {
                break;
            }
            path.push([key, __classPrivateFieldGet(node, _DOMNode_nodeNameInternal, "f")]);
            node = node.parentNode;
        }
        path.reverse();
        return path.join(',');
    }
    isAncestor(node) {
        if (!node) {
            return false;
        }
        let currentNode = node.parentNode;
        while (currentNode) {
            if (this === currentNode) {
                return true;
            }
            currentNode = currentNode.parentNode;
        }
        return false;
    }
    isDescendant(descendant) {
        return descendant.isAncestor(this);
    }
    frameOwnerFrameId() {
        return __classPrivateFieldGet(this, _DOMNode_frameOwnerFrameIdInternal, "f");
    }
    frameId() {
        let node = this.parentNode || this;
        while (!__classPrivateFieldGet(node, _DOMNode_frameOwnerFrameIdInternal, "f") && node.parentNode) {
            node = node.parentNode;
        }
        return __classPrivateFieldGet(node, _DOMNode_frameOwnerFrameIdInternal, "f");
    }
    setAttributesPayload(attrs) {
        let attributesChanged = !__classPrivateFieldGet(this, _DOMNode_attributesInternal, "f") || attrs.length !== __classPrivateFieldGet(this, _DOMNode_attributesInternal, "f").size * 2;
        const oldAttributesMap = __classPrivateFieldGet(this, _DOMNode_attributesInternal, "f") || new Map();
        __classPrivateFieldSet(this, _DOMNode_attributesInternal, new Map(), "f");
        for (let i = 0; i < attrs.length; i += 2) {
            const name = attrs[i];
            const value = attrs[i + 1];
            this.addAttribute(name, value);
            if (attributesChanged) {
                continue;
            }
            const oldAttribute = oldAttributesMap.get(name);
            if (!oldAttribute || oldAttribute.value !== value) {
                attributesChanged = true;
            }
        }
        return attributesChanged;
    }
    insertChild(prev, payload) {
        if (!this.childrenInternal) {
            throw new Error('DOMNode._children is expected to not be null.');
        }
        const node = DOMNode.create(__classPrivateFieldGet(this, _DOMNode_domModelInternal, "f"), this.ownerDocument, __classPrivateFieldGet(this, _DOMNode_isInShadowTreeInternal, "f"), payload);
        this.childrenInternal.splice(prev ? this.childrenInternal.indexOf(prev) + 1 : 0, 0, node);
        this.renumber();
        return node;
    }
    removeChild(node) {
        const pseudoType = node.pseudoType();
        if (pseudoType) {
            const updatedPseudoElements = __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get(pseudoType)?.filter(element => element !== node);
            if (updatedPseudoElements && updatedPseudoElements.length > 0) {
                __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").set(pseudoType, updatedPseudoElements);
            }
            else {
                __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").delete(pseudoType);
            }
        }
        else {
            const shadowRootIndex = this.shadowRootsInternal.indexOf(node);
            if (shadowRootIndex !== -1) {
                this.shadowRootsInternal.splice(shadowRootIndex, 1);
            }
            else {
                if (!this.childrenInternal) {
                    throw new Error('DOMNode._children is expected to not be null.');
                }
                if (this.childrenInternal.indexOf(node) === -1) {
                    throw new Error('DOMNode._children is expected to contain the node to be removed.');
                }
                this.childrenInternal.splice(this.childrenInternal.indexOf(node), 1);
            }
        }
        node.parentNode = null;
        __classPrivateFieldSet(this, _DOMNode_subtreeMarkerCount, __classPrivateFieldGet(this, _DOMNode_subtreeMarkerCount, "f") - __classPrivateFieldGet(node, _DOMNode_subtreeMarkerCount, "f"), "f");
        if (__classPrivateFieldGet(node, _DOMNode_subtreeMarkerCount, "f")) {
            __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").dispatchEventToListeners(Events.MarkersChanged, this);
        }
        this.renumber();
    }
    setChildrenPayload(payloads) {
        this.childrenInternal = [];
        for (let i = 0; i < payloads.length; ++i) {
            const payload = payloads[i];
            const node = DOMNode.create(__classPrivateFieldGet(this, _DOMNode_domModelInternal, "f"), this.ownerDocument, __classPrivateFieldGet(this, _DOMNode_isInShadowTreeInternal, "f"), payload);
            this.childrenInternal.push(node);
        }
        this.renumber();
    }
    setPseudoElements(payloads) {
        if (!payloads) {
            return;
        }
        for (let i = 0; i < payloads.length; ++i) {
            const node = DOMNode.create(__classPrivateFieldGet(this, _DOMNode_domModelInternal, "f"), this.ownerDocument, __classPrivateFieldGet(this, _DOMNode_isInShadowTreeInternal, "f"), payloads[i]);
            node.parentNode = this;
            const pseudoType = node.pseudoType();
            if (!pseudoType) {
                throw new Error('DOMNode.pseudoType() is expected to be defined.');
            }
            const currentPseudoElements = __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").get(pseudoType);
            if (currentPseudoElements) {
                currentPseudoElements.push(node);
            }
            else {
                __classPrivateFieldGet(this, _DOMNode_pseudoElements, "f").set(pseudoType, [node]);
            }
        }
    }
    setDistributedNodePayloads(payloads) {
        __classPrivateFieldSet(this, _DOMNode_distributedNodesInternal, [], "f");
        for (const payload of payloads) {
            __classPrivateFieldGet(this, _DOMNode_distributedNodesInternal, "f").push(new DOMNodeShortcut(__classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").target(), payload.backendNodeId, payload.nodeType, payload.nodeName));
        }
    }
    setAssignedSlot(payload) {
        this.assignedSlot =
            new DOMNodeShortcut(__classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").target(), payload.backendNodeId, payload.nodeType, payload.nodeName);
    }
    renumber() {
        if (!this.childrenInternal) {
            throw new Error('DOMNode._children is expected to not be null.');
        }
        this.childNodeCountInternal = this.childrenInternal.length;
        if (this.childNodeCountInternal === 0) {
            this.firstChild = null;
            this.lastChild = null;
            return;
        }
        this.firstChild = this.childrenInternal[0];
        this.lastChild = this.childrenInternal[this.childNodeCountInternal - 1];
        for (let i = 0; i < this.childNodeCountInternal; ++i) {
            const child = this.childrenInternal[i];
            child.index = i;
            child.nextSibling = i + 1 < this.childNodeCountInternal ? this.childrenInternal[i + 1] : null;
            child.previousSibling = i - 1 >= 0 ? this.childrenInternal[i - 1] : null;
            child.parentNode = this;
        }
    }
    addAttribute(name, value) {
        const attr = { name, value, _node: this };
        __classPrivateFieldGet(this, _DOMNode_attributesInternal, "f").set(name, attr);
    }
    setAttributeInternal(name, value) {
        const attr = __classPrivateFieldGet(this, _DOMNode_attributesInternal, "f").get(name);
        if (attr) {
            attr.value = value;
        }
        else {
            this.addAttribute(name, value);
        }
    }
    removeAttributeInternal(name) {
        __classPrivateFieldGet(this, _DOMNode_attributesInternal, "f").delete(name);
    }
    copyTo(targetNode, anchorNode, callback) {
        void __classPrivateFieldGet(this, _DOMNode_agent, "f")
            .invoke_copyTo({ nodeId: this.id, targetNodeId: targetNode.id, insertBeforeNodeId: anchorNode ? anchorNode.id : undefined })
            .then(response => {
            if (!response.getError()) {
                __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").markUndoableState();
            }
            const pastedNode = __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").nodeForId(response.nodeId);
            if (pastedNode) {
                // For every marker in this.#markers, set a marker in the copied node.
                for (const [name, value] of __classPrivateFieldGet(this, _DOMNode_markers, "f")) {
                    pastedNode.setMarker(name, value);
                }
            }
            if (callback) {
                callback(response.getError() || null, pastedNode);
            }
        });
    }
    moveTo(targetNode, anchorNode, callback) {
        void __classPrivateFieldGet(this, _DOMNode_agent, "f")
            .invoke_moveTo({ nodeId: this.id, targetNodeId: targetNode.id, insertBeforeNodeId: anchorNode ? anchorNode.id : undefined })
            .then(response => {
            if (!response.getError()) {
                __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").markUndoableState();
            }
            if (callback) {
                callback(response.getError() || null, __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").nodeForId(response.nodeId));
            }
        });
    }
    isXMLNode() {
        return Boolean(__classPrivateFieldGet(this, _DOMNode_xmlVersion, "f"));
    }
    setMarker(name, value) {
        var _a, _b, _c, _d;
        if (value === null) {
            if (!__classPrivateFieldGet(this, _DOMNode_markers, "f").has(name)) {
                return;
            }
            __classPrivateFieldGet(this, _DOMNode_markers, "f").delete(name);
            for (let node = this; node; node = node.parentNode) {
                __classPrivateFieldSet(_a = node, _DOMNode_subtreeMarkerCount, (_b = __classPrivateFieldGet(_a, _DOMNode_subtreeMarkerCount, "f"), --_b), "f");
            }
            for (let node = this; node; node = node.parentNode) {
                __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").dispatchEventToListeners(Events.MarkersChanged, node);
            }
            return;
        }
        if (this.parentNode && !__classPrivateFieldGet(this, _DOMNode_markers, "f").has(name)) {
            for (let node = this; node; node = node.parentNode) {
                __classPrivateFieldSet(_c = node, _DOMNode_subtreeMarkerCount, (_d = __classPrivateFieldGet(_c, _DOMNode_subtreeMarkerCount, "f"), ++_d), "f");
            }
        }
        __classPrivateFieldGet(this, _DOMNode_markers, "f").set(name, value);
        for (let node = this; node; node = node.parentNode) {
            __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").dispatchEventToListeners(Events.MarkersChanged, node);
        }
    }
    marker(name) {
        return __classPrivateFieldGet(this, _DOMNode_markers, "f").get(name) || null;
    }
    getMarkerKeysForTest() {
        return [...__classPrivateFieldGet(this, _DOMNode_markers, "f").keys()];
    }
    traverseMarkers(visitor) {
        function traverse(node) {
            if (!__classPrivateFieldGet(node, _DOMNode_subtreeMarkerCount, "f")) {
                return;
            }
            for (const marker of __classPrivateFieldGet(node, _DOMNode_markers, "f").keys()) {
                visitor(node, marker);
            }
            if (!node.childrenInternal) {
                return;
            }
            for (const child of node.childrenInternal) {
                traverse(child);
            }
        }
        traverse(this);
    }
    resolveURL(url) {
        if (!url) {
            return url;
        }
        for (let frameOwnerCandidate = this; frameOwnerCandidate; frameOwnerCandidate = frameOwnerCandidate.parentNode) {
            if (frameOwnerCandidate instanceof DOMDocument && frameOwnerCandidate.baseURL) {
                return Common.ParsedURL.ParsedURL.completeURL(frameOwnerCandidate.baseURL, url);
            }
        }
        return null;
    }
    highlight(mode) {
        __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").overlayModel().highlightInOverlay({ node: this, selectorList: undefined }, mode);
    }
    highlightForTwoSeconds() {
        __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").overlayModel().highlightInOverlayForTwoSeconds({ node: this, selectorList: undefined });
    }
    async resolveToObject(objectGroup, executionContextId) {
        const { object } = await __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_resolveNode({ nodeId: this.id, backendNodeId: undefined, executionContextId, objectGroup });
        return object && __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").runtimeModelInternal.createRemoteObject(object) || null;
    }
    async boxModel() {
        const { model } = await __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_getBoxModel({ nodeId: this.id });
        return model;
    }
    async setAsInspectedNode() {
        let node = this;
        if (node?.pseudoType()) {
            node = node.parentNode;
        }
        while (node) {
            let ancestor = node.ancestorUserAgentShadowRoot();
            if (!ancestor) {
                break;
            }
            ancestor = node.ancestorShadowHost();
            if (!ancestor) {
                break;
            }
            // User #agent shadow root, keep climbing up.
            node = ancestor;
        }
        if (!node) {
            throw new Error('In DOMNode.setAsInspectedNode: node is expected to not be null.');
        }
        await __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_setInspectedNode({ nodeId: node.id });
    }
    enclosingElementOrSelf() {
        let node = this;
        if (node && node.nodeType() === Node.TEXT_NODE && node.parentNode) {
            node = node.parentNode;
        }
        if (node && node.nodeType() !== Node.ELEMENT_NODE) {
            node = null;
        }
        return node;
    }
    async callFunction(fn, args = []) {
        const object = await this.resolveToObject();
        if (!object) {
            return null;
        }
        const result = await object.callFunction(fn, args.map(arg => RemoteObject.toCallArgument(arg)));
        object.release();
        if (result.wasThrown || !result.object) {
            return null;
        }
        return {
            value: result.object.value,
        };
    }
    async scrollIntoView() {
        const node = this.enclosingElementOrSelf();
        if (!node) {
            return;
        }
        const result = await node.callFunction(scrollIntoViewInPage);
        if (!result) {
            return;
        }
        node.highlightForTwoSeconds();
        function scrollIntoViewInPage() {
            this.scrollIntoViewIfNeeded(true);
        }
    }
    async focus() {
        const node = this.enclosingElementOrSelf();
        if (!node) {
            throw new Error('DOMNode.focus expects node to not be null.');
        }
        const result = await node.callFunction(focusInPage);
        if (!result) {
            return;
        }
        node.highlightForTwoSeconds();
        await __classPrivateFieldGet(this, _DOMNode_domModelInternal, "f").target().pageAgent().invoke_bringToFront();
        function focusInPage() {
            this.focus();
        }
    }
    simpleSelector() {
        const lowerCaseName = this.localName() || this.nodeName().toLowerCase();
        if (this.nodeType() !== Node.ELEMENT_NODE) {
            return lowerCaseName;
        }
        const type = this.getAttribute('type');
        const id = this.getAttribute('id');
        const classes = this.getAttribute('class');
        if (lowerCaseName === 'input' && type && !id && !classes) {
            return lowerCaseName + '[type="' + CSS.escape(type) + '"]';
        }
        if (id) {
            return lowerCaseName + '#' + CSS.escape(id);
        }
        if (classes) {
            const classList = classes.trim().split(/\s+/g);
            return (lowerCaseName === 'div' ? '' : lowerCaseName) + '.' + classList.map(cls => CSS.escape(cls)).join('.');
        }
        if (this.pseudoIdentifier()) {
            return `${lowerCaseName}(${this.pseudoIdentifier()})`;
        }
        return lowerCaseName;
    }
    async getAnchorBySpecifier(specifier) {
        const response = await __classPrivateFieldGet(this, _DOMNode_agent, "f").invoke_getAnchorElement({
            nodeId: this.id,
            anchorSpecifier: specifier,
        });
        if (response.getError()) {
            return null;
        }
        return this.domModel().nodeForId(response.nodeId);
    }
    classNames() {
        const classes = this.getAttribute('class');
        return classes ? classes.split(/\s+/) : [];
    }
}
_DOMNode_domModelInternal = new WeakMap(), _DOMNode_agent = new WeakMap(), _DOMNode_isInShadowTreeInternal = new WeakMap(), _DOMNode_backendNodeIdInternal = new WeakMap(), _DOMNode_nodeTypeInternal = new WeakMap(), _DOMNode_nodeNameInternal = new WeakMap(), _DOMNode_localNameInternal = new WeakMap(), _DOMNode_pseudoTypeInternal = new WeakMap(), _DOMNode_pseudoIdentifier = new WeakMap(), _DOMNode_shadowRootTypeInternal = new WeakMap(), _DOMNode_frameOwnerFrameIdInternal = new WeakMap(), _DOMNode_xmlVersion = new WeakMap(), _DOMNode_isSVGNodeInternal = new WeakMap(), _DOMNode_isScrollableInternal = new WeakMap(), _DOMNode_creationStackTraceInternal = new WeakMap(), _DOMNode_pseudoElements = new WeakMap(), _DOMNode_distributedNodesInternal = new WeakMap(), _DOMNode_attributesInternal = new WeakMap(), _DOMNode_markers = new WeakMap(), _DOMNode_subtreeMarkerCount = new WeakMap(), _DOMNode_importedDocumentInternal = new WeakMap();
(function (DOMNode) {
    let ShadowRootTypes;
    (function (ShadowRootTypes) {
        /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
        ShadowRootTypes["UserAgent"] = "user-agent";
        ShadowRootTypes["Open"] = "open";
        ShadowRootTypes["Closed"] = "closed";
        /* eslint-enable @typescript-eslint/naming-convention */
    })(ShadowRootTypes = DOMNode.ShadowRootTypes || (DOMNode.ShadowRootTypes = {}));
})(DOMNode || (DOMNode = {}));
export class DeferredDOMNode {
    constructor(target, backendNodeId) {
        _DeferredDOMNode_domModelInternal.set(this, void 0);
        _DeferredDOMNode_backendNodeIdInternal.set(this, void 0);
        __classPrivateFieldSet(this, _DeferredDOMNode_domModelInternal, target.model(DOMModel), "f");
        __classPrivateFieldSet(this, _DeferredDOMNode_backendNodeIdInternal, backendNodeId, "f");
    }
    resolve(callback) {
        void this.resolvePromise().then(callback);
    }
    async resolvePromise() {
        const nodeIds = await __classPrivateFieldGet(this, _DeferredDOMNode_domModelInternal, "f").pushNodesByBackendIdsToFrontend(new Set([__classPrivateFieldGet(this, _DeferredDOMNode_backendNodeIdInternal, "f")]));
        return nodeIds?.get(__classPrivateFieldGet(this, _DeferredDOMNode_backendNodeIdInternal, "f")) || null;
    }
    backendNodeId() {
        return __classPrivateFieldGet(this, _DeferredDOMNode_backendNodeIdInternal, "f");
    }
    domModel() {
        return __classPrivateFieldGet(this, _DeferredDOMNode_domModelInternal, "f");
    }
    highlight() {
        __classPrivateFieldGet(this, _DeferredDOMNode_domModelInternal, "f").overlayModel().highlightInOverlay({ deferredNode: this, selectorList: undefined });
    }
}
_DeferredDOMNode_domModelInternal = new WeakMap(), _DeferredDOMNode_backendNodeIdInternal = new WeakMap();
export class DOMNodeShortcut {
    constructor(target, backendNodeId, nodeType, nodeName) {
        this.nodeType = nodeType;
        this.nodeName = nodeName;
        this.deferredNode = new DeferredDOMNode(target, backendNodeId);
    }
}
export class DOMDocument extends DOMNode {
    constructor(domModel, payload) {
        super(domModel);
        this.body = null;
        this.documentElement = null;
        this.init(this, false, payload);
        this.documentURL = (payload.documentURL || '');
        this.baseURL = (payload.baseURL || '');
    }
}
export class DOMModel extends SDKModel {
    constructor(target) {
        super(target);
        this.idToDOMNode = new Map();
        _DOMModel_document.set(this, null);
        _DOMModel_attributeLoadNodeIds.set(this, new Set());
        _DOMModel_lastMutationId.set(this, void 0);
        _DOMModel_pendingDocumentRequestPromise.set(this, null);
        _DOMModel_frameOwnerNode.set(this, void 0);
        _DOMModel_loadNodeAttributesTimeout.set(this, void 0);
        _DOMModel_searchId.set(this, void 0);
        this.agent = target.domAgent();
        target.registerDOMDispatcher(new DOMDispatcher(this));
        this.runtimeModelInternal = target.model(RuntimeModel);
        if (!target.suspended()) {
            void this.agent.invoke_enable({});
        }
        if (Root.Runtime.experiments.isEnabled('capture-node-creation-stacks')) {
            void this.agent.invoke_setNodeStackTracesEnabled({ enable: true });
        }
    }
    runtimeModel() {
        return this.runtimeModelInternal;
    }
    cssModel() {
        return this.target().model(CSSModel);
    }
    overlayModel() {
        return this.target().model(OverlayModel);
    }
    static cancelSearch() {
        for (const domModel of TargetManager.instance().models(DOMModel)) {
            domModel.cancelSearch();
        }
    }
    scheduleMutationEvent(node) {
        if (!this.hasEventListeners(Events.DOMMutated)) {
            return;
        }
        __classPrivateFieldSet(this, _DOMModel_lastMutationId, (__classPrivateFieldGet(this, _DOMModel_lastMutationId, "f") || 0) + 1, "f");
        void Promise.resolve().then(callObserve.bind(this, node, __classPrivateFieldGet(this, _DOMModel_lastMutationId, "f")));
        function callObserve(node, mutationId) {
            if (!this.hasEventListeners(Events.DOMMutated) || __classPrivateFieldGet(this, _DOMModel_lastMutationId, "f") !== mutationId) {
                return;
            }
            this.dispatchEventToListeners(Events.DOMMutated, node);
        }
    }
    requestDocument() {
        if (__classPrivateFieldGet(this, _DOMModel_document, "f")) {
            return Promise.resolve(__classPrivateFieldGet(this, _DOMModel_document, "f"));
        }
        if (!__classPrivateFieldGet(this, _DOMModel_pendingDocumentRequestPromise, "f")) {
            __classPrivateFieldSet(this, _DOMModel_pendingDocumentRequestPromise, this.requestDocumentInternal(), "f");
        }
        return __classPrivateFieldGet(this, _DOMModel_pendingDocumentRequestPromise, "f");
    }
    async getOwnerNodeForFrame(frameId) {
        // Returns an error if the frameId does not belong to the current target.
        const response = await this.agent.invoke_getFrameOwner({ frameId });
        if (response.getError()) {
            return null;
        }
        return new DeferredDOMNode(this.target(), response.backendNodeId);
    }
    async requestDocumentInternal() {
        const response = await this.agent.invoke_getDocument({});
        if (response.getError()) {
            return null;
        }
        const { root: documentPayload } = response;
        __classPrivateFieldSet(this, _DOMModel_pendingDocumentRequestPromise, null, "f");
        if (documentPayload) {
            this.setDocument(documentPayload);
        }
        if (!__classPrivateFieldGet(this, _DOMModel_document, "f")) {
            console.error('No document');
            return null;
        }
        const parentModel = this.parentModel();
        if (parentModel && !__classPrivateFieldGet(this, _DOMModel_frameOwnerNode, "f")) {
            await parentModel.requestDocument();
            const mainFrame = this.target().model(ResourceTreeModel)?.mainFrame;
            if (mainFrame) {
                const response = await parentModel.agent.invoke_getFrameOwner({ frameId: mainFrame.id });
                if (!response.getError() && response.nodeId) {
                    __classPrivateFieldSet(this, _DOMModel_frameOwnerNode, parentModel.nodeForId(response.nodeId), "f");
                }
            }
        }
        // Document could have been cleared by now.
        if (__classPrivateFieldGet(this, _DOMModel_frameOwnerNode, "f")) {
            const oldDocument = __classPrivateFieldGet(this, _DOMModel_frameOwnerNode, "f").contentDocument();
            __classPrivateFieldGet(this, _DOMModel_frameOwnerNode, "f").setContentDocument(__classPrivateFieldGet(this, _DOMModel_document, "f"));
            __classPrivateFieldGet(this, _DOMModel_frameOwnerNode, "f").setChildren([]);
            if (__classPrivateFieldGet(this, _DOMModel_document, "f")) {
                __classPrivateFieldGet(this, _DOMModel_document, "f").parentNode = __classPrivateFieldGet(this, _DOMModel_frameOwnerNode, "f");
                this.dispatchEventToListeners(Events.NodeInserted, __classPrivateFieldGet(this, _DOMModel_document, "f"));
            }
            else if (oldDocument) {
                this.dispatchEventToListeners(Events.NodeRemoved, { node: oldDocument, parent: __classPrivateFieldGet(this, _DOMModel_frameOwnerNode, "f") });
            }
        }
        return __classPrivateFieldGet(this, _DOMModel_document, "f");
    }
    existingDocument() {
        return __classPrivateFieldGet(this, _DOMModel_document, "f");
    }
    async pushNodeToFrontend(objectId) {
        await this.requestDocument();
        const { nodeId } = await this.agent.invoke_requestNode({ objectId });
        return this.nodeForId(nodeId);
    }
    pushNodeByPathToFrontend(path) {
        return this.requestDocument()
            .then(() => this.agent.invoke_pushNodeByPathToFrontend({ path }))
            .then(({ nodeId }) => nodeId);
    }
    async pushNodesByBackendIdsToFrontend(backendNodeIds) {
        await this.requestDocument();
        const backendNodeIdsArray = [...backendNodeIds];
        const { nodeIds } = await this.agent.invoke_pushNodesByBackendIdsToFrontend({ backendNodeIds: backendNodeIdsArray });
        if (!nodeIds) {
            return null;
        }
        const map = new Map();
        for (let i = 0; i < nodeIds.length; ++i) {
            if (nodeIds[i]) {
                map.set(backendNodeIdsArray[i], this.nodeForId(nodeIds[i]));
            }
        }
        return map;
    }
    attributeModified(nodeId, name, value) {
        const node = this.idToDOMNode.get(nodeId);
        if (!node) {
            return;
        }
        node.setAttributeInternal(name, value);
        this.dispatchEventToListeners(Events.AttrModified, { node, name });
        this.scheduleMutationEvent(node);
    }
    attributeRemoved(nodeId, name) {
        const node = this.idToDOMNode.get(nodeId);
        if (!node) {
            return;
        }
        node.removeAttributeInternal(name);
        this.dispatchEventToListeners(Events.AttrRemoved, { node, name });
        this.scheduleMutationEvent(node);
    }
    inlineStyleInvalidated(nodeIds) {
        nodeIds.forEach(nodeId => __classPrivateFieldGet(this, _DOMModel_attributeLoadNodeIds, "f").add(nodeId));
        if (!__classPrivateFieldGet(this, _DOMModel_loadNodeAttributesTimeout, "f")) {
            __classPrivateFieldSet(this, _DOMModel_loadNodeAttributesTimeout, window.setTimeout(this.loadNodeAttributes.bind(this), 20), "f");
        }
    }
    loadNodeAttributes() {
        __classPrivateFieldSet(this, _DOMModel_loadNodeAttributesTimeout, undefined, "f");
        for (const nodeId of __classPrivateFieldGet(this, _DOMModel_attributeLoadNodeIds, "f")) {
            void this.agent.invoke_getAttributes({ nodeId }).then(({ attributes }) => {
                if (!attributes) {
                    // We are calling loadNodeAttributes asynchronously, it is ok if node is not found.
                    return;
                }
                const node = this.idToDOMNode.get(nodeId);
                if (!node) {
                    return;
                }
                if (node.setAttributesPayload(attributes)) {
                    this.dispatchEventToListeners(Events.AttrModified, { node, name: 'style' });
                    this.scheduleMutationEvent(node);
                }
            });
        }
        __classPrivateFieldGet(this, _DOMModel_attributeLoadNodeIds, "f").clear();
    }
    characterDataModified(nodeId, newValue) {
        const node = this.idToDOMNode.get(nodeId);
        if (!node) {
            console.error('nodeId could not be resolved to a node');
            return;
        }
        node.setNodeValueInternal(newValue);
        this.dispatchEventToListeners(Events.CharacterDataModified, node);
        this.scheduleMutationEvent(node);
    }
    nodeForId(nodeId) {
        return nodeId ? this.idToDOMNode.get(nodeId) || null : null;
    }
    documentUpdated() {
        // If this frame doesn't have a document now,
        // it means that its document is not requested yet and
        // it will be requested when needed. (ex: setChildNodes event is received for the frame owner node)
        // So, we don't need to request the document if we don't
        // already have a document.
        const alreadyHasDocument = Boolean(__classPrivateFieldGet(this, _DOMModel_document, "f"));
        this.setDocument(null);
        // If we have this.#pendingDocumentRequestPromise in flight,
        // it will contain most recent result.
        if (this.parentModel() && alreadyHasDocument && !__classPrivateFieldGet(this, _DOMModel_pendingDocumentRequestPromise, "f")) {
            void this.requestDocument();
        }
    }
    setDocument(payload) {
        this.idToDOMNode = new Map();
        if (payload && 'nodeId' in payload) {
            __classPrivateFieldSet(this, _DOMModel_document, new DOMDocument(this, payload), "f");
        }
        else {
            __classPrivateFieldSet(this, _DOMModel_document, null, "f");
        }
        DOMModelUndoStack.instance().dispose(this);
        if (!this.parentModel()) {
            this.dispatchEventToListeners(Events.DocumentUpdated, this);
        }
    }
    setDocumentForTest(document) {
        this.setDocument(document);
    }
    setDetachedRoot(payload) {
        if (payload.nodeName === '#document') {
            new DOMDocument(this, payload);
        }
        else {
            DOMNode.create(this, null, false, payload);
        }
    }
    setChildNodes(parentId, payloads) {
        if (!parentId && payloads.length) {
            this.setDetachedRoot(payloads[0]);
            return;
        }
        const parent = this.idToDOMNode.get(parentId);
        parent?.setChildrenPayload(payloads);
    }
    childNodeCountUpdated(nodeId, newValue) {
        const node = this.idToDOMNode.get(nodeId);
        if (!node) {
            console.error('nodeId could not be resolved to a node');
            return;
        }
        node.setChildNodeCount(newValue);
        this.dispatchEventToListeners(Events.ChildNodeCountUpdated, node);
        this.scheduleMutationEvent(node);
    }
    childNodeInserted(parentId, prevId, payload) {
        const parent = this.idToDOMNode.get(parentId);
        const prev = this.idToDOMNode.get(prevId);
        if (!parent) {
            console.error('parentId could not be resolved to a node');
            return;
        }
        const node = parent.insertChild(prev, payload);
        this.idToDOMNode.set(node.id, node);
        this.dispatchEventToListeners(Events.NodeInserted, node);
        this.scheduleMutationEvent(node);
    }
    childNodeRemoved(parentId, nodeId) {
        const parent = this.idToDOMNode.get(parentId);
        const node = this.idToDOMNode.get(nodeId);
        if (!parent || !node) {
            console.error('parentId or nodeId could not be resolved to a node');
            return;
        }
        parent.removeChild(node);
        this.unbind(node);
        this.dispatchEventToListeners(Events.NodeRemoved, { node, parent });
        this.scheduleMutationEvent(node);
    }
    shadowRootPushed(hostId, root) {
        const host = this.idToDOMNode.get(hostId);
        if (!host) {
            return;
        }
        const node = DOMNode.create(this, host.ownerDocument, true, root);
        node.parentNode = host;
        this.idToDOMNode.set(node.id, node);
        host.shadowRootsInternal.unshift(node);
        this.dispatchEventToListeners(Events.NodeInserted, node);
        this.scheduleMutationEvent(node);
    }
    shadowRootPopped(hostId, rootId) {
        const host = this.idToDOMNode.get(hostId);
        if (!host) {
            return;
        }
        const root = this.idToDOMNode.get(rootId);
        if (!root) {
            return;
        }
        host.removeChild(root);
        this.unbind(root);
        this.dispatchEventToListeners(Events.NodeRemoved, { node: root, parent: host });
        this.scheduleMutationEvent(root);
    }
    pseudoElementAdded(parentId, pseudoElement) {
        const parent = this.idToDOMNode.get(parentId);
        if (!parent) {
            return;
        }
        const node = DOMNode.create(this, parent.ownerDocument, false, pseudoElement);
        node.parentNode = parent;
        this.idToDOMNode.set(node.id, node);
        const pseudoType = node.pseudoType();
        if (!pseudoType) {
            throw new Error('DOMModel._pseudoElementAdded expects pseudoType to be defined.');
        }
        const currentPseudoElements = parent.pseudoElements().get(pseudoType);
        if (currentPseudoElements && currentPseudoElements.length > 0) {
            if (!(pseudoType.startsWith('view-transition') || pseudoType.startsWith('scroll-') || pseudoType === 'column')) {
                throw new Error('DOMModel.pseudoElementAdded expects parent to not already have this pseudo type added; only view-transition* and scrolling pseudo elements can coexist under the same parent.' +
                    ` ${currentPseudoElements.length} elements of type ${pseudoType} already exist on parent.`);
            }
            currentPseudoElements.push(node);
        }
        else {
            parent.pseudoElements().set(pseudoType, [node]);
        }
        this.dispatchEventToListeners(Events.NodeInserted, node);
        this.scheduleMutationEvent(node);
    }
    scrollableFlagUpdated(nodeId, isScrollable) {
        const node = this.nodeForId(nodeId);
        if (!node || node.isScrollable() === isScrollable) {
            return;
        }
        node.setIsScrollable(isScrollable);
        this.dispatchEventToListeners(Events.ScrollableFlagUpdated, { node });
    }
    topLayerElementsUpdated() {
        this.dispatchEventToListeners(Events.TopLayerElementsChanged);
    }
    pseudoElementRemoved(parentId, pseudoElementId) {
        const parent = this.idToDOMNode.get(parentId);
        if (!parent) {
            return;
        }
        const pseudoElement = this.idToDOMNode.get(pseudoElementId);
        if (!pseudoElement) {
            return;
        }
        parent.removeChild(pseudoElement);
        this.unbind(pseudoElement);
        this.dispatchEventToListeners(Events.NodeRemoved, { node: pseudoElement, parent });
        this.scheduleMutationEvent(pseudoElement);
    }
    distributedNodesUpdated(insertionPointId, distributedNodes) {
        const insertionPoint = this.idToDOMNode.get(insertionPointId);
        if (!insertionPoint) {
            return;
        }
        insertionPoint.setDistributedNodePayloads(distributedNodes);
        this.dispatchEventToListeners(Events.DistributedNodesChanged, insertionPoint);
        this.scheduleMutationEvent(insertionPoint);
    }
    unbind(node) {
        this.idToDOMNode.delete(node.id);
        const children = node.children();
        for (let i = 0; children && i < children.length; ++i) {
            this.unbind(children[i]);
        }
        for (let i = 0; i < node.shadowRootsInternal.length; ++i) {
            this.unbind(node.shadowRootsInternal[i]);
        }
        const pseudoElements = node.pseudoElements();
        for (const value of pseudoElements.values()) {
            for (const pseudoElement of value) {
                this.unbind(pseudoElement);
            }
        }
        const templateContent = node.templateContent();
        if (templateContent) {
            this.unbind(templateContent);
        }
    }
    async getNodesByStyle(computedStyles, pierce = false) {
        await this.requestDocument();
        if (!__classPrivateFieldGet(this, _DOMModel_document, "f")) {
            throw new Error('DOMModel.getNodesByStyle expects to have a document.');
        }
        const response = await this.agent.invoke_getNodesForSubtreeByStyle({ nodeId: __classPrivateFieldGet(this, _DOMModel_document, "f").id, computedStyles, pierce });
        if (response.getError()) {
            throw new Error(response.getError());
        }
        return response.nodeIds;
    }
    async performSearch(query, includeUserAgentShadowDOM) {
        const response = await this.agent.invoke_performSearch({ query, includeUserAgentShadowDOM });
        if (!response.getError()) {
            __classPrivateFieldSet(this, _DOMModel_searchId, response.searchId, "f");
        }
        return response.getError() ? 0 : response.resultCount;
    }
    async searchResult(index) {
        if (!__classPrivateFieldGet(this, _DOMModel_searchId, "f")) {
            return null;
        }
        const { nodeIds } = await this.agent.invoke_getSearchResults({ searchId: __classPrivateFieldGet(this, _DOMModel_searchId, "f"), fromIndex: index, toIndex: index + 1 });
        return nodeIds && nodeIds.length === 1 ? this.nodeForId(nodeIds[0]) : null;
    }
    cancelSearch() {
        if (!__classPrivateFieldGet(this, _DOMModel_searchId, "f")) {
            return;
        }
        void this.agent.invoke_discardSearchResults({ searchId: __classPrivateFieldGet(this, _DOMModel_searchId, "f") });
        __classPrivateFieldSet(this, _DOMModel_searchId, undefined, "f");
    }
    classNamesPromise(nodeId) {
        return this.agent.invoke_collectClassNamesFromSubtree({ nodeId }).then(({ classNames }) => classNames || []);
    }
    querySelector(nodeId, selector) {
        return this.agent.invoke_querySelector({ nodeId, selector }).then(({ nodeId }) => nodeId);
    }
    querySelectorAll(nodeId, selector) {
        return this.agent.invoke_querySelectorAll({ nodeId, selector }).then(({ nodeIds }) => nodeIds);
    }
    getTopLayerElements() {
        return this.agent.invoke_getTopLayerElements().then(({ nodeIds }) => nodeIds);
    }
    getDetachedDOMNodes() {
        return this.agent.invoke_getDetachedDomNodes().then(({ detachedNodes }) => detachedNodes);
    }
    getElementByRelation(nodeId, relation) {
        return this.agent.invoke_getElementByRelation({ nodeId, relation }).then(({ nodeId }) => nodeId);
    }
    markUndoableState(minorChange) {
        void DOMModelUndoStack.instance().markUndoableState(this, minorChange || false);
    }
    async nodeForLocation(x, y, includeUserAgentShadowDOM) {
        const response = await this.agent.invoke_getNodeForLocation({ x, y, includeUserAgentShadowDOM });
        if (response.getError() || !response.nodeId) {
            return null;
        }
        return this.nodeForId(response.nodeId);
    }
    async getContainerForNode(nodeId, containerName, physicalAxes, logicalAxes, queriesScrollState) {
        const { nodeId: containerNodeId } = await this.agent.invoke_getContainerForNode({ nodeId, containerName, physicalAxes, logicalAxes, queriesScrollState });
        if (!containerNodeId) {
            return null;
        }
        return this.nodeForId(containerNodeId);
    }
    pushObjectAsNodeToFrontend(object) {
        return object.isNode() && object.objectId ? this.pushNodeToFrontend(object.objectId) : Promise.resolve(null);
    }
    suspendModel() {
        return this.agent.invoke_disable().then(() => this.setDocument(null));
    }
    async resumeModel() {
        await this.agent.invoke_enable({});
    }
    dispose() {
        DOMModelUndoStack.instance().dispose(this);
    }
    parentModel() {
        const parentTarget = this.target().parentTarget();
        return parentTarget ? parentTarget.model(DOMModel) : null;
    }
    getAgent() {
        return this.agent;
    }
    registerNode(node) {
        this.idToDOMNode.set(node.id, node);
    }
}
_DOMModel_document = new WeakMap(), _DOMModel_attributeLoadNodeIds = new WeakMap(), _DOMModel_lastMutationId = new WeakMap(), _DOMModel_pendingDocumentRequestPromise = new WeakMap(), _DOMModel_frameOwnerNode = new WeakMap(), _DOMModel_loadNodeAttributesTimeout = new WeakMap(), _DOMModel_searchId = new WeakMap();
export var Events;
(function (Events) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Events["AttrModified"] = "AttrModified";
    Events["AttrRemoved"] = "AttrRemoved";
    Events["CharacterDataModified"] = "CharacterDataModified";
    Events["DOMMutated"] = "DOMMutated";
    Events["NodeInserted"] = "NodeInserted";
    Events["NodeRemoved"] = "NodeRemoved";
    Events["DocumentUpdated"] = "DocumentUpdated";
    Events["ChildNodeCountUpdated"] = "ChildNodeCountUpdated";
    Events["DistributedNodesChanged"] = "DistributedNodesChanged";
    Events["MarkersChanged"] = "MarkersChanged";
    Events["TopLayerElementsChanged"] = "TopLayerElementsChanged";
    Events["ScrollableFlagUpdated"] = "ScrollableFlagUpdated";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Events || (Events = {}));
class DOMDispatcher {
    constructor(domModel) {
        _DOMDispatcher_domModel.set(this, void 0);
        __classPrivateFieldSet(this, _DOMDispatcher_domModel, domModel, "f");
    }
    documentUpdated() {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").documentUpdated();
    }
    attributeModified({ nodeId, name, value }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").attributeModified(nodeId, name, value);
    }
    attributeRemoved({ nodeId, name }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").attributeRemoved(nodeId, name);
    }
    inlineStyleInvalidated({ nodeIds }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").inlineStyleInvalidated(nodeIds);
    }
    characterDataModified({ nodeId, characterData }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").characterDataModified(nodeId, characterData);
    }
    setChildNodes({ parentId, nodes }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").setChildNodes(parentId, nodes);
    }
    childNodeCountUpdated({ nodeId, childNodeCount }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").childNodeCountUpdated(nodeId, childNodeCount);
    }
    childNodeInserted({ parentNodeId, previousNodeId, node }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").childNodeInserted(parentNodeId, previousNodeId, node);
    }
    childNodeRemoved({ parentNodeId, nodeId }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").childNodeRemoved(parentNodeId, nodeId);
    }
    shadowRootPushed({ hostId, root }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").shadowRootPushed(hostId, root);
    }
    shadowRootPopped({ hostId, rootId }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").shadowRootPopped(hostId, rootId);
    }
    pseudoElementAdded({ parentId, pseudoElement }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").pseudoElementAdded(parentId, pseudoElement);
    }
    pseudoElementRemoved({ parentId, pseudoElementId }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").pseudoElementRemoved(parentId, pseudoElementId);
    }
    distributedNodesUpdated({ insertionPointId, distributedNodes }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").distributedNodesUpdated(insertionPointId, distributedNodes);
    }
    topLayerElementsUpdated() {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").topLayerElementsUpdated();
    }
    scrollableFlagUpdated({ nodeId, isScrollable }) {
        __classPrivateFieldGet(this, _DOMDispatcher_domModel, "f").scrollableFlagUpdated(nodeId, isScrollable);
    }
}
_DOMDispatcher_domModel = new WeakMap();
let domModelUndoStackInstance = null;
export class DOMModelUndoStack {
    constructor() {
        _DOMModelUndoStack_stack.set(this, void 0);
        _DOMModelUndoStack_index.set(this, void 0);
        _DOMModelUndoStack_lastModelWithMinorChange.set(this, void 0);
        __classPrivateFieldSet(this, _DOMModelUndoStack_stack, [], "f");
        __classPrivateFieldSet(this, _DOMModelUndoStack_index, 0, "f");
        __classPrivateFieldSet(this, _DOMModelUndoStack_lastModelWithMinorChange, null, "f");
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!domModelUndoStackInstance || forceNew) {
            domModelUndoStackInstance = new DOMModelUndoStack();
        }
        return domModelUndoStackInstance;
    }
    async markUndoableState(model, minorChange) {
        // Both minor and major changes get into the #stack, but minor updates are coalesced.
        // Commit major undoable state in the old model upon model switch.
        if (__classPrivateFieldGet(this, _DOMModelUndoStack_lastModelWithMinorChange, "f") && model !== __classPrivateFieldGet(this, _DOMModelUndoStack_lastModelWithMinorChange, "f")) {
            __classPrivateFieldGet(this, _DOMModelUndoStack_lastModelWithMinorChange, "f").markUndoableState();
            __classPrivateFieldSet(this, _DOMModelUndoStack_lastModelWithMinorChange, null, "f");
        }
        // Previous minor change is already in the #stack.
        if (minorChange && __classPrivateFieldGet(this, _DOMModelUndoStack_lastModelWithMinorChange, "f") === model) {
            return;
        }
        __classPrivateFieldSet(this, _DOMModelUndoStack_stack, __classPrivateFieldGet(this, _DOMModelUndoStack_stack, "f").slice(0, __classPrivateFieldGet(this, _DOMModelUndoStack_index, "f")), "f");
        __classPrivateFieldGet(this, _DOMModelUndoStack_stack, "f").push(model);
        __classPrivateFieldSet(this, _DOMModelUndoStack_index, __classPrivateFieldGet(this, _DOMModelUndoStack_stack, "f").length, "f");
        // Delay marking as major undoable states in case of minor operations until the
        // major or model switch.
        if (minorChange) {
            __classPrivateFieldSet(this, _DOMModelUndoStack_lastModelWithMinorChange, model, "f");
        }
        else {
            await model.getAgent().invoke_markUndoableState();
            __classPrivateFieldSet(this, _DOMModelUndoStack_lastModelWithMinorChange, null, "f");
        }
    }
    async undo() {
        var _a;
        if (__classPrivateFieldGet(this, _DOMModelUndoStack_index, "f") === 0) {
            return await Promise.resolve();
        }
        __classPrivateFieldSet(this, _DOMModelUndoStack_index, (_a = __classPrivateFieldGet(this, _DOMModelUndoStack_index, "f"), --_a), "f");
        __classPrivateFieldSet(this, _DOMModelUndoStack_lastModelWithMinorChange, null, "f");
        await __classPrivateFieldGet(this, _DOMModelUndoStack_stack, "f")[__classPrivateFieldGet(this, _DOMModelUndoStack_index, "f")].getAgent().invoke_undo();
    }
    async redo() {
        var _a;
        if (__classPrivateFieldGet(this, _DOMModelUndoStack_index, "f") >= __classPrivateFieldGet(this, _DOMModelUndoStack_stack, "f").length) {
            return await Promise.resolve();
        }
        __classPrivateFieldSet(this, _DOMModelUndoStack_index, (_a = __classPrivateFieldGet(this, _DOMModelUndoStack_index, "f"), ++_a), "f");
        __classPrivateFieldSet(this, _DOMModelUndoStack_lastModelWithMinorChange, null, "f");
        await __classPrivateFieldGet(this, _DOMModelUndoStack_stack, "f")[__classPrivateFieldGet(this, _DOMModelUndoStack_index, "f") - 1].getAgent().invoke_redo();
    }
    dispose(model) {
        let shift = 0;
        for (let i = 0; i < __classPrivateFieldGet(this, _DOMModelUndoStack_index, "f"); ++i) {
            if (__classPrivateFieldGet(this, _DOMModelUndoStack_stack, "f")[i] === model) {
                ++shift;
            }
        }
        Platform.ArrayUtilities.removeElement(__classPrivateFieldGet(this, _DOMModelUndoStack_stack, "f"), model);
        __classPrivateFieldSet(this, _DOMModelUndoStack_index, __classPrivateFieldGet(this, _DOMModelUndoStack_index, "f") - shift, "f");
        if (__classPrivateFieldGet(this, _DOMModelUndoStack_lastModelWithMinorChange, "f") === model) {
            __classPrivateFieldSet(this, _DOMModelUndoStack_lastModelWithMinorChange, null, "f");
        }
    }
}
_DOMModelUndoStack_stack = new WeakMap(), _DOMModelUndoStack_index = new WeakMap(), _DOMModelUndoStack_lastModelWithMinorChange = new WeakMap();
SDKModel.register(DOMModel, { capabilities: 2 /* Capability.DOM */, autostart: true });
//# sourceMappingURL=DOMModel.js.map