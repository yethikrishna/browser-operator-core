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
var _CdpWebWorker_world, _CdpWebWorker_client, _CdpWebWorker_id, _CdpWebWorker_targetType;
import { CDPSessionEvent } from '../api/CDPSession.js';
import { TargetType } from '../api/Target.js';
import { WebWorker } from '../api/WebWorker.js';
import { TimeoutSettings } from '../common/TimeoutSettings.js';
import { debugError } from '../common/util.js';
import { ExecutionContext } from './ExecutionContext.js';
import { IsolatedWorld } from './IsolatedWorld.js';
import { CdpJSHandle } from './JSHandle.js';
/**
 * @internal
 */
export class CdpWebWorker extends WebWorker {
    constructor(client, url, targetId, targetType, consoleAPICalled, exceptionThrown, networkManager) {
        super(url);
        _CdpWebWorker_world.set(this, void 0);
        _CdpWebWorker_client.set(this, void 0);
        _CdpWebWorker_id.set(this, void 0);
        _CdpWebWorker_targetType.set(this, void 0);
        __classPrivateFieldSet(this, _CdpWebWorker_id, targetId, "f");
        __classPrivateFieldSet(this, _CdpWebWorker_client, client, "f");
        __classPrivateFieldSet(this, _CdpWebWorker_targetType, targetType, "f");
        __classPrivateFieldSet(this, _CdpWebWorker_world, new IsolatedWorld(this, new TimeoutSettings()), "f");
        __classPrivateFieldGet(this, _CdpWebWorker_client, "f").once('Runtime.executionContextCreated', async (event) => {
            __classPrivateFieldGet(this, _CdpWebWorker_world, "f").setContext(new ExecutionContext(client, event.context, __classPrivateFieldGet(this, _CdpWebWorker_world, "f")));
        });
        __classPrivateFieldGet(this, _CdpWebWorker_world, "f").emitter.on('consoleapicalled', async (event) => {
            try {
                return consoleAPICalled(event.type, event.args.map((object) => {
                    return new CdpJSHandle(__classPrivateFieldGet(this, _CdpWebWorker_world, "f"), object);
                }), event.stackTrace);
            }
            catch (err) {
                debugError(err);
            }
        });
        __classPrivateFieldGet(this, _CdpWebWorker_client, "f").on('Runtime.exceptionThrown', exceptionThrown);
        __classPrivateFieldGet(this, _CdpWebWorker_client, "f").once(CDPSessionEvent.Disconnected, () => {
            __classPrivateFieldGet(this, _CdpWebWorker_world, "f").dispose();
        });
        // This might fail if the target is closed before we receive all execution contexts.
        networkManager?.addClient(__classPrivateFieldGet(this, _CdpWebWorker_client, "f")).catch(debugError);
        __classPrivateFieldGet(this, _CdpWebWorker_client, "f").send('Runtime.enable').catch(debugError);
    }
    mainRealm() {
        return __classPrivateFieldGet(this, _CdpWebWorker_world, "f");
    }
    get client() {
        return __classPrivateFieldGet(this, _CdpWebWorker_client, "f");
    }
    async close() {
        switch (__classPrivateFieldGet(this, _CdpWebWorker_targetType, "f")) {
            case TargetType.SERVICE_WORKER:
            case TargetType.SHARED_WORKER: {
                // For service and shared workers we need to close the target and detach to allow
                // the worker to stop.
                await this.client.connection()?.send('Target.closeTarget', {
                    targetId: __classPrivateFieldGet(this, _CdpWebWorker_id, "f"),
                });
                await this.client.connection()?.send('Target.detachFromTarget', {
                    sessionId: this.client.id(),
                });
                break;
            }
            default:
                await this.evaluate(() => {
                    self.close();
                });
        }
    }
}
_CdpWebWorker_world = new WeakMap(), _CdpWebWorker_client = new WeakMap(), _CdpWebWorker_id = new WeakMap(), _CdpWebWorker_targetType = new WeakMap();
//# sourceMappingURL=WebWorker.js.map