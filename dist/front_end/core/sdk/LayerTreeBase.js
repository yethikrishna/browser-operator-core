// Copyright 2016 The Chromium Authors. All rights reserved.
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
var _StickyPositionConstraint_stickyBoxRectInternal, _StickyPositionConstraint_containingBlockRectInternal, _StickyPositionConstraint_nearestLayerShiftingStickyBoxInternal, _StickyPositionConstraint_nearestLayerShiftingContainingBlockInternal, _LayerTreeBase_targetInternal, _LayerTreeBase_domModel, _LayerTreeBase_rootInternal, _LayerTreeBase_contentRootInternal, _LayerTreeBase_backendNodeIdToNodeInternal, _LayerTreeBase_viewportSizeInternal;
import { DOMModel } from './DOMModel.js';
export var Layer;
(function (Layer) {
    let ScrollRectType;
    (function (ScrollRectType) {
        ScrollRectType["NON_FAST_SCROLLABLE"] = "NonFastScrollable";
        ScrollRectType["TOUCH_EVENT_HANDLER"] = "TouchEventHandler";
        ScrollRectType["WHEEL_EVENT_HANDLER"] = "WheelEventHandler";
        ScrollRectType["REPAINTS_ON_SCROLL"] = "RepaintsOnScroll";
        ScrollRectType["MAIN_THREAD_SCROLL_REASON"] = "MainThreadScrollingReason";
    })(ScrollRectType = Layer.ScrollRectType || (Layer.ScrollRectType = {}));
})(Layer || (Layer = {}));
export class StickyPositionConstraint {
    constructor(layerTree, constraint) {
        _StickyPositionConstraint_stickyBoxRectInternal.set(this, void 0);
        _StickyPositionConstraint_containingBlockRectInternal.set(this, void 0);
        _StickyPositionConstraint_nearestLayerShiftingStickyBoxInternal.set(this, void 0);
        _StickyPositionConstraint_nearestLayerShiftingContainingBlockInternal.set(this, void 0);
        __classPrivateFieldSet(this, _StickyPositionConstraint_stickyBoxRectInternal, constraint.stickyBoxRect, "f");
        __classPrivateFieldSet(this, _StickyPositionConstraint_containingBlockRectInternal, constraint.containingBlockRect, "f");
        __classPrivateFieldSet(this, _StickyPositionConstraint_nearestLayerShiftingStickyBoxInternal, null, "f");
        if (layerTree && constraint.nearestLayerShiftingStickyBox) {
            __classPrivateFieldSet(this, _StickyPositionConstraint_nearestLayerShiftingStickyBoxInternal, layerTree.layerById(constraint.nearestLayerShiftingStickyBox), "f");
        }
        __classPrivateFieldSet(this, _StickyPositionConstraint_nearestLayerShiftingContainingBlockInternal, null, "f");
        if (layerTree && constraint.nearestLayerShiftingContainingBlock) {
            __classPrivateFieldSet(this, _StickyPositionConstraint_nearestLayerShiftingContainingBlockInternal, layerTree.layerById(constraint.nearestLayerShiftingContainingBlock), "f");
        }
    }
    stickyBoxRect() {
        return __classPrivateFieldGet(this, _StickyPositionConstraint_stickyBoxRectInternal, "f");
    }
    containingBlockRect() {
        return __classPrivateFieldGet(this, _StickyPositionConstraint_containingBlockRectInternal, "f");
    }
    nearestLayerShiftingStickyBox() {
        return __classPrivateFieldGet(this, _StickyPositionConstraint_nearestLayerShiftingStickyBoxInternal, "f");
    }
    nearestLayerShiftingContainingBlock() {
        return __classPrivateFieldGet(this, _StickyPositionConstraint_nearestLayerShiftingContainingBlockInternal, "f");
    }
}
_StickyPositionConstraint_stickyBoxRectInternal = new WeakMap(), _StickyPositionConstraint_containingBlockRectInternal = new WeakMap(), _StickyPositionConstraint_nearestLayerShiftingStickyBoxInternal = new WeakMap(), _StickyPositionConstraint_nearestLayerShiftingContainingBlockInternal = new WeakMap();
export class LayerTreeBase {
    constructor(target) {
        _LayerTreeBase_targetInternal.set(this, void 0);
        _LayerTreeBase_domModel.set(this, void 0);
        this.layersById = new Map();
        _LayerTreeBase_rootInternal.set(this, null);
        _LayerTreeBase_contentRootInternal.set(this, null);
        _LayerTreeBase_backendNodeIdToNodeInternal.set(this, new Map());
        _LayerTreeBase_viewportSizeInternal.set(this, void 0);
        __classPrivateFieldSet(this, _LayerTreeBase_targetInternal, target, "f");
        __classPrivateFieldSet(this, _LayerTreeBase_domModel, target ? target.model(DOMModel) : null, "f");
    }
    target() {
        return __classPrivateFieldGet(this, _LayerTreeBase_targetInternal, "f");
    }
    root() {
        return __classPrivateFieldGet(this, _LayerTreeBase_rootInternal, "f");
    }
    setRoot(root) {
        __classPrivateFieldSet(this, _LayerTreeBase_rootInternal, root, "f");
    }
    contentRoot() {
        return __classPrivateFieldGet(this, _LayerTreeBase_contentRootInternal, "f");
    }
    setContentRoot(contentRoot) {
        __classPrivateFieldSet(this, _LayerTreeBase_contentRootInternal, contentRoot, "f");
    }
    forEachLayer(callback, root) {
        if (!root) {
            root = this.root();
            if (!root) {
                return false;
            }
        }
        return callback(root) || root.children().some(this.forEachLayer.bind(this, callback));
    }
    layerById(id) {
        return this.layersById.get(id) || null;
    }
    async resolveBackendNodeIds(requestedNodeIds) {
        if (!requestedNodeIds.size || !__classPrivateFieldGet(this, _LayerTreeBase_domModel, "f")) {
            return;
        }
        const nodesMap = await __classPrivateFieldGet(this, _LayerTreeBase_domModel, "f").pushNodesByBackendIdsToFrontend(requestedNodeIds);
        if (!nodesMap) {
            return;
        }
        for (const nodeId of nodesMap.keys()) {
            __classPrivateFieldGet(this, _LayerTreeBase_backendNodeIdToNodeInternal, "f").set(nodeId, nodesMap.get(nodeId) || null);
        }
    }
    backendNodeIdToNode() {
        return __classPrivateFieldGet(this, _LayerTreeBase_backendNodeIdToNodeInternal, "f");
    }
    setViewportSize(viewportSize) {
        __classPrivateFieldSet(this, _LayerTreeBase_viewportSizeInternal, viewportSize, "f");
    }
    viewportSize() {
        return __classPrivateFieldGet(this, _LayerTreeBase_viewportSizeInternal, "f");
    }
}
_LayerTreeBase_targetInternal = new WeakMap(), _LayerTreeBase_domModel = new WeakMap(), _LayerTreeBase_rootInternal = new WeakMap(), _LayerTreeBase_contentRootInternal = new WeakMap(), _LayerTreeBase_backendNodeIdToNodeInternal = new WeakMap(), _LayerTreeBase_viewportSizeInternal = new WeakMap();
//# sourceMappingURL=LayerTreeBase.js.map