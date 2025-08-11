"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdpWebWorker = void 0;
const CDPSession_js_1 = require("../api/CDPSession.js");
const Target_js_1 = require("../api/Target.js");
const WebWorker_js_1 = require("../api/WebWorker.js");
const TimeoutSettings_js_1 = require("../common/TimeoutSettings.js");
const util_js_1 = require("../common/util.js");
const ExecutionContext_js_1 = require("./ExecutionContext.js");
const IsolatedWorld_js_1 = require("./IsolatedWorld.js");
const JSHandle_js_1 = require("./JSHandle.js");
/**
 * @internal
 */
class CdpWebWorker extends WebWorker_js_1.WebWorker {
    constructor(client, url, targetId, targetType, consoleAPICalled, exceptionThrown, networkManager) {
        super(url);
        _CdpWebWorker_world.set(this, void 0);
        _CdpWebWorker_client.set(this, void 0);
        _CdpWebWorker_id.set(this, void 0);
        _CdpWebWorker_targetType.set(this, void 0);
        __classPrivateFieldSet(this, _CdpWebWorker_id, targetId, "f");
        __classPrivateFieldSet(this, _CdpWebWorker_client, client, "f");
        __classPrivateFieldSet(this, _CdpWebWorker_targetType, targetType, "f");
        __classPrivateFieldSet(this, _CdpWebWorker_world, new IsolatedWorld_js_1.IsolatedWorld(this, new TimeoutSettings_js_1.TimeoutSettings()), "f");
        __classPrivateFieldGet(this, _CdpWebWorker_client, "f").once('Runtime.executionContextCreated', async (event) => {
            __classPrivateFieldGet(this, _CdpWebWorker_world, "f").setContext(new ExecutionContext_js_1.ExecutionContext(client, event.context, __classPrivateFieldGet(this, _CdpWebWorker_world, "f")));
        });
        __classPrivateFieldGet(this, _CdpWebWorker_world, "f").emitter.on('consoleapicalled', async (event) => {
            try {
                return consoleAPICalled(event.type, event.args.map((object) => {
                    return new JSHandle_js_1.CdpJSHandle(__classPrivateFieldGet(this, _CdpWebWorker_world, "f"), object);
                }), event.stackTrace);
            }
            catch (err) {
                (0, util_js_1.debugError)(err);
            }
        });
        __classPrivateFieldGet(this, _CdpWebWorker_client, "f").on('Runtime.exceptionThrown', exceptionThrown);
        __classPrivateFieldGet(this, _CdpWebWorker_client, "f").once(CDPSession_js_1.CDPSessionEvent.Disconnected, () => {
            __classPrivateFieldGet(this, _CdpWebWorker_world, "f").dispose();
        });
        // This might fail if the target is closed before we receive all execution contexts.
        networkManager?.addClient(__classPrivateFieldGet(this, _CdpWebWorker_client, "f")).catch(util_js_1.debugError);
        __classPrivateFieldGet(this, _CdpWebWorker_client, "f").send('Runtime.enable').catch(util_js_1.debugError);
    }
    mainRealm() {
        return __classPrivateFieldGet(this, _CdpWebWorker_world, "f");
    }
    get client() {
        return __classPrivateFieldGet(this, _CdpWebWorker_client, "f");
    }
    async close() {
        switch (__classPrivateFieldGet(this, _CdpWebWorker_targetType, "f")) {
            case Target_js_1.TargetType.SERVICE_WORKER:
            case Target_js_1.TargetType.SHARED_WORKER: {
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
exports.CdpWebWorker = CdpWebWorker;
//# sourceMappingURL=WebWorker.js.map