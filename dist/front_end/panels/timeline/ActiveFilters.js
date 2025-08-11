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
var _ActiveFilters_activeFilters;
let instance = null;
/** Singleton class that contains the set of active filters for the given trace
 * file.
 */
export class ActiveFilters {
    constructor() {
        _ActiveFilters_activeFilters.set(this, []);
    }
    static instance(opts = { forceNew: null }) {
        const forceNew = Boolean(opts.forceNew);
        if (!instance || forceNew) {
            instance = new ActiveFilters();
        }
        return instance;
    }
    static removeInstance() {
        instance = null;
    }
    activeFilters() {
        return __classPrivateFieldGet(this, _ActiveFilters_activeFilters, "f");
    }
    setFilters(newFilters) {
        __classPrivateFieldSet(this, _ActiveFilters_activeFilters, newFilters, "f");
    }
    isVisible(event) {
        return __classPrivateFieldGet(this, _ActiveFilters_activeFilters, "f").every(f => f.accept(event));
    }
}
_ActiveFilters_activeFilters = new WeakMap();
//# sourceMappingURL=ActiveFilters.js.map