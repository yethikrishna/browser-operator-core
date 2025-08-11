/**
 * @license
 * Copyright 2023 Google Inc.
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
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
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
var _BidiElementHandle_backendNodeId;
import { bindIsolatedHandle, ElementHandle, } from '../api/ElementHandle.js';
import { UnsupportedOperation } from '../common/Errors.js';
import { environment } from '../environment.js';
import { AsyncIterableUtil } from '../util/AsyncIterableUtil.js';
import { throwIfDisposed } from '../util/decorators.js';
import { BidiJSHandle } from './JSHandle.js';
/**
 * @internal
 */
export class BidiElementHandle extends ElementHandle {
    static from(value, realm) {
        return new BidiElementHandle(value, realm);
    }
    constructor(value, realm) {
        super(BidiJSHandle.from(value, realm));
        _BidiElementHandle_backendNodeId.set(this, void 0);
    }
    get realm() {
        // SAFETY: See the super call in the constructor.
        return this.handle.realm;
    }
    get frame() {
        return this.realm.environment;
    }
    remoteValue() {
        return this.handle.remoteValue();
    }
    async autofill(data) {
        const client = this.frame.client;
        const nodeInfo = await client.send('DOM.describeNode', {
            objectId: this.handle.id,
        });
        const fieldId = nodeInfo.node.backendNodeId;
        const frameId = this.frame._id;
        await client.send('Autofill.trigger', {
            fieldId,
            frameId,
            card: data.creditCard,
        });
    }
    async contentFrame() {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const handle = __addDisposableResource(env_1, (await this.evaluateHandle(element => {
                if (element instanceof HTMLIFrameElement ||
                    element instanceof HTMLFrameElement) {
                    return element.contentWindow;
                }
                return;
            })), false);
            const value = handle.remoteValue();
            if (value.type === 'window') {
                return (this.frame
                    .page()
                    .frames()
                    .find(frame => {
                    return frame._id === value.value.context;
                }) ?? null);
            }
            return null;
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    async uploadFile(...files) {
        // Locate all files and confirm that they exist.
        const path = environment.value.path;
        if (path) {
            files = files.map(file => {
                if (path.win32.isAbsolute(file) || path.posix.isAbsolute(file)) {
                    return file;
                }
                else {
                    return path.resolve(file);
                }
            });
        }
        await this.frame.setFiles(this, files);
    }
    async *queryAXTree(name, role) {
        const results = await this.frame.locateNodes(this, {
            type: 'accessibility',
            value: {
                role,
                name,
            },
        });
        return yield* AsyncIterableUtil.map(results, node => {
            // TODO: maybe change ownership since the default ownership is probably none.
            return Promise.resolve(BidiElementHandle.from(node, this.realm));
        });
    }
    async backendNodeId() {
        if (!this.frame.page().browser().cdpSupported) {
            throw new UnsupportedOperation();
        }
        if (__classPrivateFieldGet(this, _BidiElementHandle_backendNodeId, "f")) {
            return __classPrivateFieldGet(this, _BidiElementHandle_backendNodeId, "f");
        }
        const { node } = await this.frame.client.send('DOM.describeNode', {
            objectId: this.handle.id,
        });
        __classPrivateFieldSet(this, _BidiElementHandle_backendNodeId, node.backendNodeId, "f");
        return __classPrivateFieldGet(this, _BidiElementHandle_backendNodeId, "f");
    }
}
_BidiElementHandle_backendNodeId = new WeakMap();
__decorate([
    throwIfDisposed(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BidiElementHandle.prototype, "autofill", null);
__decorate([
    throwIfDisposed(),
    bindIsolatedHandle,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BidiElementHandle.prototype, "contentFrame", null);
//# sourceMappingURL=ElementHandle.js.map