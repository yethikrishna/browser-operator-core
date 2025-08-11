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
var __classPrivateFieldIn = (this && this.__classPrivateFieldIn) || function(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
};
var _EmulatedState_state, _EmulatedState_clientProvider, _EmulatedState_updater;
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function")
        throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn)
            context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
            context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done)
            throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0)
                continue;
            if (result === null || typeof result !== "object")
                throw new TypeError("Object expected");
            if (_ = accept(result.get))
                descriptor.get = _;
            if (_ = accept(result.set))
                descriptor.set = _;
            if (_ = accept(result.init))
                initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field")
                initializers.unshift(_);
            else
                descriptor[key] = _;
        }
    }
    if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol")
        name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { CDPSessionEvent } from '../api/CDPSession.js';
import { debugError } from '../common/util.js';
import { assert } from '../util/assert.js';
import { invokeAtMostOnceForArguments } from '../util/decorators.js';
import { isErrorLike } from '../util/ErrorLike.js';
/**
 * @internal
 */
export class EmulatedState {
    constructor(initialState, clientProvider, updater) {
        _EmulatedState_state.set(this, void 0);
        _EmulatedState_clientProvider.set(this, void 0);
        _EmulatedState_updater.set(this, void 0);
        __classPrivateFieldSet(this, _EmulatedState_state, initialState, "f");
        __classPrivateFieldSet(this, _EmulatedState_clientProvider, clientProvider, "f");
        __classPrivateFieldSet(this, _EmulatedState_updater, updater, "f");
        __classPrivateFieldGet(this, _EmulatedState_clientProvider, "f").registerState(this);
    }
    async setState(state) {
        __classPrivateFieldSet(this, _EmulatedState_state, state, "f");
        await this.sync();
    }
    get state() {
        return __classPrivateFieldGet(this, _EmulatedState_state, "f");
    }
    async sync() {
        await Promise.all(__classPrivateFieldGet(this, _EmulatedState_clientProvider, "f").clients().map(client => {
            return __classPrivateFieldGet(this, _EmulatedState_updater, "f").call(this, client, __classPrivateFieldGet(this, _EmulatedState_state, "f"));
        }));
    }
}
_EmulatedState_state = new WeakMap(), _EmulatedState_clientProvider = new WeakMap(), _EmulatedState_updater = new WeakMap();
/**
 * @internal
 */
let EmulationManager = (() => {
    var _EmulationManager_instances, _a, _EmulationManager_client, _EmulationManager_emulatingMobile, _EmulationManager_hasTouch, _EmulationManager_states, _EmulationManager_viewportState, _EmulationManager_idleOverridesState, _EmulationManager_timezoneState, _EmulationManager_visionDeficiencyState, _EmulationManager_cpuThrottlingState, _EmulationManager_mediaFeaturesState, _EmulationManager_mediaTypeState, _EmulationManager_geoLocationState, _EmulationManager_defaultBackgroundColorState, _EmulationManager_javascriptEnabledState, _EmulationManager_secondaryClients, _EmulationManager_applyViewport_get, _EmulationManager_emulateIdleState_get, _EmulationManager_emulateTimezone_get, _EmulationManager_emulateVisionDeficiency_get, _EmulationManager_emulateCpuThrottling_get, _EmulationManager_emulateMediaFeatures_get, _EmulationManager_emulateMediaType_get, _EmulationManager_setGeolocation_get, _EmulationManager_setDefaultBackgroundColor_get, _EmulationManager_setJavaScriptEnabled_get;
    let _instanceExtraInitializers = [];
    let _private_applyViewport_decorators;
    let _private_applyViewport_descriptor;
    let _private_emulateIdleState_decorators;
    let _private_emulateIdleState_descriptor;
    let _private_emulateTimezone_decorators;
    let _private_emulateTimezone_descriptor;
    let _private_emulateVisionDeficiency_decorators;
    let _private_emulateVisionDeficiency_descriptor;
    let _private_emulateCpuThrottling_decorators;
    let _private_emulateCpuThrottling_descriptor;
    let _private_emulateMediaFeatures_decorators;
    let _private_emulateMediaFeatures_descriptor;
    let _private_emulateMediaType_decorators;
    let _private_emulateMediaType_descriptor;
    let _private_setGeolocation_decorators;
    let _private_setGeolocation_descriptor;
    let _private_setDefaultBackgroundColor_decorators;
    let _private_setDefaultBackgroundColor_descriptor;
    let _private_setJavaScriptEnabled_decorators;
    let _private_setJavaScriptEnabled_descriptor;
    return _a = class EmulationManager {
            constructor(client) {
                _EmulationManager_instances.add(this);
                _EmulationManager_client.set(this, __runInitializers(this, _instanceExtraInitializers));
                _EmulationManager_emulatingMobile.set(this, false);
                _EmulationManager_hasTouch.set(this, false);
                _EmulationManager_states.set(this, []);
                _EmulationManager_viewportState.set(this, new EmulatedState({
                    active: false,
                }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "a", _EmulationManager_applyViewport_get)));
                _EmulationManager_idleOverridesState.set(this, new EmulatedState({
                    active: false,
                }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "a", _EmulationManager_emulateIdleState_get)));
                _EmulationManager_timezoneState.set(this, new EmulatedState({
                    active: false,
                }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "a", _EmulationManager_emulateTimezone_get)));
                _EmulationManager_visionDeficiencyState.set(this, new EmulatedState({
                    active: false,
                }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "a", _EmulationManager_emulateVisionDeficiency_get)));
                _EmulationManager_cpuThrottlingState.set(this, new EmulatedState({
                    active: false,
                }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "a", _EmulationManager_emulateCpuThrottling_get)));
                _EmulationManager_mediaFeaturesState.set(this, new EmulatedState({
                    active: false,
                }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "a", _EmulationManager_emulateMediaFeatures_get)));
                _EmulationManager_mediaTypeState.set(this, new EmulatedState({
                    active: false,
                }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "a", _EmulationManager_emulateMediaType_get)));
                _EmulationManager_geoLocationState.set(this, new EmulatedState({
                    active: false,
                }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "a", _EmulationManager_setGeolocation_get)));
                _EmulationManager_defaultBackgroundColorState.set(this, new EmulatedState({
                    active: false,
                }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "a", _EmulationManager_setDefaultBackgroundColor_get)));
                _EmulationManager_javascriptEnabledState.set(this, new EmulatedState({
                    javaScriptEnabled: true,
                    active: false,
                }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "a", _EmulationManager_setJavaScriptEnabled_get)));
                _EmulationManager_secondaryClients.set(this, new Set());
                __classPrivateFieldSet(this, _EmulationManager_client, client, "f");
            }
            updateClient(client) {
                __classPrivateFieldSet(this, _EmulationManager_client, client, "f");
                __classPrivateFieldGet(this, _EmulationManager_secondaryClients, "f").delete(client);
            }
            registerState(state) {
                __classPrivateFieldGet(this, _EmulationManager_states, "f").push(state);
            }
            clients() {
                return [__classPrivateFieldGet(this, _EmulationManager_client, "f"), ...Array.from(__classPrivateFieldGet(this, _EmulationManager_secondaryClients, "f"))];
            }
            async registerSpeculativeSession(client) {
                __classPrivateFieldGet(this, _EmulationManager_secondaryClients, "f").add(client);
                client.once(CDPSessionEvent.Disconnected, () => {
                    __classPrivateFieldGet(this, _EmulationManager_secondaryClients, "f").delete(client);
                });
                // We don't await here because we want to register all state changes before
                // the target is unpaused.
                void Promise.all(__classPrivateFieldGet(this, _EmulationManager_states, "f").map(s => {
                    return s.sync().catch(debugError);
                }));
            }
            get javascriptEnabled() {
                return __classPrivateFieldGet(this, _EmulationManager_javascriptEnabledState, "f").state.javaScriptEnabled;
            }
            async emulateViewport(viewport) {
                const currentState = __classPrivateFieldGet(this, _EmulationManager_viewportState, "f").state;
                if (!viewport && !currentState.active) {
                    return false;
                }
                await __classPrivateFieldGet(this, _EmulationManager_viewportState, "f").setState(viewport
                    ? {
                        viewport,
                        active: true,
                    }
                    : {
                        active: false,
                    });
                const mobile = viewport?.isMobile || false;
                const hasTouch = viewport?.hasTouch || false;
                const reloadNeeded = __classPrivateFieldGet(this, _EmulationManager_emulatingMobile, "f") !== mobile || __classPrivateFieldGet(this, _EmulationManager_hasTouch, "f") !== hasTouch;
                __classPrivateFieldSet(this, _EmulationManager_emulatingMobile, mobile, "f");
                __classPrivateFieldSet(this, _EmulationManager_hasTouch, hasTouch, "f");
                return reloadNeeded;
            }
            async emulateIdleState(overrides) {
                await __classPrivateFieldGet(this, _EmulationManager_idleOverridesState, "f").setState({
                    active: true,
                    overrides,
                });
            }
            async emulateTimezone(timezoneId) {
                await __classPrivateFieldGet(this, _EmulationManager_timezoneState, "f").setState({
                    timezoneId,
                    active: true,
                });
            }
            async emulateVisionDeficiency(type) {
                const visionDeficiencies = new Set([
                    'none',
                    'achromatopsia',
                    'blurredVision',
                    'deuteranopia',
                    'protanopia',
                    'reducedContrast',
                    'tritanopia',
                ]);
                assert(!type || visionDeficiencies.has(type), `Unsupported vision deficiency: ${type}`);
                await __classPrivateFieldGet(this, _EmulationManager_visionDeficiencyState, "f").setState({
                    active: true,
                    visionDeficiency: type,
                });
            }
            async emulateCPUThrottling(factor) {
                assert(factor === null || factor >= 1, 'Throttling rate should be greater or equal to 1');
                await __classPrivateFieldGet(this, _EmulationManager_cpuThrottlingState, "f").setState({
                    active: true,
                    factor: factor ?? undefined,
                });
            }
            async emulateMediaFeatures(features) {
                if (Array.isArray(features)) {
                    for (const mediaFeature of features) {
                        const name = mediaFeature.name;
                        assert(/^(?:prefers-(?:color-scheme|reduced-motion)|color-gamut)$/.test(name), 'Unsupported media feature: ' + name);
                    }
                }
                await __classPrivateFieldGet(this, _EmulationManager_mediaFeaturesState, "f").setState({
                    active: true,
                    mediaFeatures: features,
                });
            }
            async emulateMediaType(type) {
                assert(type === 'screen' ||
                    type === 'print' ||
                    (type ?? undefined) === undefined, 'Unsupported media type: ' + type);
                await __classPrivateFieldGet(this, _EmulationManager_mediaTypeState, "f").setState({
                    type,
                    active: true,
                });
            }
            async setGeolocation(options) {
                const { longitude, latitude, accuracy = 0 } = options;
                if (longitude < -180 || longitude > 180) {
                    throw new Error(`Invalid longitude "${longitude}": precondition -180 <= LONGITUDE <= 180 failed.`);
                }
                if (latitude < -90 || latitude > 90) {
                    throw new Error(`Invalid latitude "${latitude}": precondition -90 <= LATITUDE <= 90 failed.`);
                }
                if (accuracy < 0) {
                    throw new Error(`Invalid accuracy "${accuracy}": precondition 0 <= ACCURACY failed.`);
                }
                await __classPrivateFieldGet(this, _EmulationManager_geoLocationState, "f").setState({
                    active: true,
                    geoLocation: {
                        longitude,
                        latitude,
                        accuracy,
                    },
                });
            }
            /**
             * Resets default white background
             */
            async resetDefaultBackgroundColor() {
                await __classPrivateFieldGet(this, _EmulationManager_defaultBackgroundColorState, "f").setState({
                    active: true,
                    color: undefined,
                });
            }
            /**
             * Hides default white background
             */
            async setTransparentBackgroundColor() {
                await __classPrivateFieldGet(this, _EmulationManager_defaultBackgroundColorState, "f").setState({
                    active: true,
                    color: { r: 0, g: 0, b: 0, a: 0 },
                });
            }
            async setJavaScriptEnabled(enabled) {
                await __classPrivateFieldGet(this, _EmulationManager_javascriptEnabledState, "f").setState({
                    active: true,
                    javaScriptEnabled: enabled,
                });
            }
        },
        _EmulationManager_client = new WeakMap(),
        _EmulationManager_emulatingMobile = new WeakMap(),
        _EmulationManager_hasTouch = new WeakMap(),
        _EmulationManager_states = new WeakMap(),
        _EmulationManager_viewportState = new WeakMap(),
        _EmulationManager_idleOverridesState = new WeakMap(),
        _EmulationManager_timezoneState = new WeakMap(),
        _EmulationManager_visionDeficiencyState = new WeakMap(),
        _EmulationManager_cpuThrottlingState = new WeakMap(),
        _EmulationManager_mediaFeaturesState = new WeakMap(),
        _EmulationManager_mediaTypeState = new WeakMap(),
        _EmulationManager_geoLocationState = new WeakMap(),
        _EmulationManager_defaultBackgroundColorState = new WeakMap(),
        _EmulationManager_javascriptEnabledState = new WeakMap(),
        _EmulationManager_secondaryClients = new WeakMap(),
        _EmulationManager_instances = new WeakSet(),
        _EmulationManager_applyViewport_get = function _EmulationManager_applyViewport_get() { return _private_applyViewport_descriptor.value; },
        _EmulationManager_emulateIdleState_get = function _EmulationManager_emulateIdleState_get() { return _private_emulateIdleState_descriptor.value; },
        _EmulationManager_emulateTimezone_get = function _EmulationManager_emulateTimezone_get() { return _private_emulateTimezone_descriptor.value; },
        _EmulationManager_emulateVisionDeficiency_get = function _EmulationManager_emulateVisionDeficiency_get() { return _private_emulateVisionDeficiency_descriptor.value; },
        _EmulationManager_emulateCpuThrottling_get = function _EmulationManager_emulateCpuThrottling_get() { return _private_emulateCpuThrottling_descriptor.value; },
        _EmulationManager_emulateMediaFeatures_get = function _EmulationManager_emulateMediaFeatures_get() { return _private_emulateMediaFeatures_descriptor.value; },
        _EmulationManager_emulateMediaType_get = function _EmulationManager_emulateMediaType_get() { return _private_emulateMediaType_descriptor.value; },
        _EmulationManager_setGeolocation_get = function _EmulationManager_setGeolocation_get() { return _private_setGeolocation_descriptor.value; },
        _EmulationManager_setDefaultBackgroundColor_get = function _EmulationManager_setDefaultBackgroundColor_get() { return _private_setDefaultBackgroundColor_descriptor.value; },
        _EmulationManager_setJavaScriptEnabled_get = function _EmulationManager_setJavaScriptEnabled_get() { return _private_setJavaScriptEnabled_descriptor.value; },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _private_applyViewport_decorators = [invokeAtMostOnceForArguments];
            _private_emulateIdleState_decorators = [invokeAtMostOnceForArguments];
            _private_emulateTimezone_decorators = [invokeAtMostOnceForArguments];
            _private_emulateVisionDeficiency_decorators = [invokeAtMostOnceForArguments];
            _private_emulateCpuThrottling_decorators = [invokeAtMostOnceForArguments];
            _private_emulateMediaFeatures_decorators = [invokeAtMostOnceForArguments];
            _private_emulateMediaType_decorators = [invokeAtMostOnceForArguments];
            _private_setGeolocation_decorators = [invokeAtMostOnceForArguments];
            _private_setDefaultBackgroundColor_decorators = [invokeAtMostOnceForArguments];
            _private_setJavaScriptEnabled_decorators = [invokeAtMostOnceForArguments];
            __esDecorate(_a, _private_applyViewport_descriptor = { value: __setFunctionName(async function (client, viewportState) {
                    if (!viewportState.viewport) {
                        await Promise.all([
                            client.send('Emulation.clearDeviceMetricsOverride'),
                            client.send('Emulation.setTouchEmulationEnabled', {
                                enabled: false,
                            }),
                        ]).catch(debugError);
                        return;
                    }
                    const { viewport } = viewportState;
                    const mobile = viewport.isMobile || false;
                    const width = viewport.width;
                    const height = viewport.height;
                    const deviceScaleFactor = viewport.deviceScaleFactor ?? 1;
                    const screenOrientation = viewport.isLandscape
                        ? { angle: 90, type: 'landscapePrimary' }
                        : { angle: 0, type: 'portraitPrimary' };
                    const hasTouch = viewport.hasTouch || false;
                    await Promise.all([
                        client
                            .send('Emulation.setDeviceMetricsOverride', {
                            mobile,
                            width,
                            height,
                            deviceScaleFactor,
                            screenOrientation,
                        })
                            .catch(err => {
                            if (err.message.includes('Target does not support metrics override')) {
                                debugError(err);
                                return;
                            }
                            throw err;
                        }),
                        client.send('Emulation.setTouchEmulationEnabled', {
                            enabled: hasTouch,
                        }),
                    ]);
                }, "#applyViewport") }, _private_applyViewport_decorators, { kind: "method", name: "#applyViewport", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_EmulationManager_instances, obj), get: obj => __classPrivateFieldGet(obj, _EmulationManager_instances, "a", _EmulationManager_applyViewport_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, _private_emulateIdleState_descriptor = { value: __setFunctionName(async function (client, idleStateState) {
                    if (!idleStateState.active) {
                        return;
                    }
                    if (idleStateState.overrides) {
                        await client.send('Emulation.setIdleOverride', {
                            isUserActive: idleStateState.overrides.isUserActive,
                            isScreenUnlocked: idleStateState.overrides.isScreenUnlocked,
                        });
                    }
                    else {
                        await client.send('Emulation.clearIdleOverride');
                    }
                }, "#emulateIdleState") }, _private_emulateIdleState_decorators, { kind: "method", name: "#emulateIdleState", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_EmulationManager_instances, obj), get: obj => __classPrivateFieldGet(obj, _EmulationManager_instances, "a", _EmulationManager_emulateIdleState_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, _private_emulateTimezone_descriptor = { value: __setFunctionName(async function (client, timezoneState) {
                    if (!timezoneState.active) {
                        return;
                    }
                    try {
                        await client.send('Emulation.setTimezoneOverride', {
                            timezoneId: timezoneState.timezoneId || '',
                        });
                    }
                    catch (error) {
                        if (isErrorLike(error) && error.message.includes('Invalid timezone')) {
                            throw new Error(`Invalid timezone ID: ${timezoneState.timezoneId}`);
                        }
                        throw error;
                    }
                }, "#emulateTimezone") }, _private_emulateTimezone_decorators, { kind: "method", name: "#emulateTimezone", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_EmulationManager_instances, obj), get: obj => __classPrivateFieldGet(obj, _EmulationManager_instances, "a", _EmulationManager_emulateTimezone_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, _private_emulateVisionDeficiency_descriptor = { value: __setFunctionName(async function (client, visionDeficiency) {
                    if (!visionDeficiency.active) {
                        return;
                    }
                    await client.send('Emulation.setEmulatedVisionDeficiency', {
                        type: visionDeficiency.visionDeficiency || 'none',
                    });
                }, "#emulateVisionDeficiency") }, _private_emulateVisionDeficiency_decorators, { kind: "method", name: "#emulateVisionDeficiency", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_EmulationManager_instances, obj), get: obj => __classPrivateFieldGet(obj, _EmulationManager_instances, "a", _EmulationManager_emulateVisionDeficiency_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, _private_emulateCpuThrottling_descriptor = { value: __setFunctionName(async function (client, state) {
                    if (!state.active) {
                        return;
                    }
                    await client.send('Emulation.setCPUThrottlingRate', {
                        rate: state.factor ?? 1,
                    });
                }, "#emulateCpuThrottling") }, _private_emulateCpuThrottling_decorators, { kind: "method", name: "#emulateCpuThrottling", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_EmulationManager_instances, obj), get: obj => __classPrivateFieldGet(obj, _EmulationManager_instances, "a", _EmulationManager_emulateCpuThrottling_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, _private_emulateMediaFeatures_descriptor = { value: __setFunctionName(async function (client, state) {
                    if (!state.active) {
                        return;
                    }
                    await client.send('Emulation.setEmulatedMedia', {
                        features: state.mediaFeatures,
                    });
                }, "#emulateMediaFeatures") }, _private_emulateMediaFeatures_decorators, { kind: "method", name: "#emulateMediaFeatures", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_EmulationManager_instances, obj), get: obj => __classPrivateFieldGet(obj, _EmulationManager_instances, "a", _EmulationManager_emulateMediaFeatures_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, _private_emulateMediaType_descriptor = { value: __setFunctionName(async function (client, state) {
                    if (!state.active) {
                        return;
                    }
                    await client.send('Emulation.setEmulatedMedia', {
                        media: state.type || '',
                    });
                }, "#emulateMediaType") }, _private_emulateMediaType_decorators, { kind: "method", name: "#emulateMediaType", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_EmulationManager_instances, obj), get: obj => __classPrivateFieldGet(obj, _EmulationManager_instances, "a", _EmulationManager_emulateMediaType_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, _private_setGeolocation_descriptor = { value: __setFunctionName(async function (client, state) {
                    if (!state.active) {
                        return;
                    }
                    await client.send('Emulation.setGeolocationOverride', state.geoLocation
                        ? {
                            longitude: state.geoLocation.longitude,
                            latitude: state.geoLocation.latitude,
                            accuracy: state.geoLocation.accuracy,
                        }
                        : undefined);
                }, "#setGeolocation") }, _private_setGeolocation_decorators, { kind: "method", name: "#setGeolocation", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_EmulationManager_instances, obj), get: obj => __classPrivateFieldGet(obj, _EmulationManager_instances, "a", _EmulationManager_setGeolocation_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, _private_setDefaultBackgroundColor_descriptor = { value: __setFunctionName(async function (client, state) {
                    if (!state.active) {
                        return;
                    }
                    await client.send('Emulation.setDefaultBackgroundColorOverride', {
                        color: state.color,
                    });
                }, "#setDefaultBackgroundColor") }, _private_setDefaultBackgroundColor_decorators, { kind: "method", name: "#setDefaultBackgroundColor", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_EmulationManager_instances, obj), get: obj => __classPrivateFieldGet(obj, _EmulationManager_instances, "a", _EmulationManager_setDefaultBackgroundColor_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, _private_setJavaScriptEnabled_descriptor = { value: __setFunctionName(async function (client, state) {
                    if (!state.active) {
                        return;
                    }
                    await client.send('Emulation.setScriptExecutionDisabled', {
                        value: !state.javaScriptEnabled,
                    });
                }, "#setJavaScriptEnabled") }, _private_setJavaScriptEnabled_decorators, { kind: "method", name: "#setJavaScriptEnabled", static: false, private: true, access: { has: obj => __classPrivateFieldIn(_EmulationManager_instances, obj), get: obj => __classPrivateFieldGet(obj, _EmulationManager_instances, "a", _EmulationManager_setJavaScriptEnabled_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata)
                Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { EmulationManager };
//# sourceMappingURL=EmulationManager.js.map
//# sourceMappingURL=EmulationManager.js.map