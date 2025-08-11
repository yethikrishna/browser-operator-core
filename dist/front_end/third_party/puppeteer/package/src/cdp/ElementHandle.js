/**
 * @license
 * Copyright 2019 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _CdpElementHandle_instances, _CdpElementHandle_backendNodeId, _CdpElementHandle_frameManager_get;
import { bindIsolatedHandle, ElementHandle, } from '../api/ElementHandle.js';
import { debugError } from '../common/util.js';
import { environment } from '../environment.js';
import { assert } from '../util/assert.js';
import { AsyncIterableUtil } from '../util/AsyncIterableUtil.js';
import { throwIfDisposed } from '../util/decorators.js';
import { CdpJSHandle } from './JSHandle.js';
const NON_ELEMENT_NODE_ROLES = new Set(['StaticText', 'InlineTextBox']);
/**
 * The CdpElementHandle extends ElementHandle now to keep compatibility
 * with `instanceof` because of that we need to have methods for
 * CdpJSHandle to in this implementation as well.
 *
 * @internal
 */
export class CdpElementHandle extends ElementHandle {
    constructor(world, remoteObject) {
        super(new CdpJSHandle(world, remoteObject));
        _CdpElementHandle_instances.add(this);
        _CdpElementHandle_backendNodeId.set(this, void 0);
    }
    get realm() {
        return this.handle.realm;
    }
    get client() {
        return this.handle.client;
    }
    remoteObject() {
        return this.handle.remoteObject();
    }
    get frame() {
        return this.realm.environment;
    }
    async contentFrame() {
        const nodeInfo = await this.client.send('DOM.describeNode', {
            objectId: this.id,
        });
        if (typeof nodeInfo.node.frameId !== 'string') {
            return null;
        }
        return __classPrivateFieldGet(this, _CdpElementHandle_instances, "a", _CdpElementHandle_frameManager_get).frame(nodeInfo.node.frameId);
    }
    async scrollIntoView() {
        await this.assertConnectedElement();
        try {
            await this.client.send('DOM.scrollIntoViewIfNeeded', {
                objectId: this.id,
            });
        }
        catch (error) {
            debugError(error);
            // Fallback to Element.scrollIntoView if DOM.scrollIntoViewIfNeeded is not supported
            await super.scrollIntoView();
        }
    }
    async uploadFile(...files) {
        const isMultiple = await this.evaluate(element => {
            return element.multiple;
        });
        assert(files.length <= 1 || isMultiple, 'Multiple file uploads only work with <input type=file multiple>');
        // Locate all files and confirm that they exist.
        const path = environment.value.path;
        if (path) {
            files = files.map(filePath => {
                if (path.win32.isAbsolute(filePath) ||
                    path.posix.isAbsolute(filePath)) {
                    return filePath;
                }
                else {
                    return path.resolve(filePath);
                }
            });
        }
        /**
         * The zero-length array is a special case, it seems that
         * DOM.setFileInputFiles does not actually update the files in that case, so
         * the solution is to eval the element value to a new FileList directly.
         */
        if (files.length === 0) {
            // XXX: These events should converted to trusted events. Perhaps do this
            // in `DOM.setFileInputFiles`?
            await this.evaluate(element => {
                element.files = new DataTransfer().files;
                // Dispatch events for this case because it should behave akin to a user action.
                element.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            });
            return;
        }
        const { node: { backendNodeId }, } = await this.client.send('DOM.describeNode', {
            objectId: this.id,
        });
        await this.client.send('DOM.setFileInputFiles', {
            objectId: this.id,
            files,
            backendNodeId,
        });
    }
    async autofill(data) {
        const nodeInfo = await this.client.send('DOM.describeNode', {
            objectId: this.handle.id,
        });
        const fieldId = nodeInfo.node.backendNodeId;
        const frameId = this.frame._id;
        await this.client.send('Autofill.trigger', {
            fieldId,
            frameId,
            card: data.creditCard,
        });
    }
    async *queryAXTree(name, role) {
        const { nodes } = await this.client.send('Accessibility.queryAXTree', {
            objectId: this.id,
            accessibleName: name,
            role,
        });
        const results = nodes.filter(node => {
            if (node.ignored) {
                return false;
            }
            if (!node.role) {
                return false;
            }
            if (NON_ELEMENT_NODE_ROLES.has(node.role.value)) {
                return false;
            }
            return true;
        });
        return yield* AsyncIterableUtil.map(results, node => {
            return this.realm.adoptBackendNode(node.backendDOMNodeId);
        });
    }
    async backendNodeId() {
        if (__classPrivateFieldGet(this, _CdpElementHandle_backendNodeId, "f")) {
            return __classPrivateFieldGet(this, _CdpElementHandle_backendNodeId, "f");
        }
        const { node } = await this.client.send('DOM.describeNode', {
            objectId: this.handle.id,
        });
        __classPrivateFieldSet(this, _CdpElementHandle_backendNodeId, node.backendNodeId, "f");
        return __classPrivateFieldGet(this, _CdpElementHandle_backendNodeId, "f");
    }
}
_CdpElementHandle_backendNodeId = new WeakMap(), _CdpElementHandle_instances = new WeakSet(), _CdpElementHandle_frameManager_get = function _CdpElementHandle_frameManager_get() {
    return this.frame._frameManager;
};
__decorate([
    throwIfDisposed(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CdpElementHandle.prototype, "contentFrame", null);
__decorate([
    throwIfDisposed(),
    bindIsolatedHandle,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CdpElementHandle.prototype, "scrollIntoView", null);
__decorate([
    throwIfDisposed(),
    bindIsolatedHandle,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CdpElementHandle.prototype, "uploadFile", null);
__decorate([
    throwIfDisposed(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CdpElementHandle.prototype, "autofill", null);
//# sourceMappingURL=ElementHandle.js.map