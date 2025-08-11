var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Tracker_freshRecordings;
let instance = null;
/**
 * In multiple places we need to know if the trace we are working on is fresh
 * or not. We cannot store that data in the trace file's metadata (otherwise a
 * loaded trace file could claim to be fresh), so we store it here. When a new trace
 * is loaded, we set this flag accordingly.
 **/
export class Tracker {
    constructor() {
        _Tracker_freshRecordings.set(this, new WeakSet());
    }
    static instance(opts = { forceNew: false }) {
        if (!instance || opts.forceNew) {
            instance = new Tracker();
        }
        return instance;
    }
    registerFreshRecording(data) {
        __classPrivateFieldGet(this, _Tracker_freshRecordings, "f").add(data);
    }
    recordingIsFresh(data) {
        return __classPrivateFieldGet(this, _Tracker_freshRecordings, "f").has(data);
    }
}
_Tracker_freshRecordings = new WeakMap();
//# sourceMappingURL=FreshRecording.js.map