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
var _PipeTransport_instances, _PipeTransport_pipeWrite, _PipeTransport_subscriptions, _PipeTransport_isClosed, _PipeTransport_pendingMessage, _PipeTransport_dispatch;
import { EventEmitter } from '../common/EventEmitter.js';
import { debugError } from '../common/util.js';
import { assert } from '../util/assert.js';
import { DisposableStack } from '../util/disposable.js';
/**
 * @internal
 */
export class PipeTransport {
    constructor(pipeWrite, pipeRead) {
        _PipeTransport_instances.add(this);
        _PipeTransport_pipeWrite.set(this, void 0);
        _PipeTransport_subscriptions.set(this, new DisposableStack());
        _PipeTransport_isClosed.set(this, false);
        _PipeTransport_pendingMessage.set(this, '');
        __classPrivateFieldSet(this, _PipeTransport_pipeWrite, pipeWrite, "f");
        const pipeReadEmitter = __classPrivateFieldGet(this, _PipeTransport_subscriptions, "f").use(
        // NodeJS event emitters don't support `*` so we need to typecast
        // As long as we don't use it we should be OK.
        new EventEmitter(pipeRead));
        pipeReadEmitter.on('data', (buffer) => {
            return __classPrivateFieldGet(this, _PipeTransport_instances, "m", _PipeTransport_dispatch).call(this, buffer);
        });
        pipeReadEmitter.on('close', () => {
            if (this.onclose) {
                this.onclose.call(null);
            }
        });
        pipeReadEmitter.on('error', debugError);
        const pipeWriteEmitter = __classPrivateFieldGet(this, _PipeTransport_subscriptions, "f").use(
        // NodeJS event emitters don't support `*` so we need to typecast
        // As long as we don't use it we should be OK.
        new EventEmitter(pipeWrite));
        pipeWriteEmitter.on('error', debugError);
    }
    send(message) {
        assert(!__classPrivateFieldGet(this, _PipeTransport_isClosed, "f"), '`PipeTransport` is closed.');
        __classPrivateFieldGet(this, _PipeTransport_pipeWrite, "f").write(message);
        __classPrivateFieldGet(this, _PipeTransport_pipeWrite, "f").write('\0');
    }
    close() {
        __classPrivateFieldSet(this, _PipeTransport_isClosed, true, "f");
        __classPrivateFieldGet(this, _PipeTransport_subscriptions, "f").dispose();
    }
}
_PipeTransport_pipeWrite = new WeakMap(), _PipeTransport_subscriptions = new WeakMap(), _PipeTransport_isClosed = new WeakMap(), _PipeTransport_pendingMessage = new WeakMap(), _PipeTransport_instances = new WeakSet(), _PipeTransport_dispatch = function _PipeTransport_dispatch(buffer) {
    assert(!__classPrivateFieldGet(this, _PipeTransport_isClosed, "f"), '`PipeTransport` is closed.');
    let end = buffer.indexOf('\0');
    if (end === -1) {
        __classPrivateFieldSet(this, _PipeTransport_pendingMessage, __classPrivateFieldGet(this, _PipeTransport_pendingMessage, "f") + buffer.toString(), "f");
        return;
    }
    const message = __classPrivateFieldGet(this, _PipeTransport_pendingMessage, "f") + buffer.toString(undefined, 0, end);
    setImmediate(() => {
        if (this.onmessage) {
            this.onmessage.call(null, message);
        }
    });
    let start = end + 1;
    end = buffer.indexOf('\0', start);
    while (end !== -1) {
        const message = buffer.toString(undefined, start, end);
        setImmediate(() => {
            if (this.onmessage) {
                this.onmessage.call(null, message);
            }
        });
        start = end + 1;
        end = buffer.indexOf('\0', start);
    }
    __classPrivateFieldSet(this, _PipeTransport_pendingMessage, buffer.toString(undefined, start), "f");
};
//# sourceMappingURL=PipeTransport.js.map
//# sourceMappingURL=PipeTransport.js.map